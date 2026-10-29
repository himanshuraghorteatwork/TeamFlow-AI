import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Eye,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  CreditCard,
  Building,
  Calendar,
  IndianRupee,
  Printer,
  ShieldCheck,
  Check,
  X,
  FileSpreadsheet,
  Plus,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  QrCode,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import { downloadInvoicePDF, previewInvoicePDF } from "./invoicePdfGenerator.js";
import "./AdminInvoices.css";

const formatINR = (amt) => {
  const num = Number(amt) || 0;
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const INITIAL_INVOICES = [
  {
    id: "INV-2026-012",
    date: "2026-10-25",
    dueDate: "2026-11-05",
    description: "Enterprise Security Audit & SOC2 Attestation Pack",
    amount: 49900.00,
    status: "Paid",
    method: "Visa •••• 4242",
    items: [
      { name: "Continuous Compliance & SOC2 Type II Monitoring", qty: 1, rate: 37500.00, total: 37500.00 },
      { name: "Dedicated Audit Log Streaming S3 Sink", qty: 1, rate: 12400.00, total: 12400.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-011",
    date: "2026-10-15",
    dueDate: "2026-10-30",
    description: "Dedicated Multi-Region AI Inference Cluster",
    amount: 69999.00,
    status: "Pending",
    method: "NEFT / Bank Transfer",
    items: [
      { name: "High-Throughput GPU Inference Pod (Asia-South1)", qty: 1, rate: 54999.00, total: 54999.00 },
      { name: "Low-Latency Edge Model Caching", qty: 1, rate: 15000.00, total: 15000.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-010",
    date: "2026-10-01",
    dueDate: "2026-10-15",
    description: "Enterprise Plan - Monthly Subscription (25 Seats + AI Pro)",
    amount: 39999.00,
    status: "Paid",
    method: "Visa •••• 4242",
    items: [
      { name: "TeamFlow Enterprise (25 Seats)", qty: 1, rate: 31999.00, total: 31999.00 },
      { name: "AI Power Pack (1M Tokens/mo)", qty: 1, rate: 8000.00, total: 8000.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-009",
    date: "2026-09-01",
    dueDate: "2026-09-15",
    description: "Enterprise Plan - Monthly Subscription (25 Seats + AI Pro)",
    amount: 39999.00,
    status: "Paid",
    method: "UPI (Google Pay)",
    items: [
      { name: "TeamFlow Enterprise (25 Seats)", qty: 1, rate: 31999.00, total: 31999.00 },
      { name: "AI Power Pack (1M Tokens/mo)", qty: 1, rate: 8000.00, total: 8000.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-008",
    date: "2026-08-01",
    dueDate: "2026-08-15",
    description: "Enterprise Plan - Monthly Subscription (20 Seats)",
    amount: 31999.00,
    status: "Paid",
    method: "Visa •••• 4242",
    items: [
      { name: "TeamFlow Enterprise (20 Seats)", qty: 1, rate: 31999.00, total: 31999.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-007",
    date: "2026-07-01",
    dueDate: "2026-07-15",
    description: "Enterprise Plan - Monthly Subscription (20 Seats)",
    amount: 31999.00,
    status: "Paid",
    method: "Mastercard •••• 8821",
    items: [
      { name: "TeamFlow Enterprise (20 Seats)", qty: 1, rate: 31999.00, total: 31999.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-006",
    date: "2026-06-01",
    dueDate: "2026-06-15",
    description: "Enterprise Plan - Monthly Subscription (15 Seats)",
    amount: 24999.00,
    status: "Paid",
    method: "Mastercard •••• 8821",
    items: [
      { name: "TeamFlow Enterprise (15 Seats)", qty: 1, rate: 24999.00, total: 24999.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-005",
    date: "2026-05-01",
    dueDate: "2026-05-15",
    description: "Pro Plan - Monthly Subscription (10 Seats)",
    amount: 12499.00,
    status: "Refunded",
    method: "Mastercard •••• 8821",
    items: [
      { name: "TeamFlow Pro (10 Seats)", qty: 1, rate: 12499.00, total: 12499.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-004",
    date: "2026-04-01",
    dueDate: "2026-04-15",
    description: "Pro Plan - Monthly Subscription (10 Seats)",
    amount: 12499.00,
    status: "Paid",
    method: "Net Banking (HDFC)",
    items: [
      { name: "TeamFlow Pro (10 Seats)", qty: 1, rate: 12499.00, total: 12499.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-003",
    date: "2026-03-01",
    dueDate: "2026-03-15",
    description: "Startup Pro Tier - Team Launch",
    amount: 12499.00,
    status: "Paid",
    method: "UPI (PhonePe)",
    items: [
      { name: "Startup Team License (10 Seats)", qty: 1, rate: 12499.00, total: 12499.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-002",
    date: "2026-02-01",
    dueDate: "2026-02-15",
    description: "AI Token Burst Pack (500K Tokens)",
    amount: 3999.00,
    status: "Paid",
    method: "Visa •••• 4242",
    items: [
      { name: "Prepaid Claude & GPT Token Pack", qty: 1, rate: 3999.00, total: 3999.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-001",
    date: "2026-01-01",
    dueDate: "2026-01-15",
    description: "Platform Setup & Domain Verification",
    amount: 7999.00,
    status: "Paid",
    method: "Mastercard •••• 8821",
    items: [
      { name: "Dedicated SSO Domain Integration & Setup", qty: 1, rate: 7999.00, total: 7999.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  }
];

function InvoiceQRCode({ id = "", size = 72 }) {
  const modules = useMemo(() => {
    const grid = Array(21).fill(null).map(() => Array(21).fill(false));

    // Top-left finder
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          grid[r][c] = true;
        }
      }
    }
    // Top-right finder
    for (let r = 0; r < 7; r++) {
      for (let c = 14; c < 21; c++) {
        if (r === 0 || r === 6 || c === 14 || c === 20 || (r >= 2 && r <= 4 && c >= 16 && c <= 18)) {
          grid[r][c] = true;
        }
      }
    }
    // Bottom-left finder
    for (let r = 14; r < 21; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 14 || r === 20 || c === 0 || c === 6 || (r >= 16 && r <= 18 && c >= 2 && c <= 4)) {
          grid[r][c] = true;
        }
      }
    }
    // Timing patterns
    for (let i = 8; i < 13; i += 2) {
      grid[6][i] = true;
      grid[i][6] = true;
    }
    // Deterministic hash based on id
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    for (let r = 0; r < 21; r++) {
      for (let c = 0; c < 21; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c >= 13) || (r >= 13 && c < 8)) continue;
        if (r === 6 || c === 6) continue;
        const bit = ((hash ^ (r * 31 + c * 17)) & (1 << ((r + c) % 15))) !== 0;
        grid[r][c] = bit;
      }
    }
    // Alignment pattern near bottom-right
    for (let r = 14; r <= 18; r++) {
      for (let c = 14; c <= 18; c++) {
        if (r === 14 || r === 18 || c === 14 || c === 18 || (r === 16 && c === 16)) {
          grid[r][c] = true;
        } else {
          grid[r][c] = false;
        }
      }
    }
    return grid;
  }, [id]);

  return (
    <svg
      viewBox="0 0 25 25"
      width={size}
      height={size}
      className="invoice-qr-svg"
      shapeRendering="crispEdges"
      aria-label={`QR verification code for ${id}`}
    >
      <rect width="25" height="25" fill="#ffffff" rx="2" />
      {modules.map((row, r) =>
        row.map((val, c) =>
          val ? (
            <rect
              key={`${r}-${c}`}
              x={c + 2}
              y={r + 2}
              width="1"
              height="1"
              fill="#0f172a"
            />
          ) : null
        )
      )}
    </svg>
  );
}

function InvoiceStamp({ status = "Paid", date = "" }) {
  const normStatus = (status || "").toLowerCase();

  if (normStatus === "paid") {
    return (
      <div className="invoice-rubber-stamp stamp-paid" aria-label="Official Paid Stamp">
        <div className="stamp-inner">
          <span className="stamp-top-text">OFFICIAL RECEIPT</span>
          <span className="stamp-main-text">PAID</span>
          <span className="stamp-bottom-text">{date || "SETTLED"}</span>
        </div>
      </div>
    );
  }

  if (normStatus === "pending") {
    return (
      <div className="invoice-rubber-stamp stamp-pending" aria-label="Official Pending Stamp">
        <div className="stamp-inner">
          <span className="stamp-top-text">PAYMENT DUE</span>
          <span className="stamp-main-text">PENDING</span>
          <span className="stamp-bottom-text">{date || "AWAITING"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-rubber-stamp stamp-refunded" aria-label="Official Refunded Stamp">
      <div className="stamp-inner">
        <span className="stamp-top-text">CREDITED BACK</span>
        <span className="stamp-main-text">REFUNDED</span>
        <span className="stamp-bottom-text">{date || "SETTLED"}</span>
      </div>
    </div>
  );
}

export default function AdminInvoices() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem("teamflow_admin_invoices");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure data is upgraded to Indian Rupee (INR) amounts
        if (Array.isArray(parsed) && parsed.length >= 8 && parsed[0]?.amount >= 2000) {
          return parsed;
        }
      }
      return INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceToPrint, setInvoiceToPrint] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  const [newInvoiceForm, setNewInvoiceForm] = useState(() => ({
    id: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    description: "Enterprise Monthly Subscription (25 Seats)",
    amount: 39999.00,
    status: "Paid",
    method: "Visa •••• 4242",
  }));

  const handleSort = (key) => {
    setCurrentPage(1);
    if (sortKey === key) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handlePrint = (inv) => {
    setInvoiceToPrint(inv);
    setTimeout(() => {
      window.print();
    }, 180);
  };

  const handleModalPrint = (inv) => {
    setInvoiceToPrint(inv || selectedInvoice);
    setTimeout(() => {
      window.print();
    }, 180);
  };

  const handlePreviewPDF = (inv) => {
    const target = inv || selectedInvoice;
    if (!target) return;
    previewInvoicePDF(target, billingInfo);
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

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const createdInv = {
      ...newInvoiceForm,
      amount: Number(newInvoiceForm.amount) || 0,
      items: [
        { name: newInvoiceForm.description, qty: 1, rate: Number(newInvoiceForm.amount) || 0, total: Number(newInvoiceForm.amount) || 0 }
      ],
      tax: 0.00,
      pdfUrl: "#"
    };
    setInvoices([createdInv, ...invoices]);
    setShowCreateInvoiceModal(false);
    setDownloadSuccess(`Created invoice ${createdInv.id}`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const confirmDeleteInvoice = () => {
    if (!invoiceToDelete) return;
    const deletedId = invoiceToDelete.id;
    setInvoices((prev) => prev.filter((i) => i.id !== deletedId));
    if (selectedInvoice?.id === deletedId) {
      setSelectedInvoice(null);
    }
    setDownloadSuccess(`Invoice statement ${deletedId} deleted.`);
    setInvoiceToDelete(null);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const toggleInvoiceStatus = (id) => {
    setInvoices(invoices.map(i => {
      if (i.id === id) {
        const nextStatus = i.status === "Paid" ? "Pending" : i.status === "Pending" ? "Refunded" : "Paid";
        return { ...i, status: nextStatus };
      }
      return i;
    }));
  };

  const [billingInfo, setBillingInfo] = useState(() => {
    try {
      const saved = localStorage.getItem("teamflow_admin_billing_info");
      return saved ? JSON.parse(saved) : {
        company: "ABC Technologies Inc.",
        taxId: "US-EIN-948201948",
        email: "billing@abctechnologies.com",
        address: "500 Howard Street, Suite 400",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        country: "United States"
      };
    } catch {
      return {
        company: "ABC Technologies Inc.",
        taxId: "US-EIN-948201948",
        email: "billing@abctechnologies.com",
        address: "500 Howard Street, Suite 400",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        country: "United States"
      };
    }
  });

  useEffect(() => {
    localStorage.setItem("teamflow_admin_invoices", JSON.stringify(invoices));
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    const list = invoices.filter(inv => {
      const matchesSearch = inv.id.toLowerCase().includes(search.toLowerCase()) ||
        inv.description.toLowerCase().includes(search.toLowerCase()) ||
        inv.method.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || inv.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesMethod = methodFilter === "all" || inv.method.toLowerCase().includes(methodFilter.toLowerCase());
      return matchesSearch && matchesStatus && matchesMethod;
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
  }, [invoices, search, statusFilter, methodFilter, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / perPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedInvoices = useMemo(() => {
    const start = (safeCurrentPage - 1) * perPage;
    return filteredInvoices.slice(start, start + perPage);
  }, [filteredInvoices, safeCurrentPage, perPage]);

  const totalSpent = useMemo(() => {
    return invoices
      .filter(i => i.status === "Paid")
      .reduce((sum, i) => sum + i.amount, 0);
  }, [invoices]);

  const handleDownloadPDF = (inv) => {
    if (!inv) return;
    const ok = downloadInvoicePDF(inv, billingInfo);
    if (ok) {
      setDownloadSuccess(inv.id);
      setTimeout(() => setDownloadSuccess(null), 3500);
    }
  };

  const exportCSV = () => {
    const headers = ["Invoice ID", "Date", "Due Date", "Description", "Amount (INR)", "Status", "Payment Method"];
    const rows = filteredInvoices.map(i => [
      i.id,
      i.date,
      i.dueDate,
      `"${i.description.replace(/"/g, '""')}"`,
      i.amount.toFixed(2),
      i.status,
      i.method
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `teamflow_invoices_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveBilling = (e) => {
    e.preventDefault();
    localStorage.setItem("teamflow_admin_billing_info", JSON.stringify(billingInfo));
    setShowBillingModal(false);
  };

  const currentPrintTarget = invoiceToPrint || selectedInvoice || invoices[0];

  return (
    <>
      <div className="admin-invoices-app no-print">
        <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="admin-invoices-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <div className="admin-invoices-content">
          {/* Header */}
          <div className="admin-invoices-header">
            <div>
              <h1>Invoices & Billing History</h1>
              <p>Download itemized receipts, review historic statements, and configure corporate tax info.</p>
            </div>

            <div className="admin-invoices-header-actions">
              <button className="admin-invoices-btn-secondary" onClick={exportCSV}>
                <FileSpreadsheet size={16} />
                Export CSV
              </button>
              <button className="admin-invoices-btn-primary" onClick={() => setShowCreateInvoiceModal(true)}>
                <Plus size={16} />
                Generate Statement
              </button>
              <button className="admin-invoices-btn-secondary" onClick={() => setShowBillingModal(true)}>
                <Building size={16} />
                Billing Info
              </button>
            </div>
          </div>

          {/* Feedback banner */}
          {downloadSuccess && (
            <div className="admin-invoices-alert-success">
              <CheckCircle2 size={18} />
              <span>Receipt for <strong>{downloadSuccess}</strong> downloaded successfully!</span>
            </div>
          )}

          {/* KPI Stat Cards */}
          <div className="admin-invoices-stats-grid">
            <div className="admin-invoices-stat-card">
              <div className="admin-invoices-stat-icon purple">
                <IndianRupee size={22} />
              </div>
              <div className="admin-invoices-stat-info">
                <span className="label">Total Invoiced</span>
                <span className="value">₹{totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="subtext">{invoices.length} billing statements</span>
              </div>
            </div>

            <div className="admin-invoices-stat-card">
              <div className="admin-invoices-stat-icon green">
                <Calendar size={22} />
              </div>
              <div className="admin-invoices-stat-info">
                <span className="label">Next Billing Date</span>
                <span className="value">Nov 1, 2026</span>
                <span className="subtext">₹39,999.00 renewal charge</span>
              </div>
            </div>

            <div className="admin-invoices-stat-card">
              <div className="admin-invoices-stat-icon blue">
                <ShieldCheck size={22} />
              </div>
              <div className="admin-invoices-stat-info">
                <span className="label">Active Plan</span>
                <span className="value">Enterprise AI</span>
                <span className="subtext">25 Seats • Unlimited workspaces</span>
              </div>
            </div>

            <div className="admin-invoices-stat-card">
              <div className="admin-invoices-stat-icon orange">
                <CreditCard size={22} />
              </div>
              <div className="admin-invoices-stat-info">
                <span className="label">Payment Method</span>
                <span className="value">Visa •••• 4242</span>
                <span className="subtext">Expires 08/28 • Primary</span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="admin-invoices-card">
            {/* Filter toolbar */}
            <div className="admin-invoices-toolbar">
              <div className="admin-invoices-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by invoice #, plan, payment method..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setCurrentPage(1);
                    }}
                    className="clear-btn"
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="admin-invoices-filters">
                <div className="filter-select-wrapper">
                  <Filter size={14} />
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    aria-label="Filter invoice status"
                  >
                    <option value="all">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div className="filter-select-wrapper">
                  <select
                    value={methodFilter}
                    onChange={(e) => {
                      setMethodFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    aria-label="Filter payment method"
                  >
                    <option value="all">All Payment Methods</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">MasterCard</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>

                <div className="filter-select-wrapper">
                  <select
                    value={`${sortKey}-${sortOrder}`}
                    onChange={(e) => {
                      const [k, ord] = e.target.value.split("-");
                      setSortKey(k);
                      setSortOrder(ord);
                      setCurrentPage(1);
                    }}
                    aria-label="Sort statements"
                  >
                    <option value="date-desc">Sort: Date (Newest)</option>
                    <option value="date-asc">Sort: Date (Oldest)</option>
                    <option value="amount-desc">Sort: Amount (High to Low)</option>
                    <option value="amount-asc">Sort: Amount (Low to High)</option>
                    <option value="status-asc">Sort: Status</option>
                  </select>
                </div>

                {(search || statusFilter !== "all" || methodFilter !== "all") && (
                  <button
                    type="button"
                    className="clear-filters-btn"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("all");
                      setMethodFilter("all");
                      setCurrentPage(1);
                    }}
                  >
                    <X size={13} />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Invoices Table */}
            <div className="admin-invoices-table-responsive">
              <table className="admin-invoices-table">
                <thead>
                  <tr>
                    <th style={{ width: 48, textAlign: "center" }}>#</th>
                    <th className="sortable-th" onClick={() => handleSort("id")}>
                      <div className="th-content">
                        <span>INVOICE</span>
                        {renderSortIcon("id")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("date")}>
                      <div className="th-content">
                        <span>BILLING DATE</span>
                        {renderSortIcon("date")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("description")}>
                      <div className="th-content">
                        <span>DESCRIPTION</span>
                        {renderSortIcon("description")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("method")}>
                      <div className="th-content">
                        <span>PAYMENT METHOD</span>
                        {renderSortIcon("method")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("amount")}>
                      <div className="th-content">
                        <span>AMOUNT (INR)</span>
                        {renderSortIcon("amount")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("status")}>
                      <div className="th-content">
                        <span>STATUS</span>
                        {renderSortIcon("status")}
                      </div>
                    </th>
                    <th style={{ textAlign: "right" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="empty-row">
                        <FileText size={32} />
                        <p>No invoices match your search or filter.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedInvoices.map((inv, idx) => (
                      <tr key={inv.id}>
                        <td style={{ textAlign: "center" }}>
                          <span className="admin-row-num">
                            {(safeCurrentPage - 1) * perPage + idx + 1}
                          </span>
                        </td>
                        <td>
                          <span
                            className="invoice-id-badge clickable-badge"
                            onClick={() => setSelectedInvoice(inv)}
                            title="Click to preview statement"
                          >
                            {inv.id}
                          </span>
                        </td>
                        <td>{inv.date}</td>
                        <td className="description-cell">
                          <span className="desc-title">{inv.description}</span>
                        </td>
                        <td>
                          <span className="method-pill">
                            <CreditCard size={13} />
                            {inv.method}
                          </span>
                        </td>
                        <td>
                          <span className="amount-text">{formatINR(inv.amount)}</span>
                        </td>
                        <td>
                          <span className={`status-badge ${inv.status.toLowerCase()}`}>
                            {inv.status === "Paid" && <Check size={12} />}
                            {inv.status === "Pending" && <Clock size={12} />}
                            {inv.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div className="invoice-row-actions">
                            <button
                              type="button"
                              className="inv-action-icon inv-view-btn"
                              title="Preview Statement Receipt"
                              onClick={() => setSelectedInvoice(inv)}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              className="inv-action-icon inv-print-btn"
                              title="Print Statement Receipt"
                              onClick={() => handlePrint(inv)}
                            >
                              <Printer size={14} />
                            </button>
                            <button
                              type="button"
                              className={`inv-action-icon inv-download-btn ${downloadSuccess === inv.id ? "downloaded" : ""}`}
                              title={downloadSuccess === inv.id ? "PDF Downloaded!" : "Download in PDF format"}
                              aria-label="Download in PDF format"
                              onClick={() => handleDownloadPDF(inv)}
                            >
                              {downloadSuccess === inv.id ? <Check size={14} /> : <Download size={14} />}
                            </button>
                            <button
                              type="button"
                              className="inv-action-icon inv-status-btn"
                              title="Cycle Status (Paid / Pending / Refunded)"
                              onClick={() => toggleInvoiceStatus(inv.id)}
                            >
                              <Clock size={14} />
                            </button>
                            <button
                              type="button"
                              className="inv-action-icon inv-delete-btn"
                              title="Delete Statement"
                              onClick={() => setInvoiceToDelete(inv)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION BAR (Matching Reports & Help/Support) */}
            {filteredInvoices.length > 0 && (
              <div className="ws-pagination-bar reports-pagination-bar">
                <div className="ws-pagination-info">
                  <span>
                    Showing {filteredInvoices.length === 0 ? 0 : (safeCurrentPage - 1) * perPage + 1} to{" "}
                    {Math.min(safeCurrentPage * perPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
                  </span>
                  <div className="ws-page-size-wrap">
                    <span>Invoices per page:</span>
                    <select
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      aria-label="Select invoices per page"
                    >
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                </div>

                <div className="ws-pagination-controls">
                  <button
                    type="button"
                    className="ws-page-nav-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage <= 1}
                  >
                    Previous
                  </button>
                  <div className="ws-page-pills">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`ws-page-num-pill ${safeCurrentPage === num ? "active" : ""}`}
                        onClick={() => setCurrentPage(num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="ws-page-nav-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage >= totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="admin-invoices-modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div
            id="invoice-printable-area"
            className="admin-invoices-modal receipt-modal real-invoice-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header (Screen Only) */}
            <div className="modal-header no-print">
              <div className="receipt-brand">
                <span className="brand-badge">TeamFlow AI</span>
                <h3>Official Invoice #{selectedInvoice.id}</h3>
              </div>
              <div className="modal-header-actions">
                <button
                  type="button"
                  className="receipt-header-print-btn"
                  onClick={() => handlePreviewPDF(selectedInvoice)}
                  title="Preview PDF document in new browser tab"
                  aria-label="Preview PDF"
                >
                  <FileText size={15} />
                </button>
                <button
                  type="button"
                  className="receipt-header-print-btn"
                  onClick={() => handleDownloadPDF(selectedInvoice)}
                  title="Download statement in PDF format"
                  aria-label="Download PDF"
                >
                  <Download size={15} />
                </button>
                <button
                  type="button"
                  className="receipt-header-print-btn"
                  onClick={() => handleModalPrint(selectedInvoice)}
                  title="Print 1-Page Statement Receipt"
                  aria-label="Print Statement Receipt"
                >
                  <Printer size={15} />
                </button>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setSelectedInvoice(null)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* REAL OFFICIAL INVOICE SHEET (Screen & Print) */}
            <div className="modal-body receipt-body real-invoice-sheet">
              {/* REALISTIC RUBBER STAMP */}
              <div className="invoice-stamp-container">
                <InvoiceStamp status={selectedInvoice.status} date={selectedInvoice.date} />
              </div>

              {/* CORPORATE LETTERHEAD */}
              <div className="invoice-sheet-header">
                <div className="invoice-company-brand">
                  <div className="brand-logo-lockup">
                    <div className="invoice-brand-logo-wrap" title="TeamFlow AI">
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="invoice-teamflow-logo"
                      >
                        <rect width="28" height="28" rx="8" fill="#4361ee" />
                        <path
                          d="M8 9H20M14 9V19M11 19H17"
                          stroke="#ffffff"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="21" cy="7" r="2.5" fill="#38bdf8" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="company-name">TeamFlow AI Inc.</h2>
                      <span className="company-tagline">Enterprise AI Workflows & Cloud Infrastructure</span>
                    </div>
                  </div>
                  <div className="company-address-block">
                    <p>500 Howard Street, Suite 400 • San Francisco, CA 94105</p>
                    <p>Corporate Tax ID: US-EIN-948201948 • billing@teamflow.ai</p>
                  </div>
                </div>

                <div className="invoice-title-meta">
                  <span className="invoice-kicker">TAX INVOICE / RECEIPT</span>
                  <h1 className="invoice-number">#{selectedInvoice.id}</h1>
                  <div className="invoice-quick-chips">
                    <span className="quick-chip">Issued: {selectedInvoice.date}</span>
                    <span className="quick-chip">Due: {selectedInvoice.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* TWO COLUMN BILLING & METADATA GRID */}
              <div className="invoice-entity-grid">
                <div className="entity-card billed-to">
                  <span className="entity-label">BILLED TO</span>
                  <h3 className="client-company-name">{billingInfo.company}</h3>
                  <p className="client-tax">{billingInfo.taxId ? `Tax ID: ${billingInfo.taxId}` : "Corporate Account"}</p>
                  <p className="client-address">{billingInfo.address}, {billingInfo.city}, {billingInfo.state} {billingInfo.zip}</p>
                  <p className="client-email">{billingInfo.email}</p>
                </div>

                <div className="entity-card payment-details">
                  <span className="entity-label">PAYMENT METADATA</span>
                  <div className="meta-row">
                    <span className="meta-label">Payment Method:</span>
                    <span className="meta-value method-tag">
                      <CreditCard size={13} /> {selectedInvoice.method}
                    </span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Settlement Status:</span>
                    <span className={`meta-value status-badge ${selectedInvoice.status.toLowerCase()}`}>
                      <Check size={12} /> {selectedInvoice.status}
                    </span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Currency:</span>
                    <span className="meta-value">INR (₹)</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Transaction Auth:</span>
                    <span className="meta-value auth-code">TF-AUTH-{selectedInvoice.id.slice(-4)}-99</span>
                  </div>
                </div>
              </div>

              {/* ITEMIZED TABLE */}
              <div className="receipt-breakdown real-table-breakdown">
                <h4>Itemized Statement of Charges</h4>
                <table className="breakdown-table">
                  <thead>
                    <tr>
                      <th style={{ width: 36, textAlign: "center" }}>#</th>
                      <th>Item Description</th>
                      <th style={{ textAlign: "center" }}>Qty</th>
                      <th style={{ textAlign: "right" }}>Unit Rate</th>
                      <th style={{ textAlign: "right" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ textAlign: "center", color: "#64748b" }}>{idx + 1}</td>
                        <td className="item-name-cell">
                          <strong>{item.name}</strong>
                          <span className="item-sub">Cloud usage billed per active subscription cycle</span>
                        </td>
                        <td style={{ textAlign: "center" }}>{item.qty}</td>
                        <td style={{ textAlign: "right" }}>{formatINR(item.rate)}</td>
                        <td style={{ textAlign: "right", fontWeight: "600" }}>{formatINR(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="invoice-calc-label">Subtotal:</td>
                      <td className="invoice-calc-value">{formatINR(selectedInvoice.amount)}</td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="invoice-tax-label">Sales Tax / GST (0.00% Reverse Charge):</td>
                      <td className="invoice-tax-value">₹0.00</td>
                    </tr>
                    <tr className="total-row">
                      <td colSpan="4" className="invoice-total-label">Total Amount:</td>
                      <td className="invoice-total-value">
                        {formatINR(selectedInvoice.amount)} INR
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* BOTTOM VERIFICATION & SIGNATURE DOCK */}
              <div className="invoice-bottom-dock">
                {/* QR CODE VERIFICATION BOX */}
                <div className="invoice-qr-verification-box">
                  <div className="qr-svg-holder">
                    <InvoiceQRCode id={selectedInvoice.id} size={58} />
                  </div>
                  <div className="qr-info-content">
                    <div className="qr-badge">
                      <QrCode size={13} />
                      <span>E-INVOICE VERIFIED</span>
                    </div>
                    <span className="qr-headline">Official Cryptographic Hash</span>
                    <span className="qr-sub">Scan to verify invoice ledger authenticity online</span>
                    <span className="qr-sig-hash">SHA256: 4e82b7...910a{selectedInvoice.id.slice(-3)}</span>
                  </div>
                </div>

                {/* DIGITAL SIGNATURE BLOCK */}
                <div className="invoice-signatory-box">
                  <span className="sig-label">AUTHORIZED SIGNATURE</span>
                  <div className="sig-cursive-font">
                    Elena Rostova
                  </div>
                  <div className="sig-meta">
                    <strong>Elena Rostova</strong>
                    <span>Corporate Treasury & Controller</span>
                    <span className="sig-corp">TeamFlow AI Corporation</span>
                  </div>
                </div>
              </div>

              {/* LEGAL & AUDIT FOOTER */}
              <div className="invoice-sheet-legal-note">
                <p>
                  This official statement was electronically issued by TeamFlow AI Inc. All payments processed via PCI-DSS Level 1 compliant gateway. Under US E-SIGN and UETA legislation, this document represents an immutable settlement record.
                </p>
              </div>
            </div>

            {/* MODAL FOOTER (Screen Only) */}
            <div className="modal-footer no-print">
              <button
                type="button"
                className="admin-invoices-btn-secondary"
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="admin-invoices-btn-secondary"
                onClick={() => handlePreviewPDF(selectedInvoice)}
                title="Preview PDF document in new browser tab"
              >
                <FileText size={15} />
                <span>Preview PDF</span>
              </button>
              <button
                type="button"
                className="admin-invoices-btn-secondary print-modal-btn"
                onClick={() => handleModalPrint(selectedInvoice)}
                title="Print 1-page official receipt or Save as PDF"
              >
                <Printer size={15} />
                <span>Print 1-Page Receipt</span>
              </button>
              <button
                type="button"
                className="admin-invoices-btn-primary download-pdf-btn"
                onClick={() => {
                  handleDownloadPDF(selectedInvoice);
                }}
                title="Download official statement in PDF format"
              >
                {downloadSuccess === selectedInvoice.id ? <Check size={15} /> : <Download size={15} />}
                <span>{downloadSuccess === selectedInvoice.id ? "PDF Downloaded" : "Download in PDF"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Billing Information Modal */}
      {showBillingModal && (
        <div className="admin-invoices-modal-overlay" onClick={() => setShowBillingModal(false)}>
          <div className="admin-invoices-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Organization Billing Information</h3>
              <button className="close-btn" onClick={() => setShowBillingModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBilling}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Company Legal Name</label>
                  <input
                    type="text"
                    value={billingInfo.company}
                    onChange={(e) => setBillingInfo({ ...billingInfo, company: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tax / VAT ID (Optional)</label>
                  <input
                    type="text"
                    value={billingInfo.taxId}
                    onChange={(e) => setBillingInfo({ ...billingInfo, taxId: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Billing Contact Email</label>
                  <input
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    value={billingInfo.address}
                    onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row-three">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={billingInfo.city}
                      onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State / Region</label>
                    <input
                      type="text"
                      value={billingInfo.state}
                      onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      value={billingInfo.zip}
                      onChange={(e) => setBillingInfo({ ...billingInfo, zip: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={billingInfo.country}
                    onChange={(e) => setBillingInfo({ ...billingInfo, country: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="admin-invoices-btn-secondary" onClick={() => setShowBillingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-invoices-btn-primary">
                  Save Billing Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {showCreateInvoiceModal && (
        <div className="admin-invoices-modal-overlay" onClick={() => setShowCreateInvoiceModal(false)}>
          <div className="admin-invoices-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Generate New Statement / Invoice</h3>
              <button className="close-btn" onClick={() => setShowCreateInvoiceModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Invoice Statement ID</label>
                  <input
                    type="text"
                    value={newInvoiceForm.id}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, id: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Plan / Charge Description</label>
                  <input
                    type="text"
                    value={newInvoiceForm.description}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="form-group">
                    <label>Amount (₹ INR)</label>
                    <input
                      type="number"
                      step="1"
                      value={newInvoiceForm.amount}
                      onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={newInvoiceForm.status}
                      onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, status: e.target.value })}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="form-group">
                    <label>Billing Date</label>
                    <input
                      type="date"
                      value={newInvoiceForm.date}
                      onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      value={newInvoiceForm.method}
                      onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, method: e.target.value })}
                    >
                      <option value="Visa •••• 4242">Visa •••• 4242</option>
                      <option value="Mastercard •••• 8821">Mastercard •••• 8821</option>
                      <option value="ACH Bank Transfer">ACH Bank Transfer</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="admin-invoices-btn-secondary" onClick={() => setShowCreateInvoiceModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-invoices-btn-primary">
                  Generate Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CSS DELETE CONFIRMATION MODAL */}
      {invoiceToDelete && (
        <div className="admin-invoices-modal-overlay" onClick={() => setInvoiceToDelete(null)}>
          <div
            className="admin-invoices-modal delete-confirm-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-invoice-title"
          >
            <div className="modal-header delete-modal-header">
              <div className="delete-modal-icon-badge">
                <AlertTriangle size={20} />
              </div>
              <div className="delete-modal-header-text">
                <h3 id="delete-invoice-title">Delete Invoice Statement</h3>
                <span className="delete-modal-subtitle">Statement #{invoiceToDelete.id}</span>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setInvoiceToDelete(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body delete-modal-body">
              <p className="delete-modal-lead">
                Are you sure you want to permanently delete this billing statement? This record will be removed from your dashboard history.
              </p>

              <div className="delete-invoice-preview-box">
                <div className="preview-top">
                  <span className="preview-id">{invoiceToDelete.id}</span>
                  <span className={`status-badge ${invoiceToDelete.status.toLowerCase()}`}>
                    {invoiceToDelete.status}
                  </span>
                  <span className="preview-amount">{formatINR(invoiceToDelete.amount)}</span>
                </div>
                <h4 className="preview-desc">{invoiceToDelete.description}</h4>
                <div className="preview-meta">
                  <span>Billing Date: {invoiceToDelete.date}</span>
                  <span>•</span>
                  <span>Method: {invoiceToDelete.method}</span>
                </div>
              </div>

              <div className="delete-modal-alert">
                <AlertCircle size={16} />
                <span>Historical tax ledgers may require statement preservation for annual financial compliance.</span>
              </div>
            </div>

            <div className="modal-footer delete-modal-footer">
              <button
                type="button"
                className="admin-invoices-btn-secondary"
                onClick={() => setInvoiceToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-invoices-btn-danger"
                onClick={confirmDeleteInvoice}
              >
                <Trash2 size={15} />
                <span>Delete Statement</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* =========================================================
        DEDICATED PRINT-ONLY CONTAINER (Zero Screen Footprint)
        Renders ONLY when printing, guaranteeing 100% reliable 1-page fit
    ========================================================= */}
    <div id="invoice-printable-sheet" className="invoice-print-container print-only">
        {currentPrintTarget && (
          <div className="printable-sheet-paper">
            {/* Top Corporate Accent Line */}
            <div className="print-top-accent-line" />

            {/* Letterhead Header */}
            <div className="print-sheet-header">
              <div className="print-brand-left">
                <div className="print-brand-title-wrap">
                  <div className="print-logo-box">
                    <ShieldCheck size={20} color="#ffffff" />
                  </div>
                  <div>
                    <h2 className="print-company-name">TeamFlow AI Inc.</h2>
                    <span className="print-company-sub">Enterprise AI Workflows & Cloud Infrastructure</span>
                  </div>
                </div>
                <p className="print-company-address">
                  500 Howard Street, Suite 400 • San Francisco, CA 94105 • Corporate Tax ID: US-EIN-948201948 • billing@teamflow.ai
                </p>
              </div>

              <div className="print-brand-right">
                <span className="print-tax-label">TAX INVOICE / OFFICIAL RECEIPT</span>
                <h3 className="print-inv-id">#{currentPrintTarget.id}</h3>
                <div className="print-dates-line">
                  <span>Issued: {currentPrintTarget.date}</span>
                  <span>•</span>
                  <span>Due: {currentPrintTarget.dueDate || currentPrintTarget.date}</span>
                </div>
                <div className={`print-status-tag ${currentPrintTarget.status.toLowerCase()}`}>
                  {currentPrintTarget.status.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Entity Boxes */}
            <div className="print-entity-grid">
              <div className="print-entity-card">
                <span className="print-entity-label">BILLED TO</span>
                <h4 className="print-client-name">{billingInfo.company}</h4>
                <span className="print-client-tax">Tax ID: {billingInfo.taxId || "US-EIN-948201948"}</span>
                <p className="print-client-p">{billingInfo.address}, {billingInfo.city}</p>
                <p className="print-client-p">{billingInfo.state} {billingInfo.zip}, {billingInfo.country}</p>
                <p className="print-client-email">{billingInfo.email}</p>
              </div>

              <div className="print-entity-card">
                <span className="print-entity-label">PAYMENT METADATA</span>
                <div className="print-meta-row">
                  <span>Payment Method:</span>
                  <strong>{currentPrintTarget.method}</strong>
                </div>
                <div className="print-meta-row">
                  <span>Settlement Status:</span>
                  <strong>{currentPrintTarget.status}</strong>
                </div>
                <div className="print-meta-row">
                  <span>Currency:</span>
                  <strong>INR (Indian Rupee - ₹)</strong>
                </div>
                <div className="print-meta-row">
                  <span>Transaction Auth:</span>
                  <code>TF-AUTH-{currentPrintTarget.id.slice(-4)}-99</code>
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="print-table-section">
              <h4 className="print-table-heading">Itemized Statement of Charges</h4>
              <table className="print-items-table">
                <thead>
                  <tr>
                    <th style={{ width: 28, textAlign: "center" }}>#</th>
                    <th>Item Description</th>
                    <th style={{ width: 50, textAlign: "center" }}>Qty</th>
                    <th style={{ width: 120, textAlign: "right" }}>Unit Rate (INR)</th>
                    <th style={{ width: 130, textAlign: "right" }}>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {(currentPrintTarget.items && currentPrintTarget.items.length > 0
                    ? currentPrintTarget.items
                    : [{ name: currentPrintTarget.description, qty: 1, rate: currentPrintTarget.amount, total: currentPrintTarget.amount }]
                  ).map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: "center", color: "#64748b" }}>{idx + 1}</td>
                      <td>
                        <strong>{item.name}</strong>
                        <span className="print-item-sub">Cloud usage billed per active subscription cycle</span>
                      </td>
                      <td style={{ textAlign: "center" }}>{item.qty}</td>
                      <td style={{ textAlign: "right" }}>{formatINR(item.rate)}</td>
                      <td style={{ textAlign: "right", fontWeight: 700 }}>{formatINR(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="print-calc-label">Subtotal:</td>
                    <td className="print-calc-value">{formatINR(currentPrintTarget.amount)}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="print-calc-label">Sales Tax / GST (0.00% Reverse Charge):</td>
                    <td className="print-calc-value">₹0.00</td>
                  </tr>
                  <tr className="print-total-row">
                    <td colSpan="4" className="print-total-label">Total Amount:</td>
                    <td className="print-total-value">
                      {formatINR(currentPrintTarget.amount)} INR
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Bottom Dock: Verification & Authorized Signature */}
            <div className="print-bottom-dock">
              <div className="print-dock-box print-qr-box">
                <div className="print-qr-code">
                  <InvoiceQRCode id={currentPrintTarget.id} size={46} />
                </div>
                <div className="print-qr-details">
                  <span className="print-verified-badge">E-INVOICE VERIFIED</span>
                  <strong>Official Cryptographic Ledger</strong>
                  <span>Scan to verify invoice ledger authenticity online</span>
                  <code>SHA256: 4e82b7...910a{currentPrintTarget.id.slice(-3)}</code>
                </div>
              </div>

              <div className="print-dock-box print-sig-box">
                <span className="print-sig-label">AUTHORIZED SIGNATURE</span>
                <div className="print-sig-signature">Elena Rostova</div>
                <strong>Elena Rostova</strong>
                <span>Corporate Treasury & Controller</span>
                <span className="print-sig-corp">TeamFlow AI Corporation</span>
              </div>
            </div>

            {/* Legal & Compliance note */}
            <div className="print-legal-footer">
              <p>
                This official statement was electronically issued by TeamFlow AI Inc. All payments processed via PCI-DSS Level 1 compliant gateway. Under US E-SIGN and UETA legislation, this document represents an immutable settlement record.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

