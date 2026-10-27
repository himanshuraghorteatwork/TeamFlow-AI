// src/component/AdminSubscriptions/AdminSubscriptions.jsx

import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Plus,
  ChevronDown,
  BadgeDollarSign,
  Users,
  DollarSign,
  TrendingUp,
  CircleX,
  CheckCircle2,
  MoreVertical,
  Eye,
  Pencil,
  Pause,
  Play,
  X,
  Check,
  Download,
  RotateCcw,
  Crown,
  CreditCard,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  List,
  Grid2X2,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";

import {
  initialPlans,
  initialSubscriptions,
} from "./adminSubscriptionsData.js";

import "./AdminSubscriptions.css";

const PLAN_KEY = "teamflow_admin_plans";
const SUBSCRIPTION_KEY = "teamflow_admin_subscriptions";

function AdminSubscriptions() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [plans, setPlans] = useState(() => {
    try {
      const saved = localStorage.getItem(PLAN_KEY);
      return saved ? JSON.parse(saved) : initialPlans;
    } catch {
      return initialPlans;
    }
  });

  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const saved = localStorage.getItem(SUBSCRIPTION_KEY);
      return saved ? JSON.parse(saved) : initialSubscriptions;
    } catch {
      return initialSubscriptions;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [sortKey, setSortKey] = useState("workspace");
  const [sortOrder, setSortOrder] = useState("asc");
  const [plansViewMode, setPlansViewMode] = useState("table"); // 'table' | 'cards'

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
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

  const [activeTab, setActiveTab] = useState("subscriptions");

  const [selectedSubscription, setSelectedSubscription] =
    useState(null);

  const [editingPlan, setEditingPlan] = useState(null);

  const [menuId, setMenuId] = useState(null);

  useEffect(() => {
    localStorage.setItem(PLAN_KEY, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(
      SUBSCRIPTION_KEY,
      JSON.stringify(subscriptions)
    );
  }, [subscriptions]);

  const filteredSubscriptions = useMemo(() => {
    const list = subscriptions.filter((subscription) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        subscription.workspace.toLowerCase().includes(query) ||
        subscription.owner.toLowerCase().includes(query) ||
        subscription.email.toLowerCase().includes(query) ||
        subscription.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        subscription.status === statusFilter;

      const matchesPlan =
        planFilter === "All" ||
        subscription.plan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
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
  }, [subscriptions, search, statusFilter, planFilter, sortKey, sortOrder]);

  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "Active"
  ).length;

  const cancelledSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "Cancelled"
  ).length;

  const monthlyRevenue = subscriptions
    .filter((subscription) => subscription.status === "Active")
    .reduce(
      (total, subscription) => total + subscription.price,
      0
    );

  const handleSubscriptionStatus = (id) => {
    setSubscriptions((previous) =>
      previous.map((subscription) => {
        if (subscription.id !== id) {
          return subscription;
        }

        if (subscription.status === "Cancelled") {
          return {
            ...subscription,
            status: "Active",
          };
        }

        return {
          ...subscription,
          status: "Cancelled",
          nextBilling: "—",
        };
      })
    );

    setMenuId(null);
  };

  const savePlan = () => {
    if (!editingPlan) return;

    setPlans((previous) => {
      const exists = previous.some((p) => p.id === editingPlan.id);
      if (exists) {
        return previous.map((plan) =>
          plan.id === editingPlan.id ? editingPlan : plan
        );
      }
      return [...previous, editingPlan];
    });

    setEditingPlan(null);
  };

  const resetDemoData = () => {
    const confirmed = window.confirm(
      "Reset subscription demo data?"
    );

    if (!confirmed) return;

    setPlans(initialPlans);
    setSubscriptions(initialSubscriptions);
    setSearch("");
    setStatusFilter("All");
    setPlanFilter("All");
  };

  const exportSubscriptions = () => {
    const headers = [
      "Subscription ID",
      "Workspace",
      "Owner",
      "Email",
      "Plan",
      "Price",
      "Billing Cycle",
      "Status",
      "Start Date",
      "Next Billing",
    ];

    const rows = filteredSubscriptions.map((item) => [
      item.id,
      item.workspace,
      item.owner,
      item.email,
      item.plan,
      item.price,
      item.billingCycle,
      item.status,
      item.startDate,
      item.nextBilling,
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
    link.download = "teamflow-subscriptions.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-subscriptions-shell">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="admin-subscriptions-main">
        {/* TOP NAV */}

        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <div className="admin-subscriptions-content">
          {/* HEADER */}

          <section className="admin-subscriptions-heading">
            <div>

              <h1>Subscription Management</h1>

              <p>
                Manage plans, subscriptions and recurring
                revenue across TeamFlow AI.
              </p>
            </div>

            <div className="admin-subscriptions-heading-actions">
              <button
                className="admin-subscriptions-secondary-btn"
                onClick={exportSubscriptions}
              >
                <Download size={16} />
                Export
              </button>

              <button
                className="admin-subscriptions-primary-btn"
                onClick={() => setActiveTab("plans")}
              >
                <Plus size={16} />
                Manage Plans
              </button>
            </div>
          </section>

          {/* STATS */}

          <section className="admin-subscriptions-stats">
            <StatCard
              icon={Users}
              title="Total Subscriptions"
              value={subscriptions.length}
              description="Across TeamFlow AI"
              color="purple"
            />

            <StatCard
              icon={CheckCircle2}
              title="Active Subscriptions"
              value={activeSubscriptions.length}
              description="Currently active"
              color="green"
            />

            <StatCard
              icon={DollarSign}
              title="Monthly Revenue"
              value={`$${monthlyRevenue.toLocaleString()}`}
              description="+18% from last month"
              color="blue"
            />

            <StatCard
              icon={CircleX}
              title="Cancelled"
              value={cancelledSubscriptions.length}
              description="Cancelled subscriptions"
              color="red"
            />
          </section>

          {/* TABS */}

          <section className="admin-subscriptions-panel">
            <div className="admin-subscriptions-tabs">
              <button
                className={
                  activeTab === "subscriptions"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("subscriptions")
                }
              >
                Subscriptions
              </button>

              <button
                className={
                  activeTab === "plans" ? "active" : ""
                }
                onClick={() => setActiveTab("plans")}
              >
                Subscription Plans
              </button>
            </div>

            {activeTab === "subscriptions" ? (
              <>
                {/* FILTER BAR */}

                <div className="admin-subscriptions-toolbar">
                  <div className="admin-subscriptions-search">
                    <Search size={17} />

                    <input
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Search workspace, owner, email or subscription..."
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
                    <option value="Active">
                      Active
                    </option>
                    <option value="Past Due">
                      Past Due
                    </option>
                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>

                  <select
                    value={planFilter}
                    onChange={(event) =>
                      setPlanFilter(event.target.value)
                    }
                  >
                    <option value="All">
                      All Plans
                    </option>
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Business">
                      Business
                    </option>
                    <option value="Enterprise">
                      Enterprise
                    </option>
                  </select>

                  <select
                    value={`${sortKey}-${sortOrder}`}
                    onChange={(event) => {
                      const [k, ord] = event.target.value.split("-");
                      setSortKey(k);
                      setSortOrder(ord);
                    }}
                    aria-label="Sort subscriptions"
                  >
                    <option value="workspace-asc">Sort: Workspace (A to Z)</option>
                    <option value="workspace-desc">Sort: Workspace (Z to A)</option>
                    <option value="price-desc">Sort: Price (High to Low)</option>
                    <option value="price-asc">Sort: Price (Low to High)</option>
                    <option value="plan-asc">Sort: Plan</option>
                    <option value="status-asc">Sort: Status</option>
                    <option value="nextBilling-asc">Sort: Next Billing</option>
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

                <div className="admin-subscriptions-table-info">
                  <span>
                    Showing {filteredSubscriptions.length}{" "}
                    subscriptions
                  </span>

                  <button onClick={resetDemoData}>
                    <RotateCcw size={14} />
                    Reset Demo Data
                  </button>
                </div>

                {/* TABLE */}

                <div className="admin-subscriptions-table-wrapper">
                  <table className="admin-subscriptions-table">
                    <thead>
                      <tr>
                        <th style={{ width: 48, textAlign: "center" }}>#</th>
                        <th className="sortable-th" onClick={() => handleSort("workspace")}>
                          <div className="th-content">
                            <span>WORKSPACE</span>
                            {renderSortIcon("workspace")}
                          </div>
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("plan")}>
                          <div className="th-content">
                            <span>PLAN</span>
                            {renderSortIcon("plan")}
                          </div>
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("price")}>
                          <div className="th-content">
                            <span>PRICE</span>
                            {renderSortIcon("price")}
                          </div>
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("billingCycle")}>
                          <div className="th-content">
                            <span>BILLING</span>
                            {renderSortIcon("billingCycle")}
                          </div>
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("status")}>
                          <div className="th-content">
                            <span>STATUS</span>
                            {renderSortIcon("status")}
                          </div>
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("startDate")}>
                          <div className="th-content">
                            <span>START DATE</span>
                            {renderSortIcon("startDate")}
                          </div>
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("nextBilling")}>
                          <div className="th-content">
                            <span>NEXT BILLING</span>
                            {renderSortIcon("nextBilling")}
                          </div>
                        </th>
                        <th style={{ textAlign: "right" }}>ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredSubscriptions.map(
                        (subscription, idx) => (
                          <tr key={subscription.id}>
                            <td style={{ textAlign: "center" }}>
                              <span className="admin-row-num">{idx + 1}</span>
                            </td>
                            <td>
                              <div className="admin-subscriptions-workspace">
                                <div>
                                  {subscription.workspace
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <span>
                                  <strong>
                                    {subscription.workspace}
                                  </strong>

                                  <small>
                                    {subscription.owner} •{" "}
                                    {subscription.email}
                                  </small>
                                </span>
                              </div>
                            </td>

                            <td>
                              <PlanBadge
                                plan={subscription.plan}
                              />
                            </td>

                            <td>
                              <strong className="admin-subscriptions-price">
                                ${subscription.price}
                              </strong>
                            </td>

                            <td>
                              <span className="billing-cycle-tag">{subscription.billingCycle}</span>
                            </td>

                            <td>
                              <StatusBadge
                                status={
                                  subscription.status
                                }
                              />
                            </td>

                            <td>
                              {subscription.startDate}
                            </td>

                            <td>
                              {subscription.nextBilling}
                            </td>

                            <td>
                              <div className="admin-subscriptions-menu-wrap">
                                <button
                                  className="admin-subscriptions-more"
                                  onClick={() =>
                                    setMenuId(
                                      menuId ===
                                        subscription.id
                                        ? null
                                        : subscription.id
                                    )
                                  }
                                >
                                  <MoreVertical
                                    size={17}
                                  />
                                </button>

                                {menuId ===
                                  subscription.id && (
                                  <div className="admin-subscriptions-menu">
                                    <button
                                      onClick={() => {
                                        setSelectedSubscription(
                                          subscription
                                        );
                                        setMenuId(null);
                                      }}
                                    >
                                      <Eye size={14} />
                                      View Details
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleSubscriptionStatus(
                                          subscription.id
                                        )
                                      }
                                    >
                                      {subscription.status ===
                                      "Cancelled" ? (
                                        <>
                                          <Play
                                            size={14}
                                          />
                                          Reactivate
                                        </>
                                      ) : (
                                        <>
                                          <Pause
                                            size={14}
                                          />
                                          Cancel
                                        </>
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  {filteredSubscriptions.length === 0 && (
                    <div className="admin-subscriptions-empty">
                      <BadgeDollarSign size={42} />

                      <h3>
                        No subscriptions found
                      </h3>

                      <p>
                        Try changing the search or
                        filters.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* PLANS VIEW (TABLE / CARDS) */
              <div className="admin-subscriptions-plans-container">
                <div className="plans-header-bar">
                  <div className="plans-header-info">
                    <h3>Subscription Tier Plans ({plans.length})</h3>
                    <p>Configure pricing models, feature allowances, and subscriber quotas.</p>
                  </div>

                  <div className="plans-header-actions">
                    <button
                      type="button"
                      className="admin-subscriptions-btn-primary"
                      onClick={() =>
                        setEditingPlan({
                          id: `plan-${Date.now()}`,
                          name: "Custom Enterprise",
                          price: 299,
                          billing: "month",
                          color: "purple",
                          popular: false,
                          subscribers: 0,
                          features: ["Unlimited Workspaces", "Dedicated AI GPU Cluster", "24/7 SLA Support"],
                        })
                      }
                    >
                      <Plus size={16} />
                      Create Plan
                    </button>

                    <div className="view-switch">
                      <button
                        type="button"
                        className={`view-btn ${plansViewMode === "table" ? "active" : ""}`}
                        onClick={() => setPlansViewMode("table")}
                        title="Table view"
                      >
                        <List size={16} />
                      </button>
                      <button
                        type="button"
                        className={`view-btn ${plansViewMode === "cards" ? "active" : ""}`}
                        onClick={() => setPlansViewMode("cards")}
                        title="Cards view"
                      >
                        <Grid2X2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {plansViewMode === "table" ? (
                  <div className="admin-subscriptions-table-wrapper">
                    <table className="admin-subscriptions-table">
                      <thead>
                        <tr>
                          <th style={{ width: 48, textAlign: "center" }}>#</th>
                          <th>PLAN TIER</th>
                          <th>PRICE</th>
                          <th>BILLING</th>
                          <th>SUBSCRIBERS</th>
                          <th>KEY FEATURES</th>
                          <th style={{ textAlign: "right" }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plans.map((plan, idx) => (
                          <tr key={plan.id}>
                            <td style={{ textAlign: "center" }}>
                              <span className="admin-row-num">{idx + 1}</span>
                            </td>
                            <td>
                              <div className="plan-name-cell">
                                <strong style={{ color: "#0f172a" }}>{plan.name}</strong>
                                {plan.popular && (
                                  <span className="popular-badge-table">
                                    <Crown size={11} /> Popular
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <strong className="admin-subscriptions-price">${plan.price}</strong>
                            </td>
                            <td>Per {plan.billing}</td>
                            <td>
                              <span className="subscribers-pill">
                                <Users size={13} /> {plan.subscribers}
                              </span>
                            </td>
                            <td>
                              <div className="features-preview-cell">
                                <span>{plan.features.slice(0, 2).join(", ")}</span>
                                {plan.features.length > 2 && (
                                  <small> +{plan.features.length - 2} more</small>
                                )}
                              </div>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div className="table-actions">
                                <button
                                  type="button"
                                  className="action-btn"
                                  title="Edit Plan"
                                  onClick={() =>
                                    setEditingPlan({
                                      ...plan,
                                      features: [...plan.features],
                                    })
                                  }
                                >
                                  <Pencil size={15} />
                                </button>
                                {plans.length > 1 && (
                                  <button
                                    type="button"
                                    className="action-btn delete"
                                    title="Delete Plan"
                                    onClick={() => {
                                      if (window.confirm(`Delete plan "${plan.name}"?`)) {
                                        setPlans(plans.filter((p) => p.id !== plan.id));
                                      }
                                    }}
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="admin-subscriptions-plans">
                    {plans.map((plan, idx) => (
                      <article
                        key={plan.id}
                        className={`admin-subscriptions-plan-card ${plan.color}`}
                      >
                        {plan.popular && (
                          <div className="admin-subscriptions-popular">
                            <Crown size={12} />
                            MOST POPULAR
                          </div>
                        )}

                        <div className="admin-subscriptions-plan-top">
                          <div
                            className={`admin-subscriptions-plan-icon ${plan.color}`}
                          >
                            <span className="admin-row-num sm">{idx + 1}</span>
                          </div>

                          <button
                            onClick={() =>
                              setEditingPlan({
                                ...plan,
                                features: [
                                  ...plan.features,
                                ],
                              })
                            }
                          >
                            <Pencil size={15} />
                          </button>
                        </div>

                        <h3>{plan.name}</h3>

                        <div className="admin-subscriptions-plan-price">
                          <strong>${plan.price}</strong>
                          <span>/ {plan.billing}</span>
                        </div>

                        <div className="admin-subscriptions-subscriber-count">
                          <Users size={14} />
                          {plan.subscribers} subscribers
                        </div>

                        <div className="admin-subscriptions-plan-divider" />

                        <div className="admin-subscriptions-features">
                          {plan.features.map(
                            (feature, index) => (
                              <div key={index}>
                                <Check size={14} />
                                <span>{feature}</span>
                              </div>
                            )
                          )}
                        </div>

                        <button
                          className="admin-subscriptions-edit-plan"
                          onClick={() =>
                            setEditingPlan({
                              ...plan,
                              features: [
                                ...plan.features,
                              ],
                            })
                          }
                        >
                          <Pencil size={14} />
                          Edit Plan
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* DETAILS MODAL */}

      {selectedSubscription && (
        <div className="admin-subscriptions-modal-overlay">
          <div className="admin-subscriptions-modal">
            <div className="admin-subscriptions-modal-header">
              <div>
                <h2>Subscription Details</h2>
                <p>{selectedSubscription.id}</p>
              </div>

              <button
                onClick={() =>
                  setSelectedSubscription(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-subscriptions-modal-body">
              <div className="admin-subscriptions-modal-summary">
                <div>
                  <CreditCard size={23} />
                </div>

                <span>
                  <small>Current Plan</small>
                  <strong>
                    {selectedSubscription.plan}
                  </strong>
                </span>

                <strong>
                  ${selectedSubscription.price}/mo
                </strong>
              </div>

              <DetailRow
                label="Workspace"
                value={selectedSubscription.workspace}
              />

              <DetailRow
                label="Owner"
                value={selectedSubscription.owner}
              />

              <DetailRow
                label="Email"
                value={selectedSubscription.email}
              />

              <DetailRow
                label="Billing Cycle"
                value={
                  selectedSubscription.billingCycle
                }
              />

              <DetailRow
                label="Status"
                value={selectedSubscription.status}
              />

              <DetailRow
                label="Started"
                value={selectedSubscription.startDate}
              />

              <DetailRow
                label="Next Billing"
                value={
                  selectedSubscription.nextBilling
                }
              />
            </div>

            <div className="admin-subscriptions-modal-footer">
              <button
                className="admin-subscriptions-secondary-btn"
                onClick={() =>
                  setSelectedSubscription(null)
                }
              >
                Close
              </button>

              <button
                className="admin-subscriptions-primary-btn"
                onClick={() => {
                  handleSubscriptionStatus(
                    selectedSubscription.id
                  );
                  setSelectedSubscription(null);
                }}
              >
                {selectedSubscription.status ===
                "Cancelled"
                  ? "Reactivate Subscription"
                  : "Cancel Subscription"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PLAN MODAL */}

      {editingPlan && (
        <div className="admin-subscriptions-modal-overlay">
          <div className="admin-subscriptions-modal">
            <div className="admin-subscriptions-modal-header">
              <div>
                <h2>Edit {editingPlan.name} Plan</h2>
                <p>
                  Update subscription plan settings.
                </p>
              </div>

              <button
                onClick={() => setEditingPlan(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-subscriptions-form">
              <label>
                Plan Name
                <input
                  value={editingPlan.name}
                  onChange={(event) =>
                    setEditingPlan({
                      ...editingPlan,
                      name: event.target.value,
                    })
                  }
                />
              </label>

              <div className="admin-subscriptions-form-grid">
                <label>
                  Monthly Price
                  <input
                    type="number"
                    min="0"
                    value={editingPlan.price}
                    onChange={(event) =>
                      setEditingPlan({
                        ...editingPlan,
                        price: Number(
                          event.target.value
                        ),
                      })
                    }
                  />
                </label>

                <label>
                  Subscribers
                  <input
                    type="number"
                    min="0"
                    value={editingPlan.subscribers}
                    onChange={(event) =>
                      setEditingPlan({
                        ...editingPlan,
                        subscribers: Number(
                          event.target.value
                        ),
                      })
                    }
                  />
                </label>
              </div>

              <div className="admin-subscriptions-form-grid">
                <label>
                  Storage
                  <input
                    value={editingPlan.storage}
                    onChange={(event) =>
                      setEditingPlan({
                        ...editingPlan,
                        storage: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  AI Credits
                  <input
                    type="number"
                    value={editingPlan.aiCredits}
                    onChange={(event) =>
                      setEditingPlan({
                        ...editingPlan,
                        aiCredits: Number(
                          event.target.value
                        ),
                      })
                    }
                  />
                </label>
              </div>

              <label>
                Status
                <select
                  value={editingPlan.status}
                  onChange={(event) =>
                    setEditingPlan({
                      ...editingPlan,
                      status: event.target.value,
                    })
                  }
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
            </div>

            <div className="admin-subscriptions-modal-footer">
              <button
                className="admin-subscriptions-secondary-btn"
                onClick={() => setEditingPlan(null)}
              >
                Cancel
              </button>

              <button
                className="admin-subscriptions-primary-btn"
                onClick={savePlan}
              >
                <Check size={15} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  description,
  color,
}) {
  return (
    <article className="admin-subscriptions-stat">
      <div
        className={`admin-subscriptions-stat-icon ${color}`}
      >
        <Icon size={21} />
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>

      <TrendingUp
        size={18}
        className="admin-subscriptions-stat-trend"
      />
    </article>
  );
}

function StatusBadge({ status }) {
  const className = status
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span
      className={`admin-subscriptions-status ${className}`}
    >
      {status}
    </span>
  );
}

function PlanBadge({ plan }) {
  return (
    <span
      className={`admin-subscriptions-plan-badge ${plan.toLowerCase()}`}
    >
      {plan}
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="admin-subscriptions-detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default AdminSubscriptions;