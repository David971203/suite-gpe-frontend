const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/dist/esm/**/*.js',
    flowbite.content(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    strictRelativePaths: true,
  },
  theme: {
        extend: {
            colors: {
                primary: {
                  50: '#E7F2F6',
                  90: 'rgba(67,123,154,0.43)',
                  100: '#CFE5ED',
                  200: '#B7D8E3',
                  300: '#9FCBDA',
                  400: '#87BFD1',
                  500: '#3E98B5',
                  600: '#268BAC',
                  700: '#0E7EA3',
                  800: '#0A5872',
                  900: '#084C62',
                },
            },
        },
    },
  plugins: [ flowbite.plugin()],
}

