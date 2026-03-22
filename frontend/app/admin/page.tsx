'use client';

import { useEffect, useState } from 'react';

import { API_URL } from '@/lib/config';


export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, activeProducts: 0, featuredProducts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_URL}/products/get-products`),
          fetch(`${API_URL}/categories/get-categories`),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const products = prodData.products || prodData || [];
        const categories = catData.categories || [];
        setStats({
          products: products.length,
          categories: categories.length,
          activeProducts: products.filter((p: any) => p.isActive).length,
          featuredProducts: products.filter((p: any) => p.isFeatured).length,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Products', value: loading ? '...' : String(stats.products), trend: `${stats.activeProducts} active`, icon: '01' },
    { label: 'Featured', value: loading ? '...' : String(stats.featuredProducts), trend: 'on homepage', icon: '02' },
    { label: 'Categories', value: loading ? '...' : String(stats.categories), trend: 'total', icon: '03' },
    { label: 'Active Products', value: loading ? '...' : String(stats.activeProducts), trend: `${stats.products - stats.activeProducts} inactive`, icon: '04' },
  ];
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end mb-5">
        <div>
          <h1 className="text-3xl font-bebas tracking-tight">Dashboard <span className="italic-serif text-4xl lowercase select-none">Overview</span></h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">Last Synchronized</p>
          <p className="text-xs font-medium">{new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="p-6 bg-white border-thin relative group hover:border-ink/20 transition-colors">
            <span className="absolute top-2 right-4 font-bebas text-xl opacity-[0.05] group-hover:opacity-10">{stat.icon}</span>
            <p className="text-[12px] font-bold text-ink/40 uppercase tracking-wider mb-3">{stat.label}</p>
            <h3 className="text-3xl font-bebas tracking-tight">{stat.value}</h3>
            <p className="text-[10px] font-medium mt-4 tracking-widest opacity-40 uppercase">{stat.trend}</p>
          </div>
        ))}
      </div>


    </div>
  );
}
