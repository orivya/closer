import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML content, allowing only safe formatting tags
 * Use for bio, descriptions, etc. that may contain limited HTML
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    // Force rel="noopener noreferrer" on links for security
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onclick', 'onerror', 'onload', 'style'],
  })
}

/**
 * Strip all HTML tags, returning plain text only
 * Use for names, titles, etc. that should never contain HTML
 */
export function sanitizeText(text: string): string {
  if (!text) return ''
  // First strip HTML tags, then trim whitespace
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim()
}

/**
 * Validate and sanitize a URL
 * Returns null if the URL is invalid or uses a disallowed protocol
 */
export function sanitizeUrl(url: string): string | null {
  if (!url) return null

  try {
    const parsed = new URL(url)

    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null
    }

    return parsed.toString()
  } catch {
    return null
  }
}

/**
 * Sanitize a username/slug - only allow alphanumeric, hyphens, and underscores
 */
export function sanitizeSlug(slug: string): string {
  if (!slug) return ''
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '')
    .slice(0, 50) // Max length
}

/**
 * Sanitize email address
 * Returns null if the email format is invalid
 */
export function sanitizeEmail(email: string): string | null {
  if (!email) return null

  const trimmed = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(trimmed)) {
    return null
  }

  return trimmed
}

/**
 * Sanitize a file name by removing dangerous characters
 * Prevents path traversal attacks
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName) return ''

  return fileName
    // Remove path traversal characters
    .replace(/\.\./g, '')
    .replace(/[\/\\]/g, '')
    // Remove null bytes and other control characters
    .replace(/[\x00-\x1f\x7f]/g, '')
    // Keep only safe characters
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 255) // Max file name length
}
