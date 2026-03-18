'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { MessageCircle, ArrowLeft, ShieldCheck, Truck, RefreshCw, Tag } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

function getImgUrl(img: any) {
  return typeof img === 'string' ? img : img?.url || '';
}

export default function ProductPage() {
  const { data, fetchData } = useAppStore();
  const { id } = useParams() as { id: string };
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-[3px] border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const product = data.products.find((p: any) => (p._id || p.id) === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/shop" className="text-sm uppercase tracking-widest underline">Return to Shop</Link>
      </div>
    );
  }

  const images = product.images || [];
  const variants = product.variants || [];
  const hasDiscount = product.mrp > product.price;
  const discountPct = hasDiscount ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const categorySlug = product.category?.slug;
  const categoryName = product.category?.name || product.category;

  const whatsappMsg = encodeURIComponent(
    `Hi, I want to order "${product.name}" — ₹${product.price}${selectedVariant !== null ? `, Size: ${variants[selectedVariant]?.size}` : ''}.`
  );

  return (
    <main className="min-h-screen bg-white">
      <Navbar theme={data.theme} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 mb-10">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          {categorySlug ? (
            <Link href={`/category/${categorySlug}`} className="hover:text-black transition-colors">{categoryName}</Link>
          ) : (
            <span>{categoryName}</span>
          )}
          <span>/</span>
          <span className="text-black truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* ── Left: Image Gallery ── */}
          <div className="flex gap-3">
            {/* Vertical thumbnails */}
            {images.length > 1 && (
              <div className="flex flex-col gap-2 w-16 flex-shrink-0">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-16 h-16 overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === idx ? 'border-black' : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <Image src={getImgUrl(img)} alt="" fill className="object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="relative flex-1 aspect-[4/5] bg-gray-50 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={getImgUrl(images[activeImage])}
                    alt={product.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {hasDiscount && (
                <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2.5 py-1 uppercase tracking-widest">
                  -{discountPct}%
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Product Info ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col"
          >
            {/* Category + Brand */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {categoryName}
              </span>
              {product.brand && (
                <>
                  <span className="text-gray-200">|</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">{product.brand}</span>
                </>
              )}
            </div>

            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-5"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold">₹{product.price.toLocaleString()}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    Save ₹{(product.mrp - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <div className="w-full h-px bg-gray-100 mb-6" />

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 leading-relaxed text-sm mb-6">
                {product.description}
              </p>
            )}

            {/* Variants / Sizes */}
            {variants.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                  Select Size
                  {selectedVariant !== null && (
                    <span className="ml-2 text-black">— {variants[selectedVariant]?.size}</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariant(idx)}
                      disabled={v.stock === 0}
                      className={`w-12 h-12 text-sm font-semibold border transition-all ${
                        selectedVariant === idx
                          ? 'border-black bg-black text-white'
                          : v.stock === 0
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                          : 'border-gray-300 hover:border-black text-gray-700'
                      }`}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Material tags */}
            {(product.material || product.soleMaterial) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.material && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                    <Tag className="w-3 h-3" /> {product.material}
                  </span>
                )}
                {product.soleMaterial && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                    <Tag className="w-3 h-3" /> Sole: {product.soleMaterial}
                  </span>
                )}
              </div>
            )}

            {/* WhatsApp CTA */}
            <button
              onClick={() =>
                window.open(
                  `https://wa.me/${product.whatsapp || '14155552671'}?text=${whatsappMsg}`,
                  '_blank'
                )
              }
              className="w-full bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.98] transition-all text-white py-4 font-bold uppercase tracking-widest flex items-center justify-center gap-3 text-sm shadow-lg shadow-green-500/20 mb-3"
            >
              <MessageCircle className="w-5 h-5" />
              Order via WhatsApp
            </button>

            <p className="text-center text-xs text-gray-400 mb-8">
              Chat directly — no account needed
            </p>

            {/* Trust bar */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-100">
              {[
                { icon: ShieldCheck, label: '100% Authentic' },
                { icon: Truck, label: 'Fast Delivery' },
                { icon: RefreshCw, label: 'Easy Returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center text-center gap-2">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer data={data.sections.footer} theme={data.theme} />
    </main>
  );
}
