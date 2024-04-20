import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  presets: [require("nativewind/preset")],
  plugins: [],

  theme: {
    extend: {
      colors: {
        brand: {
          200: "#00DEEC",
          500: "#0040A0",
          700: "#002966",
        },
        gradient: {
          100: "#31C7E0",
          900: "#333EBE",
        },
      },
    },
  },
} satisfies Config;
