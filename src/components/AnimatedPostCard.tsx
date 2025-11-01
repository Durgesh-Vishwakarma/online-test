import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Alert,
  Easing,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Post } from "../types";

interface AnimatedPostCardProps {
  item: Post;
  index: number;
  onDelete?: (postId: string) => void;
}

export default function AnimatedPostCard({
  item,
  index,
  onDelete,
}: AnimatedPostCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Smooth staggered animation with better easing
    const delay = Math.min(index * 60, 500); // Cap delay at 500ms

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Smooth cubic-bezier
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay,
        friction: 9,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderRightActions = () => {
    if (!onDelete) return null;

    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => onDelete(item.id),
              },
            ]
          );
        }}
      >
        <Text style={styles.deleteText}>🗑️ Delete</Text>
      </TouchableOpacity>
    );
  };

  const postCard = (
    <Animated.View
      style={[
        styles.postCard,
        item.id.startsWith("offline-") && styles.queuedPost,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      {item.id.startsWith("offline-") && (
        <View style={styles.queuedBadge}>
          <Text style={styles.queuedText}>⏳ Queued</Text>
        </View>
      )}
      <Text style={styles.postAuthor}>{item.author_email}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      <Text style={styles.postTime}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </Animated.View>
  );

  if (!onDelete) {
    return postCard;
  }

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      {postCard}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  queuedPost: {
    backgroundColor: "#FFF9E6",
    borderLeftWidth: 4,
    borderLeftColor: "#FF9500",
  },
  queuedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF9500",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  queuedText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#007AFF",
  },
  postContent: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
    lineHeight: 22,
  },
  postTime: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginBottom: 12,
    borderRadius: 12,
    marginLeft: 8,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
