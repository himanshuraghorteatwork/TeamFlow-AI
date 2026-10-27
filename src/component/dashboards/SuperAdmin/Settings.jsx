
import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  Globe,
  LockKeyhole,
  Monitor,
  Save,
  ShieldCheck,
  UserRound,
  RotateCcw,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Settings.css";

const DEFAULT_SETTINGS = {
  platformName: "TeamFlow AI",
  supportEmail: "support@teamflow.ai",
  timezone: "Asia/Kolkata",
  language: "English",
  maintenanceMode: false,
  allowRegistration: true,
  emailNotifications: true,
  securityAlerts: true,
  weeklyReports: false,
  twoFactorAuth: true,
  sessionTimeout: "30",
  adminName: "Super Admin",
  adminEmail: "admin@teamflow.ai",
};

const STORAGE_KEY = "teamflow_superadmin_settings";

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function Settings() {
  const [settings, setSettings] = useState(loadSettings);
  const [savedSettings, setSavedSettings] = useState(loadSettings);
  const [activeTab, setActiveTab] = useState("general");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [message]);

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSavedSettings({ ...settings });
      setMessage("Settings saved successfully.");
    } catch {
      setMessage("Unable to save settings in this browser.");
    }
  };

  const handleReset = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    setMessage("Default values restored. Click Save Changes to apply them.");
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Admin Profile", icon: UserRound },
  ];

  const isDirty =
    JSON.stringify(settings) !== JSON.stringify(savedSettings);

  return (
    <div className="sa-settings">
      <div className="sa-settings-header">
        <div>
          <div className="sa-settings-eyebrow">ADMINISTRATION</div>
          <h1>Platform Settings</h1>
          <p>
            Manage your platform configuration, security, notifications, and
            administrator profile.
          </p>
        </div>

        <button
          className="sa-settings-save"
          type="button"
          onClick={handleSave}
        >
          <Save size={17} />
          Save Changes
        </button>
      </div>

      {message && (
        <div
          className={`sa-settings-toast ${
            message.startsWith("Unable") ? "error" : ""
          }`}
          role="status"
        >
          {message.startsWith("Unable") ? null : <Check size={17} />}
          {message}
        </div>
      )}

      <div className="sa-settings-summary">
        <div className="sa-settings-summary-icon">
          <Monitor size={22} />
        </div>
        <div className="sa-settings-summary-copy">
          <strong>{settings.platformName || "TeamFlow AI"}</strong>
          <span>Platform configuration</span>
        </div>
        <span className="sa-settings-local-badge">
          <span />
          {isDirty ? "Unsaved changes" : "Configuration loaded"}
        </span>
      </div>

      <div className="sa-settings-layout">
        <aside className="sa-settings-sidebar">
          <div className="sa-settings-nav-title">SETTINGS</div>

          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              className={`sa-settings-tab ${
                activeTab === id ? "active" : ""
              }`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}

          <div className="sa-settings-sidebar-note">
            <LockKeyhole size={18} />
            <strong>Administrator access</strong>
            <p>
              Changes made here are stored locally until your backend settings
              service is connected.
            </p>
          </div>
        </aside>

        <form className="sa-settings-content" onSubmit={handleSave}>
          {activeTab === "general" && (
            <>
              <div className="sa-settings-section-heading">
                <div className="sa-settings-section-icon">
                  <Globe size={20} />
                </div>
                <div>
                  <h2>General Settings</h2>
                  <p>Configure your platform's basic information.</p>
                </div>
              </div>

              <div className="sa-settings-fields">
                <label className="sa-settings-field">
                  <span>Platform name</span>
                  <input
                    value={settings.platformName}
                    onChange={(e) =>
                      updateSetting("platformName", e.target.value)
                    }
                    required
                  />
                  <small>This name identifies your SaaS platform.</small>
                </label>

                <label className="sa-settings-field">
                  <span>Support email</span>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) =>
                      updateSetting("supportEmail", e.target.value)
                    }
                    required
                  />
                  <small>Displayed as your support contact.</small>
                </label>

                <label className="sa-settings-field">
                  <span>Default timezone</span>
                  <select
                    value={settings.timezone}
                    onChange={(e) =>
                      updateSetting("timezone", e.target.value)
                    }
                  >
                    <option value="Asia/Kolkata">
                      India Standard Time (IST)
                    </option>
                    <option value="UTC">Coordinated Universal Time (UTC)</option>
                    <option value="America/New_York">
                      Eastern Time (ET)
                    </option>
                    <option value="Europe/London">London (GMT/BST)</option>
                    <option value="Asia/Dubai">Gulf Standard Time</option>
                  </select>
                </label>

                <label className="sa-settings-field">
                  <span>Display language</span>
                  <select
                    value={settings.language}
                    onChange={(e) =>
                      updateSetting("language", e.target.value)
                    }
                  >
                    <option>English</option>
                    <option>Hindi</option>
                  </select>
                </label>
              </div>

              <div className="sa-settings-divider" />

              <h3 className="sa-settings-subheading">
                Platform availability
              </h3>

              <SettingToggle
                title="Allow new registrations"
                description="Allow new organizations and users to sign up."
                checked={settings.allowRegistration}
                onChange={(value) =>
                  updateSetting("allowRegistration", value)
                }
              />

              <SettingToggle
                title="Maintenance mode"
                description="Mark the platform as undergoing maintenance."
                checked={settings.maintenanceMode}
                onChange={(value) =>
                  updateSetting("maintenanceMode", value)
                }
                warning
              />
            </>
          )}

          {activeTab === "security" && (
            <>
              <div className="sa-settings-section-heading">
                <div className="sa-settings-section-icon">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2>Security & Access</h2>
                  <p>Manage security preferences and session policies.</p>
                </div>
              </div>

              <SettingToggle
                title="Two-factor authentication"
                description="Set the platform policy requiring an additional sign-in verification step."
                checked={settings.twoFactorAuth}
                onChange={(value) => updateSetting("twoFactorAuth", value)}
              />

              <div className="sa-settings-divider" />

              <label className="sa-settings-field sa-settings-select-field">
                <span>Session timeout</span>
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    updateSetting("sessionTimeout", e.target.value)
                  }
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="120">2 hours</option>
                </select>
                <small>
                  Intended session policy. Enforcement requires backend
                  authentication integration.
                </small>
              </label>

              <div className="sa-settings-security-note">
                <LockKeyhole size={19} />
                <div>
                  <strong>Security controls are currently in demo mode</strong>
                  <p>
                    These preferences do not enforce two-factor authentication,
                    invalidate sessions, or change user permissions until
                    connected to your authentication backend.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <div className="sa-settings-section-heading">
                <div className="sa-settings-section-icon">
                  <Bell size={20} />
                </div>
                <div>
                  <h2>Notifications</h2>
                  <p>Choose the platform notifications you want enabled.</p>
                </div>
              </div>

              <SettingToggle
                title="Email notifications"
                description="Enable the preference for general platform email notifications."
                checked={settings.emailNotifications}
                onChange={(value) =>
                  updateSetting("emailNotifications", value)
                }
              />

              <SettingToggle
                title="Security alerts"
                description="Enable notifications for important security events."
                checked={settings.securityAlerts}
                onChange={(value) => updateSetting("securityAlerts", value)}
              />

              <SettingToggle
                title="Weekly reports"
                description="Enable the preference for a weekly platform summary."
                checked={settings.weeklyReports}
                onChange={(value) => updateSetting("weeklyReports", value)}
              />

              <div className="sa-settings-security-note">
                <Bell size={19} />
                <div>
                  <strong>Notification delivery</strong>
                  <p>
                    These options save your preferences only. Actual emails
                    and scheduled reports require a notification service.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === "profile" && (
            <>
              <div className="sa-settings-section-heading">
                <div className="sa-settings-section-icon">
                  <UserRound size={20} />
                </div>
                <div>
                  <h2>Admin Profile</h2>
                  <p>Manage the display details for the administrator.</p>
                </div>
              </div>

              <div className="sa-settings-profile-card">
                <div className="sa-settings-avatar">
                  {(settings.adminName || "SA")
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <strong>{settings.adminName || "Administrator"}</strong>
                  <span>Super Administrator</span>
                </div>
              </div>

              <div className="sa-settings-fields">
                <label className="sa-settings-field">
                  <span>Full name</span>
                  <input
                    value={settings.adminName}
                    onChange={(e) => updateSetting("adminName", e.target.value)}
                    required
                  />
                </label>

                <label className="sa-settings-field">
                  <span>Admin email</span>
                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) =>
                      updateSetting("adminEmail", e.target.value)
                    }
                    required
                  />
                  <small>
                    Updating this field does not change your login credentials.
                  </small>
                </label>
              </div>

              <div className="sa-settings-security-note">
                <LockKeyhole size={19} />
                <div>
                  <strong>Password and account security</strong>
                  <p>
                    Password changes and real account updates should be handled
                    through your authentication system.
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="sa-settings-footer">
            <button
              type="button"
              className="sa-settings-reset"
              onClick={handleReset}
            >
              <RotateCcw size={16} />
              Restore defaults
            </button>

            <button type="submit" className="sa-settings-save">
              <Save size={17} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SettingToggle({
  title,
  description,
  checked,
  onChange,
  warning = false,
}) {
  return (
    <div className="sa-settings-toggle-row">
      <div className="sa-settings-toggle-copy">
        <strong>{title}</strong>
        <p>{description}</p>
        {warning && checked && (
          <small className="sa-settings-warning">
            Demo only: this does not block access to the application.
          </small>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        className={`sa-settings-switch ${checked ? "on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}

export default Settings;
