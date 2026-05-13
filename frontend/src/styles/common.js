export const colors = {
  sidebar: "#1d1028",
  sidebarSoft: "#2a1737",
  sidebarActive: "#3f2352",
  sidebarText: "#e8dfee",
  sidebarMuted: "#b9a8c4",

  primary: "#611f69",
  primaryDark: "#4a154b",
  accent: "#1264a3",

  bg: "#f8f8f8",
  panel: "#ffffff",
  panelSoft: "#f4f4f5",
  border: "#e4e4e7",
  borderDark: "#d4d4d8",

  text: "#1d1c1d",
  muted: "#616061",
  lightText: "#8a8a8e",

  success: "#2e7d32",
  warning: "#b7791f",
  danger: "#c62828",

  lowBg: "#f4f4f5",
  mediumBg: "#fff7e6",
  highBg: "#fff1f2",
  infoBg: "#eef6ff",
};

export const appBase = {
  minHeight: "100vh",
  backgroundColor: colors.bg,
  color: colors.text,
  fontFamily:
    'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

export const rootLayout = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: colors.bg,
};

export const mainContent = {
  flex: 1,
  minHeight: 0,
};

export const pageCenter = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "32px 18px",
  backgroundColor: colors.bg,
  boxSizing: "border-box",
};

export const headerBar = {
  height: "64px",
  padding: "0 24px",
  backgroundColor: colors.panel,
  borderBottom: `1px solid ${colors.border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxSizing: "border-box",
};

export const brand = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: colors.primary,
  fontSize: "18px",
  fontWeight: 800,
  textDecoration: "none",
};

export const brandMark = {
  width: "34px",
  height: "34px",
  borderRadius: "9px",
  backgroundColor: colors.primary,
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
};

export const navActions = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

export const linkText = {
  color: colors.primary,
  fontSize: "14px",
  fontWeight: 700,
  textDecoration: "none",
};

export const authCard = {
  width: "100%",
  maxWidth: "430px",
  backgroundColor: colors.panel,
  border: `1px solid ${colors.border}`,
  borderRadius: "14px",
  boxShadow: "0 14px 40px rgba(15, 23, 42, 0.08)",
  padding: "34px",
  boxSizing: "border-box",
};

export const authTitle = {
  margin: "0 0 8px",
  color: colors.text,
  fontSize: "28px",
  fontWeight: 850,
};

export const authSubtitle = {
  margin: "0 0 26px",
  color: colors.muted,
  fontSize: "14px",
  lineHeight: 1.6,
};

export const form = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

export const formRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

export const formGroup = {
  display: "flex",
  flexDirection: "column",
  gap: "7px",
};

export const label = {
  color: colors.text,
  fontSize: "13px",
  fontWeight: 750,
};

export const input = {
  width: "100%",
  border: `1px solid ${colors.borderDark}`,
  borderRadius: "8px",
  padding: "11px 12px",
  backgroundColor: "#ffffff",
  color: colors.text,
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

export const textarea = {
  ...input,
  minHeight: "92px",
  resize: "vertical",
  lineHeight: 1.5,
  fontFamily: "inherit",
};

export const select = {
  ...input,
  cursor: "pointer",
};

export const primaryBtn = {
  border: "none",
  borderRadius: "8px",
  padding: "10px 14px",
  backgroundColor: colors.primary,
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 750,
  cursor: "pointer",
};

export const secondaryBtn = {
  border: `1px solid ${colors.border}`,
  borderRadius: "8px",
  padding: "10px 14px",
  backgroundColor: colors.panelSoft,
  color: colors.text,
  fontSize: "14px",
  fontWeight: 750,
  cursor: "pointer",
};

export const ghostBtn = {
  border: "none",
  borderRadius: "8px",
  padding: "8px 10px",
  backgroundColor: "transparent",
  color: colors.muted,
  fontSize: "14px",
  fontWeight: 700,
  cursor: "pointer",
};

export const dangerBtn = {
  border: "none",
  borderRadius: "8px",
  padding: "10px 14px",
  backgroundColor: colors.highBg,
  color: colors.danger,
  fontSize: "14px",
  fontWeight: 750,
  cursor: "pointer",
};

export const iconBtn = {
  width: "34px",
  height: "34px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "transparent",
  color: colors.muted,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

export const fullWidth = {
  width: "100%",
};

export const errorText = {
  color: colors.danger,
  fontSize: "13px",
  fontWeight: 650,
  lineHeight: 1.4,
};

export const successText = {
  color: colors.success,
  fontSize: "13px",
  fontWeight: 650,
};

export const mutedText = {
  color: colors.muted,
  fontSize: "14px",
  lineHeight: 1.5,
};

export const card = {
  backgroundColor: colors.panel,
  border: `1px solid ${colors.border}`,
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
  padding: "18px",
  boxSizing: "border-box",
};

export const sectionTitle = {
  margin: 0,
  color: colors.text,
  fontSize: "18px",
  fontWeight: 850,
};

export const sectionSubtitle = {
  margin: "6px 0 0",
  color: colors.muted,
  fontSize: "13px",
  lineHeight: 1.5,
};

export const workspaceShell = {
  height: "100vh",
  display: "grid",
  gridTemplateColumns: "290px minmax(0, 1fr)",
  backgroundColor: colors.bg,
  overflow: "hidden",
};

export const sidebar = {
  height: "100vh",
  backgroundColor: colors.sidebar,
  color: colors.sidebarText,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

export const sidebarHeader = {
  padding: "18px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
};

export const workspaceName = {
  margin: 0,
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 850,
};

export const workspaceMeta = {
  margin: "5px 0 0",
  color: colors.sidebarMuted,
  fontSize: "12px",
};

export const sidebarBody = {
  flex: 1,
  overflowY: "auto",
  padding: "14px 10px 18px",
};

export const sidebarSection = {
  marginBottom: "20px",
};

export const sidebarSectionHeader = {
  padding: "0 8px 8px",
  color: colors.sidebarMuted,
  fontSize: "12px",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export const sidebarItem = {
  width: "100%",
  minHeight: "34px",
  border: "none",
  borderRadius: "7px",
  padding: "8px 10px",
  backgroundColor: "transparent",
  color: colors.sidebarText,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: 650,
  boxSizing: "border-box",
};

export const sidebarItemActive = {
  ...sidebarItem,
  backgroundColor: colors.sidebarActive,
  color: "#ffffff",
};

export const sidebarItemLabel = {
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export const badge = {
  minWidth: "20px",
  height: "20px",
  padding: "0 6px",
  borderRadius: "999px",
  backgroundColor: colors.danger,
  color: "#ffffff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px",
  fontWeight: 850,
  boxSizing: "border-box",
};

export const softBadge = {
  ...badge,
  backgroundColor: "rgba(255, 255, 255, 0.14)",
  color: colors.sidebarText,
};

export const contentArea = {
  minWidth: 0,
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  backgroundColor: colors.panel,
};

export const workspaceHeader = {
  minHeight: "72px",
  padding: "16px 22px",
  borderBottom: `1px solid ${colors.border}`,
  backgroundColor: colors.panel,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  boxSizing: "border-box",
};

export const workspaceHeaderTitle = {
  margin: 0,
  color: colors.text,
  fontSize: "20px",
  fontWeight: 850,
};

export const workspaceHeaderMeta = {
  margin: "4px 0 0",
  color: colors.muted,
  fontSize: "13px",
};

export const dashboard = {
  flex: 1,
  overflowY: "auto",
  padding: "24px",
  backgroundColor: colors.bg,
};

export const dashboardChat = {
  flex: 1,
  overflow: "hidden",
  padding: 0,
  backgroundColor: colors.panel,
};

export const dashboardGrid = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.45fr) minmax(300px, 0.85fr)",
  gap: "18px",
  alignItems: "start",
};

export const list = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export const listItem = {
  width: "100%",
  border: `1px solid ${colors.border}`,
  borderRadius: "10px",
  backgroundColor: colors.panel,
  padding: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  boxSizing: "border-box",
};

export const listItemMain = {
  minWidth: 0,
};

export const listItemTitle = {
  margin: 0,
  color: colors.text,
  fontSize: "15px",
  fontWeight: 800,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export const listItemMeta = {
  margin: "4px 0 0",
  color: colors.muted,
  fontSize: "12px",
  lineHeight: 1.4,
};

export const emptyState = {
  padding: "34px 20px",
  border: `1px dashed ${colors.borderDark}`,
  borderRadius: "12px",
  backgroundColor: colors.panel,
  color: colors.muted,
  textAlign: "center",
};

export const chatLayout = {
  height: "100%",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  backgroundColor: colors.panel,
  overflow: "hidden",
};

export const chatLayoutWithThread = {
  ...chatLayout,
  gridTemplateColumns: "minmax(0, 1fr) 380px",
};

export const chatPanel = {
  minWidth: 0,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: colors.panel,
  overflow: "hidden",
};

export const chatHeader = {
  minHeight: "66px",
  padding: "13px 22px",
  borderBottom: `1px solid ${colors.border}`,
  backgroundColor: colors.panel,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "14px",
  boxSizing: "border-box",
};

export const chatTitle = {
  margin: 0,
  color: colors.text,
  fontSize: "18px",
  fontWeight: 850,
};

export const chatMeta = {
  margin: "3px 0 0",
  color: colors.muted,
  fontSize: "12px",
};

export const messageList = {
  flex: 1,
  overflowY: "auto",
  padding: "18px 24px",
  backgroundColor: colors.panel,
  minHeight: 0,
};

export const messageItem = {
  display: "grid",
  gridTemplateColumns: "38px minmax(0, 1fr)",
  gap: "12px",
  padding: "10px 8px",
  borderRadius: "8px",
};

export const messageItemActive = {
  ...messageItem,
  backgroundColor: colors.panelSoft,
};

export const avatar = {
  width: "38px",
  height: "38px",
  borderRadius: "9px",
  backgroundColor: colors.primary,
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: 850,
  overflow: "hidden",
  flex: "0 0 auto",
};

export const avatarImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

export const messageBody = {
  minWidth: 0,
};

export const messageTopline = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
};

export const senderName = {
  color: colors.text,
  fontSize: "14px",
  fontWeight: 850,
};

export const messageTime = {
  color: colors.lightText,
  fontSize: "12px",
};

export const messageText = {
  margin: "4px 0 0",
  color: colors.text,
  fontSize: "15px",
  lineHeight: 1.55,
  whiteSpace: "pre-wrap",
  overflowWrap: "break-word",
};

export const deletedMessage = {
  margin: "4px 0 0",
  color: colors.lightText,
  fontSize: "13px",
  fontStyle: "italic",
};

export const messageActions = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  marginTop: "9px",
  flexWrap: "wrap",
};

export const messageInputWrap = {
  borderTop: `1px solid ${colors.border}`,
  padding: "14px 18px 18px",
  backgroundColor: colors.panel,

  position: "sticky",
  bottom: 0,
  zIndex: 20,
};

export const messageComposer = {
  border: `1px solid ${colors.borderDark}`,
  borderRadius: "12px",
  backgroundColor: colors.panel,
  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
  overflow: "hidden",
};

export const composerInput = {
  width: "100%",
  minHeight: "78px",
  border: "none",
  outline: "none",
  padding: "14px",
  resize: "vertical",
  color: colors.text,
  fontSize: "14px",
  lineHeight: 1.5,
  fontFamily: "inherit",
  boxSizing: "border-box",
};

export const composerToolbar = {
  minHeight: "48px",
  padding: "8px 10px",
  borderTop: `1px solid ${colors.border}`,
  backgroundColor: colors.panelSoft,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  boxSizing: "border-box",
};

export const composerTools = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
};

export const compactSelect = {
  border: `1px solid ${colors.borderDark}`,
  borderRadius: "8px",
  padding: "8px 10px",
  backgroundColor: "#ffffff",
  color: colors.text,
  fontSize: "12px",
  fontWeight: 750,
  outline: "none",
  cursor: "pointer",
};

export const dateInput = {
  ...compactSelect,
  fontWeight: 500,
};

export const priorityBadge = {
  borderRadius: "999px",
  padding: "3px 8px",
  fontSize: "11px",
  fontWeight: 850,
  lineHeight: 1.4,
  display: "inline-flex",
  alignItems: "center",
  border: `1px solid ${colors.border}`,
};

export const priorityLow = {
  ...priorityBadge,
  backgroundColor: colors.lowBg,
  color: colors.muted,
};

export const priorityMedium = {
  ...priorityBadge,
  backgroundColor: colors.mediumBg,
  color: colors.warning,
  border: "1px solid #f3d08b",
};

export const priorityHigh = {
  ...priorityBadge,
  backgroundColor: colors.highBg,
  color: colors.danger,
  border: "1px solid #fecdd3",
};

export const reminderLabel = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  marginTop: "8px",
  borderRadius: "8px",
  padding: "6px 8px",
  backgroundColor: colors.infoBg,
  color: colors.accent,
  fontSize: "12px",
  fontWeight: 750,
};

export const reactionBar = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexWrap: "wrap",
  position: "relative",
};

export const reactionBtn = {
  border: `1px solid ${colors.border}`,
  borderRadius: "999px",
  backgroundColor: colors.panel,
  color: colors.text,
  minWidth: "36px",
  height: "32px",
  padding: "0 10px",
  fontSize: "18px",
  fontWeight: 750,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.05)",
  lineHeight: 1,
};

export const reactionBtnActive = {
  ...reactionBtn,
  backgroundColor: colors.infoBg,
  color: colors.accent,
  border: "1px solid #bfdbfe",
};

export const reactionCount = {
  color: colors.muted,
  fontSize: "11px",
  fontWeight: 850,
  lineHeight: 1,
};

export const reactionMoreBtn = {
  ...reactionBtn,
  color: colors.muted,
  fontSize: "16px",
  fontWeight: 900,
};

export const reactionPicker = {
  position: "absolute",
  left: 0,
  bottom: "40px",
  zIndex: 20,
  width: "248px",
  maxWidth: "70vw",
  border: `1px solid ${colors.border}`,
  borderRadius: "12px",
  backgroundColor: colors.panel,
  boxShadow: "0 16px 38px rgba(15, 23, 42, 0.18)",
  padding: "8px",
  display: "grid",
  gridTemplateColumns: "repeat(6, 1fr)",
  gap: "5px",
};

export const reactionPickerBtn = {
  width: "34px",
  height: "34px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "transparent",
  color: colors.text,
  fontSize: "18px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

export const threadBtn = {
  border: "none",
  backgroundColor: "transparent",
  color: colors.accent,
  padding: "4px 0",
  fontSize: "12px",
  fontWeight: 800,
  cursor: "pointer",
};

export const fileUploadBox = {
  border: `1px dashed ${colors.borderDark}`,
  borderRadius: "10px",
  backgroundColor: colors.panelSoft,
  padding: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
};

export const filePreview = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  minWidth: 0,
};

export const fileName = {
  color: colors.text,
  fontSize: "13px",
  fontWeight: 750,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export const fileMeta = {
  color: colors.muted,
  fontSize: "12px",
};

export const attachment = {
  marginTop: "8px",
  border: `1px solid ${colors.border}`,
  borderRadius: "10px",
  padding: "10px",
  backgroundColor: colors.panelSoft,
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  maxWidth: "100%",
  boxSizing: "border-box",
};

export const attachmentLink = {
  color: colors.accent,
  fontSize: "13px",
  fontWeight: 800,
  textDecoration: "none",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export const threadPanel = {
  height: "100%",
  borderLeft: `1px solid ${colors.border}`,
  backgroundColor: colors.panel,
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
};

export const threadHeader = {
  minHeight: "66px",
  padding: "14px 16px",
  borderBottom: `1px solid ${colors.border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  boxSizing: "border-box",
};

export const threadTitle = {
  margin: 0,
  color: colors.text,
  fontSize: "16px",
  fontWeight: 850,
};

export const threadBody = {
  flex: 1,
  overflowY: "auto",
  padding: "14px",
};

export const notificationItem = {
  border: `1px solid ${colors.border}`,
  borderRadius: "10px",
  backgroundColor: colors.panel,
  padding: "14px",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "12px",
};

export const notificationUnread = {
  ...notificationItem,
  border: "1px solid #bfdbfe",
  backgroundColor: colors.infoBg,
};

export const notificationType = {
  color: colors.accent,
  fontSize: "11px",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

export const notificationText = {
  margin: "4px 0 0",
  color: colors.text,
  fontSize: "13px",
  lineHeight: 1.45,
};

export const reminderItem = {
  border: `1px solid ${colors.border}`,
  borderRadius: "10px",
  backgroundColor: colors.panel,
  padding: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

export const reminderItemHighlighted = {
  ...reminderItem,
  position: "relative",
  overflow: "hidden",
  border: "1px solid #bfdbfe",
  backgroundColor: "#f8fbff",
  boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)",
};

export const reminderAccent = {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: "4px",
  backgroundColor: colors.accent,
};

export const reminderTime = {
  color: colors.accent,
  fontSize: "12px",
  fontWeight: 850,
};

export const reminderHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

export const reminderContent = {
  margin: 0,
  color: colors.text,
  fontSize: "14px",
  fontWeight: 700,
  lineHeight: 1.5,
};

export const reminderMeta = {
  margin: 0,
  color: colors.muted,
  fontSize: "12px",
  lineHeight: 1.45,
};

export const memberGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "12px",
};

export const memberCard = {
  border: `1px solid ${colors.border}`,
  borderRadius: "10px",
  backgroundColor: colors.panel,
  padding: "12px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

export const roleBadge = {
  borderRadius: "999px",
  padding: "3px 8px",
  backgroundColor: "#eef8f0",
  color: colors.success,
  fontSize: "11px",
  fontWeight: 850,
};

export const toolbar = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
};

export const splitRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "14px",
};

export const divider = {
  height: "1px",
  backgroundColor: colors.border,
  border: "none",
  margin: "16px 0",
};

export const loading = {
  minHeight: "180px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: colors.muted,
  fontSize: "14px",
  fontWeight: 700,
};

export const unauthorizedBox = {
  maxWidth: "520px",
  textAlign: "center",
};

export const getPriorityStyle = (priority = "LOW") => {
  if (priority === "HIGH") return priorityHigh;
  if (priority === "MEDIUM") return priorityMedium;
  return priorityLow;
};

export const homePage = {
  minHeight: "100vh",
  backgroundColor: "#f7f7f5",
};

export const homeHero = {
  position: "relative",
  minHeight: "calc(100vh - 64px)",
  overflow: "hidden",
  padding: "72px 6vw 46px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
  gap: "54px",
  alignItems: "center",
  backgroundColor: "#171321",
  color: "#ffffff",
};

export const homeHeroImage = {
  position: "absolute",
  right: "5vw",
  top: "34px",
  width: "240px",
  maxWidth: "24vw",
  opacity: 0.35,
  filter: "drop-shadow(0 24px 42px rgba(126, 87, 194, 0.34))",
  pointerEvents: "none",
};

export const homeHeroContent = {
  position: "relative",
  zIndex: 1,
  minWidth: 0,
};

export const homeEyebrow = {
  margin: "0 0 18px",
  color: "#83e2cf",
  fontSize: "13px",
  fontWeight: 850,
  letterSpacing: 0,
  textTransform: "uppercase",
};

export const homeHeroTitle = {
  maxWidth: "760px",
  margin: 0,
  color: "#ffffff",
  fontSize: "clamp(42px, 6vw, 76px)",
  lineHeight: 1,
  letterSpacing: 0,
  fontWeight: 900,
};

export const homeLead = {
  maxWidth: "620px",
  margin: "24px 0 0",
  color: "rgba(255, 255, 255, 0.78)",
  fontSize: "clamp(17px, 2vw, 21px)",
  lineHeight: 1.55,
};

export const homeActions = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "12px",
  marginTop: "32px",
};

export const homeProductShot = {
  position: "relative",
  zIndex: 1,
  minHeight: "470px",
  display: "grid",
  gridTemplateColumns: "minmax(110px, 180px) minmax(0, 1fr)",
  overflow: "hidden",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  borderRadius: "18px",
  backgroundColor: "#ffffff",
  boxShadow: "0 30px 90px rgba(0, 0, 0, 0.34)",
};

export const homeProductSidebar = {
  padding: "18px",
  backgroundColor: "#2c1638",
};

export const homeWindowDots = {
  display: "flex",
  gap: "7px",
  marginBottom: "28px",
};

export const homeWindowDot = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.42)",
};

export const homeSidebarLine = {
  height: "15px",
  marginBottom: "14px",
  borderRadius: "999px",
  backgroundColor: "rgba(255, 255, 255, 0.16)",
};

export const homeSidebarLineStrong = {
  ...homeSidebarLine,
  width: "70%",
  height: "22px",
  backgroundColor: "rgba(255, 255, 255, 0.82)",
};

export const homeSidebarLineActive = {
  ...homeSidebarLine,
  backgroundColor: "#8f3fa3",
};

export const homeSidebarLineShort = {
  ...homeSidebarLine,
  width: "58%",
};

export const homeProductChat = {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  backgroundColor: "#f7f7f5",
  color: colors.text,
};

export const homeChatHeader = {
  minHeight: "62px",
  padding: "18px 22px",
  borderBottom: `1px solid ${colors.border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "14px",
  fontWeight: 900,
};

export const homeStatusPill = {
  borderRadius: "999px",
  padding: "6px 10px",
  backgroundColor: "#e9f8ef",
  color: "#177245",
  fontSize: "12px",
  fontWeight: 850,
  whiteSpace: "nowrap",
};

export const homeMessageRow = {
  display: "grid",
  gridTemplateColumns: "42px minmax(0, 1fr)",
  gap: "12px",
  padding: "20px 22px 4px",
};

export const homeAvatar = {
  width: "42px",
  height: "42px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "12px",
  backgroundColor: colors.primary,
  color: "#ffffff",
  fontWeight: 900,
};

export const homeAvatarGreen = {
  ...homeAvatar,
  backgroundColor: "#177245",
};

export const homeMessageMeta = {
  marginBottom: "8px",
  color: colors.muted,
  fontSize: "12px",
  fontWeight: 800,
};

export const homeMessageBubble = {
  width: "72%",
  height: "46px",
  borderRadius: "14px",
  backgroundColor: "#ffffff",
  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
};

export const homeMessageBubbleWide = {
  ...homeMessageBubble,
  width: "88%",
};

export const homeReactionsPreview = {
  display: "inline-flex",
  gap: "6px",
  marginTop: "10px",
  border: `1px solid ${colors.border}`,
  borderRadius: "999px",
  padding: "7px 10px",
  backgroundColor: "#ffffff",
  boxShadow: "0 12px 24px rgba(15, 23, 42, 0.08)",
};

export const homeComposerPreview = {
  margin: "auto 22px 22px",
  border: `1px solid ${colors.borderDark}`,
  borderRadius: "12px",
  padding: "16px",
  backgroundColor: "#ffffff",
  color: colors.lightText,
  fontSize: "14px",
};

export const homeStats = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1px",
  backgroundColor: "#dedee6",
};

export const homeStatItem = {
  padding: "28px 6vw",
  backgroundColor: "#ffffff",
};

export const homeStatValue = {
  display: "block",
  color: colors.primary,
  fontSize: "clamp(24px, 3vw, 34px)",
  fontWeight: 900,
};

export const homeStatLabel = {
  display: "block",
  marginTop: "5px",
  color: colors.muted,
  fontSize: "14px",
  fontWeight: 750,
};

export const homeFeatures = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "18px",
  padding: "64px 6vw",
};

export const homeFeatureCard = {
  border: `1px solid ${colors.border}`,
  borderRadius: "12px",
  padding: "24px",
  backgroundColor: "#ffffff",
  boxShadow: "0 16px 38px rgba(15, 23, 42, 0.06)",
};

export const homeFeatureTitle = {
  margin: 0,
  color: colors.text,
  fontSize: "22px",
  fontWeight: 900,
};

export const homeFeatureText = {
  margin: "10px 0 0",
  color: colors.muted,
  lineHeight: 1.6,
};

export const homeFinalCta = {
  margin: "0 6vw 44px",
  borderRadius: "18px",
  padding: "38px",
  backgroundColor: "#ffffff",
  border: `1px solid ${colors.border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "24px",
  boxShadow: "0 18px 44px rgba(15, 23, 42, 0.08)",
};

export const homeFooter = {
  minHeight: "76px",
  padding: "22px 6vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "16px",
  backgroundColor: "#171321",
  color: "rgba(255, 255, 255, 0.78)",
};

export const messageItemHover = {
  ...messageItem,
  position: "relative",
  backgroundColor: colors.panelSoft,
};

export const messageQuickActions = {
  position: "absolute",
  top: "-12px",
  right: "10px",
  zIndex: 12,
  display: "flex",
  alignItems: "center",
  gap: "4px",
  border: `1px solid ${colors.borderDark}`,
  borderRadius: "999px",
  padding: "5px",
  backgroundColor: "#ffffff",
  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.15)",
};

export const messageReactionSummary = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexWrap: "wrap",
  marginTop: "8px",
};

export const actionChip = {
  border: `1px solid ${colors.border}`,
  borderRadius: "999px",
  minHeight: "30px",
  padding: "0 10px",
  backgroundColor: "#ffffff",
  color: colors.muted,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  fontSize: "12px",
  fontWeight: 850,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

export const emojiPickerPanel = {
  position: "absolute",
  right: 0,
  top: "42px",
  zIndex: 30,
  width: "330px",
  maxWidth: "calc(100vw - 34px)",
  maxHeight: "330px",
  overflowY: "auto",
  border: `1px solid ${colors.borderDark}`,
  borderRadius: "14px",
  backgroundColor: "#ffffff",
  boxShadow: "0 24px 64px rgba(15, 23, 42, 0.22)",
  padding: "10px",
};

export const emojiPickerGroup = {
  marginTop: "8px",
};

export const emojiPickerLabel = {
  margin: "4px 4px 6px",
  color: colors.muted,
  fontSize: "11px",
  fontWeight: 850,
  letterSpacing: 0,
  textTransform: "uppercase",
};

export const emojiPickerGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "4px",
};

export const deleteModalBackdrop = {
  position: "fixed",
  inset: 0,
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "18px",
  backgroundColor: "rgba(15, 23, 42, 0.38)",
  backdropFilter: "blur(5px)",
};

export const deleteModal = {
  width: "min(420px, 100%)",
  border: `1px solid ${colors.border}`,
  borderRadius: "16px",
  padding: "22px",
  backgroundColor: "#ffffff",
  boxShadow: "0 24px 70px rgba(15, 23, 42, 0.28)",
};

export const deleteModalTitle = {
  margin: 0,
  color: colors.text,
  fontSize: "20px",
  fontWeight: 900,
};

export const deleteModalText = {
  margin: "8px 0 18px",
  color: colors.muted,
  fontSize: "14px",
  lineHeight: 1.5,
};

export const deleteModalActions = {
  display: "grid",
  gap: "10px",
};

export const statusLine = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  minWidth: 0,
};

export const statusDot = {
  width: "9px",
  height: "9px",
  borderRadius: "999px",
  flex: "0 0 auto",
  backgroundColor: "#9ca3af",
  boxShadow: "0 0 0 3px rgba(156, 163, 175, 0.16)",
};

export const statusDotOnline = {
  ...statusDot,
  backgroundColor: "#2eb67d",
  boxShadow: "0 0 0 3px rgba(46, 182, 125, 0.18)",
};

export const memberStatus = {
  marginTop: "7px",
  color: colors.muted,
  fontSize: "12px",
  fontWeight: 750,
};

export const profileMenuWrap = {
  position: "relative",
  width: "100%",
};

export const profileMenuButton = {
  width: "100%",
  border: "none",
  borderRadius: "10px",
  padding: "10px",
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
  textAlign: "left",
};

export const profileMenuButtonLight = {
  ...profileMenuButton,
  border: `1px solid ${colors.border}`,
  backgroundColor: "#ffffff",
  color: colors.text,
};

export const profileMenuText = {
  minWidth: 0,
  flex: 1,
};

export const profileMenuName = {
  margin: 0,
  fontSize: "13px",
  fontWeight: 850,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export const profileMenuEmail = {
  margin: "3px 0 0",
  color: colors.sidebarMuted,
  fontSize: "11px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export const profileMenuEmailLight = {
  ...profileMenuEmail,
  color: colors.muted,
};

export const profileDropdown = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: "calc(100% + 10px)",
  zIndex: 50,
  border: `1px solid ${colors.border}`,
  borderRadius: "12px",
  padding: "8px",
  backgroundColor: "#ffffff",
  boxShadow: "0 20px 54px rgba(15, 23, 42, 0.22)",
};

export const profileDropdownTop = {
  ...profileDropdown,
  left: "auto",
  right: 0,
  bottom: "auto",
  top: "calc(100% + 10px)",
  width: "280px",
};

export const profileDropdownItem = {
  width: "100%",
  border: "none",
  borderRadius: "8px",
  padding: "10px",
  backgroundColor: "transparent",
  color: colors.text,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "3px",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: 750,
};

export const profileDropdownDanger = {
  ...profileDropdownItem,
  color: colors.danger,
};

export const profileDivider = {
  height: "1px",
  margin: "8px 0",
  backgroundColor: colors.border,
};

export const sidebarFooter = {
  padding: "12px",
  borderTop: "1px solid rgba(255, 255, 255, 0.12)",
};

export const adminShell = {
  height: "100vh",
  display: "grid",
  gridTemplateColumns: "280px minmax(0, 1fr)",
  backgroundColor: colors.bg,
  overflow: "hidden",
};

export const adminSidebar = {
  ...sidebar,
  backgroundColor: "#121827",
};

export const adminMain = {
  minWidth: 0,
  height: "100vh",
  overflowY: "auto",
  padding: "24px",
};

export const adminTopbar = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "22px",
};

export const adminHero = {
  borderRadius: "14px",
  padding: "26px",
  marginBottom: "18px",
  backgroundColor: "#171321",
  color: "#ffffff",
  boxShadow: "0 20px 48px rgba(15, 23, 42, 0.16)",
};

export const adminHeroTitle = {
  margin: 0,
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: 900,
};

export const adminHeroText = {
  margin: "8px 0 0",
  color: "rgba(255, 255, 255, 0.76)",
  fontSize: "14px",
  lineHeight: 1.6,
};

export const adminStatsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "14px",
  marginBottom: "18px",
};

export const adminStatCard = {
  ...card,
  borderRadius: "10px",
  padding: "18px",
};

export const adminStatLabel = {
  margin: 0,
  color: colors.muted,
  fontSize: "12px",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: 0,
};

export const adminStatValue = {
  margin: "8px 0 0",
  color: colors.text,
  fontSize: "32px",
  fontWeight: 900,
};

export const adminGrid = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
  gap: "18px",
  alignItems: "start",
};

export const adminTable = {
  width: "100%",
  borderCollapse: "collapse",
};

export const adminTableCell = {
  padding: "12px 10px",
  borderBottom: `1px solid ${colors.border}`,
  color: colors.text,
  fontSize: "13px",
  textAlign: "left",
};

export const adminTableHeadCell = {
  ...adminTableCell,
  color: colors.muted,
  fontSize: "11px",
  fontWeight: 850,
  textTransform: "uppercase",
  letterSpacing: 0,
};
