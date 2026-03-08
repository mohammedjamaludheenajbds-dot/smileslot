
CREATE TABLE public.home_consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  sex TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  condition TEXT NOT NULL,
  treatment_required TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.home_consultations ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon + authenticated) to insert
CREATE POLICY "Anyone can submit home consultation requests"
ON public.home_consultations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow authenticated users to read (doctors will use this)
CREATE POLICY "Authenticated users can read home consultations"
ON public.home_consultations
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update status
CREATE POLICY "Authenticated users can update home consultations"
ON public.home_consultations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
