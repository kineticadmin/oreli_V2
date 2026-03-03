import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
    Dimensions,
    ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/Typography';
import { closeOnes, products, heroSlides } from '@/data/mockData';
import { useGiftStore } from '@/store/giftStore';

const { width: SCREEN_W } = Dimensions.get('window');
const HERO_H = 320;

export default function HomeScreen() {
    const Colors = useThemeColors();
  const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();
    const [activeSlide, setActiveSlide] = useState(0);
    const heroRef = useRef<FlatList>(null);
    const setSelectedPerson = useGiftStore((s) => s.setSelectedPerson);
    const setSelectedProduct = useGiftStore((s) => s.setSelectedProduct);

    // Auto-scroll hero
    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => {
                const next = (prev + 1) % heroSlides.length;
                heroRef.current?.scrollToIndex({ index: next, animated: true });
                return next;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems[0]) setActiveSlide(viewableItems[0].index ?? 0);
        },
        []
    );

    const renderHeroSlide = ({ item }: { item: typeof heroSlides[0] }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.heroSlide}
            onPress={() => router.push('/gift-flow')}
        >
            <ImageBackground source={{ uri: item.image }} style={styles.heroImage}>
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.72)']}
                    style={styles.heroGradient}
                >
                    <Text style={styles.heroBadge}>{item.badge.toUpperCase()}</Text>
                    <Text style={styles.heroTitle}>{item.title}</Text>
                    <Text style={styles.heroSubtitle}>{item.subtitle}</Text>
                    <View style={styles.heroCta}>
                        <Text style={styles.heroCtaText}>{item.cta}  →</Text>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    );

    const theme = useGiftStore((s) => s.theme);
    const setTheme = useGiftStore((s) => s.setTheme);
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <View style={[styles.container, { backgroundColor: Colors.obsidian }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                    <Text style={[styles.logo, { color: Colors.cream }]}>Oreli</Text>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.notifBtn} onPress={toggleTheme}>
                            <Text style={[styles.notifIcon, { color: Colors.cream }]}>
                                {theme === 'dark' ? '☀' : '☾'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.notifBtn}>
                            <Text style={[styles.notifIcon, { color: Colors.cream }]}>♪</Text>
                            <View style={[styles.notifDot, { backgroundColor: Colors.gold }]} />
                        </TouchableOpacity>
                        <View style={[styles.avatar, { backgroundColor: Colors.gold }]}>
                            <Text style={[styles.avatarText, { color: Colors.obsidian }]}>B</Text>
                        </View>
                    </View>
                </View>

                {/* Greeting */}
                <View style={styles.greeting}>
                    <Text style={styles.greetingTitle}>Bonjour, Brunell</Text>
                    <View style={styles.greetingRow}>
                        <Text style={styles.greetingMuted}>L'anniversaire de Sophie dans</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>12 jours</Text>
                        </View>
                    </View>
                </View>

                {/* Hero Slider */}
                <View style={styles.heroContainer}>
                    <FlatList
                        ref={heroRef}
                        data={heroSlides}
                        renderItem={renderHeroSlide}
                        keyExtractor={(i) => i.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                        style={{ borderRadius: Radius['2xl'], overflow: 'hidden' }}
                    />
                    {/* Dots */}
                    <View style={styles.heroDots}>
                        {heroSlides.map((_, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => {
                                    heroRef.current?.scrollToIndex({ index: i, animated: true });
                                    setActiveSlide(i);
                                }}
                            >
                                <View
                                    style={[
                                        styles.dot,
                                        i === activeSlide ? styles.dotActive : styles.dotInactive,
                                    ]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Close Ones */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Tes proches</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>Voir tout</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {/* Add button */}
                        <TouchableOpacity
                            style={styles.closeOneItem}
                            activeOpacity={0.7}
                            onPress={() => router.push('/add-close-one')}
                        >
                            <View style={styles.addAvatar}>
                                <Text style={styles.addAvatarIcon}>+</Text>
                            </View>
                            <Text style={styles.closeOneName}>Ajouter</Text>
                        </TouchableOpacity>

                        {closeOnes.map((person) => (
                            <TouchableOpacity
                                key={person.id}
                                style={styles.closeOneItem}
                                activeOpacity={0.7}
                                onPress={() => {
                                    setSelectedPerson(person);
                                    router.push('/gift-flow');
                                }}
                            >
                                <View style={styles.closeOneAvatarWrapper}>
                                    <View style={styles.closeOneAvatar}>
                                        <Text style={styles.closeOneAvatarText}>{person.avatar}</Text>
                                    </View>
                                    {person.daysUntilEvent && person.daysUntilEvent < 14 && (
                                        <View style={styles.eventBadge}>
                                            <Text style={styles.eventBadgeText}>{person.daysUntilEvent}j</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.closeOneName}>{person.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Products */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Sélectionné pour toi</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>Voir tout »</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {products.map((product) => (
                            <TouchableOpacity
                                key={product.id}
                                style={styles.productCard}
                                activeOpacity={0.85}
                                onPress={() => {
                                    setSelectedProduct(product);
                                    router.push(`/product/${product.id}`);
                                }}
                            >
                                <ImageBackground
                                    source={{ uri: product.images[0] }}
                                    style={styles.productImage}
                                    imageStyle={{ borderRadius: Radius.xl }}
                                >
                                    <LinearGradient
                                        colors={['transparent', 'rgba(0,0,0,0.75)']}
                                        style={styles.productGradient}
                                    />
                                    <TouchableOpacity style={styles.heartBtn}>
                                        <Text style={styles.heartIcon}>♡</Text>
                                    </TouchableOpacity>
                                </ImageBackground>
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName} numberOfLines={2}>
                                        {product.name}
                                    </Text>
                                    <Text style={styles.productSeller}>{product.seller}</Text>
                                    <View style={styles.productMeta}>
                                        <Text style={styles.productPrice}>{product.price}€</Text>
                                        <Text style={styles.productRating}>★ {product.rating}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Upcoming events */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Événements à venir</Text>
                    <View style={styles.eventsList}>
                        {closeOnes
                            .filter((p) => p.eventDate)
                            .map((person) => (
                                <TouchableOpacity
                                    key={person.id}
                                    style={styles.eventCard}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        setSelectedPerson(person);
                                        router.push('/gift-flow');
                                    }}
                                >
                                    <View style={styles.eventAvatar}>
                                        <Text style={styles.eventAvatarText}>{person.avatar}</Text>
                                    </View>
                                    <View style={styles.eventInfo}>
                                        <Text style={styles.eventName}>{person.name}</Text>
                                        <Text style={styles.eventType}>
                                            {person.eventType} · {person.eventDate}
                                        </Text>
                                    </View>
                                    {person.daysUntilEvent !== undefined && (
                                        <View style={styles.eventDays}>
                                            <Text style={styles.eventDaysText}>{person.daysUntilEvent}j</Text>
                                        </View>
                                    )}
                                    <Text style={styles.arrowIcon}>›</Text>
                                </TouchableOpacity>
                            ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const createStyles = (Colors: any) => StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.md,
    },
    logo: {
        fontSize: Typography.md,
        fontFamily: Typography.bold,
        color: Colors.cream,
        letterSpacing: -0.5,
    },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    notifBtn: { position: 'relative' },
    notifIcon: { fontSize: 18, color: Colors.cream },
    notifDot: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.gold,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.gold,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: Colors.obsidian,
        fontSize: Typography.sm,
        fontFamily: Typography.bold,
    },
    greeting: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg },
    greetingTitle: {
        fontSize: Typography['2xl'],
        fontFamily: Typography.bold,
        color: Colors.cream,
        letterSpacing: -0.8,
        marginBottom: 6,
    },
    greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    greetingMuted: {
        fontSize: Typography.sm,
        fontFamily: Typography.regular,
        color: Colors.muted,
    },
    badge: {
        backgroundColor: Colors.gold,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: Radius.full,
    },
    badgeText: {
        fontSize: 11,
        fontFamily: Typography.bold,
        color: Colors.obsidian,
    },
    heroContainer: { marginHorizontal: Spacing.xl, marginBottom: Spacing.xl },
    heroSlide: {
        width: SCREEN_W - Spacing.xl * 2,
        height: HERO_H,
        borderRadius: Radius['2xl'],
        overflow: 'hidden',
    },
    heroImage: { flex: 1 },
    heroGradient: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: Spacing.xl,
    },
    heroBadge: {
        fontSize: 10,
        fontFamily: Typography.semibold,
        color: Colors.gold,
        letterSpacing: 2,
        marginBottom: 8,
    },
    heroTitle: {
        fontSize: Typography['2xl'],
        fontFamily: Typography.bold,
        color: Colors.cream,
        letterSpacing: -0.6,
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: Typography.sm,
        fontFamily: Typography.regular,
        color: 'rgba(250,250,249,0.60)',
        marginBottom: 16,
    },
    heroCta: {
        backgroundColor: Colors.gold,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: Radius.full,
        alignSelf: 'flex-start',
    },
    heroCtaText: {
        fontSize: Typography.sm,
        fontFamily: Typography.semibold,
        color: Colors.obsidian,
    },
    heroDots: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 6,
        marginTop: 10,
    },
    dot: { height: 6, borderRadius: 3 },
    dotActive: { width: 20, backgroundColor: Colors.cream },
    dotInactive: { width: 6, backgroundColor: Colors.warm },
    section: { paddingHorizontal: Spacing.xl, marginBottom: Spacing['3xl'] },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: Typography.md,
        fontFamily: Typography.bold,
        color: Colors.cream,
        letterSpacing: -0.3,
    },
    seeAll: {
        fontSize: Typography.xs,
        fontFamily: Typography.medium,
        color: Colors.muted,
    },
    closeOneItem: {
        alignItems: 'center',
        marginRight: Spacing.xl,
        gap: 6,
    },
    addAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: Colors.warm,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addAvatarIcon: { fontSize: 22, color: Colors.muted },
    closeOneAvatarWrapper: { position: 'relative' },
    closeOneAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.stone,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.warm,
    },
    closeOneAvatarText: {
        fontSize: Typography.md,
        fontFamily: Typography.bold,
        color: Colors.cream,
    },
    eventBadge: {
        position: 'absolute',
        bottom: -2,
        left: '50%',
        transform: [{ translateX: -14 }],
        backgroundColor: Colors.gold,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: Radius.full,
        minWidth: 28,
        alignItems: 'center',
    },
    eventBadgeText: {
        fontSize: 8,
        fontFamily: Typography.bold,
        color: Colors.obsidian,
    },
    closeOneName: {
        fontSize: 11,
        fontFamily: Typography.medium,
        color: Colors.muted,
        marginTop: 4,
    },
    productCard: {
        width: 170,
        marginRight: Spacing.md,
        backgroundColor: Colors.charcoal,
        borderRadius: Radius.xl,
        overflow: 'hidden',
        ...Shadow.card,
    },
    productImage: { width: '100%', height: 150, position: 'relative' },
    productGradient: { ...StyleSheet.absoluteFillObject },
    heartBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.40)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heartIcon: { fontSize: 16, color: Colors.cream },
    productInfo: { padding: 12 },
    productName: {
        fontSize: Typography.sm,
        fontFamily: Typography.semibold,
        color: Colors.cream,
        lineHeight: 18,
        marginBottom: 4,
    },
    productSeller: {
        fontSize: 11,
        fontFamily: Typography.regular,
        color: Colors.muted,
        marginBottom: 8,
    },
    productMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    productPrice: {
        fontSize: Typography.base,
        fontFamily: Typography.bold,
        color: Colors.cream,
    },
    productRating: {
        fontSize: 11,
        fontFamily: Typography.regular,
        color: Colors.gold,
    },
    eventsList: { gap: Spacing.sm },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        padding: Spacing.lg,
        backgroundColor: Colors.charcoal,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.warm,
    },
    eventAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.stone,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.warm,
    },
    eventAvatarText: {
        fontSize: Typography.sm,
        fontFamily: Typography.bold,
        color: Colors.cream,
    },
    eventInfo: { flex: 1 },
    eventName: {
        fontSize: Typography.sm,
        fontFamily: Typography.semibold,
        color: Colors.cream,
    },
    eventType: {
        fontSize: Typography.xs,
        fontFamily: Typography.regular,
        color: Colors.muted,
        marginTop: 2,
    },
    eventDays: {
        backgroundColor: Colors.gold,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: Radius.full,
    },
    eventDaysText: {
        fontSize: Typography.xs,
        fontFamily: Typography.bold,
        color: Colors.obsidian,
    },
    arrowIcon: { fontSize: 20, color: Colors.muted },
});
