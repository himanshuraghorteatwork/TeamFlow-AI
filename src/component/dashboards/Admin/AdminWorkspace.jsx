import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Users,
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  Minus,
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
  Check,
  MoreVertical,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  HardDrive,
  Building2,
  SlidersHorizontal,
  Star,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Clock,
  UserPlus,
  FileText,
  Sparkles,
  Layers,
  ChevronRight,
  Database,
  Cpu,
  Activity,
  Info,
  Eye,
  Globe,
  Tag,
  User,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import { initialAdminProjects } from "./adminProjectsData.js";
import { initialWorkspaceActivities } from "./adminWorkspaceData.js";
import "./AdminWorkspace.css";

const STORAGE_KEY = "teamflow_admin_workspaces_v2";
const ACTIVITY_STORAGE_KEY = "teamflow_admin_workspace_activities_v2";

const defaultTeamAvatars = [
  { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=faces" },
  { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=faces" },
  { name: "Amit Kumar", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=60&h=60&fit=crop&crop=faces" },
  { name: "Sneha Singh", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop&crop=faces" },
];

export const INITIAL_WORKSPACES = [
  {
    id: 1,
    name: "TeamFlow Workspace",
    initials: "TF",
    slug: "teamflow-main",
    status: "Active",
    owner: "Amit Sharma",
    email: "amit@abctech.com",
    plan: "Enterprise",
    description: "Main workspace for product development and team collaboration.",
    members: 24,
    projects: 12,
    storage: 72,
    quota: 100,
    color: "#6366f1",
    bannerClass: "ws-banner--purple",
    team: defaultTeamAvatars,
    extraMembers: 20,
    created: "2026-10-21",
  },
  {
    id: 2,
    name: "Marketing Team",
    initials: "M",
    slug: "marketing-team",
    status: "Active",
    owner: "Sarah Chen",
    email: "sarah@modernlab.com",
    plan: "Business",
    description: "Marketing campaigns, content, and brand management.",
    members: 16,
    projects: 9,
    storage: 88,
    quota: 100,
    color: "#0284c7",
    bannerClass: "ws-banner--blue",
    team: defaultTeamAvatars,
    extraMembers: 12,
    created: "2026-10-18",
  },
  {
    id: 3,
    name: "Development Hub",
    initials: "D",
    slug: "development-hub",
    status: "Active",
    owner: "David Lee",
    email: "david@techcorp.com",
    plan: "Pro",
    description: "Engineering, development, and technical infrastructure.",
    members: 18,
    projects: 7,
    storage: 45,
    quota: 100,
    color: "#059669",
    bannerClass: "ws-banner--green",
    team: defaultTeamAvatars,
    extraMembers: 12,
    created: "2026-10-15",
  },
  {
    id: 4,
    name: "Research Lab",
    initials: "R",
    slug: "research-lab",
    status: "Inactive",
    owner: "Alex Morgan",
    email: "alex@researchlab.com",
    plan: "Business",
    description: "AI research, experimentation, and innovation projects.",
    members: 12,
    projects: 4,
    storage: 32,
    quota: 100,
    color: "#ea580c",
    bannerClass: "ws-banner--orange",
    team: defaultTeamAvatars,
    extraMembers: 8,
    created: "2026-10-10",
  },
  {
    id: 5,
    name: "Startup Team",
    initials: "S",
    slug: "startup-team",
    status: "Active",
    owner: "Michael Rodriguez",
    email: "michael@startup.io",
    plan: "Free",
    description: "Early-stage product development and MVP initiatives.",
    members: 8,
    projects: 3,
    storage: 18,
    quota: 100,
    color: "#db2777",
    bannerClass: "ws-banner--pink",
    team: defaultTeamAvatars,
    extraMembers: 6,
    created: "2026-10-06",
  },
  {
    id: 6,
    name: "Design Studio",
    initials: "U",
    slug: "design-studio",
    status: "Active",
    owner: "Emily Parker",
    email: "emily@designhub.com",
    plan: "Pro",
    description: "UI/UX-design, product branding, and creative assets.",
    members: 14,
    projects: 6,
    storage: 54,
    quota: 100,
    color: "#7c3aed",
    bannerClass: "ws-banner--violet",
    team: defaultTeamAvatars,
    extraMembers: 10,
    created: "2026-10-04",
  },
  {
    id: 7,
    name: "Finance Ops",
    initials: "F",
    slug: "finance-ops",
    status: "Suspended",
    owner: "Jessica Taylor",
    email: "jessica@financeops.com",
    plan: "Enterprise",
    description: "Financial planning, budgeting, and operations.",
    members: 10,
    projects: 5,
    storage: 40,
    quota: 100,
    color: "#d97706",
    bannerClass: "ws-banner--amber",
    team: defaultTeamAvatars,
    extraMembers: 6,
    created: "2026-09-28",
  },
];

const loadStoredWorkspaces = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to load workspaces:", e);
  }
  return INITIAL_WORKSPACES;
};


const formatDetailKey = (key) => {
  const keyMap = {
    workspace: "Target Workspace",
    members: "Member Allocation",
    quota: "Storage Quota",
    storageQuota: "Storage Quota",
    currentUsage: "Current Usage",
    plan: "Subscription Tier",
    tier: "Plan Tier",
    projects: "Linked Projects",
    projectsAdded: "Projects Provisioned",
    assignedOwner: "Workspace Owner",
    previousSeats: "Previous Seat Count",
    updatedSeats: "Updated Seat Count",
    previousQuota: "Previous Quota",
    newQuota: "New Quota",
    adjustment: "Quota Delta",
    previousStatus: "Previous Status",
    newStatus: "New Status",
    reason: "Operation Reason",
    synchronizedCount: "Sync Project Count",
    activeProjects: "Active Project Boards",
    status: "Lifecycle State",
    storagePreserved: "Preserved Storage",
    invitedEmail: "Invited Email Address",
    role: "Assigned Role",
    projectId: "Project Reference",
    tasksCount: "Active Task Count",
    auditedSeats: "Audited Seat Count",
    complianceStatus: "Compliance Status",
    initialProjects: "Initial Projects",
  };
  if (keyMap[key]) return keyMap[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const formatDetailValue = (key, val) => {
  if (Array.isArray(val)) {
    return (
      <div className="ws-param-pills-list">
        {val.map((item, idx) => (
          <span key={idx} className="ws-param-pill-tag">
            {item}
          </span>
        ))}
      </div>
    );
  }
  if (typeof val === "number") {
    if (key.toLowerCase().includes("quota") && !String(val).includes("GB")) {
      return `${val} GB`;
    }
    return val.toLocaleString();
  }
  if (typeof val === "boolean") {
    return val ? "Enabled" : "Disabled";
  }
  return String(val);
};

const getParamIcon = (key) => {
  const k = (key || "").toLowerCase();
  if (k.includes("workspace") || k.includes("target")) return <Building2 size={13} />;
  if (k.includes("member") || k.includes("seat") || k.includes("user") || k.includes("owner") || k.includes("allocation")) return <Users size={13} />;
  if (k.includes("quota") || k.includes("storage") || k.includes("usage")) return <HardDrive size={13} />;
  if (k.includes("project") || k.includes("task")) return <FolderKanban size={13} />;
  if (k.includes("tier") || k.includes("plan")) return <Sparkles size={13} />;
  if (k.includes("role") || k.includes("compliance") || k.includes("security")) return <ShieldCheck size={13} />;
  if (k.includes("status") || k.includes("state")) return <CheckCircle2 size={13} />;
  return <Layers size={13} />;
};

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export default function AdminWorkspace() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState(loadStoredWorkspaces);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Active workspace tracking
  const [activeWorkspaceSlug, setActiveWorkspaceSlug] = useState(() => {
    return localStorage.getItem("teamflow_active_workspace_slug") || "teamflow-main";
  });

  // Workspace Page Tabs: 'workspaces' | 'activity'
  const [activeTab, setActiveTab] = useState("workspaces");

  // Workspace Activity Logs State (Live synchronized with Analytics & local storage)
  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialWorkspaceActivities;
  });

  const [activitySearch, setActivitySearch] = useState("");
  const [activityCategory, setActivityCategory] = useState("All");
  const [activitySeverity, setActivitySeverity] = useState("All");
  const [activityPage, setActivityPage] = useState(1);
  const [activityPageSize, setActivityPageSize] = useState(5);
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const saved = localStorage.getItem(ACTIVITY_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setActivities(parsed);
        }
      } catch (e) {}
    };

    window.addEventListener("teamflow_data_update", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener("teamflow_data_update", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  // Filtered & Paginated Workspace Activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const q = activitySearch.toLowerCase().trim();
      const matchesQ =
        !q ||
        (act.action || "").toLowerCase().includes(q) ||
        (act.workspace || "").toLowerCase().includes(q) ||
        (act.user || "").toLowerCase().includes(q) ||
        (act.id || "").toLowerCase().includes(q);

      const matchesCat =
        activityCategory === "All" || act.category === activityCategory;
      const matchesSev =
        activitySeverity === "All" || act.severity === activitySeverity;

      return matchesQ && matchesCat && matchesSev;
    });
  }, [activities, activitySearch, activityCategory, activitySeverity]);

  const totalActivityPages = Math.max(1, Math.ceil(filteredActivities.length / activityPageSize));
  const paginatedActivities = useMemo(() => {
    const start = (activityPage - 1) * activityPageSize;
    return filteredActivities.slice(start, start + activityPageSize);
  }, [filteredActivities, activityPage, activityPageSize]);

  const handleExportActivityCSV = () => {
    const headers = ["ID", "Workspace", "Action", "Category", "Severity", "Actor", "Role", "Timestamp"];
    const rows = filteredActivities.map((a) => [
      `"${a.id}"`,
      `"${a.workspace}"`,
      `"${(a.action || "").replace(/"/g, '""')}"`,
      `"${a.category}"`,
      `"${a.severity}"`,
      `"${a.user}"`,
      `"${a.role}"`,
      `"${a.fullDate || a.time}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `workspace-activity-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Exported workspace activity logs to CSV.", "success");
  };

  // Workspace Activity Audit Logger (Logged to Analytics & Workspace Tab)
  const logWorkspaceActivity = (action, category, severity, details = {}, workspaceName = "TeamFlow Workspace") => {
    const newLog = {
      id: `WSA-${Date.now().toString().slice(-4)}`,
      workspace: workspaceName,
      action,
      category,
      severity,
      user: "Amit Sharma",
      role: "Org Admin",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      time: "Just now",
      fullDate: new Date().toISOString().replace("T", " ").slice(0, 19),
      ip: "192.168.1.10",
      details,
    };
    try {
      const saved = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      let list = saved ? JSON.parse(saved) : initialWorkspaceActivities;
      if (!Array.isArray(list)) list = initialWorkspaceActivities;
      const updatedList = [newLog, ...list];
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(updatedList));
      setActivities(updatedList);
      window.dispatchEvent(new Event("teamflow_data_update"));
    } catch (e) {}
  };

  // Helper to sync workspace projects into teamflow_admin_projects_v2
  const syncWorkspaceProjects = (workspace, projectCount, oldName = null) => {
    try {
      const saved = localStorage.getItem("teamflow_admin_projects_v2");
      let currentProjects = saved ? JSON.parse(saved) : initialAdminProjects;
      if (!Array.isArray(currentProjects)) currentProjects = initialAdminProjects;

      // Update workspace name if renamed
      if (oldName && oldName !== workspace.name) {
        currentProjects = currentProjects.map((p) =>
          p.workspace === oldName ? { ...p, workspace: workspace.name } : p
        );
      }

      // Check existing projects for this workspace
      const existing = currentProjects.filter(
        (p) => (p.workspace || "").toLowerCase() === (workspace.name || "").toLowerCase()
      );

      const toAdd = Math.max(0, projectCount - existing.length);
      if (toAdd > 0) {
        const templates = [
          { name: `${workspace.name} Core Initiative`, desc: `Primary deliverables, sprint velocity, and operational milestones for ${workspace.name}.`, priority: "High", progress: 65, tasks: 14, completed: 9 },
          { name: `${workspace.name} Roadmap & Delivery`, desc: `Product lifecycle tracking, team tasks, and cross-functional sync.`, priority: "Medium", progress: 40, tasks: 10, completed: 4 },
          { name: `${workspace.name} Architecture & Cloud Sync`, desc: `Technical integrations, webhooks, and infrastructure assets for ${workspace.name}.`, priority: "High", progress: 85, tasks: 12, completed: 10 },
          { name: `${workspace.name} Analytics & QA`, desc: `Automated test suites, performance benchmarks, and analytics dashboards.`, priority: "Low", progress: 20, tasks: 8, completed: 2 },
          { name: `${workspace.name} Compliance & Governance`, desc: `Security reviews, team runbooks, and enterprise governance.`, priority: "Critical", progress: 50, tasks: 6, completed: 3 },
        ];

        const newProjects = [];
        for (let i = 0; i < toAdd; i++) {
          const tpl = templates[i % templates.length];
          newProjects.push({
            id: Date.now() + i + Math.floor(Math.random() * 1000),
            name: existing.length === 0 && i === 0 ? tpl.name : `${workspace.name} Project ${existing.length + i + 1}`,
            workspace: workspace.name,
            owner: workspace.owner || "Amit Sharma",
            ownerEmail: workspace.email || "amit@teamflow.ai",
            status: "Active",
            priority: tpl.priority,
            description: tpl.desc,
            tasks: tpl.tasks,
            completedTasks: tpl.completed,
            progress: tpl.progress,
            dueDate: new Date(Date.now() + (20 + i * 15) * 86400000).toISOString().split("T")[0],
            createdAt: new Date().toISOString().split("T")[0],
            color: workspace.color || "#6366f1",
            iconType: "layout",
            team: [
              { name: workspace.owner || "Amit Sharma", avatar: (workspace.owner || "AS").slice(0, 2).toUpperCase(), color: workspace.color || "#6366f1" },
            ],
            extraMembers: Math.max(0, (Number(workspace.members) || 1) - 1),
          });
        }

        currentProjects = [...newProjects, ...currentProjects];
      }

      localStorage.setItem("teamflow_admin_projects_v2", JSON.stringify(currentProjects));
      window.dispatchEvent(new Event("teamflow_data_update"));
    } catch (e) {
      console.error("Failed to sync workspace projects:", e);
    }
  };

  // Opened Workspace Modal & Tab state
  const [openedWorkspace, setOpenedWorkspace] = useState(null);
  const [openedTab, setOpenedTab] = useState("overview"); // "overview" | "projects" | "members" | "storage" | "activity"
  const [projectSearch, setProjectSearch] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("All");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [workspaceMembersList, setWorkspaceMembersList] = useState([]);

  // View Mode: 'grid' | 'list' | 'kanban'
  const [viewMode, setViewMode] = useState("grid");

  // Filters & Sorting
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recent");

  // Multi-select & Dropdowns
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Pagination state for Table format
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    slug: "",
    initials: "",
    owner: "Amit Sharma",
    email: "amit@abctech.com",
    plan: "Pro",
    status: "Active",
    members: 12,
    projects: 4,
    storage: 35,
    quota: 100,
    color: "#6366f1",
    bannerClass: "ws-banner--purple",
    description: "",
  });

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".ws-card-menu-container") && !e.target.closest(".ws-table-menu-container")) {
        setActiveMenuId(null);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Save to localStorage
  const saveWorkspaces = (newWorkspaces, toastMsg) => {
    setWorkspaces(newWorkspaces);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newWorkspaces));
    } catch (e) {
      console.error(e);
    }
    if (toastMsg) showToast(toastMsg);
  };

  // Dynamic Statistics
  const stats = useMemo(() => {
    const total = workspaces.length;
    const active = workspaces.filter((w) => w.status === "Active").length;
    const suspended = workspaces.filter((w) => w.status === "Suspended" || w.status === "Inactive").length;
    const members = workspaces.reduce((acc, curr) => acc + (Number(curr.members) || 0) + (Number(curr.extraMembers) || 0), 0);
    return { total: total + 1, active: active > 0 ? active : 6, suspended: suspended > 0 ? suspended : 1, members: members > 0 ? members : 128 };
  }, [workspaces]);

  // Extract Owners List for Filter
  const ownersList = useMemo(() => {
    const set = new Set(workspaces.map((w) => w.owner).filter(Boolean));
    return Array.from(set);
  }, [workspaces]);



  // Filtered & Sorted Workspaces
  const filteredWorkspaces = useMemo(() => {
    let result = workspaces.filter((ws) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        ws.name?.toLowerCase().includes(q) ||
        ws.owner?.toLowerCase().includes(q) ||
        ws.email?.toLowerCase().includes(q) ||
        ws.plan?.toLowerCase().includes(q) ||
        ws.slug?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || ws.status === statusFilter;
      const matchesPlan = planFilter === "All" || ws.plan === planFilter;
      const matchesOwner = ownerFilter === "All" || ws.owner === ownerFilter;

      return matchesSearch && matchesStatus && matchesPlan && matchesOwner;
    });

    result.sort((a, b) => {
      if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "");
      if (sortBy === "members") return (b.members || 0) - (a.members || 0);
      if (sortBy === "storage") return (b.storage || 0) - (a.storage || 0);
      return (a.id || 0) - (b.id || 0);
    });

    return result;
  }, [workspaces, search, statusFilter, planFilter, ownerFilter, sortBy]);

  // Paginated Workspaces
  const totalPages = Math.max(1, Math.ceil(filteredWorkspaces.length / pageSize));
  const paginatedWorkspaces = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredWorkspaces.slice(start, start + pageSize);
  }, [filteredWorkspaces, currentPage, pageSize]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, planFilter, ownerFilter, sortBy, pageSize]);

  // Reusable Pagination Bar (Seamless Zero-Extra-Spacing Layout)
  const renderPaginationBar = (isTableFooter = false) => {
    if (filteredWorkspaces.length === 0) return null;
    return (
      <div className={`ws-pagination-bar ${isTableFooter ? "ws-pagination-table-footer" : ""}`}>
        <div className="ws-pagination-info">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filteredWorkspaces.length)} of {filteredWorkspaces.length} workspaces
          </span>
          <div className="ws-page-size-wrap">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              aria-label="Rows per page"
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </div>
        </div>

        <div className="ws-pagination-controls">
          <button
            type="button"
            className="ws-page-nav-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <div className="ws-page-pills">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                className={`ws-page-num-pill ${currentPage === num ? "active" : ""}`}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="ws-page-nav-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    );
  };


  // Open Create Modal
  const openCreateModal = () => {
    setEditingWorkspace(null);
    setForm({
      name: "",
      slug: "",
      initials: "NW",
      owner: "Amit Sharma",
      email: "amit@abctech.com",
      plan: "Pro",
      status: "Active",
      members: 12,
      projects: 4,
      storage: 30,
      quota: 100,
      color: "#6366f1",
      bannerClass: "ws-banner--purple",
      description: "",
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (ws) => {
    setEditingWorkspace(ws);
    setForm({
      name: ws.name || "",
      slug: ws.slug || "",
      initials: ws.initials || (ws.name ? ws.name.slice(0, 2).toUpperCase() : "WS"),
      owner: ws.owner || "Amit Sharma",
      email: ws.email || "amit@abctech.com",
      plan: ws.plan || "Pro",
      status: ws.status || "Active",
      members: ws.members || 8,
      projects: ws.projects || 3,
      storage: ws.storage || 20,
      quota: ws.quota || 100,
      color: ws.color || "#6366f1",
      bannerClass: ws.bannerClass || "ws-banner--purple",
      description: ws.description || "",
    });
    setActiveMenuId(null);
    setShowModal(true);
  };

  // Handle Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast("Workspace title is required.", "error");
      return;
    }

    const initials = form.initials.trim() || form.name.slice(0, 2).toUpperCase();
    const slug = form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const numMembers = Math.max(1, Number(form.members) || 1);
    const numProjects = Math.max(0, Number(form.projects) || 0);
    const numQuota = Math.max(1, Number(form.quota) || 100);
    const numStorage = Math.min(numQuota, Math.max(0, Number(form.storage) || 0));

    if (editingWorkspace) {
      const oldName = editingWorkspace.name;
      const updated = workspaces.map((w) =>
        w.id === editingWorkspace.id
          ? {
              ...w,
              ...form,
              initials,
              slug,
              members: numMembers,
              projects: numProjects,
              storage: numStorage,
              quota: numQuota,
            }
          : w
      );
      saveWorkspaces(updated, `Workspace "${form.name}" updated successfully.`);

      // Sync project updates if name changed or project quota adjusted
      syncWorkspaceProjects({ ...editingWorkspace, name: form.name, owner: form.owner, email: form.email, color: form.color }, numProjects, oldName);

      logWorkspaceActivity(
        `Updated workspace "${form.name}" quotas (${numQuota} GB quota, ${numMembers} members, ${numProjects} projects)`,
        "Storage Quotas",
        "info",
        { workspace: form.name, members: numMembers, quota: numQuota, storage: numStorage, projects: numProjects },
        form.name
      );
    } else {
      const newWs = {
        id: Date.now(),
        ...form,
        initials,
        slug,
        members: numMembers,
        projects: numProjects,
        storage: numStorage,
        quota: numQuota,
        team: defaultTeamAvatars,
        extraMembers: Math.max(0, numMembers - 4),
        created: new Date().toISOString().split("T")[0],
      };
      saveWorkspaces([newWs, ...workspaces], `Workspace "${form.name}" created.`);

      // Provision corresponding projects in Projects Dashboard!
      syncWorkspaceProjects(newWs, numProjects);

      logWorkspaceActivity(
        `Provisioned new workspace "${newWs.name}" (${numMembers} members, ${numQuota} GB quota, ${numProjects} projects)`,
        "Lifecycle",
        "success",
        { workspace: newWs.name, members: numMembers, quota: numQuota, projects: numProjects },
        newWs.name
      );
    }

    setShowModal(false);
  };

  // Duplicate Workspace
  const handleDuplicate = (ws) => {
    const clone = {
      ...ws,
      id: Date.now(),
      name: `${ws.name} (Copy)`,
      slug: `${ws.slug}-copy`,
      created: new Date().toISOString().split("T")[0],
    };
    saveWorkspaces([clone, ...workspaces], `Duplicated "${ws.name}".`);
    setActiveMenuId(null);
  };

  // Toggle Status
  const handleToggleStatus = (ws) => {
    const nextStatus = ws.status === "Active" ? "Inactive" : "Active";
    const updated = workspaces.map((w) => (w.id === ws.id ? { ...w, status: nextStatus } : w));
    saveWorkspaces(updated, `Workspace "${ws.name}" marked as ${nextStatus}.`);
    setActiveMenuId(null);
  };

  // Delete Workspace
  const confirmDeleteWorkspace = () => {
    if (!confirmDelete) return;
    const remaining = workspaces.filter((w) => w.id !== confirmDelete.id);
    saveWorkspaces(remaining, `Deleted "${confirmDelete.name}".`);
    setSelectedIds((prev) => prev.filter((id) => id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  // Reset to Demo Data
  const resetToDemo = () => {
    saveWorkspaces(INITIAL_WORKSPACES, "Restored default workspaces.");
    setSearch("");
    setStatusFilter("All");
    setPlanFilter("All");
    setOwnerFilter("All");
  };

  // Synchronize members list when openedWorkspace changes
  useEffect(() => {
    if (openedWorkspace) {
      setWorkspaceMembersList([
        {
          id: 1,
          name: openedWorkspace.owner || "Amit Sharma",
          email: openedWorkspace.email || "amit@teamflow.ai",
          role: "Workspace Owner",
          status: "Active",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=faces",
          initials: (openedWorkspace.owner || "AS").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
        },
        {
          id: 2,
          name: "Rahul Sharma",
          email: "rahul@teamflow.ai",
          role: "Team Lead",
          status: "Active",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=faces",
          initials: "RS",
        },
        {
          id: 3,
          name: "Priya Patel",
          email: "priya@teamflow.ai",
          role: "Member",
          status: "Active",
          avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=60&h=60&fit=crop&crop=faces",
          initials: "PP",
        },
        {
          id: 4,
          name: "Amit Kumar",
          email: "amit.k@teamflow.ai",
          role: "Member",
          status: "Active",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop&crop=faces",
          initials: "AK",
        },
        {
          id: 5,
          name: "Sneha Singh",
          email: "sneha@teamflow.ai",
          role: "Viewer",
          status: "Active",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=faces",
          initials: "SS",
        },
      ]);
    }
  }, [openedWorkspace]);

  // Open Workspace Action
  const handleOpenWorkspace = (ws) => {
    syncWorkspaceProjects(ws, ws.projects || 4);
    setOpenedWorkspace(ws);
    setOpenedTab("overview");
    setProjectSearch("");
    setProjectStatusFilter("All");
    setShowInviteForm(false);
  };

  // Set as Active Workspace
  const handleSetActiveWorkspace = (ws) => {
    try {
      localStorage.setItem("teamflow_active_workspace_slug", ws.slug);
      localStorage.setItem("teamflow_active_workspace", ws.name);
    } catch (e) {}
    setActiveWorkspaceSlug(ws.slug);
    showToast(`"${ws.name}" is now the active workspace across TeamFlow AI.`, "success");
  };

  // Copy Workspace Slug Link
  const handleCopySlug = (slug) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://teamflow.ai/workspaces/${slug}`);
      showToast("Workspace link copied to clipboard!");
    }
  };

  // Navigate to Projects Page with Workspace Filter
  const handleGoToProjects = (targetWorkspace = null, projectItem = null) => {
    const ws = (targetWorkspace && targetWorkspace.name) ? targetWorkspace : openedWorkspace;
    const wsName = ws?.name || "";
    if (ws) {
      syncWorkspaceProjects(ws, ws.projects || 4);
    }
    setOpenedWorkspace(null);
    if (wsName) {
      try {
        localStorage.setItem("teamflow_selected_project_workspace", wsName);
      } catch (e) {}
      if (projectItem && projectItem.name) {
        navigate(`/admin/projects?workspace=${encodeURIComponent(wsName)}&project=${encodeURIComponent(projectItem.name)}`);
      } else {
        navigate(`/admin/projects?workspace=${encodeURIComponent(wsName)}`);
      }
    } else {
      navigate("/admin/projects");
    }
  };

  // Open Edit Modal from Hub
  const handleEditFromHub = (ws) => {
    setOpenedWorkspace(null);
    openEditModal(ws);
  };

  // Add Member
  const handleInviteMember = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      showToast("Please enter an email address.", "error");
      return;
    }
    const newMember = {
      id: Date.now(),
      name: inviteEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "Invited",
      initials: inviteEmail.slice(0, 2).toUpperCase(),
    };
    setWorkspaceMembersList((prev) => [newMember, ...prev]);
    setInviteEmail("");
    setShowInviteForm(false);
    showToast(`Invitation sent to ${inviteEmail}.`, "success");
  };

  // Remove Member
  const handleRemoveMember = (id, name) => {
    setWorkspaceMembersList((prev) => prev.filter((m) => m.id !== id));
    showToast(`Removed ${name} from workspace.`, "success");
  };

  // Upgrade Storage Quota (+50GB)
  const handleUpgradeStorage = () => {
    if (!openedWorkspace) return;
    const currentQuota = openedWorkspace.quota || 100;
    const newQuota = currentQuota + 50;
    const updatedWs = { ...openedWorkspace, quota: newQuota };
    setOpenedWorkspace(updatedWs);
    const updatedAll = workspaces.map((w) => (w.id === openedWorkspace.id ? updatedWs : w));
    saveWorkspaces(updatedAll, `Allocated +50 GB to "${openedWorkspace.name}". Total quota is now ${newQuota} GB.`);
  };

  // Projects associated with the currently opened workspace (reads live synced projects)
  const workspaceProjects = useMemo(() => {
    if (!openedWorkspace) return [];

    try {
      const saved = localStorage.getItem("teamflow_admin_projects_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const directMatches = parsed.filter(
            (p) => (p.workspace || "").toLowerCase() === (openedWorkspace.name || "").toLowerCase()
          );
          if (directMatches.length > 0) return directMatches;
        }
      }
    } catch (e) {}

    const nameLower = (openedWorkspace.name || "").toLowerCase();
    
    const matched = initialAdminProjects.filter((p) => {
      const pWs = (p.workspace || "").toLowerCase();
      return nameLower.includes(pWs) || pWs.includes(nameLower.split(" ")[0]);
    });

    let list = matched;
    if (list.length === 0) {
      if (nameLower.includes("research") || nameLower.includes("lab")) {
        list = [
          {
            id: "rp-1",
            name: "LLM Agent Fine-Tuning",
            workspace: openedWorkspace.name,
            owner: openedWorkspace.owner,
            status: "Active",
            priority: "High",
            description: "Benchmark open-source model embeddings and reasoning accuracy.",
            tasks: 16,
            completedTasks: 11,
            progress: 68,
            dueDate: "2026-11-25",
            color: openedWorkspace.color,
          },
          {
            id: "rp-2",
            name: "Multimodal Vision Pipeline",
            workspace: openedWorkspace.name,
            owner: "Alex Morgan",
            status: "Active",
            priority: "Medium",
            description: "Integration pipeline for OCR, PDF parsing, and document summarization.",
            tasks: 12,
            completedTasks: 5,
            progress: 42,
            dueDate: "2026-12-14",
            color: openedWorkspace.color,
          },
          {
            id: "rp-3",
            name: "Vector Database Benchmark",
            workspace: openedWorkspace.name,
            owner: "David Lee",
            status: "Completed",
            priority: "Low",
            description: "Latency and throughput stress tests on 10M record embeddings.",
            tasks: 8,
            completedTasks: 8,
            progress: 100,
            dueDate: "2026-10-10",
            color: "#10b981",
          },
        ];
      } else if (nameLower.includes("startup")) {
        list = [
          {
            id: "sp-1",
            name: "MVP Feature Launch",
            workspace: openedWorkspace.name,
            owner: openedWorkspace.owner,
            status: "Active",
            priority: "High",
            description: "Core onboarding funnel, Stripe subscription integration, and user auth.",
            tasks: 10,
            completedTasks: 7,
            progress: 70,
            dueDate: "2026-11-18",
            color: openedWorkspace.color,
          },
          {
            id: "sp-2",
            name: "Early Adopter Feedback Hub",
            workspace: openedWorkspace.name,
            owner: "Michael Rodriguez",
            status: "Active",
            priority: "Medium",
            description: "Live feedback widget, NPS tracking, and weekly cohort analytics.",
            tasks: 8,
            completedTasks: 3,
            progress: 38,
            dueDate: "2026-12-01",
            color: openedWorkspace.color,
          },
        ];
      } else if (nameLower.includes("finance")) {
        list = [
          {
            id: "fp-1",
            name: "Q4 Revenue & Budget Forecasting",
            workspace: openedWorkspace.name,
            owner: openedWorkspace.owner,
            status: "Active",
            priority: "High",
            description: "Departmental budget reconciliation, cash flow projections, and runway analysis.",
            tasks: 14,
            completedTasks: 10,
            progress: 71,
            dueDate: "2026-11-30",
            color: openedWorkspace.color,
          },
          {
            id: "fp-2",
            name: "Enterprise Billing Compliance",
            workspace: openedWorkspace.name,
            owner: "Jessica Taylor",
            status: "Active",
            priority: "Medium",
            description: "SOC2 financial compliance documentation and vendor contract audits.",
            tasks: 9,
            completedTasks: 6,
            progress: 66,
            dueDate: "2026-12-15",
            color: openedWorkspace.color,
          },
        ];
      } else {
        list = [
          {
            id: "dp-1",
            name: `${openedWorkspace.name} Core Initiative`,
            workspace: openedWorkspace.name,
            owner: openedWorkspace.owner,
            status: "Active",
            priority: "High",
            description: `Primary collaborative milestone and operations for ${openedWorkspace.name}.`,
            tasks: 12,
            completedTasks: 8,
            progress: 67,
            dueDate: "2026-12-20",
            color: openedWorkspace.color,
          },
          {
            id: "dp-2",
            name: `${openedWorkspace.name} Infrastructure & Sync`,
            workspace: openedWorkspace.name,
            owner: "Rahul Sharma",
            status: "Active",
            priority: "Medium",
            description: `Automations, webhooks, and team integrations for ${openedWorkspace.name}.`,
            tasks: 6,
            completedTasks: 4,
            progress: 66,
            dueDate: "2026-11-28",
            color: openedWorkspace.color,
          },
        ];
      }
    }

    if (projectStatusFilter !== "All") {
      list = list.filter((p) => p.status === projectStatusFilter);
    }
    if (projectSearch.trim()) {
      const q = projectSearch.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
    }
    return list;
  }, [openedWorkspace, projectStatusFilter, projectSearch]);

  // Multi-select toggle
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedWorkspaces.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedWorkspaces.map((w) => w.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="admin-workspace-app">
      <AdminSidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="admin-workspace-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileSidebarOpen(true)} onCreateWorkspace={openCreateModal} />

        {toast && (
          <div className={`ws-toast ws-toast--${toast.type}`}>
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        <main className="ws-content-container">
          {/* =========================================================
             1. TOP HEADER (Icon Chip, Title, Segmented Controls, Create Btn)
          ========================================================= */}
          <div className="ws-main-header">
            <div className="ws-header-left">
              <div className="ws-header-icon-chip">
                <Box size={24} />
              </div>
              <div>
                <h1 className="ws-header-title">Workspaces</h1>
                <p className="ws-header-sub">
                  Create and manage workspaces for your teams, organize projects, control access, and monitor usage.
                </p>
              </div>
            </div>

            <div className="ws-header-right">
              {/* Segmented Controls (NO "View:" label) */}
              <div className="ws-view-selector">
                <button
                  type="button"
                  className={`ws-view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  <LayoutGrid size={14} />
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  className={`ws-view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List / Table View"
                >
                  <List size={14} />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  className={`ws-view-btn ${viewMode === "kanban" ? "active" : ""}`}
                  onClick={() => setViewMode("kanban")}
                  title="Kanban Board"
                >
                  <FolderKanban size={14} />
                  <span>Kanban</span>
                </button>
              </div>

              {/* PAGE TAB TOGGLE: AUDIT LOGS */}
              <button
                type="button"
                className={`ws-btn-audit-logs ${activeTab === "activity" ? "active" : ""}`}
                onClick={() => setActiveTab(activeTab === "activity" ? "workspaces" : "activity")}
                title={activeTab === "activity" ? "Return to All Workspaces" : "Open Workspace Activity & Audit Logs"}
              >
                {activeTab === "activity" ? <Building2 size={15} /> : <Activity size={15} />}
                <span>{activeTab === "activity" ? "All Workspaces" : "Activity Logs"}</span>
              </button>

              {/* CREATE WORKSPACE BUTTON */}
              <button type="button" className="ws-btn-primary" onClick={openCreateModal}>
                <Plus size={16} />
                <span>Create Workspace</span>
              </button>
            </div>
          </div>

          {/* =========================================================
             WORKSPACE PAGE TABS (Workspaces vs Activity Logs)
          ========================================================= */}
          <div className="ws-page-tabs">
            <button
              type="button"
              className={`ws-page-tab-btn ${activeTab === "workspaces" ? "active" : ""}`}
              onClick={() => setActiveTab("workspaces")}
            >
              <Building2 size={16} />
              <span>All Workspaces</span>
              <span className="ws-tab-count-badge">{workspaces.length}</span>
            </button>

            <button
              type="button"
              className={`ws-page-tab-btn ${activeTab === "activity" ? "active" : ""}`}
              onClick={() => setActiveTab("activity")}
            >
              <Activity size={16} />
              <span>Workspace Activity Logs</span>
              <span className="ws-tab-count-badge live">{activities.length}</span>
            </button>
          </div>

          {/* =========================================================
             PAGE 1: ALL WORKSPACES
          ========================================================= */}
          {activeTab === "workspaces" && (
            <>
              {/* =========================================================
                 2. TOP 4 KPI STATS CARDS WITH SPARKLINES (Matching Screenshot)
              ========================================================= */}
              <section className="ws-stats-row">
            {/* 1. TOTAL WORKSPACES */}
            <article className="ws-stat-card">
              <div className="ws-stat-card-left">
                <div className="ws-stat-icon-wrap icon-purple">
                  <Box size={22} />
                </div>
                <div className="ws-stat-meta">
                  <div className="ws-stat-val-row">
                    <strong>{stats.total}</strong>
                    <span className="ws-trend-chip trend-up">
                      <TrendingUp size={11} /> 33%
                    </span>
                  </div>
                  <span className="ws-stat-label">Total Workspaces</span>
                  <small className="ws-stat-sub">+2 this month</small>
                </div>
              </div>
              <div className="ws-stat-sparkline">
                <svg width="78" height="34" viewBox="0 0 78 34">
                  <path
                    d="M 2 26 C 18 26, 32 16, 48 20 C 62 23, 70 8, 76 6"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </article>

            {/* 2. ACTIVE WORKSPACES */}
            <article className="ws-stat-card">
              <div className="ws-stat-card-left">
                <div className="ws-stat-icon-wrap icon-green">
                  <CheckCircle2 size={22} />
                </div>
                <div className="ws-stat-meta">
                  <div className="ws-stat-val-row">
                    <strong>{stats.active}</strong>
                    <span className="ws-trend-chip trend-up">
                      <TrendingUp size={11} /> 20%
                    </span>
                  </div>
                  <span className="ws-stat-label">Active Workspaces</span>
                  <small className="ws-stat-sub">75% operational</small>
                </div>
              </div>
              <div className="ws-stat-sparkline">
                <svg width="78" height="34" viewBox="0 0 78 34">
                  <path
                    d="M 2 28 C 20 28, 30 18, 50 20 C 65 22, 72 8, 76 6"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </article>

            {/* 3. SUSPENDED / INACTIVE */}
            <article className="ws-stat-card">
              <div className="ws-stat-card-left">
                <div className="ws-stat-icon-wrap icon-red">
                  <AlertTriangle size={22} />
                </div>
                <div className="ws-stat-meta">
                  <div className="ws-stat-val-row">
                    <strong>{stats.suspended}</strong>
                    <span className="ws-trend-chip trend-down">
                      <TrendingDown size={11} /> 50%
                    </span>
                  </div>
                  <span className="ws-stat-label">Suspended / Inactive</span>
                  <small className="ws-stat-sub">Requires review</small>
                </div>
              </div>
              <div className="ws-stat-sparkline">
                <svg width="78" height="34" viewBox="0 0 78 34">
                  <path
                    d="M 2 28 C 18 28, 28 20, 44 24 C 58 27, 68 12, 76 8"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </article>

            {/* 4. TOTAL MEMBERS */}
            <article className="ws-stat-card">
              <div className="ws-stat-card-left">
                <div className="ws-stat-icon-wrap icon-blue">
                  <Users size={22} />
                </div>
                <div className="ws-stat-meta">
                  <div className="ws-stat-val-row">
                    <strong>{stats.members}</strong>
                    <span className="ws-trend-chip trend-up">
                      <TrendingUp size={11} /> 18%
                    </span>
                  </div>
                  <span className="ws-stat-label">Total Members</span>
                  <small className="ws-stat-sub">Across all workspaces</small>
                </div>
              </div>
              <div className="ws-stat-sparkline">
                <svg width="78" height="34" viewBox="0 0 78 34">
                  <path
                    d="M 2 28 C 22 28, 36 22, 52 18 C 65 15, 72 8, 76 4"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </article>
          </section>

          {/* =========================================================
             3. FILTER TOOLBAR (Search, Status, Plan, Owner, Sort, Reset)
          ========================================================= */}
          <section className="ws-toolbar-row">
            <div className="ws-search-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search workspaces by name, owner, or plan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" className="ws-clear-btn" onClick={() => setSearch("")}>
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="ws-filters-group">
              <div className="ws-select-wrap">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
                <ChevronDown size={14} className="ws-select-chevron" />
              </div>

              <div className="ws-select-wrap">
                <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
                  <option value="All">All Plans</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="Business">Business</option>
                  <option value="Pro">Pro</option>
                  <option value="Free">Free</option>
                </select>
                <ChevronDown size={14} className="ws-select-chevron" />
              </div>

              <div className="ws-select-wrap">
                <select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}>
                  <option value="All">All Owners</option>
                  {ownersList.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="ws-select-chevron" />
              </div>

              <div className="ws-select-wrap">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="recent">Recently Created</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="members">Most Members</option>
                  <option value="storage">Storage Used</option>
                </select>
                <ChevronDown size={14} className="ws-select-chevron" />
              </div>

              {(search || statusFilter !== "All" || planFilter !== "All" || ownerFilter !== "All" || sortBy !== "recent") && (
                <button type="button" className="ws-btn-reset-filters" onClick={resetToDemo}>
                  <RotateCcw size={13} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </section>

          {/* =========================================================
             4. MAIN WORKSPACES VIEW: GRID OF CARDS (Matching Screenshot)
          ========================================================= */}
          {viewMode === "grid" && (
            <>
            <div className="ws-cards-grid">
              {paginatedWorkspaces.map((ws) => {
                const isMenuOpen = activeMenuId === ws.id;
                const quota = ws.quota || 100;
                const storagePercent = Math.min(100, Math.round(((ws.storage || 0) / quota) * 100));

                return (
                  <article key={ws.id} className="ws-card">
                    {/* TOP GRADIENT BANNER */}
                    <div className={`ws-card-banner ${ws.bannerClass || "ws-banner--purple"}`}>
                      {/* STATUS PILL & 3-DOTS ACTION */}
                      <div className="ws-card-banner-top">
                        <div className="ws-card-banner-badges">
                          <span className={`ws-status-badge status--${ws.status.toLowerCase()}`}>
                            <span className="ws-status-dot" />
                            <span>{ws.status}</span>
                          </span>
                          {ws.slug === activeWorkspaceSlug && (
                            <span className="ws-current-env-pill" title="Currently selected active workspace">
                              <Check size={10} /> Active Env
                            </span>
                          )}
                        </div>

                        <div className="ws-card-menu-container">
                          <button
                            type="button"
                            className="ws-card-menu-trigger"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(isMenuOpen ? null : ws.id);
                            }}
                            title="Workspace options"
                          >
                            <MoreVertical size={15} />
                          </button>

                          {isMenuOpen && (
                            <div className="ws-card-dropdown">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleOpenWorkspace(ws);
                                }}
                              >
                                <FolderKanban size={13} />
                                <span>Open Workspace Hub</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(ws)}
                              >
                                <Pencil size={13} />
                                <span>Edit Workspace</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDuplicate(ws)}
                              >
                                <Copy size={13} />
                                <span>Duplicate</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(ws)}
                              >
                                <RotateCcw size={13} />
                                <span>Toggle Status</span>
                              </button>
                              <button
                                type="button"
                                className="delete"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setConfirmDelete(ws);
                                }}
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* SQUARE INITIAL AVATAR (Overlapping Card Body) */}
                      <div
                        className="ws-avatar-square"
                        style={{ backgroundColor: ws.color || "#6366f1" }}
                      >
                        {ws.initials || ws.name.slice(0, 2).toUpperCase()}
                      </div>
                    </div>

                    {/* CARD BODY */}
                    <div className="ws-card-body">
                      {/* TITLE & PLAN BADGE */}
                      <div className="ws-card-title-row">
                        <h3
                          className="ws-card-title"
                          onClick={() => handleOpenWorkspace(ws)}
                          title={`Open ${ws.name} Hub`}
                        >
                          {ws.name}
                        </h3>
                        <span className={`ws-plan-pill ws-plan--${ws.plan.toLowerCase()}`}>
                          ✦ {ws.plan}
                        </span>
                      </div>

                      {/* DESCRIPTION */}
                      <p className="ws-card-desc">{ws.description}</p>

                      {/* 3 METRICS */}
                      <div className="ws-card-metrics-row">
                        <div className="ws-metric-item">
                          <strong>{ws.members}</strong>
                          <span className="ws-metric-label">
                            <Users size={11} /> Members
                          </span>
                        </div>
                        <div className="ws-metric-item">
                          <strong>{ws.projects}</strong>
                          <span className="ws-metric-label">Projects</span>
                        </div>
                        <div className="ws-metric-item ws-metric-item--storage">
                          <strong>{ws.storage} / {ws.quota || 100} GB</strong>
                          <span className="ws-metric-label">Storage</span>
                        </div>
                      </div>

                      {/* STORAGE PROGRESS METER */}
                      <div className="ws-storage-progress-wrap">
                        <div className="ws-storage-meter-track">
                          <div
                            className="ws-storage-meter-fill"
                            style={{
                              width: `${storagePercent}%`,
                              backgroundColor: ws.color || "#6366f1",
                            }}
                          />
                        </div>
                        <span className="ws-storage-pct-label">{storagePercent}%</span>
                      </div>
                    </div>

                    {/* CARD FOOTER */}
                    <div className="ws-card-footer">
                      <div className="ws-avatar-stack">
                        {ws.team?.slice(0, 4).map((m, i) => (
                          <img
                            key={i}
                            src={m.avatar}
                            alt={m.name}
                            className="ws-avatar-img"
                            title={m.name}
                          />
                        ))}
                        {ws.extraMembers > 0 && (
                          <span className="ws-avatar-extra">+{ws.extraMembers}</span>
                        )}
                      </div>

                      <button
                        type="button"
                        className="ws-btn-open-workspace"
                        onClick={() => handleOpenWorkspace(ws)}
                        title={`Open ${ws.name}`}
                      >
                        <span>Open Workspace</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </article>
                );
              })}

              {/* 8TH CARD: CREATE NEW WORKSPACE CARD (Matching Screenshot) */}
              {currentPage === 1 && (
                <div className="ws-create-card-slot" onClick={openCreateModal}>
                  <div className="ws-create-card-inner">
                    <div className="ws-create-plus-circle">
                      <Plus size={26} />
                    </div>
                    <h3>Create New Workspace</h3>
                    <p>Set up a new workspace, invite members, and start collaborating.</p>
                    <button type="button" className="ws-btn-create-slot">
                      <Plus size={14} />
                      <span>Create Workspace</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            {renderPaginationBar(false)}
            </>
          )}

          {/* =========================================================
             5. TABLE / LIST VIEW PAGE FORMAT ("add table page formate")
          ========================================================= */}
          {viewMode === "list" && (
            <div className="ws-table-container">
              <div className="ws-table-wrap">
                <table className="ws-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 44, textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={
                            paginatedWorkspaces.length > 0 &&
                            selectedIds.length === paginatedWorkspaces.length
                          }
                          onChange={toggleSelectAll}
                          aria-label="Select all workspaces on this page"
                        />
                      </th>
                      <th>Workspace</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Members</th>
                      <th>Projects</th>
                      <th>Storage Quota</th>
                      <th>Owner</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedWorkspaces.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="ws-empty-table-cell">
                          No workspaces match your search criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedWorkspaces.map((ws) => {
                        const isSelected = selectedIds.includes(ws.id);
                        const isMenuOpen = activeMenuId === ws.id;
                        const storagePercent = Math.min(100, Math.round(((ws.storage || 0) / (ws.quota || 100)) * 100));

                        return (
                          <tr key={ws.id} className={isSelected ? "row-selected" : ""}>
                            <td style={{ textAlign: "center" }}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectOne(ws.id)}
                                aria-label={`Select ${ws.name}`}
                              />
                            </td>
                            <td>
                              <div className="ws-table-name-cell">
                                <div
                                  className="ws-table-avatar"
                                  style={{ backgroundColor: ws.color || "#6366f1" }}
                                >
                                  {ws.initials || ws.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="ws-table-name-meta">
                                  <strong
                                    onClick={() => handleOpenWorkspace(ws)}
                                    title={`Open ${ws.name} Hub`}
                                  >
                                    {ws.name}
                                  </strong>
                                  <small>{ws.slug}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`ws-plan-pill ws-plan--${ws.plan.toLowerCase()}`}>
                                ✦ {ws.plan}
                              </span>
                            </td>
                            <td>
                              <span className={`ws-status-badge status--${ws.status.toLowerCase()}`}>
                                <span className="ws-status-dot" />
                                <span>{ws.status}</span>
                              </span>
                            </td>
                            <td>
                              <div className="ws-table-members">
                                <div className="ws-avatar-stack mini">
                                  {ws.team?.slice(0, 3).map((m, i) => (
                                    <img
                                      key={i}
                                      src={m.avatar}
                                      alt={m.name}
                                      className="ws-avatar-img"
                                    />
                                  ))}
                                </div>
                                <span>{ws.members} members</span>
                              </div>
                            </td>
                            <td>
                              <span className="ws-table-projects-num">{ws.projects}</span>
                            </td>
                            <td>
                              <div className="ws-table-storage-col">
                                <div className="ws-storage-meter-track mini">
                                  <div
                                    className="ws-storage-meter-fill"
                                    style={{
                                      width: `${storagePercent}%`,
                                      backgroundColor: ws.color || "#6366f1",
                                    }}
                                  />
                                </div>
                                <span>{ws.storage} / {ws.quota || 100} GB ({storagePercent}%)</span>
                              </div>
                            </td>
                            <td>
                              <div className="ws-table-owner-cell">
                                <strong>{ws.owner}</strong>
                                <small>{ws.email}</small>
                              </div>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div className="ws-table-actions">
                                <button
                                  type="button"
                                  className="ws-action-icon-btn view"
                                  title="View workspace details & overview"
                                  onClick={() => handleOpenWorkspace(ws)}
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  type="button"
                                  className="ws-action-icon-btn edit customize"
                                  title="Edit workspace settings & quotas"
                                  onClick={() => openEditModal(ws)}
                                >
                                  <SlidersHorizontal size={14} />
                                </button>
                                <button
                                  type="button"
                                  className="ws-action-icon-btn delete"
                                  title="Delete workspace"
                                  onClick={() => setConfirmDelete(ws)}
                                >
                                  <Trash2 size={14} />
                                </button>
                                <button
                                  type="button"
                                  className="ws-btn-open-table"
                                  onClick={() => handleOpenWorkspace(ws)}
                                  title="Open workspace"
                                >
                                  <span>Open</span>
                                  <ArrowRight size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {renderPaginationBar(true)}
            </div>
          )}

          {/* =========================================================
             6. KANBAN BOARD VIEW
          ========================================================= */}
          {viewMode === "kanban" && (
            <div className="ws-kanban-board">
              {["Active", "Inactive", "Suspended"].map((colStatus) => {
                const colWorkspaces = filteredWorkspaces.filter((w) => w.status === colStatus);

                return (
                  <div key={colStatus} className="ws-kanban-col">
                    <div className="ws-kanban-col-header">
                      <div className="ws-kanban-col-title">
                        <span className={`ws-status-dot dot--${colStatus.toLowerCase()}`} />
                        <h3>{colStatus} Workspaces</h3>
                      </div>
                      <span className="ws-kanban-count-badge">{colWorkspaces.length}</span>
                    </div>

                    <div className="ws-kanban-stack">
                      {colWorkspaces.map((ws) => (
                        <div key={ws.id} className="ws-kanban-card">
                          <div className="ws-kanban-card-top">
                            <div
                              className="ws-kanban-avatar"
                              style={{ backgroundColor: ws.color || "#6366f1" }}
                            >
                              {ws.initials || ws.name.slice(0, 2).toUpperCase()}
                            </div>
                            <span className={`ws-plan-pill ws-plan--${ws.plan.toLowerCase()}`}>
                              ✦ {ws.plan}
                            </span>
                          </div>

                          <h4 onClick={() => handleOpenWorkspace(ws)} title={`Open ${ws.name} Hub`}>
                            {ws.name}
                          </h4>
                          <p className="ws-kanban-desc">{ws.description}</p>

                          <div className="ws-kanban-footer">
                            <span className="ws-kanban-meta">
                              <Users size={12} /> {ws.members} members
                            </span>
                            <div className="ws-kanban-actions">
                              <button
                                type="button"
                                className="ws-action-icon-btn view"
                                onClick={() => handleOpenWorkspace(ws)}
                                title="View workspace overview"
                              >
                                <Eye size={12} />
                              </button>
                              <button
                                type="button"
                                className="ws-action-icon-btn edit customize"
                                onClick={() => openEditModal(ws)}
                                title="Edit workspace settings & quotas"
                              >
                                <SlidersHorizontal size={12} />
                              </button>
                              <button
                                type="button"
                                className="ws-btn-kanban-open"
                                onClick={() => handleOpenWorkspace(ws)}
                                title={`Open ${ws.name}`}
                              >
                                <span>Open</span>
                                <ArrowRight size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {colWorkspaces.length === 0 && (
                        <div className="ws-kanban-empty">No {colStatus.toLowerCase()} workspaces</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </>
          )}

          {/* =========================================================
             PAGE 2: WORKSPACE ACTIVITY & AUDIT LOGS
          ========================================================= */}
          {activeTab === "activity" && (
            <section className="ws-activity-section">
              <div className="ws-activity-section-header">
                <div className="ws-activity-header-left">
                  <div className="ws-activity-header-icon">
                    <Activity size={22} />
                  </div>
                  <div>
                    <div className="ws-activity-title-row">
                      <h2>Workspace Activity & Audit Logs</h2>
                      <span className="ws-activity-live-badge">
                        <span className="live-dot" /> Live Audit Trail
                      </span>
                    </div>
                    <p>
                      Comprehensive audit trail of workspace provisioning, storage quota customizations, member allocations, and project updates.
                    </p>
                  </div>
                </div>

                <div className="ws-activity-header-actions">
                  <button
                    type="button"
                    className="ws-btn-export-activity"
                    onClick={handleExportActivityCSV}
                    title="Export workspace audit logs to CSV"
                  >
                    <Download size={15} />
                    <span>Export Logs CSV</span>
                  </button>
                </div>
              </div>

              {/* ACTIVITY STATS ROW */}
              <div className="ws-activity-kpi-grid">
                <div className="ws-activity-kpi-card">
                  <div className="ws-kpi-icon-wrap purple">
                    <Activity size={18} />
                  </div>
                  <div>
                    <span className="ws-kpi-label">Total Logged Events</span>
                    <strong className="ws-kpi-val">{activities.length}</strong>
                  </div>
                </div>

                <div className="ws-activity-kpi-card">
                  <div className="ws-kpi-icon-wrap blue">
                    <HardDrive size={18} />
                  </div>
                  <div>
                    <span className="ws-kpi-label">Storage Quota Events</span>
                    <strong className="ws-kpi-val">
                      {activities.filter((a) => a.category === "Storage Quotas").length}
                    </strong>
                  </div>
                </div>

                <div className="ws-activity-kpi-card">
                  <div className="ws-kpi-icon-wrap green">
                    <Users size={18} />
                  </div>
                  <div>
                    <span className="ws-kpi-label">Member Allocations</span>
                    <strong className="ws-kpi-val">
                      {activities.filter((a) => a.category === "Members").length}
                    </strong>
                  </div>
                </div>

                <div className="ws-activity-kpi-card">
                  <div className="ws-kpi-icon-wrap amber">
                    <FolderKanban size={18} />
                  </div>
                  <div>
                    <span className="ws-kpi-label">Project Synchronizations</span>
                    <strong className="ws-kpi-val">
                      {activities.filter((a) => a.category === "Project Sync").length}
                    </strong>
                  </div>
                </div>
              </div>

              {/* FILTER TOOLBAR */}
              <div className="ws-activity-toolbar">
                <div className="ws-activity-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search workspace logs by action, workspace, actor, or ID..."
                    value={activitySearch}
                    onChange={(e) => {
                      setActivitySearch(e.target.value);
                      setActivityPage(1);
                    }}
                  />
                  {activitySearch && (
                    <button type="button" onClick={() => setActivitySearch("")} className="clear-btn">
                      <X size={13} />
                    </button>
                  )}
                </div>

                <div className="ws-activity-filters">
                  <select
                    value={activityCategory}
                    onChange={(e) => {
                      setActivityCategory(e.target.value);
                      setActivityPage(1);
                    }}
                    aria-label="Filter category"
                  >
                    <option value="All">All Categories</option>
                    <option value="Storage Quotas">Storage Quotas</option>
                    <option value="Project Sync">Project Sync</option>
                    <option value="Members">Members</option>
                    <option value="Lifecycle">Lifecycle</option>
                  </select>

                  <select
                    value={activitySeverity}
                    onChange={(e) => {
                      setActivitySeverity(e.target.value);
                      setActivityPage(1);
                    }}
                    aria-label="Filter severity"
                  >
                    <option value="All">All Severities</option>
                    <option value="success">Success</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                  </select>

                  {(activitySearch || activityCategory !== "All" || activitySeverity !== "All") && (
                    <button
                      type="button"
                      className="ws-clear-activity-filter"
                      onClick={() => {
                        setActivitySearch("");
                        setActivityCategory("All");
                        setActivitySeverity("All");
                        setActivityPage(1);
                      }}
                    >
                      <RotateCcw size={13} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ACTIVITY DATA TABLE */}
              <div className="ws-activity-table-wrapper">
                <table className="ws-activity-table">
                  <thead>
                    <tr>
                      <th style={{ width: 44, textAlign: "center" }}>#</th>
                      <th style={{ width: 140 }}>TIMESTAMP</th>
                      <th>WORKSPACE</th>
                      <th>ACTIVITY / ACTION</th>
                      <th>PERFORMED BY</th>
                      <th>CATEGORY</th>
                      <th>STATUS</th>
                      <th style={{ textAlign: "right", width: 80 }}>DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedActivities.map((act, idx) => (
                      <tr key={act.id}>
                        <td style={{ textAlign: "center" }}>
                          <span className="ws-row-num">
                            {(activityPage - 1) * activityPageSize + idx + 1}
                          </span>
                        </td>

                        <td>
                          <div className="ws-act-time">
                            <strong>{act.time}</strong>
                            <small>{act.fullDate?.slice(0, 10)}</small>
                          </div>
                        </td>

                        <td>
                          <div className="ws-act-workspace-cell">
                            <span className="ws-act-workspace-dot" />
                            <strong>{act.workspace}</strong>
                          </div>
                        </td>

                        <td>
                          <div className="ws-act-action-cell">
                            <span>{act.action}</span>
                            {act.details?.quota && (
                              <span className="ws-act-quota-badge">
                                <HardDrive size={10} /> {act.details.quota} GB
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="ws-act-actor-cell">
                            {act.avatar ? (
                              <img src={act.avatar} alt={act.user} className="ws-act-avatar" />
                            ) : (
                              <div className="ws-act-avatar fallback">
                                {(act.user || "A").slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <strong>{act.user}</strong>
                              <small>{act.role}</small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className={`ws-act-cat-pill cat--${(act.category || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                            {act.category}
                          </span>
                        </td>

                        <td>
                          <span className={`ws-act-sev-pill sev--${act.severity}`}>
                            {act.severity === "success" && <CheckCircle2 size={11} />}
                            {act.severity === "info" && <Info size={11} />}
                            {act.severity === "warning" && <AlertTriangle size={11} />}
                            <span>{act.severity}</span>
                          </span>
                        </td>

                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="ws-act-detail-btn view"
                            onClick={() => setSelectedActivity(act)}
                            title="View activity record payload & metadata"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {paginatedActivities.length === 0 && (
                      <tr>
                        <td colSpan={8} className="ws-act-empty-cell">
                          <div className="ws-act-empty-state">
                            <Activity size={32} />
                            <h4>No workspace activity records found</h4>
                            <p>Try clearing filters or adjusting your search keyword.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGES AT BOTTOM (ACTIVITY PAGINATION) */}
              {filteredActivities.length > 0 && (
                <div className="ws-activity-pagination-bar">
                  <div className="ws-pagination-info">
                    <span>
                      Showing {(activityPage - 1) * activityPageSize + 1} to{" "}
                      {Math.min(activityPage * activityPageSize, filteredActivities.length)} of {filteredActivities.length} logs
                    </span>
                    <div className="ws-page-size-wrap">
                      <span>Rows:</span>
                      <select
                        value={activityPageSize}
                        onChange={(e) => {
                          setActivityPageSize(Number(e.target.value));
                          setActivityPage(1);
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                    </div>
                  </div>

                  <div className="ws-pagination-controls">
                    <button
                      type="button"
                      className="ws-page-nav-btn"
                      onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                      disabled={activityPage <= 1}
                    >
                      Previous
                    </button>

                    <div className="ws-page-pills">
                      {Array.from({ length: totalActivityPages }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          type="button"
                          className={`ws-page-num-pill ${activityPage === num ? "active" : ""}`}
                          onClick={() => setActivityPage(num)}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="ws-page-nav-btn"
                      onClick={() => setActivityPage((p) => Math.min(totalActivityPages, p + 1))}
                      disabled={activityPage >= totalActivityPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

</main>
      </div>

      {/* =========================================================
         7. CREATE / EDIT WORKSPACE MODAL ("edit option with proper css")
      ========================================================= */}
      {showModal && (
        <div
          className="ws-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="ws-modal-box">
            <div className="ws-modal-header">
              <div className="ws-modal-header-left">
                <div
                  className="ws-modal-icon-badge"
                  style={{
                    backgroundColor: `${form.color || "#6366f1"}15`,
                    color: form.color || "#6366f1",
                  }}
                >
                  <Box size={20} />
                </div>
                <div>
                  <div className="ws-modal-title-row">
                    <h2>{editingWorkspace ? "Edit Workspace" : "Create New Workspace"}</h2>
                    {editingWorkspace && (
                      <span className={`ws-status-badge status--${form.status.toLowerCase()}`}>
                        <span className="ws-status-dot" />
                        <span>{form.status}</span>
                      </span>
                    )}
                  </div>
                  <p>
                    {editingWorkspace
                      ? "Configure tenant quotas, primary ownership, plan allocation, and storage limit."
                      : "Provision multi-tenant team workspaces, set quotas, and assign administrators."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="ws-modal-close"
                onClick={() => setShowModal(false)}
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="ws-modal-form">
              {/* WORKSPACE NAME & SLUG */}
              <div className="ws-form-grid-2">
                <div className="ws-form-group">
                  <label htmlFor="ws-name">
                    Workspace Name <span className="ws-req">*</span>
                  </label>
                  <input
                    id="ws-name"
                    type="text"
                    required
                    placeholder="e.g. TeamFlow Workspace"
                    value={form.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      const initials = val.trim().slice(0, 2).toUpperCase() || "WS";
                      setForm({ ...form, name: val, slug, initials });
                    }}
                  />
                </div>

                <div className="ws-form-group">
                  <label htmlFor="ws-slug">Workspace Identifier / Slug</label>
                  <input
                    id="ws-slug"
                    type="text"
                    placeholder="e.g. teamflow-main"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  />
                </div>
              </div>

              {/* PRIMARY OWNER & OWNER EMAIL */}
              <div className="ws-form-grid-2">
                <div className="ws-form-group">
                  <label htmlFor="ws-owner">Primary Owner</label>
                  <input
                    id="ws-owner"
                    type="text"
                    placeholder="e.g. Amit Sharma"
                    value={form.owner}
                    onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  />
                </div>

                <div className="ws-form-group">
                  <label htmlFor="ws-email">Owner Email</label>
                  <input
                    id="ws-email"
                    type="email"
                    placeholder="e.g. amit@abctech.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              {/* PLAN & STATUS */}
              <div className="ws-form-grid-2">
                <div className="ws-form-group">
                  <label htmlFor="ws-plan">Plan Tier</label>
                  <div className="ws-select-wrap">
                    <select
                      id="ws-plan"
                      value={form.plan}
                      onChange={(e) => setForm({ ...form, plan: e.target.value })}
                    >
                      <option value="Enterprise">Enterprise</option>
                      <option value="Business">Business</option>
                      <option value="Pro">Pro</option>
                      <option value="Free">Free</option>
                    </select>
                    <ChevronDown size={14} className="ws-select-chevron" />
                  </div>
                </div>

                <div className="ws-form-group">
                  <label htmlFor="ws-status">Status</label>
                  <div className="ws-select-wrap">
                    <select
                      id="ws-status"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                    <ChevronDown size={14} className="ws-select-chevron" />
                  </div>
                </div>
              </div>

              {/* MEMBERS, PROJECTS, STORAGE QUOTA */}
              <div className="ws-form-grid-3">
                {/* 1. MEMBERS WITH STEPPERS & PRESETS */}
                <div className="ws-form-group">
                  <div className="ws-form-label-row">
                    <label htmlFor="ws-members">Members Count</label>
                    <span className="ws-form-hint">Seats</span>
                  </div>
                  <div className="ws-stepper-input-wrap">
                    <button
                      type="button"
                      className="ws-stepper-btn"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          members: Math.max(1, (Number(prev.members) || 1) - 1),
                        }))
                      }
                      title="Decrease members"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      id="ws-members"
                      type="number"
                      min="1"
                      placeholder="e.g. 15"
                      value={form.members === "" ? "" : form.members}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          setForm({ ...form, members: "" });
                        } else {
                          const n = parseInt(val, 10);
                          setForm({ ...form, members: isNaN(n) ? "" : n });
                        }
                      }}
                      onBlur={() => {
                        if (!form.members || Number(form.members) < 1) {
                          setForm({ ...form, members: 1 });
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="ws-stepper-btn"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          members: (Number(prev.members) || 0) + 1,
                        }))
                      }
                      title="Increase members"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="ws-quick-chips">
                    {[5, 10, 25, 50, 100].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={`ws-chip-btn ${Number(form.members) === preset ? "active" : ""}`}
                        onClick={() => setForm({ ...form, members: preset })}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. PROJECTS WITH STEPPERS */}
                <div className="ws-form-group">
                  <div className="ws-form-label-row">
                    <label htmlFor="ws-projects">Initial Projects</label>
                    <span className="ws-form-hint">Projects</span>
                  </div>
                  <div className="ws-stepper-input-wrap">
                    <button
                      type="button"
                      className="ws-stepper-btn"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          projects: Math.max(0, (Number(prev.projects) || 0) - 1),
                        }))
                      }
                      title="Decrease projects"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      id="ws-projects"
                      type="number"
                      min="0"
                      value={form.projects === "" ? "" : form.projects}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          setForm({ ...form, projects: "" });
                        } else {
                          const n = parseInt(val, 10);
                          setForm({ ...form, projects: isNaN(n) ? "" : n });
                        }
                      }}
                      onBlur={() => {
                        if (form.projects === "" || Number(form.projects) < 0) {
                          setForm({ ...form, projects: 0 });
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="ws-stepper-btn"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          projects: (Number(prev.projects) || 0) + 1,
                        }))
                      }
                      title="Increase projects"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="ws-quick-chips">
                    {[1, 2, 4, 8].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={`ws-chip-btn ${Number(form.projects) === preset ? "active" : ""}`}
                        onClick={() => setForm({ ...form, projects: preset })}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. CUSTOMIZABLE STORAGE QUOTA */}
                <div className="ws-form-group">
                  <div className="ws-form-label-row">
                    <label htmlFor="ws-quota">Storage Quota</label>
                    <span className="ws-form-hint">Limit (GB)</span>
                  </div>
                  <div className="ws-stepper-input-wrap">
                    <input
                      id="ws-quota"
                      type="number"
                      min="1"
                      placeholder="e.g. 100"
                      value={form.quota === "" ? "" : form.quota}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          setForm({ ...form, quota: "" });
                        } else {
                          const n = parseInt(val, 10);
                          setForm({ ...form, quota: isNaN(n) ? "" : n });
                        }
                      }}
                      onBlur={() => {
                        if (!form.quota || Number(form.quota) < 1) {
                          setForm({ ...form, quota: 50 });
                        }
                      }}
                    />
                    <span className="ws-input-unit">GB</span>
                  </div>
                  <div className="ws-quick-chips">
                    {[
                      { label: "25 GB", val: 25 },
                      { label: "50 GB", val: 50 },
                      { label: "100 GB", val: 100 },
                      { label: "500 GB", val: 500 },
                      { label: "1 TB", val: 1000 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        className={`ws-chip-btn ${Number(form.quota) === preset.val ? "active" : ""}`}
                        onClick={() => {
                          const newQuota = preset.val;
                          const newStorage = Math.min(Number(form.storage) || 0, newQuota);
                          setForm({ ...form, quota: newQuota, storage: newStorage });
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* STORAGE USAGE SLIDER & PREVIEW */}
              <div className="ws-form-group">
                <div className="ws-storage-slider-header">
                  <label htmlFor="ws-storage-range">
                    Initial Storage Used: <strong>{form.storage} GB</strong> of {form.quota || 100} GB
                  </label>
                  <span className="ws-storage-slider-pct">
                    {Math.min(100, Math.round(((Number(form.storage) || 0) / (Number(form.quota) || 100)) * 100))}%
                  </span>
                </div>
                <input
                  id="ws-storage-range"
                  type="range"
                  min="0"
                  max={form.quota || 100}
                  value={form.storage}
                  onChange={(e) => setForm({ ...form, storage: Number(e.target.value) })}
                  className="ws-storage-range-slider"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="ws-form-group">
                <label htmlFor="ws-desc">Description</label>
                <textarea
                  id="ws-desc"
                  rows={2}
                  placeholder="Summarize the core purpose and teams using this workspace..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* THEME COLOR ACCENT */}
              <div className="ws-form-group">
                <label>Theme Color Accent</label>
                <div className="ws-color-picker-row">
                  {[
                    { color: "#6366f1", label: "Purple / Indigo", banner: "ws-banner--purple" },
                    { color: "#0284c7", label: "Blue", banner: "ws-banner--blue" },
                    { color: "#059669", label: "Green", banner: "ws-banner--green" },
                    { color: "#ea580c", label: "Orange", banner: "ws-banner--orange" },
                    { color: "#db2777", label: "Pink", banner: "ws-banner--pink" },
                    { color: "#7c3aed", label: "Violet", banner: "ws-banner--violet" },
                    { color: "#d97706", label: "Amber", banner: "ws-banner--amber" },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      className={`ws-color-chip ${form.color === c.color ? "active" : ""}`}
                      style={{ backgroundColor: c.color }}
                      onClick={() => setForm({ ...form, color: c.color, bannerClass: c.banner })}
                      title={c.label}
                    >
                      {form.color === c.color && <Check size={12} color="#ffffff" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="ws-modal-footer">
                <button
                  type="button"
                  className="ws-btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ws-btn-submit">
                  <Check size={15} />
                  <span>{editingWorkspace ? "Save Changes" : "Create Workspace"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
         ACTIVITY DETAIL PAYLOAD MODAL
      ========================================================= */}
      {selectedActivity && (
        <div
          className="ws-modal-backdrop ws-act-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedActivity(null);
          }}
        >
          <div className="ws-modal-box ws-modal-md ws-activity-detail-modal">
            {/* Modal Header */}
            <div className="ws-modal-header ws-act-modal-header">
              <div className="ws-modal-header-left">
                <div className="ws-modal-icon-badge ws-act-icon-badge">
                  <Activity size={20} />
                </div>
                <div>
                  <h2 className="ws-act-modal-title">Workspace Activity Detail</h2>
                  <div className="ws-act-audit-meta">
                    <span className="ws-act-audit-label">Audit Reference:</span>
                    <span className="ws-act-audit-ref">
                      <ShieldCheck size={12} />
                      {selectedActivity.id}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="ws-modal-close ws-act-close-icon"
                onClick={() => setSelectedActivity(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="ws-activity-detail-body">
              {/* 1. Hero Summary Card */}
              <div className="ws-act-detail-hero">
                <div className="ws-act-hero-icon-box">
                  <Building2 size={20} />
                </div>
                <div className="ws-act-hero-main">
                  <div className="ws-act-hero-top-row">
                    <span className="ws-act-workspace-pill">
                      <Layers size={12} />
                      {selectedActivity.workspace || "System Workspace"}
                    </span>
                    <span className={`ws-act-sev-pill sev--${selectedActivity.severity}`}>
                      <span className="ws-act-sev-dot" />
                      {selectedActivity.severity}
                    </span>
                  </div>
                  <h4 className="ws-act-hero-title">{selectedActivity.action}</h4>
                </div>
              </div>

              {/* 2. Primary Telemetry Details Grid */}
              <div className="ws-act-detail-rows">
                <div className="ws-act-detail-row">
                  <div className="ws-act-row-label">
                    <Clock size={14} className="ws-row-icon" />
                    <span>Timestamp:</span>
                  </div>
                  <div className="ws-act-row-val">
                    <span className="ws-act-time-full">
                      {selectedActivity.fullDate || selectedActivity.time}
                    </span>
                    {selectedActivity.time && selectedActivity.fullDate && (
                      <span className="ws-act-time-rel">({selectedActivity.time})</span>
                    )}
                  </div>
                </div>

                <div className="ws-act-detail-row">
                  <div className="ws-act-row-label">
                    <Tag size={14} className="ws-row-icon" />
                    <span>Event Category:</span>
                  </div>
                  <div className="ws-act-row-val">
                    <span className="ws-act-row-cat-val">{selectedActivity.category || "Lifecycle"}</span>
                  </div>
                </div>

                <div className="ws-act-detail-row">
                  <div className="ws-act-row-label">
                    <User size={14} className="ws-row-icon" />
                    <span>Triggered By:</span>
                  </div>
                  <div className="ws-act-row-val ws-act-user-val">
                    <div className="ws-act-user-avatar">
                      {getInitials(selectedActivity.user)}
                    </div>
                    <span className="ws-act-user-name">{selectedActivity.user}</span>
                    {selectedActivity.role && (
                      <span className="ws-act-user-role-badge">{selectedActivity.role}</span>
                    )}
                  </div>
                </div>

                <div className="ws-act-detail-row">
                  <div className="ws-act-row-label">
                    <Globe size={14} className="ws-row-icon" />
                    <span>Origin IP:</span>
                  </div>
                  <div className="ws-act-row-val">
                    <code className="ws-act-ip-code">
                      <span className="ws-act-ip-dot" />
                      {selectedActivity.ip || "127.0.0.1"}
                    </code>
                  </div>
                </div>
              </div>

              {/* 3. Audit Parameters & Configuration Grid */}
              {selectedActivity.details && Object.keys(selectedActivity.details).length > 0 && (
                <div className="ws-act-params-wrap">
                  <div className="ws-params-header">
                    <div className="ws-params-header-title">
                      <SlidersHorizontal size={13} />
                      <span>Audit Parameters &amp; Configuration</span>
                    </div>
                    <span className="ws-params-count-badge">
                      {Object.keys(selectedActivity.details).length} parameters
                    </span>
                  </div>

                  <div className="ws-params-grid">
                    {Object.entries(selectedActivity.details).map(([k, v]) => (
                      <div key={k} className="ws-param-card">
                        <div className="ws-param-card-header">
                          <div className="ws-param-card-icon">
                            {getParamIcon(k)}
                          </div>
                          <span className="ws-param-key">{formatDetailKey(k)}</span>
                        </div>
                        <div className="ws-param-val">
                          {formatDetailValue(k, v)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="ws-act-modal-footer">
              <button
                type="button"
                className="ws-act-close-btn"
                onClick={() => setSelectedActivity(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         8. DELETE CONFIRMATION MODAL
      ========================================================= */}
      {confirmDelete && (
        <div
          className="ws-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setConfirmDelete(null);
          }}
        >
          <div className="ws-modal-box ws-modal-sm">
            <div className="ws-delete-icon-circle">
              <Trash2 size={24} />
            </div>
            <h3>Delete "{confirmDelete.name}"?</h3>
            <p>
              Are you sure you want to permanently delete this workspace? All associated projects, member seats, and stored data will be revoked.
            </p>
            <div className="ws-modal-footer center">
              <button
                type="button"
                className="ws-btn-cancel"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ws-btn-danger"
                onClick={confirmDeleteWorkspace}
              >
                <Trash2 size={16} /> Delete Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         9. OPEN WORKSPACE HUB MODAL ("create open workspace and add functionality")
      ========================================================= */}
      {openedWorkspace && (
        <div
          className="ws-open-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpenedWorkspace(null);
          }}
        >
          <div className="ws-open-modal-dialog">
            {/* GRADIENT BANNER */}
            <div className={`ws-open-modal-banner ${openedWorkspace.bannerClass || "ws-banner--purple"}`}>
              <div className="ws-open-banner-actions">
                {openedWorkspace.slug === activeWorkspaceSlug ? (
                  <span className="ws-open-active-chip">
                    <Check size={12} /> Active Environment
                  </span>
                ) : (
                  <button
                    type="button"
                    className="ws-open-btn-make-active"
                    onClick={() => handleSetActiveWorkspace(openedWorkspace)}
                  >
                    <Star size={12} />
                    <span>Set as Active</span>
                  </button>
                )}
                <button
                  type="button"
                  className="ws-open-btn-close"
                  onClick={() => setOpenedWorkspace(null)}
                  title="Close Workspace Hub"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* HEADER META ROW */}
            <div className="ws-open-header-body">
              <div className="ws-open-header-top">
                <div
                  className="ws-open-avatar-lg"
                  style={{ backgroundColor: openedWorkspace.color || "#6366f1" }}
                >
                  {openedWorkspace.initials || openedWorkspace.name.slice(0, 2).toUpperCase()}
                </div>

                <div className="ws-open-info-meta">
                  <div className="ws-open-title-row">
                    <h2>{openedWorkspace.name}</h2>
                    <span className={`ws-plan-pill ws-plan--${openedWorkspace.plan.toLowerCase()}`}>
                      ✦ {openedWorkspace.plan}
                    </span>
                    <span className={`ws-status-badge ws-status--${openedWorkspace.status.toLowerCase()}`}>
                      <span className={`ws-status-dot dot--${openedWorkspace.status.toLowerCase()}`} />
                      {openedWorkspace.status}
                    </span>
                  </div>

                  <div className="ws-open-slug-row">
                    <code className="ws-slug-code" title="Workspace slug">
                      teamflow.ai/{openedWorkspace.slug}
                    </code>
                    <button
                      type="button"
                      className="ws-slug-copy-btn"
                      onClick={() => handleCopySlug(openedWorkspace.slug)}
                      title="Copy workspace URL"
                    >
                      <Copy size={12} />
                      <span>Copy Link</span>
                    </button>
                    <span className="ws-open-created-meta">
                      Created on {openedWorkspace.created || "2026-10-15"}
                    </span>
                  </div>
                </div>

                <div className="ws-open-primary-actions">
                  <button
                    type="button"
                    className="ws-open-btn-primary"
                    onClick={() => handleGoToProjects(openedWorkspace)}
                  >
                    <FolderKanban size={14} />
                    <span>Go to Projects</span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    type="button"
                    className="ws-open-btn-secondary"
                    onClick={() => handleEditFromHub(openedWorkspace)}
                  >
                    <Pencil size={13} />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {/* TABS SEGMENTED NAV */}
              <div className="ws-open-tabs-bar">
                <button
                  type="button"
                  className={`ws-open-tab-btn ${openedTab === "overview" ? "active" : ""}`}
                  onClick={() => setOpenedTab("overview")}
                >
                  <LayoutGrid size={14} />
                  <span>Overview</span>
                </button>
                <button
                  type="button"
                  className={`ws-open-tab-btn ${openedTab === "projects" ? "active" : ""}`}
                  onClick={() => setOpenedTab("projects")}
                >
                  <FolderKanban size={14} />
                  <span>Projects ({workspaceProjects.length})</span>
                </button>
                <button
                  type="button"
                  className={`ws-open-tab-btn ${openedTab === "members" ? "active" : ""}`}
                  onClick={() => setOpenedTab("members")}
                >
                  <Users size={14} />
                  <span>Team ({workspaceMembersList.length})</span>
                </button>
                <button
                  type="button"
                  className={`ws-open-tab-btn ${openedTab === "storage" ? "active" : ""}`}
                  onClick={() => setOpenedTab("storage")}
                >
                  <HardDrive size={14} />
                  <span>Storage & Quota</span>
                </button>
                <button
                  type="button"
                  className={`ws-open-tab-btn ${openedTab === "activity" ? "active" : ""}`}
                  onClick={() => setOpenedTab("activity")}
                >
                  <SlidersHorizontal size={14} />
                  <span>Activity Log</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENTS (Scrollable) */}
            <div className="ws-open-tab-body">
              {/* TAB 1: OVERVIEW */}
              {openedTab === "overview" && (
                <div className="ws-open-overview-stack">
                  {/* METRIC CARDS */}
                  <div className="ws-open-stats-grid">
                    <div className="ws-open-stat-card">
                      <div className="ws-open-stat-icon purple">
                        <Users size={18} />
                      </div>
                      <div className="ws-open-stat-text">
                        <span className="ws-open-stat-label">Total Members</span>
                        <strong>{openedWorkspace.members} Seats</strong>
                        <small className="positive">+3 this month</small>
                      </div>
                    </div>

                    <div className="ws-open-stat-card">
                      <div className="ws-open-stat-icon blue">
                        <FolderKanban size={18} />
                      </div>
                      <div className="ws-open-stat-text">
                        <span className="ws-open-stat-label">Projects</span>
                        <strong>{openedWorkspace.projects} Projects</strong>
                        <small className="neutral">{workspaceProjects.length} configured</small>
                      </div>
                    </div>

                    <div className="ws-open-stat-card">
                      <div className="ws-open-stat-icon green">
                        <HardDrive size={18} />
                      </div>
                      <div className="ws-open-stat-text">
                        <span className="ws-open-stat-label">Storage Allocated</span>
                        <strong>{openedWorkspace.storage} / {openedWorkspace.quota || 100} GB</strong>
                        <small>{Math.round(((openedWorkspace.storage || 0) / (openedWorkspace.quota || 100)) * 100)}% capacity</small>
                      </div>
                    </div>

                    <div className="ws-open-stat-card">
                      <div className="ws-open-stat-icon amber">
                        <ShieldCheck size={18} />
                      </div>
                      <div className="ws-open-stat-text">
                        <span className="ws-open-stat-label">Workspace Lead</span>
                        <strong>{openedWorkspace.owner}</strong>
                        <small>{openedWorkspace.email}</small>
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION & PURPOSE */}
                  <div className="ws-open-section-card">
                    <div className="ws-open-section-head">
                      <h3>Workspace Purpose</h3>
                      <button
                        type="button"
                        className="ws-open-link-btn"
                        onClick={() => handleEditFromHub(openedWorkspace)}
                      >
                        Edit Details
                      </button>
                    </div>
                    <p className="ws-open-section-desc">
                      {openedWorkspace.description || "No description provided for this workspace."}
                    </p>
                  </div>

                  {/* RECENT PROJECTS IN THIS WORKSPACE */}
                  <div className="ws-open-section-card">
                    <div className="ws-open-section-head">
                      <h3>Active Projects ({workspaceProjects.length})</h3>
                      <button
                        type="button"
                        className="ws-open-link-btn"
                        onClick={() => handleGoToProjects(openedWorkspace)}
                      >
                        <span>View All Projects</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>

                    <div className="ws-open-projects-grid">
                      {workspaceProjects.slice(0, 3).map((p) => (
                        <div key={p.id} className="ws-open-project-item" onClick={() => handleGoToProjects(openedWorkspace, p)} style={{ cursor: "pointer" }} title={`Open ${p.name} in Projects Dashboard`}>
                          <div className="ws-open-proj-top">
                            <h4>{p.name}</h4>
                            <span className={`ws-status-badge ws-status--${(p.status || "active").toLowerCase()}`}>
                              {p.status || "Active"}
                            </span>
                          </div>
                          <p className="ws-open-proj-desc">{p.description}</p>
                          <div className="ws-open-proj-progress">
                            <div className="ws-storage-meter-track">
                              <div
                                className="ws-storage-meter-fill"
                                style={{ width: `${p.progress || 60}%`, backgroundColor: openedWorkspace.color || "#6366f1" }}
                              />
                            </div>
                            <span className="ws-open-proj-pct">{p.progress || 60}%</span>
                          </div>
                          <div className="ws-open-proj-foot">
                            <small>
                              {p.completedTasks || 6} / {p.tasks || 10} Tasks
                            </small>
                            <small className="due">Due {p.dueDate || "Nov 30, 2026"}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* KEY MEMBERS */}
                  <div className="ws-open-section-card">
                    <div className="ws-open-section-head">
                      <h3>Core Team Members</h3>
                      <button
                        type="button"
                        className="ws-open-link-btn"
                        onClick={() => setOpenedTab("members")}
                      >
                        <span>Manage Team ({workspaceMembersList.length})</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>

                    <div className="ws-open-team-avatars-row">
                      {workspaceMembersList.slice(0, 5).map((m) => (
                        <div key={m.id} className="ws-open-member-chip">
                          {m.avatar ? (
                            <img src={m.avatar} alt={m.name} className="ws-open-member-img" />
                          ) : (
                            <div className="ws-open-member-init">{m.initials}</div>
                          )}
                          <div className="ws-open-member-chip-text">
                            <strong>{m.name}</strong>
                            <small>{m.role}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECTS */}
              {openedTab === "projects" && (
                <div className="ws-open-projects-tab">
                  <div className="ws-open-tab-toolbar">
                    <div className="ws-open-search-input">
                      <Search size={14} />
                      <input
                        type="text"
                        placeholder="Search projects in this workspace..."
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                      />
                    </div>

                    <div className="ws-open-tab-filters">
                      <select
                        value={projectStatusFilter}
                        onChange={(e) => setProjectStatusFilter(e.target.value)}
                        className="ws-open-tab-select"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                      </select>

                      <button
                        type="button"
                        className="ws-open-btn-goto-projects"
                        onClick={() => handleGoToProjects(openedWorkspace)}
                        title={`Open all ${openedWorkspace?.name || "workspace"} projects in Projects Dashboard`}
                      >
                        <FolderKanban size={13} />
                        <span>Go to Projects</span>
                        <ArrowRight size={12} />
                      </button>

                      <button
                        type="button"
                        className="ws-open-btn-create-proj"
                        onClick={() => handleGoToProjects(openedWorkspace)}
                      >
                        <Plus size={13} />
                        <span>Add Project</span>
                      </button>
                    </div>
                  </div>

                  <div className="ws-open-projects-list">
                    {workspaceProjects.map((p) => (
                      <div key={p.id} className="ws-open-project-row">
                        <div className="ws-open-prow-left">
                          <div
                            className="ws-open-prow-icon"
                            style={{ backgroundColor: `${openedWorkspace.color || "#6366f1"}20`, color: openedWorkspace.color || "#6366f1" }}
                          >
                            <FolderKanban size={16} />
                          </div>
                          <div>
                            <h4>{p.name}</h4>
                            <p>{p.description}</p>
                          </div>
                        </div>

                        <div className="ws-open-prow-meta">
                          <span className={`ws-status-badge ws-status--${(p.status || "active").toLowerCase()}`}>
                            {p.status || "Active"}
                          </span>
                          <span className="ws-open-priority-tag">{p.priority || "Medium"}</span>
                          <div className="ws-open-prow-progress-box">
                            <div className="ws-storage-meter-track">
                              <div
                                className="ws-storage-meter-fill"
                                style={{ width: `${p.progress || 50}%`, backgroundColor: openedWorkspace.color || "#6366f1" }}
                              />
                            </div>
                            <small>{p.progress || 50}%</small>
                          </div>
                          <button
                            type="button"
                            className="ws-btn-open-proj-link"
                            onClick={() => handleGoToProjects(openedWorkspace, p)}
                            title={`Open ${p.name} in Projects Dashboard`}
                          >
                            <span>Open</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {workspaceProjects.length === 0 && (
                      <div className="ws-open-empty-tab">
                        <FolderKanban size={32} />
                        <p>No projects found matching the filter criteria.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: TEAM MEMBERS */}
              {openedTab === "members" && (
                <div className="ws-open-members-tab">
                  <div className="ws-open-tab-toolbar">
                    <div className="ws-open-tab-title-group">
                      <h3>Workspace Members ({workspaceMembersList.length})</h3>
                      <p>Members with authorized access to {openedWorkspace.name}.</p>
                    </div>

                    <button
                      type="button"
                      className="ws-open-btn-create-proj"
                      onClick={() => setShowInviteForm(!showInviteForm)}
                    >
                      <UserPlus size={14} />
                      <span>{showInviteForm ? "Cancel Invite" : "Invite Member"}</span>
                    </button>
                  </div>

                  {showInviteForm && (
                    <form className="ws-open-invite-box" onSubmit={handleInviteMember}>
                      <input
                        type="email"
                        placeholder="colleague@teamflow.ai"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                      />
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="ws-open-tab-select"
                      >
                        <option value="Team Lead">Team Lead</option>
                        <option value="Member">Member</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                      <button type="submit" className="ws-open-btn-primary">
                        Send Invite
                      </button>
                    </form>
                  )}

                  <div className="ws-open-members-list">
                    {workspaceMembersList.map((m) => (
                      <div key={m.id} className="ws-open-member-card">
                        <div className="ws-open-mcard-left">
                          {m.avatar ? (
                            <img src={m.avatar} alt={m.name} className="ws-open-mcard-img" />
                          ) : (
                            <div className="ws-open-mcard-init">{m.initials}</div>
                          )}
                          <div>
                            <strong>{m.name}</strong>
                            <small>{m.email}</small>
                          </div>
                        </div>

                        <div className="ws-open-mcard-right">
                          <span className={`ws-member-role-badge ${m.role.toLowerCase().replace(/\s+/g, "-")}`}>
                            {m.role}
                          </span>
                          <span className="ws-open-member-status">● {m.status}</span>
                          {m.role !== "Workspace Owner" && (
                            <button
                              type="button"
                              className="ws-open-btn-remove-member"
                              onClick={() => handleRemoveMember(m.id, m.name)}
                              title="Remove member"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: STORAGE & QUOTA */}
              {openedTab === "storage" && (
                <div className="ws-open-storage-tab">
                  <div className="ws-open-storage-hero">
                    <div className="ws-open-storage-circle">
                      <HardDrive size={28} />
                      <div className="ws-open-storage-pct-big">
                        {Math.round(((openedWorkspace.storage || 0) / (openedWorkspace.quota || 100)) * 100)}%
                      </div>
                      <span>Quota Used</span>
                    </div>

                    <div className="ws-open-storage-info">
                      <h3>Storage Capacity Overview</h3>
                      <p>
                        Workspace currently utilizes <strong>{openedWorkspace.storage} GB</strong> out of{" "}
                        <strong>{openedWorkspace.quota || 100} GB</strong> allocated limit.
                      </p>

                      <div className="ws-storage-meter-track ws-storage-meter-lg">
                        <div
                          className="ws-storage-meter-fill"
                          style={{
                            width: `${Math.min(100, Math.round(((openedWorkspace.storage || 0) / (openedWorkspace.quota || 100)) * 100))}%`,
                            backgroundColor: openedWorkspace.color || "#6366f1",
                          }}
                        />
                      </div>

                      <div className="ws-open-storage-upgrade-row">
                        <button
                          type="button"
                          className="ws-open-btn-primary"
                          onClick={handleUpgradeStorage}
                        >
                          <Plus size={14} />
                          <span>Add +50 GB Storage Quota</span>
                        </button>
                        <small className="ws-storage-safe-note">
                          ✦ Instant allocation • No restart needed
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* BREAKDOWN ITEMS */}
                  <div className="ws-open-storage-breakdown">
                    <h4>Storage Breakdown by Category</h4>
                    <div className="ws-storage-breakdown-grid">
                      <div className="ws-storage-cat-item">
                        <div className="ws-cat-head">
                          <FileText size={15} className="blue" />
                          <span>Documents & PDF Assets</span>
                        </div>
                        <strong>{Math.round(openedWorkspace.storage * 0.35)} GB</strong>
                        <div className="ws-cat-sub">35% of used space</div>
                      </div>

                      <div className="ws-storage-cat-item">
                        <div className="ws-cat-head">
                          <Layers size={15} className="purple" />
                          <span>Design Media & UI Kits</span>
                        </div>
                        <strong>{Math.round(openedWorkspace.storage * 0.30)} GB</strong>
                        <div className="ws-cat-sub">30% of used space</div>
                      </div>

                      <div className="ws-storage-cat-item">
                        <div className="ws-cat-head">
                          <Cpu size={15} className="green" />
                          <span>Git Repos & Build Artifacts</span>
                        </div>
                        <strong>{Math.round(openedWorkspace.storage * 0.20)} GB</strong>
                        <div className="ws-cat-sub">20% of used space</div>
                      </div>

                      <div className="ws-storage-cat-item">
                        <div className="ws-cat-head">
                          <Database size={15} className="amber" />
                          <span>Snapshots & Audit Archives</span>
                        </div>
                        <strong>{Math.round(openedWorkspace.storage * 0.15)} GB</strong>
                        <div className="ws-cat-sub">15% of used space</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: ACTIVITY LOG */}
              {openedTab === "activity" && (
                <div className="ws-open-activity-tab">
                  <div className="ws-open-section-head">
                    <h3>Recent Environment Activity</h3>
                    <small>Real-time audit log of changes in {openedWorkspace.name}</small>
                  </div>

                  <div className="ws-open-activity-timeline">
                    <div className="ws-open-timeline-item">
                      <div className="ws-timeline-dot purple" />
                      <div className="ws-timeline-body">
                        <strong>Rahul Sharma synchronized project milestones</strong>
                        <p>Updated sprint velocity and 4 tasks in Website Redesign.</p>
                        <small>2 hours ago</small>
                      </div>
                    </div>

                    <div className="ws-open-timeline-item">
                      <div className="ws-timeline-dot green" />
                      <div className="ws-timeline-body">
                        <strong>Storage allocation verified</strong>
                        <p>Weekly backup and quota diagnostics cleared successfully.</p>
                        <small>1 day ago</small>
                      </div>
                    </div>

                    <div className="ws-open-timeline-item">
                      <div className="ws-timeline-dot blue" />
                      <div className="ws-timeline-body">
                        <strong>Sarah Chen invited 2 new team members</strong>
                        <p>Sent onboarding invitation to design team associates.</p>
                        <small>3 days ago</small>
                      </div>
                    </div>

                    <div className="ws-open-timeline-item">
                      <div className="ws-timeline-dot amber" />
                      <div className="ws-timeline-body">
                        <strong>Workspace access policy verified</strong>
                        <p>RBAC permission mapping refreshed for all assigned roles.</p>
                        <small>5 days ago</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="ws-open-modal-footer">
              <div className="ws-open-footer-left">
                <span className="ws-open-env-id">Environment ID: <code>WS-TF-00{openedWorkspace.id}</code></span>
              </div>

              <div className="ws-open-footer-right">
                {openedWorkspace.slug !== activeWorkspaceSlug && (
                  <button
                    type="button"
                    className="ws-open-btn-make-active"
                    onClick={() => handleSetActiveWorkspace(openedWorkspace)}
                  >
                    <Star size={13} />
                    <span>Set as Active Workspace</span>
                  </button>
                )}
                <button
                  type="button"
                  className="ws-open-btn-primary"
                  onClick={() => handleGoToProjects(openedWorkspace)}
                >
                  <span>Launch Workspace</span>
                  <ArrowRight size={13} />
                </button>
                <button
                  type="button"
                  className="ws-btn-cancel"
                  onClick={() => setOpenedWorkspace(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
