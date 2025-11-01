import React from "react";
import { View, StyleSheet, Animated } from "react-native";

export default function PostSkeleton() {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.author, { opacity }]} />
      <Animated.View style={[styles.content, { opacity }]} />
      <Animated.View style={[styles.contentShort, { opacity }]} />
      <Animated.View style={[styles.time, { opacity }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  author: {
    height: 16,
    width: 150,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 8,
  },
  content: {
    height: 14,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 6,
  },
  contentShort: {
    height: 14,
    width: "70%",
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 8,
  },
  time: {
    height: 12,
    width: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
});
