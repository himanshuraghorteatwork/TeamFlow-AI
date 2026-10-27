import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
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
  Search,
  Download,
  SlidersHorizontal,
  RefreshCw,
  Table as TableIcon,
  Grid,
  Lock,
  Unlock,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Copy,
  ExternalLink,
  Pin,
  ShieldAlert,
  Clock,
  MousePointerClick,
  Radio,
  Check,
  Monitor,
  Smartphone,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Announcements.css";

/* =========================================================================
   INITIAL DATA: REALISTIC ENTERPRISE PLATFORM ANNOUNCEMENTS
   ========================================================================= */
const INITIAL_ANNOUNCEMENTS = [
  {
    id: "ANN-101",
    title: "TeamFlow AI 2.0 with Gemini Flash & Pro Models Released",
    message: "We have upgraded our core inference infrastructure to provide 3x faster response times, extended context windows, and real-time streaming tools across all workspaces.",
    type: "info",
    audience: "All Platform Users",
    status: "Active",
    startDate: "2026-10-20",
    endDate: "2026-11-15",
    views: 8940,
    clicks: 1240,
    pinned: true,
    dismissible: true,
    ctaText: "Explore AI 2.0 Features",
    ctaUrl: "/superadmin/ai-config",
  },
  {
    id: "ANN-102",
    title: "Scheduled Maintenance Window: Saturday Nov 2, 02:00 AM IST",
    message: "Database optimization, shard rebalancing, and index restructuring will take place between 02:00 AM and 03:30 AM IST. Intermittent read latency may occur.",
    type: "warning",
    audience: "All Organizations",
    status: "Active",
    startDate: "2026-10-25",
    endDate: "2026-11-03",
    views: 3540,
    clicks: 412,
    pinned: false,
    dismissible: true,
    ctaText: "Check Live Status Page",
    ctaUrl: "https://status.teamflow.ai",
  },
  {
    id: "ANN-103",
    title: "Mandatory Two-Factor Authentication (2FA) Enforcement Advisory",
    message: "Super Admins and Tenant Organization Administrators must enable multi-factor authentication (TOTP or WebAuthn) on their security page before November 15 to ensure compliance.",
    type: "emergency",
    audience: "Super Admins & Admins",
    status: "Scheduled",
    startDate: "2026-11-01",
    endDate: "2026-11-15",
    views: 0,
    clicks: 0,
    pinned: true,
    dismissible: false,
    ctaText: "Configure 2FA Security",
    ctaUrl: "/superadmin/security",
  },
  {
    id: "ANN-104",
    title: "New GST Compliant Invoicing Engine Live for Enterprise Customers",
    message: "Download updated official tax receipts with state-specific GSTIN breakdowns, SAC codes, and automated reverse charge audits directly from your billing tab.",
    type: "success",
    audience: "Tenant Admins & Billing",
    status: "Active",
    startDate: "2026-10-15",
    endDate: "2026-11-10",
    views: 2840,
    clicks: 395,
    pinned: false,
    dismissible: true,
    ctaText: "View Invoicing Portal",
    ctaUrl: "/superadmin/invoices",
  },
  {
    id: "ANN-105",
    title: "SOC 2 Type II Security & Data Isolation Audit Successfully Completed",
    message: "Third-party attestation confirms that TeamFlow AI meets the highest standards for enterprise tenant isolation, automated encryption at rest, and zero-trust role controls.",
    type: "success",
    audience: "All Organizations",
    status: "Active",
    startDate: "2026-10-10",
    endDate: "2026-11-20",
    views: 4210,
    clicks: 518,
    pinned: false,
    dismissible: true,
    ctaText: "Download SOC 2 Report",
    ctaUrl: "#",
  },
  {
    id: "ANN-106",
    title: "Database Cluster Migration Window (Frankfurt & Mumbai Regions)",
    message: "Automated migration to high-throughput compute shards will take place between 01:00 AM and 02:30 AM UTC. No tenant workspace downtime is anticipated.",
    type: "warning",
    audience: "Tenant Admins & Billing",
    status: "Scheduled",
    startDate: "2026-11-05",
    endDate: "2026-11-08",
    views: 0,
    clicks: 0,
    pinned: false,
    dismissible: true,
    ctaText: "Migration Schedule",
    ctaUrl: "#",
  },
];

const DEFAULT_FORM_DATA = {
  id: "",
  title: "",
  message: "",
  type: "info",
  audience: "All Platform Users",
  startDate: "2026-10-27",
  endDate: "2026-11-10",
  status: "Active",
  pinned: false,
  dismissible: true,
  ctaText: "",
  ctaUrl: "",
};

function Announcements() {
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [viewMode, setViewMode] = useState("table"); // "table" | "cards"
  const [density, setDensity] = useState("standard");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [audienceFilter, setAudienceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "views" | "clicks" | "urgency"
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [modalPreviewDevice, setModalPreviewDevice] = useState("desktop"); // "desktop" | "mobile"

  // Direct Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewAnnouncement, setPreviewAnnouncement] = useState(null);

  // Top Live Platform Simulation Banner
  const [activePreviewId, setActivePreviewId] = useState("ANN-101");
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Find current broadcast for top live preview
  const activeAnnouncements = useMemo(
    () => announcements.filter((a) => a.status === "Active"),
    [announcements]
  );

  const currentPreviewAnnouncement = useMemo(() => {
    return (
      announcements.find((a) => a.id === activePreviewId) ||
      activeAnnouncements[0] ||
      announcements[0]
    );
  }, [announcements, activePreviewId, activeAnnouncements]);

  // Telemetry Calculations
  const totalViews = useMemo(
    () => announcements.reduce((acc, a) => acc + (a.views || 0), 0),
    [announcements]
  );
  const totalClicks = useMemo(
    () => announcements.reduce((acc, a) => acc + (a.clicks || 0), 0),
    [announcements]
  );
  const activeCount = useMemo(
    () => announcements.filter((a) => a.status === "Active").length,
    [announcements]
  );
  const scheduledCount = useMemo(
    () => announcements.filter((a) => a.status === "Scheduled").length,
    [announcements]
  );
  const overallCtr = useMemo(() => {
    if (totalViews === 0) return "0.0%";
    return `${((totalClicks / totalViews) * 100).toFixed(1)}%`;
  }, [totalViews, totalClicks]);

  // Filtering & Sorting
  const filteredAnnouncements = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = announcements.filter((a) => {
      const matchSearch =
        !q ||
        a.id.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.message.toLowerCase().includes(q) ||
        a.audience.toLowerCase().includes(q) ||
        (a.ctaText && a.ctaText.toLowerCase().includes(q));

      const matchType =
        typeFilter === "All" || a.type.toLowerCase() === typeFilter.toLowerCase();
      const matchStatus =
        statusFilter === "All" || a.status.toLowerCase() === statusFilter.toLowerCase();
      const matchAudience =
        audienceFilter === "All" || a.audience.toLowerCase() === audienceFilter.toLowerCase();

      return matchSearch && matchType && matchStatus && matchAudience;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === "views") return b.views - a.views;
      if (sortBy === "clicks") return b.clicks - a.clicks;
      if (sortBy === "urgency") {
        const weight = { emergency: 4, warning: 3, success: 2, info: 1 };
        return (weight[b.type] || 0) - (weight[a.type] || 0);
      }
      // "newest"
      return b.id.localeCompare(a.id);
    });

    return list;
  }, [announcements, search, typeFilter, statusFilter, audienceFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAnnouncements.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedAnnouncements.map((a) => a.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Status & CRUD Handlers
  const handleToggleStatus = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const newStatus = a.status === "Active" ? "Paused" : "Active";
        return { ...a, status: newStatus };
      })
    );
    notify(`Status updated for announcement ${id}.`);
  };

  const handleDelete = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    if (activePreviewId === id) {
      const remaining = announcements.filter((a) => a.id !== id);
      if (remaining.length > 0) setActivePreviewId(remaining[0].id);
    }
    notify(`Announcement ${id} deleted.`);
  };

  const handleDuplicate = (ann) => {
    const copy = {
      ...ann,
      id: `ANN-${Date.now().toString().slice(-3)}`,
      title: `${ann.title} (Copy)`,
      status: "Paused",
      views: 0,
      clicks: 0,
    };
    setAnnouncements((prev) => [copy, ...prev]);
    notify(`Duplicated announcement as "${copy.title}".`);
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData({
      ...DEFAULT_FORM_DATA,
      id: `ANN-${Date.now().toString().slice(-3)}`,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (ann) => {
    setModalMode("edit");
    setFormData({
      id: ann.id,
      title: ann.title || "",
      message: ann.message || "",
      type: ann.type || "info",
      audience: ann.audience || "All Platform Users",
      startDate: ann.startDate || "2026-10-27",
      endDate: ann.endDate || "2026-11-10",
      status: ann.status || "Active",
      pinned: Boolean(ann.pinned),
      dismissible: ann.dismissible !== false,
      ctaText: ann.ctaText || "",
      ctaUrl: ann.ctaUrl || "",
    });
    setModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (modalMode === "create") {
      const newAnn = {
        id: formData.id || `ANN-${Date.now().toString().slice(-3)}`,
        title: formData.title.trim(),
        message: formData.message.trim(),
        type: formData.type,
        audience: formData.audience,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate,
        pinned: formData.pinned,
        dismissible: formData.dismissible,
        ctaText: formData.ctaText?.trim() || "",
        ctaUrl: formData.ctaUrl?.trim() || "",
        views: 0,
        clicks: 0,
      };
      setAnnouncements((prev) => [newAnn, ...prev]);
      setActivePreviewId(newAnn.id);
      setIsBannerDismissed(false);
      notify(`Announcement "${newAnn.title}" published successfully.`);
    } else {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === formData.id ? { ...a, ...formData } : a))
      );
      notify(`Announcement "${formData.title}" updated.`);
    }

    setModalOpen(false);
  };

  // Batch actions
  const handleBatchPause = () => {
    setAnnouncements((prev) =>
      prev.map((a) => (selectedIds.has(a.id) ? { ...a, status: "Paused" } : a))
    );
    notify(`Paused ${selectedIds.size} announcements.`);
    setSelectedIds(new Set());
  };

  const handleBatchActivate = () => {
    setAnnouncements((prev) =>
      prev.map((a) => (selectedIds.has(a.id) ? { ...a, status: "Active" } : a))
    );
    notify(`Activated ${selectedIds.size} announcements.`);
    setSelectedIds(new Set());
  };

  const handleBatchDelete = () => {
    setAnnouncements((prev) => prev.filter((a) => !selectedIds.has(a.id)));
    notify(`Deleted ${selectedIds.size} announcements.`);
    setSelectedIds(new Set());
  };

  // CSV Export
  const handleExportCSV = () => {
    const target =
      selectedIds.size > 0
        ? announcements.filter((a) => selectedIds.has(a.id))
        : filteredAnnouncements;

    const headers = [
      "Notice ID",
      "Title",
      "Type",
      "Audience Target",
      "Start Date",
      "End Date",
      "Views",
      "Clicks",
      "Status",
      "CTA Button",
      "CTA Link",
    ];

    const rows = target.map((a) => [
      a.id,
      a.title,
      a.type,
      a.audience,
      a.startDate,
      a.endDate,
      a.views,
      a.clicks || 0,
      a.status,
      a.ctaText || "None",
      a.ctaUrl || "#",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers, ...rows]
        .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `TeamFlow_Broadcast_Announcements_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify(`Exported ${target.length} announcement records.`);
  };

  // Preview trigger: Open direct preview modal right here on screen
  const handleOpenPreview = (ann) => {
    setPreviewAnnouncement(ann);
    setActivePreviewId(ann.id);
    setIsBannerDismissed(false);
    setPreviewModalOpen(true);
  };

  // Helper for type icons
  const renderTypeIcon = (type, size = 16) => {
    switch (type) {
      case "emergency":
        return <ShieldAlert size={size} />;
      case "warning":
        return <AlertTriangle size={size} />;
      case "success":
        return <CheckCircle2 size={size} />;
      default:
        return <Megaphone size={size} />;
    }
  };

  return (
    <div className="sa-page-container sa-announcements-page">
      {/* 1. Master Header Panel */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>Platform Announcements &amp; Broadcast Center</h1>
          <p className="sap-header-subtitle">
            Publish real-time banner alerts, scheduled maintenance windows, emergency compliance notices, and product updates across tenant workspaces.
          </p>
        </div>

        <div className="sap-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={handleExportCSV}
          >
            <Download size={15} /> Export Directory
          </button>
          <button
            type="button"
            className="sa-btn sa-btn-primary"
            onClick={handleOpenCreate}
          >
            <Plus size={16} /> Create Announcement
          </button>
        </div>
      </section>

      {/* 2. LIVE PLATFORM BROADCAST DEMONSTRATION SECTION */}
      <section className="ann-live-preview-section">
        <div className="ann-live-preview-header">
          <div className="ann-live-preview-badge-row">
            <div className="ann-live-preview-badge">
              <span className="ann-pulse-dot" />
              <span>Live Platform Banner Preview</span>
            </div>
            <span className="ann-live-preview-hint">
              Real-time demonstration of how active announcements render at the top of all tenant workspaces.
            </span>
          </div>

          <div className="ann-preview-switcher-wrap">
            <span className="ann-preview-switcher-label">Previewing Broadcast:</span>
            <select
              className="ann-preview-select"
              value={activePreviewId}
              onChange={(e) => {
                setActivePreviewId(e.target.value);
                setIsBannerDismissed(false);
              }}
            >
              {announcements.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.id} — {a.title.slice(0, 36)}... ({a.type.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* The Live Interactive Broadcast Banner */}
        {isBannerDismissed ? (
          <div className="ann-dismissed-notice">
            <span>
              ℹ️ Simulated Banner Dismissed by User (Stored in Local Session Storage).
            </span>
            <button
              type="button"
              className="sa-btn sa-btn-secondary sa-btn-sm"
              onClick={() => setIsBannerDismissed(false)}
            >
              <RefreshCw size={12} /> Restore Live Banner
            </button>
          </div>
        ) : currentPreviewAnnouncement ? (
          <div
            className={`ann-broadcast-banner ${currentPreviewAnnouncement.type}`}
            role="alert"
          >
            <div className="ann-banner-left-content">
              <div className="ann-banner-icon-pill">
                {renderTypeIcon(currentPreviewAnnouncement.type, 18)}
              </div>

              <div className="ann-banner-text-wrap">
                <div className="ann-banner-headline-row">
                  <span className="ann-banner-badge">
                    {currentPreviewAnnouncement.type.toUpperCase()}
                  </span>
                  {currentPreviewAnnouncement.pinned && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: 4,
                        background: "rgba(0, 0, 0, 0.12)",
                      }}
                    >
                      <Pin size={10} /> PINNED
                    </span>
                  )}
                  <h4 className="ann-banner-title">
                    {currentPreviewAnnouncement.title}
                  </h4>
                </div>
                <p className="ann-banner-message">
                  {currentPreviewAnnouncement.message}
                </p>
              </div>
            </div>

            <div className="ann-banner-right-actions">
              {currentPreviewAnnouncement.ctaText && (
                <button
                  type="button"
                  className="ann-banner-cta-btn"
                  onClick={() =>
                    notify(
                      `Test Click: CTA Action "${currentPreviewAnnouncement.ctaText}" invoked.`
                    )
                  }
                >
                  {currentPreviewAnnouncement.ctaText}
                  <ExternalLink size={12} />
                </button>
              )}

              {currentPreviewAnnouncement.dismissible && (
                <button
                  type="button"
                  className="ann-banner-close-btn"
                  title="Dismiss Announcement (Simulate user closing banner)"
                  onClick={() => setIsBannerDismissed(true)}
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        ) : null}
      </section>

      {/* 3. Telemetry KPI Grid */}
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <Megaphone size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Active Broadcasts</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{activeCount}</span>
              <span className="sa-kpi-trend positive">Live Now</span>
            </div>
            <span className="sa-kpi-subtitle">Displaying across tenant headers</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <Eye size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Total Impressions</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">
                {totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews}
              </span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 24%
              </span>
            </div>
            <span className="sa-kpi-subtitle">Unique confirmed impressions</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box sky">
            <MousePointerClick size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Interaction CTR</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{overallCtr}</span>
              <span className="sa-kpi-trend positive">
                {totalClicks.toLocaleString()} Clicks
              </span>
            </div>
            <span className="sa-kpi-subtitle">Click-through engagement</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <CalendarDays size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Scheduled Notices</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{scheduledCount}</span>
              <span className="sa-kpi-trend positive">In Queue</span>
            </div>
            <span className="sa-kpi-subtitle">Maintenance &amp; 2FA alerts</span>
          </div>
        </article>
      </section>

      {/* Floating Action Toast */}
      {toast && (
        <div className="sa-toast-banner">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* 4. The Master Table / Cards Card */}
      <section className="sap-table-card">
        {/* Multi-Selection Batch Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="sap-batch-banner">
            <span>
              <strong>{selectedIds.size}</strong> announcements selected
            </span>
            <div className="sap-batch-actions">
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={handleBatchActivate}
              >
                <Unlock size={13} /> Publish Selected
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={handleBatchPause}
              >
                <Lock size={13} /> Pause Selected
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={handleExportCSV}
              >
                <Download size={13} /> Export Selected
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                style={{ color: "#ef4444" }}
                onClick={handleBatchDelete}
              >
                <Trash2 size={13} /> Delete Selected
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-sm"
                style={{ background: "transparent", color: "inherit", border: 0 }}
                onClick={() => setSelectedIds(new Set())}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Toolbar & Filter Bar */}
        <div className="sap-toolbar">
          <div className="sap-toolbar-left">
            <div className="sap-search-input">
              <Search size={15} style={{ color: "var(--sa-text-muted)" }} />
              <input
                type="text"
                placeholder="Search announcement title, message, audience, ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  style={{ background: "none", border: 0, padding: 0, cursor: "pointer", color: "var(--sa-text-muted)" }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <select
              className="sap-filter-select"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Type: All Types</option>
              <option value="info">Info / General Notice</option>
              <option value="warning">Maintenance / Warning</option>
              <option value="emergency">Emergency / Security</option>
              <option value="success">Feature Release / Success</option>
            </select>

            <select
              className="sap-filter-select"
              value={audienceFilter}
              onChange={(e) => {
                setAudienceFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Audience: All Audiences</option>
              <option value="All Platform Users">All Platform Users</option>
              <option value="All Organizations">All Organizations</option>
              <option value="Super Admins & Admins">Super Admins &amp; Admins Only</option>
              <option value="Tenant Admins & Billing">Tenant Admins &amp; Billing</option>
            </select>

            <select
              className="sap-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Status: All Statuses</option>
              <option value="Active">Active Broadcast</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Paused">Paused</option>
            </select>

            <select
              className="sap-filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              title="Sort announcements"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="views">Sort: Most Impressions</option>
              <option value="clicks">Sort: Most Clicks</option>
              <option value="urgency">Sort: Highest Urgency</option>
            </select>
          </div>

          <div className="sap-toolbar-right">
            {/* View Mode Switcher: Table vs Cards */}
            <div className="sa-view-switcher">
              <button
                type="button"
                className={`sa-view-btn ${viewMode === "table" ? "is-active" : ""}`}
                onClick={() => setViewMode("table")}
                title="SaaS Table Master View"
              >
                <TableIcon size={14} /> Table
              </button>
              <button
                type="button"
                className={`sa-view-btn ${viewMode === "cards" ? "is-active" : ""}`}
                onClick={() => setViewMode("cards")}
                title="Banner Cards Gallery View"
              >
                <Grid size={14} /> Cards
              </button>
            </div>

            {/* Density Switcher */}
            {viewMode === "table" && (
              <button
                type="button"
                className="sap-icon-btn"
                onClick={() => setDensity((d) => (d === "standard" ? "compact" : "standard"))}
                title={`Switch density (currently ${density})`}
              >
                <SlidersHorizontal size={15} />
              </button>
            )}

            {/* Reset Filters */}
            <button
              type="button"
              className="sap-icon-btn"
              onClick={() => {
                setSearch("");
                setTypeFilter("All");
                setStatusFilter("All");
                setAudienceFilter("All");
                setSortBy("newest");
                setPage(1);
              }}
              title="Reset all filters"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* 5. Main Content: Table or Cards */}
        {viewMode === "table" ? (
          <div className="sap-table-wrapper">
            <table className={`sap-grid is-${density}`}>
              <thead>
                <tr>
                  <th style={{ width: 38, textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={
                        paginatedAnnouncements.length > 0 &&
                        paginatedAnnouncements.every((a) => selectedIds.has(a.id))
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th style={{ width: 110 }}>Notice ID</th>
                  <th style={{ minWidth: 260 }}>Announcement Headline &amp; Message</th>
                  <th style={{ width: 130 }}>Urgency</th>
                  <th style={{ width: 170 }}>Audience Target</th>
                  <th style={{ width: 160 }}>Active Window</th>
                  <th style={{ width: 130 }}>Impressions / CTR</th>
                  <th style={{ width: 110 }}>Status</th>
                  <th style={{ textAlign: "right", width: 160 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAnnouncements.map((ann) => {
                  const isSelected = selectedIds.has(ann.id);
                  const isCurrentLivePreview = activePreviewId === ann.id;
                  const ctr =
                    ann.views > 0
                      ? `${(((ann.clicks || 0) / ann.views) * 100).toFixed(1)}%`
                      : "0.0%";

                  return (
                    <tr
                      key={ann.id}
                      className={isSelected ? "is-selected" : ""}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleOpenPreview(ann)}
                    >
                      <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(ann.id)}
                        />
                      </td>

                      {/* ID with Pinned indicator */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span className="sap-id-cell">{ann.id}</span>
                          {ann.pinned && (
                            <span title="Pinned Announcement" style={{ color: "var(--sa-primary, #3b66ff)" }}>
                              <Pin size={11} />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Headline & Details */}
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 380 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <strong style={{ fontSize: "13px", color: "var(--sa-text-main)" }}>
                              {ann.title}
                            </strong>
                            {isCurrentLivePreview && (
                              <span
                                style={{
                                  fontSize: 9.5,
                                  fontWeight: 700,
                                  color: "#059669",
                                  background: "rgba(16, 185, 129, 0.12)",
                                  padding: "1px 5px",
                                  borderRadius: 4,
                                }}
                              >
                                Previewing
                              </span>
                            )}
                          </div>
                          <span
                            style={{
                              color: "var(--sa-text-muted)",
                              fontSize: "11.5px",
                              lineHeight: 1.4,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={ann.message}
                          >
                            {ann.message}
                          </span>
                        </div>
                      </td>

                      {/* Urgency Badge with Icon */}
                      <td>
                        <span className={`ann-urgency-cell ${ann.type}`}>
                          {renderTypeIcon(ann.type, 12)}
                          {ann.type}
                        </span>
                      </td>

                      {/* Audience */}
                      <td>
                        <span className="ann-audience-pill">
                          <Users size={11} />
                          {ann.audience}
                        </span>
                      </td>

                      {/* Active Window */}
                      <td>
                        <div className="ann-window-badge">
                          <span className="ann-window-dates">{ann.startDate}</span>
                          <span className="ann-window-remaining">
                            <Clock size={10} /> until {ann.endDate}
                          </span>
                        </div>
                      </td>

                      {/* Telemetry Impressions & CTR */}
                      <td>
                        <div className="ann-telemetry-col">
                          <span className="ann-telemetry-views">
                            {ann.views.toLocaleString()} views
                          </span>
                          <span className="ann-telemetry-ctr">
                            {ann.clicks || 0} clicks ({ctr})
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`sap-status-pill ${
                            ann.status === "Active"
                              ? "valid"
                              : ann.status === "Scheduled"
                              ? "pro"
                              : "locked"
                          }`}
                        >
                          <span className="sap-status-dot" />
                          {ann.status === "Active" ? "Live" : ann.status}
                        </span>
                      </td>

                      {/* Colored Action Buttons */}
                      <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                        <div className="ann-action-group">
                          <button
                            type="button"
                            className="ann-action-btn btn-preview"
                            title="Direct Preview Announcement"
                            onClick={() => handleOpenPreview(ann)}
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            type="button"
                            className="ann-action-btn btn-edit"
                            title="Edit Announcement"
                            onClick={() => handleOpenEdit(ann)}
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            type="button"
                            className="ann-action-btn btn-duplicate"
                            title="Duplicate Announcement"
                            onClick={() => handleDuplicate(ann)}
                          >
                            <Copy size={14} />
                          </button>

                          <button
                            type="button"
                            className={`ann-action-btn btn-toggle ${
                              ann.status === "Active" ? "is-pause" : "is-publish"
                            }`}
                            title={ann.status === "Active" ? "Pause Banner" : "Publish Banner"}
                            onClick={() => handleToggleStatus(ann.id)}
                          >
                            {ann.status === "Active" ? <Lock size={14} /> : <Unlock size={14} />}
                          </button>

                          <button
                            type="button"
                            className="ann-action-btn btn-delete"
                            title="Delete Announcement"
                            onClick={() => handleDelete(ann.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {paginatedAnnouncements.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: 36, color: "var(--sa-text-muted)" }}>
                      No announcements match your search query or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Cards Gallery View */
          <div style={{ padding: 20 }}>
            <div className="sa-announcements-stack">
              {paginatedAnnouncements.map((ann) => {
                const ctr =
                  ann.views > 0
                    ? `${(((ann.clicks || 0) / ann.views) * 100).toFixed(1)}%`
                    : "0.0%";

                return (
                  <article key={ann.id} className={`sa-ann-banner-card ${ann.type}`}>
                    {/* Top Accent Stripe */}
                    <div className={`sa-ann-card-top-bar ${ann.type}`}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {renderTypeIcon(ann.type, 15)}
                        <span>{ann.type.toUpperCase()} BROADCAST</span>
                        <span style={{ opacity: 0.5 }}>•</span>
                        <span style={{ fontFamily: "monospace", fontSize: 11 }}>{ann.id}</span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {ann.pinned && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              background: "rgba(0,0,0,0.1)",
                              padding: "2px 7px",
                              borderRadius: 4,
                              fontSize: 10.5,
                            }}
                          >
                            <Pin size={11} /> Pinned
                          </span>
                        )}
                        <span
                          className={`sap-status-pill ${
                            ann.status === "Active" ? "valid" : ann.status === "Scheduled" ? "pro" : "locked"
                          }`}
                        >
                          <span className="sap-status-dot" />
                          {ann.status}
                        </span>
                      </div>
                    </div>

                    {/* Main Card Body */}
                    <div className="sa-ann-card-main-body">
                      <h3 className="sa-ann-card-title">{ann.title}</h3>
                      <p className="sa-ann-card-message">{ann.message}</p>

                      {/* CTA Button If Configured */}
                      {ann.ctaText && (
                        <div className="sa-ann-card-cta-row">
                          <button
                            type="button"
                            className="ann-banner-cta-btn"
                            onClick={() => notify(`Clicked preview CTA: "${ann.ctaText}"`)}
                          >
                            {ann.ctaText}
                            <ExternalLink size={12} />
                          </button>
                        </div>
                      )}

                      {/* Meta Information Bar */}
                      <div className="sa-ann-card-meta-row">
                        <div className="sa-ann-card-meta-item">
                          <Users size={12} />
                          <span>Audience: <strong>{ann.audience}</strong></span>
                        </div>
                        <div className="sa-ann-card-meta-item">
                          <CalendarDays size={12} />
                          <span>Schedule: {ann.startDate} to {ann.endDate}</span>
                        </div>
                        <div className="sa-ann-card-meta-item">
                          <Eye size={12} />
                          <span><strong>{ann.views.toLocaleString()}</strong> views</span>
                        </div>
                        <div className="sa-ann-card-meta-item">
                          <MousePointerClick size={12} />
                          <span><strong>{ann.clicks || 0}</strong> clicks ({ctr})</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions with Vibrant Colors */}
                    <div className="sa-ann-card-footer-actions">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                          type="button"
                          className="ann-card-action-btn btn-preview"
                          onClick={() => handleOpenPreview(ann)}
                        >
                          <Eye size={13} /> Direct Preview
                        </button>
                        <button
                          type="button"
                          className="ann-card-action-btn btn-edit"
                          onClick={() => handleOpenEdit(ann)}
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          className="ann-card-action-btn btn-duplicate"
                          onClick={() => handleDuplicate(ann)}
                        >
                          <Copy size={13} /> Duplicate
                        </button>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                          type="button"
                          className={`ann-card-action-btn btn-toggle ${
                            ann.status === "Active" ? "is-pause" : "is-publish"
                          }`}
                          onClick={() => handleToggleStatus(ann.id)}
                        >
                          {ann.status === "Active" ? (
                            <>
                              <Lock size={12} /> Pause Banner
                            </>
                          ) : (
                            <>
                              <Unlock size={12} /> Publish Live
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          className="ann-card-action-btn btn-delete"
                          onClick={() => handleDelete(ann.id)}
                          title="Delete Announcement"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}

              {paginatedAnnouncements.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "var(--sa-text-muted)" }}>
                  No announcements match your search query or filters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. The Master Footer Bar */}
        <div className="sap-footer-bar">
          <div className="sap-footer-counts" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="sap-counter">
              Showing{" "}
              <strong>
                {filteredAnnouncements.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(currentPage * pageSize, filteredAnnouncements.length)}
              </strong>{" "}
              of <strong>{filteredAnnouncements.length}</strong> announcements
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--sa-text-muted)" }}>
              <span>Rows per page:</span>
              <select
                className="sap-filter-select"
                style={{ padding: "3px 6px", fontSize: 12, height: 26 }}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="sap-pagination">
            <button
              type="button"
              className="sap-page-btn"
              disabled={currentPage <= 1}
              onClick={() => setPage(1)}
              title="First Page"
            >
              <ChevronsLeft size={15} />
            </button>
            <button
              type="button"
              className="sap-page-btn"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              title="Previous Page"
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
              .map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`sap-page-btn ${p === currentPage ? "is-active" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}

            <button
              type="button"
              className="sap-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              title="Next Page"
            >
              <ChevronRight size={15} />
            </button>
            <button
              type="button"
              className="sap-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(totalPages)}
              title="Last Page"
            >
              <ChevronsRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Direct Announcement Preview Modal (Opens immediately on screen) */}
      {previewModalOpen && previewAnnouncement && typeof document !== "undefined" && createPortal(
        <div className="sa-modal-backdrop" onClick={() => setPreviewModalOpen(false)}>
          <div className="sa-modal-content ann-direct-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sa-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      previewAnnouncement.type === "emergency"
                        ? "#fee2e2"
                        : previewAnnouncement.type === "warning"
                        ? "#fef3c7"
                        : previewAnnouncement.type === "success"
                        ? "#d1fae5"
                        : "#dbeafe",
                    color:
                      previewAnnouncement.type === "emergency"
                        ? "#b91c1c"
                        : previewAnnouncement.type === "warning"
                        ? "#b45309"
                        : previewAnnouncement.type === "success"
                        ? "#047857"
                        : "#1d4ed8",
                  }}
                >
                  {renderTypeIcon(previewAnnouncement.type, 18)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>
                    Direct Announcement Preview: {previewAnnouncement.id}
                  </h3>
                  <span style={{ fontSize: 12, color: "var(--sa-text-muted)" }}>
                    Exact representation of how this broadcast notice appears to targeted users.
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setPreviewModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body" style={{ padding: 22 }}>
              {/* Section label */}
              <div style={{ fontSize: 11, fontWeight: 750, letterSpacing: "0.6px", textTransform: "uppercase", color: "var(--sa-text-muted)", marginBottom: 10 }}>
                Simulated Workspace Header Banner:
              </div>

              {/* The actual broadcast banner rendering */}
              <div className={`ann-broadcast-banner ${previewAnnouncement.type}`} style={{ margin: "4px 0 16px" }}>
                <div className="ann-banner-left-content">
                  <div className="ann-banner-icon-pill">
                    {renderTypeIcon(previewAnnouncement.type, 18)}
                  </div>

                  <div className="ann-banner-text-wrap">
                    <div className="ann-banner-headline-row">
                      <span className="ann-banner-badge">
                        {previewAnnouncement.type.toUpperCase()}
                      </span>
                      {previewAnnouncement.pinned && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            fontSize: 10,
                            fontWeight: 750,
                            padding: "1px 5px",
                            borderRadius: 4,
                            background: "rgba(0, 0, 0, 0.12)",
                          }}
                        >
                          <Pin size={10} /> PINNED
                        </span>
                      )}
                      <h4 className="ann-banner-title">
                        {previewAnnouncement.title}
                      </h4>
                    </div>
                    <p className="ann-banner-message">
                      {previewAnnouncement.message}
                    </p>
                  </div>
                </div>

                <div className="ann-banner-right-actions">
                  {previewAnnouncement.ctaText && (
                    <button
                      type="button"
                      className="ann-banner-cta-btn"
                      onClick={() =>
                        notify(`Test Click: CTA Action "${previewAnnouncement.ctaText}" invoked.`)
                      }
                    >
                      {previewAnnouncement.ctaText}
                      <ExternalLink size={12} />
                    </button>
                  )}
                  {previewAnnouncement.dismissible && (
                    <span className="ann-banner-close-btn" title="Dismissible banner">
                      <X size={15} />
                    </span>
                  )}
                </div>
              </div>

              {/* Detailed Telemetry & Targeting Grid */}
              <div className="ann-preview-detail-grid">
                <div className="ann-preview-detail-item">
                  <span className="ann-preview-detail-label">Notice Status</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <span className={`sap-status-pill ${previewAnnouncement.status === "Active" ? "valid" : previewAnnouncement.status === "Scheduled" ? "pro" : "locked"}`}>
                      <span className="sap-status-dot" />
                      {previewAnnouncement.status}
                    </span>
                  </div>
                </div>

                <div className="ann-preview-detail-item">
                  <span className="ann-preview-detail-label">Audience Target</span>
                  <span className="ann-preview-detail-val" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Users size={13} style={{ color: "var(--sa-primary, #3b66ff)" }} />
                    {previewAnnouncement.audience}
                  </span>
                </div>

                <div className="ann-preview-detail-item">
                  <span className="ann-preview-detail-label">Schedule Window</span>
                  <span className="ann-preview-detail-val">
                    {previewAnnouncement.startDate} → {previewAnnouncement.endDate}
                  </span>
                </div>

                <div className="ann-preview-detail-item">
                  <span className="ann-preview-detail-label">Impressions &amp; CTR</span>
                  <span className="ann-preview-detail-val">
                    {previewAnnouncement.views.toLocaleString()} views · {previewAnnouncement.clicks || 0} clicks (
                    {previewAnnouncement.views > 0
                      ? `${(((previewAnnouncement.clicks || 0) / previewAnnouncement.views) * 100).toFixed(1)}%`
                      : "0.0%"} CTR)
                  </span>
                </div>

                <div className="ann-preview-detail-item">
                  <span className="ann-preview-detail-label">Dismissible By Users</span>
                  <span className="ann-preview-detail-val">
                    {previewAnnouncement.dismissible !== false ? "✓ Yes (Can be closed)" : "✗ No (Persistent alert)"}
                  </span>
                </div>

                <div className="ann-preview-detail-item">
                  <span className="ann-preview-detail-label">Pinned To Top</span>
                  <span className="ann-preview-detail-val">
                    {previewAnnouncement.pinned ? "✓ Yes (Pinned to top)" : "Standard Banner"}
                  </span>
                </div>
              </div>
            </div>

            <div className="sa-modal-footer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary"
                  onClick={() => {
                    setPreviewModalOpen(false);
                    handleOpenEdit(previewAnnouncement);
                  }}
                >
                  <Pencil size={14} /> Edit Announcement
                </button>
                <button
                  type="button"
                  className={`sa-btn ${previewAnnouncement.status === "Active" ? "sa-btn-secondary" : "sa-btn-primary"}`}
                  onClick={() => {
                    handleToggleStatus(previewAnnouncement.id);
                    setPreviewAnnouncement(prev => ({
                      ...prev,
                      status: prev.status === "Active" ? "Paused" : "Active"
                    }));
                  }}
                >
                  {previewAnnouncement.status === "Active" ? <><Lock size={14} /> Pause Banner</> : <><Unlock size={14} /> Publish Live</>}
                </button>
              </div>

              <button
                type="button"
                className="sa-btn sa-btn-primary"
                onClick={() => setPreviewModalOpen(false)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 8. Revamped Create & Edit Announcement Modal with Full-Width Live Banner Showcase */}
      {modalOpen && typeof document !== "undefined" && createPortal(
        <div className="sa-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="sa-modal-content ann-modal-content-revamped" onClick={(e) => e.stopPropagation()}>
            <div className="sa-modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: 16 }}>
                  {modalMode === "create" ? "Create Platform Announcement" : `Edit Announcement: ${formData.id}`}
                </h3>
                <span style={{ fontSize: 12, color: "var(--sa-text-muted)" }}>
                  Configure broadcast parameters below. The banner preview updates in real time at the top.
                </span>
              </div>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div
                className="sa-modal-body"
                style={{
                  padding: "18px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  maxHeight: "76vh",
                  overflowY: "auto",
                }}
              >
                {/* Full-Width Real-Time Banner Showcase (No horizontal cramping) */}
                <div className="ann-modal-showcase-box">
                  <div className="ann-modal-showcase-header">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="ann-window-dots">
                        <span className="ann-window-dot red" />
                        <span className="ann-window-dot yellow" />
                        <span className="ann-window-dot green" />
                      </div>
                      <strong style={{ fontSize: 12.5, color: "var(--sa-text-main)", marginLeft: 4 }}>
                        Live Real-Time Banner Preview
                      </strong>
                      <span className="ann-live-sync-pill">
                        <span className="ann-pulse-dot" />
                        Live Sync
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 11.5, color: "var(--sa-text-muted)" }}>
                        Target: <strong>{formData.audience}</strong>
                      </span>

                      {/* Desktop vs Mobile Toggle */}
                      <div className="tpl-device-tabs" style={{ margin: 0 }}>
                        <button
                          type="button"
                          className={`tpl-device-tab ${modalPreviewDevice === "desktop" ? "is-active" : ""}`}
                          onClick={() => setModalPreviewDevice("desktop")}
                          title="Desktop View"
                        >
                          <Monitor size={12} />
                          <span>Desktop</span>
                        </button>
                        <button
                          type="button"
                          className={`tpl-device-tab ${modalPreviewDevice === "mobile" ? "is-active" : ""}`}
                          onClick={() => setModalPreviewDevice("mobile")}
                          title="Mobile View"
                        >
                          <Smartphone size={12} />
                          <span>Mobile</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Banner Rendering Viewport */}
                  <div className="ann-modal-showcase-viewport">
                    <div className={`ann-modal-banner-container is-${modalPreviewDevice}`}>
                      <div
                        className={`ann-broadcast-banner ${formData.type} ${
                          modalPreviewDevice === "mobile" ? "is-compact" : ""
                        }`}
                      >
                        <div className="ann-banner-left-content">
                          <div className="ann-banner-icon-pill">
                            {renderTypeIcon(formData.type, 18)}
                          </div>

                          <div className="ann-banner-text-wrap">
                            <div className="ann-banner-headline-row">
                              <span className="ann-banner-badge">
                                {formData.type.toUpperCase()}
                              </span>
                              {formData.pinned && (
                                <span className="ann-pinned-pill">
                                  <Pin size={10} /> PINNED
                                </span>
                              )}
                              <h4 className="ann-banner-title">
                                {formData.title.trim() || "Announcement Headline Preview"}
                              </h4>
                            </div>
                            <p className="ann-banner-message">
                              {formData.message.trim() ||
                                "Type your announcement message below. It will display live here in real-time."}
                            </p>
                          </div>
                        </div>

                        <div className="ann-banner-right-actions">
                          {formData.ctaText?.trim() && (
                            <span className="ann-banner-cta-btn">
                              {formData.ctaText.trim()}
                              <ExternalLink size={12} />
                            </span>
                          )}
                          {formData.dismissible && (
                            <span className="ann-banner-close-btn" title="Dismiss banner">
                              <X size={15} />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Structured 2-Column Form Fields Below Preview */}
                <div className="ann-modal-form-grid">
                  {/* Headline (Spans 2 columns) */}
                  <div className="sa-form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Announcement Headline *</label>
                    <input
                      type="text"
                      className="sa-form-input"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Scheduled Infrastructure Maintenance Window"
                      required
                    />
                  </div>

                  {/* Urgency & Audience */}
                  <div className="sa-form-group">
                    <label>Notice Urgency / Type</label>
                    <select
                      className="sa-form-select"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="info">Info / General Notice</option>
                      <option value="warning">Maintenance / Warning</option>
                      <option value="emergency">Emergency / Security Alert</option>
                      <option value="success">Feature Release / Success</option>
                    </select>
                  </div>

                  <div className="sa-form-group">
                    <label>Audience Target</label>
                    <select
                      className="sa-form-select"
                      value={formData.audience}
                      onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    >
                      <option value="All Platform Users">All Platform Users</option>
                      <option value="All Organizations">All Organizations</option>
                      <option value="Super Admins & Admins">Super Admins &amp; Admins Only</option>
                      <option value="Tenant Admins & Billing">Tenant Admins &amp; Billing</option>
                    </select>
                  </div>

                  {/* Schedule Dates */}
                  <div className="sa-form-group">
                    <label>Broadcast Start Date</label>
                    <input
                      type="date"
                      className="sa-form-input"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="sa-form-group">
                    <label>Broadcast End Date</label>
                    <input
                      type="date"
                      className="sa-form-input"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>

                  {/* Message Content (Spans 2 columns) */}
                  <div className="sa-form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Message Content *</label>
                    <textarea
                      className="sa-form-textarea"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Provide full description of the notice, timeframe, and user action required..."
                      required
                    />
                  </div>

                  {/* CTA Button Label & Link */}
                  <div className="sa-form-group">
                    <label>CTA Button Label (Optional)</label>
                    <input
                      type="text"
                      className="sa-form-input"
                      value={formData.ctaText}
                      onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                      placeholder="e.g. Migration Schedule or View System Status"
                    />
                  </div>

                  <div className="sa-form-group">
                    <label>CTA Destination Link</label>
                    <input
                      type="text"
                      className="sa-form-input"
                      value={formData.ctaUrl}
                      onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                      placeholder="e.g. https://status.teamflow.ai"
                    />
                  </div>

                  {/* Checkbox Options & Status Bar */}
                  <div className="ann-checkbox-row" style={{ gridColumn: "1 / -1" }}>
                    <label className="ann-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.dismissible}
                        onChange={(e) => setFormData({ ...formData, dismissible: e.target.checked })}
                      />
                      <span>Allow users to dismiss banner</span>
                    </label>

                    <label className="ann-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.pinned}
                        onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                      />
                      <span>Pin banner to top of workspace</span>
                    </label>

                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: "var(--sa-text-muted)" }}>Status:</span>
                      <select
                        className="sa-form-select"
                        style={{ padding: "3px 8px", fontSize: 12, height: 28 }}
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Active">Active (Publish live)</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Paused">Paused</option>
                      </select>
                    </div>
                  </div>
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
                  {modalMode === "create" ? "Publish Announcement" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default Announcements;
