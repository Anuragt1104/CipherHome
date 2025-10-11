/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dawn: {
          50: '#fef3f2',
          100: '#fee5e2',
          200: '#fecfca',
          300: '#fdaea5',
          400: '#fa7f71',
          500: '#f25445',
          600: '#df3728',
          700: '#bc2b1e',
          800: '#9c271c',
          900: '#81271e',
        },
      },
    },
  },
  plugins: [],
};
