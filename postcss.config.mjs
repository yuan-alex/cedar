/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {
      theme: {
        extend: {
          fontFamily: {
            sans: ["var(--font-inter)"],
            mono: ["var(--font-roboto-mono)"],
          },
        },
      },
    },
  },
};

export default config;
