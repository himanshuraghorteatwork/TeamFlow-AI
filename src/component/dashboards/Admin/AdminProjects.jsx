import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FolderKanban,
  Search,
  Plus,
  Filter,
  Download,
  RotateCcw,
  LayoutGrid,
  List,
  Pencil,
  Trash2,
  Copy,
  ChevronDown,
  X,
  Users,
  CalendarDays,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Folder,
  Layout,
  Smartphone,
  Sparkles,
  Megaphone,
  BarChart3,
  Bug,
  MoreVertical,
  Calendar,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Check,
  Layers,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import {
  initialAdminProjects,
  projectStatuses,
  projectPriorities,
  workspaceOptions,
  teamMembersList,
  recentActivities,
} from "./adminProjectsData.js";
import "./AdminProjects.css";

const STORAGE_KEY = "teamflow_admin_projects_v2";

/* =========================================================
   ANIMATED NUMBER COMPONENT (Smooth counting animation)
========================================================= */
function AnimatedNumber({ value, prefix = "", suffix = "" }) {
  const numericValue = useMemo(() => {
    if (typeof value === "number") return value;
    const cleaned = String(value).replace(/[^0-9]/g, "");
    return parseInt(cleaned, 10) || 0;
  }, [value]);

  const [displayValue, setDisplayValue] = useState(numericValue);

  useEffect(() => {
    let startVal = displayValue;
    let endVal = numericValue;
    if (startVal === endVal) return;

    let startTime = null;
    const duration = 350;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const factor = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(startVal + (endVal - startVal) * factor);
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [numericValue]);

  return (
    <span className="tf-live-num">
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

// Canonical workspace mapping to unify legacy names with modern Admin Workspaces
const CANONICAL_WORKSPACE_MAP = {
  "development": "Development Hub",
  "development hub": "Development Hub",
  "design": "Design Studio",
  "design studio": "Design Studio",
  "marketing": "Marketing Team",
  "marketing team": "Marketing Team",
  "teamflow": "TeamFlow Workspace",
  "teamflow workspace": "TeamFlow Workspace",
  "research lab": "Research Lab",
  "startup team": "Startup Team",
  "finance ops": "Finance Ops",
};

const normalizeWorkspaceName = (wsName) => {
  if (!wsName) return "TeamFlow Workspace";
  const trimmed = wsName.trim();
  const lower = trimmed.toLowerCase();
  if (CANONICAL_WORKSPACE_MAP[lower]) return CANONICAL_WORKSPACE_MAP[lower];
  return trimmed;
};

const loadProjects = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    let parsedProjects = [];
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsedProjects = parsed;
      }
    }
    if (parsedProjects.length === 0) {
      parsedProjects = initialAdminProjects;
    }

    // Normalize project workspaces to canonical names
    parsedProjects = parsedProjects.map((p) => ({
      ...p,
      workspace: normalizeWorkspaceName(p.workspace),
    }));

    // Save normalized back to storage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedProjects));
    } catch {}

    // Ensure all registered workspaces have projects
    let registeredWorkspaces = [];
    try {
      const savedWs = localStorage.getItem("teamflow_admin_workspaces_v2");
      if (savedWs) {
        const list = JSON.parse(savedWs);
        if (Array.isArray(list)) registeredWorkspaces = list;
      }
    } catch {}

    const projectWorkspaces = new Set(parsedProjects.map((p) => p.workspace));
    const toSeed = [];

    registeredWorkspaces.forEach((ws, idx) => {
      const canonicalName = normalizeWorkspaceName(ws.name);
      if (!projectWorkspaces.has(canonicalName)) {
        // Generate initial projects for this workspace
        toSeed.push(
          {
            id: Date.now() + idx * 100 + 1,
            name: `${canonicalName} Initiative`,
            workspace: canonicalName,
            owner: ws.owner || "Amit Sharma",
            ownerEmail: ws.email || "amit@teamflow.ai",
            status: "Active",
            priority: "High",
            description: `Core operational tasks and deliverables for ${canonicalName}.`,
            tasks: 12,
            completedTasks: 8,
            progress: 67,
            dueDate: "2026-11-28",
            createdAt: "2026-10-10",
            color: ws.color || "#6366f1",
            iconType: "layout",
            team: [
              { name: ws.owner || "Amit Sharma", avatar: (ws.owner || "AS").slice(0, 2).toUpperCase(), color: "#6366f1" },
              { name: "Priya Patel", avatar: "PP", color: "#10b981" },
            ],
            extraMembers: 2,
          },
          {
            id: Date.now() + idx * 100 + 2,
            name: `${canonicalName} Platform QA`,
            workspace: canonicalName,
            owner: ws.owner || "David Lee",
            ownerEmail: ws.email || "david@techcorp.com",
            status: "Active",
            priority: "Medium",
            description: `Quality testing and deployment pipelines for ${canonicalName}.`,
            tasks: 10,
            completedTasks: 4,
            progress: 40,
            dueDate: "2026-12-15",
            createdAt: "2026-10-15",
            color: "#3b82f6",
            iconType: "chart",
            team: [
              { name: "Rahul Sharma", avatar: "RS", color: "#6366f1" },
            ],
            extraMembers: 1,
          }
        );
      }
    });

    if (toSeed.length > 0) {
      parsedProjects = [...toSeed, ...parsedProjects];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedProjects));
    }

    return parsedProjects;
  } catch (e) {
    console.error(e);
    return initialAdminProjects;
  }
};

export default function AdminProjects() {
  const location = useLocation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState(loadProjects);
  const [mobileOpen, setMobileOpen] = useState(false);

  // View Mode: 'kanban' | 'list' | 'timeline'
  const [viewMode, setViewMode] = useState("kanban");

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [workspaceFilter, setWorkspaceFilter] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const wsParam = params.get("workspace");
      if (wsParam) return decodeURIComponent(wsParam);
      const saved = localStorage.getItem("teamflow_selected_project_workspace");
      if (saved) return saved;
    } catch {}
    return "All";
  });
  const [memberFilter, setMemberFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortKey, setSortKey] = useState("recentlyUpdated"); // 'recentlyUpdated' | 'name-asc' | 'name-desc' | 'progress-desc' | 'dueDate'

  // Card Dropdown State
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    workspace: "TeamFlow Workspace",
    owner: "Rahul Sharma",
    ownerEmail: "rahul@teamflow.ai",
    status: "Active",
    priority: "High",
    progress: 45,
    tasks: 12,
    completedTasks: 5,
    dueDate: "2026-11-30",
    description: "",
    color: "#6366f1",
    iconType: "layout",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveProjects = (newProjects, notifyMsg = null) => {
    setProjects(newProjects);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    } catch (e) {}
    window.dispatchEvent(new Event("teamflow_data_update"));
    if (notifyMsg) showToast(notifyMsg);
  };

  // Synchronize workspace query parameter & search from URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const wsParam = params.get("workspace");
      if (wsParam) {
        const decoded = decodeURIComponent(wsParam);
        setWorkspaceFilter(decoded);
        try {
          localStorage.setItem("teamflow_selected_project_workspace", decoded);
        } catch {}
      }
      const searchParam = params.get("search") || params.get("project");
      if (searchParam) {
        setSearch(decodeURIComponent(searchParam));
      }
    } catch {}
  }, [location.search]);

  const handleWorkspaceChange = (newWs) => {
    setWorkspaceFilter(newWs);
    try {
      if (newWs === "All") {
        localStorage.removeItem("teamflow_selected_project_workspace");
        navigate("/admin/projects", { replace: true });
      } else {
        localStorage.setItem("teamflow_selected_project_workspace", newWs);
        navigate(`/admin/projects?workspace=${encodeURIComponent(newWs)}`, { replace: true });
      }
    } catch {}
  };

  // Close menus on outside click
  useEffect(() => {
    const handleOutside = () => setActiveMenuId(null);
    window.addEventListener("click", handleOutside);
    return () => window.removeEventListener("click", handleOutside);
  }, []);

  // Synchronize with external data updates (e.g. from AdminWorkspace)
  useEffect(() => {
    const handleUpdate = () => {
      setProjects(loadProjects());
    };
    window.addEventListener("teamflow_data_update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("teamflow_data_update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Dynamically load all available distinct workspaces (Deduplicated & Canonical)
  const availableWorkspaces = useMemo(() => {
    const list = ["All"];
    const seen = new Set(["all"]);

    const registerWs = (name) => {
      if (!name) return;
      const canonical = normalizeWorkspaceName(name);
      const key = canonical.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        list.push(canonical);
      }
    };

    // 1. Standard canonical default workspaces
    [
      "TeamFlow Workspace",
      "Development Hub",
      "Design Studio",
      "Marketing Team",
      "Research Lab",
      "Startup Team",
      "Finance Ops",
    ].forEach(registerWs);

    // 2. Workspaces from Admin Workspace store (e.g. user created)
    try {
      const savedWs = localStorage.getItem("teamflow_admin_workspaces_v2");
      if (savedWs) {
        const parsed = JSON.parse(savedWs);
        if (Array.isArray(parsed)) {
          parsed.forEach((w) => registerWs(w.name));
        }
      }
    } catch (e) {}

    // 3. Workspaces from projects
    projects.forEach((p) => registerWs(p.workspace));

    return list;
  }, [projects]);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        p.name?.toLowerCase().includes(term) ||
        p.owner?.toLowerCase().includes(term) ||
        p.workspace?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term);

      const matchesStatus = statusFilter === "All" || p.status === statusFilter;

      const pWs = normalizeWorkspaceName(p.workspace);
      const filterWs = workspaceFilter === "All" ? "All" : normalizeWorkspaceName(workspaceFilter);

      const matchesWorkspace =
        filterWs === "All" ||
        pWs.toLowerCase() === filterWs.toLowerCase();

      const matchesPriority =
        priorityFilter === "All" || p.priority === priorityFilter;

      const matchesMember =
        memberFilter === "All" ||
        p.owner === memberFilter ||
        p.team?.some((m) => m.name === memberFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesWorkspace &&
        matchesPriority &&
        matchesMember
      );
    }).sort((a, b) => {
      if (sortKey === "name-asc") return a.name.localeCompare(b.name);
      if (sortKey === "name-desc") return b.name.localeCompare(a.name);
      if (sortKey === "progress-desc") return (b.progress || 0) - (a.progress || 0);
      if (sortKey === "dueDate") return (a.dueDate || "").localeCompare(b.dueDate || "");
      // recentlyUpdated
      return b.id - a.id;
    });
  }, [
    projects,
    search,
    statusFilter,
    workspaceFilter,
    priorityFilter,
    memberFilter,
    sortKey,
  ]);

  // =========================================================
  // PAGINATION STATES (Matching Roles, Workspace & Users)
  // =========================================================
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage, pageSize]);

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, workspaceFilter, priorityFilter, memberFilter, sortKey]);

  // Reusable Pagination Bar (Matching Workspace & Roles)
  const renderPaginationBar = () => {
    if (filteredProjects.length === 0) return null;

    const getPageNumbers = () => {
      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, "...", totalPages];
      }
      if (currentPage >= totalPages - 3) {
        return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      }
      return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    };

    return (
      <div className="ws-pagination-bar ap-pagination-bar">
        <div className="ws-pagination-info ap-pagination-info">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredProjects.length)} of {filteredProjects.length} projects
          </span>
          <div className="ws-page-size-wrap ap-page-size-wrap">
            <span>Projects per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
            </select>
          </div>
        </div>

        <div className="ws-pagination-controls ap-pagination-controls">
          <button
            type="button"
            className="ws-page-nav-btn ap-page-nav-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <div className="ws-page-pills ap-page-pills">
            {getPageNumbers().map((num, idx) =>
              num === "..." ? (
                <span key={`ellipsis-${idx}`} className="ap-page-ellipsis ws-page-ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={num}
                  type="button"
                  className={`ws-page-num-pill ap-page-num-pill ${currentPage === num ? "active" : ""}`}
                  onClick={() => setCurrentPage(num)}
                  aria-current={currentPage === num ? "page" : undefined}
                >
                  {num}
                </button>
              )
            )}
          </div>
          <button
            type="button"
            className="ws-page-nav-btn ap-page-nav-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // Overall Statistics calculated LIVE based on filtered projects
  const stats = useMemo(() => {
    const total = filteredProjects.length;
    const active = filteredProjects.filter((p) => p.status === "Active").length;
    const completed = filteredProjects.filter((p) => p.status === "Completed").length;
    const onHold = filteredProjects.filter((p) => p.status === "On Hold").length;
    const overdue = filteredProjects.filter((p) => p.status === "Overdue").length;
    const avgProgress = total > 0
      ? Math.round(filteredProjects.reduce((acc, p) => acc + (p.progress || 0), 0) / total)
      : 0;
    return { total, active, completed, onHold, overdue, avgProgress };
  }, [filteredProjects]);

  const isAllWorkspaces = workspaceFilter === "All";

  // Live Chart 2 Data: Workspace Distribution or Project-Level Velocity
  const wsColors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#6366f1"];
  const chart2Data = useMemo(() => {
    if (isAllWorkspaces) {
      const counts = {};
      availableWorkspaces.filter((w) => w !== "All").forEach((w) => {
        counts[w] = 0;
      });
      projects.forEach((p) => {
        const ws = normalizeWorkspaceName(p.workspace);
        counts[ws] = (counts[ws] || 0) + 1;
      });
      return Object.entries(counts)
        .filter(([_, count]) => count > 0)
        .slice(0, 7)
        .map(([name, count], idx) => ({
          name: name.replace(/ (Workspace|Team|Hub|Studio|Lab)/i, ""),
          fullName: name,
          value: count,
          color: wsColors[idx % wsColors.length],
          sub: `${count} projects`,
        }));
    } else {
      // Projects in the selected workspace
      return filteredProjects.slice(0, 6).map((p, idx) => ({
        name: p.name.length > 11 ? `${p.name.slice(0, 9)}…` : p.name,
        fullName: p.name,
        value: p.completedTasks || p.progress || 0,
        color: p.color || wsColors[idx % wsColors.length],
        sub: `${p.completedTasks}/${p.tasks} tasks (${p.progress}%)`,
      }));
    }
  }, [isAllWorkspaces, projects, filteredProjects, availableWorkspaces]);

  // Progress overview list for Chart 3
  const progressOverviewList = useMemo(() => {
    return filteredProjects.slice(0, 4);
  }, [filteredProjects]);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingProject(null);
    setForm({
      name: "",
      workspace: "TeamFlow Workspace",
      owner: "Rahul Sharma",
      ownerEmail: "rahul@teamflow.ai",
      status: "Active",
      priority: "High",
      progress: 0,
      tasks: 10,
      completedTasks: 0,
      dueDate: "2026-12-15",
      description: "",
      color: "#6366f1",
      iconType: "layout",
    });
    setShowCreateModal(true);
  };

  // Open Edit Modal
  const openEditModal = (p) => {
    setEditingProject(p);
    setForm({
      name: p.name || "",
      workspace: normalizeWorkspaceName(p.workspace) || "TeamFlow Workspace",
      owner: p.owner || "Rahul Sharma",
      ownerEmail: p.ownerEmail || "rahul@teamflow.ai",
      status: p.status || "Active",
      priority: p.priority || "Medium",
      progress: p.progress || 0,
      tasks: p.tasks || 10,
      completedTasks: p.completedTasks || 0,
      dueDate: p.dueDate || "",
      description: p.description || "",
      color: p.color || "#6366f1",
      iconType: p.iconType || "layout",
    });
    setShowCreateModal(true);
  };

  // Submit Create or Edit Form
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast("Project title is required", "error");
      return;
    }

    const calcProgress =
      form.tasks > 0
        ? Math.round((Number(form.completedTasks) / Number(form.tasks)) * 100)
        : Number(form.progress) || 0;

    if (editingProject) {
      const updated = projects.map((p) =>
        p.id === editingProject.id
          ? {
              ...p,
              ...form,
              tasks: Number(form.tasks),
              completedTasks: Number(form.completedTasks),
              progress: calcProgress,
            }
          : p
      );
      saveProjects(updated, `Updated "${form.name}" successfully.`);
    } else {
      const newProj = {
        id: Date.now(),
        ...form,
        tasks: Number(form.tasks),
        completedTasks: Number(form.completedTasks),
        progress: calcProgress,
        createdAt: new Date().toISOString().split("T")[0],
        team: [
          { name: form.owner, avatar: form.owner.slice(0, 2).toUpperCase(), color: form.color },
          { name: "Priya Patel", avatar: "PP", color: "#10b981" },
        ],
        extraMembers: 2,
      };
      saveProjects([newProj, ...projects], `Created "${form.name}" successfully.`);
    }

    setShowCreateModal(false);
  };

  // Duplicate Project
  const handleDuplicate = (p) => {
    const clone = {
      ...p,
      id: Date.now(),
      name: `${p.name} (Copy)`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    saveProjects([clone, ...projects], `Duplicated "${p.name}".`);
  };

  // Delete Project
  const confirmDeleteProject = () => {
    if (!projectToDelete) return;
    const remaining = projects.filter((p) => p.id !== projectToDelete.id);
    saveProjects(remaining, `Deleted "${projectToDelete.name}".`);
    setProjectToDelete(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Workspace", "Status", "Priority", "Progress", "Tasks", "Due Date", "Owner"];
    const rows = filteredProjects.map((p) => [
      p.id,
      `"${p.name}"`,
      `"${p.workspace}"`,
      `"${p.status}"`,
      `"${p.priority}"`,
      `${p.progress}%`,
      `${p.completedTasks}/${p.tasks}`,
      `"${p.dueDate}"`,
      `"${p.owner}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `teamflow_projects_${Date.now()}.csv`;
    link.click();
    setExportOpen(false);
    showToast("Projects exported to CSV.");
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredProjects, null, 2));
    const link = document.createElement("a");
    link.href = dataStr;
    link.download = `teamflow_projects_${Date.now()}.json`;
    link.click();
    setExportOpen(false);
    showToast("Projects exported to JSON.");
  };

  // Icon Helper for project cards
  const renderProjectIcon = (iconType, color = "#6366f1") => {
    switch (iconType) {
      case "mobile":
        return <Smartphone size={20} />;
      case "brain":
        return <Sparkles size={20} />;
      case "megaphone":
        return <Megaphone size={20} />;
      case "chart":
        return <BarChart3 size={20} />;
      case "users":
        return <Users size={20} />;
      case "bug":
        return <Bug size={20} />;
      case "folder":
        return <Folder size={20} />;
      default:
        return <Layout size={20} />;
    }
  };

  // Interactive chart hover states
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  // Live percentages based on filtered projects
  const totalCount = stats.total || 0;
  const activePct = totalCount > 0 ? Math.round((stats.active / totalCount) * 100) : 0;
  const completedPct = totalCount > 0 ? Math.round((stats.completed / totalCount) * 100) : 0;
  const onHoldPct = totalCount > 0 ? Math.max(0, 100 - activePct - completedPct) : 0;

  // SVG Donut metrics with live orbital & telemetry effects (matches AdminDashboard & AdminAnalytics)
  const donutRadius = 46;
  const donutCircumference = 2 * Math.PI * donutRadius; // ~289.03
  const donutSlices = useMemo(() => {
    if (totalCount === 0) return [];
    const rawSlices = [
      { name: "Active", count: stats.active || 0, color: "#10b981", pct: activePct },
      { name: "Completed", count: stats.completed || 0, color: "#3b82f6", pct: completedPct },
      { name: "On Hold", count: stats.onHold || 0, color: "#f59e0b", pct: onHoldPct },
    ];
    if (stats.overdue > 0) {
      const overduePct = Math.round((stats.overdue / totalCount) * 100);
      rawSlices.push({ name: "Overdue", count: stats.overdue, color: "#ef4444", pct: overduePct });
    }

    let currentOffset = 0;
    return rawSlices.map((slice) => {
      const length = (slice.count / totalCount) * donutCircumference;
      const sliceData = {
        ...slice,
        length,
        offset: currentOffset,
      };
      currentOffset -= length;
      return sliceData;
    });
  }, [stats, totalCount, activePct, completedPct, onHoldPct, donutCircumference]);

  const activeHoveredSlice = useMemo(() => {
    if (!hoveredSegment) return null;
    return donutSlices.find((s) => s.name === hoveredSegment) || null;
  }, [hoveredSegment, donutSlices]);

  // Live Recharts Data for Status Pie (reacts immediately to filters)
  const statusPieData = useMemo(() => {
    if (totalCount === 0) {
      return [{ name: "No Projects", value: 1, color: "#cbd5e1" }];
    }
    const data = [
      { name: "Active", value: stats.active || 0, color: "#10b981" },
      { name: "Completed", value: stats.completed || 0, color: "#3b82f6" },
      { name: "On Hold", value: stats.onHold || 0, color: "#f59e0b" },
    ];
    if (stats.overdue > 0) {
      data.push({ name: "Overdue", value: stats.overdue, color: "#ef4444" });
    }
    return data.filter((d) => d.value > 0);
  }, [stats, totalCount]);

  return (
    <div className="admin-projects-app projectManagementPage">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="admin-projects-main">
        <AdminTopbar
          onMobileMenuToggle={() => setMobileOpen(true)}
          onCreateProject={openCreateModal}
        />

        {toast && (
          <div className={`ap-toast ap-toast--${toast.type}`}>
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        <main className="ap-content-container">
          {/* =========================================================
             1. TOP HEADER ROW (Matching reference design)
          ========================================================= */}
          <div className="ap-main-header">
            <div className="ap-header-left">
              <div className="ap-header-icon-chip">
                <Folder size={24} />
              </div>
              <div>
                <h1 className="ap-header-title">Project Management</h1>
                <p className="ap-header-sub">
                  Plan, track, and deliver your projects with your team.
                </p>
              </div>
            </div>

            <div className="ap-header-right">
              {/* VIEW SWITCHER */}
              <div className="ap-view-selector">
                <button
                  type="button"
                  className={`ap-view-mode-btn ${viewMode === "kanban" ? "active" : ""}`}
                  onClick={() => setViewMode("kanban")}
                  title="Kanban Board View"
                >
                  <FolderKanban size={15} />
                  <span>Kanban</span>
                </button>
                <button
                  type="button"
                  className={`ap-view-mode-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List Table View"
                >
                  <List size={15} />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  className={`ap-view-mode-btn ${viewMode === "timeline" ? "active" : ""}`}
                  onClick={() => setViewMode("timeline")}
                  title="Timeline View"
                >
                  <CalendarDays size={15} />
                  <span>Timeline</span>
                </button>
              </div>

              {/* CREATE PROJECT BUTTON */}
              <button
                type="button"
                className="ap-btn-create-project"
                onClick={openCreateModal}
              >
                <Plus size={16} />
                <span>Create Project</span>
              </button>
            </div>
          </div>

          {/* =========================================================
             2. TOP STATS KPI ROW (Live counts based on filters)
          ========================================================= */}
          <div className="ap-stats-row">
            {/* Total Projects */}
            <div className="ap-stat-card">
              <div className="ap-stat-left">
                <div className="ap-stat-icon-wrap blue">
                  <Folder size={20} />
                </div>
                <div>
                  <span className="ap-stat-title">Total Projects</span>
                  <div className="ap-stat-val-row">
                    <strong className="ap-stat-val">
                      <AnimatedNumber value={stats.total} />
                    </strong>
                    <span className="ap-stat-badge up">
                      {isAllWorkspaces ? "All Workspaces" : "Live"}
                    </span>
                  </div>
                  <small className="ap-stat-sub">
                    {isAllWorkspaces ? "Across organization" : `In ${workspaceFilter}`}
                  </small>
                </div>
              </div>
              <div className="ap-sparkline-wrap">
                <svg width="68" height="32" viewBox="0 0 68 32">
                  <path
                    d="M2,24 Q16,28 26,14 T50,18 T66,6"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Active Projects */}
            <div className="ap-stat-card">
              <div className="ap-stat-left">
                <div className="ap-stat-icon-wrap green">
                  <Play size={18} fill="currentColor" />
                </div>
                <div>
                  <span className="ap-stat-title">Active Projects</span>
                  <div className="ap-stat-val-row">
                    <strong className="ap-stat-val">
                      <AnimatedNumber value={stats.active} />
                    </strong>
                    <span className="ap-stat-badge up">
                      {stats.total > 0 ? `${activePct}%` : "0%"}
                    </span>
                  </div>
                  <small className="ap-stat-sub">{stats.active} currently shipping</small>
                </div>
              </div>
              <div className="ap-sparkline-wrap">
                <svg width="68" height="32" viewBox="0 0 68 32">
                  <path
                    d="M2,26 Q18,22 30,12 T52,14 T66,4"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Completed */}
            <div className="ap-stat-card">
              <div className="ap-stat-left">
                <div className="ap-stat-icon-wrap blue-check">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <span className="ap-stat-title">Completed</span>
                  <div className="ap-stat-val-row">
                    <strong className="ap-stat-val">
                      <AnimatedNumber value={stats.completed} />
                    </strong>
                    <span className="ap-stat-badge up">
                      {stats.total > 0 ? `${completedPct}%` : "0%"}
                    </span>
                  </div>
                  <small className="ap-stat-sub">{stats.completed} delivered</small>
                </div>
              </div>
              <div className="ap-sparkline-wrap">
                <svg width="68" height="32" viewBox="0 0 68 32">
                  <path
                    d="M2,28 Q18,24 32,16 T52,10 T66,2"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* On Hold */}
            <div className="ap-stat-card">
              <div className="ap-stat-left">
                <div className="ap-stat-icon-wrap amber">
                  <Clock size={20} />
                </div>
                <div>
                  <span className="ap-stat-title">On Hold</span>
                  <div className="ap-stat-val-row">
                    <strong className="ap-stat-val">
                      <AnimatedNumber value={stats.onHold} />
                    </strong>
                    <span className={`ap-stat-badge ${stats.onHold > 0 ? "down" : "up"}`}>
                      {stats.total > 0 ? `${onHoldPct}%` : "0%"}
                    </span>
                  </div>
                  <small className="ap-stat-sub">{stats.onHold} paused or queued</small>
                </div>
              </div>
              <div className="ap-sparkline-wrap">
                <svg width="68" height="32" viewBox="0 0 68 32">
                  <path
                    d="M2,10 Q20,6 34,18 T52,22 T66,26"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* =========================================================
             3. ANALYTICS & CHARTS ROW (Live interactive charts)
          ========================================================= */}
          <div className="ap-charts-row">
            {/* 1. Project Status Distribution (Live Recharts Pie / Donut Chart) */}
            <div className="ap-chart-card">
              <div className="ap-chart-card-header">
                <div className="ap-chart-title-wrap">
                  <h3>Project Status</h3>
                  <span className="ap-chart-live-badge">
                    <span className="ap-live-pulse-dot" /> Live
                  </span>
                </div>
              </div>

              <div className="ap-donut-content">
                <div className="ap-donut-svg-wrap">
                  <svg viewBox="0 0 140 140" className="ap-donut-svg">
                    <defs>
                      <filter id="apDonutGlow-active" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#10b981" floodOpacity="0.8" />
                      </filter>
                      <filter id="apDonutGlow-completed" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#3b82f6" floodOpacity="0.8" />
                      </filter>
                      <filter id="apDonutGlow-onhold" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#f59e0b" floodOpacity="0.8" />
                      </filter>
                      <filter id="apDonutGlow-overdue" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#ef4444" floodOpacity="0.8" />
                      </filter>
                    </defs>

                    {/* Ambient live outer orbital ring */}
                    <circle
                      cx="70"
                      cy="70"
                      r="63"
                      fill="none"
                      className="ap-donut-aura-ring"
                    />

                    {/* Expanding live sonar wave */}
                    <circle
                      cx="70"
                      cy="70"
                      r={donutRadius}
                      fill="none"
                      className="ap-donut-sonar-wave"
                    />

                    {/* Background track ring */}
                    <circle
                      cx="70"
                      cy="70"
                      r={donutRadius}
                      fill="none"
                      className="ap-donut-bg-ring"
                      strokeWidth={13}
                    />

                    {/* Slices group rotated -90deg */}
                    <g transform="rotate(-90 70 70)">
                      {totalCount === 0 ? (
                        <circle
                          cx="70"
                          cy="70"
                          r={donutRadius}
                          fill="none"
                          stroke="#64748b"
                          strokeWidth={13}
                          opacity={0.3}
                        />
                      ) : (
                        donutSlices.map((slice) => {
                          const isHovered = hoveredSegment === slice.name;
                          const isAnyHovered = hoveredSegment !== null;
                          const sliceKey = slice.name.toLowerCase().replace(/\s+/g, "");
                          return (
                            <circle
                              key={slice.name}
                              cx="70"
                              cy="70"
                              r={donutRadius}
                              fill="none"
                              stroke={slice.color}
                              strokeWidth={isHovered ? 17 : 13}
                              strokeDasharray={`${slice.length} ${donutCircumference - slice.length}`}
                              strokeDashoffset={slice.offset}
                              filter={isHovered ? `url(#apDonutGlow-${sliceKey})` : undefined}
                              opacity={isAnyHovered && !isHovered ? 0.35 : 1}
                              className={`ap-donut-slice slice-${sliceKey} ${isHovered ? "active" : ""}`}
                              style={{
                                cursor: "pointer",
                                transition: "stroke-width 0.25s ease, opacity 0.25s ease, filter 0.25s ease",
                              }}
                              onMouseEnter={() => setHoveredSegment(slice.name)}
                              onMouseLeave={() => setHoveredSegment(null)}
                              onClick={() => setStatusFilter(statusFilter === slice.name ? "All" : slice.name)}
                            >
                              <title>{`${slice.name}: ${slice.count} projects (${slice.pct}%) · Click to filter`}</title>
                            </circle>
                          );
                        })
                      )}
                    </g>

                    {/* Orbiting Live Satellite Beacon */}
                    <g className="ap-donut-orbit-beacon" style={{ transformOrigin: "70px 70px" }}>
                      <circle cx="70" cy={16} r="6" fill="none" className="ap-donut-beacon-pulse" />
                      <circle cx="70" cy={16} r="3.2" className="ap-donut-beacon-core" />
                    </g>
                  </svg>

                  <div className={`ap-donut-center-label ${activeHoveredSlice ? "has-hover" : ""}`}>
                    {activeHoveredSlice ? (
                      <div className="ap-donut-active-metric">
                        <strong style={{ color: activeHoveredSlice.color }}>
                          {activeHoveredSlice.count}
                        </strong>
                        <small style={{ color: activeHoveredSlice.color, fontWeight: 700 }}>
                          {activeHoveredSlice.name} ({activeHoveredSlice.pct}%)
                        </small>
                      </div>
                    ) : (
                      <div className="ap-donut-default-metric">
                        <strong>
                          <AnimatedNumber value={stats.total} />
                        </strong>
                        <small>
                          <span className="ap-center-live-dot" /> Projects
                        </small>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ap-donut-legend">
                  <div
                    className={`ap-legend-row ${hoveredSegment === "Active" || statusFilter === "Active" ? "active" : ""}`}
                    onMouseEnter={() => setHoveredSegment("Active")}
                    onMouseLeave={() => setHoveredSegment(null)}
                    onClick={() => setStatusFilter(statusFilter === "Active" ? "All" : "Active")}
                    title="Click to filter by Active status"
                    style={{ cursor: "pointer" }}
                  >
                    <span className="ap-legend-dot green" />
                    <span className="ap-legend-name">Active</span>
                    <strong className="ap-legend-val">{stats.active} ({activePct}%)</strong>
                  </div>
                  <div
                    className={`ap-legend-row ${hoveredSegment === "Completed" || statusFilter === "Completed" ? "active" : ""}`}
                    onMouseEnter={() => setHoveredSegment("Completed")}
                    onMouseLeave={() => setHoveredSegment(null)}
                    onClick={() => setStatusFilter(statusFilter === "Completed" ? "All" : "Completed")}
                    title="Click to filter by Completed status"
                    style={{ cursor: "pointer" }}
                  >
                    <span className="ap-legend-dot blue" />
                    <span className="ap-legend-name">Completed</span>
                    <strong className="ap-legend-val">{stats.completed} ({completedPct}%)</strong>
                  </div>
                  <div
                    className={`ap-legend-row ${hoveredSegment === "On Hold" || statusFilter === "On Hold" ? "active" : ""}`}
                    onMouseEnter={() => setHoveredSegment("On Hold")}
                    onMouseLeave={() => setHoveredSegment(null)}
                    onClick={() => setStatusFilter(statusFilter === "On Hold" ? "All" : "On Hold")}
                    title="Click to filter by On Hold status"
                    style={{ cursor: "pointer" }}
                  >
                    <span className="ap-legend-dot yellow" />
                    <span className="ap-legend-name">On Hold</span>
                    <strong className="ap-legend-val">{stats.onHold} ({onHoldPct}%)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Projects by Workspace or Velocity (Live Recharts Bar Chart) */}
            <div className="ap-chart-card">
              <div className="ap-chart-card-header">
                <div className="ap-chart-title-wrap">
                  <h3>
                    {isAllWorkspaces
                      ? "Projects by Workspace"
                      : `${workspaceFilter.replace(/ (Workspace|Team|Hub|Studio|Lab)/i, "")} Velocity`}
                  </h3>
                  <span className="ap-chart-live-badge">
                    <span className="ap-live-pulse-dot" /> Live Metrics
                  </span>
                </div>
              </div>

              <div className="ap-recharts-bar-wrap" style={{ width: "100%", height: 125, marginTop: 4 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chart2Data} margin={{ top: 12, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f6" opacity={0.6} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111c30",
                        border: "1px solid #1e293b",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "#f8fafc",
                        padding: "6px 10px",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                      }}
                      itemStyle={{ color: "#f8fafc" }}
                      formatter={(val, name, item) => [
                        item?.payload?.sub || `${val} items`,
                        item?.payload?.fullName || "Item",
                      ]}
                    />
                    <Bar
                      dataKey="value"
                      radius={[6, 6, 0, 0]}
                      isAnimationActive={true}
                      animationDuration={800}
                      animationEasing="ease-out"
                      onClick={(data) => {
                        if (isAllWorkspaces && data?.fullName) {
                          handleWorkspaceChange(data.fullName);
                        }
                      }}
                      style={{ cursor: isAllWorkspaces ? "pointer" : "default" }}
                    >
                      {chart2Data.map((entry, index) => {
                        const isBarHovered = hoveredBar === index;
                        return (
                          <Cell
                            key={`bar-${index}`}
                            fill={entry.color}
                            fillOpacity={hoveredBar === null ? 0.9 : isBarHovered ? 1 : 0.45}
                            style={{
                              transition: "all 0.25s ease",
                              filter: isBarHovered ? "drop-shadow(0 4px 8px rgba(99, 102, 241, 0.35))" : "none",
                            }}
                            onMouseEnter={() => setHoveredBar(index)}
                            onMouseLeave={() => setHoveredBar(null)}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. Project Progress Overview (Live Progress Meters) */}
            <div className="ap-chart-card">
              <div className="ap-chart-card-header">
                <div className="ap-chart-title-wrap">
                  <h3>Project Progress Overview</h3>
                  <span className="ap-chart-live-badge">
                    <span className="ap-live-pulse-dot" /> Real-Time
                  </span>
                </div>
              </div>

              <div className="ap-progress-overview-list">
                {progressOverviewList.length === 0 ? (
                  <div className="ap-overview-empty">
                    <p>No projects found in this view</p>
                    <button
                      type="button"
                      className="ap-btn-clear-inline"
                      onClick={() => handleWorkspaceChange("All")}
                    >
                      Show All Projects
                    </button>
                  </div>
                ) : (
                  progressOverviewList.map((item, idx) => {
                    const colors = ["#6366f1", "#2563eb", "#10b981", "#f59e0b", "#a855f7"];
                    return (
                      <div
                        key={item.id}
                        className="ap-overview-item"
                        onClick={() => openEditModal(item)}
                        title={`Click to view/edit ${item.name}`}
                      >
                        <div className="ap-overview-top-line">
                          <span className="ap-overview-name">{item.name}</span>
                          <span className="ap-overview-owner-chip">{item.owner}</span>
                          <strong className="ap-overview-pct">{item.progress}%</strong>
                        </div>
                        <div className="ap-overview-meter-track">
                          <div
                            className="ap-overview-meter-fill ap-animated-meter"
                            style={{
                              width: `${item.progress}%`,
                              backgroundColor: item.color || colors[idx % colors.length],
                            }}
                          >
                            <span className="ap-meter-live-glow" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* =========================================================
             4. TOOLBAR, SEARCH & FILTER CONTROLS ROW
          ========================================================= */}
          {/* Quick Workspace Selection Pills */}
          <div className="ap-workspace-quick-chips">
            <button
              type="button"
              className={`ap-quick-chip ${workspaceFilter === "All" ? "active" : ""}`}
              onClick={() => handleWorkspaceChange("All")}
              title="View all projects across all workspaces"
            >
              <Layers size={13} />
              <span>All Projects</span>
              <span className="ap-chip-badge">{projects.length}</span>
            </button>
            {availableWorkspaces.filter((w) => w !== "All").slice(0, 6).map((w) => {
              const wsCount = projects.filter((p) => normalizeWorkspaceName(p.workspace) === w).length;
              return (
                <button
                  key={w}
                  type="button"
                  className={`ap-quick-chip ${workspaceFilter === w ? "active" : ""}`}
                  onClick={() => handleWorkspaceChange(w)}
                  title={`Filter by ${w}`}
                >
                  <Building2 size={13} />
                  <span>{w.replace(/ (Workspace|Team|Hub|Studio|Lab)/i, "")}</span>
                  <span className="ap-chip-badge">{wsCount}</span>
                </button>
              );
            })}
          </div>

          <div className="ap-toolbar-row">
            <div className="ap-search-input-wrap">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search by name, owner, or workspace..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="ap-filters-group">
              {/* STATUS FILTER */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter status"
              >
                {projectStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All Statuses" : s}
                  </option>
                ))}
              </select>

              {/* WORKSPACE FILTER */}
              <select
                value={workspaceFilter}
                onChange={(e) => handleWorkspaceChange(e.target.value)}
                aria-label="Filter workspace"
                className="ap-workspace-select"
              >
                <option value="All">All Workspaces</option>
                {availableWorkspaces.filter((w) => w !== "All").map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>

              {/* MEMBERS FILTER */}
              <select
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
                aria-label="Filter member"
              >
                {teamMembersList.map((m) => (
                  <option key={m} value={m}>
                    {m === "All" ? "All Members" : m}
                  </option>
                ))}
              </select>

              {/* SORT DROPDOWN */}
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                aria-label="Sort projects"
              >
                <option value="recentlyUpdated">Recently Updated</option>
                <option value="name-asc">Name (A to Z)</option>
                <option value="name-desc">Name (Z to A)</option>
                <option value="progress-desc">Highest Progress</option>
                <option value="dueDate">Due Date</option>
              </select>

              {/* RESET FILTERS BUTTON */}
              {(workspaceFilter !== "All" || statusFilter !== "All" || memberFilter !== "All" || priorityFilter !== "All" || search !== "") && (
                <button
                  type="button"
                  className="ap-btn-reset-filters"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setMemberFilter("All");
                    setPriorityFilter("All");
                    handleWorkspaceChange("All");
                  }}
                  title="Reset all active filters"
                >
                  <RotateCcw size={13} />
                  <span>Reset Filters</span>
                </button>
              )}

              {/* LAYOUT GRID / LIST TOGGLE ICONS */}
              <div className="ap-layout-icons">
                <button
                  type="button"
                  className={`ap-layout-btn ${viewMode === "kanban" ? "active" : ""}`}
                  onClick={() => setViewMode("kanban")}
                  title="Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  className={`ap-layout-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>

              {/* EXPORT DROPDOWN */}
              <div className="ap-export-dropdown-wrap">
                <button
                  type="button"
                  className="ap-btn-export-trigger"
                  onClick={() => setExportOpen((prev) => !prev)}
                  title="Export options"
                >
                  <Download size={14} />
                  <span>Export</span>
                </button>

                {exportOpen && (
                  <div className="ap-export-menu">
                    <button type="button" onClick={handleExportCSV}>Export as CSV (.csv)</button>
                    <button type="button" onClick={handleExportJSON}>Export as JSON (.json)</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================
             5. MAIN VIEW AREA (KANBAN CARDS / LIST TABLE / TIMELINE)
          ========================================================= */}

          {/* ACTIVE WORKSPACE FILTER BANNER */}
          {workspaceFilter !== "All" && (
            <div className="ap-active-workspace-banner">
              <div className="ap-active-workspace-left">
                <FolderKanban size={16} />
                <span>
                  Showing projects for workspace: <strong>{workspaceFilter}</strong> ({filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"})
                </span>
              </div>
              <button
                type="button"
                className="ap-clear-ws-filter-btn"
                onClick={() => handleWorkspaceChange("All")}
                title="Show projects across all workspaces"
              >
                <X size={13} />
                <span>Show All Workspaces</span>
              </button>
            </div>
          )}

          {/* KANBAN / CARDS VIEW */}
          {viewMode === "kanban" && (
            <div className="ap-two-col-layout">
              {/* LEFT 75%: PROJECT CARDS GRID */}
              <div className="ap-cards-grid-col">
                {filteredProjects.length === 0 ? (
                  <div className="ap-empty-state-card">
                    <FolderKanban size={36} />
                    <h3>No projects match your filter</h3>
                    <p>Try searching for a different keyword or reset active filters.</p>
                    <button
                      type="button"
                      className="ap-btn-reset-filters"
                      onClick={() => {
                        setSearch("");
                        setStatusFilter("All");
                        handleWorkspaceChange("All");
                        setPriorityFilter("All");
                        setMemberFilter("All");
                      }}
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="ap-projects-cards-grid">
                    {paginatedProjects.map((p) => {
                      const completed = p.completedTasks !== undefined ? p.completedTasks : Math.round((p.tasks * p.progress) / 100);
                      const isMenuOpen = activeMenuId === p.id;

                      return (
                        <div key={p.id} className="ap-project-card">
                          {/* CARD HEADER */}
                          <div className="ap-pcard-header">
                            <div
                              className="ap-pcard-icon-chip"
                              style={{
                                backgroundColor: `${p.color || "#6366f1"}15`,
                                color: p.color || "#6366f1",
                              }}
                            >
                              {renderProjectIcon(p.iconType, p.color)}
                            </div>

                            <span className={`ap-pcard-status-badge ${p.status.toLowerCase().replace(/\s+/g, "-")}`}>
                              {(p.status === "Active" || p.status === "In Progress") && (
                                <span className="ap-live-pulse-dot" />
                              )}
                              <span>{p.status}</span>
                            </span>

                            {/* 3-DOTS ACTION MENU */}
                            <div className="ap-pcard-menu-anchor" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                className="ap-pcard-menu-btn"
                                onClick={() => setActiveMenuId(isMenuOpen ? null : p.id)}
                                aria-label="Card options"
                              >
                                <MoreVertical size={15} />
                              </button>

                              {isMenuOpen && (
                                <div className="ap-pcard-dropdown">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      openEditModal(p);
                                    }}
                                  >
                                    <Pencil size={13} />
                                    <span>Edit Project</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      handleDuplicate(p);
                                    }}
                                  >
                                    <Copy size={13} />
                                    <span>Duplicate</span>
                                  </button>
                                  <button
                                    type="button"
                                    className="delete"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setProjectToDelete(p);
                                    }}
                                  >
                                    <Trash2 size={13} />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* TITLE & DESCRIPTION */}
                          <h4
                            className="ap-pcard-title"
                            onClick={() => openEditModal(p)}
                            title={`Edit ${p.name}`}
                          >
                            {p.name}
                          </h4>
                          <p className="ap-pcard-desc">{p.description}</p>

                          {/* WORKSPACE META PILL */}
                          <div className="ap-pcard-meta-row">
                            <span className="ap-pcard-ws-tag" title={`Workspace: ${p.workspace}`}>
                              <Building2 size={11} />
                              <span>{p.workspace}</span>
                            </span>
                          </div>

                          {/* TASKS PROGRESS BAR */}
                          <div className="ap-pcard-tasks-row">
                            <span className="ap-pcard-tasks-count">
                              {completed} / {p.tasks} tasks
                            </span>
                            <span className="ap-pcard-tasks-pct">{p.progress}%</span>
                          </div>
                          <div className="ap-pcard-meter-track">
                            <div
                              className="ap-pcard-meter-fill ap-animated-meter"
                              style={{
                                width: `${p.progress}%`,
                                backgroundColor: p.color || "#6366f1",
                              }}
                            >
                              <span className="ap-meter-live-glow" />
                            </div>
                          </div>

                          {/* FOOTER: AVATARS, DUE DATE, PRIORITY */}
                          <div className="ap-pcard-footer">
                            <div className="ap-avatar-stack">
                              {p.team?.slice(0, 2).map((member, i) => (
                                <span
                                  key={i}
                                  className="ap-avatar-circle"
                                  style={{ backgroundColor: member.color || "#6366f1" }}
                                  title={member.name}
                                >
                                  {member.avatar}
                                </span>
                              ))}
                              {p.extraMembers > 0 && (
                                <span className="ap-avatar-circle ap-avatar-extra">
                                  +{p.extraMembers}
                                </span>
                              )}
                            </div>

                            <div className="ap-pcard-due-date">
                              <Calendar size={13} />
                              <span>{p.dueDate}</span>
                            </div>

                            <span className={`ap-pcard-priority-pill ${p.priority.toLowerCase()}`}>
                              {p.priority}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* PROJECT CARDS PAGINATION BAR */}
                {renderPaginationBar()}
              </div>

              {/* RIGHT 25%: SIDEBAR (My Projects + Recent Activity) */}
              <div className="ap-sidebar-col">
                {/* 1. MY PROJECTS CARD */}
                <div className="ap-sidebar-card">
                  <div className="ap-sidebar-card-header">
                    <h4>My Projects</h4>
                    <button
                      type="button"
                      className="ap-view-all-link"
                      onClick={() => {
                        setMemberFilter("Rahul Sharma");
                        showToast("Filtered to projects created by you.");
                      }}
                    >
                      <span>View all</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="ap-my-projects-list">
                    <div className="ap-my-proj-item">
                      <div className="ap-my-proj-label">
                        <Users size={14} className="ap-icon-muted" />
                        <span>Created by me</span>
                      </div>
                      <strong className="ap-my-proj-count">5</strong>
                    </div>

                    <div className="ap-my-proj-item">
                      <div className="ap-my-proj-label">
                        <UserCheck size={14} className="ap-icon-muted" />
                        <span>Assigned to me</span>
                      </div>
                      <strong className="ap-my-proj-count">8</strong>
                    </div>

                    <div className="ap-my-proj-item">
                      <div className="ap-my-proj-label">
                        <Layers size={14} className="ap-icon-muted" />
                        <span>I'm a member</span>
                      </div>
                      <strong className="ap-my-proj-count">12</strong>
                    </div>
                  </div>
                </div>

                {/* 2. RECENT ACTIVITY CARD */}
                <div className="ap-sidebar-card">
                  <div className="ap-sidebar-card-header">
                    <h4>Recent Activity</h4>
                    <button
                      type="button"
                      className="ap-view-all-link"
                      onClick={() => showToast("Navigating to full activity logs...", "info")}
                    >
                      <span>View all</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="ap-activity-timeline">
                    {recentActivities.map((act) => (
                      <div key={act.id} className="ap-act-timeline-item">
                        <span className={`ap-act-dot ${act.type}`} />
                        <span className="ap-act-avatar" style={{ backgroundColor: act.color }}>
                          {act.avatar}
                        </span>
                        <div className="ap-act-details">
                          <p>
                            <strong>{act.user}</strong> {act.action}{" "}
                            <span className="ap-act-proj-name">{act.project}</span>
                          </p>
                          <small>{act.time}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LIST / TABLE VIEW */}
          {viewMode === "list" && (
            <div className="ap-list-card">
              <div className="ap-table-wrap">
                <table className="ap-projects-table">
                  <thead>
                    <tr>
                      <th>PROJECT NAME</th>
                      <th>WORKSPACE</th>
                      <th>STATUS</th>
                      <th>PRIORITY</th>
                      <th>PROGRESS</th>
                      <th>TASKS</th>
                      <th>DUE DATE</th>
                      <th>MEMBERS</th>
                      <th style={{ textAlign: "right" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProjects.map((p) => {
                      const completed = p.completedTasks !== undefined ? p.completedTasks : Math.round((p.tasks * p.progress) / 100);
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="ap-table-name-cell">
                              <span
                                className="ap-table-icon"
                                style={{
                                  backgroundColor: `${p.color || "#6366f1"}15`,
                                  color: p.color || "#6366f1",
                                }}
                              >
                                {renderProjectIcon(p.iconType, p.color)}
                              </span>
                              <div>
                                <strong
                                  className="ap-table-title"
                                  onClick={() => openEditModal(p)}
                                  title={`Edit ${p.name}`}
                                >
                                  {p.name}
                                </strong>
                                <small>{p.owner}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="ap-table-workspace-tag">{p.workspace}</span>
                          </td>
                          <td>
                            <span className={`ap-pcard-status-badge ${p.status.toLowerCase().replace(/\s+/g, "-")}`}>
                              {p.status}
                            </span>
                          </td>
                          <td>
                            <span className={`ap-pcard-priority-pill ${p.priority.toLowerCase()}`}>
                              {p.priority}
                            </span>
                          </td>
                          <td>
                            <div className="ap-table-progress-wrap">
                              <div className="ap-pcard-meter-track">
                                <div
                                  className="ap-pcard-meter-fill"
                                  style={{
                                    width: `${p.progress}%`,
                                    backgroundColor: p.color || "#6366f1",
                                  }}
                                />
                              </div>
                              <span>{p.progress}%</span>
                            </div>
                          </td>
                          <td>
                            <span className="ap-table-tasks">{completed}/{p.tasks}</span>
                          </td>
                          <td>
                            <span className="ap-table-due-date">{p.dueDate}</span>
                          </td>
                          <td>
                            <div className="ap-avatar-stack">
                              {p.team?.slice(0, 2).map((m, i) => (
                                <span
                                  key={i}
                                  className="ap-avatar-circle"
                                  style={{ backgroundColor: m.color || "#6366f1" }}
                                >
                                  {m.avatar}
                                </span>
                              ))}
                              {p.extraMembers > 0 && (
                                <span className="ap-avatar-circle ap-avatar-extra">
                                  +{p.extraMembers}
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div className="ap-table-actions">
                              <button
                                type="button"
                                className="action-btn"
                                onClick={() => openEditModal(p)}
                                title="Edit project"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                type="button"
                                className="action-btn"
                                onClick={() => handleDuplicate(p)}
                                title="Duplicate"
                              >
                                <Copy size={14} />
                              </button>
                              <button
                                type="button"
                                className="action-btn delete"
                                onClick={() => setProjectToDelete(p)}
                                title="Delete"
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

              {/* TABLE LIST PAGINATION BAR */}
              {renderPaginationBar()}
            </div>
          )}

          {/* TIMELINE / GANTT VIEW */}
          {viewMode === "timeline" && (
            <div className="ap-timeline-card">
              <div className="ap-timeline-header">
                <h3>Project Schedules & Timeline Deliverables</h3>
                <small>Chronological milestone tracking across upcoming sprint quarters.</small>
              </div>

              <div className="ap-timeline-body">
                {paginatedProjects.map((p) => {
                  return (
                    <div key={p.id} className="ap-timeline-row">
                      <div className="ap-timeline-proj-info">
                        <strong>{p.name}</strong>
                        <small>{p.workspace} • Due {p.dueDate}</small>
                      </div>
                      <div className="ap-timeline-track">
                        <div
                          className="ap-timeline-bar"
                          style={{
                            width: `${Math.max(25, p.progress)}%`,
                            backgroundColor: p.color || "#6366f1",
                          }}
                        >
                          <span>{p.progress}% Complete</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TIMELINE PAGINATION BAR */}
              {renderPaginationBar()}
            </div>
          )}
        </main>
      </div>

      {/* =========================================================
         MODALS: CREATE / EDIT / VIEW / DELETE CONFIRMATION
      ========================================================= */}

      {/* CREATE & EDIT MODAL */}
      {showCreateModal && (
        <div
          className="ap-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <div className="ap-modal-box">
            <div className="ap-modal-header">
              <div className="ap-modal-header-left">
                <div
                  className="ap-modal-icon-badge"
                  style={{
                    backgroundColor: `${form.color || "#6366f1"}15`,
                    color: form.color || "#6366f1",
                  }}
                >
                  <Folder size={18} />
                </div>
                <div>
                  <div className="ap-modal-title-row">
                    <h2>{editingProject ? "Edit Project" : "Create New Project"}</h2>
                    {editingProject && (
                      <span className={`ap-pcard-status-badge ${form.status.toLowerCase().replace(/\s+/g, "-")}`}>
                        {form.status}
                      </span>
                    )}
                  </div>
                  <p>
                    {editingProject
                      ? "Update project settings, workspace allocation, priority and deadlines."
                      : "Organize sprints, assign workspace ownership, and track progress."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="ap-modal-close"
                onClick={() => setShowCreateModal(false)}
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="ap-modal-form">
              {/* PROJECT TITLE */}
              <div className="ap-form-group">
                <label htmlFor="ap-proj-name">
                  Project Title <span className="ap-required">*</span>
                </label>
                <input
                  id="ap-proj-name"
                  type="text"
                  required
                  placeholder="e.g. Website Redesign"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* WORKSPACE & OWNER */}
              <div className="ap-form-grid-2">
                <div className="ap-form-group">
                  <label htmlFor="ap-proj-workspace">Workspace</label>
                  <div className="ap-select-wrap">
                    <select
                      id="ap-proj-workspace"
                      value={form.workspace}
                      onChange={(e) => setForm({ ...form, workspace: e.target.value })}
                    >
                      {availableWorkspaces
                        .filter((w) => w !== "All")
                        .map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="ap-select-chevron" />
                  </div>
                </div>

                <div className="ap-form-group">
                  <label htmlFor="ap-proj-owner">Project Owner</label>
                  <div className="ap-select-wrap">
                    <select
                      id="ap-proj-owner"
                      value={form.owner}
                      onChange={(e) => setForm({ ...form, owner: e.target.value })}
                    >
                      {teamMembersList
                        .filter((m) => m !== "All")
                        .map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="ap-select-chevron" />
                  </div>
                </div>
              </div>

              {/* STATUS & PRIORITY */}
              <div className="ap-form-grid-2">
                <div className="ap-form-group">
                  <label htmlFor="ap-proj-status">Status</label>
                  <div className="ap-select-wrap">
                    <select
                      id="ap-proj-status"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                    <ChevronDown size={14} className="ap-select-chevron" />
                  </div>
                </div>

                <div className="ap-form-group">
                  <label htmlFor="ap-proj-priority">Priority</label>
                  <div className="ap-select-wrap">
                    <select
                      id="ap-proj-priority"
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                      <option value="Critical">Critical</option>
                    </select>
                    <ChevronDown size={14} className="ap-select-chevron" />
                  </div>
                </div>
              </div>

              {/* TASKS & SCHEDULE */}
              <div className="ap-form-grid-3">
                <div className="ap-form-group">
                  <label htmlFor="ap-proj-tasks">Total Tasks</label>
                  <input
                    id="ap-proj-tasks"
                    type="number"
                    min="1"
                    value={form.tasks}
                    onChange={(e) =>
                      setForm({ ...form, tasks: Math.max(1, parseInt(e.target.value) || 1) })
                    }
                  />
                </div>

                <div className="ap-form-group">
                  <label htmlFor="ap-proj-completed">Completed</label>
                  <input
                    id="ap-proj-completed"
                    type="number"
                    min="0"
                    value={form.completedTasks}
                    onChange={(e) =>
                      setForm({ ...form, completedTasks: Math.max(0, parseInt(e.target.value) || 0) })
                    }
                  />
                </div>

                <div className="ap-form-group">
                  <label htmlFor="ap-proj-due">Due Date</label>
                  <input
                    id="ap-proj-due"
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </div>
              </div>

              {/* LIVE PROGRESS FEEDBACK */}
              <div className="ap-modal-progress-preview">
                <div className="ap-modal-prog-header">
                  <span>Milestone Completion</span>
                  <strong>
                    {form.tasks > 0
                      ? Math.min(100, Math.round((Number(form.completedTasks) / Number(form.tasks)) * 100))
                      : 0}
                    %
                  </strong>
                </div>
                <div className="ap-pcard-meter-track">
                  <div
                    className="ap-pcard-meter-fill"
                    style={{
                      width: `${
                        form.tasks > 0
                          ? Math.min(100, Math.round((Number(form.completedTasks) / Number(form.tasks)) * 100))
                          : 0
                      }%`,
                      backgroundColor: form.color || "#6366f1",
                    }}
                  />
                </div>
                <span className="ap-modal-prog-sub">
                  {form.completedTasks || 0} of {form.tasks || 0} tasks completed
                </span>
              </div>

              {/* DESCRIPTION */}
              <div className="ap-form-group">
                <label htmlFor="ap-proj-desc">Description</label>
                <textarea
                  id="ap-proj-desc"
                  rows={3}
                  placeholder="Summarize project milestones, goals, and sprint objectives..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* COLOR ACCENT PICKER */}
              <div className="ap-form-group">
                <label>Project Color Accent</label>
                <div className="ap-color-picker-row">
                  {[
                    { color: "#6366f1", label: "Indigo" },
                    { color: "#3b82f6", label: "Blue" },
                    { color: "#10b981", label: "Emerald" },
                    { color: "#f59e0b", label: "Amber" },
                    { color: "#ef4444", label: "Red" },
                    { color: "#8b5cf6", label: "Purple" },
                    { color: "#06b6d4", label: "Cyan" },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      className={`ap-color-chip ${form.color === c.color ? "active" : ""}`}
                      style={{ backgroundColor: c.color }}
                      onClick={() => setForm({ ...form, color: c.color })}
                      title={c.label}
                    >
                      {form.color === c.color && <Check size={12} color="#ffffff" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="ap-modal-footer">
                <button
                  type="button"
                  className="ap-btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ap-btn-submit">
                  <Check size={15} />
                  <span>{editingProject ? "Save Changes" : "Create Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {projectToDelete && (
        <div
          className="ap-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setProjectToDelete(null);
          }}
        >
          <div className="ap-modal-box ap-modal-sm">
            <div className="ap-delete-icon-circle">
              <Trash2 size={24} />
            </div>
            <h3>Delete Project "{projectToDelete.name}"?</h3>
            <p>
              Are you sure you want to delete this project? All associated tasks, milestones, and member assignments will be permanently removed.
            </p>
            <div className="ap-modal-footer">
              <button
                type="button"
                className="ap-btn-cancel"
                onClick={() => setProjectToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ap-btn-danger"
                onClick={confirmDeleteProject}
              >
                <Trash2 size={16} /> Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
