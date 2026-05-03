'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // 1. Check user session
    fetch('/api/users/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.user) {
          // If not logged in, redirect to home or show sign in
          router.push('/')
          return
        }
        setUser(data.user)

        // 2. Fetch bookings for this user
        // Payload automatically filters by the currently logged in user due to our RBAC rules
        fetch('/api/bookings')
          .then((res) => res.json())
          .then((bookingData) => {
            setBookings(bookingData.docs || [])
            setIsLoading(false)
          })
          .catch(() => setIsLoading(false))
      })
      .catch(() => setIsLoading(false))
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-500 mt-1">Manage your trips and view your travel history</p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 w-fit"
          >
            Book a new flight
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="flex-grow space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-50 text-green-600 border border-green-100">
                      {booking.status}
                    </span>
                    <span className="text-gray-400 text-sm font-medium">Ref: {booking.id.slice(-8).toUpperCase()}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Passenger</p>
                      <p className="text-gray-800 font-semibold">{booking.passengerName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Seat</p>
                      <p className="text-gray-800 font-semibold">{booking.seatNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Date</p>
                      <p className="text-gray-800 font-semibold">
                        {booking.chosenDate ? new Date(booking.chosenDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Route</p>
                      <p className="text-gray-800 font-semibold">{booking.from || 'N/A'} → {booking.to || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Paid</p>
                      <p className="text-indigo-600 font-bold">${booking.totalAmount || '0'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 min-w-[140px]">
                   <div className="text-right">
                     <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Airline</p>
                     <p className="text-gray-800 font-semibold">Confirmed</p>
                   </div>
                   <button className="text-indigo-600 text-sm font-bold hover:underline mt-2">
                     Download Ticket
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-24 text-center px-4">
            <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
               <span className="text-3xl text-indigo-600">✈️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't booked any trips yet. Your next adventure is just a search away!</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Find a flight
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
