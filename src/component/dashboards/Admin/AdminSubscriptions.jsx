// src/component/AdminSubscriptions/AdminSubscriptions.jsx

import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Plus,
  BadgeDollarSign,
  Users,
  IndianRupee,
  TrendingUp,
  CircleX,
  CheckCircle2,
  Eye,
  Pencil,
  Pause,
  Play,
  X,
  Check,
  Download,
  RotateCcw,
  Crown,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  List,
  Grid2X2,
  Copy,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";

import {
  initialPlans,
  initialSubscriptions,
} from "./adminSubscriptionsData.js";

import "./AdminSubscriptions.css";

const PLAN_KEY = "teamflow_admin_plans";
const SUBSCRIPTION_KEY = "teamflow_admin_subscriptions";

const WORKSPACE_BRANDS = {
  "Design Studio": {
    logo: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #ec4899, #be185d)",
    type: "palette",
    ownerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80",
  },
  "Development Hub": {
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    type: "code",
    ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
  },
  "Marketing Team": {
    logo: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    type: "spark",
    ownerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
  },
  "Research Lab": {
    logo: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #06b6d4, #0e7490)",
    type: "atom",
    ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80",
  },
  "Startup Team": {
    logo: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    type: "rocket",
    ownerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80",
  },
  "TeamFlow Workspace": {
    logo: "",
    gradient: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%)",
    type: "teamflow",
    ownerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
  },
  "TeamFlow Hub": {
    logo: "",
    gradient: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%)",
    type: "teamflow",
    ownerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
  },
};

function WorkspaceLogo({ workspace = "", logo = "", size = 38 }) {
  const [imgError, setImgError] = useState(false);
  const isTeamFlow =
    workspace?.toLowerCase().includes("teamflow") ||
    workspace?.toLowerCase().includes("flow");

  const brand = WORKSPACE_BRANDS[workspace] || {
    url: isTeamFlow ? "" : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    gradient: isTeamFlow
      ? "linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%)"
      : "linear-gradient(135deg, #6366f1, #4338ca)",
    type: isTeamFlow ? "teamflow" : "default",
  };

  const renderTeamFlowIcon = () => (
    <svg
      viewBox="0 0 28 28"
      width={Math.round(size * 0.7)}
      height={Math.round(size * 0.7)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 8.5H22M14 8.5V20.5M10.5 20.5H17.5"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21" cy="7.5" r="2.5" fill="#38bdf8" />
    </svg>
  );

  if (isTeamFlow || brand.type === "teamflow") {
    return (
      <div
        className="admin-sub-brand-logo-wrap is-vector-brand is-teamflow-brand"
        style={{
          width: size,
          height: size,
          minWidth: size,
          background: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%)",
          boxShadow: "0 3px 10px rgba(67, 97, 238, 0.35)",
        }}
        title={workspace || "TeamFlow AI"}
        aria-label={`${workspace} logo`}
      >
        {renderTeamFlowIcon()}
      </div>
    );
  }

  const logoUrl = logo || brand.logo || brand.url;

  const renderVectorIcon = () => {
    switch (brand.type) {
      case "palette":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.55)} height={Math.round(size * 0.55)} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill="#fff" />
            <circle cx="17.5" cy="10.5" r=".5" fill="#fff" />
            <circle cx="8.5" cy="7.5" r=".5" fill="#fff" />
            <circle cx="6.5" cy="12.5" r=".5" fill="#fff" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2Z" />
          </svg>
        );
      case "code":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.55)} height={Math.round(size * 0.55)} fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        );
      case "spark":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.55)} height={Math.round(size * 0.55)} fill="#fff">
            <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
          </svg>
        );
      case "atom":
      case "orbit":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.55)} height={Math.round(size * 0.55)} fill="none" stroke="#fff" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3.5" fill="#fff" />
            <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" />
            <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)" />
          </svg>
        );
      case "rocket":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.55)} height={Math.round(size * 0.55)} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
        );
      case "layers":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.55)} height={Math.round(size * 0.55)} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.55)} height={Math.round(size * 0.55)} fill="none" stroke="#fff" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <circle cx="12" cy="12" r="4" fill="#fff" />
          </svg>
        );
    }
  };

  if (imgError || !logoUrl) {
    return (
      <div
        className="admin-sub-brand-logo-wrap is-vector-brand"
        style={{
          width: size,
          height: size,
          minWidth: size,
          background: brand.gradient,
        }}
        title={workspace}
        aria-label={`${workspace} logo`}
      >
        {renderVectorIcon()}
      </div>
    );
  }

  return (
    <div
      className="admin-sub-brand-logo-wrap"
      style={{ width: size, height: size, minWidth: size }}
      title={workspace}
      aria-label={`${workspace} logo`}
    >
      <img
        src={logoUrl}
        alt={`${workspace} logo`}
        className="admin-sub-brand-logo-img"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

function OwnerAvatar({ name = "", avatar = "", size = 20 }) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (n) => {
    if (!n) return "U";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0][0].toUpperCase();
  };

  if (imgError || !avatar) {
    return (
      <div
        className="admin-sub-owner-avatar-init"
        style={{
          width: size,
          height: size,
          minWidth: size,
          fontSize: Math.max(9, Math.round(size * 0.42)),
        }}
        title={`Workspace Owner: ${name}`}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div
      className="admin-sub-owner-avatar-wrap"
      style={{ width: size, height: size, minWidth: size }}
      title={`Workspace Owner: ${name}`}
    >
      <img
        src={avatar}
        alt={name}
        className="admin-sub-owner-avatar-img"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

function AdminSubscriptions() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [plans, setPlans] = useState(() => {
    try {
      const saved = localStorage.getItem(PLAN_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.some((p) => p.price >= 1000)) {
          return parsed;
        }
      }
      return initialPlans;
    } catch {
      return initialPlans;
    }
  });

  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const saved = localStorage.getItem(SUBSCRIPTION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => {
            const isTf = item.workspace?.toLowerCase().includes("teamflow");
            const matchingInitial = initialSubscriptions.find((s) => s.id === item.id);
            const price = item.price < 500 && matchingInitial ? matchingInitial.price : item.price;
            return {
              ...item,
              price,
              logo: isTf ? "" : (item.logo || WORKSPACE_BRANDS[item.workspace]?.logo || ""),
              ownerAvatar: isTf
                ? (WORKSPACE_BRANDS[item.workspace]?.ownerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80")
                : (item.ownerAvatar || WORKSPACE_BRANDS[item.workspace]?.ownerAvatar || ""),
            };
          });
        }
      }
      return initialSubscriptions;
    } catch {
      return initialSubscriptions;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [sortKey, setSortKey] = useState("workspace");
  const [sortOrder, setSortOrder] = useState("asc");
  const [plansViewMode, setPlansViewMode] = useState("table"); // 'table' | 'cards'

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (key) => {
    if (sortKey !== key) {
      return <ArrowUpDown size={13} className="admin-sort-icon muted" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp size={13} className="admin-sort-icon active" />
    ) : (
      <ArrowDown size={13} className="admin-sort-icon active" />
    );
  };

  const [activeTab, setActiveTab] = useState("subscriptions");

  const [selectedSubscription, setSelectedSubscription] =
    useState(null);

  const [editingPlan, setEditingPlan] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [subToDelete, setSubToDelete] = useState(null);

  const [copiedId, setCopiedId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (subToDelete) setSubToDelete(null);
        else if (planToDelete) setPlanToDelete(null);
        else if (editingPlan) setEditingPlan(null);
        else if (selectedSubscription) setSelectedSubscription(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [subToDelete, planToDelete, editingPlan, selectedSubscription]);

  const handleCopyId = (id) => {
    try {
      navigator.clipboard?.writeText(id);
    } catch {
      // fallback
    }
    setCopiedId(id);
    setActionNotice(`Copied Subscription ID: ${id}`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2200);
    setTimeout(() => {
      setActionNotice(null);
    }, 3200);
  };

  useEffect(() => {
    localStorage.setItem(PLAN_KEY, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(
      SUBSCRIPTION_KEY,
      JSON.stringify(subscriptions)
    );
  }, [subscriptions]);

  const filteredSubscriptions = useMemo(() => {
    const list = subscriptions.filter((subscription) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        subscription.workspace.toLowerCase().includes(query) ||
        subscription.owner.toLowerCase().includes(query) ||
        subscription.email.toLowerCase().includes(query) ||
        subscription.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        subscription.status === statusFilter;

      const matchesPlan =
        planFilter === "All" ||
        subscription.plan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });

    return [...list].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (valA === undefined || valA === null) valA = "";
      if (valB === undefined || valB === null) valB = "";

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [subscriptions, search, statusFilter, planFilter, sortKey, sortOrder]);

  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "Active"
  ).length;

  const cancelledSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "Cancelled"
  ).length;

  const monthlyRevenue = subscriptions
    .filter((subscription) => subscription.status === "Active")
    .reduce(
      (total, subscription) => total + subscription.price,
      0
    );

  const handleSubscriptionStatus = (id) => {
    setSubscriptions((previous) =>
      previous.map((subscription) => {
        if (subscription.id !== id) {
          return subscription;
        }

        if (subscription.status === "Cancelled") {
          setActionNotice(`Reactivated subscription for "${subscription.workspace}"`);
          setTimeout(() => setActionNotice(null), 3000);
          return {
            ...subscription,
            status: "Active",
            nextBilling: "Nov 28, 2026",
          };
        }

        setActionNotice(`Cancelled subscription for "${subscription.workspace}"`);
        setTimeout(() => setActionNotice(null), 3000);
        return {
          ...subscription,
          status: "Cancelled",
          nextBilling: "—",
        };
      })
    );
  };

  const savePlan = () => {
    if (!editingPlan) return;

    setPlans((previous) => {
      const exists = previous.some((p) => p.id === editingPlan.id);
      if (exists) {
        return previous.map((plan) =>
          plan.id === editingPlan.id ? editingPlan : plan
        );
      }
      return [...previous, editingPlan];
    });

    setEditingPlan(null);
  };

  const resetDemoData = () => {
    localStorage.removeItem(PLAN_KEY);
    localStorage.removeItem(SUBSCRIPTION_KEY);
    setPlans(initialPlans);
    setSubscriptions(initialSubscriptions);
    setSearch("");
    setStatusFilter("All");
    setPlanFilter("All");
  };

  const exportSubscriptions = () => {
    const headers = [
      "Subscription ID",
      "Workspace",
      "Owner",
      "Email",
      "Plan",
      "Price",
      "Billing Cycle",
      "Status",
      "Start Date",
      "Next Billing",
    ];

    const rows = filteredSubscriptions.map((item) => [
      item.id,
      item.workspace,
      item.owner,
      item.email,
      item.plan,
      item.price,
      item.billingCycle,
      item.status,
      item.startDate,
      item.nextBilling,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (cell) =>
              `"${String(cell).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "teamflow-subscriptions.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-subscriptions-shell">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="admin-subscriptions-main">
        {/* TOP NAV */}

        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <div className="admin-subscriptions-content">
          {/* HEADER */}

          <section className="admin-subscriptions-heading">
            <div>

              <h1>Subscription Management</h1>

              <p>
                Manage plans, subscriptions and recurring
                revenue across TeamFlow AI.
              </p>
            </div>

            <div className="admin-subscriptions-heading-actions">
              <button
                className="admin-subscriptions-secondary-btn"
                onClick={exportSubscriptions}
              >
                <Download size={16} />
                Export
              </button>

              <button
                className="admin-subscriptions-primary-btn"
                onClick={() => setActiveTab("plans")}
              >
                <Plus size={16} />
                Manage Plans
              </button>
            </div>
          </section>

          {/* STATS */}

          <section className="admin-subscriptions-stats">
            <StatCard
              icon={Users}
              title="Total Subscriptions"
              value={subscriptions.length}
              description="Across TeamFlow AI"
              color="purple"
            />

            <StatCard
              icon={CheckCircle2}
              title="Active Subscriptions"
              value={activeSubscriptions.length}
              description="Currently active"
              color="green"
            />

            <StatCard
              icon={IndianRupee}
              title="Monthly Revenue"
              value={`₹${monthlyRevenue.toLocaleString("en-IN")}`}
              description="+18% from last month"
              color="blue"
            />

            <StatCard
              icon={CircleX}
              title="Cancelled"
              value={cancelledSubscriptions.length}
              description="Cancelled subscriptions"
              color="red"
            />
          </section>

          {/* TABS */}

          <section className="admin-subscriptions-panel">
            <div className="admin-subscriptions-tabs">
              <button
                className={
                  activeTab === "subscriptions"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("subscriptions")
                }
              >
                Subscriptions
              </button>

              <button
                className={
                  activeTab === "plans" ? "active" : ""
                }
                onClick={() => setActiveTab("plans")}
              >
                Subscription Plans
              </button>
            </div>

            {activeTab === "subscriptions" ? (
              <>
                {/* FILTER BAR */}

                <div className="admin-subscriptions-toolbar">
                  <div className="admin-subscriptions-search">
                    <Search size={17} />

                    <input
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Search workspace, owner, or email..."
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                  >
                    <option value="All">
                      All Status
                    </option>
                    <option value="Active">
                      Active
                    </option>
                    <option value="Past Due">
                      Past Due
                    </option>
                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>

                  <select
                    value={planFilter}
                    onChange={(event) =>
                      setPlanFilter(event.target.value)
                    }
                  >
                    <option value="All">
                      All Plans
                    </option>
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Business">
                      Business
                    </option>
                    <option value="Enterprise">
                      Enterprise
                    </option>
                  </select>

                  <select
                    value={`${sortKey}-${sortOrder}`}
                    onChange={(event) => {
                      const [k, ord] = event.target.value.split("-");
                      setSortKey(k);
                      setSortOrder(ord);
                    }}
                    aria-label="Sort subscriptions"
                  >
                    <option value="workspace-asc">Sort: Workspace (A to Z)</option>
                    <option value="workspace-desc">Sort: Workspace (Z to A)</option>
                    <option value="price-desc">Sort: Price (High to Low)</option>
                    <option value="price-asc">Sort: Price (Low to High)</option>
                    <option value="plan-asc">Sort: Plan</option>
                    <option value="status-asc">Sort: Status</option>
                    <option value="nextBilling-asc">Sort: Next Billing</option>
                  </select>

                  {(search || statusFilter !== "All" || planFilter !== "All") && (
                    <button
                      type="button"
                      className="clear-filters-btn"
                      onClick={() => {
                        setSearch("");
                        setStatusFilter("All");
                        setPlanFilter("All");
                      }}
                    >
                      <X size={13} />
                      Clear Filters
                    </button>
                  )}
                </div>

                {actionNotice && (
                  <div className="admin-subscriptions-toast-notice">
                    <CheckCircle2 size={15} />
                    <span>{actionNotice}</span>
                  </div>
                )}

                <div className="admin-subscriptions-table-info">
                  <span>
                    Showing {filteredSubscriptions.length}{" "}
                    subscriptions
                  </span>

                  <button onClick={resetDemoData}>
                    <RotateCcw size={14} />
                    Reset Demo Data
                  </button>
                </div>

                {/* TABLE */}

                <div className="admin-subscriptions-table-wrapper">
                  <table className="admin-subscriptions-table">
                    <thead>
                      <tr>
                        <th style={{ width: 48, textAlign: "center" }}>#</th>
                        <th className="sortable-th" onClick={() => handleSort("workspace")}>
                          <div className="th-content">
                            <span>WORKSPACE</span>
                            {renderSortIcon("workspace")}
                          </div>
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("plan")}>
                          <div className="th-content">
                            <span>PLAN</span>
                            {renderSortIcon("plan")}
                          </div>
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("price")}>
                          <div className="th-content">
                            <span>PRICE</span>
                            {renderSortIcon("price")}
                          </div>
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("billingCycle")}>
                          <div className="th-content">
                            <span>BILLING</span>
                            {renderSortIcon("billingCycle")}
                          </div>
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("status")}>
                          <div className="th-content">
                            <span>STATUS</span>
                            {renderSortIcon("status")}
                          </div>
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("startDate")}>
                          <div className="th-content">
                            <span>START DATE</span>
                            {renderSortIcon("startDate")}
                          </div>
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("nextBilling")}>
                          <div className="th-content">
                            <span>NEXT BILLING</span>
                            {renderSortIcon("nextBilling")}
                          </div>
                        </th>
                        <th style={{ textAlign: "right", minWidth: 175 }}>ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredSubscriptions.map(
                        (subscription, idx) => (
                          <tr key={subscription.id}>
                            <td style={{ textAlign: "center" }}>
                              <span className="admin-row-num">{idx + 1}</span>
                            </td>
                            <td>
                              <div className="admin-subscriptions-workspace">
                                <WorkspaceLogo
                                  workspace={subscription.workspace}
                                  logo={subscription.logo}
                                  size={40}
                                />

                                <div className="admin-subscriptions-workspace-info">
                                  <strong className="admin-subscriptions-workspace-name">
                                    {subscription.workspace}
                                  </strong>

                                  <div className="admin-subscriptions-owner-row">
                                    <OwnerAvatar
                                      name={subscription.owner}
                                      avatar={
                                        subscription.ownerAvatar ||
                                        WORKSPACE_BRANDS[subscription.workspace]?.ownerAvatar
                                      }
                                      size={18}
                                    />
                                    <span className="admin-subscriptions-owner-name">
                                      {subscription.owner}
                                    </span>
                                    <span className="admin-subscriptions-owner-dot">•</span>
                                    <span className="admin-subscriptions-owner-email">
                                      {subscription.email}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td>
                              <PlanBadge
                                plan={subscription.plan}
                              />
                            </td>

                            <td>
                              <strong className="admin-subscriptions-price">
                                ₹{subscription.price.toLocaleString("en-IN")}
                              </strong>
                            </td>

                            <td>
                              <span className="billing-cycle-tag">{subscription.billingCycle}</span>
                            </td>

                            <td>
                              <StatusBadge
                                status={
                                  subscription.status
                                }
                              />
                            </td>

                            <td>
                              {subscription.startDate}
                            </td>

                            <td>
                              {subscription.status === "Cancelled" || subscription.nextBilling === "—" ? (
                                <button
                                  type="button"
                                  className="next-billing-paused-pill"
                                  title="Subscription paused. Click to reactivate"
                                  onClick={() => handleSubscriptionStatus(subscription.id)}
                                >
                                  <RotateCcw size={11} />
                                  <span>Paused</span>
                                </button>
                              ) : (
                                <span className="next-billing-date-pill">
                                  {subscription.nextBilling}
                                </span>
                              )}
                            </td>

                            <td style={{ textAlign: "right" }}>
                              <div className="table-actions sub-table-actions">
                                <button
                                  type="button"
                                  className="sub-action-pill sub-view-pill"
                                  title="View Details (Modal)"
                                  aria-label="View subscription details"
                                  onClick={() => setSelectedSubscription(subscription)}
                                >
                                  <Eye size={13} />
                                  <span>View</span>
                                </button>

                                <button
                                  type="button"
                                  className={`sub-action-icon sub-copy-icon ${copiedId === subscription.id ? "is-copied" : ""}`}
                                  title={copiedId === subscription.id ? `Copied ${subscription.id}!` : `Copy Sub ID (${subscription.id})`}
                                  aria-label={`Copy Sub ID ${subscription.id}`}
                                  onClick={() => handleCopyId(subscription.id)}
                                >
                                  {copiedId === subscription.id ? <Check size={13} /> : <Copy size={13} />}
                                </button>

                                {subscription.status === "Cancelled" ? (
                                  <button
                                    type="button"
                                    className="sub-action-icon sub-reactivate-icon"
                                    title="Reactivate Subscription"
                                    aria-label="Reactivate Subscription"
                                    onClick={() => handleSubscriptionStatus(subscription.id)}
                                  >
                                    <Play size={13} />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="sub-action-icon sub-cancel-icon"
                                    title="Cancel Subscription"
                                    aria-label="Cancel Subscription"
                                    onClick={() => handleSubscriptionStatus(subscription.id)}
                                  >
                                    <Pause size={13} />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className="sub-action-icon sub-delete-icon"
                                  title="Delete Subscription Record"
                                  aria-label="Delete Subscription"
                                  onClick={() => setSubToDelete(subscription)}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  {filteredSubscriptions.length === 0 && (
                    <div className="admin-subscriptions-empty">
                      <BadgeDollarSign size={42} />

                      <h3>
                        No subscriptions found
                      </h3>

                      <p>
                        Try changing the search or
                        filters.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* PLANS VIEW (TABLE / CARDS) */
              <div className="admin-subscriptions-plans-container">
                <div className="plans-header-bar">
                  <div className="plans-header-info">
                    <h3>Subscription Tier Plans ({plans.length})</h3>
                    <p>Configure pricing models, feature allowances, and subscriber quotas.</p>
                  </div>

                  <div className="plans-header-actions">
                    <button
                      type="button"
                      className="admin-subscriptions-btn-primary"
                      onClick={() =>
                        setEditingPlan({
                          id: `plan-${Date.now()}`,
                          name: "Custom Enterprise",
                          price: 29999,
                          billing: "month",
                          color: "purple",
                          popular: false,
                          subscribers: 0,
                          features: ["Unlimited Workspaces", "Dedicated AI GPU Cluster", "24/7 SLA Support"],
                        })
                      }
                    >
                      <Plus size={16} />
                      Create Plan
                    </button>

                    <div className="view-switch">
                      <button
                        type="button"
                        className={`view-btn ${plansViewMode === "table" ? "active" : ""}`}
                        onClick={() => setPlansViewMode("table")}
                        title="Table view"
                      >
                        <List size={16} />
                      </button>
                      <button
                        type="button"
                        className={`view-btn ${plansViewMode === "cards" ? "active" : ""}`}
                        onClick={() => setPlansViewMode("cards")}
                        title="Cards view"
                      >
                        <Grid2X2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {plansViewMode === "table" ? (
                  <div className="admin-subscriptions-table-wrapper">
                    <table className="admin-subscriptions-table">
                      <thead>
                        <tr>
                          <th style={{ width: 48, textAlign: "center" }}>#</th>
                          <th>PLAN TIER</th>
                          <th>PRICE</th>
                          <th>BILLING</th>
                          <th>SUBSCRIBERS</th>
                          <th>KEY FEATURES</th>
                          <th style={{ textAlign: "right" }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plans.map((plan, idx) => (
                          <tr key={plan.id}>
                            <td style={{ textAlign: "center" }}>
                              <span className="admin-row-num">{idx + 1}</span>
                            </td>
                            <td>
                              <div className="plan-name-cell">
                                <strong className="plan-name-title">{plan.name}</strong>
                                {plan.popular && (
                                  <span className="popular-badge-table">
                                    <Crown size={11} /> Popular
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <strong className="admin-subscriptions-price">₹{plan.price.toLocaleString("en-IN")}</strong>
                            </td>
                            <td>Per {plan.billing}</td>
                            <td>
                              <span className="subscribers-pill">
                                <Users size={13} /> {plan.subscribers}
                              </span>
                            </td>
                            <td>
                              <div className="features-preview-cell">
                                <span>{plan.features.slice(0, 2).join(", ")}</span>
                                {plan.features.length > 2 && (
                                  <small> +{plan.features.length - 2} more</small>
                                )}
                              </div>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div className="table-actions">
                                <button
                                  type="button"
                                  className="action-btn"
                                  title="Edit Plan"
                                  onClick={() =>
                                    setEditingPlan({
                                      ...plan,
                                      features: [...plan.features],
                                    })
                                  }
                                >
                                  <Pencil size={15} />
                                </button>
                                {plans.length > 1 && (
                                  <button
                                    type="button"
                                    className="action-btn delete"
                                    title="Delete Plan"
                                    onClick={() => setPlanToDelete(plan)}
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="admin-subscriptions-plans">
                    {plans.map((plan, idx) => (
                      <article
                        key={plan.id}
                        className={`admin-subscriptions-plan-card ${plan.color}`}
                      >
                        {plan.popular && (
                          <div className="admin-subscriptions-popular">
                            <Crown size={12} />
                            MOST POPULAR
                          </div>
                        )}

                        <div className="admin-subscriptions-plan-top">
                          <div
                            className={`admin-subscriptions-plan-icon ${plan.color}`}
                          >
                            <span className="admin-row-num sm">{idx + 1}</span>
                          </div>

                          <div className="table-actions">
                            <button
                              type="button"
                              className="action-btn"
                              title="Edit Plan"
                              onClick={() =>
                                setEditingPlan({
                                  ...plan,
                                  features: [...plan.features],
                                })
                              }
                            >
                              <Pencil size={15} />
                            </button>
                            {plans.length > 1 && (
                              <button
                                type="button"
                                className="action-btn delete"
                                title="Delete Plan"
                                onClick={() => setPlanToDelete(plan)}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </div>

                        <h3>{plan.name}</h3>

                        <div className="admin-subscriptions-plan-price">
                          <strong>₹{plan.price.toLocaleString("en-IN")}</strong>
                          <span>/ {plan.billing}</span>
                        </div>

                        <div className="admin-subscriptions-subscriber-count">
                          <Users size={14} />
                          {plan.subscribers} subscribers
                        </div>

                        <div className="admin-subscriptions-plan-divider" />

                        <div className="admin-subscriptions-features">
                          {plan.features.map(
                            (feature, index) => (
                              <div key={index}>
                                <Check size={14} />
                                <span>{feature}</span>
                              </div>
                            )
                          )}
                        </div>

                        <button
                          className="admin-subscriptions-edit-plan"
                          onClick={() =>
                            setEditingPlan({
                              ...plan,
                              features: [
                                ...plan.features,
                              ],
                            })
                          }
                        >
                          <Pencil size={14} />
                          Edit Plan
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* DETAILS MODAL */}

      {selectedSubscription && (
        <div className="admin-subscriptions-modal-overlay">
          <div className="admin-subscriptions-modal">
            <div className="admin-subscriptions-modal-header">
              <div>
                <h2>Subscription Details</h2>
                <p>{selectedSubscription.id}</p>
              </div>

              <button
                onClick={() =>
                  setSelectedSubscription(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-subscriptions-modal-body">
              <div className="admin-subscriptions-modal-summary">
                <WorkspaceLogo
                  workspace={selectedSubscription.workspace}
                  logo={selectedSubscription.logo}
                  size={46}
                />

                <span style={{ marginLeft: 6 }}>
                  <small>Workspace & Plan</small>
                  <strong>
                    {selectedSubscription.workspace} • {selectedSubscription.plan}
                  </strong>
                </span>

                <strong>
                  ₹{selectedSubscription.price.toLocaleString("en-IN")}/mo
                </strong>
              </div>

              <DetailRow
                label="Workspace"
                value={
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    <WorkspaceLogo
                      workspace={selectedSubscription.workspace}
                      logo={selectedSubscription.logo}
                      size={28}
                    />
                    <span>{selectedSubscription.workspace}</span>
                  </div>
                }
              />

              <DetailRow
                label="Owner"
                value={
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <OwnerAvatar
                      name={selectedSubscription.owner}
                      avatar={
                        selectedSubscription.ownerAvatar ||
                        WORKSPACE_BRANDS[selectedSubscription.workspace]?.ownerAvatar
                      }
                      size={22}
                    />
                    <span>{selectedSubscription.owner}</span>
                  </div>
                }
              />

              <DetailRow
                label="Email"
                value={selectedSubscription.email}
              />

              <DetailRow
                label="Billing Cycle"
                value={
                  selectedSubscription.billingCycle
                }
              />

              <DetailRow
                label="Status"
                value={selectedSubscription.status}
              />

              <DetailRow
                label="Started"
                value={selectedSubscription.startDate}
              />

              <DetailRow
                label="Next Billing"
                value={
                  selectedSubscription.nextBilling
                }
              />
            </div>

            <div className="admin-subscriptions-modal-footer">
              <button
                className="admin-subscriptions-secondary-btn"
                onClick={() =>
                  setSelectedSubscription(null)
                }
              >
                Close
              </button>

              <button
                className="admin-subscriptions-primary-btn"
                onClick={() => {
                  handleSubscriptionStatus(
                    selectedSubscription.id
                  );
                  setSelectedSubscription(null);
                }}
              >
                {selectedSubscription.status ===
                "Cancelled"
                  ? "Reactivate Subscription"
                  : "Cancel Subscription"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PLAN MODAL */}

      {editingPlan && (
        <div className="admin-subscriptions-modal-overlay">
          <div className="admin-subscriptions-modal">
            <div className="admin-subscriptions-modal-header">
              <div>
                <h2>Edit {editingPlan.name} Plan</h2>
                <p>
                  Update subscription plan settings.
                </p>
              </div>

              <button
                onClick={() => setEditingPlan(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-subscriptions-form">
              <label>
                Plan Name
                <input
                  value={editingPlan.name}
                  onChange={(event) =>
                    setEditingPlan({
                      ...editingPlan,
                      name: event.target.value,
                    })
                  }
                />
              </label>

              <div className="admin-subscriptions-form-grid">
                <label>
                  Monthly Price
                  <input
                    type="number"
                    min="0"
                    value={editingPlan.price}
                    onChange={(event) =>
                      setEditingPlan({
                        ...editingPlan,
                        price: Number(
                          event.target.value
                        ),
                      })
                    }
                  />
                </label>

                <label>
                  Subscribers
                  <input
                    type="number"
                    min="0"
                    value={editingPlan.subscribers}
                    onChange={(event) =>
                      setEditingPlan({
                        ...editingPlan,
                        subscribers: Number(
                          event.target.value
                        ),
                      })
                    }
                  />
                </label>
              </div>

              <div className="admin-subscriptions-form-grid">
                <label>
                  Storage
                  <input
                    value={editingPlan.storage}
                    onChange={(event) =>
                      setEditingPlan({
                        ...editingPlan,
                        storage: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  AI Credits
                  <input
                    type="number"
                    value={editingPlan.aiCredits}
                    onChange={(event) =>
                      setEditingPlan({
                        ...editingPlan,
                        aiCredits: Number(
                          event.target.value
                        ),
                      })
                    }
                  />
                </label>
              </div>

              <label>
                Status
                <select
                  value={editingPlan.status}
                  onChange={(event) =>
                    setEditingPlan({
                      ...editingPlan,
                      status: event.target.value,
                    })
                  }
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
            </div>

            <div className="admin-subscriptions-modal-footer">
              <button
                className="admin-subscriptions-secondary-btn"
                onClick={() => setEditingPlan(null)}
              >
                Cancel
              </button>

              <button
                className="admin-subscriptions-primary-btn"
                onClick={savePlan}
              >
                <Check size={15} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE PLAN CONFIRMATION MODAL */}
      {planToDelete && (
        <div
          className="admin-subscriptions-modal-overlay delete-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPlanToDelete(null);
          }}
        >
          <div className="admin-subscriptions-modal delete-plan-modal" role="dialog" aria-modal="true" aria-labelledby="delete-plan-title">
            <div className="delete-modal-header">
              <div className="delete-modal-icon-badge">
                <AlertTriangle size={22} />
              </div>
              <div className="delete-modal-header-text">
                <h2 id="delete-plan-title">Delete Subscription Plan</h2>
                <p>Are you sure you want to delete this pricing tier? This action cannot be undone.</p>
              </div>
              <button
                type="button"
                className="delete-modal-close-btn"
                onClick={() => setPlanToDelete(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="delete-modal-body">
              <div className="delete-plan-preview-box">
                <div className="preview-top">
                  <div>
                    <span className="preview-label">Plan Tier</span>
                    <strong className="preview-name">{planToDelete.name}</strong>
                  </div>
                  <div className="preview-price-wrap">
                    <span className="preview-price">₹{planToDelete.price.toLocaleString("en-IN")}</span>
                    <span className="preview-billing">/{planToDelete.billing}</span>
                  </div>
                </div>

                <div className="preview-meta">
                  <div className="preview-subs">
                    <Users size={14} />
                    <span><strong>{planToDelete.subscribers}</strong> subscribers currently enrolled</span>
                  </div>
                </div>

                {planToDelete.features && planToDelete.features.length > 0 && (
                  <div className="preview-features">
                    <span className="preview-features-title">Features included:</span>
                    <div className="preview-features-tags">
                      {planToDelete.features.slice(0, 3).map((feat, i) => (
                        <span key={i} className="preview-feature-tag">
                          <Check size={11} /> {feat}
                        </span>
                      ))}
                      {planToDelete.features.length > 3 && (
                        <span className="preview-feature-tag more">+{planToDelete.features.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {planToDelete.subscribers > 0 && (
                <div className="delete-modal-alert">
                  <AlertCircle size={18} />
                  <div>
                    <strong>Active Subscribers Notice</strong>
                    <p>There are {planToDelete.subscribers} customer workspace(s) on this plan. They will need to be transitioned to a different tier before billing cycles renew.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="delete-modal-footer">
              <button
                type="button"
                className="admin-subscriptions-secondary-btn"
                onClick={() => setPlanToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-subscriptions-danger-btn"
                onClick={() => {
                  setPlans((prev) => prev.filter((p) => p.id !== planToDelete.id));
                  setPlanToDelete(null);
                }}
              >
                <Trash2 size={16} />
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE SUBSCRIPTION CONFIRMATION MODAL */}
      {subToDelete && (
        <div
          className="admin-subscriptions-modal-overlay delete-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSubToDelete(null);
          }}
        >
          <div className="admin-subscriptions-modal delete-plan-modal" role="dialog" aria-modal="true" aria-labelledby="delete-sub-title">
            <div className="delete-modal-header">
              <div className="delete-modal-icon-badge">
                <AlertTriangle size={22} />
              </div>
              <div className="delete-modal-header-text">
                <h2 id="delete-sub-title">Delete Workspace Subscription</h2>
                <p>Are you sure you want to remove this active subscription record?</p>
              </div>
              <button
                type="button"
                className="delete-modal-close-btn"
                onClick={() => setSubToDelete(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="delete-modal-body">
              <div className="delete-plan-preview-box">
                <div className="preview-top">
                  <div>
                    <span className="preview-label">Workspace Record</span>
                    <strong className="preview-name">{subToDelete.workspace}</strong>
                  </div>
                  <div className="preview-price-wrap">
                    <span className="preview-price">₹{subToDelete.price.toLocaleString("en-IN")}</span>
                    <span className="preview-billing">/{subToDelete.billingCycle}</span>
                  </div>
                </div>

                <div className="preview-meta">
                  <div className="preview-subs">
                    <Users size={14} />
                    <span>Owner: <strong>{subToDelete.owner}</strong> ({subToDelete.email})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="delete-modal-footer">
              <button
                type="button"
                className="admin-subscriptions-secondary-btn"
                onClick={() => setSubToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-subscriptions-danger-btn"
                onClick={() => {
                  setSubscriptions((prev) => prev.filter((s) => s.id !== subToDelete.id));
                  setSubToDelete(null);
                }}
              >
                <Trash2 size={16} />
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  description,
  color,
}) {
  return (
    <article className="admin-subscriptions-stat">
      <div
        className={`admin-subscriptions-stat-icon ${color}`}
      >
        <Icon size={21} />
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>

      <TrendingUp
        size={18}
        className="admin-subscriptions-stat-trend"
      />
    </article>
  );
}

function StatusBadge({ status }) {
  const className = status
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span
      className={`admin-subscriptions-status ${className}`}
    >
      {status}
    </span>
  );
}

function PlanBadge({ plan }) {
  return (
    <span
      className={`admin-subscriptions-plan-badge ${plan.toLowerCase()}`}
    >
      {plan}
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="admin-subscriptions-detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default AdminSubscriptions;