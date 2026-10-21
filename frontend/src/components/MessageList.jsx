import { useCallback, useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import { useChat } from "../store/chatStore";
import { emptyState, errorText, loading as loadingStyle, messageList } from "../styles/common";
import { api, getErrorMessage, getId } from "../services/api";
// MessageList component is used in both ChannelScreen and DirectMessageScreen to display messages.
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
  const visibleMessages = messages;
  const displayedMessages = visibleMessages.filter(
    (message) => !hiddenMessageIds.includes(message._id)
  );
  useEffect(() => {
    setMessages(messagesProp || []);
  }, [messagesProp]);

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

        const res = await api.get(
          `/dm-api/messages/${workspaceId}/${receiverId}`
        );
        updateMessages(res.data?.payload || []);
        return;
      }

      if (!channelId) {
        updateMessages([]);
        return;
      }

      const res = await api.get(
        `/message-api/channel-messages/${channelId}`
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
    if (!socket) return;

    const isMessageRelevant = (msg) => {
      if (!msg) return false;
      if (messageType === "DIRECT") {
        if (msg.messageType !== "DIRECT") return false;
        const msgSender = getId(msg.sender);
        const msgReceiver = getId(msg.receiver);
        const curId = getId(currentUser);
        return (
          (msgSender === curId && msgReceiver === receiverId) ||
          (msgSender === receiverId && msgReceiver === curId)
        );
      } else {
        if (msg.messageType === "DIRECT") return false;
        const msgChan = getId(msg.channel);
        return msgChan === getId(channelId);
      }
    };

    const handleReceiveMessage = (data) => {
      const newMessage = data?.payload;
      if (!newMessage || !isMessageRelevant(newMessage)) return;

      setMessages((prev) => {
        const exists = prev.some((item) => getId(item) === getId(newMessage));
        if (exists) {
          return prev.map((item) => (getId(item) === getId(newMessage) ? newMessage : item));
        }
        return [...prev, newMessage];
      });
    };

    const handleMessageUpdate = (data) => {
      const updated = data?.payload;
      if (!updated || !isMessageRelevant(updated)) return;

      setMessages((prev) =>
        prev.map((item) => (getId(item) === getId(updated) ? updated : item))
      );
    };

    const handleMessageDeleted = (data) => {
      const deleted = data?.payload;
      if (!deleted) return;
      const delId = getId(deleted);
      setMessages((prev) => prev.filter((item) => getId(item) !== delId));
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("receive-file", handleReceiveMessage);
    socket.on("message-edited", handleMessageUpdate);
    socket.on("reaction-added", handleMessageUpdate);
    socket.on("reaction-removed", handleMessageUpdate);
    socket.on("message-deleted", handleMessageDeleted);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("receive-file", handleReceiveMessage);
      socket.off("message-edited", handleMessageUpdate);
      socket.off("reaction-added", handleMessageUpdate);
      socket.off("reaction-removed", handleMessageUpdate);
      socket.off("message-deleted", handleMessageDeleted);
    };
  }, [socket, messageType, receiverId, channelId, currentUser]);

  const handleEdit = async (messageId, content) => {
    try {
      setError("");

      await api.put("/message-api/message", { messageId, content });
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

      await api.patch("/message-api/message/status", {
        messageId,
        isMessageActive: false,
      });

      await loadMessages();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleReact = async (messageId, reaction) => {
    try {
      setError("");

      await api.put("/message-api/message/reaction", {
        messageId,
        reaction,
      });

      await loadMessages();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleRemoveReaction = async (messageId) => {
    try {
      setError("");

      await api.patch("/message-api/message/reaction", { messageId });
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

      await api.post("/message-api/thread-reply", {
        workspace: message.workspace,
        channel: message.channel,
        parentMessage: message._id,
        content: reply.trim(),
      });

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
