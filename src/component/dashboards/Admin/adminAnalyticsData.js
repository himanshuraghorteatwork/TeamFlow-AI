// src/component/AdminAnalytics/adminAnalyticsData.js

export const analyticsSummary = {
  totalUsers: 1248,
  totalWorkspaces: 186,
  totalProjects: 542,
  totalTasks: 3421,
  monthlyRevenue: 24820,
  activeUsers: 892,
};

export const growthData = {
  "7 Days": [
    { label: "Oct 17", users: 620, active: 410 },
    { label: "Oct 18", users: 680, active: 440 },
    { label: "Oct 19", users: 710, active: 470 },
    { label: "Oct 20", users: 760, active: 510 },
    { label: "Oct 21", users: 810, active: 540 },
    { label: "Oct 22", users: 850, active: 580 },
    { label: "Oct 23", users: 910, active: 640 },
  ],

  "30 Days": [
    { label: "Oct 1", users: 580, active: 350 },
    { label: "Oct 5", users: 690, active: 410 },
    { label: "Oct 9", users: 730, active: 430 },
    { label: "Oct 13", users: 820, active: 500 },
    { label: "Oct 17", users: 880, active: 530 },
    { label: "Oct 21", users: 950, active: 610 },
    { label: "Oct 25", users: 1080, active: 690 },
    { label: "Oct 30", users: 1248, active: 892 },
  ],

  "90 Days": [
    { label: "Aug", users: 510, active: 310 },
    { label: "Aug 15", users: 590, active: 350 },
    { label: "Sep", users: 720, active: 430 },
    { label: "Sep 15", users: 810, active: 510 },
    { label: "Oct", users: 980, active: 640 },
    { label: "Oct 23", users: 1248, active: 892 },
  ],
};

export const revenueData = [
  { month: "May", revenue: 12400 },
  { month: "Jun", revenue: 14800 },
  { month: "Jul", revenue: 16200 },
  { month: "Aug", revenue: 18700 },
  { month: "Sep", revenue: 21500 },
  { month: "Oct", revenue: 24820 },
];

export const workspaceDistribution = [
  { name: "Development", value: 64 },
  { name: "Marketing", value: 42 },
  { name: "Design", value: 28 },
  { name: "Research", value: 24 },
  { name: "Sales", value: 18 },
  { name: "Others", value: 10 },
];

export const planDistribution = [
  { name: "Free", value: 42 },
  { name: "Pro", value: 68 },
  { name: "Business", value: 51 },
  { name: "Enterprise", value: 25 },
];

export const activityData = [
  { day: "Mon", created: 45, updated: 32, completed: 22 },
  { day: "Tue", created: 68, updated: 49, completed: 34 },
  { day: "Wed", created: 42, updated: 31, completed: 25 },
  { day: "Thu", created: 56, updated: 41, completed: 29 },
  { day: "Fri", created: 39, updated: 28, completed: 20 },
  { day: "Sat", created: 44, updated: 33, completed: 26 },
  { day: "Sun", created: 59, updated: 46, completed: 31 },
];

export const topWorkspaces = [
  {
    id: 1,
    name: "TeamFlow Workspace",
    owner: "John Doe",
    members: 24,
    projects: 12,
    tasks: 186,
    storage: 72,
    plan: "Enterprise",
    growth: 18.4,
  },
  {
    id: 2,
    name: "Development Hub",
    owner: "David Lee",
    members: 32,
    projects: 18,
    tasks: 242,
    storage: 64,
    plan: "Enterprise",
    growth: 16.8,
  },
  {
    id: 3,
    name: "Marketing Team",
    owner: "Sarah Chen",
    members: 12,
    projects: 8,
    tasks: 128,
    storage: 48,
    plan: "Business",
    growth: 14.2,
  },
  {
    id: 4,
    name: "Design Studio",
    owner: "Emily Parker",
    members: 8,
    projects: 6,
    tasks: 92,
    storage: 34,
    plan: "Pro",
    growth: 11.7,
  },
  {
    id: 5,
    name: "Research Lab",
    owner: "Michael Brown",
    members: 16,
    projects: 9,
    tasks: 105,
    storage: 55,
    plan: "Business",
    growth: 9.5,
  },
];

export const systemMetrics = [
  {
    name: "API Success Rate",
    value: 99.9,
  },
  {
    name: "Database Health",
    value: 98.7,
  },
  {
    name: "AI Service",
    value: 97.8,
  },
  {
    name: "Storage Service",
    value: 99.2,
  },
];