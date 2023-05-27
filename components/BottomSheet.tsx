import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { pins } from '../models/Pins';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

type BottomSheetProps = {
  children?: React.ReactNode;
};

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const BottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children }, ref) => {
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);
    const textOpacity = useSharedValue(0);

    const scrollTo = useCallback((destination: number) => {
      'worklet';
      active.value = destination !== 0;

      translateY.value = withSpring(destination, { damping: 50 });

      if (destination === 0) {
        textOpacity.value = withSpring(1);
      } else {
        textOpacity.value = withSpring(0);
      }
    }, []);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
      scrollTo,
      isActive,
    ]);

    const context = useSharedValue({ y: 0 });
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y;
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      })
      .onEnd(() => {
        if (translateY.value > -SCREEN_HEIGHT / 3) {
          scrollTo(0);
        } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
          scrollTo(MAX_TRANSLATE_Y);
        }
      });

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
        [25, 5],
        Extrapolate.CLAMP
      );

      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      };
    });

    const rTextStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
        [0, 1],
        Extrapolate.CLAMP
      );

      return {
        opacity,
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <View style={styles.line} />
          <Animated.Text style={[styles.text, rTextStyle]}> Results: {pins.getAllPins().length}</Animated.Text>
          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: 'grey',
    position: 'absolute',
    top: SCREEN_HEIGHT - 40,
    borderRadius: 25,
    elevation: 20,
    shadowColor: 'black',
    shadowOpacity: 5.5,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 4,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'black',
    alignSelf: 'center',
    marginVertical: 10,

    borderRadius: 5,
  },
  content: {
    flex: 1,
    padding: 20,
    elevation: 4,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 10.25,
    shadowRadius: 10
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 1,
    marginLeft: 1,
     
  },
});

export default BottomSheet;
