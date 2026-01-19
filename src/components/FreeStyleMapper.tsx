import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { Point } from '../types';
import DraggableDot from './DraggableDot';
import Svg, { Line, Text as SvgText, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FREESTYLE_METRICS, calculateDeviationScore, MetricDefinition } from '../constants/metrics';
import { getFacialThirdsRating } from '../constants/3ratiorating';
import { MEASUREMENT_INSTRUCTIONS } from '../constants/instructions';
import { ScrollView } from 'react-native-gesture-handler';

export interface FreeStyleMapperProps {
    imageUri: string;
    gender: 'male' | 'female';
    onBack: () => void;
    onExit: () => void;
}

// Helper to calculate distance
const getDistance = (p1: Point, p2: Point) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

// Helper to calculate angle
const getAngle = (p1: Point, p2: Point, p3: Point) => {
    const p1x = p1.x - p2.x;
    const p1y = p1.y - p2.y;
    const p3x = p3.x - p2.x;
    const p3y = p3.y - p2.y;

    const mag1 = Math.sqrt(p1x * p1x + p1y * p1y);
    const mag3 = Math.sqrt(p3x * p3x + p3y * p3y);

    if (mag1 === 0 || mag3 === 0) return 0;

    const dot = p1x * p3x + p1y * p3y;
    const angleRad = Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag3))));
    return (angleRad * 180) / Math.PI;
};

export default function FreeStyleMapper({ imageUri, gender, onBack, onExit }: FreeStyleMapperProps) {
    // State: Use a structure that supports multiple paths directly.
    // Flattened view for rendering: We map paths to dots.
    const [paths, setPaths] = useState<Point[][]>([[]]);
    const [activePathIndex, setActivePathIndex] = useState(0);

    const [containerLayout, setContainerLayout] = useState<{ width: number; height: number } | null>(null);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [selectedMetric, setSelectedMetric] = useState<MetricDefinition | null>(null);
    const [isScoreVisible, setIsScoreVisible] = useState(true);

    // Flatten points for hit testing and rendering
    const allPoints = useMemo(() => paths.flat(), [paths]);

    // --- Statistics ---
    const stats = useMemo(() => {
        let totalDist = 0;
        const segments: { length: number; ratio: number; mid: { x: number; y: number }, labelPos: { x: number, y: number }, pathIdx: number }[] = [];
        const angles: { value: number; point: Point, labelPos: { x: number, y: number } }[] = [];

        paths.forEach((path, pIdx) => {
            if (path.length < 2) return;

            // Segments
            for (let i = 0; i < path.length - 1; i++) {
                const p1 = path[i];
                const p2 = path[i + 1];
                const dist = getDistance(p1, p2);
                totalDist += dist;

                // Midpoint
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;

                // Perpendicular Offset for Label
                // Vector P1 -> P2 = (dx, dy)
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                // Normalize
                const len = Math.sqrt(dx * dx + dy * dy);
                // Perpendicular: (-dy, dx)
                // Normalize perpendicular
                const perpX = -dy / (len || 1);
                const perpY = dx / (len || 1);

                // Offset by 15px
                const labelX = midX + perpX * 15;
                const labelY = midY + perpY * 15;

                segments.push({
                    length: dist,
                    ratio: 0,
                    mid: { x: midX, y: midY },
                    labelPos: { x: labelX, y: labelY },
                    pathIdx: pIdx
                });
            }

            // Angles
            for (let i = 1; i < path.length - 1; i++) {
                const prev = path[i - 1];
                const curr = path[i];
                const next = path[i + 1];
                const angle = getAngle(prev, curr, next);

                // Bisector Calculation
                // Vector 1: Prev -> Curr (Incoming). We want Outgoing representation: Curr -> Prev
                const v1x = prev.x - curr.x;
                const v1y = prev.y - curr.y;
                const l1 = Math.sqrt(v1x * v1x + v1y * v1y);

                // Vector 2: Curr -> Next
                const v2x = next.x - curr.x;
                const v2y = next.y - curr.y;
                const l2 = Math.sqrt(v2x * v2x + v2y * v2y);

                // Normalize
                const n1x = v1x / (l1 || 1);
                const n1y = v1y / (l1 || 1);
                const n2x = v2x / (l2 || 1);
                const n2y = v2y / (l2 || 1);

                // Bisector direction (Sum of normalized vectors) points "inside" the V
                let bx = n1x + n2x;
                let by = n1y + n2y;
                let bLen = Math.sqrt(bx * bx + by * by);

                // If colinear (straight line), bisector is 0. Use perpendicular to one.
                if (bLen < 0.001) {
                    bx = -n1y;
                    by = n1x;
                    bLen = 1;
                }

                // Normalize bisector
                const nbx = bx / bLen;
                const nby = by / bLen;

                // Offset 25px
                const lx = curr.x + nbx * 25;
                const ly = curr.y + nby * 25;

                angles.push({ value: angle, point: curr, labelPos: { x: lx, y: ly } });
            }
        });

        // Update ratios (Percentage of TOTAL length of ALL paths)
        if (totalDist > 0) {
            segments.forEach(seg => {
                seg.ratio = (seg.length / totalDist) * 100;
            });
        }

        return { totalDist, segments, angles };
    }, [paths]);

    // --- Layout ---
    useEffect(() => {
        if (imageUri) {
            Image.getSize(imageUri, (w, h) => {
                setImageDimensions({ width: w, height: h });
            }, (error) => console.error("Failed to get image size", error));
        }
    }, [imageUri]);

    const renderedRect = useMemo(() => {
        if (!containerLayout || !imageDimensions) return null;
        const { width: cw, height: ch } = containerLayout;
        const { width: iw, height: ih } = imageDimensions;
        const scale = Math.min(cw / iw, ch / ih);
        const renderedWidth = iw * scale;
        const renderedHeight = ih * scale;
        const offsetX = (cw - renderedWidth) / 2;
        const offsetY = (ch - renderedHeight) / 2;
        return { x: offsetX, y: offsetY, width: renderedWidth, height: renderedHeight, scale };
    }, [containerLayout, imageDimensions]);

    // --- Actions ---
    const handleTap = (evt: { x: number, y: number }) => {
        if (!renderedRect) return;
        const HIT_RADIUS = 5;

        // Check if removing a point
        let foundPathIdx = -1;
        let foundPointIdx = -1;

        paths.forEach((path, pIdx) => {
            path.forEach((p, ptIdx) => {
                if (Math.abs(p.x - evt.x) < HIT_RADIUS && Math.abs(p.y - evt.y) < HIT_RADIUS) {
                    foundPathIdx = pIdx;
                    foundPointIdx = ptIdx;
                }
            });
        });

        if (foundPathIdx !== -1) {
            // Remove point
            const newPaths = [...paths];
            newPaths[foundPathIdx].splice(foundPointIdx, 1);
            setPaths(newPaths);
        } else {
            // Add point to ACTIVE path
            const newPoint: Point = {
                x: evt.x,
                y: evt.y,
                id: Date.now().toString(),
                normalizedX: (evt.x - renderedRect.x) / renderedRect.width,
                normalizedY: (evt.y - renderedRect.y) / renderedRect.height
            };
            const newPaths = [...paths];

            // Ensure active path exists
            if (!newPaths[activePathIndex]) {
                newPaths[activePathIndex] = [];
            }
            newPaths[activePathIndex].push(newPoint);
            setPaths(newPaths);
        }
    };

    const handleDragPoint = (pathIdx: number, ptIdx: number, newX: number, newY: number) => {
        if (!renderedRect) return;
        const newPaths = [...paths];
        const clampedX = Math.max(renderedRect.x, Math.min(renderedRect.x + renderedRect.width, newX));
        const clampedY = Math.max(renderedRect.y, Math.min(renderedRect.y + renderedRect.height, newY));

        newPaths[pathIdx][ptIdx] = {
            ...newPaths[pathIdx][ptIdx],
            x: clampedX,
            y: clampedY,
            normalizedX: (clampedX - renderedRect.x) / renderedRect.width,
            normalizedY: (clampedY - renderedRect.y) / renderedRect.height
        };
        setPaths(newPaths);
    };

    const breakLine = () => {
        if (paths[activePathIndex] && paths[activePathIndex].length > 0) {
            setPaths([...paths, []]);
            setActivePathIndex(paths.length);
        }
    };

    const clearPoints = () => {
        setPaths([[]]);
        setActivePathIndex(0);
    };

    const handleZoom = (targetZoom: number) => {
        if (!containerLayout) {
            setZoomLevel(targetZoom);
            setPanOffset({ x: 0, y: 0 });
            return;
        }

        let targetPanX = 0;
        let targetPanY = 0;

        // Find the last placed point to focus on
        let focusPoint: Point | null = null;
        if (paths[activePathIndex] && paths[activePathIndex].length > 0) {
            focusPoint = paths[activePathIndex][paths[activePathIndex].length - 1];
        } else {
            // Search backwards for any point
            for (let i = paths.length - 1; i >= 0; i--) {
                if (paths[i].length > 0) {
                    focusPoint = paths[i][paths[i].length - 1];
                    break;
                }
            }
        }

        if (focusPoint && targetZoom > 1) {
            const cx = containerLayout.width / 2;
            const cy = containerLayout.height / 2;
            const dx = focusPoint.x - cx;
            const dy = focusPoint.y - cy;

            const idealPanX = -dx * targetZoom;
            const idealPanY = -dy * targetZoom;

            const maxDx = containerLayout.width * (targetZoom - 1) / 2;
            const maxDy = containerLayout.height * (targetZoom - 1) / 2;

            targetPanX = Math.max(-maxDx, Math.min(maxDx, idealPanX));
            targetPanY = Math.max(-maxDy, Math.min(maxDy, idealPanY));
        } else {
            if (targetZoom === 1) {
                targetPanX = 0;
                targetPanY = 0;
            }
        }

        setPanOffset({ x: targetPanX, y: targetPanY });
        setZoomLevel(targetZoom);
    };

    const tapGesture = Gesture.Tap().onEnd((e) => {
        runOnJS(handleTap)({ x: e.x, y: e.y });
    });

    const panGesture = Gesture.Pan()
        .enabled(zoomLevel > 1)
        .runOnJS(true)
        .onUpdate((e) => {
            const event = e as any;
            setPanOffset(prev => ({
                x: prev.x + (event.changeX || 0),
                y: prev.y + (event.changeY || 0)
            }));
        });

    // On Web, Race/Exclusive with a disabled gesture might block interactions.
    // Use Tap only if not zoomed; otherwise allow Pan.
    const gesture = useMemo(() => {
        if (zoomLevel > 1) {
            return Gesture.Race(panGesture, tapGesture);
        }
        return tapGesture;
    }, [zoomLevel, panGesture, tapGesture]);

    // --- Scoring Logic Upgrade ---
    const measuredValue = useMemo(() => {
        if (!selectedMetric) return null;

        if (selectedMetric.type === 'angle') {
            if (selectedMetric.id === 'deviation_iaa_jfa' && stats.angles.length >= 2) {
                // Calculate absolute deviation between the first two angles
                return Math.abs(stats.angles[0].value - stats.angles[1].value);
            }

            if (stats.angles.length > 0) return stats.angles[stats.angles.length - 1].value;
            return null;
        }

        if (selectedMetric.type === 'ratio') {
            const allSegs = stats.segments;
            if (allSegs.length >= 2) {
                const s1 = allSegs[0].length;
                const s2 = allSegs[1].length;

                if (selectedMetric.id === 'lower_jaw_to_neck_ratio') {
                    // s1 = Jaw, s2 = Neck. Ratio = Jaw / Neck
                    return (s1 / s2);
                }
                if (selectedMetric.id === 'ramus_mandible_ratio') {
                    return (s1 / s2);
                }
                if (selectedMetric.id === 'chin_philtrum_ratio') {
                    return (s2 / s1);
                }
                return s2 / s1;
            }
        }

        if (selectedMetric.type === 'percentage') {
            if (stats.segments.length > 0) {
                // Special handling for Facial Thirds
                if (selectedMetric.id === 'facial_thirds' && stats.segments.length === 3) {
                    // Assume standard order: Upper, Mid, Lower.
                    // The rating config targets the Lower Third Percentage (e.g. 34-38% for Chad).
                    return stats.segments[2].ratio;
                }

                // Special handling for Width Ratios (Bigonial, Bitemporal) and Proportions
                // Instructions: Draw Reference (s1) first, then Target (s2).
                if ((selectedMetric.id === 'bigonial_width' || selectedMetric.id === 'bitemporal_width' || selectedMetric.id === 'lower_third_proportion') && stats.segments.length >= 2) {
                    const s1 = stats.segments[0].length;
                    const s2 = stats.segments[1].length;
                    return (s2 / s1) * 100;
                }

                // Default: return the ratio of the first segment 
                // (Useful for single percentage metrics like Lower Third Proportion if drawn as Total + Lower)
                // But for Facial Thirds if they only draw 1 line, it's ambiguous. 
                // We'll return the first one as a fallback.
                return stats.segments[0].ratio;
            }
        }
        return null;
    }, [selectedMetric, stats, paths]);

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={StyleSheet.absoluteFill} />
            <SafeAreaView style={styles.header} edges={['top']}>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle} numberOfLines={1}>FREE STYLE ({gender.toUpperCase()})</Text>
                    <Text style={styles.headerSubtitle}>
                        {allPoints.length} Points • {paths.length} Paths • Total: {Math.round(stats.totalDist)}
                    </Text>
                </View>
                <View style={styles.headerActions}>
                    <Pressable onPress={() => setIsScoreVisible(!isScoreVisible)} style={[styles.breakBtn, { marginRight: 4 }]}>
                        <Text style={styles.breakBtnText}>{isScoreVisible ? 'Hide' : 'Show'}</Text>
                    </Pressable>
                    <Pressable onPress={breakLine} style={styles.breakBtn}>
                        <Text style={styles.breakBtnText}>Break</Text>
                    </Pressable>
                    <Pressable onPress={clearPoints} style={styles.clearBtn} hitSlop={10}>
                        <Text style={styles.clearBtnText}>Clear</Text>
                    </Pressable>
                    <Pressable onPress={onExit} style={styles.exitButton}>
                        <Text style={styles.exitButtonText}>✕</Text>
                    </Pressable>
                </View>
            </SafeAreaView>

            <View style={styles.workArea} onLayout={(e) => setContainerLayout(e.nativeEvent.layout)}>
                <GestureDetector gesture={gesture}>
                    <View style={[styles.zoomContainer, { transform: [{ scale: zoomLevel }, { translateX: panOffset.x / zoomLevel }, { translateY: panOffset.y / zoomLevel }] }]}>
                        {imageUri && <Image source={{ uri: imageUri }} style={styles.mainImage} resizeMode="contain" />}

                        <Svg style={StyleSheet.absoluteFill} pointerEvents="none" width="100%" height="100%">
                            {/* Render Lines for each path */}
                            {paths.map((path, pIdx) => (
                                <G key={`path-${pIdx}`}>
                                    {path.map((p, i) => {
                                        if (i === path.length - 1) return null;
                                        const nextP = path[i + 1];
                                        return (
                                            <Line key={`line-${pIdx}-${i}`} x1={p.x} y1={p.y} x2={nextP.x} y2={nextP.y} stroke="#00D4FF" strokeWidth="2" strokeOpacity="0.8" />
                                        );
                                    })}
                                </G>
                            ))}

                            {/* Labels */}
                            {stats.segments.map((seg, i) => (
                                <G key={`seg-label-${i}`} x={seg.labelPos.x} y={seg.labelPos.y}>
                                    <SvgText fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
                                        {Math.round(seg.ratio)}%
                                    </SvgText>
                                </G>
                            ))}
                            {stats.angles.map((ang, i) => (
                                <G key={`ang-label-${i}`} x={ang.labelPos.x} y={ang.labelPos.y}>
                                    <SvgText fill="#FFFF00" fontSize="12" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
                                        {Math.round(ang.value)}°
                                    </SvgText>
                                </G>
                            ))}
                        </Svg>

                        {/* Dots */}
                        {paths.map((path, pIdx) =>
                            path.map((p, ptIdx) => (
                                <DraggableDot
                                    key={`dot-${p.x}-${p.y}`}
                                    initialX={p.x} initialY={p.y}
                                    color={pIdx === activePathIndex ? "#00D4FF" : "#888"}
                                    size={6}
                                    onDragEnd={(x, y) => handleDragPoint(pIdx, ptIdx, x, y)}
                                    scaleFactor={zoomLevel}
                                />
                            ))
                        )}
                    </View>
                </GestureDetector>

                {/* Instruction Card */}
                {selectedMetric && (
                    <View style={{
                        position: 'absolute',
                        bottom: 20,
                        left: 20,
                        right: 20,
                        zIndex: 20,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        padding: 12,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.2)'
                    }}>
                        <Text style={{ color: '#ccc', fontSize: 13, textAlign: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: '#fff' }}>How to Map:</Text> {MEASUREMENT_INSTRUCTIONS[selectedMetric.id] || "Draw the feature lines/points."}
                        </Text>
                    </View>
                )}

                {/* Score Card */}
                {selectedMetric && measuredValue !== null && isScoreVisible && (
                    <View style={styles.scoreCard}>
                        {(() => {
                            // Special override for Facial Thirds with 3 segments
                            if (selectedMetric.id === 'facial_thirds' && stats.segments.length === 3) {
                                // Assuming order: Upper (0), Mid (1), Lower (2)
                                const s1 = stats.segments[0].length;
                                const s2 = stats.segments[1].length;
                                const s3 = stats.segments[2].length;
                                const { tier, score } = getFacialThirdsRating(s1, s2, s3, gender);

                                // Construct ideal range string (simplified for display)
                                const idealRange = gender === 'male' ? "U/M:30-33%, L:34-38%" : "U/M:30-36%";

                                return (
                                    <>
                                        <View style={styles.scoreRow}>
                                            <Text style={styles.scoreTitle}>{selectedMetric.name}</Text>
                                            <Text style={[styles.tierBadge, {
                                                backgroundColor: tier === 'Chad' ? '#00D4FF' :
                                                    (tier === 'CL') ? '#00E676' :
                                                        (tier === 'HTN') ? '#4CAF50' :
                                                            (tier === 'MTN') ? '#FFC107' :
                                                                (tier === 'LTN') ? '#FF9800' :
                                                                    (tier === 'Sub5') ? '#F44336' : '#8B0000'
                                            }]}>{tier}</Text>
                                        </View>
                                        {/* Display percentages for each third */}
                                        <Text style={styles.scoreValue}>
                                            {Math.round(stats.segments[0].ratio)}% / {Math.round(stats.segments[1].ratio)}% / {Math.round(stats.segments[2].ratio)}%
                                        </Text>
                                        <Text style={styles.scoreDetail}>
                                            Ideal: {idealRange}
                                        </Text>
                                        <View style={styles.progressBar}>
                                            <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, (score + 17.5) / (35 + 17.5) * 100))}%`, backgroundColor: tier === 'Chad' ? '#00D4FF' : '#FF9800' }]} />
                                        </View>
                                    </>
                                );
                            }

                            // Default scoring for other metrics
                            const { score, tier, diff, idealRange } = calculateDeviationScore(measuredValue, selectedMetric, gender);
                            return (
                                <>
                                    <View style={styles.scoreRow}>
                                        <Text style={styles.scoreTitle}>{selectedMetric.name}</Text>
                                        <Text style={[styles.tierBadge, {
                                            backgroundColor: tier === 'Chad' ? '#00D4FF' :
                                                (tier === 'CL') ? '#00E676' :
                                                    (tier === 'HTN') ? '#4CAF50' :
                                                        (tier === 'MTN') ? '#FFC107' :
                                                            (tier === 'LTN') ? '#FF9800' :
                                                                (tier === 'Sub5') ? '#F44336' : '#8B0000' // SUBHUMAN
                                        }]}>{tier}</Text>
                                    </View>
                                    <Text style={styles.scoreValue}>
                                        {selectedMetric.type === 'ratio' ? measuredValue.toFixed(2) :
                                            selectedMetric.type === 'percentage' ? Math.round(measuredValue) + '%' :
                                                Math.round(measuredValue) + '°'}
                                    </Text>
                                    <Text style={styles.scoreDetail}>
                                        Ideal: {idealRange}
                                        {diff > 0 && <Text style={{ color: '#ff4444' }}> (Off by {diff.toFixed(2)})</Text>}
                                    </Text>
                                    <View style={styles.progressBar}>
                                        <View style={[styles.progressFill, { width: `${score}%`, backgroundColor: score > 80 ? '#00D4FF' : '#FF9800' }]} />
                                    </View>
                                </>
                            );
                        })()}
                    </View>
                )}
            </View>

            {/* Metrics */}
            <View style={styles.metricSelectorContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.metricScroll}>
                    {FREESTYLE_METRICS.map((m) => (
                        <Pressable
                            key={m.id}
                            style={[styles.metricChip, selectedMetric?.id === m.id && styles.metricChipActive]}
                            onPress={() => {
                                setSelectedMetric(m);
                                setPaths([[]]); setActivePathIndex(0);
                            }}
                        >
                            <Text style={[styles.metricChipText, selectedMetric?.id === m.id && styles.metricChipTextActive]}>{m.name}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <Pressable onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </Pressable>
                <View style={styles.zoomControls}>
                    {[1, 2, 4].map((z) => (
                        <Pressable key={z} style={[styles.zoomButton, zoomLevel === z && styles.activeZoom]} onPress={() => handleZoom(z)}>
                            <Text style={[styles.zoomText, zoomLevel === z && styles.activeZoomText]}>{z}x</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 10, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 10 },
    headerTitleContainer: { flex: 1, marginRight: 8 },
    headerTitle: { color: '#fff', fontSize: 14, fontFamily: 'FiraCode-Bold' },
    headerSubtitle: { color: '#ccc', fontSize: 10, fontFamily: 'FiraCode-Regular' },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },

    breakBtn: { backgroundColor: '#333', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: '#555' },
    breakBtnText: { color: '#fff', fontSize: 11, fontFamily: 'FiraCode-Medium' },

    clearBtn: { padding: 4 },
    clearBtnText: { color: '#ff4444', fontFamily: 'FiraCode-Medium', fontSize: 12 },
    exitButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
    exitButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

    workArea: { flex: 1, position: 'relative', overflow: 'hidden' },
    zoomContainer: { width: '100%', height: '100%' },
    mainImage: { width: '100%', height: '100%' },

    metricSelectorContainer: { height: 60, backgroundColor: 'rgba(0,0,0,0.8)', borderTopWidth: 1, borderTopColor: '#333' },
    metricScroll: { alignItems: 'center', paddingHorizontal: 16, gap: 8 },
    metricChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#222', borderWidth: 1, borderColor: '#444' },
    metricChipActive: { backgroundColor: 'rgba(0, 212, 255, 0.2)', borderColor: '#00D4FF' },
    metricChipText: { color: '#888', fontSize: 12, fontFamily: 'FiraCode-Medium' },
    metricChipTextActive: { color: '#00D4FF' },

    scoreCard: { position: 'absolute', top: 60, left: 20, backgroundColor: 'rgba(0,0,0,0.9)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#00D4FF', minWidth: 200 },
    scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    scoreTitle: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    tierBadge: { fontSize: 10, fontWeight: 'bold', color: '#000', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
    scoreValue: { color: '#fff', fontSize: 24, fontWeight: 'bold', fontFamily: 'FiraCode-Bold' },
    scoreDetail: { color: '#aaa', fontSize: 10, marginBottom: 8 },
    progressBar: { height: 4, backgroundColor: '#333', borderRadius: 2, overflow: 'hidden' },
    progressFill: { height: '100%' },

    footer: { flexDirection: 'row', padding: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
    backButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, backgroundColor: '#222' },
    backButtonText: { color: '#fff', fontFamily: 'FiraCode-Medium', fontSize: 14 },
    zoomControls: { flexDirection: 'row', gap: 8 },
    zoomButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', borderRadius: 8, backgroundColor: '#222' },
    activeZoom: { backgroundColor: '#00D4FF' },
    zoomText: { color: '#fff', fontFamily: 'FiraCode-Regular', fontSize: 12 },
    activeZoomText: { color: '#000', fontFamily: 'FiraCode-Bold' },
});
