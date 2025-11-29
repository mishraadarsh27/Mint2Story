-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create assets table for storing IP assets
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10, 4) NOT NULL,
  image_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  licenses_sold INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create licenses table for tracking purchases
CREATE TABLE IF NOT EXISTS public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL,
  buyer_wallet TEXT,
  price_paid DECIMAL(10, 4) NOT NULL,
  transaction_hash TEXT,
  purchased_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- Assets policies
CREATE POLICY "Anyone can view assets"
  ON public.assets FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own assets"
  ON public.assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets"
  ON public.assets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets"
  ON public.assets FOR DELETE
  USING (auth.uid() = user_id);

-- Licenses policies
CREATE POLICY "Users can view their own licenses"
  ON public.licenses FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Users can purchase licenses"
  ON public.licenses FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Create function to increment license count
CREATE OR REPLACE FUNCTION public.increment_license_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.assets
  SET licenses_sold = licenses_sold + 1,
      updated_at = now()
  WHERE id = NEW.asset_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update license count
CREATE TRIGGER on_license_purchase
  AFTER INSERT ON public.licenses
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_license_count();

-- Update timestamp trigger for assets
CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();