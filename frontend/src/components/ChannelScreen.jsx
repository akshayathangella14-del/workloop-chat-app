import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import ThreadPanel from "./ThreadPanel";
import { useChat } from "../store/chatStore";
import {
  chatLayout,
  chatLayoutWithThread,
  chatPanel,
  errorText,
  loading as loadingStyle,
  mutedText,
} from "../styles/common";
import { api, getId, getErrorMessage } from "../services/api";

function ChannelScreen({
  workspace,
  workspaceId,
  channel,
  channelId,
  currentUser,
}) {
  const params = useParams();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(currentUser || null);
  const [activeChannel, setActiveChannel] = useState(channel || null);
  const [threadMessage, setThreadMessage] = useState(null);
  const [messageRefreshKey, setMessageRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { joinChannel } = useChat();

  const resolvedChannelId = channelId || getId(channel) || params.channelId;
  const resolvedWorkspaceId =
    workspaceId ||
    getId(workspace) ||
    getId(activeChannel?.workspace) ||
    getId(channel?.workspace);

  const refreshMessages = () => {
    setMessageRefreshKey((prev) => prev + 1);
  };

  const loadAuthUser = useCallback(async () => {
    if (currentUser) {
      setAuthUser(currentUser);
      return;
    }

    const res = await api.get("/auth/check-auth");
    setAuthUser(res.data?.payload || null);
  }, [currentUser]);

  const loadChannel = useCallback(async () => {
    if (!resolvedChannelId) {
      setActiveChannel(channel || null);
      return;
    }

    const res = await api.get(
      `/channel-api/channel/${resolvedChannelId}`
    );
    const nextChannel = res.data?.payload || null;

    setActiveChannel(nextChannel);
  }, [channel, resolvedChannelId]);

  const loadScreen = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      await Promise.all([loadAuthUser(), loadChannel()]);
      refreshMessages();
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [loadAuthUser, loadChannel, navigate]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      loadScreen();
    }, 0);

    return () => clearTimeout(timerId);
  }, [loadScreen]);

  useEffect(() => {
    if (!resolvedChannelId) {
      return;
    }

    joinChannel(resolvedChannelId);

  }, [joinChannel, resolvedChannelId]);

  if (loading) {
    return <div style={loadingStyle}>Loading channel...</div>;
  }

  return (
    <section
      className="workspace-chat-layout"
      style={threadMessage ? chatLayoutWithThread : chatLayout}
    >
      <div style={chatPanel}>
        <ChatHeader
          channel={activeChannel || channel}
          membersCount={(activeChannel || channel)?.members?.length || 0}
        />

        {error && <p style={errorText}>{error}</p>}

        {!resolvedChannelId ? (
          <p style={mutedText}>Select a channel to start chatting.</p>
        ) : (
          <>

            <MessageList
              currentUser={authUser || currentUser}
              channelId={resolvedChannelId}
              refreshKey={messageRefreshKey}
              onOpenThread={setThreadMessage}
            />


            <MessageInput
              workspace={workspace}
              workspaceId={resolvedWorkspaceId}
              channel={activeChannel || channel}
              channelId={resolvedChannelId}
              placeholder={`Message #${(activeChannel || channel)?.channelName || "channel"}`}
              onMessageSent={refreshMessages}
            />
          </>
        )}
      </div>

      {threadMessage && (
        <ThreadPanel
          message={threadMessage}
          currentUser={authUser || currentUser}
          onClose={() => setThreadMessage(null)}
          onThreadUpdated={(updatedMessage) => {
            if (updatedMessage) {
              setThreadMessage(updatedMessage);
            }
            refreshMessages();
          }}
        />
      )}
    </section>
  );
}

export default ChannelScreen;
