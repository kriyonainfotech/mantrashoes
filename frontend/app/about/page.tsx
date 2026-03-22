'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import BrandStory from '@/components/BrandStory';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function About() {
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
          OUR STORY
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
          {data.sections.aboutHeader?.title || 'About Mantra'}
        </h1>
        <p
          className="mt-5 max-w-xl"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '20px',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#888',
            lineHeight: 1.7,
          }}
        >
          {data.sections.aboutHeader?.subtitle || 'The journey of Mantra Shoes and our commitment to excellence.'}
        </p>
      </section>

      {/* ── Brand Story ── */}
      <BrandStory data={{ ...data.sections.brandStory, enabled: true }} theme={data.theme} />

      {/* ── CTA ── */}
      <section className="w-full py-20 px-6 flex flex-col items-center text-center" style={{ borderTop: '0.5px solid rgba(10,10,10,0.08)' }}>
        <p
          style={{
            fontFamily: 'var(--font-cinzel)',
            fontSize: '10px',
            letterSpacing: '0.5em',
            color: '#aaa',
            marginBottom: '16px',
          }}
        >
          WALK WITH US
        </p>
        <h2
          className="mb-6"
          style={{
            fontFamily: 'var(--font-cinzel)',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 400,
            letterSpacing: '0.06em',
            color: '#0a0a0a',
          }}
        >
          Visit Our Store
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/contact"
            className="px-8 py-3.5 text-white transition-all duration-200"
            style={{
              backgroundColor: '#0a0a0a',
              fontFamily: 'var(--font-cinzel)',
              fontSize: '10px',
              letterSpacing: '0.3em',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            CONTACT US
          </Link>
          <Link
            href="/shop"
            className="px-8 py-3.5 transition-all duration-200"
            style={{
              border: '0.5px solid rgba(10,10,10,0.3)',
              fontFamily: 'var(--font-cinzel)',
              fontSize: '10px',
              letterSpacing: '0.3em',
              color: '#0a0a0a',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(10,10,10,0.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            SHOP NOW
          </Link>
        </div>
      </section>

      <Footer data={data.sections.footer} theme={data.theme} />
    </main>
  );
}
