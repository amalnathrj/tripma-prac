import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const payloadCMS = await getPayload({ config })

    const flights = [
      { airline: 'Hawaiian Airlines', flightNo: 'HA-101', duration: '16h 45m', time: '7:00 AM – 4:15 PM', stops: '1 stop', stopDetail: '2h 45m in HNL', price: 624, flag: '🇺🇸', logo: 'hawaiian' },
      { airline: 'Japan Airlines', flightNo: 'JL-202', duration: '18h 22m', time: '7:35 AM – 12:15 PM', stops: '1 stop', stopDetail: '50m in HKG', price: 663, flag: '🇯🇵', logo: 'japan' },
      { airline: 'Hawaiian Airlines', flightNo: 'HA-305', duration: '18h 04m', time: '8:20 AM – 2:15 PM', stops: '1 stop', stopDetail: '1h 50m in PVG', price: 690, flag: '🇺🇸', logo: 'hawaiian' },
      { airline: 'Delta', flightNo: 'DL-408', duration: '18h 52m', time: '9:47 AM – 4:15 PM', stops: '1 stop', stopDetail: '4h 05m in ICN', price: 756, flag: '🇺🇸', logo: 'delta' },
      { airline: 'Korean Air', flightNo: 'KE-511', duration: '17h 30m', time: '10:10 AM – 6:40 PM', stops: '1 stop', stopDetail: '1h 20m in ICN', price: 798, flag: '🇰🇷', logo: 'korean' },
      { airline: 'Singapore Airlines', flightNo: 'SQ-614', duration: '19h 15m', time: '11:00 AM – 8:15 PM', stops: '1 stop', stopDetail: '2h 10m in SIN', price: 812, flag: '🇸🇬', logo: 'singapore' },
      { airline: 'Air China', flightNo: 'CA-701', duration: '16h 05m', time: '11:15 AM – 7:20 PM', stops: 'Nonstop', stopDetail: '', price: 825, flag: '🇨🇳', logo: 'airchina' },
      { airline: 'Qantas', flightNo: 'QF-802', duration: '15h 45m', time: '10:55 AM – 8:15 PM', stops: 'Nonstop', stopDetail: '', price: 839, flag: '🇦🇺', logo: 'qantas' },
    ];

    const stays = [
      { src: '/images/stay1.avif', alt: 'Hotel Kaneyamaen and Bessho SASA', title: 'Hotel Kaneyamaen and Bessho SASA', description: 'Located at the base of Mount Fuji, Hotel Kaneyamaen is a traditional japanese ryokan with a modern twist.' },
      { src: '/images/stay2.avif', alt: 'HOTEL THE FLAG 大阪市', title: 'HOTEL THE FLAG 大阪市', description: 'Make a stop in Osaka and stay at HOTEL THE FLAG, just a few minutes walk to Dontonbori.' },
      { src: '/images/stay3.avif', alt: '9 Hours Shinjuku', title: '9 Hours Shinjuku', description: 'Experience a truly unique stay in an authentic Japanese capsule hotel.' },
    ];

    const deals = [
      { img: 'https://images.unsplash.com/photo-1548013146-72479768bada', title: 'The Bund', place: 'Shanghai', price: '$598', desc: "China's most international city", isBigCard: false },
      { img: 'https://i.natgeofe.com/n/8eba070d-14e5-4d07-8bab-9db774029063/93080_4x3.jpg', title: 'Sydney Opera House', place: 'Sydney', price: '$981', desc: 'Take a stroll along the famous harbor', isBigCard: false },
      { img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e', title: 'Kōdaiji Temple', place: 'Kyoto', price: '$633', desc: 'Step back in time in the Gion district', isBigCard: false },
      { img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=80', title: 'Tsavo East National Park', place: 'Kenya', price: '$1,248', desc: 'Named after the Tsavo River, and opened in April 1984, Tsavo East National Park is one of the oldest parks in Kenya.', isBigCard: true },
    ];

    const testimonials = [
      { name: 'Yifei Chen', location: 'Seoul, South Korea | April 2019', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', text: 'What a great experience using Tripma! I booked all of my flights for my gap year through Tripma and never had any issues.', rating: 5 },
      { name: 'Kaori Yamaguchi', location: 'Honolulu, Hawaii | February 2017', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', text: "Tripma was recommended to us by a long time friend, and I'm so glad we tried it out! The process was easy.", rating: 5 },
      { name: 'Anthony Lewis', location: 'Berlin, Germany | April 2019', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', text: 'Tripma had the best browsing experience. It was my first time using it, but I’d definitely recommend it.', rating: 5 },
    ];

    for (const data of flights) await payloadCMS.create({ collection: 'flights', data });
    for (const data of stays) await payloadCMS.create({ collection: 'stays', data });
    for (const data of deals) await payloadCMS.create({ collection: 'flightDeals', data });
    for (const data of testimonials) await payloadCMS.create({ collection: 'testimonials', data });

    return NextResponse.json({ success: true, message: 'Database seeded successfully!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
