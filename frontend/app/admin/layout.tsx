'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { RootState } from '@/lib/redux/store';
import Cookies from 'js-cookie';
import { logout } from '@/lib/redux/slices/authSlice';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const cookieToken = Cookies.get('token');

    if (pathname === '/admin/login') {
      if (isAuthenticated || cookieToken) {
        router.push('/admin');
      }
      setIsChecking(false);
      return;
    }

    if (!isAuthenticated && !cookieToken) {
      router.push('/admin/login');
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, pathname, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream font-dm-sans">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border border-ink/10 border-t-ink rounded-full animate-spin mb-4"></div>
          <p className="font-bebas tracking-[0.2em] text-[10px] text-ink/40 uppercase">System Authorization</p>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col font-dm-sans text-ink">
      {/* Premium Header */}
      <header className="h-16 border-b border-ink/10 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-bebas tracking-tighter">MANTRA.</h1>
          <div className="h-4 w-px bg-ink/10"></div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-ink/40 leading-none">Management</span>
            <span className="text-[12px] font-bebas tracking-widest uppercase">Console</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">System Active</span>
          </div>
          <button
            onClick={() => {
              dispatch(logout());
              router.push('/admin/login');
            }}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink hover:text-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Premium Sidebar */}
        <aside className="w-60 border-r border-ink/10 hidden lg:flex flex-col bg-white">
          <nav className="p-6 space-y-2">
            <a href="/admin" className="group flex items-center px-4 py-2.5 text-sm font-medium border-l-2 border-ink bg-cream/50 transition-all">
              <span className="font-bebas text-lg tracking-wide">Dashboard</span>
            </a>
            <a href="/admin/products" className="group flex items-center px-4 py-2.5 text-sm font-medium border-l-2 border-transparent hover:border-ink/20 text-ink/40 hover:text-ink transition-all">
              <span className="font-bebas text-lg tracking-wide">Products</span>
            </a>
            <a href="/admin/category" className="group flex items-center px-4 py-2.5 text-sm font-medium border-l-2 border-transparent hover:border-ink/20 text-ink/40 hover:text-ink transition-all">
              <span className="font-bebas text-lg tracking-wide">Categories</span>
            </a>
            <a href="/admin/settings" className="group flex items-center px-4 py-2.5 text-sm font-medium border-l-2 border-transparent hover:border-ink/20 text-ink/40 hover:text-ink transition-all">
              <span className="font-bebas text-lg tracking-wide">Settings</span>
            </a>
          </nav>

          <div className="mt-auto p-8 opacity-10">
            <h1 className="text-4xl font-bebas rotate-90 origin-left translate-x-4">MANTRA</h1>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
