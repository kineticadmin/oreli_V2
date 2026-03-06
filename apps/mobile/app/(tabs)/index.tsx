import React, { useState, useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, withDelay } from 'react-native-reanimated';
import {
    View,
    Text,
    ScrollView,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Image,
    StyleSheet,
    Dimensions,
    TextInput,
    Animated as RNAnimated,
    LayoutAnimation,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius } from '@/constants/Typography';
import { closeOnes, products, heroSlides } from '@/data/mockData';
import { useGiftStore } from '@/store/giftStore';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_W * 0.72;
const CARD_HEIGHT = 400;

const CATEGORIES = ['Populaire', 'Anniversaires', 'Mariages', 'Naissances', 'Surprises'];

export default function HomeScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();

    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
    const setSelectedPerson = useGiftStore((s) => s.setSelectedPerson);
    const userName = useGiftStore((s) => s.userName);
    const initial = userName.charAt(0).toUpperCase();

    // Typing effect state for bottom CTA
    const [showBottomCTA, setShowBottomCTA] = useState(false);
    const [isTypingBottom, setIsTypingBottom] = useState(true);

    const scrollX = React.useRef(new RNAnimated.Value(0)).current;

    // Find closest event
    const nextEvent = [...closeOnes]
        .filter((p) => p.eventDate && p.daysUntilEvent !== undefined)
        .sort((a, b) => (a.daysUntilEvent ?? 999) - (b.daysUntilEvent ?? 999))[0];



    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
                scrollEventThrottle={16}
                onScroll={(e) => {
                    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
                    const paddingToBottom = 150;
                    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
                        if (!showBottomCTA) {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setShowBottomCTA(true);
                            setIsTypingBottom(true);
                            setTimeout(() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                setIsTypingBottom(false);
                            }, 2000);
                        }
                    }
                }}
            >
                {/* Header: Logo, Greeting & Avatar */}
                <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.logoText}>
                            Orel<Text style={{ color: Colors.gold }}>i</Text>
                        </Text>
                        <TouchableOpacity
                            style={styles.oreliMessageContainer}
                            activeOpacity={0.8}
                            onPress={() => {
                                if (nextEvent) {
                                    setSelectedPerson(nextEvent);
                                    router.push('/gift-flow');
                                } else {
                                    router.push('/gift-flow');
                                }
                            }}
                        >
                            <View style={styles.oreliMessageAvatar}>
                                <Text style={styles.oreliMessageAvatarText}>O</Text>
                            </View>
                            <View style={styles.oreliMessageBubble}>
                                <Text style={styles.oreliMessageText}>
                                    <Text style={{ fontFamily: Typography.bold }}>Bonjour {userName}, </Text>
                                    {nextEvent
                                        ? <Text>c'est l'anniversaire de {nextEvent.name} dans {nextEvent.daysUntilEvent} jours. On lui trouve un cadeau ? <Feather name="gift" size={14} color={Colors.gold} /></Text>
                                        : <Text>prêt(e) à faire plaisir à tes proches aujourd'hui ? <Feather name="star" size={14} color={Colors.gold} /></Text>}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.avatar}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?u=brunell' }}
                            style={styles.avatarImage}
                        />
                    </View>
                </View>

                {/* Portrait Hero Slider */}
                <View style={styles.heroContainer}>
                    <RNAnimated.FlatList
                        data={heroSlides}
                        renderItem={({ item, index }: { item: typeof heroSlides[0], index: number }) => {
                            const ITEM_SIZE = CARD_WIDTH + Spacing.lg;
                            const inputRange = [
                                (index - 1) * ITEM_SIZE,
                                index * ITEM_SIZE,
                                (index + 1) * ITEM_SIZE
                            ];

                            const rotate = scrollX.interpolate({
                                inputRange,
                                outputRange: ['2deg', '0deg', '-2deg'],
                                extrapolate: 'clamp'
                            });

                            const scale = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.9, 1, 0.9],
                                extrapolate: 'clamp'
                            });

                            return (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    style={styles.heroCard}
                                    onPress={() => {
                                        if (index === 0) {
                                            router.push('/gift-flow');
                                        } else {
                                            router.push('/(tabs)/gifts');
                                        }
                                    }}
                                >
                                    <RNAnimated.View style={{ flex: 1, transform: [{ rotate }, { scale }] }}>
                                        <ImageBackground source={{ uri: item.image }} style={styles.heroImage} imageStyle={{ borderRadius: Radius['2xl'] }}>
                                            <LinearGradient
                                                colors={['transparent', 'rgba(0,0,0,0.8)']}
                                                style={styles.heroGradient}
                                            >
                                                <Text style={styles.heroTitle} numberOfLines={2}>{item.title}</Text>
                                                <View style={styles.heroLocation}>
                                                    <Feather name="map-pin" size={12} color={Colors.white} />
                                                    <Text style={styles.heroSubtitle}>{item.badge}</Text>
                                                </View>
                                            </LinearGradient>
                                        </ImageBackground>
                                    </RNAnimated.View>
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(i) => i.id}
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
                </View>

                {/* Événements à venir (Style Instructor/Horizontal cards) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Événements à venir</Text>

                    <View style={styles.eventsList}>
                        {closeOnes
                            .filter((p) => p.eventDate && p.daysUntilEvent !== undefined)
                            .sort((a, b) => (a.daysUntilEvent ?? 999) - (b.daysUntilEvent ?? 999))
                            .slice(0, 3)
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
                                    {person.avatarUrl ? (
                                        <Image source={{ uri: person.avatarUrl }} style={styles.eventAvatar} />
                                    ) : (
                                        <View style={styles.eventAvatar}>
                                            <Text style={styles.eventAvatarText}>{person.avatar}</Text>
                                        </View>
                                    )}

                                    <View style={styles.eventInfo}>
                                        <Text style={styles.eventName}>{person.name}</Text>
                                        <Text style={styles.eventType}>
                                            {person.eventDate}
                                        </Text>
                                    </View>

                                    {person.daysUntilEvent !== undefined && (
                                        <View style={styles.eventBadgeClean}>
                                            <Text style={styles.eventBadgeTextClean}>J-{person.daysUntilEvent}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                    </View>
                </View>

                {/* Tes Proches (Avatars) */}
                <View style={[styles.section, { marginTop: Spacing.xl }]}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>Tes proches</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>Voir »</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.xl, gap: Spacing.lg }}>
                        {/* Add button */}
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
                                {person.avatarUrl ? (
                                    <Image source={{ uri: person.avatarUrl }} style={styles.closeOneAvatar} />
                                ) : (
                                    <View style={styles.closeOneAvatar}>
                                        <Text style={styles.closeOneAvatarText}>{person.avatar}</Text>
                                    </View>
                                )}
                                <Text style={styles.closeOneName}>{person.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Bottom CTA (Oreli Message) */}
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
    container: {
        flex: 1,
        backgroundColor: Colors.obsidian, // '#FCFBF9' in light theme
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        marginBottom: Spacing['2xl'],
    },
    headerTextContainer: {
        flex: 1,
        paddingRight: Spacing.md,
    },
    logoText: {
        fontSize: Typography['2xl'],
        fontFamily: Typography.bold,
        color: Colors.cream, // Black/Dark text
        letterSpacing: -1,
        marginBottom: Spacing.xs,
    },
    greetingText: {
        fontSize: Typography.lg,
        fontFamily: Typography.semibold,
        color: Colors.cream,
        marginBottom: 2,
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
        shadowColor: Colors.cream,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    oreliMessageBubbleBottom: {
        backgroundColor: Colors.charcoal,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        borderRadius: Radius['2xl'],
        borderTopLeftRadius: Radius['2xl'], // Changed from 4 to Radius['2xl']
        // Removed shadow properties as they are not defined or consistent with other bubble
        flex: 1,
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
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        height: 20,
    },
    typingDot: {
        fontSize: Typography.lg,
        color: Colors.muted,
        lineHeight: Typography.lg,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.stone,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.warm,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    heroCategoryText: { // Just a placeholder if to replace anything else
    },
    heroContainer: {
        marginBottom: Spacing['2xl'],
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
    heroImage: {
        flex: 1,
    },
    heroGradient: {
        flex: 1,
        borderRadius: Radius['2xl'],
        justifyContent: 'flex-end',
        padding: Spacing.xl,
    },
    heroTitle: {
        fontSize: Typography['2xl'],
        fontFamily: Typography.bold,
        color: '#FFFFFF',
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    heroLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    heroSubtitle: {
        fontSize: Typography.sm,
        fontFamily: Typography.medium,
        color: '#FFFFFF',
    },
    section: {
        paddingHorizontal: Spacing.xl,
    },
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
    seeAll: {
        fontSize: Typography.sm,
        fontFamily: Typography.medium,
        color: Colors.muted,
    },
    eventsList: { gap: Spacing.md },
    eventCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        backgroundColor: Colors.charcoal, // White
        borderRadius: Radius['2xl'],
        gap: Spacing.md,
        shadowColor: Colors.cream,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 3,
    },
    eventAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.stone,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventAvatarText: {
        fontSize: Typography.sm,
        fontFamily: Typography.bold,
        color: Colors.cream,
    },
    eventInfo: { flex: 1, gap: 2 },
    eventName: {
        fontSize: Typography.md,
        fontFamily: Typography.bold,
        color: Colors.cream,
    },
    eventType: {
        fontSize: Typography.xs,
        fontFamily: Typography.medium,
        color: Colors.muted,
    },
    eventBadgeClean: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: Colors.stone,
        borderRadius: Radius.full,
    },
    eventBadgeTextClean: {
        fontSize: Typography.xs,
        fontFamily: Typography.bold,
        color: Colors.gold,
    },
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
    closeOneItem: {
        alignItems: 'center',
        gap: 8,
    },
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
        shadowColor: Colors.cream,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
    },
    closeOneAvatarText: {
        fontSize: Typography.lg,
        fontFamily: Typography.bold,
        color: Colors.cream,
    },
    closeOneName: {
        fontSize: Typography.xs,
        fontFamily: Typography.semibold,
        color: Colors.muted,
    },
});
