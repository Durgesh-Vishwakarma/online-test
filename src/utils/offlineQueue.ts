import AsyncStorage from "@react-native-async-storage/async-storage";

const OFFLINE_QUEUE_KEY = "offline_post_queue";

export interface QueuedPost {
  id: string;
  content: string;
  author_email: string;
  user_id: string;
  created_at: string;
  isQueued: boolean;
}

export const OfflineQueueManager = {
  // Add post to offline queue
  async addToQueue(
    post: Omit<QueuedPost, "id" | "isQueued">
  ): Promise<QueuedPost> {
    const queuedPost: QueuedPost = {
      ...post,
      id: `offline-${Date.now()}`,
      isQueued: true,
    };

    const queue = await this.getQueue();
    queue.push(queuedPost);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));

    return queuedPost;
  },

  // Get all queued posts
  async getQueue(): Promise<QueuedPost[]> {
    try {
      const queueJson = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
      return queueJson ? JSON.parse(queueJson) : [];
    } catch (error) {
      console.error("Error reading queue:", error);
      return [];
    }
  },

  // Remove post from queue
  async removeFromQueue(postId: string): Promise<void> {
    const queue = await this.getQueue();
    const updatedQueue = queue.filter((post) => post.id !== postId);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updatedQueue));
  },

  // Clear entire queue
  async clearQueue(): Promise<void> {
    await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
  },

  // Get queue count
  async getQueueCount(): Promise<number> {
    const queue = await this.getQueue();
    return queue.length;
  },
};
