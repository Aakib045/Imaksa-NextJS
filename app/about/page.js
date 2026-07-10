'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

function useCountUp(target, duration = 1600) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
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
    }, { threshold: 0.4 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])
  return [count, ref]
}

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
}

const VALUES = [
  { icon: '🤝', title: 'Transparency', desc: 'No hidden fees, no surprises. We believe every client deserves complete clarity at every step of the process.' },
  { icon: '🎯', title: 'Expertise', desc: `Navigating Dubai's market means we see opportunities, risks, and deals that others simply miss.` },
  { icon: '💎', title: 'Excellence', desc: 'From first call to final handover, we deliver a premium experience that matches the quality of the properties we represent.' },
  { icon: '❤️', title: 'Care', desc: `We treat every client like family — with the same dedication and honesty we'd want for our own loved ones.` },
  { icon: '🌍', title: 'Global Reach', desc: 'Serving clients we understand the needs of NRIs, expats, and international investors.' },
  { icon: '📈', title: 'Results', desc: 'Client satisfaction speaks louder than any promise we could make.' },
]

const STATS = [
  { target: 500, suffix: '+', label: 'Properties Sold' },
  { target: 12, suffix: '+', label: 'Years Experience' },
  { target: 98, suffix: '%', label: 'Client Satisfaction' },
  { target: null, static: '2B+', label: 'AED in Transactions' },
]

function useBreakpoints() {
  const [bp, setBp] = useState({ is480: false, is560: false, is768: false, is900: false })
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      setBp({ is480: w < 480, is560: w < 560, is768: w < 768, is900: w < 900 })
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return bp
}

export default function AboutPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const { is480, is560, is768, is900 } = useBreakpoints()
  const [count500, ref500] = useCountUp(500)
  const [count12, ref12] = useCountUp(12)
  const [count98, ref98] = useCountUp(98)

  useEffect(() => {
    fetch('/api/team')
      .then(r => r.json())
      .then(d => { if (d.success) setMembers(d.members || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ fontFamily: 'var(--font-inter)' }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>

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
          style={{
            fontSize: 'clamp(8px,1.3vw,10px)',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            color: 'rgba(245,239,228,.6)',
            marginBottom: '16px',
            position: 'relative',
          }}
        >
          Who We Are
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 'clamp(32px,5vw,68px)',
            fontWeight: 300,
            color: '#F5EFE4',
            lineHeight: 1.1,
            position: 'relative',
            margin: 0,
          }}
        >
          About <em style={{ fontStyle: 'italic' }}>IMAKSA</em>
        </motion.h1>
      </section>

      {/* STORY */}
      <section style={{ background: '#fff', padding: `clamp(48px,6vw,88px) clamp(16px,5vw,72px)` }}>
        <motion.div
          {...fadeUp}
          style={{
            display: 'grid',
            gridTemplateColumns: is768 ? '1fr' : '1fr 1fr',
            gap: 'clamp(36px,7vw,100px)',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80"
              alt="Dubai"
              loading="lazy"
              style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div>
            <p style={{ fontSize: 'clamp(8px,1.3vw,10px)', letterSpacing: '5px', textTransform: 'uppercase', color: '#2E8B84', marginBottom: '16px' }}>
              Our Story
            </p>
            <h2 style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: 'clamp(24px,3.5vw,48px)',
              fontWeight: 300,
              color: '#0D4F4A',
              lineHeight: 1.15,
              margin: 0,
            }}>
              Rooted in <em style={{ fontStyle: 'italic' }}>Trust,</em><br />Built on Results
            </h2>
            {[
              `IMAKSA Real Estate has grown from a boutique agency into one of Dubai's most trusted property firms. We've helped families, investors, and businesses find their perfect space in the UAE.`,
              `Our philosophy is simple — treat every client like family. No hidden fees, no pressure tactics. Just honest advice, deep market knowledge, and genuine care for your success.`,
              `From first-time buyers to seasoned investors building multi-billion AED portfolios, we bring the same dedication to every relationship we build.`,
            ].map((para, i) => (
              <p key={i} style={{ fontSize: 'clamp(13px,1.3vw,15px)', lineHeight: 1.85, color: '#3A3A3A', marginTop: '16px' }}>
                {para}
              </p>
            ))}
          </div>
        </motion.div>
      </section>

      {/* STATS ROW */}
      <section style={{
        background: '#0D4F4A',
        display: 'grid',
        gridTemplateColumns: is560 ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
      }}>
        {[
          { valueEl: <span ref={ref500}>{count500}+</span>, label: 'Properties Sold' },
          { valueEl: <span ref={ref12}>{count12}+</span>, label: 'Years Experience' },
          { valueEl: <span ref={ref98}>{count98}%</span>, label: 'Client Satisfaction' },
          { valueEl: <span>2B+</span>, label: 'AED in Transactions' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            {...fadeUp}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            style={{
              padding: `clamp(32px,5vw,60px) clamp(12px,2vw,32px)`,
              textAlign: 'center',
              borderRight: is560
                ? (i % 2 === 0 ? '1px solid rgba(245,239,228,.1)' : 'none')
                : (i < 3 ? '1px solid rgba(245,239,228,.1)' : 'none'),
            }}
          >
            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(26px,4vw,48px)', fontWeight: 300, color: '#F5EFE4' }}>
              {stat.valueEl}
            </div>
            <div style={{ fontSize: 'clamp(7px,1.1vw,9px)', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(245,239,228,.5)', marginTop: '8px' }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </section>

      {/* VALUES */}
      <section style={{ background: '#F5EFE4', padding: `clamp(48px,6vw,88px) clamp(16px,5vw,72px)` }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.p {...fadeUp} style={{ fontSize: 'clamp(8px,1.3vw,10px)', letterSpacing: '5px', textTransform: 'uppercase', color: '#2E8B84', marginBottom: '16px' }}>
            What We Stand For
          </motion.p>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(24px,3.5vw,48px)', fontWeight: 300, color: '#0D4F4A', margin: 0 }}
          >
            Our <em style={{ fontStyle: 'italic' }}>Core Values</em>
          </motion.h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: is480 ? '1fr' : is768 ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
            gap: 'clamp(16px,2.5vw,28px)',
            marginTop: 'clamp(36px,5vw,64px)',
          }}>
            {VALUES.map((v, i) => <ValueCard key={i} v={v} />)}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ background: '#FAFAF8', padding: `clamp(48px,6vw,88px) clamp(16px,5vw,72px)` }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.p {...fadeUp} style={{ fontSize: 'clamp(8px,1.3vw,10px)', letterSpacing: '5px', textTransform: 'uppercase', color: '#2E8B84', marginBottom: '16px' }}>
            The People Behind IMAKSA
          </motion.p>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(24px,3.5vw,48px)', fontWeight: 300, color: '#0D4F4A', margin: 0 }}
          >
            Meet Our <em style={{ fontStyle: 'italic' }}>Team</em>
          </motion.h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: is480 ? '1fr' : is900 ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
            gap: 'clamp(16px,2.5vw,28px)',
            marginTop: 'clamp(36px,5vw,64px)',
          }}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : members.map((m, i) => <TeamCard key={m._id || i} member={m} />)
            }
          </div>
        </div>
      </section>
    </div>
  )
}

function ValueCard({ v }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        padding: `clamp(28px,4vw,48px) clamp(20px,3vw,36px)`,
        borderBottom: hovered ? '3px solid #0D4F4A' : '3px solid transparent',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all .4s',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontSize: 'clamp(28px,4vw,40px)', marginBottom: 'clamp(14px,2vw,22px)' }}>{v.icon}</div>
      <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(18px,2.2vw,24px)', color: '#0D4F4A', marginBottom: '12px' }}>{v.title}</div>
      <div style={{ fontSize: 'clamp(13px,1.3vw,15px)', color: '#3A3A3A', lineHeight: 1.85 }}>{v.desc}</div>
    </motion.div>
  )
}

function TeamCard({ member }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,.1)' : '0 2px 8px rgba(0,0,0,.04)',
        transition: '.4s',
      }}
    >
      <div style={{ overflow: 'hidden', height: 'clamp(240px,26vw,320px)' }}>
        <img
          src={member.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'}
          alt={member.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: '.7s',
            display: 'block',
          }}
        />
      </div>
      <div style={{ padding: 'clamp(16px,2vw,24px)' }}>
        <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(16px,1.8vw,20px)', color: '#0D4F4A', marginBottom: '4px' }}>{member.name}</div>
        <div style={{ fontSize: 'clamp(9px,1.1vw,11px)', letterSpacing: '2px', textTransform: 'uppercase', color: '#2E8B84', marginBottom: '8px' }}>{member.role}</div>
        <div style={{ fontSize: 'clamp(13px,1.3vw,15px)', color: '#3A3A3A', lineHeight: 1.85 }}>{member.bio}</div>
      </div>
    </motion.div>
  )
}

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', overflow: 'hidden' }}>
      <div style={{ height: 'clamp(240px,26vw,320px)', background: '#E8E8E8', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ padding: 'clamp(16px,2vw,24px)' }}>
        <div style={{ height: '20px', background: '#E8E8E8', borderRadius: '2px', marginBottom: '8px', width: '70%', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '12px', background: '#E8E8E8', borderRadius: '2px', marginBottom: '8px', width: '50%', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '12px', background: '#E8E8E8', borderRadius: '2px', width: '90%', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
    </div>
  )
}
