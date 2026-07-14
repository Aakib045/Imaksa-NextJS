'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

function formatPriceDisplay(price) {
  if (!price) return ''
  const n = Number(String(price).replace(/,/g, ''))
  return isNaN(n) || n === 0 ? String(price) : n.toLocaleString()
}

function formatPrice(price) {
  if (!price) return ''
  const cleaned = String(price).replace(/,/g, '')
  const num = Number(cleaned)
  if (!isNaN(num) && num > 0) return num.toLocaleString()
  return price
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
      {/* Image area */}
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
              onClick={() => prevSlide(property._id, images.length)}
              style={{
                position: 'absolute',
                top: '50%',
                left: 8,
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,.6)',
                border: '2px solid rgba(255,255,255,.4)',
                color: '#fff',
                width: 36,
                height: 36,
                borderRadius: '50%',
                zIndex: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                lineHeight: 1,
                opacity: 1,
              }}
            >
              &#8249;
            </button>
            <button
              onClick={() => nextSlide(property._id, images.length)}
              style={{
                position: 'absolute',
                top: '50%',
                right: 8,
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,.6)',
                border: '2px solid rgba(255,255,255,.4)',
                color: '#fff',
                width: 36,
                height: 36,
                borderRadius: '50%',
                zIndex: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                lineHeight: 1,
                opacity: 1,
              }}
            >
              &#8250;
            </button>
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 5,
                zIndex: 6,
              }}
            >
              {images.map((_, i) => (
                <div
                  key={i}
                  onClick={() => goToSlide(property._id, i)}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: i === currentIdx ? '#F5EFE4' : 'rgba(245,239,228,.4)',
                    transform: i === currentIdx ? 'scale(1.3)' : 'scale(1)',
                    cursor: 'pointer',
                    transition: 'all .3s',
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

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.3) 60%, transparent 100%)',
          zIndex: 4,
        }} />

        {property.badge && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              background: '#0D4F4A',
              color: '#F5EFE4',
              fontSize: 'clamp(7px,.9vw,8px)',
              letterSpacing: 2,
              textTransform: 'uppercase',
              padding: '5px 12px',
              zIndex: 5,
            }}
          >
            {property.badge}
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: 'clamp(16px,2vw,24px)' }}>
        <div
          style={{
            fontSize: 'clamp(8px,1vw,9px)',
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: '#2E8B84',
            marginBottom: 8,
          }}
        >
          {typeLabel}
        </div>

        <div
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 'clamp(18px,2vw,24px)',
            color: '#0D4F4A',
            marginBottom: 6,
          }}
        >
          AED {priceDisplay}
        </div>

        <div
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 'clamp(14px,1.5vw,18px)',
            color: '#0A0A0A',
            marginBottom: 4,
          }}
        >
          {property.name}
        </div>

        <div
          style={{
            fontSize: 'clamp(10px,1.2vw,11px)',
            color: '#6B6B60',
            letterSpacing: 1,
            marginBottom: 'clamp(14px,2vw,20px)',
          }}
        >
          {`📍 ${property.location}`}
        </div>

        {specs.length > 0 && (
          <div
            style={{
              display: 'flex',
              borderTop: '1px solid rgba(13,79,74,.1)',
              paddingTop: 'clamp(12px,1.8vw,18px)',
            }}
          >
            {specs.map((spec, i) => (
              <div
                key={spec.label}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  borderRight: i < specs.length - 1 ? '1px solid rgba(13,79,74,.1)' : 'none',
                }}
              >
                <div style={{ fontSize: 'clamp(16px,2vw,20px)', fontWeight: 400, color: '#0D4F4A' }}>
                  {spec.value}
                </div>
                <div
                  style={{
                    fontSize: 'clamp(8px,1vw,9px)',
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    color: '#6B6B60',
                    marginTop: 3,
                  }}
                >
                  {spec.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <Link
          href={`/contact?property=${encodedName}&price=${encodedPrice}`}
          className="enquire-btn"
          onClick={e => e.stopPropagation()}
          style={{
            display: 'block',
            textAlign: 'center',
            background: '#0D4F4A',
            color: '#F5EFE4',
            padding: 'clamp(12px,1.5vw,14px)',
            marginTop: 'clamp(14px,2vw,20px)',
            fontSize: 'clamp(9px,1.1vw,10px)',
            letterSpacing: 2,
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'background .3s',
          }}
        >
          Enquire Now
        </Link>
      </div>
    </div>
  )
}

const INQUIRY_INPUT_STYLE = {
  padding: '13px 16px',
  border: '1px solid rgba(13,79,74,.18)',
  background: '#fff',
  fontSize: 'clamp(12px,1.1vw,13px)',
  color: '#0A0A0A',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

function PropertiesContent() {
  const searchParams = useSearchParams()

  const [allProperties, setAllProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeListingFilter, setActiveListingFilter] = useState('all')
  const [activePropertyFilter, setActivePropertyFilter] = useState('all')
  const [filteredProperties, setFilteredProperties] = useState([])
  const [sliderIndexes, setSliderIndexes] = useState({})

  const [inquiryData, setInquiryData] = useState({ firstName: '', lastName: '', email: '', phone: '', budget: '', message: '' })
  const [inquirySent, setInquirySent] = useState(false)
  const [inquiryLoading, setInquiryLoading] = useState(false)

  const typeParam = searchParams.get('type')

  const SOURCE_MAP = {
    buy: { source: 'buy-inquiry', interest: 'Buy Property' },
    rent: { source: 'rent-inquiry', interest: 'Rent Property' },
    offplan: { source: 'offplan-inquiry', interest: 'Off-Plan Investment' },
  }
  const { source, interest } = SOURCE_MAP[typeParam] || { source: 'properties-inquiry', interest: 'General Property Inquiry' }

  const EYEBROW_MAP = {
    buy: 'For Sale',
    rent: 'For Rent',
    offplan: 'Off-Plan Properties',
  }
  const eyebrow = EYEBROW_MAP[typeParam] || 'Dubai Properties'

  async function handleInquirySubmit() {
    setInquiryLoading(true)
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${inquiryData.firstName} ${inquiryData.lastName}`.trim(),
          email: inquiryData.email,
          phone: inquiryData.phone,
          budget: inquiryData.budget,
          message: inquiryData.message,
          source,
          interest,
        }),
      })
      setInquirySent(true)
    } catch (_) {}
    setInquiryLoading(false)
  }

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
      filtered = filtered.filter(
        (p) => p.listingType && p.listingType.toLowerCase() === activeListingFilter
      )
    }
    if (activePropertyFilter !== 'all') {
      filtered = filtered.filter(
        (p) => p.type && p.type.toLowerCase() === activePropertyFilter
      )
    }
    setFilteredProperties(filtered)
  }, [allProperties, activeListingFilter, activePropertyFilter])

  const nextSlide = (id, total) => {
    setSliderIndexes((prev) => ({ ...prev, [id]: ((prev[id] || 0) + 1) % total }))
  }
  const prevSlide = (id, total) => {
    setSliderIndexes((prev) => ({ ...prev, [id]: ((prev[id] || 0) - 1 + total) % total }))
  }
  const goToSlide = (id, idx) => {
    setSliderIndexes((prev) => ({ ...prev, [id]: idx }))
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
    border: '1.5px solid rgba(13,79,74,.25)',
    color: '#6B6B60',
    background: 'transparent',
    padding: 'clamp(7px,1vw,10px) clamp(14px,2vw,24px)',
    fontSize: 'clamp(8px,1vw,10px)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'all .3s',
    fontFamily: 'inherit',
  }

  const btnActive = {
    ...btnBase,
    background: '#0D4F4A',
    color: '#F5EFE4',
    border: '1.5px solid #0D4F4A',
  }

  return (
    <>
      {/* Hero — always shown */}
      <section
        style={{
          background: '#0D4F4A',
          padding: 'clamp(80px,10vw,120px) clamp(16px,5vw,72px) clamp(48px,6vw,80px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&q=80') center/cover`,
            opacity: 0.12,
          }}
        />
        <div
          style={{
            fontSize: 'clamp(8px,1.3vw,10px)',
            letterSpacing: 5,
            textTransform: 'uppercase',
            color: 'rgba(245,239,228,.6)',
            marginBottom: 16,
            position: 'relative',
          }}
        >
          Dubai Real Estate
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 'clamp(32px,5.5vw,72px)',
            fontWeight: 300,
            color: '#F5EFE4',
            lineHeight: 1.05,
            margin: 0,
            position: 'relative',
          }}
        >
          Our <em style={{ fontStyle: 'italic' }}>Properties</em>
        </h1>
      </section>

      {/* Loading state — filter bars + skeleton */}
      {loading && (
        <>
          <div
            style={{
              background: '#F5EFE4',
              padding: 'clamp(14px,2vw,22px) clamp(16px,5vw,72px) 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(8px,1.5vw,16px)',
              flexWrap: 'wrap',
            }}
          >
            {listingButtons.map((btn) =>
              btn.href ? (
                <Link key={btn.value} href={btn.href} style={btnBase}>{btn.label}</Link>
              ) : (
                <button key={btn.value} style={activeListingFilter === btn.value ? btnActive : btnBase}>{btn.label}</button>
              )
            )}
          </div>
          <div
            style={{
              background: '#F5EFE4',
              padding: 'clamp(14px,2vw,22px) clamp(16px,5vw,72px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(8px,1.5vw,16px)',
              flexWrap: 'wrap',
              borderBottom: '1px solid rgba(13,79,74,.1)',
            }}
          >
            {propertyButtons.map((btn) => (
              <button key={btn.value} style={activePropertyFilter === btn.value ? btnActive : btnBase}>{btn.label}</button>
            ))}
          </div>
          <section style={{ background: '#FAFAF8', padding: 'clamp(32px,5vw,72px) clamp(16px,5vw,72px)' }}>
            <div className="prop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(12px,2vw,24px)' }}>
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          </section>
        </>
      )}

      {/* Error state */}
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
                marginTop: 16, background: '#0D4F4A', color: '#F5EFE4',
                border: 'none', padding: '12px 28px',
                fontSize: 'clamp(9px,1.1vw,10px)', letterSpacing: 2,
                textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Try Again
            </button>
          </div>
        </section>
      )}

      {/* No properties — Coming Soon + Inquiry Form */}
      {!loading && !error && allProperties.length === 0 && (
        <section style={{ background: '#FAFAF8', padding: 'clamp(60px,8vw,100px) clamp(16px,5vw,72px)' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              fontSize: 'clamp(8px,1vw,9px)', letterSpacing: 5,
              textTransform: 'uppercase', color: '#2E8B84', marginBottom: 16,
            }}>
              {eyebrow}
            </div>
            <h2 style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: 'clamp(28px,4vw,48px)',
              fontWeight: 300, color: '#0D4F4A',
              margin: '0 0 20px', lineHeight: 1.15,
            }}>
              Exclusive Properties Coming Soon
            </h2>
            <p style={{
              fontSize: 'clamp(13px,1.2vw,15px)', color: '#6B6B60',
              lineHeight: 1.8, marginBottom: 44,
            }}>
              We are currently curating an exceptional collection of Dubai properties. Register your interest below and our expert consultants will contact you with exclusive listings matching your requirements.
            </p>

            {inquirySent ? (
              <div style={{
                padding: '24px', background: 'rgba(13,79,74,.08)',
                fontSize: 'clamp(13px,1.2vw,15px)', color: '#0D4F4A', lineHeight: 1.7,
              }}>
                &#9989; Thank you! Our team will contact you within 24 hours with exclusive listings.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
                <div className="inq-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <input
                    placeholder="First Name"
                    value={inquiryData.firstName}
                    onChange={e => setInquiryData(p => ({ ...p, firstName: e.target.value }))}
                    style={INQUIRY_INPUT_STYLE}
                  />
                  <input
                    placeholder="Last Name"
                    value={inquiryData.lastName}
                    onChange={e => setInquiryData(p => ({ ...p, lastName: e.target.value }))}
                    style={INQUIRY_INPUT_STYLE}
                  />
                </div>
                <div className="inq-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={inquiryData.email}
                    onChange={e => setInquiryData(p => ({ ...p, email: e.target.value }))}
                    style={INQUIRY_INPUT_STYLE}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={inquiryData.phone}
                    onChange={e => setInquiryData(p => ({ ...p, phone: e.target.value }))}
                    style={INQUIRY_INPUT_STYLE}
                  />
                </div>
                <select
                  value={inquiryData.budget}
                  onChange={e => setInquiryData(p => ({ ...p, budget: e.target.value }))}
                  style={{ ...INQUIRY_INPUT_STYLE, color: inquiryData.budget ? '#0A0A0A' : '#9B9B8A' }}
                >
                  <option value="">Budget / Price Range</option>
                  {['Under AED 1M', 'AED 1M–3M', 'AED 3M–7M', 'AED 7M–15M', 'AED 15M–30M', 'AED 30M+'].map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Tell us what you're looking for..."
                  rows={4}
                  value={inquiryData.message}
                  onChange={e => setInquiryData(p => ({ ...p, message: e.target.value }))}
                  style={{ ...INQUIRY_INPUT_STYLE, resize: 'vertical', minHeight: 110 }}
                />
                <div
                  onClick={!inquiryLoading ? handleInquirySubmit : undefined}
                  style={{
                    background: '#0D4F4A', color: '#F5EFE4',
                    padding: '15px', fontSize: 'clamp(9px,1.1vw,10px)',
                    letterSpacing: '2.5px', textTransform: 'uppercase',
                    cursor: inquiryLoading ? 'wait' : 'pointer',
                    textAlign: 'center', userSelect: 'none',
                  }}
                >
                  {inquiryLoading ? 'Sending…' : 'Register Interest →'}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Has properties — Filter bars + grid */}
      {!loading && !error && allProperties.length > 0 && (
        <>
          {/* Filter Bar 1 — Listing Type */}
          <div
            style={{
              background: '#F5EFE4',
              padding: 'clamp(14px,2vw,22px) clamp(16px,5vw,72px) 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(8px,1.5vw,16px)',
              flexWrap: 'wrap',
            }}
          >
            {listingButtons.map((btn) =>
              btn.href ? (
                <Link key={btn.value} href={btn.href} style={btnBase}>{btn.label}</Link>
              ) : (
                <button
                  key={btn.value}
                  onClick={() => setActiveListingFilter(btn.value)}
                  style={activeListingFilter === btn.value ? btnActive : btnBase}
                >
                  {btn.label}
                </button>
              )
            )}
          </div>

          {/* Filter Bar 2 — Property Type */}
          <div
            style={{
              background: '#F5EFE4',
              padding: 'clamp(14px,2vw,22px) clamp(16px,5vw,72px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(8px,1.5vw,16px)',
              flexWrap: 'wrap',
              borderBottom: '1px solid rgba(13,79,74,.1)',
            }}
          >
            {propertyButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setActivePropertyFilter(btn.value)}
                style={activePropertyFilter === btn.value ? btnActive : btnBase}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Properties grid */}
          <section style={{ background: '#FAFAF8', padding: 'clamp(32px,5vw,72px) clamp(16px,5vw,72px)' }}>
            <div style={{
              fontSize: 'clamp(10px,1.3vw,12px)', color: '#6B6B60',
              letterSpacing: 2, textTransform: 'uppercase',
              marginBottom: 'clamp(20px,3vw,36px)',
            }}>
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
        @media (max-width: 520px) { .prop-grid { grid-template-columns: 1fr !important; } .inq-row { grid-template-columns: 1fr !important; } }
      `}</style>
      <Suspense fallback={null}>
        <PropertiesContent />
      </Suspense>
    </>
  )
}
