import { Tier } from './rating';

interface ThirdsConfig {
    upperMid: [number, number]; // Range for Upper AND Mid
    lower?: [number, number];   // Optional specific range for Lower
}

export const FACIAL_THIRDS_CRITERIA: {
    male: Record<Tier, ThirdsConfig[]>;
    female: Record<Tier, ThirdsConfig[]>;
} = {
    male: {
        'Chad': [
            { upperMid: [30, 33], lower: [34, 38] }
        ],
        'CL': [
            { upperMid: [28, 38] },      // Broader range from image
            { upperMid: [30.5, 35.5] }   // Narrower range (redundant but explicit in source)
        ],
        'HTN': [
            { upperMid: [26.5, 39.5] },
            { upperMid: [29, 37] }
        ],
        'MTN': [
            { upperMid: [25, 41] },
            { upperMid: [26.5, 39.5] }
        ],
        'LTN': [
            { upperMid: [23.5, 42.5] },
            { upperMid: [25, 41] }
        ],
        'Sub5': [
            { upperMid: [22.5, 43.5] },
            { upperMid: [24, 42] }
        ],
        'SUBHUMAN': [
            { upperMid: [18, 50] }
        ]
    },
    female: {
        'Chad': [
            { upperMid: [30, 36] },
            { upperMid: [31.5, 34.5] }
        ],
        'CL': [
            { upperMid: [29.5, 37.5] },
            { upperMid: [31, 35] }
        ],
        'HTN': [
            { upperMid: [27, 39] },
            { upperMid: [29.5, 36.5] }
        ],
        'MTN': [
            { upperMid: [25, 41] },
            { upperMid: [29.5, 37.5] }
        ],
        'LTN': [
            { upperMid: [24, 42] },
            { upperMid: [28, 38] }
        ],
        'Sub5': [
            { upperMid: [23, 43] },
            { upperMid: [27, 39] }
        ],
        'SUBHUMAN': [
            { upperMid: [18, 50] }
        ]
    }
};

const SCORES: Record<Tier, { male: number, female: number }> = {
    'Chad': { male: 35, female: 30 },
    'CL': { male: 17.5, female: 15 },
    'HTN': { male: 8.75, female: 7.5 },
    'MTN': { male: 4.38, female: 3.75 },
    'LTN': { male: 0, female: 0 },
    'Sub5': { male: -4.38, female: -3.75 },
    'SUBHUMAN': { male: -17.5, female: -15 }
};

export const getFacialThirdsRating = (
    upper: number,
    mid: number,
    lower: number,
    gender: 'male' | 'female'
): { tier: Tier, score: number } => {
    // Normalize to percentages if not already (safeguard)
    const total = upper + mid + lower;
    const pUpper = (upper / total) * 100;
    const pMid = (mid / total) * 100;
    const pLower = (lower / total) * 100;

    const tiers: Tier[] = ['Chad', 'CL', 'HTN', 'MTN', 'LTN', 'Sub5', 'SUBHUMAN'];
    const configs = FACIAL_THIRDS_CRITERIA[gender];

    for (const tier of tiers) {
        const criteriaList = configs[tier];
        if (!criteriaList) continue;

        // Check if ANY criteria in the list is met
        for (const criteria of criteriaList) {
            const upperMidMet =
                (pUpper >= criteria.upperMid[0] && pUpper <= criteria.upperMid[1]) &&
                (pMid >= criteria.upperMid[0] && pMid <= criteria.upperMid[1]);

            let lowerMet = true;
            if (criteria.lower) {
                lowerMet = (pLower >= criteria.lower[0] && pLower <= criteria.lower[1]);
            }

            if (upperMidMet && lowerMet) {
                return { tier, score: SCORES[tier][gender] };
            }
        }
    }

    return { tier: 'SUBHUMAN', score: SCORES['SUBHUMAN'][gender] };
};
