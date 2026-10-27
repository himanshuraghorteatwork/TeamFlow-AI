import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Mail,
  Smartphone,
  Laptop,
  Check,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Send,
  Clock,
  Moon,
  Volume2,
  VolumeX,
  Radio,
  Sliders,
  ShieldAlert,
  UserRound,
  Settings,
  Palette,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Zap,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminNotifications.css";

const STORAGE_KEY = "teamflow_admin_notifications_v2";

const defaultPreferences = {
  // Channel Matrix by Event Category
  channels: {
    tasks: { inApp: true, email: true, push: true, sms: false },
    projects: { inApp: true, email: true, push: false, sms: false },
    system: { inApp: true, email: true, push: true, sms: true },
    workspace: { inApp: true, email: false, push: true, sms: false },
    security: { inApp: true, email: true, push: true, sms: true },
    ai: { inApp: true, email: false, push: false, sms: false },
    billing: { inApp: true, email: true, push: false, sms: false },
  },

  // Frequency & Batching
  digestFrequency: "daily", // 'instant' | 'daily' | 'weekly'
  digestTime: "09:00",
  batchingEnabled: true,
  batchWindow: 15, // minutes

  // Quiet Hours & DND
  quietHoursEnabled: true,
  quietStart: "22:00",
  quietEnd: "07:00",
  quietTimezone: "America/Los_Angeles",
  allowCriticalOverride: true,

  // Webhook Integrations
  slackWebhook: "",
  discordWebhook: "",
  teamsWebhook: "",
};

const CATEGORIES = [
  {
    id: "tasks",
    title: "Tasks & Deliverables",
    description: "Assignments, status updates, deadline warnings, and task completions.",
    icon: CheckCircle2,
    color: "#10b981",
  },
  {
    id: "projects",
    title: "Project Milestones",
    description: "Sprint phase completions, roadmap revisions, and blocker alerts.",
    icon: Sliders,
    color: "#3b82f6",
  },
  {
    id: "system",
    title: "System & Infrastructure",
    description: "Scheduled maintenance windows, telemetry cluster spikes, and service latency.",
    icon: Zap,
    color: "#f59e0b",
  },
  {
    id: "workspace",
    title: "Workspace & Team Activity",
    description: "New member invitations, workspace quota limits, and role elevations.",
    icon: Building2,
    color: "#6366f1",
  },
  {
    id: "security",
    title: "Security & Authentication",
    description: "New unrecognized logins, 2FA recovery attempts, and policy changes.",
    icon: ShieldAlert,
    color: "#ef4444",
  },
  {
    id: "ai",
    title: "AI Governance & Quotas",
    description: "Monthly token consumption warnings and model rate limit triggers.",
    icon: Sparkles,
    color: "#8b5cf6",
  },
  {
    id: "billing",
    title: "Invoices & Billing",
    description: "Payment receipts, recurring renewals, and seat quota upgrades.",
    icon: Radio,
    color: "#06b6d4",
  },
];

export default function AdminNotifications() {
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...defaultPreferences, ...JSON.parse(saved) };
    } catch (e) {
      console.error(e);
    }
    return defaultPreferences;
  });

  const [savedPreferences, setSavedPreferences] = useState(() => JSON.parse(JSON.stringify(preferences)));
  const [toast, setToast] = useState(null);
  const [testNotificationSent, setTestNotificationSent] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);

  const hasChanges = JSON.stringify(preferences) !== JSON.stringify(savedPreferences);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleChannelToggle = (category, channel) => {
    setPreferences((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [category]: {
          ...prev.channels[category],
          [channel]: !prev.channels[category][channel],
        },
      },
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      setSavedPreferences(JSON.parse(JSON.stringify(preferences)));
      showToast("Notification preferences saved successfully!");
    } catch (err) {
      showToast("Failed to save notification preferences.", "error");
    }
  };

  const handleReset = () => {
    setPreferences(defaultPreferences);
    setSavedPreferences(defaultPreferences);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPreferences));
    showToast("Preferences restored to default SaaS configuration.");
  };

  const handleSendTestAlert = () => {
    setTestNotificationSent(true);
    showToast("Test notification dispatched to active admin channels!");
    setTimeout(() => setTestNotificationSent(false), 5000);
  };

  const handleTestWebhook = (provider) => {
    setTestingWebhook(true);
    setTimeout(() => {
      setTestingWebhook(false);
      showToast(`Test payload delivered successfully to ${provider} webhook!`);
    }, 1000);
  };

  return (
    <div className="tfAdminNotifications">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <main className="tfAdminNotifications__main">
        <AdminTopbar onMobileMenuToggle={() => setMobileSidebarOpen(true)} />

        <div className="tfAdminNotifications__content">
          {/* TOAST ALERT */}
          {toast && (
            <div className={`tfAdminNotifications__toast ${toast.type || "success"}`}>
              <CheckCircle2 size={16} />
              <span>{toast.message}</span>
            </div>
          )}

          {/* TOP MODULE TABS */}
          <div className="tfAdminSettings__moduleTabs">
            <button
              type="button"
              className="tfAdminSettings__moduleTab "
              onClick={() => navigate("/admin/profile")}
            >
              <UserRound size={14} />
              <span>Profile</span>
            </button>
            <button
              type="button"
              className="tfAdminSettings__moduleTab "
              onClick={() => navigate("/admin/account-settings")}
            >
              <Settings size={14} />
              <span>Account</span>
            </button>
            <button
              type="button"
              className="tfAdminSettings__moduleTab "
              onClick={() => navigate("/admin/appearance")}
            >
              <Palette size={14} />
              <span>Appearance</span>
            </button>
            <button
              type="button"
              className="tfAdminSettings__moduleTab tfAdminSettings__moduleTab--active"
              onClick={() => navigate("/admin/notifications")}
            >
              <Bell size={14} />
              <span>Notifications</span>
            </button>
            <button
              type="button"
              className="tfAdminSettings__moduleTab "
              onClick={() => navigate("/admin/security")}
            >
              <ShieldCheck size={14} />
              <span>Security</span>
            </button>
            <button
              type="button"
              className="tfAdminSettings__moduleTab "
              onClick={() => navigate("/admin/settings")}
            >
              <Building2 size={14} />
              <span>Organization Settings</span>
            </button>
          </div>

          {/* PAGE HEADER */}
          <section className="tfAdminNotifications__header">
            <div>
              <div className="title-row">
                <h1>Notification Preferences</h1>
                <span className="badge-tag">SaaS Matrix</span>
              </div>
              <p>Configure cross-channel delivery alerts, email digests, quiet hour schedules, and third-party webhook integrations.</p>
            </div>

            <div className="header-actions">
              <button type="button" className="btn-secondary" onClick={handleReset}>
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
              <button type="button" className="btn-secondary" onClick={handleSendTestAlert}>
                <Send size={14} />
                <span>Send Test Alert</span>
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSave}
                disabled={!hasChanges}
              >
                <Check size={14} />
                <span>Save Preferences</span>
              </button>
            </div>
          </section>

          {/* TEST ALERT PREVIEW BANNER */}
          {testNotificationSent && (
            <div className="tfAdminNotifications__livePreviewBanner">
              <div className="banner-left">
                <div className="banner-icon-pulse">
                  <Bell size={18} />
                </div>
                <div>
                  <strong>[Live Preview] Deployment Sprint #14 Finalized</strong>
                  <p>Telemetry pipelines verified. 12 tasks marked complete by Priya Patel.</p>
                </div>
              </div>
              <span className="banner-badge">Just Now</span>
            </div>
          )}

          {/* SECTION 1: CHANNEL DELIVERY MATRIX */}
          <section className="settings-card">
            <div className="card-header-bar">
              <div>
                <h2>Channel Delivery Matrix</h2>
                <p>Granularly toggle which platform channels deliver notifications for specific event triggers.</p>
              </div>
            </div>

            <div className="matrix-table-wrap">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Event Category</th>
                    <th style={{ textAlign: "center" }}>
                      <div className="channel-col-header">
                        <Bell size={14} />
                        <span>In-App</span>
                      </div>
                    </th>
                    <th style={{ textAlign: "center" }}>
                      <div className="channel-col-header">
                        <Mail size={14} />
                        <span>Email</span>
                      </div>
                    </th>
                    <th style={{ textAlign: "center" }}>
                      <div className="channel-col-header">
                        <Laptop size={14} />
                        <span>Desktop</span>
                      </div>
                    </th>
                    <th style={{ textAlign: "center" }}>
                      <div className="channel-col-header">
                        <Smartphone size={14} />
                        <span>SMS Critical</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const catChannels = preferences.channels[cat.id] || {};

                    return (
                      <tr key={cat.id}>
                        <td>
                          <div className="cat-cell">
                            <span className="cat-icon-chip" style={{ background: `${cat.color}15`, color: cat.color }}>
                              <Icon size={16} />
                            </span>
                            <div>
                              <strong>{cat.title}</strong>
                              <small>{cat.description}</small>
                            </div>
                          </div>
                        </td>

                        {/* IN-APP */}
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className={`toggle-check-btn ${catChannels.inApp ? "active" : ""}`}
                            onClick={() => handleChannelToggle(cat.id, "inApp")}
                            aria-label={`Toggle In-App alerts for ${cat.title}`}
                          >
                            <span className="toggle-check-knob" />
                          </button>
                        </td>

                        {/* EMAIL */}
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className={`toggle-check-btn ${catChannels.email ? "active" : ""}`}
                            onClick={() => handleChannelToggle(cat.id, "email")}
                            aria-label={`Toggle Email alerts for ${cat.title}`}
                          >
                            <span className="toggle-check-knob" />
                          </button>
                        </td>

                        {/* DESKTOP */}
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className={`toggle-check-btn ${catChannels.push ? "active" : ""}`}
                            onClick={() => handleChannelToggle(cat.id, "push")}
                            aria-label={`Toggle Desktop Push alerts for ${cat.title}`}
                          >
                            <span className="toggle-check-knob" />
                          </button>
                        </td>

                        {/* SMS */}
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className={`toggle-check-btn ${catChannels.sms ? "active" : ""}`}
                            onClick={() => handleChannelToggle(cat.id, "sms")}
                            aria-label={`Toggle SMS Critical alerts for ${cat.title}`}
                          >
                            <span className="toggle-check-knob" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 2: DIGEST & BATCHING PREFERENCES */}
          <div className="settings-grid-2">
            <section className="settings-card">
              <div className="card-header-bar">
                <div>
                  <h2>Email Digest & Dispatch</h2>
                  <p>Aggregate platform updates into curated scheduled briefings.</p>
                </div>
              </div>

              <div className="radio-group-stack">
                <label className={`radio-card ${preferences.digestFrequency === "instant" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="digestFrequency"
                    value="instant"
                    checked={preferences.digestFrequency === "instant"}
                    onChange={(e) => setPreferences({ ...preferences, digestFrequency: e.target.value })}
                  />
                  <div>
                    <strong>Real-time Instant Delivery</strong>
                    <p>Dispatch separate email notifications as events occur immediately.</p>
                  </div>
                </label>

                <label className={`radio-card ${preferences.digestFrequency === "daily" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="digestFrequency"
                    value="daily"
                    checked={preferences.digestFrequency === "daily"}
                    onChange={(e) => setPreferences({ ...preferences, digestFrequency: e.target.value })}
                  />
                  <div>
                    <strong>Daily Morning Digest (Recommended)</strong>
                    <p>Receive a single consolidated report summarizing sprint deliverables and activity.</p>
                  </div>
                </label>

                <label className={`radio-card ${preferences.digestFrequency === "weekly" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="digestFrequency"
                    value="weekly"
                    checked={preferences.digestFrequency === "weekly"}
                    onChange={(e) => setPreferences({ ...preferences, digestFrequency: e.target.value })}
                  />
                  <div>
                    <strong>Weekly Executive Briefing</strong>
                    <p>Consolidated high-level recap delivered every Monday morning.</p>
                  </div>
                </label>
              </div>

              <div className="form-group-inline mt-4">
                <label>Preferred Delivery Time</label>
                <input
                  type="time"
                  value={preferences.digestTime}
                  onChange={(e) => setPreferences({ ...preferences, digestTime: e.target.value })}
                  className="time-input"
                />
              </div>
            </section>

            {/* SECTION 3: QUIET HOURS & DO NOT DISTURB */}
            <section className="settings-card">
              <div className="card-header-bar">
                <div>
                  <h2>Quiet Hours & Do Not Disturb</h2>
                  <p>Silence non-urgent push notifications and emails during off-hours.</p>
                </div>
                <button
                  type="button"
                  className={`toggle-check-btn ${preferences.quietHoursEnabled ? "active" : ""}`}
                  onClick={() =>
                    setPreferences({ ...preferences, quietHoursEnabled: !preferences.quietHoursEnabled })
                  }
                >
                  <span className="toggle-check-knob" />
                </button>
              </div>

              <div className="quiet-hours-controls">
                <div className="time-range-row">
                  <div className="form-group">
                    <label>From</label>
                    <input
                      type="time"
                      value={preferences.quietStart}
                      onChange={(e) => setPreferences({ ...preferences, quietStart: e.target.value })}
                      disabled={!preferences.quietHoursEnabled}
                    />
                  </div>
                  <div className="form-group">
                    <label>To</label>
                    <input
                      type="time"
                      value={preferences.quietEnd}
                      onChange={(e) => setPreferences({ ...preferences, quietEnd: e.target.value })}
                      disabled={!preferences.quietHoursEnabled}
                    />
                  </div>
                </div>

                <div className="form-group mt-3">
                  <label>Timezone</label>
                  <select
                    value={preferences.quietTimezone}
                    onChange={(e) => setPreferences({ ...preferences, quietTimezone: e.target.value })}
                    disabled={!preferences.quietHoursEnabled}
                  >
                    <option value="America/Los_Angeles">Pacific Time (US & Canada) - GMT-7</option>
                    <option value="America/New_York">Eastern Time (US & Canada) - GMT-4</option>
                    <option value="Europe/London">London (GMT+1)</option>
                    <option value="Asia/Kolkata">India Standard Time (IST) - GMT+5:30</option>
                    <option value="Asia/Tokyo">Tokyo (JST) - GMT+9</option>
                  </select>
                </div>

                <div className="checkbox-row mt-4">
                  <input
                    type="checkbox"
                    id="overrideCritical"
                    checked={preferences.allowCriticalOverride}
                    onChange={(e) =>
                      setPreferences({ ...preferences, allowCriticalOverride: e.target.checked })
                    }
                  />
                  <label htmlFor="overrideCritical">
                    <strong>Allow Critical Security Overrides</strong>
                    <p>Severe platform outages and unauthorized login alerts will bypass quiet hours.</p>
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* SECTION 4: WEBHOOK & THIRD-PARTY INTEGRATIONS */}
          <section className="settings-card mt-4">
            <div className="card-header-bar">
              <div>
                <h2>Third-Party Webhooks & Integrations</h2>
                <p>Broadcast organizational telemetry and alerts directly into your communication squads.</p>
              </div>
            </div>

            <div className="webhook-rows-stack">
              {/* SLACK */}
              <div className="webhook-row">
                <div className="webhook-info">
                  <div className="webhook-icon-chip slack">
                    <Sliders size={18} />
                  </div>
                  <div>
                    <strong>Slack Incoming Webhook</strong>
                    <p>Post automated sprint notifications into dedicated team channels.</p>
                  </div>
                </div>
                <div className="webhook-input-group">
                  <input
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={preferences.slackWebhook}
                    onChange={(e) => setPreferences({ ...preferences, slackWebhook: e.target.value })}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleTestWebhook("Slack")}
                    disabled={testingWebhook || !preferences.slackWebhook}
                  >
                    {testingWebhook ? "Sending..." : "Test Ping"}
                  </button>
                </div>
              </div>

              {/* DISCORD */}
              <div className="webhook-row">
                <div className="webhook-info">
                  <div className="webhook-icon-chip discord">
                    <Radio size={18} />
                  </div>
                  <div>
                    <strong>Discord Channel Webhook</strong>
                    <p>Forward developer alert logs and bug escalation notices.</p>
                  </div>
                </div>
                <div className="webhook-input-group">
                  <input
                    type="url"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={preferences.discordWebhook}
                    onChange={(e) => setPreferences({ ...preferences, discordWebhook: e.target.value })}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleTestWebhook("Discord")}
                    disabled={testingWebhook || !preferences.discordWebhook}
                  >
                    Test Ping
                  </button>
                </div>
              </div>

              {/* TEAMS */}
              <div className="webhook-row">
                <div className="webhook-info">
                  <div className="webhook-icon-chip teams">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <strong>Microsoft Teams Connector</strong>
                    <p>Broadcast high-priority executive summaries into Teams channels.</p>
                  </div>
                </div>
                <div className="webhook-input-group">
                  <input
                    type="url"
                    placeholder="https://outlook.office.com/webhook/..."
                    value={preferences.teamsWebhook}
                    onChange={(e) => setPreferences({ ...preferences, teamsWebhook: e.target.value })}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleTestWebhook("Teams")}
                    disabled={testingWebhook || !preferences.teamsWebhook}
                  >
                    Test Ping
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* FLOATING SAVE BAR */}
          {hasChanges && (
            <div className="notifications-save-bar">
              <div className="save-bar-info">
                <AlertTriangle size={18} />
                <div>
                  <strong>Unsaved changes detected</strong>
                  <p>You have unsaved changes in your notification rules.</p>
                </div>
              </div>
              <div className="save-bar-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setPreferences(savedPreferences)}
                >
                  Discard
                </button>
                <button type="button" className="btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
