
CREATE TABLE public.visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  page text NOT NULL DEFAULT '/',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visitors" ON public.visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read visitors" ON public.visitors FOR SELECT USING (true);
