'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import BrandStory from '@/components/BrandStory';
import Footer from '@/components/Footer';

export default function About() {
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
      
      <div className="bg-black pt-40 pb-20 px-6 text-white text-center">
        <h1 className="text-5xl font-bold tracking-tighter" style={{ fontFamily: 'var(--font-montserrat)' }}>
          {data.sections.aboutHeader?.title || "OUR STORY"}
        </h1>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          {data.sections.aboutHeader?.subtitle || "The journey of Mantra Shoes and our commitment to excellence."}
        </p>
      </div>

      {/* Reusing the BrandStory component but forcing it to be enabled for this page */}
      <BrandStory data={{ ...data.sections.brandStory, enabled: true }} theme={data.theme} />

      <Footer data={data.sections.footer} theme={data.theme} />
    </main>
  );
}
