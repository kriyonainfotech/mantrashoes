'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function BrandStory({ data, theme }: { data: any; theme: any }) {
  if (!data?.enabled) return null;

  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative aspect-[4/5] w-full overflow-hidden"
          style={{ border: '0.5px solid rgba(255,255,255,0.08)' }}
        >
          {data.image && (
            <Image src={data.image} alt="Brand Story" fill className="object-cover opacity-80" referrerPolicy="no-referrer" />
          )}
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          <p
            className="mb-5"
            style={{ fontFamily: 'var(--font-cinzel)', fontSize: '8px', letterSpacing: '0.38em', color: 'rgba(255,255,255,0.35)' }}
          >
            OUR STORY
          </p>
          <h2
            className="mb-8 text-white"
            style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.15 }}
          >
            {data.title}
          </h2>
          <div
            className="mb-10"
            style={{ width: '32px', height: '0.5px', backgroundColor: 'rgba(255,255,255,0.2)' }}
          />
          <p
            className="mb-10"
            style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}
          >
            {data.description}
          </p>
          <button
            className="px-8 py-3.5 text-white transition-opacity hover:opacity-75"
            style={{ border: '0.5px solid rgba(255,255,255,0.3)', fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.28em' }}
          >
            DISCOVER OUR STORY
          </button>
        </motion.div>
      </div>
    </section>
  );
}
