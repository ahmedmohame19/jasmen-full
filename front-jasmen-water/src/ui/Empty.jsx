import { FaTint } from "react-icons/fa";

function Empty({ message }) {
  return (
    <div className="surface-card flex flex-col items-center gap-[12px] p-[30px] text-center text-lg">
      <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-brand-gradient text-xl text-white shadow-glow">
        <FaTint aria-hidden="true" />
      </span>
      <p>{message}</p>
    </div>
  );
}

export default Empty;
