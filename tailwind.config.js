/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{tsx, ts}'
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        'auto-full': 'auto 1fr'
      },
      gridTemplateColumns: {
        '3-5': '3fr 5fr'
      },
      minWidth: {
        'btn-square': '42px',
      },
      minHeight: {
        'recipe-item': '200px',
        'error-msg': '1rem'
      },
      spacing: {
        'input-square-offset': '54px'
      },
      boxShadow: {
        'form-element': '0 0 0 0.25rem #19875470',
        'dd': '0 0 2px 2px rgba(70, 70, 70, 0.7)'
      },
      colors: {
        'green': '#198754',
        'green-hover': '#136841',
        'green-active': '#104a2f',
        'green-shadow': '#19875470',
        'dark-green-shadow': 'rgba(7, 71, 27, 0.7)',
        'green-light': 'rgb(237, 253, 241)',
        'red': '#dc3545',
        'red-hover': '#bb2d3b',
        'red-active': '#b02a37',
        'white-shadow': '#ffffff50'
      },
      transitionProperty: {
        'hidden-btn': 'visibility, opacity, border, color, background-color'
      }
    }
  },
  plugins: [],
}

