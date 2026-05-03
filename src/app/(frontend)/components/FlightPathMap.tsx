import Image from 'next/image'

export default function FlightPathMap() {
  return (
    <div className="w-full max-w-7xl mx-auto mt-12 mb-12">
      <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden">

        {/* Map (Left) */}
        <div className="w-full md:w-2/3 h-40 bg-indigo-100 relative overflow-hidden flex-shrink-0">
          <Image
            src="/images/Map.png"
            alt="Flight path map"
            fill
            className="object-cover"
          />
        </div>

        {/* Price Rating (Right) */}
        <div className="w-full md:w-1/3 px-8 pt-6 pb-8 flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-gray-600 font-medium text-lg">Price rating</h3>
            <span className="bg-teal-400 text-white text-xs font-bold px-3 py-1 rounded">
              Buy soon
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            We recommend booking soon. The average cost of this flight is{' '}
            <span className="font-medium text-gray-800">$750</span>, but could rise 18% to{' '}
            <span className="font-medium text-gray-800">$885</span> in two weeks.
          </p>
          <p className="text-gray-400 text-xs">
            Tripma analyzes thousands of flights, prices, and trends to ensure you get the best deal.
          </p>
        </div>

      </div>
    </div>
  )
}