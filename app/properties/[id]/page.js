'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

function fixImgSrc(src) {
  if (!src) return src
  return src.replace('?w=700&q=80', '?w=1400&q=95').replace('?w=900&q=80', '?w=1400&q=95')
}

function formatPrice(price) {
  if (!price) return ''
  const cleaned = String(price).replace(/,/g, '')
  const num = Number(cleaned)
  if (!isNaN(num) && num > 0) return num.toLocaleString()
  return price
}

function SimilarCard({ property }) {
  const router = useRouter()
  const images =
    property.images && property.images.length > 0
      ? property.images
      : property.img
      ? [property.img]
      : []
  const [idx, setIdx] = useState(0)
  const hasMultiple = images.length > 1
  const priceDisplay = formatPrice(property.price)
  const encodedName = encodeURIComponent(property.name || '')
  const encodedPrice = encodeURIComponent(Number(String(property.price || '').replace(/,/g,'')).toLocaleString())

  const specs = []
  if (property.beds) specs.push({ value: property.beds, label: 'Beds' })
  if (property.baths) specs.push({ value: property.baths, label: 'Baths' })
  if (property.area) specs.push({ value: property.area, label: 'Sq.Ft' })

  const typeLabel = property.type
    ? property.type.charAt(0).toUpperCase() + property.type.slice(1).toLowerCase()
    : ''

  return (
    <div
      className="sim-card"
      onClick={() => property._id && router.push('/properties/' + property._id)}
      style={{ background: '#fff', overflow: 'hidden', boxShadow: '0 2px 20px rgba(0,0,0,.06)', cursor: 'pointer' }}
    >
      <div style={{ height: 'clamp(180px,18vw,240px)', overflow: 'hidden', position: 'relative' }}>
        {images.length === 0 ? (
          <div style={{ width: '100%', height: '100%', background: '#EDE5D8' }} />
        ) : hasMultiple ? (
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={property.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: i === idx ? 1 : 0,
                  transition: 'opacity .4s',
                }}
              />
            ))}
            <button
              onClick={() => setIdx((prev) => (prev - 1 + images.length) % images.length)}
              style={{
                position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,.65)', border: '2px solid rgba(255,255,255,.4)',
                color: '#fff', width: 36, height: 36, borderRadius: '50%', zIndex: 6,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}
            >&#8249;</button>
            <button
              onClick={() => setIdx((prev) => (prev + 1) % images.length)}
              style={{
                position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,.65)', border: '2px solid rgba(255,255,255,.4)',
                color: '#fff', width: 36, height: 36, borderRadius: '50%', zIndex: 6,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}
            >&#8250;</button>
            <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, zIndex: 6 }}>
              {images.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setIdx(i)}
                  style={{
                    width: 6, height: 6, borderRadius: '50%', cursor: 'pointer', transition: 'all .3s',
                    background: i === idx ? '#F5EFE4' : 'rgba(245,239,228,.4)',
                    transform: i === idx ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <img
            className="sim-card-img"
            src={images[0]}
            alt={property.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
        {property.badge && (
          <div style={{
            position: 'absolute', top: 16, left: 16, background: '#0D4F4A', color: '#F5EFE4',
            fontSize: 'clamp(7px,.9vw,8px)', letterSpacing: 2, textTransform: 'uppercase',
            padding: '5px 12px', zIndex: 5,
          }}>{property.badge}</div>
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
              <div
                key={spec.label}
                style={{ flex: 1, textAlign: 'center', borderRight: i < specs.length - 1 ? '1px solid rgba(13,79,74,.1)' : 'none' }}
              >
                <div style={{ fontSize: 'clamp(16px,2vw,20px)', fontWeight: 400, color: '#0D4F4A' }}>{spec.value}</div>
                <div style={{ fontSize: 'clamp(8px,1vw,9px)', letterSpacing: 2, textTransform: 'uppercase', color: '#6B6B60', marginTop: 3 }}>{spec.label}</div>
              </div>
            ))}
          </div>
        )}
        <Link
          href={`/contact?property=${encodedName}&price=${encodedPrice}`}
          className="sim-enquire-btn"
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

export default function PropertyDetailPage() {
  const params = useParams()
  const id = params.id

  const [property, setProperty] = useState(null)
  const [allProperties, setAllProperties] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [galleryIdx, setGalleryIdx] = useState(0)
  const thumbnailRef = useRef(null)

  useEffect(() => {
    async function load() {
      try {
        const [propRes, settingsRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/settings'),
        ])
        const propData = await propRes.json()
        const settingsData = await settingsRes.json()

        if (settingsData.success) setSettings(settingsData.settings)

        if (propData.success) {
          const found = propData.properties.find((p) => p._id === id)
          if (found) {
            setProperty(found)
            setAllProperties(propData.properties)
          } else {
            setNotFound(true)
          }
        } else {
          setNotFound(true)
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <div style={{ background: '#FAFAF8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '2px solid #0D4F4A', borderRadius: '50%',
            borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      </>
    )
  }

  if (notFound || !property) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-fraunces)', color: '#0D4F4A', fontSize: 'clamp(28px,4vw,48px)' }}>
          Property Not Found
        </div>
        <div style={{ color: '#6B6B60', marginTop: 16 }}>
          This property may no longer be available.
        </div>
        <Link
          href="/properties"
          style={{
            display: 'inline-block', marginTop: 32, background: '#0D4F4A', color: '#F5EFE4',
            padding: '14px 28px', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          ← Back to Properties
        </Link>
      </div>
    )
  }

  const images =
    property.images && property.images.length > 0
      ? property.images
      : property.img
      ? [property.img]
      : []
  const hasMultiple = images.length > 1
  const priceDisplay = formatPrice(property.price)
  const encodedName = encodeURIComponent(property.name || '')
  const encodedPrice = encodeURIComponent(Number(String(property.price || '').replace(/,/g,'')).toLocaleString())
  const waMessage = encodeURIComponent(
    `Hello IMAKSA 🏡\n\nI am interested in the property: ${property.name}\nPrice: AED ${priceDisplay}\nLocation: ${property.location}\n\nCould you please provide more details?\n\nThank you!`
  )

  const specs = []
  if (property.beds) specs.push({ value: property.beds, label: 'Beds' })
  if (property.baths) specs.push({ value: property.baths, label: 'Baths' })
  if (property.area) specs.push({ value: property.area, label: 'Sq.Ft' })

  const typeLabel = property.type
    ? property.type.charAt(0).toUpperCase() + property.type.slice(1).toLowerCase()
    : ''

  const similar = allProperties
    .filter((p) => p._id !== property._id && p.listingType === property.listingType)
    .slice(0, 3)

  const prevImage = () => setGalleryIdx((prev) => (prev - 1 + images.length) % images.length)
  const nextImage = () => setGalleryIdx((prev) => (prev + 1) % images.length)

  return (
    <div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }

        .enquire-teal:hover { background: #1A6B65 !important; }
        .enquire-wa:hover { background: #1EB358 !important; }
        .sim-card { transition: box-shadow .4s, transform .4s; }
        .sim-card:hover { box-shadow: 0 12px 48px rgba(0,0,0,.12); transform: translateY(-6px); }
        .sim-card:hover .sim-card-img { transform: scale(1.06); }
        .sim-card-img { transition: transform .8s; }
        .sim-enquire-btn:hover { background: #1A6B65 !important; }

        @media (max-width: 900px) {
          .detail-layout { grid-template-columns: 1fr !important; }
          .similar-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 768px) {
          .similar-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 480px) {
          .similar-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .hero-section { height: 280px !important; }
        }
      `}</style>

      {/* ── IMAGE GALLERY ── */}
      <div className="hero-section" style={{ position: 'relative', zIndex: 1, height: 'clamp(250px,50vw,780px)', overflow: 'hidden', background: '#0D4F4A' }}>
        {images.length === 0 ? (
          <div style={{ width: '100%', height: '100%', background: '#0D4F4A' }} />
        ) : (
          <>
            {images.map((src, i) => (
              <img
                key={i}
                src={fixImgSrc(src)}
                alt={property.name}
                loading="eager"
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center center', opacity: i === galleryIdx ? 1 : 0, transition: 'opacity .5s',
                }}
              />
            ))}
            {hasMultiple && (
              <>
                <button
                  onClick={prevImage}
                  style={{
                    position: 'absolute', top: '50%', left: 20, transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,.5)', border: '2px solid rgba(255,255,255,.4)',
                    color: '#fff', width: 48, height: 48, borderRadius: '50%',
                    fontSize: 20, zIndex: 5, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >&#8249;</button>
                <button
                  onClick={nextImage}
                  style={{
                    position: 'absolute', top: '50%', right: 20, transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,.5)', border: '2px solid rgba(255,255,255,.4)',
                    color: '#fff', width: 48, height: 48, borderRadius: '50%',
                    fontSize: 20, zIndex: 5, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >&#8250;</button>
                <div style={{
                  position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                  display: 'flex', gap: 8, zIndex: 5,
                }}>
                  {images.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setGalleryIdx(i)}
                      style={{
                        width: 8, height: 8, borderRadius: '50%', cursor: 'pointer', transition: 'all .3s',
                        background: i === galleryIdx ? '#fff' : 'rgba(255,255,255,.4)',
                        transform: i === galleryIdx ? 'scale(1.3)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

      </div>

      {/* Thumbnail strip */}
      {hasMultiple && (
        <div
          ref={thumbnailRef}
          style={{
            display: 'flex', gap: 8, padding: 12, background: '#0A0A0A', overflowX: 'auto',
          }}
        >
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${property.name} ${i + 1}`}
              loading="lazy"
              onClick={() => setGalleryIdx(i)}
              style={{
                width: 80, height: 60, objectFit: 'cover', cursor: 'pointer', flexShrink: 0,
                opacity: i === galleryIdx ? 1 : 0.5, transition: 'opacity .3s',
                outline: i === galleryIdx ? '2px solid #C9A84C' : 'none',
              }}
            />
          ))}
        </div>
      )}

      {/* ── PROPERTY INFO ── */}
      <section style={{ background: '#FAFAF8', padding: 'clamp(40px,6vw,80px) clamp(16px,5vw,72px)' }}>
        <Link
          href="/properties"
          style={{
            display: 'inline-block', marginBottom: 16, fontSize: 12, letterSpacing: 2,
            textTransform: 'uppercase', color: '#0D4F4A',
            borderBottom: '1px solid rgba(13,79,74,.3)', paddingBottom: 2,
            textDecoration: 'none',
          }}
        >
          ← Back to Properties
        </Link>
        <div
          className="detail-layout"
          style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'clamp(32px,5vw,64px)', alignItems: 'start' }}
        >
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 'clamp(8px,1vw,10px)', letterSpacing: 3, textTransform: 'uppercase', color: '#2E8B84' }}>
                {typeLabel}
              </span>
              {property.badge && (
                <span style={{
                  background: '#0D4F4A', color: '#F5EFE4',
                  fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
                  padding: '4px 10px',
                }}>
                  {property.badge}
                </span>
              )}
            </div>
            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(22px,3vw,40px)', fontWeight: 300, color: '#0D4F4A', marginBottom: 8 }}>
              AED {priceDisplay}
            </div>
            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(20px,2.5vw,32px)', fontWeight: 300, color: '#0A0A0A', marginBottom: 8 }}>
              {property.name}
            </div>
            <div style={{ fontSize: 'clamp(12px,1.3vw,14px)', color: '#6B6B60', letterSpacing: 1, marginBottom: 'clamp(24px,3vw,40px)' }}>
              {`📍 ${property.location}`}
            </div>

            {/* Specs row */}
            {specs.length > 0 && (
              <div style={{
                display: 'flex', gap: 0,
                borderTop: '1px solid rgba(13,79,74,.1)', borderBottom: '1px solid rgba(13,79,74,.1)',
                padding: 'clamp(16px,2.5vw,24px) 0', marginBottom: 'clamp(32px,4vw,52px)',
              }}>
                {specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    style={{
                      flex: 1, textAlign: 'center',
                      borderRight: i < specs.length - 1 ? '1px solid rgba(13,79,74,.1)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: '#0D4F4A' }}>{spec.value}</div>
                    <div style={{ fontSize: 'clamp(8px,1vw,10px)', letterSpacing: 2, textTransform: 'uppercase', color: '#6B6B60', marginTop: 4 }}>{spec.label}</div>
                  </div>
                ))}
              </div>
            )}

            {property.handover && (
              <div style={{ fontSize: 13, color: '#6B6B60', marginBottom: 8 }}>
                {`Handover: ${property.handover}`}
              </div>
            )}
            {property.payplan && (
              <div style={{ fontSize: 13, color: '#6B6B60', marginBottom: 24 }}>
                {`Payment Plan: ${property.payplan}`}
              </div>
            )}

            {property.desc && (
              <>
                <div style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontSize: 'clamp(18px,2.2vw,26px)', color: '#0D4F4A',
                  marginBottom: 16, marginTop: 'clamp(32px,4vw,52px)',
                }}>
                  About This Property
                </div>
                <div style={{ fontSize: 'clamp(13px,1.3vw,15px)', color: '#3A3A3A', lineHeight: 1.85, letterSpacing: '0.015em' }}>
                  {property.desc}
                </div>
              </>
            )}
          </motion.div>

          {/* RIGHT — sticky enquiry card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            style={{ position: 'sticky', top: 100 }}
          >
            <div style={{ background: '#fff', boxShadow: '0 4px 32px rgba(0,0,0,.1)', padding: 'clamp(24px,3vw,36px)' }}>
              <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(18px,2vw,24px)', color: '#0D4F4A', marginBottom: 8 }}>
                Interested in this property?
              </div>
              <div style={{ fontSize: 13, color: '#6B6B60', marginBottom: 24, lineHeight: 1.7 }}>
                Contact our team for more details, viewing requests, or to make an offer.
              </div>

              <Link
                href={`/contact?property=${encodedName}&price=${encodedPrice}`}
                className="enquire-teal"
                style={{
                  display: 'block', background: '#0D4F4A', color: '#F5EFE4',
                  textAlign: 'center', padding: 16,
                  fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase',
                  textDecoration: 'none', marginBottom: 12, transition: 'background .3s',
                }}
              >
                Enquire Now
              </Link>
              <a
                href={`https://wa.me/${(settings?.wa || settings?.whatsapp || '971506957009').replace(/\D/g, '')}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="enquire-wa"
                style={{
                  display: 'block', background: '#25D366', color: '#fff',
                  textAlign: 'center', padding: 16,
                  fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase',
                  textDecoration: 'none', transition: 'background .3s',
                }}
              >
                WhatsApp Us
              </a>

              <div style={{ height: 1, background: 'rgba(13,79,74,.1)', margin: '20px 0' }} />

              {settings && (
                <div>
                  {settings.phone && (
                    <span style={{ fontSize: 13, color: '#0D4F4A', display: 'block', marginBottom: 8 }}>
                      {`📞 ${settings.phone}`}
                    </span>
                  )}
                  {settings.email && (
                    <span style={{ fontSize: 13, color: '#0D4F4A', display: 'block' }}>
                      {`✉️ ${settings.email}`}
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SIMILAR PROPERTIES ── */}
      {similar.length > 0 && (
        <section style={{ background: '#F5EFE4', padding: 'clamp(36px,5vw,72px) clamp(16px,5vw,72px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div style={{
              fontSize: 'clamp(8px,1vw,10px)', letterSpacing: 4, textTransform: 'uppercase',
              color: '#2E8B84', marginBottom: 12,
            }}>
              You May Also Like
            </div>
            <h2 style={{
              fontFamily: 'var(--font-fraunces)', fontSize: 'clamp(22px,3vw,40px)',
              fontWeight: 300, color: '#0D4F4A', margin: '0 0 clamp(32px,4vw,52px)',
            }}>
              Similar <em style={{ fontStyle: 'italic' }}>Properties</em>
            </h2>
          </motion.div>

          <div
            className="similar-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'clamp(12px,2vw,24px)' }}
          >
            {similar.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              >
                <SimilarCard property={p} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
