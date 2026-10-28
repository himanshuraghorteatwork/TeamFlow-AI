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
  User,
  Users,
  MapPin,
  AlertCircle,
  Flag,
  MoreVertical,
} from "lucide-react";

import EmployeeShell from "./EmployeeShell";
import "./Calendar.css";

/* Storage Keys */
const STORAGE_KEY = "tf_calendar_events_v4";
const TASKS_STORAGE_KEY = "tf_calendar_tasks_v4";

/* Date Utilities */
const pad = (n) => String(n).padStart(2, "0");

const toDateKey = (d) => {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  return toDateKey(d1) === toDateKey(d2);
};

const isTodayDate = (d) => {
  return isSameDay(d, new Date());
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

/* Generate dynamic default events relative to real current time */
const generateDefaultEvents = (baseDate) => {
  const d = new Date(baseDate);
  const addDays = (offset) => {
    const target = new Date(d);
    target.setDate(target.getDate() + offset);
    return toDateKey(target);
  };

  return [
    {
      id: 1,
      title: "Daily Standup",
      category: "meeting",
      project: "TeamFlow Website",
      owner: "team",
      date: addDays(0), // Today
      startTime: "09:30",
      endTime: "10:00",
      timeLabel: "9:30 - 10:00 AM",
      color: "blue",
      icon: "video",
      meetingUrl: "https://meet.google.com/abc-defg-hij",
      description: "Daily engineering sync to unblock team tasks.",
    },
    {
      id: 2,
      title: "UI Design Discussion",
      category: "meeting",
      project: "TeamFlow Website",
      owner: "my",
      date: addDays(0), // Today
      startTime: "11:00",
      endTime: "12:00",
      timeLabel: "11:00 AM - 12:00 PM",
      color: "purple",
      icon: "zap",
      meetingUrl: "https://meet.google.com/ui-design-rev",
      description: "Review responsive breakpoints and dark mode palette.",
    },
    {
      id: 3,
      title: "Work on Tasks",
      category: "personal",
      project: "Personal",
      owner: "my",
      date: addDays(0), // Today
      startTime: "14:00",
      endTime: "15:00",
      timeLabel: "2:00 - 3:00 PM",
      color: "orange",
      icon: "square",
      description: "Dedicated focus time for frontend component refactor.",
    },
    {
      id: 4,
      title: "Team Sync",
      category: "meeting",
      project: "Mobile App",
      owner: "team",
      date: addDays(0), // Today
      startTime: "16:30",
      endTime: "17:15",
      timeLabel: "4:30 - 5:15 PM",
      color: "blue",
      icon: "video",
      meetingUrl: "https://meet.google.com/mobile-sync-app",
      description: "Weekly mobile development sync on Google Meet.",
    },
    {
      id: 5,
      title: "Bug Discussion",
      category: "meeting",
      project: "AI Integration",
      owner: "my",
      date: addDays(1), // Tomorrow
      startTime: "11:30",
      endTime: "12:30",
      timeLabel: "11:30 AM - 12:30 PM",
      color: "red",
      icon: "circle",
      meetingUrl: "https://meet.google.com/xyz-uvwx-rst",
      description: "Review high severity bugs reported in AI pipeline.",
    },
    {
      id: 6,
      title: "Sprint Planning",
      category: "meeting",
      project: "AI Integration",
      owner: "team",
      date: addDays(1), // Tomorrow
      startTime: "15:00",
      endTime: "16:00",
      timeLabel: "3:00 - 4:00 PM",
      color: "blue",
      icon: "video",
      meetingUrl: "https://meet.google.com/plan-team-ai",
      description: "Sprint backlog prioritization and estimation.",
    },
    {
      id: 7,
      title: "Client Meeting",
      category: "meeting",
      project: "Marketing Portal",
      owner: "my",
      date: addDays(2),
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
      title: "Design Review",
      category: "meeting",
      project: "Mobile App",
      owner: "team",
      date: addDays(3),
      startTime: "13:30",
      endTime: "14:30",
      timeLabel: "1:30 - 2:30 PM",
      color: "purple",
      icon: "layers",
      meetingUrl: "https://meet.google.com/mob-design-rev",
      description: "Review iOS and Android navigation flows.",
    },
    {
      id: 9,
      title: "Sprint Review",
      category: "meeting",
      project: "Mobile App",
      owner: "team",
      date: addDays(4),
      startTime: "10:00",
      endTime: "11:00",
      timeLabel: "10:00 - 11:00 AM",
      color: "blue",
      icon: "video",
      meetingUrl: "https://meet.google.com/sprint-review-app",
      description: "Demonstrate completed sprint features to QA.",
    },
    {
      id: 10,
      title: "Architecture Alignment",
      category: "meeting",
      project: "TeamFlow Website",
      owner: "team",
      date: addDays(-1), // Yesterday
      startTime: "14:00",
      endTime: "15:00",
      timeLabel: "2:00 - 3:00 PM",
      color: "slate",
      icon: "video",
      meetingUrl: "https://meet.google.com/arch-align-call",
      description: "Align on backend endpoints and caching strategies.",
    },
  ];
};

/* Generate dynamic task deadlines relative to baseDate */
const generateDefaultDeadlines = (baseDate) => {
  const d = new Date(baseDate);
  const addDays = (offset) => {
    const target = new Date(d);
    target.setDate(target.getDate() + offset);
    return target;
  };

  const fmt = (target) => `${MONTH_SHORT[target.getMonth()]} ${target.getDate()}`;

  return [
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
      dueDate: fmt(addDays(1)),
      isToday: false,
      priority: "Medium",
      completed: false,
    },
    {
      id: 3,
      title: "Update documentation",
      dueDate: fmt(addDays(3)),
      isToday: false,
      priority: "Low",
      completed: false,
    },
    {
      id: 4,
      title: "Prepare demo for client",
      dueDate: fmt(addDays(5)),
      isToday: false,
      priority: "Medium",
      completed: false,
    },
  ];
};


/* Determine if event belongs to 'My Events' or 'Team Events' */
const isMyEvent = (ev) => {
  if (!ev) return false;
  if (ev.owner === "my" || ev.owner === "personal") return true;
  if (ev.owner === "team") return false;
  if (ev.category === "personal") return true;
  const myKeywords = [
    "ui design",
    "work on tasks",
    "bug discussion",
    "client meeting",
    "personal",
    "my",
    "1:1",
    "1-on-1",
    "focus",
  ];
  const t = (ev.title || "").toLowerCase();
  if (myKeywords.some((k) => t.includes(k))) return true;
  if (typeof ev.id === "number" && ev.id > 100) return true;
  return false;
};

const isTeamEvent = (ev) => {
  if (!ev) return false;
  if (ev.owner === "team") return true;
  if (ev.owner === "my" || ev.owner === "personal") return false;
  return !isMyEvent(ev);
};

function Calendar() {
  // Real-time current clock (updates every 10s)
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Main calendar view state & active date
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [miniDate, setMiniDate] = useState(() => new Date());

  // View mode: 'Month' | 'Week' | 'Day' | 'Agenda'
  const [activeView, setActiveView] = useState("Week");

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

  const eventRef = useRef(null);
  const projectRef = useRef(null);
  const ownerRef = useRef(null);

  // Load events safely with current-date default fallback
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          // Verify events aren't old 2024 items
          const currentYear = new Date().getFullYear();
          const hasCurrentDates = parsed.some((e) => e.date && e.date.startsWith(String(currentYear)));
          if (hasCurrentDates) {
            return parsed.map((e) => ({
              ...e,
              owner: e.owner || (isMyEvent(e) ? "my" : "team"),
            }));
          }
        }
      }
    } catch {}
    return generateDefaultEvents(new Date());
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
    return generateDefaultDeadlines(new Date());
  });

  // New Event Form State
  const [eventForm, setEventForm] = useState({
    title: "",
    category: "meeting",
    project: "TeamFlow Website",
    owner: "my",
    date: toDateKey(new Date()),
    startTime: "10:00",
    endTime: "11:00",
    meetingUrl: "https://meet.google.com/teamflow-live-call",
    description: "",
  });

  // Persist events & deadlines
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

  /* =========================================================================
     COMPUTED VALUES: WEEKS, MONTHS, DAYS & REAL-TIME CLOCK
     ========================================================================= */

  // Real-time hour & minute calculations
  const nowHours = currentTime.getHours();
  const nowMinutes = currentTime.getMinutes();
  const nowMinutesFrom9 = (nowHours - 9) * 60 + nowMinutes;
  const nowTopPx = (nowMinutesFrom9 / 60) * 64;
  const isTimeInRange = nowHours >= 9 && nowHours < 19;

  const currentTimeString = useMemo(() => {
    const ampm = nowHours >= 12 ? "PM" : "AM";
    const h12 = nowHours % 12 === 0 ? 12 : nowHours % 12;
    return `${h12}:${pad(nowMinutes)} ${ampm}`;
  }, [nowHours, nowMinutes]);

  // Compute 7 days of the active week based on viewDate
  const currentWeekDays = useMemo(() => {
    const d = new Date(viewDate);
    const day = d.getDay(); // 0 is Sunday
    const startOfWeek = new Date(d);
    startOfWeek.setDate(d.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);

    const todayStr = toDateKey(new Date());
    const selStr = toDateKey(selectedDate);

    return Array.from({ length: 7 }, (_, i) => {
      const cur = new Date(startOfWeek);
      cur.setDate(startOfWeek.getDate() + i);
      const curStr = toDateKey(cur);
      return {
        date: cur,
        dateKey: curStr,
        dayName: DAY_NAMES[cur.getDay()],
        dateNum: cur.getDate(),
        month: cur.getMonth(),
        year: cur.getFullYear(),
        isToday: curStr === todayStr,
        isSelected: curStr === selStr,
        colIndex: i,
      };
    });
  }, [viewDate, selectedDate]);

  // Compute index of today in current week
  const todayColIndex = useMemo(() => {
    return currentWeekDays.findIndex((d) => d.isToday);
  }, [currentWeekDays]);

  // Dynamic Range Title displayed in controls row
  const currentRangeTitle = useMemo(() => {
    if (activeView === "Week") {
      const start = currentWeekDays[0];
      const end = currentWeekDays[6];
      if (start.month === end.month) {
        return `${MONTH_SHORT[start.month]} ${start.dateNum} – ${MONTH_SHORT[end.month]} ${end.dateNum}, ${end.year}`;
      }
      return `${MONTH_SHORT[start.month]} ${start.dateNum} – ${MONTH_SHORT[end.month]} ${end.dateNum}, ${end.year}`;
    }

    if (activeView === "Month") {
      return `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
    }

    if (activeView === "Day") {
      return `${DAY_FULL[selectedDate.getDay()]}, ${MONTH_SHORT[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
    }

    if (activeView === "Agenda") {
      return `Schedule • ${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
    }

    return "";
  }, [activeView, viewDate, selectedDate, currentWeekDays]);

  // Navigation handlers for < and > buttons
  const handlePrev = () => {
    if (activeView === "Week") {
      setViewDate((prev) => {
        const next = new Date(prev);
        next.setDate(next.getDate() - 7);
        return next;
      });
    } else if (activeView === "Month") {
      setViewDate((prev) => {
        const next = new Date(prev);
        next.setMonth(next.getMonth() - 1);
        return next;
      });
    } else if (activeView === "Day") {
      setSelectedDate((prev) => {
        const next = new Date(prev);
        next.setDate(next.getDate() - 1);
        setViewDate(next);
        return next;
      });
    } else if (activeView === "Agenda") {
      setViewDate((prev) => {
        const next = new Date(prev);
        next.setDate(next.getDate() - 7);
        return next;
      });
    }
  };

  const handleNext = () => {
    if (activeView === "Week") {
      setViewDate((prev) => {
        const next = new Date(prev);
        next.setDate(next.getDate() + 7);
        return next;
      });
    } else if (activeView === "Month") {
      setViewDate((prev) => {
        const next = new Date(prev);
        next.setMonth(next.getMonth() + 1);
        return next;
      });
    } else if (activeView === "Day") {
      setSelectedDate((prev) => {
        const next = new Date(prev);
        next.setDate(next.getDate() + 1);
        setViewDate(next);
        return next;
      });
    } else if (activeView === "Agenda") {
      setViewDate((prev) => {
        const next = new Date(prev);
        next.setDate(next.getDate() + 7);
        return next;
      });
    }
  };

  const handleToday = () => {
    const now = new Date();
    setViewDate(now);
    setSelectedDate(now);
    setMiniDate(now);
    showToast(`Navigated to Today (${MONTH_SHORT[now.getMonth()]} ${now.getDate()})`);
  };

  // Filtered Events (Filtering by Category, Project, and Scope/Owner)
  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (eventFilter !== "All Events") {
      const map = {
        Meetings: "meeting",
        Tasks: "task",
        Deadlines: "deadline",
        Milestones: "milestone",
        Personal: "personal",
      };
      const cat = map[eventFilter];
      if (cat) result = result.filter((e) => e.category === cat);
    }

    if (projectFilter !== "All Projects") {
      result = result.filter((e) => e.project && (e.project.includes(projectFilter) || projectFilter.includes(e.project)));
    }

    if (ownerFilter === "My Events") {
      result = result.filter((e) => isMyEvent(e));
    } else if (ownerFilter === "Team Events") {
      result = result.filter((e) => isTeamEvent(e));
    }
    // "All Workspace" displays all workspace events

    return result;
  }, [events, eventFilter, projectFilter, ownerFilter]);

  // Real-time counts for the 3rd dropdown (My Events, Team Events, All Workspace)
  const ownerCounts = useMemo(() => {
    let base = [...events];
    if (eventFilter !== "All Events") {
      const map = {
        Meetings: "meeting",
        Tasks: "task",
        Deadlines: "deadline",
        Milestones: "milestone",
        Personal: "personal",
      };
      const cat = map[eventFilter];
      if (cat) base = base.filter((e) => e.category === cat);
    }
    if (projectFilter !== "All Projects") {
      base = base.filter((e) => e.project && (e.project.includes(projectFilter) || projectFilter.includes(e.project)));
    }

    return {
      "My Events": base.filter(isMyEvent).length,
      "Team Events": base.filter(isTeamEvent).length,
      "All Workspace": base.length,
    };
  }, [events, eventFilter, projectFilter]);

  // Position calculation for weekly/daily timetable (0px = 9 AM, 64px = 1 hr)
  const getEventPosition = (ev) => {
    const [startH, startM] = (ev.startTime || "09:00").split(":").map(Number);
    const [endH, endM] = (ev.endTime || "10:00").split(":").map(Number);

    const startMinutesFrom9 = (startH - 9) * 60 + (startM || 0);
    const endMinutesFrom9 = (endH - 9) * 60 + (endM || 0);
    const durationMinutes = Math.max(endMinutesFrom9 - startMinutesFrom9, 30);

    const topPx = (startMinutesFrom9 / 60) * 64;
    const heightPx = Math.max((durationMinutes / 60) * 64, 44);

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

    const formatHour = (tStr) => {
      if (!tStr) return "";
      const [h, m] = tStr.split(":").map(Number);
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return `${h12}:${pad(m)} ${ampm}`;
    };

    const newEv = {
      id: Date.now(),
      title: eventForm.title.trim(),
      category: eventForm.category,
      project: eventForm.project,
      owner: eventForm.owner || "my",
      dayIndex: dayIdx,
      date: eventForm.date,
      startTime: eventForm.startTime,
      endTime: eventForm.endTime,
      timeLabel: `${formatHour(eventForm.startTime)} - ${formatHour(eventForm.endTime)}`,
      color: colors[eventForm.category] || "blue",
      icon: eventForm.category === "meeting" ? "video" : eventForm.category === "personal" ? "square" : "zap",
      meetingUrl: eventForm.meetingUrl,
      description: eventForm.description,
    };

    setEvents((prev) => [...prev, newEv]);
    setAddModalOpen(false);
    setEventForm({
      title: "",
      category: "meeting",
      project: "TeamFlow Website",
      owner: "my",
      date: toDateKey(selectedDate || new Date()),
      startTime: "10:00",
      endTime: "11:00",
      meetingUrl: "https://meet.google.com/teamflow-live-call",
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

  /* =========================================================================
     COMPUTE MINI MONTH CALENDAR GRID
     ========================================================================= */
  const miniMonthDays = useMemo(() => {
    const year = miniDate.getFullYear();
    const month = miniDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    // Overflow from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      cells.push({
        dayNum,
        date: prevDate,
        dateKey: toDateKey(prevDate),
        isCurrentMonth: false,
      });
    }

    // Days in current month
    for (let i = 1; i <= daysInMonth; i++) {
      const curDate = new Date(year, month, i);
      cells.push({
        dayNum: i,
        date: curDate,
        dateKey: toDateKey(curDate),
        isCurrentMonth: true,
      });
    }

    // Overflow into next month to complete 35 or 42 grid cells
    const remaining = 35 - cells.length >= 0 ? 35 - cells.length : 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      cells.push({
        dayNum: i,
        date: nextDate,
        dateKey: toDateKey(nextDate),
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [miniDate]);

  /* =========================================================================
     COMPUTE FULL MONTH VIEW GRID (for Month View Tab)
     ========================================================================= */
  const monthViewDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      cells.push({
        dayNum,
        date: prevDate,
        dateKey: toDateKey(prevDate),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const curDate = new Date(year, month, i);
      cells.push({
        dayNum: i,
        date: curDate,
        dateKey: toDateKey(curDate),
        isCurrentMonth: true,
      });
    }

    const remaining = 35 - cells.length >= 0 ? 35 - cells.length : 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      cells.push({
        dayNum: i,
        date: nextDate,
        dateKey: toDateKey(nextDate),
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [viewDate]);

  /* Today's Schedule events for the selected date */
  const selectedDayEvents = useMemo(() => {
    const selKey = toDateKey(selectedDate);
    return filteredEvents
      .filter((e) => e.date === selKey)
      .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
  }, [filteredEvents, selectedDate]);

  /* Next 7 Days Events */
  const nextSevenDaysEvents = useMemo(() => {
    const now = new Date();
    const nowKey = toDateKey(now);
    const endWindow = new Date(now);
    endWindow.setDate(endWindow.getDate() + 7);
    const endKey = toDateKey(endWindow);

    return filteredEvents
      .filter((e) => e.date >= nowKey && e.date <= endKey)
      .sort((a, b) => (a.date || "").localeCompare(b.date || "") || (a.startTime || "").localeCompare(b.startTime || ""))
      .slice(0, 6);
  }, [filteredEvents]);

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
            <p>Real-time calendar • View your schedule, upcoming meetings, task deadlines and important events.</p>
          </div>

          <div className="tf-cal-header-actions">
            {/* + Add Event Button */}
            <button
              type="button"
              className="tf-cal-add-event-btn"
              onClick={() => {
                setEventForm((prev) => ({
                  ...prev,
                  date: toDateKey(selectedDate || new Date()),
                }));
                setAddModalOpen(true);
              }}
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
                  onClick={() => {
                    setActiveView(view);
                    showToast(`Switched to ${view} view`);
                  }}
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
              onClick={handlePrev}
              aria-label="Previous period"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="tf-cal-arrow-btn"
              onClick={handleNext}
              aria-label="Next period"
            >
              <ChevronRight size={16} />
            </button>

            <span className="tf-cal-range-title">{currentRangeTitle}</span>

            <button
              type="button"
              className="tf-cal-today-btn"
              onClick={handleToday}
            >
              Today
            </button>
          </div>

          {/* Right: Dropdowns */}
          <div className="tf-cal-dropdowns-group">
            {/* 1. All Events / Category */}
            <div className="tf-cal-dropdown-wrap" ref={eventRef}>
              <button
                type="button"
                className="tf-cal-dropdown-btn"
                onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
                aria-expanded={eventDropdownOpen}
              >
                <span>{eventFilter}</span>
                <ChevronDown size={14} className={eventDropdownOpen ? "open" : ""} />
              </button>
              {eventDropdownOpen && (
                <div className="tf-cal-dropdown-menu">
                  {["All Events", "Meetings", "Tasks", "Deadlines", "Milestones", "Personal"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={eventFilter === cat ? "active" : ""}
                      onClick={() => {
                        setEventFilter(cat);
                        setEventDropdownOpen(false);
                        showToast(`Category: ${cat}`);
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
                aria-expanded={projectDropdownOpen}
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
                    "Personal",
                  ].map((proj) => (
                    <button
                      key={proj}
                      type="button"
                      className={projectFilter === proj ? "active" : ""}
                      onClick={() => {
                        setProjectFilter(proj);
                        setProjectDropdownOpen(false);
                        showToast(`Project: ${proj}`);
                      }}
                    >
                      {proj}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. My Events / Scope Filter */}
            <div className="tf-cal-dropdown-wrap" ref={ownerRef}>
              <button
                type="button"
                className={`tf-cal-dropdown-btn ${ownerFilter !== "All Workspace" ? "tf-btn-filtered" : ""}`}
                onClick={() => setOwnerDropdownOpen(!ownerDropdownOpen)}
                aria-expanded={ownerDropdownOpen}
              >
                <span className="tf-cal-btn-with-icon">
                  {ownerFilter === "My Events" && <User size={13} className="tf-filter-btn-icon" />}
                  {ownerFilter === "Team Events" && <Users size={13} className="tf-filter-btn-icon" />}
                  {ownerFilter === "All Workspace" && <Layers size={13} className="tf-filter-btn-icon" />}
                  <span>{ownerFilter}</span>
                </span>
                <ChevronDown size={14} className={ownerDropdownOpen ? "open" : ""} />
              </button>
              {ownerDropdownOpen && (
                <div className="tf-cal-dropdown-menu tf-owner-dropdown-menu">
                  {[
                    { id: "My Events", label: "My Events", icon: User },
                    { id: "Team Events", label: "Team Events", icon: Users },
                    { id: "All Workspace", label: "All Workspace", icon: Layers },
                  ].map(({ id, label, icon: IconComp }) => (
                    <button
                      key={id}
                      type="button"
                      className={`tf-cal-dropdown-item ${ownerFilter === id ? "active" : ""}`}
                      onClick={() => {
                        setOwnerFilter(id);
                        setOwnerDropdownOpen(false);
                        const cnt = ownerCounts[id];
                        showToast(`Showing ${id} (${cnt} ${cnt === 1 ? "event" : "events"})`);
                      }}
                    >
                      <span className="tf-cal-dropdown-item-left">
                        <IconComp size={14} className="tf-dropdown-item-icon" />
                        <span>{label}</span>
                      </span>
                      <span className="tf-cal-dropdown-count">
                        {ownerCounts[id]}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. MAIN TWO-COLUMN LAYOUT
            Left ~70%: Timetable / Month / Day / Agenda + Lower Schedule Cards
            Right ~30%: Mini Calendar + Upcoming Events + Task Deadlines
            ==================================================================== */}
        <div className="tf-cal-main-layout">
          {/* ------------------------------------------------------------------
              LEFT COLUMN: Active View (Week | Month | Day | Agenda) + Bottom Cards
              ------------------------------------------------------------------ */}
          <div className="tf-cal-left-column">
            {/* VIEW A: WEEK VIEW (TIMETABLE GRID) */}
            {activeView === "Week" && (
              <div className="tf-cal-timetable-card">
                {/* Header Days of Week */}
                <div className="tf-cal-grid-header">
                  <div className="tf-cal-time-col-header" />
                  {currentWeekDays.map((d) => (
                    <div
                      key={d.dateKey}
                      className={`tf-cal-day-header ${d.isToday ? "today" : ""} ${d.isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedDate(d.date);
                        showToast(`Selected ${d.dayName}, ${MONTH_SHORT[d.month]} ${d.dateNum}`);
                      }}
                    >
                      <span className="tf-cal-day-name">{d.dayName}</span>
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
                      {currentWeekDays.map((d, dIdx) => (
                        <div
                          key={dIdx}
                          className={`tf-cal-day-cell ${d.isToday ? "today-cell" : ""}`}
                          onClick={() => {
                            setEventForm({
                              title: "",
                              category: "meeting",
                              project: "TeamFlow Website",
                              date: d.dateKey,
                              startTime: `${pad(idx + 9)}:00`,
                              endTime: `${pad(idx + 10)}:00`,
                              meetingUrl: "https://meet.google.com/teamflow-call",
                              description: "",
                            });
                            setAddModalOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  ))}

                  {/* Real-Time Red Current Time Indicator */}
                  {todayColIndex !== -1 && isTimeInRange && (
                    <div className="tf-cal-now-indicator" style={{ top: `${nowTopPx}px` }}>
                      <span className="tf-cal-now-tag">{currentTimeString}</span>
                      <div className="tf-cal-now-line" />
                      <div
                        className="tf-cal-now-dot"
                        style={{
                          left: `calc(70px + (100% - 70px) / 7 * ${todayColIndex} + (100% - 70px) / 14)`,
                        }}
                      />
                    </div>
                  )}

                  {/* Placed Event Blocks matching dynamic week columns */}
                  {filteredEvents.map((ev) => {
                    // Check if event falls within this week
                    const colIdx = currentWeekDays.findIndex((d) => d.dateKey === ev.date);
                    if (colIdx === -1) return null;

                    const pos = getEventPosition(ev);

                    return (
                      <div
                        key={ev.id}
                        className={`tf-cal-event-block ${ev.color || "blue"}`}
                        style={{
                          left: `calc(70px + (100% - 70px) / 7 * ${colIdx} + 4px)`,
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
                          {ev.icon === "square" && <Square size={13} className="tf-ev-icon" />}
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
            )}

            {/* VIEW B: MONTH VIEW */}
            {activeView === "Month" && (
              <div className="tf-cal-month-card">
                {/* Header row */}
                <div className="tf-cal-month-days-header">
                  {DAY_NAMES.map((name) => (
                    <div key={name} className="tf-cal-month-header-cell">
                      {name}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="tf-cal-month-grid">
                  {monthViewDays.map((cell) => {
                    const isToday = isTodayDate(cell.date);
                    const isSelected = isSameDay(cell.date, selectedDate);
                    const dayEvents = filteredEvents.filter((e) => e.date === cell.dateKey);

                    return (
                      <div
                        key={cell.dateKey}
                        className={`tf-cal-month-cell ${!cell.isCurrentMonth ? "muted" : ""} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedDate(cell.date);
                          showToast(`Selected ${MONTH_SHORT[cell.date.getMonth()]} ${cell.dayNum}`);
                        }}
                      >
                        <div className="tf-cal-month-cell-top">
                          <span className="tf-cal-month-date-num">{cell.dayNum}</span>
                        </div>

                        <div className="tf-cal-month-events-wrap">
                          {dayEvents.slice(0, 3).map((ev) => (
                            <span
                              key={ev.id}
                              className={`tf-cal-month-event-pill ${ev.color || "blue"}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEventModal(ev);
                              }}
                            >
                              {ev.startTime} {ev.title}
                            </span>
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="tf-cal-more-chip">+{dayEvents.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW C: DAY VIEW */}
            {activeView === "Day" && (
              <div className="tf-cal-day-card">
                <div className="tf-cal-day-card-header">
                  <h2>{DAY_FULL[selectedDate.getDay()]}, {MONTH_SHORT[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}</h2>
                  {isTodayDate(selectedDate) && <span className="tf-cal-day-badge">Today • Live</span>}
                </div>

                <div className="tf-cal-day-grid-body">
                  {timeSlots.map((time, idx) => (
                    <div key={time} className="tf-cal-day-grid-row">
                      <div className="tf-cal-time-cell">
                        <span>{time}</span>
                      </div>
                      <div
                        className="tf-cal-day-grid-cell"
                        onClick={() => {
                          setEventForm({
                            title: "",
                            category: "meeting",
                            project: "TeamFlow Website",
                            date: toDateKey(selectedDate),
                            startTime: `${pad(idx + 9)}:00`,
                            endTime: `${pad(idx + 10)}:00`,
                            meetingUrl: "https://meet.google.com/teamflow-call",
                            description: "",
                          });
                          setAddModalOpen(true);
                        }}
                      />
                    </div>
                  ))}

                  {/* Red Time Indicator if Selected Day is Today */}
                  {isTodayDate(selectedDate) && isTimeInRange && (
                    <div className="tf-cal-now-indicator" style={{ top: `${nowTopPx}px` }}>
                      <span className="tf-cal-now-tag">{currentTimeString}</span>
                      <div className="tf-cal-now-line" />
                      <div className="tf-cal-now-dot" style={{ left: "50%" }} />
                    </div>
                  )}

                  {/* Day Events */}
                  {selectedDayEvents.map((ev) => {
                    const pos = getEventPosition(ev);
                    return (
                      <div
                        key={ev.id}
                        className={`tf-cal-event-block ${ev.color || "blue"}`}
                        style={{
                          left: "80px",
                          right: "12px",
                          width: "auto",
                          top: pos.top,
                          height: pos.height,
                        }}
                        onClick={() => setSelectedEventModal(ev)}
                      >
                        <div className="tf-cal-event-top-title">
                          {ev.icon === "video" && <Video size={14} className="tf-ev-icon" />}
                          {ev.icon === "zap" && <Zap size={14} className="tf-ev-icon" />}
                          {ev.icon === "square" && <Square size={14} className="tf-ev-icon" />}
                          <strong>{ev.title}</strong>
                        </div>
                        <span className="tf-cal-event-sub">
                          {ev.timeLabel} • {ev.project} {ev.description ? `• ${ev.description}` : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW D: AGENDA VIEW */}
            {activeView === "Agenda" && (
              <div className="tf-cal-agenda-card">
                {filteredEvents.length === 0 ? (
                  <div className="tf-cal-empty-state">
                    <CalendarIcon size={32} color="#94A3B8" />
                    <p>No events scheduled for the selected filters.</p>
                  </div>
                ) : (
                  [...new Set(filteredEvents.map((e) => e.date))].sort().map((dStr) => {
                    const dateObj = new Date(dStr + "T00:00:00");
                    const dateEvents = filteredEvents.filter((e) => e.date === dStr);
                    const isToday = isTodayDate(dateObj);

                    return (
                      <div key={dStr} className="tf-cal-agenda-group">
                        <div className="tf-cal-agenda-date-head">
                          <h3>
                            {DAY_FULL[dateObj.getDay()]}, {MONTH_SHORT[dateObj.getMonth()]} {dateObj.getDate()}, {dateObj.getFullYear()}
                          </h3>
                          {isToday && <span className="tf-cal-agenda-date-badge">Today</span>}
                        </div>

                        <div className="tf-cal-agenda-list">
                          {dateEvents.map((ev) => (
                            <div
                              key={ev.id}
                              className="tf-cal-agenda-item"
                              onClick={() => setSelectedEventModal(ev)}
                            >
                              <div className="tf-cal-agenda-item-left">
                                <span className="tf-cal-agenda-time-pill">{ev.timeLabel}</span>
                                <div className="tf-cal-agenda-details">
                                  <strong>{ev.title}</strong>
                                  <span>{ev.project} • {ev.category}</span>
                                </div>
                              </div>
                              {ev.meetingUrl && (
                                <button
                                  type="button"
                                  className="tf-timeline-join-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setJoiningMeetingModal({ title: ev.title, url: ev.meetingUrl });
                                  }}
                                >
                                  <Video size={14} />
                                  <span>Join</span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Lower 2 Cards (Today's / Selected Schedule & Next 7 Days) */}
            <div className="tf-cal-bottom-split-row">
              {/* Card A: Schedule for Selected Day */}
              <article className="tf-cal-card tf-today-schedule-card">
                <div className="tf-cal-card-header">
                  <h2>{isTodayDate(selectedDate) ? "Today's Schedule" : "Day Schedule"}</h2>
                  <span className="tf-today-date-badge">
                    {DAY_NAMES[selectedDate.getDay()]}, {MONTH_SHORT[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
                  </span>
                </div>

                <div className="tf-today-timeline">
                  {selectedDayEvents.length === 0 ? (
                    <div className="tf-cal-empty-state">
                      <p>No events scheduled for this day.</p>
                      <button
                        type="button"
                        className="tf-cal-empty-state-btn"
                        onClick={() => {
                          setEventForm((prev) => ({ ...prev, date: toDateKey(selectedDate) }));
                          setAddModalOpen(true);
                        }}
                      >
                        + Schedule Event
                      </button>
                    </div>
                  ) : (
                    selectedDayEvents.map((ev) => (
                      <div key={ev.id} className={`tf-timeline-item ${ev.color || "blue"}`}>
                        <div className={`tf-timeline-line-marker ${ev.color || "blue"}`} />
                        <div className="tf-timeline-time">{ev.timeLabel}</div>
                        <div className="tf-timeline-content">
                          <div className="tf-timeline-title">
                            <span className={`tf-timeline-dot ${ev.color || "blue"}`} />
                            <strong>{ev.title}</strong>
                          </div>
                          <span className="tf-timeline-sub">
                            {ev.project} {ev.meetingUrl ? "• Online Meeting" : ""}
                          </span>
                        </div>
                        {ev.meetingUrl && (
                          <button
                            type="button"
                            className="tf-timeline-join-btn"
                            onClick={() =>
                              setJoiningMeetingModal({
                                title: ev.title,
                                url: ev.meetingUrl,
                              })
                            }
                          >
                            <Video size={14} />
                            <span>Join</span>
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </article>

              {/* Card B: Next 7 Days Upcoming */}
              <article className="tf-cal-card tf-next-days-card">
                <div className="tf-cal-card-header">
                  <h2>Next 7 Days</h2>
                  <button
                    type="button"
                    className="tf-cal-view-all-link"
                    onClick={() => setActiveView("Agenda")}
                  >
                    View all <ChevronRight size={14} />
                  </button>
                </div>

                <div className="tf-next-days-list">
                  {nextSevenDaysEvents.length === 0 ? (
                    <div className="tf-cal-empty-state">
                      <p>No upcoming events in the next 7 days.</p>
                    </div>
                  ) : (
                    nextSevenDaysEvents.map((item) => {
                      const dObj = new Date(item.date + "T00:00:00");
                      return (
                        <div
                          key={item.id}
                          className="tf-next-day-row"
                          onClick={() => setSelectedEventModal(item)}
                        >
                          <div className="tf-next-date-col">
                            <strong>{MONTH_SHORT[dObj.getMonth()]} {dObj.getDate()}</strong>
                            <span>{DAY_NAMES[dObj.getDay()]}</span>
                          </div>

                          <div className="tf-next-info-col">
                            <div className="tf-next-title-row">
                              <span className={`tf-dot ${item.color || "blue"}`} />
                              <strong>{item.title}</strong>
                            </div>
                            <span className="tf-next-sub">{item.timeLabel} • {item.project}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </article>
            </div>
          </div>

          {/* ------------------------------------------------------------------
              RIGHT COLUMN: 3 Stacked Widgets (Mini Month, Upcoming, Deadlines)
              ------------------------------------------------------------------ */}
          <div className="tf-cal-right-sidebar">
            {/* Widget 1: Real-Time Mini Month Calendar */}
            <article className="tf-cal-sidebar-card tf-mini-month-card">
              <div className="tf-mini-month-header">
                <button
                  type="button"
                  className="tf-month-nav-arrow"
                  onClick={() =>
                    setMiniDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
                  }
                  aria-label="Previous month"
                >
                  <ChevronLeft size={16} />
                </button>
                <h3>{MONTH_NAMES[miniDate.getMonth()]} {miniDate.getFullYear()}</h3>
                <button
                  type="button"
                  className="tf-month-nav-arrow"
                  onClick={() =>
                    setMiniDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
                  }
                  aria-label="Next month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Days of week */}
              <div className="tf-mini-days-row">
                {DAY_NAMES.map((name) => (
                  <span key={name}>{name}</span>
                ))}
              </div>

              {/* Dynamic Dates Grid */}
              <div className="tf-mini-dates-grid">
                {miniMonthDays.map((cell, idx) => {
                  const isSelected = isSameDay(cell.date, selectedDate);
                  const isToday = isTodayDate(cell.date);

                  // Calculate dots from actual events on this day
                  const dayEvents = events.filter((e) => e.date === cell.dateKey);
                  const dots = [...new Set(dayEvents.map((e) => e.color || "blue"))].slice(0, 3);

                  return (
                    <div
                      key={idx}
                      className={`tf-mini-cell ${!cell.isCurrentMonth ? "muted" : ""} ${isToday ? "today" : ""} ${isSelected ? "active" : ""}`}
                      onClick={() => {
                        setSelectedDate(cell.date);
                        setViewDate(cell.date);
                        showToast(`Viewing ${MONTH_SHORT[cell.date.getMonth()]} ${cell.dayNum}, ${cell.date.getFullYear()}`);
                      }}
                    >
                      <span className="tf-mini-num">{cell.dayNum}</span>
                      {dots.length > 0 && (
                        <div className="tf-mini-dots-group">
                          {dots.map((dColor, dIdx) => (
                            <span key={dIdx} className={`tf-mini-dot ${dColor}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
              </div>
            </article>

            {/* Widget 2: Upcoming Events List */}
            <article className="tf-cal-sidebar-card tf-upcoming-events-card">
              <div className="tf-cal-sidebar-header">
                <h2>Upcoming Schedule</h2>
                {/* <span className="tf-cal-badge-pill">Real-time</span> */}
              </div>

              <div className="tf-upcoming-list">
                {filteredEvents
                  .filter((e) => e.date >= toDateKey(new Date()))
                  .sort((a, b) => (a.date || "").localeCompare(b.date || "") || (a.startTime || "").localeCompare(b.startTime || ""))
                  .slice(0, 5)
                  .map((ev) => (
                    <div
                      key={ev.id}
                      className="tf-upcoming-item"
                      onClick={() => setSelectedEventModal(ev)}
                    >
                      <div className={`tf-upcoming-icon ${ev.color || "blue"}`}>
                        {ev.icon === "video" ? <Video size={15} /> : <Zap size={15} />}
                      </div>
                      <div className="tf-upcoming-content">
                        <strong>{ev.title}</strong>
                        <span>
                          {ev.date} • {ev.timeLabel} • {ev.project}
                        </span>
                      </div>
                    </div>
                  ))}
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
            4. MODALS (Add Event, Event Details, Video Call Simulator)
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

                    <div className="tf-form-field">
                      <label>Scope / Ownership</label>
                      <select
                        value={eventForm.owner || "my"}
                        onChange={(e) => setEventForm({ ...eventForm, owner: e.target.value })}
                      >
                        <option value="my">My Event</option>
                        <option value="team">Team Event</option>
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
                    <p>{selectedEventModal.project} • {selectedEventModal.timeLabel} • <span className={`tf-modal-owner-tag ${selectedEventModal.owner || "my"}`}>{selectedEventModal.owner === "team" ? "Team Event" : "My Event"}</span></p>
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
