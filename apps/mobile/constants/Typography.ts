import { Platform } from 'react-native';

export const Typography = {
    // Scale
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
    '4xl': 42,

    // Line heights
    tight: 1.1,
    snug: 1.25,
    normal: 1.45,
    relaxed: 1.6,

    // Letter spacing
    tighter: -0.6,
    tight2: -0.3,
    normal2: 0,
    wide: 0.5,

    // Font families (loaded via expo-font)
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semibold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
};

export const Radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 56,
};

// Soft editorial shadows — designed for white cards on warm ivory backgrounds
export const Shadow = {
    card: Platform.select({
        ios: {
            shadowColor: '#1A120B',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 14,
        },
        android: { elevation: 3 },
        default: {},
    }),
    cardHover: Platform.select({
        ios: {
            shadowColor: '#1A120B',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.11,
            shadowRadius: 24,
        },
        android: { elevation: 8 },
        default: {},
    }),
    // For floating elements (tab bar, FABs)
    float: Platform.select({
        ios: {
            shadowColor: '#1A120B',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
        },
        android: { elevation: 6 },
        default: {},
    }),
};
