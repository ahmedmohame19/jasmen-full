const WAVE_PATH =
  "M0 60 C150 0 450 120 600 60 C750 0 1050 120 1200 60 V120 H0Z";

function WaveLayer({ className, animation }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={`absolute bottom-0 start-0 h-full w-[200%] ${animation} motion-reduce:animate-none ${className}`}
    >
      <path d={WAVE_PATH} fill="currentColor" />
    </svg>
  );
}

function WaveBackdrop({ className = "h-[120px]", tone = "text-white" }) {
  return (
    <div
      aria-hidden="true"
      dir="ltr"
      className={`pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden ${className} ${tone}`}
    >
      <WaveLayer className="opacity-20" animation="animate-wave-drift-slow" />
      <WaveLayer
        className="top-[18%] h-[82%] opacity-30"
        animation="animate-wave-drift"
      />
      <WaveLayer className="top-[42%] h-[58%] opacity-40" animation="" />
    </div>
  );
}

export default WaveBackdrop;
