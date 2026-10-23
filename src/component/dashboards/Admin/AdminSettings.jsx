import React, { useMemo, useState } from "react";
import {
  Settings,
  Building2,
  ShieldCheck,
  Bell,
  Bot,
  Mail,
  Database,
  Save,
  RotateCcw,
  Search,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Globe2,
  Users,
  HardDrive,
  LockKeyhole,
  Smartphone,
  Clock3,
  Send,
  Download,
  Trash2,
  Sparkles,
  X,
} from "lucide-react";

import AdminSidebar from "../../../layouts/AdminSidebar/AdminSidebar.jsx";
import {
  defaultAdminSettings,
  timezoneOptions,
  languageOptions,
  aiModelOptions,
} from "./adminSettingsData.js";

import "./AdminSettings.css";

const STORAGE_KEY = "teamflow_admin_settings";

const clone = (data) => JSON.parse(JSON.stringify(data));

const sections = [
  {
    id: "general",
    label: "General",
    description: "Platform identity & localization",
    icon: Settings,
  },
  {
    id: "workspace",
    label: "Workspace Defaults",
    description: "Default workspace configuration",
    icon: Building2,
  },
  {
    id: "security",
    label: "Security",
    description: "Authentication & access",
    icon: ShieldCheck,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Email & system alerts",
    icon: Bell,
  },
  {
    id: "ai",
    label: "AI Settings",
    description: "AI features & model",
    icon: Bot,
  },
  {
    id: "email",
    label: "Email",
    description: "SMTP configuration",
    icon: Mail,
  },
  {
    id: "privacy",
    label: "Data & Privacy",
    description: "Privacy & retention",
    icon: Database,
  },
];

function AdminSettings() {
  const [activeSection, setActiveSection] = useState("general");
  const [search, setSearch] = useState("");

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : clone(defaultAdminSettings);
    } catch {
      return clone(defaultAdminSettings);
    }
  });

  const [savedSettings, setSavedSettings] = useState(() =>
    clone(settings)
  );

  const [toast, setToast] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSMTPPassword, setShowSMTPPassword] = useState(false);

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const filteredSections = useMemo(() => {
    const query = search.toLowerCase();

    return sections.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }, [search]);

  const update = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const showMessage = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSavedSettings(clone(settings));

    showMessage("Settings saved successfully");
  };

  const discardChanges = () => {
    setSettings(clone(savedSettings));
    showMessage("Unsaved changes discarded", "info");
  };

  const resetSettings = () => {
    const defaults = clone(defaultAdminSettings);

    setSettings(defaults);
    setSavedSettings(defaults);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));

    setShowResetModal(false);

    showMessage("Settings restored to defaults");
  };

  const exportSettings = () => {
    const file = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = url;
    link.download = "teamflow-settings.json";
    link.click();

    URL.revokeObjectURL(url);

    showMessage("Settings exported");
  };

  return (
    <div className="settings-app">
      <AdminSidebar />

      <main className="settings-main">
        {/* HEADER */}

        <header className="settings-topbar">
          <div>
            <div className="settings-breadcrumb">
              <Settings size={14} />
              ADMIN
              <ChevronRight size={13} />
              SETTINGS
            </div>

            <h1>Settings</h1>

            <p>
              Manage your TeamFlow AI platform preferences and configuration.
            </p>
          </div>

          <div className="settings-header-actions">
            {hasChanges && (
              <span className="unsaved-indicator">
                <span />
                Unsaved changes
              </span>
            )}

            <button
              className="btn-secondary"
              onClick={() => setShowResetModal(true)}
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <button
              className="btn-primary"
              onClick={saveSettings}
              disabled={!hasChanges}
            >
              <Save size={15} />
              Save Changes
            </button>
          </div>
        </header>

        {/* SETTINGS BODY */}

        <div className="settings-container">
          {/* LEFT NAVIGATION */}

          <aside className="settings-sidebar-card">
            <div className="settings-search">
              <Search size={15} />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search settings..."
              />

              {search && (
                <button onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="settings-menu">
              {filteredSections.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    className={`settings-menu-item ${
                      activeSection === item.id ? "active" : ""
                    }`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <div className="settings-menu-icon">
                      <Icon size={17} />
                    </div>

                    <div>
                      <strong>{item.label}</strong>
                      <span>{item.description}</span>
                    </div>

                    <ChevronRight
                      className="settings-menu-arrow"
                      size={15}
                    />
                  </button>
                );
              })}

              {filteredSections.length === 0 && (
                <div className="settings-no-results">
                  No settings found
                </div>
              )}
            </div>

            <div className="settings-help">
              <div>
                <Sparkles size={18} />
              </div>

              <strong>Need help?</strong>

              <p>
                Contact support if you need help configuring TeamFlow.
              </p>

              <button onClick={() => alert("Support request opened.")}>
                Contact Support
              </button>
            </div>
          </aside>

          {/* RIGHT CONTENT */}

          <section className="settings-content-card">
            {activeSection === "general" && (
              <GeneralSettings
                data={settings.general}
                update={update}
              />
            )}

            {activeSection === "workspace" && (
              <WorkspaceSettings
                data={settings.workspace}
                update={update}
              />
            )}

            {activeSection === "security" && (
              <SecuritySettings
                data={settings.security}
                update={update}
                showMessage={showMessage}
              />
            )}

            {activeSection === "notifications" && (
              <NotificationSettings
                data={settings.notifications}
                update={update}
              />
            )}

            {activeSection === "ai" && (
              <AISettings
                data={settings.ai}
                update={update}
                showApiKey={showApiKey}
                setShowApiKey={setShowApiKey}
              />
            )}

            {activeSection === "email" && (
              <EmailSettings
                data={settings.email}
                update={update}
                showPassword={showSMTPPassword}
                setShowPassword={setShowSMTPPassword}
                showMessage={showMessage}
              />
            )}

            {activeSection === "privacy" && (
              <PrivacySettings
                data={settings.privacy}
                update={update}
                exportSettings={exportSettings}
                showMessage={showMessage}
              />
            )}

            {/* BOTTOM SAVE BAR */}

            {hasChanges && (
              <div className="settings-save-bar">
                <div>
                  <AlertTriangle size={17} />

                  <span>
                    <strong>You have unsaved changes</strong>
                    <small>
                      Save your changes before leaving this page.
                    </small>
                  </span>
                </div>

                <div>
                  <button
                    className="btn-secondary"
                    onClick={discardChanges}
                  >
                    Discard
                  </button>

                  <button
                    className="btn-primary"
                    onClick={saveSettings}
                  >
                    <Save size={14} />
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* RESET MODAL */}

      {showResetModal && (
        <div className="settings-modal-overlay">
          <div className="settings-modal">
            <div className="settings-modal-danger-icon">
              <RotateCcw size={24} />
            </div>

            <h2>Reset all settings?</h2>

            <p>
              This will restore all TeamFlow AI settings to their default
              values. This action cannot be undone.
            </p>

            <div className="settings-modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn-danger"
                onClick={resetSettings}
              >
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}

      {toast && (
        <div className={`settings-toast ${toast.type}`}>
          {toast.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertTriangle size={18} />
          )}

          {toast.message}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   GENERAL
========================================================= */

function GeneralSettings({ data, update }) {
  return (
    <>
      <PageHeader
        icon={Settings}
        title="General Settings"
        description="Manage your platform identity, localization and availability."
      />

      <SettingSection
        title="Platform Information"
        description="Information displayed across TeamFlow AI."
      >
        <div className="form-grid">
          <Field label="Platform Name">
            <input
              value={data.platformName}
              onChange={(e) =>
                update("general", "platformName", e.target.value)
              }
            />
          </Field>

          <Field label="Company Name">
            <input
              value={data.companyName}
              onChange={(e) =>
                update("general", "companyName", e.target.value)
              }
            />
          </Field>
        </div>

        <Field
          label="Support Email"
          hint="Users will see this email when they need support."
        >
          <input
            type="email"
            value={data.supportEmail}
            onChange={(e) =>
              update("general", "supportEmail", e.target.value)
            }
          />
        </Field>
      </SettingSection>

      <SettingSection
        title="Localization"
        description="Configure regional preferences for your platform."
      >
        <div className="form-grid">
          <Field label="Timezone">
            <select
              value={data.timezone}
              onChange={(e) =>
                update("general", "timezone", e.target.value)
              }
            >
              {timezoneOptions.map((timezone) => (
                <option key={timezone}>{timezone}</option>
              ))}
            </select>
          </Field>

          <Field label="Language">
            <select
              value={data.language}
              onChange={(e) =>
                update("general", "language", e.target.value)
              }
            >
              {languageOptions.map((language) => (
                <option key={language}>{language}</option>
              ))}
            </select>
          </Field>

          <Field label="Date Format">
            <select
              value={data.dateFormat}
              onChange={(e) =>
                update("general", "dateFormat", e.target.value)
              }
            >
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </Field>
        </div>
      </SettingSection>

      <SettingSection
        title="Platform Availability"
        description="Control whether TeamFlow is available to normal users."
      >
        <ToggleCard
          icon={AlertTriangle}
          title="Maintenance Mode"
          description="Temporarily disable normal user access while performing maintenance."
          checked={data.maintenanceMode}
          onChange={(value) =>
            update("general", "maintenanceMode", value)
          }
          danger
        />
      </SettingSection>
    </>
  );
}

/* =========================================================
   WORKSPACE
========================================================= */

function WorkspaceSettings({ data, update }) {
  return (
    <>
      <PageHeader
        icon={Building2}
        title="Workspace Defaults"
        description="Set the default configuration for new workspaces."
      />

      <SettingSection
        title="Workspace Permissions"
        description="Control what workspace owners and users can do."
      >
        <ToggleCard
          icon={Building2}
          title="Allow Workspace Creation"
          description="Users can create their own TeamFlow workspaces."
          checked={data.allowWorkspaceCreation}
          onChange={(value) =>
            update("workspace", "allowWorkspaceCreation", value)
          }
        />

        <ToggleCard
          icon={ShieldCheck}
          title="Require Admin Approval"
          description="New workspaces require administrator approval before activation."
          checked={data.requireWorkspaceApproval}
          onChange={(value) =>
            update("workspace", "requireWorkspaceApproval", value)
          }
        />

        <ToggleCard
          icon={Users}
          title="Allow Guest Users"
          description="Workspace owners can invite external guest users."
          checked={data.allowGuestUsers}
          onChange={(value) =>
            update("workspace", "allowGuestUsers", value)
          }
        />

        <ToggleCard
          icon={Globe2}
          title="Public Projects"
          description="Allow projects to be visible outside their workspace."
          checked={data.allowPublicProjects}
          onChange={(value) =>
            update("workspace", "allowPublicProjects", value)
          }
        />
      </SettingSection>

      <SettingSection
        title="Default Resource Limits"
        description="These limits are applied when a new workspace is created."
      >
        <div className="form-grid">
          <Field label="Member Limit">
            <div className="input-with-icon">
              <Users size={16} />

              <input
                type="number"
                min="1"
                value={data.defaultMemberLimit}
                onChange={(e) =>
                  update(
                    "workspace",
                    "defaultMemberLimit",
                    Number(e.target.value)
                  )
                }
              />
            </div>
          </Field>

          <Field label="Storage Limit">
            <div className="input-with-icon">
              <HardDrive size={16} />

              <input
                type="number"
                min="1"
                value={data.defaultStorage}
                onChange={(e) =>
                  update(
                    "workspace",
                    "defaultStorage",
                    Number(e.target.value)
                  )
                }
              />

              <span>GB</span>
            </div>
          </Field>
        </div>
      </SettingSection>
    </>
  );
}

/* =========================================================
   SECURITY
========================================================= */

function SecuritySettings({ data, update, showMessage }) {
  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const updatePassword = () => {
    if (!password.current) {
      alert("Enter your current password.");
      return;
    }

    if (password.newPassword.length < 8) {
      alert("New password must contain at least 8 characters.");
      return;
    }

    if (password.newPassword !== password.confirm) {
      alert("Passwords do not match.");
      return;
    }

    setPassword({
      current: "",
      newPassword: "",
      confirm: "",
    });

    showMessage("Password updated successfully");
  };

  return (
    <>
      <PageHeader
        icon={ShieldCheck}
        title="Security"
        description="Protect administrator accounts and TeamFlow data."
      />

      <SettingSection
        title="Authentication"
        description="Configure how users securely access TeamFlow."
      >
        <ToggleCard
          icon={Smartphone}
          title="Two-Factor Authentication"
          description="Require an additional verification step for administrators."
          checked={data.twoFactorAuth}
          onChange={(value) =>
            update("security", "twoFactorAuth", value)
          }
          recommended
        />

        <ToggleCard
          icon={LockKeyhole}
          title="Strong Password Policy"
          description="Require users to create secure passwords."
          checked={data.strongPasswords}
          onChange={(value) =>
            update("security", "strongPasswords", value)
          }
        />

        <ToggleCard
          icon={Bell}
          title="Login Alerts"
          description="Notify administrators about suspicious login attempts."
          checked={data.loginAlerts}
          onChange={(value) =>
            update("security", "loginAlerts", value)
          }
        />

        <ToggleCard
          icon={Users}
          title="Social Login"
          description="Allow users to sign in using supported social providers."
          checked={data.allowSocialLogin}
          onChange={(value) =>
            update("security", "allowSocialLogin", value)
          }
        />
      </SettingSection>

      <SettingSection
        title="Login Protection"
        description="Configure session and failed-login limits."
      >
        <div className="form-grid">
          <Field label="Session Timeout">
            <div className="input-with-icon">
              <Clock3 size={16} />

              <input
                type="number"
                min="5"
                value={data.sessionTimeout}
                onChange={(e) =>
                  update(
                    "security",
                    "sessionTimeout",
                    Number(e.target.value)
                  )
                }
              />

              <span>minutes</span>
            </div>
          </Field>

          <Field label="Maximum Login Attempts">
            <input
              type="number"
              min="1"
              value={data.maxLoginAttempts}
              onChange={(e) =>
                update(
                  "security",
                  "maxLoginAttempts",
                  Number(e.target.value)
                )
              }
            />
          </Field>
        </div>
      </SettingSection>

      <SettingSection
        title="Administrator Password"
        description="Change the password for your administrator account."
      >
        <div className="password-form">
          <Field label="Current Password">
            <input
              type="password"
              placeholder="Enter current password"
              value={password.current}
              onChange={(e) =>
                setPassword({
                  ...password,
                  current: e.target.value,
                })
              }
            />
          </Field>

          <div className="form-grid">
            <Field label="New Password">
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={password.newPassword}
                onChange={(e) =>
                  setPassword({
                    ...password,
                    newPassword: e.target.value,
                  })
                }
              />
            </Field>

            <Field label="Confirm Password">
              <input
                type="password"
                placeholder="Repeat new password"
                value={password.confirm}
                onChange={(e) =>
                  setPassword({
                    ...password,
                    confirm: e.target.value,
                  })
                }
              />
            </Field>
          </div>

          <button className="btn-outline" onClick={updatePassword}>
            <LockKeyhole size={15} />
            Update Password
          </button>
        </div>
      </SettingSection>
    </>
  );
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

function NotificationSettings({ data, update }) {
  return (
    <>
      <PageHeader
        icon={Bell}
        title="Notifications"
        description="Choose which events should notify administrators."
      />

      <SettingSection
        title="Admin Notifications"
        description="Control important platform alerts."
      >
        <ToggleCard
          icon={Mail}
          title="Email Notifications"
          description="Receive administrative alerts by email."
          checked={data.emailNotifications}
          onChange={(value) =>
            update("notifications", "emailNotifications", value)
          }
        />

        <ToggleCard
          icon={Users}
          title="New User Registrations"
          description="Notify admins when new users register."
          checked={data.newUserNotification}
          onChange={(value) =>
            update("notifications", "newUserNotification", value)
          }
        />

        <ToggleCard
          icon={Building2}
          title="Workspace Activity"
          description="Receive alerts about important workspace activity."
          checked={data.workspaceNotification}
          onChange={(value) =>
            update("notifications", "workspaceNotification", value)
          }
        />

        <ToggleCard
          icon={ShieldCheck}
          title="Security Alerts"
          description="Always stay informed about suspicious activity."
          checked={data.securityAlerts}
          onChange={(value) =>
            update("notifications", "securityAlerts", value)
          }
          recommended
        />

        <ToggleCard
          icon={Bell}
          title="Payment Notifications"
          description="Receive billing and subscription payment alerts."
          checked={data.paymentNotification}
          onChange={(value) =>
            update("notifications", "paymentNotification", value)
          }
        />

        <ToggleCard
          icon={Database}
          title="Weekly Report"
          description="Receive a weekly platform performance summary."
          checked={data.weeklyReport}
          onChange={(value) =>
            update("notifications", "weeklyReport", value)
          }
        />
      </SettingSection>
    </>
  );
}

/* =========================================================
   AI
========================================================= */

function AISettings({
  data,
  update,
  showApiKey,
  setShowApiKey,
}) {
  return (
    <>
      <PageHeader
        icon={Bot}
        title="AI Settings"
        description="Configure AI tools and usage across TeamFlow."
      />

      <div className="ai-status-card">
        <div className="ai-status-icon">
          <Sparkles size={22} />
        </div>

        <div>
          <strong>TeamFlow AI Engine</strong>
          <p>
            AI features are{" "}
            <b>{data.aiEnabled ? "enabled" : "disabled"}</b>.
          </p>
        </div>

        <Toggle
          checked={data.aiEnabled}
          onChange={(value) =>
            update("ai", "aiEnabled", value)
          }
        />
      </div>

      <SettingSection
        title="AI Features"
        description="Choose which AI-powered tools are available."
      >
        <ToggleCard
          icon={Bot}
          title="Chat Summarizer"
          description="Generate summaries of long team conversations."
          checked={data.chatSummarizer}
          onChange={(value) =>
            update("ai", "chatSummarizer", value)
          }
        />

        <ToggleCard
          icon={CheckCircle2}
          title="Task Generator"
          description="Automatically generate tasks using project context."
          checked={data.taskGenerator}
          onChange={(value) =>
            update("ai", "taskGenerator", value)
          }
        />

        <ToggleCard
          icon={AlertTriangle}
          title="BugFlow AI"
          description="Analyze bugs and suggest possible fixes."
          checked={data.bugFlowAI}
          onChange={(value) =>
            update("ai", "bugFlowAI", value)
          }
        />

        <ToggleCard
          icon={Search}
          title="Smart Search"
          description="Use AI to improve search across TeamFlow."
          checked={data.smartSearch}
          onChange={(value) =>
            update("ai", "smartSearch", value)
          }
        />
      </SettingSection>

      <SettingSection
        title="AI Configuration"
        description="Configure your default model and usage limits."
      >
        <div className="form-grid">
          <Field label="Default Model">
            <select
              value={data.model}
              onChange={(e) =>
                update("ai", "model", e.target.value)
              }
            >
              {aiModelOptions.map((model) => (
                <option key={model}>{model}</option>
              ))}
            </select>
          </Field>

          <Field label="Monthly Request Limit">
            <input
              type="number"
              value={data.monthlyLimit}
              onChange={(e) =>
                update(
                  "ai",
                  "monthlyLimit",
                  Number(e.target.value)
                )
              }
            />
          </Field>
        </div>

        <Field
          label="API Key"
          hint="Never store production API keys in frontend code."
        >
          <div className="secret-input">
            <input
              type={showApiKey ? "text" : "password"}
              placeholder="Enter API key"
              value={data.apiKey}
              onChange={(e) =>
                update("ai", "apiKey", e.target.value)
              }
            />

            <button
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>
        </Field>
      </SettingSection>
    </>
  );
}

/* =========================================================
   EMAIL
========================================================= */

function EmailSettings({
  data,
  update,
  showPassword,
  setShowPassword,
  showMessage,
}) {
  const testConnection = () => {
    if (!data.smtpHost || !data.smtpPort) {
      alert("Enter SMTP host and port.");
      return;
    }

    showMessage("SMTP connection test successful");
  };

  return (
    <>
      <PageHeader
        icon={Mail}
        title="Email Configuration"
        description="Configure outgoing TeamFlow emails."
      />

      <SettingSection
        title="SMTP Server"
        description="Configure your outgoing email server."
      >
        <div className="form-grid">
          <Field label="SMTP Host">
            <input
              value={data.smtpHost}
              onChange={(e) =>
                update("email", "smtpHost", e.target.value)
              }
            />
          </Field>

          <Field label="SMTP Port">
            <input
              value={data.smtpPort}
              onChange={(e) =>
                update("email", "smtpPort", e.target.value)
              }
            />
          </Field>

          <Field label="Username">
            <input
              value={data.smtpUsername}
              onChange={(e) =>
                update("email", "smtpUsername", e.target.value)
              }
            />
          </Field>

          <Field label="Encryption">
            <select
              value={data.encryption}
              onChange={(e) =>
                update("email", "encryption", e.target.value)
              }
            >
              <option>TLS</option>
              <option>SSL</option>
              <option>None</option>
            </select>
          </Field>
        </div>

        <Field label="SMTP Password">
          <div className="secret-input">
            <input
              type={showPassword ? "text" : "password"}
              value={data.smtpPassword}
              onChange={(e) =>
                update("email", "smtpPassword", e.target.value)
              }
            />

            <button
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>
        </Field>
      </SettingSection>

      <SettingSection
        title="Sender Details"
        description="Information recipients see in TeamFlow emails."
      >
        <div className="form-grid">
          <Field label="Sender Name">
            <input
              value={data.senderName}
              onChange={(e) =>
                update("email", "senderName", e.target.value)
              }
            />
          </Field>

          <Field label="Sender Email">
            <input
              type="email"
              value={data.senderEmail}
              onChange={(e) =>
                update("email", "senderEmail", e.target.value)
              }
            />
          </Field>
        </div>

        <button
          className="btn-outline"
          onClick={testConnection}
        >
          <Send size={15} />
          Send Test Email
        </button>
      </SettingSection>
    </>
  );
}

/* =========================================================
   PRIVACY
========================================================= */

function PrivacySettings({
  data,
  update,
  exportSettings,
  showMessage,
}) {
  const clearDemoData = () => {
    const confirmed = window.confirm(
      "Clear TeamFlow admin demo data from this browser?"
    );

    if (!confirmed) return;

    Object.keys(localStorage).forEach((key) => {
      if (
        key.startsWith("teamflow_admin_") &&
        key !== STORAGE_KEY
      ) {
        localStorage.removeItem(key);
      }
    });

    showMessage("Admin demo data cleared");
  };

  return (
    <>
      <PageHeader
        icon={Database}
        title="Data & Privacy"
        description="Manage privacy, analytics and stored platform data."
      />

      <SettingSection
        title="Data Collection"
        description="Choose which data TeamFlow can collect."
      >
        <ToggleCard
          icon={Database}
          title="Analytics Tracking"
          description="Collect anonymous usage analytics."
          checked={data.analyticsTracking}
          onChange={(value) =>
            update("privacy", "analyticsTracking", value)
          }
        />

        <ToggleCard
          icon={AlertTriangle}
          title="Error Reporting"
          description="Collect application errors for debugging."
          checked={data.errorReporting}
          onChange={(value) =>
            update("privacy", "errorReporting", value)
          }
        />

        <ToggleCard
          icon={Clock3}
          title="Activity Logging"
          description="Record important administrator activity."
          checked={data.activityLogging}
          onChange={(value) =>
            update("privacy", "activityLogging", value)
          }
        />

        <ToggleCard
          icon={ShieldCheck}
          title="Cookie Consent"
          description="Display cookie consent controls to users."
          checked={data.cookieConsent}
          onChange={(value) =>
            update("privacy", "cookieConsent", value)
          }
        />

        <ToggleCard
          icon={Download}
          title="Allow User Data Export"
          description="Allow users to request copies of their data."
          checked={data.allowDataExport}
          onChange={(value) =>
            update("privacy", "allowDataExport", value)
          }
        />
      </SettingSection>

      <SettingSection
        title="Data Retention"
        description="Configure how long activity data is retained."
      >
        <Field label="Retention Period">
          <select
            value={data.dataRetention}
            onChange={(e) =>
              update(
                "privacy",
                "dataRetention",
                Number(e.target.value)
              )
            }
          >
            <option value={30}>30 Days</option>
            <option value={90}>90 Days</option>
            <option value={180}>180 Days</option>
            <option value={365}>1 Year</option>
            <option value={730}>2 Years</option>
          </select>
        </Field>
      </SettingSection>

      <SettingSection
        title="Data Management"
        description="Export or remove locally stored admin demo data."
      >
        <div className="data-actions">
          <button onClick={exportSettings}>
            <div>
              <Download size={19} />
            </div>

            <span>
              <strong>Export Settings</strong>
              <small>
                Download your current configuration.
              </small>
            </span>
          </button>

          <button className="danger" onClick={clearDemoData}>
            <div>
              <Trash2 size={19} />
            </div>

            <span>
              <strong>Clear Demo Data</strong>
              <small>
                Remove locally stored admin demo data.
              </small>
            </span>
          </button>
        </div>
      </SettingSection>
    </>
  );
}

/* =========================================================
   SHARED COMPONENTS
========================================================= */

function PageHeader({ icon: Icon, title, description }) {
  return (
    <div className="settings-page-header">
      <div className="settings-page-icon">
        <Icon size={21} />
      </div>

      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

function SettingSection({
  title,
  description,
  children,
}) {
  return (
    <div className="setting-section">
      <div className="setting-section-heading">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="setting-section-content">
        {children}
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="setting-field">
      <span>{label}</span>

      {children}

      {hint && <small>{hint}</small>}
    </label>
  );
}

function ToggleCard({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  recommended,
  danger,
}) {
  return (
    <div className="toggle-card">
      <div
        className={`toggle-card-icon ${
          danger ? "danger" : ""
        }`}
      >
        <Icon size={18} />
      </div>

      <div className="toggle-card-content">
        <div>
          <strong>{title}</strong>

          {recommended && (
            <span className="recommended-badge">
              Recommended
            </span>
          )}
        </div>

        <p>{description}</p>
      </div>

      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`modern-toggle ${checked ? "active" : ""}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      <span />
    </button>
  );
}

export default AdminSettings;