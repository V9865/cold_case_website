import React from 'react';
import './DetectiveBadge.css';

const SIZES = {
  sm: 28,
  md: 40,
  lg: 52,
};

export default function DetectiveBadge({ size = 'md', showLabel = false }) {
  const px = SIZES[size] || SIZES.md;

  return (
    <div className="detective-badge group">
      {/* Pulse ring overlay */}
      <span className="detective-badge__ring" />

      {/* Badge SVG — hexagon */}
      <svg
        className="detective-badge__svg"
        width={px}
        height={px}
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="26,2 48,14 48,38 26,50 4,38 4,14"
          fill="#0F172A"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
        <polygon
          points="26,8 44,18 44,34 26,44 8,34 8,18"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.5"
          opacity="0.4"
        />
        <text
          x="26"
          y="30"
          textAnchor="middle"
          fill="var(--accent)"
          fontFamily="JetBrains Mono, monospace"
          fontSize="11"
          fontWeight="700"
          letterSpacing="1"
        >
          DET
        </text>
      </svg>

      {/* Optional label */}
      {showLabel && (
        <span className="detective-badge__label">LEAD DETECTIVE</span>
      )}
    </div>
  );
}
