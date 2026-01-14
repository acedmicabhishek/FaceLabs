import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { Point } from '../types';
import DraggableDot from './DraggableDot';
import Svg, { Line, Text as SvgText, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface FreeStyleMapperProps {
    imageUri: string;
    gender: 'male' | 'female';
    onBack: () => void;
    onExit: () => void;
}

export default function FreeStyleMapper({ imageUri, gender, onBack, onExit }: FreeStyleMapperProps) {
    const [points, setPoints] = useState<Point[]>([]);
    const [containerLayout, setContainerLayout] = useState<{ width: number; height: number } | null>(null);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

    const getDistance = (p1: Point, p2: Point) => {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };

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

    const stats = useMemo(() => {
        if (points.length < 2) return { totalDist: 0, segments: [], angles: [] };

        let totalDist = 0;
        const segments: { length: number; ratio: number; mid: { x: number; y: number } }[] = [];
        const angles: { value: number; point: Point }[] = [];

        for (let i = 0; i < points.length - 1; i++) {
            const dist = getDistance(points[i], points[i + 1]);
            totalDist += dist;
            segments.push({
                length: dist,
                ratio: 0,
                mid: { x: (points[i].x + points[i + 1].x) / 2, y: (points[i].y + points[i + 1].y) / 2 }
            });
        }

        
        if (totalDist > 0) {
            segments.forEach(seg => {
                seg.ratio = (seg.length / totalDist) * 100;
            });
        }

        
        for (let i = 1; i < points.length - 1; i++) {
            const angle = getAngle(points[i - 1], points[i], points[i + 1]);
            angles.push({ value: angle, point: points[i] });
        }

        return { totalDist, segments, angles };
    }, [points]);

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

    const handleTap = (evt: { x: number, y: number }) => {
        if (!renderedRect) return;
        const HIT_RADIUS = 20;
        const clickedPointIndex = points.findIndex(p =>
            Math.abs(p.x - evt.x) < HIT_RADIUS && Math.abs(p.y - evt.y) < HIT_RADIUS
        );

        if (clickedPointIndex !== -1) {
            
            const newPoints = [...points];
            newPoints.splice(clickedPointIndex, 1);
            setPoints(newPoints);
        } else {
            
            const newPoint: Point = {
                x: evt.x,
                y: evt.y,
                id: Date.now().toString(), 
                normalizedX: (evt.x - renderedRect.x) / renderedRect.width,
                normalizedY: (evt.y - renderedRect.y) / renderedRect.height
            };
            setPoints([...points, newPoint]);
        }
    };

    const handleDragPoint = (index: number, newX: number, newY: number) => {
        if (!renderedRect) return;
        const newPoints = [...points];
        
        const clampedX = Math.max(renderedRect.x, Math.min(renderedRect.x + renderedRect.width, newX));
        const clampedY = Math.max(renderedRect.y, Math.min(renderedRect.y + renderedRect.height, newY));

        newPoints[index] = {
            ...newPoints[index],
            x: clampedX,
            y: clampedY,
            normalizedX: (clampedX - renderedRect.x) / renderedRect.width,
            normalizedY: (clampedY - renderedRect.y) / renderedRect.height
        };
        setPoints(newPoints);
    };

    const panGesture = Gesture.Pan()
        .enabled(zoomLevel > 1)
        .runOnJS(true)
        .onUpdate((e) => {
            const event = e as any;
            setPanOffset(prev => {
                const newX = prev.x + (event.changeX || 0);
                const newY = prev.y + (event.changeY || 0);
                const maxDx = (containerLayout ? containerLayout.width : 0) * (zoomLevel - 1) / 2;
                const maxDy = (containerLayout ? containerLayout.height : 0) * (zoomLevel - 1) / 2;
                return {
                    x: Math.max(-maxDx, Math.min(maxDx, newX)),
                    y: Math.max(-maxDy, Math.min(maxDy, newY))
                };
            });
        });

    const handleZoom = (targetZoom: number) => {
        setZoomLevel(targetZoom);
        setPanOffset({ x: 0, y: 0 }); 
    };

    const clearPoints = () => setPoints([]);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0f0c29', '#302b63', '#24243e']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.header} edges={['top']}>
                <View>
                    <Text style={styles.headerTitle}>FREE STYLE ({gender.toUpperCase()})</Text>
                    <Text style={styles.headerSubtitle}>{points.length} Points • Total Length: {Math.round(stats.totalDist)}px</Text>
                </View>
                <View style={styles.headerActions}>
                    <Pressable onPress={clearPoints} style={styles.clearBtn} hitSlop={10}>
                        <Text style={styles.clearBtnText}>Clear</Text>
                    </Pressable>
                    <Pressable onPress={onExit} style={styles.exitButton}>
                        <Text style={styles.exitButtonText}>✕</Text>
                    </Pressable>
                </View>
            </SafeAreaView>

            <View style={styles.workArea} onLayout={(e) => setContainerLayout(e.nativeEvent.layout)}>
                <GestureDetector gesture={Gesture.Exclusive(
                    panGesture,
                    Gesture.Tap().onEnd((e) => runOnJS(handleTap)({ x: e.x, y: e.y }))
                )}>
                    <View style={[styles.zoomContainer, {
                        transform: [
                            { scale: zoomLevel },
                            { translateX: panOffset.x / zoomLevel },
                            { translateY: panOffset.y / zoomLevel }
                        ]
                    }]}>

                        {/* Image Layer */}
                        {imageUri && (
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.mainImage}
                                resizeMode="contain"
                            />
                        )}

                        {/* SVG Layer for Lines and Labels */}
                        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
                            {/* Connecting Lines */}
                            {points.length > 1 && points.map((p, i) => {
                                if (i === points.length - 1) return null;
                                const nextP = points[i + 1];
                                return (
                                    <Line
                                        key={`line-${i}`}
                                        x1={p.x}
                                        y1={p.y}
                                        x2={nextP.x}
                                        y2={nextP.y}
                                        stroke="#00D4FF"
                                        strokeWidth="2"
                                        strokeOpacity="0.8"
                                    />
                                );
                            })}

                            {/* Segment Labels */}
                            {stats.segments.map((seg, i) => (
                                <G key={`seg-label-${i}`} x={seg.mid.x} y={seg.mid.y}>
                                    <SvgText
                                        fill="#fff"
                                        fontSize="10"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        y={-5}
                                    >
                                        {Math.round(seg.ratio)}%
                                    </SvgText>
                                </G>
                            ))}

                            {/* Angle Labels */}
                            {stats.angles.map((ang, i) => (
                                <G key={`ang-label-${i}`} x={ang.point.x} y={ang.point.y + 20}>
                                    <SvgText
                                        fill="#FFFF00"
                                        fontSize="12"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                    >
                                        {Math.round(ang.value)}°
                                    </SvgText>
                                </G>
                            ))}
                        </Svg>

                        {/* Interactive Dots Layer */}
                        {points.map((p, i) => (
                            <DraggableDot
                                key={`dot-${i}-${p.x}-${p.y}`} 
                                initialX={p.x}
                                initialY={p.y}
                                color="#00D4FF"
                                size={6}
                                onDragEnd={(x, y) => handleDragPoint(i, x, y)}
                                enabled={true}
                                scaleFactor={zoomLevel}
                            />
                        ))}

                    </View>
                </GestureDetector>

                {/* Hints / Overlays */}
                <View style={styles.instructionsOverlay}>
                    <Text style={styles.instructionText}>Tap to add • Drag to move • Tap point to remove</Text>
                </View>
            </View>

            {/* Footer / Controls */}
            <View style={styles.footer}>
                <Pressable onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </Pressable>

                <View style={styles.zoomControls}>
                    {[1, 2, 4].map((z) => (
                        <Pressable
                            key={z}
                            style={[styles.zoomButton, zoomLevel === z && styles.activeZoom]}
                            onPress={() => handleZoom(z)}
                        >
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 10,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    headerTitle: { color: '#fff', fontSize: 18, fontFamily: 'FiraCode-Bold' },
    headerSubtitle: { color: '#ccc', fontSize: 12, fontFamily: 'FiraCode-Regular', marginTop: 2 },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    clearBtn: { padding: 4 },
    clearBtnText: { color: '#ff4444', fontFamily: 'FiraCode-Medium', fontSize: 12 },
    exitButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    exitButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

    workArea: { flex: 1, position: 'relative', overflow: 'hidden' },
    zoomContainer: { width: '100%', height: '100%' },
    mainImage: { width: '100%', height: '100%' },

    instructionsOverlay: {
        position: 'absolute',
        top: 20,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        pointerEvents: 'none',
    },
    instructionText: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontFamily: 'FiraCode-Regular' },

    footer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    backButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#222',
    },
    backButtonText: { color: '#fff', fontFamily: 'FiraCode-Medium', fontSize: 14 },

    zoomControls: { flexDirection: 'row', gap: 8 },
    zoomButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#222',
    },
    activeZoom: { backgroundColor: '#00D4FF' },
    zoomText: { color: '#fff', fontFamily: 'FiraCode-Regular', fontSize: 12 },
    activeZoomText: { color: '#000', fontFamily: 'FiraCode-Bold' },
});
