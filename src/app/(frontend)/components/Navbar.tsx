'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Signin from './signIn';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false); 
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/users/me').then(res => res.json()).then(data => {
      console.log('Navbar: Auth state checked:', data);
      if (data && data.user) setUser(data.user);
    });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/users/logout', { method: 'POST' });
    setUser(null);
    window.location.reload();
  };

  const openSignIn = () => {
    setAuthMode('signin');
    setIsAuthOpen(true);
  };

  const openSignUp = () => {
    setAuthMode('signup');
    setIsAuthOpen(true);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-6 md:px-10 py-5 bg-white border-b border-gray-100">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Tripma
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-8">
            <li><Link href="#" className="text-gray-500 hover:text-indigo-600">Flights</Link></li>
            <li><Link href="#" className="text-gray-500 hover:text-indigo-600">Hotels</Link></li>
            {user && <li><Link href="/bookings" className="text-gray-500 hover:text-indigo-600">Bookings</Link></li>}
          </ul>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-indigo-200">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium hidden lg:block">{user.name || user.email}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button onClick={openSignIn} className="text-gray-500 hover:text-indigo-600 font-medium">
                Sign in
              </button>

              <button
                onClick={openSignUp}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-medium"
              >
                Sign up
              </button>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-6 py-6 space-y-5 shadow-lg">
          <Link href="#" className="block font-semibold">Flights</Link>
          <Link href="#" className="block font-semibold">Hotels</Link>
          {user && <Link href="/bookings" className="block font-semibold">Bookings</Link>}

          <div className="pt-4 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-indigo-200">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-gray-700 font-medium">{user.name || user.email}</div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    openSignIn();
                  }}
                  className="w-full py-3 text-indigo-600 border-2 border-indigo-600 rounded-xl font-semibold"
                >
                  Sign in
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    openSignUp();
                  }}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/*modal Connected */}
      <Signin
        key={isAuthOpen ? authMode : 'closed'}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
