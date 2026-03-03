import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/Typography';
import { useGiftStore } from '@/store/giftStore';
import { t } from '@/constants/i18n';

export default function CheckoutScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();
    const { selectedProduct, giftFlow, updateGiftFlow, userAddress } = useGiftStore();
    const [loading, setLoading] = useState(false);
    const [editingMsg, setEditingMsg] = useState(false);

    const product = selectedProduct;
    const premiumWrap = giftFlow.premiumWrap ?? false;
    const giftMessage = giftFlow.giftMessage ?? 'Avec tout mon amour';
    const wrapCost = premiumWrap ? 5 : 0;
    const total = (product?.price ?? 0) + wrapCost;

    const handleConfirm = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.replace('/confirmation');
        }, 1600);
    };

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
                        {giftFlow.surpriseLevel === 'total' ? (
                            <>
                                <View style={styles.productImageBox}>
                                    <Feather name="gift" size={32} color={Colors.gold} />
                                </View>
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName} numberOfLines={2}>Surprise Totale Oreli</Text>
                                    <Text style={styles.productSeller}>Sélectionné par la magie de l'IA</Text>
                                    <Text style={[styles.productPrice, { color: Colors.gold }]}>Prix validé: {product.price}€</Text>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={styles.productImageBox}>
                                    <Feather name="package" size={32} color={Colors.cream} />
                                </View>
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                                    <Text style={styles.productSeller}>{product.seller}</Text>
                                    <Text style={styles.productPrice}>{product.price}€</Text>
                                </View>
                            </>
                        )}
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
                        <View style={styles.payMethodRow}>
                            <TouchableOpacity style={styles.payBtn}>
                                <Text style={styles.payBtnText}> {t('common.pay')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.payBtn}>
                                <Text style={styles.payBtnText}>{t('common.gpay')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.dividerRow}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>{t('common.orByCard')}</Text>
                            <View style={styles.divider} />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Numéro de carte"
                            placeholderTextColor={Colors.muted}
                            keyboardType="numeric"
                        />
                        <View style={styles.inputRow}>
                            <TextInput style={[styles.input, styles.inputHalf]} placeholder="MM/AA" placeholderTextColor={Colors.muted} />
                            <TextInput style={[styles.input, styles.inputHalf]} placeholder="CVC" placeholderTextColor={Colors.muted} keyboardType="numeric" />
                        </View>
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
                        <Text style={styles.priceValue}>{product?.price ?? 0}€</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>{t('checkout.shippingLabel')}</Text>
                        <Text style={[styles.priceValue, { color: Colors.success }]}>{t('checkout.free')}</Text>
                    </View>
                    {premiumWrap && (
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>{t('checkout.premiumWrap')}</Text>
                            <Text style={styles.priceValue}>5€</Text>
                        </View>
                    )}
                    <View style={[styles.priceRow, styles.priceTotal]}>
                        <Text style={styles.priceTotalLabel}>{t('checkout.total')}</Text>
                        <Text style={styles.priceTotalValue}>{total}€</Text>
                    </View>
                </View>
            </ScrollView>

            {/* CTA */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={handleConfirm}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    {loading ? (
                        <ActivityIndicator color={Colors.obsidian} />
                    ) : (
                        <Text style={styles.confirmBtnText}>{t('checkout.confirmText', { total })}</Text>
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
    payMethodRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    payBtn: { flex: 1, backgroundColor: Colors.stone, paddingVertical: 12, borderRadius: Radius.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.warm },
    payBtnText: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.cream },
    dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    divider: { flex: 1, height: 1, backgroundColor: Colors.warm },
    dividerText: { fontSize: 11, fontFamily: Typography.regular, color: Colors.muted },
    input: { backgroundColor: Colors.stone, borderRadius: Radius.lg, padding: 14, fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.cream, borderWidth: 1, borderColor: Colors.warm, marginBottom: 8 },
    inputRow: { flexDirection: 'row', gap: 8 },
    inputHalf: { flex: 1, marginBottom: 0 },
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
    confirmBtnText: { fontSize: Typography.base, fontFamily: Typography.semibold, color: Colors.obsidian },
});
