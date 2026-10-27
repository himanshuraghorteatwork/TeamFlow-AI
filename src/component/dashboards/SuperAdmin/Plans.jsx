import { useState } from "react";
import {
  Gem,
  Plus,
  Check,
  Crown,
  Users,
  Sparkles,
  ArrowUpRight,
  Pencil,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Plans.css";

const INITIAL_PLANS = [
  {
    id: "plan-free",
    name: "Free",
    tagline: "For individuals and small teams getting started.",
    monthlyPrice: 0,
    annualPrice: 0,
    badge: "",
    subscribers: 57,
    percentage: 40,
    color: "#5b74ff",
    features: [
      "Up to 5 team members",
      "1,000 AI tokens / month",
      "3 active workspaces",
      "Community support",
      "1 GB cloud storage",
    ],
    status: "Active",
  },
  {
    id: "plan-pro",
    name: "Pro",
    tagline: "For growing organizations scaling AI workflows.",
    monthlyPrice: 2499,
    annualPrice: 23990,
    badge: "Most Popular",
    subscribers: 50,
    percentage: 35,
    color: "#2783ff",
    features: [
      "Up to 30 team members",
      "50,000 AI tokens / month",
      "Unlimited workspaces",
      "Standard email & chat support",
      "25 GB cloud storage",
      "Audit logs (30 days)",
    ],
    status: "Active",
  },
  {
    id: "plan-business",
    name: "Business",
    tagline: "For high-velocity companies requiring high AI quotas.",
    monthlyPrice: 7999,
    annualPrice: 76790,
    badge: "Best Value",
    subscribers: 28,
    percentage: 20,
    color: "#ffb21c",
    features: [
      "Up to 100 team members",
      "250,000 AI tokens / month",
      "Unlimited workspaces",
      "Priority 24/7 support",
      "100 GB cloud storage",
      "Custom SMTP & Branding",
      "Audit logs (1 year)",
    ],
    status: "Active",
  },
  {
    id: "plan-enterprise",
    name: "Enterprise",
    tagline: "For large-scale enterprises with custom SLAs & compliance.",
    monthlyPrice: 24999,
    annualPrice: 239990,
    badge: "Custom SLA",
    subscribers: 7,
    percentage: 5,
    color: "#ff454b",
    features: [
      "Unlimited team members",
      "1,000,000+ AI tokens / month",
      "Dedicated infrastructure",
      "Dedicated account manager",
      "Unlimited cloud storage",
      "99.99% uptime SLA",
      "SSO & Custom Security rules",
    ],
    status: "Active",
  },
];

function Plans() {
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" | "annual"
  const [editingPlan, setEditingPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPlanForm, setNewPlanForm] = useState({
    name: "",
    tagline: "",
    monthlyPrice: "",
    annualPrice: "",
    badge: "",
    features: "",
  });

  const totalSubscribers = plans.reduce((acc, p) => acc + p.subscribers, 0);

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setNewPlanForm({
      name: plan.name,
      tagline: plan.tagline,
      monthlyPrice: plan.monthlyPrice,
      annualPrice: plan.annualPrice,
      badge: plan.badge || "",
      features: plan.features.join("\n"),
    });
    setModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setNewPlanForm({
      name: "",
      tagline: "",
      monthlyPrice: "",
      annualPrice: "",
      badge: "",
      features: "Feature 1\nFeature 2\nFeature 3",
    });
    setModalOpen(true);
  };

  const handleSavePlan = (e) => {
    e.preventDefault();
    if (!newPlanForm.name) return;

    const featureList = newPlanForm.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    if (editingPlan) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlan.id
            ? {
                ...p,
                name: newPlanForm.name,
                tagline: newPlanForm.tagline,
                monthlyPrice: Number(newPlanForm.monthlyPrice) || 0,
                annualPrice: Number(newPlanForm.annualPrice) || 0,
                badge: newPlanForm.badge,
                features: featureList,
              }
            : p
        )
      );
    } else {
      const newPlan = {
        id: `plan-${Date.now()}`,
        name: newPlanForm.name,
        tagline: newPlanForm.tagline,
        monthlyPrice: Number(newPlanForm.monthlyPrice) || 0,
        annualPrice: Number(newPlanForm.annualPrice) || 0,
        badge: newPlanForm.badge,
        subscribers: 0,
        percentage: 0,
        color: "#8b5cf6",
        features: featureList,
        status: "Active",
      };
      setPlans((prev) => [...prev, newPlan]);
    }

    setModalOpen(false);
  };

  return (
    <div className="sa-page-container sa-plans-page">
      {/* 1. Page Header */}
      <section className="sa-page-header">
        <div className="sa-page-header-left">
          <h1>Subscription Plans</h1>
          <p>Configure pricing tiers, AI token quotas, and feature entitlements.</p>
        </div>

        <div className="sa-page-header-actions">
          {/* Billing Cycle Switch */}
          <div className="sa-billing-toggle">
            <button
              type="button"
              className={`sa-billing-tab ${
                billingCycle === "monthly" ? "is-active" : ""
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              className={`sa-billing-tab ${
                billingCycle === "annual" ? "is-active" : ""
              }`}
              onClick={() => setBillingCycle("annual")}
            >
              Annual (Save 20%)
            </button>
          </div>

          <button
            type="button"
            className="sa-btn sa-btn-primary"
            onClick={handleOpenCreate}
          >
            <Plus size={16} /> Create New Plan
          </button>
        </div>
      </section>

      {/* 2. Top 4 KPI Stat Cards */}
      <section className="sa-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <Gem size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Active Plans</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{plans.length}</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 100%
              </span>
            </div>
            <span className="sa-kpi-subtitle">All tiers currently active</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box sky">
            <Users size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Total Subscribers</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{totalSubscribers}</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 5.2%
              </span>
            </div>
            <span className="sa-kpi-subtitle">Across 186 organizations</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <span className="sa-kpi-currency-symbol">₹</span>
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Monthly Run Rate</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">₹2.48L</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 16%
              </span>
            </div>
            <span className="sa-kpi-subtitle">+ ₹34,500 this month</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <Crown size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Top Revenue Tier</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">Business</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 20%
              </span>
            </div>
            <span className="sa-kpi-subtitle">Highest conversion rate</span>
          </div>
        </article>
      </section>

      {/* 3. Live Subscriber Allocation Bar */}
      <section className="sa-card sa-plan-distribution-card">
        <div className="sa-card-header">
          <h3>Live Subscriber Allocation</h3>
          <span className="sa-total-tag">{totalSubscribers} Subscribed Tenants</span>
        </div>

        <div className="sa-alloc-bar-wrapper">
          <div className="sa-alloc-bar">
            {plans.map((p) => (
              <div
                key={p.id}
                className="sa-alloc-segment"
                style={{
                  width: `${p.percentage || 1}%`,
                  backgroundColor: p.color,
                }}
                title={`${p.name}: ${p.subscribers} subscribers (${p.percentage}%)`}
              />
            ))}
          </div>
          <div className="sa-alloc-legend">
            {plans.map((p) => (
              <div key={p.id} className="sa-alloc-legend-item">
                <span
                  className="sa-alloc-dot"
                  style={{ backgroundColor: p.color }}
                />
                <span className="sa-alloc-name">{p.name}</span>
                <span className="sa-alloc-subtext">
                  {p.subscribers} orgs ({p.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Plan Cards Grid */}
      <section className="sa-plans-grid">
        {plans.map((plan) => {
          const price =
            billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
          const billingSuffix =
            plan.monthlyPrice === 0
              ? "/ free forever"
              : billingCycle === "monthly"
              ? "/ month"
              : "/ year";

          return (
            <article
              key={plan.id}
              className={`sa-card sa-plan-tier-card ${
                plan.badge ? "has-badge" : ""
              }`}
            >
              {plan.badge && (
                <div
                  className="sa-plan-badge-pill"
                  style={{
                    backgroundColor: `${plan.color}18`,
                    color: plan.color,
                    borderColor: `${plan.color}35`,
                  }}
                >
                  <Sparkles size={12} /> {plan.badge}
                </div>
              )}

              <div className="sa-plan-card-header">
                <h3 style={{ color: plan.color }}>{plan.name}</h3>
                <p>{plan.tagline}</p>
              </div>

              <div className="sa-plan-price-block">
                <div className="sa-plan-price-num">
                  <span className="sa-price-currency">₹</span>
                  <span className="sa-price-digits">
                    {price.toLocaleString()}
                  </span>
                </div>
                <span className="sa-price-suffix">{billingSuffix}</span>
              </div>

              <div className="sa-plan-subscribers-bar">
                <div className="sa-sub-header">
                  <span>Subscribers</span>
                  <strong>{plan.subscribers} Orgs</strong>
                </div>
                <div className="sa-sub-progress">
                  <div
                    className="sa-sub-progress-fill"
                    style={{
                      width: `${plan.percentage}%`,
                      backgroundColor: plan.color,
                    }}
                  />
                </div>
              </div>

              <div className="sa-plan-features-list">
                <p className="sa-feat-heading">WHAT'S INCLUDED:</p>
                <ul>
                  {plan.features.map((feat, i) => (
                    <li key={i}>
                      <Check
                        size={15}
                        className="sa-check-icon"
                        style={{ color: plan.color }}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sa-plan-card-footer">
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary sa-btn-sm"
                  onClick={() => handleOpenEdit(plan)}
                >
                  <Pencil size={13} /> Edit Plan
                </button>
                <span className="sa-pill sa-pill-success">{plan.status}</span>
              </div>
            </article>
          );
        })}
      </section>

      {/* 5. Create / Edit Plan Modal */}
      {modalOpen && (
        <div className="sa-modal-backdrop">
          <div className="sa-modal-content">
            <div className="sa-modal-header">
              <h3>{editingPlan ? `Edit ${editingPlan.name} Plan` : "Create New Plan"}</h3>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePlan}>
              <div className="sa-modal-body">
                <div className="sa-form-group">
                  <label>Plan Name</label>
                  <input
                    type="text"
                    className="sa-form-input"
                    value={newPlanForm.name}
                    onChange={(e) =>
                      setNewPlanForm({ ...newPlanForm, name: e.target.value })
                    }
                    placeholder="e.g. Starter, Pro, Enterprise"
                    required
                  />
                </div>

                <div className="sa-form-group">
                  <label>Tagline / Description</label>
                  <input
                    type="text"
                    className="sa-form-input"
                    value={newPlanForm.tagline}
                    onChange={(e) =>
                      setNewPlanForm({ ...newPlanForm, tagline: e.target.value })
                    }
                    placeholder="Brief description for customers"
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <div className="sa-form-group">
                    <label>Monthly Price (₹)</label>
                    <input
                      type="number"
                      className="sa-form-input"
                      value={newPlanForm.monthlyPrice}
                      onChange={(e) =>
                        setNewPlanForm({
                          ...newPlanForm,
                          monthlyPrice: e.target.value,
                        })
                      }
                      placeholder="0"
                    />
                  </div>

                  <div className="sa-form-group">
                    <label>Annual Price (₹)</label>
                    <input
                      type="number"
                      className="sa-form-input"
                      value={newPlanForm.annualPrice}
                      onChange={(e) =>
                        setNewPlanForm({
                          ...newPlanForm,
                          annualPrice: e.target.value,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="sa-form-group">
                  <label>Highlight Badge (optional)</label>
                  <input
                    type="text"
                    className="sa-form-input"
                    value={newPlanForm.badge}
                    onChange={(e) =>
                      setNewPlanForm({ ...newPlanForm, badge: e.target.value })
                    }
                    placeholder="e.g. Most Popular, Custom SLA"
                  />
                </div>

                <div className="sa-form-group">
                  <label>Features (one per line)</label>
                  <textarea
                    rows={4}
                    className="sa-form-textarea"
                    value={newPlanForm.features}
                    onChange={(e) =>
                      setNewPlanForm({
                        ...newPlanForm,
                        features: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="sa-modal-footer">
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sa-btn sa-btn-primary">
                  {editingPlan ? "Save Changes" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Plans;

