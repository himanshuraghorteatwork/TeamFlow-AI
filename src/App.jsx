
import "./App.css";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* =========================================================
   PUBLIC PAGES
========================================================= */

import LandingPage from "./component/LandingPage/LandingPage.jsx";
import Login from "./component/Login/login.jsx";
import Signup from "./component/Signup/Signup.jsx";
import ChooseRole from "./component/ChooseRole/ChooseRole.jsx";

/* =========================================================
   NORMAL USER PAGES
========================================================= */

import Chat from "./component/Chat/Chat.jsx";
import Tasks from "./component/Tasks/Tasks.jsx";
import Calendar from "./component/Calendar/Calendar.jsx";
import Team from "./component/Team/Team.jsx";
import Projects from "./component/Projects/Projects.jsx";
import Bugs from "./component/Bugs/Bugs.jsx";
import File from "./component/File/File.jsx";

/* =========================================================
   EMPLOYEE DASHBOARD
========================================================= */

// Confirm that this file exists in your project.
import Dashboard from "./component/Dashboard/Dashboard.jsx";

/* =========================================================
   SUPER ADMIN LAYOUT
========================================================= */

import SuperAdminLayout from "./component/dashboards/SuperAdmin/SuperAdminLayout.jsx";

/* =========================================================
   SUPER ADMIN PAGES
========================================================= */

import SuperAdminDashboard from "./component/dashboards/SuperAdmin/SuperAdminDashboard.jsx";
import Organizations from "./component/dashboards/SuperAdmin/Organizations.jsx";
import SuperAdminUsers from "./component/dashboards/SuperAdmin/Users.jsx";
import SuperAdminAnalytics from "./component/dashboards/SuperAdmin/Analytics.jsx";
import ActivityLogs from "./component/dashboards/SuperAdmin/ActivityLogs.jsx";
import SuperAdminSettings from "./component/dashboards/SuperAdmin/Settings.jsx";
import SuperAdminSubscriptions from "./component/dashboards/SuperAdmin/Subscriptions.jsx";

/* =========================================================
   ADMIN PAGES
========================================================= */

import AdminDashboard from "./component/dashboards/Admin/AdminDashboard.jsx";
import AdminAITools from "./component/dashboards/Admin/AdminAITools.jsx";
import AdminAnalytics from "./component/dashboards/Admin/AdminAnalytics.jsx";
import AdminAnnouncements from "./component/dashboards/Admin/AdminAnnouncements.jsx";
import AdminBilling from "./component/dashboards/Admin/AdminBilling.jsx";
import AdminProjects from "./component/dashboards/Admin/AdminProjects.jsx";
import AdminReports from "./component/dashboards/Admin/AdminReports.jsx";
import AdminSettings from "./component/dashboards/Admin/AdminSettings.jsx";
import AdminSubscriptions from "./component/dashboards/Admin/AdminSubscriptions.jsx";
import AdminTasks from "./component/dashboards/Admin/AdminTasks.jsx";
import AdminUsers from "./component/dashboards/Admin/AdminUsers.jsx";
import AdminWorkspace from "./component/dashboards/Admin/AdminWorkspace.jsx";

/* =========================================================
   TEAM LEAD LAYOUT
========================================================= */

import TeamLeadLayout from "./component/dashboards/TeamLead/TeamLeadLayout.jsx";

/* =========================================================
   TEAM LEAD PAGES
========================================================= */

import TeamLeadDashboard from "./component/dashboards/TeamLead/TeamLeadDashboard.jsx";
import TeamLeadChat from "./component/dashboards/TeamLead/Chat.jsx";
import TeamLeadTask from "./component/dashboards/TeamLead/Task.jsx";
import TeamLeadProject from "./component/dashboards/TeamLead/Project.jsx";
import TeamLeadBug from "./component/dashboards/TeamLead/Bug.jsx";
import TeamLeadCalendar from "./component/dashboards/TeamLead/Calendar.jsx";
import TeamLeadMyTeam from "./component/dashboards/TeamLead/MyTeam.jsx";
import TeamLeadReport from "./component/dashboards/TeamLead/Report.jsx";
import TeamLeadSetting from "./component/dashboards/TeamLead/Setting.jsx";
import TeamLeadAI from "./component/dashboards/TeamLead/AiAssistant.jsx";
import TeamMember1 from "./component/dashboards/TeamLead/TeamMember1.jsx";

function App() {
  return (
    <Routes>
      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/choose-role" element={<ChooseRole />} />

      {/* =====================================================
          SUPER ADMIN ROUTES
      ===================================================== */}

      <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route
          index
          element={<Navigate to="dashboard" replace />}
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
          element={<SuperAdminUsers />}
        />

        <Route
          path="analytics"
          element={<SuperAdminAnalytics />}
        />

        <Route
          path="activity-logs"
          element={<ActivityLogs />}
        />

        <Route
          path="settings"
          element={<SuperAdminSettings />}
        />

        <Route
          path="subscriptions"
          element={<SuperAdminSubscriptions />}
        />
      </Route>

      {/* =====================================================
          ADMIN ROUTES
      ===================================================== */}

      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/ai-tools"
        element={<AdminAITools />}
      />

      <Route
        path="/admin/analytics"
        element={<AdminAnalytics />}
      />

      <Route
        path="/admin/announcements"
        element={<AdminAnnouncements />}
      />

      <Route
        path="/admin/billing"
        element={<AdminBilling />}
      />

      <Route
        path="/admin/projects"
        element={<AdminProjects />}
      />

      <Route
        path="/admin/reports"
        element={<AdminReports />}
      />

      <Route
        path="/admin/settings"
        element={<AdminSettings />}
      />

      <Route
        path="/admin/subscriptions"
        element={<AdminSubscriptions />}
      />

      <Route
        path="/admin/tasks"
        element={<AdminTasks />}
      />

      <Route
        path="/admin/users"
        element={<AdminUsers />}
      />

      <Route
        path="/admin/workspaces"
        element={<AdminWorkspace />}
      />

      {/* =====================================================
          EMPLOYEE ROUTES
      ===================================================== */}

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route path="/chat" element={<Chat />} />

      <Route path="/tasks" element={<Tasks />} />

      <Route path="/calendar" element={<Calendar />} />

      <Route path="/team" element={<Team />} />

      <Route path="/projects" element={<Projects />} />

      <Route path="/bugs" element={<Bugs />} />

      <Route path="/files" element={<File />} />

      {/* =====================================================
          TEAM LEAD ROUTES
      ===================================================== */}

      <Route path="/teamlead" element={<TeamLeadLayout />}>
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<TeamLeadDashboard />}
        />

        <Route
          path="team"
          element={<TeamLeadMyTeam />}
        />

        <Route
          path="projects"
          element={<TeamLeadProject />}
        />

        <Route
          path="tasks"
          element={<TeamLeadTask />}
        />

        <Route
          path="bugs"
          element={<TeamLeadBug />}
        />

        <Route
          path="calendar"
          element={<TeamLeadCalendar />}
        />

        <Route
          path="member"
          element={<TeamMember1 />}
        />

        <Route
          path="member/:id"
          element={<TeamMember1 />}
        />

        <Route
          path="reports"
          element={<TeamLeadReport />}
        />

        <Route
          path="chat"
          element={<TeamLeadChat />}
        />

        <Route
          path="ai-assistant"
          element={<TeamLeadAI />}
        />

        <Route
          path="settings"
          element={<TeamLeadSetting />}
        />
      </Route>

      {/* =====================================================
          OLD TEAM LEAD URL
      ===================================================== */}

      <Route
        path="/team-lead-dashboard"
        element={
          <Navigate
            to="/teamlead/dashboard"
            replace
          />
        }
      />

      {/* =====================================================
          404
      ===================================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
