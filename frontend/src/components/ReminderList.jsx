import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle, Bell, MoreVertical, Calendar } from "lucide-react";
import EmptyState from "./EmptyState";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const requestConfig = { withCredentials: true };

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const formatTime = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "HIGH": return { bg: "#FEE2E2", text: "#EF4444", border: "#FECACA" };
    case "MEDIUM": return { bg: "#FEF3C7", text: "#F59E0B", border: "#FDE68A" };
    default: return { bg: "#F1F5F9", text: "#64748B", border: "#E2E8F0" };
  }
};

function ReminderList({
  reminders: remindersProp,
  workspaceId,
  currentUser,
  onRemindersChange,
  onRefresh,
}) {
  const [reminders, setReminders] = useState(remindersProp || []);
  const [loading, setLoading] = useState(false);
  const hasControlledReminders = Array.isArray(remindersProp);
  const visibleReminders = remindersProp ?? reminders;
  
  const filteredReminders = workspaceId
    ? visibleReminders.filter((item) => getId(item.workspace) === workspaceId)
    : visibleReminders;

  const updateReminders = useCallback((next) => {
    setReminders(next);
    onRemindersChange?.(next);
  }, [onRemindersChange]);

  const loadReminders = useCallback(async () => {
    if (onRefresh) {
      try {
        setLoading(true);
        const next = await onRefresh();
        if (!hasControlledReminders && Array.isArray(next)) updateReminders(next);
      } finally {
        setLoading(false);
      }
      return;
    }
    if (hasControlledReminders) return;
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/message-api/reminders`, requestConfig);
      updateReminders(res.data?.payload || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [hasControlledReminders, onRefresh, updateReminders]);

  useEffect(() => {
    if (hasControlledReminders) return;
    loadReminders();
    const intervalId = setInterval(loadReminders, 30000);
    return () => clearInterval(intervalId);
  }, [hasControlledReminders, loadReminders]);

  const groups = {
    Today: [],
    Upcoming: [],
  };

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  filteredReminders.forEach(r => {
    const rDate = new Date(r.reminderTime);
    if (rDate <= today) groups.Today.push(r);
    else groups.Upcoming.push(r);
  });

  if (loading && filteredReminders.length === 0) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>Loading reminders...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", padding: "24px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>Reminders</h2>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#64748B" }}>Manage your upcoming tasks and priority messages.</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "#0F172A", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
          <Clock size={16} /> New Reminder
        </button>
      </div>

      {filteredReminders.length === 0 ? (
        <div style={{ padding: "0 32px" }}>
          <EmptyState
            icon={Calendar}
            title="Your schedule is clear!"
            description="You don't have any upcoming reminders. Set reminders on messages to follow up later."
          />
        </div>
      ) : (
        <div style={{ padding: "0 32px", display: "flex", flexDirection: "column", gap: "32px" }}>
          {Object.entries(groups).map(([groupName, items]) => (
            items.length > 0 && (
              <div key={groupName}>
                <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {groupName} ({items.length})
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
                  {items.map((reminder, idx) => {
                    const pColor = getPriorityColor(reminder.priority);
                    return (
                      <motion.div
                        key={getId(reminder)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid #E2E8F0",
                          borderRadius: "16px",
                          padding: "20px",
                          boxShadow: "0 4px 20px rgba(15,23,42,0.03)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: pColor.text }} />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                          <span style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 700,
                            background: pColor.bg,
                            color: pColor.text,
                            border: `1px solid ${pColor.border}`
                          }}>
                            {reminder.priority || "LOW"}
                          </span>
                          <button style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>
                            <MoreVertical size={16} />
                          </button>
                        </div>
                        <p style={{ margin: "0 0 16px", fontSize: "15px", color: "#0F172A", lineHeight: 1.5, fontWeight: 500 }}>
                          {reminder.content || "Reminder message"}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", paddingTop: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748B", fontSize: "13px", fontWeight: 600 }}>
                            <Clock size={14} color={pColor.text} />
                            {formatTime(reminder.reminderTime)}
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#F1F5F9", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", cursor: "pointer" }}>
                              <Bell size={14} />
                            </button>
                            <button style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#F0FDFA", border: "1px solid #CCFBF1", display: "flex", alignItems: "center", justifyContent: "center", color: "#0D9488", cursor: "pointer" }}>
                              <CheckCircle size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default ReminderList;
