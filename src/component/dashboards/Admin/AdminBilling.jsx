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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
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
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modals
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    customer: "",
    email: "",
    plan: "Pro",
    amount: 49,
    method: "Visa •••• 4242",
    methodType: "card",
    status: "Paid",
  });

  const [openMenu, setOpenMenu] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    currency: "USD",
    tax: 18,
    autoInvoice: true,
    paymentReminder: true,
    failedPaymentRetry: true,
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

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
      return <ArrowUpDown size={13} className="sort-icon muted" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp size={13} className="sort-icon active" />
    ) : (
      <ArrowDown size={13} className="sort-icon active" />
    );
  };

  const filteredTransactions = useMemo(() => {
    return [...transactions]
      .filter((transaction) => {
        const value = search.toLowerCase().trim();
        const matchesSearch =
          !value ||
          transaction.id.toLowerCase().includes(value) ||
          transaction.customer.toLowerCase().includes(value) ||
          transaction.email.toLowerCase().includes(value) ||
          transaction.plan.toLowerCase().includes(value);

        const matchesStatus =
          statusFilter === "All" || transaction.status === statusFilter;

        const matchesPlan =
          planFilter === "All" || transaction.plan === planFilter;

        return matchesSearch && matchesStatus && matchesPlan;
      })
      .sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        if (sortKey === "amount") {
          return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
        }

        if (sortKey === "date") {
          const timeA = new Date(`${a.date} ${a.time || ""}`).getTime() || 0;
          const timeB = new Date(`${b.date} ${b.time || ""}`).getTime() || 0;
          return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
        }

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [transactions, search, statusFilter, planFilter, sortKey, sortOrder]);

  const totalRevenue = transactions
    .filter((item) => item.status === "Paid")
    .reduce((total, item) => total + Number(item.amount), 0);

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
    const transaction = transactions.find((item) => item.id === id);
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

  const handleDeleteTransaction = (id) => {
    if (window.confirm(`Delete transaction record ${id}?`)) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      if (selectedTransaction?.id === id) setSelectedTransaction(null);
      if (editingTransaction?.id === id) setEditingTransaction(null);
    }
  };

  const handleCreateTransaction = (e) => {
    e.preventDefault();
    if (!newTransaction.customer || !newTransaction.email) {
      alert("Please fill customer name and email.");
      return;
    }
    const created = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      customer: newTransaction.customer,
      email: newTransaction.email,
      plan: newTransaction.plan,
      amount: Number(newTransaction.amount),
      method: newTransaction.method,
      methodType: newTransaction.methodType,
      status: newTransaction.status,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setTransactions([created, ...transactions]);
    setShowCreateModal(false);
    setNewTransaction({
      customer: "",
      email: "",
      plan: "Pro",
      amount: 49,
      method: "Visa •••• 4242",
      methodType: "card",
      status: "Paid",
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTransaction) return;

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === editingTransaction.id ? editingTransaction : t
      )
    );

    if (selectedTransaction?.id === editingTransaction.id) {
      setSelectedTransaction(editingTransaction);
    }

    setEditingTransaction(null);
  };

  const resetTransactions = () => {
    const confirmed = window.confirm("Reset all billing demo data?");
    if (!confirmed) return;

    setTransactions(initialTransactions);
    setSearch("");
    setStatusFilter("All");
    setPlanFilter("All");
    setSortKey("date");
    setSortOrder("desc");
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
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `teamflow-billing-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-billing-shell">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="admin-billing-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <div className="admin-billing-content">
          {/* PAGE HEADER */}
          <section className="admin-billing-heading">
            <div>
              <span className="admin-billing-breadcrumb">Finance & Ledger</span>
              <h1>Billing & Payments</h1>
              <p>
                Monitor real-time revenue, transactions, automated invoicing,
                and payment activity.
              </p>
            </div>

            <div className="admin-billing-header-actions">
              <button
                type="button"
                className="admin-billing-create-button"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={16} />
                Record Transaction
              </button>

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
                Export CSV
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
                <h2>Recent Transactions ({filteredTransactions.length})</h2>
                <p>Manage all customer payments, invoices, refunds, and statements.</p>
              </div>

              <button type="button" onClick={resetTransactions}>
                <RotateCcw size={14} />
                Reset Demo Data
              </button>
            </div>

            {/* SAAS FILTERS & SORT */}
            <div className="admin-billing-toolbar">
              <div className="admin-billing-search">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search transaction ID, customer, email, or plan..."
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by status"
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>

              <select
                value={planFilter}
                onChange={(event) => setPlanFilter(event.target.value)}
                aria-label="Filter by plan"
              >
                <option value="All">All Plans</option>
                <option value="Pro">Pro</option>
                <option value="Business">Business</option>
                <option value="Enterprise">Enterprise</option>
              </select>

              <select
                value={`${sortKey}-${sortOrder}`}
                onChange={(event) => {
                  const [k, ord] = event.target.value.split("-");
                  setSortKey(k);
                  setSortOrder(ord);
                }}
                aria-label="Sort transactions"
              >
                <option value="date-desc">Sort: Newest First</option>
                <option value="date-asc">Sort: Oldest First</option>
                <option value="amount-desc">Sort: Amount (High to Low)</option>
                <option value="amount-asc">Sort: Amount (Low to High)</option>
                <option value="customer-asc">Sort: Customer (A to Z)</option>
                <option value="customer-desc">Sort: Customer (Z to A)</option>
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
                  <X size={13} />
                  Clear Filters
                </button>
              )}
            </div>

            {/* TABLE */}
            <div className="admin-billing-table-wrapper">
              <table className="admin-billing-table">
                <thead>
                  <tr>
                    <th style={{ width: 48, textAlign: "center" }}>#</th>
                    <th className="sortable-th" onClick={() => handleSort("id")}>
                      <div className="th-content">
                        <span>TRANSACTION ID</span>
                        {renderSortIcon("id")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("customer")}>
                      <div className="th-content">
                        <span>CUSTOMER</span>
                        {renderSortIcon("customer")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("plan")}>
                      <div className="th-content">
                        <span>PLAN</span>
                        {renderSortIcon("plan")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("amount")}>
                      <div className="th-content">
                        <span>AMOUNT</span>
                        {renderSortIcon("amount")}
                      </div>
                    </th>
                    <th>PAYMENT METHOD</th>
                    <th className="sortable-th" onClick={() => handleSort("date")}>
                      <div className="th-content">
                        <span>DATE & TIME</span>
                        {renderSortIcon("date")}
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
                  {filteredTransactions.map((transaction, idx) => (
                    <tr key={transaction.id}>
                      <td style={{ textAlign: "center" }}>
                        <span className="admin-row-num">{idx + 1}</span>
                      </td>

                      <td>
                        <strong className="txn-id-badge">
                          {transaction.id}
                        </strong>
                      </td>

                      <td>
                        <div className="admin-billing-customer">
                          <div>
                            {transaction.customer.charAt(0).toUpperCase()}
                          </div>

                          <span>
                            <strong>{transaction.customer}</strong>
                            <small>{transaction.email}</small>
                          </span>
                        </div>
                      </td>

                      <td>
                        <PlanBadge plan={transaction.plan} />
                      </td>

                      <td>
                        <strong className="amount-cell">
                          ${Number(transaction.amount).toFixed(2)}
                        </strong>
                      </td>

                      <td>
                        <div className="admin-billing-method">
                          {getPaymentIcon(transaction.methodType)}
                          <span>{transaction.method}</span>
                        </div>
                      </td>

                      <td>
                        <span className="admin-billing-date">
                          {transaction.date}
                          <small>{transaction.time}</small>
                        </span>
                      </td>

                      <td>
                        <StatusBadge status={transaction.status} />
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="action-btn"
                            title="View Transaction Details"
                            onClick={() => setSelectedTransaction(transaction)}
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            className="action-btn"
                            title="Edit Transaction"
                            onClick={() => setEditingTransaction({ ...transaction })}
                          >
                            <Pencil size={15} />
                          </button>

                          {transaction.status === "Paid" && (
                            <button
                              type="button"
                              className="action-btn"
                              title="Refund Payment"
                              onClick={() => handleRefund(transaction.id)}
                            >
                              <RotateCcw size={15} />
                            </button>
                          )}

                          <button
                            type="button"
                            className="action-btn delete"
                            title="Delete Record"
                            onClick={() => handleDeleteTransaction(transaction.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTransactions.length === 0 && (
                <div className="admin-billing-empty">
                  <ReceiptText size={38} />
                  <h3>No transactions found</h3>
                  <p>Try changing your search or filter parameters.</p>
                </div>
              )}
            </div>

            <div className="admin-billing-table-footer">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>
          </section>
        </div>
      </main>

      {/* ================= TRANSACTION VIEW MODAL ================= */}
      {selectedTransaction && (
        <div className="admin-billing-modal-overlay" onClick={() => setSelectedTransaction(null)}>
          <div className="admin-billing-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-billing-modal-header">
              <div>
                <h2>Transaction Details</h2>
                <p>{selectedTransaction.id}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
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
                    ${Number(selectedTransaction.amount).toFixed(2)}
                  </strong>
                </span>

                <StatusBadge status={selectedTransaction.status} />
              </div>

              <DetailRow label="Customer" value={selectedTransaction.customer} />
              <DetailRow label="Email" value={selectedTransaction.email} />
              <DetailRow label="Subscription Plan" value={selectedTransaction.plan} />
              <DetailRow label="Payment Method" value={selectedTransaction.method} />
              <DetailRow
                label="Transaction Date"
                value={`${selectedTransaction.date}, ${selectedTransaction.time}`}
              />
              <DetailRow label="Transaction ID" value={selectedTransaction.id} />
            </div>

            <div className="admin-billing-modal-footer">
              <button
                type="button"
                className="admin-billing-outline-button"
                onClick={() => setSelectedTransaction(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="admin-billing-edit-btn"
                onClick={() => {
                  setEditingTransaction({ ...selectedTransaction });
                  setSelectedTransaction(null);
                }}
              >
                <Pencil size={14} />
                Edit Record
              </button>

              {selectedTransaction.status === "Paid" && (
                <button
                  type="button"
                  className="admin-billing-refund-button"
                  onClick={() => handleRefund(selectedTransaction.id)}
                >
                  <RotateCcw size={15} />
                  Refund Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT TRANSACTION MODAL ================= */}
      {editingTransaction && (
        <div className="admin-billing-modal-overlay" onClick={() => setEditingTransaction(null)}>
          <div className="admin-billing-modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveEdit}>
              <div className="admin-billing-modal-header">
                <div>
                  <h2>Edit Transaction</h2>
                  <p>{editingTransaction.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingTransaction(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="admin-billing-settings-body">
                <label>
                  Customer Name
                  <input
                    type="text"
                    required
                    value={editingTransaction.customer}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        customer: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Customer Email
                  <input
                    type="email"
                    required
                    value={editingTransaction.email}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        email: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Subscription Plan
                  <select
                    value={editingTransaction.plan}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        plan: e.target.value,
                      })
                    }
                  >
                    <option value="Pro">Pro ($49/mo)</option>
                    <option value="Business">Business ($99/mo)</option>
                    <option value="Enterprise">Enterprise ($249/mo)</option>
                  </select>
                </label>

                <label>
                  Amount ($)
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingTransaction.amount}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        amount: Number(e.target.value),
                      })
                    }
                  />
                </label>

                <label>
                  Status
                  <select
                    value={editingTransaction.status}
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </label>
              </div>

              <div className="admin-billing-modal-footer">
                <button
                  type="button"
                  className="admin-billing-outline-button"
                  onClick={() => setEditingTransaction(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-billing-primary-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CREATE TRANSACTION MODAL ================= */}
      {showCreateModal && (
        <div className="admin-billing-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="admin-billing-modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateTransaction}>
              <div className="admin-billing-modal-header">
                <div>
                  <h2>Record New Transaction</h2>
                  <p>Log a manual invoice payment, offline charge, or contract billing.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="admin-billing-settings-body">
                <label>
                  Customer Name
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Innovations Corp"
                    value={newTransaction.customer}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        customer: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Customer Email
                  <input
                    type="email"
                    required
                    placeholder="billing@acme.com"
                    value={newTransaction.email}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        email: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Subscription Plan
                  <select
                    value={newTransaction.plan}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        plan: e.target.value,
                      })
                    }
                  >
                    <option value="Pro">Pro ($49/mo)</option>
                    <option value="Business">Business ($99/mo)</option>
                    <option value="Enterprise">Enterprise ($249/mo)</option>
                  </select>
                </label>

                <label>
                  Amount ($ USD)
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newTransaction.amount}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        amount: Number(e.target.value),
                      })
                    }
                  />
                </label>

                <label>
                  Payment Method
                  <select
                    value={newTransaction.methodType}
                    onChange={(e) => {
                      const mType = e.target.value;
                      let mName = "Visa •••• 4242";
                      if (mType === "bank") mName = "Bank Wire Transfer";
                      if (mType === "upi") mName = "Corporate UPI";
                      setNewTransaction({
                        ...newTransaction,
                        methodType: mType,
                        method: mName,
                      });
                    }}
                  >
                    <option value="card">Credit Card (Visa / Mastercard)</option>
                    <option value="bank">Bank Transfer (ACH / Wire)</option>
                    <option value="upi">UPI / Instant Transfer</option>
                  </select>
                </label>

                <label>
                  Initial Payment Status
                  <select
                    value={newTransaction.status}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </label>
              </div>

              <div className="admin-billing-modal-footer">
                <button
                  type="button"
                  className="admin-billing-outline-button"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-billing-primary-button">
                  Record Charge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= SETTINGS MODAL ================= */}
      {showSettings && (
        <div className="admin-billing-modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="admin-billing-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-billing-modal-header">
              <div>
                <h2>Billing Settings</h2>
                <p>Configure TeamFlow AI billing preferences.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowSettings(false)}
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
                      currency: event.target.value,
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
                      tax: Number(event.target.value),
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
                    autoInvoice: !settings.autoInvoice,
                  })
                }
              />

              <SettingToggle
                title="Payment Reminders"
                description="Notify customers about upcoming payments."
                checked={settings.paymentReminder}
                onChange={() =>
                  setSettings({
                    ...settings,
                    paymentReminder: !settings.paymentReminder,
                  })
                }
              />

              <SettingToggle
                title="Failed Payment Retry"
                description="Automatically retry failed subscription payments."
                checked={settings.failedPaymentRetry}
                onChange={() =>
                  setSettings({
                    ...settings,
                    failedPaymentRetry: !settings.failedPaymentRetry,
                  })
                }
              />
            </div>

            <div className="admin-billing-modal-footer">
              <button
                type="button"
                className="admin-billing-outline-button"
                onClick={() => setShowSettings(false)}
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
                  alert("Billing settings saved.");
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
      <div className={`admin-billing-stat-icon ${type}`}>
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
  const maximum = Math.max(...revenueData.map((item) => item.revenue));

  const points = revenueData
    .map((item, index) => {
      const x = (index / (revenueData.length - 1)) * 100;
      const y = 90 - (item.revenue / maximum) * 70;
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
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient
              id="billingAreaGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#6840f5" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6840f5" stopOpacity="0" />
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
          <span key={item.month}>{item.month}</span>
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
          <div className="admin-billing-method-row" key={method.name}>
            <div className="admin-billing-method-info">
              <span>{method.name}</span>
              <strong>{method.value}%</strong>
            </div>

            <div className="admin-billing-progress">
              <div style={{ width: `${method.value}%` }} />
            </div>

            <small>{method.transactions} transactions</small>
          </div>
        ))}
      </div>
    </article>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`admin-billing-status ${status.toLowerCase()}`}>
      {status}
    </span>
  );
}

function PlanBadge({ plan }) {
  return (
    <span className={`admin-billing-plan ${plan.toLowerCase()}`}>
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
        className={`admin-billing-toggle ${checked ? "active" : ""}`}
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
