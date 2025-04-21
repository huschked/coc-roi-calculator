/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',  // blue‑600
        accent:  '#10b981',  // emerald‑500
      },
    },
  },
  plugins: [],
};
