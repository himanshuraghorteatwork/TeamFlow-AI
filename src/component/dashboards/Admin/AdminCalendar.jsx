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
  Lock,
  Shield,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  MessageSquare,
  PhoneOff,
  Copy,
  Radio,
  AlertCircle,
  Link,
  Globe,
  Play,
  Info,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminCalendar.css";

const STORAGE_KEY = "teamflow_admin_calendar_v4";

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

// Helper for date math (e.g. today + 1 day, today - 1 day)
const getDateOffset = (baseDateStr, offsetDays) => {
  const [y, m, d] = baseDateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d + offsetDays);
  const resY = date.getFullYear();
  const resM = String(date.getMonth() + 1).padStart(2, "0");
  const resD = String(date.getDate()).padStart(2, "0");
  return `${resY}-${resM}-${resD}`;
};

// Generates dynamic, realistic events centered around TODAY with rich Video Meets
const generateDefaultEvents = (todayStr) => {
  const dMinus5 = getDateOffset(todayStr, -5);
  const dMinus2 = getDateOffset(todayStr, -2);
  const dMinus1 = getDateOffset(todayStr, -1);
  const dPlus1 = getDateOffset(todayStr, 1);
  const dPlus2 = getDateOffset(todayStr, 2);
  const dPlus4 = getDateOffset(todayStr, 4);

  return [
    // --- TODAY'S ACTIVE EVENTS & LIVE VIDEO MEETS ---
    {
      id: 501,
      title: "Daily Standup & Sprint Sync",
      date: todayStr,
      time: "10:00 AM - 10:45 AM",
      timeDisplay: "10:00 AM",
      category: "Team Meetings",
      color: "#10b981",
      location: "TeamFlow Meet HD Room",
      isMeet: true,
      meetProvider: "teamflow",
      meetUrl: "https://meet.teamflow.ai/room/tf-standup-oct29",
      passcode: "TF-8492",
      agenda: "Review active sprint blockers, GitHub PR merge approvals, and automated build stability.",
      teamExtra: "+4",
      team: [
        { name: "Amit Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
        { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
      ],
    },
    {
      id: 502,
      title: "Q4 Product Architecture Review",
      date: todayStr,
      time: "11:30 AM - 12:30 PM",
      timeDisplay: "11:30 AM",
      category: "Work",
      color: "#f97316",
      location: "Google Meet",
      isMeet: true,
      meetProvider: "google_meet",
      meetUrl: "https://meet.google.com/par-2026-tf",
      passcode: "839 204",
      agenda: "Microservice decomposition, multi-tenant RBAC policies, and distributed Redis cache layers.",
      teamExtra: "+3",
      team: [
        { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" },
        { name: "Vikram Reddy", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" },
      ],
    },
    {
      id: 503,
      title: "Client Demo: TeamFlow AI Platform",
      date: todayStr,
      time: "02:00 PM - 03:00 PM",
      timeDisplay: "02:00 PM",
      category: "Personal",
      color: "#3b82f6",
      location: "TeamFlow Meet HD Room",
      isMeet: true,
      meetProvider: "teamflow",
      meetUrl: "https://meet.teamflow.ai/room/tf-client-demo",
      passcode: "TF-5501",
      agenda: "Live walkthrough of real-time AI dashboards, permission matrices, and interactive meetings.",
      teamExtra: "+5",
      team: [
        { name: "Amit Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
        { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" },
      ],
    },
    {
      id: 504,
      title: "Bug Triage & Security Patching",
      date: todayStr,
      time: "04:15 PM - 05:00 PM",
      timeDisplay: "04:15 PM",
      category: "Bug Fixes",
      color: "#8b5cf6",
      location: "Zoom Video",
      isMeet: true,
      meetProvider: "zoom",
      meetUrl: "https://zoom.us/j/9482710492",
      passcode: "482019",
      agenda: "Investigate high-severity telemetry alerts and review hotfix PR for token expiration.",
      teamExtra: "+2",
      team: [
        { name: "Vikram Reddy", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" },
        { name: "Sneha Singh", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" },
      ],
    },
    {
      id: 505,
      title: "Monthly All-Hands & Strategy",
      date: todayStr,
      time: "05:30 PM - 06:30 PM",
      timeDisplay: "05:30 PM",
      category: "Organization Events",
      color: "#06b6d4",
      location: "TeamFlow Meet HD Room",
      isMeet: true,
      meetProvider: "teamflow",
      meetUrl: "https://meet.teamflow.ai/room/tf-allhands",
      passcode: "TF-9900",
      agenda: "Executive quarterly updates, company ARR growth, engineering promotions, and Q&A.",
      teamExtra: "+18",
      team: [
        { name: "Amit Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
        { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
        { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" },
      ],
    },

    // --- FUTURE UPCOMING DATES (EDITABLE & SCHEDULE-ABLE) ---
    {
      id: 506,
      title: "AI Model Benchmarking Sync",
      date: dPlus1,
      time: "11:00 AM - 12:00 PM",
      timeDisplay: "11:00 AM",
      category: "Work",
      color: "#f97316",
      location: "Google Meet",
      isMeet: true,
      meetProvider: "google_meet",
      meetUrl: "https://meet.google.com/aim-bench-2026",
      passcode: "991 382",
      agenda: "Evaluate latency metrics for Gemini 1.5 Pro and Flash Lite subagent responses.",
      teamExtra: "+3",
      team: [
        { name: "Amit Kumar", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" },
      ],
    },
    {
      id: 507,
      title: "Design System Accessibility Review",
      date: dPlus1,
      time: "03:00 PM - 04:00 PM",
      timeDisplay: "03:00 PM",
      category: "Personal",
      color: "#3b82f6",
      location: "TeamFlow Meet HD Room",
      isMeet: true,
      meetProvider: "teamflow",
      meetUrl: "https://meet.teamflow.ai/room/tf-a11y-design",
      passcode: "TF-3301",
      agenda: "WCAG 2.1 AA color contrast compliance check across light and dark theme modals.",
      teamExtra: "+4",
      team: [
        { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" },
      ],
    },
    {
      id: 508,
      title: "Q4 Financial Budget & Quota Sync",
      date: dPlus2,
      time: "10:30 AM - 11:30 AM",
      timeDisplay: "10:30 AM",
      category: "Organization Events",
      color: "#06b6d4",
      location: "TeamFlow Meet HD Room",
      isMeet: true,
      meetProvider: "teamflow",
      meetUrl: "https://meet.teamflow.ai/room/tf-fin-sync",
      passcode: "TF-7002",
      agenda: "Review multi-workspace license consumption and enterprise credit utilization.",
      teamExtra: "+6",
      team: [
        { name: "Amit Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
      ],
    },
    {
      id: 509,
      title: "Release Candidate 2.4 Final Sign-off",
      date: dPlus2,
      time: "04:00 PM - 05:00 PM",
      timeDisplay: "04:00 PM",
      category: "Project Deadlines",
      color: "#ef4444",
      location: "DevOps War Room",
      isMeet: false,
      teamExtra: "+8",
      team: [
        { name: "Vikram Reddy", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" },
      ],
    },
    {
      id: 510,
      title: "Customer Success & Feedback Forum",
      date: dPlus4,
      time: "01:00 PM - 02:00 PM",
      timeDisplay: "01:00 PM",
      category: "Team Meetings",
      color: "#10b981",
      location: "Zoom Video",
      isMeet: true,
      meetProvider: "zoom",
      meetUrl: "https://zoom.us/j/9901827401",
      passcode: "820194",
      agenda: "Enterprise customer feedback synthesis and product roadmap prioritization.",
      teamExtra: "+5",
      team: [
        { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
      ],
    },

    // --- PAST HISTORICAL DATES (READ-ONLY ARCHIVE - CAN ONLY BE SEEN/VIEWED) ---
    {
      id: 511,
      title: "Customer Onboarding Sync (Archived)",
      date: dMinus1,
      time: "10:00 AM - 11:00 AM",
      timeDisplay: "10:00 AM",
      category: "Team Meetings",
      color: "#10b981",
      location: "TeamFlow Meet HD Room",
      isMeet: true,
      meetProvider: "teamflow",
      meetUrl: "https://meet.teamflow.ai/room/tf-archive-onboard",
      passcode: "TF-1029",
      agenda: "Provisioning admin accounts and workspace permissions for new engineering cohort.",
      teamExtra: "+4",
      team: [
        { name: "Amit Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
      ],
    },
    {
      id: 512,
      title: "QA Automation Triage (Archived)",
      date: dMinus1,
      time: "03:00 PM - 04:00 PM",
      timeDisplay: "03:00 PM",
      category: "Bug Fixes",
      color: "#8b5cf6",
      location: "QA Central",
      isMeet: false,
      teamExtra: "+3",
      team: [
        { name: "Sneha Singh", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" },
      ],
    },
    {
      id: 513,
      title: "Security Sprint Review (Archived)",
      date: dMinus2,
      time: "11:00 AM - 12:00 PM",
      timeDisplay: "11:00 AM",
      category: "Project Deadlines",
      color: "#ef4444",
      location: "SecOps Pod",
      isMeet: false,
      teamExtra: "+5",
      team: [
        { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
      ],
    },
    {
      id: 514,
      title: "Frontend Architecture Workshop (Archived)",
      date: dMinus5,
      time: "01:00 PM - 02:30 PM",
      timeDisplay: "01:00 PM",
      category: "Work",
      color: "#f97316",
      location: "Dev Lounge",
      isMeet: true,
      meetProvider: "teamflow",
      meetUrl: "https://meet.teamflow.ai/room/tf-fe-arch",
      passcode: "TF-2201",
      agenda: "Component tree optimization and memory leak eradication in table virtualizers.",
      teamExtra: "+6",
      team: [
        { name: "Amit Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
      ],
    },

    // --- FEBRUARY 2024 HISTORICAL EVENTS (PRESERVED FOR BACKWARD COMPATIBILITY) ---
    {
      id: 101,
      title: "Team Meeting",
      date: "2024-02-01",
      time: "10:00 AM - 11:00 AM",
      timeDisplay: "10:00 AM",
      category: "Personal",
      color: "#3b82f6",
      location: "Meeting Room B",
      isMeet: false,
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
      isMeet: true,
      meetProvider: "google_meet",
      meetUrl: "https://meet.google.com/prj-rev-2024",
      teamExtra: "+5",
      team: [
        { name: "Amit Kumar", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" },
        { name: "Sneha Singh", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" },
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
      isMeet: false,
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
      isMeet: true,
      meetProvider: "google_meet",
      meetUrl: "https://meet.google.com/team-demo-2024",
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
      isMeet: false,
      teamExtra: "+4",
      team: [
        { name: "David Lee", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" },
        { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop" },
      ],
    },
  ];
};

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

  // Current Calendar Date (defaults directly to TODAY per user request)
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(realTodayStr);

  // View Mode: Month, Week, Day, List
  const [viewMode, setViewMode] = useState("month");

  // Video Meets Only Filter toggle
  const [meetsOnlyFilter, setMeetsOnlyFilter] = useState(false);

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
        if (Array.isArray(parsed) && parsed.length >= 8) return parsed;
      }
    } catch (e) {}
    return generateDefaultEvents(realTodayStr);
  });

  // Modals & Feedback
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [toast, setToast] = useState(null);

  // Validation States for Dates
  const [dateError, setDateError] = useState(null);
  const [pastDateNotice, setPastDateNotice] = useState(false);

  // Interactive Live Virtual Meeting Room States
  const [liveMeet, setLiveMeet] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [meetDurationSecs, setMeetDurationSecs] = useState(384); // starts at ~06:24
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "Rahul Sharma", text: "Audio and screen feed are crystal clear, Amit!", time: "06:12" },
    { sender: "Priya Patel", text: "I have updated the design prototype specs in Figma.", time: "06:18" },
  ]);

  // Form State with custom features for Video Meets
  const [form, setForm] = useState({
    title: "",
    date: realTodayStr,
    time: "10:00 AM - 11:00 AM",
    category: "Personal",
    location: "Meeting Room A",
    color: "#3b82f6",
    isMeet: false,
    meetProvider: "teamflow",
    meetUrl: "",
    passcode: "",
    agenda: "",
    recordMeeting: true,
    muteOnEntry: false,
    waitingRoom: true,
  });

  // Live timer for virtual meeting room
  useEffect(() => {
    if (!liveMeet) return;
    const interval = setInterval(() => {
      setMeetDurationSecs((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [liveMeet]);

  const formattedMeetDuration = useMemo(() => {
    const mins = Math.floor(meetDurationSecs / 60);
    const secs = meetDurationSecs % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, [meetDurationSecs]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3200);
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

  // Check if a date string is in the past compared to real today
  const isDateInPast = (dateStr) => {
    return dateStr < realTodayStr;
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
    showToast(`Viewing Today: ${realToday.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`);
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthYearLabel = useMemo(() => {
    return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [currentDate]);

  // Toggle category
  const _toggleCategory = (catName) => {
    setActiveCategories((prev) => ({ ...prev, [catName]: !prev[catName] }));
  };

  // Filtered events based on active category checkboxes & video meets filter
  const visibleEvents = useMemo(() => {
    return events.filter((ev) => {
      if (activeCategories[ev.category] === false) return false;
      if (meetsOnlyFilter && !ev.isMeet && !ev.meetUrl) return false;
      return true;
    });
  }, [events, activeCategories, meetsOnlyFilter]);

  // Total meets count
  const meetsCount = useMemo(() => {
    return events.filter((ev) => ev.isMeet || ev.meetUrl).length;
  }, [events]);

  // Selected Day Events
  const selectedDayEvents = useMemo(() => {
    return visibleEvents.filter((ev) => ev.date === selectedDate);
  }, [visibleEvents, selectedDate]);

  // Upcoming events sorted chronologically relative to viewed date
  const upcomingEvents = useMemo(() => {
    return visibleEvents
      .filter((ev) => ev.date >= selectedDate)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
      .slice(0, 6);
  }, [visibleEvents, selectedDate]);

  // =========================================================
  // DYNAMIC CALENDAR MATHEMATICS FOR CURRENT MONTH & YEAR
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

  // =========================================================
  // FORM SUBMISSION & VALIDATION
  // =========================================================
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast("Event title is required.", "error");
      return;
    }

    // STRICT VALIDATION: Old / Past dates are read-only! Cannot schedule in the past
    if (form.date < realTodayStr) {
      setDateError(`Past dates are read-only. Cannot schedule events on ${form.date}. Please select today (${realTodayStr}) or a future date.`);
      showToast("Cannot schedule events on past dates (read-only).", "error");
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
              isMeet: form.isMeet,
              meetProvider: form.meetProvider,
              meetUrl: form.meetUrl,
              passcode: form.passcode,
              agenda: form.agenda,
              recordMeeting: form.recordMeeting,
              muteOnEntry: form.muteOnEntry,
              waitingRoom: form.waitingRoom,
            }
          : ev
      );
      saveEvents(updated);
      setEditingEvent(null);
      showToast(`Updated ${form.isMeet ? "meeting" : "event"} "${form.title}".`);
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
        isMeet: form.isMeet,
        meetProvider: form.meetProvider,
        meetUrl: form.meetUrl,
        passcode: form.passcode,
        agenda: form.agenda,
        recordMeeting: form.recordMeeting,
        muteOnEntry: form.muteOnEntry,
        waitingRoom: form.waitingRoom,
        team: [
          { name: "Amit Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
          { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
        ],
      };
      saveEvents([...events, newEv]);
      showToast(`Scheduled ${form.isMeet ? "video meeting" : "event"} "${newEv.title}".`);
    }

    setShowEventModal(false);
  };

  // Open Create Modal with automatic past-date clamping & notice
  const openCreateModal = (presetDate = null, defaultIsMeet = false) => {
    setEditingEvent(null);
    setDateError(null);

    let targetDate = presetDate || selectedDate;
    let wasPastRedirect = false;

    // If target date is in the past, automatically clamp to TODAY and notify user
    if (isDateInPast(targetDate)) {
      targetDate = realTodayStr;
      wasPastRedirect = true;
      showToast("Past dates are read-only. New event date has been set to Today.", "info");
    }

    setPastDateNotice(wasPastRedirect);

    const generatedMeetId = `tf-${Math.random().toString(36).substring(2, 7)}`;

    setForm({
      title: "",
      date: targetDate,
      time: "10:00 AM - 11:00 AM",
      category: defaultIsMeet ? "Team Meetings" : "Personal",
      location: defaultIsMeet ? "TeamFlow Meet HD Room" : "Meeting Room A",
      color: defaultIsMeet ? "#10b981" : "#3b82f6",
      isMeet: defaultIsMeet,
      meetProvider: "teamflow",
      meetUrl: defaultIsMeet ? `https://meet.teamflow.ai/room/${generatedMeetId}` : "",
      passcode: defaultIsMeet ? `TF-${Math.floor(1000 + Math.random() * 9000)}` : "",
      agenda: "",
      recordMeeting: true,
      muteOnEntry: false,
      waitingRoom: true,
    });
    setShowEventModal(true);
  };

  // Open Create Modal directly configured for a Meet
  const openMeetModal = (presetDate = null) => {
    openCreateModal(presetDate, true);
  };

  const openEditModal = (ev) => {
    setEditingEvent(ev);
    setDateError(null);
    setPastDateNotice(false);

    setForm({
      title: ev.title,
      date: ev.date,
      time: ev.time,
      category: ev.category,
      location: ev.location,
      color: ev.color,
      isMeet: !!ev.isMeet,
      meetProvider: ev.meetProvider || "teamflow",
      meetUrl: ev.meetUrl || (ev.isMeet ? `https://meet.teamflow.ai/room/tf-${ev.id}` : ""),
      passcode: ev.passcode || "",
      agenda: ev.agenda || "",
      recordMeeting: ev.recordMeeting !== false,
      muteOnEntry: !!ev.muteOnEntry,
      waitingRoom: ev.waitingRoom !== false,
    });
    setShowEventModal(true);
  };

  const deleteEvent = (id) => {
    saveEvents(events.filter((ev) => ev.id !== id));
    showToast("Event deleted successfully.");
  };

  // Join Live Video Meeting
  const handleJoinMeet = (ev) => {
    setLiveMeet(ev);
    setMeetDurationSecs(420);
    showToast(`Joining "${ev.title}" Video Meet Room...`, "success");
  };

  // Generate new meeting URL inside modal
  const handleGenerateRoomLink = (provider = form.meetProvider) => {
    const slug = `tf-${Math.random().toString(36).substring(2, 8)}`;
    let url = "";
    if (provider === "google_meet") {
      url = `https://meet.google.com/${slug.slice(0, 3)}-${slug.slice(3, 7)}-${slug.slice(0, 3)}`;
    } else if (provider === "zoom") {
      url = `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    } else if (provider === "teams") {
      url = `https://teams.microsoft.com/l/meetup-join/${slug}`;
    } else {
      url = `https://meet.teamflow.ai/room/${slug}`;
    }

    setForm((prev) => ({
      ...prev,
      meetUrl: url,
      passcode: `TF-${Math.floor(1000 + Math.random() * 9000)}`,
      location: provider === "teamflow" ? "TeamFlow Meet HD Room" : provider === "google_meet" ? "Google Meet" : provider === "zoom" ? "Zoom Video" : "Microsoft Teams",
    }));
    showToast("Generated new secure video room link!");
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
              HEADER SECTION (ENHANCED WITH INSTANT MEET QUICK ACTION)
          ========================================================= */}
          <section className="tfCalHeader">
            <div className="tfCalHeader__left">
              <div className="tfCalHeader__iconBox">
                <CalendarIcon size={24} />
              </div>
              <div className="tfCalHeader__titleGroup">
                <div className="tfCalTitleBadgeRow">
                  <h1>Calendar</h1>
                  <span className="tfTodayLiveBadge">
                    <span className="live-pulse-dot" />
                    <span>Today: {realToday.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </span>
                </div>
                <p>Manage meetings, deadlines, and live video collaborations across your organization.</p>
              </div>
            </div>

            <div className="tfCalHeader__actions">
              {/* CUSTOM FEATURE FOR MEETS: Instant Schedule Meet button */}
              <button
                type="button"
                className="tfCalBtn tfCalBtn--meet"
                onClick={() => openMeetModal()}
                title="Schedule a TeamFlow HD Video Meeting"
              >
                <Video size={16} />
                <span>Schedule Meet</span>
              </button>

              <button
                type="button"
                className="tfCalBtn tfCalBtn--primary"
                onClick={() => openCreateModal()}
                title="Schedule a standard event or deadline"
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
                  setMeetsOnlyFilter(false);
                  showToast("Calendar filters reset to show all events.");
                }}
                title="Reset all category filters"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>
          </section>

          {/* =========================================================
              CONTROLS BAR: TODAY, NAV ARROWS, QUICK SELECTORS, VIEWS
          ========================================================= */}
          <section className="tfCalControlsBar">
            <div className="tfCalControlsBar__left">
              <button
                type="button"
                className={`today-btn ${selectedDate === realTodayStr ? "is-active-today" : ""}`}
                onClick={jumpToToday}
                title="Jump directly to Today"
              >
                <span className="today-dot" />
                <span>Today</span>
              </button>

              <div className="arrow-nav-group">
                <button type="button" className="nav-arrow" onClick={prevMonth} aria-label="Previous month" title="Previous month">
                  <ChevronLeft size={16} />
                </button>
                <button type="button" className="nav-arrow" onClick={nextMonth} aria-label="Next month" title="Next month">
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Dynamic month & year pickers with real Today highlighting */}
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
                    title="Browse exact date (Past dates are view-only)"
                  />
                </div>
              </div>
            </div>

            <div className="tfCalControlsBar__right">
              {/* VIDEO MEETS ONLY QUICK FILTER */}
              <button
                type="button"
                className={`meets-filter-pill ${meetsOnlyFilter ? "active" : ""}`}
                onClick={() => {
                  setMeetsOnlyFilter(!meetsOnlyFilter);
                  showToast(meetsOnlyFilter ? "Showing all events." : "Filtering by Video Meets only.", "info");
                }}
                title="Filter to show only video meetings"
              >
                <Video size={14} />
                <span>Video Meets ({meetsCount})</span>
              </button>

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
              2-COLUMN MAIN LAYOUT:
              - LEFT: MAIN CALENDAR (MONTH, WEEK, DAY, LIST)
              - RIGHT: SIDEBAR (MINI CALENDAR + UPCOMING MEETS + CATEGORIES)
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
                      const isPast = isDateInPast(cell.dateStr);
                      const isHighlightedCircle = isSelected || isRealToday;
                      const cellEvents = visibleEvents.filter((ev) => ev.date === cell.dateStr);

                      return (
                        <div
                          key={idx}
                          className={`month-cell ${!cell.isCurrentMonth ? "other-month" : ""} ${isSelected ? "selected-day" : ""} ${isPast ? "is-past-date" : ""}`}
                          onClick={() => setSelectedDate(cell.dateStr)}
                          onDoubleClick={() => {
                            if (isPast) {
                              showToast("Past dates are read-only. Cannot schedule events in the past.", "warning");
                            } else {
                              openCreateModal(cell.dateStr);
                            }
                          }}
                          title={isPast ? "Past Date · Read Only (Events can only be viewed)" : "Click to view day, double click to schedule"}
                        >
                          <div className="month-cell-header">
                            <span className={`day-number ${isHighlightedCircle ? "today-badge" : ""}`}>
                              {cell.dayNumber}
                            </span>

                            {/* Subtle past date lock badge showing it's read-only */}
                            {isPast && (
                              <span className="past-lock-indicator" title="Past Date · Read Only (Cannot add events)">
                                <Lock size={10} />
                              </span>
                            )}

                            {isRealToday && (
                              <span className="today-chip-label">Today</span>
                            )}
                          </div>

                          <div className="cell-events-list">
                            {cellEvents.map((ev) => {
                              const isMeetEvent = ev.isMeet || ev.meetUrl;
                              return (
                                <div
                                  key={ev.id}
                                  className={`cal-event-pill ${isMeetEvent ? "is-meet-pill" : ""}`}
                                  style={{
                                    backgroundColor: `${ev.color}15`,
                                    borderColor: ev.color,
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(ev);
                                  }}
                                  title={`${ev.time}: ${ev.title}${isMeetEvent ? " (Click to edit or Join meet)" : ""}`}
                                >
                                  <div className="cal-event-left-info">
                                    {isMeetEvent && <Video size={10} className="meet-pill-camera-icon" />}
                                    <span className="cal-event-text" style={{ color: ev.color }}>
                                      <strong>{ev.timeDisplay}</strong> {ev.title}
                                    </span>
                                  </div>

                                  {/* Quick Join Meet Action inside cell pill */}
                                  {isMeetEvent && (
                                    <button
                                      type="button"
                                      className="pill-quick-join-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleJoinMeet(ev);
                                      }}
                                      title="Join Live Video Meet Room"
                                    >
                                      Join
                                    </button>
                                  )}

                                  {ev.team && ev.team.length > 0 && !isMeetEvent && (
                                    <div className="cal-event-avatars">
                                      {ev.team.slice(0, 2).map((m, i) => (
                                        <img key={i} src={m.avatar} alt={m.name} className="pill-avatar" />
                                      ))}
                                      {ev.teamExtra && <span className="extra-count">{ev.teamExtra}</span>}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* WEEK VIEW */}
              {viewMode === "week" && (
                <div className="week-view-wrapper">
                  <div className="week-header-strip">
                    {calendarCells.slice(0, 7).map((c, i) => {
                      const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i];
                      const isToday = c.dateStr === realTodayStr;
                      const isPast = isDateInPast(c.dateStr);

                      return (
                        <div key={i} className={`week-strip-col ${isToday ? "today-highlight" : ""} ${isPast ? "past-strip-col" : ""}`}>
                          <span>{dayName} {c.dayNumber}</span>
                          {isPast && <small className="past-tag"><Lock size={9} /> Read-only</small>}
                          {isToday && <small className="today-tag">Today</small>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="week-columns-container">
                    {calendarCells.slice(0, 7).map((cell) => {
                      const dayEvs = visibleEvents.filter((ev) => ev.date === cell.dateStr);
                      const isPast = isDateInPast(cell.dateStr);

                      return (
                        <div
                          key={cell.dateStr}
                          className={`week-col ${cell.dateStr === selectedDate ? "selected-col" : ""} ${isPast ? "past-week-col" : ""}`}
                          onClick={() => {
                            if (isPast) {
                              showToast("Past dates are read-only. Cannot schedule events in the past.", "warning");
                            } else {
                              openCreateModal(cell.dateStr);
                            }
                          }}
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
                              <div className="week-ev-top">
                                <strong style={{ color: ev.color }}>{ev.time}</strong>
                                {ev.isMeet && (
                                  <button
                                    type="button"
                                    className="week-join-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleJoinMeet(ev);
                                    }}
                                  >
                                    <Video size={10} /> Join
                                  </button>
                                )}
                              </div>
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

              {/* DAY VIEW */}
              {viewMode === "day" && (
                <div className="day-view-wrapper">
                  <div className="day-view-header">
                    <div>
                      <h3>Schedule for {selectedDate} {selectedDate === realTodayStr ? "• Today" : ""}</h3>
                      {isDateInPast(selectedDate) && (
                        <span className="past-date-pill-tag">
                          <Lock size={12} />
                          <span>Historical Past Date · Read Only (Events are archived)</span>
                        </span>
                      )}
                    </div>

                    {isDateInPast(selectedDate) ? (
                      <button
                        type="button"
                        className="btn-past-disabled"
                        onClick={() => showToast("Cannot add events to past dates. Past dates are read-only.", "warning")}
                        title="Past dates are read-only"
                      >
                        <Lock size={13} />
                        <span>Past Date (Read-Only)</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-primary-mini"
                        onClick={() => openCreateModal(selectedDate)}
                      >
                        <Plus size={14} />
                        <span>Add Time Slot</span>
                      </button>
                    )}
                  </div>

                  <div className="day-hourly-agenda">
                    {["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map((hour) => {
                      const hourEvs = selectedDayEvents.filter((e) => e.time.startsWith(hour.slice(0, 2)));
                      const isPastSlot = isDateInPast(selectedDate);

                      return (
                        <div key={hour} className="hour-slot-row">
                          <span className="slot-time">{hour}</span>
                          <div className="slot-content">
                            {hourEvs.length > 0 ? (
                              hourEvs.map((e) => (
                                <div key={e.id} className="hour-ev-box" style={{ borderLeftColor: e.color, backgroundColor: `${e.color}14` }}>
                                  <div className="hour-ev-main">
                                    <strong style={{ color: e.color }}>{e.title}</strong>
                                    <span>{e.time} · {e.location}</span>
                                    {e.agenda && <p className="hour-agenda-snippet">{e.agenda}</p>}
                                  </div>

                                  <div className="hour-ev-actions">
                                    {(e.isMeet || e.meetUrl) && (
                                      <button
                                        type="button"
                                        className="hour-join-meet-btn"
                                        onClick={() => handleJoinMeet(e)}
                                      >
                                        <Video size={13} />
                                        <span>Join Room</span>
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      className="hour-edit-btn"
                                      onClick={() => openEditModal(e)}
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div
                                className={`slot-empty ${isPastSlot ? "past-slot-readonly" : ""}`}
                                onClick={() => {
                                  if (isPastSlot) {
                                    showToast("Past dates and slots are read-only.", "warning");
                                  } else {
                                    openCreateModal(selectedDate);
                                  }
                                }}
                              >
                                {isPastSlot ? (
                                  <span><Lock size={11} /> Historical Slot · Read Only</span>
                                ) : (
                                  <span>+ Available slot (Click to schedule)</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* LIST VIEW */}
              {viewMode === "list" && (
                <div className="list-view-wrapper">
                  <div className="list-view-header">
                    <h3>All Scheduled Events ({visibleEvents.length})</h3>
                  </div>
                  <div className="list-items-table">
                    {visibleEvents.map((ev) => {
                      const isPast = isDateInPast(ev.date);
                      return (
                        <div key={ev.id} className={`list-event-row ${isPast ? "is-past-row" : ""}`}>
                          <div className="list-date-box" style={{ borderLeftColor: ev.color }}>
                            <span className="day">{ev.date.split("-")[2]}</span>
                            <span className="month">{MONTH_NAMES[Number(ev.date.split("-")[1]) - 1]?.slice(0, 3)}</span>
                          </div>

                          <div className="list-info">
                            <div className="list-title-row">
                              <strong>{ev.title}</strong>
                              {ev.date === realTodayStr && <span className="list-today-badge">Today</span>}
                              {isPast && <span className="list-past-badge"><Lock size={10} /> Archived</span>}
                              {(ev.isMeet || ev.meetUrl) && <span className="list-meet-tag"><Video size={11} /> Video Meet</span>}
                            </div>
                            <span>{ev.time} · {ev.location}</span>
                            {ev.agenda && <small className="list-agenda-text">{ev.agenda}</small>}
                          </div>

                          <div className="list-actions">
                            {(ev.isMeet || ev.meetUrl) && (
                              <button
                                type="button"
                                className="mini-btn join-btn"
                                onClick={() => handleJoinMeet(ev)}
                              >
                                <Video size={12} />
                                <span>Join</span>
                              </button>
                            )}
                            <button type="button" className="mini-btn" onClick={() => openEditModal(ev)}>
                              Edit
                            </button>
                            <button type="button" className="mini-btn danger" onClick={() => deleteEvent(ev.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. RIGHT SIDEBAR: MINI CALENDAR + UPCOMING EVENTS + MY CALENDARS */}
            <aside className="tfCalSidebarCol">
              {/* CARD 1: MINI CALENDAR */}
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
                      const isPast = isDateInPast(cell.dateStr);

                      return (
                        <span
                          key={idx}
                          className={`mini-day-cell ${!cell.isCurrentMonth ? "other" : ""} ${isRealToday ? "is-real-today" : ""} ${isSelected ? "today-circle" : ""} ${isPast ? "mini-past" : ""}`}
                          onClick={() => {
                            setSelectedDate(cell.dateStr);
                            if (!cell.isCurrentMonth) {
                              const [y, m] = cell.dateStr.split("-").map(Number);
                              setCurrentDate(new Date(y, m - 1, 1));
                            }
                          }}
                          title={isPast ? `${cell.dateStr} (Past Date · View Only)` : cell.dateStr}
                        >
                          {cell.dayNumber}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CARD 2: UPCOMING EVENTS & ACTIVE MEETS */}
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
                    upcomingEvents.map((ev) => {
                      const isMeet = ev.isMeet || ev.meetUrl;
                      const isToday = ev.date === realTodayStr;

                      return (
                        <div key={ev.id} className="upcoming-event-item" onClick={() => openEditModal(ev)}>
                          <div
                            className="upcoming-event-icon-box"
                            style={{
                              background: `${ev.color}18`,
                              color: ev.color,
                              borderColor: `${ev.color}35`,
                            }}
                          >
                            {isMeet ? <Video size={18} /> : <CalendarDays size={18} />}
                          </div>

                          <div className="upcoming-event-info">
                            <div className="upcoming-title-line">
                              <strong className="upcoming-event-title">{ev.title}</strong>
                              {isToday && <span className="upcoming-today-dot" title="Happening Today" />}
                            </div>
                            <span className="upcoming-event-time">
                              {ev.date.slice(5).replace("-", "/")} {ev.time}
                            </span>
                          </div>

                          {/* DIRECT JOIN BUTTON FOR MEETS */}
                          {isMeet && (
                            <button
                              type="button"
                              className="upcoming-direct-join-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJoinMeet(ev);
                              }}
                              title="Join Video Meeting Room"
                            >
                              <Video size={12} />
                              <span>Join</span>
                            </button>
                          )}

                          <button
                            type="button"
                            className="upcoming-event-more"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(ev);
                            }}
                            title="Edit Event"
                          >
                            <MoreHorizontal size={14} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* =========================================================
          EVENT MODAL (CREATE OR EDIT WITH DATE VALIDATION & MEETS)
      ========================================================= */}
      {showEventModal && (
        <div className="calModalOverlay" onClick={() => setShowEventModal(false)}>
          <div className="calModalBox" onClick={(e) => e.stopPropagation()}>
            <div className="calModalHeader">
              <div className="modal-title-wrap">
                {form.isMeet ? (
                  <div className="modal-icon-wrap meet-glow">
                    <Video size={18} />
                  </div>
                ) : (
                  <div className="modal-icon-wrap">
                    <CalendarIcon size={18} />
                  </div>
                )}
                <div>
                  <h3>{editingEvent ? (form.isMeet ? "Edit Video Meeting" : "Edit Calendar Event") : (form.isMeet ? "Schedule Video Meeting" : "Schedule New Event")}</h3>
                  <p className="modal-subtitle">Configure session details, time intervals, and room links.</p>
                </div>
              </div>
              <button className="calModalClose" onClick={() => setShowEventModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="calModalBody">
                {/* NOTICE IF USER CLICKED A PAST DATE */}
                {pastDateNotice && (
                  <div className="calPastDateNotice">
                    <Info size={15} />
                    <span>Past dates are read-only. This new event has been automatically set to <strong>Today ({realTodayStr})</strong>.</span>
                  </div>
                )}

                {/* ERROR BANNER IF USER MANUALLY PICKS AN OLD DATE */}
                {dateError && (
                  <div className="calDateErrorBanner">
                    <AlertCircle size={15} />
                    <span>{dateError}</span>
                  </div>
                )}

                {/* Event Title */}
                <div className="calFormGroup">
                  <label>Event / Meeting Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder={form.isMeet ? "e.g. Q4 Sprint Standup, Client Architecture Demo" : "e.g. Sprint Planning, Project Review"}
                  />
                </div>

                {/* Date & Time with strict min={realTodayStr} */}
                <div className="calFormRow">
                  <div className="calFormGroup">
                    <label>
                      <span>Date *</span>
                      <small className="cal-label-badge">Min: Today</small>
                    </label>
                    <input
                      type="date"
                      required
                      min={realTodayStr}
                      value={form.date}
                      onChange={(e) => {
                        const newD = e.target.value;
                        setForm({ ...form, date: newD });
                        if (newD < realTodayStr) {
                          setDateError(`Past dates are read-only. Cannot schedule events on ${newD}.`);
                        } else {
                          setDateError(null);
                        }
                      }}
                      className={dateError ? "input-has-error" : ""}
                    />
                    <small className="cal-field-hint">Old dates cannot be scheduled (read-only).</small>
                  </div>

                  <div className="calFormGroup">
                    <label>Time Interval *</label>
                    <input
                      type="text"
                      required
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      placeholder="10:00 AM - 11:30 AM"
                    />
                  </div>
                </div>

                {/* Category & Location */}
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
                    <label>Location / Room</label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. Conference Room 2, TeamFlow Meet"
                    />
                  </div>
                </div>

                {/* =========================================================
                    CUSTOM FEATURE FOR MEETS TOGGLE & CONFIGURATION
                ========================================================= */}
                <div className="calMeetCardSection">
                  <label className="calMeetToggleRow">
                    <input
                      type="checkbox"
                      checked={form.isMeet}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked && !form.meetUrl) {
                          handleGenerateRoomLink(form.meetProvider);
                        }
                        setForm((prev) => ({
                          ...prev,
                          isMeet: checked,
                          category: checked ? "Team Meetings" : prev.category,
                          location: checked ? (prev.meetProvider === "teamflow" ? "TeamFlow Meet HD Room" : "Online Video") : prev.location,
                        }));
                      }}
                    />
                    <div className="meet-toggle-text">
                      <div className="meet-toggle-title">
                        <Video size={16} />
                        <strong>Enable Video Meet Room</strong>
                      </div>
                      <p>Generate interactive video room links, passcodes, and instant conference tools.</p>
                    </div>
                  </label>

                  {form.isMeet && (
                    <div className="calMeetDetailsBox">
                      <div className="calFormRow">
                        <div className="calFormGroup">
                          <label>Meet Provider</label>
                          <select
                            value={form.meetProvider}
                            onChange={(e) => {
                              const prov = e.target.value;
                              setForm({ ...form, meetProvider: prov });
                              handleGenerateRoomLink(prov);
                            }}
                          >
                            <option value="teamflow">📹 TeamFlow Meet (Built-in HD Room)</option>
                            <option value="google_meet">🌐 Google Meet</option>
                            <option value="zoom">💻 Zoom Video</option>
                            <option value="teams">💼 Microsoft Teams</option>
                          </select>
                        </div>

                        <div className="calFormGroup">
                          <label>Meeting Passcode</label>
                          <input
                            type="text"
                            value={form.passcode}
                            onChange={(e) => setForm({ ...form, passcode: e.target.value })}
                            placeholder="e.g. TF-8492"
                          />
                        </div>
                      </div>

                      <div className="calFormGroup">
                        <div className="calMeetUrlLabelRow">
                          <label>Join URL</label>
                          <button
                            type="button"
                            className="calLinkGenerateBtn"
                            onClick={() => handleGenerateRoomLink(form.meetProvider)}
                          >
                            <Sparkles size={12} />
                            <span>Regenerate Link</span>
                          </button>
                        </div>
                        <div className="calUrlInputWrap">
                          <input
                            type="url"
                            value={form.meetUrl}
                            onChange={(e) => setForm({ ...form, meetUrl: e.target.value })}
                            placeholder="https://meet.teamflow.ai/room/..."
                          />
                        </div>
                      </div>

                      <div className="calFormGroup">
                        <label>Meeting Agenda & Discussion Topics</label>
                        <textarea
                          rows={2}
                          value={form.agenda}
                          onChange={(e) => setForm({ ...form, agenda: e.target.value })}
                          placeholder="Outline meeting objectives, deliverables, and discussion items..."
                        />
                      </div>

                      <div className="calMeetCheckboxesRow">
                        <label className="calMiniCheckbox">
                          <input
                            type="checkbox"
                            checked={form.recordMeeting}
                            onChange={(e) => setForm({ ...form, recordMeeting: e.target.checked })}
                          />
                          <span>Record session</span>
                        </label>

                        <label className="calMiniCheckbox">
                          <input
                            type="checkbox"
                            checked={form.muteOnEntry}
                            onChange={(e) => setForm({ ...form, muteOnEntry: e.target.checked })}
                          />
                          <span>Mute mic on entry</span>
                        </label>

                        <label className="calMiniCheckbox">
                          <input
                            type="checkbox"
                            checked={form.waitingRoom}
                            onChange={(e) => setForm({ ...form, waitingRoom: e.target.checked })}
                          />
                          <span>Waiting room</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="calModalFooter cal-modal-actions">
                <button
                  type="button"
                  className="calBtnCancel cal-modal-cancel-btn"
                  onClick={() => setShowEventModal(false)}
                >
                  Cancel
                </button>
                <div className="cal-modal-actions-right">
                  {editingEvent && (
                    <button
                      type="button"
                      className="calBtnDanger cal-modal-delete-btn"
                      onClick={() => {
                        deleteEvent(editingEvent.id);
                        setShowEventModal(false);
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  )}
                  <button type="submit" className="calBtnSubmit cal-modal-submit-btn" disabled={!!dateError}>
                    {editingEvent ? "Save Changes" : (form.isMeet ? "Schedule Meeting" : "Create Event")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          LIVE VIRTUAL MEETING ROOM MODAL (TEAMFLOW MEET)
      ========================================================= */}
      {liveMeet && (
        <div className="tfLiveMeetOverlay" onClick={() => setLiveMeet(null)}>
          <div className="tfLiveMeetBox" onClick={(e) => e.stopPropagation()}>
            {/* MEET HEADER */}
            <div className="tfLiveMeetHeader">
              <div className="tfLiveMeetTitleGroup">
                <div className="tfLiveMeetBadge">
                  <span className="live-dot" />
                  <span>LIVE MEET</span>
                </div>
                <div>
                  <h3>{liveMeet.title}</h3>
                  <div className="tfLiveMeetMetaSub">
                    <span className="tfLiveMeetRoomTag">
                      {liveMeet.meetProvider === "google_meet"
                        ? "Google Meet"
                        : liveMeet.meetProvider === "zoom"
                        ? "Zoom Video"
                        : "TeamFlow HD Room"}: {liveMeet.meetUrl ? liveMeet.meetUrl.split("/").pop() : "Room"}
                    </span>
                    {liveMeet.passcode && <span className="tfLivePasscode">Passcode: {liveMeet.passcode}</span>}
                  </div>
                </div>
              </div>

              <div className="tfLiveMeetStats">
                <span className="meet-timer"><Clock size={13} /> {formattedMeetDuration}</span>
                <span className="meet-rec-badge"><Radio size={12} /> REC 1080p</span>
                <span className="meet-secure-badge"><Shield size={12} /> Encrypted</span>
                <button
                  type="button"
                  className="tfLiveMeetCloseBtn"
                  onClick={() => {
                    setLiveMeet(null);
                    showToast("Left meeting room.");
                  }}
                  title="Close Meeting Window"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* MEET BODY & VIDEO TILES */}
            <div className="tfLiveMeetBody">
              <div className="tfLiveMeetStage">
                {isScreenSharing ? (
                  <div className="tfScreenShareFrame">
                    <div className="tfScreenShareHeader">
                      <Monitor size={15} />
                      <span>Amit Sharma is presenting screen — TeamFlow AI Performance Monitor</span>
                    </div>
                    <div className="tfScreenShareCanvas">
                      <div className="mock-code-screen">
                        <div className="mock-code-bar">
                          <span className="dot red" />
                          <span className="dot yellow" />
                          <span className="dot green" />
                          <span className="file-name">teamflow-webrtc-node.ts</span>
                        </div>
                        <pre>
{`// TeamFlow Real-Time Video Conference Engine v4.2
import { WebRTCStream, AudioMatrix, Encryption } from "@teamflow/webrtc";

export const activeConference = new WebRTCStream({
  room: "${liveMeet.meetUrl ? liveMeet.meetUrl.split("/").pop() : "tf-room-main"}",
  quality: "1080p60",
  encryption: "AES-GCM-256-Bit",
  participants: 4,
  activeSpeaker: "Amit Sharma (Org Admin)",
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="tfVideoTilesGrid">
                    {/* Tile 1: Host (Amit Sharma / You) */}
                    <div className={`tfVideoTile ${isCameraOff ? "camera-off" : ""}`}>
                      {isCameraOff ? (
                        <div className="tfTileAvatar">
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop" alt="Amit Sharma" />
                          <span>Amit Sharma (Camera Off)</span>
                        </div>
                      ) : (
                        <div className="tfTileVideoMock host-stream">
                          <div className="tfLiveCamIndicator">HD Camera Feed</div>
                        </div>
                      )}
                      <div className="tfTileMeta">
                        <span className="tfTileName">Amit Sharma (Host · You)</span>
                        <span className={`tfTileMicBadge ${isMicMuted ? "muted" : "live"}`}>
                          {isMicMuted ? <MicOff size={11} /> : <Mic size={11} />}
                        </span>
                      </div>
                    </div>

                    {/* Tile 2: Rahul Sharma */}
                    <div className="tfVideoTile active-speaker">
                      <div className="tfTileVideoMock speaker-stream">
                        <div className="tfSpeakerWaves">
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                      <div className="tfTileMeta">
                        <span className="tfTileName">Rahul Sharma (Engineering)</span>
                        <span className="tfTileMicBadge live"><Mic size={11} /></span>
                      </div>
                    </div>

                    {/* Tile 3: Priya Patel */}
                    <div className="tfVideoTile">
                      <div className="tfTileVideoMock participant-stream priya" />
                      <div className="tfTileMeta">
                        <span className="tfTileName">Priya Patel (Product)</span>
                        <span className="tfTileMicBadge live"><Mic size={11} /></span>
                      </div>
                    </div>

                    {/* Tile 4: Elena Rostova */}
                    <div className="tfVideoTile">
                      <div className="tfTileVideoMock participant-stream elena" />
                      <div className="tfTileMeta">
                        <span className="tfTileName">Elena Rostova (UI/UX)</span>
                        <span className="tfTileMicBadge muted"><MicOff size={11} /></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Call Control Strip */}
                <div className="tfMeetControlBar">
                  <button
                    type="button"
                    className={`meet-ctrl-btn ${isMicMuted ? "btn-danger" : ""}`}
                    onClick={() => {
                      setIsMicMuted(!isMicMuted);
                      showToast(isMicMuted ? "Microphone unmuted." : "Microphone muted.", "info");
                    }}
                    title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
                  >
                    {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
                    <span>{isMicMuted ? "Unmute" : "Mute"}</span>
                  </button>

                  <button
                    type="button"
                    className={`meet-ctrl-btn ${isCameraOff ? "btn-danger" : ""}`}
                    onClick={() => {
                      setIsCameraOff(!isCameraOff);
                      showToast(isCameraOff ? "Camera turned on." : "Camera turned off.", "info");
                    }}
                    title={isCameraOff ? "Turn On Camera" : "Turn Off Camera"}
                  >
                    {isCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
                    <span>{isCameraOff ? "Start Video" : "Stop Video"}</span>
                  </button>

                  <button
                    type="button"
                    className={`meet-ctrl-btn ${isScreenSharing ? "btn-active" : ""}`}
                    onClick={() => {
                      setIsScreenSharing(!isScreenSharing);
                      showToast(isScreenSharing ? "Stopped screen presentation." : "Started screen presentation.", "info");
                    }}
                    title="Share Screen"
                  >
                    <Monitor size={18} />
                    <span>{isScreenSharing ? "Stop Share" : "Share"}</span>
                  </button>

                  <button
                    type="button"
                    className={`meet-ctrl-btn ${isChatOpen ? "btn-active" : ""}`}
                    onClick={() => {
                      setIsChatOpen(!isChatOpen);
                      if (isParticipantsOpen) setIsParticipantsOpen(false);
                    }}
                    title="Toggle Chat"
                  >
                    <MessageSquare size={18} />
                    <span>Chat</span>
                  </button>

                  <button
                    type="button"
                    className={`meet-ctrl-btn ${isParticipantsOpen ? "btn-active" : ""}`}
                    onClick={() => {
                      setIsParticipantsOpen(!isParticipantsOpen);
                      if (isChatOpen) setIsChatOpen(false);
                    }}
                    title="View Participants"
                  >
                    <Users size={18} />
                    <span>Participants (4)</span>
                  </button>

                  <button
                    type="button"
                    className="meet-ctrl-btn"
                    onClick={() => {
                      if (liveMeet.meetUrl) {
                        try {
                          navigator.clipboard.writeText(liveMeet.meetUrl);
                          showToast("Meeting invite link copied to clipboard!");
                        } catch (e) {}
                      }
                    }}
                    title="Copy Meeting Invite Link"
                  >
                    <Copy size={18} />
                    <span>Copy Link</span>
                  </button>

                  {liveMeet.meetUrl && (
                    <a
                      href={liveMeet.meetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="meet-ctrl-btn"
                      title="Launch in External Window"
                    >
                      <ExternalLink size={18} />
                      <span>External</span>
                    </a>
                  )}

                  <button
                    type="button"
                    className="meet-ctrl-btn btn-leave"
                    onClick={() => {
                      setLiveMeet(null);
                      showToast("You left the meeting.");
                    }}
                    title="Leave Meeting"
                  >
                    <PhoneOff size={18} />
                    <span>Leave</span>
                  </button>
                </div>
              </div>

              {/* Side Chat Drawer */}
              {isChatOpen && (
                <div className="tfMeetSidePanel">
                  <div className="tfMeetSideHeader">
                    <h4>In-Call Chat</h4>
                    <button onClick={() => setIsChatOpen(false)}><X size={15} /></button>
                  </div>
                  <div className="tfMeetChatMessages">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`chat-bubble ${msg.sender === "Amit Sharma" ? "mine" : ""}`}>
                        <strong className="chat-sender">{msg.sender} <small>{msg.time}</small></strong>
                        <p>{msg.text}</p>
                      </div>
                    ))}
                  </div>
                  <form
                    className="tfMeetChatInputForm"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!chatInput.trim()) return;
                      setChatMessages([...chatMessages, { sender: "Amit Sharma", text: chatInput.trim(), time: "Just now" }]);
                      setChatInput("");
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Type a message to participants..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                    />
                    <button type="submit">Send</button>
                  </form>
                </div>
              )}

              {/* Side Participants Drawer */}
              {isParticipantsOpen && (
                <div className="tfMeetSidePanel">
                  <div className="tfMeetSideHeader">
                    <h4>Participants (4)</h4>
                    <button onClick={() => setIsParticipantsOpen(false)}><X size={15} /></button>
                  </div>
                  <div className="tfMeetParticipantsList">
                    <div className="participant-item">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" alt="Amit" />
                      <div className="p-info">
                        <strong>Amit Sharma (Host · You)</strong>
                        <small>Org Admin</small>
                      </div>
                      <div className="p-icons">
                        {isMicMuted ? <MicOff size={13} className="mic-red" /> : <Mic size={13} className="mic-green" />}
                        {isCameraOff ? <VideoOff size={13} className="mic-red" /> : <Video size={13} className="mic-green" />}
                      </div>
                    </div>

                    <div className="participant-item">
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" alt="Rahul" />
                      <div className="p-info">
                        <strong>Rahul Sharma</strong>
                        <small>Engineering Lead</small>
                      </div>
                      <div className="p-icons">
                        <Mic size={13} className="mic-green" />
                        <Video size={13} className="mic-green" />
                      </div>
                    </div>

                    <div className="participant-item">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" alt="Priya" />
                      <div className="p-info">
                        <strong>Priya Patel</strong>
                        <small>Product Lead</small>
                      </div>
                      <div className="p-icons">
                        <Mic size={13} className="mic-green" />
                        <Video size={13} className="mic-green" />
                      </div>
                    </div>

                    <div className="participant-item">
                      <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" alt="Elena" />
                      <div className="p-info">
                        <strong>Elena Rostova</strong>
                        <small>UI/UX Lead</small>
                      </div>
                      <div className="p-icons">
                        <MicOff size={13} className="mic-red" />
                        <Video size={13} className="mic-green" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
