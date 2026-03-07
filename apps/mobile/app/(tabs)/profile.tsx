import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/Typography';
import { useGiftStore } from '@/store/giftStore';
import { useLogout } from '@/hooks/useAuth';
import { useProfile, useAddresses } from '@/hooks/useProfile';

export default function ProfileScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();
    const { theme, setTheme } = useGiftStore();
    const logoutMutation = useLogout();

    const { data: profile, isLoading: isLoadingProfile } = useProfile();
    const { data: addresses } = useAddresses();

    const displayName = profile ? `${profile.firstName} ${profile.lastName}` : '…';
    const initial = (profile?.firstName ?? '?').charAt(0).toUpperCase();
    const defaultAddress = addresses?.find((a) => a.isDefault) ?? addresses?.[0];

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mon profil</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Avatar + name */}
                <View style={styles.profileSection}>
                    {isLoadingProfile ? (
                        <ActivityIndicator color={Colors.gold} />
                    ) : (
                        <>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{initial}</Text>
                            </View>
                            <Text style={styles.userName}>{displayName}</Text>
                            {profile?.email && (
                                <Text style={styles.userEmail}>{profile.email}</Text>
                            )}
                        </>
                    )}
                </View>

                {/* Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Adresse de livraison</Text>
                    <View style={styles.card}>
                        {defaultAddress ? (
                            <View style={styles.cardRow}>
                                <View style={styles.cardIcon}>
                                    <Text style={styles.cardIconText}>📍</Text>
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardLabel}>{defaultAddress.name}</Text>
                                    <Text style={styles.cardValue}>{defaultAddress.line}, {defaultAddress.postalCode} {defaultAddress.city}</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.cardRow}>
                                <View style={styles.cardIcon}>
                                    <Text style={styles.cardIconText}>📍</Text>
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardLabel}>Aucune adresse</Text>
                                    <Text style={styles.cardValue}>Ajoutez une adresse de livraison</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {/* Orders */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mes activités</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.cardRow} onPress={() => router.push('/(tabs)/orders')} activeOpacity={0.7}>
                            <View style={styles.cardIcon}>
                                <Text style={styles.cardIconText}>📦</Text>
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardLabel}>Mes commandes</Text>
                                <Text style={styles.cardValue}>Suivi et historique</Text>
                            </View>
                            <Text style={{ color: Colors.muted, fontSize: 18 }}>›</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Préférences</Text>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.cardRow} onPress={toggleTheme} activeOpacity={0.7}>
                            <View style={styles.cardIcon}>
                                <Text style={styles.cardIconText}>{theme === 'dark' ? '☾' : '☀'}</Text>
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardLabel}>Thème</Text>
                                <Text style={styles.cardValue}>{theme === 'dark' ? 'Sombre' : theme === 'light' ? 'Clair' : 'Système'}</Text>
                            </View>
                            <View style={[styles.toggle, theme !== 'dark' && styles.toggleOff]}>
                                <View style={[styles.toggleKnob, theme !== 'dark' && styles.toggleKnobOff]} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* App info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>À propos</Text>
                    <View style={styles.card}>
                        <View style={styles.cardRow}>
                            <View style={styles.cardIcon}>
                                <Text style={styles.cardIconText}>✦</Text>
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardLabel}>Oreli</Text>
                                <Text style={styles.cardValue}>Version 1.0.0</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Logout */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        onPress={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.logoutBtnText}>Se déconnecter</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const createStyles = (Colors: ThemeColors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.obsidian },
    header: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.warm,
    },
    headerTitle: { fontSize: Typography.xl, fontFamily: Typography.bold, color: Colors.cream, letterSpacing: -0.5 },
    profileSection: {
        alignItems: 'center',
        paddingVertical: Spacing['3xl'],
        gap: Spacing.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.gold,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { fontSize: Typography['2xl'], fontFamily: Typography.bold, color: Colors.obsidian },
    userName: { fontSize: Typography.xl, fontFamily: Typography.bold, color: Colors.cream, letterSpacing: -0.5 },
    userEmail: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted },
    logoutBtn: { backgroundColor: Colors.charcoal, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.warm, paddingVertical: 16, alignItems: 'center' },
    logoutBtnText: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.error },
    section: { paddingHorizontal: Spacing.xl, marginBottom: Spacing['2xl'] },
    sectionTitle: { fontSize: Typography.xs, fontFamily: Typography.semibold, color: Colors.muted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: Spacing.sm },
    card: {
        backgroundColor: Colors.charcoal,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.warm,
        overflow: 'hidden',
        ...Shadow.card,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        gap: Spacing.md,
    },
    cardIcon: {
        width: 36,
        height: 36,
        borderRadius: Radius.md,
        backgroundColor: Colors.stone,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardIconText: { fontSize: 16 },
    cardContent: { flex: 1 },
    cardLabel: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.cream, marginBottom: 2 },
    cardValue: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted },
    editBtn: {},
    editBtnText: { fontSize: Typography.xs, fontFamily: Typography.semibold, color: Colors.gold },
    toggle: {
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.gold,
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    toggleOff: { backgroundColor: Colors.warm },
    toggleKnob: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: Colors.obsidian,
        alignSelf: 'flex-end',
    },
    toggleKnobOff: { alignSelf: 'flex-start' },
});
