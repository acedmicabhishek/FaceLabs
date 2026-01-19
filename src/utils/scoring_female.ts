import { IdealRangeDef } from './scoring_male'; // Re-use interface

export const IDEAL_RANGES_FEMALE: Record<string, IdealRangeDef> = {
    // --- SIDE PROFILE ---
    gonial_angle: {
        id: 'gonial_angle',
        name: 'Gonial Angle',
        min: 120, // Female: often softer/wider angle
        max: 135,
        penaltyPerUnit: 2.0,
        tier: 'Angularity',
        maxScore: 100
    },
    ramus_mandible_ratio: {
        id: 'ramus_mandible_ratio',
        name: 'Ramus/Mandible Ratio',
        min: 0.6, // Shorter ramus often acceptable
        max: 0.9,
        penaltyPerUnit: 30,
        tier: 'Angularity',
        maxScore: 100
    },
    nasolabial_angle: {
        id: 'nasolabial_angle',
        name: 'Nasolabial Angle',
        min: 95,
        max: 115, // Female: Typically more obtuse (upturned nose)
        penaltyPerUnit: 2,
        tier: 'Soft Tissue',
        maxScore: 100
    },
    nasofrontal_angle: {
        id: 'nasofrontal_angle',
        name: 'Nasofrontal Angle',
        min: 125,
        max: 145, // Female: Smoother brow transition
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
        tier: 'Soft Tissue',
        maxScore: 100
    },
    facial_convexity: {
        id: 'facial_convexity',
        name: 'Facial Convexity',
        min: 168,
        max: 178, // Slightly more convex/soft
        penaltyPerUnit: 3,
        tier: 'Harmony',
        maxScore: 100
    },
    submental_cervical: {
        id: 'submental_cervical',
        name: 'Submental Cervical',
        min: 90,
        max: 110,
        penaltyPerUnit: 2,
        tier: 'Soft Tissue',
        maxScore: 100
    },

    // --- FRONT PROFILE ---
    esr: {
        id: 'esr',
        name: 'Eye Separation Ratio',
        min: 0.46,
        max: 0.50, // Female: wider set eyes often attractive
        penaltyPerUnit: 300,
        tier: 'Harmony',
        maxScore: 100
    },
    fwhr: {
        id: 'fwhr',
        name: 'fWHR',
        min: 1.7, // Lower fWHR (less aggressive)
        max: 2.0,
        penaltyPerUnit: 20,
        tier: 'Dimorphism',
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
    },
    canthal_tilt: {
        id: 'canthal_tilt',
        name: 'Canthal Tilt',
        min: 4,
        max: 10, // Higher tilt often preferred
        penaltyPerUnit: 5,
        tier: 'Dimorphism',
        maxScore: 100
    },
    chin_philtrum_ratio: {
        id: 'chin_philtrum_ratio',
        name: 'Chin/Philtrum Ratio',
        min: 1.8, // Smaller chin relative to philtrum than males
        max: 2.4,
        penaltyPerUnit: 15,
        tier: 'Harmony',
        maxScore: 100
    },
    jfa: {
        id: 'jfa',
        name: 'Jaw Angle (Front)',
        min: 70,
        max: 82, // V-shape preferred (65-80 range)
        // V-shape (steeper angle from horizontal) implies higher value? 
        // Wait, if 90 is vertical, and 0 is horizontal.
        // V-shape means the line is STEEPER? 
        // A square jaw is closer to vertical (90).
        // A V-shape means the chin is narrow, so the line from Gonion to Chin is NOT vertical, it's angled IN.
        // So the angle with horizontal is SMALLER? 
        // Gonion (Top/Out) -> Chin (Bottom/In).
        // Vertical = 90.
        // Inward slope = >90 or <90 depending on ref.
        // Let's assume Angle is 0-90.
        // Square jaw ~ 80-90.
        // V-shape ~ 60-75.
        // For Female: V-shape preferred? So 65-80?
        penaltyPerUnit: 1.5,
        tier: 'Angularity',
        maxScore: 100
    }
};
