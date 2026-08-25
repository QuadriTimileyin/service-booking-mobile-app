const { colors, radius } = require('./src/shared/config/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      borderRadius: radius,
    },
  },
  plugins: [],
};
