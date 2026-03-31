import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/Typography';
import { useGiftStore } from '@/store/giftStore';
import { useLogout } from '@/hooks/useAuth';
import {
    useProfile,
    useAddresses,
    useCreateAddress,
    useDeleteAddress,
    useSetDefaultAddress,
    CreateAddressInput,
} from '@/hooks/useProfile';

const EMPTY_ADDRESS_FORM: CreateAddressInput = {
    label: '',
    name: '',
    line: '',
    city: '',
    postalCode: '',
    country: 'BE',
    isDefault: false,
};

export default function ProfileScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();
    const { theme, setTheme } = useGiftStore();
    const logoutMutation = useLogout();

    const { data: profile, isLoading: isLoadingProfile } = useProfile();
    const { data: addresses } = useAddresses();
    const createAddressMutation = useCreateAddress();
    const deleteAddressMutation = useDeleteAddress();
    const setDefaultAddressMutation = useSetDefaultAddress();

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressForm, setAddressForm] = useState<CreateAddressInput>(EMPTY_ADDRESS_FORM);

    const displayName = profile ? `${profile.firstName} ${profile.lastName}` : '…';
    const initial = (profile?.firstName ?? '?').charAt(0).toUpperCase();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleAddressSubmit = () => {
        if (!addressForm.name.trim() || !addressForm.line.trim() || !addressForm.city.trim() || !addressForm.postalCode.trim()) {
            Alert.alert('Champs manquants', 'Nom, adresse, ville et code postal sont obligatoires.');
            return;
        }
        createAddressMutation.mutate(addressForm, {
            onSuccess: () => {
                setShowAddressForm(false);
                setAddressForm(EMPTY_ADDRESS_FORM);
            },
            onError: () => {
                Alert.alert('Erreur', 'Impossible d\'enregistrer l\'adresse. Réessaie.');
            },
        });
    };

    const handleDeleteAddress = (addressId: string) => {
        Alert.alert('Supprimer l\'adresse', 'Confirmer la suppression ?', [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Supprimer',
                style: 'destructive',
                onPress: () => deleteAddressMutation.mutate(addressId),
            },
        ]);
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Mon profil</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Avatar + name */}
                    <View style={styles.profileSection}>
                        {isLoadingProfile ? (
                            <ActivityIndicator color={Colors.gold} />
                        ) : (
                            <>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{initial}</Text>
                                </View>
                                <Text style={styles.userName}>{displayName}</Text>
                                {profile?.email && (
                                    <Text style={styles.userEmail}>{profile.email}</Text>
                                )}
                            </>
                        )}
                    </View>

                    {/* Addresses */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Adresses de livraison</Text>
                            {!showAddressForm && (
                                <TouchableOpacity onPress={() => setShowAddressForm(true)} activeOpacity={0.7}>
                                    <View style={styles.addBtn}>
                                        <Feather name="plus" size={14} color={Colors.gold} />
                                        <Text style={styles.addBtnText}>Ajouter</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Existing addresses list */}
                        {(addresses ?? []).length > 0 && (
                            <View style={styles.card}>
                                {(addresses ?? []).map((address, index) => (
                                    <View key={address.id}>
                                        {index > 0 && <View style={styles.separator} />}
                                        <View style={styles.addressRow}>
                                            <View style={styles.cardIcon}>
                                                <Feather name="map-pin" size={16} color={Colors.muted} />
                                            </View>
                                            <View style={styles.cardContent}>
                                                <View style={styles.addressNameRow}>
                                                    <Text style={styles.cardLabel}>{address.name}</Text>
                                                    {address.isDefault && (
                                                        <View style={styles.defaultBadge}>
                                                            <Text style={styles.defaultBadgeText}>Par défaut</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text style={styles.cardValue}>
                                                    {address.line}, {address.postalCode} {address.city}
                                                </Text>
                                            </View>
                                            <View style={styles.addressActions}>
                                                {!address.isDefault && (
                                                    <TouchableOpacity
                                                        onPress={() => setDefaultAddressMutation.mutate(address.id)}
                                                        style={styles.actionBtn}
                                                        activeOpacity={0.7}
                                                    >
                                                        <Feather name="check" size={14} color={Colors.muted} />
                                                    </TouchableOpacity>
                                                )}
                                                <TouchableOpacity
                                                    onPress={() => handleDeleteAddress(address.id)}
                                                    style={styles.actionBtn}
                                                    activeOpacity={0.7}
                                                >
                                                    <Feather name="trash-2" size={14} color={Colors.error} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        {(addresses ?? []).length === 0 && !showAddressForm && (
                            <View style={styles.card}>
                                <View style={styles.cardRow}>
                                    <View style={styles.cardIcon}>
                                        <Feather name="map-pin" size={16} color={Colors.muted} />
                                    </View>
                                    <View style={styles.cardContent}>
                                        <Text style={styles.cardLabel}>Aucune adresse</Text>
                                        <Text style={styles.cardValue}>Ajoutez une adresse de livraison</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Add address form */}
                        {showAddressForm && (
                            <View style={styles.formCard}>
                                <Text style={styles.formTitle}>Nouvelle adresse</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nom complet du destinataire"
                                    placeholderTextColor={Colors.muted}
                                    value={addressForm.name}
                                    onChangeText={(v) => setAddressForm((prev) => ({ ...prev, name: v }))}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Rue et numéro"
                                    placeholderTextColor={Colors.muted}
                                    value={addressForm.line}
                                    onChangeText={(v) => setAddressForm((prev) => ({ ...prev, line: v }))}
                                />
                                <View style={styles.inputRow}>
                                    <TextInput
                                        style={[styles.input, { flex: 1 }]}
                                        placeholder="Code postal"
                                        placeholderTextColor={Colors.muted}
                                        value={addressForm.postalCode}
                                        onChangeText={(v) => setAddressForm((prev) => ({ ...prev, postalCode: v }))}
                                        keyboardType="numeric"
                                    />
                                    <TextInput
                                        style={[styles.input, { flex: 2 }]}
                                        placeholder="Ville"
                                        placeholderTextColor={Colors.muted}
                                        value={addressForm.city}
                                        onChangeText={(v) => setAddressForm((prev) => ({ ...prev, city: v }))}
                                    />
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Label (ex: Maison, Bureau)"
                                    placeholderTextColor={Colors.muted}
                                    value={addressForm.label}
                                    onChangeText={(v) => setAddressForm((prev) => ({ ...prev, label: v }))}
                                />
                                <TouchableOpacity
                                    style={styles.defaultToggleRow}
                                    onPress={() => setAddressForm((prev) => ({ ...prev, isDefault: !prev.isDefault }))}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.checkbox, addressForm.isDefault && styles.checkboxChecked]}>
                                        {addressForm.isDefault && <Feather name="check" size={12} color={Colors.obsidian} />}
                                    </View>
                                    <Text style={styles.defaultToggleText}>Définir comme adresse par défaut</Text>
                                </TouchableOpacity>
                                <View style={styles.formActions}>
                                    <TouchableOpacity
                                        style={styles.cancelBtn}
                                        onPress={() => { setShowAddressForm(false); setAddressForm(EMPTY_ADDRESS_FORM); }}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.cancelBtnText}>Annuler</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.saveBtn, createAddressMutation.isPending && styles.saveBtnDisabled]}
                                        onPress={handleAddressSubmit}
                                        disabled={createAddressMutation.isPending}
                                        activeOpacity={0.8}
                                    >
                                        {createAddressMutation.isPending ? (
                                            <ActivityIndicator color={Colors.obsidian} size="small" />
                                        ) : (
                                            <Text style={styles.saveBtnText}>Enregistrer</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Orders */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Mes activités</Text>
                        <View style={styles.card}>
                            <TouchableOpacity style={styles.cardRow} onPress={() => router.push('/(tabs)/orders')} activeOpacity={0.7}>
                                <View style={styles.cardIcon}>
                                    <Feather name="package" size={16} color={Colors.muted} />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardLabel}>Mes commandes</Text>
                                    <Text style={styles.cardValue}>Suivi et historique</Text>
                                </View>
                                <Feather name="chevron-right" size={16} color={Colors.muted} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Preferences */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Préférences</Text>
                        <View style={styles.card}>
                            <TouchableOpacity style={styles.cardRow} onPress={toggleTheme} activeOpacity={0.7}>
                                <View style={styles.cardIcon}>
                                    <Feather name={theme === 'dark' ? 'moon' : 'sun'} size={16} color={Colors.muted} />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardLabel}>Thème</Text>
                                    <Text style={styles.cardValue}>{theme === 'dark' ? 'Sombre' : theme === 'light' ? 'Clair' : 'Système'}</Text>
                                </View>
                                <View style={[styles.toggle, theme !== 'dark' && styles.toggleOff]}>
                                    <View style={[styles.toggleKnob, theme !== 'dark' && styles.toggleKnobOff]} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* App info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>À propos</Text>
                        <View style={styles.card}>
                            <View style={styles.cardRow}>
                                <View style={styles.cardIcon}>
                                    <Feather name="star" size={16} color={Colors.muted} />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardLabel}>Oreli</Text>
                                    <Text style={styles.cardValue}>Version 1.0.0</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Logout */}
                    <View style={styles.section}>
                        <TouchableOpacity
                            style={styles.logoutBtn}
                            onPress={() => logoutMutation.mutate()}
                            disabled={logoutMutation.isPending}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.logoutBtnText}>Se déconnecter</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
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
    profileSection: {
        alignItems: 'center',
        paddingVertical: Spacing['3xl'],
        gap: Spacing.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.gold,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { fontSize: Typography['2xl'], fontFamily: Typography.bold, color: Colors.obsidian },
    userName: { fontSize: Typography.xl, fontFamily: Typography.bold, color: Colors.cream, letterSpacing: -0.5 },
    userEmail: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted },
    logoutBtn: { backgroundColor: Colors.charcoal, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.warm, paddingVertical: 16, alignItems: 'center' },
    logoutBtnText: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.error },
    section: { paddingHorizontal: Spacing.xl, marginBottom: Spacing['2xl'] },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
    sectionTitle: { fontSize: Typography.xs, fontFamily: Typography.semibold, color: Colors.muted, letterSpacing: 0.5, textTransform: 'uppercase' },
    addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    addBtnText: { fontSize: Typography.xs, fontFamily: Typography.semibold, color: Colors.gold },
    card: {
        backgroundColor: Colors.charcoal,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.warm,
        overflow: 'hidden',
        ...Shadow.card,
    },
    separator: { height: 1, backgroundColor: Colors.warm, marginHorizontal: Spacing.lg },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        gap: Spacing.md,
    },
    addressNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
    defaultBadge: {
        backgroundColor: Colors.gold + '22',
        borderWidth: 1,
        borderColor: Colors.gold + '55',
        borderRadius: Radius.full,
        paddingHorizontal: 6,
        paddingVertical: 1,
    },
    defaultBadgeText: { fontSize: 9, fontFamily: Typography.semibold, color: Colors.gold },
    addressActions: { flexDirection: 'row', gap: 4 },
    actionBtn: { padding: 6 },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        gap: Spacing.md,
    },
    cardIcon: {
        width: 36,
        height: 36,
        borderRadius: Radius.md,
        backgroundColor: Colors.stone,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardIconText: { fontSize: 16 },
    cardContent: { flex: 1 },
    cardLabel: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.cream, marginBottom: 2 },
    cardValue: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted },
    formCard: {
        backgroundColor: Colors.charcoal,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.gold + '44',
        padding: Spacing.lg,
        gap: Spacing.sm,
        ...Shadow.card,
    },
    formTitle: { fontSize: Typography.sm, fontFamily: Typography.bold, color: Colors.cream, marginBottom: 4 },
    input: {
        backgroundColor: Colors.stone,
        borderRadius: Radius.lg,
        padding: 13,
        fontSize: Typography.sm,
        fontFamily: Typography.regular,
        color: Colors.cream,
        borderWidth: 1,
        borderColor: Colors.warm,
    },
    inputRow: { flexDirection: 'row', gap: Spacing.sm },
    defaultToggleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 4 },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: Colors.muted,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: { backgroundColor: Colors.gold, borderColor: Colors.gold },
    defaultToggleText: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.muted },
    formActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: 4 },
    cancelBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: Radius.lg,
        borderWidth: 1,
        borderColor: Colors.warm,
        alignItems: 'center',
    },
    cancelBtnText: { fontSize: Typography.sm, fontFamily: Typography.medium, color: Colors.muted },
    saveBtn: {
        flex: 2,
        paddingVertical: 12,
        borderRadius: Radius.lg,
        backgroundColor: Colors.gold,
        alignItems: 'center',
    },
    saveBtnDisabled: { opacity: 0.6 },
    saveBtnText: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.obsidian },
    editBtn: {},
    editBtnText: { fontSize: Typography.xs, fontFamily: Typography.semibold, color: Colors.gold },
    toggle: {
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.gold,
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    toggleOff: { backgroundColor: Colors.warm },
    toggleKnob: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: Colors.obsidian,
        alignSelf: 'flex-end',
    },
    toggleKnobOff: { alignSelf: 'flex-start' },
});
