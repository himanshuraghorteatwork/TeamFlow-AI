import { useState } from "react";
import {
  Megaphone,
  Plus,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
  Users,
  Eye,
  Trash2,
  CalendarDays,
  X,
  ArrowUpRight,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Announcements.css";

const INITIAL_ANNOUNCEMENTS = [
  {
    id: "ANN-101",
    title: "TeamFlow AI 2.0 with Gemini Flash & Pro Models Released",
    message: "We've upgraded our AI models to provide 3x faster response times and enhanced reasoning across all workspaces.",
    type: "info", // "info" | "warning" | "success" | "emergency"
    audience: "All Platform Users",
    status: "Active",
    startDate: "2024-10-20",
    endDate: "2024-11-05",
    views: 8940,
  },
  {
    id: "ANN-102",
    title: "Scheduled Maintenance Window: Saturday Nov 2, 02:00 AM IST",
    message: "Database optimization and indexing will take place between 02:00 AM and 03:30 AM IST. Intermittent read latency may occur.",
    type: "warning",
    audience: "All Organizations",
    status: "Active",
    startDate: "2024-10-25",
    endDate: "2024-11-03",
    views: 3540,
  },
  {
    id: "ANN-103",
    title: "Mandatory Two-Factor Authentication (2FA) Enforcement",
    message: "Super Admins and Tenant Admins must enable 2FA on their security page by November 15 to ensure account compliance.",
    type: "emergency",
    audience: "Super Admins & Admins",
    status: "Scheduled",
    startDate: "2024-11-01",
    endDate: "2024-11-15",
    views: 0,
  },
];

function Announcements() {
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    title: "",
    message: "",
    type: "info",
    audience: "All Platform Users",
    startDate: "2024-10-26",
    endDate: "2024-11-10",
  });

  const totalViews = announcements.reduce((acc, a) => acc + a.views, 0);
  const activeCount = announcements.filter((a) => a.status === "Active").length;

  const handleToggleStatus = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "Active" ? "Paused" : "Active" }
          : a
      )
    );
  };

  const handleDelete = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newForm.title) return;

    const newAnn = {
      id: `ANN-${Date.now().toString().slice(-3)}`,
      title: newForm.title,
      message: newForm.message,
      type: newForm.type,
      audience: newForm.audience,
      status: "Active",
      startDate: newForm.startDate,
      endDate: newForm.endDate,
      views: 0,
    };

    setAnnouncements((prev) => [newAnn, ...prev]);
    setModalOpen(false);
    setNewForm({
      title: "",
      message: "",
      type: "info",
      audience: "All Platform Users",
      startDate: "2024-10-26",
      endDate: "2024-11-10",
    });
  };

  return (
    <div className="sa-page-container sa-announcements-page">
      {/* 1. Page Header */}
      <section className="sa-page-header">
        <div className="sa-page-header-left">
          <h1>Announcements & Broadcasts</h1>
          <p>Publish platform-wide banner notices, scheduled maintenance alerts, and changelogs.</p>
        </div>

        <div className="sa-page-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-primary"
            onClick={() => setModalOpen(true)}
          >
            <Plus size={16} /> Create Announcement
          </button>
        </div>
      </section>

      {/* 2. Top 4 KPI Stat Cards */}
      <section className="sa-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <Megaphone size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Active Broadcasts</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{activeCount}</span>
              <span className="sa-kpi-trend positive">
                <CheckCircle2 size={14} /> Live
              </span>
            </div>
            <span className="sa-kpi-subtitle">Visible across client dashboards</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <Eye size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Total Impressions</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{totalViews.toLocaleString()}</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 24%
              </span>
            </div>
            <span className="sa-kpi-subtitle">User views in last 14 days</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <AlertTriangle size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Maintenance Notices</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">1 Scheduled</span>
              <span className="sa-kpi-trend positive">
                Nov 2
              </span>
            </div>
            <span className="sa-kpi-subtitle">Zero unexpected downtime</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box sky">
            <Users size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Audience Reach</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">1,248</span>
              <span className="sa-kpi-trend positive">
                100%
              </span>
            </div>
            <span className="sa-kpi-subtitle">All 186 organizations targeted</span>
          </div>
        </article>
      </section>

      {/* 3. Announcements List */}
      <section className="sa-card sa-announcements-list-card">
        <div className="sa-card-header">
          <h3>Active & Scheduled Notices</h3>
          <span className="sa-total-tag">{announcements.length} Notices Total</span>
        </div>

        <div className="sa-announcements-stack">
          {announcements.map((ann) => (
            <div key={ann.id} className={`sa-ann-banner-card ${ann.type}`}>
              <div className="sa-ann-banner-icon">
                {ann.type === "warning" ? (
                  <AlertTriangle size={20} />
                ) : ann.type === "emergency" ? (
                  <AlertTriangle size={20} />
                ) : ann.type === "success" ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Info size={20} />
                )}
              </div>

              <div className="sa-ann-banner-content">
                <div className="sa-ann-banner-meta">
                  <span className="sa-ann-type-badge">{ann.type.toUpperCase()}</span>
                  <span className="sa-ann-target">Target: {ann.audience}</span>
                  <span className="sa-ann-schedule">
                    <CalendarDays size={13} /> {ann.startDate} to {ann.endDate}
                  </span>
                  <span className="sa-ann-views">
                    <Eye size={13} /> {ann.views.toLocaleString()} views
                  </span>
                </div>

                <h4 className="sa-ann-title">{ann.title}</h4>
                <p className="sa-ann-desc">{ann.message}</p>
              </div>

              <div className="sa-ann-banner-actions">
                <button
                  type="button"
                  className={`sa-btn sa-btn-sm ${
                    ann.status === "Active" ? "sa-btn-secondary" : "sa-btn-primary"
                  }`}
                  onClick={() => handleToggleStatus(ann.id)}
                >
                  {ann.status === "Active" ? "Pause Banner" : "Publish"}
                </button>
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary sa-btn-sm"
                  style={{ color: "#ef4444" }}
                  onClick={() => handleDelete(ann.id)}
                  title="Delete Announcement"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Create Modal */}
      {modalOpen && (
        <div className="sa-modal-backdrop">
          <div className="sa-modal-content">
            <div className="sa-modal-header">
              <h3>Create Platform Announcement</h3>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="sa-modal-body">
                <div className="sa-form-group">
                  <label>Announcement Title</label>
                  <input
                    type="text"
                    className="sa-form-input"
                    value={newForm.title}
                    onChange={(e) =>
                      setNewForm({ ...newForm, title: e.target.value })
                    }
                    placeholder="e.g. Scheduled System Upgrade or Feature Release"
                    required
                  />
                </div>

                <div className="sa-form-group">
                  <label>Notice Type / Styling</label>
                  <select
                    className="sa-form-select"
                    value={newForm.type}
                    onChange={(e) =>
                      setNewForm({ ...newForm, type: e.target.value })
                    }
                  >
                    <option value="info">Info (Blue)</option>
                    <option value="warning">Warning / Maintenance (Amber)</option>
                    <option value="emergency">Critical Alert (Red)</option>
                    <option value="success">Success / Milestone (Green)</option>
                  </select>
                </div>

                <div className="sa-form-group">
                  <label>Target Audience</label>
                  <select
                    className="sa-form-select"
                    value={newForm.audience}
                    onChange={(e) =>
                      setNewForm({ ...newForm, audience: e.target.value })
                    }
                  >
                    <option value="All Platform Users">All Platform Users</option>
                    <option value="All Organizations">All Organizations</option>
                    <option value="Super Admins & Admins">Super Admins & Admins Only</option>
                    <option value="Pro & Enterprise Users">Pro & Enterprise Users</option>
                  </select>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <div className="sa-form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      className="sa-form-input"
                      value={newForm.startDate}
                      onChange={(e) =>
                        setNewForm({ ...newForm, startDate: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="sa-form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      className="sa-form-input"
                      value={newForm.endDate}
                      onChange={(e) =>
                        setNewForm({ ...newForm, endDate: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="sa-form-group">
                  <label>Message Content</label>
                  <textarea
                    rows={4}
                    className="sa-form-textarea"
                    value={newForm.message}
                    onChange={(e) =>
                      setNewForm({ ...newForm, message: e.target.value })
                    }
                    placeholder="Details about the update or instructions for users..."
                    required
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
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Announcements;

