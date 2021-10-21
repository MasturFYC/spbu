module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: false, // or 'media' or 'class'
   theme: {
     extend: {},
   },
  variants: {
    extend: {
       // opacity: ['disabled'],
       borderStyle: ['responsive', 'hover'],
       backgroundColor: ['active'],
       borderWidth: ['responsive', 'hover', 'focus'],
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
