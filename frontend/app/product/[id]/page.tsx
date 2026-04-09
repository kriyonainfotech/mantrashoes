'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Image from 'next/image';
import { MessageCircle, Heart, ChevronDown, Star, ZoomIn } from 'lucide-react';
import Link from 'next/link';
import { WHATSAPP_URL } from '@/lib/config';

import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

function getImg(img: any) {
  return typeof img === 'string' ? img : img?.url || '';
}

// ── Accordion item ──────────────────────────────────────────────
function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: '0.5px solid rgba(10,10,10,0.12)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5"
      >
        <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', fontWeight: 500, letterSpacing: '0.06em', color: '#0a0a0a' }}>
          {title}
        </span>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
          style={{ color: '#888', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-6" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', fontWeight: 300, color: '#555', lineHeight: 1.85 }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Related product card ────────────────────────────────────────
function RelatedCard({ product }: { product: any }) {
  return (
    <div className="group" style={{ transition: 'transform 220ms ease' }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
      <Link href={`/product/${product._id || product.id}`} className="block">
        <div className="relative overflow-hidden flex items-center justify-center p-4" style={{ aspectRatio: '4/3', backgroundColor: '#e8e6e1' }}>
          {getImg(product.images?.[0]) ? (
            <Image src={getImg(product.images[0])} alt={product.name} fill className="object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply" referrerPolicy="no-referrer" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ fontFamily: 'var(--font-cinzel)', fontSize: '8px', letterSpacing: '0.2em', color: '#aaa' }}>NO IMAGE</div>
          )}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0" style={{ transition: 'transform 220ms ease' }}>
            <button
              onClick={e => {
                e.preventDefault(); e.stopPropagation();
                window.open(`${WHATSAPP_URL}/${product.whatsapp}?text=${encodeURIComponent(`Hi, I want to order "${product.name}" — ₹${product.price}`)}`, '_blank');

              }}
              className="w-full flex items-center justify-center gap-2 py-3 text-white"
              style={{ background: '#0fb04a', fontFamily: 'var(--font-nunito)', fontSize: '12px', fontWeight: 600 }}
            >
              <MessageCircle className="w-3.5 h-3.5" /> ORDER ON WHATSAPP
            </button>
          </div>
        </div>
        <div className="pt-3">
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 400, letterSpacing: '0.12em', color: '#888', marginBottom: '5px', textTransform: 'uppercase' }}>
            {product.category?.name || ''}
          </p>
          <h3 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '20px', fontWeight: 300, fontStyle: 'italic', color: '#0a0a0a', marginBottom: '6px' }}>
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '15px', fontWeight: 500, color: '#0a0a0a' }}>₹{product.price?.toLocaleString()}</span>
            {product.mrp > product.price && (
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 300, color: '#888', textDecoration: 'line-through' }}>₹{product.mrp?.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────
export default function ProductPage() {
  const { data, fetchData } = useAppStore();
  const { id } = useParams() as { id: string };
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const [zoomed, setZoomed] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f3ee' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-full animate-spin" style={{ border: '0.5px solid #0a0a0a', borderTopColor: 'transparent' }} />
          <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.35em', color: '#888' }}>LOADING</p>
        </div>
      </div>
    );
  }

  const product = data.products?.find((p: any) => (p._id || p.id) === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#f5f3ee' }}>
        <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '11px', letterSpacing: '0.28em', color: '#0a0a0a' }}>PRODUCT NOT FOUND</p>
        <Link href="/" style={{ fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.22em', color: '#888' }}>← RETURN HOME</Link>
      </div>
    );
  }

  const images = product.images || [];
  const variants = product.variants || [];
  const hasDiscount = product.mrp > product.price;
  const discountPct = hasDiscount ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const categoryName = product.category?.name || '';
  const categorySlug = product.category?.slug || '';

  // Unique colors from variants
  const colors = [...new Set(variants.map((v: any) => v.color).filter(Boolean))] as string[];

  // Sizes filtered by selected color (or all if no colors)
  const sizesForColor = colors.length > 0
    ? variants.filter((v: any) => v.color === colors[selectedColor])
    : variants;

  const whatsappMsg = encodeURIComponent(
    `Hi, I want to order "${product.name}"${selectedSize !== null ? `, Size: ${sizesForColor[selectedSize]?.size}` : ''}${colors.length > 0 ? `, Color: ${colors[selectedColor]}` : ''} — ₹${product.price?.toLocaleString()}.`
  );

  // Related products — same category, exclude current
  const related = (data.products || [])
    .filter((p: any) => p.isActive !== false && (p._id || p.id) !== id && (p.category?._id === product.category?._id || p.category === product.category?._id))
    .slice(0, 3);

  const featurePills = [
    product.material && `Upper: ${product.material}`,
    product.soleMaterial && `Sole: ${product.soleMaterial}`,
    product.brand && product.brand,
    product.isFeatured && 'Featured',
  ].filter(Boolean) as string[];

  return (
    <main style={{ backgroundColor: '#f5f3ee', minHeight: '100vh' }}>
      <Navbar theme={data.theme} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6" style={{ paddingTop: '88px' }}>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 pb-5 pt-10 border-b border-[rgba(10,10,10,0.08)]">
          {[
            { label: 'Home', href: '/' },
            categorySlug ? { label: categoryName, href: `/category/${categorySlug}` } : null,
            { label: product.name, href: null },
          ].filter(Boolean).map((crumb: any, i, arr) => (
            <span key={i} className="flex items-center gap-2">
              {crumb.href
                ? <Link href={crumb.href} className="nav-link" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 300, color: '#888' }}>{crumb.label}</Link>
                : <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 400, color: '#0a0a0a' }} className="truncate max-w-[180px]">{crumb.label}</span>
              }
              {i < arr.length - 1 && <span style={{ color: '#ccc', fontSize: '12px' }}>/</span>}
            </span>
          ))}
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[58fr_42fr] gap-0 py-10 items-start">

          {/* ── LEFT: Image panel (Stacked for Desktop) ── */}
          <div className="lg:pr-14">
            {/* Desktop: Stacked list | Mobile: Horizontal Scroll */}
            <div className="hidden lg:flex flex-col gap-6">
              {images.map((img: any, idx: number) => (
                <div
                  key={idx}
                  className="relative overflow-hidden group cursor-zoom-in"
                  style={{ backgroundColor: '#e8e6e1', aspectRatio: '4/5' }}
                  onClick={() => { setActiveImage(idx); setZoomed(true); }}
                >
                  <Image
                    src={getImg(img)}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    className="object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105 p-12"
                    referrerPolicy="no-referrer"
                    priority={idx === 0}
                  />
                  {idx === 0 && hasDiscount && (
                    <div className="absolute top-6 left-6 px-3 py-1.5 text-white shadow-xl" style={{ backgroundColor: '#0a0a0a', fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.2em' }}>
                      -{discountPct}% OFF
                    </div>
                  )}
                  <div className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'rgba(245,243,238,0.9)', backdropFilter: 'blur(4px)', border: '0.5px solid rgba(10,10,10,0.1)' }}>
                    <ZoomIn className="w-3.5 h-3.5" style={{ color: '#0a0a0a' }} />
                    <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '8px', letterSpacing: '0.2em', color: '#0a0a0a' }}>VIEW DETAILS</span>
                  </div>
                </div>
              ))}
              {images.length === 0 && (
                <div className="relative aspect-[4/5] bg-[#e8e6e1] flex items-center justify-center" style={{ fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.2em', color: '#aaa' }}>
                  NO IMAGE AVAILABLE
                </div>
              )}
            </div>

            {/* Mobile: Horizontal scroll gallery */}
            <div 
              className="lg:hidden flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 scroll-smooth"
              onScroll={(e) => {
                const target = e.currentTarget;
                const scrollLeft = target.scrollLeft;
                const width = target.clientWidth;
                const idx = Math.round(scrollLeft / width);
                if (idx !== activeImage) setActiveImage(idx);
              }}
            >
              {images.map((img: any, idx: number) => (
                <div
                  key={idx}
                  className="relative w-full aspect-[4/5] flex-shrink-0 snap-start"
                  style={{ backgroundColor: '#e8e6e1' }}
                  onClick={() => { setActiveImage(idx); setZoomed(true); }}
                >
                  <Image
                    src={getImg(img)}
                    alt=""
                    fill
                    className="object-contain mix-blend-multiply p-8"
                    referrerPolicy="no-referrer"
                  />
                  {idx === 0 && hasDiscount && (
                    <div className="absolute top-4 left-4 px-2 py-1 text-white text-[8px] tracking-widest bg-[#0a0a0a]">
                      -{discountPct}%
                    </div>
                  )}
                </div>
              ))}
              {images.length === 0 && (
                <div className="relative w-full aspect-[4/5] bg-[#e8e6e1] flex items-center justify-center text-[9px] tracking-widest text-zinc-400">
                  NO IMAGE
                </div>
              )}
            </div>
            
            {/* Mobile dots */}
            {images.length > 1 && (
              <div className="lg:hidden flex justify-center gap-1.5 mt-4">
                {images.map((_: any, i: number) => (
                  <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: '#0a0a0a', opacity: activeImage === i ? 1 : 0.2 }} />
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Info panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="lg:pl-10 pt-10 lg:pt-0 flex flex-col lg:sticky lg:top-24"
          >
            {/* Category label */}
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 400, letterSpacing: '0.14em', color: '#888', marginBottom: '12px', textTransform: 'uppercase' }}>
              {categoryName}{product.brand ? ` · ${product.brand}` : ''}
            </p>

            {/* Product name */}
            <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', letterSpacing: '0.05em', color: '#0a0a0a', lineHeight: 1.1, marginBottom: '12px' }}>
              {product.name.toUpperCase()}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '32px', fontWeight: 500, color: '#0a0a0a' }}>
                ₹{product.price?.toLocaleString()}
              </span>
              {hasDiscount && (
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '18px', fontWeight: 300, color: '#aaa', textDecoration: 'line-through' }}>
                    ₹{product.mrp?.toLocaleString()}
                  </span>
                  <span className="px-2.5 py-1" style={{ backgroundColor: '#f0f0f0', fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 500, color: '#0a0a0a', border: '0.5px solid rgba(0,0,0,0.05)' }}>
                    Save ₹{(product.mrp - product.price)?.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Description intro */}
            {product.description && (
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '16px', fontWeight: 300, color: '#555', marginBottom: '24px', lineHeight: 1.6 }}>
                {product.description}
              </p>
            )}

            {/* Star rating */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-[rgba(10,10,10,0.08)]">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" style={{ fill: '#0a0a0a', color: '#0a0a0a' }} />
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', fontWeight: 400, color: '#0a0a0a' }}>5.0</span>
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', fontWeight: 300, color: '#888' }}>| 100% Authentic Quality</span>
            </div>

            {/* Color swatches */}
            {colors.length > 0 && (
              <div className="mb-8">
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 500, color: '#0a0a0a', marginBottom: '12px', letterSpacing: '0.05em' }}>
                  SELECT COLOR: <span style={{ color: '#888', fontWeight: 300, marginLeft: '8px' }}>{colors[selectedColor]}</span>
                </p>
                <div className="flex gap-3">
                  {colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedColor(i); setSelectedSize(null); }}
                      title={color}
                      style={{
                        width: '32px', height: '32px',
                        backgroundColor: color.toLowerCase(),
                        borderRadius: '50%',
                        border: selectedColor === i ? '2px solid #0a0a0a' : '1px solid rgba(0,0,0,0.1)',
                        padding: '2px',
                        outline: selectedColor === i ? '1px solid #0a0a0a' : 'none',
                        outlineOffset: '3px',
                        transition: 'all 200ms ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {sizesForColor.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-12">
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 500, color: '#0a0a0a', letterSpacing: '0.05em' }}>
                    SELECT SIZE: {selectedSize !== null ? <span style={{ color: '#888', fontWeight: 300, marginLeft: '8px' }}>UK {sizesForColor[selectedSize]?.size}</span> : ''}
                  </p>
                  <button style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 400, color: '#888', textDecoration: 'underline', letterSpacing: '0.05em' }}>SIZE GUIDE</button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {sizesForColor.map((v: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(idx)}
                      disabled={v.stock === 0}
                      style={{
                        height: '52px',
                        border: '1px solid',
                        borderColor: selectedSize === idx ? '#0a0a0a' : 'rgba(10,10,10,0.12)',
                        backgroundColor: selectedSize === idx ? '#0a0a0a' : 'transparent',
                        color: selectedSize === idx ? 'white' : v.stock === 0 ? '#ccc' : '#0a0a0a',
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '14px',
                        fontWeight: selectedSize === idx ? 500 : 300,
                        cursor: v.stock === 0 ? 'not-allowed' : 'pointer',
                        transition: 'all 200ms ease',
                      }}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 mb-10">
              <button
                onClick={() => window.open(`${WHATSAPP_URL}/${product.whatsapp}?text=${whatsappMsg}`, '_blank')}
                className="w-full flex items-center justify-center gap-3 py-5 text-white"
                style={{
                  background: '#0fb04a',
                  fontFamily: 'var(--font-nunito)',
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  transition: 'all 300ms cubic-bezier(0.23, 1, 0.32, 1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(15,176,74,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <MessageCircle className="w-5 h-5" />
                ORDER ON WHATSAPP
              </button>

              <button
                onClick={() => setWishlist(!wishlist)}
                className="w-full flex items-center justify-center gap-3 py-5"
                style={{
                  border: '1px solid #0a0a0a',
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  transition: 'all 200ms ease',
                }}
              >
                <Heart className="w-4 h-4" style={{ color: wishlist ? '#ff4d4d' : '#0a0a0a', fill: wishlist ? '#ff4d4d' : 'none' }} />
                {wishlist ? 'ADDED TO WISHLIST' : 'ADD TO WISHLIST'}
              </button>
            </div>

            <div className="flex items-center gap-4 mb-10 p-5 bg-white/50 border border-[rgba(10,10,10,0.05)]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 300, color: '#555' }}>
                <span className="font-medium text-[#0a0a0a]">Instant Support:</span> Chat directly with our store for orders and availability.
              </p>
            </div>

            {/* Accordion */}
            <div className="border-b border-[rgba(10,10,10,0.12)]">
              <AccordionItem title="SPECIFICATIONS">
                <div className="grid grid-cols-2 gap-y-4 pt-2">
                  {product.material && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-[#888] mb-1">Material</p>
                      <p className="text-[14px] text-[#0a0a0a]">{product.material}</p>
                    </div>
                  )}
                  {product.soleMaterial && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-[#888] mb-1">Sole Unit</p>
                      <p className="text-[14px] text-[#0a0a0a]">{product.soleMaterial}</p>
                    </div>
                  )}
                  {product.brand && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-[#888] mb-1">Brand</p>
                      <p className="text-[14px] text-[#0a0a0a]">{product.brand}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#888] mb-1">Shipping</p>
                    <p className="text-[14px] text-[#0a0a0a]">Ships in 24-48 hours</p>
                  </div>
                </div>
              </AccordionItem>
              <AccordionItem title="MATERIAL & CARE">
                <p className="leading-relaxed">
                  {product.material ? `Featuring a premium ${product.material} upper for durability and style. ` : ''}
                  {product.soleMaterial ? `Equipped with an ergonomic ${product.soleMaterial} sole for all-day comfort. ` : ''}
                  To maintain quality, wipe with a clean damp cloth. Avoid submerging in water or exposure to heat.
                </p>
              </AccordionItem>
              <AccordionItem title="DELIVERY & RETURNS">
                <p className="leading-relaxed">
                  Standard delivery available across India. We offer returns on manufacturing defects. Order via WhatsApp for personalized sizing assistance.
                </p>
              </AccordionItem>
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="py-16" style={{ borderTop: '0.5px solid rgba(10,10,10,0.08)' }}>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 400, letterSpacing: '0.14em', color: '#888', marginBottom: '8px', textTransform: 'uppercase' }}>You may also like</p>
                <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', fontWeight: 300, fontStyle: 'italic', color: '#0a0a0a' }}>
                  Related Products
                </h2>
              </div>
              {categorySlug && (
                <Link href={`/category/${categorySlug}`} className="nav-link hidden sm:block" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 400, color: '#0a0a0a' }}>
                  View all →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p: any) => <RelatedCard key={p._id || p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <Footer data={data.sections.footer} theme={data.theme} />
      <FloatingWhatsApp
        productName={product.name}
        size={selectedSize !== null ? String(sizesForColor[selectedSize]?.size) : undefined}
      />

      {/* Zoom lightbox */}
      <AnimatePresence>
        {zoomed && getImg(images[activeImage]) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center cursor-zoom-out"
            style={{ backgroundColor: 'rgba(10,10,10,0.92)' }}
            onClick={() => setZoomed(false)}
          >
            <div className="relative w-[90vw] h-[90vh] max-w-3xl">
              <Image src={getImg(images[activeImage])} alt={product.name} fill className="object-contain" referrerPolicy="no-referrer" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
