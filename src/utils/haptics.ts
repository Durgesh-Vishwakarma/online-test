/**
 * Provides visual and interaction feedback utilities
 * Can be extended with expo-haptics for haptic feedback
 */

/**
 * Timing utilities for smooth animations
 */
export const animationTiming = {
  /**
   * Debounce function to prevent rapid repeated calls
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * Throttle function to limit call frequency
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle = false;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Delay execution
   */
  delay: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
};

/**
 * Interaction feedback constants
 */
export const feedback = {
  // Visual feedback durations
  pressHighlight: 100,
  rippleEffect: 300,
  toastDuration: 2500,
  tooltipDuration: 1500,

  // Animation delays
  staggerDelay: 60,
  cascadeDelay: 80,
  sequenceDelay: 100,
};
