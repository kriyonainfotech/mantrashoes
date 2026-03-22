'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Instagram } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const AUTO_MS = 5000;

interface Reel { _id: string; videoUrl: string; thumbnailUrl: string; caption: string; }

function ReelCard({ reel, onPlayStateChange }: {
  reel: Reel;
  onPlayStateChange: (playing: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
      onPlayStateChange(true);
    } else {
      v.pause();
      setPlaying(false);
      onPlayStateChange(false);
    }
    flashControls();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    flashControls();
  };

  const flashControls = () => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 2500);
  };

  // Stop video when card is unmounted (slide changes)
  useEffect(() => {
    return () => {
      videoRef.current?.pause();
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <div
      className="relative overflow-hidden flex-shrink-0 cursor-pointer"
      style={{
        width: 'min(300px, 85vw)',
        aspectRatio: '9/16',
        backgroundColor: '#0a0a0a',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
      }}
      onClick={togglePlay}
      onMouseMove={flashControls}
      onMouseEnter={flashControls}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.thumbnailUrl || undefined}
        muted
        loop
        playsInline
        preload="metadata"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onPlay={() => { setPlaying(true); onPlayStateChange(true); }}
        onPause={() => { setPlaying(false); onPlayStateChange(false); }}
      />

      {/* Top gradient */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 80,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Bottom gradient + info */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '48px 14px 16px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 60%, transparent)',
        pointerEvents: 'none',
      }}>
        {/* IG-style username row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-cinzel)', fontWeight: 700 }}>M</span>
          </div>
          <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 600 }}>
            mantra_shoes_store
          </span>
        </div>
        {reel.caption && (
          <p style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-dm-sans)', fontSize: 12, margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {reel.caption}
          </p>
        )}
      </div>

      {/* Controls overlay — fades in on interaction */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: showControls || !playing ? 1 : 0,
        transition: 'opacity 300ms',
        pointerEvents: 'none',
      }}>
        {/* Big play/pause in center */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1.5px solid rgba(255,255,255,0.3)',
        }}>
          {playing
            ? <Pause size={22} color="#fff" fill="#fff" />
            : <Play size={22} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
          }
        </div>
      </div>

      {/* Mute button — top right, always visible on hover */}
      <button
        onClick={toggleMute}
        style={{
          position: 'absolute', top: 12, right: 12,
          width: 32, height: 32, borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          border: '0.5px solid rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 300ms',
          pointerEvents: showControls ? 'auto' : 'none',
        }}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted
          ? <VolumeX size={14} color="#fff" />
          : <Volume2 size={14} color="#fff" />
        }
      </button>
    </div>
  );
}

export default function InstagramReels() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [idx, setIdx] = useState(0);
  const [anyPlaying, setAnyPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/reels`)
      .then(r => r.json())
      .then(d => { if (d.reels?.length) setReels(d.reels); })
      .catch(() => { });
  }, []);

  const total = reels.length;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setAnyPlaying(p => {
        if (!p) setIdx(i => (i + 1) % total);
        return p;
      });
    }, AUTO_MS);
  }, [total]);

  useEffect(() => {
    if (total === 0) return;
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [total, resetTimer]);

  const go = (dir: 1 | -1) => {
    setIdx(i => (i + dir + total) % total);
    resetTimer();
  };

  if (total === 0) return null;

  const visibleCount = Math.min(3, total);
  const visibleIdxs = Array.from({ length: visibleCount }, (_, k) => (idx + k) % total);

  return (
    <section style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }} className="py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Slider */}
        <div className="flex items-center justify-center gap-4">
          {total > visibleCount && (
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              style={{ flexShrink: 0, width: 40, height: 40, border: '0.5px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 0 }}
            >
              <ChevronLeft size={18} color="#fff" />
            </button>
          )}

          <div className="flex gap-4 justify-center">
            {visibleIdxs.map((reelIdx, slot) => (
              <ReelCard
                key={`${reelIdx}-${slot}`}
                reel={reels[reelIdx]}
                onPlayStateChange={setAnyPlaying}
              />
            ))}
          </div>

          {total > visibleCount && (
            <button
              onClick={() => go(1)}
              aria-label="Next"
              style={{ flexShrink: 0, width: 40, height: 40, border: '0.5px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 0 }}
            >
              <ChevronRight size={18} color="#fff" />
            </button>
          )}
        </div>

        {/* Dots */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            {reels.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIdx(i); resetTimer(); }}
                aria-label={`Go to reel ${i + 1}`}
                style={{
                  width: i === idx ? 24 : 6, height: 1,
                  backgroundColor: i === idx ? '#fff' : 'rgba(255,255,255,0.25)',
                  transition: 'all 250ms ease',
                  border: 'none', padding: 0, cursor: 'pointer',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
