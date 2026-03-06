import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/Typography';
import { closeOnes } from '@/data/mockData';
import { useGiftStore } from '@/store/giftStore';

export default function CloseScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();
    const setSelectedPerson = useGiftStore((s) => s.setSelectedPerson);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mes proches</Text>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => router.push('/add-close-one')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.addBtnText}>+ Ajouter</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.list}>
                    {closeOnes.map((person) => (
                        <TouchableOpacity
                            key={person.id}
                            style={styles.card}
                            activeOpacity={0.8}
                            onPress={() => {
                                setSelectedPerson(person);
                                router.push('/gift-flow');
                            }}
                        >
                            <View style={styles.avatarWrapper}>
                                {person.avatarUrl ? (
                                    <Image source={{ uri: person.avatarUrl }} style={styles.avatar} />
                                ) : (
                                    <View style={styles.avatarFallback}>
                                        <Text style={styles.avatarText}>{person.avatar}</Text>
                                    </View>
                                )}
                                {person.daysUntilEvent !== undefined && person.daysUntilEvent < 14 && (
                                    <View style={styles.eventBadge}>
                                        <Text style={styles.eventBadgeText}>{person.daysUntilEvent}j</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.name}>{person.name}</Text>
                                <Text style={styles.relationship}>{person.relationship}</Text>
                                {person.eventType && person.eventDate && (
                                    <Text style={styles.event}>
                                        {person.eventType} · {person.eventDate}
                                    </Text>
                                )}
                            </View>

                            <TouchableOpacity
                                style={styles.giftBtn}
                                activeOpacity={0.85}
                                onPress={() => {
                                    setSelectedPerson(person);
                                    router.push('/gift-flow');
                                }}
                            >
                                <Text style={styles.giftBtnText}>Offrir</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const createStyles = (Colors: ThemeColors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.obsidian },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.warm,
    },
    headerTitle: { fontSize: Typography.xl, fontFamily: Typography.bold, color: Colors.cream, letterSpacing: -0.5 },
    addBtn: {
        backgroundColor: Colors.gold + '22',
        borderWidth: 1,
        borderColor: Colors.gold + '55',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: Radius.full,
    },
    addBtnText: { fontSize: Typography.xs, fontFamily: Typography.semibold, color: Colors.gold },
    list: { padding: Spacing.xl, gap: Spacing.md },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        backgroundColor: Colors.charcoal,
        borderRadius: Radius.xl,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.warm,
        ...Shadow.card,
    },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 1.5, borderColor: Colors.warm },
    avatarFallback: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: Colors.stone,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.warm,
    },
    avatarText: { fontSize: Typography.md, fontFamily: Typography.bold, color: Colors.cream },
    eventBadge: {
        position: 'absolute',
        bottom: -2,
        left: '50%',
        transform: [{ translateX: -12 }],
        backgroundColor: Colors.gold,
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: Radius.full,
        minWidth: 24,
        alignItems: 'center',
    },
    eventBadgeText: { fontSize: 8, fontFamily: Typography.bold, color: Colors.obsidian },
    info: { flex: 1 },
    name: { fontSize: Typography.base, fontFamily: Typography.semibold, color: Colors.cream, marginBottom: 2 },
    relationship: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted, marginBottom: 2 },
    event: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.gold },
    giftBtn: {
        backgroundColor: Colors.gold,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: Radius.full,
    },
    giftBtnText: { fontSize: Typography.xs, fontFamily: Typography.semibold, color: Colors.obsidian },
});
