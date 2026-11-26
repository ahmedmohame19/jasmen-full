import { useTranslation } from "react-i18next";
import { FaBolt, FaMobileAlt, FaShieldAlt } from "react-icons/fa";
import LoginForm from "../features/authentication/LoginForm";
import KemetricsMark from "../ui/KemetricsMark";
import Logo from "../ui/Logo";
import WaveBackdrop from "../ui/WaveBackdrop";
import TranslationButton from "../ui/header/TranslationButton";
import DarkModeToggle from "../ui/DarkModeToggle";

const FEATURES = [
  { key: "secure", Icon: FaShieldAlt },
  { key: "fast", Icon: FaBolt },
  { key: "easy", Icon: FaMobileAlt },
];

const BUBBLES = [
  "start-[12%] top-[18%] h-[18px] w-[18px] [animation-delay:0s]",
  "start-[78%] top-[12%] h-[28px] w-[28px] [animation-delay:1.2s]",
  "start-[64%] top-[46%] h-[14px] w-[14px] [animation-delay:2.1s]",
  "start-[22%] top-[58%] h-[22px] w-[22px] [animation-delay:0.6s]",
];

function Login() {
  const [t] = useTranslation();

  return (
    <main className="flex min-h-screen text-textColor">
      <section className="relative hidden overflow-hidden bg-hero-gradient text-white lg:flex lg:w-[52%] lg:flex-col lg:justify-between lg:p-[48px] lg:pb-[150px]">
        {BUBBLES.map((position) => (
          <span
            key={position}
            aria-hidden="true"
            className={`absolute animate-float-y rounded-full border border-white/50 bg-white/10 motion-reduce:animate-none ${position}`}
          />
        ))}
        <Logo size="large" onDark />

        <div className="relative z-10 max-w-[520px]">
          <h2 className="text-5xl font-extrabold leading-tight">
            {t("brand.heroTitle")}
          </h2>
          <p className="mt-[10px] text-3xl font-bold text-sky-200">
            {t("brand.heroSubtitle")}
          </p>

          <ul className="mt-[36px] flex gap-[14px]">
            {FEATURES.map(({ key, Icon }) => (
              <li
                key={key}
                className="flex w-[130px] flex-col items-center gap-[10px] rounded-2xl border border-white/25 bg-white/10 p-[16px] text-center text-sm font-semibold backdrop-blur-md"
              >
                <Icon className="text-2xl text-sky-200" aria-hidden="true" />
                {t(`brand.${key}`)}
              </li>
            ))}
          </ul>
        </div>

        <KemetricsMark className="absolute end-[10%] top-[24%] h-[260px] w-[208px] animate-float-y opacity-95 drop-shadow-2xl motion-reduce:animate-none" />

        <WaveBackdrop className="h-[120px]" />
      </section>

      <section className="relative flex w-full flex-col items-center justify-center gap-[24px] px-[16px] py-[40px] lg:w-[48%]">
        <div className="absolute top-[18px] flex items-center gap-[8px] ltr:right-[18px] rtl:left-[18px]">
          <DarkModeToggle />
          <TranslationButton />
        </div>
        <div className="lg:hidden">
          <Logo size="large" stacked />
        </div>
        <LoginForm />
      </section>
    </main>
  );
}

export default Login;
