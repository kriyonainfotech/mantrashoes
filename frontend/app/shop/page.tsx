'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { MessageCircle, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import ShopFilter from '@/components/ShopFilter';
import { WHATSAPP_URL } from '@/lib/config';


function getImg(img: any) {
  return typeof img === 'string' ? img : img?.url || '';
}

export default function Shop() {
  const { data, fetchData } = useAppStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 100000] as [number, number],
    sort: 'newest',
    sizes: [] as number[],
    search: '',
  });

  // Initialize price range once data loads
  useEffect(() => {
    if (data?.products?.length > 0) {
      const max = Math.ceil(Math.max(...data.products.map((p: any) => p.price), 0) / 1000) * 1000 || 10000;
      setFilters(prev => ({ ...prev, priceRange: [0, max] }));
    }
  }, [data?.products]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];

    let result = [...data.products];

    // 0. Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    // 1. Filter by Category
    if (filters.category) {
      result = result.filter(p =>
        p.category?._id === filters.category ||
        p.category?.slug === filters.category ||
        p.category === filters.category
      );
    }

    // 2. Filter by Price
    result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // 3. Filter by Sizes
    if (filters.sizes.length > 0) {
      result = result.filter(p =>
        p.variants?.some((v: any) => filters.sizes.includes(v.size))
      );
    }

    // 4. Sort
    if (filters.sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-high') result.sort((a, b) => b.price - a.price);
    if (filters.sort === 'newest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  }, [data?.products, filters]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F5EF' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '1.5px solid #1A1A1A', borderTopColor: 'transparent' }} />
          <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
            Loading
          </p>
        </div>
      </div>
    );
  }

  const header = data.sections.shopHeader || {
    title: "ALL PRODUCTS",
    subtitle: "Explore our complete collection of premium footwear designed for comfort and style."
  };

  return (
    <main style={{ backgroundColor: '#F8F5EF', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar theme={data.theme} />

      {/* ── Shop Header ── */}
      <div className="w-full pt-40 pb-0 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center border-b border-black/5 pb-6">
          <p className="mb-3" style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
            Mantra Collection
          </p>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.2rem, 6vw, 3rem)', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.1 }}>
            {header.title}
          </h1>
          <p className="mt-3 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-lora)', fontSize: '17px', fontStyle: 'italic', fontWeight: 400, color: '#666', lineHeight: 1.7 }}>
            {header.subtitle}
          </p>
        </div>
      </div>

      {/* ── Mobile Filter Toggle ── */}
      <div className="lg:hidden sticky top-[80px] z-30 bg-[#F8F5EF]/80 backdrop-blur-md border-b border-black/5 px-6 py-4">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-nunito)' }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter & Sort ({filteredProducts.length})
        </button>
      </div>

      {/* ── Main Layout (Sidebar + Grid) ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-12 flex gap-12">

        {/* SIDEBAR (Desktop) */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <ShopFilter
            categories={data.categories || []}
            allProducts={data.products || []}
            activeFilters={filters}
            onChange={setFilters}
            isOpen={false}
            onClose={() => { }}
          />
        </div>

        {/* SIDEBAR (Mobile Overlay) */}
        <div className="lg:hidden">
          <ShopFilter
            categories={data.categories || []}
            allProducts={data.products || []}
            activeFilters={filters}
            onChange={setFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>

        {/* PRODUCT GRID */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '12px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center">
              <p style={{ fontFamily: 'var(--font-lora)', fontSize: '18px', fontStyle: 'italic', color: '#999' }}>
                No products match your filters.
              </p>
              <button
                onClick={() => {
                  const max = Math.ceil(Math.max(...(data?.products || []).map((p: any) => p.price), 0) / 1000) * 1000 || 10000;
                  setFilters({ category: '', priceRange: [0, max], sort: 'newest', sizes: [], search: '' });
                }}
                className="mt-6 text-[13px] font-bold underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product: any, index: number) => (
                  <motion.div
                    key={product._id || product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: index < 12 ? Math.min(index * 0.05, 0.4) : 0 }}
                    className="group"
                  >
                    <Link href={`/product/${product._id || product.id}`} className="block">
                      <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', backgroundColor: '#ECEAE5' }}>
                        {getImg(product.images?.[0]) ? (
                          <Image
                            src={getImg(product.images[0])}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center"
                            style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 500, color: '#bbb', letterSpacing: '0.1em' }}>
                            No Image
                          </div>
                        )}

                        {/* Badges */}
                        {product.isFeatured && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-wider">
                            Featured
                          </div>
                        )}
                        {product.mrp > product.price && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#E63946] text-white text-[10px] font-bold">
                            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                          </div>
                        )}

                        {/* WhatsApp overlay */}
                        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(`${WHATSAPP_URL}/${product.whatsapp}?text=Hi, I'm interested in the ${product.name}`, '_blank');

                            }}
                            className="w-full flex items-center justify-center gap-2 py-3 text-white"
                            style={{ background: '#0fb04a', fontFamily: 'var(--font-nunito)', fontSize: '12px', fontWeight: 600 }}
                          >
                            <MessageCircle className="w-4 h-4" /> Order on WhatsApp
                          </button>
                        </div>
                      </div>
                      <div className="pt-3 pb-1">
                        <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '2px' }}>
                          {product.category?.name || 'FOOTWEAR'}
                        </p>
                        <h3 className="line-clamp-2" style={{ fontFamily: 'var(--font-nunito)', fontSize: '14px', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.3, marginBottom: '5px' }}>
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
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <Footer data={data.sections.footer} theme={data.theme} />
    </main>
  );
}
