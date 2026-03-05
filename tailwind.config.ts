import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
        citation: ["var(--font-citation)"],
      },
      colors: {
        bg: "#0F0B08",
        panel: "#161008",
        copper: "#B87333",
        copperSoft: "#C97B3A",
        copperGlow: "#D4943A",
        ochre: "#CC7722",
        rockDark: "#1A1612",
        rockMid: "#2C2420",
        text: "#F0E6D3",
        muted: "#8E7A63",
        ash: "#8B7D6B",
        colonialCool: "#3A4A5C",
        hydrogenFuture: "#A8D8EA",
      },
      boxShadow: {
        glow: "0 0 24px rgba(184, 115, 51, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
