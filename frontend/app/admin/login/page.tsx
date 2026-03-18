'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setAuth } from '@/lib/redux/slices/authSlice';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setAuth({ user: data.user, token: data.token }));
        router.push('/admin');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream relative overflow-hidden font-dm-sans">
      {/* Subtle Ghost Branding */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
        <h1 className="text-[30vw] font-bebas">MANTRA</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm z-10"
      >
        <div className="bg-white p-10 border-thin shadow-xl relative overflow-hidden">
          {/* Top Line accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-ink"></div>
          
          <div className="mb-10 text-center">
            <h2 className="eyebrow text-[9px] uppercase tracking-[0.4em] mb-4 font-bold text-ink/40">Mantra Shoes</h2>
            <h1 className="text-4xl font-bebas tracking-tight text-ink mb-2">Admin <span className="italic-serif text-3xl lowercase">Console</span></h1>
            <p className="text-[11px] text-ink/50 uppercase tracking-widest">Walk the Talk</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink/40 mb-1.5 block group-focus-within:text-ink transition-colors">
                Email Address
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-cream/30 border border-ink/10 px-4 py-3 text-sm focus:outline-none focus:border-ink/30 transition-all font-dm-sans tracking-tight"
                placeholder="admin@mantrashoes.com"
              />
            </div>

            <div className="relative group">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink/40 mb-1.5 block group-focus-within:text-ink transition-colors">
                Security Key
              </label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-cream/30 border border-ink/10 px-4 py-3 text-sm focus:outline-none focus:border-ink/30 transition-all font-dm-sans tracking-tight"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-500 text-[10px] uppercase tracking-widest font-bold text-center animate-pulse">
                {error}
              </p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full relative group bg-ink text-cream py-4 overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <span className="z-10 relative font-bebas text-xl tracking-[0.2em] uppercase">
                {isLoading ? 'Verifying...' : 'Authenticate'}
              </span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-ink/5 flex justify-center">
            <span className="text-[9px] uppercase tracking-[0.3em] text-ink/30 font-bold">Mantra Systems v2.4</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
