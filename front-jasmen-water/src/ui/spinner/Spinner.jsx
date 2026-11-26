import KemetricsMark from "../KemetricsMark";

function Spinner({ height = " h-screen" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`${height} flex items-center justify-center`}
    >
      <KemetricsMark className="h-[72px] w-[58px] animate-float-y drop-shadow-lg motion-reduce:animate-none" />
    </div>
  );
}

export default Spinner;
