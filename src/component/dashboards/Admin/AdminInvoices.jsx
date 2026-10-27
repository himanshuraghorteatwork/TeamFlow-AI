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
  CreditCard,
  Building,
  Mail,
  Calendar,
  DollarSign,
  ChevronRight,
  Printer,
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  FileSpreadsheet,
  Plus,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminInvoices.css";

const INITIAL_INVOICES = [
  {
    id: "INV-2026-010",
    date: "2026-10-01",
    dueDate: "2026-10-15",
    description: "Enterprise Plan - Monthly Subscription (25 Seats + AI Pro)",
    amount: 499.00,
    status: "Paid",
    method: "Visa •••• 4242",
    items: [
      { name: "TeamFlow Enterprise (25 Seats)", qty: 1, rate: 399.00, total: 399.00 },
      { name: "AI Power Pack (1M Tokens/mo)", qty: 1, rate: 100.00, total: 100.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-009",
    date: "2026-09-01",
    dueDate: "2026-09-15",
    description: "Enterprise Plan - Monthly Subscription (25 Seats + AI Pro)",
    amount: 499.00,
    status: "Paid",
    method: "Visa •••• 4242",
    items: [
      { name: "TeamFlow Enterprise (25 Seats)", qty: 1, rate: 399.00, total: 399.00 },
      { name: "AI Power Pack (1M Tokens/mo)", qty: 1, rate: 100.00, total: 100.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-008",
    date: "2026-08-01",
    dueDate: "2026-08-15",
    description: "Enterprise Plan - Monthly Subscription (20 Seats)",
    amount: 399.00,
    status: "Paid",
    method: "Visa •••• 4242",
    items: [
      { name: "TeamFlow Enterprise (20 Seats)", qty: 1, rate: 399.00, total: 399.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-007",
    date: "2026-07-01",
    dueDate: "2026-07-15",
    description: "Enterprise Plan - Monthly Subscription (20 Seats)",
    amount: 399.00,
    status: "Paid",
    method: "Mastercard •••• 8821",
    items: [
      { name: "TeamFlow Enterprise (20 Seats)", qty: 1, rate: 399.00, total: 399.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-006",
    date: "2026-06-01",
    dueDate: "2026-06-15",
    description: "Enterprise Plan - Monthly Subscription (15 Seats)",
    amount: 299.00,
    status: "Paid",
    method: "Mastercard •••• 8821",
    items: [
      { name: "TeamFlow Enterprise (15 Seats)", qty: 1, rate: 299.00, total: 299.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  },
  {
    id: "INV-2026-005",
    date: "2026-05-01",
    dueDate: "2026-05-15",
    description: "Pro Plan - Monthly Subscription",
    amount: 149.00,
    status: "Paid",
    method: "Mastercard •••• 8821",
    items: [
      { name: "TeamFlow Pro (10 Seats)", qty: 1, rate: 149.00, total: 149.00 }
    ],
    tax: 0.00,
    pdfUrl: "#"
  }
];

export default function AdminInvoices() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem("teamflow_admin_invoices");
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  const [newInvoiceForm, setNewInvoiceForm] = useState({
    id: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`,
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    description: "Enterprise Monthly Subscription",
    amount: 399.00,
    status: "Paid",
    method: "Visa •••• 4242",
  });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
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

  const deleteInvoice = (id) => {
    if (!window.confirm(`Delete statement "${id}"?`)) return;
    setInvoices(invoices.filter(i => i.id !== id));
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

  const totalSpent = useMemo(() => {
    return invoices
      .filter(i => i.status === "Paid")
      .reduce((sum, i) => sum + i.amount, 0);
  }, [invoices]);

  const handleDownloadPDF = (inv) => {
    // Generate a downloadable text/receipt blob simulating PDF
    const content = `
===================================================
              TEAMFLOW AI - OFFICIAL RECEIPT
===================================================
Invoice Number: ${inv.id}
Date Issued:    ${inv.date}
Payment Due:    ${inv.dueDate}
Status:         ${inv.status}
Payment Method: ${inv.method}

BILLED TO:
${billingInfo.company}
Tax ID: ${billingInfo.taxId}
Email: ${billingInfo.email}
Address: ${billingInfo.address}, ${billingInfo.city}, ${billingInfo.state} ${billingInfo.zip}, ${billingInfo.country}

---------------------------------------------------
LINE ITEMS:
${inv.items.map(it => `- ${it.name} x${it.qty} = $${it.total.toFixed(2)}`).join("\n")}

Subtotal: $${inv.amount.toFixed(2)}
Tax (0%): $0.00
---------------------------------------------------
TOTAL PAID: $${inv.amount.toFixed(2)} USD
===================================================
Thank you for building with TeamFlow AI!
Support: billing@teamflow.ai | https://teamflow.ai
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${inv.id}-receipt.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(inv.id);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const exportCSV = () => {
    const headers = ["Invoice ID", "Date", "Due Date", "Description", "Amount", "Status", "Payment Method"];
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

  return (
    <div className="admin-invoices-app">
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
                <DollarSign size={22} />
              </div>
              <div className="admin-invoices-stat-info">
                <span className="label">Total Invoiced</span>
                <span className="value">${totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
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
                <span className="subtext">$499.00 renewal charge</span>
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
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="clear-btn">
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="admin-invoices-filters">
                <div className="filter-select-wrapper">
                  <Filter size={14} />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
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
                    onChange={(e) => setMethodFilter(e.target.value)}
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
                        <span>AMOUNT</span>
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
                    filteredInvoices.map((inv, idx) => (
                      <tr key={inv.id}>
                        <td style={{ textAlign: "center" }}>
                          <span className="admin-row-num">{idx + 1}</span>
                        </td>
                        <td>
                          <span className="invoice-id-badge clickable-badge" onClick={() => setSelectedInvoice(inv)}>
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
                          <span className="amount-text">${inv.amount.toFixed(2)}</span>
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
                              className="inv-action-pill inv-view-btn"
                              title="View Receipt Statement"
                              onClick={() => setSelectedInvoice(inv)}
                            >
                              <Eye size={13} />
                              <span>View Receipt</span>
                            </button>
                            <button
                              type="button"
                              className="inv-action-icon inv-status-btn"
                              title="Toggle Status (Paid / Pending)"
                              onClick={() => toggleInvoiceStatus(inv.id)}
                            >
                              <Clock size={13} />
                            </button>
                            <button
                              type="button"
                              className="inv-action-icon inv-delete-btn"
                              title="Delete Invoice"
                              onClick={() => deleteInvoice(inv.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="admin-invoices-modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div className="admin-invoices-modal receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="receipt-brand">
                <span className="brand-badge">TeamFlow AI</span>
                <h3>Receipt #{selectedInvoice.id}</h3>
              </div>
              <button className="close-btn" onClick={() => setSelectedInvoice(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body receipt-body">
              <div className="receipt-top-info">
                <div>
                  <label>Issued Date</label>
                  <p>{selectedInvoice.date}</p>
                </div>
                <div>
                  <label>Payment Method</label>
                  <p>{selectedInvoice.method}</p>
                </div>
                <div>
                  <label>Status</label>
                  <span className={`status-badge ${selectedInvoice.status.toLowerCase()}`}>
                    <Check size={12} /> {selectedInvoice.status}
                  </span>
                </div>
              </div>

              <div className="receipt-client-box">
                <h4>Billed To</h4>
                <p className="client-name">{billingInfo.company}</p>
                <p>Tax ID: {billingInfo.taxId}</p>
                <p>{billingInfo.address}, {billingInfo.city}, {billingInfo.state} {billingInfo.zip}</p>
                <p>{billingInfo.email}</p>
              </div>

              <div className="receipt-breakdown">
                <h4>Line Items</h4>
                <table className="breakdown-table">
                  <thead>
                    <tr>
                      <th>Item Description</th>
                      <th>Qty</th>
                      <th style={{ textAlign: "right" }}>Rate</th>
                      <th style={{ textAlign: "right" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>{item.qty}</td>
                        <td style={{ textAlign: "right" }}>${item.rate.toFixed(2)}</td>
                        <td style={{ textAlign: "right" }}>${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" style={{ textAlign: "right", fontWeight: "600" }}>Subtotal:</td>
                      <td style={{ textAlign: "right", fontWeight: "600" }}>${selectedInvoice.amount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td colSpan="3" style={{ textAlign: "right", color: "#64748b" }}>Tax (0.00%):</td>
                      <td style={{ textAlign: "right", color: "#64748b" }}>$0.00</td>
                    </tr>
                    <tr className="total-row">
                      <td colSpan="3" style={{ textAlign: "right", fontWeight: "700" }}>Total Paid:</td>
                      <td style={{ textAlign: "right", fontWeight: "700", color: "#6366f1" }}>${selectedInvoice.amount.toFixed(2)} USD</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="admin-invoices-btn-secondary" onClick={() => setSelectedInvoice(null)}>
                Close
              </button>
              <button
                className="admin-invoices-btn-primary"
                onClick={() => {
                  handleDownloadPDF(selectedInvoice);
                }}
              >
                <Download size={15} />
                Download Receipt
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
                    <label>Amount ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
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
    </div>
  );
}

