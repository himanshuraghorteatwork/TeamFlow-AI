// src/component/ChooseRole/roleCredentials.js

export const ROLE_CREDENTIALS = [
  {
    id: 1,
    name: "Super Admin",
    role: "superadmin",
    roleName: "Super Admin",
    email: "superadmin@teamflow.local",
    password: "SuperAdmin@123",
    dashboard: "/superadmin/dashboard",
  },
  {
    id: 2,
    name: "Admin",
    role: "admin",
    roleName: "Admin",
    email: "admin@teamflow.local",
    password: "Admin@123",
    dashboard: "/admin/dashboard",
  },
  {
    id: 3,
    name: "Team Lead",
    role: "teamlead",
    roleName: "Team Lead",
    email: "teamlead@teamflow.local",
    password: "TeamLead@123",
    dashboard: "/teamlead/dashboard",
  },
  {
    id: 4,
    name: "Employee",
    role: "employee",
    roleName: "Member",
    email: "employee@teamflow.local",
    password: "Employee@123",
    dashboard: "/dashboard",
  },
];

// -----------------------------------------------------
// INITIALIZE DEFAULT ROLE USERS
// -----------------------------------------------------

export const initializeRoleCredentials = () => {
  try {
    const storedUsers = JSON.parse(
      localStorage.getItem("teamflow_role_users") || "[]"
    );

    const existingUsers = Array.isArray(storedUsers)
      ? storedUsers
      : [];

    const mergedUsers = [...existingUsers];

    ROLE_CREDENTIALS.forEach((defaultUser) => {
      const existingIndex = mergedUsers.findIndex(
        (user) =>
          String(user.email || "").toLowerCase() ===
          defaultUser.email.toLowerCase()
      );

      if (existingIndex === -1) {
        mergedUsers.push(defaultUser);
      } else {
        // Keep demo credentials synchronized
        mergedUsers[existingIndex] = {
          ...mergedUsers[existingIndex],
          ...defaultUser,
        };
      }
    });

    localStorage.setItem(
      "teamflow_role_users",
      JSON.stringify(mergedUsers)
    );

    return mergedUsers;
  } catch (error) {
    console.error(
      "Failed to initialize TeamFlow credentials:",
      error
    );

    localStorage.setItem(
      "teamflow_role_users",
      JSON.stringify(ROLE_CREDENTIALS)
    );

    return ROLE_CREDENTIALS;
  }
};

// -----------------------------------------------------
// GET ALL ROLE USERS
// -----------------------------------------------------

export const getRoleCredentials = () => {
  try {
    const users = JSON.parse(
      localStorage.getItem("teamflow_role_users") || "[]"
    );

    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error("Failed to read credentials:", error);
    return [];
  }
};

// -----------------------------------------------------
// FIND USER
// -----------------------------------------------------

export const findRoleCredential = (
  email,
  password,
  selectedRole
) => {
  const users = getRoleCredentials();

  return users.find(
    (user) =>
      String(user.email || "")
        .trim()
        .toLowerCase() ===
        String(email || "")
          .trim()
          .toLowerCase() &&
      user.password === password &&
      user.role === selectedRole
  );
};

// -----------------------------------------------------
// CURRENT LOGGED-IN USER
// -----------------------------------------------------

export const getCurrentUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem("teamflow_current_user") ||
        "null"
    );
  } catch {
    return null;
  }
};

// -----------------------------------------------------
// LOGOUT
// -----------------------------------------------------

export const logoutUser = () => {
  localStorage.removeItem("teamflow_current_user");
};