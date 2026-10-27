import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ShieldCheck,
  Users,
  KeyRound,
  Shield,
  Plus,
  Search,
  Check,
  X,
  Building2,
  Lock,
  Unlock,
  ChevronDown,
  ArrowUpRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  Info,
  Award,
  Download,
  SlidersHorizontal,
  RefreshCw,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Trash2,
  UserCheck,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./RolesPermissions.css";

/* =========================================================================
   ROLES DEFINITION — EXACTLY 4 CORE ENTERPRISE ROLES
   1. Super Admin (Level 4 - Maximum, 100%)
   2. Admin (Level 3 - High, 80%)
   3. Team Lead (Level 2 - Moderate, 55%)
   4. Employee (Level 1 - Contributor, 30%)
   (Viewer / Auditor is permanently removed)
   ========================================================================= */
const INITIAL_ROLES = [
  {
    id: "role-super-admin",
    name: "Super Admin",
    level: "Level 4 - Maximum",
    responsibilityScore: 100,
    scope: "Global Platform Root",
    usersCount: 1,
    color: "#3b66ff",
    description: "Ultimate platform authority. Responsible and legally accountable for root infrastructure, all tenant boundaries, payment gateways, and system integrity.",
    highlights: ["Root Infrastructure", "Tenant Boundaries", "Payment Gateways"],
    keyResponsibilities: [
      "Global infrastructure, microservice clusters & database orchestration",
      "Financial settlement sign-off, billing gateways & enterprise subscriptions",
      "Multi-tenant lifecycle: Provisioning, data partition, and emergency suspension",
      "AI model gateway routing, LLM provider keys & global token limits",
      "Master compliance audit trails, security policy enforcement & 2FA overrides",
    ],
    accountability: "Directly accountable to Platform Executive Leadership.",
    isSystem: true,
  },
  {
    id: "role-admin",
    name: "Admin",
    level: "Level 3 - High",
    responsibilityScore: 80,
    scope: "Organization-Scoped",
    usersCount: 3,
    color: "#10b981",
    description: "Company executive authority. Responsible for organization-wide workspace governance, billing subscriptions, seat allocation, and department structures.",
    highlights: ["Company Workspace", "Subscription & Seats", "Member Onboarding"],
    keyResponsibilities: [
      "Company workspace configuration, departments, and workspace access gates",
      "Subscription plan renewals, tier upgrades, seat purchases & invoice downloads",
      "Organization member onboarding, offboarding & privilege delegation",
      "Departmental AI tool enablement and team prompt templates",
      "Company-wide audit log inspections and telemetry exports",
    ],
    accountability: "Accountable for tenant business operations and billing authorization.",
    isSystem: true,
  },
  {
    id: "role-team-lead",
    name: "Team Lead",
    level: "Level 2 - Moderate",
    responsibilityScore: 55,
    scope: "Departmental Workspace",
    usersCount: 2,
    color: "#f59e0b",
    description: "Operational delivery lead. Responsible for sprint execution, project milestones, task delegation, and departmental velocity.",
    highlights: ["Sprint Planning", "Task Delegation", "Code Review & QA"],
    keyResponsibilities: [
      "Project sprint planning, task assignment and milestone tracking",
      "Code review, quality assurance, and bug remediation dispatch",
      "Assigning AI workflows & assistants to project contributors",
      "Departmental sprint reports, workload balancing, and standups",
      "Resolving task blockers and escalating tenant-level issues",
    ],
    accountability: "Accountable for sprint deliverables and project deadlines.",
    isSystem: true,
  },
  {
    id: "role-employee",
    name: "Employee",
    level: "Level 1 - Contributor",
    responsibilityScore: 30,
    scope: "Assigned Workspaces",
    usersCount: 3,
    color: "#8b5cf6",
    description: "Hands-on execution contributor. Responsible for completing assigned tasks, collaborating on code & design, and generating deliverables.",
    highlights: ["Task Execution", "Team Collaboration", "AI Workspaces"],
    keyResponsibilities: [
      "Timely execution and completion of assigned sprint tasks & bug tickets",
      "Collaborative project chat, whiteboard ideation and document sharing",
      "Using TeamFlow AI assistant for code generation & research",
      "Updating task statuses and attending scheduled standups",
    ],
    accountability: "Accountable for individual task quality and schedule adherence.",
    isSystem: true,
  },
];

/* =========================================================================
   CORE ENTERPRISE RESPONSIBILITY MATRIX — 4 CORE MODULES x 4 ROLES
   ========================================================================= */
const PERMISSIONS_MATRIX = [
  {
    id: "mod-tenant-admin",
    module: "Tenant & Organization Administration",
    desc: "Manage customer organizations, workspace tenants, company domains & departmental boundaries",
    superAdmin: true,
    admin: true,
    teamLead: false,
    employee: false,
  },
  {
    id: "mod-identity-security",
    module: "Identity, Access & Security Governance",
    desc: "Manage user accounts, RBAC authority, enforce 2FA, session revocation & inspect IP audit trails",
    superAdmin: true,
    admin: true,
    teamLead: true,
    employee: false,
  },
  {
    id: "mod-ai-ops",
    module: "AI Workspaces & Prompt Operations",
    desc: "Route LLM model gateways, execute prompt workflows, team AI chat & document intelligence",
    superAdmin: true,
    admin: true,
    teamLead: true,
    employee: true,
  },
  {
    id: "mod-billing-revenue",
    module: "Billing, Plans & Revenue Operations",
    desc: "Manage enterprise subscriptions, seat licenses, payment gateways & download tax invoices",
    superAdmin: true,
    admin: true,
    teamLead: false,
    employee: false,
  },
];

const INITIAL_USERS = [
  {
    id: "USR-1001",
    name: "Himanshu Rao",
    email: "himanshu@teamflow.ai",
    org: "TeamFlow AI (Headquarters)",
    role: "Super Admin",
    scope: "Global Platform",
    joinedDate: "2024-01-10",
    status: "Active",
  },
  {
    id: "USR-1002",
    name: "Rahul Sharma",
    email: "rahul@abc.com",
    org: "ABC Technologies",
    role: "Admin",
    scope: "Organization",
    joinedDate: "2024-03-15",
    status: "Active",
  },
  {
    id: "USR-1003",
    name: "Amit Verma",
    email: "amit@xyz.com",
    org: "XYZ Software",
    role: "Admin",
    scope: "Organization",
    joinedDate: "2024-04-02",
    status: "Active",
  },
  {
    id: "USR-1004",
    name: "Priya Nair",
    email: "priya@novatech.io",
    org: "NovaTech Solutions",
    role: "Admin",
    scope: "Organization",
    joinedDate: "2024-05-18",
    status: "Active",
  },
  {
    id: "USR-1005",
    name: "Vikram Malhotra",
    email: "vikram@summit.org",
    org: "Summit Works",
    role: "Team Lead",
    scope: "Workspace",
    joinedDate: "2024-06-20",
    status: "Active",
  },
  {
    id: "USR-1006",
    name: "Elena Rostova",
    email: "elena@orbit.com",
    org: "Orbit Creative",
    role: "Team Lead",
    scope: "Workspace",
    joinedDate: "2024-07-11",
    status: "Active",
  },
  {
    id: "USR-1007",
    name: "Ananya Sen",
    email: "ananya@cloudnine.dev",
    org: "CloudNine Tech",
    role: "Employee",
    scope: "Workspace",
    joinedDate: "2024-08-01",
    status: "Active",
  },
  {
    id: "USR-1008",
    name: "Rohan Kapoor",
    email: "rohan@designhub.in",
    org: "DesignHub",
    role: "Employee",
    scope: "Workspace",
    joinedDate: "2024-08-15",
    status: "Active",
  },
  {
    id: "USR-1009",
    name: "Sana Sheikh",
    email: "sana@nextgen.com",
    org: "NextGen Solutions",
    role: "Employee",
    scope: "Workspace",
    joinedDate: "2024-09-02",
    status: "Suspended",
  },
];

const getRoleMetadata = (roleName) => {
  const normalized = (roleName || "").toLowerCase();
  if (normalized.includes("super")) {
    return {
      displayName: "Super Admin",
      level: "Level 4",
      title: "Platform Root Authority",
      score: 100,
      color: "#3b66ff",
      tagClass: "lvl-4-super",
      roleClass: "role-super-admin",
      summary: "Full platform governance, billing gateways, infrastructure & tenant isolation",
    };
  }
  if (normalized.includes("admin") || normalized.includes("tenant")) {
    return {
      displayName: "Admin",
      level: "Level 3",
      title: "Company Workspace Ownership",
      score: 80,
      color: "#10b981",
      tagClass: "lvl-3-admin",
      roleClass: "role-admin",
      summary: "Company workspace ownership, plan renewals, member onboarding & add-ons",
    };
  }
  if (normalized.includes("lead")) {
    return {
      displayName: "Team Lead",
      level: "Level 2",
      title: "Project & Sprint Delegation",
      score: 55,
      color: "#f59e0b",
      tagClass: "lvl-2-lead",
      roleClass: "role-team-lead",
      summary: "Sprint milestones, task assignment, code review & QA oversight",
    };
  }
  return {
    displayName: "Employee",
    level: "Level 1",
    title: "Task Execution & AI Ops",
    score: 30,
    color: "#8b5cf6",
    tagClass: "lvl-1-emp",
    roleClass: "role-employee",
    summary: "Direct execution of development tasks, collaboration chat & AI assistant prompts",
  };
};

function RolesPermissions() {
  const [activeTab, setActiveTab] = useState("users"); // "users" | "matrix"
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [orgFilter, setOrgFilter] = useState("All");
  const [density, setDensity] = useState("standard");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [toast, setToast] = useState("");

  // Modals state
  const [selectedRoleScope, setSelectedRoleScope] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [roleChangeTarget, setRoleChangeTarget] = useState(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState(null);
  const [batchDeleteConfirmOpen, setBatchDeleteConfirmOpen] = useState(false);
  const [deleteRoleTarget, setDeleteRoleTarget] = useState(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const [newRoleForm, setNewRoleForm] = useState({
    name: "",
    scope: "Workspace-Scoped",
    description: "",
    responsibilityScore: 40,
    highlight1: "",
    highlight2: "",
  });

  // Permanently purge any residual Viewer role from memory/HMR
  useEffect(() => {
    setRoles((prev) =>
      prev.filter(
        (r) =>
          r.id !== "role-viewer" &&
          !r.name.toLowerCase().includes("viewer") &&
          !r.name.toLowerCase().includes("auditor")
      )
    );
  }, []);

  // Global Escape key listener to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setModalOpen(false);
        setSelectedRoleScope(null);
        setRoleChangeTarget(null);
        setDeleteUserTarget(null);
        setBatchDeleteConfirmOpen(false);
        setDeleteRoleTarget(null);
        setResetConfirmOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="sap-sort-icon" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp size={12} className="sap-sort-icon is-active" />
    ) : (
      <ArrowDown size={12} className="sap-sort-icon is-active" />
    );
  };

  // Strictly filter out any Viewer card
  const cleanRoles = useMemo(() => {
    return roles.filter(
      (r) =>
        r.id !== "role-viewer" &&
        !r.name.toLowerCase().includes("viewer") &&
        !r.name.toLowerCase().includes("auditor")
    );
  }, [roles]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.org.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);

      const normUserRole = u.role.toLowerCase();
      let matchRole = roleFilter === "All";
      if (roleFilter === "Super Admin") {
        matchRole = normUserRole.includes("super");
      } else if (roleFilter === "Admin") {
        matchRole = normUserRole.includes("admin") && !normUserRole.includes("super");
      } else if (roleFilter === "Team Lead") {
        matchRole = normUserRole.includes("lead");
      } else if (roleFilter === "Employee") {
        matchRole = normUserRole.includes("emp") || normUserRole.includes("member") || normUserRole.includes("view");
      }

      const matchOrg = orgFilter === "All" || u.org === orgFilter;
      return matchSearch && matchRole && matchOrg;
    });
  }, [users, search, roleFilter, orgFilter]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let aVal = a[sortField] || "";
      let bVal = b[sortField] || "";
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedUsers.map((u) => u.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBatchActivate = () => {
    setUsers((prev) =>
      prev.map((u) => (selectedIds.has(u.id) ? { ...u, status: "Active" } : u))
    );
    notify(`Activated ${selectedIds.size} user permissions.`);
    setSelectedIds(new Set());
  };

  const handleBatchSuspend = () => {
    setUsers((prev) =>
      prev.map((u) => (selectedIds.has(u.id) ? { ...u, status: "Suspended" } : u))
    );
    notify(`Suspended ${selectedIds.size} user access passes.`);
    setSelectedIds(new Set());
  };

  const handleExportCSV = () => {
    const headers = [
      "User ID",
      "Name",
      "Email",
      "Organization",
      "Assigned Role",
      "Joined Date",
      "Status",
    ];
    const rows = sortedUsers.map((u) => [
      u.id,
      u.name,
      u.email,
      u.org,
      u.role,
      u.joinedDate,
      u.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers, ...rows]
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "teamflow_rbac_authority_directory.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("Exported authority directory spreadsheet.");
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    notify(`User role updated to ${newRole}.`);
  };

  const handleToggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
          : u
      )
    );
    notify("User account status toggled.");
  };

  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!newRoleForm.name) return;

    const highlights = [
      newRoleForm.highlight1 || "Custom Authority",
      newRoleForm.highlight2 || "Workspace Delegation",
      "Policy Compliance",
    ].filter(Boolean);

    const newRole = {
      id: `role-${Date.now()}`,
      name: newRoleForm.name,
      level: `Level Custom (${newRoleForm.responsibilityScore}%)`,
      responsibilityScore: Number(newRoleForm.responsibilityScore) || 40,
      scope: newRoleForm.scope,
      usersCount: 0,
      color: "#8b5cf6",
      description: newRoleForm.description,
      highlights,
      keyResponsibilities: [
        "Custom delegated enterprise responsibilities",
        "Assigned according to company governance policies",
        "Subject to periodic departmental audit inspections",
      ],
      accountability: "Accountable to designated department administrator.",
      isSystem: false,
    };

    setRoles((prev) => [...prev, newRole]);
    setModalOpen(false);
    setNewRoleForm({
      name: "",
      scope: "Workspace-Scoped",
      description: "",
      responsibilityScore: 40,
      highlight1: "",
      highlight2: "",
    });
    notify(`Custom role "${newRole.name}" created successfully.`);
  };

  return (
    <div className="roles-permissions-page">
      {/* 1. SAP Master Header Bar */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>Roles &amp; Responsibility Governance</h1>
          <p className="sap-header-subtitle">
            Configure role-based access control (RBAC), review authority tiers, and audit responsibility allocations.
          </p>
        </div>

        <div className="sap-header-actions">
          <div className="sa-billing-toggle">
            <button
              type="button"
              className={`sa-billing-tab ${activeTab === "users" ? "is-active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <Users size={14} /> User Authority Directory
            </button>
            <button
              type="button"
              className={`sa-billing-tab ${activeTab === "matrix" ? "is-active" : ""}`}
              onClick={() => setActiveTab("matrix")}
            >
              <ShieldCheck size={14} /> Responsibility Matrix
            </button>
          </div>

          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={handleExportCSV}
          >
            <Download size={15} /> Export Spreadsheet
          </button>

          <button
            type="button"
            className="sa-btn sa-btn-primary"
            onClick={() => setModalOpen(true)}
          >
            <Plus size={16} /> Create Custom Role
          </button>
        </div>
      </section>

      {/* 2. Top 4 Telemetry Cards */}
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <ShieldCheck size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Responsibility Levels</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">4 Tiers</span>
              <span className="sa-kpi-trend positive">Level 1 - 4</span>
            </div>
            <span className="sa-kpi-subtitle">Super Admin, Admin, Lead, Employee</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <Users size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Assigned Users</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{users.length}</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 100% Bound
              </span>
            </div>
            <span className="sa-kpi-subtitle">Zero unprivileged accounts</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box sky">
            <KeyRound size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Root Super Admins</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">
                {users.filter((u) => u.role === "Super Admin").length || 1}
              </span>
              <span className="sa-kpi-trend positive">Protected</span>
            </div>
            <span className="sa-kpi-subtitle">100% System Accountability</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box purple">
            <Lock size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Security Domains</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">4 Core Modules</span>
              <span className="sa-kpi-trend positive">100% Governed</span>
            </div>
            <span className="sa-kpi-subtitle">Granular operational action gates</span>
          </div>
        </article>
      </section>

      {toast && (
        <div className="sa-toast-banner">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* 3. TAB 1: User Role Directory With Responsibility Meter */}
      {activeTab === "users" && (
        <section className="sap-table-card">
          {/* Multi-Selection Batch Actions Bar */}
          {selectedIds.size > 0 && (
            <div className="sap-batch-banner">
              <span>
                <strong>{selectedIds.size}</strong> user authorities selected
              </span>
              <div className="sap-batch-actions">
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary sa-btn-sm"
                  onClick={handleBatchActivate}
                >
                  <Unlock size={13} /> Activate Selected
                </button>
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary sa-btn-sm"
                  onClick={handleBatchSuspend}
                >
                  <Lock size={13} /> Suspend Selected
                </button>
                <button
                  type="button"
                  className="sa-btn sa-btn-danger sa-btn-sm"
                  onClick={() => setBatchDeleteConfirmOpen(true)}
                >
                  <Trash2 size={13} /> Delete Selected
                </button>
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary sa-btn-sm"
                  onClick={handleExportCSV}
                >
                  <Download size={13} /> Export Selected
                </button>
                <button
                  type="button"
                  className="sa-btn sa-btn-sm"
                  style={{ background: "transparent", color: "inherit", border: 0 }}
                  onClick={() => setSelectedIds(new Set())}
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Toolbar & Filter Bar */}
          <div className="sap-toolbar">
            <div className="sap-toolbar-left">
              <div className="sap-search-input">
                <Search size={15} style={{ color: "var(--sa-text-muted)" }} />
                <input
                  type="text"
                  placeholder="Search user by name, email, organization, or ID..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <select
                className="sap-filter-select"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">Role: All Roles</option>
                <option value="Super Admin">Super Admin (Level 4)</option>
                <option value="Admin">Admin (Level 3)</option>
                <option value="Team Lead">Team Lead (Level 2)</option>
                <option value="Employee">Employee (Level 1)</option>
              </select>

              <select
                className="sap-filter-select"
                value={orgFilter}
                onChange={(e) => {
                  setOrgFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">Organization: All</option>
                <option value="TeamFlow AI (Headquarters)">TeamFlow AI (HQ)</option>
                <option value="ABC Technologies">ABC Technologies</option>
                <option value="XYZ Software">XYZ Software</option>
                <option value="NovaTech Solutions">NovaTech Solutions</option>
                <option value="Summit Works">Summit Works</option>
                <option value="Orbit Creative">Orbit Creative</option>
                <option value="CloudNine Tech">CloudNine Tech</option>
                <option value="DesignHub">DesignHub</option>
                <option value="NextGen Solutions">NextGen Solutions</option>
              </select>
            </div>

            <div className="sap-toolbar-right">
              {/* Density Switcher */}
              <button
                type="button"
                className="sap-icon-btn"
                onClick={() => setDensity((d) => (d === "standard" ? "compact" : "standard"))}
                title={`Switch density (currently ${density})`}
              >
                <SlidersHorizontal size={15} />
              </button>

              {/* Reset Filters */}
              <button
                type="button"
                className="sap-icon-btn"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("All");
                  setOrgFilter("All");
                  setPage(1);
                }}
                title="Reset all filters"
              >
                <RefreshCw size={15} />
              </button>

              {/* Reset Demo Data */}
              <button
                type="button"
                className="sap-icon-btn"
                onClick={() => setResetConfirmOpen(true)}
                title="Reset all data to default demo state"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* Table Data Grid */}
          <div className="sap-table-wrapper">
            <table className={`sap-grid is-${density}`}>
              <thead>
                <tr>
                  <th style={{ width: 38, textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={
                        paginatedUsers.length > 0 &&
                        paginatedUsers.every((u) => selectedIds.has(u.id))
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th
                    style={{ width: 110 }}
                    className="sap-sortable-th"
                    onClick={() => handleSort("id")}
                    title="Sort by User ID"
                  >
                    <span className="sap-th-content">
                      User ID {renderSortIcon("id")}
                    </span>
                  </th>
                  <th
                    className="sap-sortable-th"
                    onClick={() => handleSort("name")}
                    title="Sort by Name"
                  >
                    <span className="sap-th-content">
                      User Identity {renderSortIcon("name")}
                    </span>
                  </th>
                  <th
                    className="sap-sortable-th"
                    onClick={() => handleSort("org")}
                    title="Sort by Organization"
                  >
                    <span className="sap-th-content">
                      Organization {renderSortIcon("org")}
                    </span>
                  </th>
                  <th
                    className="sap-sortable-th"
                    onClick={() => handleSort("role")}
                    title="Sort by Assigned Role"
                  >
                    <span className="sap-th-content">
                      Assigned Role {renderSortIcon("role")}
                    </span>
                  </th>
                  <th>Authority &amp; Responsibility Scope</th>
                  <th
                    className="sap-sortable-th"
                    onClick={() => handleSort("joinedDate")}
                    title="Sort by Joined Date"
                  >
                    <span className="sap-th-content">
                      Joined Date {renderSortIcon("joinedDate")}
                    </span>
                  </th>
                  <th
                    className="sap-sortable-th"
                    onClick={() => handleSort("status")}
                    title="Sort by Status"
                  >
                    <span className="sap-th-content">
                      Status {renderSortIcon("status")}
                    </span>
                  </th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => {
                  const meta = getRoleMetadata(u.role);
                  const isSelected = selectedIds.has(u.id);

                  return (
                    <tr key={u.id} className={isSelected ? "is-selected" : ""}>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(u.id)}
                        />
                      </td>
                      <td>
                        <span className="sap-id-cell">{u.id}</span>
                      </td>
                      <td>
                        <div className="sap-user-badge">
                          <span
                            className="sap-avatar-chip"
                            style={{
                              backgroundColor: `${meta.color}15`,
                              color: meta.color,
                              fontWeight: 700,
                            }}
                          >
                            {u.name[0]}
                          </span>
                          <div className="sap-user-info">
                            <strong className="sap-user-name">{u.name}</strong>
                            <span className="sap-user-email">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Building2 size={14} style={{ color: "#3b66ff" }} />
                          <span style={{ fontSize: 13, color: "var(--sa-text-primary)" }}>{u.org}</span>
                        </div>
                      </td>

                      {/* CLEAR, VIBRANT ASSIGNED ROLE BADGE — NO DROPDOWN CHEVRONS */}
                      <td>
                        <span
                          className={`sa-role-badge ${meta.roleClass}`}
                          title="Assigned Role (Click to reassign)"
                          onClick={() => setRoleChangeTarget(u)}
                        >
                          {meta.displayName}
                        </span>
                      </td>

                      {/* Explicit Responsibility Level & Meter */}
                      <td>
                        <div className="sa-resp-col-wrap">
                          <div className="sa-resp-header">
                            <span className={`sa-resp-tag ${meta.tagClass}`}>
                              {meta.level}
                            </span>
                            <span className="sa-resp-score">
                              {meta.score}% Authority
                            </span>
                          </div>
                          <div className="sa-resp-bar-track">
                            <div
                              className="sa-resp-bar-fill"
                              style={{ width: `${meta.score}%`, backgroundColor: meta.color }}
                            />
                          </div>
                          <div className="sa-resp-summary-text">
                            <strong>{meta.title}</strong>
                          </div>
                          <button
                            type="button"
                            className="sa-card-link"
                            style={{ padding: 0, marginTop: 2, fontSize: 11, textAlign: "left", width: "fit-content" }}
                            onClick={() => {
                              const roleObj = cleanRoles.find((r) => r.name.toLowerCase().includes(meta.displayName.toLowerCase())) || cleanRoles[0];
                              setSelectedRoleScope({ ...roleObj, userName: u.name });
                            }}
                          >
                            <Info size={11} style={{ marginRight: 3, verticalAlign: -1 }} /> View exact responsibilities
                          </button>
                        </div>
                      </td>

                      <td style={{ color: "var(--sa-text-muted)", fontSize: 12 }}>{u.joinedDate}</td>

                      {/* Vibrant Colored Status Badge */}
                      <td>
                        <span
                          className={`sap-status-pill ${
                            u.status === "Active" ? "is-active" : "is-suspended"
                          }`}
                        >
                          <span className="sap-status-dot" />
                          {u.status}
                        </span>
                      </td>

                      {/* Attractive Colored Action Buttons */}
                      <td style={{ textAlign: "right" }}>
                        <div className="sa-action-group">
                          <button
                            type="button"
                            className={`sa-action-btn ${u.status === "Active" ? "btn-suspend" : "btn-activate"}`}
                            onClick={() => handleToggleStatus(u.id)}
                            title={u.status === "Active" ? "Suspend user access" : "Activate user access"}
                          >
                            {u.status === "Active" ? <Lock size={14} /> : <Unlock size={14} />}
                          </button>
                          <button
                            type="button"
                            className="sa-action-btn btn-edit-role"
                            onClick={() => setRoleChangeTarget(u)}
                            title="Reassign user role"
                          >
                            <KeyRound size={14} />
                          </button>
                          <button
                            type="button"
                            className="sa-action-btn btn-delete"
                            onClick={() => setDeleteUserTarget(u)}
                            title="Revoke user authority"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginatedUsers.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: 32, color: "var(--sa-text-muted)" }}>
                      No users match the search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Bar */}
          <div className="sap-footer-bar">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div className="sap-counter">
                Showing{" "}
                <strong>
                  {sortedUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                </strong>{" "}
                to{" "}
                <strong>
                  {Math.min(currentPage * pageSize, sortedUsers.length)}
                </strong>{" "}
                of <strong>{sortedUsers.length}</strong> user authorities
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
                <span>Rows:</span>
                <select
                  className="sap-filter-select"
                  style={{ padding: "3px 6px", fontSize: 12, height: 26 }}
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="sap-pagination">
              <button
                type="button"
                className="sap-page-btn"
                disabled={currentPage <= 1}
                onClick={() => setPage(1)}
                title="First Page"
              >
                <ChevronsLeft size={15} />
              </button>
              <button
                type="button"
                className="sap-page-btn"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                title="Previous Page"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="sap-page-indicator">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                type="button"
                className="sap-page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                title="Next Page"
              >
                <ChevronRight size={15} />
              </button>
              <button
                type="button"
                className="sap-page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(totalPages)}
                title="Last Page"
              >
                <ChevronsRight size={15} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 4. TAB 2: Roles Grid, Key Responsibilities Breakdown & Permissions Matrix */}
      {activeTab === "matrix" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Exactly 4 Clean, Symmetrical Role Cards (Super Admin, Admin, Team Lead, Employee) */}
          <div className="sa-roles-cards-grid">
            {cleanRoles.map((r) => {
              const meta = getRoleMetadata(r.name);
              const liveUsersCount = users.filter((u) => {
                const norm = u.role.toLowerCase();
                if (r.id === "role-super-admin") return norm.includes("super");
                if (r.id === "role-admin") return norm.includes("admin") && !norm.includes("super");
                if (r.id === "role-team-lead") return norm.includes("lead");
                if (r.id === "role-employee") return norm.includes("emp") || norm.includes("member");
                return false;
              }).length;

              return (
                <article key={r.id} className="sa-role-summary-card">
                  {/* Top Header Row */}
                  <div className="sa-role-card-top">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 8,
                          backgroundColor: `${r.color}15`,
                          color: r.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <ShieldCheck size={20} strokeWidth={2.2} />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--sa-text-main, #0f172a)" }}>
                            {r.name}
                          </h3>
                          <span className={`sa-resp-tag ${meta.tagClass}`}>
                            {r.level || meta.level}
                          </span>
                        </div>
                        <span style={{ fontSize: 11.5, color: "var(--sa-text-secondary, #64748b)" }}>{r.scope}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          padding: "3px 9px",
                          borderRadius: 20,
                          fontSize: 11.5,
                          fontWeight: 750,
                          backgroundColor: `${r.color}15`,
                          color: r.color,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.responsibilityScore || meta.score}% Authority
                      </span>
                      {!r.isSystem && (
                        <button
                          type="button"
                          className="sap-icon-btn is-danger"
                          title="Delete Custom Role"
                          onClick={() => setDeleteRoleTarget(r)}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Delegated Authority Progress Meter */}
                  <div style={{ margin: "2px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                      <span style={{ color: "var(--sa-text-secondary, #64748b)" }}>Delegated Authority Reach</span>
                      <strong style={{ color: r.color }}>{r.responsibilityScore || meta.score}%</strong>
                    </div>
                    <div className="sa-resp-bar-track" style={{ height: 6, borderRadius: 3 }}>
                      <div
                        className="sa-resp-bar-fill"
                        style={{
                          width: `${r.responsibilityScore || meta.score}%`,
                          backgroundColor: r.color,
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  </div>

                  {/* Concise 1-2 sentence description */}
                  <p className="sa-role-desc">
                    {r.description}
                  </p>

                  {/* Minimized 3-Chip Capability Highlights */}
                  <div className="sa-role-highlights">
                    {(r.highlights || []).map((h, i) => (
                      <span
                        key={i}
                        className="sa-role-chip"
                        style={{ borderColor: `${r.color}35`, color: r.color }}
                      >
                        <Check size={12} strokeWidth={2.4} /> {h}
                      </span>
                    ))}
                  </div>

                  {/* Compact Card Footer */}
                  <div className="sa-role-card-footer">
                    <span className="sa-role-user-count">
                      <Users size={13} /> <strong>{liveUsersCount}</strong> assigned users
                    </span>
                    <button
                      type="button"
                      className="sa-btn sa-btn-secondary sa-btn-sm"
                      style={{ fontSize: 11.5, padding: "4px 10px" }}
                      onClick={() => setSelectedRoleScope(r)}
                    >
                      Inspect Scope Details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Permissions Matrix Table — 4 Pillars x 4 Role Columns */}
          <section className="sa-card sa-matrix-card">
            <div className="sa-card-header" style={{ marginBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--sa-text-main)" }}>
                  Core Enterprise Governance Matrix
                </h3>
                <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--sa-text-secondary)" }}>
                  System enforcement matrix across the 4 core platform governance pillars and operational action gates.
                </p>
              </div>
              <span
                className="sa-total-tag"
                style={{
                  background: "rgba(59, 102, 255, 0.1)",
                  color: "#3b66ff",
                  fontWeight: 700,
                  fontSize: 12,
                  padding: "4px 10px",
                  borderRadius: 20,
                }}
              >
                4 Core Modules
              </span>
            </div>

            <div className="sa-table-wrapper">
              <table className="sa-table sa-matrix-table">
                <thead>
                  <tr>
                    <th style={{ width: "36%" }}>Core Enterprise Module &amp; Scope</th>
                    <th style={{ textAlign: "center" }}>
                      <span style={{ color: "#3b66ff", fontWeight: 750 }}>SUPER ADMIN</span>
                      <div style={{ fontSize: 10.5, fontWeight: 500, color: "var(--sa-text-muted)" }}>100% ROOT</div>
                    </th>
                    <th style={{ textAlign: "center" }}>
                      <span style={{ color: "#10b981", fontWeight: 750 }}>ADMIN</span>
                      <div style={{ fontSize: 10.5, fontWeight: 500, color: "var(--sa-text-muted)" }}>80% ORG</div>
                    </th>
                    <th style={{ textAlign: "center" }}>
                      <span style={{ color: "#f59e0b", fontWeight: 750 }}>TEAM LEAD</span>
                      <div style={{ fontSize: 10.5, fontWeight: 500, color: "var(--sa-text-muted)" }}>55% WORKSPACE</div>
                    </th>
                    <th style={{ textAlign: "center" }}>
                      <span style={{ color: "#8b5cf6", fontWeight: 750 }}>EMPLOYEE</span>
                      <div style={{ fontSize: 10.5, fontWeight: 500, color: "var(--sa-text-muted)" }}>30% CONTRIBUTOR</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PERMISSIONS_MATRIX.map((row) => (
                    <tr key={row.id || row.module}>
                      <td>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 6,
                              background: "var(--sa-bg, #f1f5f9)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#3b66ff",
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          >
                            <ShieldCheck size={17} />
                          </div>
                          <div>
                            <strong style={{ fontSize: 13.5, color: "var(--sa-text-main)" }}>{row.module}</strong>
                            <div style={{ color: "var(--sa-text-muted)", fontSize: 11.5, marginTop: 2, lineHeight: 1.4 }}>
                              {row.desc}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="sa-perm-check yes" title="Full Authority">
                          <Check size={14} strokeWidth={2.6} />
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {row.admin ? (
                          <span className="sa-perm-check yes" title="Authorized">
                            <Check size={14} strokeWidth={2.6} />
                          </span>
                        ) : (
                          <span className="sa-perm-check no" title="Restricted">
                            <X size={14} strokeWidth={2.2} />
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {row.teamLead ? (
                          <span className="sa-perm-check yes" title="Authorized">
                            <Check size={14} strokeWidth={2.6} />
                          </span>
                        ) : (
                          <span className="sa-perm-check no" title="Restricted">
                            <X size={14} strokeWidth={2.2} />
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {row.employee ? (
                          <span className="sa-perm-check yes" title="Authorized">
                            <Check size={14} strokeWidth={2.6} />
                          </span>
                        ) : (
                          <span className="sa-perm-check no" title="Restricted">
                            <X size={14} strokeWidth={2.2} />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* =========================================================================
          PORTALED MODALS (Escape key + backdrop click close supported)
          ========================================================================= */}

      {/* 5. Reassign User Role Modal */}
      {roleChangeTarget && typeof document !== "undefined" && createPortal(
        <div
          className="sa-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setRoleChangeTarget(null);
          }}
        >
          <div className="sa-modal-content" style={{ maxWidth: 460 }}>
            <div className="sa-modal-header">
              <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <KeyRound size={18} style={{ color: "#3b66ff" }} /> Reassign Authority Role
              </h3>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setRoleChangeTarget(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body">
              <div style={{ marginBottom: 16 }}>
                <p style={{ margin: "0 0 4px", fontSize: 13, color: "var(--sa-text-secondary)" }}>
                  Change assigned role and authority scope for:
                </p>
                <strong style={{ fontSize: 15, color: "var(--sa-text-main)" }}>
                  {roleChangeTarget.name}
                </strong>
                <span style={{ fontSize: 12, color: "var(--sa-text-muted)", marginLeft: 6 }}>
                  ({roleChangeTarget.email})
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {cleanRoles.map((r) => {
                  const meta = getRoleMetadata(r.name);
                  const isCurrent =
                    (r.name === "Admin" && roleChangeTarget.role === "Admin") ||
                    (r.name === "Super Admin" && roleChangeTarget.role === "Super Admin") ||
                    (r.name === "Team Lead" && roleChangeTarget.role === "Team Lead") ||
                    (r.name === "Employee" && roleChangeTarget.role === "Employee");

                  return (
                    <div
                      key={r.id}
                      style={{
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: isCurrent ? `2px solid ${r.color}` : "1px solid var(--sa-border, #e2e8f0)",
                        background: isCurrent ? `${r.color}10` : "var(--sa-bg, #f8fafc)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleRoleChange(roleChangeTarget.id, r.name);
                        setRoleChangeTarget(null);
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            border: `2px solid ${r.color}`,
                            background: isCurrent ? r.color : "transparent",
                          }}
                        />
                        <div>
                          <strong style={{ fontSize: 13, color: "var(--sa-text-main)" }}>
                            {r.name}
                          </strong>
                          <div style={{ fontSize: 11, color: "var(--sa-text-muted)" }}>
                            {meta.title} · {r.responsibilityScore}% Authority
                          </div>
                        </div>
                      </div>
                      <span className={`sa-resp-tag ${meta.tagClass}`} style={{ fontSize: 11 }}>
                        {meta.level}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="sa-modal-footer">
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={() => setRoleChangeTarget(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 6. Responsibility Breakdown Inspector Modal */}
      {selectedRoleScope && typeof document !== "undefined" && createPortal(
        <div
          className="sa-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedRoleScope(null);
          }}
        >
          <div className="sa-modal-content" style={{ maxWidth: 560 }}>
            <div className="sa-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: `${selectedRoleScope.color || "#3b66ff"}15`,
                    color: selectedRoleScope.color || "#3b66ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>
                    {selectedRoleScope.name} — Responsibility Scope
                  </h3>
                  {selectedRoleScope.userName && (
                    <span style={{ fontSize: 11.5, color: "var(--sa-text-muted)" }}>
                      User: <strong>{selectedRoleScope.userName}</strong> · {selectedRoleScope.level}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setSelectedRoleScope(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span
                  className="sa-resp-tag"
                  style={{
                    fontSize: 12,
                    padding: "4px 10px",
                    backgroundColor: `${selectedRoleScope.color || "#3b66ff"}18`,
                    color: selectedRoleScope.color || "#3b66ff",
                    fontWeight: 700,
                  }}
                >
                  Authority Reach: {selectedRoleScope.responsibilityScore || 80}%
                </span>
                <span style={{ fontSize: 12, color: "var(--sa-text-muted)" }}>
                  Scope: <strong>{selectedRoleScope.scope}</strong>
                </span>
              </div>

              <div style={{ marginBottom: 14, fontSize: 13, color: "var(--sa-text-secondary)", lineHeight: 1.5 }}>
                {selectedRoleScope.description}
              </div>

              <div className="sa-resp-modal-section">
                <h4 style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 8px" }}>
                  <Award size={15} style={{ color: selectedRoleScope.color || "#3b66ff" }} />
                  Mandated Operational Responsibilities:
                </h4>
                <ul className="sa-resp-modal-bullets">
                  {(selectedRoleScope.keyResponsibilities || [
                    "Full lifecycle responsibility for domain operational integrity",
                    "Sign-off authorization for departmental deliverables",
                  ]).map((item, idx) => (
                    <li key={idx} style={{ marginBottom: 6 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedRoleScope.accountability && (
                <div className="sa-resp-modal-section">
                  <h4 style={{ margin: "0 0 4px" }}>Accountability &amp; Legal Sign-off:</h4>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--sa-text-secondary)", lineHeight: 1.5 }}>
                    {selectedRoleScope.accountability}
                  </p>
                </div>
              )}
            </div>

            <div className="sa-modal-footer">
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={() => setSelectedRoleScope(null)}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 7. Create Custom Role Modal */}
      {modalOpen && typeof document !== "undefined" && createPortal(
        <div
          className="sa-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="sa-modal-content">
            <div className="sa-modal-header">
              <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <Plus size={18} /> Create Custom Enterprise Role
              </h3>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRole}>
              <div className="sa-modal-body">
                <div className="sa-form-group">
                  <label>Role Name *</label>
                  <input
                    type="text"
                    className="sa-form-input"
                    value={newRoleForm.name}
                    onChange={(e) =>
                      setNewRoleForm({ ...newRoleForm, name: e.target.value })
                    }
                    placeholder="e.g. Compliance Auditor or Operations Lead"
                    required
                  />
                </div>

                <div className="sa-form-group">
                  <label>Access Scope *</label>
                  <select
                    className="sa-form-select"
                    value={newRoleForm.scope}
                    onChange={(e) =>
                      setNewRoleForm({ ...newRoleForm, scope: e.target.value })
                    }
                  >
                    <option value="Workspace-Scoped">Workspace-Scoped</option>
                    <option value="Organization-Scoped">Organization-Scoped</option>
                    <option value="Global Platform">Global Platform</option>
                    <option value="Read-Only">Read-Only</option>
                  </select>
                </div>

                <div className="sa-form-group">
                  <label>Responsibility Score (Authority %) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="sa-form-input"
                    value={newRoleForm.responsibilityScore}
                    onChange={(e) =>
                      setNewRoleForm({ ...newRoleForm, responsibilityScore: e.target.value })
                    }
                    placeholder="e.g. 45"
                    required
                  />
                </div>

                <div className="sa-form-group">
                  <label>Key Capability Highlight 1 *</label>
                  <input
                    type="text"
                    className="sa-form-input"
                    value={newRoleForm.highlight1 || ""}
                    onChange={(e) =>
                      setNewRoleForm({ ...newRoleForm, highlight1: e.target.value })
                    }
                    placeholder="e.g. Compliance Reviews"
                    required
                  />
                </div>

                <div className="sa-form-group">
                  <label>Key Capability Highlight 2</label>
                  <input
                    type="text"
                    className="sa-form-input"
                    value={newRoleForm.highlight2 || ""}
                    onChange={(e) =>
                      setNewRoleForm({ ...newRoleForm, highlight2: e.target.value })
                    }
                    placeholder="e.g. Audit Trail Export"
                  />
                </div>

                <div className="sa-form-group">
                  <label>Role Responsibilities &amp; Authority Boundaries *</label>
                  <textarea
                    rows={3}
                    className="sa-form-textarea"
                    value={newRoleForm.description}
                    onChange={(e) =>
                      setNewRoleForm({
                        ...newRoleForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Specify the exact decisions and deliverables this role is responsible for..."
                    required
                  />
                </div>
              </div>

              <div className="sa-modal-footer">
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sa-btn sa-btn-primary">
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 8. Single User Delete Confirmation Modal */}
      {deleteUserTarget && typeof document !== "undefined" && createPortal(
        <div
          className="sa-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDeleteUserTarget(null);
          }}
        >
          <div className="sa-modal-content" style={{ maxWidth: 440 }}>
            <div className="sa-modal-header">
              <h3 style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                <ShieldAlert size={20} /> Revoke User Authority
              </h3>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setDeleteUserTarget(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body">
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--sa-text-secondary)" }}>
                Are you sure you want to permanently revoke role authority for{" "}
                <strong style={{ color: "var(--sa-text-main)" }}>{deleteUserTarget.name}</strong> ({deleteUserTarget.id})?
                This user will lose all delegated permissions across <strong>{deleteUserTarget.org}</strong>.
              </p>
            </div>

            <div className="sa-modal-footer">
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={() => setDeleteUserTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-danger"
                onClick={() => {
                  setUsers((prev) => prev.filter((u) => u.id !== deleteUserTarget.id));
                  setSelectedIds((prev) => {
                    const next = new Set(prev);
                    next.delete(deleteUserTarget.id);
                    return next;
                  });
                  notify(`Revoked authority for ${deleteUserTarget.name}.`);
                  setDeleteUserTarget(null);
                }}
              >
                Revoke Authority
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 9. Batch Delete Confirmation Modal */}
      {batchDeleteConfirmOpen && typeof document !== "undefined" && createPortal(
        <div
          className="sa-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setBatchDeleteConfirmOpen(false);
          }}
        >
          <div className="sa-modal-content" style={{ maxWidth: 440 }}>
            <div className="sa-modal-header">
              <h3 style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                <ShieldAlert size={20} /> Revoke Selected Authorities
              </h3>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setBatchDeleteConfirmOpen(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body">
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--sa-text-secondary)" }}>
                Are you sure you want to revoke authority mapping for{" "}
                <strong style={{ color: "var(--sa-text-main)" }}>{selectedIds.size}</strong> selected users?
                All affected users will be de-provisioned from their respective workspaces.
              </p>
            </div>

            <div className="sa-modal-footer">
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={() => setBatchDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-danger"
                onClick={() => {
                  setUsers((prev) => prev.filter((u) => !selectedIds.has(u.id)));
                  notify(`Revoked authority for ${selectedIds.size} users.`);
                  setSelectedIds(new Set());
                  setBatchDeleteConfirmOpen(false);
                }}
              >
                Revoke Selected
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 10. Custom Role Delete Confirmation Modal */}
      {deleteRoleTarget && typeof document !== "undefined" && createPortal(
        <div
          className="sa-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDeleteRoleTarget(null);
          }}
        >
          <div className="sa-modal-content" style={{ maxWidth: 440 }}>
            <div className="sa-modal-header">
              <h3 style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                <ShieldAlert size={20} /> Delete Custom Enterprise Role
              </h3>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setDeleteRoleTarget(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body">
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--sa-text-secondary)" }}>
                Are you sure you want to permanently delete custom role{" "}
                <strong style={{ color: "var(--sa-text-main)" }}>{deleteRoleTarget.name}</strong>?
                Any workspace bindings associated with this custom role will be unassigned.
              </p>
            </div>

            <div className="sa-modal-footer">
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={() => setDeleteRoleTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-danger"
                onClick={() => {
                  setRoles((prev) => prev.filter((r) => r.id !== deleteRoleTarget.id));
                  notify(`Custom role "${deleteRoleTarget.name}" deleted.`);
                  setDeleteRoleTarget(null);
                }}
              >
                Delete Role
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 11. Reset Demo Data Confirmation Modal */}
      {resetConfirmOpen && typeof document !== "undefined" && createPortal(
        <div
          className="sa-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setResetConfirmOpen(false);
          }}
        >
          <div className="sa-modal-content" style={{ maxWidth: 440 }}>
            <div className="sa-modal-header">
              <h3 style={{ color: "#3b66ff", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                <RotateCcw size={20} /> Reset Demo Directory Data
              </h3>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setResetConfirmOpen(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body">
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--sa-text-secondary)" }}>
                Are you sure you want to reset all user authority records and custom roles to their initial demo data?
                All deletions and custom modifications will be re-initialized.
              </p>
            </div>

            <div className="sa-modal-footer">
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={() => setResetConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-primary"
                onClick={() => {
                  setUsers(INITIAL_USERS);
                  setRoles(INITIAL_ROLES);
                  setSelectedIds(new Set());
                  setSearch("");
                  setRoleFilter("All");
                  setOrgFilter("All");
                  setPage(1);
                  notify("All role and user authority data restored to initial demo state.");
                  setResetConfirmOpen(false);
                }}
              >
                Reset Demo Data
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default RolesPermissions;
