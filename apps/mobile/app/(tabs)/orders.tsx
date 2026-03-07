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
import { Feather } from '@expo/vector-icons';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/Typography';
import { useOrders, ORDER_STATUS_LABELS } from '@/hooks/useOrders';
import { formatPrice } from '@/hooks/useCatalog';

export default function OrdersScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();

    const { data: orders, isLoading } = useOrders();

    const formatOrderDate = (isoDate: string) =>
        new Date(isoDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Commandes</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {isLoading && (
                    <ActivityIndicator color={Colors.gold} style={{ marginTop: 60 }} />
                )}
                {!isLoading && (!orders || orders.length === 0) && (
                    <View style={styles.empty}>
                        <Feather name="box" size={40} color={Colors.warm} />
                        <Text style={styles.emptyTitle}>Aucune commande</Text>
                        <Text style={styles.emptySubtitle}>Tes commandes apparaîtront ici</Text>
                    </View>
                )}
                {orders && orders.length > 0 && (
                    <View style={styles.list}>
                        {orders.map((order) => {
                            const statusConfig = ORDER_STATUS_LABELS[order.status] ?? {
                                label: order.status,
                                color: Colors.muted,
                                bg: Colors.stone,
                            };
                            return (
                                <TouchableOpacity
                                    key={order.id}
                                    style={styles.card}
                                    activeOpacity={0.8}
                                    onPress={() => router.push(`/order/${order.id}` as never)}
                                >
                                    <View style={styles.cardTop}>
                                        <View style={styles.productIconWrap}>
                                            <Feather name="gift" size={24} color={Colors.cream} />
                                        </View>
                                        <View style={styles.cardInfo}>
                                            <Text style={styles.productName} numberOfLines={2}>
                                                {order.firstItemTitle}
                                            </Text>
                                            <Text style={styles.sellerName} numberOfLines={1}>
                                                {order.firstItemSellerName}
                                            </Text>
                                        </View>
                                        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                                            <Text style={[styles.statusText, { color: statusConfig.color }]}>
                                                {statusConfig.label}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.divider} />

                                    <View style={styles.cardBottom}>
                                        <Text style={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</Text>
                                        <Text style={styles.date}>{formatOrderDate(order.createdAt)}</Text>
                                        <Text style={styles.total}>{formatPrice(order.totalAmount, order.currency)}</Text>
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
    sellerName: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted },
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
