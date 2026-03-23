import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        clash: ['var(--font-clash)', 'sans-serif'],
        satoshi: ['var(--font-satoshi)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink: '#08080f',
        ink2: '#0e0e1c',
        ink3: '#151528',
        ink4: '#1c1c35',
        neon: '#39ff9f',
        neon2: '#ff3977',
        sky: '#38b6ff',
        gold: '#ffd166',
        lav: '#a78bfa',
        dim: '#6b6b99',
        dim2: '#3d3d66',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 0.8s linear infinite',
        'fade-up': 'fadeUp 0.5s ease both',
        'log-in': 'logIn 0.35s ease both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        logIn: {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to: { opacity: '0.75', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
