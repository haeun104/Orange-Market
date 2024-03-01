/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-orange": "#ff8911",
        "accent-purple": "#713ABE",
        "accent-grey": "#C7C8CC",
      },
    },
  },
  plugins: [],
};
