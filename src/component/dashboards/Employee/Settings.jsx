import { useState, useEffect, useRef } from "react";
import {
  Settings as SettingsIcon,
  User,
  CreditCard,
  Building2,
  Bell,
  Palette,
  Shield,
  Link2,
  ChevronRight,
  Camera,
  Save,
  Check,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Monitor,
  Smartphone,
  Clock,
  Clock3,
  Crown,
  Mail,
  MessageSquare,
  Moon,
  Sun,
  Laptop,
  LogOut,
  Trash2,
  KeyRound,
  BriefcaseBusiness,
  CheckCircle2,
  Circle,
  Search,
  HelpCircle,
  MapPin,
  X,
  AlertCircle,
  Sparkles,
  QrCode,
  Hash,
} from "lucide-react";

import AppSidebar from "./AppSidebar";
import "./Settings.css";

/* =========================================================
   INTEGRATION BRAND LOGOS (SVGs)
========================================================= */

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0f172a">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function SlackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
        fill="#E01E5A"
      />
      <path
        d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
        fill="#36C5F0"
      />
      <path
        d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
        fill="#2EB67D"
      />
      <path
        d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
        fill="#ECB22E"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M13 1h10v10H13z" />
      <path fill="#00A4EF" d="M1 13h10v10H1z" />
      <path fill="#FFB900" d="M13 13h10v10H13z" />
    </svg>
  );
}

/* =========================================================
   SETTINGS NAVIGATION ITEMS
========================================================= */

const settingsNavigation = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: CreditCard },
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "billing", label: "Billing", icon: CreditCard },
];

/* =========================================================
   STORAGE & DEFAULT STATE
========================================================= */

const STORAGE_KEY = "teamflow-settings";

const defaultSettings = {
  profile: {
    firstName: "John",
    lastName: "Doe",
    email: "john@company.com",
    jobTitle: "Product Manager",
    phone: "9876543210",
    countryCode: "+91",
    timezone: "Asia/Kolkata (GMT+5:30)",
    language: "English",
    team: "Product Team",
    location: "Pune, India",
    photo: "/avatar.png",
  },
  account: {
    username: "johndoe",
    email: "john@company.com",
    accountId: "TF-2026-0012",
    memberSince: "Oct 10, 2026",
    accountType: "Free Plan",
  },
  workspace: {
    name: "Product Team",
    url: "teamflow-ai",
    plan: "Free Plan",
    visibility: "Private",
    allowInvites: true,
    defaultRole: "Member",
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    taskUpdates: true,
    projectUpdates: false,
    mentionNotifications: true,
    chatNotifications: true,
    deadlineReminders: true,
    weeklySummary: true,
  },
  appearance: {
    theme: "light",
    compactMode: false,
    animations: true,
  },
  security: {
    twoFactorEnabled: false,
    twoFactorMethod: "app",
    lastPasswordChange: "3 months ago",
    sessionsCount: 3,
  },
  integrations: {
    Google: true,
    GitHub: true,
    Slack: false,
    Microsoft: false,
  },
  billing: {
    plan: "Free Plan",
    price: "₹0 / month",
    billingCycle: "Monthly",
    nextBilling: "Nov 10, 2026",
  },
};

const getStoredSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const userPhoto =
        parsed.profile?.photo && !parsed.profile.photo.includes("unsplash")
          ? parsed.profile.photo
          : "/avatar.png";

      return {
        ...defaultSettings,
        ...parsed,
        profile: {
          ...defaultSettings.profile,
          ...(parsed.profile || {}),
          photo: userPhoto,
        },
        account: { ...defaultSettings.account, ...(parsed.account || {}) },
        workspace: { ...defaultSettings.workspace, ...(parsed.workspace || {}) },
        notifications: {
          ...defaultSettings.notifications,
          ...(parsed.notifications || {}),
        },
        appearance: {
          ...defaultSettings.appearance,
          ...(parsed.appearance || {}),
        },
        security: { ...defaultSettings.security, ...(parsed.security || {}) },
        integrations: {
          ...defaultSettings.integrations,
          ...(parsed.integrations || {}),
        },
        billing: { ...defaultSettings.billing, ...(parsed.billing || {}) },
      };
    }
  } catch (error) {
    console.error("Failed to parse settings from localStorage:", error);
  }
  return defaultSettings;
};

/* =========================================================
   MAIN SETTINGS COMPONENT
========================================================= */

function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [settings, setSettings] = useState(getStoredSettings);
  const [draftProfile, setDraftProfile] = useState(settings.profile);

  // Modals state
  const [modal, setModal] = useState({
    type: null, // "password" | "2fa" | "sessions" | "history" | "upgrade" | "edit-username" | "edit-email"
    data: null,
  });

  // Toast notification state
  const [toast, setToast] = useState({
    visible: false,
    message: "",
  });

  const fileInputRef = useRef(null);

  // Persist settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      localStorage.setItem("teamflow-theme", settings.appearance.theme);
      localStorage.setItem(
        "teamflow-compact",
        settings.appearance.compactMode ? "true" : "false"
      );
    } catch (e) {
      console.error("Failed to save settings to localStorage:", e);
    }
  }, [settings]);

  // Apply Theme & Compact Mode dynamically
  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = settings.appearance.theme;
    let effectiveTheme = currentTheme;

    if (currentTheme === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      effectiveTheme = systemDark ? "dark" : "light";
    }

    root.setAttribute("data-theme", effectiveTheme);

    if (settings.appearance.compactMode) {
      root.classList.add("compact-mode");
    } else {
      root.classList.remove("compact-mode");
    }
  }, [settings.appearance.theme, settings.appearance.compactMode]);

  // Listen for ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setModal({ type: null, data: null });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Toast Helper
  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 2800);
  };

  // Close any modal
  const closeModal = () => setModal({ type: null, data: null });

  // Update Draft Profile Field
  const updateDraftProfile = (field, value) => {
    setDraftProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save Profile Changes
  const handleSaveProfile = () => {
    if (!draftProfile.firstName.trim()) {
      showToast("First name cannot be empty");
      return;
    }
    setSettings((prev) => ({
      ...prev,
      profile: { ...draftProfile },
      account: { ...prev.account, email: draftProfile.email },
    }));
    showToast("✓ Profile updated successfully");
  };

  // Cancel Profile Changes
  const handleCancelProfile = () => {
    setDraftProfile(settings.profile);
    showToast("Changes discarded");
  };

  // Photo Upload Handler (FileReader -> Base64)
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|webp)$/i)) {
      showToast("Please upload PNG, JPEG, or WebP image");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setDraftProfile((prev) => ({ ...prev, photo: dataUrl }));
      setSettings((prev) => ({
        ...prev,
        profile: { ...prev.profile, photo: dataUrl },
      }));
      showToast("✓ Profile photo updated successfully");
    };
    reader.readAsDataURL(file);
  };

  // Toggle Integration connection
  const toggleConnection = (name) => {
    const isCurrentlyConnected = Boolean(settings.integrations[name]);
    setSettings((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [name]: !isCurrentlyConnected,
      },
    }));

    showToast(
      isCurrentlyConnected
        ? `${name} disconnected`
        : `✓ ${name} connected successfully`
    );
  };

  // Copy Account ID
  const copyAccountId = () => {
    navigator.clipboard?.writeText(settings.account.accountId);
    showToast("Account ID copied");
  };

  // Navigation tab change
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`settings-layout ${
        settings.appearance.compactMode ? "compact-mode" : ""
      }`}
    >
      <AppSidebar />

      <main className="settings-main">
        {/* =========================================================
            TOPBAR (Search & Actions)
        ========================================================= */}
        <header className="settings-topbar">
          <div className="settings-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search files, folders, projects, members..."
            />
          </div>

          <div className="settings-topbar-actions">
            <button
              type="button"
              className="topbar-icon-button"
              aria-label="Notifications"
              onClick={() => {
                setActiveSection("notifications");
                showToast("Opening notifications preferences");
              }}
            >
              <Bell size={18} />
              <span className="notification-dot" />
            </button>

            <button
              type="button"
              className="topbar-icon-button"
              aria-label="Help & Documentation"
              onClick={() =>
                showToast("TeamFlow Help Center: Support & Guides")
              }
            >
              <HelpCircle size={18} />
            </button>

            <div
              className="topbar-user"
              onClick={() => setActiveSection("profile")}
              title="View Profile"
            >
              <img
                src={settings.profile.photo || "/avatar.png"}
                alt={`${settings.profile.firstName} ${settings.profile.lastName}`}
              />
              <div className="topbar-user-info">
                <strong>
                  {settings.profile.firstName} {settings.profile.lastName}
                </strong>
                <span>{settings.profile.team || "Product Team"}</span>
              </div>
            </div>
          </div>
        </header>

        {/* =========================================================
            SETTINGS CONTENT CONTAINER
        ========================================================= */}
        <div className="settings-content settings-page">
          {/* Settings Header */}
          <div className="settings-page-header">
            <div className="settings-page-icon">
              <SettingsIcon size={24} />
            </div>
            <div>
              <h1>Settings</h1>
              <p>Manage your account, workspace and preferences.</p>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="settings-grid settings-main-grid">
            {/* Left Settings Navigation Menu */}
            <aside className="settings-menu" aria-label="Settings Categories">
              {settingsNavigation.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`settings-menu-item ${
                    activeSection === id ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange(id)}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  <ChevronRight size={16} className="menu-arrow" />
                </button>
              ))}
            </aside>

            {/* Right Main Settings Panel */}
            <section className="settings-panel">
              {activeSection === "profile" && (
                <ProfileSection
                  draftProfile={draftProfile}
                  updateDraftProfile={updateDraftProfile}
                  profilePhoto={settings.profile.photo}
                  handlePhotoClick={handlePhotoClick}
                  handlePhotoChange={handlePhotoChange}
                  fileInputRef={fileInputRef}
                  handleSaveProfile={handleSaveProfile}
                  handleCancelProfile={handleCancelProfile}
                />
              )}

              {activeSection === "account" && (
                <AccountSection
                  account={settings.account}
                  copyAccountId={copyAccountId}
                  openModal={setModal}
                  showToast={showToast}
                />
              )}

              {activeSection === "workspace" && (
                <WorkspaceSection
                  workspace={settings.workspace}
                  setSettings={setSettings}
                  showToast={showToast}
                  openModal={setModal}
                />
              )}

              {activeSection === "notifications" && (
                <NotificationsSection
                  notifications={settings.notifications}
                  setSettings={setSettings}
                  showToast={showToast}
                />
              )}

              {activeSection === "appearance" && (
                <AppearanceSection
                  appearance={settings.appearance}
                  setSettings={setSettings}
                  showToast={showToast}
                />
              )}

              {activeSection === "security" && (
                <SecuritySection
                  security={settings.security}
                  openModal={setModal}
                  showToast={showToast}
                />
              )}

              {activeSection === "integrations" && (
                <IntegrationsSection
                  connections={settings.integrations}
                  toggleConnection={toggleConnection}
                />
              )}

              {activeSection === "billing" && (
                <BillingSection
                  billing={settings.billing}
                  openModal={setModal}
                  showToast={showToast}
                />
              )}
            </section>
          </div>

          {/* LOWER 3 CARDS ONLY ON PROFILE (Matches screenshot layout) */}
          {activeSection === "profile" && (
            <div className="settings-lower-grid settings-bottom-grid">
              {/* Card 1: Connected Accounts */}
              <ConnectedAccountsCard
                connections={settings.integrations}
                toggleConnection={toggleConnection}
                email={settings.profile.email}
                username={settings.account.username}
              />

              {/* Card 2: Account Information */}
              <AccountSummaryCard
                account={settings.account}
                copyAccountId={copyAccountId}
                openModal={setModal}
              />

              {/* Card 3: Security Summary */}
              <SecuritySummaryCard
                security={settings.security}
                openModal={setModal}
              />
            </div>
          )}
        </div>
      </main>

      {/* =========================================================
          MODALS
      ========================================================= */}
      {modal.type === "password" && (
        <ChangePasswordModal
          onClose={closeModal}
          onSuccess={() => {
            setSettings((prev) => ({
              ...prev,
              security: { ...prev.security, lastPasswordChange: "Just now" },
            }));
            showToast("✓ Password updated successfully");
            closeModal();
          }}
        />
      )}

      {modal.type === "2fa" && (
        <TwoFactorModal
          enabled={settings.security.twoFactorEnabled}
          onClose={closeModal}
          onToggle={(newState) => {
            setSettings((prev) => ({
              ...prev,
              security: { ...prev.security, twoFactorEnabled: newState },
            }));
            showToast(
              newState
                ? "✓ Two-factor authentication enabled successfully"
                : "Two-factor authentication disabled"
            );
            closeModal();
          }}
        />
      )}

      {modal.type === "sessions" && (
        <ActiveSessionsModal
          onClose={closeModal}
          onSignOutOther={() => {
            setSettings((prev) => ({
              ...prev,
              security: { ...prev.security, sessionsCount: 1 },
            }));
            showToast("✓ Signed out from all other active sessions");
            closeModal();
          }}
          showToast={showToast}
        />
      )}

      {modal.type === "history" && (
        <LoginHistoryModal onClose={closeModal} />
      )}

      {modal.type === "upgrade" && (
        <UpgradePlanModal
          currentPlan={settings.billing.plan}
          onClose={closeModal}
          onSelectPlan={(plan, price) => {
            setSettings((prev) => ({
              ...prev,
              billing: { ...prev.billing, plan, price },
              account: { ...prev.account, accountType: plan },
              workspace: { ...prev.workspace, plan },
            }));
            showToast(`✓ Plan updated to ${plan}`);
            closeModal();
          }}
        />
      )}

      {modal.type === "edit-username" && (
        <EditAccountFieldModal
          title="Edit Username"
          fieldLabel="Username"
          currentValue={settings.account.username}
          onClose={closeModal}
          onSave={(newVal) => {
            setSettings((prev) => ({
              ...prev,
              account: { ...prev.account, username: newVal },
            }));
            showToast("✓ Username updated successfully");
            closeModal();
          }}
        />
      )}

      {modal.type === "edit-email" && (
        <EditAccountFieldModal
          title="Edit Work Email"
          fieldLabel="Work Email"
          type="email"
          currentValue={settings.profile.email}
          onClose={closeModal}
          onSave={(newVal) => {
            setSettings((prev) => ({
              ...prev,
              profile: { ...prev.profile, email: newVal },
              account: { ...prev.account, email: newVal },
            }));
            setDraftProfile((prev) => ({ ...prev, email: newVal }));
            showToast("✓ Work email updated successfully");
            closeModal();
          }}
        />
      )}

      {/* =========================================================
          TOAST NOTIFICATION
      ========================================================= */}
      {toast.visible && (
        <div className="settings-toast" role="alert">
          <CheckCircle2 size={18} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   1. PROFILE SECTION (Top Right Card)
========================================================= */

function ProfileSection({
  draftProfile,
  updateDraftProfile,
  profilePhoto,
  handlePhotoClick,
  handlePhotoChange,
  fileInputRef,
  handleSaveProfile,
  handleCancelProfile,
}) {
  return (
    <div className="settings-card profile-card">
      <div className="card-header">
        <div className="card-header-title">
          <div className="card-icon blue">
            <User size={20} />
          </div>
          <div>
            <h2>Profile Information</h2>
            <p>Update your personal information and how others see you.</p>
          </div>
        </div>

        <button
          type="button"
          className="outline-button"
          onClick={handlePhotoClick}
        >
          <Camera size={15} />
          Change Photo
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          hidden
          onChange={handlePhotoChange}
        />
      </div>

      <div className="profile-body">
        {/* Left Avatar & Meta Preview */}
        <div className="profile-preview">
          <div className="profile-image-wrapper">
            <img
              src={draftProfile.photo || profilePhoto || "/avatar.png"}
              alt="Profile"
              className="profile-large-image"
            />
            <button
              type="button"
              className="profile-camera-button"
              onClick={handlePhotoClick}
              title="Change Profile Photo"
            >
              <Camera size={14} />
            </button>
          </div>

          <h3>
            {draftProfile.firstName} {draftProfile.lastName}
          </h3>

          <span className="role-badge">
            {draftProfile.jobTitle || "Product Manager"}
          </span>

          <div className="profile-meta">
            <span>
              <Building2 size={14} />
              {draftProfile.team || "Product Team"}
            </span>
            <span>
              <MapPin size={14} />
              {draftProfile.location || "Pune, India"}
            </span>
          </div>
        </div>

        {/* Right Form Fields */}
        <div className="profile-form profile-form-grid">
          <div className="form-row">
            <div className="form-field">
              <label>First Name</label>
              <input
                type="text"
                value={draftProfile.firstName}
                onChange={(e) =>
                  updateDraftProfile("firstName", e.target.value)
                }
                placeholder="John"
              />
            </div>

            <div className="form-field">
              <label>Last Name</label>
              <input
                type="text"
                value={draftProfile.lastName}
                onChange={(e) =>
                  updateDraftProfile("lastName", e.target.value)
                }
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Work Email</label>
              <input
                type="email"
                value={draftProfile.email}
                onChange={(e) => updateDraftProfile("email", e.target.value)}
                placeholder="john@company.com"
              />
            </div>

            <div className="form-field">
              <label>Job Title</label>
              <input
                type="text"
                value={draftProfile.jobTitle}
                onChange={(e) =>
                  updateDraftProfile("jobTitle", e.target.value)
                }
                placeholder="Product Manager"
              />
            </div>
          </div>

          <div className="form-row form-row-three">
            <div className="form-field phone-field">
              <label>Phone Number</label>
              <div className="phone-input">
                <select
                  value={draftProfile.countryCode}
                  onChange={(e) =>
                    updateDraftProfile("countryCode", e.target.value)
                  }
                >
                  <option value="+91">IN +91</option>
                  <option value="+1">US +1</option>
                  <option value="+44">UK +44</option>
                  <option value="+971">AE +971</option>
                  <option value="+65">SG +65</option>
                </select>
                <input
                  type="tel"
                  value={draftProfile.phone}
                  onChange={(e) =>
                    updateDraftProfile("phone", e.target.value)
                  }
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div className="form-field">
              <label>Timezone</label>
              <select
                value={draftProfile.timezone}
                onChange={(e) =>
                  updateDraftProfile("timezone", e.target.value)
                }
              >
                <option value="Asia/Kolkata (GMT+5:30)">
                  Asia/Kolkata (GMT+5:30)
                </option>
                <option value="Asia/Dubai (GMT+4:00)">
                  Asia/Dubai (GMT+4:00)
                </option>
                <option value="Asia/Singapore (GMT+8:00)">
                  Asia/Singapore (GMT+8:00)
                </option>
                <option value="Europe/London (GMT+0:00)">
                  Europe/London (GMT+0:00)
                </option>
                <option value="America/New_York (GMT-5:00)">
                  America/New_York (GMT-5:00)
                </option>
                <option value="America/Los_Angeles (GMT-8:00)">
                  America/Los_Angeles (GMT-8:00)
                </option>
              </select>
            </div>

            <div className="form-field">
              <label>Language</label>
              <select
                value={draftProfile.language}
                onChange={(e) =>
                  updateDraftProfile("language", e.target.value)
                }
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <button
          type="button"
          className="cancel-button"
          onClick={handleCancelProfile}
        >
          Cancel
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={handleSaveProfile}
        >
          <Save size={15} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   CONNECTED ACCOUNTS CARD (Bottom 1)
========================================================= */

function ConnectedAccountsCard({
  connections,
  toggleConnection,
  email,
  username,
}) {
  const items = [
    {
      name: "Google",
      Icon: GoogleIcon,
      subtext: email,
      connected: Boolean(connections.Google),
    },
    {
      name: "GitHub",
      Icon: GitHubIcon,
      subtext: username,
      connected: Boolean(connections.GitHub),
    },
    {
      name: "Slack",
      Icon: SlackIcon,
      subtext: "",
      connected: Boolean(connections.Slack),
    },
    {
      name: "Microsoft",
      Icon: MicrosoftIcon,
      subtext: "",
      connected: Boolean(connections.Microsoft),
    },
  ];

  return (
    <div className="settings-card connected-card">
      <div className="card-heading">
        <div className="card-icon purple">
          <Link2 size={18} />
        </div>
        <div>
          <h2>Connected Accounts</h2>
          <p>Manage third-party integrations with your account.</p>
        </div>
      </div>

      <div className="connection-list">
        {items.map(({ name, Icon, subtext, connected }) => (
          <div className="connection-row" key={name}>
            <div className="integration-logo">
              <Icon />
            </div>

            <div className="connection-name-col">
              <strong>{name}</strong>
            </div>

            <span
              className={`connection-status ${
                connected ? "connected" : "not-connected"
              }`}
            >
              {connected ? (
                <>
                  <Check size={11} strokeWidth={3} />
                  Connected
                </>
              ) : (
                <>
                  <Circle size={8} />
                  Not Connected
                </>
              )}
            </span>

            <span className="connection-meta" title={subtext}>
              {connected ? subtext : ""}
            </span>

            <button
              type="button"
              className={
                connected ? "small-outline-button" : "small-connect-button"
              }
              onClick={() => toggleConnection(name)}
            >
              {connected ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   ACCOUNT SUMMARY CARD (Bottom 2)
========================================================= */

function AccountSummaryCard({ account, copyAccountId, openModal }) {
  return (
    <div className="settings-card summary-card account-summary-card">
      <div className="card-heading">
        <div className="card-icon blue">
          <CreditCard size={18} />
        </div>
        <div>
          <h2>Account Information</h2>
          <p>Manage your account details and preferences.</p>
        </div>
      </div>

      <div className="summary-list">
        <div className="summary-row">
          <div className="summary-label">
            <User size={15} />
            <span>Username</span>
          </div>
          <span className="summary-value">{account.username}</span>
          <button
            type="button"
            className="summary-action"
            onClick={() => openModal({ type: "edit-username" })}
          >
            Edit
          </button>
        </div>

        <div className="summary-row">
          <div className="summary-label">
            <Mail size={15} />
            <span>Email Address</span>
          </div>
          <span className="summary-value">{account.email}</span>
          <button
            type="button"
            className="summary-action"
            onClick={() => openModal({ type: "edit-email" })}
          >
            Edit
          </button>
        </div>

        <div className="summary-row">
          <div className="summary-label">
            <Hash size={15} />
            <span>Account ID</span>
          </div>
          <span className="summary-value">{account.accountId}</span>
          <button
            type="button"
            className="copy-button"
            onClick={copyAccountId}
            title="Copy Account ID"
          >
            <Copy size={15} />
          </button>
        </div>

        <div className="summary-row">
          <div className="summary-label">
            <Clock size={15} />
            <span>Member Since</span>
          </div>
          <span className="summary-value">{account.memberSince}</span>
          <div style={{ width: "24px" }} />
        </div>

        <div className="summary-row">
          <div className="summary-label">
            <Crown size={15} />
            <span>Account Type</span>
          </div>
          <span className="summary-value">{account.accountType}</span>
          <button
            type="button"
            className="summary-action"
            onClick={() => openModal({ type: "upgrade" })}
          >
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SECURITY SUMMARY CARD (Bottom 3)
========================================================= */

function SecuritySummaryCard({ security, openModal }) {
  return (
    <div className="settings-card summary-card security-summary-card">
      <div className="card-heading">
        <div className="card-icon blue">
          <Shield size={18} />
        </div>
        <div>
          <h2>Security</h2>
          <p>Keep your account safe and secure.</p>
        </div>
      </div>

      <div className="summary-list">
        <div className="summary-row">
          <div className="summary-label">
            <Lock size={15} />
            <span>Password</span>
          </div>
          <span className="summary-value">••••••••</span>
          <button
            type="button"
            className="summary-action"
            onClick={() => openModal({ type: "password" })}
          >
            Change Password
          </button>
        </div>

        <div className="summary-row">
          <div className="summary-label">
            <Shield size={15} />
            <span>Two-Factor Authentication</span>
          </div>
          <span className="summary-value" style={{ color: "#64748b" }}>
            {security.twoFactorEnabled ? "Enabled" : "Not enabled"}
          </span>
          <button
            type="button"
            className="summary-action"
            onClick={() => openModal({ type: "2fa" })}
          >
            {security.twoFactorEnabled ? "Disable" : "Enable"}
          </button>
        </div>

        <div className="summary-row">
          <div className="summary-label">
            <Monitor size={15} />
            <span>Active Sessions</span>
          </div>
          <span className="summary-value">
            {security.sessionsCount} active sessions
          </span>
          <button
            type="button"
            className="summary-action"
            onClick={() => openModal({ type: "sessions" })}
          >
            View Sessions
          </button>
        </div>

        <div className="summary-row">
          <div className="summary-label">
            <Clock size={15} />
            <span>Login History</span>
          </div>
          <span className="summary-value">Last login: Oct 20, 2026</span>
          <button
            type="button"
            className="summary-action"
            onClick={() => openModal({ type: "history" })}
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   2. FULL ACCOUNT TAB
========================================================= */

function AccountSection({ account, copyAccountId, openModal, showToast }) {
  return (
    <div className="section-stack">
      <div className="section-header">
        <div className="section-header-icon">
          <CreditCard size={20} />
        </div>
        <div>
          <h2>Account Settings</h2>
          <p>Manage your account identity, security IDs and tier details.</p>
        </div>
      </div>

      <div className="large-settings-card">
        <div className="settings-row">
          <div className="settings-row-icon">
            <User size={18} />
          </div>
          <div className="settings-row-content">
            <strong>Username</strong>
            <span>Your unique handle on TeamFlow AI</span>
          </div>
          <span className="settings-row-value">{account.username}</span>
          <button
            type="button"
            className="settings-row-action"
            onClick={() => openModal({ type: "edit-username" })}
          >
            Edit
          </button>
        </div>

        <div className="settings-row">
          <div className="settings-row-icon">
            <Mail size={18} />
          </div>
          <div className="settings-row-content">
            <strong>Email Address</strong>
            <span>Primary address for team invites and notifications</span>
          </div>
          <span className="settings-row-value">{account.email}</span>
          <button
            type="button"
            className="settings-row-action"
            onClick={() => openModal({ type: "edit-email" })}
          >
            Edit
          </button>
        </div>

        <div className="settings-row">
          <div className="settings-row-icon">
            <KeyRound size={18} />
          </div>
          <div className="settings-row-content">
            <strong>Account ID</strong>
            <span>Unique identification key for support and API usage</span>
          </div>
          <span className="settings-row-value">{account.accountId}</span>
          <button
            type="button"
            className="settings-row-action"
            onClick={copyAccountId}
          >
            <Copy size={14} />
            Copy
          </button>
        </div>

        <div className="settings-row">
          <div className="settings-row-icon">
            <Clock3 size={18} />
          </div>
          <div className="settings-row-content">
            <strong>Member Since</strong>
            <span>Date your account was registered</span>
          </div>
          <span className="settings-row-value">{account.memberSince}</span>
        </div>

        <div className="settings-row">
          <div className="settings-row-icon">
            <Crown size={18} />
          </div>
          <div className="settings-row-content">
            <strong>Account Type</strong>
            <span>Current subscription tier and team capacity</span>
          </div>
          <span className="settings-row-value">{account.accountType}</span>
          <button
            type="button"
            className="settings-row-action"
            onClick={() => openModal({ type: "upgrade" })}
          >
            Upgrade
          </button>
        </div>
      </div>

      <div className="danger-zone">
        <div>
          <h3>Delete Account</h3>
          <p>
            Permanently delete your TeamFlow account and all associated workspace
            data. This action cannot be undone.
          </p>
        </div>
        <button
          type="button"
          className="danger-button"
          onClick={() =>
            showToast("Account deletion is restricted in demo mode")
          }
        >
          <Trash2 size={16} />
          Delete Account
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   3. FULL WORKSPACE TAB
========================================================= */

function WorkspaceSection({ workspace, setSettings, showToast, openModal }) {
  const [name, setName] = useState(workspace.name);
  const [url, setUrl] = useState(workspace.url);
  const [visibility, setVisibility] = useState(workspace.visibility || "Private");

  const handleSave = () => {
    setSettings((prev) => ({
      ...prev,
      workspace: {
        ...prev.workspace,
        name,
        url,
        visibility,
      },
      profile: {
        ...prev.profile,
        team: name,
      },
    }));
    showToast("✓ Workspace settings saved successfully");
  };

  return (
    <div className="section-stack">
      <div className="section-header">
        <div className="section-header-icon">
          <Building2 size={20} />
        </div>
        <div>
          <h2>Workspace Settings</h2>
          <p>Configure team properties, custom URL, and organization roles.</p>
        </div>
      </div>

      <div className="large-settings-card">
        <div className="workspace-header">
          <div className="workspace-logo">
            <BriefcaseBusiness size={26} />
          </div>
          <div>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "19px" }}>{name}</h3>
            <span className="role-badge">{workspace.plan}</span>
          </div>
        </div>

        <div className="profile-form profile-form-grid">
          <div className="form-row">
            <div className="form-field">
              <label>Workspace Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Workspace URL Slug</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Workspace Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="Private">Private (Invite only)</option>
                <option value="Team">Team Members Only</option>
                <option value="Public">Public (Anyone with link)</option>
              </select>
            </div>

            <div className="form-field">
              <label>Workspace Plan</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="text"
                  value={workspace.plan}
                  disabled
                  style={{ flex: 1, background: "var(--page-bg)" }}
                />
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => openModal({ type: "upgrade" })}
                >
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="workspace-stat-grid">
          <div className="workspace-stat-item">
            <strong>12</strong>
            <span>Active Members</span>
          </div>
          <div className="workspace-stat-item">
            <strong>8</strong>
            <span>Active Projects</span>
          </div>
          <div className="workspace-stat-item">
            <strong>24</strong>
            <span>Open Tasks</span>
          </div>
        </div>

        <div className="section-save">
          <button type="button" className="primary-button" onClick={handleSave}>
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   4. FULL NOTIFICATIONS TAB
========================================================= */

function NotificationsSection({ notifications, setSettings, showToast }) {
  const toggleNotification = (key) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const notificationList = [
    {
      key: "emailNotifications",
      title: "Email Notifications",
      description: "Receive important announcements and account updates via email",
      icon: Mail,
    },
    {
      key: "pushNotifications",
      title: "Push Notifications",
      description: "Receive real-time push notifications in your browser or device",
      icon: Bell,
    },
    {
      key: "taskUpdates",
      title: "Task Updates",
      description: "Notify me when a task is assigned, updated, or completed",
      icon: CheckCircle2,
    },
    {
      key: "projectUpdates",
      title: "Project Updates",
      description: "Receive updates when milestones or deadlines are updated",
      icon: BriefcaseBusiness,
    },
    {
      key: "mentionNotifications",
      title: "Mention Notifications",
      description: "Notify me when someone mentions @you in comments or chat",
      icon: MessageSquare,
    },
    {
      key: "chatNotifications",
      title: "Chat Notifications",
      description: "Receive sound and banner alerts for new direct messages",
      icon: MessageSquare,
    },
    {
      key: "deadlineReminders",
      title: "Deadline Reminders",
      description: "Get alerts 24 hours and 1 hour before scheduled task deadlines",
      icon: Clock,
    },
    {
      key: "weeklySummary",
      title: "Weekly Summary",
      description: "Receive a weekly digest of team productivity and achievements",
      icon: Clock3,
    },
  ];

  return (
    <div className="section-stack">
      <div className="section-header">
        <div className="section-header-icon">
          <Bell size={20} />
        </div>
        <div>
          <h2>Notifications Preferences</h2>
          <p>Choose which alerts you want to receive across email, web, and chat.</p>
        </div>
      </div>

      <div className="large-settings-card">
        {notificationList.map(({ key, title, description, icon: Icon }) => (
          <div className="toggle-row" key={key}>
            <div className="toggle-icon">
              <Icon size={18} />
            </div>

            <div className="toggle-content">
              <strong>{title}</strong>
              <span>{description}</span>
            </div>

            <button
              type="button"
              className={`switch ${notifications[key] ? "on" : ""}`}
              onClick={() => toggleNotification(key)}
              aria-label={`Toggle ${title}`}
              aria-pressed={Boolean(notifications[key])}
            >
              <span />
            </button>
          </div>
        ))}

        <div className="section-save">
          <button
            type="button"
            className="primary-button"
            onClick={() => showToast("✓ Notification preferences saved")}
          >
            <Save size={16} />
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   5. FULL APPEARANCE TAB (MUST WORK)
========================================================= */

function AppearanceSection({ appearance, setSettings, showToast }) {
  const handleThemeChange = (newTheme) => {
    setSettings((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, theme: newTheme },
    }));
    showToast(`✓ Theme switched to ${newTheme}`);
  };

  const handleCompactToggle = () => {
    const nextVal = !appearance.compactMode;
    setSettings((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, compactMode: nextVal },
    }));
    showToast(nextVal ? "Compact mode enabled" : "Compact mode disabled");
  };

  const handleAnimationsToggle = () => {
    const nextVal = !appearance.animations;
    setSettings((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, animations: nextVal },
    }));
    showToast(
      nextVal ? "Interface animations enabled" : "Interface animations disabled"
    );
  };

  return (
    <div className="section-stack">
      <div className="section-header">
        <div className="section-header-icon">
          <Palette size={20} />
        </div>
        <div>
          <h2>Appearance</h2>
          <p>Customize how TeamFlow AI looks and feels on your screen.</p>
        </div>
      </div>

      <div className="large-settings-card">
        <h3 className="subsection-title">Theme</h3>

        <div className="theme-options">
          {/* Light Theme */}
          <div
            className={`theme-card-option ${
              appearance.theme === "light" ? "selected" : ""
            }`}
            onClick={() => handleThemeChange("light")}
          >
            <div className="theme-card-preview light-preview">
              <div className="preview-sidebar" />
              <div className="preview-content">
                <div className="preview-pill" />
                <div className="preview-line" />
                <div className="preview-line" style={{ width: "60%" }} />
              </div>
            </div>
            <strong>
              <Sun size={16} /> Light
            </strong>
            {appearance.theme === "light" && (
              <span className="theme-selected-badge">
                <CheckCircle2 size={18} />
              </span>
            )}
          </div>

          {/* Dark Theme */}
          <div
            className={`theme-card-option ${
              appearance.theme === "dark" ? "selected" : ""
            }`}
            onClick={() => handleThemeChange("dark")}
          >
            <div className="theme-card-preview dark-preview">
              <div className="preview-sidebar" />
              <div className="preview-content">
                <div className="preview-pill" />
                <div className="preview-line" />
                <div className="preview-line" style={{ width: "60%" }} />
              </div>
            </div>
            <strong>
              <Moon size={16} /> Dark
            </strong>
            {appearance.theme === "dark" && (
              <span className="theme-selected-badge">
                <CheckCircle2 size={18} />
              </span>
            )}
          </div>

          {/* System Theme */}
          <div
            className={`theme-card-option ${
              appearance.theme === "system" ? "selected" : ""
            }`}
            onClick={() => handleThemeChange("system")}
          >
            <div className="theme-card-preview system-preview">
              <div className="preview-sidebar" />
              <div className="preview-content">
                <div className="preview-pill" />
                <div className="preview-line" />
                <div className="preview-line" style={{ width: "60%" }} />
              </div>
            </div>
            <strong>
              <Laptop size={16} /> System
            </strong>
            {appearance.theme === "system" && (
              <span className="theme-selected-badge">
                <CheckCircle2 size={18} />
              </span>
            )}
          </div>
        </div>

        <h3 className="subsection-title" style={{ marginTop: "24px" }}>
          Interface Display
        </h3>

        <div className="toggle-row">
          <div className="toggle-icon">
            <Monitor size={18} />
          </div>
          <div className="toggle-content">
            <strong>Compact Mode</strong>
            <span>
              Reduce spacing and padding throughout Settings and dashboards for
              high-density viewing
            </span>
          </div>
          <button
            type="button"
            className={`switch ${appearance.compactMode ? "on" : ""}`}
            onClick={handleCompactToggle}
            aria-pressed={appearance.compactMode}
          >
            <span />
          </button>
        </div>

        <div className="toggle-row">
          <div className="toggle-icon">
            <Sparkles size={18} />
          </div>
          <div className="toggle-content">
            <strong>Interface Animations</strong>
            <span>Enable smooth transitions, hover effects and modal zooms</span>
          </div>
          <button
            type="button"
            className={`switch ${appearance.animations ? "on" : ""}`}
            onClick={handleAnimationsToggle}
            aria-pressed={appearance.animations}
          >
            <span />
          </button>
        </div>

        <div className="section-save">
          <button
            type="button"
            className="primary-button"
            onClick={() => showToast("✓ Appearance preferences saved")}
          >
            <Save size={16} />
            Save Appearance
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   6. FULL SECURITY TAB (MUST WORK)
========================================================= */

function SecuritySection({ security, openModal, showToast }) {
  return (
    <div className="section-stack">
      <div className="section-header">
        <div className="section-header-icon">
          <Shield size={20} />
        </div>
        <div>
          <h2>Security & Authentication</h2>
          <p>
            Manage your credentials, 2-factor authentication, and connected
            sessions.
          </p>
        </div>
      </div>

      <div className="large-settings-card">
        <div className="settings-row">
          <div className="settings-row-icon">
            <Lock size={18} />
          </div>
          <div className="settings-row-content">
            <strong>Password</strong>
            <span>Last changed: {security.lastPasswordChange}</span>
          </div>
          <span className="settings-row-value">••••••••</span>
          <button
            type="button"
            className="settings-row-action"
            onClick={() => openModal({ type: "password" })}
          >
            Change Password
          </button>
        </div>

        <div className="settings-row">
          <div className="settings-row-icon">
            <Shield size={18} />
          </div>
          <div className="settings-row-content">
            <strong>Two-Factor Authentication (2FA)</strong>
            <span>
              Protect your account with an authenticator app or SMS code
            </span>
          </div>
          <span
            className={`connection-status ${
              security.twoFactorEnabled ? "connected" : "not-connected"
            }`}
          >
            {security.twoFactorEnabled ? "Enabled" : "Not enabled"}
          </span>
          <button
            type="button"
            className="settings-row-action"
            onClick={() => openModal({ type: "2fa" })}
          >
            {security.twoFactorEnabled ? "Disable" : "Enable"}
          </button>
        </div>

        <div className="settings-row">
          <div className="settings-row-icon">
            <Monitor size={18} />
          </div>
          <div className="settings-row-content">
            <strong>Active Sessions</strong>
            <span>Devices and locations currently signed into your account</span>
          </div>
          <span className="settings-row-value">
            {security.sessionsCount} active devices
          </span>
          <button
            type="button"
            className="settings-row-action"
            onClick={() => openModal({ type: "sessions" })}
          >
            View Sessions
          </button>
        </div>

        <div className="settings-row">
          <div className="settings-row-icon">
            <Clock3 size={18} />
          </div>
          <div className="settings-row-content">
            <strong>Login History</strong>
            <span>Recent sign-in logs with IP addresses and browsers</span>
          </div>
          <span className="settings-row-value">Last login: Oct 20, 2026</span>
          <button
            type="button"
            className="settings-row-action"
            onClick={() => openModal({ type: "history" })}
          >
            View History
          </button>
        </div>
      </div>

      {/* Active Device Preview Card */}
      <div className="large-settings-card">
        <h3 className="subsection-title">Current Device</h3>
        <div className="device-row">
          <div className="device-icon">
            <Laptop size={22} />
          </div>
          <div className="device-info">
            <strong>Windows PC (Chrome 124)</strong>
            <span>Pune, India · IP 103.21.244.12 · Active now</span>
          </div>
          <span className="current-session-badge">Active Now</span>
        </div>

        <div className="device-row">
          <div className="device-icon">
            <Smartphone size={22} />
          </div>
          <div className="device-info">
            <strong>Android Phone (Chrome Mobile)</strong>
            <span>Pune, India · IP 103.21.244.88 · 2 hours ago</span>
          </div>
          <button
            type="button"
            className="session-remove"
            onClick={() => showToast("Android session signed out")}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="danger-zone">
        <div>
          <h3>Sign Out Everywhere</h3>
          <p>
            Log out of TeamFlow on all active devices, browsers, and mobile apps
            except this current session.
          </p>
        </div>
        <button
          type="button"
          className="danger-button"
          onClick={() =>
            showToast("✓ Signed out from all other active sessions")
          }
        >
          <LogOut size={16} />
          Sign Out Everywhere
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   7. FULL INTEGRATIONS TAB
========================================================= */

function IntegrationsSection({ connections, toggleConnection }) {
  const integrationsList = [
    {
      name: "Google",
      Icon: GoogleIcon,
      description:
        "Connect Google Drive, Calendar meetings, and Gmail notifications with TeamFlow workflows.",
    },
    {
      name: "GitHub",
      Icon: GitHubIcon,
      description:
        "Link pull requests, commits, and issue tracking directly to TeamFlow task cards.",
    },
    {
      name: "Slack",
      Icon: SlackIcon,
      description:
        "Stream task notifications, sprint updates, and AI summaries straight into Slack channels.",
    },
    {
      name: "Microsoft",
      Icon: MicrosoftIcon,
      description:
        "Integrate Microsoft 365, Teams meetings, and Outlook calendar schedule.",
    },
  ];

  return (
    <div className="section-stack">
      <div className="section-header">
        <div className="section-header-icon">
          <Link2 size={20} />
        </div>
        <div>
          <h2>Integrations</h2>
          <p>
            Connect TeamFlow AI with third-party developer and team productivity
            tools.
          </p>
        </div>
      </div>

      <div className="large-settings-card">
        {integrationsList.map(({ name, Icon, description }) => {
          const isConnected = Boolean(connections[name]);

          return (
            <div className="integration-large-row" key={name}>
              <div className="integration-large-logo">
                <Icon />
              </div>

              <div className="integration-large-content">
                <strong>{name}</strong>
                <span>{description}</span>
              </div>

              <span
                className={`connection-status ${
                  isConnected ? "connected" : "not-connected"
                }`}
              >
                {isConnected ? (
                  <>
                    <Check size={12} strokeWidth={3} />
                    Connected
                  </>
                ) : (
                  <>
                    <Circle size={8} />
                    Not Connected
                  </>
                )}
              </span>

              <button
                type="button"
                className={
                  isConnected ? "small-outline-button" : "small-connect-button"
                }
                onClick={() => toggleConnection(name)}
              >
                {isConnected ? "Disconnect" : "Connect"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   8. FULL BILLING TAB
========================================================= */

function BillingSection({ billing, openModal, showToast }) {
  return (
    <div className="section-stack">
      <div className="section-header">
        <div className="section-header-icon">
          <CreditCard size={20} />
        </div>
        <div>
          <h2>Billing & Plans</h2>
          <p>
            Manage your TeamFlow plan subscription, payment details, and team
            seats.
          </p>
        </div>
      </div>

      <div className="large-settings-card">
        <div className="billing-plan-card">
          <div className="billing-plan-info">
            <div className="billing-plan-icon">
              <Crown size={28} />
            </div>
            <div className="billing-plan-details">
              <h2>{billing.plan}</h2>
              <p>
                {billing.price} · Billed {billing.billingCycle} · Next renewal on{" "}
                {billing.nextBilling}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => openModal({ type: "upgrade" })}
          >
            <Crown size={16} />
            Upgrade Plan
          </button>
        </div>

        <h3 className="subsection-title">Plan Capabilities</h3>

        <div className="billing-features-grid">
          <div className="billing-feature-item">
            <CheckCircle2 size={16} />
            <span>Up to 10 team members</span>
          </div>
          <div className="billing-feature-item">
            <CheckCircle2 size={16} />
            <span>Unlimited Kanban boards & sprint tasks</span>
          </div>
          <div className="billing-feature-item">
            <CheckCircle2 size={16} />
            <span>Basic AI Assistant (100 prompts / month)</span>
          </div>
          <div className="billing-feature-item">
            <CheckCircle2 size={16} />
            <span>5 GB cloud file storage</span>
          </div>
          <div className="billing-feature-item">
            <CheckCircle2 size={16} />
            <span>Google & GitHub integration support</span>
          </div>
          <div className="billing-feature-item">
            <CheckCircle2 size={16} />
            <span>Standard email customer support</span>
          </div>
        </div>

        <div className="card-footer" style={{ borderTop: "1px solid var(--card-border)" }}>
          <button
            type="button"
            className="outline-button"
            onClick={() =>
              showToast("Billing receipts sent to john@company.com")
            }
          >
            Download Invoices
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => openModal({ type: "upgrade" })}
          >
            Change Subscription Plan
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL 1: CHANGE PASSWORD
========================================================= */

function ChangePasswordModal({ onClose, onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!currentPassword) {
      setError("Current password is required.");
      return;
    }
    if (!newPassword) {
      setError("New password is required.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password cannot be the same as your current password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Confirm password must match your new password.");
      return;
    }

    onSuccess();
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Change Password</h3>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "#fee2e2",
                  color: "#dc2626",
                  fontSize: "13px",
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-field">
              <label>Current Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  autoFocus
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-field">
              <label>New Password (min 8 characters)</label>
              <div className="password-input-wrapper">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-field">
              <label>Confirm New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL 2: TWO-FACTOR AUTHENTICATION (2FA)
========================================================= */

function TwoFactorModal({ enabled, onClose, onToggle }) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("app");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");

  if (enabled) {
    return (
      <div className="settings-modal-overlay" onClick={onClose}>
        <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Disable Two-Factor Authentication</h3>
            <button
              type="button"
              className="modal-close-button"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
          <div className="modal-body">
            <p style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)" }}>
              Are you sure you want to disable Two-Factor Authentication? Your
              account will only be protected by your password.
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="danger-button"
              onClick={() => onToggle(false)}
            >
              Disable 2FA
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleVerify = (e) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length < 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }
    onToggle(true);
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Enable Two-Factor Authentication</h3>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {step === 1 ? (
          <div>
            <div className="modal-body">
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-secondary)" }}>
                Step 1: Choose your preferred authentication method
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "8px",
                }}
              >
                <div
                  className={`theme-card-option ${
                    method === "app" ? "selected" : ""
                  }`}
                  onClick={() => setMethod("app")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <QrCode size={22} color="var(--primary-purple)" />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <strong style={{ fontSize: "14px" }}>Authenticator App</strong>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        Google Authenticator, Authy, or 1Password (Recommended)
                      </span>
                    </div>
                  </div>
                  {method === "app" && <CheckCircle2 size={18} color="var(--primary-purple)" />}
                </div>

                <div
                  className={`theme-card-option ${
                    method === "sms" ? "selected" : ""
                  }`}
                  onClick={() => setMethod("sms")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Smartphone size={22} color="var(--primary-purple)" />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <strong style={{ fontSize: "14px" }}>SMS Text Message</strong>
                      <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        Send temporary 6-digit codes to +91 9876543210
                      </span>
                    </div>
                  </div>
                  {method === "sms" && <CheckCircle2 size={18} color="var(--primary-purple)" />}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="cancel-button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => setStep(2)}
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="modal-body">
              <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-secondary)" }}>
                Step 2: Scan the QR code or enter manual secret key
              </p>

              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: "#fee2e2",
                    color: "#dc2626",
                    fontSize: "13px",
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {method === "app" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "16px",
                    background: "var(--page-bg)",
                    borderRadius: "14px",
                    border: "1px solid var(--card-border)",
                  }}
                >
                  {/* Clean SVG Mock QR */}
                  <svg width="130" height="130" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="#ffffff" rx="8" />
                    <path
                      d="M10 10h30v30h-30z M15 15h20v20h-20z M60 10h30v30h-30z M65 15h20v20h-20z M10 60h30v30h-30z M15 65h20v20h-20z M45 10h10v10h-10z M45 30h10v20h-10z M10 45h20v10h-20z M60 45h30v10h-30z M45 60h20v10h-20z M75 60h15v15h-15z M45 80h10v10h-10z M65 80h25v10h-25z"
                      fill="#111827"
                    />
                    <circle cx="50" cy="50" r="10" fill="#6842ff" />
                  </svg>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      marginTop: "10px",
                    }}
                  >
                    Secret Key:{" "}
                    <strong style={{ letterSpacing: "1px", color: "var(--text-main)" }}>
                      TF2A-89KJ-42PL-99XQ
                    </strong>
                  </span>
                </div>
              )}

              <div className="form-field">
                <label>Enter 6-digit Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="e.g. 849201"
                  autoFocus
                  style={{
                    fontSize: "20px",
                    letterSpacing: "8px",
                    textAlign: "center",
                  }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button type="submit" className="primary-button">
                Verify & Enable
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MODAL 3: ACTIVE SESSIONS
========================================================= */

function ActiveSessionsModal({ onClose, onSignOutOther, showToast }) {
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: "Windows 11 PC",
      browser: "Chrome 124",
      location: "Pune, India",
      ip: "103.21.244.12",
      activeTime: "Active now",
      current: true,
      Icon: Laptop,
    },
    {
      id: 2,
      device: "Android 14 Phone",
      browser: "Chrome Mobile 123",
      location: "Pune, India",
      ip: "103.21.244.88",
      activeTime: "2 hours ago",
      current: false,
      Icon: Smartphone,
    },
    {
      id: 3,
      device: "MacBook Pro",
      browser: "Safari 17.4",
      location: "Mumbai, India",
      ip: "182.74.15.2",
      activeTime: "3 days ago",
      current: false,
      Icon: Laptop,
    },
  ]);

  const revokeSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    showToast("Session signed out successfully");
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Active Sessions & Devices</h3>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-secondary)" }}>
            These devices are currently logged into your TeamFlow account. You
            can revoke any unfamiliar session immediately.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sessions.map((s) => {
              const DeviceIcon = s.Icon;
              return (
                <div className="device-row" key={s.id}>
                  <div className="device-icon">
                    <DeviceIcon size={20} />
                  </div>
                  <div className="device-info">
                    <strong>
                      {s.device} · {s.browser}
                    </strong>
                    <span>
                      {s.location} · {s.ip} · {s.activeTime}
                    </span>
                  </div>

                  {s.current ? (
                    <span className="current-session-badge">Current Device</span>
                  ) : (
                    <button
                      type="button"
                      className="session-remove"
                      onClick={() => revokeSession(s.id)}
                    >
                      Revoke
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="danger-button"
            onClick={onSignOutOther}
          >
            Sign Out All Other Sessions
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL 4: LOGIN HISTORY
========================================================= */

function LoginHistoryModal({ onClose }) {
  const history = [
    {
      date: "Oct 20, 2026, 14:22",
      device: "Chrome / Windows 11",
      location: "Pune, India",
      ip: "103.21.244.12",
      status: "Successful",
    },
    {
      date: "Oct 18, 2026, 09:15",
      device: "Chrome / Android 14",
      location: "Pune, India",
      ip: "103.21.244.88",
      status: "Successful",
    },
    {
      date: "Oct 15, 2026, 19:40",
      device: "Chrome / Windows 11",
      location: "Pune, India",
      ip: "103.21.244.12",
      status: "Successful",
    },
    {
      date: "Oct 12, 2026, 11:05",
      device: "Safari / macOS Sonoma",
      location: "Mumbai, India",
      ip: "182.74.15.2",
      status: "Successful",
    },
    {
      date: "Oct 08, 2026, 16:30",
      device: "Firefox / Windows 11",
      location: "Pune, India",
      ip: "103.21.244.12",
      status: "Successful",
    },
  ];

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Login Activity History</h3>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-secondary)" }}>
            Review recent sign-in attempts and security events for your account.
          </p>

          <div style={{ overflowX: "auto" }}>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Device / Browser</th>
                  <th>Location</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, index) => (
                  <tr key={index}>
                    <td>{h.date}</td>
                    <td>{h.device}</td>
                    <td>{h.location}</td>
                    <td>{h.ip}</td>
                    <td>
                      <span
                        className="connection-status connected"
                        style={{ fontSize: "11px" }}
                      >
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="primary-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL 5: UPGRADE PLAN
========================================================= */

function UpgradePlanModal({ currentPlan, onClose, onSelectPlan }) {
  const plans = [
    {
      name: "Free Plan",
      price: "₹0",
      period: "/ month",
      featured: false,
      features: [
        "Up to 10 team members",
        "Unlimited tasks & sprints",
        "Basic AI Assistant (100 prompts)",
        "5 GB cloud storage",
        "Community support",
      ],
    },
    {
      name: "Pro Plan",
      price: "₹999",
      period: "/ month",
      featured: true,
      features: [
        "Up to 50 team members",
        "Unlimited AI Assistant queries",
        "100 GB cloud storage",
        "Custom workflow automations",
        "Slack & Microsoft Teams sync",
        "Priority email & chat support",
      ],
    },
    {
      name: "Business Plan",
      price: "₹2,499",
      period: "/ month",
      featured: false,
      features: [
        "Unlimited team members",
        "Enterprise Custom AI Models",
        "1 TB secure cloud storage",
        "SAML Single Sign-On (SSO)",
        "Audit logs & compliance",
        "24/7 dedicated support & SLA",
      ],
    },
  ];

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Upgrade TeamFlow Subscription</h3>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-secondary)" }}>
            Select the plan that matches your organization scale and AI workflow
            needs.
          </p>

          <div className="pricing-modal-grid">
            {plans.map((p) => {
              const isCurrent = currentPlan === p.name;

              return (
                <div
                  key={p.name}
                  className={`pricing-plan-card ${p.featured ? "featured" : ""}`}
                >
                  {p.featured && (
                    <span className="pricing-badge">POPULAR</span>
                  )}

                  <h4>{p.name}</h4>
                  <div className="pricing-price">
                    {p.price} <span>{p.period}</span>
                  </div>

                  <ul className="pricing-features-list">
                    {p.features.map((feat, idx) => (
                      <li key={idx}>
                        <Check size={14} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={
                      isCurrent
                        ? "outline-button"
                        : p.featured
                        ? "primary-button"
                        : "outline-button"
                    }
                    disabled={isCurrent}
                    onClick={() => onSelectPlan(p.name, `${p.price} ${p.period}`)}
                  >
                    {isCurrent ? "Current Plan" : `Select ${p.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL 6: EDIT FIELD (Username / Email)
========================================================= */

function EditAccountFieldModal({
  title,
  fieldLabel,
  type = "text",
  currentValue,
  onClose,
  onSave,
}) {
  const [val, setVal] = useState(currentValue);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!val.trim()) {
      setError(`${fieldLabel} cannot be empty`);
      return;
    }
    if (type === "email" && !/\S+@\S+\.\S+/.test(val)) {
      setError("Please enter a valid email address");
      return;
    }
    onSave(val.trim());
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "#fee2e2",
                  color: "#dc2626",
                  fontSize: "13px",
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-field">
              <label>{fieldLabel}</label>
              <input
                type={type}
                value={val}
                onChange={(e) => setVal(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
