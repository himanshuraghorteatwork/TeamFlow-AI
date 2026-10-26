import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  CalendarDays,
  Users,
  Building2,
  FolderKanban,
  ListChecks,
  TrendingUp,
  ArrowRight,
  Check,
  ChevronDown,
  Sparkles,
  MessageSquare,
  Lightbulb,
  FileText,
  Layers,
  Plus,
  Download,
  Activity,
  CheckCircle2,
  Zap,
  BarChart3,
  PieChart,
  SlidersHorizontal,
  Filter,
  ArrowUpDown,
  X,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminDashboard.css";

/* =========================================================
   TIMEFRAME DATA MATRIX
   Dynamic data that responds to user selection
========================================================= */

const TIMEFRAME_DATA = {
  "This Month": {
    label: "Oct 1, 2024 - Oct 31, 2024",
    stats: {
      users: 48,
      usersTrend: "↑ 12%",
      usersSub: "+ 5 this month",
      workspaces: 6,
      workspacesTrend: "↑ 20%",
      workspacesSub: "+ 1 this month",
      projects: 12,
      projectsTrend: "↑ 9%",
      projectsSub: "+ 1 this month",
      tasks: 248,
      tasksTrend: "↑ 15%",
      tasksSub: "+ 32 this month",
    },
    taskStatus: {
      total: 248,
      completed: 120,
      completedPct: 48,
      inProgress: 68,
      inProgressPct: 27,
      todo: 45,
      todoPct: 18,
      overdue: 15,
      overduePct: 6,
    },
    projects: [
      {
        id: 1,
        name: "TeamFlow Website",
        progress: 85,
        status: "On Track",
        dueDate: "Oct 25, 2024",
        team: [
          { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" },
          { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" },
          { name: "Sneha Gupta", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 3,
        color: "#10b981",
      },
      {
        id: 2,
        name: "Mobile App",
        progress: 62,
        status: "In Progress",
        dueDate: "Nov 10, 2024",
        team: [
          { name: "Abhishek Verma", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces" },
          { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" },
          { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 5,
        color: "#3b82f6",
      },
      {
        id: 3,
        name: "AI Integration",
        progress: 40,
        status: "At Risk",
        dueDate: "Nov 18, 2024",
        team: [
          { name: "David Lee", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" },
          { name: "Sneha Gupta", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 4,
        color: "#f59e0b",
      },
      {
        id: 4,
        name: "Marketing Portal",
        progress: 25,
        status: "Delayed",
        dueDate: "Dec 05, 2024",
        team: [
          { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces" },
          { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 2,
        color: "#ef4444",
      },
    ],
    tasks: [
      { id: 1, title: "Review UI design", project: "TeamFlow Website", priority: "High", dueDisplay: "Today", completed: false },
      { id: 2, title: "API integration testing", project: "Mobile App", priority: "Medium", dueDisplay: "Tomorrow", completed: false },
      { id: 3, title: "Update project documentation", project: "AI Integration", priority: "Low", dueDisplay: "Oct 26", completed: false },
      { id: 4, title: "Team meeting preparation", project: "Internal", priority: "Medium", dueDisplay: "Oct 28", completed: false },
    ],
    activities: [
      { id: 1, time: "10:42 AM", user: "Priya Patel", role: "Team Lead", avatarColor: "#3b82f6", letter: "P", action: "Created a project", details: "TeamFlow Website" },
      { id: 2, time: "10:20 AM", user: "Rahul Sharma", role: "Developer", avatarColor: "#6366f1", letter: "R", action: "Invited a user", details: "sneha@abc.com" },
      { id: 3, time: "09:55 AM", user: "Sneha Gupta", role: "Designer", avatarColor: "#f97316", letter: "S", action: "Updated task status", details: "UI Design - In Progress" },
      { id: 4, time: "09:32 AM", user: "Abhishek Verma", role: "Developer", avatarColor: "#06b6d4", letter: "A", action: "Added a comment", details: "API integration issue" },
      { id: 5, time: "09:10 AM", user: "Priya Patel", role: "Team Lead", avatarColor: "#3b82f6", letter: "P", action: "Created a workspace", details: "Development Team" },
    ],
    aiUsage: {
      totalRequests: "12,480",
      growth: "↑ 18%",
      monthly: [
        { month: "Jan", height: 18 },
        { month: "Feb", height: 26 },
        { month: "Mar", height: 35 },
        { month: "Apr", height: 44 },
        { month: "May", height: 52 },
        { month: "Jun", height: 60 },
        { month: "Jul", height: 68 },
        { month: "Aug", height: 78 },
        { month: "Sep", height: 88 },
        { month: "Oct", height: 98 },
      ],
      features: [
        { id: 1, name: "Chat Assistant", percentage: 42, color: "#f97316", icon: "chat" },
        { id: 2, name: "Task Suggestions", percentage: 24, color: "#3b82f6", icon: "task" },
        { id: 3, name: "Content Generation", percentage: 18, color: "#10b981", icon: "content" },
        { id: 4, name: "Summaries", percentage: 10, color: "#f59e0b", icon: "summary" },
        { id: 5, name: "Other", percentage: 6, color: "#8b5cf6", icon: "other" },
      ],
    },
  },

  "Today": {
    label: "Today (Oct 26, 2024)",
    stats: {
      users: 48,
      usersTrend: "↑ 6%",
      usersSub: "18 active members",
      workspaces: 6,
      workspacesTrend: "↑ 10%",
      workspacesSub: "4 units active",
      projects: 8,
      projectsTrend: "↑ 4%",
      projectsSub: "3 sprints updated",
      tasks: 18,
      tasksTrend: "↑ 18%",
      tasksSub: "+ 10 closed today",
    },
    taskStatus: {
      total: 18,
      completed: 10,
      completedPct: 56,
      inProgress: 5,
      inProgressPct: 28,
      todo: 3,
      todoPct: 16,
      overdue: 0,
      overduePct: 0,
    },
    projects: [
      {
        id: 1,
        name: "TeamFlow Website",
        progress: 88,
        status: "On Track",
        dueDate: "Today 6:00 PM",
        team: [
          { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" },
          { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 3,
        color: "#10b981",
      },
      {
        id: 2,
        name: "Mobile App",
        progress: 64,
        status: "In Progress",
        dueDate: "Today 8:00 PM",
        team: [
          { name: "Abhishek Verma", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces" },
          { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 4,
        color: "#3b82f6",
      },
      {
        id: 3,
        name: "AI Integration",
        progress: 42,
        status: "At Risk",
        dueDate: "Review Due",
        team: [
          { name: "David Lee", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 3,
        color: "#f59e0b",
      },
      {
        id: 4,
        name: "Marketing Portal",
        progress: 25,
        status: "Delayed",
        dueDate: "Pending Assets",
        team: [
          { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 2,
        color: "#ef4444",
      },
    ],
    tasks: [
      { id: 1, title: "Review UI design", project: "TeamFlow Website", priority: "High", dueDisplay: "Today", completed: true },
      { id: 2, title: "API integration testing", project: "Mobile App", priority: "Medium", dueDisplay: "Today", completed: false },
      { id: 3, title: "Deploy staging build", project: "Mobile App", priority: "High", dueDisplay: "Today", completed: true },
      { id: 4, title: "Team sync standup", project: "Internal", priority: "Low", dueDisplay: "Today", completed: true },
    ],
    activities: [
      { id: 1, time: "10:42 AM", user: "Priya Patel", role: "Team Lead", avatarColor: "#3b82f6", letter: "P", action: "Created a project", details: "TeamFlow Website" },
      { id: 2, time: "10:20 AM", user: "Rahul Sharma", role: "Developer", avatarColor: "#6366f1", letter: "R", action: "Invited a user", details: "sneha@abc.com" },
      { id: 3, time: "09:55 AM", user: "Sneha Gupta", role: "Designer", avatarColor: "#f97316", letter: "S", action: "Updated task status", details: "UI Design - In Progress" },
      { id: 4, time: "09:32 AM", user: "Abhishek Verma", role: "Developer", avatarColor: "#06b6d4", letter: "A", action: "Added a comment", details: "API integration issue" },
      { id: 5, time: "09:10 AM", user: "Priya Patel", role: "Team Lead", avatarColor: "#3b82f6", letter: "P", action: "Created a workspace", details: "Development Team" },
    ],
    aiUsage: {
      totalRequests: "620",
      growth: "↑ 8%",
      monthly: [
        { month: "8 AM", height: 20 },
        { month: "9 AM", height: 35 },
        { month: "10 AM", height: 60 },
        { month: "11 AM", height: 80 },
        { month: "12 PM", height: 50 },
        { month: "1 PM", height: 45 },
        { month: "2 PM", height: 75 },
        { month: "3 PM", height: 90 },
        { month: "4 PM", height: 85 },
        { month: "Now", height: 100 },
      ],
      features: [
        { id: 1, name: "Chat Assistant", percentage: 48, color: "#f97316", icon: "chat" },
        { id: 2, name: "Task Suggestions", percentage: 22, color: "#3b82f6", icon: "task" },
        { id: 3, name: "Content Generation", percentage: 16, color: "#10b981", icon: "content" },
        { id: 4, name: "Summaries", percentage: 10, color: "#f59e0b", icon: "summary" },
        { id: 5, name: "Other", percentage: 4, color: "#8b5cf6", icon: "other" },
      ],
    },
  },

  "Yesterday": {
    label: "Yesterday (Oct 25, 2024)",
    stats: {
      users: 48,
      usersTrend: "↑ 5%",
      usersSub: "16 active sessions",
      workspaces: 6,
      workspacesTrend: "↑ 8%",
      workspacesSub: "4 units active",
      projects: 8,
      projectsTrend: "↑ 5%",
      projectsSub: "2 milestones closed",
      tasks: 24,
      tasksTrend: "↑ 20%",
      tasksSub: "+ 16 completed",
    },
    taskStatus: {
      total: 24,
      completed: 16,
      completedPct: 67,
      inProgress: 5,
      inProgressPct: 21,
      todo: 3,
      todoPct: 12,
      overdue: 0,
      overduePct: 0,
    },
    projects: [
      {
        id: 1,
        name: "TeamFlow Website",
        progress: 85,
        status: "On Track",
        dueDate: "Oct 25, 2024",
        team: [
          { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" },
          { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 3,
        color: "#10b981",
      },
      {
        id: 2,
        name: "Mobile App",
        progress: 60,
        status: "In Progress",
        dueDate: "Nov 10, 2024",
        team: [
          { name: "Abhishek Verma", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces" },
          { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 4,
        color: "#3b82f6",
      },
      {
        id: 3,
        name: "AI Integration",
        progress: 38,
        status: "At Risk",
        dueDate: "Nov 18, 2024",
        team: [
          { name: "David Lee", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 3,
        color: "#f59e0b",
      },
      {
        id: 4,
        name: "Marketing Portal",
        progress: 24,
        status: "Delayed",
        dueDate: "Dec 05, 2024",
        team: [
          { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 2,
        color: "#ef4444",
      },
    ],
    tasks: [
      { id: 1, title: "Auth token refresh", project: "Backend API", priority: "High", dueDisplay: "Yesterday", completed: true },
      { id: 2, title: "Component library review", project: "TeamFlow Website", priority: "Medium", dueDisplay: "Yesterday", completed: true },
      { id: 3, title: "Staging database migration", project: "Backend API", priority: "High", dueDisplay: "Yesterday", completed: true },
      { id: 4, title: "Sprint retrospectives", project: "Internal", priority: "Low", dueDisplay: "Yesterday", completed: true },
    ],
    activities: [
      { id: 1, time: "Yesterday 5:15 PM", user: "Rahul Sharma", role: "Developer", avatarColor: "#6366f1", letter: "R", action: "Merged PR #142", details: "Fix WebSocket reconnects" },
      { id: 2, time: "Yesterday 3:40 PM", user: "Priya Patel", role: "Team Lead", avatarColor: "#3b82f6", letter: "P", action: "Approved release", details: "v2.4.0-rc1" },
      { id: 3, time: "Yesterday 2:10 PM", user: "Sneha Gupta", role: "Designer", avatarColor: "#f97316", letter: "S", action: "Uploaded assets", details: "Figma SaaS Design Kit" },
      { id: 4, time: "Yesterday 11:30 AM", user: "Abhishek Verma", role: "Developer", avatarColor: "#06b6d4", letter: "A", action: "Closed issue", details: "Ticket #409 resolved" },
      { id: 5, time: "Yesterday 9:00 AM", user: "Priya Patel", role: "Team Lead", avatarColor: "#3b82f6", letter: "P", action: "Sprint kickoff", details: "Sprint 42 Plan" },
    ],
    aiUsage: {
      totalRequests: "840",
      growth: "↑ 12%",
      monthly: [
        { month: "8 AM", height: 18 },
        { month: "10 AM", height: 42 },
        { month: "12 PM", height: 68 },
        { month: "2 PM", height: 85 },
        { month: "4 PM", height: 80 },
        { month: "6 PM", height: 62 },
        { month: "8 PM", height: 48 },
        { month: "10 PM", height: 32 },
        { month: "11 PM", height: 22 },
        { month: "Close", height: 15 },
      ],
      features: [
        { id: 1, name: "Chat Assistant", percentage: 44, color: "#f97316", icon: "chat" },
        { id: 2, name: "Task Suggestions", percentage: 26, color: "#3b82f6", icon: "task" },
        { id: 3, name: "Content Generation", percentage: 15, color: "#10b981", icon: "content" },
        { id: 4, name: "Summaries", percentage: 10, color: "#f59e0b", icon: "summary" },
        { id: 5, name: "Other", percentage: 5, color: "#8b5cf6", icon: "other" },
      ],
    },
  },

  "7 Days": {
    label: "Last 7 Days (Oct 20 - Oct 26, 2024)",
    stats: {
      users: 48,
      usersTrend: "↑ 10%",
      usersSub: "+ 2 new members",
      workspaces: 6,
      workspacesTrend: "↑ 15%",
      workspacesSub: "6 active units",
      projects: 10,
      projectsTrend: "↑ 8%",
      projectsSub: "+ 1 this week",
      tasks: 72,
      tasksTrend: "↑ 14%",
      tasksSub: "+ 38 closed this week",
    },
    taskStatus: {
      total: 72,
      completed: 38,
      completedPct: 53,
      inProgress: 20,
      inProgressPct: 28,
      todo: 11,
      todoPct: 15,
      overdue: 3,
      overduePct: 4,
    },
    projects: [
      {
        id: 1,
        name: "TeamFlow Website",
        progress: 85,
        status: "On Track",
        dueDate: "Oct 25, 2024",
        team: [
          { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" },
          { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 3,
        color: "#10b981",
      },
      {
        id: 2,
        name: "Mobile App",
        progress: 62,
        status: "In Progress",
        dueDate: "Nov 10, 2024",
        team: [
          { name: "Abhishek Verma", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces" },
          { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 5,
        color: "#3b82f6",
      },
      {
        id: 3,
        name: "AI Integration",
        progress: 40,
        status: "At Risk",
        dueDate: "Nov 18, 2024",
        team: [
          { name: "David Lee", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 4,
        color: "#f59e0b",
      },
      {
        id: 4,
        name: "Marketing Portal",
        progress: 25,
        status: "Delayed",
        dueDate: "Dec 05, 2024",
        team: [
          { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 2,
        color: "#ef4444",
      },
    ],
    tasks: [
      { id: 1, title: "Review UI design", project: "TeamFlow Website", priority: "High", dueDisplay: "Today", completed: false },
      { id: 2, title: "API integration testing", project: "Mobile App", priority: "Medium", dueDisplay: "Tomorrow", completed: false },
      { id: 3, title: "Update project documentation", project: "AI Integration", priority: "Low", dueDisplay: "Oct 26", completed: false },
      { id: 4, title: "Team meeting preparation", project: "Internal", priority: "Medium", dueDisplay: "Oct 28", completed: false },
    ],
    activities: [
      { id: 1, time: "Oct 26", user: "Priya Patel", role: "Team Lead", avatarColor: "#3b82f6", letter: "P", action: "Created a project", details: "TeamFlow Website" },
      { id: 2, time: "Oct 25", user: "Rahul Sharma", role: "Developer", avatarColor: "#6366f1", letter: "R", action: "Invited a user", details: "sneha@abc.com" },
      { id: 3, time: "Oct 24", user: "Sneha Gupta", role: "Designer", avatarColor: "#f97316", letter: "S", action: "Updated task status", details: "UI Design - In Progress" },
      { id: 4, time: "Oct 23", user: "Abhishek Verma", role: "Developer", avatarColor: "#06b6d4", letter: "A", action: "Added a comment", details: "API integration issue" },
      { id: 5, time: "Oct 22", user: "Priya Patel", role: "Team Lead", avatarColor: "#3b82f6", letter: "P", action: "Created a workspace", details: "Development Team" },
    ],
    aiUsage: {
      totalRequests: "4,150",
      growth: "↑ 14%",
      monthly: [
        { month: "Mon", height: 38 },
        { month: "Tue", height: 52 },
        { month: "Wed", height: 65 },
        { month: "Thu", height: 80 },
        { month: "Fri", height: 92 },
        { month: "Sat", height: 42 },
        { month: "Sun", height: 58 },
        { month: "Mon", height: 74 },
        { month: "Tue", height: 88 },
        { month: "Today", height: 100 },
      ],
      features: [
        { id: 1, name: "Chat Assistant", percentage: 45, color: "#f97316", icon: "chat" },
        { id: 2, name: "Task Suggestions", percentage: 25, color: "#3b82f6", icon: "task" },
        { id: 3, name: "Content Generation", percentage: 17, color: "#10b981", icon: "content" },
        { id: 4, name: "Summaries", percentage: 9, color: "#f59e0b", icon: "summary" },
        { id: 5, name: "Other", percentage: 4, color: "#8b5cf6", icon: "other" },
      ],
    },
  },

  "Last Month": {
    label: "Last Month (Sep 1 - Sep 30, 2024)",
    stats: {
      users: 43,
      usersTrend: "↑ 10%",
      usersSub: "+ 4 in September",
      workspaces: 5,
      workspacesTrend: "↑ 15%",
      workspacesSub: "+ 1 in September",
      projects: 11,
      projectsTrend: "↑ 8%",
      projectsSub: "+ 2 in September",
      tasks: 216,
      tasksTrend: "↑ 12%",
      tasksSub: "+ 28 in September",
    },
    taskStatus: {
      total: 216,
      completed: 112,
      completedPct: 52,
      inProgress: 58,
      inProgressPct: 27,
      todo: 36,
      todoPct: 17,
      overdue: 10,
      overduePct: 4,
    },
    projects: [
      {
        id: 1,
        name: "TeamFlow Website",
        progress: 65,
        status: "In Progress",
        dueDate: "Sep 30, 2024",
        team: [
          { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" },
          { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 3,
        color: "#10b981",
      },
      {
        id: 2,
        name: "Mobile App",
        progress: 45,
        status: "In Progress",
        dueDate: "Oct 15, 2024",
        team: [
          { name: "Abhishek Verma", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 3,
        color: "#3b82f6",
      },
      {
        id: 3,
        name: "AI Integration",
        progress: 20,
        status: "At Risk",
        dueDate: "Oct 30, 2024",
        team: [
          { name: "David Lee", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 2,
        color: "#f59e0b",
      },
      {
        id: 4,
        name: "Marketing Portal",
        progress: 10,
        status: "On Track",
        dueDate: "Nov 15, 2024",
        team: [
          { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 2,
        color: "#ef4444",
      },
    ],
    tasks: [
      { id: 1, title: "Database schema migration", project: "Backend API", priority: "High", dueDisplay: "Sep 28", completed: true },
      { id: 2, title: "OAuth 2.0 implementation", project: "Backend API", priority: "Critical", dueDisplay: "Sep 25", completed: true },
      { id: 3, title: "Figma wireframe design", project: "TeamFlow Website", priority: "Medium", dueDisplay: "Sep 22", completed: true },
      { id: 4, title: "Quarterly planning sync", project: "Internal", priority: "Low", dueDisplay: "Sep 20", completed: true },
    ],
    activities: [
      { id: 1, time: "Sep 30", user: "Priya Patel", role: "Team Lead", avatarColor: "#3b82f6", letter: "P", action: "Closed milestone", details: "Sprint 40 Release" },
      { id: 2, time: "Sep 28", user: "Rahul Sharma", role: "Developer", avatarColor: "#6366f1", letter: "R", action: "Completed task", details: "Database migration" },
      { id: 3, time: "Sep 24", user: "Sneha Gupta", role: "Designer", avatarColor: "#f97316", letter: "S", action: "Published component", details: "SaaS Design System" },
      { id: 4, time: "Sep 20", user: "Abhishek Verma", role: "Developer", avatarColor: "#06b6d4", letter: "A", action: "Created repository", details: "teamflow-core-api" },
      { id: 5, time: "Sep 15", user: "Priya Patel", role: "Team Lead", avatarColor: "#3b82f6", letter: "P", action: "Created a workspace", details: "Research Lab" },
    ],
    aiUsage: {
      totalRequests: "10,240",
      growth: "↑ 15%",
      monthly: [
        { month: "W1", height: 32 },
        { month: "W2", height: 48 },
        { month: "W3", height: 68 },
        { month: "W4", height: 82 },
        { month: "Sep 10", height: 58 },
        { month: "Sep 15", height: 72 },
        { month: "Sep 20", height: 88 },
        { month: "Sep 25", height: 82 },
        { month: "Sep 28", height: 92 },
        { month: "Sep 30", height: 98 },
      ],
      features: [
        { id: 1, name: "Chat Assistant", percentage: 40, color: "#f97316", icon: "chat" },
        { id: 2, name: "Task Suggestions", percentage: 25, color: "#3b82f6", icon: "task" },
        { id: 3, name: "Content Generation", percentage: 18, color: "#10b981", icon: "content" },
        { id: 4, name: "Summaries", percentage: 11, color: "#f59e0b", icon: "summary" },
        { id: 5, name: "Other", percentage: 6, color: "#8b5cf6", icon: "other" },
      ],
    },
  },

  "All Time": {
    label: "All Time (Complete History)",
    stats: {
      users: 54,
      usersTrend: "↑ 28%",
      usersSub: "Total registered",
      workspaces: 6,
      workspacesTrend: "↑ 20%",
      workspacesSub: "Active organizations",
      projects: 16,
      projectsTrend: "↑ 33%",
      projectsSub: "Lifetime projects",
      tasks: 480,
      tasksTrend: "↑ 45%",
      tasksSub: "+ 285 tasks completed",
    },
    taskStatus: {
      total: 480,
      completed: 285,
      completedPct: 59,
      inProgress: 115,
      inProgressPct: 24,
      todo: 62,
      todoPct: 13,
      overdue: 18,
      overduePct: 4,
    },
    projects: [
      {
        id: 1,
        name: "TeamFlow Website",
        progress: 100,
        status: "On Track",
        dueDate: "Completed",
        team: [
          { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" },
          { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 3,
        color: "#10b981",
      },
      {
        id: 2,
        name: "Mobile App",
        progress: 75,
        status: "In Progress",
        dueDate: "Nov 10, 2024",
        team: [
          { name: "Abhishek Verma", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 5,
        color: "#3b82f6",
      },
      {
        id: 3,
        name: "AI Integration",
        progress: 55,
        status: "At Risk",
        dueDate: "Nov 18, 2024",
        team: [
          { name: "David Lee", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 4,
        color: "#f59e0b",
      },
      {
        id: 4,
        name: "Marketing Portal",
        progress: 40,
        status: "Delayed",
        dueDate: "Dec 05, 2024",
        team: [
          { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces" },
        ],
        extraTeamCount: 2,
        color: "#ef4444",
      },
    ],
    tasks: [
      { id: 1, title: "Review UI design", project: "TeamFlow Website", priority: "High", dueDisplay: "Today", completed: false },
      { id: 2, title: "API integration testing", project: "Mobile App", priority: "Medium", dueDisplay: "Tomorrow", completed: false },
      { id: 3, title: "Update project documentation", project: "AI Integration", priority: "Low", dueDisplay: "Oct 26", completed: false },
      { id: 4, title: "Team meeting preparation", project: "Internal", priority: "Medium", dueDisplay: "Oct 28", completed: false },
    ],
    activities: [
      { id: 1, time: "Oct 26", user: "Priya Patel", role: "Team Lead", avatarColor: "#3b82f6", letter: "P", action: "Created a project", details: "TeamFlow Website" },
      { id: 2, time: "Oct 25", user: "Rahul Sharma", role: "Developer", avatarColor: "#6366f1", letter: "R", action: "Invited a user", details: "sneha@abc.com" },
      { id: 3, time: "Oct 20", user: "Sneha Gupta", role: "Designer", avatarColor: "#f97316", letter: "S", action: "Updated task status", details: "UI Design - In Progress" },
      { id: 4, time: "Oct 15", user: "Abhishek Verma", role: "Developer", avatarColor: "#06b6d4", letter: "A", action: "Added a comment", details: "API integration issue" },
      { id: 5, time: "Oct 01", user: "Priya Patel", role: "Team Lead", avatarColor: "#3b82f6", letter: "P", action: "Created a workspace", details: "Development Team" },
    ],
    aiUsage: {
      totalRequests: "48,920",
      growth: "↑ 32%",
      monthly: [
        { month: "Q1", height: 25 },
        { month: "Q2", height: 45 },
        { month: "Q3", height: 65 },
        { month: "Q4", height: 85 },
        { month: "Jul", height: 60 },
        { month: "Aug", height: 75 },
        { month: "Sep", height: 90 },
        { month: "Oct", height: 98 },
        { month: "Nov", height: 80 },
        { month: "Peak", height: 100 },
      ],
      features: [
        { id: 1, name: "Chat Assistant", percentage: 46, color: "#f97316", icon: "chat" },
        { id: 2, name: "Task Suggestions", percentage: 24, color: "#3b82f6", icon: "task" },
        { id: 3, name: "Content Generation", percentage: 17, color: "#10b981", icon: "content" },
        { id: 4, name: "Summaries", percentage: 9, color: "#f59e0b", icon: "summary" },
        { id: 5, name: "Other", percentage: 4, color: "#8b5cf6", icon: "other" },
      ],
    },
  },
};

const TEAM_MEMBERS_DATA = [
  { id: 1, name: "Priya Patel", role: "Team Lead", status: "Online", color: "#3b82f6", letter: "P" },
  { id: 2, name: "Rahul Sharma", role: "Developer", status: "Online", color: "#6366f1", letter: "R" },
  { id: 3, name: "Sneha Gupta", role: "Designer", status: "In a meeting", color: "#f97316", letter: "S" },
  { id: 4, name: "Abhishek Verma", role: "Developer", status: "Offline", color: "#06b6d4", letter: "A" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("This Month");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [customDateModalOpen, setCustomDateModalOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("2024-10-01");
  const [customEndDate, setCustomEndDate] = useState("2024-10-31");
  const [toast, setToast] = useState(null);

  // INDEPENDENT GRAPH / SECTION FILTERS
  const [taskDateFilter, setTaskDateFilter] = useState("This Month");
  const [taskChartType, setTaskChartType] = useState("donut"); // 'donut' | 'bars' | 'list'
  
  const [projectProgressFilter, setProjectProgressFilter] = useState("all");
  const [projectProgressSort, setProjectProgressSort] = useState("highest"); // 'highest' | 'lowest' | 'name'

  const [recentProjectsFilter, setRecentProjectsFilter] = useState("all");
  const [recentProjectsSort, setRecentProjectsSort] = useState("recent");

  const [activityFilter, setActivityFilter] = useState("all");
  const [activitySort, setActivitySort] = useState("newest");

  const [aiDateFilter, setAiDateFilter] = useState("This Month");
  const [aiChartType, setAiChartType] = useState("bar"); // 'bar' | 'distribution' | 'summary'

  // Timeframe presets for the header dropdown
  const DATE_PRESETS = [
    { id: "This Month", label: "Oct 1, 2024 - Oct 31, 2024" },
    { id: "Today", label: "Today (Oct 26, 2024)" },
    { id: "Yesterday", label: "Yesterday (Oct 25, 2024)" },
    { id: "7 Days", label: "Last 7 Days (Oct 20 - Oct 26, 2024)" },
    { id: "Last Month", label: "Last Month (Sep 1 - Sep 30, 2024)" },
    { id: "All Time", label: "All Time (Complete History)" },
  ];

  // Active global dataset derived from selected dateFilter
  const activeDataset = useMemo(() => {
    return TIMEFRAME_DATA[dateFilter] || TIMEFRAME_DATA["This Month"];
  }, [dateFilter]);

  // Task Status Overview independent dataset
  const taskStatusDataset = useMemo(() => {
    return TIMEFRAME_DATA[taskDateFilter] || activeDataset;
  }, [taskDateFilter, activeDataset]);

  // AI Usage independent dataset
  const aiDataset = useMemo(() => {
    return TIMEFRAME_DATA[aiDateFilter] || activeDataset;
  }, [aiDateFilter, activeDataset]);

  // Tasks state that allows interactive checking per timeframe
  const [tasksState, setTasksState] = useState(() => activeDataset.tasks);

  // Synchronize tasks when timeframe changes
  useEffect(() => {
    setTasksState(activeDataset.tasks);
  }, [activeDataset]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Toggle tasks interactively
  const toggleTask = (taskId) => {
    setTasksState((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "On Track":
        return <span className="tfAdminDashboard__status tfAdminDashboard__status--on-track">On Track</span>;
      case "In Progress":
        return <span className="tfAdminDashboard__status tfAdminDashboard__status--in-progress">In Progress</span>;
      case "At Risk":
        return <span className="tfAdminDashboard__status tfAdminDashboard__status--at-risk">At Risk</span>;
      case "Delayed":
        return <span className="tfAdminDashboard__status tfAdminDashboard__status--delayed">Delayed</span>;
      default:
        return <span className="tfAdminDashboard__status">{status}</span>;
    }
  };

  // Priority badge helper
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return <span className="tfAdminDashboard__priority tfAdminDashboard__priority--high">● High</span>;
      case "Medium":
        return <span className="tfAdminDashboard__priority tfAdminDashboard__priority--medium">● Medium</span>;
      case "Low":
        return <span className="tfAdminDashboard__priority tfAdminDashboard__priority--low">● Low</span>;
      default:
        return <span className="tfAdminDashboard__priority">● {priority}</span>;
    }
  };

  // Feature icon helper
  const renderFeatureIcon = (type) => {
    switch (type) {
      case "chat":
        return (
          <span className="tfAdminDashboard__featIcon" style={{ background: "#ffedd5", color: "#ea580c" }}>
            <MessageSquare size={13} />
          </span>
        );
      case "task":
        return (
          <span className="tfAdminDashboard__featIcon" style={{ background: "#dbeafe", color: "#2563eb" }}>
            <Lightbulb size={13} />
          </span>
        );
      case "content":
        return (
          <span className="tfAdminDashboard__featIcon" style={{ background: "#dcfce7", color: "#16a34a" }}>
            <FileText size={13} />
          </span>
        );
      case "summary":
        return (
          <span className="tfAdminDashboard__featIcon" style={{ background: "#fef3c7", color: "#d97706" }}>
            <Layers size={13} />
          </span>
        );
      default:
        return (
          <span className="tfAdminDashboard__featIcon" style={{ background: "#ede9fe", color: "#7c3aed" }}>
            <Sparkles size={13} />
          </span>
        );
    }
  };

  /* =========================================================
     DYNAMIC SVG DONUT CALCULATIONS (R = 54, C ~ 339.292)
  ========================================================= */
  const C = 2 * Math.PI * 54;
  const taskStatusCounts = taskStatusDataset.taskStatus;
  const taskTotal = Math.max(1, taskStatusCounts.total);

  const p1 = (taskStatusCounts.completed / taskTotal) * C;
  const p2 = (taskStatusCounts.inProgress / taskTotal) * C;
  const p3 = (taskStatusCounts.todo / taskTotal) * C;
  const p4 = (taskStatusCounts.overdue / taskTotal) * C;

  // Filtered & Sorted Project Progress
  const filteredProgressProjects = useMemo(() => {
    let list = [...activeDataset.projects];
    if (projectProgressFilter !== "all") {
      list = list.filter((p) => p.status.toLowerCase().replace(/\s+/g, "-") === projectProgressFilter);
    }
    list.sort((a, b) => {
      if (projectProgressSort === "highest") return b.progress - a.progress;
      if (projectProgressSort === "lowest") return a.progress - b.progress;
      if (projectProgressSort === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [activeDataset.projects, projectProgressFilter, projectProgressSort]);

  // Filtered & Sorted Recent Projects Table
  const filteredRecentProjects = useMemo(() => {
    let list = [...activeDataset.projects];
    if (recentProjectsFilter !== "all") {
      list = list.filter((p) => p.status.toLowerCase().replace(/\s+/g, "-") === recentProjectsFilter);
    }
    list.sort((a, b) => {
      if (recentProjectsSort === "progress-desc") return b.progress - a.progress;
      if (recentProjectsSort === "progress-asc") return a.progress - b.progress;
      if (recentProjectsSort === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [activeDataset.projects, recentProjectsFilter, recentProjectsSort]);

  // Filtered & Sorted Organization Activities
  const filteredActivities = useMemo(() => {
    let list = [...activeDataset.activities];
    if (activityFilter !== "all") {
      list = list.filter((act) =>
        act.action.toLowerCase().includes(activityFilter.toLowerCase()) ||
        act.details.toLowerCase().includes(activityFilter.toLowerCase())
      );
    }
    if (activitySort === "oldest") {
      return [...list].reverse();
    }
    return list;
  }, [activeDataset.activities, activityFilter, activitySort]);

  return (
    <div className="tfAdminDashboard">
      {/* SIDEBAR */}
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* MAIN CONTAINER */}
      <main className="tfAdminDashboard__main">
        {/* TOPBAR */}
        <AdminTopbar onMobileMenuToggle={() => setSidebarOpen(true)} />

        {/* DASHBOARD CONTENT BODY */}
        <div className="tfAdminDashboard__content">
          {/* ===============================================
              PAGE HEADER: GREETING & DYNAMIC DATE TIMEFRAME
          =============================================== */}
          <section className="tfAdminDashboard__pageHeader">
            <div>
              <h1>Welcome back, Amit! 👋</h1>
              <p>Here's an overview of your organization's activity today.</p>
            </div>

            <div className="tfAdminDashboard__dateWrapper">
              <button
                type="button"
                className="tfAdminDashboard__dateButton"
                onClick={() => setDateDropdownOpen((prev) => !prev)}
                title="Filter dashboard by timeframe"
              >
                <CalendarDays size={16} />
                <span>{activeDataset.label}</span>
                <ChevronDown size={14} className={dateDropdownOpen ? "tf-rotate-180" : ""} />
              </button>

              {dateDropdownOpen && (
                <div className="tfAdminDashboard__dateMenu">
                  <div className="tfAdminDashboard__dateMenuTitle">Select Timeframe</div>
                  {DATE_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`tfAdminDashboard__dateMenuItem ${dateFilter === p.id ? "active" : ""}`}
                      onClick={() => {
                        setDateFilter(p.id);
                        setDateDropdownOpen(false);
                      }}
                    >
                      <Check size={14} className={dateFilter === p.id ? "tf-check-visible" : "tf-check-hidden"} />
                      <span>{p.label}</span>
                    </button>
                  ))}
                  <div className="tfAdminDashboard__dateMenuDivider" />
                  <button
                    type="button"
                    className="tfAdminDashboard__dateMenuItem custom-range-btn"
                    onClick={() => {
                      setDateDropdownOpen(false);
                      setCustomDateModalOpen(true);
                    }}
                  >
                    <SlidersHorizontal size={14} />
                    <span>Custom Date Range...</span>
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* ===============================================
              ROW 1: 4 DYNAMIC KPI CARDS
          =============================================== */}
          <section className="tfAdminDashboard__statsGrid">
            {/* TOTAL USERS */}
            <button
              type="button"
              className="tfAdminDashboard__statCard"
              onClick={() => navigate("/admin/users")}
            >
              <span className="tfAdminDashboard__statIcon tfAdminDashboard__statIcon--purple">
                <Users size={22} />
              </span>
              <div className="tfAdminDashboard__statContent">
                <span>Total Users</span>
                <div>
                  <strong>{activeDataset.stats.users}</strong>
                  <small>
                    <TrendingUp size={11} />
                    {activeDataset.stats.usersTrend}
                  </small>
                </div>
                <p>{activeDataset.stats.usersSub}</p>
              </div>
            </button>

            {/* WORKSPACES */}
            <button
              type="button"
              className="tfAdminDashboard__statCard"
              onClick={() => navigate("/admin/workspaces")}
            >
              <span className="tfAdminDashboard__statIcon tfAdminDashboard__statIcon--blue">
                <Building2 size={22} />
              </span>
              <div className="tfAdminDashboard__statContent">
                <span>Workspaces</span>
                <div>
                  <strong>{activeDataset.stats.workspaces}</strong>
                  <small>
                    <TrendingUp size={11} />
                    {activeDataset.stats.workspacesTrend}
                  </small>
                </div>
                <p>{activeDataset.stats.workspacesSub}</p>
              </div>
            </button>

            {/* PROJECTS */}
            <button
              type="button"
              className="tfAdminDashboard__statCard"
              onClick={() => navigate("/admin/projects")}
            >
              <span className="tfAdminDashboard__statIcon tfAdminDashboard__statIcon--indigo">
                <FolderKanban size={22} />
              </span>
              <div className="tfAdminDashboard__statContent">
                <span>Projects</span>
                <div>
                  <strong>{activeDataset.stats.projects}</strong>
                  <small>
                    <TrendingUp size={11} />
                    {activeDataset.stats.projectsTrend}
                  </small>
                </div>
                <p>{activeDataset.stats.projectsSub}</p>
              </div>
            </button>

            {/* TOTAL TASKS */}
            <button
              type="button"
              className="tfAdminDashboard__statCard"
              onClick={() => navigate("/admin/tasks")}
            >
              <span className="tfAdminDashboard__statIcon tfAdminDashboard__statIcon--green">
                <ListChecks size={22} />
              </span>
              <div className="tfAdminDashboard__statContent">
                <span>Total Tasks</span>
                <div>
                  <strong>{activeDataset.stats.tasks}</strong>
                  <small>
                    <TrendingUp size={11} />
                    {activeDataset.stats.tasksTrend}
                  </small>
                </div>
                <p>{activeDataset.stats.tasksSub}</p>
              </div>
            </button>
          </section>

          {/* ===============================================
              ROW 2: TASK STATUS | PROJECT PROGRESS | TEAM MEMBERS
          =============================================== */}
          <section className="tfAdminDashboard__grid tfAdminDashboard__grid--3">
            {/* 1. DYNAMIC TASK STATUS OVERVIEW */}
            <article className="tfAdminDashboard__card">
              <div className="tfAdminDashboard__cardHeader">
                <div className="tfAdminDashboard__cardHeaderTitle">
                  <h2>Task Status Overview</h2>
                  <span className="tfAdminDashboard__badgeTag">{taskTotal} tasks</span>
                </div>
                <div className="tfAdminDashboard__cardActionsGroup">
                  <select
                    value={taskChartType}
                    onChange={(e) => setTaskChartType(e.target.value)}
                    className="tfAdminDashboard__cardSelect sm"
                    title="Switch chart representation"
                  >
                    <option value="donut">🍩 Donut</option>
                    <option value="bars">📊 Bars</option>
                    <option value="list">📋 List</option>
                  </select>

                  <select
                    value={taskDateFilter}
                    onChange={(e) => setTaskDateFilter(e.target.value)}
                    className="tfAdminDashboard__cardSelect"
                    title="Filter Task Status by date"
                  >
                    <option value="This Month">This Month</option>
                    <option value="Today">Today</option>
                    <option value="Yesterday">Yesterday</option>
                    <option value="7 Days">Last 7 Days</option>
                    <option value="Last Month">Last Month</option>
                    <option value="All Time">All Time</option>
                  </select>
                </div>
              </div>

              {taskChartType === "donut" && (
                <div className="tfAdminDashboard__taskOverview">
                  {/* DYNAMIC SVG DONUT CHART */}
                  <div className="tfAdminDashboard__donutWrapper">
                    <svg className="tfAdminDashboard__donutSvg" viewBox="0 0 150 150">
                      <circle
                        cx="75"
                        cy="75"
                        r="54"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="16"
                      />
                      {/* Overdue (Red) */}
                      {taskStatusCounts.overdue > 0 && (
                        <circle
                          cx="75"
                          cy="75"
                          r="54"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="16"
                          strokeDasharray={`${p4} ${C - p4}`}
                          strokeDashoffset={-(p1 + p2 + p3)}
                          transform="rotate(-90 75 75)"
                        />
                      )}
                      {/* To Do (Amber) */}
                      {taskStatusCounts.todo > 0 && (
                        <circle
                          cx="75"
                          cy="75"
                          r="54"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="16"
                          strokeDasharray={`${p3} ${C - p3}`}
                          strokeDashoffset={-(p1 + p2)}
                          transform="rotate(-90 75 75)"
                        />
                      )}
                      {/* In Progress (Blue) */}
                      {taskStatusCounts.inProgress > 0 && (
                        <circle
                          cx="75"
                          cy="75"
                          r="54"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="16"
                          strokeDasharray={`${p2} ${C - p2}`}
                          strokeDashoffset={-p1}
                          transform="rotate(-90 75 75)"
                        />
                      )}
                      {/* Completed (Green) */}
                      {taskStatusCounts.completed > 0 && (
                        <circle
                          cx="75"
                          cy="75"
                          r="54"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="16"
                          strokeDasharray={`${p1} ${C - p1}`}
                          strokeDashoffset="0"
                          transform="rotate(-90 75 75)"
                        />
                      )}
                    </svg>
                    <div className="tfAdminDashboard__donutCenter">
                      <strong>{taskStatusCounts.total}</strong>
                      <span>Total Tasks</span>
                    </div>
                  </div>

                  {/* DYNAMIC LEGEND TABLE */}
                  <div className="tfAdminDashboard__legend">
                    <div className="tfAdminDashboard__legendRow">
                      <span>
                        <i className="tfAdminDashboard__legendDot tfAdminDashboard__legendDot--completed" />
                        Completed
                      </span>
                      <div className="tfAdminDashboard__legendValues">
                        <strong>{taskStatusCounts.completed}</strong>
                        <span className="tfAdminDashboard__legendPct">{taskStatusCounts.completedPct}%</span>
                      </div>
                    </div>

                    <div className="tfAdminDashboard__legendRow">
                      <span>
                        <i className="tfAdminDashboard__legendDot tfAdminDashboard__legendDot--progress" />
                        In Progress
                      </span>
                      <div className="tfAdminDashboard__legendValues">
                        <strong>{taskStatusCounts.inProgress}</strong>
                        <span className="tfAdminDashboard__legendPct">{taskStatusCounts.inProgressPct}%</span>
                      </div>
                    </div>

                    <div className="tfAdminDashboard__legendRow">
                      <span>
                        <i className="tfAdminDashboard__legendDot tfAdminDashboard__legendDot--todo" />
                        To Do
                      </span>
                      <div className="tfAdminDashboard__legendValues">
                        <strong>{taskStatusCounts.todo}</strong>
                        <span className="tfAdminDashboard__legendPct">{taskStatusCounts.todoPct}%</span>
                      </div>
                    </div>

                    <div className="tfAdminDashboard__legendRow">
                      <span>
                        <i className="tfAdminDashboard__legendDot tfAdminDashboard__legendDot--overdue" />
                        Overdue
                      </span>
                      <div className="tfAdminDashboard__legendValues">
                        <strong>{taskStatusCounts.overdue}</strong>
                        <span className="tfAdminDashboard__legendPct">{taskStatusCounts.overduePct}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {taskChartType === "bars" && (
                <div className="tfAdminDashboard__statusBarsContainer">
                  <div className="status-bar-row">
                    <div className="bar-label-group">
                      <span className="bar-name">Completed</span>
                      <strong className="bar-value text-green">{taskStatusCounts.completed} ({taskStatusCounts.completedPct}%)</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill bg-green" style={{ width: `${taskStatusCounts.completedPct}%` }} />
                    </div>
                  </div>

                  <div className="status-bar-row">
                    <div className="bar-label-group">
                      <span className="bar-name">In Progress</span>
                      <strong className="bar-value text-blue">{taskStatusCounts.inProgress} ({taskStatusCounts.inProgressPct}%)</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill bg-blue" style={{ width: `${taskStatusCounts.inProgressPct}%` }} />
                    </div>
                  </div>

                  <div className="status-bar-row">
                    <div className="bar-label-group">
                      <span className="bar-name">To Do</span>
                      <strong className="bar-value text-amber">{taskStatusCounts.todo} ({taskStatusCounts.todoPct}%)</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill bg-amber" style={{ width: `${taskStatusCounts.todoPct}%` }} />
                    </div>
                  </div>

                  <div className="status-bar-row">
                    <div className="bar-label-group">
                      <span className="bar-name">Overdue</span>
                      <strong className="bar-value text-red">{taskStatusCounts.overdue} ({taskStatusCounts.overduePct}%)</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill bg-red" style={{ width: `${taskStatusCounts.overduePct}%` }} />
                    </div>
                  </div>
                </div>
              )}

              {taskChartType === "list" && (
                <div className="tfAdminDashboard__statusListContainer">
                  <div className="status-list-card green-card">
                    <CheckCircle2 size={16} />
                    <div className="status-list-text">
                      <strong>Completed Tasks</strong>
                      <small>Successfully delivered</small>
                    </div>
                    <span className="status-count-badge green">{taskStatusCounts.completed}</span>
                  </div>

                  <div className="status-list-card blue-card">
                    <Activity size={16} />
                    <div className="status-list-text">
                      <strong>In Progress</strong>
                      <small>Actively worked on</small>
                    </div>
                    <span className="status-count-badge blue">{taskStatusCounts.inProgress}</span>
                  </div>

                  <div className="status-list-card amber-card">
                    <ListChecks size={16} />
                    <div className="status-list-text">
                      <strong>To Do Backlog</strong>
                      <small>Pending start</small>
                    </div>
                    <span className="status-count-badge amber">{taskStatusCounts.todo}</span>
                  </div>

                  <div className="status-list-card red-card">
                    <Zap size={16} />
                    <div className="status-list-text">
                      <strong>Overdue Tasks</strong>
                      <small>Past SLA target date</small>
                    </div>
                    <span className="status-count-badge red">{taskStatusCounts.overdue}</span>
                  </div>
                </div>
              )}
            </article>

            {/* 2. DYNAMIC PROJECT PROGRESS */}
            <article className="tfAdminDashboard__card">
              <div className="tfAdminDashboard__cardHeader">
                <h2>Project Progress</h2>
                <div className="tfAdminDashboard__cardActionsGroup">
                  <select
                    value={projectProgressFilter}
                    onChange={(e) => setProjectProgressFilter(e.target.value)}
                    className="tfAdminDashboard__cardSelect sm"
                    title="Filter by status"
                  >
                    <option value="all">All Statuses</option>
                    <option value="on-track">On Track</option>
                    <option value="in-progress">In Progress</option>
                    <option value="at-risk">At Risk</option>
                    <option value="delayed">Delayed</option>
                  </select>
                  <select
                    value={projectProgressSort}
                    onChange={(e) => setProjectProgressSort(e.target.value)}
                    className="tfAdminDashboard__cardSelect sm"
                    title="Sort projects"
                  >
                    <option value="highest">Progress: High-Low</option>
                    <option value="lowest">Progress: Low-High</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>

              <div className="tfAdminDashboard__progressList">
                {filteredProgressProjects.slice(0, 4).map((project) => (
                  <div key={project.id} className="tfAdminDashboard__progressItem">
                    <div>
                      <strong>{project.name}</strong>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="tfAdminDashboard__progressTrack">
                      <span
                        style={{
                          width: `${project.progress}%`,
                          backgroundColor: project.color || "#6366f1",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* 3. TEAM MEMBERS */}
            <article className="tfAdminDashboard__card">
              <div className="tfAdminDashboard__cardHeader">
                <h2>Team Members</h2>
                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
                  className="tfAdminDashboard__viewAllBtn"
                >
                  View all
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="tfAdminDashboard__memberList">
                {TEAM_MEMBERS_DATA.map((member) => (
                  <div key={member.id} className="tfAdminDashboard__member">
                    <span
                      className="tfAdminDashboard__memberAvatar"
                      style={{
                        background: `${member.color}15`,
                        color: member.color,
                        borderColor: `${member.color}30`,
                      }}
                    >
                      {member.letter}
                    </span>

                    <div className="tfAdminDashboard__memberInfo">
                      <strong>{member.name}</strong>
                      <span>{member.role}</span>
                    </div>

                    <div
                      className={`tfAdminDashboard__memberStatus tfAdminDashboard__memberStatus--${member.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <i />
                      <span>{member.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          {/* ===============================================
              ROW 3: RECENT PROJECTS | MY UPCOMING TASKS
          =============================================== */}
          <section className="tfAdminDashboard__grid tfAdminDashboard__grid--projectsTasks">
            {/* RECENT PROJECTS TABLE */}
            <article className="tfAdminDashboard__card">
              <div className="tfAdminDashboard__cardHeader">
                <div className="tfAdminDashboard__cardHeaderTitle">
                  <h2>Recent Projects</h2>
                  <span className="tfAdminDashboard__badgeTag">{filteredRecentProjects.length} projects</span>
                </div>
                <div className="tfAdminDashboard__cardActionsGroup">
                  <select
                    value={recentProjectsFilter}
                    onChange={(e) => setRecentProjectsFilter(e.target.value)}
                    className="tfAdminDashboard__cardSelect sm"
                    title="Filter projects by status"
                  >
                    <option value="all">All Statuses</option>
                    <option value="on-track">On Track</option>
                    <option value="in-progress">In Progress</option>
                    <option value="at-risk">At Risk</option>
                    <option value="delayed">Delayed</option>
                  </select>

                  <select
                    value={recentProjectsSort}
                    onChange={(e) => setRecentProjectsSort(e.target.value)}
                    className="tfAdminDashboard__cardSelect sm"
                    title="Sort projects"
                  >
                    <option value="recent">Recent</option>
                    <option value="progress-desc">Progress (High-Low)</option>
                    <option value="progress-asc">Progress (Low-High)</option>
                    <option value="name">Name (A-Z)</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/projects")}
                    className="tfAdminDashboard__viewAllBtn"
                  >
                    View all
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              <div className="tfAdminDashboard__tableScroll">
                <table className="tfAdminDashboard__table">
                  <thead>
                    <tr>
                      <th style={{ width: 44, textAlign: "center" }}>#</th>
                      <th style={{ width: "26%" }}>Project</th>
                      <th style={{ width: "22%" }}>Team</th>
                      <th style={{ width: "22%" }}>Progress</th>
                      <th style={{ width: "14%" }}>Status</th>
                      <th style={{ width: "14%" }}>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecentProjects.slice(0, 5).map((project, idx) => (
                      <tr key={project.id}>
                        <td style={{ textAlign: "center" }}>
                          <span className="admin-row-num">{idx + 1}</span>
                        </td>
                        <td>
                          <strong>{project.name}</strong>
                        </td>
                        <td>
                          <div className="tfAdminDashboard__avatarStack">
                            {project.team?.slice(0, 3).map((tm, idx) => (
                              <span
                                key={idx}
                                className="tfAdminDashboard__stackedAvatar"
                                title={tm.name}
                              >
                                {tm.avatar ? (
                                  <img src={tm.avatar} alt={tm.name} />
                                ) : (
                                  tm.name.charAt(0)
                                )}
                              </span>
                            ))}
                            {project.extraTeamCount > 0 && (
                              <span className="tfAdminDashboard__stackedBadge">
                                +{project.extraTeamCount}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="tfAdminDashboard__tableProgress">
                            <div>
                              <span
                                style={{
                                  width: `${project.progress}%`,
                                  backgroundColor: project.color || "#6366f1",
                                }}
                              />
                            </div>
                            <small>{project.progress}%</small>
                          </div>
                        </td>
                        <td>{getStatusBadge(project.status)}</td>
                        <td>
                          <span className="tfAdminDashboard__dateCell">{project.dueDate}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            {/* MY UPCOMING TASKS */}
            <article className="tfAdminDashboard__card">
              <div className="tfAdminDashboard__cardHeader">
                <h2>My Upcoming Tasks</h2>
                <button
                  type="button"
                  onClick={() => navigate("/admin/tasks")}
                  className="tfAdminDashboard__viewAllBtn"
                >
                  View all
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="tfAdminDashboard__taskList">
                {tasksState.slice(0, 4).map((task) => (
                  <div key={task.id} className="tfAdminDashboard__task">
                    <button
                      type="button"
                      className={`tfAdminDashboard__taskCheck ${task.completed ? "active" : ""}`}
                      onClick={() => toggleTask(task.id)}
                      aria-label="Toggle task completion"
                    >
                      {task.completed && <Check size={12} strokeWidth={3} />}
                    </button>

                    <div className="tfAdminDashboard__taskInfo">
                      <strong
                        style={
                          task.completed
                            ? { textDecoration: "line-through", opacity: 0.6 }
                            : undefined
                        }
                      >
                        {task.title}
                      </strong>
                      <span>{task.project}</span>
                    </div>

                    {getPriorityBadge(task.priority)}

                    <span className="tfAdminDashboard__taskDue">
                      {task.dueDisplay || task.dueDate}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </section>

          {/* ===============================================
              ROW 4: ORGANIZATION ACTIVITY | AI USAGE
          =============================================== */}
          <section className="tfAdminDashboard__grid tfAdminDashboard__grid--bottom">
            {/* ORGANIZATION ACTIVITY */}
            <article className="tfAdminDashboard__card">
              <div className="tfAdminDashboard__cardHeader">
                <div className="tfAdminDashboard__cardHeaderTitle">
                  <h2>Organization Activity</h2>
                  <span className="tfAdminDashboard__badgeTag">{filteredActivities.length} events</span>
                </div>
                <div className="tfAdminDashboard__cardActionsGroup">
                  <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value)}
                    className="tfAdminDashboard__cardSelect sm"
                    title="Filter activities"
                  >
                    <option value="all">All Activities</option>
                    <option value="project">Project Events</option>
                    <option value="workspace">Workspace Events</option>
                    <option value="user">User Events</option>
                    <option value="security">Security Events</option>
                  </select>

                  <select
                    value={activitySort}
                    onChange={(e) => setActivitySort(e.target.value)}
                    className="tfAdminDashboard__cardSelect sm"
                    title="Sort activities"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/activity")}
                    className="tfAdminDashboard__viewAllBtn"
                  >
                    View all
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              <div className="tfAdminDashboard__tableScroll">
                <table className="tfAdminDashboard__table">
                  <thead>
                    <tr>
                      <th style={{ width: 44, textAlign: "center" }}>#</th>
                      <th style={{ width: "16%" }}>Time</th>
                      <th style={{ width: "30%" }}>User</th>
                      <th style={{ width: "24%" }}>Action</th>
                      <th style={{ width: "26%" }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.slice(0, 5).map((act, idx) => (
                      <tr key={act.id}>
                        <td style={{ textAlign: "center" }}>
                          <span className="admin-row-num">{idx + 1}</span>
                        </td>
                        <td>
                          <span className="tfAdminDashboard__timeCell">{act.time}</span>
                        </td>
                        <td>
                          <div className="tfAdminDashboard__activityUser">
                            <span
                              className="tfAdminDashboard__activityAvatar"
                              style={{
                                background: `${act.avatarColor || "#6366f1"}15`,
                                color: act.avatarColor || "#6366f1",
                                borderColor: `${act.avatarColor || "#6366f1"}30`,
                              }}
                            >
                              {act.letter || act.user.charAt(0)}
                            </span>
                            <div className="tfAdminDashboard__activityUserText">
                              <strong>{act.user}</strong>
                              <small>({act.role})</small>
                            </div>
                          </div>
                        </td>
                        <td>{act.action}</td>
                        <td>
                          <span className="tfAdminDashboard__activityDetail">{act.details}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            {/* AI USAGE (ORGANIZATION) */}
            <article className="tfAdminDashboard__card">
              <div className="tfAdminDashboard__cardHeader">
                <div className="tfAdminDashboard__cardHeaderTitle">
                  <h2>AI Usage (Organization)</h2>
                  <span className="tfAdminDashboard__badgeTag">{aiDataset.aiUsage.totalRequests} reqs</span>
                </div>
                <div className="tfAdminDashboard__cardActionsGroup">
                  {/* CHART FORMAT DROPDOWN */}
                  <select
                    value={aiChartType}
                    onChange={(e) => setAiChartType(e.target.value)}
                    className="tfAdminDashboard__cardSelect sm"
                    title="Switch AI usage representation"
                  >
                    <option value="bar">📊 Monthly Bars</option>
                    <option value="distribution">🍩 Distribution</option>
                    <option value="summary">📋 Summary</option>
                  </select>

                  {/* INDEPENDENT DATE RANGE FILTER FOR AI USAGE */}
                  <select
                    value={aiDateFilter}
                    onChange={(e) => setAiDateFilter(e.target.value)}
                    className="tfAdminDashboard__cardSelect"
                    title="Filter AI Usage by date"
                  >
                    <option value="This Month">This Month</option>
                    <option value="Today">Today</option>
                    <option value="Yesterday">Yesterday</option>
                    <option value="7 Days">Last 7 Days</option>
                    <option value="Last Month">Last Month</option>
                    <option value="All Time">All Time</option>
                  </select>
                </div>
              </div>

              <div className="tfAdminDashboard__aiLayout">
                {/* LEFT METRIC & CHART VIEW */}
                <div className="tfAdminDashboard__aiUsage">
                  <div className="tfAdminDashboard__aiHeaderBlock">
                    <div className="tfAdminDashboard__aiNumberRow">
                      <span className="tfAdminDashboard__aiBigNum">
                        {aiDataset.aiUsage.totalRequests}
                      </span>
                      <span className="tfAdminDashboard__aiGrowthBadge">
                        <TrendingUp size={11} />
                        {aiDataset.aiUsage.growth}
                      </span>
                    </div>
                    <span className="tfAdminDashboard__aiLabel">Total AI Requests ({aiDateFilter})</span>
                  </div>

                  {aiChartType === "bar" && (
                    <div className="tfAdminDashboard__aiChartWrapper">
                      <div className="tfAdminDashboard__aiYAxis">
                        <span>15K</span>
                        <span>10K</span>
                        <span>5K</span>
                        <span>0</span>
                      </div>

                      <div className="tfAdminDashboard__aiBarsContainer">
                        <div className="tfAdminDashboard__aiGridLines">
                          <span className="grid-line" />
                          <span className="grid-line" />
                          <span className="grid-line" />
                          <span className="grid-line" />
                        </div>

                        <div className="tfAdminDashboard__aiBars">
                          {aiDataset.aiUsage.monthly.map((m, idx) => (
                            <div key={idx} className="tfAdminDashboard__aiBarCol">
                              <div className="tfAdminDashboard__aiBarTrack">
                                <span
                                  className="tfAdminDashboard__aiBarFill"
                                  style={{ height: `${m.height}%` }}
                                  title={`${m.month}: ${m.height}%`}
                                />
                              </div>
                              <span className="tfAdminDashboard__aiMonthLabel">{m.month}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {aiChartType === "distribution" && (
                    <div className="tfAdminDashboard__aiDistributionView">
                      <div className="model-alloc-item">
                        <div className="model-alloc-labels">
                          <span>Claude 3.5 Sonnet (Coding)</span>
                          <strong>42% (5,241 reqs)</strong>
                        </div>
                        <div className="model-alloc-track">
                          <div className="model-alloc-fill purple" style={{ width: "42%" }} />
                        </div>
                      </div>

                      <div className="model-alloc-item">
                        <div className="model-alloc-labels">
                          <span>GPT-4o (Chat & Reasoning)</span>
                          <strong>38% (4,742 reqs)</strong>
                        </div>
                        <div className="model-alloc-track">
                          <div className="model-alloc-fill blue" style={{ width: "38%" }} />
                        </div>
                      </div>

                      <div className="model-alloc-item">
                        <div className="model-alloc-labels">
                          <span>TeamFlow Neural Core (Summaries)</span>
                          <strong>20% (2,497 reqs)</strong>
                        </div>
                        <div className="model-alloc-track">
                          <div className="model-alloc-fill green" style={{ width: "20%" }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {aiChartType === "summary" && (
                    <div className="tfAdminDashboard__aiSummaryCards">
                      <div className="ai-stat-box">
                        <span className="stat-label">Total Tokens Processed</span>
                        <strong className="stat-number">18.4M</strong>
                        <span className="stat-sub">Across all organization agents</span>
                      </div>
                      <div className="ai-stat-box">
                        <span className="stat-label">Avg GPU Latency</span>
                        <strong className="stat-number">24ms</strong>
                        <span className="stat-sub">99.8% within SLA window</span>
                      </div>
                      <div className="ai-stat-box">
                        <span className="stat-label">Est. Cost Savings</span>
                        <strong className="stat-number">$1,420</strong>
                        <span className="stat-sub">Compared to manual workload</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT: TOP AI FEATURES */}
                <div className="tfAdminDashboard__aiFeatures">
                  <div className="tfAdminDashboard__aiFeaturesTitle">Top AI Features</div>
                  {aiDataset.aiUsage.features.map((feat) => (
                    <div key={feat.id} className="tfAdminDashboard__aiFeature">
                      <div className="tfAdminDashboard__aiFeatLeft">
                        {renderFeatureIcon(feat.icon)}
                        <span>{feat.name}</span>
                      </div>
                      <strong>{feat.percentage}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>
        </div>
      </main>

      {/* CUSTOM DATE RANGE MODAL */}
      {customDateModalOpen && (
        <div
          className="tfAdminDashboard__modalOverlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCustomDateModalOpen(false);
          }}
        >
          <div className="tfAdminDashboard__customDateModal">
            <div className="modal-header">
              <div className="modal-title-wrap">
                <CalendarDays size={20} />
                <h3>Custom Date Range</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setCustomDateModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p>Select custom start and end dates for analytics and executive metrics.</p>

              <div className="date-inputs-grid">
                <div className="date-input-group">
                  <label htmlFor="customStart">Start Date</label>
                  <input
                    id="customStart"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>

                <div className="date-input-group">
                  <label htmlFor="customEnd">End Date</label>
                  <input
                    id="customEnd"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="quick-ranges">
                <button
                  type="button"
                  onClick={() => {
                    setCustomStartDate("2024-10-01");
                    setCustomEndDate("2024-10-31");
                  }}
                >
                  This Month
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomStartDate("2024-09-01");
                    setCustomEndDate("2024-09-30");
                  }}
                >
                  Last Month
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomStartDate("2024-01-01");
                    setCustomEndDate("2024-10-31");
                  }}
                >
                  Year to Date
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setCustomDateModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-apply"
                onClick={() => {
                  setDateFilter("This Month");
                  setCustomDateModalOpen(false);
                  setToast(`Custom date range applied: ${customStartDate} to ${customEndDate}`);
                }}
              >
                Apply Date Range
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="tfAdminDashboard__toast">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
