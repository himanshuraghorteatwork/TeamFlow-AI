import { useEffect, useMemo, useState } from "react";
import {
  Users as UsersIcon,
  UserCheck,
  UserX,
  UserPlus,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Building2,
  CalendarDays,
  ShieldCheck,
  Mail,
  RefreshCw,
  CheckCircle2,
  Lock,
  Unlock,
  Download,
  SlidersHorizontal,
  ShieldAlert,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Users.css";

const STORAGE_KEY = "teamflow_superadmin_users";

/* =========================================================================
   SAP MASTER DATA USER REPOSITORY
   Standardized with Personnel Numbers, Company Codes, Cost Centers & 2FA
   ========================================================================= */
const INITIAL_USERS = [
  {
    id: "USR-1001",
    pernr: "802101",
    name: "Aarav Sharma",
    email: "aarav.sharma@acme.demo",
    organization: "Acme Technologies",
    companyCode: "1000 - ACME IN",
    department: "CC-ENG-402 (Engineering)",
    role: "Admin",
    status: "Active",
    twoFactor: "Enforced",
    lastLogin: "Today, 10:45 AM",
    joinedAt: "2026-10-02",
  },
  {
    id: "USR-1002",
    pernr: "802102",
    name: "Priya Patel",
    email: "priya.patel@bright.demo",
    organization: "Bright Solutions",
    companyCode: "2000 - BRIGHT UK",
    department: "CC-PROD-305 (Product)",
    role: "Manager",
    status: "Active",
    twoFactor: "Enforced",
    lastLogin: "Today, 09:15 AM",
    joinedAt: "2026-10-05",
  },
  {
    id: "USR-1003",
    pernr: "802103",
    name: "Rahul Verma",
    email: "rahul.verma@acme.demo",
    organization: "Acme Technologies",
    companyCode: "1000 - ACME IN",
    department: "CC-ENG-402 (Engineering)",
    role: "Member",
    status: "Active",
    twoFactor: "Enforced",
    lastLogin: "Yesterday, 17:30",
    joinedAt: "2026-10-07",
  },
  {
    id: "USR-1004",
    pernr: "802104",
    name: "Sneha Desai",
    email: "sneha.desai@nova.demo",
    organization: "Nova Digital",
    companyCode: "4000 - NOVA US",
    department: "CC-FIN-104 (Finance)",
    role: "Manager",
    status: "Suspended",
    twoFactor: "Pending",
    lastLogin: "3 days ago",
    joinedAt: "2026-09-18",
  },
  {
    id: "USR-1005",
    pernr: "802105",
    name: "Arjun Mehta",
    email: "arjun.mehta@bright.demo",
    organization: "Bright Solutions",
    companyCode: "2000 - BRIGHT UK",
    department: "CC-OPS-201 (Operations)",
    role: "Member",
    status: "Active",
    twoFactor: "Enforced",
    lastLogin: "Today, 11:10 AM",
    joinedAt: "2026-10-12",
  },
  {
    id: "USR-1006",
    pernr: "802106",
    name: "Ananya Joshi",
    email: "ananya.joshi@cloudnine.demo",
    organization: "CloudNine Labs",
    companyCode: "3000 - CLOUD SG",
    department: "CC-ENG-402 (Engineering)",
    role: "Admin",
    status: "Active",
    twoFactor: "Enforced",
    lastLogin: "Yesterday, 14:22",
    joinedAt: "2026-10-15",
  },
  {
    id: "USR-1007",
    pernr: "802107",
    name: "Karan Singh",
    email: "karan.singh@nova.demo",
    organization: "Nova Digital",
    companyCode: "4000 - NOVA US",
    department: "CC-MKT-301 (Marketing)",
    role: "Member",
    status: "Suspended",
    twoFactor: "Pending",
    lastLogin: "1 week ago",
    joinedAt: "2026-09-24",
  },
  {
    id: "USR-1008",
    pernr: "802108",
    name: "Isha Kulkarni",
    email: "isha.kulkarni@cloudnine.demo",
    organization: "CloudNine Labs",
    companyCode: "3000 - CLOUD SG",
    department: "CC-PROD-305 (Product)",
    role: "Manager",
    status: "Active",
    twoFactor: "Enforced",
    lastLogin: "Today, 08:40 AM",
    joinedAt: "2026-10-19",
  },
  {
    id: "USR-1009",
    pernr: "802109",
    name: "Vikram Rao",
    email: "vikram.rao@acme.demo",
    organization: "Acme Technologies",
    companyCode: "1000 - ACME IN",
    department: "CC-ENG-402 (Engineering)",
    role: "Member",
    status: "Active",
    twoFactor: "Enforced",
    lastLogin: "Oct 24, 2026",
    joinedAt: "2026-10-21",
  },
  {
    id: "USR-1010",
    pernr: "802110",
    name: "Meera Shah",
    email: "meera.shah@bright.demo",
    organization: "Bright Solutions",
    companyCode: "2000 - BRIGHT UK",
    department: "CC-HR-501 (People & Culture)",
    role: "Member",
    status: "Active",
    twoFactor: "Enforced",
    lastLogin: "Oct 25, 2026",
    joinedAt: "2026-10-23",
  },
  {
    id: "USR-1011",
    pernr: "802111",
    name: "Rohan Kapoor",
    email: "rohan@designhub.demo",
    organization: "DesignHub",
    companyCode: "5000 - DESIGN US",
    department: "CC-DES-102 (Creative Design)",
    role: "Member",
    status: "Active",
    twoFactor: "Pending",
    lastLogin: "Today, 07:50 AM",
    joinedAt: "2026-10-24",
  },
  {
    id: "USR-1012",
    pernr: "802112",
    name: "Sana Sheikh",
    email: "sana@nextgen.demo",
    organization: "NextGen Solutions",
    companyCode: "6000 - NEXTGEN IN",
    department: "CC-AUD-901 (Compliance Audit)",
    role: "Manager",
    status: "Active",
    twoFactor: "Enforced",
    lastLogin: "Today, 11:45 AM",
    joinedAt: "2026-10-25",
  },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  organization: "",
  department: "CC-ENG-402 (Engineering)",
  role: "Member",
  status: "Active",
};

export default function Users() {
  const [users, setUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_USERS;
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [organizationFilter, setOrganizationFilter] = useState("All");
  const [mfaFilter, setMfaFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [density, setDensity] = useState("standard"); // "standard" | "compact"
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [modal, setModal] = useState(null); // "add" | "edit" | "details"
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const notify = (msg) => setToast(msg);

  const organizations = useMemo(() => {
    return Array.from(new Set(users.map((u) => u.organization).filter(Boolean)));
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchSearch =
        !q ||
        [u.name, u.email, u.id, u.pernr, u.organization, u.department, u.role].some((f) =>
          String(f || "").toLowerCase().includes(q)
        );
      const matchRole = roleFilter === "All" || u.role === roleFilter;
      const matchStatus = statusFilter === "All" || u.status === statusFilter;
      const matchOrg = organizationFilter === "All" || u.organization === organizationFilter;
      const matchMfa = mfaFilter === "All" || u.twoFactor === mfaFilter;

      return matchSearch && matchRole && matchStatus && matchOrg && matchMfa;
    });
  }, [users, search, roleFilter, statusFilter, organizationFilter, mfaFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const activeCount = users.filter((u) => u.status === "Active").length;
  const suspendedCount = users.filter((u) => u.status === "Suspended").length;
  const mfaEnforcedCount = users.filter((u) => u.twoFactor === "Enforced").length;

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredUsers.map((u) => u.id)));
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

  // Batch actions
  const handleBatchSuspend = () => {
    if (selectedIds.size === 0) return;
    setUsers((prev) =>
      prev.map((u) => (selectedIds.has(u.id) ? { ...u, status: "Suspended" } : u))
    );
    notify(`Batch lock: ${selectedIds.size} user accounts locked.`);
    setSelectedIds(new Set());
  };

  const handleBatchActivate = () => {
    if (selectedIds.size === 0) return;
    setUsers((prev) =>
      prev.map((u) => (selectedIds.has(u.id) ? { ...u, status: "Active" } : u))
    );
    notify(`Batch unlock: ${selectedIds.size} user accounts activated.`);
    setSelectedIds(new Set());
  };

  // Export to CSV
  const handleExportCSV = () => {
    const targetUsers = selectedIds.size > 0
      ? filteredUsers.filter((u) => selectedIds.has(u.id))
      : filteredUsers;

    const headers = [
      "User ID",
      "Personnel No",
      "Full Name",
      "Email Address",
      "Organization",
      "Company Code",
      "Department",
      "Role",
      "Status",
      "2FA Security",
      "Last Logon",
      "Joined Date",
    ];

    const rows = targetUsers.map((u) => [
      u.id,
      u.pernr || "",
      u.name,
      u.email,
      u.organization,
      u.companyCode || "",
      u.department || "",
      u.role,
      u.status,
      u.twoFactor || "Enforced",
      u.lastLogin || "",
      u.joinedAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.map((x) => `"${x}"`).join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `SAP_USER_MASTER_EXPORT_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    notify(`Exported ${targetUsers.length} user records to CSV.`);
  };

  // Single user operations
  const toggleUserStatus = (user) => {
    const nextStatus = user.status === "Active" ? "Suspended" : "Active";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    notify(`${user.name} account status updated to ${nextStatus}.`);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    notify(`Master user record ${deleteTarget.id} deleted.`);
    setDeleteTarget(null);
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setForm({
      ...EMPTY_FORM,
      organization: organizations[0] || "Acme Technologies",
    });
    setErrors({});
    setModal("add");
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      organization: user.organization || "",
      department: user.department || "CC-ENG-402 (Engineering)",
      role: user.role || "Member",
      status: user.status || "Active",
    });
    setErrors({});
    setModal("edit");
  };

  const saveUserForm = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setErrors({ name: !form.name.trim() ? "Name required" : "", email: !form.email.trim() ? "Email required" : "" });
      return;
    }

    if (modal === "add") {
      const nextId = `USR-${Date.now().toString().slice(-4)}`;
      const nextPernr = `80${Math.floor(1000 + Math.random() * 9000)}`;
      const newUser = {
        id: nextId,
        pernr: nextPernr,
        name: form.name.trim(),
        email: form.email.trim(),
        organization: form.organization,
        companyCode: `${Math.floor(1000 + Math.random() * 4000)} - ${form.organization.slice(0, 4).toUpperCase()} GLOBAL`,
        department: form.department,
        role: form.role,
        status: form.status,
        twoFactor: "Enforced",
        lastLogin: "Never logged in",
        joinedAt: new Date().toISOString().slice(0, 10),
      };
      setUsers([newUser, ...users]);
      notify(`User ${newUser.name} created [${newUser.id}].`);
    } else if (modal === "edit" && selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                name: form.name.trim(),
                email: form.email.trim(),
                organization: form.organization,
                department: form.department,
                role: form.role,
                status: form.status,
              }
            : u
        )
      );
      notify(`User ${selectedUser.id} updated.`);
    }

    setModal(null);
  };

  return (
    <div className="users-page">
      {/* 1. SAP Master Header Bar */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>
            User Master Data Directory
            <span className="sap-system-badge">SAP-USR · CLIENT 100</span>
          </h1>
          <p className="sap-header-subtitle">
            Enterprise identity directory, SAP authorization roles, cost centers, and 2FA access control.
          </p>
        </div>

        <div className="sap-header-actions">
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
            onClick={openAddModal}
          >
            <Plus size={16} /> New User Master Record
          </button>
        </div>
      </section>

      {/* 2. Top 4 SAP Telemetry Cards */}
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <UsersIcon size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Total Master Accounts</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{users.length}</span>
              <span className="sa-kpi-trend positive">100% Bound</span>
            </div>
            <span className="sa-kpi-subtitle">Personnel master records</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <UserCheck size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">00-Valid (Active)</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{activeCount}</span>
              <span className="sa-kpi-trend positive">Operational</span>
            </div>
            <span className="sa-kpi-subtitle">Unrestricted login access</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box red">
            <UserX size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">02-Locked (Suspended)</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{suspendedCount}</span>
              <span className="sa-kpi-trend negative">Locked</span>
            </div>
            <span className="sa-kpi-subtitle">Login sessions blocked</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box sky">
            <ShieldCheck size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">2FA Enforced</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{mfaEnforcedCount}</span>
              <span className="sa-kpi-trend positive">Compliant</span>
            </div>
            <span className="sa-kpi-subtitle">Hardware & OTP enforced</span>
          </div>
        </article>
      </section>

      {toast && (
        <div className="sa-toast-banner">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* 3. The SAP Master Data Table Card */}
      <section className="sap-table-card">
        {/* Multi-Selection Batch Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="sap-batch-banner">
            <span>
              <strong>{selectedIds.size}</strong> user records selected
            </span>
            <div className="sap-batch-actions">
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={handleBatchActivate}
              >
                <Unlock size={13} /> Unlock Accounts
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={handleBatchSuspend}
              >
                <Lock size={13} /> Lock Accounts
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
                placeholder="Search Personnel No, User ID, Name, Cost Center..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <select
              className="sap-filter-select"
              value={organizationFilter}
              onChange={(e) => {
                setOrganizationFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Company Code: All Organizations</option>
              {organizations.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>

            <select
              className="sap-filter-select"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Auth Role: All Roles</option>
              <option value="Admin">Admin (SAP_ALL / Tenant Admin)</option>
              <option value="Manager">Manager (Z_TEAM_LEAD)</option>
              <option value="Member">Member (Z_EMPLOYEE)</option>
            </select>

            <select
              className="sap-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Status: All Statuses</option>
              <option value="Active">00 - Valid (Active)</option>
              <option value="Suspended">02 - Locked (Suspended)</option>
            </select>

            <select
              className="sap-filter-select"
              value={mfaFilter}
              onChange={(e) => {
                setMfaFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">2FA: All</option>
              <option value="Enforced">Enforced</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="sap-toolbar-right">
            {/* Table Density Switcher */}
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
                setOrganizationFilter("All");
                setRoleFilter("All");
                setStatusFilter("All");
                setMfaFilter("All");
                setPage(1);
              }}
              title="Reset all filters"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* 4. The SAP Table Data Grid */}
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
                <th>Personnel / User ID</th>
                <th>Employee & Account</th>
                <th>Company Code & Org</th>
                <th>Cost Center / Dept</th>
                <th>Authorization Role</th>
                <th>2FA Security</th>
                <th>Account Status</th>
                <th>Valid From</th>
                <th>Last Logon</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => {
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

                    {/* Personnel No & User ID */}
                    <td>
                      <div className="sap-id-cell">{u.id}</div>
                      <div className="sap-pernr-text">PERNR: {u.pernr || "802100"}</div>
                    </td>

                    {/* User & Identity */}
                    <td>
                      <div className="sap-user-badge">
                        <div className="sap-avatar-circle">
                          {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="sap-user-info">
                          <strong>{u.name}</strong>
                          <span>{u.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Company Code & Organization */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Building2 size={14} style={{ color: "var(--sa-primary)" }} />
                        <div>
                          <strong>{u.organization}</strong>
                          <div style={{ fontSize: 10.5, color: "var(--sa-text-muted)" }}>
                            {u.companyCode || "1000 - GLOBAL"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cost Center / Department */}
                    <td>
                      <span style={{ fontSize: 11.5, color: "var(--sa-text-secondary)" }}>
                        {u.department || "CC-ENG-402 (Engineering)"}
                      </span>
                    </td>

                    {/* Role Badge */}
                    <td>
                      <span
                        className={`sap-role-badge ${
                          u.role === "Admin"
                            ? "admin"
                            : u.role === "Manager"
                            ? "lead"
                            : "member"
                        }`}
                      >
                        {u.role === "Admin" ? "Z_TENANT_ADMIN" : u.role === "Manager" ? "Z_TEAM_LEAD" : "Z_MEMBER"}
                      </span>
                    </td>

                    {/* 2FA Security Status */}
                    <td>
                      <span className={`sap-mfa-badge ${u.twoFactor === "Enforced" ? "enforced" : ""}`}>
                        <ShieldCheck size={13} /> {u.twoFactor || "Enforced"}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td>
                      <span
                        className={`sap-status-pill ${
                          u.status === "Active" ? "valid" : "locked"
                        }`}
                      >
                        <span className="sap-status-dot" />
                        {u.status === "Active" ? "00 - Valid" : "02 - Locked"}
                      </span>
                    </td>

                    {/* Valid From Date */}
                    <td style={{ color: "var(--sa-text-muted)", fontSize: 11.5 }}>
                      {u.joinedAt}
                    </td>

                    {/* Last Logon */}
                    <td style={{ color: "var(--sa-text-muted)", fontSize: 11.5 }}>
                      {u.lastLogin || "Today, 10:45 AM"}
                    </td>

                    {/* Quick Row Actions */}
                    <td>
                      <div className="sap-action-group" style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="sap-table-btn"
                          title="View Master Record"
                          onClick={() => {
                            setSelectedUser(u);
                            setModal("details");
                          }}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          className="sap-table-btn"
                          title="Edit Permissions & Attributes"
                          onClick={() => openEditModal(u)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className="sap-table-btn"
                          title={u.status === "Active" ? "Lock Account" : "Unlock Account"}
                          onClick={() => toggleUserStatus(u)}
                        >
                          {u.status === "Active" ? <Lock size={14} /> : <Unlock size={14} />}
                        </button>
                        <button
                          type="button"
                          className="sap-table-btn danger"
                          title="Delete Master User"
                          onClick={() => setDeleteTarget(u)}
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
                  <td colSpan={11} style={{ textAlign: "center", padding: "36px", color: "var(--sa-text-muted)" }}>
                    No SAP master user records found matching the specified search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 5. SAP Master Footer & Pagination */}
        <div className="sap-footer-bar">
          <div className="sap-footer-counts">
            <span>
              Displaying <strong>{paginatedUsers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> -{" "}
              <strong>{Math.min(currentPage * pageSize, filteredUsers.length)}</strong> of{" "}
              <strong>{filteredUsers.length}</strong> master records
              {filteredUsers.length !== users.length && ` (filtered from ${users.length} total)`}
            </span>

            <span style={{ margin: "0 6px", color: "var(--sa-border)" }}>|</span>

            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              style={{
                background: "transparent",
                border: "1px solid var(--sa-border)",
                borderRadius: 4,
                padding: "2px 6px",
                fontSize: 11.5,
                color: "inherit",
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="sap-pagination">
            <button
              type="button"
              className="sap-page-btn"
              disabled={currentPage <= 1}
              onClick={() => setPage(1)}
              title="First Page"
            >
              <ChevronsLeft size={14} />
            </button>
            <button
              type="button"
              className="sap-page-btn"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              title="Previous Page"
            >
              <ChevronLeft size={14} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
              <button
                key={pNum}
                type="button"
                className={`sap-page-btn ${pNum === currentPage ? "is-active" : ""}`}
                onClick={() => setPage(pNum)}
              >
                {pNum}
              </button>
            ))}

            <button
              type="button"
              className="sap-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              title="Next Page"
            >
              <ChevronRight size={14} />
            </button>
            <button
              type="button"
              className="sap-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(totalPages)}
              title="Last Page"
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 6. View Details Modal */}
      {modal === "details" && selectedUser && (
        <div className="sa-modal-backdrop">
          <div className="sa-modal-content" style={{ maxWidth: 540 }}>
            <div className="sa-modal-header">
              <div>
                <h3 style={{ margin: 0 }}>SAP Master Record: {selectedUser.name}</h3>
                <span style={{ fontSize: 11.5, color: "var(--sa-text-muted)" }}>
                  Personnel No: {selectedUser.pernr || "802100"} · {selectedUser.id}
                </span>
              </div>
              <button type="button" className="sa-modal-close" onClick={() => setModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: "var(--sa-text-muted)", display: "block" }}>Company Code</label>
                  <strong>{selectedUser.companyCode || "1000 - ACME IN"}</strong>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "var(--sa-text-muted)", display: "block" }}>Organization</label>
                  <strong>{selectedUser.organization}</strong>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "var(--sa-text-muted)", display: "block" }}>Department / Cost Center</label>
                  <strong>{selectedUser.department || "CC-ENG-402 (Engineering)"}</strong>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "var(--sa-text-muted)", display: "block" }}>Authorization Role</label>
                  <strong>{selectedUser.role}</strong>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "var(--sa-text-muted)", display: "block" }}>Email Address</label>
                  <span>{selectedUser.email}</span>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "var(--sa-text-muted)", display: "block" }}>2FA Status</label>
                  <span className="sap-mfa-badge enforced"><ShieldCheck size={13} /> {selectedUser.twoFactor || "Enforced"}</span>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "var(--sa-text-muted)", display: "block" }}>Account Status</label>
                  <span className={`sap-status-pill ${selectedUser.status === "Active" ? "valid" : "locked"}`}>
                    <span className="sap-status-dot" /> {selectedUser.status === "Active" ? "00 - Valid" : "02 - Locked"}
                  </span>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "var(--sa-text-muted)", display: "block" }}>Last Logon</label>
                  <span>{selectedUser.lastLogin || "Today, 10:45 AM"}</span>
                </div>
              </div>
            </div>

            <div className="sa-modal-footer">
              <button type="button" className="sa-btn sa-btn-secondary" onClick={() => setModal(null)}>
                Close
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-primary"
                onClick={() => {
                  setModal(null);
                  openEditModal(selectedUser);
                }}
              >
                Edit Master Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Create / Edit User Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="sa-modal-backdrop">
          <div className="sa-modal-content" style={{ maxWidth: 520 }}>
            <div className="sa-modal-header">
              <h3>{modal === "add" ? "Create SAP Master User Record" : "Edit Master Record"}</h3>
              <button type="button" className="sa-modal-close" onClick={() => setModal(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveUserForm}>
              <div className="sa-modal-body">
                <div className="sa-form-group">
                  <label>Full Employee Name</label>
                  <input
                    type="text"
                    className="sa-form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    required
                  />
                  {errors.name && <span style={{ color: "#ef4444", fontSize: 11 }}>{errors.name}</span>}
                </div>

                <div className="sa-form-group">
                  <label>Enterprise Email Address</label>
                  <input
                    type="email"
                    className="sa-form-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. rahul@company.com"
                    required
                  />
                  {errors.email && <span style={{ color: "#ef4444", fontSize: 11 }}>{errors.email}</span>}
                </div>

                <div className="sa-form-group">
                  <label>Tenant Organization</label>
                  <input
                    type="text"
                    className="sa-form-input"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    placeholder="e.g. Acme Technologies"
                    required
                  />
                </div>

                <div className="sa-form-group">
                  <label>Cost Center & Department</label>
                  <select
                    className="sa-form-select"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                  >
                    <option value="CC-ENG-402 (Engineering)">CC-ENG-402 (Engineering)</option>
                    <option value="CC-PROD-305 (Product)">CC-PROD-305 (Product)</option>
                    <option value="CC-OPS-201 (Operations)">CC-OPS-201 (Operations)</option>
                    <option value="CC-FIN-104 (Finance)">CC-FIN-104 (Finance)</option>
                    <option value="CC-MKT-301 (Marketing)">CC-MKT-301 (Marketing)</option>
                    <option value="CC-HR-501 (People & Culture)">CC-HR-501 (People & Culture)</option>
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="sa-form-group">
                    <label>Authorization Role</label>
                    <select
                      className="sa-form-select"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="Admin">Admin (Tenant Admin)</option>
                      <option value="Manager">Manager (Team Lead)</option>
                      <option value="Member">Member (Employee)</option>
                    </select>
                  </div>

                  <div className="sa-form-group">
                    <label>Account Status</label>
                    <select
                      className="sa-form-select"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="Active">00 - Valid (Active)</option>
                      <option value="Suspended">02 - Locked (Suspended)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="sa-modal-footer">
                <button type="button" className="sa-btn sa-btn-secondary" onClick={() => setModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="sa-btn sa-btn-primary">
                  {modal === "add" ? "Save Master Record" : "Update Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="sa-modal-backdrop">
          <div className="sa-modal-content" style={{ maxWidth: 440 }}>
            <div className="sa-modal-header">
              <h3 style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldAlert size={18} /> Confirm Master Record Deletion
              </h3>
              <button type="button" className="sa-modal-close" onClick={() => setDeleteTarget(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body">
              <p style={{ margin: 0 }}>
                Are you sure you want to permanently delete master record for{" "}
                <strong>{deleteTarget.name}</strong> ({deleteTarget.id})? All authorization tokens and company cost center bindings will be purged.
              </p>
            </div>

            <div className="sa-modal-footer">
              <button type="button" className="sa-btn sa-btn-secondary" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button type="button" className="sa-btn sa-btn-danger" onClick={handleDelete}>
                Delete Master Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
