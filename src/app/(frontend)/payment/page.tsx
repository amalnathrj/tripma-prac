'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Footer from '../components/Footer'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebookSquare } from 'react-icons/fa'
import Navbar from '../components/Navbar'

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

export default function Payment() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const flightIdsString = searchParams.get('flights') || ''
  const flightIds = flightIdsString ? flightIdsString.split(',') : []
  const passengerName = searchParams.get('p1') || 'Guest'
  const selectedSeat = searchParams.get('seat') || '9F'
  const email = searchParams.get('email') || ''

  const [flights, setFlights] = useState<any[]>([])
  const [storedFlightIds, setStoredFlightIds] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/flights').then(res => res.json()).then(data => setFlights(data.docs || []))
  }, [])

  useEffect(() => {
    if (flightIds.length === 0 && storedFlightIds.length === 0) {
      const saved = window.localStorage.getItem('selectedFlights')
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as number[]
          const ids = parsed.map((id) => id.toString())
          if (ids.length > 0) {
            setStoredFlightIds(ids)
          }
        } catch {
          // ignore invalid JSON
        }
      }
    }
  }, [flightIds.length, storedFlightIds.length])

  const activeFlightIds = flightIds.length > 0 ? flightIds : storedFlightIds
  const selectedFlights = flights.filter((flight) => activeFlightIds.includes(flight.id.toString()))

  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [saveCard, setSaveCard] = useState(false)
  const [formData, setFormData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    email: '',
    password: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmAndPay = async () => {
    if (!isFormValid) return;
    setIsLoading(true);

    try {
      const userRes = await fetch('/api/users/me');
      const userData = await userRes.json();

      if (!userData || !userData.user) {
        alert('Please sign in or sign up to book a flight.');
        setIsLoading(false);
        return;
      }

      // 1. Create Payment record
      const paymentPayload = {
        user: userData.user.id,
        amount: total,
        method: paymentMethod,
        status: 'success'
      };
      
      const paymentRes = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentPayload)
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error('Failed to create payment record');

      // 2. Create Seat record
      const seatPayload = {
        user: userData.user.id,
        seatNumber: selectedSeat,
        flight: selectedFlights[0]?.id || '',
        passengerName: passengerName
      };

      const seatRes = await fetch('/api/seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seatPayload)
      });
      const seatData = await seatRes.json();
      if (!seatRes.ok) throw new Error('Failed to create seat record');

      // 3. Create Booking record linking them together
      const storedChosenDate = typeof window !== 'undefined' ? window.localStorage.getItem('chosenDate') : null;
      const storedFrom = typeof window !== 'undefined' ? window.localStorage.getItem('fromLocation') : null;
      const storedTo = typeof window !== 'undefined' ? window.localStorage.getItem('toLocation') : null;
      
      const bookingPayload = {
        user: userData.user.id,
        flight: selectedFlights[0]?.id || '',
        seat: seatData.doc.id,
        payment: paymentData.doc.id,
        status: 'confirmed',
        passengerName: passengerName,
        seatNumber: selectedSeat,
        totalAmount: total,
        chosenDate: storedChosenDate ? new Date(storedChosenDate).toISOString() : null,
        from: storedFrom,
        to: storedTo
      };

      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      if (!bookingRes.ok) {
        const errorData = await bookingRes.json();
        throw new Error('Failed to create booking. ' + (errorData.errors ? JSON.stringify(errorData.errors) : ''));
      }

      const finalEmail = formData.email || email;
      router.push(
        `/paymentsuccess?flights=${flightIds.join(',')}&p1=${encodeURIComponent(passengerName)}&seat=${selectedSeat}&email=${encodeURIComponent(finalEmail)}`
      );
    } catch (e) {
      console.error(e);
      alert('An error occurred during booking.');
      setIsLoading(false);
    }
  };

  const subtotal = selectedFlights.reduce((sum, flight) => sum + (flight.price || 500), 0)
  const taxesAndFees = Math.round(subtotal * 0.12)
  const total = subtotal + taxesAndFees

  const isCreditCardValid =
    formData.nameOnCard.trim() !== '' &&
    formData.cardNumber.trim() !== '' &&
    formData.expirationDate.trim() !== '' &&
    formData.cvv.trim() !== ''

  const isFormValid = paymentMethod === 'credit-card' ? isCreditCardValid : true

  return (
    <div>
        <Navbar/>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment method</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Select a payment method below. Tripma processes your payment securely with
                  end-to-end encryption.
                </p>

                <div className="flex flex-wrap md:flex-nowrap border border-indigo-200 rounded-lg overflow-hidden mb-8 min-h-[48px] w-full max-w-[700px]">
                  {[
                    {
                      id: 'credit-card',
                      label: 'Credit card',
                      icon: (
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      ),
                    },
                    {
                      id: 'google-pay',
                      label: 'Google Pay',
                      icon: <FcGoogle />,
                    },
                    {
                      id: 'apple-pay',
                      label: 'Apple pay',
                      icon: <span className="text-xl leading-none"></span>,
                    },
                    {
                      id: 'paypal',
                      label: 'Paypal',
                      icon: <span className="font-bold italic text-lg leading-none">P</span>,
                    },
                    {
                      id: 'crypto',
                      label: 'Crypto',
                      icon: (
                        <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">
                          B
                        </div>
                      ),
                    },
                  ].map((method, idx, arr) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium min-w-[120px] md:min-w-0 ${
                        paymentMethod === method.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-indigo-400 hover:bg-indigo-50'
                      } ${idx !== arr.length - 1 ? 'border-r border-indigo-100' : ''}`}
                    >
                      {method.icon}
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'credit-card' && (
                  <>
                    <h3 className="text-base font-medium text-gray-800 mb-4">
                      Credit card details
                    </h3>

                    <div className="flex items-start gap-2 mb-4 p-3 rounded text-sm text-indigo-700 bg-indigo-50">
                      <InfoIcon />
                      <span>Billing address is same as Passenger 1</span>
                    </div>

                    <div className="space-y-4 w-full max-w-md">
                      <div>
                        <input
                          type="text"
                          name="nameOnCard"
                          placeholder="Name on card"
                          className="w-full border border-gray-300 rounded px-4 py-3 focus:border-indigo-500 outline-none"
                          value={formData.nameOnCard}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="Card number"
                          className="w-full border border-gray-300 rounded px-4 py-3 focus:border-indigo-500 outline-none"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="expirationDate"
                          placeholder="Expiration date"
                          className="border border-gray-300 rounded px-4 py-3 focus:border-indigo-500 outline-none"
                          value={formData.expirationDate}
                          onChange={handleInputChange}
                        />
                        <div className="relative">
                          <input
                            type="text"
                            name="cvv"
                            placeholder="CVV"
                            className="w-full border border-gray-300 rounded px-4 py-3 focus:border-indigo-500 outline-none"
                            value={formData.cvv}
                            onChange={handleInputChange}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <InfoIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Create an account</h2>
                <p className="text-sm text-gray-500 mb-6 max-w-2xl">
                  Tripma is free to use as a guest, but if you create an account today, you can save
                  and view flights, manage your trips, earn rewards and more.
                </p>

                <div className="flex items-center gap-2 mb-6">
                  <input
                    type="checkbox"
                    id="saveCard"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="saveCard"
                    className="text-sm text-gray-700 select-none cursor-pointer"
                  >
                    Save card and create account for later
                  </label>
                </div>

                <div className="space-y-4 mb-6 w-full max-w-md">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address or phone number"
                    className="w-full border border-gray-300 rounded px-4 py-3 focus:border-indigo-500 outline-none"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border border-gray-300 rounded px-4 py-3 focus:border-indigo-500 outline-none"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-3 w-full max-w-md">
                  <button className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 flex items-center justify-center gap-2">
                    <span className="text-lg">
                      <FcGoogle />
                    </span>{' '}
                    Sign up with Google
                  </button>
                  <button className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 flex items-center justify-center gap-2">
                    <span className="text-lg"></span> Continue with Apple
                  </button>
                  <button className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 flex items-center justify-center gap-2">
                    <span className="text-lg">
                      <FaFacebookSquare />
                    </span>{' '}
                    Continue with Facebook
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium text-gray-800 mb-3">Cancellation policy</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                  This flight has a flexible cancellation policy. If you cancel or change your
                  flight up to 30 days before the departure date, you are eligible for a free
                  refund.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto px-8 py-3 border-2 border-indigo-600 text-indigo-600 font-bold rounded-lg"
                >
                  Back to seat select
                </button>
                <button
                  type="button"
                  disabled={!isFormValid || isLoading}
                  onClick={handleConfirmAndPay}
                  className={`w-full sm:w-auto px-12 py-3 font-bold rounded-lg ${
                    isFormValid && !isLoading
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                      : 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Confirm and pay'}
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="border border-gray-200 p-5 bg-white mb-6 rounded-lg">
                {selectedFlights.length > 0 ? (
                  <>
                    <div className="divide-y divide-gray-100">
                      {selectedFlights.map((flight, index) => (
                        <div
                          key={flight.id}
                          className={`${index !== selectedFlights.length - 1 ? 'border-b border-gray-100 mb-6 pb-6' : ''}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
                                <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                  {flight.logo === 'hawaiian'
                                    ? '🇺🇸'
                                    : flight.logo === 'japan'
                                      ? '🇯🇵'
                                      : flight.logo === 'delta'
                                        ? '🇺🇸'
                                        : flight.logo === 'qantas'
                                          ? '🇦🇺'
                                          : flight.airline?.charAt(0) || 'H'}
                                </div>
                              </div>
                              <div>
                                <div className="text-base font-medium text-gray-800">
                                  {flight.airline}
                                </div>
                                <div className="text-sm text-indigo-400 mt-1">
                                  {flight.flightNo}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-base font-normal text-gray-800">
                                {flight.duration}
                              </div>
                              <div className="text-base font-normal text-gray-800 mt-1">
                                {flight.time}
                              </div>
                              {flight.stopDetail && (
                                <div className="text-sm text-gray-400 mt-1">
                                  {flight.stopDetail}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 space-y-3">
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Seat upgrade</span>
                        <span className="font-medium text-gray-900">$199</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-gray-900">${subtotal}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Taxes and Fees</span>
                        <span className="font-medium text-gray-900">${taxesAndFees}</span>
                      </div>
                      <div className="flex items-center justify-between text-lg font-semibold text-gray-800 pt-2">
                        <span>Total</span>
                        <span>${total}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                      <button
                        type="button"
                        disabled={!isFormValid || isLoading}
                        onClick={handleConfirmAndPay}
                        className={`px-8 py-3 font-medium rounded-lg ${
                          isFormValid && !isLoading
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {isLoading ? 'Processing...' : 'Confirm and pay'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500">
                    No flight selected yet. Please choose a flight on the Choose Flight page.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
