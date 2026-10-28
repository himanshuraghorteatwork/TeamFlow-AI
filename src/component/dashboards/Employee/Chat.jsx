import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Search,
  Plus,
  X,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Info,
  Download,
  FileText,
  Pin,
  Calendar,
  Users,
  Zap,
  Phone,
  Rocket,
  BarChart2,
  Megaphone,
  Hash,
  CheckCheck,
  Check,
  ChevronRight,
  Image as ImageIcon,
  Folder,
  UserPlus,
  Mail,
  User,
  Briefcase,
  ChevronUp,
  ChevronDown,
  Bell,
  BellOff,
  EyeOff,
  Copy,
  Trash2,
} from "lucide-react";

import EmployeeShell from "./EmployeeShell";
import "./Chat.css";
import { downloadFile } from "./downloadHelper";
import { getEmployeeProfile, DEFAULT_AVATAR } from "./EmployeeAuth";

/* Storage Key */
const STORAGE_KEY = "tf_team_chats_v3";

/* Sample member avatars */
const avatars = {
  rahul: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  neha: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  karan: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  amit: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
  priya: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
};

/* Default 10 Conversations matching the reference image */
const defaultConversations = [
  {
    id: "general",
    title: "TeamFlow - General",
    subtitle: "All team members • Announcements & banter",
    type: "channel", // channel or direct
    avatarType: "hash",
    avatarBg: "purple",
    lastMessage: "Sneha: Meeting at 4 PM today.",
    time: "10:24 AM",
    unread: 2,
    membersCount: 18,
    project: "TeamFlow AI",
    description: "General workspace channel for open team announcements and casual conversation.",
    messages: [
      {
        id: "gen-1",
        sender: "Sneha Rao",
        avatar: avatars.neha,
        time: "10:20 AM",
        text: "Reminder: All-hands meeting today at 4:00 PM in the main conference room.",
        reactions: { "👍": 5 },
        isOutgoing: false,
      },
      {
        id: "gen-2",
        sender: "Priya Patel",
        time: "10:24 AM",
        text: "Got it! Will be there.",
        isOutgoing: true,
      },
    ],
  },
  {
    id: "website",
    title: "TeamFlow Website",
    subtitle: "5 members | Project Discussion",
    type: "group",
    avatarType: "team",
    avatarBg: "purple",
    lastMessage: "Rahul: Design files updated.",
    time: "09:45 AM",
    unread: 1,
    membersCount: 5,
    project: "TeamFlow Website",
    category: "UI/UX Design Project",
    createdDate: "Jan 10, 2024",
    createdBy: "Rahul Sharma",
    description: "Redesign and develop the new TeamFlow AI website with modern UI/UX and improved performance.",
    messages: [
      // Date divider: Oct 23, 2024
      {
        id: "web-1",
        dateDivider: "Oct 23, 2024",
      },
      {
        id: "web-2",
        sender: "Rahul Sharma",
        senderInitials: "R",
        senderAvatarBg: "blue",
        time: "10:24 AM",
        text: "Hey team, the API is ready for testing. Please check the endpoints and let me know if you face any issues.",
        reactions: { "👍": 2 },
        isOutgoing: false,
      },
      {
        id: "web-3",
        sender: "You",
        time: "10:30 AM",
        text: "Thanks Rahul! I will check and update here.",
        isOutgoing: true,
      },
      {
        id: "web-4",
        sender: "Neha Patil",
        senderAvatar: avatars.neha,
        time: "11:15 AM",
        text: "I have updated the design files for the login page. You can find them in the project folder.",
        attachment: {
          name: "Login_Page_Design.fig",
          sub: "Figma File • 4.2 MB",
          type: "figma",
          size: "4.2 MB",
        },
        reactions: { "👍": 3, "❤️": 1 },
        isOutgoing: false,
      },
      // Date divider: Oct 24, 2024
      {
        id: "web-5",
        dateDivider: "Oct 24, 2024",
      },
      {
        id: "web-6",
        sender: "Amit Verma",
        senderInitials: "A",
        senderAvatarBg: "gray",
        time: "09:20 AM",
        text: "Today's meeting at 4 PM to discuss the sprint progress. Please join on time.",
        reactions: { "👍": 1 },
        isOutgoing: false,
      },
      {
        id: "web-7",
        sender: "You",
        time: "09:35 AM",
        text: "Sure, I will be there.",
        isOutgoing: true,
      },
      {
        id: "web-8",
        sender: "Karan More",
        senderAvatar: avatars.karan,
        time: "10:10 AM",
        text: "Bug fix build is ready. Please test and share feedback.",
        attachment: {
          name: "Build_v1.2.3.zip",
          sub: "ZIP File • 28.5 MB",
          type: "zip",
          size: "28.5 MB",
        },
        reactions: {},
        isOutgoing: false,
      },
    ],
  },
  {
    id: "amit",
    title: "Amit Verma",
    subtitle: "Online • Backend Engineer",
    type: "direct",
    avatarType: "initials",
    avatarInitials: "A",
    avatarBg: "gray",
    lastMessage: "You: Thanks! I will check.",
    time: "09:20 AM",
    unread: 0,
    membersCount: 2,
    project: "Backend Infrastructure",
    description: "Direct message with Amit Verma regarding database schemas and API integrations.",
    messages: [
      {
        id: "amit-1",
        sender: "Amit Verma",
        senderInitials: "A",
        time: "09:15 AM",
        text: "Sent you the database migration scripts for the auth service.",
        isOutgoing: false,
      },
      {
        id: "amit-2",
        sender: "You",
        time: "09:20 AM",
        text: "Thanks! I will check.",
        isOutgoing: true,
      },
    ],
  },
  {
    id: "mobile-app",
    title: "Mobile App Team",
    subtitle: "8 members | iOS & Android Sprint",
    type: "group",
    avatarType: "phone",
    avatarBg: "blue",
    lastMessage: "Karan: Build is ready for testing.",
    time: "Yesterday",
    unread: 0,
    membersCount: 8,
    project: "Mobile App",
    description: "Mobile engineering channel for React Native & Flutter builds.",
    messages: [
      {
        id: "mob-1",
        sender: "Karan More",
        senderAvatar: avatars.karan,
        time: "Yesterday",
        text: "Build is ready for testing. Check TestFlight for build 104.",
        isOutgoing: false,
      },
    ],
  },
  {
    id: "design-team",
    title: "Design Team",
    subtitle: "6 members | UI/UX & Design System",
    type: "group",
    avatarType: "initials",
    avatarInitials: "D",
    avatarBg: "orange",
    lastMessage: "Neha: Shared new UI components.",
    time: "Yesterday",
    unread: 0,
    membersCount: 6,
    project: "Design System",
    description: "Designers sync channel for Figma design kits and tokens.",
    messages: [
      {
        id: "des-1",
        sender: "Neha Patil",
        senderAvatar: avatars.neha,
        time: "Yesterday",
        text: "Shared new UI components in the Figma library.",
        isOutgoing: false,
      },
    ],
  },
  {
    id: "rahul",
    title: "Rahul Sharma",
    subtitle: "Lead Architect",
    type: "direct",
    avatarType: "initials",
    avatarInitials: "R",
    avatarBg: "blue",
    lastMessage: "You: Please share the API docs.",
    time: "Oct 23",
    unread: 0,
    membersCount: 2,
    project: "Architecture",
    description: "Direct discussion with Lead Architect Rahul.",
    messages: [
      {
        id: "rah-1",
        sender: "You",
        time: "Oct 23",
        text: "Please share the API docs for the user management endpoints.",
        isOutgoing: true,
      },
    ],
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    subtitle: "4 members | LLM & Automation",
    type: "group",
    avatarType: "rocket",
    avatarBg: "orange",
    lastMessage: "Priya: Working on the testing.",
    time: "Oct 22",
    unread: 0,
    membersCount: 4,
    project: "AI Integration",
    description: "AI model evaluation and prompt tuning channel.",
    messages: [
      {
        id: "ai-1",
        sender: "Priya Patel",
        time: "Oct 22",
        text: "Working on the testing for the automated summarization prompt.",
        isOutgoing: true,
      },
    ],
  },
  {
    id: "marketing-portal",
    title: "Marketing Portal",
    subtitle: "3 members | Content & CMS",
    type: "group",
    avatarType: "chart",
    avatarBg: "purple",
    lastMessage: "Amit: Updated the content.",
    time: "Oct 21",
    unread: 0,
    membersCount: 3,
    project: "Marketing Portal",
    description: "CMS templates and marketing landing page development.",
    messages: [
      {
        id: "mkt-1",
        sender: "Amit Verma",
        time: "Oct 21",
        text: "Updated the content for the landing page hero section.",
        isOutgoing: false,
      },
    ],
  },
  {
    id: "project-managers",
    title: "Project Managers",
    subtitle: "5 members | Resource Planning",
    type: "group",
    avatarType: "team",
    avatarBg: "blue",
    lastMessage: "Saurabh: Next sprint planning.",
    time: "Oct 20",
    unread: 0,
    membersCount: 5,
    project: "Management",
    description: "Scrum ceremonies and cross-team milestone roadmaps.",
    messages: [
      {
        id: "pm-1",
        sender: "Saurabh Joshi",
        time: "Oct 20",
        text: "Next sprint planning is scheduled for Monday at 10 AM.",
        isOutgoing: false,
      },
    ],
  },
  {
    id: "hr-announcements",
    title: "HR Announcements",
    subtitle: "Company-wide updates & policies",
    type: "channel",
    avatarType: "megaphone",
    avatarBg: "red",
    lastMessage: "New company policy updated.",
    time: "Oct 18",
    unread: 0,
    membersCount: 45,
    project: "Company",
    description: "Official notifications from Human Resources.",
    messages: [
      {
        id: "hr-1",
        sender: "HR Operations",
        time: "Oct 18",
        text: "New company policy updated: Flexible working hours & holiday schedule.",
        isOutgoing: false,
      },
    ],
  },
];

/* Sample common emojis */
const quickEmojis = ["👍", "❤️", "🔥", "🎉", "🚀", "👀", "🙌", "💯"];

function Chat() {
  const [profile, setProfile] = useState(getEmployeeProfile);

  useEffect(() => {
    const handleSync = () => setProfile(getEmployeeProfile());
    window.addEventListener("storage", handleSync);
    window.addEventListener("tf_profile_updated", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("tf_profile_updated", handleSync);
    };
  }, []);
  // Load conversations from localStorage
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5) return parsed;
      }
    } catch {}
    return defaultConversations;
  });

  // Active Selected Conversation (Default: 'website' matching target image)
  const [activeChatId, setActiveChatId] = useState("website");

  // Top header toggle: 'Chats' vs 'Channels'
  const [topToggle, setTopToggle] = useState("Chats");

  // Filter tabs: 'All' | 'Unread' | 'Groups' | 'Direct'
  const [filterTab, setFilterTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Right Drawer Tab: 'About' | 'Members' | 'Files' | 'Links'
  const [drawerTab, setDrawerTab] = useState("About");
  const [showRightDrawer, setShowRightDrawer] = useState(true);

  // In-chat search states & menu states
  const [inChatSearchOpen, setInChatSearchOpen] = useState(false);
  const [inChatSearchQuery, setInChatSearchQuery] = useState("");
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);

  const inChatSearchInputRef = useRef(null);
  const headerMenuRef = useRef(null);
  const rightMenuRef = useRef(null);

  // Message input state
  const [messageText, setMessageText] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Handle authentic file download
  const handleDownloadFile = (fileOrName) => {
    try {
      const downloadedName = downloadFile(fileOrName);
      showToast(`Downloaded ${downloadedName}`);
    } catch (err) {
      console.error("Download error:", err);
      showToast("Download failed. Please try again.");
    }
  };

  // Handle attaching file from local device
  const handleAttachFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(file.size / 1024).toFixed(1)} KB`;

      const ext = file.name.split(".").pop().toLowerCase();
      const isImg = ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext);
      const isPdf = ext === "pdf";
      const isZip = ["zip", "rar", "7z", "tar", "gz"].includes(ext);
      const isFigma = ext === "fig" || ext === "figma";
      const isCode = ["js", "jsx", "ts", "tsx", "html", "css", "json", "py", "sql", "md"].includes(ext);

      let type = "file";
      if (isImg) type = "image";
      else if (isPdf) type = "pdf";
      else if (isZip) type = "zip";
      else if (isFigma) type = "figma";
      else if (isCode) type = "code";

      setAttachedFile({
        name: file.name,
        sub: `${ext.toUpperCase()} • ${sizeStr}`,
        size: sizeStr,
        type: type,
        isImage: isImg,
        dataUrl: reader.result,
      });
      showToast(`Attached ${file.name}`);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Professional Attachment & Image Card Renderer
  const renderAttachmentCard = (attachment, isOutgoing = false) => {
    if (!attachment) return null;

    const ext = (attachment.name || "").split(".").pop().toLowerCase();
    const isImg =
      attachment.isImage ||
      attachment.type === "image" ||
      ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext);

    // Image Preview Card (when Base64/dataUrl is available)
    if (isImg && attachment.dataUrl) {
      return (
        <div
          className={`tf-chat-attachment-card image-preview-card ${isOutgoing ? "outgoing-card" : "incoming-card"}`}
          onClick={() => handleDownloadFile(attachment)}
          role="button"
          tabIndex={0}
          title={`Click to download ${attachment.name}`}
        >
          <div className="tf-image-thumb-container">
            <img src={attachment.dataUrl} alt={attachment.name} className="tf-attached-image-thumb" />
            <div className="tf-image-hover-overlay">
              <span className="tf-overlay-btn">
                <Download size={14} /> Download Image
              </span>
            </div>
          </div>
          <div className="tf-image-meta-bar">
            <div className="tf-image-meta-info">
              <strong title={attachment.name}>{attachment.name}</strong>
              <span>{attachment.sub || attachment.size || "Image File"}</span>
            </div>
            <button
              type="button"
              className="tf-file-download-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadFile(attachment);
              }}
              title="Download image"
            >
              <Download size={14} />
            </button>
          </div>
        </div>
      );
    }

    // Document / Archive / Figma Card
    return (
      <div
        className={`tf-chat-attachment-card ${isOutgoing ? "outgoing-card" : "incoming-card"}`}
        onClick={() => handleDownloadFile(attachment)}
        role="button"
        tabIndex={0}
        title={`Click to download ${attachment.name}`}
      >
        <div className={`tf-file-badge-icon ${attachment.type || (isImg ? "image" : "file")}`}
        >
          {attachment.type === "figma" ? (
            <svg width="18" height="18" viewBox="0 0 38 57" fill="none">
              <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
              <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
              <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
              <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
              <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
            </svg>
          ) : attachment.type === "pdf" ? (
            <FileText size={18} color="#EF4444" />
          ) : isImg || attachment.type === "image" ? (
            <ImageIcon size={18} color="#0284C7" />
          ) : attachment.type === "zip" ? (
            <Folder size={18} color="#D97706" />
          ) : (
            <FileText size={18} color="#6366F1" />
          )}
        </div>

        <div className="tf-file-card-details">
          <strong title={attachment.name}>{attachment.name}</strong>
          <span>{attachment.sub || attachment.size || "File"}</span>
        </div>

        <button
          type="button"
          className="tf-file-download-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleDownloadFile(attachment);
          }}
          title="Download file"
        >
          <Download size={14} />
        </button>
      </div>
    );
  };

  // Modals
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    name: "",
    email: "",
    role: "Frontend Developer",
    message: "",
  });

  const handleCloseNewChatModal = () => {
    setNewChatModalOpen(false);
    setNewMemberForm({
      name: "",
      email: "",
      role: "Frontend Developer",
      message: "",
    });
  };

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  const messagesEndRef = useRef(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  // Scroll to bottom on message change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChatId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
        setHeaderMenuOpen(false);
      }
      if (rightMenuRef.current && !rightMenuRef.current.contains(e.target)) {
        setRightMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+F / Cmd+F to open in-chat search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setInChatSearchOpen(true);
        setTimeout(() => inChatSearchInputRef.current?.focus(), 60);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Currently active conversation
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeChatId) || conversations[1] || conversations[0];
  }, [conversations, activeChatId]);

  // Search matches computed inside active conversation
  const searchMatches = useMemo(() => {
    if (!inChatSearchQuery.trim()) return [];
    const q = inChatSearchQuery.toLowerCase().trim();
    const messages = activeConversation?.messages || [];
    return messages
      .filter((m) => {
        if (m.dateDivider) return false;
        const matchText = (m.text || "").toLowerCase().includes(q);
        const matchSender = (m.sender || "").toLowerCase().includes(q);
        const matchFile = (m.attachment?.name || "").toLowerCase().includes(q);
        return matchText || matchSender || matchFile;
      })
      .map((m) => m.id);
  }, [activeConversation?.messages, inChatSearchQuery]);

  // Scroll active match into view
  useEffect(() => {
    if (
      inChatSearchOpen &&
      searchMatches.length > 0 &&
      activeMatchIndex >= 0 &&
      activeMatchIndex < searchMatches.length
    ) {
      const targetId = `chat-msg-${searchMatches[activeMatchIndex]}`;
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [inChatSearchOpen, searchMatches, activeMatchIndex]);

  const handleNextMatch = () => {
    if (searchMatches.length === 0) return;
    setActiveMatchIndex((prev) => (prev + 1) % searchMatches.length);
  };

  const handlePrevMatch = () => {
    if (searchMatches.length === 0) return;
    setActiveMatchIndex((prev) => (prev - 1 + searchMatches.length) % searchMatches.length);
  };

  const handleInChatSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        handlePrevMatch();
      } else {
        handleNextMatch();
      }
    } else if (e.key === "Escape") {
      handleCloseInChatSearch();
    }
  };

  const handleToggleInChatSearch = () => {
    if (inChatSearchOpen) {
      handleCloseInChatSearch();
    } else {
      setInChatSearchOpen(true);
      setHeaderMenuOpen(false);
      setTimeout(() => inChatSearchInputRef.current?.focus(), 60);
    }
  };

  const handleCloseInChatSearch = () => {
    setInChatSearchOpen(false);
    setInChatSearchQuery("");
    setActiveMatchIndex(0);
  };

  // Menu action: Pin/Unpin
  const handleTogglePin = () => {
    const willPin = !activeConversation.isPinned;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id ? { ...c, isPinned: willPin } : c
      )
    );
    setHeaderMenuOpen(false);
    setRightMenuOpen(false);
    showToast(willPin ? `Pinned "${activeConversation.title}" to top` : `Unpinned "${activeConversation.title}"`);
  };

  // Menu action: Mute/Unmute
  const handleToggleMute = () => {
    const willMute = !activeConversation.isMuted;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id ? { ...c, isMuted: willMute } : c
      )
    );
    setHeaderMenuOpen(false);
    setRightMenuOpen(false);
    showToast(willMute ? `Muted notifications for "${activeConversation.title}"` : `Unmuted notifications for "${activeConversation.title}"`);
  };

  // Menu action: Mark Unread
  const handleMarkUnread = () => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id ? { ...c, unread: (c.unread || 0) + 1 } : c
      )
    );
    setHeaderMenuOpen(false);
    showToast(`Marked "${activeConversation.title}" as unread`);
  };

  // Menu action: Copy Link
  const handleCopyChatLink = () => {
    const link = `${window.location.origin}/employee/chat?id=${encodeURIComponent(activeConversation.id)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    setHeaderMenuOpen(false);
    setRightMenuOpen(false);
    showToast(`Copied chat link for "${activeConversation.title}"!`);
  };

  // Menu action: Export Chat History
  const handleExportChat = () => {
    const messages = activeConversation.messages || [];
    let content = "========================================================\r\n";
    content += "TeamFlow AI — Chat History Export\r\n";
    content += `Conversation: ${activeConversation.title} (${activeConversation.subtitle || ""})\r\n`;
    content += `Export Date: ${new Date().toLocaleString()}\r\n`;
    content += `Total Messages: ${messages.filter((m) => !m.dateDivider).length}\r\n`;
    content += "========================================================\r\n\r\n";

    messages.forEach((m) => {
      if (m.dateDivider) {
        content += `\r\n--- ${m.dateDivider} ---\r\n\r\n`;
      } else {
        const sender = m.sender || (m.isOutgoing ? (profile.fullName || "You") : "User");
        const time = m.time || "";
        const text = m.text || "";
        const attachment = m.attachment ? ` [Attachment: ${m.attachment.name} (${m.attachment.size || ""})]` : "";
        content += `[${time}] ${sender}: ${text}${attachment}\r\n`;
      }
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeConversation.title.replace(/[^a-zA-Z0-9_-]/g, "_")}_Chat_Export.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setHeaderMenuOpen(false);
    setRightMenuOpen(false);
    showToast(`Exported chat history for "${activeConversation.title}"`);
  };

  // Menu action: Clear History
  const handleClearChatHistory = () => {
    if (window.confirm(`Are you sure you want to clear message history for "${activeConversation.title}"?`)) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? {
                ...c,
                lastMessage: "Chat history cleared",
                time: "Just now",
                messages: [
                  {
                    id: `divider-${Date.now()}`,
                    dateDivider: "Today",
                  },
                  {
                    id: `msg-system-${Date.now()}`,
                    sender: "System",
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    text: "Chat history cleared by user.",
                    isOutgoing: false,
                  },
                ],
              }
            : c
        )
      );
      setHeaderMenuOpen(false);
      setRightMenuOpen(false);
      showToast(`Cleared messages for "${activeConversation.title}"`);
    }
  };

  // Helper to highlight matching text in messages
  const renderHighlightedText = (text, query) => {
    if (!query || !query.trim() || typeof text !== "string") return text;
    const q = query.trim();
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);
    if (parts.length === 1) return text;
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="tf-chat-highlight-mark">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Filter conversations
  const filteredConversations = useMemo(() => {
    let result = [...conversations];

    // Top toggle
    if (topToggle === "Channels") {
      result = result.filter((c) => c.type === "channel");
    }

    // Filter pill tab
    if (filterTab === "Unread") {
      result = result.filter((c) => (c.unread || 0) > 0);
    } else if (filterTab === "Groups") {
      result = result.filter((c) => c.type === "group" || c.type === "channel");
    } else if (filterTab === "Direct") {
      result = result.filter((c) => c.type === "direct");
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
      );
    }

    // Sort pinned conversations to the top
    result.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    return result;
  }, [conversations, topToggle, filterTab, searchQuery]);

  // Handle select conversation
  const handleSelectConversation = (id) => {
    setActiveChatId(id);
    // Clear unread
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  // Handle Send Message
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!messageText.trim() && !attachedFile) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "You",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: messageText.trim() || (attachedFile ? `Shared file: ${attachedFile.name}` : ""),
      ...(attachedFile ? { attachment: attachedFile } : {}),
      reactions: {},
      isOutgoing: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          const updatedMessages = [...(c.messages || []), newMsg];
          return {
            ...c,
            lastMessage: `You: ${newMsg.text}`,
            time: "Just now",
            messages: updatedMessages,
          };
        }
        return c;
      })
    );

    setMessageText("");
    setAttachedFile(null);
    setEmojiPickerOpen(false);
    setTimeout(scrollToBottom, 50);
  };

  // Handle Toggle Reaction
  const handleToggleReaction = (msgId, emoji) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          const updated = (c.messages || []).map((m) => {
            if (m.id === msgId) {
              const currentReactions = { ...(m.reactions || {}) };
              const currentCount = currentReactions[emoji] || 0;
              currentReactions[emoji] = currentCount + 1;
              return { ...m, reactions: currentReactions };
            }
            return m;
          });
          return { ...c, messages: updated };
        }
        return c;
      })
    );
  };

  // Handle Request For Chat (Add New Member to Chat)
  const handleRequestForChat = (e) => {
    e.preventDefault();
    const name = newMemberForm.name.trim();
    const email = newMemberForm.email.trim();

    if (!name) {
      showToast("Please enter the member's full name");
      return;
    }
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid company email address");
      return;
    }

    const initials = name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || name.charAt(0).toUpperCase();

    const colorList = ["purple", "blue", "green", "orange", "pink"];
    const chosenColor = colorList[Math.floor(Math.random() * colorList.length)];

    const newConv = {
      id: `direct-${Date.now()}`,
      title: name,
      subtitle: `Online • ${newMemberForm.role}`,
      email: email,
      role: newMemberForm.role,
      type: "direct",
      avatarType: "initials",
      avatarInitials: initials,
      avatarBg: chosenColor,
      lastMessage: newMemberForm.message.trim() || "Chat request sent • Conversation started.",
      time: "Just now",
      unread: 0,
      membersCount: 2,
      project: "TeamFlow AI",
      description: `Direct conversation with ${name} (${email})`,
      messages: [
        {
          id: `init-${Date.now()}-sys`,
          sender: "System",
          time: "Just now",
          text: `Chat request sent to ${name} (${email}). You can now message directly.`,
          isOutgoing: false,
        },
        ...(newMemberForm.message.trim()
          ? [
              {
                id: `init-${Date.now()}-user`,
                sender: "You",
                time: "Just now",
                text: newMemberForm.message.trim(),
                isOutgoing: true,
              },
            ]
          : []),
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveChatId(newConv.id);
    handleCloseNewChatModal();
    showToast(`Chat request sent to ${name}! Added to chat.`);
  };

  // Render Avatar
  const renderAvatar = (conv) => {
    if (conv.avatarType === "hash") {
      return (
        <div className={`tf-conv-avatar-box ${conv.avatarBg || "purple"}`}>
          <Hash size={17} />
        </div>
      );
    }
    if (conv.avatarType === "team") {
      return (
        <div className={`tf-conv-avatar-box ${conv.avatarBg || "purple"}`}>
          <Users size={17} />
        </div>
      );
    }
    if (conv.avatarType === "phone") {
      return (
        <div className={`tf-conv-avatar-box ${conv.avatarBg || "blue"}`}>
          <Phone size={16} />
        </div>
      );
    }
    if (conv.avatarType === "rocket") {
      return (
        <div className={`tf-conv-avatar-box ${conv.avatarBg || "orange"}`}>
          <Rocket size={16} />
        </div>
      );
    }
    if (conv.avatarType === "chart") {
      return (
        <div className={`tf-conv-avatar-box ${conv.avatarBg || "purple"}`}>
          <BarChart2 size={16} />
        </div>
      );
    }
    if (conv.avatarType === "megaphone") {
      return (
        <div className={`tf-conv-avatar-box ${conv.avatarBg || "red"}`}>
          <Megaphone size={16} />
        </div>
      );
    }
    return (
      <div className={`tf-conv-avatar-box ${conv.avatarBg || "gray"}`}>
        <span>{conv.avatarInitials || conv.title.charAt(0)}</span>
      </div>
    );
  };

  return (
    <EmployeeShell activeRoute="/employee/chat">
      <div className="tf-chat-page">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="tf-chat-toast">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ====================================================================
            PAGE HEADER (Title + Subtitle)
            ==================================================================== */}
        <header className="tf-chat-header">
          <div className="tf-chat-title-group">
            <h1>Team Chat</h1>
            <p>Chat with your team members and project groups. Share updates, discuss tasks, and collaborate.</p>
          </div>
        </header>

        {/* ====================================================================
            3-COLUMN CHAT CONTAINER
            ==================================================================== */}
        <div className="tf-chat-container">
          {/* ------------------------------------------------------------------
              COLUMN 1: Conversations Sidebar
              ------------------------------------------------------------------ */}
          <aside className="tf-chat-sidebar">
            {/* Top Chats / Channels Toggle */}
            <div className="tf-sidebar-top-switch">
              <button
                type="button"
                className={`tf-switch-btn ${topToggle === "Chats" ? "active" : ""}`}
                onClick={() => setTopToggle("Chats")}
              >
                Chats
              </button>
              <button
                type="button"
                className={`tf-switch-btn ${topToggle === "Channels" ? "active" : ""}`}
                onClick={() => setTopToggle("Channels")}
              >
                Channels
              </button>
            </div>

            {/* + New Chat CTA */}
            <button
              type="button"
              className="tf-new-chat-btn"
              onClick={() => setNewChatModalOpen(true)}
            >
              <Plus size={16} strokeWidth={2.4} />
              <span>New Chat</span>
            </button>

            {/* Search chats */}
            <div className="tf-chat-search-wrap">
              <Search size={14} className="tf-chat-search-icon" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="tf-search-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="tf-chat-filter-pills">
              <button
                type="button"
                className={`tf-filter-pill ${filterTab === "All" ? "active" : ""}`}
                onClick={() => setFilterTab("All")}
              >
                All
              </button>
              <button
                type="button"
                className={`tf-filter-pill ${filterTab === "Unread" ? "active" : ""}`}
                onClick={() => setFilterTab("Unread")}
              >
                <span>Unread</span>
                <span className="tf-pill-badge-red">2</span>
              </button>
              <button
                type="button"
                className={`tf-filter-pill ${filterTab === "Groups" ? "active" : ""}`}
                onClick={() => setFilterTab("Groups")}
              >
                Groups
              </button>
              <button
                type="button"
                className={`tf-filter-pill ${filterTab === "Direct" ? "active" : ""}`}
                onClick={() => setFilterTab("Direct")}
              >
                Direct
              </button>
            </div>

            {/* Conversations list */}
            <div className="tf-conversations-list">
              {filteredConversations.map((c) => {
                const isSelected = activeConversation.id === c.id;

                return (
                  <div
                    key={c.id}
                    className={`tf-conv-item ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectConversation(c.id)}
                  >
                    {renderAvatar(c)}

                    <div className="tf-conv-info">
                      <div className="tf-conv-top">
                        <div className="tf-conv-title-wrap">
                          <strong className="tf-conv-title">{c.title}</strong>
                          {c.isPinned && <Pin size={11} className="tf-conv-pin-icon" title="Pinned" />}
                          {c.isMuted && <BellOff size={11} className="tf-conv-mute-icon" title="Muted" />}
                        </div>
                        <span className="tf-conv-time">{c.time}</span>
                      </div>
                      <div className="tf-conv-bottom">
                        <span className="tf-conv-last-msg">{c.lastMessage}</span>
                        {c.unread > 0 && !isSelected && (
                          <span className="tf-conv-unread-bubble">{c.unread}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* ------------------------------------------------------------------
              COLUMN 2: Center Main Active Chat Area
              ------------------------------------------------------------------ */}
          <main className="tf-chat-main-window">
            {/* Active Chat Header */}
            <header className="tf-chat-header-bar">
              <div className="tf-active-header-left">
                {renderAvatar(activeConversation)}
                <div className="tf-active-header-text">
                  <div className="tf-active-title-row">
                    <h2>{activeConversation.title}</h2>
                    {activeConversation.isPinned && (
                      <Pin size={14} className="tf-header-pin-badge" title="Pinned conversation" />
                    )}
                    {activeConversation.isMuted && (
                      <BellOff size={14} className="tf-header-mute-badge" title="Notifications muted" />
                    )}
                  </div>
                  <span>{activeConversation.subtitle}</span>
                </div>
              </div>

              <div className="tf-active-header-actions">
                <button
                  type="button"
                  className={`tf-header-icon-btn ${inChatSearchOpen ? "active" : ""}`}
                  onClick={handleToggleInChatSearch}
                  title="Search conversation (Ctrl+F)"
                >
                  <Search size={16} />
                </button>

                <div className="tf-header-menu-wrap" ref={headerMenuRef}>
                  <button
                    type="button"
                    className={`tf-header-icon-btn ${headerMenuOpen ? "active" : ""}`}
                    onClick={() => setHeaderMenuOpen((prev) => !prev)}
                    title="More options"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {headerMenuOpen && (
                    <div className="tf-header-menu-dropdown">
                      <button
                        type="button"
                        className="tf-header-menu-item"
                        onClick={handleTogglePin}
                      >
                        <Pin size={15} />
                        <span>{activeConversation.isPinned ? "Unpin Conversation" : "Pin to Top"}</span>
                      </button>

                      <button
                        type="button"
                        className="tf-header-menu-item"
                        onClick={handleToggleMute}
                      >
                        {activeConversation.isMuted ? <Bell size={15} /> : <BellOff size={15} />}
                        <span>{activeConversation.isMuted ? "Unmute Notifications" : "Mute Notifications"}</span>
                      </button>

                      <button
                        type="button"
                        className="tf-header-menu-item"
                        onClick={handleMarkUnread}
                      >
                        <EyeOff size={15} />
                        <span>Mark as Unread</span>
                      </button>

                      <button
                        type="button"
                        className="tf-header-menu-item"
                        onClick={() => {
                          setHeaderMenuOpen(false);
                          setInChatSearchOpen(true);
                          setTimeout(() => inChatSearchInputRef.current?.focus(), 60);
                        }}
                      >
                        <Search size={15} />
                        <span>Search in Conversation</span>
                      </button>

                      <button
                        type="button"
                        className="tf-header-menu-item"
                        onClick={handleCopyChatLink}
                      >
                        <Copy size={15} />
                        <span>Copy Channel Link</span>
                      </button>

                      <button
                        type="button"
                        className="tf-header-menu-item"
                        onClick={handleExportChat}
                      >
                        <Download size={15} />
                        <span>Export Chat History</span>
                      </button>

                      <div className="tf-header-menu-divider" />

                      <button
                        type="button"
                        className="tf-header-menu-item danger"
                        onClick={handleClearChatHistory}
                      >
                        <Trash2 size={15} />
                        <span>Clear Chat History</span>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className={`tf-header-icon-btn ${showRightDrawer ? "active" : ""}`}
                  onClick={() => setShowRightDrawer(!showRightDrawer)}
                  title="Toggle details"
                >
                  <Info size={16} />
                </button>
              </div>
            </header>

            {/* In-Chat Search Bar */}
            {inChatSearchOpen && (
              <div className="tf-in-chat-search-toolbar">
                <div className="tf-in-chat-search-input-box">
                  <Search size={15} className="tf-in-chat-search-icon" />
                  <input
                    ref={inChatSearchInputRef}
                    type="text"
                    placeholder={`Search messages in ${activeConversation.title}...`}
                    value={inChatSearchQuery}
                    onChange={(e) => {
                      setInChatSearchQuery(e.target.value);
                      setActiveMatchIndex(0);
                    }}
                    onKeyDown={handleInChatSearchKeyDown}
                  />
                  {inChatSearchQuery && (
                    <button
                      type="button"
                      className="tf-in-chat-clear-btn"
                      onClick={() => {
                        setInChatSearchQuery("");
                        setActiveMatchIndex(0);
                        inChatSearchInputRef.current?.focus();
                      }}
                      title="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="tf-in-chat-search-nav">
                  {inChatSearchQuery.trim() ? (
                    searchMatches.length > 0 ? (
                      <span className="tf-in-chat-results-count">
                        <strong>{activeMatchIndex + 1}</strong> of {searchMatches.length}
                      </span>
                    ) : (
                      <span className="tf-in-chat-no-results">No matches</span>
                    )
                  ) : (
                    <span className="tf-in-chat-hint">Press Enter for next</span>
                  )}

                  <button
                    type="button"
                    className="tf-in-chat-nav-arrow"
                    onClick={handlePrevMatch}
                    disabled={searchMatches.length === 0}
                    title="Previous match (Shift + Enter)"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    className="tf-in-chat-nav-arrow"
                    onClick={handleNextMatch}
                    disabled={searchMatches.length === 0}
                    title="Next match (Enter)"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    type="button"
                    className="tf-in-chat-close-btn"
                    onClick={handleCloseInChatSearch}
                    title="Close search (Esc)"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="tf-messages-stream">
              {(activeConversation.messages || []).map((msg) => {
                // If it's a date divider
                if (msg.dateDivider) {
                  return (
                    <div key={msg.id} className="tf-date-divider-wrap">
                      <span className="tf-date-divider-pill">{msg.dateDivider}</span>
                    </div>
                  );
                }

                const isMatch = searchMatches.includes(msg.id);
                const isActiveMatch = searchMatches.length > 0 && searchMatches[activeMatchIndex] === msg.id;

                // If outgoing message
                if (msg.isOutgoing) {
                  return (
                    <div
                      key={msg.id}
                      id={`chat-msg-${msg.id}`}
                      className={`tf-msg-row outgoing ${isMatch ? "is-search-match" : ""} ${isActiveMatch ? "is-search-active-match" : ""}`}
                    >
                      <div className={`tf-msg-bubble outgoing ${msg.attachment ? "has-attachment" : ""}`}>
                        {msg.text && <p className="tf-msg-text">{renderHighlightedText(msg.text, inChatSearchQuery)}</p>}
                        {msg.attachment && renderAttachmentCard(msg.attachment, true)}
                        <div className="tf-msg-time-row">
                          <span>{msg.time}</span>
                          <CheckCheck size={14} className="tf-check-double" />
                        </div>
                      </div>
                    </div>
                  );
                }

                // Incoming message
                return (
                  <div
                    key={msg.id}
                    id={`chat-msg-${msg.id}`}
                    className={`tf-msg-row incoming ${isMatch ? "is-search-match" : ""} ${isActiveMatch ? "is-search-active-match" : ""}`}
                  >
                    {/* Avatar */}
                    {msg.senderAvatar ? (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.sender}
                        className="tf-msg-avatar-img"
                      />
                    ) : (
                      <div className={`tf-msg-avatar-letter ${msg.senderAvatarBg || "blue"}`}>
                        {msg.senderInitials || msg.sender.charAt(0)}
                      </div>
                    )}

                    <div className="tf-msg-content-block">
                      <div className="tf-msg-sender-header">
                        <strong>{msg.sender}</strong>
                        <span>{msg.time}</span>
                      </div>

                      <div className={`tf-msg-bubble incoming ${msg.attachment ? "has-attachment" : ""}`}>
                        {msg.text && <p className="tf-msg-text">{renderHighlightedText(msg.text, inChatSearchQuery)}</p>}
                        {msg.attachment && renderAttachmentCard(msg.attachment, false)}
                      </div>

                      {/* Reactions Row */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="tf-msg-reactions-row">
                          {Object.entries(msg.reactions).map(([emoji, count]) => (
                            <button
                              key={emoji}
                              type="button"
                              className="tf-reaction-badge"
                              onClick={() => handleToggleReaction(msg.id, emoji)}
                            >
                              <span>{emoji}</span>
                              <span className="count">{count}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Bottom Bar */}
            <div className="tf-chat-composer-wrapper">
              {attachedFile && (
                <div className="tf-composer-attachment-preview">
                  <FileText size={15} />
                  <span className="tf-preview-file-name">
                    <strong>{attachedFile.name}</strong> ({attachedFile.size})
                  </span>
                  <button
                    type="button"
                    className="tf-remove-attachment-btn"
                    onClick={() => setAttachedFile(null)}
                    title="Remove attachment"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <form className="tf-chat-input-bar" onSubmit={handleSendMessage}>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleAttachFile}
                />

                <button
                  type="button"
                  className="tf-input-tool-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach file from device"
                >
                  <Paperclip size={18} />
                </button>

              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />

              {/* Emoji Picker Button */}
              <div className="tf-emoji-picker-wrap">
                <button
                  type="button"
                  className="tf-input-tool-btn"
                  onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                  title="Add emoji"
                >
                  <Smile size={18} />
                </button>

                {emojiPickerOpen && (
                  <div className="tf-emoji-popover">
                    {quickEmojis.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => {
                          setMessageText((prev) => prev + em);
                          setEmojiPickerOpen(false);
                        }}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Send Button */}
              <button
                type="submit"
                className="tf-send-message-btn"
                disabled={!messageText.trim() && !attachedFile}
                title="Send message"
              >
                <Send size={15} />
              </button>
            </form>
            </div>
          </main>

          {/* ------------------------------------------------------------------
              COLUMN 3: Right Details Drawer / Info Panel
              ------------------------------------------------------------------ */}
          {showRightDrawer && (
            <aside className="tf-chat-right-panel">
              {/* Header Info */}
              <div className="tf-right-panel-header">
                <div className="tf-right-avatar-wrap">
                  <div className="tf-conv-avatar-box purple large">
                    <Users size={22} />
                  </div>
                </div>
                <h3>{activeConversation.title}</h3>
                <span className="tf-right-panel-sub">
                  {activeConversation.category || "UI/UX Design Project"}
                </span>

                <div className="tf-right-menu-wrap" ref={rightMenuRef}>
                  <button
                    type="button"
                    className={`tf-right-menu-btn ${rightMenuOpen ? "active" : ""}`}
                    onClick={() => setRightMenuOpen((prev) => !prev)}
                    title="Conversation options"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {rightMenuOpen && (
                    <div className="tf-header-menu-dropdown right-pane-dropdown">
                      <button
                        type="button"
                        className="tf-header-menu-item"
                        onClick={handleTogglePin}
                      >
                        <Pin size={15} />
                        <span>{activeConversation.isPinned ? "Unpin Conversation" : "Pin to Top"}</span>
                      </button>

                      <button
                        type="button"
                        className="tf-header-menu-item"
                        onClick={handleToggleMute}
                      >
                        {activeConversation.isMuted ? <Bell size={15} /> : <BellOff size={15} />}
                        <span>{activeConversation.isMuted ? "Unmute Notifications" : "Mute Notifications"}</span>
                      </button>

                      <button
                        type="button"
                        className="tf-header-menu-item"
                        onClick={handleCopyChatLink}
                      >
                        <Copy size={15} />
                        <span>Copy Channel Link</span>
                      </button>

                      <button
                        type="button"
                        className="tf-header-menu-item"
                        onClick={handleExportChat}
                      >
                        <Download size={15} />
                        <span>Export Chat History</span>
                      </button>

                      <div className="tf-header-menu-divider" />

                      <button
                        type="button"
                        className="tf-header-menu-item danger"
                        onClick={handleClearChatHistory}
                      >
                        <Trash2 size={15} />
                        <span>Clear Chat History</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs: About | Members | Files | Links */}
              <div className="tf-right-panel-tabs">
                <button
                  type="button"
                  className={`tf-panel-tab ${drawerTab === "About" ? "active" : ""}`}
                  onClick={() => setDrawerTab("About")}
                >
                  About
                </button>
                <button
                  type="button"
                  className={`tf-panel-tab ${drawerTab === "Members" ? "active" : ""}`}
                  onClick={() => setDrawerTab("Members")}
                >
                  Members ({activeConversation.membersCount || 5})
                </button>
                <button
                  type="button"
                  className={`tf-panel-tab ${drawerTab === "Files" ? "active" : ""}`}
                  onClick={() => setDrawerTab("Files")}
                >
                  Files
                </button>
                <button
                  type="button"
                  className={`tf-panel-tab ${drawerTab === "Links" ? "active" : ""}`}
                  onClick={() => setDrawerTab("Links")}
                >
                  Links
                </button>
              </div>

              {/* Tab Content: About */}
              {drawerTab === "About" && (
                <div className="tf-right-tab-content">
                  {/* Description */}
                  <div className="tf-right-section">
                    <span className="tf-section-title">Description</span>
                    <p className="tf-section-desc">
                      {activeConversation.description ||
                        "Redesign and develop the new TeamFlow AI website with modern UI/UX and improved performance."}
                    </p>
                  </div>

                  {/* Project metadata */}
                  <div className="tf-right-meta-list">
                    <div className="tf-meta-row clickable" onClick={() => showToast("Opening project...")}>
                      <div className="tf-meta-icon purple">
                        <Zap size={14} />
                      </div>
                      <div className="tf-meta-texts">
                        <span className="tf-meta-label">Project</span>
                        <strong>{activeConversation.project || "TeamFlow Website"}</strong>
                      </div>
                      <ChevronRight size={14} className="tf-meta-arrow" />
                    </div>

                    <div className="tf-meta-row">
                      <img src={avatars.rahul} alt="Creator" className="tf-meta-avatar" />
                      <div className="tf-meta-texts">
                        <span className="tf-meta-label">Created by</span>
                        <strong>{activeConversation.createdBy || "Rahul Sharma"}</strong>
                      </div>
                    </div>

                    <div className="tf-meta-row">
                      <div className="tf-meta-icon gray">
                        <Calendar size={14} />
                      </div>
                      <div className="tf-meta-texts">
                        <span className="tf-meta-label">Created on</span>
                        <strong>{activeConversation.createdDate || "Jan 10, 2024"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Team Members (5) */}
                  <div className="tf-right-section">
                    <div className="tf-section-header-row">
                      <span className="tf-section-title">Team Members (5)</span>
                      <button
                        type="button"
                        className="tf-panel-link"
                        onClick={() => setDrawerTab("Members")}
                      >
                        View all <ChevronRight size={13} />
                      </button>
                    </div>

                    <div className="tf-members-avatar-row">
                      {/* Rahul */}
                      <div className="tf-member-pill-item">
                        <div className="tf-member-round-avatar blue">R</div>
                        <span className="name">Rahul</span>
                        <span className="role">Admin</span>
                      </div>

                      {/* Neha */}
                      <div className="tf-member-pill-item">
                        <div className="tf-member-round-avatar pink">N</div>
                        <span className="name">Neha</span>
                      </div>

                      {/* Amit */}
                      <div className="tf-member-pill-item">
                        <div className="tf-member-round-avatar blue">A</div>
                        <span className="name">Amit</span>
                      </div>

                      {/* Karan */}
                      <div className="tf-member-pill-item">
                        <img src={avatars.karan} alt="Karan" className="tf-member-img-avatar" />
                        <span className="name">Karan</span>
                      </div>

                      {/* You / Current User */}
                      <div className="tf-member-pill-item">
                        {profile.photo ? (
                          <img src={profile.photo} alt={profile.fullName} className="tf-member-img-avatar" />
                        ) : (
                          <div className="tf-member-round-avatar purple">{profile.initials || "JD"}</div>
                        )}
                        <span className="name">{profile.firstName || "You"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shared Files */}
                  <div className="tf-right-section">
                    <div className="tf-section-header-row">
                      <span className="tf-section-title">Shared Files</span>
                      <button
                        type="button"
                        className="tf-panel-link"
                        onClick={() => setDrawerTab("Files")}
                      >
                        View all <ChevronRight size={13} />
                      </button>
                    </div>

                    <div className="tf-shared-files-list">
                      {/* File 1: PDF */}
                      <div
                        className="tf-shared-file-item clickable"
                        onClick={() => handleDownloadFile("Project_Overview.pdf")}
                        role="button"
                        tabIndex={0}
                        title="Click to download Project_Overview.pdf"
                      >
                        <div className="tf-shared-file-icon red">
                          <FileText size={15} />
                        </div>
                        <div className="tf-shared-file-text">
                          <strong>Project_Overview.pdf</strong>
                          <span>2.4 MB</span>
                        </div>
                        <button
                          type="button"
                          className="tf-file-download-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadFile("Project_Overview.pdf");
                          }}
                          title="Download Project_Overview.pdf"
                        >
                          <Download size={13} />
                        </button>
                      </div>

                      {/* File 2: Figma */}
                      <div
                        className="tf-shared-file-item clickable"
                        onClick={() => handleDownloadFile("Login_Page_Design.fig")}
                        role="button"
                        tabIndex={0}
                        title="Click to download Login_Page_Design.fig"
                      >
                        <div className="tf-shared-file-icon figma">
                          <svg width="14" height="14" viewBox="0 0 38 57" fill="none">
                            <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
                            <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
                            <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
                            <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
                            <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
                          </svg>
                        </div>
                        <div className="tf-shared-file-text">
                          <strong>Login_Page_Design.fig</strong>
                          <span>4.2 MB</span>
                        </div>
                        <button
                          type="button"
                          className="tf-file-download-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadFile("Login_Page_Design.fig");
                          }}
                          title="Download Login_Page_Design.fig"
                        >
                          <Download size={13} />
                        </button>
                      </div>

                      {/* File 3: ZIP */}
                      <div
                        className="tf-shared-file-item clickable"
                        onClick={() => handleDownloadFile("Build_v1.2.3.zip")}
                        role="button"
                        tabIndex={0}
                        title="Click to download Build_v1.2.3.zip"
                      >
                        <div className="tf-shared-file-icon orange">
                          <Folder size={15} />
                        </div>
                        <div className="tf-shared-file-text">
                          <strong>Build_v1.2.3.zip</strong>
                          <span>28.5 MB</span>
                        </div>
                        <button
                          type="button"
                          className="tf-file-download-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadFile("Build_v1.2.3.zip");
                          }}
                          title="Download Build_v1.2.3.zip"
                        >
                          <Download size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pinned Messages */}
                  <div className="tf-right-section">
                    <div className="tf-section-header-row">
                      <span className="tf-section-title">Pinned Messages</span>
                      <button
                        type="button"
                        className="tf-panel-link"
                        onClick={() => showToast("Viewing all pinned messages")}
                      >
                        View all <ChevronRight size={13} />
                      </button>
                    </div>

                    <div className="tf-pinned-card">
                      <div className="tf-pinned-top">
                        <div className="tf-pinned-avatar blue">R</div>
                        <div className="tf-pinned-author">
                          <strong>Rahul Sharma</strong>
                          <span>Oct 18</span>
                        </div>
                        <Pin size={13} color="#2563EB" className="tf-pin-icon" />
                      </div>
                      <p className="tf-pinned-text">
                        API base URL: <a href="https://api.teamflow.com/v1" target="_blank" rel="noreferrer">https://api.teamflow.com/v1</a>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: Members */}
              {drawerTab === "Members" && (
                <div className="tf-right-tab-content">
                  <div className="tf-members-list-full">
                    <div className="tf-member-full-row">
                      <div className="tf-member-round-avatar blue">R</div>
                      <div className="tf-member-full-info">
                        <strong>Rahul Sharma</strong>
                        <span>Lead Architect • Admin</span>
                      </div>
                    </div>
                    <div className="tf-member-full-row">
                      <div className="tf-member-round-avatar pink">N</div>
                      <div className="tf-member-full-info">
                        <strong>Neha Patil</strong>
                        <span>Senior UI/UX Designer</span>
                      </div>
                    </div>
                    <div className="tf-member-full-row">
                      <div className="tf-member-round-avatar blue">A</div>
                      <div className="tf-member-full-info">
                        <strong>Amit Verma</strong>
                        <span>Backend Engineer</span>
                      </div>
                    </div>
                    <div className="tf-member-full-row">
                      <img src={avatars.karan} alt="Karan" className="tf-member-img-avatar" />
                      <div className="tf-member-full-info">
                        <strong>Karan More</strong>
                        <span>Mobile Developer</span>
                      </div>
                    </div>
                    <div className="tf-member-full-row">
                      {profile.photo ? (
                        <img src={profile.photo} alt={profile.fullName} className="tf-member-img-avatar" />
                      ) : (
                        <div className="tf-member-round-avatar purple">{profile.initials || "JD"}</div>
                      )}
                      <div className="tf-member-full-info">
                        <strong>{profile.fullName || "John Doe"}</strong>
                        <span>{profile.role || "Employee"} (You)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: Files */}
              {drawerTab === "Files" && (
                <div className="tf-right-tab-content">
                  <div className="tf-shared-files-list">
                    <div
                      className="tf-shared-file-item clickable"
                      onClick={() => handleDownloadFile("Project_Overview.pdf")}
                      role="button"
                      tabIndex={0}
                      title="Click to download Project_Overview.pdf"
                    >
                      <div className="tf-shared-file-icon red"><FileText size={15} /></div>
                      <div className="tf-shared-file-text"><strong>Project_Overview.pdf</strong><span>2.4 MB</span></div>
                      <button
                        type="button"
                        className="tf-file-download-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadFile("Project_Overview.pdf");
                        }}
                        title="Download file"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                    <div
                      className="tf-shared-file-item clickable"
                      onClick={() => handleDownloadFile("Login_Page_Design.fig")}
                      role="button"
                      tabIndex={0}
                      title="Click to download Login_Page_Design.fig"
                    >
                      <div className="tf-shared-file-icon figma">
                        <svg width="14" height="14" viewBox="0 0 38 57" fill="none">
                          <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
                          <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
                          <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
                          <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
                          <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
                        </svg>
                      </div>
                      <div className="tf-shared-file-text"><strong>Login_Page_Design.fig</strong><span>4.2 MB</span></div>
                      <button
                        type="button"
                        className="tf-file-download-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadFile("Login_Page_Design.fig");
                        }}
                        title="Download file"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                    <div
                      className="tf-shared-file-item clickable"
                      onClick={() => handleDownloadFile("Build_v1.2.3.zip")}
                      role="button"
                      tabIndex={0}
                      title="Click to download Build_v1.2.3.zip"
                    >
                      <div className="tf-shared-file-icon orange"><Folder size={15} /></div>
                      <div className="tf-shared-file-text"><strong>Build_v1.2.3.zip</strong><span>28.5 MB</span></div>
                      <button
                        type="button"
                        className="tf-file-download-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadFile("Build_v1.2.3.zip");
                        }}
                        title="Download file"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: Links */}
              {drawerTab === "Links" && (
                <div className="tf-right-tab-content">
                  <div className="tf-pinned-card">
                    <strong>API base URL:</strong>
                    <p><a href="https://api.teamflow.com/v1" target="_blank" rel="noreferrer">https://api.teamflow.com/v1</a></p>
                  </div>
                  <div className="tf-pinned-card">
                    <strong>Figma Design Kit:</strong>
                    <p><a href="https://figma.com/@teamflow-design" target="_blank" rel="noreferrer">https://figma.com/@teamflow-design</a></p>
                  </div>
                </div>
              )}
            </aside>
          )}
        </div>

        {/* ====================================================================
            MODAL: + New Chat / Add Member To Chat
            ==================================================================== */}
        {newChatModalOpen && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseNewChatModal();
            }}
          >
            <div className="tf-modal-card tf-new-chat-modal" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-group">
                  <div className="tf-modal-icon-box purple">
                    <UserPlus size={18} color="#7C3AED" />
                  </div>
                  <div>
                    <h3>Add Member to Chat</h3>
                    <p>Enter team member details to request and start a conversation.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={handleCloseNewChatModal}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleRequestForChat}>
                <div className="tf-modal-form-body">
                  {/* Live Member Preview Card */}
                  <div className="tf-new-member-preview">
                    <div className="tf-preview-avatar">
                      {newMemberForm.name
                        ? newMemberForm.name
                            .split(" ")
                            .map((p) => p[0])
                            .filter(Boolean)
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : "TM"}
                      <span className="tf-preview-dot" />
                    </div>
                    <div className="tf-preview-info">
                      <strong>{newMemberForm.name || "Member Full Name"}</strong>
                      <span className="tf-preview-email">
                        {newMemberForm.email || "colleague@teamflow.com"}
                      </span>
                      <span className="tf-preview-role-tag">{newMemberForm.role}</span>
                    </div>
                  </div>

                  {/* 1. Name */}
                  <div className="tf-form-field">
                    <label>Member Name *</label>
                    <div className="tf-input-with-icon">
                      <span className="tf-input-icon-adornment">
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        required
                        className="tf-chat-input-with-icon"
                        placeholder="e.g. Ananya Roy or Vikram Mehta"
                        value={newMemberForm.name}
                        onChange={(e) =>
                          setNewMemberForm({ ...newMemberForm, name: e.target.value })
                        }
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* 2. Company Email */}
                  <div className="tf-form-field">
                    <label>Company Email *</label>
                    <div className="tf-input-with-icon">
                      <span className="tf-input-icon-adornment">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        required
                        className="tf-chat-input-with-icon"
                        placeholder="e.g. ananya.roy@teamflow.com"
                        value={newMemberForm.email}
                        onChange={(e) =>
                          setNewMemberForm({ ...newMemberForm, email: e.target.value })
                        }
                      />
                    </div>
                    <span className="tf-input-hint">Company domain (e.g. @teamflow.com)</span>
                  </div>

                  {/* 3. Role / Department */}
                  <div className="tf-form-field">
                    <label>Role / Department</label>
                    <div className="tf-input-with-icon">
                      <span className="tf-input-icon-adornment">
                        <Briefcase size={16} />
                      </span>
                      <select
                        className="tf-chat-input-with-icon"
                        value={newMemberForm.role}
                        onChange={(e) =>
                          setNewMemberForm({ ...newMemberForm, role: e.target.value })
                        }
                      >
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Engineer">Backend Engineer</option>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="UI/UX Designer">UI/UX Designer</option>
                        <option value="QA / Test Engineer">QA / Test Engineer</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                        <option value="Product Manager">Product Manager</option>
                        <option value="Marketing Specialist">Marketing Specialist</option>
                      </select>
                    </div>
                  </div>

                  {/* 4. Initial Message (Optional) */}
                  <div className="tf-form-field">
                    <label>Initial Message (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Hi! Let's connect regarding project tasks..."
                      value={newMemberForm.message}
                      onChange={(e) =>
                        setNewMemberForm({ ...newMemberForm, message: e.target.value })
                      }
                      className="tf-chat-modal-textarea"
                    />
                  </div>
                </div>

                <div className="tf-modal-actions">
                  <button
                    type="button"
                    className="tf-btn-secondary"
                    onClick={handleCloseNewChatModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="tf-btn-primary tf-btn-request-chat">
                    <Send size={15} /> Request For Chat
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </EmployeeShell>
  );
}

export default Chat;

