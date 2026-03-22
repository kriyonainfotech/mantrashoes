'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { RootState } from '@/lib/redux/store';
import Cookies from 'js-cookie';
import { logout } from '@/lib/redux/slices/authSlice';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/category', label: 'Categories' },
  { href: '/admin/reels', label: 'Reels' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    const cookieToken = Cookies.get('token');
    if (pathname === '/admin/login') {
      if (isAuthenticated || cookieToken) router.push('/admin');
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

  if (pathname === '/admin/login') return <>{children}</>;

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="p-6 space-y-1">
      {NAV_LINKS.map(({ href, label }) => {
        const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
        return (
          <a
            key={href}
            href={href}
            onClick={onNavigate}
            className="flex items-center px-4 py-2.5 transition-all"
            style={{
              borderLeft: isActive ? '2px solid #0a0a0a' : '2px solid transparent',
              backgroundColor: isActive ? 'rgba(10,10,10,0.05)' : 'transparent',
              color: isActive ? '#0a0a0a' : 'rgba(10,10,10,0.4)',
            }}
          >
            <span className="font-bebas text-lg tracking-wide">{label}</span>
          </a>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-cream flex flex-col font-dm-sans text-ink">

      {/* Header */}
      <header className="h-16 border-b border-ink/10 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md z-30 sticky top-0">
        <div className="flex items-center gap-4">
          {/* Hamburger — visible below lg */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="lg:hidden flex items-center justify-center w-9 h-9"
            style={{ border: '0.5px solid rgba(10,10,10,0.15)' }}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <h1 className="text-3xl font-bebas tracking-tighter">MANTRA.</h1>
          <div className="hidden sm:block h-4 w-px bg-ink/10" />
          <div className="hidden sm:flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-ink/40 leading-none">Management</span>
            <span className="text-[12px] font-bebas tracking-widest uppercase">Console</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">System Active</span>
          </div>
          <button
            onClick={() => { dispatch(logout()); router.push('/admin/login'); }}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink hover:text-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Single sidebar — drawer on mobile, static on desktop */}
        <aside
          className={`
            fixed lg:static top-16 lg:top-auto left-0
            h-[calc(100vh-4rem)] lg:h-auto
            w-64 lg:w-60
            bg-white border-r border-ink/10
            flex flex-col flex-shrink-0 z-20
            transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
          `}
        >
          <NavLinks onNavigate={() => setSidebarOpen(false)} />
          <div className="mt-auto p-8 opacity-10 hidden lg:block">
            <h1 className="text-4xl font-bebas rotate-90 origin-left translate-x-4">MANTRA</h1>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
