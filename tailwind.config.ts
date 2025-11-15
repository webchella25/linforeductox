import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary-color, #2C5F2D)",
          dark: "var(--primary-dark, #1e3d1f)",
        },
        secondary: {
          DEFAULT: "var(--secondary-color, #A27B5C)",
          light: "var(--secondary-light, #b89171)",
        },
        cream: "var(--cream-color, #F5F1E8)",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;