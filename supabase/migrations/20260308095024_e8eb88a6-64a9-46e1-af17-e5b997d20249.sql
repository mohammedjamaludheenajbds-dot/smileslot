
CREATE TABLE public.clinic_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dentist_id TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  treatment TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  video_url TEXT,
  youtube_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.clinic_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read clinic reviews" ON public.clinic_reviews
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert clinic reviews" ON public.clinic_reviews
  FOR INSERT WITH CHECK (true);
