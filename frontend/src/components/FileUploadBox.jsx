import { useEffect, useRef, useState } from "react";
import {
  errorText,
  fileMeta,
  fileName,
  filePreview,
  fileUploadBox,
  ghostBtn,
  primaryBtn,
  successText,
  toolbar,
} from "../styles/common";
import { api, getId, getErrorMessage } from "../services/api";

const formatFileSize = (size = 0) => {
  if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

function FileUploadBox({
  workspace,
  workspaceId,
  channel,
  channelId,
  receiver,
  receiverId,
  messageType = "CHANNEL",
  content = "",
  priority = "LOW",
  reminderTime = "",
  disabled = false,
  onFileSelected,
  onFileUploaded,
}) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const timerId = setTimeout(() => {
      setSuccess("");
    }, 3200);

    return () => clearTimeout(timerId);
  }, [success]);

  const resolvedWorkspaceId = workspaceId || getId(workspace);
  const resolvedChannelId = channelId || getId(channel);
  const resolvedReceiverId = receiverId || getId(receiver);
  const isDirect = messageType === "DIRECT";

  const clearFile = () => {
    setFile(null);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onFileSelected?.(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;

    setFile(selectedFile);
    setError("");
    setSuccess("");
    onFileSelected?.(selectedFile);
  };

  const buildPayload = () => {
    const payload = new FormData();

    payload.append("workspace", resolvedWorkspaceId);
    payload.append("messageType", isDirect ? "DIRECT" : "CHANNEL");
    payload.append("priority", priority || "LOW");

    if (content.trim()) payload.append("content", content.trim());
    if (reminderTime) payload.append("reminderTime", new Date(reminderTime).toISOString());
    if (isDirect) payload.append("receiver", resolvedReceiverId);
    if (!isDirect) payload.append("channel", resolvedChannelId);
    if (file) payload.append("file", file);

    return payload;
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Choose a file first");
      return;
    }

    if (!resolvedWorkspaceId) {
      setError("Workspace is required");
      return;
    }

    if (isDirect && !resolvedReceiverId) {
      setError("Receiver is required");
      return;
    }

    if (!isDirect && !resolvedChannelId) {
      setError("Channel is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await api.post("/message-api/file-message", buildPayload(), {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("File shared successfully");
      clearFile();
      onFileUploaded?.(res.data?.payload);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={fileUploadBox}>
        <div style={filePreview}>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            disabled={disabled || loading}
          />

          {file && (
            <div>
              <div style={fileName}>{file.name}</div>
              <div style={fileMeta}>{formatFileSize(file.size)}</div>
            </div>
          )}
        </div>

        <div style={toolbar}>
          {file && (
            <button type="button" style={ghostBtn} onClick={clearFile}>
              Remove
            </button>
          )}

          <button
            type="button"
            style={primaryBtn}
            onClick={handleUpload}
            disabled={disabled || loading || !file}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {error && <p style={errorText}>{error}</p>}
      {success && <p style={successText}>{success}</p>}
    </div>
  );
}

export default FileUploadBox;
