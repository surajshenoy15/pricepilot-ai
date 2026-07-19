import React from 'react';
import PricePilotLogo from './Logo';

export const PageLoader = ({ text = 'Loading intelligence...' }) => (
  <div className="pp-page-loader">
    <div className="pp-page-loader-mark">
      <span className="pp-page-loader-ring" />
      <PricePilotLogo size={44} showText={false} />
    </div>
    <span>{text}</span>
  </div>
);

export const TableSkeleton = () => (
  <div className="pp-table-skeleton">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="pp-table-skeleton-row">
        <div className="pp-skeleton-circle" />
        <div className="pp-skeleton-copy">
          <div className="pp-skeleton-line" style={{ width: `${62 + i * 5}%` }} />
          <div className="pp-skeleton-line small" style={{ width: `${40 + i * 4}%` }} />
        </div>
        <div className="pp-skeleton-chip" />
      </div>
    ))}
  </div>
);

export default PageLoader;
