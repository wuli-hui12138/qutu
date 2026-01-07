/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                // Semantic Variables
                'bg-main': 'var(--bg-main)',
                'bg-card': 'var(--bg-card)',
                'text-main': 'var(--text-main)',
                'text-dim': 'var(--text-dim)',
                'glass-border': 'var(--glass-border)',
                'primary': 'var(--primary)',
                'primary-glow': 'var(--primary-glow)',

                // Original Palette (kept for compatibility)
                indigo: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                }
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
            }
        },
    },
    plugins: [],
    corePlugins: {
        preflight: false
    }
}
