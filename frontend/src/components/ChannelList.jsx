import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  badge,
  emptyState,
  errorText,
  list,
  listItem,
  listItemMain,
  listItemMeta,
  listItemTitle,
  loading as loadingStyle,
  roleBadge,
  secondaryBtn,
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
  "Unable to load channels";

function ChannelList({
  workspaceId,
  channels: channelsProp,
  selectedChannel,
  onSelectChannel,
  onChannelsLoaded,
  onCreateChannel,
}) {
  const [channels, setChannels] = useState(channelsProp || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const visibleChannels = channelsProp || channels;

  const loadChannels = useCallback(async () => {
    if (!workspaceId) {
      setChannels([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${BASE_URL}/channel-api/channels/${workspaceId}`,
        requestConfig
      );

      const listData = res.data?.payload || [];
      setChannels(listData);
      onChannelsLoaded?.(listData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [onChannelsLoaded, workspaceId]);

  useEffect(() => {
    if (channelsProp) {
      return;
    }

    const timerId = setTimeout(() => {
      loadChannels();
    }, 0);

    return () => clearTimeout(timerId);
  }, [channelsProp, loadChannels]);

  if (loading) {
    return <div style={loadingStyle}>Loading channels...</div>;
  }

  return (
    <section>
      {error && <p style={errorText}>{error}</p>}

      {visibleChannels.length === 0 ? (
        <div style={emptyState}>
          No channels yet.
          {onCreateChannel && (
            <button type="button" style={secondaryBtn} onClick={onCreateChannel}>
              Create channel
            </button>
          )}
        </div>
      ) : (
        <div style={list}>
          {visibleChannels.map((channel) => {
            const isActive = getId(channel) === getId(selectedChannel);

            return (
              <button
                key={getId(channel)}
                type="button"
                style={{
                  ...listItem,
                  borderColor: isActive ? "#611f69" : listItem.borderColor,
                  cursor: "pointer",
                  textAlign: "left",
                }}
                onClick={() => onSelectChannel?.(channel)}
              >
                <div style={listItemMain}>
                  <h3 style={listItemTitle}># {channel.channelName}</h3>
                  <p style={listItemMeta}>
                    {channel.description || `${channel.channelType} channel`}
                  </p>
                </div>

                <span style={channel.channelType === "PRIVATE" ? badge : roleBadge}>
                  {channel.channelType === "PRIVATE" ? "P" : "Public"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ChannelList;
