/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ff',
          100: '#b3e7ff',
          200: '#80d6ff',
          300: '#4dc6ff',
          400: '#26b9ff',
          500: '#00BFFF', // electric blue
          600: '#0099e6',
          700: '#0080cc',
          800: '#0066b3',
          900: '#004d99',
        },
        secondary: {
          50: '#e6ffff',
          100: '#b3ffff',
          200: '#80ffff',
          300: '#4dffff',
          400: '#26ffff',
          500: '#00FFFF', // cyan
          600: '#00e6e6',
          700: '#00cccc',
          800: '#00b3b3',
          900: '#009999',
        },
        navy: {
          50: '#e6edf5',
          100: '#b3cce6',
          200: '#80abd6',
          300: '#4d8ac7',
          400: '#2669b7',
          500: '#0048A8',
          600: '#003e8f',
          700: '#003475',
          800: '#00295c',
          900: '#0A1929', // dark navy
        },
        accent: {
          50: '#fff6e6',
          100: '#ffe4b3',
          200: '#ffd280',
          300: '#ffc04d',
          400: '#ffb226',
          500: '#FFA500', // orange
          600: '#e69500',
          700: '#cc8400',
          800: '#b37300',
          900: '#995c00',
        },
        success: {
          500: '#10B981', // green
        },
        warning: {
          500: '#F59E0B', // amber
        },
        error: {
          500: '#EF4444', // red
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(to right, rgba(10, 25, 41, 0.9), rgba(10, 25, 41, 0.7)), url("/src/assets/hero-bg.jpg")',
      },
    },
  },
  plugins: [],
};