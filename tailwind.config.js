export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        regular: ['var(--font-regular)', 'sans-serif'],
        medium: ['var(--font-medium)', 'sans-serif'],
        semibold: ['var(--font-semibold)', 'sans-serif'],
        bold: ['var(--font-bold)', 'sans-serif'],
      },
       scrollbar: {
        thin: {
          width: '4px',
          height: '4px',
        },
      },
      colors: {
        primary: 'var(--color-primary)',
        'dark-100': 'var(--color-dark-100)',
        'dark-200': 'var(--color-dark-200)',
        'light-100': 'var(--color-light-100)',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}