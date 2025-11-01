// Design System & Theme
export const colors = {
  // Primary
  primary: "#007AFF",
  primaryDark: "#0051D5",
  primaryLight: "#5AC8FA",

  // Status
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  info: "#5856D6",

  // Neutral
  background: "#F5F5F7",
  surface: "#FFFFFF",
  border: "#E5E5EA",

  // Text
  textPrimary: "#000000",
  textSecondary: "#8E8E93",
  textTertiary: "#C7C7CC",
  textInverse: "#FFFFFF",

  // Offline/Queue
  queueBackground: "#FFF9E6",
  queueBorder: "#FF9500",
  queueText: "#856404",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  round: 999,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 34,
  },
  h2: {
    fontSize: 24,
    fontWeight: "700" as const,
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 18,
  },
  captionBold: {
    fontSize: 13,
    fontWeight: "600" as const,
    lineHeight: 18,
  },
  small: {
    fontSize: 11,
    fontWeight: "400" as const,
    lineHeight: 14,
  },
};

export const shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const animations = {
  instant: 100,
  fast: 200,
  normal: 300,
  moderate: 400,
  slow: 500,
  slower: 600,
};

export const springConfig = {
  gentle: {
    friction: 10,
    tension: 50,
  },
  smooth: {
    friction: 9,
    tension: 70,
  },
  bouncy: {
    friction: 7,
    tension: 80,
  },
  snappy: {
    friction: 8,
    tension: 100,
  },
};

export const easingCurves = {
  // Material Design easing
  standard: [0.4, 0, 0.2, 1],
  accelerate: [0.4, 0, 1, 1],
  decelerate: [0, 0, 0.2, 1],
  // Custom smooth curves
  smooth: [0.25, 0.1, 0.25, 1],
  elastic: [0.68, -0.55, 0.265, 1.55],
};
