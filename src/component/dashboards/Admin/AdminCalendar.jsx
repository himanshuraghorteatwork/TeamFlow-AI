import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  X,
  Pencil,
  Trash2,
  Calendar as CalendarIcon,
  Sparkles,
  Rocket,
  Eye,
  Flag,
  AlertTriangle,
  Filter,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminCalendar.css";

const STORAGE_KEY = "teamflow_admin_calendar";

const initialEvents = [
  { id: 1, title: "Sprint 14 Sprint Review", date: "2026-10-24", type: "Review", color: "#0284c7" },
  { id: 2, title: "Enterprise SSO Integration Live", date: "2026-10-26", type: "Milestone", color: "#10b981" },
  { id: 3, title: "Q4 Platform Release v2.5", date: "2026-10-28", type: "Release", color: "#6366f1" },
  { id: 4, title: "Executive Product Strategy Sync", date: "2026-10-29", type: "Review", color: "#0284c7" },
  { id: 5, title: "SOC2 Compliance Security Audit", date: "2026-10-31", type: "Milestone", color: "#e11d48" },
  { id: 6, title: "Mobile App V1 Final Code Freeze", date: "2026-11-04", type: "Deadline", color: "#f59e0b" },
  { id: 7, title: "Design System 2.0 Workshop", date: "2026-11-08", type: "Review", color: "#8b5cf6" },
];

const loadEvents = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return initialEvents;
};

export default function AdminCalendar() {
  const [events, setEvents] = useState(loadEvents);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026
  const [typeFilter, setTypeFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    title: "",
    date: "2026-10-26",
    type: "Milestone",
    color: "#6366f1",
  });

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (message) => setToast(message);

  const saveEvents = (newEvents) => {
    setEvents(newEvents);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
    } catch (e) {}
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const jumpToday = () => {
    setCurrentDate(new Date(2026, 9, 26));
  };

  const monthYearLabel = useMemo(() => {
    return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [currentDate]);

  // Calendar days grid
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysCount; i++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const dayEvents = events.filter((e) => e.date === dateString);
      days.push({
        dayNumber: i,
        dateString,
        isCurrentMonth: true,
        events: dayEvents,
        isToday: dateString === "2026-10-26",
      });
    }
    return days;
  }, [currentDate, events]);

  const filteredUpcoming = useMemo(() => {
    if (typeFilter === "All") return events;
    return events.filter((e) => e.type.toLowerCase() === typeFilter.toLowerCase());
  }, [events, typeFilter]);

  const openCreateModal = (presetDate = null) => {
    setEditingEvent(null);
    setForm({
      title: "",
      date: presetDate || "2026-10-26",
      type: "Milestone",
      color: "#6366f1",
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Event title is required.");
      return;
    }

    if (editingEvent) {
      const updated = events.map((ev) => (ev.id === editingEvent.id ? { ...ev, ...form } : ev));
      saveEvents(updated);
      showToast("Calendar event updated.");
    } else {
      const newEv = { id: Date.now(), ...form };
      saveEvents([...events, newEv]);
      showToast("Event scheduled successfully.");
    }
    setShowModal(false);
  };

  const deleteEvent = (id) => {
    saveEvents(events.filter((e) => e.id !== id));
    showToast("Event deleted.");
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "release":
        return <Rocket size={12} />;
      case "review":
        return <Eye size={12} />;
      case "milestone":
        return <Flag size={12} />;
      case "deadline":
        return <AlertTriangle size={12} />;
      default:
        return <CalendarDays size={12} />;
    }
  };

  return (
    <div className="admin-calendar-app">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="admin-calendar-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        {toast && (
          <div className="admin-calendar-toast">
            <CheckCircle2 size={16} />
            <span>{toast}</span>
          </div>
        )}

        <main className="admin-calendar-content">
          <section className="admin-calendar-heading">
            <div>
              <h1>Organizational Calendar</h1>
              <p>Schedule enterprise milestones, orchestrate release dates, and coordinate cross-workspace deliverables.</p>
            </div>

            <button type="button" className="btn-primary" onClick={() => openCreateModal()}>
              <Plus size={17} />
              <span>Schedule Event</span>
            </button>
          </section>

          {/* CALENDAR TOOLBAR */}
          <div className="calendar-toolbar">
            <div className="month-nav">
              <h2>{monthYearLabel}</h2>
              <div className="nav-buttons">
                <button type="button" className="nav-btn" onClick={prevMonth} title="Previous Month">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" className="today-btn" onClick={jumpToday}>
                  Today
                </button>
                <button type="button" className="nav-btn" onClick={nextMonth} title="Next Month">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="calendar-legend">
              <span className="legend-item">
                <span className="legend-dot purple" /> Release
              </span>
              <span className="legend-item">
                <span className="legend-dot blue" /> Review
              </span>
              <span className="legend-item">
                <span className="legend-dot red" /> Milestone
              </span>
              <span className="legend-item">
                <span className="legend-dot amber" /> Deadline
              </span>
            </div>
          </div>

          <div className="calendar-layout">
            {/* MONTH GRID */}
            <div className="calendar-grid-card">
              <div className="weekdays-row">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              <div className="days-grid">
                {daysInMonth.map((day, idx) => (
                  <div
                    key={idx}
                    className={`day-cell ${!day.isCurrentMonth ? "empty" : ""} ${
                      day.isToday ? "today" : ""
                    }`}
                    onClick={() => day.dateString && openCreateModal(day.dateString)}
                  >
                    {day.dayNumber && (
                      <>
                        <div className="day-number-header">
                          <span className={`day-number ${day.isToday ? "today-badge" : ""}`}>
                            {day.dayNumber}
                          </span>
                          <button
                            type="button"
                            className="cell-add-btn"
                            title={`Add event on ${day.dateString}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              openCreateModal(day.dateString);
                            }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="day-events">
                          {day.events?.map((ev) => (
                            <div
                              key={ev.id}
                              className={`event-chip ${ev.type.toLowerCase()}`}
                              title={`${ev.type}: ${ev.title}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingEvent(ev);
                                setForm(ev);
                                setShowModal(true);
                              }}
                            >
                              <span className="chip-icon">{getTypeIcon(ev.type)}</span>
                              <span className="chip-title">{ev.title}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* UPCOMING SIDEBAR */}
            <aside className="calendar-upcoming-card">
              <div className="upcoming-card-header">
                <div className="upcoming-card-title">
                  <Sparkles size={16} className="upcoming-sparkle" />
                  <h3>Upcoming Milestones</h3>
                </div>
                <span className="upcoming-count-badge">{events.length}</span>
              </div>

              {/* CATEGORY FILTER TABS */}
              <div className="upcoming-filter-tabs">
                {["All", "Release", "Review", "Milestone", "Deadline"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`upcoming-tab-btn ${typeFilter === type ? "active" : ""}`}
                    onClick={() => setTypeFilter(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="upcoming-list">
                {filteredUpcoming.map((ev) => (
                  <div
                    key={ev.id}
                    className={`upcoming-item type-${ev.type.toLowerCase()}`}
                    onClick={() => {
                      setEditingEvent(ev);
                      setForm(ev);
                      setShowModal(true);
                    }}
                  >
                    <div className="upcoming-top">
                      <span className={`event-badge ${ev.type.toLowerCase()}`}>
                        {getTypeIcon(ev.type)}
                        {ev.type}
                      </span>
                      <button
                        type="button"
                        className="delete-ev-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEvent(ev.id);
                        }}
                        title="Delete milestone"
                      >
                        <X size={13} />
                      </button>
                    </div>
                    <strong className="upcoming-title">{ev.title}</strong>
                    <div className="upcoming-footer">
                      <div className="upcoming-date">
                        <CalendarDays size={13} />
                        <span>{ev.date}</span>
                      </div>
                      <span className="upcoming-edit-hint">Edit &rarr;</span>
                    </div>
                  </div>
                ))}

                {filteredUpcoming.length === 0 && (
                  <div className="upcoming-empty-state">
                    <CalendarIcon size={24} />
                    <p>No {typeFilter.toLowerCase()} milestones scheduled.</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* SCHEDULE / EDIT MODAL */}
      {showModal && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="modal-box">
            <div className="modal-header">
              <h2>{editingEvent ? "Edit Scheduled Event" : "Schedule New Milestone"}</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>
                  Event / Milestone Title <span className="req">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Q4 Release v2.5"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Scheduled Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Event Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="Release">Release</option>
                    <option value="Review">Review</option>
                    <option value="Milestone">Milestone</option>
                    <option value="Deadline">Deadline</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingEvent ? "Save Changes" : "Schedule Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
