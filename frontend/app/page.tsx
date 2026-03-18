'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import BrandStory from '@/components/BrandStory';
import Reviews from '@/components/Reviews';
import InstagramGallery from '@/components/InstagramGallery';
import Footer from '@/components/Footer';

export default function Home() {
  const { data, fetchData } = useAppStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">Loading Mantra...</p>
        </div>
      </div>
    );
  }

  const activeCategories = data.categories?.filter((c: any) => c.isActive) || [];

  return (
    <main className="min-h-screen">
      <Navbar theme={data.theme} />
      <Hero data={data.sections.hero} products={data.products} theme={data.theme} />
      
      {/* Category Wise Listing */}
      <div className="bg-white">
        {activeCategories.map((category: any) => {
          const categoryProducts = data.products?.filter((p: any) => 
            p.category?._id === category._id || p.category === category._id
          );
          return (
            <CategorySection 
              key={category._id} 
              category={category} 
              products={categoryProducts || []} 
            />
          );
        })}
      </div>

      <BrandStory data={data.sections.brandStory} theme={data.theme} />
      <Reviews data={data.sections.reviews} reviews={data.reviews} theme={data.theme} />
      <InstagramGallery data={data.sections.instagram} />
      <Footer data={data.sections.footer} theme={data.theme} />
    </main>
  );
}
