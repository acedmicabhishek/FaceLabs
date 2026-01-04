import { Metric, Pillar, ScoreReport } from '../types';

interface IdealRangeDef {
    id: string;
    name: string;
    min: number;
    max: number;
    penaltyPerUnit: number; 
    tier: Pillar;
    maxScore: number; 
}


export const IDEAL_RANGES: Record<string, IdealRangeDef> = {
    
    gonial_angle: {
        id: 'gonial_angle',
        name: 'Gonial Angle',
        min: 113,
        max: 125,
        penaltyPerUnit: 2.5,
        tier: 'Angularity',
        maxScore: 100
    },
    ramus_mandible: {
        id: 'ramus_mandible',
        name: 'Ramus to Mandible Ratio',
        min: 0.6,
        max: 0.71,
        penaltyPerUnit: 50, 
        tier: 'Angularity',
        maxScore: 100
    },
    
    nasolabial_angle: {
        id: 'nasolabial_angle',
        name: 'Nasolabial Angle',
        min: 94,
        max: 117.5,
        penaltyPerUnit: 2, 
        tier: 'SoftTissue',
        maxScore: 100
    },
    mentolabial: {
        id: 'mentolabial',
        name: 'Mentolabial Angle',
        min: 108,
        max: 130,
        penaltyPerUnit: 1, 
        tier: 'SoftTissue',
        maxScore: 100
    },
    submental_cervical: {
        id: 'submental_cervical',
        name: 'Submental Cervical Angle',
        min: 92,
        max: 110,
        penaltyPerUnit: 3, 
        tier: 'SoftTissue',
        maxScore: 100
    },
    
    facial_convexity: {
        id: 'facial_convexity',
        name: 'Facial Convexity',
        min: 168.6,
        max: 176,
        penaltyPerUnit: 2.5, 
        tier: 'Harmony',
        maxScore: 100
    },
    
    nasofrontal: {
        id: 'nasofrontal',
        name: 'Nasofrontal Angle',
        min: 106,
        max: 130,
        penaltyPerUnit: 2, 
        tier: 'Dimorphism',
        maxScore: 100
    },

    
    fwhr: {
        id: 'fwhr',
        name: 'Face Width-to-Height',
        min: 1.8,
        max: 2.1,
        penaltyPerUnit: 20, 
        tier: 'Dimorphism',
        maxScore: 100
    },
    jaw_frontal: {
        id: 'jaw_frontal',
        name: 'Jaw Frontal Angle',
        min: 83,
        max: 95,
        penaltyPerUnit: 2,
        tier: 'Dimorphism',
        maxScore: 100
    },
    
    canthal_tilt: {
        id: 'canthal_tilt',
        name: 'Canthal Tilt',
        min: 5,
        max: 8.5,
        penaltyPerUnit: 5, 
        tier: 'Harmony',
        maxScore: 100
    },
    esr: {
        id: 'esr',
        name: 'Eye Spacing Ratio',
        min: 0.46,
        max: 0.50,
        penaltyPerUnit: 100, 
        tier: 'Harmony',
        maxScore: 100
    },
    chin_philtrum: {
        id: 'chin_philtrum',
        name: 'Chin-to-Philtrum Ratio',
        min: 2.0,
        max: 2.5,
        penaltyPerUnit: 10,
        tier: 'Harmony',
        maxScore: 100
    },
    midface_ratio: {
        id: 'midface_ratio',
        name: 'Midface Ratio',
        min: 0.95,
        max: 1.05,
        penaltyPerUnit: 40,
        tier: 'Harmony',
        maxScore: 100
    }
};

export const calculateMetricScore = (metricId: string, value: number): Metric => {
    const def = IDEAL_RANGES[metricId];
    if (!def) {
        throw new Error(`Metric ID ${metricId} not found in database`);
    }

    let deviation = 0;
    if (value < def.min) {
        deviation = def.min - value;
    } else if (value > def.max) {
        deviation = value - def.max;
    }

    const penalty = deviation * def.penaltyPerUnit;
    const rawScore = Math.max(0, def.maxScore - penalty);

    return {
        id: def.id,
        name: def.name,
        value,
        score: rawScore,
        tier: getTier(rawScore),
        idealRange: [def.min, def.max],
        category: def.tier
    };
};

const getTier = (score: number): string => {
    if (score >= 95) return 'Tier 1 (Godlike)';
    if (score >= 85) return 'Tier 2 (Model)';
    if (score >= 75) return 'Tier 3 (Good)';
    if (score >= 60) return 'Tier 4 (Average)';
    if (score >= 45) return 'Tier 5 (Below Avg)';
    return 'Tier 6/7 (Recessed)';
};


export const generateReport = (metrics: Metric[]): ScoreReport => {
    const pillars: Record<Pillar, { total: number; count: number }> = {
        Harmony: { total: 0, count: 0 },
        Dimorphism: { total: 0, count: 0 },
        Angularity: { total: 0, count: 0 },
        SoftTissue: { total: 0, count: 0 }
    };

    
    metrics.forEach(m => {
        pillars[m.category].total += m.score;
        pillars[m.category].count += 1;
    });

    const getAvg = (p: Pillar) => pillars[p].count > 0 ? pillars[p].total / pillars[p].count : 0;

    const harmonyScore = getAvg('Harmony');
    const dimorphismScore = getAvg('Dimorphism');
    const angularityScore = getAvg('Angularity');
    const softTissueScore = getAvg('SoftTissue');

    
    
    const totalScore =
        (harmonyScore * 0.30) +
        (dimorphismScore * 0.30) +
        (angularityScore * 0.25) +
        (softTissueScore * 0.15);

    return {
        totalScore: Math.round(totalScore),
        subScores: {
            harmony: Math.round(harmonyScore),
            dimorphism: Math.round(dimorphismScore),
            angularity: Math.round(angularityScore),
            softTissue: Math.round(softTissueScore)
        },
        metrics
    };
};
