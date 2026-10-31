import React from "react";

/**
 * Official TeamFlow AI Brand Logo SVG Badge
 * Features the signature gradient rounded badge, white stylized 'T' monogram,
 * and glowing cyan orbital spark.
 */
export default function BrandLogo({
  size = 28,
  id = "tf-brand-logo",
  className = "",
  style = {},
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`teamflow-brand-logo ${className}`}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
      aria-label="TeamFlow AI Logo"
    >
      <rect width="28" height="28" rx="8" fill={`url(#${id})`} />
      <path
        d="M8 9H20M14 9V19M11 19H17"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21" cy="7" r="2.5" fill="#38bdf8" />
      <defs>
        <linearGradient
          id={id}
          x1="0"
          y1="0"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6366f1" />
          <stop offset="0.5" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

