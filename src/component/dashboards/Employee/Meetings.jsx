import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Video,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  MoreVertical,
  Link2,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Smartphone,
  Rocket,
  BarChart2,
  FileText,
  MessageSquare,
  Building2,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  PhoneOff,
  Share2,
  AlertCircle,
  HelpCircle,
  Hand,
  Smile,
  Subtitles,
  Shield,
  Info,
  Pin,
  Sparkles,
  Send,
  Volume2,
  Grid,
} from "lucide-react";

import EmployeeShell from "./EmployeeShell";
import "./Meetings.css";
import { getEmployeeProfile } from "./EmployeeAuth";

/* Storage Key */
const STORAGE_KEY = "tf_meetings_v2";

/* Sample member avatars */
const avatars = {
  rahul: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  neha: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  amit: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
  karan: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  priya: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
};

/* Default 8 Meetings matching the exact reference image */
const defaultMeetings = [
  {
    id: "meet-1",
    title: "Daily Standup",
    description: "Quick update on progress and plan for today.",
    project: "TeamFlow Website",
    projectIcon: "zap",
    date: "2024-10-22",
    dateLabel: "Today, Oct 22, 2024",
    timeLabel: "9:00 - 9:30 AM",
    startTime: "09:00",
    endTime: "09:30",
    icon: "video",
    iconBg: "blue",
    attendees: [avatars.rahul, avatars.neha, avatars.amit],
    extraAttendees: 2,
    status: "join_now",
    statusLabel: "Join Now",
    actionType: "join",
    meetingUrl: "https://meet.google.com/tmf-standup-2024",
    agenda: "1. Review sprint tasks\n2. Discuss homepage UI mockups\n3. Identify deployment blockers",
  },
  {
    id: "meet-2",
    title: "UI Design Discussion",
    description: "Discuss new design mockups and feedback.",
    project: "Mobile App",
    projectIcon: "mobile",
    date: "2024-10-22",
    dateLabel: "Today, Oct 22, 2024",
    timeLabel: "10:00 - 11:00 AM",
    startTime: "10:00",
    endTime: "11:00",
    icon: "users",
    iconBg: "purple",
    attendees: [avatars.neha, avatars.priya, avatars.karan],
    extraAttendees: 3,
    status: "upcoming",
    statusLabel: "Upcoming",
    actionType: "join",
    meetingUrl: "https://meet.google.com/ui-design-discussion",
    agenda: "Figma walkthrough for mobile navigation, drawer interactions, and dark mode tokens.",
  },
  {
    id: "meet-3",
    title: "Bug Review Meeting",
    description: "Review open bugs and assign priorities.",
    project: "AI Integration",
    projectIcon: "rocket",
    date: "2024-10-23",
    dateLabel: "Tomorrow, Oct 23, 2024",
    timeLabel: "11:30 AM - 12:30 PM",
    startTime: "11:30",
    endTime: "12:30",
    icon: "bug",
    iconBg: "red",
    attendees: [avatars.amit, avatars.rahul, avatars.karan],
    extraAttendees: 2,
    status: "upcoming",
    statusLabel: "Upcoming",
    actionType: "join",
    meetingUrl: "https://meet.google.com/ai-bug-review",
    agenda: "Triage bug #BUG-1023 (Login button) and #BUG-1045 (API 500 error on fetching project details).",
  },
  {
    id: "meet-4",
    title: "Project Sync",
    description: "Discuss project progress and next steps.",
    project: "Marketing Portal",
    projectIcon: "chart",
    date: "2024-10-24",
    dateLabel: "Oct 24, 2024",
    timeLabel: "12:00 - 1:00 PM",
    startTime: "12:00",
    endTime: "13:00",
    icon: "file",
    iconBg: "blue",
    attendees: [avatars.amit, avatars.neha, avatars.rahul],
    extraAttendees: 4,
    status: "upcoming",
    statusLabel: "Upcoming",
    actionType: "join",
    meetingUrl: "https://meet.google.com/marketing-sync",
    agenda: "Review landing page hero copy, conversion rate optimization, and asset handoff.",
  },
  {
    id: "meet-5",
    title: "Client Meeting",
    description: "Demo and discuss requirements.",
    project: "TeamFlow Website",
    projectIcon: "zap",
    date: "2024-10-25",
    dateLabel: "Oct 25, 2024",
    timeLabel: "3:00 - 4:00 PM",
    startTime: "15:00",
    endTime: "16:00",
    icon: "users",
    iconBg: "blue",
    attendees: [avatars.rahul, avatars.priya, avatars.amit],
    extraAttendees: 3,
    status: "upcoming",
    statusLabel: "Upcoming",
    actionType: "join",
    meetingUrl: "https://meet.google.com/client-demo-website",
    agenda: "Showcase prototype v1.2 to stakeholders and gather user acceptance test feedback.",
  },
  {
    id: "meet-6",
    title: "Sprint Review",
    description: "Review sprint deliverables.",
    project: "Mobile App",
    projectIcon: "mobile",
    date: "2024-10-20",
    dateLabel: "Oct 20, 2024",
    timeLabel: "2:00 - 3:00 PM",
    startTime: "14:00",
    endTime: "15:00",
    icon: "check",
    iconBg: "green",
    attendees: [avatars.karan, avatars.rahul, avatars.neha],
    extraAttendees: 2,
    status: "completed",
    statusLabel: "Completed",
    actionType: "view",
    meetingUrl: "https://meet.google.com/mobile-sprint-review",
    agenda: "Reviewed mobile sprint milestones, completed 14 user stories, closed 6 bugs.",
  },
  {
    id: "meet-7",
    title: "Planning Meeting",
    description: "Plan next sprint and task allocation.",
    project: "AI Integration",
    projectIcon: "rocket",
    date: "2024-10-18",
    dateLabel: "Oct 18, 2024",
    timeLabel: "4:00 - 5:00 PM",
    startTime: "16:00",
    endTime: "17:00",
    icon: "message",
    iconBg: "blue",
    attendees: [avatars.priya, avatars.rahul, avatars.amit],
    extraAttendees: 3,
    status: "completed",
    statusLabel: "Completed",
    actionType: "view",
    meetingUrl: "https://meet.google.com/ai-sprint-planning",
    agenda: "Story pointing, capacity planning, and allocation for AI Assistant prompt improvements.",
  },
  {
    id: "meet-8",
    title: "HR Announcement",
    description: "Company policy update discussion.",
    project: "General",
    projectIcon: "general",
    date: "2024-10-15",
    dateLabel: "Oct 15, 2024",
    timeLabel: "10:00 - 11:00 AM",
    startTime: "10:00",
    endTime: "11:00",
    icon: "x-circle",
    iconBg: "red",
    attendees: [avatars.rahul, avatars.neha, avatars.priya],
    extraAttendees: 5,
    status: "cancelled",
    statusLabel: "Cancelled",
    actionType: "view",
    meetingUrl: "https://meet.google.com/hr-policy-announcement",
    agenda: "Cancelled due to company-wide holiday reschedule. Meeting minutes posted in HR Announcements.",
  },
];


function Meetings() {
  // Sync User profile from Navbar & localStorage
  const [profile, setProfile] = useState(getEmployeeProfile);

  useEffect(() => {
    const handleStorage = () => {
      setProfile(getEmployeeProfile());
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("tf_profile_updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("tf_profile_updated", handleStorage);
    };
  }, []);

  // Load meetings from localStorage
  const [meetings, setMeetings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 6) return parsed;
      }
    } catch {}
    return defaultMeetings;
  });

  // Filter tab: 'All' | 'Upcoming' | 'Completed' | 'Cancelled'
  const [filterTab, setFilterTab] = useState("All");

  // Dropdown filters
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("Upcoming");

  // Real-time Calendar state
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

  // Dynamic Mini Calendar computation
  const miniCalendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const now = new Date();
    const isCurrentMonthNow = now.getFullYear() === year && now.getMonth() === month;
    const todayDate = now.getDate();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Prev month filler
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        currentMonth: false,
        dots: [],
        isToday: false,
        isSelected: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isToday = isCurrentMonthNow && d === todayDate;
      const isSelected = selectedCalendarDate === dateStr;

      const dayMeetings = meetings.filter(
        (m) => m.date === dateStr || (d === 22 && m.date === "2024-10-22" && year === 2024 && month === 9)
      );

      const dots = [];
      if (dayMeetings.length > 0) {
        dots.push("blue");
        if (dayMeetings.some((m) => m.status === "join_now" || m.status === "cancelled")) {
          dots.push("red");
        }
        if (dayMeetings.some((m) => m.status === "completed")) {
          dots.push("green");
        }
      }

      days.push({
        day: d,
        currentMonth: true,
        dots,
        isToday,
        isSelected,
        fullDate: dateStr,
        count: dayMeetings.length,
      });
    }

    const targetTotal = days.length > 35 ? 42 : 35;
    const remaining = targetTotal - days.length;
    for (let j = 1; j <= remaining; j++) {
      days.push({
        day: j,
        currentMonth: false,
        dots: [],
        isToday: false,
        isSelected: false,
      });
    }

    return days;
  }, [calendarMonth, meetings, selectedCalendarDate]);

  // Dropdown open states
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  // Quick Join Link Input (bottom right card)
  const [quickLinkInput, setQuickLinkInput] = useState("");

  // Modals
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [customJoinUrl, setCustomJoinUrl] = useState("");
  const [selectedMeetingDetails, setSelectedMeetingDetails] = useState(null);
  const [activeCallModal, setActiveCallModal] = useState(null);

  // Video call simulator controls state
  const [callMuted, setCallMuted] = useState(false);
  const [callVideoOff, setCallVideoOff] = useState(false);
  const [callScreenShare, setCallScreenShare] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStage, setCallStage] = useState("lobby");
  const [callCaptions, setCallCaptions] = useState(false);
  const [callHandRaised, setCallHandRaised] = useState(false);
  const [activeMeetDrawer, setActiveMeetDrawer] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [showReactionsMenu, setShowReactionsMenu] = useState(false);
  const [backgroundBlur, setBackgroundBlur] = useState(false);
  const [inCallMessages, setInCallMessages] = useState([
    { id: 1, sender: "Rahul Sharma", time: "10:24 AM", text: "Morning team! Ready to review sprint updates." },
    { id: 2, sender: "Neha Patil", time: "10:25 AM", text: "Hi everyone! I'll share the UI mockups." },
  ]);
  const [inCallText, setInCallText] = useState("");

  // Toast notification
  const [toastMessage, setToastMessage] = useState("");

  // Active action menu row id
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);

  const projectDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const rowMenuRef = useRef(null);

  // Persist meetings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
  }, [meetings]);

  // Video call timer
  useEffect(() => {
    let interval = null;
    if (activeCallModal) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeCallModal]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(e.target)) {
        setProjectDropdownOpen(false);
      }
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(e.target)) {
        setDateDropdownOpen(false);
      }
      if (rowMenuRef.current && !rowMenuRef.current.contains(e.target)) {
        setActiveRowMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // KPIs
  const totalCount = meetings.length;
  const upcomingCount = meetings.filter((m) => m.status === "upcoming" || m.status === "join_now").length;
  const completedCount = meetings.filter((m) => m.status === "completed").length;
  const cancelledCount = meetings.filter((m) => m.status === "cancelled").length;

  // Filtered Meetings
  const filteredMeetings = useMemo(() => {
    let list = [...meetings];

    // Status Tab Filter
    if (filterTab === "Upcoming") {
      list = list.filter((m) => m.status === "upcoming" || m.status === "join_now");
    } else if (filterTab === "Completed") {
      list = list.filter((m) => m.status === "completed");
    } else if (filterTab === "Cancelled") {
      list = list.filter((m) => m.status === "cancelled");
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.project.toLowerCase().includes(q)
      );
    }

    // Project Dropdown
    if (projectFilter !== "All") {
      list = list.filter((m) => m.project === projectFilter);
    }

    // Selected Calendar Date
    if (selectedCalendarDate) {
      list = list.filter((m) => m.date === selectedCalendarDate);
    }

    // Date Dropdown
    if (dateFilter === "Upcoming") {
      // In reference image: Date: Upcoming shows all currently active/upcoming or sorted
      // We keep order or upcoming first
    } else if (dateFilter === "Today") {
      list = list.filter((m) => m.date === "2024-10-22");
    } else if (dateFilter === "Past") {
      list = list.filter((m) => m.status === "completed" || m.status === "cancelled");
    }

    return list;
  }, [meetings, filterTab, searchQuery, projectFilter, dateFilter, selectedCalendarDate]);

  // Format call duration MM:SS
  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Launch Video Call Simulator
  const handleLaunchCall = (meeting) => {
    setActiveCallModal(meeting);

    setCallStage("lobby");
    setCallMuted(false);
    setCallVideoOff(false);
    setCallScreenShare(false);
    setCallCaptions(false);
    setCallHandRaised(false);
    setActiveMeetDrawer(null);
    setBackgroundBlur(false);
    setShowReactionsMenu(false);
  };

  const handleJoinFromLobby = () => {
    setCallStage("connected");
    showToast("Connected to Google Meet call.");
  };

  const handlePresentFromLobby = () => {
    setCallStage("connected");
    setCallScreenShare(true);
    showToast("Connected and presenting your screen.");
  };

  const handleLeaveCall = () => {
    setActiveCallModal(null);
    setCallStage("lobby");
    setCallScreenShare(false);
    showToast("Left Google Meet call.");
  };

  const handleTriggerReaction = (emoji) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji,
      left: 15 + Math.random() * 70,
    };
    setReactions((prev) => [...prev, newReaction]);
    setShowReactionsMenu(false);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2800);
  };

  const handleSendInCallMessage = (e) => {
    e.preventDefault();
    if (!inCallText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: "You",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: inCallText.trim(),
    };
    setInCallMessages((prev) => [...prev, newMsg]);
    setInCallText("");
  };




  // Join with link handler
  const handleJoinByLink = (e) => {
    if (e) e.preventDefault();
    const url = customJoinUrl.trim() || quickLinkInput.trim();
    if (!url) {
      showToast("Please enter a valid meeting link or ID.");
      return;
    }

    setJoinModalOpen(false);
    setQuickLinkInput("");
    setCustomJoinUrl("");

    handleLaunchCall({
      title: "Online Video Meeting",
      project: "Direct Link",
      timeLabel: "Live Now",
      meetingUrl: url,
    });
  };

  // Copy link
  const handleCopyLink = (url) => {
    navigator.clipboard?.writeText(url);
    showToast("Meeting link copied to clipboard!");
  };

  // Render row icon
  const renderMeetingIcon = (iconName, iconBg) => {
    const bgClass = `tf-meet-icon-box ${iconBg || "blue"}`;

    if (iconName === "video") {
      return (
        <div className={bgClass}>
          <Video size={16} />
        </div>
      );
    }
    if (iconName === "users") {
      return (
        <div className={bgClass}>
          <Users size={16} />
        </div>
      );
    }
    if (iconName === "bug") {
      return (
        <div className={bgClass}>
          <AlertCircle size={16} />
        </div>
      );
    }
    if (iconName === "file") {
      return (
        <div className={bgClass}>
          <FileText size={16} />
        </div>
      );
    }
    if (iconName === "check") {
      return (
        <div className={bgClass}>
          <CheckCircle2 size={16} />
        </div>
      );
    }
    if (iconName === "message") {
      return (
        <div className={bgClass}>
          <MessageSquare size={16} />
        </div>
      );
    }
    if (iconName === "x-circle") {
      return (
        <div className={bgClass}>
          <XCircle size={16} />
        </div>
      );
    }

    return (
      <div className={bgClass}>
        <Video size={16} />
      </div>
    );
  };

  // Render project badge icon
  const renderProjectIcon = (type) => {
    if (type === "zap") return <Zap size={14} className="tf-proj-icon zap" />;
    if (type === "mobile") return <Smartphone size={14} className="tf-proj-icon mobile" />;
    if (type === "rocket") return <Rocket size={14} className="tf-proj-icon rocket" />;
    if (type === "chart") return <BarChart2 size={14} className="tf-proj-icon chart" />;
    if (type === "general") return <Building2 size={14} className="tf-proj-icon general" />;
    return <Zap size={14} className="tf-proj-icon" />;
  };

  return (
    <EmployeeShell
      activeRoute="/employee/meetings"
      searchPlaceholder="Search meetings, topics, projects, or team members..."
    >
      <div className="tf-meetings-page">
        {/* Toast */}
        {toastMessage && (
          <div className="tf-meet-toast">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ====================================================================
            PAGE HEADER (Title + Subtitle + Top Right Join CTA)
            ==================================================================== */}
        <header className="tf-meet-page-header">
          <div className="tf-meet-title-group">
            <h1>Meetings</h1>
            <p>View and join your scheduled meetings. Get meeting details, join links, and related files.</p>
          </div>

          <button
            type="button"
            className="tf-top-join-link-btn"
            onClick={() => setJoinModalOpen(true)}
          >
            <Video size={16} />
            <span>Join Meeting (with Link)</span>
            <Link2 size={14} className="tf-top-btn-link-icon" />
          </button>
        </header>

        {/* ====================================================================
            TOP 4 SUMMARY KPI CARDS
            ==================================================================== */}
        <section className="tf-meet-kpi-grid">
          {/* Card 1: Total Meetings */}
          <div className="tf-meet-kpi-card" onClick={() => setFilterTab("All")}>
            <div className="tf-kpi-icon-box blue">
              <Calendar size={20} />
            </div>
            <div className="tf-kpi-info">
              <span className="tf-kpi-label">Total Meetings</span>
              <strong className="tf-kpi-value">{totalCount}</strong>
              <span className="tf-kpi-sub">This month</span>
            </div>
          </div>

          {/* Card 2: Upcoming */}
          <div className="tf-meet-kpi-card" onClick={() => setFilterTab("Upcoming")}>
            <div className="tf-kpi-icon-box green">
              <Clock size={20} />
            </div>
            <div className="tf-kpi-info">
              <span className="tf-kpi-label">Upcoming</span>
              <strong className="tf-kpi-value">{upcomingCount}</strong>
              <span className="tf-kpi-sub">Next 7 days</span>
            </div>
          </div>

          {/* Card 3: Completed */}
          <div className="tf-meet-kpi-card" onClick={() => setFilterTab("Completed")}>
            <div className="tf-kpi-icon-box purple">
              <CheckCircle2 size={20} />
            </div>
            <div className="tf-kpi-info">
              <span className="tf-kpi-label">Completed</span>
              <strong className="tf-kpi-value">{completedCount}</strong>
              <span className="tf-kpi-sub">This month</span>
            </div>
          </div>

          {/* Card 4: Cancelled */}
          <div className="tf-meet-kpi-card" onClick={() => setFilterTab("Cancelled")}>
            <div className="tf-kpi-icon-box red">
              <XCircle size={20} />
            </div>
            <div className="tf-kpi-info">
              <span className="tf-kpi-label">Cancelled</span>
              <strong className="tf-kpi-value">{cancelledCount}</strong>
              <span className="tf-kpi-sub">This month</span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            MAIN TWO-COLUMN WORKSPACE
            Left: Table & Filter Controls (70%)
            Right: Calendar, Upcoming Meetings, Meeting Links (30%)
            ==================================================================== */}
        <div className="tf-meet-layout-row">
          {/* ------------------------------------------------------------------
              LEFT COLUMN: Table & Filters
              ------------------------------------------------------------------ */}
          <div className="tf-meet-left-area">
            {/* Filter Bar */}
            <div className="tf-meet-filter-bar">
              {/* Filter Pills */}
              <div className="tf-meet-filter-pills">
                <button
                  type="button"
                  className={`tf-pill ${filterTab === "All" ? "active" : ""}`}
                  onClick={() => setFilterTab("All")}
                >
                  All ({totalCount})
                </button>
                <button
                  type="button"
                  className={`tf-pill ${filterTab === "Upcoming" ? "active" : ""}`}
                  onClick={() => setFilterTab("Upcoming")}
                >
                  Upcoming ({upcomingCount})
                </button>
                <button
                  type="button"
                  className={`tf-pill ${filterTab === "Completed" ? "active" : ""}`}
                  onClick={() => setFilterTab("Completed")}
                >
                  Completed ({completedCount})
                </button>
                <button
                  type="button"
                  className={`tf-pill ${filterTab === "Cancelled" ? "active" : ""}`}
                  onClick={() => setFilterTab("Cancelled")}
                >
                  Cancelled ({cancelledCount})
                </button>
              </div>

              {/* Controls: Search + Project Filter + Date Filter */}
              <div className="tf-meet-filter-controls">
                {/* Search */}
                <div className="tf-meet-search-box">
                  <Search size={14} className="tf-search-icon" />
                  <input
                    type="text"
                    placeholder="Search meetings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="tf-clear-search-btn"
                      onClick={() => setSearchQuery("")}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Project Dropdown */}
                <div className="tf-dropdown-wrap" ref={projectDropdownRef}>
                  <button
                    type="button"
                    className="tf-filter-select-btn"
                    onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                  >
                    <span>Project: {projectFilter}</span>
                    <ChevronDown size={14} />
                  </button>

                  {projectDropdownOpen && (
                    <div className="tf-dropdown-menu">
                      {["All", "TeamFlow Website", "Mobile App", "AI Integration", "Marketing Portal", "General"].map(
                        (proj) => (
                          <button
                            key={proj}
                            type="button"
                            className={`tf-dropdown-item ${projectFilter === proj ? "active" : ""}`}
                            onClick={() => {
                              setProjectFilter(proj);
                              setProjectDropdownOpen(false);
                            }}
                          >
                            {proj}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Date Dropdown */}
                <div className="tf-dropdown-wrap" ref={dateDropdownRef}>
                  <button
                    type="button"
                    className="tf-filter-select-btn"
                    onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                  >
                    <span>Date: {dateFilter}</span>
                    <ChevronDown size={14} />
                  </button>

                  {dateDropdownOpen && (
                    <div className="tf-dropdown-menu right">
                      {["Upcoming", "Today", "This Week", "Past", "All Dates"].map((dt) => (
                        <button
                          key={dt}
                          type="button"
                          className={`tf-dropdown-item ${dateFilter === dt ? "active" : ""}`}
                          onClick={() => {
                            setDateFilter(dt);
                            setDateDropdownOpen(false);
                          }}
                        >
                          {dt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Meetings Table Card */}
            <div className="tf-meet-table-card">
              <div className="tf-table-responsive">
                <table className="tf-meet-table">
                  <thead>
                    <tr>
                      <th className="tf-th-num">Sr</th>
                      <th className="col-title">Title & Description</th>
                      <th className="col-proj">Project</th>
                      <th className="col-date">Date & Time</th>
                      <th className="col-attendees">Attendees</th>
                      <th className="col-status">Status</th>
                      <th className="col-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMeetings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="tf-table-empty">
                          <Video size={32} color="#94A3B8" />
                          <p>No meetings found matching your filters.</p>
                          <button
                            type="button"
                            className="tf-btn-secondary"
                            onClick={() => {
                              setFilterTab("All");
                              setSearchQuery("");
                              setProjectFilter("All");
                              setDateFilter("Upcoming");
                            }}
                          >
                            Reset Filters
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredMeetings.map((m, idx) => {
                        return (
                          <tr key={m.id} className="tf-meet-row">
                            {/* Title & Description */}
                            <td className="tf-td-num">
                              <span className="tf-row-num-badge">{idx + 1}</span>
                            </td>
                            <td className="col-title">
                              <div className="tf-meet-title-cell">
                                {renderMeetingIcon(m.icon, m.iconBg)}
                                <div className="tf-title-texts">
                                  <strong
                                    className="tf-row-title-text"
                                    onClick={() => setSelectedMeetingDetails(m)}
                                  >
                                    {m.title}
                                  </strong>
                                  <span className="tf-row-sub-text">{m.description}</span>
                                </div>
                              </div>
                            </td>

                            {/* Project */}
                            <td className="col-proj">
                              <div className="tf-meet-proj-badge">
                                {renderProjectIcon(m.projectIcon)}
                                <span>{m.project}</span>
                              </div>
                            </td>

                            {/* Date & Time */}
                            <td className="col-date">
                              <div className="tf-meet-datetime-cell">
                                <div className="tf-datetime-item">
                                  <Calendar size={13} className="tf-time-icon" />
                                  <span>{m.dateLabel}</span>
                                </div>
                                <div className="tf-datetime-item">
                                  <Clock size={13} className="tf-time-icon" />
                                  <span>{m.timeLabel}</span>
                                </div>
                              </div>
                            </td>

                            {/* Attendees */}
                            <td className="col-attendees">
                              <div className="tf-attendees-stack">
                                {m.attendees.map((att, idx) => (
                                  <img
                                    key={idx}
                                    src={att}
                                    alt={`Attendee ${idx + 1}`}
                                    className="tf-att-avatar"
                                  />
                                ))}
                                {m.extraAttendees > 0 && (
                                  <span className="tf-att-more">+{m.extraAttendees}</span>
                                )}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="col-status">
                              {m.status === "join_now" && (
                                <span className="tf-status-badge join-now">
                                  <span className="tf-dot-pulse" />
                                  Join Now
                                </span>
                              )}
                              {m.status === "upcoming" && (
                                <span className="tf-status-badge upcoming">
                                  Upcoming
                                </span>
                              )}
                              {m.status === "completed" && (
                                <span className="tf-status-badge completed">
                                  <span className="tf-dot-static green" />
                                  Completed
                                </span>
                              )}
                              {m.status === "cancelled" && (
                                <span className="tf-status-badge cancelled">
                                  Cancelled
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="col-actions">
                              <div className="tf-actions-row">
                                {m.actionType === "join" ? (
                                  <button
                                    type="button"
                                    className="tf-row-join-btn"
                                    onClick={() => handleLaunchCall(m)}
                                  >
                                    <Video size={14} />
                                    <span>Join</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="tf-row-view-btn"
                                    onClick={() => setSelectedMeetingDetails(m)}
                                  >
                                    View Details
                                  </button>
                                )}

                                {/* Row More Menu Button */}
                                <div className="tf-row-menu-wrap">
                                  <button
                                    type="button"
                                    className="tf-row-more-btn"
                                    onClick={() =>
                                      setActiveRowMenuId(activeRowMenuId === m.id ? null : m.id)
                                    }
                                  >
                                    <MoreVertical size={16} />
                                  </button>

                                  {activeRowMenuId === m.id && (
                                    <div className="tf-row-dropdown-popover" ref={rowMenuRef}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleLaunchCall(m);
                                          setActiveRowMenuId(null);
                                        }}
                                      >
                                        <Video size={13} />
                                        <span>Join Meeting</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedMeetingDetails(m);
                                          setActiveRowMenuId(null);
                                        }}
                                      >
                                        <ExternalLink size={13} />
                                        <span>View Details</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleCopyLink(m.meetingUrl);
                                          setActiveRowMenuId(null);
                                        }}
                                      >
                                        <Copy size={13} />
                                        <span>Copy Link</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer / Pagination */}
              <footer className="tf-meet-table-footer">
                <span className="tf-footer-showing">
                  Showing 1 to {filteredMeetings.length} of {totalCount} meetings
                </span>

                <div className="tf-footer-pagination">
                  <button
                    type="button"
                    className="tf-page-arrow-btn"
                    disabled
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button type="button" className="tf-page-num-btn active">
                    1
                  </button>
                  <button
                    type="button"
                    className="tf-page-arrow-btn"
                    disabled
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </footer>
            </div>
          </div>

          {/* ------------------------------------------------------------------
              RIGHT COLUMN: Calendar, Upcoming Meetings, Meeting Links
              ------------------------------------------------------------------ */}
          <div className="tf-meet-right-area">
            {/* Widget 1: Calendar Card */}
            <article className="tf-side-widget tf-calendar-widget">
              <div className="tf-cal-header-row">
                <h3>Calendar</h3>
              </div>

              <div className="tf-cal-month-nav">
                <button
                  type="button"
                  className="tf-cal-nav-btn"
                  onClick={() =>
                    setCalendarMonth(
                      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                    )
                  }
                  title="Previous month"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="tf-cal-month-title">
                  {calendarMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  type="button"
                  className="tf-cal-nav-btn"
                  onClick={() =>
                    setCalendarMonth(
                      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                    )
                  }
                  title="Next month"
                  aria-label="Next month"
                >
                  <ChevronRight size={15} />
                </button>
              </div>

              {/* Days header */}
              <div className="tf-cal-weekdays">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Dates grid */}
              <div className="tf-cal-days-grid">
                {miniCalendarDays.map((item, idx) => {
                  let cls = "tf-cal-cell";
                  if (!item.currentMonth) cls += " muted";
                  if (item.isSelected) cls += " selected";
                  if (item.isToday) cls += " today";

                  return (
                    <div
                      key={idx}
                      className={cls}
                      onClick={() => {
                        if (!item.currentMonth) return;
                        if (selectedCalendarDate === item.fullDate) {
                          setSelectedCalendarDate(null);
                          showToast("Cleared calendar date filter");
                        } else {
                          setSelectedCalendarDate(item.fullDate);
                          showToast(`Filtered meetings for ${item.fullDate}`);
                        }
                      }}
                    >
                      <span className="num">{item.day}</span>
                      {item.dots && (
                        <div className="dots-row">
                          {item.dots.map((d, dIdx) => (
                            <span key={dIdx} className={`dot ${d}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="tf-cal-legend">
                <div className="tf-legend-item">
                  <span className="dot blue" />
                  <span>Meeting</span>
                </div>
                <div className="tf-legend-item">
                  <span className="dot red" />
                  <span>Task Deadline</span>
                </div>
                <div className="tf-legend-item">
                  <span className="dot yellow" />
                  <span>Other</span>
                </div>
                <div className="tf-legend-item">
                  <span className="dot blue-today" />
                  <span>Today</span>
                </div>
              </div>
            </article>

            {/* Widget 2: Upcoming Meetings Card */}
            <article className="tf-side-widget tf-upcoming-widget">
              <div className="tf-widget-header">
                <h3>Upcoming Meetings</h3>
                <button
                  type="button"
                  className="tf-widget-view-all"
                  onClick={() => setFilterTab("Upcoming")}
                >
                  View all <ChevronRight size={13} />
                </button>
              </div>

              <div className="tf-upcoming-list">
                {/* Item 1: Daily Standup */}
                <div className="tf-upcoming-item">
                  <div className="tf-upcoming-icon-box blue">
                    <Video size={16} />
                  </div>
                  <div className="tf-upcoming-details">
                    <strong>Daily Standup</strong>
                    <span className="time">Today, 9:00 – 9:30 AM</span>
                    <span className="proj">TeamFlow Website</span>
                  </div>
                  <button
                    type="button"
                    className="tf-upcoming-join-btn join-now-pill"
                    onClick={() => handleLaunchCall(meetings[0])}
                  >
                    <span className="tf-dot-pulse" />
                    <span>Join Now</span>
                  </button>
                </div>

                {/* Item 2: UI Design Discussion */}
                <div className="tf-upcoming-item">
                  <div className="tf-upcoming-icon-box purple">
                    <Users size={16} />
                  </div>
                  <div className="tf-upcoming-details">
                    <strong>UI Design Discussion</strong>
                    <span className="time">Today, 10:00 – 11:00 AM</span>
                    <span className="proj">Mobile App</span>
                  </div>
                  <button
                    type="button"
                    className="tf-upcoming-join-btn solid-purple"
                    onClick={() => handleLaunchCall(meetings[1])}
                  >
                    <span>Join</span>
                  </button>
                </div>

                {/* Item 3: Bug Review Meeting */}
                <div className="tf-upcoming-item">
                  <div className="tf-upcoming-icon-box red">
                    <AlertCircle size={16} />
                  </div>
                  <div className="tf-upcoming-details">
                    <strong>Bug Review Meeting</strong>
                    <span className="time">Tomorrow, 11:30 AM</span>
                    <span className="proj">AI Integration</span>
                  </div>
                  <button
                    type="button"
                    className="tf-upcoming-join-btn solid-purple"
                    onClick={() => handleLaunchCall(meetings[2])}
                  >
                    <span>Join</span>
                  </button>
                </div>

                {/* Item 4: Project Sync */}
                <div className="tf-upcoming-item">
                  <div className="tf-upcoming-icon-box purple">
                    <FileText size={16} />
                  </div>
                  <div className="tf-upcoming-details">
                    <strong>Project Sync</strong>
                    <span className="time">Oct 24, 12:00 – 1:00 PM</span>
                    <span className="proj">Marketing Portal</span>
                  </div>
                  <button
                    type="button"
                    className="tf-upcoming-join-btn solid-purple"
                    onClick={() => handleLaunchCall(meetings[3])}
                  >
                    <span>Join</span>
                  </button>
                </div>
              </div>
            </article>

            {/* Widget 3: Meeting Links Card */}
            <article className="tf-side-widget tf-meeting-links-widget">
              <div className="tf-links-card-header">
                <div className="tf-links-icon-box">
                  <Link2 size={16} />
                </div>
                <div>
                  <h4>Join with Meeting Link</h4>
                  <p>Paste a Google Meet, Zoom or Teams link to join.</p>
                </div>
              </div>

              <form className="tf-links-input-row" onSubmit={handleJoinByLink}>
                <input
                  type="text"
                  placeholder="Enter meeting link..."
                  value={quickLinkInput}
                  onChange={(e) => setQuickLinkInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="tf-links-join-btn"
                  disabled={!quickLinkInput.trim()}
                >
                  Join
                </button>
              </form>
            </article>
          </div>
        </div>

        {/* ====================================================================
            MODAL 1: JOIN MEETING (WITH LINK) MODAL
            ==================================================================== */}
        {joinModalOpen && (
          <div
            className="tf-meet-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setJoinModalOpen(false);
            }}
          >
            <div className="tf-meet-modal-card" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-wrap">
                  <div className="tf-modal-icon-badge purple">
                    <Video size={18} />
                  </div>
                  <div>
                    <h3>Join Meeting with Link</h3>
                    <p>Enter any Google Meet, Zoom, or Teams URL or meeting code.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close-btn"
                  onClick={() => setJoinModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleJoinByLink} className="tf-modal-form-body">
                <div className="tf-modal-field">
                  <label>Meeting Link or Code *</label>
                  <div className="tf-field-input-box">
                    <Link2 size={16} className="tf-field-icon" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. https://meet.google.com/abc-defg-hij"
                      value={customJoinUrl}
                      onChange={(e) => setCustomJoinUrl(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="tf-quick-presets-row">
                  <span className="tf-preset-label">Quick sample links:</span>
                  <button
                    type="button"
                    className="tf-preset-pill"
                    onClick={() => setCustomJoinUrl("https://meet.google.com/teamflow-sync")}
                  >
                    Google Meet
                  </button>
                  <button
                    type="button"
                    className="tf-preset-pill"
                    onClick={() => setCustomJoinUrl("https://zoom.us/j/9483920194")}
                  >
                    Zoom
                  </button>
                  <button
                    type="button"
                    className="tf-preset-pill"
                    onClick={() => setCustomJoinUrl("https://teams.microsoft.com/l/meetup")}
                  >
                    MS Teams
                  </button>
                </div>

                <div className="tf-modal-action-buttons">
                  <button
                    type="button"
                    className="tf-btn-secondary"
                    onClick={() => setJoinModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="tf-btn-primary">
                    <Video size={16} />
                    <span>Join Room</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ====================================================================
            MODAL 2: MEETING DETAILS MODAL
            ==================================================================== */}
        {selectedMeetingDetails && (
          <div
            className="tf-meet-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedMeetingDetails(null);
            }}
          >
            <div className="tf-meet-modal-card wide" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-wrap">
                  <div className={`tf-modal-icon-badge ${selectedMeetingDetails.iconBg || "blue"}`}>
                    <Video size={18} />
                  </div>
                  <div>
                    <h3>{selectedMeetingDetails.title}</h3>
                    <p>{selectedMeetingDetails.project} • {selectedMeetingDetails.timeLabel}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close-btn"
                  onClick={() => setSelectedMeetingDetails(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="tf-modal-form-body">
                {/* Description */}
                <div className="tf-details-section">
                  <span className="tf-detail-label">Description</span>
                  <p className="tf-detail-text">{selectedMeetingDetails.description}</p>
                </div>

                {/* Meeting link card */}
                {selectedMeetingDetails.meetingUrl && (
                  <div className="tf-details-link-card">
                    <div className="tf-link-card-left">
                      <Video size={18} color="#2563EB" />
                      <div>
                        <strong>Video Call Link</strong>
                        <span>{selectedMeetingDetails.meetingUrl}</span>
                      </div>
                    </div>
                    <div className="tf-link-card-actions">
                      <button
                        type="button"
                        className="tf-btn-outline"
                        onClick={() => handleCopyLink(selectedMeetingDetails.meetingUrl)}
                      >
                        <Copy size={14} />
                        <span>Copy</span>
                      </button>
                      <button
                        type="button"
                        className="tf-btn-primary"
                        onClick={() => {
                          const m = selectedMeetingDetails;
                          setSelectedMeetingDetails(null);
                          handleLaunchCall(m);
                        }}
                      >
                        <Video size={14} />
                        <span>Join Now</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Agenda */}
                {selectedMeetingDetails.agenda && (
                  <div className="tf-details-section">
                    <span className="tf-detail-label">Meeting Agenda</span>
                    <div className="tf-agenda-box">
                      {selectedMeetingDetails.agenda.split("\n").map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attendees list */}
                <div className="tf-details-section">
                  <span className="tf-detail-label">Attendees</span>
                  <div className="tf-details-attendees-list">
                    <div className="tf-detail-attendee-chip">
                      <img src={avatars.rahul} alt="Rahul" />
                      <span>Rahul Sharma (Admin)</span>
                    </div>
                    <div className="tf-detail-attendee-chip">
                      <img src={avatars.neha} alt="Neha" />
                      <span>Neha Patil</span>
                    </div>
                    <div className="tf-detail-attendee-chip">
                      <img src={avatars.amit} alt="Amit" />
                      <span>Amit Verma</span>
                    </div>
                    <div className="tf-detail-attendee-chip">
                      <img src={profile.photo || avatars.priya} alt={profile.fullName || "You"} />
                      <span>{profile.fullName || "John Doe"} (You)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tf-modal-action-buttons">
                <button
                  type="button"
                  className="tf-btn-secondary"
                  onClick={() => setSelectedMeetingDetails(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            GOOGLE MEET CALL INTERFACE (LOBBY + IN-CALL ROOM)
            ==================================================================== */}
        {activeCallModal && (
          <div className="tf-gm-fullscreen-overlay">
            {callStage === "lobby" ? (
              /* ================================================================
                 STAGE 1: GOOGLE MEET LOBBY ("Ready to join?")
                 ================================================================ */
              <div className="tf-gm-lobby-wrapper">
                {/* Google Meet Top Header */}
                <div className="tf-gm-lobby-header">
                  <div className="tf-gm-brand-group">
                    <svg width="32" height="28" viewBox="0 0 32 28" fill="none" className="tf-gm-svg-logo">
                      <path d="M20 14L27 8.5V19.5L20 14Z" fill="#EA4335" />
                      <path d="M3.5 6C3.5 4.61929 4.61929 3.5 6 3.5H18C19.3807 3.5 20.5 4.61929 20.5 6V22C20.5 23.3807 19.3807 24.5 18 24.5H6C4.61929 24.5 3.5 23.3807 3.5 22V6Z" fill="#00832D" />
                      <path d="M3.5 6C3.5 4.61929 4.61929 3.5 6 3.5H20.5V10.5H3.5V6Z" fill="#0066DA" />
                      <path d="M3.5 17.5H20.5V22C20.5 23.3807 19.3807 24.5 18 24.5H6C4.61929 24.5 3.5 23.3807 3.5 22V17.5Z" fill="#2684FC" />
                      <path d="M20.5 10.5L27 5V8.5L20.5 13V10.5Z" fill="#FFBA00" />
                      <path d="M20.5 14.5L27 19.5V23L20.5 17.5V14.5Z" fill="#00AC47" />
                    </svg>
                    <span className="tf-gm-brand-title">Google Meet</span>
                  </div>

                  <div className="tf-gm-lobby-account">
                    <span className="tf-gm-email-text">{profile.email || "john.doe@teamflow.com"}</span>
                    <img src={profile.photo || avatars.priya} alt={profile.fullName || "User"} className="tf-gm-header-avatar" />
                    <button
                      type="button"
                      className="tf-gm-lobby-exit-btn"
                      onClick={() => setActiveCallModal(null)}
                      title="Exit"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Google Meet Lobby Body: Two Columns */}
                <div className="tf-gm-lobby-body">
                  {/* Left Column: Camera Preview */}
                  <div className="tf-gm-preview-container">
                    <div className={`tf-gm-camera-view ${callVideoOff ? "camera-off" : ""} ${backgroundBlur ? "blurred-feed" : ""}`}>
                      {!callVideoOff ? (
                        <div className="tf-gm-live-feed">
                          <img src={profile.photo || avatars.priya} alt={profile.fullName || "Your feed"} className="tf-gm-feed-img" />
                          <div className="tf-gm-name-tag-pill">{profile.fullName || "You"}</div>
                        </div>
                      ) : (
                        <div className="tf-gm-avatar-view">
                          <div className="tf-gm-avatar-large">{profile.initials || "JD"}</div>
                          <span className="tf-gm-cam-status-label">Camera is off</span>
                        </div>
                      )}

                      {/* Video Bottom Floating Controls */}
                      <div className="tf-gm-preview-toolbar">
                        <button
                          type="button"
                          className={`tf-gm-round-ctrl ${callMuted ? "muted" : ""}`}
                          onClick={() => {
                            setCallMuted(!callMuted);
                            showToast(callMuted ? "Microphone unmuted" : "Microphone muted");
                          }}
                          title={callMuted ? "Turn on microphone" : "Turn off microphone"}
                        >
                          {callMuted ? <MicOff size={20} /> : <Mic size={20} />}
                          {!callMuted && <span className="tf-gm-mic-audio-dot" />}
                        </button>

                        <button
                          type="button"
                          className={`tf-gm-round-ctrl ${callVideoOff ? "cam-off" : ""}`}
                          onClick={() => {
                            setCallVideoOff(!callVideoOff);
                            showToast(callVideoOff ? "Camera turned on" : "Camera turned off");
                          }}
                          title={callVideoOff ? "Turn on camera" : "Turn off camera"}
                        >
                          {callVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                        </button>

                        <button
                          type="button"
                          className={`tf-gm-round-ctrl ${backgroundBlur ? "effects-active" : ""}`}
                          onClick={() => {
                            setBackgroundBlur(!backgroundBlur);
                            showToast(backgroundBlur ? "Background effects turned off" : "Background blur active");
                          }}
                          title="Apply visual effects"
                        >
                          <Sparkles size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="tf-gm-preview-status-row">
                      <CheckCircle2 size={16} className="tf-gm-check-green" />
                      <span>Audio & video ready</span>
                    </div>
                  </div>

                  {/* Right Column: Join Action Panel */}
                  <div className="tf-gm-join-action-panel">
                    <h2 className="tf-gm-ready-title">Ready to join?</h2>
                    <h3 className="tf-gm-meet-name">{activeCallModal.title}</h3>

                    <div className="tf-gm-code-chip">
                      <span>{activeCallModal.meetingUrl || "https://meet.google.com/tmf-standup-2024"}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyLink(activeCallModal.meetingUrl || "https://meet.google.com/tmf-standup-2024")}
                        title="Copy meeting link"
                      >
                        <Copy size={14} />
                      </button>
                    </div>

                    {/* Who is on the call */}
                    <div className="tf-gm-attendees-presence">
                      <div className="tf-gm-avatar-stack">
                        <img src={avatars.rahul} alt="Rahul Sharma" />
                        <img src={avatars.neha} alt="Neha Patil" />
                        <img src={avatars.amit} alt="Amit Verma" />
                      </div>
                      <div className="tf-gm-presence-copy">
                        <strong>Rahul Sharma, Neha Patil and 2 others</strong>
                        <span>are already in this call</span>
                      </div>
                    </div>

                    {/* Join Action Buttons */}
                    <div className="tf-gm-cta-row">
                      <button
                        type="button"
                        className="tf-gm-btn-join"
                        onClick={handleJoinFromLobby}
                      >
                        Join now
                      </button>

                      <button
                        type="button"
                        className="tf-gm-btn-share-screen"
                        onClick={handlePresentFromLobby}
                      >
                        <Monitor size={17} />
                        <span>Present</span>
                      </button>
                    </div>

                    <div className="tf-gm-secondary-actions">
                      <button
                        type="button"
                        className="tf-gm-secondary-link"
                        onClick={handleJoinFromLobby}
                      >
                        Join and use a phone for audio
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ================================================================
                 STAGE 2: GOOGLE MEET IN-CALL ROOM (Full Interactive Screen)
                 ================================================================ */
              <div className="tf-gm-room-wrapper">
                {/* In-Call Body Stage & Drawer */}
                <div className="tf-gm-room-body">
                  <div className="tf-gm-stage-area">
                    {/* Presentation View if Screen Sharing */}
                    {callScreenShare ? (
                      <div className="tf-gm-share-view-container">
                        <div className="tf-gm-present-banner">
                          <div className="tf-gm-present-banner-left">
                            <Monitor size={17} />
                            <span>You are presenting to everyone</span>
                          </div>
                          <button
                            type="button"
                            className="tf-gm-btn-stop"
                            onClick={() => {
                              setCallScreenShare(false);
                              showToast("Stopped screen presentation.");
                            }}
                          >
                            Stop presenting
                          </button>
                        </div>

                        <div className="tf-gm-screen-mockup">
                          <div className="tf-gm-mockup-top">
                            <div className="tf-gm-window-dots">
                              <span className="dot red" />
                              <span className="dot yellow" />
                              <span className="dot green" />
                            </div>
                            <span className="tf-gm-window-title">TeamFlow AI — Sprint Review & Dashboard</span>
                          </div>
                          <div className="tf-gm-mockup-content">
                            <div className="tf-gm-chart-card">
                              <h4>Sprint 4 Velocity & Bug Resolution Metrics</h4>
                              <div className="tf-gm-mock-bars">
                                <div className="bar-col"><div className="bar b1" /><span>Sprint 1</span></div>
                                <div className="bar-col"><div className="bar b2" /><span>Sprint 2</span></div>
                                <div className="bar-col"><div className="bar b3" /><span>Sprint 3</span></div>
                                <div className="bar-col active"><div className="bar b4" /><span>Sprint 4 (94%)</span></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right vertical strip of participants */}
                        <div className="tf-gm-filmstrip-col">
                          <div className="tf-gm-filmstrip-tile speaking">
                            <img src={avatars.rahul} alt="Rahul Sharma" />
                            <div className="tf-gm-tile-label">Rahul Sharma</div>
                          </div>
                          <div className="tf-gm-filmstrip-tile">
                            <img src={avatars.neha} alt="Neha Patil" />
                            <div className="tf-gm-tile-label">Neha Patil</div>
                          </div>
                          <div className="tf-gm-filmstrip-tile">
                            <div className="tf-gm-char-tile">A</div>
                            <div className="tf-gm-tile-label">Amit Verma</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Standard 2x2 Grid Tiles */
                      <div className="tf-gm-grid-stage">
                        {/* Tile 1: Rahul Sharma (Speaking) */}
                        <div className="tf-gm-tile speaking">
                          <img src={avatars.rahul} alt="Rahul Sharma" className="tf-gm-tile-photo" />
                          <div className="tf-gm-tile-pill-tag">
                            <Mic size={13} color="#FFFFFF" />
                            <span>Rahul Sharma</span>
                          </div>
                          <div className="tf-gm-speaking-waves">
                            <span className="w1" />
                            <span className="w2" />
                            <span className="w3" />
                          </div>
                        </div>

                        {/* Tile 2: Neha Patil */}
                        <div className="tf-gm-tile">
                          <img src={avatars.neha} alt="Neha Patil" className="tf-gm-tile-photo" />
                          <div className="tf-gm-tile-pill-tag">
                            <Mic size={13} color="#FFFFFF" />
                            <span>Neha Patil</span>
                          </div>
                        </div>

                        {/* Tile 3: Amit Verma */}
                        <div className="tf-gm-tile avatar-only">
                          <div className="tf-gm-char-tile">A</div>
                          <div className="tf-gm-tile-pill-tag">
                            <MicOff size={13} color="#EA4335" />
                            <span>Amit Verma</span>
                          </div>
                        </div>

                        {/* Tile 4: You */}
                        <div className={`tf-gm-tile ${callVideoOff ? "avatar-only" : ""} ${backgroundBlur ? "blurred-feed" : ""}`}>
                          {!callVideoOff ? (
                            <img src={profile.photo || avatars.priya} alt={profile.fullName || "You"} className="tf-gm-tile-photo" />
                          ) : (
                            <div className="tf-gm-char-tile">{profile.initials || "JD"}</div>
                          )}
                          <div className="tf-gm-tile-pill-tag">
                            {callMuted ? <MicOff size={13} color="#EA4335" /> : <Mic size={13} color="#FFFFFF" />}
                            <span>{profile.fullName ? `${profile.fullName} (You)` : "You"}</span>
                          </div>
                          {callHandRaised && (
                            <div className="tf-gm-hand-pill" title="Hand raised">
                              <Hand size={16} />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Live Captions Bar */}
                    {callCaptions && (
                      <div className="tf-gm-live-captions">
                        <span className="tf-gm-cap-name">Rahul Sharma:</span>
                        <span className="tf-gm-cap-text">"Let's walk through the login flow integration before deploying to staging."</span>
                      </div>
                    )}

                    {/* Floating Reactions */}
                    <div className="tf-gm-reactions-layer">
                      {reactions.map((r) => (
                        <div key={r.id} className="tf-gm-reaction-bubble" style={{ left: `${r.left}%` }}>
                          {r.emoji}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Google Meet Right Side Drawer */}
                  {activeMeetDrawer && (
                    <aside className="tf-gm-side-drawer">
                      <div className="tf-gm-drawer-top">
                        <h4>
                          {activeMeetDrawer === "people" && "People (4)"}
                          {activeMeetDrawer === "chat" && "In-call messages"}
                          {activeMeetDrawer === "info" && "Meeting details"}
                        </h4>
                        <button
                          type="button"
                          className="tf-gm-drawer-x"
                          onClick={() => setActiveMeetDrawer(null)}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="tf-gm-drawer-scroll">
                        {activeMeetDrawer === "people" && (
                          <div className="tf-gm-people-content">
                            <div className="tf-gm-people-search">
                              <Search size={15} />
                              <input type="text" placeholder="Search for people" />
                            </div>
                            <span className="tf-gm-sub-heading">In call</span>
                            <div className="tf-gm-people-list">
                              <div className="tf-gm-user-item">
                                <img src={profile.photo || avatars.priya} alt={profile.fullName || "You"} />
                                <div className="tf-gm-user-info">
                                  <strong>{profile.fullName || "John Doe"} (You)</strong>
                                  <span>Meeting host</span>
                                </div>
                                <div className="tf-gm-user-icons">
                                  {callMuted ? <MicOff size={15} color="#EA4335" /> : <Mic size={15} color="#9AA0A6" />}
                                  <Pin size={15} color="#9AA0A6" />
                                </div>
                              </div>

                              <div className="tf-gm-user-item">
                                <img src={avatars.rahul} alt="Rahul Sharma" />
                                <div className="tf-gm-user-info">
                                  <strong>Rahul Sharma</strong>
                                </div>
                                <div className="tf-gm-user-icons">
                                  <Mic size={15} color="#9AA0A6" />
                                  <Pin size={15} color="#9AA0A6" />
                                </div>
                              </div>

                              <div className="tf-gm-user-item">
                                <img src={avatars.neha} alt="Neha Patil" />
                                <div className="tf-gm-user-info">
                                  <strong>Neha Patil</strong>
                                </div>
                                <div className="tf-gm-user-icons">
                                  <Mic size={15} color="#9AA0A6" />
                                  <Pin size={15} color="#9AA0A6" />
                                </div>
                              </div>

                              <div className="tf-gm-user-item">
                                <div className="tf-gm-char-avatar">A</div>
                                <div className="tf-gm-user-info">
                                  <strong>Amit Verma</strong>
                                </div>
                                <div className="tf-gm-user-icons">
                                  <MicOff size={15} color="#EA4335" />
                                  <Pin size={15} color="#9AA0A6" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeMeetDrawer === "chat" && (
                          <div className="tf-gm-chat-content">
                            <div className="tf-gm-chat-banner">
                              Messages can be seen only by people in the call and are deleted when the call ends.
                            </div>
                            <div className="tf-gm-chat-messages-box">
                              {inCallMessages.map((m) => (
                                <div key={m.id} className="tf-gm-chat-message-row">
                                  <div className="tf-gm-chat-meta">
                                    <strong>{m.sender}</strong>
                                    <span>{m.time}</span>
                                  </div>
                                  <p>{m.text}</p>
                                </div>
                              ))}
                            </div>
                            <form className="tf-gm-chat-input-bar" onSubmit={handleSendInCallMessage}>
                              <input
                                type="text"
                                placeholder="Send a message to everyone"
                                value={inCallText}
                                onChange={(e) => setInCallText(e.target.value)}
                              />
                              <button type="submit" disabled={!inCallText.trim()}>
                                <Send size={15} />
                              </button>
                            </form>
                          </div>
                        )}

                        {activeMeetDrawer === "info" && (
                          <div className="tf-gm-info-content">
                            <h4>Joining info</h4>
                            <p className="tf-gm-link-text">{activeCallModal.meetingUrl || "https://meet.google.com/tmf-standup-2024"}</p>
                            <button
                              type="button"
                              className="tf-gm-btn-copy-info"
                              onClick={() => handleCopyLink(activeCallModal.meetingUrl || "https://meet.google.com/tmf-standup-2024")}
                            >
                              <Copy size={15} />
                              <span>Copy joining info</span>
                            </button>
                            <div className="tf-gm-phone-details">
                              <span>Dial-in: (US) +1 415-555-0199</span>
                              <span>PIN: 849 203 118#</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </aside>
                  )}
                </div>

                {/* Google Meet Bottom Controls Bar */}
                <div className="tf-gm-bottom-bar">
                  {/* Left: Time & Code */}
                  <div className="tf-gm-bottom-left">
                    <span className="tf-gm-time-text">
                      {new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </span>
                    <span className="tf-gm-bar-pipe">|</span>
                    <span className="tf-gm-code-text">
                      {activeCallModal.meetingUrl ? activeCallModal.meetingUrl.split("/").pop() : "tmf-standup-2024"}
                    </span>
                    <span className="tf-gm-duration-pill">{formatCallTime(callDuration)}</span>
                  </div>

                  {/* Center: Action Buttons */}
                  <div className="tf-gm-bottom-center">
                    {/* Mic Button */}
                    <button
                      type="button"
                      className={`tf-gm-btn-circle ${callMuted ? "danger" : ""}`}
                      onClick={() => {
                        setCallMuted(!callMuted);
                        showToast(callMuted ? "Microphone on" : "Microphone off");
                      }}
                      title={callMuted ? "Turn on microphone (ctrl + d)" : "Turn off microphone (ctrl + d)"}
                    >
                      {callMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    {/* Camera Button */}
                    <button
                      type="button"
                      className={`tf-gm-btn-circle ${callVideoOff ? "danger" : ""}`}
                      onClick={() => {
                        setCallVideoOff(!callVideoOff);
                        showToast(callVideoOff ? "Camera on" : "Camera off");
                      }}
                      title={callVideoOff ? "Turn on camera (ctrl + e)" : "Turn off camera (ctrl + e)"}
                    >
                      {callVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                    </button>

                    {/* Captions [CC] */}
                    <button
                      type="button"
                      className={`tf-gm-btn-circle ${callCaptions ? "active-blue" : ""}`}
                      onClick={() => {
                        setCallCaptions(!callCaptions);
                        showToast(callCaptions ? "Captions turned off" : "Captions turned on");
                      }}
                      title="Turn on captions"
                    >
                      <Subtitles size={20} />
                    </button>

                    {/* Emoji Reactions */}
                    <div className="tf-gm-reaction-wrapper">
                      <button
                        type="button"
                        className={`tf-gm-btn-circle ${showReactionsMenu ? "active-blue" : ""}`}
                        onClick={() => setShowReactionsMenu(!showReactionsMenu)}
                        title="Send a reaction"
                      >
                        <Smile size={20} />
                      </button>

                      {showReactionsMenu && (
                        <div className="tf-gm-reactions-menu">
                          {["💖", "👍", "🎉", "👏", "😂", "😮"].map((emoji, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="tf-gm-reaction-btn"
                              onClick={() => handleTriggerReaction(emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Screen Share / Present */}
                    <button
                      type="button"
                      className={`tf-gm-btn-circle ${callScreenShare ? "active-blue" : ""}`}
                      onClick={() => {
                        setCallScreenShare(!callScreenShare);
                        showToast(callScreenShare ? "Stopped presenting" : "Presenting your screen");
                      }}
                      title="Present now"
                    >
                      <Monitor size={20} />
                    </button>

                    {/* Raise Hand */}
                    <button
                      type="button"
                      className={`tf-gm-btn-circle ${callHandRaised ? "active-blue" : ""}`}
                      onClick={() => {
                        setCallHandRaised(!callHandRaised);
                        showToast(callHandRaised ? "Lowered hand" : "Raised hand");
                      }}
                      title={callHandRaised ? "Lower hand" : "Raise hand"}
                    >
                      <Hand size={20} />
                    </button>

                    {/* More Options */}
                    <button
                      type="button"
                      className="tf-gm-btn-circle"
                      onClick={() => showToast("More settings & Whiteboard options")}
                      title="More options"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {/* Red Leave Call Button */}
                    <button
                      type="button"
                      className="tf-gm-btn-hangup"
                      onClick={handleLeaveCall}
                      title="Leave call"
                    >
                      <PhoneOff size={20} />
                    </button>
                  </div>

                  {/* Right: Drawer Toggles */}
                  <div className="tf-gm-bottom-right">
                    <button
                      type="button"
                      className={`tf-gm-icon-btn ${activeMeetDrawer === "info" ? "active" : ""}`}
                      onClick={() => setActiveMeetDrawer(activeMeetDrawer === "info" ? null : "info")}
                      title="Meeting details"
                    >
                      <Info size={20} />
                    </button>

                    <button
                      type="button"
                      className={`tf-gm-icon-btn ${activeMeetDrawer === "people" ? "active" : ""}`}
                      onClick={() => setActiveMeetDrawer(activeMeetDrawer === "people" ? null : "people")}
                      title="People"
                    >
                      <Users size={20} />
                      <span className="tf-gm-badge-count">4</span>
                    </button>

                    <button
                      type="button"
                      className={`tf-gm-icon-btn ${activeMeetDrawer === "chat" ? "active" : ""}`}
                      onClick={() => setActiveMeetDrawer(activeMeetDrawer === "chat" ? null : "chat")}
                      title="Chat"
                    >
                      <MessageSquare size={20} />
                      <span className="tf-gm-unread-dot" />
                    </button>

                    <button
                      type="button"
                      className="tf-gm-icon-btn"
                      onClick={() => showToast("Activities: Whiteboard and Polls")}
                      title="Activities"
                    >
                      <Grid size={20} />
                    </button>

                    <button
                      type="button"
                      className="tf-gm-icon-btn"
                      onClick={() => showToast("Host controls")}
                      title="Host controls"
                    >
                      <Shield size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </EmployeeShell>
  );
}

export default Meetings;
