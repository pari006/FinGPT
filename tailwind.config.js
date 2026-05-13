/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        ink: "#06101f",
        midnight: "#09111f",
        panel: "rgba(12, 24, 43, 0.72)",
        cyan: "#4de0ff",
        mint: "#49f2a7",
        rose: "#ff5e8a",
        amber: "#f8c14a",
      },
      boxShadow: {
        glow: "0 20px 90px rgba(77, 224, 255, 0.18)",
        card: "0 24px 80px rgba(0, 0, 0, 0.32)",
      },
      backgroundImage: {
        "market-grid":
          "linear-gradient(rgba(77,224,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(77,224,255,0.07) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
