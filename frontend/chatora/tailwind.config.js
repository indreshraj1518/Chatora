/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class", // ✅ manual dark mode (perfect for toggle)

  theme: {
    extend: {
      colors: {
        primary: "#f97316",   // orange-500
        secondary: "#ea580c", // orange-600
        bgLight: "#f3f4f6",   // light background
      },
    },
  },

  plugins: [],
};