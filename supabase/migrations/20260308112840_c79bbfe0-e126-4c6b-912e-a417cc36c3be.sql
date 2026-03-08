
CREATE TABLE public.clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_name text NOT NULL,
  qualification text NOT NULL DEFAULT '',
  clinic_name text NOT NULL,
  specialization text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  area text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  experience integer NOT NULL DEFAULT 0,
  about text NOT NULL DEFAULT '',
  achievements text NOT NULL DEFAULT '',
  treatments text NOT NULL DEFAULT '',
  emi_available boolean NOT NULL DEFAULT false,
  google_maps_url text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  doctor_phone text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert clinics"
ON public.clinics FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read clinics"
ON public.clinics FOR SELECT
USING (true);

CREATE POLICY "Anyone can update clinics"
ON public.clinics FOR UPDATE
USING (true)
WITH CHECK (true);
