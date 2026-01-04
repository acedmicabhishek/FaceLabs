import React from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

interface DraggableDotProps {
    initialX: number;
    initialY: number;
    color?: string;
    size?: number;
    onDragEnd?: (x: number, y: number) => void;
    label?: string;
    enabled?: boolean;
    scaleFactor?: number; 
}

const DraggableDot: React.FC<DraggableDotProps> = ({
    initialX,
    initialY,
    color = '#00D4FF', 
    size = 20,
    onDragEnd,
    enabled = true,
    scaleFactor = 1,
}) => {
    const x = useSharedValue(initialX);
    const y = useSharedValue(initialY);
    const scale = useSharedValue(1);

    
    React.useEffect(() => {
        x.value = initialX;
        y.value = initialY;
    }, [initialX, initialY]);

    const pan = Gesture.Pan()
        .enabled(enabled)
        .onStart(() => {
            scale.value = withSpring(1.5);
            
            
            

            
            
            
            
            
            

            
            
        })
        .onUpdate((event) => {
            
            const e = event as any;
            if (e.changeX !== undefined) {
                x.value += e.changeX / scaleFactor;
                y.value += e.changeY / scaleFactor;
            } else {
                
                
            }
        })
        .onEnd(() => {
            scale.value = withSpring(1);
            if (onDragEnd) {
                runOnJS(onDragEnd)(x.value, y.value);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: x.value - size / 2 },
                { translateY: y.value - size / 2 },
                { scale: scale.value },
            ],
        };
    });

    return (
        <GestureDetector gesture={pan}>
            <Animated.View style={[styles.dotContainer, { width: size, height: size }, animatedStyle]}>
                <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={size / 2}
                        fill={color}
                        stroke="white"
                        strokeWidth={2}
                    />
                </Svg>
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    dotContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        
        zIndex: 100,
    },
});

export default DraggableDot;
