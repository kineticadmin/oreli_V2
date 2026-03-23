import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useThemeColors } from '@/constants/Colors';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import { useFonts } from 'expo-font';
import { AppSplashScreen } from '@/components/AppSplashScreen';
import { useAuthStore } from '@/store/authStore';
import '../global.css';

const ONBOARDING_DONE_KEY = 'oreli_onboarding_done';

const STRIPE_PUBLISHABLE_KEY = process.env['EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY'] ?? '';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: 1, staleTime: 60 * 1000 },
    },
});

export default function RootLayout() {
    const Colors = useThemeColors();
    const [isAppReady, setIsAppReady] = useState(false);
    const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

    const { initializeAuth, isAuthenticated, isLoadingAuth } = useAuthStore();

    const [fontsLoaded, fontError] = useFonts({
        'Inter-Regular': 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
        'Inter-Medium': 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf',
        'Inter-SemiBold': 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf',
        'Inter-Bold': 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf',
    });

    // Vérifier si l'onboarding a déjà été vu
    useEffect(() => {
        SecureStore.getItemAsync(ONBOARDING_DONE_KEY).then((val) => {
            setHasSeenOnboarding(val === 'true');
        });
    }, []);

    // Charger fonts + restaurer session auth depuis SecureStore
    useEffect(() => {
        if (fontsLoaded || fontError) {
            initializeAuth().then(() => {
                SplashScreen.hideAsync().then(() => setIsAppReady(true));
            });
        }
    }, [fontsLoaded, fontError]);

    // Rediriger selon l'état d'auth et onboarding une fois prêt
    useEffect(() => {
        if (!isAppReady || isLoadingAuth || hasSeenOnboarding === null) return;
        if (isAuthenticated) {
            router.replace('/(tabs)');
        } else if (!hasSeenOnboarding) {
            router.replace('/onboarding');
        } else {
            router.replace('/(auth)/login');
        }
    }, [isAppReady, isAuthenticated, isLoadingAuth, hasSeenOnboarding]);

    if (!isAppReady) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY} merchantIdentifier="merchant.com.oreli.app">
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaProvider>
                    <StatusBar style="light" backgroundColor={Colors.obsidian} />
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: Colors.obsidian },
                            animation: 'slide_from_right',
                        }}
                    >
                        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
                        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
                        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
                        <Stack.Screen name="gift-flow" options={{ animation: 'slide_from_right' }} />
                        <Stack.Screen name="product/[id]" options={{ animation: 'slide_from_right' }} />
                        <Stack.Screen name="checkout" options={{ animation: 'slide_from_right' }} />
                        <Stack.Screen
                            name="confirmation"
                            options={{ presentation: 'modal', animation: 'fade' }}
                        />
                        <Stack.Screen
                            name="add-close-one"
                            options={{ presentation: 'modal', animation: 'slide_from_right' }}
                        />
                    </Stack>
                    {!isSplashAnimationComplete && (
                        <AppSplashScreen onReady={() => setSplashAnimationComplete(true)} />
                    )}
                </SafeAreaProvider>
            </GestureHandlerRootView>
            </StripeProvider>
        </QueryClientProvider>
    );
}
