import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    Image,
    StyleSheet,
    Dimensions,
    Animated as RNAnimated,
    LayoutAnimation,
    ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius } from '@/constants/Typography';
import { useGiftStore } from '@/store/giftStore';
import { useCuratedProducts, formatPrice } from '@/hooks/useCatalog';
import { useRelationships } from '@/hooks/useRelationships';
import { useProfile } from '@/hooks/useProfile';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_W * 0.72;
const CARD_HEIGHT = 400;

const EVENT_TYPE_LABELS: Record<string, string> = {
    birthday: 'Anniversaire',
    anniversary: 'Anniversaire de relation',
    valentine: 'Saint-Valentin',
    birth: 'Naissance',
    wedding: 'Mariage',
    parent_day: 'Fête des parents',
    retirement: 'Retraite',
    thank_you: 'Remerciement',
    other: 'Événement',
};

function formatEventDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('fr-BE', { day: 'numeric', month: 'short' });
}

function urgencyColor(daysUntil: number, Colors: ThemeColors): string {
    if (daysUntil <= 3) return Colors.danger ?? '#E53935';
    if (daysUntil <= 7) return '#F57C00';
    return Colors.success ?? '#43A047';
}

export default function HomeScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();

    const setSelectedPerson = useGiftStore((s) => s.setSelectedPerson);
    const userName = useGiftStore((s) => s.userName);

    const { data: profile } = useProfile();
    const { data: curatedProducts, isLoading: isLoadingCurated } = useCuratedProducts();
    const { data: relationships, isLoading: isLoadingRelationships } = useRelationships();

    const [showBottomCTA, setShowBottomCTA] = useState(false);
    const [isTypingBottom, setIsTypingBottom] = useState(true);
    const scrollX = React.useRef(new RNAnimated.Value(0)).current;

    const displayName = profile?.firstName ?? userName;
    const avatarInitial = displayName.charAt(0).toUpperCase();

    const closeOnes = (relationships ?? []).map((rel) => {
        const nearestEvent = rel.upcomingEvents[0];
        return {
            id: rel.id,
            name: rel.displayName,
            relationshipType: rel.relationshipType,
            avatar: rel.displayName.charAt(0).toUpperCase(),
            daysUntilEvent: nearestEvent?.daysUntil,
            eventType: nearestEvent?.eventType ?? null,
            eventDate: nearestEvent?.eventDate ?? null,
            apiId: rel.id,
            preferences: rel.preferences,
        };
    });

    const upcomingEvents = closeOnes
        .filter((p) => p.eventDate && p.daysUntilEvent !== undefined)
        .sort((a, b) => (a.daysUntilEvent ?? 999) - (b.daysUntilEvent ?? 999))
        .slice(0, 3);

    const nextEvent = upcomingEvents[0];

    // Hero slides depuis les produits curatedProducts
    const heroSlides = (curatedProducts ?? []).slice(0, 5);

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
                scrollEventThrottle={16}
                onScroll={(e) => {
                    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
                    const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 150;
                    if (isNearBottom && !showBottomCTA) {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setShowBottomCTA(true);
                        setIsTypingBottom(true);
                        setTimeout(() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setIsTypingBottom(false);
                        }, 2000);
                    }
                }}
            >
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.logoText}>
                            Orel<Text style={{ color: Colors.gold }}>i</Text>
                        </Text>
                        <TouchableOpacity
                            style={styles.oreliMessageContainer}
                            activeOpacity={0.8}
                            onPress={() => {
                                if (nextEvent) setSelectedPerson(nextEvent);
                                router.push('/gift-flow');
                            }}
                        >
                            <View style={styles.oreliMessageAvatar}>
                                <Text style={styles.oreliMessageAvatarText}>O</Text>
                            </View>
                            <View style={styles.oreliMessageBubble}>
                                <Text style={styles.oreliMessageText}>
                                    <Text style={{ fontFamily: Typography.bold }}>Bonjour {displayName}, </Text>
                                    {nextEvent
                                        ? <Text>{EVENT_TYPE_LABELS[nextEvent.eventType ?? ''] ?? 'Événement'} de {nextEvent.name} dans {nextEvent.daysUntilEvent} jours. On lui trouve un cadeau ? <Feather name="gift" size={14} color={Colors.gold} /></Text>
                                        : <Text>prêt(e) à faire plaisir à tes proches aujourd'hui ? <Feather name="star" size={14} color={Colors.gold} /></Text>}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Avatar initiales */}
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{avatarInitial}</Text>
                    </View>
                </View>

                {/* Hero Slider — produits curatedProducts */}
                <View style={styles.heroContainer}>
                    {isLoadingCurated ? (
                        <View style={styles.heroPlaceholder}>
                            <ActivityIndicator color={Colors.gold} />
                        </View>
                    ) : heroSlides.length === 0 ? null : (
                        <RNAnimated.FlatList
                            data={heroSlides}
                            renderItem={({ item, index }) => {
                                const ITEM_SIZE = CARD_WIDTH + Spacing.lg;
                                const inputRange = [
                                    (index - 1) * ITEM_SIZE,
                                    index * ITEM_SIZE,
                                    (index + 1) * ITEM_SIZE,
                                ];
                                const rotate = scrollX.interpolate({ inputRange, outputRange: ['2deg', '0deg', '-2deg'], extrapolate: 'clamp' });
                                const scale = scrollX.interpolate({ inputRange, outputRange: [0.9, 1, 0.9], extrapolate: 'clamp' });

                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        style={styles.heroCard}
                                        onPress={() => router.push(`/product/${item.id}` as never)}
                                    >
                                        <RNAnimated.View style={{ flex: 1, transform: [{ rotate }, { scale }] }}>
                                            <ImageBackground
                                                source={item.coverImageUrl ? { uri: item.coverImageUrl } : undefined}
                                                style={styles.heroImage}
                                                imageStyle={{ borderRadius: Radius['2xl'] }}
                                            >
                                                {!item.coverImageUrl && (
                                                    <View style={styles.heroImageFallback}>
                                                        <Feather name="gift" size={48} color={Colors.muted} />
                                                    </View>
                                                )}
                                                <LinearGradient
                                                    colors={['transparent', 'rgba(0,0,0,0.82)']}
                                                    style={styles.heroGradient}
                                                >
                                                    {item.isLastMinuteOk && (
                                                        <View style={styles.heroBadge}>
                                                            <Text style={styles.heroBadgeText}>⚡ Livraison rapide</Text>
                                                        </View>
                                                    )}
                                                    <Text style={styles.heroTitle} numberOfLines={2}>{item.title}</Text>
                                                    <View style={styles.heroLocation}>
                                                        <Feather name="map-pin" size={12} color="#fff" />
                                                        <Text style={styles.heroSubtitle}>{item.seller.displayName}</Text>
                                                        <Text style={styles.heroPrice}>{formatPrice(item.priceAmount, item.currency)}</Text>
                                                    </View>
                                                </LinearGradient>
                                            </ImageBackground>
                                        </RNAnimated.View>
                                    </TouchableOpacity>
                                );
                            }}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={CARD_WIDTH + Spacing.lg}
                            decelerationRate="fast"
                            scrollEventThrottle={16}
                            onScroll={RNAnimated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                { useNativeDriver: true }
                            )}
                            contentContainerStyle={{ paddingHorizontal: Spacing.xl }}
                            ItemSeparatorComponent={() => <View style={{ width: Spacing.lg }} />}
                        />
                    )}
                </View>

                {/* Événements à venir */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Événements à venir</Text>
                    {isLoadingRelationships ? (
                        <ActivityIndicator color={Colors.gold} style={{ marginTop: 8 }} />
                    ) : upcomingEvents.length === 0 ? (
                        <TouchableOpacity
                            style={styles.emptyState}
                            onPress={() => router.push('/add-close-one')}
                            activeOpacity={0.8}
                        >
                            <Feather name="calendar" size={24} color={Colors.muted} />
                            <Text style={styles.emptyStateText}>Ajoute un proche pour voir ses événements ici</Text>
                            <Text style={styles.emptyStateLink}>+ Ajouter un proche</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.eventsList}>
                            {upcomingEvents.map((person) => {
                                const badgeColor = urgencyColor(person.daysUntilEvent ?? 99, Colors);
                                const eventLabel = EVENT_TYPE_LABELS[person.eventType ?? ''] ?? 'Événement';
                                const dateLabel = person.eventDate ? formatEventDate(person.eventDate) : '';
                                return (
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
                                            <Text style={styles.eventType}>{eventLabel} · {dateLabel}</Text>
                                        </View>
                                        <View style={[styles.eventBadge, { backgroundColor: badgeColor + '22', borderColor: badgeColor + '55' }]}>
                                            <Text style={[styles.eventBadgeText, { color: badgeColor }]}>J-{person.daysUntilEvent}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>

                {/* Tes proches */}
                <View style={[styles.section, { marginTop: Spacing.xl }]}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>Tes proches</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/close' as never)}>
                            <Text style={styles.seeAll}>Voir »</Text>
                        </TouchableOpacity>
                    </View>

                    {isLoadingRelationships ? (
                        <ActivityIndicator color={Colors.gold} />
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: Spacing.lg }}>
                            <TouchableOpacity
                                style={styles.closeOneItem}
                                activeOpacity={0.7}
                                onPress={() => router.push('/add-close-one')}
                            >
                                <View style={styles.addAvatar}>
                                    <Feather name="plus" size={24} color={Colors.gold} />
                                </View>
                                <Text style={styles.closeOneName}>Nouveau</Text>
                            </TouchableOpacity>

                            {closeOnes.length === 0 ? (
                                <View style={styles.closeOneEmpty}>
                                    <Text style={styles.closeOneEmptyText}>Aucun proche ajouté</Text>
                                </View>
                            ) : (
                                closeOnes.map((person) => (
                                    <TouchableOpacity
                                        key={person.id}
                                        style={styles.closeOneItem}
                                        activeOpacity={0.7}
                                        onPress={() => {
                                            setSelectedPerson(person);
                                            router.push('/gift-flow');
                                        }}
                                    >
                                        <View style={styles.closeOneAvatar}>
                                            <Text style={styles.closeOneAvatarText}>{person.avatar}</Text>
                                        </View>
                                        <Text style={styles.closeOneName}>{person.name}</Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    )}
                </View>

                {/* Sélection du moment */}
                {(isLoadingCurated || (curatedProducts && curatedProducts.length > 0)) && (
                    <View style={[styles.section, { marginTop: Spacing.xl }]}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>Sélection du moment</Text>
                            <TouchableOpacity onPress={() => router.push('/(tabs)/gifts')}>
                                <Text style={styles.seeAll}>Voir tout »</Text>
                            </TouchableOpacity>
                        </View>

                        {isLoadingCurated ? (
                            <ActivityIndicator color={Colors.gold} />
                        ) : (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: Spacing.md }}>
                                {(curatedProducts ?? []).map((product) => (
                                    <TouchableOpacity
                                        key={product.id}
                                        style={styles.productCard}
                                        activeOpacity={0.85}
                                        onPress={() => router.push(`/product/${product.id}` as never)}
                                    >
                                        <View style={styles.productImageContainer}>
                                            {product.coverImageUrl ? (
                                                <Image source={{ uri: product.coverImageUrl }} style={styles.productImage} />
                                            ) : (
                                                <View style={[styles.productImage, styles.productImageFallback]}>
                                                    <Feather name="gift" size={28} color={Colors.muted} />
                                                </View>
                                            )}
                                            {product.isLastMinuteOk && (
                                                <View style={styles.lastMinuteBadge}>
                                                    <Text style={styles.lastMinuteBadgeText}>⚡ Rapide</Text>
                                                </View>
                                            )}
                                        </View>
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
                                            <Text style={styles.productSeller} numberOfLines={1}>{product.seller.displayName}</Text>
                                            <Text style={styles.productPrice}>{formatPrice(product.priceAmount, product.currency)}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                )}

                {/* Bottom CTA Oreli */}
                {showBottomCTA && (
                    <View style={styles.bottomCtaContainer}>
                        <TouchableOpacity
                            style={styles.oreliMessageContainerBottom}
                            activeOpacity={0.8}
                            onPress={() => router.push('/gift-flow')}
                        >
                            <View style={styles.oreliMessageAvatar}>
                                <Text style={styles.oreliMessageAvatarText}>O</Text>
                            </View>
                            <View style={[styles.oreliMessageBubbleBottom, isTypingBottom && styles.typingBubble]}>
                                {isTypingBottom ? (
                                    <View style={styles.typingIndicator}>
                                        <Text style={styles.typingDot}>•</Text>
                                        <Text style={styles.typingDot}>•</Text>
                                        <Text style={styles.typingDot}>•</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.oreliMessageText}>
                                        <Text style={{ fontFamily: Typography.bold }}>Je peux t'aider à choisir le cadeau parfait, allons-y ! </Text>
                                        <Feather name="arrow-right" size={14} color={Colors.gold} />
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
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
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        marginBottom: Spacing['2xl'],
    },
    headerTextContainer: { flex: 1, paddingRight: Spacing.md },
    logoText: {
        fontSize: Typography['2xl'],
        fontFamily: Typography.bold,
        color: Colors.cream,
        letterSpacing: -1,
        marginBottom: Spacing.xs,
    },
    oreliMessageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: Spacing.md,
        gap: Spacing.sm,
        paddingRight: Spacing.md,
    },
    oreliMessageAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.goldPale,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    oreliMessageAvatarText: {
        fontSize: Typography.xs,
        fontFamily: Typography.bold,
        color: Colors.gold,
    },
    oreliMessageBubble: {
        flex: 1,
        backgroundColor: Colors.charcoal,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.lg,
        borderTopLeftRadius: 4,
    },
    oreliMessageBubbleBottom: {
        flex: 1,
        backgroundColor: Colors.charcoal,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        borderRadius: Radius['2xl'],
    },
    oreliMessageText: {
        fontSize: Typography.sm,
        fontFamily: Typography.medium,
        color: Colors.cream,
        lineHeight: Typography.sm * 1.4,
    },
    typingBubble: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        alignSelf: 'flex-start',
    },
    typingIndicator: { flexDirection: 'row', alignItems: 'center', gap: 2, height: 20 },
    typingDot: { fontSize: Typography.lg, color: Colors.muted, lineHeight: Typography.lg },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.gold,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.warm,
    },
    avatarText: {
        fontSize: Typography.md,
        fontFamily: Typography.bold,
        color: Colors.obsidian,
    },
    heroContainer: { marginBottom: Spacing['2xl'] },
    heroPlaceholder: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginHorizontal: Spacing.xl,
        borderRadius: Radius['2xl'],
        backgroundColor: Colors.charcoal,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroCard: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: Radius['2xl'],
        shadowColor: Colors.gold,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 6,
        overflow: 'visible',
    },
    heroImage: { flex: 1 },
    heroImageFallback: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.charcoal,
        borderRadius: Radius['2xl'],
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroGradient: {
        flex: 1,
        borderRadius: Radius['2xl'],
        justifyContent: 'flex-end',
        padding: Spacing.xl,
        gap: 6,
    },
    heroBadge: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.gold,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: Radius.full,
        marginBottom: 4,
    },
    heroBadgeText: { fontSize: 10, fontFamily: Typography.bold, color: Colors.obsidian },
    heroTitle: {
        fontSize: Typography['2xl'],
        fontFamily: Typography.bold,
        color: '#fff',
        letterSpacing: -0.5,
    },
    heroLocation: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    heroSubtitle: { fontSize: Typography.sm, fontFamily: Typography.medium, color: '#fff', flex: 1 },
    heroPrice: { fontSize: Typography.sm, fontFamily: Typography.bold, color: Colors.gold },
    section: { paddingHorizontal: Spacing.xl },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: Typography.lg,
        fontFamily: Typography.bold,
        color: Colors.cream,
        marginBottom: Spacing.lg,
        letterSpacing: -0.5,
    },
    seeAll: { fontSize: Typography.sm, fontFamily: Typography.medium, color: Colors.muted },
    emptyState: {
        backgroundColor: Colors.charcoal,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.warm,
        borderStyle: 'dashed',
        padding: Spacing.xl,
        alignItems: 'center',
        gap: Spacing.sm,
    },
    emptyStateText: {
        fontSize: Typography.sm,
        fontFamily: Typography.regular,
        color: Colors.muted,
        textAlign: 'center',
    },
    emptyStateLink: {
        fontSize: Typography.sm,
        fontFamily: Typography.semibold,
        color: Colors.gold,
        marginTop: 4,
    },
    eventsList: { gap: Spacing.md },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        backgroundColor: Colors.charcoal,
        borderRadius: Radius['2xl'],
        gap: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.warm,
    },
    eventAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.stone,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventAvatarText: { fontSize: Typography.sm, fontFamily: Typography.bold, color: Colors.cream },
    eventInfo: { flex: 1, gap: 2 },
    eventName: { fontSize: Typography.md, fontFamily: Typography.bold, color: Colors.cream },
    eventType: { fontSize: Typography.xs, fontFamily: Typography.medium, color: Colors.muted },
    eventBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: Radius.full,
        borderWidth: 1,
    },
    eventBadgeText: { fontSize: Typography.xs, fontFamily: Typography.bold },
    closeOneItem: { alignItems: 'center', gap: 8 },
    closeOneEmpty: { justifyContent: 'center', paddingLeft: Spacing.lg },
    closeOneEmptyText: { fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.muted },
    addAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.charcoal,
        borderWidth: 1.5,
        borderColor: Colors.warm,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeOneAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.stone,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeOneAvatarText: { fontSize: Typography.lg, fontFamily: Typography.bold, color: Colors.cream },
    closeOneName: { fontSize: Typography.xs, fontFamily: Typography.semibold, color: Colors.muted },
    productCard: {
        width: 160,
        backgroundColor: Colors.charcoal,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.warm,
        overflow: 'hidden',
    },
    productImageContainer: { position: 'relative' },
    productImage: { width: 160, height: 140 },
    productImageFallback: {
        backgroundColor: Colors.stone,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lastMinuteBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: Colors.obsidian + 'cc',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: Radius.full,
    },
    lastMinuteBadgeText: { fontSize: 10, fontFamily: Typography.semibold, color: Colors.gold },
    productInfo: { padding: Spacing.md, gap: 3 },
    productTitle: {
        fontSize: Typography.sm,
        fontFamily: Typography.semibold,
        color: Colors.cream,
        lineHeight: Typography.sm * 1.3,
    },
    productSeller: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted },
    productPrice: { fontSize: Typography.sm, fontFamily: Typography.bold, color: Colors.gold, marginTop: 2 },
    bottomCtaContainer: {
        paddingHorizontal: Spacing.xl,
        marginTop: Spacing.xl,
        marginBottom: Spacing.xl,
    },
    oreliMessageContainerBottom: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: Spacing.sm,
    },
});
