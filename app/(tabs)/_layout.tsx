import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const NAV_TABS = [
    { key: 'index', label: 'Accueil', icon: '⌂' },
    { key: 'gifts', label: 'Cadeaux', icon: '◇' },
    { key: 'orders', label: 'Commandes', icon: '▣' },
    { key: 'close', label: 'Proches', icon: '♡' },
    { key: 'profile', label: 'Profil', icon: '○' },
] as const;

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.wrapper, { paddingBottom: insets.bottom + 8 }]}>
            <BlurView intensity={60} tint="dark" style={styles.blur}>
                <View style={styles.tabRow}>
                    {NAV_TABS.map((tab, idx) => {
                        const isActive = state.index === idx;
                        return (
                            <TouchableOpacity
                                key={tab.key}
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate(tab.key)}
                                style={styles.tab}
                            >
                                <Text style={[styles.icon, isActive && styles.iconActive]}>
                                    {tab.icon}
                                </Text>
                                <Text style={[styles.label, isActive && styles.labelActive]}>
                                    {tab.label}
                                </Text>
                                {isActive && <View style={styles.activeDot} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BlurView>
        </View>
    );
}

const createStyles = (Colors: any) => StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 12,
        left: 16,
        right: 16,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.glassBorder,
    },
    blur: {
        overflow: 'hidden',
        borderRadius: 24,
    },
    tabRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 10,
        paddingHorizontal: 4,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        gap: 2,
        paddingVertical: 4,
    },
    icon: {
        fontSize: 20,
        color: Colors.muted,
    },
    iconActive: {
        color: Colors.cream,
    },
    label: {
        fontSize: Typography.xs,
        fontFamily: Typography.regular,
        color: Colors.muted,
    },
    labelActive: {
        color: Colors.cream,
        fontFamily: Typography.semibold,
    },
    activeDot: {
        position: 'absolute',
        bottom: -2,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.gold,
    },
});

export default function TabsLayout() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="gifts" />
            <Tabs.Screen name="orders" />
            <Tabs.Screen name="close" />
            <Tabs.Screen name="profile" />
        </Tabs>
    );
}
