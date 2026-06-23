import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useChat } from "../store/chatStore";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceMembers from "./WorkspaceMembers";
import WorkspaceSidebar from "./WorkspaceSidebar";
import ChannelScreen from "./ChannelScreen";
import DirectMessageScreen from "./DirectMessageScreen";
import NotificationList from "./NotificationList";
import ReminderList from "./ReminderList";
import ActivityFeed from "./ActivityFeed";
import { Users, Hash, MessageSquare, Plus, BellRing } from "lucide-react";
import {
  card,
  contentArea,
  dashboard,
  dashboardChat,
  dashboardGrid,
  emptyState,
  errorText,
  form,
  formGroup,
  getPriorityStyle,
  input,
  label,
  list,
  listItem,
  listItemMain,
  listItemMeta,
  listItemTitle,
  loading as loadingStyle,
  mutedText,
  primaryBtn,
  reminderItem,
  reminderTime,
  sectionSubtitle,
  sectionTitle,
  select,
  successText,
  textarea,
  workspaceShell,
} from "../styles/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const requestConfig = { withCredentials: true };

const initialWorkspaceForm = {
  workspaceName: "",
  description: "",
};

const initialChannelForm = {
  channelName: "",
  description: "",
  channelType: "PUBLIC",
};

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};


const getErrorMessage = (err) =>
  err?.response?.data?.error ||
  err?.response?.data?.message ||
  err?.message ||
  "Something went wrong";

const formatDate = (value) => {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};


const isFutureReminder = (
  message,
  currentUserId
) => {
  if (!message?.reminderTime) {
    return false;
  }

  if (message.isMessageActive === false) {
    return false;
  }

  const senderId =
    typeof message.sender === "object"
      ? message.sender?._id
      : message.sender;

  // Sender should not see reminder
  if (senderId === currentUserId) {
    return false;
  }

  // Hide expired reminders
  const reminderDate = new Date(
    message.reminderTime
  );

  if (reminderDate.getTime() < Date.now()) {
    return false;
  }

  return true;
};




const sortReminders = (reminderList) =>
  [...reminderList].sort(
    (a, b) =>
      new Date(a.reminderTime || 0).getTime() -
      new Date(b.reminderTime || 0).getTime()
  );

const mergeById = (items) => {
  const itemMap = new Map();

  items.forEach((item) => {
    const itemId = getId(item);
    if (itemId) {
      itemMap.set(itemId, item);
    }
  });

  return Array.from(itemMap.values());
};

const readSettledPayloads = (results) =>
  results.flatMap((result) =>
    result.status === "fulfilled" ? result.value.data?.payload || [] : []
  );

const fetchRelevantReminders = async (workspaceId, channelList = [], userList = [], currentUserId = "") => {
  if (!workspaceId) {
    return [];
  }


  const reminderRequests = [
    axios.get(
      `${BASE_URL}/message-api/reminders`,
      requestConfig
    ),
  ];


  const results = await Promise.allSettled(reminderRequests);
  const reminderMessages = readSettledPayloads(results);

  return sortReminders(
    mergeById(reminderMessages).filter(
      (message) =>
        getId(message.workspace) === workspaceId &&
        isFutureReminder(
          message,
          currentUserId
        )
    )

  );
};

function WorkspaceDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { onlineUsers, connectSocket, disconnectSocket, joinWorkspace } = useChat();
  const [currentUser, setCurrentUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [channels, setChannels] = useState([]);
  const [directUsers, setDirectUsers] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeView, setActiveView] = useState("overview");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [workspaceForm, setWorkspaceForm] = useState(initialWorkspaceForm);
  const [channelForm, setChannelForm] = useState(initialChannelForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const workspaceReminders = useMemo(
    () =>
      reminders.filter(
        (reminder) => getId(reminder.workspace) === getId(selectedWorkspace)
      ),
    [reminders, selectedWorkspace]
  );

  const workspaceNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) => getId(notification.workspace) === getId(selectedWorkspace)
      ),
    [notifications, selectedWorkspace]
  );

  const currentUserId = getId(currentUser);
  const visibleOnlineUsers = useMemo(() => {
    const users = new Set(onlineUsers);

    if (currentUserId) {
      users.add(currentUserId);
    }

    return Array.from(users);
  }, [currentUserId, onlineUsers]);

  const loadWorkspaces = useCallback(async () => {
    const res = await axios.get(`${BASE_URL}/workspace-api/workspaces`, requestConfig);
    const listData = res.data?.payload || [];

    setWorkspaces(listData);
    setSelectedWorkspaceId((prev) => {
      if (!prev && listData.length > 0) {
        return getId(listData[0]);
      }

      if (prev && !listData.some((item) => getId(item) === prev)) {
        return getId(listData[0]) || "";
      }

      return prev;
    });
  }, []);

  const loadNotifications = useCallback(async () => {
    const res = await axios.get(
      `${BASE_URL}/notification-api/notifications`,
      requestConfig
    );
    const listData = res.data?.payload || [];

    setNotifications((prev) => {
      const merged = [...prev];

      listData.forEach((item) => {
        const exists = merged.some(
          (existing) =>
            getId(existing) === getId(item)
        );

        if (!exists) {
          merged.unshift(item);
        } else {
          const index = merged.findIndex(
            (existing) =>
              getId(existing) === getId(item)
          );

          merged[index] = item;
        }
      });

      return merged;
    });

    return listData;
  }, []);

  const loadWorkspaceReminders = useCallback(
    async (workspaceId, channelList = [], userList = []) => {
      if (!workspaceId) {
        setReminders([]);
        return [];
      }

      const listData = await fetchRelevantReminders(
        workspaceId,
        channelList,
        userList,
        currentUserId
      );

      setReminders(listData);

      return listData;
    },
    []
  );

  const loadWorkspaceDetails = useCallback(async (workspaceId) => {
    if (!workspaceId) {
      setSelectedWorkspace(null);
      setChannels([]);
      setDirectUsers([]);
      setReminders([]);
      return;
    }

    const [workspaceRes, channelsRes, usersRes] = await Promise.all([
      axios.get(`${BASE_URL}/workspace-api/workspace/${workspaceId}`, requestConfig),
      axios.get(`${BASE_URL}/channel-api/channels/${workspaceId}`, requestConfig),
      axios.get(`${BASE_URL}/dm-api/users/${workspaceId}`, requestConfig),
    ]);
    const workspaceData = workspaceRes.data?.payload || null;
    const channelsData = channelsRes.data?.payload || [];
    const usersData = usersRes.data?.payload || [];

    setSelectedWorkspace(workspaceData);
    setChannels(channelsData);
    setDirectUsers(usersData);

    await Promise.all([
      loadWorkspaceReminders(workspaceId, channelsData, usersData),
      loadNotifications(),
    ]);
  }, [loadNotifications, loadWorkspaceReminders]);

  const markNotificationsRead = useCallback(
    async (filterNotifications) => {
      const unreadNotifications = notifications.filter(
        (notification) =>
          !notification.isRead &&
          (!filterNotifications || filterNotifications(notification))
      );
      const unreadIds = unreadNotifications.map((notification) => getId(notification));

      if (unreadIds.length === 0) {
        return;
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          unreadIds.includes(getId(notification))
            ? { ...notification, isRead: true }
            : notification
        )
      );

      try {
        await Promise.all(
          unreadIds.map((notificationId) =>
            axios.patch(
              `${BASE_URL}/notification-api/notification/read`,
              { notificationId },
              requestConfig
            )
          )
        );
      } catch {
        loadNotifications().catch(() => { });
      }
    },
    [loadNotifications, notifications]
  );

  const markWorkspaceNotificationsRead = useCallback(
    () =>
      markNotificationsRead(
        (notification) => getId(notification.workspace) === getId(selectedWorkspace)
      ),
    [markNotificationsRead, selectedWorkspace]
  );

  const markWorkspaceReminderNotificationsRead = useCallback(
    () =>
      markNotificationsRead(
        (notification) =>
          notification.notificationType === "REMINDER" &&
          getId(notification.workspace) === getId(selectedWorkspace)
      ),
    [markNotificationsRead, selectedWorkspace]
  );

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const authRes = await axios.get(`${BASE_URL}/auth/check-auth`, requestConfig);
      setCurrentUser(authRes.data?.payload || null);

      await loadWorkspaces();
      await loadNotifications();
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [loadNotifications, loadWorkspaces, navigate]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      loadAllData();
    }, 0);

    return () => clearTimeout(timerId);
  }, [loadAllData]);

  useEffect(() => {
    if (!currentUser) {
      return undefined;
    }

    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, currentUser, disconnectSocket]);

  useEffect(() => {
    if (!currentUser || !selectedWorkspaceId) {
      return;
    }

    joinWorkspace(selectedWorkspaceId);
  }, [currentUser, joinWorkspace, selectedWorkspaceId]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      const loadSelectedWorkspace = async () => {
        try {
          setError("");
          await loadWorkspaceDetails(selectedWorkspaceId);
        } catch (err) {
          setError(getErrorMessage(err));
        }
      };

      loadSelectedWorkspace();
    }, 0);

    return () => clearTimeout(timerId);
  }, [loadWorkspaceDetails, selectedWorkspaceId]);

  useEffect(() => {
    if (!selectedWorkspaceId) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      loadNotifications().catch(() => { });
      loadWorkspaceReminders(selectedWorkspaceId, channels, directUsers).catch(() => { });
    }, 15000);

    return () => clearInterval(intervalId);
  }, [
    channels,
    directUsers,
    loadNotifications,
    loadWorkspaceReminders,
    selectedWorkspaceId,
  ]);

  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const timerId = setTimeout(() => {
      setSuccess("");
    }, 3200);

    return () => clearTimeout(timerId);
  }, [success]);

  const handleSelectWorkspace = (workspace) => {
    setSelectedWorkspaceId(getId(workspace));
    setSelectedChannel(null);
    setSelectedUser(null);
    setActiveView("overview");
    setSuccess("");
    setError("");
  };

  const handleLogout = async () => {
    disconnectSocket();
    await logout();
    navigate("/login", { replace: true });
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();

    if (!workspaceForm.workspaceName.trim()) {
      setError("Workspace name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await axios.post(
        `${BASE_URL}/workspace-api/workspaces`,
        {
          workspaceName: workspaceForm.workspaceName.trim(),
          description: workspaceForm.description.trim(),
        },
        requestConfig
      );

      setWorkspaceForm(initialWorkspaceForm);
      setSuccess("Workspace created successfully");
      setSelectedWorkspaceId(getId(res.data?.payload));
      await loadWorkspaces();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();

    if (!selectedWorkspace) {
      setError("Select a workspace first");
      return;
    }

    if (!channelForm.channelName.trim()) {
      setError("Channel name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await axios.post(
        `${BASE_URL}/channel-api/channels`,
        {
          workspace: getId(selectedWorkspace),
          channelName: channelForm.channelName.trim(),
          description: channelForm.description.trim(),
          channelType: channelForm.channelType,
        },
        requestConfig
      );

      setChannelForm(initialChannelForm);
      setSuccess("Channel created successfully");
      setSelectedChannel(res.data?.payload || null);
      setActiveView("channel");
      await loadWorkspaceDetails(getId(selectedWorkspace));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const renderWorkspaceForm = () => (
    <section style={card}>
      <h2 style={sectionTitle}>Create workspace</h2>
      <p style={sectionSubtitle}>Start a new team space with channels and members.</p>

      <form style={form} onSubmit={handleCreateWorkspace}>
        <div style={formGroup}>
          <label style={label} htmlFor="workspaceName">
            Workspace name
          </label>
          <input
            id="workspaceName"
            value={workspaceForm.workspaceName}
            onChange={(e) =>
              setWorkspaceForm((prev) => ({
                ...prev,
                workspaceName: e.target.value,
              }))
            }
            placeholder="Team Workspace"
            style={input}
          />
        </div>

        <div style={formGroup}>
          <label style={label} htmlFor="workspaceDescription">
            Description
          </label>
          <textarea
            id="workspaceDescription"
            value={workspaceForm.description}
            onChange={(e) =>
              setWorkspaceForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="What this workspace is for"
            style={textarea}
          />
        </div>

        <button type="submit" style={primaryBtn} disabled={saving}>
          {saving ? "Creating..." : "Create workspace"}
        </button>
      </form>
    </section>
  );

  const renderChannelForm = () => {
    const templates = [
      { id: "team", name: "Team Channel", desc: "For a specific team or department", defaultName: "team-", icon: <Users size={20} /> },
      { id: "project", name: "Project Channel", desc: "For a specific initiative or goal", defaultName: "proj-", icon: <Hash size={20} /> },
      { id: "announcement", name: "Announcement", desc: "For broadcasting news to everyone", defaultName: "announcements", icon: <BellRing size={20} /> }
    ];

    return (
      <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Create a Channel</h2>
          <p style={{ fontSize: "15px", color: "#64748B", margin: 0 }}>Channels are where your team communicates. They're best when organized around a topic.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {templates.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setChannelForm(prev => ({ ...prev, channelName: t.defaultName, description: t.desc }))}
              style={{
                padding: "20px",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "16px",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                transition: "all 0.2s",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
              }}
            >
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#F8FAFC", color: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {t.icon}
              </div>
              <div>
                <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>{t.name}</h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748B", lineHeight: 1.4 }}>{t.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <section style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 20px rgba(15,23,42,0.03)" }}>
          <form style={form} onSubmit={handleCreateChannel}>
            <div style={formGroup}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }} htmlFor="channelName">
                Channel name
              </label>
              <div style={{ position: "relative" }}>
                <Hash size={16} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  id="channelName"
                  value={channelForm.channelName}
                  onChange={(e) => setChannelForm((prev) => ({ ...prev, channelName: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  placeholder="e.g. plan-budget"
                  style={{ width: "100%", padding: "12px 14px 12px 38px", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "15px", outline: "none" }}
                />
              </div>
              <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#94A3B8" }}>Names must be lowercase, without spaces or periods.</p>
            </div>

            <div style={formGroup}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }} htmlFor="channelDescription">
                Description <span style={{ color: "#94A3B8", fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                id="channelDescription"
                value={channelForm.description}
                onChange={(e) => setChannelForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="What's this channel about?"
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "15px", outline: "none", minHeight: "80px", resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "32px" }}>
              <button type="button" onClick={() => setActiveView("overview")} style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#64748B", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button type="submit" style={{ padding: "10px 24px", borderRadius: "10px", border: "none", background: "#0F172A", color: "#FFFFFF", fontSize: "14px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }} disabled={saving || !channelForm.channelName.trim()}>
                {saving ? "Creating..." : "Create Channel"}
              </button>
            </div>
          </form>
        </section>
      </div>
    );
  };

  const renderOverview = () => {
    // Generate some mock activities based on real data
    const activities = [];
    
    // Add members as activity
    selectedWorkspace.members?.forEach((member, i) => {
      activities.push({
        id: `member-${i}`,
        actor: member.firstName ? `${member.firstName} ${member.lastName}` : member.email,
        action: "joined the workspace",
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(), // random time within 3 days
        icon: <Users size={16} />,
        iconBg: "#EFF6FF",
        iconColor: "#3B82F6",
      });
    });
    
    // Add channels as activity
    channels.forEach((channel, i) => {
      activities.push({
        id: `channel-${i}`,
        actor: channel.createdBy?.firstName || "Someone",
        action: "created channel",
        target: `#${channel.channelName}`,
        timestamp: channel.createdAt || new Date().toISOString(),
        icon: <Hash size={16} />,
        iconBg: "#F0FDFA",
        iconColor: "#14B8A6",
      });
    });
    
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return (
      <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "32px", flex: 1, overflowY: "auto" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            {selectedWorkspace.workspaceName}
          </h1>
          <p style={{ fontSize: "15px", color: "#64748B", margin: "6px 0 0", maxWidth: "600px", lineHeight: 1.5 }}>
            {selectedWorkspace.description || "Your team's central command. Everything happening in your workspace, at a glance."}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", boxShadow: "0 4px 20px rgba(15,23,42,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#EEF2FF", color: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={20} />
              </div>
              <div style={{ fontWeight: 600, color: "#64748B", fontSize: "14px" }}>Active Members</div>
            </div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
              {visibleOnlineUsers.length} <span style={{ fontSize: "16px", color: "#94A3B8", fontWeight: 600 }}>/ {selectedWorkspace.members?.length || 1}</span>
            </div>
          </div>
          
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", boxShadow: "0 4px 20px rgba(15,23,42,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#F0FDFA", color: "#14B8A6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Hash size={20} />
              </div>
              <div style={{ fontWeight: 600, color: "#64748B", fontSize: "14px" }}>Active Channels</div>
            </div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
              {channels.length}
            </div>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", boxShadow: "0 4px 20px rgba(15,23,42,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#FEF2F2", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BellRing size={20} />
              </div>
              <div style={{ fontWeight: 600, color: "#64748B", fontSize: "14px" }}>Unread Alerts</div>
            </div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
              {workspaceNotifications.filter((item) => !item.isRead).length}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px", alignItems: "start" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 20px rgba(15,23,42,0.03)" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", margin: "0 0 24px" }}>Recent Activity</h2>
            {activities.length > 0 ? (
              <ActivityFeed activities={activities.slice(0, 10)} />
            ) : (
              <p style={{ color: "#94A3B8", fontSize: "14px" }}>No recent activity to show.</p>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 20px rgba(15,23,42,0.03)" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: "0 0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                Quick Actions
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button onClick={() => setActiveView("create-channel")} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", border: "1px solid #E2E8F0", borderRadius: "10px", background: "transparent", color: "#0F172A", fontWeight: 600, fontSize: "14px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                  <div style={{ background: "#F1F5F9", padding: "6px", borderRadius: "8px", color: "#64748B" }}><Plus size={16}/></div>
                  Create a channel
                </button>
                <button onClick={() => setActiveView("members")} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", border: "1px solid #E2E8F0", borderRadius: "10px", background: "transparent", color: "#0F172A", fontWeight: 600, fontSize: "14px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                  <div style={{ background: "#F1F5F9", padding: "6px", borderRadius: "8px", color: "#64748B" }}><Users size={16}/></div>
                  Invite team members
                </button>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 20px rgba(15,23,42,0.03)" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: "0 0 16px" }}>Upcoming Reminders</h2>
              {workspaceReminders.length === 0 ? (
                <p style={{ color: "#94A3B8", fontSize: "14px", margin: 0 }}>No upcoming reminders.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {workspaceReminders.slice(0, 3).map((reminder) => (
                    <div key={getId(reminder)} style={{ padding: "12px", border: "1px solid #E2E8F0", borderRadius: "10px", background: "#F8FAFC" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A" }}>{formatDate(reminder.reminderTime)}</span>
                        <span style={{ fontSize: "11px", fontWeight: 800, color: reminder.priority === "HIGH" ? "#EF4444" : "#64748B" }}>{reminder.priority || "LOW"}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "13px", color: "#475569", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{reminder.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div style={loadingStyle}>Loading workspace...</div>;
    }

    if (selectedWorkspaceId && !selectedWorkspace) {
      return <div style={loadingStyle}>Opening workspace...</div>;
    }

    if (!selectedWorkspace) {
      return (
        <div style={dashboard}>
          {error && <p style={errorText}>{error}</p>}
          {renderWorkspaceForm()}
        </div>
      );
    }

    const isChatView = activeView === "channel" || activeView === "direct";

    return (
      <div style={isChatView ? dashboardChat : dashboard}>
        {error && <p style={errorText}>{error}</p>}
        {success && <p style={successText}>{success}</p>}

        {activeView === "members" && (
          <WorkspaceMembers
            workspace={selectedWorkspace}
            currentUser={currentUser}
            onlineUsers={visibleOnlineUsers}
            onMemberAdded={() => loadWorkspaceDetails(getId(selectedWorkspace))}
          />
        )}

        {activeView === "create-workspace" && renderWorkspaceForm()}
        {activeView === "create-channel" && renderChannelForm()}
        {activeView === "channel" && selectedChannel && (
          <ChannelScreen
            key={getId(selectedChannel)}
            workspace={selectedWorkspace}
            workspaceId={getId(selectedWorkspace)}
            channel={selectedChannel}
            currentUser={currentUser}
            onlineUsers={visibleOnlineUsers}
          />
        )}
        {activeView === "direct" && selectedUser && (
          <DirectMessageScreen
            key={`${getId(selectedWorkspace)}-${getId(selectedUser)}`}
            workspace={selectedWorkspace}
            workspaceId={getId(selectedWorkspace)}
            user={selectedUser}
            currentUser={currentUser}
            onlineUsers={visibleOnlineUsers}
          />
        )}
        {activeView === "reminders" && (
          <section style={card}>
            <h2 style={sectionTitle}>Reminders</h2>
            <p style={sectionSubtitle}>
              Upcoming priority messages for this workspace.
            </p>
            <ReminderList
              reminders={workspaceReminders}
              workspaceId={getId(selectedWorkspace)}
              currentUser={currentUser}
              onRemindersChange={setReminders}
              onViewed={() => {
                setActiveView("reminders");
              }}
              onRefresh={() =>
                loadWorkspaceReminders(getId(selectedWorkspace), channels, directUsers)
              }
            />
          </section>
        )}

        {activeView === "overview" && renderOverview()}

        <NotificationList
          isOpen={isNotificationDrawerOpen}
          onClose={() => setIsNotificationDrawerOpen(false)}
          notifications={notifications}
          workspaceId={getId(selectedWorkspace)}
          onNotificationsChange={setNotifications}
          onRefresh={loadNotifications}
        />
      </div>
    );
  };

  return (
    <div style={workspaceShell}>
      <WorkspaceSidebar
        workspaces={workspaces}
        currentWorkspace={selectedWorkspace}
        channels={channels}
        directUsers={directUsers}
        reminders={workspaceReminders}

        notifications={notifications}

        onlineUsers={visibleOnlineUsers}
        currentUser={currentUser}
        activeView={activeView}
        selectedChannel={selectedChannel}
        selectedUser={selectedUser}
        onSelectWorkspace={handleSelectWorkspace}
        onOpenOverview={() => setActiveView("overview")}
        onOpenMembers={() => setActiveView("members")}
        onOpenCreateChannel={() => setActiveView("create-channel")}

        onOpenReminders={() => {
          setSelectedChannel(null);
          setSelectedUser(null);
          setActiveView("reminders");

          setReminders([]);

          loadWorkspaceReminders(
            getId(selectedWorkspace),
            channels,
            directUsers
          ).catch(() => { });
        }}


        onOpenNotifications={() => {
          setIsNotificationDrawerOpen(true);
        }}
        onSelectChannel={(channel) => {
          setSelectedChannel(channel);
          setSelectedUser(null);
          setSuccess("");
          setError("");
          setActiveView("channel");

          markNotificationsRead(
            (notification) =>
              getId(notification.channel) === getId(channel)
          );
        }}
        onSelectDirectUser={(user) => {
          setSelectedUser(user);
          setSelectedChannel(null);
          setSuccess("");
          setError("");
          setActiveView("direct");

          markNotificationsRead((notification) => {
            const sender =
              notification.message?.sender;

            const senderId =
              typeof sender === "object"
                ? sender?._id
                : sender;

            return senderId === getId(user);
          });
        }}
        onLogout={handleLogout}
      />

      <main style={contentArea}>
        <WorkspaceHeader
          workspace={selectedWorkspace}
          activeView={activeView}
          selectedChannel={selectedChannel}
          selectedUser={selectedUser}
          onlineUsers={visibleOnlineUsers}
          onOpenMembers={() => setActiveView("members")}
          onOpenCreateWorkspace={() => setActiveView("create-workspace")}
          onOpenCreateChannel={() => setActiveView("create-channel")}
        />

        {renderContent()}
      </main>
    </div>
  );
}

export default WorkspaceDashboard;
