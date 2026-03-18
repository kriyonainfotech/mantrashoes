'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function Hero({ data, products, theme }: { data: any, products: any[], theme: any }) {
  const heroProducts = products?.filter(p => p.showInHero) || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (heroProducts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroProducts.length]);

  if (!data?.enabled && heroProducts.length === 0) return null;

  // If no products are toggled for hero, fallback to static hero
  if (heroProducts.length === 0) {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          {data.image && (
            <Image
              src={data.image}
              alt="Hero"
              fill
              className="object-cover opacity-60"
              referrerPolicy="no-referrer"
              priority
            />
          )}
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {data.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-200 mb-10 font-light"
          >
            {data.subtitle}
          </motion.p>
        </div>
      </section>
    );
  }

  const currentProduct = heroProducts[currentIndex];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProduct._id || currentProduct.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={typeof currentProduct.images?.[0] === 'string' ? currentProduct.images[0] : currentProduct.images?.[0]?.url || ''}
            alt={currentProduct.name}
            fill
            className="object-cover opacity-60"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto mt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${currentProduct.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-gray-300 mb-4 block">
              Featured Collection
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6" style={{ fontFamily: 'var(--font-montserrat)' }}>
              {currentProduct.name}
            </h1>
            <p className="text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto line-clamp-2">
              {currentProduct.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={`/product/${currentProduct._id || currentProduct.id}`}>
                <button className="w-full sm:w-auto bg-white text-black px-8 py-4 font-semibold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  View Details
                </button>
              </Link>
              <button
                onClick={() => {
                  const message = `Hi, I want to order "${currentProduct.name}" from the Hero section.`;
                  window.open(`https://wa.me/${currentProduct.whatsapp || '14155552671'}?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-4 font-semibold uppercase tracking-widest text-xs hover:bg-[#1da851] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Order Now
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slider Dots */}
      {heroProducts.length > 1 && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-20">
          {heroProducts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
