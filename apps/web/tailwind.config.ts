import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-prompt)', 'var(--font-inter)', 'sans-serif'],
      },
      colors: {
        primary: '#0056B3',
        secondary: '#F0A500',
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        info: '#17A2B8',
      },
    },
  },
  plugins: [],
};

export default config;
