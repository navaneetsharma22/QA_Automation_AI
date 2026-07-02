/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          'bg-main': 'var(--theme-bg-main)',
          'bg-card': 'var(--theme-bg-card)',
          'card': 'var(--theme-bg-card)',
          'bg-card-hover': 'var(--theme-bg-card-hover)',
          'card-hover': 'var(--theme-bg-card-hover)',
          'input': 'var(--theme-bg-input)',
          'primary': 'var(--theme-text-primary)',
          'secondary': 'var(--theme-text-secondary)',
          'text-primary': 'var(--theme-text-primary)',
          'text-secondary': 'var(--theme-text-secondary)',
          'accent-yellow': 'var(--theme-accent-yellow)',
          border: 'var(--theme-border)'
        }
      },
      boxShadow: {
        '2xl': 'none',
        'xl': 'none',
        'lg': 'none',
      }
    },
  },
  plugins: [],
}
