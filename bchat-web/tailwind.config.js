/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'wander-1': 'wander 10s ease-in-out infinite alternate',
        'wander-2': 'wander 12s ease-in-out infinite alternate-reverse',
        'wander-3': 'wander 15s ease-in-out infinite alternate',
        'wander-slow-1': 'wander 20s ease-in-out infinite alternate',
        'wander-slow-2': 'wander 25s ease-in-out infinite alternate-reverse',
      },
      keyframes: {
        wander: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}