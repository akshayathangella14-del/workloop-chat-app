import { useState } from "react";
import {
  errorText,
  reactionBar,
  reactionBtn,
  reactionBtnActive,
  reactionCount,
  reactionMoreBtn,
  reactionPicker,
  reactionPickerBtn,
} from "../styles/common";
import { api, getId, getErrorMessage } from "../services/api";

const defaultReactions = ["👍", "❤️", "😂", "🔥"];
const moreReactions = ["😮", "😢", "🎉", "🚀", "👀", "😎", "🙌", "💯", "✅", "👏", "🙏", "⭐"];

const reactionAliases = {
  LIKE: "👍",
  DONE: "✅",
  LOVE: "❤️",
  FIRE: "🔥",
};

const normalizeReaction = (reaction) => reactionAliases[reaction] || reaction;

const getGroupedReactions = (reactions = []) =>
  reactions.reduce((acc, item) => {
    if (!item?.reaction) return acc;
    const normalizedReaction = normalizeReaction(item.reaction);
    acc[normalizedReaction] = (acc[normalizedReaction] || 0) + 1;
    return acc;
  }, {});

function ReactionBar({
  message,
  messageId,
  currentUser,
  reactions = defaultReactions,
  onReactionUpdated,
}) {
  const [error, setError] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const resolvedMessageId = messageId || getId(message);
  const currentUserId = getId(currentUser) || currentUser?.id;
  const groupedReactions = getGroupedReactions(message?.reactions);
  const currentUserReaction = normalizeReaction(
    message?.reactions?.find((item) => getId(item.user) === currentUserId)?.reaction
  );

  const updateReaction = async (reaction) => {
    if (!resolvedMessageId) {
      setError("Message is required");
      return;
    }

    try {
      setError("");
      setShowPicker(false);

      const res =
        currentUserReaction === reaction
          ? await api.patch(
              "/message-api/message/reaction",
              { messageId: resolvedMessageId }
            )
          : await api.put(
              "/message-api/message/reaction",
              {
                messageId: resolvedMessageId,
                reaction,
              }
            );

      onReactionUpdated?.(res.data?.payload);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div style={reactionBar}>
        {reactions.map((reaction) => {
          const count = groupedReactions[reaction] || 0;
          const isActive = currentUserReaction === reaction;

          return (
            <button
              key={reaction}
              type="button"
              title={`React with ${reaction}`}
              style={isActive ? reactionBtnActive : reactionBtn}
              onClick={() => updateReaction(reaction)}
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
          onClick={() => setShowPicker((prev) => !prev)}
        >
          +
        </button>

        {showPicker && (
          <div style={reactionPicker}>
            {moreReactions.map((reaction) => (
              <button
                key={reaction}
                type="button"
                title={`React with ${reaction}`}
                style={reactionPickerBtn}
                onClick={() => updateReaction(reaction)}
              >
                {reaction}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p style={errorText}>{error}</p>}
    </div>
  );
}

export default ReactionBar;
