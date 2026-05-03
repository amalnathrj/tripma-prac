'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Stays() {
  const [stays, setStays] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/stays').then(res => res.json()).then(data => setStays(data.docs || []))
  }, [])

  return (
    <div className="w-full max-w-7xl mx-auto mb-12 px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl text-gray-600 font-medium">
          Find <span className="text-indigo-600 font-semibold">places to stay</span> in
        </h2>
        <a href="#" className="text-gray-400 hover:text-indigo-600 font-medium flex items-center gap-1 text-sm sm:text-base">
          All <span>→</span>
        </a>
      </div>

      {/* Cards — horizontal scroll on mobile, grid on md+ */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory
                      md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 md:snap-none
                      scrollbar-hide">
        {stays.map((stay) => (
          <div
            key={stay.title}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden
                       flex flex-col flex-shrink-0 snap-start
                       w-72 sm:w-80
                       md:w-auto md:flex-shrink md:flex-1"
          >
            {/* Image */}
            <div className="relative h-44 sm:h-48 w-full">
              <Image
                src={stay.src}
                alt={stay.alt}
                fill
                sizes="(max-width: 768px) 288px, (max-width: 1200px) 33vw, 400px"
                className="object-cover"
              />
            </div>

            {/* Text */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-indigo-600 font-medium text-base sm:text-lg mb-1 sm:mb-2 leading-snug">
                {stay.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{stay.description}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}