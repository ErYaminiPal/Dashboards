/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          0: '#020617',
          1: '#0F172A',
          2: '#0B1226',
        },
        brand: {
          primary: '#4F46E5',
          primary2: '#3B82F6',
          accent: '#22D3EE',
          accent2: '#A78BFA',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        ink: {
          DEFAULT: '#E2E8F0',
          dim: '#94A3B8',
          faint: '#64748B',
        },
      },
      backgroundImage: {
        'grad-primary': 'linear-gradient(135deg, #4F46E5, #3B82F6)',
        'grad-ai':      'linear-gradient(135deg, #4F46E5, #22D3EE)',
        'grad-avatar':  'linear-gradient(135deg, #A78BFA, #4F46E5)',
        'grad-funnel':  'linear-gradient(90deg, #4F46E5, #22D3EE)',
      },
      boxShadow: {
        'glow-primary': '0 10px 30px -10px rgba(59,130,246,0.7), inset 0 1px 0 rgba(255,255,255,0.2)',
        'glow-ai':      '0 0 24px rgba(167,139,250,0.7), inset 0 0 12px rgba(255,255,255,0.4)',
        'glow-card':    '0 30px 80px -30px rgba(79,70,229,0.40)',
        'glow-anomaly': '0 0 30px -10px rgba(239,68,68,0.4)',
      },
      keyframes: {
        drift:   { '0%,100%': { transform: 'translate3d(0,0,0)' }, '50%': { transform: 'translate3d(30px,-20px,0)' } },
        pulse2:  { '0%,100%': { boxShadow: '0 0 0 0 rgba(16,185,129,0.6)' }, '70%': { boxShadow: '0 0 0 8px rgba(16,185,129,0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-3px)' } },
        msgIn:   { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        drift:  'drift 30s ease-in-out infinite',
        pulse2: 'pulse2 1.8s infinite',
        float:  'float 4s ease-in-out infinite',
        msgIn:  'msgIn 0.4s ease',
      },
    },
  },
  plugins: [],
};
