/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        Primary: {
          DEFAULT: "#E20046",
        },
        Purple: {
          DEFAULT: "#7F276B",
          50: "#FF3D79",
        },
        Black: {
          DEFAULT: "#0A0A0A",
        },
        Warning: {
          DEFAULT: "#FEBE3F",
        },
        Muted: {
          DEFAULT: "#6C7278",
          50: "#D9D9D9",
        },
        Border: {
          DEFAULT: "#EDF1F3",
        },
        Danger: {
          DEFAULT: "#ef4444",
        },
      },
      fontSize: {
        xs: ["12px", { lineHeight: "150%" }],
        sm: ["14px", { lineHeight: "18px" }],
        md: ["24px", { lineHeight: "34px" }],
        lg: ["32px", { lineHeight: "130%" }],
        xl: ["40px", { lineHeight: "130%" }],
        "2xl": ["48px", { lineHeight: "130%" }],
        "3xl": ["64px", { lineHeight: "130%" }],
        "4xl": ["80px", { lineHeight: "130%" }],
        "5xl": ["96px", { lineHeight: "130%" }],
        "6xl": ["128px", { lineHeight: "130%" }],
        "7xl": ["160px", { lineHeight: "130%" }],
        "8xl": ["192px", { lineHeight: "130%" }],
        "9xl": ["256px", { lineHeight: "130%" }],
      },
    },
  },
  plugins: [],
};
