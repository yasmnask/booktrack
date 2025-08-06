import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        table:
          "-137px 153px 58px 0px rgba(17, 74, 100, 0.00), -88px 98px 53px 0px rgba(17, 74, 100, 0.00), -49px 55px 44px 0px rgba(17, 74, 100, 0.01), -22px 25px 33px 0px rgba(17, 74, 100, 0.02), -5px 6px 18px 0px rgba(17, 74, 100, 0.02)",
      },
      colors: {
        primary: {
          blue: "#114A65",
          orangeBg: "#D89322",
          orangeText: "#EDA225",
          blackText: "#323233",
          blackWhiteText: "#7C7C80",
          blueWhiteText: "#4A4A4C",
        },
        secondary: {
          whiteTransparent: "rgba(255, 255, 255, 0.5)",
          whiteSemiTransparent: "rgba(255, 255, 255, 0.8)",
          whiteBg: "#F8F8FF",
        },
        tertiary: {
          heading: "#92ACB8",
          desc: "#B5C7CF",
          link: "#416E84",
        },
      },
      fontFamily: {
        primary: ["Poppins", "sans-serif"],
      },
      container: {
        screens: {
          sm: "640px",
          md: "880px",
          lg: "1024px",
          xl: "1280px",
        },
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "3rem",
          xl: "4rem",
          "2xl": "5rem",
        },
      },
      margin: {
        standart: "1.75rem", // 28px margin-bottom
      },
    },
  },
  plugins: [],
} satisfies Config;
