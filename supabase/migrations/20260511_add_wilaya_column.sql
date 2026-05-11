-- Add wilaya column to orders table
ALTER TABLE public.orders 
ADD COLUMN wilaya TEXT;

-- Add comment
COMMENT ON COLUMN public.orders.wilaya IS 'Algerian wilaya for delivery location';
