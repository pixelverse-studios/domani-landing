/** @type {import('tailwindcss').Config} */
// Import theme colors from centralized theme system
const { tailwindColors } = require('./apps/landing/src/lib/theme/colors');

const config = {
  darkMode: false,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Sage green primary palette (full 50-900 scale)
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#F4F7F5',
          100: '#E8EDE9',
          200: '#D1DBD4',
          300: '#A3BFB0', // light
          400: '#7D9B8A',
          500: '#7D9B8A', // DEFAULT
          600: '#6A8577',
          700: '#5A7765', // dark
          800: '#4A5F53',
          900: '#3D4A44',
        },
        // Alias for semantic clarity
        sage: {
          DEFAULT: '#7D9B8A',
          light: '#A3BFB0',
          dark: '#5A7765',
          50: '#F4F7F5',
          100: '#E8EDE9',
          200: '#D1DBD4',
          300: '#A3BFB0',
          400: '#7D9B8A',
          500: '#7D9B8A',
          600: '#6A8577',
          700: '#5A7765',
          800: '#4A5F53',
          900: '#3D4A44',
        },
        // Priority colors for task management
        priority: {
          high: '#D77A61',    // Coral/Terracotta
          medium: '#E8B86D',  // Golden Amber
          low: '#8B9DAF',     // Blue-Gray
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
      },
      borderColor: {
        DEFAULT: 'hsl(var(--border))',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        abril: ['var(--font-abril)', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

module.exports = config
