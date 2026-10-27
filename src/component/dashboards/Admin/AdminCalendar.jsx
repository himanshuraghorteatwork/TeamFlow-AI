import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Calendar as CalendarIcon,
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
  Video,
  ExternalLink,
  MoreHorizontal,
  Check,
  Filter,
  ArrowRight,
  Eye,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminCalendar.css";

const STORAGE_KEY = "teamflow_admin_calendar_v2";

const CALENDAR_CATEGORIES = [
  { id: "personal", name: "Personal", color: "#3b82f6" },
  { id: "work", name: "Work", color: "#ef4444" },
  { id: "deadlines", name: "Project Deadlines", color: "#f59e0b" },
  { id: "team", name: "Team Meetings", color: "#10b981" },
  { id: "bugs", name: "Bug Fixes", color: "#e11d48" },
  { id: "org", name: "Organization Events", color: "#8b5cf6" },
];

const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Team Sync",
    date: "2024-10-01",
    time: "10:00 AM - 11:00 AM",
    timeDisplay: "10:00 AM",
    category: "Personal",
    color: "#3b82f6",
    location: "Meeting Room B",
    teamExtra: "+3",
    team: [
      { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
      { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 2,
    title: "Project Review",
    date: "2024-10-02",
    time: "11:00 AM - 12:30 PM",
    timeDisplay: "11:00 AM",
    category: "Team Meetings",
    color: "#10b981",
    location: "Online (Google Meet)",
    teamExtra: "+5",
    team: [
      { name: "Amit Kumar", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" },
      { name: "Sneha Singh", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 3,
    title: "Client Meeting",
    date: "2024-10-04",
    time: "2:00 PM - 3:00 PM",
    timeDisplay: "2:00 PM",
    category: "Organization Events",
    color: "#8b5cf6",
    location: "Conference Room 1",
    teamExtra: "+4",
    team: [
      { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
      { name: "Vikram Reddy", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 4,
    title: "Sprint Planning",
    date: "2024-10-07",
    time: "1:00 PM - 2:30 PM",
    timeDisplay: "1:00 PM",
    category: "Work",
    color: "#ef4444",
    location: "War Room",
    teamExtra: "+6",
    team: [
      { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
      { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 5,
    title: "Product Demo",
    date: "2024-10-08",
    time: "11:00 AM - 12:00 PM",
    timeDisplay: "11:00 AM",
    category: "Personal",
    color: "#3b82f6",
    location: "Demo Lab",
    teamExtra: "+4",
    team: [
      { name: "David Lee", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" },
      { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 6,
    title: "Bug Review",
    date: "2024-10-10",
    time: "3:00 PM - 4:00 PM",
    timeDisplay: "3:00 PM",
    category: "Project Deadlines",
    color: "#f59e0b",
    location: "QA Pod",
    teamExtra: "+2",
    team: [
      { name: "Sneha Singh", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" },
      { name: "Vikram Reddy", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 7,
    title: "Design Discussion",
    date: "2024-10-14",
    time: "10:00 AM - 11:30 AM",
    timeDisplay: "10:00 AM",
    category: "Team Meetings",
    color: "#10b981",
    location: "Design Studio",
    teamExtra: "+3",
    team: [
      { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
      { name: "Sneha Singh", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 8,
    title: "Release Planning",
    date: "2024-10-16",
    time: "2:00 PM - 3:30 PM",
    timeDisplay: "2:00 PM",
    category: "Organization Events",
    color: "#8b5cf6",
    location: "Executive Hall",
    teamExtra: "+5",
    team: [
      { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
      { name: "David Lee", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 9,
    title: "Stakeholder Call",
    date: "2024-10-18",
    time: "11:00 AM - 12:00 PM",
    timeDisplay: "11:00 AM",
    category: "Work",
    color: "#ef4444",
    location: "Online Zoom Call",
    teamExtra: "+4",
    team: [
      { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" },
      { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 10,
    title: "AI Integration Update",
    date: "2024-10-21",
    time: "1:00 PM - 2:00 PM",
    timeDisplay: "1:00 PM",
    category: "Personal",
    color: "#3b82f6",
    location: "AI Workspace",
    teamExtra: "+3",
    team: [
      { name: "Amit Kumar", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" },
      { name: "Sneha Singh", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 11,
    title: "Marketing Meeting",
    date: "2024-10-23",
    time: "10:00 AM - 11:30 AM",
    timeDisplay: "10:00 AM",
    category: "Project Deadlines",
    color: "#f59e0b",
    location: "Marketing Hub",
    teamExtra: "+6",
    team: [
      { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" },
      { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 12,
    title: "Admin Review Meeting",
    date: "2024-10-24",
    time: "11:00 AM - 12:00 PM",
    timeDisplay: "11:00 AM Admin Review",
    category: "Personal",
    color: "#3b82f6",
    location: "Meeting Room A",
    teamExtra: "+3",
    team: [
      { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
      { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
      { name: "Amit Kumar", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 13,
    title: "Team Demo",
    date: "2024-10-24",
    time: "3:00 PM - 4:00 PM",
    timeDisplay: "3:00 PM Team Demo",
    category: "Organization Events",
    color: "#8b5cf6",
    location: "Online (Google Meet)",
    teamExtra: "+2",
    team: [
      { name: "Sneha Singh", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" },
      { name: "Vikram Reddy", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 14,
    title: "Project Deadline",
    date: "2024-10-25",
    time: "12:00 PM - 1:00 PM",
    timeDisplay: "12:00 PM",
    category: "Team Meetings",
    color: "#10b981",
    location: "Release Pipeline",
    teamExtra: "+4",
    team: [
      { name: "David Lee", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" },
      { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 15,
    title: "Bug Triage Meeting",
    date: "2024-10-28",
    time: "2:00 PM - 3:00 PM",
    timeDisplay: "2:00 PM",
    category: "Work",
    color: "#ef4444",
    location: "QA Central",
    teamExtra: "+3",
    team: [
      { name: "Vikram Reddy", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" },
      { name: "Sneha Singh", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 16,
    title: "Monthly Review",
    date: "2024-10-30",
    time: "11:00 AM - 12:00 PM",
    timeDisplay: "11:00 AM",
    category: "Personal",
    color: "#3b82f6",
    location: "Main Auditorium",
    teamExtra: "+5",
    team: [
      { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
      { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
    ],
  },
];

export default function AdminCalendar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Events State
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_EVENTS;
  });

  // Current Calendar Date
  const [selectedDate, setSelectedDate] = useState("2024-10-24");
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2024, 9, 1)); // October 2024

  // Active View Mode (Month, Week, Day, List)
  const [viewMode, setViewMode] = useState("month");

  // Category filter checkboxes
  const [activeCategories, setActiveCategories] = useState({
    Personal: true,
    Work: true,
    "Project Deadlines": true,
    "Team Meetings": true,
    "Bug Fixes": true,
    "Organization Events": true,
  });

  // Modals
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [toast, setToast] = useState(null);
  const [joinModalEvent, setJoinModalEvent] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: "",
    date: "2024-10-24",
    time: "11:00 AM - 12:00 PM",
    category: "Team Meetings",
    location: "Meeting Room A",
    color: "#10b981",
  });

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const saveEvents = (newEvents) => {
    setEvents(newEvents);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
    } catch (e) {}
  };

  // Month navigation
  const nextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const jumpToday = () => {
    setCurrentMonthDate(new Date(2024, 9, 1));
    setSelectedDate("2024-10-24");
  };

  const monthYearLabel = useMemo(() => {
    return currentMonthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [currentMonthDate]);

  // Toggle category
  const toggleCategory = (catName) => {
    setActiveCategories((prev) => ({ ...prev, [catName]: !prev[catName] }));
  };

  // Filtered events based on active category checkboxes
  const visibleEvents = useMemo(() => {
    return events.filter((ev) => activeCategories[ev.category] !== false);
  }, [events, activeCategories]);

  // Selected Day Events for Right Panel
  const selectedDayEvents = useMemo(() => {
    return visibleEvents.filter((ev) => ev.date === selectedDate);
  }, [visibleEvents, selectedDate]);

  // Upcoming events
  const upcomingEvents = useMemo(() => {
    return visibleEvents
      .filter((ev) => ev.date > "2024-10-24")
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3);
  }, [visibleEvents]);

  // Calendar Grid Cells generation (for October 2024)
  // Sep 29, 30 (prev month), Oct 1 to 31, Nov 1, 2 (next month)
  const calendarCells = useMemo(() => {
    const cells = [];
    // 2 days from Sep (29, 30)
    cells.push({ dayNumber: 29, dateStr: "2024-09-29", isCurrentMonth: false });
    cells.push({ dayNumber: 30, dateStr: "2024-09-30", isCurrentMonth: false });

    // 31 days of October
    for (let d = 1; d <= 31; d++) {
      const dayStr = `2024-10-${String(d).padStart(2, "0")}`;
      cells.push({ dayNumber: d, dateStr: dayStr, isCurrentMonth: true });
    }

    // 2 days of November
    cells.push({ dayNumber: 1, dateStr: "2024-11-01", isCurrentMonth: false });
    cells.push({ dayNumber: 2, dateStr: "2024-11-02", isCurrentMonth: false });

    return cells;
  }, []);

  // Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast("Event title is required.", "error");
      return;
    }

    const catObj = CALENDAR_CATEGORIES.find((c) => c.name === form.category) || CALENDAR_CATEGORIES[0];

    if (editingEvent) {
      const updated = events.map((ev) =>
        ev.id === editingEvent.id
          ? {
              ...ev,
              title: form.title,
              date: form.date,
              time: form.time,
              timeDisplay: form.time.split("-")[0].trim(),
              category: form.category,
              color: catObj.color,
              location: form.location,
            }
          : ev
      );
      saveEvents(updated);
      setEditingEvent(null);
      showToast(`Updated event "${form.title}".`);
    } else {
      const newEv = {
        id: Date.now(),
        title: form.title,
        date: form.date,
        time: form.time,
        timeDisplay: form.time.split("-")[0].trim(),
        category: form.category,
        color: catObj.color,
        location: form.location,
        teamExtra: "+2",
        team: [
          { name: "Amit Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
        ],
      };
      saveEvents([...events, newEv]);
      showToast(`Scheduled new event "${newEv.title}".`);
    }

    setShowEventModal(false);
  };

  const openCreateModal = (presetDate = null) => {
    setEditingEvent(null);
    setForm({
      title: "",
      date: presetDate || selectedDate,
      time: "10:00 AM - 11:00 AM",
      category: "Team Meetings",
      location: "Meeting Room A",
      color: "#10b981",
    });
    setShowEventModal(true);
  };

  const openEditModal = (ev) => {
    setEditingEvent(ev);
    setForm({
      title: ev.title,
      date: ev.date,
      time: ev.time,
      category: ev.category,
      location: ev.location,
      color: ev.color,
    });
    setShowEventModal(true);
  };

  const deleteEvent = (id) => {
    saveEvents(events.filter((ev) => ev.id !== id));
    showToast("Event deleted successfully.");
  };

  return (
    <div className="tfCalApp">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="tfCalApp__container">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        {toast && (
          <div className={`tfCalToast toast--${toast.type}`}>
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        <main className="tfCalApp__content">
          {/* =========================================================
              HEADER SECTION
          ========================================================= */}
          <section className="tfCalHeader">
            <div className="tfCalHeader__left">
              <div className="tfCalHeader__iconBox">
                <CalendarIcon size={24} />
              </div>
              <div className="tfCalHeader__titleGroup">
                <h1>Calendar</h1>
                <p>Manage meetings, deadlines, and important events across your organization.</p>
              </div>
            </div>

            <div className="tfCalHeader__actions">
              <button
                type="button"
                className="tfCalBtn tfCalBtn--primary"
                onClick={() => openCreateModal()}
              >
                <Plus size={16} />
                <span>Add Event</span>
              </button>

              <button
                type="button"
                className="tfCalBtn tfCalBtn--secondary"
                onClick={() => {
                  setActiveCategories({
                    Personal: true,
                    Work: true,
                    "Project Deadlines": true,
                    "Team Meetings": true,
                    "Bug Fixes": true,
                    "Organization Events": true,
                  });
                  showToast("Calendar filters reset.");
                }}
              >
                <Filter size={15} />
                <span>Filters</span>
              </button>
            </div>
          </section>

          {/* =========================================================
              TOP CONTROLS BAR: MONTH NAV & VIEW TOGGLES
          ========================================================= */}
          <section className="tfCalControlsBar">
            <div className="tfCalControlsBar__left">
              <button type="button" className="today-btn" onClick={jumpToday}>
                Today
              </button>

              <div className="arrow-nav-group">
                <button type="button" className="nav-arrow" onClick={prevMonth} aria-label="Previous month">
                  <ChevronLeft size={16} />
                </button>
                <button type="button" className="nav-arrow" onClick={nextMonth} aria-label="Next month">
                  <ChevronRight size={16} />
                </button>
              </div>

              <h2 className="month-heading">{monthYearLabel}</h2>
            </div>

            <div className="tfCalControlsBar__right">
              <div className="view-mode-toggle">
                <button
                  type="button"
                  className={`view-pill ${viewMode === "month" ? "active" : ""}`}
                  onClick={() => setViewMode("month")}
                >
                  Month
                </button>
                <button
                  type="button"
                  className={`view-pill ${viewMode === "week" ? "active" : ""}`}
                  onClick={() => setViewMode("week")}
                >
                  Week
                </button>
                <button
                  type="button"
                  className={`view-pill ${viewMode === "day" ? "active" : ""}`}
                  onClick={() => setViewMode("day")}
                >
                  Day
                </button>
                <button
                  type="button"
                  className={`view-pill ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  List
                </button>
              </div>
            </div>
          </section>

          {/* =========================================================
              3-COLUMN MAIN LAYOUT:
              1. MAIN CALENDAR GRID (LEFT)
              2. MINI CALENDAR + MY CALENDARS (MIDDLE)
              3. EVENTS ON DATE + UPCOMING (RIGHT)
          ========================================================= */}
          <div className="tfCalGrid3Col">
            {/* 1. MAIN CALENDAR GRID */}
            <div className="tfCalMainGridCard">
              {viewMode === "month" && (
                <div className="month-calendar-view">
                  <div className="calendar-weekdays-row">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                  </div>

                  <div className="calendar-month-cells">
                    {calendarCells.map((cell, idx) => {
                      const isToday = cell.dateStr === "2024-10-24";
                      const isSelected = cell.dateStr === selectedDate;
                      const cellEvents = visibleEvents.filter((ev) => ev.date === cell.dateStr);

                      return (
                        <div
                          key={idx}
                          className={`month-cell ${!cell.isCurrentMonth ? "other-month" : ""} ${isSelected ? "selected-day" : ""}`}
                          onClick={() => setSelectedDate(cell.dateStr)}
                        >
                          <div className="month-cell-header">
                            <span className={`day-number ${isToday ? "today-badge" : ""}`}>
                              {cell.dayNumber}
                            </span>
                          </div>

                          <div className="cell-events-list">
                            {cellEvents.map((ev) => (
                              <div
                                key={ev.id}
                                className="cal-event-pill"
                                style={{
                                  backgroundColor: `${ev.color}14`,
                                  borderColor: ev.color,
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(ev);
                                }}
                                title={`${ev.time}: ${ev.title}`}
                              >
                                <span className="cal-event-text" style={{ color: ev.color }}>
                                  <strong>{ev.timeDisplay}</strong> {ev.title}
                                </span>

                                {ev.team && ev.team.length > 0 && (
                                  <div className="cal-event-avatars">
                                    {ev.team.slice(0, 2).map((m, i) => (
                                      <img key={i} src={m.avatar} alt={m.name} className="pill-avatar" />
                                    ))}
                                    {ev.teamExtra && <span className="extra-count">{ev.teamExtra}</span>}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {viewMode === "week" && (
                <div className="week-view-wrapper">
                  <div className="week-header-strip">
                    {["Mon 21", "Tue 22", "Wed 23", "Thu 24 (Today)", "Fri 25", "Sat 26", "Sun 27"].map((d, i) => (
                      <div key={d} className={`week-strip-col ${i === 3 ? "today-highlight" : ""}`}>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>

                  <div className="week-columns-container">
                    {[21, 22, 23, 24, 25, 26, 27].map((d) => {
                      const dStr = `2024-10-${d}`;
                      const dayEvs = visibleEvents.filter((ev) => ev.date === dStr);

                      return (
                        <div
                          key={d}
                          className={`week-col ${d === 24 ? "today-col" : ""}`}
                          onClick={() => openCreateModal(dStr)}
                        >
                          {dayEvs.map((ev) => (
                            <div
                              key={ev.id}
                              className="week-ev-card"
                              style={{ borderLeftColor: ev.color, backgroundColor: `${ev.color}15` }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(ev);
                              }}
                            >
                              <strong style={{ color: ev.color }}>{ev.time}</strong>
                              <span className="ev-name">{ev.title}</span>
                              <small>{ev.location}</small>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {viewMode === "day" && (
                <div className="day-view-wrapper">
                  <div className="day-view-header">
                    <h3>Schedule for {selectedDate}</h3>
                    <button type="button" className="btn-primary-mini" onClick={() => openCreateModal(selectedDate)}>
                      + Add Time Slot
                    </button>
                  </div>
                  <div className="day-hourly-agenda">
                    {["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"].map((hour) => {
                      const hourEvs = selectedDayEvents.filter((e) => e.time.startsWith(hour.slice(0, 2)));
                      return (
                        <div key={hour} className="hour-slot-row">
                          <span className="slot-time">{hour}</span>
                          <div className="slot-content">
                            {hourEvs.length > 0 ? (
                              hourEvs.map((e) => (
                                <div key={e.id} className="hour-ev-box" style={{ borderLeftColor: e.color, backgroundColor: `${e.color}14` }}>
                                  <strong style={{ color: e.color }}>{e.title}</strong>
                                  <span>{e.time} ({e.location})</span>
                                </div>
                              ))
                            ) : (
                              <div className="slot-empty" onClick={() => openCreateModal(selectedDate)}>
                                <span>+ Available slot</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {viewMode === "list" && (
                <div className="list-view-wrapper">
                  <div className="list-view-header">
                    <h3>All Scheduled Events ({visibleEvents.length})</h3>
                  </div>
                  <div className="list-items-table">
                    {visibleEvents.map((ev) => (
                      <div key={ev.id} className="list-event-row">
                        <div className="list-date-box" style={{ borderLeftColor: ev.color }}>
                          <span className="day">{ev.date.split("-")[2]}</span>
                          <span className="month">Oct</span>
                        </div>
                        <div className="list-info">
                          <strong>{ev.title}</strong>
                          <span>{ev.time} · {ev.location}</span>
                        </div>
                        <div className="list-actions">
                          <button type="button" className="mini-btn" onClick={() => openEditModal(ev)}>
                            Edit
                          </button>
                          <button type="button" className="mini-btn danger" onClick={() => deleteEvent(ev.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. MIDDLE COLUMN: MINI CALENDAR & MY CALENDARS */}
            <div className="tfCalMiddleCol">
              {/* MINI MONTH CALENDAR */}
              <div className="tfCalMiniCard">
                <div className="mini-header">
                  <strong>October 2024</strong>
                  <div className="mini-arrows">
                    <button type="button" onClick={prevMonth}><ChevronLeft size={14} /></button>
                    <button type="button" onClick={nextMonth}><ChevronRight size={14} /></button>
                  </div>
                </div>

                <div className="mini-grid">
                  <div className="mini-weekdays">
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>

                  <div className="mini-days">
                    {/* Sep 29, 30 */}
                    <span className="other">29</span>
                    <span className="other">30</span>
                    {/* Oct 1 to 31 */}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                      const dStr = `2024-10-${String(d).padStart(2, "0")}`;
                      const isToday = d === 24;
                      const isSelected = dStr === selectedDate;

                      return (
                        <span
                          key={d}
                          className={`${isToday ? "today-circle" : ""} ${isSelected && !isToday ? "selected-circle" : ""}`}
                          onClick={() => setSelectedDate(dStr)}
                        >
                          {d}
                        </span>
                      );
                    })}
                    {/* Nov 1, 2 */}
                    <span className="other">1</span>
                    <span className="other">2</span>
                  </div>
                </div>
              </div>

              {/* MY CALENDARS CATEGORY TOGGLE */}
              <div className="tfCalCategoriesCard">
                <div className="card-top-row">
                  <h3>My Calendars</h3>
                  <button type="button" className="add-cat-btn" onClick={() => openCreateModal()}>
                    <Plus size={14} />
                  </button>
                </div>

                <div className="categories-list">
                  {CALENDAR_CATEGORIES.map((cat) => {
                    const isChecked = activeCategories[cat.name] !== false;

                    return (
                      <label key={cat.id} className="category-checkbox-row">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(cat.name)}
                        />
                        <span className="cat-color-dot" style={{ backgroundColor: cat.color }} />
                        <span className="cat-name">{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. RIGHT COLUMN: EVENTS ON DATE & UPCOMING */}
            <div className="tfCalRightCol">
              {/* EVENTS ON SELECTED DATE */}
              <div className="tfCalDayEventsCard">
                <div className="card-top-row">
                  <h3>Events on Oct 24, 2024</h3>
                </div>

                <div className="day-events-list">
                  {selectedDayEvents.length === 0 ? (
                    <div className="empty-events-state">
                      <p>No events scheduled for this day.</p>
                      <button type="button" className="btn-secondary-mini" onClick={() => openCreateModal(selectedDate)}>
                        + Add Event
                      </button>
                    </div>
                  ) : (
                    selectedDayEvents.map((ev) => (
                      <div key={ev.id} className="day-event-card" style={{ borderLeftColor: ev.color }}>
                        <div className="event-card-header">
                          <span className="event-time">{ev.time}</span>
                          <button
                            type="button"
                            className="more-dots"
                            onClick={() => openEditModal(ev)}
                            title="Edit Event"
                          >
                            <MoreHorizontal size={14} />
                          </button>
                        </div>

                        <strong className="event-title">{ev.title}</strong>

                        <div className="event-location">
                          <Users size={13} />
                          <span>{ev.location}</span>
                        </div>

                        {ev.team && ev.team.length > 0 && (
                          <div className="event-team-row">
                            <div className="avatar-stack">
                              {ev.team.map((m, i) => (
                                <img key={i} src={m.avatar} alt={m.name} className="stacked-avatar" />
                              ))}
                              {ev.teamExtra && <span className="extra-count">{ev.teamExtra}</span>}
                            </div>
                          </div>
                        )}

                        <div className="event-actions-bar">
                          <button
                            type="button"
                            className="btn-join"
                            onClick={() => setJoinModalEvent(ev)}
                          >
                            Join
                          </button>
                          <button
                            type="button"
                            className="btn-action-light"
                            onClick={() => openEditModal(ev)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn-action-light btn-delete"
                            onClick={() => deleteEvent(ev.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* UPCOMING EVENTS */}
              <div className="tfCalUpcomingCard">
                <div className="card-top-row">
                  <h3>Upcoming Events</h3>
                  <button type="button" className="view-all-link" onClick={() => setViewMode("list")}>
                    View all <ArrowRight size={11} />
                  </button>
                </div>

                <div className="upcoming-events-list">
                  {upcomingEvents.map((ev) => (
                    <div key={ev.id} className="upcoming-item">
                      <div className="upcoming-date-box" style={{ color: ev.color }}>
                        <CalendarDays size={18} />
                        <span className="date-str">{ev.date.split("-")[1]}/{ev.date.split("-")[2]}</span>
                      </div>

                      <div className="upcoming-meta">
                        <strong className="up-title">{ev.title}</strong>
                        <span className="up-time">{ev.time}</span>
                      </div>

                      <button
                        type="button"
                        className="more-dots"
                        onClick={() => openEditModal(ev)}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* =========================================================
          ADD / EDIT EVENT MODAL
      ========================================================= */}
      {showEventModal && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowEventModal(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <h2>{editingEvent ? "Edit Event" : "Schedule New Event"}</h2>
              <button type="button" className="modal-close" onClick={() => setShowEventModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-group">
                <label>Event Title <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Executive Product Sync"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time Window</label>
                  <input
                    type="text"
                    placeholder="10:00 AM - 11:30 AM"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Calendar Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {CALENDAR_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Room / Video Link</label>
                  <input
                    type="text"
                    placeholder="e.g. Meeting Room A or Google Meet"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEventModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingEvent ? "Save Changes" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          LIVE VIDEO CALL MODAL
      ========================================================= */}
      {joinModalEvent && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setJoinModalEvent(null); }}>
          <div className="modal-box join-modal-box">
            <div className="modal-header">
              <div className="join-title">
                <Video size={20} className="text-green" />
                <h2>Joining {joinModalEvent.title}</h2>
              </div>
              <button type="button" className="modal-close" onClick={() => setJoinModalEvent(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="join-modal-body">
              <div className="join-preview-box">
                <div className="camera-placeholder">
                  <Users size={36} />
                  <span>Camera and Audio Connected</span>
                </div>
              </div>
              <div className="join-meta">
                <p><strong>Location:</strong> {joinModalEvent.location}</p>
                <p><strong>Time:</strong> {joinModalEvent.time}</p>
                <p><strong>Participants:</strong> 4 squad members in waiting room</p>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setJoinModalEvent(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-submit btn-join-now"
                onClick={() => {
                  showToast("Connected to live meeting audio & video channel.");
                  setJoinModalEvent(null);
                }}
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
