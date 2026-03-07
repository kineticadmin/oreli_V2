import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    LayoutAnimation,
    ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/Typography';
import { useGiftStore } from '@/store/giftStore';
import { formatPrice } from '@/hooks/useCatalog';
import { useGiftChat, type GiftChatMessage, type RecommendedProduct } from '@/hooks/useGiftChat';

// ─── Composants ────────────────────────────────────────────────────────────

function TypingIndicator({ Colors }: { Colors: ThemeColors }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.md }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16 }}>✦</Text>
            </View>
            <View style={{ backgroundColor: Colors.charcoal, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.warm, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', gap: 4 }}>
                {[0, 1, 2].map((dotIndex) => (
                    <View key={dotIndex} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.muted }} />
                ))}
            </View>
        </View>
    );
}

function ProductCard({ product, Colors, styles }: { product: RecommendedProduct; Colors: ThemeColors; styles: ReturnType<typeof createStyles> }) {
    return (
        <TouchableOpacity
            style={styles.productCard}
            activeOpacity={0.85}
            onPress={() => {
                useGiftStore.getState().updateGiftFlow({ selectedProductId: product.id });
                router.push(`/product/${product.id}` as never);
            }}
        >
            <View style={styles.productImageBox}>
                <Feather name="gift" size={28} color={Colors.cream} />
                <View style={styles.scoreBadge}>
                    <Text style={styles.scoreBadgeText}>✦ {Math.round(product.score * 100)}%</Text>
                </View>
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
                {product.justification && (
                    <Text style={styles.productJustification} numberOfLines={2}>"{product.justification}"</Text>
                )}
                <View style={styles.productMeta}>
                    <Text style={styles.productPrice}>{formatPrice(product.priceAmount, product.currency)}</Text>
                    <Text style={styles.productSeller}>{product.seller.displayName}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

// ─── Écran principal ───────────────────────────────────────────────────────

export default function GiftFlowScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();
    const { selectedPerson } = useGiftStore();
    const params = useLocalSearchParams<{
        relationshipId?: string;
        productId?: string;
        occasion?: string;
        suggestedDeliveryDate?: string;
    }>();

    const context = {
        ...(params.relationshipId ? { relationshipId: params.relationshipId } : {}),
        ...(selectedPerson?.apiId && !params.relationshipId ? { relationshipId: selectedPerson.apiId } : {}),
        ...(params.productId ? { productId: params.productId } : {}),
        ...(params.occasion ? { occasion: params.occasion } : {}),
        ...(params.suggestedDeliveryDate ? { suggestedDeliveryDate: params.suggestedDeliveryDate } : {}),
    };

    const {
        messages,
        suggestions,
        products,
        isLoading,
        isReady,
        sendMessage,
        initChat,
    } = useGiftChat(context);

    const listRef = useRef<FlatList>(null);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        initChat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages, isLoading]);

    function handleSend(text: string) {
        const trimmedText = text.trim();
        if (!trimmedText || isLoading) return;
        setInputValue('');
        sendMessage(trimmedText);
    }

    function renderMessage({ item }: { item: GiftChatMessage }) {
        const isOreliMessage = item.role === 'oreli';
        return (
            <View style={[styles.messageRow, isOreliMessage ? styles.messageRowOreli : styles.messageRowUser]}>
                {isOreliMessage && (
                    <View style={styles.oreliAvatar}>
                        <Text style={styles.oreliAvatarText}>✦</Text>
                    </View>
                )}
                <View style={[styles.bubble, isOreliMessage ? styles.bubbleOreli : styles.bubbleUser]}>
                    <Text style={[styles.bubbleText, isOreliMessage ? styles.bubbleTextOreli : styles.bubbleTextUser]}>
                        {item.text}
                    </Text>
                </View>
            </View>
        );
    }

    type ListItem =
        | { type: 'message'; data: GiftChatMessage; key: string }
        | { type: 'suggestions'; key: string }
        | { type: 'products'; key: string }
        | { type: 'typing'; key: string };

    const listData: ListItem[] = [
        ...messages.map((message, index) => ({ type: 'message' as const, data: message, key: `msg-${index}` })),
        ...(isLoading ? [{ type: 'typing' as const, key: 'typing' }] : []),
        ...(suggestions.length > 0 && !isLoading ? [{ type: 'suggestions' as const, key: 'suggestions' }] : []),
        ...(isReady && products ? [{ type: 'products' as const, key: 'products' }] : []),
    ];

    function renderItem({ item }: { item: ListItem }) {
        if (item.type === 'message') return renderMessage({ item: item.data });
        if (item.type === 'typing') return <TypingIndicator Colors={Colors} />;
        if (item.type === 'suggestions') {
            return (
                <View style={styles.suggestions}>
                    {suggestions.map((suggestion) => (
                        <TouchableOpacity
                            key={suggestion}
                            style={styles.chip}
                            onPress={() => handleSend(suggestion)}
                            activeOpacity={0.75}
                        >
                            <Text style={styles.chipText}>{suggestion}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }
        if (item.type === 'products' && products) {
            return (
                <View style={{ paddingHorizontal: Spacing.xl, gap: Spacing.md }}>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} Colors={Colors} styles={styles} />
                    ))}
                </View>
            );
        }
        return null;
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={22} color={Colors.cream} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <View style={styles.headerAvatar}>
                        <Text style={styles.headerAvatarText}>✦</Text>
                    </View>
                    <Text style={styles.headerTitle}>Oreli</Text>
                </View>
                <View style={{ width: 38 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                <FlatList
                    ref={listRef}
                    data={listData}
                    keyExtractor={(item) => item.key}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: Spacing.xl, paddingBottom: 120, gap: Spacing.sm }}
                    showsVerticalScrollIndicator={false}
                />

                <View style={[styles.inputBar, { paddingBottom: insets.bottom + 12 }]}>
                    <TextInput
                        value={inputValue}
                        onChangeText={setInputValue}
                        onSubmitEditing={() => handleSend(inputValue)}
                        placeholder="Réponds à Oreli…"
                        placeholderTextColor={Colors.muted}
                        style={styles.input}
                        returnKeyType="send"
                        editable={!isLoading}
                        blurOnSubmit={false}
                    />
                    <TouchableOpacity
                        onPress={() => handleSend(inputValue)}
                        disabled={!inputValue.trim() || isLoading}
                        style={[styles.sendBtn, (!inputValue.trim() || isLoading) && styles.sendBtnDisabled]}
                        activeOpacity={0.8}
                    >
                        {isLoading
                            ? <ActivityIndicator size="small" color={Colors.obsidian} />
                            : <Feather name="send" size={18} color={Colors.obsidian} />
                        }
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const createStyles = (Colors: ThemeColors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.obsidian },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.warm,
    },
    backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
    headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    headerAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
    headerAvatarText: { fontSize: 14, color: Colors.obsidian },
    headerTitle: { fontSize: Typography.base, fontFamily: Typography.semibold, color: Colors.cream },
    messageRow: { flexDirection: 'row', marginBottom: 4, alignItems: 'flex-end', gap: 8 },
    messageRowOreli: { justifyContent: 'flex-start' },
    messageRowUser: { justifyContent: 'flex-end' },
    oreliAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    oreliAvatarText: { fontSize: 12, color: Colors.obsidian },
    bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: Radius.xl },
    bubbleOreli: { backgroundColor: Colors.charcoal, borderWidth: 1, borderColor: Colors.warm, borderBottomLeftRadius: 4 },
    bubbleUser: { backgroundColor: Colors.gold, borderBottomRightRadius: 4 },
    bubbleText: { fontSize: Typography.sm, lineHeight: Typography.sm * 1.5 },
    bubbleTextOreli: { color: Colors.cream, fontFamily: Typography.regular },
    bubbleTextUser: { color: Colors.obsidian, fontFamily: Typography.medium },
    suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingLeft: 36, marginTop: 4, marginBottom: 8 },
    chip: { backgroundColor: Colors.stone, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.warm, paddingHorizontal: 14, paddingVertical: 8 },
    chipText: { fontSize: Typography.sm, fontFamily: Typography.medium, color: Colors.cream },
    productCard: {
        backgroundColor: Colors.charcoal,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.warm,
        padding: Spacing.md,
        flexDirection: 'row',
        gap: Spacing.md,
        ...Shadow.card,
    },
    productImageBox: { width: 72, height: 72, borderRadius: Radius.lg, backgroundColor: Colors.stone, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    scoreBadge: { position: 'absolute', bottom: -8, left: '50%', transform: [{ translateX: -20 }], backgroundColor: Colors.gold, borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 2 },
    scoreBadgeText: { fontSize: 9, fontFamily: Typography.bold, color: Colors.obsidian },
    productInfo: { flex: 1, gap: 4 },
    productTitle: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.cream },
    productJustification: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted, fontStyle: 'italic' },
    productMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    productPrice: { fontSize: Typography.sm, fontFamily: Typography.bold, color: Colors.gold },
    productSeller: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: Spacing.xl,
        paddingTop: 12,
        backgroundColor: Colors.obsidian,
        borderTopWidth: 1,
        borderTopColor: Colors.warm,
    },
    input: {
        flex: 1,
        backgroundColor: Colors.charcoal,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Colors.warm,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: Typography.sm,
        fontFamily: Typography.regular,
        color: Colors.cream,
    },
    sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
    sendBtnDisabled: { opacity: 0.4 },
});
