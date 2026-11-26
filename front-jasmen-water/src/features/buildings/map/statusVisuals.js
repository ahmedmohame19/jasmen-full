import { FaExclamationTriangle, FaLock, FaTint } from "react-icons/fa";
import { MdWaterDamage } from "react-icons/md";
import { UNIT_STATUS } from "../../../utils/unitStatus";

export const STATUS_VISUALS = {
  [UNIT_STATUS.LEAK]: {
    Icon: MdWaterDamage,
    surface:
      "bg-statusLeak text-onStatusLeak animate-leak-blink motion-reduce:animate-none",
    tileBorder: "border-2 border-transparent",
    windowBorder: "border border-white/40",
    glow: "shadow-[0_0_18px_2px_rgb(220_38_38/0.65)]",
  },
  [UNIT_STATUS.INACTIVE]: {
    Icon: FaLock,
    surface: "bg-statusInactive text-onStatusInactive",
    tileBorder: "border-2 border-transparent",
    windowBorder: "border border-white/30",
    glow: "",
  },
  [UNIT_STATUS.LOW]: {
    Icon: FaExclamationTriangle,
    surface: "bg-statusLow text-onStatusLow",
    tileBorder: "border-2 border-onStatusLow",
    windowBorder: "border border-onStatusLow",
    glow: "shadow-[0_0_12px_1px_rgb(250_204_21/0.5)]",
  },
  [UNIT_STATUS.OK]: {
    Icon: FaTint,
    surface: "bg-statusOk text-onStatusOk",
    tileBorder: "border-2 border-transparent",
    windowBorder: "border border-white/30",
    glow: "",
  },
};
