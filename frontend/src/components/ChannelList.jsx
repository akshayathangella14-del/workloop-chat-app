import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Hash, Users, Plus } from "lucide-react";
import EmptyState from "./EmptyState";
import { loading as loadingStyle } from "../styles/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const requestConfig = { withCredentials: true };

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

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
      const res = await axios.get(`${BASE_URL}/channel-api/channels/${workspaceId}`, requestConfig);
      const listData = res.data?.payload || [];
      setChannels(listData);
      onChannelsLoaded?.(listData);
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to load channels");
    } finally {
      setLoading(false);
    }
  }, [onChannelsLoaded, workspaceId]);

  useEffect(() => {
    if (channelsProp) return;
    loadChannels();
  }, [channelsProp, loadChannels]);

  if (loading) {
    return <div style={loadingStyle}>Loading channels...</div>;
  }

  return (
    <section style={{ padding: "16px 0" }}>
      {error && <p style={{ color: "#EF4444", fontSize: "13px", padding: "0 16px" }}>{error}</p>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", marginBottom: "12px" }}>
        <h2 style={{ fontSize: "12px", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Channels</h2>
        {onCreateChannel && (
          <button onClick={onCreateChannel} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px", borderRadius: "4px" }}>
            <Plus size={16} />
          </button>
        )}
      </div>

      {visibleChannels.length === 0 ? (
        <div style={{ padding: "0 16px" }}>
          <EmptyState
            icon={Hash}
            title="No channels"
            description="Channels are where your team communicates."
          />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "0 8px" }}>
          {visibleChannels.map((channel, idx) => {
            const isActive = getId(channel) === getId(selectedChannel);
            return (
              <motion.button
                key={getId(channel)}
                whileHover={{ backgroundColor: isActive ? "#EEF2FF" : "#F1F5F9" }}
                onClick={() => onSelectChannel?.(channel)}
                style={{
                  padding: "10px 12px",
                  border: "none",
                  borderRadius: "8px",
                  background: isActive ? "#EEF2FF" : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "background 0.2s",
                  width: "100%",
                }}
              >
                <Hash size={18} color={isActive ? "#6366F1" : "#64748B"} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: 0, fontSize: "15px", fontWeight: isActive ? 700 : 500, color: isActive ? "#4338CA" : "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {channel.channelName}
                  </h3>
                </div>
                {/* Activity indicator */}
                {!isActive && idx % 3 === 0 && (
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#14B8A6" }} />
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ChannelList;
