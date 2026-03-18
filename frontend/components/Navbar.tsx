'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, MapPin, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export default function Navbar({ theme }: { theme: any }) {
  const { data } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const address = data?.sections?.footer?.address || '123 Luxury Way, Beverly Hills, CA';
  const phone = data?.sections?.footer?.phone || '+15550000000';
  const whatsappNumber = phone.replace(/\D/g, '');

  // Max 8 navbar categories, sorted by navbarIndex (already sorted from backend)
  const categories = (data?.categories?.filter((c: any) => c.isActive && c.showInNavbar) || []).slice(0, 8);

  return (
    <header className="fixed top-0 w-full z-50">
      {/* Top Bar */}
      <div className="bg-black text-white px-6 py-2 flex items-center justify-between">
        <Link href="/">
          <span className="text-xl font-bold tracking-tighter" style={{ fontFamily: 'var(--font-montserrat)' }}>
            MANTRA
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-xs">
          <span className="flex items-center gap-1 text-gray-300">
            <MapPin className="w-3 h-3" />
            {address}
          </span>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 transition-colors text-white px-3 py-1.5 rounded-full text-xs font-medium"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Category Bar */}
      {categories.length > 0 && (
        <div className="hidden md:block bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-8 py-3">
            {categories.map((c: any) => (
              <Link key={c._id} href={`/category/${c.slug}`}>
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-700 hover:text-black transition-colors whitespace-nowrap">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-md"
          >
            <div className="flex flex-col px-6 py-4 space-y-3">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-sm font-medium uppercase tracking-widest text-black block py-2 border-b border-gray-100">Home</span>
              </Link>
              {categories.map((c: any) => (
                <Link key={c._id} href={`/category/${c.slug}`} onClick={() => setMobileMenuOpen(false)}>
                  <span className="text-sm font-medium uppercase tracking-widest text-black block py-2 border-b border-gray-100">
                    {c.name}
                  </span>
                </Link>
              ))}
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-600 text-sm font-medium py-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
              <p className="text-xs text-gray-500 flex items-center gap-1 py-1">
                <MapPin className="w-3 h-3" />
                {address}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
