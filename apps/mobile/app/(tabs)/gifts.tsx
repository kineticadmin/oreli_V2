import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Image,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/Typography';
import { useCuratedProducts, useProductsList, formatPrice } from '@/hooks/useCatalog';

const { width: W } = Dimensions.get('window');
const CARD_W = (W - Spacing.xl * 2 - Spacing.md) / 2;

export default function GiftsScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();

    const { data: curatedProducts, isLoading: isLoadingCurated } = useCuratedProducts();
    const {
        data: productsPages,
        isLoading: isLoadingProducts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useProductsList({ limit: 20 });

    const allProducts = productsPages?.pages.flatMap((page) => page.items) ?? [];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Découvrir</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                onScroll={({ nativeEvent }) => {
                    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                    const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;
                    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                scrollEventThrottle={400}
            >
                {/* Coups de cœur */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>✦  Coups de cœur</Text>
                    {isLoadingCurated ? (
                        <ActivityIndicator color={Colors.gold} style={{ marginTop: 20 }} />
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {(curatedProducts ?? []).map((product) => (
                                <TouchableOpacity
                                    key={product.id}
                                    style={styles.featuredCard}
                                    activeOpacity={0.88}
                                    onPress={() => router.push(`/product/${product.id}` as never)}
                                >
                                    <ImageBackground
                                        source={product.coverImageUrl ? { uri: product.coverImageUrl } : undefined}
                                        style={styles.featuredImage}
                                        imageStyle={{ borderRadius: Radius['2xl'] }}
                                    >
                                        <LinearGradient
                                            colors={['transparent', 'rgba(0,0,0,0.78)']}
                                            style={styles.featuredGradient}
                                        >
                                            {product.isLastMinuteOk && (
                                                <View style={styles.matchBadge}>
                                                    <Text style={styles.matchBadgeText}>⚡ Rapide</Text>
                                                </View>
                                            )}
                                            {/* Favorite floating button */}
                                            <View style={styles.favoriteBtn}>
                                                <Feather name="heart" size={14} color={Colors.cream} />
                                            </View>
                                            <Text style={styles.featuredName} numberOfLines={2}>{product.title}</Text>
                                            <Text style={styles.featuredPrice}>{formatPrice(product.priceAmount, product.currency)}</Text>
                                        </LinearGradient>
                                    </ImageBackground>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Toute la sélection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Toute la sélection</Text>
                    {isLoadingProducts ? (
                        <ActivityIndicator color={Colors.gold} style={{ marginTop: 20 }} />
                    ) : (
                        <View style={styles.grid}>
                            {allProducts.map((product) => (
                                <TouchableOpacity
                                    key={product.id}
                                    style={styles.gridCard}
                                    activeOpacity={0.88}
                                    onPress={() => router.push(`/product/${product.id}` as never)}
                                >
                                    <View style={styles.gridImageWrap}>
                                        {product.coverImageUrl ? (
                                            <Image source={{ uri: product.coverImageUrl }} style={styles.gridImage} />
                                        ) : (
                                            <Feather name="gift" size={32} color={Colors.muted} />
                                        )}
                                        {product.isLastMinuteOk && (
                                            <View style={styles.expressBadge}>
                                                <Text style={styles.expressBadgeText}>⚡</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.gridInfo}>
                                        <Text style={styles.gridName} numberOfLines={2}>{product.title}</Text>
                                        <Text style={styles.gridSeller} numberOfLines={1}>{product.seller.displayName}</Text>
                                        <Text style={styles.gridPrice}>{formatPrice(product.priceAmount, product.currency)}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    {isFetchingNextPage && (
                        <ActivityIndicator color={Colors.gold} style={{ marginTop: 16, marginBottom: 8 }} />
                    )}
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
    },
    headerTitle: {
        fontSize: Typography['2xl'],
        fontFamily: Typography.bold,
        color: Colors.cream,
        letterSpacing: -0.8,
    },
    section: { paddingHorizontal: Spacing.xl, marginTop: Spacing['2xl'] },
    sectionTitle: {
        fontSize: Typography.xs,
        fontFamily: Typography.semibold,
        color: Colors.muted,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: Spacing.lg,
    },
    // Featured carousel cards — image-forward, large, rounded
    featuredCard: {
        width: 220,
        height: 290,
        marginRight: Spacing.md,
        borderRadius: Radius['2xl'],
        overflow: 'hidden',
        ...Shadow.cardHover,
    },
    featuredImage: { flex: 1, justifyContent: 'flex-end' },
    featuredGradient: { flex: 1, justifyContent: 'flex-end', padding: 16 },
    favoriteBtn: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.20)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    matchBadge: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.gold,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: Radius.full,
        marginBottom: 8,
    },
    matchBadgeText: { fontSize: 10, fontFamily: Typography.bold, color: '#FFF' },
    featuredName: { fontSize: Typography.sm, fontFamily: Typography.bold, color: '#FFF', lineHeight: 18, marginBottom: 4 },
    featuredPrice: { fontSize: Typography.md, fontFamily: Typography.bold, color: Colors.goldLight },
    // Grid — white cards, shadow only (no borders)
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
    gridCard: {
        width: CARD_W,
        backgroundColor: Colors.charcoal,
        borderRadius: Radius.xl,
        overflow: 'hidden',
        ...Shadow.card,
    },
    gridImageWrap: {
        height: 148,
        backgroundColor: Colors.stone,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    gridImage: {
        width: '100%',
        height: 148,
    },
    expressBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.40)',
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    expressBadgeText: { fontSize: 12 },
    gridInfo: { padding: 12, gap: 3 },
    gridName: { fontSize: Typography.xs, fontFamily: Typography.semibold, color: Colors.cream, lineHeight: 16 },
    gridSeller: { fontSize: 10, fontFamily: Typography.regular, color: Colors.muted },
    gridPrice: { fontSize: Typography.sm, fontFamily: Typography.bold, color: Colors.cream, marginTop: 4 },
});
