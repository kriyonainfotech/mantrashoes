'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

export default function InstagramGallery({ data }: { data: any }) {
  if (!data?.enabled) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-montserrat)' }}>
          {data.title}
        </h2>
        <a 
          href={data.profileLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm font-semibold uppercase tracking-widest hover:underline mt-4 inline-block"
        >
          View on Instagram
        </a>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 w-full">
        {data.images?.map((img: string, i: number) => (
          <motion.a 
            key={i} 
            href={data.profileLink} 
            target="_blank" 
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative aspect-square group overflow-hidden block bg-gray-100"
          >
            <Image 
              src={img} 
              alt={`Instagram post ${i + 1}`} 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-700" 
              referrerPolicy="no-referrer" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Instagram className="w-8 h-8 text-white transform scale-50 group-hover:scale-100 transition-transform duration-300" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
