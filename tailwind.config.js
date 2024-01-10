/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{tsx,ts}'
  ],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        lg: '3vw',
        xl: '8vw'
      }
    },
    extend: {
      fontFamily: {
        icons: 'var(--font-icons)'
      },
      gridTemplateRows: {
        'auto-full': 'auto 1fr',
      },
      gridTemplateColumns: {
        '3-5': '3fr 5fr',
        '2-1': '2fr 1fr',
      },
      height: {
        '100svh': '100svh'
      },
      minWidth: {
        'btn-square': '42px',
      },
      minHeight: {
        'details-info': '200px',
        'textarea': '140px',
        'error-msg': '1rem',
        'btn-square': '42px',
        'recipe-item-sm': '15rem',
        'recipe-item-md': '28rem'
      },
      spacing: {
        'input-square-offset': '54px'
      },
      boxShadow: {
        'form-element': '0 0 0 0.25rem #19875470',
        'dd': '0 0 2px 2px rgba(70, 70, 70, 0.7)',
        'alert': '0 0 3px 1px rgba(120, 120, 120, 0.5)',
        'modal': '0 0 10px 5px rgba(120, 120, 120, 0.2)'
      },
      colors: {
        'green': '#198754',
        'green-hover': '#136841',
        'green-active': '#104a2f',
        'green-shadow': 'rgb(231 255 225 / 35%)',
        'green-light': 'rgb(228, 247, 238)',
        'dark-green-shadow': 'rgba(7, 71, 27, 0.7)',
        'red': '#dc3545',
        'red-hover': '#bb2d3b',
        'red-active': '#b02a37',
        'red-light': '#ffdede',
        'white-shadow': '#ffffff5c',
        'white-overlay': '#ffffffb8',
        'skeleton-gray': '#f3f4f6'
      },
      transitionProperty: {
        'hidden-btn': 'visibility, opacity, border, color, background-color'
      },
      aspectRatio: {
        '2/3': '2/3'
      },
      lineClamp: {
        12: '12'
      },
      animation: {
        'fadeUp': 'fadeUp .3s ease-in-out;',
        'fadeIn': 'fadeIn .5s ease-in-out',
        'fadeInFast': 'fadeIn .2s ease-in-out',
        'slideUp': 'slideUp .3s ease-in-out',
        'flicker': 'flicker .7s ease-in-out infinite alternate',
        'flicker-reverse': 'flicker 0.7s ease-in-out infinite alternate-reverse',
        'recipe-details-bg': 'green-bg .5s ease-in-out forwards'
      },
      keyframes: ({theme}) => ({
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fadeUp': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' }
        },
        'slideUp': {
          '0%': { transform: 'translateY(-16px)' },
          '100%': { transform: 'translateY(0px)' }
        },
        'flicker': {
          '0%': { backgroundColor: theme('colors.skeleton-gray')},
          '100%': { backgroundColor: '#fff' },
        },
        'spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'green-bg': {
          '0%': { backgroundColor: theme('colors.dark-green-shadow')},
          '100%': { backgroundColor: '#fff'}
        }
      })
    }
  },
    plugins: [],
  }

