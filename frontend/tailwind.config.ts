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
        "confetti-fall": "confetti-fall 2s ease-out forwards",
        "success-circle-draw": "success-circle-draw 0.5s ease-out forwards",
        "success-check-draw": "success-check-draw 0.3s ease-out 0.4s forwards",
        "burst": "burst 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
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
        "confetti-fall": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
        "success-circle-draw": {
          "0%": { strokeDashoffset: "283" },
          "100%": { strokeDashoffset: "0" },
        },
        "success-check-draw": {
          "0%": { strokeDashoffset: "60" },
          "100%": { strokeDashoffset: "0" },
        },
        "burst": {
          "0%": { transform: "translateX(-50%) rotate(var(--rotation)) scaleY(0)", opacity: "1" },
          "100%": { transform: "translateX(-50%) rotate(var(--rotation)) scaleY(1)", opacity: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
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

