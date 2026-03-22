'use client';

import Link from 'next/link';
import { MapPin, Phone, Clock, Mail, MessageCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { MAPS_URL } from '@/lib/config';


export default function Footer({ data, theme }: { data: any; theme: any }) {
  const { data: storeData } = useAppStore();

  const categories = (storeData?.categories || []).filter((c: any) => c.isActive);
  const phone = data?.phone || '';
  const email = data?.email || '';
  const address = data?.address || '';
  const whatsapp = phone.replace(/\D/g, '');

  return (
    <footer style={{ backgroundColor: '#111111', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-16">

        {/* Col 1 — Brand + Explore */}
        <div>
          <h3 className="mb-4" style={{ fontFamily: 'var(--font-playfair)', fontSize: '22px', fontWeight: 600, color: '#F8F5EF', letterSpacing: '0.01em' }}>
            Mantra Shoes
          </h3>
          <p className="mb-8" style={{ fontFamily: 'var(--font-lora)', fontSize: '15px', fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.4)', lineHeight: 1.85 }}>
            {data?.description || 'Comfortable, authentic footwear trusted by Surat families for decades.'}
          </p>

          <p className="mb-5" style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
            Explore
          </p>
          <ul className="space-y-3">
            {categories.map((c: any) => (
              <li key={c._id}>
                <Link href={`/category/${c.slug}`} className="nav-link flex items-center gap-2.5"
                  style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>
                  {/* <span style={{ width: '14px', height: '1.5px', backgroundColor: 'rgba(255,255,255,0.25)', display: 'inline-block', flexShrink: 0, borderRadius: '2px' }} /> */}
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/about" className="nav-link flex items-center gap-2.5"
                style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>
                {/* <span style={{ width: '14px', height: '1.5px', backgroundColor: 'rgba(255,255,255,0.25)', display: 'inline-block', flexShrink: 0, borderRadius: '2px' }} /> */}
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="nav-link flex items-center gap-2.5"
                style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>
                {/* <span style={{ width: '14px', height: '1.5px', backgroundColor: 'rgba(255,255,255,0.25)', display: 'inline-block', flexShrink: 0, borderRadius: '2px' }} /> */}
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 2 — Get In Touch */}
        <div>
          <p className="mb-8" style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
            Get In Touch
          </p>
          <ul className="space-y-6">
            {address && (
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }} />
                <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 400, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{address}</span>
              </li>
            )}
            {phone && (
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
                <a href={`tel:${phone}`} style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>{phone}</a>
              </li>
            )}
            {email && (
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }} />
                <a href={`mailto:${email}`} style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>{email}</a>
              </li>
            )}
            <li className="flex items-start gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }} />
              <div style={{ fontFamily: 'var(--font-nunito)', fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.45)', lineHeight: 1.9 }}>
                <p><span style={{ color: '#F8F5EF', fontWeight: 600 }}>Mon – Sat</span> &nbsp; 10:00 AM – 9:00 PM</p>
                <p><span style={{ color: '#F8F5EF', fontWeight: 600 }}>Sunday</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 11:00 AM – 7:00 PM</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Col 3 — Location */}
        <div>
          <p className="mb-8" style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
            Find Us
          </p>
          <div className="overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)', lineHeight: 0 }}>
            <iframe
              title="Store Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.0375153604436!2d72.89777149678952!3d21.230360899999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04ffa27aea0f9%3A0xee381d774311cf4f!2sMantra%20Shoes!5e0!3m2!1sen!2sin!4v1773905041077!5m2!1sen!2sin"
              width="100%" height="300"
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a href={`${MAPS_URL}Mantra+Shoes+Surat`} target="_blank" rel="noopener noreferrer"

            className="inline-flex items-center gap-2 mt-4 transition-opacity hover:opacity-70"
            style={{ fontFamily: 'var(--font-nunito)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)' }}>
            <MapPin className="w-3 h-3" />
            Get Directions
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.25)' }}>
            © {new Date().getFullYear()} Mantra Shoes, Surat. All rights reserved.
          </span>
          <span style={{ fontFamily: 'var(--font-lora)', fontSize: '15px', fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.3)' }}>
            Trusted footwear, since day one.
          </span>
        </div>
      </div>
    </footer>
  );
}
