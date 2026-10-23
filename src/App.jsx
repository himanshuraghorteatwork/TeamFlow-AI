import "./App.css";
<<<<<<< HEAD

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* =========================================================
   PUBLIC PAGES
========================================================= */
=======
import { Routes, Route, Navigate } from "react-router-dom";
>>>>>>> 96fdbebd3811910b52484e88d6d21e907978b2fd

// Public pages
import LandingPage from "./component/LandingPage/LandingPage.jsx";
import ChooseRole from "./component/ChooseRole/ChooseRole.jsx";
import Login from "./component/Login/login.jsx";
import Signup from "./component/Signup/Signup.jsx";

<<<<<<< HEAD
/* =========================================================
   USER PAGES
========================================================= */

import Dashboard from "./component/Dashboard/Dashboard.jsx";
=======
// Existing application pages
>>>>>>> 96fdbebd3811910b52484e88d6d21e907978b2fd
import Chat from "./component/Chat/Chat.jsx";
import Tasks from "./component/Tasks/Tasks.jsx";
import Projects from "./component/Projects/Projects.jsx";
import Bugs from "./component/Bugs/Bugs.jsx";
<<<<<<< HEAD
import Calendar from "./component/Calendar/Calendar.jsx";
import Team from "./component/Team/Team.jsx";
import File from "./component/File/File.jsx";
import AI from "./component/AI/AI.jsx";

/* =========================================================
   ADMIN PAGES
========================================================= */

import AdminDashboard from "./component/dashboards/Admin/AdminDashboard.jsx";

import AdminWorkspace from "./component/AdminWorkspace/AdminWorkspace.jsx";

import AdminUsers from "./component/dashboards/Admin/AdminUsers.jsx";

import AdminProjects from "./component/dashboards/Admin/AdminProjects.jsx";

import AdminTasks from "./component/dashboards/Admin/AdminTasks.jsx";

import AdminAITools from "./component/dashboards/Admin/AdminAITools.jsx";

import AdminBilling from "./component/dashboards/Admin/AdminBilling.jsx";

import AdminSubscriptions from "./component/dashboards/Admin/AdminSubscriptions.jsx";

import AdminAnalytics from "./component/dashboards/Admin/AdminAnalytics.jsx";

import AdminAnnouncements from "./component/dashboards/Admin/AdminAnnouncements.jsx";

import AdminReports from "./component/dashboards/Admin/AdminReports.jsx";

import AdminSettings from "./component/dashboards/Admin/AdminSettings.jsx";


/* =========================================================
   APP
========================================================= */
=======
import File from "./component/File/File.jsx";

// Super Admin layout and pages
import SuperAdminLayout from "./component/dashboards/SuperAdmin/SuperAdminLayout.jsx";
import SuperAdminDashboard from "./component/dashboards/SuperAdmin/SuperAdminDashboard.jsx";
import Organizations from "./component/dashboards/SuperAdmin/Organizations.jsx";
import Users from "./component/dashboards/SuperAdmin/Users.jsx";
import Analytics from "./component/dashboards/SuperAdmin/Analytics.jsx";
import ActivityLogs from "./component/dashboards/SuperAdmin/ActivityLogs.jsx";
import Subscriptions from "./component/dashboards/SuperAdmin/Subscriptions.jsx";
import Settings from "./component/dashboards/SuperAdmin/Settings.jsx";
>>>>>>> 96fdbebd3811910b52484e88d6d21e907978b2fd

function App() {
  return (
    <Routes>
<<<<<<< HEAD

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />


      {/* =====================================================
          USER ROUTES
      ===================================================== */}

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/chat"
        element={<Chat />}
      />

      <Route
        path="/tasks"
        element={<Tasks />}
      />

      <Route
        path="/projects"
        element={<Projects />}
      />

      <Route
        path="/bugs"
        element={<Bugs />}
      />

      <Route
        path="/calendar"
        element={<Calendar />}
      />

      <Route
        path="/team"
        element={<Team />}
      />

      <Route
        path="/files"
        element={<File />}
      />

      <Route
        path="/ai-assistant"
        element={<AI />}
      />


      {/* =====================================================
          ADMIN ROOT
      ===================================================== */}

      <Route
        path="/admin"
        element={
          <Navigate
            to="/admin/dashboard"
            replace
          />
        }
      />


      {/* =====================================================
          ADMIN DASHBOARD
      ===================================================== */}

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />


      {/* =====================================================
          ADMIN WORKSPACES
      ===================================================== */}

      <Route
        path="/admin/workspaces"
        element={<AdminWorkspace />}
      />


      {/* =====================================================
          ADMIN USERS
      ===================================================== */}

      <Route
        path="/admin/users"
        element={<AdminUsers />}
      />


      {/* =====================================================
          ADMIN PROJECTS
      ===================================================== */}

      <Route
        path="/admin/projects"
        element={<AdminProjects />}
      />


      {/* =====================================================
          ADMIN TASKS
      ===================================================== */}

      <Route
        path="/admin/tasks"
        element={<AdminTasks />}
      />


      {/* =====================================================
          ADMIN AI TOOLS
      ===================================================== */}

      <Route
        path="/admin/ai-tools"
        element={<AdminAITools />}
      />


      {/* =====================================================
          ADMIN BILLING
      ===================================================== */}

      <Route
        path="/admin/billing"
        element={<AdminBilling />}
      />


      {/* =====================================================
          ADMIN SUBSCRIPTIONS
      ===================================================== */}

      <Route
        path="/admin/subscriptions"
        element={<AdminSubscriptions />}
      />


      {/* =====================================================
          ADMIN ANALYTICS
      ===================================================== */}

      <Route
        path="/admin/analytics"
        element={<AdminAnalytics />}
      />


      {/* =====================================================
          ADMIN ANNOUNCEMENTS
      ===================================================== */}

      <Route
        path="/admin/announcements"
        element={<AdminAnnouncements />}
      />


      {/* =====================================================
          ADMIN REPORTS
      ===================================================== */}

      <Route
        path="/admin/reports"
        element={<AdminReports />}
      />


      {/* =====================================================
          ADMIN SETTINGS
      ===================================================== */}

      <Route
        path="/admin/settings"
        element={<AdminSettings />}
      />


      {/* =====================================================
          404
      ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

=======
      {/* Public pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/choose-role" element={<ChooseRole />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Super Admin section with shared layout */}
      <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route
          index
          element={<Navigate to="/superadmin/dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<SuperAdminDashboard />}
        />

        <Route
          path="organizations"
          element={<Organizations />}
        />

        <Route
          path="users"
          element={<Users />}
        />

        <Route path="analytics" element={<Analytics />} />

        <Route path="activity-logs" element={<ActivityLogs />} />        

        <Route path="subscriptions" element={<Subscriptions />} />

        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Existing application pages */}
      <Route path="/chat" element={<Chat />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/team" element={<Team />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/bugs" element={<Bugs />} />
      <Route path="/files" element={<File />} />

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
>>>>>>> 96fdbebd3811910b52484e88d6d21e907978b2fd
    </Routes>
  );
}

export default App;