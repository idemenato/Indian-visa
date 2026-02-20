/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.tsx",
    "./*.ts",
    "./views/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}
