const BASE_STYLE =
  "w-full rounded-xl border font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandText";

const VARIATION_STYLE = {
  colorBrand:
    "border-transparent bg-brand-gradient text-white shadow-glow hover:brightness-110 active:scale-[0.98]",
  secondary:
    "border-line bg-primary text-brandText hover:border-colorBrand hover:bg-colorBrand hover:text-white",
};

const DISABLED_STYLE =
  "cursor-not-allowed border-slate-400 bg-slate-400 text-white shadow-none";

export default function Button({
  children,
  type = "button",
  onClick,
  variation = "colorBrand",
  Font = "text-base h-[45px]",
  disabled,
  className = "",
}) {
  const variationStyle =
    VARIATION_STYLE[variation] ?? VARIATION_STYLE.colorBrand;

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${BASE_STYLE} ${Font} ${disabled ? DISABLED_STYLE : variationStyle} ${className}`}
    >
      {children}
    </button>
  );
}

export function DeleteConfirmButton({
  children,
  type = "button",
  onClick,
  Font = "text-base h-[45px]",
  disabled,
  className = "",
}) {
  const stateStyle = disabled
    ? DISABLED_STYLE
    : "border-red-600 bg-red-600 text-white hover:bg-red-700";

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${BASE_STYLE} ${Font} ${stateStyle} ${className}`}
    >
      {children}
    </button>
  );
}
