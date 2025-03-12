import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0070f3',
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0070f3',
          600: '#0057c0',
          700: '#003e8e',
          800: '#00255b',
          900: '#000c29',
        },
        secondary: {
          DEFAULT: '#7928ca',
          50: '#f5e9ff',
          100: '#e0c3ff',
          200: '#cc9dff',
          300: '#b777ff',
          400: '#a351ff',
          500: '#8f2bff',
          600: '#7928ca',
          700: '#5c1e9e',
          800: '#3f1471',
          900: '#220a45',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
};

export default config;