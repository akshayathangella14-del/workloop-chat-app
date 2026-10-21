import { Menu } from "lucide-react";
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
  onOpenNavigation,
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
    <header className="workspace-header" style={workspaceHeader}>
      <button
        className="mobile-nav-toggle"
        type="button"
        aria-label="Open workspace navigation"
        aria-controls="workspace-navigation"
        onClick={onOpenNavigation}
      >
        <Menu size={19} aria-hidden="true" />
      </button>
      <div>
        <h1 className="workspace-header-title" style={workspaceHeaderTitle}>{getTitle()}</h1>
        {activeView === "direct" && selectedUser ? (
          <p className="workspace-header-meta" style={workspaceHeaderMeta}>
            <span style={statusLine}>
              <span style={isSelectedUserOnline ? statusDotOnline : statusDot} />
              <span>
                {isSelectedUserOnline ? "Active now" : "Offline"}
                {getMeta() ? ` • ${getMeta()}` : ""}
              </span>
            </span>
          </p>
        ) : (
          <p className="workspace-header-meta" style={workspaceHeaderMeta}>{getMeta()}</p>
        )}
      </div>

      <div className="workspace-header-toolbar" style={toolbar}>
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
