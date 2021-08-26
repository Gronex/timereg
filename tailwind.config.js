module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
        './**/*.html',
        './**/*.razor'
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
