import React, { useState } from "react";
import {
  Globe,
  Clock,
  Download,
  Check,
  RotateCcw,
  Sliders,
  AlertTriangle,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar.jsx";
import AdminSettingsNavTabs from "./AdminSettingsNavTabs.jsx";
import "./AdminAccountSettings.css";

const STORAGE_KEY = "teamflow_admin_account_settings";

const defaultSettings = {
  language: "en-US",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12h",
  firstDayOfWeek: "monday",
  numberFormat: "1,234.56",
  defaultProjectVisibility: "organization",
  defaultTaskPriority: "Medium",
  allowGuestInvites: true,
  allowFileAttachments: true,
  enableWeeklyDigest: true,
  workDays: ["mon", "tue", "wed", "thu", "fri"],
  workHourStart: "09:00",
  workHourEnd: "18:00",
};

export default function AdminAccountSettings() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const toggleWorkDay = (day) => {
    setSettings((prev) => {
      const exists = prev.workDays.includes(day);
      return {
        ...prev,
        workDays: exists ? prev.workDays.filter((d) => d !== day) : [...prev.workDays, day],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSavedSuccess("Account preferences saved successfully!");
      setTimeout(() => setSavedSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setErrorMessage("Failed to save settings: " + err.message);
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const handleReset = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setSettings(saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings);
      setSavedSuccess("Preferences reset successfully.");
      setTimeout(() => setSavedSuccess(""), 3000);
    } catch {
      setSettings(defaultSettings);
    }
  };

  const handleExportData = () => {
    try {
      const exportPayload = {
        exportedAt: new Date().toISOString(),
        profile: JSON.parse(localStorage.getItem("teamflow_admin_profile") || "{}"),
        accountSettings: settings,
        users: JSON.parse(localStorage.getItem("teamflow_admin_users") || "[]"),
        workspaces: JSON.parse(localStorage.getItem("teamflow_admin_workspaces") || "[]"),
        projects: JSON.parse(localStorage.getItem("teamflow_admin_projects") || "[]"),
        tasks: JSON.parse(localStorage.getItem("teamflow_admin_tasks") || "[]"),
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `teamflow_account_export_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setSavedSuccess("Organization data archive exported successfully!");
      setTimeout(() => setSavedSuccess(""), 3500);
    } catch (err) {
      setErrorMessage("Failed to export data: " + err.message);
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  return (
    <div className="tfAdminAccountSettings">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <main className="tfAdminAccountSettings__main">
        {/* TOPBAR */}
        <AdminTopbar onMobileMenuToggle={() => setMobileSidebarOpen(true)} />

        {/* CONTENT */}
        <div className="tfAdminAccountSettings__content">
          {savedSuccess && (
            <div className="tfAdminAccountSettings__toast tfAdminAccountSettings__toast--success">
              <Check size={18} />
              <span>{savedSuccess}</span>
            </div>
          )}

          {errorMessage && (
            <div className="tfAdminAccountSettings__toast tfAdminAccountSettings__toast--error">
              <AlertTriangle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STATIC TOP MODULE TABS */}
          <AdminSettingsNavTabs activeTab="account" />

          {/* PAGE HEADER */}
          <div className="tfAdminAccountSettings__header">
            <div>
              <h1>Account Settings</h1>
              <p>Configure language, localization, work schedule, and administrative preferences.</p>
            </div>

            <div className="tfAdminAccountSettings__headerActions">
              <button
                type="button"
                className="tfAdminAccountSettings__btnSecondary"
                onClick={handleReset}
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>
              <button
                type="button"
                className="tfAdminAccountSettings__btnPrimary"
                onClick={handleSubmit}
              >
                <Check size={15} />
                <span>Save Preferences</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="tfAdminAccountSettings__sections">
            {/* LOCALIZATION CARD */}
            <div className="tfAdminAccountSettings__card">
              <div className="tfAdminAccountSettings__cardHeader">
                <Globe size={18} className="tfAdminAccountSettings__headerIcon" />
                <div>
                  <h2>Language & Regional Settings</h2>
                  <p>Choose your primary language, date formatting, and regional numeric display.</p>
                </div>
              </div>

              <div className="tfAdminAccountSettings__formRow tfAdminAccountSettings__formRow--two">
                <div className="tfAdminAccountSettings__field">
                  <label>Primary Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                  >
                    <option value="en-US">English (United States)</option>
                    <option value="en-GB">English (United Kingdom)</option>
                    <option value="es">Español (Spanish)</option>
                    <option value="fr">Français (French)</option>
                    <option value="de">Deutsch (German)</option>
                    <option value="ja">日本語 (Japanese)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                  </select>
                </div>

                <div className="tfAdminAccountSettings__field">
                  <label>Date Format</label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => handleChange("dateFormat", e.target.value)}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 10/26/2026)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 26/10/2026)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-10-26)</option>
                  </select>
                </div>
              </div>

              <div className="tfAdminAccountSettings__formRow tfAdminAccountSettings__formRow--three">
                <div className="tfAdminAccountSettings__field">
                  <label>Time Format</label>
                  <select
                    value={settings.timeFormat}
                    onChange={(e) => handleChange("timeFormat", e.target.value)}
                  >
                    <option value="12h">12-hour (e.g. 2:30 PM)</option>
                    <option value="24h">24-hour (e.g. 14:30)</option>
                  </select>
                </div>

                <div className="tfAdminAccountSettings__field">
                  <label>First Day of Week</label>
                  <select
                    value={settings.firstDayOfWeek}
                    onChange={(e) => handleChange("firstDayOfWeek", e.target.value)}
                  >
                    <option value="monday">Monday (Recommended)</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>

                <div className="tfAdminAccountSettings__field">
                  <label>Number Format</label>
                  <select
                    value={settings.numberFormat}
                    onChange={(e) => handleChange("numberFormat", e.target.value)}
                  >
                    <option value="1,234.56">1,234.56 (Standard)</option>
                    <option value="1.234,56">1.234,56 (European)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* WORK SCHEDULE CARD */}
            <div className="tfAdminAccountSettings__card">
              <div className="tfAdminAccountSettings__cardHeader">
                <Clock size={18} className="tfAdminAccountSettings__headerIcon" />
                <div>
                  <h2>Work Schedule & Calendar Preferences</h2>
                  <p>Define standard organizational working days and business hours.</p>
                </div>
              </div>

              <div className="tfAdminAccountSettings__workDaysSection">
                <label>Working Days</label>
                <div className="tfAdminAccountSettings__dayPills">
                  {[
                    { id: "mon", label: "Mon" },
                    { id: "tue", label: "Tue" },
                    { id: "wed", label: "Wed" },
                    { id: "thu", label: "Thu" },
                    { id: "fri", label: "Fri" },
                    { id: "sat", label: "Sat" },
                    { id: "sun", label: "Sun" },
                  ].map((day) => {
                    const active = settings.workDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        className={`tfAdminAccountSettings__dayPill ${active ? "tfAdminAccountSettings__dayPill--active" : ""}`}
                        onClick={() => toggleWorkDay(day.id)}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="tfAdminAccountSettings__formRow tfAdminAccountSettings__formRow--two" style={{ marginTop: 16 }}>
                <div className="tfAdminAccountSettings__field">
                  <label>Working Hours Start</label>
                  <input
                    type="time"
                    value={settings.workHourStart}
                    onChange={(e) => handleChange("workHourStart", e.target.value)}
                  />
                </div>
                <div className="tfAdminAccountSettings__field">
                  <label>Working Hours End</label>
                  <input
                    type="time"
                    value={settings.workHourEnd}
                    onChange={(e) => handleChange("workHourEnd", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* WORKSPACE DEFAULTS */}
            <div className="tfAdminAccountSettings__card">
              <div className="tfAdminAccountSettings__cardHeader">
                <Sliders size={18} className="tfAdminAccountSettings__headerIcon" />
                <div>
                  <h2>Workspace Defaults</h2>
                  <p>Establish default rules applied when team leads create new projects or tasks.</p>
                </div>
              </div>

              <div className="tfAdminAccountSettings__formRow tfAdminAccountSettings__formRow--two">
                <div className="tfAdminAccountSettings__field">
                  <label>Default Project Visibility</label>
                  <select
                    value={settings.defaultProjectVisibility}
                    onChange={(e) => handleChange("defaultProjectVisibility", e.target.value)}
                  >
                    <option value="organization">Organization-wide (All members can view)</option>
                    <option value="private">Private (Workspace members only)</option>
                  </select>
                </div>

                <div className="tfAdminAccountSettings__field">
                  <label>Default Task Priority</label>
                  <select
                    value={settings.defaultTaskPriority}
                    onChange={(e) => handleChange("defaultTaskPriority", e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="tfAdminAccountSettings__toggleList">
                <label className="tfAdminAccountSettings__toggleRow">
                  <div>
                    <strong>Allow File Attachments</strong>
                    <p>Members can upload documents, images, and files up to 25MB to tasks.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowFileAttachments}
                    onChange={(e) => handleChange("allowFileAttachments", e.target.checked)}
                  />
                </label>

                <label className="tfAdminAccountSettings__toggleRow">
                  <div>
                    <strong>Allow Team Leads to Invite Guests</strong>
                    <p>Permit leads to invite external clients or contractors with restricted view access.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowGuestInvites}
                    onChange={(e) => handleChange("allowGuestInvites", e.target.checked)}
                  />
                </label>
              </div>
            </div>

            {/* DATA EXPORT & AUDIT */}
            <div className="tfAdminAccountSettings__card">
              <div className="tfAdminAccountSettings__cardHeader">
                <Download size={18} className="tfAdminAccountSettings__headerIcon" />
                <div>
                  <h2>Data Portability & Export</h2>
                  <p>Download a complete archive of your organization's workspaces, tasks, and settings.</p>
                </div>
              </div>

              <div className="tfAdminAccountSettings__exportBox">
                <div>
                  <strong>Export Organization Data (JSON)</strong>
                  <p>Includes all registered workspaces, team members, projects, task statuses, and configuration.</p>
                </div>
                <button
                  type="button"
                  className="tfAdminAccountSettings__btnOutline"
                  onClick={handleExportData}
                >
                  <Download size={15} />
                  <span>Download Export</span>
                </button>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="tfAdminAccountSettings__formFooter">
              <button
                type="button"
                className="tfAdminAccountSettings__btnSecondary"
                onClick={handleReset}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="tfAdminAccountSettings__btnPrimary"
              >
                <Check size={16} />
                <span>Save Account Settings</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

