import { useState, useEffect } from "react";
import { Camera, Video, Plus, Star, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ClinicReview {
  id: string;
  dentist_id: string;
  reviewer_name: string;
  treatment: string;
  rating: number;
  comment: string;
  photo_url: string | null;
  video_url: string | null;
  youtube_id: string | null;
  created_at: string;
}

const extractYoutubeId = (url: string): string | null => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^?&\s]+)/);
  return match?.[1] || null;
};

const StarInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button key={s} type="button" onClick={() => onChange(s)} className="transition-transform hover:scale-110">
        <Star className={`h-5 w-5 ${s <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
      </button>
    ))}
  </div>
);

const ClinicReviews = ({ dentistId }: { dentistId: string }) => {
  const [reviews, setReviews] = useState<ClinicReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { name } = useAuthStore();

  const [form, setForm] = useState({
    treatment: "",
    rating: 5,
    comment: "",
    photoUrl: "",
    videoUrl: "",
  });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("clinic_reviews")
        .select("*")
        .eq("dentist_id", dentistId)
        .order("created_at", { ascending: false });
      setReviews(data || []);
      setLoading(false);
    };
    fetch();
  }, [dentistId]);

  const handleSubmit = async () => {
    if (!name) { toast.error("Please log in to submit a review"); return; }
    if (!form.comment.trim()) { toast.error("Please write a comment"); return; }

    setSubmitting(true);
    const youtubeId = form.videoUrl ? extractYoutubeId(form.videoUrl) : null;

    const { error } = await supabase.from("clinic_reviews").insert({
      dentist_id: dentistId,
      reviewer_name: name,
      treatment: form.treatment,
      rating: form.rating,
      comment: form.comment,
      photo_url: form.photoUrl || null,
      video_url: form.videoUrl || null,
      youtube_id: youtubeId,
    });

    if (error) {
      toast.error("Failed to submit review");
    } else {
      toast.success("Review submitted!");
      setForm({ treatment: "", rating: 5, comment: "", photoUrl: "", videoUrl: "" });
      setFormOpen(false);
      // Refresh
      const { data } = await supabase
        .from("clinic_reviews")
        .select("*")
        .eq("dentist_id", dentistId)
        .order("created_at", { ascending: false });
      setReviews(data || []);
    }
    setSubmitting(false);
  };

  const photoReviews = reviews.filter((r) => r.photo_url);
  const videoReviews = reviews.filter((r) => r.youtube_id);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground">Patient Reviews</h3>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Submit Your Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <StarInput value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
              </div>
              <div>
                <Label>Treatment</Label>
                <Input value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} placeholder="e.g., Root Canal, Braces" />
              </div>
              <div>
                <Label>Your Review</Label>
                <Textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Share your experience..." rows={3} />
              </div>
              <div>
                <Label className="flex items-center gap-1"><Camera className="h-3.5 w-3.5" /> Photo URL (optional)</Label>
                <Input value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} placeholder="https://example.com/photo.jpg" />
              </div>
              <div>
                <Label className="flex items-center gap-1"><Video className="h-3.5 w-3.5" /> YouTube Video URL (optional)</Label>
                <Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
              </div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="mt-3">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All ({reviews.length})</TabsTrigger>
          <TabsTrigger value="photos" className="gap-1"><Camera className="h-3.5 w-3.5" /> Photos ({photoReviews.length})</TabsTrigger>
          <TabsTrigger value="videos" className="gap-1"><Video className="h-3.5 w-3.5" /> Videos ({videoReviews.length})</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="all">
              {reviews.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <Star className="mx-auto h-10 w-10 text-muted-foreground/30" />
                  <p className="mt-3 font-display font-semibold text-foreground">No reviews yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-3 mt-2">
                  {reviews.map((r) => (
                    <ReviewCard key={r.id} review={r} onImageClick={setSelectedImage} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="photos">
              {photoReviews.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/30" />
                  <p className="mt-3 font-display font-semibold text-foreground">No photo reviews</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {photoReviews.map((r) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border"
                      onClick={() => setSelectedImage(r.photo_url)}
                    >
                      <img src={r.photo_url!} alt={`Review by ${r.reviewer_name}`} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-xs font-medium text-white">{r.reviewer_name}</p>
                        <div className="flex gap-0.5">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos">
              {videoReviews.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <Video className="mx-auto h-10 w-10 text-muted-foreground/30" />
                  <p className="mt-3 font-display font-semibold text-foreground">No video reviews</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 mt-2">
                  {videoReviews.map((r) => (
                    <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border overflow-hidden">
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${r.youtube_id}`}
                          title={`Review by ${r.reviewer_name}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="h-full w-full"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">{r.reviewer_name}</p>
                          <div className="flex gap-0.5">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        {r.treatment && <p className="text-xs text-muted-foreground">{r.treatment}</p>}
                        {r.comment && <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Lightbox */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-2xl p-1">
            <img src={selectedImage} alt="Review photo" className="w-full rounded-lg" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const ReviewCard = ({ review, onImageClick }: { review: ClinicReview; onImageClick: (url: string) => void }) => (
  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border p-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-semibold text-foreground">{review.reviewer_name}</p>
        {review.treatment && <p className="text-xs text-primary">{review.treatment}</p>}
      </div>
      <div className="flex items-center gap-1">
        <div className="flex gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-xs text-muted-foreground ml-1">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
    {review.comment && <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>}
    <div className="mt-2 flex gap-2">
      {review.photo_url && (
        <button onClick={() => onImageClick(review.photo_url!)} className="h-16 w-16 shrink-0 overflow-hidden rounded-md border hover:opacity-80 transition-opacity">
          <img src={review.photo_url} alt="Review" className="h-full w-full object-cover" loading="lazy" />
        </button>
      )}
      {review.youtube_id && (
        <div className="h-16 w-28 shrink-0 overflow-hidden rounded-md border">
          <img src={`https://img.youtube.com/vi/${review.youtube_id}/mqdefault.jpg`} alt="Video thumbnail" className="h-full w-full object-cover" loading="lazy" />
        </div>
      )}
    </div>
  </motion.div>
);

export default ClinicReviews;
