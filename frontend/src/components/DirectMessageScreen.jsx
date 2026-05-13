import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import ThreadPanel from "./ThreadPanel";
import {
  chatLayout,
  chatLayoutWithThread,
  chatPanel,
  errorText,
  loading as loadingStyle,
  mutedText,
} from "../styles/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const requestConfig = { withCredentials: true };

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const getErrorMessage = (err) =>
  err?.response?.data?.error ||
  err?.response?.data?.message ||
  err?.message ||
  "Unable to load direct message";

function DirectMessageScreen({
  workspace,
  workspaceId,
  user,
  receiver,
  receiverId,
  currentUser,
  onlineUsers = [],
  onUserResolved,
}) {
  const params = useParams();
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(currentUser || null);
  const [activeUser, setActiveUser] = useState(receiver || user || null);
  const [threadMessage, setThreadMessage] = useState(null);
  const [messageRefreshKey, setMessageRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resolvedWorkspaceId = workspaceId || getId(workspace) || params.workspaceId;
  const resolvedReceiverId =
    receiverId || getId(receiver) || getId(user) || getId(activeUser) || params.receiverId;
  const isReceiverOnline = onlineUsers.includes(resolvedReceiverId);

  const refreshMessages = () => {
    setMessageRefreshKey((prev) => prev + 1);
  };

  const loadAuthUser = useCallback(async () => {
    if (currentUser) {
      setAuthUser(currentUser);
      return;
    }

    const res = await axios.get(`${BASE_URL}/auth/check-auth`, requestConfig);
    setAuthUser(res.data?.payload || null);
  }, [currentUser]);

  const loadReceiver = useCallback(async () => {
    if (receiver || user || !resolvedWorkspaceId || !resolvedReceiverId) {
      const nextUser = receiver || user || null;
      setActiveUser(nextUser);
      onUserResolved?.(nextUser);
      return;
    }

    const res = await axios.get(
      `${BASE_URL}/dm-api/users/${resolvedWorkspaceId}`,
      requestConfig
    );
    const nextUser = (res.data?.payload || []).find(
      (item) => getId(item) === resolvedReceiverId
    );

    setActiveUser(nextUser || null);
    onUserResolved?.(nextUser || null);
  }, [onUserResolved, receiver, resolvedReceiverId, resolvedWorkspaceId, user]);

  const loadScreen = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      await Promise.all([loadAuthUser(), loadReceiver()]);
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
  }, [loadAuthUser, loadReceiver, navigate]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      loadScreen();
    }, 0);

    return () => clearTimeout(timerId);
  }, [loadScreen]);

  if (loading) {
    return <div style={loadingStyle}>Loading conversation...</div>;
  }

  return (
    <section style={threadMessage ? chatLayoutWithThread : chatLayout}>
      <div style={chatPanel}>
        <ChatHeader
          user={activeUser || receiver || user}
          isOnline={isReceiverOnline}
        />

        {error && <p style={errorText}>{error}</p>}

        {!resolvedWorkspaceId || !resolvedReceiverId ? (
          <p style={mutedText}>Select a teammate to start a direct message.</p>
        ) : (
          <>

            <MessageList
              currentUser={authUser || currentUser}
              messageType="DIRECT"
              workspaceId={resolvedWorkspaceId}
              receiverId={resolvedReceiverId}
              refreshKey={messageRefreshKey}
              onOpenThread={setThreadMessage}
            />



            <MessageInput
              workspace={workspace}
              workspaceId={resolvedWorkspaceId}
              receiver={activeUser || receiver || user}
              receiverId={resolvedReceiverId}
              messageType="DIRECT"
              placeholder={`Message ${(activeUser || receiver || user)?.firstName || "teammate"}`}
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

export default DirectMessageScreen;
