'use client';

import { useState } from 'react';
import { FaPlaneDeparture, FaPlaneArrival } from 'react-icons/fa';
import { MdDateRange } from 'react-icons/md';
import { CiUser } from "react-icons/ci";
import { useRouter } from 'next/navigation';
import LandingCards from './LandingCards';


const airports = ['Delhi (DEL)', 'Mumbai (BOM)', 'Kochi (COK)', 'Bangalore (BLR)', 'Chennai (MAA)', 'Hyderabad (HYD)'];
const airportsTo = ['Dubai (DXB)', 'London (LHR)', 'New York (JFK)', 'Singapore (SIN)', 'Paris (CDG)', 'Tokyo (HND)'];

export default function SearchPage() {
  const router = useRouter();
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [dateValue, setDateValue] = useState('');

  const [adults, setAdults] = useState(1);
  const [minors, setMinors] = useState(0);

  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showTravelers, setShowTravelers] = useState(false);



  const getTravelersText = () => {
    return `${adults} Adult${adults > 1 ? 's' : ''}, ${minors} Minor${minors !== 1 ? 's' : ''}`;
  };

  const handleSearch = () => {
    if (dateValue) {
      window.localStorage.setItem('chosenDate', dateValue);
    }
    if (fromValue) {
      window.localStorage.setItem('fromLocation', fromValue);
    }
    if (toValue) {
      window.localStorage.setItem('toLocation', toValue);
    }
    router.push('/chooseflight');
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center pt-20 px-4">

      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-slate-50 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Heading */}
      <h1 className="text-center text-4xl sm:text-5xl md:text-7xl font-bold text-indigo-500 mb-2 leading-tight px-2">
        It&apos;s more than <br className="hidden sm:block" />
        <span className="text-indigo-600">just a trip</span>
      </h1>

      {/* Search Box */}
      <div className="mt-16 w-full max-w-6xl bg-white rounded-xl shadow-md md:h-16 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">

        {/* FROM */}
        <div className="relative flex-1 flex items-center px-4 py-4 gap-3">
          <FaPlaneDeparture className="text-indigo-500" />
          <input
            value={fromValue}
            placeholder="From where?"
            readOnly
            onClick={() => {
              setShowFrom(!showFrom);
              setShowTo(false);
              setShowDate(false);
              setShowTravelers(false);
            }}
            className="w-full outline-none cursor-pointer"
          />
          {showFrom && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-1 z-50">
              {airports.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setFromValue(item);
                    setShowFrom(false);
                  }}
                  className="px-4 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TO */}
        <div className="relative flex-1 flex items-center px-4 py-4 gap-3">
          <FaPlaneArrival className="text-indigo-500" />
          <input
            value={toValue}
            placeholder="Where to?"
            readOnly
            onClick={() => {
              setShowTo(!showTo);
              setShowFrom(false);
              setShowDate(false);
              setShowTravelers(false);
            }}
            className="w-full outline-none cursor-pointer"
          />
          {showTo && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-1 z-50">
              {airportsTo.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setToValue(item);
                    setShowTo(false);
                  }}
                  className="px-4 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DATE */}
        <div className="relative flex-1 flex items-center px-4 py-4 gap-3">
          <MdDateRange className="text-indigo-500" />
          <input
            value={dateValue}
            placeholder="Select date"
            readOnly
            onClick={() => {
              setShowDate(!showDate);
              setShowFrom(false);
              setShowTo(false);
              setShowTravelers(false);
            }}
            className="w-full outline-none cursor-pointer"
          />
          {showDate && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-1 z-50 p-4">
              <input
                type="date"
                className="w-full border p-2 rounded"
                onChange={(e) => {
                  setDateValue(e.target.value);
                  setShowDate(false);
                }}
              />
            </div>
          )}
        </div>

        {/* TRAVELERS */}
        <div className="relative flex-1 flex items-center px-4 py-4 gap-3">
          <span className="text-indigo-500"><CiUser /></span>
          <input
            value={getTravelersText()}
            readOnly
            onClick={() => {
              setShowTravelers(!showTravelers);
              setShowFrom(false);
              setShowTo(false);
              setShowDate(false);
            }}
            className="w-full outline-none cursor-pointer text-gray-500"
          />

          {showTravelers && (
            <div className="absolute top-full right-0 bg-white shadow-lg rounded-lg mt-1 z-50 p-4 w-64">

              {/* Adults */}
              <div className="flex justify-between items-center mb-3">
                <span>Adults</span>
                <div className="flex gap-2 items-center">
                  <button onClick={() => setAdults(Math.max(1, adults - 1))}>-</button>
                  <span>{adults}</span>
                  <button onClick={() => setAdults(adults + 1)}>+</button>
                </div>
              </div>

              {/* Minors */}
              <div className="flex justify-between items-center">
                <span>Minors</span>
                <div className="flex gap-2 items-center">
                  <button onClick={() => setMinors(Math.max(0, minors - 1))}>-</button>
                  <span>{minors}</span>
                  <button onClick={() => setMinors(minors + 1)}>+</button>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* SEARCH BUTTON */}
        <div className="p-2 flex items-center justify-center">
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-md shadow-sm"
          >
            Search
          </button>
        </div>

      </div>

      <LandingCards/>
    </main>
  );
}
