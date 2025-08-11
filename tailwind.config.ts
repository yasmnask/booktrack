import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        table:
          "-137px 153px 58px 0px rgba(17, 74, 100, 0.00), -88px 98px 53px 0px rgba(17, 74, 100, 0.00), -49px 55px 44px 0px rgba(17, 74, 100, 0.01), -22px 25px 33px 0px rgba(17, 74, 100, 0.02), -5px 6px 18px 0px rgba(17, 74, 100, 0.02)",
      },
      colors: {
        // Warna kustom untuk gradasi dan border kartu
        cardLightFrom: "#FFFFFF", // Putih
        cardLightTo: "#E0F2F7", // Biru sangat terang (untuk gradasi)
        cardLightBorder: "#275DDB", // Biru (untuk border)

        cardDarkFrom: "#1A2B40", // Biru tua (untuk gradasi)
        cardDarkTo: "#0E0E0E", // Hitam (untuk gradasi)
        cardDarkBorder: "#B9D1F3", // Biru terang (untuk border mengkilap)

        // Warna yang sudah ada (dari shadcn/ui dan kustom Anda)
        red: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          950: "#450A0A",
        },
        yellow: {
          400: "#FACC15",
        },
        green: {
          600: "#16A34A",
        },
        // Default shadcn/ui colors (pastikan ini ada jika Anda menggunakannya di tempat lain)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
