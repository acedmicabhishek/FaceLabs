import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScoreReport } from '../src/types';

export default function ResultScreen() {
    const params = useLocalSearchParams();

    let report: ScoreReport | null = null;
    if (params.report) {
        try {
            report = JSON.parse(params.report as string);
        } catch (e) {
            console.error("Failed to parse report", e);
        }
    }

    if (!report) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#fff' }}>No Analysis Data Found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Score Header */}
            <LinearGradient
                colors={['#1a1f3c', '#000']}
                style={styles.scoreHeader}
            >
                <Text style={styles.scoreLabel}>FACE SCORE</Text>
                <Text style={styles.scoreValue}>{report.totalScore}</Text>
                <Text style={styles.scoreTier}>
                    {report.totalScore >= 8.5 ? 'TIER 1/2' : report.totalScore >= 7.0 ? 'TIER 3' : 'TIER 4+'}
                </Text>
            </LinearGradient>

            {/* Pillars Breakdown */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pillar Breakdown</Text>

                {Object.entries(report.subScores).map(([key, value]) => (
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

            {/* Detailed Metrics */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Detailed Analysis</Text>

                {report.metrics.map((m) => (
                    <View key={m.id} style={styles.metricCard}>
                        <Text style={styles.metricName}>{m.name}</Text>
                        <Text style={[
                            styles.metricValue,
                            isNaN(m.value) ? { color: '#ff4444' } : {}
                        ]}>
                            {isNaN(m.value) ? 'No Calc' : `${m.value.toFixed(1)}°`}
                        </Text>

                        {!isNaN(m.value) && (
                            <>
                                <Text style={styles.metricIdeal}>
                                    Ideal: {m.idealRange[0]} - {m.idealRange[1]}
                                </Text>
                                <Text style={[styles.metricIdeal, { color: '#00D4FF' }]}>
                                    Score: {m.score.toFixed(0)} ({m.tier})
                                </Text>
                            </>
                        )}
                        {isNaN(m.value) && (
                            <Text style={styles.metricIdeal}>Insufficient Data</Text>
                        )}
                    </View>
                ))}
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
