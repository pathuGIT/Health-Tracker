/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-light': '#F5F7FA', // Neutral gray background
        'card-white': '#FFFFFF',
        'primary-blue': '#4F46E5', // Indigo-600 for primary actions/branding
        'primary-hover': '#4338CA', // Indigo-700
        'accent-green': '#10B981', // Emerald-500 for success/accent
        'accent-red': '#EF4444',   // Red-500 for alerts/danger
        'text-dark': '#1F2937',    // Gray-800
        'text-muted': '#6B7280',   // Gray-500
      },
      fontFamily: {
        // Assuming 'Inter' from Google Fonts is available, preferred for modern/minimal design
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
        serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
        'full': '9999px',
      }
    },
  },
  plugins: [],
}