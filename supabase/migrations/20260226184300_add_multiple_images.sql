-- Add image_urls column to support multiple images
ALTER TABLE products ADD COLUMN image_urls TEXT[];

-- Migrate existing single images to array format
UPDATE products 
SET image_urls = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND image_url != '';

-- Optional: Keep image_url for backward compatibility or remove it
-- For now, we'll keep it to ensure no breaking changes
