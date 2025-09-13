/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#1E40AF',
                'primary-focus': '#1D4ED8',
                secondary: '#DB2777',
                'secondary-focus': '#BE185D',
                accent: '#F59E0B',
                'accent-focus': '#D97706',
                neutral: '#1F2937',
                'neutral-focus': '#111827',
                'base-100': '#F9FAFB',
                info: '#3ABFF8',
                success: '#36D399',
                warning: '#FBBD23',
                error: '#F87272',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
