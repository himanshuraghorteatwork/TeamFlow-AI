import { useRef, useState, useSyncExternalStore, useEffect } from "react";
import {
  Check,
  ChevronRight,
  CircleHelp,
  Eye,
  EyeOff,
  Globe2,
  KeyRound,
  Laptop,
  LockKeyhole,
  Mail,
  Monitor,
  Moon,
  Palette,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sun,
  UserRound,
  Users,
  RotateCcw,
  Search,
  Sparkles,
  CheckSquare,
  Bug,
  X,
  Settings,
  Building2,
  Download,
  Bell,
  Volume2,
  VolumeX,
  MoonStar,
  GitPullRequest,
  Clock,
  Radio,
} from "lucide-react";
import "./Setting.css";

/* --------------------------------------------------------------------------
   UNIVERSAL MODULE TABS (MATCHING ADMIN NAVIGATION TABS)
   -------------------------------------------------------------------------- */
const TABS = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "account", label: "Account", icon: Settings },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "team", label: "Team Settings", icon: Building2 },
];

const SECTIONS = [
  {
    id: "profile",
    label: "Profile",
    desc: "Personal info & public details",
    fullDesc: "Manage your personal information, contact email, and workspace presence.",
    icon: UserRound,
    color: "#6366f1",
    bg: "rgba(99, 102, 241, 0.12)",
    keywords: ["name", "email", "avatar", "photo", "bio", "role", "timezone"],
  },
  {
    id: "account",
    label: "Account",
    desc: "Locale, schedules & defaults",
    fullDesc: "Configure working hours, date and time localization, and workspace task defaults.",
    icon: Settings,
    color: "#0284c7",
    bg: "rgba(2, 132, 199, 0.12)",
    keywords: ["language", "date", "time", "work", "hours", "days", "priority", "export"],
  },
  {
    id: "appearance",
    label: "Appearance",
    desc: "Theme modes & display density",
    fullDesc: "Choose how TeamFlow looks on this device with light, dark, or system themes.",
    icon: Palette,
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.12)",
    keywords: ["theme", "dark", "light", "system", "density", "comfortable", "compact", "color"],
  },
  {
    id: "notifications",
    label: "Notifications",
    desc: "Alerts, digests & quiet hours",
    fullDesc: "Choose what updates you receive and configure alert channels for your sprint team.",
    icon: Bell,
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.12)",
    keywords: ["notifications", "alerts", "email", "mentions", "tasks", "bugs", "sprint", "digest", "quiet", "sound", "push"],
  },
  {
    id: "security",
    label: "Security",
    desc: "Password & session security",
    fullDesc: "Update your login credentials, two-factor auth, and review active sessions.",
    icon: ShieldCheck,
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.12)",
    keywords: ["password", "session", "device", "auth", "login", "credentials", "2fa"],
  },
  {
    id: "team",
    label: "Team Settings",
    desc: "Squad goals, velocity & rules",
    fullDesc: "Configure squad identity, sprint length, velocity targets, and review gates.",
    icon: Building2,
    color: "#ec4899",
    bg: "rgba(236, 72, 153, 0.12)",
    keywords: ["squad", "team", "sprint", "velocity", "duration", "approval", "estimation", "quota"],
  },
];

const SETTINGS_STORAGE_KEY = "teamflow_teamlead_settings";

const DEFAULT_PROFILE = {
  name: "Priya Sharma",
  email: "priya.sharma@teamflow.ai",
  role: "Team Lead",
  timezone: "Asia/Kolkata",
  bio: "Helping our product team plan, collaborate, and deliver great work.",
  photo: "",
};

const DEFAULT_ACCOUNT = {
  language: "en-US",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12h",
  firstDayOfWeek: "monday",
  workDays: ["mon", "tue", "wed", "thu", "fri"],
  workHourStart: "09:00",
  workHourEnd: "18:00",
  defaultTaskPriority: "Medium",
  defaultTaskEstimation: "Story Points",
  allowGuestInvites: true,
  allowFileAttachments: true,
};

const DEFAULT_NOTIFICATIONS = {
  taskAssignments: true,
  codeReviews: true,
  blockerBugs: true,
  sprintMilestones: true,
  teamMentions: true,
  aiInsights: true,
  emailDigest: true,
  desktopPush: false,
  soundAlerts: true,
  quietHours: true,
  quietStart: "22:00",
  quietEnd: "08:00",
};

const DEFAULT_TEAM = {
  squadName: "Product Squad Alpha",
  squadKey: "ALPHA",
  leadName: "Komal Pawar",
  department: "Frontend Engineering",
  sprintDuration: "2 Weeks",
  velocityTarget: 45,
  estimationUnit: "Story Points (Fibonacci)",
  autoRollover: true,
  requireApproval: true,
  autoAssignBlockers: true,
  aiWorkloadAdvice: true,
};

function readStoredSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!saved) return {};
    const settings = JSON.parse(saved);
    if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
      throw new TypeError("Saved settings must be an object.");
    }
    return settings;
  } catch (error) {
    console.error("Failed to load Team Lead settings:", error);
    return {};
  }
}

function readCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem("teamflow_current_user") || "null");
    return user && typeof user === "object" ? user : null;
  } catch (error) {
    console.error("Failed to read current account for Settings:", error);
    return null;
  }
}

function getInitialTheme() {
  try {
    const storedMode = localStorage.getItem("teamflow_theme_mode");
    if (storedMode && ["light", "dark", "system"].includes(storedMode)) {
      return storedMode;
    }
    const adminDark = localStorage.getItem("teamflow_admin_dark");
    if (adminDark !== null) {
      return adminDark === "true" ? "dark" : "light";
    }
    const saved = readStoredSettings();
    if (saved.theme && ["light", "dark", "system"].includes(saved.theme)) {
      return saved.theme;
    }
    return "light";
  } catch {
    return "light";
  }
}

function applyGlobalTheme(themeMode) {
  if (typeof document === "undefined") return;

  let isDark = false;
  if (themeMode === "dark") {
    isDark = true;
  } else if (themeMode === "light") {
    isDark = false;
  } else if (themeMode === "system") {
    isDark = typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  }

  document.documentElement.classList.add("theme-transitioning");

  if (isDark) {
    document.documentElement.classList.add("dark", "sa-dark-mode", "dark-mode");
    document.body.classList.add("dark", "dark-theme", "sa-dark-mode", "dark-mode");
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.classList.remove("dark", "sa-dark-mode", "dark-mode");
    document.body.classList.remove("dark", "dark-theme", "sa-dark-mode", "dark-mode");
    document.documentElement.setAttribute("data-theme", "light");
  }

  try {
    localStorage.setItem("teamflow_admin_dark", String(isDark));
    localStorage.setItem("teamflow_superadmin_dark_mode", String(isDark));
    localStorage.setItem("teamflow_theme_mode", themeMode);
    localStorage.setItem("teamflow_dark_mode", String(isDark));
  } catch {
    // ignore
  }

  window.dispatchEvent(new Event("teamflow_theme_update"));

  window.clearTimeout(window.__tfThemeTimer);
  window.__tfThemeTimer = window.setTimeout(() => {
    document.documentElement.classList.remove("theme-transitioning");
  }, 350);
}

function getInitialSettings() {
  const saved = readStoredSettings();
  const user = readCurrentUser();
  const resolvedTheme = getInitialTheme();

  return {
    profile: {
      ...DEFAULT_PROFILE,
      name: user?.name || DEFAULT_PROFILE.name,
      email: user?.email || DEFAULT_PROFILE.email,
      ...saved.profile,
    },
    account: { ...DEFAULT_ACCOUNT, ...saved.account },
    notifications: { ...DEFAULT_NOTIFICATIONS, ...saved.notifications },
    team: { ...DEFAULT_TEAM, ...saved.team },
    theme: resolvedTheme,
    density: ["Comfortable", "Compact"].includes(saved.density) ? saved.density : "Comfortable",
    accentColor: saved.accentColor || "#6366f1",
    twoFactorEnabled: saved.twoFactorEnabled !== false,
    mobileSessionActive: saved.mobileSessionActive !== false,
  };
}

function getInitials(name = "") {
  return name.trim().split(/\s+/).map(part => part[0] || "").slice(0, 2).join("").toUpperCase();
}

function subscribeToColorScheme(onChange) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSystemColorScheme() {
  return typeof window !== "undefined"
    && Boolean(window.matchMedia?.("(prefers-color-scheme: dark)").matches);
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className={`ts-toggle${checked ? " on" : ""}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

export default function Setting() {
  const [activeSection, setActiveSection] = useState("profile");
  const [searchQuery, setSearchQuery] = useState("");
  const [initialSettings] = useState(getInitialSettings);

  const [profile, setProfile] = useState(initialSettings.profile);
  const [account, setAccount] = useState(initialSettings.account);
  const [notifications, setNotifications] = useState(initialSettings.notifications);
  const [team, setTeam] = useState(initialSettings.team);
  const [theme, setTheme] = useState(initialSettings.theme);
  const [density, setDensity] = useState(initialSettings.density);
  const [accentColor, setAccentColor] = useState(initialSettings.accentColor);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initialSettings.twoFactorEnabled);
  const [mobileSessionActive, setMobileSessionActive] = useState(initialSettings.mobileSessionActive);

  const systemIsDark = useSyncExternalStore(subscribeToColorScheme, getSystemColorScheme, () => false);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [photoError, setPhotoError] = useState("");
  const photoInput = useRef(null);

  // Synchronize external theme changes
  useEffect(() => {
    const handleThemeSync = () => {
      try {
        const storedMode = localStorage.getItem("teamflow_theme_mode");
        const storedDark = localStorage.getItem("teamflow_admin_dark");
        if (storedMode === "system") {
          setTheme("system");
        } else if (storedMode === "dark" || storedDark === "true") {
          setTheme("dark");
        } else if (storedMode === "light" || storedDark === "false") {
          setTheme("light");
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("teamflow_theme_update", handleThemeSync);
    window.addEventListener("storage", handleThemeSync);

    const currentTheme = getInitialTheme();
    setTheme(currentTheme);

    return () => {
      window.removeEventListener("teamflow_theme_update", handleThemeSync);
      window.removeEventListener("storage", handleThemeSync);
    };
  }, []);

  function handleThemeChange(newTheme) {
    setTheme(newTheme);
    applyGlobalTheme(newTheme);
    setNotice("");
    try {
      const saved = readStoredSettings();
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
        ...saved,
        theme: newTheme,
      }));
    } catch {
      // ignore
    }
  }

  function updateProfile(field, value) {
    setProfile(prev => ({ ...prev, [field]: value }));
    setNotice("");
  }

  function updateAccount(field, value) {
    setAccount(prev => ({ ...prev, [field]: value }));
    setNotice("");
  }

  function updateNotification(field, value) {
    setNotifications(prev => ({ ...prev, [field]: value }));
    setNotice("");
  }

  function toggleWorkDay(day) {
    setAccount(prev => {
      const exists = prev.workDays.includes(day);
      const nextDays = exists
        ? prev.workDays.filter(d => d !== day)
        : [...prev.workDays, day];
      return { ...prev, workDays: nextDays };
    });
    setNotice("");
  }

  function updateTeam(field, value) {
    setTeam(prev => ({ ...prev, [field]: value }));
    setNotice("");
  }

  function selectTheme(id) {
    setTheme(id);
    setNotice("");
    const isDark = id === "dark" || (id === "system" && systemIsDark);
    if (typeof document !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark", "sa-dark-mode", "dark-mode");
        document.body.classList.add("dark", "dark-theme", "sa-dark-mode", "dark-mode");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark", "sa-dark-mode", "dark-mode");
        document.body.classList.remove("dark", "dark-theme", "sa-dark-mode", "dark-mode");
        document.documentElement.setAttribute("data-theme", "light");
      }
    }
    try {
      localStorage.setItem("teamflow_admin_dark", String(isDark));
      localStorage.setItem("teamflow_superadmin_dark_mode", String(isDark));
      localStorage.setItem("teamflow_theme_mode", id === "system" ? "system" : (isDark ? "dark" : "light"));
      localStorage.setItem("teamflow_dark_mode", String(isDark));
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event("teamflow_theme_update"));
  }

  function saveSettings(event) {
    if (event) event.preventDefault();

    if (activeSection === "security") {
      updatePassword();
      return;
    }

    applyGlobalTheme(theme);

    if (activeSection === "profile") {
      const cleanName = profile.name.trim();
      const cleanEmail = profile.email.trim().toLowerCase();
      if (!cleanName || !cleanEmail) {
        showMessage("Name and email are required.", "error");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        showMessage("Enter a valid email address.", "error");
        return;
      }

      const user = readCurrentUser();
      try {
        const users = JSON.parse(localStorage.getItem("teamflow_users") || "[]");
        if (!Array.isArray(users)) throw new TypeError("Saved accounts must be an array.");
        const originalEmail = user?.email?.toLowerCase() || profile.email.toLowerCase();
        const conflict = users.some(accountUser => (
          accountUser.email?.toLowerCase() === cleanEmail
          && accountUser.email?.toLowerCase() !== originalEmail
          && accountUser.id !== user?.id
        ));
        if (conflict) {
          showMessage("That email address is already used by another account.", "error");
          return;
        }

        const savedProfile = { ...profile, name: cleanName, email: cleanEmail };
        const updatedSettings = {
          ...readStoredSettings(),
          profile: savedProfile,
          account,
          notifications,
          team,
          theme,
          density,
          accentColor,
          twoFactorEnabled,
          mobileSessionActive,
        };
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));

        if (user) {
          const updatedUser = { ...user, name: cleanName, email: cleanEmail };
          localStorage.setItem("teamflow_current_user", JSON.stringify(updatedUser));
        }
        const accountIndex = users.findIndex(accountUser => (
          (user?.id && accountUser.id === user.id)
          || accountUser.email?.toLowerCase() === (user?.email?.toLowerCase() || originalEmail)
        ));
        if (accountIndex >= 0) {
          users[accountIndex] = { ...users[accountIndex], name: cleanName, email: cleanEmail };
          localStorage.setItem("teamflow_users", JSON.stringify(users));
        }
        setProfile(savedProfile);
        showMessage("Profile and preferences saved on this device.");
      } catch (error) {
        console.error("Failed to save Team Lead profile settings:", error);
        showMessage("Could not save settings. Please try again.", "error");
      }
      return;
    }

    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
        ...readStoredSettings(),
        profile,
        account,
        notifications,
        team,
        theme,
        density,
        accentColor,
        twoFactorEnabled,
        mobileSessionActive,
      }));
      showMessage("Preferences saved on this device.");
    } catch (error) {
      console.error("Failed to save Team Lead preferences:", error);
      showMessage("Could not save preferences in browser storage.", "error");
    }
  }

  function resetCurrentSection() {
    if (activeSection === "account") {
      setAccount({ ...DEFAULT_ACCOUNT });
      showMessage("Account preferences reset to defaults.");
    } else if (activeSection === "appearance") {
      handleThemeChange("light");
      setDensity("Comfortable");
      setAccentColor("#6366f1");
      showMessage("Appearance preferences reset to defaults.");
    } else if (activeSection === "notifications") {
      setNotifications({ ...DEFAULT_NOTIFICATIONS });
      showMessage("Notification preferences reset to defaults.");
    } else if (activeSection === "team") {
      setTeam({ ...DEFAULT_TEAM });
      showMessage("Team settings reset to defaults.");
    } else if (activeSection === "profile") {
      const user = readCurrentUser();
      setProfile({
        ...DEFAULT_PROFILE,
        name: user?.name || DEFAULT_PROFILE.name,
        email: user?.email || DEFAULT_PROFILE.email,
      });
      showMessage("Profile reset to saved values.");
    } else if (activeSection === "security") {
      setPasswords({ current: "", next: "", confirm: "" });
      showMessage("Password form fields cleared.");
    }
  }

  function showMessage(message, type = "success") {
    setNotice(message);
    setNoticeType(type);
    window.clearTimeout(window.__tfNoticeTimer);
    window.__tfNoticeTimer = window.setTimeout(() => {
      setNotice("");
    }, 4000);
  }

  function updatePassword() {
    const { current, next, confirm } = passwords;
    if (!current || !next || !confirm) {
      showMessage("Enter your current password and complete both new password fields.", "error");
      return;
    }
    if (next.length < 8) {
      showMessage("Your new password must contain at least 8 characters.", "error");
      return;
    }
    if (next !== confirm) {
      showMessage("The new password and confirmation do not match.", "error");
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem("teamflow_users") || "[]");
      const user = readCurrentUser();
      const accountIndex = Array.isArray(users)
        ? users.findIndex(accountUser => accountUser.id === user?.id || accountUser.email?.toLowerCase() === profile.email.toLowerCase())
        : -1;
      if (accountIndex < 0) {
        showMessage("Account not found. Sign in with a registered account to change password.", "error");
        return;
      }
      if (users[accountIndex].password !== current) {
        showMessage("The current password is incorrect.", "error");
        return;
      }

      const updatedUsers = users.map((accountUser, index) => (
        index === accountIndex ? { ...accountUser, password: next } : accountUser
      ));
      localStorage.setItem("teamflow_users", JSON.stringify(updatedUsers));
      const updatedUser = { ...users[accountIndex], password: next };
      localStorage.setItem("teamflow_current_user", JSON.stringify(updatedUser));
      setPasswords({ current: "", next: "", confirm: "" });
      showMessage("Password changed successfully.");
    } catch (error) {
      console.error("Failed to change account password:", error);
      showMessage("Could not update password. Please try again.", "error");
    }
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Choose a valid image file.");
      event.target.value = "";
      return;
    }
    if (file.size > 1024 * 1024) {
      setPhotoError("Choose an image smaller than 1 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfile(prev => ({ ...prev, photo: String(reader.result) }));
      setPhotoError("");
      showMessage("Photo selected. Save changes to keep it on this device.");
    };
    reader.onerror = () => {
      console.error("Failed to read selected profile photo.");
      setPhotoError("Could not load image. Please choose another file.");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function exportSettingsData() {
    const exportObject = {
      profile,
      account,
      notifications,
      team,
      theme,
      density,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `teamflow-teamlead-settings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMessage("Settings configuration exported as JSON.");
  }

  const activeItem = SECTIONS.find(section => section.id === activeSection) || SECTIONS[0];

  const filteredSections = SECTIONS.filter(sec => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sec.label.toLowerCase().includes(q) ||
      sec.desc.toLowerCase().includes(q) ||
      sec.keywords.some(k => k.includes(q))
    );
  });

  return (
    <section
      className="ts-page"
      aria-label="Team Lead Settings"
      data-theme={theme === "system" ? (systemIsDark ? "dark" : "light") : theme}
      data-theme-choice={theme}
      data-density={density.toLowerCase()}
    >
      {/* 1. UNIVERSAL MODULE NAVIGATION TABS */}
      <nav className="ts-module-tabs" aria-label="Settings submodules">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`ts-module-tab${activeSection === id ? " active" : ""}`}
            onClick={() => {
              setActiveSection(id);
              setNotice("");
            }}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* 2. TOP PAGE HEADER */}
      <header className="ts-page-header">
        <div className="ts-header-left">
          <span className="ts-eyebrow">WORKSPACE PREFERENCES</span>
          <h1>{activeItem.label} Settings</h1>
          <p>Configure team lead workspace preferences, localization, appearance, and account security.</p>
        </div>
        <div className="ts-header-actions">
          <button
            type="button"
            className="ts-btn ts-btn-secondary"
            onClick={resetCurrentSection}
            title="Reset current tab preferences to defaults"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
          <button
            type="button"
            className="ts-btn ts-btn-primary"
            onClick={saveSettings}
          >
            <Save size={15} />
            <span>Save Changes</span>
          </button>
        </div>
      </header>

      {/* 3. MAIN TWO-COLUMN LAYOUT */}
      <div className="ts-layout">
        {/* LEFT NAVIGATION COLUMN */}
        <nav className="ts-nav" aria-label="Settings navigation">
          {/* SEARCH / FILTER INPUT (LIKE ADMIN "Filter settings...") */}
          <div className="ts-nav-search">
            <Search size={15} className="ts-nav-search-icon" />
            <input
              type="text"
              placeholder="Filter settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Filter settings"
            />
            {searchQuery && (
              <button
                type="button"
                className="ts-nav-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear filter"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="ts-nav-list">
            {filteredSections.map(({ id, label, desc, icon: Icon, color, bg }) => (
              <button
                type="button"
                key={id}
                className={`ts-nav-item${activeSection === id ? " active" : ""}`}
                aria-current={activeSection === id ? "page" : undefined}
                onClick={() => {
                  setActiveSection(id);
                  setNotice("");
                }}
              >
                <span className="ts-nav-icon-badge" style={{ color, background: bg }}>
                  <Icon size={18} />
                </span>
                <div className="ts-nav-item-body">
                  <span className="ts-nav-item-title">{label}</span>
                  <span className="ts-nav-item-desc">{desc}</span>
                </div>
                <ChevronRight size={15} className="ts-nav-chevron" />
              </button>
            ))}
            {filteredSections.length === 0 && (
              <div className="ts-nav-empty">No settings match &ldquo;{searchQuery}&rdquo;</div>
            )}
          </div>

          {/* SQUAD / TIER CARD AT BOTTOM */}
          <div className="ts-tier-card">
            <span className="ts-tier-badge">LEAD WORKSPACE</span>
            <strong>{team.squadName}</strong>
            <small>1 Squad · 8 Active Members</small>
          </div>
        </nav>

        {/* RIGHT CONTENT PANEL */}
        <form className="ts-content" onSubmit={saveSettings}>
          {/* HEADER BANNER CARD FOR ACTIVE SECTION */}
          <div className="ts-section-banner">
            <span
              className="ts-banner-icon"
              style={{ color: activeItem.color, background: activeItem.bg }}
            >
              <activeItem.icon size={22} />
            </span>
            <div className="ts-banner-content">
              <h2>{activeItem.label}</h2>
              <p>{activeItem.fullDesc}</p>
            </div>
          </div>

          {/* TAB 1: PROFILE INFORMATION */}
          {activeSection === "profile" && (
            <>
              <section className="ts-card">
                <div className="ts-card-heading">
                  <div>
                    <h3>Profile Information</h3>
                    <p>Your details are visible to teammates and collaborators across the workspace.</p>
                  </div>
                  <span className="ts-private-label">
                    <Users size={13} /> Team Profile
                  </span>
                </div>

                <div className="ts-profile-photo-row">
                  <span className="ts-profile-avatar">
                    {profile.photo ? (
                      <img src={profile.photo} alt="Profile photo" />
                    ) : (
                      getInitials(profile.name)
                    )}
                    <i />
                  </span>
                  <div className="ts-photo-info">
                    <b>Profile Photo</b>
                    <small>Choose an image up to 1 MB. Recommended format: JPG, PNG or WebP.</small>
                  </div>
                  <input
                    ref={photoInput}
                    className="ts-photo-input"
                    type="file"
                    accept="image/*"
                    aria-label="Choose profile photo"
                    onChange={handlePhotoChange}
                  />
                  <div className="ts-photo-actions">
                    <button
                      type="button"
                      className="ts-btn ts-btn-secondary"
                      onClick={() => photoInput.current?.click()}
                    >
                      Change Photo
                    </button>
                    {profile.photo && (
                      <button
                        type="button"
                        className="ts-btn ts-btn-ghost-danger"
                        onClick={() => {
                          setProfile(prev => ({ ...prev, photo: "" }));
                          showMessage("Profile photo removed. Save changes to update.");
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {photoError && <p className="ts-inline-error" role="alert">{photoError}</p>}

                <div className="ts-form-grid">
                  <label className="ts-field">
                    <span>Full Name</span>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={e => updateProfile("name", e.target.value)}
                      placeholder="e.g. Komal Pawar"
                      autoComplete="name"
                    />
                  </label>

                  <label className="ts-field">
                    <span>Work Email</span>
                    <span className="ts-input-icon">
                      <Mail size={15} />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={e => updateProfile("email", e.target.value)}
                        placeholder="e.g. komal.pawar@teamflow.ai"
                        autoComplete="email"
                      />
                    </span>
                  </label>

                  <label className="ts-field">
                    <span>Role / Title</span>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={e => updateProfile("role", e.target.value)}
                      placeholder="e.g. Team Lead"
                    />
                  </label>

                  <label className="ts-field">
                    <span>Time Zone</span>
                    <span className="ts-input-icon">
                      <Globe2 size={15} />
                      <select
                        value={profile.timezone}
                        onChange={e => updateProfile("timezone", e.target.value)}
                      >
                        <option value="Asia/Kolkata">India Standard Time (UTC+05:30)</option>
                        <option value="America/Los_Angeles">Pacific Time (UTC-08:00)</option>
                        <option value="America/New_York">Eastern Time (UTC-05:00)</option>
                        <option value="Europe/London">Greenwich Mean Time (UTC+00:00)</option>
                        <option value="Asia/Singapore">Singapore Standard Time (UTC+08:00)</option>
                      </select>
                    </span>
                  </label>

                  <label className="ts-field full">
                    <span>About / Bio</span>
                    <textarea
                      rows={3}
                      maxLength={180}
                      value={profile.bio}
                      onChange={e => updateProfile("bio", e.target.value)}
                      placeholder="Share a brief introduction or your responsibilities..."
                    />
                    <small>{profile.bio.length}/180 characters</small>
                  </label>
                </div>
              </section>

              <section className="ts-card ts-preference-summary">
                <span className="ts-summary-icon">
                  <Users size={18} />
                </span>
                <div>
                  <b>Part of {team.department}</b>
                  <small>Workspace squad permissions and team allocations are managed by organization administrators.</small>
                </div>
                <span className="ts-role-pill">Team Lead</span>
              </section>
            </>
          )}

          {/* TAB 2: ACCOUNT PREFERENCES */}
          {activeSection === "account" && (
            <>
              {/* LOCALIZATION & TIME */}
              <section className="ts-card">
                <div className="ts-card-heading">
                  <div>
                    <h3>Language & Region</h3>
                    <p>Customize your language, date formats, and calendar localization preferences.</p>
                  </div>
                </div>

                <div className="ts-form-grid">
                  <label className="ts-field">
                    <span>Platform Language</span>
                    <select
                      value={account.language}
                      onChange={e => updateAccount("language", e.target.value)}
                    >
                      <option value="en-US">English (United States)</option>
                      <option value="en-GB">English (United Kingdom)</option>
                      <option value="es-ES">Spanish (Español)</option>
                      <option value="fr-FR">French (Français)</option>
                      <option value="de-DE">German (Deutsch)</option>
                      <option value="ja-JP">Japanese (日本語)</option>
                      <option value="hi-IN">Hindi (हिंदी)</option>
                    </select>
                  </label>

                  <label className="ts-field">
                    <span>Date Format</span>
                    <select
                      value={account.dateFormat}
                      onChange={e => updateAccount("dateFormat", e.target.value)}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY (11/02/2026)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (02/11/2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2026-11-02)</option>
                    </select>
                  </label>

                  <label className="ts-field">
                    <span>Time Display</span>
                    <select
                      value={account.timeFormat}
                      onChange={e => updateAccount("timeFormat", e.target.value)}
                    >
                      <option value="12h">12-Hour (e.g. 02:30 PM)</option>
                      <option value="24h">24-Hour (e.g. 14:30)</option>
                    </select>
                  </label>

                  <label className="ts-field">
                    <span>First Day of Week</span>
                    <select
                      value={account.firstDayOfWeek}
                      onChange={e => updateAccount("firstDayOfWeek", e.target.value)}
                    >
                      <option value="monday">Monday (Standard)</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </label>
                </div>
              </section>

              {/* SQUAD WORKING DAYS & HOURS */}
              <section className="ts-card">
                <div className="ts-card-heading">
                  <div>
                    <h3>Working Days & Schedule</h3>
                    <p>Specify the active working schedule for sprint task estimations and calendar availability.</p>
                  </div>
                </div>

                <div className="ts-workdays-row">
                  <span className="ts-workdays-label">ACTIVE DAYS:</span>
                  <div className="ts-workdays-pills">
                    {[
                      ["mon", "Mon"],
                      ["tue", "Tue"],
                      ["wed", "Wed"],
                      ["thu", "Thu"],
                      ["fri", "Fri"],
                      ["sat", "Sat"],
                      ["sun", "Sun"],
                    ].map(([key, label]) => {
                      const isActive = account.workDays.includes(key);
                      return (
                        <button
                          type="button"
                          key={key}
                          className={`ts-day-pill${isActive ? " active" : ""}`}
                          onClick={() => toggleWorkDay(key)}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="ts-form-grid" style={{ marginTop: "16px" }}>
                  <label className="ts-field">
                    <span>Daily Shift Start</span>
                    <input
                      type="time"
                      value={account.workHourStart}
                      onChange={e => updateAccount("workHourStart", e.target.value)}
                    />
                  </label>

                  <label className="ts-field">
                    <span>Daily Shift End</span>
                    <input
                      type="time"
                      value={account.workHourEnd}
                      onChange={e => updateAccount("workHourEnd", e.target.value)}
                    />
                  </label>

                  <label className="ts-field">
                    <span>Default Task Priority</span>
                    <select
                      value={account.defaultTaskPriority}
                      onChange={e => updateAccount("defaultTaskPriority", e.target.value)}
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                      <option value="Urgent">Urgent (Blocker)</option>
                    </select>
                  </label>

                  <label className="ts-field">
                    <span>Estimation Standard</span>
                    <select
                      value={account.defaultTaskEstimation}
                      onChange={e => updateAccount("defaultTaskEstimation", e.target.value)}
                    >
                      <option value="Story Points">Story Points (Fibonacci)</option>
                      <option value="Hours">Hours (Exact Duration)</option>
                      <option value="T-shirt">T-shirt Sizes (XS, S, M, L, XL)</option>
                    </select>
                  </label>
                </div>
              </section>

              {/* DATA EXPORT */}
              <section className="ts-card ts-account-export-card">
                <Download size={20} className="ts-export-icon" />
                <div className="ts-export-info">
                  <b>Export Account & Team Data</b>
                  <small>Download your personal preferences, squad metadata, and configurations as JSON.</small>
                </div>
                <button
                  type="button"
                  className="ts-btn ts-btn-secondary"
                  onClick={exportSettingsData}
                >
                  <Download size={14} /> Export JSON
                </button>
              </section>
            </>
          )}

          {/* TAB 3: APPEARANCE (THEME SYSTEM & ACCENT) */}
          {activeSection === "appearance" && (
            <>
              {/* THEME MODE OPTIONS */}
              <section className="ts-card">
                <div className="ts-card-heading"><div><h3>Appearance</h3><p>Choose how TeamFlow looks on this device.</p></div></div>
                <div className="ts-theme-options">
                  {[["light", "Light", Sun], ["dark", "Dark", Moon], ["system", "System", Monitor]].map(([id, label, Icon]) => (
                    <button type="button" key={id} className={`ts-theme-option${theme === id ? " selected" : ""}`} aria-pressed={theme === id} onClick={() => { setTheme(id); setNotice(""); }}>
                      <span className={`ts-theme-preview ${id}`}><i /><i /><i /><b /></span>
                      <span><Icon size={15} /><b>{label}</b></span>
                      <i className="ts-radio" />
                    </button>
                  ))}
                </div>
              </section>

              {/* ACCENT HIGHLIGHT */}
              <section className="ts-card">
                <div className="ts-card-heading">
                  <div>
                    <h3>Accent Highlight Color</h3>
                    <p>Choose an accent tone for badges, active states, and focal buttons.</p>
                  </div>
                </div>

                <div className="ts-accent-swatches">
                  {[
                    { name: "TeamFlow Indigo", hex: "#6366f1" },
                    { name: "Royal Blue", hex: "#2563eb" },
                    { name: "Emerald Green", hex: "#10b981" },
                    { name: "Purple", hex: "#8b5cf6" },
                    { name: "Rose", hex: "#f43f5e" },
                    { name: "Amber", hex: "#f59e0b" },
                  ].map(({ name, hex }) => (
                    <button
                      type="button"
                      key={hex}
                      className={`ts-accent-chip${accentColor === hex ? " active" : ""}`}
                      onClick={() => {
                        setAccentColor(hex);
                        showMessage(`Accent color updated to ${name}`);
                      }}
                    >
                      <span className="ts-accent-dot" style={{ background: hex }} />
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <>
              {/* SPRINT & SQUAD ACTIVITY ALERTS */}
              <section className="ts-card">
                <div className="ts-card-heading">
                  <div>
                    <h3>Sprint & Activity Alerts</h3>
                    <p>Choose what events trigger instant notifications across your squad.</p>
                  </div>
                  <span className="ts-private-label">
                    <Bell size={13} /> Real-time alerts
                  </span>
                </div>

                <div className="ts-settings-list">
                  <div className="ts-setting-row">
                    <span className="ts-setting-icon" style={{ color: "#3b82f6", background: "rgba(59, 130, 246, 0.12)" }}>
                      <CheckSquare size={18} />
                    </span>
                    <div className="ts-setting-body">
                      <b>Task Assignments & Progress</b>
                      <small>Receive updates when sprint tasks are assigned, moved across columns, or marked done.</small>
                    </div>
                    <Toggle
                      checked={notifications.taskAssignments}
                      onChange={val => updateNotification("taskAssignments", val)}
                      label="Toggle task assignments alerts"
                    />
                  </div>

                  <div className="ts-setting-row">
                    <span className="ts-setting-icon" style={{ color: "#8b5cf6", background: "rgba(139, 92, 246, 0.12)" }}>
                      <GitPullRequest size={18} />
                    </span>
                    <div className="ts-setting-body">
                      <b>Code Review & PR Requests</b>
                      <small>Instant alerts when team developers request code review or submit pull requests for your squad.</small>
                    </div>
                    <Toggle
                      checked={notifications.codeReviews}
                      onChange={val => updateNotification("codeReviews", val)}
                      label="Toggle code review alerts"
                    />
                  </div>

                  <div className="ts-setting-row">
                    <span className="ts-setting-icon" style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.12)" }}>
                      <Bug size={18} />
                    </span>
                    <div className="ts-setting-body">
                      <b>Critical Bugs & Blockers</b>
                      <small>Priority alerts whenever P0 or urgent blocker bugs are logged against current sprint goals.</small>
                    </div>
                    <Toggle
                      checked={notifications.blockerBugs}
                      onChange={val => updateNotification("blockerBugs", val)}
                      label="Toggle blocker bugs alerts"
                    />
                  </div>

                  <div className="ts-setting-row">
                    <span className="ts-setting-icon" style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.12)" }}>
                      <Clock size={18} />
                    </span>
                    <div className="ts-setting-body">
                      <b>Sprint Milestones & Deadlines</b>
                      <small>Reminders for sprint demo days, retrospectives, and impending milestone cutoffs.</small>
                    </div>
                    <Toggle
                      checked={notifications.sprintMilestones}
                      onChange={val => updateNotification("sprintMilestones", val)}
                      label="Toggle sprint milestone alerts"
                    />
                  </div>

                  <div className="ts-setting-row">
                    <span className="ts-setting-icon" style={{ color: "#ec4899", background: "rgba(236, 72, 153, 0.12)" }}>
                      <Users size={18} />
                    </span>
                    <div className="ts-setting-body">
                      <b>Mentions & Direct Messages</b>
                      <small>Notify immediately when a teammate @mentions you in task discussions or team chat.</small>
                    </div>
                    <Toggle
                      checked={notifications.teamMentions}
                      onChange={val => updateNotification("teamMentions", val)}
                      label="Toggle mentions alerts"
                    />
                  </div>

                  <div className="ts-setting-row">
                    <span className="ts-setting-icon" style={{ color: "#6366f1", background: "rgba(99, 102, 241, 0.12)" }}>
                      <Sparkles size={18} />
                    </span>
                    <div className="ts-setting-body">
                      <b>AI Workload & Capacity Insights</b>
                      <small>Intelligent notifications when developer workload is imbalanced or sprint velocity is at risk.</small>
                    </div>
                    <Toggle
                      checked={notifications.aiInsights}
                      onChange={val => updateNotification("aiInsights", val)}
                      label="Toggle AI insights alerts"
                    />
                  </div>
                </div>
              </section>

              {/* DELIVERY CHANNELS */}
              <section className="ts-card">
                <div className="ts-card-heading">
                  <div>
                    <h3>Delivery Channels</h3>
                    <p>Choose where and how you want notifications delivered.</p>
                  </div>
                </div>

                <div className="ts-delivery-grid">
                  <div className="ts-toggle-inline-card">
                    <div className="ts-sound-title">
                      <Mail size={18} className="ts-channel-icon" />
                      <div>
                        <b>Daily Email Digest</b>
                        <small>Receive a morning digest email summarizing open reviews, pending PRs, and active blockers.</small>
                      </div>
                    </div>
                    <Toggle
                      checked={notifications.emailDigest}
                      onChange={val => updateNotification("emailDigest", val)}
                      label="Toggle email digest"
                    />
                  </div>

                  <div className="ts-toggle-inline-card">
                    <div className="ts-sound-title">
                      <Radio size={18} className="ts-channel-icon" />
                      <div>
                        <b>Desktop Push Notifications</b>
                        <small>Deliver native system push notifications when browser or desktop app is minimized.</small>
                      </div>
                    </div>
                    <Toggle
                      checked={notifications.desktopPush}
                      onChange={val => {
                        if (val && typeof Notification !== "undefined" && Notification.permission !== "granted") {
                          Notification.requestPermission();
                        }
                        updateNotification("desktopPush", val);
                      }}
                      label="Toggle desktop push notifications"
                    />
                  </div>

                  <div className="ts-toggle-inline-card">
                    <div className="ts-sound-title">
                      {notifications.soundAlerts ? <Volume2 size={18} className="ts-channel-icon" /> : <VolumeX size={18} className="ts-channel-icon muted" />}
                      <div>
                        <b>Sound Alerts</b>
                        <small>Play a gentle notification chime for high-priority sprint events and mentions.</small>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button
                        type="button"
                        className="ts-btn ts-btn-secondary ts-btn-xs"
                        onClick={() => {
                          try {
                            const ctx = new (window.AudioContext || window.webkitAudioContext)();
                            const osc = ctx.createOscillator();
                            const gain = ctx.createGain();
                            osc.type = "sine";
                            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
                            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
                            gain.gain.setValueAtTime(0.15, ctx.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
                            osc.connect(gain);
                            gain.connect(ctx.destination);
                            osc.start();
                            osc.stop(ctx.currentTime + 0.25);
                          } catch {
                            // ignore
                          }
                          showMessage("Test chime played.");
                        }}
                        title="Preview chime sound"
                      >
                        Test Chime
                      </button>
                      <Toggle
                        checked={notifications.soundAlerts}
                        onChange={val => updateNotification("soundAlerts", val)}
                        label="Toggle sound alerts"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* QUIET HOURS */}
              <section className="ts-card ts-quiet-hours-card">
                <div className="ts-card-heading">
                  <div>
                    <h3>Do Not Disturb & Quiet Hours</h3>
                    <p>Mute non-urgent sound and banner notifications during designated rest hours.</p>
                  </div>
                  <span className={`ts-2fa-status-pill ${notifications.quietHours ? "active" : ""}`}>
                    {notifications.quietHours ? "● Scheduled" : "Disabled"}
                  </span>
                </div>

                <div className="ts-toggle-inline-card">
                  <div className="ts-sound-title">
                    <MoonStar size={18} className="ts-channel-icon" />
                    <div>
                      <b>Enable Quiet Hours Schedule</b>
                      <small>Pause push notifications and audio alerts outside normal working hours.</small>
                    </div>
                  </div>
                  <Toggle
                    checked={notifications.quietHours}
                    onChange={val => updateNotification("quietHours", val)}
                    label="Toggle quiet hours schedule"
                  />
                </div>

                {notifications.quietHours && (
                  <div className="ts-form-grid" style={{ marginTop: "14px" }}>
                    <label className="ts-field">
                      <span>Mute From (Quiet Start)</span>
                      <input
                        type="time"
                        value={notifications.quietStart}
                        onChange={e => updateNotification("quietStart", e.target.value)}
                      />
                    </label>
                    <label className="ts-field">
                      <span>Resume At (Quiet End)</span>
                      <input
                        type="time"
                        value={notifications.quietEnd}
                        onChange={e => updateNotification("quietEnd", e.target.value)}
                      />
                    </label>
                  </div>
                )}
              </section>
            </>
          )}

          {/* TAB 4: SECURITY */}
          {activeSection === "security" && (
            <>
              <section className="ts-card">
                <div className="ts-card-heading">
                  <div>
                    <h3>Change Password</h3>
                    <p>Ensure your account uses a secure password combining letters, digits, and symbols.</p>
                  </div>
                  <span className="ts-security-badge">
                    <LockKeyhole size={13} /> Secure Account
                  </span>
                </div>

                <div className="ts-form-grid ts-security-fields">
                  <label className="ts-field full">
                    <span>Current Password</span>
                    <span className="ts-password-input">
                      <KeyRound size={15} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwords.current}
                        onChange={e => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                        placeholder="Enter current password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </span>
                  </label>

                  <label className="ts-field">
                    <span>New Password</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwords.next}
                      onChange={e => setPasswords(prev => ({ ...prev, next: e.target.value }))}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                    />
                  </label>

                  <label className="ts-field">
                    <span>Confirm New Password</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={e => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                      placeholder="Re-enter new password"
                      autoComplete="new-password"
                    />
                  </label>
                </div>

                <div className="ts-password-hint">
                  <ShieldCheck size={16} />
                  <span>Password should contain at least 8 characters with a mix of uppercase, numbers, and special symbols.</span>
                </div>
              </section>

              {/* TWO FACTOR AUTHENTICATION */}
              <section className="ts-card">
                <div className="ts-card-heading">
                  <div>
                    <h3>Two-Factor Authentication (2FA)</h3>
                    <p>Add an extra layer of defense requiring a verification code when signing in.</p>
                  </div>
                  <span className={`ts-2fa-status-pill ${twoFactorEnabled ? "active" : ""}`}>
                    {twoFactorEnabled ? "● Enabled" : "Disabled"}
                  </span>
                </div>

                <div className="ts-toggle-inline-card">
                  <div>
                    <b>Require Authenticator Code (TOTP)</b>
                    <small>Prompt for a 6-digit code generated by Google Authenticator or 1Password.</small>
                  </div>
                  <Toggle
                    checked={twoFactorEnabled}
                    onChange={val => {
                      setTwoFactorEnabled(val);
                      showMessage(`Two-factor authentication ${val ? "enabled" : "disabled"}.`);
                    }}
                    label="Toggle two-factor authentication"
                  />
                </div>
              </section>

              {/* ACTIVE SESSIONS */}
              <section className="ts-card ts-session-card">
                <div className="ts-card-heading">
                  <div>
                    <h3>Active Devices & Sessions</h3>
                    <p>Devices and browsers currently logged into your Team Lead workspace.</p>
                  </div>
                </div>

                <div className="ts-session-list">
                  <div className="ts-session-row">
                    <span className="ts-session-icon">
                      <Laptop size={18} />
                    </span>
                    <div className="ts-session-info">
                      <b>Windows PC · Current Device</b>
                      <small>Last active now · Chrome on Windows · This browser session</small>
                    </div>
                    <span className="ts-session-active-pill">● Active Now</span>
                  </div>

                  {mobileSessionActive && (
                    <div className="ts-session-row">
                      <span className="ts-session-icon mobile">
                        <Smartphone size={18} />
                      </span>
                      <div className="ts-session-info">
                        <b>iPhone 15 Pro · Mobile App</b>
                        <small>Last active 2 days ago · Safari iOS · Mumbai, India</small>
                      </div>
                      <button
                        type="button"
                        className="ts-btn ts-btn-ghost-danger"
                        onClick={() => {
                          const confirmed = window.confirm("Sign out the mobile device session on this account?");
                          if (!confirmed) return;
                          setMobileSessionActive(false);
                          showMessage("Mobile session signed out successfully.");
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {/* TAB 5: TEAM SETTINGS (SQUAD DEFAULTS & QUALITY GATES) */}
          {activeSection === "team" && (
            <>
              {/* SQUAD IDENTITY */}
              <section className="ts-card">
                <div className="ts-card-heading">
                  <div>
                    <h3>Squad Identity & Department</h3>
                    <p>Configure team branding, squad key identifiers, and organizational alignment.</p>
                  </div>
                  <span className="ts-private-label">
                    <Building2 size={13} /> {team.department}
                  </span>
                </div>

                <div className="ts-form-grid">
                  <label className="ts-field">
                    <span>Squad / Team Name</span>
                    <input
                      type="text"
                      value={team.squadName}
                      onChange={e => updateTeam("squadName", e.target.value)}
                    />
                  </label>

                  <label className="ts-field">
                    <span>Squad Key (Prefix)</span>
                    <input
                      type="text"
                      value={team.squadKey}
                      onChange={e => updateTeam("squadKey", e.target.value.toUpperCase())}
                      placeholder="e.g. ALPHA"
                    />
                  </label>

                  <label className="ts-field">
                    <span>Assigned Team Lead</span>
                    <input
                      type="text"
                      value={team.leadName}
                      disabled
                      style={{ opacity: 0.8 }}
                    />
                  </label>

                  <label className="ts-field">
                    <span>Department / Track</span>
                    <input
                      type="text"
                      value={team.department}
                      onChange={e => updateTeam("department", e.target.value)}
                    />
                  </label>
                </div>
              </section>

              {/* SPRINT EXECUTION DEFAULTS */}
              <section className="ts-card">
                <div className="ts-card-heading">
                  <div>
                    <h3>Sprint Cadence & Velocity Goals</h3>
                    <p>Define standard sprint lengths, capacity targets, and estimation rules.</p>
                  </div>
                </div>

                <div className="ts-form-grid">
                  <label className="ts-field">
                    <span>Default Sprint Cadence</span>
                    <select
                      value={team.sprintDuration}
                      onChange={e => updateTeam("sprintDuration", e.target.value)}
                    >
                      <option value="1 Week">1 Week Sprint (Fast Iteration)</option>
                      <option value="2 Weeks">2 Weeks Sprint (Standard Scrum)</option>
                      <option value="3 Weeks">3 Weeks Sprint</option>
                      <option value="4 Weeks">4 Weeks Sprint (Monthly Milestones)</option>
                    </select>
                  </label>

                  <label className="ts-field">
                    <span>Target Sprint Velocity (Story Points)</span>
                    <input
                      type="number"
                      min={10}
                      max={200}
                      value={team.velocityTarget}
                      onChange={e => updateTeam("velocityTarget", Number(e.target.value))}
                    />
                  </label>

                  <label className="ts-field full">
                    <span>Estimation Standard</span>
                    <select
                      value={team.estimationUnit}
                      onChange={e => updateTeam("estimationUnit", e.target.value)}
                    >
                      <option value="Story Points (Fibonacci)">Story Points (Fibonacci sequence: 1, 2, 3, 5, 8, 13)</option>
                      <option value="Hours (Exact Duration)">Hours (Time-based work logs)</option>
                      <option value="T-Shirt Sizes">T-Shirt Sizes (XS, S, M, L, XL)</option>
                    </select>
                  </label>
                </div>

                <div className="ts-toggle-inline-card" style={{ marginTop: "16px" }}>
                  <div>
                    <b>Auto-Rollover Unfinished Tasks</b>
                    <small>When a sprint is marked completed, automatically move open in-progress tasks to the backlog or next sprint.</small>
                  </div>
                  <Toggle
                    checked={team.autoRollover}
                    onChange={val => updateTeam("autoRollover", val)}
                    label="Auto rollover unfinished tasks"
                  />
                </div>
              </section>

              {/* CODE REVIEW & WORKFLOW RULES */}
              <section className="ts-card">
                <div className="ts-card-heading">
                  <div>
                    <h3>Quality Gates & Automation</h3>
                    <p>Automate triage and quality compliance rules for sprint deliverables.</p>
                  </div>
                </div>

                <div className="ts-settings-list">
                  <div className="ts-setting-row">
                    <span className="ts-setting-icon" style={{ color: "#3b82f6", background: "rgba(59, 130, 246, 0.12)" }}>
                      <CheckSquare size={18} />
                    </span>
                    <div className="ts-setting-body">
                      <b>Require Code Review Approval Before Merge</b>
                      <small>Mandate at least 1 peer approval or team lead sign-off before closing feature tasks.</small>
                    </div>
                    <Toggle
                      checked={team.requireApproval}
                      onChange={val => updateTeam("requireApproval", val)}
                      label="Require code review approval"
                    />
                  </div>

                  <div className="ts-setting-row">
                    <span className="ts-setting-icon" style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.12)" }}>
                      <Bug size={18} />
                    </span>
                    <div className="ts-setting-body">
                      <b>Auto-Assign Blocker Bugs to Team Lead</b>
                      <small>Critical priority bugs immediately alert and allocate the team lead for rapid triage.</small>
                    </div>
                    <Toggle
                      checked={team.autoAssignBlockers}
                      onChange={val => updateTeam("autoAssignBlockers", val)}
                      label="Auto assign blocker bugs"
                    />
                  </div>

                  <div className="ts-setting-row">
                    <span className="ts-setting-icon" style={{ color: "#8b5cf6", background: "rgba(139, 92, 246, 0.12)" }}>
                      <Sparkles size={18} />
                    </span>
                    <div className="ts-setting-body">
                      <b>Automated AI Workload Rebalancing Tips</b>
                      <small>Allow TeamFlow AI to suggest reassignments when developers exceed healthy capacity limits.</small>
                    </div>
                    <Toggle
                      checked={team.aiWorkloadAdvice}
                      onChange={val => updateTeam("aiWorkloadAdvice", val)}
                      label="Automated AI workload rebalancing tips"
                    />
                  </div>
                </div>
              </section>
            </>
          )}

          {/* 4. BOTTOM SAVE BAR */}
          <footer className="ts-save-bar">
            <div className="ts-save-notice">
              {notice && (
                <span className={`ts-notice-pill ${noticeType}`} role="status">
                  {noticeType === "error" ? <CircleHelp size={15} /> : <Check size={15} />}
                  <span>{notice}</span>
                </span>
              )}
            </div>
            <div className="ts-save-actions">
              <button
                type="button"
                className="ts-btn ts-btn-secondary"
                onClick={resetCurrentSection}
              >
                Reset
              </button>
              <button type="submit" className="ts-btn ts-btn-primary">
                <Save size={15} /> Save Changes
              </button>
            </div>
          </footer>
        </form>
      </div>
    </section>
  );
}
