'use client';

import Link from 'next/link';
import { MapPin, Phone, Clock, Mail, MessageCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function Footer({ data, theme }: { data: any; theme: any }) {
  const { data: storeData } = useAppStore();

  const categories = (storeData?.categories || []).filter((c: any) => c.isActive);
  const phone = data?.phone || '';
  const email = data?.email || '';
  const address = data?.address || '';
  const whatsapp = phone.replace(/\D/g, '');

  return (
    <footer style={{ backgroundColor: '#f5f3ee', borderTop: '0.5px solid rgba(10,10,10,0.1)' }}>
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-16">

        {/* Col 1 — What's In Store */}
        <div>
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: '0.5px solid #0a0a0a' }}>
              <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '11px', color: '#0a0a0a' }}>M</span>
            </div>
            <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '14px', letterSpacing: '0.32em', color: '#0a0a0a' }}>MANTRA</span>
          </div>

          <p className="mb-10" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', fontWeight: 300, color: '#888', lineHeight: 1.8 }}>
            {data?.description || 'Premium luxury footwear for the modern individual.'}
          </p>

          <p className="mb-5" style={{ fontFamily: 'var(--font-cinzel)', fontSize: '10px', letterSpacing: '0.35em', color: '#aaa' }}>
            WHAT'S IN STORE
          </p>
          <ul className="space-y-3">
            {categories.map((c: any) => (
              <li key={c._id}>
                <Link
                  href={`/category/${c.slug}`}
                  className="nav-link flex items-center gap-2.5"
                  style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', fontWeight: 300, color: '#555' }}
                >
                  <span style={{ width: '12px', height: '0.5px', backgroundColor: 'rgba(10,10,10,0.2)', display: 'inline-block', flexShrink: 0 }} />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 2 — Get In Touch */}
        <div>
          <p className="mb-8" style={{ fontFamily: 'var(--font-cinzel)', fontSize: '10px', letterSpacing: '0.35em', color: '#aaa' }}>
            GET IN TOUCH
          </p>

          <ul className="space-y-6">
            {address && (
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#aaa' }} />
                <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', fontWeight: 300, color: '#555', lineHeight: 1.7 }}>
                  {address}
                </span>
              </li>
            )}
            {phone && (
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#aaa' }} />
                <a href={`tel:${phone}`} style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', fontWeight: 300, color: '#555' }}>
                  {phone}
                </a>
              </li>
            )}
            {whatsapp && (
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#25D366' }} />
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', fontWeight: 400, color: '#25D366' }}
                >
                  WhatsApp Us
                </a>
              </li>
            )}
            {email && (
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#aaa' }} />
                <a href={`mailto:${email}`} style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', fontWeight: 300, color: '#555' }}>
                  {email}
                </a>
              </li>
            )}
            <li className="flex items-start gap-3 pt-4" style={{ borderTop: '0.5px solid rgba(10,10,10,0.08)' }}>
              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#aaa' }} />
              <div style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', fontWeight: 300, color: '#888', lineHeight: 1.9 }}>
                <p><span style={{ color: '#0a0a0a', fontWeight: 400 }}>Mon – Sat</span> &nbsp; 10:00 AM – 9:00 PM</p>
                <p><span style={{ color: '#0a0a0a', fontWeight: 400 }}>Sunday</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 11:00 AM – 7:00 PM</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Col 3 — Location */}
        <div>
          <p className="mb-8" style={{ fontFamily: 'var(--font-cinzel)', fontSize: '10px', letterSpacing: '0.35em', color: '#aaa' }}>
            FIND US
          </p>
          <div className="overflow-hidden" style={{ border: '0.5px solid rgba(10,10,10,0.12)' }}>
            <iframe
              title="Store Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.0375153604436!2d72.89777149678952!3d21.230360899999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04ffa27aea0f9%3A0xee381d774311cf4f!2sMantra%20Shoes!5e0!3m2!1sen!2sin!4v1773905041077!5m2!1sen!2sin"
              width="100%"
              height="220"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href="https://maps.google.com/?q=Mantra+Shoes+Surat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 transition-opacity hover:opacity-60"
            style={{ fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.28em', color: '#aaa' }}
          >
            <MapPin className="w-3 h-3" />
            GET DIRECTIONS
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '0.5px solid rgba(10,10,10,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.2em', color: '#aaa' }}>
            © {new Date().getFullYear()} MANTRA SHOES. ALL RIGHTS RESERVED.
          </span>
          <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '15px', fontStyle: 'italic', fontWeight: 300, color: '#aaa' }}>
            Crafted with care.
          </span>
        </div>
      </div>
    </footer>
  );
}
