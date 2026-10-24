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
          NORMAL USER ROUTES
      ===================================================== */}

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
          TEAM LEAD ROUTES
          
          TeamLeadLayout stays on screen.
          Outlet changes depending on selected sidebar page.
      ===================================================== */}

      <Route
        path="/teamlead"
        element={<TeamLeadLayout />}
      >

        {/* /teamlead -> /teamlead/dashboard */}

        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />


        {/* DASHBOARD */}

        <Route
          path="dashboard"
          element={<TeamLeadDashboard />}
        />


        {/* MY TEAM */}

        <Route
          path="team"
          element={<TeamLeadMyTeam />}
        />


        {/* PROJECTS */}

        <Route
          path="projects"
          element={<TeamLeadProject />}
        />


        {/* TASKS */}

        <Route
          path="tasks"
          element={<TeamLeadTask />}
        />


        {/* BUGS */}

        <Route
          path="bugs"
          element={<TeamLeadBug />}
        />


        {/* CALENDAR */}

        <Route
          path="calendar"
          element={<TeamLeadCalendar />}
        />


        {/* TEAM MEMBERS */}

        <Route
          path="member"
          element={<TeamMember1 />}
        />

        <Route
          path="member/:id"
          element={<TeamMember1 />}
        />


        {/* REPORTS */}

        <Route
          path="reports"
          element={<TeamLeadReport />}
        />


        {/* CHAT */}

        <Route
          path="chat"
          element={<TeamLeadChat />}
        />


        {/* AI ASSISTANT */}

        <Route
          path="ai-assistant"
          element={<TeamLeadAI />}
        />


        {/* SETTINGS */}

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