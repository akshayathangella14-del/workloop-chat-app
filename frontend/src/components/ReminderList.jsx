import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  emptyState,
  errorText,
  getPriorityStyle,
  list,
  loading as loadingStyle,
  reminderAccent,
  reminderContent,
  reminderHeader,
  reminderItemHighlighted,
  reminderMeta,
  reminderTime,
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
  "Unable to load reminders";

const getFullName = (user) => {
  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  return name || user?.email || "User";
};

const getReminderLocation = (reminder, currentUserId) => {
  if (reminder.channel?.channelName) {
    return `#${reminder.channel.channelName}`;
  }

  if (reminder.receiver || reminder.sender) {
    const otherPerson =
      getId(reminder.receiver) === currentUserId ? reminder.sender : reminder.receiver;

    return `Direct message with ${getFullName(otherPerson)}`;
  }

  return "Workspace reminder";
};

const formatTime = (value) => {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

function ReminderList({
  reminders: remindersProp,
  workspaceId,
  currentUser,
  onRemindersChange,
  onRefresh,
  onViewed,
}) {
  const [reminders, setReminders] = useState(remindersProp || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const autoViewedRef = useRef("");
  const hasControlledReminders = Array.isArray(remindersProp);
  const visibleReminders = remindersProp ?? reminders;
  const currentUserId = getId(currentUser) || currentUser?.id;
  const filteredReminders = workspaceId
    ? visibleReminders.filter((item) => getId(item.workspace) === workspaceId)
    : visibleReminders;
  const viewedKey = `${workspaceId || "all"}-${filteredReminders.length}`;

  const updateReminders = useCallback(
    (nextReminders) => {
      setReminders(nextReminders);
      onRemindersChange?.(nextReminders);
    },
    [onRemindersChange]
  );

  const loadReminders = useCallback(async () => {
    if (onRefresh) {
      try {
        setLoading(true);
        setError("");
        const nextReminders = await onRefresh();

        if (!hasControlledReminders && Array.isArray(nextReminders)) {
          updateReminders(nextReminders);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (hasControlledReminders) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${BASE_URL}/message-api/reminders`, requestConfig);
      updateReminders(res.data?.payload || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [hasControlledReminders, onRefresh, updateReminders]);

useEffect(() => {
  if (hasControlledReminders) {
    return undefined;
  }

  loadReminders();

  const intervalId = setInterval(() => {
    loadReminders();
  }, 30000);

  return () => clearInterval(intervalId);
}, [hasControlledReminders, loadReminders]);

  const markReminderNotificationsRead = useCallback(async () => {
    if (onViewed) {
      await onViewed();
      return;
    }

    const res = await axios.get(`${BASE_URL}/notification-api/notifications`, requestConfig);
    const unreadReminderNotifications = (res.data?.payload || []).filter((notification) => {
      const isReminder = notification.notificationType === "REMINDER";
      const isSameWorkspace = !workspaceId || getId(notification.workspace) === workspaceId;

      return isReminder && isSameWorkspace && !notification.isRead;
    });

    await Promise.all(
      unreadReminderNotifications.map((notification) =>
        axios.patch(
          `${BASE_URL}/notification-api/notification/read`,
          { notificationId: getId(notification) },
          requestConfig
        )
      )
    );
  }, [onViewed, workspaceId]);

  // useEffect(() => {
  //   if (autoViewedRef.current === viewedKey) {
  //     return undefined;
  //   }

  //   autoViewedRef.current = viewedKey;

  //   const timerId = setTimeout(() => {
  //     markReminderNotificationsRead().catch(() => {});
  //   }, 350);

  //   return () => clearTimeout(timerId);
  // }, [markReminderNotificationsRead, viewedKey]);

  if (loading && filteredReminders.length === 0) {
    return <div style={loadingStyle}>Loading reminders...</div>;
  }

  return (
    <section>
      {loading && filteredReminders.length > 0 && (
        <p style={reminderMeta}>Refreshing reminders...</p>
      )}

      {error && <p style={errorText}>{error}</p>}

      {filteredReminders.length === 0 ? (
        <div style={emptyState}>No upcoming reminders.</div>
      ) : (
        <div style={list}>
          {filteredReminders.map((reminder) => (
            <article key={getId(reminder)} style={reminderItemHighlighted}>
              <span style={reminderAccent} />
              <div style={reminderHeader}>
                <div style={reminderTime}>{formatTime(reminder.reminderTime)}</div>
                <span style={getPriorityStyle(reminder.priority)}>
                  {reminder.priority || "LOW"}
                </span>
              </div>

              <p style={reminderContent}>{reminder.content || "Reminder message"}</p>

              <p style={reminderMeta}>
                {reminder.workspace?.workspaceName || "Current workspace"} -{" "}
                {getReminderLocation(reminder, currentUserId)}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ReminderList;
