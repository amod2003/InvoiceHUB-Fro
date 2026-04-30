/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: {
          base: '#0a0a0f',
          surface: '#13131a',
          elevated: '#1c1c26',
        },
        border: {
          subtle: '#2a2a36',
          strong: '#3a3a4a',
        },
        text: {
          primary: '#f5f5fa',
          secondary: '#c8c8d4',
          muted: '#8a8a98',
        },
        accent: {
          indigo: '#6366f1',
          violet: '#a855f7',
          cyan: '#06b6d4',
          pink: '#ec4899',
        },
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#3b82f6',
        },
      },
      boxShadow: {
        'glow-indigo': '0 0 40px -10px rgba(99, 102, 241, 0.6)',
        'glow-violet': '0 0 40px -10px rgba(168, 85, 247, 0.6)',
        'glow-cyan': '0 0 40px -10px rgba(6, 182, 212, 0.6)',
        'card': '0 4px 24px -8px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)',
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
