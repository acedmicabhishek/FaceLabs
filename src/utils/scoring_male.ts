import { Pillar } from '../types';

export interface IdealRangeDef {
    id: string;
    name: string;
    min: number;
    max: number;
    penaltyPerUnit: number;
    tier: Pillar;
    maxScore: number;
}

export const IDEAL_RANGES_MALE: Record<string, IdealRangeDef> = {
    // --- SIDE PROFILE ---
    gonial_angle: {
        id: 'gonial_angle',
        name: 'Gonial Angle',
        min: 110,
        max: 125,
        penaltyPerUnit: 2.0,
        tier: 'Angularity',
        maxScore: 100
    },
    ramus_to_mandible: {
        id: 'ramus_to_mandible',
        name: 'Ramus/Mandible Ratio',
        min: 0.7,
        max: 0.95,
        penaltyPerUnit: 30,
        tier: 'Angularity',
        maxScore: 100
    },
    nasolabial_angle: {
        id: 'nasolabial_angle',
        name: 'Nasolabial Angle',
        min: 90,
        max: 105, // Male preference: typically sharper/smaller than female
        penaltyPerUnit: 2,
        tier: 'Feature',
        maxScore: 100
    },
    nasofrontal_angle: {
        id: 'nasofrontal_angle',
        name: 'Nasofrontal Angle',
        min: 115,
        max: 130, // Male: typically more acute (brow ridge)
        penaltyPerUnit: 1.5,
        tier: 'Dimorphism',
        maxScore: 100
    },
    mentolabial_angle: {
        id: 'mentolabial_angle',
        name: 'Mentolabial Angle',
        min: 110,
        max: 130,
        penaltyPerUnit: 1.5,
        tier: 'Feature',
        maxScore: 100
    },
    facial_convexity: {
        id: 'facial_convexity',
        name: 'Facial Convexity',
        min: 165,
        max: 175,
        penaltyPerUnit: 3,
        tier: 'Harmony',
        maxScore: 100
    },
    submental_cervical: {
        id: 'submental_cervical',
        name: 'Submental Cervical',
        min: 90,
        max: 105,
        penaltyPerUnit: 2,
        tier: 'Feature',
        maxScore: 100
    },

    // --- FRONT PROFILE ---
    esr: {
        id: 'esr',
        name: 'Eye Separation Ratio',
        min: 0.45,
        max: 0.48, // Male: often slightly more compact e.g. 0.46
        penaltyPerUnit: 300,
        tier: 'Harmony',
        maxScore: 100
    },
    fwhr: {
        id: 'fwhr',
        name: 'fWHR',
        min: 1.9, // Higher fWHR is dimorphic for men
        max: 2.1,
        penaltyPerUnit: 20,
        tier: 'Dimorphism',
        maxScore: 100
    },
    midface_ratio: {
        id: 'midface_ratio',
        name: 'Midface Ratio',
        min: 0.90, // Compact midface
        max: 1.05,
        penaltyPerUnit: 40,
        tier: 'Harmony',
        maxScore: 100
    },
    canthal_tilt: {
        id: 'canthal_tilt',
        name: 'Canthal Tilt',
        min: 2,
        max: 8,
        penaltyPerUnit: 5,
        tier: 'Dimorphism',
        maxScore: 100
    },
    chin_philtrum: {
        id: 'chin_philtrum',
        name: 'Chin/Philtrum Ratio',
        min: 2.2, // Taller chin for men
        max: 2.8,
        penaltyPerUnit: 15,
        tier: 'Harmony',
        maxScore: 100
    },
    jaw_frontal: {
        id: 'jaw_frontal',
        name: 'Jaw Angle (Front)',
        min: 75,
        max: 85,
        penaltyPerUnit: 1.5,
        tier: 'Angularity',
        maxScore: 100
    }
};
