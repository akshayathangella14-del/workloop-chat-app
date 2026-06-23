import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, MessageSquare, AtSign, Clock, CheckCircle2 } from "lucide-react";
import EmptyState from "./EmptyState";
import { getPriorityStyle } from "../styles/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const requestConfig = { withCredentials: true };

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const formatTime = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const getNotificationIcon = (type) => {
  switch (type) {
    case "DIRECT_MESSAGE":
    case "CHANNEL_MESSAGE":
      return <MessageSquare size={18} color="#14B8A6" />;
    case "MENTION":
      return <AtSign size={18} color="#F59E0B" />;
    case "REMINDER":
      return <Clock size={18} color="#EF4444" />;
    default:
      return <Bell size={18} color="#3B82F6" />;
  }
};

function NotificationList({
  isOpen,
  onClose,
  notifications: notificationsProp,
  workspaceId,
  onNotificationsChange,
  onRefresh,
}) {
  const [notifications, setNotifications] = useState(notificationsProp || []);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL"); // ALL, MESSAGES, MENTIONS, REMINDERS
  const sourceNotifications = notificationsProp ?? notifications;
  
  const visibleNotifications = (
    workspaceId
      ? sourceNotifications.filter((item) => getId(item.workspace) === workspaceId)
      : sourceNotifications
  );

  const updateNotifications = useCallback((next) => {
    setNotifications(next);
    onNotificationsChange?.(next);
  }, [onNotificationsChange]);

  const loadNotifications = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      if (onRefresh) {
        const next = await onRefresh();
        if (Array.isArray(next)) updateNotifications(next);
        return;
      }
      if (notificationsProp) return;
      const res = await axios.get(`${BASE_URL}/notification-api/notifications`, requestConfig);
      updateNotifications(res.data?.payload || []);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [notificationsProp, onRefresh, updateNotifications]);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, loadNotifications]);

  const markAllAsRead = async () => {
    try {
      await axios.patch(`${BASE_URL}/notification-api/notifications/read`, {}, requestConfig);
      updateNotifications(sourceNotifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifications = visibleNotifications.filter(n => {
    if (filter === "ALL") return true;
    if (filter === "MESSAGES") return n.notificationType === "DIRECT_MESSAGE" || n.notificationType === "CHANNEL_MESSAGE";
    if (filter === "MENTIONS") return n.notificationType === "MENTION";
    if (filter === "REMINDERS") return n.notificationType === "REMINDER";
    return true;
  });

  const groupNotifications = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups = { Today: [], Yesterday: [], Earlier: [] };
    filteredNotifications.forEach(n => {
      const nDate = new Date(n.createdAt);
      nDate.setHours(0, 0, 0, 0);
      if (nDate.getTime() === today.getTime()) groups.Today.push(n);
      else if (nDate.getTime() === yesterday.getTime()) groups.Yesterday.push(n);
      else groups.Earlier.push(n);
    });
    return groups;
  };

  const groups = groupNotifications();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "#000",
              zIndex: 40,
            }}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "400px",
              backgroundColor: "#FFFFFF",
              boxShadow: "-10px 0 40px rgba(0,0,0,0.1)",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>Notifications</h2>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748B" }}>Stay on top of your workspace.</p>
              </div>
              <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: "16px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", gap: "12px", overflowX: "auto" }}>
              {["ALL", "MESSAGES", "MENTIONS", "REMINDERS"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "999px",
                    border: "none",
                    background: filter === f ? "#0F172A" : "#F1F5F9",
                    color: filter === f ? "#FFFFFF" : "#64748B",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {f.charAt(0) + f.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <div style={{ padding: "12px 24px", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={markAllAsRead}
                style={{ display: "flex", alignItems: "center", gap: "6px", border: "none", background: "transparent", color: "#14B8A6", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
              >
                <CheckCircle2 size={16} /> Mark all as read
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px" }}>
              {loading && visibleNotifications.length === 0 ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "#94A3B8" }}>Loading notifications...</div>
              ) : filteredNotifications.length === 0 ? (
                <EmptyState
                  icon={Bell}
                  title="You're all caught up!"
                  description="You have no new notifications in this category."
                />
              ) : (
                Object.entries(groups).map(([groupName, items]) => (
                  items.length > 0 && (
                    <div key={groupName} style={{ marginBottom: "24px" }}>
                      <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>{groupName}</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {items.map(n => (
                          <div
                            key={getId(n)}
                            style={{
                              padding: "16px",
                              borderRadius: "12px",
                              background: n.isRead ? "#FFFFFF" : "#F0FDFA",
                              border: `1px solid ${n.isRead ? "#E2E8F0" : "#CCFBF1"}`,
                              display: "flex",
                              gap: "14px",
                              transition: "all 0.2s",
                            }}
                          >
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: n.isRead ? "#F8FAFC" : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {getNotificationIcon(n.notificationType)}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontSize: "14px", color: "#0F172A", lineHeight: 1.5 }}>
                                {n.text}
                              </p>
                              <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#64748B", fontWeight: 500 }}>
                                {n.workspace?.workspaceName || "Workspace"}
                                {n.channel?.channelName ? ` • #${n.channel.channelName}` : ""}
                                {` • ${formatTime(n.createdAt)}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default NotificationList;
