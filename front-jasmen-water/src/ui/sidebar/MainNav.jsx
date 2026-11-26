import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaGears, FaUsersGear } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import { MdContactSupport } from "react-icons/md";
import { useUser } from "../../features/authentication/useUser";
import { RiContactsFill } from "react-icons/ri";
import { BsBuildings } from "react-icons/bs";
import { FaMapMarkedAlt } from "react-icons/fa";
import LogoutOutBtn from "./LogoutOutBtn";

const links = [
  {
    title: "sidebar.dashboard",
    icon: <MdDashboard />,
    to: "/dashboard",
  },

  {
    title: "sidebar.buildings",
    icon: <BsBuildings />,
    to: "/buildings",
  },
  {
    title: "sidebar.map",
    icon: <FaMapMarkedAlt />,
    to: "/buildings-map",
  },
  {
    title: "sidebar.users",
    icon: <FaUsersGear />,
    to: "/users",
  },

  {
    title: "users.statistic",
    icon: <IoStatsChart />,
    to: "/usersStatistic",
  },
  {
    title: "sidebar.settings",
    icon: <FaGears />,
    to: "/settings",
  },
];

const clientLinks = [
  {
    title: "sidebar.overview",
    icon: <MdDashboard />,
    to: "/clientDashboard",
  },

  {
    title: "sidebar.contact",
    icon: <MdContactSupport />,
    to: "/contact",
  },

  {
    title: "sidebar.profile",
    icon: <RiContactsFill />,
    to: "/profile",
  },
];

function MainNav({ closeSidebar }) {
  const [t] = useTranslation();

  const { type } = useUser();

  const linksToDisplay = type === true ? links : clientLinks;

  return (
    <nav className="links-list">
      <ul className="flex flex-col gap-[6px]">
        {linksToDisplay?.map((link) => {
          return (
            <li title={t(link.title)} key={link.to} onClick={closeSidebar}>
              <NavLink
                className="flex items-center gap-[14px] rounded-xl p-[12px] text-base font-semibold text-textColor transition-colors hover:bg-primary"
                to={link.to}
              >
                <span className="text-xl">{link.icon}</span>
                <span>{t(link.title)}</span>
              </NavLink>
            </li>
          );
        })}
        <LogoutOutBtn />
      </ul>
    </nav>
  );
}

export default MainNav;
