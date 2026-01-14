import { MEASUREMENTS, MeasurementDefinition } from './measurements';
import { getRating, RATINGS } from './rating';

// Re-export for compatibility
export type MetricDefinition = MeasurementDefinition;
export const FREESTYLE_METRICS = MEASUREMENTS.filter(m => m.id !== 'bitemporal_width');

export const getIdealRange = (metricId: string, gender: 'male' | 'female'): string => {
    const config = RATINGS.find(r => r.measurementId === metricId && r.gender === gender);
    if (!config) return 'N/A';

    // Find 'Chad' or highest scoring tier
    const ideal = config.ranges.find(r => r.tier === 'Chad' || r.score >= 95);
    if (ideal) {
        return `${ideal.min}-${ideal.max}`;
    }
    return 'N/A';
};

export const calculateDeviationScore = (value: number, metric: MetricDefinition, gender: 'male' | 'female') => {
    // legacy support if gender missing (shouldn't happen in updated app)
    const activeGender = gender || 'male';

    const result = getRating(metric.id, value, activeGender);

    // Calculate "diff" for display (distance from ideal)
    // We need the ideal range again
    const config = RATINGS.find(r => r.measurementId === metric.id && r.gender === activeGender);
    let diff = 0;

    if (config) {
        const ideal = config.ranges.find(r => r.tier === 'Chad' || r.score >= 95);
        if (ideal) {
            if (value < ideal.min) diff = ideal.min - value;
            else if (value > ideal.max) diff = value - ideal.max;
        }
    }

    return {
        score: result.score,
        tier: result.tier,
        diff: diff, // Numeric difference from ideal
        idealRange: getIdealRange(metric.id, activeGender)
    };
};
