import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Bug,
  Clock,
  AlertCircle,
  CheckCircle2,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Zap,
  Smartphone,
  Rocket,
  Layers,
  Eye,
  MessageSquare,
  Paperclip,
  MoreVertical,
  Check,
  Trash2,
  Copy,
  ExternalLink,
  FileText,
  Download,
  Edit3,
  Tag,
  Activity,
} from "lucide-react";

import EmployeeShell from "./EmployeeShell";
import "./Bugs.css";

/* Storage Key */
const STORAGE_KEY = "tf_assigned_bugs_v3";

/* Initial 3 Bugs matching reference image exactly */
const defaultBugs = [
  {
    id: 1,
    bugId: "#BUG-1023",
    title: "Login button not working",
    description: "Login button clicks but user is not redirected to dashboard.",
    tags: ["UI", "Authentication", "Frontend"],
    project: "TeamFlow Website",
    projectIcon: "zap",
    projectBg: "purple",
    priority: "High",
    status: "In Progress",
    assignedDate: "Oct 20, 2024",
    dueDate: "Oct 25, 2024",
    isDueSoon: true,
    commentsCount: 2,
    hasAttachments: true,
    comments: [
      { id: 1, author: "Rahul Sharma", text: "Verified on Firefox and Chrome, auth redirect callback is missing.", time: "Oct 21, 2024" },
      { id: 2, author: "Priya Patel", text: "Debugging the route transition logic right now.", time: "Oct 22, 2024" },
    ],
    attachments: [
      { name: "error_console_screenshot.png", size: "340 KB", type: "image" },
      { name: "auth_trace_log.txt", size: "85 KB", type: "log" },
    ],
  },
  {
    id: 2,
    bugId: "#BUG-1045",
    title: "API returns 500 error",
    description: "Getting 500 error on fetching project details API.",
    tags: ["API", "Backend", "High Priority"],
    project: "Mobile App",
    projectIcon: "phone",
    projectBg: "blue",
    priority: "Medium",
    status: "Open",
    assignedDate: "Oct 22, 2024",
    dueDate: "Oct 28, 2024",
    isDueSoon: false,
    commentsCount: 1,
    hasAttachments: true,
    comments: [
      { id: 1, author: "Amit Verma", text: "Checked backend logs; looks like database timeout on join query.", time: "Oct 23, 2024" },
    ],
    attachments: [
      { name: "500_response_payload.json", size: "18 KB", type: "json" },
    ],
  },
  {
    id: 3,
    bugId: "#BUG-1078",
    title: "UI misalignment on mobile",
    description: "Sidebar menu is overlapping on mobile devices.",
    tags: ["UI", "Responsive", "Mobile"],
    project: "AI Integration",
    projectIcon: "rocket",
    projectBg: "orange",
    priority: "Low",
    status: "Resolved",
    assignedDate: "Oct 18, 2024",
    dueDate: "Oct 24, 2024",
    isDueSoon: false,
    commentsCount: 3,
    hasAttachments: true,
    comments: [
      { id: 1, author: "Sneha Rao", text: "Mobile breakpoint media query has been updated.", time: "Oct 23, 2024" },
      { id: 2, author: "Karan Singh", text: "Tested on iPhone 14 and Pixel 7, looks resolved.", time: "Oct 24, 2024" },
      { id: 3, author: "Priya Patel", text: "Marking as resolved.", time: "Today, 10:24 AM" },
    ],
    attachments: [
      { name: "mobile_fixed_preview.png", size: "1.2 MB", type: "image" },
    ],
  },
];

/* Normalizer helper to avoid runtime exceptions */
const normalizeBug = (b, idx = 0) => {
  return {
    id: b?.id || Date.now() + idx,
    bugId: b?.bugId || `#BUG-${1000 + idx + 1}`,
    title: b?.title || `Issue ${idx + 1}`,
    description: b?.description || "Documented system bug assigned to your personal workflow.",
    tags: Array.isArray(b?.tags) ? b.tags : ["UI", "Frontend"],
    project: b?.project || "TeamFlow Website",
    projectIcon: b?.projectIcon || "zap",
    projectBg: b?.projectBg || "purple",
    priority: b?.priority || "Medium",
    status: b?.status || "Open",
    assignedDate: b?.assignedDate || "Oct 20, 2024",
    dueDate: b?.dueDate || "Oct 30, 2024",
    isDueSoon: Boolean(b?.isDueSoon || b?.dueDate === "Oct 25, 2024"),
    commentsCount: Array.isArray(b?.comments) ? b.comments.length : (typeof b?.commentsCount === "number" ? b.commentsCount : 0),
    hasAttachments: Boolean(b?.hasAttachments || (Array.isArray(b?.attachments) && b.attachments.length > 0)),
    comments: Array.isArray(b?.comments) ? b.comments : [],
    attachments: Array.isArray(b?.attachments) ? b.attachments : [],
  };
};

/* Recent Bug Activity items matching reference image */
const defaultRecentActivities = [
  {
    id: 1,
    type: "resolved",
    icon: CheckCircle2,
    iconBg: "green",
    boldText: "You marked a bug as resolved",
    subText: "UI misalignment on mobile (#BUG-1078)",
    time: "10:24 AM",
  },
  {
    id: 2,
    type: "comment",
    icon: MessageSquare,
    iconBg: "blue",
    boldText: "You commented on a bug",
    subText: "API returns 500 error (#BUG-1045)",
    time: "Oct 23",
  },
  {
    id: 3,
    type: "status",
    icon: Edit3,
    iconBg: "purple",
    boldText: "You updated status to In Progress",
    subText: "Login button not working (#BUG-1023)",
    time: "Oct 21",
  },
  {
    id: 4,
    type: "file",
    icon: Paperclip,
    iconBg: "gray",
    boldText: "You attached a file",
    subText: "Screenshots.zip (#BUG-1023)",
    time: "Oct 20",
  },
];

function Bugs() {
  // Load bugs safely from localStorage
  const [bugs, setBugs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          return parsed.map((b, i) => normalizeBug(b, i));
        }
      }
    } catch (e) {
      console.warn("Using default bugs:", e);
    }
    return defaultBugs.map((b, i) => normalizeBug(b, i));
  });

  // Filter Tabs: All | Open | In Progress | Resolved | Closed
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Dropdown states
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [rowStatusDropdownId, setRowStatusDropdownId] = useState(null);
  const [actionMenuBugId, setActionMenuBugId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);

  // Row Selection
  const [selectedBugIds, setSelectedBugIds] = useState([]);

  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [detailsModalBug, setDetailsModalBug] = useState(null);
  const [commentsModalBug, setCommentsModalBug] = useState(null);
  const [attachmentsModalBug, setAttachmentsModalBug] = useState(null);

  // Edit Bug Ticket Form State (Matches user reference screenshot)
  const [bugEditForm, setBugEditForm] = useState({
    id: null,
    title: "",
    project: "Backend API",
    assignee: "Rahul Sharma",
    severity: "Critical",
    status: "In Progress",
    description: "",
  });

  const handleOpenEditBug = (bug) => {
    setDetailsModalBug(bug);
    setBugEditForm({
      id: bug.id,
      title: bug.title || "",
      project: bug.project || "Backend API",
      assignee: bug.assignee || "Rahul Sharma",
      severity: bug.severity || bug.priority || "Critical",
      status: bug.status || "In Progress",
      description: bug.description || "",
    });
  };

  const handleSaveBugEdit = (e) => {
    e.preventDefault();
    if (!bugEditForm.title.trim()) return;

    setBugs((prev) =>
      prev.map((b) => {
        if (b.id === bugEditForm.id) {
          return {
            ...b,
            title: bugEditForm.title.trim(),
            project: bugEditForm.project,
            assignee: bugEditForm.assignee,
            severity: bugEditForm.severity,
            priority: bugEditForm.severity,
            status: bugEditForm.status,
            description: bugEditForm.description.trim(),
          };
        }
        return b;
      })
    );
    setDetailsModalBug(null);
    showToast("Bug ticket updated successfully!");
  };

  // Comment input state
  const [newCommentText, setNewCommentText] = useState("");

  // Toast state
  const [toastMessage, setToastMessage] = useState("");

  // Report Bug Form State
  const [bugForm, setBugForm] = useState({
    title: "",
    description: "",
    project: "TeamFlow Website",
    priority: "High",
    status: "Open",
    dueDate: new Date().toISOString().split("T")[0],
    tagsText: "UI, Frontend",
  });

  const projectRef = useRef(null);
  const priorityRef = useRef(null);
  const statusRef = useRef(null);
  const rowsRef = useRef(null);

  // Persist bugs to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bugs));
  }, [bugs]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (projectRef.current && !projectRef.current.contains(e.target)) {
        setProjectDropdownOpen(false);
      }
      if (priorityRef.current && !priorityRef.current.contains(e.target)) {
        setPriorityDropdownOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setStatusDropdownOpen(false);
      }
      if (rowsRef.current && !rowsRef.current.contains(e.target)) {
        setRowsDropdownOpen(false);
      }
      if (!e.target.closest(".tf-bug-status-dropdown-wrap")) {
        setRowStatusDropdownId(null);
      }
      if (!e.target.closest(".tf-bug-action-menu-wrap")) {
        setActionMenuBugId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Compute live stats
  const stats = useMemo(() => {
    const total = bugs.length;
    const inProgress = bugs.filter((b) => b.status === "In Progress").length;
    const open = bugs.filter((b) => b.status === "Open").length;
    const resolved = bugs.filter((b) => b.status === "Resolved").length;
    const closed = bugs.filter((b) => b.status === "Closed").length;

    const high = bugs.filter((b) => b.priority === "High").length;
    const medium = bugs.filter((b) => b.priority === "Medium").length;
    const low = bugs.filter((b) => b.priority === "Low").length;

    return { total, inProgress, open, resolved, closed, high, medium, low };
  }, [bugs]);

  // Filtered bugs
  const filteredBugs = useMemo(() => {
    let result = [...bugs];

    // Tab filter
    if (activeTab === "Open") {
      result = result.filter((b) => b.status === "Open");
    } else if (activeTab === "In Progress") {
      result = result.filter((b) => b.status === "In Progress");
    } else if (activeTab === "Resolved") {
      result = result.filter((b) => b.status === "Resolved");
    } else if (activeTab === "Closed") {
      result = result.filter((b) => b.status === "Closed");
    }

    // Project dropdown filter
    if (projectFilter !== "All") {
      result = result.filter((b) => b.project === projectFilter);
    }

    // Priority dropdown filter
    if (priorityFilter !== "All") {
      result = result.filter((b) => b.priority === priorityFilter);
    }

    // Status dropdown filter
    if (statusFilter !== "All") {
      result = result.filter((b) => b.status === statusFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.bugId.toLowerCase().includes(q) ||
          b.project.toLowerCase().includes(q) ||
          (b.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [bugs, activeTab, projectFilter, priorityFilter, statusFilter, searchQuery]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredBugs.length / rowsPerPage));
  const displayedBugs = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredBugs.slice(start, start + rowsPerPage);
  }, [filteredBugs, currentPage, rowsPerPage]);

  // Handle Select All
  const handleSelectAll = () => {
    if (selectedBugIds.length === displayedBugs.length) {
      setSelectedBugIds([]);
    } else {
      setSelectedBugIds(displayedBugs.map((b) => b.id));
    }
  };

  // Handle single row selection
  const handleSelectRow = (bugId) => {
    setSelectedBugIds((prev) =>
      prev.includes(bugId) ? prev.filter((id) => id !== bugId) : [...prev, bugId]
    );
  };

  // Handle Status Change
  const handleChangeStatus = (bugId, newStatus) => {
    setBugs((prev) =>
      prev.map((b) => (b.id === bugId ? { ...b, status: newStatus } : b))
    );
    setRowStatusDropdownId(null);
    if (detailsModalBug && detailsModalBug.id === bugId) {
      setDetailsModalBug((prev) => ({ ...prev, status: newStatus }));
    }
    showToast(`Bug status updated to "${newStatus}"`);
  };

  // Handle Report Bug submission
  const handleReportBug = (e) => {
    e.preventDefault();
    if (!bugForm.title.trim()) return;

    const projectConfig = {
      "TeamFlow Website": { icon: "zap", bg: "purple" },
      "Mobile App": { icon: "phone", bg: "blue" },
      "AI Integration": { icon: "rocket", bg: "orange" },
      "Marketing Portal": { icon: "layers", bg: "purple-soft" },
    };

    const cfg = projectConfig[bugForm.project] || { icon: "zap", bg: "purple" };

    const parsedTags = bugForm.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newBug = {
      id: Date.now(),
      bugId: `#BUG-${Math.floor(1000 + Math.random() * 9000)}`,
      title: bugForm.title.trim(),
      description: bugForm.description.trim() || "Reported bug issue.",
      tags: parsedTags.length > 0 ? parsedTags : ["UI", "Frontend"],
      project: bugForm.project,
      projectIcon: cfg.icon,
      projectBg: cfg.bg,
      priority: bugForm.priority,
      status: bugForm.status,
      assignedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      dueDate: bugForm.dueDate || "Oct 30, 2024",
      isDueSoon: false,
      commentsCount: 0,
      hasAttachments: false,
      comments: [],
      attachments: [],
    };

    setBugs((prev) => [newBug, ...prev]);
    setReportModalOpen(false);
    setBugForm({
      title: "",
      description: "",
      project: "TeamFlow Website",
      priority: "High",
      status: "Open",
      dueDate: new Date().toISOString().split("T")[0],
      tagsText: "UI, Frontend",
    });
    showToast(`New bug "${newBug.bugId}" reported successfully!`);
  };

  // Handle Delete Bug
  const handleDeleteBug = (bugId) => {
    setBugs((prev) => prev.filter((b) => b.id !== bugId));
    setActionMenuBugId(null);
    showToast("Bug deleted.");
  };

  // Handle Duplicate Bug
  const handleDuplicateBug = (bug) => {
    const dup = {
      ...bug,
      id: Date.now(),
      bugId: `#BUG-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${bug.title} (Clone)`,
      status: "Open",
    };
    setBugs((prev) => [dup, ...prev]);
    setActionMenuBugId(null);
    showToast("Bug cloned.");
  };

  // Handle Add Comment
  const handleAddComment = () => {
    if (!newCommentText.trim() || !commentsModalBug) return;
    const newComment = {
      id: Date.now(),
      author: "Priya Patel",
      text: newCommentText.trim(),
      time: "Just now",
    };

    setBugs((prev) =>
      prev.map((b) => {
        if (b.id === commentsModalBug.id) {
          const updatedComments = [...(b.comments || []), newComment];
          return {
            ...b,
            comments: updatedComments,
            commentsCount: updatedComments.length,
          };
        }
        return b;
      })
    );

    setCommentsModalBug((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
      commentsCount: (prev.comments || []).length + 1,
    }));

    setNewCommentText("");
    showToast("Comment posted!");
  };

  // Render project icon
  const renderProjectIcon = (icon) => {
    switch (icon) {
      case "phone":
        return <Smartphone size={13} />;
      case "rocket":
        return <Rocket size={13} />;
      case "layers":
        return <Layers size={13} />;
      case "zap":
      default:
        return <Zap size={13} />;
    }
  };

  // Donut chart calculations:
  // Open = Red (#EF4444), In Progress = Blue (#3B82F6), Resolved = Green (#10B981)
  const totalSummary = Math.max(stats.total, 1);
  const openPct = Math.round((stats.open / totalSummary) * 100);
  const inProgressPct = Math.round((stats.inProgress / totalSummary) * 100);
  const resolvedPct = Math.max(0, 100 - openPct - inProgressPct);

  // Circumference for r=36 is 2 * PI * 36 = 226.2
  const c = 226.2;
  const openStroke = (openPct / 100) * c;
  const inProgressStroke = (inProgressPct / 100) * c;
  const resolvedStroke = (resolvedPct / 100) * c;

  const openOffset = 0;
  const inProgressOffset = -openStroke;
  const resolvedOffset = -(openStroke + inProgressStroke);

  // Priority percentages for bar charts
  const highPct = Math.round((stats.high / totalSummary) * 100);
  const medPct = Math.round((stats.medium / totalSummary) * 100);
  const lowPct = Math.round((stats.low / totalSummary) * 100);

  return (
    <EmployeeShell activeRoute="/employee/bugs">
      <div className="tf-bugs-page">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="tf-bug-toast" role="status">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ====================================================================
            1. PAGE HEADER (Title + Subtitle + Report Bug CTA)
            ==================================================================== */}
        <header className="tf-bugs-header">
          <div className="tf-bugs-title-group">
            <h1>Assigned Bugs</h1>
            <p>Bugs that are assigned to you. View details, update status, add comments, and attach files.</p>
          </div>

          <button
            type="button"
            className="tf-bugs-report-btn"
            onClick={() => setReportModalOpen(true)}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Report Bug</span>
          </button>
        </header>

        {/* ====================================================================
            2. TOP 4 METRIC KPI STAT CARDS
            ==================================================================== */}
        <section className="tf-bugs-stats-grid">
          {/* Card 1: Total Assigned */}
          <div
            className={`tf-bug-stat-card ${activeTab === "All" ? "selected" : ""}`}
            onClick={() => setActiveTab("All")}
          >
            <div className="tf-bug-stat-icon red-box">
              <Bug size={21} color="#EF4444" strokeWidth={2.2} />
            </div>
            <div className="tf-bug-stat-body">
              <span className="tf-bug-stat-label">Total Assigned</span>
              <div className="tf-bug-stat-val-row">
                <strong className="tf-bug-stat-value">{stats.total}</strong>
              </div>
              <span className="tf-bug-stat-sub">All assigned to you</span>
            </div>
          </div>

          {/* Card 2: In Progress */}
          <div
            className={`tf-bug-stat-card ${activeTab === "In Progress" ? "selected" : ""}`}
            onClick={() => setActiveTab("In Progress")}
          >
            <div className="tf-bug-stat-icon orange-box">
              <Clock size={21} color="#F59E0B" strokeWidth={2.4} />
            </div>
            <div className="tf-bug-stat-body">
              <span className="tf-bug-stat-label">In Progress</span>
              <div className="tf-bug-stat-val-row">
                <strong className="tf-bug-stat-value">{stats.inProgress}</strong>
                <span className="tf-bug-stat-badge positive">↑ 33%</span>
              </div>
              <span className="tf-bug-stat-sub">Currently working</span>
            </div>
          </div>

          {/* Card 3: Open */}
          <div
            className={`tf-bug-stat-card ${activeTab === "Open" ? "selected" : ""}`}
            onClick={() => setActiveTab("Open")}
          >
            <div className="tf-bug-stat-icon salmon-box">
              <AlertCircle size={21} color="#EF4444" strokeWidth={2.3} />
            </div>
            <div className="tf-bug-stat-body">
              <span className="tf-bug-stat-label">Open</span>
              <div className="tf-bug-stat-val-row">
                <strong className="tf-bug-stat-value">{stats.open}</strong>
                <span className="tf-bug-stat-badge negative">↑ 33%</span>
              </div>
              <span className="tf-bug-stat-sub">Needs attention</span>
            </div>
          </div>

          {/* Card 4: Resolved */}
          <div
            className={`tf-bug-stat-card ${activeTab === "Resolved" ? "selected" : ""}`}
            onClick={() => setActiveTab("Resolved")}
          >
            <div className="tf-bug-stat-icon green-box">
              <CheckCircle2 size={21} color="#10B981" strokeWidth={2.3} />
            </div>
            <div className="tf-bug-stat-body">
              <span className="tf-bug-stat-label">Resolved</span>
              <div className="tf-bug-stat-val-row">
                <strong className="tf-bug-stat-value">{stats.resolved}</strong>
                <span className="tf-bug-stat-badge positive">↑ 33%</span>
              </div>
              <span className="tf-bug-stat-sub">Fixed this month</span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. FILTER TABS & CONTROLS ROW
            ==================================================================== */}
        <section className="tf-bugs-controls-row">
          {/* Left: Filter Tabs */}
          <div className="tf-bugs-filter-pills">
            <button
              type="button"
              className={`tf-bug-pill ${activeTab === "All" ? "active" : ""}`}
              onClick={() => setActiveTab("All")}
            >
              All ({stats.total})
            </button>
            <button
              type="button"
              className={`tf-bug-pill ${activeTab === "Open" ? "active" : ""}`}
              onClick={() => setActiveTab("Open")}
            >
              Open ({stats.open})
            </button>
            <button
              type="button"
              className={`tf-bug-pill ${activeTab === "In Progress" ? "active" : ""}`}
              onClick={() => setActiveTab("In Progress")}
            >
              In Progress ({stats.inProgress})
            </button>
            <button
              type="button"
              className={`tf-bug-pill ${activeTab === "Resolved" ? "active" : ""}`}
              onClick={() => setActiveTab("Resolved")}
            >
              Resolved ({stats.resolved})
            </button>
            <button
              type="button"
              className={`tf-bug-pill ${activeTab === "Closed" ? "active" : ""}`}
              onClick={() => setActiveTab("Closed")}
            >
              Closed ({stats.closed})
            </button>
          </div>

          {/* Right: Search + Project, Priority, Status Dropdowns */}
          <div className="tf-bugs-actions-group">
            {/* Search Input */}
            <div className="tf-bug-search-box">
              <Search size={15} className="tf-bug-search-icon" />
              <input
                type="text"
                placeholder="Search bugs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="tf-bug-search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Project Dropdown */}
            <div className="tf-bug-dropdown-wrap" ref={projectRef}>
              <button
                type="button"
                className="tf-bug-dropdown-btn"
                onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              >
                <span>{projectFilter === "All" ? "Project" : projectFilter}</span>
                <ChevronDown size={14} className={projectDropdownOpen ? "open" : ""} />
              </button>

              {projectDropdownOpen && (
                <div className="tf-bug-dropdown-menu">
                  {[
                    "All",
                    "TeamFlow Website",
                    "Mobile App",
                    "AI Integration",
                    "Marketing Portal",
                  ].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={projectFilter === p ? "active" : ""}
                      onClick={() => {
                        setProjectFilter(p);
                        setProjectDropdownOpen(false);
                      }}
                    >
                      {p === "All" ? "All Projects" : p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Priority Dropdown */}
            <div className="tf-bug-dropdown-wrap" ref={priorityRef}>
              <button
                type="button"
                className="tf-bug-dropdown-btn"
                onClick={() => setPriorityDropdownOpen(!priorityDropdownOpen)}
              >
                <span>{priorityFilter === "All" ? "Priority" : priorityFilter}</span>
                <ChevronDown size={14} className={priorityDropdownOpen ? "open" : ""} />
              </button>

              {priorityDropdownOpen && (
                <div className="tf-bug-dropdown-menu">
                  {["All", "High", "Medium", "Low"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={priorityFilter === p ? "active" : ""}
                      onClick={() => {
                        setPriorityFilter(p);
                        setPriorityDropdownOpen(false);
                      }}
                    >
                      {p === "All" ? "All Priorities" : p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="tf-bug-dropdown-wrap" ref={statusRef}>
              <button
                type="button"
                className="tf-bug-dropdown-btn"
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              >
                <span>{statusFilter === "All" ? "Status" : statusFilter}</span>
                <ChevronDown size={14} className={statusDropdownOpen ? "open" : ""} />
              </button>

              {statusDropdownOpen && (
                <div className="tf-bug-dropdown-menu">
                  {["All", "Open", "In Progress", "Resolved", "Closed"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={statusFilter === s ? "active" : ""}
                      onClick={() => {
                        setStatusFilter(s);
                        setStatusDropdownOpen(false);
                      }}
                    >
                      {s === "All" ? "All Statuses" : s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. TWO-COLUMN MAIN CONTENT (Left ~70% Table | Right ~30% Widgets)
            ==================================================================== */}
        <div className="tf-bugs-main-layout">
          {/* ------------------------------------------------------------------
              LEFT COLUMN: Assigned Bugs Table + Pagination Footer
              ------------------------------------------------------------------ */}
          <div className="tf-bugs-table-card">
            <div className="tf-bugs-table-responsive">
              <table className="tf-bugs-table">
                <thead>
                  <tr>
                    <th className="tf-th-checkbox">
                      <button
                        type="button"
                        className="tf-checkbox-th-btn"
                        onClick={handleSelectAll}
                        aria-label="Select all bugs"
                      >
                        {selectedBugIds.length === displayedBugs.length && displayedBugs.length > 0 ? (
                          <div className="tf-custom-checkbox checked">
                            <Check size={12} color="#FFFFFF" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="tf-custom-checkbox" />
                        )}
                      </button>
                    </th>
                    <th>Bug ID</th>
                    <th>Title & Description</th>
                    <th>Project</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned Date</th>
                    <th>Due Date</th>
                    <th className="tf-th-actions">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedBugs.map((bug) => {
                    const statusSlug = (bug.status || "Open").toLowerCase().replace(" ", "-");
                    const prioritySlug = (bug.priority || "Medium").toLowerCase();
                    const isSelected = selectedBugIds.includes(bug.id);

                    return (
                      <tr
                        key={bug.id}
                        className={`tf-bugs-row ${isSelected ? "row-selected" : ""}`}
                      >
                        {/* 1. Selection Checkbox */}
                        <td className="tf-td-checkbox">
                          <button
                            type="button"
                            className="tf-row-check-btn"
                            onClick={() => handleSelectRow(bug.id)}
                            aria-label={`Select bug ${bug.bugId}`}
                          >
                            <div className={`tf-custom-checkbox ${isSelected ? "checked" : ""}`}>
                              {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                            </div>
                          </button>
                        </td>

                        {/* 2. Bug ID Pill */}
                        <td className="tf-td-bugid">
                          <span
                            className="tf-bug-id-pill"
                            onClick={() => handleOpenEditBug(bug)}
                          >
                            {bug.bugId}
                          </span>
                        </td>

                        {/* 3. Title & Description + Tags */}
                        <td className="tf-td-title">
                          <div
                            className="tf-bug-title-group"
                            onClick={() => handleOpenEditBug(bug)}
                          >
                            <span className="tf-bug-main-title">{bug.title}</span>
                            <span className="tf-bug-sub-desc">{bug.description}</span>
                            <div className="tf-bug-tags-row">
                              {(bug.tags || []).map((t, idx) => {
                                const isPrimaryTag = idx === 1;
                                return (
                                  <span
                                    key={idx}
                                    className={`tf-bug-tag ${isPrimaryTag ? "highlight" : ""}`}
                                  >
                                    {t}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </td>

                        {/* 4. Project Pill */}
                        <td className="tf-td-project">
                          <div className="tf-bug-project-pill">
                            <span className={`tf-project-icon-box ${bug.projectBg || "purple"}`}>
                              {renderProjectIcon(bug.projectIcon)}
                            </span>
                            <span className="tf-project-name">{bug.project}</span>
                          </div>
                        </td>

                        {/* 5. Priority Pill */}
                        <td className="tf-td-priority">
                          <span className={`tf-priority-pill ${prioritySlug}`}>
                            <span className="dot" />
                            <span>{bug.priority}</span>
                          </span>
                        </td>

                        {/* 6. Status Dropdown Pill */}
                        <td className="tf-td-status">
                          <div className="tf-bug-status-dropdown-wrap">
                            <button
                              type="button"
                              className={`tf-status-pill-btn ${statusSlug}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setRowStatusDropdownId(
                                  rowStatusDropdownId === bug.id ? null : bug.id
                                );
                              }}
                            >
                              <span>{bug.status}</span>
                              <ChevronDown size={13} />
                            </button>

                            {rowStatusDropdownId === bug.id && (
                              <div className="tf-status-dropdown-menu">
                                {["Open", "In Progress", "Resolved", "Closed"].map((st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    className={`tf-status-opt ${st.toLowerCase().replace(" ", "-")} ${bug.status === st ? "active" : ""}`}
                                    onClick={() => handleChangeStatus(bug.id, st)}
                                  >
                                    <span>{st}</span>
                                    {bug.status === st && <Check size={13} />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 7. Assigned Date */}
                        <td className="tf-td-assigned">
                          <span className="tf-date-text">{bug.assignedDate}</span>
                        </td>

                        {/* 8. Due Date */}
                        <td className="tf-td-due">
                          <span className={`tf-date-text ${bug.isDueSoon ? "due-soon" : ""}`}>
                            {bug.dueDate}
                          </span>
                        </td>

                        {/* 9. Action Icons */}
                        <td className="tf-td-actions">
                          <div className="tf-bug-actions-row">
                            {/* Eye: View Bug Details */}
                            <button
                              type="button"
                              className="tf-bug-action-btn"
                              onClick={() => handleOpenEditBug(bug)}
                              title="View details"
                            >
                              <Eye size={15} />
                            </button>

                            {/* Message: Comments with badge */}
                            <button
                              type="button"
                              className="tf-bug-action-btn with-badge"
                              onClick={() => setCommentsModalBug(bug)}
                              title="Comments"
                            >
                              <MessageSquare size={15} />
                              {bug.commentsCount > 0 && (
                                <span className="tf-badge-num">{bug.commentsCount}</span>
                              )}
                            </button>

                            {/* Paperclip: Attachments */}
                            <button
                              type="button"
                              className="tf-bug-action-btn"
                              onClick={() => setAttachmentsModalBug(bug)}
                              title="Attachments"
                            >
                              <Paperclip size={15} />
                            </button>

                            {/* Three dots: More actions menu */}
                            <div className="tf-bug-action-menu-wrap">
                              <button
                                type="button"
                                className="tf-bug-action-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActionMenuBugId(
                                    actionMenuBugId === bug.id ? null : bug.id
                                  );
                                }}
                                title="More actions"
                              >
                                <MoreVertical size={15} />
                              </button>

                              {actionMenuBugId === bug.id && (
                                <div className="tf-row-action-popover">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleOpenEditBug(bug);
                                      setActionMenuBugId(null);
                                    }}
                                  >
                                    <Edit3 size={13} />
                                    <span>Edit Bug</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDuplicateBug(bug)}
                                  >
                                    <Copy size={13} />
                                    <span>Clone Bug</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleChangeStatus(
                                        bug.id,
                                        bug.status === "Resolved" ? "In Progress" : "Resolved"
                                      )
                                    }
                                  >
                                    <CheckCircle2 size={13} />
                                    <span>
                                      {bug.status === "Resolved"
                                        ? "Reopen Bug"
                                        : "Mark Resolved"}
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    className="danger"
                                    onClick={() => handleDeleteBug(bug.id)}
                                  >
                                    <Trash2 size={13} />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty state if search finds nothing */}
            {filteredBugs.length === 0 && (
              <div className="tf-bugs-empty-state">
                <Bug size={40} color="#94A3B8" />
                <h3>No bugs match your criteria</h3>
                <p>Try switching filter tabs or clearing your search query.</p>
                <button
                  type="button"
                  className="tf-bugs-reset-btn"
                  onClick={() => {
                    setActiveTab("All");
                    setProjectFilter("All");
                    setPriorityFilter("All");
                    setStatusFilter("All");
                    setSearchQuery("");
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Footer */}
            <footer className="tf-bugs-pagination-footer">
              <span className="tf-pagination-info">
                Showing {filteredBugs.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{" "}
                {Math.min(currentPage * rowsPerPage, filteredBugs.length)} of {filteredBugs.length} bugs
              </span>

              <div className="tf-pagination-controls">
                {/* Previous Button */}
                <button
                  type="button"
                  className="tf-page-nav-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page Number 1 */}
                <button
                  type="button"
                  className={`tf-page-btn ${currentPage === 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  className="tf-page-nav-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>

                {/* Rows per page dropdown */}
                <div className="tf-rows-per-page-wrap" ref={rowsRef}>
                  <button
                    type="button"
                    className="tf-rows-per-page-btn"
                    onClick={() => setRowsDropdownOpen(!rowsDropdownOpen)}
                  >
                    <span>{rowsPerPage} per page</span>
                    <ChevronDown size={14} className={rowsDropdownOpen ? "open" : ""} />
                  </button>

                  {rowsDropdownOpen && (
                    <div className="tf-rows-dropdown-menu">
                      {[10, 20, 50].map((num) => (
                        <button
                          key={num}
                          type="button"
                          className={rowsPerPage === num ? "active" : ""}
                          onClick={() => {
                            setRowsPerPage(num);
                            setCurrentPage(1);
                            setRowsDropdownOpen(false);
                          }}
                        >
                          {num} per page
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </footer>
          </div>

          {/* ------------------------------------------------------------------
              RIGHT COLUMN: 3 Widgets (Bugs by Status, Priority, Activity)
              ------------------------------------------------------------------ */}
          <div className="tf-bugs-right-sidebar">
            {/* Widget 1: Bugs by Status (Donut Chart) */}
            <article className="tf-widget-card tf-bugs-status-card">
              <div className="tf-widget-header">
                <h2>Bugs by Status</h2>
              </div>

              <div className="tf-widget-body tf-status-donut-body">
                {/* SVG Donut Chart */}
                <div className="tf-donut-container">
                  <svg className="tf-donut-svg" viewBox="0 0 100 100" width="130" height="130">
                    {/* Track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#F1F5F9"
                      strokeWidth="11"
                    />

                    {/* Open (Red: 33%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#EF4444"
                      strokeWidth="11"
                      strokeDasharray={`${openStroke} ${c}`}
                      strokeDashoffset={openOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />

                    {/* In Progress (Blue: 33%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#3B82F6"
                      strokeWidth="11"
                      strokeDasharray={`${inProgressStroke} ${c}`}
                      strokeDashoffset={inProgressOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />

                    {/* Resolved (Green: 33%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#10B981"
                      strokeWidth="11"
                      strokeDasharray={`${resolvedStroke} ${c}`}
                      strokeDashoffset={resolvedOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>

                  {/* Centered Number */}
                  <div className="tf-donut-center-label">
                    <span className="tf-donut-main-number">{stats.total}</span>
                    <span className="tf-donut-sub-text">Bugs</span>
                  </div>
                </div>

                {/* Legend on right */}
                <div className="tf-status-legend">
                  <div
                    className="tf-legend-row"
                    onClick={() => setActiveTab("Open")}
                  >
                    <span className="tf-legend-dot red" />
                    <span className="tf-legend-label">
                      <strong>{stats.open}</strong> Open
                    </span>
                  </div>

                  <div
                    className="tf-legend-row"
                    onClick={() => setActiveTab("In Progress")}
                  >
                    <span className="tf-legend-dot blue" />
                    <span className="tf-legend-label">
                      <strong>{stats.inProgress}</strong> In Progress
                    </span>
                  </div>

                  <div
                    className="tf-legend-row"
                    onClick={() => setActiveTab("Resolved")}
                  >
                    <span className="tf-legend-dot green" />
                    <span className="tf-legend-label">
                      <strong>{stats.resolved}</strong> Resolved
                    </span>
                  </div>

                  <div
                    className="tf-legend-row"
                    onClick={() => setActiveTab("Closed")}
                  >
                    <span className="tf-legend-dot slate" />
                    <span className="tf-legend-label">
                      <strong>{stats.closed}</strong> Closed
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Widget 2: Bugs by Priority (Horizontal Progress Bars) */}
            <article className="tf-widget-card tf-bugs-priority-card">
              <div className="tf-widget-header">
                <h2>Bugs by Priority</h2>
              </div>

              <div className="tf-priority-bars-list">
                {/* High Priority Bar */}
                <div className="tf-priority-bar-row">
                  <div className="tf-pbar-label red">High</div>
                  <div className="tf-pbar-track">
                    <div
                      className="tf-pbar-fill red"
                      style={{ width: `${Math.max(highPct, 15)}%` }}
                    />
                  </div>
                  <div className="tf-pbar-meta">
                    <strong>{stats.high}</strong>
                    <span>{highPct}%</span>
                  </div>
                </div>

                {/* Medium Priority Bar */}
                <div className="tf-priority-bar-row">
                  <div className="tf-pbar-label orange">Medium</div>
                  <div className="tf-pbar-track">
                    <div
                      className="tf-pbar-fill orange"
                      style={{ width: `${Math.max(medPct, 15)}%` }}
                    />
                  </div>
                  <div className="tf-pbar-meta">
                    <strong>{stats.medium}</strong>
                    <span>{medPct}%</span>
                  </div>
                </div>

                {/* Low Priority Bar */}
                <div className="tf-priority-bar-row">
                  <div className="tf-pbar-label green">Low</div>
                  <div className="tf-pbar-track">
                    <div
                      className="tf-pbar-fill green"
                      style={{ width: `${Math.max(lowPct, 15)}%` }}
                    />
                  </div>
                  <div className="tf-pbar-meta">
                    <strong>{stats.low}</strong>
                    <span>{lowPct}%</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Widget 3: Recent Bug Activity */}
            <article className="tf-widget-card tf-bugs-activity-card">
              <div className="tf-widget-header">
                <div className="tf-widget-title-with-icon">
                  <h2>Recent Bug Activity</h2>
                </div>

                <Link to="/employee/settings?tab=activity" className="tf-widget-view-all">
                  View all <ChevronRight size={14} />
                </Link>
              </div>

              <div className="tf-recent-activities-list">
                {defaultRecentActivities.map((act) => {
                  const Icon = act.icon;
                  return (
                    <div
                      key={act.id}
                      className="tf-activity-item"
                      onClick={() => showToast(`Activity: ${act.boldText}`)}
                    >
                      <div className={`tf-activity-icon-box ${act.iconBg}`}>
                        <Icon size={15} />
                      </div>

                      <div className="tf-activity-content">
                        <strong className="tf-activity-bold">{act.boldText}</strong>
                        <span className="tf-activity-sub">{act.subText}</span>
                      </div>

                      <span className="tf-activity-time">{act.time}</span>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </div>

        {/* ====================================================================
            5. MODALS
            ==================================================================== */}

        {/* Modal 1: + Report Bug */}
        {reportModalOpen && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setReportModalOpen(false);
            }}
          >
            <div className="tf-modal-card tf-bug-report-modal" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-group">
                  <div className="tf-modal-icon-box red">
                    <Bug size={18} color="#EF4444" />
                  </div>
                  <div>
                    <h3>Report Bug</h3>
                    <p>Document an issue with reproduction details and severity.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setReportModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleReportBug}>
                <div className="tf-modal-form-body">
                  <div className="tf-form-field">
                    <label>Bug Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Broken navigation drawer on Safari mobile"
                      value={bugForm.title}
                      onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })}
                    />
                  </div>

                  <div className="tf-form-field">
                    <label>Description & Expected Result</label>
                    <textarea
                      rows={3}
                      placeholder="Describe steps to reproduce, actual vs expected result..."
                      value={bugForm.description}
                      onChange={(e) => setBugForm({ ...bugForm, description: e.target.value })}
                    />
                  </div>

                  <div className="tf-form-row">
                    <div className="tf-form-field">
                      <label>Project</label>
                      <select
                        value={bugForm.project}
                        onChange={(e) => setBugForm({ ...bugForm, project: e.target.value })}
                      >
                        <option value="TeamFlow Website">TeamFlow Website</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="AI Integration">AI Integration</option>
                        <option value="Marketing Portal">Marketing Portal</option>
                      </select>
                    </div>

                    <div className="tf-form-field">
                      <label>Priority</label>
                      <select
                        value={bugForm.priority}
                        onChange={(e) => setBugForm({ ...bugForm, priority: e.target.value })}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="tf-form-row">
                    <div className="tf-form-field">
                      <label>Target Fix Date</label>
                      <input
                        type="date"
                        value={bugForm.dueDate}
                        onChange={(e) => setBugForm({ ...bugForm, dueDate: e.target.value })}
                      />
                    </div>

                    <div className="tf-form-field">
                      <label>Initial Status</label>
                      <select
                        value={bugForm.status}
                        onChange={(e) => setBugForm({ ...bugForm, status: e.target.value })}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <div className="tf-form-field">
                    <label>Tags (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. UI, Frontend, Safari"
                      value={bugForm.tagsText}
                      onChange={(e) => setBugForm({ ...bugForm, tagsText: e.target.value })}
                    />
                  </div>
                </div>

                <div className="tf-modal-actions">
                  <button
                    type="button"
                    className="tf-btn-secondary"
                    onClick={() => setReportModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="tf-btn-primary red-action">
                    Report Bug
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: Edit Bug Ticket Modal (Matches reference design) */}
        {detailsModalBug && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDetailsModalBug(null);
            }}
          >
            <div className="tf-modal-card tf-edit-ticket-modal" role="dialog" aria-modal="true">
              <div className="tf-modal-header-simple">
                <h3>Edit Bug Ticket</h3>
                <button
                  type="button"
                  className="tf-modal-close-simple"
                  onClick={() => setDetailsModalBug(null)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveBugEdit}>
                <div className="tf-modal-body-simple">
                  {/* Issue Title */}
                  <div className="tf-simple-form-field">
                    <label>
                      Issue Title <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. OAuth 2.0 Token Refresh Failure on Mobile Safari"
                      value={bugEditForm.title}
                      onChange={(e) =>
                        setBugEditForm({ ...bugEditForm, title: e.target.value })
                      }
                    />
                  </div>

                  {/* Project & Assignee Row */}
                  <div className="tf-simple-form-row">
                    <div className="tf-simple-form-field">
                      <label>Project</label>
                      <input
                        type="text"
                        placeholder="Backend API"
                        value={bugEditForm.project}
                        onChange={(e) =>
                          setBugEditForm({ ...bugEditForm, project: e.target.value })
                        }
                      />
                    </div>
                    <div className="tf-simple-form-field">
                      <label>Assignee</label>
                      <input
                        type="text"
                        placeholder="Rahul Sharma"
                        value={bugEditForm.assignee}
                        onChange={(e) =>
                          setBugEditForm({ ...bugEditForm, assignee: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Severity Level & Status Row */}
                  <div className="tf-simple-form-row">
                    <div className="tf-simple-form-field">
                      <label>Severity Level</label>
                      <select
                        value={bugEditForm.severity}
                        onChange={(e) =>
                          setBugEditForm({ ...bugEditForm, severity: e.target.value })
                        }
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                    <div className="tf-simple-form-field">
                      <label>Status</label>
                      <select
                        value={bugEditForm.status}
                        onChange={(e) =>
                          setBugEditForm({ ...bugEditForm, status: e.target.value })
                        }
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  {/* Steps to Reproduce / Description */}
                  <div className="tf-simple-form-field">
                    <label>Steps to Reproduce / Description</label>
                    <textarea
                      rows={4}
                      placeholder="JWT session fails to refresh after 30 minutes of inactivity on iOS devices."
                      value={bugEditForm.description}
                      onChange={(e) =>
                        setBugEditForm({ ...bugEditForm, description: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="tf-modal-footer-simple">
                  <button
                    type="button"
                    className="tf-simple-btn-cancel"
                    onClick={() => setDetailsModalBug(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="tf-simple-btn-update">
                    Update Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 3: Comments Modal */}
        {commentsModalBug && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setCommentsModalBug(null);
            }}
          >
            <div className="tf-modal-card tf-bug-comments-modal" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-group">
                  <div className="tf-modal-icon-box blue">
                    <MessageSquare size={18} color="#2563EB" />
                  </div>
                  <div>
                    <h3>Bug Comments</h3>
                    <p>{commentsModalBug.bugId} — {commentsModalBug.title}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setCommentsModalBug(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="tf-comments-body">
                <div className="tf-comments-list">
                  {(commentsModalBug.comments || []).length === 0 ? (
                    <div className="tf-comments-empty">
                      <MessageSquare size={30} color="#94A3B8" />
                      <p>No comments on this bug yet.</p>
                    </div>
                  ) : (
                    (commentsModalBug.comments || []).map((c) => (
                      <div key={c.id} className="tf-comment-bubble">
                        <div className="tf-comment-top">
                          <strong>{c.author}</strong>
                          <span>{c.time}</span>
                        </div>
                        <p>{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="tf-comment-input-area">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddComment();
                    }}
                  />
                  <button
                    type="button"
                    className="tf-comment-send-btn"
                    onClick={handleAddComment}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal 4: Attachments Modal */}
        {attachmentsModalBug && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setAttachmentsModalBug(null);
            }}
          >
            <div className="tf-modal-card tf-bug-attachments-modal" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-group">
                  <div className="tf-modal-icon-box purple">
                    <Paperclip size={18} color="#7C3AED" />
                  </div>
                  <div>
                    <h3>Attached Files & Logs</h3>
                    <p>{attachmentsModalBug.bugId} — {attachmentsModalBug.title}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setAttachmentsModalBug(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="tf-attachments-body">
                {(attachmentsModalBug.attachments || []).length === 0 ? (
                  <div className="tf-attachments-empty">
                    <FileText size={32} color="#94A3B8" />
                    <p>No screenshots or logs attached yet.</p>
                  </div>
                ) : (
                  <div className="tf-attachments-list">
                    {(attachmentsModalBug.attachments || []).map((att, i) => (
                      <div key={i} className="tf-attachment-row">
                        <div className="tf-att-icon-box">
                          <FileText size={16} color="#4F46E5" />
                        </div>
                        <div className="tf-att-info">
                          <strong>{att.name}</strong>
                          <span>{att.size}</span>
                        </div>
                        <button
                          type="button"
                          className="tf-att-download-btn"
                          onClick={() => showToast(`Downloading ${att.name}...`)}
                          title="Download"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="tf-upload-mock-btn"
                  onClick={() => showToast("File attachment dialog opened.")}
                >
                  <Plus size={15} />
                  <span>Attach Screenshot or Log</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeShell>
  );
}

export default Bugs;
