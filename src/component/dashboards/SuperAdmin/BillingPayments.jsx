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
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./BillingPayments.css";

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
];

const revenueTrend = [
  { day: "Mon", vol: 24500 },
  { day: "Tue", vol: 38200 },
  { day: "Wed", vol: 41000 },
  { day: "Thu", vol: 29800 },
  { day: "Fri", vol: 54600 },
  { day: "Sat", vol: 62000 },
  { day: "Sun", vol: 48900 },
];

function BillingPayments() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedTxn, setSelectedTxn] = useState(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || t.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, statusFilter]);

  const maxVolume = Math.max(...revenueTrend.map((r) => r.vol));

  const handleRefund = (id) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Refunded" } : t))
    );
    if (selectedTxn && selectedTxn.id === id) {
      setSelectedTxn((prev) => ({ ...prev, status: "Refunded" }));
    }
  };

  return (
    <div className="sa-page-container sa-billing-page">
      {/* 1. Header */}
      <section className="sa-page-header">
        <div className="sa-page-header-left">
          <h1>Billing & Payments</h1>
          <p>Real-time payment gateway telemetry, settlement payouts, and transaction logs.</p>
        </div>

        <div className="sa-page-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={() => {
              const csvContent =
                "data:text/csv;charset=utf-8," +
                ["Transaction ID,Org,Amount,Gateway,Status,Date"]
                  .concat(
                    transactions.map(
                      (t) =>
                        `${t.id},${t.org},${t.amount},${t.gateway},${t.status},${t.date}`
                    )
                  )
                  .join("\n");
              const link = document.createElement("a");
              link.setAttribute("href", encodeURI(csvContent));
              link.setAttribute("download", "billing_transactions.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download size={15} /> Export CSV
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
            <p className="sa-kpi-title">Monthly Volume</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">₹2.48L</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 16%
              </span>
            </div>
            <span className="sa-kpi-subtitle">142 paid renewals</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <CreditCard size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Gateway Success</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">99.4%</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 0.3%
              </span>
            </div>
            <span className="sa-kpi-subtitle">Razorpay & Stripe combined</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <RotateCcw size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Refunds & Chargebacks</p>
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
            <p className="sa-kpi-title">Next Settlement</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">₹84,200</span>
              <span className="sa-kpi-trend positive">
                <Clock size={14} /> In 24h
              </span>
            </div>
            <span className="sa-kpi-subtitle">Automated bank payout</span>
          </div>
        </article>
      </section>

      {/* 3. Live Daily Volume Chart */}
      <section className="sa-card sa-volume-chart-card">
        <div className="sa-card-header">
          <h3>Daily Processed Volume (Last 7 Days)</h3>
          <span className="sa-total-tag">₹2,99,000 this week</span>
        </div>

        <div className="sa-daily-bar-chart">
          {revenueTrend.map((item) => {
            const heightPercent = (item.vol / maxVolume) * 100;
            return (
              <div key={item.day} className="sa-daily-bar-col">
                <div className="sa-bar-track">
                  <div
                    className="sa-bar-fill"
                    style={{ height: `${heightPercent}%` }}
                    title={`₹${item.vol.toLocaleString()}`}
                  />
                </div>
                <span className="sa-bar-day">{item.day}</span>
                <span className="sa-bar-val">₹{(item.vol / 1000).toFixed(0)}k</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Transactions Table & Filters */}
      <section className="sa-card sa-transactions-card">
        <div className="sa-filter-bar">
          <div className="sa-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by ID, organization, or email..."
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
                <option value="Succeeded">Succeeded</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
                <option value="Failed">Failed</option>
              </select>
              <ChevronDown size={13} className="sa-chevron" />
            </div>
          </div>
        </div>

        <div className="sa-table-wrapper">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Organization & User</th>
                <th>Amount</th>
                <th>Plan Tier</th>
                <th>Gateway & Method</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <strong style={{ color: "#3b66ff" }}>{tx.id}</strong>
                  </td>
                  <td>
                    <div className="sa-user-badge">
                      <div className="sa-org-avatar-icon blue" style={{ width: 28, height: 28 }}>
                        <Building2 size={15} />
                      </div>
                      <div>
                        <strong>{tx.org}</strong>
                        <div style={{ color: "#64748b", fontSize: 11 }}>{tx.customer}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>₹{tx.amount.toLocaleString()}</strong>
                  </td>
                  <td>{tx.plan}</td>
                  <td>
                    <div>
                      <strong>{tx.gateway}</strong>
                      <div style={{ color: "#64748b", fontSize: 11 }}>{tx.method}</div>
                    </div>
                  </td>
                  <td style={{ color: "#64748b" }}>{tx.date}</td>
                  <td>
                    <span
                      className={`sa-pill ${
                        tx.status === "Succeeded"
                          ? "sa-pill-success"
                          : tx.status === "Pending"
                          ? "sa-pill-warning"
                          : tx.status === "Refunded"
                          ? "sa-pill-info"
                          : "sa-pill-danger"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={() => setSelectedTxn(tx)}
                        title="View Details"
                      >
                        <Eye size={13} />
                      </button>
                      {tx.status === "Succeeded" && (
                        <button
                          type="button"
                          className="sa-btn sa-btn-secondary sa-btn-sm"
                          style={{ color: "#dc2626" }}
                          onClick={() => handleRefund(tx.id)}
                          title="Issue Refund"
                        >
                          <RotateCcw size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Transaction Detail Modal */}
      {selectedTxn && typeof document !== "undefined" && createPortal(
        <div className="sa-modal-backdrop">
          <div className="sa-modal-content">
            <div className="sa-modal-header">
              <h3>Transaction Receipt: {selectedTxn.id}</h3>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setSelectedTxn(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body">
              <div className="sa-receipt-summary">
                <span className="sa-receipt-label">Amount Paid</span>
                <span className="sa-receipt-val">₹{selectedTxn.amount.toLocaleString()}</span>
                <span
                  className={`sa-pill ${
                    selectedTxn.status === "Succeeded"
                      ? "sa-pill-success"
                      : "sa-pill-warning"
                  }`}
                >
                  {selectedTxn.status}
                </span>
              </div>

              <div className="sa-receipt-grid">
                <div>
                  <label>Organization</label>
                  <p>{selectedTxn.org}</p>
                </div>
                <div>
                  <label>Payer Name</label>
                  <p>{selectedTxn.customer}</p>
                </div>
                <div>
                  <label>Email Address</label>
                  <p>{selectedTxn.email}</p>
                </div>
                <div>
                  <label>Plan Subscribed</label>
                  <p>{selectedTxn.plan}</p>
                </div>
                <div>
                  <label>Payment Gateway</label>
                  <p>{selectedTxn.gateway}</p>
                </div>
                <div>
                  <label>Payment Method</label>
                  <p>{selectedTxn.method}</p>
                </div>
                <div>
                  <label>Transaction Date</label>
                  <p>{selectedTxn.date}</p>
                </div>
                <div>
                  <label>Tax Invoice</label>
                  <p>INV-{selectedTxn.id.replace("TXN-", "2024-")}</p>
                </div>
              </div>
            </div>

            <div className="sa-modal-footer">
              {selectedTxn.status === "Succeeded" && (
                <button
                  type="button"
                  className="sa-btn sa-btn-danger"
                  onClick={() => handleRefund(selectedTxn.id)}
                >
                  <RotateCcw size={14} /> Process Full Refund
                </button>
              )}
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={() => setSelectedTxn(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default BillingPayments;

