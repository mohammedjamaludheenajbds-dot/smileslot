
CREATE TABLE public.doctor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  clinic_name text NOT NULL,
  specialization text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.doctor_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit doctor application"
ON public.doctor_applications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read doctor applications"
ON public.doctor_applications FOR SELECT
USING (true);

CREATE POLICY "Anyone can update doctor applications"
ON public.doctor_applications FOR UPDATE
USING (true)
WITH CHECK (true);
