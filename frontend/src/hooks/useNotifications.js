import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { useAuth } from './useAuth';

const useNotificationsStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      socket: null,
      isConnected: false,
      connectionError: null,

      // Add a new notification
      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications]
        }));
      },

      // Mark a notification as read
      markAsRead: async (notificationId) => {
        try {
          await axios.post(`/api/notifications/${notificationId}/read`);
          set((state) => ({
            notifications: state.notifications.map((notification) =>
              notification.id === notificationId
                ? { ...notification, read: true }
                : notification
            )
          }));
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
      },

      // Clear all notifications
      clearAll: async () => {
        try {
          await axios.delete('/api/notifications');
          set({ notifications: [] });
        } catch (error) {
          console.error('Error clearing notifications:', error);
        }
      },

      // Initialize WebSocket connection
      initializeWebSocket: () => {
        const { token } = useAuth.getState();
        if (!token) return;

        const connectionId = Math.random().toString(36).substring(7);
        const ws = new WebSocket(
          `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${
            window.location.host
          }/api/ws/notifications/${connectionId}?token=${token}`
        );

        ws.onopen = () => {
          set({ isConnected: true, connectionError: null });
          // Start heartbeat
          const heartbeat = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'heartbeat' }));
            }
          }, 30000);
          ws._heartbeat = heartbeat;
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'heartbeat_ack') {
              return;
            }
            if (data.type === 'notification') {
              get().addNotification(data);
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };

        ws.onclose = () => {
          set({ isConnected: false });
          clearInterval(ws._heartbeat);
          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            if (useAuth.getState().isAuthenticated) {
              get().initializeWebSocket();
            }
          }, 5000);
        };

        ws.onerror = (error) => {
          set({ connectionError: 'WebSocket connection error' });
          console.error('WebSocket error:', error);
        };

        set({ socket: ws });
      },

      // Close WebSocket connection
      closeWebSocket: () => {
        const { socket } = get();
        if (socket) {
          socket.close();
          set({ socket: null, isConnected: false });
        }
      },

      // Fetch notifications from API
      fetchNotifications: async () => {
        try {
          const response = await axios.get('/api/notifications');
          set({ notifications: response.data });
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      },

      // Get unread notifications count
      getUnreadCount: () => {
        return get().notifications.filter(
          (notification) => !notification.read
        ).length;
      },
    }),
    {
      name: 'notifications-storage',
      getStorage: () => localStorage,
    }
  )
);

// Hook wrapper for the store
export const useNotifications = () => {
  const {
    notifications,
    isConnected,
    connectionError,
    addNotification,
    markAsRead,
    clearAll,
    initializeWebSocket,
    closeWebSocket,
    fetchNotifications,
    getUnreadCount,
  } = useNotificationsStore();

  return {
    notifications,
    isConnected,
    connectionError,
    addNotification,
    markAsRead,
    clearAll,
    initializeWebSocket,
    closeWebSocket,
    fetchNotifications,
    getUnreadCount,
  };
};

// Initialize notifications system
export const initializeNotifications = () => {
  const store = useNotificationsStore.getState();
  store.fetchNotifications();
  store.initializeWebSocket();
};

// Cleanup notifications system
export const cleanupNotifications = () => {
  const store = useNotificationsStore.getState();
  store.closeWebSocket();
};
