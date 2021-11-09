module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    debugScreens: {
      position: ["top", "right"],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-debug-screens"),
    require("tailwindcss-logical"),
  ],
};