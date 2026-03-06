import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import { router, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/constants/Colors';
import { useSignup, ApiError } from '@/hooks/useAuth';

export default function SignupScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signupMutation = useSignup();

    async function handleSignup() {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) return;

        if (password.length < 8) {
            Alert.alert('Mot de passe trop court', 'Minimum 8 caractères.');
            return;
        }

        signupMutation.mutate(
            {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                password,
            },
            {
                onSuccess: () => router.replace('/(tabs)'),
                onError: (error) => {
                    const message =
                        error instanceof ApiError
                            ? error.message
                            : 'Une erreur est survenue. Réessayez.';
                    Alert.alert('Inscription impossible', message);
                },
            },
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                    <View style={styles.header}>
                        <Text style={styles.brand}>oreli</Text>
                        <Text style={styles.tagline}>Rejoignez la communauté du cadeau intelligent.</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.title}>Créer un compte</Text>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, styles.flex1]}>
                                <Text style={styles.label}>Prénom</Text>
                                <TextInput
                                    style={styles.input}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    placeholder="Alice"
                                    placeholderTextColor={Colors.muted}
                                    autoCapitalize="words"
                                />
                            </View>
                            <View style={[styles.inputGroup, styles.flex1]}>
                                <Text style={styles.label}>Nom</Text>
                                <TextInput
                                    style={styles.input}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    placeholder="Dupont"
                                    placeholderTextColor={Colors.muted}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="vous@exemple.com"
                                placeholderTextColor={Colors.muted}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mot de passe</Text>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="8 caractères minimum"
                                placeholderTextColor={Colors.muted}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, signupMutation.isPending && styles.buttonDisabled]}
                            onPress={handleSignup}
                            disabled={signupMutation.isPending}
                        >
                            {signupMutation.isPending ? (
                                <ActivityIndicator color={Colors.obsidian} />
                            ) : (
                                <Text style={styles.buttonText}>Créer mon compte</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Déjà un compte ? </Text>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.footerLink}>Se connecter</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
    return StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: Colors.obsidian },
        container: { flex: 1 },
        scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },
        header: { alignItems: 'center', marginBottom: 40 },
        brand: {
            fontSize: 40,
            fontFamily: 'Inter-Bold',
            color: Colors.gold,
            letterSpacing: -1,
        },
        tagline: {
            fontSize: 14,
            fontFamily: 'Inter-Regular',
            color: Colors.muted,
            marginTop: 4,
            textAlign: 'center',
        },
        form: { gap: 16 },
        title: {
            fontSize: 24,
            fontFamily: 'Inter-SemiBold',
            color: Colors.cream,
            marginBottom: 4,
        },
        row: { flexDirection: 'row', gap: 12 },
        flex1: { flex: 1 },
        inputGroup: { gap: 6 },
        label: {
            fontSize: 13,
            fontFamily: 'Inter-Medium',
            color: Colors.muted,
        },
        input: {
            backgroundColor: Colors.charcoal,
            borderWidth: 1,
            borderColor: Colors.glassBorder,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 16,
            fontFamily: 'Inter-Regular',
            color: Colors.cream,
        },
        button: {
            backgroundColor: Colors.gold,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            marginTop: 8,
        },
        buttonDisabled: { opacity: 0.6 },
        buttonText: {
            fontSize: 16,
            fontFamily: 'Inter-SemiBold',
            color: Colors.obsidian,
        },
        footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
        footerText: { fontSize: 14, fontFamily: 'Inter-Regular', color: Colors.muted },
        footerLink: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: Colors.gold },
    });
}
