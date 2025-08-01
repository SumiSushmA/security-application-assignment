const defaultTheme = require('tailwindcss/defaultTheme');
const daisyui = require('daisyui');

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        gilroy: ['"Gilroy Regular"', 'Poppins', 'Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        gilroyLight: ['"Gilroy Light"', 'Poppins', 'Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        gilroyMedium: ['"Gilroy Medium"', 'Poppins', 'Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        gilroySemiBold: ['"Gilroy SemiBold"', 'Poppins', 'Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        gilroyBold: ['"Gilroy Bold"', 'Poppins', 'Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        ppMori: ['"PP mori"', 'Poppins', 'Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"],
  },
};
