/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bowlby: ["Bowlby One SC", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "16px",
          sm: "16px",
          md: "32px",
          lg: "64px",
          xl: "86px",
        },
      },

      screens: {
        lg: "1366px",
        xl: "1366px",
      },

      colors: {
        primary: "#CF4647",
        secondary: "#1D2427",
        white: "#F8F6F6",
        actionyellow: "#FFD568",
        actionpink: "#FFDBDC",
      },
    },
  },
  plugins: [],
};
