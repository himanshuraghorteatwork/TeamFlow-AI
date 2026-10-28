import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  FileText,
  Download,
  Search,
  Filter,
  ArrowUpRight,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
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
  Mail,
  Copy,
  Check,
  ShieldCheck,
  Receipt,
  Landmark,
  BadgeCheck,
  Calendar,
  Send,
  AlertTriangle,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Invoices.css";

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
  "DesignHub": {
    url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    type: "leaf",
  },
  "NextGen Solutions": {
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    type: "cube",
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
  "CloudNine Tech": {
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=120&auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    type: "cloud",
  },
};

function CompanyLogo({ organization = "", size = 32 }) {
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
        className="inv-company-logo-wrap is-vector-brand"
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
      className="inv-company-logo-wrap"
      style={{ width: size, height: size, minWidth: size }}
      title={organization}
      aria-label={`${organization} logo`}
    >
      <img
        src={brand.url}
        alt={`${organization} logo`}
        className="inv-company-logo-img"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

const INITIAL_INVOICES = [
  {
    id: "INV-2024-1089",
    org: "ABC Technologies",
    contact: "Himanshu Rao",
    email: "billing@abc.com",
    gstin: "27AABCA1234D1Z5",
    plan: "Business Plan (Monthly)",
    planDescription: "Full platform SaaS multi-tenant licensing & high-speed token allocation",
    subtotal: 6778.81,
    gst: 1220.19,
    total: 7999,
    issueDate: "2024-10-01",
    dueDate: "2024-10-15",
    status: "Paid",
    method: "Razorpay Corporate Auto-Debit",
    gatewayRef: "PAY-RAZ-90218-IND",
    state: "Maharashtra (27)",
  },
  {
    id: "INV-2024-1088",
    org: "XYZ Software",
    contact: "Amit Verma",
    email: "accounts@xyz.com",
    gstin: "29AABCZ5678F1Z2",
    plan: "Pro Plan (Monthly)",
    planDescription: "Pro Developer Tier with 15 seats & automated workflow triggers",
    subtotal: 2117.8,
    gst: 381.2,
    total: 2499,
    issueDate: "2024-10-03",
    dueDate: "2024-10-17",
    status: "Paid",
    method: "Stripe Corporate Card (•••• 4242)",
    gatewayRef: "PAY-STR-84019-INT",
    state: "Karnataka (29)",
  },
  {
    id: "INV-2024-1087",
    org: "NovaTech Solutions",
    contact: "Priya Nair",
    email: "finance@novatech.io",
    gstin: "07AAACN9012K1Z8",
    plan: "Enterprise Plan (Monthly)",
    planDescription: "Enterprise Sovereign Cluster, unlimited SSO seats & 99.99% uptime SLA",
    subtotal: 21185.59,
    gst: 3813.41,
    total: 24999,
    issueDate: "2024-10-05",
    dueDate: "2024-10-19",
    status: "Paid",
    method: "HDFC Virtual Escrow Bank Transfer",
    gatewayRef: "NEFT-HDFC-993012",
    state: "Delhi (07)",
  },
  {
    id: "INV-2024-1086",
    org: "PixelCraft Studio",
    contact: "David Chen",
    email: "david@pixelcraft.co",
    gstin: "06AABCP3456L1Z4",
    plan: "Pro Plan (Monthly)",
    planDescription: "Pro Developer Tier with 15 seats & automated workflow triggers",
    subtotal: 2117.8,
    gst: 381.2,
    total: 2499,
    issueDate: "2024-10-12",
    dueDate: "2024-10-26",
    status: "Pending",
    method: "UPI (Google Pay Automated)",
    gatewayRef: "UPI-ICICI-001923",
    state: "Haryana (06)",
  },
  {
    id: "INV-2024-1085",
    org: "DesignHub",
    contact: "Rohan Kapoor",
    email: "billing@designhub.in",
    gstin: "33AABCD7890M1Z9",
    plan: "Pro Plan (Monthly)",
    planDescription: "Pro Developer Tier with 15 seats & automated workflow triggers",
    subtotal: 2117.8,
    gst: 381.2,
    total: 2499,
    issueDate: "2024-10-02",
    dueDate: "2024-10-16",
    status: "Overdue",
    method: "Mastercard •••• 5541 (Declined)",
    gatewayRef: "RETRY-STR-10492",
    state: "Tamil Nadu (33)",
  },
  {
    id: "INV-2024-1084",
    org: "NextGen Solutions",
    contact: "Sana Sheikh",
    email: "sana@nextgen.com",
    gstin: "27AABCN4321P1Z1",
    plan: "Business Plan (Monthly)",
    planDescription: "Full platform SaaS multi-tenant licensing & high-speed token allocation",
    subtotal: 6778.81,
    gst: 1220.19,
    total: 7999,
    issueDate: "2024-09-28",
    dueDate: "2024-10-12",
    status: "Paid",
    method: "Stripe Corporate Card (•••• 3021)",
    gatewayRef: "PAY-STR-77102-INT",
    state: "Maharashtra (27)",
  },
  {
    id: "INV-2024-1083",
    org: "Orbit Creative",
    contact: "Elena Rostova",
    email: "elena@orbit.com",
    gstin: "27AABCO9921D1Z3",
    plan: "Business Plan (Monthly)",
    planDescription: "Full platform SaaS multi-tenant licensing & high-speed token allocation",
    subtotal: 6778.81,
    gst: 1220.19,
    total: 7999,
    issueDate: "2024-09-24",
    dueDate: "2024-10-08",
    status: "Paid",
    method: "Razorpay Corporate Card (•••• 1092)",
    gatewayRef: "PAY-RAZ-66102-IND",
    state: "Maharashtra (27)",
  },
  {
    id: "INV-2024-1082",
    org: "Summit Works",
    contact: "Vikram Malhotra",
    email: "vikram@summit.org",
    gstin: "07AABCS4412K1Z9",
    plan: "Pro Plan (Monthly)",
    planDescription: "Pro Developer Tier with 15 seats & automated workflow triggers",
    subtotal: 2117.8,
    gst: 381.2,
    total: 2499,
    issueDate: "2024-10-15",
    dueDate: "2024-10-29",
    status: "Pending",
    method: "Automated Bank Clearing (NEFT)",
    gatewayRef: "NEFT-PEND-44019",
    state: "Delhi (07)",
  },
  {
    id: "INV-2024-1081",
    org: "Acme Technologies",
    contact: "Aarav Sharma",
    email: "aarav@acme.demo",
    gstin: "27AABCA9912D1Z0",
    plan: "Enterprise Plan (Monthly)",
    planDescription: "Enterprise Sovereign Cluster, unlimited SSO seats & 99.99% uptime SLA",
    subtotal: 21185.59,
    gst: 3813.41,
    total: 24999,
    issueDate: "2024-09-22",
    dueDate: "2024-10-06",
    status: "Paid",
    method: "Stripe Visa •••• 9912",
    gatewayRef: "PAY-STR-55201-INT",
    state: "Maharashtra (27)",
  },
  {
    id: "INV-2024-1080",
    org: "Bright Labs",
    contact: "Karan Joshi",
    email: "karan@bright.demo",
    gstin: "24AABCB3321L1Z7",
    plan: "Starter Plan (Monthly)",
    planDescription: "Starter Tier with 5 seats & basic cloud storage",
    subtotal: 1694.07,
    gst: 304.93,
    total: 1999,
    issueDate: "2024-09-20",
    dueDate: "2024-10-04",
    status: "Paid",
    method: "UPI (PhonePe Automated)",
    gatewayRef: "UPI-PHONEPE-9921",
    state: "Gujarat (24)",
  },
];

function Invoices() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [density, setDensity] = useState("standard");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [toast, setToast] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [copiedId, setCopiedId] = useState(null);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return invoices.filter((inv) => {
      const matchSearch =
        !q ||
        inv.id.toLowerCase().includes(q) ||
        inv.org.toLowerCase().includes(q) ||
        inv.contact.toLowerCase().includes(q) ||
        inv.email.toLowerCase().includes(q) ||
        inv.gstin.toLowerCase().includes(q) ||
        inv.plan.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "All" || inv.status.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const kpiStats = useMemo(() => {
    const paid = invoices.filter((i) => i.status === "Paid");
    const pending = invoices.filter((i) => i.status === "Pending");
    const overdue = invoices.filter((i) => i.status === "Overdue");

    const totalInvoiced = invoices.reduce((acc, i) => acc + i.total, 0);
    const totalPending = pending.reduce((acc, i) => acc + i.total, 0);
    const totalOverdue = overdue.reduce((acc, i) => acc + i.total, 0);
    const collectionRate = invoices.length > 0 ? ((paid.length / invoices.length) * 100).toFixed(1) : "0";

    return {
      totalInvoiced,
      paidCount: paid.length,
      collectionRate,
      pendingTotal: totalPending,
      pendingCount: pending.length,
      overdueTotal: totalOverdue,
      overdueCount: overdue.length,
    };
  }, [invoices]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedInvoices.map((i) => i.id)));
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

  const handlePrint = () => {
    window.print();
  };

  const handleMarkAsPaid = (id) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "Paid" } : i))
    );
    if (selectedInvoice && selectedInvoice.id === id) {
      setSelectedInvoice((prev) => ({ ...prev, status: "Paid" }));
    }
    notify(`Tax invoice ${id} recorded as Paid & Settled.`);
  };

  const handleSendEmail = (inv) => {
    notify(`Official tax invoice ${inv.id} dispatched to ${inv.email}.`);
  };

  const handleCopyLink = (inv) => {
    const link = `https://app.teamflow.ai/billing/invoices/${inv.id}?token=tf_gst_${inv.id.replace(/[^0-9]/g, "")}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(link);
    }
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2000);
    notify(`Direct invoice link for ${inv.id} copied to clipboard.`);
  };

  function escapePDFText(str) {
    return String(str || "")
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  }

  function numberToWords(num) {
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const n = Math.floor(Number(num) || 0);
    if (n === 0) return "Indian Rupees Zero Only";

    function convert(val) {
      if (val < 20) return a[val];
      if (val < 100) return b[Math.floor(val / 10)] + (val % 10 !== 0 ? " " + a[val % 10] : "");
      if (val < 1000) return a[Math.floor(val / 100)] + " Hundred" + (val % 100 !== 0 ? " and " + convert(val % 100) : "");
      if (val < 100000) return convert(Math.floor(val / 1000)) + " Thousand" + (val % 1000 !== 0 ? " " + convert(val % 1000) : "");
      if (val < 10000000) return convert(Math.floor(val / 100000)) + " Lakh" + (val % 100000 !== 0 ? " " + convert(val % 100000) : "");
      return convert(Math.floor(val / 10000000)) + " Crore" + (val % 10000000 !== 0 ? " " + convert(val % 10000000) : "");
    }

    return `Indian Rupees ${convert(n)} Only`;
  }

  function buildInvoicePDF(inv) {
    const sanitize = (val) => escapePDFText(val);
    const words = numberToWords(inv.total);

    const streamLines = [
      "q 0.96 0.97 0.99 rg 20 20 555 802 re f Q",
      "q 1 1 1 rg 25 25 545 792 re f Q",
      "q 0.85 0.88 0.92 RG 1 w 25 25 545 792 re s Q",
      "q 0.23 0.40 1.00 rg 25 813 545 4 re f Q",
      "BT /F2 20 Tf 0.06 0.09 0.16 rg 45 780 Td (" + sanitize("TeamFlow AI") + ") Tj ET",
      "BT /F1 8 Tf 0.39 0.45 0.55 rg 45 768 Td (" + sanitize("TECHNOLOGIES PRIVATE LIMITED") + ") Tj ET",
      "BT /F1 8 Tf 0.28 0.33 0.41 rg 45 754 Td (" + sanitize("GSTIN: 07AAACT0000A1Z5  |  State: Haryana (07)  |  CIN: U72900HR2023PTC104521") + ") Tj ET",
      "BT /F1 8 Tf 0.39 0.45 0.55 rg 45 742 Td (" + sanitize("Level 8, DLF Cyber City, Sector 24, Gurugram, Haryana - 122002  |  SAC: 998313") + ") Tj ET",
      "BT /F2 10 Tf 0.23 0.40 1.00 rg 450 782 Td (" + sanitize("TAX INVOICE") + ") Tj ET",
      "BT /F2 14 Tf 0.06 0.09 0.16 rg 430 765 Td (" + sanitize(inv.id) + ") Tj ET",
      "BT /F2 9 Tf " + (inv.status === "Paid" ? "0.02 0.47 0.34" : inv.status === "Pending" ? "0.71 0.32 0.04" : "0.72 0.11 0.11") + " rg 430 750 Td (" + sanitize("[ " + inv.status.toUpperCase() + " & SETTLED ]") + ") Tj ET",
      "BT /F1 8 Tf 0.39 0.45 0.55 rg 410 736 Td (" + sanitize("Issue Date: " + inv.issueDate + "   Due: " + inv.dueDate) + ") Tj ET",
      "q 0.82 0.85 0.90 RG 1 w 45 722 505 0 re s Q",
      "q 0.97 0.98 0.99 rg 45 640 245 72 re f Q",
      "q 0.88 0.91 0.94 RG 1 w 45 640 245 72 re s Q",
      "BT /F2 8.5 Tf 0.23 0.40 1.00 rg 55 698 Td (" + sanitize("BILLED TO (BUYER / TENANT)") + ") Tj ET",
      "BT /F2 11 Tf 0.06 0.09 0.16 rg 55 683 Td (" + sanitize(inv.org) + ") Tj ET",
      "BT /F1 8 Tf 0.28 0.33 0.41 rg 55 670 Td (" + sanitize("Attn: " + inv.contact + " (" + inv.email + ")") + ") Tj ET",
      "BT /F2 8 Tf 0.12 0.16 0.23 rg 55 656 Td (" + sanitize("GSTIN: " + inv.gstin + "  |  " + (inv.state || "Maharashtra (27)")) + ") Tj ET",
      "q 0.97 0.98 0.99 rg 305 640 245 72 re f Q",
      "q 0.88 0.91 0.94 RG 1 w 305 640 245 72 re s Q",
      "BT /F2 8.5 Tf 0.09 0.64 0.29 rg 315 698 Td (" + sanitize("PAYMENT & SETTLEMENT DETAILS") + ") Tj ET",
      "BT /F1 8 Tf 0.39 0.45 0.55 rg 315 683 Td (" + sanitize("Payment Method: " + inv.method) + ") Tj ET",
      "BT /F1 8 Tf 0.39 0.45 0.55 rg 315 670 Td (" + sanitize("Gateway Auth Ref: " + inv.gatewayRef) + ") Tj ET",
      "BT /F1 8 Tf 0.39 0.45 0.55 rg 315 656 Td (" + sanitize("Escrow: HDFC Escrow Clearing (18% IGST Inter-State)") + ") Tj ET",
      "q 0.95 0.96 0.98 rg 45 605 505 20 re f Q",
      "q 0.85 0.88 0.92 RG 1 w 45 605 505 20 re s Q",
      "BT /F2 8 Tf 0.28 0.33 0.41 rg 55 611 Td (#) Tj ET",
      "BT /F2 8 Tf 0.28 0.33 0.41 rg 80 611 Td (SERVICE DESCRIPTION & SAC CODE) Tj ET",
      "BT /F2 8 Tf 0.28 0.33 0.41 rg 310 611 Td (QTY) Tj ET",
      "BT /F2 8 Tf 0.28 0.33 0.41 rg 355 611 Td (RATE (INR)) Tj ET",
      "BT /F2 8 Tf 0.28 0.33 0.41 rg 425 611 Td (IGST 18%) Tj ET",
      "BT /F2 8 Tf 0.28 0.33 0.41 rg 485 611 Td (AMOUNT (INR)) Tj ET",
      "q 1 1 1 rg 45 550 505 55 re f Q",
      "q 0.88 0.91 0.94 RG 1 w 45 550 505 55 re s Q",
      "BT /F1 9 Tf 0.39 0.45 0.55 rg 55 585 Td (1) Tj ET",
      "BT /F2 10 Tf 0.06 0.09 0.16 rg 80 585 Td (" + sanitize(inv.plan) + ") Tj ET",
      "BT /F1 7.5 Tf 0.39 0.45 0.55 rg 80 572 Td (" + sanitize(inv.planDescription || "Full platform SaaS multi-tenant licensing & high-speed token quota") + ") Tj ET",
      "BT /F1 7 Tf 0.23 0.40 1.00 rg 80 560 Td (" + sanitize("SAC: 998313 (IT & Cloud Software Services)") + ") Tj ET",
      "BT /F1 9 Tf 0.06 0.09 0.16 rg 315 575 Td (1) Tj ET",
      "BT /F1 9 Tf 0.06 0.09 0.16 rg 355 575 Td (" + sanitize("INR " + inv.subtotal.toFixed(2)) + ") Tj ET",
      "BT /F1 9 Tf 0.28 0.33 0.41 rg 425 575 Td (" + sanitize("INR " + inv.gst.toFixed(2)) + ") Tj ET",
      "BT /F2 9.5 Tf 0.06 0.09 0.16 rg 485 575 Td (" + sanitize("INR " + inv.subtotal.toFixed(2)) + ") Tj ET",
      "q 0.97 0.98 0.99 rg 45 440 245 95 re f Q",
      "q 0.88 0.91 0.94 RG 1 w 45 440 245 95 re s Q",
      "BT /F2 7.5 Tf 0.39 0.45 0.55 rg 55 520 Td (TOTAL AMOUNT IN WORDS:) Tj ET",
      "BT /F1 8.5 Tf 0.12 0.16 0.23 rg 55 506 Td (" + sanitize(words) + ") Tj ET",
      "BT /F2 7.5 Tf 0.09 0.64 0.29 rg 55 476 Td (ESCROW SETTLEMENT ROUTE:) Tj ET",
      "BT /F1 7.5 Tf 0.28 0.33 0.41 rg 55 464 Td (HDFC Corporate Virtual Acc: TF-ESCROW-27891102) Tj ET",
      "BT /F1 7.5 Tf 0.28 0.33 0.41 rg 55 452 Td (IFSC: HDFC0000240  |  Settlement SLA: T+1 Immediate) Tj ET",
      "q 0.97 0.98 0.99 rg 305 440 245 95 re f Q",
      "q 0.88 0.91 0.94 RG 1 w 305 440 245 95 re s Q",
      "BT /F1 8.5 Tf 0.28 0.33 0.41 rg 315 520 Td (Taxable Base Subtotal:) Tj ET",
      "BT /F2 8.5 Tf 0.06 0.09 0.16 rg 465 520 Td (" + sanitize("INR " + inv.subtotal.toFixed(2)) + ") Tj ET",
      "BT /F1 8.5 Tf 0.28 0.33 0.41 rg 315 504 Td (Integrated GST (18.00% IGST):) Tj ET",
      "BT /F2 8.5 Tf 0.23 0.40 1.00 rg 465 504 Td (" + sanitize("+ INR " + inv.gst.toFixed(2)) + ") Tj ET",
      "BT /F1 8 Tf 0.55 0.60 0.68 rg 315 488 Td (CGST (0%) / SGST (0%):) Tj ET",
      "BT /F1 8 Tf 0.55 0.60 0.68 rg 480 488 Td (INR 0.00) Tj ET",
      "q 0.92 0.99 0.96 rg 312 447 231 32 re f Q",
      "q 0.65 0.95 0.82 RG 1 w 312 447 231 32 re s Q",
      "BT /F2 9.5 Tf 0.02 0.47 0.34 rg 320 464 Td (GRAND TOTAL (INCL. GST):) Tj ET",
      "BT /F2 13 Tf 0.02 0.47 0.34 rg 440 461 Td (" + sanitize("INR " + inv.total.toFixed(2)) + ") Tj ET",
      "q 0.85 0.88 0.92 RG 1 w 45 425 505 0 re s Q",
      "BT /F2 7.5 Tf 0.28 0.33 0.41 rg 45 410 Td (" + sanitize("Authentic computer-generated tax invoice issued under Section 31 of CGST Act, 2017 & Rule 48.") + ") Tj ET",
      "BT /F1 7.5 Tf 0.39 0.45 0.55 rg 45 398 Td (" + sanitize("Digitally authenticated and sealed by TeamFlow AI Automated Billing Subsystem. Physical signature not required.") + ") Tj ET",
      "BT /F1 7 Tf 0.50 0.55 0.65 rg 45 386 Td (" + sanitize("Billing Support: billing@teamflow.ai  |  Customer Desk: +91 (0124) 490-2800  |  CIN: U72900HR2023PTC104521") + ") Tj ET"
    ];

    const streamContent = streamLines.join("\n");
    const encoder = new TextEncoder();
    const streamLength = encoder.encode(streamContent).length;

    let pdf = "%PDF-1.4\n";
    const offsets = [];

    const addObj = (str) => {
      offsets.push(encoder.encode(pdf).length);
      pdf += str + "\n";
    };

    addObj("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
    addObj("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj");
    addObj("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj");
    addObj("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj");
    addObj("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj");
    addObj("6 0 obj\n<< /Length " + streamLength + " >>\nstream\n" + streamContent + "\nendstream\nendobj");

    const startXref = encoder.encode(pdf).length;
    pdf += "xref\n0 7\n0000000000 65535 f \n";
    for (let i = 0; i < offsets.length; i++) {
      pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
    }
    pdf += "trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n" + startXref + "\n%%EOF";
    return pdf;
  }

  const handleDownloadPDF = (inv) => {
    try {
      const pdfData = buildInvoicePDF(inv);
      const blob = new Blob([pdfData], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `official_tax_invoice_${inv.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      notify(`Downloaded official tax invoice ${inv.id}.pdf`);
    } catch (err) {
      console.error("PDF download error:", err);
      notify("Error generating PDF invoice. Falling back to print.");
      handlePrint();
    }
  };

  const handleDownloadTXT = (inv) => {
    const textData = `================================================================================
TEAMFLOW AI — OFFICIAL TAX INVOICE & SETTLEMENT RECEIPT
Issued under Section 31 of CGST Act, 2017 & Rule 48 (Tax Invoice)
================================================================================
Invoice Number : ${inv.id}
Place of Supply: Haryana (State Code: 07)
Date of Issue  : ${inv.issueDate}
Payment Due    : ${inv.dueDate}
Settlement     : ${inv.status.toUpperCase()}
SAC Code       : 998313 (Information Technology Software Services)
--------------------------------------------------------------------------------
SUPPLIER / ISSUER DETAILS:
Legal Entity   : TeamFlow AI Technologies Private Limited
Registered Off : Level 8, DLF Cyber City, Sector 24, Gurugram, HR - 122002
GSTIN / UIN    : 07AAACT0000A1Z5
Corporate ID   : U72900HR2023PTC104521
Support Desk   : billing@teamflow.ai | +91 (0124) 490-2800
--------------------------------------------------------------------------------
BILLED TO (BUYER / TENANT):
Organization   : ${inv.org}
Primary Contact: ${inv.contact}
Billing Email  : ${inv.email}
Buyer GSTIN    : ${inv.gstin}
Jurisdiction   : ${inv.state || "Maharashtra (27)"}
--------------------------------------------------------------------------------
ITEMIZED SERVICES & CHARGES:
Description    : ${inv.plan}
SAC Reference  : 998313
Scope Details  : ${inv.planDescription || "Full multi-tenant cloud licensing & token quota"}
Taxable Base   : ₹${inv.subtotal.toFixed(2)}
Integrated GST : ₹${inv.gst.toFixed(2)} (18.00% IGST)
--------------------------------------------------------------------------------
TOTAL SETTLEMENT (INR):
Taxable Base Subtotal : ₹${inv.subtotal.toFixed(2)}
Integrated GST (18%)  : ₹${inv.gst.toFixed(2)}
Total Amount Payable  : ₹${inv.total.toFixed(2)}
--------------------------------------------------------------------------------
PAYMENT & ESCROW CLEARING:
Payment Method : ${inv.method}
Gateway Ref ID : ${inv.gatewayRef}
Escrow Account : HDFC Corporate Virtual Clearing (IFSC: HDFC0000240)
===============================================================================
This is a computer-generated tax invoice and requires no physical signature.
TeamFlow AI Platform Super Admin Billing Subsystem
================================================================================`;

    const blob = new Blob([textData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tax_invoice_${inv.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    notify(`Downloaded tax invoice receipt ${inv.id}.txt.`);
  };

  const handleExportCSV = () => {
    const headers = [
      "Invoice ID",
      "Organization",
      "Contact",
      "Email",
      "GSTIN",
      "Plan Tier",
      "Subtotal INR",
      "GST 18% INR",
      "Total Amount INR",
      "Issue Date",
      "Due Date",
      "Status",
      "Payment Method",
      "Gateway Ref",
    ];

    const rows = filteredInvoices.map((i) => [
      i.id,
      i.org,
      i.contact,
      i.email,
      i.gstin,
      i.plan,
      i.subtotal.toFixed(2),
      i.gst.toFixed(2),
      i.total.toFixed(2),
      i.issueDate,
      i.dueDate,
      i.status,
      i.method,
      i.gatewayRef,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers, ...rows]
        .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "teamflow_tax_invoices_ledger.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("Exported official tax invoices spreadsheet.");
  };

  return (
    <div className="invoices-page">
      {/* 1. SAP Master Header Bar */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>Tax-Compliant Invoices &amp; Billing Archive</h1>
          <p className="sap-header-subtitle">
            GST-compliant corporate invoices, automated tax breakdown calculations, and immutable settlement receipts.
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
            <p className="sa-kpi-title">Total Invoiced Volume</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">₹{(kpiStats.totalInvoiced / 100000).toFixed(2)}L</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 18%
              </span>
            </div>
            <span className="sa-kpi-subtitle">{invoices.length} corporate invoices generated</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <CheckCircle2 size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Settled Invoices</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{kpiStats.paidCount} Paid</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> {kpiStats.collectionRate}%
              </span>
            </div>
            <span className="sa-kpi-subtitle">On-time collection &amp; escrow clearing</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <Clock size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Pending Payment</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">₹{kpiStats.pendingTotal.toLocaleString()}</span>
              <span className="sa-kpi-trend neutral">{kpiStats.pendingCount} pending</span>
            </div>
            <span className="sa-kpi-subtitle">Active grace cycle before due date</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box red">
            <AlertCircle size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Overdue Invoices</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">₹{kpiStats.overdueTotal.toLocaleString()}</span>
              <span className="sa-kpi-trend negative">{kpiStats.overdueCount} overdue</span>
            </div>
            <span className="sa-kpi-subtitle">Automated dunning reminders active</span>
          </div>
        </article>
      </section>

      {toast && (
        <div className="sa-toast-banner">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* 3. The SAP Table Card */}
      <section className="sap-table-card">
        {/* Multi-Selection Batch Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="sap-batch-banner">
            <span>
              <strong>{selectedIds.size}</strong> invoices selected
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
                className="sa-btn sa-btn-primary sa-btn-sm"
                onClick={() => {
                  setInvoices((prev) =>
                    prev.map((i) => (selectedIds.has(i.id) ? { ...i, status: "Paid" } : i))
                  );
                  notify(`${selectedIds.size} invoices marked as Paid.`);
                  setSelectedIds(new Set());
                }}
              >
                <CheckCircle2 size={13} /> Batch Mark Paid
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
                placeholder="Search invoice number, organization, GSTIN, contact..."
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
              <option value="All">Status: All Invoices</option>
              <option value="Paid">Paid (Settled)</option>
              <option value="Pending">Pending Payment</option>
              <option value="Overdue">Overdue (Dunning)</option>
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
                setSearchQuery("");
                setStatusFilter("All");
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
                      paginatedInvoices.length > 0 &&
                      paginatedInvoices.every((i) => selectedIds.has(i.id))
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ width: 140 }}>Invoice No.</th>
                <th>Billed Organization</th>
                <th>GSTIN Registration</th>
                <th>Subscribed Tier</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Tax Base</th>
                <th>GST (18%)</th>
                <th>Total Invoiced</th>
                <th>Tax Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map((inv) => {
                const isSelected = selectedIds.has(inv.id);
                const tierClass =
                  inv.plan.toLowerCase().includes("enterprise")
                    ? "tier-enterprise"
                    : inv.plan.toLowerCase().includes("business")
                    ? "tier-business"
                    : "tier-starter";

                return (
                  <tr key={inv.id} className={isSelected ? "is-selected" : ""}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(inv.id)}
                      />
                    </td>
                    <td>
                      <span className="sap-id-cell">{inv.id}</span>
                    </td>
                    <td>
                      <div className="sap-user-badge">
                        <CompanyLogo organization={inv.org} size={32} />
                        <div className="sap-user-info">
                          <strong className="sap-user-name">{inv.org}</strong>
                          <span className="sap-user-email">
                            {inv.contact} · {inv.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="inv-gstin-chip">
                        {inv.gstin}
                      </span>
                    </td>
                    <td>
                      <span className={`sub-tier-badge ${tierClass}`}>
                        {inv.plan}
                      </span>
                    </td>
                    <td style={{ color: "var(--sa-text-muted)", fontSize: 12, whiteSpace: "nowrap" }}>
                      {inv.issueDate}
                    </td>
                    <td style={{ color: "var(--sa-text-muted)", fontSize: 12, whiteSpace: "nowrap" }}>
                      {inv.dueDate}
                    </td>
                    <td>
                      <span className="inv-mono-amount">
                        ₹{inv.subtotal.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className="inv-mono-amount text-muted">
                        ₹{inv.gst.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <strong className="inv-mono-amount is-bold">
                        ₹{inv.total.toFixed(2)}
                      </strong>
                    </td>
                    <td>
                      <span className={`inv-status-pill status-${inv.status.toLowerCase()}`}>
                        <span className="inv-status-dot" />
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="inv-action-group">
                        <button
                          type="button"
                          className="inv-action-btn btn-view"
                          onClick={() => setSelectedInvoice(inv)}
                          title="View Official Tax Receipt"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          className="inv-action-btn btn-download"
                          onClick={() => handleDownloadPDF(inv)}
                          title="Download Official Tax Invoice (PDF)"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          type="button"
                          className="inv-action-btn btn-print"
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setTimeout(() => window.print(), 300);
                          }}
                          title="Print Tax Receipt"
                        >
                          <Printer size={14} />
                        </button>
                        {inv.status !== "Paid" && (
                          <button
                            type="button"
                            className="inv-action-btn btn-settle"
                            onClick={() => handleMarkAsPaid(inv.id)}
                            title="Record Payment / Mark as Paid"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedInvoices.length === 0 && (
                <tr>
                  <td colSpan="12" style={{ textAlign: "center", padding: "40px" }}>
                    No tax invoices match your search query or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 5. The SAP Footer Bar */}
        <div className="sap-footer-bar">
          <div className="sap-footer-counts" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="sap-counter">
              Showing{" "}
              <strong>
                {filteredInvoices.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(currentPage * pageSize, filteredInvoices.length)}
              </strong>{" "}
              of <strong>{filteredInvoices.length}</strong> invoices
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

      {/* 6. Authentic Real Receipt Tax Invoice Modal */}
      {selectedInvoice &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="sa-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedInvoice(null);
            }}
          >
            <div
              className="sa-receipt-modal-dialog"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Topbar / Window Header */}
              <div className="sa-receipt-topbar">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="sa-receipt-top-icon">
                    <Receipt size={18} color="#3b66ff" />
                  </span>
                  <div>
                    <h3 className="sa-receipt-top-title">Official Tax Invoice &amp; Settlement Receipt</h3>
                    <p className="sa-receipt-top-subtitle">
                      Reference: <strong>{selectedInvoice.id}</strong> · Rule 48 CGST Compliance
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button
                    type="button"
                    className="sa-receipt-icon-action"
                    onClick={() => handleCopyLink(selectedInvoice)}
                    title="Copy Invoice Link"
                  >
                    {copiedId === selectedInvoice.id ? <Check size={15} color="#16a34a" /> : <Copy size={15} />}
                  </button>
                  <button
                    type="button"
                    className="sa-receipt-icon-action"
                    onClick={() => setSelectedInvoice(null)}
                    aria-label="Close invoice receipt modal"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Printable Receipt Paper Container */}
              <div className="sa-receipt-body-scroll">
                <div className="sa-receipt-sheet">
                  {/* Decorative Top Accent Bar */}
                  <div className="sa-receipt-accent-bar" />

                  {/* Header Row: Issuer Details & Official Stamp */}
                  <div className="sa-receipt-header">
                    <div className="sa-receipt-brand-box">
                      <div className="sa-brand-title-row">
                        <span className="sa-brand-symbol">
                          <Receipt size={22} color="#ffffff" />
                        </span>
                        <div>
                          <h2 className="sa-brand-name">TeamFlow AI</h2>
                          <span className="sa-brand-corp">Technologies Private Limited</span>
                        </div>
                      </div>

                      <div className="sa-brand-tax-meta">
                        <p><strong>GSTIN:</strong> 07AAACT0000A1Z5 · <strong>State:</strong> Haryana (07)</p>
                        <p><strong>CIN:</strong> U72900HR2023PTC104521 · <strong>SAC:</strong> 998313</p>
                        <p className="sa-brand-address">Level 8, DLF Cyber City, Sector 24, Gurugram, Haryana - 122002</p>
                      </div>
                    </div>

                    <div className="sa-receipt-meta-box">
                      <div className="sa-receipt-tag">TAX INVOICE</div>
                      <div className="sa-receipt-number">{selectedInvoice.id}</div>

                      {/* Authentic Rubber Stamp */}
                      <div className={`sa-rubber-stamp is-${selectedInvoice.status.toLowerCase()}`}>
                        {selectedInvoice.status === "Paid" && (
                          <>
                            <BadgeCheck size={16} />
                            <span>PAID &amp; SETTLED</span>
                          </>
                        )}
                        {selectedInvoice.status === "Pending" && (
                          <>
                            <Clock size={16} />
                            <span>PAYMENT PENDING</span>
                          </>
                        )}
                        {selectedInvoice.status === "Overdue" && (
                          <>
                            <AlertTriangle size={16} />
                            <span>DUNNING OVERDUE</span>
                          </>
                        )}
                      </div>

                      <div className="sa-receipt-date-stack">
                        <div className="sa-date-item">
                          <span>Issue Date:</span>
                          <strong>{selectedInvoice.issueDate}</strong>
                        </div>
                        <div className="sa-date-item">
                          <span>Due Date:</span>
                          <strong>{selectedInvoice.dueDate}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Perforated Receipt Cutout Line */}
                  <div className="sa-receipt-perforation">
                    <div className="sa-cutout-left" />
                    <div className="sa-perforated-line" />
                    <div className="sa-cutout-right" />
                  </div>

                  {/* Parties & Billing Details 2-Column Grid */}
                  <div className="sa-receipt-parties-grid">
                    {/* Buyer / Tenant Information */}
                    <div className="sa-party-card">
                      <div className="sa-party-header">
                        <Building2 size={14} color="#3b66ff" />
                        <span>BILLED TO (BUYER / TENANT)</span>
                      </div>
                      <div className="sa-party-content">
                        <div className="sa-party-org-row">
                          <CompanyLogo organization={selectedInvoice.org} size={28} />
                          <strong>{selectedInvoice.org}</strong>
                        </div>
                        <p className="sa-party-sub">Attn: {selectedInvoice.contact}</p>
                        <p className="sa-party-sub">{selectedInvoice.email}</p>
                        <div className="sa-gstin-badge-row">
                          <span className="sa-gstin-badge">
                            GSTIN: {selectedInvoice.gstin}
                          </span>
                          <span className="sa-state-badge">
                            {selectedInvoice.state || "Maharashtra (27)"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment & Settlement Telemetry */}
                    <div className="sa-party-card">
                      <div className="sa-party-header">
                        <ShieldCheck size={14} color="#16a34a" />
                        <span>PAYMENT &amp; SETTLEMENT DETAILS</span>
                      </div>
                      <div className="sa-party-content">
                        <div className="sa-detail-row">
                          <span className="label">Payment Method:</span>
                          <strong className="value">{selectedInvoice.method}</strong>
                        </div>
                        <div className="sa-detail-row">
                          <span className="label">Gateway Auth Ref:</span>
                          <span className="value-mono">{selectedInvoice.gatewayRef}</span>
                        </div>
                        <div className="sa-detail-row">
                          <span className="label">Currency / Escrow:</span>
                          <span className="value">INR (₹) · HDFC Escrow Clearing</span>
                        </div>
                        <div className="sa-detail-row">
                          <span className="label">Supply Category:</span>
                          <span className="value">Inter-State Supply (18% IGST)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Itemized Charges & SAC Breakdown Table */}
                  <div className="sa-receipt-table-wrapper">
                    <table className="sa-receipt-table">
                      <thead>
                        <tr>
                          <th style={{ width: 40, textAlign: "center" }}>#</th>
                          <th>Service Description &amp; SAC Code</th>
                          <th style={{ textAlign: "center", width: 70 }}>Qty</th>
                          <th style={{ textAlign: "right", width: 110 }}>Rate (INR)</th>
                          <th style={{ textAlign: "right", width: 100 }}>IGST (18%)</th>
                          <th style={{ textAlign: "right", width: 120 }}>Amount (INR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ textAlign: "center", color: "#94a3b8" }}>1</td>
                          <td>
                            <strong className="sa-item-title">{selectedInvoice.plan}</strong>
                            <p className="sa-item-desc">
                              {selectedInvoice.planDescription || "Full platform SaaS multi-tenant licensing & high-speed token allocation"}
                            </p>
                            <span className="sa-sac-tag">SAC: 998313 (IT &amp; Cloud Software Services)</span>
                          </td>
                          <td style={{ textAlign: "center", fontWeight: 600 }}>1</td>
                          <td style={{ textAlign: "right", fontFamily: "ui-monospace, monospace" }}>
                            ₹{selectedInvoice.subtotal.toFixed(2)}
                          </td>
                          <td style={{ textAlign: "right", fontFamily: "ui-monospace, monospace", color: "#64748b" }}>
                            ₹{selectedInvoice.gst.toFixed(2)}
                          </td>
                          <td style={{ textAlign: "right", fontFamily: "ui-monospace, monospace", fontWeight: 750 }}>
                            ₹{selectedInvoice.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Financial Breakdown & Grand Total Card */}
                  <div className="sa-receipt-breakdown-row">
                    <div className="sa-breakdown-left">
                      <div className="sa-words-block">
                        <small>Amount in Words:</small>
                        <p>{numberToWords(selectedInvoice.total)}</p>
                      </div>

                      <div className="sa-escrow-block">
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <Landmark size={13} color="#16a34a" />
                          <strong>Virtual Escrow Clearing Route</strong>
                        </div>
                        <p>HDFC Bank Corporate Virtual Account: <strong>TF-ESCROW-27891102</strong></p>
                        <p>IFSC: <strong>HDFC0000240</strong> · Settlement T+1 On-Time SLA</p>
                      </div>
                    </div>

                    <div className="sa-breakdown-right">
                      <div className="sa-ledger-calc-card">
                        <div className="sa-calc-row">
                          <span>Taxable Base Subtotal:</span>
                          <strong>₹{selectedInvoice.subtotal.toFixed(2)}</strong>
                        </div>
                        <div className="sa-calc-row">
                          <span>Integrated GST (18.00% IGST):</span>
                          <span>+₹{selectedInvoice.gst.toFixed(2)}</span>
                        </div>
                        <div className="sa-calc-row">
                          <span>Central GST (0.00% CGST):</span>
                          <span style={{ color: "#94a3b8" }}>₹0.00</span>
                        </div>
                        <div className="sa-calc-row">
                          <span>State GST (0.00% SGST):</span>
                          <span style={{ color: "#94a3b8" }}>₹0.00</span>
                        </div>
                        <div className="sa-calc-divider" />
                        <div className="sa-calc-grand-box">
                          <div>
                            <span className="sa-grand-label">Grand Total (Inclusive of GST)</span>
                            <small className="sa-grand-sub">Net Cleared into Platform Account</small>
                          </div>
                          <strong className="sa-grand-amount">
                            ₹{selectedInvoice.total.toFixed(2)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legal Statutory Compliance & Signature Footer */}
                  <div className="sa-receipt-footer">
                    <div className="sa-footer-compliance-text">
                      <ShieldCheck size={15} color="#16a34a" />
                      <span>
                        This is an authenticated computer-generated tax invoice issued in accordance with Section 31 of CGST Act, 2017. Physical signature is not required.
                      </span>
                    </div>

                    <div className="sa-footer-support-line">
                      Corporate Billing Inquiries: <strong>billing@teamflow.ai</strong> · Tel: <strong>+91 (0124) 490-2800</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Receipt Modal Footer Actions */}
              <div className="sa-receipt-modal-footer">
                <div className="sa-receipt-footer-left">
                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary"
                    onClick={() => setSelectedInvoice(null)}
                  >
                    Close
                  </button>
                </div>

                <div className="sa-receipt-footer-right">
                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary"
                    onClick={() => handleSendEmail(selectedInvoice)}
                  >
                    <Mail size={14} /> Send to Email
                  </button>

                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary"
                    onClick={() => handleDownloadTXT(selectedInvoice)}
                  >
                    <FileText size={14} /> Download TXT
                  </button>

                  <button
                    type="button"
                    className="sa-btn sa-btn-primary"
                    onClick={() => handleDownloadPDF(selectedInvoice)}
                  >
                    <Download size={14} /> Download PDF
                  </button>

                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary"
                    onClick={handlePrint}
                  >
                    <Printer size={14} /> Print Tax Invoice
                  </button>

                  {selectedInvoice.status !== "Paid" && (
                    <button
                      type="button"
                      className="sa-btn sa-btn-success"
                      onClick={() => handleMarkAsPaid(selectedInvoice.id)}
                    >
                      <CheckCircle2 size={14} /> Record Payment (Mark Paid)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default Invoices;
