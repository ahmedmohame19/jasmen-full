import { Link } from "react-router-dom";
import { useOutsideClick } from "../../hooks/useOutesideClick";
import Logo from "../Logo";
import WaveBackdrop from "../WaveBackdrop";
import MainNav from "./MainNav";

function Sidebar({ showSidebar, closeSidebar }) {
  const ref = useOutsideClick(closeSidebar);

  return (
    <>
      <aside
        ref={ref}
        className={`fixed ${showSidebar ? "ltr:left-0 rtl:right-0" : "ltr:left-[-400px] rtl:right-[-400px]"} top-0 z-50 flex h-[100vh] w-[290px] flex-col justify-start gap-[24px] overflow-hidden border-line bg-glass px-[16px] shadow-card backdrop-blur-xl transition-all md:static ltr:border-r rtl:border-l`}
      >
        <Link to={"/"} className="mt-[28px] block px-[6px]">
          <Logo />
        </Link>
        <div className="min-h-0 flex-1 overflow-y-auto pb-[130px]">
          <MainNav closeSidebar={closeSidebar} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[110px] bg-hero-gradient text-white">
          <WaveBackdrop className="h-[70px]" tone="text-white" />
        </div>
      </aside>

      <div
        aria-hidden="true"
        className={`fixed left-0 top-0 z-40 w-full bg-[#061a45]/50 backdrop-blur-[2px] md:hidden ${showSidebar ? "h-screen" : "h-0"}`}
      />
    </>
  );
}

export default Sidebar;
