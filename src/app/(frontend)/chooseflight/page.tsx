'use client'

import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import FlightPathMap from '../components/FlightPathMap'
import { FaPlaneDeparture, FaPlaneArrival } from 'react-icons/fa'
import { MdDateRange } from 'react-icons/md'
import { CiUser } from 'react-icons/ci'
import Footer from '../components/Footer'
import Stays from '../components/Stays'

import { useRouter } from 'next/navigation'

const filters = ['Max price', 'Shops', 'Times', 'Airlines', 'Seat class', 'More']

const priceGrid = {
  cols: ['2/12', '2/13', '2/14', '2/15', '2/16'],
  rows: [
    { label: '3/7', prices: ['$837', '$592', '$592', '$1,308', '$837'] },
    { label: '3/8', prices: ['$837', '$592', '$592', '$837', '$1,308'] },
    { label: '3/9', prices: ['$624', '$592', '$624', '$592', '$592'] },
    { label: '3/10', prices: ['$1,308', '$624', '$624', '$837', '$837'] },
    { label: '3/11', prices: ['$592', '$624', '$1,308', '$837', '$624'] },
  ],
}

const GST_RATE = 0.12

export default function ChooseFlight() {
  const router = useRouter()
  const [flights, setFlights] = useState<any[]>([])
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/flights').then(res => res.json()).then(data => setFlights(data.docs || []))
  }, [])

  useEffect(() => {
    const saved = window.localStorage.getItem('selectedFlights')
    if (saved) {
      try {
        setSelected(JSON.parse(saved))
      } catch {
        // ignore invalid JSON
      }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('selectedFlights', JSON.stringify(selected))
  }, [selected])

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev.slice(-1), id],
    )
  }

  const selectedFlights = flights.filter((f) => selected.includes(f.id))
  const subtotal = selectedFlights.reduce((acc, f) => acc + f.price, 0)
  const gst = Math.round(subtotal * GST_RATE)
  const total = subtotal + gst
  const hasSelection = selected.length > 0

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-white p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* ── Search bar (disabled) ── */}
          <div className="flex flex-wrap sm:flex-nowrap border border-gray-200 rounded-lg overflow-hidden mb-6 opacity-60 pointer-events-none">
            {[
              { icon: <FaPlaneDeparture />, placeholder: 'From where?' },
              { icon: <FaPlaneArrival />, placeholder: 'Where to?' },
              { icon: <MdDateRange />, placeholder: 'Depart – Return' },
              { icon: <CiUser />, placeholder: '1 adult' },
            ].map((f, i) => (
              <div
                key={i}
                className="w-1/2 sm:flex-1 flex items-center gap-2 px-3 sm:px-4 py-3 border-b sm:border-b-0 border-r border-gray-100 last:border-r-0"
              >
                <span className="text-indigo-400 text-sm">{f.icon}</span>
                <span className="text-gray-400 text-xs sm:text-sm truncate">{f.placeholder}</span>
              </div>
            ))}
            <button
              disabled
              className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 font-medium text-sm"
            >
              Search
            </button>
          </div>

          {/* ── Filters ── */}
          <div className="flex gap-2 flex-wrap mb-6">
            {filters.map((f) => (
              <button
                key={f}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200 rounded-md text-xs sm:text-sm text-gray-600 flex items-center gap-1"
              >
                {f} <span className="text-gray-400">▾</span>
              </button>
            ))}
          </div>

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* ── Flight list ── */}
            <div className="lg:col-span-3">
              <h2 className="text-base sm:text-lg text-gray-500 mb-4">
                Choose a <span className="text-indigo-600">departing</span> flight
              </h2>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {flights.map((flight, i) => {
                  const isSelected = selected.includes(flight.id)
                  return (
                    <div
                      key={flight.id}
                      onClick={() => toggle(flight.id)}
                      className={`flex flex-col sm:grid sm:grid-cols-4 items-start sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 cursor-pointer
                        ${i !== flights.length - 1 ? 'border-b border-gray-100' : ''}
                        ${isSelected ? 'bg-indigo-50 ring-1 ring-inset ring-indigo-200' : 'hover:bg-gray-50'}`}
                    >
                      {/* Airline + mobile price row */}
                      <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-50 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                            {flight.flag}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{flight.airline}</p>
                            <p className="text-xs text-indigo-500">{flight.flightNo}</p>
                          </div>
                        </div>
                        {/* Price visible only on mobile */}
                        <div className="text-right sm:hidden">
                          <p className="text-base font-bold text-gray-800">${flight.price}</p>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            round trip
                          </p>
                        </div>
                      </div>

                      {/* Duration + Time */}
                      <div className="text-left sm:text-center">
                        <p className="font-bold text-gray-800 text-sm">{flight.duration}</p>
                        <p className="text-xs text-gray-400">{flight.time}</p>
                        {flight.stopDetail && (
                          <p className="text-xs text-gray-400">{flight.stopDetail}</p>
                        )}
                      </div>

                      {/* Stops */}
                      <div className="text-left sm:text-center">
                        <p className="text-sm text-gray-600">{flight.stops}</p>
                      </div>

                      {/* Price — hidden on mobile, shown on sm+ */}
                      <div className="hidden sm:block text-right">
                        <p className="text-lg font-bold text-gray-800">${flight.price}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">round trip</p>
                      </div>
                    </div>
                  )
                })}

                <div className="px-5 py-3 flex justify-end border-t border-gray-100">
                  <button className="border border-indigo-600 text-indigo-600 text-sm px-6 py-2 rounded">
                    Show all flights
                  </button>
                </div>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-6">
              {hasSelection ? (
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="divide-y divide-gray-100">
                    {selectedFlights.map((flight) => (
                      <div key={flight.id} className="flex items-start gap-4 p-5">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-2xl flex-shrink-0">
                          {flight.flag}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-sm">{flight.airline}</p>
                          <p className="text-xs text-indigo-500 mb-1">{flight.flightNo}</p>
                          <div className="text-right">
                            <p className="font-bold text-gray-800 text-lg">{flight.duration}</p>
                            <p className="text-xs text-gray-400">{flight.time}</p>
                            {flight.stopDetail && (
                              <p className="text-xs text-gray-400">{flight.stopDetail}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-5 pt-4 pb-2 space-y-2 border-t border-gray-100">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-700">${subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Taxes & Fees (12%)</span>
                      <span className="font-medium text-gray-700">${gst}</span>
                    </div>
                  </div>

                  <div className="flex justify-between px-5 py-3 border-t border-gray-200">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-gray-800 text-lg">${total}</span>
                  </div>

                  <div className="px-5 pb-5">
                    <button 
                      onClick={() => router.push('/passenger')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                    >
                      Passenger information
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-3">Price grid (flexible dates)</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                      <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-100">
                        <div />
                        {priceGrid.cols.map((c) => (
                          <div key={c} className="p-2 text-center text-gray-400">
                            {c}
                          </div>
                        ))}
                      </div>
                      {priceGrid.rows.map((row, i) => (
                        <div
                          key={i}
                          className={`grid grid-cols-6 ${i !== priceGrid.rows.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                          <div className="p-2 bg-gray-50 text-center text-gray-400 font-medium">
                            {row.label}
                          </div>
                          {row.prices.map((p, j) => (
                            <div
                              key={j}
                              className={`p-2 text-center ${p === '$592' || p === '$624' ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}
                            >
                              {p}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-500 mb-3">Price history</h3>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <svg viewBox="0 0 220 70" className="w-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.02" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,55 C20,50 30,25 50,30 C70,35 80,20 100,22 C120,24 130,40 150,38 C170,36 180,48 200,45 L220,42 L220,70 L0,70 Z"
                          fill="url(#g)"
                        />
                        <path
                          d="M0,55 C20,50 30,25 50,30 C70,35 80,20 100,22 C120,24 130,40 150,38 C170,36 180,48 200,45 L220,42"
                          fill="none"
                          stroke="#4f46e5"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <FlightPathMap />
      <Stays />
      <Footer />
    </div>
  )
}
