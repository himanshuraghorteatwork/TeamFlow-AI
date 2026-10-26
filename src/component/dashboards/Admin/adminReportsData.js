// src/component/AdminReports/adminReportsData.js

export const reportTypes = [
  "User Report",
  "Workspace Report",
  "Project Report",
  "Task Report",
  "Revenue Report",
  "Subscription Report",
  "AI Usage Report",
  "System Activity Report",
];

export const initialReports = [
  {
    id: "REP-1001",
    name: "Monthly User Growth Report",
    type: "User Report",
    period: "Oct 01, 2026 - Oct 23, 2026",
    createdBy: "Amit Sharma",
    createdAt: "Oct 23, 2026",
    status: "Ready",
    format: "CSV",
    size: "1.2 MB",
    records: 1248,
  },
  {
    id: "REP-1002",
    name: "Workspace Performance Report",
    type: "Workspace Report",
    period: "Oct 01, 2026 - Oct 23, 2026",
    createdBy: "Amit Sharma",
    createdAt: "Oct 22, 2026",
    status: "Ready",
    format: "CSV",
    size: "840 KB",
    records: 186,
  },
  {
    id: "REP-1003",
    name: "Monthly Revenue Report",
    type: "Revenue Report",
    period: "Oct 01, 2026 - Oct 23, 2026",
    createdBy: "Amit Sharma",
    createdAt: "Oct 21, 2026",
    status: "Ready",
    format: "CSV",
    size: "620 KB",
    records: 428,
  },
  {
    id: "REP-1004",
    name: "Project Activity Report",
    type: "Project Report",
    period: "Sep 01, 2026 - Sep 30, 2026",
    createdBy: "Amit Sharma",
    createdAt: "Oct 02, 2026",
    status: "Ready",
    format: "CSV",
    size: "2.1 MB",
    records: 542,
  },
  {
    id: "REP-1005",
    name: "Task Completion Report",
    type: "Task Report",
    period: "Sep 01, 2026 - Sep 30, 2026",
    createdBy: "Admin",
    createdAt: "Oct 01, 2026",
    status: "Ready",
    format: "CSV",
    size: "3.4 MB",
    records: 3421,
  },
  {
    id: "REP-1006",
    name: "AI Usage Analysis",
    type: "AI Usage Report",
    period: "Sep 01, 2026 - Sep 30, 2026",
    createdBy: "Admin",
    createdAt: "Sep 30, 2026",
    status: "Ready",
    format: "CSV",
    size: "980 KB",
    records: 2180,
  },
];

export const reportSummary = {
  totalUsers: 1248,
  activeUsers: 892,
  workspaces: 186,
  projects: 542,
  tasks: 3421,
  completedTasks: 2184,
  revenue: 24820,
  subscriptions: 144,
  aiRequests: 12480,
};

export const reportTemplates = [
  {
    id: 1,
    title: "User Growth",
    description:
      "User registrations, active users and engagement statistics.",
    type: "User Report",
  },
  {
    id: 2,
    title: "Workspace Performance",
    description:
      "Workspace growth, members, projects and activity.",
    type: "Workspace Report",
  },
  {
    id: 3,
    title: "Revenue Summary",
    description:
      "Revenue, subscriptions and billing performance.",
    type: "Revenue Report",
  },
  {
    id: 4,
    title: "Project Activity",
    description:
      "Project creation, progress and completion statistics.",
    type: "Project Report",
  },
];