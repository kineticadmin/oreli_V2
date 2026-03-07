import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useStripe } from '@stripe/stripe-react-native';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/Typography';
import { useGiftStore } from '@/store/giftStore';
import { useProductDetail, formatPrice } from '@/hooks/useCatalog';
import { useCreateOrder, toSurpriseMode, toDeliveryDate } from '@/hooks/useCreateOrder';
import { t } from '@/constants/i18n';

const PREMIUM_WRAP_PRICE_CENTS = 500;

export default function CheckoutScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();
    const { giftFlow, updateGiftFlow, userAddress, setLastOrderId } = useGiftStore();
    const [editingMsg, setEditingMsg] = useState(false);

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const createOrder = useCreateOrder();

    const { data: product } = useProductDetail(giftFlow.selectedProductId ?? '');

    const premiumWrap = giftFlow.premiumWrap ?? false;
    const giftMessage = giftFlow.giftMessage ?? 'Avec tout mon amour';
    const totalPriceCents = (product?.priceAmount ?? 0) + (premiumWrap ? PREMIUM_WRAP_PRICE_CENTS : 0);

    const handleConfirm = async () => {
        if (!product || !giftFlow.selectedProductId) return;

        // Construire l'adresse en remplissant les champs manquants avec des valeurs par défaut Bruxelles
        const deliveryAddress = {
            name: userAddress.name,
            line: userAddress.line,
            city: 'Bruxelles',
            postalCode: '1000',
            country: 'BE',
        };

        createOrder.mutate(
            {
                items: [{ productId: giftFlow.selectedProductId, quantity: 1 }],
                deliveryAddress,
                requestedDeliveryDate: toDeliveryDate(giftFlow.deliveryDate),
                giftMessage: giftMessage || undefined,
                surpriseMode: toSurpriseMode(giftFlow.surpriseLevel),
            },
            {
                onSuccess: async ({ orderId, stripeClientSecret }) => {
                    setLastOrderId(orderId);
                    const { error: initError } = await initPaymentSheet({
                        paymentIntentClientSecret: stripeClientSecret,
                        merchantDisplayName: 'Oreli',
                        style: 'alwaysDark',
                        primaryButtonLabel: `Payer ${formatPrice(totalPriceCents, product.currency)}`,
                    });

                    if (initError) {
                        Alert.alert('Erreur de paiement', initError.message);
                        return;
                    }

                    const { error: presentError } = await presentPaymentSheet();

                    if (presentError) {
                        if (presentError.code !== 'Canceled') {
                            Alert.alert('Paiement échoué', presentError.message);
                        }
                        return;
                    }

                    // Paiement confirmé côté Stripe — webhook traitera la suite
                    router.replace('/confirmation');
                },
                onError: () => {
                    Alert.alert('Erreur', 'Impossible de créer la commande. Réessaie.');
                },
            },
        );
    };

    const isLoading = createOrder.isPending;

    return (
        <View style={[styles.container, { backgroundColor: Colors.obsidian }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>{t('common.back')}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('checkout.title')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
                {/* Product Summary */}
                {product && (
                    <View style={[styles.productCard, { marginTop: 16 }]}>
                        <View style={styles.productImageBox}>
                            <Feather name="package" size={32} color={Colors.cream} />
                        </View>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={2}>{product.title}</Text>
                            <Text style={styles.productSeller}>{product.seller.displayName}</Text>
                            <Text style={styles.productPrice}>{formatPrice(product.priceAmount, product.currency)}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('checkout.shippingAddress')}</Text>
                    <View style={styles.card}>
                        <Text style={styles.addressName}>{userAddress.name}</Text>
                        <Text style={styles.addressLine}>{userAddress.line}</Text>
                        <TouchableOpacity style={styles.modifyBtn}>
                            <Text style={styles.modifyBtnText}>{t('common.modify')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Payment */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('checkout.payment')}</Text>
                    <View style={styles.card}>
                        <View style={styles.stripeRow}>
                            <Feather name="lock" size={16} color={Colors.gold} />
                            <Text style={styles.stripeText}>Paiement sécurisé par Stripe</Text>
                        </View>
                        <Text style={styles.stripeSubtext}>
                            Carte, Apple Pay, Google Pay — la fenêtre de paiement s'ouvre à la confirmation.
                        </Text>
                    </View>
                </View>

                {/* Gift Message */}
                <View style={styles.section}>
                    <View style={styles.sectionRow}>
                        <Text style={styles.sectionTitle}>{t('checkout.giftMessage')}</Text>
                        <TouchableOpacity onPress={() => setEditingMsg(!editingMsg)}>
                            <Text style={styles.editBtnText}>{editingMsg ? t('common.validate') : t('common.edit')}</Text>
                        </TouchableOpacity>
                    </View>
                    {editingMsg ? (
                        <TextInput
                            value={giftMessage}
                            onChangeText={(v) => updateGiftFlow({ giftMessage: v })}
                            multiline
                            numberOfLines={3}
                            maxLength={200}
                            style={[styles.input, styles.inputMessage]}
                            placeholderTextColor={Colors.muted}
                        />
                    ) : (
                        <View style={[styles.card, styles.messageCard]}>
                            <Text style={styles.messageText}>"{giftMessage}"</Text>
                        </View>
                    )}
                </View>

                {/* Price Breakdown */}
                <View style={styles.section}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>{t('checkout.subtotal')}</Text>
                        <Text style={styles.priceValue}>{product ? formatPrice(product.priceAmount, product.currency) : '—'}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>{t('checkout.shippingLabel')}</Text>
                        <Text style={[styles.priceValue, { color: Colors.success }]}>{t('checkout.free')}</Text>
                    </View>
                    {premiumWrap && (
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>{t('checkout.premiumWrap')}</Text>
                            <Text style={styles.priceValue}>{formatPrice(PREMIUM_WRAP_PRICE_CENTS)}</Text>
                        </View>
                    )}
                    <View style={[styles.priceRow, styles.priceTotal]}>
                        <Text style={styles.priceTotalLabel}>{t('checkout.total')}</Text>
                        <Text style={styles.priceTotalValue}>{product ? formatPrice(totalPriceCents, product.currency) : '—'}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* CTA */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    style={[styles.confirmBtn, (!product || isLoading) && styles.confirmBtnDisabled]}
                    onPress={handleConfirm}
                    disabled={!product || isLoading}
                    activeOpacity={0.85}
                >
                    {isLoading ? (
                        <ActivityIndicator color={Colors.obsidian} />
                    ) : (
                        <Text style={styles.confirmBtnText}>
                            {t('checkout.confirmText', { total: product ? formatPrice(totalPriceCents, product.currency) : '…' })}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const createStyles = (Colors: ThemeColors) => StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.warm },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    backBtnText: { fontSize: 22, color: Colors.cream },
    headerTitle: { fontSize: Typography.base, fontFamily: Typography.bold, color: Colors.cream },
    productCard: { flexDirection: 'row', gap: Spacing.md, paddingHorizontal: Spacing.xl, backgroundColor: Colors.charcoal, marginHorizontal: Spacing.xl, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.card, borderWidth: 1, borderColor: Colors.warm, marginBottom: Spacing.xl },
    productImageBox: { width: 72, height: 72, borderRadius: Radius.lg, backgroundColor: Colors.stone, alignItems: 'center', justifyContent: 'center' },
    productImagePlaceholder: { fontSize: 32 },
    productInfo: { flex: 1 },
    productName: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.cream, lineHeight: 18, marginBottom: 3 },
    productSeller: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted, marginBottom: 8 },
    productPrice: { fontSize: Typography.md, fontFamily: Typography.bold, color: Colors.cream },
    section: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl },
    sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: Typography.sm, fontFamily: Typography.bold, color: Colors.cream, marginBottom: 12 },
    editBtnText: { fontSize: Typography.xs, fontFamily: Typography.medium, color: Colors.muted },
    card: { backgroundColor: Colors.charcoal, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.warm, padding: Spacing.lg },
    addressName: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.cream, marginBottom: 4 },
    addressLine: { fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.muted, marginBottom: 12 },
    modifyBtn: {},
    modifyBtnText: { fontSize: Typography.xs, fontFamily: Typography.semibold, color: Colors.cream, textDecorationLine: 'underline' },
    stripeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    stripeText: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.cream },
    stripeSubtext: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted, lineHeight: 18 },
    input: { backgroundColor: Colors.stone, borderRadius: Radius.lg, padding: 14, fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.cream, borderWidth: 1, borderColor: Colors.warm, marginBottom: 8 },
    inputMessage: { minHeight: 80, textAlignVertical: 'top' },
    messageCard: { marginTop: 0 },
    messageText: { fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.muted, fontStyle: 'italic', lineHeight: 22 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    priceLabel: { fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.muted },
    priceValue: { fontSize: Typography.sm, fontFamily: Typography.medium, color: Colors.cream },
    priceTotal: { borderTopWidth: 1, borderTopColor: Colors.warm, marginTop: 8 },
    priceTotalLabel: { fontSize: Typography.md, fontFamily: Typography.bold, color: Colors.cream },
    priceTotalValue: { fontSize: Typography.xl, fontFamily: Typography.bold, color: Colors.cream },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: Spacing.xl, paddingTop: 16, backgroundColor: Colors.obsidian + 'F0', borderTopWidth: 1, borderTopColor: Colors.warm },
    confirmBtn: { backgroundColor: Colors.gold, paddingVertical: 17, borderRadius: Radius.full, alignItems: 'center' },
    confirmBtnDisabled: { opacity: 0.5 },
    confirmBtnText: { fontSize: Typography.base, fontFamily: Typography.semibold, color: Colors.obsidian },
});
