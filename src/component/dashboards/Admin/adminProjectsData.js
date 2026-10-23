export const projectStatuses = [
  "Active",
  "On Hold",
  "Completed",
  "Overdue",
];

export const projectPriorities = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

export const workspaceOptions = [
  "TeamFlow Workspace",
  "Marketing Team",
  "Design Studio",
  "Research Lab",
  "Development Hub",
  "Startup Team",
];

export const initialAdminProjects = [
  {
    id: 1,
    name: "TeamFlow AI Web",
    workspace: "TeamFlow Workspace",
    owner: "John Doe",
    ownerEmail: "john@company.com",
    status: "Active",
    priority: "High",
    members: 12,
    tasks: 24,
    completedTasks: 16,
    dueDate: "2026-11-20",
    createdAt: "2026-10-01",
    description:
      "Main TeamFlow AI collaboration platform for teams, projects, tasks and communication.",
  },

  {
    id: 2,
    name: "Mobile Application",
    workspace: "Development Hub",
    owner: "David Lee",
    ownerEmail: "david@techcorp.com",
    status: "Active",
    priority: "High",
    members: 8,
    tasks: 18,
    completedTasks: 9,
    dueDate: "2026-12-10",
    createdAt: "2026-10-04",
    description:
      "Mobile version of TeamFlow AI for Android and iOS users.",
  },

  {
    id: 3,
    name: "Marketing Website",
    workspace: "Marketing Team",
    owner: "Sarah Chen",
    ownerEmail: "sarah@modernlab.com",
    status: "Completed",
    priority: "Medium",
    members: 5,
    tasks: 16,
    completedTasks: 16,
    dueDate: "2026-10-15",
    createdAt: "2026-09-20",
    description:
      "Public marketing website for TeamFlow AI product and feature information.",
  },

  {
    id: 4,
    name: "AI Assistant",
    workspace: "Research Lab",
    owner: "Emily Parker",
    ownerEmail: "emily@designhub.com",
    status: "On Hold",
    priority: "Critical",
    members: 7,
    tasks: 21,
    completedTasks: 7,
    dueDate: "2026-12-30",
    createdAt: "2026-09-28",
    description:
      "AI assistant for workspace summaries, task recommendations and productivity insights.",
  },

  {
    id: 5,
    name: "Backend API",
    workspace: "Development Hub",
    owner: "Michael Rodriguez",
    ownerEmail: "michael@startup.io",
    status: "Active",
    priority: "Critical",
    members: 9,
    tasks: 32,
    completedTasks: 20,
    dueDate: "2026-11-30",
    createdAt: "2026-09-15",
    description:
      "Core REST API and backend services powering the TeamFlow AI platform.",
  },

  {
    id: 6,
    name: "UI/UX Redesign",
    workspace: "Design Studio",
    owner: "Alex Morgan",
    ownerEmail: "alex@startup.io",
    status: "Overdue",
    priority: "Medium",
    members: 6,
    tasks: 20,
    completedTasks: 13,
    dueDate: "2026-10-20",
    createdAt: "2026-09-10",
    description:
      "Design system and user experience improvements across the TeamFlow AI application.",
  },
];