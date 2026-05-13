import {
  badge,
  colors,
  ghostBtn,
  sidebar,
  sidebarBody,
  sidebarFooter,
  sidebarHeader,
  sidebarItem,
  sidebarItemActive,
  sidebarItemLabel,
  sidebarSection,
  sidebarSectionHeader,
  softBadge,
  statusDot,
  statusDotOnline,
  statusLine,
  workspaceMeta,
  workspaceName,
} from "../styles/common";
import ProfileMenu from "./ProfileMenu";

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const getFullName = (user) => {
  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  return name || user?.email || "User";
};

function WorkspaceSidebar({
  workspaces = [],
  currentWorkspace,
  channels = [],
  directUsers = [],
  reminders = [],
  notifications = [],
  onlineUsers = [],
  currentUser,
  activeView,
  selectedChannel,
  selectedUser,
  onSelectWorkspace,
  onOpenOverview,
  onOpenMembers,
  onOpenCreateChannel,
  onOpenReminders,
  onOpenNotifications,
  onSelectChannel,
  onSelectDirectUser,
  onLogout,
}) {
  const workspaceId = getId(currentWorkspace);

  const unreadCount = notifications.filter(
    (item) =>
      !item.isRead &&
      item.notificationType !== "REMINDER"
  ).length;


  const reminderCount = reminders.length;

  const getWorkspaceStyle = (workspace) =>
    getId(workspace) === workspaceId ? sidebarItemActive : sidebarItem;

  const getChannelStyle = (channel) =>
    getId(channel) === getId(selectedChannel) && activeView === "channel"
      ? sidebarItemActive
      : sidebarItem;

  const getUserStyle = (user) =>
    getId(user) === getId(selectedUser) && activeView === "direct"
      ? sidebarItemActive
      : sidebarItem;

  return (
    <aside style={sidebar}>
      <div style={sidebarHeader}>
        <h2 style={workspaceName}>
          {currentWorkspace?.workspaceName || "WorkLoop"}
        </h2>
        <p style={workspaceMeta}>
          {currentWorkspace
            ? `${currentWorkspace.members?.length || 0} members`
            : "Choose or create a workspace"}
        </p>
      </div>

      <div style={sidebarBody}>
        <section style={sidebarSection}>
          <div style={sidebarSectionHeader}>
            <span>Workspaces</span>
            <span style={softBadge}>{workspaces.length}</span>
          </div>

          {workspaces.map((workspace) => (
            <button
              key={getId(workspace)}
              type="button"
              style={getWorkspaceStyle(workspace)}
              onClick={() => onSelectWorkspace(workspace)}
            >
              <span style={sidebarItemLabel}>{workspace.workspaceName}</span>
            </button>
          ))}
        </section>

        {currentWorkspace && (
          <>
            <section style={sidebarSection}>
              <button
                type="button"
                style={activeView === "overview" ? sidebarItemActive : sidebarItem}
                onClick={onOpenOverview}
              >
                <span style={sidebarItemLabel}>Home</span>
              </button>

              <button
                type="button"
                style={activeView === "members" ? sidebarItemActive : sidebarItem}
                onClick={onOpenMembers}
              >
                <span style={sidebarItemLabel}>Members</span>
              </button>
            </section>

            <section style={sidebarSection}>
              <div style={sidebarSectionHeader}>
                <span>Channels</span>
                <button type="button" style={ghostBtn} onClick={onOpenCreateChannel}>
                  Add
                </button>
              </div>

              {channels.map((channel) => (
                <button
                  key={getId(channel)}
                  type="button"
                  style={getChannelStyle(channel)}
                  onClick={() => onSelectChannel(channel)}
                >
                  <span style={sidebarItemLabel}># {channel.channelName}</span>
                  {channel.channelType === "PRIVATE" && <span style={softBadge}>P</span>}
                </button>
              ))}
            </section>

            <section style={sidebarSection}>
              <div style={sidebarSectionHeader}>
                <span>Direct messages</span>
                <span style={softBadge}>{directUsers.length}</span>
              </div>

              {directUsers.map((user) => (
                (() => {
                  const userId = getId(user);
                  const isOnline = onlineUsers.includes(userId);

                  return (
                    <button
                      key={userId}
                      type="button"
                      style={{ ...getUserStyle(user), minHeight: "48px" }}
                      onClick={() => onSelectDirectUser(user)}
                    >
                      <span
                        style={{
                          ...sidebarItemLabel,
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: "3px",
                        }}
                      >
                        <span style={statusLine}>
                          <span style={isOnline ? statusDotOnline : statusDot} />
                          <span>{getFullName(user)}</span>
                        </span>
                        <span
                          style={{
                            marginLeft: "16px",
                            color: colors.sidebarMuted,
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          {isOnline ? "Active now" : "Offline"}
                        </span>
                      </span>
                    </button>
                  );
                })()
              ))}
            </section>

            <section style={sidebarSection}>
              <button
                type="button"
                style={activeView === "reminders" ? sidebarItemActive : sidebarItem}
                onClick={onOpenReminders}
              >
                <span style={sidebarItemLabel}>Reminders</span>
                {reminderCount > 0 && <span style={badge}>{reminderCount}</span>}
              </button>

              <button
                type="button"
                style={activeView === "notifications" ? sidebarItemActive : sidebarItem}
                onClick={onOpenNotifications}
              >
                <span style={sidebarItemLabel}>Notifications</span>
                {unreadCount > 0 && <span style={badge}>{unreadCount}</span>}
              </button>
            </section>
          </>
        )}
      </div>

      <div style={sidebarFooter}>
        <ProfileMenu user={currentUser} onLogout={onLogout} />
      </div>
    </aside>
  );
}

export default WorkspaceSidebar;
