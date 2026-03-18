'use client';

export default function Footer({ data, theme }: { data: any, theme: any }) {
  return (
    <footer 
      className="py-16 text-white"
      style={{ backgroundColor: data?.backgroundColor || '#000000', color: data?.textColor || '#FFFFFF' }}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-2xl font-bold tracking-tighter mb-6" style={{ fontFamily: 'var(--font-montserrat)' }}>
            MANTRA
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {data?.brandDescription}
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold uppercase tracking-widest text-sm mb-6">Shop</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Mens</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Womens</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold uppercase tracking-widest text-sm mb-6">Support</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold uppercase tracking-widest text-sm mb-6">Newsletter</h4>
          <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent border-b border-gray-600 py-2 px-0 text-sm w-full focus:outline-none focus:border-white transition-colors"
            />
            <button className="uppercase text-xs font-semibold tracking-widest ml-4 hover:text-gray-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Mantra Shoes. All rights reserved.
      </div>
    </footer>
  );
}
