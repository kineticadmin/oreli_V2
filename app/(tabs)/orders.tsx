import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/Typography';
import { products } from '@/data/mockData';

const MOCK_ORDERS = [
    {
        id: 'ORE-28471',
        productId: products[0]?.id,
        productName: products[0]?.name ?? 'Cadeau Oreli',
        date: '28 fév. 2026',
        total: (products[0]?.price ?? 45) + 5,
        status: 'Livré' as const,
        recipient: 'Sophie',
    },
    {
        id: 'ORE-19302',
        productId: products[2]?.id,
        productName: products[2]?.name ?? 'Cadeau Oreli',
        date: '14 mars 2026',
        total: products[2]?.price ?? 65,
        status: 'En cours' as const,
        recipient: 'Marc',
    },
    {
        id: 'ORE-74819',
        productId: products[5]?.id,
        productName: products[5]?.name ?? 'Cadeau Oreli',
        date: '3 mars 2026',
        total: products[5]?.price ?? 80,
        status: 'En préparation' as const,
        recipient: 'Julie',
    },
];

const STATUS_CONFIG = {
    'Livré': { color: '#16A34A', bg: '#16A34A22' },
    'En cours': { color: '#CA8A04', bg: '#CA8A0422' },
    'En préparation': { color: '#7C3AED', bg: '#7C3AED22' },
};

export default function OrdersScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Commandes</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {MOCK_ORDERS.length === 0 ? (
                    <View style={styles.empty}>
                        <Feather name="box" style={styles.emptyIcon} />
                        <Text style={styles.emptyTitle}>Aucune commande</Text>
                        <Text style={styles.emptySubtitle}>Tes commandes apparaîtront ici</Text>
                    </View>
                ) : (
                    <View style={styles.list}>
                        {MOCK_ORDERS.map((order) => {
                            const config = STATUS_CONFIG[order.status];
                            return (
                                <TouchableOpacity
                                    key={order.id}
                                    style={styles.card}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.cardTop}>
                                        <View style={styles.productIconWrap}>
                                            <Feather name="gift" style={styles.productIcon} color={Colors.cream} />
                                        </View>
                                        <View style={styles.cardInfo}>
                                            <Text style={styles.productName} numberOfLines={2}>{order.productName}</Text>
                                            <Text style={styles.recipient}>Pour {order.recipient}</Text>
                                        </View>
                                        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                                            <Text style={[styles.statusText, { color: config.color }]}>{order.status}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.divider} />

                                    <View style={styles.cardBottom}>
                                        <Text style={styles.orderId}>#{order.id}</Text>
                                        <Text style={styles.date}>{order.date}</Text>
                                        <Text style={styles.total}>{order.total}€</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
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
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
        gap: 12,
    },
    emptyIcon: { fontSize: 40, color: Colors.warm },
    emptyTitle: { fontSize: 18, fontFamily: Typography.bold, color: Colors.cream },
    emptySubtitle: { fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.muted },
    list: { padding: Spacing.xl, gap: Spacing.md },
    card: {
        backgroundColor: Colors.charcoal,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.warm,
        padding: Spacing.lg,
        ...Shadow.card,
    },
    cardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    productIconWrap: {
        width: 48,
        height: 48,
        borderRadius: Radius.lg,
        backgroundColor: Colors.stone,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productIcon: { fontSize: 24 },
    cardInfo: { flex: 1 },
    productName: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.cream, lineHeight: 18, marginBottom: 3 },
    recipient: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: Radius.full,
    },
    statusText: { fontSize: 11, fontFamily: Typography.semibold },
    divider: { height: 1, backgroundColor: Colors.warm, marginVertical: Spacing.md },
    cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderId: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted },
    date: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted },
    total: { fontSize: Typography.sm, fontFamily: Typography.bold, color: Colors.cream },
});
