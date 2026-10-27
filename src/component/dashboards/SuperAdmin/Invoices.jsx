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
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Invoices.css";

const INITIAL_INVOICES = [
  {
    id: "INV-2024-1089",
    org: "ABC Technologies",
    contact: "Himanshu Rao",
    email: "billing@abc.com",
    gstin: "27AABCA1234D1Z5",
    plan: "Business Plan (Monthly)",
    subtotal: 6778.81,
    gst: 1220.19,
    total: 7999,
    issueDate: "2024-10-01",
    dueDate: "2024-10-15",
    status: "Paid",
  },
  {
    id: "INV-2024-1088",
    org: "XYZ Software",
    contact: "Amit Verma",
    email: "accounts@xyz.com",
    gstin: "29AABCZ5678F1Z2",
    plan: "Pro Plan (Monthly)",
    subtotal: 2117.8,
    gst: 381.2,
    total: 2499,
    issueDate: "2024-10-03",
    dueDate: "2024-10-17",
    status: "Paid",
  },
  {
    id: "INV-2024-1087",
    org: "NovaTech Solutions",
    contact: "Priya Nair",
    email: "finance@novatech.io",
    gstin: "07AAACN9012K1Z8",
    plan: "Enterprise Plan (Monthly)",
    subtotal: 21185.59,
    gst: 3813.41,
    total: 24999,
    issueDate: "2024-10-05",
    dueDate: "2024-10-19",
    status: "Paid",
  },
  {
    id: "INV-2024-1086",
    org: "PixelCraft Studio",
    contact: "David Chen",
    email: "david@pixelcraft.co",
    gstin: "06AABCP3456L1Z4",
    plan: "Pro Plan (Monthly)",
    subtotal: 2117.8,
    gst: 381.2,
    total: 2499,
    issueDate: "2024-10-12",
    dueDate: "2024-10-26",
    status: "Pending",
  },
  {
    id: "INV-2024-1085",
    org: "DesignHub",
    contact: "Rohan Kapoor",
    email: "billing@designhub.in",
    gstin: "33AABCD7890M1Z9",
    plan: "Pro Plan (Monthly)",
    subtotal: 2117.8,
    gst: 381.2,
    total: 2499,
    issueDate: "2024-10-02",
    dueDate: "2024-10-16",
    status: "Overdue",
  },
  {
    id: "INV-2024-1084",
    org: "NextGen Solutions",
    contact: "Sana Sheikh",
    email: "sana@nextgen.com",
    gstin: "27AABCN4321P1Z1",
    plan: "Business Plan (Monthly)",
    subtotal: 6778.81,
    gst: 1220.19,
    total: 7999,
    issueDate: "2024-09-28",
    dueDate: "2024-10-12",
    status: "Paid",
  },
];

function Invoices() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.contact.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "All" || inv.status.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = (inv) => {
    const textData = `
========================================
TEAMFLOW AI - OFFICIAL TAX INVOICE
========================================
Invoice Number : ${inv.id}
Date of Issue  : ${inv.issueDate}
Due Date       : ${inv.dueDate}
Status         : ${inv.status.toUpperCase()}

BILLED TO:
Organization   : ${inv.org}
Contact Name   : ${inv.contact}
Email          : ${inv.email}
GSTIN          : ${inv.gstin}

ITEM DESCRIPTION:
- ${inv.plan}
Subtotal       : ₹${inv.subtotal.toFixed(2)}
GST (18%)      : ₹${inv.gst.toFixed(2)}
TOTAL AMOUNT   : ₹${inv.total.toFixed(2)}
========================================
Thank you for using TeamFlow AI!
    `;
    const blob = new Blob([textData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${inv.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sa-page-container sa-invoices-page">
      {/* 1. Page Header */}
      <section className="sa-page-header">
        <div className="sa-page-header-left">
          <h1>Invoices & Billing</h1>
          <p>Tax compliant GST invoices, automated receipts, and settlement archives.</p>
        </div>

        <div className="sa-page-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={() => {
              const csvContent =
                "data:text/csv;charset=utf-8," +
                ["Invoice ID,Organization,Contact,Total,Issue Date,Status"]
                  .concat(
                    invoices.map(
                      (i) =>
                        `${i.id},${i.org},${i.contact},${i.total},${i.issueDate},${i.status}`
                    )
                  )
                  .join("\n");
              const link = document.createElement("a");
              link.setAttribute("href", encodeURI(csvContent));
              link.setAttribute("download", "invoices_report.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download size={15} /> Export Report
          </button>
        </div>
      </section>

      {/* 2. Top 4 KPI Stat Cards */}
      <section className="sa-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <span className="sa-kpi-currency-symbol">₹</span>
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Total Invoiced (YTD)</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">₹24.5L</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 18%
              </span>
            </div>
            <span className="sa-kpi-subtitle">284 generated invoices</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <CheckCircle2 size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Paid Invoices</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">274</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 96.5%
              </span>
            </div>
            <span className="sa-kpi-subtitle">Collection rate on-time</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <Clock size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Pending Payment</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">₹19,992</span>
              <span className="sa-kpi-trend negative">
                8 invoices
              </span>
            </div>
            <span className="sa-kpi-subtitle">Due within 14 days</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box red">
            <AlertCircle size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Overdue Invoices</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">₹4,998</span>
              <span className="sa-kpi-trend negative">
                2 overdue
              </span>
            </div>
            <span className="sa-kpi-subtitle">Reminder emails dispatched</span>
          </div>
        </article>
      </section>

      {/* 3. Invoices Table */}
      <section className="sa-card sa-invoices-table-card">
        <div className="sa-filter-bar">
          <div className="sa-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by Invoice ID, organization, or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div className="sa-select-filter">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
              <ChevronDown size={13} className="sa-chevron" />
            </div>
          </div>
        </div>

        <div className="sa-table-wrapper">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Organization</th>
                <th>Plan Tier</th>
                <th>Issued Date</th>
                <th>Due Date</th>
                <th>Subtotal</th>
                <th>GST (18%)</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <strong style={{ color: "#3b66ff" }}>{inv.id}</strong>
                  </td>
                  <td>
                    <div className="sa-user-badge">
                      <div className="sa-org-avatar-icon blue" style={{ width: 28, height: 28 }}>
                        <Building2 size={15} />
                      </div>
                      <div>
                        <strong>{inv.org}</strong>
                        <div style={{ color: "#64748b", fontSize: 11 }}>{inv.contact}</div>
                      </div>
                    </div>
                  </td>
                  <td>{inv.plan}</td>
                  <td style={{ color: "#64748b" }}>{inv.issueDate}</td>
                  <td style={{ color: "#64748b" }}>{inv.dueDate}</td>
                  <td>₹{inv.subtotal.toFixed(2)}</td>
                  <td>₹{inv.gst.toFixed(2)}</td>
                  <td>
                    <strong>₹{inv.total.toFixed(2)}</strong>
                  </td>
                  <td>
                    <span
                      className={`sa-pill ${
                        inv.status === "Paid"
                          ? "sa-pill-success"
                          : inv.status === "Pending"
                          ? "sa-pill-warning"
                          : "sa-pill-danger"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={() => setSelectedInvoice(inv)}
                        title="View Tax Invoice"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={() => handleDownloadInvoice(inv)}
                        title="Download Invoice File"
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Invoice Modal */}
      {selectedInvoice && typeof document !== "undefined" && createPortal(
        <div className="sa-modal-backdrop">
          <div className="sa-modal-content" style={{ maxWidth: 640 }}>
            <div className="sa-modal-header">
              <h3>Tax Invoice: {selectedInvoice.id}</h3>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setSelectedInvoice(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body sa-invoice-preview">
              <div className="sa-inv-header-row">
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: 20, color: "#3b66ff" }}>
                    TeamFlow AI
                  </h2>
                  <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>
                    Tax Invoice / Bill of Supply
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    className={`sa-pill ${
                      selectedInvoice.status === "Paid"
                        ? "sa-pill-success"
                        : "sa-pill-warning"
                    }`}
                  >
                    {selectedInvoice.status}
                  </span>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                    Date: {selectedInvoice.issueDate}
                  </div>
                </div>
              </div>

              <div className="sa-inv-parties-grid">
                <div>
                  <label>ISSUED BY:</label>
                  <strong>TeamFlow AI Inc.</strong>
                  <p>Cyber City, DLF Phase 2, Gurugram, HR - 122002</p>
                  <p>GSTIN: 06AABCT9988Z1ZP</p>
                </div>
                <div>
                  <label>BILLED TO:</label>
                  <strong>{selectedInvoice.org}</strong>
                  <p>Attn: {selectedInvoice.contact} ({selectedInvoice.email})</p>
                  <p>GSTIN: {selectedInvoice.gstin}</p>
                </div>
              </div>

              <table className="sa-table" style={{ margin: "16px 0" }}>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{selectedInvoice.plan}</strong>
                      <div style={{ color: "#64748b", fontSize: 11 }}>
                        Subscription cycle from {selectedInvoice.issueDate} to {selectedInvoice.dueDate}
                      </div>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>
                      ₹{selectedInvoice.subtotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>CGST (9%) + SGST (9%) / IGST (18%)</td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>
                      ₹{selectedInvoice.gst.toFixed(2)}
                    </td>
                  </tr>
                  <tr style={{ background: "#f8fafc" }}>
                    <td>
                      <strong>Total Amount Due / Paid</strong>
                    </td>
                    <td style={{ textAlign: "right", fontSize: 15, fontWeight: 750, color: "#0f172a" }}>
                      ₹{selectedInvoice.total.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="sa-modal-footer">
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={handlePrint}
              >
                <Printer size={14} /> Print
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-primary"
                onClick={() => handleDownloadInvoice(selectedInvoice)}
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default Invoices;

