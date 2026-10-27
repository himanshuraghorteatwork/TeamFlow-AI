import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Hash,
  Send,
  Users,
  Search,
  Plus,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  Clock,
  MoreVertical,
  Phone,
  Video,
  Pin,
  X,
  FileText,
  Download,
  Palette,
  Sparkles,
  Info,
  CornerUpLeft,
  Copy,
  Trash2,
  Lock,
  Globe,
  Bell,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminChat.css";

const STORAGE_KEY_MESSAGES = "teamflow_admin_chat_messages";
const STORAGE_KEY_CHANNELS = "teamflow_admin_chat_channels";
const STORAGE_KEY_THEME = "teamflow_chat_theme";

const DEFAULT_CHANNELS = [
  {
    id: "c-general",
    name: "general",
    description: "Company-wide updates, platform status & team collaboration",
    membersCount: 14,
    isPrivate: false,
    unread: 0,
  },
  {
    id: "c-engineering",
    name: "engineering",
    description: "Architecture discussions, sprint releases, telemetry & CI/CD",
    membersCount: 9,
    isPrivate: false,
    unread: 2,
  },
  {
    id: "c-marketing",
    name: "marketing",
    description: "Growth initiatives, customer success collateral & releases",
    membersCount: 6,
    isPrivate: false,
    unread: 0,
  },
  {
    id: "c-leadership",
    name: "leadership",
    description: "Executive planning, board meetings & organizational strategy",
    membersCount: 4,
    isPrivate: true,
    unread: 1,
  },
  {
    id: "c-product-design",
    name: "product-design",
    description: "Design systems, user research findings & Figma prototypes",
    membersCount: 8,
    isPrivate: false,
    unread: 0,
  },
  {
    id: "c-announcements",
    name: "announcements",
    description: "Official organizational policies, all-hands reminders & notices",
    membersCount: 28,
    isPrivate: false,
    unread: 3,
  },
];

const DIRECT_MEMBERS = [
  {
    id: "u-1",
    name: "Sarah Chen",
    role: "Team Lead",
    department: "Frontend Squad",
    status: "online",
    avatar: "SC",
    color: "#6366f1",
    email: "sarah.chen@teamflow.ai",
  },
  {
    id: "u-2",
    name: "David Lee",
    role: "Architect",
    department: "Cloud Infra",
    status: "online",
    avatar: "DL",
    color: "#0284c7",
    email: "david.lee@teamflow.ai",
  },
  {
    id: "u-3",
    name: "Emily Parker",
    role: "Product Designer",
    department: "UI/UX Studio",
    status: "meeting",
    avatar: "EP",
    color: "#ec4899",
    email: "emily.p@teamflow.ai",
  },
  {
    id: "u-4",
    name: "Michael Rodriguez",
    role: "Senior Developer",
    department: "Backend APIs",
    status: "offline",
    avatar: "MR",
    color: "#8b5cf6",
    email: "michael.r@teamflow.ai",
  },
  {
    id: "u-5",
    name: "Priya Patel",
    role: "QA Lead",
    department: "Automation Testing",
    status: "online",
    avatar: "PP",
    color: "#10b981",
    email: "priya.p@teamflow.ai",
  },
  {
    id: "u-6",
    name: "Alex Rivera",
    role: "DevOps Engineer",
    department: "Site Reliability",
    status: "online",
    avatar: "AR",
    color: "#f59e0b",
    email: "alex.r@teamflow.ai",
  },
];

const INITIAL_MESSAGES = [
  // General Channel
  {
    id: 101,
    targetId: "c-general",
    sender: "Sarah Chen",
    role: "Team Lead",
    avatar: "SC",
    color: "#6366f1",
    text: "Good morning team! The Q4 roadmap presentation has been published. Let's sync on sprint deliverables.",
    time: "09:45 AM",
    reactions: { "👍": 4, "🚀": 3 },
  },
  {
    id: 102,
    targetId: "c-general",
    sender: "David Lee",
    role: "Architect",
    avatar: "DL",
    color: "#0284c7",
    text: "Microservices deployment to production cluster is scheduled for 2 PM UTC today. Telemetry pipelines are green.",
    time: "10:12 AM",
    reactions: { "🎉": 3, "🔥": 2 },
  },
  {
    id: 103,
    targetId: "c-general",
    sender: "Amit Sharma",
    role: "Organization Admin",
    avatar: "AS",
    color: "#4f46e5",
    text: "Great progress everyone. Let me know if any squad needs quota upgrades before release cut-off.",
    time: "10:25 AM",
    reactions: { "👍": 5 },
  },
  {
    id: 104,
    targetId: "c-general",
    sender: "Sarah Chen",
    role: "Team Lead",
    avatar: "SC",
    color: "#6366f1",
    text: "All resource quotas are sufficient for Sprint 14. We've verified disk allocations in the Admin portal.",
    time: "10:28 AM",
    reactions: { "🙌": 2 },
  },

  // Engineering Channel
  {
    id: 201,
    targetId: "c-engineering",
    sender: "David Lee",
    role: "Architect",
    avatar: "DL",
    color: "#0284c7",
    text: "Vite 8 build benchmark results: cold compile is now under 920ms across all 2,600+ modules.",
    time: "09:30 AM",
    attachment: {
      name: "build_benchmark_v8.pdf",
      size: "1.2 MB",
      type: "pdf",
    },
    reactions: { "🚀": 6, "🔥": 4 },
  },
  {
    id: 202,
    targetId: "c-engineering",
    sender: "Alex Rivera",
    role: "DevOps Engineer",
    avatar: "AR",
    color: "#f59e0b",
    text: "Kubernetes pod autoscaling policy is validated. Zero throttled requests during morning traffic surge.",
    time: "10:05 AM",
    reactions: { "👍": 3 },
  },
  {
    id: 203,
    targetId: "c-engineering",
    sender: "Amit Sharma",
    role: "Organization Admin",
    avatar: "AS",
    color: "#4f46e5",
    text: "Excellent engineering execution. Please make sure latency telemetry is logged in Audit Logs.",
    time: "10:18 AM",
    reactions: { "🫡": 2 },
  },

  // Leadership Channel
  {
    id: 301,
    targetId: "c-leadership",
    sender: "Amit Sharma",
    role: "Organization Admin",
    avatar: "AS",
    color: "#4f46e5",
    text: "Q4 enterprise revenue target was exceeded by 18%. Planning next quarter's workspace seat expansions.",
    time: "08:50 AM",
    reactions: { "👏": 4, "🚀": 2 },
  },
  {
    id: 302,
    targetId: "c-leadership",
    sender: "Sarah Chen",
    role: "Team Lead",
    avatar: "SC",
    color: "#6366f1",
    text: "Headcount projections for Engineering and Design are prepared for tomorrow's board review.",
    time: "09:15 AM",
    reactions: { "👍": 3 },
  },

  // Direct Message with Sarah Chen (u-1)
  {
    id: 401,
    targetId: "u-1",
    sender: "Sarah Chen",
    role: "Team Lead",
    avatar: "SC",
    color: "#6366f1",
    text: "Hi Amit, do you have a moment to review the revised workspace permission matrix before we deploy?",
    time: "10:40 AM",
    reactions: { "🤝": 1 },
  },
  {
    id: 402,
    targetId: "u-1",
    sender: "Amit Sharma",
    role: "Organization Admin",
    avatar: "AS",
    color: "#4f46e5",
    text: "Hi Sarah! Yes, I reviewed the roles and security policies in Settings. Looks very solid.",
    time: "10:44 AM",
    reactions: { "👍": 1 },
  },

  // Direct Message with David Lee (u-2)
  {
    id: 501,
    targetId: "u-2",
    sender: "David Lee",
    role: "Architect",
    avatar: "DL",
    color: "#0284c7",
    text: "Hey Amit, the cloud backup snapshot completed with 100% data integrity.",
    time: "09:00 AM",
    reactions: { "✅": 1 },
  },
];

const POPULAR_EMOJIS = ["👍", "❤️", "🚀", "🎉", "🔥", "💡", "😂", "👏", "🤝", "🙌", "✨", "💯"];

const SAMPLE_ATTACHMENTS = [
  { name: "Q4_Platform_Architecture.pdf", size: "2.4 MB" },
  { name: "Sprint_14_Release_Plan.docx", size: "840 KB" },
  { name: "Production_Telemetry_Summary.png", size: "1.8 MB" },
];

export default function AdminChat() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Channels state
  const [channels, setChannels] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHANNELS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_CHANNELS;
  });

  // Messages state
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_MESSAGES;
  });

  // Active chat target (Channel or DM)
  const [activeTarget, setActiveTarget] = useState({
    type: "channel",
    id: "c-general",
    name: "general",
    description: "Company-wide updates, platform status & team collaboration",
    membersCount: 14,
  });

  // Theme state
  const [chatTheme, setChatTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_THEME) || "indigo";
  });

  // Composer state
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [navSearch, setNavSearch] = useState("");
  const [threadSearch, setThreadSearch] = useState("");
  const [showThreadSearch, setShowThreadSearch] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // New Channel Modal State
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [newChannelForm, setNewChannelForm] = useState({
    name: "",
    description: "",
    isPrivate: false,
  });

  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Save messages to localStorage
  const updateMessages = (newMessages) => {
    setMessages(newMessages);
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(newMessages));
    } catch (e) {}
  };

  // Save channels to localStorage
  const updateChannels = (newChannels) => {
    setChannels(newChannels);
    try {
      localStorage.setItem(STORAGE_KEY_CHANNELS, JSON.stringify(newChannels));
    } catch (e) {}
  };

  const handleSelectTheme = (themeKey) => {
    setChatTheme(themeKey);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, themeKey);
    } catch (e) {}
  };

  // Close emoji picker when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter messages for current target & thread search
  const activeMessages = useMemo(() => {
    return messages
      .filter((m) => m.targetId === activeTarget.id)
      .filter((m) => {
        if (!threadSearch.trim()) return true;
        const q = threadSearch.toLowerCase();
        return (
          m.text?.toLowerCase().includes(q) ||
          m.sender?.toLowerCase().includes(q) ||
          m.attachment?.name?.toLowerCase().includes(q)
        );
      });
  }, [messages, activeTarget, threadSearch]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, typingUser]);

  // Toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Switch Target helper
  const selectChannel = (ch) => {
    setActiveTarget({
      type: "channel",
      id: ch.id,
      name: ch.name,
      description: ch.description,
      membersCount: ch.membersCount,
      isPrivate: ch.isPrivate,
    });
    // clear unread
    if (ch.unread > 0) {
      const nextCh = channels.map((c) => (c.id === ch.id ? { ...c, unread: 0 } : c));
      updateChannels(nextCh);
    }
  };

  const selectDM = (member) => {
    setActiveTarget({
      type: "dm",
      id: member.id,
      name: member.name,
      role: member.role,
      department: member.department,
      status: member.status,
      avatar: member.avatar,
      color: member.color,
      email: member.email,
    });
  };

  // Send message
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    const messageText = inputText.trim();
    const currentAttachment = attachedFile;

    const newMsg = {
      id: Date.now(),
      targetId: activeTarget.id,
      sender: "Amit Sharma",
      role: "Organization Admin",
      avatar: "AS",
      color: "#4f46e5",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      reactions: {},
      ...(currentAttachment ? { attachment: currentAttachment } : {}),
    };

    const next = [...messages, newMsg];
    updateMessages(next);
    setInputText("");
    setAttachedFile(null);
    setShowEmojiPicker(false);

    // Simulate living team chat: after 1.4s show typing, after 2.6s respond!
    simulateTeamReply(activeTarget, messageText);
  };

  // Simulated auto-reply to make the chat feel 100% alive & real
  const simulateTeamReply = (target, userMsg) => {
    let replySender = "";
    let replyRole = "";
    let replyAvatar = "";
    let replyColor = "";
    let replyText = "";

    if (target.type === "dm") {
      replySender = target.name;
      replyRole = target.role;
      replyAvatar = target.avatar;
      replyColor = target.color;
      replyText = `Understood Amit, on it right away! Will update you shortly 👍`;
    } else if (target.id === "c-engineering") {
      replySender = "David Lee";
      replyRole = "Architect";
      replyAvatar = "DL";
      replyColor = "#0284c7";
      replyText = `Monitoring telemetry on the production cluster now. All systems responding within normal thresholds.`;
    } else if (target.id === "c-marketing") {
      replySender = "Emily Parker";
      replyRole = "Product Designer";
      replyAvatar = "EP";
      replyColor = "#ec4899";
      replyText = `Shared the updated product landing visuals with the growth team!`;
    } else {
      replySender = "Sarah Chen";
      replyRole = "Team Lead";
      replyAvatar = "SC";
      replyColor = "#6366f1";
      replyText = `Received! Thanks for confirming Amit. Let's keep up this momentum. 🚀`;
    }

    setTimeout(() => {
      setTypingUser(replySender);
      setTimeout(() => {
        setTypingUser(null);
        setMessages((prev) => {
          const autoMsg = {
            id: Date.now() + 1,
            targetId: target.id,
            sender: replySender,
            role: replyRole,
            avatar: replyAvatar,
            color: replyColor,
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            reactions: { "👍": 1 },
          };
          const nextMsgs = [...prev, autoMsg];
          try {
            localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(nextMsgs));
          } catch (e) {}
          return nextMsgs;
        });
      }, 1600);
    }, 1200);
  };

  // Reaction toggling
  const handleToggleReaction = (msgId, emoji) => {
    const updated = messages.map((m) => {
      if (m.id !== msgId) return m;
      const currentReactions = { ...(m.reactions || {}) };
      if (currentReactions[emoji]) {
        currentReactions[emoji] += 1;
      } else {
        currentReactions[emoji] = 1;
      }
      return { ...m, reactions: currentReactions };
    });
    updateMessages(updated);
  };

  // Attach mock document
  const handleAttachMock = () => {
    const sample = SAMPLE_ATTACHMENTS[Math.floor(Math.random() * SAMPLE_ATTACHMENTS.length)];
    setAttachedFile(sample);
    showToast(`Attached "${sample.name}"`);
  };

  // Insert emoji
  const handleAddEmoji = (emoji) => {
    setInputText((prev) => prev + emoji);
  };

  // Create channel submit
  const handleCreateChannel = (e) => {
    e.preventDefault();
    if (!newChannelForm.name.trim()) return;

    const formattedName = newChannelForm.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-");

    const newChan = {
      id: `c-${Date.now()}`,
      name: formattedName,
      description: newChannelForm.description.trim() || "TeamFlow organization channel",
      membersCount: 1,
      isPrivate: newChannelForm.isPrivate,
      unread: 0,
    };

    const nextChannels = [...channels, newChan];
    updateChannels(nextChannels);
    selectChannel(newChan);
    setShowChannelModal(false);
    setNewChannelForm({ name: "", description: "", isPrivate: false });
    showToast(`Created channel #${formattedName}`);
  };

  // Filter channels and DMs
  const filteredChannels = useMemo(() => {
    if (!navSearch.trim()) return channels;
    return channels.filter((c) =>
      c.name.toLowerCase().includes(navSearch.trim().toLowerCase())
    );
  }, [channels, navSearch]);

  const filteredMembers = useMemo(() => {
    if (!navSearch.trim()) return DIRECT_MEMBERS;
    return DIRECT_MEMBERS.filter(
      (m) =>
        m.name.toLowerCase().includes(navSearch.trim().toLowerCase()) ||
        m.role.toLowerCase().includes(navSearch.trim().toLowerCase())
    );
  }, [navSearch]);

  return (
    <div className={`admin-chat-app theme-${chatTheme}`}>
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="admin-chat-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        {/* TOAST POPUP */}
        {toastMessage && (
          <div className="admin-chat-toast">
            <Sparkles size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="admin-chat-layout">
          {/* =========================================================
              SIDEBAR: CHANNELS & DIRECT MESSAGES
          ========================================================= */}
          <aside className="chat-nav-sidebar">
            {/* SEARCH CHANNELS & MEMBERS */}
            <div className="chat-nav-search-wrap">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Jump to channel or person..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
              />
              {navSearch && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setNavSearch("")}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* CHANNELS SECTION */}
            <div className="chat-nav-section">
              <div className="section-header">
                <span className="section-title">CHANNELS</span>
                <button
                  type="button"
                  className="add-channel-btn"
                  title="Create new channel"
                  onClick={() => setShowChannelModal(true)}
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="channel-list">
                {filteredChannels.map((ch) => {
                  const isActive = activeTarget.type === "channel" && activeTarget.id === ch.id;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      className={`channel-btn ${isActive ? "active" : ""}`}
                      onClick={() => selectChannel(ch)}
                    >
                      <div className="channel-btn-left">
                        {ch.isPrivate ? <Lock size={14} /> : <Hash size={14} />}
                        <span className="channel-name">{ch.name}</span>
                      </div>
                      {ch.unread > 0 && <span className="channel-unread-pill">{ch.unread}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DIRECT MESSAGES SECTION */}
            <div className="chat-nav-section">
              <div className="section-header">
                <span className="section-title">DIRECT MESSAGES</span>
                <span className="members-count-badge">{DIRECT_MEMBERS.length}</span>
              </div>

              <div className="dm-list">
                {filteredMembers.map((m) => {
                  const isActive = activeTarget.type === "dm" && activeTarget.id === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      className={`dm-btn ${isActive ? "active" : ""}`}
                      onClick={() => selectDM(m)}
                    >
                      <div className="dm-btn-avatar-wrap">
                        <span
                          className="dm-avatar-mini"
                          style={{ backgroundColor: m.color }}
                        >
                          {m.avatar}
                        </span>
                        <span className={`status-indicator-dot ${m.status}`} />
                      </div>
                      <div className="dm-info">
                        <span className="dm-name">{m.name}</span>
                        <span className="dm-role">{m.role}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* =========================================================
              MAIN CONVERSATION THREAD
          ========================================================= */}
          <main className="chat-thread-container">
            {/* THREAD TOP HEADER */}
            <header className="chat-thread-header">
              <div className="thread-header-left">
                {activeTarget.type === "channel" ? (
                  <div className="target-icon channel-hash">
                    {activeTarget.isPrivate ? <Lock size={18} /> : <Hash size={20} />}
                  </div>
                ) : (
                  <div
                    className="target-icon dm-avatar"
                    style={{ backgroundColor: activeTarget.color || "#6366f1" }}
                  >
                    {activeTarget.avatar || "U"}
                    <span className={`status-indicator-dot ${activeTarget.status || "online"}`} />
                  </div>
                )}

                <div className="target-details">
                  <div className="target-title-row">
                    <h2>
                      {activeTarget.type === "channel" ? `#${activeTarget.name}` : activeTarget.name}
                    </h2>
                    {activeTarget.type === "channel" && (
                      <span className="member-count-pill">
                        <Users size={12} />
                        {activeTarget.membersCount || 12} members
                      </span>
                    )}
                    {activeTarget.type === "dm" && (
                      <span className="member-role-pill">
                        {activeTarget.role} • {activeTarget.department}
                      </span>
                    )}
                  </div>
                  <p className="target-desc">
                    {activeTarget.type === "channel"
                      ? activeTarget.description || "Real-time squad communication"
                      : `${activeTarget.email || "Active now"} • Direct channel`}
                  </p>
                </div>
              </div>

              {/* THREAD HEADER ACTIONS */}
              <div className="thread-header-actions">
                {/* Search In Thread Toggle */}
                <button
                  type="button"
                  className={`action-icon-btn ${showThreadSearch ? "active" : ""}`}
                  title="Search conversation"
                  onClick={() => setShowThreadSearch((prev) => !prev)}
                >
                  <Search size={16} />
                </button>

                {/* Voice Call */}
                <button
                  type="button"
                  className="action-icon-btn"
                  title="Start Voice Call"
                  onClick={() => showToast(`Starting secure voice conference in #${activeTarget.name}...`)}
                >
                  <Phone size={16} />
                </button>

                {/* Video Call */}
                <button
                  type="button"
                  className="action-icon-btn"
                  title="Start Video Meeting"
                  onClick={() => showToast(`Launching HD video room for ${activeTarget.name}...`)}
                >
                  <Video size={16} />
                </button>

                {/* Pinned Messages */}
                <button
                  type="button"
                  className="action-icon-btn"
                  title="Pinned Messages"
                  onClick={() => showToast("Viewing pinned resources in channel")}
                >
                  <Pin size={16} />
                </button>

                {/* Theme Selector */}
                <div className="chat-theme-picker">
                  <Palette size={15} />
                  <span>Theme:</span>
                  <select
                    value={chatTheme}
                    onChange={(e) => handleSelectTheme(e.target.value)}
                    className="chat-theme-select"
                  >
                    <option value="lavender">Soft Lavender</option>
                    <option value="sky">Sky Azure</option>
                    <option value="mint">Mint Fresh</option>
                    <option value="peach">Warm Peach</option>
                    <option value="slate">Clean Slate</option>
                    <option value="indigo">Classic Indigo</option>
                    <option value="cyber">Cyber Purple</option>
                  </select>
                </div>
              </div>
            </header>

            {/* OPTIONAL IN-THREAD SEARCH BAR */}
            {showThreadSearch && (
              <div className="in-thread-search-bar">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Filter messages in this conversation..."
                  value={threadSearch}
                  onChange={(e) => setThreadSearch(e.target.value)}
                  autoFocus
                />
                {threadSearch && (
                  <button
                    type="button"
                    className="clear-thread-search"
                    onClick={() => setThreadSearch("")}
                  >
                    <X size={13} />
                  </button>
                )}
                <span className="results-count">
                  {activeMessages.length} message{activeMessages.length === 1 ? "" : "s"}
                </span>
              </div>
            )}

            {/* MESSAGES FEED */}
            <div className="chat-messages-feed">
              <div className="chat-date-divider">
                <span>Today, October 26, 2026</span>
              </div>

              {activeMessages.length === 0 ? (
                <div className="chat-empty-state">
                  <div className="empty-bubble-icon">
                    <Hash size={32} />
                  </div>
                  <h3>Welcome to #{activeTarget.name}!</h3>
                  <p>This is the start of the #{activeTarget.name} communication thread.</p>
                </div>
              ) : (
                activeMessages.map((msg) => {
                  const isMe = msg.sender === "Amit Sharma";
                  return (
                    <div
                      key={msg.id}
                      className={`chat-message-row ${isMe ? "msg-right is-me" : "msg-left is-other"}`}
                    >
                      {/* Avatar for received messages */}
                      {!isMe && (
                        <div
                          className="msg-avatar"
                          style={{ backgroundColor: msg.color || "#6366f1" }}
                        >
                          {msg.avatar || "U"}
                        </div>
                      )}

                      <div className="msg-content-wrapper">
                        {/* SENDER HEADER */}
                        <div className="msg-header-row">
                          <strong className="msg-sender-name">{msg.sender}</strong>
                          <span className="msg-role-badge">{msg.role}</span>
                          <span className="msg-timestamp">{msg.time}</span>
                        </div>

                        {/* MESSAGE BUBBLE */}
                        <div className="msg-bubble">
                          <div className="msg-text-body">{msg.text}</div>

                          {/* ATTACHMENT CARD IF PRESENT */}
                          {msg.attachment && (
                            <div className="msg-attachment-card">
                              <div className="file-icon-wrap">
                                <FileText size={20} />
                              </div>
                              <div className="file-meta">
                                <span className="file-name">{msg.attachment.name}</span>
                                <span className="file-size">{msg.attachment.size}</span>
                              </div>
                              <button
                                type="button"
                                className="download-attachment-btn"
                                title="Download File"
                                onClick={() => showToast(`Downloaded ${msg.attachment.name}`)}
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          )}

                          {/* READ RECEIPT FOR OUTGOING MESSAGES */}
                          {isMe && (
                            <div className="read-receipt-wrap">
                              <span className="time-inner">{msg.time}</span>
                              <CheckCheck size={14} className="check-double" />
                            </div>
                          )}
                        </div>

                        {/* MESSAGE REACTIONS ROW */}
                        <div className="msg-reactions-row">
                          {msg.reactions &&
                            Object.entries(msg.reactions).map(([emoji, count]) => (
                              <button
                                key={emoji}
                                type="button"
                                className="reaction-pill"
                                onClick={() => handleToggleReaction(msg.id, emoji)}
                                title={`Reacted with ${emoji}`}
                              >
                                <span className="reaction-emoji">{emoji}</span>
                                <span className="reaction-count">{count}</span>
                              </button>
                            ))}

                          {/* Add reaction quick trigger */}
                          <button
                            type="button"
                            className="add-reaction-pill-btn"
                            title="Add reaction"
                            onClick={() => handleToggleReaction(msg.id, "👍")}
                          >
                            <Smile size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Avatar for sent messages on the right */}
                      {isMe && (
                        <div
                          className="msg-avatar is-me-avatar"
                          style={{ backgroundColor: msg.color || "#4f46e5" }}
                        >
                          {msg.avatar || "AS"}
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/* TYPING INDICATOR */}
              {typingUser && (
                <div className="chat-typing-indicator-row">
                  <span className="typing-avatar">
                    <Sparkles size={13} />
                  </span>
                  <div className="typing-bubble">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                  <span className="typing-text">{typingUser} is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* =========================================================
                MESSAGE COMPOSER
            ========================================================= */}
            <div className="chat-composer-container">
              {/* ATTACHED FILE CHIP */}
              {attachedFile && (
                <div className="composer-attachment-preview">
                  <FileText size={14} />
                  <span className="preview-name">{attachedFile.name}</span>
                  <span className="preview-size">({attachedFile.size})</span>
                  <button
                    type="button"
                    className="remove-preview-btn"
                    onClick={() => setAttachedFile(null)}
                  >
                    <X size={13} />
                  </button>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="chat-composer-form">
                {/* ATTACH FILE BUTTON */}
                <button
                  type="button"
                  className="composer-action-btn"
                  title="Attach file or screenshot"
                  onClick={handleAttachMock}
                >
                  <Paperclip size={18} />
                </button>

                {/* EMOJI PICKER POPUP */}
                <div className="emoji-picker-container" ref={emojiPickerRef}>
                  <button
                    type="button"
                    className={`composer-action-btn ${showEmojiPicker ? "active" : ""}`}
                    title="Insert emoji"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    <Smile size={18} />
                  </button>

                  {showEmojiPicker && (
                    <div className="emoji-popup-card">
                      <div className="emoji-popup-header">Popular Reactions</div>
                      <div className="emoji-grid">
                        {POPULAR_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            className="emoji-item-btn"
                            onClick={() => handleAddEmoji(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* TEXT INPUT */}
                <input
                  type="text"
                  placeholder={
                    activeTarget.type === "channel"
                      ? `Message #${activeTarget.name}...`
                      : `Message ${activeTarget.name}...`
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />

                {/* SEND BUTTON */}
                <button
                  type="submit"
                  className="composer-send-btn"
                  disabled={!inputText.trim() && !attachedFile}
                  title="Send message (Enter)"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>

      {/* CREATE CHANNEL MODAL */}
      {showChannelModal && (
        <div
          className="admin-chat-modal-overlay"
          onClick={() => setShowChannelModal(false)}
        >
          <div
            className="admin-chat-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Create Channel</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowChannelModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateChannel}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Channel Name</label>
                  <div className="channel-input-wrapper">
                    <span className="hash-prefix">#</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. security-audits"
                      value={newChannelForm.name}
                      onChange={(e) =>
                        setNewChannelForm({ ...newChannelForm, name: e.target.value })
                      }
                      autoFocus
                    />
                  </div>
                  <small>Names must be lowercase without spaces.</small>
                </div>

                <div className="form-group">
                  <label>Description (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="What is this channel about?"
                    value={newChannelForm.description}
                    onChange={(e) =>
                      setNewChannelForm({
                        ...newChannelForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group-checkbox">
                  <input
                    type="checkbox"
                    id="isPrivateCheck"
                    checked={newChannelForm.isPrivate}
                    onChange={(e) =>
                      setNewChannelForm({
                        ...newChannelForm,
                        isPrivate: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="isPrivateCheck">
                    <strong>Make private</strong>
                    <span>Only invited organization members can view this channel.</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowChannelModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-create">
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
