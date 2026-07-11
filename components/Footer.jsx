'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const propertiesLinks = [
  { label: 'For Sale', href: '/properties?type=buy' },
  { label: 'For Rent', href: '/properties?type=rent' },
  { label: 'Sell Property', href: '/sell' },
  { label: 'Off-Plan', href: '/properties?type=offplan' },
]

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
]

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function XSocialIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

const socialDefs = [
  { label: 'LinkedIn', key: 'li', Icon: LinkedInIcon },
  { label: 'Instagram', key: 'ig', Icon: InstagramIcon },
  { label: 'Facebook', key: 'fb', Icon: FacebookIcon },
  { label: 'X (Twitter)', key: 'tw', Icon: XSocialIcon },
]

export default function Footer() {
  const [settings, setSettings] = useState({})

  useEffect(() => {
    fetch('/api/settings', { next: { revalidate: 3600 } })
      .then(r => r.json())
      .then(d => { if (d.success) setSettings(d.settings || {}) })
      .catch(() => {})
  }, [])

  const phone = settings.phone || ''
  const email = settings.email || ''
  const addr = settings.addr || ''

  return (
    <footer className="bg-gradient-to-b from-[#0D4F4A] to-[#082E2B] border-t-2 border-[#C9A84C]">
      <style>{`
        @media (min-width: 900px) {
          .ft-top { grid-template-columns: repeat(4,1fr) !important; }
        }
        @media (max-width: 899px) {
          .ft-top { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 480px) {
          .ft-top { grid-template-columns: 1fr !important; }
          .ft-bottom { flex-direction: column !important; text-align: center !important; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="ft-top grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="font-serif font-bold text-2xl text-white block leading-none">IMAKSA</span>
              <span className="text-[10px] uppercase tracking-widest text-[#C9A84C]">Real Estate LLC</span>
            </div>
            <p className="text-[#F5EFE4]/70 text-sm leading-relaxed mb-5">
              Dubai&apos;s trusted real estate partner. Connecting clients with extraordinary homes and smart investments. RERA Licensed.
            </p>
            <div className="flex gap-3 mb-5">
              {socialDefs.map(({ label, key, Icon }) => {
                const href = settings[key]
                return (
                  <a
                    key={label}
                    href={href || '#'}
                    aria-label={label}
                    target={href ? '_blank' : undefined}
                    rel={href ? 'noopener noreferrer' : undefined}
                    className="w-9 h-9 rounded-full border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0D4F4A] transition-colors duration-200"
                  >
                    <Icon />
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-5">Properties</h3>
            <ul className="space-y-3">
              {propertiesLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-[#F5EFE4]/70 text-sm hover:text-[#C9A84C] transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-5">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-[#F5EFE4]/70 text-sm hover:text-[#C9A84C] transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-5">Contact</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-[#F5EFE4]/70 text-sm">{addr}</span>
              </li>
              <li>
                <a href={`tel:${phone}`} className="text-[#F5EFE4]/70 text-sm hover:text-[#C9A84C] transition-colors duration-200">
                  {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="text-[#F5EFE4]/70 text-sm hover:text-[#C9A84C] transition-colors duration-200">
                  {email}
                </a>
              </li>
              <li>
                <span className="text-[#F5EFE4]/50 text-sm">{settings.hrs || ''}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="ft-bottom border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F5EFE4]/40">
          <span>© 2026 IMAKSA Real Estate LLC. All rights reserved.</span>
          <span>RERA Licensed · Dubai, UAE</span>
        </div>
      </div>
    </footer>
  )
}
