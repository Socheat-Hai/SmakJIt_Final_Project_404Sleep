/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#1D9E75',
          'green-light': '#e8f8f2',
          'green-dark': '#15805e',
          purple: '#534AB7',
          'purple-light': '#f0eeff',
          'purple-dark': '#4239a0',
          'warm-white': '#F8F7F4',
        },
      },
      fontFamily: {
        'irish': ['"Irish Grover"', 'cursive'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],

  
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
        lg: '16px',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};
