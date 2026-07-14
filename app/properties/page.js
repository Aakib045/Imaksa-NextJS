'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

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

const CONTENT = {
  buy: {
    heading: <>Find Your Perfect <em style={{ fontStyle: 'italic' }}>Home</em></>,
    steps: [
      { title: "Tell us what you're looking for", desc: 'Share your requirements, budget and preferred locations.' },
      { title: 'We match you with properties', desc: 'Our consultants search our network for properties matching your criteria.' },
      { title: 'View and decide', desc: 'We arrange viewings and guide you through the entire buying process.' },
    ],
    formTitle: 'Buy Enquiry',
    interest: 'Buy Property',
    source: 'buy-inquiry',
  },
  rent: {
    heading: <>Find Your Perfect <em style={{ fontStyle: 'italic' }}>Rental</em></>,
    steps: [
      { title: 'Share your requirements', desc: 'Tell us your budget, preferred area and move-in date.' },
      { title: 'We find options for you', desc: 'Our team shortlists the best rental properties matching your needs.' },
      { title: 'Move in with ease', desc: 'We handle all paperwork and coordinate with landlords on your behalf.' },
    ],
    formTitle: 'Rent Enquiry',
    interest: 'Rent Property',
    source: 'rent-inquiry',
  },
  offplan: {
    heading: <>Invest in <em style={{ fontStyle: 'italic' }}>Off-Plan</em></>,
    steps: [
      { title: 'Share your investment goals', desc: 'Tell us your budget and expected returns.' },
      { title: 'We present opportunities', desc: 'Our team presents exclusive off-plan projects from top Dubai developers.' },
      { title: 'Secure your investment', desc: 'We guide you through payment plans and developer contracts.' },
    ],
    formTitle: 'Off-Plan Enquiry',
    interest: 'Off-Plan Investment',
    source: 'offplan-inquiry',
  },
}

const DEFAULT_CONTENT = {
  heading: <>Find Your <em style={{ fontStyle: 'italic' }}>Property</em></>,
  steps: [
    { title: "Tell us what you're looking for", desc: 'Share your requirements, budget and preferred locations.' },
    { title: 'We match you with properties', desc: 'Our consultants search our network for properties matching your criteria.' },
    { title: 'View and decide', desc: 'We arrange viewings and guide you through the entire process.' },
  ],
  formTitle: 'Property Enquiry',
  interest: 'General Property Inquiry',
  source: 'properties-inquiry',
}

const BUY_BUDGET = ['Under AED 1M', 'AED 1M–3M', 'AED 3M–7M', 'AED 7M–15M', 'AED 15M–30M', 'AED 30M+']
const RENT_BUDGET = ['Under AED 50K', 'AED 50K–100K', 'AED 100K–200K', 'AED 200K–500K', 'AED 500K+']

function formatPrice(price) {
  if (!price) return ''
  const cleaned = String(price).replace(/,/g, '')
  const num = Number(cleaned)
  if (!isNaN(num) && num > 0) return num.toLocaleString()
  return price
}

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

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', boxShadow: '0 2px 20px rgba(0,0,0,.06)' }}>
      <div className="shimmer" style={{ height: 220, background: '#EDE5D8' }} />
      <div style={{ padding: 24 }}>
        <div className="shimmer" style={{ height: 12, background: '#EDE5D8', borderRadius: 4, marginBottom: 12 }} />
        <div className="shimmer" style={{ height: 12, background: '#EDE5D8', borderRadius: 4, marginBottom: 12, width: '70%' }} />
        <div className="shimmer" style={{ height: 12, background: '#EDE5D8', borderRadius: 4, width: '50%' }} />
      </div>
    </div>
  )
}

function PropertyCard({ property, index, sliderIndexes, nextSlide, prevSlide, goToSlide }) {
  const router = useRouter()
  const images =
    property.images && property.images.length > 0
      ? property.images
      : property.img
      ? [property.img]
      : []
  const hasMultiple = images.length > 1
  const currentIdx = sliderIndexes[property._id] || 0
  const priceDisplay = formatPrice(property.price)
  const encodedName = encodeURIComponent(property.name || '')
  const encodedPrice = encodeURIComponent(Number(String(property.price || '').replace(/,/g, '')).toLocaleString())

  const specs = []
  if (property.beds) specs.push({ value: property.beds, label: 'Beds' })
  if (property.baths) specs.push({ value: property.baths, label: 'Baths' })
  if (property.area) specs.push({ value: property.area, label: 'Sq.Ft' })

  const typeLabel = property.type
    ? property.type.charAt(0).toUpperCase() + property.type.slice(1).toLowerCase()
    : ''

  return (
    <div
      className="prop-card card-enter"
      onClick={() => property._id && router.push('/properties/' + property._id)}
      style={{
        background: '#fff',
        overflow: 'hidden',
        boxShadow: '0 2px 20px rgba(0,0,0,.06)',
        animationDelay: `${index * 0.08}s`,
        cursor: 'pointer',
      }}
    >
      <div style={{ height: 'clamp(160px,35vw,260px)', overflow: 'hidden', position: 'relative' }}>
        {images.length === 0 ? (
          <div style={{ width: '100%', height: '100%', background: '#EDE5D8' }} />
        ) : hasMultiple ? (
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={property.name}
                loading="lazy"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: i === currentIdx ? 1 : 0,
                  transition: 'opacity .4s',
                }}
              />
            ))}
            <button
              onClick={e => { e.stopPropagation(); prevSlide(property._id, images.length) }}
              style={{
                position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,.6)', border: '2px solid rgba(255,255,255,.4)',
                color: '#fff', width: 36, height: 36, borderRadius: '50%', zIndex: 10,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, lineHeight: 1, opacity: 1,
              }}
            >&#8249;</button>
            <button
              onClick={e => { e.stopPropagation(); nextSlide(property._id, images.length) }}
              style={{
                position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,.6)', border: '2px solid rgba(255,255,255,.4)',
                color: '#fff', width: 36, height: 36, borderRadius: '50%', zIndex: 10,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, lineHeight: 1, opacity: 1,
              }}
            >&#8250;</button>
            <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, zIndex: 6 }}>
              {images.map((_, i) => (
                <div
                  key={i}
                  onClick={e => { e.stopPropagation(); goToSlide(property._id, i) }}
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: i === currentIdx ? '#F5EFE4' : 'rgba(245,239,228,.4)',
                    transform: i === currentIdx ? 'scale(1.3)' : 'scale(1)',
                    cursor: 'pointer', transition: 'all .3s',
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <img
            className="prop-card-img"
            src={images[0]}
            alt={property.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}

        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.3) 60%, transparent 100%)',
          zIndex: 4,
        }} />

        {property.badge && (
          <div style={{
            position: 'absolute', top: 16, left: 16, background: '#0D4F4A', color: '#F5EFE4',
            fontSize: 'clamp(7px,.9vw,8px)', letterSpacing: 2, textTransform: 'uppercase',
            padding: '5px 12px', zIndex: 5,
          }}>
            {property.badge}
          </div>
        )}
      </div>

      <div style={{ padding: 'clamp(16px,2vw,24px)' }}>
        <div style={{ fontSize: 'clamp(8px,1vw,9px)', letterSpacing: 3, textTransform: 'uppercase', color: '#2E8B84', marginBottom: 8 }}>
          {typeLabel}
        </div>
        <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(18px,2vw,24px)', color: '#0D4F4A', marginBottom: 6 }}>
          AED {priceDisplay}
        </div>
        <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(14px,1.5vw,18px)', color: '#0A0A0A', marginBottom: 4 }}>
          {property.name}
        </div>
        <div style={{ fontSize: 'clamp(10px,1.2vw,11px)', color: '#6B6B60', letterSpacing: 1, marginBottom: 'clamp(14px,2vw,20px)' }}>
          {`📍 ${property.location}`}
        </div>

        {specs.length > 0 && (
          <div style={{ display: 'flex', borderTop: '1px solid rgba(13,79,74,.1)', paddingTop: 'clamp(12px,1.8vw,18px)' }}>
            {specs.map((spec, i) => (
              <div key={spec.label} style={{ flex: 1, textAlign: 'center', borderRight: i < specs.length - 1 ? '1px solid rgba(13,79,74,.1)' : 'none' }}>
                <div style={{ fontSize: 'clamp(16px,2vw,20px)', fontWeight: 400, color: '#0D4F4A' }}>{spec.value}</div>
                <div style={{ fontSize: 'clamp(8px,1vw,9px)', letterSpacing: 2, textTransform: 'uppercase', color: '#6B6B60', marginTop: 3 }}>{spec.label}</div>
              </div>
            ))}
          </div>
        )}

        <Link
          href={`/contact?property=${encodedName}&price=${encodedPrice}`}
          className="enquire-btn"
          onClick={e => e.stopPropagation()}
          style={{
            display: 'block', textAlign: 'center', background: '#0D4F4A', color: '#F5EFE4',
            padding: 'clamp(12px,1.5vw,14px)', marginTop: 'clamp(14px,2vw,20px)',
            fontSize: 'clamp(9px,1.1vw,10px)', letterSpacing: 2, textTransform: 'uppercase',
            textDecoration: 'none', transition: 'background .3s',
          }}
        >
          Enquire Now
        </Link>
      </div>
    </div>
  )
}

function PropertiesContent() {
  const searchParams = useSearchParams()
  const { is768 } = useBreakpoints()

  const typeParam = searchParams.get('type')
  const content = CONTENT[typeParam] || DEFAULT_CONTENT
  const budgetOptions = typeParam === 'rent' ? RENT_BUDGET : BUY_BUDGET

  const [allProperties, setAllProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeListingFilter, setActiveListingFilter] = useState('all')
  const [activePropertyFilter, setActivePropertyFilter] = useState('all')
  const [filteredProperties, setFilteredProperties] = useState([])
  const [sliderIndexes, setSliderIndexes] = useState({})

  const [settings, setSettings] = useState({})
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', budget: '', location: '', message: '' })
  const [btnState, setBtnState] = useState('idle')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d.success) setSettings(d.settings || {}) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (typeParam && ['buy', 'rent', 'offplan'].includes(typeParam)) {
      setActiveListingFilter(typeParam)
    }
  }, [typeParam])

  const fetchProperties = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/properties', { cache: 'no-store' })
      const data = await res.json()
      if (data.success) {
        setAllProperties(data.properties)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    let filtered = [...allProperties]
    if (activeListingFilter !== 'all') {
      filtered = filtered.filter(p => p.listingType && p.listingType.toLowerCase() === activeListingFilter)
    }
    if (activePropertyFilter !== 'all') {
      filtered = filtered.filter(p => p.type && p.type.toLowerCase() === activePropertyFilter)
    }
    setFilteredProperties(filtered)
  }, [allProperties, activeListingFilter, activePropertyFilter])

  const nextSlide = (id, total) => setSliderIndexes(prev => ({ ...prev, [id]: ((prev[id] || 0) + 1) % total }))
  const prevSlide = (id, total) => setSliderIndexes(prev => ({ ...prev, [id]: ((prev[id] || 0) - 1 + total) % total }))
  const goToSlide = (id, idx) => setSliderIndexes(prev => ({ ...prev, [id]: idx }))

  const handleSubmit = async () => {
    if (btnState !== 'idle') return
    setBtnState('loading')
    try {
      const combinedMessage = [formData.location, formData.message].filter(Boolean).join('\n')
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          budget: formData.budget,
          message: combinedMessage,
          source: content.source,
          interest: content.interest,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setBtnState('success')
        setShowSuccess(true)
        setTimeout(() => {
          setBtnState('idle')
          setShowSuccess(false)
          setFormData({ firstName: '', lastName: '', email: '', phone: '', budget: '', location: '', message: '' })
        }, 5000)
      } else {
        setBtnState('idle')
      }
    } catch {
      setBtnState('idle')
    }
  }

  const listingButtons = [
    { label: 'All', value: 'all' },
    { label: 'Buy', value: 'buy' },
    { label: 'Rent', value: 'rent' },
    { label: 'Sell', value: 'sell', href: '/sell' },
    { label: 'Off-Plan', value: 'offplan' },
  ]

  const propertyButtons = [
    { label: 'All Properties', value: 'all' },
    { label: 'Villas', value: 'villa' },
    { label: 'Penthouses', value: 'penthouse' },
    { label: 'Apartments', value: 'apartment' },
    { label: 'Off-Plan', value: 'offplan' },
    { label: 'Commercial', value: 'commercial' },
  ]

  const btnBase = {
    border: '1.5px solid rgba(13,79,74,.25)', color: '#6B6B60', background: 'transparent',
    padding: 'clamp(7px,1vw,10px) clamp(14px,2vw,24px)', fontSize: 'clamp(8px,1vw,10px)',
    letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'none',
    display: 'inline-block', transition: 'all .3s', fontFamily: 'inherit',
  }
  const btnActive = { ...btnBase, background: '#0D4F4A', color: '#F5EFE4', border: '1.5px solid #0D4F4A' }

  return (
    <>
      {/* Hero */}
      <section style={{
        background: '#0D4F4A',
        padding: 'clamp(80px,10vw,120px) clamp(16px,5vw,72px) clamp(48px,6vw,80px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&q=80') center/cover`,
          opacity: 0.12,
        }} />
        <div style={{
          fontSize: 'clamp(8px,1.3vw,10px)', letterSpacing: 5, textTransform: 'uppercase',
          color: 'rgba(245,239,228,.6)', marginBottom: 16, position: 'relative',
        }}>
          Dubai Real Estate
        </div>
        <h1 style={{
          fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(32px,5.5vw,72px)',
          fontWeight: 300, color: '#F5EFE4', lineHeight: 1.05, margin: 0, position: 'relative',
        }}>
          Our <em style={{ fontStyle: 'italic' }}>Properties</em>
        </h1>
      </section>

      {/* Loading */}
      {loading && (
        <section style={{ background: '#FAFAF8', padding: 'clamp(32px,5vw,72px) clamp(16px,5vw,72px)' }}>
          <div className="prop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(12px,2vw,24px)' }}>
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        </section>
      )}

      {/* Error */}
      {!loading && error && (
        <section style={{ background: '#FAFAF8', padding: 'clamp(32px,5vw,72px) clamp(16px,5vw,72px)' }}>
          <div style={{ textAlign: 'center', padding: 'clamp(40px,8vw,80px)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#9888;&#65039;</div>
            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(18px,2vw,24px)', color: '#0A0A0A', marginBottom: 8 }}>
              Could not load properties
            </div>
            <button
              onClick={fetchProperties}
              style={{
                marginTop: 16, background: '#0D4F4A', color: '#F5EFE4', border: 'none',
                padding: '12px 28px', fontSize: 'clamp(9px,1.1vw,10px)', letterSpacing: 2,
                textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Try Again
            </button>
          </div>
        </section>
      )}

      {/* No properties — premium inquiry form */}
      {!loading && !error && allProperties.length === 0 && (
        <section style={{
          display: 'grid',
          gridTemplateColumns: is768 ? '1fr' : '1fr 1.4fr',
          minHeight: '70vh',
        }}>
          {/* LEFT — How It Works */}
          <div style={{ background: '#0D4F4A', padding: 'clamp(36px,5vw,72px) clamp(24px,5vw,64px)' }}>
            <motion.h2
              {...fadeUp}
              style={{
                fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(26px,4vw,44px)',
                fontWeight: 300, color: '#F5EFE4', margin: '0 0 clamp(32px,4vw,48px)',
              }}
            >
              {content.heading}
            </motion.h2>

            {content.steps.map((step, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 'clamp(24px,3.5vw,32px)' }}
              >
                <div style={{
                  width: 36, height: 36, border: '1px solid rgba(245,239,228,.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-fraunces)', fontSize: 15, color: '#F5EFE4', flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 'clamp(13px,1.5vw,15px)', color: '#F5EFE4', fontWeight: 500, marginBottom: 6 }}>{step.title}</div>
                  <div style={{ fontSize: 'clamp(13px,1.3vw,15px)', color: 'rgba(245,239,228,.6)', lineHeight: 1.85 }}>{step.desc}</div>
                </div>
              </motion.div>
            ))}

            <div style={{ height: 1, background: 'rgba(245,239,228,.1)', margin: 'clamp(24px,3.5vw,32px) 0' }} />

            <div style={{ fontSize: 'clamp(12px,1.3vw,14px)', color: 'rgba(245,239,228,.5)', marginBottom: 10 }}>
              Prefer to talk directly?
            </div>
            {settings.phone && (
              <a href={`tel:${settings.phone}`} style={{ fontSize: 'clamp(13px,1.5vw,15px)', color: '#F5EFE4', textDecoration: 'none', display: 'block', marginBottom: 4 }}>
                {settings.phone}
              </a>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`} style={{ fontSize: 'clamp(13px,1.5vw,15px)', color: '#F5EFE4', textDecoration: 'none', display: 'block' }}>
                {settings.email}
              </a>
            )}
          </div>

          {/* RIGHT — Form */}
          <div style={{ background: '#F5EFE4', padding: 'clamp(36px,5vw,72px) clamp(24px,5vw,64px)' }}>
            <motion.div {...fadeUp}>
              <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 300, color: '#0D4F4A', margin: '0 0 8px' }}>
                {content.formTitle}
              </h2>
              <p style={{ fontSize: 'clamp(12px,1.3vw,14px)', color: '#3A3A3A', lineHeight: 1.7, marginBottom: 'clamp(24px,3vw,36px)' }}>
                Fill in your requirements and our team will get back to you within 24 hours.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(10px,1.2vw,14px)' }}>
                <input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))}
                  style={inputStyle}
                />
                <input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(10px,1.2vw,14px)' }}>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  style={inputStyle}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <select
                value={formData.budget}
                onChange={e => setFormData(p => ({ ...p, budget: e.target.value }))}
                style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', color: formData.budget ? '#0A0A0A' : '#6B6B60' }}
              >
                <option value="">Budget / Price Range</option>
                {budgetOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>

              <input
                placeholder="Preferred Location (e.g. Dubai Marina, Downtown Dubai)"
                value={formData.location}
                onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                style={inputStyle}
              />

              <textarea
                placeholder="Tell us more about what you're looking for..."
                rows={4}
                value={formData.message}
                onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                style={{ ...inputStyle, resize: 'vertical' }}
              />

              <div
                onClick={handleSubmit}
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
                {btnState === 'loading' ? 'Submitting...' : btnState === 'success' ? '✅ Submitted!' : 'Submit Enquiry →'}
              </div>

              {showSuccess && (
                <p style={{ color: '#27ae60', fontSize: 'clamp(12px,1.3vw,14px)', marginTop: 12, textAlign: 'center' }}>
                  Thank you! A consultant will be in touch within 24 hours.
                </p>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Has properties — filter bars + grid */}
      {!loading && !error && allProperties.length > 0 && (
        <>
          <div style={{
            background: '#F5EFE4',
            padding: 'clamp(14px,2vw,22px) clamp(16px,5vw,72px) 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(8px,1.5vw,16px)', flexWrap: 'wrap',
          }}>
            {listingButtons.map(btn =>
              btn.href ? (
                <Link key={btn.value} href={btn.href} style={btnBase}>{btn.label}</Link>
              ) : (
                <button key={btn.value} onClick={() => setActiveListingFilter(btn.value)} style={activeListingFilter === btn.value ? btnActive : btnBase}>
                  {btn.label}
                </button>
              )
            )}
          </div>

          <div style={{
            background: '#F5EFE4',
            padding: 'clamp(14px,2vw,22px) clamp(16px,5vw,72px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(8px,1.5vw,16px)', flexWrap: 'wrap',
            borderBottom: '1px solid rgba(13,79,74,.1)',
          }}>
            {propertyButtons.map(btn => (
              <button key={btn.value} onClick={() => setActivePropertyFilter(btn.value)} style={activePropertyFilter === btn.value ? btnActive : btnBase}>
                {btn.label}
              </button>
            ))}
          </div>

          <section style={{ background: '#FAFAF8', padding: 'clamp(32px,5vw,72px) clamp(16px,5vw,72px)' }}>
            <div style={{ fontSize: 'clamp(10px,1.3vw,12px)', color: '#6B6B60', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 'clamp(20px,3vw,36px)' }}>
              Showing{' '}
              <span style={{ color: '#0D4F4A', fontWeight: 500 }}>{filteredProperties.length}</span>{' '}
              properties
            </div>

            <div className="prop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(12px,2vw,24px)' }}>
              {filteredProperties.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 'clamp(40px,8vw,80px)' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>&#127969;</div>
                  <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(18px,2vw,24px)', color: '#0A0A0A', marginBottom: 8 }}>
                    No properties found
                  </div>
                  <div style={{ fontSize: 'clamp(12px,1.5vw,14px)', color: '#6B6B60' }}>
                    Try selecting a different filter
                  </div>
                </div>
              ) : (
                filteredProperties.map((property, index) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    index={index}
                    sliderIndexes={sliderIndexes}
                    nextSlide={nextSlide}
                    prevSlide={prevSlide}
                    goToSlide={goToSlide}
                  />
                ))
              )}
            </div>
          </section>
        </>
      )}
    </>
  )
}

export default function PropertiesPage() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: .4; }
        }
        .shimmer { animation: shimmer 1.5s infinite; }

        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-enter { animation: cardEnter 0.6s ease both; }

        .prop-card { transition: box-shadow .4s, transform .4s; }
        .prop-card:hover { box-shadow: 0 12px 48px rgba(0,0,0,.12); transform: translateY(-6px); }
        .prop-card:hover .prop-card-img { transform: scale(1.06); }
        .prop-card-img { transition: transform .8s; }

        .enquire-btn:hover { background: #1A6B65 !important; }

        @media (max-width: 900px) { .prop-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 520px) { .prop-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <Suspense fallback={null}>
        <PropertiesContent />
      </Suspense>
    </>
  )
}
