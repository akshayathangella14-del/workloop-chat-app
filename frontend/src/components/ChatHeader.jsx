import {
  avatar,
  avatarImage,
  chatHeader,
  chatMeta,
  chatTitle,
  secondaryBtn,
  statusDot,
  statusDotOnline,
  statusLine,
  toolbar,
} from "../styles/common";

const getFullName = (user) => {
  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  return name || user?.email || "User";
};

const getInitials = (user) => {
  const first = user?.firstName?.trim()?.[0] || "";
  const last = user?.lastName?.trim()?.[0] || "";
  return `${first}${last}`.toUpperCase() || "U";
};

function ChatHeader({
  channel,
  user,
  title,
  subtitle,
  membersCount,
  isOnline = false,
  onOpenMembers,
  rightContent,
}) {
  const isDirectMessage = Boolean(user);
  const resolvedTitle =
    title ||
    (channel ? `# ${channel.channelName}` : isDirectMessage ? getFullName(user) : "Chat");

  const resolvedSubtitle =
    subtitle ||
    (channel
      ? channel.description ||
        `${channel.channelType || "PUBLIC"} channel${
          membersCount ? ` • ${membersCount} members` : ""
        }`
      : `${isOnline ? "Active now" : "Offline"}${user?.email ? ` • ${user.email}` : ""}`);

  return (
    <header style={chatHeader}>
      <div style={toolbar}>
        {isDirectMessage && (
          <div style={avatar}>
            {user.profileImageUrl ? (
              <img src={user.profileImageUrl} alt={getFullName(user)} style={avatarImage} />
            ) : (
              getInitials(user)
            )}
          </div>
        )}

        <div>
          <h1 style={chatTitle}>{resolvedTitle}</h1>
          {isDirectMessage ? (
            <p style={chatMeta}>
              <span style={statusLine}>
                <span style={isOnline ? statusDotOnline : statusDot} />
                <span>{resolvedSubtitle}</span>
              </span>
            </p>
          ) : (
            <p style={chatMeta}>{resolvedSubtitle}</p>
          )}
        </div>
      </div>

      <div style={toolbar}>
        {rightContent}
        {onOpenMembers && (
          <button type="button" style={secondaryBtn} onClick={onOpenMembers}>
            Members
          </button>
        )}
      </div>
    </header>
  );
}

export default ChatHeader;
