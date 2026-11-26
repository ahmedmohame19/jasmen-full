/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["selector", '[data-color-scheme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-grey-50)",
        secondary: "var(--color-grey-0)",
        textColor: "var(--color-grey-900)",
        colorBrand: "rgb(var(--color-brand-rgb) / <alpha-value>)",
        brandText: "var(--color-brand-text)",
        mutedText: "var(--color-text-muted)",
        line: "var(--color-border)",
        accent: "rgb(var(--color-accent-rgb) / <alpha-value>)",
        glass: "var(--color-glass)",
        buildingBody: "var(--building-body)",
        buildingEdge: "var(--building-edge)",
        buildingSky: "var(--building-sky)",
        statusLeak: "var(--status-leak-bg)",
        onStatusLeak: "var(--status-leak-fg)",
        statusInactive: "var(--status-inactive-bg)",
        onStatusInactive: "var(--status-inactive-fg)",
        statusLow: "var(--status-low-bg)",
        onStatusLow: "var(--status-low-fg)",
        statusOk: "var(--status-ok-bg)",
        onStatusOk: "var(--status-ok-fg)",
      },
      backgroundImage: {
        "brand-gradient": "var(--gradient-brand)",
        "hero-gradient": "var(--gradient-hero)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        glow: "var(--shadow-glow)",
      },
      keyframes: {
        "wave-drift": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ring-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgb(220 38 38 / 0.55)" },
          "100%": { boxShadow: "0 0 0 14px rgb(220 38 38 / 0)" },
        },
        "leak-blink": {
          "0%, 49%": {
            backgroundColor: "var(--status-leak-bg)",
            boxShadow: "0 0 0 4px var(--status-leak-ring)",
          },
          "50%, 100%": {
            backgroundColor: "var(--status-leak-blink-off)",
            boxShadow: "0 0 0 0 transparent",
          },
        },
      },
      animation: {
        "leak-blink": "leak-blink 1.2s linear infinite",
        "wave-drift": "wave-drift 9s linear infinite",
        "wave-drift-slow": "wave-drift 14s linear infinite",
        "float-y": "float-y 5s ease-in-out infinite",
        "rise-in": "rise-in 0.5s ease-out both",
        "ring-pulse": "ring-pulse 1.4s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
