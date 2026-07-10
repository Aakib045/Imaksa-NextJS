'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Buy', href: '/properties?type=buy' },
  { label: 'Rent', href: '/properties?type=rent' },
  { label: 'Sell', href: '/sell' },
  { label: 'Off-Plan', href: '/properties?type=offplan' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

function NavInner() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isScrolled = scrolled

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    const [hrefPath, hrefQuery] = href.split('?')
    if (pathname !== hrefPath) return false
    if (!hrefQuery) return true
    return new URLSearchParams(hrefQuery).get('type') === searchParams.get('type')
  }

  return (
    <>
      <style>{`
        @media (max-width: 899px) {
          .nav-links-desktop { display: none !important; }
          .nav-cta-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 900px) {
          .nav-hamburger { display: none !important; }
        }
      `}</style>

      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
          background: isScrolled
            ? 'rgba(250,250,248,.97)'
            : 'linear-gradient(to bottom,rgba(0,0,0,.4),transparent)',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(13,79,74,.12)' : 'none',
          boxShadow: isScrolled ? '0 2px 24px rgba(0,0,0,.07)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 clamp(16px,3vw,48px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 72,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: 'clamp(16px,2.5vw,22px)',
              fontWeight: 400,
              color: isScrolled ? '#0D4F4A' : '#F5EFE4',
              letterSpacing: 'clamp(2px,1vw,4px)',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              flexShrink: 0,
            }}
          >
            IMAKSA
          </Link>

          {/* Nav Links — desktop only */}
          <div
            className="nav-links-desktop"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {navLinks.map(({ label, href }) => {
              const active = isActive(href)
              const hovered = hoveredLink === href
              const color = active
                ? '#C9A84C'
                : hovered
                ? (isScrolled ? '#0D4F4A' : '#F5EFE4')
                : (isScrolled ? '#6B6B60' : 'rgba(255,255,255,.65)')
              const borderColor = (active || hovered) ? '#C9A84C' : 'transparent'

              return (
                <Link
                  key={href}
                  href={href}
                  onMouseEnter={() => setHoveredLink(href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={{
                    color,
                    fontSize: 'clamp(9px,1vw,11px)',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    padding: '8px 12px',
                    borderBottom: `2px solid ${borderColor}`,
                    textDecoration: 'none',
                    display: 'inline-block',
                    transition: 'color 0.2s ease, border-bottom-color 0.2s ease',
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          {/* CTA — desktop only */}
          <Link
            href="/contact"
            className="nav-cta-desktop"
            style={{
              background: isScrolled ? '#0D4F4A' : 'rgba(255,255,255,.15)',
              border: `1px solid ${isScrolled ? '#0D4F4A' : 'rgba(255,255,255,.4)'}`,
              color: isScrolled ? '#F5EFE4' : '#fff',
              fontSize: 'clamp(9px,1vw,10px)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: 'clamp(8px,1.2vw,11px) clamp(14px,2vw,24px)',
              backdropFilter: isScrolled ? 'none' : 'blur(8px)',
              WebkitBackdropFilter: isScrolled ? 'none' : 'blur(8px)',
              textDecoration: 'none',
              transition: 'background 0.3s ease, border-color 0.3s ease, color 0.3s ease',
              display: 'inline-block',
              flexShrink: 0,
            }}
          >
            ENQUIRE
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'none',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              padding: 4,
            }}
          >
            {[0, 1, 2].map(i => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: 22,
                  height: 1.5,
                  background: isScrolled ? '#0D4F4A' : '#fff',
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 49,
            background: '#0D4F4A',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 36,
          }}
        >
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: 'var(--font-fraunces)',
                fontSize: 'clamp(22px,6vw,44px)',
                fontWeight: 300,
                color: isActive(href) ? '#C9A84C' : '#F5EFE4',
                letterSpacing: '3px',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavInner />
    </Suspense>
  )
}
