'use client'

import { useState, useEffect } from 'react'

const WHATSAPP_NUMBER = '8801954745991' // BD country code 880 + number
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Amanah%20Farm%2C%20I%20am%20interested%20in%20your%20investment%20plans.`

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Slight entrance delay for polish
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Tooltip label */}
      <div
        className={`transition-all duration-300 ${
          hovered ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        <div className="bg-white text-gray-800 text-xs font-semibold px-3 py-2 rounded-xl shadow-xl whitespace-nowrap border border-gray-100">
          💬 Chat on WhatsApp
          <div className="text-[10px] text-gray-500 font-normal mt-0.5">+880 1954-745991</div>
        </div>
      </div>

      {/* Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-transform duration-200 hover:scale-110 active:scale-95"
        style={{ backgroundColor: '#25D366' }}
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: '#25D366' }}
        />
        {/* Official WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-8 h-8 relative z-10"
          fill="white"
        >
          <path d="M4.868 43.303l2.694-9.835a19.276 19.276 0 01-2.584-9.692C4.984 13.098 13.731 4.35 24.505 4.35a19.268 19.268 0 0113.656 5.657 19.27 19.27 0 015.656 13.651c-.004 10.774-8.752 19.521-19.525 19.521h-.008a19.358 19.358 0 01-9.241-2.348L4.868 43.303zm10.878-6.287l.588.348a16.076 16.076 0 008.166 2.226h.006c8.878 0 16.101-7.222 16.104-16.102a16.01 16.01 0 00-4.692-11.379 16.003 16.003 0 00-11.405-4.729c-8.884 0-16.107 7.221-16.11 16.099a16.082 16.082 0 002.448 8.583l.38.605-1.616 5.903 6.131-1.554zm17.041-9.063c-.12-.199-.438-.318-.916-.557-.477-.239-2.821-1.392-3.258-1.551-.437-.159-.755-.239-1.073.239-.318.479-1.233 1.551-1.511 1.87-.278.318-.557.358-1.035.12-.478-.239-2.02-.745-3.847-2.376-1.42-1.271-2.383-2.84-2.662-3.319-.278-.479-.03-.737.209-.976.215-.215.478-.557.717-.836.238-.279.318-.479.478-.797.159-.319.079-.597-.04-.836-.12-.238-1.073-2.584-1.47-3.538-.388-.929-.781-.803-1.073-.817-.278-.013-.597-.016-.915-.016a1.755 1.755 0 00-1.273.597c-.437.479-1.67 1.631-1.67 3.976 0 2.345 1.71 4.611 1.948 4.93.239.318 3.363 5.136 8.149 7.198 1.138.491 2.027.784 2.718 1.004 1.142.363 2.182.312 3.003.189.916-.136 2.821-1.153 3.219-2.266.398-1.114.398-2.067.278-2.266z"/>
        </svg>
      </a>
    </div>
  )
}
