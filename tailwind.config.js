/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['"Noto Sans SC"', 'sans-serif'],
      },
      colors: {
         // Add prototype colors if needed, but Tailwind defaults are usually close enough. 
         // Prototype uses text-gray-800, gray-500, purple-600 etc which are standard.
      }
    },
  },
  plugins: [],
}
