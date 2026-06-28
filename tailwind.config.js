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
          base:     'rgb(var(--c-bg-base) / <alpha-value>)',
          surface:  'rgb(var(--c-bg-surface) / <alpha-value>)',
          elevated: 'rgb(var(--c-bg-elevated) / <alpha-value>)',
        },
        border: {
          subtle: 'rgb(var(--c-border-subtle) / <alpha-value>)',
          strong: 'rgb(var(--c-border-strong) / <alpha-value>)',
        },
        text: {
          primary:   'rgb(var(--c-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--c-text-secondary) / <alpha-value>)',
          muted:     'rgb(var(--c-text-muted) / <alpha-value>)',
        },
        accent: {
          indigo: 'rgb(var(--c-accent) / <alpha-value>)',
          violet: 'rgb(var(--c-accent-soft) / <alpha-value>)',
          cyan:   'rgb(var(--c-accent-muted) / <alpha-value>)',
          pink:   'rgb(var(--c-accent-faint) / <alpha-value>)',
        },
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          danger:  '#ef4444',
          info:    '#3b82f6',
        },
      },
      boxShadow: {
        'glow-indigo': '0 0 40px -10px rgba(var(--c-accent) / 0.2)',
        'glow-violet': '0 0 40px -10px rgba(var(--c-accent-soft) / 0.15)',
        'glow-cyan':   '0 0 40px -10px rgba(var(--c-accent-muted) / 0.12)',
        'glow-strong': '0 0 60px -8px rgba(var(--c-accent) / 0.25)',
        'glow-danger': '0 0 40px -10px rgba(239 68 68 / 0.4)',
        'card':    '0 4px 24px -8px rgba(0,0,0,0.15)',
        'card-lg': '0 12px 48px -12px rgba(0,0,0,0.2)',
      },
      animation: {
        'fade-in':   'fadeIn 0.3s ease-out',
        'slide-up':  'slideUp 0.4s ease-out',
        'pulse-slow':'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':     'float 6s ease-in-out infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float:   { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
};
