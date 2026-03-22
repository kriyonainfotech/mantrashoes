'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ShopFilter from '@/components/ShopFilter';

import { API_URL, WHATSAPP_URL } from '@/lib/config';


function getImg(img: any) {
  return typeof img === 'string' ? img : img?.url || '';
}

export default function CategoryPage() {
  const { slug } = useParams() as { slug: string };
  const { data, fetchData } = useAppStore();
  const [category, setCategory] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 100000] as [number, number],
    sort: 'newest',
    sizes: [] as number[],
    search: '',
  });

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_URL}/categories/get-category-by-slug/${slug}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setCategory(res.category);
          setFilters(prev => ({ ...prev, category: res.category._id }));
        }
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  // Initial products before filtering
  const baseProducts = useMemo(() => {
    if (!data?.products || !category) return [];
    return data.products.filter(
      (p: any) =>
        p.isActive !== false &&
        (p.category?._id === category._id ||
          p.category?.slug === slug ||
          p.category === category._id)
    );
  }, [data?.products, category, slug]);

  // Initialize price range once data loads
  useEffect(() => {
    if (baseProducts.length > 0) {
      const max = Math.ceil(Math.max(...baseProducts.map((p: any) => p.price), 0) / 1000) * 1000 || 10000;
      setFilters(prev => ({ ...prev, priceRange: [0, max] }));
    }
  }, [baseProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...baseProducts];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    // Filter by Price
    result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Filter by Sizes
    if (filters.sizes.length > 0) {
      result = result.filter(p =>
        p.variants?.some((v: any) => filters.sizes.includes(v.size))
      );
    }

    // Sort
    if (filters.sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-high') result.sort((a, b) => b.price - a.price);
    if (filters.sort === 'newest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  }, [baseProducts, filters]);

  // ── Loading / Errors ──────────────────────────────────────────────────────────
  if (!data || !category) {
    if (notFound) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F8F5EF' }}>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '16px' }}>
            Category not found
          </h1>
          <Link href="/" style={{ fontFamily: 'var(--font-nunito)', fontSize: '13px', fontWeight: 600, color: '#1A1A1A', textDecoration: 'underline' }}>
            Go Home
          </Link>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#F8F5EF' }}>
        <div className="w-10 h-10 rounded-full animate-spin" style={{ border: '1.5px solid #1A1A1A', borderTopColor: 'transparent' }} />
        <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
          Loading
        </p>
      </div>
    );
  }

  return (
    <main style={{ backgroundColor: '#F8F5EF', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar theme={data.theme} />

      {/* ── Category Header ── */}
      <div className="w-full pt-40 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center border-b border-black/5 pb-10">
          {category.parent?.name && (
            <p className="mb-3" style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999' }}>
              {category.parent.name}
            </p>
          )}
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.1 }}>
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-5 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-lora)', fontSize: '17px', fontStyle: 'italic', fontWeight: 400, color: '#666', lineHeight: 1.7 }}>
              {category.description}
            </p>
          )}
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

      {/* ── Main Layout ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-12 flex gap-12">

        {/* SIDEBAR (Desktop) */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <ShopFilter
            categories={[]} // Empty because we are locked to this category
            allProducts={baseProducts}
            activeFilters={filters}
            onChange={setFilters}
            isOpen={false}
            onClose={() => { }}
          />
        </div>

        {/* SIDEBAR (Mobile Overlay) */}
        <div className="lg:hidden">
          <ShopFilter
            categories={[]}
            allProducts={baseProducts}
            activeFilters={filters}
            onChange={setFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>

        {/* Grid Contents */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '12px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Showing {filteredProducts.length} items
            </p>
          </div>

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

                      {/* WhatsApp overlay */}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(
                              `${WHATSAPP_URL}/${product.whatsapp}?text=${encodeURIComponent(`Hi, I want to order "${product.name}" — ₹${product.price}`)}`,

                              '_blank'
                            );
                          }}
                          className="w-full flex items-center justify-center gap-2 py-3 text-white"
                          style={{ background: '#0fb04a', fontFamily: 'var(--font-nunito)', fontSize: '12px', fontWeight: 600 }}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Order on WhatsApp
                        </button>
                      </div>
                    </div>
                    <div className="pt-3 pb-1">
                      <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '2px' }}>
                        {product.category?.name}
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

          {filteredProducts.length === 0 && (
            <div className="py-24 text-center">
              <p style={{ fontFamily: 'var(--font-lora)', fontSize: '18px', fontStyle: 'italic', color: '#999' }}>
                No products match these filters in this category.
              </p>
              <button
                onClick={() => {
                  const max = Math.ceil(Math.max(...(baseProducts || []).map((p: any) => p.price), 0) / 1000) * 1000 || 10000;
                  setFilters({ category: category._id, priceRange: [0, max], sort: 'newest', sizes: [], search: '' });
                }}
                className="mt-6 text-[13px] font-bold underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer data={data.sections.footer} theme={data.theme} />
    </main>
  );
}
