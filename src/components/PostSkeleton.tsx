import React from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

export default function PostSkeleton() {
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    // Shimmer effect (left to right sweep)
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: true,
      })
    ).start();

    // Subtle pulse effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-350, 350],
  });

  return (
    <View style={styles.container}>
      <View style={styles.skeletonWrapper}>
        <Animated.View style={[styles.author, { opacity: pulseAnim }]} />
        <Animated.View style={[styles.content, { opacity: pulseAnim }]} />
        <Animated.View style={[styles.contentShort, { opacity: pulseAnim }]} />
        <Animated.View style={[styles.time, { opacity: pulseAnim }]} />
        
        {/* Shimmer overlay */}
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skeletonWrapper: {
    position: "relative",
    overflow: "hidden",
  },
  author: {
    height: 16,
    width: 150,
    backgroundColor: "#E8E8E8",
    borderRadius: 4,
    marginBottom: 10,
  },
  content: {
    height: 14,
    backgroundColor: "#E8E8E8",
    borderRadius: 4,
    marginBottom: 8,
  },
  contentShort: {
    height: 14,
    width: "70%",
    backgroundColor: "#E8E8E8",
    borderRadius: 4,
    marginBottom: 10,
  },
  time: {
    height: 12,
    width: 100,
    backgroundColor: "#E8E8E8",
    borderRadius: 4,
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    width: 100,
  },
});
