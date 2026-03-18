'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function Shop() {
  const { data, fetchData } = useAppStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar theme={data.theme} />
      
      {/* Dark Header for inner pages to contrast with transparent navbar */}
      <div className="bg-black pt-40 pb-20 px-6 text-white text-center">
        <h1 className="text-5xl font-bold tracking-tighter" style={{ fontFamily: 'var(--font-montserrat)' }}>
          {data.sections.shopHeader?.title || "ALL PRODUCTS"}
        </h1>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          {data.sections.shopHeader?.subtitle || "Explore our complete collection of premium footwear designed for performance and style."}
        </p>
      </div>

      <div className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.products.map((product: any, index: number) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                        window.open(`https://wa.me/${product.whatsapp}?text=Hi, I'm interested in the ${product.name}`, '_blank');
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

      <Footer data={data.sections.footer} theme={data.theme} />
    </main>
  );
}
