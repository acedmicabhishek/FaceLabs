import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';

interface MagnifierProps {
    x: SharedValue<number>;
    y: SharedValue<number>;
    active: SharedValue<boolean>;
    imageUri?: string; 
}






const Magnifier: React.FC<MagnifierProps> = ({ x, y, active }) => {
    const style = useAnimatedStyle(() => {
        return {
            opacity: active.value ? 1 : 0,
            transform: [
                { translateX: x.value - 40 }, 
                { translateY: y.value - 80 }, 
                { scale: active.value ? 1 : 0 }
            ],
        };
    });

    return (
        <Animated.View style={[styles.container, style]}>
            <View style={styles.reticle} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#00D4FF',
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        overflow: 'hidden',
    },
    reticle: {
        width: 4,
        height: 4,
        backgroundColor: '#00D4FF',
        borderRadius: 2,
    }
});

export default Magnifier;
