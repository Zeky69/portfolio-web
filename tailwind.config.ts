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
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        heading: ["var(--font-geist)", "system-ui", "sans-serif"],
        body: ["var(--font-geist)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // Encre — vrai noir, surfaces à peine relevées
        bg: "#000000",
        surface: "#0B0B0F",
        "surface-hover": "#121218",
        border: "#1C1C24",
        "border-hover": "#2E2E3A",
        // Signal — outremer électrique + glace
        accent: "#5B5BFF",
        "accent-light": "#9A9AFF",
        "accent-dark": "#3A3AD9",
        ice: "#9EF0FF",
        // Papier froid
        text: "#EEF0F5",
        muted: "#80828F",
        "muted-light": "#AEB0BC",
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
