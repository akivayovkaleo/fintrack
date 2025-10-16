/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E20074',               
        'primary-dark': '#B8005F',
        'background-primary': '#FFFFFF',
        'background-secondary': '#F3F4F6',  
        'text-primary': '#111827',          
        'text-secondary': '#4B5563',        
        border: '#D1D5DB',                  
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

