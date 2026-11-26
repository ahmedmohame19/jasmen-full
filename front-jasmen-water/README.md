# Kemetrics Frontend — Smart Water Anytime

React 18, Vite 5, React Router 6, Tailwind CSS 3, TanStack React Query, Axios, socket.io-client, react-i18next (English and Arabic with RTL).

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173. Other scripts: `npm run build`, `npm run lint`, `npm test`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_BASE_URL` | Backend URL used by Axios and the Socket.io connection. Keep the trailing slash. |
| `VITE_USE_MOCK` | `true` runs the app with generated demo data, a fake admin session and simulated live changes. No backend or credentials needed. |

## Buildings map

Page: `/buildings-map` (sidebar item "Buildings map"). It has a hero with a network health ring and one clickable counter per status (they filter the map), a strip of units with possible leaks, and two views stored in `localStorage` (`mapView`):

- Skyline: every building is a tower and every unit is a window coloured by its status, with a hover card (name, room, status, balance). Leaking units blink and the tower roof beacon pulses.
- Cards: every building is a card with a health ring and a water level that follows the share of normal units.

The page also has a legend and a configurable low balance threshold (default 15 percent of the limit).

Status rules, highest priority first:

| Status | Colour | Rule |
| --- | --- | --- |
| Leak suspected | Red, blinking | Flow while the valve is closed, or flow that continues while consumption does not change for the leak stall time (default 2 minutes of device reports). |
| Inactive | Gray | Valve closed, or no device report for the offline time (default 15 minutes). |
| Low balance | Yellow | `limit - consumption` is at or below the threshold share of the limit. |
| Normal | Green | Everything else. |

Every status also has an icon and a text label. The blink is a CSS animation and becomes a static red tile when the system asks for reduced motion.

The backend has no leak or online flag, so both are derived in `getUnitStatus` (`src/utils/unitStatus.js`). All thresholds are named constants at the top of that file.

Clicking a tower or card opens the existing building details page, where each user card shows the same status.

Files: `src/features/buildings/map/` (`BuildingMap`, `MapHero`, `SkylineScene`, `BuildingTower`, `UnitWindow`, `BuildingTile`, `HealthRing`, `AlertsStrip`, `StatusLegend`, `StatusBadge`, data and live hooks) and `src/utils/unitStatus.js`.

## Live updates

`src/context/SocketContext.jsx` owns one shared Socket.io connection. It sends the login token, reconnects with backoff, joins each user's room again after a reconnect and exposes the connection state shown in the header (Live, Reconnecting, Offline, Demo data).

The backend emits `userConsumptionUpdate` to a room per user, so the map joins the room of every listed user. Updates are batched every 300 ms and written once to the React Query cache (`["unitLive"]`), which recolours the map without refetching.

## Brand

The Kemetrics logo is an SVG (`src/ui/KemetricsMark.jsx`, `src/ui/Logo.jsx`, `public/favicon.svg`). The wave animation used on the login hero, dashboard hero, map hero and sidebar is `src/ui/WaveBackdrop.jsx`. Brand copy lives under the `brand` key in `public/Locale/*.json`. Fonts are self-hosted through `@fontsource-variable`: Plus Jakarta Sans for English and Readex Pro for Arabic, imported in `src/main.jsx` and applied per `dir` in `src/index.css`.

## Themes

Three themes: Light (sky blue and white), Dark (navy) and Ocean (deep cyan). The choice is stored in `localStorage` (`theme`) and the first visit follows the system colour scheme. Colours are CSS variables defined per `theme-*` class on `<html>` in `src/index.css` and mapped to Tailwind names in `tailwind.config.js` (`bg-primary`, `bg-secondary`, `text-textColor`, `text-brandText`, `text-mutedText`, `border-line`, status colours). Chart colours come from the same variables through `useChartColors`.

## Tests

`npm test` runs the unit tests for `getUnitStatus` and `getBuildingStatus`.
