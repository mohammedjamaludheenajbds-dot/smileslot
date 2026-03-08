import { create } from "zustand";

export interface VideoReview {
  id: string;
  youtubeUrl: string;
  youtubeId: string;
  reviewerName: string;
  treatment: string;
  createdAt: string;
}

interface ReviewStore {
  reviews: VideoReview[];
  addReview: (review: Omit<VideoReview, "id" | "youtubeId" | "createdAt">) => void;
  removeReview: (id: string) => void;
}

const STORAGE_KEY = "dental_video_reviews";

const extractYoutubeId = (url: string): string => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
  return match?.[1] || "";
};

const load = (): VideoReview[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
};

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviews: load(),
  addReview: (review) => {
    const newReview: VideoReview = {
      ...review,
      id: crypto.randomUUID(),
      youtubeId: extractYoutubeId(review.youtubeUrl),
      createdAt: new Date().toISOString(),
    };
    const updated = [...get().reviews, newReview];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ reviews: updated });
  },
  removeReview: (id) => {
    const updated = get().reviews.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ reviews: updated });
  },
}));
