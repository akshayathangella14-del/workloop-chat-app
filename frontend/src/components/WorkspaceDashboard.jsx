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

  const renderChannelForm = () => (
    <section style={card}>
      <h2 style={sectionTitle}>Create channel</h2>
      <p style={sectionSubtitle}>Channels are created inside the current workspace.</p>

      <form style={form} onSubmit={handleCreateChannel}>
        <div style={formGroup}>
          <label style={label} htmlFor="channelName">
            Channel name
          </label>
          <input
            id="channelName"
            value={channelForm.channelName}
            onChange={(e) =>
              setChannelForm((prev) => ({ ...prev, channelName: e.target.value }))
            }
            placeholder="general"
            style={input}
          />
        </div>

        <div style={formGroup}>
          <label style={label} htmlFor="channelType">
            Channel type
          </label>
          <select
            id="channelType"
            value={channelForm.channelType}
            onChange={(e) =>
              setChannelForm((prev) => ({ ...prev, channelType: e.target.value }))
            }
            style={select}
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>

        <div style={formGroup}>
          <label style={label} htmlFor="channelDescription">
            Description
          </label>
          <textarea
            id="channelDescription"
            value={channelForm.description}
            onChange={(e) =>
              setChannelForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="What belongs in this channel"
            style={textarea}
          />
        </div>

        <button type="submit" style={primaryBtn} disabled={saving}>
          {saving ? "Creating..." : "Create channel"}
        </button>
      </form>
    </section>
  );

  const renderOverview = () => (
    <div style={dashboardGrid}>
      <section style={card}>
        <h2 style={sectionTitle}>Workspace overview</h2>
        <p style={sectionSubtitle}>
          {selectedWorkspace?.description || "A focused space for your team."}
        </p>

        <div style={list}>
          <article style={listItem}>
            <div style={listItemMain}>
              <h3 style={listItemTitle}>Channels</h3>
              <p style={listItemMeta}>{channels.length} available channels</p>
            </div>
          </article>

          <article style={listItem}>
            <div style={listItemMain}>
              <h3 style={listItemTitle}>Direct messages</h3>
              <p style={listItemMeta}>{directUsers.length} workspace teammates</p>
            </div>
          </article>

          <article style={listItem}>
            <div style={listItemMain}>
              <h3 style={listItemTitle}>Unread notifications</h3>
              <p style={listItemMeta}>
                {workspaceNotifications.filter((item) => !item.isRead).length} unread
              </p>
            </div>
          </article>
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Upcoming reminders</h2>
        <p style={sectionSubtitle}>Priority messages with future reminder times.</p>

        <div style={list}>
          {workspaceReminders.length === 0 && (
            <div style={emptyState}>No upcoming reminders.</div>
          )}

          {workspaceReminders.slice(0, 5).map((reminder) => (
            <article key={getId(reminder)} style={reminderItem}>
              <div style={toolbar}>
                <div style={reminderTime}>{formatDate(reminder.reminderTime)}</div>
                <span style={getPriorityStyle(reminder.priority)}>
                  {reminder.priority || "LOW"}
                </span>
              </div>
              <p style={mutedText}>{reminder.content || "Reminder message"}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );

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
        {activeView === "notifications" && (
          <section style={card}>
            <h2 style={sectionTitle}>Notifications</h2>
            <p style={sectionSubtitle}>
              Message, thread, reaction, and reminder updates.
            </p>
            <NotificationList
              workspaceId={getId(selectedWorkspace)}
              onNotificationsChange={setNotifications}
              onRefresh={loadNotifications}
            />
          </section>
        )}
        {activeView === "overview" && renderOverview()}
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
          setSelectedChannel(null);
          setSelectedUser(null);
          setActiveView("notifications");

          loadNotifications().catch(() => { });
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
