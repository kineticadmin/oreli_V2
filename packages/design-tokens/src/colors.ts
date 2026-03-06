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
    obsidian: '#FCFBF9',
    charcoal: '#FFFFFF',
    stone: '#F4F1ED',
    warm: '#E8E4DD',
    gold: '#C27803',
    goldLight: '#F59E0B',
    goldPale: '#FEF3C7',
    cream: '#1C1917',
    muted: '#78716C',
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
export type ThemeName = 'dark' | 'light' | 'system';

export const darkColors: ThemeColors = dark;
export const lightColors: ThemeColors = light;

/** Fallback statique pour les contextes hors-composant */
export const Colors: ThemeColors = dark;

/**
 * Hook React — retourne les couleurs du thème actif.
 * Passe `theme` depuis le store global (Zustand) pour que le toggle
 * fonctionne sans dépendre de useColorScheme uniquement.
 */
export function useThemeColors(
    theme: ThemeName,
    systemScheme: 'dark' | 'light' | null | undefined = useColorScheme()
): ThemeColors {
    const effective = theme === 'system' ? systemScheme : theme;
    return effective === 'dark' ? dark : light;
}
