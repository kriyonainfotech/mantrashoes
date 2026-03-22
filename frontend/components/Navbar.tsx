'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, MessageCircle, MapPin, Phone, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';

interface CategoryNode {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  showInNavbar: boolean;
  navbarIndex: number;
  parent: string | null;
  children: CategoryNode[];
}

function buildTree(flat: any[]): CategoryNode[] {
  const map: Record<string, CategoryNode> = {};
  flat.forEach((c) => {
    map[c._id] = {
      _id: c._id, name: c.name, slug: c.slug, isActive: c.isActive,
      showInNavbar: c.showInNavbar, navbarIndex: c.navbarIndex ?? 0,
      parent: typeof c.parent === 'object' ? c.parent?._id ?? null : c.parent ?? null,
      children: [],
    };
  });
  const roots: CategoryNode[] = [];
  Object.values(map).forEach((node) => {
    if (node.parent && map[node.parent]) map[node.parent].children.push(node);
    else roots.push(node);
  });
  const sort = (nodes: CategoryNode[]) => {
    nodes.sort((a, b) => a.navbarIndex - b.navbarIndex);
    nodes.forEach((n) => sort(n.children));
  };
  sort(roots);
  return roots;
}

function DropdownMenu({ nodes, depth = 0 }: { nodes: CategoryNode[]; depth?: number }) {
  if (!nodes.length) return null;
  return (
    <motion.ul
      initial={{ opacity: 0, y: depth === 0 ? 8 : 0, x: depth > 0 ? -6 : 0 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: depth === 0 ? 4 : 0, x: depth > 0 ? -4 : 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`absolute z-50 min-w-[200px] py-1 ${depth === 0 ? 'top-full left-1/2 -translate-x-1/2 mt-2' : 'top-0 left-full ml-1'}`}
      style={{
        backgroundColor: '#F8F5EF',
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
      {nodes.map((node) => <DropdownItem key={node._id} node={node} depth={depth} />)}
    </motion.ul>
  );
}

function DropdownItem({ node, depth }: { node: CategoryNode; depth: number }) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children.length > 0;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enter = () => { if (timerRef.current) clearTimeout(timerRef.current); setOpen(true); };
  const leave = () => { timerRef.current = setTimeout(() => setOpen(false), 120); };
  return (
    <li className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <Link
        href={`/category/${node.slug}`}
        className="flex items-center justify-between gap-4 px-5 py-3"
        style={{ fontFamily: 'var(--font-nunito)', fontSize: '14px', fontWeight: 500, color: '#1A1A1A', transition: 'background 150ms' }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        {node.name}
        {hasChildren && <ChevronRight className="w-3 h-3 opacity-40 flex-shrink-0" />}
      </Link>
      <AnimatePresence>
        {open && hasChildren && <DropdownMenu nodes={node.children} depth={depth + 1} />}
      </AnimatePresence>
    </li>
  );
}

function NavItem({ node }: { node: CategoryNode }) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children.length > 0;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enter = () => { if (timerRef.current) clearTimeout(timerRef.current); setOpen(true); };
  const leave = () => { timerRef.current = setTimeout(() => setOpen(false), 150); };
  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <Link
        href={`/category/${node.slug}`}
        className="nav-link flex items-center gap-1"
        style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 500, color: '#1A1A1A' }}
      >
        {node.name}
      </Link>
      <AnimatePresence>
        {open && hasChildren && <DropdownMenu nodes={node.children} depth={0} />}
      </AnimatePresence>
    </div>
  );
}

function MobileTree({ nodes, depth = 0, onClose }: { nodes: CategoryNode[]; depth?: number; onClose: () => void }) {
  return (
    <>
      {nodes.map((node) => <MobileCategoryItem key={node._id} node={node} depth={depth} onClose={onClose} />)}
    </>
  );
}

function MobileCategoryItem({ node, depth, onClose }: { node: CategoryNode; depth: number; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children.length > 0;
  return (
    <div>
      <div className="flex items-center justify-between" style={{ paddingLeft: `${depth * 16}px` }}>
        <Link
          href={`/category/${node.slug}`}
          onClick={onClose}
          style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 500, color: '#1A1A1A' }}
        >
          {node.name}
        </Link>
        {hasChildren && (
          <button onClick={() => setExpanded(!expanded)} className="p-1 opacity-40">
            <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200" style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden mt-2 flex flex-col gap-4 pl-4"
            style={{ borderLeft: '2px solid rgba(0,0,0,0.1)' }}
          >
            <MobileTree nodes={node.children} depth={depth + 1} onClose={onClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar({ theme }: { theme: any }) {
  const { data } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const phone = data?.sections?.footer?.phone || '';
  const address = data?.sections?.footer?.address || '';
  const whatsapp = phone.replace(/\D/g, '');
  const allCategories: any[] = data?.categories || [];
  const tree = buildTree(allCategories.filter((c) => c.isActive));

  function findNavNodes(nodes: CategoryNode[]): CategoryNode[] {
    const result: CategoryNode[] = [];
    for (const node of nodes) {
      if (node.showInNavbar) result.push(node);
      else result.push(...findNavNodes(node.children));
    }
    return result;
  }

  const navRoots = findNavNodes(tree).sort((a, b) => a.navbarIndex - b.navbarIndex);

  return (
    <header
      className="fixed top-0 w-full z-50"
      style={{
        backgroundColor: 'rgba(248,245,239,0.97)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
        transition: 'border-color 300ms ease, box-shadow 300ms ease',
      }}
    >
      {/* Row 1 — Logo + Address + Phone + WhatsApp */}
      <div className="w-full" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

          {/* Logo — pure invert+multiply, no tinting to stay true to original B&W logo */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <div className="relative h-14 w-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo-removebg-preview.png"
                alt="Mantra Shoes"
                width={150}
                height={56}
                priority
                className="object-contain"
                style={{
                  filter: 'invert(1)',
                  mixBlendMode: 'multiply',
                }}
              />
            </div>
          </Link>

          {/* Address + Phone — desktop */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {address && (
              <span className="flex items-center gap-1.5" style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 400, color: '#777' }}>
                <MapPin className="w-3 h-3 flex-shrink-0 opacity-60" />
                {address}
              </span>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-1.5" style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 400, color: '#777' }}>
                <Phone className="w-3 h-3 flex-shrink-0 opacity-60" />
                {phone}
              </a>
            )}
          </div>

          {/* WhatsApp — desktop */}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-white flex-shrink-0 rounded-full"
              style={{ background: '#0fb04a', fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 600, transition: 'transform 200ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          )}

          {/* Mobile: WhatsApp + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: '#0fb04a' }}>
                <MessageCircle className="w-4 h-4 text-white" />
              </a>
            )}
            <button className="flex items-center justify-center w-8 h-8" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" style={{ color: '#1A1A1A' }} /> : <Menu className="w-5 h-5" style={{ color: '#1A1A1A' }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2 — Nav links */}
      <div
        className="hidden md:block w-full"
        style={{ borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent', transition: 'border-color 300ms ease' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-center gap-10">
          <Link href="/" className="nav-link" style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 500, color: '#1A1A1A' }}>Home</Link>
          {navRoots.map((node) => <NavItem key={node._id} node={node} />)}
          <Link href="/about" className="nav-link" style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 500, color: '#1A1A1A' }}>About</Link>
          <Link href="/shop" className="nav-link" style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 500, color: '#1A1A1A' }}>All Products</Link>
          <Link href="/contact" className="nav-link" style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 500, color: '#1A1A1A' }}>Contact Us</Link>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ backgroundColor: '#F8F5EF', borderTop: '1px solid rgba(0,0,0,0.08)' }}
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              <Link href="/" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 600, color: '#1A1A1A' }}>Home</Link>
              <MobileTree nodes={navRoots} onClose={() => setMobileOpen(false)} />
              <Link href="/about" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 600, color: '#1A1A1A' }}>About</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'var(--font-nunito)', fontSize: '15px', fontWeight: 600, color: '#1A1A1A' }}>Contact Us</Link>
              {address && (
                <p className="flex items-center gap-2 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.08)', fontFamily: 'var(--font-nunito)', fontSize: '12px', color: '#777' }}>
                  <MapPin className="w-3 h-3 flex-shrink-0 opacity-60" />
                  {address}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
