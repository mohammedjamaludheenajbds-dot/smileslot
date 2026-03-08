
-- Create payments table to track payment submissions
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  screenshot_url TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 7,
  status TEXT NOT NULL DEFAULT 'approved',
  device_id TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert payments
CREATE POLICY "Anyone can submit payment" ON public.payments FOR INSERT WITH CHECK (true);

-- Allow anyone to read payments (to check own status)
CREATE POLICY "Anyone can read payments" ON public.payments FOR SELECT USING (true);

-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots', 'payment-screenshots', true);

-- Allow anyone to upload to payment-screenshots bucket
CREATE POLICY "Anyone can upload payment screenshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-screenshots');

-- Allow anyone to read payment screenshots
CREATE POLICY "Anyone can read payment screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'payment-screenshots');
