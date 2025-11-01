import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

interface NetworkStatusBannerProps {
  isSyncing?: boolean;
}

export default function NetworkStatusBanner({
  isSyncing = false,
}: NetworkStatusBannerProps) {
  const { isOffline } = useNetworkStatus();
  const slideAnim = useRef(new Animated.Value(-60)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (isOffline || isSyncing) {
      // Smooth slide down with spring effect
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 9,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Smooth slide up
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -60,
          duration: 350,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 250,
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
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
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
