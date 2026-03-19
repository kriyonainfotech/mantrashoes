'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, MessageCircle, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';

export default function Navbar({ theme }: { theme: any }) {
  const { data } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const phone = data?.sections?.footer?.phone || '';
  const address = data?.sections?.footer?.address || '';
  const whatsapp = phone.replace(/\D/g, '');
  const categories = (data?.categories?.filter((c: any) => c.isActive && c.showInNavbar) || []).slice(0, 8);

  return (
    <header className="fixed top-0 w-full z-50" style={{ backgroundColor: 'rgba(245,243,238,0.96)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>

      {/* Row 1 — Logo + Address + Phone + WhatsApp */}
      <div
        className="w-full"
        style={{ borderBottom: '0.5px solid rgba(10,10,10,0.08)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ border: '0.5px solid #0a0a0a' }}>
              <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '10px', color: '#0a0a0a' }}>M</span>
            </div>
            <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '13px', letterSpacing: '0.32em', color: '#0a0a0a' }}>
              MANTRA
            </span>
          </Link>

          {/* Address + Phone — desktop */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {address && (
              <span className="flex items-center gap-1.5" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 300, color: '#888' }}>
                <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: '#888' }} />
                {address}
              </span>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-1.5" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 300, color: '#888' }}>
                <Phone className="w-3 h-3 flex-shrink-0" style={{ color: '#888' }} />
                {phone}
              </a>
            )}
          </div>

          {/* WhatsApp button — desktop */}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-white flex-shrink-0"
              style={{
                backgroundColor: '#25D366',
                fontFamily: 'var(--font-cinzel)',
                fontSize: '9px',
                letterSpacing: '0.22em',
                transition: 'transform 200ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WHATSAPP
            </a>
          )}

          {/* Mobile: WhatsApp + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8"
                style={{ backgroundColor: '#25D366' }}
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-white" />
              </a>
            )}
            <button className="flex items-center justify-center w-8 h-8" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen
                ? <X className="w-5 h-5" style={{ color: '#0a0a0a' }} />
                : <Menu className="w-5 h-5" style={{ color: '#0a0a0a' }} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Row 2 — Category links (desktop only) */}
      {categories.length > 0 && (
        <div
          className="hidden md:block w-full"
          style={{ borderBottom: scrolled ? '0.5px solid rgba(10,10,10,0.08)' : '0.5px solid transparent', transition: 'border-color 300ms ease' }}
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-center gap-10">
            {categories.map((c: any) => (
              <Link
                key={c._id}
                href={`/category/${c.slug}`}
                className="nav-link"
                style={{ fontFamily: 'var(--font-cinzel)', fontSize: '16px', letterSpacing: '0.08em', color: '#0a0a0a' }}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ backgroundColor: 'rgba(245,243,238,0.97)', borderTop: '0.5px solid rgba(10,10,10,0.08)' }}
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {categories.map((c: any) => (
                <Link
                  key={c._id}
                  href={`/category/${c.slug}`}
                  onClick={() => setMobileOpen(false)}
                  style={{ fontFamily: 'var(--font-cinzel)', fontSize: '10px', letterSpacing: '0.28em', color: '#0a0a0a' }}
                >
                  {c.name}
                </Link>
              ))}
              {address && (
                <p className="flex items-center gap-2 pt-2" style={{ borderTop: '0.5px solid rgba(10,10,10,0.08)', fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 300, color: '#888' }}>
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  {address}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
