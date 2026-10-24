import { useRef, useState, useSyncExternalStore } from "react";
import {
  Bell,
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
} from "lucide-react";
import "./Setting.css";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: ShieldCheck },
];

const INITIAL_NOTIFICATIONS = {
  email: true,
  mentions: true,
  taskUpdates: true,
  projectDigest: false,
  productNews: false,
  quietHours: true,
};

const SETTINGS_STORAGE_KEY = "teamflow_teamlead_settings";
const DEFAULT_PROFILE = {
  name: "Priya Sharma",
  email: "priya.sharma@teamflow.ai",
  role: "Team Lead",
  timezone: "Asia/Kolkata",
  bio: "Helping our product team plan, collaborate, and deliver great work.",
  photo: "",
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
    console.error("Failed to read the current account for Settings:", error);
    return null;
  }
}

function getInitialSettings() {
  const saved = readStoredSettings();
  const user = readCurrentUser();
  return {
    profile: {
      ...DEFAULT_PROFILE,
      name: user?.name || DEFAULT_PROFILE.name,
      email: user?.email || DEFAULT_PROFILE.email,
      ...saved.profile,
    },
    notifications: { ...INITIAL_NOTIFICATIONS, ...saved.notifications },
    theme: ["light", "dark", "system"].includes(saved.theme) ? saved.theme : "light",
    density: ["Comfortable", "Compact"].includes(saved.density) ? saved.density : "Comfortable",
    mobileSessionActive: saved.mobileSessionActive !== false,
  };
}

function getInitials(name = "") {
  return name.trim().split(/\s+/).map(part => part[0] || "").slice(0, 2).join("").toUpperCase();
}

function subscribeToColorScheme(onChange) {
  if (!window.matchMedia) return () => {};
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
  const [initialSettings] = useState(getInitialSettings);
  const [profile, setProfile] = useState(initialSettings.profile);
  const [notifications, setNotifications] = useState(initialSettings.notifications);
  const [theme, setTheme] = useState(initialSettings.theme);
  const systemIsDark = useSyncExternalStore(subscribeToColorScheme, getSystemColorScheme, () => false);
  const [density, setDensity] = useState(initialSettings.density);
  const [mobileSessionActive, setMobileSessionActive] = useState(initialSettings.mobileSessionActive);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [photoError, setPhotoError] = useState("");
  const photoInput = useRef(null);

  function updateProfile(field, value) {
    setProfile(previous => ({ ...previous, [field]: value }));
    setNotice("");
    setNoticeType("success");
  }

  function updateNotification(field, value) {
    setNotifications(previous => ({ ...previous, [field]: value }));
    setNotice("");
    setNoticeType("success");
  }

  function saveSettings(event) {
    event.preventDefault();

    if (activeSection === "security") {
      updatePassword();
      return;
    }

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
        const conflict = users.some(account => (
          account.email?.toLowerCase() === cleanEmail
          && account.email?.toLowerCase() !== originalEmail
          && account.id !== user?.id
        ));
        if (conflict) {
          showMessage("That email address is already used by another account.", "error");
          return;
        }

        const savedProfile = { ...profile, name: cleanName, email: cleanEmail };
        const updatedSettings = {
          ...readStoredSettings(),
          profile: savedProfile,
          notifications,
          theme,
          density,
          mobileSessionActive,
        };
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));

        if (user) {
          const updatedUser = { ...user, name: cleanName, email: cleanEmail };
          localStorage.setItem("teamflow_current_user", JSON.stringify(updatedUser));
        }
        const accountIndex = users.findIndex(account => (
          (user?.id && account.id === user.id)
          || account.email?.toLowerCase() === (user?.email?.toLowerCase() || originalEmail)
        ));
        if (accountIndex >= 0) {
          users[accountIndex] = { ...users[accountIndex], name: cleanName, email: cleanEmail };
          localStorage.setItem("teamflow_users", JSON.stringify(users));
        }
        setProfile(savedProfile);
        showMessage("Profile and preferences saved on this device.");
      } catch (error) {
        console.error("Failed to save Team Lead profile settings:", error);
        showMessage("Could not save your settings. Check browser storage and try again.", "error");
      }
      return;
    }

    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
        ...readStoredSettings(),
        profile,
        notifications,
        theme,
        density,
        mobileSessionActive,
      }));
      showMessage("Preferences saved on this device.");
    } catch (error) {
      console.error("Failed to save Team Lead preferences:", error);
      showMessage("Could not save your preferences. Check browser storage and try again.", "error");
    }
  }

  function showMessage(message, type = "success") {
    setNotice(message);
    setNoticeType(type);
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
        ? users.findIndex(account => account.id === user?.id || account.email?.toLowerCase() === profile.email.toLowerCase())
        : -1;
      if (accountIndex < 0) {
        showMessage("No registered account was found. Sign in with a registered account to change its password.", "error");
        return;
      }
      if (users[accountIndex].password !== current) {
        showMessage("The current password is incorrect.", "error");
        return;
      }

      const updatedUsers = users.map((account, index) => (
        index === accountIndex ? { ...account, password: next } : account
      ));
      localStorage.setItem("teamflow_users", JSON.stringify(updatedUsers));
      const updatedUser = { ...users[accountIndex], password: next };
      localStorage.setItem("teamflow_current_user", JSON.stringify(updatedUser));
      setPasswords({ current: "", next: "", confirm: "" });
      showMessage("Password changed for this account.");
    } catch (error) {
      console.error("Failed to change the account password:", error);
      showMessage("Could not update the password. Check browser storage and try again.", "error");
    }
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Choose an image file.");
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
      setProfile(previous => ({ ...previous, photo: String(reader.result) }));
      setPhotoError("");
      setNotice("Photo selected. Save changes to keep it on this device.");
    };
    reader.onerror = () => {
      console.error("Failed to read the selected profile photo.");
      setPhotoError("Could not load this image. Please choose another file.");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  const activeItem = SECTIONS.find(section => section.id === activeSection);

  return (
    <section
      className="ts-page"
      aria-label="Team lead settings"
      data-theme={theme === "system" ? (systemIsDark ? "dark" : "light") : theme}
      data-theme-choice={theme}
      data-density={density.toLowerCase()}
    >
      <header className="ts-page-header">
        <div>
          <span className="ts-eyebrow">WORKSPACE PREFERENCES</span>
          <h1>Settings</h1>
          <p>Make TeamFlow work the way you do.</p>
        </div>
        <div className="ts-header-badge"><SlidersHorizontal size={16} /> Personal settings</div>
      </header>

      <div className="ts-layout">
        <nav className="ts-nav" aria-label="Settings sections">
          <span className="ts-nav-label">PREFERENCES</span>
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              className={`ts-nav-item${activeSection === id ? " active" : ""}`}
              aria-current={activeSection === id ? "page" : undefined}
              onClick={() => { setActiveSection(id); setNotice(""); }}
            >
              <Icon size={17} />
              <span>{label}</span>
              <ChevronRight size={15} className="ts-nav-chevron" />
            </button>
          ))}
          <div className="ts-nav-help">
            <span><CircleHelp size={17} /></span>
            <b>Saved on this device</b>
            <small>Profile details and preferences are stored in this browser.</small>
          </div>
        </nav>

        <form className="ts-content" onSubmit={saveSettings}>
          <div className="ts-content-heading">
            <span className={`ts-section-icon ${activeSection}`}><activeItem.icon size={18} /></span>
            <div><h2>{activeItem.label}</h2><p>
              {activeSection === "profile" && "Manage your personal information and how teammates see you."}
              {activeSection === "notifications" && "Choose what updates you receive and where they appear."}
              {activeSection === "appearance" && "Tune the workspace look and feel to your preference."}
              {activeSection === "security" && "Manage your password and keep your account protected."}
            </p></div>
          </div>

          {activeSection === "profile" && (
            <>
              <section className="ts-card ts-profile-card">
                <div className="ts-card-heading"><div><h3>Profile information</h3><p>Your details are visible to teammates in the workspace.</p></div><span className="ts-private-label"><Users size={13} /> Team profile</span></div>
                <div className="ts-profile-photo-row">
                  <span className="ts-profile-avatar">{profile.photo ? <img src={profile.photo} alt="" /> : getInitials(profile.name)}<i /></span>
                  <div><b>Profile photo</b><small>Choose an image up to 1 MB. Save to keep it on this device.</small></div>
                  <input ref={photoInput} className="ts-photo-input" type="file" accept="image/*" aria-label="Choose profile photo" onChange={handlePhotoChange} />
                  <button type="button" className="ts-secondary-button" onClick={() => photoInput.current?.click()}>Change photo</button>
                </div>
                {photoError && <p className="ts-inline-error" role="alert">{photoError}</p>}
                <div className="ts-form-grid">
                  <label className="ts-field"><span>Full name</span><input value={profile.name} onChange={event => updateProfile("name", event.target.value)} autoComplete="name" /></label>
                  <label className="ts-field"><span>Work email</span><span className="ts-input-icon"><Mail size={15} /><input type="email" value={profile.email} onChange={event => updateProfile("email", event.target.value)} autoComplete="email" /></span></label>
                  <label className="ts-field"><span>Role</span><input value={profile.role} onChange={event => updateProfile("role", event.target.value)} /></label>
                  <label className="ts-field"><span>Time zone</span><span className="ts-input-icon"><Globe2 size={15} /><select value={profile.timezone} onChange={event => updateProfile("timezone", event.target.value)}><option value="Asia/Kolkata">India Standard Time (UTC+05:30)</option><option value="America/Los_Angeles">Pacific Time (UTC-08:00)</option><option value="America/New_York">Eastern Time (UTC-05:00)</option><option value="Europe/London">Greenwich Mean Time (UTC+00:00)</option></select></span></label>
                  <label className="ts-field full"><span>About</span><textarea rows={3} maxLength={180} value={profile.bio} onChange={event => updateProfile("bio", event.target.value)} /><small>{profile.bio.length}/180 characters</small></label>
                </div>
              </section>
              <section className="ts-card ts-preference-summary">
                <span className="ts-summary-icon"><Users size={17} /></span>
                <div><b>Part of Product Team</b><small>Your workspace role is managed by your team administrator.</small></div>
                <span className="ts-role-pill">Team Lead</span>
              </section>
            </>
          )}

          {activeSection === "notifications" && (
            <section className="ts-card">
              <div className="ts-card-heading"><div><h3>Notification preferences</h3><p>Stay in the loop without the noise.</p></div></div>
              <div className="ts-settings-list">
                {[
                  ["email", "Email notifications", "Receive important workspace updates in your inbox.", Mail],
                  ["mentions", "Mentions and direct messages", "Get notified when someone mentions or messages you.", Users],
                  ["taskUpdates", "Task and project updates", "Updates to tasks you own or follow.", Check],
                  ["projectDigest", "Weekly project digest", "A Monday summary of project progress and milestones.", Bell],
                  ["productNews", "Product tips and announcements", "Occasional news about TeamFlow features.", CircleHelp],
                ].map(([key, title, description, Icon]) => (
                  <div className="ts-setting-row" key={key}>
                    <span className="ts-setting-icon"><Icon size={16} /></span>
                    <div><b>{title}</b><small>{description}</small></div>
                    <Toggle checked={notifications[key]} onChange={value => updateNotification(key, value)} label={title} />
                  </div>
                ))}
              </div>
              <div className="ts-delivery-note"><Bell size={15} /><span><b>Quiet hours</b><small>Pause notification alerts between 10:00 PM and 8:00 AM.</small></span><Toggle checked={notifications.quietHours} onChange={value => updateNotification("quietHours", value)} label="Quiet hours" /></div>
            </section>
          )}

          {activeSection === "appearance" && (
            <>
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
              <section className="ts-card">
                <div className="ts-card-heading"><div><h3>Display density</h3><p>Control the spacing of lists and workspace content.</p></div></div>
                <div className="ts-density-options">
                  {["Comfortable", "Compact"].map(option => <button type="button" key={option} className={density === option ? "selected" : ""} aria-pressed={density === option} onClick={() => { setDensity(option); setNotice(""); }}><span className={`ts-density-preview ${option.toLowerCase()}`}><i /><i /><i /></span><span><b>{option}</b><small>{option === "Comfortable" ? "More breathing room" : "See more at a glance"}</small></span><i className="ts-radio" /></button>)}
                </div>
              </section>
              <section className="ts-card ts-device-note"><Laptop size={18} /><div><b>Settings preview</b><small>Theme and density choices preview on this page and are saved for this browser.</small></div></section>
            </>
          )}

          {activeSection === "security" && (
            <>
              <section className="ts-card">
                <div className="ts-card-heading"><div><h3>Change password</h3><p>Choose a strong password you do not use elsewhere.</p></div><span className="ts-security-badge"><LockKeyhole size={13} /> Secure account</span></div>
                <div className="ts-form-grid ts-security-fields">
                  <label className="ts-field full"><span>Current password</span><span className="ts-password-input"><KeyRound size={15} /><input type={showPassword ? "text" : "password"} value={passwords.current} onChange={event => setPasswords(previous => ({ ...previous, current: event.target.value }))} placeholder="Enter current password" autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button></span></label>
                  <label className="ts-field"><span>New password</span><input type={showPassword ? "text" : "password"} value={passwords.next} onChange={event => setPasswords(previous => ({ ...previous, next: event.target.value }))} placeholder="At least 8 characters" autoComplete="new-password" /></label>
                  <label className="ts-field"><span>Confirm new password</span><input type={showPassword ? "text" : "password"} value={passwords.confirm} onChange={event => setPasswords(previous => ({ ...previous, confirm: event.target.value }))} placeholder="Re-enter new password" autoComplete="new-password" /></label>
                </div>
                <div className="ts-password-hint"><ShieldCheck size={15} /><span>Use at least 8 characters and combine letters, numbers, and symbols.</span></div>
              </section>
              <section className="ts-card ts-session-card">
                <div className="ts-card-heading"><div><h3>Active sessions</h3><p>Devices currently signed in to your account.</p></div></div>
                <div className="ts-session-row"><span className="ts-session-icon"><Laptop size={18} /></span><div><b>Windows · Current device</b><small>Last active now · This browser</small></div><span className="ts-current-session">This device</span></div>
                {mobileSessionActive && <div className="ts-session-row"><span className="ts-session-icon mobile"><Smartphone size={18} /></span><div><b>Mobile device</b><small>Sample session · Last active 2 days ago</small></div><button type="button" className="ts-text-button" onClick={() => {
                  const confirmed = window.confirm("Sign out the sample mobile session on this device?");
                  if (!confirmed) return;
                  setMobileSessionActive(false);
                  try {
                    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
                      ...readStoredSettings(), profile, notifications, theme, density, mobileSessionActive: false,
                    }));
                    showMessage("The sample mobile session was signed out.");
                  } catch (error) {
                    console.error("Failed to update the sample session state:", error);
                    showMessage("Could not update the session state in browser storage.", "error");
                  }
                }}>Sign out</button></div>}
              </section>
            </>
          )}

          <footer className="ts-save-bar">
            <span className={noticeType === "error" ? "error" : ""} role={noticeType === "error" ? "alert" : "status"}>{notice && <>{noticeType === "error" ? <CircleHelp size={14} /> : <Check size={14} />}{notice}</>}</span>
            <button type="submit" className="ts-save-button"><Save size={15} /> Save changes</button>
          </footer>
        </form>
      </div>
    </section>
  );
}
