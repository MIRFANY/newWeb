/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef3fb',
          100: '#d5e2f4',
          200: '#aec4ea',
          300: '#7ea1db',
          400: '#5580cc',
          500: '#3461bc',
          600: '#2450a5',
          700: '#1a3c6e',  // AICTE deep blue – primary
          800: '#152f57',
          900: '#0f2240',
        },
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        status: {
          pending:     '#f59e0b',
          underprocess:'#3b82f6',
          disposed:    '#10b981',
          transferred: '#8b5cf6',
          escalated:   '#ef4444',
        },
        alert: {
          overlap:    '#f97316',
          sla:        '#ef4444',
          escalation: '#dc2626',
          pending:    '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
        'card-md': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
      },
    },
  },
  plugins: [],
}
