// src/component/dashboards/Admin/AdminAnnouncements.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Megaphone,
  Search,
  Plus,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Copy,
  X,
  Users,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Pin,
  Calendar,
  Grid2X2,
  List,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Sparkles,
  Wrench,
  ShieldCheck,
  Smartphone,
  Box,
  FileText,
  CreditCard,
  BarChart3,
  TrendingUp,
  Bold,
  Italic,
  ListFilter,
  Link2,
  Check,
  Send,
  Building2,
  Layers,
  HelpCircle,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import {
  initialAnnouncements,
  QUICK_TEMPLATES,
  RECENT_ACTIVITIES,
} from "./adminAnnouncementsData.js";
import "./AdminAnnouncements.css";

const STORAGE_KEY = "teamflow_admin_announcements_v2";

const AUDIENCES = [
  "All Users",
  "Admins",
  "Workspace Owners",
  "Paid Users",
  "Engineering",
  "Product & Design",
];

const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const WORKSPACES = [
  "All Workspaces",
  "TeamFlow Workspace",
  "Development Hub",
  "Design Studio",
  "Marketing Team",
];

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return initialAnnouncements;
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  // Filters & Controls
  const [search, setSearch] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [workspaceFilter, setWorkspaceFilter] = useState("All");
  const [sortOption, setSortOption] = useState("date-desc");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'cards'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals & Popups
  const [viewingItem, setViewingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Create / Edit Form State
  const formRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    audience: "All Users",
    priority: "Medium",
    workspace: "All Workspaces",
    pinned: false,
    category: "general",
    status: "Published",
  });

  // Save to LocalStorage
  const saveAnnouncements = (newItems) => {
    setAnnouncements(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.error(e);
    }
  };

  // Toast handler
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Derived Stats
  const stats = useMemo(() => {
    const total = announcements.length;
    const pinned = announcements.filter((a) => a.pinned).length;
    const urgent = announcements.filter((a) => a.priority === "Urgent").length;
    const reach = 342; // Organization reach
    return { total, pinned, urgent, reach };
  }, [announcements]);

  // Filtered & Sorted Announcements
  const filteredAnnouncements = useMemo(() => {
    const priorityRanks = { Urgent: 4, High: 3, Medium: 2, Low: 1 };

    const list = announcements.filter((item) => {
      const term = search.trim().toLowerCase();
      const matchSearch =
        !term ||
        item.title?.toLowerCase().includes(term) ||
        item.content?.toLowerCase().includes(term) ||
        item.id?.toLowerCase().includes(term);

      const matchAudience =
        audienceFilter === "All" || item.audience === audienceFilter;
      const matchPriority =
        priorityFilter === "All" || item.priority === priorityFilter;
      const matchWorkspace =
        workspaceFilter === "All" ||
        item.workspace === workspaceFilter ||
        item.workspace === "All Workspaces";

      return matchSearch && matchAudience && matchPriority && matchWorkspace;
    });

    const [key, dir] = sortOption.split("-");
    list.sort((a, b) => {
      if (key === "date") {
        const valA = new Date(a.date).getTime() || 0;
        const valB = new Date(b.date).getTime() || 0;
        return dir === "asc" ? valA - valB : valB - valA;
      }
      if (key === "priority") {
        const rankA = priorityRanks[a.priority] || 0;
        const rankB = priorityRanks[b.priority] || 0;
        return dir === "asc" ? rankA - rankB : rankB - rankA;
      }
      if (key === "title") {
        return dir === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (key === "pinned") {
        const pA = a.pinned ? 1 : 0;
        const pB = b.pinned ? 1 : 0;
        return dir === "asc" ? pA - pB : pB - pA;
      }
      return 0;
    });

    return list;
  }, [
    announcements,
    search,
    audienceFilter,
    priorityFilter,
    workspaceFilter,
    sortOption,
  ]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredAnnouncements.length / perPage));
  const paginatedAnnouncements = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredAnnouncements.slice(start, start + perPage);
  }, [filteredAnnouncements, currentPage, perPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, audienceFilter, priorityFilter, workspaceFilter, perPage]);

  // Toggle Single Pin
  const togglePin = (id) => {
    const updated = announcements.map((a) =>
      a.id === id ? { ...a, pinned: !a.pinned } : a
    );
    saveAnnouncements(updated);
    const item = announcements.find((a) => a.id === id);
    showToast(
      item?.pinned
        ? `Unpinned "${item.title}"`
        : `Pinned "${item.title}" to top`
    );
  };

  // Duplicate Item
  const handleDuplicate = (item) => {
    const newItem = {
      ...item,
      id: `ANN-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${item.title} (Copy)`,
      pinned: false,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      views: 0,
      status: "Draft",
    };
    saveAnnouncements([newItem, ...announcements]);
    showToast(`Duplicated "${item.title}" as draft.`);
  };

  // Start Editing Action
  const handleStartEdit = (item) => {
    setIsEditing(true);
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      content: item.content || "",
      audience: item.audience || "All Users",
      priority: item.priority || "Medium",
      workspace: item.workspace || "All Workspaces",
      pinned: Boolean(item.pinned),
      category: item.category || "general",
      status: item.status || "Published",
    });

    // Scroll smoothly to form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    showToast(`Loaded "${item.title}" into editor.`);
  };

  // Cancel Edit Action
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({
      title: "",
      content: "",
      audience: "All Users",
      priority: "Medium",
      workspace: "All Workspaces",
      pinned: false,
      category: "general",
      status: "Published",
    });
    showToast("Cancelled edit mode.");
  };

  // Apply Quick Template
  const handleApplyTemplate = (tmpl) => {
    setForm({
      title: tmpl.title,
      content: tmpl.content,
      audience: tmpl.audience,
      priority: tmpl.priority,
      workspace: tmpl.workspace || "All Workspaces",
      pinned: tmpl.pinned,
      category: tmpl.category,
      status: "Published",
    });
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    showToast(`Applied "${tmpl.label}" template.`);
  };

  // Insert Markdown Formatter into Content
  const handleFormatContent = (tag) => {
    if (tag === "bold") {
      setForm((prev) => ({
        ...prev,
        content: prev.content ? `${prev.content} **bold text**` : "**bold text**",
      }));
    } else if (tag === "italic") {
      setForm((prev) => ({
        ...prev,
        content: prev.content ? `${prev.content} *italic text*` : "*italic text*",
      }));
    } else if (tag === "list") {
      setForm((prev) => ({
        ...prev,
        content: prev.content ? `${prev.content}\n- Bullet point` : "- Bullet point",
      }));
    } else if (tag === "link") {
      setForm((prev) => ({
        ...prev,
        content: prev.content
          ? `${prev.content} [link title](https://)`
          : "[link title](https://)",
      }));
    }
  };

  // Submit Form (Create or Save Edit)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast("Please enter an announcement title.", "error");
      return;
    }
    if (!form.content.trim()) {
      showToast("Please enter announcement message content.", "error");
      return;
    }

    if (isEditing && editingId) {
      // Update existing
      const updated = announcements.map((a) => {
        if (a.id === editingId) {
          return {
            ...a,
            ...form,
          };
        }
        return a;
      });
      saveAnnouncements(updated);
      showToast("Announcement updated successfully.");
      handleCancelEdit();
    } else {
      // Create new
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newItem = {
        id: `ANN-${Math.floor(1000 + Math.random() * 9000)}`,
        ...form,
        author: "Himanshu R",
        authorAvatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
        date: dateStr,
        time: timeStr,
        views: 0,
      };

      saveAnnouncements([newItem, ...announcements]);
      showToast("Announcement broadcasted successfully.");
      setForm({
        title: "",
        content: "",
        audience: "All Users",
        priority: "Medium",
        workspace: "All Workspaces",
        pinned: false,
        category: "general",
        status: "Published",
      });
    }
  };

  // Delete Handlers
  const promptDelete = (item) => {
    setDeletingItem(item);
  };

  const confirmDelete = () => {
    if (!deletingItem) return;
    const remaining = announcements.filter((a) => a.id !== deletingItem.id);
    saveAnnouncements(remaining);
    showToast(`Deleted "${deletingItem.title}".`);
    setDeletingItem(null);
    if (isEditing && editingId === deletingItem.id) {
      handleCancelEdit();
    }
  };

  // Selection Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedAnnouncements.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Bulk Actions
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const remaining = announcements.filter((a) => !selectedIds.includes(a.id));
    saveAnnouncements(remaining);
    showToast(`Deleted ${selectedIds.length} announcements.`);
    setSelectedIds([]);
  };

  const handleBulkPin = (pinState) => {
    if (selectedIds.length === 0) return;
    const updated = announcements.map((a) =>
      selectedIds.includes(a.id) ? { ...a, pinned: pinState } : a
    );
    saveAnnouncements(updated);
    showToast(
      `${pinState ? "Pinned" : "Unpinned"} ${selectedIds.length} announcements.`
    );
    setSelectedIds([]);
  };

  // Category Icon Renderer
  const renderCategoryIcon = (category) => {
    switch (category) {
      case "maintenance":
        return <Wrench size={16} className="ann-cat-icon maintenance" />;
      case "feature":
        return <Sparkles size={16} className="ann-cat-icon feature" />;
      case "security":
        return <ShieldCheck size={16} className="ann-cat-icon security" />;
      case "mobile":
        return <Smartphone size={16} className="ann-cat-icon mobile" />;
      case "workspace":
        return <Box size={16} className="ann-cat-icon workspace" />;
      case "policy":
        return <FileText size={16} className="ann-cat-icon policy" />;
      case "billing":
        return <CreditCard size={16} className="ann-cat-icon billing" />;
      default:
        return <Megaphone size={16} className="ann-cat-icon general" />;
    }
  };

  // Priority Pill Renderer
  const renderPriorityBadge = (priority) => {
    const p = (priority || "Medium").toLowerCase();
    return (
      <span className={`ann-priority-pill priority-${p}`}>
        <span className="priority-dot" />
        {priority}
      </span>
    );
  };

  // Status Pill Renderer
  const renderStatusBadge = (status) => {
    const s = (status || "Published").toLowerCase();
    return <span className={`ann-status-pill status-${s}`}>{status}</span>;
  };

  return (
    <div className="admin-ann-app">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="admin-ann-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        {/* TOAST MESSAGE */}
        {toast && (
          <div className={`admin-ann-toast ${toast.type}`}>
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        <main className="admin-ann-content">
          {/* HEADER SECTION */}
          <section className="admin-ann-header">
            <div className="admin-ann-header-left">
              <div className="admin-ann-header-icon-box">
                <Megaphone size={22} />
              </div>
              <div>
                <h1>Broadcast Announcements</h1>
                <p>
                  Share important updates, company news, maintenance notices,
                  and policy alerts across your organization.
                </p>
              </div>
            </div>

            <div className="admin-ann-header-actions">
              <button
                type="button"
                className="ann-btn-secondary"
                onClick={() => setShowAnalyticsModal(true)}
              >
                <BarChart3 size={15} />
                <span>View Analytics</span>
              </button>
              <button
                type="button"
                className="ann-btn-primary"
                onClick={() => {
                  handleCancelEdit();
                  if (formRef.current) {
                    formRef.current.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                <Plus size={16} />
                <span>Post Announcement</span>
              </button>
            </div>
          </section>

          {/* 4 KPI METRIC CARDS WITH SPARKLINES */}
          <section className="admin-ann-stats-grid">
            {/* 1. Total Announcements */}
            <div className="ann-stat-card">
              <div className="ann-stat-top">
                <div className="ann-stat-icon-wrapper purple">
                  <Megaphone size={20} />
                </div>
                <div className="ann-stat-text">
                  <span className="ann-stat-label">Total Announcements</span>
                  <div className="ann-stat-val-row">
                    <strong className="ann-stat-value">{stats.total}</strong>
                    <span className="ann-stat-trend text-green">
                      <TrendingUp size={12} />
                      ↑ 20%
                    </span>
                  </div>
                  <small className="ann-stat-sub">+2 this month</small>
                </div>
              </div>
              <div className="ann-sparkline-wrap">
                <svg viewBox="0 0 100 28" className="ann-sparkline purple">
                  <path
                    d="M0,22 Q25,25 45,14 T80,8 T100,2"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* 2. Pinned Announcements */}
            <div className="ann-stat-card">
              <div className="ann-stat-top">
                <div className="ann-stat-icon-wrapper blue">
                  <Pin size={20} />
                </div>
                <div className="ann-stat-text">
                  <span className="ann-stat-label">Pinned Announcements</span>
                  <div className="ann-stat-val-row">
                    <strong className="ann-stat-value">{stats.pinned}</strong>
                    <span className="ann-stat-trend text-green">
                      <TrendingUp size={12} />
                      ↑ 50%
                    </span>
                  </div>
                  <small className="ann-stat-sub">+1 this month</small>
                </div>
              </div>
              <div className="ann-sparkline-wrap">
                <svg viewBox="0 0 100 28" className="ann-sparkline blue">
                  <path
                    d="M0,24 Q30,22 55,12 T85,6 T100,2"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* 3. Urgent Alerts */}
            <div className="ann-stat-card">
              <div className="ann-stat-top">
                <div className="ann-stat-icon-wrapper red">
                  <AlertTriangle size={20} />
                </div>
                <div className="ann-stat-text">
                  <span className="ann-stat-label">Urgent Alerts</span>
                  <div className="ann-stat-val-row">
                    <strong className="ann-stat-value">{stats.urgent}</strong>
                    <span className="ann-stat-trend text-green">
                      <TrendingUp size={12} />
                      ↑ 100%
                    </span>
                  </div>
                  <small className="ann-stat-sub">+2 this month</small>
                </div>
              </div>
              <div className="ann-sparkline-wrap">
                <svg viewBox="0 0 100 28" className="ann-sparkline red">
                  <path
                    d="M0,25 Q30,24 60,16 T85,10 T100,4"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* 4. Total Audience Reach */}
            <div className="ann-stat-card">
              <div className="ann-stat-top">
                <div className="ann-stat-icon-wrapper teal">
                  <Users size={20} />
                </div>
                <div className="ann-stat-text">
                  <span className="ann-stat-label">Total Audience Reach</span>
                  <div className="ann-stat-val-row">
                    <strong className="ann-stat-value">{stats.reach}</strong>
                    <span className="ann-stat-trend text-green">
                      <TrendingUp size={12} />
                      ↑ 35%
                    </span>
                  </div>
                  <small className="ann-stat-sub">Across all workspaces</small>
                </div>
              </div>
              <div className="ann-sparkline-wrap">
                <svg viewBox="0 0 100 28" className="ann-sparkline teal">
                  <path
                    d="M0,24 Q25,22 50,15 T80,10 T100,3"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </section>

          {/* FILTER & SEARCH TOOLBAR */}
          <section className="admin-ann-toolbar-card">
            <div className="ann-search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search announcements by title, content, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearch("")}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="ann-filter-controls">
              {/* Audience Dropdown */}
              <select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                className="ann-filter-select"
                aria-label="Filter by audience"
              >
                <option value="All">All Audiences</option>
                {AUDIENCES.map((aud) => (
                  <option key={aud} value={aud}>
                    {aud}
                  </option>
                ))}
              </select>

              {/* Priority Dropdown */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="ann-filter-select"
                aria-label="Filter by priority"
              >
                <option value="All">All Priorities</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {/* Workspaces Dropdown */}
              <select
                value={workspaceFilter}
                onChange={(e) => setWorkspaceFilter(e.target.value)}
                className="ann-filter-select"
                aria-label="Filter by workspace"
              >
                {WORKSPACES.map((ws) => (
                  <option key={ws} value={ws}>
                    {ws}
                  </option>
                ))}
              </select>

              {/* Sort Dropdown */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="ann-filter-select sort-select"
                aria-label="Sort announcements"
              >
                <option value="date-desc">Sort: Date (Newest)</option>
                <option value="date-asc">Sort: Date (Oldest)</option>
                <option value="priority-desc">Sort: Priority (Urgent First)</option>
                <option value="title-asc">Sort: Title (A to Z)</option>
                <option value="pinned-desc">Sort: Pinned First</option>
              </select>

              {/* View Switch */}
              <div className="ann-view-toggle">
                <button
                  type="button"
                  className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
                  onClick={() => setViewMode("table")}
                  title="List Table View"
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn ${viewMode === "cards" ? "active" : ""}`}
                  onClick={() => setViewMode("cards")}
                  title="Cards Grid View"
                >
                  <Grid2X2 size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* BULK ACTIONS BAR (When items are selected) */}
          {selectedIds.length > 0 && (
            <div className="ann-bulk-actions-bar">
              <span className="bulk-count">
                <strong>{selectedIds.length}</strong> announcements selected
              </span>
              <div className="bulk-btn-group">
                <button
                  type="button"
                  className="bulk-btn"
                  onClick={() => handleBulkPin(true)}
                >
                  <Pin size={13} />
                  <span>Pin Selected</span>
                </button>
                <button
                  type="button"
                  className="bulk-btn"
                  onClick={() => handleBulkPin(false)}
                >
                  <RotateCcw size={13} />
                  <span>Unpin Selected</span>
                </button>
                <button
                  type="button"
                  className="bulk-btn danger"
                  onClick={handleBulkDelete}
                >
                  <Trash2 size={13} />
                  <span>Delete Selected</span>
                </button>
                <button
                  type="button"
                  className="bulk-btn-close"
                  onClick={() => setSelectedIds([])}
                  title="Clear selection"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* MAIN 2-COLUMN LAYOUT: TABLE ON LEFT, SIDEBAR ON RIGHT */}
          <div className="admin-ann-grid-layout">
            {/* LEFT COLUMN: TABLE OR CARDS */}
            <div className="admin-ann-left-column">
              {viewMode === "table" ? (
                <div className="ann-table-card">
                  <div className="ann-table-responsive">
                    <table className="ann-data-table">
                      <thead>
                        <tr>
                          <th style={{ width: 44, textAlign: "center" }}>
                            <input
                              type="checkbox"
                              className="ann-checkbox"
                              checked={
                                paginatedAnnouncements.length > 0 &&
                                paginatedAnnouncements.every((a) =>
                                  selectedIds.includes(a.id)
                                )
                              }
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th>ANNOUNCEMENT</th>
                          <th>AUDIENCE</th>
                          <th>PRIORITY</th>
                          <th style={{ textAlign: "center" }}>PINNED</th>
                          <th>AUTHOR</th>
                          <th>DATE</th>
                          <th>STATUS</th>
                          <th style={{ textAlign: "right" }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedAnnouncements.map((a) => {
                          const isSelected = selectedIds.includes(a.id);
                          const isCurrentEditing = isEditing && editingId === a.id;
                          return (
                            <tr
                              key={a.id}
                              className={`${a.pinned ? "row-pinned" : ""} ${
                                isSelected ? "row-selected" : ""
                              } ${isCurrentEditing ? "row-editing" : ""}`}
                            >
                              <td style={{ textAlign: "center" }}>
                                <input
                                  type="checkbox"
                                  className="ann-checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleSelect(a.id)}
                                />
                              </td>

                              {/* ANNOUNCEMENT (ICON + TITLE + SNIPPET) */}
                              <td>
                                <div className="ann-cell-main">
                                  <div
                                    className={`ann-category-icon-box ${a.category || "general"}`}
                                  >
                                    {renderCategoryIcon(a.category)}
                                  </div>
                                  <div className="ann-title-wrap">
                                    <strong
                                      className="ann-title-text"
                                      onClick={() => setViewingItem(a)}
                                      title={a.title}
                                    >
                                      {a.title}
                                    </strong>
                                    <p className="ann-snippet-text">
                                      {a.content}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* AUDIENCE */}
                              <td>
                                <span className="ann-audience-badge">
                                  {a.audience}
                                </span>
                              </td>

                              {/* PRIORITY */}
                              <td>{renderPriorityBadge(a.priority)}</td>

                              {/* PINNED (CLICKABLE) */}
                              <td style={{ textAlign: "center" }}>
                                <button
                                  type="button"
                                  className={`ann-pin-btn ${a.pinned ? "is-pinned" : ""}`}
                                  onClick={() => togglePin(a.id)}
                                  title={
                                    a.pinned
                                      ? "Pinned to top. Click to unpin."
                                      : "Click to pin to top."
                                  }
                                >
                                  <Pin size={15} />
                                </button>
                              </td>

                              {/* AUTHOR */}
                              <td>
                                <div className="ann-author-cell">
                                  {a.authorAvatar ? (
                                    <img
                                      src={a.authorAvatar}
                                      alt={a.author}
                                      className="ann-author-avatar"
                                    />
                                  ) : (
                                    <div className="ann-author-initials">
                                      {a.author
                                        ? a.author
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                        : "HR"}
                                    </div>
                                  )}
                                  <span className="ann-author-name">
                                    {a.author || "Himanshu R"}
                                  </span>
                                </div>
                              </td>

                              {/* DATE */}
                              <td>
                                <div className="ann-date-cell">
                                  <span className="date-day">
                                    {a.date || "Oct 27, 2026"}
                                  </span>
                                  <span className="date-time">
                                    {a.time || "10:30 AM"}
                                  </span>
                                </div>
                              </td>

                              {/* STATUS */}
                              <td>{renderStatusBadge(a.status)}</td>

                              {/* ACTIONS */}
                              <td style={{ textAlign: "right" }}>
                                <div className="ann-actions-group">
                                  {/* View */}
                                  <button
                                    type="button"
                                    className="ann-action-btn view"
                                    onClick={() => setViewingItem(a)}
                                    title="View Announcement Details"
                                  >
                                    <Eye size={14} />
                                  </button>

                                  {/* Edit */}
                                  <button
                                    type="button"
                                    className={`ann-action-btn edit ${
                                      isCurrentEditing ? "active" : ""
                                    }`}
                                    onClick={() => handleStartEdit(a)}
                                    title="Edit announcement"
                                  >
                                    <Pencil size={14} />
                                  </button>

                                  {/* Duplicate */}
                                  <button
                                    type="button"
                                    className="ann-action-btn copy"
                                    onClick={() => handleDuplicate(a)}
                                    title="Duplicate announcement"
                                  >
                                    <Copy size={14} />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    type="button"
                                    className="ann-action-btn delete"
                                    onClick={() => promptDelete(a)}
                                    title="Delete announcement"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {filteredAnnouncements.length === 0 && (
                    <div className="ann-empty-state">
                      <Megaphone size={42} className="empty-icon" />
                      <h3>No Announcements Found</h3>
                      <p>
                        No announcements matched your search or filters. Try
                        clearing filters or creating a new post.
                      </p>
                      <button
                        type="button"
                        className="ann-btn-secondary"
                        onClick={() => {
                          setSearch("");
                          setAudienceFilter("All");
                          setPriorityFilter("All");
                          setWorkspaceFilter("All");
                        }}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* CARDS / FEED VIEW */
                <div className="ann-cards-grid">
                  {paginatedAnnouncements.map((a) => {
                    const isCurrentEditing = isEditing && editingId === a.id;
                    return (
                      <div
                        key={a.id}
                        className={`ann-feed-card ${a.pinned ? "pinned" : ""} ${
                          isCurrentEditing ? "editing" : ""
                        }`}
                      >
                        <div className="feed-card-header">
                          <div className="feed-card-header-left">
                            <div
                              className={`ann-category-icon-box sm ${
                                a.category || "general"
                              }`}
                            >
                              {renderCategoryIcon(a.category)}
                            </div>
                            <div>
                              <strong
                                className="feed-card-title"
                                onClick={() => setViewingItem(a)}
                              >
                                {a.title}
                              </strong>
                              <span className="feed-card-meta">
                                {a.date} • {a.time}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className={`ann-pin-btn ${a.pinned ? "is-pinned" : ""}`}
                            onClick={() => togglePin(a.id)}
                            title={a.pinned ? "Pinned" : "Pin"}
                          >
                            <Pin size={15} />
                          </button>
                        </div>

                        <p className="feed-card-body">{a.content}</p>

                        <div className="feed-card-pills-row">
                          <span className="ann-audience-badge">{a.audience}</span>
                          {renderPriorityBadge(a.priority)}
                          {renderStatusBadge(a.status)}
                        </div>

                        <div className="feed-card-footer">
                          <div className="ann-author-cell">
                            {a.authorAvatar ? (
                              <img
                                src={a.authorAvatar}
                                alt={a.author}
                                className="ann-author-avatar"
                              />
                            ) : (
                              <div className="ann-author-initials">HR</div>
                            )}
                            <span className="ann-author-name">
                              {a.author || "Himanshu R"}
                            </span>
                          </div>

                          <div className="ann-actions-group">
                            <button
                              type="button"
                              className="ann-action-btn view"
                              onClick={() => setViewingItem(a)}
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              className="ann-action-btn edit"
                              onClick={() => handleStartEdit(a)}
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              className="ann-action-btn copy"
                              onClick={() => handleDuplicate(a)}
                              title="Duplicate"
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              type="button"
                              className="ann-action-btn delete"
                              onClick={() => promptDelete(a)}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PAGINATION FOOTER */}
              <div className="ann-pagination-bar">
                <div className="ann-pagination-count">
                  Showing{" "}
                  <strong>
                    {filteredAnnouncements.length === 0
                      ? 0
                      : (currentPage - 1) * perPage + 1}
                  </strong>{" "}
                  -{" "}
                  <strong>
                    {Math.min(currentPage * perPage, filteredAnnouncements.length)}
                  </strong>{" "}
                  of <strong>{filteredAnnouncements.length}</strong> announcements
                </div>

                <div className="ann-pagination-per-page">
                  <label>Rows per page:</label>
                  <select
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                  </select>
                </div>

                <div className="ann-pagination-controls">
                  {/* First */}
                  <button
                    type="button"
                    className="ann-page-btn"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(1)}
                    title="First page"
                  >
                    <ChevronsLeft size={14} />
                  </button>
                  {/* Prev */}
                  <button
                    type="button"
                    className="ann-page-btn"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    title="Previous page"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`ann-page-number ${
                        currentPage === num ? "active" : ""
                      }`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    type="button"
                    className="ann-page-btn"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    title="Next page"
                  >
                    <ChevronRight size={14} />
                  </button>
                  {/* Last */}
                  <button
                    type="button"
                    className="ann-page-btn"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    title="Last page"
                  >
                    <ChevronsRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SIDEBAR PANELS */}
            <div className="admin-ann-right-column">
              {/* 1. CREATE / EDIT FORM CARD */}
              <div
                className={`ann-form-card ${isEditing ? "is-editing-mode" : ""}`}
                ref={formRef}
              >
                <div className="ann-form-header">
                  <div className="ann-form-header-left">
                    <div
                      className={`ann-form-icon-circle ${
                        isEditing ? "editing" : ""
                      }`}
                    >
                      {isEditing ? <Pencil size={18} /> : <Megaphone size={18} />}
                    </div>
                    <div>
                      <h3>
                        {isEditing ? "Edit Announcement" : "Create Announcement"}
                      </h3>
                      <p>
                        {isEditing
                          ? `Updating notice #${editingId}`
                          : "Share updates with your organization"}
                      </p>
                    </div>
                  </div>

                  {isEditing && (
                    <button
                      type="button"
                      className="ann-btn-cancel-edit-sm"
                      onClick={handleCancelEdit}
                      title="Cancel edit"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {isEditing && (
                  <div className="ann-editing-banner">
                    <span className="editing-pill">Active Editing</span>
                    <button
                      type="button"
                      className="editing-cancel-link"
                      onClick={handleCancelEdit}
                    >
                      Cancel Edit
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmitForm} className="ann-form-body">
                  {/* Title Field */}
                  <div className="ann-field-group">
                    <label>
                      Title <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter announcement title"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Content Field + Formatting Toolbar */}
                  <div className="ann-field-group">
                    <div className="content-label-row">
                      <label>
                        Content <span className="req">*</span>
                      </label>
                      <div className="mini-format-toolbar">
                        <button
                          type="button"
                          onClick={() => handleFormatContent("bold")}
                          title="Bold"
                        >
                          <Bold size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatContent("italic")}
                          title="Italic"
                        >
                          <Italic size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatContent("list")}
                          title="Bullet list"
                        >
                          <ListFilter size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFormatContent("link")}
                          title="Add Link"
                        >
                          <Link2 size={12} />
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Write your announcement here..."
                      value={form.content}
                      onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Audience & Priority Row */}
                  <div className="ann-field-row">
                    <div className="ann-field-group half">
                      <label>
                        Audience <span className="req">*</span>
                      </label>
                      <select
                        value={form.audience}
                        onChange={(e) =>
                          setForm({ ...form, audience: e.target.value })
                        }
                      >
                        {AUDIENCES.map((aud) => (
                          <option key={aud} value={aud}>
                            {aud}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="ann-field-group half">
                      <label>Priority</label>
                      <select
                        value={form.priority}
                        onChange={(e) =>
                          setForm({ ...form, priority: e.target.value })
                        }
                      >
                        <option value="Low">🔵 Low</option>
                        <option value="Medium">🟡 Medium</option>
                        <option value="High">🔴 High</option>
                        <option value="Urgent">🚨 Urgent</option>
                      </select>
                    </div>
                  </div>

                  {/* Workspace Optional Field */}
                  <div className="ann-field-group">
                    <label>Workspace (Optional)</label>
                    <select
                      value={form.workspace}
                      onChange={(e) =>
                        setForm({ ...form, workspace: e.target.value })
                      }
                    >
                      {WORKSPACES.map((ws) => (
                        <option key={ws} value={ws}>
                          {ws}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pin Toggle Switch */}
                  <div className="ann-switch-row">
                    <label className="ann-switch-container">
                      <input
                        type="checkbox"
                        checked={form.pinned}
                        onChange={(e) =>
                          setForm({ ...form, pinned: e.target.checked })
                        }
                      />
                      <span className="ann-switch-slider" />
                    </label>
                    <div className="ann-switch-text">
                      <span className="switch-title">
                        Pin this announcement
                      </span>
                      <small className="switch-desc">
                        Keep at the top for important notices
                      </small>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="ann-form-actions-row">
                    {isEditing && (
                      <button
                        type="button"
                        className="ann-btn-cancel-edit"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className={`ann-btn-submit-post ${
                        isEditing ? "editing" : ""
                      }`}
                    >
                      {isEditing ? (
                        <>
                          <Check size={16} />
                          <span>Save Changes</span>
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>Post Announcement</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* 2. QUICK TEMPLATES CARD */}
              <div className="ann-sidebar-card">
                <div className="ann-sidebar-card-header">
                  <div className="sidebar-card-title-group">
                    <Megaphone size={16} className="text-purple" />
                    <div>
                      <h4>Quick Templates</h4>
                      <small>Use pre-defined templates</small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="sidebar-view-all-link"
                    onClick={() => handleApplyTemplate(QUICK_TEMPLATES[0])}
                  >
                    View All &gt;
                  </button>
                </div>

                <div className="ann-templates-grid">
                  {QUICK_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      className="ann-template-pill"
                      onClick={() => handleApplyTemplate(tmpl)}
                      title={`Load ${tmpl.label}`}
                    >
                      {tmpl.id === "maintenance" && <Wrench size={13} />}
                      {tmpl.id === "feature" && <Sparkles size={13} />}
                      {tmpl.id === "policy" && <ShieldCheck size={13} />}
                      {tmpl.id === "general" && <FileText size={13} />}
                      <span>{tmpl.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. RECENT ACTIVITY CARD */}
              <div className="ann-sidebar-card">
                <div className="ann-sidebar-card-header">
                  <div className="sidebar-card-title-group">
                    <h4>Recent Activity</h4>
                  </div>
                  <button
                    type="button"
                    className="sidebar-view-all-link"
                    onClick={() => showToast("Viewing full audit logs.")}
                  >
                    View All
                  </button>
                </div>

                <div className="ann-activity-list">
                  {RECENT_ACTIVITIES.map((act) => (
                    <div key={act.id} className="ann-activity-item">
                      <div className="activity-status-dot" />
                      <img
                        src={act.avatar}
                        alt={act.author}
                        className="activity-avatar"
                      />
                      <div className="activity-content">
                        <p className="activity-text">
                          <strong>{act.author}</strong> {act.action}{" "}
                          <span className="activity-item-title">
                            {act.title}
                          </span>
                        </p>
                        <span className="activity-time">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* VIEW ANNOUNCEMENT DETAILS MODAL */}
      {viewingItem && (
        <div
          className="ann-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setViewingItem(null);
          }}
        >
          <div className="ann-view-modal-dialog">
            <div className="ann-view-modal-header">
              <div className="ann-view-header-title">
                <div
                  className={`ann-category-icon-box ${
                    viewingItem.category || "general"
                  }`}
                >
                  {renderCategoryIcon(viewingItem.category)}
                </div>
                <div>
                  <h2>{viewingItem.title}</h2>
                  <span className="view-modal-id">{viewingItem.id}</span>
                </div>
              </div>
              <button
                type="button"
                className="ann-modal-close-btn"
                onClick={() => setViewingItem(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ann-view-modal-body">
              {/* Badges bar */}
              <div className="ann-view-badges-bar">
                <span className="ann-audience-badge">
                  Audience: {viewingItem.audience}
                </span>
                {renderPriorityBadge(viewingItem.priority)}
                {renderStatusBadge(viewingItem.status)}
                {viewingItem.pinned && (
                  <span className="ann-pinned-badge">
                    <Pin size={12} /> Pinned
                  </span>
                )}
              </div>

              {/* Message text */}
              <div className="ann-view-content-box">
                <p>{viewingItem.content}</p>
              </div>

              {/* Meta details list */}
              <div className="ann-view-meta-grid">
                <div className="view-meta-item">
                  <span className="meta-lbl">Author</span>
                  <strong className="meta-val">
                    {viewingItem.author || "Himanshu R"}
                  </strong>
                </div>
                <div className="view-meta-item">
                  <span className="meta-lbl">Workspace</span>
                  <strong className="meta-val">
                    {viewingItem.workspace || "All Workspaces"}
                  </strong>
                </div>
                <div className="view-meta-item">
                  <span className="meta-lbl">Published Date</span>
                  <strong className="meta-val">
                    {viewingItem.date} {viewingItem.time}
                  </strong>
                </div>
                <div className="view-meta-item">
                  <span className="meta-lbl">Total Views</span>
                  <strong className="meta-val">
                    {viewingItem.views?.toLocaleString() || 824} views
                  </strong>
                </div>
              </div>
            </div>

            <div className="ann-view-modal-footer">
              <button
                type="button"
                className="ann-btn-secondary"
                onClick={() => {
                  const it = viewingItem;
                  setViewingItem(null);
                  handleDuplicate(it);
                }}
              >
                <Copy size={14} />
                <span>Duplicate</span>
              </button>

              <div className="footer-right-group">
                <button
                  type="button"
                  className="ann-btn-secondary"
                  onClick={() => setViewingItem(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="ann-btn-primary"
                  onClick={() => {
                    const it = viewingItem;
                    setViewingItem(null);
                    handleStartEdit(it);
                  }}
                >
                  <Pencil size={14} />
                  <span>Edit Announcement</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER-FRIENDLY DELETE CONFIRMATION MODAL */}
      {deletingItem && (
        <div
          className="ann-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDeletingItem(null);
          }}
        >
          <div className="ann-delete-modal-dialog">
            <div className="ann-delete-icon-circle">
              <Trash2 size={26} />
            </div>

            <h3 className="ann-delete-title">Delete Announcement?</h3>
            <p className="ann-delete-text">
              Are you sure you want to delete{" "}
              <strong>"{deletingItem.title}"</strong> ({deletingItem.id})? This
              notice will be removed from all audience feeds immediately.
            </p>

            <div className="ann-delete-preview-box">
              <div className="ann-delete-preview-row">
                <span>Audience</span>
                <strong>{deletingItem.audience}</strong>
              </div>
              <div className="ann-delete-preview-row">
                <span>Priority</span>
                <strong>{deletingItem.priority}</strong>
              </div>
              <div className="ann-delete-preview-row">
                <span>Workspace</span>
                <strong>{deletingItem.workspace || "All Workspaces"}</strong>
              </div>
            </div>

            <div className="ann-delete-actions">
              <button
                type="button"
                className="ann-btn-secondary"
                onClick={() => setDeletingItem(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ann-btn-danger"
                onClick={confirmDelete}
              >
                <Trash2 size={14} />
                <span>Delete Announcement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANALYTICS MODAL */}
      {showAnalyticsModal && (
        <div
          className="ann-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowAnalyticsModal(false);
          }}
        >
          <div className="ann-analytics-modal-dialog">
            <div className="ann-view-modal-header">
              <div className="ann-view-header-title">
                <BarChart3 size={20} className="text-purple" />
                <div>
                  <h2>Announcement Broadcast Analytics</h2>
                  <span className="view-modal-id">Organization-wide Reach</span>
                </div>
              </div>
              <button
                type="button"
                className="ann-modal-close-btn"
                onClick={() => setShowAnalyticsModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ann-analytics-body">
              {/* Stats Grid */}
              <div className="ann-analytics-stats">
                <div className="analytics-stat-pill">
                  <span>Audience Reach</span>
                  <strong>342 Users</strong>
                  <small className="text-green">98.4% delivery rate</small>
                </div>
                <div className="analytics-stat-pill">
                  <span>Total Views</span>
                  <strong>3,892</strong>
                  <small className="text-green">↑ 24% this week</small>
                </div>
                <div className="analytics-stat-pill">
                  <span>Read Rate</span>
                  <strong>86.5%</strong>
                  <small className="text-blue">Avg. 1.8 mins</small>
                </div>
                <div className="analytics-stat-pill">
                  <span>Feedback Rating</span>
                  <strong>94% Positive</strong>
                  <small className="text-purple">142 confirmations</small>
                </div>
              </div>

              {/* Delivery Channels */}
              <div className="analytics-section">
                <h4>Audience Delivery Channels</h4>
                <div className="analytics-bar-item">
                  <div className="bar-label-row">
                    <span>In-App Banner & Notification Center</span>
                    <strong>100%</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill purple" style={{ width: "100%" }} />
                  </div>
                </div>
                <div className="analytics-bar-item">
                  <div className="bar-label-row">
                    <span>Work Email Digest</span>
                    <strong>94.2%</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill blue" style={{ width: "94.2%" }} />
                  </div>
                </div>
                <div className="analytics-bar-item">
                  <div className="bar-label-row">
                    <span>Slack & MS Teams Webhooks</span>
                    <strong>88.0%</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill teal" style={{ width: "88%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="ann-view-modal-footer">
              <button
                type="button"
                className="ann-btn-primary"
                onClick={() => setShowAnalyticsModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
