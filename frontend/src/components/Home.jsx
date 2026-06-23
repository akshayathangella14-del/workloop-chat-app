import { NavLink } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { colors, primaryBtn, secondaryBtn } from "../styles/common";
import Logo from "./Logo";

const features = [
  {
    title: "Real-time messaging",
    description: "Collaborate instantly with channels, direct messages, reactions, and live updates.",
    icon: "⚡",
  },
  {
    title: "Organized workspaces",
    description: "Create dedicated workspaces for teams, projects, and departments.",
    icon: "🧩",
  },
  {
    title: "Smart reminders",
    description: "Stay focused with message reminders and priority notifications.",
    icon: "⏰",
  },
];

const stats = [
  { value: "0ms", label: "Realtime Latency" },
  { value: "100%", label: "Team Alignment" },
  { value: "Fast", label: "Workflow execution" },
];

export default function Home() {
  const { currentUser, isAuthenticated } = useAuth();
  const workspacePath = currentUser?.role === "ADMIN" ? "/admin" : "/workspace";

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerLogo}>
          <Logo width={36} height={36} />
          <span style={styles.headerBrand}>WorkLoop</span>
        </div>
        <div>
          <NavLink
            to={isAuthenticated ? workspacePath : "/login"}
            style={{ ...secondaryBtn, border: "none", background: "transparent", color: "white" }}
          >
            Sign In
          </NavLink>
        </div>
      </header>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroGlowOne} />
        <div style={styles.heroGlowTwo} />

        <div style={styles.heroContent}>
          <p style={styles.eyebrow}>THE PREMIUM COLLABORATION SUITE</p>

          <h1 style={styles.heroTitle}>Move fast, stay aligned, build together.</h1>

          <p style={styles.heroText}>
            WorkLoop is a realtime collaboration platform designed for high-performance teams. 
            Channels, DMs, threads, and file sharing in a beautifully crafted interface.
          </p>

          <div style={styles.heroActions}>
            <NavLink
              to={isAuthenticated ? workspacePath : "/register"}
              style={{ ...primaryBtn, ...styles.primaryButton, textDecoration: "none" }}
            >
              {isAuthenticated ? "Open Workspace" : "Start for free"}
            </NavLink>

            <NavLink
              to={isAuthenticated ? workspacePath : "/login"}
              style={{ ...secondaryBtn, ...styles.secondaryButton, textDecoration: "none" }}
            >
              {isAuthenticated ? "Dashboard" : "See how it works"}
            </NavLink>
          </div>

          <div style={styles.statsRow}>
            {stats.map((item) => (
              <div key={item.label}>
                <div style={styles.statValue}>{item.value}</div>
                <div style={styles.statLabel}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* APP PREVIEW */}
        <div style={styles.previewWrapper}>
          <div style={styles.previewCard}>
            <div style={styles.previewSidebar}>
              <div style={styles.workspaceLogo}>
                <Logo width={36} height={36} />
                <span style={styles.workspaceLogoText}>Acme Corp</span>
              </div>

              <div style={styles.sidebarSection}>CHANNELS</div>
              <div style={styles.sidebarActive}># product-launch</div>
              <div style={styles.sidebarItem}># engineering</div>
              <div style={styles.sidebarItem}># design-team</div>
              <div style={styles.sidebarItem}># announcements</div>
            </div>

            <div style={styles.previewChat}>
              <div style={styles.chatHeader}>
                <div>
                  <div style={styles.chatTitle}># product-launch</div>
                  <div style={styles.chatMeta}>24 members online</div>
                </div>
                <div style={styles.onlineBadge}>Active</div>
              </div>

              <div style={styles.messageList}>
                <div style={styles.messageRow}>
                  <div style={styles.avatarPurple}>R</div>
                  <div>
                    <div style={styles.messageMeta}>Rahul · 10:08 AM</div>
                    <div style={styles.messageBubble}>The deployment pipeline is ready for production 🚀</div>
                  </div>
                </div>

                <div style={styles.messageRow}>
                  <div style={styles.avatarGreen}>M</div>
                  <div>
                    <div style={styles.messageMeta}>Maya · 10:12 AM</div>
                    <div style={styles.messageBubble}>Great. I finished the dashboard UI updates.</div>
                    <div style={styles.reactionRow}>
                      <span style={styles.reactionPill}>👍 1</span>
                      <span style={styles.reactionPill}>🎉 3</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.composer}>Message #product-launch...</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionEyebrow}>POWERFUL WORKFLOWS</p>
          <h2 style={styles.sectionTitle}>Built for teams that execute</h2>
          <p style={styles.sectionText}>
            Every feature is designed to reduce friction and help you focus on what matters.
          </p>
        </div>

        <div style={styles.featureGrid}>
          {features.map((feature) => (
            <div key={feature.title} style={styles.featureCard}>
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerTop}>
          <div style={styles.footerBrandSection}>
            <div style={styles.footerLogoRow}>
              <Logo width={42} height={42} />
              <div>
                <div style={styles.footerBrand}>WorkLoop</div>
                <div style={styles.footerText}>
                  Premium real-time collaboration.
                </div>
              </div>
            </div>
          </div>
          <div style={styles.footerLinksWrapper}>
            <div style={styles.footerColumn}>
              <div style={styles.footerHeading}>Product</div>
              <span style={styles.footerLink}>Channels</span>
              <span style={styles.footerLink}>Messaging</span>
            </div>
            <div style={styles.footerColumn}>
              <div style={styles.footerHeading}>Platform</div>
              <span style={styles.footerLink}>Workspaces</span>
              <span style={styles.footerLink}>Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: colors.bg,
    fontFamily: '"Inter", sans-serif',
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 6vw",
    background: "#0F172A",
    position: "relative",
    zIndex: 10,
  },
  headerLogo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  headerBrand: {
    color: "white",
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  hero: {
    position: "relative",
    minHeight: "calc(100vh - 80px)",
    background: "linear-gradient(135deg, #020617 0%, #0F172A 100%)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
    gap: "60px",
    alignItems: "center",
    padding: "60px 6vw",
    overflow: "hidden",
  },
  heroGlowOne: {
    position: "absolute",
    top: "-100px",
    left: "-100px",
    width: "400px",
    height: "400px",
    background: "#14B8A6",
    borderRadius: "50%",
    filter: "blur(120px)",
    opacity: 0.15,
  },
  heroGlowTwo: {
    position: "absolute",
    bottom: "-100px",
    right: "-100px",
    width: "400px",
    height: "400px",
    background: "#22D3EE",
    borderRadius: "50%",
    filter: "blur(120px)",
    opacity: 0.12,
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
  },
  eyebrow: {
    color: "#22D3EE",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    marginBottom: "24px",
  },
  heroTitle: {
    fontSize: "clamp(48px, 5vw, 64px)",
    lineHeight: 1.05,
    fontWeight: 800,
    color: "white",
    margin: 0,
    letterSpacing: "-0.03em",
  },
  heroText: {
    marginTop: "24px",
    fontSize: "18px",
    lineHeight: 1.6,
    color: "#94A3B8",
    maxWidth: "540px",
  },
  heroActions: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginTop: "40px",
  },
  primaryButton: {
    padding: "16px 28px",
    fontSize: "16px",
    borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(20, 184, 166, 0.25)",
  },
  secondaryButton: {
    padding: "16px 28px",
    fontSize: "16px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    backdropFilter: "blur(12px)",
  },
  statsRow: {
    display: "flex",
    gap: "48px",
    flexWrap: "wrap",
    marginTop: "60px",
  },
  statValue: {
    color: "white",
    fontSize: "32px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  statLabel: {
    marginTop: "8px",
    color: "#64748B",
    fontSize: "14px",
    fontWeight: 500,
  },
  previewWrapper: {
    position: "relative",
    zIndex: 2,
    perspective: "1000px",
  },
  previewCard: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    minHeight: "500px",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
    transform: "rotateY(-4deg) rotateX(2deg)",
  },
  previewSidebar: {
    background: "#0F172A",
    padding: "24px 16px",
    borderRight: "1px solid rgba(255,255,255,0.05)",
  },
  workspaceLogo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "36px",
  },
  workspaceLogoText: {
    color: "white",
    fontWeight: 700,
    fontSize: "16px",
  },
  sidebarSection: {
    color: "#64748B",
    fontSize: "12px",
    fontWeight: 700,
    marginBottom: "12px",
    paddingLeft: "12px",
  },
  sidebarActive: {
    padding: "10px 12px",
    borderRadius: "8px",
    background: "rgba(20, 184, 166, 0.15)",
    color: "#22D3EE",
    fontWeight: 600,
    fontSize: "14px",
    marginBottom: "6px",
  },
  sidebarItem: {
    padding: "10px 12px",
    borderRadius: "8px",
    color: "#94A3B8",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "6px",
  },
  previewChat: {
    background: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #E2E8F0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatTitle: {
    fontWeight: 700,
    fontSize: "18px",
    color: "#0F172A",
  },
  chatMeta: {
    marginTop: "4px",
    fontSize: "13px",
    color: "#64748B",
  },
  onlineBadge: {
    background: "#CCFBF1",
    color: "#0D9488",
    padding: "6px 12px",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "12px",
  },
  messageList: {
    flex: 1,
    padding: "24px",
  },
  messageRow: {
    display: "grid",
    gridTemplateColumns: "44px 1fr",
    gap: "16px",
    marginBottom: "28px",
  },
  avatarPurple: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "#334155",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },
  avatarGreen: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "#14B8A6",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },
  messageMeta: {
    color: "#64748B",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
  },
  messageBubble: {
    color: "#0F172A",
    fontSize: "15px",
    lineHeight: 1.6,
  },
  reactionRow: {
    marginTop: "12px",
    display: "flex",
    gap: "8px",
  },
  reactionPill: {
    padding: "6px 10px",
    background: "#F1F5F9",
    border: "1px solid #E2E8F0",
    borderRadius: "999px",
    fontSize: "13px",
    color: "#475569",
    fontWeight: 600,
  },
  composer: {
    margin: "0 24px 24px",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #CBD5E1",
    color: "#94A3B8",
    background: "white",
    fontSize: "14px",
  },
  featuresSection: {
    padding: "120px 6vw",
    background: "#F8FAFC",
  },
  sectionHeader: {
    textAlign: "center",
    maxWidth: "680px",
    margin: "0 auto 80px",
  },
  sectionEyebrow: {
    color: "#14B8A6",
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "0.1em",
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "42px",
    lineHeight: 1.1,
    margin: 0,
    color: "#0F172A",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  sectionText: {
    marginTop: "24px",
    fontSize: "18px",
    lineHeight: 1.6,
    color: "#64748B",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "32px",
  },
  featureCard: {
    background: "white",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 4px 20px rgba(15,23,42,0.03)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  featureIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    background: "#F1F5F9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    marginBottom: "28px",
  },
  featureTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#0F172A",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },
  featureDescription: {
    marginTop: "16px",
    color: "#64748B",
    lineHeight: 1.6,
    fontSize: "16px",
  },
  footer: {
    background: "#020617",
    padding: "80px 6vw 40px",
    color: "white",
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
    gap: "16px",
    alignItems: "flex-start",
  },
  footerBrand: {
    fontSize: "22px",
    fontWeight: 800,
    color: "white",
    letterSpacing: "-0.02em",
  },
  footerText: {
    marginTop: "12px",
    color: "#94A3B8",
    fontSize: "15px",
    lineHeight: 1.6,
  },
  footerLinksWrapper: {
    display: "flex",
    gap: "80px",
    flexWrap: "wrap",
  },
  footerColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  footerHeading: {
    fontWeight: 700,
    fontSize: "15px",
    marginBottom: "8px",
  },
  footerLink: {
    color: "#94A3B8",
    fontSize: "15px",
    cursor: "pointer",
  },
};