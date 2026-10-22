/** Tailwind build for the static pages. Run `npm run build` after editing HTML classes. */
module.exports = {
    content: ['./index.html', './ar.html'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Barlow', 'sans-serif'],
                display: ['"Barlow Condensed"', 'Barlow', 'sans-serif'],
            },
            colors: {
                ember: '#ff6a1a',
                fire: '#e5262f',
                off: '#f4f1eb',
                steel: {
                    300: '#c9ccd1',
                    400: '#9aa0a8',
                    500: '#6b7079',
                    600: '#454a52',
                    700: '#2a2e35',
                    800: '#1d2025',
                    900: '#141619',
                }
            }
        }
    }
}
