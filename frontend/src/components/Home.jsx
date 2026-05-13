import { NavLink } from "react-router-dom";
import { useAuth } from "../store/authStore";
import {
  colors,
  primaryBtn,
  secondaryBtn,
} from "../styles/common";

const features = [
  {
    title: "Real-time messaging",
    description:
      "Collaborate instantly with channels, direct messages, reactions, and live updates.",
    icon: "⚡",
  },
  {
    title: "Organized workspaces",
    description:
      "Create dedicated workspaces for teams, projects, and departments.",
    icon: "🧩",
  },
  {
    title: "Smart reminders",
    description:
      "Stay focused with message reminders and priority notifications.",
    icon: "⏰",
  },
];

const stats = [
  {
    value: "24/7",
    label: "Realtime sync",
  },
  {
    value: "99.9%",
    label: "Reliable messaging",
  },
  {
    value: "Fast",
    label: "Modern collaboration",
  },
];

function Home() {
  const { currentUser, isAuthenticated } = useAuth();

  const workspacePath =
    currentUser?.role === "ADMIN"
      ? "/admin"
      : "/workspace";

  return (
    <div style={styles.page}>
      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroGlowOne} />
        <div style={styles.heroGlowTwo} />

        <div style={styles.heroContent}>
          <p style={styles.eyebrow}>
            MODERN TEAM COLLABORATION
          </p>

          <h1 style={styles.heroTitle}>
            Bring your team together in one workspace.
          </h1>

          <p style={styles.heroText}>
            WorkLoop helps teams communicate faster with
            channels, direct messages, reminders,
            file sharing, and realtime collaboration.
          </p>

          <div style={styles.heroActions}>
            <NavLink
              to={
                isAuthenticated
                  ? workspacePath
                  : "/register"
              }
              style={{
                ...primaryBtn,
                ...styles.primaryButton,
                textDecoration: "none",
              }}
            >
              {isAuthenticated
                ? "Open Workspace"
                : "Get Started"}
            </NavLink>

            <NavLink
              to={
                isAuthenticated
                  ? workspacePath
                  : "/login"
              }
              style={{
                ...secondaryBtn,
                ...styles.secondaryButton,
                textDecoration: "none",
              }}
            >
              {isAuthenticated
                ? "Dashboard"
                : "Sign In"}
            </NavLink>
          </div>

          <div style={styles.statsRow}>
            {stats.map((item) => (
              <div key={item.label}>
                <div style={styles.statValue}>
                  {item.value}
                </div>

                <div style={styles.statLabel}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* APP PREVIEW */}
        <div style={styles.previewWrapper}>
          <div style={styles.previewCard}>
            <div style={styles.previewSidebar}>
              <div style={styles.workspaceLogo}>
                W
              </div>

              <div style={styles.sidebarActive}>
                # product-launch
              </div>

              <div style={styles.sidebarItem}>
                # engineering
              </div>

              <div style={styles.sidebarItem}>
                # design-team
              </div>

              <div style={styles.sidebarItem}>
                # announcements
              </div>
            </div>

            <div style={styles.previewChat}>
              <div style={styles.chatHeader}>
                <div>
                  <div style={styles.chatTitle}>
                    # product-launch
                  </div>

                  <div style={styles.chatMeta}>
                    24 members online
                  </div>
                </div>

                <div style={styles.onlineBadge}>
                  Active
                </div>
              </div>

              <div style={styles.messageList}>
                <div style={styles.messageRow}>
                  <div style={styles.avatarPurple}>
                    R
                  </div>

                  <div>
                    <div style={styles.messageMeta}>
                      Rahul · 10:08 AM
                    </div>

                    <div style={styles.messageBubble}>
                      The deployment pipeline is ready
                      for production 🚀
                    </div>
                  </div>
                </div>

                <div style={styles.messageRow}>
                  <div style={styles.avatarGreen}>
                    M
                  </div>

                  <div>
                    <div style={styles.messageMeta}>
                      Maya · 10:12 AM
                    </div>

                    <div style={styles.messageBubble}>
                      Great. I finished the dashboard
                      UI updates.
                    </div>

                    <div style={styles.reactionRow}>
                      👍 🎉 🔥
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.composer}>
                Message #product-launch
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionEyebrow}>
            FEATURES
          </p>

          <h2 style={styles.sectionTitle}>
            Everything your team needs
          </h2>

          <p style={styles.sectionText}>
            Designed for modern teams that need
            realtime collaboration without complexity.
          </p>
        </div>

        <div style={styles.featureGrid}>
          {features.map((feature) => (
            <div
              key={feature.title}
              style={styles.featureCard}
            >
              <div style={styles.featureIcon}>
                {feature.icon}
              </div>

              <h3 style={styles.featureTitle}>
                {feature.title}
              </h3>

              <p style={styles.featureDescription}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          <h2 style={styles.ctaTitle}>
            Ready to collaborate with your team?
          </h2>

          <p style={styles.ctaText}>
            Launch your workspace and start
            communicating in seconds.
          </p>

          <NavLink
            to={
              isAuthenticated
                ? workspacePath
                : "/register"
            }
            style={{
              ...primaryBtn,
              ...styles.ctaButton,
              textDecoration: "none",
            }}
          >
            Launch Workspace
          </NavLink>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerTop}>
          {/* LEFT */}
          <div style={styles.footerBrandSection}>
            <div style={styles.footerLogoRow}>
              <div style={styles.footerLogo}>W</div>

              <div>
                <div style={styles.footerBrand}>
                  WorkLoop
                </div>

                <div style={styles.footerText}>
                  Real-time collaboration platform for
                  modern teams and workspaces.
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={styles.footerLinksWrapper}>
            <div style={styles.footerColumn}>
              <div style={styles.footerHeading}>
                Product
              </div>

              <span style={styles.footerLink}>
                Channels
              </span>

              <span style={styles.footerLink}>
                Messaging
              </span>

              <span style={styles.footerLink}>
                Notifications
              </span>

              <span style={styles.footerLink}>
                File sharing
              </span>
            </div>

            <div style={styles.footerColumn}>
              <div style={styles.footerHeading}>
                Platform
              </div>

              <span style={styles.footerLink}>
                Workspaces
              </span>

              <span style={styles.footerLink}>
                Team chat
              </span>

              <span style={styles.footerLink}>
                Realtime updates
              </span>

              <span style={styles.footerLink}>
                Reminders
              </span>
            </div>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <span>
            © 2025 WorkLoop. All rights reserved.
          </span>

          <span>
            Built with React, Node.js, MongoDB &
            Socket.IO
          </span>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
  },

  hero: {
    position: "relative",
    minHeight: "calc(100vh - 64px)",
    background:
      "linear-gradient(135deg,#140d22 0%,#1d1028 60%,#24113a 100%)",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(350px,1fr))",
    gap: "60px",
    alignItems: "center",
    padding: "80px 6vw",
    overflow: "hidden",
  },

  heroGlowOne: {
    position: "absolute",
    top: "-120px",
    left: "-100px",
    width: "320px",
    height: "320px",
    background: "#611f69",
    borderRadius: "50%",
    filter: "blur(100px)",
    opacity: 0.15,
  },

  heroGlowTwo: {
    position: "absolute",
    bottom: "-140px",
    right: "-100px",
    width: "320px",
    height: "320px",
    background: "#2563eb",
    borderRadius: "50%",
    filter: "blur(100px)",
    opacity: 0.1,
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
  },

  eyebrow: {
    color: "#6ee7b7",
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    marginBottom: "18px",
  },

  heroTitle: {
    fontSize: "clamp(52px,6vw,72px)",
    lineHeight: 1.02,
    fontWeight: 900,
    color: "white",
    margin: 0,
    maxWidth: "700px",
  },

  heroText: {
    marginTop: "26px",
    fontSize: "20px",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.72)",
    maxWidth: "620px",
  },

  heroActions: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginTop: "36px",
  },

  primaryButton: {
    background: colors.primary,
    borderRadius: "12px",
    padding: "15px 26px",
    fontWeight: 800,
    fontSize: "15px",
    boxShadow:
      "0 16px 40px rgba(97,31,105,0.35)",
  },

  secondaryButton: {
    borderRadius: "12px",
    padding: "15px 26px",
    fontWeight: 800,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
    backdropFilter: "blur(10px)",
  },

  statsRow: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
    marginTop: "50px",
  },

  statValue: {
    color: "white",
    fontSize: "30px",
    fontWeight: 900,
  },

  statLabel: {
    marginTop: "6px",
    color: "rgba(255,255,255,0.62)",
    fontSize: "14px",
  },

  previewWrapper: {
    position: "relative",
    zIndex: 2,
  },

  previewCard: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    minHeight: "560px",
    borderRadius: "26px",
    overflow: "hidden",
    border:
      "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    boxShadow:
      "0 24px 80px rgba(0,0,0,0.45)",
  },

  previewSidebar: {
    background:
      "linear-gradient(180deg,#2e1065,#1d1028)",
    padding: "24px 18px",
  },

  workspaceLogo: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg,#7c3aed,#9333ea)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 900,
    fontSize: "20px",
    marginBottom: "28px",
  },

  sidebarActive: {
    padding: "12px 14px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.12)",
    color: "white",
    fontWeight: 700,
    marginBottom: "10px",
  },

  sidebarItem: {
    padding: "12px 14px",
    borderRadius: "12px",
    color: "rgba(255,255,255,0.72)",
    marginBottom: "10px",
  },

  previewChat: {
    background: "#f8fafc",
    display: "flex",
    flexDirection: "column",
  },

  chatHeader: {
    padding: "24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  chatTitle: {
    fontWeight: 800,
    fontSize: "18px",
    color: "#111827",
  },

  chatMeta: {
    marginTop: "4px",
    fontSize: "13px",
    color: "#64748b",
  },

  onlineBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: 800,
    fontSize: "12px",
  },

  messageList: {
    flex: 1,
    padding: "20px",
  },

  messageRow: {
    display: "grid",
    gridTemplateColumns: "48px 1fr",
    gap: "14px",
    marginBottom: "26px",
  },

  avatarPurple: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#7c3aed",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },

  avatarGreen: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#16a34a",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },

  messageMeta: {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "8px",
  },

  messageBubble: {
    background: "white",
    padding: "16px 18px",
    borderRadius: "18px",
    color: "#111827",
    lineHeight: 1.6,
    boxShadow:
      "0 10px 24px rgba(15,23,42,0.06)",
    maxWidth: "90%",
  },

  reactionRow: {
    marginTop: "10px",
    display: "flex",
    gap: "8px",
    fontSize: "18px",
  },

  composer: {
    margin: "20px",
    padding: "16px 18px",
    borderRadius: "14px",
    border: "1px solid #dbe4ee",
    color: "#94a3b8",
    background: "white",
  },

  featuresSection: {
    padding: "100px 6vw",
    background: "#ffffff",
  },

  sectionHeader: {
    textAlign: "center",
    maxWidth: "760px",
    margin: "0 auto 70px",
  },

  sectionEyebrow: {
    color: colors.primary,
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    marginBottom: "14px",
  },

  sectionTitle: {
    fontSize: "48px",
    lineHeight: 1.1,
    margin: 0,
    color: "#111827",
    fontWeight: 900,
  },

  sectionText: {
    marginTop: "20px",
    fontSize: "18px",
    lineHeight: 1.7,
    color: "#64748b",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
    gap: "24px",
  },

  featureCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "34px",
    boxShadow:
      "0 14px 40px rgba(15,23,42,0.05)",
  },

  featureIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "18px",
    background: "#f3e8ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    marginBottom: "24px",
  },

  featureTitle: {
    margin: 0,
    fontSize: "26px",
    color: "#111827",
    fontWeight: 850,
  },

  featureDescription: {
    marginTop: "14px",
    color: "#64748b",
    lineHeight: 1.8,
    fontSize: "16px",
  },

  ctaSection: {
    padding: "0 6vw 100px",
    background: "#ffffff",
  },

  ctaCard: {
    background:
      "linear-gradient(135deg,#1d1028,#2a1737)",
    borderRadius: "32px",
    padding: "90px 40px",
    textAlign: "center",
    color: "white",
    boxShadow:
      "0 24px 80px rgba(15,23,42,0.18)",
  },

  ctaTitle: {
    margin: 0,
    fontSize: "56px",
    lineHeight: 1.1,
    fontWeight: 900,
  },

  ctaText: {
    marginTop: "22px",
    color: "rgba(255,255,255,0.72)",
    fontSize: "20px",
  },

  ctaButton: {
    marginTop: "34px",
    display: "inline-flex",
    borderRadius: "14px",
    padding: "16px 28px",
    background: "#ffffff",
    color: colors.primary,
    fontWeight: 900,
  },

  footer: {
  background: "#12091c",
  padding: "70px 6vw 30px",
  color: "white",
  borderTop: "1px solid rgba(255,255,255,0.06)",
},

footerTop: {
  display: "flex",
  justifyContent: "space-between",
  gap: "60px",
  flexWrap: "wrap",
},

footerBrandSection: {
  flex: 1,
  minWidth: "280px",
},

footerLogoRow: {
  display: "flex",
  gap: "18px",
  alignItems: "flex-start",
},

footerLogo: {
  width: "54px",
  height: "54px",
  borderRadius: "16px",
  background:
    "linear-gradient(135deg,#7c3aed,#611f69)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  fontSize: "22px",
  color: "white",
  flexShrink: 0,
},

footerBrand: {
  fontSize: "30px",
  fontWeight: 900,
},

footerText: {
  marginTop: "12px",
  color: "rgba(255,255,255,0.65)",
  lineHeight: 1.8,
  maxWidth: "420px",
  fontSize: "15px",
},

footerLinksWrapper: {
  display: "flex",
  gap: "70px",
  flexWrap: "wrap",
},

footerColumn: {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
},

footerHeading: {
  fontWeight: 800,
  fontSize: "16px",
  marginBottom: "6px",
  color: "white",
},

footerLink: {
  color: "rgba(255,255,255,0.65)",
  cursor: "pointer",
  transition: "0.2s",
  fontSize: "15px",
},

footerBottom: {
  marginTop: "50px",
  paddingTop: "24px",
  borderTop: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  color: "rgba(255,255,255,0.5)",
  fontSize: "14px",
},
};

export default Home;