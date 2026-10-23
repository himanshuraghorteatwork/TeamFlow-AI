
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import LandingPage from "./component/LandingPage/LandingPage.jsx";
import ChooseRole from "./component/ChooseRole/ChooseRole.jsx";
import Login from "./component/Login/login.jsx";
import Signup from "./component/Signup/Signup.jsx";

// Existing application pages
import Chat from "./component/Chat/Chat.jsx";
import Tasks from "./component/Tasks/Tasks.jsx";
import Calendar from "./component/Calendar/Calendar.jsx";
import Team from "./component/Team/Team.jsx";
import Projects from "./component/Projects/Projects.jsx";
import Bugs from "./component/Bugs/Bugs.jsx";
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

function App() {
  return (
    <Routes>
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
    </Routes>
  );
}

export default App;
