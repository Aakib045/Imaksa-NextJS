'use client'
import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true)
      return
    }
    const move = (e) => {
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
      if (ringRef.current) {
        ringRef.current.style.left = e.clientX + 'px'
        ringRef.current.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  if (isTouch) return null

  return (
    <>
      <div ref={dotRef} className="custom-cursor" style={{
        position: 'fixed', width: 12, height: 12,
        background: '#fff', borderRadius: '50%',
        mixBlendMode: 'difference', pointerEvents: 'none',
        zIndex: 999999, transform: 'translate(-50%,-50%)',
        left: '-100px', top: '-100px',
      }} />
      <div ref={ringRef} className="custom-ring" style={{
        position: 'fixed', width: 38, height: 38,
        border: '1px solid #0D4F4A', borderRadius: '50%',
        opacity: 0.4, mixBlendMode: 'difference',
        pointerEvents: 'none', zIndex: 999998,
        transform: 'translate(-50%,-50%)',
        left: '-100px', top: '-100px',
        transition: 'left 0.08s ease, top 0.08s ease',
      }} />
    </>
  )
}
