import React, { useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";

interface AnimatedButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  icon?: string;
}

export default function AnimatedButton({
  title,
  loading = false,
  variant = "primary",
  icon,
  onPress,
  disabled,
  style,
  ...props
}: AnimatedButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return { bg: "#f0f0f0", text: "#333" };
      case "danger":
        return { bg: "#FF3B30", text: "#fff" };
      default:
        return { bg: "#007AFF", text: "#fff" };
    }
  };

  const { bg, text } = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      <Animated.View
        style={[
          styles.button,
          { backgroundColor: bg, transform: [{ scale: scaleAnim }] },
          (disabled || loading) && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={text} size="small" />
        ) : (
          <Text style={[styles.text, { color: text }]}>
            {icon && `${icon} `}
            {title}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});
