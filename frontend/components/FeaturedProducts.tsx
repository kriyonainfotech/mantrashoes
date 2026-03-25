'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { WHATSAPP_URL } from '@/lib/config';

function getImg(img: any) {
  return typeof img === 'string' ? img : img?.url || '';
}

export default function FeaturedProducts({ data, products, theme }: { data: any, products: any[], theme: any }) {
  if (data?.enabled === false) return null;

  // Use isFeatured from the database
  const featured = products.filter(p => p.isFeatured && p.isActive !== false).slice(0, 8);

  if (featured.length === 0) return null;

  return (
    <section 
      className="py-16" 
      style={{ backgroundColor: '#F8F5EF', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#999', marginBottom: '4px' }}>
              Handpicked
            </p>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.1 }}>
              {data?.title || 'Featured Collection'}
            </h2>
          </div>
          <Link 
            href="/shop" 
            className="hidden sm:inline-flex items-center gap-1"
            style={{ fontFamily: 'var(--font-nunito)', fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}
          >
            Explore All →
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {featured.map((product, i) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="group"
            >
              <Link href={`/product/${product._id || product.id}`} className="block">
                
                {/* Image Container */}
                <div 
                  className="relative overflow-hidden flex items-center justify-center p-4"
                  style={{ aspectRatio: '3/4', backgroundColor: '#ECEAE5' }}
                >
                  {getImg(product.images?.[0]) ? (
                    <Image
                      src={getImg(product.images[0])}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-nunito text-[11px] text-gray-400">
                      No Image
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-2 left-2 px-2 py-0.5" 
                    style={{ backgroundColor: '#1A1A1A', fontFamily: 'var(--font-nunito)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff' }}>
                    Featured
                  </div>
                  
                  {product.mrp > product.price && (
                    <div className="absolute top-2 right-2 px-2 py-0.5"
                      style={{ backgroundColor: '#E63946', fontFamily: 'var(--font-nunito)', fontSize: '10px', fontWeight: 700, color: '#fff' }}>
                      {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                    </div>
                  )}

                  {/* WhatsApp overlay */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
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

                {/* Info */}
                <div className="pt-2.5 pb-1">
                  {product.category?.name && (
                    <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '2px' }}>
                      {product.category.name}
                    </p>
                  )}
                  <h3 style={{ fontFamily: 'var(--font-nunito)', fontSize: '14px', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.3, marginBottom: '5px' }} className="line-clamp-2">
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
      </div>
    </section>
  );
}
