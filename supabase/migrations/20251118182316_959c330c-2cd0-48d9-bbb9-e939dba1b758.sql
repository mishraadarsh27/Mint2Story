-- Fix security issues by setting search_path on functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_license_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.assets
  SET licenses_sold = licenses_sold + 1,
      updated_at = now()
  WHERE id = NEW.asset_id;
  RETURN NEW;
END;
$$;