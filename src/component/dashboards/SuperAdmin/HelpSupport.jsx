import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  LifeBuoy,
  Plus,
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
  Trash2,
  Sparkles,
  CornerDownRight,
  Tag,
  Check,
  RotateCcw,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./HelpSupport.css";
import orgAvatarImg from "../../../assets/images/organization-avatar.png";

const STORAGE_KEY = "teamflow_superadmin_tickets";

const KNOWN_ORGANIZATIONS = [
  { name: "ABC Technologies", contact: "Himanshu Rao", email: "himanshu@abc.com" },
  { name: "XYZ Software", contact: "Amit Verma", email: "amit@xyz.com" },
  { name: "Startup Labs", contact: "Kunal Shah", email: "kunal@startuplabs.io" },
  { name: "NovaTech Solutions", contact: "Priya Nair", email: "priya@novatech.io" },
  { name: "DesignHub", contact: "Rohan Kapoor", email: "rohan@designhub.in" },
  { name: "NextGen Solutions", contact: "Sana Sheikh", email: "sana@nextgen.com" },
  { name: "Acme Corporation", contact: "Sarah Jenkins", email: "admin@acmecorp.com" },
  { name: "BrightLabs", contact: "Alex Rivera", email: "hello@brightlabs.io" },
  { name: "Vertex Digital", contact: "Vikram Malhotra", email: "hello@vertexdigital.io" },
  { name: "CloudNine Technologies", contact: "Elena Rostova", email: "admin@cloudnine.dev" },
];

const CANNED_REPLIES = [
  {
    label: "Under Investigation",
    text: "Our core engineering team has initiated root-cause analysis on this issue and is actively reproducing the telemetry in our staging environment.",
    actionStatus: "In Progress",
  },
  {
    label: "Patch Deployed",
    text: "A service update and configuration patch have been deployed to your organization's compute shard. Please hard-refresh your browser session (Ctrl + F5).",
    actionStatus: "Resolved",
  },
  {
    label: "Request Error Trace",
    text: "Could you please provide the browser console error stack trace and the exact API endpoint URL that returned this error code?",
    actionStatus: "In Progress",
  },
  {
    label: "Billing Reconciled",
    text: "Our enterprise billing team has reconciled your account and reissued your invoice with the updated GSTIN credentials.",
    actionStatus: "Resolved",
  },
];

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

const emptyNewTicket = {
  org: "ABC Technologies",
  requester: "Himanshu Rao",
  email: "himanshu@abc.com",
  subject: "",
  category: "Technical / DNS",
  priority: "Medium",
  message: "",
  error: "",
};

function readTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Failed to read support tickets from storage:", err);
  }
  return INITIAL_TICKETS;
}

function HelpSupport() {
  const [tickets, setTickets] = useState(readTickets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [density, setDensity] = useState("standard");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatusChoice, setReplyStatusChoice] = useState("In Progress");
  const [toast, setToast] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState(emptyNewTicket);
  const [deleteConfirmTicket, setDeleteConfirmTicket] = useState(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (err) {
      console.error("Failed to persist support tickets:", err);
    }
  }, [tickets]);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
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
      resolutionRate: tickets.length > 0 ? Math.round((resolved / tickets.length) * 100) : 0,
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

  // Batch status update
  const handleBatchStatus = (newStatus) => {
    if (selectedIds.size === 0) return;
    setTickets((prev) =>
      prev.map((t) => (selectedIds.has(t.id) ? { ...t, status: newStatus } : t))
    );
    notify(`Updated ${selectedIds.size} tickets to ${newStatus}.`);
    setSelectedIds(new Set());
  };

  // Batch delete
  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    setTickets((prev) => prev.filter((t) => !selectedIds.has(t.id)));
    notify(`Deleted ${selectedIds.size} tickets.`);
    setSelectedIds(new Set());
  };

  // Dispatch reply
  const handleSendReply = (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      sender: "Himanshu (Super Admin)",
      role: "Super Admin",
      time: "Just now",
      text: replyText.trim(),
    };

    const targetStatus = replyStatusChoice || "In Progress";

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: targetStatus,
              messages: [...t.messages, newMsg],
            }
          : t
      )
    );

    setSelectedTicket((prev) => ({
      ...prev,
      status: targetStatus,
      messages: [...prev.messages, newMsg],
    }));

    setReplyText("");
    notify(`Official reply dispatched on ${selectedTicket.id} (${targetStatus}).`);
  };

  // Update Status directly
  const handleUpdateStatus = (id, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
    }
    notify(`Ticket ${id} status set to ${newStatus}.`);
  };

  // Update Priority directly
  const handleUpdatePriority = (id, newPriority) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority: newPriority } : t))
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket((prev) => ({ ...prev, priority: newPriority }));
    }
    notify(`Ticket ${id} priority set to ${newPriority}.`);
  };

  // Delete single ticket
  const handleDeleteTicket = (ticket) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticket.id));
    if (selectedTicket && selectedTicket.id === ticket.id) {
      setSelectedTicket(null);
    }
    setDeleteConfirmTicket(null);
    notify(`Deleted ticket ${ticket.id}.`);
  };

  // Create New Ticket
  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newTicketForm.subject.trim() || !newTicketForm.message.trim()) {
      setNewTicketForm((prev) => ({
        ...prev,
        error: "Please complete the ticket subject and description.",
      }));
      return;
    }

    // Generate new Ticket ID
    const maxNum = tickets.reduce((max, t) => {
      const m = t.id.match(/\d+/);
      return m ? Math.max(max, parseInt(m[0], 10)) : max;
    }, 1092);
    const newId = `TKT-${maxNum + 1}`;

    const newTicket = {
      id: newId,
      org: newTicketForm.org,
      requester: newTicketForm.requester || "Tenant Administrator",
      email: newTicketForm.email || "support@tenant.io",
      subject: newTicketForm.subject.trim(),
      category: newTicketForm.category,
      priority: newTicketForm.priority,
      status: "Open",
      createdAt: "Just now",
      messages: [
        {
          sender: newTicketForm.requester || "Tenant Administrator",
          role: "Requester",
          time: "Just now",
          text: newTicketForm.message.trim(),
        },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);
    setCreateModalOpen(false);
    setNewTicketForm(emptyNewTicket);
    notify(`Created new support ticket ${newId} for ${newTicket.org}.`);
  };

  const handleOrgChangeInForm = (orgName) => {
    const matched = KNOWN_ORGANIZATIONS.find((o) => o.name === orgName);
    if (matched) {
      setNewTicketForm((prev) => ({
        ...prev,
        org: matched.name,
        requester: matched.contact,
        email: matched.email,
        error: "",
      }));
    } else {
      setNewTicketForm((prev) => ({
        ...prev,
        org: orgName,
        error: "",
      }));
    }
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
          <button
            type="button"
            className="sa-btn sa-btn-primary"
            onClick={() => {
              setNewTicketForm(emptyNewTicket);
              setCreateModalOpen(true);
            }}
          >
            <Plus size={15} /> Create Support Ticket
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
            <span className="sa-kpi-subtitle">Across active tenant organizations</span>
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
                className="sa-btn sa-btn-sm"
                style={{ background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0" }}
                onClick={() => handleBatchStatus("Resolved")}
              >
                <CheckCircle2 size={13} /> Mark Resolved
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
                className="sa-btn sa-btn-sm"
                style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
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
              <option value="Urgent">Urgent Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
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
              <option value="Audit">Audit Logs</option>
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
                <th style={{ textAlign: "right", width: 140 }}>Actions</th>
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
                        <div className="spt-org-avatar-wrap" title={t.org}>
                          <img
                            src={orgAvatarImg}
                            alt={t.org}
                            className="spt-org-avatar-img"
                            loading="lazy"
                          />
                        </div>
                        <div className="sap-user-info">
                          <strong className="sap-user-name">{t.org}</strong>
                          <span className="sap-user-email">
                            {t.requester} · {t.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth: 300 }}>
                      <strong
                        style={{
                          fontSize: "13px",
                          color: "var(--sa-text-main, #0f172a)",
                          display: "block",
                          marginBottom: 2,
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedTicket(t)}
                        title="Click to view conversation"
                      >
                        {t.subject}
                      </strong>
                      <span
                        style={{
                          fontSize: "11.5px",
                          color: "var(--sa-text-muted, #64748b)",
                          display: "block",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {t.messages[t.messages.length - 1]?.text || t.messages[0]?.text}
                      </span>
                    </td>
                    <td>
                      <span className="spt-category-chip">
                        <Tag size={10} /> {t.category}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`spt-priority-badge ${
                          t.priority.toLowerCase() === "urgent"
                            ? "urgent"
                            : t.priority.toLowerCase() === "high"
                            ? "high"
                            : t.priority.toLowerCase() === "medium"
                            ? "medium"
                            : "low"
                        }`}
                      >
                        {t.priority === "Urgent" && <AlertTriangle size={10} />}
                        {t.priority}
                      </span>
                    </td>
                    <td style={{ color: "var(--sa-text-muted)", fontSize: 12 }}>
                      {t.createdAt}
                    </td>
                    <td>
                      <span
                        className={`spt-status-pill ${
                          t.status.toLowerCase() === "open"
                            ? "open"
                            : t.status.toLowerCase() === "in progress"
                            ? "in-progress"
                            : t.status.toLowerCase() === "resolved"
                            ? "resolved"
                            : "closed"
                        }`}
                      >
                        <span className="spt-status-dot" />
                        {t.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="spt-action-group">
                        <button
                          type="button"
                          className="spt-action-btn btn-view"
                          onClick={() => setSelectedTicket(t)}
                          title="View Conversation Thread & Reply"
                        >
                          <Eye size={14} />
                        </button>
                        {t.status !== "Resolved" && t.status !== "Closed" ? (
                          <button
                            type="button"
                            className="spt-action-btn btn-resolve"
                            onClick={() => handleUpdateStatus(t.id, "Resolved")}
                            title="Mark as Resolved"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="spt-action-btn btn-reopen"
                            onClick={() => handleUpdateStatus(t.id, "In Progress")}
                            title="Re-open Ticket"
                          >
                            <RotateCcw size={14} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="spt-action-btn btn-delete"
                          onClick={() => setDeleteConfirmTicket(t)}
                          title="Delete Ticket"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedTickets.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "40px" }}>
                    <div style={{ color: "var(--sa-text-muted)", fontSize: 13 }}>
                      <strong>No support tickets found matching your query.</strong>
                      <p style={{ margin: "6px 0 12px", fontSize: 12 }}>
                        Try clearing or adjusting your active filter options.
                      </p>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={() => {
                          setSearch("");
                          setStatusFilter("All");
                          setPriorityFilter("All");
                          setCategoryFilter("All");
                        }}
                      >
                        Reset All Filters
                      </button>
                    </div>
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
          <div
            className="sa-modal-backdrop"
            onClick={() => setSelectedTicket(null)}
          >
            <div
              className="spt-ticket-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Topbar */}
              <div className="spt-modal-header">
                <div className="spt-modal-header-left">
                  <span className="spt-ticket-id-badge">{selectedTicket.id}</span>
                  <div style={{ minWidth: 0 }}>
                    <h3 className="spt-modal-title" title={selectedTicket.subject}>
                      {selectedTicket.subject}
                    </h3>
                    <div className="spt-modal-subtitle">
                      <span><strong>{selectedTicket.org}</strong></span>
                      <span>·</span>
                      <span>Requester: {selectedTicket.requester} ({selectedTicket.email})</span>
                    </div>
                  </div>
                </div>

                <div className="spt-modal-header-controls">
                  <select
                    className="spt-header-select"
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                    title="Change Ticket Status"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <select
                    className="spt-header-select"
                    value={selectedTicket.priority}
                    onChange={(e) => handleUpdatePriority(selectedTicket.id, e.target.value)}
                    title="Change Priority Tier"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>

                  <button
                    type="button"
                    className="sa-modal-close"
                    onClick={() => setSelectedTicket(null)}
                    title="Close Dialog"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="spt-modal-body">
                {/* Telemetry Ribbon */}
                <div className="spt-meta-ribbon">
                  <div className="spt-ribbon-left">
                    <span className="spt-category-chip">
                      <Tag size={11} /> {selectedTicket.category}
                    </span>
                    <span
                      className={`spt-priority-badge ${
                        selectedTicket.priority.toLowerCase() === "urgent"
                          ? "urgent"
                          : selectedTicket.priority.toLowerCase() === "high"
                          ? "high"
                          : selectedTicket.priority.toLowerCase() === "medium"
                          ? "medium"
                          : "low"
                      }`}
                    >
                      {selectedTicket.priority === "Urgent" && <AlertTriangle size={11} />}
                      Priority: {selectedTicket.priority}
                    </span>
                    <span
                      className={`spt-status-pill ${
                        selectedTicket.status.toLowerCase() === "open"
                          ? "open"
                          : selectedTicket.status.toLowerCase() === "in progress"
                          ? "in-progress"
                          : selectedTicket.status.toLowerCase() === "resolved"
                          ? "resolved"
                          : "closed"
                      }`}
                    >
                      <span className="spt-status-dot" />
                      Status: {selectedTicket.status}
                    </span>
                  </div>

                  <div className="spt-ribbon-right">
                    <ShieldCheck size={14} color="#10b981" />
                    <span>SLA Response Target: Under 25m · Active</span>
                  </div>
                </div>

                {/* Conversation Thread Stream */}
                <div className="spt-thread-stream">
                  {selectedTicket.messages.map((m, i) => {
                    const isAdmin =
                      m.role.includes("Super Admin") ||
                      m.role.includes("Support") ||
                      m.role.includes("Security");
                    return (
                      <div
                        key={i}
                        className={`spt-message-card ${isAdmin ? "is-admin" : "is-client"}`}
                      >
                        <div className={`spt-msg-avatar ${isAdmin ? "admin" : "client"}`}>
                          {isAdmin ? <ShieldCheck size={16} /> : <User size={16} />}
                        </div>

                        <div className="spt-msg-bubble-wrap">
                          <div className="spt-msg-header">
                            <span className="spt-msg-author">
                              {m.sender}
                              <span className="spt-msg-role">{m.role}</span>
                            </span>
                            <span className="spt-msg-time">{m.time}</span>
                          </div>
                          <p className="spt-msg-body">{m.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Canned Responses */}
                <div className="spt-canned-section">
                  <span className="spt-canned-label">
                    <Sparkles size={12} color="#3b66ff" /> Quick Canned Response Templates
                  </span>
                  <div className="spt-canned-chips-row">
                    {CANNED_REPLIES.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        className="spt-canned-btn"
                        onClick={() => {
                          setReplyText(c.text);
                          setReplyStatusChoice(c.actionStatus);
                        }}
                        title={`Click to insert template & set status to ${c.actionStatus}`}
                      >
                        <CornerDownRight size={11} /> {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Reply Workspace Form */}
                <form onSubmit={handleSendReply} className="spt-reply-workspace">
                  <textarea
                    rows={3}
                    className="spt-reply-textarea"
                    placeholder="Type official enterprise response to organization... (Press Ctrl + Enter to dispatch)"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                        handleSendReply(e);
                      }
                    }}
                    required
                  />

                  <div className="spt-reply-bottom-bar">
                    <div className="spt-reply-options">
                      <span>Status on reply:</span>
                      <select
                        value={replyStatusChoice}
                        onChange={(e) => setReplyStatusChoice(e.target.value)}
                      >
                        <option value="In Progress">Keep In Progress</option>
                        <option value="Resolved">Mark as Resolved</option>
                        <option value="Closed">Mark as Closed</option>
                      </select>
                      <span className="spt-shortcut-hint">Ctrl + Enter to send</span>
                    </div>

                    <div className="spt-reply-submit-group">
                      {selectedTicket.status !== "Resolved" && (
                        <button
                          type="button"
                          className="sa-btn sa-btn-secondary sa-btn-sm"
                          style={{ color: "#059669" }}
                          onClick={() => handleUpdateStatus(selectedTicket.id, "Resolved")}
                        >
                          <CheckCircle2 size={13} /> Quick Resolve
                        </button>
                      )}
                      <button type="submit" className="sa-btn sa-btn-primary sa-btn-sm">
                        <Send size={13} /> Send Official Reply
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 7. Create Support Ticket Modal */}
      {createModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="sa-modal-backdrop"
            onClick={() => setCreateModalOpen(false)}
          >
            <div
              className="spt-create-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="spt-modal-header">
                <div className="spt-modal-header-left">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#2563eb",
                    }}
                  >
                    <Plus size={18} />
                  </div>
                  <div>
                    <h3 className="spt-modal-title">Create New Support Case</h3>
                    <div className="spt-modal-subtitle">
                      Log an enterprise customer inquiry, SLA incident, or service triage.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="sa-modal-close"
                  onClick={() => setCreateModalOpen(false)}
                >
                  <X size={17} />
                </button>
              </div>

              <form onSubmit={handleCreateTicket}>
                <div className="spt-create-body">
                  {newTicketForm.error && (
                    <div className="spt-form-error">
                      <AlertTriangle size={15} />
                      <span>{newTicketForm.error}</span>
                    </div>
                  )}

                  <div className="spt-field-group">
                    <label className="spt-field-label">Tenant Organization *</label>
                    <select
                      className="spt-field-select"
                      value={newTicketForm.org}
                      onChange={(e) => handleOrgChangeInForm(e.target.value)}
                      required
                    >
                      {KNOWN_ORGANIZATIONS.map((o) => (
                        <option key={o.name} value={o.name}>
                          {o.name} ({o.contact})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="spt-form-grid-2">
                    <div className="spt-field-group">
                      <label className="spt-field-label">Requester Full Name *</label>
                      <input
                        type="text"
                        className="spt-field-input"
                        placeholder="e.g. Himanshu Rao"
                        value={newTicketForm.requester}
                        onChange={(e) =>
                          setNewTicketForm((p) => ({ ...p, requester: e.target.value, error: "" }))
                        }
                        required
                      />
                    </div>

                    <div className="spt-field-group">
                      <label className="spt-field-label">Requester Email Address *</label>
                      <input
                        type="email"
                        className="spt-field-input"
                        placeholder="e.g. himanshu@abc.com"
                        value={newTicketForm.email}
                        onChange={(e) =>
                          setNewTicketForm((p) => ({ ...p, email: e.target.value, error: "" }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="spt-form-grid-2">
                    <div className="spt-field-group">
                      <label className="spt-field-label">Category *</label>
                      <select
                        className="spt-field-select"
                        value={newTicketForm.category}
                        onChange={(e) =>
                          setNewTicketForm((p) => ({ ...p, category: e.target.value }))
                        }
                      >
                        <option value="Technical / DNS">Technical / DNS</option>
                        <option value="Billing & Invoices">Billing &amp; Invoices</option>
                        <option value="AI Integration">AI Integration</option>
                        <option value="Security & SSO">Security &amp; SSO</option>
                        <option value="File Storage">File Storage</option>
                        <option value="Audit Logs">Audit Logs</option>
                        <option value="Performance & Latency">Performance &amp; Latency</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>

                    <div className="spt-field-group">
                      <label className="spt-field-label">Priority Tier *</label>
                      <div className="spt-priority-picker">
                        {["Low", "Medium", "High", "Urgent"].map((p) => (
                          <button
                            key={p}
                            type="button"
                            className={`spt-priority-option ${
                              newTicketForm.priority === p ? `is-selected ${p.toLowerCase()}` : ""
                            }`}
                            onClick={() => setNewTicketForm((prev) => ({ ...prev, priority: p }))}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="spt-field-group">
                    <label className="spt-field-label">
                      <span>Subject / Incident Headline *</span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>
                        {newTicketForm.subject.length}/100
                      </span>
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      className="spt-field-input"
                      placeholder="e.g. SSL verification pending after DNS CNAME configuration"
                      value={newTicketForm.subject}
                      onChange={(e) =>
                        setNewTicketForm((p) => ({ ...p, subject: e.target.value, error: "" }))
                      }
                      required
                    />
                  </div>

                  <div className="spt-field-group">
                    <label className="spt-field-label">Initial Problem Description *</label>
                    <textarea
                      rows={4}
                      className="spt-field-textarea"
                      placeholder="Describe the technical error, customer impact, or details required for resolution..."
                      value={newTicketForm.message}
                      onChange={(e) =>
                        setNewTicketForm((p) => ({ ...p, message: e.target.value, error: "" }))
                      }
                      required
                    />
                    <span className="spt-form-hint">
                      The initial message will be recorded as the opening message of this ticket thread.
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    padding: "14px 24px",
                    background: "#f8fafc",
                    borderTop: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 10,
                  }}
                >
                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary"
                    onClick={() => setCreateModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="sa-btn sa-btn-primary">
                    <CheckCircle2 size={15} /> Create &amp; Open Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* 8. Delete Confirmation Dialog */}
      {deleteConfirmTicket &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="sa-modal-backdrop"
            onClick={() => setDeleteConfirmTicket(null)}
          >
            <div
              className="sa-modal-content"
              style={{ maxWidth: 440, padding: 24, textAlign: "center" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "#fef2f2",
                  color: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <Trash2 size={24} />
              </div>
              <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 700 }}>
                Delete Ticket {deleteConfirmTicket.id}?
              </h3>
              <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--sa-text-muted)" }}>
                Are you sure you want to delete the support ticket for{" "}
                <strong>{deleteConfirmTicket.org}</strong>? This action will permanently remove the conversation thread.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary"
                  onClick={() => setDeleteConfirmTicket(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="sa-btn sa-btn-danger"
                  style={{ background: "#dc2626", color: "#ffffff", border: "1px solid #dc2626" }}
                  onClick={() => handleDeleteTicket(deleteConfirmTicket)}
                >
                  Yes, Delete Ticket
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default HelpSupport;

