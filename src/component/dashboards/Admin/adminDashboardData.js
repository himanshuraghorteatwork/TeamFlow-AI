// src/component/dashboards/Admin/adminDashboardData.js

export const fallbackUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@company.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah@modernlab.com",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    email: "michael@company.com",
    role: "User",
    status: "Active",
  },
  {
    id: 4,
    name: "Emily Parker",
    email: "emily@designhub.com",
    role: "User",
    status: "Active",
  },
];

export const fallbackWorkspaces = [
  {
    id: 1,
    name: "TeamFlow Workspace",
    members: 24,
    category: "Development",
  },
  {
    id: 2,
    name: "Marketing Team",
    members: 12,
    category: "Marketing",
  },
  {
    id: 3,
    name: "Design Studio",
    members: 8,
    category: "Design",
  },
  {
    id: 4,
    name: "Research Lab",
    members: 18,
    category: "Research",
  },
  {
    id: 5,
    name: "Development Hub",
    members: 28,
    category: "Development",
  },
  {
    id: 6,
    name: "Startup Team",
    members: 7,
    category: "Other",
  },
];

export const fallbackProjects = [
  {
    id: 1,
    name: "TeamFlow AI",
    status: "Active",
    progress: 78,
  },
  {
    id: 2,
    name: "Backend API",
    status: "Active",
    progress: 64,
  },
  {
    id: 3,
    name: "Mobile App",
    status: "Active",
    progress: 45,
  },
  {
    id: 4,
    name: "Marketing Website",
    status: "Completed",
    progress: 100,
  },
  {
    id: 5,
    name: "AI Assistant",
    status: "Active",
    progress: 58,
  },
];

export const fallbackTasks = [
  {
    id: 1,
    title: "Dashboard UI",
    status: "Completed",
  },
  {
    id: 2,
    title: "Admin API",
    status: "In Progress",
  },
  {
    id: 3,
    title: "AI integration",
    status: "In Progress",
  },
  {
    id: 4,
    title: "Testing",
    status: "Review",
  },
  {
    id: 5,
    title: "Billing page",
    status: "Completed",
  },
  {
    id: 6,
    title: "Analytics",
    status: "To Do",
  },
  {
    id: 7,
    title: "Workspace module",
    status: "To Do",
  },
  {
    id: 8,
    title: "User management",
    status: "In Progress",
  },
];

export const fallbackTransactions = [
  {
    id: 1,
    amount: 249,
    status: "Paid",
  },
  {
    id: 2,
    amount: 99,
    status: "Paid",
  },
  {
    id: 3,
    amount: 49,
    status: "Pending",
  },
  {
    id: 4,
    amount: 99,
    status: "Failed",
  },
  {
    id: 5,
    amount: 249,
    status: "Paid",
  },
  {
    id: 6,
    amount: 348,
    status: "Paid",
  },
];

// Used when no saved analytics history exists.
export const fallbackGrowth = [
  {
    label: "May",
    users: 620,
    active: 430,
  },
  {
    label: "Jun",
    users: 710,
    active: 510,
  },
  {
    label: "Jul",
    users: 825,
    active: 590,
  },
  {
    label: "Aug",
    users: 930,
    active: 690,
  },
  {
    label: "Sep",
    users: 1080,
    active: 810,
  },
  {
    label: "Oct",
    users: 1248,
    active: 960,
  },
];

// Used as fallback if no live task data is available.
export const projectActivity = [
  {
    label: "Mon",
    completed: 18,
    progress: 24,
    todo: 20,
  },
  {
    label: "Tue",
    completed: 27,
    progress: 31,
    todo: 28,
  },
  {
    label: "Wed",
    completed: 15,
    progress: 22,
    todo: 17,
  },
  {
    label: "Thu",
    completed: 21,
    progress: 29,
    todo: 24,
  },
  {
    label: "Fri",
    completed: 13,
    progress: 20,
    todo: 18,
  },
  {
    label: "Sat",
    completed: 17,
    progress: 24,
    todo: 22,
  },
  {
    label: "Sun",
    completed: 25,
    progress: 32,
    todo: 29,
  },
];

export const systemHealth = [
  {
    label: "API Server",
    value: 99.9,
    status: "Operational",
  },
  {
    label: "Database",
    value: 98.7,
    status: "Operational",
  },
  {
    label: "AI Services",
    value: 99.2,
    status: "Operational",
  },
];