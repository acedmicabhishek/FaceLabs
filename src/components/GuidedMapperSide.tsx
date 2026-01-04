import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { SIDE_LANDMARKS } from '../constants/sideLandmarks';
import DraggableDot from './DraggableDot';
import { Point } from '../types';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export interface GuidedMapperProps {
    imageUri: string;
    points: Point[];
    onPointsUpdate: (points: Point[]) => void;
    onComplete: () => void;
}

const Crosshair = ({ x, y }: { x: number, y: number }) => (
    <View style={[styles.crosshairContainer, { left: x - 50, top: y - 50 }]}>
        <View style={styles.crosshairCenter} />
    </View>
);

const SIDE_MASK_POSITIONS: { [key: number]: Point } = {
    1: { x: 0.50, y: 0.15 },
    2: { x: 0.85, y: 0.40 },
    3: { x: 0.10, y: 0.50 },
    4: { x: 0.50, y: 0.85 },
    5: { x: 0.60, y: 0.48 },
    6: { x: 0.35, y: 0.48 },
    7: { x: 0.62, y: 0.48 },
    8: { x: 0.62, y: 0.52 },
    9: { x: 0.28, y: 0.45 },
    10: { x: 0.45, y: 0.55 },
    11: { x: 0.35, y: 0.45 },
    12: { x: 0.35, y: 0.48 },
    13: { x: 0.45, y: 0.20 },
    14: { x: 0.25, y: 0.35 },
    15: { x: 0.40, y: 0.30 },
    16: { x: 0.22, y: 0.38 },
    17: { x: 0.15, y: 0.45 },
    18: { x: 0.12, y: 0.48 },
    19: { x: 0.12, y: 0.52 },
    20: { x: 0.18, y: 0.55 },
    21: { x: 0.22, y: 0.58 },
    22: { x: 0.25, y: 0.55 },
    23: { x: 0.20, y: 0.62 },
    24: { x: 0.35, y: 0.65 },
    25: { x: 0.20, y: 0.68 },
    26: { x: 0.22, y: 0.72 },
    27: { x: 0.20, y: 0.80 },
    28: { x: 0.25, y: 0.85 },
    29: { x: 0.55, y: 0.80 },
    30: { x: 0.70, y: 0.70 },
    31: { x: 0.72, y: 0.75 },
};

export default function GuidedMapperSide({ imageUri, points, onPointsUpdate, onComplete }: GuidedMapperProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [helperVisible, setHelperVisible] = useState(true);
    const [containerLayout, setContainerLayout] = useState<{ width: number; height: number } | null>(null);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

    const [zoomLevel, setZoomLevel] = useState(1);

    // Zoom/Pan Shared Values
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const savedTranslationX = useSharedValue(0);
    const savedTranslationY = useSharedValue(0);

    const currentLandmark = SIDE_LANDMARKS[currentStep];

    useEffect(() => {
        if (imageUri) {
            Image.getSize(imageUri, (w, h) => {
                setImageDimensions({ width: w, height: h });
            }, (error) => {
                console.error("Failed to get image size", error);
            });
        }
    }, [imageUri]);

    // Calculate Rendered Image Rect
    const getRenderedImageRect = () => {
        if (!containerLayout || !imageDimensions) return null;
        const { width: cw, height: ch } = containerLayout;
        const { width: iw, height: ih } = imageDimensions;
        const scale = Math.min(cw / iw, ch / ih);
        const renderedWidth = iw * scale;
        const renderedHeight = ih * scale;
        const offsetX = (cw - renderedWidth) / 2;
        const offsetY = (ch - renderedHeight) / 2;
        return { x: offsetX, y: offsetY, width: renderedWidth, height: renderedHeight, scale };
    };

    const renderedRect = getRenderedImageRect();

    // Initialize Points
    useEffect(() => {
        if (points.length === 0 && renderedRect) {
            const initialPoints = SIDE_LANDMARKS.map((l) => {
                const pos = SIDE_MASK_POSITIONS[l.id] || { x: 0.5, y: 0.5 };
                return {
                    x: renderedRect.x + (pos.x * renderedRect.width),
                    y: renderedRect.y + (pos.y * renderedRect.height),
                    id: l.id,
                    name: l.name,
                    normalizedX: pos.x,
                    normalizedY: pos.y
                };
            });
            onPointsUpdate(initialPoints);
        }
    }, [renderedRect, points.length]);

    // Re-Project Points when Resize Happens
    useEffect(() => {
        if (points.length > 0 && renderedRect) {
            const needsUpdate = points.some(p => {
                if (p.normalizedX === undefined) return true;
                const expectedX = renderedRect.x + ((p.normalizedX ?? 0.5) * renderedRect.width);
                const expectedY = renderedRect.y + ((p.normalizedY ?? 0.5) * renderedRect.height);
                return Math.abs(p.x - expectedX) > 1 || Math.abs(p.y - expectedY) > 1;
            });

            if (needsUpdate) {
                const updatedPoints = points.map(p => {
                    let normX = p.normalizedX ?? 0.5;
                    let normY = p.normalizedY ?? 0.5;
                    return {
                        ...p,
                        x: renderedRect.x + (normX * renderedRect.width),
                        y: renderedRect.y + (normY * renderedRect.height)
                    };
                });
                onPointsUpdate(updatedPoints);
            }
        }
    }, [renderedRect]);

    // Drag Handler
    const handleDragEnd = (newScreenX: number, newScreenY: number) => {
        if (!renderedRect) return;

        const relativeX = newScreenX - renderedRect.x;
        const relativeY = newScreenY - renderedRect.y;

        let normX = relativeX / renderedRect.width;
        let normY = relativeY / renderedRect.height;

        normX = Math.max(0, Math.min(1, normX));
        normY = Math.max(0, Math.min(1, normY));

        const finalScreenX = renderedRect.x + (normX * renderedRect.width);
        const finalScreenY = renderedRect.y + (normY * renderedRect.height);

        const newPoints = [...points];
        newPoints[currentStep] = {
            x: finalScreenX,
            y: finalScreenY,
            id: currentLandmark.id,
            name: currentLandmark.name,
            normalizedX: normX,
            normalizedY: normY
        };
        onPointsUpdate(newPoints);
    };


    // Zoom & Pan 
    useEffect(() => {
        if (zoomLevel === 1) {
            translationX.value = withSpring(0);
            translationY.value = withSpring(0);
            savedTranslationX.value = 0;
            savedTranslationY.value = 0;
        }
    }, [zoomLevel]);

    const panGesture = Gesture.Pan()
        .enabled(zoomLevel > 1)
        .onStart(() => {
            savedTranslationX.value = translationX.value;
            savedTranslationY.value = translationY.value;
        })
        .onUpdate((e) => {
            let nextX = savedTranslationX.value + e.translationX;
            let nextY = savedTranslationY.value + e.translationY;

            if (zoomLevel > 1) {
                const maxDx = (containerLayout ? containerLayout.width : 0) * (zoomLevel - 1) / 2;
                const maxDy = (containerLayout ? containerLayout.height : 0) * (zoomLevel - 1) / 2;
                if (nextX > maxDx) nextX = maxDx;
                if (nextX < -maxDx) nextX = -maxDx;
                if (nextY > maxDy) nextY = maxDy;
                if (nextY < -maxDy) nextY = -maxDy;
            }
            translationX.value = nextX;
            translationY.value = nextY;
        });

    const handleNext = () => {
        if (currentStep < SIDE_LANDMARKS.length - 1) setCurrentStep(currentStep + 1);
        else onComplete();
    };
    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleZoom = (targetZoom: number) => {
        if (!containerLayout) {
            setZoomLevel(targetZoom);
            return;
        }

        const currentPoint = points[currentStep];
        let targetPanX = 0;
        let targetPanY = 0;

        if (currentPoint && targetZoom > 1) {
            const cx = containerLayout.width / 2;
            const cy = containerLayout.height / 2;
            const dx = currentPoint.x - cx;
            const dy = currentPoint.y - cy;

            // Logic: Tx = -dx * Z^2
            const idealPanX = -dx * targetZoom * targetZoom;
            const idealPanY = -dy * targetZoom * targetZoom;

            // Clamp
            const maxDx = containerLayout.width * (targetZoom - 1) / 2;
            const maxDy = containerLayout.height * (targetZoom - 1) / 2;

            targetPanX = Math.max(-maxDx, Math.min(maxDx, idealPanX));
            targetPanY = Math.max(-maxDy, Math.min(maxDy, idealPanY));
        }

        // Animate to target
        translationX.value = withSpring(targetPanX);
        translationY.value = withSpring(targetPanY);
        setZoomLevel(targetZoom);
    };

    const animatedImageStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: withSpring(zoomLevel) },
            { translateX: translationX.value / zoomLevel },
            { translateY: translationY.value / zoomLevel }
        ]
    }));

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.stepText}>
                        <Text style={{ fontFamily: 'FiraCode-Bold', color: '#fff' }}>{currentStep + 1}</Text>
                        /{SIDE_LANDMARKS.length}
                    </Text>
                    <Text style={styles.landmarkName}>{currentLandmark.name}</Text>
                </View>
                <Text style={styles.progressText}>{Math.round(((currentStep + 1) / SIDE_LANDMARKS.length) * 100)}%</Text>
            </View>

            {/* Main Image Area */}
            <View
                style={styles.imageArea}
                onLayout={(e) => setContainerLayout(e.nativeEvent.layout)}
            >
                <GestureDetector gesture={Gesture.Exclusive(
                    Gesture.Tap().numberOfTaps(2).onEnd((e) => {
                        const newZoom = zoomLevel >= 4 ? 1 : zoomLevel * 2;
                        runOnJS(handleZoom)(newZoom);
                    }),
                    panGesture
                )}>
                    <Animated.View style={[
                        styles.zoomContainer,
                        animatedImageStyle
                    ]}>
                        <GestureDetector gesture={Gesture.Tap().onEnd((e) => {
                            runOnJS(handleDragEnd)(e.x, e.y);
                        })}>
                            <View style={{ width: '100%', height: '100%' }}>
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.mainImage}
                                    resizeMode="contain"
                                />
                                {points.map((p, i) => {
                                    if (i > currentStep) return null;
                                    const isCurrent = i === currentStep;
                                    return (
                                        <React.Fragment key={i}>
                                            <DraggableDot
                                                initialX={p.x}
                                                initialY={p.y}
                                                color={isCurrent ? '#00D4FF' : 'rgba(255,255,255,0.4)'}
                                                size={isCurrent ? 8 : 4}
                                                onDragEnd={isCurrent ? handleDragEnd : undefined}
                                                enabled={isCurrent}
                                                scaleFactor={zoomLevel}
                                            />
                                            {isCurrent && <Crosshair x={p.x} y={p.y} />}
                                        </React.Fragment>
                                    );
                                })}
                            </View>
                        </GestureDetector>
                    </Animated.View>
                </GestureDetector>

                {/* Floating Helper */}
                {helperVisible && (
                    <View style={styles.helperFloater}>
                        <Pressable style={styles.closeHelper} onPress={() => setHelperVisible(false)}>
                            <Text style={styles.closeHelperText}>✕</Text>
                        </Pressable>
                        <Image
                            source={currentLandmark.image}
                            style={styles.helperImage}
                            resizeMode="contain"
                        />

                    </View>
                )}
                {!helperVisible && (
                    <Pressable style={styles.showHelpButton} onPress={() => setHelperVisible(true)}>
                        <Text style={styles.showHelpText}>Show Target</Text>
                    </Pressable>
                )}

                {/* Zoom Controls */}
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

            <View style={styles.footer}>
                <Pressable onPress={handlePrev} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </Pressable>

                <Pressable onPress={handleNext} style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>
                        {currentStep === SIDE_LANDMARKS.length - 1 ? 'Finish Analysis' : 'Next Point'}
                    </Text>
                </Pressable>
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
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#000',
        zIndex: 10,
    },
    stepText: { fontFamily: 'FiraCode-Regular', color: '#888', fontSize: 14 },
    landmarkName: { fontFamily: 'FiraCode-Bold', color: '#fff', fontSize: 20, marginTop: 4 },
    progressText: { fontFamily: 'FiraCode-Medium', color: '#00D4FF', fontSize: 14 },

    imageArea: { flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#000' },
    zoomContainer: { width: '100%', height: '100%' },
    mainImage: { width: '100%', height: '100%' },

    // Floating Helper (Webcam Style)
    helperFloater: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 180,
        height: 220,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#333',
        backgroundColor: '#000',
        overflow: 'hidden',
        zIndex: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
    helperImage: { width: '100%', flex: 1 },
    closeHelper: {
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 25,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeHelperText: { color: '#fff', fontSize: 12, fontFamily: 'FiraCode-Bold' },
    helperLabelContainer: {
        backgroundColor: '#111',
        paddingVertical: 6,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    helperLabel: { color: '#fff', fontSize: 10, fontFamily: 'FiraCode-Regular' },

    showHelpButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(50,50,50,0.9)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#555',
        zIndex: 20,
    },
    showHelpText: { color: '#fff', fontFamily: 'FiraCode-Medium', fontSize: 12 },

    zoomControls: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row',
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
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

    footer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#000',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#111',
    },
    backButton: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#222',
    },
    backButtonText: {
        color: '#fff',
        fontFamily: 'FiraCode-Medium',
        fontSize: 16,
    },
    primaryButton: {
        flex: 1,
        marginLeft: 20,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#00D4FF',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#000',
        fontFamily: 'FiraCode-Bold',
        fontSize: 16,
    },
    crosshairContainer: { position: 'absolute', width: 100, height: 100, justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 999 },
    crosshairCenter: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FF0000', borderWidth: 0 },
});
