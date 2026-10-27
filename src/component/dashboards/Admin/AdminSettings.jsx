import React, { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  UserRound,
  Palette,
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
  Sun,
  Moon,
  Coins,
  Network,
  LogOut,
  FolderKanban,
  CheckSquare,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import {
  defaultAdminSettings,
  timezoneOptions,
  languageOptions,
  currencyOptions,
  aiModelOptions,
  defaultRoleOptions,
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
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const [search, setSearch] = useState("");

  // Synchronize root dark class on initial mount and when theme changes externally
  useEffect(() => {
    const getIsDark = () => {
      const adminDark = localStorage.getItem("teamflow_admin_dark");
      if (adminDark !== null) return adminDark === "true";
      const themeMode = localStorage.getItem("teamflow_theme_mode");
      if (themeMode !== null) return themeMode === "dark";
      return false;
    };

    const applyDOMTheme = (dark) => {
      if (dark) {
        document.documentElement.classList.add("dark", "sa-dark-mode");
        document.body.classList.add("dark", "dark-theme", "sa-dark-mode");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark", "sa-dark-mode");
        document.body.classList.remove("dark", "dark-theme", "sa-dark-mode");
        document.documentElement.setAttribute("data-theme", "light");
      }
    };

    applyDOMTheme(getIsDark());

    const handleThemeSync = () => {
      applyDOMTheme(getIsDark());
    };

    window.addEventListener("teamflow_theme_update", handleThemeSync);
    window.addEventListener("storage", handleThemeSync);
    return () => {
      window.removeEventListener("teamflow_theme_update", handleThemeSync);
      window.removeEventListener("storage", handleThemeSync);
    };
  }, []);

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge with defaults to ensure all keys exist
        return {
          general: { ...defaultAdminSettings.general, ...parsed.general },
          workspace: { ...defaultAdminSettings.workspace, ...parsed.workspace },
          security: { ...defaultAdminSettings.security, ...parsed.security },
          notifications: { ...defaultAdminSettings.notifications, ...parsed.notifications },
          ai: { ...defaultAdminSettings.ai, ...parsed.ai },
          email: { ...defaultAdminSettings.email, ...parsed.email },
          privacy: { ...defaultAdminSettings.privacy, ...parsed.privacy },
        };
      }
      return clone(defaultAdminSettings);
    } catch {
      return clone(defaultAdminSettings);
    }
  });

  const [savedSettings, setSavedSettings] = useState(() => clone(settings));
  const [toast, setToast] = useState(null);

  // Modals state
  const [showResetModal, setShowResetModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [transferTargetEmail, setTransferTargetEmail] = useState("priya@abctech.com");

  // Interaction helpers
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSMTPPassword, setShowSMTPPassword] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [testEmailSent, setTestEmailSent] = useState(false);
  const [apiPingStatus, setApiPingStatus] = useState(null); // 'testing' | 'success' | null

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
    }, 3200);
  };

  const saveSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSavedSettings(clone(settings));
      showMessage("Organization settings saved successfully!");
      // Dispatch storage update so Topbar / Sidebar can react if name changed
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("teamflow_data_update"));
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
    showMessage("Settings restored to system defaults");
  };

  const exportSettings = () => {
    const file = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `teamflow-org-settings-${settings.general.companyName.toLowerCase().replace(/\s+/g, "-")}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showMessage("Organization configuration exported successfully!");
  };

  const handleCopySlug = () => {
    const fullUrl = `https://${settings.general.subdomain || "abctech"}.teamflow.ai`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
    }
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2200);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showMessage("Logo image must be under 2MB", "error");
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
      showMessage(`Test dispatch delivered to ${settings.email.senderEmail || "admin inbox"}`);
    }, 1400);
  };

  const handleVerifyApiKey = () => {
    setApiPingStatus("testing");
    setTimeout(() => {
      setApiPingStatus("success");
      showMessage("AI API Key verified: Connection active (HTTP 200 - 38ms)");
      setTimeout(() => setApiPingStatus(null), 3000);
    }, 1200);
  };

  const handleConfirmTransfer = () => {
    setShowTransferModal(false);
    showMessage(`Organization ownership transfer request sent to ${transferTargetEmail}`);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmText.trim().toLowerCase() === settings.general.companyName.trim().toLowerCase()) {
      setShowDeleteModal(false);
      setDeleteConfirmText("");
      showMessage("Organization deactivation scheduled. Contact support to cancel within 48h.", "error");
    } else {
      alert(`Please type "${settings.general.companyName}" exactly to confirm.`);
    }
  };

  return (
    <div className="settings-app org-settings-page">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="settings-main org-settings-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <div className="admin-settings-content org-settings-content">
          {/* TOAST ALERT */}
          {toast && (
            <div className={`settings-toast org-settings-toast ${toast.type || "success"}`}>
              {toast.type === "error" ? (
                <AlertTriangle size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
              <span>{toast.message}</span>
            </div>
          )}

          {/* TOP SETTINGS MODULE NAVIGATION TABS */}
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
              className="tfAdminSettings__moduleTab "
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
              className="tfAdminSettings__moduleTab tfAdminSettings__moduleTab--active"
              onClick={() => navigate("/admin/settings")}
            >
              <Building2 size={14} />
              <span>Organization Settings</span>
            </button>
          </div>

          {/* PAGE HEADER */}
          <section className="admin-settings-header org-settings-header">
            <div>
              <h1>Organization Settings</h1>
              <p>
                Configure company identity, workspace quotas, security policies, and localization across TeamFlow AI.
              </p>
            </div>

            <div className="admin-settings-header-actions org-settings-header-actions">
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
                title="Restore system defaults"
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
          <div className="settings-mobile-tabs org-settings-mobile-tabs">
            {sections.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`settings-mobile-tab org-settings-mobile-tab ${activeSection === item.id ? "active" : ""}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* SETTINGS BODY CONTAINER */}
          <div className="admin-settings-container org-settings-container">
            {/* LEFT NAVIGATION SIDEBAR (STICKY ON DESKTOP) */}
            <aside className="admin-settings-sidebar-card org-settings-sidebar">
              <div className="admin-settings-search org-settings-search">
                <Search size={15} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter settings..."
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="search-clear-btn"
                    title="Clear filter"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="admin-settings-menu org-settings-menu">
                {filteredSections.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`admin-settings-menu-item org-settings-menu-item ${isActive ? "active" : ""}`}
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
                  <div className="admin-settings-no-results">
                    No settings match "{search}"
                  </div>
                )}
              </div>

              {/* QUICK STATS & PLAN CARD */}
              <div className="admin-settings-plan-card org-settings-plan-card">
                <div className="plan-badge">Enterprise Tier</div>
                <strong>{settings.general.companyName || "ABC Technologies"}</strong>
                <p>6 Workspaces · 48 Active Members</p>
                <div className="plan-progress">
                  <div className="plan-bar" style={{ width: "48%" }} />
                </div>
                <small>48 / 100 User Licenses Used</small>
              </div>
            </aside>

            {/* RIGHT CONTENT CARD */}
            <section className="settings-content-card org-settings-content-area">
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
                  onVerifyApiKey={handleVerifyApiKey}
                  apiPingStatus={apiPingStatus}
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
                  showMessage={showMessage}
                />
              )}

              {/* SECTION 8: DANGER ZONE */}
              {activeSection === "danger" && (
                <DangerSettings
                  companyName={settings.general.companyName}
                  onExport={exportSettings}
                  onOpenTransfer={() => setShowTransferModal(true)}
                  onOpenDelete={() => setShowDeleteModal(true)}
                />
              )}

              {/* FLOATING SAVE BAR */}
              {hasChanges && (
                <div className="settings-save-bar org-settings-save-bar">
                  <div className="save-bar-info org-save-bar-info">
                    <AlertTriangle size={18} />
                    <div>
                      <strong>Unsaved changes detected</strong>
                      <p>Save your configuration or discard modifications.</p>
                    </div>
                  </div>
                  <div className="save-bar-actions org-save-bar-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={discardChanges}
                    >
                      Discard
                    </button>
                    <button
                      type="button"
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
        </div>
      </main>

      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="settings-modal-overlay org-settings-modal-overlay">
          <div className="settings-modal org-settings-modal">
            <div className="settings-modal-danger-icon org-settings-modal-danger-icon">
              <RotateCcw size={24} />
            </div>
            <h2>Reset Organization Settings?</h2>
            <p>
              This will restore all default platform preferences, workspace limits, and configurations.
              Existing member data and workspaces will remain unaffected.
            </p>
            <div className="settings-modal-actions org-settings-modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={resetSettings}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRANSFER OWNERSHIP MODAL */}
      {showTransferModal && (
        <div className="settings-modal-overlay org-settings-modal-overlay">
          <div className="settings-modal org-settings-modal">
            <div className="settings-modal-header-icon org-settings-modal-header-icon" style={{ background: "rgba(99, 102, 241, 0.12)", color: "#6366f1" }}>
              <Building2 size={24} />
            </div>
            <h2>Transfer Organization Ownership</h2>
            <p>
              Transfer primary ownership of <strong>{settings.general.companyName}</strong> to another designated administrator.
            </p>
            <div className="form-group" style={{ textAlign: "left", width: "100%", margin: "16px 0 24px" }}>
              <label>Select Target Administrator</label>
              <select
                value={transferTargetEmail}
                onChange={(e) => setTransferTargetEmail(e.target.value)}
              >
                <option value="priya@abctech.com">Priya Patel (Engineering Lead) - priya@abctech.com</option>
                <option value="rahul@abctech.com">Rahul Sharma (Full Stack Dev) - rahul@abctech.com</option>
                <option value="sneha@abctech.com">Sneha Gupta (Product Design) - sneha@abctech.com</option>
              </select>
            </div>
            <div className="settings-modal-actions org-settings-modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowTransferModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleConfirmTransfer}
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ORGANIZATION MODAL */}
      {showDeleteModal && (
        <div className="settings-modal-overlay org-settings-modal-overlay">
          <div className="settings-modal org-settings-modal">
            <div className="settings-modal-danger-icon org-settings-modal-danger-icon">
              <Trash2 size={24} />
            </div>
            <h2 style={{ color: "#ef4444" }}>Delete Organization</h2>
            <p>
              This action is permanent and irreversible. All workspaces, projects, sprint logs, and member permissions for <strong>{settings.general.companyName}</strong> will be permanently purged.
            </p>
            <div className="form-group" style={{ textAlign: "left", width: "100%", margin: "16px 0 24px" }}>
              <label>Type <strong>{settings.general.companyName}</strong> to confirm:</label>
              <input
                type="text"
                placeholder={settings.general.companyName}
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
            </div>
            <div className="settings-modal-actions org-settings-modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                disabled={deleteConfirmText.trim().toLowerCase() !== settings.general.companyName.trim().toLowerCase()}
                onClick={handleConfirmDelete}
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SUB-SECTIONS & ATOMIC COMPONENTS
========================================================= */

function SettingHeader({ icon: Icon, title, description }) {
  return (
    <div className="settings-section-header org-settings-section-header">
      <div className="settings-section-icon org-settings-section-icon">
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
    <div className="setting-card org-settings-card">
      <div className="setting-card-header org-setting-card-header">
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        {badge && <span className="setting-card-badge org-setting-card-badge">{badge}</span>}
      </div>
      <div className="setting-card-body org-setting-card-body">{children}</div>
    </div>
  );
}

function ToggleRow({ icon: Icon, title, description, checked, onChange, danger }) {
  return (
    <div className={`settings-toggle-row org-settings-toggle-row ${danger ? "danger" : ""}`}>
      <div className="toggle-meta org-toggle-meta">
        {Icon && (
          <div className="toggle-icon org-toggle-icon">
            <Icon size={16} />
          </div>
        )}
        <div>
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
      </div>
      <label className="toggle-switch org-toggle-switch">
        <input
          type="checkbox"
          checked={Boolean(checked)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="slider org-toggle-slider" />
      </label>
    </div>
  );
}

/* THEME TOGGLE (BIDIRECTIONAL SYNC WITH TOPBAR & SYSTEM) */
function ThemeToggleSetting() {
  const getIsDark = () => {
    const adminDark = localStorage.getItem("teamflow_admin_dark");
    if (adminDark !== null) return adminDark === "true";
    const themeMode = localStorage.getItem("teamflow_theme_mode");
    if (themeMode !== null) return themeMode === "dark";
    return false;
  };

  const [isDark, setIsDark] = useState(getIsDark);

  useEffect(() => {
    const handleSync = () => {
      setIsDark(getIsDark());
    };
    window.addEventListener("teamflow_theme_update", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("teamflow_theme_update", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const setTheme = (dark) => {
    document.documentElement.classList.add("theme-transitioning");
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add("dark", "sa-dark-mode");
      document.body.classList.add("dark", "dark-theme", "sa-dark-mode");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark", "sa-dark-mode");
      document.body.classList.remove("dark", "dark-theme", "sa-dark-mode");
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.setItem("teamflow_admin_dark", String(dark));
    localStorage.setItem("teamflow_superadmin_dark_mode", String(dark));
    localStorage.setItem("teamflow_theme_mode", dark ? "dark" : "light");
    window.dispatchEvent(new Event("teamflow_theme_update"));
    window.dispatchEvent(new Event("storage"));

    window.clearTimeout(window.__tfThemeTimer);
    window.__tfThemeTimer = window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 380);
  };

  const handleKeyToggle = (e, dark) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setTheme(dark);
    }
  };

  return (
    <div className="theme-setting-container org-theme-setting-container">
      <div className="theme-cards-grid org-theme-cards-grid">
        {/* LIGHT MODE CARD */}
        <button
          type="button"
          role="button"
          aria-pressed={!isDark}
          aria-label="Select Light Mode daylight SaaS theme"
          className={`theme-mode-card org-theme-card ${!isDark ? "active" : ""}`}
          onClick={() => setTheme(false)}
          onKeyDown={(e) => handleKeyToggle(e, false)}
          tabIndex={0}
        >
          <div className="theme-card-preview org-theme-card-preview light-preview" aria-hidden="true">
            <div className="preview-topbar">
              <div className="preview-brand-dot" />
              <div className="preview-search-mock" />
              <div className="preview-avatar-mock" />
            </div>
            <div className="preview-body">
              <div className="preview-sidebar">
                <div className="preview-nav-line active" />
                <div className="preview-nav-line" />
                <div className="preview-nav-line" />
              </div>
              <div className="preview-content">
                <div className="preview-header-mock">
                  <div className="preview-bar" />
                  <div className="preview-btn-mock" />
                </div>
                <div className="preview-cards-mock">
                  <div className="preview-mini-card">
                    <div className="preview-mini-pill" />
                    <div className="preview-mini-val" />
                  </div>
                  <div className="preview-mini-card">
                    <div className="preview-mini-pill accent" />
                    <div className="preview-mini-val" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="theme-card-info org-theme-card-info">
            <div className="theme-card-title org-theme-card-title">
              <Sun size={16} />
              <span>Light Mode</span>
            </div>
            <p>Crisp daylight SaaS theme</p>
          </div>

          {!isDark && (
            <span className="theme-active-tag org-theme-active-tag">
              <Check size={11} strokeWidth={3} />
              <span>Active</span>
            </span>
          )}
        </button>

        {/* DARK MODE CARD */}
        <button
          type="button"
          role="button"
          aria-pressed={isDark}
          aria-label="Select Dark Mode modern navy theme for low light"
          className={`theme-mode-card org-theme-card ${isDark ? "active" : ""}`}
          onClick={() => setTheme(true)}
          onKeyDown={(e) => handleKeyToggle(e, true)}
          tabIndex={0}
        >
          <div className="theme-card-preview org-theme-card-preview dark-preview" aria-hidden="true">
            <div className="preview-topbar dark">
              <div className="preview-brand-dot dark" />
              <div className="preview-search-mock dark" />
              <div className="preview-avatar-mock dark" />
            </div>
            <div className="preview-body dark">
              <div className="preview-sidebar dark">
                <div className="preview-nav-line dark active" />
                <div className="preview-nav-line dark" />
                <div className="preview-nav-line dark" />
              </div>
              <div className="preview-content dark">
                <div className="preview-header-mock dark">
                  <div className="preview-bar dark" />
                  <div className="preview-btn-mock dark" />
                </div>
                <div className="preview-cards-mock dark">
                  <div className="preview-mini-card dark">
                    <div className="preview-mini-pill dark" />
                    <div className="preview-mini-val dark" />
                  </div>
                  <div className="preview-mini-card dark">
                    <div className="preview-mini-pill dark accent" />
                    <div className="preview-mini-val dark" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="theme-card-info org-theme-card-info">
            <div className="theme-card-title org-theme-card-title">
              <Moon size={16} />
              <span>Dark Mode</span>
            </div>
            <p>Modern navy theme for low light</p>
          </div>

          {isDark && (
            <span className="theme-active-tag org-theme-active-tag">
              <Check size={11} strokeWidth={3} />
              <span>Active</span>
            </span>
          )}
        </button>
      </div>

      {/* QUICK SWITCH ROW */}
      <div className="theme-quick-switch-row org-theme-quick-switch-row">
        <div>
          <strong>Real-Time Dark Mode Switch</strong>
          <p>Instantly synchronizes across all dashboard modules and the topbar button.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          className={`switch-toggle-btn org-switch-toggle-btn ${isDark ? "checked" : ""}`}
          onClick={() => setTheme(!isDark)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setTheme(!isDark);
            }
          }}
          aria-label="Toggle dark mode"
          title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
          tabIndex={0}
        >
          <span className="switch-toggle-knob org-switch-toggle-knob">
            {isDark ? <Moon size={12} /> : <Sun size={12} />}
          </span>
        </button>
      </div>
    </div>
  );
}

/* 1. GENERAL & BRANDING */
function GeneralSettings({
  data,
  update,
  onCopySlug,
  copiedDomain,
  fileInputRef,
  onLogoUpload,
  onRemoveLogo,
}) {
  const subdomain = data.subdomain || "abctech";

  return (
    <div className="settings-section-content">
      <SettingHeader
        icon={Building2}
        title="General & Organization Identity"
        description="Configure your company branding, subdomain URL, localization, and support contacts."
      />

      {/* THEME & DARK MODE TOGGLE */}
      <SettingCard
        title="Admin Interface Theme"
        description="Toggle between Light Mode and Dark Mode for the entire admin console. Synchronizes seamlessly with topbar."
      >
        <ThemeToggleSetting />
      </SettingCard>

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
                <button
                  type="button"
                  className="btn-secondary btn-trash"
                  onClick={onRemoveLogo}
                >
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
              value={`https://${subdomain}.teamflow.ai`}
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
        description="Set default time preferences, language, currency, and date formats across workspaces."
      >
        <div className="form-grid-2">
          <div className="form-group">
            <label>Default Timezone</label>
            <select
              value={data.timezone || "Asia/Kolkata"}
              onChange={(e) => update("general", "timezone", e.target.value)}
            >
              {timezoneOptions.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
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
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date Format</label>
            <select
              value={data.dateFormat || "DD/MM/YYYY"}
              onChange={(e) => update("general", "dateFormat", e.target.value)}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (27/10/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (10/27/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-10-27)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Default Currency</label>
            <select
              value={data.currency || "USD ($)"}
              onChange={(e) => update("general", "currency", e.target.value)}
            >
              {currencyOptions.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
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
                onChange={(e) =>
                  update("workspace", "defaultMemberLimit", Number(e.target.value))
                }
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
                onChange={(e) =>
                  update("workspace", "defaultStorage", Number(e.target.value))
                }
              />
              <span>GB</span>
            </div>
          </div>

          <div className="form-group">
            <label>Max Projects per Workspace</label>
            <div className="input-with-affix">
              <FolderKanban size={16} />
              <input
                type="number"
                min="5"
                max="100"
                value={data.maxProjects || 20}
                onChange={(e) =>
                  update("workspace", "maxProjects", Number(e.target.value))
                }
              />
              <span>projects</span>
            </div>
          </div>

          <div className="form-group">
            <label>Default Role for New Members</label>
            <select
              value={data.defaultRole || "Member"}
              onChange={(e) => update("workspace", "defaultRole", e.target.value)}
            >
              {defaultRoleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
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
          <ToggleRow
            icon={CheckSquare}
            title="Auto-Assign New Users by Email Domain"
            description="Automatically attach members signing in with @abctech.com to the primary General workspace."
            checked={Boolean(data.autoDomainJoin)}
            onChange={(val) => update("workspace", "autoDomainJoin", val)}
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
            title="SAML 2.0 / Single Sign-On (SSO)"
            description="Enable enterprise identity federation through Okta, Azure Active Directory, or Google Workspace."
            checked={Boolean(data.ssoEnabled)}
            onChange={(val) => update("security", "ssoEnabled", val)}
          />

          {data.ssoEnabled && (
            <div className="form-group sso-input-box" style={{ padding: "12px 16px", background: "rgba(99,102,241,0.04)", borderRadius: 8 }}>
              <label>SAML Identity Provider Metadata URL</label>
              <input
                type="url"
                value={data.ssoMetadataUrl || ""}
                placeholder="https://idp.example.com/app/saml/metadata"
                onChange={(e) => update("security", "ssoMetadataUrl", e.target.value)}
              />
              <small className="form-hint">Provided by your Okta or Azure AD admin application manifest.</small>
            </div>
          )}

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

          <div className="form-group">
            <label>Password Expiration Policy</label>
            <select
              value={data.passwordExpiry || "90"}
              onChange={(e) => update("security", "passwordExpiry", e.target.value)}
            >
              <option value="60">Every 60 Days</option>
              <option value="90">Every 90 Days (Recommended)</option>
              <option value="180">Every 180 Days</option>
              <option value="never">Never Expire</option>
            </select>
          </div>

          <div className="form-group">
            <label>Force Terminate All Active Sessions</label>
            <button
              type="button"
              className="btn-secondary"
              style={{ height: 42, width: "100%", justifyContent: "center" }}
              onClick={() => alert("All 48 member active sessions have been invalidated. Users must re-authenticate.")}
            >
              <LogOut size={14} />
              <span>Revoke Active Tokens</span>
            </button>
          </div>
        </div>
      </SettingCard>

      <SettingCard title="Network Restrictions & IP Allowlist">
        <div className="form-group">
          <label>IP Address / CIDR Range Allowlist</label>
          <div className="input-with-affix">
            <Network size={16} />
            <input
              type="text"
              placeholder="e.g. 192.168.1.0/24, 10.0.0.0/16"
              value={data.ipAllowlist || ""}
              onChange={(e) => update("security", "ipAllowlist", e.target.value)}
            />
          </div>
          <small className="form-hint">
            Leave blank to permit access from any IP address. Separate multiple CIDR blocks with commas.
          </small>
        </div>
      </SettingCard>
    </div>
  );
}

/* 4. AI GOVERNANCE */
function AISettings({
  data,
  update,
  showApiKey,
  setShowApiKey,
  onVerifyApiKey,
  apiPingStatus,
}) {
  return (
    <div className="settings-section-content">
      <SettingHeader
        icon={Bot}
        title="AI Intelligence & Model Governance"
        description="Select foundational models, monthly token quotas, and automated generative tools."
      />

      <SettingCard title="Model Configuration & API Key">
        <div className="form-grid-2">
          <div className="form-group">
            <label>Primary AI Model</label>
            <select
              value={data.model || "GPT-4o Mini (OpenAI)"}
              onChange={(e) => update("ai", "model", e.target.value)}
            >
              {aiModelOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
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

        {/* API KEY CONFIGURATION */}
        <div className="form-group mt-4">
          <label>Custom Enterprise API Key</label>
          <div className="subdomain-input-wrap">
            <input
              type={showApiKey ? "text" : "password"}
              value={data.apiKey || ""}
              placeholder="sk-proj-••••••••••••••••"
              onChange={(e) => update("ai", "apiKey", e.target.value)}
              className="subdomain-input"
            />
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowApiKey(!showApiKey)}
              title={showApiKey ? "Hide Key" : "Show Key"}
            >
              {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onVerifyApiKey}
              disabled={apiPingStatus === "testing"}
            >
              {apiPingStatus === "testing" ? (
                <span>Checking...</span>
              ) : apiPingStatus === "success" ? (
                <>
                  <Check size={14} color="#10b981" />
                  <span style={{ color: "#10b981" }}>Verified</span>
                </>
              ) : (
                <span>Verify Key</span>
              )}
            </button>
          </div>
          <small className="form-hint">
            Directly connect your enterprise billing OpenAI or Anthropic key. If blank, TeamFlow AI managed pool is utilized.
          </small>
        </div>
      </SettingCard>

      <SettingCard title="Generative Features & Tool Automation">
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
          <ToggleRow
            icon={ShieldCheck}
            title="Automated Bug Diagnostics & Code Review"
            description="Inspect submitted bug tickets and suggest patch snippets before triage."
            checked={Boolean(data.bugFlowAI)}
            onChange={(val) => update("ai", "bugFlowAI", val)}
          />
          <ToggleRow
            icon={Search}
            title="Smart Semantic Search"
            description="Vector-based embeddings search across projects, tasks, discussions, and attachments."
            checked={Boolean(data.smartSearch)}
            onChange={(val) => update("ai", "smartSearch", val)}
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
          <ToggleRow
            icon={Coins}
            title="Billing & Subscription Invoices"
            description="Dispatch receipts and quota warnings to primary billing contacts."
            checked={Boolean(data.paymentNotification)}
            onChange={(val) => update("notifications", "paymentNotification", val)}
          />
          <ToggleRow
            icon={Sparkles}
            title="Weekly Executive Digest Report"
            description="Automated Monday summary of sprint velocity, completed tasks, and AI token utilization."
            checked={Boolean(data.weeklyReport)}
            onChange={(val) => update("notifications", "weeklyReport", val)}
          />
          <ToggleRow
            icon={AlertTriangle}
            title="Overdue Task Escalation Alert"
            description="Notify workspace leads when sprint milestone deadlines are exceeded by 48 hours."
            checked={Boolean(data.overdueEscalation)}
            onChange={(val) => update("notifications", "overdueEscalation", val)}
          />
        </div>
      </SettingCard>
    </div>
  );
}

/* 6. EMAIL & SMTP */
function EmailSettings({
  data,
  update,
  showPassword,
  setShowPassword,
  onSendTestEmail,
  testEmailSent,
}) {
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
            <label>Encryption Protocol</label>
            <select
              value={data.encryption || "TLS"}
              onChange={(e) => update("email", "encryption", e.target.value)}
            >
              <option value="TLS">TLS (STARTTLS - Recommended)</option>
              <option value="SSL">SSL</option>
              <option value="NONE">None (Insecure)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sender Display Name</label>
            <input
              type="text"
              value={data.senderName || "TeamFlow AI"}
              onChange={(e) => update("email", "senderName", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Sender Email Address</label>
            <input
              type="email"
              value={data.senderEmail || "noreply@abctech.com"}
              onChange={(e) => update("email", "senderEmail", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>SMTP Username</label>
            <input
              type="text"
              value={data.smtpUsername || "smtp-relay-admin"}
              onChange={(e) => update("email", "smtpUsername", e.target.value)}
            />
          </div>

          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label>SMTP Password / App Secret</label>
            <div className="subdomain-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={data.smtpPassword || ""}
                placeholder="••••••••••••••••"
                onChange={(e) => update("email", "smtpPassword", e.target.value)}
                className="subdomain-input"
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
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
function PrivacySettings({ data, update, onExport, showMessage }) {
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
            description="Share anonymous telemetry to help improve TeamFlow AI platform usability."
            checked={Boolean(data.analyticsTracking)}
            onChange={(val) => update("privacy", "analyticsTracking", val)}
          />
          <ToggleRow
            icon={ShieldCheck}
            title="Anonymize Employee Audit Logs after 180 Days"
            description="Strip IP addresses and user agents from historical audit trails for privacy compliance."
            checked={Boolean(data.anonymizeAuditLogs)}
            onChange={(val) => update("privacy", "anonymizeAuditLogs", val)}
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
            Activity logs and soft-deleted tasks older than this timeframe are purged automatically.
          </small>
        </div>
      </SettingCard>

      <SettingCard title="GDPR & Data Subject Requests">
        <div className="danger-item" style={{ border: "none", padding: 0 }}>
          <div>
            <strong>Download Personal Data Archive (GDPR)</strong>
            <p>Generate a complete machine-readable archive of all member identity records.</p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              onExport();
              showMessage("GDPR Data Subject Request bundle compiled and downloaded.");
            }}
          >
            <Download size={14} />
            <span>Generate GDPR Bundle</span>
          </button>
        </div>
      </SettingCard>
    </div>
  );
}

/* 8. DANGER ZONE */
function DangerSettings({ companyName, onExport, onOpenTransfer, onOpenDelete }) {
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
            onClick={onOpenTransfer}
          >
            Transfer Ownership
          </button>
        </div>

        <div className="danger-item danger-highlight">
          <div>
            <strong className="text-danger">Delete Organization</strong>
            <p>
              Permanently remove {companyName || "ABC Technologies"} and all associated workspace records. This cannot be undone.
            </p>
          </div>
          <button
            type="button"
            className="btn-danger"
            onClick={onOpenDelete}
          >
            <Trash2 size={14} />
            <span>Delete Organization</span>
          </button>
        </div>
      </div>
    </div>
  );
}
