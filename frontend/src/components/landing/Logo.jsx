import { useId } from "react";

/**
 * Original VisionTrace mark: an eye (the "Vision" half) with a diagonal
 * trace line and ping dot cutting across it (the "Trace" half) — not a
 * generic icon-library glyph.
 */
export function Logo({ size = 32, className = "" }) {
  const gid = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      <rect width="32" height="32" rx="9" fill={`url(#${gid})`} opacity="0.14" />

      {/* Eye */}
      <path
        d="M5 16.5C8.2 10.5 13 8 16.5 8c3.5 0 8.3 2.5 11.5 8.5-3.2 6-8 8.5-11.5 8.5C13 25 8.2 22.5 5 16.5Z"
        stroke={`url(#${gid})`}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="16.5" cy="16.5" r="3.4" fill={`url(#${gid})`} />

      {/* Trace ping */}
      <path
        d="M22 10.5 26.5 6"
        stroke={`url(#${gid})`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="27" cy="5.5" r="1.4" fill={`url(#${gid})`} />
    </svg>
  );
}
