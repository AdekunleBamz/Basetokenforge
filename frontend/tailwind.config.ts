import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          blue: "#0052FF",
          dark: "#0A0B0D",
          gray: "#1E2025",
        },
        forge: {
          orange: "#FF6B35",
          gold: "#F7C948",
          ember: "#FF4500",
        }
      },
      fontFamily: {
        display: ["var(--font-clash)"],
        body: ["var(--font-satoshi)"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "forge-fire": "forge-fire 1.5s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 107, 53, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 107, 53, 0.8)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "forge-fire": {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.3)" },
        }
      },
    },
  },
  plugins: [],
};

export default config;

