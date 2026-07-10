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

const darkInput = {
  width: '100%',
  background: 'rgba(245,239,228,.08)',
  border: '1px solid rgba(245,239,228,.18)',
  color: '#F5EFE4',
  padding: 'clamp(13px,1.8vw,16px) clamp(14px,2vw,18px)',
  fontFamily: 'var(--font-inter)',
  fontSize: 'clamp(11px,1.3vw,13px)',
  marginBottom: 'clamp(12px,1.6vw,16px)',
  outline: 'none',
  boxSizing: 'border-box',
  display: 'block',
}

const WHY_CARDS = [
  { icon: '💰', title: 'Top Commissions', desc: 'Industry-leading commission structure with uncapped earning potential. Our top agents earn AED 1M+ annually.' },
  { icon: '📚', title: 'Training & Growth', desc: 'Comprehensive onboarding, RERA certification support, and ongoing mentorship from senior agents.' },
  { icon: '🌍', title: 'Global Network', desc: 'Access to our international client database and developer relationships built over 12+ years.' },
  { icon: '🏆', title: 'Award-Winning Brand', desc: 'Join a recognized, trusted brand that clients already know and trust — making your job easier from day one.' },
  { icon: '📍', title: 'Prime Location', desc: `Work from our Business Bay office in the heart of Dubai's commercial and property hub.` },
  { icon: '🤝', title: 'Supportive Culture', desc: `A collaborative, diverse team where everyone supports each other's success — no politics, just results.` },
]

const JOBS = [
  { dept: 'Sales', title: 'Senior Property Consultant', pay: 'Commission + Base' },
  { dept: 'Sales', title: 'Junior Real Estate Agent', pay: 'Commission + Training' },
  { dept: 'Investment', title: 'Investment Advisory Specialist', pay: 'Competitive Package' },
  { dept: 'Marketing', title: 'Digital Marketing Manager', pay: 'Fixed Salary' },
  { dept: 'Operations', title: 'Property Manager', pay: 'Fixed + Bonus' },
]

function useBreakpoints() {
  const [bp, setBp] = useState({ is480: false, is768: false })
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      setBp({ is480: w < 480, is768: w < 768 })
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return bp
}

export default function CareersPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [position, setPosition] = useState('Senior Property Consultant')
  const [experience, setExperience] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { is480, is768 } = useBreakpoints()

  const scrollToApply = () =>
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div style={{ fontFamily: 'var(--font-inter)' }}>
      <style>{`.dark-input::placeholder { color: rgba(245,239,228,.4); } .dark-input option { background: #0D4F4A; color: #F5EFE4; }`}</style>

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
          background: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80') center/cover`,
          opacity: 0.15,
          pointerEvents: 'none',
        }} />
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: 'clamp(8px,1.3vw,10px)', letterSpacing: '5px', textTransform: 'uppercase', color: 'rgba(245,239,228,.6)', marginBottom: '16px', position: 'relative' }}
        >
          Join Our Team
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(32px,5vw,68px)', fontWeight: 300, color: '#F5EFE4', lineHeight: 1.1, position: 'relative', margin: 0 }}
        >
          Build Your <em style={{ fontStyle: 'italic' }}>Career</em>
        </motion.h1>
      </section>

      {/* WHY JOIN */}
      <section style={{ background: '#fff', padding: `clamp(48px,6vw,80px) clamp(16px,5vw,72px)` }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.p {...fadeUp} style={{ fontSize: 'clamp(8px,1.3vw,10px)', letterSpacing: '5px', textTransform: 'uppercase', color: '#2E8B84', marginBottom: '16px' }}>
            Why IMAKSA
          </motion.p>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(24px,3.5vw,48px)', fontWeight: 300, color: '#0D4F4A', margin: 0 }}
          >
            Why Join <em style={{ fontStyle: 'italic' }}>Our Team?</em>
          </motion.h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: is480 ? '1fr' : is768 ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
            gap: 'clamp(16px,2.5vw,28px)',
            marginTop: 'clamp(36px,5vw,60px)',
          }}>
            {WHY_CARDS.map((c, i) => <WhyCard key={i} c={c} />)}
          </div>
        </div>
      </section>

      {/* OPEN ROLES */}
      <section style={{ background: '#F5EFE4', padding: `clamp(48px,6vw,80px) clamp(16px,5vw,72px)` }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.p {...fadeUp} style={{ fontSize: 'clamp(8px,1.3vw,10px)', letterSpacing: '5px', textTransform: 'uppercase', color: '#2E8B84', marginBottom: '16px' }}>
            Open Positions
          </motion.p>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(24px,3.5vw,48px)', fontWeight: 300, color: '#0D4F4A', margin: `0 0 clamp(24px,3vw,36px)` }}
          >
            Current <em style={{ fontStyle: 'italic' }}>Openings</em>
          </motion.h2>

          {JOBS.map((job, i) => (
            <JobRow key={i} job={job} onApply={scrollToApply} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* APPLY FORM */}
      <section id="apply" style={{ background: '#0D4F4A', padding: `clamp(48px,6vw,80px) clamp(16px,5vw,72px)` }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: is768 ? '1fr' : '1fr 1.5fr',
          gap: 'clamp(36px,6vw,80px)',
          alignItems: 'flex-start',
        }}>
          {/* Left */}
          <motion.div {...fadeUp}>
            <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(22px,3vw,40px)', fontWeight: 300, color: '#F5EFE4', margin: '0 0 20px' }}>
              Apply <em style={{ fontStyle: 'italic' }}>Today</em>
            </h2>
            <p style={{ fontSize: 'clamp(13px,1.4vw,15px)', color: 'rgba(245,239,228,.7)', lineHeight: 1.85, marginBottom: '24px' }}>
              Send us your CV and we&apos;ll be in touch within 48 hours. We welcome applicants from all backgrounds — real estate experience is a bonus, but passion and drive are what we really look for.
            </p>
            <div style={{ fontSize: 'clamp(13px,1.4vw,15px)', color: '#F5EFE4' }}>
              📧 careers@imaksa.ae
            </div>
          </motion.div>

          {/* Right */}
          <motion.div {...fadeUp} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}>
            <input
              className="dark-input"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={darkInput}
            />
            <input
              className="dark-input"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={darkInput}
            />
            <input
              className="dark-input"
              placeholder="Phone Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={darkInput}
            />
            <select
              className="dark-input"
              value={position}
              onChange={e => setPosition(e.target.value)}
              style={{ ...darkInput, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
            >
              <option>Senior Property Consultant</option>
              <option>Junior Real Estate Agent</option>
              <option>Investment Advisory Specialist</option>
              <option>Digital Marketing Manager</option>
              <option>Property Manager</option>
            </select>
            <input
              className="dark-input"
              placeholder="Years of Experience"
              value={experience}
              onChange={e => setExperience(e.target.value)}
              style={darkInput}
            />
            <textarea
              className="dark-input"
              placeholder="Tell us about yourself and why you want to join IMAKSA..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
              style={{ ...darkInput, resize: 'vertical' }}
            />
            <div
              onClick={() => { if (!submitted) setSubmitted(true) }}
              style={{
                width: '100%',
                background: submitted ? '#27ae60' : '#F5EFE4',
                color: submitted ? '#fff' : '#0D4F4A',
                padding: 'clamp(14px,2vw,18px)',
                textAlign: 'center',
                fontFamily: 'var(--font-inter)',
                fontSize: 'clamp(10px,1.2vw,12px)',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                cursor: submitted ? 'default' : 'pointer',
                fontWeight: 700,
                boxSizing: 'border-box',
                transition: 'all .3s',
                userSelect: 'none',
              }}
            >
              {submitted ? 'Application Sent! ✅' : 'Submit Application'}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function WhyCard({ c }) {
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
        background: '#F5EFE4',
        padding: `clamp(28px,4vw,48px) clamp(20px,3vw,36px)`,
        borderBottom: hovered ? '3px solid #0D4F4A' : '3px solid transparent',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all .4s',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontSize: 'clamp(28px,4vw,40px)', marginBottom: 'clamp(14px,2vw,22px)' }}>{c.icon}</div>
      <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(18px,2.2vw,24px)', color: '#0D4F4A', marginBottom: '12px' }}>{c.title}</div>
      <div style={{ fontSize: 'clamp(13px,1.3vw,15px)', color: '#3A3A3A', lineHeight: 1.85 }}>{c.desc}</div>
    </motion.div>
  )
}

function JobRow({ job, onApply, delay }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'clamp(16px,2.5vw,32px)',
        background: '#fff',
        padding: 'clamp(24px,3.5vw,40px)',
        boxShadow: hovered ? '0 8px 36px rgba(0,0,0,.1)' : '0 2px 16px rgba(0,0,0,.05)',
        marginBottom: 'clamp(12px,1.8vw,20px)',
        transition: 'box-shadow .3s',
      }}
    >
      <div>
        <div style={{ fontSize: 'clamp(8px,1vw,9px)', letterSpacing: '3px', textTransform: 'uppercase', color: '#2E8B84', marginBottom: '6px' }}>
          {job.dept}
        </div>
        <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(18px,2.2vw,26px)', color: '#0D4F4A', marginBottom: '8px' }}>
          {job.title}
        </div>
        <div style={{ fontSize: 'clamp(11px,1.2vw,13px)', color: '#666' }}>
          📍 Dubai &nbsp;|&nbsp; 💼 Full-time &nbsp;|&nbsp; 💰 {job.pay}
        </div>
      </div>
      <div
        onClick={onApply}
        style={{
          background: '#0D4F4A',
          color: '#F5EFE4',
          padding: 'clamp(10px,1.4vw,14px) clamp(20px,2.8vw,32px)',
          fontSize: 'clamp(10px,1.1vw,12px)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          cursor: 'pointer',
          fontWeight: 700,
          fontFamily: 'var(--font-inter)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        Apply Now
      </div>
    </motion.div>
  )
}
