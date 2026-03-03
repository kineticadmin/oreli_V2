import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/Typography';
import {
    closeOnes,
    occasions,
    products,
    budgetOptions,
    deliveryOptions,
    surpriseOptions,
} from '@/data/mockData';
import { useGiftStore } from '@/store/giftStore';

type MessageRole = 'oreli' | 'user' | 'choices' | 'products' | 'summary';

interface Choice { id: string; label: string; sublabel?: string; icon?: string }
interface ChatMessage {
    id: string;
    role: MessageRole;
    text?: string;
    choices?: Choice[];
    field?: string;
    summaryData?: { budget: string; delivery: string; person: string };
}

const personChoices: Choice[] = closeOnes.map((p) => ({
    id: p.id,
    label: p.name,
    sublabel: p.relationship,
    icon: p.avatar,
}));

const occasionChoices: Choice[] = occasions.map((o) => ({
    id: o.label,
    label: o.label,
    icon: o.emoji,
}));

export default function GiftFlowScreen() {
  const Colors = useThemeColors();
  const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();
    const { selectedPerson, setSelectedPerson, updateGiftFlow } = useGiftStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [currentField, setCurrentField] = useState('');
    const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
    const [flowData, setFlowData] = useState<Record<string, string>>({
        personId: selectedPerson?.id || '',
    });
    const listRef = useRef<FlatList>(null);
    const [step, setStep] = useState(selectedPerson ? 1 : 0);

    const getPersonName = (id: string) => closeOnes.find((p) => p.id === id)?.name || '';

    const addMessage = (msg: Omit<ChatMessage, 'id'>) => {
        setMessages((prev) => [...prev, { ...msg, id: `${Date.now()}-${Math.random()}` }]);
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const simulateTyping = (callback: () => void, delay = 800) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            callback();
        }, delay);
    };

    const askStep = (stepIdx: number, personName?: string) => {
        const name = personName || getPersonName(flowData.personId);
        switch (stepIdx) {
            case 0:
                simulateTyping(() => {
                    addMessage({ role: 'oreli', text: 'Bonjour ! À qui souhaites-tu offrir un cadeau ?' });
                    setTimeout(() => addMessage({ role: 'choices', choices: [...personChoices, { id: 'new', label: "Quelqu'un d'autre", icon: '+' }], field: 'personId' }), 300);
                    setCurrentField('personId');
                });
                break;
            case 1:
                simulateTyping(() => {
                    addMessage({ role: 'oreli', text: `${name} a de la chance ! Quel budget as-tu ?` });
                    setTimeout(() => addMessage({ role: 'choices', choices: budgetOptions.map(b => ({ id: b.id, label: b.label, sublabel: b.sublabel, icon: b.icon })), field: 'budget' }), 300);
                    setCurrentField('budget');
                });
                break;
            case 2:
                simulateTyping(() => {
                    addMessage({ role: 'oreli', text: "Parfait ! C'est pour quelle occasion ?" });
                    setTimeout(() => addMessage({ role: 'choices', choices: occasionChoices, field: 'occasion' }), 300);
                    setCurrentField('occasion');
                });
                break;
            case 3:
                simulateTyping(() => {
                    addMessage({ role: 'oreli', text: "Tu en as besoin pour quand ?" });
                    setTimeout(() => addMessage({ role: 'choices', choices: deliveryOptions.map(d => ({ id: d.id, label: d.label, sublabel: d.sublabel })), field: 'deliveryDate' }), 300);
                    setCurrentField('deliveryDate');
                });
                break;
            case 4:
                simulateTyping(() => {
                    addMessage({ role: 'oreli', text: 'Quel niveau de surprise souhaites-tu ?' });
                    setTimeout(() => addMessage({ role: 'choices', choices: surpriseOptions.map(s => ({ id: s.id, label: s.label, sublabel: s.sublabel, icon: s.icon })), field: 'surpriseLevel' }), 300);
                    setCurrentField('surpriseLevel');
                });
                break;
        }
    };

    useEffect(() => {
        if (selectedPerson) {
            simulateTyping(() => {
                addMessage({ role: 'oreli', text: `Tu veux offrir un cadeau à ${selectedPerson.name} ? Quelle belle idée ! Quel budget as-tu ?` });
                setTimeout(() => {
                    addMessage({ role: 'choices', choices: budgetOptions.map(b => ({ id: b.id, label: b.label, sublabel: b.sublabel, icon: b.icon })), field: 'budget' });
                    setCurrentField('budget');
                }, 300);
            });
        } else {
            askStep(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChoice = (field: string, choiceId: string, choiceLabel: string, msgId: string) => {
        if (answeredIds.has(msgId)) return;
        setAnsweredIds((prev) => new Set([...prev, msgId]));
        addMessage({ role: 'user', text: choiceLabel });

        const newData = { ...flowData, [field]: choiceId };
        setFlowData(newData);

        if (field === 'personId') {
            const name = getPersonName(choiceId);
            const p = closeOnes.find((c) => c.id === choiceId);
            if (p) setSelectedPerson(p);
            const nextStep = 1;
            setStep(nextStep);
            setTimeout(() => askStep(nextStep, name), 400);
        } else if (field === 'surpriseLevel') {
            handleSurpriseOutcome(choiceId, newData);
        } else {
            const nextStep = step + 1;
            setStep(nextStep);
            setTimeout(() => askStep(nextStep), 400);
        }
    };

    const handleSurpriseOutcome = (level: string, data: Record<string, string>) => {
        const personName = getPersonName(data.personId);
        const maxBudget = parseInt(data.budget || '80') + 20;
        const filtered = products.filter((p) => p.price <= maxBudget);

        if (level === 'total') {
            simulateTyping(() => {
                addMessage({ role: 'oreli', text: `Je m'occupe de tout pour ${personName} ! Une magnifique surprise sera livrée.` });
                setTimeout(() => {
                    addMessage({ role: 'summary', summaryData: { budget: `~${data.budget}€`, delivery: data.deliveryDate === 'today' ? "Aujourd'hui" : data.deliveryDate === 'tomorrow' ? 'Demain' : 'Cette semaine', person: personName }, field: 'confirm_total' });
                }, 400);
            }, 1200);
        } else {
            simulateTyping(() => {
                const txt = level === 'guided' ? 'Voici mes 3 meilleures recommandations :' : `Voici une sélection pour ${personName} :`;
                addMessage({ role: 'oreli', text: txt });
                const productList = level === 'guided' ? filtered.slice(0, 3) : filtered;
                // Store products in message for rendering
                setTimeout(() => addMessage({ role: 'products' as MessageRole, text: JSON.stringify(productList.map(p => p.id)) }), 400);
            }, 1500);
        }
    };

    const totalSteps = selectedPerson ? 4 : 5;
    const progress = Math.min(step / totalSteps, 1);

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        if (item.role === 'oreli') {
            return (
                <View style={styles.msgOreli}>
                    <View style={styles.msgAvatar}><Text style={styles.msgAvatarText}>✦</Text></View>
                    <View style={styles.msgBubble}>
                        <Text style={styles.msgText}>{item.text}</Text>
                    </View>
                </View>
            );
        }
        if (item.role === 'user') {
            return (
                <View style={styles.msgUser}>
                    <View style={styles.msgBubbleUser}>
                        <Text style={styles.msgTextUser}>{item.text}</Text>
                    </View>
                </View>
            );
        }
        if (item.role === 'choices' && item.choices) {
            const isAnswered = answeredIds.has(item.id);
            return (
                <View style={[styles.choiceRow]}>
                    {item.choices.map((choice) => (
                        <TouchableOpacity
                            key={choice.id}
                            style={[styles.choiceBtn, isAnswered && styles.choiceBtnAnswered]}
                            onPress={() => handleChoice(item.field || '', choice.id, choice.label, item.id)}
                            activeOpacity={isAnswered ? 1 : 0.75}
                        >
                            {choice.icon && <Text style={styles.choiceIcon}>{choice.icon}</Text>}
                            <View>
                                <Text style={[styles.choiceLabel, isAnswered && styles.choiceLabelAnswered]}>{choice.label}</Text>
                                {choice.sublabel ? <Text style={styles.choiceSublabel}>{choice.sublabel}</Text> : null}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }
        if (item.role === 'summary' && item.summaryData) {
            return (
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>🎁  Surprise Totale</Text>
                    <Text style={styles.summaryMeta}>Budget : {item.summaryData.budget}  ·  Livraison : {item.summaryData.delivery}</Text>
                    <TouchableOpacity
                        style={styles.summaryBtn}
                        onPress={() => {
                            updateGiftFlow({ surpriseLevel: 'total' });
                            router.push('/checkout');
                        }}
                    >
                        <Text style={styles.summaryBtnText}>Aller au paiement  →</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        if (item.role === 'products' && item.text) {
            const ids: string[] = JSON.parse(item.text);
            const prods = products.filter((p) => ids.includes(p.id));
            return (
                <FlatList
                    data={prods}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(p) => p.id}
                    contentContainerStyle={{ gap: 12, paddingLeft: 40, paddingRight: 16, paddingVertical: 4 }}
                    renderItem={({ item: prod }) => (
                        <TouchableOpacity
                            style={styles.productCard}
                            onPress={() => {
                                useGiftStore.getState().setSelectedProduct(prod);
                                router.push(`/product/${prod.id}`);
                            }}
                            activeOpacity={0.85}
                        >
                            <View style={styles.productImageWrap}>
                                <Text style={styles.productImagePlaceholder}>📦</Text>
                                <View style={styles.matchBadge}>
                                    <Text style={styles.matchBadgeText}>✦ {prod.matchScore}%</Text>
                                </View>
                            </View>
                            <View style={styles.productInfo}>
                                <Text style={styles.productName} numberOfLines={2}>{prod.name}</Text>
                                <Text style={styles.productJustification} numberOfLines={2}>{prod.aiJustification}</Text>
                                <Text style={styles.productPrice}>{prod.price}€</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            );
        }
        return null;
    };

    return (
        <View style={[styles.container, { backgroundColor: Colors.obsidian }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                    <Text style={styles.headerBtnText}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <View style={styles.headerAvatar}><Text style={styles.headerAvatarText}>✦</Text></View>
                    <Text style={styles.headerTitle}>Oreli</Text>
                </View>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                    <Text style={styles.headerBtnText}>✕</Text>
                </TouchableOpacity>
            </View>

            {/* Progress */}
            <View style={styles.progressWrap}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                </View>
            </View>

            {/* Messages */}
            <FlatList
                ref={listRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(m) => m.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
                ListFooterComponent={
                    isTyping ? (
                        <View style={styles.msgOreli}>
                            <View style={styles.msgAvatar}><Text style={styles.msgAvatarText}>✦</Text></View>
                            <View style={styles.typingBubble}>
                                <Text style={styles.typingDots}>· · ·</Text>
                            </View>
                        </View>
                    ) : null
                }
            />

            {/* Text input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={12}
            >
                <View style={[styles.inputWrap, { paddingBottom: insets.bottom + 8 }]}>
                    <View style={styles.inputRow}>
                        <TextInput
                            value={inputValue}
                            onChangeText={setInputValue}
                            onSubmitEditing={() => {
                                if (!inputValue.trim() || !currentField) return;
                                handleChoice(currentField, inputValue.trim(), inputValue.trim(), `manual-${Date.now()}`);
                                setInputValue('');
                            }}
                            placeholder="Écris un message..."
                            placeholderTextColor={Colors.muted}
                            style={styles.input}
                            returnKeyType="send"
                        />
                        <TouchableOpacity
                            style={styles.sendBtn}
                            onPress={() => {
                                if (!inputValue.trim() || !currentField) return;
                                handleChoice(currentField, inputValue.trim(), inputValue.trim(), `manual-${Date.now()}`);
                                setInputValue('');
                            }}
                        >
                            <Text style={styles.sendBtnText}>↑</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const createStyles = (Colors: any) => StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.warm,
    },
    headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    headerBtnText: { fontSize: 20, color: Colors.muted },
    headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    headerAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
    headerAvatarText: { fontSize: 14, color: Colors.obsidian, fontFamily: Typography.bold },
    headerTitle: { fontSize: Typography.base, fontFamily: Typography.bold, color: Colors.cream },
    progressWrap: { paddingHorizontal: 16, paddingVertical: 8 },
    progressTrack: { height: 2, backgroundColor: Colors.warm, borderRadius: 1 },
    progressBar: { height: 2, backgroundColor: Colors.gold, borderRadius: 1 },
    msgOreli: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 12 },
    msgAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
    msgAvatarText: { fontSize: 12, color: Colors.obsidian, fontFamily: Typography.bold },
    msgBubble: { backgroundColor: Colors.charcoal, borderRadius: Radius.lg, borderTopLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 10, maxWidth: '80%', ...Shadow.card },
    msgText: { fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.cream, lineHeight: 20 },
    msgUser: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 },
    msgBubbleUser: { backgroundColor: Colors.gold, borderRadius: Radius.lg, borderTopRightRadius: 4, paddingHorizontal: 14, paddingVertical: 10, maxWidth: '75%' },
    msgTextUser: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.obsidian },
    typingBubble: { backgroundColor: Colors.charcoal, borderRadius: Radius.lg, borderTopLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 10 },
    typingDots: { fontSize: 18, color: Colors.muted, letterSpacing: 4 },
    choiceRow: { marginLeft: 36, flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    choiceBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: Colors.charcoal, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.warm },
    choiceBtnAnswered: { opacity: 0.38 },
    choiceIcon: { fontSize: 16 },
    choiceLabel: { fontSize: Typography.sm, fontFamily: Typography.medium, color: Colors.cream },
    choiceLabelAnswered: { color: Colors.muted },
    choiceSublabel: { fontSize: 10, fontFamily: Typography.regular, color: Colors.muted, marginTop: 1 },
    summaryCard: { marginLeft: 36, backgroundColor: Colors.charcoal, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.gold + '44', padding: 20, marginBottom: 12 },
    summaryTitle: { fontSize: Typography.lg, fontFamily: Typography.bold, color: Colors.cream, textAlign: 'center', marginBottom: 6 },
    summaryMeta: { fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.muted, textAlign: 'center', marginBottom: 16 },
    summaryBtn: { backgroundColor: Colors.gold, paddingVertical: 14, borderRadius: Radius.full, alignItems: 'center' },
    summaryBtnText: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.obsidian },
    productCard: { width: 200, backgroundColor: Colors.charcoal, borderRadius: Radius.xl, overflow: 'hidden', flexShrink: 0 },
    productImageWrap: { height: 220, backgroundColor: Colors.stone, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    productImagePlaceholder: { fontSize: 48 },
    matchBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: Colors.charcoal + 'dd', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full, flexDirection: 'row', alignItems: 'center' },
    matchBadgeText: { fontSize: 11, fontFamily: Typography.semibold, color: Colors.gold },
    productInfo: { padding: 12 },
    productName: { fontSize: Typography.sm, fontFamily: Typography.bold, color: Colors.cream, lineHeight: 18, marginBottom: 4 },
    productJustification: { fontSize: 11, fontFamily: Typography.regular, color: Colors.muted, lineHeight: 16, marginBottom: 8 },
    productPrice: { fontSize: Typography.md, fontFamily: Typography.bold, color: Colors.gold },
    inputWrap: { paddingHorizontal: 16, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.warm, backgroundColor: Colors.obsidian },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    input: { flex: 1, backgroundColor: Colors.charcoal, borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 12, fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.cream, borderWidth: 1, borderColor: Colors.warm },
    sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
    sendBtnText: { fontSize: 18, color: Colors.obsidian, fontFamily: Typography.bold },
});
