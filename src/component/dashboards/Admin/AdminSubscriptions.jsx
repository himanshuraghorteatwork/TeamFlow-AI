// src/component/dashboards/Admin/AdminSubscriptions.jsx

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
  SlidersHorizontal,
  Activity,
  ShieldCheck,
  Sparkles,
  Layers,
  HardDrive,
  Cpu,
  Clock,
  Filter,
  CheckCircle,
  Info,
  Calendar,
  Settings,
  Zap,
  Building2,
  RefreshCw,
  FileText,
  ChevronRight,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";

import {
  initialPlans,
  initialSubscriptions,
  initialSubscriptionActivities,
} from "./adminSubscriptionsData.js";

import "./AdminSubscriptions.css";

const PLAN_KEY = "teamflow_admin_plans";
const SUBSCRIPTION_KEY = "teamflow_admin_subscriptions";
const ACTIVITY_KEY = "teamflow_admin_subscription_activities";

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
    gradient: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 55%, #7209b7 100%)",
    type: "teamflow",
    ownerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
  },
  "TeamFlow Hub": {
    logo: "",
    gradient: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 55%, #7209b7 100%)",
    type: "teamflow",
    ownerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
  },
};

export function WorkspaceLogo({ workspace = "", logo = "", size = 38 }) {
  const [imgError, setImgError] = useState(false);
  const isTeamFlow =
    workspace?.toLowerCase().includes("teamflow") ||
    workspace?.toLowerCase().includes("flow") ||
    workspace?.toLowerCase() === "main workspace";

  const brand = WORKSPACE_BRANDS[workspace] || {
    url: isTeamFlow ? "" : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    gradient: isTeamFlow
      ? "linear-gradient(135deg, #4361ee 0%, #3a0ca3 55%, #7209b7 100%)"
      : "linear-gradient(135deg, #6366f1, #4338ca)",
    type: isTeamFlow ? "teamflow" : "default",
  };

  const renderTeamFlowIcon = () => (
    <svg
      viewBox="0 0 28 28"
      width={Math.round(size * 0.72)}
      height={Math.round(size * 0.72)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 9H21.5M14 9V20M10.5 20H17.5"
        stroke="#ffffff"
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
          borderRadius: Math.round(size * 0.28),
          background: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 55%, #7209b7 100%)",
          boxShadow: "0 3px 12px rgba(67, 97, 238, 0.4)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
        title={workspace || "TeamFlow AI Workspace"}
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
          borderRadius: Math.round(size * 0.28),
          background: brand.gradient,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
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
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: Math.round(size * 0.28),
        overflow: "hidden",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
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

export function OwnerAvatar({ name = "", avatar = "", size = 20 }) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (n) => {
    if (!n) return "U";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0][0].toUpperCase();
  };

  if (avatar && !imgError) {
    return (
      <img
        src={avatar}
        alt={name}
        className="admin-sub-owner-avatar"
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className="admin-sub-owner-avatar-fallback"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        fontSize: Math.max(9, Math.round(size * 0.45)),
      }}
    >
      {getInitials(name)}
    </div>
  );
}

const formatSubDetailKey = (key) => {
  const keyMap = {
    plan: "Target Subscription Plan",
    changes: "Quota & Feature Changes",
    costImpact: "Cost Impact / Delta",
    billingCycle: "Billing Cycle",
    nextBillingDate: "Next Billing Date",
    fromTier: "Previous Plan Tier",
    toTier: "Upgraded Plan Tier",
    amount: "Subscription Amount",
    amountDue: "Outstanding Balance",
    gracePeriodRemaining: "Grace Period Remaining",
    invoiceId: "Invoice Reference",
    taxRate: "Applicable Tax",
    seatsBefore: "Seats Before Change",
    seatsAfter: "Updated Seat Count",
    unitPricePerSeat: "Unit Seat Price",
    addon: "Provisioned Add-on",
    sla: "Service Level Agreement (SLA)",
    storageQuota: "Storage Quota",
    storage: "Storage Quota",
    monthlyAdjustment: "Monthly Price Delta",
    reason: "Adjustment Reason",
    accessUntil: "Access Expiry Date",
    format: "Export Format",
    recordsCount: "Exported Records Count",
    status: "Subscription Status",
    subscriptionId: "Subscription Reference",
    workspace: "Target Workspace",
    price: "Subscription Price",
    aiCredits: "AI Credits Allocation",
    members: "Member Capacity",
  };
  if (keyMap[key]) return keyMap[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const formatSubDetailValue = (key, val) => {
  if (Array.isArray(val)) {
    return (
      <div className="sub-param-pills-list">
        {val.map((item, idx) => (
          <span key={idx} className="sub-param-pill-tag">
            {item}
          </span>
        ))}
      </div>
    );
  }
  if (typeof val === "boolean") return val ? "Enabled" : "Disabled";
  if (typeof val === "number") return val.toLocaleString("en-IN");
  const s = String(val);
  if (key === "costImpact" || key === "monthlyAdjustment") {
    const isPlus = s.startsWith("+");
    return <span className={`sub-cost-badge ${isPlus ? "plus" : "neutral"}`}>{s}</span>;
  }
  if (key === "plan" || key === "fromTier" || key === "toTier") {
    return <span className="sub-plan-badge">{s}</span>;
  }
  if (key === "invoiceId" || key === "subscriptionId") {
    return <span className="sub-invoice-tag">{s}</span>;
  }
  if (key === "status") {
    return <span className="sub-status-tag">{s}</span>;
  }
  return s;
};

export function AdminSubscriptions() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const saved = localStorage.getItem(SUBSCRIPTION_KEY);
      return saved ? JSON.parse(saved) : initialSubscriptions;
    } catch {
      return initialSubscriptions;
    }
  });

  const [plans, setPlans] = useState(() => {
    try {
      const saved = localStorage.getItem(PLAN_KEY);
      return saved ? JSON.parse(saved) : initialPlans;
    } catch {
      return initialPlans;
    }
  });

  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem(ACTIVITY_KEY);
      return saved ? JSON.parse(saved) : initialSubscriptionActivities;
    } catch {
      return initialSubscriptionActivities;
    }
  });

  // Active Tab: "subscriptions" | "plans" | "activity"
  const [activeTab, setActiveTab] = useState("subscriptions");

  // Filter & Search States for Subscriptions Tab
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [sortKey, setSortKey] = useState("workspace");
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination State for Subscriptions
  const [subPage, setSubPage] = useState(1);
  const [subPageSize, setSubPageSize] = useState(8);

  // Plans View Mode: "table" | "cards"
  const [plansViewMode, setPlansViewMode] = useState("table");

  // Activity Logs Filters & Pagination
  const [activitySearch, setActivitySearch] = useState("");
  const [activityCategory, setActivityCategory] = useState("All");
  const [activitySeverity, setActivitySeverity] = useState("All");
  const [activitySort, setActivitySort] = useState("newest");
  const [activityPage, setActivityPage] = useState(1);
  const [activityPageSize, setActivityPageSize] = useState(10);

  // Modals & Drawers
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [customizingPlan, setCustomizingPlan] = useState(null);
  const [isNewCustomPlan, setIsNewCustomPlan] = useState(false);
  const [isManagePlansOpen, setIsManagePlansOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [subToDelete, setSubToDelete] = useState(null);

  const [copiedId, setCopiedId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(PLAN_KEY, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
  }, [activities]);

  // Helper to add activity log entry
  const logActivity = (action, category, severity, details = {}, workspace = "TeamFlow Workspace") => {
    const newLog = {
      id: `SUB-ACT-${Date.now().toString().slice(-4)}`,
      workspace,
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
    setActivities((prev) => [newLog, ...prev]);
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (subToDelete) setSubToDelete(null);
        else if (planToDelete) setPlanToDelete(null);
        else if (customizingPlan) setCustomizingPlan(null);
        else if (isManagePlansOpen) setIsManagePlansOpen(false);
        else if (selectedSubscription) setSelectedSubscription(null);
        else if (selectedActivity) setSelectedActivity(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [subToDelete, planToDelete, customizingPlan, isManagePlansOpen, selectedSubscription, selectedActivity]);

  const handleCopyId = (id) => {
    try {
      navigator.clipboard?.writeText(id);
    } catch {}
    setCopiedId(id);
    setActionNotice(`Copied Subscription ID: ${id}`);
    setTimeout(() => setCopiedId(null), 2000);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Subscriptions Table Sorting
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
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
        statusFilter === "All" || subscription.status === statusFilter;
      const matchesPlan =
        planFilter === "All" || subscription.plan === planFilter;

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
    (s) => s.status === "Active"
  );

  const cancelledSubscriptions = subscriptions.filter(
    (s) => s.status === "Cancelled"
  );

  const monthlyRevenue = subscriptions
    .filter((s) => s.status === "Active")
    .reduce((total, s) => total + s.price, 0);

  // Filtered Activity Logs
  const filteredActivities = useMemo(() => {
    return activities
      .filter((item) => {
        const q = activitySearch.toLowerCase().trim();
        const matchesQuery =
          !q ||
          item.action.toLowerCase().includes(q) ||
          item.workspace.toLowerCase().includes(q) ||
          item.user.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q);

        const matchesCat =
          activityCategory === "All" || item.category === activityCategory;
        const matchesSev =
          activitySeverity === "All" || item.severity === activitySeverity;

        return matchesQuery && matchesCat && matchesSev;
      })
      .sort((a, b) => {
        if (activitySort === "newest") {
          return new Date(b.fullDate || 0) - new Date(a.fullDate || 0);
        }
        return new Date(a.fullDate || 0) - new Date(b.fullDate || 0);
      });
  }, [activities, activitySearch, activityCategory, activitySeverity, activitySort]);

  // Paginated Subscriptions
  const totalSubPages = Math.max(1, Math.ceil(filteredSubscriptions.length / subPageSize));
  const paginatedSubscriptions = useMemo(() => {
    const start = (subPage - 1) * subPageSize;
    return filteredSubscriptions.slice(start, start + subPageSize);
  }, [filteredSubscriptions, subPage, subPageSize]);

  useEffect(() => {
    setSubPage(1);
  }, [search, statusFilter, planFilter, sortKey, sortOrder, subPageSize]);

  // Paginated Activity Logs
  const totalActivityPages = Math.max(1, Math.ceil(filteredActivities.length / activityPageSize));
  const paginatedActivities = useMemo(() => {
    const start = (activityPage - 1) * activityPageSize;
    return filteredActivities.slice(start, start + activityPageSize);
  }, [filteredActivities, activityPage, activityPageSize]);

  useEffect(() => {
    setActivityPage(1);
  }, [activitySearch, activityCategory, activitySeverity, activitySort, activityPageSize]);

  // Subscription Status Toggle (Reactivate / Cancel)
  const handleSubscriptionStatus = (id) => {
    setSubscriptions((previous) =>
      previous.map((sub) => {
        if (sub.id !== id) return sub;

        if (sub.status === "Cancelled") {
          const updated = {
            ...sub,
            status: "Active",
            nextBilling: "Nov 28, 2026",
          };
          setActionNotice(`Reactivated subscription for "${sub.workspace}"`);
          logActivity(
            `Reactivated subscription for ${sub.workspace}`,
            "Status Change",
            "success",
            { status: "Active", plan: sub.plan },
            sub.workspace
          );
          setTimeout(() => setActionNotice(null), 3000);
          return updated;
        }

        const updated = {
          ...sub,
          status: "Cancelled",
          nextBilling: "—",
        };
        setActionNotice(`Cancelled subscription for "${sub.workspace}"`);
        logActivity(
          `Cancelled auto-renewal for ${sub.workspace} (${sub.plan})`,
          "Status Change",
          "warning",
          { status: "Cancelled", plan: sub.plan },
          sub.workspace
        );
        setTimeout(() => setActionNotice(null), 3000);
        return updated;
      })
    );
  };

  // Open Customize Plan Modal
  const handleOpenCustomizePlan = (plan, isNew = false) => {
    setIsNewCustomPlan(isNew);
    if (isNew) {
      setCustomizingPlan({
        id: `plan-custom-${Date.now()}`,
        name: "Enterprise Custom",
        baseTier: "Enterprise",
        workspace: "TeamFlow Workspace",
        price: 27499,
        basePrice: 24999,
        billing: "month",
        billingCycle: "Monthly",
        workspaces: "Unlimited",
        members: 50,
        storage: "1.5 TB",
        aiCredits: 125000,
        color: "purple",
        popular: false,
        isCustom: true,
        status: "Active",
        features: [
          "Unlimited workspaces",
          "Up to 50 dedicated members",
          "1.5 TB cloud storage",
          "125,000 AI credits",
          "Priority 24/7 SLA Support",
          "Dedicated AI GPU Cluster",
          "Custom Domain & SAML SSO",
          "1-Year Audit Log Retention",
        ],
        addons: {
          support247: true,
          gpuCluster: true,
          sso: true,
          auditRetention: true,
        },
      });
    } else {
      setCustomizingPlan({
        ...plan,
        baseTier: plan.name,
        workspace: "TeamFlow Workspace",
        isCustom: !plan.isSystem,
        billingCycle: plan.billing === "year" ? "Annual" : "Monthly",
        features: [...plan.features],
        addons: {
          support247: plan.features?.some((f) => f.toLowerCase().includes("support") || f.toLowerCase().includes("sla")),
          gpuCluster: plan.features?.some((f) => f.toLowerCase().includes("gpu") || f.toLowerCase().includes("cluster")),
          sso: plan.features?.some((f) => f.toLowerCase().includes("sso") || f.toLowerCase().includes("security")),
          auditRetention: plan.features?.some((f) => f.toLowerCase().includes("audit") || f.toLowerCase().includes("analytics")),
        },
      });
    }
  };

  // Save Customized Plan
  const handleSaveCustomizedPlan = () => {
    if (!customizingPlan) return;

    // Recalculate features based on inputs
    const finalFeatures = [
      typeof customizingPlan.workspaces === "number"
        ? `${customizingPlan.workspaces} Workspaces`
        : "Unlimited workspaces",
      typeof customizingPlan.members === "number"
        ? `Up to ${customizingPlan.members} members`
        : "Unlimited members",
      `${customizingPlan.storage} storage`,
      `${typeof customizingPlan.aiCredits === "number" ? customizingPlan.aiCredits.toLocaleString("en-IN") : customizingPlan.aiCredits} AI credits`,
    ];

    if (customizingPlan.addons?.support247) finalFeatures.push("Dedicated 24/7 SLA Support");
    if (customizingPlan.addons?.gpuCluster) finalFeatures.push("Dedicated AI GPU Cluster");
    if (customizingPlan.addons?.sso) finalFeatures.push("Custom Domain & SAML SSO");
    if (customizingPlan.addons?.auditRetention) finalFeatures.push("1-Year Audit Log Retention");

    const updatedPlan = {
      ...customizingPlan,
      features: finalFeatures,
      isCustom: true,
      lastModified: new Date().toLocaleDateString(),
    };

    setPlans((prev) => {
      const exists = prev.some((p) => p.id === updatedPlan.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p));
      }
      return [...prev, updatedPlan];
    });

    // Also update matching workspace subscription price & plan if applicable
    if (customizingPlan.workspace) {
      setSubscriptions((prev) =>
        prev.map((sub) => {
          if (sub.workspace === customizingPlan.workspace) {
            return {
              ...sub,
              plan: updatedPlan.name,
              price: updatedPlan.price,
            };
          }
          return sub;
        })
      );
    }

    logActivity(
      `Customized ${updatedPlan.name} for ${customizingPlan.workspace || "TeamFlow Workspace"} (${updatedPlan.storage}, ${updatedPlan.members || "custom"} members)`,
      "Plan Customization",
      "success",
      {
        plan: updatedPlan.name,
        storage: updatedPlan.storage,
        aiCredits: updatedPlan.aiCredits,
        price: updatedPlan.price,
      },
      customizingPlan.workspace || "TeamFlow Workspace"
    );

    setActionNotice(`Successfully customized plan "${updatedPlan.name}"!`);
    setTimeout(() => setActionNotice(null), 3200);
    setCustomizingPlan(null);
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.removeItem(PLAN_KEY);
    localStorage.removeItem(SUBSCRIPTION_KEY);
    localStorage.removeItem(ACTIVITY_KEY);
    setPlans(initialPlans);
    setSubscriptions(initialSubscriptions);
    setActivities(initialSubscriptionActivities);
    setSearch("");
    setStatusFilter("All");
    setPlanFilter("All");
    setActivitySearch("");
    setActivityCategory("All");
    setActivitySeverity("All");
    setSubPage(1);
    setActivityPage(1);
    setActionNotice("Reset demo data to default configuration");
    setTimeout(() => setActionNotice(null), 2500);
  };

  // Export Data to CSV
  const exportSubscriptions = () => {
    if (activeTab === "activity") {
      const headers = ["ID", "Workspace", "Event", "Category", "Severity", "Actor", "Role", "Timestamp"];
      const rows = filteredActivities.map((a) => [
        `"${a.id}"`,
        `"${a.workspace}"`,
        `"${a.action.replace(/"/g, '""')}"`,
        `"${a.category}"`,
        `"${a.severity}"`,
        `"${a.user}"`,
        `"${a.role}"`,
        `"${a.fullDate}"`,
      ]);
      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `subscription-activity-logs-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setActionNotice("Exported subscription activity logs to CSV");
      setTimeout(() => setActionNotice(null), 3000);
      return;
    }

    const headers = [
      "ID",
      "Workspace",
      "Owner",
      "Email",
      "Plan",
      "Price (INR)",
      "Billing Cycle",
      "Status",
      "Start Date",
      "Next Billing",
    ];
    const rows = filteredSubscriptions.map((sub) => [
      `"${sub.id}"`,
      `"${sub.workspace}"`,
      `"${sub.owner}"`,
      `"${sub.email}"`,
      `"${sub.plan}"`,
      sub.price,
      `"${sub.billingCycle}"`,
      `"${sub.status}"`,
      `"${sub.startDate}"`,
      `"${sub.nextBilling}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `teamflow-subscriptions-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setActionNotice("Exported subscriptions data to CSV");
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="admin-subscriptions-shell">
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <main className="admin-subscriptions-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <div className="admin-subscriptions-content">
          {/* HEADER */}
          <section className="admin-subscriptions-heading">
            <div>
              <div className="admin-subscriptions-badge-tag">
                <ShieldCheck size={14} /> Organization Admin Billing
              </div>
              <h1>Subscription Management</h1>
              <p>
                Manage workspace subscriptions, customize tier resource quotas, and audit billing activities.
              </p>
            </div>

            <div className="admin-subscriptions-heading-actions">
              <button
                type="button"
                className="admin-subscriptions-secondary-btn"
                onClick={exportSubscriptions}
                title="Export current view data to CSV"
              >
                <Download size={16} />
                Export
              </button>

              <button
                type="button"
                className="admin-subscriptions-primary-btn"
                onClick={() => setIsManagePlansOpen(true)}
                title="Manage workspace subscription and plans"
              >
                <SlidersHorizontal size={16} />
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

          {/* TOAST NOTICE */}
          {actionNotice && (
            <div className="admin-subscriptions-toast-notice">
              <CheckCircle2 size={16} />
              <span>{actionNotice}</span>
            </div>
          )}

          {/* MAIN PANEL WITH 3 TABS */}
          <section className="admin-subscriptions-panel">
            <div className="admin-subscriptions-tabs">
              <button
                type="button"
                className={activeTab === "subscriptions" ? "active" : ""}
                onClick={() => setActiveTab("subscriptions")}
              >
                <Users size={16} />
                <span>Subscriptions</span>
                <span className="admin-tab-count">{subscriptions.length}</span>
              </button>

              <button
                type="button"
                className={activeTab === "plans" ? "active" : ""}
                onClick={() => setActiveTab("plans")}
              >
                <Sparkles size={16} />
                <span>Subscription Plans</span>
                <span className="admin-tab-count">{plans.length}</span>
              </button>

              <button
                type="button"
                className={activeTab === "activity" ? "active" : ""}
                onClick={() => setActiveTab("activity")}
              >
                <Activity size={16} />
                <span>Activity Logs</span>
                <span className="admin-tab-count live">{activities.length}</span>
              </button>
            </div>

            {/* TAB 1: SUBSCRIPTIONS */}
            {activeTab === "subscriptions" && (
              <>
                {/* TOOLBAR */}
                <div className="admin-subscriptions-toolbar">
                  <div className="admin-subscriptions-search">
                    <Search size={17} />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search workspace, owner, or email..."
                    />
                  </div>

                  <div className="admin-subscriptions-filters">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter by Status"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Past Due">Past Due</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    aria-label="Filter by Plan"
                  >
                    <option value="All">All Plans</option>
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Business">Business</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>

                  <select
                    value={`${sortKey}-${sortOrder}`}
                    onChange={(e) => {
                      const [k, ord] = e.target.value.split("-");
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
                      <X size={13} /> Clear Filters
                    </button>
                  )}
                  </div>
                </div>

                <div className="admin-subscriptions-table-info">
                  <span>
                    Showing{" "}
                    <strong>
                      {filteredSubscriptions.length === 0
                        ? 0
                        : `${(subPage - 1) * subPageSize + 1} - ${Math.min(
                            subPage * subPageSize,
                            filteredSubscriptions.length
                          )}`}
                    </strong>{" "}
                    of {filteredSubscriptions.length} subscriptions
                  </span>
                  <button type="button" onClick={resetDemoData}>
                    <RotateCcw size={14} /> Reset Demo Data
                  </button>
                </div>

                {/* SUBSCRIPTIONS TABLE */}
                <div className="admin-subscriptions-table-wrapper">
                  <table className="admin-subscriptions-table">
                    <thead>
                      <tr>
                        <th style={{ width: 44, textAlign: "center" }}>#</th>
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
                        <th style={{ textAlign: "right", minWidth: 180 }}>ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedSubscriptions.map((subscription, idx) => (
                        <tr key={subscription.id}>
                          <td style={{ textAlign: "center" }}>
                            <span className="admin-row-num">
                              {(subPage - 1) * subPageSize + idx + 1}
                            </span>
                          </td>

                          <td>
                            <div className="admin-subscriptions-workspace">
                              <WorkspaceLogo
                                workspace={subscription.workspace}
                                logo={subscription.logo}
                                size={40}
                              />
                              <div className="admin-subscriptions-workspace-info">
                                <div className="admin-ws-name-row">
                                  <strong className="admin-subscriptions-workspace-name">
                                    {subscription.workspace}
                                  </strong>
                                  {subscription.workspace.includes("TeamFlow") && (
                                    <span className="teamflow-primary-badge">Current</span>
                                  )}
                                </div>
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
                            <PlanBadge plan={subscription.plan} />
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
                            <StatusBadge status={subscription.status} />
                          </td>

                          <td>{subscription.startDate}</td>

                          <td>{subscription.nextBilling}</td>

                          <td style={{ textAlign: "right" }}>
                            <div className="table-actions">
                              <button
                                type="button"
                                className="action-btn btn-view view"
                                title="View Subscription Details"
                                onClick={() => setSelectedSubscription(subscription)}
                              >
                                <Eye size={15} />
                              </button>

                              <button
                                type="button"
                                className="action-btn btn-customize customize"
                                title="Customize Plan for Workspace"
                                onClick={() => {
                                  const matchingPlan = plans.find(
                                    (p) => p.name.toLowerCase() === subscription.plan.toLowerCase()
                                  ) || plans[0];
                                  handleOpenCustomizePlan({
                                    ...matchingPlan,
                                    workspace: subscription.workspace,
                                  });
                                }}
                              >
                                <SlidersHorizontal size={15} />
                              </button>

                              <button
                                type="button"
                                className={`action-btn btn-toggle ${
                                  subscription.status === "Cancelled"
                                    ? "is-resume reactivate"
                                    : "is-pause pause"
                                }`}
                                title={
                                  subscription.status === "Cancelled"
                                    ? "Reactivate Subscription"
                                    : "Pause Subscription"
                                }
                                onClick={() => handleSubscriptionStatus(subscription.id)}
                              >
                                {subscription.status === "Cancelled" ? (
                                  <Play size={14} />
                                ) : (
                                  <Pause size={14} />
                                )}
                              </button>

                              <button
                                type="button"
                                className="action-btn btn-delete delete"
                                title="Delete Subscription"
                                onClick={() => setSubToDelete(subscription)}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredSubscriptions.length === 0 && (
                        <tr>
                          <td colSpan={9} className="admin-empty-table-cell">
                            <div className="admin-subscriptions-empty">
                              <Building2 size={38} className="empty-icon" />
                              <h4>No subscriptions found</h4>
                              <p>Try adjusting your search query or status filter.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* SUBSCRIPTIONS PAGINATION BAR */}
                {filteredSubscriptions.length > 0 && (
                  <div className="ws-pagination-bar bp-pagination-bar admin-subscriptions-pagination-bar">
                    <div className="ws-pagination-info bp-pagination-info">
                      <span>
                        Showing {(subPage - 1) * subPageSize + 1} to{" "}
                        {Math.min(subPage * subPageSize, filteredSubscriptions.length)} of {filteredSubscriptions.length} subscriptions
                      </span>
                      <div className="ws-page-size-wrap bp-page-size-wrap">
                        <span>Rows per page:</span>
                        <select
                          value={subPageSize}
                          onChange={(e) => {
                            setSubPageSize(Number(e.target.value));
                            setSubPage(1);
                          }}
                          aria-label="Rows per page"
                        >
                          <option value={5}>5</option>
                          <option value={8}>8</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                        </select>
                      </div>
                    </div>

                    <div className="ws-pagination-controls bp-pagination-controls">
                      <button
                        type="button"
                        className="ws-page-nav-btn bp-page-nav-btn"
                        disabled={subPage <= 1}
                        onClick={() => setSubPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </button>

                      <div className="ws-page-pills bp-page-pills">
                        {Array.from({ length: totalSubPages }, (_, i) => i + 1)
                          .filter((p) => p === 1 || p === totalSubPages || Math.abs(p - subPage) <= 1)
                          .map((p, i, arr) => (
                            <React.Fragment key={p}>
                              {i > 0 && p - arr[i - 1] > 1 && (
                                <span className="ws-page-ellipsis bp-page-ellipsis">…</span>
                              )}
                              <button
                                type="button"
                                className={`ws-page-num-pill bp-page-num-pill ${
                                  subPage === p ? "active" : ""
                                }`}
                                onClick={() => setSubPage(p)}
                              >
                                {p}
                              </button>
                            </React.Fragment>
                          ))}
                      </div>

                      <button
                        type="button"
                        className="ws-page-nav-btn bp-page-nav-btn"
                        disabled={subPage >= totalSubPages}
                        onClick={() => setSubPage((p) => Math.min(totalSubPages, p + 1))}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* TAB 2: SUBSCRIPTION PLANS (CUSTOMIZE PLAN) */}
            {activeTab === "plans" && (
              <div className="admin-subscriptions-plans-container">
                <div className="plans-header-bar">
                  <div className="plans-header-info">
                    <div className="admin-plan-admin-badge">
                      <ShieldCheck size={13} />
                      <span>Admin Workspace Scope</span>
                    </div>
                    <h3>Subscription Tier Plans ({plans.length})</h3>
                    <p>
                      As Organization Admin, customize feature allowances, member quotas, and resource limits for your workspace.
                    </p>
                  </div>

                  <div className="plans-header-actions">
                    <button
                      type="button"
                      className="admin-subscriptions-btn-primary"
                      onClick={() => handleOpenCustomizePlan(null, true)}
                      title="Create a custom tailored workspace plan"
                    >
                      <Plus size={16} />
                      Create Custom Plan
                    </button>

                    <button
                      type="button"
                      className="admin-subscriptions-secondary-btn"
                      onClick={() => setIsManagePlansOpen(true)}
                      title="Manage current workspace subscription"
                    >
                      <Settings size={15} />
                      Manage Plan
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
                          <th style={{ width: 44, textAlign: "center" }}>#</th>
                          <th>PLAN TIER</th>
                          <th>PRICE</th>
                          <th>BILLING</th>
                          <th>SUBSCRIBERS</th>
                          <th>KEY FEATURES</th>
                          <th style={{ textAlign: "right" }}>ADMIN ACTIONS</th>
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
                                {plan.isSystem ? (
                                  <span className="system-tier-tag" title="Standard platform tier created by SuperAdmin">
                                    <ShieldCheck size={10} /> Core Tier
                                  </span>
                                ) : (
                                  <span className="custom-tier-tag" title="Custom tailored workspace plan">
                                    <Sparkles size={10} /> Custom
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <strong className="admin-subscriptions-price">
                                ₹{plan.price.toLocaleString("en-IN")}
                              </strong>
                            </td>
                            <td>Per {plan.billing}</td>
                            <td>
                              <span className="subscribers-pill">
                                <Users size={13} /> {plan.subscribers}
                              </span>
                            </td>
                            <td>
                              <div className="features-preview-cell">
                                <span>{plan.features?.slice(0, 2).join(", ")}</span>
                                {plan.features?.length > 2 && (
                                  <small> +{plan.features.length - 2} more</small>
                                )}
                              </div>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div className="table-actions">
                                <button
                                  type="button"
                                  className="admin-customize-plan-action-btn"
                                  title="Customize this plan tier"
                                  onClick={() => handleOpenCustomizePlan(plan, false)}
                                >
                                  <SlidersHorizontal size={14} />
                                  <span>Customize Plan</span>
                                </button>

                                {/* Only custom non-system plans can be removed by an Admin */}
                                {!plan.isSystem && (
                                  <button
                                    type="button"
                                    className="action-btn delete"
                                    title="Delete Custom Plan"
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
                        className={`admin-subscriptions-plan-card ${plan.color || "blue"} ${
                          plan.isCustom ? "is-custom-plan-card" : ""
                        }`}
                      >
                        {plan.popular && (
                          <div className="admin-subscriptions-popular">
                            <Crown size={12} />
                            MOST POPULAR
                          </div>
                        )}

                        <div className="admin-subscriptions-plan-top">
                          <div className={`admin-subscriptions-plan-icon ${plan.color || "blue"}`}>
                            <span className="admin-row-num sm">{idx + 1}</span>
                          </div>

                          <div className="admin-plan-card-badges">
                            {plan.isSystem ? (
                              <span className="system-tier-tag">
                                <ShieldCheck size={11} /> Core
                              </span>
                            ) : (
                              <span className="custom-tier-tag">
                                <Sparkles size={11} /> Custom
                              </span>
                            )}
                            {!plan.isSystem && (
                              <button
                                type="button"
                                className="action-btn delete sm"
                                title="Delete Custom Plan"
                                onClick={() => setPlanToDelete(plan)}
                              >
                                <Trash2 size={14} />
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
                          {plan.subscribers} active subscribers
                        </div>

                        <div className="admin-subscriptions-plan-divider" />

                        <div className="admin-subscriptions-features">
                          {plan.features?.map((feature, index) => (
                            <div key={index}>
                              <Check size={14} />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Admin Customize Plan Button */}
                        <button
                          type="button"
                          className="admin-subscriptions-customize-plan-btn"
                          onClick={() => handleOpenCustomizePlan(plan, false)}
                        >
                          <SlidersHorizontal size={14} />
                          Customize Plan
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ACTIVITY LOGS */}
            {activeTab === "activity" && (
              <div className="admin-subscriptions-activity-container">
                {/* ACTIVITY STATS */}
                <div className="activity-stats-row">
                  <div className="activity-stat-card">
                    <div className="activity-stat-icon purple">
                      <Activity size={18} />
                    </div>
                    <div>
                      <span>Total Events</span>
                      <strong>{activities.length}</strong>
                    </div>
                  </div>

                  <div className="activity-stat-card">
                    <div className="activity-stat-icon blue">
                      <SlidersHorizontal size={18} />
                    </div>
                    <div>
                      <span>Plan Customizations</span>
                      <strong>
                        {activities.filter((a) => a.category === "Plan Customization").length}
                      </strong>
                    </div>
                  </div>

                  <div className="activity-stat-card">
                    <div className="activity-stat-icon green">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <span>Status Changes</span>
                      <strong>
                        {activities.filter((a) => a.category === "Status Change").length}
                      </strong>
                    </div>
                  </div>

                  <div className="activity-stat-card">
                    <div className="activity-stat-icon amber">
                      <BadgeDollarSign size={18} />
                    </div>
                    <div>
                      <span>Billing & Invoices</span>
                      <strong>
                        {activities.filter((a) => a.category === "Billing").length}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* ACTIVITY TOOLBAR */}
                <div className="admin-subscriptions-toolbar">
                  <div className="admin-subscriptions-search">
                    <Search size={17} />
                    <input
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                      placeholder="Search activity by event, workspace, actor, or ID..."
                    />
                  </div>

                  <div className="admin-subscriptions-filters">
                  <select
                    value={activityCategory}
                    onChange={(e) => setActivityCategory(e.target.value)}
                    aria-label="Filter by Event Category"
                  >
                    <option value="All">All Categories</option>
                    <option value="Plan Customization">Plan Customizations</option>
                    <option value="Status Change">Status Changes</option>
                    <option value="Billing">Billing & Invoices</option>
                    <option value="Seat Allocation">Seat Allocations</option>
                  </select>

                  <select
                    value={activitySeverity}
                    onChange={(e) => setActivitySeverity(e.target.value)}
                    aria-label="Filter by Severity"
                  >
                    <option value="All">All Statuses</option>
                    <option value="success">Success</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                  </select>

                  <select
                    value={activitySort}
                    onChange={(e) => setActivitySort(e.target.value)}
                    aria-label="Sort activity logs"
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="oldest">Sort: Oldest First</option>
                  </select>

                  {(activitySearch || activityCategory !== "All" || activitySeverity !== "All") && (
                    <button
                      type="button"
                      className="clear-filters-btn"
                      onClick={() => {
                        setActivitySearch("");
                        setActivityCategory("All");
                        setActivitySeverity("All");
                      }}
                    >
                      <X size={13} /> Clear
                    </button>
                  )}
                  </div>
                </div>

                <div className="admin-subscriptions-table-info">
                  <span>
                    Showing{" "}
                    <strong>
                      {filteredActivities.length === 0
                        ? 0
                        : `${(activityPage - 1) * activityPageSize + 1} - ${Math.min(
                            activityPage * activityPageSize,
                            filteredActivities.length
                          )}`}
                    </strong>{" "}
                    of {filteredActivities.length} subscription activity records
                  </span>
                  <button type="button" onClick={exportSubscriptions}>
                    <Download size={14} /> Export Activity CSV
                  </button>
                </div>

                {/* ACTIVITY TABLE */}
                <div className="admin-subscriptions-table-wrapper">
                  <table className="admin-subscriptions-table activity-table">
                    <thead>
                      <tr>
                        <th style={{ width: 44, textAlign: "center" }}>#</th>
                        <th style={{ width: 140 }}>TIMESTAMP</th>
                        <th>WORKSPACE</th>
                        <th>ACTIVITY / EVENT</th>
                        <th>PERFORMED BY</th>
                        <th>CATEGORY</th>
                        <th>STATUS</th>
                        <th style={{ textAlign: "right", width: 90 }}>DETAILS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedActivities.map((act, idx) => (
                        <tr key={act.id}>
                          <td style={{ textAlign: "center" }}>
                            <span className="admin-row-num">
                              {(activityPage - 1) * activityPageSize + idx + 1}
                            </span>
                          </td>

                          <td>
                            <div className="activity-time-cell">
                              <strong>{act.time}</strong>
                              <small>{act.fullDate?.slice(0, 10)}</small>
                            </div>
                          </td>

                          <td>
                            <div className="admin-subscriptions-workspace sm">
                              <WorkspaceLogo workspace={act.workspace} size={30} />
                              <strong className="admin-subscriptions-workspace-name">
                                {act.workspace}
                              </strong>
                            </div>
                          </td>

                          <td>
                            <div className="activity-action-cell">
                              <span>{act.action}</span>
                              {act.details?.plan && (
                                <span className="activity-plan-badge">{act.details.plan}</span>
                              )}
                            </div>
                          </td>

                          <td>
                            <div className="activity-actor-cell">
                              <OwnerAvatar name={act.user} avatar={act.avatar} size={20} />
                              <div>
                                <strong>{act.user}</strong>
                                <small>{act.role}</small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className={`activity-category-pill ${act.category.toLowerCase().replace(/\s+/g, "-")}`}>
                              {act.category}
                            </span>
                          </td>

                          <td>
                            <span className={`activity-severity-pill ${act.severity}`}>
                              {act.severity === "success" && <CheckCircle2 size={11} />}
                              {act.severity === "info" && <Info size={11} />}
                              {act.severity === "warning" && <AlertTriangle size={11} />}
                              {act.severity}
                            </span>
                          </td>

                          <td style={{ textAlign: "right" }}>
                            <button
                              type="button"
                              className="action-btn view"
                              title="View Log Details"
                              onClick={() => setSelectedActivity(act)}
                            >
                              <Eye size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredActivities.length === 0 && (
                        <tr>
                          <td colSpan={8} className="admin-empty-table-cell">
                            <div className="admin-subscriptions-empty">
                              <Activity size={38} className="empty-icon" />
                              <h4>No activity records match your filter</h4>
                              <p>Try resetting filters or changing the search keyword.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* ACTIVITY LOGS PAGINATION BAR */}
                {filteredActivities.length > 0 && (
                  <div className="ws-pagination-bar bp-pagination-bar admin-subscriptions-pagination-bar">
                    <div className="ws-pagination-info bp-pagination-info">
                      <span>
                        Showing {(activityPage - 1) * activityPageSize + 1} to{" "}
                        {Math.min(activityPage * activityPageSize, filteredActivities.length)} of {filteredActivities.length} logs
                      </span>
                      <div className="ws-page-size-wrap bp-page-size-wrap">
                        <span>Logs per page:</span>
                        <select
                          value={activityPageSize}
                          onChange={(e) => {
                            setActivityPageSize(Number(e.target.value));
                            setActivityPage(1);
                          }}
                          aria-label="Logs per page"
                        >
                          <option value={5}>5</option>
                          <option value={8}>8</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                        </select>
                      </div>
                    </div>

                    <div className="ws-pagination-controls bp-pagination-controls">
                      <button
                        type="button"
                        className="ws-page-nav-btn bp-page-nav-btn"
                        disabled={activityPage <= 1}
                        onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </button>

                      <div className="ws-page-pills bp-page-pills">
                        {Array.from({ length: totalActivityPages }, (_, i) => i + 1)
                          .filter((p) => p === 1 || p === totalActivityPages || Math.abs(p - activityPage) <= 1)
                          .map((p, i, arr) => (
                            <React.Fragment key={p}>
                              {i > 0 && p - arr[i - 1] > 1 && (
                                <span className="ws-page-ellipsis bp-page-ellipsis">…</span>
                              )}
                              <button
                                type="button"
                                className={`ws-page-num-pill bp-page-num-pill ${
                                  activityPage === p ? "active" : ""
                                }`}
                                onClick={() => setActivityPage(p)}
                              >
                                {p}
                              </button>
                            </React.Fragment>
                          ))}
                      </div>

                      <button
                        type="button"
                        className="ws-page-nav-btn bp-page-nav-btn"
                        disabled={activityPage >= totalActivityPages}
                        onClick={() => setActivityPage((p) => Math.min(totalActivityPages, p + 1))}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* MODAL 1: CUSTOMIZE PLAN / CREATE CUSTOM PLAN */}
      {customizingPlan && (
        <div
          className="admin-subscriptions-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCustomizingPlan(null);
          }}
        >
          <div className="admin-subscriptions-modal admin-customize-plan-modal">
            <div className="admin-subscriptions-modal-header">
              <div className="modal-header-icon-wrap">
                <div className="modal-icon-badge">
                  <SlidersHorizontal size={20} />
                </div>
                <div>
                  <h2>
                    {isNewCustomPlan
                      ? "Create Custom Workspace Plan"
                      : `Customize ${customizingPlan.name} Plan`}
                  </h2>
                  <p>
                    As Organization Admin, tailor feature quotas, member seats, storage, and add-ons for your workspace.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setCustomizingPlan(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-subscriptions-modal-body">
              {/* ADMIN SCOPE NOTICE */}
              <div className="admin-scope-notice-banner">
                <ShieldCheck size={18} className="notice-icon" />
                <div>
                  <strong>Admin Customization Scope</strong>
                  <p>
                    Customizing this plan configures tailored resources for your target workspace. System base tiers remain intact.
                  </p>
                </div>
              </div>

              <div className="admin-subscriptions-form">
                {/* ROW 1: PLAN NAME & WORKSPACE */}
                <div className="admin-subscriptions-form-grid">
                  <label>
                    Plan Display Name
                    <input
                      value={customizingPlan.name}
                      onChange={(e) =>
                        setCustomizingPlan({ ...customizingPlan, name: e.target.value })
                      }
                      placeholder="e.g. Enterprise Custom"
                    />
                  </label>

                  <label>
                    Target Workspace
                    <select
                      value={customizingPlan.workspace || "TeamFlow Workspace"}
                      onChange={(e) =>
                        setCustomizingPlan({ ...customizingPlan, workspace: e.target.value })
                      }
                    >
                      <option value="TeamFlow Workspace">TeamFlow Workspace (Current)</option>
                      <option value="Marketing Team">Marketing Team</option>
                      <option value="Design Studio">Design Studio</option>
                      <option value="Development Hub">Development Hub</option>
                      <option value="Research Lab">Research Lab</option>
                      <option value="Startup Team">Startup Team</option>
                    </select>
                  </label>
                </div>

                {/* ROW 2: BASE TIER & BILLING CYCLE */}
                <div className="admin-subscriptions-form-grid">
                  <label>
                    Base Tier Reference
                    <select
                      value={customizingPlan.baseTier || "Enterprise"}
                      onChange={(e) => {
                        const tier = e.target.value;
                        const baseMap = {
                          Free: { price: 0, storage: "1 GB", credits: 100, members: 5 },
                          Pro: { price: 2499, storage: "50 GB", credits: 5000, members: 25 },
                          Business: { price: 7999, storage: "250 GB", credits: 20000, members: 100 },
                          Enterprise: { price: 24999, storage: "1 TB", credits: 100000, members: "Unlimited" },
                        };
                        const config = baseMap[tier] || baseMap.Enterprise;
                        setCustomizingPlan({
                          ...customizingPlan,
                          baseTier: tier,
                          price: config.price,
                          storage: config.storage,
                          aiCredits: config.credits,
                          members: config.members,
                        });
                      }}
                    >
                      <option value="Pro">Pro (Starting ₹2,499/mo)</option>
                      <option value="Business">Business (Starting ₹7,999/mo)</option>
                      <option value="Enterprise">Enterprise (Starting ₹24,999/mo)</option>
                    </select>
                  </label>

                  <label>
                    Billing Cycle
                    <select
                      value={customizingPlan.billingCycle || "Monthly"}
                      onChange={(e) =>
                        setCustomizingPlan({ ...customizingPlan, billingCycle: e.target.value })
                      }
                    >
                      <option value="Monthly">Monthly Billing</option>
                      <option value="Annual">Annual Billing (20% Discount)</option>
                    </select>
                  </label>
                </div>

                {/* RESOURCE QUOTAS SECTION */}
                <div className="form-section-title">
                  <HardDrive size={15} /> Resource Quotas & Limits
                </div>

                <div className="admin-subscriptions-form-grid">
                  <label>
                    Member Seats
                    <input
                      type="text"
                      value={customizingPlan.members ?? 50}
                      onChange={(e) =>
                        setCustomizingPlan({
                          ...customizingPlan,
                          members: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value),
                        })
                      }
                      placeholder="e.g. 50 or Unlimited"
                    />
                  </label>

                  <label>
                    Workspaces Allowance
                    <input
                      type="text"
                      value={customizingPlan.workspaces ?? "Unlimited"}
                      onChange={(e) =>
                        setCustomizingPlan({
                          ...customizingPlan,
                          workspaces: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value),
                        })
                      }
                      placeholder="e.g. 20 or Unlimited"
                    />
                  </label>
                </div>

                <div className="admin-subscriptions-form-grid">
                  <label>
                    Cloud Storage
                    <select
                      value={customizingPlan.storage || "1 TB"}
                      onChange={(e) =>
                        setCustomizingPlan({ ...customizingPlan, storage: e.target.value })
                      }
                    >
                      <option value="50 GB">50 GB Storage</option>
                      <option value="100 GB">100 GB Storage</option>
                      <option value="250 GB">250 GB Storage</option>
                      <option value="500 GB">500 GB Storage</option>
                      <option value="1 TB">1 TB High-Speed Storage</option>
                      <option value="2 TB">2 TB Dedicated Storage</option>
                    </select>
                  </label>

                  <label>
                    Monthly AI Credits
                    <select
                      value={customizingPlan.aiCredits || 100000}
                      onChange={(e) =>
                        setCustomizingPlan({
                          ...customizingPlan,
                          aiCredits: Number(e.target.value),
                        })
                      }
                    >
                      <option value={5000}>5,000 Credits</option>
                      <option value={20000}>20,000 Credits</option>
                      <option value={50000}>50,000 Credits</option>
                      <option value={100000}>100,000 Credits</option>
                      <option value={250000}>250,000 Enterprise Credits</option>
                    </select>
                  </label>
                </div>

                {/* FEATURE ADD-ONS */}
                <div className="form-section-title">
                  <Zap size={15} /> Enterprise Add-ons & SLA Options
                </div>

                <div className="custom-addons-list">
                  <label className="custom-addon-checkbox-row">
                    <input
                      type="checkbox"
                      checked={!!customizingPlan.addons?.support247}
                      onChange={(e) =>
                        setCustomizingPlan({
                          ...customizingPlan,
                          addons: { ...customizingPlan.addons, support247: e.target.checked },
                        })
                      }
                    />
                    <div className="addon-text">
                      <strong>Dedicated 24/7 SLA Priority Support</strong>
                      <span>Direct Slack/Teams channel with 15-minute response SLA.</span>
                    </div>
                  </label>

                  <label className="custom-addon-checkbox-row">
                    <input
                      type="checkbox"
                      checked={!!customizingPlan.addons?.gpuCluster}
                      onChange={(e) =>
                        setCustomizingPlan({
                          ...customizingPlan,
                          addons: { ...customizingPlan.addons, gpuCluster: e.target.checked },
                        })
                      }
                    />
                    <div className="addon-text">
                      <strong>Dedicated AI GPU Cluster</strong>
                      <span>Low latency dedicated inference cluster for high-volume workflows.</span>
                    </div>
                  </label>

                  <label className="custom-addon-checkbox-row">
                    <input
                      type="checkbox"
                      checked={!!customizingPlan.addons?.sso}
                      onChange={(e) =>
                        setCustomizingPlan({
                          ...customizingPlan,
                          addons: { ...customizingPlan.addons, sso: e.target.checked },
                        })
                      }
                    />
                    <div className="addon-text">
                      <strong>Custom Domain & SAML / Okta SSO</strong>
                      <span>Single sign-on enterprise compliance integration.</span>
                    </div>
                  </label>

                  <label className="custom-addon-checkbox-row">
                    <input
                      type="checkbox"
                      checked={!!customizingPlan.addons?.auditRetention}
                      onChange={(e) =>
                        setCustomizingPlan({
                          ...customizingPlan,
                          addons: { ...customizingPlan.addons, auditRetention: e.target.checked },
                        })
                      }
                    />
                    <div className="addon-text">
                      <strong>1-Year Audit & Security Activity Retention</strong>
                      <span>Extended tamper-proof logging for compliance and SOC2 requirements.</span>
                    </div>
                  </label>
                </div>

                {/* DYNAMIC PRICING ESTIMATE CARD */}
                <div className="pricing-preview-estimate-card">
                  <div className="preview-estimate-header">
                    <div>
                      <span className="estimate-label">Total Customized Pricing</span>
                      <strong className="estimate-price">
                        ₹
                        {customizingPlan.billingCycle === "Annual"
                          ? Math.round(customizingPlan.price * 0.8).toLocaleString("en-IN")
                          : customizingPlan.price.toLocaleString("en-IN")}
                        <span className="estimate-cycle">
                          / {customizingPlan.billingCycle === "Annual" ? "month (billed annually)" : "month"}
                        </span>
                      </strong>
                    </div>

                    <div className="estimate-price-input-wrap">
                      <label>
                        Custom Monthly Override (₹)
                        <input
                          type="number"
                          min="0"
                          value={customizingPlan.price}
                          onChange={(e) =>
                            setCustomizingPlan({
                              ...customizingPlan,
                              price: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-subscriptions-modal-footer">
              <button
                type="button"
                className="admin-subscriptions-secondary-btn"
                onClick={() => setCustomizingPlan(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-subscriptions-primary-btn"
                onClick={handleSaveCustomizedPlan}
              >
                <Check size={16} />
                Save & Apply Customization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MANAGE PLANS & WORKSPACE SUBSCRIPTION */}
      {isManagePlansOpen && (
        <div
          className="admin-subscriptions-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsManagePlansOpen(false);
          }}
        >
          <div className="admin-subscriptions-modal admin-manage-plans-modal">
            <div className="admin-subscriptions-modal-header">
              <div className="modal-header-icon-wrap">
                <div className="modal-icon-badge purple">
                  <Settings size={20} />
                </div>
                <div>
                  <h2>Manage Workspace Subscription & Plans</h2>
                  <p>Overview of active subscription tier, allocated resources, and plan actions.</p>
                </div>
              </div>

              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setIsManagePlansOpen(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-subscriptions-modal-body">
              {/* CURRENT ACTIVE SUBSCRIPTION CARD */}
              <div className="current-sub-overview-card">
                <div className="sub-overview-top">
                  <div className="sub-overview-brand">
                    <WorkspaceLogo workspace="TeamFlow Workspace" size={44} />
                    <div>
                      <div className="sub-badge-row">
                        <h4>TeamFlow Workspace</h4>
                        <span className="active-badge">Active</span>
                      </div>
                      <span className="sub-owner-text">Owner: Amit Sharma • amit@teamflow.ai</span>
                    </div>
                  </div>

                  <div className="sub-price-block">
                    <strong>₹24,999</strong>
                    <small>/ month</small>
                  </div>
                </div>

                <div className="sub-metrics-grid">
                  <div className="sub-metric-item">
                    <span className="metric-label">Allocated Tier</span>
                    <strong className="metric-val">Enterprise</strong>
                  </div>
                  <div className="sub-metric-item">
                    <span className="metric-label">Storage Used</span>
                    <strong className="metric-val">72 GB of 1 TB</strong>
                    <div className="metric-bar">
                      <div className="metric-bar-fill" style={{ width: "7.2%" }} />
                    </div>
                  </div>
                  <div className="sub-metric-item">
                    <span className="metric-label">Member Seats</span>
                    <strong className="metric-val">24 Active Seats</strong>
                    <div className="metric-bar">
                      <div className="metric-bar-fill" style={{ width: "24%" }} />
                    </div>
                  </div>
                  <div className="sub-metric-item">
                    <span className="metric-label">Next Renewal</span>
                    <strong className="metric-val">Nov 15, 2026</strong>
                  </div>
                </div>
              </div>

              {/* QUICK ACTIONS FOR ADMIN */}
              <div className="manage-quick-actions-section">
                <h4>Admin Plan Actions</h4>

                <div className="quick-actions-grid">
                  <div
                    className="quick-action-card"
                    onClick={() => {
                      setIsManagePlansOpen(false);
                      const entPlan = plans.find((p) => p.name === "Enterprise") || plans[0];
                      handleOpenCustomizePlan(entPlan, false);
                    }}
                  >
                    <div className="quick-icon-wrap blue">
                      <SlidersHorizontal size={18} />
                    </div>
                    <div>
                      <strong>Customize Active Plan</strong>
                      <p>Adjust storage, AI credits packs, or add-ons for TeamFlow Workspace.</p>
                    </div>
                    <ChevronRight size={16} className="chevron" />
                  </div>

                  <div
                    className="quick-action-card"
                    onClick={() => {
                      setIsManagePlansOpen(false);
                      setActiveTab("plans");
                    }}
                  >
                    <div className="quick-icon-wrap purple">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <strong>Browse & Switch Tier</strong>
                      <p>View all Pro, Business, and Enterprise plans with comparison.</p>
                    </div>
                    <ChevronRight size={16} className="chevron" />
                  </div>

                  <div
                    className="quick-action-card"
                    onClick={() => {
                      setIsManagePlansOpen(false);
                      setActiveTab("activity");
                    }}
                  >
                    <div className="quick-icon-wrap green">
                      <Activity size={18} />
                    </div>
                    <div>
                      <strong>View Activity & Audit Logs</strong>
                      <p>Review full history of plan changes, seat updates, and invoices.</p>
                    </div>
                    <ChevronRight size={16} className="chevron" />
                  </div>

                  <div
                    className="quick-action-card"
                    onClick={() => {
                      setIsManagePlansOpen(false);
                      handleOpenCustomizePlan(null, true);
                    }}
                  >
                    <div className="quick-icon-wrap amber">
                      <Plus size={18} />
                    </div>
                    <div>
                      <strong>Create Custom Plan</strong>
                      <p>Build a completely custom plan tier for a specific workspace.</p>
                    </div>
                    <ChevronRight size={16} className="chevron" />
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-subscriptions-modal-footer">
              <button
                type="button"
                className="admin-subscriptions-secondary-btn"
                onClick={() => setIsManagePlansOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SUBSCRIPTION DETAILS MODAL */}
      {selectedSubscription && (
        <div
          className="admin-subscriptions-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedSubscription(null);
          }}
        >
          <div className="admin-subscriptions-modal">
            <div className="admin-subscriptions-modal-header">
              <div>
                <h2>Subscription Details</h2>
                <p>Record ID: {selectedSubscription.id}</p>
              </div>

              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setSelectedSubscription(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-subscriptions-modal-body">
              <div className="admin-subscriptions-modal-summary">
                <WorkspaceLogo
                  workspace={selectedSubscription.workspace}
                  logo={selectedSubscription.logo}
                  size={46}
                />
                <div style={{ marginLeft: 8, flex: 1 }}>
                  <small style={{ color: "#64748b", textTransform: "uppercase", fontSize: 11 }}>Workspace & Tier</small>
                  <strong style={{ display: "block", fontSize: 16 }}>
                    {selectedSubscription.workspace} • {selectedSubscription.plan}
                  </strong>
                </div>
                <strong>₹{selectedSubscription.price.toLocaleString("en-IN")}/mo</strong>
              </div>

              <DetailRow
                label="Workspace"
                value={
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    <WorkspaceLogo workspace={selectedSubscription.workspace} logo={selectedSubscription.logo} size={26} />
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
                      size={20}
                    />
                    <span>{selectedSubscription.owner}</span>
                  </div>
                }
              />

              <DetailRow label="Billing Email" value={selectedSubscription.email} />
              <DetailRow label="Billing Cycle" value={selectedSubscription.billingCycle} />
              <DetailRow
                label="Status"
                value={<StatusBadge status={selectedSubscription.status} />}
              />
              <DetailRow label="Started Date" value={selectedSubscription.startDate} />
              <DetailRow label="Next Billing Date" value={selectedSubscription.nextBilling} />
            </div>

            <div className="admin-subscriptions-modal-footer">
              <button
                type="button"
                className="admin-subscriptions-secondary-btn"
                onClick={() => setSelectedSubscription(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="admin-subscriptions-danger-btn"
                style={{ marginLeft: "auto" }}
                onClick={() => {
                  const target = selectedSubscription;
                  setSelectedSubscription(null);
                  setSubToDelete(target);
                }}
              >
                <Trash2 size={15} />
                Delete Subscription
              </button>

              <button
                type="button"
                className="admin-subscriptions-primary-btn"
                onClick={() => {
                  handleSubscriptionStatus(selectedSubscription.id);
                  setSelectedSubscription(null);
                }}
              >
                {selectedSubscription.status === "Cancelled"
                  ? "Reactivate Subscription"
                  : "Pause Subscription"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ACTIVITY LOG DETAILS MODAL */}
      {selectedActivity && (
        <div
          className="admin-subscriptions-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedActivity(null);
          }}
        >
          <div className="admin-subscriptions-modal activity-detail-modal">
            <div className="admin-subscriptions-modal-header">
              <div className="modal-header-icon-wrap">
                <div className="modal-icon-badge">
                  <Activity size={20} />
                </div>
                <div>
                  <h2>Subscription Activity Audit</h2>
                  <p>
                    Event Reference: <span className="sub-audit-ref">{selectedActivity.id}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setSelectedActivity(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-subscriptions-modal-body">
              <div className="activity-detail-summary-card">
                <WorkspaceLogo workspace={selectedActivity.workspace} size={42} />
                <div style={{ flex: 1 }}>
                  <h4>{selectedActivity.action}</h4>
                  <p>
                    Target Workspace: <strong>{selectedActivity.workspace}</strong>
                  </p>
                </div>
                <span className={`activity-severity-pill ${selectedActivity.severity}`}>
                  {selectedActivity.severity}
                </span>
              </div>

              <div className="activity-detail-rows-card">
                <DetailRow
                  label="Timestamp"
                  value={`${selectedActivity.fullDate} (${selectedActivity.time})`}
                />
                <DetailRow
                  label="Event Category"
                  value={<span className="sub-cat-pill">{selectedActivity.category}</span>}
                />
                <DetailRow
                  label="Triggered By"
                  value={
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <OwnerAvatar
                        name={selectedActivity.user}
                        avatar={selectedActivity.avatar}
                        size={20}
                      />
                      <span>
                        {selectedActivity.user} ({selectedActivity.role})
                      </span>
                    </div>
                  }
                />
                <DetailRow
                  label="Origin IP"
                  value={<code className="sub-ip-code">{selectedActivity.ip}</code>}
                />
              </div>

              {selectedActivity.details && Object.keys(selectedActivity.details).length > 0 && (
                <div className="sub-act-params-wrap">
                  <div className="sub-params-header">
                    <div className="sub-params-header-title">
                      <SlidersHorizontal size={13} />
                      <span>Audit Parameters & Details</span>
                    </div>
                    <span className="sub-params-count-badge">
                      {Object.keys(selectedActivity.details).length} parameters
                    </span>
                  </div>

                  <div className="sub-params-grid">
                    {Object.entries(selectedActivity.details).map(([k, v]) => {
                      const isLong =
                        String(v).length > 35 ||
                        k === "changes" ||
                        k === "reason" ||
                        k === "addon";
                      return (
                        <div
                          key={k}
                          className={`sub-param-card ${isLong ? "full-width" : ""}`}
                        >
                          <span className="sub-param-key">{formatSubDetailKey(k)}</span>
                          <div className="sub-param-val">{formatSubDetailValue(k, v)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="admin-subscriptions-modal-footer">
              <button
                type="button"
                className="admin-subscriptions-secondary-btn"
                onClick={() => setSelectedActivity(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: DELETE CUSTOM PLAN CONFIRMATION (ONLY FOR CUSTOM PLANS) */}
      {planToDelete && (
        <div
          className="admin-subscriptions-modal-overlay delete-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPlanToDelete(null);
          }}
        >
          <div className="admin-subscriptions-modal delete-plan-modal">
            <div className="delete-modal-header">
              <div className="delete-modal-icon-badge">
                <AlertTriangle size={22} />
              </div>
              <div className="delete-modal-header-text">
                <h2>Delete Custom Plan</h2>
                <p>Are you sure you want to remove this custom plan configuration?</p>
              </div>
              <button
                type="button"
                className="delete-modal-close-btn"
                onClick={() => setPlanToDelete(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="delete-modal-body">
              <div className="delete-plan-preview-box">
                <div className="preview-top">
                  <div>
                    <span className="preview-label">Custom Tier</span>
                    <strong className="preview-name">{planToDelete.name}</strong>
                  </div>
                  <div className="preview-price-wrap">
                    <span className="preview-price">₹{planToDelete.price?.toLocaleString("en-IN")}</span>
                    <span className="preview-billing">/{planToDelete.billing}</span>
                  </div>
                </div>
              </div>
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
                  logActivity(
                    `Deleted custom plan "${planToDelete.name}"`,
                    "Plan Customization",
                    `Removed tier ${planToDelete.id} from available subscription tiers`
                  );
                  setPlanToDelete(null);
                  showToast(`Plan "${planToDelete.name}" removed.`);
                }}
              >
                <Trash2 size={16} /> Delete Custom Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: DELETE SUBSCRIPTION CONFIRMATION */}
      {subToDelete && (
        <div
          className="admin-subscriptions-modal-overlay delete-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSubToDelete(null);
          }}
        >
          <div className="admin-subscriptions-modal delete-plan-modal">
            <div className="delete-modal-header">
              <div className="delete-modal-icon-badge" style={{ background: "#fee2e2", color: "#dc2626" }}>
                <Trash2 size={22} />
              </div>
              <div className="delete-modal-header-text">
                <h2>Delete Subscription</h2>
                <p>Are you sure you want to permanently delete this subscription?</p>
              </div>
              <button
                type="button"
                className="delete-modal-close-btn"
                onClick={() => setSubToDelete(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="delete-modal-body">
              <div className="delete-plan-preview-box">
                <div className="preview-top">
                  <div>
                    <span className="preview-label">Workspace Subscription</span>
                    <strong className="preview-name">{subToDelete.workspace}</strong>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "3px" }}>
                      Plan: <span style={{ fontWeight: 600, color: "#4f46e5" }}>{subToDelete.plan}</span> &bull; ID: <code>{subToDelete.id}</code>
                    </div>
                  </div>
                  <div className="preview-price-wrap">
                    <span className="preview-price">₹{Number(subToDelete.price || 0).toLocaleString("en-IN")}</span>
                    <span className="preview-billing">/{subToDelete.billing || "month"}</span>
                  </div>
                </div>
              </div>
              <p style={{ margin: "14px 0 0", fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>
                Deleting this subscription will cancel recurring billing and purge associated plan quotas for <strong>{subToDelete.workspace}</strong>. This event will be logged in the activity audit trail.
              </p>
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
                  const targetSub = subToDelete;
                  setSubscriptions((prev) => prev.filter((s) => s.id !== targetSub.id));
                  logActivity(
                    `Deleted subscription ${targetSub.id} for workspace "${targetSub.workspace}"`,
                    "Plan Customization",
                    `Revoked active plan ${targetSub.plan} billing enrollment`
                  );
                  setSubToDelete(null);
                  showToast(`Subscription for ${targetSub.workspace} deleted.`);
                }}
              >
                <Trash2 size={16} /> Delete Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, title, value, description, color }) {
  return (
    <article className="admin-subscriptions-stat">
      <div className={`admin-subscriptions-stat-icon ${color}`}>
        <Icon size={21} />
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>

      <TrendingUp size={18} className="admin-subscriptions-stat-trend" />
    </article>
  );
}

function StatusBadge({ status }) {
  const className = status?.toLowerCase().replace(/\s+/g, "-") || "active";
  return (
    <span className={`admin-subscriptions-status ${className}`}>
      {status}
    </span>
  );
}

function PlanBadge({ plan }) {
  return (
    <span className={`admin-subscriptions-plan-badge ${plan?.toLowerCase() || "pro"}`}>
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
