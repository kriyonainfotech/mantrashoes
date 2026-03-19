'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

function getImg(img: any) {
  return typeof img === 'string' ? img : img?.url || '';
}

interface Product {
  _id: string;
  id?: string;
  name: string;
  price: number;
  mrp: number;
  images: any[];
  category: any;
  whatsapp: string;
  isFeatured?: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function CategorySection({ category, products }: { category: Category; products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-20" style={{ backgroundColor: '#f5f3ee', borderBottom: '0.5px solid rgba(10,10,10,0.07)' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '8px', letterSpacing: '0.38em', color: '#888', marginBottom: '8px' }}>
              COLLECTION
            </p>
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 300, fontStyle: 'italic', color: '#0a0a0a', lineHeight: 1.1 }}>
              {category.name}
            </h2>
          </div>
          <Link
            href={`/category/${category.slug}`}
            className="nav-link hidden sm:inline-block"
            style={{ fontFamily: 'var(--font-cinzel)', fontSize: '15px', color: '#0a0a0a' }}
          >
            EXPLORE ALL →
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product, i) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group"
              style={{ transition: 'transform 220ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <Link href={`/product/${product._id || product.id}`} className="block">
                {/* Image — 4:3 ratio, flat light gray */}
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: '4/5', backgroundColor: '#e8e6e1' }}
                >
                  {getImg(product.images?.[0]) ? (
                    <Image
                    src={getImg(product.images[0])}
                    alt={product.name}
                    fill
                    className="object-cover scale-105"
                    style={{ transition: 'transform 250ms ease' }}
                  />
                    ) : (
                     <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        fontFamily: 'var(--font-cinzel)',
                        fontSize: '8px',
                        letterSpacing: '0.2em',
                        color: '#aaa'
                      }}
                    >
                      NO IMAGE
                    </div>
                  )}

                  {/* WhatsApp slides up from bottom */}
                  <div
                    className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0"
                    style={{ transition: 'transform 220ms ease' }}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const msg = encodeURIComponent(`Hi, I want to order "${product.name}" — ₹${product.price}`);
                        window.open(`https://wa.me/${product.whatsapp}?text=${msg}`, '_blank');
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 text-white"
                      style={{ backgroundColor: '#25D366', fontFamily: 'var(--font-cinzel)', fontSize: '8.5px', letterSpacing: '0.22em' }}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      ORDER ON WHATSAPP
                    </button>
                  </div>

                  {product.isFeatured && (
                    <div
                      className="absolute top-3 left-3 px-2 py-1 text-white"
                      style={{ backgroundColor: '#0a0a0a', fontFamily: 'var(--font-cinzel)', fontSize: '7px', letterSpacing: '0.2em' }}
                    >
                      FEATURED
                    </div>
                  )}
                </div>

                {/* Card info */}
                <div className="pt-3 pb-1">
                  <p style={{ fontFamily: 'var(--font-cinzel)', fontSize: '10px', letterSpacing: '0.1em', color: '#888', marginBottom: '3px' }}>
                    {product.category?.name || ''}
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '18px', fontWeight: 500, color: '#0a0a0a', lineHeight: 1.2, marginBottom: '6px' }}>
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '13px', fontWeight: 500, color: '#0a0a0a' }}>
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.mrp > product.price && (
                      <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 300, color: '#888', textDecoration: 'line-through' }}>
                        ₹{product.mrp.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile explore */}
        <div className="mt-8 sm:hidden">
          <Link
            href={`/category/${category.slug}`}
            style={{ fontFamily: 'var(--font-cinzel)', fontSize: '20px', color: '#0a0a0a' }}
          >
            EXPLORE ALL →
          </Link>
        </div>
      </div>
    </section>
  );
}
