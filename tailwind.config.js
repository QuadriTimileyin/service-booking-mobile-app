/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          soft: '#EFF6FF',
        },
        ink: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F1F5F9',
          page: '#F8FAFC',
        },
        line: '#E2E8F0',
        success: '#16A34A',
        danger: '#DC2626',
      },
      borderRadius: {
        card: '20px',
        control: '14px',
      },
    },
  },
  plugins: [],
};
