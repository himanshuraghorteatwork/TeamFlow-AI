import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Users.css";
import orgAvatarImg from "../../../assets/images/organization-avatar.png";

const STORAGE_KEY = "teamflow_superadmin_users";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

const AVATAR_COLORS = ["blue", "purple", "emerald", "amber", "indigo", "pink"];

const REGISTERED_ORGANIZATIONS = [
  { name: "Acme Technologies", defaultCompanyCode: "1000 - ACME IN" },
  { name: "Bright Solutions", defaultCompanyCode: "2000 - BRIGHT UK" },
  { name: "CloudNine Labs", defaultCompanyCode: "3000 - CLOUD SG" },
  { name: "Nova Digital", defaultCompanyCode: "4000 - NOVA US" },
  { name: "DesignHub", defaultCompanyCode: "5000 - DESIGN US" },
  { name: "NextGen Solutions", defaultCompanyCode: "6000 - NEXTGEN IN" },
  { name: "PixelCraft Studio", defaultCompanyCode: "7000 - PIXEL US" },
  { name: "Vertex Digital", defaultCompanyCode: "8000 - VERTEX EU" },
  { name: "BluePeak Systems", defaultCompanyCode: "9000 - BLUEPEAK US" },
  { name: "OmniCore Retail", defaultCompanyCode: "9500 - OMNI US" },
];

const ALL_COMPANY_CODES = [
  "1000 - ACME IN",
  "1100 - ACME US",
  "2000 - BRIGHT UK",
  "2100 - BRIGHT EU",
  "3000 - CLOUD SG",
  "3100 - CLOUD US",
  "4000 - NOVA US",
  "4100 - NOVA UK",
  "5000 - DESIGN US",
  "6000 - NEXTGEN IN",
  "7000 - PIXEL US",
  "8000 - VERTEX EU",
  "9000 - BLUEPEAK US",
  "9500 - OMNI US",
];

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
    color: "blue",
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
    color: "purple",
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
    color: "emerald",
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
    color: "amber",
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
    color: "indigo",
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
    color: "pink",
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
    color: "amber",
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
    color: "purple",
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
    color: "blue",
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
    color: "emerald",
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
    color: "pink",
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
    color: "indigo",
  },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  organization: "",
  companyCode: "",
  department: "CC-ENG-402 (Engineering)",
  role: "Member",
  status: "Active",
  twoFactor: "Enforced",
};

export default function Users() {
  const [searchParams, setSearchParams] = useSearchParams();

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

  const [search, setSearch] = useState(() => searchParams.get("search") || "");
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
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Sorting State
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

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

  // Synchronize URL query parameter with search
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearch((current) => (current === urlSearch ? current : urlSearch));
    setPage(1);
  }, [searchParams]);

  // Close modals on Escape key press
  useEffect(() => {
    if (!modal && !deleteTarget && !resetConfirmOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setModal(null);
        setDeleteTarget(null);
        setResetConfirmOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal, deleteTarget, resetConfirmOpen]);

  const notify = (msg) => setToast(msg);

  const updateSearch = (value) => {
    setSearch(value);
    setPage(1);

    const next = new URLSearchParams(searchParams);
    if (value.trim()) {
      next.set("search", value);
    } else {
      next.delete("search");
    }
    setSearchParams(next, { replace: true });
  };

  const clearAllFilters = () => {
    setSearch("");
    setOrganizationFilter("All");
    setRoleFilter("All");
    setStatusFilter("All");
    setMfaFilter("All");
    setPage(1);
    setSearchParams({}, { replace: true });
  };

  const organizations = useMemo(() => {
    const set = new Set(REGISTERED_ORGANIZATIONS.map((o) => o.name));
    users.forEach((u) => {
      if (u.organization) set.add(u.organization);
    });
    return Array.from(set);
  }, [users]);

  const availableOrganizations = useMemo(() => {
    const set = new Set(REGISTERED_ORGANIZATIONS.map((o) => o.name));
    users.forEach((u) => {
      if (u.organization) set.add(u.organization);
    });
    return Array.from(set);
  }, [users]);

  const availableCompanyCodes = useMemo(() => {
    const codes = new Set(ALL_COMPANY_CODES);
    if (form.companyCode) codes.add(form.companyCode);
    const matched = REGISTERED_ORGANIZATIONS.find((o) => o.name === form.organization);
    if (matched && matched.defaultCompanyCode) codes.add(matched.defaultCompanyCode);
    return Array.from(codes);
  }, [form.organization, form.companyCode]);

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

  const sortedUsers = useMemo(() => {
    let list = [...filteredUsers];
    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
      valA = String(valA || "").toLowerCase();
      valB = String(valB || "").toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredUsers, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const activeCount = users.filter((u) => u.status === "Active").length;
  const suspendedCount = users.filter((u) => u.status === "Suspended").length;
  const mfaEnforcedCount = users.filter((u) => u.twoFactor === "Enforced").length;

  // Selection handlers
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

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    setUsers((prev) => prev.filter((u) => !selectedIds.has(u.id)));
    notify(`Deleted ${count} user master records.`);
    setSelectedIds(new Set());
  };

  // Export to CSV
  const handleExportCSV = () => {
    const targetUsers = selectedIds.size > 0
      ? sortedUsers.filter((u) => selectedIds.has(u.id))
      : sortedUsers;

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

    const csvContent = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((row) =>
        row.map((val) => `"${String(val || "").replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SAP_USER_MASTER_EXPORT_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
      organization: "Acme Technologies",
      companyCode: "1000 - ACME IN",
    });
    setErrors({});
    setModal("add");
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    const userOrg = user.organization || "Acme Technologies";
    const matched = REGISTERED_ORGANIZATIONS.find((o) => o.name === userOrg);
    setForm({
      name: user.name || "",
      email: user.email || "",
      organization: userOrg,
      companyCode: user.companyCode || (matched ? matched.defaultCompanyCode : "1000 - ACME IN"),
      department: user.department || "CC-ENG-402 (Engineering)",
      role: user.role || "Member",
      status: user.status || "Active",
      twoFactor: user.twoFactor || "Enforced",
    });
    setErrors({});
    setModal("edit");
  };

  const saveUserForm = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full employee name is required.";
    if (!form.email.trim()) newErrors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      newErrors.email = "Please enter a valid email address.";
    if (!form.organization.trim()) newErrors.organization = "Organization is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (modal === "add") {
      const nextId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
      const nextPernr = `80${Math.floor(1000 + Math.random() * 9000)}`;
      const newUser = {
        id: nextId,
        pernr: nextPernr,
        name: form.name.trim(),
        email: form.email.trim(),
        organization: form.organization.trim(),
        companyCode:
          form.companyCode.trim() ||
          `${Math.floor(1000 + Math.random() * 4000)} - ${form.organization.slice(0, 4).toUpperCase()} GLOBAL`,
        department: form.department,
        role: form.role,
        status: form.status,
        twoFactor: form.twoFactor || "Enforced",
        lastLogin: "Never logged in",
        joinedAt: new Date().toISOString().slice(0, 10),
        color: AVATAR_COLORS[users.length % AVATAR_COLORS.length],
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
                organization: form.organization.trim(),
                companyCode: form.companyCode.trim() || u.companyCode,
                department: form.department,
                role: form.role,
                status: form.status,
                twoFactor: form.twoFactor || u.twoFactor || "Enforced",
              }
            : u
        )
      );
      notify(`User master record ${selectedUser.id} updated.`);
    }

    setModal(null);
  };

  return (
    <div className="users-page">
      {/* 1. SAP Master Header Bar */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>User Master Data Directory</h1>
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
                className="sa-btn sa-btn-danger sa-btn-sm"
                onClick={handleBatchDelete}
              >
                <Trash2 size={13} /> Delete Selected
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
                onChange={(e) => updateSearch(e.target.value)}
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
              onClick={clearAllFilters}
              title="Reset all filters"
            >
              <RefreshCw size={15} />
            </button>

            {/* Reset Demo Data Button */}
            <button
              type="button"
              className="sa-btn sa-btn-secondary sa-btn-sm"
              onClick={() => setResetConfirmOpen(true)}
              title="Reset demo user records"
            >
              <RotateCcw size={13} /> Reset Demo Data
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
                <th className="sap-sortable-th" onClick={() => handleSort("id")}>
                  <span className="sap-th-content">Personnel ID {renderSortIcon("id")}</span>
                </th>
                <th className="sap-sortable-th" onClick={() => handleSort("name")}>
                  <span className="sap-th-content">Employee &amp; Account {renderSortIcon("name")}</span>
                </th>
                <th className="sap-sortable-th" onClick={() => handleSort("organization")}>
                  <span className="sap-th-content">Organization &amp; Code {renderSortIcon("organization")}</span>
                </th>
                <th className="sap-sortable-th" onClick={() => handleSort("department")}>
                  <span className="sap-th-content">Cost Center / Dept {renderSortIcon("department")}</span>
                </th>
                <th className="sap-sortable-th" onClick={() => handleSort("role")}>
                  <span className="sap-th-content">Role {renderSortIcon("role")}</span>
                </th>
                <th className="sap-sortable-th" onClick={() => handleSort("status")}>
                  <span className="sap-th-content">Status &amp; 2FA {renderSortIcon("status")}</span>
                </th>
                <th className="sap-sortable-th" onClick={() => handleSort("lastLogin")}>
                  <span className="sap-th-content">Last Logon {renderSortIcon("lastLogin")}</span>
                </th>
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
                      <div
                        className="sap-user-badge"
                        style={{ cursor: "pointer" }}
                        title="Click to view user master details"
                        onClick={() => {
                          setSelectedUser(u);
                          setModal("details");
                        }}
                      >
                        <div className={`sap-avatar-circle ${u.color || "blue"}`}>
                          {getInitials(u.name)}
                        </div>
                        <div className="sap-user-info">
                          <strong>{u.name}</strong>
                          <span>{u.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Company Code & Organization */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="usr-org-avatar-wrap" title={u.organization}>
                          <img
                            src={orgAvatarImg}
                            alt={u.organization}
                            className="usr-org-avatar-img"
                            loading="lazy"
                          />
                        </div>
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

                    {/* Status Pill & 2FA */}
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start" }}>
                        <span
                          className={`sap-status-pill ${
                            u.status === "Active" ? "valid" : "locked"
                          }`}
                        >
                          <span className="sap-status-dot" />
                          {u.status === "Active" ? "00 - Valid" : "02 - Locked"}
                        </span>
                        <span className={`sap-mfa-badge ${u.twoFactor === "Enforced" ? "enforced" : ""}`} style={{ fontSize: 10.5 }}>
                          <ShieldCheck size={11} /> {u.twoFactor || "Enforced"}
                        </span>
                      </div>
                    </td>

                    {/* Last Logon */}
                    <td style={{ color: "var(--sa-text-muted)", fontSize: 11.5 }}>
                      {u.lastLogin || "Today, 10:45 AM"}
                    </td>

                    {/* Quick Row Actions */}
                    <td style={{ textAlign: "right" }}>
                      <div className="usr-action-group" style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="usr-action-btn btn-view"
                          title="View Master Record"
                          onClick={() => {
                            setSelectedUser(u);
                            setModal("details");
                          }}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          className="usr-action-btn btn-edit"
                          title="Edit Permissions & Attributes"
                          onClick={() => openEditModal(u)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className={`usr-action-btn btn-toggle ${u.status === "Active" ? "is-lock" : "is-unlock"}`}
                          title={u.status === "Active" ? "Lock Account" : "Unlock Account"}
                          onClick={() => toggleUserStatus(u)}
                        >
                          {u.status === "Active" ? <Lock size={14} /> : <Unlock size={14} />}
                        </button>
                        <button
                          type="button"
                          className="usr-action-btn btn-delete"
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
                  <td colSpan={9} style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{ color: "var(--sa-text-muted)", fontSize: 13 }}>
                      <strong>No SAP master user records found matching your search.</strong>
                      <p style={{ margin: "6px 0 12px", fontSize: 12 }}>
                        Try clearing or adjusting your active filter options.
                      </p>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={clearAllFilters}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 5. SAP Master Footer & Pagination */}
        <div className="sap-footer-bar">
          <div className="sap-footer-counts" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span>
              Displaying <strong>{paginatedUsers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong>–
              <strong>{Math.min(currentPage * pageSize, sortedUsers.length)}</strong> of{" "}
              <strong>{sortedUsers.length}</strong> master records
              {sortedUsers.length !== users.length && ` (filtered from ${users.length} total)`}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
              <span>Rows per page:</span>
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

            <span style={{ padding: "0 8px", fontWeight: 650 }}>
              Page {currentPage} of {totalPages}
            </span>

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

      {/* 6. View Details Modal (Portaled) */}
      {modal === "details" && selectedUser && typeof document !== "undefined" && createPortal(
        <div
          className="sa-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <div className="sa-modal-content user-details-modal" style={{ maxWidth: 580 }}>
            <div className="sa-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="sap-modal-title-icon">
                  <UsersIcon size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>User Master Record</h3>
                  <span style={{ fontSize: 12, color: "var(--sa-text-muted)" }}>
                    Personnel No: {selectedUser.pernr || "802100"} · ID: {selectedUser.id}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setModal(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body">
              {/* User Hero Banner */}
              <div className="user-details-hero">
                <div className={`sap-avatar-circle large ${selectedUser.color || "blue"}`}>
                  {getInitials(selectedUser.name)}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{selectedUser.name}</h4>
                  <div style={{ fontSize: 12, color: "var(--sa-text-muted)", marginTop: 2 }}>
                    {selectedUser.email}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    <span className={`sap-role-badge ${selectedUser.role === "Admin" ? "admin" : selectedUser.role === "Manager" ? "lead" : "member"}`}>
                      {selectedUser.role}
                    </span>
                    <span className={`sap-status-pill ${selectedUser.status === "Active" ? "valid" : "locked"}`}>
                      <span className="sap-status-dot" /> {selectedUser.status === "Active" ? "00 - Valid" : "02 - Locked"}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Details Grid */}
              <div className="user-details-grid">
                <div className="user-detail-card">
                  <small>Company Code</small>
                  <p>{selectedUser.companyCode || "1000 - ACME IN"}</p>
                </div>
                <div className="user-detail-card">
                  <small>Organization</small>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <div className="usr-org-avatar-wrap" style={{ width: 26, height: 26, minWidth: 26, padding: 2 }}>
                      <img src={orgAvatarImg} alt={selectedUser.organization} className="usr-org-avatar-img" />
                    </div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{selectedUser.organization}</p>
                  </div>
                </div>
                <div className="user-detail-card">
                  <small>Cost Center &amp; Dept</small>
                  <p>{selectedUser.department || "CC-ENG-402 (Engineering)"}</p>
                </div>
                <div className="user-detail-card">
                  <small>2FA Security</small>
                  <p style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <ShieldCheck size={14} style={{ color: selectedUser.twoFactor === "Enforced" ? "#10b981" : "#f59e0b" }} />
                    {selectedUser.twoFactor || "Enforced"}
                  </p>
                </div>
                <div className="user-detail-card">
                  <small>Valid From</small>
                  <p>{selectedUser.joinedAt}</p>
                </div>
                <div className="user-detail-card">
                  <small>Last Logon Session</small>
                  <p>{selectedUser.lastLogin || "Today, 10:45 AM"}</p>
                </div>
              </div>
            </div>

            <div className="sa-modal-footer">
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={() => {
                  toggleUserStatus(selectedUser);
                  setSelectedUser((prev) => ({
                    ...prev,
                    status: prev.status === "Active" ? "Suspended" : "Active",
                  }));
                }}
              >
                {selectedUser.status === "Active" ? <Lock size={13} /> : <Unlock size={13} />}
                {selectedUser.status === "Active" ? "Lock Account" : "Unlock Account"}
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={() => setModal(null)}
              >
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
                <Pencil size={13} /> Edit Master Data
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 7. Create / Edit User Modal (Portaled) */}
      {(modal === "add" || modal === "edit") && typeof document !== "undefined" && createPortal(
        <div
          className="sa-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <div className="sa-modal-content user-form-modal" style={{ maxWidth: 540 }}>
            <div className="sa-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="sap-modal-title-icon">
                  {modal === "add" ? <UserPlus size={22} /> : <Pencil size={22} />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                    {modal === "add" ? "Create SAP Master User Record" : "Edit Master User Record"}
                  </h3>
                  <span style={{ fontSize: 12, color: "var(--sa-text-muted)" }}>
                    {modal === "add"
                      ? "Enter employee master attributes, company code, and cost center."
                      : `Updating attributes for ${selectedUser?.id}`}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setModal(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveUserForm}>
              <div className="sa-modal-body">
                <div className="sa-form-group">
                  <label>Full Employee Name *</label>
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
                  <label>Enterprise Email Address *</label>
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

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="sa-form-group">
                    <label>Tenant Organization *</label>
                    <select
                      className="sa-form-select"
                      value={form.organization}
                      onChange={(e) => {
                        const newOrg = e.target.value;
                        const matched = REGISTERED_ORGANIZATIONS.find((o) => o.name === newOrg);
                        setForm((prev) => ({
                          ...prev,
                          organization: newOrg,
                          companyCode: matched ? matched.defaultCompanyCode : prev.companyCode,
                        }));
                      }}
                      required
                    >
                      {availableOrganizations.map((orgName) => (
                        <option key={orgName} value={orgName}>
                          {orgName}
                        </option>
                      ))}
                    </select>
                    {errors.organization && (
                      <span style={{ color: "#ef4444", fontSize: 11 }}>{errors.organization}</span>
                    )}
                  </div>

                  <div className="sa-form-group">
                    <label>Company Code *</label>
                    <select
                      className="sa-form-select"
                      value={form.companyCode}
                      onChange={(e) => setForm((prev) => ({ ...prev, companyCode: e.target.value }))}
                      required
                    >
                      {availableCompanyCodes.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sa-form-group">
                  <label>Cost Center &amp; Department</label>
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
                    <option value="CC-AUD-901 (Compliance Audit)">CC-AUD-901 (Compliance Audit)</option>
                    <option value="CC-DES-102 (Creative Design)">CC-DES-102 (Creative Design)</option>
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

                <div className="sa-form-group">
                  <label>Two-Factor Authentication (2FA)</label>
                  <select
                    className="sa-form-select"
                    value={form.twoFactor || "Enforced"}
                    onChange={(e) => setForm({ ...form, twoFactor: e.target.value })}
                  >
                    <option value="Enforced">Enforced (Hardware Key / Authenticator)</option>
                    <option value="Pending">Pending (User Setup Required)</option>
                  </select>
                </div>
              </div>

              <div className="sa-modal-footer">
                <button type="button" className="sa-btn sa-btn-secondary" onClick={() => setModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="sa-btn sa-btn-primary">
                  {modal === "add" ? "Create Master Record" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 8. Delete Confirmation Modal (Portaled) */}
      {deleteTarget && typeof document !== "undefined" && createPortal(
        <div
          className="sa-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDeleteTarget(null);
          }}
        >
          <div className="sa-modal-content" style={{ maxWidth: 440 }}>
            <div className="sa-modal-header">
              <h3 style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                <ShieldAlert size={20} /> Confirm Master Record Deletion
              </h3>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setDeleteTarget(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body">
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
                Are you sure you want to permanently delete master record for{" "}
                <strong>{deleteTarget.name}</strong> ({deleteTarget.id})? All authorization tokens,
                personnel number ({deleteTarget.pernr || "802100"}), and cost center bindings will be purged.
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
        </div>,
        document.body
      )}

      {/* 9. Reset Demo Data Confirmation Modal (Portaled) */}
      {resetConfirmOpen && typeof document !== "undefined" && createPortal(
        <div
          className="sa-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setResetConfirmOpen(false);
          }}
        >
          <div className="sa-modal-content" style={{ maxWidth: 420, textAlign: "center", padding: "24px" }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "var(--sa-primary-light, #eff3fe)",
                color: "var(--sa-primary, #3b66ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <RotateCcw size={24} />
            </div>

            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700 }}>Reset Demo Users?</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--sa-text-muted)", lineHeight: 1.5 }}>
              This restores the original 12 enterprise user master records and discards any demo users created in this browser session.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
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
                  setSearch("");
                  setRoleFilter("All");
                  setStatusFilter("All");
                  setOrganizationFilter("All");
                  setMfaFilter("All");
                  setPage(1);
                  setSearchParams({}, { replace: true });
                  setResetConfirmOpen(false);
                  notify("User master demo data reset to default.");
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
