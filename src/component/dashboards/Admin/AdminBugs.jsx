import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bug,
  Search,
  Plus,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Play,
  Check,
  X,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  Layers,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminBugs.css";

const STORAGE_KEY = "teamflow_admin_bugs_v2";

const PROJECTS = ["All Projects", "Website Redesign", "Mobile App", "AI Integration", "Marketing Portal", "Internal Tools"];
const STATUSES = ["All Status", "Open", "In Progress", "Resolved", "Closed"];
const PRIORITIES = ["All Priority", "Critical", "High", "Medium", "Low"];
const ASSIGNEES = ["All Assignees", "Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Singh", "Vikram Reddy"];

const ASSIGNEE_META = {
  "Rahul Sharma": { initials: "RS", color: "#3b82f6", bg: "#eff6ff" },
  "Priya Patel": { initials: "PP", color: "#6366f1", bg: "#eef2ff" },
  "Amit Kumar": { initials: "AK", color: "#8b5cf6", bg: "#f5f3ff" },
  "Sneha Singh": { initials: "SS", color: "#ec4899", bg: "#fdf2f8" },
  "Vikram Reddy": { initials: "VR", color: "#ef4444", bg: "#fef2f2" },
};

// Initial base 10 matching Image 1
const BASE_BUGS = [
  { id: 1, bugCode: "BUG-001", title: "Login page error on mobile", project: "Website Redesign", priority: "High", status: "Open", assignee: "Rahul Sharma", created: "Oct 20, 2024", dueDate: "Oct 25, 2024", desc: "Mobile viewport renders distorted submit button on WebKit browsers." },
  { id: 2, bugCode: "BUG-002", title: "API timeout on data fetch", project: "Mobile App", priority: "Critical", status: "In Progress", assignee: "Priya Patel", created: "Oct 19, 2024", dueDate: "Oct 22, 2024", desc: "GraphQL gateway experiences 504 gateway timeout under concurrent websocket traffic." },
  { id: 3, bugCode: "BUG-003", title: "UI misalignment in dashboard", project: "AI Integration", priority: "Medium", status: "Open", assignee: "Amit Kumar", created: "Oct 18, 2024", dueDate: "Oct 24, 2024", desc: "Metrics widget overlaps with side navigation rail in 1366px screen resolution." },
  { id: 4, bugCode: "BUG-004", title: "Email notification not working", project: "Marketing Portal", priority: "High", status: "In Progress", assignee: "Sneha Singh", created: "Oct 17, 2024", dueDate: "Oct 20, 2024", desc: "SES relay fails to transmit digest email for accounts with custom subdomains." },
  { id: 5, bugCode: "BUG-005", title: "File upload fails for large files", project: "Internal Tools", priority: "Medium", status: "Resolved", assignee: "Vikram Reddy", created: "Oct 16, 2024", dueDate: "Oct 19, 2024", desc: "S3 multipart upload buffer memory exceeded for payload sizes greater than 50MB." },
  { id: 6, bugCode: "BUG-006", title: "Calendar event not syncing", project: "Mobile App", priority: "Low", status: "Closed", assignee: "Rahul Sharma", created: "Oct 15, 2024", dueDate: "Oct 18, 2024", desc: "Offline background sync job did not restart when device reconnects to Wi-Fi." },
  { id: 7, bugCode: "BUG-007", title: "Task assignment bug", project: "Website Redesign", priority: "High", status: "Open", assignee: "Priya Patel", created: "Oct 14, 2024", dueDate: "-", desc: "Reassigning sprint tasks throws uncaught validation TypeError in client." },
  { id: 8, bugCode: "BUG-008", title: "Search not returning results", project: "AI Integration", priority: "Medium", status: "In Progress", assignee: "Amit Kumar", created: "Oct 13, 2024", dueDate: "-", desc: "Elasticsearch index was not re-synced after workspace renaming." },
  { id: 9, bugCode: "BUG-009", title: "Profile image not updating", project: "Mobile App", priority: "Low", status: "Resolved", assignee: "Sneha Singh", created: "Oct 12, 2024", dueDate: "-", desc: "CDN avatar cache misses cache-invalidation webhook upon image upload." },
  { id: 10, bugCode: "BUG-010", title: "Report export fails", project: "Internal Tools", priority: "Critical", status: "Open", assignee: "Vikram Reddy", created: "Oct 11, 2024", dueDate: "-", desc: "Exporting raw PDF dataset triggers memory heap out-of-bounds error." },
];

// Generate total 86 bugs with the exact breakdown: 24 Open, 32 In Progress, 20 Resolved, 10 Closed
function generateFullBugDataset() {
  const full = [...BASE_BUGS];
  const projects = ["Website Redesign", "Mobile App", "AI Integration", "Marketing Portal", "Internal Tools"];
  const assignees = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Singh", "Vikram Reddy"];
  const titles = [
    "WebSocket disconnect loop on idle tab",
    "Pagination resets to page 1 on search clear",
    "Dark mode contrast ratio failure in table head",
    "Stripe invoice webhook signature verification",
    "Role permissions not updating without hard refresh",
    "Export CSV quotes missing on comma strings",
    "Markdown editor code block syntax parsing",
    "Kanban card drag position flicker",
    "Audit log timestamp missing timezone offset",
    "Memory leak in telemetry streaming hook",
    "SSO SAML identity provider redirect timeout",
    "Custom domain SSL certificate validation delay",
    "Notification bell unread count badge stale",
    "Session expiration dialog loop in modal",
    "File preview spinner never dismisses on 404",
  ];

  // Current counts in BASE_BUGS: Open: 4, In Progress: 3, Resolved: 2, Closed: 1 (Total: 10)
  // Needed: 20 Open, 29 In Progress, 18 Resolved, 9 Closed (Total 76)
  const remainingTargets = [
    ...Array(20).fill({ status: "Open", priority: "High" }),
    ...Array(29).fill({ status: "In Progress", priority: "Medium" }),
    ...Array(18).fill({ status: "Resolved", priority: "Low" }),
    ...Array(9).fill({ status: "Closed", priority: "Critical" }),
  ];

  remainingTargets.forEach((target, index) => {
    const num = index + 11;
    const bugCode = `BUG-${String(num).padStart(3, "0")}`;
    const project = projects[num % projects.length];
    const assignee = assignees[num % assignees.length];
    const title = titles[num % titles.length] + ` #${num}`;
    const day = (num % 28) + 1;
    full.push({
      id: num,
      bugCode,
      title,
      project,
      priority: target.priority,
      status: target.status,
      assignee,
      created: `Oct ${Math.max(1, day - 4)}, 2024`,
      dueDate: num % 3 === 0 ? `Oct ${day}, 2024` : "-",
      desc: "Reported telemetry exception in engineering monitoring service.",
    });
  });

  return full;
}

const RECENT_ACTIVITIES = [
  { id: 1, user: "Rahul Sharma", initials: "RS", color: "#3b82f6", bg: "#eff6ff", action: "Updated bug status to Resolved", time: "2 minutes ago" },
  { id: 2, user: "Priya Patel", initials: "PP", color: "#6366f1", bg: "#eef2ff", action: "Commented on BUG-002", time: "15 minutes ago" },
  { id: 3, user: "Amit Kumar", initials: "AK", color: "#8b5cf6", bg: "#f5f3ff", action: "Assigned bug to Sneha Singh", time: "1 hour ago" },
  { id: 4, user: "Sneha Singh", initials: "SS", color: "#ec4899", bg: "#fdf2f8", action: "Created a new bug BUG-004", time: "3 hours ago" },
  { id: 5, user: "Vikram Reddy", initials: "VR", color: "#ef4444", bg: "#fef2f2", action: "Updated priority to High", time: "5 hours ago" },
];

export default function AdminBugs() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Bugs State with LocalStorage
  const [bugs, setBugs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return generateFullBugDataset();
  });

  // Filters State
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [assigneeFilter, setAssigneeFilter] = useState("All Assignees");
  const [search, setSearch] = useState("");

  // Selection & Pagination
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Active Menu / Modals
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [viewingBug, setViewingBug] = useState(null);
  const [editingBug, setEditingBug] = useState(null);
  const [bugToDelete, setBugToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: "",
    project: "Website Redesign",
    priority: "High",
    status: "Open",
    assignee: "Rahul Sharma",
    dueDate: "2024-10-30",
    desc: "",
  });

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const saveBugs = (newBugs) => {
    setBugs(newBugs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBugs));
    } catch (e) {}
  };

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".bugs-action-menu-wrap")) {
        setActiveMenuId(null);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Filtered bugs
  const filteredBugs = useMemo(() => {
    return bugs.filter((b) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        b.bugCode.toLowerCase().includes(term) ||
        b.title.toLowerCase().includes(term) ||
        b.project.toLowerCase().includes(term) ||
        b.assignee.toLowerCase().includes(term);

      const matchesProject = projectFilter === "All Projects" || b.project === projectFilter;
      const matchesStatus = statusFilter === "All Status" || b.status === statusFilter;
      const matchesPriority = priorityFilter === "All Priority" || b.priority === priorityFilter;
      const matchesAssignee = assigneeFilter === "All Assignees" || b.assignee === assigneeFilter;

      return matchesSearch && matchesProject && matchesStatus && matchesPriority && matchesAssignee;
    });
  }, [bugs, search, projectFilter, statusFilter, priorityFilter, assigneeFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredBugs.length / perPage));
  const paginatedBugs = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredBugs.slice(start, start + perPage);
  }, [filteredBugs, currentPage, perPage]);

  // Overall Statistics from current bugs database
  const stats = useMemo(() => {
    const total = bugs.length;
    const open = bugs.filter((b) => b.status === "Open").length;
    const inProgress = bugs.filter((b) => b.status === "In Progress").length;
    const resolved = bugs.filter((b) => b.status === "Resolved").length;
    const closed = bugs.filter((b) => b.status === "Closed").length;

    const critical = bugs.filter((b) => b.priority === "Critical").length;
    const high = bugs.filter((b) => b.priority === "High").length;
    const medium = bugs.filter((b) => b.priority === "Medium").length;
    const low = bugs.filter((b) => b.priority === "Low").length;

    return {
      total,
      open,
      openPct: Math.round((open / total) * 100) || 0,
      inProgress,
      inProgressPct: Math.round((inProgress / total) * 100) || 0,
      resolved,
      resolvedPct: Math.round((resolved / total) * 100) || 0,
      closed,
      closedPct: Math.round((closed / total) * 100) || 0,
      criticalPct: Math.round((critical / total) * 100) || 18,
      highPct: Math.round((high / total) * 100) || 32,
      mediumPct: Math.round((medium / total) * 100) || 35,
      lowPct: Math.round((low / total) * 100) || 15,
    };
  }, [bugs]);

  // Select all / toggle
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedBugs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedBugs.map((b) => b.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // CSV Export
  const exportCSV = () => {
    const headers = ["Bug Code", "Title", "Project", "Priority", "Status", "Assignee", "Created Date", "Due Date"];
    const rows = filteredBugs.map((b) => [
      b.bugCode,
      `"${b.title}"`,
      `"${b.project}"`,
      b.priority,
      b.status,
      `"${b.assignee}"`,
      b.created,
      b.dueDate,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TeamFlow_Bugs_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Exported bugs dataset to CSV.");
  };

  // Form Submit (Create / Edit)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast("Bug title is required.", "error");
      return;
    }

    if (editingBug) {
      const updated = bugs.map((b) =>
        b.id === editingBug.id
          ? {
              ...b,
              title: form.title,
              project: form.project,
              priority: form.priority,
              status: form.status,
              assignee: form.assignee,
              dueDate: form.dueDate || "-",
              desc: form.desc,
            }
          : b
      );
      saveBugs(updated);
      setEditingBug(null);
      showToast(`Updated bug ticket "${editingBug.bugCode}".`);
    } else {
      const nextNum = bugs.length + 1;
      const newBug = {
        id: Date.now(),
        bugCode: `BUG-${String(nextNum).padStart(3, "0")}`,
        title: form.title,
        project: form.project,
        priority: form.priority,
        status: form.status || "Open",
        assignee: form.assignee,
        created: "Oct 24, 2024",
        dueDate: form.dueDate || "-",
        desc: form.desc || "Newly reported defect.",
      };
      saveBugs([newBug, ...bugs]);
      showToast(`Reported new bug "${newBug.bugCode}".`);
    }

    setShowCreateModal(false);
  };

  const openCreateModal = () => {
    setEditingBug(null);
    setForm({
      title: "",
      project: "Website Redesign",
      priority: "High",
      status: "Open",
      assignee: "Rahul Sharma",
      dueDate: "2024-10-30",
      desc: "",
    });
    setShowCreateModal(true);
  };

  const openEditModal = (b) => {
    setEditingBug(b);
    setForm({
      title: b.title,
      project: b.project,
      priority: b.priority,
      status: b.status,
      assignee: b.assignee,
      dueDate: b.dueDate === "-" ? "" : b.dueDate,
      desc: b.desc || "",
    });
    setShowCreateModal(true);
    setActiveMenuId(null);
  };

  const markResolved = (id) => {
    const updated = bugs.map((b) => (b.id === id ? { ...b, status: "Resolved" } : b));
    saveBugs(updated);
    showToast("Bug marked as Resolved.");
    setActiveMenuId(null);
  };

  // Donut SVG circumference calculation for Bug Overview
  const donutR = 46;
  const donutC = 2 * Math.PI * donutR; // ~289.02
  const pOpen = (stats.open / stats.total) * donutC;
  const pInProg = (stats.inProgress / stats.total) * donutC;
  const pResolved = (stats.resolved / stats.total) * donutC;
  const pClosed = (stats.closed / stats.total) * donutC;

  return (
    <div className="tfBugsApp">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="tfBugsApp__container">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        {toast && (
          <div className={`tfBugsToast toast--${toast.type}`}>
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        <main className="tfBugsApp__content">
          {/* =========================================================
              HEADER SECTION
          ========================================================= */}
          <section className="tfBugsHeader">
            <div className="tfBugsHeader__left">
              <div className="tfBugsHeader__iconBox">
                <Bug size={24} />
              </div>
              <div className="tfBugsHeader__titleGroup">
                <h1>Bugs</h1>
                <p>Track, manage, and resolve issues across all projects in your organization.</p>
              </div>
            </div>

            <div className="tfBugsHeader__actions">
              <button type="button" className="tfBugsBtn tfBugsBtn--secondary" onClick={exportCSV}>
                <Download size={15} />
                <span>Export</span>
              </button>

              <button
                type="button"
                className="tfBugsBtn tfBugsBtn--secondary"
                onClick={() => {
                  setProjectFilter("All Projects");
                  setStatusFilter("All Status");
                  setPriorityFilter("All Priority");
                  setAssigneeFilter("All Assignees");
                  setSearch("");
                }}
              >
                <SlidersHorizontal size={15} />
                <span>Filters</span>
              </button>

              <button type="button" className="tfBugsBtn tfBugsBtn--primary" onClick={openCreateModal}>
                <Plus size={16} />
                <span>Report Bug</span>
              </button>
            </div>
          </section>

          {/* =========================================================
              ROW 1: 4 TOP KPI METRIC CARDS WITH SPARKLINES
          ========================================================= */}
          <section className="tfBugsKpiGrid">
            {/* 1. TOTAL BUGS */}
            <article className="tfBugsKpiCard">
              <div className="tfBugsKpiCard__left">
                <div className="tfBugsKpiIconBox tfBugsKpiIconBox--red">
                  <Bug size={20} />
                </div>
                <div className="tfBugsKpiMeta">
                  <div className="val-row">
                    <strong>{stats.total}</strong>
                    <span className="trend-text text-green">
                      <TrendingUp size={11} /> 8%
                    </span>
                  </div>
                  <span className="kpi-label">Total Bugs</span>
                </div>
              </div>
              {/* Red Sparkline */}
              <div className="tfBugsKpiSpark">
                <svg viewBox="0 0 90 34" preserveAspectRatio="none">
                  <path d="M 0 26 C 20 26, 35 18, 55 22 C 75 25, 85 10, 90 6" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            </article>

            {/* 2. OPEN */}
            <article className="tfBugsKpiCard">
              <div className="tfBugsKpiCard__left">
                <div className="tfBugsKpiIconBox tfBugsKpiIconBox--amber">
                  <Clock size={20} />
                </div>
                <div className="tfBugsKpiMeta">
                  <div className="val-row">
                    <strong>{stats.open}</strong>
                    <span className="trend-text text-green">
                      <TrendingUp size={11} /> 12%
                    </span>
                  </div>
                  <span className="kpi-label">Open</span>
                </div>
              </div>
              {/* Amber Sparkline */}
              <div className="tfBugsKpiSpark">
                <svg viewBox="0 0 90 34" preserveAspectRatio="none">
                  <path d="M 0 28 C 20 28, 30 20, 50 22 C 70 24, 80 12, 90 8" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            </article>

            {/* 3. IN PROGRESS */}
            <article className="tfBugsKpiCard">
              <div className="tfBugsKpiCard__left">
                <div className="tfBugsKpiIconBox tfBugsKpiIconBox--blue">
                  <Play size={20} />
                </div>
                <div className="tfBugsKpiMeta">
                  <div className="val-row">
                    <strong>{stats.inProgress}</strong>
                    <span className="trend-text text-green">
                      <TrendingUp size={11} /> 5%
                    </span>
                  </div>
                  <span className="kpi-label">In Progress</span>
                </div>
              </div>
              {/* Blue Sparkline */}
              <div className="tfBugsKpiSpark">
                <svg viewBox="0 0 90 34" preserveAspectRatio="none">
                  <path d="M 0 28 C 25 28, 40 22, 60 18 C 75 16, 85 8, 90 4" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            </article>

            {/* 4. RESOLVED */}
            <article className="tfBugsKpiCard">
              <div className="tfBugsKpiCard__left">
                <div className="tfBugsKpiIconBox tfBugsKpiIconBox--green">
                  <CheckCircle2 size={20} />
                </div>
                <div className="tfBugsKpiMeta">
                  <div className="val-row">
                    <strong>{stats.resolved}</strong>
                    <span className="trend-text text-green">
                      <TrendingUp size={11} /> 25%
                    </span>
                  </div>
                  <span className="kpi-label">Resolved</span>
                </div>
              </div>
              {/* Green Sparkline */}
              <div className="tfBugsKpiSpark">
                <svg viewBox="0 0 90 34" preserveAspectRatio="none">
                  <path d="M 0 28 C 20 28, 40 24, 60 16 C 75 10, 85 14, 90 6" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            </article>
          </section>

          {/* =========================================================
              MAIN CONTENT SPLIT: TABLE (LEFT) + 3 SIDEBAR WIDGETS (RIGHT)
          ========================================================= */}
          <div className="tfBugsMainSplit">
            {/* LEFT / CENTER: TABLE & TOOLBAR */}
            <div className="tfBugsTableSection">
              {/* TOOLBAR DROPDOWNS & SEARCH */}
              <div className="tfBugsToolbar">
                <div className="tfBugsToolbar__dropdowns">
                  {/* Projects */}
                  <div className="tfBugsSelectWrapper">
                    <Calendar size={13} className="select-icon" />
                    <select
                      value={projectFilter}
                      onChange={(e) => {
                        setProjectFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      {PROJECTS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="chevron" />
                  </div>

                  {/* Status */}
                  <div className="tfBugsSelectWrapper">
                    <CheckCircle2 size={13} className="select-icon" />
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="chevron" />
                  </div>

                  {/* Priority */}
                  <div className="tfBugsSelectWrapper">
                    <AlertTriangle size={13} className="select-icon" />
                    <select
                      value={priorityFilter}
                      onChange={(e) => {
                        setPriorityFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      {PRIORITIES.map((pr) => (
                        <option key={pr} value={pr}>{pr}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="chevron" />
                  </div>

                  {/* Assignees */}
                  <div className="tfBugsSelectWrapper">
                    <User size={13} className="select-icon" />
                    <select
                      value={assigneeFilter}
                      onChange={(e) => {
                        setAssigneeFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      {ASSIGNEES.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="chevron" />
                  </div>
                </div>

                {/* Search Input */}
                <div className="tfBugsSearch">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search bugs..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  {search && (
                    <button type="button" className="search-clear" onClick={() => setSearch("")}>
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* BUGS DATA TABLE */}
              <div className="tfBugsTableCard">
                <div className="tfBugsTableWrap">
                  <table className="tfBugsTable">
                    <thead>
                      <tr>
                        <th style={{ width: 38, textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={paginatedBugs.length > 0 && selectedIds.length === paginatedBugs.length}
                            onChange={toggleSelectAll}
                            aria-label="Select all bugs on this page"
                          />
                        </th>
                        <th style={{ width: 85 }}>#</th>
                        <th>Title</th>
                        <th>Project</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Assignee</th>
                        <th>Created</th>
                        <th>Due Date</th>
                        <th style={{ width: 44, textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBugs.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="empty-table-cell">
                            No bug tickets match your query.
                          </td>
                        </tr>
                      ) : (
                        paginatedBugs.map((b) => {
                          const isSelected = selectedIds.includes(b.id);
                          const assigneeMeta = ASSIGNEE_META[b.assignee] || { initials: "US", color: "#64748b", bg: "#f1f5f9" };
                          const isMenuOpen = activeMenuId === b.id;

                          return (
                            <tr key={b.id} className={isSelected ? "row-selected" : ""}>
                              <td style={{ textAlign: "center" }}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectOne(b.id)}
                                  aria-label={`Select ${b.bugCode}`}
                                />
                              </td>
                              <td className="bug-code-cell">{b.bugCode}</td>
                              <td className="bug-title-cell">
                                <span className="title-text" onClick={() => setViewingBug(b)}>
                                  {b.title}
                                </span>
                              </td>
                              <td className="text-muted">{b.project}</td>
                              <td>
                                <span className={`priority-pill priority-${b.priority.toLowerCase()}`}>
                                  {b.priority}
                                </span>
                              </td>
                              <td>
                                <span className={`status-pill status-${b.status.toLowerCase().replace(/\s+/g, "-")}`}>
                                  {b.status}
                                </span>
                              </td>
                              <td>
                                <div className="assignee-cell">
                                  <span
                                    className="assignee-avatar-chip"
                                    style={{ backgroundColor: assigneeMeta.bg, color: assigneeMeta.color }}
                                  >
                                    {assigneeMeta.initials}
                                  </span>
                                  <span className="assignee-name">{b.assignee}</span>
                                </div>
                              </td>
                              <td className="text-muted">{b.created}</td>
                              <td>
                                <span className={b.dueDate !== "-" ? "due-date-highlight" : "text-muted"}>
                                  {b.dueDate}
                                </span>
                              </td>
                              <td style={{ textAlign: "center" }}>
                                <div className="bugs-action-menu-wrap">
                                  <button
                                    type="button"
                                    className="menu-trigger-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMenuId(isMenuOpen ? null : b.id);
                                    }}
                                  >
                                    <MoreHorizontal size={15} />
                                  </button>

                                  {isMenuOpen && (
                                    <div className="bugs-action-dropdown">
                                      <button type="button" onClick={() => { setViewingBug(b); setActiveMenuId(null); }}>
                                        <Eye size={13} /> View Details
                                      </button>
                                      <button type="button" onClick={() => openEditModal(b)}>
                                        <Pencil size={13} /> Edit Bug
                                      </button>
                                      {b.status !== "Resolved" && (
                                        <button type="button" onClick={() => markResolved(b.id)}>
                                          <Check size={13} /> Mark Resolved
                                        </button>
                                      )}
                                      <button type="button" className="danger-item" onClick={() => { setBugToDelete(b); setActiveMenuId(null); }}>
                                        <Trash2 size={13} /> Delete Bug
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* TABLE FOOTER / PAGINATION BAR */}
                <div className="tfBugsPagination">
                  <div className="pagination-info">
                    Showing {(currentPage - 1) * perPage + 1} to{" "}
                    {Math.min(currentPage * perPage, filteredBugs.length)} of {filteredBugs.length} bugs
                  </div>

                  <div className="pagination-pages">
                    <button
                      type="button"
                      className="nav-arrow"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft size={14} />
                    </button>

                    {[1, 2, 3, 4, 5].map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        className={`page-pill ${currentPage === pageNum ? "active" : ""}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <span className="ellipsis">...</span>

                    <button
                      type="button"
                      className={`page-pill ${currentPage === 9 ? "active" : ""}`}
                      onClick={() => setCurrentPage(9)}
                    >
                      9
                    </button>

                    <button
                      type="button"
                      className="nav-arrow"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="pagination-rows-select">
                    <label>Rows per page</label>
                    <select
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR: 3 ANALYTICAL WIDGETS */}
            <aside className="tfBugsSidebar">
              {/* WIDGET 1: BUG OVERVIEW (DONUT) */}
              <div className="tfBugsWidgetCard">
                <h3>Bug Overview</h3>

                <div className="tfBugsOverviewBody">
                  <div className="donut-wrapper">
                    <svg viewBox="0 0 120 120" className="donut-svg">
                      <circle cx="60" cy="60" r={donutR} fill="none" stroke="var(--border-color, #f1f5f9)" strokeWidth="14" />
                      {/* Closed: purple */}
                      <circle
                        cx="60" cy="60" r={donutR} fill="none" stroke="#8b5cf6" strokeWidth="14"
                        strokeDasharray={`${pClosed} ${donutC - pClosed}`}
                        strokeDashoffset={-(pOpen + pInProg + pResolved)}
                        transform="rotate(-90 60 60)"
                      />
                      {/* Resolved: green */}
                      <circle
                        cx="60" cy="60" r={donutR} fill="none" stroke="#10b981" strokeWidth="14"
                        strokeDasharray={`${pResolved} ${donutC - pResolved}`}
                        strokeDashoffset={-(pOpen + pInProg)}
                        transform="rotate(-90 60 60)"
                      />
                      {/* In Progress: blue */}
                      <circle
                        cx="60" cy="60" r={donutR} fill="none" stroke="#0ea5e9" strokeWidth="14"
                        strokeDasharray={`${pInProg} ${donutC - pInProg}`}
                        strokeDashoffset={-pOpen}
                        transform="rotate(-90 60 60)"
                      />
                      {/* Open: red */}
                      <circle
                        cx="60" cy="60" r={donutR} fill="none" stroke="#ef4444" strokeWidth="14"
                        strokeDasharray={`${pOpen} ${donutC - pOpen}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div className="donut-center-num">
                      <strong>{stats.total}</strong>
                      <span>Total</span>
                    </div>
                  </div>

                  <div className="donut-legend">
                    <div className="legend-row">
                      <span className="dot dot-red" />
                      <span className="name">Open</span>
                      <strong className="val">{stats.open} ({stats.openPct}%)</strong>
                    </div>
                    <div className="legend-row">
                      <span className="dot dot-blue" />
                      <span className="name">In Progress</span>
                      <strong className="val">{stats.inProgress} ({stats.inProgressPct}%)</strong>
                    </div>
                    <div className="legend-row">
                      <span className="dot dot-green" />
                      <span className="name">Resolved</span>
                      <strong className="val">{stats.resolved} ({stats.resolvedPct}%)</strong>
                    </div>
                    <div className="legend-row">
                      <span className="dot dot-purple" />
                      <span className="name">Closed</span>
                      <strong className="val">{stats.closed} ({stats.closedPct}%)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* WIDGET 2: PRIORITY DISTRIBUTION */}
              <div className="tfBugsWidgetCard">
                <h3>Priority Distribution</h3>
                <div className="priority-bars-list">
                  <div className="priority-bar-row">
                    <span className="p-label">Critical</span>
                    <div className="p-rail">
                      <div className="p-fill fill-red" style={{ width: `${stats.criticalPct}%` }} />
                    </div>
                    <span className="p-pct">{stats.criticalPct}%</span>
                  </div>

                  <div className="priority-bar-row">
                    <span className="p-label">High</span>
                    <div className="p-rail">
                      <div className="p-fill fill-orange" style={{ width: `${stats.highPct}%` }} />
                    </div>
                    <span className="p-pct">{stats.highPct}%</span>
                  </div>

                  <div className="priority-bar-row">
                    <span className="p-label">Medium</span>
                    <div className="p-rail">
                      <div className="p-fill fill-blue" style={{ width: `${stats.mediumPct}%` }} />
                    </div>
                    <span className="p-pct">{stats.mediumPct}%</span>
                  </div>

                  <div className="priority-bar-row">
                    <span className="p-label">Low</span>
                    <div className="p-rail">
                      <div className="p-fill fill-purple" style={{ width: `${stats.lowPct}%` }} />
                    </div>
                    <span className="p-pct">{stats.lowPct}%</span>
                  </div>
                </div>
              </div>

              {/* WIDGET 3: RECENT ACTIVITY */}
              <div className="tfBugsWidgetCard">
                <div className="widget-header-row">
                  <h3>Recent Activity</h3>
                  <button type="button" className="view-all-link" onClick={() => navigate("/admin/activity-logs")}>
                    View all <ArrowRight size={11} />
                  </button>
                </div>

                <div className="recent-activity-list">
                  {RECENT_ACTIVITIES.map((act) => (
                    <div key={act.id} className="activity-item">
                      <span
                        className="act-avatar"
                        style={{ backgroundColor: act.bg, color: act.color }}
                      >
                        {act.initials}
                      </span>
                      <div className="act-details">
                        <div className="act-top">
                          <strong>{act.user}</strong>
                          <small>{act.time}</small>
                        </div>
                        <p>{act.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* =========================================================
          CREATE / EDIT BUG MODAL
      ========================================================= */}
      {showCreateModal && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowCreateModal(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <h2>{editingBug ? `Edit Bug Ticket (${editingBug.bugCode})` : "Report New Bug"}</h2>
              <button type="button" className="modal-close" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-group">
                <label>Bug Title <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Navigation drawer frozen on iPad view"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Project</label>
                  <select
                    value={form.project}
                    onChange={(e) => setForm({ ...form, project: e.target.value })}
                  >
                    {PROJECTS.filter((p) => p !== "All Projects").map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Assignee</label>
                  <select
                    value={form.assignee}
                    onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                  >
                    {ASSIGNEES.filter((a) => a !== "All Assignees").map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Technical Description & Reproduction Steps</label>
                <textarea
                  rows={3}
                  placeholder="Describe the regression, client environment, and logs..."
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingBug ? "Save Changes" : "Submit Bug Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW BUG DETAILS MODAL
      ========================================================= */}
      {viewingBug && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setViewingBug(null); }}>
          <div className="modal-box view-bug-modal">
            <div className="modal-header">
              <div className="view-bug-header-tags">
                <span className="bug-code-badge">{viewingBug.bugCode}</span>
                <span className={`priority-pill priority-${viewingBug.priority.toLowerCase()}`}>{viewingBug.priority}</span>
                <span className={`status-pill status-${viewingBug.status.toLowerCase().replace(/\s+/g, "-")}`}>{viewingBug.status}</span>
              </div>
              <button type="button" className="modal-close" onClick={() => setViewingBug(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="view-bug-content">
              <h2>{viewingBug.title}</h2>
              <p className="view-bug-desc">{viewingBug.desc}</p>

              <div className="view-bug-meta-grid">
                <div className="meta-card">
                  <span>Project</span>
                  <strong>{viewingBug.project}</strong>
                </div>
                <div className="meta-card">
                  <span>Assignee</span>
                  <strong>{viewingBug.assignee}</strong>
                </div>
                <div className="meta-card">
                  <span>Created Date</span>
                  <strong>{viewingBug.created}</strong>
                </div>
                <div className="meta-card">
                  <span>Target Due Date</span>
                  <strong className={viewingBug.dueDate !== "-" ? "due-date-highlight" : ""}>{viewingBug.dueDate}</strong>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setViewingBug(null)}>
                Close
              </button>
              <button
                type="button"
                className="btn-submit"
                onClick={() => {
                  const b = viewingBug;
                  setViewingBug(null);
                  openEditModal(b);
                }}
              >
                Edit Bug
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          DELETE CONFIRMATION MODAL
      ========================================================= */}
      {bugToDelete && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setBugToDelete(null); }}>
          <div className="modal-box delete-confirm-modal">
            <div className="delete-modal-icon">
              <Trash2 size={24} />
            </div>
            <h2>Delete Bug Ticket?</h2>
            <p>
              Are you sure you want to delete <strong>"{bugToDelete.bugCode}: {bugToDelete.title}"</strong>?
              This action will permanently remove it from tracking logs.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setBugToDelete(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => {
                  saveBugs(bugs.filter((b) => b.id !== bugToDelete.id));
                  setBugToDelete(null);
                  showToast(`Bug ticket ${bugToDelete.bugCode} deleted.`);
                }}
              >
                Delete Bug
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
