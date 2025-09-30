/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Adicione suas cores customizadas aqui
      colors: {
        primary: '#3b82f6', // Exemplo: um tom de azul
        secondary: '#1d4ed8', // Exemplo: um tom de azul mais escuro
      },
    },
  },
  plugins: [],
};