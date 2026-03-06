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
    const { data: productsPages, isLoading: isLoadingProducts } = useProductsList({ limit: 20 });

    const allProducts = productsPages?.pages.flatMap((page) => page.items) ?? [];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Découvrir</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
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
                                    activeOpacity={0.85}
                                    onPress={() => router.push(`/product/${product.id}` as never)}
                                >
                                    <ImageBackground
                                        source={product.coverImageUrl ? { uri: product.coverImageUrl } : undefined}
                                        style={styles.featuredImage}
                                        imageStyle={{ borderRadius: Radius.xl }}
                                    >
                                        <LinearGradient
                                            colors={['transparent', 'rgba(0,0,0,0.80)']}
                                            style={styles.featuredGradient}
                                        >
                                            {product.isLastMinuteOk && (
                                                <View style={styles.matchBadge}>
                                                    <Text style={styles.matchBadgeText}>⚡ Rapide</Text>
                                                </View>
                                            )}
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
                                    activeOpacity={0.85}
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
    gridImage: {
        width: '100%',
        height: 130,
    },
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
    gridInfo: { padding: 10, gap: 3 },
    gridName: { fontSize: Typography.xs, fontFamily: Typography.semibold, color: Colors.cream, lineHeight: 16 },
    gridSeller: { fontSize: 10, fontFamily: Typography.regular, color: Colors.muted },
    gridPrice: { fontSize: Typography.sm, fontFamily: Typography.bold, color: Colors.gold, marginTop: 2 },
});
