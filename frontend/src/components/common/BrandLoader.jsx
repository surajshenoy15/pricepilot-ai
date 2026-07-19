import React from 'react';
import PricePilotLogo from './Logo';

export default function BrandLoader({ label = 'Calibrating pricing intelligence' }) {
  return (
    <div className="pp-boot-loader" role="status" aria-live="polite">
      <div className="pp-boot-ambient pp-boot-ambient-a" />
      <div className="pp-boot-ambient pp-boot-ambient-b" />
      <div className="pp-boot-stage">
        <div className="pp-loader-orbit pp-loader-orbit-one" />
        <div className="pp-loader-orbit pp-loader-orbit-two" />
        <div className="pp-loader-logo-wrap">
          <PricePilotLogo size={58} showText={false} />
        </div>
      </div>
      <div className="pp-loader-wordmark">PricePilot <span>AI</span></div>
      <div className="pp-loader-copy">{label}</div>
      <div className="pp-loader-track"><span /></div>
    </div>
  );
}
