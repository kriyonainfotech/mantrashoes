'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MarqueeStrip from '@/components/MarqueeStrip';
import CategorySection from '@/components/CategorySection';
import BrandStory from '@/components/BrandStory';
import Reviews from '@/components/Reviews';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import InstagramReels from '@/components/InstagramReels';

export default function Home() {
  const { data, fetchData } = useAppStore();

  useEffect(() => { fetchData(); }, [fetchData]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f3ee' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-t-transparent animate-spin"
            style={{ border: '0.5px solid #0a0a0a', borderTopColor: 'transparent' }}
          />
          <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.35em', color: '#888' }}>
            LOADING
          </p>
        </div>
      </div>
    );
  }

  const activeCategories = (data.categories?.filter((c: any) => c.isActive) || []);

  return (
    <main style={{ backgroundColor: '#f5f3ee' }}>
      {/* 1. Navbar */}
      <Navbar theme={data.theme} />

      {/* 2. Hero */}
      <Hero data={data.sections.hero} products={data.products} theme={data.theme} />

      {/* 3. Marquee Strip */}
      <MarqueeStrip />

      {/* 4. Category Sections */}
      {activeCategories.map((category: any) => {
        const categoryProducts = (data.products || []).filter(
          (p: any) => p.isActive !== false && (p.category?._id === category._id || p.category === category._id)
        );
        return (
          <CategorySection key={category._id} category={category} products={categoryProducts} />
        );
      })}

      {/* 5. Instagram Reels */}
      <InstagramReels />

      {/* 6. Brand Story */}
      <BrandStory data={data.sections.brandStory} theme={data.theme} />

      {/* 6. Testimonials */}
      <Reviews data={data.sections.reviews} reviews={data.reviews} theme={data.theme} />

      {/* 7. Footer */}
      <Footer data={data.sections.footer} theme={data.theme} />

      {/* Always visible floating WhatsApp */}
      <FloatingWhatsApp />
    </main>
  );
}
