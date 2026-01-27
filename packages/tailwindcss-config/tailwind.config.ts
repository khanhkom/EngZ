import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      colors: {
        // Saladict Primary: Professional Blue (NO PURPLE)
        saladict: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff',
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766',
        },
        // Semantic colors
        success: {
          50: '#f6ffed',
          500: '#52c41a',
          700: '#389e0d',
        },
        warning: {
          50: '#fffbe6',
          500: '#faad14',
          700: '#d48806',
        },
        error: {
          50: '#fff2f0',
          500: '#ff4d4f',
          700: '#cf1322',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'scale-in': 'scaleIn 150ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} as Omit<Config, 'content'>;
