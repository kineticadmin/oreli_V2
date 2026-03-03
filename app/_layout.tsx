import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useThemeColors } from '@/constants/Colors';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { AppSplashScreen } from '@/components/AppSplashScreen';
import '../global.css';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const Colors = useThemeColors();
    const [isAppReady, setIsAppReady] = useState(false);
    const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);

    const [fontsLoaded, fontError] = useFonts({
        'Inter-Regular': 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
        'Inter-Medium': 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf',
        'Inter-SemiBold': 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf',
        'Inter-Bold': 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf',
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync().then(() => {
                setIsAppReady(true);
            });
        }
    }, [fontsLoaded, fontError]);

    if (!isAppReady) {
        return null;
    }

    return (
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
                    <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
                    <Stack.Screen
                        name="gift-flow"
                        options={{
                            animation: 'slide_from_right',
                        }}
                    />
                    <Stack.Screen name="product/[id]" options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen name="checkout" options={{ animation: 'slide_from_right' }} />
                    <Stack.Screen
                        name="confirmation"
                        options={{ presentation: 'modal', animation: 'fade' }}
                    />
                    <Stack.Screen
                        name="add-close-one"
                        options={{
                            presentation: 'modal',
                            animation: 'slide_from_right',
                        }}
                    />
                </Stack>
                {!isSplashAnimationComplete && (
                    <AppSplashScreen onReady={() => setSplashAnimationComplete(true)} />
                )}
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
