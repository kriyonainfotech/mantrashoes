'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { motion } from 'motion/react';

export default function Collections() {
  const { data, fetchData } = useAppStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
        </div>
      </div>
    );
  }

  const collections = data.collections || [];

  return (
    <main className="min-h-screen bg-white">
      <Navbar theme={data.theme} />
      
      <div className="bg-black pt-40 pb-20 px-6 text-white text-center">
        <h1 className="text-5xl font-bold tracking-tighter" style={{ fontFamily: 'var(--font-montserrat)' }}>
          {data.sections.collectionsHeader?.title || "COLLECTIONS"}
        </h1>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          {data.sections.collectionsHeader?.subtitle || "Curated series for every aspect of your active lifestyle."}
        </p>
      </div>

      <div className="py-24 px-6 max-w-7xl mx-auto space-y-16">
        {collections.map((collection: any, index: number) => (
          <motion.div 
            key={collection.id || index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[60vh] w-full overflow-hidden group cursor-pointer flex items-center justify-center"
          >
            <Image
              src={collection.image}
              alt={collection.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            <div className="relative z-10 text-center text-white p-6">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter" style={{ fontFamily: 'var(--font-montserrat)' }}>
                {collection.title}
              </h2>
              <p className="text-lg md:text-xl mb-8 font-light">{collection.description}</p>
              <button className="px-8 py-4 bg-white text-black font-semibold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors">
                Explore Series
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Footer data={data.sections.footer} theme={data.theme} />
    </main>
  );
}
