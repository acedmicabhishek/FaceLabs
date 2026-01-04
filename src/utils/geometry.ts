import { Point } from '../types';

export const calculateDistance = (p1: Point, p2: Point): number => {
    'worklet';
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const calculateAngle = (p1: Point, center: Point, p3: Point): number => {
    'worklet';
    const a = calculateDistance(center, p3);
    const b = calculateDistance(center, p1);
    const c = calculateDistance(p1, p3);

    if (a === 0 || b === 0) return 0;

    const cosGamma = (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b);

    const clampedCos = Math.max(-1, Math.min(1, cosGamma));

    const angleRad = Math.acos(clampedCos);
    return (angleRad * 180) / Math.PI;
};

// Calculate angle of line p1->p2 relative to horizontal axis (0 degrees is East)
export const calculateLineAngle = (p1: Point, p2: Point): number => {
    'worklet';
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
};

// Calculate the inner angle between two lines defined by (p1, p2) and (p3, p4)
export const calculateAngleBetweenLines = (line1Start: Point, line1End: Point, line2Start: Point, line2End: Point): number => {
    'worklet';
    const angle1 = calculateLineAngle(line1Start, line1End);
    const angle2 = calculateLineAngle(line2Start, line2End);

    let diff = Math.abs(angle1 - angle2);
    if (diff > 180) {
        diff = 360 - diff;
    }
    return diff;
};

export const calculateRatio = (numerator: number, denominator: number): number => {
    'worklet';
    if (denominator === 0) return 0;
    return numerator / denominator;
};

export const toDegrees = (rad: number): number => {
    'worklet';
    return (rad * 180) / Math.PI;
};

export const toRadians = (deg: number): number => {
    'worklet';
    return (deg * Math.PI) / 180;
};
