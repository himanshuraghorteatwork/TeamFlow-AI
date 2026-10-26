import React, { useMemo, useState, useRef } from "react";
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
  Upload,
  Copy,
  Check,
  ExternalLink,
  Sliders,
  ShieldAlert,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
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
    label: "General & Branding",
    description: "Platform identity & custom domain",
    icon: Building2,
    iconColor: "#6366f1",
    iconBg: "rgba(99, 102, 241, 0.12)",
  },
  {
    id: "workspace",
    label: "Workspace Defaults",
    description: "Quotas, storage & permissions",
    icon: HardDrive,
    iconColor: "#0284c7",
    iconBg: "rgba(2, 132, 199, 0.12)",
  },
  {
    id: "security",
    label: "Security & Access",
    description: "2FA, SSO & authentication",
    icon: ShieldCheck,
    iconColor: "#10b981",
    iconBg: "rgba(16, 185, 129, 0.12)",
  },
  {
    id: "ai",
    label: "AI Governance",
    description: "Models, quotas & automated tools",
    icon: Bot,
    iconColor: "#8b5cf6",
    iconBg: "rgba(139, 92, 246, 0.12)",
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "System & organization alerts",
    icon: Bell,
    iconColor: "#f59e0b",
    iconBg: "rgba(245, 158, 11, 0.12)",
  },
  {
    id: "email",
    label: "Email & SMTP",
    description: "SMTP relay & sender identity",
    icon: Mail,
    iconColor: "#06b6d4",
    iconBg: "rgba(6, 182, 212, 0.12)",
  },
  {
    id: "privacy",
    label: "Data & Privacy",
    description: "Audit logging & retention",
    icon: Database,
    iconColor: "#f43f5e",
    iconBg: "rgba(244, 63, 94, 0.12)",
  },
  {
    id: "danger",
    label: "Danger Zone",
    description: "Data export & organization removal",
    icon: ShieldAlert,
    iconColor: "#ef4444",
    iconBg: "rgba(239, 68, 68, 0.12)",
  },
];

export default function AdminSettings() {
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const [savedSettings, setSavedSettings] = useState(() => clone(settings));
  const [toast, setToast] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSMTPPassword, setShowSMTPPassword] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [testEmailSent, setTestEmailSent] = useState(false);

  const fileInputRef = useRef(null);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const filteredSections = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return sections;
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
    }, 2800);
  };

  const saveSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSavedSettings(clone(settings));
      showMessage("Organization settings saved successfully!");
    } catch (err) {
      console.error(err);
      showMessage("Failed to save settings.", "error");
    }
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
    link.download = "teamflow-organization-settings.json";
    link.click();
    URL.revokeObjectURL(url);
    showMessage("Configuration exported successfully!");
  };

  const handleCopySlug = () => {
    navigator.clipboard?.writeText("https://abctech.teamflow.ai");
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Logo must be under 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        update("general", "orgLogo", event.target?.result);
        showMessage("Organization logo updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    update("general", "orgLogo", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
    showMessage("Logo removed", "info");
  };

  const handleSendTestEmail = () => {
    setTestEmailSent(true);
    setTimeout(() => {
      setTestEmailSent(false);
      showMessage("Test email successfully dispatched to admin inbox!");
    }, 1200);
  };

  return (
    <div className="settings-app">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="settings-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <div className="admin-settings-content">
          {/* HEADER */}
          <section className="admin-settings-header">
            <div>

              <h1>Organization Settings</h1>
              <p>
                Configure company identity, workspace quotas, security policies, and localization across TeamFlow AI.
              </p>
            </div>

            <div className="admin-settings-header-actions">
              {hasChanges && (
                <span className="unsaved-indicator">
                  <span />
                  Unsaved changes
                </span>
              )}

              <button
                type="button"
                className="btn-secondary"
                onClick={exportSettings}
                title="Export settings as JSON"
              >
                <Download size={14} />
                <span>Export</span>
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowResetModal(true)}
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={saveSettings}
                disabled={!hasChanges}
              >
                <Save size={14} />
                <span>Save Changes</span>
              </button>
            </div>
          </section>

          {/* RESPONSIVE HORIZONTAL TABS FOR TABLET / MOBILE */}
          <div className="settings-mobile-tabs">
            {sections.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`settings-mobile-tab ${activeSection === item.id ? "active" : ""}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* SETTINGS BODY CONTAINER */}
          <div className="admin-settings-container">
            {/* LEFT NAVIGATION SIDEBAR (STICKY ON DESKTOP) */}
            <aside className="admin-settings-sidebar-card">
              <div className="admin-settings-search">
                <Search size={15} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter settings..."
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")} className="search-clear-btn" title="Clear filter">
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="admin-settings-menu">
                {filteredSections.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`admin-settings-menu-item ${isActive ? "active" : ""}`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <div
                        className="admin-settings-menu-icon"
                        style={{
                          backgroundColor: isActive ? item.iconColor : item.iconBg,
                          color: isActive ? "#ffffff" : item.iconColor,
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="admin-settings-menu-text">
                        <strong>{item.label}</strong>
                        <span>{item.description}</span>
                      </div>
                      <ChevronRight className="admin-settings-menu-arrow" size={14} />
                    </button>
                  );
                })}

                {filteredSections.length === 0 && (
                  <div className="admin-settings-no-results">No settings match "{search}"</div>
                )}
              </div>

              {/* QUICK STATS CARD */}
              <div className="admin-settings-plan-card">
                <div className="plan-badge">Enterprise Tier</div>
                <strong>ABC Technologies</strong>
                <p>6 Workspaces · 48 Active Members</p>
                <div className="plan-progress">
                  <div className="plan-bar" style={{ width: "48%" }} />
                </div>
                <small>48 / 100 User Licenses Used</small>
              </div>
            </aside>

            {/* RIGHT CONTENT CARD */}
            <section className="settings-content-card">
              {/* SECTION 1: GENERAL & BRANDING */}
              {activeSection === "general" && (
                <GeneralSettings
                  data={settings.general}
                  update={update}
                  onCopySlug={handleCopySlug}
                  copiedDomain={copiedDomain}
                  fileInputRef={fileInputRef}
                  onLogoUpload={handleLogoUpload}
                  onRemoveLogo={handleRemoveLogo}
                />
              )}

              {/* SECTION 2: WORKSPACE DEFAULTS */}
              {activeSection === "workspace" && (
                <WorkspaceSettings data={settings.workspace} update={update} />
              )}

              {/* SECTION 3: SECURITY & ACCESS */}
              {activeSection === "security" && (
                <SecuritySettings data={settings.security} update={update} />
              )}

              {/* SECTION 4: AI GOVERNANCE */}
              {activeSection === "ai" && (
                <AISettings
                  data={settings.ai}
                  update={update}
                  showApiKey={showApiKey}
                  setShowApiKey={setShowApiKey}
                />
              )}

              {/* SECTION 5: NOTIFICATIONS */}
              {activeSection === "notifications" && (
                <NotificationSettings data={settings.notifications} update={update} />
              )}

              {/* SECTION 6: EMAIL & SMTP */}
              {activeSection === "email" && (
                <EmailSettings
                  data={settings.email}
                  update={update}
                  showPassword={showSMTPPassword}
                  setShowPassword={setShowSMTPPassword}
                  onSendTestEmail={handleSendTestEmail}
                  testEmailSent={testEmailSent}
                />
              )}

              {/* SECTION 7: DATA & PRIVACY */}
              {activeSection === "privacy" && (
                <PrivacySettings
                  data={settings.privacy}
                  update={update}
                  onExport={exportSettings}
                />
              )}

              {/* SECTION 8: DANGER ZONE */}
              {activeSection === "danger" && (
                <DangerSettings onExport={exportSettings} />
              )}

              {/* FLOATING SAVE BAR */}
              {hasChanges && (
                <div className="settings-save-bar">
                  <div className="save-bar-info">
                    <AlertTriangle size={18} />
                    <div>
                      <strong>Unsaved changes detected</strong>
                      <p>Save your configuration or discard modifications.</p>
                    </div>
                  </div>
                  <div className="save-bar-actions">
                    <button type="button" className="btn-secondary" onClick={discardChanges}>
                      Discard
                    </button>
                    <button type="button" className="btn-primary" onClick={saveSettings}>
                      <Save size={14} />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="settings-modal-overlay">
          <div className="settings-modal">
            <div className="settings-modal-danger-icon">
              <RotateCcw size={24} />
            </div>
            <h2>Reset Organization Settings?</h2>
            <p>
              This will restore all default platform preferences, workspace limits, and configurations.
              Existing member data will remain unaffected.
            </p>
            <div className="settings-modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
              <button type="button" className="btn-danger" onClick={resetSettings}>
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST ALERT */}
      {toast && (
        <div className={`settings-toast ${toast.type}`}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SUB-SECTIONS & COMPONENTS
========================================================= */

function SettingHeader({ icon: Icon, title, description }) {
  return (
    <div className="settings-section-header">
      <div className="settings-section-icon">
        <Icon size={20} />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

function SettingCard({ title, description, children, badge }) {
  return (
    <div className="setting-card">
      <div className="setting-card-header">
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        {badge && <span className="setting-card-badge">{badge}</span>}
      </div>
      <div className="setting-card-body">{children}</div>
    </div>
  );
}

function ToggleRow({ icon: Icon, title, description, checked, onChange, danger }) {
  return (
    <div className={`settings-toggle-row ${danger ? "danger" : ""}`}>
      <div className="toggle-meta">
        {Icon && (
          <div className="toggle-icon">
            <Icon size={16} />
          </div>
        )}
        <div>
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="slider" />
      </label>
    </div>
  );
}

/* 1. GENERAL SETTINGS */
function GeneralSettings({
  data,
  update,
  onCopySlug,
  copiedDomain,
  fileInputRef,
  onLogoUpload,
  onRemoveLogo,
}) {
  return (
    <div className="settings-section-content">
      <SettingHeader
        icon={Building2}
        title="General & Organization Identity"
        description="Configure your company branding, subdomain URL, localization, and support contacts."
      />

      {/* BRANDING & LOGO */}
      <SettingCard
        title="Organization Branding"
        description="Logo and brand assets displayed on landing views, emails, and workspace headers."
      >
        <div className="org-branding-layout">
          <div className="org-logo-preview">
            {data.orgLogo ? (
              <img src={data.orgLogo} alt="Organization Logo" className="org-logo-img" />
            ) : (
              <div className="org-logo-placeholder">ABC</div>
            )}
          </div>
          <div className="org-logo-controls">
            <input
              type="file"
              ref={fileInputRef}
              onChange={onLogoUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
            <div className="org-logo-btn-row">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} />
                <span>Upload New Logo</span>
              </button>
              {data.orgLogo && (
                <button type="button" className="btn-secondary btn-trash" onClick={onRemoveLogo}>
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>
              )}
            </div>
            <p className="org-logo-hint">
              Recommended: 256x256px PNG or SVG with transparent background. Max 2MB.
            </p>
          </div>
        </div>
      </SettingCard>

      {/* COMPANY INFO */}
      <SettingCard title="Company Information">
        <div className="form-grid-2">
          <div className="form-group">
            <label>Organization Name</label>
            <input
              type="text"
              value={data.companyName || "ABC Technologies"}
              onChange={(e) => update("general", "companyName", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Platform Name</label>
            <input
              type="text"
              value={data.platformName || "TeamFlow AI"}
              onChange={(e) => update("general", "platformName", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Support Email</label>
            <input
              type="email"
              value={data.supportEmail || "support@abctech.com"}
              onChange={(e) => update("general", "supportEmail", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Company Website</label>
            <input
              type="url"
              placeholder="https://abctech.com"
              value={data.website || "https://abctech.com"}
              onChange={(e) => update("general", "website", e.target.value)}
            />
          </div>
        </div>

        {/* CUSTOM SUBDOMAIN */}
        <div className="form-group mt-4">
          <label>Custom TeamFlow Subdomain</label>
          <div className="subdomain-input-wrap">
            <input
              type="text"
              readOnly
              value="https://abctech.teamflow.ai"
              className="subdomain-input"
            />
            <button
              type="button"
              className="btn-secondary copy-btn"
              onClick={onCopySlug}
            >
              {copiedDomain ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedDomain ? "Copied!" : "Copy URL"}</span>
            </button>
          </div>
          <small className="form-hint">
            Direct your organization members to this dedicated login domain.
          </small>
        </div>
      </SettingCard>

      {/* REGIONAL LOCALIZATION */}
      <SettingCard
        title="Localization & Regional Settings"
        description="Set default time preferences, language, and calendar formats."
      >
        <div className="form-grid-3">
          <div className="form-group">
            <label>Default Timezone</label>
            <select
              value={data.timezone || "Asia/Kolkata"}
              onChange={(e) => update("general", "timezone", e.target.value)}
            >
              {timezoneOptions.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Primary Language</label>
            <select
              value={data.language || "English"}
              onChange={(e) => update("general", "language", e.target.value)}
            >
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date Format</label>
            <select
              value={data.dateFormat || "DD/MM/YYYY"}
              onChange={(e) => update("general", "dateFormat", e.target.value)}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (26/10/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (10/26/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-10-26)</option>
            </select>
          </div>
        </div>
      </SettingCard>

      {/* MAINTENANCE MODE */}
      <SettingCard title="Availability & Maintenance">
        <ToggleRow
          icon={AlertTriangle}
          title="Enable Maintenance Mode"
          description="Temporarily lock workspace access for regular employees while performing platform updates."
          checked={Boolean(data.maintenanceMode)}
          onChange={(val) => update("general", "maintenanceMode", val)}
          danger
        />
      </SettingCard>
    </div>
  );
}

/* 2. WORKSPACE DEFAULTS */
function WorkspaceSettings({ data, update }) {
  return (
    <div className="settings-section-content">
      <SettingHeader
        icon={HardDrive}
        title="Workspace Defaults & Member Quotas"
        description="Configure default storage limits, team permissions, and automatic domain join rules."
      />

      <SettingCard
        title="Resource Allocations"
        description="Set initial storage and member limits applied when a new workspace is provisioned."
      >
        <div className="form-grid-2">
          <div className="form-group">
            <label>Default Member Limit</label>
            <div className="input-with-affix">
              <Users size={16} />
              <input
                type="number"
                min="5"
                max="200"
                value={data.defaultMemberLimit || 25}
                onChange={(e) => update("workspace", "defaultMemberLimit", Number(e.target.value))}
              />
              <span>members</span>
            </div>
          </div>

          <div className="form-group">
            <label>Storage Quota per Workspace</label>
            <div className="input-with-affix">
              <HardDrive size={16} />
              <input
                type="number"
                min="5"
                max="500"
                value={data.defaultStorage || 10}
                onChange={(e) => update("workspace", "defaultStorage", Number(e.target.value))}
              />
              <span>GB</span>
            </div>
          </div>
        </div>
      </SettingCard>

      <SettingCard title="Workspace Creation & Access Rules">
        <div className="toggle-stack">
          <ToggleRow
            icon={Building2}
            title="Allow Employees to Create Workspaces"
            description="Permit team leads and managers to initialize self-contained team workspaces."
            checked={Boolean(data.allowWorkspaceCreation)}
            onChange={(val) => update("workspace", "allowWorkspaceCreation", val)}
          />
          <ToggleRow
            icon={ShieldCheck}
            title="Require Admin Approval for New Workspaces"
            description="Newly created workspaces remain in pending review until approved by an Organization Admin."
            checked={Boolean(data.requireWorkspaceApproval)}
            onChange={(val) => update("workspace", "requireWorkspaceApproval", val)}
          />
          <ToggleRow
            icon={Users}
            title="Allow External Guest Collaborators"
            description="Workspace owners may invite contractor emails outside the primary organization domain."
            checked={Boolean(data.allowGuestUsers)}
            onChange={(val) => update("workspace", "allowGuestUsers", val)}
          />
          <ToggleRow
            icon={Globe2}
            title="Allow Public Project Sharing"
            description="Enable public link view access for roadmaps and sprint deliverables."
            checked={Boolean(data.allowPublicProjects)}
            onChange={(val) => update("workspace", "allowPublicProjects", val)}
          />
        </div>
      </SettingCard>
    </div>
  );
}

/* 3. SECURITY & ACCESS */
function SecuritySettings({ data, update }) {
  return (
    <div className="settings-section-content">
      <SettingHeader
        icon={ShieldCheck}
        title="Security & Access Control"
        description="Enforce authentication policies, two-factor verification, and session governance."
      />

      <SettingCard title="Authentication Policies">
        <div className="toggle-stack">
          <ToggleRow
            icon={ShieldCheck}
            title="Enforce Two-Factor Authentication (2FA)"
            description="Require all users to configure Google Authenticator, Duo, or SMS verification before accessing organization data."
            checked={Boolean(data.twoFactorAuth)}
            onChange={(val) => update("security", "twoFactorAuth", val)}
          />
          <ToggleRow
            icon={LockKeyhole}
            title="Enforce Strong Passwords"
            description="Require minimum 10 characters with numbers, uppercase letters, and symbols."
            checked={Boolean(data.strongPasswords)}
            onChange={(val) => update("security", "strongPasswords", val)}
          />
          <ToggleRow
            icon={Smartphone}
            title="Unrecognized Device Login Alerts"
            description="Send immediate security email notifications when members sign in from new IP locations."
            checked={Boolean(data.loginAlerts)}
            onChange={(val) => update("security", "loginAlerts", val)}
          />
        </div>
      </SettingCard>

      <SettingCard title="Session Governance">
        <div className="form-grid-2">
          <div className="form-group">
            <label>Session Inactivity Timeout</label>
            <select
              value={data.sessionTimeout || 30}
              onChange={(e) => update("security", "sessionTimeout", Number(e.target.value))}
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>1 Hour</option>
              <option value={240}>4 Hours</option>
              <option value={480}>8 Hours</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max Consecutive Failed Logins</label>
            <select
              value={data.maxLoginAttempts || 5}
              onChange={(e) => update("security", "maxLoginAttempts", Number(e.target.value))}
            >
              <option value={3}>3 Attempts (Strict)</option>
              <option value={5}>5 Attempts (Standard)</option>
              <option value={10}>10 Attempts</option>
            </select>
          </div>
        </div>
      </SettingCard>
    </div>
  );
}

/* 4. AI GOVERNANCE */
function AISettings({ data, update, showApiKey, setShowApiKey }) {
  return (
    <div className="settings-section-content">
      <SettingHeader
        icon={Bot}
        title="AI Intelligence & Model Governance"
        description="Select foundational models, monthly token quotas, and automated generative tools."
      />

      <SettingCard title="Model Configuration">
        <div className="form-grid-2">
          <div className="form-group">
            <label>Primary AI Model</label>
            <select
              value={data.model || "GPT-4o Mini"}
              onChange={(e) => update("ai", "model", e.target.value)}
            >
              {aiModelOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Monthly Organization Request Quota</label>
            <div className="input-with-affix">
              <Bot size={16} />
              <input
                type="number"
                step="5000"
                value={data.monthlyLimit || 100000}
                onChange={(e) => update("ai", "monthlyLimit", Number(e.target.value))}
              />
              <span>req/mo</span>
            </div>
          </div>
        </div>
      </SettingCard>

      <SettingCard title="Generative Features">
        <div className="toggle-stack">
          <ToggleRow
            icon={Sparkles}
            title="Enable AI Features Platform-Wide"
            description="Turn off to globally disable AI assistants and token consumption."
            checked={Boolean(data.aiEnabled)}
            onChange={(val) => update("ai", "aiEnabled", val)}
          />
          <ToggleRow
            icon={Bot}
            title="Task & Sprint Generator"
            description="Auto-generate actionable task backlogs from project requirements."
            checked={Boolean(data.taskGenerator)}
            onChange={(val) => update("ai", "taskGenerator", val)}
          />
          <ToggleRow
            icon={Sparkles}
            title="Meeting & Standup Summarizer"
            description="Produce structured bullet summaries from audio transcripts and sprint check-ins."
            checked={Boolean(data.meetingSummary)}
            onChange={(val) => update("ai", "meetingSummary", val)}
          />
        </div>
      </SettingCard>
    </div>
  );
}

/* 5. NOTIFICATIONS */
function NotificationSettings({ data, update }) {
  return (
    <div className="settings-section-content">
      <SettingHeader
        icon={Bell}
        title="System Notification Defaults"
        description="Default broadcast policies for new organizations and administrative alerts."
      />

      <SettingCard title="System Event Broadcasts">
        <div className="toggle-stack">
          <ToggleRow
            icon={Mail}
            title="Global Email Notifications"
            description="Enable platform SMTP delivery for all team notifications."
            checked={Boolean(data.emailNotifications)}
            onChange={(val) => update("notifications", "emailNotifications", val)}
          />
          <ToggleRow
            icon={Users}
            title="New User Registration Alerts"
            description="Alert organization administrators whenever a new employee joins a workspace."
            checked={Boolean(data.newUserNotification)}
            onChange={(val) => update("notifications", "newUserNotification", val)}
          />
          <ToggleRow
            icon={ShieldCheck}
            title="Critical Security Warnings"
            description="Immediate notification dispatched for privilege escalations and policy violations."
            checked={Boolean(data.securityAlerts)}
            onChange={(val) => update("notifications", "securityAlerts", val)}
          />
        </div>
      </SettingCard>
    </div>
  );
}

/* 6. EMAIL & SMTP */
function EmailSettings({ data, update, showPassword, setShowPassword, onSendTestEmail, testEmailSent }) {
  return (
    <div className="settings-section-content">
      <SettingHeader
        icon={Mail}
        title="Email Relay & SMTP Settings"
        description="Configure your enterprise SMTP server credentials and sender identity."
      />

      <SettingCard title="SMTP Server Configuration">
        <div className="form-grid-2">
          <div className="form-group">
            <label>SMTP Host</label>
            <input
              type="text"
              value={data.smtpHost || "smtp.teamflow.ai"}
              onChange={(e) => update("email", "smtpHost", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>SMTP Port</label>
            <input
              type="text"
              value={data.smtpPort || "587"}
              onChange={(e) => update("email", "smtpPort", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Sender Name</label>
            <input
              type="text"
              value={data.senderName || "TeamFlow AI"}
              onChange={(e) => update("email", "senderName", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Sender Email</label>
            <input
              type="email"
              value={data.senderEmail || "noreply@abctech.com"}
              onChange={(e) => update("email", "senderEmail", e.target.value)}
            />
          </div>
        </div>

        <div className="smtp-action-row">
          <button
            type="button"
            className="btn-secondary"
            onClick={onSendTestEmail}
            disabled={testEmailSent}
          >
            <Send size={14} />
            <span>{testEmailSent ? "Sending Test..." : "Send Test Email"}</span>
          </button>
          <span className="smtp-status-badge">
            <span className="status-dot-green" />
            SMTP Relay Connected
          </span>
        </div>
      </SettingCard>
    </div>
  );
}

/* 7. DATA & PRIVACY */
function PrivacySettings({ data, update, onExport }) {
  return (
    <div className="settings-section-content">
      <SettingHeader
        icon={Database}
        title="Data Retention & Privacy Compliance"
        description="Manage organizational audit logs, analytics telemetry, and GDPR compliance."
      />

      <SettingCard title="Audit Logging & Telemetry">
        <div className="toggle-stack">
          <ToggleRow
            icon={Database}
            title="Activity & Access Logging"
            description="Preserve immutable audit log events across workspaces, users, and tasks."
            checked={Boolean(data.activityLogging)}
            onChange={(val) => update("privacy", "activityLogging", val)}
          />
          <ToggleRow
            icon={Sparkles}
            title="Product Analytics Tracking"
            description="Share anonymous telemetry to help improve TeamFlow AI usability."
            checked={Boolean(data.analyticsTracking)}
            onChange={(val) => update("privacy", "analyticsTracking", val)}
          />
        </div>

        <div className="form-group mt-4">
          <label>Data Retention Period (Days)</label>
          <div className="input-with-affix">
            <Clock3 size={16} />
            <input
              type="number"
              min="30"
              max="3650"
              value={data.dataRetention || 365}
              onChange={(e) => update("privacy", "dataRetention", Number(e.target.value))}
            />
            <span>days</span>
          </div>
          <small className="form-hint">
            Activity logs older than this timeframe are purged automatically.
          </small>
        </div>
      </SettingCard>
    </div>
  );
}

/* 8. DANGER ZONE */
function DangerSettings({ onExport }) {
  return (
    <div className="settings-section-content">
      <SettingHeader
        icon={ShieldAlert}
        title="Danger Zone & Administrative Actions"
        description="Irreversible operations including full data archive exports and organization deactivation."
      />

      <div className="danger-zone-card">
        <div className="danger-item">
          <div>
            <strong>Export Full Organization Archive</strong>
            <p>Download a complete JSON export of all workspaces, users, projects, and tasks.</p>
          </div>
          <button type="button" className="btn-secondary" onClick={onExport}>
            <Download size={14} />
            <span>Export Archive</span>
          </button>
        </div>

        <div className="danger-item">
          <div>
            <strong>Transfer Organization Ownership</strong>
            <p>Transfer primary ownership and billing liability to another registered administrator.</p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => alert("Please contact enterprise support to initiate an ownership transfer.")}
          >
            Transfer Ownership
          </button>
        </div>

        <div className="danger-item danger-highlight">
          <div>
            <strong className="text-danger">Delete Organization</strong>
            <p>Permanently remove ABC Technologies and all associated workspace records. This cannot be undone.</p>
          </div>
          <button
            type="button"
            className="btn-danger"
            onClick={() => {
              if (window.confirm("Are you sure? This will permanently delete your organization.")) {
                alert("Organization deletion request initiated.");
              }
            }}
          >
            <Trash2 size={14} />
            <span>Delete Organization</span>
          </button>
        </div>
      </div>
    </div>
  );
}
