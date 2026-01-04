import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';


const MOCK_REPORT = {
    totalScore: 87,
    subScores: {
        Harmony: 82,
        Dimorphism: 91,
        Angularity: 88,
        SoftTissue: 75,
    }
};

export default function ResultScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Score Header */}
            <LinearGradient
                colors={['#1a1f3c', '#000']}
                style={styles.scoreHeader}
            >
                <Text style={styles.scoreLabel}>FACE SCORE</Text>
                <Text style={styles.scoreValue}>{MOCK_REPORT.totalScore}</Text>
                <Text style={styles.scoreTier}>TIER 2 (Model)</Text>
            </LinearGradient>

            {/* Pillars Breakdown */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pillar Breakdown</Text>

                {Object.entries(MOCK_REPORT.subScores).map(([key, value]) => (
                    <View key={key} style={styles.statRow}>
                        <View style={styles.statLabelContainer}>
                            <Text style={styles.statLabel}>{key}</Text>
                        </View>
                        <View style={styles.barContainer}>
                            <View style={[styles.barFill, { width: `${value}%` }]} />
                        </View>
                        <Text style={styles.statValue}>{value}</Text>
                    </View>
                ))}
            </View>

            {/* Detailed Metrics Placeholder */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Detailed Analysis</Text>
                <View style={styles.metricCard}>
                    <Text style={styles.metricName}>Gonial Angle</Text>
                    <Text style={styles.metricValue}>118.5°</Text>
                    <Text style={styles.metricIdeal}>Ideal: 113° - 125°</Text>
                </View>

                <View style={styles.metricCard}>
                    <Text style={styles.metricName}>Ramus/Mandible</Text>
                    <Text style={styles.metricValue}>0.65</Text>
                    <Text style={styles.metricIdeal}>Ideal: 0.6 - 0.71</Text>
                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scoreHeader: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        marginBottom: 20,
    },
    scoreLabel: {
        color: '#888',
        fontSize: 16,
        letterSpacing: 2,
        marginBottom: 10,
    },
    scoreValue: {
        color: '#fff',
        fontSize: 96,
        fontWeight: 'bold',
        includeFontPadding: false,
        lineHeight: 96,
    },
    scoreTier: {
        color: '#00D4FF',
        fontSize: 20,
        marginTop: 10,
        fontWeight: '600',
    },
    section: {
        padding: 24,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    statLabelContainer: {
        width: 100,
    },
    statLabel: {
        color: '#ccc',
        fontSize: 14,
    },
    barContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#222',
        borderRadius: 4,
        marginHorizontal: 12,
    },
    barFill: {
        height: '100%',
        backgroundColor: '#00D4FF',
        borderRadius: 4,
    },
    statValue: {
        color: '#fff',
        fontWeight: 'bold',
        width: 30,
        textAlign: 'right',
    },
    metricCard: {
        backgroundColor: '#111',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#00D4FF',
    },
    metricName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    metricValue: {
        color: '#ccc',
        fontSize: 14,
        marginTop: 4,
    },
    metricIdeal: {
        color: '#666',
        fontSize: 12,
        marginTop: 4,
    },
});
