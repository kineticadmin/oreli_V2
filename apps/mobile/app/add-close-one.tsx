import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
} from 'react-native';
import { Image } from 'expo-image';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius } from '@/constants/Typography';
import { useCreateRelationship } from '@/hooks/useRelationships';

// ─── Data ────────────────────────────────────────────────────────────────────

type ApiRelationshipType = 'partner' | 'friend' | 'parent' | 'child' | 'colleague' | 'other';

const RELATIONSHIPS: { label: string; value: ApiRelationshipType }[] = [
    { label: 'Partenaire', value: 'partner' },
    { label: 'Meilleur(e) ami(e)', value: 'friend' },
    { label: 'Maman', value: 'parent' },
    { label: 'Papa', value: 'parent' },
    { label: 'Enfant', value: 'child' },
    { label: 'Sœur', value: 'other' },
    { label: 'Frère', value: 'other' },
    { label: 'Collègue', value: 'colleague' },
    { label: 'Ami(e)', value: 'friend' },
    { label: 'Autre', value: 'other' },
];

const INTERESTS = [
    'Gastronomie', 'Vins & champagne', 'Sport & fitness', 'Yoga & bien-être',
    'Art & culture', 'Lecture', 'Nature & plein air', 'Voyages',
    'Gaming', 'Musique', 'Mode & style', 'Cuisine & pâtisserie',
    'Décoration & design', 'Technologie', 'Cinéma & séries', 'Photographie',
    'Running', 'Méditation', 'Bijoux & accessoires', 'Spa & soins',
    'Jardinage', 'Danse', 'Astronomie', 'Langues',
];

function formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function dateToIso(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AddCloseOneScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();

    const [name, setName] = useState('');
    const [selectedRelationship, setSelectedRelationship] = useState<typeof RELATIONSHIPS[0] | null>(null);
    const [birthday, setBirthday] = useState<Date | null>(null);
    const [tempDate, setTempDate] = useState(new Date(1990, 0, 1));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    const createRelationship = useCreateRelationship();
    const canSave = name.trim().length > 0 && selectedRelationship !== null;

    const pickPhoto = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission requise', 'Autorisez l\'accès à vos photos pour ajouter une photo.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
        );
    };

    const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
        if (date) setTempDate(date);
    };

    const confirmDate = () => {
        setBirthday(tempDate);
        setShowDatePicker(false);
    };

    const handleSave = () => {
        if (!selectedRelationship) return;

        const preferences = selectedInterests.length > 0
            ? { interests: selectedInterests }
            : undefined;

        createRelationship.mutate(
            {
                displayName: name.trim(),
                relationshipType: selectedRelationship.value,
                birthdate: birthday ? dateToIso(birthday) : undefined,
                preferences,
            },
            {
                onSuccess: () => router.back(),
                onError: () => Alert.alert('Erreur', 'Impossible d\'ajouter ce proche. Vérifie ta connexion et réessaie.'),
            }
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: Colors.obsidian }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} hitSlop={12}>
                    <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ajouter un proche</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
                keyboardShouldPersistTaps="handled"
            >
                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <TouchableOpacity style={styles.avatarWrapper} onPress={pickPhoto} activeOpacity={0.8}>
                        {photoUri ? (
                            <Image source={{ uri: photoUri }} style={styles.avatarImage} contentFit="cover" />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                {name.trim() ? (
                                    <Text style={styles.avatarInitial}>{name.trim().charAt(0).toUpperCase()}</Text>
                                ) : (
                                    <Text style={styles.avatarIcon}>+</Text>
                                )}
                            </View>
                        )}
                        <View style={styles.avatarEditBadge}>
                            <Text style={styles.avatarEditIcon}>📷</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.avatarHint}>Ajouter une photo</Text>
                </View>

                {/* Prénom */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Prénom <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="ex : Sophie"
                        placeholderTextColor={Colors.muted}
                        style={styles.input}
                        autoCapitalize="words"
                        returnKeyType="next"
                    />
                </View>

                {/* Relation */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Relation <Text style={styles.required}>*</Text></Text>
                    <View style={styles.pillsGrid}>
                        {RELATIONSHIPS.map((rel) => {
                            const isSelected = selectedRelationship?.label === rel.label;
                            return (
                                <TouchableOpacity
                                    key={rel.label}
                                    style={[styles.pill, isSelected && styles.pillActive]}
                                    onPress={() => setSelectedRelationship(rel)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                                        {rel.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Anniversaire */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Date d'anniversaire</Text>
                    <TouchableOpacity
                        style={[styles.input, styles.dateInput]}
                        onPress={() => {
                            setTempDate(birthday ?? new Date(1990, 0, 1));
                            setShowDatePicker(true);
                        }}
                        activeOpacity={0.8}
                    >
                        <Text style={birthday ? styles.dateText : styles.datePlaceholder}>
                            {birthday ? formatDate(birthday) : 'Choisir une date'}
                        </Text>
                        {birthday && (
                            <TouchableOpacity onPress={() => setBirthday(null)} hitSlop={10}>
                                <Text style={styles.clearDate}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Centres d'intérêt */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Centres d'intérêt</Text>
                    <Text style={styles.sectionHint}>Sélectionne ce qu'il·elle aime</Text>
                    <View style={styles.interestsGrid}>
                        {INTERESTS.map((interest) => {
                            const isSelected = selectedInterests.includes(interest);
                            return (
                                <TouchableOpacity
                                    key={interest}
                                    style={[styles.interestChip, isSelected && styles.interestChipActive]}
                                    onPress={() => toggleInterest(interest)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.interestText, isSelected && styles.interestTextActive]}>
                                        {interest}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            {/* Save CTA */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
                    onPress={handleSave}
                    disabled={!canSave || createRelationship.isPending}
                    activeOpacity={0.85}
                >
                    {createRelationship.isPending ? (
                        <ActivityIndicator color={Colors.obsidian} />
                    ) : (
                        <Text style={styles.saveBtnText}>
                            {name.trim() ? `Enregistrer ${name.trim()}` : 'Enregistrer'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Date Picker Modal (iOS) */}
            <Modal visible={showDatePicker} transparent animationType="slide">
                <View style={styles.datePickerOverlay}>
                    <TouchableOpacity style={styles.datePickerBackdrop} onPress={() => setShowDatePicker(false)} />
                    <View style={[styles.datePickerSheet, { paddingBottom: insets.bottom + 16 }]}>
                        <View style={styles.datePickerHeader}>
                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                <Text style={styles.datePickerCancel}>Annuler</Text>
                            </TouchableOpacity>
                            <Text style={styles.datePickerTitle}>Date d'anniversaire</Text>
                            <TouchableOpacity onPress={confirmDate}>
                                <Text style={styles.datePickerConfirm}>Confirmer</Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker
                            value={tempDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            maximumDate={new Date()}
                            minimumDate={new Date(1920, 0, 1)}
                            onChange={handleDateChange}
                            locale="fr-FR"
                            style={{ backgroundColor: Colors.charcoal }}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const createStyles = (Colors: ThemeColors) => StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.warm,
    },
    closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    closeBtnText: { fontSize: 16, color: Colors.muted },
    headerTitle: { fontSize: 16, fontFamily: Typography.semibold, color: Colors.cream },

    scrollContent: { paddingTop: 8 },

    // Avatar
    avatarSection: { alignItems: 'center', paddingVertical: 28 },
    avatarWrapper: { position: 'relative' },
    avatarImage: { width: 88, height: 88, borderRadius: 44 },
    avatarPlaceholder: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: Colors.charcoal,
        borderWidth: 1.5,
        borderColor: Colors.warm,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: { fontSize: 32, fontFamily: Typography.bold, color: Colors.cream },
    avatarIcon: { fontSize: 28, color: Colors.muted },
    avatarEditBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.gold,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarEditIcon: { fontSize: 13 },
    avatarHint: { marginTop: 10, fontSize: 12, fontFamily: Typography.regular, color: Colors.muted },

    // Sections
    section: { paddingHorizontal: 20, marginBottom: 28 },
    sectionLabel: { fontSize: 13, fontFamily: Typography.semibold, color: Colors.cream, marginBottom: 10 },
    sectionHint: { fontSize: 12, fontFamily: Typography.regular, color: Colors.muted, marginBottom: 12, marginTop: -6 },
    required: { color: Colors.gold },

    // Input
    input: {
        backgroundColor: Colors.charcoal,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 15,
        fontSize: 15,
        fontFamily: Typography.regular,
        color: Colors.cream,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.warm,
    },

    // Date
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateText: { fontSize: 15, fontFamily: Typography.regular, color: Colors.cream },
    datePlaceholder: { fontSize: 15, fontFamily: Typography.regular, color: Colors.muted },
    clearDate: { fontSize: 13, color: Colors.muted, padding: 4 },

    // Pills (relation)
    pillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    pill: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Colors.warm,
        backgroundColor: Colors.charcoal,
    },
    pillActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '18' },
    pillText: { fontSize: 13, fontFamily: Typography.medium, color: Colors.muted },
    pillTextActive: { color: Colors.gold, fontFamily: Typography.semibold },

    // Interests
    interestsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    interestChip: {
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: Colors.warm,
        backgroundColor: Colors.charcoal,
    },
    interestChipActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '18' },
    interestText: { fontSize: 12, fontFamily: Typography.medium, color: Colors.muted },
    interestTextActive: { color: Colors.gold, fontFamily: Typography.semibold },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 12,
        backgroundColor: Colors.obsidian + 'F5',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: Colors.warm,
    },
    saveBtn: {
        backgroundColor: Colors.gold,
        paddingVertical: 16,
        borderRadius: Radius.full,
        alignItems: 'center',
    },
    saveBtnDisabled: { backgroundColor: Colors.stone, opacity: 0.6 },
    saveBtnText: { fontSize: 15, fontFamily: Typography.semibold, color: Colors.obsidian },

    // Date picker modal
    datePickerOverlay: { flex: 1, justifyContent: 'flex-end' },
    datePickerBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    datePickerSheet: {
        backgroundColor: Colors.charcoal,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 8,
    },
    datePickerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.warm,
    },
    datePickerTitle: { fontSize: 15, fontFamily: Typography.semibold, color: Colors.cream },
    datePickerCancel: { fontSize: 15, fontFamily: Typography.regular, color: Colors.muted },
    datePickerConfirm: { fontSize: 15, fontFamily: Typography.semibold, color: Colors.gold },
});
