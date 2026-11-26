import KemetricsMark from "../KemetricsMark";

function MiniSpinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="surface-card flex items-center justify-center p-[30px]"
    >
      <KemetricsMark className="h-[48px] w-[38px] animate-float-y motion-reduce:animate-none" />
    </div>
  );
}

export default MiniSpinner;
