import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  emptyState,
  errorText,
  list,
  loading as loadingStyle,
  notificationItem,
  notificationText,
  notificationType,
  notificationUnread,
} from "../styles/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const requestConfig = { withCredentials: true };

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const getErrorMessage = (err) =>
  err?.response?.data?.error ||
  err?.response?.data?.message ||
  err?.message ||
  "Unable to load notifications";

const formatTime = (value) => {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

function NotificationList({
  notifications: notificationsProp,
  workspaceId,
  onNotificationsChange,
  onRefresh,
}) {
  const [notifications, setNotifications] = useState(notificationsProp || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const autoReadKeyRef = useRef("");
  const sourceNotifications = notificationsProp ?? notifications;
  const visibleNotifications = (
    workspaceId
      ? sourceNotifications.filter(
        (item) =>
          getId(item.workspace) === workspaceId
      )
      : sourceNotifications
  ).filter((item) => !item.isRead);
  const visibleUnreadKey = visibleNotifications
    .filter((item) => !item.isRead)
    .map((item) => getId(item))
    .join("|");

  const updateNotifications = useCallback(
    (nextNotifications) => {
      setNotifications(nextNotifications);
      onNotificationsChange?.(nextNotifications);
    },
    [onNotificationsChange]
  );

  const loadNotifications = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (!silent) {
          setLoading(true);
        }
        setError("");

        if (onRefresh) {
          const nextNotifications = await onRefresh();

          if (Array.isArray(nextNotifications)) {
            updateNotifications(nextNotifications);
          }
          return;
        }

        if (notificationsProp) {
          return;
        }

        const res = await axios.get(
          `${BASE_URL}/notification-api/notifications`,
          requestConfig
        );

        updateNotifications(res.data?.payload || []);
      } catch (err) {
        if (!silent) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [notificationsProp, onRefresh, updateNotifications]
  );

  useEffect(() => {
    const timerId = setTimeout(() => {
      loadNotifications();
    }, 0);
    const intervalId = setInterval(() => {
      loadNotifications({ silent: true });
    }, 15000);

    return () => {
      clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, [loadNotifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      setError("");

      await axios.patch(
        `${BASE_URL}/notification-api/notifications/read`,
        {},
        requestConfig
      );

      updateNotifications(sourceNotifications.map((item) => ({ ...item, isRead: true })));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, [sourceNotifications, updateNotifications]);

  // useEffect(() => {
  //   if (!visibleUnreadKey || autoReadKeyRef.current === visibleUnreadKey) {
  //     return undefined;
  //   }

  //   autoReadKeyRef.current = visibleUnreadKey;

  //   const timerId =
  //     setTimeout(() => {
  //       markAllAsRead();
  //     }, 5000);



  //   return () => clearTimeout(timerId);
  // }, [markAllAsRead, visibleUnreadKey]);

  if (loading) {
    return <div style={loadingStyle}>Loading notifications...</div>;
  }

  return (
    <section>

      {visibleNotifications.some(
        (notification) => !notification.isRead
      ) && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "14px",
            }}
          >
            <button
              type="button"
              onClick={markAllAsRead}
              style={{
                border: "none",
                borderRadius: "8px",
                padding: "8px 12px",
                backgroundColor: "#611f69",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Mark all as read
            </button>
          </div>
        )}


      {error && <p style={errorText}>{error}</p>}

      {visibleNotifications.length === 0 ? (
        <div style={emptyState}>No notifications yet.</div>
      ) : (
        <div style={list}>
          {visibleNotifications.map((notification) => {
            const notificationId = getId(notification);

            return (
              <article
                key={notificationId}
                style={notification.isRead ? notificationItem : notificationUnread}
              >
                <div>
                  <div style={notificationType}>{notification.notificationType}</div>
                  <p style={notificationText}>{notification.text}</p>
                  <p style={notificationText}>
                    {notification.workspace?.workspaceName || "Current workspace"}
                    {notification.channel?.channelName
                      ? ` - #${notification.channel.channelName}`
                      : ""}
                    {notification.message?.content
                      ? ` - ${notification.message.content}`
                      : ""}
                    {notification.createdAt
                      ? ` - ${formatTime(notification.createdAt)}`
                      : ""}
                  </p>
                </div>

                {!notification.isRead && <span style={notificationType}>New</span>}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default NotificationList;
