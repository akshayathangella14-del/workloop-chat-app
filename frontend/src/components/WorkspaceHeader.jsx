import {
  secondaryBtn,
  statusDot,
  statusDotOnline,
  statusLine,
  toolbar,
  workspaceHeader,
  workspaceHeaderMeta,
  workspaceHeaderTitle,
} from "../styles/common";

const getFullName = (user) => {
  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  return name || user?.email || "User";
};

function WorkspaceHeader({
  workspace,
  activeView,
  selectedChannel,
  selectedUser,
  onlineUsers = [],
  onOpenMembers,
  onOpenCreateWorkspace,
  onOpenCreateChannel,
}) {
  const selectedUserId =
    typeof selectedUser === "string" ? selectedUser : selectedUser?._id || selectedUser?.id;
  const isSelectedUserOnline = selectedUserId ? onlineUsers.includes(selectedUserId) : false;

  const getTitle = () => {
    if (!workspace) return "Workspaces";
    if (activeView === "members") return "Workspace members";
    if (activeView === "create-channel") return "Create channel";
    if (activeView === "channel" && selectedChannel) {
      return `# ${selectedChannel.channelName}`;
    }
    if (activeView === "direct" && selectedUser) {
      return getFullName(selectedUser);
    }
    return workspace.workspaceName;
  };

  const getMeta = () => {
    if (!workspace) return "Create your first workspace to begin.";
    if (activeView === "channel" && selectedChannel) {
      return `${selectedChannel.channelType || "PUBLIC"} channel`;
    }
    if (activeView === "direct" && selectedUser) {
      return selectedUser.email || "Direct message";
    }
    return `${workspace.members?.length || 0} members`;
  };

  return (
    <header style={workspaceHeader}>
      <div>
        <h1 style={workspaceHeaderTitle}>{getTitle()}</h1>
        {activeView === "direct" && selectedUser ? (
          <p style={workspaceHeaderMeta}>
            <span style={statusLine}>
              <span style={isSelectedUserOnline ? statusDotOnline : statusDot} />
              <span>
                {isSelectedUserOnline ? "Active now" : "Offline"}
                {getMeta() ? ` • ${getMeta()}` : ""}
              </span>
            </span>
          </p>
        ) : (
          <p style={workspaceHeaderMeta}>{getMeta()}</p>
        )}
      </div>

      <div style={toolbar}>
        {workspace && (
          <>
            <button type="button" style={secondaryBtn} onClick={onOpenMembers}>
              Members
            </button>
            <button type="button" style={secondaryBtn} onClick={onOpenCreateChannel}>
              New channel
            </button>
          </>
        )}

        <button type="button" style={secondaryBtn} onClick={onOpenCreateWorkspace}>
          New workspace
        </button>

      </div>
    </header>
  );
}

export default WorkspaceHeader;
