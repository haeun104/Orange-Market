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
        "hero-bg-image": "url('/hero-bg-image-lg.jpg')",
        "hero-bg-image-sm": "url('/hero-bg-image-lg.jpg')",
      },
      height: {
        "calc-vh-minus-64": "calc(100vh - 64px)",
      },
      keyframes: {
        homeImages: {
          "0%, 100%": { backgroundImage: "url('/laptop.jpg')" },
          "33.33%": { backgroundImage: "url('/photobymobile.jpg')" },
          "66.66%": { backgroundImage: "url('/parcel.jpg')" },
        },
        homeImagesSm: {
          "0%, 100%": { backgroundImage: "url('/laptop-sm.jpg')" },
          "33.33%": { backgroundImage: "url('/photobymobile-sm.jpg')" },
          "66.66%": { backgroundImage: "url('/parcel-sm.jpg')" },
        },
      },
      animation: {
        homeImages: "homeImages 9s ease-in-out infinite",
        homeImagesSm: "homeImagesSm 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
