import type { Metadata } from 'next';
import { Cinzel, Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const cinzel = Cinzel({ weight: '400', subsets: ['latin'], variable: '--font-cinzel' });
const cormorant = Cormorant_Garamond({ weight: ['400', '500', '600', '700'], style: ['normal', 'italic'], subsets: ['latin'], variable: '--font-cormorant' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });

export const metadata: Metadata = {
  title: 'Mantra Shoes | Premium Footwear',
  description: 'Premium shoes engineered for performance and style.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
