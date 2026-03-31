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

// Light theme — inspired by clean editorial gifting aesthetic
// Warm ivory background, espresso text, gold as rare accent
const light = {
    obsidian: '#F7F4F0',      // Warm ivory — main app background
    charcoal: '#FFFFFF',       // Pure white — card surfaces
    stone: '#EDE8E1',          // Warm sand — inputs, chips, tags
    warm: '#DDD7CE',           // Barely-there separator (rely on shadow for cards)
    gold: '#B87A06',           // Rich amber — badges, ratings, price highlights only
    goldLight: '#D4920A',
    goldPale: '#FDF3DC',
    cream: '#1A120B',          // Deep warm espresso — primary text
    muted: '#9A8E84',          // Warm taupe — secondary/placeholder text
    lavender: '#7C3AED',
    lavenderLight: '#A78BFA',
    success: '#1A7A4A',
    error: '#C82B22',
    white: '#FFFFFF',
    glass: 'rgba(26, 18, 11, 0.04)',
    glassBorder: 'rgba(26, 18, 11, 0.07)',
    glassDark: 'rgba(255, 255, 255, 0.94)',
};

export type ThemeColors = typeof dark;

export function useThemeColors(): ThemeColors {
    const systemScheme = useColorScheme();
    const theme = useGiftStore((s) => s.theme);
    const effective = theme === 'system' ? systemScheme : theme;
    return effective === 'dark' ? dark : light;
}

// Fallback for non-component files
export const Colors = light;
