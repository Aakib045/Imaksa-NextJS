'use client'

import { useState, useEffect } from 'react'

export default function WhatsAppButton() {
  const [waNumber, setWaNumber] = useState('971506957009')

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.settings) {
          const raw = d.settings.wa || d.settings.whatsapp || ''
          if (raw) setWaNumber(raw.replace(/\D/g, ''))
        }
      })
      .catch(() => {})
  }, [])

  const href = `https://wa.me/${waNumber}?text=Hello%20IMAKSA%20%F0%9F%8F%A1%0A%0AI%20am%20interested%20in%20purchasing%20a%20property%20in%20Dubai.%20Could%20you%20please%20help%20me%20find%20the%20right%20property%3F%0A%0AThank%20you!`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-200"
    >
      <svg
        viewBox="0 0 32 32"
        width="28"
        height="28"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M16.002 2.667C8.638 2.667 2.667 8.637 2.667 16c0 2.352.636 4.629 1.843 6.624L2.667 29.333l6.9-1.81A13.276 13.276 0 0 0 16.002 29.333C23.363 29.333 29.333 23.362 29.333 16S23.363 2.667 16.002 2.667Zm0 2.4c5.818 0 10.932 4.678 10.932 10.933 0 6.254-5.114 10.933-10.932 10.933a10.9 10.9 0 0 1-5.57-1.527l-.4-.237-4.096 1.074 1.095-3.978-.262-.415A10.89 10.89 0 0 1 5.07 16c0-6.255 4.658-10.933 10.932-10.933Zm-3.21 5.6c-.21 0-.552.079-.841.392-.288.313-1.099 1.074-1.099 2.618 0 1.544 1.125 3.036 1.282 3.247.156.21 2.19 3.483 5.4 4.748 2.555.991 3.074.794 3.627.744.553-.05 1.784-.73 2.035-1.434.25-.704.25-1.307.175-1.434-.076-.126-.288-.2-.603-.35-.315-.15-1.864-.92-2.154-1.023-.288-.102-.498-.152-.707.152-.21.304-.811.995-1.02 1.202-.2.197-.397.222-.702.074-.315-.15-1.323-.487-2.52-1.554-.929-.831-1.556-1.856-1.739-2.169-.182-.313-.019-.483.138-.638.14-.14.315-.365.472-.547.157-.183.21-.314.315-.524.104-.21.052-.392-.026-.547-.078-.156-.692-1.71-.96-2.334-.247-.594-.5-.514-.693-.523a13 13 0 0 0-.576-.012Z" />
      </svg>
    </a>
  )
}
