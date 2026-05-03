'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'



function SuccessContentInner() {
  const searchParams = useSearchParams()
  const flightIds = searchParams.get('flights')?.split(',') || []
  const passengerName = searchParams.get('p1') || 'Guest'
  const selectedSeat = searchParams.get('seat') || '9F'
  const userEmail = searchParams.get('email') || ''
  const [confirmationNumber, setConfirmationNumber] = useState<string | null>(null)

  const [showSuccessMessage, setShowSuccessMessage] = useState(true)
  const [storedFlightIds, setStoredFlightIds] = useState<string[]>([])
  const [flights, setFlights] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/flights').then(res => res.json()).then(data => setFlights(data.docs || []))
  }, [])

  useEffect(() => {
    if (flightIds.length === 0 && storedFlightIds.length === 0 && typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('selectedFlights')
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as number[]
          setStoredFlightIds(parsed.map((id) => id.toString()))
        } catch {
          // ignore invalid JSON
        }
      }
    }
  }, [flightIds.length, storedFlightIds.length])

  useEffect(() => {
    if (confirmationNumber === null) {
      setConfirmationNumber(`#${Math.floor(100000000000 + Math.random() * 900000000000)}`)
    }
  }, [confirmationNumber])

  const activeFlightIds = flightIds.length > 0 ? flightIds : storedFlightIds
  const selectedFlights = flights.filter((flight) => activeFlightIds.includes(flight.id.toString()))
  const subtotal = selectedFlights.reduce((sum, flight) => sum + (flight.price || 0), 0)
  const taxesAndFees = Math.round(subtotal * 0.12)
  const totalPaid = subtotal + taxesAndFees

  useEffect(() => {
    if (typeof window !== 'undefined' && userEmail && flightIds.length > 0 && confirmationNumber) {
      const existingBookingsStr = localStorage.getItem('tripma_bookings')
      const bookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : {}

      if (!bookings[userEmail]) {
        bookings[userEmail] = []
      }

      const isAlreadySaved = bookings[userEmail].some((b: any) => b.id === confirmationNumber)

      if (!isAlreadySaved) {
        const newBooking = {
          id: confirmationNumber,
          date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          status: 'Upcoming',
          flightIds: flightIds,
          flights: selectedFlights,
          total:
            selectedFlights.reduce((sum, flight) => sum + (flight.price || 500), 0) +
            Math.round(
              selectedFlights.reduce((sum, flight) => sum + (flight.price || 500), 0) * 0.12,
            ),
          passenger: passengerName,
        }

        bookings[userEmail].unshift(newBooking)
        localStorage.setItem('tripma_bookings', JSON.stringify(bookings))

        fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, booking: newBooking }),
        }).catch((err) => console.error('Failed to save booking to server:', err))
      }
    }
  }, [userEmail, flightIds, selectedFlights, passengerName, confirmationNumber])

  return (

    <div>
        <Navbar/>

        <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-12 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-15">
          {/* Left Column: Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Success Message */}
            {showSuccessMessage && (
              <div className="bg-teal-50 border border-teal-300 rounded-md p-3 flex items-start gap-2 relative">
                <svg
                  className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div className="text-xs text-teal-800 flex-1 pr-4">
                  Your flight has been booked successfully! Your confirmation number is{' '}
                  <strong>{confirmationNumber || 'Generating...'}</strong>
                </div>
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="absolute top-2 right-2 text-teal-500 hover:text-teal-700 transition-colors"
                  aria-label="Close success message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                  </svg>
                </button>
              </div>
            )}

            {/* Bon Voyage Greeting */}
            <div className="bg-white rounded-lg p-6 ">
              <h2 className="text-2xl font-semibold text-indigo-600 mb-2">{passengerName}!</h2>
              <p className="text-gray-500 mb-1">
                Confirmation number:{' '}
                <span className="font-medium text-gray-700">{confirmationNumber}</span>
              </p>
              <p className="text-gray-500 ">
                Thank you for booking your travel with Tripma! Below is a summary of your trip.
                We’ve sent a copy of your booking confirmation to your email address. You can also
                find this page again in My trips.
              </p>
            </div>

            {/* Flight Summary */}
            <div className="rounded-lg p-6 bg-white">
              <h3 className="text-xl font-bold text-gray-600 mb-6">Flight summary</h3>

              {selectedFlights.length > 0 ? (
                <div className="space-y-6">
                  {selectedFlights.map((flight, index) => (
                    <div key={flight.id}>
                      <div className="text-base font-medium text-gray-500 mb-4 text-xs uppercase tracking-wider">
                        {index === 0 ? 'Selected flight' : `Flight ${index + 1}`}
                      </div>
                      <div className="border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row items-center justify-between gap-6 bg-white">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center text-white overflow-hidden relative"
                            aria-hidden="true"
                          >
                            <span className="font-bold text-lg">✈️</span>
                          </div>
                          <div>
                            <div className="text-base font-medium text-gray-900">
                              {flight.duration}
                            </div>
                            <div className="text-sm text-gray-400">{flight.airline}</div>
                            <div className="text-xs text-gray-400">{flight.flightNo}</div>
                          </div>
                        </div>

                        <div className="flex-1 w-full md:w-auto grid grid-cols-2 md:grid-cols-3 gap-4 text-center md:text-right">
                          <div className="text-left md:text-right">
                            <div className="text-base font-medium text-gray-700">{flight.time}</div>
                          </div>
                          <div>
                            <div className="text-base font-medium text-gray-700">
                              {flight.stopDetail || 'Nonstop'}
                            </div>
                            {flight.stopDetail && (
                              <div className="text-sm text-gray-400">{flight.stopDetail}</div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-base font-medium text-gray-700">
                              ${flight.price}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-400 pl-1">
                        Seat {selectedSeat} (economy, window), 1 checked bag
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  No flights found in your cart. Please return to choose a flight.
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Price breakdown</h3>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Flight subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs pb-2 border-b border-gray-200">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="text-gray-900">${taxesAndFees.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm font-semibold pt-2">
                  <span className="text-gray-900">Amount paid</span>
                  <span className="text-gray-900">${totalPaid.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 ">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Payment method</h3>

              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-5 text-white max-w-xs shadow-lg">
                <div className="flex justify-between items-start mb-8">
                  <div className="text-xl font-bold italic">VISA</div>
                  <div className="text-[10px] opacity-90 uppercase tracking-widest">Debit</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium tracking-wide uppercase">{passengerName}</div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-sm tracking-widest">•••• 9042</div>
                  <div className="text-[10px] opacity-90">05/25</div>
                </div>
              </div>
            </div>

            {/* Share Itinerary */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Share your travel itinerary
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                You can email your itinerary to anyone by entering their email address here.
              </p>

              <div className="space-y-4 w-full max-w-md">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 outline-none"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-lg">
                    Email itinerary
                  </button>
                  <button className="flex-1 px-6 py-3 text-indigo-600 text-sm font-bold border border-indigo-600 rounded-lg">
                    Add another
                  </button>
                </div>
              </div>
            </div>

            {/* Flight Route Map Placeholder */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Flight Route</h3>
              <div className="bg-indigo-50 rounded-lg h-64 flex items-center justify-center relative overflow-hidden border border-indigo-100">
                <img
                  src="/images/Map.png"
                  alt="Flight Map"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-indigo-400 font-medium">Map visualization</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1 w-full max-w-[320px] mx-auto lg:mx-0 space-y-12">
            {/* Shop Hotels Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">
                Shop <span className="text-indigo-600">hotels</span>
              </h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Tripma partners with thousands of hotels to get you the best deal.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: 'Ryokan Japan',
                    price: '$439',
                    desc: 'Traditional room',
                    img: '/images/img1.png',
                  },
                  {
                    title: 'Bessho SASA',
                    price: '$529',
                    desc: 'Japanese ryokan',
                    img: '/images/img2.jpg',
                  },
                  {
                    title: 'HOTEL THE FLAG',
                    price: '$139',
                    desc: 'Modern hotel',
                    img: '/images/img3.jpg',
                  },
                ].map((hotel, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
                  >
                    <div className="h-40 relative">
                      <img
                        src={hotel.img}
                        alt={hotel.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-gray-800 text-sm">{hotel.title}</h4>
                        <span className="text-sm font-medium text-gray-800">{hotel.price}</span>
                      </div>
                      <p className="text-xs text-gray-400">{hotel.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 px-6 py-3 border border-indigo-600 text-indigo-600 font-medium rounded-lg text-sm">
                Shop all hotels
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>


    </div>
  )
}

export default function SuccessContent() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <SuccessContentInner />
    </Suspense>
  )
}
