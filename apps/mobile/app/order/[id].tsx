import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/Typography';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { formatPrice } from '@/hooks/useCatalog';
import { ORDER_STATUS_LABELS } from '@/hooks/useOrders';
import { useOrderTracking } from '@/hooks/useOrderTracking';

// ─── Types ────────────────────────────────────────────────────────────────

interface ProductSnapshot {
    title?: string;
    sellerDisplayName?: string;
    priceAmount?: number;
    currency?: string;
}

interface StatusEvent {
    toStatus: string;
    actorType: string;
    note: string | null;
    createdAt: string;
}

interface OrderDetail {
    id: string;
    status: string;
    currency: string;
    itemsSubtotalAmount: number;
    serviceFeeAmount: number;
    deliveryFeeAmount: number;
    totalAmount: number;
    giftMessage: string | null;
    requestedDeliveryDate: string;
    items: {
        id: string;
        productSnapshot: ProductSnapshot;
        quantity: number;
        unitPriceAmount: number;
    }[];
    statusEvents: StatusEvent[];
    createdAt: string;
}

const STATUS_STEPS = [
    'pending_payment',
    'paid',
    'accepted',
    'in_preparation',
    'shipped',
    'delivered',
] as const;

// ─── Composant barre de progression ─────────────────────────────────────────

function StatusProgressBar({ currentStatus, Colors }: { currentStatus: string; Colors: ThemeColors }) {
    const currentIndex = STATUS_STEPS.indexOf(currentStatus as typeof STATUS_STEPS[number]);
    const isCancelled = currentStatus === 'cancelled';

    if (isCancelled) {
        return (
            <View style={{ backgroundColor: '#DC262622', borderRadius: Radius.xl, padding: Spacing.md, alignItems: 'center' }}>
                <Text style={{ color: '#DC2626', fontFamily: 'Inter-SemiBold', fontSize: Typography.sm }}>
                    Commande annulée
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flexDirection: 'row', gap: 4 }}>
            {STATUS_STEPS.map((step, index) => (
                <View
                    key={step}
                    style={{
                        flex: 1,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: index <= currentIndex ? Colors.gold : Colors.stone,
                    }}
                />
            ))}
        </View>
    );
}

// ─── Écran ───────────────────────────────────────────────────────────────────

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();
    const queryClient = useQueryClient();

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['order', id],
        queryFn: () => apiRequest<OrderDetail>(`/orders/${id}`),
        enabled: !!id,
        staleTime: 30 * 1000,
    });

    // Subscribe to real-time status updates; refetch the order when a new event arrives
    const { latestEvent } = useOrderTracking(id);
    React.useEffect(() => {
        if (latestEvent) {
            queryClient.invalidateQueries({ queryKey: ['order', id] });
        }
    }, [latestEvent, id, queryClient]);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

    if (isLoading) {
        return (
            <View style={[styles.container, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator color={Colors.gold} />
            </View>
        );
    }

    if (error || !order) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={[styles.header]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Feather name="arrow-left" size={22} color={Colors.cream} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: Colors.muted, fontFamily: 'Inter-Regular', fontSize: Typography.sm }}>
                        Commande introuvable.
                    </Text>
                </View>
            </View>
        );
    }

    const statusConfig = ORDER_STATUS_LABELS[order.status] ?? {
        label: order.status,
        color: Colors.muted,
        bg: Colors.stone,
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={22} color={Colors.cream} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Commande</Text>
                <View style={{ width: 38 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: Spacing.xl, paddingBottom: 100, gap: Spacing.lg }}>
                {/* Statut */}
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }}>
                        <Text style={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                            <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
                        </View>
                    </View>
                    <StatusProgressBar currentStatus={order.status} Colors={Colors} />
                </View>

                {/* Articles */}
                <View style={styles.card}>
                    <Text style={styles.sectionLabel}>Articles</Text>
                    {order.items.map((item) => {
                        const snapshot = item.productSnapshot;
                        return (
                            <View key={item.id} style={styles.itemRow}>
                                <View style={styles.itemIconWrap}>
                                    <Feather name="gift" size={18} color={Colors.muted} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.itemTitle} numberOfLines={2}>
                                        {snapshot.title ?? 'Produit'}
                                    </Text>
                                    {snapshot.sellerDisplayName && (
                                        <Text style={styles.itemSeller}>{snapshot.sellerDisplayName}</Text>
                                    )}
                                </View>
                                <Text style={styles.itemPrice}>
                                    {item.quantity}× {formatPrice(item.unitPriceAmount, order.currency)}
                                </Text>
                            </View>
                        );
                    })}
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalAmount}>{formatPrice(order.totalAmount, order.currency)}</Text>
                    </View>
                </View>

                {/* Livraison */}
                <View style={styles.card}>
                    <Text style={styles.sectionLabel}>Livraison</Text>
                    <View style={styles.infoRow}>
                        <Feather name="calendar" size={14} color={Colors.muted} />
                        <Text style={styles.infoText}>
                            Date souhaitée : <Text style={styles.infoValue}>{formatDate(order.requestedDeliveryDate)}</Text>
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Feather name="clock" size={14} color={Colors.muted} />
                        <Text style={styles.infoText}>
                            Commandé le : <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
                        </Text>
                    </View>
                </View>

                {/* Message cadeau */}
                {order.giftMessage && (
                    <View style={styles.card}>
                        <Text style={styles.sectionLabel}>Message cadeau</Text>
                        <Text style={styles.giftMessage}>"{order.giftMessage}"</Text>
                    </View>
                )}

                {/* Historique statuts */}
                {order.statusEvents.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.sectionLabel}>Historique</Text>
                        {order.statusEvents.map((event, index) => {
                            const eventConfig = ORDER_STATUS_LABELS[event.toStatus];
                            return (
                                <View key={index} style={styles.eventRow}>
                                    <View style={[styles.eventDot, { backgroundColor: eventConfig?.color ?? Colors.muted }]} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.eventLabel}>
                                            {eventConfig?.label ?? event.toStatus}
                                        </Text>
                                        {event.note && (
                                            <Text style={styles.eventNote}>{event.note}</Text>
                                        )}
                                        <Text style={styles.eventDate}>{formatDate(event.createdAt)}</Text>
                                    </View>
                                </View>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.warm,
    },
    backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: Typography.base, fontFamily: 'Inter-SemiBold', color: Colors.cream },
    card: {
        backgroundColor: Colors.charcoal,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.warm,
        padding: Spacing.lg,
        ...Shadow.card,
    },
    orderId: { fontSize: Typography.xs, fontFamily: 'Inter-Regular', color: Colors.muted },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
    statusText: { fontSize: 11, fontFamily: 'Inter-SemiBold' },
    sectionLabel: {
        fontSize: Typography.xs,
        fontFamily: 'Inter-SemiBold',
        color: Colors.muted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: Spacing.md,
    },
    itemRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
    itemIconWrap: {
        width: 36,
        height: 36,
        borderRadius: Radius.md,
        backgroundColor: Colors.stone,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemTitle: { fontSize: Typography.sm, fontFamily: 'Inter-SemiBold', color: Colors.cream },
    itemSeller: { fontSize: Typography.xs, fontFamily: 'Inter-Regular', color: Colors.muted, marginTop: 2 },
    itemPrice: { fontSize: Typography.sm, fontFamily: 'Inter-Medium', color: Colors.cream },
    divider: { height: 1, backgroundColor: Colors.warm, marginVertical: Spacing.md },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: Typography.sm, fontFamily: 'Inter-SemiBold', color: Colors.cream },
    totalAmount: { fontSize: Typography.base, fontFamily: 'Inter-Bold', color: Colors.gold },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
    infoText: { fontSize: Typography.sm, fontFamily: 'Inter-Regular', color: Colors.muted },
    infoValue: { fontFamily: 'Inter-Medium', color: Colors.cream },
    giftMessage: { fontSize: Typography.sm, fontFamily: 'Inter-Regular', color: Colors.muted, fontStyle: 'italic', lineHeight: Typography.sm * 1.5 },
    eventRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md, alignItems: 'flex-start' },
    eventDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
    eventLabel: { fontSize: Typography.sm, fontFamily: 'Inter-SemiBold', color: Colors.cream },
    eventNote: { fontSize: Typography.xs, fontFamily: 'Inter-Regular', color: Colors.muted, marginTop: 2 },
    eventDate: { fontSize: Typography.xs, fontFamily: 'Inter-Regular', color: Colors.muted, marginTop: 2 },
});
