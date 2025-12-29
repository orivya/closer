-- ============================================================================
-- Remove legacy 'audio' bucket (replaced by portfolio-audio, product-previews, order-files)
-- ============================================================================

DELETE FROM storage.buckets WHERE id = 'audio';
