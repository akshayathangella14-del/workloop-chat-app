import { NavLink } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  MessageSquare, Hash, Users, BellRing, Clock, File, 
  Zap, Shield, ArrowRight, CheckCircle2, Cpu,
  Inbox, Workflow, ZapIcon, Globe, Lock, PlayCircle, Layout
} from "lucide-react";
import Logo from "./Logo";
import { useRef } from "react";

// Brand Tokens for Landing Page
const theme = {
  bg: "#020617",
  surface: "#07111F",
  surfaceElevated: "#0E1A2F",
  accent: "#22D3EE",
  accentHover: "#06B6D4",
  success: "#22C55E",
  text: "#F8FAFC",
  muted: "#94A3B8",
  cardBg: "rgba(255,255,255,0.02)",
  cardBorder: "rgba(255,255,255,0.08)",
  glass: "rgba(2, 6, 23, 0.7)"
};

export default function Home() {
  const { currentUser, isAuthenticated } = useAuth();
  const workspacePath = currentUser?.role === "ADMIN" ? "/admin" : "/workspace";

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: '"Inter", sans-serif', overflowX: "hidden" }}>
      
      {/* HEADER */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: theme.glass, backdropFilter: "blur(12px)", borderBottom: `1px solid ${theme.cardBorder}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Logo width={32} height={32} />
            <span style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: theme.text }}>WorkLoop</span>
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <NavLink to="/login" style={{ color: theme.muted, textDecoration: "none", fontSize: "14px", fontWeight: 500, transition: "color 0.2s" }} onMouseEnter={(e)=>e.target.style.color=theme.text} onMouseLeave={(e)=>e.target.style.color=theme.muted}>
              Sign In
            </NavLink>
            <NavLink 
              to={isAuthenticated ? workspacePath : "/register"} 
              style={{ background: theme.text, color: theme.bg, padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: 600, transition: "all 0.2s" }}
              onMouseEnter={(e)=>e.target.style.background="#E2E8F0"}
              onMouseLeave={(e)=>e.target.style.background=theme.text}
            >
              {isAuthenticated ? "Open Workspace" : "Get Started"}
            </NavLink>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section style={{ position: "relative", paddingTop: "160px", paddingBottom: "100px", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "600px", height: "600px", background: theme.accent, filter: "blur(180px)", opacity: 0.15, borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "600px", height: "600px", background: "#3B82F6", filter: "blur(180px)", opacity: 0.1, borderRadius: "50%" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 12px", background: "rgba(34,211,238,0.1)", border: `1px solid rgba(34,211,238,0.2)`, borderRadius: "20px", marginBottom: "24px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: theme.accent, boxShadow: `0 0 10px ${theme.accent}` }} />
              <span style={{ color: theme.accent, fontSize: "13px", fontWeight: 600, letterSpacing: "0.02em" }}>Realtime Collaboration Platform</span>
            </div>
            <h1 style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 24px 0", background: "linear-gradient(180deg, #FFFFFF 0%, #94A3B8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              One Workspace.<br/>Every Conversation.<br/>Zero Chaos.
            </h1>
            <p style={{ fontSize: "18px", color: theme.muted, lineHeight: 1.6, margin: "0 0 40px 0", maxWidth: "480px" }}>
              WorkLoop brings channels, direct messaging, threads, files, reminders and realtime collaboration together in a single, high-performance workspace.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              <NavLink to={isAuthenticated ? workspacePath : "/register"} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: theme.accent, color: theme.bg, padding: "14px 28px", borderRadius: "12px", textDecoration: "none", fontSize: "16px", fontWeight: 600, transition: "all 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.background=theme.accentHover} onMouseLeave={(e)=>e.currentTarget.style.background=theme.accent}>
                Launch Workspace <ArrowRight size={18} />
              </NavLink>
              <button style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: theme.cardBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, padding: "14px 28px", borderRadius: "12px", fontSize: "16px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.06)"} onMouseLeave={(e)=>e.currentTarget.style.background=theme.cardBg}>
                <PlayCircle size={18} /> Watch Demo
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{ position: "relative", height: "600px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {/* Floating UI Elements replacing flat image */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", width: "380px", height: "240px", background: "rgba(14,26,47,0.8)", backdropFilter: "blur(20px)", border: `1px solid ${theme.cardBorder}`, borderRadius: "16px", padding: "20px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", zIndex: 2 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: `1px solid ${theme.cardBorder}`, paddingBottom: "16px", marginBottom: "16px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: theme.success, boxShadow: `0 0 8px ${theme.success}` }} />
                <div style={{ fontWeight: 600, fontSize: "14px" }}># product-launch</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#3B82F6" }} />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600 }}>Alex Chen</span>
                      <span style={{ fontSize: "12px", color: theme.muted }}>Just now</span>
                    </div>
                    <div style={{ fontSize: "14px", color: "#CBD5E1", marginTop: "4px" }}>The new deployment is live! 🚀</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: theme.accent }} />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600 }}>Sarah Jenkins</span>
                      <span style={{ fontSize: "12px", color: theme.muted }}>1m ago</span>
                    </div>
                    <div style={{ fontSize: "14px", color: "#CBD5E1", marginTop: "4px" }}>Great work team. Monitoring metrics now.</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [15, -15, 15] }} 
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", right: "0", bottom: "10%", width: "240px", background: "rgba(14,26,47,0.9)", backdropFilter: "blur(20px)", border: `1px solid ${theme.cardBorder}`, borderRadius: "16px", padding: "16px", boxShadow: "0 20px 40px -12px rgba(0,0,0,0.5)", zIndex: 3 }}
            >
              <div style={{ fontSize: "13px", fontWeight: 700, color: theme.muted, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Active Team</div>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#1E293B" }} />
                    <div style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "8px", height: "8px", borderRadius: "50%", background: theme.success, border: "2px solid rgba(14,26,47,1)" }} />
                  </div>
                  <div style={{ flex: 1, height: "8px", background: "#1E293B", borderRadius: "4px" }} />
                </div>
              ))}
            </motion.div>

            <motion.div 
              animate={{ y: [-5, 5, -5] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", left: "-20px", top: "10%", background: "rgba(14,26,47,0.9)", backdropFilter: "blur(20px)", border: `1px solid ${theme.cardBorder}`, borderRadius: "16px", padding: "16px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 20px 40px -12px rgba(0,0,0,0.5)", zIndex: 4 }}
            >
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(34,211,238,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: theme.accent }}>
                <BellRing size={20} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>New mention</div>
                <div style={{ fontSize: "12px", color: theme.muted }}>in #engineering</div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* SECTION 2: SOCIAL PROOF / METRICS */}
      <section style={{ padding: "60px 24px", borderTop: `1px solid ${theme.cardBorder}`, borderBottom: `1px solid ${theme.cardBorder}`, background: theme.surface }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", textAlign: "center" }}>
          {[
            { label: "Realtime Messaging", icon: <ZapIcon size={24} color={theme.accent} /> },
            { label: "Channels & Threads", icon: <Hash size={24} color={theme.accent} /> },
            { label: "File Sharing", icon: <File size={24} color={theme.accent} /> },
            { label: "Workspace Collaboration", icon: <Users size={24} color={theme.accent} /> },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <div style={{ padding: "12px", background: "rgba(34,211,238,0.05)", borderRadius: "12px", border: `1px solid rgba(34,211,238,0.1)` }}>
                  {item.icon}
                </div>
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: theme.text, margin: 0 }}>{item.label}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: PRODUCT SHOWCASE */}
      <section style={{ padding: "120px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "160px" }}>
          
          {/* Messaging */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "12px", background: "rgba(34,211,238,0.1)", color: theme.accent, marginBottom: "24px" }}>
                <MessageSquare size={24} />
              </div>
              <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "0 0 20px 0", letterSpacing: "-0.02em" }}>Instant channel messaging.</h2>
              <p style={{ fontSize: "18px", color: theme.muted, lineHeight: 1.6, margin: "0 0 32px 0" }}>
                Communicate with your team in real-time. Organize conversations by topic, project, or department. Use threaded discussions to keep channels clean.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                {['Realtime message delivery', 'Threaded replies for context', 'Rich emoji reactions'].map((text, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", color: theme.text }}>
                    <CheckCircle2 size={20} color={theme.success} /> {text}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div style={{ background: theme.surfaceElevated, border: `1px solid ${theme.cardBorder}`, borderRadius: "24px", padding: "24px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
                 <div style={{ height: "300px", background: "#0B1324", borderRadius: "12px", border: `1px solid ${theme.cardBorder}`, display: "flex", flexDirection: "column", padding: "20px", gap: "20px" }}>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#3B82F6" }}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ width: "120px", height: "12px", background: "#1E293B", borderRadius: "4px", marginBottom: "8px" }}/>
                        <div style={{ width: "80%", height: "16px", background: "#334155", borderRadius: "4px", marginBottom: "6px" }}/>
                        <div style={{ width: "60%", height: "16px", background: "#334155", borderRadius: "4px" }}/>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: theme.accent }}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ width: "90px", height: "12px", background: "#1E293B", borderRadius: "4px", marginBottom: "8px" }}/>
                        <div style={{ width: "70%", height: "16px", background: "#334155", borderRadius: "4px", marginBottom: "12px" }}/>
                        <div style={{ display: "flex", gap: "8px" }}>
                           <div style={{ width: "40px", height: "24px", background: "#1E293B", borderRadius: "12px" }} />
                           <div style={{ width: "50px", height: "24px", background: "#1E293B", borderRadius: "12px" }} />
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Direct Messaging */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ order: 1 }}>
              <div style={{ background: theme.surfaceElevated, border: `1px solid ${theme.cardBorder}`, borderRadius: "24px", padding: "24px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
                 <div style={{ height: "300px", background: "#0B1324", borderRadius: "12px", border: `1px solid ${theme.cardBorder}`, display: "flex", padding: "20px", gap: "20px" }}>
                    <div style={{ width: "200px", borderRight: `1px solid ${theme.cardBorder}`, display: "flex", flexDirection: "column", gap: "16px" }}>
                      {[1,2,3].map(i => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#1E293B" }} />
                          <div style={{ width: "80px", height: "12px", background: "#1E293B", borderRadius: "4px" }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      <div style={{ alignSelf: "flex-end", width: "70%", height: "40px", background: theme.accent, borderRadius: "12px 12px 0 12px", marginBottom: "16px" }} />
                      <div style={{ alignSelf: "flex-start", width: "60%", height: "60px", background: "#1E293B", borderRadius: "12px 12px 12px 0" }} />
                    </div>
                 </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }} style={{ order: 2 }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "12px", background: "rgba(34,211,238,0.1)", color: theme.accent, marginBottom: "24px" }}>
                <Inbox size={24} />
              </div>
              <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "0 0 20px 0", letterSpacing: "-0.02em" }}>Private communication.</h2>
              <p style={{ fontSize: "18px", color: theme.muted, lineHeight: 1.6, margin: "0 0 32px 0" }}>
                Connect 1-on-1 with teammates securely. Share files, establish private workflows, and see when others are active with live presence indicators.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                {['Live typing indicators', 'Secure file sharing', 'Online presence tracking'].map((text, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", color: theme.text }}>
                    <CheckCircle2 size={20} color={theme.success} /> {text}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Workspaces & Notifications */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "12px", background: "rgba(34,211,238,0.1)", color: theme.accent, marginBottom: "24px" }}>
                <Layout size={24} />
              </div>
              <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "0 0 20px 0", letterSpacing: "-0.02em" }}>Centralized control.</h2>
              <p style={{ fontSize: "18px", color: theme.muted, lineHeight: 1.6, margin: "0 0 32px 0" }}>
                Organize teams into powerful Workspaces. Manage members, monitor activity from the Command Center, and never miss critical updates with priority reminders.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                {['Granular member management', 'Intelligent notification drawer', 'Time-based reminder system'].map((text, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", color: theme.text }}>
                    <CheckCircle2 size={20} color={theme.success} /> {text}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div style={{ background: theme.surfaceElevated, border: `1px solid ${theme.cardBorder}`, borderRadius: "24px", padding: "24px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}>
                 <div style={{ height: "300px", background: "#0B1324", borderRadius: "12px", border: `1px solid ${theme.cardBorder}`, padding: "20px", position: "relative", overflow: "hidden" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                      <div style={{ width: "140px", height: "20px", background: "#1E293B", borderRadius: "4px" }} />
                      <div style={{ width: "32px", height: "32px", background: "rgba(34,211,238,0.1)", borderRadius: "8px", border: `1px solid ${theme.accent}` }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div style={{ height: "100px", background: "#1E293B", borderRadius: "12px" }} />
                      <div style={{ height: "100px", background: "#1E293B", borderRadius: "12px" }} />
                    </div>
                    <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "160px", background: "rgba(14,26,47,0.95)", borderLeft: `1px solid ${theme.cardBorder}`, padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ width: "80px", height: "12px", background: "#334155", borderRadius: "4px" }} />
                      <div style={{ height: "40px", background: "#1E293B", borderRadius: "8px", borderLeft: `2px solid ${theme.accent}` }} />
                      <div style={{ height: "40px", background: "#1E293B", borderRadius: "8px", borderLeft: `2px solid ${theme.success}` }} />
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* SECTION 4: WHY WORKLOOP (Comparison) */}
      <section style={{ padding: "100px 24px", background: theme.surface }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "0 0 16px 0", letterSpacing: "-0.02em" }}>A better way to work.</h2>
            <p style={{ fontSize: "18px", color: theme.muted, maxWidth: "600px", margin: "0 auto" }}>Leave the chaos of disjointed tools behind.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: theme.bg, borderRadius: "24px", border: `1px solid ${theme.cardBorder}`, overflow: "hidden" }}>
            <div style={{ padding: "40px", borderRight: `1px solid ${theme.cardBorder}` }}>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: theme.muted, marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#EF4444" }} /> 
                Traditional Tools
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "24px" }}>
                <li style={{ color: theme.muted, fontSize: "16px" }}>Scattered conversations across apps</li>
                <li style={{ color: theme.muted, fontSize: "16px" }}>Missed updates and broken notifications</li>
                <li style={{ color: theme.muted, fontSize: "16px" }}>Lost files in endless scroll</li>
                <li style={{ color: theme.muted, fontSize: "16px" }}>Sluggish loading times</li>
              </ul>
            </div>
            <div style={{ padding: "40px", background: "rgba(34,211,238,0.02)" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: theme.text, marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: theme.accent, boxShadow: `0 0 10px ${theme.accent}` }} /> 
                WorkLoop
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "24px" }}>
                <li style={{ color: theme.text, fontSize: "16px", fontWeight: 500, display: "flex", alignItems: "center", gap: "12px" }}><CheckCircle2 size={18} color={theme.accent}/> Organized channels & threads</li>
                <li style={{ color: theme.text, fontSize: "16px", fontWeight: 500, display: "flex", alignItems: "center", gap: "12px" }}><CheckCircle2 size={18} color={theme.accent}/> Centralized realtime notifications</li>
                <li style={{ color: theme.text, fontSize: "16px", fontWeight: 500, display: "flex", alignItems: "center", gap: "12px" }}><CheckCircle2 size={18} color={theme.accent}/> Unified workspace architecture</li>
                <li style={{ color: theme.text, fontSize: "16px", fontWeight: 500, display: "flex", alignItems: "center", gap: "12px" }}><CheckCircle2 size={18} color={theme.accent}/> Instant WebSockets delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WORKFLOW TIMELINE */}
      <section style={{ padding: "120px 24px", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
             <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "0 0 16px 0", letterSpacing: "-0.02em" }}>The Workflow</h2>
          </div>
          
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            {/* Connecting line */}
            <div style={{ position: "absolute", top: "32px", left: "5%", right: "5%", height: "2px", background: theme.cardBorder, zIndex: 0 }} />
            <motion.div initial={{ width: "0%" }} whileInView={{ width: "90%" }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeInOut" }} style={{ position: "absolute", top: "32px", left: "5%", height: "2px", background: `linear-gradient(90deg, ${theme.accent}, ${theme.success})`, zIndex: 1 }} />

            {[
              { step: "1", title: "Create Workspace", icon: <Globe size={24} /> },
              { step: "2", title: "Invite Members", icon: <Users size={24} /> },
              { step: "3", title: "Create Channels", icon: <Hash size={24} /> },
              { step: "4", title: "Collaborate", icon: <MessageSquare size={24} /> },
              { step: "5", title: "Stay Updated", icon: <BellRing size={24} /> },
              { step: "6", title: "Deliver Faster", icon: <ZapIcon size={24} /> }
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", width: "120px", textAlign: "center" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: theme.surfaceElevated, border: `2px solid ${theme.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: theme.text, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)" }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: theme.accent, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Step {item.step}</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: theme.text }}>{item.title}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: PRODUCT FEATURES GRID */}
      <section style={{ padding: "100px 24px", background: theme.surface }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: 800, margin: "0 0 16px 0", letterSpacing: "-0.02em" }}>Everything you need.</h2>
            <p style={{ fontSize: "18px", color: theme.muted, maxWidth: "600px", margin: "0 auto" }}>Built for performance, designed for professionals.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px" }}>
            {[
              { title: "Realtime Messaging", desc: "Instant WebSockets delivery with zero latency.", icon: <Zap size={24}/> },
              { title: "Thread Discussions", desc: "Keep main channels clear by replying in focused threads.", icon: <MessageSquare size={24}/> },
              { title: "Workspace Management", desc: "Powerful admin controls for teams and permissions.", icon: <Shield size={24}/> },
              { title: "File Sharing", desc: "Drag and drop files securely within any conversation.", icon: <File size={24}/> },
              { title: "Notifications", desc: "Smart alerts so you only get notified when it matters.", icon: <BellRing size={24}/> },
              { title: "Smart Reminders", desc: "Schedule messages to follow up precisely when needed.", icon: <Clock size={24}/> }
            ].map((f, i) => (
              <motion.div 
                key={f.title} 
                whileHover={{ y: -5, borderColor: "rgba(34,211,238,0.3)", backgroundColor: "rgba(255,255,255,0.04)" }}
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: "16px", padding: "32px", transition: "all 0.3s" }}
              >
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(34,211,238,0.1)", color: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, margin: "0 0 12px 0", color: theme.text }}>{f.title}</h3>
                <p style={{ fontSize: "15px", color: theme.muted, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CTA */}
      <section style={{ padding: "120px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(180deg, ${theme.bg} 0%, ${theme.surfaceElevated} 100%)`, zIndex: 0 }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "800px", background: theme.accent, filter: "blur(200px)", opacity: 0.1, borderRadius: "50%", zIndex: 0 }} />
        
        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(40px, 5vw, 56px)", fontWeight: 800, margin: "0 0 24px 0", letterSpacing: "-0.03em" }}>Ready to bring your team together?</h2>
          <p style={{ fontSize: "20px", color: theme.muted, margin: "0 auto 48px auto", maxWidth: "600px", lineHeight: 1.6 }}>Create your first workspace and experience true realtime collaboration.</p>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
            <NavLink to="/register" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: theme.accent, color: theme.bg, padding: "16px 32px", borderRadius: "12px", textDecoration: "none", fontSize: "16px", fontWeight: 600, transition: "all 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.background=theme.accentHover} onMouseLeave={(e)=>e.currentTarget.style.background=theme.accent}>
              Launch Workspace <ArrowRight size={18} />
            </NavLink>
            <NavLink to="/register" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "transparent", color: theme.text, border: `1px solid ${theme.cardBorder}`, padding: "16px 32px", borderRadius: "12px", textDecoration: "none", fontSize: "16px", fontWeight: 600, transition: "all 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.05)"} onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}>
              Create Account
            </NavLink>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${theme.cardBorder}`, background: theme.surface, padding: "80px 24px 40px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <Logo width={32} height={32} />
              <span style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.02em", color: theme.text }}>WorkLoop</span>
            </div>
            <p style={{ color: theme.muted, fontSize: "14px", lineHeight: 1.6, maxWidth: "280px" }}>
              Realtime collaboration platform built for modern teams. Execute faster with organized workflows.
            </p>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: theme.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>Product</h4>
            <a href="#" style={{ color: theme.muted, textDecoration: "none", fontSize: "14px" }}>Messaging</a>
            <a href="#" style={{ color: theme.muted, textDecoration: "none", fontSize: "14px" }}>Channels</a>
            <a href="#" style={{ color: theme.muted, textDecoration: "none", fontSize: "14px" }}>Workspaces</a>
            <a href="#" style={{ color: theme.muted, textDecoration: "none", fontSize: "14px" }}>Notifications</a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: theme.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>Company</h4>
            <a href="#" style={{ color: theme.muted, textDecoration: "none", fontSize: "14px" }}>About</a>
            <a href="#" style={{ color: theme.muted, textDecoration: "none", fontSize: "14px" }}>Documentation</a>
            <a href="#" style={{ color: theme.muted, textDecoration: "none", fontSize: "14px" }}>GitHub</a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 700, color: theme.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>Resources</h4>
            <a href="#" style={{ color: theme.muted, textDecoration: "none", fontSize: "14px" }}>Support</a>
            <a href="#" style={{ color: theme.muted, textDecoration: "none", fontSize: "14px" }}>Contact</a>
          </div>
        </div>
        <div style={{ maxWidth: "1200px", margin: "64px auto 0 auto", paddingTop: "32px", borderTop: `1px solid ${theme.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center", color: theme.muted, fontSize: "14px" }}>
          <div>© {new Date().getFullYear()} WorkLoop. All rights reserved.</div>
          <div style={{ display: "flex", gap: "24px" }}>
            <a href="#" style={{ color: theme.muted, textDecoration: "none" }}>Privacy Policy</a>
            <a href="#" style={{ color: theme.muted, textDecoration: "none" }}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}