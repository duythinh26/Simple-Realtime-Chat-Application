/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    color: {
      red: '#FF033E',
      blue: '#007FFF',
      green: '#1CAC78',
      orange: '#FF5733',
      white: '#ffffff',
      grey: 'dddfe2',
      'primary-black': '#131a1c',
      'secondary-black': '#1b2224',
    },
  },
  plugins: [],
}
