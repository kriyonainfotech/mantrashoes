'use client';

import { useState, useMemo } from 'react';
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

interface FilterProps {
  categories: any[];
  allProducts: any[];
  activeFilters: {
    category: string;
    priceRange: [number, number];
    sort: string;
    sizes: number[];
    colors: string[];
    search: string;
  };
  onChange: (filters: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShopFilter({ 
  categories, 
  allProducts, 
  activeFilters, 
  onChange,
  isOpen,
  onClose
}: FilterProps) {

  const minPrice = 0;
  const maxPrice = useMemo(() => {
    if (allProducts.length === 0) return 10000;
    return Math.ceil(Math.max(...allProducts.map(p => p.price), 0) / 1000) * 1000 || 10000;
  }, [allProducts]);

  const allSizes = useMemo(() => {
    const sizes = new Set<number>();
    allProducts.forEach(p => {
      p.variants?.forEach((v: any) => {
        if (v.size) sizes.add(v.size);
      });
    });
    return Array.from(sizes).sort((a, b) => a - b);
  }, [allProducts]);

  const allColors = useMemo(() => {
    const colorMap = new Map<string, string>(); // name -> hex
    allProducts.forEach(p => {
      p.colorMap?.forEach((c: any) => {
        if (c.name && c.hex) colorMap.set(c.name, c.hex);
      });
      // Fallback: also extract from variants if no colorMap
      if (!p.colorMap?.length) {
        p.variants?.forEach((v: any) => {
          if (v.color && !colorMap.has(v.color)) {
            colorMap.set(v.color, v.color.toLowerCase());
          }
        });
      }
    });
    return Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }));
  }, [allProducts]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, isMax: boolean) => {
    const val = parseInt(e.target.value) || 0;
    const newRange: [number, number] = isMax 
      ? [activeFilters.priceRange[0], val]
      : [val, activeFilters.priceRange[1]];
    onChange({ ...activeFilters, priceRange: newRange });
  };

  const toggleSize = (size: number) => {
    const newSizes = activeFilters.sizes.includes(size)
      ? activeFilters.sizes.filter(s => s !== size)
      : [...activeFilters.sizes, size];
    onChange({ ...activeFilters, sizes: newSizes });
  };

  const toggleColor = (color: string) => {
    const newColors = activeFilters.colors.includes(color)
      ? activeFilters.colors.filter(c => c !== color)
      : [...activeFilters.colors, color];
    onChange({ ...activeFilters, colors: newColors });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 w-[280px] sm:w-[320px] lg:w-full bg-[#F8F5EF] z-50 lg:z-0 transform transition-transform lg:transform-none ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} border-r border-black/5 lg:border-none p-6 lg:p-0 overflow-y-auto`}
      >
        <div className="flex items-center justify-between mb-8 lg:hidden">
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontWeight: 600 }}>Filters</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        {/* 0. Search Section */}
        <div className="mb-10">
          <h3 className="filter-title">Search</h3>
          <div className="mt-4">
            <input 
              type="text"
              placeholder="Finding something..."
              value={activeFilters.search || ''}
              onChange={(e) => onChange({ ...activeFilters, search: e.target.value })}
              className="w-full bg-white border border-black/10 px-4 py-3 placeholder:text-black/30 focus:outline-none focus:border-black/30 transition-colors"
              style={{ fontFamily: 'var(--font-nunito)', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* 1. Sort Section */}
        <div className="mb-10">
          <h3 className="filter-title">Sort By</h3>
          <div className="flex flex-col gap-2 mt-4">
            {['newest', 'price-low', 'price-high'].map((s) => (
              <label key={s} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="sort" 
                  checked={activeFilters.sort === s}
                  onChange={() => onChange({ ...activeFilters, sort: s })}
                  className="hidden"
                />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${activeFilters.sort === s ? 'border-[#1A1A1A]' : 'border-black/20 group-hover:border-black/40'}`}>
                  {activeFilters.sort === s && <div className="w-2 h-2 rounded-full bg-[#1A1A1A]" />}
                </div>
                <span className="text-[14px] capitalize" style={{ fontFamily: 'var(--font-nunito)', color: activeFilters.sort === s ? '#1A1A1A' : '#666' }}>
                  {s.replace('-', ': ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 2. Category Section (Only if products aren't already filtered by category) */}
        {categories.length > 0 && (
          <div className="mb-10">
            <h3 className="filter-title">Categories</h3>
            <div className="flex flex-col gap-2 mt-4">
              <button 
                onClick={() => onChange({ ...activeFilters, category: '' })}
                className={`text-left text-[14px] py-1 transition-colors ${activeFilters.category === '' ? 'text-[#1A1A1A] font-bold' : 'text-[#666] hover:text-[#1A1A1A]'}`}
                style={{ fontFamily: 'var(--font-nunito)' }}
              >
                All Collections
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat._id}
                  onClick={() => onChange({ ...activeFilters, category: cat.slug || cat._id })}
                  className={`text-left text-[14px] py-1 transition-colors ${activeFilters.category === (cat.slug || cat._id) ? 'text-[#1A1A1A] font-bold' : 'text-[#666] hover:text-[#1A1A1A]'}`}
                  style={{ fontFamily: 'var(--font-nunito)' }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Price Section */}
        <div className="mb-10">
          <h3 className="filter-title">Price Range</h3>
          <div className="mt-5 px-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-bold">₹{activeFilters.priceRange[0]}</span>
              <span className="text-[12px] font-bold">₹{activeFilters.priceRange[1]}</span>
            </div>
            <div className="relative h-1 bg-black/10 rounded-full">
              <input 
                type="range"
                min={minPrice}
                max={maxPrice}
                step={100}
                value={activeFilters.priceRange[1]}
                onChange={(e) => handlePriceChange(e, true)}
                className="absolute inset-0 w-full h-1 appearance-none bg-transparent cursor-pointer pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
              />
            </div>
          </div>
        </div>

        {/* 4. Sizes Section */}
        {allSizes.length > 0 && (
          <div className="mb-10">
            <h3 className="filter-title">Sizes</h3>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {allSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`h-10 flex items-center justify-center border text-[13px] transition-all ${activeFilters.sizes.includes(size) ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-black/10 text-black hover:border-black/40'}`}
                  style={{ fontFamily: 'var(--font-nunito)' }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. Colors Section */}
        {allColors.length > 0 && (
          <div className="mb-10">
            <h3 className="filter-title">Colors</h3>
            <div className="flex flex-wrap gap-3 mt-4">
              {allColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  className="group relative"
                  title={color.name}
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 transition-all ${activeFilters.colors.includes(color.name) ? 'border-[#1A1A1A] scale-110' : 'border-black/10 hover:border-black/30'}`}
                    style={{ backgroundColor: color.hex }}
                  />
                  {activeFilters.colors.includes(color.name) && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-gray-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: 'var(--font-nunito)' }}>
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        <button 
          onClick={() => onChange({ category: '', priceRange: [0, maxPrice], sort: 'newest', sizes: [], colors: [], search: '' })}
          className="w-full py-4 text-[12px] font-bold tracking-widest uppercase border border-black/10 hover:bg-black hover:fill-ivory hover:text-white transition-all"
          style={{ fontFamily: 'var(--font-nunito)' }}
        >
          Clear All
        </button>

        <style jsx>{`
          .filter-title {
            font-family: var(--font-nunito);
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: #1A1A1A;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(0,0,0,0.06);
          }
        `}</style>
      </aside>
    </>
  );
}
