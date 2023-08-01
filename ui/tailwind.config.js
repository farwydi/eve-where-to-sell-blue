/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/components/*.tsx",
        "./src/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            borderColor: {
              'active': '#568a89',
            },
            backgroundColor: {
                'gray-black': '#1d1d1d',
            },
            colors: {
                'security-1.0': '#28c0bf',
                'security-0.9': '#39bf99',
                'security-0.8': '#00bf39',
                'security-0.7': '#00bf00',
                'security-0.6': '#73bf26',
                'security-0.5': '#bebe00',
                'security-0.4': '#ab5f00',
                'security-0.3': '#c24e02',
                'security-0.2': '#be3900',
                'security-0.1': '#ab2600',
                'security-0.0': '#be0000',
            },
        },
    },
    plugins: [],
}

