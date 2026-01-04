import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import GuidedMapperFront from '../src/components/GuidedMapperFront';
import GuidedMapperSide from '../src/components/GuidedMapperSide';
import { Point } from '../src/types';

const { width } = Dimensions.get('window');

export default function AnalysisScreen() {
    const { type } = useLocalSearchParams();
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [points, setPoints] = useState<Point[]>([]);

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
        router.push('/result');
    };

    
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
});
