/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        '6' : '4rem',
        '12': '8rem',
        '18': '12rem',
        '24': '16rem',
        '30': '20rem',
      },
    },
  },
  plugins: [],
};
