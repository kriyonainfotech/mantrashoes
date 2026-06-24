'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Image from 'next/image';
import { MessageCircle, Heart, ChevronDown, Star, ZoomIn, Ruler } from 'lucide-react';
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
  const { data } = useAppStore();
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
                window.open(`${WHATSAPP_URL}/${data?.globalSettings?.whatsappNumber || '917405040700'}?text=${encodeURIComponent(`Hi, I want to order "${product.name}" — ₹${product.price}`)}`, '_blank');

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

  const product = data?.products?.find((p: any) => (p._id || p.id) === id);

  const images = product?.images || [];
  const variants = product?.variants || [];
  const colorMap = product?.colorMap || [];
  const hasDiscount = product && product.mrp > product.price;
  const discountPct = hasDiscount ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const categoryName = product?.category?.name || '';
  const categorySlug = product?.category?.slug || '';

  // Build color list from colorMap first, fallback to variant colors
  const colors = useMemo(() => {
    if (colorMap.length > 0) {
      return colorMap.map((c: any) => ({ name: c.name, hex: c.hex || c.name.toLowerCase(), images: c.images || [] }));
    }
    const uniqueColors = [...new Set(variants.map((v: any) => v.color).filter(Boolean))] as string[];
    return uniqueColors.map(c => ({ name: c, hex: c.toLowerCase(), images: [] }));
  }, [colorMap, variants]);

  const selectedColorName = colors[selectedColor]?.name || '';
  const sizesForColor = useMemo(() => {
    if (colors.length > 0) {
      return variants.filter((v: any) => v.color === selectedColorName);
    }
    return variants;
  }, [variants, colors, selectedColorName]);

  // Get the selected variant for stock check
  const selectedVariant = selectedSize !== null ? sizesForColor[selectedSize] : null;
  const stockStatus = useMemo(() => {
    if (!selectedVariant) return null;
    if (selectedVariant.stock === 0) return { label: 'Out of Stock', color: '#dc2626', bg: '#fef2f2' };
    if (selectedVariant.stock <= 3) return { label: `Only ${selectedVariant.stock} left!`, color: '#d97706', bg: '#fffbeb' };
    return { label: 'In Stock', color: '#16a34a', bg: '#f0fdf4' };
  }, [selectedVariant]);

  const displayImages = useMemo(() => {
    if (colors[selectedColor]?.images?.length > 0) {
      return colors[selectedColor].images;
    }
    return images;
  }, [colors, selectedColor, images]);

  // Reset image index when color is selected
  useEffect(() => {
    setActiveImage(0);
  }, [selectedColor]);

  // Early Returns
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

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#f5f3ee' }}>
        <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '11px', letterSpacing: '0.28em', color: '#0a0a0a' }}>PRODUCT NOT FOUND</p>
        <Link href="/" style={{ fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.22em', color: '#888' }}>← RETURN HOME</Link>
      </div>
    );
  }

  const whatsappMsg = encodeURIComponent(
    `Hi, I want to order "${product.name}"${selectedSize !== null ? `, Size: UK ${sizesForColor[selectedSize]?.size}` : ''}${colors.length > 0 ? `, Color: ${selectedColorName}` : ''}${selectedVariant?.sku ? `, SKU: ${selectedVariant.sku}` : ''} — ₹${product.price?.toLocaleString()}.`
  );

  const related = (data.products || [])
    .filter((p: any) => p.isActive !== false && (p._id || p.id) !== id && (p.category?._id === product.category?._id || p.category === product.category?._id))
    .slice(0, 3);

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
          
          {/* ── LEFT: Image panel (Big Display + Thumbnails) ── */}
          <div className="lg:pr-14 lg:sticky lg:top-24">
            <div className="hidden lg:flex flex-col gap-4">
              {/* Featured Image */}
              <div
                className="relative overflow-hidden group cursor-zoom-in rounded-xl border border-[rgba(10,10,10,0.05)]"
                style={{ backgroundColor: '#ffffff', aspectRatio: '1/1' }}
                onClick={() => setZoomed(true)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedColor}-${activeImage}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="absolute inset-0"
                  >
                    {displayImages.length > 0 && (
                      <Image
                        src={getImg(displayImages[activeImage])}
                        alt={`${product.name} featured`}
                        fill
                        className="object-contain mix-blend-multiply transition-transform duration-700 hover:scale-110 p-12"
                        referrerPolicy="no-referrer"
                        priority
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {activeImage === 0 && hasDiscount && (
                  <div className="absolute top-6 left-6 px-3 py-1.5 text-white shadow-xl rounded-sm" style={{ backgroundColor: '#0a0a0a', fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.2em' }}>
                    -{discountPct}% OFF
                  </div>
                )}
                
                <div className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(10,10,10,0.1)' }}>
                  <ZoomIn className="w-4 h-4" style={{ color: '#0a0a0a' }} />
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', color: '#0a0a0a' }}>CLICK TO ENLARGE</span>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {displayImages.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {displayImages.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative overflow-hidden rounded-lg aspect-square transition-all duration-300 ${activeImage === idx ? 'ring-2 ring-black' : 'opacity-60 hover:opacity-100 hover:scale-[1.02]'}`}
                      style={{ backgroundColor: '#ffffff', border: '0.5px solid rgba(10,10,10,0.05)' }}
                    >
                      <Image src={getImg(img)} alt={`Thumbnail ${idx + 1}`} fill className="object-contain p-2" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}

              {displayImages.length === 0 && (
                <div className="relative aspect-[1/1] bg-white flex items-center justify-center rounded-xl border border-[rgba(10,10,10,0.05)]" style={{ fontFamily: 'var(--font-cinzel)', fontSize: '10px', letterSpacing: '0.2em', color: '#aaa' }}>
                  NO IMAGE AVAILABLE
                </div>
              )}
            </div>

            {/* Mobile: Horizontal scroll gallery */}
            <div
              className="lg:hidden flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 scroll-smooth"
              onScroll={(e) => {
                const target = e.currentTarget;
                const idx = Math.round(target.scrollLeft / target.clientWidth);
                if (idx !== activeImage) setActiveImage(idx);
              }}
            >
              {displayImages.map((img: any, idx: number) => (
                <div
                  key={idx}
                  className="relative w-full aspect-square flex-shrink-0 snap-start rounded-xl border border-[rgba(10,10,10,0.05)]"
                  style={{ backgroundColor: '#ffffff' }}
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
            </div>

            {displayImages.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-6">
                {displayImages.map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{ backgroundColor: '#0a0a0a', opacity: activeImage === i ? 1 : 0.2, transform: activeImage === i ? 'scale(1.2)' : 'scale(1)' }}
                  />
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
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 400, letterSpacing: '0.14em', color: '#888', marginBottom: '12px', textTransform: 'uppercase' }}>
              {categoryName}{product.brand ? ` · ${product.brand}` : ''}
            </p>

            <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', letterSpacing: '0.05em', color: '#0a0a0a', lineHeight: 1.1, marginBottom: '12px' }}>
              {product.name.toUpperCase()}
            </h1>

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

            {product.description && (
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '16px', fontWeight: 300, color: '#555', marginBottom: '24px', lineHeight: 1.6 }}>
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-[rgba(10,10,10,0.08)]">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" style={{ fill: '#0a0a0a', color: '#0a0a0a' }} />
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '14px', fontWeight: 400, color: '#0a0a0a' }}>
                5.0 | 100% Authentic Quality
              </span>
            </div>

            {/* ── Color Selection ── */}
            {colors.length > 0 && (
              <div className="mb-8">
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', color: '#0a0a0a', marginBottom: '14px', textTransform: 'uppercase' }}>
                  Color: <span style={{ fontWeight: 300, textTransform: 'capitalize', letterSpacing: '0', color: '#555' }}>{selectedColorName}</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  {colors.map((color: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedColor(i); setSelectedSize(null); }}
                      className="relative group"
                      title={color.name}
                    >
                      <div
                        className="transition-all duration-200"
                        style={{
                          width: '36px', height: '36px',
                          backgroundColor: color.hex,
                          borderRadius: '50%',
                          border: selectedColor === i ? '2.5px solid #0a0a0a' : '1.5px solid rgba(0,0,0,0.1)',
                          outline: selectedColor === i ? '2px solid #0a0a0a' : 'none',
                          outlineOffset: '3px',
                          boxShadow: selectedColor === i ? '0 2px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
                          transform: selectedColor === i ? 'scale(1.1)' : 'scale(1)',
                        }}
                      />
                      {/* Color name tooltip */}
                      <span
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                        style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 500, color: '#888', letterSpacing: '0.04em' }}
                      >
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Size Selection (Nike-style Grid) ── */}
            {sizesForColor.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', color: '#0a0a0a', textTransform: 'uppercase' }}>
                    Size: {selectedSize !== null && <span style={{ fontWeight: 300, letterSpacing: '0', color: '#555' }}>UK {sizesForColor[selectedSize]?.size}</span>}
                  </p>
                  <button
                    className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                    style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 500, color: '#555', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {sizesForColor.map((v: any, idx: number) => {
                    const isSelected = selectedSize === idx;
                    const isOutOfStock = v.stock === 0;
                    const isLowStock = v.stock > 0 && v.stock <= 3;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(idx)}
                        disabled={isOutOfStock}
                        className="relative group"
                        style={{
                          height: '52px',
                          borderRadius: '6px',
                          border: '1.5px solid',
                          borderColor: isSelected ? '#0a0a0a' : isOutOfStock ? 'rgba(10,10,10,0.06)' : 'rgba(10,10,10,0.12)',
                          backgroundColor: isSelected ? '#0a0a0a' : isOutOfStock ? '#fafafa' : 'transparent',
                          color: isSelected ? 'white' : isOutOfStock ? '#ccc' : '#0a0a0a',
                          fontFamily: 'var(--font-dm-sans)',
                          fontSize: '14px',
                          fontWeight: isSelected ? 600 : 400,
                          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                          transition: 'all 200ms ease',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Strikethrough for out-of-stock */}
                        {isOutOfStock && (
                          <div style={{
                            position: 'absolute', top: '50%', left: '0', right: '0',
                            height: '1px', backgroundColor: '#ddd',
                            transform: 'rotate(-20deg)', transformOrigin: 'center',
                          }} />
                        )}
                        UK {v.size}
                        {/* Low stock indicator dot */}
                        {isLowStock && !isSelected && (
                          <div style={{
                            position: 'absolute', top: '6px', right: '6px',
                            width: '5px', height: '5px', borderRadius: '50%',
                            backgroundColor: '#d97706',
                          }} />
                        )}
                      </button>
                    );
                  })}
                </div>
                {/* Stock Status Indicator */}
                {stockStatus && (
                  <div
                    className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg"
                    style={{ backgroundColor: stockStatus.bg, border: `1px solid ${stockStatus.color}20` }}
                  >
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: stockStatus.color }} />
                    <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 600, color: stockStatus.color }}>
                      {stockStatus.label}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 mb-10">
              <button
                onClick={() => window.open(`${WHATSAPP_URL}/${data?.globalSettings?.whatsappNumber || '917405040700'}?text=${whatsappMsg}`, '_blank')}
                disabled={selectedVariant?.stock === 0}
                className="w-full flex items-center justify-center gap-3 py-5 text-white font-bold text-[15px] transition-all"
                style={{
                  backgroundColor: selectedVariant?.stock === 0 ? '#ccc' : '#0fb04a',
                  cursor: selectedVariant?.stock === 0 ? 'not-allowed' : 'pointer',
                  transform: selectedVariant?.stock === 0 ? 'none' : undefined,
                }}
                onMouseEnter={e => { if (selectedVariant?.stock !== 0) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <MessageCircle className="w-5 h-5" /> {selectedVariant?.stock === 0 ? 'OUT OF STOCK' : 'ORDER ON WHATSAPP'}
              </button>

              <button
                onClick={() => setWishlist(!wishlist)}
                className="w-full flex items-center justify-center gap-3 py-5 border border-black font-medium text-[13px]"
              >
                <Heart className="w-4 h-4" style={{ color: wishlist ? '#ff4d4d' : '#0a0a0a', fill: wishlist ? '#ff4d4d' : 'none' }} />
                {wishlist ? 'ADDED TO WISHLIST' : 'ADD TO WISHLIST'}
              </button>
            </div>

            <div className="border-b border-[rgba(10,10,10,0.12)]">
              <AccordionItem title="SPECIFICATIONS">
                <div className="grid grid-cols-2 gap-y-4 pt-2">
                  {product.material && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-[#888]">Material</p>
                      <p className="text-[14px] text-[#0a0a0a]">{product.material}</p>
                    </div>
                  )}
                  {product.soleMaterial && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-[#888]">Sole Unit</p>
                      <p className="text-[14px] text-[#0a0a0a]">{product.soleMaterial}</p>
                    </div>
                  )}
                  {product.brand && (
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-[#888]">Brand</p>
                      <p className="text-[14px] text-[#0a0a0a]">{product.brand}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#888]">Shipping</p>
                    <p className="text-[14px] text-[#0a0a0a]">Ships in 24-48 hours</p>
                  </div>
                </div>
              </AccordionItem>
              <AccordionItem title="MATERIAL & CARE">
                <p className="leading-relaxed">
                  {product.material ? `Featuring a premium ${product.material} upper. ` : ''}
                  Wipe with a clean damp cloth. Avoid submerging in water.
                </p>
              </AccordionItem>
              <AccordionItem title="DELIVERY & RETURNS">
                <p className="leading-relaxed">
                  Standard delivery available across India. We offer returns on manufacturing defects. 
                </p>
              </AccordionItem>
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="py-16 border-t border-[rgba(10,10,10,0.08)]">
            <h2 className="font-serif italic text-2xl mb-8">Related Products</h2>
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 cursor-zoom-out"
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
