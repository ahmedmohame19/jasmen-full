import { useId } from "react";

function KemetricsMark({ className = "h-[48px] w-[38px]" }) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 64 80"
      className={className}
      role="img"
      aria-label="Kemetrics"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="8"
          y1="10"
          x2="60"
          y2="76"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#2fd0f2" />
          <stop offset="0.5" stopColor="#1b6fe8" />
          <stop offset="1" stopColor="#0b2a6b" />
        </linearGradient>
      </defs>
      <path
        d="M36 3C30 14 8 32 8 52a26 26 0 0 0 52 0C60 36 44 14 36 3Z"
        fill={`url(#${gradientId})`}
      />
      <g
        stroke="#fff"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M25 35v31" />
        <path d="M27 52l17-16" />
        <path d="M32 49l13 17" />
      </g>
    </svg>
  );
}

export default KemetricsMark;
