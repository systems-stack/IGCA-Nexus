import React from 'react';
import './SkeletonLoader.css';

export const SkeletonLoader = ({ count = 6 }) => {
  const elements = Array.from({ length: count });

  return (
    <div className="skeleton-grid">
      {elements.map((_, idx) => (
        <div key={idx} className="skeleton-card pulse">
          <div className="skeleton-img"></div>
          <div className="skeleton-text-container">
            <div className="skeleton-line title"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
