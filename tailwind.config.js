// eslint-disable-next-line no-undef
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat"],
        roboto: ["Roboto"],
      },
      colors: {
        primary: "#FF2943", // #FF2943 - #EF233C
        "primary-light": "#D90429",
        secondary: "#2172a4",
        "secondary-highlight": "#30a9f3",
        disabled: "#707374",
        "bg-light": "#8D99AE",
        bg: "#2B2D42",
        "body-bg": "#202125",
        "blackjack-light": "#287d31",
        "blackjack-dark": "#216528",
      },
    },
  },
  plugins: [],
};
