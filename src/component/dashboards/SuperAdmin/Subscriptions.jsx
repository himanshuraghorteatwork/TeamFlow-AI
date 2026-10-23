
import { useMemo, useState } from "react";
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

const PLANS = [
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
          {PLANS.map((plan, index) => (
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
              <div className="subscriptions-plan-price">
                <strong>{formatCurrency(plan.price)}</strong>
                <span>/ {index === 2 ? "year" : "month"}</span>
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

      {selectedSubscription && (
        <div
          className="subscriptions-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedSubscription(null);
            }
          }}
        >
          <section className="subscriptions-modal" role="dialog" aria-modal="true">
            <header>
              <div>
                <span className="subscriptions-modal-icon">
                  <CreditCard size={20} />
                </span>
                <div>
                  <h2>Subscription details</h2>
                  <p>{selectedSubscription.id}</p>
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
            <div className="subscriptions-modal-body">
              <div className="subscriptions-detail-hero">
                <span>{getInitials(selectedSubscription.organization)}</span>
                <div>
                  <h3>{selectedSubscription.organization}</h3>
                  <p>{selectedSubscription.contact} · {selectedSubscription.email}</p>
                </div>
              </div>
              <div className="subscriptions-detail-plan">
                <div>
                  <small>Current plan</small>
                  <strong>{selectedSubscription.plan}</strong>
                </div>
                <div>
                  <small>Subscription price</small>
                  <strong>{formatCurrency(selectedSubscription.price)}</strong>
                  <small>per {selectedSubscription.billing.toLowerCase().replace("ly", "")}</small>
                </div>
              </div>
              {[
                ["Subscription status", selectedSubscription.status],
                ["Billing cycle", selectedSubscription.billing],
                ["Payment status", selectedSubscription.payment],
                ["Start date", formatDate(selectedSubscription.started)],
                ["Renewal date", formatDate(selectedSubscription.renewal)],
              ].map(([label, value]) => (
                <div className="subscriptions-detail-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <footer>
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
                <Pencil size={15} /> Edit subscription
              </button>
            </footer>
          </section>
        </div>
      )}

      {(showCreateModal || editingSubscription) && (
        <SubscriptionForm
          initial={editingSubscription}
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

      {showPlans && (
        <div
          className="subscriptions-modal-backdrop"
          onMouseDown={(event) => {
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
                  <h2>Plan catalogue</h2>
                  <p>Current demo plan definitions</p>
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
              {PLANS.map((plan) => (
                <div className="subscriptions-catalogue-row" key={plan.name}>
                  <div>
                    <strong>{plan.name}</strong>
                    <span>{plan.description}</span>
                  </div>
                  <strong>{formatCurrency(plan.price)}</strong>
                </div>
              ))}
              <p className="subscriptions-catalogue-note">
                These are demonstration prices. Plan changes here do not alter
                real billing settings.
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
        </div>
      )}

      {toast && <div className="subscriptions-toast">{toast}</div>}
    </div>
  );
}

function SubscriptionForm({ initial, onClose, onSave }) {
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

  const selectedPlan = PLANS.find((item) => item.name === plan);

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

  return (
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
                {PLANS.map((item) => (
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
    </div>
  );
}

export default Subscriptions;
