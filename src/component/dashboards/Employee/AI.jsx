import React, { useState, useEffect, useRef } from "react";
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
  List,
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
} from "lucide-react";

import EmployeeShell from "./EmployeeShell";
import { getEmployeeProfile } from "./EmployeeAuth";
import "./AI.css";

/* Storage Key */
const STORAGE_KEY = "tf_ai_assistant_v4";

/* User Avatar */
const userAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop";

/* Default Initial Conversation matching reference image exactly */
const defaultChatMessages = [
  {
    id: "msg-1",
    sender: "ai",
    time: "10:24 AM",
    type: "greeting",
    text: "Hello John! 👋\nI can help you with your tasks, projects, meetings, bugs, files and more. What would you like to know?",
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
        dueClass: "red",
        priority: "High",
        status: "In Progress",
        dotColor: "blue",
      },
      {
        id: "t2",
        title: "API integration testing",
        due: "Tomorrow",
        dueClass: "gray",
        priority: "Medium",
        status: "To Do",
        dotColor: "yellow",
      },
      {
        id: "t3",
        title: "Update project documentation",
        due: "Oct 26",
        dueClass: "gray",
        priority: "Low",
        status: "To Do",
        dotColor: "gray",
      },
      {
        id: "t4",
        title: "Fix responsive issues",
        due: "Oct 28",
        dueClass: "gray",
        priority: "High",
        status: "In Progress",
        dotColor: "gray",
      },
      {
        id: "t5",
        title: "Prepare demo for client",
        due: "Oct 30",
        dueClass: "gray",
        priority: "Medium",
        status: "To Do",
        dotColor: "gray",
      },
    ],
  },
];

/* Task Suggestions on Right Panel with Detailed Information */
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
    aiReason: "High correlation with open bug reports #104 and #108. Completing this unblocks the upcoming staging release.",
    description: "Perform end-to-end integration testing for authentication, team invite webhooks, and task synchronization endpoints across both staging and pre-production environments.",
    subtasks: [
      "Validate JWT token renewal on 401 response",
      "Verify mock payload responses for employee dashboard KPIs",
      "Run automated Postman / Newman test suite against staging cluster",
      "Log error handling cases for rate limiting & network timeouts"
    ],
    impact: "Unblocks 3 team members and ensures zero regression for Sprint 4 release."
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
    aiReason: "Documentation hasn't been updated since the v2.4 redesign. Several endpoints differ from actual responses.",
    description: "Update the project README, architectural diagrams, API route references, and environment configuration guides to reflect recent microservice changes.",
    subtasks: [
      "Document OAuth2 flow & token storage specifications",
      "Refresh component hierarchy chart in Figma / Wiki",
      "Update .env.example with newly added service keys"
    ],
    impact: "Reduces onboarding ramp-up time for new engineers from 3 days to 1 day."
  },
  {
    id: "ts-3",
    title: "Fix UI responsiveness issues",
    subtitle: "Improve mobile view layout",
    icon: "laptop",
    color: "purple",
    project: "TeamFlow Web App",
    priority: "High",
    priorityColor: "#EF4444",
    dueDate: "Oct 28, 2024",
    estimatedTime: "4.0 hrs",
    category: "Frontend UI/UX",
    aiReason: "Mobile viewport (< 768px) shows clipping on navigation bar and KPI cards reported by QA team.",
    description: "Audit and resolve responsive layout breaks across employee activity, task boards, and chat drawer on mobile screen widths (360px - 768px).",
    subtasks: [
      "Fix header hamburger drawer transition and overlay click",
      "Convert multi-column KPI grids to responsive auto-fit cards",
      "Ensure bottom action sheets don't overflow small viewport heights"
    ],
    impact: "Delivers a seamless mobile experience for 45% of active users accessing via mobile."
  },
  {
    id: "ts-4",
    title: "Prepare client demo presentation",
    subtitle: "Due Oct 30 • TeamFlow Website",
    icon: "chart",
    color: "blue",
    project: "Client Deliverables",
    priority: "Medium",
    priorityColor: "#2563EB",
    dueDate: "Oct 30, 2024",
    estimatedTime: "2.5 hrs",
    category: "Presentations & Strategy",
    aiReason: "Client milestone review scheduled for Friday. Slide deck requires updated sprint performance metrics.",
    description: "Synthesize sprint metrics, feature walkthrough demos, and AI workflow automation capabilities into a cohesive 12-slide stakeholder presentation.",
    subtasks: [
      "Export high-res UI screenshots and screen recordings of completed features",
      "Include KPI completion percentages (85% website, 62% mobile)",
      "Draft live demo speaking notes and risk mitigation section"
    ],
    impact: "Secures sign-off on Milestone 3 and unlocks Phase 2 enterprise contract budget."
  },
];

/* Meeting Summaries on Right Panel */
const meetingSummariesData = [
  {
    id: "ms-1",
    title: "Daily Standup",
    time: "Oct 22, 2024 • 9:00 – 9:30 AM",
    icon: "video",
    iconColor: "blue",
    summary:
      "Team reviewed the login page mockups and frontend API endpoints. Blockers on mobile responsive layout were assigned to John. Target deploy to staging is scheduled for Oct 24.",
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
    icon: "image",
    iconColor: "blue",
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
    icon: "doc",
    iconColor: "red",
    summary:
      "Sprint 4 velocity reached 92%. Successfully delivered 14 user stories, closed 6 major bugs, and updated CI/CD pipeline automation.",
    keyTakeaways: [
      "Velocity improved by 18% over Sprint 3",
      "Bug resolution time down to 1.4 days average",
      "Next sprint starts with Client Demo milestone",
    ],
  },
];


/* Helper to generate unique IDs outside component render */
function generateUniqueId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function AI() {
  const location = useLocation();

  // Active top mode tab: 'Chat' | 'Task Suggestions' | 'Summaries'
  const [activeModeTab, setActiveModeTab] = useState("Chat");

  // Task Suggestion Modal State
  const [activeTaskSuggestionModal, setActiveTaskSuggestionModal] = useState(null);

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

  // Input message state
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);

  // Meeting Summary Modal State
  const [activeSummaryModal, setActiveSummaryModal] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  const messagesEndRef = useRef(null);
  const chatAreaRef = useRef(null);

  // Send Prompt Handler
  const handleSendPrompt = (promptText) => {
    const textToSend = promptText || inputText;
    if (!textToSend.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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

    // 2. Generate intelligent response after brief realistic AI thinking delay
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let aiMsg = null;

      if (lower.includes("task") || lower.includes("summary") || lower.includes("week")) {
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
            { id: "t1", title: "Design login page UI", due: "Today", dueClass: "red", priority: "High", status: "In Progress", dotColor: "blue" },
            { id: "t2", title: "API integration testing", due: "Tomorrow", dueClass: "gray", priority: "Medium", status: "To Do", dotColor: "yellow" },
            { id: "t3", title: "Update project documentation", due: "Oct 26", dueClass: "gray", priority: "Low", status: "To Do", dotColor: "gray" },
            { id: "t4", title: "Fix responsive issues", due: "Oct 28", dueClass: "gray", priority: "High", status: "In Progress", dotColor: "gray" },
            { id: "t5", title: "Prepare demo for client", due: "Oct 30", dueClass: "gray", priority: "Medium", status: "To Do", dotColor: "gray" },
          ],
        };
      } else if (lower.includes("meeting") || lower.includes("last meeting")) {
        aiMsg = {
          id: generateUniqueId("ai"),
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "generic",
          text: `**Meeting Summary: Daily Standup (Oct 22)**\n- **Project:** TeamFlow Website\n- **Key Updates:** API endpoints verified by Rahul, Login Page UI reviewed and approved for staging.\n- **Next Step:** Complete responsive mobile layout adjustments before 4:00 PM sprint sync.`,
        };
      } else if (lower.includes("bug")) {
        aiMsg = {
          id: generateUniqueId("ai"),
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "generic",
          text: `**Assigned Bugs (3 Total):**\n1. **#BUG-1023:** Login button not working • *High Priority* (In Progress)\n2. **#BUG-1045:** API returns 500 error • *Medium Priority* (Open)\n3. **#BUG-1078:** UI misalignment on mobile • *Low Priority* (Resolved)\n\nRecommended: Focus on unblocking #BUG-1023 today before demo rehearsal.`,
        };
      } else if (lower.includes("project") || lower.includes("progress")) {
        aiMsg = {
          id: generateUniqueId("ai"),
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "generic",
          text: `**Project Progress Overview:**\n- **TeamFlow Website:** 85% Completed (4 of 5 milestones achieved)\n- **Mobile App:** 62% Completed (Sprint 4 testing in progress)\n- **AI Integration:** 40% Completed (Prompt evaluation active)\n- **Marketing Portal:** 100% Completed (Delivered to client)`,
        };
      } else if (lower.includes("deadline")) {
        aiMsg = {
          id: generateUniqueId("ai"),
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "generic",
          text: `**Upcoming Deadlines This Week:**\n- **Today:** Design login page UI (High Priority)\n- **Tomorrow:** API integration testing (Medium Priority)\n- **Oct 26:** Update project documentation (Low Priority)\n- **Oct 28:** Fix responsive issues (High Priority)\n- **Oct 30:** Client demo presentation (Milestone)`,
        };
      } else if (lower.includes("suggest") || lower.includes("next")) {
        aiMsg = {
          id: generateUniqueId("ai"),
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "generic",
          text: `**AI Smart Suggestions:**\n1. **Complete API Integration Testing:** Blocks backend team from finalizing the authentication service.\n2. **Update Project Documentation:** Keep API schemas synchronized before client demo.\n3. **Break Down Mobile View Layout:** Split remaining tablet/mobile responsive tasks into subtasks for faster turnaround.`,
        };
      } else if (lower.includes("file")) {
        aiMsg = {
          id: generateUniqueId("ai"),
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "generic",
          text: `**Important Files in Your Workspace:**\n- **Login_Page_Design.fig** (Figma • 4.2 MB • Updated Oct 23)\n- **API_Documentation.docx** (Word • 856 KB • Updated Oct 22)\n- **Sprint_Review.pptx** (Presentation • 3.1 MB • Updated Oct 20)\nAll files are cached in your local workspace under My Files.`,
        };
      } else {
        aiMsg = {
          id: generateUniqueId("ai"),
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "generic",
          text: `I've analyzed your workspace regarding "${textToSend}". You have **12 assigned tasks (8 completed, 3 in progress, 1 overdue)**, **3 active bugs**, and **3 upcoming meetings**. Your overall task completion rate is **75%**. Let me know if you would like me to draft an update, summarize a document, or reprioritize tasks!`,
        };
      }

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  // Persist messages to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Handle URL queries (e.g. ?query=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query");
    if (query && query.trim()) {
      const timer = setTimeout(() => {
        handleSendPrompt(query.trim());
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Clear Chat function
  const handleClearChat = () => {
    const resetMsg = [defaultChatMessages[0]];
    setMessages(resetMsg);
    showToast("Chat history cleared.");
  };

  // Handle Top Mode Tab navigation
  const handleModeTabClick = (tab) => {
    setActiveModeTab(tab);
    if (tab === "Chat") {
      document.getElementById("chat-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (tab === "Task Suggestions") {
      document.getElementById("task-suggestions-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (tab === "Summaries") {
      document.getElementById("meeting-summaries-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    handleSendPrompt(inputText);
  };

  // Add suggested task
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

  // Mic toggle simulation
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
      noScroll
    >
      <div className="tf-ai-pro-page tf-single-page-fit">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="tf-pro-toast">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ====================================================================
            PAGE HEADER (Title + Mode Navigation Tabs)
            ==================================================================== */}
        <header className="tf-pro-header">
          <div className="tf-pro-title-wrap">
            <div className="tf-pro-title-left">
              <Sparkles size={22} className="tf-pro-sparkle-icon" />
              <h1>AI Assistant</h1>
            </div>
            <p>Your intelligent work assistant for tasks, projects, meetings, files and more.</p>
          </div>

          {/* Top Mode Pill Tabs */}
          <div className="tf-pro-mode-tabs">
            <button
              type="button"
              className={`tf-mode-tab ${activeModeTab === "Chat" ? "active" : ""}`}
              onClick={() => handleModeTabClick("Chat")}
            >
              <MessageSquare size={14} />
              <span>Chat</span>
            </button>

            <button
              type="button"
              className={`tf-mode-tab ${activeModeTab === "Task Suggestions" ? "active" : ""}`}
              onClick={() => handleModeTabClick("Task Suggestions")}
            >
              <Lightbulb size={14} className="icon-yellow" />
              <span>Task Suggestions</span>
            </button>

            <button
              type="button"
              className={`tf-mode-tab ${activeModeTab === "Summaries" ? "active" : ""}`}
              onClick={() => handleModeTabClick("Summaries")}
            >
              <FileText size={14} className="icon-blue" />
              <span>Summaries</span>
            </button>

            
          </div>
        </header>

        {/* ====================================================================
            TOP 4 SUMMARY KPI CARDS
            ==================================================================== */}
        <section className="tf-pro-kpi-grid">
          {/* Card 1: My Tasks */}
          <div
            className="tf-pro-kpi-card"
            onClick={() => handleSendPrompt("Give me a summary of my tasks for this week.")}
          >
            <div className="tf-pro-kpi-top">
              <div className="tf-kpi-icon-square purple">
                <List size={18} />
              </div>
              <div className="tf-kpi-title-col">
                <span className="tf-kpi-title">My Tasks</span>
                <strong className="tf-kpi-number">12</strong>
              </div>
              <ArrowUpRight size={15} className="tf-kpi-arrow" />
            </div>
            <div className="tf-kpi-pills-row">
              <span className="tf-kpi-pill green">8 Completed</span>
              <span className="tf-kpi-pill blue">3 In Progress</span>
              <span className="tf-kpi-pill red">1 Overdue</span>
            </div>
          </div>

          {/* Card 2: My Projects */}
          <div
            className="tf-pro-kpi-card"
            onClick={() => handleSendPrompt("Show my project progress.")}
          >
            <div className="tf-pro-kpi-top">
              <div className="tf-kpi-icon-square blue">
                <Folder size={18} />
              </div>
              <div className="tf-kpi-title-col">
                <span className="tf-kpi-title">My Projects</span>
                <strong className="tf-kpi-number">4</strong>
              </div>
              <ArrowUpRight size={15} className="tf-kpi-arrow" />
            </div>
            <div className="tf-kpi-pills-row">
              <span className="tf-kpi-pill green">2 Active</span>
              <span className="tf-kpi-pill yellow">1 On Hold</span>
              <span className="tf-kpi-pill green">1 Completed</span>
            </div>
          </div>

          {/* Card 3: Upcoming Meetings */}
          <div
            className="tf-pro-kpi-card"
            onClick={() => handleSendPrompt("What are the upcoming meetings this week?")}
          >
            <div className="tf-pro-kpi-top">
              <div className="tf-kpi-icon-square orange">
                <Calendar size={18} />
              </div>
              <div className="tf-kpi-title-col">
                <span className="tf-kpi-title">Upcoming Meetings</span>
                <strong className="tf-kpi-number">3</strong>
              </div>
              <ArrowUpRight size={15} className="tf-kpi-arrow" />
            </div>
            <div className="tf-kpi-pills-row">
              <span className="tf-kpi-sub-text">This Week</span>
            </div>
          </div>

          {/* Card 4: Assigned Bugs */}
          <div
            className="tf-pro-kpi-card"
            onClick={() => handleSendPrompt("List my assigned bugs.")}
          >
            <div className="tf-pro-kpi-top">
              <div className="tf-kpi-icon-square red">
                <Bug size={18} />
              </div>
              <div className="tf-kpi-title-col">
                <span className="tf-kpi-title">Assigned Bugs</span>
                <strong className="tf-kpi-number">3</strong>
              </div>
              <ArrowUpRight size={15} className="tf-kpi-arrow" />
            </div>
            <div className="tf-kpi-pills-row">
              <span className="tf-kpi-pill red">1 Open</span>
              <span className="tf-kpi-pill blue">1 In Progress</span>
              <span className="tf-kpi-pill green">1 Resolved</span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            MAIN TWO-COLUMN WORKSPACE
            Left: Full-Height Chat with AI Assistant
            Right: Task Suggestions + Meeting Summaries
            ==================================================================== */}
        <div className="tf-pro-workspace-grid">
          {/* ------------------------------------------------------------------
              LEFT COLUMN
              ------------------------------------------------------------------ */}
          <div className="tf-pro-left-col">
            {/* Main Chat Card */}
            <div className="tf-pro-chat-card" id="chat-section" ref={chatAreaRef}>
              {/* Chat Card Header */}
              <div className="tf-chat-card-header">
                <div className="tf-chat-header-title-left">
                  <div className="tf-chat-star-box">
                    <Sparkles size={16} color="#4F46E5" />
                  </div>
                  <div>
                    <h3>Chat with AI Assistant</h3>
                    <p>Ask anything about your tasks, projects, meetings, files or team work.</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="tf-clear-chat-btn"
                  onClick={handleClearChat}
                >
                  Clear Chat
                </button>
              </div>

              {/* Chat Messages Stream */}
              <div className="tf-pro-messages-container">
                {messages.map((msg) => {
                  // User Message
                  if (msg.sender === "user") {
                    return (
                      <div key={msg.id} className="tf-pro-msg-row user">
                        <div className="tf-user-msg-col">
                          <span className="tf-user-msg-time">{msg.time}</span>
                          <div className="tf-user-speech-bubble">
                            <p>{msg.text}</p>
                          </div>
                        </div>
                        <img src={getEmployeeProfile()?.photo || userAvatar} alt={getEmployeeProfile()?.fullName || "John Doe"} className="tf-user-round-avatar" />
                      </div>
                    );
                  }

                  // AI Message
                  return (
                    <div key={msg.id} className="tf-pro-msg-row ai">
                      {/* Robot Icon Avatar */}
                      <div className="tf-robot-avatar-badge">
                        <Bot size={18} color="#4F46E5" />
                      </div>

                      <div className="tf-ai-speech-content">
                        <div className="tf-ai-msg-time-row">
                          <span className="tf-ai-msg-time">{msg.time}</span>
                        </div>

                        {/* Plain text / Greeting */}
                        {msg.text && (
                          <div className="tf-ai-text-bubble">
                            {msg.text.split("\n").map((line, idx) => (
                              <p key={idx}>{line}</p>
                            ))}
                          </div>
                        )}

                        {/* Task Summary Rich Table */}
                        {msg.type === "task_summary" && (
                          <div className="tf-pro-task-summary-card">
                            <h4 className="tf-summary-title">{msg.title}</h4>

                            {/* 4 Mini KPI boxes */}
                            <div className="tf-summary-kpi-subrow">
                              <div className="tf-summary-kpi-item">
                                <div className="tf-mini-kpi-icon purple">
                                  <FileText size={14} />
                                </div>
                                <div className="tf-mini-kpi-texts">
                                  <strong>{msg.kpis.total}</strong>
                                  <span>Total Tasks</span>
                                </div>
                              </div>

                              <div className="tf-summary-kpi-item">
                                <div className="tf-mini-kpi-icon green">
                                  <Check size={14} strokeWidth={3} />
                                </div>
                                <div className="tf-mini-kpi-texts">
                                  <strong>{msg.kpis.completed}</strong>
                                  <span>Completed</span>
                                </div>
                              </div>

                              <div className="tf-summary-kpi-item">
                                <div className="tf-mini-kpi-icon orange">
                                  <Clock size={14} />
                                </div>
                                <div className="tf-mini-kpi-texts">
                                  <strong>{msg.kpis.inProgress}</strong>
                                  <span>In Progress</span>
                                </div>
                              </div>

                              <div className="tf-summary-kpi-item">
                                <div className="tf-mini-kpi-icon red">
                                  <AlertCircle size={14} />
                                </div>
                                <div className="tf-mini-kpi-texts">
                                  <strong>{msg.kpis.overdue}</strong>
                                  <span>Overdue</span>
                                </div>
                              </div>
                            </div>

                            {/* Tasks Table */}
                            <div className="tf-summary-table-wrap">
                              <table className="tf-summary-table">
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
                                      <td className="col-task-name">
                                        <div className="tf-task-name-group">
                                          <span className={`tf-dot ${t.dotColor}`} />
                                          <span>{t.title}</span>
                                        </div>
                                      </td>
                                      <td className={`col-due-date ${t.dueClass || ""}`}>
                                        {t.due}
                                      </td>
                                      <td>
                                        <span className={`tf-pill-badge priority ${t.priority.toLowerCase()}`}>
                                          {t.priority}
                                        </span>
                                      </td>
                                      <td>
                                        <span className={`tf-pill-badge status ${t.status === "In Progress" ? "in-progress" : "todo"}`}>
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

                {/* AI Thinking typing indicator */}
                {isTyping && (
                  <div className="tf-pro-msg-row ai">
                    <div className="tf-robot-avatar-badge">
                      <Bot size={18} color="#4F46E5" />
                    </div>
                    <div className="tf-ai-thinking-pill">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input & Bottom Quick Pills Bar */}
              <div className="tf-pro-chat-footer-block">
                <form className="tf-pro-input-row" onSubmit={handleInputSubmit}>
                  <button
                    type="button"
                    className="tf-input-attach-btn"
                    onClick={() => showToast("Select attachment from workspace...")}
                    title="Attach file"
                  >
                    <Paperclip size={18} />
                  </button>

                  <input
                    type="text"
                    placeholder="Ask anything about your work..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />

                  <button
                    type="button"
                    className={`tf-input-mic-btn ${isMicActive ? "active" : ""}`}
                    onClick={handleToggleMic}
                    title={isMicActive ? "Stop listening" : "Voice input"}
                  >
                    <Mic size={18} />
                  </button>

                  <button
                    type="submit"
                    className="tf-input-send-btn"
                    disabled={!inputText.trim()}
                    title="Send message"
                  >
                    <Send size={15} />
                  </button>
                </form>

                {/* Quick suggestion pills directly inside card */}
                <div className="tf-pro-quick-pills-row">
                  <button
                    type="button"
                    className="tf-quick-prompt-pill purple"
                    onClick={() => handleSendPrompt("Summarize my tasks for this week")}
                  >
                    <span className="hash">#</span> Summarize my tasks
                  </button>
                  <button
                    type="button"
                    className="tf-quick-prompt-pill yellow"
                    onClick={() => handleSendPrompt("Suggest next tasks for me")}
                  >
                    <Lightbulb size={12} /> Suggest next tasks
                  </button>
                  <button
                    type="button"
                    className="tf-quick-prompt-pill purple-bar"
                    onClick={() => handleSendPrompt("What are my upcoming deadlines?")}
                  >
                    <BarChart2 size={12} /> What are my deadlines?
                  </button>
                  <button
                    type="button"
                    className="tf-quick-prompt-pill blue"
                    onClick={() => handleSendPrompt("Show project progress")}
                  >
                    <FileText size={12} /> Show project progress
                  </button>
                </div>
              </div>
            </div>

            </div>

          {/* ------------------------------------------------------------------
              RIGHT COLUMN
              ------------------------------------------------------------------ */}
          <div className="tf-pro-right-col">
            {/* Widget 1: Task Suggestions */}
            <article className="tf-pro-sidebar-card tf-task-sugg-widget" id="task-suggestions-section">
              <div className="tf-sidebar-card-header">
                <div className="tf-card-header-left">
                  <div className="tf-widget-icon-box yellow">
                    <Lightbulb size={16} />
                  </div>
                  <div>
                    <h4>Task Suggestions</h4>
                    <p>Get smart suggestions based on your work and deadlines.</p>
                  </div>
                </div>
                <Link to="/employee/tasks" className="tf-widget-link">
                  View All <ArrowRight size={13} />
                </Link>
              </div>

              <div className="tf-suggestions-list">
                {taskSuggestions.map((sug) => (
                  <div key={sug.id} className="tf-suggestion-item">
                    <div className={`tf-sugg-icon-box ${sug.color}`}>
                      {sug.icon === "target" ? (
                        <Target size={15} />
                      ) : sug.icon === "doc" ? (
                        <FileText size={15} />
                      ) : sug.icon === "laptop" ? (
                        <Laptop size={15} />
                      ) : (
                        <BarChart2 size={15} />
                      )}
                    </div>
                    <div className="tf-sugg-texts">
                      <strong>{sug.title}</strong>
                      <span>{sug.subtitle}</span>
                    </div>
                    <button
                      type="button"
                      className="tf-sugg-view-btn"
                      onClick={() => setActiveTaskSuggestionModal(sug)}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </article>

            {/* Widget 2: Meeting Summaries */}
            <article className="tf-pro-sidebar-card tf-meeting-sum-widget" id="meeting-summaries-section">
              <div className="tf-sidebar-card-header">
                <div className="tf-card-header-left">
                  <div className="tf-widget-icon-box blue">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h4>Meeting Summaries</h4>
                    <p>Get AI summaries of your meetings.</p>
                  </div>
                </div>
                <Link to="/employee/meetings" className="tf-widget-link">
                  View All <ArrowRight size={13} />
                </Link>
              </div>

              <div className="tf-meetings-summaries-list">
                {meetingSummariesData.map((m) => (
                  <div key={m.id} className="tf-meeting-sum-item">
                    <div className={`tf-meet-sum-icon ${m.iconColor}`}>
                      {m.icon === "video" ? (
                        <Video size={15} />
                      ) : (
                        <FileText size={15} />
                      )}
                    </div>
                    <div className="tf-meet-sum-texts">
                      <strong>{m.title}</strong>
                      <span>{m.time}</span>
                    </div>
                    <button
                      type="button"
                      className="tf-view-summary-btn"
                      onClick={() => setActiveSummaryModal(m)}
                    >
                      View Summary
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
            className="tf-pro-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveTaskSuggestionModal(null);
            }}
          >
            <div className="tf-pro-modal-card tf-task-detail-modal" role="dialog" aria-modal="true">
              <div className="tf-pro-modal-header">
                <div className="tf-modal-title-group">
                  <div className="tf-modal-badge yellow">
                    <Lightbulb size={18} />
                  </div>
                  <div>
                    <h3>{activeTaskSuggestionModal.title}</h3>
                    <p>{activeTaskSuggestionModal.project} • {activeTaskSuggestionModal.category}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-pro-modal-close"
                  onClick={() => setActiveTaskSuggestionModal(null)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="tf-pro-modal-body">
                {/* AI Recommendation Rationale */}
                <div className="tf-task-modal-ai-box">
                  <div className="tf-ai-pill-header">
                    <Sparkles size={14} className="tf-sparkle-blue" />
                    <strong>Why AI recommends this task</strong>
                  </div>
                  <p>{activeTaskSuggestionModal.aiReason}</p>
                </div>

                {/* Metadata Grid */}
                <div className="tf-task-modal-meta-grid">
                  <div className="tf-task-meta-item">
                    <span className="tf-meta-label">Priority</span>
                    <span
                      className="tf-priority-pill"
                      style={{
                        backgroundColor: `${activeTaskSuggestionModal.priorityColor}15`,
                        color: activeTaskSuggestionModal.priorityColor,
                        borderColor: `${activeTaskSuggestionModal.priorityColor}35`,
                      }}
                    >
                      {activeTaskSuggestionModal.priority}
                    </span>
                  </div>

                  <div className="tf-task-meta-item">
                    <span className="tf-meta-label">Due Date</span>
                    <span className="tf-meta-val">
                      <Calendar size={13} /> {activeTaskSuggestionModal.dueDate}
                    </span>
                  </div>

                  <div className="tf-task-meta-item">
                    <span className="tf-meta-label">Estimated Effort</span>
                    <span className="tf-meta-val">
                      <Clock size={13} /> {activeTaskSuggestionModal.estimatedTime}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="tf-modal-summary-section">
                  <span className="tf-section-badge">Task Description</span>
                  <p className="tf-summary-paragraph">{activeTaskSuggestionModal.description}</p>
                </div>

                {/* Action Plan & Checklist */}
                {activeTaskSuggestionModal.subtasks && activeTaskSuggestionModal.subtasks.length > 0 && (
                  <div className="tf-modal-summary-section">
                    <span className="tf-section-badge">Action Plan & Checklist</span>
                    <ul className="tf-takeaways-list">
                      {activeTaskSuggestionModal.subtasks.map((item, idx) => (
                        <li key={idx}>
                          <Check size={14} className="tf-check-green" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Expected Impact */}
                {activeTaskSuggestionModal.impact && (
                  <div className="tf-modal-summary-section">
                    <span className="tf-section-badge">Expected Impact</span>
                    <p className="tf-impact-note">
                      <Target size={14} className="icon-blue" />
                      <span>{activeTaskSuggestionModal.impact}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="tf-pro-modal-footer">
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
                  <Plus size={14} /> Add to My Tasks
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
            className="tf-pro-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveSummaryModal(null);
            }}
          >
            <div className="tf-pro-modal-card" role="dialog" aria-modal="true">
              <div className="tf-pro-modal-header">
                <div className="tf-modal-title-group">
                  <div className="tf-modal-badge purple">
                    <Video size={18} />
                  </div>
                  <div>
                    <h3>{activeSummaryModal.title}</h3>
                    <p>{activeSummaryModal.time}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-pro-modal-close"
                  onClick={() => setActiveSummaryModal(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="tf-pro-modal-body">
                <div className="tf-modal-summary-section">
                  <span className="tf-section-badge">AI Executive Summary</span>
                  <p className="tf-summary-paragraph">{activeSummaryModal.summary}</p>
                </div>

                <div className="tf-modal-summary-section">
                  <span className="tf-section-badge">Key Takeaways & Decisions</span>
                  <ul className="tf-takeaways-list">
                    {activeSummaryModal.keyTakeaways.map((item, idx) => (
                      <li key={idx}>
                        <Check size={14} className="tf-check-green" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="tf-pro-modal-footer">
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
                    handleSendPrompt(`Follow up on action items from ${activeSummaryModal.title}`);
                    setActiveSummaryModal(null);
                  }}
                >
                  <Sparkles size={14} /> Ask Follow-Up
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
