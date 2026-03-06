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
} from 'react-native';
import { router, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '@/constants/Colors';
import { useLogin, ApiError } from '@/hooks/useAuth';

export default function LoginScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginMutation = useLogin();

    async function handleLogin() {
        if (!email.trim() || !password) return;

        loginMutation.mutate(
            { email: email.trim().toLowerCase(), password },
            {
                onSuccess: () => router.replace('/(tabs)'),
                onError: (error) => {
                    const message =
                        error instanceof ApiError
                            ? error.message
                            : 'Une erreur est survenue. Réessayez.';
                    Alert.alert('Connexion impossible', message);
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
                <View style={styles.header}>
                    <Text style={styles.brand}>oreli</Text>
                    <Text style={styles.tagline}>Offrir, simplement.</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.title}>Connexion</Text>

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
                            placeholder="••••••••"
                            placeholderTextColor={Colors.muted}
                            secureTextEntry
                            onSubmitEditing={handleLogin}
                            returnKeyType="done"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loginMutation.isPending && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? (
                            <ActivityIndicator color={Colors.obsidian} />
                        ) : (
                            <Text style={styles.buttonText}>Se connecter</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Pas encore de compte ? </Text>
                        <Link href="/(auth)/signup" asChild>
                            <TouchableOpacity>
                                <Text style={styles.footerLink}>Créer un compte</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

function createStyles(Colors: ReturnType<typeof useThemeColors>) {
    return StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: Colors.obsidian,
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
        },
        header: {
            alignItems: 'center',
            marginBottom: 48,
        },
        brand: {
            fontSize: 40,
            fontFamily: 'Inter-Bold',
            color: Colors.gold,
            letterSpacing: -1,
        },
        tagline: {
            fontSize: 15,
            fontFamily: 'Inter-Regular',
            color: Colors.muted,
            marginTop: 4,
        },
        form: {
            gap: 16,
        },
        title: {
            fontSize: 24,
            fontFamily: 'Inter-SemiBold',
            color: Colors.cream,
            marginBottom: 8,
        },
        inputGroup: {
            gap: 6,
        },
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
        buttonDisabled: {
            opacity: 0.6,
        },
        buttonText: {
            fontSize: 16,
            fontFamily: 'Inter-SemiBold',
            color: Colors.obsidian,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 8,
        },
        footerText: {
            fontSize: 14,
            fontFamily: 'Inter-Regular',
            color: Colors.muted,
        },
        footerLink: {
            fontSize: 14,
            fontFamily: 'Inter-SemiBold',
            color: Colors.gold,
        },
    });
}
