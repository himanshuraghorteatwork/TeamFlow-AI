import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  CheckSquare,
  Square,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flag,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Zap,
  Smartphone,
  Rocket,
  Layers,
  Eye,
  MessageSquare,
  Paperclip,
  MoreVertical,
  Calendar,
  Sparkles,
  Check,
  Trash2,
  Copy,
  ExternalLink,
  FileText,
  Download,
  Edit3,
} from "lucide-react";

import EmployeeShell from "./EmployeeShell";
import "./Tasks.css";

/* Storage Key */
const STORAGE_KEY = "tf_my_tasks_v3";

/* Initial 12 Tasks matching the reference image exactly */
const defaultTasks = [
  {
    id: 1,
    title: "Design login page UI",
    description: "Create modern and responsive login page",
    project: "TeamFlow Website",
    projectIcon: "zap",
    projectBg: "purple",
    dueDate: "Today",
    isDueToday: true,
    isOverdue: true,
    priority: "High",
    status: "In Progress",
    commentsCount: 2,
    hasAttachments: true,
    attachments: [
      { name: "login_mockup_v2.fig", size: "4.2 MB", type: "figma" },
      { name: "auth_specs.pdf", size: "1.1 MB", type: "pdf" },
    ],
    comments: [
      { id: 1, author: "Rahul Sharma", text: "Please make sure password reset flow matches the new branding.", time: "10:24 AM" },
      { id: 2, author: "Amit Verma", text: "Looks great, responsive breakpoints are tested.", time: "Yesterday" },
    ],
  },
  {
    id: 2,
    title: "API integration testing",
    description: "Test all API endpoints and fix issues",
    project: "Mobile App",
    projectIcon: "phone",
    projectBg: "blue",
    dueDate: "Tomorrow",
    isDueTomorrow: true,
    isOverdue: false,
    priority: "Medium",
    status: "To Do",
    commentsCount: 0,
    hasAttachments: true,
    attachments: [
      { name: "api_endpoints_postman.json", size: "520 KB", type: "json" },
    ],
    comments: [],
  },
  {
    id: 3,
    title: "Update project documentation",
    description: "Write and update API documentation",
    project: "AI Integration",
    projectIcon: "rocket",
    projectBg: "orange",
    dueDate: "Oct 26",
    isOverdue: false,
    priority: "Low",
    status: "In Progress",
    commentsCount: 1,
    hasAttachments: true,
    attachments: [
      { name: "ai_docs_draft.md", size: "45 KB", type: "doc" },
    ],
    comments: [
      { id: 1, author: "Sneha Rao", text: "Added the Swagger schema reference link.", time: "Oct 24" },
    ],
  },
  {
    id: 4,
    title: "Fix responsive issues",
    description: "Resolve mobile and tablet view issues",
    project: "TeamFlow Website",
    projectIcon: "zap",
    projectBg: "purple",
    dueDate: "Oct 28",
    isOverdue: false,
    priority: "High",
    status: "To Do",
    commentsCount: 0,
    hasAttachments: true,
    attachments: [],
    comments: [],
  },
  {
    id: 5,
    title: "Prepare demo for client",
    description: "Create demo and presentation",
    project: "Marketing Portal",
    projectIcon: "layers",
    projectBg: "purple-soft",
    dueDate: "Oct 30",
    isOverdue: false,
    priority: "Medium",
    status: "To Do",
    commentsCount: 0,
    hasAttachments: true,
    attachments: [
      { name: "client_demo_deck.pdf", size: "8.6 MB", type: "pdf" },
    ],
    comments: [],
  },
  {
    id: 6,
    title: "Design user profile page",
    description: "UI design for user profile settings",
    project: "TeamFlow Website",
    projectIcon: "zap",
    projectBg: "purple",
    dueDate: "Nov 2",
    isOverdue: false,
    priority: "Medium",
    status: "In Progress",
    commentsCount: 3,
    hasAttachments: true,
    attachments: [
      { name: "profile_settings_v3.fig", size: "3.4 MB", type: "figma" },
    ],
    comments: [
      { id: 1, author: "Neha Gupta", text: "Added avatar upload preview component.", time: "Oct 22" },
      { id: 2, author: "Priya Patel", text: "Will review the notification toggles section.", time: "Oct 23" },
      { id: 3, author: "Rahul Sharma", text: "Approved for implementation.", time: "Yesterday" },
    ],
  },
  {
    id: 7,
    title: "Test notification system",
    description: "Verify email and in-app notifications",
    project: "Mobile App",
    projectIcon: "phone",
    projectBg: "blue",
    dueDate: "Nov 5",
    isOverdue: false,
    priority: "Low",
    status: "To Do",
    commentsCount: 0,
    hasAttachments: true,
    attachments: [],
    comments: [],
  },
  {
    id: 8,
    title: "Create help center content",
    description: "Write FAQs and guides",
    project: "Marketing Portal",
    projectIcon: "layers",
    projectBg: "purple-soft",
    dueDate: "Nov 8",
    isOverdue: false,
    priority: "Low",
    status: "To Do",
    commentsCount: 0,
    hasAttachments: true,
    attachments: [],
    comments: [],
  },
  {
    id: 9,
    title: "Optimize database queries",
    description: "Improve performance and fix slow queries",
    project: "AI Integration",
    projectIcon: "rocket",
    projectBg: "orange",
    dueDate: "Nov 10",
    isOverdue: false,
    priority: "High",
    status: "In Progress",
    commentsCount: 0,
    hasAttachments: true,
    attachments: [],
    comments: [],
  },
  {
    id: 10,
    title: "Implement dark mode",
    description: "Add dark mode support in the application",
    project: "Mobile App",
    projectIcon: "phone",
    projectBg: "blue",
    dueDate: "Nov 12",
    isOverdue: false,
    priority: "Medium",
    status: "To Do",
    commentsCount: 0,
    hasAttachments: true,
    attachments: [],
    comments: [],
  },
  {
    id: 11,
    title: "Setup staging environment",
    description: "Configure cloud staging cluster for QA validation",
    project: "TeamFlow Website",
    projectIcon: "zap",
    projectBg: "purple",
    dueDate: "Oct 15",
    isOverdue: false,
    priority: "Medium",
    status: "Completed",
    commentsCount: 1,
    hasAttachments: true,
    attachments: [
      { name: "staging_config.yaml", size: "12 KB", type: "code" },
    ],
    comments: [
      { id: 1, author: "DevOps Team", text: "Cluster deployed with SSL certificates active.", time: "Oct 15" },
    ],
  },
  {
    id: 12,
    title: "Security vulnerability patch",
    description: "Update dependencies and patch security alerts",
    project: "Mobile App",
    projectIcon: "phone",
    projectBg: "blue",
    dueDate: "Oct 12",
    isOverdue: true, // Marked overdue in past / completed in month
    priority: "High",
    status: "Completed",
    commentsCount: 2,
    hasAttachments: true,
    attachments: [
      { name: "security_audit_report.pdf", size: "2.1 MB", type: "pdf" },
    ],
    comments: [
      { id: 1, author: "Security Bot", text: "Zero high vulnerabilities remaining.", time: "Oct 12" },
    ],
  },
];

/* Helper to normalize task data */
const normalizeTask = (t, idx = 0) => {
  return {
    id: t?.id || Date.now() + idx,
    title: t?.title || `Task ${idx + 1}`,
    description: t?.description || "Collaborative task assigned to your workflow.",
    project: t?.project || "TeamFlow Website",
    projectIcon: t?.projectIcon || "zap",
    projectBg: t?.projectBg || "purple",
    dueDate: t?.dueDate || "Oct 30",
    isDueToday: Boolean(t?.isDueToday || t?.dueDate === "Today"),
    isDueTomorrow: Boolean(t?.isDueTomorrow || t?.dueDate === "Tomorrow"),
    isOverdue: Boolean(t?.isOverdue),
    priority: t?.priority || "Medium",
    status: t?.status || "To Do",
    commentsCount: Array.isArray(t?.comments) ? t.comments.length : (typeof t?.commentsCount === "number" ? t.commentsCount : 0),
    hasAttachments: Boolean(t?.hasAttachments || (Array.isArray(t?.attachments) && t.attachments.length > 0)),
    attachments: Array.isArray(t?.attachments) ? t.attachments : [],
    comments: Array.isArray(t?.comments) ? t.comments : [],
  };
};

/* Upcoming Deadlines Widget Items */
const upcomingDeadlinesList = [
  {
    id: 1,
    title: "Design login page UI",
    dueDate: "Today",
    isToday: true,
    priority: "High",
    color: "red",
  },
  {
    id: 2,
    title: "API integration testing",
    dueDate: "Tomorrow",
    isTomorrow: true,
    priority: "Medium",
    color: "orange",
  },
  {
    id: 3,
    title: "Update documentation",
    dueDate: "Oct 26",
    priority: "Low",
    color: "blue",
  },
  {
    id: 4,
    title: "Fix responsive issues",
    dueDate: "Oct 28",
    priority: "High",
    color: "red",
  },
  {
    id: 5,
    title: "Prepare demo for client",
    dueDate: "Oct 30",
    priority: "Medium",
    color: "orange",
  },
];

/* AI Task Suggestions */
const defaultAiSuggestions = [
  {
    id: "sug-1",
    title: "Break down large tasks",
    description: "Split complex tasks into smaller steps",
    actionNote: "Suggested: Split 'Design login page UI' into Wireframe and Mockup sub-tasks.",
  },
  {
    id: "sug-2",
    title: "Set realistic due dates",
    description: "Based on your current workload",
    actionNote: "Suggested: Move 'API integration testing' to Thursday to balance workload.",
  },
  {
    id: "sug-3",
    title: "Add task descriptions",
    description: "Detailed descriptions help you stay focused",
    actionNote: "Suggested: Added checklist and requirements to 3 pending tasks.",
  },
];

function Tasks() {
  // Load tasks from localStorage safely
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4) {
          return parsed.map((t, i) => normalizeTask(t, i));
        }
      }
    } catch (e) {
      console.warn("Using default tasks:", e);
    }
    return defaultTasks.map((t, i) => normalizeTask(t, i));
  });

  // Filter tabs: All | To Do | In Progress | Completed | Overdue
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // Dropdown states
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [statusDropdownTaskId, setStatusDropdownTaskId] = useState(null);
  const [actionMenuTaskId, setActionMenuTaskId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);

  // Selection
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalTask, setDetailsModalTask] = useState(null);
  const [commentsModalTask, setCommentsModalTask] = useState(null);
  const [attachmentsModalTask, setAttachmentsModalTask] = useState(null);

  // Edit Task Form State (Matches user reference screenshot)
  const [editTaskForm, setEditTaskForm] = useState({
    id: null,
    title: "",
    project: "",
    assignee: "Rahul Sharma",
    priority: "Medium",
    status: "In Progress",
    description: "",
  });

  const handleOpenEditTask = (task) => {
    setDetailsModalTask(task);
    setEditTaskForm({
      id: task.id,
      title: task.title || "",
      project: task.project || "Backend API",
      assignee: task.assignee || "Rahul Sharma",
      priority: task.priority || "Medium",
      status: task.status || "In Progress",
      description: task.description || "",
    });
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (!editTaskForm.title.trim()) return;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === editTaskForm.id) {
          return {
            ...t,
            title: editTaskForm.title.trim(),
            project: editTaskForm.project,
            assignee: editTaskForm.assignee,
            priority: editTaskForm.priority,
            status: editTaskForm.status,
            description: editTaskForm.description.trim(),
          };
        }
        return t;
      })
    );
    setDetailsModalTask(null);
    showToast("Task updated successfully!");
  };

  // New Comment input
  const [newCommentText, setNewCommentText] = useState("");

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  // Applied AI suggestions
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set());

  // Create Task Form State
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    project: "TeamFlow Website",
    priority: "Medium",
    status: "To Do",
    dueDate: new Date().toISOString().split("T")[0],
  });

  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const rowsRef = useRef(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Close popovers on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortDropdownOpen(false);
      }
      if (rowsRef.current && !rowsRef.current.contains(e.target)) {
        setRowsDropdownOpen(false);
      }
      if (!e.target.closest(".tf-task-status-dropdown-wrap")) {
        setStatusDropdownTaskId(null);
      }
      if (!e.target.closest(".tf-task-action-menu-wrap")) {
        setActionMenuTaskId(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Compute stats dynamically
  const stats = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const toDo = tasks.filter((t) => t.status === "To Do").length;
    const overdue = tasks.filter((t) => t.isOverdue || (t.dueDate === "Today" && t.status !== "Completed")).length;
    return { total, inProgress, completed, toDo, overdue };
  }, [tasks]);

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Tab filter
    if (activeTab === "To Do") {
      result = result.filter((t) => t.status === "To Do");
    } else if (activeTab === "In Progress") {
      result = result.filter((t) => t.status === "In Progress");
    } else if (activeTab === "Completed") {
      result = result.filter((t) => t.status === "Completed");
    } else if (activeTab === "Overdue") {
      result = result.filter((t) => t.isOverdue || (t.dueDate === "Today" && t.status !== "Completed"));
    }

    // Priority filter
    if (priorityFilter !== "All") {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Project filter
    if (projectFilter !== "All") {
      result = result.filter((t) => t.project === projectFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          (t?.title || "").toLowerCase().includes(q) ||
          (t?.description || "").toLowerCase().includes(q) ||
          (t?.project || "").toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => (a?.title || "").localeCompare(b?.title || ""));
    } else if (sortBy === "priority") {
      const pMap = { High: 3, Medium: 2, Low: 1 };
      result.sort((a, b) => (pMap[b?.priority] || 0) - (pMap[a?.priority] || 0));
    } else if (sortBy === "dueDate") {
      result.sort((a, b) => (a?.dueDate === "Today" ? -1 : 1));
    }

    return result;
  }, [tasks, activeTab, priorityFilter, projectFilter, searchQuery, sortBy]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / rowsPerPage));
  const displayedTasks = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredTasks.slice(start, start + rowsPerPage);
  }, [filteredTasks, currentPage, rowsPerPage]);

  // Toggle completion with circular checkbox
  const handleToggleComplete = (task) => {
    const nextStatus = task.status === "Completed" ? "In Progress" : "Completed";
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
    );
    showToast(
      nextStatus === "Completed"
        ? `Task "${task.title}" marked as completed!`
        : `Task "${task.title}" marked as in progress.`
    );
  };

  // Change task status from dropdown
  const handleChangeStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    setStatusDropdownTaskId(null);
    showToast(`Status updated to "${newStatus}"`);
  };

  // Handle Select All
  const handleSelectAll = () => {
    if (selectedTaskIds.length === displayedTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(displayedTasks.map((t) => t.id));
    }
  };

  // Handle single row select
  const handleSelectRow = (taskId) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  // Handle Create Task
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    const projectConfig = {
      "TeamFlow Website": { icon: "zap", bg: "purple" },
      "Mobile App": { icon: "phone", bg: "blue" },
      "AI Integration": { icon: "rocket", bg: "orange" },
      "Marketing Portal": { icon: "layers", bg: "purple-soft" },
    };

    const cfg = projectConfig[taskForm.project] || { icon: "zap", bg: "purple" };

    const newTask = {
      id: Date.now(),
      title: taskForm.title.trim(),
      description: taskForm.description.trim() || "Collaborative task assigned to personal workflow.",
      project: taskForm.project,
      projectIcon: cfg.icon,
      projectBg: cfg.bg,
      dueDate: taskForm.dueDate || "Oct 30",
      isDueToday: taskForm.dueDate === "Today" || taskForm.dueDate === new Date().toISOString().split("T")[0],
      isOverdue: false,
      priority: taskForm.priority,
      status: taskForm.status,
      commentsCount: 0,
      hasAttachments: false,
      attachments: [],
      comments: [],
    };

    setTasks((prev) => [newTask, ...prev]);
    setCreateModalOpen(false);
    setTaskForm({
      title: "",
      description: "",
      project: "TeamFlow Website",
      priority: "Medium",
      status: "To Do",
      dueDate: new Date().toISOString().split("T")[0],
    });
    showToast("New task created successfully!");
  };

  // Handle Delete Task
  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setActionMenuTaskId(null);
    showToast("Task deleted.");
  };

  // Handle Duplicate Task
  const handleDuplicateTask = (task) => {
    const dup = {
      ...task,
      id: Date.now(),
      title: `${task.title} (Copy)`,
      status: "To Do",
    };
    setTasks((prev) => [dup, ...prev]);
    setActionMenuTaskId(null);
    showToast("Task duplicated.");
  };

  // Handle Add Comment
  const handleAddComment = () => {
    if (!newCommentText.trim() || !commentsModalTask) return;
    const newComment = {
      id: Date.now(),
      author: "Priya Patel",
      text: newCommentText.trim(),
      time: "Just now",
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === commentsModalTask.id) {
          const updatedComments = [...(t.comments || []), newComment];
          return {
            ...t,
            comments: updatedComments,
            commentsCount: updatedComments.length,
          };
        }
        return t;
      })
    );

    setCommentsModalTask((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
      commentsCount: (prev.comments || []).length + 1,
    }));

    setNewCommentText("");
    showToast("Comment posted!");
  };

  // Handle Apply AI Suggestion
  const handleApplySuggestion = (sug) => {
    setAppliedSuggestions((prev) => new Set([...prev, sug.id]));
    showToast(`Applied: ${sug.title}! ${sug.actionNote}`);
  };

  // Render project icon
  const renderProjectIcon = (icon) => {
    switch (icon) {
      case "phone":
        return <Smartphone size={13} />;
      case "rocket":
        return <Rocket size={13} />;
      case "layers":
        return <Layers size={13} />;
      case "zap":
      default:
        return <Zap size={13} />;
    }
  };

  // Donut chart calculations (Active/Completed/To Do)
  // Matching reference: 33% Completed (4), 33% In Progress (4), 33% To Do (4)
  const totalSummary = Math.max(stats.total, 1);
  const completedPct = Math.round((stats.completed / totalSummary) * 100);
  const inProgressPct = Math.round((stats.inProgress / totalSummary) * 100);
  const toDoPct = Math.max(0, 100 - completedPct - inProgressPct);

  // Circumference for r=36 is 2 * PI * 36 = 226.2
  const c = 226.2;
  const completedStroke = (completedPct / 100) * c;
  const inProgressStroke = (inProgressPct / 100) * c;
  const toDoStroke = (toDoPct / 100) * c;

  const completedOffset = 0;
  const inProgressOffset = -completedStroke;
  const toDoOffset = -(completedStroke + inProgressStroke);

  return (
    <EmployeeShell activeRoute="/employee/tasks">
      <div className="tf-tasks-page">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="tf-task-toast" role="status">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ====================================================================
            1. PAGE HEADER (Title + Subtitle + "+ Add Personal Task" Button)
            ==================================================================== */}
        <header className="tf-tasks-header">
          <div className="tf-tasks-title-group">
            <h1>My Tasks</h1>
            <p>Manage and track your assigned tasks. Update status, add comments, and attach files.</p>
          </div>

          <button
            type="button"
            className="tf-tasks-add-btn"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Personal Task</span>
          </button>
        </header>

        {/* ====================================================================
            2. TOP 4 METRIC KPI STAT CARDS
            ==================================================================== */}
        <section className="tf-tasks-stats-grid">
          {/* Card 1: Total Tasks */}
          <div
            className={`tf-task-stat-card ${activeTab === "All" ? "selected" : ""}`}
            onClick={() => setActiveTab("All")}
          >
            <div className="tf-task-stat-icon blue">
              <CheckSquare size={20} color="#FFFFFF" strokeWidth={2.2} />
            </div>
            <div className="tf-task-stat-body">
              <span className="tf-task-stat-label">Total Tasks</span>
              <div className="tf-task-stat-val-row">
                <strong className="tf-task-stat-value">{stats.total}</strong>
                <span className="tf-task-stat-badge positive">↑ 25%</span>
              </div>
              <span className="tf-task-stat-sub">{stats.completed} completed</span>
            </div>
          </div>

          {/* Card 2: In Progress */}
          <div
            className={`tf-task-stat-card ${activeTab === "In Progress" ? "selected" : ""}`}
            onClick={() => setActiveTab("In Progress")}
          >
            <div className="tf-task-stat-icon orange">
              <Clock size={20} color="#F59E0B" strokeWidth={2.4} />
            </div>
            <div className="tf-task-stat-body">
              <span className="tf-task-stat-label">In Progress</span>
              <div className="tf-task-stat-val-row">
                <strong className="tf-task-stat-value">{stats.inProgress}</strong>
                <span className="tf-task-stat-badge neutral">↑ 0%</span>
              </div>
              <span className="tf-task-stat-sub">Currently working</span>
            </div>
          </div>

          {/* Card 3: Overdue */}
          <div
            className={`tf-task-stat-card ${activeTab === "Overdue" ? "selected" : ""}`}
            onClick={() => setActiveTab("Overdue")}
          >
            <div className="tf-task-stat-icon red">
              <div className="tf-task-red-ring" />
            </div>
            <div className="tf-task-stat-body">
              <span className="tf-task-stat-label">Overdue</span>
              <div className="tf-task-stat-val-row">
                <strong className="tf-task-stat-value">{stats.overdue}</strong>
                <span className="tf-task-stat-badge negative">↑ 100%</span>
              </div>
              <span className="tf-task-stat-sub">Need attention</span>
            </div>
          </div>

          {/* Card 4: Completed */}
          <div
            className={`tf-task-stat-card ${activeTab === "Completed" ? "selected" : ""}`}
            onClick={() => setActiveTab("Completed")}
          >
            <div className="tf-task-stat-icon green">
              <Flag size={19} color="#10B981" fill="#10B981" />
            </div>
            <div className="tf-task-stat-body">
              <span className="tf-task-stat-label">Completed</span>
              <div className="tf-task-stat-val-row">
                <strong className="tf-task-stat-value">{stats.completed}</strong>
                <span className="tf-task-stat-badge positive">↑ 33%</span>
              </div>
              <span className="tf-task-stat-sub">This month</span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. FILTER TABS & CONTROLS ROW
            ==================================================================== */}
        <section className="tf-tasks-controls-row">
          {/* Left: Filter Pills */}
          <div className="tf-tasks-filter-pills">
            <button
              type="button"
              className={`tf-task-pill ${activeTab === "All" ? "active" : ""}`}
              onClick={() => setActiveTab("All")}
            >
              All ({stats.total})
            </button>
            <button
              type="button"
              className={`tf-task-pill ${activeTab === "To Do" ? "active" : ""}`}
              onClick={() => setActiveTab("To Do")}
            >
              To Do ({stats.toDo})
            </button>
            <button
              type="button"
              className={`tf-task-pill ${activeTab === "In Progress" ? "active" : ""}`}
              onClick={() => setActiveTab("In Progress")}
            >
              In Progress ({stats.inProgress})
            </button>
            <button
              type="button"
              className={`tf-task-pill ${activeTab === "Completed" ? "active" : ""}`}
              onClick={() => setActiveTab("Completed")}
            >
              Completed ({stats.completed})
            </button>
            <button
              type="button"
              className={`tf-task-pill ${activeTab === "Overdue" ? "active" : ""}`}
              onClick={() => setActiveTab("Overdue")}
            >
              Overdue ({stats.overdue})
            </button>
          </div>

          {/* Right: Search, Filter dropdown, Sort dropdown */}
          <div className="tf-tasks-actions-group">
            {/* Search Input */}
            <div className="tf-task-search-box">
              <Search size={15} className="tf-task-search-icon" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="tf-task-search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="tf-task-dropdown-wrap" ref={filterRef}>
              <button
                type="button"
                className="tf-task-dropdown-btn"
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
              >
                <Filter size={14} />
                <span>Filter</span>
                <ChevronDown size={14} className={filterDropdownOpen ? "open" : ""} />
              </button>

              {filterDropdownOpen && (
                <div className="tf-task-dropdown-menu tf-filter-popover">
                  <div className="tf-filter-section">
                    <span className="tf-filter-heading">Priority</span>
                    {["All", "High", "Medium", "Low"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={priorityFilter === p ? "active" : ""}
                        onClick={() => {
                          setPriorityFilter(p);
                          setFilterDropdownOpen(false);
                        }}
                      >
                        {p === "All" ? "All Priorities" : p}
                      </button>
                    ))}
                  </div>

                  <div className="tf-filter-section">
                    <span className="tf-filter-heading">Project</span>
                    {[
                      "All",
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
                          setFilterDropdownOpen(false);
                        }}
                      >
                        {proj === "All" ? "All Projects" : proj}
                      </button>
                    ))}
                  </div>

                  {(priorityFilter !== "All" || projectFilter !== "All") && (
                    <button
                      type="button"
                      className="tf-filter-reset-btn"
                      onClick={() => {
                        setPriorityFilter("All");
                        setProjectFilter("All");
                        setFilterDropdownOpen(false);
                      }}
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sort by Dropdown */}
            <div className="tf-task-dropdown-wrap" ref={sortRef}>
              <button
                type="button"
                className="tf-task-dropdown-btn"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              >
                <ArrowUpDown size={14} />
                <span>Sort by</span>
                <ChevronDown size={14} className={sortDropdownOpen ? "open" : ""} />
              </button>

              {sortDropdownOpen && (
                <div className="tf-task-dropdown-menu">
                  <button
                    type="button"
                    className={sortBy === "default" ? "active" : ""}
                    onClick={() => {
                      setSortBy("default");
                      setSortDropdownOpen(false);
                    }}
                  >
                    Default Order
                  </button>
                  <button
                    type="button"
                    className={sortBy === "dueDate" ? "active" : ""}
                    onClick={() => {
                      setSortBy("dueDate");
                      setSortDropdownOpen(false);
                    }}
                  >
                    Due Date
                  </button>
                  <button
                    type="button"
                    className={sortBy === "priority" ? "active" : ""}
                    onClick={() => {
                      setSortBy("priority");
                      setSortDropdownOpen(false);
                    }}
                  >
                    Priority (High to Low)
                  </button>
                  <button
                    type="button"
                    className={sortBy === "name" ? "active" : ""}
                    onClick={() => {
                      setSortBy("name");
                      setSortDropdownOpen(false);
                    }}
                  >
                    Task Name (A - Z)
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. TWO-COLUMN LAYOUT (Left ~70% Tasks Table | Right ~30% Widgets)
            ==================================================================== */}
        <div className="tf-tasks-main-layout">
          {/* ------------------------------------------------------------------
              LEFT COLUMN: Tasks Table + Pagination Footer
              ------------------------------------------------------------------ */}
          <div className="tf-tasks-table-card">
            <div className="tf-tasks-table-responsive">
              <table className="tf-tasks-table">
                <thead>
                  <tr>
                    <th className="tf-th-num">Sr</th>
                    <th className="tf-th-checkbox">
                      <button
                        type="button"
                        className="tf-checkbox-th-btn"
                        onClick={handleSelectAll}
                        aria-label="Select all tasks"
                      >
                        {selectedTaskIds.length === displayedTasks.length && displayedTasks.length > 0 ? (
                          <div className="tf-custom-checkbox checked">
                            <Check size={12} color="#FFFFFF" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="tf-custom-checkbox" />
                        )}
                      </button>
                    </th>
                    <th>Task Name</th>
                    <th>Project</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th className="tf-th-actions">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedTasks.map((t, idx) => {
                    const rowNum = (currentPage - 1) * rowsPerPage + idx + 1;
                    const isCompleted = t.status === "Completed";
                    const statusSlug = (t.status || "To Do").toLowerCase().replace(" ", "-");
                    const prioritySlug = (t.priority || "Medium").toLowerCase();
                    const isSelected = selectedTaskIds.includes(t.id);

                    return (
                      <tr
                        key={t.id}
                        className={`tf-tasks-row ${isCompleted ? "row-completed" : ""} ${isSelected ? "row-selected" : ""}`}
                      >
                        {/* 1. Circular Completion Toggle Checkbox */}
                        <td className="tf-td-num">
                          <span className="tf-row-num-badge">{rowNum}</span>
                        </td>
                        <td className="tf-td-checkbox">
                          <button
                            type="button"
                            className={`tf-circle-check-btn ${isCompleted ? "checked" : ""}`}
                            onClick={() => handleToggleComplete(t)}
                            title={isCompleted ? "Mark incomplete" : "Mark completed"}
                          >
                            {isCompleted && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                          </button>
                        </td>

                        {/* 2. Task Name & Subtitle */}
                        <td className="tf-td-title">
                          <div
                            className="tf-task-title-group"
                            onClick={() => handleOpenEditTask(t)}
                          >
                            <span className="tf-task-main-title">{t.title}</span>
                            <span className="tf-task-sub-desc">{t.description}</span>
                          </div>
                        </td>

                        {/* 3. Project Pill with Icon */}
                        <td className="tf-td-project">
                          <div className="tf-task-project-pill">
                            <span className={`tf-project-icon-box ${t.projectBg || "purple"}`}>
                              {renderProjectIcon(t.projectIcon)}
                            </span>
                            <span className="tf-project-name">{t.project}</span>
                          </div>
                        </td>

                        {/* 4. Due Date */}
                        <td className="tf-td-due">
                          <span
                            className={`tf-due-date-text ${
                              t.isDueToday || t.dueDate === "Today"
                                ? "due-today"
                                : t.isDueTomorrow || t.dueDate === "Tomorrow"
                                ? "due-tomorrow"
                                : ""
                            }`}
                          >
                            {t.dueDate}
                          </span>
                        </td>

                        {/* 5. Priority Pill */}
                        <td className="tf-td-priority">
                          <span className={`tf-priority-pill ${prioritySlug}`}>
                            <span className="dot" />
                            <span>{t.priority}</span>
                          </span>
                        </td>

                        {/* 6. Status Dropdown Pill */}
                        <td className="tf-td-status">
                          <div className="tf-task-status-dropdown-wrap">
                            <button
                              type="button"
                              className={`tf-status-pill-btn ${statusSlug}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setStatusDropdownTaskId(
                                  statusDropdownTaskId === t.id ? null : t.id
                                );
                              }}
                            >
                              <span>{t.status}</span>
                              <ChevronDown size={13} />
                            </button>

                            {statusDropdownTaskId === t.id && (
                              <div className="tf-status-dropdown-menu">
                                {["To Do", "In Progress", "Completed"].map((st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    className={`tf-status-opt ${st.toLowerCase().replace(" ", "-")} ${t.status === st ? "active" : ""}`}
                                    onClick={() => handleChangeStatus(t.id, st)}
                                  >
                                    <span>{st}</span>
                                    {t.status === st && <Check size={13} />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 7. Action Icons */}
                        <td className="tf-td-actions">
                          <div className="tf-task-actions-row">
                            {/* Eye: View details */}
                            <button
                              type="button"
                              className="tf-task-action-icon-btn"
                              onClick={() => handleOpenEditTask(t)}
                              title="View details"
                            >
                              <Eye size={15} />
                            </button>

                            {/* Message: Comments with badge */}
                            <button
                              type="button"
                              className="tf-task-action-icon-btn with-badge"
                              onClick={() => setCommentsModalTask(t)}
                              title="Comments"
                            >
                              <MessageSquare size={15} />
                              {t.commentsCount > 0 && (
                                <span className="tf-badge-num">{t.commentsCount}</span>
                              )}
                            </button>

                            {/* Paperclip: Attachments */}
                            <button
                              type="button"
                              className="tf-task-action-icon-btn"
                              onClick={() => setAttachmentsModalTask(t)}
                              title="Attachments"
                            >
                              <Paperclip size={15} />
                            </button>

                            {/* Three dots: More actions menu */}
                            <div className="tf-task-action-menu-wrap">
                              <button
                                type="button"
                                className="tf-task-action-icon-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActionMenuTaskId(
                                    actionMenuTaskId === t.id ? null : t.id
                                  );
                                }}
                                title="More actions"
                              >
                                <MoreVertical size={15} />
                              </button>

                              {actionMenuTaskId === t.id && (
                                <div className="tf-row-action-popover">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleOpenEditTask(t);
                                      setActionMenuTaskId(null);
                                    }}
                                  >
                                    <Edit3 size={13} />
                                    <span>Edit Task</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDuplicateTask(t)}
                                  >
                                    <Copy size={13} />
                                    <span>Duplicate</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleComplete(t)}
                                  >
                                    <CheckCircle2 size={13} />
                                    <span>
                                      {t.status === "Completed"
                                        ? "Mark In Progress"
                                        : "Mark Completed"}
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    className="danger"
                                    onClick={() => handleDeleteTask(t.id)}
                                  >
                                    <Trash2 size={13} />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty state if search finds nothing */}
            {filteredTasks.length === 0 && (
              <div className="tf-tasks-empty-state">
                <CheckSquare size={40} color="#94A3B8" />
                <h3>No tasks match your criteria</h3>
                <p>Try switching filter tabs or clearing your search query.</p>
                <button
                  type="button"
                  className="tf-tasks-reset-btn"
                  onClick={() => {
                    setActiveTab("All");
                    setPriorityFilter("All");
                    setProjectFilter("All");
                    setSearchQuery("");
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Footer */}
            <footer className="tf-tasks-pagination-footer">
              <span className="tf-pagination-info">
                Showing {filteredTasks.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{" "}
                {Math.min(currentPage * rowsPerPage, filteredTasks.length)} of {filteredTasks.length} tasks
              </span>

              <div className="tf-pagination-controls">
                {/* Previous Button */}
                <button
                  type="button"
                  className="tf-page-nav-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page Number 1 */}
                <button
                  type="button"
                  className={`tf-page-btn ${currentPage === 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </button>

                {/* Page Number 2 (if exists) */}
                {totalPages >= 2 && (
                  <button
                    type="button"
                    className={`tf-page-btn ${currentPage === 2 ? "active" : ""}`}
                    onClick={() => setCurrentPage(2)}
                  >
                    2
                  </button>
                )}

                {/* Next Button */}
                <button
                  type="button"
                  className="tf-page-nav-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>

                {/* Rows per page dropdown */}
                <div className="tf-rows-per-page-wrap" ref={rowsRef}>
                  <button
                    type="button"
                    className="tf-rows-per-page-btn"
                    onClick={() => setRowsDropdownOpen(!rowsDropdownOpen)}
                  >
                    <span>{rowsPerPage} per page</span>
                    <ChevronDown size={14} className={rowsDropdownOpen ? "open" : ""} />
                  </button>

                  {rowsDropdownOpen && (
                    <div className="tf-rows-dropdown-menu">
                      {[10, 20, 50].map((num) => (
                        <button
                          key={num}
                          type="button"
                          className={rowsPerPage === num ? "active" : ""}
                          onClick={() => {
                            setRowsPerPage(num);
                            setCurrentPage(1);
                            setRowsDropdownOpen(false);
                          }}
                        >
                          {num} per page
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </footer>
          </div>

          {/* ------------------------------------------------------------------
              RIGHT COLUMN: 3 Stacked Cards (Progress, Deadlines, AI Suggestions)
              ------------------------------------------------------------------ */}
          <div className="tf-tasks-right-sidebar">
            {/* Widget 1: Task Progress */}
            <article className="tf-widget-card tf-task-progress-card">
              <div className="tf-widget-header">
                <h2>Task Progress</h2>
                <button
                  type="button"
                  className="tf-widget-more-btn"
                  onClick={() => showToast("Exporting progress breakdown...")}
                  aria-label="Progress options"
                >
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="tf-widget-body tf-progress-body">
                {/* SVG Donut Chart */}
                <div className="tf-donut-container">
                  <svg className="tf-donut-svg" viewBox="0 0 100 100" width="130" height="130">
                    {/* Track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#F1F5F9"
                      strokeWidth="11"
                    />

                    {/* Completed (Green) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#10B981"
                      strokeWidth="11"
                      strokeDasharray={`${completedStroke} ${c}`}
                      strokeDashoffset={completedOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />

                    {/* In Progress (Blue) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#3B82F6"
                      strokeWidth="11"
                      strokeDasharray={`${inProgressStroke} ${c}`}
                      strokeDashoffset={inProgressOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />

                    {/* To Do (Slate / Gray) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#CBD5E1"
                      strokeWidth="11"
                      strokeDasharray={`${toDoStroke} ${c}`}
                      strokeDashoffset={toDoOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>

                  {/* Centered Percentage */}
                  <div className="tf-donut-center-label">
                    <span className="tf-donut-main-number">{completedPct}%</span>
                    <span className="tf-donut-sub-text">Completed</span>
                  </div>
                </div>

                {/* Legend on right */}
                <div className="tf-progress-legend">
                  <div
                    className="tf-legend-row"
                    onClick={() => setActiveTab("Completed")}
                  >
                    <span className="tf-legend-dot green" />
                    <span className="tf-legend-label">
                      <strong>{stats.completed}</strong> Completed
                    </span>
                  </div>

                  <div
                    className="tf-legend-row"
                    onClick={() => setActiveTab("In Progress")}
                  >
                    <span className="tf-legend-dot blue" />
                    <span className="tf-legend-label">
                      <strong>{stats.inProgress}</strong> In Progress
                    </span>
                  </div>

                  <div
                    className="tf-legend-row"
                    onClick={() => setActiveTab("To Do")}
                  >
                    <span className="tf-legend-dot slate" />
                    <span className="tf-legend-label">
                      <strong>{stats.toDo}</strong> To Do
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Widget 2: Upcoming Deadlines */}
            <article className="tf-widget-card tf-upcoming-deadlines-card">
              <div className="tf-widget-header">
                <div className="tf-widget-title-with-icon">
                  <div className="tf-widget-icon-circle blue">
                    <Calendar size={14} color="#2563EB" />
                  </div>
                  <h2>Upcoming Deadlines</h2>
                </div>

                <Link to="/employee/calendar" className="tf-widget-view-all">
                  View all <ChevronRight size={14} />
                </Link>
              </div>

              <div className="tf-deadlines-list">
                {upcomingDeadlinesList.map((d) => (
                  <div
                    key={d.id}
                    className="tf-deadline-item"
                    onClick={() => {
                      const match = tasks.find((t) => t.title === d.title);
                      if (match) setDetailsModalTask(match);
                      else showToast(`Deadline: ${d.title} (${d.dueDate})`);
                    }}
                  >
                    <div className={`tf-deadline-icon-box ${d.color}`}>
                      <Calendar size={15} />
                    </div>

                    <div className="tf-deadline-content">
                      <strong className="tf-deadline-title">{d.title}</strong>
                      <span className={`tf-deadline-date ${d.isToday ? "today" : ""}`}>
                        {d.dueDate}
                      </span>
                    </div>

                    <span className={`tf-priority-tag ${d.priority.toLowerCase()}`}>
                      {d.priority}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            {/* Widget 3: AI Task Suggestions */}
            <article className="tf-widget-card tf-ai-suggestions-card">
              <div className="tf-widget-header">
                <div className="tf-widget-title-with-icon">
                  <div className="tf-widget-icon-circle purple">
                    <Sparkles size={14} color="#7C3AED" />
                  </div>
                  <h2>AI Task Suggestions</h2>
                </div>

                <Link to="/employee/ai-assistant" className="tf-widget-view-all">
                  View all <ChevronRight size={14} />
                </Link>
              </div>

              <div className="tf-ai-suggestions-list">
                {defaultAiSuggestions.map((sug) => {
                  const isApplied = appliedSuggestions.has(sug.id);

                  return (
                    <div key={sug.id} className="tf-ai-suggestion-item">
                      <div className="tf-ai-sug-left">
                        <div className="tf-ai-sug-icon-box">
                          <Zap size={14} color="#7C3AED" />
                        </div>

                        <div className="tf-ai-sug-texts">
                          <strong>{sug.title}</strong>
                          <span>{sug.description}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`tf-ai-apply-btn ${isApplied ? "applied" : ""}`}
                        onClick={() => handleApplySuggestion(sug)}
                        disabled={isApplied}
                      >
                        {isApplied ? "Applied ✓" : "Apply"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </div>

        {/* ====================================================================
            5. MODALS
            ==================================================================== */}

        {/* Modal 1: + Add Personal Task */}
        {createModalOpen && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setCreateModalOpen(false);
            }}
          >
            <div className="tf-modal-card tf-task-edit-modal" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-group">
                  <div className="tf-modal-icon-box blue">
                    <Plus size={18} color="#2563EB" />
                  </div>
                  <div>
                    <h3>Add Personal Task</h3>
                    <p>Create a task for your workspace and set deadlines.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setCreateModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateTask}>
                <div className="tf-modal-form-body">
                  <div className="tf-form-field">
                    <label>Task Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Design user profile settings"
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    />
                  </div>

                  <div className="tf-form-field">
                    <label>Description</label>
                    <textarea
                      rows={3}
                      placeholder="Add brief details about the task requirements..."
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    />
                  </div>

                  <div className="tf-form-row">
                    <div className="tf-form-field">
                      <label>Project</label>
                      <select
                        value={taskForm.project}
                        onChange={(e) => setTaskForm({ ...taskForm, project: e.target.value })}
                      >
                        <option value="TeamFlow Website">TeamFlow Website</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="AI Integration">AI Integration</option>
                        <option value="Marketing Portal">Marketing Portal</option>
                      </select>
                    </div>

                    <div className="tf-form-field">
                      <label>Priority</label>
                      <select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="tf-form-row">
                    <div className="tf-form-field">
                      <label>Due Date</label>
                      <input
                        type="date"
                        value={taskForm.dueDate}
                        onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      />
                    </div>

                    <div className="tf-form-field">
                      <label>Initial Status</label>
                      <select
                        value={taskForm.status}
                        onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="tf-modal-actions">
                  <button
                    type="button"
                    className="tf-btn-secondary"
                    onClick={() => setCreateModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="tf-btn-primary">
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: Edit Task Modal (Matches reference design) */}
        {detailsModalTask && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDetailsModalTask(null);
            }}
          >
            <div className="tf-modal-card tf-edit-ticket-modal" role="dialog" aria-modal="true">
              <div className="tf-modal-header-simple">
                <h3>Edit Task</h3>
                <button
                  type="button"
                  className="tf-modal-close-simple"
                  onClick={() => setDetailsModalTask(null)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdateTask}>
                <div className="tf-modal-body-simple">
                  {/* Task Title */}
                  <div className="tf-simple-form-field">
                    <label>
                      Task Title <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Design login page UI"
                      value={editTaskForm.title}
                      onChange={(e) =>
                        setEditTaskForm({ ...editTaskForm, title: e.target.value })
                      }
                    />
                  </div>

                  {/* Project & Assignee Row */}
                  <div className="tf-simple-form-row">
                    <div className="tf-simple-form-field">
                      <label>Project</label>
                      <input
                        type="text"
                        placeholder="Backend API"
                        value={editTaskForm.project}
                        onChange={(e) =>
                          setEditTaskForm({ ...editTaskForm, project: e.target.value })
                        }
                      />
                    </div>
                    <div className="tf-simple-form-field">
                      <label>Assignee</label>
                      <input
                        type="text"
                        placeholder="Rahul Sharma"
                        value={editTaskForm.assignee}
                        onChange={(e) =>
                          setEditTaskForm({ ...editTaskForm, assignee: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Priority Level & Status Row */}
                  <div className="tf-simple-form-row">
                    <div className="tf-simple-form-field">
                      <label>Priority Level</label>
                      <select
                        value={editTaskForm.priority}
                        onChange={(e) =>
                          setEditTaskForm({ ...editTaskForm, priority: e.target.value })
                        }
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                    <div className="tf-simple-form-field">
                      <label>Status</label>
                      <select
                        value={editTaskForm.status}
                        onChange={(e) =>
                          setEditTaskForm({ ...editTaskForm, status: e.target.value })
                        }
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* Steps to Reproduce / Description */}
                  <div className="tf-simple-form-field">
                    <label>Steps to Reproduce / Description</label>
                    <textarea
                      rows={4}
                      placeholder="Add task details or steps to reproduce..."
                      value={editTaskForm.description}
                      onChange={(e) =>
                        setEditTaskForm({ ...editTaskForm, description: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="tf-modal-footer-simple">
                  <button
                    type="button"
                    className="tf-simple-btn-cancel"
                    onClick={() => setDetailsModalTask(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="tf-simple-btn-update">
                    Update Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 3: Task Comments */}
        {commentsModalTask && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setCommentsModalTask(null);
            }}
          >
            <div className="tf-modal-card tf-task-comments-modal" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-group">
                  <div className="tf-modal-icon-box blue">
                    <MessageSquare size={18} color="#2563EB" />
                  </div>
                  <div>
                    <h3>Comments</h3>
                    <p>{commentsModalTask.title}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setCommentsModalTask(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="tf-comments-body">
                <div className="tf-comments-list">
                  {(commentsModalTask.comments || []).length === 0 ? (
                    <div className="tf-comments-empty">
                      <MessageSquare size={30} color="#94A3B8" />
                      <p>No comments yet. Start the conversation!</p>
                    </div>
                  ) : (
                    (commentsModalTask.comments || []).map((c) => (
                      <div key={c.id} className="tf-comment-bubble">
                        <div className="tf-comment-top">
                          <strong>{c.author}</strong>
                          <span>{c.time}</span>
                        </div>
                        <p>{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="tf-comment-input-area">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddComment();
                    }}
                  />
                  <button
                    type="button"
                    className="tf-comment-send-btn"
                    onClick={handleAddComment}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal 4: Attachments */}
        {attachmentsModalTask && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setAttachmentsModalTask(null);
            }}
          >
            <div className="tf-modal-card tf-task-attachments-modal" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-group">
                  <div className="tf-modal-icon-box purple">
                    <Paperclip size={18} color="#7C3AED" />
                  </div>
                  <div>
                    <h3>Task Attachments</h3>
                    <p>{attachmentsModalTask.title}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setAttachmentsModalTask(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="tf-attachments-body">
                {(attachmentsModalTask.attachments || []).length === 0 ? (
                  <div className="tf-attachments-empty">
                    <FileText size={32} color="#94A3B8" />
                    <p>No attachments yet for this task.</p>
                  </div>
                ) : (
                  <div className="tf-attachments-list">
                    {(attachmentsModalTask.attachments || []).map((att, i) => (
                      <div key={i} className="tf-attachment-row">
                        <div className="tf-att-icon-box">
                          <FileText size={16} color="#4F46E5" />
                        </div>
                        <div className="tf-att-info">
                          <strong>{att.name}</strong>
                          <span>{att.size}</span>
                        </div>
                        <button
                          type="button"
                          className="tf-att-download-btn"
                          onClick={() => showToast(`Downloading ${att.name}...`)}
                          title="Download"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="tf-upload-mock-btn"
                  onClick={() => showToast("Attachment upload dialog opened.")}
                >
                  <Plus size={15} />
                  <span>Upload File</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeShell>
  );
}

export default Tasks;
