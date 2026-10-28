import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sparkles,
  Bot,
  MessageSquare,
  Lightbulb,
  FileText,
  Clock,
  AlertCircle,
  Calendar,
  Bug,
  Folder,
  ArrowRight,
  ArrowUpRight,
  CheckSquare,
  Check,
  Send,
  Paperclip,
  Mic,
  X,
  BarChart2,
  Video,
  Target,
  Laptop,
  Plus,
  Zap,
  CheckCircle2,
  Copy,
  CheckCheck,
  ExternalLink,
  RotateCcw,
  BookOpen,
} from "lucide-react";

import EmployeeShell from "./EmployeeShell";
import { getEmployeeProfile } from "./EmployeeAuth";
import "./AI.css";

/* Storage Key */
const STORAGE_KEY = "tf_ai_assistant_v4";

/* Default fallback avatar */
const fallbackAvatar =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop";

/* Default Initial Conversation */
const defaultChatMessages = [
  {
    id: "msg-1",
    sender: "ai",
    time: "10:24 AM",
    type: "greeting",
    text: "Hello! 👋\nI am your TeamFlow AI Assistant. I can help you summarize your work, prioritize tasks, track bugs, review meeting notes, and automate project updates. What would you like to explore today?",
  },
  {
    id: "msg-2",
    sender: "user",
    time: "10:25 AM",
    text: "Give me a summary of my tasks for this week.",
  },
  {
    id: "msg-3",
    sender: "ai",
    time: "10:25 AM",
    type: "task_summary",
    title: "Here is a summary of your tasks for this week (Oct 20 – Oct 26, 2024):",
    kpis: {
      total: 12,
      completed: 8,
      inProgress: 3,
      overdue: 1,
    },
    tasks: [
      {
        id: "t1",
        title: "Design login page UI",
        due: "Today",
        dueClass: "due-today",
        priority: "High",
        status: "In Progress",
        dotColor: "blue",
      },
      {
        id: "t2",
        title: "API integration testing",
        due: "Tomorrow",
        dueClass: "due-soon",
        priority: "Medium",
        status: "To Do",
        dotColor: "yellow",
      },
      {
        id: "t3",
        title: "Update project documentation",
        due: "Oct 26",
        dueClass: "due-normal",
        priority: "Low",
        status: "To Do",
        dotColor: "gray",
      },
      {
        id: "t4",
        title: "Fix responsive issues",
        due: "Oct 28",
        dueClass: "due-normal",
        priority: "High",
        status: "In Progress",
        dotColor: "gray",
      },
      {
        id: "t5",
        title: "Prepare demo for client",
        due: "Oct 30",
        dueClass: "due-normal",
        priority: "Medium",
        status: "To Do",
        dotColor: "gray",
      },
    ],
  },
];

/* Task Suggestions for Right Panel */
const defaultTaskSuggestions = [
  {
    id: "ts-1",
    title: "Complete API integration testing",
    subtitle: "Due tomorrow • High priority",
    icon: "target",
    color: "red",
    project: "TeamFlow Mobile App",
    priority: "High",
    priorityColor: "#EF4444",
    dueDate: "Tomorrow (Oct 27, 2024)",
    estimatedTime: "3.5 hrs",
    category: "Backend & QA",
    aiReason:
      "High correlation with open bug reports #104 and #108. Completing this unblocks the upcoming staging release.",
    description:
      "Perform end-to-end integration testing for authentication, team invite webhooks, and task synchronization endpoints across both staging and pre-production environments.",
    subtasks: [
      "Validate JWT token renewal on 401 response",
      "Verify mock payload responses for employee dashboard KPIs",
      "Run automated Postman / Newman test suite against staging cluster",
      "Log error handling cases for rate limiting & network timeouts",
    ],
    impact:
      "Unblocks 3 team members and ensures zero regression for Sprint 4 release.",
  },
  {
    id: "ts-2",
    title: "Update project documentation",
    subtitle: "Due Oct 26 • Part of Mobile App",
    icon: "doc",
    color: "purple",
    project: "Mobile App Architecture",
    priority: "Medium",
    priorityColor: "#8B5CF6",
    dueDate: "Oct 26, 2024",
    estimatedTime: "2.0 hrs",
    category: "Documentation",
    aiReason:
      "Documentation hasn't been updated since the v2.4 redesign. Several endpoints differ from actual responses.",
    description:
      "Update the project README, architectural diagrams, API route references, and environment configuration guides to reflect recent microservice changes.",
    subtasks: [
      "Document OAuth2 flow & token storage specifications",
      "Refresh component hierarchy chart in Figma / Wiki",
      "Update .env.example with newly added service keys",
    ],
    impact:
      "Reduces onboarding ramp-up time for new engineers from 3 days to 1 day.",
  },
  {
    id: "ts-3",
    title: "Fix UI responsiveness issues",
    subtitle: "Improve mobile view layout",
    icon: "laptop",
    color: "blue",
    project: "TeamFlow Web App",
    priority: "High",
    priorityColor: "#EF4444",
    dueDate: "Oct 28, 2024",
    estimatedTime: "4.0 hrs",
    category: "Frontend UI/UX",
    aiReason:
      "Mobile viewport (< 768px) shows clipping on navigation bar and KPI cards reported by QA team.",
    description:
      "Audit and resolve responsive layout breaks across employee activity, task boards, and chat drawer on mobile screen widths (360px - 768px).",
    subtasks: [
      "Fix header hamburger drawer transition and overlay click",
      "Convert multi-column KPI grids to responsive auto-fit cards",
      "Ensure bottom action sheets don't overflow small viewport heights",
    ],
    impact:
      "Delivers a seamless mobile experience for 45% of active users accessing via mobile.",
  },
  {
    id: "ts-4",
    title: "Prepare client demo presentation",
    subtitle: "Due Oct 30 • TeamFlow Website",
    icon: "chart",
    color: "orange",
    project: "Client Deliverables",
    priority: "Medium",
    priorityColor: "#2563EB",
    dueDate: "Oct 30, 2024",
    estimatedTime: "2.5 hrs",
    category: "Presentations & Strategy",
    aiReason:
      "Client milestone review scheduled for Friday. Slide deck requires updated sprint performance metrics.",
    description:
      "Synthesize sprint metrics, feature walkthrough demos, and AI workflow automation capabilities into a cohesive 12-slide stakeholder presentation.",
    subtasks: [
      "Export high-res UI screenshots and screen recordings of completed features",
      "Include KPI completion percentages (85% website, 62% mobile)",
      "Draft live demo speaking notes and risk mitigation section",
    ],
    impact:
      "Secures sign-off on Milestone 3 and unlocks Phase 2 enterprise contract budget.",
  },
];

/* Meeting Summaries for Right Panel */
const meetingSummariesData = [
  {
    id: "ms-1",
    title: "Daily Standup",
    time: "Oct 22, 2024 • 9:00 – 9:30 AM",
    icon: "video",
    iconColor: "blue",
    summary:
      "Team reviewed the login page mockups and frontend API endpoints. Blockers on mobile responsive layout were assigned to Priya. Target deploy to staging is scheduled for Oct 24.",
    keyTakeaways: [
      "Login page frontend completed at 85%",
      "Staging release ready by Thursday",
      "Rahul reviewing database migration script",
    ],
  },
  {
    id: "ms-2",
    title: "UI Design Discussion",
    time: "Oct 21, 2024 • 10:00 – 11:00 AM",
    icon: "video",
    iconColor: "purple",
    summary:
      "Walkthrough of the Figma mobile navigation tokens and dark mode color palette. Agreed to use modern indigo/purple branding across employee dashboards.",
    keyTakeaways: [
      "Dark mode contrast ratio approved (WCAG AAA)",
      "Icon sets synchronized with Lucide React",
      "Drawer animations reduced to 150ms for snappy response",
    ],
  },
  {
    id: "ms-3",
    title: "Sprint Review",
    time: "Oct 20, 2024 • 2:00 – 3:00 PM",
    icon: "video",
    iconColor: "orange",
    summary:
      "Sprint 4 velocity reached 92%. Successfully delivered 14 user stories, closed 6 major bugs, and updated CI/CD pipeline automation.",
    keyTakeaways: [
      "Velocity improved by 18% over Sprint 3",
      "Bug resolution time down to 1.4 days average",
      "Next sprint starts with Client Demo milestone",
    ],
  },
];

/* Helper to generate unique IDs */
function generateUniqueId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

/* Helper to render formatted text with bold & bullet points */
function renderFormattedMessage(text) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    // Replace **bold**
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const renderedParts = parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    if (line.startsWith("- ") || line.startsWith("• ")) {
      return (
        <li key={idx} className="tf-ai-bullet-item">
          <span className="tf-ai-bullet-dot" />
          <span className="tf-ai-bullet-text">{renderedParts}</span>
        </li>
      );
    }
    if (/^\d+\.\s/.test(line)) {
      return (
        <li key={idx} className="tf-ai-num-item">
          <span className="tf-ai-num-text">{renderedParts}</span>
        </li>
      );
    }
    if (!line.trim()) {
      return <div key={idx} className="tf-ai-msg-gap" />;
    }
    return (
      <p key={idx} className="tf-ai-msg-paragraph">
        {renderedParts}
      </p>
    );
  });
}

function AI() {
  const location = useLocation();

  // Selected KPI card for visual highlight
  const [selectedKpi, setSelectedKpi] = useState(null);

  // Task Suggestion Modal State
  const [activeTaskSuggestionModal, setActiveTaskSuggestionModal] = useState(null);

  // Meeting Summary Modal State
  const [activeSummaryModal, setActiveSummaryModal] = useState(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState("");

  // Copied message state
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  // Input message state
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);

  // Chat messages
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 1) return parsed;
      }
    } catch (err) {
      console.warn("Could not read saved AI messages:", err);
    }
    return defaultChatMessages;
  });

  // Task suggestions state
  const [taskSuggestions] = useState(defaultTaskSuggestions);

  const messagesEndRef = useRef(null);
  const chatAreaRef = useRef(null);

  // Sync profile info in real-time
  const [profile, setProfile] = useState(getEmployeeProfile);

  useEffect(() => {
    const handleSync = () => setProfile(getEmployeeProfile());
    window.addEventListener("storage", handleSync);
    window.addEventListener("tf_profile_updated", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("tf_profile_updated", handleSync);
    };
  }, []);

  const userPhoto = profile.photo || fallbackAvatar;
  const userName = profile.fullName || "John Doe";

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Persist messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.warn("Could not save AI messages:", err);
    }
  }, [messages]);

  // Handle URL queries (e.g. from Dashboard ?query=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query");
    if (query && query.trim()) {
      const timer = setTimeout(() => {
        handleSendPrompt(query.trim());
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  // Send Prompt Handler
  const handleSendPrompt = (promptText) => {
    const textToSend = promptText || inputText;
    if (!textToSend.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Add user message
    const userMsg = {
      id: generateUniqueId("usr"),
      sender: "user",
      time: currentTime,
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // 2. Generate intelligent response after realistic thinking delay
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let aiMsg = null;

      if (
        lower.includes("task") ||
        lower.includes("summary") ||
        lower.includes("week") ||
        lower.includes("workload")
      ) {
        aiMsg = {
          id: generateUniqueId("ai"),
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "task_summary",
          title: "Here is a summary of your tasks for this week (Oct 20 – Oct 26, 2024):",
          kpis: {
            total: 12,
            completed: 8,
            inProgress: 3,
            overdue: 1,
          },
          tasks: [
            {
              id: "t1",
              title: "Design login page UI",
              due: "Today",
              dueClass: "due-today",
              priority: "High",
              status: "In Progress",
              dotColor: "blue",
            },
            {
              id: "t2",
              title: "API integration testing",
              due: "Tomorrow",
              dueClass: "due-soon",
              priority: "Medium",
              status: "To Do",
              dotColor: "yellow",
            },
            {
              id: "t3",
              title: "Update project documentation",
              due: "Oct 26",
              dueClass: "due-normal",
              priority: "Low",
              status: "To Do",
              dotColor: "gray",
            },
            {
              id: "t4",
              title: "Fix responsive issues",
              due: "Oct 28",
              dueClass: "due-normal",
              priority: "High",
              status: "In Progress",
              dotColor: "gray",
            },
            {
              id: "t5",
              title: "Prepare demo for client",
              due: "Oct 30",
              dueClass: "due-normal",
              priority: "Medium",
              status: "To Do",
              dotColor: "gray",
            },
          ],
        };
      } else if (lower.includes("meeting") || lower.includes("standup") || lower.includes("sync")) {
        aiMsg = {
          id: generateUniqueId("ai"),
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "generic",
          text: `**Meeting Summary: Daily Standup (Oct 22)**\n- **Project:** TeamFlow Website\n- **Key Updates:** API endpoints verified by Rahul, Login Page UI reviewed and approved for staging.\n- **Action Item:** Complete responsive mobile layout adjustments before 4:00 PM sprint sync.\n- **Upcoming:** UI Design Discussion tomorrow at 10:00 AM.`,
        };
      } else if (lower.includes("bug") || lower.includes("issue")) {
        aiMsg = {
          id: generateUniqueId("ai"),
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "generic",
          text: `**Assigned Bugs Overview (3 Total):**\n1. **#BUG-1023:** Login button not working • *High Priority* (In Progress)\n2. **#BUG-1045:** API returns 500 error • *Medium Priority* (Open)\n3. **#BUG-1078:** UI misalignment on mobile • *Low Priority* (Resolved)\n\n**Recommendation:** Prioritize **#BUG-1023** to avoid blocking the staging deployment tonight.`,
        };
      } else if (lower.includes("project") || lower.includes("progress")) {
        aiMsg = {
          id: generateUniqueId("ai"),
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "generic",
          text: `**Current Project Progress Status:**\n- **TeamFlow Website:** **85%** Completed (UI/UX finalized, QA in progress)\n- **Mobile App:** **62%** Completed (API integration and token auth active)\n- **AI Integration:** **40%** Completed (Model endpoints and prompt schemas tested)\n- **Marketing Portal:** **100%** Completed (Delivered to marketing team)`,
        };
      } else if (lower.includes("deadline")) {
        aiMsg = {
          id: generateUniqueId("ai"),
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "generic",
          text: `**Upcoming Deadlines Timeline:**\n- **Today:** Design login page UI (High Priority • In Progress)\n- **Tomorrow:** API integration testing (Medium Priority)\n- **Oct 26:** Update project documentation (Low Priority)\n- **Oct 28:** Fix responsive issues (High Priority)\n- **Oct 30:** Client demo presentation (Milestone Review)`,
        };
      } else if (lower.includes("suggest") || lower.includes("next")) {
        aiMsg = {
          id: generateUniqueId("ai"),
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "generic",
          text: `**Smart Recommendations For Today:**\n1. **Complete API Integration Testing:** Blocks backend engineers from finalizing authentication tokens.\n2. **Close Bug #BUG-1023:** Resolves the critical staging login blocker.\n3. **Review Responsive Breakpoints:** Improves mobile navigation experience for QA audit.\n\nWould you like me to add any of these tasks directly to your task board?`,
        };
      } else if (lower.includes("file") || lower.includes("document")) {
        aiMsg = {
          id: generateUniqueId("ai"),
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "generic",
          text: `**Relevant Files in Your Workspace:**\n- **Login_Page_Design.fig** (Figma • 4.2 MB • Updated today)\n- **API_Documentation.docx** (Word • 856 KB • Updated yesterday)\n- **Sprint_Review.pptx** (Presentation • 3.1 MB • Updated Oct 20)\n\nAll files are available in your **Files** folder.`,
        };
      } else {
        aiMsg = {
          id: generateUniqueId("ai"),
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "generic",
          text: `I've analyzed your workspace regarding **"${textToSend}"**.\n\nYou currently have **12 assigned tasks** (8 completed, 3 in progress, 1 overdue), **3 active bugs**, and **3 upcoming meetings**. Your overall task completion rate is **75%**.\n\nHow else can I assist with your workflow?`,
        };
      }

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    handleSendPrompt(inputText);
  };

  // Clear Chat function
  const handleClearChat = () => {
    const resetMsg = [defaultChatMessages[0]];
    setMessages(resetMsg);
    showToast("Chat history reset to new session.");
  };

  // Copy message text
  const handleCopyMessage = (msgId, text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedMessageId(msgId);
    showToast("Copied to clipboard!");
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Add suggested task to localStorage
  const handleAddSuggestedTask = (suggestion) => {
    try {
      const existing = JSON.parse(localStorage.getItem("tf_tasks") || "[]");
      const newTask = {
        id: generateUniqueId("tsk"),
        title: suggestion.title,
        project: suggestion.project || "TeamFlow Website",
        status: "todo",
        priority: suggestion.priority || "High",
        due: suggestion.dueDate || "Tomorrow",
        overdue: false,
      };
      localStorage.setItem("tf_tasks", JSON.stringify([newTask, ...existing]));
      window.dispatchEvent(new CustomEvent("tf_tasks_updated", { detail: newTask }));
      showToast(`Task "${suggestion.title}" added to My Tasks!`);
    } catch (err) {
      console.warn("Could not add suggested task:", err);
    }
  };

  // Voice input toggle simulation
  const handleToggleMic = () => {
    if (!isMicActive) {
      setIsMicActive(true);
      showToast("Listening... Speak your prompt now.");
      setTimeout(() => {
        setIsMicActive(false);
        setInputText("Summarize my tasks for this week");
      }, 2500);
    } else {
      setIsMicActive(false);
      showToast("Voice input stopped.");
    }
  };

  return (
    <EmployeeShell
      activeRoute="/employee/ai-assistant"
      searchPlaceholder="Search tasks, projects, files, meetings, or ask AI..."
    >
      <div className="tf-ai-page">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="tf-ai-toast" role="status">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ====================================================================
            1. PAGE HEADER (Title + Subtitle + Mode Navigation Tabs + Actions)
            ==================================================================== */}
        <header className="tf-ai-header">
          <div className="tf-ai-title-group">
            <div className="tf-ai-title-row">
              <h1>AI Assistant</h1>
              <span className="tf-ai-badge">
                <Sparkles size={13} />
                <span>TeamFlow AI</span>
              </span>
            </div>
            <p>
              Your intelligent work companion for tasks, projects, meetings, bug tracking, and productivity.
            </p>
          </div>

        </header>

        {/* ====================================================================
            2. TOP 4 METRIC KPI STAT CARDS (Matches Tasks, Projects, Dashboard)
            ==================================================================== */}
        <section className="tf-ai-stats-grid">
          {/* Card 1: My Tasks */}
          <div
            className={`tf-ai-stat-card ${selectedKpi === "tasks" ? "selected" : ""}`}
            onClick={() => {
              setSelectedKpi("tasks");
              handleSendPrompt("Give me a summary of my tasks for this week.");
            }}
          >
            <div className="tf-ai-stat-icon purple">
              <CheckSquare size={20} color="#7C3AED" strokeWidth={2.2} />
            </div>
            <div className="tf-ai-stat-body">
              <span className="tf-ai-stat-label">My Tasks</span>
              <div className="tf-ai-stat-val-row">
                <strong className="tf-ai-stat-value">12</strong>
                <span className="tf-ai-stat-badge positive">↑ 25%</span>
              </div>
              <span className="tf-ai-stat-sub">8 completed • 3 in progress • 1 overdue</span>
            </div>
          </div>

          {/* Card 2: My Projects */}
          <div
            className={`tf-ai-stat-card ${selectedKpi === "projects" ? "selected" : ""}`}
            onClick={() => {
              setSelectedKpi("projects");
              handleSendPrompt("Show my project progress.");
            }}
          >
            <div className="tf-ai-stat-icon blue">
              <Folder size={20} color="#2563EB" strokeWidth={2.2} />
            </div>
            <div className="tf-ai-stat-body">
              <span className="tf-ai-stat-label">My Projects</span>
              <div className="tf-ai-stat-val-row">
                <strong className="tf-ai-stat-value">4</strong>
                <span className="tf-ai-stat-badge neutral">Active</span>
              </div>
              <span className="tf-ai-stat-sub">2 active • 1 on hold • 1 completed</span>
            </div>
          </div>

          {/* Card 3: Upcoming Meetings */}
          <div
            className={`tf-ai-stat-card ${selectedKpi === "meetings" ? "selected" : ""}`}
            onClick={() => {
              setSelectedKpi("meetings");
              handleSendPrompt("What are the upcoming meetings this week?");
            }}
          >
            <div className="tf-ai-stat-icon orange">
              <Calendar size={20} color="#F59E0B" strokeWidth={2.2} />
            </div>
            <div className="tf-ai-stat-body">
              <span className="tf-ai-stat-label">Upcoming Meetings</span>
              <div className="tf-ai-stat-val-row">
                <strong className="tf-ai-stat-value">3</strong>
                <span className="tf-ai-stat-badge neutral">This Week</span>
              </div>
              <span className="tf-ai-stat-sub">Daily Standup, Design sync & Sprint</span>
            </div>
          </div>

          {/* Card 4: Assigned Bugs */}
          <div
            className={`tf-ai-stat-card ${selectedKpi === "bugs" ? "selected" : ""}`}
            onClick={() => {
              setSelectedKpi("bugs");
              handleSendPrompt("List my assigned bugs.");
            }}
          >
            <div className="tf-ai-stat-icon red">
              <Bug size={20} color="#EF4444" strokeWidth={2.2} />
            </div>
            <div className="tf-ai-stat-body">
              <span className="tf-ai-stat-label">Assigned Bugs</span>
              <div className="tf-ai-stat-val-row">
                <strong className="tf-ai-stat-value">3</strong>
                <span className="tf-ai-stat-badge negative">Attention</span>
              </div>
              <span className="tf-ai-stat-sub">1 open • 1 in progress • 1 resolved</span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. MAIN TWO-COLUMN WORKSPACE
            Left: Enterprise AI Chat Box
            Right: Task Suggestions + Meeting Summaries
            ==================================================================== */}
        <div className="tf-ai-workspace-grid">
          {/* ------------------------------------------------------------------
              LEFT COLUMN: Main AI Chat Assistant
              ------------------------------------------------------------------ */}
          <div className="tf-ai-left-column" id="tf-chat-section" ref={chatAreaRef}>
            <div className="tf-ai-chat-card">
              {/* Chat Card Header */}
              <div className="tf-ai-chat-card-header">
                <div className="tf-ai-card-title-left">
                  <div className="tf-ai-header-icon-box">
                    <Sparkles size={18} color="#6C4CF6" />
                  </div>
                  <div>
                    <h3>Chat with AI Assistant</h3>
                    <p>Ask anything about your tasks, projects, meetings, files or team progress.</p>
                  </div>
                </div>

                <div className="tf-ai-chat-header-actions">
                  <button
                    type="button"
                    className="tf-ai-chat-clear-btn"
                    onClick={handleClearChat}
                    title="Clear current conversation"
                  >
                    Clear Chat
                  </button>
                </div>
              </div>

              {/* Chat Messages Stream */}
              <div className="tf-ai-messages-scroll-area">
                {messages.map((msg) => {
                  // User Message
                  if (msg.sender === "user") {
                    return (
                      <div key={msg.id} className="tf-ai-msg-row user">
                        <div className="tf-ai-user-bubble-col">
                          <div className="tf-ai-msg-meta right">
                            <span className="tf-ai-msg-time">{msg.time}</span>
                            <span className="tf-ai-msg-sender">You</span>
                          </div>
                          <div className="tf-ai-user-bubble">
                            <p>{msg.text}</p>
                          </div>
                        </div>
                        <img
                          src={userPhoto}
                          alt={userName}
                          className="tf-ai-avatar user"
                        />
                      </div>
                    );
                  }

                  // AI Message
                  return (
                    <div key={msg.id} className="tf-ai-msg-row ai">
                      <div className="tf-ai-avatar ai">
                        <Bot size={18} color="#6C4CF6" />
                      </div>

                      <div className="tf-ai-bubble-col">
                        <div className="tf-ai-msg-meta left">
                          <span className="tf-ai-msg-sender ai">TeamFlow AI</span>
                          <span className="tf-ai-msg-time">{msg.time}</span>
                          {msg.text && (
                            <button
                              type="button"
                              className="tf-ai-copy-btn"
                              onClick={() => handleCopyMessage(msg.id, msg.text)}
                              title="Copy response"
                            >
                              {copiedMessageId === msg.id ? (
                                <CheckCheck size={13} color="#10B981" />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Standard text response */}
                        {msg.text && (
                          <div className="tf-ai-bubble">
                            {renderFormattedMessage(msg.text)}
                          </div>
                        )}

                        {/* Rich Task Summary Table Card */}
                        {msg.type === "task_summary" && (
                          <div className="tf-ai-summary-card">
                            <div className="tf-ai-summary-header">
                              <div className="tf-ai-summary-header-icon">
                                <CheckSquare size={16} />
                              </div>
                              <h4>{msg.title}</h4>
                            </div>

                            {/* 4 Mini KPI boxes */}
                            <div className="tf-ai-summary-kpis-row">
                              <div className="tf-ai-mini-kpi purple">
                                <strong>{msg.kpis.total}</strong>
                                <span>Total Tasks</span>
                              </div>
                              <div className="tf-ai-mini-kpi green">
                                <strong>{msg.kpis.completed}</strong>
                                <span>Completed</span>
                              </div>
                              <div className="tf-ai-mini-kpi orange">
                                <strong>{msg.kpis.inProgress}</strong>
                                <span>In Progress</span>
                              </div>
                              <div className="tf-ai-mini-kpi red">
                                <strong>{msg.kpis.overdue}</strong>
                                <span>Overdue</span>
                              </div>
                            </div>

                            {/* Tasks Table */}
                            <div className="tf-ai-table-container">
                              <table className="tf-ai-table">
                                <thead>
                                  <tr>
                                    <th>Task</th>
                                    <th>Due Date</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {msg.tasks.map((t) => (
                                    <tr key={t.id}>
                                      <td className="col-task-title">
                                        <div className="tf-ai-task-row-name">
                                          <span className={`tf-ai-dot ${t.dotColor}`} />
                                          <span className="tf-ai-task-name-text">{t.title}</span>
                                        </div>
                                      </td>
                                      <td className={`col-due-date ${t.dueClass || ""}`}>
                                        {t.due}
                                      </td>
                                      <td>
                                        <span
                                          className={`tf-ai-badge-priority ${t.priority.toLowerCase()}`}
                                        >
                                          {t.priority}
                                        </span>
                                      </td>
                                      <td>
                                        <span
                                          className={`tf-ai-badge-status ${
                                            t.status === "In Progress" ? "in-progress" : "todo"
                                          }`}
                                        >
                                          {t.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* AI Thinking Indicator */}
                {isTyping && (
                  <div className="tf-ai-msg-row ai">
                    <div className="tf-ai-avatar ai">
                      <Bot size={18} color="#6C4CF6" />
                    </div>
                    <div className="tf-ai-thinking-card">
                      <div className="tf-ai-thinking-dots">
                        <span className="dot" />
                        <span className="dot" />
                        <span className="dot" />
                      </div>
                      <span>TeamFlow AI is analyzing your workspace...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input & Bottom Quick Pills Bar */}
              <div className="tf-ai-chat-footer">
                {/* Quick Suggestion Pills */}
                <div className="tf-ai-quick-pills-row">
                  <button
                    type="button"
                    className="tf-ai-quick-chip"
                    onClick={() => handleSendPrompt("Summarize my tasks for this week")}
                  >
                    <CheckSquare size={13} color="#7C3AED" />
                    <span>Summarize my tasks</span>
                  </button>
                  <button
                    type="button"
                    className="tf-ai-quick-chip"
                    onClick={() => handleSendPrompt("Suggest next tasks for me")}
                  >
                    <Lightbulb size={13} color="#F59E0B" />
                    <span>Suggest next tasks</span>
                  </button>
                  <button
                    type="button"
                    className="tf-ai-quick-chip"
                    onClick={() => handleSendPrompt("What are my upcoming deadlines?")}
                  >
                    <Clock size={13} color="#2563EB" />
                    <span>Upcoming deadlines</span>
                  </button>
                  <button
                    type="button"
                    className="tf-ai-quick-chip"
                    onClick={() => handleSendPrompt("Show project progress")}
                  >
                    <Folder size={13} color="#10B981" />
                    <span>Project progress</span>
                  </button>
                  <button
                    type="button"
                    className="tf-ai-quick-chip"
                    onClick={() => handleSendPrompt("List my assigned bugs")}
                  >
                    <Bug size={13} color="#EF4444" />
                    <span>Assigned bugs</span>
                  </button>
                </div>

                {/* Input Form */}
                <form className="tf-ai-input-form" onSubmit={handleInputSubmit}>
                  <button
                    type="button"
                    className="tf-ai-attach-btn"
                    onClick={() => showToast("Select attachment from your local workspace...")}
                    title="Attach file"
                  >
                    <Paperclip size={18} />
                  </button>

                  <input
                    type="text"
                    placeholder="Ask anything about tasks, projects, meetings, bugs or team work..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />

                  <button
                    type="button"
                    className={`tf-ai-mic-btn ${isMicActive ? "active" : ""}`}
                    onClick={handleToggleMic}
                    title={isMicActive ? "Stop listening" : "Voice input"}
                  >
                    <Mic size={18} />
                  </button>

                  <button
                    type="submit"
                    className="tf-ai-send-btn"
                    disabled={!inputText.trim()}
                    title="Send message"
                  >
                    <Send size={15} />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------
              RIGHT COLUMN: Task Suggestions + Meeting Summaries Widgets
              ------------------------------------------------------------------ */}
          <div className="tf-ai-right-column">
            {/* Widget 1: Task Suggestions */}
            <article
              className="tf-ai-sidebar-widget"
              id="tf-task-suggestions-section"
            >
              <div className="tf-ai-widget-header">
                <div className="tf-ai-widget-title-group">
                  <div className="tf-ai-widget-icon amber">
                    <Lightbulb size={18} />
                  </div>
                  <div>
                    <h4>Task Suggestions</h4>
                    <p>Smart recommendations based on deadlines & impact</p>
                  </div>
                </div>
                <Link to="/employee/tasks" className="tf-ai-widget-link">
                  View All <ArrowRight size={13} />
                </Link>
              </div>

              <div className="tf-ai-suggestions-list">
                {taskSuggestions.map((sug) => (
                  <div key={sug.id} className="tf-ai-sugg-item">
                    <div className={`tf-ai-sugg-icon-box ${sug.color}`}>
                      {sug.icon === "target" ? (
                        <Target size={16} />
                      ) : sug.icon === "doc" ? (
                        <FileText size={16} />
                      ) : sug.icon === "laptop" ? (
                        <Laptop size={16} />
                      ) : (
                        <BarChart2 size={16} />
                      )}
                    </div>
                    <div className="tf-ai-sugg-info">
                      <strong className="tf-ai-sugg-title">{sug.title}</strong>
                      <span className="tf-ai-sugg-sub">{sug.subtitle}</span>
                    </div>
                    <div className="tf-ai-sugg-actions">
                      <button
                        type="button"
                        className="tf-ai-sugg-btn view"
                        onClick={() => setActiveTaskSuggestionModal(sug)}
                        title="View details & rationale"
                      >
                        View
                      </button>
                      {/* <button
                        type="button"
                        className="tf-ai-sugg-btn add"
                        onClick={() => handleAddSuggestedTask(sug)}
                        title="Add to My Tasks"
                      >
                        <Plus size={13} />
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* Widget 2: Meeting Summaries */}
            <article
              className="tf-ai-sidebar-widget"
              id="tf-summaries-section"
            >
              <div className="tf-ai-widget-header">
                <div className="tf-ai-widget-title-group">
                  <div className="tf-ai-widget-icon blue">
                    <Video size={18} />
                  </div>
                  <div>
                    <h4>Meeting Summaries</h4>
                    <p>Recent AI meeting executive briefs & action items</p>
                  </div>
                </div>
                <Link to="/employee/meetings" className="tf-ai-widget-link">
                  View All <ArrowRight size={13} />
                </Link>
              </div>

              <div className="tf-ai-meetings-list">
                {meetingSummariesData.map((m) => (
                  <div key={m.id} className="tf-ai-meet-item">
                    <div className={`tf-ai-meet-icon ${m.iconColor}`}>
                      <Video size={15} />
                    </div>
                    <div className="tf-ai-meet-info">
                      <strong className="tf-ai-meet-title">{m.title}</strong>
                      <span className="tf-ai-meet-time">{m.time}</span>
                    </div>
                    <button
                      type="button"
                      className="tf-ai-meet-view-btn"
                      onClick={() => setActiveSummaryModal(m)}
                    >
                      Summary
                    </button>
                  </div>
                ))}
              </div>
            </article>


          </div>
        </div>

        {/* ====================================================================
            MODAL: TASK SUGGESTION DETAIL MODAL
            ==================================================================== */}
        {activeTaskSuggestionModal && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveTaskSuggestionModal(null);
            }}
          >
            <div className="tf-modal-card tf-ai-modal-card" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-group">
                  <div className="tf-modal-icon-box task">
                    <Lightbulb size={20} />
                  </div>
                  <div>
                    <h3>{activeTaskSuggestionModal.title}</h3>
                    <p>
                      {activeTaskSuggestionModal.project} • {activeTaskSuggestionModal.category}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setActiveTaskSuggestionModal(null)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="tf-modal-body tf-ai-modal-body">
                {/* AI Recommendation Rationale */}
                <div className="tf-ai-rationale-box">
                  <div className="tf-ai-rationale-header">
                    <Sparkles size={15} color="#6C4CF6" />
                    <strong>Why AI recommends this task</strong>
                  </div>
                  <p>{activeTaskSuggestionModal.aiReason}</p>
                </div>

                {/* Metadata Grid */}
                <div className="tf-ai-meta-grid">
                  <div className="tf-ai-meta-item">
                    <span className="tf-ai-meta-label">Priority</span>
                    <span
                      className="tf-ai-badge-priority"
                      style={{
                        backgroundColor: `${activeTaskSuggestionModal.priorityColor}15`,
                        color: activeTaskSuggestionModal.priorityColor,
                        borderColor: `${activeTaskSuggestionModal.priorityColor}40`,
                      }}
                    >
                      {activeTaskSuggestionModal.priority}
                    </span>
                  </div>

                  <div className="tf-ai-meta-item">
                    <span className="tf-ai-meta-label">Due Date</span>
                    <span className="tf-ai-meta-val">
                      <Calendar size={13} /> {activeTaskSuggestionModal.dueDate}
                    </span>
                  </div>

                  <div className="tf-ai-meta-item">
                    <span className="tf-ai-meta-label">Estimated Effort</span>
                    <span className="tf-ai-meta-val">
                      <Clock size={13} /> {activeTaskSuggestionModal.estimatedTime}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="tf-ai-modal-section">
                  <span className="tf-ai-section-title">Task Description</span>
                  <p className="tf-ai-section-text">{activeTaskSuggestionModal.description}</p>
                </div>

                {/* Action Plan & Checklist */}
                {activeTaskSuggestionModal.subtasks &&
                  activeTaskSuggestionModal.subtasks.length > 0 && (
                    <div className="tf-ai-modal-section">
                      <span className="tf-ai-section-title">Action Plan & Checklist</span>
                      <ul className="tf-ai-checklist">
                        {activeTaskSuggestionModal.subtasks.map((item, idx) => (
                          <li key={idx}>
                            <Check size={14} className="tf-ai-check-icon" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Expected Impact */}
                {activeTaskSuggestionModal.impact && (
                  <div className="tf-ai-impact-callout">
                    <Target size={16} color="#2563EB" />
                    <div>
                      <strong>Expected Impact</strong>
                      <p>{activeTaskSuggestionModal.impact}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="tf-modal-actions">
                <button
                  type="button"
                  className="tf-btn-secondary"
                  onClick={() => setActiveTaskSuggestionModal(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="tf-btn-primary"
                  onClick={() => {
                    handleAddSuggestedTask(activeTaskSuggestionModal);
                    setActiveTaskSuggestionModal(null);
                  }}
                >
                  <Plus size={15} />
                  <span>Add to My Tasks</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            MODAL: MEETING SUMMARY MODAL
            ==================================================================== */}
        {activeSummaryModal && (
          <div
            className="tf-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveSummaryModal(null);
            }}
          >
            <div className="tf-modal-card tf-ai-modal-card" role="dialog" aria-modal="true">
              <div className="tf-modal-header">
                <div className="tf-modal-title-group">
                  <div className="tf-modal-icon-box event">
                    <Video size={20} />
                  </div>
                  <div>
                    <h3>{activeSummaryModal.title}</h3>
                    <p>{activeSummaryModal.time}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setActiveSummaryModal(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="tf-modal-body tf-ai-modal-body">
                <div className="tf-ai-modal-section">
                  <span className="tf-ai-section-title">AI Executive Summary</span>
                  <p className="tf-ai-section-text">{activeSummaryModal.summary}</p>
                </div>

                <div className="tf-ai-modal-section">
                  <span className="tf-ai-section-title">Key Takeaways & Decisions</span>
                  <ul className="tf-ai-checklist">
                    {activeSummaryModal.keyTakeaways.map((item, idx) => (
                      <li key={idx}>
                        <Check size={14} className="tf-ai-check-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="tf-modal-actions">
                <button
                  type="button"
                  className="tf-btn-secondary"
                  onClick={() => setActiveSummaryModal(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="tf-btn-primary"
                  onClick={() => {
                    handleSendPrompt(
                      `Follow up on action items from ${activeSummaryModal.title}`
                    );
                    setActiveSummaryModal(null);
                  }}
                >
                  <Sparkles size={15} />
                  <span>Ask Follow-Up</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeShell>
  );
}

export default AI;
