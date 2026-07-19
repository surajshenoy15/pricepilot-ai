import React from 'react';

const PricePilotLogo = ({ size = 40, showText = true, collapsed = false, dark = true }) => {
  const textColor = dark ? '#f8fafc' : '#0f172a';
  const subColor = dark ? 'rgba(226,232,240,.62)' : '#64748b';

  return (
    <div className="pp-brand" style={{ display: 'inline-flex', alignItems: 'center', gap: collapsed ? 0 : 11 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 10px 18px rgba(37,99,235,.24))' }}
      >
        <defs>
          <linearGradient id="pp-logo-bg" x1="5" y1="4" x2="43" y2="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" />
            <stop offset=".55" stopColor="#4F46E5" />
            <stop offset="1" stopColor="#0EA5E9" />
          </linearGradient>
          <linearGradient id="pp-logo-line" x1="14" y1="31" x2="35" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#BAE6FD" />
            <stop offset="1" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#pp-logo-bg)" />
        <path
          d="M15 13.5h13.7c1.1 0 2.1.44 2.88 1.22l4.7 4.7a4.07 4.07 0 0 1 0 5.76L25.18 36.3a4.07 4.07 0 0 1-5.76 0l-7.7-7.7A4.07 4.07 0 0 1 10.5 25.7V18A4.5 4.5 0 0 1 15 13.5Z"
          fill="rgba(255,255,255,.14)"
          stroke="rgba(255,255,255,.42)"
          strokeWidth="1.2"
        />
        <circle cx="17.3" cy="20.1" r="2.25" fill="rgba(255,255,255,.86)" />
        <path d="M16 31l5.6-5.8 4.2 3.1 7-8.2" stroke="url(#pp-logo-line)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M29.4 20.1h3.45v3.45" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {showText && !collapsed && (
        <div style={{ lineHeight: 1.05, minWidth: 0 }}>
          <div style={{ color: textColor, fontSize: 16, fontWeight: 850, letterSpacing: '-.45px', whiteSpace: 'nowrap' }}>
            PricePilot <span style={{ color: '#60a5fa' }}>AI</span>
          </div>
          <div style={{ color: subColor, fontSize: 9.5, fontWeight: 750, letterSpacing: '1.65px', textTransform: 'uppercase', marginTop: 4, whiteSpace: 'nowrap' }}>
            Pricing intelligence
          </div>
        </div>
      )}
    </div>
  );
};

export default PricePilotLogo;
