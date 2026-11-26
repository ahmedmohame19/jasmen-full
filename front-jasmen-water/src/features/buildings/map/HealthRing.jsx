import { useId } from "react";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function HealthRing({
  percent,
  label,
  className = "h-[110px] w-[110px]",
  onDark = false,
}) {
  const gradientId = useId();
  const safePercent = Math.min(100, Math.max(0, Math.round(percent)));
  const dashOffset = CIRCUMFERENCE * (1 - safePercent / 100);

  return (
    <div className={`relative ${className}`} role="img" aria-label={label}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22d3ee" />
            <stop offset="1" stopColor={onDark ? "#ffffff" : "#1b5fdc"} />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeOpacity={onDark ? 0.25 : 0.15}
          strokeWidth="9"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>
      <span
        aria-hidden="true"
        className={`absolute inset-0 flex items-center justify-center text-[1.6em] font-extrabold ${onDark ? "text-white" : "text-textColor"}`}
      >
        {safePercent}%
      </span>
    </div>
  );
}

export default HealthRing;
