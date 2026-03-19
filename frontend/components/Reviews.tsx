'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function Reviews({ data, reviews, theme }: { data: any; reviews: any[]; theme: any }) {
  if (!data?.enabled || !reviews?.length) return null;

  return (
    <section className="py-24" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '8px', letterSpacing: '0.38em', color: 'rgba(255,255,255,0.3)', marginBottom: '14px' }}>
            TESTIMONIALS
          </p>
          <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 300, fontStyle: 'italic', color: 'white' }}>
            {data.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="flex flex-col p-8"
              style={{ backgroundColor: '#f5f3ee' }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, j) => (
                  <span key={j} style={{ color: '#0a0a0a', fontSize: '11px' }}>★</span>
                ))}
              </div>

              <p
                className="flex-1 mb-8"
                style={{ fontFamily: 'var(--font-cormorant)', fontSize: '19px', fontWeight: 300, fontStyle: 'italic', color: '#0a0a0a', lineHeight: 1.65 }}
              >
                "{review.review}"
              </p>

              <div className="flex items-center gap-3" style={{ borderTop: '0.5px solid rgba(10,10,10,0.1)', paddingTop: '18px' }}>
                <div className="relative w-9 h-9 overflow-hidden rounded-full flex-shrink-0" style={{ border: '0.5px solid rgba(10,10,10,0.12)' }}>
                  {review.image && (
                    <Image src={review.image} alt={review.name} fill className="object-cover" referrerPolicy="no-referrer" />
                  )}
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 500, color: '#0a0a0a' }}>
                    {review.name}
                  </p>
                  <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '7.5px', letterSpacing: '0.2em', color: '#888', marginTop: '2px' }}>
                    VERIFIED BUYER
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
