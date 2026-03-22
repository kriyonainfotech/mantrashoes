'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { WHATSAPP_URL } from '@/lib/config';


export default function FeaturedProducts({ data, products, theme }: { data: any, products: any[], theme: any }) {
  if (!data?.enabled) return null;

  const featured = products.filter(p => p.showInTopProducts).slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-montserrat)' }}>
            {data.title}
          </h2>
          <Link href="/shop">
            <span className="text-sm font-semibold uppercase tracking-widest hover:underline cursor-pointer">
              View All
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product, index) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square bg-gray-100 mb-4 overflow-hidden">
                  <Image
                    src={typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url || ''}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`${WHATSAPP_URL}/${product.whatsapp}?text=Hi, I'm interested in the ${product.name}`, '_blank');

                      }}
                      className="bg-[#25D366] text-white px-6 py-3 font-semibold uppercase text-xs tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2 hover:bg-[#1da851]"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-500">{product.category?.name || product.category}</p>
                <p className="text-lg font-medium mt-1">${product.price}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
