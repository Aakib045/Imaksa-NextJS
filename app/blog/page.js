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

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80'

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

function useBreakpoints() {
  const [bp, setBp] = useState({ is520: false, is700: false, is900: false })
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      setBp({ is520: w < 520, is700: w < 700, is900: w < 900 })
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return bp
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [subEmail, setSubEmail] = useState('')
  const [subState, setSubState] = useState('idle')
  const { is520, is700, is900 } = useBreakpoints()

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('imaksa_subscribed')) {
      setSubState('success')
    }
    fetch('/api/blogs', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (d.success) setBlogs(d.blogs || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id)

  const handleSubscribe = async () => {
    if (!subEmail.trim() || subState !== 'idle') return
    setSubState('loading')
    try {
      await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Subscriber', email: subEmail, source: 'blog' }),
      })
      localStorage.setItem('imaksa_subscribed', '1')
      setSubState('success')
    } catch {
      setSubState('idle')
    }
  }

  const featured = blogs[0]
  const rest = blogs.slice(1)

  return (
    <div style={{ fontFamily: 'var(--font-inter)' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .sub-input::placeholder { color: rgba(245,239,228,.4); }
      `}</style>

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
          Insights &amp; Market News
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(32px,5vw,68px)', fontWeight: 300, color: '#F5EFE4', lineHeight: 1.1, position: 'relative', margin: 0 }}
        >
          Our <em style={{ fontStyle: 'italic' }}>Blog</em>
        </motion.h1>
      </section>

      {/* BLOG SECTION */}
      <section style={{ padding: `clamp(48px,6vw,80px) clamp(16px,5vw,72px)`, background: '#FAFAF8' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: is520 ? '1fr' : is900 ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
              gap: 'clamp(20px,3vw,36px)',
            }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ background: '#fff', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,.06)' }}>
                  <div style={{ height: 'clamp(180px,20vw,240px)', background: '#E8E8E8', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  <div style={{ padding: 'clamp(18px,2vw,24px)' }}>
                    <div style={{ height: '10px', background: '#E8E8E8', borderRadius: '2px', marginBottom: '12px', width: '40%', animation: 'pulse 1.5s ease-in-out infinite' }} />
                    <div style={{ height: '20px', background: '#E8E8E8', borderRadius: '2px', marginBottom: '8px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                    <div style={{ height: '14px', background: '#E8E8E8', borderRadius: '2px', width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <motion.div {...fadeUp} style={{ textAlign: 'center', padding: 'clamp(48px,6vw,80px) 0', color: '#3A3A3A', fontSize: 'clamp(14px,1.5vw,17px)' }}>
              No articles yet — Check back soon for insights and market updates.
            </motion.div>
          ) : (
            <>
              {/* FEATURED */}
              {featured && (
                <motion.div {...fadeUp} style={{ marginBottom: 'clamp(20px,3vw,36px)' }}>
                  <FeaturedCard blog={featured} expandedId={expandedId} onToggle={toggle} isMobile={is700} />
                </motion.div>
              )}

              {/* GRID */}
              {rest.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: is520 ? '1fr' : is900 ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
                  gap: 'clamp(20px,3vw,36px)',
                }}>
                  {rest.map((blog, i) => (
                    <motion.div
                      key={blog._id}
                      initial={{ opacity: 0, y: 32 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                    >
                      <BlogCard blog={blog} expandedId={expandedId} onToggle={toggle} />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{
        background: '#0D4F4A',
        padding: `clamp(56px,7vw,96px) clamp(16px,5vw,72px)`,
        textAlign: 'center',
      }}>
        <motion.div {...fadeUp}>
          <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(24px,3.2vw,44px)', fontWeight: 300, color: '#F5EFE4', margin: '0 0 16px' }}>
            Stay <em style={{ fontStyle: 'italic' }}>Ahead</em> of the Market
          </h2>
          <p style={{ fontSize: 'clamp(13px,1.4vw,15px)', color: 'rgba(245,239,228,.6)', marginBottom: 'clamp(28px,4vw,40px)' }}>
            Get weekly Dubai real estate insights delivered to your inbox. No spam, ever.
          </p>
          {subState === 'success' ? (
            <p style={{ color: '#F5EFE4', fontSize: 'clamp(14px,1.5vw,16px)', fontFamily: 'var(--font-fraunces)' }}>
              ✅ You&apos;re subscribed! Welcome to the IMAKSA community.
            </p>
          ) : (
            <div style={{ display: 'flex', maxWidth: '480px', margin: '0 auto' }}>
              <input
                className="sub-input"
                type="email"
                placeholder="Your email address"
                value={subEmail}
                onChange={e => setSubEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                style={{
                  flex: 1,
                  background: 'rgba(245,239,228,.1)',
                  border: '1px solid rgba(245,239,228,.2)',
                  borderRight: 'none',
                  color: '#F5EFE4',
                  padding: `clamp(13px,1.8vw,16px) clamp(16px,2.5vw,24px)`,
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'clamp(12px,1.3vw,14px)',
                  outline: 'none',
                  minWidth: 0,
                }}
              />
              <div
                onClick={handleSubscribe}
                style={{
                  background: '#F5EFE4',
                  color: '#0D4F4A',
                  padding: `clamp(13px,1.8vw,16px) clamp(16px,2.5vw,24px)`,
                  fontFamily: 'var(--font-inter)',
                  fontSize: 'clamp(11px,1.2vw,13px)',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                }}
              >
                {subState === 'loading' ? '...' : 'Subscribe'}
              </div>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  )
}

function FeaturedCard({ blog, expandedId, onToggle, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const isExpanded = expandedId === blog._id

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
          background: '#fff',
          overflow: 'hidden',
          boxShadow: hovered ? '0 12px 48px rgba(0,0,0,.12)' : '0 2px 20px rgba(0,0,0,.06)',
          transition: 'box-shadow .3s',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 'clamp(220px,30vw,380px)' }}>
          <img
            src={blog.img || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80'}
            alt={blog.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: '.7s',
            }}
          />
        </div>
        <div style={{
          padding: 'clamp(28px,4vw,56px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '12px',
        }}>
          <div style={{ fontSize: 'clamp(8px,1vw,9px)', letterSpacing: '3px', textTransform: 'uppercase', color: '#2E8B84' }}>
            {blog.cat}
          </div>
          <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(22px,3vw,36px)', fontWeight: 300, color: '#0D4F4A', lineHeight: 1.2, margin: 0 }}>
            {blog.title}
          </h2>
          <div style={{ fontSize: 'clamp(9px,1.1vw,10px)', letterSpacing: '2px', textTransform: 'uppercase', color: '#aaa' }}>
            {formatDate(blog.createdAt)} &nbsp;&middot;&nbsp; {blog.readTime}
          </div>
          <p style={{ fontSize: 'clamp(13px,1.3vw,15px)', color: '#3A3A3A', lineHeight: 1.85, margin: 0 }}>
            {blog.desc}
          </p>
          <div
            onClick={() => onToggle(blog._id)}
            style={{
              alignSelf: 'flex-start',
              fontSize: 'clamp(12px,1.3vw,14px)',
              color: '#0D4F4A',
              letterSpacing: '1px',
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              fontFamily: 'var(--font-inter)',
              userSelect: 'none',
            }}
          >
            {isExpanded ? 'Show Less ↑' : 'Read More →'}
          </div>
        </div>
      </div>
      {isExpanded && blog.content && (
        <div style={{ background: '#F4F0E8', padding: `clamp(32px,4vw,56px) clamp(16px,5vw,72px)` }}>
          {blog.content.split('\n\n').map((para, i) => (
            <p key={i} style={{ fontSize: 'clamp(13px,1.3vw,15px)', color: '#3A3A3A', lineHeight: 1.85, marginBottom: '16px' }}>
              {para}
            </p>
          ))}
        </div>
      )}
    </>
  )
}

function BlogCard({ blog, expandedId, onToggle }) {
  const [hovered, setHovered] = useState(false)
  const isExpanded = expandedId === blog._id

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#fff',
          overflow: 'hidden',
          boxShadow: hovered ? '0 12px 40px rgba(0,0,0,.1)' : '0 2px 16px rgba(0,0,0,.06)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'all .4s',
        }}
      >
        <div style={{ overflow: 'hidden', height: 'clamp(180px,20vw,240px)' }}>
          <img
            src={blog.img || FALLBACK_IMG}
            alt={blog.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: '.5s',
            }}
          />
        </div>
        <div style={{ padding: 'clamp(18px,2vw,24px)' }}>
          <div style={{ fontSize: 'clamp(7px,1vw,9px)', letterSpacing: '3px', textTransform: 'uppercase', color: '#2E8B84', marginBottom: '8px' }}>
            {blog.cat}
          </div>
          <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(16px,1.8vw,21px)', fontWeight: 300, color: '#0D4F4A', lineHeight: 1.3, margin: '0 0 8px' }}>
            {blog.title}
          </h3>
          <div style={{ fontSize: 'clamp(8px,1vw,9px)', textTransform: 'uppercase', color: '#aaa', marginBottom: '10px', letterSpacing: '1px' }}>
            {formatDate(blog.createdAt)} &nbsp;&middot;&nbsp; {blog.readTime}
          </div>
          <p style={{ fontSize: 'clamp(13px,1.3vw,15px)', color: '#3A3A3A', lineHeight: 1.85, margin: '0 0 12px' }}>
            {blog.desc}
          </p>
          <div
            onClick={() => onToggle(blog._id)}
            style={{
              fontSize: 'clamp(11px,1.2vw,13px)',
              color: '#0D4F4A',
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              letterSpacing: '1px',
              fontFamily: 'var(--font-inter)',
              userSelect: 'none',
            }}
          >
            {isExpanded ? 'Show Less ↑' : 'Read More →'}
          </div>
        </div>
      </div>
      {isExpanded && blog.content && (
        <div style={{ background: '#F4F0E8', padding: `clamp(24px,3vw,40px) clamp(20px,2.5vw,32px)` }}>
          {blog.content.split('\n\n').map((para, i) => (
            <p key={i} style={{ fontSize: 'clamp(13px,1.3vw,15px)', color: '#3A3A3A', lineHeight: 1.85, marginBottom: '12px' }}>
              {para}
            </p>
          ))}
        </div>
      )}
    </>
  )
}
