import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius } from '@/constants/Typography';
import { useGiftStore } from '@/store/giftStore';

export default function ConfirmationScreen() {
  const Colors = useThemeColors();
  const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();
    const { selectedProduct, selectedPerson, giftFlow, resetGiftFlow } = useGiftStore();
    const product = selectedProduct;
    const person = selectedPerson;
    const total = (product?.price ?? 0) + (giftFlow.premiumWrap ? 5 : 0);

    const deliveryText = (() => {
        if (giftFlow.deliveryDate) {
            const d = new Date(giftFlow.deliveryDate);
            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
            }
        }
        return '2–3 jours ouvrés';
    })();

    const handleHome = () => {
        resetGiftFlow();
        router.replace('/(tabs)');
    };

    const handleTrack = () => {
        resetGiftFlow();
        router.replace('/(tabs)/orders');
    };

    return (
        <View style={[styles.container, { backgroundColor: Colors.obsidian }]}>
            <LinearGradient
                colors={['rgba(202,138,4,0.08)', Colors.obsidian]}
                locations={[0, 0.6]}
                style={StyleSheet.absoluteFill}
            />

            <View style={[styles.content, { paddingTop: insets.top + 32 }]}>
                {/* Success Icon */}
                <View style={styles.successCircle}>
                    <View style={styles.successInner}>
                        <Text style={styles.successCheck}>✓</Text>
                    </View>
                </View>

                <Text style={styles.title}>Commande{'\n'}confirmée !</Text>
                <Text style={styles.subtitle}>
                    {person ? `Ton cadeau pour ${person.name} est en route.` : 'Ton cadeau est en route.'}
                </Text>

                {/* Order card */}
                {product && (
                    <View style={styles.orderCard}>
                        <View style={styles.orderRow}>
                            <Text style={styles.orderLabel}>Produit</Text>
                            <Text style={styles.orderValue} numberOfLines={1}>{product.name}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.orderRow}>
                            <Text style={styles.orderLabel}>Total payé</Text>
                            <Text style={styles.orderValueBold}>{total}€</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.orderRow}>
                            <Text style={styles.orderLabel}>Livraison estimée</Text>
                            <Text style={styles.orderValue}>{deliveryText}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.orderRow}>
                            <Text style={styles.orderLabel}>N° de commande</Text>
                            <Text style={styles.orderValue}>#ORE-{Math.floor(10000 + Math.random() * 90000)}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.trackBtn}
                        activeOpacity={0.85}
                        onPress={handleTrack}
                    >
                        <Text style={styles.trackBtnText}>📍  Suivre ma commande</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeBtn}
                        activeOpacity={0.85}
                        onPress={handleHome}
                    >
                        <Text style={styles.homeBtnText}>Retour à l'accueil</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const createStyles = (Colors: ThemeColors) => StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, paddingHorizontal: Spacing['2xl'], alignItems: 'center' },
    successCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.gold + '22', alignItems: 'center', justifyContent: 'center', marginBottom: 28, borderWidth: 1, borderColor: Colors.gold + '44' },
    successInner: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
    successCheck: { fontSize: 32, color: Colors.obsidian, fontFamily: Typography.bold },
    title: { fontSize: Typography['3xl'], fontFamily: Typography.bold, color: Colors.cream, textAlign: 'center', letterSpacing: -0.8, lineHeight: 40, marginBottom: 12 },
    subtitle: { fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.muted, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
    orderCard: { width: '100%', backgroundColor: Colors.charcoal, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.warm, padding: Spacing.xl, marginBottom: 32 },
    orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
    orderLabel: { fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.muted, flex: 1 },
    orderValue: { fontSize: Typography.sm, fontFamily: Typography.medium, color: Colors.cream, flex: 1.5, textAlign: 'right' },
    orderValueBold: { fontSize: Typography.md, fontFamily: Typography.bold, color: Colors.cream, textAlign: 'right' },
    divider: { height: 1, backgroundColor: Colors.warm },
    actions: { width: '100%', gap: 12 },
    trackBtn: { backgroundColor: Colors.gold, paddingVertical: 16, borderRadius: Radius.full, alignItems: 'center' },
    trackBtnText: { fontSize: Typography.base, fontFamily: Typography.semibold, color: Colors.obsidian },
    homeBtn: { backgroundColor: Colors.charcoal, paddingVertical: 16, borderRadius: Radius.full, alignItems: 'center', borderWidth: 1, borderColor: Colors.warm },
    homeBtnText: { fontSize: Typography.base, fontFamily: Typography.medium, color: Colors.cream },
});
