import { Metric, Pillar, ScoreReport, Point } from '../types';
import { calculateAngle, calculateAngleBetweenLines, calculateDistance } from './geometry';
import { IDEAL_RANGES_MALE } from './scoring_male';
import { IDEAL_RANGES_FEMALE } from './scoring_female';

export const calculateMetricScore = (metricId: string, value: number, gender: 'male' | 'female'): Metric => {
    const ranges = gender === 'female' ? IDEAL_RANGES_FEMALE : IDEAL_RANGES_MALE;
    const def = ranges[metricId];

    if (!def) {
        return {
            id: metricId,
            name: metricId,
            value,
            score: 0,
            tier: 'N/A',
            idealRange: [0, 0],
            category: 'Harmony'
        };
    }

    if (isNaN(value) || !isFinite(value)) {
        return {
            id: def.id,
            name: def.name,
            value: NaN,
            score: 0,
            tier: 'N/A',
            idealRange: [def.min, def.max],
            category: def.tier
        };
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
        Feature: { total: 0, count: 0 }
    };


    metrics.forEach(m => {
        if (!isNaN(m.score)) {
            pillars[m.category].total += m.score;
            pillars[m.category].count += 1;
        }
    });

    const getAvg = (p: Pillar, defaultVal: number) => pillars[p].count > 0 ? pillars[p].total / pillars[p].count : defaultVal;

    // Calculate Averages. Default to 50 (Average) if missing, except Feature which defaults to 80 (Neutral/Good) as per user request.
    const harmonyScore = getAvg('Harmony', 50);
    const dimorphismScore = getAvg('Dimorphism', 50);
    const angularityScore = getAvg('Angularity', 50);
    // User requested: "misc cant be measured mathmatically so we will set it to nutral"
    // Setting Feature (Misc) default to 80 (Neutral/Good Tier 3) improves the baseline if no soft tissue metrics are present.
    const featureScore = getAvg('Feature', 80);

    // Geometric Weighted Formula:
    // (Harmony^0.3) * (Dimorphism^0.2) * (Angularity^0.2) * (Feature^0.3)
    const totalScore =
        Math.pow(harmonyScore, 0.3) *
        Math.pow(dimorphismScore, 0.2) *
        Math.pow(angularityScore, 0.2) *
        Math.pow(featureScore, 0.3);

    return {
        totalScore: Number((totalScore / 10).toFixed(1)),
        subScores: {
            harmony: Math.round(harmonyScore),
            dimorphism: Math.round(dimorphismScore),
            angularity: Math.round(angularityScore),
            feature: Math.round(featureScore)
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
        const pIntertragicNotch = getPoint(points, 8); // Intertragic Notch (Ar approx)
        const pGonionTop = getPoint(points, 30);      // Gonion Top
        const pGonionBottom = getPoint(points, 31);   // Gonion Bottom
        const pMenton = getPoint(points, 28);         // Menton
        const pCervical = getPoint(points, 29);       // Cervical
        const pNeck = getPoint(points, 4);            // Neck Point

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
            metrics.push(calculateMetricScore('ramus_to_mandible', ramusLen / bodyLen, gender));
        } else metrics.push(calculateMetricScore('ramus_to_mandible', NaN, gender));

        // 3. Nasolabial Angle (Col-Sn-Ls)
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
            metrics.push(calculateMetricScore('chin_philtrum', chinHeight / philtrumLen, gender));
        } else metrics.push(calculateMetricScore('chin_philtrum', NaN, gender));

        // 6. Jaw Frontal Angle
        if (pJawLeft && pChinLeft) {
            const dx = pChinLeft.x - pJawLeft.x;
            const dy = pChinLeft.y - pJawLeft.y;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            metrics.push(calculateMetricScore('jaw_frontal', angle, gender));
        } else metrics.push(calculateMetricScore('jaw_frontal', NaN, gender));
    }

    return generateReport(metrics);
};
