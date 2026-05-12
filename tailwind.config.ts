import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#178248",
          leaf: "#42a865",
          citrus: "#f5b33f",
          gold: "#d89423",
          ink: "#23352c",
          paper: "#fffaf0",
        },
      },
      boxShadow: {
        soft: "0 18px 60px rgba(35, 53, 44, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
