"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function SeatsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const passengerName = searchParams.get("p1") || "Guest";

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [activeClass, setActiveClass] = useState("economy");
  const [route, setRoute] = useState({ from: "SFO", to: "NRT" });

  React.useEffect(() => {
    const from = window.localStorage.getItem("fromLocation") || "SFO";
    const to = window.localStorage.getItem("toLocation") || "NRT";
    // Extract code from something like "Delhi (DEL)"
    const fromCode = from.includes("(") ? from.split("(")[1].split(")")[0] : from;
    const toCode = to.includes("(") ? to.split("(")[1].split(")")[0] : to;
    setRoute({ from: fromCode, to: toCode });
  }, []);

  // 🎯 Better Seat UI
  const renderSeat = (row: number, col: string, type: string) => {
    const id = `${row}${col}`;
    const isSelected = selectedSeat === id;

    return (
      <button
        key={id}
        onClick={() => setSelectedSeat(id)}
        className={`
          w-9 h-12 rounded-t-xl transition-all duration-200 relative
          ${type === "business"
            ? "bg-gradient-to-b from-teal-300 to-teal-500"
            : "bg-gradient-to-b from-indigo-400 to-indigo-600"}
          ${isSelected
            ? "ring-2 ring-white scale-110 shadow-xl"
            : "hover:scale-105"}
        `}
      >
        {/* seat base */}
        <div className="absolute bottom-0 w-full h-1.5 bg-black/10 rounded-b"></div>
      </button>
    );
  };

  const renderRow = (row: number, type: string) => (
    <div key={row} className="flex justify-center items-center gap-3 mb-4">
      <span className="text-xs text-gray-400 w-4">{row}</span>

      <div className="flex gap-1">
        {renderSeat(row, "A", type)}
        {renderSeat(row, "B", type)}
        {type !== "business" && renderSeat(row, "C", type)}
      </div>

      <div className="w-8" />

      <div className="flex gap-1">
        {type !== "business" && renderSeat(row, "D", type)}
        {renderSeat(row, "E", type)}
        {renderSeat(row, "F", type)}
      </div>

      <span className="text-xs text-gray-400 w-4">{row}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">

      {/* ✈️ LEFT SIDE */}
      <div className="md:w-[60%] bg-indigo-50 flex flex-col items-center py-10 px-4">
        <h2 className="text-gray-600 text-sm mb-6">Select your seat</h2>

        {/* Business */}
        <div className="mb-10">
          {[1, 2, 3, 4].map((r) => renderRow(r, "business"))}
        </div>

        <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider">
          Economy
        </p>

        {[5, 6, 7, 8, 9, 10, 11, 12].map((r) =>
          renderRow(r, "economy")
        )}
      </div>

      {/* 📋 RIGHT SIDE */}
      <div className="md:w-[40%] border-l p-6 flex flex-col justify-between">

        {/* ✈️ TOP BAR */}
        <div className="flex h-20 rounded-xl overflow-hidden mb-6">
          <div className="bg-[#1F2029] w-[50%] flex items-center justify-center text-white font-bold">
            {route.from} → {route.to}
          </div>
          <div className="bg-indigo-600 w-[25%] flex flex-col items-center justify-center text-white text-sm">
            <p>Feb 25</p>
            <span className="text-xs opacity-80">Departing</span>
          </div>
          <div className="bg-gray-800 w-[25%] flex flex-col items-center justify-center text-white text-sm">
            <p>Mar 21</p>
            <span className="text-xs opacity-60">Arriving</span>
          </div>
        </div>

        {/* 💺 CLASS CARDS */}
        <div className="grid grid-cols-2 gap-6">

          {/* Economy Card */}
          <div
            onClick={() => setActiveClass("economy")}
            className={`p-6 rounded-2xl cursor-pointer border-2 transition
              ${activeClass === "economy"
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200"}
            `}
          >
            <div className="relative h-28 w-full mb-6">
              <Image
                src="/images/Blue.png"
                alt="Economy"
                fill
                className="object-contain"
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Economy
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              Standard seating with essential services.
            </p>

            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                Built-in entertainment
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                Complimentary snacks
              </li>
            </ul>
          </div>

          {/* Business Card */}
          <div
            onClick={() => setActiveClass("business")}
            className={`p-6 rounded-2xl cursor-pointer border-2 transition
              ${activeClass === "business"
                ? "border-teal-500 bg-teal-50"
                : "border-gray-200"}
            `}
          >
            <div className="relative h-28 w-full mb-6">
              <Image
                src="/images/Green.png"
                alt="Business"
                fill
                className="object-contain"
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Business class
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              Premium comfort with personalized service.
            </p>

            <ul className="text-sm text-teal-600 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-600 rounded-full" />
                Extended leg room
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-600 rounded-full" />
                Priority boarding
              </li>
            </ul>
          </div>
        </div>

        {/* 🔻 BOTTOM */}
        <div className="mt-10 border-t pt-6">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400">Passenger</p>
              <p className="font-semibold">{passengerName}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Seat</p>
              <p className="font-semibold">
                {selectedSeat || "Not selected"}
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push(`/payment?p1=${encodeURIComponent(passengerName)}&seat=${selectedSeat || "Not selected"}`)}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
