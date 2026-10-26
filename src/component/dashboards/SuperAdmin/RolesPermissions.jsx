import { useMemo, useState } from "react";
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
  ChevronDown,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Info,
  Award,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./RolesPermissions.css";

/* =========================================================================
   ROLES DEFINITION WITH GRANULAR RESPONSIBILITIES & ACCOUNTABILITY
   Clearly defines who has how much responsibility across TeamFlow AI
   ========================================================================= */
const INITIAL_ROLES = [
  {
    id: "role-super-admin",
    name: "Super Admin",
    level: "Level 5 - Maximum",
    responsibilityScore: 100,
    scope: "Global Platform Root",
    usersCount: 3,
    color: "#3b66ff",
    description: "Ultimate platform authority. Responsible and legally accountable for root infrastructure, all tenant boundaries, payment gateways, and system integrity.",
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
    id: "role-tenant-admin",
    name: "Tenant Admin",
    level: "Level 4 - High",
    responsibilityScore: 80,
    scope: "Organization-Scoped",
    usersCount: 186,
    color: "#10b981",
    description: "Company executive authority. Responsible for their organization's entire TeamFlow workspace, billing subscriptions, seat allocation, and departmental structure.",
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
    level: "Level 3 - Moderate",
    responsibilityScore: 55,
    scope: "Departmental Workspace",
    usersCount: 342,
    color: "#f59e0b",
    description: "Operational delivery lead. Responsible for sprint execution, project milestones, task delegation, and departmental velocity.",
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
    id: "role-member",
    name: "Member / Employee",
    level: "Level 2 - Contributor",
    responsibilityScore: 30,
    scope: "Assigned Workspaces",
    usersCount: 685,
    color: "#6366f1",
    description: "Hands-on execution contributor. Responsible for completing assigned tasks, collaborating on code & design, and generating deliverables.",
    keyResponsibilities: [
      "Timely execution and completion of assigned sprint tasks & bug tickets",
      "Collaborative project chat, whiteboard ideation and document sharing",
      "Using TeamFlow AI assistant for code generation & research",
      "Updating task statuses and attending scheduled standups",
    ],
    accountability: "Accountable for individual task quality and schedule adherence.",
    isSystem: true,
  },
  {
    id: "role-viewer",
    name: "Viewer / Auditor",
    level: "Level 1 - Observer",
    responsibilityScore: 10,
    scope: "Read-Only Compliance",
    usersCount: 32,
    color: "#64748b",
    description: "External auditor or stakeholder. Responsible for compliance reviews and inspection without write or execution authority.",
    keyResponsibilities: [
      "Read-only inspection of organizational project progress & reports",
      "Compliance audit trail review and tax invoice verification",
      "Monitoring system status indicators without mutation rights",
    ],
    accountability: "Accountable for independent compliance and audit reviews.",
    isSystem: false,
  },
];

const PERMISSIONS_MATRIX = [
  {
    module: "Tenant Organizations",
    desc: "Create, view, suspend or delete customer companies",
    superAdmin: true,
    tenantAdmin: false,
    teamLead: false,
    member: false,
    viewer: false,
  },
  {
    module: "User Management & Invites",
    desc: "Invite team members, assign workspace roles, revoke access",
    superAdmin: true,
    tenantAdmin: true,
    teamLead: true,
    member: false,
    viewer: false,
  },
  {
    module: "Billing, Plans & Invoices",
    desc: "Change pricing plans, download tax invoices, view payments",
    superAdmin: true,
    tenantAdmin: true,
    teamLead: false,
    member: false,
    viewer: false,
  },
  {
    module: "AI Model & Key Configuration",
    desc: "Configure Gemini / OpenAI keys, set global token limits",
    superAdmin: true,
    tenantAdmin: false,
    teamLead: false,
    member: false,
    viewer: false,
  },
  {
    module: "AI Prompt Execution & Workspaces",
    desc: "Run models, generate code, chat with document intelligence",
    superAdmin: true,
    tenantAdmin: true,
    teamLead: true,
    member: true,
    viewer: false,
  },
  {
    module: "System Telemetry & Health",
    desc: "Inspect microservices, server latencies, CPU/Memory load",
    superAdmin: true,
    tenantAdmin: false,
    teamLead: false,
    member: false,
    viewer: true,
  },
  {
    module: "Platform Security & 2FA Governance",
    desc: "Enforce 2FA, terminate active sessions, view IP audit trail",
    superAdmin: true,
    tenantAdmin: false,
    teamLead: false,
    member: false,
    viewer: false,
  },
  {
    module: "SMTP & System Announcements",
    desc: "Configure transactional mail transport and publish alerts",
    superAdmin: true,
    tenantAdmin: false,
    teamLead: false,
    member: false,
    viewer: false,
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
    role: "Tenant Admin",
    scope: "Organization",
    joinedDate: "2024-03-15",
    status: "Active",
  },
  {
    id: "USR-1003",
    name: "Amit Verma",
    email: "amit@xyz.com",
    org: "XYZ Software",
    role: "Tenant Admin",
    scope: "Organization",
    joinedDate: "2024-04-02",
    status: "Active",
  },
  {
    id: "USR-1004",
    name: "Priya Nair",
    email: "priya@novatech.io",
    org: "NovaTech Solutions",
    role: "Tenant Admin",
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
    role: "Member",
    scope: "Workspace",
    joinedDate: "2024-08-01",
    status: "Active",
  },
  {
    id: "USR-1008",
    name: "Rohan Kapoor",
    email: "rohan@designhub.in",
    org: "DesignHub",
    role: "Member",
    scope: "Workspace",
    joinedDate: "2024-08-15",
    status: "Active",
  },
  {
    id: "USR-1009",
    name: "Sana Sheikh",
    email: "sana@nextgen.com",
    org: "NextGen Solutions",
    role: "Viewer",
    scope: "Read-Only",
    joinedDate: "2024-09-02",
    status: "Suspended",
  },
];

const getRoleMetadata = (roleName) => {
  const normalized = (roleName || "").toLowerCase();
  if (normalized.includes("super")) {
    return {
      level: "Level 5",
      title: "Platform Root Authority",
      score: 100,
      color: "#3b66ff",
      tagClass: "lvl-5",
      summary: "Full platform governance, billing gateways, infrastructure & tenant isolation",
    };
  }
  if (normalized.includes("tenant")) {
    return {
      level: "Level 4",
      title: "Tenant Ownership & Billing",
      score: 80,
      color: "#10b981",
      tagClass: "lvl-4",
      summary: "Company workspace ownership, plan renewals, member onboarding & add-ons",
    };
  }
  if (normalized.includes("lead")) {
    return {
      level: "Level 3",
      title: "Project & Team Delegation",
      score: 55,
      color: "#f59e0b",
      tagClass: "lvl-3",
      summary: "Sprint milestones, task assignment, code review & AI tool workflow acceleration",
    };
  }
  if (normalized.includes("member") || normalized.includes("employee")) {
    return {
      level: "Level 2",
      title: "Task Execution & AI Ops",
      score: 30,
      color: "#6366f1",
      tagClass: "lvl-2",
      summary: "Direct execution of development tasks, collaboration chat & AI assistant prompts",
    };
  }
  return {
    level: "Level 1",
    title: "Read-Only Compliance",
    score: 10,
    color: "#64748b",
    tagClass: "lvl-1",
    summary: "Audit trail inspection, invoice reconciliation & telemetry viewing only",
  };
};

function RolesPermissions() {
  const [activeTab, setActiveTab] = useState("users"); // "users" | "matrix"
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [orgFilter, setOrgFilter] = useState("All");
  const [toast, setToast] = useState("");
  const [selectedRoleScope, setSelectedRoleScope] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({
    name: "",
    scope: "Workspace-Scoped",
    description: "",
    responsibilityScore: 40,
  });

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.org.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);

      const matchRole =
        roleFilter === "All" || u.role.toLowerCase() === roleFilter.toLowerCase();
      const matchOrg = orgFilter === "All" || u.org === orgFilter;

      return matchSearch && matchRole && matchOrg;
    });
  }, [users, search, roleFilter, orgFilter]);

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

    const newRole = {
      id: `role-${Date.now()}`,
      name: newRoleForm.name,
      level: `Level Custom (${newRoleForm.responsibilityScore}%)`,
      responsibilityScore: Number(newRoleForm.responsibilityScore) || 40,
      scope: newRoleForm.scope,
      usersCount: 0,
      color: "#8b5cf6",
      description: newRoleForm.description,
      keyResponsibilities: [
        "Custom delegated enterprise responsibilities",
        "Assigned according to company governance policies",
      ],
      accountability: "Accountable to designated department administrator.",
      isSystem: false,
    };

    setRoles((prev) => [...prev, newRole]);
    setModalOpen(false);
    setNewRoleForm({ name: "", scope: "Workspace-Scoped", description: "", responsibilityScore: 40 });
    notify(`Custom role "${newRole.name}" created successfully.`);
  };

  return (
    <div className="sa-page-container sa-roles-page">
      {/* 1. Page Header */}
      <section className="sa-page-header">
        <div className="sa-page-header-left">
          <h1>Roles & Responsibility Governance</h1>
          <p>
            Configure role-based access control (RBAC), review authority tiers, and audit responsibility allocations.
          </p>
        </div>

        <div className="sa-page-header-actions">
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
            className="sa-btn sa-btn-primary"
            onClick={() => setModalOpen(true)}
          >
            <Plus size={16} /> Create Custom Role
          </button>
        </div>
      </section>

      {/* 2. Top 4 KPI Stat Cards */}
      <section className="sa-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <ShieldCheck size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Responsibility Levels</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">5 Tiers</span>
              <span className="sa-kpi-trend positive">
                Level 1 - 5
              </span>
            </div>
            <span className="sa-kpi-subtitle">Granular authority governance</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <Users size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Assigned Users</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">1,248</span>
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
              <span className="sa-kpi-value">3</span>
              <span className="sa-kpi-trend positive">
                Protected
              </span>
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
              <span className="sa-kpi-value">8 Modules</span>
              <span className="sa-kpi-trend positive">
                Audited
              </span>
            </div>
            <span className="sa-kpi-subtitle">Granular operational gates</span>
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
        <section className="sa-card sa-user-role-table-card">
          <div className="sa-filter-bar">
            <div className="sa-search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search user by name, email, organization, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <div className="sa-select-filter">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="All">All Roles</option>
                  <option value="Super Admin">Super Admin (Level 5)</option>
                  <option value="Tenant Admin">Tenant Admin (Level 4)</option>
                  <option value="Team Lead">Team Lead (Level 3)</option>
                  <option value="Member">Member (Level 2)</option>
                  <option value="Viewer">Viewer (Level 1)</option>
                </select>
                <ChevronDown size={13} className="sa-chevron" />
              </div>

              <div className="sa-select-filter">
                <select
                  value={orgFilter}
                  onChange={(e) => setOrgFilter(e.target.value)}
                >
                  <option value="All">All Organizations</option>
                  <option value="TeamFlow AI (Headquarters)">TeamFlow AI (HQ)</option>
                  <option value="ABC Technologies">ABC Technologies</option>
                  <option value="XYZ Software">XYZ Software</option>
                  <option value="NovaTech Solutions">NovaTech Solutions</option>
                  <option value="DesignHub">DesignHub</option>
                </select>
                <ChevronDown size={13} className="sa-chevron" />
              </div>
            </div>
          </div>

          <div className="sa-table-wrapper">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>User & Identity</th>
                  <th>Organization</th>
                  <th>Assigned Role</th>
                  <th>Authority & Responsibility Scope</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const meta = getRoleMetadata(u.role);
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="sa-user-badge">
                          <span className="sa-avatar-circle blue">
                            {u.name[0]}
                          </span>
                          <div>
                            <strong>{u.name}</strong>
                            <div style={{ color: "var(--sa-text-muted)", fontSize: 11 }}>
                              {u.email} · {u.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Building2 size={14} style={{ color: "#3b66ff" }} />
                          <span>{u.org}</span>
                        </div>
                      </td>
                      <td>
                        <select
                          className="sa-role-inline-select"
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="Tenant Admin">Tenant Admin</option>
                          <option value="Team Lead">Team Lead</option>
                          <option value="Member">Member</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      </td>

                      {/* Explicit Responsibility Level & Meter */}
                      <td>
                        <div className="sa-resp-col-wrap">
                          <div className="sa-resp-header">
                            <span className={`sa-resp-tag ${meta.tagClass}`}>
                              {meta.level}
                            </span>
                            <span className="sa-resp-score">
                              {meta.score}% Responsibility
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
                              const roleObj = roles.find((r) => r.name.toLowerCase().includes(u.role.toLowerCase())) || roles[0];
                              setSelectedRoleScope({ ...roleObj, userName: u.name });
                            }}
                          >
                            <Info size={11} style={{ marginRight: 3, verticalAlign: -1 }} /> View exact responsibilities
                          </button>
                        </div>
                      </td>

                      <td style={{ color: "var(--sa-text-muted)" }}>{u.joinedDate}</td>
                      <td>
                        <span
                          className={`sa-pill ${
                            u.status === "Active"
                              ? "sa-pill-success"
                              : "sa-pill-danger"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="sa-btn sa-btn-secondary sa-btn-sm"
                          onClick={() => handleToggleStatus(u.id)}
                        >
                          {u.status === "Active" ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--sa-text-muted)" }}>
                      No users match the search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 4. TAB 2: Roles Grid, Key Responsibilities Breakdown & Permissions Matrix */}
      {activeTab === "matrix" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Detailed Responsibility Hierarchy Breakdown */}
          <div className="sa-roles-cards-grid">
            {roles.map((r) => {
              const meta = getRoleMetadata(r.name);
              return (
                <article key={r.id} className="sa-role-summary-card">
                  <div className="sa-role-card-top">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span className={`sa-resp-tag ${meta.tagClass}`} style={{ fontSize: 10 }}>
                          {r.level || meta.level}
                        </span>
                        <h3 style={{ color: r.color, margin: 0, fontSize: 16 }}>{r.name}</h3>
                      </div>
                      <span className="sa-pill sa-pill-neutral" style={{ fontSize: 10.5, marginTop: 4 }}>
                        {r.scope}
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ fontSize: 16, color: "var(--sa-text-main)" }}>
                        {r.usersCount} <span style={{ fontSize: 11, fontWeight: 500, color: "var(--sa-text-muted)" }}>users</span>
                      </strong>
                      <div style={{ fontSize: 11, fontWeight: 700, color: meta.color, marginTop: 2 }}>
                        {r.responsibilityScore || meta.score}% Authority
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="sa-resp-bar-track" style={{ height: 6 }}>
                    <div
                      className="sa-resp-bar-fill"
                      style={{ width: `${r.responsibilityScore || meta.score}%`, backgroundColor: r.color }}
                    />
                  </div>

                  <p className="sa-role-desc">{r.description}</p>

                  {/* Explicit Responsibilities List */}
                  <div className="sa-role-resp-box">
                    <div className="sa-role-resp-title">
                      <Award size={13} style={{ color: r.color }} /> Primary Responsibilities:
                    </div>
                    <ul className="sa-role-resp-list">
                      {(r.keyResponsibilities || [
                        "Delegated operational execution",
                        "Responsible for department deliverables",
                      ]).map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                    {r.accountability && (
                      <div className="sa-role-accountability">
                        <strong>Accountability:</strong> {r.accountability}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Permissions Matrix Table */}
          <section className="sa-card sa-matrix-card">
            <div className="sa-card-header">
              <div>
                <h3>Granular Module Permissions & Action Gates</h3>
                <p>System enforcement matrix across all 8 governed microservices and features.</p>
              </div>
              <span className="sa-total-tag">8 Governed Modules</span>
            </div>

            <div className="sa-table-wrapper">
              <table className="sa-table sa-matrix-table">
                <thead>
                  <tr>
                    <th style={{ width: "30%" }}>Platform Module & Scope</th>
                    <th style={{ textAlign: "center" }}>Super Admin (100%)</th>
                    <th style={{ textAlign: "center" }}>Tenant Admin (80%)</th>
                    <th style={{ textAlign: "center" }}>Team Lead (55%)</th>
                    <th style={{ textAlign: "center" }}>Member (30%)</th>
                    <th style={{ textAlign: "center" }}>Viewer (10%)</th>
                  </tr>
                </thead>
                <tbody>
                  {PERMISSIONS_MATRIX.map((row) => (
                    <tr key={row.module}>
                      <td>
                        <strong>{row.module}</strong>
                        <div style={{ color: "var(--sa-text-muted)", fontSize: 11 }}>{row.desc}</div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="sa-perm-check yes"><Check size={14} /></span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {row.tenantAdmin ? (
                          <span className="sa-perm-check yes"><Check size={14} /></span>
                        ) : (
                          <span className="sa-perm-check no"><X size={14} /></span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {row.teamLead ? (
                          <span className="sa-perm-check yes"><Check size={14} /></span>
                        ) : (
                          <span className="sa-perm-check no"><X size={14} /></span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {row.member ? (
                          <span className="sa-perm-check yes"><Check size={14} /></span>
                        ) : (
                          <span className="sa-perm-check no"><X size={14} /></span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {row.viewer ? (
                          <span className="sa-perm-check yes"><Check size={14} /></span>
                        ) : (
                          <span className="sa-perm-check no"><X size={14} /></span>
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

      {/* 5. Responsibility Breakdown Inspector Modal */}
      {selectedRoleScope && (
        <div className="sa-modal-backdrop">
          <div className="sa-modal-content" style={{ maxWidth: 560 }}>
            <div className="sa-modal-header">
              <div>
                <h3 style={{ margin: 0 }}>
                  {selectedRoleScope.name} — Responsibility Scope
                </h3>
                {selectedRoleScope.userName && (
                  <span style={{ fontSize: 11.5, color: "var(--sa-text-muted)" }}>
                    User: {selectedRoleScope.userName} · {selectedRoleScope.level}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setSelectedRoleScope(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span className="sa-resp-tag lvl-5" style={{ fontSize: 12 }}>
                  Authority Level: {selectedRoleScope.responsibilityScore || 80}%
                </span>
                <span style={{ fontSize: 12, color: "var(--sa-text-muted)" }}>
                  Scope: {selectedRoleScope.scope}
                </span>
              </div>

              <div className="sa-resp-modal-section">
                <h4>Mandated Operational Responsibilities:</h4>
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
                  <h4>Accountability & Governance:</h4>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--sa-text-secondary)" }}>
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
        </div>
      )}

      {/* 6. Create Custom Role Modal */}
      {modalOpen && (
        <div className="sa-modal-backdrop">
          <div className="sa-modal-content">
            <div className="sa-modal-header">
              <h3>Create Custom Enterprise Role</h3>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRole}>
              <div className="sa-modal-body">
                <div className="sa-form-group">
                  <label>Role Name</label>
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
                  <label>Access Scope</label>
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
                  <label>Responsibility Score (Authority %)</label>
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
                  <label>Role Responsibilities & Authority Boundaries</label>
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
        </div>
      )}
    </div>
  );
}

export default RolesPermissions;
