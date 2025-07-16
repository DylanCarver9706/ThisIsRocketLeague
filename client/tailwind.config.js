/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "rocket-orange": "#FF6B35",
        "rocket-blue": "#1E3A8A",
        "rocket-gray": "#1F2937",
        "rocket-light": "#F3F4F6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
  important: true,
};
