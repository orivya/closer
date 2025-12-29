-- Add slug field to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug for faster lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Add comment
COMMENT ON COLUMN products.slug IS 'URL-friendly slug for product (generated from name)';
