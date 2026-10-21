import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../store/authStore";
import { useChat } from "../store/chatStore";

import ProfileMenu from "./ProfileMenu";
import { Menu } from "lucide-react";

import {
  adminGrid,
  adminHero,
  adminHeroText,
  adminHeroTitle,
  adminMain,
  adminShell,
  adminSidebar,
  adminStatCard,
  adminStatLabel,
  adminStatsGrid,
  adminStatValue,
  adminTable,
  adminTableCell,
  adminTableHeadCell,
  adminTopbar,
  card,
  emptyState,
  errorText,
  list,
  listItem,
  listItemMain,
  listItemMeta,
  listItemTitle,
  loading as loadingStyle,
  mutedText,
  roleBadge,
  sectionSubtitle,
  sectionTitle,
  sidebarBody,
  sidebarFooter,
  sidebarHeader,
  sidebarItem,
  sidebarItemActive,
  sidebarItemLabel,
  sidebarSection,
  sidebarSectionHeader,
  statusDot,
  statusDotOnline,
  statusLine,
  workspaceMeta,
  workspaceName,
} from "../styles/common";
import { api, getId } from "../services/api";

// Get user display name
const getFullName = (user) => {
  const name = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return name || user?.email || "User";
};

function AdminDashboard() {
  const navigate = useNavigate();

  const { currentUser, logout } = useAuth();

  const {
    onlineUsers,
    connectSocket,
    disconnectSocket,
  } = useChat();

  const [activeView, setActiveView] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Fetch dashboard analytics
  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin-api/dashboard");

      setDashboard(res.data?.payload || null);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Load dashboard on mount
  useEffect(() => {
    const timerId = setTimeout(() => {
      loadDashboard();
    }, 0);

    return () => clearTimeout(timerId);
  }, [loadDashboard]);

  useEffect(() => {
    if (!isSidebarOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  // Connect admin socket
  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  // Handle logout
  const handleLogout = async () => {
    disconnectSocket();

    await logout();

    navigate("/login", { replace: true });
  };

  const members = dashboard?.users || [];

  const workspaces = dashboard?.workspaces || [];

  // Dashboard statistics
  const stats = [
    {
      label: "Total workspaces",
      value: dashboard?.totalWorkspaces || 0,
    },
    {
      label: "Total channels",
      value: dashboard?.totalChannels || 0,
    },
    {
      label: "Registered users",
      value: dashboard?.totalUsers || 0,
    },
    {
      label: "Active users",
      value: dashboard?.activeUsers || 0,
    },
    {
      label: "Private channels",
      value: dashboard?.privateChannels || 0,
    },
  ];

  // Include current admin in online users
  const visibleOnlineUsers = useMemo(() => {
    const users = new Set(onlineUsers);

    const currentUserId = getId(currentUser);

    if (currentUserId) {
      users.add(currentUserId);
    }

    return Array.from(users);
  }, [currentUser, onlineUsers]);

  // Render workspace analytics
  const renderWorkspaceOverview = () => (
    <section style={card}>
      <h2 style={sectionTitle}>Workspace overview</h2>

      <p style={sectionSubtitle}>
        All active workspaces available in the platform.
      </p>

      {workspaces.length === 0 ? (
        <div style={emptyState}>No workspaces found.</div>
      ) : (
        <table style={adminTable}>
          <thead>
            <tr>
              <th style={adminTableHeadCell}>Workspace</th>
              <th style={adminTableHeadCell}>Owner</th>
              <th style={adminTableHeadCell}>Members</th>
            </tr>
          </thead>

          <tbody>
            {workspaces.map((workspace) => (
              <tr key={getId(workspace)}>
                <td style={adminTableCell}>
                  {workspace.workspaceName}
                </td>

                <td style={adminTableCell}>
                  {getFullName(workspace.owner)}
                </td>

                <td style={adminTableCell}>
                  {workspace.members?.length || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );

  // Render user analytics
  const renderMemberOverview = () => (
    <section style={card}>
      <h2 style={sectionTitle}>Users overview</h2>

      <p style={sectionSubtitle}>
        Registered platform users.
      </p>

      {members.length === 0 ? (
        <div style={emptyState}>No users found.</div>
      ) : (
        <div style={list}>
          {members
            .slice(
              0,
              activeView === "members" ? members.length : 6
            )
            .map((user) => {
              const userId = getId(user);

              const isOnline =
                visibleOnlineUsers.includes(userId);

              return (
                <article key={userId} style={listItem}>
                  <div style={listItemMain}>
                    <h3 style={listItemTitle}>
                      {getFullName(user)}
                    </h3>

                    <p style={listItemMeta}>
                      {user.email}
                    </p>

                    <p style={listItemMeta}>
                      <span style={statusLine}>
                        <span
                          style={
                            isOnline
                              ? statusDotOnline
                              : statusDot
                          }
                        />

                        <span>
                          {isOnline
                            ? "Active now"
                            : "Offline"}
                        </span>
                      </span>
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={roleBadge}>
                      {user.role}
                    </span>
                  </div>
                </article>
              );
            })}
        </div>
      )}
    </section>
  );

  // Render overview page
  const renderOverview = () => (
    <>
      <section style={adminHero}>
        <h1 style={adminHeroTitle}>
          Admin dashboard
        </h1>

        <p style={adminHeroText}>
          Platform-wide workspace, channel, and user analytics.
        </p>
      </section>

      <section style={adminStatsGrid}>
        {stats.map((stat) => (
          <article
            key={stat.label}
            style={adminStatCard}
          >
            <p style={adminStatLabel}>
              {stat.label}
            </p>

            <p style={adminStatValue}>
              {stat.value}
            </p>
          </article>
        ))}
      </section>

      <div className="admin-grid" style={adminGrid}>
        {renderWorkspaceOverview()}
        {renderMemberOverview()}
      </div>
    </>
  );

  // Render selected dashboard section
  const renderContent = () => {
    if (loading) {
      return (
        <div style={loadingStyle}>
          Loading admin dashboard...
        </div>
      );
    }

    if (activeView === "workspaces") {
      return renderWorkspaceOverview();
    }

    if (activeView === "members") {
      return renderMemberOverview();
    }

    return renderOverview();
  };

  const navItems = [
    ["overview", "Overview"],
    ["workspaces", "Workspaces"],
    ["members", "Members"],
  ];

  return (
    <div className="admin-shell" style={adminShell}>
      <button
        type="button"
        aria-label="Close admin navigation"
        className={`admin-sidebar-backdrop${isSidebarOpen ? " is-visible" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
        tabIndex={isSidebarOpen ? 0 : -1}
      />
      {/* SIDEBAR */}
      <aside id="admin-navigation" aria-label="Admin navigation" className={`admin-sidebar${isSidebarOpen ? " is-open" : ""}`} style={adminSidebar}>
        <div style={sidebarHeader}>
          <h2 style={workspaceName}>
            Admin Console
          </h2>

          <p style={workspaceMeta}>
            Platform analytics dashboard
          </p>
        </div>

        <div style={sidebarBody}>
          {/* Navigation */}
          <section style={sidebarSection}>
            <div style={sidebarSectionHeader}>
              Navigation
            </div>

            {navItems.map(([view, label]) => (
              <button
                key={view}
                type="button"
                style={
                  activeView === view
                    ? sidebarItemActive
                    : sidebarItem
                }
                onClick={() => {
                  setActiveView(view);
                  setIsSidebarOpen(false);
                }}
              >
                <span style={sidebarItemLabel}>
                  {label}
                </span>
              </button>
            ))}
          </section>

          {/* Privacy info */}
          <section style={sidebarSection}>
            <div style={sidebarSectionHeader}>
              Privacy
            </div>

            <p
              style={{
                ...mutedText,
                color: "rgba(255,255,255,0.68)",
                padding: "0 8px",
              }}
            >
              Admin dashboard only shows platform analytics and metadata.
            </p>
          </section>
        </div>

        {/* Profile menu */}
        <div style={sidebarFooter}>
          <ProfileMenu
            user={currentUser}
            onLogout={handleLogout}
          />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main" style={adminMain}>
        <div className="admin-topbar" style={adminTopbar}>
          <button
            type="button"
            aria-label="Open admin navigation"
            aria-controls="admin-navigation"
            className="admin-nav-toggle"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={19} aria-hidden="true" />
          </button>
          <div>
            <h1 style={sectionTitle}>
              Platform administration
            </h1>

            <p style={sectionSubtitle}>
              Role: {currentUser?.role || "ADMIN"}
            </p>
          </div>
        </div>

        {error && (
          <p style={errorText}>{error}</p>
        )}

        {renderContent()}
      </main>
    </div>
  );
}

export default AdminDashboard;