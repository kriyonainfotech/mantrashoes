'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  id?: string;
  name: string;
  price: number;
  mrp: number;
  images: any[];
  category: any;
  whatsapp: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function CategorySection({ category, products }: { category: Category, products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-white border-b border-gray-50 last:border-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2 block">Collection</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-montserrat)' }}>
              {category.name}
            </h2>
          </div>
          <Link href={`/category/${category.slug}`}>
            <span className="text-sm font-semibold uppercase tracking-widest hover:underline cursor-pointer text-gray-900">
              Explore All
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div key={product._id || product.id} className="group flex flex-col">
              <Link href={`/product/${product._id || product.id}`} className="flex-1">
                <div className="relative aspect-[4/5] bg-gray-100 mb-4 overflow-hidden rounded-sm">
                  {((typeof product.images?.[0] === 'string' && product.images[0]) || (product.images?.[0]?.url)) ? (
                    <Image
                      src={typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url || ''}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400 text-[10px] uppercase font-bold">No Image</div>
                  )}
                  
                  {/* WhatsApp Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-6">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const message = `Hi, I want to order "${product.name}" priced at $${product.price}.`;
                        window.open(`https://wa.me/${product.whatsapp || '14155552671'}?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="w-full bg-[#25D366] text-white py-4 font-bold uppercase text-[10px] tracking-[0.2em] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center gap-2 hover:bg-[#1da851] shadow-xl"
                    >
                      <MessageCircle className="w-4 h-4" /> Order on WhatsApp
                    </button>
                  </div>

                  {/* Badges */}
                  {(product as any).isFeatured && (
                    <div className="absolute top-4 left-4 bg-black text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-gray-900 font-mono">${product.price}</span>
                    {product.mrp > product.price && (
                      <span className="text-[10px] text-gray-400 line-through font-mono">${product.mrp}</span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
