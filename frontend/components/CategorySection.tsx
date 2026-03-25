'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { WHATSAPP_URL } from '@/lib/config';


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

  // Show up to 8 products per category
  const displayProducts = products.slice(0, 8);

  return (
    <section
      className="py-10"
      style={{ backgroundColor: '#F8F5EF', borderBottom: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header — compact */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#999', marginBottom: '4px' }}>
              Collection
            </p>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.1 }}>
              {category.name}
            </h2>
          </div>
          <Link
            href={`/category/${category.slug}`}
            className="nav-link hidden sm:inline-flex items-center gap-1"
            style={{ fontFamily: 'var(--font-nunito)', fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}
          >
            View All →
          </Link>
        </div>

        {/* Product grid — 2 cols mobile, 3 cols md, 4 cols lg, no wasted space */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {displayProducts.map((product, i) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="group"
            >
              <Link href={`/product/${product._id || product.id}`} className="block">

                {/* Image container — taller ratio, bigger visual presence */}
                <div
                  className="relative overflow-hidden flex items-center justify-center p-4" // Added flex, centering, and padding
                  style={{ aspectRatio: '3/4', backgroundColor: '#ECEAE5' }}
                >
                  {getImg(product.images?.[0]) ? (
                    <Image
                      src={getImg(product.images[0])}
                      alt={product.name}
                      fill
                      /* 2. Change object-cover to object-contain */
                      /* 3. Add mix-blend-multiply to remove the "off-white" box around the shoe */
                      className="object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center"
                      style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 500, color: '#bbb', letterSpacing: '0.1em' }}>
                      No Image
                    </div>
                  )}
                  {/* Featured badge */}
                  {product.isFeatured && (
                    <div className="absolute top-2 left-2 px-2 py-0.5"
                      style={{ backgroundColor: '#1A1A1A', fontFamily: 'var(--font-nunito)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff' }}>
                      Featured
                    </div>
                  )}

                  {/* Discount badge */}
                  {product.mrp > product.price && (
                    <div className="absolute top-2 right-2 px-2 py-0.5"
                      style={{ backgroundColor: '#E63946', fontFamily: 'var(--font-nunito)', fontSize: '10px', fontWeight: 700, color: '#fff' }}>
                      {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                    </div>
                  )}

                  {/* WhatsApp overlay — slides up on hover */}
                  <div
                    className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0"
                    style={{ transition: 'transform 220ms ease' }}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const msg = encodeURIComponent(`Hi, I want to order "${product.name}" — ₹${product.price}`);
                        window.open(`${WHATSAPP_URL}/${product.whatsapp}?text=${msg}`, '_blank');

                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 text-white"
                      style={{ background: '#0fb04a', fontFamily: 'var(--font-nunito)', fontSize: '12px', fontWeight: 600 }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Order on WhatsApp
                    </button>
                  </div>
                </div>

                {/* Card info — compact and tight */}
                <div className="pt-2.5 pb-1">
                  {product.category?.name && (
                    <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '2px' }}>
                      {product.category.name}
                    </p>
                  )}
                  <h3 style={{ fontFamily: 'var(--font-nunito)', fontSize: '14px', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.3, marginBottom: '5px' }}
                    className="line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 700, color: '#1A1A1A' }}>
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.mrp > product.price && (
                      <span style={{ fontFamily: 'var(--font-nunito)', fontSize: '12px', fontWeight: 400, color: '#aaa', textDecoration: 'line-through' }}>
                        ₹{product.mrp.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile — explore all */}
        <div className="mt-5 sm:hidden">
          <Link
            href={`/category/${category.slug}`}
            style={{ fontFamily: 'var(--font-nunito)', fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}
          >
            View All →
          </Link>
        </div>
      </div>
    </section>
  );
}
