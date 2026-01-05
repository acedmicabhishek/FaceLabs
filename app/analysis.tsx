import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import GuidedMapperFront from '../src/components/GuidedMapperFront';
import GuidedMapperSide from '../src/components/GuidedMapperSide';
import { Point } from '../src/types';
import { calculateAllMetrics } from '../src/utils/scoring';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AnalysisScreen() {
    const { type } = useLocalSearchParams();
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [points, setPoints] = useState<Point[]>([]);
    const [gender, setGender] = useState<'male' | 'female' | null>(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setPoints([]);
        }
    };

    const handleCalculate = () => {
        if (!gender) return;
        const report = calculateAllMetrics(points, type as 'front' | 'side', gender);
        router.push({
            pathname: '/result',
            params: { report: JSON.stringify(report) }
        });
    };

    const goHome = () => {
        router.replace('/');
    };

    // 1. Gender Selection Step (Themed)
    if (!gender) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['#0f0c29', '#302b63', '#24243e']}
                    style={StyleSheet.absoluteFill}
                />

                <SafeAreaView style={{ flex: 1 }}>
                    <Pressable onPress={goHome} style={styles.topBackBtn}>
                        <Text style={styles.topBackText}>{'<'}</Text>
                    </Pressable>

                    <View style={styles.content}>
                        <Text style={styles.heroTitle}>GENDER<Text style={styles.highlight}> SELECT</Text></Text>
                        <Text style={styles.heroSubtitle}>Calibrate Analysis Standards</Text>

                        <View style={styles.cardContainer}>
                            <Pressable
                                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                                onPress={() => setGender('male')}
                            >
                                <Text style={styles.cardTitle}>Male</Text>
                                <Text style={styles.cardDescription}>Optimized for masculine aesthetic markers and ratios.</Text>
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                                onPress={() => setGender('female')}
                            >
                                <Text style={styles.cardTitle}>Female</Text>
                                <Text style={styles.cardDescription}>Optimized for feminine aesthetic markers and ratios.</Text>
                            </Pressable>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    // 2. Mapper Step (Front)
    if (type === 'front' && image) {
        return (
            <GuidedMapperFront
                imageUri={image}
                points={points}
                onPointsUpdate={setPoints}
                onComplete={handleCalculate}
                onBack={() => setImage(null)}
                onExit={goHome}
            />
        );
    }

    // 3. Mapper Step (Side)
    if (type === 'side' && image) {
        return (
            <GuidedMapperSide
                imageUri={image}
                points={points}
                onPointsUpdate={setPoints}
                onComplete={handleCalculate}
                onBack={() => setImage(null)}
                onExit={goHome}
            />
        );
    }


    const titleText = type === 'front' ? 'FRONT' : 'SIDE';
    const subtitleText = type === 'front' ? 'Frontal Analysis Setup' : 'Side Profile Analysis Setup';

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0f0c29', '#302b63', '#24243e']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <Pressable onPress={goHome} style={styles.topBackBtn}>
                    <Text style={styles.topBackText}>{'<'}</Text>
                </Pressable>

                <View style={styles.content}>
                    <Text style={styles.heroTitle}>
                        {titleText} <Text style={styles.highlight}>PROFILE</Text>
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        {subtitleText} ({gender?.toUpperCase()})
                    </Text>

                    <View style={styles.cardContainer}>
                        <Pressable
                            style={({ pressed }) => [styles.uploadCard, pressed && styles.cardPressed]}
                            onPress={pickImage}
                        >
                            <View style={styles.uploadIconCircle}>
                                <Text style={styles.uploadIcon}>+</Text>
                            </View>
                            <Text style={styles.cardTitle}>Upload Photo</Text>
                            <Text style={styles.cardDescription}>Select from gallery. Ensure good lighting and neutral expression.</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    // Top Back Button
    topBackBtn: {
        position: 'absolute',
        top: 20, // SafeAreaView adds padding, but this gives extra margin from top edge
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
    },
    topBackText: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'FiraCode-Bold',
        marginTop: -2, // Visual optical adjustment
    },

    // --- Themed Gender Selection Styles ---
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    heroTitle: {
        fontSize: 48,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
        letterSpacing: 2,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 60,
        letterSpacing: 1,
    },
    highlight: {
        color: '#00D4FF',
    },
    cardContainer: {
        width: '100%',
        gap: 20,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        width: '100%',
    },
    cardPressed: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        transform: [{ scale: 0.98 }],
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: '#ccc',
    },

    // --- Upload Card Styles ---
    uploadCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 40,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#00D4FF',
        borderStyle: 'dashed',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    uploadIcon: {
        fontSize: 40,
        color: '#00D4FF',
        fontWeight: '300',
    },
});
