import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import MessageItem from "./MessageItem";

import {
  avatar,
  avatarImage,
  composerInput,
  composerToolbar,
  errorText,
  loading as loadingStyle,
  messageItem,
  messageList,
  messageText,
  mutedText,
  primaryBtn,
  secondaryBtn,
  senderName,
  threadBody,
  threadHeader,
  threadPanel,
  threadTitle,
  toolbar,
} from "../styles/common";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

const requestConfig = {
  withCredentials: true,
};

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "string") return value;

  return value._id || value.id || "";
};

const getFullName = (user) => {
  const name =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return name || user?.email || "User";
};

const getInitials = (user) => {
  const first =
    user?.firstName?.trim()?.[0] || "";

  const last =
    user?.lastName?.trim()?.[0] || "";

  return (
    `${first}${last}`.toUpperCase() || "U"
  );
};

function ThreadPanel({
  message,
  currentUser,
  onClose,
}) {
  const [replies, setReplies] = useState([]);

  const [replyText, setReplyText] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [error, setError] = useState("");

  const messageId = getId(message);

  const loadReplies = useCallback(async () => {
    if (!messageId) {
      setReplies([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${BASE_URL}/message-api/thread-replies/${messageId}`,
        requestConfig
      );

      setReplies(res.data?.payload || []);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load replies"
      );
    } finally {
      setLoading(false);
    }
  }, [messageId]);

  useEffect(() => {
    loadReplies();
  }, [loadReplies]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!replyText.trim()) {
      setError("Reply cannot be empty");
      return;
    }

    try {
      setSending(true);
      setError("");

      const res = await axios.post(
        `${BASE_URL}/message-api/thread-reply`,
        {
          workspace: message.workspace,
          channel: message.channel,
          parentMessage: messageId,
          content: replyText.trim(),
        },
        requestConfig
      );

      const newReply = res.data?.payload;

      if (newReply) {
        setReplies((prev) => [
          ...prev,
          newReply,
        ]);
      }

      setReplyText("");
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Unable to send reply"
      );
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.key !== "Enter" ||
      e.shiftKey ||
      e.nativeEvent.isComposing
    ) {
      return;
    }

    e.preventDefault();

    e.currentTarget.form?.requestSubmit();
  };

  if (!message) {
    return null;
  }

  return (
    <aside style={threadPanel}>
      <header style={threadHeader}>
        <div>
          <h2 style={threadTitle}>
            Thread
          </h2>

          <p style={mutedText}>
            {replies.length} replies
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            style={secondaryBtn}
            onClick={onClose}
          >
            Close
          </button>
        )}
      </header>

      <div style={threadBody}>
        <MessageItem
          message={message}
          currentUser={currentUser}
        />

        {loading ? (
          <div style={loadingStyle}>
            Loading replies...
          </div>
        ) : (
          <div style={messageList}>
            {replies.length === 0 && (
              <p style={mutedText}>
                No replies yet.
              </p>
            )}

            {replies.map((reply) => {
              const sender = reply.sender;

              return (
                <article
                  key={getId(reply)}
                  style={messageItem}
                >
                  <div style={avatar}>
                    {sender?.profileImageUrl ? (
                      <img
                        src={
                          sender.profileImageUrl
                        }
                        alt={getFullName(
                          sender
                        )}
                        style={avatarImage}
                      />
                    ) : (
                      getInitials(sender)
                    )}
                  </div>

                  <div>
                    <div style={toolbar}>
                      <span
                        style={senderName}
                      >
                        {getFullName(
                          sender
                        )}
                      </span>
                    </div>

                    <p style={messageText}>
                      {reply.content}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            value={replyText}
            onChange={(e) =>
              setReplyText(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Reply in thread"
            style={composerInput}
          />

          <div style={composerToolbar}>
            <button
              type="submit"
              style={primaryBtn}
              disabled={sending}
            >
              {sending
                ? "Replying..."
                : "Reply"}
            </button>
          </div>
        </form>

        {error && (
          <p style={errorText}>{error}</p>
        )}
      </div>
    </aside>
  );
}

export default ThreadPanel;

