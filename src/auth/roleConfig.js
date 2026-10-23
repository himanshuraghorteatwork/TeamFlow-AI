export const ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  TEAMLEAD: "teamlead",
  EMPLOYEE: "employee",
};

export const ROLE_DASHBOARDS = {
  [ROLES.SUPERADMIN]: "/superadmin/dashboard",
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.TEAMLEAD]: "/teamlead/dashboard",
  [ROLES.EMPLOYEE]: "/dashboard",
};

export const ROLE_LABELS = {
  [ROLES.SUPERADMIN]: "Super Admin",
  [ROLES.ADMIN]: "Admin",
  [ROLES.TEAMLEAD]: "Team Lead",
  [ROLES.EMPLOYEE]: "Employee",
};

export const ROLE_NAVIGATION = {
  [ROLES.SUPERADMIN]: [
    "Dashboard",
    "Organizations",
    "Users",
    "Analytics",
    "Activity Logs",
    "Settings",
  ],

  [ROLES.ADMIN]: [
    "Dashboard",
    "Chat",
    "Tasks",
    "Projects",
    "Calendar",
    "Team",
    "Files",
    "Settings",
  ],

  [ROLES.TEAMLEAD]: [
    "Dashboard",
    "Chat",
    "Tasks",
    "Projects",
    "Bugs",
    "Calendar",
    "Team",
    "Files",
  ],

  [ROLES.EMPLOYEE]: [
    "Dashboard",
    "Chat",
    "Tasks",
    "Projects",
    "Bugs",
    "Calendar",
    "Files",
  ],
};

export const getCurrentUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem("teamflow_current_user") || "null"
    );
  } catch {
    return null;
  }
};

export const getUserRole = (user) => {
  const role = user?.role;

  return Object.values(ROLES).includes(role)
    ? role
    : ROLES.EMPLOYEE;
};

export const getDashboardPath = (user) => {
  const role = getUserRole(user);

  return ROLE_DASHBOARDS[role];
};