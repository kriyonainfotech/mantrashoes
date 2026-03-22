'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function Reviews({ data, reviews, theme }: { data: any; reviews: any[]; theme: any }) {
  if (!data?.enabled || !reviews?.length) return null;

  return (
    <section className="py-24" style={{ backgroundColor: '#F8F5EF' }}>
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>
            What Our Customers Say
          </p>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.2 }}>
            {data.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
              className="flex flex-col p-8"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              {/* Stars — black for B&W consistency */}
              <div className="flex gap-1 mb-5">
                {[...Array(review.rating)].map((_, j) => (
                  <span key={j} style={{ color: '#1A1A1A', fontSize: '14px' }}>★</span>
                ))}
              </div>

              <p className="flex-1 mb-8" style={{ fontFamily: 'var(--font-lora)', fontSize: '17px', fontWeight: 400, fontStyle: 'italic', color: '#444', lineHeight: 1.7 }}>
                &ldquo;{review.review}&rdquo;
              </p>

              <div className="flex items-center gap-3" style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '18px' }}>
                <div className="relative w-10 h-10 overflow-hidden rounded-full flex-shrink-0" style={{ border: '1px solid rgba(0,0,0,0.12)' }}>
                  {review.image && <Image src={review.image} alt={review.name} fill className="object-cover" referrerPolicy="no-referrer" />}
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>{review.name}</p>
                  <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', color: '#999', marginTop: '2px', textTransform: 'uppercase' }}>
                    Verified Buyer
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
