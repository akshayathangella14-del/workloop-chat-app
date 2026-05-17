import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../store/chatStore";
import {
  composerInput,
  composerToolbar,
  composerTools,
  compactSelect,
  dateInput,
  errorText,
  fileMeta,
  fileName,
  filePreview,
  fileUploadBox,
  ghostBtn,
  messageComposer,
  messageInputWrap,
  primaryBtn,
  successText,
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
  "Unable to send message";

function MessageInput({
  workspace,
  workspaceId,
  channel,
  channelId,
  receiver,
  receiverId,
  messageType = "CHANNEL",
  placeholder,
  onMessageSent,
}) {
  const fileRef = useRef(null);
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [reminderTime, setReminderTime] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { sendSocketMessage } = useChat();

  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const timerId = setTimeout(() => {
      setSuccess("");
    }, 2200);

    return () => clearTimeout(timerId);
  }, [success]);

  const resolvedWorkspaceId = workspaceId || getId(workspace);
  const resolvedChannelId = channelId || getId(channel);
  const resolvedReceiverId = receiverId || getId(receiver);
  const isDirect = messageType === "DIRECT";

  const resetForm = () => {
    setContent("");
    setPriority("LOW");
    setReminderTime("");
    setFile(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const buildBasePayload = () => ({
    workspace: resolvedWorkspaceId,
    priority,
    ...(reminderTime ? { reminderTime: new Date(reminderTime).toISOString() } : {}),
    ...(content.trim() ? { content: content.trim() } : {}),
    ...(isDirect
      ? { receiver: resolvedReceiverId }
      : { channel: resolvedChannelId }),
  });

  const sendTextMessage = async () => {
    const endpoint = isDirect
      ? `${BASE_URL}/message-api/direct-message`
      : `${BASE_URL}/message-api/channel-message`;

    return axios.post(endpoint, buildBasePayload(), requestConfig);
  };

  const sendFileMessage = async () => {
    const formData = new FormData();
    const basePayload = buildBasePayload();

    Object.entries(basePayload).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    formData.append("messageType", isDirect ? "DIRECT" : "CHANNEL");
    formData.append("file", file);

    return axios.post(`${BASE_URL}/message-api/file-message`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resolvedWorkspaceId) {
      setError("Workspace is required");
      return;
    }

    if (!isDirect && !resolvedChannelId) {
      setError("Channel is required");
      return;
    }

    if (isDirect && !resolvedReceiverId) {
      setError("Receiver is required");
      return;
    }

    if (!content.trim() && !file) {
      setError("Write a message or attach a file");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = file ? await sendFileMessage() : await sendTextMessage();

      if (!file && res.data?.payload) {
        sendSocketMessage(res.data.payload);
      }


      resetForm();
      setSuccess("Message sent");
      onMessageSent?.(res.data?.payload);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) {
      return;
    }

    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
  };

  return (
    <form style={messageInputWrap} onSubmit={handleSubmit}>
      <div style={messageComposer}>
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError("");
            setSuccess("");
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            placeholder ||
            (isDirect ? "Send a direct message" : "Message this channel")
          }
          style={composerInput}
        />

        {file && (
          <div style={fileUploadBox}>
            <div style={filePreview}>
              <div>
                <div style={fileName}>{file.name}</div>
                <div style={fileMeta}>{Math.ceil(file.size / 1024)} KB</div>
              </div>
            </div>

            <button type="button" style={ghostBtn} onClick={() => setFile(null)}>
              Remove
            </button>
          </div>
        )}

        <div style={composerToolbar}>
          <div style={composerTools}>
            <input
              ref={fileRef}
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ display: "none" }}
            />

            <button
              type="button"
              style={ghostBtn}
              onClick={() => fileRef.current?.click()}
            >
              Attach file
            </button>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={compactSelect}
            >
              <option value="LOW">Low priority</option>
              <option value="MEDIUM">Medium priority</option>
              <option value="HIGH">High priority</option>
            </select>

            <input
              type="datetime-local"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              style={dateInput}
            />
          </div>

          <button type="submit" style={primaryBtn} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      {error && <p style={errorText}>{error}</p>}
      {success && <p style={successText}>{success}</p>}
    </form>
  );
}

export default MessageInput;
