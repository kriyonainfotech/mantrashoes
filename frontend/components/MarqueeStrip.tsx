'use client';

const taglines = [
  'Crafted for the Bold',
  'Heritage Meets Modern',
  'Walk with Purpose',
  'Every Step, a Statement',
  'Premium Footwear Since Day One',
  'Wear the Legacy',
];

export default function MarqueeStrip() {
  const items = [...taglines, ...taglines]; // duplicate for seamless loop

  return (
    <div
      className="w-full overflow-hidden py-4"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div
        className="flex whitespace-nowrap"
        style={{ animation: 'marquee 28s linear infinite' }}
      >
        {items.map((text, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '17px',
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '0.04em',
              flexShrink: 0,
            }}
          >
            {text}
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px' }}>✦</span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
