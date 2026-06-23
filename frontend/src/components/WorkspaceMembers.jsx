import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, X, Filter, Users, Shield, User } from "lucide-react";
import EmptyState from "./EmptyState";
import { getPriorityStyle } from "../styles/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const requestConfig = { withCredentials: true };

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

const getFullName = (user) => {
  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  return name || user?.email || "User";
};

const getInitials = (user) => {
  const first = user?.firstName?.trim()?.[0] || "";
  const last = user?.lastName?.trim()?.[0] || "";
  return `${first}${last}`.toUpperCase() || "U";
};

function WorkspaceMembers({ workspace, currentUser, onlineUsers = [], onMemberAdded }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL"); // ALL, OWNER, ADMIN, MEMBER
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentUserId = getId(currentUser);
  const currentMember = useMemo(
    () => workspace?.members?.find((member) => getId(member.user) === currentUserId),
    [currentUserId, workspace]
  );

  const canManageMembers = ["OWNER", "ADMIN"].includes(currentMember?.role);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await axios.put(
        `${BASE_URL}/workspace-api/workspace/member`,
        {
          workspaceId: getId(workspace),
          email: email.trim().toLowerCase(),
          role,
        },
        requestConfig
      );
      setEmail("");
      setRole("MEMBER");
      setSuccess("Member invited successfully");
      setIsAddModalOpen(false);
      await onMemberAdded?.();
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to add member");
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = useMemo(() => {
    return (workspace?.members || []).filter(member => {
      const user = member.user;
      const name = getFullName(user).toLowerCase();
      const userEmail = (user?.email || "").toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch = name.includes(q) || userEmail.includes(q);
      const matchesRole = roleFilter === "ALL" || member.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [workspace, searchQuery, roleFilter]);

  if (!workspace) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F8FAFC" }}>
      <div style={{ padding: "32px", background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>Team Directory</h2>
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#64748B" }}>Manage {workspace.members?.length || 0} workspace members and their roles.</p>
          </div>
          {canManageMembers && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "#0F172A", color: "#FFFFFF", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
            >
              <UserPlus size={16} /> Invite Member
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "10px 14px 10px 38px", borderRadius: "10px", border: "1px solid #E2E8F0", background: "#F8FAFC", fontSize: "14px", color: "#0F172A", outline: "none" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Filter size={16} color="#64748B" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #E2E8F0", background: "#FFFFFF", fontSize: "14px", color: "#0F172A", outline: "none", cursor: "pointer" }}
            >
              <option value="ALL">All Roles</option>
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
        {filteredMembers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No members found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {filteredMembers.map((member, idx) => {
              const user = member.user;
              const isOnline = onlineUsers.includes(getId(user));
              
              return (
                <motion.div
                  key={getId(user) || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 4px 20px rgba(15,23,42,0.02)" }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ position: "relative" }}>
                        {user?.profileImageUrl ? (
                          <img src={user.profileImageUrl} alt="" style={{ width: "48px", height: "48px", borderRadius: "12px", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, color: "#64748B" }}>
                            {getInitials(user)}
                          </div>
                        )}
                        <div style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "14px", height: "14px", borderRadius: "50%", background: isOnline ? "#10B981" : "#94A3B8", border: "2px solid #FFFFFF" }} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>{getFullName(user)}</h3>
                        <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#64748B" }}>{isOnline ? "Active now" : "Offline"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F1F5F9", paddingTop: "16px" }}>
                    <p style={{ margin: 0, fontSize: "13px", color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>
                      {user?.email || "No email"}
                    </p>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, background: member.role === "OWNER" ? "#FEF2F2" : member.role === "ADMIN" ? "#F0FDFA" : "#F1F5F9", color: member.role === "OWNER" ? "#EF4444" : member.role === "ADMIN" ? "#0D9488" : "#64748B" }}>
                      {member.role === "OWNER" ? <Shield size={12} /> : member.role === "ADMIN" ? <Shield size={12} /> : <User size={12} />}
                      {member.role}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              style={{ position: "fixed", inset: 0, background: "#000", zIndex: 100 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#FFFFFF", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "440px", zIndex: 101, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>Invite to Workspace</h2>
                <button onClick={() => setIsAddModalOpen(false)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>Email address</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="colleague@company.com" style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none" }} />
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>Workspace Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none", background: "#FFFFFF" }}>
                    <option value="MEMBER">Member - Can post and create channels</option>
                    <option value="ADMIN">Admin - Can manage workspace settings</option>
                  </select>
                </div>
                {error && <div style={{ padding: "12px", background: "#FEF2F2", color: "#EF4444", borderRadius: "10px", fontSize: "13px", fontWeight: 500, marginBottom: "20px" }}>{error}</div>}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                  <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#64748B", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                  <button type="submit" disabled={loading} style={{ padding: "10px 24px", borderRadius: "10px", border: "none", background: "#0F172A", color: "#FFFFFF", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Sending Invite..." : "Send Invite"}</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WorkspaceMembers;
