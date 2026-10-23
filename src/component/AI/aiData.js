import {
  FileText,
  CheckCircle2,
  Bug,
  BarChart3,
  Lightbulb,
  LayoutDashboard,
  MessageCircle,
  FolderKanban,
  CalendarDays,
  UserRound,
  Files,
  Sparkles,
  SquareCheckBig,
} from "lucide-react";

/* =====================================================
   AI FEATURE CARDS
===================================================== */

export const aiFeatures = [
  {
    id: "summary",
    title: "Summarize",
    description: "Get summaries of chats, meetings, tasks or projects.",
    icon: FileText,
    color: "purple",
    prompt: "Summarize today's team updates",
  },
  {
    id: "task",
    title: "Create Tasks",
    description: "Turn ideas into actionable tasks with deadlines.",
    icon: CheckCircle2,
    color: "green",
    prompt: "Create a new task for UI design",
  },
  {
    id: "bugs",
    title: "Find & Analyze Bugs",
    description: "Identify and analyze issues from logs or descriptions.",
    icon: Bug,
    color: "orange",
    prompt: "Find recent bugs",
  },
  {
    id: "reports",
    title: "Generate Reports",
    description: "Create project, sprint or team reports instantly.",
    icon: BarChart3,
    color: "blue",
    prompt: "Generate a project report",
  },
  {
    id: "ideas",
    title: "Suggest Ideas",
    description: "Get smart suggestions to improve productivity.",
    icon: Lightbulb,
    color: "pink",
    prompt: "Suggest ways to improve productivity",
  },
];

/* =====================================================
   QUICK PROMPTS
===================================================== */

export const quickPrompts = [
  {
    id: 1,
    text: "Summarize today's team updates",
    icon: FileText,
    color: "purple",
  },
  {
    id: 2,
    text: "Create a new task for UI design",
    icon: CheckCircle2,
    color: "green",
  },
  {
    id: 3,
    text: "Find recent bugs",
    icon: Bug,
    color: "orange",
  },
  {
    id: 4,
    text: "Generate a project report",
    icon: BarChart3,
    color: "blue",
  },
  {
    id: 5,
    text: "Suggest ways to improve productivity",
    icon: Lightbulb,
    color: "pink",
  },
];

/* =====================================================
   RECENT CONVERSATIONS
===================================================== */

export const initialRecentConversations = [
  {
    id: 1,
    title: "Summarize today's team updates",
    time: "10:03 AM",
  },
  {
    id: 2,
    title: "Create tasks from this meeting",
    time: "Yesterday",
  },
  {
    id: 3,
    title: "Find bugs in the login module",
    time: "Yesterday",
  },
  {
    id: 4,
    title: "Generate sprint report",
    time: "Oct 21",
  },
  {
    id: 5,
    title: "Suggest feature ideas",
    time: "Oct 20",
  },
];

/* =====================================================
   GLOBAL SEARCH DATA
===================================================== */

export const searchItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Open your TeamFlow dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "chat",
    title: "Chat",
    description: "Open team conversations",
    path: "/chat",
    icon: MessageCircle,
  },
  {
    id: "tasks",
    title: "Tasks",
    description: "View and manage team tasks",
    path: "/tasks",
    icon: SquareCheckBig,
  },
  {
    id: "projects",
    title: "Projects",
    description: "View and manage your projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    id: "bugs",
    title: "Bugs",
    description: "View and manage reported bugs",
    path: "/bugs",
    icon: Bug,
  },
  {
    id: "calendar",
    title: "Calendar",
    description: "View deadlines, meetings and events",
    path: "/calendar",
    icon: CalendarDays,
  },
  {
    id: "team",
    title: "Team",
    description: "View workspace team members",
    path: "/team",
    icon: UserRound,
  },
  {
    id: "files",
    title: "Files",
    description: "Open workspace files",
    path: "/files",
    icon: Files,
  },
  {
    id: "assistant",
    title: "AI Assistant",
    description: "Open TeamFlow AI Assistant",
    path: "/ai-assistant",
    icon: Sparkles,
  },
];

/* =====================================================
   SIMULATED AI RESPONSES

   Later you can replace this function with your
   backend/OpenAI API.
===================================================== */

export const getAIResponse = (message) => {
  const text = message.toLowerCase();

  /* SUMMARY */

  if (
    text.includes("summar") ||
    text.includes("team update") ||
    text.includes("update")
  ) {
    return {
      type: "summary",

      text: "Here's a summary of today's team updates:",

      items: [
        {
          label: "Design",
          value: "Completed the new UI for the project dashboard.",
        },
        {
          label: "Development",
          value: "Working on AI Assistant integration.",
        },
        {
          label: "QA",
          value: "Found 2 minor bugs in the login flow.",
        },
        {
          label: "Next Steps",
          value: "Review pull requests and deploy changes to staging.",
        },
      ],
    };
  }

  /* BUGS */

  if (
    text.includes("bug") ||
    text.includes("error") ||
    text.includes("issue")
  ) {
    return {
      type: "bugs",

      text: "I found 2 recent issues that may need attention.",

      items: [
        {
          label: "High Priority",
          value:
            "Login validation issue — some invalid credentials are not showing the correct error message.",
        },
        {
          label: "Medium Priority",
          value:
            "Dashboard layout overflow — cards can overlap on smaller screens.",
        },
        {
          label: "Recommendation",
          value:
            "Fix the login validation issue first because it directly affects user access.",
        },
      ],
    };
  }

  /* TASK */

  if (
    text.includes("task") ||
    text.includes("assign") ||
    text.includes("todo")
  ) {
    return {
      type: "task",

      text: "I've prepared a task based on your request.",

      items: [
        {
          label: "Task",
          value: "Design the TeamFlow AI Assistant interface.",
        },
        {
          label: "Priority",
          value: "High",
        },
        {
          label: "Status",
          value: "To Do",
        },
        {
          label: "Deadline",
          value: "Complete during the current sprint.",
        },
      ],
    };
  }

  /* REPORT */

  if (
    text.includes("report") ||
    text.includes("sprint") ||
    text.includes("progress")
  ) {
    return {
      type: "report",

      text: "Here's the current TeamFlow project report:",

      items: [
        {
          label: "UI/UX",
          value: "Most major application screens are completed.",
        },
        {
          label: "Development",
          value: "AI Assistant integration is currently in progress.",
        },
        {
          label: "Bugs",
          value: "2 minor issues are currently open.",
        },
        {
          label: "Overall Progress",
          value: "The project is progressing as expected.",
        },
      ],
    };
  }

  /* IDEAS */

  if (
    text.includes("idea") ||
    text.includes("improve") ||
    text.includes("productivity") ||
    text.includes("suggest")
  ) {
    return {
      type: "ideas",

      text: "Here are some ideas that could improve TeamFlow AI:",

      items: [
        {
          label: "AI Summaries",
          value: "Automatically summarize long team conversations.",
        },
        {
          label: "Smart Tasks",
          value: "Convert chat messages directly into assigned tasks.",
        },
        {
          label: "Bug Assistant",
          value: "Analyze bug descriptions and recommend possible fixes.",
        },
        {
          label: "Weekly Reports",
          value: "Automatically generate team productivity reports.",
        },
      ],
    };
  }

  /* PROJECT */

  if (text.includes("project")) {
    return {
      type: "project",

      text: "I can help you manage your TeamFlow project.",

      items: [
        {
          label: "Planning",
          value: "Create milestones and organize project tasks.",
        },
        {
          label: "Team",
          value: "Assign responsibilities to workspace members.",
        },
        {
          label: "Tracking",
          value: "Monitor task progress and deadlines.",
        },
        {
          label: "AI",
          value: "Generate summaries and project reports automatically.",
        },
      ],
    };
  }

  /* GREETING */

  if (
    text.includes("hello") ||
    text.includes("hi ") ||
    text === "hi" ||
    text.includes("hey")
  ) {
    return {
      type: "normal",
      text:
        "Hi! 👋 I'm your TeamFlow AI Assistant. What are you working on today?",
    };
  }

  /* DEFAULT */

  return {
    type: "normal",

    text:
      "I can help you summarize team activity, create tasks, analyze bugs, generate reports, manage projects, and suggest improvements. Tell me what you'd like to work on.",
  };
};