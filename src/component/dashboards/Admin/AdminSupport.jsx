import React, { useState, useEffect, useMemo } from "react";
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  Send,
  LifeBuoy,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  BookOpen,
  FileText,
  Activity,
  ShieldCheck,
  Check,
  X,
  User,
  Paperclip,
  Sparkles,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminSupport.css";

const STORAGE_KEY = "teamflow_admin_tickets";

const INITIAL_TICKETS = [
  {
    id: "TCK-9402",
    subject: "Workspace Storage Quota Increase for Marketing Hub",
    category: "Workspace Quotas",
    priority: "High",
    status: "In Progress",
    createdAt: "2026-10-25 14:30",
    updatedAt: "2026-10-26 09:15",
    agent: "Marcus Vance",
    agentAvatar: "MV",
    messages: [
      {
        sender: "Amit Sharma",
        role: "Organization Admin",
        time: "Oct 25, 2:30 PM",
        text: "Hi support team, our Marketing Team workspace has reached 88% of its 50GB storage quota. Could you provision an additional 100GB under our Enterprise plan?"
      },
      {
        sender: "Marcus Vance",
        role: "TeamFlow Senior Support",
        time: "Oct 26, 9:15 AM",
        text: "Hello Amit! I am reviewing your organization's subscription tier. Your Enterprise plan allows up to 500GB pooled storage without extra charge. I'll execute the quota adjustment shortly."
      }
    ]
  },
  {
    id: "TCK-9388",
    subject: "Webhook latency on task.completed event triggers",
    category: "API & Integrations",
    priority: "Medium",
    status: "Open",
    createdAt: "2026-10-26 08:20",
    updatedAt: "2026-10-26 08:20",
    agent: "Tech Support Team",
    agentAvatar: "TS",
    messages: [
      {
        sender: "Amit Sharma",
        role: "Organization Admin",
        time: "Oct 26, 8:20 AM",
        text: "We noticed occasional 1200ms delays when task.completed webhook dispatches payload to our internal Jenkins build cluster. Please verify outbound webhook delivery queues."
      }
    ]
  },
  {
    id: "TCK-9350",
    subject: "Add VAT identification to monthly Enterprise invoices",
    category: "Billing & Invoices",
    priority: "Low",
    status: "Resolved",
    createdAt: "2026-10-20 11:00",
    updatedAt: "2026-10-21 16:40",
    agent: "Elena Rostova",
    agentAvatar: "ER",
    messages: [
      {
        sender: "Amit Sharma",
        role: "Organization Admin",
        time: "Oct 20, 11:00 AM",
        text: "Please append our corporate Tax/VAT ID (US-EIN-948201948) to invoice receipts."
      },
      {
        sender: "Elena Rostova",
        role: "Billing Specialist",
        time: "Oct 21, 4:40 PM",
        text: "Done! All past and future billing receipts now display your VAT number."
      }
    ]
  },
  {
    id: "TCK-9312",
    subject: "Rate limit increase for Claude 3.5 Sonnet AI tool",
    category: "AI Tools & Tokens",
    priority: "Urgent",
    status: "Resolved",
    createdAt: "2026-10-18 16:10",
    updatedAt: "2026-10-19 10:00",
    agent: "Alex Rivera",
    agentAvatar: "AR",
    messages: [
      {
        sender: "Amit Sharma",
        role: "Organization Admin",
        time: "Oct 18, 4:10 PM",
        text: "Our sprint planning AI generator was throttled at 60 requests/min during team workshop."
      },
      {
        sender: "Alex Rivera",
        role: "AI Infrastructure",
        time: "Oct 19, 10:00 AM",
        text: "Your token throughput has been increased to 300 RPM for your organization tier."
      }
    ]
  }
];

const FAQS = [
  {
    q: "How do I allocate or expand workspace storage quotas?",
    a: "Navigate to Organization > Workspaces, click the 3-dot menu or Edit button on any workspace, and choose 'Adjust Storage Quota'. Enterprise plans include up to 500GB of shared pooled storage."
  },
  {
    q: "How does AI token billing and model throttling work?",
    a: "Your Enterprise subscription includes 1,000,000 AI tokens/month across GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro. You can set spend limits under AI Tools > AI Usage."
  },
  {
    q: "How do I configure custom granular permissions for new roles?",
    a: "Visit Organization > Roles & Permissions. You can clone an existing template (e.g. Project Manager) and toggle specific privileges across Workspaces, Projects, Tasks, and Settings."
  },
  {
    q: "Can I download official itemized PDF invoice receipts?",
    a: "Yes! Go to Billing > Invoices, where you can view detailed receipts with breakdown of seats and tax details, and click 'Download Receipt' for an official PDF/statement."
  },
  {
    q: "What is TeamFlow AI's service uptime SLA commitment?",
    a: "We guarantee a 99.98% uptime SLA with 24/7 infrastructure monitoring, redundant multicloud failover, and automated database backups every 6 hours."
  }
];

export default function AdminSupport() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  });

  const [activeTab, setActiveTab] = useState("tickets"); // "tickets" | "faq" | "status"
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortKey, setSortKey] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [toast, setToast] = useState(null);

  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "Technical Issue",
    priority: "Medium",
    description: ""
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

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

  const handleDeleteTicket = (id) => {
    if (window.confirm(`Delete support ticket #${id}?`)) {
      setTickets((prev) => prev.filter((t) => t.id !== id));
      if (selectedTicket?.id === id) setSelectedTicket(null);
      setToast(`Ticket ${id} removed.`);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filteredTickets = useMemo(() => {
    return [...tickets]
      .filter((t) => {
        const matchesSearch =
          t.subject.toLowerCase().includes(search.toLowerCase()) ||
          t.id.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All" || t.status === statusFilter;
        const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        if (sortKey === "updatedAt" || sortKey === "createdAt") {
          const timeA = new Date(valA).getTime() || 0;
          const timeB = new Date(valB).getTime() || 0;
          return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
        }

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [tickets, search, statusFilter, priorityFilter, sortKey, sortOrder]);

  const stats = useMemo(() => {
    return {
      open: tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length,
      resolved: tickets.filter((t) => t.status === "Resolved").length,
      urgent: tickets.filter((t) => t.priority === "Urgent" && t.status !== "Resolved").length,
      total: tickets.length
    };
  }, [tickets]);

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) return;

    const newTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketForm.subject,
      category: ticketForm.category,
      priority: ticketForm.priority,
      status: "Open",
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      updatedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      agent: "Tier 1 Support Agent",
      agentAvatar: "SA",
      messages: [
        {
          sender: "Amit Sharma",
          role: "Organization Admin",
          time: "Just now",
          text: ticketForm.description
        }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setShowNewTicketModal(false);
    setTicketForm({
      subject: "",
      category: "Technical Issue",
      priority: "Medium",
      description: ""
    });
    setToast("Support ticket raised successfully! An agent has been assigned.");
    setTimeout(() => setToast(null), 4000);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newReply = {
      sender: "Amit Sharma",
      role: "Organization Admin",
      time: "Just now",
      text: replyText.trim()
    };

    const updated = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          updatedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
          messages: [...t.messages, newReply]
        };
      }
      return t;
    });

    setTickets(updated);
    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, newReply]
    });
    setReplyText("");
  };

  const handleToggleStatus = (id) => {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) return;
    const newStatus = ticket.status === "Resolved" ? "In Progress" : "Resolved";
    const updated = tickets.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    setTickets(updated);
    if (selectedTicket?.id === id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
    setToast(`Ticket #${id} status set to ${newStatus}.`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleMarkResolved = (id) => {
    const updated = tickets.map((t) => (t.id === id ? { ...t, status: "Resolved" } : t));
    setTickets(updated);
    if (selectedTicket?.id === id) {
      setSelectedTicket({ ...selectedTicket, status: "Resolved" });
    }
    setToast("Ticket marked as resolved.");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="admin-support-app">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="admin-support-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <div className="admin-support-content">
          {/* Header */}
          <div className="admin-support-header">
            <div>
              <h1>Help & Customer Support</h1>
              <p>Raise support tickets, browse FAQs, monitor SLA uptime, and solve queries with our dedicated support engineers.</p>
            </div>

            <div className="admin-support-header-actions">
              <button
                className="admin-support-btn-secondary"
                onClick={() => {
                  setActiveTab("status");
                }}
              >
                <Activity size={15} />
                <span>System Status</span>
              </button>
              <button
                className="admin-support-btn-primary"
                onClick={() => setShowNewTicketModal(true)}
              >
                <Plus size={16} />
                <span>Raise Ticket</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toast && (
            <div className="admin-support-toast">
              <CheckCircle2 size={18} />
              <span>{toast}</span>
            </div>
          )}

          {/* KPI Stat Cards */}
          <div className="admin-support-stats-grid">
            <div className="admin-support-stat-card">
              <div className="stat-icon purple">
                <LifeBuoy size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Open Tickets</span>
                <span className="stat-value">{stats.open} Active</span>
                <span className="stat-subtext">Under technical review</span>
              </div>
            </div>

            <div className="admin-support-stat-card">
              <div className="stat-icon green">
                <CheckCircle2 size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Resolved Tickets</span>
                <span className="stat-value">{stats.resolved} Closed</span>
                <span className="stat-subtext">100% resolution rate</span>
              </div>
            </div>

            <div className="admin-support-stat-card">
              <div className="stat-icon blue">
                <Clock size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Avg Response Time</span>
                <span className="stat-value">&lt; 14 mins</span>
                <span className="stat-subtext">Enterprise priority queue</span>
              </div>
            </div>

            <div className="admin-support-stat-card">
              <div className="stat-icon amber">
                <ShieldCheck size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">CSAT Satisfaction</span>
                <span className="stat-value">98.6%</span>
                <span className="stat-subtext">Based on 140 ratings</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="admin-support-tabs">
            <button
              type="button"
              className={`admin-support-tab-btn ${activeTab === "tickets" ? "active" : ""}`}
              onClick={() => setActiveTab("tickets")}
            >
              <MessageSquare size={16} />
              <span>Support Tickets</span>
              <span className="tab-badge">{tickets.length}</span>
            </button>
            <button
              type="button"
              className={`admin-support-tab-btn ${activeTab === "faq" ? "active" : ""}`}
              onClick={() => setActiveTab("faq")}
            >
              <BookOpen size={16} />
              <span>Knowledge Base & FAQs</span>
            </button>
            <button
              type="button"
              className={`admin-support-tab-btn ${activeTab === "status" ? "active" : ""}`}
              onClick={() => setActiveTab("status")}
            >
              <Activity size={16} />
              <span>SLA & System Health (99.98%)</span>
            </button>
          </div>

          {/* TAB 1: TICKETS */}
          {activeTab === "tickets" && (
            <div className="admin-support-card">
              {/* Toolbar */}
              <div className="admin-support-toolbar">
                <div className="search-box">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search tickets by ID, subject, or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="clear-btn" onClick={() => setSearch("")}>
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="filters-row">
                  <div className="filter-select">
                    <Filter size={14} />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div className="filter-select">
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
                  </div>

                  <div className="filter-select">
                    <select
                      value={`${sortKey}-${sortOrder}`}
                      onChange={(e) => {
                        const [k, ord] = e.target.value.split("-");
                        setSortKey(k);
                        setSortOrder(ord);
                      }}
                      aria-label="Sort tickets"
                    >
                      <option value="updatedAt-desc">Sort: Recently Updated</option>
                      <option value="updatedAt-asc">Sort: Oldest Updated</option>
                      <option value="id-desc">Sort: Newest Ticket ID</option>
                      <option value="subject-asc">Sort: Subject (A to Z)</option>
                      <option value="priority-asc">Sort: Priority</option>
                      <option value="status-asc">Sort: Status</option>
                    </select>
                  </div>

                  {(search || statusFilter !== "All" || priorityFilter !== "All") && (
                    <button
                      type="button"
                      className="clear-filters-btn"
                      onClick={() => {
                        setSearch("");
                        setStatusFilter("All");
                        setPriorityFilter("All");
                      }}
                    >
                      <X size={13} />
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Tickets Table */}
              <div className="table-responsive">
                <table className="admin-support-table">
                  <thead>
                    <tr>
                      <th style={{ width: 48, textAlign: "center" }}>#</th>
                      <th className="sortable-th" onClick={() => handleSort("id")}>
                        <div className="th-content">
                          <span>TICKET ID</span>
                          {renderSortIcon("id")}
                        </div>
                      </th>
                      <th className="sortable-th" onClick={() => handleSort("subject")}>
                        <div className="th-content">
                          <span>SUBJECT & CATEGORY</span>
                          {renderSortIcon("subject")}
                        </div>
                      </th>
                      <th className="sortable-th" onClick={() => handleSort("priority")}>
                        <div className="th-content">
                          <span>PRIORITY</span>
                          {renderSortIcon("priority")}
                        </div>
                      </th>
                      <th className="sortable-th" onClick={() => handleSort("status")}>
                        <div className="th-content">
                          <span>STATUS</span>
                          {renderSortIcon("status")}
                        </div>
                      </th>
                      <th className="sortable-th" onClick={() => handleSort("agent")}>
                        <div className="th-content">
                          <span>ASSIGNED AGENT</span>
                          {renderSortIcon("agent")}
                        </div>
                      </th>
                      <th className="sortable-th" onClick={() => handleSort("updatedAt")}>
                        <div className="th-content">
                          <span>UPDATED</span>
                          {renderSortIcon("updatedAt")}
                        </div>
                      </th>
                      <th style={{ textAlign: "right" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="empty-cell">
                          <LifeBuoy size={36} />
                          <p>No support tickets match your filters.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredTickets.map((t, idx) => (
                        <tr key={t.id}>
                          <td style={{ textAlign: "center" }}>
                            <span className="admin-row-num">{idx + 1}</span>
                          </td>
                          <td>
                            <span className="ticket-id-badge">{t.id}</span>
                          </td>
                          <td>
                            <div className="ticket-subject-cell">
                              <strong
                                className="ticket-link"
                                onClick={() => setSelectedTicket(t)}
                              >
                                {t.subject}
                              </strong>
                              <span className="ticket-cat">{t.category}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`priority-pill ${t.priority.toLowerCase()}`}>
                              {t.priority}
                            </span>
                          </td>
                          <td>
                            <span className={`status-pill ${t.status.toLowerCase().replace(/\s+/g, "-")}`}>
                              {t.status === "Resolved" ? <Check size={12} /> : <Clock size={12} />}
                              {t.status}
                            </span>
                          </td>
                          <td>
                            <div className="agent-cell">
                              <span className="agent-avatar">{t.agentAvatar}</span>
                              <span className="agent-name">{t.agent}</span>
                            </div>
                          </td>
                          <td>
                            <span className="updated-text">{t.updatedAt}</span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div className="actions-wrap">
                              {/* REPLY ACTION */}
                              <button
                                type="button"
                                className="action-btn-pill action-reply"
                                onClick={() => setSelectedTicket(t)}
                                title="View conversation and reply"
                              >
                                <MessageSquare size={13} />
                                <span>Reply</span>
                              </button>

                              {/* RESOLVE / RE-OPEN TOGGLE */}
                              <button
                                type="button"
                                className={`action-btn-pill action-toggle ${t.status === "Resolved" ? "resolved" : "open"}`}
                                onClick={() => handleToggleStatus(t.id)}
                                title={t.status === "Resolved" ? "Resolved. Click to Re-open" : "Click to mark Resolved"}
                              >
                                {t.status === "Resolved" ? (
                                  <>
                                    <Check size={13} />
                                    <span>Resolved</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock size={13} />
                                    <span>Resolve</span>
                                  </>
                                )}
                              </button>

                              {/* DELETE ACTION */}
                              <button
                                type="button"
                                className="action-btn-pill action-delete"
                                onClick={() => handleDeleteTicket(t.id)}
                                title="Delete Ticket"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: FAQ & KNOWLEDGE BASE */}
          {activeTab === "faq" && (
            <div className="admin-support-card faq-card">
              <div className="faq-header">
                <h3>Frequently Asked Administration Questions</h3>
                <p>Instant answers to common organization, billing, and system configuration queries.</p>
              </div>

              <div className="faq-list">
                {FAQS.map((faq, i) => (
                  <div
                    key={i}
                    className={`faq-item ${expandedFaq === i ? "open" : ""}`}
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  >
                    <div className="faq-question-row">
                      <h4>{faq.q}</h4>
                      <ChevronDown size={18} className="faq-arrow" />
                    </div>
                    {expandedFaq === i && (
                      <div className="faq-answer">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM HEALTH & SLA */}
          {activeTab === "status" && (
            <div className="admin-support-card status-card">
              <div className="status-header">
                <div className="sla-badge">
                  <span className="pulse-dot" />
                  <span>All Cloud Regions Operational • 99.98% SLA</span>
                </div>
                <h3>System Telemetry & Health Checks</h3>
              </div>

              <div className="cluster-grid">
                <div className="cluster-item">
                  <div className="cluster-top">
                    <strong>Global API Ingress Gateway</strong>
                    <span className="tag-good">Operational</span>
                  </div>
                  <div className="cluster-bar"><span style={{ width: "98%" }} /></div>
                  <div className="cluster-meta">Latency: 24ms • 100% Uptime</div>
                </div>

                <div className="cluster-item">
                  <div className="cluster-top">
                    <strong>Postgres Database Cluster</strong>
                    <span className="tag-good">Healthy</span>
                  </div>
                  <div className="cluster-bar"><span style={{ width: "99%" }} /></div>
                  <div className="cluster-meta">Queries: 2,400 QPS • Replication Lag: 0ms</div>
                </div>

                <div className="cluster-item">
                  <div className="cluster-top">
                    <strong>Multi-Model AI Inference Hub</strong>
                    <span className="tag-good">Operational</span>
                  </div>
                  <div className="cluster-bar"><span style={{ width: "95%" }} /></div>
                  <div className="cluster-meta">Avg Token Gen: 42ms • Zero Throttling</div>
                </div>

                <div className="cluster-item">
                  <div className="cluster-top">
                    <strong>Distributed Storage & S3 CDN</strong>
                    <span className="tag-good">Operational</span>
                  </div>
                  <div className="cluster-bar"><span style={{ width: "100%" }} /></div>
                  <div className="cluster-meta">Throughput: 840 MB/s • Cache Hit: 99.2%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* RAISE TICKET MODAL */}
      {showNewTicketModal && (
        <div className="admin-support-modal-overlay" onClick={() => setShowNewTicketModal(false)}>
          <div className="admin-support-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Raise New Support Ticket</h3>
              <button className="close-btn" onClick={() => setShowNewTicketModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Ticket Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Need quota upgrade for Development Hub"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  />
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    >
                      <option value="Technical Issue">Technical Issue</option>
                      <option value="Billing & Invoices">Billing &amp; Invoices</option>
                      <option value="Workspace Quotas">Workspace Quotas</option>
                      <option value="API & Integrations">API &amp; Integrations</option>
                      <option value="AI Tools & Tokens">AI Tools &amp; Tokens</option>
                      <option value="Feature Request">Feature Request</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    >
                      <option value="Low">Low - General Question</option>
                      <option value="Medium">Medium - Normal Issue</option>
                      <option value="High">High - Impaired Workflow</option>
                      <option value="Urgent">Urgent - Critical Service Outage</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Detailed Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the issue, steps to reproduce, or requested configuration changes..."
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="admin-support-btn-secondary"
                  onClick={() => setShowNewTicketModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-support-btn-primary">
                  <Send size={15} />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TICKET DETAILS / REPLY THREAD MODAL */}
      {selectedTicket && (
        <div className="admin-support-modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="admin-support-modal thread-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-badge">{selectedTicket.id}</span>
                <h3>{selectedTicket.subject}</h3>
              </div>
              <button className="close-btn" onClick={() => setSelectedTicket(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body thread-body">
              {/* Meta bar */}
              <div className="thread-meta-bar">
                <span>Category: <strong>{selectedTicket.category}</strong></span>
                <span>Priority: <strong className={`tag-${selectedTicket.priority.toLowerCase()}`}>{selectedTicket.priority}</strong></span>
                <span>Status: <strong>{selectedTicket.status}</strong></span>
                <span>Assigned: <strong>{selectedTicket.agent}</strong></span>
              </div>

              {/* Conversation messages */}
              <div className="thread-messages">
                {selectedTicket.messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`thread-msg-box ${m.sender === "Amit Sharma" ? "admin-msg" : "support-msg"}`}
                  >
                    <div className="thread-msg-header">
                      <strong>{m.sender}</strong>
                      <span className="msg-role-tag">{m.role}</span>
                      <span className="msg-time-tag">{m.time}</span>
                    </div>
                    <p className="thread-msg-text">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Reply form */}
              {selectedTicket.status !== "Resolved" ? (
                <form onSubmit={handleSendReply} className="thread-reply-form">
                  <textarea
                    rows={2}
                    placeholder="Type a response to the support specialist..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="reply-actions">
                    <button
                      type="button"
                      className="admin-support-btn-secondary"
                      onClick={() => handleMarkResolved(selectedTicket.id)}
                    >
                      <Check size={14} />
                      <span>Mark as Resolved</span>
                    </button>
                    <button type="submit" className="admin-support-btn-primary" disabled={!replyText.trim()}>
                      <Send size={14} />
                      <span>Send Reply</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="ticket-resolved-notice">
                  <div className="notice-left">
                    <CheckCircle2 size={18} />
                    <span>This support ticket has been marked as resolved.</span>
                  </div>
                  <button
                    type="button"
                    className="admin-support-btn-secondary"
                    onClick={() => handleToggleStatus(selectedTicket.id)}
                  >
                    <RotateCcw size={13} />
                    <span>Re-open Ticket</span>
                  </button>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="admin-support-btn-secondary" onClick={() => setSelectedTicket(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

