import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Alert,
  Keyboard,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabase";
import { Post } from "../types";
import PostSkeleton from "../components/PostSkeleton";
import AnimatedPostCard from "../components/AnimatedPostCard";
import AnimatedButton from "../components/AnimatedButton";
import NetworkStatusBanner from "../components/NetworkStatusBanner";
import SuccessToast from "../components/SuccessToast";
import AnimatedModal from "../components/AnimatedModal";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { OfflineQueueManager, QueuedPost } from "../utils/offlineQueue";
import { colors, spacing, borderRadius, typography } from "../theme";

interface FeedScreenProps {
  onLogout: () => void;
}

const POSTS_PER_PAGE = 10;

export default function FeedScreen({ onLogout }: FeedScreenProps) {
  const [page, setPage] = useState(0);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<QueuedPost[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const queryClient = useQueryClient();
  const { isOffline } = useNetworkStatus();

  // Load offline queue on mount
  useEffect(() => {
    loadOfflineQueue();
  }, []);

  // Sync queue when coming back online
  useEffect(() => {
    if (!isOffline && offlineQueue.length > 0) {
      syncOfflineQueue();
    }
  }, [isOffline]);

  const loadOfflineQueue = async () => {
    const queue = await OfflineQueueManager.getQueue();
    setOfflineQueue(queue);
  };

  const syncOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;

    setIsSyncing(true);
    for (const queuedPost of offlineQueue) {
      try {
        await supabase.from("posts").insert([
          {
            content: queuedPost.content,
            author_email: queuedPost.author_email,
            user_id: queuedPost.user_id,
          },
        ]);
        await OfflineQueueManager.removeFromQueue(queuedPost.id);
      } catch (error) {
        console.error("Failed to sync post:", error);
      }
    }
    await loadOfflineQueue();
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    setIsSyncing(false);
  };

  // Fetch posts with pagination
  const {
    data: posts = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["posts", page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .range(page * POSTS_PER_PAGE, (page + 1) * POSTS_PER_PAGE - 1);

      if (error) throw error;
      return data as Post[];
    },
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
  });

  // Create post mutation with optimistic update
  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            content,
            author_email: user.email,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data as Post;
    },
    onMutate: async (content: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts", 0] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(["posts", 0]);

      // Optimistically update to the new value
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const optimisticPost: Post = {
        id: "temp-" + Date.now(),
        content,
        author_email: user?.email || "",
        user_id: user?.id || "",
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData(["posts", 0], (old: Post[] = []) => [
        optimisticPost,
        ...old,
      ]);

      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts", 0], context.previousPosts);
      }
      Alert.alert("Error", "Failed to create post");
    },
    onSuccess: () => {
      // Refetch to get the real data
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsCreateModalVisible(false);
      setNewPostContent("");
      setToastMessage("Post created successfully!");
      setShowSuccessToast(true);
    },
  });

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert("Error", "Post content cannot be empty");
      return;
    }

    if (isOffline) {
      // Queue post for later sync
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert("Error", "Not authenticated");
        return;
      }

      const queuedPost = await OfflineQueueManager.addToQueue({
        content: newPostContent.trim(),
        author_email: user.email || "",
        user_id: user.id,
        created_at: new Date().toISOString(),
      });

      await loadOfflineQueue();
      setIsCreateModalVisible(false);
      setNewPostContent("");
      setToastMessage("Post queued for sync!");
      setShowSuccessToast(true);
    } else {
      createPostMutation.mutate(newPostContent.trim());
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const loadMore = useCallback(() => {
    if (!isFetching && posts.length === POSTS_PER_PAGE * (page + 1)) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, posts.length, page]);

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      Alert.alert("Success", "Post deleted!");
    } catch (error) {
      Alert.alert("Error", "Failed to delete post");
    }
  };

  const renderPost = ({ item, index }: { item: Post; index: number }) => (
    <AnimatedPostCard
      item={item}
      index={index}
      onDelete={item.user_id ? handleDeletePost : undefined}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <NetworkStatusBanner isSyncing={isSyncing} />
      <Text style={styles.headerTitle}>Community Feed</Text>
      {offlineQueue.length > 0 && (
        <View style={styles.queueInfo}>
          <Text style={styles.queueInfoText}>
            📮 {offlineQueue.length} post{offlineQueue.length > 1 ? "s" : ""}{" "}
            queued
          </Text>
        </View>
      )}
      <View style={styles.headerButtons}>
        <AnimatedButton
          title="+ New Post"
          icon="✍️"
          onPress={() => setIsCreateModalVisible(true)}
          style={styles.createButton}
        />
        <AnimatedButton
          title="Logout"
          variant="danger"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isFetching) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  if (isLoading && posts.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.listContent}>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load posts</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No posts yet</Text>
      <Text style={styles.emptyStateText}>
        Be the first to share something with the community!
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => setIsCreateModalVisible(true)}
      >
        <Text style={styles.emptyStateButtonText}>Create First Post</Text>
      </TouchableOpacity>
    </View>
  );

  // Merge queued posts with fetched posts
  const allPosts = [...offlineQueue, ...posts];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <SuccessToast
          message={toastMessage}
          visible={showSuccessToast}
          onHide={() => setShowSuccessToast(false)}
        />
        {renderHeader()}
        <FlatList
          data={allPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && page === 0}
              onRefresh={() => {
                setPage(0);
                refetch();
              }}
              tintColor="#007AFF"
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!isLoading ? renderEmptyState : null}
          contentContainerStyle={
            posts.length === 0 ? styles.emptyListContent : styles.listContent
          }
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
        />

        <AnimatedModal
          visible={isCreateModalVisible}
          onClose={() => {
            setIsCreateModalVisible(false);
            setNewPostContent("");
          }}
        >
          <Text style={styles.modalTitle}>Create New Post</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="What's on your mind?"
            value={newPostContent}
            onChangeText={setNewPostContent}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setIsCreateModalVisible(false);
                setNewPostContent("");
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.postButton,
                createPostMutation.isPending && styles.buttonDisabled,
              ]}
              onPress={handleCreatePost}
              disabled={createPostMutation.isPending}
            >
              {createPostMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.postButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </AnimatedModal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  createButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  postCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  postButton: {
    backgroundColor: "#007AFF",
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyListContent: {
    flex: 1,
  },
  queueInfo: {
    backgroundColor: "#FFF3CD",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#FF9500",
  },
  queueInfoText: {
    color: "#856404",
    fontSize: 13,
    fontWeight: "600",
  },
});
