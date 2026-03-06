import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/Typography';
import { products } from '@/data/mockData';
import { useGiftStore } from '@/store/giftStore';

const { width: W } = Dimensions.get('window');
const CARD_W = (W - Spacing.xl * 2 - Spacing.md) / 2;

export default function GiftsScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();
    const setSelectedProduct = useGiftStore((s) => s.setSelectedProduct);

    const topPicks = [...products].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mes cadeaux</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Top picks */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>✦  Coups de cœur</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {topPicks.map((product) => (
                            <TouchableOpacity
                                key={product.id}
                                style={styles.featuredCard}
                                activeOpacity={0.85}
                                onPress={() => {
                                    setSelectedProduct(product);
                                    router.push(`/product/${product.id}`);
                                }}
                            >
                                <ImageBackground
                                    source={{ uri: product.images[0] }}
                                    style={styles.featuredImage}
                                    imageStyle={{ borderRadius: Radius.xl }}
                                >
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.80)']}
                                        style={styles.featuredGradient}
                                    >
                                        <View style={styles.matchBadge}>
                                            <Text style={styles.matchBadgeText}>✦ {product.matchScore}%</Text>
                                        </View>
                                        <Text style={styles.featuredName} numberOfLines={2}>{product.name}</Text>
                                        <Text style={styles.featuredPrice}>{product.price}€</Text>
                                    </LinearGradient>
                                </ImageBackground>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* All products grid */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Toute la sélection</Text>
                    <View style={styles.grid}>
                        {products.map((product) => (
                            <TouchableOpacity
                                key={product.id}
                                style={styles.gridCard}
                                activeOpacity={0.85}
                                onPress={() => {
                                    setSelectedProduct(product);
                                    router.push(`/product/${product.id}`);
                                }}
                            >
                                <View style={styles.gridImageWrap}>
                                    <Text style={styles.gridImagePlaceholder}>📦</Text>
                                    {product.deliveryExpress && (
                                        <View style={styles.expressBadge}>
                                            <Text style={styles.expressBadgeText}>⚡</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.gridInfo}>
                                    <Text style={styles.gridName} numberOfLines={2}>{product.name}</Text>
                                    <View style={styles.gridMeta}>
                                        <Text style={styles.gridPrice}>{product.price}€</Text>
                                        <Text style={styles.gridRating}>★ {product.rating}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
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
    section: { paddingHorizontal: Spacing.xl, marginTop: Spacing['2xl'] },
    sectionTitle: { fontSize: Typography.md, fontFamily: Typography.bold, color: Colors.cream, letterSpacing: -0.3, marginBottom: Spacing.lg },
    featuredCard: {
        width: 200,
        height: 260,
        marginRight: Spacing.md,
        borderRadius: Radius.xl,
        overflow: 'hidden',
        ...Shadow.card,
    },
    featuredImage: { flex: 1, justifyContent: 'flex-end' },
    featuredGradient: { flex: 1, justifyContent: 'flex-end', padding: 14 },
    matchBadge: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.gold,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: Radius.full,
        marginBottom: 8,
    },
    matchBadgeText: { fontSize: 10, fontFamily: Typography.bold, color: Colors.obsidian },
    featuredName: { fontSize: Typography.sm, fontFamily: Typography.bold, color: Colors.cream, lineHeight: 18, marginBottom: 4 },
    featuredPrice: { fontSize: Typography.md, fontFamily: Typography.bold, color: Colors.gold },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
    gridCard: {
        width: CARD_W,
        backgroundColor: Colors.charcoal,
        borderRadius: Radius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.warm,
        ...Shadow.card,
    },
    gridImageWrap: {
        height: 130,
        backgroundColor: Colors.stone,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    gridImagePlaceholder: { fontSize: 36 },
    expressBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: Colors.gold + '33',
        borderWidth: 1,
        borderColor: Colors.gold + '66',
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    expressBadgeText: { fontSize: 12 },
    gridInfo: { padding: 10 },
    gridName: { fontSize: Typography.xs, fontFamily: Typography.semibold, color: Colors.cream, lineHeight: 16, marginBottom: 6 },
    gridMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    gridPrice: { fontSize: Typography.sm, fontFamily: Typography.bold, color: Colors.cream },
    gridRating: { fontSize: 10, fontFamily: Typography.regular, color: Colors.gold },
});
