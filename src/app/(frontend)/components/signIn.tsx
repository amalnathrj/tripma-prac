'use client';

import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

interface SigninProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export default function Signin({ isOpen, onClose, initialMode = 'signin' }: SigninProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuthSuccess = () => {
    setIsLoading(false);
    onClose();
    window.location.reload();
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.errors?.[0]?.message || data.error || data.message || 'Login failed';
        throw new Error(errorMsg);
      }
      handleAuthSuccess();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Create user in Payload
      const createRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) {
        let errorMsg = createData.errors?.[0]?.message || createData.error || createData.message || 'Signup failed';
        if (errorMsg.includes('The following field is invalid: email')) {
          errorMsg = 'This email is already registered. Please sign in instead.';
        }
        throw new Error(errorMsg);
      }
      
      // 2. Automatically log them in
      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        const errorMsg = loginData.errors?.[0]?.message || loginData.error || loginData.message || 'Login after signup failed';
        throw new Error(errorMsg);
      }

      handleAuthSuccess();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError('');
      try {
        console.log('Google Auth: Got access token, sending to backend...');
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            access_token: tokenResponse.access_token
          }),
        });
        const data = await res.json();
        console.log('Google Auth: Backend response:', res.status, data);
        if (!res.ok) throw new Error(data.error || 'Google login failed');
        handleAuthSuccess();
      } catch (err: any) {
        console.error('Google Auth Error:', err);
        setError(err.message);
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth Error:', error);
      setError('Google Login Failed. Please check your popup blocker settings.');
    }
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-8 w-full max-w-md mx-4 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {mode === 'signin' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to Tripma</h2>
            <p className="text-gray-400 text-sm mb-6">
              Tripma is totally free to use. Sign in using your email address or phone number below to get started.
            </p>

            {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}

            <form className="space-y-4" onSubmit={handleEmailSignIn}>
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-md"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 border-gray-300 text-gray-700 py-3 border rounded-md"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </>
        )}

        {mode === 'signup' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-400 text-sm mb-6">Join Tripma and start your journey ✈️</p>

            {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}

            <form className="space-y-4" onSubmit={handleEmailSignUp}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 border-gray-300 text-gray-700 py-3 border rounded-md"
              />
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 border-gray-300 text-gray-700 py-3 border rounded-md"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-gray-300 text-gray-700 border rounded-md"
              />
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" required className="accent-indigo-600" />
                  I agree to the terms and conditions
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="accent-indigo-600" />
                  Send me the latest deal alerts
                </label>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {isLoading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          </>
        )}

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => googleLogin()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>
          <button className="w-full flex border-gray-300 text-gray-600 items-center justify-center gap-3 py-3 border rounded-md hover:bg-gray-50">
            <FaApple size={20} />
            Continue with Apple
          </button>
          <button className="w-full flex border-gray-300 text-gray-600 items-center justify-center gap-3 py-3 border rounded-md hover:bg-gray-50">
            <FaFacebookSquare size={20} />
            Continue with Facebook
          </button>
        </div>

        <p className="text-sm text-gray-600 text-center mt-6">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
          <span
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-indigo-600 font-medium ml-1 cursor-pointer hover:underline"
          >
            {mode === 'signup' ? 'Sign in' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
}
