import "./App.css";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

/* =========================================================
   PUBLIC
========================================================= */

import LandingPage from "./component/LandingPage/LandingPage.jsx";
import Login from "./component/Login/login.jsx";
import Signup from "./component/Signup/Signup.jsx";

/* =========================================================
   NORMAL USER
========================================================= */

import Chat from "./component/Chat/Chat.jsx";
import Tasks from "./component/Tasks/Tasks.jsx";
import Calendar from "./component/Calendar/Calendar.jsx";
import Team from "./component/Team/Team.jsx";
import Projects from "./component/Projects/Projects.jsx";
import Bugs from "./component/Bugs/Bugs.jsx";
import File from "./component/File/File.jsx";

/* =========================================================
   ADMIN
========================================================= */

import AdminDashboard from "./component/dashboards/Admin/AdminDashboard.jsx";

import AdminWorkspace from "./component/dashboards/Admin/AdminWorkspace.jsx";

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
   TEAM LEAD
========================================================= */

import TeamLeadLayout from "./component/dashboards/TeamLead/TeamLeadLayout.jsx";

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

      {/* ================= PUBLIC ================= */}

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


      {/* ================= USER ================= */}

      <Route
        path="/chat"
        element={<Chat />}
      />

      <Route
        path="/tasks"
        element={<Tasks />}
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
        path="/projects"
        element={<Projects />}
      />

      <Route
        path="/bugs"
        element={<Bugs />}
      />

      <Route
        path="/files"
        element={<File />}
      />


      {/* =====================================================
          ADMIN
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

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/workspaces"
        element={<AdminWorkspace />}
      />

      <Route
        path="/admin/users"
        element={<AdminUsers />}
      />

      <Route
        path="/admin/projects"
        element={<AdminProjects />}
      />

      <Route
        path="/admin/tasks"
        element={<AdminTasks />}
      />

      <Route
        path="/admin/ai-tools"
        element={<AdminAITools />}
      />

      <Route
        path="/admin/billing"
        element={<AdminBilling />}
      />

      <Route
        path="/admin/subscriptions"
        element={<AdminSubscriptions />}
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
        path="/admin/reports"
        element={<AdminReports />}
      />

      <Route
        path="/admin/settings"
        element={<AdminSettings />}
      />


      {/* =====================================================
          TEAM LEAD
      ===================================================== */}

      <Route
        path="/teamlead"
        element={<TeamLeadLayout />}
      >

        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
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


      {/* OLD TEAM LEAD URL */}

      <Route
        path="/team-lead-dashboard"
        element={
          <Navigate
            to="/teamlead/dashboard"
            replace
          />
        }
      />


      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;