'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function BrandStory({ data, theme }: { data: any; theme: any }) {
  if (!data?.enabled) return null;

  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: '#111111' }}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="relative aspect-[4/5] w-full overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {data.image && (
            <Image src={data.image} alt="Brand Story" fill className="object-cover opacity-80" referrerPolicy="no-referrer" />
          )}
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15 }}
        >
          <p className="mb-4" style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
            Our Story
          </p>
          <h2 className="mb-6 text-white" style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 600, lineHeight: 1.2 }}>
            {data.title}
          </h2>
          {/* Clean white divider bar — no color */}
          <div className="mb-8" style={{ width: '48px', height: '2px', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: '2px' }} />
          <p className="mb-10" style={{ fontFamily: 'var(--font-lora)', fontSize: '17px', fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.55)', lineHeight: 1.9 }}>
            {data.description}
          </p>
          <button
            className="px-8 py-3.5 text-white transition-all hover:bg-white hover:text-black"
            style={{ border: '1.5px solid rgba(255,255,255,0.35)', fontFamily: 'var(--font-nunito)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.06em', transition: 'all 200ms ease' }}
          >
            Discover Our Story
          </button>
        </motion.div>
      </div>
    </section>
  );
}
