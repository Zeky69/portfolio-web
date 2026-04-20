import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-archivo)", "sans-serif"],
        body: ["var(--font-space-grotesk)", "sans-serif"],
      },
      colors: {
        // Neutral dark — charbon neutre, pas de teinte chaude
        bg: "#0B0B0C",
        surface: "#141416",
        "surface-hover": "#1C1C20",
        border: "#26262A",
        "border-hover": "#363640",
        // Terracotta signature (accent uniquement)
        accent: "#D35F3E",
        "accent-light": "#E5825F",
        "accent-dark": "#B04828",
        // Texte papier légèrement chaud (pairing propre avec terracotta)
        text: "#ECE6DA",
        muted: "#787883",
        "muted-light": "#A0A0AB",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-size": "72px 72px",
      },
    },
  },
  plugins: [],
};

export default config;
