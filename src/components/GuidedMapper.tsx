import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions, ScrollView } from 'react-native';
import { FRONT_LANDMARKS, LandmarkDefinition } from '../constants/frontLandmarks';
import DraggableDot from './DraggableDot';
import { Point } from '../types';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface GuidedMapperProps {
    imageUri: string;
    points: Point[];
    onPointsUpdate: (points: Point[]) => void;
    onComplete: () => void;
}

const Crosshair = ({ x, y }: { x: number, y: number }) => (
    <View style={[styles.crosshairContainer, { left: x - 50, top: y - 50 }]}>
        <View style={styles.crosshairVertical} />
        <View style={styles.crosshairHorizontal} />
        <View style={styles.crosshairCenter} />
    </View>
);


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

export default function GuidedMapper({ imageUri, points, onPointsUpdate, onComplete }: GuidedMapperProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [helperVisible, setHelperVisible] = useState(true);
    const [layout, setLayout] = useState({ width: 0, height: 0 });

    const currentLandmark = FRONT_LANDMARKS[currentStep];

    
    useEffect(() => {
        if (points.length === 0 && layout.width > 0 && layout.height > 0) {
            
            
            
            const maskWidth = Math.min(layout.width * 0.8, 300); 
            const maskHeight = maskWidth * 1.33;

            const offsetX = (layout.width - maskWidth) / 2;
            const offsetY = (layout.height - maskHeight) / 2;

            const initialPoints = FRONT_LANDMARKS.map((l) => {
                const pos = FACE_MASK_POSITIONS[l.id] || { x: 0.5, y: 0.5 };
                return {
                    x: offsetX + (pos.x * maskWidth),
                    y: offsetY + (pos.y * maskHeight),
                    id: l.id,
                    name: l.name
                };
            });
            onPointsUpdate(initialPoints);
        }
    }, [layout, points.length]);

    const handleDragEnd = (x: number, y: number) => {
        const newPoints = [...points];

        
        newPoints[currentStep] = {
            x,
            y,
            id: currentLandmark.id,
            name: currentLandmark.name
        };

        onPointsUpdate(newPoints);
    };

    const handleNext = () => {
        if (currentStep < FRONT_LANDMARKS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.stepText}>
                    {currentStep + 1} of {FRONT_LANDMARKS.length}
                </Text>
                <Text style={styles.landmarkName}>{currentLandmark.name}</Text>
                <Text style={styles.progressText}>{Math.round(((currentStep + 1) / FRONT_LANDMARKS.length) * 100)}%</Text>
            </View>

            <View style={styles.contentContainer}>
                {/* Main Image Area */}
                <GestureDetector gesture={Gesture.Tap().onEnd((e) => {
                    
                    runOnJS(handleDragEnd)(e.x, e.y);
                })}>
                    <View
                        style={styles.imageArea}
                        onLayout={(e) => setLayout(e.nativeEvent.layout)}
                    >
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.mainImage}
                            resizeMode="contain"
                        />

                        {/* Only render points that are current or past */
                            points.length > 0 && points.map((p, i) => {
                                if (i > currentStep) return null; 

                                const isCurrent = i === currentStep;
                                return (
                                    <React.Fragment key={i}>
                                        <DraggableDot
                                            initialX={p.x}
                                            initialY={p.y}
                                            color={isCurrent ? '#00D4FF' : 'rgba(255,255,255,0.5)'}
                                            size={isCurrent ? 15 : 8}
                                            onDragEnd={isCurrent ? handleDragEnd : undefined}
                                            enabled={isCurrent}
                                        />
                                        {isCurrent && <Crosshair x={p.x} y={p.y} />}
                                    </React.Fragment>
                                );
                            })}
                    </View>
                </GestureDetector>

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
                        <Text style={styles.helperHint}>
                            Drag the blue dot to match the red dot in the diagram.
                        </Text>
                    </View>
                )}
            </View>

            {/* Footer Controls */}
            <View style={styles.footer}>
                <Pressable onPress={handlePrev} style={styles.navButton}>
                    <Text style={styles.navText}>Back</Text>
                </Pressable>

                <Pressable onPress={() => setHelperVisible(!helperVisible)} style={styles.toggleButton}>
                    <Text style={styles.navText}>{helperVisible ? 'Hide Help' : 'Show Help'}</Text>
                </Pressable>

                <Pressable onPress={handleNext} style={[styles.navButton, styles.primaryButton]}>
                    <Text style={styles.primaryText}>
                        {currentStep === FRONT_LANDMARKS.length - 1 ? 'Finish' : 'Next'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#111',
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    stepText: {
        color: '#666',
        fontSize: 12,
    },
    landmarkName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressText: {
        color: '#00D4FF',
        fontSize: 12,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    imageArea: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#000',
        overflow: 'hidden',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    helperPanel: {
        width: 150,
        backgroundColor: '#1a1a1a',
        borderLeftWidth: 1,
        borderLeftColor: '#333',
        padding: 10,
        justifyContent: 'flex-start',
    },
    helperHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    helperTitle: {
        color: '#ccc',
        fontWeight: 'bold',
    },
    helperImage: {
        width: '100%',
        height: 120, 
        marginBottom: 10,
        backgroundColor: '#000',
        borderRadius: 8,
    },
    helperHint: {
        color: '#888',
        fontSize: 10,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#111',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#222',
    },
    toggleButton: {
        padding: 10,
    },
    navText: {
        color: '#fff',
        fontWeight: '600',
    },
    primaryButton: {
        backgroundColor: '#00D4FF',
    },
    primaryText: {
        color: '#000',
        fontWeight: 'bold',
    },
    crosshairContainer: {
        position: 'absolute',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 999,
    },
    crosshairVertical: {
        position: 'absolute',
        width: 2,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    crosshairHorizontal: {
        position: 'absolute',
        width: 40,
        height: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    crosshairCenter: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF0000',
        borderWidth: 1,
        borderColor: '#fff',
    },
});
