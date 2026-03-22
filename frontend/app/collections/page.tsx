'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function Collections() {
  const { data, fetchData } = useAppStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F5EF' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '1.5px solid #1A1A1A', borderTopColor: 'transparent' }} />
          <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
            Loading
          </p>
        </div>
      </div>
    );
  }

  const collections = data.collections || [];

  return (
    <main style={{ backgroundColor: '#F8F5EF', minHeight: '100vh' }}>
      <Navbar theme={data.theme} />
      
      {/* ── Collections Header ── */}
      <div className="w-full pt-40 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-3" style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
            Mantra Curation
          </p>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.1 }}>
            {data.sections.collectionsHeader?.title || "COLLECTIONS"}
          </h1>
          <p className="mt-5 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-lora)', fontSize: '17px', fontStyle: 'italic', fontWeight: 400, color: '#666', lineHeight: 1.7 }}>
            {data.sections.collectionsHeader?.subtitle || "Curated series for every aspect of your active lifestyle."}
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <span style={{ width: '40px', height: '1px', backgroundColor: 'rgba(0,0,0,0.1)' }} />
            <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: '#aaa', textTransform: 'uppercase' }}>
              {collections.length} {collections.length === 1 ? 'collection' : 'collections'}
            </p>
            <span style={{ width: '40px', height: '1px', backgroundColor: 'rgba(0,0,0,0.1)' }} />
          </div>
        </div>
      </div>

      <div className="py-12 px-4 md:px-6 max-w-7xl mx-auto space-y-12">
        {collections.map((collection: any, index: number) => (
          <motion.div 
            key={collection.id || index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[65vh] w-full overflow-hidden group flex items-center justify-center"
            style={{ backgroundColor: '#ECEAE5' }}
          >
            <Image
              src={collection.image}
              alt={collection.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            <div className="relative z-10 text-center text-white px-6">
              <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 600, marginBottom: '16px', letterSpacing: '0.05em' }}>
                {collection.title.toUpperCase()}
              </h2>
              <p style={{ fontFamily: 'var(--font-lora)', fontSize: '18px', fontStyle: 'italic', fontWeight: 300, marginBottom: '32px', color: 'rgba(255,255,255,0.9)', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                {collection.description}
              </p>
              <Link 
                href="/shop"
                className="inline-block px-10 py-4 font-semibold uppercase tracking-widest text-xs transition-colors"
                style={{ backgroundColor: '#fff', color: '#1A1A1A' }}
              >
                Explore Collection
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <Footer data={data.sections.footer} theme={data.theme} />
    </main>
  );
}
