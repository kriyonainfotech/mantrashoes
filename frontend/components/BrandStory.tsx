'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function BrandStory({ data, theme }: { data: any, theme: any }) {
  if (!data?.enabled) return null;

  return (
    <section className="py-24 bg-gray-50" style={{ backgroundColor: theme?.softBackground }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] w-full"
          >
            {data.image && (
              <Image
                src={data.image}
                alt="Brand Story"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'var(--font-montserrat)' }}>
              {data.title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {data.description}
            </p>
            <button 
              className="px-8 py-4 bg-black text-white font-semibold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors"
              style={{ backgroundColor: theme?.primaryColor, color: theme?.secondaryColor }}
            >
              Discover Our Story
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
