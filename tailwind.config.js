/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js",
  ],
  theme: {
    extend: {
      colors: {
        "main-orange": "#ff8911",
        "accent-purple": "#713ABE",
        "accent-grey": "#C7C8CC",
      },
      backgroundImage: {
        "hero-bg-image": "url('src/assets/hero-bg-image-lg.jpg')",
      },
      height: {
        "calc-vh-minus-64": "calc(100vh - 64px)",
      },
    },
  },
  plugins: [],
};
