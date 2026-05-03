'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import Image from 'next/image'
import Footer from '../components/Footer'

interface PassengerData {
  firstName: string
  middleName: string
  lastName: string
  suffix: string
  dob: string
  email: string
  phone: string
  redressNumber: string
  knownTravelerNumber: string
  emergencyFirstName: string
  emergencyLastName: string
  emergencyEmail: string
  emergencyPhone: string
  sameAsPassenger: boolean
  bagChecked: number
}

export default function PassengerPage() {
  const router = useRouter()
  const [data, setData] = useState<PassengerData>({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dob: '',
    email: '',
    phone: '',
    redressNumber: '',
    knownTravelerNumber: '',
    emergencyFirstName: '',
    emergencyLastName: '',
    emergencyEmail: '',
    emergencyPhone: '',
    sameAsPassenger: false,
    bagChecked: 1,
  })

  const [flights, setFlights] = useState<any[]>([])
  const [selectedFlightIds, setSelectedFlightIds] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/flights').then(res => res.json()).then(data => setFlights(data.docs || []))
  }, [])

  useEffect(() => {
    const saved = window.localStorage.getItem('selectedFlights')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSelectedFlightIds(parsed)
      } catch {
        // ignore invalid JSON
      }
    }
  }, [])

  const selectedFlights = flights.filter((flight) => selectedFlightIds.includes(flight.id))
  const subtotal = selectedFlights.reduce((acc, f) => acc + f.price, 0)
  const gst = Math.round(subtotal * 0.12)
  const total = subtotal + gst

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setData((prev) => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value }
      if (updated.sameAsPassenger) {
        updated.emergencyFirstName = updated.firstName
        updated.emergencyLastName = updated.lastName
        updated.emergencyEmail = updated.email
        updated.emergencyPhone = updated.phone
      }
      return updated
    })
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRe = /^\+?[\d\s-]{10,}$/
    if (!data.firstName.trim()) e.firstName = 'First name is required'
    if (!data.lastName.trim()) e.lastName = 'Last name is required'
    if (!data.dob.trim()) e.dob = 'Date of birth is required'
    if (!data.email.trim()) e.email = 'Email is required'
    else if (!emailRe.test(data.email)) e.email = 'Invalid email format'
    if (!data.phone.trim()) e.phone = 'Phone is required'
    else if (!phoneRe.test(data.phone)) e.phone = 'Invalid phone format'
    if (!data.knownTravelerNumber.trim()) e.knownTravelerNumber = 'Required'
    if (!data.emergencyFirstName.trim()) e.emergencyFirstName = 'First name is required'
    if (!data.emergencyLastName.trim()) e.emergencyLastName = 'Last name is required'
    if (!data.emergencyEmail.trim()) e.emergencyEmail = 'Email is required'
    else if (!emailRe.test(data.emergencyEmail)) e.emergencyEmail = 'Invalid email format'
    if (!data.emergencyPhone.trim()) e.emergencyPhone = 'Phone is required'
    else if (!phoneRe.test(data.emergencyPhone)) e.emergencyPhone = 'Invalid phone format'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const field = (name: keyof PassengerData, placeholder: string, type = 'text', hint?: string) => (
    <div className="flex flex-col relative">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={data[name] as string}
        onChange={handleChange}
        className={`border ${errors[name] ? 'border-red-400' : 'border-gray-300'} rounded px-4 py-3 w-full focus:border-indigo-500 outline-none text-sm`}
      />
      {hint && <span className="text-xs text-gray-400 absolute right-4 top-3.5">{hint}</span>}
      {errors[name] && <span className="text-red-500 text-xs mt-1">{errors[name]}</span>}
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* ── Form ── */}
          <div className="md:col-span-2 space-y-8 max-w-2xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-2">
                Passenger information
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Enter the required information for each traveler and be sure that it exactly matches
                the government-issued ID presented at the airport.
              </p>
            </div>

            {/* Passenger 1 */}
            <div>
              <h2 className="text-lg font-medium text-gray-600 mb-4">Passenger 1 (Adult)</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {field('firstName', 'First name*')}
                  {field('middleName', 'Middle')}
                  {field('lastName', 'Last name*')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {field('suffix', 'Suffix')}
                  {field('dob', 'Date of birth*', 'text', 'MM/DD/YY')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {field('email', 'Email address*', 'email')}
                  {field('phone', 'Phone number*', 'tel')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {field('redressNumber', 'Redress number')}
                  {field('knownTravelerNumber', 'Known traveller number*')}
                </div>
              </div>
            </div>

            {/* Emergency contact */}
            <div>
              <h2 className="text-lg font-medium text-gray-600 mb-3">
                Emergency contact information
              </h2>
              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  name="sameAsPassenger"
                  checked={data.sameAsPassenger}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-gray-500 text-sm">Same as Passenger 1</span>
              </label>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {field('emergencyFirstName', 'First name*')}
                  {field('emergencyLastName', 'Last name*')}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {field('emergencyEmail', 'Email address*', 'email')}
                  {field('emergencyPhone', 'Phone number*', 'tel')}
                </div>
              </div>
            </div>

            {/* Bag information */}
            <div>
              <h2 className="text-lg font-medium text-gray-600 mb-3">Bag information</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Each passenger is allowed one free carry-on bag and one personal item. First checked
                bag is also free. Second bag check fees are waived for loyalty members.{' '}
                <a href="#" className="text-indigo-600">
                  See the full bag policy.
                </a>
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-500 font-medium text-sm">Passenger 1</div>
                <div className="text-gray-500 font-medium text-sm text-center">Checked bags</div>
                <div className="text-gray-800 text-sm">
                  {data.firstName || 'First'} {data.lastName || 'Last'}
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() =>
                      setData((p) => ({ ...p, bagChecked: Math.max(0, p.bagChecked - 1) }))
                    }
                    className="w-8 h-8 rounded bg-gray-100 text-gray-500 hover:bg-gray-200 text-lg"
                  >
                    −
                  </button>
                  <span className="font-medium text-gray-800">{data.bagChecked}</span>
                  <button
                    onClick={() => setData((p) => ({ ...p, bagChecked: p.bagChecked + 1 }))}
                    className="w-8 h-8 rounded bg-gray-100 text-indigo-600 hover:bg-gray-200 text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => validate() && alert('Saved!')}
                className="w-full sm:w-auto px-8 py-3 border-2 border-indigo-600 text-indigo-600 font-bold rounded text-sm"
              >
                Save and close
              </button>
              <button
                onClick={() => {
                  if (validate()) {
                    router.push(`/seats?p1=${encodeURIComponent((data.firstName + ' ' + data.lastName).trim() || 'Guest')}`)
                  }
                }}
                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded text-sm"
              >
                Select seats
              </button>
            </div>
          </div>

          {/* ── Cart summary (same as chooseflight) ── */}
          <div className="hidden md:block space-y-6">
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              {selectedFlights.length > 0 ? (
                <>
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
                      onClick={() => {
                        if (validate()) {
                          router.push(`/seats?p1=${encodeURIComponent((data.firstName + ' ' + data.lastName).trim() || 'Guest')}`)
                        }
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                    >
                      Select seat
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-5 text-sm text-gray-500">
                  No flight selected yet. Please choose a flight on the Choose Flight page.
                </div>
              )}
            </div>

            {/* ── Luggage image ── */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[280px] h-[360px]">
                <Image src="/images/Luggage.png" alt="Luggage" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
