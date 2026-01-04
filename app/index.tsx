import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0f0c29', '#302b63', '#24243e']}
                style={styles.background}
            />

            <View style={styles.content}>
                <Text style={styles.title}>FACE<Text style={styles.highlight}>LABS</Text></Text>
                <Text style={styles.subtitle}>Precision Aesthetic Analysis</Text>

                <View style={styles.cardContainer}>
                    <Pressable
                        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                        onPress={() => router.push('/analysis?type=side')}
                    >
                        <Text style={styles.cardTitle}>Side Profile</Text>
                        <Text style={styles.cardDescription}>Analyze Gonial Angle, Ramus, and Projection.</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                        onPress={() => router.push('/analysis?type=front')}
                    >
                        <Text style={styles.cardTitle}>Front Profile</Text>
                        <Text style={styles.cardDescription}>Analyze Symmetry, Ratios, and Eye Spacing.</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
        letterSpacing: 2,
    },
    highlight: {
        color: '#00D4FF',
    },
    subtitle: {
        fontSize: 16,
        color: '#aaa',
        marginBottom: 60,
        letterSpacing: 1,
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
});
