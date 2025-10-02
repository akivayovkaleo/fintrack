/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NOVO TEMA CLARO
        primary: '#E935C1',               // Um magenta mais vibrante e forte
        'primary-dark': '#C125A2',          // Versão mais escura para hover
        'background-primary': '#FFFFFF',    // Fundo branco predominante
        'background-secondary': '#F9FAFB',  // Um cinza muito claro para seções
        'text-primary': '#111827',          // Texto preto (cinza bem escuro) para contraste
        'text-secondary': '#6B7280',        // Texto secundário cinza
        border: '#E5E7EB',                  // Borda cinza clara
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
