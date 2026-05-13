import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  avatar,
  avatarImage,
  card,
  errorText,
  form,
  formGroup,
  input,
  label,
  memberCard,
  memberGrid,
  mutedText,
  primaryBtn,
  roleBadge,
  sectionSubtitle,
  sectionTitle,
  select,
  statusDot,
  statusDotOnline,
  statusLine,
  successText,
} from "../styles/common";

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

const getErrorMessage = (err) =>
  err?.response?.data?.error ||
  err?.response?.data?.message ||
  err?.message ||
  "Unable to add member";

function WorkspaceMembers({ workspace, currentUser, onlineUsers = [], onMemberAdded }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
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

  const currentUserId = getId(currentUser);

  const currentMember = useMemo(
    () =>
      workspace?.members?.find((member) => getId(member.user) === currentUserId),
    [currentUserId, workspace]
  );

  const canManageMembers = ["OWNER", "ADMIN"].includes(currentMember?.role);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

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
      setSuccess("Member added successfully");
      await onMemberAdded?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!workspace) {
    return null;
  }

  return (
    <section style={card}>
      <h2 style={sectionTitle}>Members</h2>
      <p style={sectionSubtitle}>
        {workspace.members?.length || 0} people are part of this workspace.
      </p>

      {canManageMembers && (
        <form style={form} onSubmit={handleSubmit}>
          <div style={formGroup}>
            <label style={label} htmlFor="memberEmail">
              Add member by email
            </label>
            <input
              id="memberEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@company.com"
              style={input}
            />
          </div>

          <div style={formGroup}>
            <label style={label} htmlFor="memberRole">
              Workspace role
            </label>
            <select
              id="memberRole"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={select}
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {error && <p style={errorText}>{error}</p>}
          {success && <p style={successText}>{success}</p>}

          <button type="submit" style={primaryBtn} disabled={loading}>
            {loading ? "Adding..." : "Add member"}
          </button>
        </form>
      )}

      {!canManageMembers && (
        <p style={mutedText}>Only workspace owners and admins can add members.</p>
      )}

      <div style={memberGrid}>
        {workspace.members?.map((member) => {
          const user = member.user;
          const isOnline = onlineUsers.includes(getId(user));

          return (
            <article key={getId(user) || getId(member)} style={memberCard}>
              <div style={avatar}>
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={getFullName(user)}
                    style={avatarImage}
                  />
                ) : (
                  getInitials(user)
                )}
              </div>

              <div>
                <h3 style={sectionTitle}>{getFullName(user)}</h3>
                <p style={sectionSubtitle}>{user?.email || "Member"}</p>
                <p style={sectionSubtitle}>
                  <span style={statusLine}>
                    <span style={isOnline ? statusDotOnline : statusDot} />
                    <span>{isOnline ? "Active now" : "Offline"}</span>
                  </span>
                </p>
                <span style={roleBadge}>{member.role}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default WorkspaceMembers;
