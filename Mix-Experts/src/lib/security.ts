import { NextResponse } from 'next/server'

/**
 * Security utilities for API routes
 */

/**
 * Validate request origin for CSRF protection
 * Returns error response if origin is invalid, null if valid
 */
export function validateOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  // In development, allow localhost
  const isDev = process.env.NODE_ENV === 'development'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || siteUrl

  // Parse allowed origins
  const allowedOrigins = [
    siteUrl,
    appUrl,
    // Remove trailing slashes for comparison
    siteUrl.replace(/\/$/, ''),
    appUrl.replace(/\/$/, ''),
  ]

  if (isDev) {
    allowedOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000')
  }

  // Check origin header first
  if (origin) {
    if (!allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      console.warn(`Invalid origin: ${origin}`)
      return NextResponse.json(
        { error: 'Invalid origin' },
        { status: 403 }
      )
    }
    return null
  }

  // Fall back to referer for same-origin requests without origin header
  if (referer) {
    if (!allowedOrigins.some(allowed => referer.startsWith(allowed))) {
      console.warn(`Invalid referer: ${referer}`)
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      )
    }
    return null
  }

  // No origin or referer - allow for now but log it
  // Some legitimate requests (like server-to-server) may not have these headers
  console.debug('Request without origin/referer headers')
  return null
}

/**
 * Check if request is from a trusted source
 * Less strict than validateOrigin - just returns boolean
 */
export function isTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || siteUrl

  if (origin) {
    return origin.startsWith(siteUrl) || origin.startsWith(appUrl)
  }

  if (referer) {
    return referer.startsWith(siteUrl) || referer.startsWith(appUrl)
  }

  // No origin info - could be server request or curl
  return false
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization', 'credit_card', 'card_number']
  const masked = { ...data }

  for (const key of Object.keys(masked)) {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      masked[key] = '***REDACTED***'
    }
  }

  return masked
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Check for common attack patterns in user input
 * Returns true if suspicious content detected
 */
export function detectSuspiciousContent(content: string): boolean {
  const suspiciousPatterns = [
    // SQL injection
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b.*\b(FROM|INTO|SET|TABLE)\b)/i,
    // XSS script tags
    /<script\b[^>]*>[\s\S]*?<\/script>/i,
    // JavaScript protocol
    /javascript:/i,
    // On-event handlers
    /\bon\w+\s*=/i,
    // Data URI with script
    /data:text\/html/i,
    // Path traversal
    /\.\.\//,
    // Command injection
    /[;&|`$]/,
  ]

  return suspiciousPatterns.some(pattern => pattern.test(content))
}
