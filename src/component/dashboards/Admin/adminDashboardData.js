export const ADMIN_STORAGE_KEY = "teamflow_admin_dashboard_v2";

export const defaultAdminData = {
  organization: {
    id: 1,
    name: "ABC Technologies",
    adminName: "Amit Sharma",
    adminEmail: "amit@abctech.com",
  },

  users: [
    {
      id: 1,
      name: "Priya Patel",
      email: "priya@abc.com",
      role: "Team Lead",
      status: "Online",
    },
    {
      id: 2,
      name: "Rahul Sharma",
      email: "rahul@abc.com",
      role: "Developer",
      status: "Online",
    },
    {
      id: 3,
      name: "Sneha Gupta",
      email: "sneha@abc.com",
      role: "Designer",
      status: "In a meeting",
    },
    {
      id: 4,
      name: "Abhishek Verma",
      email: "abhishek@abc.com",
      role: "Developer",
      status: "Offline",
    },
  ],

  workspaces: [
    { id: 1, name: "Development Team", members: 12 },
    { id: 2, name: "Design Team", members: 7 },
    { id: 3, name: "Marketing", members: 8 },
    { id: 4, name: "Mobile Team", members: 9 },
    { id: 5, name: "AI Team", members: 6 },
    { id: 6, name: "Internal", members: 6 },
  ],

  projects: [
    {
      id: 1,
      name: "TeamFlow Website",
      progress: 85,
      status: "On Track",
      dueDate: "2026-11-10",
    },
    {
      id: 2,
      name: "Mobile App",
      progress: 62,
      status: "In Progress",
      dueDate: "2026-11-18",
    },
    {
      id: 3,
      name: "AI Integration",
      progress: 40,
      status: "At Risk",
      dueDate: "2026-11-25",
    },
    {
      id: 4,
      name: "Marketing Portal",
      progress: 25,
      status: "Delayed",
      dueDate: "2026-12-05",
    },
  ],

  tasks: [
    {
      id: 1,
      title: "Review UI design",
      project: "TeamFlow Website",
      priority: "High",
      status: "In Progress",
      due: "Today",
    },
    {
      id: 2,
      title: "API integration testing",
      project: "Mobile App",
      priority: "Medium",
      status: "To Do",
      due: "Tomorrow",
    },
    {
      id: 3,
      title: "Update project documentation",
      project: "AI Integration",
      priority: "Low",
      status: "Completed",
      due: "Oct 28",
    },
    {
      id: 4,
      title: "Team meeting preparation",
      project: "Internal",
      priority: "Medium",
      status: "To Do",
      due: "Oct 30",
    },
  ],

  activities: [
    {
      id: 1,
      time: "10:42 AM",
      user: "Priya Patel",
      role: "Team Lead",
      action: "Created a project",
      details: "TeamFlow Website",
    },
    {
      id: 2,
      time: "10:20 AM",
      user: "Rahul Sharma",
      role: "Developer",
      action: "Joined workspace",
      details: "Development Team",
    },
    {
      id: 3,
      time: "09:55 AM",
      user: "Sneha Gupta",
      role: "Designer",
      action: "Updated task status",
      details: "UI Design → In Progress",
    },
    {
      id: 4,
      time: "09:32 AM",
      user: "Abhishek Verma",
      role: "Developer",
      action: "Added a comment",
      details: "API integration issue",
    },
  ],

  aiUsage: {
    requests: 12480,
    growth: 18,
    features: [
      { name: "Chat Assistant", percentage: 42 },
      { name: "Task Suggestions", percentage: 24 },
      { name: "Content Generation", percentage: 18 },
      { name: "Summaries", percentage: 10 },
      { name: "Other", percentage: 6 },
    ],
    monthly: [2100, 3200, 4100, 5000, 5800, 6700, 7900, 9100, 10800, 12480],
  },
};

export function loadAdminData() {
  try {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);

    if (!stored) {
      localStorage.setItem(
        ADMIN_STORAGE_KEY,
        JSON.stringify(defaultAdminData)
      );

      return JSON.parse(JSON.stringify(defaultAdminData));
    }

    const parsed = JSON.parse(stored);

    return {
      ...defaultAdminData,
      ...parsed,
      organization: {
        ...defaultAdminData.organization,
        ...(parsed.organization || {}),
      },
      aiUsage: {
        ...defaultAdminData.aiUsage,
        ...(parsed.aiUsage || {}),
      },
    };
  } catch (error) {
    console.error("Unable to load Admin Dashboard data:", error);

    return JSON.parse(JSON.stringify(defaultAdminData));
  }
}

export function saveAdminData(data) {
  try {
    localStorage.setItem(
      ADMIN_STORAGE_KEY,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("Unable to save Admin Dashboard data:", error);
  }
}