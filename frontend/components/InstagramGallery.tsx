'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { Instagram, ChevronLeft, ChevronRight } from 'lucide-react';

const VISIBLE = 6;      // images visible at once on desktop
const AUTO_MS = 3000;   // auto-slide interval

export default function InstagramGallery({ data }: { data: any }) {
  const [startIdx, setStartIdx] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  if (!data?.enabled) return null;

  const images: string[] = data.images || [];
  if (images.length === 0) return null;

  const title = data.title || 'Follow Us on Instagram';
  const profileLink = data.profileLink || '#';
  const total = images.length;

  // How many slides can we go (step 1 at a time, show VISIBLE)
  const maxStart = Math.max(0, total - VISIBLE);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setStartIdx(prev => {
        if (prev >= maxStart) return 0;        // wrap around
        return prev + 1;
      });
      setDirection(1);
    }, AUTO_MS);
  }, [maxStart]);

  useEffect(() => {
    if (total <= VISIBLE) return;             // no slider needed
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [total, resetTimer]);

  const go = (dir: 1 | -1) => {
    setDirection(dir);
    setStartIdx(prev => {
      const next = prev + dir;
      if (next < 0) return maxStart;
      if (next > maxStart) return 0;
      return next;
    });
    resetTimer();
  };

  // Which images to show
  const visibleImages = images.slice(startIdx, startIdx + VISIBLE);
  // Pad if at end and count < VISIBLE (wrap)
  const padded = visibleImages.length < VISIBLE
    ? [...visibleImages, ...images.slice(0, VISIBLE - visibleImages.length)]
    : visibleImages;

  const needsSlider = total > VISIBLE;

  return (
    <section className="py-12" style={{ backgroundColor: '#F8F5EF' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p style={{ fontFamily: 'var(--font-nunito)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#999', marginBottom: '4px' }}>
              Gallery
            </p>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.1 }}>
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Prev / Next buttons */}
            {needsSlider && (
              <div className="flex gap-2">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous"
                  className="flex items-center justify-center w-9 h-9 transition-all hover:bg-black hover:text-white"
                  style={{ border: '1px solid rgba(0,0,0,0.2)', color: '#1A1A1A' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next"
                  className="flex items-center justify-center w-9 h-9 transition-all hover:bg-black hover:text-white"
                  style={{ border: '1px solid rgba(0,0,0,0.2)', color: '#1A1A1A' }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {profileLink && profileLink !== '#' && (
              <a
                href={profileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 transition-all hover:opacity-70"
                style={{ border: '1px solid rgba(0,0,0,0.15)', fontFamily: 'var(--font-nunito)', fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}
              >
                <Instagram className="w-4 h-4" />
                View Profile
              </a>
            )}
          </div>
        </div>

        {/* ── Slider / Grid ─────────────────────────────────────── */}
        <div className="overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={startIdx}
              initial={{ x: direction > 0 ? 80 : -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -80 : 80, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2"
            >
              {(needsSlider ? padded : images).map((url, i) => (
                <a
                  key={`${startIdx}-${i}`}
                  href={profileLink !== '#' ? profileLink : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden block"
                  style={{ aspectRatio: '1/1', backgroundColor: '#ECEAE5' }}
                >
                  <Image
                    src={url}
                    alt={`Gallery ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.32)' }}
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                </a>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Dot indicators ──────────────────────────────────────── */}
        {needsSlider && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: maxStart + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > startIdx ? 1 : -1); setStartIdx(i); resetTimer(); }}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: i === startIdx ? 20 : 6,
                  height: 3,
                  backgroundColor: i === startIdx ? '#1A1A1A' : 'rgba(0,0,0,0.2)',
                  border: 'none', padding: 0, cursor: 'pointer',
                  transition: 'all 250ms ease',
                }}
              />
            ))}
          </div>
        )}

        {/* ── Mobile view profile ───────────────────────────────── */}
        {profileLink && profileLink !== '#' && (
          <div className="mt-5 flex justify-center sm:hidden">
            <a
              href={profileLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
              style={{ fontFamily: 'var(--font-nunito)', fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}
            >
              <Instagram className="w-4 h-4" />
              View on Instagram
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
