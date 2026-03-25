'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MarqueeStrip from '@/components/MarqueeStrip';
import CategorySection from '@/components/CategorySection';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandStory from '@/components/BrandStory';
import Reviews from '@/components/Reviews';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import InstagramReels from '@/components/InstagramReels';
import InstagramGallery from '@/components/InstagramGallery';

export default function Home() {
  const { data, fetchData } = useAppStore();

  useEffect(() => { fetchData(); }, [fetchData]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F5EF' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full animate-spin"
            style={{ border: '1.5px solid #1A1A1A', borderTopColor: 'transparent' }}
          />
          <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: '#aaa' }}>
            LOADING
          </p>
        </div>
      </div>
    );
  }

  // Show top-level categories OR categories marked to show on home
  const activeCategories = (data.categories || []).filter(
    (c: any) => c.isActive && (c.showOnHome || !c.parent)
  );

  const hero = data.sections?.hero;
  const brandStory = data.sections?.brandStory;
  const reviews = data.sections?.reviews;
  const instagram = data.sections?.instagram;

  return (
    <main style={{ backgroundColor: '#F8F5EF' }}>
      {/* 1. Navbar */}
      <Navbar theme={data.theme} />

      {/* 2. Hero — uses title/subtitle/image from Settings → Hero Section */}
      {hero?.enabled !== false && (
        <Hero data={hero} products={data.products} theme={data.theme} />
      )}

      {/* 3. Marquee Strip */}
      <MarqueeStrip />

      {/* 4. Featured Products Collection */}
      <FeaturedProducts data={data.sections?.featured} products={data.products} theme={data.theme} />

      {/* 5. Category Sections — one per top-level active category */}
      {activeCategories.map((category: any) => {
        // Collect all sub-category IDs
        const subCategoryIds = (data.categories || [])
          .filter((c: any) => (typeof c.parent === 'string' ? c.parent : c.parent?._id) === category._id)
          .map((c: any) => c._id);
        
        const categoryIds = [category._id, ...subCategoryIds];

        const categoryProducts = (data.products || []).filter(
          (p: any) => {
            const pCatId = typeof p.category === 'string' ? p.category : p.category?._id;
            return p.isActive !== false && categoryIds.includes(pCatId);
          }
        );

        return (
          <CategorySection key={category._id} category={category} products={categoryProducts} />
        );
      })}

      {/* 5. Brand Story — uses title/description/image from Settings → Brand Story Section */}
      {brandStory?.enabled !== false && (
        <BrandStory data={brandStory} theme={data.theme} />
      )}


      {/* 6. Instagram Photo Gallery — images uploaded from Settings */}
      <InstagramGallery data={instagram} />

      {/* 7. Instagram Reels (video reels from backend) */}
      <InstagramReels />


      {/* 7. Customer Reviews — uses reviews array + title from Settings → Reviews Section */}
      {reviews?.enabled !== false && (
        <Reviews data={reviews} reviews={data.reviews} theme={data.theme} />
      )}

      {/* 8. Footer */}
      <Footer data={data.sections?.footer} theme={data.theme} />

      {/* Floating WhatsApp button */}
      <FloatingWhatsApp />
    </main>
  );
}
