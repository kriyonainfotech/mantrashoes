'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink } from 'lucide-react';

export default function ContactPage() {
  const { data, fetchData } = useAppStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f3ee' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full animate-spin"
            style={{ border: '0.5px solid #0a0a0a', borderTopColor: 'transparent' }}
          />
          <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.35em', color: '#888' }}>
            LOADING
          </p>
        </div>
      </div>
    );
  }

  const footer = data.sections?.footer || {};
  const phone = footer.phone || '';
  const email = footer.email || '';
  const address = footer.address || '';
  const whatsapp = phone.replace(/\D/g, '');

  const contactItems = [
    address && {
      icon: <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: '#aaa' }} />,
      label: 'VISIT US',
      value: address,
      href: 'https://maps.google.com/?q=Mantra+Shoes+Surat',
      linkLabel: 'Get Directions',
    },
    phone && {
      icon: <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#aaa' }} />,
      label: 'CALL US',
      value: phone,
      href: `tel:${phone}`,
      linkLabel: 'Call Now',
    },
    email && {
      icon: <Mail className="w-5 h-5 flex-shrink-0" style={{ color: '#aaa' }} />,
      label: 'EMAIL US',
      value: email,
      href: `mailto:${email}`,
      linkLabel: 'Send Email',
    },
    {
      icon: <Clock className="w-5 h-5 flex-shrink-0" style={{ color: '#aaa' }} />,
      label: 'HOURS',
      value: 'Mon – Sat: 10:00 AM – 9:00 PM\nSunday: 11:00 AM – 7:00 PM',
      href: null,
      linkLabel: null,
    },
  ].filter(Boolean) as any[];

  return (
    <main style={{ backgroundColor: '#f5f3ee' }}>
      <Navbar theme={data.theme} />

      {/* ── Hero ── */}
      <section
        className="w-full pt-36 pb-20 px-6 flex flex-col items-center text-center"
        style={{ borderBottom: '0.5px solid rgba(10,10,10,0.08)' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-cinzel)',
            fontSize: '10px',
            letterSpacing: '0.5em',
            color: '#aaa',
            marginBottom: '18px',
          }}
        >
          GET IN TOUCH
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-cinzel)',
            fontSize: 'clamp(2rem, 6vw, 4.5rem)',
            fontWeight: 400,
            letterSpacing: '0.08em',
            color: '#0a0a0a',
            lineHeight: 1.1,
          }}
        >
          Contact Us
        </h1>
        <p
          className="mt-5 max-w-md"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '20px',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#888',
            lineHeight: 1.7,
          }}
        >
          We&apos;d love to hear from you. Visit our store or reach out anytime.
        </p>
      </section>

      {/* ── Contact Details + Map ── */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Left — Info Cards */}
        <div className="flex flex-col gap-6">
          {contactItems.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-5 p-6"
              style={{
                backgroundColor: 'rgba(255,255,255,0.55)',
                border: '0.5px solid rgba(10,10,10,0.08)',
                backdropFilter: 'blur(8px)',
                transition: 'box-shadow 200ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div
                className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(10,10,10,0.04)', border: '0.5px solid rgba(10,10,10,0.06)' }}
              >
                {item.icon}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-cinzel)',
                    fontSize: '9px',
                    letterSpacing: '0.4em',
                    color: '#aaa',
                    marginBottom: '6px',
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: '15px',
                    fontWeight: 300,
                    color: '#444',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {item.value}
                </p>
                {item.href && (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 transition-opacity hover:opacity-60"
                    style={{
                      fontFamily: 'var(--font-cinzel)',
                      fontSize: '9px',
                      letterSpacing: '0.3em',
                      color: '#0a0a0a',
                    }}
                  >
                    {item.linkLabel}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* WhatsApp CTA */}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center rounded-full justify-center gap-3 py-4 px-6 text-white transition-all duration-200"
              style={{
                backgroundColor: '#0fb04a',
                fontFamily: 'var(--font-cinzel)',
                fontSize: '15px',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <MessageCircle className="w-4 h-4" />
              CHAT ON WHATSAPP
            </a>
          )}
        </div>

        {/* Right — Map */}
        <div className="flex flex-col gap-4">
          <p
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontSize: '9px',
              letterSpacing: '0.4em',
              color: '#aaa',
              marginBottom: '8px',
            }}
          >
            FIND US ON THE MAP
          </p>
          <div
            className="overflow-hidden"
            style={{ border: '0.5px solid rgba(10,10,10,0.1)', lineHeight: 0 }}
          >
            <iframe
              title="Mantra Shoes Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.0375153604436!2d72.89777149678952!3d21.230360899999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04ffa27aea0f9%3A0xee381d774311cf4f!2sMantra%20Shoes!5e0!3m2!1sen!2sin!4v1773905041077!5m2!1sen!2sin"
              width="100%"
              height="480"
              style={{ border: 0, display: 'block', filter: 'grayscale(20%) contrast(105%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href="https://maps.google.com/?q=Mantra+Shoes+Surat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start transition-opacity hover:opacity-60"
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontSize: '9px',
              letterSpacing: '0.3em',
              color: '#aaa',
            }}
          >
            <MapPin className="w-3 h-3" />
            OPEN IN GOOGLE MAPS
          </a>
        </div>
      </section>

      <Footer data={data.sections.footer} theme={data.theme} />
    </main>
  );
}
