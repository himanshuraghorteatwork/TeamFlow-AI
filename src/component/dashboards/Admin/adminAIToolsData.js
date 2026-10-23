// src/component/AdminAITools/adminAIToolsData.js

export const initialAITools = [
  {
    id: 1,
    name: "AI Assistant",
    description:
      "General AI assistant for workspace questions, productivity and collaboration.",
    category: "Assistant",
    model: "GPT-4o Mini",
    status: "Active",
    enabled: true,
    requests: 24580,
    users: 486,
    successRate: 99.2,
    icon: "assistant",
    lastUsed: "2 minutes ago",
  },
  {
    id: 2,
    name: "Chat Summarizer",
    description:
      "Automatically summarizes long team conversations and channel discussions.",
    category: "Productivity",
    model: "GPT-4o Mini",
    status: "Active",
    enabled: true,
    requests: 18420,
    users: 329,
    successRate: 98.7,
    icon: "summary",
    lastUsed: "5 minutes ago",
  },
  {
    id: 3,
    name: "BugFlow AI",
    description:
      "Analyzes bug reports, suggests severity and helps teams identify possible causes.",
    category: "Development",
    model: "GPT-4o",
    status: "Active",
    enabled: true,
    requests: 9340,
    users: 218,
    successRate: 97.8,
    icon: "bug",
    lastUsed: "8 minutes ago",
  },
  {
    id: 4,
    name: "Task Generator",
    description:
      "Converts requirements and conversations into structured actionable tasks.",
    category: "Productivity",
    model: "GPT-4o Mini",
    status: "Active",
    enabled: true,
    requests: 12840,
    users: 274,
    successRate: 98.1,
    icon: "task",
    lastUsed: "12 minutes ago",
  },
  {
    id: 5,
    name: "Smart Search",
    description:
      "Uses AI to search projects, tasks, files and conversations using natural language.",
    category: "Search",
    model: "Embedding Model",
    status: "Active",
    enabled: true,
    requests: 31240,
    users: 510,
    successRate: 99.4,
    icon: "search",
    lastUsed: "1 minute ago",
  },
  {
    id: 6,
    name: "Meeting Summary",
    description:
      "Generates concise meeting summaries, decisions and follow-up action items.",
    category: "Productivity",
    model: "GPT-4o",
    status: "Disabled",
    enabled: false,
    requests: 6240,
    users: 146,
    successRate: 96.9,
    icon: "meeting",
    lastUsed: "2 days ago",
  },
];

export const aiCategories = [
  "All",
  "Assistant",
  "Productivity",
  "Development",
  "Search",
];

export const aiModels = [
  "GPT-4o",
  "GPT-4o Mini",
  "Embedding Model",
  "Custom Model",
];