import React, { useEffect, useMemo, useState } from "react";
import {
  Megaphone,
  Search,
  Plus,
  Filter,
  Send,
  Eye,
  Pencil,
  Trash2,
  X,
  Users,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Pin,
  Calendar,
  Grid2X2,
  List,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import { initialAnnouncements } from "./adminAnnouncementsData.js";
import "./AdminAnnouncements.css";

const STORAGE_KEY = "teamflow_admin_announcements";

const AUDIENCES = ["Entire Organization", "Engineering", "Product & Design", "Marketing", "Leadership"];
const PRIORITIES = ["Normal", "Important", "Urgent"];

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialAnnouncements;
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'feed'
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [toast, setToast] = useState(null);

  // Column sort toggle handler
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

  const [form, setForm] = useState({
    title: "",
    content: "",
    audience: "Entire Organization",
    priority: "Normal",
    pinned: false,
    author: "Amit Sharma",
  });

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (message) => setToast(message);

  const saveAnnouncements = (newItems) => {
    setAnnouncements(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {}
  };

  const filteredAnnouncements = useMemo(() => {
    const priorityRank = { Urgent: 1, Important: 2, Normal: 3 };

    const list = announcements.filter((a) => {
      const term = search.trim().toLowerCase();
      const matchesSearch = !term || a.title?.toLowerCase().includes(term) || a.content?.toLowerCase().includes(term);
      const matchesAudience = audienceFilter === "All" || a.audience === audienceFilter;
      return matchesSearch && matchesAudience;
    });

    return [...list].sort((a, b) => {
      // If sorting by priority
      if (sortKey === "priority") {
        const rankA = priorityRank[a.priority] || 99;
        const rankB = priorityRank[b.priority] || 99;
        return sortOrder === "asc" ? rankA - rankB : rankB - rankA;
      }

      // If sorting by pinned
      if (sortKey === "pinned") {
        const valA = a.pinned ? 1 : 0;
        const valB = b.pinned ? 1 : 0;
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      let valA = a[sortKey];
      let valB = b[sortKey];
      if (valA === undefined || valA === null) valA = "";
      if (valB === undefined || valB === null) valB = "";

      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [announcements, search, audienceFilter, sortKey, sortOrder]);

  const stats = useMemo(() => {
    const total = announcements.length;
    const pinned = announcements.filter((a) => a.pinned).length;
    const urgent = announcements.filter((a) => a.priority === "Urgent").length;
    return { total, pinned, urgent };
  }, [announcements]);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      title: "",
      content: "",
      audience: "Entire Organization",
      priority: "Normal",
      pinned: false,
      author: "Amit Sharma",
    });
    setShowModal(true);
  };

  const openEditModal = (a) => {
    setEditingItem(a);
    setForm({
      title: a.title || "",
      content: a.content || "",
      audience: a.audience || "Entire Organization",
      priority: a.priority || "Normal",
      pinned: Boolean(a.pinned),
      author: a.author || "Amit Sharma",
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title is required.");
      return;
    }

    if (editingItem) {
      const updated = announcements.map((a) => (a.id === editingItem.id ? { ...a, ...form } : a));
      saveAnnouncements(updated);
      showToast("Announcement updated.");
    } else {
      const newItem = {
        id: Date.now(),
        ...form,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      };
      saveAnnouncements([newItem, ...announcements]);
      showToast("Announcement broadcasted.");
    }
    setShowModal(false);
  };

  const togglePin = (id) => {
    const updated = announcements.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a));
    saveAnnouncements(updated);
    showToast("Pin status updated.");
  };

  const deleteItem = (id) => {
    const confirmed = window.confirm("Delete this announcement?");
    if (!confirmed) return;
    saveAnnouncements(announcements.filter((a) => a.id !== id));
    showToast("Announcement deleted.");
  };

  return (
    <div className="admin-ann-app">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="admin-ann-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        {toast && (
          <div className="admin-ann-toast">
            <CheckCircle2 size={16} />
            <span>{toast}</span>
          </div>
        )}

        <main className="admin-ann-content">
          <section className="admin-ann-heading">
            <div>
              <h1>Broadcast Announcements</h1>
              <p>Publish critical organization notices, company-wide releases, and policy alerts.</p>
            </div>

            <button type="button" className="btn-primary" onClick={openCreateModal}>
              <Plus size={17} />
              <span>Post Announcement</span>
            </button>
          </section>

          {/* STATS */}
          <section className="admin-ann-stats">
            <div className="ann-stat-card">
              <Megaphone size={22} className="stat-icon purple" />
              <div>
                <span>Total Notices</span>
                <strong>{stats.total}</strong>
              </div>
            </div>
            <div className="ann-stat-card">
              <Pin size={22} className="stat-icon blue" />
              <div>
                <span>Pinned Announcements</span>
                <strong>{stats.pinned}</strong>
              </div>
            </div>
            <div className="ann-stat-card">
              <AlertTriangle size={22} className="stat-icon red" />
              <div>
                <span>Urgent Alerts</span>
                <strong>{stats.urgent}</strong>
              </div>
            </div>
          </section>

          {/* TOOLBAR */}
          <section className="admin-ann-toolbar">
            <div className="admin-ann-search">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search announcements by title or content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && <button type="button" className="clear-btn" onClick={() => setSearch("")}><X size={14} /></button>}
            </div>

            <div className="admin-ann-controls">
              <select value={audienceFilter} onChange={(e) => setAudienceFilter(e.target.value)}>
                <option value="All">All Audiences</option>
                {AUDIENCES.map((aud) => (
                  <option key={aud} value={aud}>{aud}</option>
                ))}
              </select>

              <select
                value={`${sortKey}-${sortOrder}`}
                onChange={(e) => {
                  const [k, ord] = e.target.value.split("-");
                  setSortKey(k);
                  setSortOrder(ord);
                }}
                aria-label="Sort announcements"
              >
                <option value="date-desc">Sort: Date (Newest)</option>
                <option value="date-asc">Sort: Date (Oldest)</option>
                <option value="priority-asc">Sort: Priority (Urgent First)</option>
                <option value="title-asc">Sort: Title (A to Z)</option>
                <option value="pinned-desc">Sort: Pinned First</option>
              </select>

              {(search || audienceFilter !== "All") && (
                <button
                  type="button"
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearch("");
                    setAudienceFilter("All");
                  }}
                >
                  <X size={13} />
                  Clear Filters
                </button>
              )}

              <div className="view-switch">
                <button
                  type="button"
                  className={`view-btn ${viewMode === "table" ? "active" : ""}`}
                  onClick={() => setViewMode("table")}
                  title="Table view"
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  className={`view-btn ${viewMode === "feed" ? "active" : ""}`}
                  onClick={() => setViewMode("feed")}
                  title="Feed view"
                >
                  <Grid2X2 size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* TABLE VIEW (PRIMARY) */}
          {viewMode === "table" ? (
            <div className="admin-ann-table-wrap">
              <table className="admin-ann-table">
                <thead>
                  <tr>
                    <th style={{ width: 48, textAlign: "center" }}>#</th>
                    <th className="sortable-th" onClick={() => handleSort("title")}>
                      <div className="th-content">
                        <span>Announcement</span>
                        {renderSortIcon("title")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("audience")}>
                      <div className="th-content">
                        <span>Audience</span>
                        {renderSortIcon("audience")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("priority")}>
                      <div className="th-content">
                        <span>Priority</span>
                        {renderSortIcon("priority")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("pinned")}>
                      <div className="th-content">
                        <span>Pin Status</span>
                        {renderSortIcon("pinned")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("author")}>
                      <div className="th-content">
                        <span>Author</span>
                        {renderSortIcon("author")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("date")}>
                      <div className="th-content">
                        <span>Date</span>
                        {renderSortIcon("date")}
                      </div>
                    </th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnnouncements.map((a, idx) => (
                    <tr key={a.id} className={a.pinned ? "row-pinned" : ""}>
                      <td style={{ textAlign: "center" }}>
                        <span className="admin-row-num">{idx + 1}</span>
                      </td>
                      <td>
                        <div className="ann-title-cell">
                          <strong className="clickable-title" onClick={() => setViewingItem(a)}>
                            {a.title}
                          </strong>
                          <small>{a.content?.substring(0, 65)}...</small>
                        </div>
                      </td>
                      <td>
                        <span className="audience-badge">{a.audience}</span>
                      </td>
                      <td>
                        <span className={`priority-badge ${a.priority?.toLowerCase()}`}>
                          {a.priority}
                        </span>
                      </td>
                      <td>
                        {a.pinned ? (
                          <span className="pinned-badge"><Pin size={12} /> Pinned</span>
                        ) : (
                          <span className="unpinned-text">Normal</span>
                        )}
                      </td>
                      <td>{a.author || "Amit Sharma"}</td>
                      <td>{a.date || "Oct 2026"}</td>
                      <td style={{ textAlign: "right" }}>
                        <div className="table-actions">
                          <button
                            type="button"
                            className={`action-btn ${a.pinned ? "active-pin" : ""}`}
                            title={a.pinned ? "Unpin notice" : "Pin notice to top"}
                            onClick={() => togglePin(a.id)}
                          >
                            <Pin size={14} />
                          </button>
                          <button
                            type="button"
                            className="action-btn"
                            title="View details"
                            onClick={() => setViewingItem(a)}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            className="action-btn"
                            title="Edit announcement"
                            onClick={() => openEditModal(a)}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            className="action-btn delete"
                            title="Delete announcement"
                            onClick={() => deleteItem(a.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredAnnouncements.length === 0 && (
                <div className="admin-ann-empty">
                  <Megaphone size={40} />
                  <h3>No announcements found</h3>
                  <p>Try clearing filters or search query.</p>
                </div>
              )}
            </div>
          ) : (
            /* ANNOUNCEMENTS FEED VIEW */
            <div className="announcements-feed">
              {filteredAnnouncements.map((a, idx) => (
                <div key={a.id} className={`announcement-card ${a.pinned ? "pinned" : ""}`}>
                  <div className="ann-header">
                    <div className="ann-header-left">
                      <span className="admin-row-num sm">{idx + 1}</span>
                      {a.pinned && <span className="pinned-badge"><Pin size={12} /> Pinned</span>}
                      <span className={`priority-badge ${a.priority?.toLowerCase()}`}>{a.priority}</span>
                      <span className="audience-badge">{a.audience}</span>
                    </div>

                    <div className="ann-actions">
                      <button type="button" className="action-btn" title="Pin / Unpin" onClick={() => togglePin(a.id)}>
                        <Pin size={14} />
                      </button>
                      <button type="button" className="action-btn" title="Edit" onClick={() => openEditModal(a)}>
                        <Pencil size={14} />
                      </button>
                      <button type="button" className="action-btn delete" title="Delete" onClick={() => deleteItem(a.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 onClick={() => setViewingItem(a)} className="clickable-title">{a.title}</h3>
                  <p className="ann-text">{a.content}</p>

                  <div className="ann-footer">
                    <span>Posted by <strong>{a.author || "Amit Sharma"}</strong></span>
                    <span className="ann-date">{a.date || "Oct 2026"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <h2>{editingItem ? "Edit Announcement" : "Create Broadcast Announcement"}</h2>
              <button type="button" className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Announcement Title <span className="req">*</span></label>
                <input name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Scheduled Maintenance Window" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Audience</label>
                  <select name="audience" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
                    {AUDIENCES.map((aud) => (
                      <option key={aud} value={aud}>{aud}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select name="priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Message Content</label>
                <textarea rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your announcement details here..." required />
              </div>

              <div className="form-checkbox">
                <label>
                  <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} />
                  Pin this announcement to top
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">{editingItem ? "Save Changes" : "Publish Now"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewingItem && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setViewingItem(null); }}>
          <div className="modal-box">
            <div className="modal-header">
              <h2>Announcement</h2>
              <button type="button" className="modal-close" onClick={() => setViewingItem(null)}><X size={20} /></button>
            </div>
            <div className="view-body">
              <h3>{viewingItem.title}</h3>
              <p style={{ lineHeight: 1.6 }}>{viewingItem.content}</p>
              <div className="view-footer" style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12, marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748b" }}>
                <span>Audience: <strong>{viewingItem.audience}</strong></span>
                <span>Date: <strong>{viewingItem.date}</strong></span>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-submit" onClick={() => setViewingItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
