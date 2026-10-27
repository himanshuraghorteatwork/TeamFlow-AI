import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  Video,
  Phone,
  Zap,
  Rocket,
  Layers,
  Clock,
  Check,
  CheckSquare,
  Square,
  ExternalLink,
  Trash2,
  Copy,
  Edit3,
  Filter,
  Users,
  MapPin,
  AlertCircle,
  Flag,
  MoreVertical,
} from "lucide-react";

import EmployeeShell from "./EmployeeShell";
import "./Calendar.css";

/* Storage Key */
const STORAGE_KEY = "tf_calendar_events_v3";
const TASKS_STORAGE_KEY = "tf_calendar_tasks_v3";

/* Default 10 Timetable Events matching reference image */
const defaultEvents = [
  {
    id: 1,
    title: "Daily Standup",
    category: "meeting",
    project: "Team Meeting",
    dayIndex: 1, // Mon Oct 21
    date: "2024-10-21",
    startTime: "09:00",
    endTime: "10:00",
    timeLabel: "9:00 - 10:00 AM",
    color: "blue",
    icon: "video",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
    description: "Daily engineering sync to unblock team tasks.",
  },
  {
    id: 2,
    title: "Bug Discussion",
    category: "meeting",
    project: "AI Integration",
    dayIndex: 1, // Mon Oct 21
    date: "2024-10-21",
    startTime: "11:30",
    endTime: "12:30",
    timeLabel: "11:30 AM - 12:30 PM",
    color: "red",
    icon: "circle",
    meetingUrl: "https://meet.google.com/xyz-uvwx-rst",
    description: "Review high severity bugs reported in AI pipeline.",
  },
  {
    id: 3,
    title: "Planning",
    category: "meeting",
    project: "AI Integration",
    dayIndex: 1, // Mon Oct 21
    date: "2024-10-21",
    startTime: "16:00",
    endTime: "17:00",
    timeLabel: "4:00 - 5:00 PM",
    color: "blue",
    icon: "video",
    meetingUrl: "https://meet.google.com/plan-team-ai",
    description: "Sprint backlog prioritization and estimation.",
  },
  {
    id: 4,
    title: "UI Design Discussion",
    category: "meeting",
    project: "TeamFlow Website",
    dayIndex: 2, // Tue Oct 22 (Today)
    date: "2024-10-22",
    startTime: "10:00",
    endTime: "11:00",
    timeLabel: "10:00 - 11:00 AM",
    color: "purple",
    icon: "zap",
    meetingUrl: "https://meet.google.com/ui-design-rev",
    description: "Review responsive breakpoints and dark mode palette.",
  },
  {
    id: 5,
    title: "Work on Tasks",
    category: "personal",
    project: "Personal",
    dayIndex: 2, // Tue Oct 22 (Today)
    date: "2024-10-22",
    startTime: "14:00",
    endTime: "15:00",
    timeLabel: "2:00 - 3:00 PM",
    color: "orange",
    icon: "square",
    description: "Dedicated focus time for frontend component refactor.",
  },
  {
    id: 6,
    title: "Team Sync",
    category: "meeting",
    project: "Mobile App",
    dayIndex: 2, // Tue Oct 22 (Today)
    date: "2024-10-22",
    startTime: "17:00",
    endTime: "17:30",
    timeLabel: "5:00 - 5:30 PM",
    color: "blue",
    icon: "video",
    meetingUrl: "https://meet.google.com/mobile-sync-app",
    description: "Weekly mobile development sync on Google Meet.",
  },
  {
    id: 7,
    title: "Client Meeting",
    category: "meeting",
    project: "Marketing Portal",
    dayIndex: 3, // Wed Oct 23
    date: "2024-10-23",
    startTime: "09:30",
    endTime: "10:30",
    timeLabel: "9:30 - 10:30 AM",
    color: "green",
    icon: "video",
    meetingUrl: "https://meet.google.com/client-review-mkt",
    description: "Showcase marketing landing page prototype to client stakeholders.",
  },
  {
    id: 8,
    title: "Project Sync",
    category: "meeting",
    project: "TeamFlow Website",
    dayIndex: 3, // Wed Oct 23
    date: "2024-10-23",
    startTime: "12:00",
    endTime: "13:00",
    timeLabel: "12:00 - 1:00 PM",
    color: "slate",
    icon: "video",
    meetingUrl: "https://meet.google.com/project-sync-tf",
    description: "Align deliverables with product manager.",
  },
  {
    id: 9,
    title: "Design Review",
    category: "meeting",
    project: "Mobile App",
    dayIndex: 4, // Thu Oct 24
    date: "2024-10-24",
    startTime: "13:30",
    endTime: "14:30",
    timeLabel: "1:30 - 2:30 PM",
    color: "purple",
    icon: "layers",
    meetingUrl: "https://meet.google.com/mob-design-rev",
    description: "Review iOS and Android navigation flows.",
  },
  {
    id: 10,
    title: "Sprint Review",
    category: "meeting",
    project: "Mobile App",
    dayIndex: 5, // Fri Oct 25
    date: "2024-10-25",
    startTime: "09:00",
    endTime: "10:00",
    timeLabel: "9:00 - 10:00 AM",
    color: "blue",
    icon: "video",
    meetingUrl: "https://meet.google.com/sprint-review-app",
    description: "Demonstrate completed sprint features to QA.",
  },
  {
    id: 11,
    title: "Team Meeting",
    category: "meeting",
    project: "General",
    dayIndex: 5, // Fri Oct 25
    date: "2024-10-25",
    startTime: "15:00",
    endTime: "16:00",
    timeLabel: "3:00 - 4:00 PM",
    color: "green",
    icon: "video",
    meetingUrl: "https://meet.google.com/general-team-meet",
    description: "Weekly company retrospective and celebrations.",
  },
];

/* Default Task Deadlines widget items */
const defaultDeadlines = [
  {
    id: 1,
    title: "Design login page UI",
    dueDate: "Today",
    isToday: true,
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "API integration testing",
    dueDate: "Oct 26",
    isToday: false,
    priority: "Medium",
    completed: false,
  },
  {
    id: 3,
    title: "Update documentation",
    dueDate: "Oct 28",
    isToday: false,
    priority: "Low",
    completed: false,
  },
  {
    id: 4,
    title: "Prepare demo for client",
    dueDate: "Oct 30",
    isToday: false,
    priority: "Medium",
    completed: false,
  },
];

/* Next 7 Days list items */
const nextSevenDaysList = [
  {
    id: 1,
    dateLabel: "Oct 23",
    dayName: "Wed",
    title: "Client Meeting",
    subText: "9:30 - 10:30 AM • Marketing Portal",
    dotColor: "green",
  },
  {
    id: 2,
    dateLabel: "Oct 24",
    dayName: "Thu",
    title: "Design Review",
    subText: "1:30 - 2:30 PM • Mobile App",
    dotColor: "purple",
  },
  {
    id: 3,
    dateLabel: "Oct 25",
    dayName: "Fri",
    title: "Sprint Review",
    subText: "9:00 - 10:00 AM • Mobile App",
    dotColor: "blue",
  },
  {
    id: 4,
    dateLabel: "Oct 28",
    dayName: "Mon",
    title: "Bug Discussion",
    subText: "11:00 - 12:00 PM • AI Integration",
    dotColor: "red",
  },
  {
    id: 5,
    dateLabel: "Oct 30",
    dayName: "Wed",
    title: "Project Planning",
    subText: "4:00 - 5:00 PM • TeamFlow Website",
    dotColor: "orange",
  },
];

/* Mini month calendar dates map for October 2024 */
const monthDotsMap = {
  1: ["blue"],
  3: ["orange"],
  4: ["green", "red"],
  10: ["red", "blue"],
  11: ["green", "blue"],
  17: ["red", "orange"],
  18: ["green"],
  21: ["blue", "red"],
  22: ["blue", "orange"], // Today
  23: ["green", "blue"],
  24: ["purple", "red"],
  25: ["blue", "green"],
  28: ["red"],
  30: ["orange"],
};

/* Time slots for timetable grid (9 AM to 6 PM) */
const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

/* Days of the target week */
const weekDays = [
  { name: "Sun", dateNum: 20, isToday: false },
  { name: "Mon", dateNum: 21, isToday: false },
  { name: "Tue", dateNum: 22, isToday: true }, // Target active today
  { name: "Wed", dateNum: 23, isToday: false },
  { name: "Thu", dateNum: 24, isToday: false },
  { name: "Fri", dateNum: 25, isToday: false },
  { name: "Sat", dateNum: 26, isToday: false },
];

function Calendar() {
  // Load events from localStorage safely
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5) return parsed;
      }
    } catch {}
    return defaultEvents;
  });

  // Load task deadlines safely
  const [deadlines, setDeadlines] = useState(() => {
    try {
      const saved = localStorage.getItem(TASKS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
      }
    } catch {}
    return defaultDeadlines;
  });

  // View state: 'Month' | 'Week' | 'Day' | 'Agenda'
  const [activeView, setActiveView] = useState("Week");

  // Selected date in October 2024
  const [selectedDate, setSelectedDate] = useState(22); // Oct 22, 2024

  // Filter dropdown states
  const [eventFilter, setEventFilter] = useState("All Events");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [ownerFilter, setOwnerFilter] = useState("My Events");

  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedEventModal, setSelectedEventModal] = useState(null);
  const [joiningMeetingModal, setJoiningMeetingModal] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  // New Event Form
  const [eventForm, setEventForm] = useState({
    title: "",
    category: "meeting",
    project: "TeamFlow Website",
    date: "2024-10-22",
    startTime: "10:00",
    endTime: "11:00",
    meetingUrl: "https://meet.google.com/new-meeting-call",
    description: "",
  });

  const eventRef = useRef(null);
  const projectRef = useRef(null);
  const ownerRef = useRef(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(deadlines));
  }, [deadlines]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (eventRef.current && !eventRef.current.contains(e.target)) setEventDropdownOpen(false);
      if (projectRef.current && !projectRef.current.contains(e.target)) setProjectDropdownOpen(false);
      if (ownerRef.current && !ownerRef.current.contains(e.target)) setOwnerDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (eventFilter !== "All Events") {
      const map = {
        Meetings: "meeting",
        Tasks: "task",
        Deadlines: "deadline",
        Milestones: "milestone",
      };
      const cat = map[eventFilter];
      if (cat) result = result.filter((e) => e.category === cat);
    }

    if (projectFilter !== "All Projects") {
      result = result.filter((e) => e.project.includes(projectFilter) || projectFilter.includes(e.project));
    }

    return result;
  }, [events, eventFilter, projectFilter]);

  // Calculate pixel top & height for an event on the week timetable
  // 9:00 AM is 0px, each 1 hour is 64px
  const getEventPosition = (ev) => {
    const [startH, startM] = (ev.startTime || "09:00").split(":").map(Number);
    const [endH, endM] = (ev.endTime || "10:00").split(":").map(Number);

    const startMinutesFrom9 = (startH - 9) * 60 + startM;
    const endMinutesFrom9 = (endH - 9) * 60 + endM;
    const durationMinutes = Math.max(endMinutesFrom9 - startMinutesFrom9, 30);

    const topPx = (startMinutesFrom9 / 60) * 64;
    const heightPx = Math.max((durationMinutes / 60) * 64, 48);

    return { top: `${topPx}px`, height: `${heightPx}px` };
  };

  // Toggle deadline completion
  const handleToggleDeadline = (id) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d))
    );
    showToast("Task deadline updated!");
  };

  // Handle Add Event
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    const colors = { meeting: "blue", task: "orange", deadline: "red", milestone: "green", personal: "purple" };
    const dateObj = new Date(eventForm.date);
    const dayIdx = dateObj.getDay();

    const newEv = {
      id: Date.now(),
      title: eventForm.title.trim(),
      category: eventForm.category,
      project: eventForm.project,
      dayIndex: dayIdx,
      date: eventForm.date,
      startTime: eventForm.startTime,
      endTime: eventForm.endTime,
      timeLabel: `${eventForm.startTime} - ${eventForm.endTime}`,
      color: colors[eventForm.category] || "blue",
      icon: eventForm.category === "meeting" ? "video" : "zap",
      meetingUrl: eventForm.meetingUrl,
      description: eventForm.description,
    };

    setEvents((prev) => [...prev, newEv]);
    setAddModalOpen(false);
    setEventForm({
      title: "",
      category: "meeting",
      project: "TeamFlow Website",
      date: "2024-10-22",
      startTime: "10:00",
      endTime: "11:00",
      meetingUrl: "https://meet.google.com/new-meeting-call",
      description: "",
    });
    showToast("New event added to calendar!");
  };

  // Handle Delete Event
  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    setSelectedEventModal(null);
    showToast("Event removed from calendar.");
  };

  return (
    <EmployeeShell activeRoute="/employee/calendar">
      <div className="tf-calendar-page">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="tf-cal-toast">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ====================================================================
            1. PAGE HEADER (Title + Subtitle + Add Event + View Switchers)
            ==================================================================== */}
        <header className="tf-cal-header">
          <div className="tf-cal-title-group">
            <h1>Calendar</h1>
            <p>View your schedule, upcoming meetings, task deadlines and important events.</p>
          </div>

          <div className="tf-cal-header-actions">
            {/* + Add Event Button */}
            <button
              type="button"
              className="tf-cal-add-event-btn"
              onClick={() => setAddModalOpen(true)}
            >
              <Plus size={16} strokeWidth={2.4} />
              <span>Add Event</span>
            </button>

            {/* View switcher tabs: Month | Week | Day | Agenda */}
            <div className="tf-cal-view-pills">
              {["Month", "Week", "Day", "Agenda"].map((view) => (
                <button
                  key={view}
                  type="button"
                  className={`tf-cal-view-pill ${activeView === view ? "active" : ""}`}
                  onClick={() => setActiveView(view)}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ====================================================================
            2. CONTROLS BAR (Date Range Nav + Dropdown Filters)
            ==================================================================== */}
        <section className="tf-cal-controls-row">
          {/* Left: Navigation and Range */}
          <div className="tf-cal-range-nav-group">
            <button
              type="button"
              className="tf-cal-arrow-btn"
              onClick={() => showToast("Showing previous week: Oct 13 - Oct 19, 2024")}
              aria-label="Previous week"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="tf-cal-arrow-btn"
              onClick={() => showToast("Showing next week: Oct 27 - Nov 02, 2024")}
              aria-label="Next week"
            >
              <ChevronRight size={16} />
            </button>

            <span className="tf-cal-range-title">Oct 20 – Oct 26, 2024</span>

            <button
              type="button"
              className="tf-cal-today-btn"
              onClick={() => {
                setSelectedDate(22);
                showToast("Viewing Today: Tue, Oct 22, 2024");
              }}
            >
              Today
            </button>
          </div>

          {/* Right: Dropdowns */}
          <div className="tf-cal-dropdowns-group">
            {/* 1. All Events */}
            <div className="tf-cal-dropdown-wrap" ref={eventRef}>
              <button
                type="button"
                className="tf-cal-dropdown-btn"
                onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
              >
                <span>{eventFilter}</span>
                <ChevronDown size={14} className={eventDropdownOpen ? "open" : ""} />
              </button>
              {eventDropdownOpen && (
                <div className="tf-cal-dropdown-menu">
                  {["All Events", "Meetings", "Tasks", "Deadlines", "Milestones"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={eventFilter === cat ? "active" : ""}
                      onClick={() => {
                        setEventFilter(cat);
                        setEventDropdownOpen(false);
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. All Projects */}
            <div className="tf-cal-dropdown-wrap" ref={projectRef}>
              <button
                type="button"
                className="tf-cal-dropdown-btn"
                onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              >
                <span>{projectFilter}</span>
                <ChevronDown size={14} className={projectDropdownOpen ? "open" : ""} />
              </button>
              {projectDropdownOpen && (
                <div className="tf-cal-dropdown-menu">
                  {[
                    "All Projects",
                    "TeamFlow Website",
                    "Mobile App",
                    "AI Integration",
                    "Marketing Portal",
                  ].map((proj) => (
                    <button
                      key={proj}
                      type="button"
                      className={projectFilter === proj ? "active" : ""}
                      onClick={() => {
                        setProjectFilter(proj);
                        setProjectDropdownOpen(false);
                      }}
                    >
                      {proj}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. My Events */}
            <div className="tf-cal-dropdown-wrap" ref={ownerRef}>
              <button
                type="button"
                className="tf-cal-dropdown-btn"
                onClick={() => setOwnerDropdownOpen(!ownerDropdownOpen)}
              >
                <span>{ownerFilter}</span>
                <ChevronDown size={14} className={ownerDropdownOpen ? "open" : ""} />
              </button>
              {ownerDropdownOpen && (
                <div className="tf-cal-dropdown-menu">
                  {["My Events", "Team Events", "All Workspace"].map((own) => (
                    <button
                      key={own}
                      type="button"
                      className={ownerFilter === own ? "active" : ""}
                      onClick={() => {
                        setOwnerFilter(own);
                        setOwnerDropdownOpen(false);
                      }}
                    >
                      {own}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. MAIN TWO-COLUMN LAYOUT
            Left ~70%: Timetable Grid + Lower Schedule Cards
            Right ~30%: Mini Calendar + Upcoming Events + Task Deadlines
            ==================================================================== */}
        <div className="tf-cal-main-layout">
          {/* ------------------------------------------------------------------
              LEFT COLUMN: Weekly Grid Timetable & Bottom 2 Cards
              ------------------------------------------------------------------ */}
          <div className="tf-cal-left-column">
            {/* Weekly Timetable Card */}
            <div className="tf-cal-timetable-card">
              {/* Header Days of Week */}
              <div className="tf-cal-grid-header">
                <div className="tf-cal-time-col-header" />
                {weekDays.map((d, i) => (
                  <div
                    key={d.name}
                    className={`tf-cal-day-header ${d.isToday || selectedDate === d.dateNum ? "today" : ""}`}
                    onClick={() => {
                      setSelectedDate(d.dateNum);
                      showToast(`Selected ${d.name}, Oct ${d.dateNum}`);
                    }}
                  >
                    <span className="tf-cal-day-name">{d.name}</span>
                    <span className="tf-cal-day-num">{d.dateNum}</span>
                  </div>
                ))}
              </div>

              {/* The Hourly Timetable Grid Body */}
              <div className="tf-cal-grid-body">
                {/* 10 Hourly Rows (9 AM to 6 PM) */}
                {timeSlots.map((time, idx) => (
                  <div key={time} className="tf-cal-grid-row">
                    <div className="tf-cal-time-cell">
                      <span>{time}</span>
                    </div>

                    {/* 7 Columns for 7 Days */}
                    {weekDays.map((d, dIdx) => (
                      <div
                        key={dIdx}
                        className={`tf-cal-day-cell ${d.isToday ? "today-cell" : ""}`}
                        onClick={() => {
                          setEventForm((prev) => ({
                            ...prev,
                            date: `2024-10-${d.dateNum}`,
                            startTime: `${String(idx + 9).padStart(2, "0")}:00`,
                            endTime: `${String(idx + 10).padStart(2, "0")}:00`,
                          }));
                          setAddModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                ))}

                {/* Red Current Time Line across 2:00 PM (Row index 5 = 2:00 PM = top: 320px) */}
                <div className="tf-cal-now-indicator" style={{ top: "320px" }}>
                  <span className="tf-cal-now-tag">2:00 PM</span>
                  <div className="tf-cal-now-line" />
                  <div className="tf-cal-now-dot" />
                </div>

                {/* Placed Event Blocks matching the reference screenshot */}
                {filteredEvents.map((ev) => {
                  const dayColIndex = ev.dayIndex !== undefined ? ev.dayIndex : 2;
                  const pos = getEventPosition(ev);

                  return (
                    <div
                      key={ev.id}
                      className={`tf-cal-event-block ${ev.color || "blue"}`}
                      style={{
                        left: `calc(70px + (100% - 70px) / 7 * ${dayColIndex} + 4px)`,
                        width: `calc((100% - 70px) / 7 - 8px)`,
                        top: pos.top,
                        height: pos.height,
                      }}
                      onClick={() => setSelectedEventModal(ev)}
                    >
                      <div className="tf-cal-event-top-title">
                        {ev.icon === "video" && <Video size={13} className="tf-ev-icon" />}
                        {ev.icon === "zap" && <Zap size={13} className="tf-ev-icon" />}
                        {ev.icon === "layers" && <Layers size={13} className="tf-ev-icon" />}
                        <strong>{ev.title}</strong>
                      </div>
                      <span className="tf-cal-event-sub">
                        {ev.timeLabel} • {ev.project}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lower 2 Cards (Today's Schedule & Next 7 Days) */}
            <div className="tf-cal-bottom-split-row">
              {/* Card A: Today's Schedule */}
              <article className="tf-cal-card tf-today-schedule-card">
                <div className="tf-cal-card-header">
                  <h2>Today's Schedule</h2>
                  <span className="tf-today-date-badge">Tue, Oct 22, 2024</span>
                </div>

                <div className="tf-today-timeline">
                  {/* Item 1: UI Design Discussion */}
                  <div className="tf-timeline-item purple">
                    <div className="tf-timeline-line-marker purple" />
                    <div className="tf-timeline-time">10:00 – 11:00 AM</div>
                    <div className="tf-timeline-content">
                      <div className="tf-timeline-title">
                        <span className="tf-timeline-dot purple" />
                        <strong>UI Design Discussion</strong>
                      </div>
                      <span className="tf-timeline-sub">TeamFlow Website • Online Meeting</span>
                    </div>
                    <button
                      type="button"
                      className="tf-timeline-join-btn"
                      onClick={() =>
                        setJoiningMeetingModal({
                          title: "UI Design Discussion",
                          url: "https://meet.google.com/ui-design-rev",
                        })
                      }
                    >
                      <Video size={14} />
                      <span>Join</span>
                    </button>
                  </div>

                  {/* Item 2: Work on Tasks */}
                  <div className="tf-timeline-item orange">
                    <div className="tf-timeline-line-marker orange" />
                    <div className="tf-timeline-time">2:00 – 3:00 PM</div>
                    <div className="tf-timeline-content">
                      <div className="tf-timeline-title">
                        <span className="tf-timeline-dot orange" />
                        <strong>Work on Tasks</strong>
                      </div>
                      <span className="tf-timeline-sub">Personal</span>
                    </div>
                  </div>

                  {/* Item 3: Team Sync */}
                  <div className="tf-timeline-item blue">
                    <div className="tf-timeline-line-marker blue" />
                    <div className="tf-timeline-time">5:00 – 5:30 PM</div>
                    <div className="tf-timeline-content">
                      <div className="tf-timeline-title">
                        <span className="tf-timeline-dot blue" />
                        <strong>Team Sync</strong>
                      </div>
                      <span className="tf-timeline-sub">Mobile App • Google Meet</span>
                    </div>
                    <button
                      type="button"
                      className="tf-timeline-join-btn"
                      onClick={() =>
                        setJoiningMeetingModal({
                          title: "Team Sync",
                          url: "https://meet.google.com/mobile-sync-app",
                        })
                      }
                    >
                      <Video size={14} />
                      <span>Join</span>
                    </button>
                  </div>
                </div>
              </article>

              {/* Card B: Next 7 Days */}
              <article className="tf-cal-card tf-next-days-card">
                <div className="tf-cal-card-header">
                  <h2>Next 7 Days</h2>
                  <button
                    type="button"
                    className="tf-cal-view-all-link"
                    onClick={() => showToast("Showing full upcoming schedule.")}
                  >
                    View all <ChevronRight size={14} />
                  </button>
                </div>

                <div className="tf-next-days-list">
                  {nextSevenDaysList.map((item) => (
                    <div
                      key={item.id}
                      className="tf-next-day-row"
                      onClick={() => showToast(`Event: ${item.title} on ${item.dateLabel}`)}
                    >
                      <div className="tf-next-date-col">
                        <strong>{item.dateLabel}</strong>
                        <span>{item.dayName}</span>
                      </div>

                      <div className="tf-next-info-col">
                        <div className="tf-next-title-row">
                          <span className={`tf-dot ${item.dotColor}`} />
                          <strong>{item.title}</strong>
                        </div>
                        <span className="tf-next-sub">{item.subText}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>

          {/* ------------------------------------------------------------------
              RIGHT COLUMN: 3 Stacked Widgets (Mini Month, Upcoming, Deadlines)
              ------------------------------------------------------------------ */}
          <div className="tf-cal-right-sidebar">
            {/* Widget 1: Mini Month Calendar (October 2024) */}
            <article className="tf-cal-sidebar-card tf-mini-month-card">
              <div className="tf-mini-month-header">
                <button
                  type="button"
                  className="tf-month-nav-arrow"
                  onClick={() => showToast("Showing September 2024")}
                  aria-label="Previous month"
                >
                  <ChevronLeft size={16} />
                </button>
                <h3>October 2024</h3>
                <button
                  type="button"
                  className="tf-month-nav-arrow"
                  onClick={() => showToast("Showing November 2024")}
                  aria-label="Next month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Days of week */}
              <div className="tf-mini-days-row">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* October 2024 Dates Grid */}
              <div className="tf-mini-dates-grid">
                {/* Filler days from Sep */}
                <span className="tf-mini-cell muted">29</span>
                <span className="tf-mini-cell muted">30</span>

                {/* Days 1 to 31 */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const isSelected = selectedDate === day;
                  const dots = monthDotsMap[day] || [];

                  return (
                    <div
                      key={day}
                      className={`tf-mini-cell ${isSelected ? "active" : ""}`}
                      onClick={() => {
                        setSelectedDate(day);
                        showToast(`Viewing Oct ${day}, 2024`);
                      }}
                    >
                      <span className="tf-mini-num">{day}</span>
                      {dots.length > 0 && (
                        <div className="tf-mini-dots-group">
                          {dots.map((dColor, idx) => (
                            <span key={idx} className={`tf-mini-dot ${dColor}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Filler days for Nov */}
                <span className="tf-mini-cell muted">1</span>
                <span className="tf-mini-cell muted">2</span>
              </div>

              {/* Month Legend */}
              <div className="tf-mini-month-legend">
                <div className="tf-legend-item">
                  <span className="tf-dot red" />
                  <span>Task Deadline</span>
                </div>
                <div className="tf-legend-item">
                  <span className="tf-dot blue" />
                  <span>Meeting</span>
                </div>
                <div className="tf-legend-item">
                  <span className="tf-dot green" />
                  <span>Milestone</span>
                </div>
                <div className="tf-legend-item">
                  <span className="tf-dot yellow" />
                  <span>Other</span>
                </div>
              </div>
            </article>

            {/* Widget 2: Upcoming Events */}
            <article className="tf-cal-sidebar-card tf-upcoming-events-card">
              <div className="tf-cal-sidebar-header">
                <h2>Upcoming Events</h2>
                <button
                  type="button"
                  className="tf-cal-view-all-link"
                  onClick={() => showToast("Displaying all scheduled events.")}
                >
                  View all <ChevronRight size={14} />
                </button>
              </div>

              <div className="tf-upcoming-list">
                {/* 1. Daily Standup */}
                <div
                  className="tf-upcoming-item"
                  onClick={() =>
                    setSelectedEventModal({
                      title: "Daily Standup",
                      timeLabel: "Today, 9:00 - 10:00 AM",
                      project: "Team Meeting",
                      color: "blue",
                      meetingUrl: "https://meet.google.com/abc-defg-hij",
                      description: "Daily morning standup call.",
                    })
                  }
                >
                  <div className="tf-upcoming-icon blue">
                    <Video size={15} />
                  </div>
                  <div className="tf-upcoming-content">
                    <strong>Daily Standup</strong>
                    <span>Today, 9:00 – 10:00 AM • Team Meeting</span>
                  </div>
                </div>

                {/* 2. UI Design Discussion */}
                <div
                  className="tf-upcoming-item"
                  onClick={() =>
                    setSelectedEventModal({
                      title: "UI Design Discussion",
                      timeLabel: "Today, 10:00 - 11:00 AM",
                      project: "TeamFlow Website",
                      color: "purple",
                      meetingUrl: "https://meet.google.com/ui-design-rev",
                      description: "Review responsive breakpoints.",
                    })
                  }
                >
                  <div className="tf-upcoming-icon purple">
                    <Zap size={15} />
                  </div>
                  <div className="tf-upcoming-content">
                    <strong>UI Design Discussion</strong>
                    <span>Today, 10:00 – 11:00 AM • TeamFlow Website</span>
                  </div>
                </div>

                {/* 3. Work on Tasks */}
                <div
                  className="tf-upcoming-item"
                  onClick={() =>
                    setSelectedEventModal({
                      title: "Work on Tasks",
                      timeLabel: "Today, 2:00 - 3:00 PM",
                      project: "Personal",
                      color: "orange",
                      description: "Deep work session.",
                    })
                  }
                >
                  <div className="tf-upcoming-icon orange">
                    <Square size={14} />
                  </div>
                  <div className="tf-upcoming-content">
                    <strong>Work on Tasks</strong>
                    <span>Today, 2:00 – 3:00 PM • Personal</span>
                  </div>
                </div>

                {/* 4. Design Review */}
                <div
                  className="tf-upcoming-item"
                  onClick={() =>
                    setSelectedEventModal({
                      title: "Design Review",
                      timeLabel: "Oct 24, 1:30 - 2:30 PM",
                      project: "Mobile App",
                      color: "purple",
                      meetingUrl: "https://meet.google.com/mob-design-rev",
                      description: "Mobile design evaluation.",
                    })
                  }
                >
                  <div className="tf-upcoming-icon purple-soft">
                    <Layers size={15} />
                  </div>
                  <div className="tf-upcoming-content">
                    <strong>Design Review</strong>
                    <span>Oct 24, 1:30 – 2:30 PM • Mobile App</span>
                  </div>
                </div>

                {/* 5. Sprint Review */}
                <div
                  className="tf-upcoming-item"
                  onClick={() =>
                    setSelectedEventModal({
                      title: "Sprint Review",
                      timeLabel: "Oct 25, 9:00 - 10:00 AM",
                      project: "Mobile App",
                      color: "blue",
                      meetingUrl: "https://meet.google.com/sprint-review-app",
                      description: "Sprint demo & signoff.",
                    })
                  }
                >
                  <div className="tf-upcoming-icon blue">
                    <Video size={15} />
                  </div>
                  <div className="tf-upcoming-content">
                    <strong>Sprint Review</strong>
                    <span>Oct 25, 9:00 – 10:00 AM • Mobile App</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Widget 3: My Task Deadlines */}
            <article className="tf-cal-sidebar-card tf-task-deadlines-card">
              <div className="tf-cal-sidebar-header">
                <h2>My Task Deadlines</h2>
                <Link to="/employee/tasks" className="tf-cal-view-all-link">
                  View all <ChevronRight size={14} />
                </Link>
              </div>

              <div className="tf-deadlines-list">
                {deadlines.map((task) => (
                  <div key={task.id} className="tf-deadline-row">
                    <button
                      type="button"
                      className="tf-deadline-check-btn"
                      onClick={() => handleToggleDeadline(task.id)}
                    >
                      {task.completed ? (
                        <CheckSquare size={17} color="#10B981" />
                      ) : (
                        <Square size={17} color="#CBD5E1" />
                      )}
                    </button>

                    <div className="tf-deadline-info">
                      <strong className={task.completed ? "completed" : ""}>
                        {task.title}
                      </strong>
                      <span className={`tf-deadline-date ${task.isToday ? "today" : ""}`}>
                        <span className={`tf-dot ${task.isToday ? "red" : "orange"}`} />
                        {task.dueDate}
                      </span>
                    </div>

                    <span className={`tf-priority-pill ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>

        {/* ====================================================================
            4. MODALS
            ==================================================================== */}

        {/* Modal 1: + Add Event */}
        {addModalOpen && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setAddModalOpen(false);
            }}
          >
            <div className="tf-modal-card tf-event-modal" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-group">
                  <div className="tf-modal-icon-box blue">
                    <CalendarIcon size={18} color="#2563EB" />
                  </div>
                  <div>
                    <h3>Schedule New Event</h3>
                    <p>Create meetings, deadlines, or focus blocks.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setAddModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEvent}>
                <div className="tf-modal-form-body">
                  <div className="tf-form-field">
                    <label>Event Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Architecture Sync"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    />
                  </div>

                  <div className="tf-form-row">
                    <div className="tf-form-field">
                      <label>Category</label>
                      <select
                        value={eventForm.category}
                        onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                      >
                        <option value="meeting">Meeting</option>
                        <option value="task">Task</option>
                        <option value="deadline">Deadline</option>
                        <option value="milestone">Milestone</option>
                        <option value="personal">Personal Focus</option>
                      </select>
                    </div>

                    <div className="tf-form-field">
                      <label>Project</label>
                      <select
                        value={eventForm.project}
                        onChange={(e) => setEventForm({ ...eventForm, project: e.target.value })}
                      >
                        <option value="TeamFlow Website">TeamFlow Website</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="AI Integration">AI Integration</option>
                        <option value="Marketing Portal">Marketing Portal</option>
                        <option value="General">General / Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="tf-form-row three">
                    <div className="tf-form-field">
                      <label>Date</label>
                      <input
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      />
                    </div>
                    <div className="tf-form-field">
                      <label>Start</label>
                      <input
                        type="time"
                        value={eventForm.startTime}
                        onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                      />
                    </div>
                    <div className="tf-form-field">
                      <label>End</label>
                      <input
                        type="time"
                        value={eventForm.endTime}
                        onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="tf-form-field">
                    <label>Meeting Link (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://meet.google.com/..."
                      value={eventForm.meetingUrl}
                      onChange={(e) => setEventForm({ ...eventForm, meetingUrl: e.target.value })}
                    />
                  </div>

                  <div className="tf-form-field">
                    <label>Description</label>
                    <textarea
                      rows={2}
                      placeholder="Add agenda or details..."
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="tf-modal-actions">
                  <button
                    type="button"
                    className="tf-btn-secondary"
                    onClick={() => setAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="tf-btn-primary">
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: Event Details */}
        {selectedEventModal && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedEventModal(null);
            }}
          >
            <div className="tf-modal-card tf-event-modal" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-group">
                  <div className={`tf-modal-icon-box ${selectedEventModal.color || "blue"}`}>
                    <CalendarIcon size={18} />
                  </div>
                  <div>
                    <h3>{selectedEventModal.title}</h3>
                    <p>{selectedEventModal.project} • {selectedEventModal.timeLabel}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setSelectedEventModal(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="tf-modal-form-body">
                {selectedEventModal.description && (
                  <div className="tf-form-field">
                    <label>Description</label>
                    <p className="tf-event-modal-desc">{selectedEventModal.description}</p>
                  </div>
                )}

                {selectedEventModal.meetingUrl && (
                  <div className="tf-event-join-callout">
                    <div className="tf-callout-icon">
                      <Video size={18} color="#2563EB" />
                    </div>
                    <div className="tf-callout-text">
                      <strong>Google Meet Video Call</strong>
                      <span>Ready to join with your TeamFlow account</span>
                    </div>
                    <button
                      type="button"
                      className="tf-timeline-join-btn"
                      onClick={() => {
                        setJoiningMeetingModal({
                          title: selectedEventModal.title,
                          url: selectedEventModal.meetingUrl,
                        });
                        setSelectedEventModal(null);
                      }}
                    >
                      Join Meeting
                    </button>
                  </div>
                )}
              </div>

              <div className="tf-modal-actions space-between">
                <button
                  type="button"
                  className="tf-btn-danger"
                  onClick={() => handleDeleteEvent(selectedEventModal.id)}
                >
                  <Trash2 size={14} />
                  <span>Delete Event</span>
                </button>
                <button
                  type="button"
                  className="tf-btn-secondary"
                  onClick={() => setSelectedEventModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: Video Call Simulator */}
        {joiningMeetingModal && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setJoiningMeetingModal(null);
            }}
          >
            <div className="tf-modal-card tf-meeting-simulator-modal">
              <div className="tf-meeting-sim-header">
                <div className="tf-sim-live-badge">
                  <span className="tf-dot-live" />
                  <span>CONNECTED</span>
                </div>
                <h3>{joiningMeetingModal.title}</h3>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setJoiningMeetingModal(null)}
                >
                  <X size={18} color="#FFFFFF" />
                </button>
              </div>

              <div className="tf-meeting-sim-screen">
                <div className="tf-meeting-avatar-box">
                  <Video size={48} color="#94A3B8" />
                  <h4>Online Meeting Room</h4>
                  <p>Microphone and camera ready</p>
                </div>
              </div>

              <div className="tf-meeting-sim-controls">
                <button
                  type="button"
                  className="tf-sim-hangup-btn"
                  onClick={() => {
                    setJoiningMeetingModal(null);
                    showToast("Meeting ended.");
                  }}
                >
                  Leave Call
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeShell>
  );
}

export default Calendar;
