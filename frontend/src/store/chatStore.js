import { create } from "zustand";
import axios from "axios";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const requestConfig = { withCredentials: true };

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const initialChatState = {
  workspaces: [],
  currentWorkspace: null,
  channels: [],
  currentChannel: null,
  directUsers: [],
  currentDirectUser: null,
  conversations: [],
  messages: [],
  threadReplies: [],
  reminders: [],
  notifications: [],
  onlineUsers: [],
  socket: null,
  loading: false,
  saving: false,
  error: null,
};

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.error ||
  err?.response?.data?.message ||
  err?.message ||
  fallback;

const upsertById = (list, item) => {
  const itemId = getId(item);

  if (!itemId) {
    return list;
  }

  const exists = list.some((existingItem) => getId(existingItem) === itemId);

  if (!exists) {
    return [...list, item];
  }

  return list.map((existingItem) =>
    getId(existingItem) === itemId ? item : existingItem
  );
};

const sortByTimeAsc = (list) =>
  [...list].sort(
    (a, b) =>
      new Date(a.createdAt || a.updatedAt || 0).getTime() -
      new Date(b.createdAt || b.updatedAt || 0).getTime()
  );

const buildFilePayload = (messageObj) => {
  if (messageObj instanceof FormData) {
    return messageObj;
  }

  const formData = new FormData();

  Object.entries(messageObj || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });

  return formData;
};

export const useChat = create((set, get) => ({
  ...initialChatState,

  clearError: () => set({ error: null }),

  setCurrentWorkspace: (workspace) =>
    set({
      currentWorkspace: workspace,
      currentChannel: null,
      currentDirectUser: null,
      messages: [],
      error: null,
    }),

  setCurrentChannel: (channel) =>
    set({ currentChannel: channel, currentDirectUser: null, messages: [], error: null }),

  setCurrentDirectUser: (user) =>
    set({ currentDirectUser: user, currentChannel: null, messages: [], error: null }),

  resetChat: () => {
    get().disconnectSocket();
    set({ ...initialChatState });
  },

  fetchWorkspaces: async () => {
    try {
      set({ loading: true, error: null });

      const res = await api.get("/workspace-api/workspaces");
      const workspaces = res.data?.payload || [];

      set((state) => ({
        workspaces,
        currentWorkspace:
          state.currentWorkspace || (workspaces.length > 0 ? workspaces[0] : null),
        loading: false,
      }));

      return workspaces;
    } catch (err) {
      set({ loading: false, error: getErrorMessage(err, "Unable to load workspaces") });
      return [];
    }
  },

  fetchWorkspace: async (workspaceId) => {
    try {
      set({ loading: true, error: null });

      const res = await api.get(`/workspace-api/workspace/${workspaceId}`);
      const workspace = res.data?.payload || null;

      set((state) => ({
        currentWorkspace: workspace,
        workspaces: workspace ? upsertById(state.workspaces, workspace) : state.workspaces,
        loading: false,
      }));

      return workspace;
    } catch (err) {
      set({ loading: false, error: getErrorMessage(err, "Unable to load workspace") });
      return null;
    }
  },

  createWorkspace: async (workspaceObj) => {
    try {
      set({ saving: true, error: null });

      const res = await api.post("/workspace-api/workspaces", workspaceObj);
      const workspace = res.data?.payload;

      set((state) => ({
        workspaces: workspace ? upsertById(state.workspaces, workspace) : state.workspaces,
        currentWorkspace: workspace || state.currentWorkspace,
        saving: false,
      }));

      return workspace;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to create workspace") });
      return null;
    }
  },

  addWorkspaceMember: async (memberObj) => {
    try {
      set({ saving: true, error: null });

      const res = await api.put("/workspace-api/workspace/member", memberObj);
      const workspace = res.data?.payload;

      set((state) => ({
        currentWorkspace: workspace || state.currentWorkspace,
        workspaces: workspace ? upsertById(state.workspaces, workspace) : state.workspaces,
        saving: false,
      }));

      return workspace;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to add workspace member") });
      return null;
    }
  },

  updateWorkspaceStatus: async (statusObj) => {
    try {
      set({ saving: true, error: null });

      const res = await api.patch("/workspace-api/workspace/status", statusObj);
      const workspace = res.data?.payload;

      set((state) => ({
        workspaces: statusObj.isWorkspaceActive
          ? upsertById(state.workspaces, workspace)
          : state.workspaces.filter((item) => getId(item) !== getId(workspace)),
        currentWorkspace:
          getId(state.currentWorkspace) === getId(workspace) && !statusObj.isWorkspaceActive
            ? null
            : state.currentWorkspace,
        saving: false,
      }));

      return workspace;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to update workspace") });
      return null;
    }
  },

  fetchChannels: async (workspaceId = getId(get().currentWorkspace)) => {
    try {
      set({ loading: true, error: null });

      if (!workspaceId) {
        set({ channels: [], loading: false });
        return [];
      }

      const res = await api.get(`/channel-api/channels/${workspaceId}`);
      const channels = res.data?.payload || [];

      set({ channels, loading: false });
      return channels;
    } catch (err) {
      set({ loading: false, error: getErrorMessage(err, "Unable to load channels") });
      return [];
    }
  },

  fetchChannel: async (channelId) => {
    try {
      set({ loading: true, error: null });

      const res = await api.get(`/channel-api/channel/${channelId}`);
      const channel = res.data?.payload || null;

      set((state) => ({
        currentChannel: channel,
        channels: channel ? upsertById(state.channels, channel) : state.channels,
        loading: false,
      }));

      return channel;
    } catch (err) {
      set({ loading: false, error: getErrorMessage(err, "Unable to load channel") });
      return null;
    }
  },

  createChannel: async (channelObj) => {
    try {
      set({ saving: true, error: null });

      const res = await api.post("/channel-api/channels", channelObj);
      const channel = res.data?.payload;

      set((state) => ({
        channels: channel ? upsertById(state.channels, channel) : state.channels,
        currentChannel: channel || state.currentChannel,
        saving: false,
      }));

      return channel;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to create channel") });
      return null;
    }
  },

  addChannelMember: async (memberObj) => {
    try {
      set({ saving: true, error: null });

      const res = await api.put("/channel-api/channel/member", memberObj);
      const channel = res.data?.payload;

      set((state) => ({
        currentChannel: getId(state.currentChannel) === getId(channel) ? channel : state.currentChannel,
        channels: channel ? upsertById(state.channels, channel) : state.channels,
        saving: false,
      }));

      return channel;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to add channel member") });
      return null;
    }
  },

  leaveChannel: async (channelId) => {
    try {
      set({ saving: true, error: null });

      const res = await api.patch("/channel-api/channel/leave", { channelId });
      const channel = res.data?.payload;

      set((state) => ({
        channels: state.channels.filter((item) => getId(item) !== getId(channel)),
        currentChannel: getId(state.currentChannel) === getId(channel) ? null : state.currentChannel,
        saving: false,
      }));

      return channel;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to leave channel") });
      return null;
    }
  },

  updateChannelStatus: async (statusObj) => {
    try {
      set({ saving: true, error: null });

      const res = await api.patch("/channel-api/channel/status", statusObj);
      const channel = res.data?.payload;

      set((state) => ({
        channels: statusObj.isChannelActive
          ? upsertById(state.channels, channel)
          : state.channels.filter((item) => getId(item) !== getId(channel)),
        currentChannel:
          getId(state.currentChannel) === getId(channel) && !statusObj.isChannelActive
            ? null
            : state.currentChannel,
        saving: false,
      }));

      return channel;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to update channel") });
      return null;
    }
  },

  fetchDirectUsers: async (workspaceId = getId(get().currentWorkspace)) => {
    try {
      set({ loading: true, error: null });

      if (!workspaceId) {
        set({ directUsers: [], loading: false });
        return [];
      }

      const res = await api.get(`/dm-api/users/${workspaceId}`);
      const directUsers = res.data?.payload || [];

      set({ directUsers, loading: false });
      return directUsers;
    } catch (err) {
      set({ loading: false, error: getErrorMessage(err, "Unable to load direct message users") });
      return [];
    }
  },

  fetchConversations: async (workspaceId = getId(get().currentWorkspace)) => {
    try {
      set({ loading: true, error: null });

      if (!workspaceId) {
        set({ conversations: [], loading: false });
        return [];
      }

      const res = await api.get(`/dm-api/conversations/${workspaceId}`);
      const conversations = res.data?.payload || [];

      set({ conversations, loading: false });
      return conversations;
    } catch (err) {
      set({ loading: false, error: getErrorMessage(err, "Unable to load conversations") });
      return [];
    }
  },

  fetchChannelMessages: async (channelId = getId(get().currentChannel)) => {
    try {
      set({ loading: true, error: null });

      if (!channelId) {
        set({ messages: [], loading: false });
        return [];
      }

      const res = await api.get(`/message-api/channel-messages/${channelId}`);
      const messages = res.data?.payload || [];

      set({ messages, loading: false });
      return messages;
    } catch (err) {
      set({ loading: false, error: getErrorMessage(err, "Unable to load messages") });
      return [];
    }
  },

  fetchDirectMessages: async (
    workspaceId = getId(get().currentWorkspace),
    receiverId = getId(get().currentDirectUser)
  ) => {
    try {
      set({ loading: true, error: null });

      if (!workspaceId || !receiverId) {
        set({ messages: [], loading: false });
        return [];
      }

      const res = await api.get(`/dm-api/messages/${workspaceId}/${receiverId}`);
      const messages = res.data?.payload || [];

      set({ messages, loading: false });
      return messages;
    } catch (err) {
      set({ loading: false, error: getErrorMessage(err, "Unable to load direct messages") });
      return [];
    }
  },

  sendChannelMessage: async (messageObj) => {
    try {
      set({ saving: true, error: null });

      const res = await api.post("/message-api/channel-message", messageObj);
      const message = res.data?.payload;

      set((state) => ({
        messages: message ? sortByTimeAsc(upsertById(state.messages, message)) : state.messages,
        saving: false,
      }));

      return message;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to send message") });
      return null;
    }
  },

  sendDirectMessage: async (messageObj) => {
    try {
      set({ saving: true, error: null });

      const res = await api.post("/message-api/direct-message", messageObj);
      const message = res.data?.payload;

      set((state) => ({
        messages: message ? sortByTimeAsc(upsertById(state.messages, message)) : state.messages,
        conversations: message ? upsertById(state.conversations, message) : state.conversations,
        saving: false,
      }));

      return message;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to send direct message") });
      return null;
    }
  },

  sendFileMessage: async (messageObj) => {
    try {
      set({ saving: true, error: null });

      const res = await axios.post(`${BASE_URL}/message-api/file-message`, buildFilePayload(messageObj), {
        ...requestConfig,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const message = res.data?.payload;

      set((state) => ({
        messages: message ? sortByTimeAsc(upsertById(state.messages, message)) : state.messages,
        saving: false,
      }));

      get().emitFileShared(message);
      return message;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to share file") });
      return null;
    }
  },

  editMessage: async (messageId, content) => {
    try {
      set({ saving: true, error: null });

      const res = await api.put("/message-api/message", { messageId, content });
      const message = res.data?.payload;

      set((state) => ({
        messages: message ? upsertById(state.messages, message) : state.messages,
        saving: false,
      }));

      return message;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to edit message") });
      return null;
    }
  },

  updateReaction: async (messageId, reaction) => {
    try {
      set({ saving: true, error: null });

      const res = await api.put("/message-api/message/reaction", { messageId, reaction });
      const message = res.data?.payload;

      set((state) => ({
        messages: message ? upsertById(state.messages, message) : state.messages,
        saving: false,
      }));

      return message;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to update reaction") });
      return null;
    }
  },

  removeReaction: async (messageId) => {
    try {
      set({ saving: true, error: null });

      const res = await api.patch("/message-api/message/reaction", { messageId });
      const message = res.data?.payload;

      set((state) => ({
        messages: message ? upsertById(state.messages, message) : state.messages,
        saving: false,
      }));

      return message;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to remove reaction") });
      return null;
    }
  },

  addThreadReply: async (messageId, content) => {
    try {
      set({ saving: true, error: null });

      const res = await api.put("/message-api/message/thread", { messageId, content });
      const message = res.data?.payload;

      set((state) => ({
        messages: message ? upsertById(state.messages, message) : state.messages,
        threadReplies: message?.threadReplies || state.threadReplies,
        saving: false,
      }));

      return message;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to add thread reply") });
      return null;
    }
  },

  fetchThreadReplies: async (messageId) => {
    try {
      set({ loading: true, error: null });

      const res = await api.get(`/message-api/message/thread/${messageId}`);
      const threadReplies = res.data?.payload || [];

      set({ threadReplies, loading: false });
      return threadReplies;
    } catch (err) {
      set({ loading: false, error: getErrorMessage(err, "Unable to load thread replies") });
      return [];
    }
  },

  updateMessageStatus: async (messageId, isMessageActive) => {
    try {
      set({ saving: true, error: null });

      const res = await api.patch("/message-api/message/status", {
        messageId,
        isMessageActive,
      });
      const message = res.data?.payload;

      set((state) => ({
        messages: message ? upsertById(state.messages, message) : state.messages,
        saving: false,
      }));

      return message;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to update message") });
      return null;
    }
  },

  fetchReminders: async () => {
    try {
      set({ loading: true, error: null });

      const res = await api.get("/message-api/reminders");
      const reminders = res.data?.payload || [];

      set({ reminders, loading: false });
      return reminders;
    } catch (err) {
      set({ loading: false, error: getErrorMessage(err, "Unable to load reminders") });
      return [];
    }
  },

  fetchNotifications: async () => {
    try {
      set({ loading: true, error: null });

      const res = await api.get("/notification-api/notifications");
      const notifications = res.data?.payload || [];

      set({ notifications, loading: false });
      return notifications;
    } catch (err) {
      set({ loading: false, error: getErrorMessage(err, "Unable to load notifications") });
      return [];
    }
  },

  markNotificationRead: async (notificationId) => {
    try {
      set({ saving: true, error: null });

      const res = await api.patch("/notification-api/notification/read", { notificationId });
      const notification = res.data?.payload;

      set((state) => ({
        notifications: notification
          ? upsertById(state.notifications, notification)
          : state.notifications,
        saving: false,
      }));

      return notification;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to update notification") });
      return null;
    }
  },

  markAllNotificationsRead: async () => {
    try {
      set({ saving: true, error: null });

      await api.patch("/notification-api/notifications/read", {});

      set((state) => ({
        notifications: state.notifications.map((item) => ({ ...item, isRead: true })),
        saving: false,
      }));

      return true;
    } catch (err) {
      set({ saving: false, error: getErrorMessage(err, "Unable to update notifications") });
      return false;
    }
  },

  connectSocket: () => {
    const existingSocket = get().socket;

    if (existingSocket?.connected) {
      return existingSocket;
    }

    if (existingSocket) {
      existingSocket.disconnect();
    }

    const socket = io(BASE_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    const mergeMessage = (data) => {
      const message = data?.payload;
      if (!message) return;

      set((state) => ({
        messages: sortByTimeAsc(upsertById(state.messages, message)),
      }));
    };

    socket.on("connect_error", (err) => {
      set({ error: err.message || "Socket connection failed" });
    });

    socket.on("socket-error", (data) => {
      set({ error: data?.error || data?.message || "Socket error" });
    });

    socket.on("user-online", (data) => {
      const userId = data?.payload?.userId;
      if (!userId) return;

      set((state) => ({
        onlineUsers: state.onlineUsers.includes(userId)
          ? state.onlineUsers
          : [...state.onlineUsers, userId],
      }));
    });

    socket.on("user-offline", (data) => {
      const userId = data?.payload?.userId;
      if (!userId) return;

      set((state) => ({
        onlineUsers: state.onlineUsers.filter((item) => item !== userId),
      }));
    });

    socket.on("receive-message", mergeMessage);
    socket.on("receive-file", mergeMessage);
    socket.on("message-edited", mergeMessage);
    socket.on("reaction-added", mergeMessage);
    socket.on("reaction-removed", mergeMessage);
    socket.on("thread-reply-added", mergeMessage);

    socket.on("new-notification", (data) => {
      const notification = data?.payload;
      if (!notification) return;

      set((state) => ({ notifications: [notification, ...state.notifications] }));
    });

    set({ socket });
    return socket;
  },

  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      socket.disconnect();
    }

    set({ socket: null, onlineUsers: [] });
  },

  joinWorkspace: (workspaceId) => {
    const socket = get().socket || get().connectSocket();
    socket.emit("join-workspace", workspaceId);
  },

  joinChannel: (channelId) => {
    const socket = get().socket || get().connectSocket();
    socket.emit("join-channel", channelId);
  },

  joinDirectMessage: (receiverId) => {
    const socket = get().socket || get().connectSocket();
    socket.emit("join-direct-message", receiverId);
  },

  sendSocketMessage: (messageObj) => {
    const socket = get().socket || get().connectSocket();
    socket.emit("send-message", messageObj);
  },

  editSocketMessage: (messageId, content) => {
    const socket = get().socket || get().connectSocket();
    socket.emit("edit-message", { messageId, content });
  },

  addSocketReaction: (messageId, reaction) => {
    const socket = get().socket || get().connectSocket();
    socket.emit("add-reaction", { messageId, reaction });
  },

  removeSocketReaction: (messageId) => {
    const socket = get().socket || get().connectSocket();
    socket.emit("remove-reaction", { messageId });
  },

  addSocketThreadReply: (messageId, content) => {
    const socket = get().socket || get().connectSocket();
    socket.emit("thread-reply", { messageId, content });
  },

  emitFileShared: (messageObj) => {
    if (!messageObj) return;

    const socket = get().socket;
    if (socket?.connected) {
      socket.emit("file-shared", messageObj);
    }
  },
}));
