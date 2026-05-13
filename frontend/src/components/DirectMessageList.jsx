import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  avatar,
  avatarImage,
  emptyState,
  errorText,
  list,
  listItem,
  listItemMain,
  listItemMeta,
  listItemTitle,
  loading as loadingStyle,
  mutedText,
  roleBadge,
  statusDot,
  statusDotOnline,
  statusLine,
} from "../styles/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const requestConfig = { withCredentials: true };

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const getFullName = (user) => {
  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  return name || user?.email || "User";
};

const getInitials = (user) => {
  const first = user?.firstName?.trim()?.[0] || "";
  const last = user?.lastName?.trim()?.[0] || "";
  return `${first}${last}`.toUpperCase() || "U";
};

const getErrorMessage = (err) =>
  err?.response?.data?.error ||
  err?.response?.data?.message ||
  err?.message ||
  "Unable to load direct messages";

const formatTime = (value) => {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

function DirectMessageList({
  workspaceId,
  users: usersProp,
  conversations: conversationsProp,
  currentUser,
  selectedUser,
  onlineUsers = [],
  onSelectUser,
  onUsersLoaded,
  onConversationsLoaded,
}) {
  const [users, setUsers] = useState(usersProp || []);
  const [conversations, setConversations] = useState(conversationsProp || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentUserId = getId(currentUser) || currentUser?.id;
  const visibleUsers = usersProp || users;
  const visibleConversations = conversationsProp || conversations;

  const conversationMap = useMemo(() => {
    const map = new Map();

    visibleConversations.forEach((message) => {
      const senderId = getId(message.sender);
      const receiverId = getId(message.receiver);
      const otherUser =
        senderId === currentUserId ? message.receiver : message.sender;

      if (!otherUser) {
        return;
      }

      const otherUserId = getId(otherUser);
      const existing = map.get(otherUserId);
      const existingTime = existing ? new Date(existing.updatedAt).getTime() : 0;
      const nextTime = new Date(message.updatedAt || message.createdAt).getTime();

      if (!existing || nextTime > existingTime) {
        map.set(otherUserId, message);
      }

      if (!receiverId || !senderId) {
        return;
      }
    });

    return map;
  }, [currentUserId, visibleConversations]);

  const loadDirectData = useCallback(async () => {
    if (!workspaceId) {
      setUsers([]);
      setConversations([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [usersRes, conversationsRes] = await Promise.all([
        axios.get(`${BASE_URL}/dm-api/users/${workspaceId}`, requestConfig),
        axios.get(`${BASE_URL}/dm-api/conversations/${workspaceId}`, requestConfig),
      ]);

      const usersList = usersRes.data?.payload || [];
      const conversationsList = conversationsRes.data?.payload || [];

      setUsers(usersList);
      setConversations(conversationsList);
      onUsersLoaded?.(usersList);
      onConversationsLoaded?.(conversationsList);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [onConversationsLoaded, onUsersLoaded, workspaceId]);

  useEffect(() => {
    if (usersProp && conversationsProp) {
      return;
    }

    const timerId = setTimeout(() => {
      loadDirectData();
    }, 0);

    return () => clearTimeout(timerId);
  }, [conversationsProp, loadDirectData, usersProp]);

  if (loading) {
    return <div style={loadingStyle}>Loading direct messages...</div>;
  }

  return (
    <section>
      {error && <p style={errorText}>{error}</p>}

      {visibleUsers.length === 0 ? (
        <div style={emptyState}>No teammates are available for direct messages.</div>
      ) : (
        <div style={list}>
          {visibleUsers.map((user) => {
            const userId = getId(user);
            const conversation = conversationMap.get(userId);
            const isActive = getId(selectedUser) === userId;
            const isOnline = onlineUsers.includes(userId);

            return (
              <button
                key={userId}
                type="button"
                style={{
                  ...listItem,
                  borderColor: isActive ? "#611f69" : listItem.borderColor,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onClick={() => onSelectUser?.(user)}
              >
                <div style={avatar}>
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={getFullName(user)}
                      style={avatarImage}
                    />
                  ) : (
                    getInitials(user)
                  )}
                </div>

                <div style={listItemMain}>
                  <h3 style={listItemTitle}>{getFullName(user)}</h3>
                  <p style={listItemMeta}>
                    <span style={statusLine}>
                      <span style={isOnline ? statusDotOnline : statusDot} />
                      <span>{isOnline ? "Active now" : "Offline"}</span>
                    </span>
                  </p>
                  <p style={listItemMeta}>
                    {conversation?.content ||
                      conversation?.file?.fileName ||
                      user.email ||
                      "Start a direct message"}
                  </p>
                </div>

                {conversation ? (
                  <span style={mutedText}>
                    {formatTime(conversation.updatedAt || conversation.createdAt)}
                  </span>
                ) : (
                  <span style={roleBadge}>New</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default DirectMessageList;
