import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  "#e8eef7",
          100: "#b8cbea",
          200: "#7a9bcc",
          300: "#4466aa",
          400: "#2a4a8a",
          500: "#1a3672",
          600: "#162e5e",
          700: "#112650",
          800: "#0d1f3c",
          900: "#0a1628",
          950: "#060e1a",
        },
        gold: {
          50:  "#fef8e0",
          100: "#fdeaa0",
          200: "#f9d470",
          300: "#f5c040",
          400: "#e8a820",
          500: "#d4900a",
          600: "#b87700",
          700: "#9a6200",
          800: "#7a4e00",
          900: "#5c3a00",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Georgia", "ui-serif", "serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-navy": "linear-gradient(135deg, #0a1628 0%, #1a3672 100%)",
        "gradient-gold": "linear-gradient(135deg, #d4900a 0%, #f5c040 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
