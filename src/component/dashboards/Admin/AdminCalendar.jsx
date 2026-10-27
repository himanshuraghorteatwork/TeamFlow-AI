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
  RotateCcw,
  Sparkles,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminCalendar.css";

const STORAGE_KEY = "teamflow_admin_calendar_v3";

const CALENDAR_CATEGORIES = [
  { id: "personal", name: "Personal", color: "#3b82f6" },
  { id: "work", name: "Work", color: "#f97316" },
  { id: "deadlines", name: "Project Deadlines", color: "#ef4444" },
  { id: "team", name: "Team Meetings", color: "#10b981" },
  { id: "bugs", name: "Bug Fixes", color: "#8b5cf6" },
  { id: "org", name: "Organization Events", color: "#06b6d4" },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS_LIST = Array.from({ length: 16 }, (_, i) => 2020 + i);

// Comprehensive events covering February 2024 (screenshot match) and current dates
const DEFAULT_EVENTS = [
  // --- February 2024 Events (Exact Match to Screenshot) ---
  {
    id: 101,
    title: "Team Meeting",
    date: "2024-02-01",
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
    id: 102,
    title: "Project Review",
    date: "2024-02-02",
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
    id: 103,
    title: "Sprint Planning",
    date: "2024-02-05",
    time: "1:00 PM - 2:30 PM",
    timeDisplay: "1:00 PM",
    category: "Work",
    color: "#f97316",
    location: "War Room",
    teamExtra: "+6",
    team: [
      { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
      { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 104,
    title: "Product Disc...",
    date: "2024-02-06",
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
    id: 105,
    title: "Bug Review",
    date: "2024-02-10",
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
    id: 106,
    title: "Design Disc...",
    date: "2024-02-13",
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
    id: 107,
    title: "Release Plan...",
    date: "2024-02-15",
    time: "2:00 PM - 3:30 PM",
    timeDisplay: "2:00 PM",
    category: "Bug Fixes",
    color: "#8b5cf6",
    location: "Executive Hall",
    teamExtra: "+5",
    team: [
      { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
      { name: "David Lee", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 108,
    title: "AI Integration...",
    date: "2024-02-20",
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
    id: 109,
    title: "Marketing ...",
    date: "2024-02-23",
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
    id: 110,
    title: "Admin Review",
    date: "2024-02-24",
    time: "11:00 AM - 12:00 PM",
    timeDisplay: "11:00 AM",
    category: "Personal",
    color: "#3b82f6",
    location: "Meeting Room A",
    teamExtra: "+3",
    team: [
      { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
      { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 111,
    title: "Team Demo",
    date: "2024-02-24",
    time: "3:00 PM - 4:00 PM",
    timeDisplay: "3:00 PM",
    category: "Bug Fixes",
    color: "#8b5cf6",
    location: "Online (Google Meet)",
    teamExtra: "+2",
    team: [
      { name: "Sneha Singh", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" },
      { name: "Vikram Reddy", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 112,
    title: "Project Deadline",
    date: "2024-02-25",
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
    id: 113,
    title: "Bug Triage Meeting",
    date: "2024-02-27",
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
    id: 114,
    title: "Monthly Review",
    date: "2024-02-29",
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

  // --- Real Current Date Sample Events (October 2026 / Dynamic) ---
  {
    id: 201,
    title: "Team Daily Standup",
    date: "2026-10-27",
    time: "10:00 AM - 10:30 AM",
    timeDisplay: "10:00 AM",
    category: "Personal",
    color: "#3b82f6",
    location: "Virtual Meeting Room 1",
    teamExtra: "+4",
    team: [
      { name: "Amit Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
      { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 202,
    title: "Production Release Gate",
    date: "2026-10-27",
    time: "02:00 PM - 03:00 PM",
    timeDisplay: "02:00 PM",
    category: "Bug Fixes",
    color: "#8b5cf6",
    location: "DevOps Console",
    teamExtra: "+3",
    team: [
      { name: "Vikram Reddy", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 203,
    title: "Security Sprint Review",
    date: "2026-10-28",
    time: "11:00 AM - 12:00 PM",
    timeDisplay: "11:00 AM",
    category: "Project Deadlines",
    color: "#ef4444",
    location: "SecOps Pod",
    teamExtra: "+5",
    team: [
      { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 204,
    title: "Product Roadmap Q4",
    date: "2026-10-29",
    time: "03:00 PM - 04:30 PM",
    timeDisplay: "03:00 PM",
    category: "Team Meetings",
    color: "#10b981",
    location: "Executive Hall",
    teamExtra: "+8",
    team: [
      { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 205,
    title: "Monthly All-Hands",
    date: "2026-10-31",
    time: "04:00 PM - 05:00 PM",
    timeDisplay: "04:00 PM",
    category: "Organization Events",
    color: "#06b6d4",
    location: "Main Auditorium",
    teamExtra: "+15",
    team: [
      { name: "Amit Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
    ],
  },
];

export default function AdminCalendar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Real today timestamp
  const realToday = useMemo(() => new Date(), []);
  const realTodayStr = useMemo(() => {
    const y = realToday.getFullYear();
    const m = String(realToday.getMonth() + 1).padStart(2, "0");
    const d = String(realToday.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [realToday]);

  // Current Calendar Date (defaults to February 2024 to match screenshot or today)
  // Let's set initial view to February 2024 (screenshot) with quick toggle to Today
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1)); // Feb 2024
  const [selectedDate, setSelectedDate] = useState("2024-02-24"); // matches screenshot highlighted 24

  // View Mode: Month, Week, Day, List
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

  // Events State with persistence
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) return parsed;
      }
    } catch (e) {}
    return DEFAULT_EVENTS;
  });

  // Modals & Feedback
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [toast, setToast] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: "",
    date: "2024-02-24",
    time: "10:00 AM - 11:00 AM",
    category: "Personal",
    location: "Meeting Room A",
    color: "#3b82f6",
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
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const jumpToToday = () => {
    setCurrentDate(new Date(realToday.getFullYear(), realToday.getMonth(), 1));
    setSelectedDate(realTodayStr);
    showToast(`Jumped to today: ${realToday.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`);
  };

  const jumpToScreenshotFeb = () => {
    setCurrentDate(new Date(2024, 1, 1));
    setSelectedDate("2024-02-24");
    showToast("Viewing February 2024 (Screenshot Mode)");
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthYearLabel = useMemo(() => {
    return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [currentDate]);

  // Toggle category
  const toggleCategory = (catName) => {
    setActiveCategories((prev) => ({ ...prev, [catName]: !prev[catName] }));
  };

  // Filtered events based on active category checkboxes
  const visibleEvents = useMemo(() => {
    return events.filter((ev) => activeCategories[ev.category] !== false);
  }, [events, activeCategories]);

  // Selected Day Events
  const selectedDayEvents = useMemo(() => {
    return visibleEvents.filter((ev) => ev.date === selectedDate);
  }, [visibleEvents, selectedDate]);

  // Upcoming events sorted chronologically relative to viewed date
  const upcomingEvents = useMemo(() => {
    return visibleEvents
      .filter((ev) => ev.date >= selectedDate)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
      .slice(0, 5);
  }, [visibleEvents, selectedDate]);

  // =========================================================
  // REAL DYNAMIC CALENDAR MATHEMATICS FOR ANY MONTH & YEAR
  // =========================================================
  const calendarCells = useMemo(() => {
    const cells = [];
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevDate = new Date(currentYear, currentMonth - 1, d);
      const y = prevDate.getFullYear();
      const m = String(prevDate.getMonth() + 1).padStart(2, "0");
      const dStr = String(d).padStart(2, "0");
      cells.push({
        dayNumber: d,
        dateStr: `${y}-${m}-${dStr}`,
        isCurrentMonth: false,
        isPrevMonth: true,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const m = String(currentMonth + 1).padStart(2, "0");
      const dStr = String(d).padStart(2, "0");
      cells.push({
        dayNumber: d,
        dateStr: `${currentYear}-${m}-${dStr}`,
        isCurrentMonth: true,
      });
    }

    // Next month leading days to complete full 35 or 42 slots
    const totalSlots = cells.length > 35 ? 42 : 35;
    const remaining = totalSlots - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(currentYear, currentMonth + 1, d);
      const y = nextDate.getFullYear();
      const m = String(nextDate.getMonth() + 1).padStart(2, "0");
      const dStr = String(d).padStart(2, "0");
      cells.push({
        dayNumber: d,
        dateStr: `${y}-${m}-${dStr}`,
        isCurrentMonth: false,
        isNextMonth: true,
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  // Form Submit (Add or Edit Event)
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
      showToast(`Scheduled event "${newEv.title}".`);
    }

    setShowEventModal(false);
  };

  const openCreateModal = (presetDate = null) => {
    setEditingEvent(null);
    setForm({
      title: "",
      date: presetDate || selectedDate,
      time: "10:00 AM - 11:00 AM",
      category: "Personal",
      location: "Meeting Room A",
      color: "#3b82f6",
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
              HEADER SECTION (Matches Screenshot)
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
                  showToast("Calendar filters reset to show all categories.");
                }}
              >
                <Filter size={15} />
                <span>Filters</span>
              </button>
            </div>
          </section>

          {/* =========================================================
              CONTROLS BAR: TODAY, NAV ARROWS, MONTH/YEAR PICKERS, VIEWS
          ========================================================= */}
          <section className="tfCalControlsBar">
            <div className="tfCalControlsBar__left">
              <button type="button" className="today-btn" onClick={jumpToToday} title="Jump to real current date">
                Today
              </button>

              <div className="arrow-nav-group">
                <button type="button" className="nav-arrow" onClick={prevMonth} aria-label="Previous month" title="Previous month">
                  <ChevronLeft size={16} />
                </button>
                <button type="button" className="nav-arrow" onClick={nextMonth} aria-label="Next month" title="Next month">
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Intuitive dynamic month & year pickers like real calendar */}
              <div className="month-year-group">
                <h2 className="month-heading">{monthYearLabel}</h2>
                <div className="quick-selectors-row">
                  <select
                    value={currentMonth}
                    onChange={(e) => setCurrentDate(new Date(currentYear, Number(e.target.value), 1))}
                    className="cal-month-select"
                    aria-label="Select month"
                    title="Change month"
                  >
                    {MONTH_NAMES.map((name, i) => (
                      <option key={name} value={i}>{name}</option>
                    ))}
                  </select>

                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentDate(new Date(Number(e.target.value), currentMonth, 1))}
                    className="cal-year-select"
                    aria-label="Select year"
                    title="Change year"
                  >
                    {YEARS_LIST.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      if (!e.target.value) return;
                      const [y, m] = e.target.value.split("-").map(Number);
                      setSelectedDate(e.target.value);
                      setCurrentDate(new Date(y, m - 1, 1));
                    }}
                    className="cal-custom-date-picker"
                    title="Jump to exact custom date"
                  />
                </div>
              </div>
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
              2-COLUMN MAIN LAYOUT (EXACT REPLICA OF USER SCREENSHOT):
              - LEFT: WIDE MAIN CALENDAR MONTH GRID
              - RIGHT: SIDEBAR (MINI CALENDAR + UPCOMING + MY CALENDARS)
          ========================================================= */}
          <div className="tfCal2ColLayout">
            {/* 1. LEFT MAIN CALENDAR CARD */}
            <div className="tfCalMainCol">
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
                      const isRealToday = cell.dateStr === realTodayStr;
                      const isSelected = cell.dateStr === selectedDate;
                      const isHighlightedCircle = isSelected || isRealToday;
                      const cellEvents = visibleEvents.filter((ev) => ev.date === cell.dateStr);

                      return (
                        <div
                          key={idx}
                          className={`month-cell ${!cell.isCurrentMonth ? "other-month" : ""} ${isSelected ? "selected-day" : ""}`}
                          onClick={() => setSelectedDate(cell.dateStr)}
                        >
                          <div className="month-cell-header">
                            <span className={`day-number ${isHighlightedCircle ? "today-badge" : ""}`}>
                              {cell.dayNumber}
                            </span>
                          </div>

                          <div className="cell-events-list">
                            {cellEvents.map((ev) => (
                              <div
                                key={ev.id}
                                className="cal-event-pill"
                                style={{
                                  backgroundColor: `${ev.color}15`,
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
                    {calendarCells.slice(0, 7).map((c, i) => {
                      const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i];
                      const isToday = c.dateStr === realTodayStr;
                      return (
                        <div key={i} className={`week-strip-col ${isToday ? "today-highlight" : ""}`}>
                          <span>{dayName} {c.dayNumber}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="week-columns-container">
                    {calendarCells.slice(0, 7).map((cell) => {
                      const dayEvs = visibleEvents.filter((ev) => ev.date === cell.dateStr);
                      return (
                        <div
                          key={cell.dateStr}
                          className={`week-col ${cell.dateStr === selectedDate ? "selected-col" : ""}`}
                          onClick={() => openCreateModal(cell.dateStr)}
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
                          <span className="month">{MONTH_NAMES[Number(ev.date.split("-")[1]) - 1]?.slice(0, 3)}</span>
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

            {/* 2. RIGHT SIDEBAR: MINI CALENDAR + UPCOMING EVENTS + MY CALENDARS */}
            <aside className="tfCalSidebarCol">
              {/* CARD 1: MINI CALENDAR (Exact match to screenshot) */}
              <div className="tfCalMiniCard">
                <div className="mini-header">
                  <strong>{monthYearLabel}</strong>
                  <div className="mini-arrows">
                    <button type="button" onClick={prevMonth} aria-label="Previous Month">
                      <ChevronLeft size={14} />
                    </button>
                    <button type="button" onClick={nextMonth} aria-label="Next Month">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="mini-grid">
                  <div className="mini-weekdays">
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>

                  <div className="mini-days">
                    {calendarCells.map((cell, idx) => {
                      const isRealToday = cell.dateStr === realTodayStr;
                      const isSelected = cell.dateStr === selectedDate;

                      return (
                        <span
                          key={idx}
                          className={`mini-day-cell ${!cell.isCurrentMonth ? "other" : ""} ${isRealToday || isSelected ? "today-circle" : ""}`}
                          onClick={() => {
                            setSelectedDate(cell.dateStr);
                            if (!cell.isCurrentMonth) {
                              const [y, m] = cell.dateStr.split("-").map(Number);
                              setCurrentDate(new Date(y, m - 1, 1));
                            }
                          }}
                        >
                          {cell.dayNumber}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CARD 2: UPCOMING EVENTS (Exact match to screenshot) */}
              <div className="tfCalUpcomingCard">
                <div className="card-top-row">
                  <h3>Upcoming Events</h3>
                  <button type="button" className="view-all-link" onClick={() => setViewMode("list")}>
                    <span>View All</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                <div className="upcoming-events-list">
                  {upcomingEvents.length === 0 ? (
                    <div className="empty-upcoming">
                      <p>No upcoming events scheduled.</p>
                      <button type="button" className="btn-secondary-mini" onClick={() => openCreateModal(selectedDate)}>
                        + Add Event
                      </button>
                    </div>
                  ) : (
                    upcomingEvents.map((ev) => (
                      <div key={ev.id} className="upcoming-event-item" onClick={() => openEditModal(ev)}>
                        <div
                          className="upcoming-event-icon-box"
                          style={{
                            background: `${ev.color}18`,
                            color: ev.color,
                            borderColor: `${ev.color}35`,
                          }}
                        >
                          <CalendarDays size={18} />
                        </div>
                        <div className="upcoming-event-info">
                          <strong className="upcoming-event-title">{ev.title}</strong>
                          <span className="upcoming-event-time">
                            {ev.date.slice(5).replace("-", "/")} {ev.time}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="upcoming-event-more"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(ev);
                          }}
                          title="Options"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* CARD 3: MY CALENDARS CATEGORY CHECKBOXES (Exact match to screenshot) */}
              <div className="tfCalCategoriesCard">
                <div className="card-top-row">
                  <h3>My Calendars</h3>
                  <button type="button" className="add-cat-btn" onClick={() => openCreateModal()} title="Add Event">
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
            </aside>
          </div>
        </main>
      </div>

      {/* =========================================================
          EVENT MODAL (CREATE OR EDIT)
      ========================================================= */}
      {showEventModal && (
        <div className="calModalOverlay" onClick={() => setShowEventModal(false)}>
          <div className="calModalBox" onClick={(e) => e.stopPropagation()}>
            <div className="calModalHeader">
              <div className="modal-title-wrap">
                <CalendarIcon size={18} className="modal-icon" />
                <h3>{editingEvent ? "Edit Calendar Event" : "Schedule New Event"}</h3>
              </div>
              <button className="calModalClose" onClick={() => setShowEventModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="calModalBody">
                <div className="calFormGroup">
                  <label>Event Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Sprint Planning, Project Review"
                  />
                </div>

                <div className="calFormRow">
                  <div className="calFormGroup">
                    <label>Date</label>
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </div>

                  <div className="calFormGroup">
                    <label>Time Interval</label>
                    <input
                      type="text"
                      required
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      placeholder="10:00 AM - 11:30 AM"
                    />
                  </div>
                </div>

                <div className="calFormRow">
                  <div className="calFormGroup">
                    <label>Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => {
                        const cat = CALENDAR_CATEGORIES.find((c) => c.name === e.target.value);
                        setForm({
                          ...form,
                          category: e.target.value,
                          color: cat ? cat.color : form.color,
                        });
                      }}
                    >
                      {CALENDAR_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="calFormGroup">
                    <label>Location / Room / Link</label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. Conference Room 2, Google Meet"
                    />
                  </div>
                </div>
              </div>

              <div className="calModalFooter">
                {editingEvent && (
                  <button
                    type="button"
                    className="calBtnDanger"
                    onClick={() => {
                      deleteEvent(editingEvent.id);
                      setShowEventModal(false);
                    }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                )}
                <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                  <button type="button" className="calBtnCancel" onClick={() => setShowEventModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="calBtnSubmit">
                    {editingEvent ? "Save Changes" : "Create Event"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
