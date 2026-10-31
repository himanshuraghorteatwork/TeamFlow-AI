
import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";

/* PUBLIC PAGES */
import LandingPage from "./component/LandingPage/LandingPage.jsx";
import Login from "./component/Login/login.jsx";
import Signup from "./component/Signup/Signup.jsx";
import ChooseRole from "./component/ChooseRole/ChooseRole.jsx";

/* NORMAL USER PAGES */


/* EMPLOYEE DASHBOARD */
import Dashboard from "./component/dashboards/Employee/Dashboard.jsx";
import Chat from "./component/dashboards/Employee/Chat.jsx";
import Tasks from "./component/dashboards/Employee/Tasks.jsx";
import Calendar from "./component/dashboards/Employee/Calendar.jsx";
import Meetings from "./component/dashboards/Employee/Meetings.jsx";
import Team from "./component/dashboards/Employee/Team.jsx";
import Projects from "./component/dashboards/Employee/Projects.jsx";
import Bugs from "./component/dashboards/Employee/Bugs.jsx";
import File from "./component/dashboards/Employee/File.jsx";
import EmployeeAI from "./component/dashboards/Employee/AI.jsx";
import EmployeeSettings from "./component/dashboards/Employee/Settings.jsx"; 
import Activity from "./component/dashboards/Employee/Activity.jsx"; 
import TeamProgress from "./component/dashboards/Employee/TeamProgress.jsx"; 


/* SUPER ADMIN */
import SuperAdminLayout from "./component/dashboards/SuperAdmin/SuperAdminLayout.jsx";
import SuperAdminDashboard from "./component/dashboards/SuperAdmin/SuperAdminDashboard.jsx";
import Organizations from "./component/dashboards/SuperAdmin/Organizations.jsx";
import SuperAdminUsers from "./component/dashboards/SuperAdmin/Users.jsx";
import Plans from "./component/dashboards/SuperAdmin/Plans.jsx";
import SuperAdminSubscriptions from "./component/dashboards/SuperAdmin/Subscriptions.jsx";
import BillingPayments from "./component/dashboards/SuperAdmin/BillingPayments.jsx";
import Invoices from "./component/dashboards/SuperAdmin/Invoices.jsx";
import EmailConfig from "./component/dashboards/SuperAdmin/EmailConfig.jsx";
import EmailTemplates from "./component/dashboards/SuperAdmin/EmailTemplates.jsx";
import Announcements from "./component/dashboards/SuperAdmin/Announcements.jsx";
import AIConfiguration from "./component/dashboards/SuperAdmin/AIConfiguration.jsx";
import AIUsage from "./component/dashboards/SuperAdmin/AIUsage.jsx";
import SuperAdminAnalytics from "./component/dashboards/SuperAdmin/Analytics.jsx";
import ActivityLogs from "./component/dashboards/SuperAdmin/ActivityLogs.jsx";
import SystemHealth from "./component/dashboards/SuperAdmin/SystemHealth.jsx";
import Security from "./component/dashboards/SuperAdmin/Security.jsx";
import SuperAdminSettings from "./component/dashboards/SuperAdmin/Settings.jsx";
import HelpSupport from "./component/dashboards/SuperAdmin/HelpSupport.jsx";
import RolesPermissions from "./component/dashboards/SuperAdmin/RolesPermissions.jsx";

/* ADMIN */
import AdminDashboard from "./component/dashboards/Admin/AdminDashboard.jsx";
import AdminAITools from "./component/dashboards/Admin/AdminAITools.jsx";
import AdminAnalytics from "./component/dashboards/Admin/AdminAnalytics.jsx";
import AdminAnnouncements from "./component/dashboards/Admin/AdminAnnouncements.jsx";
import AdminBilling from "./component/dashboards/Admin/AdminBilling.jsx";
import AdminProjects from "./component/dashboards/Admin/AdminProjects.jsx";
import AdminReports from "./component/dashboards/Admin/AdminReports.jsx";
import AdminSettings from "./component/dashboards/Admin/AdminSettings.jsx";
import AdminSupport from "./component/dashboards/Admin/AdminSupport.jsx";
import AdminSubscriptions from "./component/dashboards/Admin/AdminSubscriptions.jsx";
import AdminTasks from "./component/dashboards/Admin/AdminTasks.jsx";
import AdminUsers from "./component/dashboards/Admin/AdminUsers.jsx";
import AdminWorkspace from "./component/dashboards/Admin/AdminWorkspace.jsx";
import AdminProfile from "./component/dashboards/Admin/AdminProfile.jsx";
import AdminAccountSettings from "./component/dashboards/Admin/AdminAccountSettings.jsx";
import AdminAppearance from "./component/dashboards/Admin/AdminAppearance.jsx";
import AdminNotifications from "./component/dashboards/Admin/AdminNotifications.jsx";
import AdminSecurity from "./component/dashboards/Admin/AdminSecurity.jsx";
import AdminRoles from "./component/dashboards/Admin/AdminRoles.jsx";
import AdminBugs from "./component/dashboards/Admin/AdminBugs.jsx";
import AdminCalendar from "./component/dashboards/Admin/AdminCalendar.jsx";
import AdminChat from "./component/dashboards/Admin/AdminChat.jsx";
import AdminAIUsage from "./component/dashboards/Admin/AdminAIUsage.jsx";
import AdminActivityLogs from "./component/dashboards/Admin/AdminActivityLogs.jsx";
import AdminInvoices from "./component/dashboards/Admin/AdminInvoices.jsx";

/* TEAM LEAD LAYOUT AND PAGES */
import TeamLeadLayout from "./component/dashboards/TeamLead/TeamLeadLayout.jsx";
import TeamLeadDashboard from "./component/dashboards/TeamLead/TeamLeadDashboard.jsx";
import TeamLeadWorkload from "./component/dashboards/TeamLead/Workload.jsx";
import TeamLeadFilesDocs from "./component/dashboards/TeamLead/FilesDocs.jsx";
import TeamLeadMeetings from "./component/dashboards/TeamLead/Meeting.jsx";
import TeamLeadAISummary from "./component/dashboards/TeamLead/AISummary.jsx";
import TeamLeadTaskSuggestions from "./component/dashboards/TeamLead/TaskSuggestions.jsx";
import TeamLeadProjectReports from "./component/dashboards/TeamLead/ProjectReports.jsx";
import TeamLeadNotifications from "./component/dashboards/TeamLead/Notifications.jsx";
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
import TeamLeadSprintHub from "./component/dashboards/TeamLead/SprintHub.jsx";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/choose-role" element={<ChooseRole />} />

      {/* SUPER ADMIN ROUTES */}
      <Route path="/superadmin" element={<SuperAdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="organizations" element={<Organizations />} />
        <Route path="users" element={<SuperAdminUsers />} />
        <Route path="roles" element={<RolesPermissions />} />
        <Route path="plans" element={<Plans />} />
        <Route path="subscriptions" element={<SuperAdminSubscriptions />} />
        <Route path="billing" element={<BillingPayments />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="email" element={<EmailConfig />} />
        <Route path="email-templates" element={<EmailTemplates />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="help-support" element={<HelpSupport />} />
        <Route path="ai-configuration" element={<AIConfiguration />} />
        <Route path="ai-usage" element={<AIUsage />} />
        <Route path="analytics" element={<SuperAdminAnalytics />} />
        <Route path="activity-logs" element={<ActivityLogs />} />
        <Route path="system-health" element={<SystemHealth />} />
        <Route path="security" element={<Security />} />
        <Route path="settings" element={<SuperAdminSettings />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/workspaces" element={<AdminWorkspace />} />
      <Route path="/admin/workspace" element={<Navigate to="/admin/workspaces" replace />} />
      <Route path="/admin/organization" element={<Navigate to="/admin/settings" replace />} />
      <Route path="/admin/organization-settings" element={<Navigate to="/admin/settings" replace />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/projects" element={<AdminProjects />} />
      <Route path="/admin/tasks" element={<AdminTasks />} />
      <Route path="/admin/ai-tools" element={<AdminAITools />} />
      <Route path="/admin/billing" element={<AdminBilling />} />
      <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/announcements" element={<AdminAnnouncements />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/support" element={<AdminSupport />} />
        <Route path="/admin/help" element={<AdminSupport />} />
      <Route path="/admin/roles" element={<AdminRoles />} />
      <Route path="/admin/bugs" element={<AdminBugs />} />
      <Route path="/admin/calendar" element={<AdminCalendar />} />
      <Route path="/admin/chat" element={<AdminChat />} />
      <Route path="/admin/ai-usage" element={<AdminAIUsage />} />
      <Route path="/admin/activity" element={<AdminActivityLogs />} />
      <Route path="/admin/activity-logs" element={<AdminActivityLogs />} />
      <Route path="/admin/invoices" element={<AdminInvoices />} />
      {/* ADMIN PROFILE DROPDOWN ROUTES */}
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/admin/account-settings" element={<AdminAccountSettings />} />
      <Route path="/admin/account" element={<Navigate to="/admin/account-settings" replace />} />
      <Route path="/admin/appearance" element={<AdminAppearance />} />
      <Route path="/admin/theme" element={<Navigate to="/admin/appearance" replace />} />
      <Route path="/admin/notifications" element={<AdminNotifications />} />
      <Route path="/admin/notification" element={<Navigate to="/admin/notifications" replace />} />
      <Route path="/admin/security" element={<AdminSecurity />} />

      {/* EMPLOYEE ROUTES */}
      <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
      <Route path="/dashboard" element={<Navigate to="/employee/dashboard" replace />} />
      <Route path="/employee/dashboard" element={<Dashboard />} />
      <Route path="/chat" element={<Navigate to="/employee/chat" replace />} />
      <Route path="/employee/chat" element={<Chat />} />
      <Route path="/tasks" element={<Navigate to="/employee/tasks" replace />} />
      <Route path="/employee/tasks" element={<Tasks />} />
      <Route path="/projects" element={<Navigate to="/employee/projects" replace />} />
      <Route path="/employee/projects" element={<Projects />} />
      <Route path="/employee/bugs" element={<Bugs />} />
      <Route path="/employee/calendar" element={<Calendar />} />
      <Route path="/meetings" element={<Navigate to="/employee/meetings" replace />} />
      <Route path="/employee/meetings" element={<Meetings />} />
      <Route path="/employee/team" element={<Team />} />
      <Route path="/files" element={<Navigate to="/employee/files" replace />}/>
      <Route path="/employee/files" element={<File />} />
      <Route path="/ai-assistant" element={<Navigate to="/employee/ai-assistant" replace />} />
      <Route path="/employee/ai-assistant" element={<EmployeeAI />} />
      <Route path="/settings" element={<Navigate to="/employee/settings" replace />}/>
      <Route path="/employee/settings" element={<EmployeeSettings />} />
      <Route path="/employee/notifications" element={<Navigate to="/employee/settings" replace />} />
      <Route path="/employee/profile" element={<Navigate to="/employee/settings" replace />} />
      <Route path="/activity" element={<Navigate to="/employee/activity" replace />} />
      <Route path="/employee/my-activity" element={<Navigate to="/employee/activity" replace />} />
      <Route path="/employee/activity" element={<Activity />} />
      <Route path="/team-progress" element={<Navigate to="/employee/team-progress" replace />} />
      <Route path="/employee/progress" element={<Navigate to="/employee/team-progress" replace />} />
      <Route path="/employee/team-progress" element={<TeamProgress />} />

      {/* TEAM LEAD ROUTES */}
      <Route path="/teamlead" element={<TeamLeadLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeamLeadDashboard />} />
        <Route path="sprints" element={<TeamLeadSprintHub />} />
        <Route path="sprint" element={<Navigate to="sprints" replace />} />
        <Route path="workload" element={<TeamLeadWorkload />} />
        <Route path="files" element={<TeamLeadFilesDocs />} />
        <Route path="meetings" element={<TeamLeadMeetings />} />
        <Route path="ai-summaries" element={<TeamLeadAISummary />} />
        <Route path="task-suggestions" element={<TeamLeadTaskSuggestions />} />
        <Route path="team" element={<TeamLeadMyTeam />} />
        <Route path="projects" element={<TeamLeadProject />} />
        <Route path="tasks" element={<TeamLeadTask />} />
        <Route path="bugs" element={<TeamLeadBug />} />
        <Route path="calendar" element={<TeamLeadCalendar />} />
        <Route path="member" element={<TeamMember1 />} />
        <Route path="member/:id" element={<TeamMember1 />} />
        <Route path="reports" element={<TeamLeadReport />} />
        <Route path="project-reports" element={<TeamLeadProjectReports />} />
        <Route path="chat" element={<TeamLeadChat />} />
        <Route path="ai-assistant" element={<TeamLeadAI />} />
        <Route path="notifications" element={<TeamLeadNotifications />} />
        <Route path="settings" element={<TeamLeadSetting />} />
      </Route>

      {/* OLD TEAM LEAD URL */}
      <Route path="/team-lead-dashboard" element={<Navigate to="/teamlead/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
