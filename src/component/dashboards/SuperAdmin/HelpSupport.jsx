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
    subject: "User invitation emails not reaching corporate outlook inboxes",
    category: "SMTP / Email",
    priority: "High",
    status: "Closed",
    createdAt: "Oct 23, 2024",
    messages: [
      {
        sender: "Sana Sheikh",
        role: "HR Lead",
        time: "Oct 23",
        text: "Invites sent to @nextgen.com are trapped in quarantine. Have your SPF and DKIM DNS records changed recently?",
      },
      {
        sender: "Super Admin Support",
        role: "Mail Admin",
        time: "Oct 23",
        text: "We refreshed our SendGrid DKIM signatures. Your mail server has approved the relay.",
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
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [toast, setToast] = useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.org.toLowerCase().includes(q) ||
        t.requester.toLowerCase().includes(q) ||
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

  const metrics = useMemo(() => {
    const open = tickets.filter((t) => t.status === "Open").length;
    const inProg = tickets.filter((t) => t.status === "In Progress").length;
    const resolved = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
    return {
      total: tickets.length,
      open,
      inProg,
      resolved,
      resolutionRate: Math.round((resolved / tickets.length) * 100),
    };
  }, [tickets]);

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
    notify(`Reply sent on ticket ${selectedTicket.id}. Status set to In Progress.`);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
    }
    notify(`Ticket ${id} status marked as ${newStatus}.`);
  };

  return (
    <div className="sa-page-container sa-support-page">
      {/* 1. Page Header */}
      <section className="sa-page-header">
        <div className="sa-page-header-left">
          <h1>Help & Support Ticket Center</h1>
          <p>Triage client issues, respond to high-priority incidents, and review SLA resolution times.</p>
        </div>

        <div className="sa-page-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={() => {
              const csv = [
                "Ticket ID,Organization,Requester,Category,Priority,Status,Created At",
              ]
                .concat(
                  tickets.map(
                    (t) =>
                      `${t.id},"${t.org}","${t.requester}","${t.category}","${t.priority}","${t.status}","${t.createdAt}"`
                  )
                )
                .join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "support_tickets.csv";
              link.click();
              URL.revokeObjectURL(url);
              notify("Exported support tickets to CSV.");
            }}
          >
            Export Tickets
          </button>
        </div>
      </section>

      {/* 2. Top 4 KPI Stat Cards */}
      <section className="sa-kpi-grid">
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
            <p className="sa-kpi-title">Open Tickets</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{metrics.open}</span>
              <span className="sa-kpi-trend negative">
                Requires Action
              </span>
            </div>
            <span className="sa-kpi-subtitle">{metrics.inProg} currently in progress</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <CheckCircle2 size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Resolution Rate</p>
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
              <span className="sa-kpi-trend positive">
                Optimal
              </span>
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

      {/* 3. Tickets Filter & Table Card */}
      <section className="sa-card sa-tickets-table-card">
        <div className="sa-filter-bar">
          <div className="sa-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by ticket ID, organization, user, or issue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div className="sa-select-filter">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              <ChevronDown size={13} className="sa-chevron" />
            </div>

            <div className="sa-select-filter">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <ChevronDown size={13} className="sa-chevron" />
            </div>

            <div className="sa-select-filter">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Billing">Billing</option>
                <option value="AI">AI Integration</option>
                <option value="Security">Security / SSO</option>
                <option value="Storage">File Storage</option>
              </select>
              <ChevronDown size={13} className="sa-chevron" />
            </div>
          </div>
        </div>

        <div className="sa-table-wrapper">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Organization & Requester</th>
                <th>Subject & Issue</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((t) => (
                <tr key={t.id}>
                  <td>
                    <strong style={{ color: "#3b66ff" }}>{t.id}</strong>
                  </td>
                  <td>
                    <div className="sa-user-badge">
                      <div className="sa-org-avatar-icon blue" style={{ width: 28, height: 28 }}>
                        <Building2 size={14} />
                      </div>
                      <div>
                        <strong>{t.org}</strong>
                        <div style={{ color: "var(--sa-text-muted)", fontSize: 11 }}>{t.requester}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ maxWidth: 300, whiteSpace: "normal" }}>
                    <div style={{ fontWeight: 600, color: "var(--sa-text-main)", marginBottom: 2 }}>
                      {t.subject}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--sa-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.messages[0]?.text}
                    </div>
                  </td>
                  <td>
                    <span className="sa-pill sa-pill-neutral">{t.category}</span>
                  </td>
                  <td>
                    <span
                      className={`sa-pill ${
                        t.priority === "Urgent"
                          ? "sa-pill-danger"
                          : t.priority === "High"
                          ? "sa-pill-warning"
                          : t.priority === "Medium"
                          ? "sa-pill-info"
                          : "sa-pill-neutral"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td style={{ color: "var(--sa-text-muted)" }}>{t.createdAt}</td>
                  <td>
                    <span
                      className={`sa-pill ${
                        t.status === "Open"
                          ? "sa-pill-warning"
                          : t.status === "In Progress"
                          ? "sa-pill-info"
                          : "sa-pill-success"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={() => setSelectedTicket(t)}
                        title="View conversation & respond"
                      >
                        <Eye size={13} /> View
                      </button>
                      {t.status !== "Resolved" && (
                        <button
                          type="button"
                          className="sa-btn sa-btn-secondary sa-btn-sm"
                          style={{ color: "#10b981" }}
                          onClick={() => handleUpdateStatus(t.id, "Resolved")}
                          title="Mark Resolved"
                        >
                          <CheckCircle2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "32px", color: "var(--sa-text-muted)" }}>
                    No support tickets match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Ticket Conversation & Reply Modal */}
      {selectedTicket && typeof document !== "undefined" && createPortal(
        <div className="sa-modal-backdrop">
          <div className="sa-modal-content" style={{ maxWidth: 650 }}>
            <div className="sa-modal-header">
              <div>
                <h3 style={{ margin: "0 0 4px" }}>
                  {selectedTicket.id}: {selectedTicket.subject}
                </h3>
                <span style={{ fontSize: 11.5, color: "var(--sa-text-muted)" }}>
                  {selectedTicket.org} · Requester: {selectedTicket.requester} ({selectedTicket.email})
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
                <span className="sa-pill sa-pill-neutral">Category: {selectedTicket.category}</span>
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
                  placeholder="Type official response to organization admin..."
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
        </div>
      )}
    </div>
  );
}

export default HelpSupport;

