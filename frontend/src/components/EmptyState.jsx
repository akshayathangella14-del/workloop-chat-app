import { motion } from "framer-motion";
import { emptyState } from "../styles/common";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        ...emptyState,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        minHeight: "240px",
        border: "1px dashed #CBD5E1",
        backgroundColor: "#F8FAFC",
      }}
    >
      {Icon && (
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            backgroundColor: "#E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            color: "#64748B",
          }}
        >
          <Icon size={28} strokeWidth={1.5} />
        </div>
      )}
      
      <h3
        style={{
          margin: 0,
          color: "#0F172A",
          fontSize: "18px",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>
      
      <p
        style={{
          margin: 0,
          color: "#64748B",
          fontSize: "14px",
          lineHeight: 1.5,
          maxWidth: "320px",
          marginBottom: action ? "24px" : 0,
        }}
      >
        {description}
      </p>

      {action && <div>{action}</div>}
    </motion.div>
  );
}
