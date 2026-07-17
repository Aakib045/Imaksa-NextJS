'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const DEFAULT_MAPS =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.398713583536!2d55.32398297607663!3d25.25716957926777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5cda192a2ea7%3A0x71a4bae5fbdac1ea!2sBusiness%20Village!5e0!3m2!1sen!2sin!4v1783084419411!5m2!1sen!2sin'

const FAQS = [
  {
    q: 'Is IMAKSA RERA licensed?',
    a: 'Yes, IMAKSA is fully licensed by the Real Estate Regulatory Authority (RERA) in Dubai. All our agents are RERA certified and operate under Dubai Land Department regulations.',
  },
  {
    q: 'Can I invest in Dubai real estate as a foreigner?',
    a: 'Absolutely. Dubai allows 100% foreign ownership in designated freehold areas. This includes Palm Jumeirah, Downtown Dubai, Dubai Marina, Business Bay, and many more prime locations.',
  },
  {
    q: 'What is the Golden Visa and how do I qualify?',
    a: 'The UAE Golden Visa grants 10-year residency. You qualify by purchasing property worth AED 2 million or more. IMAKSA handles the entire application process for you.',
  },
  {
    q: 'What fees are involved in buying property in Dubai?',
    a: 'Typical costs include 4% DLD transfer fee, 2% agency fee, and AED 4,000 admin fee. We provide full transparency on all costs before you commit to anything.',
  },
  {
    q: 'Do you offer property management services?',
    a: 'Yes. We offer full property management including tenant sourcing, rent collection, maintenance coordination, and annual reporting — so you earn passive income stress-free.',
  },
]

const inputBase = {
  width: '100%',
  background: '#fff',
  border: '1px solid #DDD3C0',
  color: '#0A0A0A',
  padding: 'clamp(13px,1.8vw,16px) clamp(14px,2vw,18px)',
  fontFamily: 'var(--font-inter)',
  fontSize: 'clamp(11px,1.3vw,13px)',
  marginBottom: 'clamp(12px,1.6vw,16px)',
  outline: 'none',
  boxSizing: 'border-box',
  display: 'block',
}

function ContactPageContent() {
  const searchParams = useSearchParams()
  const propertyParam = searchParams.get('property')
  const priceParam = searchParams.get('price')

  const [settings, setSettings] = useState({})
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [interest, setInterest] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')
  const [btnState, setBtnState] = useState('idle')
  const [showSuccess, setShowSuccess] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d.success) setSettings(d.settings || {}) })
      .catch(() => {})
  }, [])

  const handleSubmit = async () => {
    if (!firstName || !email) return
    setBtnState('loading')
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          interest: propertyParam || interest,
          budget: priceParam || budget,
          message,
          source: 'website',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setBtnState('success')
        setShowSuccess(true)
        setFirstName('')
        setLastName('')
        setEmail('')
        setPhone('')
        setInterest('')
        setBudget('')
        setMessage('')
        setTimeout(() => {
          setBtnState('idle')
          setShowSuccess(false)
        }, 5000)
      } else {
        throw new Error()
      }
    } catch {
      setBtnState('error')
      setTimeout(() => setBtnState('idle'), 3000)
    }
  }

  const addr = settings.co && settings.addr
    ? `${settings.co}, ${settings.addr}`
    : settings.addr || ''
  const addrDisplay = (
    <>
      <span style={{fontWeight:600, display:'block', marginBottom:4}}>{settings.co || 'IMAKSA Real Estate LLC'}</span>
      <span style={{color:'rgba(245,239,228,.8)'}}>{settings.addr}</span>
    </>
  )
  const phoneVal = settings.phone || ''
  const emailVal = settings.email || ''
  const hrs = settings.hrs || ''
  const mapsUrl = settings.maps || DEFAULT_MAPS

  const waVal = settings.wa || ''

  const contactItems = [
    { icon: '📍', label: 'OFFICE ADDRESS', value: addrDisplay },
    {
      icon: '📞',
      label: 'PHONE',
      value: <a href={`tel:${phoneVal}`} style={{ color: '#F5EFE4', textDecoration: 'none' }}>{phoneVal}</a>,
    },
    {
      icon: '✉️',
      label: 'EMAIL',
      value: <a href={`mailto:${emailVal}`} style={{ color: '#F5EFE4', textDecoration: 'none' }}>{emailVal}</a>,
    },
    ...(waVal ? [{
      icon: '💬',
      label: 'WHATSAPP',
      value: <a href={`https://wa.me/${waVal}`} target="_blank" rel="noopener noreferrer" style={{ color: '#F5EFE4', textDecoration: 'none' }}>{waVal}</a>,
    }] : []),
    { icon: '🕐', label: 'WORKING HOURS', value: hrs },
  ]

  const socials = [
    { label: 'in', href: settings.li },
    { label: 'ig', href: settings.ig },
    { label: 'wa', href: settings.wa ? `https://wa.me/${settings.wa}` : undefined },
    { label: 'fb', href: settings.fb },
  ]

  const btnBg =
    btnState === 'success' ? '#16a34a' : '#0D4F4A'
  const btnText =
    btnState === 'loading' ? 'Sending...'
    : btnState === 'success' ? '✅ Enquiry Sent!'
    : btnState === 'error' ? 'Try Again'
    : 'Send Enquiry →'

  return (
    <div style={{ fontFamily: 'var(--font-inter)' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{
        background: '#0D4F4A',
        padding: 'clamp(100px,12vw,150px) clamp(16px,5vw,72px) clamp(48px,6vw,80px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=80') center/cover`,
          opacity: 0.1,
          pointerEvents: 'none',
        }} />
        <p style={{
          fontSize: 'clamp(8px,1.3vw,10px)',
          letterSpacing: '5px',
          textTransform: 'uppercase',
          color: 'rgba(245,239,228,.6)',
          marginBottom: '16px',
          position: 'relative',
          margin: '0 0 16px',
        }}>
          {`We'd Love to Hear From You`}
        </p>
        <h1 style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: 'clamp(32px,5vw,68px)',
          fontWeight: 300,
          color: '#F5EFE4',
          position: 'relative',
          margin: 0,
          lineHeight: 1.1,
        }}>
          Get in <em style={{ fontStyle: 'italic' }}>Touch</em>
        </h1>
      </div>

      {/* ── CONTACT SECTION ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          minHeight: '70vh',
        }}
        className="contact-grid"
      >
        {/* Left panel */}
        <div style={{
          background: '#0D4F4A',
          padding: 'clamp(36px,5vw,72px) clamp(24px,5vw,64px)',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 'clamp(22px,3vw,40px)',
            fontWeight: 300,
            color: '#F5EFE4',
            lineHeight: 1.1,
            margin: `0 0 clamp(28px,4vw,48px)`,
          }}>
            {`Let's Start Your `}<em style={{ fontStyle: 'italic' }}>Journey</em>
          </h2>

          {contactItems.map(({ icon, label, value }) => (
            <div key={label} style={{
              display: 'flex',
              gap: '18px',
              alignItems: 'flex-start',
              marginBottom: 'clamp(28px,4vw,40px)',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                minWidth: '44px',
                background: 'rgba(245,239,228,.1)',
                border: '1px solid rgba(245,239,228,.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
              }}>
                {icon}
              </div>
              <div>
                <p style={{
                  fontSize: 'clamp(8px,1.1vw,9px)',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: 'rgba(245,239,228,.5)',
                  margin: '0 0 6px',
                }}>
                  {label}
                </p>
                <p style={{
                  fontSize: 'clamp(13px,1.5vw,15px)',
                  color: '#F5EFE4',
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {value}
                </p>
              </div>
            </div>
          ))}

          <div style={{
            height: '1px',
            background: 'rgba(245,239,228,.1)',
            margin: 'clamp(28px,4vw,40px) 0',
          }} />

          <p style={{
            fontSize: 'clamp(8px,1.1vw,9px)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'rgba(245,239,228,.5)',
            margin: '0 0 16px',
          }}>
            Follow Us
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {socials.map(({ label, href }) => (
              <a
                key={label}
                href={href || '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  border: '1px solid rgba(245,239,228,.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(245,239,228,.7)',
                  fontSize: '11px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{
          background: '#F5EFE4',
          padding: 'clamp(36px,5vw,72px) clamp(24px,5vw,64px)',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 'clamp(24px,3.5vw,40px)',
            fontWeight: 300,
            color: '#0D4F4A',
            margin: '0 0 8px',
          }}>
            Send Us a Message
          </h2>
          <p style={{
            fontSize: 'clamp(13px,1.3vw,15px)',
            color: '#3A3A3A',
            margin: `0 0 clamp(28px,4vw,44px)`,
            lineHeight: 1.85,
          }}>
            Fill in the form below and our team will get back to you within 24 hours.
          </p>

          {/* Name row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(10px,1.5vw,16px)',
          }} className="name-grid">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              style={inputBase}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              style={inputBase}
            />
          </div>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputBase}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={inputBase}
          />

          {/* Interest — prefilled or dropdown */}
          {propertyParam ? (
            <input
              type="text"
              value={propertyParam}
              readOnly
              style={{ ...inputBase, background: '#EDE5D8', color: '#555' }}
            />
          ) : (
            <select
              value={interest}
              onChange={e => setInterest(e.target.value)}
              style={{ ...inputBase, appearance: 'none', WebkitAppearance: 'none' }}
            >
              <option value="">Select Interest</option>
              <option value="Villa / Townhouse">Villa / Townhouse</option>
              <option value="Apartment / Penthouse">Apartment / Penthouse</option>
              <option value="Off-Plan Investment">Off-Plan Investment</option>
              <option value="Commercial Property">Commercial Property</option>
              <option value="Property Management">Property Management</option>
              <option value="Golden Visa">Golden Visa</option>
              <option value="Other">Other</option>
            </select>
          )}

          {/* Budget — prefilled or dropdown */}
          {priceParam ? (
            <input
              type="text"
              value={(() => { const n = Number(String(priceParam).replace(/,/g, '')); return isNaN(n) || n === 0 ? priceParam : n.toLocaleString() })()}
              readOnly
              style={{ ...inputBase, background: '#EDE5D8', color: '#555' }}
            />
          ) : (
            <select
              value={budget}
              onChange={e => setBudget(e.target.value)}
              style={{ ...inputBase, appearance: 'none', WebkitAppearance: 'none' }}
            >
              <option value="">Select Budget</option>
              <option value="Under 1M">Under 1M</option>
              <option value="1M – 3M">1M – 3M</option>
              <option value="3M – 7M">3M – 7M</option>
              <option value="7M – 15M">7M – 15M</option>
              <option value="15M – 30M">15M – 30M</option>
              <option value="30M+">30M+</option>
            </select>
          )}

          <textarea
            placeholder="Your message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            style={{
              ...inputBase,
              height: 'clamp(100px,12vw,130px)',
              resize: 'none',
            }}
          />

          {showSuccess && (
            <div style={{
              background: '#d1fae5',
              border: '1px solid #6ee7b7',
              color: '#065f46',
              padding: '14px 18px',
              fontSize: 'clamp(12px,1.3vw,14px)',
              marginBottom: '12px',
            }}>
              {`✅ Thank you! We'll be in touch within 24 hours.`}
            </div>
          )}

          <div
            onClick={btnState === 'loading' ? undefined : handleSubmit}
            style={{
              width: '100%',
              background: btnBg,
              color: '#F5EFE4',
              padding: 'clamp(14px,2vw,18px)',
              fontSize: 'clamp(10px,1.3vw,12px)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              cursor: btnState === 'loading' ? 'wait' : 'pointer',
              marginTop: '4px',
              textAlign: 'center',
              boxSizing: 'border-box',
              transition: 'background .2s',
              userSelect: 'none',
            }}
          >
            {btnText}
          </div>
        </div>
      </motion.div>

      {/* ── MAP SECTION ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: '#EDE5D8',
          padding: 'clamp(48px,7vw,80px) clamp(16px,5vw,72px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: 'clamp(32px,5vw,64px)',
            alignItems: 'start',
          }}
          className="map-grid"
        >
          <div>
            <h3 style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: 'clamp(22px,3vw,36px)',
              fontWeight: 300,
              color: '#0D4F4A',
              margin: '0 0 20px',
            }}>
              Find <em style={{ fontStyle: 'italic', color: '#8B6E47' }}>Our Office</em>
            </h3>
            <p style={{
              fontSize: 'clamp(13px,1.3vw,15px)',
              color: '#3A3A3A',
              lineHeight: 1.85,
              margin: '0 0 16px',
            }}>
              {`We're located in the heart of Business Village, Dubai — easily accessible from Downtown and the Metro.`}
            </p>
            <div style={{ fontSize: 'clamp(13px,1.3vw,15px)', lineHeight: 1.85, margin: '0 0 0' }}>
              <div style={{fontWeight:600, color:'#0D4F4A', fontSize:14, marginBottom:4}}>{settings.co || 'IMAKSA Real Estate LLC'}</div>
              <div style={{color:'#3A3A3A'}}>{settings.addr}</div>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#0D4F4A',
                color: '#F5EFE4',
                padding: 'clamp(11px,1.5vw,14px) clamp(20px,3vw,32px)',
                fontSize: 'clamp(9px,1.2vw,11px)',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginTop: '8px',
                textDecoration: 'none',
              }}
            >
              Get Directions →
            </a>
          </div>

          <iframe
            src={mapsUrl}
            style={{
              display: 'block',
              width: '100%',
              height: 'clamp(280px,40vw,420px)',
              border: 'none',
              filter: 'saturate(.8)',
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="IMAKSA Office Location"
          />
        </div>
      </motion.div>

      {/* ── FAQ SECTION ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: '#FAFAF8',
          padding: 'clamp(48px,6vw,80px) clamp(16px,5vw,72px)',
        }}
      >
        <h2 style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: 'clamp(24px,3.2vw,44px)',
          fontWeight: 300,
          color: '#0D4F4A',
          margin: `0 0 clamp(36px,5vw,60px)`,
        }}>
          Frequently Asked <em style={{ fontStyle: 'italic' }}>Questions</em>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '800px' }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(13,79,74,.12)' }}>
              <div
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  padding: 'clamp(18px,2.5vw,26px) 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: 'clamp(13px,1.6vw,16px)',
                  fontWeight: 400,
                  color: '#0D4F4A',
                  userSelect: 'none',
                }}
              >
                <span>{faq.q}</span>
                <span style={{
                  transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform .35s',
                  color: '#2E8B84',
                  fontSize: '20px',
                  lineHeight: 1,
                  marginLeft: '16px',
                  display: 'inline-block',
                }}>+</span>
              </div>
              <div style={{
                maxHeight: openFaq === i ? '200px' : '0',
                overflow: 'hidden',
                transition: 'max-height .4s ease',
                fontSize: 'clamp(13px,1.3vw,15px)',
                color: '#3A3A3A',
                lineHeight: 1.85,
                paddingBottom: openFaq === i ? 'clamp(14px,2vw,20px)' : '0',
              }}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── RESPONSIVE BREAKPOINTS ───────────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .map-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .name-grid { grid-template-columns: 1fr !important; }
        }
        .contact-grid > div:last-child:hover [data-submit] {
          background: #1A6B65;
        }
      `}</style>
    </div>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0D4F4A' }} />}>
      <ContactPageContent />
    </Suspense>
  )
}
