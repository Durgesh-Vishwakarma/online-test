import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Easing } from "react-native";

interface PullToRefreshIndicatorProps {
  refreshing: boolean;
}

export default function PullToRefreshIndicator({
  refreshing,
}: PullToRefreshIndicatorProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (refreshing) {
      // Continuous rotation with smooth scaling pulse
      Animated.loop(
        Animated.parallel([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.15,
              duration: 600,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 600,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      rotateAnim.setValue(0);
      scaleAnim.setValue(1);
    }
  }, [refreshing]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ rotate: spin }, { scale: scaleAnim }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#007AFF",
    borderTopColor: "transparent",
  },
});
