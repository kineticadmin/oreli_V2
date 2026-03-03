import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ImageBackground,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius } from '@/constants/Typography';

const { width: W, height: H } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=800&q=90',
        title: 'Offrir avec\nintention',
        subtitle: 'Fini les heures de recherche et le stress de dernière minute.',
    },
    {
        id: '2',
        image: 'https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=800&q=90',
        title: 'On comprend\nceux que\ntu aimes',
        subtitle: 'Notre IA apprend les goûts de tes proches et propose des cadeaux parfaits.',
    },
    {
        id: '3',
        image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=90',
        title: '60 secondes.\nLe cadeau\nparfait.',
        subtitle: 'Des artisans locaux à Bruxelles, livrés chez toi. Zéro stress.',
    },
];

export default function OnboardingScreen() {
  const Colors = useThemeColors();
  const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();
    const [currentIdx, setCurrentIdx] = useState(0);
    const listRef = useRef<FlatList>(null);

    const isLast = currentIdx === SLIDES.length - 1;

    const goNext = () => {
        if (isLast) {
            router.replace('/(tabs)');
        } else {
            const next = currentIdx + 1;
            listRef.current?.scrollToIndex({ index: next, animated: true });
            setCurrentIdx(next);
        }
    };

    const renderSlide = ({ item }: { item: typeof SLIDES[0] }) => (
        <ImageBackground source={{ uri: item.image }} style={styles.slide}>
            <LinearGradient
                colors={['rgba(12,10,9,0.08)', 'rgba(12,10,9,0.85)']}
                locations={[0.3, 1]}
                style={styles.gradient}
            >
                {/* Logo */}
                <View style={[styles.logoWrap, { paddingTop: insets.top + 8 }]}>
                    <Text style={styles.logo}>Oreli</Text>
                    {!isLast && (
                        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
                            <Text style={styles.skip}>Passer</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Bottom content */}
                <View style={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.subtitle}</Text>

                    {/* Controls */}
                    <View style={styles.controls}>
                        {/* Dots */}
                        <View style={styles.dots}>
                            {SLIDES.map((_, i) => (
                                <View
                                    key={i}
                                    style={[styles.dot, i === currentIdx ? styles.dotActive : styles.dotInactive]}
                                />
                            ))}
                        </View>

                        {/* CTA */}
                        {isLast ? (
                            <TouchableOpacity style={styles.startBtn} onPress={goNext} activeOpacity={0.85}>
                                <Text style={styles.startBtnText}>Commencer  →</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.arrowBtn} onPress={goNext} activeOpacity={0.85}>
                                <Text style={styles.arrowBtnText}>→</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </LinearGradient>
        </ImageBackground>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={listRef}
                data={SLIDES}
                renderItem={renderSlide}
                keyExtractor={(i) => i.id}
                horizontal
                pagingEnabled
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
}

const createStyles = (Colors: any) => StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.obsidian },
    slide: { width: W, height: H },
    gradient: { flex: 1, justifyContent: 'space-between' },
    logoWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing['2xl'],
    },
    logo: {
        fontSize: Typography.md,
        fontFamily: Typography.bold,
        color: Colors.cream,
        letterSpacing: -0.5,
    },
    skip: {
        fontSize: Typography.sm,
        fontFamily: Typography.medium,
        color: 'rgba(250,250,249,0.55)',
    },
    content: { paddingHorizontal: Spacing['2xl'] },
    title: {
        fontSize: Typography['4xl'],
        fontFamily: Typography.bold,
        color: Colors.cream,
        letterSpacing: -1.2,
        lineHeight: 46,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: Typography.base,
        fontFamily: Typography.regular,
        color: 'rgba(250,250,249,0.60)',
        lineHeight: 24,
        maxWidth: 300,
        marginBottom: 40,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dots: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    dot: { height: 8, borderRadius: 4 },
    dotActive: { width: 24, backgroundColor: Colors.gold },
    dotInactive: { width: 8, backgroundColor: Colors.warm },
    arrowBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.cream,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowBtnText: {
        fontSize: 22,
        color: Colors.obsidian,
        fontFamily: Typography.bold,
    },
    startBtn: {
        backgroundColor: Colors.gold,
        paddingHorizontal: 28,
        paddingVertical: 16,
        borderRadius: Radius.full,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    startBtnText: {
        fontSize: Typography.base,
        fontFamily: Typography.semibold,
        color: Colors.obsidian,
    },
});
