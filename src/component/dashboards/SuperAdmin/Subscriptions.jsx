
import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  Ellipsis,
  Eye,
  Filter,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Subscriptions.css";

const INITIAL_SUBSCRIPTIONS = [
  {
    id: "SUB-1001",
    organization: "Acme Technologies",
    contact: "Aarav Sharma",
    email: "aarav@acme.demo",
    plan: "Enterprise",
    price: 24999,
    billing: "Yearly",
    status: "Active",
    started: "2026-01-15",
    renewal: "2027-01-15",
    payment: "Paid",
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
  },
  {
    id: "SUB-1006",
    organization: "Orbit Digital",
    contact: "Neha Verma",
    email: "neha@orbit.demo",
    plan: "Enterprise",
    price: 24999,
    billing: "Yearly",
    status: "Cancelled",
    started: "2025-10-10",
    renewal: "2026-10-10",
    payment: "Paid",
  },
  {
    id: "SUB-1007",
    organization: "CloudPeak",
    contact: "Vikram Rao",
    email: "vikram@cloudpeak.demo",
    plan: "Business",
    price: 7999,
    billing: "Monthly",
    status: "Active",
    started: "2026-07-18",
    renewal: "2026-11-18",
    payment: "Paid",
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
  },
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
  const [page, setPage] = useState(1);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [toast, setToast] = useState("");

  // Prevent background scroll when any modal is open
  useEffect(() => {
    const hasModal = Boolean(
      selectedSubscription || showPlans || editingPlanPrice || editingSubscription || showCreateModal
    );
    if (typeof document !== "undefined") {
      document.body.style.overflow = hasModal ? "hidden" : "";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [selectedSubscription, showPlans, editingPlanPrice, editingSubscription, showCreateModal]);

  const [menuId, setMenuId] = useState(null);
  const pageSize = 7;

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  const filteredSubscriptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return subscriptions.filter((subscription) => {
      const matchesSearch =
        !query ||
        [
          subscription.id,
          subscription.organization,
          subscription.contact,
          subscription.email,
          subscription.plan,
        ].some((value) => value.toLowerCase().includes(query));

      return (
        matchesSearch &&
        (statusFilter === "All statuses" ||
          subscription.status === statusFilter) &&
        (planFilter === "All plans" || subscription.plan === planFilter) &&
        (billingFilter === "All billing cycles" ||
          subscription.billing === billingFilter)
      );
    });
  }, [subscriptions, search, statusFilter, planFilter, billingFilter]);

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

    const monthlyRevenue = active.reduce((total, item) => {
      return total + (item.billing === "Yearly" ? item.price / 12 : item.price);
    }, 0);

    return {
      active: active.length,
      monthlyRevenue,
      pastDue: pastDue.length,
      trials: trials.length,
    };
  }, [subscriptions]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All statuses");
    setPlanFilter("All plans");
    setBillingFilter("All billing cycles");
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
      <header className="subscriptions-header">
        <div>
          <div className="subscriptions-eyebrow">
            <CreditCard size={14} />
            BILLING &amp; REVENUE
          </div>
          <h1>Subscriptions</h1>
          <p>
            Manage organization plans, subscription status, and recurring
            revenue across TeamFlow.
          </p>
        </div>

        <div className="subscriptions-header-actions">
          <button
            className="subscriptions-button subscriptions-button-light"
            onClick={() => setShowPlans(true)}
            type="button"
          >
            <Sparkles size={16} />
            View plans
          </button>
          <button
            className="subscriptions-button subscriptions-button-primary"
            onClick={() => setShowCreateModal(true)}
            type="button"
          >
            <Plus size={17} />
            Add subscription
          </button>
        </div>
      </header>

      <section className="subscriptions-metrics">
        <article className="subscriptions-metric-card">
          <span className="subscriptions-metric-icon purple">
            <CreditCard size={20} />
          </span>
          <div className="subscriptions-metric-label">Monthly recurring revenue</div>
          <strong>{formatCurrency(metrics.monthlyRevenue)}</strong>
          <small className="subscriptions-metric-positive">
            <ArrowUpRight size={14} /> Demo estimate
          </small>
        </article>

        <article className="subscriptions-metric-card">
          <span className="subscriptions-metric-icon green">
            <BadgeCheck size={20} />
          </span>
          <div className="subscriptions-metric-label">Active subscriptions</div>
          <strong>{metrics.active}</strong>
          <small className="subscriptions-metric-positive">
            <ArrowUpRight size={14} /> Currently active
          </small>
        </article>

        <article className="subscriptions-metric-card">
          <span className="subscriptions-metric-icon amber">
            <XCircle size={20} />
          </span>
          <div className="subscriptions-metric-label">Past due</div>
          <strong>{metrics.pastDue}</strong>
          <small className="subscriptions-metric-warning">
            <ArrowDownRight size={14} /> Payment needs attention
          </small>
        </article>

        <article className="subscriptions-metric-card">
          <span className="subscriptions-metric-icon blue">
            <CalendarDays size={20} />
          </span>
          <div className="subscriptions-metric-label">Free trials</div>
          <strong>{metrics.trials}</strong>
          <small>Organizations in trial</small>
        </article>
      </section>

      <section className="subscriptions-plan-section">
        <div className="subscriptions-section-heading">
          <div>
            <h2>Available plans</h2>
            <p>Pricing overview for organization subscriptions</p>
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

        <div className="subscriptions-plan-grid">
          {plans.map((plan, index) => (
            <article
              key={plan.name}
              className={`subscriptions-plan-card ${
                index === 1 ? "subscriptions-plan-featured" : ""
              }`}
            >
              {index === 1 && (
                <span className="subscriptions-plan-popular">POPULAR</span>
              )}
              <div className="subscriptions-plan-name">{plan.name}</div>
              <p>{plan.description}</p>
              <div className="subscriptions-plan-price-row">
                <div className="subscriptions-plan-price">
                  <strong>{formatCurrency(plan.price)}</strong>
                  <span>/ {index === 2 ? "year" : "month"}</span>
                </div>
                <button
                  type="button"
                  className="subscriptions-edit-price-btn"
                  title={`Edit price for ${plan.name}`}
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
                    <Check size={15} />
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
                    price: plan.price,
                    billing: index === 2 ? "Yearly" : "Monthly",
                  });
                }}
              >
                Assign plan
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="subscriptions-table-panel">
        <div className="subscriptions-table-heading">
          <div>
            <h2>Organization subscriptions</h2>
            <p>Review plans, payment status, and upcoming renewals.</p>
          </div>
          <button
            type="button"
            className="subscriptions-button subscriptions-button-light"
            onClick={exportCsv}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="subscriptions-filters">
          <label className="subscriptions-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search organization, contact, plan..."
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </label>

          <label className="subscriptions-filter-label">
            <Filter size={14} />
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
            >
              <option>All statuses</option>
              <option>Active</option>
              <option>Trial</option>
              <option>Past Due</option>
              <option>Cancelled</option>
            </select>
          </label>

          <select
            className="subscriptions-filter-select"
            value={planFilter}
            onChange={(event) => {
              setPlanFilter(event.target.value);
              setPage(1);
            }}
          >
            <option>All plans</option>
            <option>Starter</option>
            <option>Business</option>
            <option>Enterprise</option>
          </select>

          <select
            className="subscriptions-filter-select"
            value={billingFilter}
            onChange={(event) => {
              setBillingFilter(event.target.value);
              setPage(1);
            }}
          >
            <option>All billing cycles</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>

          <button
            type="button"
            className="subscriptions-reset-button"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>

        <div className="subscriptions-table-wrap">
          <table className="subscriptions-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Plan</th>
                <th>Price</th>
                <th>Status</th>
                <th>Renewal date</th>
                <th>Payment</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visibleSubscriptions.map((subscription) => (
                <tr key={subscription.id}>
                  <td>
                    <div className="subscriptions-organization-cell">
                      <span>{getInitials(subscription.organization)}</span>
                      <div>
                        <strong>{subscription.organization}</strong>
                        <small>{subscription.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`subscriptions-plan-badge subscriptions-plan-${subscription.plan.toLowerCase()}`}
                    >
                      {subscription.plan}
                    </span>
                    <small className="subscriptions-billing-cycle">
                      {subscription.billing}
                    </small>
                  </td>
                  <td>
                    <strong className="subscriptions-price">
                      {formatCurrency(subscription.price)}
                    </strong>
                    <small className="subscriptions-billing-cycle">
                      / {subscription.billing === "Yearly" ? "year" : "month"}
                    </small>
                  </td>
                  <td>
                    <SubscriptionStatus status={subscription.status} />
                  </td>
                  <td>
                    <div className="subscriptions-renewal">
                      <strong>{formatDate(subscription.renewal)}</strong>
                      <small>{subscription.status === "Cancelled" ? "Ended" : "Next renewal"}</small>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`subscriptions-payment subscriptions-payment-${subscription.payment.toLowerCase()}`}
                    >
                      {subscription.payment === "Paid" ? (
                        <Check size={13} />
                      ) : subscription.payment === "Failed" ? (
                        <XCircle size={13} />
                      ) : (
                        <CalendarDays size={13} />
                      )}
                      {subscription.payment}
                    </span>
                  </td>
                  <td>
                    <div className="subscriptions-row-actions">
                      <button
                        type="button"
                        className="subscriptions-icon-button"
                        title="View subscription"
                        onClick={() => setSelectedSubscription(subscription)}
                      >
                        <Eye size={16} />
                      </button>
                      <div className="subscriptions-menu-wrap">
                        <button
                          type="button"
                          className="subscriptions-icon-button"
                          title="More actions"
                          onClick={() =>
                            setMenuId((current) =>
                              current === subscription.id ? null : subscription.id
                            )
                          }
                        >
                          <Ellipsis size={17} />
                        </button>
                        {menuId === subscription.id && (
                          <div className="subscriptions-action-menu">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingSubscription(subscription);
                                setMenuId(null);
                              }}
                            >
                              <Pencil size={14} /> Edit subscription
                            </button>
                            {subscription.status !== "Active" && (
                              <button
                                type="button"
                                onClick={() => changeStatus(subscription, "Active")}
                              >
                                <BadgeCheck size={14} /> Activate
                              </button>
                            )}
                            {subscription.status === "Active" && (
                              <button
                                type="button"
                                onClick={() => changeStatus(subscription, "Past Due")}
                              >
                                <CreditCard size={14} /> Mark past due
                              </button>
                            )}
                            {subscription.status !== "Cancelled" && (
                              <button
                                type="button"
                                className="subscriptions-menu-danger"
                                onClick={() => {
                                  const confirmed = window.confirm(
                                    `Cancel the demo subscription for ${subscription.organization}?`
                                  );
                                  if (confirmed) {
                                    changeStatus(subscription, "Cancelled");
                                  } else {
                                    setMenuId(null);
                                  }
                                }}
                              >
                                <XCircle size={14} /> Cancel subscription
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleSubscriptions.length === 0 && (
                <tr>
                  <td colSpan="7">
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

        <footer className="subscriptions-pagination">
          <span>
            Showing{" "}
            {filteredSubscriptions.length === 0
              ? 0
              : (currentPage - 1) * pageSize + 1}
            –{Math.min(currentPage * pageSize, filteredSubscriptions.length)} of{" "}
            {filteredSubscriptions.length} subscriptions
          </span>
          <div>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => value - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((value) => value + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </footer>
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
                    <span className="sub-view-avatar">
                      {getInitials(selectedSubscription.organization)}
                    </span>
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
                      <strong className="sub-view-plan-pill">{selectedSubscription.plan}</strong>
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
                      className={`subscriptions-status subscriptions-status-${selectedSubscription.status.toLowerCase()}`}
                    >
                      <span />
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
                      className={`subscriptions-payment subscriptions-payment-${selectedSubscription.payment.toLowerCase()}`}
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
            <section className="subscriptions-modal subscriptions-plans-modal" role="dialog" aria-modal="true">
              <header>
                <div>
                  <span className="subscriptions-modal-icon">
                    <Sparkles size={20} />
                  </span>
                  <div>
                    <h2>Plan Catalogue</h2>
                    <p>Current plan definitions & pricing</p>
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
              <div className="subscriptions-modal-body">
                {plans.map((plan) => (
                  <div className="subscriptions-catalogue-row" key={plan.name}>
                    <div>
                      <strong>{plan.name}</strong>
                      <span>{plan.description}</span>
                    </div>
                    <div className="subscriptions-catalogue-price-action">
                      <strong>{formatCurrency(plan.price)}</strong>
                      <button
                        type="button"
                        className="subscriptions-edit-price-btn"
                        onClick={() =>
                          setEditingPlanPrice({ name: plan.name, price: plan.price })
                        }
                      >
                        <Pencil size={12} /> Edit Price
                      </button>
                    </div>
                  </div>
                ))}
                <p className="subscriptions-catalogue-note">
                  Super Admin can edit pricing for any tier. Changes update the catalog and new subscriptions.
                </p>
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
            <section className="subscriptions-modal" role="dialog" aria-modal="true" style={{ maxWidth: 440 }}>
              <header>
                <div>
                  <span className="subscriptions-modal-icon">
                    <Pencil size={18} />
                  </span>
                  <div>
                    <h2>Edit Plan Price</h2>
                    <p>Update pricing for {editingPlanPrice.name} Plan</p>
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
                <div className="subscriptions-modal-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 550 }}>
                    Plan Name
                    <input
                      type="text"
                      value={editingPlanPrice.name}
                      disabled
                      style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", padding: "8px 12px", borderRadius: 8 }}
                    />
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 550 }}>
                    Price (₹ INR)
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={editingPlanPrice.price}
                      onChange={(e) =>
                        setEditingPlanPrice({ ...editingPlanPrice, price: e.target.value })
                      }
                      placeholder="Enter amount in ₹"
                      required
                      autoFocus
                      style={{ border: "1px solid #3b66ff", padding: "8px 12px", borderRadius: 8, fontSize: 15, fontWeight: 700 }}
                    />
                  </label>
                  <p style={{ margin: 0, fontSize: 11.5, color: "#64748b" }}>
                    This updates the official subscription catalogue and is used for subsequent tenant billing cycles.
                  </p>
                </div>

                <footer>
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
                    <Check size={15} /> Save Price
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

    onSave({
      organization: organization.trim(),
      contact: contact.trim(),
      email: email.trim(),
      plan,
      price: selectedPlan.price,
      billing,
      status,
      started,
      renewal,
      payment,
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
              {initial?.id ? <Pencil size={19} /> : <Plus size={20} />}
            </span>
            <div>
              <h2>{initial?.id ? "Edit subscription" : "Add subscription"}</h2>
              <p>
                {initial?.id
                  ? `Update ${initial.organization}`
                  : "Create a demo organization subscription"}
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
            <label>
              Organization name *
              <input
                value={organization}
                onChange={(event) => setOrganization(event.target.value)}
                placeholder="e.g. Acme Technologies"
                required
              />
            </label>
            <label>
              Contact person *
              <input
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                placeholder="Full name"
                required
              />
            </label>
            <label className="subscriptions-form-full">
              Contact email *
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@organization.com"
                required
              />
            </label>
            <label>
              Plan
              <select value={plan} onChange={(event) => setPlan(event.target.value)}>
                {availablePlans.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} — {formatCurrency(item.price)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Billing cycle
              <select value={billing} onChange={(event) => setBilling(event.target.value)}>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </label>
            <label>
              Subscription status
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option>Active</option>
                <option>Trial</option>
                <option>Past Due</option>
                <option>Cancelled</option>
              </select>
            </label>
            <label>
              Payment status
              <select value={payment} onChange={(event) => setPayment(event.target.value)}>
                <option>Paid</option>
                <option>Failed</option>
                <option>Trial</option>
              </select>
            </label>
            <label>
              Start date
              <input
                type="date"
                value={started}
                onChange={(event) => setStarted(event.target.value)}
                required
              />
            </label>
            <label>
              Renewal date
              <input
                type="date"
                value={renewal}
                onChange={(event) => setRenewal(event.target.value)}
                required
              />
            </label>
          </div>

          <div className="subscriptions-form-price">
            <span>Plan price</span>
            <strong>{formatCurrency(selectedPlan.price)}</strong>
            <small>per {billing === "Yearly" ? "year" : "month"}</small>
          </div>

          {error && <p className="subscriptions-form-error">{error}</p>}

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
              <Check size={15} />
              {initial?.id ? "Save changes" : "Create subscription"}
            </button>
          </footer>
        </form>
      </section>
    </div>,
    document.body
  );
}

export default Subscriptions;
