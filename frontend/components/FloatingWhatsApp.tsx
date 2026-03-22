'use client';

import { MessageCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function FloatingWhatsApp({ productName, size }: { productName?: string; size?: string }) {
  const { data } = useAppStore();
  const phone = data?.sections?.footer?.phone || '';
  const whatsapp = phone.replace(/\D/g, '');

  if (!whatsapp) return null;

  const message = productName
    ? `Hi, I want to order "${productName}"${size ? `, Size: ${size}` : ''}.`
    : 'Hi, I would like to know more about your products.';

  return (
    <>
      <a
        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
        style={{ width: '52px', height: '52px', backgroundColor: '#0fb04a', borderRadius: '50%', boxShadow: '0 4px 18px rgba(7,94,84,0.45)' }}
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: '#0fb04a', animation: 'wa-pulse 2.2s ease-out infinite', opacity: 0.6 }}
        />
        <MessageCircle className="relative z-10 w-6 h-6 text-white" />
      </a>

      <style>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(1.55); opacity: 0; }
          100% { transform: scale(1.55); opacity: 0; }
        }
      `}</style>
    </>
  );
}
