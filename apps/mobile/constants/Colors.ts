import { useColorScheme } from 'react-native';
import { useGiftStore } from '@/store/giftStore';

// Accent inspiration: vivid electric royal blue from reference image
// Deep end: #0F1FD4  —  Vivid end: #2B4FFF
// Chair/pants: #1B30E8 (reference)

const dark = {
    obsidian: '#0C0A09',
    charcoal: '#1C1917',
    stone: '#292524',
    warm: '#44403C',
    gold: '#4A6AFF',        // Vivid electric blue — bright enough on dark bg
    goldLight: '#6A85FF',   // Lighter blue for secondary uses
    goldPale: '#0D1440',    // Deep blue tint for pale backgrounds
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

// Light theme — warm ivory background, espresso text
// Accent: vivid electric blue inspired by reference image
const light = {
    obsidian: '#F7F4F0',      // Warm ivory — main app background
    charcoal: '#FFFFFF',       // Pure white — card surfaces
    stone: '#EDE8E1',          // Warm sand — inputs, chips, tags
    warm: '#DDD7CE',           // Barely-there separator
    gold: '#1B30E8',           // Vivid electric royal blue — main accent
    goldLight: '#3D55F5',      // Slightly lighter blue
    goldPale: '#EDF0FF',       // Pale blue tint for badge backgrounds
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

// Gradient tokens — use with LinearGradient for CTAs and accent surfaces
export const AccentGradient = {
    colors: ['#0F1FD4', '#2B4FFF'] as const,   // deep cobalt → electric blue
    colorsVivid: ['#1B30E8', '#4A6AFF'] as const,
};
