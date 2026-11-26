import { useTranslation } from "react-i18next";
import WaveBackdrop from "../../../ui/WaveBackdrop";
import BuildingTower from "./BuildingTower";

const FAR_BUILDINGS = [
  { x: 0, width: 46, height: 70 },
  { x: 52, width: 34, height: 110 },
  { x: 92, width: 54, height: 84 },
  { x: 152, width: 30, height: 130 },
  { x: 188, width: 48, height: 96 },
  { x: 242, width: 38, height: 118 },
  { x: 286, width: 56, height: 76 },
];
const FAR_SKYLINE_WIDTH = 342;

const CLOUDS = [
  "start-[8%] top-[14%] h-[26px] w-[90px] [animation-delay:0s]",
  "start-[46%] top-[8%] h-[20px] w-[70px] [animation-delay:1.4s]",
  "start-[72%] top-[24%] h-[24px] w-[100px] [animation-delay:2.6s]",
];

function SkylineScene({ tiles }) {
  const [t] = useTranslation();

  return (
    <section
      aria-label={t("map.view.skyline")}
      className="relative overflow-hidden rounded-3xl border border-line bg-buildingSky shadow-card"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-accent/25 via-transparent to-transparent"
      />
      <span
        aria-hidden="true"
        className="absolute end-[7%] top-[26px] h-[54px] w-[54px] rounded-full bg-white/80 shadow-[0_0_60px_22px_rgb(255_255_255/0.45)]"
      />
      {CLOUDS.map((position) => (
        <span
          key={position}
          aria-hidden="true"
          className={`absolute animate-float-y rounded-full bg-white/60 blur-[1px] motion-reduce:animate-none ${position}`}
        />
      ))}

      <svg
        aria-hidden="true"
        viewBox={`0 0 ${FAR_SKYLINE_WIDTH} 140`}
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-[70px] h-[170px] w-full text-buildingEdge opacity-30"
      >
        {FAR_BUILDINGS.map(({ x, width, height }) => (
          <rect
            key={x}
            x={x}
            y={140 - height}
            width={width}
            height={height}
            rx="3"
            fill="currentColor"
          />
        ))}
      </svg>

      <div className="relative overflow-x-auto overflow-y-hidden">
        <div className="relative flex w-max min-w-full items-end gap-[34px] px-[34px] pb-[26px] pt-[170px]">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[96px] bg-gradient-to-b from-accent/40 to-colorBrand/70"
          >
            <WaveBackdrop className="-top-[20px] h-[40px]" tone="text-accent" />
          </div>
          {tiles.map((tile, index) => (
            <BuildingTower
              key={tile.building._id}
              tile={tile}
              delayIndex={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkylineScene;
