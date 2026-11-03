/**
 * Centralized Calendar Synchronization Module for TeamFlow AI
 * 
 * Synchronizes events, dates, and status across:
 * - /employee/calendar (Employee Calendar full view)
 * - /employee/dashboard (Dashboard mini-calendar card & day-events modal)
 * - /employee/meetings (Meetings sidebar mini-calendar)
 * - /employee/activity (Activity sidebar calendar)
 * - Global "+ Event" modal (EmployeeShell quick action)
 * - Cross-role mirrors (TeamLead & Admin calendar events)
 */

export const STORAGE_KEY = "tf_calendar_events_v4";
export const TASKS_STORAGE_KEY = "tf_calendar_tasks_v4";
export const LEGACY_EVENTS_KEY = "tf_events";
export const TEAMLEAD_STORAGE_KEY = "teamflow_calendar_events";
export const ADMIN_STORAGE_KEY = "teamflow_admin_calendar_v4";

/* Date Utilities */
export const pad = (n) => String(n).padStart(2, "0");

export const toDateKey = (d) => {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  return toDateKey(d1) === toDateKey(d2);
};

export const isTodayDate = (d) => {
  return isSameDay(d, new Date());
};

export const formatHour = (tStr) => {
  if (!tStr) return "";
  const [h, m = "00"] = tStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${ampm}`;
};

export const formatTimeRange = (start, end) => {
  if (!start && !end) return "All day";
  if (start && !end) return formatHour(start);
  if (!start && end) return `Until ${formatHour(end)}`;
  return `${formatHour(start)} - ${formatHour(end)}`;
};

/* Default event color mapping */
export const CATEGORY_COLORS = {
  meeting: "blue",
  deadline: "red",
  task: "orange",
  milestone: "green",
  personal: "purple",
  other: "orange",
};

export const CATEGORY_ICONS = {
  meeting: "video",
  deadline: "circle",
  task: "square",
  milestone: "layers",
  personal: "zap",
  other: "zap",
};

/**
 * Generate fresh default events dynamic to the current week/month
 */
export const generateDefaultEvents = (baseDate = new Date()) => {
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

/**
 * Normalizes an event item to ensure all standard properties are present
 */
export const normalizeEvent = (ev) => {
  if (!ev) return null;
  const date = ev.date ? toDateKey(ev.date) : toDateKey(new Date());
  const category = (ev.category || ev.type || "meeting").toLowerCase();
  const startTime = ev.startTime || ev.time || "10:00";
  const endTime = ev.endTime || "11:00";
  const timeLabel = ev.timeLabel || formatTimeRange(startTime, endTime);
  const color = ev.color || CATEGORY_COLORS[category] || "blue";
  const icon = ev.icon || CATEGORY_ICONS[category] || "video";

  return {
    id: ev.id || `ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: ev.title || "Untitled Event",
    category,
    project: ev.project || "TeamFlow Website",
    owner: ev.owner || "my",
    date,
    startTime,
    endTime,
    timeLabel,
    color,
    icon,
    meetingUrl: ev.meetingUrl || (category === "meeting" ? "https://meet.google.com/teamflow-call" : ""),
    description: ev.description || "",
    completed: !!ev.completed,
  };
};

/**
 * Get all current calendar events from localStorage,
 * falling back to defaults or legacy stores if needed.
 */
export const getCalendarEvents = () => {
  let list = [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed.map(normalizeEvent).filter(Boolean);
      }
    }
  } catch (e) {
    console.error("Failed to read primary calendar events:", e);
  }

  // Check if we need to load or merge legacy/teamlead stores
  if (list.length === 0) {
    try {
      const tlSaved = localStorage.getItem(TEAMLEAD_STORAGE_KEY);
      if (tlSaved) {
        const parsed = JSON.parse(tlSaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed.map(normalizeEvent).filter(Boolean);
        }
      }
    } catch {}
  }

  if (list.length === 0) {
    try {
      const legacySaved = localStorage.getItem(LEGACY_EVENTS_KEY);
      if (legacySaved) {
        const parsed = JSON.parse(legacySaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed.map(normalizeEvent).filter(Boolean);
        }
      }
    } catch {}
  }

  // If still empty or outdated, initialize with dynamic current defaults
  if (list.length === 0) {
    list = generateDefaultEvents(new Date());
    setCalendarEvents(list);
    return list;
  }

  // Merge any orphaned events from legacy tf_events
  try {
    const legacySaved = localStorage.getItem(LEGACY_EVENTS_KEY);
    if (legacySaved) {
      const legacyArr = JSON.parse(legacySaved);
      if (Array.isArray(legacyArr)) {
        let added = false;
        legacyArr.forEach((le) => {
          if (le && le.id && !list.some((existing) => String(existing.id) === String(le.id))) {
            const normalized = normalizeEvent(le);
            if (normalized) {
              list.push(normalized);
              added = true;
            }
          }
        });
        if (added) {
          setCalendarEvents(list);
        }
      }
    }
  } catch {}

  return list;
};

/**
 * Persist calendar events across all storage keys and dispatch sync events
 */
export const setCalendarEvents = (events) => {
  if (!Array.isArray(events)) return;
  const serialized = JSON.stringify(events);

  try {
    const currentStored = localStorage.getItem(STORAGE_KEY);
    if (currentStored === serialized) {
      return; // No change, prevent unnecessary dispatch loops
    }
    localStorage.setItem(STORAGE_KEY, serialized);
    // Mirror to other keys for backwards compatibility and cross-role sync
    localStorage.setItem(LEGACY_EVENTS_KEY, serialized);
    localStorage.setItem(TEAMLEAD_STORAGE_KEY, serialized);
    localStorage.setItem(ADMIN_STORAGE_KEY, serialized);
  } catch (e) {
    console.error("Failed to write calendar events to localStorage:", e);
  }

  // Dispatch custom events for real-time reactivity within the same window
  try {
    window.dispatchEvent(new CustomEvent("tf_calendar_sync", { detail: { events } }));
    window.dispatchEvent(new CustomEvent("tf_events_updated", { detail: events }));
  } catch {}
};

/**
 * Add a new event and immediately propagate everywhere
 */
export const addCalendarEvent = (rawEvent) => {
  const current = getCalendarEvents();
  const normalized = normalizeEvent({
    ...rawEvent,
    id: rawEvent.id || `ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  });

  const updated = [normalized, ...current];
  setCalendarEvents(updated);
  return normalized;
};

/**
 * Update an existing event by ID
 */
export const updateCalendarEvent = (id, patch) => {
  const current = getCalendarEvents();
  const updated = current.map((ev) => {
    if (String(ev.id) === String(id)) {
      return normalizeEvent({ ...ev, ...patch });
    }
    return ev;
  });
  setCalendarEvents(updated);
};

/**
 * Delete an event by ID
 */
export const deleteCalendarEvent = (id) => {
  const current = getCalendarEvents();
  const updated = current.filter((ev) => String(ev.id) !== String(id));
  setCalendarEvents(updated);
};

/**
 * Get all events for a given YYYY-MM-DD date string
 */
export const getCalendarEventsForDate = (dateStr, eventsList = null) => {
  const list = eventsList || getCalendarEvents();
  return list.filter((ev) => ev.date === dateStr);
};

/**
 * Standardized dot color generator for any date
 * Returns array of colors: ["blue", "red", "green", "orange"]
 */
export const getCalendarDots = (dateStr, eventsList = [], tasksList = [], meetingsList = []) => {
  const dots = [];

  // Check Calendar Events
  if (Array.isArray(eventsList)) {
    eventsList.forEach((ev) => {
      if (ev.date === dateStr) {
        const cat = (ev.category || ev.type || "").toLowerCase();
        if (cat === "meeting" && !dots.includes("blue")) dots.push("blue");
        else if (cat === "deadline" && !dots.includes("red")) dots.push("red");
        else if (cat === "milestone" && !dots.includes("green")) dots.push("green");
        else if ((cat === "personal" || cat === "task" || cat === "other") && !dots.includes("orange")) {
          dots.push("orange");
        }
      }
    });
  }

  // Check Meetings
  if (Array.isArray(meetingsList)) {
    const hasMeeting = meetingsList.some((m) => m.date === dateStr);
    if (hasMeeting && !dots.includes("blue")) dots.push("blue");
  }

  // Check Tasks
  if (Array.isArray(tasksList)) {
    const hasTask = tasksList.some((t) => t.dueDate === dateStr || (t.date && t.date === dateStr));
    if (hasTask && !dots.includes("red")) dots.push("red");
  }

  return dots;
};

/**
 * React helper to subscribe to calendar sync events across tabs and within the window
 */
export const subscribeToCalendarSync = (callback) => {
  const handleSync = (e) => {
    if (e && e.detail && Array.isArray(e.detail.events)) {
      callback(e.detail.events);
    } else {
      callback(getCalendarEvents());
    }
  };

  const handleStorage = (e) => {
    if (
      !e ||
      e.key === STORAGE_KEY ||
      e.key === LEGACY_EVENTS_KEY ||
      e.key === TEAMLEAD_STORAGE_KEY ||
      e.key === ADMIN_STORAGE_KEY
    ) {
      callback(getCalendarEvents());
    }
  };

  window.addEventListener("tf_calendar_sync", handleSync);
  window.addEventListener("tf_events_updated", handleSync);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener("tf_calendar_sync", handleSync);
    window.removeEventListener("tf_events_updated", handleSync);
    window.removeEventListener("storage", handleStorage);
  };
};
