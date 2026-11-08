import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-display)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // Encre violacée, jamais un noir plat : le fond WebGL la texture
        bg: "#0B0A10",
        surface: "#14121B",
        "surface-hover": "#1C1925",
        border: "rgba(243,238,230,0.10)",
        "border-hover": "rgba(243,238,230,0.22)",
        // Aurore (vert d'eau) + lilas — l'accent vient d'une variable CSS pour le changer en un seul endroit
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        "accent-light": "#A9F0DF",
        "accent-dark": "#2DB894",
        lilac: "#B7A4FF",
        // Papier crème
        text: "#F3EEE6",
        muted: "#8F8A99",
        "muted-light": "#BDB7C6",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        curtain: "cubic-bezier(0.76, 0, 0.24, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
