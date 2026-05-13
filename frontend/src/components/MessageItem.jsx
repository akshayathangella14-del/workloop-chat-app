import { useState } from "react";
import {
  actionChip,
  attachment,
  attachmentLink,
  avatar,
  avatarImage,
  composerInput,
  composerToolbar,
  dangerBtn,
  deleteModal,
  deleteModalActions,
  deleteModalBackdrop,
  deleteModalText,
  deleteModalTitle,
  deletedMessage,
  emojiPickerGrid,
  emojiPickerGroup,
  emojiPickerLabel,
  emojiPickerPanel,
  getPriorityStyle,
  ghostBtn,
  messageBody,
  messageComposer,
  messageItem,
  messageItemHover,
  messageQuickActions,
  messageReactionSummary,
  messageText,
  messageTime,
  messageTopline,
  primaryBtn,
  reactionBtn,
  reactionBtnActive,
  reactionCount,
  reactionMoreBtn,
  reactionPickerBtn,
  reminderLabel,
  secondaryBtn,
  senderName,
  toolbar,
} from "../styles/common";

const defaultReactions = ["👍", "❤️", "😂", "🔥", "✅"];
const emojiGroups = [
  {
    label: "Popular",
    emojis: ["👍", "❤️", "😂", "🔥", "✅", "🎉", "👏", "🙏", "🙌", "👀", "💯", "⭐"],
  },
  {
    label: "Smileys",
    emojis: ["😀", "😄", "😁", "😊", "😍", "😎", "🤔", "😮", "😢", "😅", "😬", "🤯"],
  },
  {
    label: "Work",
    emojis: ["🚀", "💡", "📌", "📎", "📝", "⏰", "📣", "🔒", "🧠", "🏆", "🛠️", "📦"],
  },
];

const reactionAliases = {
  LIKE: "👍",
  DONE: "✅",
  LOVE: "❤️",
  FIRE: "🔥",
};

const normalizeReaction = (reaction) => reactionAliases[reaction] || reaction;

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

const formatTime = (value) => {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const getGroupedReactions = (reactions = []) =>
  reactions.reduce((acc, item) => {
    if (!item?.reaction) return acc;
    const normalizedReaction = normalizeReaction(item.reaction);
    acc[normalizedReaction] = (acc[normalizedReaction] || 0) + 1;
    return acc;
  }, {});

function MessageItem({
  message,
  currentUser,
  reactions = defaultReactions,
  onEdit,
  onDelete,
  onReact,
  onRemoveReaction,
  onOpenThread,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message?.content || "");
  const [showPicker, setShowPicker] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!message) {
    return null;
  }

  const messageId = getId(message);
  const currentUserId = getId(currentUser) || currentUser?.id;
  const sender = message.sender;
  const senderId = getId(sender);
  const isOwnMessage = senderId === currentUserId;
  const groupedReactions = getGroupedReactions(message.reactions);
  const reactionEntries = Object.entries(groupedReactions);
  const hasReactions = reactionEntries.length > 0;
  const actionsVisible = showActions || showPicker || showDeleteDialog;
  const currentUserReaction = normalizeReaction(
    message.reactions?.find((item) => getId(item.user) === currentUserId)?.reaction
  );

  const closeActions = () => {
    if (!showPicker && !showDeleteDialog) {
      setShowActions(false);
    }
  };

  const handleSave = async () => {
    if (!draft.trim()) {
      return;
    }

    await onEdit?.(messageId, draft.trim());
    setIsEditing(false);
  };

  const handleReactionClick = (reaction) => {
    setShowPicker(false);
    setShowActions(false);

    if (currentUserReaction === reaction) {
      onRemoveReaction?.(messageId);
      return;
    }

    onReact?.(messageId, reaction);
  };

  const handleDelete = async (mode) => {
    setShowDeleteDialog(false);
    setShowActions(false);
    await onDelete?.(messageId, mode);
  };

  return (
    <article
      style={actionsVisible ? messageItemHover : { ...messageItem, position: "relative" }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={closeActions}
      onFocus={() => setShowActions(true)}
      onClick={() => setShowActions(true)}
    >
      {actionsVisible && message.isMessageActive !== false && (
        <div style={messageQuickActions}>
          {reactions.map((reaction) => {
            const count = groupedReactions[reaction] || 0;
            const isActive = currentUserReaction === reaction;

            return (
              <button
                key={reaction}
                type="button"
                title={`React with ${reaction}`}
                style={isActive ? reactionBtnActive : reactionBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReactionClick(reaction);
                }}
              >
                {reaction}
                {count > 0 && <span style={reactionCount}>{count}</span>}
              </button>
            );
          })}

          <button
            type="button"
            title="More reactions"
            style={reactionMoreBtn}
            onClick={(e) => {
              e.stopPropagation();
              setShowPicker((prev) => !prev);
            }}
          >
            +
          </button>

          <button
            type="button"
            style={actionChip}
            onClick={(e) => {
              e.stopPropagation();
              onOpenThread?.(message);
            }}
          >
            Reply {message.threadReplies?.length ? `(${message.threadReplies.length})` : ""}
          </button>

          {isOwnMessage && (
            <>
              <button
                type="button"
                style={actionChip}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                  setShowPicker(false);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                style={{ ...actionChip, color: "#c62828" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                  setShowPicker(false);
                }}
              >
                Delete
              </button>
            </>
          )}

          {showPicker && (
            <div style={emojiPickerPanel} onClick={(e) => e.stopPropagation()}>
              {emojiGroups.map((group) => (
                <div key={group.label} style={emojiPickerGroup}>
                  <div style={emojiPickerLabel}>{group.label}</div>
                  <div style={emojiPickerGrid}>
                    {group.emojis.map((reaction) => (
                      <button
                        key={`${group.label}-${reaction}`}
                        type="button"
                        title={`React with ${reaction}`}
                        style={reactionPickerBtn}
                        onClick={() => handleReactionClick(reaction)}
                      >
                        {reaction}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={avatar}>
        {sender?.profileImageUrl ? (
          <img src={sender.profileImageUrl} alt={getFullName(sender)} style={avatarImage} />
        ) : (
          getInitials(sender)
        )}
      </div>

      <div style={messageBody}>
        <div style={messageTopline}>
          <span style={senderName}>{getFullName(sender)}</span>
          <span style={messageTime}>{formatTime(message.createdAt)}</span>
          {message.isEdited && <span style={messageTime}>edited</span>}
          <span style={getPriorityStyle(message.priority)}>{message.priority || "LOW"}</span>
        </div>

        {!message.isMessageActive ? (
          <p style={deletedMessage}>This message was deleted.</p>
        ) : isEditing ? (
          <div style={messageComposer}>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              style={composerInput}
            />
            <div style={composerToolbar}>
              <div style={toolbar}>
                <button type="button" style={primaryBtn} onClick={handleSave}>
                  Save
                </button>
                <button
                  type="button"
                  style={secondaryBtn}
                  onClick={() => {
                    setDraft(message.content || "");
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {message.content && <p style={messageText}>{message.content}</p>}

            {message.file?.fileUrl && (
              <div style={attachment}>
                <a
                  href={message.file.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={attachmentLink}
                >
                  {message.file.fileName || "Open attachment"}
                </a>
              </div>
            )}
          </>
        )}

        {message.reminderTime && (
          <div style={reminderLabel}>Reminder: {formatTime(message.reminderTime)}</div>
        )}

        {hasReactions && actionsVisible && (
          <div style={messageReactionSummary}>
            {reactionEntries.map(([reaction, count]) => (
              <button
                key={reaction}
                type="button"
                style={currentUserReaction === reaction ? reactionBtnActive : reactionBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleReactionClick(reaction);
                }}
              >
                {reaction}
                <span style={reactionCount}>{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {showDeleteDialog && (
        <div style={deleteModalBackdrop} onClick={() => setShowDeleteDialog(false)}>
          <div style={deleteModal} onClick={(e) => e.stopPropagation()}>
            <h3 style={deleteModalTitle}>Delete message?</h3>
            <p style={deleteModalText}>
              Choose whether to hide this message only from your screen or delete it for
              everyone in the conversation.
            </p>

            <div style={deleteModalActions}>
              <button type="button" style={secondaryBtn} onClick={() => handleDelete("me")}>
                Delete for me
              </button>
              <button type="button" style={dangerBtn} onClick={() => handleDelete("everyone")}>
                Delete for everyone
              </button>
              <button type="button" style={ghostBtn} onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default MessageItem;
