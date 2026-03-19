'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

function getImg(img: any) {
  return typeof img === 'string' ? img : img?.url || '';
}

export default function Hero({ data, products, theme }: { data: any; products: any[]; theme: any }) {
  const heroProducts = products?.filter((p) => p.showInHero && p.isActive !== false) || [];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (heroProducts.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % heroProducts.length), 5500);
    return () => clearInterval(t);
  }, [heroProducts.length]);

  // Static fallback
  if (heroProducts.length === 0) {
    return (
      <section className="relative h-screen w-full overflow-hidden flex items-end" style={{ backgroundColor: '#0a0a0a' }}>
        {data?.image && (
          <Image src={data.image} alt="Hero" fill className="object-cover opacity-50" priority referrerPolicy="no-referrer" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 md:pb-28">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/50 mb-4"
            style={{ fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.35em' }}
          >
            NEW COLLECTION
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="text-white mb-6"
            style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.05, letterSpacing: '0.02em' }}
          >
            {data?.title || 'Mantra'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/60 max-w-md mb-10"
            style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 300, lineHeight: 1.7 }}
          >
            {data?.subtitle}
          </motion.p>
        </div>
      </section>
    );
  }

  const product = heroProducts[idx];

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-end" style={{ backgroundColor: '#0a0a0a' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={product._id || product.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={getImg(product.images?.[0])}
            alt={product.name}
            fill
            className="object-cover opacity-55"
            priority
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      {/* Content — bottom left editorial layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 md:pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={`txt-${product._id}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-white/40 mb-3"
              style={{ fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.38em' }}
            >
              {product.category?.name || 'COLLECTION'}
            </p>
            <h1
              className="text-white mb-5 max-w-2xl"
              style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.05, letterSpacing: '0.01em' }}
            >
              {product.name}
            </h1>
            {product.description && (
              <p
                className="text-white/55 max-w-sm mb-8 line-clamp-2"
                style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 300, lineHeight: 1.75 }}
              >
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-4">
              <Link href={`/product/${product._id || product.id}`}>
                <button
                  className="px-7 py-3 text-white transition-opacity hover:opacity-80"
                  style={{ border: '0.5px solid rgba(255,255,255,0.5)', fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.28em' }}
                >
                  VIEW DETAILS
                </button>
              </Link>
              <button
                onClick={() => {
                  const msg = encodeURIComponent(`Hi, I want to order "${product.name}" — ₹${product.price}`);
                  window.open(`https://wa.me/${product.whatsapp}?text=${msg}`, '_blank');
                }}
                className="flex items-center gap-2 px-7 py-3 text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#25D366', fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.28em' }}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                ORDER NOW
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      {heroProducts.length > 1 && (
        <div className="absolute bottom-8 right-6 z-20 flex items-center gap-2">
          {heroProducts.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="transition-all"
              style={{
                width: i === idx ? '24px' : '6px',
                height: '0.5px',
                backgroundColor: i === idx ? 'white' : 'rgba(255,255,255,0.35)',
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
