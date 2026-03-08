
-- Create storage bucket for doctor documents
INSERT INTO storage.buckets (id, name, public) VALUES ('doctor-documents', 'doctor-documents', true);

-- Allow anyone to upload to doctor-documents bucket
CREATE POLICY "Anyone can upload doctor documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'doctor-documents');

-- Allow anyone to read doctor documents
CREATE POLICY "Anyone can read doctor documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'doctor-documents');

-- Add document URL columns to doctor_applications
ALTER TABLE public.doctor_applications
ADD COLUMN dci_certificate_url text NOT NULL DEFAULT '',
ADD COLUMN id_proof_url text NOT NULL DEFAULT '';
