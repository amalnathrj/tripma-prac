'use client'

import { useEffect, useState } from 'react';

export default function LandingCards() {
  const [flightDeals, setFlightDeals] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [stays, setStays] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/flightDeals').then(res => res.json()).then(data => setFlightDeals(data.docs || []));
    fetch('/api/testimonials').then(res => res.json()).then(data => setTestimonials(data.docs || []));
    fetch('/api/stays').then(res => res.json()).then(data => setStays(data.docs || []));
  }, []);

  return (
    <div className="flex flex-col items-center px-4">
      {/* Flight Deals */}
      <section className="w-full max-w-6xl mt-55 pb-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-xl md:text-2xl text-gray-500 font-medium">
            Find your next adventure with these{' '}
            <span className="text-indigo-600 font-semibold">flight deals</span>
          </h2>
          <a href="#" className="flex items-center text-gray-400 hover:text-indigo-600">
            All <span className="ml-2 text-xl">→</span>
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {flightDeals.filter(d => !d.isBigCard).map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
            >
              <img
                src={`${item.img}?auto=format&fit=crop&w=800&q=80`}
                className="h-64 w-full object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between mb-1">
                  <h3 className="text-gray-600 font-medium">
                    {item.title}, <span className="text-indigo-600">{item.place}</span>
                  </h3>
                  <span className="font-medium">{item.price}</span>
                </div>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Big Card */}
        {flightDeals.filter(d => d.isBigCard).map((item, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition">
            <img
              src={`${item.img}?auto=format&fit=crop&w=1600&q=80`}
              className="h-96 w-full object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between mb-2">
                <h3 className="text-lg text-gray-600 font-medium">
                  {item.title}, <span className="text-indigo-600">{item.place}</span>
                </h3>
                <span className="text-lg font-medium">{item.price}</span>
              </div>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Places to Stay */}
      <section className="w-full max-w-6xl pb-20">
        <div className="flex justify-between mb-8">
          <h2 className="text-xl md:text-2xl text-gray-500 font-medium">
            Explore unique <span className="text-teal-400 font-semibold">places to stay</span>
          </h2>
          <a href="#" className="text-gray-400 hover:text-teal-400">
            All →
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {stays.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <img
                src={`${item.src || item.img}?auto=format&fit=crop&w=800&q=80`}
                className="h-80 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg text-gray-600 font-medium mb-1">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description || item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md">
            Explore more stays
          </button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full max-w-6xl pb-20 mt-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-500 mb-16">
          What <span className="text-indigo-600">Tripma</span> users are saying
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((user, i) => (
            <div key={i} className="flex flex-col">
              {/* User */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`${user.img}?auto=format&fit=crop&w=150&q=80`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-gray-600 font-semibold">{user.name}</h4>
                  <p className="text-gray-400 text-sm">{user.location}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex text-indigo-500 mb-3">
                {[...Array(user.rating || 5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 leading-relaxed">
                {user.text} <span className="text-indigo-600 cursor-pointer">read more...</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
