import React from 'react'
import './styles.css'
import '../global.css'
import GoogleAuthProvider from './providers/GoogleAuthProvider'

export const metadata = {
  description: 'Book your next adventure with Tripma. The best deals on flights, hotels and stays.',
  title: 'Tripma - Flight Booking & Travel',
  keywords: 'flights, travel, booking, hotels, tripma, cheap flights',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <GoogleAuthProvider>
          <main>{children}</main>
        </GoogleAuthProvider>
      </body>
    </html>
  )
}
