import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' }, screens: { '2xl': '1200px' } },
    extend: {
      colors: {
        // Public site (dark tech theme)
        surface: { DEFAULT: '#060913', card: '#0B0F19', raised: '#111827' },
        glow: { cyan: '#00F0FF', blue: '#3B82F6', violet: '#8B5CF6' },
        // CMS (light theme) — original scales, unchanged so /admin keeps working
        brand: {
          50: '#eefaf7', 100: '#d3f2ea', 200: '#a3e4d4', 300: '#6dd0ba', 400: '#3bb49c',
          500: '#1f9781', 600: '#167a68', 700: '#146254', 800: '#134f45', 900: '#12423a', 950: '#06251f',
        },
        accent: {
          50: '#fff8ec', 100: '#ffedc9', 200: '#ffd88d', 300: '#ffbe50', 400: '#ffa322',
          500: '#f8850a', 600: '#dc6205', 700: '#b64408', 800: '#93350d', 900: '#792d0e',
        },
        ink: {
          50: '#f6f7f8', 100: '#eceef0', 200: '#d5d9dd', 300: '#b4bac0', 400: '#7d8790',
          500: '#626c75', 600: '#4a545c', 700: '#38424a', 800: '#242a2e', 900: '#15191c',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-fira)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: { xl: '1rem', '2xl': '1.5rem' },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 240, 255, 0.5)' },
        },
      },
      animation: { 'pulse-glow': 'pulse-glow 3s ease-in-out infinite' },
    },
  },
  plugins: [],
};

export default config;
