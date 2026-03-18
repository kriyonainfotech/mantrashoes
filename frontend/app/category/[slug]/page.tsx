'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CategoryPage() {
  const { slug } = useParams() as { slug: string };
  const { data, fetchData } = useAppStore();
  const [category, setCategory] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_URL}/categories/get-category-by-slug/${slug}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCategory(res.category);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (!data || !category) {
    if (notFound) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link href="/" className="text-sm uppercase tracking-widest underline">Go Home</Link>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const products = (data.products || []).filter(
    (p: any) =>
      p.isActive !== false &&
      (p.category?._id === category._id ||
        p.category?.slug === slug ||
        p.category === category._id)
  );

  return (
    <main className="min-h-screen bg-white">
      <Navbar theme={data.theme} />

      {/* Hero */}
      <div className="bg-black pt-32 pb-16 px-6 text-white text-center">
        {category.parent?.name && (
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
            {category.parent.name}
          </p>
        )}
        <h1
          className="text-5xl md:text-6xl font-bold tracking-tighter uppercase"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-4 text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            {category.description}
          </p>
        )}
        <p className="mt-3 text-gray-500 text-xs uppercase tracking-widest">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      {/* Products Grid */}
      <div className="py-20 px-6 max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg">No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: any, index: number) => (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
              >
                <Link href={`/product/${product._id || product.id}`} className="group block">
                  <div className="relative aspect-square bg-gray-100 mb-4 overflow-hidden">
                    <Image
                      src={
                        typeof product.images?.[0] === 'string'
                          ? product.images[0]
                          : product.images?.[0]?.url || ''
                      }
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(
                            `https://wa.me/${product.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}`)}`,
                            '_blank'
                          );
                        }}
                        className="bg-[#25D366] text-white px-5 py-2.5 font-semibold uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-[#1da851] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base font-medium">₹{product.price}</span>
                    {product.mrp > product.price && (
                      <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
                    )}
                    {product.discount > 0 && (
                      <span className="text-xs text-green-600 font-semibold">{product.discount}% off</span>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer data={data.sections.footer} theme={data.theme} />
    </main>
  );
}
