import { Metric, Pillar, ScoreReport, Point } from '../types';
import { calculateAngle, calculateAngleBetweenLines, calculateDistance } from './geometry';
import { MEASUREMENTS } from '../constants/measurements';
import { getRating, RATINGS } from '../constants/rating';

export const calculateMetricScore = (metricId: string, value: number, gender: 'male' | 'female'): Metric => {
    // 1. Get Definition (Name, Category/Pillar)
    const def = MEASUREMENTS.find(m => m.id === metricId);

    // Default fallback
    const name = def?.name || metricId;
    const category: Pillar = (def?.pillar as Pillar) || 'Harmony';

    if (isNaN(value) || !isFinite(value)) {
        return {
            id: metricId,
            name,
            value: NaN,
            score: 0,
            tier: 'N/A',
            idealRange: [0, 0], // Placeholder
            category // 'Soft Tissue' | 'Harmony' etc
        };
    }

    // 2. Get Rating (Score, Tier)
    const rating = getRating(metricId, value, gender);

    // 3. Find Ideal Range for display (from "Chad" tier)
    // We assume the first "Chad" range is the main ideal one. 
    // If multiple Chad ranges exist (e.g. one for low, one for high), we take the one closest to current value?
    // For simplicity, just finding the first Chad/Ideal range.
    let idealMin = 0;
    let idealMax = 0;

    const config = RATINGS.find(r => r.measurementId === metricId && r.gender === gender);
    if (config) {
        const idealRange = config.ranges.find(r => r.tier === 'Chad' || r.score >= 95);
        if (idealRange) {
            idealMin = idealRange.min;
            idealMax = idealRange.max;
        }
    }

    return {
        id: metricId,
        name,
        value,
        score: rating.score,
        tier: rating.tier,
        idealRange: [idealMin, idealMax],
        category
    };
};

export const generateReport = (metrics: Metric[]): ScoreReport => {
    const pillars: Record<Pillar, { total: number; count: number }> = {
        Harmony: { total: 0, count: 0 },
        Dimorphism: { total: 0, count: 0 },
        Angularity: { total: 0, count: 0 },
        'Soft Tissue': { total: 0, count: 0 }
    };

    metrics.forEach(m => {
        // Only count valid scores > 0? Or counts 0s too? 
        // Typically if value is NaN, score is 0, we can exclude from average? 
        // Original logic: if (!isNaN(m.score)) - 0 is not NaN.
        // We probably want to skip "unmeasured" metrics (value=NaN).
        if (!isNaN(m.value)) {
            pillars[m.category].total += m.score;
            pillars[m.category].count += 1;
        }
    });

    const getAvg = (p: Pillar, defaultVal: number) => pillars[p].count > 0 ? pillars[p].total / pillars[p].count : defaultVal;

    // Averages (Defaults to 50 average, or 80 for Soft Tissue to avoid harsh penalties if missing)
    const harmonyScore = getAvg('Harmony', 50);
    const dimorphismScore = getAvg('Dimorphism', 50);
    const angularityScore = getAvg('Angularity', 50);
    const softTissueScore = getAvg('Soft Tissue', 80);

    // Geometric Weighted Formula (Approximate weighting)
    // (Harmony^0.3) * (Dimorphism^0.2) * (Angularity^0.2) * (Soft Tissue^0.3)
    const totalScore =
        Math.pow(harmonyScore, 0.3) *
        Math.pow(dimorphismScore, 0.2) *
        Math.pow(angularityScore, 0.2) *
        Math.pow(softTissueScore, 0.3);

    return {
        totalScore: Number((totalScore / 10).toFixed(1)), // Scale to 1-10
        subScores: {
            harmony: Math.round(harmonyScore),
            dimorphism: Math.round(dimorphismScore),
            angularity: Math.round(angularityScore),
            softTissue: Math.round(softTissueScore)
        },
        metrics
    };
};

// --- HELPER ---
const getPoint = (points: Point[], id: number): Point | undefined => {
    return points.find(p => p.id === id);
};

// --- COMPUTATION ---
export const calculateAllMetrics = (points: Point[], profileType: 'front' | 'side', gender: 'male' | 'female'): ScoreReport => {
    const metrics: Metric[] = [];

    if (profileType === 'side') {
        const pIntertragicNotch = getPoint(points, 8);
        const pGonionTop = getPoint(points, 30);
        const pGonionBottom = getPoint(points, 31);
        const pMenton = getPoint(points, 28);
        const pCervical = getPoint(points, 29);
        const pNeck = getPoint(points, 4);

        const pColumella = getPoint(points, 20);
        const pSubnasale = getPoint(points, 21);
        const pLabraleSup = getPoint(points, 23);

        const pGlabella = getPoint(points, 14);
        const pNasion = getPoint(points, 16);
        const pRhinion = getPoint(points, 17);
        const pPogonion = getPoint(points, 27);

        const pLabraleInf = getPoint(points, 25);
        const pSublabiale = getPoint(points, 26);


        // 1. Gonial Angle (Ramus vs Body)
        if (pIntertragicNotch && pGonionTop && pGonionBottom && pMenton) {
            const angleRaw = calculateAngleBetweenLines(
                pIntertragicNotch, pGonionTop, // Line 1: Ar -> Go (Down)
                pGonionBottom, pMenton         // Line 2: Go -> Me (Forward)
            );
            metrics.push(calculateMetricScore('gonial_angle', 180 - angleRaw, gender));
        } else metrics.push(calculateMetricScore('gonial_angle', NaN, gender));

        // 2. Ramus/Mandible Ratio
        if (pIntertragicNotch && pGonionTop && pGonionBottom && pMenton) {
            const ramusLen = calculateDistance(pIntertragicNotch, pGonionTop);
            const bodyLen = calculateDistance(pGonionBottom, pMenton);
            metrics.push(calculateMetricScore('ramus_mandible_ratio', ramusLen / bodyLen, gender)); // Correct ID
        } else metrics.push(calculateMetricScore('ramus_mandible_ratio', NaN, gender));

        // 3. Nasolabial Angle (Col-Sn-Ls) -- Not in new list yet? 
        // Check measurements.ts. IDs must match.
        // It's not in my measurements list! I should add it or map to closest.
        // Or keep logic but metric will have "NaN" id if missing.
        // I'll add 'nasolabial_angle' to measurements.ts if missing.
        if (pColumella && pSubnasale && pLabraleSup) {
            const angle = calculateAngle(pColumella, pSubnasale, pLabraleSup);
            metrics.push(calculateMetricScore('nasolabial_angle', angle, gender));
        } else metrics.push(calculateMetricScore('nasolabial_angle', NaN, gender));

        // 4. Nasofrontal Angle (G-N-Rh)
        if (pGlabella && pNasion && pRhinion) {
            const angle = calculateAngle(pGlabella, pNasion, pRhinion);
            metrics.push(calculateMetricScore('nasofrontal_angle', angle, gender));
        } else metrics.push(calculateMetricScore('nasofrontal_angle', NaN, gender));

        // 5. Facial Convexity (G-Sn-Pg)
        if (pGlabella && pSubnasale && pPogonion) {
            const angle = calculateAngle(pGlabella, pSubnasale, pPogonion);
            metrics.push(calculateMetricScore('facial_convexity', angle, gender));
        } else metrics.push(calculateMetricScore('facial_convexity', NaN, gender));

        // 6. Mentolabial Angle (Li-Sl-Pg)
        if (pLabraleInf && pSublabiale && pPogonion) {
            const angle = calculateAngle(pLabraleInf, pSublabiale, pPogonion);
            metrics.push(calculateMetricScore('mentolabial_angle', angle, gender));
        } else metrics.push(calculateMetricScore('mentolabial_angle', NaN, gender));

        // 7. Submental Cervical (Me-Cervical-Neck)
        if (pMenton && pCervical && pNeck) {
            const angle = calculateAngle(pMenton, pCervical, pNeck);
            metrics.push(calculateMetricScore('submental_cervical', angle, gender));
        } else metrics.push(calculateMetricScore('submental_cervical', NaN, gender));


    } else {
        // --- FRONT PROFILE ---
        const pLeftPupil = getPoint(points, 2);
        const pRightPupil = getPoint(points, 3);
        const pCheekLeft = getPoint(points, 51);
        const pCheekRight = getPoint(points, 52);

        const pBrowLeft = getPoint(points, 18); // Left Brow Inner
        const pBrowRight = getPoint(points, 29); // Right Brow Inner
        const pCupidsBow = getPoint(points, 40);

        const pCanthusLeftIn = getPoint(points, 12);
        const pCanthusLeftOut = getPoint(points, 13);
        const pCanthusRightIn = getPoint(points, 23);
        const pCanthusRightOut = getPoint(points, 24);

        const pChinBottom = getPoint(points, 7);
        const pLowerLip = getPoint(points, 6);
        const pNoseBottom = getPoint(points, 35);

        const pJawLeft = getPoint(points, 45); // Left Bottom Gonion
        const pJawRight = getPoint(points, 46); // Right Bottom Gonion
        const pChinLeft = getPoint(points, 47);
        const pChinRight = getPoint(points, 48);

        // 1. ESR (IPD / Bizygomatic)
        if (pLeftPupil && pRightPupil && pCheekLeft && pCheekRight) {
            const ipd = calculateDistance(pLeftPupil, pRightPupil);
            const bizygo = calculateDistance(pCheekLeft, pCheekRight);
            metrics.push(calculateMetricScore('esr', ipd / bizygo, gender));
        } else metrics.push(calculateMetricScore('esr', NaN, gender));

        // 2. fWHR (Bizygomatic / UpperFace)
        if (pCheekLeft && pCheekRight && pBrowLeft && pBrowRight && pCupidsBow) {
            const bizygo = calculateDistance(pCheekLeft, pCheekRight);
            const midBrowY = (pBrowLeft.y + pBrowRight.y) / 2;
            const height = Math.abs(pCupidsBow.y - midBrowY);
            metrics.push(calculateMetricScore('fwhr', bizygo / height, gender));
        } else metrics.push(calculateMetricScore('fwhr', NaN, gender));

        // 3. Midface Ratio (IPD / Midface Height)
        if (pLeftPupil && pRightPupil && pCupidsBow) {
            const ipd = calculateDistance(pLeftPupil, pRightPupil);
            const midPupilY = (pLeftPupil.y + pRightPupil.y) / 2;
            const midfaceHeight = Math.abs(pCupidsBow.y - midPupilY);
            metrics.push(calculateMetricScore('midface_ratio', midfaceHeight / ipd, gender));
        } else metrics.push(calculateMetricScore('midface_ratio', NaN, gender));

        // 4. Canthal Tilt
        if (pCanthusLeftIn && pCanthusLeftOut && pCanthusRightIn && pCanthusRightOut) {
            const getTilt = (pIn: Point, pOut: Point) => {
                const dy = pOut.y - pIn.y;
                const dx = pOut.x - pIn.x;
                return -Math.atan2(dy, dx) * (180 / Math.PI);
            }
            const tiltL = getTilt(pCanthusLeftIn, pCanthusLeftOut);
            const tiltR = getTilt(pCanthusRightIn, pCanthusRightOut);
            metrics.push(calculateMetricScore('canthal_tilt', (tiltL + tiltR) / 2, gender));
        } else metrics.push(calculateMetricScore('canthal_tilt', NaN, gender));

        // 5. Chin/Philtrum
        if (pChinBottom && pLowerLip && pNoseBottom && pCupidsBow) {
            const chinHeight = calculateDistance(pLowerLip, pChinBottom);
            const philtrumLen = calculateDistance(pNoseBottom, pCupidsBow);
            metrics.push(calculateMetricScore('chin_philtrum_ratio', chinHeight / philtrumLen, gender)); // Updated ID
        } else metrics.push(calculateMetricScore('chin_philtrum_ratio', NaN, gender));

        // 6. Jaw Frontal Angle
        if (pJawLeft && pChinLeft) {
            const dx = pChinLeft.x - pJawLeft.x;
            const dy = pChinLeft.y - pJawLeft.y;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            metrics.push(calculateMetricScore('fja', angle, gender)); // Updated ID
        } else metrics.push(calculateMetricScore('fja', NaN, gender));
    }

    return generateReport(metrics);
};
