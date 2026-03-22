'use client';

const taglines = [
  'Comfort You Can Feel',
  'Trusted by Surat since Decades',
  'Authentic Quality, Every Pair',
  'Walk with Confidence',
  'Genuine Footwear, Genuine Care',
  'Your Neighbourhood Shoe Experts',
];

export default function MarqueeStrip() {
  const items = [...taglines, ...taglines];

  return (
    <div className="w-full overflow-hidden py-3.5" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="flex whitespace-nowrap" style={{ animation: 'marquee 30s linear infinite' }}>
        {items.map((text, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6"
            style={{
              fontFamily: 'var(--font-lora)',
              fontSize: '15px',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.03em',
              flexShrink: 0,
            }}
          >
            {text}
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>✦</span>
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
