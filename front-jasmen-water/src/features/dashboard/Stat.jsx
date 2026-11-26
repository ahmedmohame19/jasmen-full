import { useTranslation } from "react-i18next";

function Stat({ icon, title, value, description }) {
  const [t] = useTranslation();

  return (
    <div
      title={t(description)}
      className="surface-card group flex items-center gap-[18px] p-[18px] transition-transform hover:-translate-y-[3px]"
    >
      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
        {icon}
      </div>
      <div>
        <h5 className="text-xs font-bold uppercase tracking-wide text-mutedText">
          {t(title)}
        </h5>
        <p className="text-3xl font-extrabold tabular-nums">{value}</p>
      </div>
    </div>
  );
}

export default Stat;
