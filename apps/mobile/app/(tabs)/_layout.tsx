import { Tabs } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors, ThemeColors, AccentGradient } from '@/constants/Colors';
import { Typography, Shadow } from '@/constants/Typography';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const NAV_TABS = [
    { key: 'index',   icon: 'home'   as const, isMain: false },
    { key: 'close',   icon: 'heart'  as const, isMain: false },
    { key: 'gifts',   icon: 'search' as const, isMain: true, label: 'Rechercher' },
    { key: 'profile', icon: 'user'   as const, isMain: false },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.wrapper, { bottom: insets.bottom + 16 }]}>
            {NAV_TABS.map((tab) => {
                const routeIndex = state.routes.findIndex((r) => r.name === tab.key);
                const isActive = state.index === routeIndex;

                if (tab.isMain) {
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            activeOpacity={0.85}
                            onPress={() => router.push('/gift-flow')}
                            style={styles.mainTabWrap}
                        >
                            <LinearGradient
                                colors={AccentGradient.colors}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.mainTab}
                            >
                                <Feather name={tab.icon} size={18} color="#FFFFFF" />
                                <Text style={styles.mainLabel}>{tab.label}</Text>
                            </LinearGradient>
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
                            size={20}
                            color={isActive ? Colors.charcoal : Colors.muted}
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
    },
    // Inactive: white circle with soft shadow
    circleTab: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.charcoal,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadow.float,
    },
    // Active: filled near-black circle — icon turns white
    circleTabActive: {
        backgroundColor: Colors.cream,
    },
    // Central CTA — vivid blue gradient pill
    mainTabWrap: {
        flex: 1,
        height: 52,
        marginHorizontal: 10,
        borderRadius: 26,
        overflow: 'hidden',
        ...Shadow.float,
    },
    mainTab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    mainLabel: {
        fontSize: Typography.sm,
        fontFamily: Typography.semibold,
        color: '#FFFFFF',
        letterSpacing: 0.2,
    },
});

export default function TabsLayout() {
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
