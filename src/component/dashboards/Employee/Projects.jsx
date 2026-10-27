import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Folder,
  Play,
  Clock,
  CheckCircle2,
  Search,
  ChevronDown,
  ArrowUpDown,
  Download,
  Zap,
  Smartphone,
  Rocket,
  Layers,
  Calendar,
  Users,
  MoreVertical,
  ArrowRight,
  CheckSquare,
  Check,
  MessageSquare,
  FileText,
  GitBranch,
  Flag,
  PieChart as PieChartIcon,
  Clock3,
  X,
  ExternalLink,
} from "lucide-react";

import EmployeeShell from "./EmployeeShell";
import "./Projects.css";

/* Storage key versioned to avoid legacy incompatible objects in localStorage */
const STORAGE_KEY = "tf_projects_v2";
const TASKS_STORAGE_KEY = "tf_project_tasks_v2";

/* Sample Avatars matching reference image */
const memberAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
];

/* Initial Projects matching reference image exactly */
const defaultProjects = [
  {
    id: 1,
    name: "TeamFlow Website",
    status: "Active",
    description: "Redesign and develop the new TeamFlow AI website with modern UI/UX.",
    category: "UI/UX Design",
    dateRange: "Jan 10, 2024 - Mar 30, 2024",
    startDate: "2024-01-10",
    dueDate: "2024-03-30",
    teamSize: "Team of 5",
    progress: 85,
    icon: "zap",
    iconBg: "purple",
    barColor: "green",
    members: [
      { id: 1, name: "Priya Patel", avatar: memberAvatars[0], initials: "PP" },
      { id: 2, name: "Rahul Sharma", avatar: memberAvatars[1], initials: "RS" },
      { id: 3, name: "Amit Verma", avatar: memberAvatars[2], initials: "AV" },
    ],
    moreMembers: "+2",
  },
  {
    id: 2,
    name: "Mobile App",
    status: "Active",
    description: "Build and launch the TeamFlow AI mobile application for iOS and Android.",
    category: "Mobile App",
    dateRange: "Feb 1, 2024 - Apr 15, 2024",
    startDate: "2024-02-01",
    dueDate: "2024-04-15",
    teamSize: "Team of 4",
    progress: 62,
    icon: "phone",
    iconBg: "blue",
    barColor: "blue",
    members: [
      { id: 1, name: "Priya Patel", avatar: memberAvatars[0], initials: "PP" },
      { id: 2, name: "Rahul Sharma", avatar: memberAvatars[1], initials: "RS" },
      { id: 4, name: "Karan Singh", avatar: memberAvatars[3], initials: "KS" },
    ],
    moreMembers: "+1",
  },
  {
    id: 3,
    name: "AI Integration",
    status: "On Hold",
    description: "Integrate AI features for task suggestions, summaries and automation.",
    category: "Development",
    dateRange: "Mar 1, 2024 - May 30, 2024",
    startDate: "2024-03-01",
    dueDate: "2024-05-30",
    teamSize: "Team of 4",
    progress: 40,
    icon: "rocket",
    iconBg: "orange",
    barColor: "orange",
    members: [
      { id: 1, name: "Priya Patel", avatar: memberAvatars[0], initials: "PP" },
      { id: 3, name: "Amit Verma", avatar: memberAvatars[2], initials: "AV" },
      { id: 5, name: "Sneha Rao", avatar: memberAvatars[4], initials: "SR" },
    ],
    moreMembers: "+1",
  },
  {
    id: 4,
    name: "Marketing Portal",
    status: "Completed",
    description: "Content management and marketing portal development.",
    category: "Content & Design",
    dateRange: "Jan 5, 2024 - Feb 28, 2024",
    startDate: "2024-01-05",
    dueDate: "2024-02-28",
    teamSize: "Team of 3",
    progress: 100,
    icon: "layers",
    iconBg: "purple-soft",
    barColor: "green",
    members: [
      { id: 1, name: "Priya Patel", avatar: memberAvatars[0], initials: "PP" },
      { id: 4, name: "Karan Singh", avatar: memberAvatars[3], initials: "KS" },
      { id: 6, name: "Neha Gupta", avatar: memberAvatars[5], initials: "NG" },
    ],
    moreMembers: "",
  },
];

/* Normalizer helper to prevent ANY runtime error from missing properties */
const normalizeProject = (p, index = 0) => {
  const fallbackIcons = ["zap", "phone", "rocket", "layers"];
  const fallbackBgs = ["purple", "blue", "orange", "purple-soft"];
  const fallbackBars = ["green", "blue", "orange", "green"];

  return {
    id: p?.id || index + 1,
    name: p?.name || `Project ${index + 1}`,
    status: p?.status || (p?.progress === 100 ? "Completed" : "Active"),
    description: p?.description || "Collaborative team initiative and task workflow.",
    category: p?.category || "UI/UX Design",
    dateRange: p?.dateRange || "Jan 10, 2024 - Mar 30, 2024",
    startDate: p?.startDate || "2024-01-10",
    dueDate: p?.dueDate || "2024-03-30",
    teamSize: p?.teamSize || "Team of 4",
    progress: typeof p?.progress === "number" ? Math.min(Math.max(p.progress, 0), 100) : 50,
    icon: p?.icon || fallbackIcons[index % fallbackIcons.length],
    iconBg: p?.iconBg || fallbackBgs[index % fallbackBgs.length],
    barColor: p?.barColor || fallbackBars[index % fallbackBars.length],
    members: Array.isArray(p?.members) && p.members.length > 0 ? p.members : [
      { id: 1, name: "Priya Patel", avatar: memberAvatars[0], initials: "PP" },
      { id: 2, name: "Rahul Sharma", avatar: memberAvatars[1], initials: "RS" },
      { id: 3, name: "Amit Verma", avatar: memberAvatars[2], initials: "AV" },
    ],
    moreMembers: p?.moreMembers !== undefined ? p.moreMembers : "+1",
  };
};

/* Initial Tasks in Projects table matching reference image */
const defaultTasksInProjects = [
  {
    id: 1,
    name: "Design homepage UI",
    project: "TeamFlow Website",
    dueDate: "Today",
    isDueToday: true,
    priority: "High",
    status: "In Progress",
  },
  {
    id: 2,
    name: "API integration testing",
    project: "Mobile App",
    dueDate: "Oct 26",
    isDueToday: false,
    priority: "Medium",
    status: "To Do",
  },
  {
    id: 3,
    name: "Create API documentation",
    project: "AI Integration",
    dueDate: "Oct 28",
    isDueToday: false,
    priority: "Low",
    status: "In Progress",
  },
  {
    id: 4,
    name: "Prepare marketing content",
    project: "Marketing Portal",
    dueDate: "Oct 30",
    isDueToday: false,
    priority: "Medium",
    status: "Completed",
  },
];

/* Recent Project Activity items matching reference image */
const recentProjectActivities = [
  {
    id: 1,
    type: "task",
    icon: CheckSquare,
    iconBg: "green",
    boldText: "You updated a task",
    subText: "TeamFlow Website",
    time: "10:24 AM",
  },
  {
    id: 2,
    type: "comment",
    icon: MessageSquare,
    iconBg: "blue",
    boldText: "Rahul commented",
    subText: "Mobile App",
    time: "09:45 AM",
  },
  {
    id: 3,
    type: "file",
    icon: FileText,
    iconBg: "orange",
    boldText: "You uploaded a file",
    subText: "AI Integration",
    time: "09:20 AM",
  },
  {
    id: 4,
    type: "status",
    icon: GitBranch,
    iconBg: "purple",
    boldText: "Project status changed",
    subText: "Marketing Portal",
    time: "Yesterday",
  },
  {
    id: 5,
    type: "milestone",
    icon: Flag,
    iconBg: "yellow",
    boldText: "New milestone added",
    subText: "TeamFlow Website",
    time: "Yesterday",
  },
];

function Projects() {
  // Load projects from localStorage safely
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4) {
          return parsed.map((p, idx) => normalizeProject(p, idx));
        }
      }
    } catch (err) {
      console.warn("Using default projects:", err);
    }
    return defaultProjects.map((p, idx) => normalizeProject(p, idx));
  });

  // Load project tasks safely
  const [projectTasks, setProjectTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(TASKS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4) return parsed;
      }
    } catch (err) {
      console.warn("Using default project tasks:", err);
    }
    return defaultTasksInProjects;
  });

  // Filter & Search states
  const [activeFilter, setActiveFilter] = useState("All"); // All | Active | On Hold | Completed
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default"); // default | name | progress-high | progress-low | date

  // Dropdown states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);

  // Selected project for Details Modal
  const [selectedProject, setSelectedProject] = useState(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState("");

  const statusRef = useRef(null);
  const sortRef = useRef(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(projectTasks));
  }, [projectTasks]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setStatusDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortDropdownOpen(false);
      }
      if (!e.target.closest(".tf-proj-action-menu-wrap")) {
        setActionMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Compute stats dynamically
  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p) => p?.status === "Active").length;
    const onHold = projects.filter((p) => p?.status === "On Hold").length;
    const completed = projects.filter((p) => p?.status === "Completed").length;
    return { total, active, onHold, completed };
  }, [projects]);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Filter by tab
    if (activeFilter !== "All") {
      result = result.filter((p) => (p?.status || "Active") === activeFilter);
    }

    // Filter by status dropdown
    if (statusFilter !== "All") {
      result = result.filter((p) => (p?.status || "Active") === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p?.name || "").toLowerCase().includes(q) ||
          (p?.description || "").toLowerCase().includes(q) ||
          (p?.category || "").toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));
    } else if (sortBy === "progress-high") {
      result.sort((a, b) => (b?.progress || 0) - (a?.progress || 0));
    } else if (sortBy === "progress-low") {
      result.sort((a, b) => (a?.progress || 0) - (b?.progress || 0));
    } else if (sortBy === "date") {
      result.sort((a, b) => new Date(a?.startDate || 0) - new Date(b?.startDate || 0));
    }

    return result;
  }, [projects, activeFilter, statusFilter, searchQuery, sortBy]);

  // Toast helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Export List functionality (CSV download)
  const handleExportList = () => {
    const headers = ["Project Name", "Status", "Category", "Date Range", "Progress", "Team Size"];
    const rows = filteredProjects.map((p) => [
      `"${p?.name || ""}"`,
      `"${p?.status || ""}"`,
      `"${p?.category || ""}"`,
      `"${p?.dateRange || ""}"`,
      `"${p?.progress || 0}%"`,
      `"${p?.teamSize || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TeamFlow_Projects_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Projects list exported successfully!");
  };

  // Toggle task status in the "My Tasks in Projects" table
  const handleToggleTaskStatus = (taskId) => {
    setProjectTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          let nextStatus = "In Progress";
          if (t.status === "To Do") nextStatus = "In Progress";
          else if (t.status === "In Progress") nextStatus = "Completed";
          else if (t.status === "Completed") nextStatus = "To Do";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
    showToast("Task status updated!");
  };



  // Render project icon
  const renderProjectIcon = (icon) => {
    switch (icon) {
      case "phone":
        return <Smartphone size={18} />;
      case "rocket":
        return <Rocket size={18} />;
      case "layers":
        return <Layers size={18} />;
      case "zap":
      default:
        return <Zap size={18} />;
    }
  };

  // Donut chart calculations:
  // Active = 2 (50%), On Hold = 1 (25%), Completed = 1 (25%)
  const totalSummary = Math.max(stats.total, 1);
  const activePercent = Math.round((stats.active / totalSummary) * 100);
  const onHoldPercent = Math.round((stats.onHold / totalSummary) * 100);
  const completedPercent = Math.max(0, 100 - activePercent - onHoldPercent);

  // Circumference for r=36 is 2 * PI * 36 = 226.2
  const c = 226.2;
  const activeStroke = (activePercent / 100) * c;
  const onHoldStroke = (onHoldPercent / 100) * c;
  const completedStroke = (completedPercent / 100) * c;

  const activeOffset = 0;
  const onHoldOffset = -activeStroke;
  const completedOffset = -(activeStroke + onHoldStroke);

  return (
    <EmployeeShell activeRoute="/employee/projects">
      <div className="tf-proj-page">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="tf-proj-toast">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ====================================================================
            1. PAGE HEADER (Title + Subtitle + Export Button)
            ==================================================================== */}
        <header className="tf-proj-header">
          <div className="tf-proj-title-group">
            <h1>My Projects</h1>
            <p>Projects where you are a member or have been assigned.</p>
          </div>

          <button
            type="button"
            className="tf-proj-export-btn"
            onClick={handleExportList}
          >
            <Download size={15} />
            <span>Export List</span>
            <ArrowRight size={14} />
          </button>
        </header>

        {/* ====================================================================
            2. TOP 4 METRIC KPI STAT CARDS
            ==================================================================== */}
        <section className="tf-proj-stats-grid">
          {/* 1. Total Projects */}
          <div
            className={`tf-proj-stat-card ${activeFilter === "All" ? "selected" : ""}`}
            onClick={() => setActiveFilter("All")}
          >
            <div className="tf-proj-stat-icon blue">
              <Folder size={22} fill="#3B82F6" color="#3B82F6" />
            </div>
            <div className="tf-proj-stat-body">
              <span className="tf-proj-stat-label">Total Projects</span>
              <div className="tf-proj-stat-val-row">
                <strong className="tf-proj-stat-value">{stats.total}</strong>
              </div>
              <span className="tf-proj-stat-sub">
                🗂 {stats.active} active • {stats.completed} completed
              </span>
            </div>
          </div>

          {/* 2. Active Projects */}
          <div
            className={`tf-proj-stat-card ${activeFilter === "Active" ? "selected" : ""}`}
            onClick={() => setActiveFilter("Active")}
          >
            <div className="tf-proj-stat-icon green">
              <div className="tf-proj-play-circle">
                <Play size={13} fill="#10B981" color="#10B981" />
              </div>
            </div>
            <div className="tf-proj-stat-body">
              <span className="tf-proj-stat-label">Active Projects</span>
              <div className="tf-proj-stat-val-row">
                <strong className="tf-proj-stat-value">{stats.active}</strong>
                <span className="tf-proj-stat-badge positive">↑ 0%</span>
              </div>
              <span className="tf-proj-stat-sub">You are working on</span>
            </div>
          </div>

          {/* 3. On Hold */}
          <div
            className={`tf-proj-stat-card ${activeFilter === "On Hold" ? "selected" : ""}`}
            onClick={() => setActiveFilter("On Hold")}
          >
            <div className="tf-proj-stat-icon orange">
              <Clock size={20} color="#F59E0B" strokeWidth={2.4} />
            </div>
            <div className="tf-proj-stat-body">
              <span className="tf-proj-stat-label">On Hold</span>
              <div className="tf-proj-stat-val-row">
                <strong className="tf-proj-stat-value">{stats.onHold}</strong>
              </div>
              <span className="tf-proj-stat-sub">Currently paused</span>
            </div>
          </div>

          {/* 4. Completed */}
          <div
            className={`tf-proj-stat-card ${activeFilter === "Completed" ? "selected" : ""}`}
            onClick={() => setActiveFilter("Completed")}
          >
            <div className="tf-proj-stat-icon purple">
              <div className="tf-proj-check-circle">
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              </div>
            </div>
            <div className="tf-proj-stat-body">
              <span className="tf-proj-stat-label">Completed</span>
              <div className="tf-proj-stat-val-row">
                <strong className="tf-proj-stat-value">{stats.completed}</strong>
              </div>
              <span className="tf-proj-stat-sub">Great progress!</span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. FILTER PILLS & CONTROLS ROW
            ==================================================================== */}
        <section className="tf-proj-controls-row">
          {/* Left: Filter Pills */}
          <div className="tf-proj-filter-pills">
            <button
              type="button"
              className={`tf-proj-pill ${activeFilter === "All" ? "active" : ""}`}
              onClick={() => setActiveFilter("All")}
            >
              All ({stats.total})
            </button>
            <button
              type="button"
              className={`tf-proj-pill ${activeFilter === "Active" ? "active" : ""}`}
              onClick={() => setActiveFilter("Active")}
            >
              Active ({stats.active})
            </button>
            <button
              type="button"
              className={`tf-proj-pill ${activeFilter === "On Hold" ? "active" : ""}`}
              onClick={() => setActiveFilter("On Hold")}
            >
              On Hold ({stats.onHold})
            </button>
            <button
              type="button"
              className={`tf-proj-pill ${activeFilter === "Completed" ? "active" : ""}`}
              onClick={() => setActiveFilter("Completed")}
            >
              Completed ({stats.completed})
            </button>
          </div>

          {/* Right: Search, Status Dropdown, Sort Dropdown */}
          <div className="tf-proj-actions-group">
            {/* Search Input */}
            <div className="tf-proj-search-box">
              <Search size={15} className="tf-proj-search-icon" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="tf-proj-search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="tf-proj-dropdown-wrap" ref={statusRef}>
              <button
                type="button"
                className="tf-proj-dropdown-btn"
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              >
                <span>{statusFilter === "All" ? "Status" : statusFilter}</span>
                <ChevronDown size={14} className={statusDropdownOpen ? "open" : ""} />
              </button>

              {statusDropdownOpen && (
                <div className="tf-proj-dropdown-menu">
                  <button
                    type="button"
                    className={statusFilter === "All" ? "active" : ""}
                    onClick={() => {
                      setStatusFilter("All");
                      setStatusDropdownOpen(false);
                    }}
                  >
                    All Statuses
                  </button>
                  <button
                    type="button"
                    className={statusFilter === "Active" ? "active" : ""}
                    onClick={() => {
                      setStatusFilter("Active");
                      setStatusDropdownOpen(false);
                    }}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    className={statusFilter === "On Hold" ? "active" : ""}
                    onClick={() => {
                      setStatusFilter("On Hold");
                      setStatusDropdownOpen(false);
                    }}
                  >
                    On Hold
                  </button>
                  <button
                    type="button"
                    className={statusFilter === "Completed" ? "active" : ""}
                    onClick={() => {
                      setStatusFilter("Completed");
                      setStatusDropdownOpen(false);
                    }}
                  >
                    Completed
                  </button>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="tf-proj-dropdown-wrap" ref={sortRef}>
              <button
                type="button"
                className="tf-proj-dropdown-btn"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              >
                <ArrowUpDown size={14} />
                <span>Sort by</span>
                <ChevronDown size={14} className={sortDropdownOpen ? "open" : ""} />
              </button>

              {sortDropdownOpen && (
                <div className="tf-proj-dropdown-menu">
                  <button
                    type="button"
                    className={sortBy === "default" ? "active" : ""}
                    onClick={() => {
                      setSortBy("default");
                      setSortDropdownOpen(false);
                    }}
                  >
                    Default Order
                  </button>
                  <button
                    type="button"
                    className={sortBy === "name" ? "active" : ""}
                    onClick={() => {
                      setSortBy("name");
                      setSortDropdownOpen(false);
                    }}
                  >
                    Name (A - Z)
                  </button>
                  <button
                    type="button"
                    className={sortBy === "progress-high" ? "active" : ""}
                    onClick={() => {
                      setSortBy("progress-high");
                      setSortDropdownOpen(false);
                    }}
                  >
                    Progress (High to Low)
                  </button>
                  <button
                    type="button"
                    className={sortBy === "progress-low" ? "active" : ""}
                    onClick={() => {
                      setSortBy("progress-low");
                      setSortDropdownOpen(false);
                    }}
                  >
                    Progress (Low to High)
                  </button>
                  <button
                    type="button"
                    className={sortBy === "date" ? "active" : ""}
                    onClick={() => {
                      setSortBy("date");
                      setSortDropdownOpen(false);
                    }}
                  >
                    Start Date
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. TWO-COLUMN MAIN CONTENT (Left 70% | Right 30%)
            ==================================================================== */}
        <div className="tf-proj-content-layout">
          {/* ---------------------------------------------------------------
              LEFT COLUMN: 2x2 Project Cards + My Tasks in Projects Table
              --------------------------------------------------------------- */}
          <div className="tf-proj-left-col">
            {/* 2x2 Project Cards Grid */}
            <div className="tf-proj-cards-grid">
              {filteredProjects.map((proj) => {
                const statusSlug = (proj?.status || "Active").toLowerCase().replace(" ", "-");
                const membersList = Array.isArray(proj?.members) ? proj.members : [];

                return (
                  <article key={proj?.id} className="tf-proj-card">
                    {/* Card Header: Icon, Title, Status Badge, More Menu */}
                    <div className="tf-proj-card-top">
                      <div className="tf-proj-card-left-header">
                        <div className={`tf-proj-card-icon-box ${proj?.iconBg || "purple"}`}>
                          {renderProjectIcon(proj?.icon)}
                        </div>
                        <div className="tf-proj-card-heading">
                          <h3>{proj?.name}</h3>
                        </div>
                      </div>

                      <div className="tf-proj-card-right-header">
                        {/* Static Read-Only Status Badge (Managed by Team Lead / Admin) */}
                        <span className={`tf-proj-status-badge ${statusSlug}`} title="Project status is managed by Team Lead / Admin">
                          {proj?.status}
                        </span>

                        {/* Three-dots menu */}
                        <div className="tf-proj-action-menu-wrap">
                          <button
                            type="button"
                            className="tf-proj-more-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuOpenId(actionMenuOpenId === proj?.id ? null : proj?.id);
                            }}
                            aria-label="Project actions"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {actionMenuOpenId === proj?.id && (
                            <div className="tf-proj-action-popover" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProject(proj);
                                  setActionMenuOpenId(null);
                                }}
                              >
                                <ExternalLink size={14} />
                                <span>View Details</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="tf-proj-description">{proj?.description}</p>

                    {/* Tags: Category, Date, Team */}
                    <div className="tf-proj-tags-row">
                      <span className="tf-proj-tag">
                        <span className="tf-proj-tag-icon">⬡</span>
                        {proj?.category}
                      </span>
                      <span className="tf-proj-tag">
                        <Calendar size={13} />
                        {proj?.dateRange}
                      </span>
                      <span className="tf-proj-tag">
                        <Users size={13} />
                        {proj?.teamSize}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="tf-proj-progress-section">
                      <div className="tf-proj-progress-labels">
                        <span>Progress</span>
                        <strong className="tf-proj-progress-percent">{proj?.progress ?? 0}%</strong>
                      </div>
                      <div className="tf-proj-progress-track">
                        <div
                          className={`tf-proj-progress-fill ${proj?.barColor || "green"}`}
                          style={{ width: `${proj?.progress ?? 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer: Avatars + "Open Project ->" */}
                    <div className="tf-proj-card-footer">
                      <div className="tf-proj-avatars-group">
                        {membersList.map((mem, mIdx) => (
                          <img
                            key={mem?.id || mIdx}
                            src={mem?.avatar || memberAvatars[mIdx % memberAvatars.length]}
                            alt={mem?.name || "Member"}
                            className="tf-proj-avatar"
                            title={mem?.name || "Member"}
                          />
                        ))}
                        {proj?.moreMembers && (
                          <div className="tf-proj-avatar-more">
                            {proj.moreMembers}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        className="tf-proj-open-btn"
                        onClick={() => setSelectedProject(proj)}
                      >
                        <span>Open Project</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Empty state if search finds nothing */}
            {filteredProjects.length === 0 && (
              <div className="tf-proj-empty-box">
                <Folder size={40} color="#94A3B8" />
                <h3>No projects match your filter</h3>
                <p>Try clearing your search query or switching tabs.</p>
                <button
                  type="button"
                  className="tf-proj-clear-btn"
                  onClick={() => {
                    setActiveFilter("All");
                    setStatusFilter("All");
                    setSearchQuery("");
                  }}
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* -------------------------------------------------------------
                My Tasks in Projects Table
                ------------------------------------------------------------- */}
            <section className="tf-proj-tasks-table-card">
              <div className="tf-proj-card-header">
                <div className="tf-proj-table-title-group">
                  <div className="tf-proj-table-icon-box">
                    <CheckSquare size={16} color="#2563EB" />
                  </div>
                  <h2>My Tasks in Projects</h2>
                </div>

                <Link to="/employee/tasks" className="tf-proj-view-all-link">
                  View all <ArrowRight size={14} />
                </Link>
              </div>

              <div className="tf-proj-table-responsive">
                <table className="tf-proj-table">
                  <thead>
                    <tr>
                      <th>Task Name</th>
                      <th>Project</th>
                      <th>Due Date</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectTasks.map((t) => {
                      const statusSlug = (t?.status || "To Do").toLowerCase().replace(" ", "-");
                      const prioritySlug = (t?.priority || "Medium").toLowerCase();

                      return (
                        <tr key={t.id} className="tf-proj-table-row">
                          <td className="tf-proj-task-name">
                            <strong>{t?.name}</strong>
                          </td>
                          <td className="tf-proj-task-project">
                            <span>{t?.project}</span>
                          </td>
                          <td className="tf-proj-task-due">
                            <span className={t?.isDueToday ? "due-today" : ""}>
                              {t?.dueDate}
                            </span>
                          </td>
                          <td className="tf-proj-task-priority">
                            <span className={`tf-proj-priority-pill ${prioritySlug}`}>
                              <span className="dot" />
                              {t?.priority}
                            </span>
                          </td>
                          <td className="tf-proj-task-status">
                            <button
                              type="button"
                              className={`tf-proj-status-pill-btn ${statusSlug}`}
                              onClick={() => handleToggleTaskStatus(t.id)}
                              title="Click to advance status"
                            >
                              {t?.status}
                            </button>
                          </td>
                          <td className="tf-proj-task-actions text-right">
                            <button
                              type="button"
                              className="tf-proj-task-action-btn"
                              onClick={() => handleToggleTaskStatus(t.id)}
                              title="Toggle status"
                            >
                              <MoreVertical size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* ---------------------------------------------------------------
              RIGHT COLUMN: My Project Summary + Recent Project Activity
              --------------------------------------------------------------- */}
          <div className="tf-proj-right-col">
            {/* Card 1: My Project Summary */}
            <article className="tf-proj-sidebar-card tf-proj-summary-card">
              <div className="tf-proj-card-header">
                <div className="tf-proj-sidebar-card-title">
                  <PieChartIcon size={18} color="#2563EB" />
                  <h2>My Project Summary</h2>
                </div>
                <button
                  type="button"
                  className="tf-proj-card-more-btn"
                  onClick={() => showToast("Exporting project summary chart...")}
                  aria-label="Summary menu"
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Donut Chart with Center Number */}
              <div className="tf-proj-summary-body">
                <div className="tf-proj-donut-wrap">
                  <svg
                    className="tf-proj-donut-svg"
                    viewBox="0 0 100 100"
                    width="140"
                    height="140"
                  >
                    {/* Background ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#F1F5F9"
                      strokeWidth="11"
                    />

                    {/* Active slice (Green: 50%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#10B981"
                      strokeWidth="11"
                      strokeDasharray={`${activeStroke} ${c}`}
                      strokeDashoffset={activeOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />

                    {/* On Hold slice (Amber: 25%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#F59E0B"
                      strokeWidth="11"
                      strokeDasharray={`${onHoldStroke} ${c}`}
                      strokeDashoffset={onHoldOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />

                    {/* Completed slice (Purple: 25%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#8B5CF6"
                      strokeWidth="11"
                      strokeDasharray={`${completedStroke} ${c}`}
                      strokeDashoffset={completedOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>

                  {/* Centered Number */}
                  <div className="tf-proj-donut-center">
                    <span className="tf-proj-donut-number">{stats.total}</span>
                    <span className="tf-proj-donut-label">Projects</span>
                  </div>
                </div>

                {/* Legend on the right */}
                <div className="tf-proj-summary-legend">
                  <div
                    className="tf-proj-legend-row"
                    onClick={() => setActiveFilter("Active")}
                  >
                    <span className="tf-proj-legend-dot green" />
                    <span className="tf-proj-legend-text">
                      <strong>{stats.active}</strong> Active
                    </span>
                  </div>

                  <div
                    className="tf-proj-legend-row"
                    onClick={() => setActiveFilter("On Hold")}
                  >
                    <span className="tf-proj-legend-dot orange" />
                    <span className="tf-proj-legend-text">
                      <strong>{stats.onHold}</strong> On Hold
                    </span>
                  </div>

                  <div
                    className="tf-proj-legend-row"
                    onClick={() => setActiveFilter("Completed")}
                  >
                    <span className="tf-proj-legend-dot purple" />
                    <span className="tf-proj-legend-text">
                      <strong>{stats.completed}</strong> Completed
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 2: Recent Project Activity */}
            <article className="tf-proj-sidebar-card tf-proj-activity-card">
              <div className="tf-proj-card-header">
                <div className="tf-proj-sidebar-card-title">
                  <Clock3 size={18} color="#2563EB" />
                  <h2>Recent Project Activity</h2>
                </div>

                <Link to="/employee/settings?tab=activity" className="tf-proj-view-all-link">
                  View all <ArrowRight size={14} />
                </Link>
              </div>

              <div className="tf-proj-activity-list">
                {recentProjectActivities.map((act) => {
                  const Icon = act.icon;
                  return (
                    <div
                      key={act.id}
                      className="tf-proj-activity-item"
                      onClick={() => showToast(`Activity: ${act.boldText} for ${act.subText}`)}
                    >
                      <div className={`tf-proj-activity-icon-box ${act.iconBg}`}>
                        <Icon size={16} />
                      </div>

                      <div className="tf-proj-activity-content">
                        <strong className="tf-proj-activity-bold">{act.boldText}</strong>
                        <span className="tf-proj-activity-sub">{act.subText}</span>
                      </div>

                      <span className="tf-proj-activity-time">{act.time}</span>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </div>

        {/* ====================================================================
            5. PROJECT DETAILS MODAL / DRAWER
            ==================================================================== */}
        {selectedProject && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedProject(null);
            }}
          >
            <div className="tf-modal-card tf-proj-details-modal" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-group">
                  <div className={`tf-modal-icon-box ${selectedProject?.iconBg || "purple"}`}>
                    {renderProjectIcon(selectedProject?.icon)}
                  </div>
                  <div>
                    <h3>{selectedProject?.name}</h3>
                    <p>{selectedProject?.category} • {selectedProject?.dateRange}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setSelectedProject(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="tf-proj-modal-body">
                <div className="tf-proj-modal-desc-box">
                  <label>Description</label>
                  <p>{selectedProject?.description}</p>
                </div>

                {/* Status (Read-Only) */}
                <div className="tf-proj-modal-field">
                  <label>Status</label>
                  <div className="tf-proj-modal-status-readonly">
                    <span className={`tf-proj-status-badge ${(selectedProject?.status || "Active").toLowerCase().replace(" ", "-")}`}>
                      {selectedProject?.status}
                    </span>
                    <span className="tf-proj-readonly-hint">Read-only (Managed by Team Lead / Admin)</span>
                  </div>
                </div>

                {/* Progress Completion (Read-Only) */}
                <div className="tf-proj-modal-field">
                  <div className="tf-proj-modal-slider-header">
                    <label>Progress Completion</label>
                    <strong>{selectedProject?.progress ?? 0}%</strong>
                  </div>
                  <div className="tf-proj-progress-track">
                    <div
                      className={`tf-proj-progress-fill ${selectedProject?.barColor || "green"}`}
                      style={{ width: `${selectedProject?.progress ?? 0}%` }}
                    />
                  </div>
                </div>

                {/* Team Members List */}
                <div className="tf-proj-modal-field">
                  <label>Assigned Team ({selectedProject?.teamSize || "Team"})</label>
                  <div className="tf-proj-modal-members">
                    {(selectedProject?.members || []).map((m, idx) => (
                      <div key={m?.id || idx} className="tf-proj-modal-member-pill">
                        <img src={m?.avatar || memberAvatars[idx % memberAvatars.length]} alt={m?.name || "Member"} />
                        <span>{m?.name || "Member"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="tf-modal-actions">
                <button
                  type="button"
                  className="tf-btn-primary"
                  style={{ width: "100%" }}
                  onClick={() => setSelectedProject(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeShell>
  );
}

export default Projects;
