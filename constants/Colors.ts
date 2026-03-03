import { useColorScheme } from 'react-native';
import { useGiftStore } from '@/store/giftStore';

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
    obsidian: '#FCFBF9', // Clean pearl/ivory background for main app
    charcoal: '#FFFFFF', // Pure white for cards to pop
    stone: '#F4F1ED',    // Warm gray/sand for inner elements
    warm: '#E8E4DD',     // Soft greige borders
    gold: '#C27803',     // Richer gold with excellent light contrast
    goldLight: '#F59E0B',
    goldPale: '#FEF3C7',
    cream: '#1C1917',    // Deep espresso black-brown text
    muted: '#78716C',    // Warm gray muted text
    lavender: '#8B5CF6',
    lavenderLight: '#C4B5FD',
    success: '#10B981',
    error: '#EF4444',
    white: '#FFFFFF',
    glass: 'rgba(0,0,0,0.03)',
    glassBorder: 'rgba(0,0,0,0.06)',
    glassDark: 'rgba(255,255,255,0.70)',
};

export type ThemeColors = typeof dark;

export function useThemeColors(): ThemeColors {
    const systemScheme = useColorScheme();
    const theme = useGiftStore((s) => s.theme);
    const effective = theme === 'system' ? systemScheme : theme;
    return effective === 'dark' ? dark : light;
}

// Fallback for non-component files (might not react to changes)
export const Colors = dark;
