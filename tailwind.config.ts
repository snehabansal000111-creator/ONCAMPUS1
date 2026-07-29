import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        muted: "#64748B",
        faint: "#94A3B8",
        surface: "#F7F9FC",
        card: "#FFFFFF",
        border: "rgba(15,23,42,0.08)",
        primary: {
          50: "#EEF3FF",
          100: "#DCE6FF",
          200: "#B8CDFF",
          300: "#8AACFF",
          400: "#5A81FF",
          500: "#2E5EFF",
          600: "#1E45E0",
          700: "#1735AD",
          800: "#132C86",
          900: "#101F5C",
        },
        cyan: {
          50: "#ECFDFE",
          100: "#CFF9FB",
          200: "#9EF0F5",
          300: "#5FE0E9",
          400: "#2FCBD8",
          500: "#14C7D8",
          600: "#0D9DAB",
          700: "#0B7C88",
          800: "#0C616B",
          900: "#0D4F58",
        },
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl2: "18px",
        xl3: "22px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -8px rgba(15,23,42,0.08)",
        lift: "0 4px 8px rgba(15,23,42,0.04), 0 16px 40px -12px rgba(46,94,255,0.18)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 32px -12px rgba(15,23,42,0.12)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #2E5EFF 0%, #14C7D8 100%)",
        "gradient-radiant": "radial-gradient(120% 120% at 0% 0%, #EEF3FF 0%, #F7F9FC 45%, #ECFDFE 100%)",
        "gradient-path": "linear-gradient(90deg, #2E5EFF 0%, #5FE0E9 50%, #14C7D8 100%)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "draw-path": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite",
        shimmer: "shimmer 2s linear infinite",
        "draw-path": "draw-path 2.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
