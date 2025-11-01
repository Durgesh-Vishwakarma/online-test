import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

interface NetworkStatusBannerProps {
  isSyncing?: boolean;
}

export default function NetworkStatusBanner({
  isSyncing = false,
}: NetworkStatusBannerProps) {
  const { isOffline } = useNetworkStatus();
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOffline || isSyncing) {
      // Slide down and fade in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide up and fade out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOffline, isSyncing]);

  if (!isOffline && !isSyncing) return null;

  const getStatusInfo = () => {
    if (isSyncing) {
      return { text: "⚡ Syncing...", color: "#FF9500" };
    }
    if (isOffline) {
      return {
        text: "📡 Offline - Posts will sync when online",
        color: "#FF3B30",
      };
    }
    return { text: "✅ Online", color: "#34C759" };
  };

  const { text, color } = getStatusInfo();

  return (
    <Animated.View
      style={[
        styles.banner,
        { backgroundColor: color },
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
