import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import { useChat } from "../store/chatStore";
import { emptyState, errorText, loading as loadingStyle, messageList } from "../styles/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const requestConfig = { withCredentials: true };

const getErrorMessage = (err) =>
  err?.response?.data?.error ||
  err?.response?.data?.message ||
  err?.message ||
  "Unable to load messages";

function MessageList({
  messages: messagesProp,
  currentUser,
  messageType = "CHANNEL",
  channelId,
  workspaceId,
  receiverId,
  onMessagesChange,
  refreshKey,
  onOpenThread,
}) {
  const [messages, setMessages] = useState(messagesProp || []);
  const [hiddenMessageIds, setHiddenMessageIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const { socket } = useChat();
  const visibleMessages = messagesProp || messages;
  const displayedMessages = visibleMessages.filter(
    (message) => !hiddenMessageIds.includes(message._id)
  );

  const updateMessages = useCallback((nextMessages) => {
    setMessages(nextMessages);
    onMessagesChange?.(nextMessages);
  }, [onMessagesChange]);

  const loadMessages = useCallback(async () => {
    if (messagesProp) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (messageType === "DIRECT") {
        if (!workspaceId || !receiverId) {
          updateMessages([]);
          return;
        }

        const res = await axios.get(
          `${BASE_URL}/dm-api/messages/${workspaceId}/${receiverId}`,
          requestConfig
        );
        updateMessages(res.data?.payload || []);
        return;
      }

      if (!channelId) {
        updateMessages([]);
        return;
      }

      const res = await axios.get(
        `${BASE_URL}/message-api/channel-messages/${channelId}`,
        requestConfig
      );
      updateMessages(res.data?.payload || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [channelId, messageType, messagesProp, receiverId, updateMessages, workspaceId]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      loadMessages();
    }, 0);

    return () => clearTimeout(timerId);
  }, [loadMessages, refreshKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [displayedMessages]);

  useEffect(() => {

    if (!socket) {
      return;
    }

    const handleReceiveMessage = (data) => {

      const newMessage = data?.payload;

      if (!newMessage) {
        return;
      }

      setMessages((prev) => {

        const exists = prev.some(
          (item) => item._id === newMessage._id
        );

        if (exists) {
          return prev;
        }

        return [...prev, newMessage];
      });
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };

  }, [socket]);

  const handleEdit = async (messageId, content) => {
    try {
      setError("");

      await axios.put(
        `${BASE_URL}/message-api/message`,
        { messageId, content },
        requestConfig
      );

      await loadMessages();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (messageId, mode = "everyone") => {
    if (mode === "me") {
      setHiddenMessageIds((prev) =>
        prev.includes(messageId) ? prev : [...prev, messageId]
      );
      return;
    }

    try {
      setError("");

      await axios.patch(
        `${BASE_URL}/message-api/message/status`,
        { messageId, isMessageActive: false },
        requestConfig
      );

      await loadMessages();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleReact = async (messageId, reaction) => {
    try {
      setError("");

      await axios.put(
        `${BASE_URL}/message-api/message/reaction`,
        { messageId, reaction },
        requestConfig
      );

      await loadMessages();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleRemoveReaction = async (messageId) => {
    try {
      setError("");

      await axios.patch(
        `${BASE_URL}/message-api/message/reaction`,
        { messageId },
        requestConfig
      );

      await loadMessages();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleOpenThread = async (message) => {
    if (onOpenThread) {
      onOpenThread(message);
      return;
    }

    const reply = window.prompt("Reply in thread");

    if (!reply?.trim()) {
      return;
    }

    try {
      setError("");

      await axios.put(
        `${BASE_URL}/message-api/message/thread`,
        {
          messageId: message._id,
          content: reply.trim(),
        },
        requestConfig
      );

      await loadMessages();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return <div style={loadingStyle}>Loading messages...</div>;
  }

  return (
    <div style={messageList}>
      {error && <p style={errorText}>{error}</p>}

      {displayedMessages.length === 0 ? (
        <div style={emptyState}>
          No messages yet. Start the conversation.
        </div>
      ) : (
        <>
          {displayedMessages.map((message) => (
            <MessageItem
              key={message._id}
              message={message}
              currentUser={currentUser}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReact={handleReact}
              onRemoveReaction={handleRemoveReaction}
              onOpenThread={handleOpenThread}
            />
          ))}

          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}

export default MessageList;
