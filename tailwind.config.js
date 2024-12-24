const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], // Adjust paths as needed
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#1DA1F2', // Định nghĩa lại màu "primary"
        secondary: '#14171A', // Thêm màu "secondary"
      },
    },
  },
  plugins: [],
};