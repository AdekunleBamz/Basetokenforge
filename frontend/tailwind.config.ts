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
          light: "#2A2D35",
        },
        forge: {
          orange: "#FF6B35",
          gold: "#F7C948",
          ember: "#FF4500",
          copper: "#B87333",
        }
      },
      fontFamily: {
        display: ["var(--font-clash)"],
        body: ["var(--font-satoshi)"],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "forge-fire": "forge-fire 1.5s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 3s linear infinite",
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
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'forge-gradient': 'linear-gradient(135deg, #FF6B35 0%, #F7C948 100%)',
      },
      boxShadow: {
        'glow-orange': '0 0 30px rgba(255, 107, 53, 0.4)',
        'glow-blue': '0 0 30px rgba(0, 82, 255, 0.4)',
        'glow-gold': '0 0 30px rgba(247, 201, 72, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;

