/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'

export default {
  content: [
      "./*.html",
      "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
