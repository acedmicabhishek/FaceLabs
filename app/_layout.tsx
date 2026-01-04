import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
    const [loaded, error] = useFonts({
        'FiraCode-Regular': require('../resources/font/FiraCode-Regular.ttf'),
        'FiraCode-Bold': require('../resources/font/FiraCode-Bold.ttf'),
        'FiraCode-Medium': require('../resources/font/FiraCode-Medium.ttf'),
        'FiraCode-Light': require('../resources/font/FiraCode-Light.ttf'),
        'FiraCode-SemiBold': require('../resources/font/FiraCode-SemiBold.ttf'),
    });

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    if (!loaded) {
        return (
            <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#00D4FF" />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#000',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontFamily: 'FiraCode-Bold',
                    },
                    contentStyle: {
                        backgroundColor: '#000',
                    }
                }}
            >
                <Stack.Screen name="index" options={{ title: 'FaceLabs', headerShown: false }} />
                <Stack.Screen name="analysis" options={{ title: 'Analysis' }} />
                <Stack.Screen name="result" options={{ title: 'Your Report' }} />
            </Stack>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
