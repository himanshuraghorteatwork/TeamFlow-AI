export const initialProjects = [
  {
    id: 1,
    name: "Website Redesign",
    type: "UI/UX",
    tasks: 12,
    progress: 80,
  },
  {
    id: 2,
    name: "Mobile App",
    type: "Development",
    tasks: 8,
    progress: 60,
  },
  {
    id: 3,
    name: "AI Assistant",
    type: "Research",
    tasks: 6,
    progress: 40,
  },
  {
    id: 4,
    name: "Marketing Campaign",
    type: "Marketing",
    tasks: 5,
    progress: 20,
  },
];

export const initialTasks = [
  {
    id: 1,
    title: "Design Dashboard UI",
    project: "Website Redesign",
    status: "progress",
    priority: "High",
    due: "Oct 23",
    overdue: false,
  },
  {
    id: 2,
    title: "API Integration",
    project: "Mobile App",
    status: "progress",
    priority: "Medium",
    due: "Oct 24",
    overdue: false,
  },
  {
    id: 3,
    title: "Content Planning",
    project: "Marketing Campaign",
    status: "completed",
    priority: "Low",
    due: "Oct 25",
    overdue: false,
  },
  {
    id: 4,
    title: "User Testing",
    project: "AI Assistant",
    status: "progress",
    priority: "Medium",
    due: "Oct 26",
    overdue: false,
  },
  {
    id: 5,
    title: "Fix Login Validation",
    project: "Website Redesign",
    status: "progress",
    priority: "High",
    due: "Oct 22",
    overdue: true,
  },
];

export const initialActivity = [
  {
    id: 1,
    user: "Jordan Lee",
    text: "created a new dashboard task",
    time: "10 min ago",
  },
  {
    id: 2,
    user: "Sophia Chen",
    text: "completed API Integration",
    time: "1 hour ago",
  },
  {
    id: 3,
    user: "Ethan Brooks",
    text: "commented on Mobile App",
    time: "2 hours ago",
  },
  {
    id: 4,
    user: "Olivia Taylor",
    text: "uploaded a file",
    time: "3 hours ago",
  },
];

export const teamActivityData = [
  {
    day: "Mon",
    tasks: 16,
    comments: 8,
    files: 5,
  },
  {
    day: "Tue",
    tasks: 20,
    comments: 12,
    files: 9,
  },
  {
    day: "Wed",
    tasks: 17,
    comments: 15,
    files: 6,
  },
  {
    day: "Thu",
    tasks: 25,
    comments: 11,
    files: 5,
  },
  {
    day: "Fri",
    tasks: 22,
    comments: 20,
    files: 9,
  },
  {
    day: "Sat",
    tasks: 18,
    comments: 17,
    files: 4,
  },
  {
    day: "Sun",
    tasks: 24,
    comments: 10,
    files: 7,
  },
];

export const taskOverviewData = [
  {
    day: "Mon",
    created: 8,
    progress: 5,
    completed: 3,
  },
  {
    day: "Tue",
    created: 17,
    progress: 14,
    completed: 8,
  },
  {
    day: "Wed",
    created: 21,
    progress: 9,
    completed: 14,
  },
  {
    day: "Thu",
    created: 17,
    progress: 12,
    completed: 10,
  },
  {
    day: "Fri",
    created: 11,
    progress: 8,
    completed: 6,
  },
  {
    day: "Sat",
    created: 20,
    progress: 13,
    completed: 9,
  },
  {
    day: "Sun",
    created: 23,
    progress: 16,
    completed: 12,
  },
];