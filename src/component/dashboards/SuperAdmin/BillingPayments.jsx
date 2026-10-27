import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Receipt,
  Download,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  CreditCard,
  Building2,
  ChevronDown,
  X,
  Eye,
  SlidersHorizontal,
  RefreshCw,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Check,
  ExternalLink,
  FileText,
  Smartphone,
  Calendar,
  DollarSign,
  Landmark,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./BillingPayments.css";

const DUMMY_COMPANY_LOGOS = {
  "ABC Technologies": {
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    type: "hexagon",
  },
  "XYZ Software": {
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    type: "star",
  },
  "NovaTech Solutions": {
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #ec4899, #be185d)",
    type: "grid",
  },
  "PixelCraft Studio": {
    url: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #0284c7, #0369a1)",
    type: "polygon",
  },
  "Orbit Creative": {
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #6366f1, #4f46e5)",
    type: "orbit",
  },
  "Summit Works": {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #059669, #047857)",
    type: "peak",
  },
  "CloudNine Tech": {
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    type: "cloud",
  },
  "Acme Technologies": {
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    type: "hexagon",
  },
  "Bright Labs": {
    url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    type: "spark",
  },
  "Greenline Tech": {
    url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    type: "leaf",
  },
  "NextGen Works": {
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    type: "cube",
  },
};

function CompanyLogo({ organization = "", size = 34 }) {
  const [imgError, setImgError] = useState(false);
  const brand = DUMMY_COMPANY_LOGOS[organization] || {
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #3b66ff, #1d4ed8)",
    type: "default",
  };

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

  if (imgError || !brand.url) {
    return (
      <div
        className="bp-company-logo-wrap is-vector-brand"
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
      className="bp-company-logo-wrap"
      style={{ width: size, height: size, minWidth: size }}
      title={organization}
      aria-label={`${organization} logo`}
    >
      <img
        src={brand.url}
        alt={`${organization} logo`}
        className="bp-company-logo-img"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

const INITIAL_TRANSACTIONS = [
  {
    id: "TXN-9021",
    org: "ABC Technologies",
    customer: "Rahul Sharma",
    email: "rahul@abc.com",
    amount: 7999,
    plan: "Business Plan",
    gateway: "Razorpay",
    method: "UPI (Google Pay)",
    date: "Today, 10:45 AM",
    status: "Succeeded",
  },
  {
    id: "TXN-9020",
    org: "XYZ Software",
    customer: "Amit Verma",
    email: "amit@xyz.com",
    amount: 2499,
    plan: "Pro Plan",
    gateway: "Stripe",
    method: "Visa •••• 4242",
    date: "Today, 09:20 AM",
    status: "Succeeded",
  },
  {
    id: "TXN-9019",
    org: "NovaTech Solutions",
    customer: "Priya Nair",
    email: "priya@novatech.io",
    amount: 24999,
    plan: "Enterprise Plan",
    gateway: "Stripe",
    method: "Mastercard •••• 8821",
    date: "Yesterday, 04:12 PM",
    status: "Succeeded",
  },
  {
    id: "TXN-9018",
    org: "PixelCraft Studio",
    customer: "David Chen",
    email: "david@pixelcraft.co",
    amount: 2499,
    plan: "Pro Plan",
    gateway: "Razorpay",
    method: "Net Banking (HDFC)",
    date: "Yesterday, 02:30 PM",
    status: "Pending",
  },
  {
    id: "TXN-9017",
    org: "Orbit Creative",
    customer: "Elena Rostova",
    email: "elena@orbit.com",
    amount: 7999,
    plan: "Business Plan",
    gateway: "Razorpay",
    method: "Card •••• 1092",
    date: "Oct 24, 2024",
    status: "Refunded",
  },
  {
    id: "TXN-9016",
    org: "Summit Works",
    customer: "Vikram Malhotra",
    email: "vikram@summit.org",
    amount: 2499,
    plan: "Pro Plan",
    gateway: "Stripe",
    method: "Card •••• 6632",
    date: "Oct 24, 2024",
    status: "Failed",
  },
  {
    id: "TXN-9015",
    org: "CloudNine Tech",
    customer: "Ananya Sen",
    email: "ananya@cloudnine.dev",
    amount: 24999,
    plan: "Enterprise Plan",
    gateway: "Bank Wire",
    method: "NEFT / RTGS",
    date: "Oct 23, 2024",
    status: "Succeeded",
  },
  {
    id: "TXN-9014",
    org: "Acme Technologies",
    customer: "Aarav Sharma",
    email: "aarav@acme.demo",
    amount: 24999,
    plan: "Enterprise Plan",
    gateway: "Stripe",
    method: "Visa •••• 9912",
    date: "Oct 22, 2024",
    status: "Succeeded",
  },
  {
    id: "TXN-9013",
    org: "Bright Labs",
    customer: "Karan Joshi",
    email: "karan@bright.demo",
    amount: 1999,
    plan: "Starter Plan",
    gateway: "Razorpay",
    method: "UPI (PhonePe)",
    date: "Oct 22, 2024",
    status: "Succeeded",
  },
  {
    id: "TXN-9012",
    org: "Greenline Tech",
    customer: "Isha Kapoor",
    email: "isha@greenline.demo",
    amount: 1999,
    plan: "Starter Plan",
    gateway: "Razorpay",
    method: "Card •••• 5541",
    date: "Oct 21, 2024",
    status: "Succeeded",
  },
  {
    id: "TXN-9011",
    org: "NextGen Works",
    customer: "Ananya Das",
    email: "ananya@nextgen.demo",
    amount: 7999,
    plan: "Business Plan",
    gateway: "Stripe",
    method: "Mastercard •••• 3021",
    date: "Oct 21, 2024",
    status: "Succeeded",
  },
];

const REVENUE_TREND_7D = [
  { day: "Mon", date: "Oct 21", vol: 24500, count: 12, rate: "100%" },
  { day: "Tue", date: "Oct 22", vol: 38200, count: 18, rate: "99.2%" },
  { day: "Wed", date: "Oct 23", vol: 41000, count: 21, rate: "100%" },
  { day: "Thu", date: "Oct 24", vol: 29800, count: 14, rate: "98.5%" },
  { day: "Fri", date: "Oct 25", vol: 54600, count: 27, rate: "100%" },
  { day: "Sat", date: "Oct 26", vol: 62000, count: 31, rate: "100%", isPeak: true },
  { day: "Sun", date: "Oct 27", vol: 48900, count: 24, rate: "99.5%" },
];

const REVENUE_TREND_30D = [
  { day: "Sat", date: "Sep 28", vol: 31200, count: 14, rate: "100%" },
  { day: "Sun", date: "Sep 29", vol: 28400, count: 12, rate: "99.1%" },
  { day: "Mon", date: "Sep 30", vol: 36500, count: 17, rate: "100%" },
  { day: "Tue", date: "Oct 01", vol: 42100, count: 19, rate: "99.5%" },
  { day: "Wed", date: "Oct 02", vol: 39000, count: 18, rate: "100%" },
  { day: "Thu", date: "Oct 03", vol: 45200, count: 21, rate: "100%" },
  { day: "Fri", date: "Oct 04", vol: 51800, count: 25, rate: "99.0%" },
  { day: "Sat", date: "Oct 05", vol: 58400, count: 28, rate: "100%" },
  { day: "Sun", date: "Oct 06", vol: 33900, count: 15, rate: "100%" },
  { day: "Mon", date: "Oct 07", vol: 41200, count: 19, rate: "98.8%" },
  { day: "Tue", date: "Oct 08", vol: 37800, count: 17, rate: "100%" },
  { day: "Wed", date: "Oct 09", vol: 44600, count: 22, rate: "99.4%" },
  { day: "Thu", date: "Oct 10", vol: 48100, count: 23, rate: "100%" },
  { day: "Fri", date: "Oct 11", vol: 53200, count: 26, rate: "100%" },
  { day: "Sat", date: "Oct 12", vol: 49500, count: 24, rate: "99.2%" },
  { day: "Sun", date: "Oct 13", vol: 27800, count: 11, rate: "100%" },
  { day: "Mon", date: "Oct 14", vol: 42500, count: 20, rate: "100%" },
  { day: "Tue", date: "Oct 15", vol: 46100, count: 22, rate: "98.9%" },
  { day: "Wed", date: "Oct 16", vol: 40300, count: 18, rate: "100%" },
  { day: "Thu", date: "Oct 17", vol: 35700, count: 16, rate: "100%" },
  { day: "Fri", date: "Oct 18", vol: 56900, count: 28, rate: "99.3%" },
  { day: "Sat", date: "Oct 19", vol: 52400, count: 25, rate: "100%" },
  { day: "Sun", date: "Oct 20", vol: 31000, count: 14, rate: "100%" },
  { day: "Mon", date: "Oct 21", vol: 24500, count: 12, rate: "100%" },
  { day: "Tue", date: "Oct 22", vol: 38200, count: 18, rate: "99.2%" },
  { day: "Wed", date: "Oct 23", vol: 41000, count: 21, rate: "100%" },
  { day: "Thu", date: "Oct 24", vol: 29800, count: 14, rate: "98.5%" },
  { day: "Fri", date: "Oct 25", vol: 54600, count: 27, rate: "100%" },
  { day: "Sat", date: "Oct 26", vol: 62000, count: 31, rate: "100%", isPeak: true },
  { day: "Sun", date: "Oct 27", vol: 48900, count: 24, rate: "99.5%" },
];

function BillingPayments() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gatewayFilter, setGatewayFilter] = useState("All");
  const [density, setDensity] = useState("standard");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [toast, setToast] = useState("");
  const [activeDayIndex, setActiveDayIndex] = useState(5); // Saturday peak by default
  const [chartRange, setChartRange] = useState("7D"); // 7D or 30D
  const [pageSize, setPageSize] = useState(10);

  const activeTrend = useMemo(() => {
    return chartRange === "30D" ? REVENUE_TREND_30D : REVENUE_TREND_7D;
  }, [chartRange]);

  const handleRangeChange = (range) => {
    setChartRange(range);
    if (range === "30D") {
      setActiveDayIndex(28); // Oct 26 peak in 30D array
    } else {
      setActiveDayIndex(5); // Saturday peak in 7D array
    }
  };

  const totalVolume = useMemo(() => {
    return activeTrend.reduce((acc, curr) => acc + curr.vol, 0);
  }, [activeTrend]);

  const avgDailyVolume = useMemo(() => {
    return Math.round(totalVolume / activeTrend.length);
  }, [totalVolume, activeTrend]);

  const peakDayItem = useMemo(() => {
    return activeTrend.reduce((max, curr) => (curr.vol > max.vol ? curr : max), activeTrend[0]);
  }, [activeTrend]);

  const activeDayData = activeTrend[activeDayIndex] || activeTrend[activeTrend.length - 1];

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return transactions.filter((t) => {
      const matchesSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.org.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.plan.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" || t.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesGateway =
        gatewayFilter === "All" || t.gateway.toLowerCase() === gatewayFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesGateway;
    });
  }, [transactions, searchQuery, statusFilter, gatewayFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedTransactions.map((t) => t.id)));
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

  const handleRefund = (id) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Refunded" } : t))
    );
    if (selectedTxn && selectedTxn.id === id) {
      setSelectedTxn((prev) => ({ ...prev, status: "Refunded" }));
    }
    notify(`Transaction ${id} has been refunded successfully.`);
  };

  const handleForceRecheck = (id) => {
    notify(`Gateway clearing ping sent for ${id}. Status confirmed as Succeeded.`);
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Succeeded" } : t))
    );
    if (selectedTxn && selectedTxn.id === id) {
      setSelectedTxn((prev) => ({ ...prev, status: "Succeeded" }));
    }
  };

  const handleDownloadReceipt = (tx) => {
    const gross = tx.amount;
    const fee = (gross * 0.02).toFixed(2);
    const gst = (gross * 0.02 * 0.18).toFixed(2);
    const net = (gross * 0.9764).toFixed(2);

    const content = `================================================================================
TEAMFLOW AI — OFFICIAL PAYMENT SETTLEMENT RECEIPT
================================================================================
Settlement ID:      REC-${tx.id.replace("TXN-", "")}
Transaction Ref:    ${tx.id}
Execution Date:     ${tx.date}
Organization:       ${tx.org}
Primary Contact:    ${tx.customer} <${tx.email}>
Plan Subscription:  ${tx.plan}
Payment Gateway:    ${tx.gateway}
Payment Method:     ${tx.method}
Settlement Status:  ${tx.status.toUpperCase()}
--------------------------------------------------------------------------------
FINANCIAL BREAKDOWN (INR):
Gross Payment:      ₹${gross.toLocaleString()}.00
Gateway Fee (2%):   -₹${fee}
GST on Fee (18%):   -₹${gst}
--------------------------------------------------------------------------------
Net Tenant Payout:  ₹${net}
================================================================================
Cleared into: HDFC Bank Virtual Corporate Escrow Account
Gateway Protocol: ISO-8583 Encrypted Multi-Tenant Settlement
TeamFlow AI Platform Super Admin Billing Subsystem
================================================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt_${tx.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify(`Settlement receipt for ${tx.id} downloaded successfully.`);
  };

  const handleExportCSV = () => {
    const headers = [
      "Transaction ID",
      "Organization",
      "Customer",
      "Email",
      "Amount INR",
      "Plan Tier",
      "Gateway",
      "Method",
      "Date",
      "Status",
    ];

    const rows = filteredTransactions.map((t) => [
      t.id,
      t.org,
      t.customer,
      t.email,
      t.amount,
      t.plan,
      t.gateway,
      t.method,
      t.date,
      t.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers, ...rows]
        .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "teamflow_billing_settlements.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("Exported settlement transactions spreadsheet.");
  };

  return (
    <div className="billing-payments-page">
      {/* 1. SAP Master Header Bar */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>Billing &amp; Payment Settlement Gateway</h1>
          <p className="sap-header-subtitle">
            Real-time payment gateway telemetry, settlement payouts, chargeback audits, and multi-gateway logs.
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
        </div>
      </section>

      {/* 2. Top 4 Telemetry Cards */}
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <span className="sa-kpi-currency-symbol">₹</span>
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Monthly Settled Volume</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">₹2.48L</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 16%
              </span>
            </div>
            <span className="sa-kpi-subtitle">142 paid renewals this cycle</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <CreditCard size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Gateway Success Rate</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">99.4%</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 0.3%
              </span>
            </div>
            <span className="sa-kpi-subtitle">Razorpay &amp; Stripe combined</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <RotateCcw size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Refunds &amp; Chargebacks</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">₹7,999</span>
              <span className="sa-kpi-trend negative">
                <ArrowDownRight size={14} /> 0.4%
              </span>
            </div>
            <span className="sa-kpi-subtitle">1 processed this month</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box sky">
            <Receipt size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Next Scheduled Settlement</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">₹84,200</span>
              <span className="sa-kpi-trend positive">
                <Clock size={14} /> In 24h
              </span>
            </div>
            <span className="sa-kpi-subtitle">Automated bank clearing</span>
          </div>
        </article>
      </section>

      {/* 3. Interactive Daily Processed Volume Chart Card */}
      <section className="sa-card sa-volume-chart-card">
        <div className="sa-chart-header-row">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={18} color="#3b66ff" />
              <h3>Daily Processed Payout Volume</h3>
              <span className="sa-chart-period-badge">Real-Time Telemetry</span>
            </div>
            <p className="sa-chart-subtitle">
              Daily settlement volumes cleared through Razorpay, Stripe, and Bank Wire escrow channels
            </p>
          </div>

          <div className="sa-chart-header-controls">
            <div className="sa-chart-pill-switch">
              <button
                type="button"
                className={`sa-chart-pill-btn ${chartRange === "7D" ? "active" : ""}`}
                onClick={() => handleRangeChange("7D")}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                className={`sa-chart-pill-btn ${chartRange === "30D" ? "active" : ""}`}
                onClick={() => handleRangeChange("30D")}
              >
                Last 30 Days
              </button>
            </div>
            <div className="sa-total-tag">
              <Sparkles size={13} color="#16a34a" />
              <strong>
                {chartRange === "30D"
                  ? `₹${totalVolume.toLocaleString()} last 30 days`
                  : `₹${totalVolume.toLocaleString()} this week`}
              </strong>
            </div>
          </div>
        </div>

        {/* Selected Day Interactive Highlight Banner */}
        <div className="sa-chart-selected-banner">
          <div className="sa-selected-day-meta">
            <span className={`sa-selected-dot ${activeDayData.isPeak ? "is-peak" : ""}`} />
            <span className="sa-selected-day-title">
              {activeDayData.day}, {activeDayData.date} Settlement Telemetry:
            </span>
            <strong className="sa-selected-vol">
              ₹{activeDayData.vol.toLocaleString()}
            </strong>
          </div>
          <div className="sa-selected-metrics-pills">
            <span className="sa-metric-chip">
              <CheckCircle2 size={12} color="#16a34a" /> {activeDayData.count} Transactions
            </span>
            <span className="sa-metric-chip">
              <Clock size={12} color="#3b66ff" /> {activeDayData.rate} Success Rate
            </span>
            {activeDayData.isPeak && (
              <span className="sa-metric-chip is-peak">
                ★ Highest Peak Volume
              </span>
            )}
          </div>
        </div>

        {/* Interactive Chart Canvas with Reference Grid */}
        <div className="sa-chart-canvas-wrap">
          {/* Background Reference Gridlines */}
          <div className="sa-chart-gridlines">
            <div className="sa-gridline"><span className="sa-gridline-label">₹60k</span></div>
            <div className="sa-gridline"><span className="sa-gridline-label">₹40k</span></div>
            <div className="sa-gridline"><span className="sa-gridline-label">₹20k</span></div>
            <div className="sa-gridline"><span className="sa-gridline-label">₹0k</span></div>
          </div>

          {/* Bar Columns Container */}
          <div className={`sa-chart-bars ${chartRange === "30D" ? "is-30d" : "is-7d"}`}>
            {activeTrend.map((item, idx) => {
              const heightPercent = Math.max(14, (item.vol / 65000) * 100);
              const isSelected = activeDayIndex === idx;

              return (
                <div
                  key={`${item.date}-${idx}`}
                  className={`sa-bar-col ${isSelected ? "is-selected" : ""} ${item.isPeak ? "is-peak" : ""}`}
                  onClick={() => setActiveDayIndex(idx)}
                  onMouseEnter={() => setActiveDayIndex(idx)}
                  title={`${item.day}, ${item.date}: ₹${item.vol.toLocaleString()} (${item.count} payouts, ${item.rate} SLA)`}
                >
                  <span className="sa-bar-val-pill">
                    ₹{(item.vol / 1000).toFixed(0)}k
                  </span>

                  <div className="sa-bar-track">
                    <div
                      className="sa-bar-fill"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <div className="sa-bar-label-group">
                    {chartRange === "7D" ? (
                      <>
                        <span className="sa-bar-day">{item.day}</span>
                        <span className="sa-bar-date">{item.date}</span>
                      </>
                    ) : (
                      <>
                        <span className="sa-bar-day-30d">
                          {item.date.split(" ")[1]}
                        </span>
                        {(idx === 0 || item.date === "Oct 01" || idx === 15 || idx === 29) && (
                          <span className="sa-bar-month-tag">
                            {item.date.split(" ")[0]}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Bottom Telemetry Stat Chips */}
        <div className="sa-chart-quick-stats">
          <div className="sa-quick-stat-item">
            <small>{chartRange === "30D" ? "30-Day Payout Total" : "Weekly Payout Total"}</small>
            <strong>₹{totalVolume.toLocaleString()}</strong>
          </div>
          <div className="sa-quick-stat-item">
            <small>Average Daily Volume</small>
            <strong>₹{avgDailyVolume.toLocaleString()} / day</strong>
          </div>
          <div className="sa-quick-stat-item">
            <small>Peak Clearing Day</small>
            <strong style={{ color: "#16a34a" }}>
              {peakDayItem.day}, {peakDayItem.date} (₹{peakDayItem.vol.toLocaleString()})
            </strong>
          </div>
          <div className="sa-quick-stat-item">
            <small>Gateway Clearance SLA</small>
            <strong style={{ color: "#3b66ff" }}>
              {chartRange === "30D" ? "99.2% On-Time" : "99.4% On-Time"}
            </strong>
          </div>
        </div>
      </section>

      {toast && (
        <div className="sa-toast-banner">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* 4. The SAP Table Card */}
      <section className="sap-table-card">
        {/* Multi-Selection Batch Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="sap-batch-banner">
            <span>
              <strong>{selectedIds.size}</strong> settlements selected
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
                className="sa-btn sa-btn-danger sa-btn-sm"
                onClick={() => {
                  setTransactions((prev) =>
                    prev.map((t) => (selectedIds.has(t.id) && t.status === "Succeeded" ? { ...t, status: "Refunded" } : t))
                  );
                  notify(`${selectedIds.size} transactions marked as Refunded.`);
                  setSelectedIds(new Set());
                }}
              >
                <RotateCcw size={13} /> Batch Refund
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
                placeholder="Search transaction ID, customer, organization, email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
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
              <option value="Succeeded">Succeeded (Settled)</option>
              <option value="Pending">Pending (Processing)</option>
              <option value="Refunded">Refunded</option>
              <option value="Failed">Failed</option>
            </select>

            <select
              className="sap-filter-select"
              value={gatewayFilter}
              onChange={(e) => {
                setGatewayFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Gateway: All Gateways</option>
              <option value="Razorpay">Razorpay Gateway</option>
              <option value="Stripe">Stripe Payments</option>
              <option value="Bank Wire">Bank Wire Escrow</option>
            </select>
          </div>

          <div className="sap-toolbar-right">
            {/* Table Density Switcher */}
            <button
              type="button"
              className="sap-icon-btn"
              onClick={() => setDensity((d) => (d === "standard" ? "compact" : "standard"))}
              title={`Switch table density (currently ${density})`}
            >
              <SlidersHorizontal size={15} />
            </button>

            {/* Reset Filters */}
            <button
              type="button"
              className="sap-icon-btn"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("All");
                setGatewayFilter("All");
                setPage(1);
              }}
              title="Reset all filters"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* 5. The SAP Table Data Grid */}
        <div className="sap-table-wrapper">
          <table className={`sap-grid is-${density}`}>
            <thead>
              <tr>
                <th style={{ width: 38, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      paginatedTransactions.length > 0 &&
                      paginatedTransactions.every((t) => selectedIds.has(t.id))
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ width: 110 }}>Txn ID</th>
                <th>Organization &amp; Customer</th>
                <th>Amount (INR)</th>
                <th>Plan Tier</th>
                <th>Gateway &amp; Method</th>
                <th>Timestamp</th>
                <th>Settlement Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((tx) => {
                const isSelected = selectedIds.has(tx.id);
                const tierClass =
                  tx.plan.toLowerCase().includes("enterprise")
                    ? "tier-enterprise"
                    : tx.plan.toLowerCase().includes("business")
                    ? "tier-business"
                    : "tier-starter";

                const gatewayClass =
                  tx.gateway.toLowerCase().includes("razorpay")
                    ? "gateway-razorpay"
                    : tx.gateway.toLowerCase().includes("stripe")
                    ? "gateway-stripe"
                    : "gateway-bank";

                return (
                  <tr key={tx.id} className={isSelected ? "is-selected" : ""}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(tx.id)}
                      />
                    </td>
                    <td>
                      <span className="sap-id-cell">{tx.id}</span>
                    </td>
                    <td>
                      <div className="sap-user-badge">
                        <CompanyLogo organization={tx.org} size={34} />
                        <div className="sap-user-info">
                          <strong className="sap-user-name">{tx.org}</strong>
                          <span className="sap-user-email">
                            {tx.customer} · {tx.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 750, fontSize: "13.5px" }}>
                        ₹{tx.amount.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className={`sub-tier-badge ${tierClass}`}>
                        {tx.plan}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span className={`bp-gateway-tag ${gatewayClass}`}>
                          {tx.gateway}
                        </span>
                        <div style={{ color: "var(--sa-text-muted)", fontSize: "11px" }}>
                          {tx.method}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "var(--sa-text-muted)", fontSize: "12px", whiteSpace: "nowrap" }}>
                      {tx.date}
                    </td>
                    <td>
                      <span className={`bp-status-pill status-${tx.status.toLowerCase()}`}>
                        <span className="bp-status-dot" />
                        {tx.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="bp-action-group">
                        <button
                          type="button"
                          className="bp-action-btn btn-view"
                          onClick={() => setSelectedTxn(tx)}
                          title="View Full Transaction Receipt"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          className="bp-action-btn btn-download"
                          onClick={() => handleDownloadReceipt(tx)}
                          title="Download Receipt (TXT)"
                        >
                          <Download size={14} />
                        </button>
                        {tx.status === "Succeeded" && (
                          <button
                            type="button"
                            className="bp-action-btn btn-refund"
                            onClick={() => handleRefund(tx.id)}
                            title="Process Refund"
                          >
                            <RotateCcw size={14} />
                          </button>
                        )}
                        {tx.status === "Pending" && (
                          <button
                            type="button"
                            className="bp-action-btn btn-retry"
                            onClick={() => handleForceRecheck(tx.id)}
                            title="Force Verify Settlement"
                          >
                            <RefreshCw size={14} />
                          </button>
                        )}
                        {tx.status === "Failed" && (
                          <button
                            type="button"
                            className="bp-action-btn btn-retry"
                            onClick={() => handleForceRecheck(tx.id)}
                            title="Retry Settlement Link"
                          >
                            <RotateCcw size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedTransactions.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "40px" }}>
                    No transactions match your search query or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 6. The SAP Footer Bar */}
        <div className="sap-footer-bar">
          <div className="sap-footer-counts" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="sap-counter">
              Showing{" "}
              <strong>
                {filteredTransactions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(currentPage * pageSize, filteredTransactions.length)}
              </strong>{" "}
              of <strong>{filteredTransactions.length}</strong> transactions
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

      {/* 7. Redesigned Transaction Detail Modal with Portaled Overlay */}
      {selectedTxn &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="sa-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedTxn(null);
            }}
          >
            <div
              className="sa-txn-modal-dialog"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sa-txn-modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="sa-txn-icon-chip">
                    <Receipt size={20} color="#3b66ff" />
                  </span>
                  <div>
                    <h2>Transaction Receipt &amp; Audit Log</h2>
                    <p className="sa-txn-ref-tag">
                      Reference ID: <strong>{selectedTxn.id}</strong>
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className={`bp-status-pill status-${selectedTxn.status.toLowerCase()}`}>
                    <span className="bp-status-dot" />
                    {selectedTxn.status}
                  </span>
                  <button
                    type="button"
                    className="sa-modal-close"
                    onClick={() => setSelectedTxn(null)}
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="sa-txn-modal-body">
                {/* Hero Amount Banner Card */}
                <div className="sa-txn-hero-card">
                  <div className="sa-hero-amount-cell">
                    <small>Total Settled Amount</small>
                    <strong className="sa-hero-big-amount">
                      ₹{selectedTxn.amount.toLocaleString()}.00
                    </strong>
                    <span className="sa-hero-subtext">
                      Cleared via {selectedTxn.gateway} ({selectedTxn.method}) on {selectedTxn.date}
                    </span>
                  </div>
                  <div className="sa-hero-escrow-badge">
                    <ShieldCheck size={16} color="#16a34a" />
                    <span>Funds Escrowed (T+1 SLA)</span>
                  </div>
                </div>

                {/* 2-Column Info Grid */}
                <div className="sa-txn-grid">
                  {/* Card 1: Customer & Organization Info */}
                  <div className="sa-txn-info-card">
                    <h4 className="sa-card-section-title">
                      <Building2 size={14} color="#3b66ff" />
                      Tenant &amp; Customer Information
                    </h4>

                    <div className="sa-txn-field">
                      <label>Organization</label>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <CompanyLogo organization={selectedTxn.org} size={28} />
                        <strong>{selectedTxn.org}</strong>
                      </div>
                    </div>

                    <div className="sa-txn-field">
                      <label>Primary Customer Contact</label>
                      <span>{selectedTxn.customer}</span>
                      <small style={{ color: "#64748b" }}>{selectedTxn.email}</small>
                    </div>

                    <div className="sa-txn-field">
                      <label>Plan Subscription Entitlement</label>
                      <span className="sub-tier-badge tier-business">
                        {selectedTxn.plan}
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Payment Gateway Telemetry */}
                  <div className="sa-txn-info-card">
                    <h4 className="sa-card-section-title">
                      <CreditCard size={14} color="#3b66ff" />
                      Gateway Settlement Telemetry
                    </h4>

                    <div className="sa-txn-field">
                      <label>Processing Gateway</label>
                      <span className="bp-gateway-tag gateway-razorpay">
                        {selectedTxn.gateway} Processing Gateway
                      </span>
                    </div>

                    <div className="sa-txn-field">
                      <label>Payment Method</label>
                      <span>{selectedTxn.method}</span>
                    </div>

                    <div className="sa-txn-field">
                      <label>Execution Timestamp</label>
                      <span>{selectedTxn.date} (IST)</span>
                    </div>

                    <div className="sa-txn-field">
                      <label>Gateway Authorization Code</label>
                      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "12px", color: "#3b66ff", fontWeight: 700 }}>
                        AUTH-{selectedTxn.id.replace("TXN-", "")}-TF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Settlement Ledger Fee Breakdown */}
                <div className="sa-txn-ledger-card">
                  <div className="sa-ledger-header">
                    <Landmark size={14} color="#16a34a" />
                    <span>Settlement Clearing &amp; Tax Deductions Breakdown</span>
                  </div>

                  <div className="sa-ledger-body">
                    <div className="sa-ledger-row">
                      <span>Gross Authorized Amount:</span>
                      <strong>₹{selectedTxn.amount.toLocaleString()}.00</strong>
                    </div>
                    <div className="sa-ledger-row">
                      <span>Payment Gateway Processing Fee (2.0%):</span>
                      <span style={{ color: "#dc2626" }}>-₹{(selectedTxn.amount * 0.02).toFixed(2)}</span>
                    </div>
                    <div className="sa-ledger-row">
                      <span>GST on Processing Fee (18%):</span>
                      <span style={{ color: "#dc2626" }}>-₹{(selectedTxn.amount * 0.02 * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="sa-ledger-row sa-ledger-total">
                      <span>Net Organization Settlement Payout:</span>
                      <strong style={{ color: "#16a34a", fontSize: "14px" }}>
                        ₹{(selectedTxn.amount * 0.9764).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sa-txn-modal-footer">
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary"
                  onClick={() => setSelectedTxn(null)}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="sa-btn sa-btn-secondary"
                  onClick={() => handleDownloadReceipt(selectedTxn)}
                >
                  <Download size={14} /> Download Receipt (TXT)
                </button>

                {selectedTxn.status === "Succeeded" && (
                  <button
                    type="button"
                    className="sa-btn sa-btn-danger"
                    onClick={() => handleRefund(selectedTxn.id)}
                  >
                    <RotateCcw size={14} /> Process Full Refund
                  </button>
                )}

                {selectedTxn.status === "Pending" && (
                  <button
                    type="button"
                    className="sa-btn sa-btn-primary"
                    onClick={() => handleForceRecheck(selectedTxn.id)}
                  >
                    <RefreshCw size={14} /> Force Status Verification
                  </button>
                )}

                {selectedTxn.status === "Failed" && (
                  <button
                    type="button"
                    className="sa-btn sa-btn-primary"
                    onClick={() => handleForceRecheck(selectedTxn.id)}
                  >
                    <RotateCcw size={14} /> Retry Gateway Charge
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default BillingPayments;
