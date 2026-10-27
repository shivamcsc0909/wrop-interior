/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F5F2EC',
          light: '#FAF9F6',
          dark: '#EBE5D8',
        },
        charcoal: {
          DEFAULT: '#292824',
          light: '#3D3B35',
          dark: '#1D1C19',
        },
        beige: {
          DEFAULT: '#D6C8B5',
          light: '#E5DCce',
          dark: '#C4B29B',
        },
        olive: {
          DEFAULT: '#797B6B',
          light: '#919483',
          dark: '#626456',
        },
        terracotta: {
          DEFAULT: '#A76F55',
          light: '#BE856A',
          dark: '#8E5A42',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
        ultra: '0.25em',
      },
      height: {
        'svh': '100svh',
        'dvh': '100dvh',
      }
    },
  },
  plugins: [],
}
