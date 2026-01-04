import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import GuidedMapperFront from '../src/components/GuidedMapperFront';
import GuidedMapperSide from '../src/components/GuidedMapperSide';
import { Point } from '../src/types';
import { calculateAllMetrics } from '../src/utils/scoring';

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

    // 1. Gender Selection Step
    if (!gender) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Select Gender</Text>
                </View>
                <View style={styles.selectionContainer}>
                    <Pressable
                        style={[styles.genderButton, { borderColor: '#00D4FF' }]}
                        onPress={() => setGender('male')}
                    >
                        <Text style={[styles.genderText, { color: '#00D4FF' }]}>Male</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.genderButton, { borderColor: '#FF00D4', marginTop: 20 }]}
                        onPress={() => setGender('female')}
                    >
                        <Text style={[styles.genderText, { color: '#FF00D4' }]}>Female</Text>
                    </Pressable>
                </View>
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
            />
        );
    }


    const title = type === 'front' ? 'Front Profile Analysis' : 'Side Profile Analysis';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>Gender: {gender.charAt(0).toUpperCase() + gender.slice(1)}</Text>
            </View>

            <View style={styles.imageContainer}>
                <Pressable style={styles.uploadButton} onPress={pickImage}>
                    <Text style={styles.uploadText}>+ Upload Photo</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#111',
        borderBottomWidth: 1,
        borderBottomColor: '#222',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadButton: {
        padding: 30,
        borderWidth: 2,
        borderColor: '#333',
        borderStyle: 'dashed',
        borderRadius: 20,
        backgroundColor: '#111',
    },
    uploadText: {
        color: '#666',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    genderButton: {
        width: '100%',
        padding: 20,
        borderRadius: 12,
        borderWidth: 2,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
    },
    genderText: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
    }
});
