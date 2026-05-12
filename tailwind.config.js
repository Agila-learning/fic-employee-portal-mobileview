/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#094fbc', // HSL 217 91% 40%
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f7c21c', // HSL 45 93% 54%
          foreground: '#0f172a',
        },
        accent: {
          DEFAULT: '#f7c21c',
          foreground: '#0f172a',
        },
        background: '#f5f7f9', // HSL 210 20% 98%
        foreground: '#0f172a', // HSL 222 47% 11%
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0f172a',
        },
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        success: '#16a34a',
        warning: '#f59e0b',
        destructive: '#dc2626',
        border: '#e2e8f0',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
