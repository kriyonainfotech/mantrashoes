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
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', backgroundColor: '#e8e6e1' }}>
          {getImg(product.images?.[0]) ? (
            <Image src={getImg(product.images[0])} alt={product.name} fill className="object-cover" referrerPolicy="no-referrer" />
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

        {/* 52/48 split */}
        <div className="grid grid-cols-1 lg:grid-cols-[52fr_48fr] gap-0 py-10">

          {/* ── LEFT: Image panel ── */}
          <div className="lg:pr-10" style={{ borderRight: '0.5px solid rgba(10,10,10,0.08)' }}>

            {/* Main image */}
            <div
              className="relative overflow-hidden cursor-zoom-in"
              style={{ backgroundColor: '#e8e6e1', aspectRatio: '4/5' }}
              onClick={() => setZoomed(true)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="absolute inset-0"
                >
                  {getImg(images[activeImage]) ? (
                    <Image
                      src={getImg(images[activeImage])}
                      alt={product.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ fontFamily: 'var(--font-cinzel)', fontSize: '9px', letterSpacing: '0.2em', color: '#aaa' }}>NO IMAGE</div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Discount badge */}
              {hasDiscount && (
                <div className="absolute top-4 left-4 px-2.5 py-1 text-white" style={{ backgroundColor: '#0a0a0a', fontFamily: 'var(--font-cinzel)', fontSize: '8px', letterSpacing: '0.2em' }}>
                  -{discountPct}%
                </div>
              )}

              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5" style={{ backgroundColor: 'rgba(245,243,238,0.85)', border: '0.5px solid rgba(10,10,10,0.12)' }}>
                <ZoomIn className="w-3 h-3" style={{ color: '#888' }} />
                <span style={{ fontFamily: 'var(--font-cinzel)', fontSize: '7px', letterSpacing: '0.2em', color: '#888' }}>ZOOM</span>
              </div>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className="relative flex-1 overflow-hidden"
                    style={{
                      aspectRatio: '1',
                      backgroundColor: '#e8e6e1',
                      border: activeImage === idx ? '0.5px solid #0a0a0a' : '0.5px solid transparent',
                      opacity: activeImage === idx ? 1 : 0.5,
                      transition: 'opacity 200ms ease, border-color 200ms ease',
                      maxWidth: '80px',
                    }}
                  >
                    <Image src={getImg(img)} alt="" fill className="object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Info panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:pl-10 pt-8 lg:pt-0 flex flex-col"
          >
            {/* Category label */}
            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 400, letterSpacing: '0.14em', color: '#888', marginBottom: '10px', textTransform: 'uppercase' }}>
              {categoryName}{product.brand ? ` · ${product.brand}` : ''}
            </p>

            {/* Product name */}
            <h1 style={{ fontFamily: 'var(--font-cinzel)', fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', letterSpacing: '0.1em', color: '#0a0a0a', lineHeight: 1.2, marginBottom: '8px' }}>
              {product.name.toUpperCase()}
            </h1>

            {/* Cormorant italic subtitle */}
            {product.description && (
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '20px', fontStyle: 'italic', fontWeight: 300, color: '#888', marginBottom: '16px', lineHeight: 1.5 }}>
                {product.description.split('.')[0]}.
              </p>
            )}

            {/* Star rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5" style={{ fill: '#0a0a0a', color: '#0a0a0a' }} />
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 300, color: '#888' }}>5.0 · Premium Quality</span>
            </div>

            <div style={{ height: '0.5px', backgroundColor: 'rgba(10,10,10,0.1)', marginBottom: '20px' }} />

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-7">
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '32px', fontWeight: 500, color: '#0a0a0a' }}>
                ₹{product.price?.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '18px', fontWeight: 300, color: '#aaa', textDecoration: 'line-through' }}>
                    ₹{product.mrp?.toLocaleString()}
                  </span>
                  <span className="px-2.5 py-1" style={{ backgroundColor: '#0a0a0a', fontFamily: 'var(--font-dm-sans)', fontSize: '12px', fontWeight: 500, color: 'white' }}>
                    Save ₹{(product.mrp - product.price)?.toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Color swatches */}
            {colors.length > 0 && (
              <div className="mb-6">
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 400, color: '#888', marginBottom: '10px' }}>
                  Color — <span style={{ color: '#0a0a0a', fontWeight: 500 }}>{colors[selectedColor]}</span>
                </p>
                <div className="flex gap-2.5">
                  {colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedColor(i); setSelectedSize(null); }}
                      title={color}
                      style={{
                        width: '30px', height: '30px',
                        backgroundColor: color.toLowerCase(),
                        border: selectedColor === i ? '0.5px solid #0a0a0a' : '0.5px solid rgba(10,10,10,0.15)',
                        outline: selectedColor === i ? '2px solid #0a0a0a' : 'none',
                        outlineOffset: '2px',
                        transition: 'outline 200ms ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {sizesForColor.length > 0 && (
              <div className="mb-6">
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 400, color: '#888', marginBottom: '10px' }}>
                  Size{selectedSize !== null ? <span style={{ color: '#0a0a0a', fontWeight: 500 }}> — {sizesForColor[selectedSize]?.size}</span> : ''}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizesForColor.map((v: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(idx)}
                      disabled={v.stock === 0}
                      style={{
                        width: '48px', height: '48px',
                        border: '0.5px solid',
                        borderColor: selectedSize === idx ? '#0a0a0a' : 'rgba(10,10,10,0.2)',
                        backgroundColor: selectedSize === idx ? '#0a0a0a' : 'transparent',
                        color: selectedSize === idx ? 'white' : v.stock === 0 ? '#ccc' : '#0a0a0a',
                        fontFamily: 'var(--font-dm-sans)',
                        fontSize: '14px',
                        fontWeight: 400,
                        cursor: v.stock === 0 ? 'not-allowed' : 'pointer',
                        textDecoration: v.stock === 0 ? 'line-through' : 'none',
                        transition: 'all 200ms ease',
                      }}
                    >
                      {v.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Feature pills */}
            {featurePills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-7">
                {featurePills.map((pill) => (
                  <span
                    key={pill}
                    style={{
                      border: '0.5px solid rgba(10,10,10,0.18)',
                      padding: '6px 14px',
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: '12px',
                      fontWeight: 300,
                      color: '#555',
                    }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex gap-3 mb-3">
              <button
                onClick={() => window.open(`${WHATSAPP_URL}/${product.whatsapp}?text=${whatsappMsg}`, '_blank')}

                className="flex-1 flex items-center justify-center gap-2.5 py-4 text-white"
                style={{
                  background: '#0fb04a',
                  fontFamily: 'var(--font-nunito)',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  transition: 'transform 200ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <MessageCircle className="w-5 h-5" />
                Order on WhatsApp
              </button>

              <button
                onClick={() => setWishlist(!wishlist)}
                className="flex items-center justify-center px-5 py-4"
                style={{
                  border: '0.5px solid rgba(10,10,10,0.2)',
                  transition: 'color 200ms ease',
                }}
              >
                <Heart className="w-5 h-5" style={{ color: wishlist ? '#0a0a0a' : '#aaa', fill: wishlist ? '#0a0a0a' : 'none', transition: 'all 200ms ease' }} />
              </button>
            </div>

            <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 300, color: '#aaa', marginBottom: '28px' }}>
              Chat directly · No account needed · Instant reply
            </p>

            {/* Accordion */}
            <div style={{ borderBottom: '0.5px solid rgba(10,10,10,0.12)' }}>
              <AccordionItem title="DESCRIPTION">
                <p>{product.description || 'Premium quality footwear crafted for comfort and style.'}</p>
              </AccordionItem>
              <AccordionItem title="MATERIAL & CARE">
                <p>
                  {product.material ? `Upper: ${product.material}. ` : ''}
                  {product.soleMaterial ? `Sole: ${product.soleMaterial}. ` : ''}
                  Wipe clean with a dry cloth. Store in a cool, dry place away from direct sunlight.
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
