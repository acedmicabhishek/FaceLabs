import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { FRONT_LANDMARKS } from '../constants/frontLandmarks';
import DraggableDot from './DraggableDot';
import { Point } from '../types';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

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

// Positions are now normalized (0 to 1) relative to the IMAGE, not the screen
const FACE_MASK_POSITIONS: { [key: number]: Point } = {
    1: { x: 0.50, y: 0.20 },
    2: { x: 0.35, y: 0.45 },
    3: { x: 0.65, y: 0.45 },
    4: { x: 0.45, y: 0.58 },
    5: { x: 0.55, y: 0.58 },
    6: { x: 0.50, y: 0.78 },
    7: { x: 0.50, y: 0.90 },
    8: { x: 0.15, y: 0.50 },
    9: { x: 0.85, y: 0.50 },
    10: { x: 0.20, y: 0.35 },
    11: { x: 0.80, y: 0.35 },
    12: { x: 0.40, y: 0.45 },
    13: { x: 0.30, y: 0.45 },
    14: { x: 0.35, y: 0.42 },
    15: { x: 0.35, y: 0.48 },
    16: { x: 0.28, y: 0.42 },
    17: { x: 0.42, y: 0.38 },
    18: { x: 0.40, y: 0.39 },
    19: { x: 0.35, y: 0.35 },
    20: { x: 0.30, y: 0.36 },
    21: { x: 0.25, y: 0.38 },
    22: { x: 0.35, y: 0.40 },
    23: { x: 0.60, y: 0.45 },
    24: { x: 0.70, y: 0.45 },
    25: { x: 0.65, y: 0.42 },
    26: { x: 0.65, y: 0.48 },
    27: { x: 0.72, y: 0.42 },
    28: { x: 0.58, y: 0.38 },
    29: { x: 0.60, y: 0.39 },
    30: { x: 0.65, y: 0.35 },
    31: { x: 0.70, y: 0.36 },
    32: { x: 0.75, y: 0.38 },
    33: { x: 0.65, y: 0.40 },
    34: { x: 0.50, y: 0.55 },
    35: { x: 0.50, y: 0.60 },
    36: { x: 0.46, y: 0.50 },
    37: { x: 0.54, y: 0.50 },
    38: { x: 0.40, y: 0.72 },
    39: { x: 0.60, y: 0.72 },
    40: { x: 0.50, y: 0.70 },
    41: { x: 0.50, y: 0.72 },
    42: { x: 0.50, y: 0.75 },
    43: { x: 0.20, y: 0.65 },
    44: { x: 0.80, y: 0.65 },
    45: { x: 0.22, y: 0.75 },
    46: { x: 0.78, y: 0.75 },
    47: { x: 0.45, y: 0.88 },
    48: { x: 0.55, y: 0.88 },
    49: { x: 0.30, y: 0.85 },
    50: { x: 0.70, y: 0.85 },
    51: { x: 0.30, y: 0.60 },
    52: { x: 0.70, y: 0.60 },
};

export default function GuidedMapperFront({ imageUri, points, onPointsUpdate, onComplete }: GuidedMapperProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [helperVisible, setHelperVisible] = useState(true);
    const [containerLayout, setContainerLayout] = useState<{ width: number; height: number } | null>(null);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

    // Zoom state
    const [zoomLevel, setZoomLevel] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

    const currentLandmark = FRONT_LANDMARKS[currentStep];

    // 1. Get Actual Image Dimensions (once)
    useEffect(() => {
        if (imageUri) {
            Image.getSize(imageUri, (w, h) => {
                setImageDimensions({ width: w, height: h });
            }, (error) => {
                console.error("Failed to get image size", error);
            });
        }
    }, [imageUri]);


    // 2. Calculate Rendered Image Rect (The "Sticky" Logic)
    // This tells us exactly where the image is inside the container (accounting for letterboxing)
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


    // 3. Initialize Points (Normalize them to Image coordinates 0-1)
    useEffect(() => {
        // Only initialize if we have dimensions and no points yet
        if (points.length === 0 && renderedRect) {

            const initialPoints = FRONT_LANDMARKS.map((l) => {
                // Use default normalized positions (0.0 - 1.0)
                const pos = FACE_MASK_POSITIONS[l.id] || { x: 0.5, y: 0.5 };

                // Convert Normalized -> Screen Coordinates
                const screenX = renderedRect.x + (pos.x * renderedRect.width);
                const screenY = renderedRect.y + (pos.y * renderedRect.height);

                return {
                    x: screenX,
                    y: screenY,
                    id: l.id,
                    name: l.name,
                    // Store normalized position for resizing re-calc
                    normalizedX: pos.x,
                    normalizedY: pos.y
                };
            });
            onPointsUpdate(initialPoints);
        }
    }, [renderedRect, points.length]);

    // 4. Re-Project Points when Resize Happens
    // If window resizes, renderedRect changes. We must re-calculate screen X/Y from normalized X/Y.
    useEffect(() => {
        if (points.length > 0 && renderedRect) {
            const needsUpdate = points.some(p => {
                // Check if current screen pos matches what it should be
                if (p.normalizedX === undefined) return true; // Old point style

                const expectedX = renderedRect.x + ((p.normalizedX ?? 0.5) * renderedRect.width);
                const expectedY = renderedRect.y + ((p.normalizedY ?? 0.5) * renderedRect.height);

                // Allow small float tolerance
                return Math.abs(p.x - expectedX) > 1 || Math.abs(p.y - expectedY) > 1;
            });

            if (needsUpdate) {
                const updatedPoints = points.map(p => {
                    // Start with existing normalized pos if available, else derive it (migrations)
                    let normX = p.normalizedX;
                    let normY = p.normalizedY;

                    // If we don't have normalized (fresh load/bug), calculate it from old screen pos (approx)
                    // This creates a self-healing effect if layout shifts unexpectedly
                    if (normX === undefined || normY === undefined) {
                        // We can't perfectly recover if layout changed since save, but we try best effort or default
                        // For now, let's assume if it's missing we just default (or we could store it in types)
                        // Ideally we update types.ts to include normalizedX/Y but for now we put it in the object at runtime
                        normX = 0.5;
                        normY = 0.5;
                    }

                    return {
                        ...p,
                        x: renderedRect.x + (normX * renderedRect.width),
                        y: renderedRect.y + (normY * renderedRect.height)
                    };
                });
                onPointsUpdate(updatedPoints);
            }
        }
    }, [renderedRect]); // Re-run when layout changes


    const handleDragEnd = (newScreenX: number, newScreenY: number) => {
        if (!renderedRect) return;

        // Convert Screen -> Normalized (0-1)
        // Clamp to image bounds
        const relativeX = newScreenX - renderedRect.x;
        const relativeY = newScreenY - renderedRect.y;

        let normX = relativeX / renderedRect.width;
        let normY = relativeY / renderedRect.height;

        // Clamp 0-1
        normX = Math.max(0, Math.min(1, normX));
        normY = Math.max(0, Math.min(1, normY));

        // Re-calculate pure screen X/Y from checked normalized coords
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


    // --- Zoom Logic (Same as before but standard) ---
    useEffect(() => {
        if (zoomLevel === 1) setPanOffset({ x: 0, y: 0 });
    }, [zoomLevel]);

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


    // --- Navigation ---
    const handleNext = () => {
        if (currentStep < FRONT_LANDMARKS.length - 1) setCurrentStep(currentStep + 1);
        else onComplete();
    };
    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.stepText}>{currentStep + 1} of {FRONT_LANDMARKS.length}</Text>
                <Text style={styles.landmarkName}>{currentLandmark.name}</Text>
                <Text style={styles.progressText}>{Math.round(((currentStep + 1) / FRONT_LANDMARKS.length) * 100)}%</Text>
            </View>

            <View style={styles.contentContainer}>
                {/* Main Image Area */}
                <View
                    style={styles.imageArea}
                    onLayout={(e) => setContainerLayout(e.nativeEvent.layout)}
                >
                    <GestureDetector gesture={Gesture.Exclusive(
                        Gesture.Tap().numberOfTaps(2).onEnd((e) => {
                            runOnJS(setZoomLevel)((prev) => {
                                const newZoom = prev >= 4 ? 1 : prev * 2;
                                if (newZoom === 1) runOnJS(setPanOffset)({ x: 0, y: 0 });
                                return newZoom;
                            });
                        }),
                        panGesture
                    )}>
                        <View style={[
                            styles.zoomContainer,
                            {
                                transform: [
                                    { scale: zoomLevel },
                                    { translateX: panOffset.x / zoomLevel },
                                    { translateY: panOffset.y / zoomLevel }
                                ]
                            }
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
                                                    color={isCurrent ? '#00D4FF' : 'rgba(255,255,255,0.5)'}
                                                    size={isCurrent ? (8 / zoomLevel) : (4 / zoomLevel)}
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
                        </View>
                    </GestureDetector>

                    {/* Simple Scrollbar Visuals (Optional/Simplified) */}

                    {/* Zoom Controls */}
                    <View style={styles.zoomControls}>
                        <Text style={styles.zoomLabel}>Zoom Level</Text>
                        <View style={styles.zoomButtons}>
                            {[1, 2, 4].map((z) => (
                                <Pressable
                                    key={z}
                                    style={[styles.zoomButton, zoomLevel === z && styles.activeZoom]}
                                    onPress={() => setZoomLevel(z)}
                                >
                                    <Text style={[styles.zoomText, zoomLevel === z && styles.activeZoomText]}>{z}x</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Helper Panel */}
                {helperVisible && (
                    <View style={styles.helperPanel}>
                        <View style={styles.helperHeader}>
                            <Text style={styles.helperTitle}>Target</Text>
                            <Pressable onPress={() => setHelperVisible(false)}>
                                <Text style={{ color: '#666' }}>✕</Text>
                            </Pressable>
                        </View>
                        <Image
                            source={currentLandmark.image}
                            style={styles.helperImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.helperHint}>Drag the blue dot to match the red dot in the diagram.</Text>
                    </View>
                )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Pressable onPress={handlePrev} style={styles.navButton}><Text style={styles.navText}>Back</Text></Pressable>
                <Pressable onPress={() => setHelperVisible(!helperVisible)} style={styles.toggleButton}>
                    <Text style={styles.navText}>{helperVisible ? 'Hide Help' : 'Show Help'}</Text>
                </Pressable>

                <Pressable onPress={handleNext} style={[styles.navButton, styles.primaryButton]}>
                    <Text style={styles.primaryText}>{currentStep === FRONT_LANDMARKS.length - 1 ? 'Finish' : 'Next'}</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#111', borderBottomWidth: 1, borderBottomColor: '#222' },
    stepText: { color: '#666', fontSize: 12 },
    landmarkName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    progressText: { color: '#00D4FF', fontSize: 12 },
    contentContainer: { flex: 1, flexDirection: 'row' },
    imageArea: { flex: 1, position: 'relative', backgroundColor: '#000', overflow: 'hidden' },
    zoomContainer: { width: '100%', height: '100%' },
    mainImage: { width: '100%', height: '100%' },
    helperPanel: { width: 150, backgroundColor: '#1a1a1a', borderLeftWidth: 1, borderLeftColor: '#333', padding: 10, justifyContent: 'flex-start' },
    helperHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    helperTitle: { color: '#ccc', fontWeight: 'bold' },
    helperImage: { width: '100%', height: 120, marginBottom: 10, backgroundColor: '#000', borderRadius: 8 },
    helperHint: { color: '#888', fontSize: 10, textAlign: 'center' },
    footer: { flexDirection: 'row', padding: 16, backgroundColor: '#111', justifyContent: 'space-between', alignItems: 'center' },
    navButton: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#222' },
    toggleButton: { padding: 10 },
    navText: { color: '#fff', fontWeight: '600' },
    primaryButton: { backgroundColor: '#00D4FF' },
    primaryText: { color: '#000', fontWeight: 'bold' },
    zoomControls: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#111', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: '#333' },
    zoomLabel: { color: '#666', fontSize: 10, marginBottom: 4, textAlign: 'center' },
    zoomButtons: { flexDirection: 'row', gap: 8 },
    zoomButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4, backgroundColor: '#222', minWidth: 40, alignItems: 'center' },
    activeZoom: { backgroundColor: '#00D4FF' },
    zoomText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    activeZoomText: { color: '#000' },
    crosshairContainer: { position: 'absolute', width: 100, height: 100, justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 999 },
    crosshairCenter: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FF0000', borderWidth: 0 },
    scrollbarHorizontalBack: { position: 'absolute', height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 },
    scrollbarVerticalBack: { position: 'absolute', width: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 },
    scrollbarThumb: { backgroundColor: 'rgba(0, 212, 255, 0.7)', borderRadius: 2 },
});
