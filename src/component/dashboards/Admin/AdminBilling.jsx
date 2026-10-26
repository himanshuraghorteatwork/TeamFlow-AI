// src/component/AdminBilling/AdminBilling.jsx

import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Plus,
  ChevronDown,
  CreditCard,
  DollarSign,
  TrendingUp,
  ReceiptText,
  Download,
  MoreVertical,
  Eye,
  RotateCcw,
  X,
  CheckCircle2,
  Clock3,
  CircleX,
  Landmark,
  WalletCards,
  Settings,
  ArrowUpRight,
  BadgeDollarSign,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";

import {
  initialTransactions,
  revenueData,
  paymentMethods,
} from "./adminBillingData.js";

import "./AdminBilling.css";

const STORAGE_KEY = "teamflow_admin_transactions";

function AdminBilling() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      return saved
        ? JSON.parse(saved)
        : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");

  const [selectedTransaction, setSelectedTransaction] =
    useState(null);

  const [openMenu, setOpenMenu] = useState(null);

  const [showSettings, setShowSettings] =
    useState(false);

  const [settings, setSettings] = useState({
    currency: "USD",
    tax: 18,
    autoInvoice: true,
    paymentReminder: true,
    failedPaymentRetry: true,
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const value = search.toLowerCase().trim();

      const matchesSearch =
        !value ||
        transaction.id.toLowerCase().includes(value) ||
        transaction.customer
          .toLowerCase()
          .includes(value) ||
        transaction.email
          .toLowerCase()
          .includes(value) ||
        transaction.plan.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === "All" ||
        transaction.status === statusFilter;

      const matchesPlan =
        planFilter === "All" ||
        transaction.plan === planFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPlan
      );
    });
  }, [
    transactions,
    search,
    statusFilter,
    planFilter,
  ]);

  const totalRevenue = transactions
    .filter((item) => item.status === "Paid")
    .reduce(
      (total, item) => total + Number(item.amount),
      0
    );

  const successfulPayments = transactions.filter(
    (item) => item.status === "Paid"
  ).length;

  const pendingPayments = transactions.filter(
    (item) => item.status === "Pending"
  ).length;

  const failedPayments = transactions.filter(
    (item) => item.status === "Failed"
  ).length;

  const handleRefund = (id) => {
    const transaction = transactions.find(
      (item) => item.id === id
    );

    if (!transaction) return;

    if (transaction.status !== "Paid") {
      alert("Only paid transactions can be refunded.");
      return;
    }

    const confirmRefund = window.confirm(
      `Refund $${transaction.amount} for ${transaction.customer}?`
    );

    if (!confirmRefund) return;

    setTransactions((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Refunded",
            }
          : item
      )
    );

    setSelectedTransaction((previous) =>
      previous?.id === id
        ? {
            ...previous,
            status: "Refunded",
          }
        : previous
    );

    setOpenMenu(null);
  };

  const resetTransactions = () => {
    const confirmed = window.confirm(
      "Reset all billing demo data?"
    );

    if (!confirmed) return;

    setTransactions(initialTransactions);
    setSearch("");
    setStatusFilter("All");
    setPlanFilter("All");
  };

  const exportCSV = () => {
    const headers = [
      "Transaction ID",
      "Customer",
      "Email",
      "Plan",
      "Amount",
      "Payment Method",
      "Status",
      "Date",
      "Time",
    ];

    const rows = filteredTransactions.map((item) => [
      item.id,
      item.customer,
      item.email,
      item.plan,
      item.amount,
      item.method,
      item.status,
      item.date,
      item.time,
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
    link.download = "teamflow-payments.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-billing-shell">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="admin-billing-main">
        {/* ================= TOPBAR ================= */}

        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        {/* ================= CONTENT ================= */}

        <div className="admin-billing-content">
          {/* PAGE HEADER */}

          <section className="admin-billing-heading">
            <div>

              <h1>Billing & Payments</h1>

              <p>
                Monitor revenue, transactions and payment
                activity across TeamFlow AI.
              </p>
            </div>

            <div className="admin-billing-header-actions">
              <button
                type="button"
                className="admin-billing-outline-button"
                onClick={() => setShowSettings(true)}
              >
                <Settings size={16} />
                Billing Settings
              </button>

              <button
                type="button"
                className="admin-billing-primary-button"
                onClick={exportCSV}
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </section>

          {/* ================= STATS ================= */}

          <section className="admin-billing-stats">
            <BillingStat
              icon={DollarSign}
              title="Total Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              subtitle="+32% from last month"
              type="purple"
            />

            <BillingStat
              icon={CheckCircle2}
              title="Successful Payments"
              value={successfulPayments}
              subtitle="Completed transactions"
              type="green"
            />

            <BillingStat
              icon={Clock3}
              title="Pending Payments"
              value={pendingPayments}
              subtitle="Awaiting confirmation"
              type="orange"
            />

            <BillingStat
              icon={CircleX}
              title="Failed Payments"
              value={failedPayments}
              subtitle="Require attention"
              type="red"
            />
          </section>

          {/* ================= CHART AREA ================= */}

          <section className="admin-billing-overview-grid">
            <RevenueChart />

            <PaymentBreakdown />
          </section>

          {/* ================= TRANSACTIONS ================= */}

          <section className="admin-billing-transactions">
            <div className="admin-billing-section-heading">
              <div>
                <h2>Recent Transactions</h2>

                <p>
                  Manage all platform payments and invoices.
                </p>
              </div>

              <button
                type="button"
                onClick={resetTransactions}
              >
                <RotateCcw size={14} />
                Reset Demo Data
              </button>
            </div>

            {/* FILTERS */}

            <div className="admin-billing-toolbar">
              <div className="admin-billing-search">
                <Search size={17} />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search transaction, customer or email..."
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

                <option value="Paid">Paid</option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Failed">
                  Failed
                </option>

                <option value="Refunded">
                  Refunded
                </option>
              </select>

              <select
                value={planFilter}
                onChange={(event) =>
                  setPlanFilter(event.target.value)
                }
              >
                <option value="All">All Plans</option>
                <option value="Pro">Pro</option>
                <option value="Business">
                  Business
                </option>
                <option value="Enterprise">
                  Enterprise
                </option>
              </select>
            </div>

            <div className="admin-billing-table-wrapper">
              <table className="admin-billing-table">
                <thead>
                  <tr>
                    <th>TRANSACTION</th>
                    <th>CUSTOMER</th>
                    <th>PLAN</th>
                    <th>AMOUNT</th>
                    <th>PAYMENT METHOD</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTransactions.map(
                    (transaction) => (
                      <tr key={transaction.id}>
                        <td>
                          <strong>
                            {transaction.id}
                          </strong>
                        </td>

                        <td>
                          <div className="admin-billing-customer">
                            <div>
                              {transaction.customer
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <span>
                              <strong>
                                {transaction.customer}
                              </strong>

                              <small>
                                {transaction.email}
                              </small>
                            </span>
                          </div>
                        </td>

                        <td>
                          <PlanBadge
                            plan={transaction.plan}
                          />
                        </td>

                        <td>
                          <strong>
                            $
                            {transaction.amount.toFixed(
                              2
                            )}
                          </strong>
                        </td>

                        <td>
                          <div className="admin-billing-method">
                            {getPaymentIcon(
                              transaction.methodType
                            )}

                            {transaction.method}
                          </div>
                        </td>

                        <td>
                          <span className="admin-billing-date">
                            {transaction.date}

                            <small>
                              {transaction.time}
                            </small>
                          </span>
                        </td>

                        <td>
                          <StatusBadge
                            status={
                              transaction.status
                            }
                          />
                        </td>

                        <td>
                          <div className="admin-billing-menu-wrapper">
                            <button
                              type="button"
                              className="admin-billing-more"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu ===
                                    transaction.id
                                    ? null
                                    : transaction.id
                                )
                              }
                            >
                              <MoreVertical
                                size={17}
                              />
                            </button>

                            {openMenu ===
                              transaction.id && (
                              <div className="admin-billing-menu">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedTransaction(
                                      transaction
                                    );

                                    setOpenMenu(null);
                                  }}
                                >
                                  <Eye size={14} />

                                  View Details
                                </button>

                                {transaction.status ===
                                  "Paid" && (
                                  <button
                                    type="button"
                                    className="refund"
                                    onClick={() =>
                                      handleRefund(
                                        transaction.id
                                      )
                                    }
                                  >
                                    <RotateCcw
                                      size={14}
                                    />

                                    Refund
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              {filteredTransactions.length === 0 && (
                <div className="admin-billing-empty">
                  <ReceiptText size={38} />

                  <h3>No transactions found</h3>

                  <p>
                    Try changing your search or
                    filters.
                  </p>
                </div>
              )}
            </div>

            <div className="admin-billing-table-footer">
              Showing {filteredTransactions.length} of{" "}
              {transactions.length} transactions
            </div>
          </section>
        </div>
      </main>

      {/* ================= TRANSACTION MODAL ================= */}

      {selectedTransaction && (
        <div className="admin-billing-modal-overlay">
          <div className="admin-billing-modal">
            <div className="admin-billing-modal-header">
              <div>
                <h2>Transaction Details</h2>

                <p>{selectedTransaction.id}</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedTransaction(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-billing-modal-body">
              <div className="admin-billing-payment-success">
                <div>
                  <CheckCircle2 size={24} />
                </div>

                <span>
                  <small>Payment Amount</small>

                  <strong>
                    $
                    {selectedTransaction.amount.toFixed(
                      2
                    )}
                  </strong>
                </span>

                <StatusBadge
                  status={selectedTransaction.status}
                />
              </div>

              <DetailRow
                label="Customer"
                value={selectedTransaction.customer}
              />

              <DetailRow
                label="Email"
                value={selectedTransaction.email}
              />

              <DetailRow
                label="Subscription Plan"
                value={selectedTransaction.plan}
              />

              <DetailRow
                label="Payment Method"
                value={selectedTransaction.method}
              />

              <DetailRow
                label="Transaction Date"
                value={`${selectedTransaction.date}, ${selectedTransaction.time}`}
              />

              <DetailRow
                label="Transaction ID"
                value={selectedTransaction.id}
              />
            </div>

            <div className="admin-billing-modal-footer">
              <button
                type="button"
                className="admin-billing-outline-button"
                onClick={() =>
                  setSelectedTransaction(null)
                }
              >
                Close
              </button>

              {selectedTransaction.status ===
                "Paid" && (
                <button
                  type="button"
                  className="admin-billing-refund-button"
                  onClick={() =>
                    handleRefund(
                      selectedTransaction.id
                    )
                  }
                >
                  <RotateCcw size={15} />
                  Refund Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= SETTINGS MODAL ================= */}

      {showSettings && (
        <div className="admin-billing-modal-overlay">
          <div className="admin-billing-modal">
            <div className="admin-billing-modal-header">
              <div>
                <h2>Billing Settings</h2>

                <p>
                  Configure TeamFlow AI billing
                  preferences.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowSettings(false)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-billing-settings-body">
              <label>
                Default Currency

                <select
                  value={settings.currency}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      currency:
                        event.target.value,
                    })
                  }
                >
                  <option>USD</option>
                  <option>INR</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </label>

              <label>
                Tax Rate (%)

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.tax}
                  onChange={(event) =>
                    setSettings({
                      ...settings,
                      tax: Number(
                        event.target.value
                      ),
                    })
                  }
                />
              </label>

              <SettingToggle
                title="Automatic Invoices"
                description="Generate invoices after successful payments."
                checked={settings.autoInvoice}
                onChange={() =>
                  setSettings({
                    ...settings,
                    autoInvoice:
                      !settings.autoInvoice,
                  })
                }
              />

              <SettingToggle
                title="Payment Reminders"
                description="Notify customers about upcoming payments."
                checked={
                  settings.paymentReminder
                }
                onChange={() =>
                  setSettings({
                    ...settings,
                    paymentReminder:
                      !settings.paymentReminder,
                  })
                }
              />

              <SettingToggle
                title="Failed Payment Retry"
                description="Automatically retry failed subscription payments."
                checked={
                  settings.failedPaymentRetry
                }
                onChange={() =>
                  setSettings({
                    ...settings,
                    failedPaymentRetry:
                      !settings.failedPaymentRetry,
                  })
                }
              />
            </div>

            <div className="admin-billing-modal-footer">
              <button
                type="button"
                className="admin-billing-outline-button"
                onClick={() =>
                  setShowSettings(false)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-billing-primary-button"
                onClick={() => {
                  localStorage.setItem(
                    "teamflow_billing_settings",
                    JSON.stringify(settings)
                  );

                  setShowSettings(false);

                  alert(
                    "Billing settings saved."
                  );
                }}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function BillingStat({
  icon: Icon,
  title,
  value,
  subtitle,
  type,
}) {
  return (
    <article className="admin-billing-stat">
      <div
        className={`admin-billing-stat-icon ${type}`}
      >
        <Icon size={21} />
      </div>

      <div>
        <span>{title}</span>

        <strong>{value}</strong>

        <small>{subtitle}</small>
      </div>

      <ArrowUpRight
        className="admin-billing-stat-arrow"
        size={18}
      />
    </article>
  );
}

function RevenueChart() {
  const maximum = Math.max(
    ...revenueData.map((item) => item.revenue)
  );

  const points = revenueData
    .map((item, index) => {
      const x =
        (index / (revenueData.length - 1)) * 100;

      const y =
        90 - (item.revenue / maximum) * 70;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <article className="admin-billing-chart-card">
      <div className="admin-billing-card-heading">
        <div>
          <h3>
            <TrendingUp size={18} />
            Revenue Overview
          </h3>

          <p>Monthly platform revenue</p>
        </div>

        <select defaultValue="6 Months">
          <option>6 Months</option>
          <option>12 Months</option>
        </select>
      </div>

      <div className="admin-billing-chart-total">
        <strong>$24,820</strong>

        <span>+32% this month</span>
      </div>

      <div className="admin-billing-chart">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="billingAreaGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#6840f5"
                stopOpacity="0.25"
              />

              <stop
                offset="100%"
                stopColor="#6840f5"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          <polygon
            points={`0,100 ${points} 100,100`}
            fill="url(#billingAreaGradient)"
          />

          <polyline
            points={points}
            fill="none"
            stroke="#6840f5"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="admin-billing-chart-labels">
        {revenueData.map((item) => (
          <span key={item.month}>
            {item.month}
          </span>
        ))}
      </div>
    </article>
  );
}

function PaymentBreakdown() {
  return (
    <article className="admin-billing-method-card">
      <div className="admin-billing-card-heading">
        <div>
          <h3>
            <WalletCards size={18} />
            Payment Methods
          </h3>

          <p>Transaction distribution</p>
        </div>
      </div>

      <div className="admin-billing-methods">
        {paymentMethods.map((method) => (
          <div
            className="admin-billing-method-row"
            key={method.name}
          >
            <div className="admin-billing-method-info">
              <span>{method.name}</span>

              <strong>{method.value}%</strong>
            </div>

            <div className="admin-billing-progress">
              <div
                style={{
                  width: `${method.value}%`,
                }}
              />
            </div>

            <small>
              {method.transactions} transactions
            </small>
          </div>
        ))}
      </div>
    </article>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`admin-billing-status ${status.toLowerCase()}`}
    >
      {status}
    </span>
  );
}

function PlanBadge({ plan }) {
  return (
    <span
      className={`admin-billing-plan ${plan.toLowerCase()}`}
    >
      {plan}
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="admin-billing-detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="admin-billing-setting-row">
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <button
        type="button"
        className={`admin-billing-toggle ${
          checked ? "active" : ""
        }`}
        onClick={onChange}
      >
        <span />
      </button>
    </div>
  );
}

function getPaymentIcon(type) {
  if (type === "bank") {
    return <Landmark size={15} />;
  }

  if (type === "upi") {
    return <BadgeDollarSign size={15} />;
  }

  return <CreditCard size={15} />;
}

export default AdminBilling;