'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1600) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const steps = Math.ceil(duration / 16)
          let step = 0
          const timer = setInterval(() => {
            step++
            setCount(Math.round((target * step) / steps))
            if (step >= steps) clearInterval(timer)
          }, 16)
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return [count, ref]
}

// ─── Fade-up variant ──────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay },
  }),
}

// ─── Static data ──────────────────────────────────────────────────────────────
const REVIEWS = [
  {
    text: 'IMAKSA made buying our Palm Jumeirah villa an absolute dream. Their expertise and attention to detail was unmatched. Highly recommend.',
    name: 'James & Sarah Mitchell',
    country: 'United Kingdom',
  },
  {
    text: 'As an NRI investor, I was nervous about buying remotely. IMAKSA handled everything professionally and got me an excellent deal in Downtown Dubai.',
    name: 'Rajesh Kumar',
    country: 'India',
  },
  {
    text: 'The team helped us find the perfect off-plan apartment. Their knowledge of upcoming developments is exceptional. Already recommended to 3 friends.',
    name: 'Fatima Al Rashidi',
    country: 'Saudi Arabia',
  },
]

const MARQUEE_ITEMS = [
  'Palm Jumeirah', 'Downtown Dubai', 'Dubai Marina', 'Dubai Hills Estate',
  'Business Bay', 'DIFC', 'Emirates Hills', 'Jumeirah Bay Island', 'JVC', 'Dubai Creek Harbour',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatPrice(n) {
  if (!n) return 'Price on Request'
  return 'AED ' + Number(n).toLocaleString('en-US')
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputStyle = {
  padding: '11px 14px',
  border: '1px solid rgba(13,79,74,.18)',
  background: '#fff',
  fontSize: 'clamp(12px,1.1vw,13px)',
  color: '#0A0A0A',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

const popupInputStyle = {
  padding: '13px 16px',
  border: '1px solid rgba(245,239,228,.18)',
  background: 'rgba(245,239,228,.08)',
  fontSize: 13,
  color: '#F5EFE4',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({ property }) {
  const router = useRouter()
  const [slideIdx, setSlideIdx] = useState(0)
  const [hovered, setHovered] = useState(false)
  const images = property.images?.length ? property.images : [property.image].filter(Boolean)
  const hasMultiple = images.length > 1
  const encodedName = encodeURIComponent(property.name || property.title || '')
  const encodedPrice = encodeURIComponent(Number(String(property.price || '').replace(/,/g, '')).toLocaleString())

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => property._id && router.push('/properties/' + property._id)}
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', height: 280, background: '#1a1a1a' }}
    >
      {images[slideIdx] ? (
        <img
          src={images[slideIdx]}
          alt={property.name || property.title}
          loading="lazy"
          style={{
            width: '100%', height: 280, objectFit: 'cover', display: 'block',
            transition: 'transform 0.6s ease',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
          }}
        />
      ) : (
        <div style={{ width: '100%', height: 280, background: '#2a2a2a' }} />
      )}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,.78) 0%, transparent 55%)',
      }} />

      {/* Badge */}
      {(property.badge || property.listingType) && (
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: '#0D4F4A', color: '#F5EFE4',
          fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 10px',
        }}>
          {property.badge || property.listingType}
        </div>
      )}

      {/* Slider controls */}
      {hasMultiple && (
        <>
          <button
            onClick={e => { e.stopPropagation(); setSlideIdx(i => (i - 1 + images.length) % images.length) }}
            style={{
              position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,.45)', border: 'none', color: '#fff',
              width: 28, height: 28, borderRadius: '50%', cursor: 'pointer',
              fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >‹</button>
          <button
            onClick={e => { e.stopPropagation(); setSlideIdx(i => (i + 1) % images.length) }}
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,.45)', border: 'none', color: '#fff',
              width: 28, height: 28, borderRadius: '50%', cursor: 'pointer',
              fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >›</button>
          <div style={{ position: 'absolute', bottom: 54, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 4 }}>
            {images.map((_, i) => (
              <div
                key={i}
                onClick={e => { e.stopPropagation(); setSlideIdx(i) }}
                style={{
                  width: 5, height: 5, borderRadius: '50%', cursor: 'pointer',
                  background: i === slideIdx ? '#D4B896' : 'rgba(255,255,255,.4)',
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Card body */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 18 }}>
        <div style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: 'clamp(15px,1.8vw,20px)',
          color: '#F5EFE4', marginBottom: 4,
        }}>
          {formatPrice(property.price)}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(245,239,228,.85)', marginBottom: 2 }}>
          {property.name || property.title}
        </div>
        <div style={{ fontSize: 9, color: 'rgba(245,239,228,.6)', marginBottom: 6 }}>
          📍 {property.location || property.area}
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 9, color: 'rgba(245,239,228,.65)', marginBottom: 8 }}>
          {property.beds !== undefined && (
            <div><strong style={{ display: 'block', fontSize: 11 }}>{property.beds}</strong>Beds</div>
          )}
          {property.baths !== undefined && (
            <div><strong style={{ display: 'block', fontSize: 11 }}>{property.baths}</strong>Baths</div>
          )}
          {property.size && (
            <div><strong style={{ display: 'block', fontSize: 11 }}>{property.size}</strong>Sq Ft</div>
          )}
        </div>
        <Link
          href={`/contact?property=${encodedName}&price=${encodedPrice}`}
          onClick={e => e.stopPropagation()}
          style={{
            display: 'block', textAlign: 'center',
            background: 'rgba(201,168,76,.92)', color: '#0A0A0A',
            padding: '6px 10px', fontSize: 8, letterSpacing: '2px',
            textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600,
          }}
        >
          Enquire Now
        </Link>
      </div>
    </div>
  )
}


// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { scrollY } = useScroll()

  // Hero parallax transforms
  const videoY = useTransform(scrollY, v => v * 0.14)
  const tagOpacity = useTransform(scrollY, [0, 45, 270], [1, 1, 0])
  const tagX = useTransform(scrollY, [0, 270], [0, 20])
  const titleOpacity = useTransform(scrollY, [0, 108, 315], [1, 1, 0])
  const titleY = useTransform(scrollY, [0, 315], [0, -24])
  const descOpacity = useTransform(scrollY, [0, 162, 360], [1, 1, 0])
  const descY = useTransform(scrollY, [0, 360], [0, 24])

  // Loader states
  const [loaderVisible, setLoaderVisible] = useState(true)
  const [loaderOpacity, setLoaderOpacity] = useState(1)

  // Data
  const [properties, setProperties] = useState([])
  const [settings, setSettings] = useState({})
  const [activeTab, setActiveTab] = useState('All')

  // Contact form
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', interest: '', message: '',
  })
  const [formSent, setFormSent] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  // Subscribe popup
  const [showPopup, setShowPopup] = useState(false)
  const [subData, setSubData] = useState({ name: '', email: '' })
  const [subSent, setSubSent] = useState(false)
  const [subLoading, setSubLoading] = useState(false)

  // Count-up hooks
  const [count500, ref500] = useCountUp(500)
  const [count12, ref12] = useCountUp(12)
  const [count98, ref98] = useCountUp(98)

  // Loader timing
  useEffect(() => {
    const t1 = setTimeout(() => setLoaderOpacity(0), 2200)
    const t2 = setTimeout(() => setLoaderVisible(false), 3000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Subscribe popup — show after 11s if not already subscribed
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem('imaksa_subscribed') === 'true') return
    const t = setTimeout(() => setShowPopup(true), 11000)
    return () => clearTimeout(t)
  }, [])

  // Fetch properties + settings
  useEffect(() => {
    fetch('/api/properties')
      .then(r => r.json())
      .then(d => { if (d.success) setProperties(d.properties || []) })
      .catch(() => { })
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d.success) setSettings(d.settings || {}) })
      .catch(() => { })
  }, [])

  // Tab filtering
  const TAB_MAP = { All: null, 'For Sale': 'sale', 'For Rent': 'rent', 'Off-Plan': 'off-plan' }
  const filteredProps = activeTab === 'All'
    ? properties.slice(0, 8)
    : properties.filter(p => {
      const lt = (p.listingType || '').toLowerCase()
      return lt.includes(TAB_MAP[activeTab] || '')
    }).slice(0, 8)

  // Contact submit (no form tag — onClick handler)
  async function handleContactSubmit() {
    setFormLoading(true)
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          interest: formData.interest,
          message: formData.message,
          source: 'website',
        }),
      })
      setFormSent(true)
      setTimeout(() => setFormSent(false), 5000)
    } catch (_) { }
    setFormLoading(false)
  }

  // Subscribe submit
  async function handleSubSubmit() {
    setSubLoading(true)
    try {
      await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subData),
      })
      if (typeof window !== 'undefined') localStorage.setItem('imaksa_subscribed', 'true')
      setSubSent(true)
      setTimeout(() => setShowPopup(false), 2000)
    } catch (_) { }
    setSubLoading(false)
  }

  const marqueeItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <>
      {/* ── All keyframes in one <style> tag ── */}
      <style>{`
        @keyframes logoFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes logoGlow { 0%,100%{filter:drop-shadow(0 0 14px rgba(201,168,76,.35))} 50%{filter:drop-shadow(0 0 28px rgba(201,168,76,.65))} }
        @keyframes barfill { from{width:0} to{width:100%} }
        @keyframes drawring { to{stroke-dashoffset:0} }
        @keyframes letterRise { to{transform:translateY(0);opacity:1} }
        @keyframes mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes scrolldown { 0%{top:-100%} 100%{top:200%} }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
        @keyframes subFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes subSlideIn { from{opacity:0;transform:translate(-50%,-54%)} to{opacity:1;transform:translate(-50%,-50%)} }
        @media (max-width:899px) {
          .props-grid    { grid-template-columns: repeat(2,1fr) !important; }
          .form-name-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width:768px) {
          .stats-grid    { grid-template-columns: 1fr 1fr !important; }
          .about-grid    { grid-template-columns: 1fr !important; }
          .services-grid { grid-template-columns: repeat(2,1fr) !important; }
          .reviews-grid  { grid-template-columns: repeat(2,1fr) !important; }
          .cta-grid      { grid-template-columns: 1fr !important; }
          .cta-left      { min-height: 280px !important; }
          .about-badge   { right: 0 !important; bottom: -16px !important; }
          .about-img     { height: 260px !important; }
          .scroll-ind    { display: none !important; }
        }
        @media (max-width:480px) {
          .props-grid    { grid-template-columns: 1fr !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .reviews-grid  { grid-template-columns: 1fr !important; }
        }
        .srv {
          background: #F5EFE4;
          padding: clamp(24px,3vw,40px);
          position: relative;
          overflow: hidden;
          cursor: default;
        }
        .srv::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #0D4F4A;
          transform: translateY(100%);
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
          z-index: 0;
        }
        .srv:hover::before { transform: translateY(0); }
        .srv:hover .srv-title { color: #F5EFE4; }
        .srv:hover .srv-desc { color: rgba(245,239,228,0.75); }
        .srv:hover .srv-arrow { opacity: 1; transform: scale(1); border-color: rgba(245,239,228,0.3); color: #F5EFE4; }
        .srv:hover .srv-icon { transform: scale(1.15) rotate(-5deg); }
        .srv-icon {
          font-size: 26px;
          margin-bottom: 18px;
          display: block;
          position: relative;
          z-index: 1;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .srv-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(16px,1.8vw,22px);
          font-weight: 300;
          color: #0A0A0A;
          margin-bottom: 10px;
          transition: color 0.4s;
          position: relative;
          z-index: 1;
        }
        .srv-desc {
          font-size: clamp(13px,1.3vw,15px);
          color: #3A3A3A;
          line-height: 1.85;
          transition: color 0.4s;
          position: relative;
          z-index: 1;
        }
        .srv-arrow {
          position: absolute;
          bottom: 24px;
          right: 24px;
          width: 32px;
          height: 32px;
          border: 1px solid rgba(13,79,74,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #0D4F4A;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          z-index: 1;
          opacity: 0;
          transform: scale(0.7);
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════
          LOADER
      ══════════════════════════════════════════════════════════ */}
      {loaderVisible && (
        <div style={{
          position: 'fixed', inset: 0,
          background: '#0D4F4A', zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 0,
          opacity: loaderOpacity, transition: 'opacity 0.8s ease',
          pointerEvents: loaderOpacity < 1 ? 'none' : 'all',
        }}>
          <svg style={{animation:'logoFloat 3s 1.3s ease-in-out infinite, logoGlow 2.2s 1.3s ease-in-out infinite', filter:'drop-shadow(0 0 14px rgba(201,168,76,.35))'}} width="200" height="200" viewBox="0 0 271 271" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="10%" x2="100%" y2="90%">
                <stop offset="0%" stopColor="#9C7B30"/>
                <stop offset="30%" stopColor="#E8C978"/>
                <stop offset="50%" stopColor="#FBEAB8"/>
                <stop offset="70%" stopColor="#D4AE5C"/>
                <stop offset="100%" stopColor="#A9843A"/>
              </linearGradient>
              <linearGradient id="goldGradA" x1="0%" y1="10%" x2="100%" y2="90%">
                <stop offset="0%" stopColor="#9C7B30"/>
                <stop offset="40%" stopColor="#EFD08A"/>
                <stop offset="60%" stopColor="#D4AE5C"/>
                <stop offset="100%" stopColor="#A9843A"/>
              </linearGradient>
            </defs>
            <circle cx="135" cy="135" r="120" fill="none" stroke="#C9A84C" strokeWidth="2.2" strokeDasharray="754" strokeDashoffset="754" style={{animation:'drawring 1s 0.15s cubic-bezier(0.4,0,0.2,1) forwards'}}/>
            <circle cx="135" cy="135" r="115" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.5" strokeDasharray="723" strokeDashoffset="723" style={{animation:'drawring 1s 0.25s cubic-bezier(0.4,0,0.2,1) forwards'}}/>
            <g style={{transform:'translateY(60px)', opacity:0, animation:'letterRise 0.6s 0.65s cubic-bezier(0.16,1,0.3,1) forwards'}}>
              <polygon points="62.9,100.0 74.4,100.0 74.4,216.7 62.9,216.7" fill="#F5EFE4"/>
              <polygon points="74.4,100.0 100.7,100.0 100.7,216.7 74.4,216.7" fill="url(#goldGrad)"/>
              <polygon points="74.4,100.0 100.7,68.0 100.7,100.0" fill="url(#goldGrad)"/>
              <polygon points="98.3,81.6 105.2,81.6 105.2,216.7 98.3,216.7" fill="#0D4F4A" opacity="0.9"/>
            </g>
            <g style={{transform:'translateY(60px)', opacity:0, animation:'letterRise 0.6s 0.8s cubic-bezier(0.16,1,0.3,1) forwards'}}>
              <path d="M 105.2,216.7 L 105.2,199.6 L 148.8,39.3 L 163.6,39.3 L 207.1,199.6 L 207.1,216.7 L 179.6,216.7 L 170.5,184.6 L 141.9,184.6 L 132.7,216.7 Z" fill="url(#goldGradA)"/>
              <polygon points="156.1,90.8 168.2,175.5 144.1,175.5" fill="#0D4F4A"/>
            </g>
          </svg>
          <div style={{
            width: 160, height: 1,
            background: 'linear-gradient(to right,transparent,#C9A84C,transparent)',
            margin: '18px auto', opacity: 0.7,
          }} />
          <div style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 'clamp(28px,6vw,48px)',
            fontWeight: 300, color: '#F5EFE4',
            letterSpacing: '14px', marginTop: 18,
          }}>
            IMAKSA
          </div>
          <div style={{
            fontSize: 10, letterSpacing: '5px',
            color: '#C9A84C', textTransform: 'uppercase', marginTop: 6,
          }}>
            Real Estate LLC
          </div>
          <div style={{
            width: 180, height: 1,
            background: 'rgba(245,239,228,.1)',
            marginTop: 20, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(to right,#C9A84C,#F5EFE4,#C9A84C)',
              animation: 'barfill 1.5s 0.2s forwards',
              width: 0,
            }} />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <motion.video
          src="/hero-video.mp4"
          autoPlay loop muted playsInline
          style={{
            position: 'absolute', top: '-15%', left: 0,
            width: '100%', height: '130%',
            objectFit: 'cover', willChange: 'transform',
            overflow: 'hidden', zIndex: 1,
            y: videoY,
          }}
        />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(180deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,.35) 45%,rgba(0,0,0,.55) 100%)',
        }} />

        {/* Centred content */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', textAlign: 'center',
          padding: 'clamp(80px,10vw,140px) clamp(32px,5vw,72px) clamp(40px,5vw,80px)',
          position: 'relative', zIndex: 3, minHeight: '100vh',
          boxSizing: 'border-box',
          color: '#F5EFE4', maxWidth: 720, margin: '0 auto',
        }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{ marginBottom: 'clamp(16px,2.5vw,26px)' }}
          >
            <motion.p style={{
              x: tagX, opacity: tagOpacity,
              fontSize: 'clamp(10px,1.1vw,11px)', letterSpacing: '4px',
              textTransform: 'uppercase', color: 'rgba(245,239,228,.8)',
              textShadow: '0 2px 8px rgba(0,0,0,.6)', margin: 0,
            }}>
              {`Dubai's Trusted Property Partner`}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
            style={{ marginBottom: 'clamp(16px,2vw,24px)' }}
          >
            <motion.h1 style={{
              y: titleY, opacity: titleOpacity,
              fontFamily: 'var(--font-fraunces)',
              fontSize: 'clamp(36px,5.5vw,68px)',
              fontWeight: 300, lineHeight: 1.1, color: '#F5EFE4',
              textShadow: '0 4px 16px rgba(0,0,0,.6)', margin: 0,
            }}>
              Find Your Home<br />in{' '}
              <em style={{ fontStyle: 'italic', color: '#D4B896' }}>Dubai.</em>
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.7, ease: 'easeOut' }}
          >
            <motion.p style={{
              y: descY, opacity: descOpacity,
              fontSize: 'clamp(13px,1.3vw,15px)', color: 'rgba(245,239,228,.82)',
              lineHeight: 1.85, maxWidth: 460, margin: '0 auto',
              textShadow: '0 2px 10px rgba(0,0,0,.5)',
            }}>
              {`We connect discerning buyers and investors with Dubai's finest properties — built on honesty, backed by expertise, guided by care.`}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.95, ease: 'easeOut' }}
            style={{ marginTop: 'clamp(28px,3.5vw,40px)' }}
          >
            <Link
              href="/properties"
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,.15)',
                border: '1px solid rgba(255,255,255,.45)',
                color: '#F5EFE4',
                fontSize: 'clamp(9px,1.1vw,11px)',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                padding: 'clamp(12px,1.8vw,16px) clamp(28px,4vw,44px)',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'background 0.3s ease, border-color 0.3s ease',
              }}
            >
              Explore Properties
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-ind" style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 10,
        }}>
          <span style={{ fontSize: 12, letterSpacing: '4.5px', textTransform: 'uppercase', color: 'rgba(245,239,228,.55)' }}>
            Scroll
          </span>
          <div style={{
            width: '1.5px', height: 80,
            background: 'rgba(245,239,228,.18)',
            position: 'relative', overflow: 'hidden', borderRadius: 2,
          }}>
            <div style={{
              position: 'absolute', top: '-100%', left: 0,
              width: '100%', height: '50%',
              background: '#D4B896',
              animation: 'scrolldown 2s ease-in-out infinite',
            }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. MARQUEE
      ══════════════════════════════════════════════════════════ */}
      <div style={{ background: '#0D4F4A', padding: '14px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', animation: 'mq 30s linear infinite', width: 'max-content' }}>
          {marqueeItems.map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span style={{
                fontSize: 'clamp(9px,1.2vw,11px)', letterSpacing: '3px',
                textTransform: 'uppercase', color: 'rgba(245,239,228,.6)',
                padding: '0 clamp(20px,3vw,40px)',
              }}>
                {item}
              </span>
              <span style={{
                display: 'inline-block', width: 4, height: 4,
                background: '#D4B896', borderRadius: '50%',
                verticalAlign: 'middle',
                marginLeft: 'clamp(20px,3vw,40px)',
              }} />
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          3. STATS
      ══════════════════════════════════════════════════════════ */}
      <div
        className="stats-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: '#F5EFE4' }}
      >
        {[
          { valueEl: <span ref={ref500}>{count500}+</span>, label: 'Properties Sold' },
          { valueEl: <span ref={ref12}>{count12}+</span>, label: 'Years Experience' },
          { valueEl: <span ref={ref98}>{count98}%</span>, label: 'Client Satisfaction' },
          { valueEl: <span>2B+</span>, label: 'AED in Transactions' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp} custom={i * 0.1}
            style={{
              padding: 'clamp(20px,3vw,36px) clamp(16px,2.5vw,28px)',
              borderRight: i < 3 ? '1px solid rgba(13,79,74,.08)' : 'none',
              textAlign: 'center',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: 'clamp(24px,3.5vw,44px)',
              fontWeight: 300, color: '#0D4F4A',
            }}>
              {stat.valueEl}
            </div>
            <div style={{
              fontSize: 'clamp(8px,.9vw,10px)', letterSpacing: '1.5px',
              textTransform: 'uppercase', color: '#9B9B8A', marginTop: 8,
            }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          4. FEATURED PROPERTIES
      ══════════════════════════════════════════════════════════ */}
      <section style={{ background: '#0D4F4A', padding: 'clamp(40px,5.5vw,80px) clamp(16px,5vw,80px)' }}>
        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp} custom={0}
          style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', marginBottom: 'clamp(24px,3.5vw,44px)',
            flexWrap: 'wrap', gap: 16,
          }}
        >
          <div>
            <div style={{
              fontSize: 9, letterSpacing: '3px',
              textTransform: 'uppercase', color: '#D4B896', marginBottom: 10,
            }}>
              Featured Listings
            </div>
            <h2 style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: 'clamp(24px,3.2vw,44px)',
              fontWeight: 300, color: '#F5EFE4', margin: 0, lineHeight: 1.15,
            }}>
              Explore <em style={{ color: '#D4B896' }}>Properties</em><br />Across Dubai
            </h2>
          </div>
          <Link href="/properties" style={{
            fontSize: 10, letterSpacing: '2px',
            textTransform: 'uppercase', color: '#D4B896',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            View All →
          </Link>
        </motion.div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 'clamp(16px,3vw,32px)',
          marginBottom: 'clamp(20px,3vw,36px)', flexWrap: 'wrap',
        }}>
          {['All', 'For Sale', 'For Rent', 'Off-Plan'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '6px 0', fontSize: 10, letterSpacing: '2px',
                textTransform: 'uppercase',
                color: activeTab === tab ? '#D4B896' : 'rgba(245,239,228,.5)',
                borderBottom: activeTab === tab ? '2px solid #D4B896' : '2px solid transparent',
                transition: 'color 0.2s ease, border-color 0.2s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="props-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
          {filteredProps.length > 0 ? filteredProps.map(p => (
            <motion.div
              key={p._id}
              initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp} custom={0.05}
            >
              <PropertyCard property={p} />
            </motion.div>
          )) : (
            <div style={{
              gridColumn: '1/-1', textAlign: 'center',
              padding: '48px 0', color: 'rgba(245,239,228,.4)', fontSize: 13,
            }}>
              No properties found.
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. ABOUT
      ══════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: 'clamp(40px,5.5vw,80px) clamp(16px,5vw,80px)' }}>
        <div
          className="about-grid"
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(32px,5vw,72px)', alignItems: 'center',
          }}
        >
          {/* Left: image */}
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp} custom={0}
            style={{ position: 'relative' }}
          >
            <img
              src="/about-hero.jpg"
              alt="About IMAKSA"
              className="about-img"
              loading="lazy"
              style={{
                width: '100%',
                height: 'clamp(280px,40vw,520px)',
                objectFit: 'cover', display: 'block',
              }}
            />
          </motion.div>

          {/* Right: content */}
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp} custom={0.15}
          >
            <div style={{
              fontSize: 9, letterSpacing: '3px',
              textTransform: 'uppercase', color: '#0D4F4A', marginBottom: 16,
            }}>
              About IMAKSA
            </div>
            <h2 style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: 'clamp(24px,3.5vw,44px)',
              fontWeight: 300, color: '#0D4F4A',
              margin: '0 0 20px', lineHeight: 1.2,
            }}>
              Dubai Real Estate{' '}
              <em style={{ color: '#8B6E47' }}>Solutions</em>{' '}
              Focused Around You
            </h2>
            <p style={{ fontSize: 'clamp(13px,1.2vw,15px)', lineHeight: 1.8, color: '#555', marginBottom: 28 }}>
              {`IMAKSA has been at the forefront of Dubai's real estate market. We specialize in luxury residential properties, off-plan investments, and bespoke property management — serving clients from all over worldwide.`}
            </p>

            {/* Features grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', marginBottom: 32 }}>
              {['RERA Licensed Brokerage', 'Off-Plan Specialists', 'Golden Visa Guidance', 'International Clientele'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'clamp(11px,1vw,13px)', color: '#3A3A3A' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#D4B896', flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>

            <Link href="/about" style={{
              display: 'inline-block',
              background: '#0D4F4A', color: '#F5EFE4',
              padding: '13px 32px', fontSize: 10,
              letterSpacing: '2.5px', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>
              Learn More →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. SERVICES
      ══════════════════════════════════════════════════════════ */}
      <section style={{ background: '#F5EFE4', padding: 'clamp(40px,5.5vw,80px) clamp(16px,5vw,80px)' }}>
        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp} custom={0}
          style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,60px)' }}
        >
          <div style={{ fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', color: '#8B6E47', marginBottom: 12 }}>
            What We Offer
          </div>
          <h2 style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 'clamp(24px,3.2vw,44px)',
            fontWeight: 300, color: '#0D4F4A', margin: 0,
          }}>
            Our <em style={{ color: '#8B6E47' }}>Services</em>
          </h2>
        </motion.div>

        <div className="services-grid">
          {[
            { icon: '🏠', title: 'Buy Property', desc: `Find your perfect home or investment from our curated selection of Dubai's finest properties across all communities.` },
            { icon: '🔑', title: 'Rent Property', desc: 'Discover premium rental properties managed by professionals. Short-term and long-term options available.' },
            { icon: '💼', title: 'Sell Property', desc: `Maximize your property's value with our expert marketing, strategic pricing, and international buyer network.` },
            { icon: '📐', title: 'Off-Plan Investments', desc: `Access exclusive off-plan projects from Dubai's top developers at pre-launch prices with flexible payment plans.` },
            { icon: '🌟', title: 'Golden Visa', desc: 'Invest AED 2M+ and secure UAE residency. We guide you through the entire Golden Visa process seamlessly.' },
            { icon: '🏢', title: 'Property Management', desc: 'Full-service property management including tenant placement, maintenance, and rental income optimization.' },
          ].map((service, i) => (
            <div key={i} className="srv">
              <span className="srv-icon">{service.icon}</span>
              <div className="srv-title">{service.title}</div>
              <div className="srv-desc">{service.desc}</div>
              <div className="srv-arrow">→</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          7. REVIEWS
      ══════════════════════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: 'clamp(40px,5.5vw,80px) clamp(16px,5vw,80px)' }}>
        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp} custom={0}
          style={{ textAlign: 'center', marginBottom: 'clamp(32px,5vw,60px)' }}
        >
          <div style={{ fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', color: '#8B6E47', marginBottom: 12 }}>
            Client Testimonials
          </div>
          <h2 style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 'clamp(24px,3.2vw,44px)',
            fontWeight: 300, color: '#0D4F4A', margin: 0,
          }}>
            What Our <em style={{ color: '#8B6E47' }}>Clients</em> Say
          </h2>
        </motion.div>

        <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
          {REVIEWS.map((r, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp} custom={i * 0.1}
              style={{ background: '#F5EFE4', padding: 'clamp(22px,3vw,36px)' }}
            >
              <div style={{ fontSize: 13, letterSpacing: '2px', color: '#D4B896', marginBottom: 16 }}>★★★★★</div>
              <p style={{
                fontStyle: 'italic', color: '#3A3A3A',
                lineHeight: 1.75, fontSize: 'clamp(13px,1.1vw,14px)', marginBottom: 20,
              }}>
                &ldquo;{r.text}&rdquo;
              </p>
              <div style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: '#0D4F4A', marginBottom: 4 }}>
                {r.name}
              </div>
              <div style={{ fontSize: 10, color: '#9B9B8A' }}>{r.country}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          8. CTA + CONTACT FORM
      ══════════════════════════════════════════════════════════ */}
      <section className="cta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 560 }}>
        {/* Left dark panel */}
        <motion.div
          className="cta-left"
          initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp} custom={0}
          style={{
            position: 'relative',
            backgroundImage: `url(https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=900&q=80)`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            padding: 'clamp(40px,6vw,80px)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,38,35,.82)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: 'clamp(26px,3.5vw,44px)',
              fontWeight: 300, color: '#F5EFE4',
              margin: '0 0 16px', lineHeight: 1.2,
            }}>
              Start Your<br />
              <em style={{ color: '#D4B896' }}>Property Journey</em><br />
              Today
            </h2>
            <p style={{
              fontSize: 'clamp(13px,1.2vw,15px)',
              color: 'rgba(245,239,228,.75)', lineHeight: 1.75, marginBottom: 36,
            }}>
              {`Whether buying your first home or growing a portfolio — we're here every step of the way.`}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '📞', label: 'Call Us', value: settings.phone || '+971 4 2669295' },
                { icon: '💬', label: 'WhatsApp', value: settings.wa || settings.whatsapp || '+971 50 695 7009' },
                { icon: '✉️', label: 'Email', value: settings.email || 'info@imaksa.ae' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <div style={{
                      fontSize: 8, letterSpacing: '2px',
                      textTransform: 'uppercase', color: '#D4B896', marginBottom: 2,
                    }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 'clamp(12px,1.2vw,14px)', color: '#F5EFE4' }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right cream panel — form (divs + onClick, no <form> tag) */}
        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp} custom={0.15}
          style={{ background: '#F5EFE4', padding: 'clamp(36px,5vw,68px)' }}
        >
          <h3 style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 'clamp(20px,2.5vw,30px)',
            fontWeight: 300, color: '#0D4F4A', margin: '0 0 28px',
          }}>
            Get in <em style={{ color: '#8B6E47' }}>Touch</em>
          </h3>

          {formSent ? (
            <div style={{
              padding: '24px', background: 'rgba(13,79,74,.08)',
              fontSize: 'clamp(13px,1.2vw,15px)', color: '#0D4F4A', lineHeight: 1.7,
            }}>
              ✅ Thank you! Our team will contact you within 24 hours.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-name-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
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
              <select
                value={formData.interest}
                onChange={e => setFormData(p => ({ ...p, interest: e.target.value }))}
                style={{ ...inputStyle, color: formData.interest ? '#0A0A0A' : '#9B9B8A' }}
              >
                <option value="">Property Interest</option>
                {['Buy', 'Rent', 'Sell', 'Off-Plan Investment', 'Golden Visa', 'Other'].map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <textarea
                placeholder="Your Message"
                rows={3}
                value={formData.message}
                onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }}
              />
              <div
                onClick={!formLoading ? handleContactSubmit : undefined}
                style={{
                  background: '#0D4F4A', color: '#F5EFE4',
                  width: '100%', padding: '14px',
                  fontSize: 10, letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  cursor: formLoading ? 'wait' : 'pointer',
                  border: 'none', textAlign: 'center',
                  userSelect: 'none',
                }}
              >
                {formLoading ? `Sending…` : 'Submit Enquiry'}
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          9. SUBSCRIBE POPUP
      ══════════════════════════════════════════════════════════ */}
      {showPopup && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setShowPopup(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,.65)', zIndex: 9990,
              backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
              animation: 'subFadeIn 0.3s ease forwards',
            }}
          />
          {/* Popup box */}
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            background: '#0D4F4A', color: '#F5EFE4',
            padding: 'clamp(32px,5vw,52px)',
            width: 'min(460px,92vw)', zIndex: 9991,
            animation: 'subSlideIn 0.35s ease forwards',
            borderTop: '2px solid',
            borderImageSource: 'linear-gradient(to right,#9C7B30,#E8C978,#C9A84C)',
            borderImageSlice: 1,
          }}>
            {/* Close button */}
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: 'absolute', top: 14, right: 16,
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(245,239,228,.45)', fontSize: 24, lineHeight: 1,
              }}
            >
              ×
            </button>

            {subSent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12, color: '#C9A84C' }}>✓</div>
                <div style={{ fontSize: 14, color: '#D4B896' }}>
                  {`You're subscribed!`}
                </div>
              </div>
            ) : (
              <>
                <div style={{
                  fontSize: 9, letterSpacing: '4px',
                  textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12,
                }}>
                  Exclusive Listings
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontSize: 'clamp(22px,3.8vw,30px)',
                  fontWeight: 300, margin: '0 0 10px', lineHeight: 1.2,
                }}>
                  Find Your Perfect<br />
                  <em style={{ color: '#C9A84C' }}>Property in Dubai</em>
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(245,239,228,.58)', marginBottom: 24, lineHeight: 1.6 }}>
                  Get the latest listings and market insights delivered to you.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    placeholder="Your Name"
                    value={subData.name}
                    onChange={e => setSubData(p => ({ ...p, name: e.target.value }))}
                    style={popupInputStyle}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={subData.email}
                    onChange={e => setSubData(p => ({ ...p, email: e.target.value }))}
                    style={popupInputStyle}
                  />
                  <div
                    onClick={!subLoading ? handleSubSubmit : undefined}
                    style={{
                      background: '#C9A84C', color: '#0A0A0A',
                      width: '100%', padding: '15px',
                      fontSize: 11, letterSpacing: '2.5px',
                      textTransform: 'uppercase',
                      cursor: subLoading ? 'wait' : 'pointer',
                      fontWeight: 600, textAlign: 'center',
                      userSelect: 'none',
                    }}
                  >
                    {subLoading ? `Subscribing…` : 'Subscribe Now'}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  )
}
