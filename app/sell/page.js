'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
}

const inputStyle = {
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

const WHY = [
  {
    icon: '🤝',
    title: 'Honest Valuation',
    desc: `We give you a realistic market price based on real Dubai data — not an inflated number to win your listing.`,
  },
  {
    icon: '⚡',
    title: 'Fast Response',
    desc: 'A consultant reviews your submission and contacts you within 24 hours, every time.',
  },
  {
    icon: '🔒',
    title: 'No Obligation',
    desc: `Submitting your details doesn't commit you to anything. Decide after you hear our offer.`,
  },
]

const STEPS = [
  {
    title: `Tell us about your property`,
    desc: 'Fill in the form with your property details and contact info.',
  },
  {
    title: `We review & reach out`,
    desc: 'Our team reviews your submission and contacts you within 24 hours.',
  },
  {
    title: 'Get your valuation',
    desc: `We discuss next steps, valuation, and how we'll market your property.`,
  },
]

function useBreakpoints() {
  const [bp, setBp] = useState({ is768: false })
  useEffect(() => {
    const check = () => setBp({ is768: window.innerWidth < 768 })
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return bp
}

export default function SellPage() {
  const [settings, setSettings] = useState({})
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('Villa/Mansion')
  const [size, setSize] = useState('')
  const [askingPrice, setAskingPrice] = useState('')
  const [notes, setNotes] = useState('')
  const [btnState, setBtnState] = useState('idle')
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const { is768 } = useBreakpoints()

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d.success) setSettings(d.settings || {}) })
      .catch(() => {})
  }, [])

  const handleSubmit = async () => {
    setError('')
    if (!name.trim() || !email.trim() || !phone.trim() || !location.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    setBtnState('loading')
    try {
      const res = await fetch('/api/sellrequests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, location, propertyType, size, askingPrice, notes }),
      })
      const data = await res.json()
      if (data.success) {
        setBtnState('success')
        setShowSuccess(true)
        setTimeout(() => {
          setBtnState('idle')
          setShowSuccess(false)
          setName(''); setEmail(''); setPhone(''); setLocation('')
          setPropertyType('Villa/Mansion'); setSize(''); setAskingPrice(''); setNotes('')
        }, 5000)
      } else {
        setBtnState('idle')
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setBtnState('idle')
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div style={{ fontFamily: 'var(--font-inter)' }}>
      {/* HERO */}
      <section style={{
        background: '#0D4F4A',
        padding: `clamp(100px,12vw,150px) clamp(16px,5vw,72px) clamp(48px,6vw,80px)`,
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
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: 'clamp(8px,1.3vw,10px)', letterSpacing: '5px', textTransform: 'uppercase', color: 'rgba(245,239,228,.6)', marginBottom: '16px', position: 'relative' }}
        >
          Thinking Of Selling?
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(32px,5vw,68px)', fontWeight: 300, color: '#F5EFE4', lineHeight: 1.1, position: 'relative', margin: 0 }}
        >
          Sell With <em style={{ fontStyle: 'italic' }}>IMAKSA</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ fontSize: 'clamp(12px,1.5vw,15px)', color: 'rgba(245,239,228,.7)', maxWidth: '560px', margin: '20px auto 0', lineHeight: 1.8, position: 'relative' }}
        >
          Tell us about your property and one of our consultants will reach out with a clear, honest valuation — no pressure, no obligation.
        </motion.p>
      </section>

      {/* WHY STRIP */}
      <section style={{
        background: '#F5EFE4',
        display: 'grid',
        gridTemplateColumns: is768 ? '1fr' : 'repeat(3,1fr)',
      }}>
        {WHY.map((w, i) => (
          <motion.div
            key={i}
            {...fadeUp}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
            style={{
              padding: `clamp(32px,5vw,52px) clamp(24px,4vw,40px)`,
              textAlign: 'center',
              borderRight: !is768 && i < 2 ? '1px solid rgba(13,79,74,.1)' : 'none',
              borderBottom: is768 && i < 2 ? '1px solid rgba(13,79,74,.1)' : 'none',
            }}
          >
            <div style={{ fontSize: '30px', marginBottom: '12px' }}>{w.icon}</div>
            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(18px,2.2vw,24px)', color: '#0D4F4A', marginBottom: '10px' }}>{w.title}</div>
            <div style={{ fontSize: 'clamp(13px,1.3vw,15px)', color: '#3A3A3A', lineHeight: 1.85 }}>{w.desc}</div>
          </motion.div>
        ))}
      </section>

      {/* FORM SECTION */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: is768 ? '1fr' : '1fr 1.4fr',
        minHeight: '70vh',
      }}>
        {/* LEFT — How It Works */}
        <div style={{ background: '#0D4F4A', padding: `clamp(36px,5vw,72px) clamp(24px,5vw,64px)` }}>
          <motion.h2
            {...fadeUp}
            style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(26px,4vw,44px)', fontWeight: 300, color: '#F5EFE4', margin: `0 0 clamp(32px,4vw,48px)` }}
          >
            How It <em style={{ fontStyle: 'italic' }}>Works</em>
          </motion.h2>

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
              style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: 'clamp(24px,3.5vw,32px)' }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                border: '1px solid rgba(245,239,228,.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-fraunces)',
                fontSize: '15px',
                color: '#F5EFE4',
                flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: 'clamp(13px,1.5vw,15px)', color: '#F5EFE4', fontWeight: 500, marginBottom: '6px' }}>{step.title}</div>
                <div style={{ fontSize: 'clamp(13px,1.3vw,15px)', color: 'rgba(245,239,228,.6)', lineHeight: 1.85 }}>{step.desc}</div>
              </div>
            </motion.div>
          ))}

          <div style={{ height: '1px', background: 'rgba(245,239,228,.1)', margin: `clamp(24px,3.5vw,32px) 0` }} />

          <div style={{ fontSize: 'clamp(12px,1.3vw,14px)', color: 'rgba(245,239,228,.5)', marginBottom: '10px' }}>
            Prefer to talk directly?
          </div>
          {settings.phone && (
            <a href={`tel:${settings.phone}`} style={{ fontSize: 'clamp(13px,1.5vw,15px)', color: '#F5EFE4', textDecoration: 'none', display: 'block', marginBottom: '4px' }}>{settings.phone}</a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`} style={{ fontSize: 'clamp(13px,1.5vw,15px)', color: '#F5EFE4', textDecoration: 'none', display: 'block' }}>{settings.email}</a>
          )}
        </div>

        {/* RIGHT — Form */}
        <div style={{ background: '#F5EFE4', padding: `clamp(36px,5vw,72px) clamp(24px,5vw,64px)` }}>
          <motion.div {...fadeUp}>
            <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 300, color: '#0D4F4A', margin: '0 0 8px' }}>
              Property Details
            </h2>
            <p style={{ fontSize: 'clamp(12px,1.3vw,14px)', color: '#3A3A3A', lineHeight: 1.7, marginBottom: 'clamp(24px,3vw,36px)' }}>
              Share as much as you can — the more we know, the more accurate our valuation will be.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(10px,1.2vw,14px)' }}>
              <input
                placeholder="Full Name *"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="Phone Number *"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={inputStyle}
              />
            </div>

            <input
              type="email"
              placeholder="Email Address *"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Property Location / Address *"
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={inputStyle}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(10px,1.2vw,14px)' }}>
              <select
                value={propertyType}
                onChange={e => setPropertyType(e.target.value)}
                style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', background: '#fff' }}
              >
                <option>Villa/Mansion</option>
                <option>Penthouse</option>
                <option>Apartment</option>
                <option>Townhouse</option>
                <option>Commercial</option>
                <option>Other</option>
              </select>
              <input
                placeholder="Approx. Size (sq ft)"
                value={size}
                onChange={e => setSize(e.target.value)}
                style={inputStyle}
              />
            </div>

            <input
              placeholder="Asking Price (AED) — optional"
              value={askingPrice}
              onChange={e => setAskingPrice(e.target.value)}
              style={inputStyle}
            />

            <textarea
              placeholder="Anything else we should know about the property..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />

            {error && (
              <p style={{ color: '#c0392b', fontSize: 'clamp(11px,1.2vw,13px)', marginBottom: '12px' }}>{error}</p>
            )}

            <div
              onClick={btnState === 'idle' ? handleSubmit : undefined}
              style={{
                width: '100%',
                background: btnState === 'success' ? '#27ae60' : '#0D4F4A',
                color: '#F5EFE4',
                padding: 'clamp(14px,2vw,18px)',
                textAlign: 'center',
                fontFamily: 'var(--font-inter)',
                fontSize: 'clamp(10px,1.2vw,12px)',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                cursor: btnState === 'idle' ? 'pointer' : 'default',
                fontWeight: 700,
                boxSizing: 'border-box',
                transition: 'background .3s',
                userSelect: 'none',
              }}
            >
              {btnState === 'loading' ? 'Submitting...' : btnState === 'success' ? '✅ Submitted!' : 'Submit Property →'}
            </div>

            {showSuccess && (
              <p style={{ color: '#27ae60', fontSize: 'clamp(12px,1.3vw,14px)', marginTop: '12px', textAlign: 'center' }}>
                Thank you! A consultant will be in touch within 24 hours.
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
