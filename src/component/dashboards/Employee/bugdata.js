export const initialBugs = [
  {
    id: "BUG-101",
    title: "Login button not responding",
    description:
      "Users are unable to log in after entering valid credentials.",
    project: "TeamFlow AI - Web",
    status: "Open",
    priority: "Critical",
    severity: "High",
    assignee: "Himanshu",
    reporter: "John Doe",
    createdAt: "Oct 22, 2026",
    aiConfidence: 94,
    aiCategory: "Authentication",
    aiSuggestion:
      "Check the login event handler, authentication API response, and token storage logic.",
  },
  {
    id: "BUG-102",
    title: "Chat messages loading slowly",
    description:
      "Messages take several seconds to appear after opening a channel.",
    project: "TeamFlow AI - Web",
    status: "In Progress",
    priority: "High",
    severity: "Medium",
    assignee: "Alex",
    reporter: "Sarah",
    createdAt: "Oct 21, 2026",
    aiConfidence: 87,
    aiCategory: "Performance",
    aiSuggestion:
      "Review message pagination, database queries, and unnecessary API requests.",
  },
  {
    id: "BUG-103",
    title: "Mobile sidebar overlaps content",
    description:
      "The navigation sidebar overlaps the dashboard on smaller screens.",
    project: "Mobile App",
    status: "Review",
    priority: "Medium",
    severity: "Medium",
    assignee: "Sarah",
    reporter: "Himanshu",
    createdAt: "Oct 20, 2026",
    aiConfidence: 91,
    aiCategory: "UI / Responsive",
    aiSuggestion:
      "Check sidebar breakpoints and remove the desktop margin-left value on mobile.",
  },
  {
    id: "BUG-104",
    title: "Project progress not updating",
    description:
      "Completing a task does not immediately update project progress.",
    project: "TeamFlow AI - Web",
    status: "Resolved",
    priority: "High",
    severity: "High",
    assignee: "Himanshu",
    reporter: "Mike",
    createdAt: "Oct 19, 2026",
    aiConfidence: 96,
    aiCategory: "State Management",
    aiSuggestion:
      "Recalculate progress whenever the project's task array changes.",
  },
  {
    id: "BUG-105",
    title: "Calendar event duplicate",
    description:
      "Creating an event occasionally produces duplicate calendar entries.",
    project: "TeamFlow AI - Web",
    status: "Open",
    priority: "Medium",
    severity: "Low",
    assignee: "Mike",
    reporter: "Alex",
    createdAt: "Oct 18, 2026",
    aiConfidence: 82,
    aiCategory: "Data Handling",
    aiSuggestion:
      "Check whether the submit handler executes twice and verify unique event IDs.",
  },
  {
    id: "BUG-106",
    title: "File upload fails above 10 MB",
    description:
      "Large project files fail during upload without displaying an error.",
    project: "Backend API",
    status: "In Progress",
    priority: "Critical",
    severity: "High",
    assignee: "Alex",
    reporter: "John Doe",
    createdAt: "Oct 17, 2026",
    aiConfidence: 93,
    aiCategory: "File Upload",
    aiSuggestion:
      "Verify backend upload size limits, request configuration, and client-side validation.",
  },
];

export const bugProjects = [
  "TeamFlow AI - Web",
  "Mobile App",
  "Marketing Website",
  "AI Assistant",
  "Backend API",
];

export const bugMembers = [
  "Himanshu",
  "Alex",
  "Sarah",
  "Mike",
  "John Doe",
];

export const bugStatuses = [
  "Open",
  "In Progress",
  "Review",
  "Resolved",
];

export const bugPriorities = [
  "Critical",
  "High",
  "Medium",
  "Low",
];