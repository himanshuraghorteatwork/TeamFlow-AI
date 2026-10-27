import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Gem,
  Plus,
  Check,
  Crown,
  Users,
  Sparkles,
  ArrowUpRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  X,
  Zap,
  Search,
  Download,
  SlidersHorizontal,
  RefreshCw,
  Table as TableIcon,
  Grid,
  CheckCircle2,
  Unlock,
  Lock,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Plans.css";

const PREDEFINED_PLAN_FEATURES = [
  "Up to 5 team members",
  "Up to 30 team members",
  "Up to 100 team members",
  "Unlimited team members",
  "1,000 AI tokens / month",
  "50,000 AI tokens / month",
  "250,000 AI tokens / month",
  "1,000,000+ AI tokens / month",
  "Full API & Webhooks Access",
  "Enterprise SSO & SAML 2.0",
  "Dedicated IP & SLA 99.99%",
  "Custom Branding & White-Label",
  "Granular RBAC & Audit Trails",
  "24/7 Dedicated Account Manager",
  "Priority Email & Chat Support",
  "10 GB Cloud Storage",
  "25 GB Cloud Storage",
  "100 GB Cloud Storage",
  "500 GB High-Speed NVMe Storage",
  "Automated Invoicing & GST Tax Engine",
];

const PRESET_TIER_COLORS = [
  "#0284c7", // Sky (Free)
  "#2563eb", // Royal Blue (Pro)
  "#d97706", // Amber (Business)
  "#7c3aed", // Purple (Enterprise)
  "#059669", // Emerald
  "#dc2626", // Red
];

const INITIAL_PLANS = [
  {
    id: "PLAN-FREE-100",
    name: "Free",
    tierCode: "TIER-00-FREE",
    tagline: "For individuals and small teams getting started with AI workflows.",
    monthlyPrice: 0,
    annualPrice: 0,
    badge: "Free Forever",
    subscribers: 57,
    percentage: 40,
    color: "#0284c7",
    tokens: "1,000 / mo",
    seats: "Up to 5 seats",
    storage: "1 GB cloud",
    features: [
      "Up to 5 team members",
      "1,000 AI tokens / month",
      "3 active workspaces",
      "Community support",
      "1 GB cloud storage",
    ],
    status: "Active",
  },
  {
    id: "PLAN-PRO-200",
    name: "Pro",
    tierCode: "TIER-10-PRO",
    tagline: "For growing organizations scaling AI productivity across teams.",
    monthlyPrice: 2499,
    annualPrice: 23990,
    badge: "Most Popular",
    subscribers: 50,
    percentage: 35,
    color: "#2563eb",
    tokens: "50,000 / mo",
    seats: "Up to 30 seats",
    storage: "25 GB cloud",
    features: [
      "Up to 30 team members",
      "50,000 AI tokens / month",
      "Unlimited workspaces",
      "Standard email & chat support",
      "25 GB cloud storage",
      "Audit logs (30 days)",
    ],
    status: "Active",
  },
  {
    id: "PLAN-BUS-300",
    name: "Business",
    tierCode: "TIER-20-BUS",
    tagline: "For high-velocity companies requiring dedicated AI quotas.",
    monthlyPrice: 7999,
    annualPrice: 76790,
    badge: "Best Value",
    subscribers: 28,
    percentage: 20,
    color: "#d97706",
    tokens: "250,000 / mo",
    seats: "Up to 100 seats",
    storage: "100 GB cloud",
    features: [
      "Up to 100 team members",
      "250,000 AI tokens / month",
      "Unlimited workspaces",
      "Priority 24/7 support",
      "100 GB cloud storage",
      "Custom SMTP & Branding",
      "Audit logs (1 year)",
    ],
    status: "Active",
  },
  {
    id: "PLAN-ENT-400",
    name: "Enterprise",
    tierCode: "TIER-30-ENT",
    tagline: "For large-scale enterprises with custom SLAs & compliance controls.",
    monthlyPrice: 24999,
    annualPrice: 239990,
    badge: "Custom SLA",
    subscribers: 7,
    percentage: 5,
    color: "#7c3aed",
    tokens: "1,000,000+ / mo",
    seats: "Unlimited seats",
    storage: "Unlimited NVMe",
    features: [
      "Unlimited team members",
      "1,000,000+ AI tokens / month",
      "Dedicated infrastructure",
      "Dedicated account manager",
      "Unlimited cloud storage",
      "99.99% uptime SLA",
      "SSO & Custom Security rules",
    ],
    status: "Active",
  },
];

const getTierIcon = (planName) => {
  const norm = (planName || "").toLowerCase();
  if (norm.includes("free")) return <Sparkles size={18} />;
  if (norm.includes("pro")) return <Zap size={18} />;
  if (norm.includes("bus")) return <Crown size={18} />;
  return <Gem size={18} />;
};

function Plans() {
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [viewMode, setViewMode] = useState("table"); // "table" | "cards"
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" | "annual"
  const [density, setDensity] = useState("standard");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletePlanTarget, setDeletePlanTarget] = useState(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [customFeatureInput, setCustomFeatureInput] = useState("");

  const [planForm, setPlanForm] = useState({
    name: "",
    tagline: "",
    monthlyPrice: "",
    annualPrice: "",
    badge: "",
    color: "#2563eb",
    tokens: "50,000 / mo",
    seats: "Up to 25 seats",
    storage: "25 GB cloud",
    features: [],
    status: "Active",
  });

  // Global Escape key listener to close modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setModalOpen(false);
        setEditingPlan(null);
        setDeletePlanTarget(null);
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

  const totalSubscribers = useMemo(
    () => plans.reduce((acc, p) => acc + (p.subscribers || 0), 0),
    [plans]
  );

  const totalMonthlyPotential = useMemo(
    () =>
      plans.reduce(
        (acc, p) => acc + (p.status === "Active" ? p.monthlyPrice * p.subscribers : 0),
        0
      ),
    [plans]
  );

  const filteredPlans = useMemo(() => {
    const q = search.trim().toLowerCase();
    return plans.filter((plan) => {
      const matchSearch =
        !q ||
        plan.name.toLowerCase().includes(q) ||
        plan.id.toLowerCase().includes(q) ||
        (plan.tierCode && plan.tierCode.toLowerCase().includes(q)) ||
        plan.tagline.toLowerCase().includes(q) ||
        plan.features.some((f) => f.toLowerCase().includes(q));

      const matchStatus =
        statusFilter === "All" || plan.status.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [plans, search, statusFilter]);

  const sortedPlans = useMemo(() => {
    return [...filteredPlans].sort((a, b) => {
      let aVal = a[sortField] || "";
      let bVal = b[sortField] || "";
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredPlans, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedPlans.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedPlans.slice(start, start + pageSize);
  }, [sortedPlans, currentPage, pageSize]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedPlans.map((p) => p.id)));
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

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      tagline: plan.tagline,
      monthlyPrice: String(plan.monthlyPrice),
      annualPrice: String(plan.annualPrice),
      badge: plan.badge || "",
      color: plan.color || "#2563eb",
      tokens: plan.tokens || "50,000 / mo",
      seats: plan.seats || "Up to 30 seats",
      storage: plan.storage || "25 GB cloud",
      features: Array.isArray(plan.features) ? [...plan.features] : [],
      status: plan.status || "Active",
    });
    setCustomFeatureInput("");
    setModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setPlanForm({
      name: "",
      tagline: "",
      monthlyPrice: "",
      annualPrice: "",
      badge: "",
      color: "#2563eb",
      tokens: "50,000 / mo",
      seats: "Up to 25 seats",
      storage: "25 GB cloud",
      features: [
        "Up to 25 team members",
        "50,000 AI tokens / month",
        "Standard email & chat support",
        "25 GB cloud storage",
      ],
      status: "Active",
    });
    setCustomFeatureInput("");
    setModalOpen(true);
  };

  const handleToggleStatus = (id) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" }
          : p
      )
    );
    notify("Pricing plan status toggled.");
  };

  const handleSavePlan = (e) => {
    e.preventDefault();
    if (!planForm.name.trim()) return;

    if (editingPlan) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlan.id
            ? {
                ...p,
                name: planForm.name.trim(),
                tagline: planForm.tagline.trim(),
                monthlyPrice: Number(planForm.monthlyPrice) || 0,
                annualPrice: Number(planForm.annualPrice) || 0,
                badge: planForm.badge.trim(),
                color: planForm.color || p.color,
                tokens: planForm.tokens,
                seats: planForm.seats,
                storage: planForm.storage,
                features: planForm.features,
                status: planForm.status,
              }
            : p
        )
      );
      notify(`Pricing tier "${planForm.name}" updated successfully.`);
    } else {
      const codeSuffix = planForm.name.slice(0, 3).toUpperCase();
      const newPlan = {
        id: `PLAN-${codeSuffix}-${Date.now().toString().slice(-3)}`,
        name: planForm.name.trim(),
        tierCode: `TIER-${Date.now().toString().slice(-4)}`,
        tagline: planForm.tagline.trim() || "Configured enterprise tier.",
        monthlyPrice: Number(planForm.monthlyPrice) || 0,
        annualPrice: Number(planForm.annualPrice) || 0,
        badge: planForm.badge.trim(),
        tokens: planForm.tokens,
        seats: planForm.seats,
        storage: planForm.storage,
        subscribers: 0,
        percentage: 0,
        color: planForm.color || "#2563eb",
        features: planForm.features.length ? planForm.features : ["Standard platform access"],
        status: planForm.status || "Active",
      };
      setPlans((prev) => [...prev, newPlan]);
      notify(`New pricing tier "${newPlan.name}" created successfully.`);
    }

    setModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = [
      "Plan ID",
      "Tier Code",
      "Plan Name",
      "Monthly Price INR",
      "Annual Price INR",
      "Subscribers",
      "AI Tokens",
      "Seats",
      "Storage",
      "Status",
    ];

    const rows = sortedPlans.map((p) => [
      p.id,
      p.tierCode,
      p.name,
      p.monthlyPrice,
      p.annualPrice,
      p.subscribers,
      p.tokens,
      p.seats,
      p.storage,
      p.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers, ...rows]
        .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "teamflow_plans_matrix.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("Exported subscription plans spreadsheet.");
  };

  return (
    <div className="plans-page">
      {/* 1. SAP Master Header Bar */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>Subscription Tier &amp; Pricing Matrix</h1>
          <p className="sap-header-subtitle">
            Enterprise pricing architecture, AI token limits, seat quotas, and tenant distribution registry.
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
            onClick={handleOpenCreate}
          >
            <Plus size={16} /> Create Pricing Tier
          </button>
        </div>
      </section>

      {/* 2. Top 4 Telemetry Cards */}
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <Gem size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Active Pricing Tiers</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{plans.length}</span>
              <span className="sa-kpi-trend positive">100% Live</span>
            </div>
            <span className="sa-kpi-subtitle">Configured plan models</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box sky">
            <Users size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Total Subscribed Orgs</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{totalSubscribers}</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 100% Bound
              </span>
            </div>
            <span className="sa-kpi-subtitle">Across active tenants</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <span style={{ fontSize: 22, fontWeight: 800 }}>₹</span>
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Monthly Run Rate</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">
                ₹{(totalMonthlyPotential / 100000).toFixed(2)}L
              </span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 16%
              </span>
            </div>
            <span className="sa-kpi-subtitle">Recurring tier capacity</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <Crown size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Highest Volume Tier</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">Business</span>
              <span className="sa-kpi-trend positive">20% Conversion</span>
            </div>
            <span className="sa-kpi-subtitle">Key enterprise expansion tier</span>
          </div>
        </article>
      </section>

      {/* 3. Live Subscriber Allocation Ribbon */}
      <section className="sa-card sa-plan-distribution-card">
        <div className="sa-card-header" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--sa-text-main)" }}>
            Live Tenant Tier Distribution
          </h3>
          <span className="sa-total-tag">{totalSubscribers} Subscribed Organizations</span>
        </div>

        <div className="sa-alloc-bar-wrapper">
          <div className="sa-alloc-bar">
            {plans.map((p) => (
              <div
                key={p.id}
                className="sa-alloc-segment"
                style={{
                  width: `${p.percentage || 1}%`,
                  backgroundColor: p.color,
                }}
                title={`${p.name}: ${p.subscribers} subscribers (${p.percentage}%)`}
              />
            ))}
          </div>
          <div className="sa-alloc-legend">
            {plans.map((p) => (
              <div key={p.id} className="sa-alloc-legend-item">
                <span
                  className="sa-alloc-dot"
                  style={{ backgroundColor: p.color }}
                />
                <span className="sa-alloc-name">{p.name}</span>
                <span className="sa-alloc-subtext">
                  {p.subscribers} orgs ({p.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {toast && (
        <div className="sa-toast-banner">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* 4. The SAP Table Card / Visual Cards Grid */}
      <section className="sap-table-card">
        {/* Multi-Selection Batch Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="sap-batch-banner">
            <span>
              <strong>{selectedIds.size}</strong> pricing tiers selected
            </span>
            <div className="sap-batch-actions">
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
                placeholder="Search plan name, tier code, AI tokens, features..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <select
              className="sap-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Status: All Statuses</option>
              <option value="Active">Active Tiers</option>
              <option value="Inactive">Inactive Tiers</option>
            </select>
          </div>

          <div className="sap-toolbar-right">
            {/* View Mode Switcher: Table vs Cards */}
            <div className="sa-view-switcher">
              <button
                type="button"
                className={`sa-view-btn ${viewMode === "table" ? "is-active" : ""}`}
                onClick={() => setViewMode("table")}
                title="SaaS Table View"
              >
                <TableIcon size={14} /> Table
              </button>
              <button
                type="button"
                className={`sa-view-btn ${viewMode === "cards" ? "is-active" : ""}`}
                onClick={() => setViewMode("cards")}
                title="Visual Cards View"
              >
                <Grid size={14} /> Cards
              </button>
            </div>

            {/* Density Switcher */}
            {viewMode === "table" && (
              <button
                type="button"
                className="sap-icon-btn"
                onClick={() => setDensity((d) => (d === "standard" ? "compact" : "standard"))}
                title={`Switch density (currently ${density})`}
              >
                <SlidersHorizontal size={15} />
              </button>
            )}

            {/* Reset Filters */}
            <button
              type="button"
              className="sap-icon-btn"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
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
              title="Reset all plans to initial demo state"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* 5. Data Presentation: Table or Interactive Cards */}
        {viewMode === "table" ? (
          <>
            <div className="sap-table-wrapper">
              <table className={`sap-grid is-${density}`}>
                <thead>
                  <tr>
                    <th style={{ width: 38, textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={
                          paginatedPlans.length > 0 &&
                          paginatedPlans.every((p) => selectedIds.has(p.id))
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th
                      style={{ width: 130 }}
                      className="sap-sortable-th"
                      onClick={() => handleSort("tierCode")}
                      title="Sort by Tier Code"
                    >
                      <span className="sap-th-content">
                        Tier Code {renderSortIcon("tierCode")}
                      </span>
                    </th>
                    <th
                      className="sap-sortable-th"
                      onClick={() => handleSort("name")}
                      title="Sort by Plan Tier"
                    >
                      <span className="sap-th-content">
                        Plan Tier &amp; Badge {renderSortIcon("name")}
                      </span>
                    </th>
                    <th
                      className="sap-sortable-th"
                      onClick={() => handleSort("monthlyPrice")}
                      title="Sort by Monthly Rate"
                    >
                      <span className="sap-th-content">
                        Monthly Rate {renderSortIcon("monthlyPrice")}
                      </span>
                    </th>
                    <th
                      className="sap-sortable-th"
                      onClick={() => handleSort("annualPrice")}
                      title="Sort by Annual Rate"
                    >
                      <span className="sap-th-content">
                        Annual Rate {renderSortIcon("annualPrice")}
                      </span>
                    </th>
                    <th
                      className="sap-sortable-th"
                      onClick={() => handleSort("subscribers")}
                      title="Sort by Subscribers"
                    >
                      <span className="sap-th-content">
                        Tenant Allocation {renderSortIcon("subscribers")}
                      </span>
                    </th>
                    <th>AI Quota</th>
                    <th>Seat / Storage Specs</th>
                    <th
                      className="sap-sortable-th"
                      onClick={() => handleSort("status")}
                      title="Sort by Status"
                    >
                      <span className="sap-th-content">
                        Tier Status {renderSortIcon("status")}
                      </span>
                    </th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPlans.map((plan) => {
                    const isSelected = selectedIds.has(plan.id);
                    const annualDiscountPercent =
                      plan.monthlyPrice > 0 && plan.annualPrice < plan.monthlyPrice * 12
                        ? Math.round(
                            (1 - plan.annualPrice / (plan.monthlyPrice * 12)) * 100
                          )
                        : 0;

                    return (
                      <tr key={plan.id} className={isSelected ? "is-selected" : ""}>
                        <td style={{ textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(plan.id)}
                          />
                        </td>
                        <td>
                          <span className="sap-id-cell">{plan.tierCode || plan.id}</span>
                        </td>
                        <td>
                          <div className="sap-user-badge">
                            <div
                              className="sap-avatar-chip"
                              style={{
                                backgroundColor: `${plan.color}20`,
                                color: plan.color,
                                fontWeight: 800,
                              }}
                            >
                              {plan.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="sap-user-info">
                              <strong className="sap-user-name" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                {plan.name} Tier
                                {plan.badge && (
                                  <span
                                    style={{
                                      padding: "2px 8px",
                                      borderRadius: 20,
                                      fontSize: 10.5,
                                      fontWeight: 750,
                                      backgroundColor: `${plan.color}15`,
                                      color: plan.color,
                                      border: `1px solid ${plan.color}35`,
                                    }}
                                  >
                                    {plan.badge}
                                  </span>
                                )}
                              </strong>
                              <span className="sap-user-email">{plan.tagline}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 750, color: "var(--sa-text-main)" }}>
                            {plan.monthlyPrice === 0 ? "₹0 (Free)" : `₹${plan.monthlyPrice.toLocaleString()}`}
                          </span>
                          <small style={{ color: "var(--sa-text-muted)", marginLeft: 4 }}>/mo</small>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 750, color: "var(--sa-text-main)" }}>
                              {plan.annualPrice === 0 ? "₹0" : `₹${plan.annualPrice.toLocaleString()}`}
                            </span>
                            <small style={{ color: "var(--sa-text-muted)" }}>/yr</small>
                            {annualDiscountPercent > 0 && (
                              <span className="sa-discount-chip">
                                -{annualDiscountPercent}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ minWidth: 150 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div className="sa-sub-progress" style={{ flex: 1 }}>
                              <div
                                className="sa-sub-progress-fill"
                                style={{ width: `${plan.percentage}%`, backgroundColor: plan.color }}
                              />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 750, color: "var(--sa-text-main)" }}>
                              {plan.subscribers} ({plan.percentage}%)
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              fontFamily: "ui-monospace, monospace",
                              fontSize: "11.5px",
                              fontWeight: 700,
                              padding: "3px 8px",
                              borderRadius: "6px",
                              backgroundColor: `${plan.color}12`,
                              color: plan.color,
                              border: `1px solid ${plan.color}30`,
                            }}
                          >
                            {plan.tokens}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: "12px", fontWeight: 650, color: "var(--sa-text-main)" }}>
                            {plan.seats}
                          </div>
                          <small style={{ color: "var(--sa-text-muted)", fontSize: "11px" }}>
                            {plan.storage}
                          </small>
                        </td>
                        <td>
                          <span
                            className={`sap-status-pill ${
                              plan.status === "Active" ? "is-active" : "is-suspended"
                            }`}
                          >
                            <span className="sap-status-dot" />
                            {plan.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div className="sap-action-group">
                            <button
                              type="button"
                              className="sa-action-btn btn-edit-plan"
                              title="Edit Plan Specifications"
                              onClick={() => handleOpenEdit(plan)}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              className={`sa-action-btn ${plan.status === "Active" ? "btn-pause-plan" : "btn-activate-plan"}`}
                              title={plan.status === "Active" ? "Pause Plan" : "Activate Plan"}
                              onClick={() => handleToggleStatus(plan.id)}
                            >
                              {plan.status === "Active" ? <Lock size={14} /> : <Unlock size={14} />}
                            </button>
                            <button
                              type="button"
                              className="sa-action-btn btn-delete-plan"
                              title="Delete Plan"
                              onClick={() => setDeletePlanTarget(plan)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {sortedPlans.length === 0 && (
                    <tr>
                      <td colSpan={10} style={{ textAlign: "center", padding: "40px", color: "var(--sa-text-muted)" }}>
                        No subscription plans match your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Bar */}
            <div className="sap-footer-bar">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div className="sap-counter">
                  Showing <strong>{sortedPlans.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{" "}
                  <strong>{Math.min(currentPage * pageSize, sortedPlans.length)}</strong> of{" "}
                  <strong>{sortedPlans.length}</strong> subscription plans
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
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
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
                  &laquo;
                </button>
                <button
                  type="button"
                  className="sap-page-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  title="Previous Page"
                >
                  &lsaquo;
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
                  &rsaquo;
                </button>
                <button
                  type="button"
                  className="sap-page-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(totalPages)}
                  title="Last Page"
                >
                  &raquo;
                </button>
              </div>
            </div>
          </>
        ) : (
          /* =========================================================================
             INTERACTIVE CARDS VIEW
             ========================================================================= */
          <div style={{ padding: "16px 20px 20px" }}>
            {/* Billing Cycle Switch Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--sa-text-main)" }}>
                  Tier Pricing Architecture Cards
                </h4>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--sa-text-secondary)" }}>
                  Interactive model cards with live feature breakdown and quota capacity.
                </p>
              </div>

              <div className="sa-billing-toggle">
                <button
                  type="button"
                  className={`sa-billing-tab ${billingCycle === "monthly" ? "is-active" : ""}`}
                  onClick={() => setBillingCycle("monthly")}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  className={`sa-billing-tab ${billingCycle === "annual" ? "is-active" : ""}`}
                  onClick={() => setBillingCycle("annual")}
                >
                  Annual Billing <span className="sa-discount-chip">Save 20%</span>
                </button>
              </div>
            </div>

            {/* Symmetrical 4-Card Grid */}
            <div className="sa-plans-grid">
              {sortedPlans.map((plan) => {
                const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
                const billingSuffix =
                  plan.monthlyPrice === 0
                    ? "/ free forever"
                    : billingCycle === "monthly"
                    ? "/ month"
                    : "/ year (billed annually)";

                const annualSavings =
                  plan.monthlyPrice > 0
                    ? Math.max(0, plan.monthlyPrice * 12 - plan.annualPrice)
                    : 0;

                return (
                  <article
                    key={plan.id}
                    className="sa-plan-tier-card"
                    style={{ "--tier-accent": plan.color }}
                  >
                    {/* Highlight Badge Pill */}
                    {plan.badge && (
                      <div
                        className="sa-plan-badge-pill"
                        style={{
                          backgroundColor: `${plan.color}18`,
                          color: plan.color,
                          borderColor: `${plan.color}35`,
                        }}
                      >
                        <Sparkles size={12} /> {plan.badge}
                      </div>
                    )}

                    {/* Header */}
                    <div className="sa-plan-card-header">
                      <div className="sa-plan-title-row">
                        <span style={{ color: plan.color, display: "inline-flex", alignItems: "center" }}>
                          {getTierIcon(plan.name)}
                        </span>
                        <h3 style={{ color: plan.color }}>{plan.name}</h3>
                      </div>
                      <p className="sa-plan-tagline">{plan.tagline}</p>
                    </div>

                    {/* Price Block */}
                    <div className="sa-plan-price-block">
                      <div className="sa-plan-price-num">
                        <span className="sa-price-currency">₹</span>
                        <span className="sa-price-digits">{price.toLocaleString()}</span>
                      </div>
                      <span className="sa-price-suffix">{billingSuffix}</span>
                      {billingCycle === "annual" && annualSavings > 0 && (
                        <div className="sa-price-savings-note">
                          Saves ₹{annualSavings.toLocaleString()} per year
                        </div>
                      )}
                    </div>

                    {/* Core Quotas Specs Row */}
                    <div className="sa-plan-specs-pills">
                      <span className="sa-spec-pill" title="AI Tokens Quota">
                        <Zap size={12} style={{ color: plan.color }} /> {plan.tokens}
                      </span>
                      <span className="sa-spec-pill" title="Seats Quota">
                        <Users size={12} style={{ color: plan.color }} /> {plan.seats}
                      </span>
                      <span className="sa-spec-pill" title="Cloud Storage">
                        {plan.storage}
                      </span>
                    </div>

                    {/* Feature Checklist */}
                    <div className="sa-plan-feature-list">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="sa-plan-feature-item">
                          <Check size={15} style={{ color: plan.color }} className="sa-feature-check" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Subscriber Allocation Bar */}
                    <div className="sa-plan-subscribers-bar">
                      <div className="sa-sub-header">
                        <span>Tenant Allocation</span>
                        <strong>{plan.subscribers} orgs ({plan.percentage}%)</strong>
                      </div>
                      <div className="sa-sub-progress">
                        <div
                          className="sa-sub-progress-fill"
                          style={{ width: `${plan.percentage}%`, backgroundColor: plan.color }}
                        />
                      </div>
                    </div>

                    {/* Card Footer with Status & Interactive Actions */}
                    <div className="sa-plan-card-footer">
                      <span
                        className={`sap-status-pill ${
                          plan.status === "Active" ? "is-active" : "is-suspended"
                        }`}
                        style={{ fontSize: 11 }}
                      >
                        <span className="sap-status-dot" />
                        {plan.status}
                      </span>

                      <div className="sa-plan-actions-group">
                        <button
                          type="button"
                          className="sa-action-btn btn-edit-plan"
                          title="Edit Plan"
                          onClick={() => handleOpenEdit(plan)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className={`sa-action-btn ${plan.status === "Active" ? "btn-pause-plan" : "btn-activate-plan"}`}
                          title={plan.status === "Active" ? "Pause Plan" : "Activate Plan"}
                          onClick={() => handleToggleStatus(plan.id)}
                        >
                          {plan.status === "Active" ? <Lock size={14} /> : <Unlock size={14} />}
                        </button>
                        <button
                          type="button"
                          className="sa-action-btn btn-delete-plan"
                          title="Delete Plan"
                          onClick={() => setDeletePlanTarget(plan)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          PORTALED MODALS (Escape key + backdrop click close supported)
          ========================================================================= */}

      {/* 6. Edit / Create Plan Modal (Portaled & Properly Styled) */}
      {modalOpen && typeof document !== "undefined" && createPortal(
        <div
          className="sa-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="sa-plan-modal-content">
            <div className="sa-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: `${planForm.color || "#2563eb"}15`,
                    color: planForm.color || "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {editingPlan ? <Pencil size={18} /> : <Plus size={18} />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
                    {editingPlan ? `Edit ${editingPlan.name} Tier` : "Create New Pricing Tier"}
                  </h3>
                  <span style={{ fontSize: 12, color: "var(--sa-text-muted)" }}>
                    Configure pricing formulas, AI quotas, and tenant features.
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePlan}>
              <div className="sa-modal-body" style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Plan Name & Tagline */}
                <div className="sa-form-group">
                  <label>Plan Tier Name *</label>
                  <input
                    type="text"
                    className="sa-form-input"
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    placeholder="e.g. Starter, Growth, Enterprise Plus"
                    required
                  />
                </div>

                <div className="sa-form-group">
                  <label>Tagline / Purpose *</label>
                  <input
                    type="text"
                    className="sa-form-input"
                    value={planForm.tagline}
                    onChange={(e) => setPlanForm({ ...planForm, tagline: e.target.value })}
                    placeholder="Brief description of intended audience..."
                    required
                  />
                </div>

                {/* Monthly & Annual Pricing */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="sa-form-group">
                    <label>Monthly Price (INR ₹) *</label>
                    <input
                      type="number"
                      min="0"
                      className="sa-form-input"
                      value={planForm.monthlyPrice}
                      onChange={(e) => {
                        const mVal = e.target.value;
                        const mNum = Number(mVal || 0);
                        const calcAnnual = mNum > 0 ? Math.round(mNum * 12 * 0.8) : "0";
                        setPlanForm((prev) => ({
                          ...prev,
                          monthlyPrice: mVal,
                          annualPrice: String(calcAnnual),
                        }));
                      }}
                      placeholder="e.g. 2499 (0 for free)"
                      required
                    />
                  </div>

                  <div className="sa-form-group">
                    <label>Annual Price (INR ₹) *</label>
                    <input
                      type="number"
                      min="0"
                      className="sa-form-input"
                      value={planForm.annualPrice}
                      onChange={(e) => setPlanForm({ ...planForm, annualPrice: e.target.value })}
                      placeholder="e.g. 23990"
                      required
                    />
                  </div>
                </div>

                {/* Real-time annual calculation & quick discount presets */}
                <div
                  style={{
                    background: "var(--sa-bg, #f8fafc)",
                    border: "1px solid var(--sa-border, #e2e8f0)",
                    padding: "10px 14px",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ color: "var(--sa-text-main)", fontWeight: 700 }}>
                      Real-Time Annual Breakdown:
                    </span>
                    <strong style={{ color: "#15803d", fontSize: 13 }}>
                      ₹{Number(planForm.annualPrice || 0).toLocaleString()} / yr
                    </strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5, color: "var(--sa-text-secondary)" }}>
                    <span>
                      {Number(planForm.monthlyPrice) > 0 ? (
                        <>
                          Standard 12 mo: ₹{(Number(planForm.monthlyPrice) * 12).toLocaleString()} | Saves:{" "}
                          <strong style={{ color: "#15803d" }}>
                            ₹{Math.max(0, Number(planForm.monthlyPrice) * 12 - Number(planForm.annualPrice || 0)).toLocaleString()}/yr
                          </strong>
                        </>
                      ) : (
                        "Enter monthly price above to view annual projection"
                      )}
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        style={{ padding: "2px 8px", fontSize: 11 }}
                        onClick={() => {
                          const m = Number(planForm.monthlyPrice || 0);
                          setPlanForm((prev) => ({ ...prev, annualPrice: String(Math.round(m * 12 * 0.8)) }));
                        }}
                      >
                        Apply 20% Off
                      </button>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        style={{ padding: "2px 8px", fontSize: 11 }}
                        onClick={() => {
                          const m = Number(planForm.monthlyPrice || 0);
                          setPlanForm((prev) => ({ ...prev, annualPrice: String(Math.round(m * 10)) }));
                        }}
                      >
                        2 Mo Free
                      </button>
                    </div>
                  </div>
                </div>

                {/* Specs Row: Tokens, Seats, Storage */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div className="sa-form-group">
                    <label>AI Token Quota</label>
                    <input
                      type="text"
                      className="sa-form-input"
                      value={planForm.tokens}
                      onChange={(e) => setPlanForm({ ...planForm, tokens: e.target.value })}
                      placeholder="50,000 / mo"
                    />
                  </div>
                  <div className="sa-form-group">
                    <label>Seats Allocation</label>
                    <input
                      type="text"
                      className="sa-form-input"
                      value={planForm.seats}
                      onChange={(e) => setPlanForm({ ...planForm, seats: e.target.value })}
                      placeholder="Up to 30 seats"
                    />
                  </div>
                  <div className="sa-form-group">
                    <label>Storage Limit</label>
                    <input
                      type="text"
                      className="sa-form-input"
                      value={planForm.storage}
                      onChange={(e) => setPlanForm({ ...planForm, storage: e.target.value })}
                      placeholder="25 GB cloud"
                    />
                  </div>
                </div>

                {/* Highlight Badge & Tier Accent Color */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="sa-form-group">
                    <label>Highlight Badge (Optional)</label>
                    <input
                      type="text"
                      className="sa-form-input"
                      value={planForm.badge}
                      onChange={(e) => setPlanForm({ ...planForm, badge: e.target.value })}
                      placeholder="e.g. Most Popular, Best Value"
                    />
                  </div>
                  <div className="sa-form-group">
                    <label>Tier Brand Color</label>
                    <div className="sa-color-preset-row">
                      {PRESET_TIER_COLORS.map((c) => (
                        <div
                          key={c}
                          className={`sa-color-circle ${planForm.color === c ? "is-selected" : ""}`}
                          style={{ backgroundColor: c }}
                          onClick={() => setPlanForm({ ...planForm, color: c })}
                        />
                      ))}
                      <input
                        type="color"
                        value={planForm.color || "#2563eb"}
                        onChange={(e) => setPlanForm({ ...planForm, color: e.target.value })}
                        style={{ width: 26, height: 26, border: "none", cursor: "pointer", background: "transparent" }}
                        title="Custom hex color"
                      />
                    </div>
                  </div>
                </div>

                {/* Features Selection with Predefined Dropdown & Custom Input */}
                <div className="sa-form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label style={{ margin: 0 }}>Included Plan Features *</label>
                    <span style={{ fontSize: 11, color: "var(--sa-text-muted)" }}>
                      {planForm.features.length} features selected
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <select
                      className="sa-form-select"
                      style={{ fontSize: 12, flex: 1 }}
                      value=""
                      onChange={(e) => {
                        const feat = e.target.value;
                        if (feat && !planForm.features.includes(feat)) {
                          setPlanForm({ ...planForm, features: [...planForm.features, feat] });
                        }
                      }}
                    >
                      <option value="">+ Add feature from platform catalog...</option>
                      {PREDEFINED_PLAN_FEATURES.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>

                    <div style={{ display: "flex", gap: 6 }}>
                      <input
                        type="text"
                        className="sa-form-input"
                        style={{ width: 180, fontSize: 12 }}
                        placeholder="Custom feature..."
                        value={customFeatureInput}
                        onChange={(e) => setCustomFeatureInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && customFeatureInput.trim()) {
                            e.preventDefault();
                            if (!planForm.features.includes(customFeatureInput.trim())) {
                              setPlanForm({ ...planForm, features: [...planForm.features, customFeatureInput.trim()] });
                            }
                            setCustomFeatureInput("");
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={() => {
                          if (customFeatureInput.trim()) {
                            if (!planForm.features.includes(customFeatureInput.trim())) {
                              setPlanForm({ ...planForm, features: [...planForm.features, customFeatureInput.trim()] });
                            }
                            setCustomFeatureInput("");
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Feature Chips Box */}
                  <div className="sa-plan-features-container">
                    {planForm.features.map((feat, idx) => (
                      <span key={idx} className="sa-feature-chip">
                        {feat}
                        <button
                          type="button"
                          className="sa-feature-chip-remove"
                          onClick={() => {
                            setPlanForm({
                              ...planForm,
                              features: planForm.features.filter((_, i) => i !== idx),
                            });
                          }}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {planForm.features.length === 0 && (
                      <span style={{ fontSize: 12, color: "var(--sa-text-muted)", alignSelf: "center" }}>
                        No features added yet. Select from the catalog dropdown above.
                      </span>
                    )}
                  </div>
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
                  {editingPlan ? "Save Plan Changes" : "Create Pricing Tier"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 7. Delete Plan Confirmation Modal (Portaled) */}
      {deletePlanTarget && typeof document !== "undefined" && createPortal(
        <div
          className="sa-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDeletePlanTarget(null);
          }}
        >
          <div className="sa-modal-content" style={{ maxWidth: 440 }}>
            <div className="sa-modal-header">
              <h3 style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                <ShieldAlert size={20} /> Delete Pricing Plan
              </h3>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setDeletePlanTarget(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body">
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--sa-text-secondary)" }}>
                Are you sure you want to permanently delete pricing tier{" "}
                <strong style={{ color: "var(--sa-text-main)" }}>{deletePlanTarget.name}</strong> ({deletePlanTarget.id})?
                Existing {deletePlanTarget.subscribers} subscribed tenants will retain their grandfathered quota.
              </p>
            </div>

            <div className="sa-modal-footer">
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={() => setDeletePlanTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-danger"
                onClick={() => {
                  setPlans((prev) => prev.filter((p) => p.id !== deletePlanTarget.id));
                  notify(`Pricing plan "${deletePlanTarget.name}" deleted.`);
                  setDeletePlanTarget(null);
                }}
              >
                Delete Plan
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 8. Reset Demo Data Confirmation Modal (Portaled) */}
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
                <RotateCcw size={20} /> Reset Pricing Plans Matrix
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
                Are you sure you want to restore all pricing tiers, quota formulas, and subscriber allocations to their initial demo matrix?
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
                  setPlans(INITIAL_PLANS);
                  setSelectedIds(new Set());
                  setSearch("");
                  setStatusFilter("All");
                  setPage(1);
                  notify("Pricing plans matrix restored to initial demo state.");
                  setResetConfirmOpen(false);
                }}
              >
                Reset Demo Plans
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default Plans;
