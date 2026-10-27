import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Mail,
  Smartphone,
  Bot,
  Moon,
  Check,
  RotateCcw,
  UserRound,
  ShieldCheck,
  Palette,
  Settings,
  Sparkles,
  Volume2,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminNotifications.css";

const STORAGE_KEY = "teamflow_admin_notification_settings";

const defaultNotifications = {
  // Email
  emailDailyDigest: true,
  emailProjectMilestones: true,
  emailTaskAssignments: true,
  emailSecurityAlerts: true,
  emailBillingAlerts: true,
  emailProductUpdates: false,

  // Push / In-App
  pushDesktopAlerts: true,
  pushSoundAlerts: false,
  pushChatMentions: true,
  pushWorkspaceRequests: true,

  // AI Insights
  aiWeeklyReport: true,
  aiBottleneckAlerts: true,
  aiTaskSummaries: false,

  // Quiet Hours
  quietHoursEnabled: true,
  quietStart: "22:00",
  quietEnd: "08:00",
  quietAllowEmergency: true,
};

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultNotifications, ...JSON.parse(saved) } : defaultNotifications;
    } catch {
      return defaultNotifications;
    }
  });

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleEnableAll = () => {
    setNotifications((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((k) => {
        if (typeof updated[k] === "boolean") {
          updated[k] = true;
        }
      });
      return updated;
    });
  };

  const handleDisableAll = () => {
    setNotifications((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((k) => {
        if (typeof updated[k] === "boolean" && k !== "emailSecurityAlerts") {
          updated[k] = false;
        }
      });
      return updated;
    });
  };

  const handleSendTest = () => {
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 4000);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save notification settings:", err);
    }
  };

  const handleReset = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setNotifications(saved ? { ...defaultNotifications, ...JSON.parse(saved) } : defaultNotifications);
    } catch {
      setNotifications(defaultNotifications);
    }
  };

  return (
    <div className="tfAdminNotifications">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <main className="tfAdminNotifications__main">
        {/* TOPBAR */}
        <AdminTopbar onMobileMenuToggle={() => setMobileSidebarOpen(true)} />

        {/* CONTENT */}
        <div className="tfAdminNotifications__content">
          {savedSuccess && (
            <div className="tfAdminNotifications__toast">
              <Check size={18} />
              <span>Notification preferences saved successfully!</span>
            </div>
          )}

          {testNotificationSent && (
            <div className="tfAdminNotifications__sampleNotification">
              <Bell size={18} className="tfAdminNotifications__sampleIcon" />
              <div>
                <strong>Test Notification • TeamFlow AI</strong>
                <p>This is a live preview of how in-app admin alerts appear in your dashboard.</p>
              </div>
            </div>
          )}

          {/* PAGE HEADER (IDENTICAL STRUCTURE TO PROFILE, ACCOUNT SETTINGS, APPEARANCE & SECURITY) */}
          <div className="tfAdminNotifications__header">
            <div>
              <h1>Notification Preferences</h1>
              <p>Configure which alerts you receive across email, desktop push, and team channels.</p>
            </div>

            <div className="tfAdminNotifications__headerActions">
              <button
                type="button"
                className="tfAdminNotifications__btnSecondary"
                onClick={handleReset}
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>
              <button
                type="button"
                className="tfAdminNotifications__btnPrimary"
                onClick={handleSubmit}
              >
                <Check size={15} />
                <span>Save Preferences</span>
              </button>
            </div>
          </div>

          {/* NAV TABS (IDENTICAL UNDERLINE STYLE TO PROFILE, ACCOUNT SETTINGS, APPEARANCE & SECURITY) */}
          <div className="tfAdminNotifications__tabs">
            <button
              type="button"
              className="tfAdminNotifications__tab"
              onClick={() => navigate("/admin/profile")}
            >
              <UserRound size={15} />
              <span>Profile</span>
            </button>
            <button
              type="button"
              className="tfAdminNotifications__tab"
              onClick={() => navigate("/admin/account-settings")}
            >
              <Settings size={15} />
              <span>Account Settings</span>
            </button>
            <button
              type="button"
              className="tfAdminNotifications__tab"
              onClick={() => navigate("/admin/appearance")}
            >
              <Palette size={15} />
              <span>Appearance</span>
            </button>
            <button
              type="button"
              className="tfAdminNotifications__tab tfAdminNotifications__tab--active"
            >
              <Bell size={15} />
              <span>Notifications</span>
            </button>
            <button
              type="button"
              className="tfAdminNotifications__tab"
              onClick={() => navigate("/admin/security")}
            >
              <ShieldCheck size={15} />
              <span>Security</span>
            </button>
          </div>

          {/* QUICK BATCH ACTIONS */}
          <div className="tfAdminNotifications__quickToolbar">
            <div className="tfAdminNotifications__quickToolbarInfo">
              <span>Quick Actions:</span>
              <button type="button" onClick={handleEnableAll} className="tfAdminNotifications__pillBtn">
                Enable All
              </button>
              <button type="button" onClick={handleDisableAll} className="tfAdminNotifications__pillBtn">
                Mute Optional
              </button>
            </div>
            <button type="button" onClick={handleSendTest} className="tfAdminNotifications__testBtn">
              <Bell size={14} />
              <span>Send Test Notification</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="tfAdminNotifications__sections">
            {/* EMAIL NOTIFICATIONS */}
            <div className="tfAdminNotifications__card">
              <div className="tfAdminNotifications__cardHeader">
                <div className="tfAdminNotifications__cardIcon tfAdminNotifications__cardIcon--purple">
                  <Mail size={18} />
                </div>
                <div>
                  <h2>Email Notifications</h2>
                  <p>Choose which updates are delivered directly to your inbox at <strong>amit@abctech.com</strong>.</p>
                </div>
              </div>

              <div className="tfAdminNotifications__toggleList">
                <NotificationToggle
                  title="Daily Organization Digest"
                  description="A morning summary of active tasks, team achievements, and overdue deliverables."
                  checked={notifications.emailDailyDigest}
                  onChange={() => handleToggle("emailDailyDigest")}
                />

                <NotificationToggle
                  title="Project Milestone Updates"
                  description="Receive an email when projects reach 50%, 75%, or 100% completion."
                  checked={notifications.emailProjectMilestones}
                  onChange={() => handleToggle("emailProjectMilestones")}
                />

                <NotificationToggle
                  title="Task Assignments & Status Changes"
                  description="Alerts when tasks in your managed workspaces change priority or assignment."
                  checked={notifications.emailTaskAssignments}
                  onChange={() => handleToggle("emailTaskAssignments")}
                />

                <NotificationToggle
                  title="Security & Account Alerts"
                  description="Immediate notifications for unrecognized logins, password updates, or permission modifications (Recommended)."
                  checked={notifications.emailSecurityAlerts}
                  onChange={() => handleToggle("emailSecurityAlerts")}
                  badge="Critical"
                />

                <NotificationToggle
                  title="Billing & Subscription Invoices"
                  description="Monthly invoice receipts, payment confirmations, and tier renewal notices."
                  checked={notifications.emailBillingAlerts}
                  onChange={() => handleToggle("emailBillingAlerts")}
                />

                <NotificationToggle
                  title="Product News & Feature Announcements"
                  description="Periodic updates highlighting newly released TeamFlow AI modules and integrations."
                  checked={notifications.emailProductUpdates}
                  onChange={() => handleToggle("emailProductUpdates")}
                />
              </div>
            </div>

            {/* PUSH & IN-APP NOTIFICATIONS */}
            <div className="tfAdminNotifications__card">
              <div className="tfAdminNotifications__cardHeader">
                <div className="tfAdminNotifications__cardIcon tfAdminNotifications__cardIcon--blue">
                  <Smartphone size={18} />
                </div>
                <div>
                  <h2>Desktop & In-App Alerts</h2>
                  <p>Instant notifications shown inside the TeamFlow AI web app and browser banner.</p>
                </div>
              </div>

              <div className="tfAdminNotifications__toggleList">
                <NotificationToggle
                  title="Browser Desktop Push Alerts"
                  description="Display real-time popup notifications on your operating system desktop."
                  checked={notifications.pushDesktopAlerts}
                  onChange={() => handleToggle("pushDesktopAlerts")}
                />

                <NotificationToggle
                  title="Audible Alert Sounds"
                  description="Play a subtle chime when direct messages or high-priority notifications arrive."
                  checked={notifications.pushSoundAlerts}
                  onChange={() => handleToggle("pushSoundAlerts")}
                />

                <NotificationToggle
                  title="Team Chat Mentions (@Amit)"
                  description="Notify when a team member explicitly mentions your name in workspace channels."
                  checked={notifications.pushChatMentions}
                  onChange={() => handleToggle("pushChatMentions")}
                />

                <NotificationToggle
                  title="Workspace Membership Access Requests"
                  description="Alert when an employee requests permission to join a private team workspace."
                  checked={notifications.pushWorkspaceRequests}
                  onChange={() => handleToggle("pushWorkspaceRequests")}
                />
              </div>
            </div>

            {/* AI ASSISTANT NOTIFICATIONS */}
            <div className="tfAdminNotifications__card">
              <div className="tfAdminNotifications__cardHeader">
                <div className="tfAdminNotifications__cardIcon tfAdminNotifications__cardIcon--green">
                  <Bot size={18} />
                </div>
                <div>
                  <h2>AI Assistant & Intelligence Alerts</h2>
                  <p>Automated insight alerts generated by TeamFlow AI organizational models.</p>
                </div>
              </div>

              <div className="tfAdminNotifications__toggleList">
                <NotificationToggle
                  title="Weekly AI Workspace Analytics"
                  description="Weekly automated AI breakdown of organization velocity, team focus, and task bottlenecks."
                  checked={notifications.aiWeeklyReport}
                  onChange={() => handleToggle("aiWeeklyReport")}
                />

                <NotificationToggle
                  title="Project Risk & Bottleneck Detection"
                  description="AI proactive warnings when upcoming sprint tasks are mathematically at risk of delay."
                  checked={notifications.aiBottleneckAlerts}
                  onChange={() => handleToggle("aiBottleneckAlerts")}
                  badge="AI"
                />

                <NotificationToggle
                  title="Automated Standup & Meeting Summaries"
                  description="Instant AI transcription summaries delivered after team coordination calls."
                  checked={notifications.aiTaskSummaries}
                  onChange={() => handleToggle("aiTaskSummaries")}
                />
              </div>
            </div>

            {/* QUIET HOURS */}
            <div className="tfAdminNotifications__card">
              <div className="tfAdminNotifications__cardHeader">
                <div className="tfAdminNotifications__cardIcon tfAdminNotifications__cardIcon--orange">
                  <Moon size={18} />
                </div>
                <div>
                  <h2>Do Not Disturb & Quiet Hours</h2>
                  <p>Pause non-critical notifications outside your typical work schedule.</p>
                </div>
              </div>

              <div className="tfAdminNotifications__toggleList">
                <NotificationToggle
                  title="Enable Quiet Hours Schedule"
                  description="Automatically suppress desktop and sound alerts during specified rest hours."
                  checked={notifications.quietHoursEnabled}
                  onChange={() => handleToggle("quietHoursEnabled")}
                />
              </div>

              {notifications.quietHoursEnabled && (
                <div className="tfAdminNotifications__quietSchedule">
                  <div className="tfAdminNotifications__timeFields">
                    <div className="tfAdminNotifications__field">
                      <label>Quiet Hours Start</label>
                      <input
                        type="time"
                        value={notifications.quietStart}
                        onChange={(e) => handleChange("quietStart", e.target.value)}
                      />
                    </div>
                    <div className="tfAdminNotifications__field">
                      <label>Quiet Hours End</label>
                      <input
                        type="time"
                        value={notifications.quietEnd}
                        onChange={(e) => handleChange("quietEnd", e.target.value)}
                      />
                    </div>
                  </div>

                  <NotificationToggle
                    title="Allow Emergency & Security Alerts"
                    description="Permit critical two-factor authorization notices and server alerts even during quiet hours."
                    checked={notifications.quietAllowEmergency}
                    onChange={() => handleToggle("quietAllowEmergency")}
                  />
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="tfAdminNotifications__formFooter">
              <button
                type="button"
                className="tfAdminNotifications__btnSecondary"
                onClick={handleReset}
              >
                Reset Defaults
              </button>
              <button
                type="submit"
                className="tfAdminNotifications__btnPrimary"
              >
                <Check size={16} />
                <span>Save Notification Preferences</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

function NotificationToggle({ title, description, checked, onChange, badge }) {
  return (
    <label className="tfAdminNotifications__toggleRow">
      <div className="tfAdminNotifications__toggleMeta">
        <div className="tfAdminNotifications__titleRow">
          <strong>{title}</strong>
          {badge && <span className={`tfAdminNotifications__badge tfAdminNotifications__badge--${badge.toLowerCase()}`}>{badge}</span>}
        </div>
        <p>{description}</p>
      </div>

      <div className="tfAdminNotifications__switchWrap">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="tfAdminNotifications__checkbox"
        />
        <span className={`tfAdminNotifications__switch ${checked ? "active" : ""}`}>
          <span className="tfAdminNotifications__switchKnob" />
        </span>
      </div>
    </label>
  );
}
