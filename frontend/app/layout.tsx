import type { Metadata } from 'next';
import { Playfair_Display, Lora, Nunito_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

// Headings — warm, established, heritage
const playfair = Playfair_Display({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-playfair',
});

// Sub-headings / editorial — warm serif
const lora = Lora({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-lora',
});

// Body / UI — clean, friendly, readable
const nunitoSans = Nunito_Sans({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Mantra Shoes | Trusted Footwear — Surat',
  description: 'Mantra Shoes — a trusted, authentic local shoe brand in Surat. Comfort, quality and heritage since day one.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lora.variable} ${nunitoSans.variable}`}>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
