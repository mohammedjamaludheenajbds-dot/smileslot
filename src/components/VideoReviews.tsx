import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Video, Plus, Trash2 } from "lucide-react";
import { useReviewStore } from "@/stores/reviewStore";
import { useLanguageStore } from "@/stores/languageStore";
import { toast } from "sonner";
import { motion } from "framer-motion";

const VideoReviews = () => {
  const { reviews, addReview, removeReview } = useReviewStore();
  const { t } = useLanguageStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ youtubeUrl: "", reviewerName: "", treatment: "" });

  const handleSubmit = () => {
    if (!form.youtubeUrl || !form.reviewerName) { toast.error("Please fill in all fields"); return; }
    addReview(form);
    toast.success("Video review submitted!");
    setForm({ youtubeUrl: "", reviewerName: "", treatment: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" /> {t("reviews.title")}
        </h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
          <Plus className="h-4 w-4" /> {t("reviews.addReview")}
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border p-4 space-y-3 bg-secondary/30">
          <div><Label>{t("reviews.youtubeUrl")}</Label><Input value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>{t("reviews.reviewerName")}</Label><Input value={form.reviewerName} onChange={(e) => setForm({ ...form, reviewerName: e.target.value })} placeholder="Your name" /></div>
            <div><Label>{t("reviews.treatment")}</Label><Input value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} placeholder="e.g., Root Canal" /></div>
          </div>
          <Button onClick={handleSubmit} className="w-full">{t("reviews.submit")}</Button>
        </motion.div>
      )}

      {reviews.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Video className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 font-display font-semibold text-foreground">{t("reviews.noReviews")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("reviews.noReviewsDesc")}</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {reviews.map((review) => (
            <motion.div key={review.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border overflow-hidden">
              {review.youtubeId && (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${review.youtubeId}`}
                    title={`Review by ${review.reviewerName}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{review.reviewerName}</p>
                  {review.treatment && <p className="text-xs text-muted-foreground">{review.treatment}</p>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => { removeReview(review.id); toast.success("Review removed"); }} className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoReviews;
