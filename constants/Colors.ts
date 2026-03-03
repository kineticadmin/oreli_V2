import { useColorScheme } from 'react-native';

const dark = {
    obsidian: '#0C0A09',
    charcoal: '#1C1917',
    stone: '#292524',
    warm: '#44403C',
    gold: '#CA8A04',
    goldLight: '#EAB308',
    goldPale: '#FEF9C3',
    cream: '#FAFAF9',
    muted: '#A8A29E',
    lavender: '#7C3AED',
    lavenderLight: '#A78BFA',
    success: '#16A34A',
    error: '#DC2626',
    white: '#FFFFFF',
    glass: 'rgba(255,255,255,0.06)',
    glassBorder: 'rgba(255,255,255,0.10)',
    glassDark: 'rgba(0,0,0,0.30)',
};

const light = {
    obsidian: '#F5F5F4', // light background
    charcoal: '#FFFFFF', // card background
    stone: '#E7E5E4',    // elevated card (slightly darker than white)
    warm: '#D6D3D1',     // borders
    gold: '#CA8A04',
    goldLight: '#EAB308',
    goldPale: '#FEF9C3',
    cream: '#1C1917',    // dark text
    muted: '#78716C',
    lavender: '#7C3AED',
    lavenderLight: '#A78BFA',
    success: '#16A34A',
    error: '#DC2626',
    white: '#FFFFFF',
    glass: 'rgba(0,0,0,0.04)',
    glassBorder: 'rgba(0,0,0,0.08)',
    glassDark: 'rgba(255,255,255,0.50)',
};

export function useThemeColors() {
    const scheme = useColorScheme();
    return scheme === 'dark' ? dark : light;
}

// Fallback for non-component files (might not react to changes)
export const Colors = dark;
