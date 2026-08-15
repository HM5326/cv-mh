/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1C1C1E',
          soft: '#252528',
          deep: '#121214',
        },
        coral: {
          DEFAULT: '#E8634A',
          hover: '#D0523A',
          light: '#FF7A61',
          glow: 'rgba(232, 99, 74, 0.25)',
        },
        snow: {
          DEFAULT: '#FAFAFA',
          pure: '#FFFFFF',
          muted: '#F0F0F2',
        },
        graphite: {
          DEFAULT: '#2D2D2D',
          muted: '#5A5A60',
          light: '#8E8E93',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'architect': '0 20px 40px -15px rgba(28, 28, 30, 0.07)',
        'architect-hover': '0 30px 60px -20px rgba(232, 99, 74, 0.15)',
        'glow-coral': '0 0 35px rgba(232, 99, 74, 0.35)',
      },
      borderRadius: {
        '4xl': '2.5rem',
        '5xl': '3rem',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
