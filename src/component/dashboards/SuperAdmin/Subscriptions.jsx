
import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  ArrowDown,
  ArrowDownRight,
  ArrowUp,
  ArrowUpDown,
  ArrowUpRight,
  BadgeCheck,
  Ban,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  Download,
  Ellipsis,
  Eye,
  Filter,
  LayoutGrid,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Table as TableIcon,
  Unlock,
  X,
  XCircle,
  Building2,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Subscriptions.css";

const DUMMY_COMPANY_LOGOS = {
  "Acme Technologies": {
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    type: "hexagon",
  },
  "Nova Solutions": {
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    type: "star",
  },
  "Pixel Studios": {
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #ec4899, #be185d)",
    type: "grid",
  },
  "Vertex Systems": {
    url: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #0284c7, #0369a1)",
    type: "polygon",
  },
  "Bright Labs": {
    url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    type: "spark",
  },
  "Orbit Digital": {
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #6366f1, #4f46e5)",
    type: "orbit",
  },
  "CloudPeak": {
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    type: "cloud",
  },
  "NextGen Works": {
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    type: "cube",
  },
  "Summit Consulting": {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #059669, #047857)",
    type: "peak",
  },
  "Greenline Tech": {
    url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    type: "leaf",
  },
};

function CompanyLogo({ organization = "", logo = "", size = 36 }) {
  const [imgError, setImgError] = useState(false);
  const brand = DUMMY_COMPANY_LOGOS[organization] || {
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #3b66ff, #1d4ed8)",
    type: "default",
  };

  const logoUrl = logo || brand.url;

  const renderVectorIcon = () => {
    switch (brand.type) {
      case "hexagon":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
            <path d="M12 8v8M8 12h8" strokeWidth="1.8" />
          </svg>
        );
      case "star":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} fill="#fff">
            <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
          </svg>
        );
      case "grid":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} fill="#fff">
            <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" opacity="0.9" />
            <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" opacity="0.6" />
            <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" opacity="0.6" />
            <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" opacity="1" />
          </svg>
        );
      case "polygon":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 22 22 22" />
            <circle cx="12" cy="14" r="3" fill="#fff" />
          </svg>
        );
      case "spark":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            <circle cx="12" cy="12" r="4" fill="#fff" />
          </svg>
        );
      case "orbit":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} fill="none" stroke="#fff" strokeWidth="1.8">
            <circle cx="12" cy="12" r="4" fill="#fff" />
            <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" />
          </svg>
        );
      case "cloud":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="#fff" fillOpacity="0.25" />
          </svg>
        );
      case "cube":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        );
      case "peak":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 20L10 6L14 13L17 8L21 20H3Z" fill="#fff" fillOpacity="0.3" />
          </svg>
        );
      case "leaf":
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="#fff" fillOpacity="0.2" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} fill="none" stroke="#fff" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <circle cx="12" cy="12" r="4" fill="#fff" />
          </svg>
        );
    }
  };

  if (imgError || !logoUrl) {
    return (
      <div
        className="sub-company-logo-wrap is-vector-brand"
        style={{
          width: size,
          height: size,
          minWidth: size,
          background: brand.gradient,
        }}
        title={organization}
        aria-label={`${organization} logo`}
      >
        {renderVectorIcon()}
      </div>
    );
  }

  return (
    <div
      className="sub-company-logo-wrap"
      style={{ width: size, height: size, minWidth: size }}
      title={organization}
      aria-label={`${organization} logo`}
    >
      <img
        src={logoUrl}
        alt={`${organization} logo`}
        className="sub-company-logo-img"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

const INITIAL_SUBSCRIPTIONS = [
  {
    id: "SUB-1001",
    organization: "Acme Technologies",
    contact: "Aarav Sharma",
    email: "aarav@acme.demo",
    plan: "Enterprise",
    price: 239988,
    billing: "Yearly",
    status: "Active",
    started: "2026-01-15",
    renewal: "2027-01-15",
    payment: "Paid",
    logo: DUMMY_COMPANY_LOGOS["Acme Technologies"].url,
  },
  {
    id: "SUB-1002",
    organization: "Nova Solutions",
    contact: "Priya Patel",
    email: "priya@nova.demo",
    plan: "Business",
    price: 7999,
    billing: "Monthly",
    status: "Active",
    started: "2026-09-01",
    renewal: "2026-11-01",
    payment: "Paid",
    logo: DUMMY_COMPANY_LOGOS["Nova Solutions"].url,
  },
  {
    id: "SUB-1003",
    organization: "Pixel Studios",
    contact: "Rohan Mehta",
    email: "rohan@pixel.demo",
    plan: "Starter",
    price: 1999,
    billing: "Monthly",
    status: "Trial",
    started: "2026-10-12",
    renewal: "2026-10-26",
    payment: "Trial",
    logo: DUMMY_COMPANY_LOGOS["Pixel Studios"].url,
  },
  {
    id: "SUB-1004",
    organization: "Vertex Systems",
    contact: "Meera Shah",
    email: "meera@vertex.demo",
    plan: "Business",
    price: 7999,
    billing: "Monthly",
    status: "Past Due",
    started: "2026-08-20",
    renewal: "2026-10-20",
    payment: "Failed",
    logo: DUMMY_COMPANY_LOGOS["Vertex Systems"].url,
  },
  {
    id: "SUB-1005",
    organization: "Bright Labs",
    contact: "Karan Joshi",
    email: "karan@bright.demo",
    plan: "Starter",
    price: 1999,
    billing: "Monthly",
    status: "Active",
    started: "2026-06-05",
    renewal: "2026-11-05",
    payment: "Paid",
    logo: DUMMY_COMPANY_LOGOS["Bright Labs"].url,
  },
  {
    id: "SUB-1006",
    organization: "Orbit Digital",
    contact: "Neha Verma",
    email: "neha@orbit.demo",
    plan: "Enterprise",
    price: 239988,
    billing: "Yearly",
    status: "Cancelled",
    started: "2025-10-10",
    renewal: "2026-10-10",
    payment: "Paid",
    logo: DUMMY_COMPANY_LOGOS["Orbit Digital"].url,
  },
  {
    id: "SUB-1007",
    organization: "CloudPeak",
    contact: "Vikram Rao",
    email: "vikram@cloudpeak.demo",
    plan: "Business",
    price: 76788,
    billing: "Yearly",
    status: "Active",
    started: "2026-07-18",
    renewal: "2026-11-18",
    payment: "Paid",
    logo: DUMMY_COMPANY_LOGOS["CloudPeak"].url,
  },
  {
    id: "SUB-1008",
    organization: "NextGen Works",
    contact: "Ananya Das",
    email: "ananya@nextgen.demo",
    plan: "Starter",
    price: 1999,
    billing: "Monthly",
    status: "Past Due",
    started: "2026-09-22",
    renewal: "2026-10-22",
    payment: "Failed",
    logo: DUMMY_COMPANY_LOGOS["NextGen Works"].url,
  },
  {
    id: "SUB-1009",
    organization: "Summit Consulting",
    contact: "Dev Malhotra",
    email: "dev@summit.demo",
    plan: "Business",
    price: 7999,
    billing: "Monthly",
    status: "Active",
    started: "2026-05-10",
    renewal: "2026-11-10",
    payment: "Paid",
    logo: DUMMY_COMPANY_LOGOS["Summit Consulting"].url,
  },
  {
    id: "SUB-1010",
    organization: "Greenline Tech",
    contact: "Isha Kapoor",
    email: "isha@greenline.demo",
    plan: "Starter",
    price: 1999,
    billing: "Monthly",
    status: "Trial",
    started: "2026-10-15",
    renewal: "2026-10-29",
    payment: "Trial",
    logo: DUMMY_COMPANY_LOGOS["Greenline Tech"].url,
  },
];

const ALL_PLATFORM_FEATURES = [
  "AI Assistant (Gemini & OpenAI)",
  "Unlimited Team Workspaces",
  "Custom Domain & SSL Provisioning",
  "Enterprise SAML 2.0 / SSO",
  "24/7 Dedicated Support SLA",
  "Immutable Audit Logs & Export",
  "50 GB High-Speed Cloud Storage",
  "Full REST & GraphQL API Access",
  "Automated Invoicing & GST Tax Engine",
];

const DEFAULT_PLANS = [
  {
    name: "Starter",
    price: 1999,
    description: "For small teams getting started",
    features: ["Up to 10 users", "Task and project management", "Basic reports"],
  },
  {
    name: "Business",
    price: 7999,
    description: "For growing organizations",
    features: ["Up to 50 users", "Advanced analytics", "Priority support"],
  },
  {
    name: "Enterprise",
    price: 24999,
    description: "For larger organizations",
    features: ["Unlimited team members", "Advanced access controls", "Dedicated support"],
  },
];

function loadPlanPrices() {
  try {
    const saved = localStorage.getItem("teamflow_superadmin_plan_prices");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to load plan prices", e);
  }
  return DEFAULT_PLANS;
}

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function SubscriptionStatus({ status }) {
  return (
    <span
      className={`subscription-status subscription-status-${status
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      <span />
      {status}
    </span>
  );
}

function Subscriptions() {
  const [plans, setPlans] = useState(loadPlanPrices);
  const [editingPlanPrice, setEditingPlanPrice] = useState(null);
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [planFilter, setPlanFilter] = useState("All plans");
  const [billingFilter, setBillingFilter] = useState("All billing cycles");
  const [paymentFilter, setPaymentFilter] = useState("All payments");
  const [sortField, setSortField] = useState("organization");
  const [sortOrder, setSortOrder] = useState("asc");
  const [planViewMode, setPlanViewMode] = useState("cards");
  const [pricingCycle, setPricingCycle] = useState("Monthly");
  const [page, setPage] = useState(1);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [confirmCancelTarget, setConfirmCancelTarget] = useState(null);
  const [toast, setToast] = useState("");

  // Prevent background scroll when any modal is open
  useEffect(() => {
    const hasModal = Boolean(
      selectedSubscription ||
        showPlans ||
        editingPlanPrice ||
        editingSubscription ||
        showCreateModal ||
        confirmCancelTarget
    );
    if (typeof document !== "undefined") {
      document.body.style.overflow = hasModal ? "hidden" : "";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [
    selectedSubscription,
    showPlans,
    editingPlanPrice,
    editingSubscription,
    showCreateModal,
    confirmCancelTarget,
  ]);

  const [menuId, setMenuId] = useState(null);
  const [density, setDensity] = useState("standard");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [pageSize, setPageSize] = useState(7);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(visibleSubscriptions.map((s) => s.id)));
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
    setSubscriptions((prev) =>
      prev.map((s) => (selectedIds.has(s.id) ? { ...s, status: "Active" } : s))
    );
    notify(`Activated ${selectedIds.size} subscriptions.`);
    setSelectedIds(new Set());
  };

  const handleBatchCancel = () => {
    setSubscriptions((prev) =>
      prev.map((s) => (selectedIds.has(s.id) ? { ...s, status: "Cancelled" } : s))
    );
    notify(`Cancelled ${selectedIds.size} subscriptions.`);
    setSelectedIds(new Set());
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredSubscriptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = subscriptions.filter((subscription) => {
      const matchesSearch =
        !query ||
        [
          subscription.id,
          subscription.organization,
          subscription.contact,
          subscription.email,
          subscription.plan,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All statuses" ||
        subscription.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesPlan =
        planFilter === "All plans" ||
        subscription.plan.toLowerCase() === planFilter.toLowerCase();

      const matchesBilling =
        billingFilter === "All billing cycles" ||
        subscription.billing.toLowerCase() === billingFilter.toLowerCase();

      const matchesPayment =
        paymentFilter === "All payments" ||
        subscription.payment.toLowerCase() === paymentFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPlan &&
        matchesBilling &&
        matchesPayment
      );
    });

    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [subscriptions, search, statusFilter, planFilter, billingFilter, paymentFilter, sortField, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubscriptions.length / pageSize)
  );
  const currentPage = Math.min(page, totalPages);
  const visibleSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const metrics = useMemo(() => {
    const active = subscriptions.filter((item) => item.status === "Active");
    const pastDue = subscriptions.filter((item) => item.status === "Past Due");
    const trials = subscriptions.filter((item) => item.status === "Trial");
    const cancelled = subscriptions.filter((item) => item.status === "Cancelled");

    const monthlyRevenue = active.reduce((total, item) => {
      return total + (item.billing === "Yearly" ? item.price / 12 : item.price);
    }, 0);

    return {
      active: active.length,
      monthlyRevenue,
      pastDue: pastDue.length,
      trials: trials.length,
      cancelled: cancelled.length,
    };
  }, [subscriptions]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All statuses");
    setPlanFilter("All plans");
    setBillingFilter("All billing cycles");
    setPaymentFilter("All payments");
    setSortField("organization");
    setSortOrder("asc");
    setPage(1);
  };

  const updateSubscription = (updated) => {
    setSubscriptions((current) =>
      current.map((item) => (item.id === updated.id ? updated : item))
    );
    setEditingSubscription(null);
    setSelectedSubscription(null);
    notify("Subscription updated.");
  };

  const changeStatus = (subscription, status) => {
    setSubscriptions((current) =>
      current.map((item) =>
        item.id === subscription.id ? { ...item, status } : item
      )
    );
    setMenuId(null);
    setSelectedSubscription(null);
    notify(`${subscription.organization}: status changed to ${status}.`);
  };

  const createSubscription = (values) => {
    const newSubscription = {
      ...values,
      id: `SUB-${Date.now().toString().slice(-6)}`,
    };

    setSubscriptions((current) => [newSubscription, ...current]);
    setShowCreateModal(false);
    setPage(1);
    notify("Demo subscription created.");
  };

  const exportCsv = () => {
    const headers = [
      "Subscription ID",
      "Organization",
      "Contact",
      "Email",
      "Plan",
      "Price INR",
      "Billing Cycle",
      "Status",
      "Start Date",
      "Renewal Date",
      "Payment Status",
    ];

    const rows = filteredSubscriptions.map((item) => [
      item.id,
      item.organization,
      item.contact,
      item.email,
      item.plan,
      item.price,
      item.billing,
      item.status,
      item.started,
      item.renewal,
      item.payment,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "teamflow-subscriptions.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify("Subscription report exported.");
  };

  return (
    <div className="subscriptions-page">
      {/* 1. SAP Master Header Bar */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>Subscription Master Directory</h1>
          <p className="sap-header-subtitle">
            Manage organization subscription contracts, recurring revenue, payment health, and tier allocations.
          </p>
        </div>

        <div className="sap-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={exportCsv}
          >
            <Download size={15} /> Export Spreadsheet
          </button>
          <button
            type="button"
            className="sa-btn sa-btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} /> New Subscription
          </button>
        </div>
      </section>

      {/* 2. Top 4 Telemetry Cards */}
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box purple">
            <CreditCard size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Monthly Recurring Revenue</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{formatCurrency(metrics.monthlyRevenue)}</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> MRR
              </span>
            </div>
            <span className="sa-kpi-subtitle">Calculated across active tiers</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <BadgeCheck size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Active Subscriptions</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{metrics.active}</span>
              <span className="sa-kpi-trend positive">Operational</span>
            </div>
            <span className="sa-kpi-subtitle">Unrestricted platform access</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box red">
            <XCircle size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Past Due / Failed</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{metrics.pastDue}</span>
              <span className="sa-kpi-trend negative">Requires Action</span>
            </div>
            <span className="sa-kpi-subtitle">Payment retries pending</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box sky">
            <CalendarDays size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Active Free Trials</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{metrics.trials}</span>
              <span className="sa-kpi-trend positive">Evaluation</span>
            </div>
            <span className="sa-kpi-subtitle">14-day evaluation window</span>
          </div>
        </article>
      </section>

      <section className="subscriptions-plan-section">
        <div className="subscriptions-section-heading">
          <div>
            <h2>Available Plans &amp; Pricing Architecture</h2>
            <p>Tier allocation, billing cycle rates, and tenant feature entitlement</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {/* Interactive Billing Cycle Switch */}
            <div className="sub-pricing-cycle-switch">
              <button
                type="button"
                className={`sub-cycle-btn ${pricingCycle === "Monthly" ? "active" : ""}`}
                onClick={() => setPricingCycle("Monthly")}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`sub-cycle-btn ${pricingCycle === "Yearly" ? "active" : ""}`}
                onClick={() => setPricingCycle("Yearly")}
              >
                Yearly
                <span className="sub-cycle-savings-tag">Save 20%</span>
              </button>
            </div>

            <div className="sub-plans-view-toggle">
              <button
                type="button"
                className={`sub-plans-toggle-btn ${planViewMode === "cards" ? "active" : ""}`}
                onClick={() => setPlanViewMode("cards")}
                title="Cards view"
              >
                <LayoutGrid size={15} />
                Cards
              </button>
              <button
                type="button"
                className={`sub-plans-toggle-btn ${planViewMode === "table" ? "active" : ""}`}
                onClick={() => setPlanViewMode("table")}
                title="Table view"
              >
                <TableIcon size={15} />
                Table
              </button>
            </div>
            <button
              type="button"
              className="subscriptions-text-button"
              onClick={() => setShowPlans(true)}
            >
              Manage plans
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {planViewMode === "cards" ? (
          <div className="subscriptions-plan-grid">
            {plans.map((plan, index) => {
              const isYearly = pricingCycle === "Yearly";
              const effectiveMonthly = isYearly ? Math.round(plan.price * 0.8) : plan.price;
              const annualTotal = isYearly ? Math.round(plan.price * 12 * 0.8) : plan.price * 12;
              const isBusiness = plan.name === "Business";
              const planClass =
                plan.name === "Enterprise"
                  ? "plan-enterprise"
                  : plan.name === "Business"
                  ? "plan-business"
                  : "plan-starter";

              return (
                <article
                  key={plan.name}
                  className={`subscriptions-plan-card ${planClass} ${
                    isBusiness ? "subscriptions-plan-featured" : ""
                  }`}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div className="subscriptions-plan-name">{plan.name}</div>
                    <span className={`sub-tier-badge tier-${plan.name.toLowerCase()}`}>
                      {plan.name}
                    </span>
                  </div>
                  <p>{plan.description}</p>
                  <div className="subscriptions-plan-price-row">
                    <div className="subscriptions-plan-price">
                      <strong>{formatCurrency(effectiveMonthly)}</strong>
                      <span>/ month</span>
                      {isYearly && (
                        <small style={{ display: "block", width: "100%", fontSize: "11px", color: "#16a34a", fontWeight: 600, marginTop: 3 }}>
                          Billed annually ({formatCurrency(annualTotal)} / yr)
                        </small>
                      )}
                    </div>
                    <button
                      type="button"
                      className="subscriptions-edit-price-btn"
                      title={`Edit base price for ${plan.name}`}
                      onClick={() =>
                        setEditingPlanPrice({ name: plan.name, price: plan.price })
                      }
                    >
                      <Pencil size={12} /> Edit Price
                    </button>
                  </div>
                  <div className="subscriptions-plan-features">
                    {plan.features.map((feature) => (
                      <div key={feature}>
                        <Check size={15} color={plan.name === "Enterprise" ? "#7c3aed" : plan.name === "Business" ? "#6366f1" : "#0284c7"} />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="subscriptions-plan-action"
                    onClick={() => {
                      setShowCreateModal(true);
                      setEditingSubscription({
                        plan: plan.name,
                        price: isYearly ? annualTotal : plan.price,
                        billing: isYearly ? "Yearly" : "Monthly",
                      });
                    }}
                  >
                    Assign {plan.name} Plan
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="subscriptions-table-wrap" style={{ margin: "16px 0 0" }}>
            <table className="subscriptions-table subscriptions-plans-table">
              <thead>
                <tr>
                  <th>Plan Tier</th>
                  <th>Description</th>
                  <th>Price &amp; Billing</th>
                  <th>Included Features</th>
                  <th>Popularity</th>
                  <th aria-label="Actions" style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, index) => {
                  const isYearly = pricingCycle === "Yearly";
                  const effectiveMonthly = isYearly ? Math.round(plan.price * 0.8) : plan.price;
                  const annualTotal = isYearly ? Math.round(plan.price * 12 * 0.8) : plan.price * 12;
                  return (
                    <tr key={plan.name}>
                      <td>
                        <span className={`sub-tier-badge tier-${plan.name.toLowerCase()}`}>
                          {plan.name} Tier
                        </span>
                      </td>
                      <td>
                        <span className="sub-plan-table-desc">
                          {plan.description}
                        </span>
                      </td>
                      <td>
                        <strong className="subscriptions-price">
                          {formatCurrency(effectiveMonthly)}
                        </strong>
                        <small className="subscriptions-billing-cycle">
                          / month {isYearly ? `(${formatCurrency(annualTotal)} / yr)` : ""}
                        </small>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {plan.features.map((feat) => (
                            <span key={feat} className="sub-plan-table-feature-tag">
                              <Check size={12} /> {feat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        {index === 1 ? (
                          <span className="subscriptions-plan-popular" style={{ position: "static" }}>
                            MOST POPULAR
                          </span>
                        ) : (
                          <span className="sub-plan-table-standard">
                            Standard
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                          <button
                            type="button"
                            className="subscriptions-button subscriptions-button-light"
                            style={{ padding: "6px 10px", fontSize: "12px" }}
                            onClick={() =>
                              setEditingPlanPrice({ name: plan.name, price: plan.price })
                            }
                          >
                            <Pencil size={12} /> Edit Price
                          </button>
                          <button
                            type="button"
                            className="subscriptions-button subscriptions-button-primary"
                            style={{ padding: "6px 12px", fontSize: "12px" }}
                            onClick={() => {
                              setShowCreateModal(true);
                              setEditingSubscription({
                                plan: plan.name,
                                price: isYearly ? annualTotal : plan.price,
                                billing: isYearly ? "Yearly" : "Monthly",
                              });
                            }}
                          >
                            Assign Plan
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 3. The SAP Subscription Master Grid Card */}
      <section className="sap-table-card">
        {/* Multi-Selection Batch Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="sap-batch-banner">
            <span>
              <strong>{selectedIds.size}</strong> subscriptions selected
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
                onClick={handleBatchCancel}
              >
                <Ban size={13} color="#dc2626" /> Cancel Selected
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={exportCsv}
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
                placeholder="Search organization, contact, plan, subscription ID..."
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
              <option value="All statuses">Status: All Statuses</option>
              <option value="Active">Active</option>
              <option value="Trial">Trial</option>
              <option value="Past Due">Past Due</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              className="sap-filter-select"
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All plans">Plan: All Plans</option>
              <option value="Starter">Starter Tier</option>
              <option value="Business">Business Tier</option>
              <option value="Enterprise">Enterprise Tier</option>
            </select>

            <select
              className="sap-filter-select"
              value={billingFilter}
              onChange={(e) => {
                setBillingFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All billing cycles">Cycle: All Cycles</option>
              <option value="Monthly">Monthly Cycle</option>
              <option value="Yearly">Yearly Cycle</option>
            </select>

            <select
              className="sap-filter-select"
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All payments">Payment: All</option>
              <option value="Paid">Paid</option>
              <option value="Trial">Trial</option>
              <option value="Failed">Failed</option>
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
              onClick={resetFilters}
              title="Reset all filters"
            >
              <RefreshCw size={15} />
            </button>

            {/* Reset Demo Data */}
            <button
              type="button"
              className="sap-icon-btn"
              onClick={() => {
                setSubscriptions(INITIAL_SUBSCRIPTIONS);
                resetFilters();
                notify("Demo subscriptions restored to default records.");
              }}
              title="Reset Demo Data"
            >
              <RotateCcw size={15} />
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
                      visibleSubscriptions.length > 0 &&
                      visibleSubscriptions.every((s) => selectedIds.has(s.id))
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ width: 110 }}>Contract ID</th>
                <th
                  onClick={() => handleSort("organization")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Organization &amp; Contact
                    {sortField === "organization" ? (
                      sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} opacity={0.4} />
                    )}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("plan")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Plan Tier
                    {sortField === "plan" ? (
                      sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} opacity={0.4} />
                    )}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("price")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Recurring Price
                    {sortField === "price" ? (
                      sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} opacity={0.4} />
                    )}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("status")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Contract Status
                    {sortField === "status" ? (
                      sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} opacity={0.4} />
                    )}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("renewal")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Renewal Date
                    {sortField === "renewal" ? (
                      sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} opacity={0.4} />
                    )}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("payment")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Payment State
                    {sortField === "payment" ? (
                      sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} opacity={0.4} />
                    )}
                  </span>
                </th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleSubscriptions.map((subscription) => {
                const isSelected = selectedIds.has(subscription.id);
                return (
                  <tr key={subscription.id} className={isSelected ? "is-selected" : ""}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(subscription.id)}
                      />
                    </td>
                    <td>
                      <span className="sap-id-cell">{subscription.id}</span>
                    </td>
                    <td>
                      <div className="sap-user-badge">
                        <CompanyLogo
                          organization={subscription.organization}
                          logo={subscription.logo}
                          size={36}
                        />
                        <div className="sap-user-info">
                          <strong className="sap-user-name">{subscription.organization}</strong>
                          <span className="sap-user-email">
                            {subscription.contact} · {subscription.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`sub-tier-badge tier-${subscription.plan.toLowerCase()}`}
                      >
                        {subscription.plan}
                      </span>
                    </td>
                    <td>
                      <div>
                        <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700, fontSize: "13px" }}>
                          {formatCurrency(subscription.price)}
                        </span>
                        <small style={{ color: "var(--sa-text-muted)", marginLeft: 4, fontWeight: 600 }}>
                          /{subscription.billing === "Yearly" ? "yr" : "mo"}
                        </small>
                      </div>
                      {subscription.billing === "Yearly" ? (
                        <small style={{ color: "#16a34a", fontSize: "11px", fontWeight: 600, display: "block", marginTop: "2px" }}>
                          ₹{Math.round(subscription.price / 12).toLocaleString()}/mo · Save 20%
                        </small>
                      ) : (
                        <small style={{ color: "var(--sa-text-muted)", fontSize: "11px", display: "block", marginTop: "2px" }}>
                          ₹{(subscription.price * 12).toLocaleString()}/yr standard
                        </small>
                      )}
                    </td>
                    <td>
                      <span
                        className={`sub-status-pill status-${subscription.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        <span className="sub-status-dot" />
                        {subscription.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: "12.5px", color: "var(--sa-text-primary)", fontWeight: 550 }}>
                        {formatDate(subscription.renewal)}
                      </div>
                      <small style={{ color: "var(--sa-text-muted)", fontSize: "11px" }}>
                        {subscription.status === "Cancelled" ? "Expired contract" : "Next scheduled"}
                      </small>
                    </td>
                    <td>
                      <span
                        className={`sub-payment-badge payment-${subscription.payment.toLowerCase()}`}
                      >
                        {subscription.payment}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="sub-action-group">
                        <button
                          type="button"
                          className="sub-action-btn btn-view"
                          title="View Subscription Details"
                          onClick={() => setSelectedSubscription(subscription)}
                        >
                          <Eye size={15} color="#4f46e5" strokeWidth={2.2} />
                        </button>
                        <button
                          type="button"
                          className="sub-action-btn btn-edit"
                          title="Edit Subscription"
                          onClick={() => setEditingSubscription(subscription)}
                        >
                          <Pencil size={15} color="#2563eb" strokeWidth={2.2} />
                        </button>
                        {subscription.status !== "Active" ? (
                          <button
                            type="button"
                            className="sub-action-btn btn-activate"
                            title="Activate Subscription"
                            onClick={() => changeStatus(subscription, "Active")}
                          >
                            <Unlock size={15} color="#15803d" strokeWidth={2.2} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="sub-action-btn btn-cancel"
                            title="Cancel Subscription"
                            onClick={() => setConfirmCancelTarget(subscription)}
                          >
                            <Ban size={15} color="#dc2626" strokeWidth={2.2} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {visibleSubscriptions.length === 0 && (
                <tr>
                  <td colSpan="9">
                    <div className="subscriptions-empty">
                      <CreditCard size={28} />
                      <strong>No subscriptions found</strong>
                      <span>Try another search or reset the filters.</span>
                      <button type="button" onClick={resetFilters}>
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 5. The SAP Pagination Footer Bar */}
        <div className="sap-footer-bar">
          <div className="sap-footer-counts" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="sap-counter">
              Showing{" "}
              <strong>
                {filteredSubscriptions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(currentPage * pageSize, filteredSubscriptions.length)}
              </strong>{" "}
              of <strong>{filteredSubscriptions.length}</strong> subscriptions
            </div>

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
                <option value={7}>7</option>
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
              disabled={currentPage === 1}
              onClick={() => setPage(1)}
              title="First Page"
            >
              <ChevronsLeft size={15} />
            </button>
            <button
              type="button"
              className="sap-page-btn"
              disabled={currentPage === 1}
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
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              title="Next Page"
            >
              <ChevronRight size={15} />
            </button>
            <button
              type="button"
              className="sap-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setPage(totalPages)}
              title="Last Page"
            >
              <ChevronsRight size={15} />
            </button>
          </div>
        </div>
      </section>

      <p className="subscriptions-demo-note">
        <ShieldCheck size={14} />
        Demo billing information only. No real payments are collected or
        processed by this page.
      </p>

      {selectedSubscription &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="subscriptions-modal-backdrop"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedSubscription(null);
              }
            }}
          >
            <section
              className="subscriptions-modal subscriptions-view-modal"
              role="dialog"
              aria-modal="true"
            >
              <header className="subscriptions-view-header">
                <div className="subscriptions-view-header-left">
                  <span className="subscriptions-modal-icon">
                    <CreditCard size={18} />
                  </span>
                  <div>
                    <h2>Subscription Details</h2>
                    <p className="subscriptions-view-id-tag">
                      {selectedSubscription.id}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="subscriptions-icon-button"
                  onClick={() => setSelectedSubscription(null)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </header>

              <div className="subscriptions-view-modal-body">
                {/* Hero organization card */}
                <div className="sub-view-hero">
                  <div className="sub-view-org-cell">
                    <CompanyLogo
                      organization={selectedSubscription.organization}
                      logo={selectedSubscription.logo}
                      size={48}
                    />
                    <div>
                      <h3>{selectedSubscription.organization}</h3>
                      <p>
                        {selectedSubscription.contact} · {selectedSubscription.email}
                      </p>
                    </div>
                  </div>
                  <div className="sub-view-badges-cell">
                    <div className="sub-view-badge-item">
                      <small>Plan</small>
                      <strong className={`sub-tier-badge tier-${selectedSubscription.plan.toLowerCase()}`}>
                        {selectedSubscription.plan}
                      </strong>
                    </div>
                    <div className="sub-view-badge-item">
                      <small>Price</small>
                      <strong className="sub-view-price-pill">
                        {formatCurrency(selectedSubscription.price)}
                        <span className="sub-view-per">/{selectedSubscription.billing.toLowerCase().replace("ly", "")}</span>
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 2-Column Info Grid */}
                <div className="sub-view-grid">
                  <div className="sub-view-grid-card">
                    <span className="sub-view-grid-label">Subscription Status</span>
                    <span
                      className={`sub-status-pill status-${selectedSubscription.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <span className="sub-status-dot" />
                      {selectedSubscription.status}
                    </span>
                  </div>

                  <div className="sub-view-grid-card">
                    <span className="sub-view-grid-label">Billing Cycle</span>
                    <strong className="sub-view-grid-val">{selectedSubscription.billing}</strong>
                  </div>

                  <div className="sub-view-grid-card">
                    <span className="sub-view-grid-label">Payment Status</span>
                    <span
                      className={`sub-payment-badge payment-${selectedSubscription.payment.toLowerCase()}`}
                    >
                      {selectedSubscription.payment}
                    </span>
                  </div>

                  <div className="sub-view-grid-card">
                    <span className="sub-view-grid-label">Payment Method</span>
                    <strong className="sub-view-grid-val">Visa Corporate (•••• 4021)</strong>
                  </div>

                  <div className="sub-view-grid-card">
                    <span className="sub-view-grid-label">Start Date</span>
                    <strong className="sub-view-grid-val">{formatDate(selectedSubscription.started)}</strong>
                  </div>

                  <div className="sub-view-grid-card">
                    <span className="sub-view-grid-label">Next Renewal</span>
                    <strong className="sub-view-grid-val">{formatDate(selectedSubscription.renewal)}</strong>
                  </div>
                </div>
              </div>

              <footer className="subscriptions-view-footer">
                <button
                  type="button"
                  className="subscriptions-button subscriptions-button-light"
                  onClick={() => setSelectedSubscription(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="subscriptions-button subscriptions-button-primary"
                  onClick={() => {
                    setEditingSubscription(selectedSubscription);
                    setSelectedSubscription(null);
                  }}
                >
                  <Pencil size={14} /> Edit Subscription
                </button>
              </footer>
            </section>
          </div>,
          document.body
        )}

      {/* Portaled Confirmation Modal for Cancellation */}
      {confirmCancelTarget &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="subscriptions-modal-backdrop"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setConfirmCancelTarget(null);
              }
            }}
          >
            <div className="sub-confirm-dialog" role="dialog" aria-modal="true">
              <div className="sub-confirm-header">
                <div className="sub-confirm-icon-box">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3>Cancel Subscription Contract</h3>
                  <p>Confirmation required to terminate subscription</p>
                </div>
              </div>
              <div className="sub-confirm-body">
                Are you sure you want to cancel the contract for{" "}
                <strong>{confirmCancelTarget.organization}</strong>?
                <div className="sub-confirm-target-box">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CompanyLogo
                      organization={confirmCancelTarget.organization}
                      logo={confirmCancelTarget.logo}
                      size={36}
                    />
                    <div>
                      <strong style={{ fontSize: "13px" }}>{confirmCancelTarget.organization}</strong>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        {confirmCancelTarget.id} · Contact: {confirmCancelTarget.contact}
                      </div>
                    </div>
                  </div>
                  <span className={`sub-tier-badge tier-${confirmCancelTarget.plan.toLowerCase()}`}>
                    {confirmCancelTarget.plan} Tier
                  </span>
                </div>
                <p style={{ marginTop: 12, fontSize: "11.5px", color: "#64748b" }}>
                  Cancelling will immediately freeze future billing cycles and downgrade the organization to read-only archival access at the end of the current term.
                </p>
              </div>
              <div className="sub-confirm-footer">
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary"
                  onClick={() => setConfirmCancelTarget(null)}
                >
                  Keep Subscription
                </button>
                <button
                  type="button"
                  className="sa-btn sa-btn-danger"
                  onClick={() => {
                    changeStatus(confirmCancelTarget, "Cancelled");
                    setConfirmCancelTarget(null);
                  }}
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {(showCreateModal || editingSubscription) && (
        <SubscriptionForm
          initial={editingSubscription}
          plans={plans}
          onClose={() => {
            setShowCreateModal(false);
            setEditingSubscription(null);
          }}
          onSave={(values) => {
            if (editingSubscription?.id) {
              updateSubscription({ ...editingSubscription, ...values });
            } else {
              createSubscription(values);
              setEditingSubscription(null);
            }
          }}
        />
      )}

      {showPlans &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="subscriptions-modal-backdrop"
            onClick={(event) => {
              if (event.target === event.currentTarget) setShowPlans(false);
            }}
          >
            <section className="subscriptions-modal sub-catalogue-modal" role="dialog" aria-modal="true">
              <header>
                <div>
                  <span className="subscriptions-modal-icon">
                    <Sparkles size={20} />
                  </span>
                  <div>
                    <h2>Plan Catalogue &amp; Pricing Architecture</h2>
                    <p>Current plan definitions, rates, and platform tier entitlement</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="subscriptions-icon-button"
                  onClick={() => setShowPlans(false)}
                  aria-label="Close plan catalogue"
                >
                  <X size={18} />
                </button>
              </header>
              <div className="subscriptions-modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {plans.map((plan) => (
                  <div className="sub-catalogue-card" key={plan.name}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className={`sub-tier-badge tier-${plan.name.toLowerCase()}`}>
                          {plan.name} Tier
                        </span>
                        <strong style={{ fontSize: "14.5px", color: "var(--sa-text-main, #0f172a)", fontWeight: 700 }}>
                          {plan.name}
                        </strong>
                      </div>
                      <span style={{ fontSize: "12.5px", color: "#64748b" }}>
                        {plan.description}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ textAlign: "right" }}>
                        <strong style={{ fontSize: "16px", color: "var(--sa-text-main, #0f172a)", display: "block", fontWeight: 750 }}>
                          {formatCurrency(plan.price)}
                        </strong>
                        <small style={{ fontSize: "11px", color: "#64748b" }}>/ month</small>
                      </div>
                      <button
                        type="button"
                        className="subscriptions-button subscriptions-button-light"
                        style={{ height: 36, padding: "0 12px", fontSize: "12.5px" }}
                        onClick={() =>
                          setEditingPlanPrice({ name: plan.name, price: plan.price })
                        }
                      >
                        <Pencil size={13} /> Edit Rate
                      </button>
                    </div>
                  </div>
                ))}
                <div className="sub-catalogue-note">
                  Super Admin controls tier pricing for the entire multi-tenant system. Rate modifications apply to new subscriptions and upcoming renewal invoices.
                </div>
              </div>
              <footer>
                <button
                  type="button"
                  className="subscriptions-button subscriptions-button-primary"
                  onClick={() => setShowPlans(false)}
                >
                  Done
                </button>
              </footer>
            </section>
          </div>,
          document.body
        )}

      {editingPlanPrice &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="subscriptions-modal-backdrop"
            onClick={(event) => {
              if (event.target === event.currentTarget) setEditingPlanPrice(null);
            }}
          >
            <section className="subscriptions-modal sub-price-modal" role="dialog" aria-modal="true">
              <header>
                <div>
                  <span className="subscriptions-modal-icon">
                    <Pencil size={19} />
                  </span>
                  <div>
                    <h2>Edit Plan Rate</h2>
                    <p>Update base pricing for {editingPlanPrice.name} Tier</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="subscriptions-icon-button"
                  onClick={() => setEditingPlanPrice(null)}
                  aria-label="Close form"
                >
                  <X size={18} />
                </button>
              </header>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const newPrice = Number(editingPlanPrice.price);
                  if (isNaN(newPrice) || newPrice < 0) return;

                  const updated = plans.map((p) =>
                    p.name === editingPlanPrice.name ? { ...p, price: newPrice } : p
                  );
                  setPlans(updated);
                  try {
                    localStorage.setItem("teamflow_superadmin_plan_prices", JSON.stringify(updated));
                  } catch (err) {
                    console.error(err);
                  }
                  setEditingPlanPrice(null);
                  notify(`Price for ${editingPlanPrice.name} Plan updated to ₹${newPrice.toLocaleString()} successfully.`);
                }}
              >
                <div className="subscriptions-modal-body sub-form-body">
                  <div className="sub-field-group">
                    <label className="sub-field-label">Plan Tier</label>
                    <div className="sub-input-static">
                      <span className={`sub-tier-badge tier-${editingPlanPrice.name.toLowerCase()}`}>
                        {editingPlanPrice.name} Tier
                      </span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>Platform Standard Catalogue</span>
                    </div>
                  </div>

                  <div className="sub-field-group">
                    <label className="sub-field-label">Base Monthly Price (₹ INR) *</label>
                    <div className="sub-currency-input-wrap">
                      <span className="sub-currency-prefix">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        className="sub-currency-input"
                        value={editingPlanPrice.price}
                        onChange={(e) =>
                          setEditingPlanPrice({ ...editingPlanPrice, price: e.target.value })
                        }
                        placeholder="Enter amount in ₹"
                        required
                        autoFocus
                      />
                      <span className="sub-currency-suffix">/ month</span>
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="sub-preset-btn-group">
                    <button
                      type="button"
                      className="sub-preset-btn"
                      onClick={() => {
                        const def = DEFAULT_PLANS.find(p => p.name === editingPlanPrice.name);
                        if (def) setEditingPlanPrice({ ...editingPlanPrice, price: def.price });
                      }}
                    >
                      Reset Default Rate
                    </button>
                    <button
                      type="button"
                      className="sub-preset-btn"
                      onClick={() => {
                        const val = Math.round(Number(editingPlanPrice.price || 0) * 1.1);
                        setEditingPlanPrice({ ...editingPlanPrice, price: val });
                      }}
                    >
                      +10%
                    </button>
                    <button
                      type="button"
                      className="sub-preset-btn"
                      onClick={() => {
                        const val = Math.round(Number(editingPlanPrice.price || 0) * 0.9);
                        setEditingPlanPrice({ ...editingPlanPrice, price: val });
                      }}
                    >
                      -10%
                    </button>
                  </div>

                  {/* Real-time annual calculation */}
                  <div className="sub-form-calc-card is-yearly">
                    <div className="sub-calc-header-row">
                      <span className="sub-calc-title">Standard Annual Total (12 mo):</span>
                      <strong className="sub-calc-val">
                        ₹{(Number(editingPlanPrice.price || 0) * 12).toLocaleString()} / yr
                      </strong>
                    </div>
                    <div className="sub-calc-meta-row" style={{ marginTop: "6px" }}>
                      <span>With 20% Annual Discount:</span>
                      <strong style={{ color: "#15803d", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        ₹{Math.round(Number(editingPlanPrice.price || 0) * 12 * 0.8).toLocaleString()} / yr
                        <span className="sub-calc-save-pill">Save ₹{Math.round(Number(editingPlanPrice.price || 0) * 12 * 0.2).toLocaleString()}</span>
                      </strong>
                    </div>
                  </div>

                  <p className="sub-field-hint">
                    Updating this rate adjusts the baseline catalogue for future organization subscriptions and automatic billing calculations.
                  </p>
                </div>

                <footer className="sub-modal-footer">
                  <button
                    type="button"
                    className="subscriptions-button subscriptions-button-light"
                    onClick={() => setEditingPlanPrice(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="subscriptions-button subscriptions-button-primary"
                  >
                    <Check size={16} /> Save Plan Price
                  </button>
                </footer>
              </form>
            </section>
          </div>,
          document.body
        )}

      {toast && <div className="subscriptions-toast">{toast}</div>}
    </div>
  );
}

function SubscriptionForm({ initial, plans, onClose, onSave }) {
  const availablePlans = plans || DEFAULT_PLANS;
  const [organization, setOrganization] = useState(initial?.organization || "");
  const [contact, setContact] = useState(initial?.contact || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [plan, setPlan] = useState(initial?.plan || "Starter");
  const [billing, setBilling] = useState(initial?.billing || "Monthly");
  const [status, setStatus] = useState(initial?.status || "Active");
  const [started, setStarted] = useState(initial?.started || "2026-10-23");
  const [renewal, setRenewal] = useState(initial?.renewal || "2026-11-23");
  const [payment, setPayment] = useState(initial?.payment || "Paid");
  const [selectedFeatures, setSelectedFeatures] = useState(
    initial?.features || [
      "AI Assistant (Gemini & OpenAI)",
      "50 GB High-Speed Cloud Storage",
      "Immutable Audit Logs & Export"
    ]
  );
  const [error, setError] = useState("");

  const selectedPlan = availablePlans.find((item) => item.name === plan) || availablePlans[0];

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!organization.trim() || !contact.trim() || !email.trim()) {
      setError("Please complete the organization and contact details.");
      return;
    }

    if (new Date(`${renewal}T00:00:00`) < new Date(`${started}T00:00:00`)) {
      setError("Renewal date cannot be earlier than the start date.");
      return;
    }

    const calculatedPrice =
      billing === "Yearly"
        ? Math.round(selectedPlan.price * 12 * 0.8)
        : selectedPlan.price;

    onSave({
      organization: organization.trim(),
      contact: contact.trim(),
      email: email.trim(),
      plan,
      price: calculatedPrice,
      billing,
      status,
      started,
      renewal,
      payment,
      features: selectedFeatures,
    });
  };

  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      className="subscriptions-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="subscriptions-modal subscriptions-form-modal" role="dialog" aria-modal="true">
        <header>
          <div>
            <span className="subscriptions-modal-icon">
              {initial?.id ? <Pencil size={20} /> : <Plus size={22} />}
            </span>
            <div>
              <h2>{initial?.id ? "Edit Subscription Record" : "Create New Subscription"}</h2>
              <p>
                {initial?.id
                  ? `Update subscription contract for ${initial.organization}`
                  : "Provision a new tenant organization subscription contract"}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="subscriptions-icon-button"
            onClick={onClose}
            aria-label="Close form"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="subscriptions-form-grid">
            <div className="sub-form-field">
              <label>Organization Name *</label>
              <input
                value={organization}
                onChange={(event) => setOrganization(event.target.value)}
                placeholder="e.g. Acme Technologies"
                required
              />
            </div>

            <div className="sub-form-field">
              <label>Contact Person *</label>
              <input
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder="e.g. Aarav Sharma"
                required
              />
            </div>

            <div className="sub-form-field sub-form-full">
              <label>Enterprise Contact Email *</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="e.g. contact@company.com"
                required
              />
            </div>

            <div className="sub-form-field">
              <label>Assigned Plan Tier</label>
              <select value={plan} onChange={(event) => setPlan(event.target.value)}>
                {availablePlans.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} Tier — {formatCurrency(item.price)}/mo
                  </option>
                ))}
              </select>
            </div>

            <div className="sub-form-field">
              <label>Billing Cycle</label>
              <select value={billing} onChange={(event) => setBilling(event.target.value)}>
                <option value="Monthly">Monthly Billing (Standard)</option>
                <option value="Yearly">Yearly Billing (20% Discounted)</option>
              </select>
            </div>

            <div className="sub-form-field">
              <label>Contract Status</label>
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="Active">Active (Operational)</option>
                <option value="Trial">Trial (14-day Window)</option>
                <option value="Past Due">Past Due (Payment Pending)</option>
                <option value="Cancelled">Cancelled (Terminated)</option>
              </select>
            </div>

            <div className="sub-form-field">
              <label>Payment Settlement</label>
              <select value={payment} onChange={(event) => setPayment(event.target.value)}>
                <option value="Paid">Paid (Settled)</option>
                <option value="Trial">Trial (No charge)</option>
                <option value="Failed">Failed (Requires Action)</option>
              </select>
            </div>

            <div className="sub-form-field">
              <label>Contract Start Date</label>
              <input
                type="date"
                value={started}
                onChange={(event) => setStarted(event.target.value)}
                required
              />
            </div>

            <div className="sub-form-field">
              <label>Scheduled Renewal Date</label>
              <input
                type="date"
                value={renewal}
                onChange={(event) => setRenewal(event.target.value)}
                required
              />
            </div>
          </div>

          {/* Real-time annual & monthly price calculation */}
          <div className="sub-calc-box-wrap">
            <div className={`sub-form-calc-card ${billing === "Yearly" ? "is-yearly" : "is-monthly"}`}>
              <div className="sub-calc-header-row">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="sub-calc-icon-dot" />
                  <span className="sub-calc-title">
                    {billing === "Yearly" ? "Annual Contract Rate (20% Savings Applied)" : "Monthly Recurring Rate"}
                  </span>
                  {billing === "Yearly" && (
                    <span className="sub-calc-save-pill">20% Off</span>
                  )}
                </div>
                <strong className="sub-calc-big-price">
                  {billing === "Yearly"
                    ? formatCurrency(Math.round(selectedPlan.price * 12 * 0.8)) + " / yr"
                    : formatCurrency(selectedPlan.price) + " / mo"}
                </strong>
              </div>
              <div className="sub-calc-meta-row">
                <span>
                  {billing === "Yearly"
                    ? `Effective monthly rate: ${formatCurrency(Math.round(selectedPlan.price * 0.8))} / mo`
                    : `Annual standard total: ${formatCurrency(selectedPlan.price * 12)} / yr`}
                </span>
                <span style={{ fontWeight: 600 }}>
                  {billing === "Yearly"
                    ? `Annual tenant savings: ${formatCurrency(Math.round(selectedPlan.price * 12 * 0.2))} / yr`
                    : "Switch to Yearly to apply 20% discount"}
                </span>
              </div>
            </div>
          </div>

          {/* Subscribed features manager */}
          <div className="sub-features-section">
            <div className="sub-features-header">
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Sparkles size={14} color="#3b66ff" />
                <span style={{ fontWeight: 650, fontSize: "13px", color: "var(--sa-text-main, #0f172a)" }}>
                  Subscribed Platform Features
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="sub-features-count">{selectedFeatures.length} enabled</span>
                <button
                  type="button"
                  className="sub-quick-link-btn"
                  onClick={() => setSelectedFeatures(ALL_PLATFORM_FEATURES)}
                >
                  Enable All
                </button>
              </div>
            </div>

            <select
              className="sub-feature-select"
              value=""
              onChange={(e) => {
                if (e.target.value && !selectedFeatures.includes(e.target.value)) {
                  setSelectedFeatures([...selectedFeatures, e.target.value]);
                }
              }}
            >
              <option value="">+ Choose feature from catalog to enable...</option>
              {ALL_PLATFORM_FEATURES.map((feat) => (
                <option key={feat} value={feat}>{feat}</option>
              ))}
            </select>

            <div className="sub-features-chips-container">
              {selectedFeatures.map((feat) => (
                <span key={feat} className="sub-feature-chip">
                  <Check size={12} color="#16a34a" />
                  <span>{feat}</span>
                  <button
                    type="button"
                    className="sub-chip-remove"
                    onClick={() => setSelectedFeatures(selectedFeatures.filter(f => f !== feat))}
                    title="Remove feature"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {error && <div className="subscriptions-form-error">{error}</div>}

          <footer>
            <button
              type="button"
              className="subscriptions-button subscriptions-button-light"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="subscriptions-button subscriptions-button-primary"
            >
              <Check size={16} />
              {initial?.id ? "Save Changes" : "Create Subscription"}
            </button>
          </footer>
        </form>
      </section>
    </div>,
    document.body
  );
}

export default Subscriptions;
