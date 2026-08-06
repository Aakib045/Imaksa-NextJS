import { NextResponse } from 'next/server'

const rateLimit = new Map()

export function middleware(request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const path = request.nextUrl.pathname

  // Only rate limit API routes
  if (!path.startsWith('/api/')) {
    return NextResponse.next()
  }

  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute window
  const maxRequests = 100 // max 100 requests per minute per IP

  const key = ip
  const record = rateLimit.get(key) || { count: 0, resetAt: now + windowMs }

  if (now > record.resetAt) {
    record.count = 0
    record.resetAt = now + windowMs
  }

  record.count++
  rateLimit.set(key, record)

  // Clean up old entries periodically to prevent memory leak
  if (rateLimit.size > 10000) {
    for (const [k, v] of rateLimit.entries()) {
      if (now > v.resetAt) rateLimit.delete(k)
    }
  }

  if (record.count > maxRequests) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please slow down.' },
      { status: 429 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
