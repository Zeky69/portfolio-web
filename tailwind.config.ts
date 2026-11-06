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
        // Braise + lilas
        accent: "#FF5A1F",
        "accent-light": "#FF8A5C",
        "accent-dark": "#D9400D",
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
