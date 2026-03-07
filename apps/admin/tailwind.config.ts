import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}', './hooks/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0C0A09', charcoal: '#1A1816', stone: '#2A2723', warm: '#2E2B28',
        muted: '#9E9992', cream: '#FCFBF9', gold: '#C9A84C',
        success: '#4CAF7D', danger: '#E05D5D', warning: '#E0A84C',
      },
    },
  },
  plugins: [],
};

export default config;
