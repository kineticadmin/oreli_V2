import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { Typography } from '@/constants/Typography';

interface AppSplashScreenProps {
    onReady: () => void;
}

export function AppSplashScreen({ onReady }: AppSplashScreenProps) {
    const opacity = useRef(new Animated.Value(1)).current;
    const scale = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        // Scale up the logo
        Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // After a pause, fade out
        Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            delay: 1500,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                onReady();
            }
        });
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={{ opacity, transform: [{ scale }] }}>
                <Text style={styles.logoText}>Oreli</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FCFBF9',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    logoText: {
        fontFamily: Typography.bold,
        fontSize: 42,
        color: '#1C1917',
        letterSpacing: -1.5,
    },
});
