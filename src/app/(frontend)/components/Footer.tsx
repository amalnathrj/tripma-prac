'use client'

import Link from 'next/link'
import { FaTwitter } from 'react-icons/fa'
import { FaInstagram } from 'react-icons/fa6'
import { FaFacebook } from 'react-icons/fa'
import { FaApple } from 'react-icons/fa'
import { IoLogoGooglePlaystore } from 'react-icons/io5'

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Logo */}
          <div>
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Tripma
            </Link>
          </div>

          {/* About */}
          <div>
            <h3 className="text-gray-600 font-semibold mb-4">About</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  About Tripma
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  How it works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Forum
                </a>
              </li>
            </ul>
          </div>

          {/* Partner */}
          <div>
            <h3 className="text-gray-600 font-semibold mb-4">Partner with us</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Partnership programs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Affiliate program
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Connectivity partners
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Promotions and events
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Loyalty program
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gray-600 font-semibold mb-4">Support</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Terms of service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Trust and safety
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>

          {/* App */}
          <div>
            <h3 className="text-gray-600 font-semibold mb-4">Get the app</h3>
            <ul className="flex flex-col gap-3 mb-6">
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Tripma for Android
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Tripma for iOS
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-indigo-600 text-sm">
                  Mobile site
                </a>
              </li>
            </ul>

            <div className="flex flex-col gap-2">
              <button className="bg-black text-white rounded-md px-4 py-2 flex items-center gap-3 hover:bg-gray-800 w-fit">
                <FaApple className="text-xl" />

                <div className="flex flex-col leading-tight">
                  <span className="text-[8px]">Download on the</span>
                  <span className="text-[12px] font-semibold">App Store</span>
                </div>
              </button>
              <button className="bg-black text-white rounded-md px-4 py-2 flex items-center gap-3 hover:bg-gray-800 w-fit">
                <IoLogoGooglePlaystore className="text-lg" />

                <div className="flex flex-col leading-tight">
                  <span className="text-[8px] uppercase">GET IT ON</span>
                  <span className="text-[12px] font-semibold">Google Play</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Social */}
          <div className="flex gap-4 text-gray-400 text-2xl">
            <span className="hover:text-indigo-600 cursor-pointer">
              <FaTwitter />
            </span>
            <span className="hover:text-indigo-600 cursor-pointer">
              <FaInstagram />
            </span>
            <span className="hover:text-indigo-600 cursor-pointer">
              <FaFacebook />
            </span>
          </div>

          {/* Copyright */}
          <div className="text-gray-400 text-sm">© 2020 Tripma incorporated</div>
        </div>
      </div>
    </footer>
  )
}
