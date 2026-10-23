// src/component/AdminTasks/adminTasksData.js

export const initialAdminTasks = [
  {
    id: "TSK-1001",
    title: "Complete Admin Dashboard UI",
    project: "TeamFlow AI",
    workspace: "TeamFlow Workspace",
    assignee: "John Doe",
    assigneeEmail: "john@company.com",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-10-25",
    createdAt: "2026-10-18",
  },
  {
    id: "TSK-1002",
    title: "Fix Login Authentication",
    project: "Backend API",
    workspace: "Development Hub",
    assignee: "Sarah Chen",
    assigneeEmail: "sarah@modernlab.com",
    priority: "Critical",
    status: "Review",
    dueDate: "2026-10-24",
    createdAt: "2026-10-19",
  },
  {
    id: "TSK-1003",
    title: "Create Mobile Navigation",
    project: "Mobile App",
    workspace: "Design Studio",
    assignee: "Emily Parker",
    assigneeEmail: "emily@designhub.com",
    priority: "Medium",
    status: "To Do",
    dueDate: "2026-10-30",
    createdAt: "2026-10-20",
  },
  {
    id: "TSK-1004",
    title: "Deploy API Update",
    project: "Backend API",
    workspace: "Development Hub",
    assignee: "David Lee",
    assigneeEmail: "david@techcorp.com",
    priority: "High",
    status: "Completed",
    dueDate: "2026-10-21",
    createdAt: "2026-10-16",
  },
  {
    id: "TSK-1005",
    title: "Design Marketing Landing Page",
    project: "Marketing Website",
    workspace: "Marketing Team",
    assignee: "Michael Rodriguez",
    assigneeEmail: "michael@startup.io",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-10-28",
    createdAt: "2026-10-21",
  },
  {
    id: "TSK-1006",
    title: "Test AI Assistant Responses",
    project: "AI Assistant",
    workspace: "Research Lab",
    assignee: "Alex Morgan",
    assigneeEmail: "alex@startup.io",
    priority: "High",
    status: "To Do",
    dueDate: "2026-11-01",
    createdAt: "2026-10-22",
  },
  {
    id: "TSK-1007",
    title: "Update Workspace Permissions",
    project: "TeamFlow AI",
    workspace: "TeamFlow Workspace",
    assignee: "Sarah Chen",
    assigneeEmail: "sarah@modernlab.com",
    priority: "Low",
    status: "Completed",
    dueDate: "2026-10-20",
    createdAt: "2026-10-15",
  },
  {
    id: "TSK-1008",
    title: "Review BugFlow AI Module",
    project: "BugFlow AI",
    workspace: "Research Lab",
    assignee: "John Doe",
    assigneeEmail: "john@company.com",
    priority: "Critical",
    status: "Review",
    dueDate: "2026-10-26",
    createdAt: "2026-10-22",
  },
];

export const taskStatusOptions = [
  "To Do",
  "In Progress",
  "Review",
  "Completed",
];

export const taskPriorityOptions = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

export const taskAssignees = [
  {
    name: "John Doe",
    email: "john@company.com",
  },
  {
    name: "Sarah Chen",
    email: "sarah@modernlab.com",
  },
  {
    name: "Emily Parker",
    email: "emily@designhub.com",
  },
  {
    name: "David Lee",
    email: "david@techcorp.com",
  },
  {
    name: "Michael Rodriguez",
    email: "michael@startup.io",
  },
  {
    name: "Alex Morgan",
    email: "alex@startup.io",
  },
];

export const taskProjects = [
  "TeamFlow AI",
  "Backend API",
  "Mobile App",
  "Marketing Website",
  "AI Assistant",
  "BugFlow AI",
];

export const taskWorkspaces = [
  "TeamFlow Workspace",
  "Development Hub",
  "Design Studio",
  "Marketing Team",
  "Research Lab",
  "Startup Team",
];