import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import {
  Building2,
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Eye,
  Pencil,
  Ban,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  CalendarDays,
  Mail,
  Globe,
  Download,
  RotateCcw,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Trash2,
  Lock,
  Unlock,
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Organizations.css";
import orgAvatarImg from "../../../assets/images/organization-avatar.png";

const STORAGE_KEY = "teamflow_superadmin_organizations";

const initialOrganizations = [
  { id: "ORG-1001", name: "Acme Corporation", email: "admin@acmecorp.com", domain: "acmecorp.com", plan: "Enterprise", users: 1240, status: "Active", createdAt: "2026-10-12", color: "violet" },
  { id: "ORG-1002", name: "BrightLabs", email: "hello@brightlabs.io", domain: "brightlabs.io", plan: "Professional", users: 856, status: "Active", createdAt: "2026-10-10", color: "blue" },
  { id: "ORG-1003", name: "NovaTech Solutions", email: "team@novatech.com", domain: "novatech.com", plan: "Business", users: 642, status: "Active", createdAt: "2026-10-08", color: "orange" },
  { id: "ORG-1004", name: "PixelCraft Studio", email: "contact@pixelcraft.co", domain: "pixelcraft.co", plan: "Starter", users: 128, status: "Pending", createdAt: "2026-10-06", color: "pink" },
  { id: "ORG-1005", name: "Vertex Digital", email: "hello@vertexdigital.io", domain: "vertexdigital.io", plan: "Enterprise", users: 1085, status: "Active", createdAt: "2026-10-03", color: "green" },
  { id: "ORG-1006", name: "CloudNine Technologies", email: "admin@cloudnine.dev", domain: "cloudnine.dev", plan: "Starter", users: 74, status: "Suspended", createdAt: "2026-09-28", color: "blue" },
  { id: "ORG-1007", name: "Orbit Creative", email: "team@orbitcreative.co", domain: "orbitcreative.co", plan: "Business", users: 319, status: "Active", createdAt: "2026-09-22", color: "pink" },
  { id: "ORG-1008", name: "Summit Works", email: "contact@summitworks.com", domain: "summitworks.com", plan: "Starter", users: 92, status: "Pending", createdAt: "2026-09-18", color: "orange" },
  { id: "ORG-1009", name: "BluePeak Systems", email: "admin@bluepeak.io", domain: "bluepeak.io", plan: "Enterprise", users: 1530, status: "Active", createdAt: "2026-09-12", color: "violet" },
  { id: "ORG-1010", name: "Greenfield Labs", email: "hello@greenfieldlabs.com", domain: "greenfieldlabs.com", plan: "Professional", users: 247, status: "Active", createdAt: "2026-09-05", color: "green" },
  { id: "ORG-1011", name: "PulseWave Analytics", email: "contact@pulsewave.ai", domain: "pulsewave.ai", plan: "Business", users: 512, status: "Active", createdAt: "2026-08-20", color: "blue" },
  { id: "ORG-1012", name: "OmniCore Retail", email: "support@omnicore.io", domain: "omnicore.io", plan: "Professional", users: 430, status: "Active", createdAt: "2026-08-14", color: "orange" },
];

const colors = ["violet", "blue", "orange", "pink", "green"];

const emptyForm = {
  name: "",
  email: "",
  domain: "",
  plan: "Starter",
  users: 10,
  status: "Active",
};

const makeInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

function readOrganizations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to read demo organizations:", error);
  }

  return initialOrganizations;
}

function Organizations() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [organizations, setOrganizations] = useState(readOrganizations);
  const [search, setSearch] = useState(
    () => searchParams.get("search") || ""
  );
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [menuId, setMenuId] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [deleteConfirmOrg, setDeleteConfirmOrg] = useState(null);

  // Enterprise Table Features
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [density, setDensity] = useState("standard");
  const [pageSize, setPageSize] = useState(10);
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

  // Persist demo data in this browser.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(organizations));
    } catch (error) {
      console.error("Unable to save demo organizations:", error);
    }
  }, [organizations]);

  // Clear success messages automatically.
  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Synchronize the topbar search URL with the table search.
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearch((current) => (current === urlSearch ? current : urlSearch));
    setCurrentPage(1);
  }, [searchParams]);

  // Close dialogs using Escape.
  useEffect(() => {
    if (!modal && !resetConfirmOpen && !deleteConfirmOrg) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setModal(null);
        setFormError("");
        setResetConfirmOpen(false);
        setDeleteConfirmOrg(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal, resetConfirmOpen, deleteConfirmOrg]);

  const filteredOrganizations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return organizations.filter((org) => {
      const matchesSearch =
        !query ||
        [org.name, org.email, org.domain, org.id, org.plan, org.status].some(
          (value) => String(value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" || org.status === statusFilter;

      const matchesPlan = planFilter === "All" || org.plan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [organizations, search, statusFilter, planFilter]);

  const sortedOrganizations = useMemo(() => {
    let list = [...filteredOrganizations];
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
  }, [filteredOrganizations, sortField, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedOrganizations.length / pageSize)
  );
  const safePage = Math.min(currentPage, totalPages);

  const paginatedOrganizations = sortedOrganizations.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const activeCount = organizations.filter(
    (org) => org.status === "Active"
  ).length;

  const pendingCount = organizations.filter(
    (org) => org.status === "Pending"
  ).length;

  const suspendedCount = organizations.filter(
    (org) => org.status === "Suspended"
  ).length;

  const totalUsers = organizations.reduce(
    (sum, org) => sum + (Number(org.users) || 0),
    0
  );

  const notify = (message) => setToast(message);

  const updateSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);

    const next = new URLSearchParams(searchParams);

    if (value.trim()) {
      next.set("search", value);
    } else {
      next.delete("search");
    }

    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPlanFilter("All");
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedOrganizations.map((o) => o.id)));
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

  const handleBatchStatus = (newStatus) => {
    setOrganizations((prev) =>
      prev.map((o) => (selectedIds.has(o.id) ? { ...o, status: newStatus } : o))
    );
    notify(`Updated ${selectedIds.size} organizations to ${newStatus}.`);
    setSelectedIds(new Set());
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setFormError("");
    setMenuId(null);
    setModal({ mode: "add" });
  };

  const openEditModal = (org) => {
    setForm({
      name: org.name,
      email: org.email,
      domain: org.domain,
      plan: org.plan,
      users: org.users || 1,
      status: org.status,
    });

    setFormError("");
    setMenuId(null);
    setModal({ mode: "edit", organization: org });
  };

  const handleFormChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Please enter an organization name.";
    if (!form.email.trim()) return "Please enter a primary contact email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return "Please enter a valid email address.";
    if (!form.domain.trim()) return "Please enter the workspace domain.";
    if (!form.users || Number(form.users) < 1)
      return "Please enter a valid seat count (minimum 1 user).";
    return "";
  };

  const saveOrganization = (event) => {
    event.preventDefault();

    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    if (modal?.mode === "add") {
      const newOrganization = {
        id: `ORG-${Math.floor(1000 + Math.random() * 9000)}`,
        name: form.name.trim(),
        email: form.email.trim(),
        domain: form.domain.trim().toLowerCase(),
        plan: form.plan,
        users: Number(form.users) || 1,
        status: form.status,
        createdAt: new Date().toISOString().slice(0, 10),
        color: colors[organizations.length % colors.length],
      };

      setOrganizations((current) => [newOrganization, ...current]);
      notify(`Organization ${newOrganization.name} has been added.`);
    }

    if (modal?.mode === "edit" && modal.organization) {
      setOrganizations((current) =>
        current.map((org) =>
          org.id === modal.organization.id
            ? {
                ...org,
                name: form.name.trim(),
                email: form.email.trim(),
                domain: form.domain.trim().toLowerCase(),
                plan: form.plan,
                users: Number(form.users) || org.users || 1,
                status: form.status,
              }
            : org
        )
      );

      notify(`Organization ${form.name} has been updated.`);
    }

    setModal(null);
    setForm(emptyForm);
    setFormError("");
  };

  const toggleStatus = (org) => {
    const nextStatus = org.status === "Active" ? "Suspended" : "Active";

    setOrganizations((current) =>
      current.map((item) =>
        item.id === org.id ? { ...item, status: nextStatus } : item
      )
    );

    setMenuId(null);
    notify(
      `${org.name} is now ${nextStatus === "Active" ? "active" : "suspended"}.`
    );
  };

  const confirmDeleteOrganization = () => {
    if (!deleteConfirmOrg) return;

    setOrganizations((current) =>
      current.filter((org) => org.id !== deleteConfirmOrg.id)
    );

    notify(`Organization ${deleteConfirmOrg.name} has been deleted.`);
    setDeleteConfirmOrg(null);
  };

  const confirmResetDemoData = () => {
    setOrganizations(initialOrganizations);
    setSearch("");
    setStatusFilter("All");
    setPlanFilter("All");
    setCurrentPage(1);
    setSearchParams({}, { replace: true });
    setResetConfirmOpen(false);
    notify("Organization demo data has been reset.");
  };

  const exportOrganizations = () => {
    const rows = [
      ["ID", "Organization", "Domain", "Email", "Plan", "Users", "Status", "Created At"],
      ...filteredOrganizations.map((org) => [
        org.id,
        org.name,
        org.domain,
        org.email,
        org.plan,
        org.users,
        org.status,
        org.createdAt,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row.map((val) => `"${String(val || "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `teamflow_organizations_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify(`Exported ${filteredOrganizations.length} organizations to CSV.`);
  };

  return (
    <main className="sa-page-container org-page" onClick={() => menuId && setMenuId(null)}>
      {/* 1. Header with SAP Master Badge */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>Organization Directory</h1>
          <p className="sap-header-subtitle">
            Enterprise multi-tenant directory, subscription plan allocation, domain governance, and tenant lifecycle.
          </p>
        </div>

        <div className="sap-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={exportOrganizations}
          >
            <Download size={15} /> Export Directory
          </button>

          <button
            type="button"
            className="sa-btn sa-btn-primary"
            onClick={openAddModal}
          >
            <Plus size={16} /> New Organization
          </button>
        </div>
      </section>

      {/* 2. Top 4 KPI Telemetry Cards */}
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <Building2 size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Total Tenants</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{organizations.length}</span>
              <span className="sa-kpi-trend positive">100% Bound</span>
            </div>
            <span className="sa-kpi-subtitle">Registered tenant organizations</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <CheckCircle2 size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Active Organizations</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{activeCount}</span>
              <span className="sa-kpi-trend positive">Operational</span>
            </div>
            <span className="sa-kpi-subtitle">Unrestricted platform access</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <CalendarDays size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Pending Review</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{pendingCount}</span>
              <span className="sa-kpi-trend negative">Verification</span>
            </div>
            <span className="sa-kpi-subtitle">Awaiting domain approval</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box purple">
            <Users size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Total Active Users</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{totalUsers.toLocaleString()}</span>
              <span className="sa-kpi-trend positive">Enrolled</span>
            </div>
            <span className="sa-kpi-subtitle">Across all tenant domains</span>
          </div>
        </article>
      </section>

      {toast && (
        <div className="sa-toast-banner">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* 3. The Master Data Table Card */}
      <section className="sap-table-card">
        {/* Selection Batch Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="sap-batch-banner">
            <span>
              <strong>{selectedIds.size}</strong> organization records selected
            </span>
            <div className="sap-batch-actions">
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={() => handleBatchStatus("Active")}
              >
                <Unlock size={13} /> Activate Selected
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={() => handleBatchStatus("Suspended")}
              >
                <Lock size={13} /> Suspend Selected
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={exportOrganizations}
              >
                <Download size={13} /> Export Selected
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-danger sa-btn-sm"
                onClick={() => {
                  const count = selectedIds.size;
                  setOrganizations((prev) => prev.filter((o) => !selectedIds.has(o.id)));
                  notify(`Deleted ${count} selected organizations.`);
                  setSelectedIds(new Set());
                }}
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
                placeholder="Search Organization ID, Name, Domain, Email..."
                value={search}
                onChange={(e) => updateSearch(e.target.value)}
              />
            </div>

            <select
              className="sap-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">Status: All Statuses</option>
              <option value="Active">00 - Active (Operational)</option>
              <option value="Pending">01 - Pending Review</option>
              <option value="Suspended">02 - Suspended (Locked)</option>
            </select>

            <select
              className="sap-filter-select"
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">Plan Tier: All Plans</option>
              <option value="Starter">Starter Tier</option>
              <option value="Professional">Professional Tier</option>
              <option value="Business">Business Tier</option>
              <option value="Enterprise">Enterprise Tier</option>
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
              onClick={clearFilters}
              title="Reset all filters"
            >
              <RefreshCw size={15} />
            </button>

            <button
              type="button"
              className="sa-btn sa-btn-secondary sa-btn-sm"
              onClick={() => setResetConfirmOpen(true)}
              title="Reset demo data"
            >
              <RotateCcw size={13} /> Reset Demo Data
            </button>
          </div>
        </div>

        {/* 4. The Master Data Grid Table */}
        <div className="sap-table-wrapper">
          <table className={`sap-grid is-${density}`}>
            <thead>
              <tr>
                <th style={{ width: 38, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      paginatedOrganizations.length > 0 &&
                      paginatedOrganizations.every((o) => selectedIds.has(o.id))
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="sap-sortable-th" onClick={() => handleSort("id")}>
                  <span className="sap-th-content">Tenant ID {renderSortIcon("id")}</span>
                </th>
                <th className="sap-sortable-th" onClick={() => handleSort("name")}>
                  <span className="sap-th-content">Organization &amp; Domain {renderSortIcon("name")}</span>
                </th>
                <th className="sap-sortable-th" onClick={() => handleSort("email")}>
                  <span className="sap-th-content">Contact Email {renderSortIcon("email")}</span>
                </th>
                <th className="sap-sortable-th" onClick={() => handleSort("plan")}>
                  <span className="sap-th-content">Subscription Plan {renderSortIcon("plan")}</span>
                </th>
                <th className="sap-sortable-th" onClick={() => handleSort("users")}>
                  <span className="sap-th-content">Enrolled Users {renderSortIcon("users")}</span>
                </th>
                <th className="sap-sortable-th" onClick={() => handleSort("status")}>
                  <span className="sap-th-content">Tenant Status {renderSortIcon("status")}</span>
                </th>
                <th className="sap-sortable-th" onClick={() => handleSort("createdAt")}>
                  <span className="sap-th-content">Creation Date {renderSortIcon("createdAt")}</span>
                </th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrganizations.map((org) => {
                const isSelected = selectedIds.has(org.id);
                return (
                  <tr key={org.id} className={isSelected ? "is-selected" : ""}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(org.id)}
                      />
                    </td>

                    {/* Monospace Tenant ID */}
                    <td>
                      <span className="sap-id-cell">{org.id}</span>
                    </td>

                    {/* Organization & Domain */}
                    <td>
                      <div
                        className="sap-user-badge"
                        style={{ cursor: "pointer" }}
                        title="Click to view organization details"
                        onClick={() => setModal({ mode: "view", organization: org })}
                      >
                        <div className="org-table-avatar-wrap">
                          <img
                            src={org.logo || orgAvatarImg}
                            alt={org.name}
                            className="org-table-avatar-img"
                            loading="lazy"
                          />
                        </div>
                        <div className="sap-user-info">
                          <strong>{org.name}</strong>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                            <Globe size={11} /> {org.domain}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td>
                      <span style={{ color: "var(--sa-text-secondary)", fontSize: "12px" }}>
                        {org.email}
                      </span>
                    </td>

                    {/* Plan Tier Badge */}
                    <td>
                      <span
                        className={`sap-role-badge ${
                          org.plan === "Enterprise"
                            ? "enterprise"
                            : org.plan === "Business"
                            ? "business"
                            : org.plan === "Professional"
                            ? "professional"
                            : "starter"
                        }`}
                      >
                        {org.plan}
                      </span>
                    </td>

                    {/* Users count */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 600 }}>
                        <Users size={13} style={{ color: "var(--sa-text-muted)" }} />
                        {Number(org.users || 0).toLocaleString()}
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td>
                      <span
                        className={`sap-status-pill ${
                          org.status === "Active"
                            ? "valid"
                            : org.status === "Suspended"
                            ? "locked"
                            : "pending"
                        }`}
                      >
                        <span className="sap-status-dot" />
                        {org.status}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td>
                      <span style={{ color: "var(--sa-text-muted)", fontSize: "12px" }}>
                        {formatDate(org.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: "right" }}>
                      <div className="org-action-group" style={{ justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="org-action-btn btn-view"
                          title="View Organization"
                          onClick={() => setModal({ mode: "view", organization: org })}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          className="org-action-btn btn-edit"
                          title="Edit Organization"
                          onClick={() => openEditModal(org)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className={`org-action-btn btn-toggle ${org.status === "Suspended" ? "is-activate" : "is-suspend"}`}
                          title={org.status === "Suspended" ? "Activate Organization" : "Suspend Organization"}
                          onClick={() => toggleStatus(org)}
                        >
                          {org.status === "Suspended" ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <Ban size={14} />
                          )}
                        </button>
                        <button
                          type="button"
                          className="org-action-btn btn-delete"
                          title="Delete Organization"
                          onClick={() => setDeleteConfirmOrg(org)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedOrganizations.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "40px 20px" }}>
                    <div style={{ color: "var(--sa-text-muted)", fontSize: 13 }}>
                      <strong>No organizations found matching your search.</strong>
                      <p style={{ margin: "6px 0 12px", fontSize: 12 }}>Try clearing or adjusting your active filter options.</p>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={clearFilters}
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

        {/* 5. Footer Bar */}
        <footer className="sap-footer-bar">
          <div className="sap-footer-counts" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span>
              Showing {filteredOrganizations.length ? (safePage - 1) * pageSize + 1 : 0}–
              {Math.min(safePage * pageSize, filteredOrganizations.length)} of{" "}
              {filteredOrganizations.length} organizations
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
              <span>Rows per page:</span>
              <select
                className="sap-filter-select"
                style={{ padding: "3px 6px", fontSize: 12, height: 26 }}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
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
              disabled={safePage <= 1}
              onClick={() => setCurrentPage(1)}
              title="First Page"
            >
              «
            </button>
            <button
              type="button"
              className="sap-page-btn"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              title="Previous Page"
            >
              ‹
            </button>
            <span style={{ padding: "0 8px", fontWeight: 600 }}>
              Page {safePage} of {totalPages}
            </span>
            <button
              type="button"
              className="sap-page-btn"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              title="Next Page"
            >
              ›
            </button>
            <button
              type="button"
              className="sap-page-btn"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              title="Last Page"
            >
              »
            </button>
          </div>
        </footer>
      </section>

      {/* MODALS */}
      {modal && typeof document !== "undefined" && createPortal(
        <div
          className="org-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModal(null);
              setFormError("");
            }
          }}
        >
          <section
            className={`org-modal ${
              modal.mode === "view" ? "org-details-modal" : ""
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="org-modal-title"
          >
            <header className="org-modal-header">
              <div className="org-modal-title-icon">
                {modal.mode === "view" ? (
                  <Building2 size={22} />
                ) : modal.mode === "edit" ? (
                  <Pencil size={22} />
                ) : (
                  <Plus size={22} />
                )}
              </div>

              <div>
                <h2 id="org-modal-title">
                  {modal.mode === "view"
                    ? "Organization details"
                    : modal.mode === "edit"
                      ? "Edit organization"
                      : "Add organization"}
                </h2>
                <p>
                  {modal.mode === "view"
                    ? "Review account information and subscription status."
                    : "Enter the details for this organization."}
                </p>
              </div>

              <button
                type="button"
                className="org-modal-close"
                aria-label="Close dialog"
                onClick={() => {
                  setModal(null);
                  setFormError("");
                }}
              >
                <X size={18} />
              </button>
            </header>

            {modal.mode === "view" && modal.organization && (
              <div className="org-details-body">
                <div className="org-details-hero">
                  <div className="org-avatar-modal-wrap">
                    <img
                      src={modal.organization.logo || orgAvatarImg}
                      alt={modal.organization.name}
                      className="org-modal-avatar-img"
                    />
                  </div>
                  <div>
                    <h3>{modal.organization.name}</h3>
                    <span>{modal.organization.id}</span>
                  </div>
                </div>

                <div className="org-details-grid">
                  <div className="org-detail-item">
                    <small>Primary Contact</small>
                    <p>{modal.organization.email}</p>
                  </div>

                  <div className="org-detail-item">
                    <small>Workspace Domain</small>
                    <p>{modal.organization.domain}</p>
                  </div>

                  <div className="org-detail-item">
                    <small>Subscription Tier</small>
                    <p>{modal.organization.plan}</p>
                  </div>

                  <div className="org-detail-item">
                    <small>Enrolled Users</small>
                    <p>{Number(modal.organization.users).toLocaleString()}</p>
                  </div>

                  <div className="org-detail-item">
                    <small>Operational Status</small>
                    <p>{modal.organization.status}</p>
                  </div>

                  <div className="org-detail-item">
                    <small>Registration Date</small>
                    <p>{formatDate(modal.organization.createdAt)}</p>
                  </div>
                </div>

                <div className="org-modal-footer">
                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary"
                    onClick={() => {
                      setModal(null);
                      setFormError("");
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="sa-btn sa-btn-primary"
                    onClick={() => openEditModal(modal.organization)}
                  >
                    <Pencil size={14} /> Edit Organization
                  </button>
                </div>
              </div>
            )}

            {modal.mode !== "view" && (
              <form onSubmit={saveOrganization} className="org-form">
                {formError && (
                  <div className="org-form-error" role="alert">
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                <label className="org-form-field">
                  <span>Organization Name *</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Acme Corporation"
                    required
                  />
                </label>

                <div className="org-form-row">
                  <label className="org-form-field">
                    <span>Contact Email *</span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      placeholder="admin@acmecorp.com"
                      required
                    />
                  </label>

                  <label className="org-form-field">
                    <span>Workspace Domain *</span>
                    <input
                      type="text"
                      name="domain"
                      value={form.domain}
                      onChange={handleFormChange}
                      placeholder="acmecorp.com"
                      required
                    />
                  </label>
                </div>

                <div className="org-form-row">
                  <label className="org-form-field">
                    <span>Subscription Plan</span>
                    <select
                      name="plan"
                      value={form.plan}
                      onChange={handleFormChange}
                    >
                      <option value="Starter">Starter Tier</option>
                      <option value="Professional">Professional Tier</option>
                      <option value="Business">Business Tier</option>
                      <option value="Enterprise">Enterprise Tier</option>
                    </select>
                  </label>

                  <label className="org-form-field">
                    <span>Enrolled Users (Seat Count) *</span>
                    <input
                      type="number"
                      name="users"
                      min="1"
                      max="100000"
                      value={form.users}
                      onChange={handleFormChange}
                      placeholder="e.g. 50"
                      required
                    />
                  </label>
                </div>

                <div className="org-form-row">
                  <label className="org-form-field">
                    <span>Account Status</span>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleFormChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </label>
                </div>

                <div className="org-modal-footer">
                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary"
                    onClick={() => {
                      setModal(null);
                      setFormError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="sa-btn sa-btn-primary">
                    {modal.mode === "add" ? "Create Organization" : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>,
        document.body
      )}

      {/* RESET CONFIRMATION DIALOG */}
      {resetConfirmOpen && typeof document !== "undefined" && createPortal(
        <div
          className="org-modal-backdrop org-reset-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setResetConfirmOpen(false);
            }
          }}
        >
          <section
            className="org-modal org-reset-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="org-reset-title"
          >
            <div className="org-reset-icon">
              <RotateCcw size={24} />
            </div>

            <h2 id="org-reset-title">Reset demo data?</h2>
            <p>
              This restores the original sample organizations and removes
              organizations added in this browser.
            </p>

            <div className="org-reset-actions">
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
                onClick={confirmResetDemoData}
              >
                Reset Data
              </button>
            </div>
          </section>
        </div>,
        document.body
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmOrg && typeof document !== "undefined" && createPortal(
        <div
          className="org-modal-backdrop org-reset-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteConfirmOrg(null);
            }
          }}
        >
          <section
            className="org-modal org-reset-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="org-delete-title"
          >
            <div className="org-reset-icon org-delete-icon">
              <Trash2 size={24} />
            </div>

            <h2 id="org-delete-title">Delete organization?</h2>
            <p>
              Are you sure you want to remove{" "}
              <strong>{deleteConfirmOrg.name}</strong> from the tenant directory?
              This action cannot be undone.
            </p>

            <div className="org-reset-actions">
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={() => setDeleteConfirmOrg(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="sa-btn sa-btn-danger"
                onClick={confirmDeleteOrganization}
              >
                Delete Organization
              </button>
            </div>
          </section>
        </div>,
        document.body
      )}
    </main>
  );
}

export default Organizations;
