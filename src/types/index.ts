export interface Point {
    x: number;
    y: number;
    id?: number | string;
    name?: string;
    normalizedX?: number;
    normalizedY?: number;
}

export interface Metric {
    id: string;
    name: string;
    value: number;
    score: number;
    tier: string;
    idealRange: [number, number];
    category: 'Harmony' | 'Dimorphism' | 'Angularity' | 'Feature';
}

export interface ScoreReport {
    totalScore: number;
    subScores: {
        harmony: number;
        dimorphism: number;
        angularity: number;
        feature: number;
    };
    metrics: Metric[];
}

export type Pillar = 'Harmony' | 'Dimorphism' | 'Angularity' | 'Feature';
