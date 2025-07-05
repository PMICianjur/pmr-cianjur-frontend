/** @type {import('tailwindcss').Config} */
module.exports = {
  // Beri tahu Tailwind di mana saja kelas CSS-nya digunakan
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],

  // Biarkan theme default, tidak perlu diubah
  theme: {
    extend: {},
  },

  // INI BAGIAN PALING PENTING UNTUK MEMPERBAIKI ERROR
  // Nonaktifkan plugin inti yang menghasilkan format warna modern (seperti oklch)
  corePlugins: {
    // Biarkan preflight (CSS reset) aktif jika Anda menginginkannya
    preflight: true,
    
    // Paksa Tailwind untuk menggunakan format warna lama (rgb/hex)
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
  },
  
  plugins: [],
};