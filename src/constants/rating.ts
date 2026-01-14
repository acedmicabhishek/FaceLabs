import { MeasurementDefinition } from './measurements';

export type Tier = 'Chad' | 'CL' | 'HTN' | 'MTN' | 'LTN' | 'Sub5' | 'SUBHUMAN';

export interface RatingRange {
    min: number;
    max: number;
    tier: Tier;
    score: number;
}

export interface RatingConfig {
    measurementId: string;
    gender: 'male' | 'female';
    ranges: RatingRange[];
}

export const RATINGS: RatingConfig[] = [
    // --- SIDE PROFILE ---

    // Gonial Angle
    {
        measurementId: 'gonial_angle',
        gender: 'male',
        ranges: [
            { min: 112, max: 123, tier: 'Chad', score: 40 },
            { min: 109.5, max: 125.5, tier: 'CL', score: 20 },
            { min: 106, max: 129, tier: 'HTN', score: 10 },
            { min: 102, max: 133, tier: 'MTN', score: 5 },
            { min: 97, max: 138, tier: 'LTN', score: 0 },
            { min: 92, max: 143, tier: 'Sub5', score: -10 },
            { min: 80, max: 160, tier: 'SUBHUMAN', score: -20 },
        ]
    },
    {
        measurementId: 'gonial_angle',
        gender: 'female',
        ranges: [
            { min: 114, max: 125, tier: 'Chad', score: 40 },
            { min: 111, max: 128, tier: 'CL', score: 20 },
            { min: 108, max: 131, tier: 'HTN', score: 10 },
            { min: 104, max: 135, tier: 'MTN', score: 5 },
            { min: 99, max: 140, tier: 'LTN', score: 0 },
            { min: 94, max: 146, tier: 'Sub5', score: -10 },
            { min: 80, max: 160, tier: 'SUBHUMAN', score: -20 },
        ]
    },

    // Nasofrontal Angle
    {
        measurementId: 'nasofrontal_angle',
        gender: 'male',
        ranges: [
            { min: 106, max: 129, tier: 'Chad', score: 15 },
            { min: 101, max: 134, tier: 'CL', score: 7.5 },
            { min: 97, max: 138, tier: 'HTN', score: 3.75 },
            { min: 94, max: 141, tier: 'MTN', score: 1.88 },
            { min: 88, max: 147, tier: 'LTN', score: 0 },
            { min: 70, max: 170, tier: 'Sub5', score: -5 },
            { min: 60, max: 180, tier: 'SUBHUMAN', score: -10 },
        ]
    },
    {
        measurementId: 'nasofrontal_angle',
        gender: 'female',
        ranges: [
            { min: 122, max: 143, tier: 'Chad', score: 15 },
            { min: 117, max: 148, tier: 'CL', score: 7.5 },
            { min: 113, max: 152, tier: 'HTN', score: 3.75 },
            { min: 110, max: 155, tier: 'MTN', score: 1.88 },
            { min: 107, max: 158, tier: 'LTN', score: 0 },
            { min: 70, max: 170, tier: 'Sub5', score: -5 },
            { min: 60, max: 180, tier: 'SUBHUMAN', score: -10 },
        ]
    },

    // Mandibular Plane Angle
    {
        measurementId: 'mandibular_plane_angle',
        gender: 'male',
        ranges: [
            { min: 15, max: 22, tier: 'Chad', score: 12.5 },
            { min: 14, max: 27, tier: 'CL', score: 6.25 },
            { min: 12.5, max: 30, tier: 'HTN', score: 3.13 },
            { min: 10, max: 32.5, tier: 'MTN', score: 1.56 },
            { min: 8, max: 35, tier: 'LTN', score: -5 },
            { min: 0, max: 45, tier: 'Sub5', score: -10 },
        ]
    },
    {
        measurementId: 'mandibular_plane_angle',
        gender: 'female',
        ranges: [
            { min: 15, max: 23, tier: 'Chad', score: 12.5 },
            { min: 14, max: 27, tier: 'CL', score: 6.25 },
            { min: 12.5, max: 30, tier: 'HTN', score: 3.13 },
            { min: 10, max: 32.5, tier: 'MTN', score: 1.56 },
            { min: 8, max: 35, tier: 'LTN', score: -5 },
            { min: 0, max: 45, tier: 'Sub5', score: -10 },
        ]
    },

    // Ramus to Mandible Ratio
    {
        measurementId: 'ramus_mandible_ratio',
        gender: 'male',
        ranges: [
            { min: 0.59, max: 0.78, tier: 'Chad', score: 10 },
            { min: 0.54, max: 0.83, tier: 'CL', score: 5 },
            { min: 0.49, max: 0.88, tier: 'HTN', score: 2.5 },
            { min: 0.41, max: 0.96, tier: 'MTN', score: 1.25 },
            { min: 0.33, max: 1.04, tier: 'LTN', score: -5 },
            { min: 0.1, max: 1.5, tier: 'Sub5', score: -10 },
        ]
    },
    {
        measurementId: 'ramus_mandible_ratio',
        gender: 'female',
        ranges: [
            { min: 0.52, max: 0.70, tier: 'Chad', score: 10 },
            { min: 0.48, max: 0.75, tier: 'CL', score: 5 },
            { min: 0.42, max: 0.8, tier: 'HTN', score: 2.5 },
            { min: 0.34, max: 0.88, tier: 'MTN', score: 1.25 },
            { min: 0.26, max: 0.96, tier: 'LTN', score: -5 },
            { min: 0.1, max: 1.5, tier: 'Sub5', score: -10 },
        ]
    },

    // Facial Convexity (Glabella)
    {
        measurementId: 'facial_convexity',
        gender: 'male',
        ranges: [
            { min: 168, max: 176, tier: 'Chad', score: 10 },
            { min: 163, max: 179, tier: 'CL', score: 5 },
            { min: 161, max: 181, tier: 'HTN', score: 2.5 },
            { min: 160, max: 183, tier: 'MTN', score: 0 },
            { min: 155, max: 184, tier: 'LTN', score: -2.5 },
            { min: 140, max: 195, tier: 'Sub5', score: -5 },
        ]
    },
    {
        measurementId: 'facial_convexity',
        gender: 'female',
        ranges: [
            { min: 166, max: 175, tier: 'Chad', score: 10 },
            { min: 163, max: 178, tier: 'CL', score: 5 },
            { min: 161, max: 180, tier: 'HTN', score: 2.5 },
            { min: 159, max: 182, tier: 'MTN', score: 0 },
            { min: 155, max: 184, tier: 'LTN', score: -2.5 },
            { min: 140, max: 195, tier: 'Sub5', score: -5 },
        ]
    },

    // Submental Cervical Angle
    {
        measurementId: 'submental_cervical',
        gender: 'male',
        ranges: [
            { min: 90, max: 110, tier: 'Chad', score: 10 },
            { min: 81, max: 120, tier: 'CL', score: 5 },
            { min: 81, max: 130, tier: 'HTN', score: 2.5 },
            { min: 75, max: 140, tier: 'MTN', score: 0 },
            { min: 50, max: 160, tier: 'LTN', score: -5 },
        ]
    },
    {
        measurementId: 'submental_cervical',
        gender: 'female',
        ranges: [
            { min: 90, max: 110, tier: 'Chad', score: 10 },
            { min: 81, max: 120, tier: 'CL', score: 5 },
            { min: 81, max: 130, tier: 'HTN', score: 2.5 },
            { min: 75, max: 140, tier: 'MTN', score: 0 },
            { min: 50, max: 160, tier: 'LTN', score: -5 },
        ]
    },

    // Nasofacial Angle
    {
        measurementId: 'nasofacial_angle',
        gender: 'male',
        ranges: [
            { min: 30, max: 36, tier: 'Chad', score: 9 },
            { min: 36, max: 40, tier: 'CL', score: 4.5 },
            { min: 28, max: 42, tier: 'HTN', score: 2.25 },
            { min: 26.5, max: 43.5, tier: 'MTN', score: 1.13 },
            { min: 25.5, max: 44.5, tier: 'LTN', score: -2 },
            { min: 10, max: 60, tier: 'Sub5', score: -5 },
        ]
    },
    {
        measurementId: 'nasofacial_angle',
        gender: 'female',
        ranges: [
            { min: 30, max: 36, tier: 'Chad', score: 9 },
            { min: 36, max: 40, tier: 'CL', score: 4.5 },
            { min: 28, max: 42, tier: 'HTN', score: 2.25 },
            { min: 26.5, max: 43.5, tier: 'MTN', score: 1.13 },
            { min: 25.5, max: 44.5, tier: 'LTN', score: -2 },
            { min: 10, max: 60, tier: 'Sub5', score: -5 },
        ]
    },

    // Nasolabial Angle
    {
        measurementId: 'nasolabial_angle',
        gender: 'male',
        ranges: [
            { min: 94, max: 117, tier: 'Chad', score: 7.5 },
            { min: 90, max: 121, tier: 'CL', score: 3.75 },
            { min: 85, max: 126, tier: 'HTN', score: 1.88 },
            { min: 81, max: 131, tier: 'MTN', score: 0.94 },
            { min: 70, max: 140, tier: 'LTN', score: -3 },
            { min: 65, max: 150, tier: 'Sub5', score: -5 },
            { min: 30, max: 190, tier: 'SUBHUMAN', score: -7.5 },
        ]
    },
    {
        measurementId: 'nasolabial_angle',
        gender: 'female',
        ranges: [
            { min: 96, max: 118, tier: 'Chad', score: 7.5 },
            { min: 92, max: 122, tier: 'CL', score: 3.75 },
            { min: 87, max: 127, tier: 'HTN', score: 1.88 },
            { min: 83, max: 131, tier: 'MTN', score: 0.94 },
            { min: 79, max: 144, tier: 'LTN', score: -3 },
            { min: 74, max: 154, tier: 'Sub5', score: -5 },
            { min: 30, max: 190, tier: 'SUBHUMAN', score: -7.5 },
        ]
    },

    // Total Facial Convexity
    {
        measurementId: 'total_facial_convexity',
        gender: 'male',
        ranges: [
            { min: 137.5, max: 148.5, tier: 'Chad', score: 7.5 },
            { min: 135.5, max: 150.5, tier: 'CL', score: 3.75 },
            { min: 132.5, max: 153.5, tier: 'HTN', score: 1.88 },
            { min: 129.5, max: 156.5, tier: 'MTN', score: 0 },
            { min: 126.5, max: 159.5, tier: 'LTN', score: -3.75 },
            { min: 124.5, max: 161.5, tier: 'Sub5', score: -5 },
            { min: 100, max: 180, tier: 'SUBHUMAN', score: -7.5 },
        ]
    },
    {
        measurementId: 'total_facial_convexity',
        gender: 'female',
        ranges: [
            { min: 137.5, max: 148.5, tier: 'Chad', score: 7.5 },
            { min: 135.5, max: 150.5, tier: 'CL', score: 3.75 },
            { min: 132.5, max: 153.5, tier: 'HTN', score: 1.88 },
            { min: 129.5, max: 156.5, tier: 'MTN', score: 0 },
            { min: 126.5, max: 159.5, tier: 'LTN', score: -3.75 },
            { min: 124.5, max: 161.5, tier: 'Sub5', score: -5 },
            { min: 100, max: 180, tier: 'SUBHUMAN', score: -7.5 },
        ]
    },

    // Mentolabial Angle
    {
        measurementId: 'mentolabial_angle',
        gender: 'male',
        ranges: [
            { min: 108, max: 130, tier: 'Chad', score: 7.5 },
            { min: 94, max: 144, tier: 'CL', score: 3.75 },
            { min: 80, max: 158, tier: 'HTN', score: 1.88 },
            { min: 75, max: 165, tier: 'MTN', score: 0 },
            { min: 65, max: 175, tier: 'LTN', score: -3.75 },
            { min: 40, max: 200, tier: 'Sub5', score: -7.5 },
        ]
    },
    {
        measurementId: 'mentolabial_angle',
        gender: 'female',
        ranges: [
            { min: 93, max: 125, tier: 'Chad', score: 7.5 },
            { min: 79, max: 139, tier: 'CL', score: 3.75 },
            { min: 70, max: 153, tier: 'HTN', score: 1.88 },
            { min: 65, max: 160, tier: 'MTN', score: 0 },
            { min: 62, max: 175, tier: 'LTN', score: -3.75 },
            { min: 40, max: 200, tier: 'Sub5', score: -7.5 },
        ]
    },

    // Facial Convexity (Nasion)
    {
        measurementId: 'facial_convexity_nasion',
        gender: 'male',
        ranges: [
            { min: 163, max: 170, tier: 'Chad', score: 5 },
            { min: 160, max: 173, tier: 'CL', score: 2.5 },
            { min: 158, max: 175, tier: 'HTN', score: 1.25 },
            { min: 155, max: 178, tier: 'MTN', score: 0.63 },
            { min: 152, max: 181, tier: 'LTN', score: 0 },
            { min: 120, max: 195, tier: 'Sub5', score: -5 },
        ]
    },
    {
        measurementId: 'facial_convexity_nasion',
        gender: 'female',
        ranges: [
            { min: 161, max: 170, tier: 'Chad', score: 5 },
            { min: 158, max: 173, tier: 'CL', score: 2.5 },
            { min: 156, max: 175, tier: 'HTN', score: 1.25 },
            { min: 153, max: 178, tier: 'MTN', score: 0.63 },
            { min: 152, max: 181, tier: 'LTN', score: 0 },
            { min: 120, max: 195, tier: 'Sub5', score: -5 },
        ]
    },

    // Nasal Projection
    {
        measurementId: 'nasal_projection',
        gender: 'male',
        ranges: [
            { min: 0.55, max: 0.68, tier: 'Chad', score: 5 },
            { min: 0.5, max: 0.73, tier: 'CL', score: 2.5 },
            { min: 0.45, max: 0.78, tier: 'HTN', score: 1.25 },
            { min: 0.37, max: 0.86, tier: 'MTN', score: 0.63 },
            { min: 0.3, max: 0.95, tier: 'LTN', score: 0 },
            { min: 0.1, max: 1.4, tier: 'Sub5', score: -5 },
        ]
    },
    {
        measurementId: 'nasal_projection',
        gender: 'female',
        ranges: [
            { min: 0.52, max: 0.68, tier: 'Chad', score: 5 },
            { min: 0.47, max: 0.73, tier: 'CL', score: 2.5 },
            { min: 0.42, max: 0.78, tier: 'HTN', score: 1.25 },
            { min: 0.34, max: 0.86, tier: 'MTN', score: 0.63 },
            { min: 0.3, max: 0.95, tier: 'LTN', score: 0 },
            { min: 0.1, max: 1.4, tier: 'Sub5', score: -5 },
        ]
    },

    // Nasal W to H Ratio
    {
        measurementId: 'nasal_w_h_ratio',
        gender: 'male',
        ranges: [
            { min: 0.62, max: 0.88, tier: 'Chad', score: 5 },
            { min: 0.55, max: 0.95, tier: 'CL', score: 2.5 },
            { min: 0.49, max: 1.01, tier: 'HTN', score: 1.25 },
            { min: 0.45, max: 1.05, tier: 'MTN', score: 0.63 },
            { min: 0.4, max: 1.1, tier: 'LTN', score: 0 },
            { min: 0.1, max: 1.6, tier: 'Sub5', score: -5 },
        ]
    },
    {
        measurementId: 'nasal_w_h_ratio',
        gender: 'female',
        ranges: [
            { min: 0.68, max: 0.93, tier: 'Chad', score: 5 },
            { min: 0.61, max: 1.0, tier: 'CL', score: 2.5 },
            { min: 0.55, max: 1.06, tier: 'HTN', score: 1.25 },
            { min: 0.51, max: 1.1, tier: 'MTN', score: 0.63 },
            { min: 0.45, max: 1.13, tier: 'LTN', score: 0 },
            { min: 0.1, max: 1.6, tier: 'Sub5', score: -5 },
        ]
    },

    // Nasomental Angle
    {
        measurementId: 'nasomental_angle',
        gender: 'male',
        ranges: [
            { min: 125, max: 132, tier: 'Chad', score: 5 },
            { min: 120, max: 133.5, tier: 'CL', score: 2.5 },
            { min: 118, max: 134.5, tier: 'HTN', score: 1.25 },
            { min: 116, max: 136.5, tier: 'MTN', score: 0.63 },
            { min: 114, max: 138.5, tier: 'LTN', score: 0 },
            { min: 100, max: 150, tier: 'Sub5', score: -5 },
        ]
    },
    {
        measurementId: 'nasomental_angle',
        gender: 'female',
        ranges: [
            { min: 125, max: 132, tier: 'Chad', score: 5 },
            { min: 120, max: 133.5, tier: 'CL', score: 2.5 },
            { min: 118, max: 134.5, tier: 'HTN', score: 1.25 },
            { min: 116, max: 136.5, tier: 'MTN', score: 0.63 },
            { min: 114, max: 138.5, tier: 'LTN', score: 0 },
            { min: 100, max: 150, tier: 'Sub5', score: -5 },
        ]
    },

    // Browridge Inclination Angle
    {
        measurementId: 'browridge_inclination_angle',
        gender: 'male',
        ranges: [
            { min: 13, max: 24, tier: 'Chad', score: 4 },
            { min: 10, max: 27, tier: 'CL', score: 2 },
            { min: 8, max: 29, tier: 'HTN', score: 1 },
            { min: 6, max: 31, tier: 'MTN', score: 0.5 },
            { min: 4, max: 33, tier: 'LTN', score: -2 },
            { min: 2, max: 36, tier: 'Sub5', score: -6 },
            { min: 0, max: 45, tier: 'SUBHUMAN', score: -10 },
        ]
    },
    {
        measurementId: 'browridge_inclination_angle',
        gender: 'female',
        ranges: [
            { min: 10, max: 22, tier: 'Chad', score: 4 },
            { min: 7, max: 25, tier: 'CL', score: 2 },
            { min: 5, max: 27, tier: 'HTN', score: 1 },
            { min: 3, max: 29, tier: 'MTN', score: 0.5 },
            { min: 1, max: 31, tier: 'LTN', score: -2 },
            { min: 1, max: 39, tier: 'Sub5', score: -6 },
            { min: 0, max: 45, tier: 'SUBHUMAN', score: -10 },
        ]
    },

    // Nasal Tip Angle
    {
        measurementId: 'nasal_tip_angle',
        gender: 'male',
        ranges: [
            { min: 112, max: 125, tier: 'Chad', score: 4 },
            { min: 108, max: 129, tier: 'CL', score: 2 },
            { min: 104, max: 133, tier: 'HTN', score: 1 },
            { min: 100, max: 137, tier: 'MTN', score: 0.5 },
            { min: 97, max: 140, tier: 'LTN', score: 0 },
            { min: 70, max: 170, tier: 'Sub5', score: -2 },
        ]
    },
    {
        measurementId: 'nasal_tip_angle',
        gender: 'female',
        ranges: [
            { min: 118, max: 131, tier: 'Chad', score: 4 },
            { min: 115, max: 134, tier: 'CL', score: 2 },
            { min: 111, max: 138, tier: 'HTN', score: 1 },
            { min: 108, max: 141, tier: 'MTN', score: 0.5 },
            { min: 105, max: 144, tier: 'LTN', score: 0 },
            { min: 70, max: 170, tier: 'Sub5', score: -2 },
        ]
    },

    // Eye Separation Ratio (ESR) , we need to reasrch this lol ( will fix it later )
    {
        measurementId: 'esr',
        gender: 'male',
        ranges: [
            { min: 0.95, max: 1, tier: 'Chad', score: 35 },
            { min: 0.9, max: 1.1, tier: 'CL', score: 17.5 },
            { min: 0.85, max: 1.15, tier: 'HTN', score: 8.75 },
            { min: 0.8, max: 1.2, tier: 'MTN', score: 4.38 },
            { min: 0.75, max: 1.25, tier: 'LTN', score: 0 },
            { min: 0.7, max: 1.3, tier: 'Sub5', score: -4.38 },
            { min: 0.65, max: 1.35, tier: 'SUBHUMAN', score: -17.5 },
        ]
    },
    {
        measurementId: 'esr',
        gender: 'female',
        ranges: [
            { min: 0.95, max: 1, tier: 'Chad', score: 30 },
            { min: 0.9, max: 1.1, tier: 'CL', score: 15 },
            { min: 0.85, max: 1.15, tier: 'HTN', score: 7.5 },
            { min: 0.8, max: 1.2, tier: 'MTN', score: 3.75 },
            { min: 0.75, max: 1.25, tier: 'LTN', score: 0 },
            { min: 0.7, max: 1.3, tier: 'Sub5', score: -3.75 },
            { min: 0.65, max: 1.35, tier: 'SUBHUMAN', score: -15 },
        ]
    },

    // FRONT PROFILE

    // Facial Thirds (Focus on Lower Third Percentage)
    {
        measurementId: 'facial_thirds',
        gender: 'male',
        ranges: [
            { min: 34, max: 38, tier: 'Chad', score: 35 },
            { min: 28, max: 38, tier: 'CL', score: 17.5 },
            { min: 26.5, max: 39.5, tier: 'HTN', score: 8.75 },
            { min: 25, max: 41, tier: 'MTN', score: 4.38 },
            { min: 23.5, max: 42.5, tier: 'LTN', score: 0 },
            { min: 22.5, max: 43.5, tier: 'Sub5', score: -4.38 },
            { min: 18, max: 50, tier: 'SUBHUMAN', score: -17.5 },
        ]
    },
    {
        measurementId: 'facial_thirds',
        gender: 'female',
        ranges: [
            { min: 30, max: 36, tier: 'Chad', score: 30 },
            { min: 29.5, max: 37.5, tier: 'CL', score: 15 },
            { min: 27, max: 39, tier: 'HTN', score: 7.5 },
            { min: 25, max: 41, tier: 'MTN', score: 3.75 },
            { min: 24, max: 42, tier: 'LTN', score: 0 },
            { min: 23, max: 43, tier: 'Sub5', score: -3.75 },
            { min: 18, max: 50, tier: 'SUBHUMAN', score: -15 },
        ]
    },

    // Lateral Canthal Tilt (Canthal Tilt)
    {
        measurementId: 'canthal_tilt',
        gender: 'male',
        ranges: [
            { min: 5.3, max: 8.5, tier: 'Chad', score: 25 },
            { min: 4, max: 9.7, tier: 'CL', score: 12.5 },
            { min: 3, max: 10.7, tier: 'HTN', score: 6.25 },
            { min: 0, max: 13.7, tier: 'MTN', score: 3.125 },
            { min: -2, max: 15.7, tier: 'LTN', score: 0 },
            { min: -4, max: 17.9, tier: 'Sub5', score: -5 },
            { min: -10, max: 25, tier: 'SUBHUMAN', score: -12.5 },
        ]
    },
    {
        measurementId: 'canthal_tilt',
        gender: 'female',
        ranges: [
            { min: 6, max: 9.6, tier: 'Chad', score: 25 },
            { min: 4.8, max: 10.8, tier: 'CL', score: 12.5 },
            { min: 3.6, max: 12, tier: 'HTN', score: 6.25 },
            { min: 1.5, max: 14.1, tier: 'MTN', score: 3.125 },
            { min: 0, max: 15.6, tier: 'LTN', score: 0 },
            { min: -3, max: 18.2, tier: 'Sub5', score: -5 },
            { min: -10, max: 25, tier: 'SUBHUMAN', score: -12.5 },
        ]
    },

    // Facial Width to Height Ratio (FWHR)
    {
        measurementId: 'fwhr',
        gender: 'male',
        ranges: [
            { min: 1.9, max: 2.05, tier: 'Chad', score: 25 },
            { min: 1.85, max: 2.11, tier: 'CL', score: 12.5 },
            { min: 1.8, max: 2.16, tier: 'HTN', score: 6.25 },
            { min: 1.75, max: 2.21, tier: 'MTN', score: 3.13 },
            { min: 1.7, max: 2.26, tier: 'LTN', score: 0 },
            { min: 1.66, max: 2.3, tier: 'Sub5', score: -3.13 },
            { min: 1.3, max: 2.8, tier: 'SUBHUMAN', score: -6.25 },
        ]
    },
    {
        measurementId: 'fwhr',
        gender: 'female',
        ranges: [
            { min: 1.9, max: 2.05, tier: 'Chad', score: 25 },
            { min: 1.85, max: 2.11, tier: 'CL', score: 12.5 },
            { min: 1.8, max: 2.16, tier: 'HTN', score: 6.25 },
            { min: 1.75, max: 2.21, tier: 'MTN', score: 3.13 },
            { min: 1.7, max: 2.26, tier: 'LTN', score: 0 },
            { min: 1.66, max: 2.3, tier: 'Sub5', score: -3.13 },
            { min: 1.3, max: 2.8, tier: 'SUBHUMAN', score: -6.25 },
        ]
    },

    // Jaw Frontal Angle (FJA)
    {
        measurementId: 'fja',
        gender: 'male',
        ranges: [
            { min: 84.5, max: 95, tier: 'Chad', score: 25 },
            { min: 80.5, max: 99, tier: 'CL', score: 12.5 },
            { min: 76.5, max: 103, tier: 'HTN', score: 6.25 },
            { min: 72.5, max: 107, tier: 'MTN', score: 3.13 },
            { min: 69.5, max: 110, tier: 'LTN', score: 0 },
            { min: 66.5, max: 113, tier: 'Sub5', score: -6.25 },
            { min: 40, max: 150, tier: 'SUBHUMAN', score: -12.5 },
        ]
    },
    {
        measurementId: 'fja',
        gender: 'female',
        ranges: [
            { min: 86, max: 97, tier: 'Chad', score: 25 },
            { min: 82.5, max: 100.5, tier: 'CL', score: 12.5 },
            { min: 79, max: 104, tier: 'HTN', score: 6.25 },
            { min: 75.5, max: 107.5, tier: 'MTN', score: 3.13 },
            { min: 72, max: 111, tier: 'LTN', score: 0 },
            { min: 69, max: 114, tier: 'Sub5', score: -6.25 },
            { min: 40, max: 150, tier: 'SUBHUMAN', score: -12.5 },
        ]
    },

    // Cheekbone Height
    {
        measurementId: 'cheekbone_height',
        gender: 'male',
        ranges: [
            { min: 81, max: 100, tier: 'Chad', score: 20 },
            { min: 76, max: 81, tier: 'CL', score: 12.5 }, // Note overlap handling: prefer higher tier if matching
            { min: 70, max: 76, tier: 'HTN', score: 6.25 },
            { min: 65, max: 70, tier: 'MTN', score: 3.13 },
            { min: 60, max: 65, tier: 'LTN', score: 0 },
            { min: 55, max: 60, tier: 'Sub5', score: -6.25 },
            { min: 10, max: 55, tier: 'SUBHUMAN', score: -12.5 },
        ]
    },
    {
        measurementId: 'cheekbone_height',
        gender: 'female',
        ranges: [
            { min: 83, max: 100, tier: 'Chad', score: 20 },
            { min: 79, max: 83, tier: 'CL', score: 12.5 },
            { min: 73, max: 79, tier: 'HTN', score: 6.25 },
            { min: 68, max: 73, tier: 'MTN', score: 3.13 },
            { min: 63, max: 68, tier: 'LTN', score: 0 },
            { min: 58, max: 63, tier: 'Sub5', score: -6.25 },
            { min: 10, max: 58, tier: 'SUBHUMAN', score: -12.5 },
        ]
    },

    // Total Facial Height to Width Ratio
    {
        measurementId: 'width_height_ratio',
        gender: 'male',
        ranges: [
            { min: 1.33, max: 1.38, tier: 'Chad', score: 15 },
            { min: 1.3, max: 1.41, tier: 'CL', score: 7.5 },
            { min: 1.26, max: 1.45, tier: 'HTN', score: 3.75 },
            { min: 1.23, max: 1.48, tier: 'MTN', score: 0 },
            { min: 1.2, max: 1.51, tier: 'LTN', score: -3.75 },
            { min: 1.18, max: 1.53, tier: 'Sub5', score: -7.5 },
            { min: 1.0, max: 1.7, tier: 'SUBHUMAN', score: -15 },
        ]
    },
    {
        measurementId: 'width_height_ratio',
        gender: 'female',
        ranges: [
            { min: 1.29, max: 1.35, tier: 'Chad', score: 15 },
            { min: 1.26, max: 1.38, tier: 'CL', score: 7.5 },
            { min: 1.22, max: 1.42, tier: 'HTN', score: 3.75 },
            { min: 1.19, max: 1.45, tier: 'MTN', score: 0 },
            { min: 1.17, max: 1.47, tier: 'LTN', score: -3.75 },
            { min: 1.15, max: 1.49, tier: 'Sub5', score: -7.5 },
            { min: 1.0, max: 1.7, tier: 'SUBHUMAN', score: -15 },
        ]
    },

    // Bigonial Width
    {
        measurementId: 'bigonial_width',
        gender: 'male',
        ranges: [
            { min: 85.5, max: 92, tier: 'Chad', score: 15 },
            { min: 83.5, max: 94, tier: 'CL', score: 7.5 },
            { min: 80.5, max: 97, tier: 'HTN', score: 3.75 },
            { min: 77.5, max: 100, tier: 'MTN', score: 1.88 },
            { min: 75, max: 102.5, tier: 'LTN', score: 0 },
            { min: 70, max: 105, tier: 'Sub5', score: -3.75 },
            { min: 50, max: 120, tier: 'SUBHUMAN', score: -10 },
        ]
    },
    {
        measurementId: 'bigonial_width',
        gender: 'female',
        ranges: [
            { min: 81.5, max: 88.5, tier: 'Chad', score: 15 },
            { min: 79.5, max: 90.5, tier: 'CL', score: 7.5 },
            { min: 76.5, max: 93.5, tier: 'HTN', score: 3.75 },
            { min: 73.5, max: 96.5, tier: 'MTN', score: 1.88 },
            { min: 70.5, max: 99.5, tier: 'LTN', score: 0 },
            { min: 69, max: 102, tier: 'Sub5', score: -3.75 },
            { min: 50, max: 120, tier: 'SUBHUMAN', score: -10 },
        ]
    },

    // Chin to Philtrum Ratio // NOTE: 'chin_philtrum_ratio'
    {
        measurementId: 'chin_philtrum_ratio',
        gender: 'male',
        ranges: [
            { min: 2.05, max: 2.55, tier: 'Chad', score: 12.5 },
            { min: 1.87, max: 2.73, tier: 'CL', score: 6.25 },
            { min: 1.75, max: 2.85, tier: 'HTN', score: 3.13 },
            { min: 1.55, max: 3.2, tier: 'MTN', score: 1.56 },
            { min: 1.2, max: 3.55, tier: 'LTN', score: 0 },
            { min: 1.0, max: 3.85, tier: 'Sub5', score: -3.13 },
            { min: 0.1, max: 5.0, tier: 'SUBHUMAN', score: -6.25 },
        ]
    },
    {
        measurementId: 'chin_philtrum_ratio',
        gender: 'female',
        ranges: [
            { min: 2.0, max: 2.5, tier: 'Chad', score: 12.5 },
            { min: 1.85, max: 2.65, tier: 'CL', score: 6.25 },
            { min: 1.7, max: 2.8, tier: 'HTN', score: 3.13 },
            { min: 1.5, max: 3.15, tier: 'MTN', score: 1.56 },
            { min: 1.2, max: 3.5, tier: 'LTN', score: 0 },
            { min: 1.0, max: 3.8, tier: 'Sub5', score: -3.13 },
            { min: 0.1, max: 5.0, tier: 'SUBHUMAN', score: -6.25 },
        ]
    },

    // Lower Jaw to Neck Ratio (Jaw / Neck)
    {
        measurementId: 'lower_jaw_to_neck_ratio',
        gender: 'male',
        ranges: [
            { min: 0.95, max: 1.05, tier: 'Chad', score: 10 },
            { min: 0.90, max: 1.10, tier: 'CL', score: 5 },
            { min: 0.85, max: 1.15, tier: 'HTN', score: 1 },
            { min: 0.80, max: 1.20, tier: 'MTN', score: 0 },
            { min: 1.21, max: 1.30, tier: 'LTN', score: -2.5 }, // Neck too thin
            { min: 0.70, max: 0.79, tier: 'Sub5', score: -5 },  // Neck too thick (rare)
            { min: 0, max: 3.0, tier: 'SUBHUMAN', score: -7.5 },
        ]
    },
    {
        measurementId: 'lower_jaw_to_neck_ratio',
        gender: 'female',
        ranges: [
            { min: 1.15, max: 1.33, tier: 'Chad', score: 10 },    // ~0.87 - 0.75 inverted
            { min: 1.08, max: 1.45, tier: 'CL', score: 5 },       // ~0.93 - 0.69 inverted
            { min: 1.05, max: 1.50, tier: 'HTN', score: 1 },
            { min: 1.03, max: 1.55, tier: 'MTN', score: 0 },
            { min: 1.0, max: 1.60, tier: 'LTN', score: -2.5 },
            { min: 0.9, max: 1.75, tier: 'Sub5', score: -5 },
            { min: 0, max: 3.0, tier: 'SUBHUMAN', score: -7.5 },
        ]
    },

    // Mouth Width to Nose Width Ratio
    {
        measurementId: 'mouth_nose_width_ratio',
        gender: 'male',
        ranges: [
            { min: 1.38, max: 1.53, tier: 'Chad', score: 10 },
            { min: 1.34, max: 1.57, tier: 'CL', score: 5 },
            { min: 1.3, max: 1.61, tier: 'HTN', score: 2.5 },
            { min: 1.26, max: 1.65, tier: 'MTN', score: 1.25 },
            { min: 1.22, max: 1.69, tier: 'LTN', score: 0 },
            { min: 1.18, max: 1.73, tier: 'Sub5', score: -2.5 },
            { min: 0.9, max: 2.2, tier: 'SUBHUMAN', score: -5 },
        ]
    },
    {
        measurementId: 'mouth_nose_width_ratio',
        gender: 'female',
        ranges: [
            { min: 1.45, max: 1.67, tier: 'Chad', score: 10 },
            { min: 1.4, max: 1.72, tier: 'CL', score: 5 },
            { min: 1.35, max: 1.77, tier: 'HTN', score: 2.5 },
            { min: 1.3, max: 1.82, tier: 'MTN', score: 1.25 },
            { min: 1.25, max: 1.87, tier: 'LTN', score: 0 },
            { min: 1.21, max: 1.91, tier: 'Sub5', score: -2.5 },
            { min: 0.9, max: 2.2, tier: 'SUBHUMAN', score: -5 },
        ]
    },

    // Midface Ratio
    {
        measurementId: 'midface_ratio',
        gender: 'male',
        ranges: [
            { min: 0.95, max: 1.01, tier: 'Chad', score: 10 },
            { min: 0.9, max: 1.04, tier: 'CL', score: 5 },
            { min: 0.88, max: 1.06, tier: 'HTN', score: 2.5 },
            { min: 0.85, max: 1.09, tier: 'MTN', score: 1.25 },
            { min: 0.8, max: 1.14, tier: 'LTN', score: 0 },
            { min: 0.77, max: 1.17, tier: 'Sub5', score: -5 },
            { min: 0.5, max: 1.5, tier: 'SUBHUMAN', score: -10 },
        ]
    },
    {
        measurementId: 'midface_ratio',
        gender: 'female',
        ranges: [
            { min: 1.0, max: 1.1, tier: 'Chad', score: 10 },
            { min: 0.97, max: 1.13, tier: 'CL', score: 5 },
            { min: 0.95, max: 1.15, tier: 'HTN', score: 2.5 },
            { min: 0.92, max: 1.18, tier: 'MTN', score: 1.25 },
            { min: 0.87, max: 1.23, tier: 'LTN', score: 0 },
            { min: 0.84, max: 1.26, tier: 'Sub5', score: -5 },
            { min: 0.5, max: 1.5, tier: 'SUBHUMAN', score: -10 },
        ]
    },

    // Eyebrow Position Ratio
    {
        measurementId: 'eyebrow_position_ratio',
        gender: 'male',
        ranges: [
            { min: 0.9, max: 1.0, tier: 'Chad', score: 10 },
            { min: 0.85, max: 0.9, tier: 'CL', score: 5 },
            { min: 0.8, max: 0.85, tier: 'HTN', score: 2.5 },
            { min: 0.75, max: 0.8, tier: 'MTN', score: 1 },
            { min: 0.7, max: 0.75, tier: 'LTN', score: 0 },
            { min: 0.65, max: 0.7, tier: 'Sub5', score: -2.5 },
            { min: 0.6, max: 0.65, tier: 'SUBHUMAN', score: -5 },
        ]
    },
    {
        measurementId: 'eyebrow_position_ratio',
        gender: 'female',
        ranges: [
            { min: 0.4, max: 0.85, tier: 'Chad', score: 10 },
            { min: 0.3, max: 1.0, tier: 'CL', score: 5 },
            { min: 0, max: 1.35, tier: 'HTN', score: 2.5 },
            { min: 1.15, max: 1.75, tier: 'MTN', score: 1 },
            { min: 1.35, max: 2.0, tier: 'LTN', score: 0 },
            { min: 1.85, max: 2.3, tier: 'Sub5', score: -2.5 },
            { min: 2.1, max: 4.0, tier: 'SUBHUMAN', score: -5 },
        ]
    },

    // Eye Spacing Ratio (Use 'eye_spacing_ratio' for the new ratio metric ~1.0)
    {
        measurementId: 'eye_spacing_ratio',
        gender: 'male',
        ranges: [
            { min: 0.93, max: 1.04, tier: 'Chad', score: 10 },
            { min: 0.88, max: 1.07, tier: 'CL', score: 5 },
            { min: 0.83, max: 1.1, tier: 'HTN', score: 2.5 },
            { min: 0.78, max: 1.17, tier: 'MTN', score: 1 },
            { min: 0.67, max: 1.23, tier: 'LTN', score: 0 },
            { min: 0.62, max: 1.43, tier: 'Sub5', score: -5 },
            { min: 0.42, max: 2.03, tier: 'SUBHUMAN', score: -10 },
        ]
    },
    {
        measurementId: 'eye_spacing_ratio',
        gender: 'female',
        ranges: [
            { min: 0.93, max: 1.04, tier: 'Chad', score: 10 },
            { min: 0.88, max: 1.07, tier: 'CL', score: 5 },
            { min: 0.83, max: 1.1, tier: 'HTN', score: 2.5 },
            { min: 0.78, max: 1.17, tier: 'MTN', score: 1 },
            { min: 0.67, max: 1.23, tier: 'LTN', score: 0 },
            { min: 0.62, max: 1.43, tier: 'Sub5', score: -5 },
            { min: 0.42, max: 2.03, tier: 'SUBHUMAN', score: -10 },
        ]
    },

    // Eye Aspect Ratio
    {
        measurementId: 'eye_aspect_ratio',
        gender: 'male',
        ranges: [
            { min: 2.8, max: 3.6, tier: 'Chad', score: 10 },
            { min: 2.6, max: 3.8, tier: 'CL', score: 5 },
            { min: 2.4, max: 4.0, tier: 'HTN', score: 2.5 },
            { min: 2.2, max: 4.2, tier: 'MTN', score: 1.25 },
            { min: 2.0, max: 4.4, tier: 'LTN', score: 0 },
            { min: 1.8, max: 4.6, tier: 'Sub5', score: -2.5 },
            { min: 0, max: 6.0, tier: 'SUBHUMAN', score: -5 },
        ]
    },
    {
        measurementId: 'eye_aspect_ratio',
        gender: 'female',
        ranges: [
            { min: 2.55, max: 3.2, tier: 'Chad', score: 10 },
            { min: 2.35, max: 3.4, tier: 'CL', score: 5 },
            { min: 2.15, max: 3.6, tier: 'HTN', score: 2.5 },
            { min: 1.95, max: 3.8, tier: 'MTN', score: 1.25 },
            { min: 1.75, max: 4.0, tier: 'LTN', score: 0 },
            { min: 1.8, max: 4.6, tier: 'Sub5', score: -2.5 },
            { min: 0, max: 6.0, tier: 'SUBHUMAN', score: -5 },
        ]
    },

    // Lower to Upper Lip Ratio
    {
        measurementId: 'lower_lip_to_upper_lip_ratio',
        gender: 'male',
        ranges: [
            { min: 1.5, max: 2.0, tier: 'Chad', score: 7.5 },
            { min: 1.1, max: 2.3, tier: 'CL', score: 3.75 },
            { min: 0.9, max: 2.5, tier: 'HTN', score: 1.88 },
            { min: 0.7, max: 2.7, tier: 'MTN', score: 0.94 },
            { min: 0.4, max: 3.0, tier: 'LTN', score: 0 },
            { min: 0.1, max: 3.5, tier: 'Sub5', score: -3.75 },
            { min: 0.1, max: 5.0, tier: 'SUBHUMAN', score: -7.5 },
        ]
    },
    {
        measurementId: 'lower_lip_to_upper_lip_ratio',
        gender: 'female',
        ranges: [
            { min: 1.35, max: 2.0, tier: 'Chad', score: 7.5 },
            { min: 1.05, max: 2.3, tier: 'CL', score: 3.75 },
            { min: 0.85, max: 2.5, tier: 'HTN', score: 1.88 },
            { min: 0.75, max: 2.7, tier: 'MTN', score: 0.94 },
            { min: 0.35, max: 3.0, tier: 'LTN', score: 0 },
            { min: 0.1, max: 3.5, tier: 'Sub5', score: -3.75 },
            { min: 0.1, max: 5.0, tier: 'SUBHUMAN', score: -7.5 },
        ]
    },

    // Deviation of IAA & JFA
    {
        measurementId: 'deviation_iaa_jfa',
        gender: 'male',
        ranges: [
            { min: 0, max: 2.5, tier: 'Chad', score: 7 },
            { min: 2.5, max: 5, tier: 'CL', score: 3.75 },
            { min: 5, max: 10, tier: 'HTN', score: 1.88 },
            { min: 10, max: 15, tier: 'MTN', score: 0.94 },
            { min: 15, max: 20, tier: 'LTN', score: 0 },
            { min: 20, max: 100, tier: 'Sub5', score: -3.75 },
        ]
    },
    {
        measurementId: 'deviation_iaa_jfa',
        gender: 'female',
        ranges: [
            { min: 0, max: 2.5, tier: 'Chad', score: 7 },
            { min: 2.5, max: 5, tier: 'CL', score: 3.75 },
            { min: 5, max: 10, tier: 'HTN', score: 1.88 },
            { min: 10, max: 15, tier: 'MTN', score: 0.94 },
            { min: 15, max: 20, tier: 'LTN', score: 0 },
            { min: 20, max: 100, tier: 'Sub5', score: -3.75 },
        ]
    },

    // Eyebrow Tilt
    {
        measurementId: 'eyebrow_tilt',
        gender: 'male',
        ranges: [
            { min: 5, max: 13, tier: 'Chad', score: 6 },
            { min: 3, max: 15, tier: 'CL', score: 3 },
            { min: 0, max: 18, tier: 'HTN', score: 1.5 },
            { min: -2, max: 20, tier: 'MTN', score: 0 },
            { min: -4, max: 22, tier: 'LTN', score: -3 },
            { min: -15, max: 40, tier: 'Sub5', score: -6 },
        ]
    },
    {
        measurementId: 'eyebrow_tilt',
        gender: 'female',
        ranges: [
            { min: 11, max: 18.7, tier: 'Chad', score: 6 },
            { min: 9, max: 20.7, tier: 'CL', score: 3 },
            { min: 6, max: 23.7, tier: 'HTN', score: 1.5 },
            { min: 4, max: 25.7, tier: 'MTN', score: 0 },
            { min: 2, max: 27.7, tier: 'LTN', score: -3 },
            { min: -15, max: 40, tier: 'Sub5', score: -6 },
        ]
    },

    // Bitemporal Width : currently broken :: ideal 95% by faceiq 
    {
        measurementId: 'bitemporal_width',
        gender: 'male',
        ranges: [
            { min: 84, max: 95, tier: 'Chad', score: 5 },
            { min: 82, max: 97, tier: 'CL', score: 2.5 },
            { min: 79, max: 100, tier: 'HTN', score: 1.25 },
            { min: 77, max: 102, tier: 'MTN', score: 0 },
            { min: 74, max: 105, tier: 'LTN', score: -1.25 },
            { min: 71, max: 108, tier: 'Sub5', score: -2.5 },
            { min: 50, max: 125, tier: 'SUBHUMAN', score: -5 },
        ]
    },
    {
        measurementId: 'bitemporal_width',
        gender: 'female',
        ranges: [
            { min: 79, max: 92, tier: 'Chad', score: 5 },
            { min: 76, max: 95, tier: 'CL', score: 2.5 },
            { min: 73, max: 98, tier: 'HTN', score: 1.25 },
            { min: 70, max: 101, tier: 'MTN', score: 0 },
            { min: 67, max: 104, tier: 'LTN', score: -1.25 },
            { min: 65, max: 106, tier: 'Sub5', score: -2.5 },
            { min: 50, max: 125, tier: 'SUBHUMAN', score: -5 },
        ]
    },

    // Lower Third Proportion
    {
        measurementId: 'lower_third_proportion',
        gender: 'male',
        ranges: [
            { min: 30.6, max: 34, tier: 'Chad', score: 5 },
            { min: 29.6, max: 35, tier: 'CL', score: 2.5 },
            { min: 28.4, max: 36.2, tier: 'HTN', score: 1.25 },
            { min: 27.2, max: 37.4, tier: 'MTN', score: 0 },
            { min: 26.6, max: 38, tier: 'LTN', score: -1.25 },
            { min: 20, max: 45, tier: 'Sub5', score: -2.5 },
        ]
    },
    {
        measurementId: 'lower_third_proportion',
        gender: 'female',
        ranges: [
            { min: 31.2, max: 34.5, tier: 'Chad', score: 5 },
            { min: 30.2, max: 35.5, tier: 'CL', score: 2.5 },
            { min: 29.2, max: 36.5, tier: 'HTN', score: 1.25 },
            { min: 28.2, max: 37.5, tier: 'MTN', score: 0 },
            { min: 27.2, max: 38.5, tier: 'LTN', score: -1.25 },
            { min: 20, max: 45, tier: 'Sub5', score: -2.5 },
        ]
    },

    // Ipsilateral Alar Angle
    {
        measurementId: 'ipsilateral_alar_angle',
        gender: 'male',
        ranges: [
            { min: 84, max: 95, tier: 'Chad', score: 2.5 },
            { min: 82, max: 97, tier: 'CL', score: 1.25 },
            { min: 79, max: 100, tier: 'HTN', score: 0.63 },
            { min: 77, max: 102, tier: 'MTN', score: 0 },
            { min: 75, max: 104, tier: 'LTN', score: -0.63 },
            { min: 73, max: 106, tier: 'Sub5', score: -1.25 },
            { min: 50, max: 150, tier: 'SUBHUMAN', score: -2.5 },
        ]
    },
    {
        measurementId: 'ipsilateral_alar_angle',
        gender: 'female',
        ranges: [
            { min: 84, max: 95.5, tier: 'Chad', score: 2.5 },
            { min: 82, max: 97.5, tier: 'CL', score: 1.25 },
            { min: 79, max: 100.5, tier: 'HTN', score: 0.63 },
            { min: 77, max: 102.5, tier: 'MTN', score: 0 },
            { min: 75, max: 104.5, tier: 'LTN', score: -0.63 },
            { min: 73, max: 106.5, tier: 'Sub5', score: -1.25 },
            { min: 50, max: 150, tier: 'SUBHUMAN', score: -2.5 },
        ]
    },

    // Medial Canthal Angle
    {
        measurementId: 'medial_canthal_angle',
        gender: 'male',
        ranges: [
            { min: 20, max: 42, tier: 'Chad', score: 10 },
            { min: 17, max: 50, tier: 'CL', score: 5 },
            { min: 15, max: 56, tier: 'HTN', score: 2.5 },
            { min: 13, max: 63, tier: 'MTN', score: 0 },
            { min: 11, max: 69, tier: 'LTN', score: -2.5 },
            { min: 9, max: 75, tier: 'Sub5', score: -5 },
            { min: 5, max: 120, tier: 'SUBHUMAN', score: -10 },
        ]
    },
    {
        measurementId: 'medial_canthal_angle',
        gender: 'female',
        ranges: [
            { min: 22, max: 44, tier: 'Chad', score: 10 },
            { min: 20, max: 52, tier: 'CL', score: 5 },
            { min: 17, max: 58, tier: 'HTN', score: 2.5 },
            { min: 15, max: 65, tier: 'MTN', score: 0 },
            { min: 13, max: 71, tier: 'LTN', score: -2.5 },
            { min: 11, max: 77, tier: 'Sub5', score: -5 },
            { min: 5, max: 120, tier: 'SUBHUMAN', score: -10 },
        ]
    },
];

export const getRating = (measurementId: string, value: number, gender: 'male' | 'female'): { tier: Tier, score: number } => {
    const config = RATINGS.find(r => r.measurementId === measurementId && r.gender === gender);
    if (!config) return { tier: 'MTN', score: 0 }; // Default score updated to 0 (approx MTN)

    for (const range of config.ranges) {
        if (value >= range.min && value <= range.max) {
            return { tier: range.tier, score: range.score };
        }
    }

    // Fallback if out of all ranges
    return { tier: 'Sub5', score: -10 };
};
