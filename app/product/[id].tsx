import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/Typography';
import { products } from '@/data/mockData';
import { useGiftStore } from '@/store/giftStore';

const { width: W } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const Colors = useThemeColors();
  const styles = createStyles(Colors);
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();
    const [activeImg, setActiveImg] = useState(0);
    const [premiumWrap, setPremiumWrap] = useState(false);
    const updateGiftFlow = useGiftStore((s) => s.updateGiftFlow);
    const setSelectedProduct = useGiftStore((s) => s.setSelectedProduct);

    const product = products.find((p) => p.id === id) ?? products[0];

    const handleBuy = () => {
        setSelectedProduct(product);
        updateGiftFlow({ premiumWrap });
        router.push('/checkout');
    };

    return (
        <View style={[styles.container, { backgroundColor: Colors.obsidian }]}>
            {/* Image Gallery */}
            <View style={styles.gallery}>
                <FlatList
                    data={product.images}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => {
                        const idx = Math.round(e.nativeEvent.contentOffset.x / W);
                        setActiveImg(idx);
                    }}
                    renderItem={({ item }) => (
                        <View style={styles.galleryImageWrap}>
                            <Text style={styles.galleryPlaceholder}>🖼</Text>
                        </View>
                    )}
                    keyExtractor={(_, i) => String(i)}
                />

                {/* Back button */}
                <TouchableOpacity
                    style={[styles.backBtn, { top: insets.top + 8 }]}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backBtnText}>←</Text>
                </TouchableOpacity>

                {/* Image dots */}
                <View style={styles.galleryDots}>
                    {product.images.map((_, i) => (
                        <View
                            key={i}
                            style={[styles.galleryDot, i === activeImg ? styles.galleryDotActive : styles.galleryDotInactive]}
                        />
                    ))}
                </View>

                {/* Gradient overlay */}
                <LinearGradient
                    colors={['transparent'.obsidian]}
                    style={styles.galleryGradient}
                />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
                style={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.productHeader}>
                    <View style={styles.productHeaderTop}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>{product.category}</Text>
                        </View>
                        {product.deliveryExpress && (
                            <View style={styles.expressBadge}>
                                <Text style={styles.expressBadgeText}>⚡ Express</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.sellerName}>{product.seller}</Text>

                    <View style={styles.ratingRow}>
                        <Text style={styles.stars}>★ {product.rating}</Text>
                        <Text style={styles.ratingCount}> (127 avis)</Text>
                    </View>
                </View>

                {/* AI justification */}
                <View style={styles.aiCard}>
                    <View style={styles.aiCardHeader}>
                        <Text style={styles.aiIcon}>✦</Text>
                        <Text style={styles.aiTitle}>Pourquoi ce cadeau ?</Text>
                    </View>
                    <Text style={styles.aiText}>{product.aiJustification}</Text>
                    <View style={styles.matchRow}>
                        <View style={styles.matchBar}>
                            <View style={[styles.matchFill, { width: `${product.matchScore}%` }]} />
                        </View>
                        <Text style={styles.matchPercent}>{product.matchScore}% match</Text>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>À propos</Text>
                    <Text style={styles.description}>{product.description}</Text>
                </View>

                {/* Features */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Points clés</Text>
                    <View style={styles.features}>
                        {['Artisanal & local', 'Livraison suivie', 'Satisfait ou remboursé'].map((f) => (
                            <View key={f} style={styles.featureRow}>
                                <Text style={styles.featureIcon}>✓</Text>
                                <Text style={styles.featureText}>{f}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Premium Wrap */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={[styles.wrapToggle, premiumWrap && styles.wrapToggleActive]}
                        onPress={() => setPremiumWrap(!premiumWrap)}
                        activeOpacity={0.8}
                    >
                        <View>
                            <Text style={styles.wrapTitle}>Emballage Premium</Text>
                            <Text style={styles.wrapSubtitle}>Papier cadeau élégant + carte manuscrite</Text>
                        </View>
                        <View style={styles.wrapRight}>
                            <Text style={styles.wrapPrice}>+5€</Text>
                            <View style={[styles.wrapCheckbox, premiumWrap && styles.wrapCheckboxActive]}>
                                {premiumWrap && <Text style={styles.wrapCheck}>✓</Text>}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Buy CTA */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Total</Text>
                    <Text style={styles.priceValue}>{product.price + (premiumWrap ? 5 : 0)}€</Text>
                </View>
                <TouchableOpacity style={styles.buyBtn} onPress={handleBuy} activeOpacity={0.85}>
                    <Text style={styles.buyBtnText}>Offrir ce cadeau  →</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const createStyles = (Colors: any) => StyleSheet.create({
    container: { flex: 1 },
    gallery: { height: 360, position: 'relative' },
    galleryImageWrap: { width: W, height: 360, backgroundColor: Colors.stone, alignItems: 'center', justifyContent: 'center' },
    galleryPlaceholder: { fontSize: 64 },
    backBtn: { position: 'absolute', left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
    backBtnText: { fontSize: 20, color: Colors.cream },
    galleryDots: { position: 'absolute', bottom: 16, width: '100%', flexDirection: 'row', justifyContent: 'center', gap: 6 },
    galleryDot: { height: 6, borderRadius: 3 },
    galleryDotActive: { width: 20, backgroundColor: Colors.cream },
    galleryDotInactive: { width: 6, backgroundColor: 'rgba(255,255,255,0.35)' },
    galleryGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
    scrollContent: { flex: 1 },
    productHeader: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.lg },
    productHeaderTop: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    categoryBadge: { backgroundColor: Colors.stone, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
    categoryBadgeText: { fontSize: 11, fontFamily: Typography.medium, color: Colors.muted },
    expressBadge: { backgroundColor: Colors.gold + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.gold + '44' },
    expressBadgeText: { fontSize: 11, fontFamily: Typography.semibold, color: Colors.gold },
    productName: { fontSize: Typography.xl, fontFamily: Typography.bold, color: Colors.cream, letterSpacing: -0.6, lineHeight: 28, marginBottom: 4 },
    sellerName: { fontSize: Typography.sm, fontFamily: Typography.medium, color: Colors.muted, marginBottom: 10 },
    ratingRow: { flexDirection: 'row', alignItems: 'center' },
    stars: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.gold },
    ratingCount: { fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.muted },
    aiCard: { marginHorizontal: Spacing.xl, padding: Spacing.xl, backgroundColor: Colors.charcoal, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.gold + '33', marginBottom: Spacing.xl },
    aiCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    aiIcon: { fontSize: 16, color: Colors.gold },
    aiTitle: { fontSize: Typography.sm, fontFamily: Typography.bold, color: Colors.cream },
    aiText: { fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.muted, lineHeight: 20, marginBottom: 12 },
    matchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    matchBar: { flex: 1, height: 4, backgroundColor: Colors.warm, borderRadius: 2 },
    matchFill: { height: 4, backgroundColor: Colors.gold, borderRadius: 2 },
    matchPercent: { fontSize: Typography.xs, fontFamily: Typography.semibold, color: Colors.gold },
    section: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.xl },
    sectionTitle: { fontSize: Typography.sm, fontFamily: Typography.bold, color: Colors.cream, marginBottom: 12 },
    description: { fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.muted, lineHeight: 22 },
    features: { gap: 10 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    featureIcon: { fontSize: 14, color: Colors.gold, fontFamily: Typography.bold },
    featureText: { fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.cream },
    wrapToggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, backgroundColor: Colors.charcoal, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.warm },
    wrapToggleActive: { borderColor: Colors.gold },
    wrapTitle: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.cream, marginBottom: 3 },
    wrapSubtitle: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted },
    wrapRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    wrapPrice: { fontSize: Typography.sm, fontFamily: Typography.bold, color: Colors.cream },
    wrapCheckbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: Colors.warm, alignItems: 'center', justifyContent: 'center' },
    wrapCheckboxActive: { borderColor: Colors.gold, backgroundColor: Colors.gold },
    wrapCheck: { fontSize: 12, color: Colors.obsidian, fontFamily: Typography.bold },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: Spacing.xl, paddingTop: 16, backgroundColor: Colors.obsidian + 'E6', borderTopWidth: 1, borderTopColor: Colors.warm },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    priceLabel: { fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.muted },
    priceValue: { fontSize: Typography.lg, fontFamily: Typography.bold, color: Colors.cream },
    buyBtn: { backgroundColor: Colors.gold, paddingVertical: 16, borderRadius: Radius.full, alignItems: 'center' },
    buyBtnText: { fontSize: Typography.base, fontFamily: Typography.semibold, color: Colors.obsidian },
});
