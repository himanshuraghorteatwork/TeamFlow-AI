import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  LifeBuoy,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  ArrowUpRight,
  ChevronDown,
  X,
  Send,
  Eye,
  Building2,
  CalendarDays,
  User,
  ShieldAlert,
  SlidersHorizontal,
  RefreshCw,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./HelpSupport.css";

const INITIAL_TICKETS = [
  {
    id: "TKT-1092",
    org: "ABC Technologies",
    requester: "Himanshu Rao",
    email: "himanshu@abc.com",
    subject: "Unable to provision custom domain for corporate workspace",
    category: "Technical / DNS",
    priority: "High",
    status: "Open",
    createdAt: "Today, 11:20 AM",
    messages: [
      {
        sender: "Himanshu Rao",
        role: "Client Admin",
        time: "11:20 AM",
        text: "We added CNAME records to point app.abc-tech.com to TeamFlow AI, but the SSL certificate verification is stuck on pending for over 3 hours. Could you please trigger manual verification?",
      },
    ],
  },
  {
    id: "TKT-1091",
    org: "XYZ Software",
    requester: "Amit Verma",
    email: "amit@xyz.com",
    subject: "Billing inquiry: GST invoice mismatch for October renewal",
    category: "Billing & Invoices",
    priority: "Medium",
    status: "In Progress",
    createdAt: "Today, 09:45 AM",
    messages: [
      {
        sender: "Amit Verma",
        role: "Client Admin",
        time: "09:45 AM",
        text: "Our invoice INV-2024-1088 reflects our old GSTIN number instead of our updated Karnataka registration (29AABCZ5678F1Z2). Please re-issue with the corrected tax credentials.",
      },
      {
        sender: "Super Admin Support",
        role: "Support Engineer",
        time: "10:15 AM",
        text: "Hello Amit, our billing team is updating your GST registration profile. We will regenerate the tax invoice within 30 minutes.",
      },
    ],
  },
  {
    id: "TKT-1090",
    org: "Startup Labs",
    requester: "Kunal Shah",
    email: "kunal@startuplabs.io",
    subject: "Rate limit exceeded on Gemini Flash API integration",
    category: "AI Integration",
    priority: "Urgent",
    status: "Open",
    createdAt: "Yesterday, 04:30 PM",
    messages: [
      {
        sender: "Kunal Shah",
        role: "Developer",
        time: "04:30 PM",
        text: "Our test suite generated 2,000 parallel document summarization requests, triggering a 429 Too Many Requests response. Can we temporarily bump our tenant RPM ceiling?",
      },
    ],
  },
  {
    id: "TKT-1089",
    org: "NovaTech Solutions",
    requester: "Priya Nair",
    email: "priya@novatech.io",
    subject: "Enterprise SSO SAML 2.0 configuration guide request",
    category: "Security & SSO",
    priority: "Low",
    status: "Resolved",
    createdAt: "Yesterday, 02:15 PM",
    messages: [
      {
        sender: "Priya Nair",
        role: "IT Director",
        time: "02:15 PM",
        text: "We are configuring Okta SSO for 600 users. Where can we retrieve TeamFlow's Entity ID and ACS URL endpoints?",
      },
      {
        sender: "Super Admin Support",
        role: "Security Team",
        time: "02:40 PM",
        text: "Hi Priya, you can find the SAML metadata in your Organization Security settings or download the XML metadata at /auth/saml/metadata.xml.",
      },
    ],
  },
  {
    id: "TKT-1088",
    org: "DesignHub",
    requester: "Rohan Kapoor",
    email: "rohan@designhub.in",
    subject: "File upload size error when attaching 85MB video recordings",
    category: "File Storage",
    priority: "Medium",
    status: "Resolved",
    createdAt: "Oct 24, 2024",
    messages: [
      {
        sender: "Rohan Kapoor",
        role: "Lead Designer",
        time: "Oct 24",
        text: "The web app rejects video files larger than 50MB. Can our Pro tier accommodate up to 100MB per attachment?",
      },
      {
        sender: "Super Admin Support",
        role: "Tier 2 Support",
        time: "Oct 24",
        text: "Increased your workspace attachment limit to 150MB. Please refresh your browser session.",
      },
    ],
  },
  {
    id: "TKT-1087",
    org: "NextGen Solutions",
    requester: "Sana Sheikh",
    email: "sana@nextgen.com",
    subject: "Audit logs missing user invite event timestamps",
    category: "Audit Logs",
    priority: "Low",
    status: "Closed",
    createdAt: "Oct 22, 2024",
    messages: [
      {
        sender: "Sana Sheikh",
        role: "Compliance Officer",
        time: "Oct 22",
        text: "We noticed export CSVs from last Tuesday were truncated. Could you confirm timezone synchronization?",
      },
    ],
  },
];

function HelpSupport() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [density, setDensity] = useState("standard");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [toast, setToast] = useState("");

  const [pageSize, setPageSize] = useState(10);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.org.toLowerCase().includes(q) ||
        t.requester.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "All" || t.status.toLowerCase() === statusFilter.toLowerCase();
      const matchPriority =
        priorityFilter === "All" ||
        t.priority.toLowerCase() === priorityFilter.toLowerCase();
      const matchCat =
        categoryFilter === "All" ||
        t.category.toLowerCase().includes(categoryFilter.toLowerCase());

      return matchSearch && matchStatus && matchPriority && matchCat;
    });
  }, [tickets, search, statusFilter, priorityFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const metrics = useMemo(() => {
    const open = tickets.filter((t) => t.status === "Open").length;
    const inProg = tickets.filter((t) => t.status === "In Progress").length;
    const resolved = tickets.filter(
      (t) => t.status === "Resolved" || t.status === "Closed"
    ).length;
    return {
      total: tickets.length,
      open,
      inProg,
      resolved,
      resolutionRate: Math.round((resolved / tickets.length) * 100),
    };
  }, [tickets]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedTickets.map((t) => t.id)));
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

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      sender: "Himanshu (Super Admin)",
      role: "Super Admin",
      time: "Just now",
      text: replyText.trim(),
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: "In Progress",
              messages: [...t.messages, newMsg],
            }
          : t
      )
    );

    setSelectedTicket((prev) => ({
      ...prev,
      status: "In Progress",
      messages: [...prev.messages, newMsg],
    }));

    setReplyText("");
    notify(`Reply dispatched on ticket ${selectedTicket.id}. Status set to In Progress.`);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
    }
    notify(`Ticket ${id} status updated to ${newStatus}.`);
  };

  const handleExportCSV = () => {
    const headers = [
      "Ticket ID",
      "Organization",
      "Requester",
      "Email",
      "Category",
      "Priority",
      "Status",
      "Created At",
    ];

    const rows = filteredTickets.map((t) => [
      t.id,
      t.org,
      t.requester,
      t.email,
      t.category,
      t.priority,
      t.status,
      t.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers, ...rows]
        .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "teamflow_support_tickets.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("Exported support tickets spreadsheet.");
  };

  return (
    <div className="help-support-page">
      {/* 1. SAP Master Header Bar */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>Help &amp; Support Ticket Service Desk</h1>
          <p className="sap-header-subtitle">
            Enterprise customer support ticketing, SLA resolution monitoring, technical triage, and organization ticket history.
          </p>
        </div>

        <div className="sap-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={handleExportCSV}
          >
            <Download size={15} /> Export Spreadsheet
          </button>
        </div>
      </section>

      {/* 2. Top 4 Telemetry Cards */}
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <LifeBuoy size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Total Inquiries</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{metrics.total}</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> All Tiers
              </span>
            </div>
            <span className="sa-kpi-subtitle">Across 186 organizations</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <Clock size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Active Open Tickets</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{metrics.open}</span>
              <span className="sa-kpi-trend negative">Requires Action</span>
            </div>
            <span className="sa-kpi-subtitle">{metrics.inProg} currently in progress</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <CheckCircle2 size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Resolution SLA</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{metrics.resolutionRate}%</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 94.2% SLA
              </span>
            </div>
            <span className="sa-kpi-subtitle">{metrics.resolved} resolved tickets</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box purple">
            <MessageSquare size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Avg. First Response</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">14m</span>
              <span className="sa-kpi-trend positive">Optimal</span>
            </div>
            <span className="sa-kpi-subtitle">Median response under 25m</span>
          </div>
        </article>
      </section>

      {toast && (
        <div className="sa-toast-banner">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* 3. The SAP Table Card */}
      <section className="sap-table-card">
        {/* Multi-Selection Batch Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="sap-batch-banner">
            <span>
              <strong>{selectedIds.size}</strong> tickets selected
            </span>
            <div className="sap-batch-actions">
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={handleExportCSV}
              >
                <Download size={13} /> Export Selected
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
                placeholder="Search ticket ID, organization, requester, issue subject..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <select
              className="sap-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Status: All Statuses</option>
              <option value="Open">Open (Action Needed)</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              className="sap-filter-select"
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Priority: All Priorities</option>
              <option value="Urgent">Urgent Tier</option>
              <option value="High">High Tier</option>
              <option value="Medium">Medium Tier</option>
              <option value="Low">Low Tier</option>
            </select>

            <select
              className="sap-filter-select"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Category: All Categories</option>
              <option value="Technical">Technical / DNS</option>
              <option value="Billing">Billing &amp; Invoices</option>
              <option value="AI">AI Integration</option>
              <option value="Security">Security &amp; SSO</option>
              <option value="Storage">File Storage</option>
            </select>
          </div>

          <div className="sap-toolbar-right">
            {/* Density Switcher */}
            <button
              type="button"
              className="sap-icon-btn"
              onClick={() => setDensity((d) => (d === "standard" ? "compact" : "standard"))}
              title={`Switch density (currently ${density})`}
            >
              <SlidersHorizontal size={15} />
            </button>

            {/* Reset Filters */}
            <button
              type="button"
              className="sap-icon-btn"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setPriorityFilter("All");
                setCategoryFilter("All");
                setPage(1);
              }}
              title="Reset all filters"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* 4. The SAP Table Data Grid */}
        <div className="sap-table-wrapper">
          <table className={`sap-grid is-${density}`}>
            <thead>
              <tr>
                <th style={{ width: 38, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      paginatedTickets.length > 0 &&
                      paginatedTickets.every((t) => selectedIds.has(t.id))
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ width: 110 }}>Ticket ID</th>
                <th>Organization &amp; Requester</th>
                <th>Subject &amp; Issue Summary</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Created At</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.map((t) => {
                const isSelected = selectedIds.has(t.id);
                return (
                  <tr key={t.id} className={isSelected ? "is-selected" : ""}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(t.id)}
                      />
                    </td>
                    <td>
                      <span className="sap-id-cell">{t.id}</span>
                    </td>
                    <td>
                      <div className="sap-user-badge">
                        <div className="sap-avatar-chip">
                          <Building2 size={15} />
                        </div>
                        <div className="sap-user-info">
                          <strong className="sap-user-name">{t.org}</strong>
                          <span className="sap-user-email">
                            {t.requester} · {t.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth: 320 }}>
                      <strong style={{ fontSize: "13px", color: "var(--sa-text-primary)", display: "block" }}>
                        {t.subject}
                      </strong>
                      <span
                        style={{
                          fontSize: "11.5px",
                          color: "var(--sa-text-muted)",
                          display: "block",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {t.messages[0]?.text}
                      </span>
                    </td>
                    <td>
                      <span className="sap-role-badge role-member">
                        {t.category}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`sap-role-badge ${
                          t.priority === "Urgent"
                            ? "role-admin"
                            : t.priority === "High"
                            ? "role-manager"
                            : "role-member"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td style={{ color: "var(--sa-text-muted)", fontSize: 12 }}>
                      {t.createdAt}
                    </td>
                    <td>
                      <span
                        className={`sap-status-pill ${
                          t.status === "Open"
                            ? "is-suspended"
                            : t.status === "In Progress"
                            ? "is-pending"
                            : "is-active"
                        }`}
                      >
                        <span className="sap-status-dot" />
                        {t.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="sap-action-group">
                        <button
                          type="button"
                          className="sap-icon-btn"
                          onClick={() => setSelectedTicket(t)}
                          title="View Conversation Thread"
                        >
                          <Eye size={15} />
                        </button>
                        {t.status !== "Resolved" && (
                          <button
                            type="button"
                            className="sap-icon-btn is-success"
                            onClick={() => handleUpdateStatus(t.id, "Resolved")}
                            title="Mark as Resolved"
                          >
                            <CheckCircle2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedTickets.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "40px" }}>
                    No support tickets match your search query or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 5. The SAP Footer Bar */}
        <div className="sap-footer-bar">
          <div className="sap-footer-counts" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="sap-counter">
              Showing{" "}
              <strong>
                {filteredTickets.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(currentPage * pageSize, filteredTickets.length)}
              </strong>{" "}
              of <strong>{filteredTickets.length}</strong> inquiries
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
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
            <span className="sap-page-indicator">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
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

      {/* 6. Ticket Conversation & Reply Modal */}
      {selectedTicket &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="sa-modal-backdrop" onClick={() => setSelectedTicket(null)}>
            <div
              className="sa-modal-content"
              style={{ maxWidth: 650 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sa-modal-header">
                <div>
                  <h3 style={{ margin: "0 0 4px" }}>
                    {selectedTicket.id}: {selectedTicket.subject}
                  </h3>
                  <span style={{ fontSize: 11.5, color: "var(--sa-text-muted)" }}>
                    {selectedTicket.org} · Requester: {selectedTicket.requester} (
                    {selectedTicket.email})
                  </span>
                </div>
                <button
                  type="button"
                  className="sa-modal-close"
                  onClick={() => setSelectedTicket(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="sa-modal-body sa-ticket-modal-body">
                <div className="sa-ticket-tags-row">
                  <span className="sa-pill sa-pill-neutral">
                    Category: {selectedTicket.category}
                  </span>
                  <span
                    className={`sa-pill ${
                      selectedTicket.priority === "Urgent"
                        ? "sa-pill-danger"
                        : "sa-pill-info"
                    }`}
                  >
                    Priority: {selectedTicket.priority}
                  </span>
                  <span
                    className={`sa-pill ${
                      selectedTicket.status === "Open"
                        ? "sa-pill-warning"
                        : selectedTicket.status === "In Progress"
                        ? "sa-pill-info"
                        : "sa-pill-success"
                    }`}
                  >
                    Status: {selectedTicket.status}
                  </span>
                </div>

                {/* Message Thread */}
                <div className="sa-ticket-thread">
                  {selectedTicket.messages.map((m, i) => (
                    <div
                      key={i}
                      className={`sa-thread-bubble ${
                        m.role.includes("Super Admin") || m.role.includes("Support")
                          ? "admin-bubble"
                          : "user-bubble"
                      }`}
                    >
                      <div className="sa-bubble-header">
                        <strong>{m.sender}</strong>
                        <span className="sa-bubble-time">{m.time}</span>
                      </div>
                      <p className="sa-bubble-text">{m.text}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Box */}
                <form onSubmit={handleSendReply} className="sa-ticket-reply-form">
                  <textarea
                    rows={3}
                    className="sa-form-textarea"
                    placeholder="Type official enterprise response to organization..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                  />

                  <div className="sa-reply-actions-row">
                    <div style={{ display: "flex", gap: "8px" }}>
                      {selectedTicket.status !== "Resolved" && (
                        <button
                          type="button"
                          className="sa-btn sa-btn-secondary sa-btn-sm"
                          style={{ color: "#10b981" }}
                          onClick={() => handleUpdateStatus(selectedTicket.id, "Resolved")}
                        >
                          <CheckCircle2 size={13} /> Mark Resolved
                        </button>
                      )}
                      {selectedTicket.status === "Resolved" && (
                        <button
                          type="button"
                          className="sa-btn sa-btn-secondary sa-btn-sm"
                          onClick={() => handleUpdateStatus(selectedTicket.id, "In Progress")}
                        >
                          Re-open Ticket
                        </button>
                      )}
                    </div>

                    <button type="submit" className="sa-btn sa-btn-primary sa-btn-sm">
                      <Send size={13} /> Send Official Reply
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default HelpSupport;
