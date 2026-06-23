import { motion } from "framer-motion";

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
};

export default function ActivityFeed({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id || index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              backgroundColor: activity.iconBg || "#F1F5F9",
              color: activity.iconColor || "#64748B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {activity.icon || activity.initials}
          </div>
          
          <div style={{ flex: 1, minWidth: 0, paddingTop: "2px" }}>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#334155",
                lineHeight: 1.5,
              }}
            >
              <span style={{ fontWeight: 700, color: "#0F172A" }}>
                {activity.actor}
              </span>{" "}
              {activity.action}{" "}
              {activity.target && (
                <span style={{ fontWeight: 600, color: "#0F172A" }}>
                  {activity.target}
                </span>
              )}
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "12px",
                color: "#94A3B8",
                fontWeight: 500,
              }}
            >
              {formatTimeAgo(activity.timestamp)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
