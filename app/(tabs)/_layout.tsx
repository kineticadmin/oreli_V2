import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { t } from '@/constants/i18n';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const NAV_TABS = [
    { key: 'index', label: '', icon: 'home' as const, isMain: false },
    { key: 'close', label: '', icon: 'heart' as const, isMain: false },
    { key: 'gifts', label: 'Rechercher', icon: 'search' as const, isMain: true },
    { key: 'profile', label: '', icon: 'user' as const, isMain: false },
];

import { useColorScheme } from 'react-native';
import { useGiftStore } from '@/store/giftStore';
import { Shadow } from '@/constants/Typography';

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();

    const systemScheme = useColorScheme();
    const theme = useGiftStore((s) => s.theme);
    const effectiveTheme = theme === 'system' ? systemScheme : theme;
    const isDark = effectiveTheme === 'dark';

    return (
        <View style={[styles.wrapper, { bottom: insets.bottom + 12 }]}>
            {NAV_TABS.map((tab, idx) => {
                // Find the actual index of the screen in the navigation state
                // Since 'orders' is still in the Tabs.Screen list but not in NAV_TABS,
                // we need to match by route name.
                const routeIndex = state.routes.findIndex(r => r.name === tab.key);
                const isActive = state.index === routeIndex;

                if (tab.isMain) {
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            activeOpacity={0.8}
                            onPress={() => {
                                if (tab.key === 'gifts') {
                                    router.push('/gift-flow');
                                } else {
                                    navigation.navigate(tab.key);
                                }
                            }}
                            style={[styles.mainTab, isActive && styles.mainTabActive]}
                        >
                            <Feather
                                name={tab.icon}
                                size={20}
                                color={isActive ? Colors.gold : Colors.muted}
                            />
                            <Text style={[styles.mainLabel, isActive && styles.mainLabelActive]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                }

                return (
                    <TouchableOpacity
                        key={tab.key}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate(tab.key)}
                        style={[styles.circleTab, isActive && styles.circleTabActive]}
                    >
                        <Feather
                            name={tab.icon}
                            size={22}
                            color={isActive ? Colors.gold : Colors.muted}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const createStyles = (Colors: ThemeColors) => StyleSheet.create({
    wrapper: {
        position: 'absolute',
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    circleTab: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.charcoal,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.warm,
        ...Shadow.card,
    },
    circleTabActive: {
        borderColor: Colors.gold + '44',
    },
    mainTab: {
        flex: 1,
        height: 52,
        marginHorizontal: 12,
        borderRadius: 26,
        backgroundColor: Colors.charcoal,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: Colors.warm,
        ...Shadow.card,
    },
    mainTabActive: {
        borderColor: Colors.gold + '44',
    },
    mainLabel: {
        fontSize: 15,
        fontFamily: Typography.medium,
        color: Colors.muted,
    },
    mainLabelActive: {
        color: Colors.gold,
        fontFamily: Typography.semibold,
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
