import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Folder,
  Bug,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Send,
  Zap,
  Smartphone,
  Rocket,
  Layers,
  FileText,
  User,
  MessageSquare,
  Calendar,
  Check,
  ChevronDown,
  BookOpen,
  Copy,
  CheckCheck,
  X,
  ExternalLink,
  Plus,
} from "lucide-react";

import EmployeeShell from "./EmployeeShell";
import { getEmployeeProfile } from "./EmployeeAuth";
import "./Dashboard.css";

/* Initial Projects matching reference image */
const initialProjects = [
  {
    id: 1,
    name: "TeamFlow Website",
    category: "UI/UX Design",
    progress: 85,
    icon: Zap,
    iconColor: "purple",
    barColor: "green",
  },
  {
    id: 2,
    name: "Mobile App",
    category: "API Integration",
    progress: 62,
    icon: Smartphone,
    iconColor: "blue",
    barColor: "blue",
  },
  {
    id: 3,
    name: "AI Integration",
    category: "Testing & Bugs",
    progress: 40,
    icon: Rocket,
    iconColor: "orange",
    barColor: "yellow",
  },
  {
    id: 4,
    name: "Marketing Portal",
    category: "Content & Design",
    progress: 25,
    icon: Layers,
    iconColor: "purple-soft",
    barColor: "red",
  },
];

/* Initial Tasks: Exactly 12 tasks (5 to do, 4 in progress, 3 completed)
   First 5 match the reference image exactly */
const initialTasks = [
  {
    id: 1,
    title: "Design login page UI",
    project: "TeamFlow Website",
    due: "Today",
    priority: "High",
    completed: true,
    status: "completed",
  },
  {
    id: 2,
    title: "API integration testing",
    project: "Mobile App",
    due: "Tomorrow",
    priority: "Medium",
    completed: false,
    status: "progress",
  },
  {
    id: 3,
    title: "Update project documentation",
    project: "AI Integration",
    due: "Oct 26",
    priority: "Low",
    completed: false,
    status: "todo",
  },
  {
    id: 4,
    title: "Fix responsive issues",
    project: "TeamFlow Website",
    due: "Oct 28",
    priority: "High",
    completed: false,
    status: "todo",
  },
  {
    id: 5,
    title: "Prepare demo for client",
    project: "Marketing Portal",
    due: "Oct 30",
    priority: "Medium",
    completed: false,
    status: "progress",
  },
  {
    id: 6,
    title: "Setup CI/CD pipeline",
    project: "Mobile App",
    due: "Nov 02",
    priority: "Medium",
    completed: false,
    status: "progress",
  },
  {
    id: 7,
    title: "Security audit compliance",
    project: "AI Integration",
    due: "Nov 05",
    priority: "High",
    completed: false,
    status: "todo",
  },
  {
    id: 8,
    title: "Optimize database queries",
    project: "TeamFlow Website",
    due: "Nov 08",
    priority: "Low",
    completed: false,
    status: "todo",
  },
  {
    id: 9,
    title: "Implement push notifications",
    project: "Mobile App",
    due: "Nov 10",
    priority: "Medium",
    completed: false,
    status: "progress",
  },
  {
    id: 10,
    title: "Design user profile modal",
    project: "TeamFlow Website",
    due: "Oct 20",
    priority: "High",
    completed: true,
    status: "completed",
  },
  {
    id: 11,
    title: "Setup test environments",
    project: "AI Integration",
    due: "Oct 22",
    priority: "Medium",
    completed: true,
    status: "completed",
  },
  {
    id: 12,
    title: "Review copy with marketing",
    project: "Marketing Portal",
    due: "Nov 12",
    priority: "Low",
    completed: false,
    status: "todo",
  },
];

/* Initial Chats matching reference image */
const recentChats = [
  {
    id: 1,
    name: "Rahul Sharma",
    avatar: "R",
    avatarColor: "blue",
    preview: "Hey team, the API is ready for testing.",
    time: "10:24 AM",
    unread: 2,
  },
  {
    id: 2,
    name: "Amit Verma",
    avatar: "A",
    avatarColor: "purple",
    preview: "Updated the design file. Please check.",
    time: "09:45 AM",
    unread: 0,
  },
  {
    id: 3,
    name: "TeamFlow - General",
    avatar: "#",
    avatarColor: "purple",
    preview: "Sneha: Meeting at 4 PM today.",
    time: "09:20 AM",
    unread: 0,
  },
  {
    id: 4,
    name: "Project Mobile App",
    avatar: "P",
    avatarColor: "green",
    preview: "Karan: Bug fixed in build.",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: 5,
    name: "Design Team",
    avatar: "D",
    avatarColor: "orange",
    preview: "Neha: Shared new UI components.",
    time: "Yesterday",
    unread: 0,
  },
];

/* Initial Activities matching reference image */
const recentActivities = [
  {
    id: 1,
    type: "completed",
    icon: Check,
    iconColor: "green",
    boldText: "You completed a task",
    subText: "Design homepage UI",
    time: "10:24 AM",
  },
  {
    id: 2,
    type: "assigned",
    icon: User,
    iconColor: "purple",
    boldText: "Rahul assigned you a task",
    subText: "API integration testing",
    time: "09:45 AM",
  },
  {
    id: 3,
    type: "bug",
    icon: Bug,
    iconColor: "red",
    boldText: "You updated a bug",
    subText: "Fixed login issue #245",
    time: "09:20 AM",
  },
  {
    id: 4,
    type: "comment",
    icon: MessageSquare,
    iconColor: "blue",
    boldText: "You commented on a task",
    subText: "Mobile app UI",
    time: "Yesterday",
  },
  {
    id: 5,
    type: "file",
    icon: FileText,
    iconColor: "orange",
    boldText: "Amit shared a file",
    subText: "UI_Design_v2.fig",
    subLink: true,
    time: "Yesterday",
  },
];

/* Events on specific dates for calendar interactivity */
const calendarEventsMap = {
  1: [
    { title: "Team sync & October kickoff", type: "other", time: "10:00 AM" }
  ],
  2: [
    { title: "Design Sprint Backlog Refinement", type: "other", time: "2:30 PM" }
  ],
  9: [
    { title: "Quarterly review with Product Lead", type: "other", time: "11:30 AM" }
  ],
  11: [
    { title: "Milestone: Alpha Release v1.2", type: "milestone", time: "3:00 PM" },
    { title: "Task Deadline: Component UI freeze", type: "deadline", time: "6:00 PM" }
  ],
  17: [
    { title: "Meeting: Mobile App Sprint Sync", type: "meeting", time: "11:00 AM" },
    { title: "Task Deadline: API endpoints verify", type: "deadline", time: "5:00 PM" }
  ],
  22: [
    { title: "Task Deadline: Bug triage batch #4", type: "deadline", time: "4:00 PM" },
    { title: "Milestone: Staging QA Sign-off", type: "milestone", time: "5:30 PM" }
  ],
  23: [
    { title: "Meeting: Design System review with Amit", type: "meeting", time: "2:00 PM" },
    { title: "Task Deadline: Docs update submission", type: "deadline", time: "6:00 PM" }
  ],
  24: [
    { title: "Meeting: Architecture Sync", type: "meeting", time: "10:30 AM" },
    { title: "Task Deadline: Responsive fixes wave 1", type: "deadline", time: "4:00 PM" }
  ],
  29: [
    { title: "Milestone: Final demo dry-run", type: "milestone", time: "2:00 PM" },
    { title: "Task Deadline: Client deck finalize", type: "deadline", time: "5:00 PM" }
  ],
  30: [
    { title: "Meeting: Client Walkthrough Demo", type: "meeting", time: "3:00 PM" },
    { title: "Task Deadline: Release note review", type: "deadline", time: "6:30 PM" }
  ]
};

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getEmployeeProfile);

  // Load and sync tasks from localStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tf_tasks");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5) return parsed;
      }
    } catch {}
    return initialTasks;
  });

  // Projects list
  const [projects] = useState(initialProjects);

  // Active filter tab: "All" | "To Do" | "In Progress" | "Completed"
  const [taskFilter, setTaskFilter] = useState("All");

  // AI assistant state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  // Calendar month state: October 2024 as in reference image
  const [calendarMonth, setCalendarMonth] = useState(new Date(2024, 9, 1));
  const [selectedDay, setSelectedDay] = useState(1);
  const [dayEventsModal, setDayEventsModal] = useState(null);

  // Date range picker toggle
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [currentDateRange, setCurrentDateRange] = useState("Oct 1, 2024 - Oct 31, 2024");

  // File preview modal
  const [fileModal, setFileModal] = useState(null);

  // Keep tasks synced with localStorage
  useEffect(() => {
    localStorage.setItem("tf_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Listen for task updates from shell quick create
  useEffect(() => {
    const handleTaskUpdated = (e) => {
      if (e.detail) {
        setTasks((prev) => [e.detail, ...prev]);
      }
    };
    window.addEventListener("tf_tasks_updated", handleTaskUpdated);
    return () => window.removeEventListener("tf_tasks_updated", handleTaskUpdated);
  }, []);

  // Sync profile info
  useEffect(() => {
    setProfile(getEmployeeProfile());
  }, []);

  // Display user name: dynamic with fallback to "Priya"
  const displayName =
    profile.firstName ||
    (profile.fullName ? profile.fullName.split(" ")[0] : "Priya");

  // Toggle task completion
  const handleToggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            status: nextCompleted ? "completed" : "todo",
          };
        }
        return t;
      })
    );
  };

  // Task Counts
  const taskCounts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed || t.status === "completed").length;
    const progress = tasks.filter((t) => !t.completed && (t.status === "progress" || t.status === "In Progress")).length;
    const todo = tasks.filter((t) => !t.completed && (t.status === "todo" || t.status === "To Do")).length;
    return { total, completed, progress, todo };
  }, [tasks]);

  // Filtered tasks for the dashboard card
  const filteredTasks = useMemo(() => {
    if (taskFilter === "To Do") {
      return tasks.filter((t) => !t.completed && (t.status === "todo" || t.status === "To Do"));
    }
    if (taskFilter === "In Progress") {
      return tasks.filter((t) => !t.completed && (t.status === "progress" || t.status === "In Progress"));
    }
    if (taskFilter === "Completed") {
      return tasks.filter((t) => t.completed || t.status === "completed");
    }
    return tasks;
  }, [tasks, taskFilter]);

  // Handle AI quick prompt click
  const handleQuickPrompt = (promptText) => {
    setAiPrompt(promptText);
    setAiLoading(true);
    setAiAnswer("");

    setTimeout(() => {
      setAiLoading(false);
      if (promptText === "Summarize my tasks") {
        setAiAnswer(
          `You have ${taskCounts.total} active tasks across 4 projects: ${taskCounts.completed} completed, ${taskCounts.progress} in progress, and ${taskCounts.todo} to do. Priority task: "Design login page UI" is completed today. Next up: "API integration testing" for Mobile App due tomorrow.`
        );
      } else if (promptText === "Suggest next tasks") {
        setAiAnswer(
          `Recommended next actions:\n1. Finalize "API integration testing" with Rahul Sharma (due tomorrow).\n2. Review UI components from Amit and address responsive fixes on TeamFlow Website (Oct 28).\n3. Prepare the demo deck for Marketing Portal.`
        );
      } else if (promptText === "Explain this project") {
        setAiAnswer(
          `TeamFlow Website is at 85% completion under UI/UX Design. The remaining 15% covers responsive testing, client review, and final handoff.`
        );
      } else if (promptText === "Help me write a message") {
        setAiAnswer(
          `Draft for Rahul Sharma:\n"Hi Rahul, I've verified the API endpoints and the authentication tests look great. Ready to proceed with the mobile integration!"`
        );
      } else {
        setAiAnswer(`Analysis complete for: "${promptText}". Everything is on schedule.`);
      }
    }, 300);
  };

  const handleSendAI = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    const q = aiPrompt.trim();
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      setAiAnswer(
        `Based on your TeamFlow workspace: For "${q}", your projects (TeamFlow Website, Mobile App) are running smoothly. 1 bug is in progress (#245). You have 2 deadlines this week.`
      );
    }, 350);
  };

  const handleCopyAi = () => {
    if (!aiAnswer) return;
    navigator.clipboard.writeText(aiAnswer);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  // Calendar days grid computation for October 2024
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun, 2 is Tue for Oct 2024
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // 31
    const daysInPrevMonth = new Date(year, month, 0).getDate(); // 30

    const days = [];

    // Previous month filler days (28, 29)
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        currentMonth: false,
        dots: [],
      });
    }

    // Current month days with indicator dots matching reference image
    for (let d = 1; d <= daysInMonth; d++) {
      const dots = [];
      if (d === 1) dots.push("orange");
      if (d === 2) dots.push("orange");
      if (d === 9) dots.push("orange");
      if (d === 11) dots.push("red", "green");
      if (d === 17) dots.push("red", "blue");
      if (d === 22) dots.push("red", "green");
      if (d === 23) dots.push("red", "blue");
      if (d === 24) dots.push("red", "blue");
      if (d === 29) dots.push("red", "green");
      if (d === 30) dots.push("red", "blue");

      days.push({
        day: d,
        currentMonth: true,
        dots,
      });
    }

    // Next month filler days to complete 35 grid cells (1, 2)
    const remaining = 35 - days.length;
    for (let j = 1; j <= remaining; j++) {
      const dots = [];
      if (j === 2) dots.push("orange");
      days.push({
        day: j,
        currentMonth: false,
        dots,
      });
    }

    return days;
  }, [calendarMonth]);

  const handleDayClick = (cell) => {
    if (!cell.currentMonth) return;
    setSelectedDay(cell.day);
    const events = calendarEventsMap[cell.day];
    if (events && events.length > 0) {
      setDayEventsModal({
        day: cell.day,
        monthName: calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        events,
      });
    }
  };

  return (
    <EmployeeShell activeRoute="/employee/dashboard">
      <div className="tf-emp-dashboard">
        {/* ====================================================================
            1. PAGE HEADER (Welcome + Date Range Selector)
            ==================================================================== */}
        <section className="tf-emp-welcome-header">
          <div className="tf-emp-welcome-text">
            <h1>Welcome back, {displayName}! 👋</h1>
            <p>Here's your tasks, projects and updates for today.</p>
          </div>

          <div className="tf-emp-date-range-container">
            <button
              type="button"
              className="tf-emp-date-range-btn"
              onClick={() => setDateRangeOpen(!dateRangeOpen)}
            >
              <Calendar size={15} color="#475569" />
              <span>{currentDateRange}</span>
              <ChevronDown size={14} className={dateRangeOpen ? "open" : ""} />
            </button>

            {dateRangeOpen && (
              <div className="tf-emp-date-picker-dropdown">
                <button
                  type="button"
                  className={currentDateRange.includes("Oct 1, 2024") ? "selected" : ""}
                  onClick={() => {
                    setCurrentDateRange("Oct 1, 2024 - Oct 31, 2024");
                    setDateRangeOpen(false);
                  }}
                >
                  Oct 1, 2024 - Oct 31, 2024 (Full Month)
                </button>
                <button
                  type="button"
                  className={currentDateRange.includes("This Week") ? "selected" : ""}
                  onClick={() => {
                    setCurrentDateRange("Oct 21, 2024 - Oct 27, 2024");
                    setDateRangeOpen(false);
                  }}
                >
                  This Week (Oct 21 - Oct 27, 2024)
                </button>
                <button
                  type="button"
                  className={currentDateRange.includes("Last 30") ? "selected" : ""}
                  onClick={() => {
                    setCurrentDateRange("Last 30 Days");
                    setDateRangeOpen(false);
                  }}
                >
                  Last 30 Days
                </button>
                <button
                  type="button"
                  className={currentDateRange.includes("Q4") ? "selected" : ""}
                  onClick={() => {
                    setCurrentDateRange("Q4 2024 (Oct - Dec)");
                    setDateRangeOpen(false);
                  }}
                >
                  Q4 2024 (Oct 1 - Dec 31, 2024)
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ====================================================================
            2. KPI STAT CARDS ROW (4 across available width)
            ==================================================================== */}
        <section className="tf-emp-kpi-grid">
          {/* Card 1: My Tasks */}
          <div className="tf-emp-stat-card" onClick={() => navigate("/employee/tasks")}>
            <div className="tf-emp-stat-icon-wrapper blue">
              <div className="tf-emp-task-mini-box">
                <Check size={14} color="#FFFFFF" strokeWidth={3.5} />
              </div>
            </div>
            <div className="tf-emp-stat-content">
              <span className="tf-emp-stat-label">My Tasks</span>
              <div className="tf-emp-stat-row">
                <span className="tf-emp-stat-value">12</span>
                <span className="tf-emp-stat-change positive">↑ 25%</span>
              </div>
              <span className="tf-emp-stat-sub">4 completed</span>
            </div>
          </div>

          {/* Card 2: My Projects */}
          <div className="tf-emp-stat-card" onClick={() => navigate("/employee/projects")}>
            <div className="tf-emp-stat-icon-wrapper green">
              <Folder size={22} fill="#10B981" color="#10B981" />
            </div>
            <div className="tf-emp-stat-content">
              <span className="tf-emp-stat-label">My Projects</span>
              <div className="tf-emp-stat-row">
                <span className="tf-emp-stat-value">4</span>
                <span className="tf-emp-stat-change positive">↑ 0%</span>
              </div>
              <span className="tf-emp-stat-sub">2 active</span>
            </div>
          </div>

          {/* Card 3: Assigned Bugs */}
          <div className="tf-emp-stat-card" onClick={() => navigate("/employee/bugs")}>
            <div className="tf-emp-stat-icon-wrapper red">
              <Bug size={22} color="#EF4444" strokeWidth={2.2} />
            </div>
            <div className="tf-emp-stat-content">
              <span className="tf-emp-stat-label">Assigned Bugs</span>
              <div className="tf-emp-stat-row">
                <span className="tf-emp-stat-value">3</span>
                <span className="tf-emp-stat-change negative">↓ 25%</span>
              </div>
              <span className="tf-emp-stat-sub">1 in progress</span>
            </div>
          </div>

          {/* Card 4: Upcoming Deadlines */}
          <div className="tf-emp-stat-card" onClick={() => navigate("/employee/calendar")}>
            <div className="tf-emp-stat-icon-wrapper coral">
              <CalendarDays size={22} color="#EF4444" strokeWidth={2.2} />
            </div>
            <div className="tf-emp-stat-content">
              <span className="tf-emp-stat-label">Upcoming Deadlines</span>
              <div className="tf-emp-stat-row">
                <span className="tf-emp-stat-value">5</span>
                <span className="tf-emp-stat-change positive">↑ 40%</span>
              </div>
              <span className="tf-emp-stat-sub">2 this week</span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. MIDDLE ROW (My Tasks | My Projects | Calendar)
            ==================================================================== */}
        <section className="tf-emp-middle-grid">
          {/* Card 1: My Tasks */}
          <div className="tf-emp-card tf-emp-tasks-card">
            <div className="tf-emp-card-header">
              <h2 className="tf-emp-card-title">My Tasks</h2>
              <Link to="/employee/tasks" className="tf-emp-view-all-link">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {/* Filter Tabs matching exact screenshot */}
            <div className="tf-emp-task-filter-pills">
              <button
                type="button"
                className={`tf-emp-pill ${taskFilter === "All" ? "active" : ""}`}
                onClick={() => setTaskFilter("All")}
              >
                All (12)
              </button>
              <button
                type="button"
                className={`tf-emp-pill ${taskFilter === "To Do" ? "active" : ""}`}
                onClick={() => setTaskFilter("To Do")}
              >
                To Do (5)
              </button>
              <button
                type="button"
                className={`tf-emp-pill ${taskFilter === "In Progress" ? "active" : ""}`}
                onClick={() => setTaskFilter("In Progress")}
              >
                In Progress (4)
              </button>
              <button
                type="button"
                className={`tf-emp-pill ${taskFilter === "Completed" ? "active" : ""}`}
                onClick={() => setTaskFilter("Completed")}
              >
                Completed (3)
              </button>
            </div>

            {/* Task Items List */}
            <div className="tf-emp-task-list">
              {filteredTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className={`tf-emp-task-item ${task.completed ? "completed" : ""}`}
                >
                  <button
                    type="button"
                    className="tf-emp-task-checkbox"
                    onClick={() => handleToggleTask(task.id)}
                    aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                  >
                    {task.completed ? (
                      <div className="tf-emp-task-check-circle checked">
                        <Check size={11} strokeWidth={3.5} color="#FFFFFF" />
                      </div>
                    ) : (
                      <div className="tf-emp-task-check-circle" />
                    )}
                  </button>

                  <div className="tf-emp-task-info">
                    <span className="tf-emp-task-title">{task.title}</span>
                    <span className="tf-emp-task-project">{task.project}</span>
                  </div>

                  <div className="tf-emp-task-meta">
                    <span className="tf-emp-task-due">{task.due}</span>
                    <span className={`tf-emp-priority-tag ${task.priority.toLowerCase()}`}>
                      <span className="tf-emp-priority-dot" />
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: My Projects */}
          <div className="tf-emp-card tf-emp-projects-card">
            <div className="tf-emp-card-header">
              <h2 className="tf-emp-card-title">My Projects</h2>
              <Link to="/employee/projects" className="tf-emp-view-all-link">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="tf-emp-project-list">
              {projects.map((proj) => {
                const IconComponent = proj.icon;
                return (
                  <Link
                    key={proj.id}
                    to="/employee/projects"
                    className="tf-emp-project-item"
                  >
                    <div className={`tf-emp-project-icon-box ${proj.iconColor}`}>
                      <IconComponent size={18} />
                    </div>

                    <div className="tf-emp-project-details">
                      <span className="tf-emp-project-name">{proj.name}</span>
                      <span className="tf-emp-project-category">{proj.category}</span>
                    </div>

                    <div className="tf-emp-project-progress-wrap">
                      <div className="tf-emp-progress-track">
                        <div
                          className={`tf-emp-progress-fill ${proj.barColor}`}
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                      <span className="tf-emp-project-percent">{proj.progress}%</span>
                    </div>

                    <ChevronRight size={16} className="tf-emp-project-chevron" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Card 3: Calendar */}
          <div className="tf-emp-card tf-emp-calendar-card">
            <div className="tf-emp-card-header">
              <h2 className="tf-emp-card-title">Calendar</h2>
              <Link to="/employee/calendar" className="tf-emp-view-all-link">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {/* Month Navigator */}
            <div className="tf-emp-cal-month-nav">
              <button
                type="button"
                className="tf-emp-cal-nav-btn"
                onClick={() =>
                  setCalendarMonth(
                    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)
                  )
                }
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="tf-emp-cal-month-title">
                {calendarMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                type="button"
                className="tf-emp-cal-nav-btn"
                onClick={() =>
                  setCalendarMonth(
                    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
                  )
                }
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Weekdays */}
            <div className="tf-emp-cal-weekdays">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Grid */}
            <div className="tf-emp-cal-grid">
              {calendarDays.map((cell, idx) => {
                const isSelected = cell.currentMonth && cell.day === selectedDay;
                return (
                  <div
                    key={idx}
                    className={`tf-emp-cal-cell ${!cell.currentMonth ? "other-month" : ""} ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() => handleDayClick(cell)}
                  >
                    <span className="tf-emp-cal-num">{cell.day}</span>
                    {cell.dots.length > 0 && (
                      <div className="tf-emp-cal-dots">
                        {cell.dots.map((color, dIdx) => (
                          <span key={dIdx} className={`tf-emp-dot ${color}`} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="tf-emp-cal-legend">
              <div className="tf-emp-legend-item">
                <span className="tf-emp-dot red" />
                <span>Task Deadline</span>
              </div>
              <div className="tf-emp-legend-item">
                <span className="tf-emp-dot blue" />
                <span>Meeting</span>
              </div>
              <div className="tf-emp-legend-item">
                <span className="tf-emp-dot green" />
                <span>Milestone</span>
              </div>
              <div className="tf-emp-legend-item">
                <span className="tf-emp-dot orange" />
                <span>Other</span>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. BOTTOM ROW (Team Chat | Recent Activity | AI Assistant)
            ==================================================================== */}
        <section className="tf-emp-bottom-grid">
          {/* Card 1: Team Chat (Recent) */}
          <div className="tf-emp-card tf-emp-chat-card">
            <div className="tf-emp-card-header">
              <h2 className="tf-emp-card-title">Team Chat (Recent)</h2>
              <Link to="/employee/chat" className="tf-emp-view-all-link">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="tf-emp-chat-list">
              {recentChats.map((chat) => (
                <Link
                  key={chat.id}
                  to="/employee/chat"
                  className="tf-emp-chat-item"
                >
                  <div className={`tf-emp-chat-avatar ${chat.avatarColor}`}>
                    {chat.avatar}
                  </div>

                  <div className="tf-emp-chat-info">
                    <span className="tf-emp-chat-name">{chat.name}</span>
                    <span className="tf-emp-chat-preview">{chat.preview}</span>
                  </div>

                  <div className="tf-emp-chat-meta">
                    <span className="tf-emp-chat-time">{chat.time}</span>
                    {chat.unread > 0 && (
                      <span className="tf-emp-chat-badge">{chat.unread}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Card 2: Recent Activity */}
          <div className="tf-emp-card tf-emp-activity-card">
            <div className="tf-emp-card-header">
              <h2 className="tf-emp-card-title">Recent Activity</h2>
              <Link to="/employee/settings?tab=activity" className="tf-emp-view-all-link">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="tf-emp-activity-list">
              {recentActivities.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="tf-emp-activity-item">
                    <div className={`tf-emp-activity-icon-box ${act.iconColor}`}>
                      <Icon size={16} />
                    </div>

                    <div className="tf-emp-activity-details">
                      <span className="tf-emp-activity-bold">{act.boldText}</span>
                      {act.subLink ? (
                        <button
                          type="button"
                          className="tf-emp-activity-link-btn"
                          onClick={() => setFileModal(act.subText)}
                        >
                          {act.subText}
                        </button>
                      ) : (
                        <span className="tf-emp-activity-sub">{act.subText}</span>
                      )}
                    </div>

                    <span className="tf-emp-activity-time">{act.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: AI Assistant */}
          <div className="tf-emp-card tf-emp-ai-card">
            <div className="tf-emp-card-header">
              <h2 className="tf-emp-card-title">AI Assistant</h2>
              <Link to="/employee/ai-assistant" className="tf-emp-view-all-link">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {/* Greeting */}
            <div className="tf-emp-ai-greeting">
              <div className="tf-emp-ai-hand-icon">👋</div>
              <div className="tf-emp-ai-greeting-text">
                <strong>How can I help you today?</strong>
                <p>Get summaries, suggestions, and answers.</p>
              </div>
            </div>

            {/* Quick Prompts (2x2 grid) */}
            <div className="tf-emp-ai-prompts-grid">
              <button
                type="button"
                className="tf-emp-prompt-card blue-tint"
                onClick={() => handleQuickPrompt("Summarize my tasks")}
              >
                <div className="tf-emp-prompt-icon blue">
                  <FileText size={15} />
                </div>
                <span>Summarize my tasks</span>
              </button>

              <button
                type="button"
                className="tf-emp-prompt-card pink-tint"
                onClick={() => handleQuickPrompt("Suggest next tasks")}
              >
                <div className="tf-emp-prompt-icon pink">
                  <Sparkles size={15} />
                </div>
                <span>Suggest next tasks</span>
              </button>

              <button
                type="button"
                className="tf-emp-prompt-card cyan-tint"
                onClick={() => handleQuickPrompt("Explain this project")}
              >
                <div className="tf-emp-prompt-icon cyan">
                  <BookOpen size={15} />
                </div>
                <span>Explain this project</span>
              </button>

              <button
                type="button"
                className="tf-emp-prompt-card green-tint"
                onClick={() => handleQuickPrompt("Help me write a message")}
              >
                <div className="tf-emp-prompt-icon green">
                  <MessageSquare size={15} />
                </div>
                <span>Help me write a message</span>
              </button>
            </div>

            {/* Inline AI preview if active */}
            {aiLoading && (
              <div className="tf-emp-ai-loading">
                <Sparkles size={15} className="spinner" />
                <span>Thinking and analyzing workspace...</span>
              </div>
            )}

            {aiAnswer && !aiLoading && (
              <div className="tf-emp-ai-inline-answer">
                <div className="tf-emp-ai-answer-header">
                  <span className="tf-emp-ai-tag">TeamFlow AI</span>
                  <div className="tf-emp-ai-actions">
                    <button type="button" onClick={handleCopyAi} title="Copy answer">
                      {copiedAnswer ? <CheckCheck size={14} color="#10B981" /> : <Copy size={14} />}
                    </button>
                    <button type="button" onClick={() => setAiAnswer("")} title="Dismiss">
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <p className="tf-emp-ai-answer-body">{aiAnswer}</p>
                <button
                  type="button"
                  className="tf-emp-ai-open-full"
                  onClick={() => navigate(`/employee/ai-assistant?query=${encodeURIComponent(aiPrompt || aiAnswer)}`)}
                >
                  Continue in AI Assistant <ExternalLink size={12} />
                </button>
              </div>
            )}

            {/* Input Bar with Send Button */}
            <form onSubmit={handleSendAI} className="tf-emp-ai-input-bar">
              <input
                type="text"
                placeholder="Ask anything about your work..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <button
                type="submit"
                className="tf-emp-ai-send-btn"
                aria-label="Send to AI Assistant"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </section>

        {/* Day Events Modal */}
        {dayEventsModal && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDayEventsModal(null);
            }}
          >
            <div className="tf-modal-card" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-group">
                  <div className="tf-modal-icon-box event">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h3>{dayEventsModal.monthName.split(" ")[0]} {dayEventsModal.day}, {dayEventsModal.monthName.split(" ")[1]}</h3>
                    <p>Scheduled events and milestones for this day</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setDayEventsModal(null)}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="tf-day-events-list">
                {dayEventsModal.events.map((ev, i) => (
                  <div key={i} className={`tf-day-event-item ${ev.type}`}>
                    <span className={`tf-emp-dot ${ev.type === "deadline" ? "red" : ev.type === "meeting" ? "blue" : ev.type === "milestone" ? "green" : "orange"}`} />
                    <div className="tf-day-event-info">
                      <strong>{ev.title}</strong>
                      <small>{ev.time}</small>
                    </div>
                  </div>
                ))}
              </div>
              <div className="tf-modal-actions">
                <button
                  type="button"
                  className="tf-btn-secondary"
                  onClick={() => setDayEventsModal(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="tf-btn-primary"
                  onClick={() => {
                    setDayEventsModal(null);
                    navigate("/employee/calendar");
                  }}
                >
                  Open Calendar <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File Preview Modal */}
        {fileModal && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setFileModal(null);
            }}
          >
            <div className="tf-modal-card" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-group">
                  <div className="tf-modal-icon-box task">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3>{fileModal}</h3>
                    <p>Shared by Amit Verma • Figma Design File</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setFileModal(null)}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="tf-file-preview-body">
                <div className="tf-file-box">
                  <FileText size={42} color="#3B82F6" />
                  <strong>UI_Design_v2.fig</strong>
                  <span>Version 2.4 • 14.8 MB • Updated Yesterday</span>
                </div>
              </div>
              <div className="tf-modal-actions">
                <button
                  type="button"
                  className="tf-btn-secondary"
                  onClick={() => setFileModal(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="tf-btn-primary"
                  onClick={() => {
                    setFileModal(null);
                    navigate("/employee/files");
                  }}
                >
                  Go to Files <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeShell>
  );
}

export default Dashboard;
