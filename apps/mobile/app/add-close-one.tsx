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
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius } from '@/constants/Typography';
import { useCreateRelationship } from '@/hooks/useRelationships';
import { t } from '@/constants/i18n';

const RELATIONSHIPS = ['Maman', 'Papa', 'Partenaire', 'Meilleure amie', 'Meilleur ami', 'Frère', 'Sœur', 'Collègue', 'Ami(e)'];
const TASTES = ['🍷 Gastronomie', '🏋 Sport', '🎨 Art', '📚 Lecture', '🌿 Nature', '✈️ Voyage', '🎮 Gaming', '🎵 Musique', '💄 Beauté', '🍳 Cuisine'];

export default function AddCloseOneScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();
    const [name, setName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [birthday, setBirthday] = useState('');
    const [birthdayError, setBirthdayError] = useState('');
    const [selectedTastes, setSelectedTastes] = useState<string[]>([]);

    const createRelationship = useCreateRelationship();
    const canSave = name.trim().length > 0 && relationship.length > 0;

    const validateBirthday = (value: string) => {
        setBirthday(value);
        if (value.length === 0) {
            setBirthdayError('');
            return;
        }
        const isValid = /^\d{2}\/\d{2}\/\d{4}$/.test(value);
        setBirthdayError(isValid ? '' : 'Format attendu : JJ/MM/AAAA');
    };

    const toggleTaste = (taste: string) => {
        setSelectedTastes((prev) =>
            prev.includes(taste) ? prev.filter((t) => t !== taste) : [...prev, taste]
        );
    };

    const parseBirthdayToIso = (ddMmYyyy: string): string | undefined => {
        const [day, month, year] = ddMmYyyy.split('/');
        if (!day || !month || !year) return undefined;
        return `${year}-${month}-${day}`;
    };

    const handleSave = () => {
        const birthdate = birthday.trim() ? parseBirthdayToIso(birthday.trim()) : undefined;
        const preferences = selectedTastes.length > 0 ? { interests: selectedTastes } : undefined;

        createRelationship.mutate(
            { displayName: name.trim(), relationshipType: relationship, birthdate, preferences },
            {
                onSuccess: () => router.back(),
                onError: () => Alert.alert('Erreur', 'Impossible d\'ajouter ce proche. Réessaie.'),
            }
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: Colors.obsidian }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                    <Text style={styles.closeBtnText}>{t('common.close')}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('addCloseOne.title')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Name */}
                <View style={styles.section}>
                    <Text style={styles.fieldLabel}>{t('addCloseOne.firstName')}</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="ex : Sophie"
                        placeholderTextColor={Colors.muted}
                        style={styles.input}
                    />
                </View>

                {/* Relationship */}
                <View style={styles.section}>
                    <Text style={styles.fieldLabel}>{t('addCloseOne.relation')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.pillRow}>
                            {RELATIONSHIPS.map((r) => (
                                <TouchableOpacity
                                    key={r}
                                    style={[styles.pill, relationship === r && styles.pillActive]}
                                    onPress={() => setRelationship(r)}
                                    activeOpacity={0.75}
                                >
                                    <Text style={[styles.pillText, relationship === r && styles.pillTextActive]}>
                                        {r}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Birthday */}
                <View style={styles.section}>
                    <Text style={styles.fieldLabel}>{t('addCloseOne.birthDate')}</Text>
                    <TextInput
                        value={birthday}
                        onChangeText={validateBirthday}
                        placeholder="ex : 15/03/1990"
                        placeholderTextColor={Colors.muted}
                        style={[styles.input, birthdayError ? styles.inputError : null]}
                        keyboardType="numbers-and-punctuation"
                    />
                    {birthdayError ? <Text style={styles.errorText}>{birthdayError}</Text> : null}
                </View>

                {/* Tastes */}
                <View style={styles.section}>
                    <Text style={styles.fieldLabel}>{t('addCloseOne.interests')}</Text>
                    <View style={styles.tastesGrid}>
                        {TASTES.map((t) => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.tasteBtn, selectedTastes.includes(t) && styles.tasteBtnActive]}
                                onPress={() => toggleTaste(t)}
                                activeOpacity={0.75}
                            >
                                <Text style={[styles.tasteBtnText, selectedTastes.includes(t) && styles.tasteBtnTextActive]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Save CTA */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    style={[styles.saveBtn, (!canSave || createRelationship.isPending) && styles.saveBtnDisabled]}
                    onPress={handleSave}
                    disabled={!canSave || createRelationship.isPending}
                    activeOpacity={0.85}
                >
                    {createRelationship.isPending ? (
                        <ActivityIndicator color={Colors.obsidian} />
                    ) : (
                        <Text style={[styles.saveBtnText, !canSave && styles.saveBtnTextDisabled]}>
                            {t('common.save')} {name || ''}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const createStyles = (Colors: ThemeColors) => StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.warm, marginBottom: 8 },
    closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    closeBtnText: { fontSize: 18, color: Colors.muted },
    headerTitle: { fontSize: Typography.base, fontFamily: Typography.bold, color: Colors.cream },
    section: { paddingHorizontal: Spacing.xl, marginTop: Spacing.xl },
    fieldLabel: { fontSize: Typography.sm, fontFamily: Typography.semibold, color: Colors.cream, marginBottom: 10 },
    input: { backgroundColor: Colors.charcoal, borderRadius: Radius.xl, paddingHorizontal: 16, paddingVertical: 14, fontSize: Typography.sm, fontFamily: Typography.regular, color: Colors.cream, borderWidth: 1, borderColor: Colors.warm },
    inputError: { borderColor: Colors.error },
    errorText: { fontSize: Typography.xs, fontFamily: Typography.regular, color: Colors.error, marginTop: 6 },
    pillRow: { flexDirection: 'row', gap: 8 },
    pill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.warm, backgroundColor: Colors.charcoal },
    pillActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '22' },
    pillText: { fontSize: Typography.sm, fontFamily: Typography.medium, color: Colors.muted },
    pillTextActive: { color: Colors.gold },
    tastesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tasteBtn: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.warm, backgroundColor: Colors.charcoal },
    tasteBtnActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '22' },
    tasteBtnText: { fontSize: Typography.xs, fontFamily: Typography.medium, color: Colors.muted },
    tasteBtnTextActive: { color: Colors.gold },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: Spacing.xl, paddingTop: 16, backgroundColor: Colors.obsidian + 'F0', borderTopWidth: 1, borderTopColor: Colors.warm },
    saveBtn: { backgroundColor: Colors.gold, paddingVertical: 16, borderRadius: Radius.full, alignItems: 'center' },
    saveBtnDisabled: { backgroundColor: Colors.stone },
    saveBtnText: { fontSize: Typography.base, fontFamily: Typography.semibold, color: Colors.obsidian },
    saveBtnTextDisabled: { color: Colors.warm },
});
