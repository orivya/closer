import { z } from 'zod'

/**
 * Profile validation schema
 */
export const profileSchema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long').trim(),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  bio: z.string().max(2000, 'Bio too long').trim().optional().nullable(),
  tagline: z.string().max(150, 'Tagline too long').trim().optional().nullable(),
  avatar_url: z.string().url('Invalid URL').optional().nullable(),
  banner_url: z.string().url('Invalid URL').optional().nullable(),
  email: z.string().email('Invalid email'),
  location: z.string().max(100).trim().optional().nullable(),
  website: z.string().url('Invalid URL').optional().nullable(),
  years_experience: z.number().int().min(0).max(100).optional().nullable(),
})

/**
 * Service validation schema
 */
export const serviceSchema = z.object({
  name: z.string().min(3, 'Service name must be at least 3 characters').max(100, 'Name too long').trim(),
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().max(5000, 'Description too long').trim(),
  base_price: z.number().positive('Price must be positive').max(100000, 'Price too high'),
  turnaround_days: z.number().int().positive('Must be at least 1 day').max(365, 'Maximum 365 days'),
  revision_count: z.number().int().nonnegative('Must be 0 or more').max(50, 'Maximum 50 revisions'),
  extra_revision_price: z.number().nonnegative('Must be 0 or more'),
  features: z.array(z.string().max(200)).max(20, 'Maximum 20 features'),
  delivery_formats: z.array(z.string().max(50)).max(10, 'Maximum 10 formats').optional().default([]),
  requirements: z.string().max(2000, 'Requirements too long').trim().optional().nullable(),
  terms_conditions: z.string().max(5000, 'Terms too long').trim().optional().nullable(),
  is_active: z.boolean().optional().default(true),
})

/**
 * Product validation schema
 */
export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters').max(100, 'Name too long').trim(),
  description: z.string().max(5000, 'Description too long').trim(),
  price: z.number().positive('Price must be positive').max(10000, 'Price too high'),
  file_url: z.string().max(500),
  preview_url: z.string().url('Invalid URL').optional().nullable(),
  category: z.enum(['sample-pack', 'preset', 'template', 'stems', 'midi', 'other']),
  tags: z.array(z.string().max(50)).max(10, 'Maximum 10 tags').optional().default([]),
  is_active: z.boolean().optional().default(true),
})

/**
 * Inquiry/contact form validation schema
 */
export const inquirySchema = z.object({
  recipient_id: z.string().uuid('Invalid recipient'),
  sender_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long').trim(),
  sender_email: z.string().email('Invalid email'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject too long').trim(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message too long').trim(),
  service_id: z.string().uuid('Invalid service').optional().nullable(),
})

/**
 * Message validation schema
 */
export const messageSchema = z.object({
  thread_id: z.string().uuid('Invalid thread'),
  recipient_id: z.string().uuid('Invalid recipient'),
  content: z.string().min(1, 'Message cannot be empty').max(10000, 'Message too long').trim(),
  subject: z.string().max(200, 'Subject too long').trim().optional().nullable(),
  order_id: z.string().uuid('Invalid order').optional().nullable(),
})

/**
 * Order validation schema
 */
export const orderSchema = z.object({
  service_id: z.string().uuid('Invalid service'),
  client_email: z.string().email('Invalid email'),
  client_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long').trim(),
  notes: z.string().max(2000, 'Notes too long').trim().optional().nullable(),
  requirements: z.string().max(5000, 'Requirements too long').trim().optional().nullable(),
  turnaround_option_id: z.string().uuid('Invalid turnaround option').optional(),
  addon_ids: z.array(z.string().uuid()).max(20).optional().default([]),
})

/**
 * Review/testimonial validation schema
 */
export const reviewSchema = z.object({
  order_id: z.string().uuid('Invalid order'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  content: z.string().min(10, 'Review must be at least 10 characters').max(2000, 'Review too long').trim(),
})

/**
 * Portfolio item validation schema
 */
export const portfolioItemSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title too long').trim(),
  description: z.string().max(1000, 'Description too long').trim().optional().nullable(),
  audio_url: z.string().url('Invalid URL').optional().nullable(),
  image_url: z.string().url('Invalid URL').optional().nullable(),
  category: z.string().max(50).optional().nullable(),
  tags: z.array(z.string().max(50)).max(10).optional().default([]),
  is_featured: z.boolean().optional().default(false),
})

/**
 * Social link validation schema
 */
export const socialLinkSchema = z.object({
  platform: z.enum(['website', 'instagram', 'twitter', 'youtube', 'soundcloud', 'spotify', 'linkedin', 'other']),
  url: z.string().url('Invalid URL').max(500),
  label: z.string().max(50).trim().optional(),
})

/**
 * Helper to validate and return typed data or throw
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

/**
 * Helper to validate and return result object (for API routes)
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}
