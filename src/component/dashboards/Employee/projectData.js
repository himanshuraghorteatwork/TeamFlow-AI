export const initialProjects = [
  {
    id: 1,
    name: "TeamFlow AI - Web",
    description: "Main web application development with AI features.",
    icon: "monitor",
    status: "Active",
    priority: "High",
    startDate: "2026-09-01",
    dueDate: "2026-12-20",
    lastUpdated: "1 day ago",

    members: [
      { id: 1, name: "Himanshu", initials: "HR" },
      { id: 2, name: "Sarah Wilson", initials: "SW" },
      { id: 3, name: "Mike Chen", initials: "MC" },
      { id: 4, name: "Emma Davis", initials: "ED" },
    ],

    tasks: [
      {
        id: 101,
        title: "Create landing page",
        status: "Completed",
        assignee: "Himanshu",
      },
      {
        id: 102,
        title: "Build authentication UI",
        status: "Completed",
        assignee: "Sarah Wilson",
      },
      {
        id: 103,
        title: "Create chat module",
        status: "In Progress",
        assignee: "Mike Chen",
      },
      {
        id: 104,
        title: "Create projects module",
        status: "Review",
        assignee: "Himanshu",
      },
      {
        id: 105,
        title: "Build task board",
        status: "To Do",
        assignee: "Emma Davis",
      },
    ],
  },

  {
    id: 2,
    name: "Mobile App",
    description: "React Native mobile application for TeamFlow.",
    icon: "mobile",
    status: "Active",
    priority: "Medium",
    startDate: "2026-09-15",
    dueDate: "2027-01-15",
    lastUpdated: "2 days ago",

    members: [
      { id: 1, name: "Himanshu", initials: "HR" },
      { id: 2, name: "Sarah Wilson", initials: "SW" },
      { id: 3, name: "Alex Kumar", initials: "AK" },
    ],

    tasks: [
      {
        id: 201,
        title: "Create mobile navigation",
        status: "Completed",
        assignee: "Sarah Wilson",
      },
      {
        id: 202,
        title: "Create mobile login",
        status: "Completed",
        assignee: "Alex Kumar",
      },
      {
        id: 203,
        title: "Create mobile dashboard",
        status: "In Progress",
        assignee: "Himanshu",
      },
      {
        id: 204,
        title: "Push notifications",
        status: "To Do",
        assignee: "Alex Kumar",
      },
    ],
  },

  {
    id: 3,
    name: "Marketing Website",
    description: "Landing page and marketing website.",
    icon: "globe",
    status: "Completed",
    priority: "Low",
    startDate: "2026-07-01",
    dueDate: "2026-10-10",
    lastUpdated: "3 days ago",

    members: [
      { id: 1, name: "Himanshu", initials: "HR" },
      { id: 4, name: "Emma Davis", initials: "ED" },
    ],

    tasks: [
      {
        id: 301,
        title: "Landing page",
        status: "Completed",
        assignee: "Himanshu",
      },
      {
        id: 302,
        title: "Responsive design",
        status: "Completed",
        assignee: "Emma Davis",
      },
      {
        id: 303,
        title: "SEO setup",
        status: "Completed",
        assignee: "Himanshu",
      },
    ],
  },

  {
    id: 4,
    name: "AI Assistant",
    description: "Integrate AI features for team productivity.",
    icon: "brain",
    status: "On Hold",
    priority: "High",
    startDate: "2026-10-01",
    dueDate: "2027-02-05",
    lastUpdated: "1 week ago",

    members: [
      { id: 1, name: "Himanshu", initials: "HR" },
      { id: 3, name: "Mike Chen", initials: "MC" },
    ],

    tasks: [
      {
        id: 401,
        title: "Research AI APIs",
        status: "Completed",
        assignee: "Himanshu",
      },
      {
        id: 402,
        title: "Chat summarization",
        status: "In Progress",
        assignee: "Mike Chen",
      },
      {
        id: 403,
        title: "Task suggestions",
        status: "To Do",
        assignee: "Himanshu",
      },
    ],
  },

  {
    id: 5,
    name: "Backend API",
    description: "Develop core APIs and backend services.",
    icon: "database",
    status: "Active",
    priority: "High",
    startDate: "2026-08-20",
    dueDate: "2027-01-30",
    lastUpdated: "2 weeks ago",

    members: [
      { id: 1, name: "Himanshu", initials: "HR" },
      { id: 3, name: "Mike Chen", initials: "MC" },
      { id: 5, name: "John Doe", initials: "JD" },
    ],

    tasks: [
      {
        id: 501,
        title: "Authentication API",
        status: "Completed",
        assignee: "Mike Chen",
      },
      {
        id: 502,
        title: "Projects API",
        status: "Completed",
        assignee: "Himanshu",
      },
      {
        id: 503,
        title: "Tasks API",
        status: "In Progress",
        assignee: "John Doe",
      },
      {
        id: 504,
        title: "Chat API",
        status: "To Do",
        assignee: "Mike Chen",
      },
    ],
  },
];

export const availableMembers = [
  { id: 1, name: "Himanshu", initials: "HR" },
  { id: 2, name: "Sarah Wilson", initials: "SW" },
  { id: 3, name: "Mike Chen", initials: "MC" },
  { id: 4, name: "Emma Davis", initials: "ED" },
  { id: 5, name: "John Doe", initials: "JD" },
  { id: 6, name: "Alex Kumar", initials: "AK" },
];