/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // Dark premium palette
                obsidian: "#0C0A09",
                charcoal: "#1C1917",
                stone: "#292524",
                warm: "#44403C",
                // Gold accent
                gold: "#CA8A04",
                "gold-light": "#EAB308",
                "gold-pale": "#FEF9C3",
                // Text
                cream: "#FAFAF9",
                muted: "#A8A29E",
                // Lavender accent
                lavender: "#7C3AED",
                "lavender-light": "#A78BFA",
                // Status
                success: "#16A34A",
                error: "#DC2626",
            },
            fontFamily: {
                sans: ["Inter-Regular"],
                medium: ["Inter-Medium"],
                semibold: ["Inter-SemiBold"],
                bold: ["Inter-Bold"],
            },
        },
    },
    plugins: [],
};
