import React, { useState, useEffect, useRef } from "react";
import {
  Settings as SettingsIcon,
  User,
  Edit3,
  Camera,
  Shield,
  Key,
  Smartphone,
  ShieldCheck,
  Laptop,
  Palette,
  Sun,
  Moon,
  Monitor,
  Bell,
  FileText,
  Folder,
  Bug,
  Calendar,
  MessageSquare,
  Megaphone,
  Globe,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Eye,
  EyeOff,
  Copy,
  AlertCircle,
  LogOut,
} from "lucide-react";

import EmployeeShell from "./EmployeeShell";
import { getEmployeeTheme, setEmployeeTheme } from "./EmployeeAuth";
import "./Settings.css";

/* Storage Keys */
const STORAGE_PROFILE = "tf_settings_profile_v2";
const STORAGE_NOTIF = "tf_settings_notifications_v2";
const STORAGE_LOCALIZATION = "tf_settings_localization_v2";
const STORAGE_APPEARANCE = "tf_settings_appearance_v2";

/* Preset Avatars */
const defaultAvatar =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop";

const presetAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
];

/* Primary Color Swatches */
const colorSwatches = [
  { id: "purple", color: "#6366F1", label: "Indigo / Purple" },
  { id: "blue", color: "#3B82F6", label: "Blue" },
  { id: "green", color: "#10B981", label: "Emerald Green" },
  { id: "orange", color: "#F59E0B", label: "Amber / Orange" },
  { id: "red", color: "#EF4444", label: "Coral Red" },
  { id: "pink", color: "#EC4899", label: "Pink" },
];

function Settings() {
  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const toastTimeoutRef = useRef(null);

  const showToast = (msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  // 1. Profile State
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (err) {
      void err;
    }
    return {
      fullName: "John Doe",
      email: "john.doe@teamflow.com",
      phoneNumber: "+91 98765 43210",
      role: "Employee",
      department: "Development",
      location: "Pune, India",
      avatar: defaultAvatar,
      status: "Active",
      memberSince: "Oct 10, 2024",
    };
  });

  // Sync profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
      // Also sync with general app user profile
      const generalProfile = {
        name: profile.fullName,
        email: profile.email,
        role: profile.role,
        photo: profile.avatar,
      };
      localStorage.setItem("teamflow_current_user", JSON.stringify(generalProfile));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      void err;
    }
  }, [profile]);

  // 2. Appearance & Display State
  const [appearance, setAppearance] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_APPEARANCE);
      if (saved) return JSON.parse(saved);
    } catch (err) {
      void err;
    }
    return {
      theme: getEmployeeTheme() || "light",
      primaryColor: "#6366F1",
      fontSize: "Medium",
    };
  });

  // Sync font size to document root
  useEffect(() => {
    if (appearance.fontSize === "Small") {
      document.documentElement.style.fontSize = "13.5px";
    } else if (appearance.fontSize === "Large") {
      document.documentElement.style.fontSize = "16px";
    } else {
      document.documentElement.style.fontSize = "14px";
    }
  }, [appearance.fontSize]);

  // Sync primary color to document root
  useEffect(() => {
    if (appearance.primaryColor) {
      document.documentElement.style.setProperty("--tf-primary", appearance.primaryColor);
    }
  }, [appearance.primaryColor]);

  const handleThemeChange = (newTheme) => {
    const nextAppearance = { ...appearance, theme: newTheme };
    setAppearance(nextAppearance);
    try {
      localStorage.setItem(STORAGE_APPEARANCE, JSON.stringify(nextAppearance));
    } catch (err) {
      void err;
    }

    if (newTheme === "system") {
      const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setEmployeeTheme(sysDark ? "dark" : "light");
      showToast("Theme set to System default");
    } else {
      setEmployeeTheme(newTheme);
      showToast(`Switched to ${newTheme === "dark" ? "Dark" : "Light"} mode`);
    }
  };

  const handleColorChange = (hex) => {
    const nextAppearance = { ...appearance, primaryColor: hex };
    setAppearance(nextAppearance);
    try {
      localStorage.setItem(STORAGE_APPEARANCE, JSON.stringify(nextAppearance));
    } catch (err) {
      void err;
    }
    showToast("Primary color accent updated");
  };

  const handleFontSizeChange = (size) => {
    const nextAppearance = { ...appearance, fontSize: size };
    setAppearance(nextAppearance);
    try {
      localStorage.setItem(STORAGE_APPEARANCE, JSON.stringify(nextAppearance));
    } catch (err) {
      void err;
    }
    showToast(`Font size set to ${size}`);
  };

  // 3. Notifications State
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTIF);
      if (saved) return JSON.parse(saved);
    } catch (err) {
      void err;
    }
    return {
      taskUpdates: true,
      projectUpdates: true,
      bugUpdates: true,
      meetingReminders: true,
      chatMessages: true,
      systemAnnouncements: false,
    };
  });

  const handleToggleNotification = (key) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(STORAGE_NOTIF, JSON.stringify(updated));
      } catch (err) {
        void err;
      }
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      showToast(`${label} ${updated[key] ? "enabled" : "disabled"}`);
      return updated;
    });
  };

  // 4. Language, Time & Date State
  const [localization, setLocalization] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOCALIZATION);
      if (saved) return JSON.parse(saved);
    } catch (err) {
      void err;
    }
    return {
      language: "English",
      timeZone: "(GMT+05:30) India Standard Time",
      dateFormat: "DD MMM YYYY (26 Oct 2024)",
      timeFormat: "12 Hour (10:30 AM)",
    };
  });

  const handleLocalizationChange = (field, value) => {
    setLocalization((prev) => {
      const updated = { ...prev, [field]: value };
      try {
        localStorage.setItem(STORAGE_LOCALIZATION, JSON.stringify(updated));
      } catch (err) {
        void err;
      }
      showToast(`${field.replace(/([A-Z])/g, " $1")} updated`);
      return updated;
    });
  };

  // 5. Security & 2FA State
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    {
      id: "sess-1",
      device: "Chrome on Windows 11",
      location: "Pune, India",
      ip: "103.21.124.90",
      current: true,
      time: "Active now",
    },
    {
      id: "sess-2",
      device: "Safari on iPhone 15 Pro",
      location: "Pune, India",
      ip: "103.21.124.91",
      current: false,
      time: "2 hours ago",
    },
    {
      id: "sess-3",
      device: "Firefox on macOS Sonoma",
      location: "Pune, India",
      ip: "103.21.124.92",
      current: false,
      time: "3 days ago",
    },
  ]);

  const [connectedDevices, setConnectedDevices] = useState([
    {
      id: "dev-1",
      name: "Lenovo ThinkPad X1 Carbon",
      os: "Windows 11 Pro",
      authorized: "Oct 10, 2024",
    },
    {
      id: "dev-2",
      name: "Apple iPhone 15 Pro",
      os: "iOS 18.1",
      authorized: "Oct 12, 2024",
    },
    {
      id: "dev-3",
      name: "Apple MacBook Pro 16",
      os: "macOS Sonoma 14.5",
      authorized: "Oct 20, 2024",
    },
  ]);

  // Modals state
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [activeSessionsModalOpen, setActiveSessionsModalOpen] = useState(false);
  const [connectedDevicesModalOpen, setConnectedDevicesModalOpen] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);

  // Edit Profile Form State in Modal
  const [editForm, setEditForm] = useState({ ...profile });
  const fileInputRef = useRef(null);

  // Change Password Form State in Modal
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 2FA modal verification code state
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [secretCopied, setSecretCopied] = useState(false);

  // Handlers
  const handleOpenEditProfile = () => {
    setEditForm({ ...profile });
    setEditProfileModalOpen(true);
  };

  const handleSaveEditProfile = (e) => {
    e.preventDefault();
    setProfile({ ...editForm });
    setEditProfileModalOpen(false);
    showToast("Profile details updated successfully!");
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result }));
        setEditForm((prev) => ({ ...prev, avatar: reader.result }));
        showToast("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      showToast("Please enter your current password");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("New passwords do not match!");
      return;
    }
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setChangePasswordModalOpen(false);
    showToast("Password updated successfully!");
  };

  const handleTerminateOtherSessions = () => {
    setActiveSessions((prev) => prev.filter((s) => s.current));
    showToast("Terminated other active sessions");
  };

  const handleTerminateSession = (id) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== id));
    showToast("Session signed out");
  };

  const handleRevokeDevice = (id) => {
    setConnectedDevices((prev) => prev.filter((d) => d.id !== id));
    showToast("Device access revoked");
  };

  const handleToggle2FA = () => {
    if (!twoFactorAuth) {
      setTwoFactorModalOpen(true);
    } else {
      setTwoFactorAuth(false);
      showToast("Two-Factor Authentication disabled");
    }
  };

  const handleVerify2FA = (e) => {
    e.preventDefault();
    if (twoFactorCode.length < 6) {
      showToast("Please enter a valid 6-digit code");
      return;
    }
    setTwoFactorAuth(true);
    setTwoFactorModalOpen(false);
    setTwoFactorCode("");
    showToast("Two-Factor Authentication enabled successfully!");
  };

  const copySecretKey = () => {
    navigator.clipboard?.writeText("TF-8942-XN92-KL49-9821");
    setSecretCopied(true);
    showToast("Secret key copied to clipboard");
    setTimeout(() => setSecretCopied(false), 2000);
  };

  // Direct Inline Form Changes (Personal Information Card)
  const handleInputChange = (field, val) => {
    setProfile((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <EmployeeShell
      activeRoute="/employee/settings"
      noScroll
      searchPlaceholder="Search tasks, projects, files, meetings or people..."
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="tf-settings-toast" role="alert">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      <div className="tf-settings-page">
        {/* =================================================================
            1. PAGE HEADER
            ================================================================= */}
        <header className="tf-settings-header">
          <div className="tf-settings-header-left">
            <div className="tf-settings-header-icon-box">
              <SettingsIcon size={26} className="tf-settings-gear-icon" />
            </div>
            <div>
              <h1 className="tf-settings-title">Settings</h1>
              <p className="tf-settings-subtitle">
                Manage your account, preferences and application settings.
              </p>
            </div>
          </div>
        </header>

        {/* =================================================================
            2. HERO / PROFILE BANNER CARD
            ================================================================= */}
        <section className="tf-settings-hero-card">
          {/* Subtle SVG Decorative Wave Background */}
          <div className="tf-hero-wave-bg" aria-hidden="true">
            <svg
              viewBox="0 0 1200 180"
              preserveAspectRatio="none"
              className="tf-wave-svg"
            >
              <path
                d="M0,60 C320,130 420,-10 680,60 C900,120 1050,40 1200,80 L1200,180 L0,180 Z"
                fill="rgba(199, 210, 254, 0.45)"
              />
              <path
                d="M0,100 C300,160 500,40 760,110 C960,160 1100,80 1200,120 L1200,180 L0,180 Z"
                fill="rgba(224, 231, 255, 0.55)"
              />
            </svg>
          </div>

          <div className="tf-hero-content">
            {/* Left: Avatar with Camera button */}
            <div className="tf-hero-avatar-wrap">
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="tf-hero-avatar-img"
              />
              <button
                type="button"
                className="tf-hero-camera-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Change Profile Photo"
                aria-label="Change Profile Photo"
              >
                <Camera size={13} />
              </button>
            </div>

            {/* Middle: Profile Info */}
            <div className="tf-hero-details">
              <h2 className="tf-hero-name">{profile.fullName}</h2>
              <div className="tf-hero-subline">
                <span>{profile.role}</span>
                <span className="tf-hero-dot">•</span>
                <span>Development Team</span>
              </div>
              <div className="tf-hero-meta-row">
                <span className="tf-hero-status-pill">
                  <span className="tf-status-dot green" />
                  {profile.status}
                </span>
                <span className="tf-hero-pipe">|</span>
                <span className="tf-hero-since-text">
                  Member since {profile.memberSince}
                </span>
              </div>
            </div>

            {/* Right: Edit Profile Button */}
            <div className="tf-hero-actions">
              <button
                type="button"
                className="tf-hero-edit-profile-btn"
                onClick={handleOpenEditProfile}
              >
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </section>

        {/* =================================================================
            3. MIDDLE SECTION: 2-COLUMN GRID
            ================================================================= */}
        <div className="tf-settings-main-grid">
          {/* ================= LEFT COLUMN ================= */}
          <div className="tf-settings-col">
            {/* CARD 1: Personal Information */}
            <div className="tf-settings-card">
              <div className="tf-card-header">
                <div className="tf-card-icon-box purple">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="tf-card-title">Personal Information</h3>
                  <p className="tf-card-subtitle">
                    Update your basic details used across the platform.
                  </p>
                </div>
              </div>

              <div className="tf-card-body">
                <form
                  className="tf-form-grid"
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast("Personal information saved!");
                  }}
                >
                  {/* Full Name */}
                  <div className="tf-form-group">
                    <label className="tf-form-label" htmlFor="tf-full-name">
                      Full Name
                    </label>
                    <input
                      id="tf-full-name"
                      type="text"
                      className="tf-form-input"
                      value={profile.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                    />
                  </div>

                  {/* Email Address */}
                  <div className="tf-form-group">
                    <label className="tf-form-label" htmlFor="tf-email">
                      Email Address
                    </label>
                    <input
                      id="tf-email"
                      type="email"
                      className="tf-form-input"
                      value={profile.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="tf-form-group">
                    <label className="tf-form-label" htmlFor="tf-phone">
                      Phone Number
                    </label>
                    <input
                      id="tf-phone"
                      type="text"
                      className="tf-form-input"
                      value={profile.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    />
                  </div>

                  {/* Job Role */}
                  <div className="tf-form-group">
                    <label className="tf-form-label" htmlFor="tf-job-role">
                      Job Role
                    </label>
                    <div className="tf-select-wrap">
                      <select
                        id="tf-job-role"
                        className="tf-form-select"
                        value={profile.role}
                        onChange={(e) => handleInputChange("role", e.target.value)}
                      >
                        <option value="Employee">Employee</option>
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="UI/UX Designer">UI/UX Designer</option>
                        <option value="QA Engineer">QA Engineer</option>
                        <option value="Team Lead">Team Lead</option>
                        <option value="Project Manager">Project Manager</option>
                      </select>
                      <ChevronDown size={15} className="tf-select-chevron" />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="tf-form-group">
                    <label className="tf-form-label" htmlFor="tf-department">
                      Department
                    </label>
                    <div className="tf-select-wrap">
                      <select
                        id="tf-department"
                        className="tf-form-select"
                        value={profile.department}
                        onChange={(e) =>
                          handleInputChange("department", e.target.value)
                        }
                      >
                        <option value="Development">Development</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Quality Assurance">Quality Assurance</option>
                        <option value="Product Management">Product Management</option>
                        <option value="DevOps & Infra">DevOps & Infra</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                      <ChevronDown size={15} className="tf-select-chevron" />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="tf-form-group">
                    <label className="tf-form-label" htmlFor="tf-location">
                      Location
                    </label>
                    <div className="tf-select-wrap">
                      <select
                        id="tf-location"
                        className="tf-form-select"
                        value={profile.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                      >
                        <option value="Pune, India">Pune, India</option>
                        <option value="Bengaluru, India">Bengaluru, India</option>
                        <option value="Mumbai, India">Mumbai, India</option>
                        <option value="Hyderabad, India">Hyderabad, India</option>
                        <option value="Delhi NCR, India">Delhi NCR, India</option>
                        <option value="San Francisco, USA">San Francisco, USA</option>
                        <option value="London, UK">London, UK</option>
                        <option value="Remote, Worldwide">Remote, Worldwide</option>
                      </select>
                      <ChevronDown size={15} className="tf-select-chevron" />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* CARD 2: Account & Security */}
            <div className="tf-settings-card">
              <div className="tf-card-header">
                <div className="tf-card-icon-box purple">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="tf-card-title">Account & Security</h3>
                  <p className="tf-card-subtitle">
                    Manage your account security and access.
                  </p>
                </div>
              </div>

              <div className="tf-card-body no-padding">
                <div className="tf-security-list">
                  {/* Item 1: Change Password */}
                  <div
                    className="tf-security-row clickable"
                    onClick={() => setChangePasswordModalOpen(true)}
                  >
                    <div className="tf-security-row-left">
                      <div className="tf-security-icon-box purple">
                        <Key size={17} />
                      </div>
                      <div className="tf-security-meta">
                        <strong className="tf-security-title">Change Password</strong>
                        <span className="tf-security-desc">
                          Update your password to keep your account secure.
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={17} className="tf-security-arrow" />
                  </div>

                  {/* Item 2: Active Sessions */}
                  <div
                    className="tf-security-row clickable"
                    onClick={() => setActiveSessionsModalOpen(true)}
                  >
                    <div className="tf-security-row-left">
                      <div className="tf-security-icon-box blue">
                        <Smartphone size={17} />
                      </div>
                      <div className="tf-security-meta">
                        <strong className="tf-security-title">Active Sessions</strong>
                        <span className="tf-security-desc">
                          View and manage your active login sessions.
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={17} className="tf-security-arrow" />
                  </div>

                  {/* Item 3: Two-Factor Authentication */}
                  <div className="tf-security-row">
                    <div className="tf-security-row-left">
                      <div className="tf-security-icon-box green">
                        <ShieldCheck size={17} />
                      </div>
                      <div className="tf-security-meta">
                        <strong className="tf-security-title">
                          Two-Factor Authentication
                        </strong>
                        <span className="tf-security-desc">
                          Add an extra layer of security to your account.
                        </span>
                      </div>
                    </div>
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      className={`tf-ios-switch ${twoFactorAuth ? "active" : ""}`}
                      onClick={handleToggle2FA}
                      role="switch"
                      aria-checked={twoFactorAuth}
                      aria-label="Toggle Two-Factor Authentication"
                    >
                      <span className="tf-switch-knob" />
                    </button>
                  </div>

                  {/* Item 4: Connected Devices */}
                  <div
                    className="tf-security-row clickable"
                    onClick={() => setConnectedDevicesModalOpen(true)}
                  >
                    <div className="tf-security-row-left">
                      <div className="tf-security-icon-box purple">
                        <Laptop size={17} />
                      </div>
                      <div className="tf-security-meta">
                        <strong className="tf-security-title">Connected Devices</strong>
                        <span className="tf-security-desc">
                          Manage devices that have access to your account.
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={17} className="tf-security-arrow" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="tf-settings-col">
            {/* CARD 3: Appearance & Display */}
            <div className="tf-settings-card">
              <div className="tf-card-header">
                <div className="tf-card-icon-box amber">
                  <Palette size={18} />
                </div>
                <div>
                  <h3 className="tf-card-title">Appearance & Display</h3>
                  <p className="tf-card-subtitle">
                    Customize the look and feel of the application.
                  </p>
                </div>
              </div>

              <div className="tf-card-body">
                {/* 1. Theme Selector */}
                <div className="tf-display-section">
                  <label className="tf-section-label">Theme</label>
                  <div className="tf-theme-cards-row">
                    {/* Light Option */}
                    <button
                      type="button"
                      className={`tf-theme-card-btn ${
                        appearance.theme === "light" ? "active" : ""
                      }`}
                      onClick={() => handleThemeChange("light")}
                    >
                      <Sun size={18} className="tf-theme-icon sun" />
                      <span className="tf-theme-text">Light</span>
                    </button>

                    {/* Dark Option */}
                    <button
                      type="button"
                      className={`tf-theme-card-btn ${
                        appearance.theme === "dark" ? "active" : ""
                      }`}
                      onClick={() => handleThemeChange("dark")}
                    >
                      <Moon size={18} className="tf-theme-icon moon" />
                      <span className="tf-theme-text">Dark</span>
                    </button>

                    {/* System Option */}
                    <button
                      type="button"
                      className={`tf-theme-card-btn ${
                        appearance.theme === "system" ? "active" : ""
                      }`}
                      onClick={() => handleThemeChange("system")}
                    >
                      <Monitor size={18} className="tf-theme-icon system" />
                      <span className="tf-theme-text">System</span>
                    </button>
                  </div>
                </div>

                {/* 2. Primary Color */}
                <div className="tf-display-section">
                  <label className="tf-section-label">Primary Color</label>
                  <div className="tf-color-swatches-row">
                    {colorSwatches.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`tf-color-circle ${
                          appearance.primaryColor === item.color ? "active" : ""
                        }`}
                        style={{ backgroundColor: item.color }}
                        onClick={() => handleColorChange(item.color)}
                        title={item.label}
                        aria-label={item.label}
                      />
                    ))}
                  </div>
                </div>

                {/* 3. Font Size */}
                <div className="tf-display-section">
                  <div className="tf-font-size-row">
                    <label className="tf-section-label">Font Size</label>
                    <div className="tf-font-size-group">
                      {["Small", "Medium", "Large"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={`tf-font-size-btn ${
                            appearance.fontSize === size ? "active" : ""
                          }`}
                          onClick={() => handleFontSizeChange(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 4: Notifications */}
            <div className="tf-settings-card">
              <div className="tf-card-header">
                <div className="tf-card-icon-box red">
                  <Bell size={18} />
                </div>
                <div>
                  <h3 className="tf-card-title">Notifications</h3>
                  <p className="tf-card-subtitle">
                    Choose what notifications you want to receive.
                  </p>
                </div>
              </div>

              <div className="tf-card-body no-padding">
                <div className="tf-notif-list">
                  {/* Task Updates */}
                  <div className="tf-notif-row">
                    <div className="tf-notif-row-left">
                      <div className="tf-notif-icon-box purple">
                        <FileText size={17} />
                      </div>
                      <div className="tf-notif-meta">
                        <strong className="tf-notif-title">Task Updates</strong>
                        <span className="tf-notif-desc">
                          Get notified when tasks are assigned, updated or completed.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`tf-ios-switch ${
                        notifications.taskUpdates ? "active" : ""
                      }`}
                      onClick={() => handleToggleNotification("taskUpdates")}
                      role="switch"
                      aria-checked={notifications.taskUpdates}
                      aria-label="Toggle Task Updates"
                    >
                      <span className="tf-switch-knob" />
                    </button>
                  </div>

                  {/* Project Updates */}
                  <div className="tf-notif-row">
                    <div className="tf-notif-row-left">
                      <div className="tf-notif-icon-box blue">
                        <Folder size={17} />
                      </div>
                      <div className="tf-notif-meta">
                        <strong className="tf-notif-title">Project Updates</strong>
                        <span className="tf-notif-desc">
                          Get notified about project changes.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`tf-ios-switch ${
                        notifications.projectUpdates ? "active" : ""
                      }`}
                      onClick={() => handleToggleNotification("projectUpdates")}
                      role="switch"
                      aria-checked={notifications.projectUpdates}
                      aria-label="Toggle Project Updates"
                    >
                      <span className="tf-switch-knob" />
                    </button>
                  </div>

                  {/* Bug Updates */}
                  <div className="tf-notif-row">
                    <div className="tf-notif-row-left">
                      <div className="tf-notif-icon-box red">
                        <Bug size={17} />
                      </div>
                      <div className="tf-notif-meta">
                        <strong className="tf-notif-title">Bug Updates</strong>
                        <span className="tf-notif-desc">
                          Get notified about bug assignments and status changes.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`tf-ios-switch ${
                        notifications.bugUpdates ? "active" : ""
                      }`}
                      onClick={() => handleToggleNotification("bugUpdates")}
                      role="switch"
                      aria-checked={notifications.bugUpdates}
                      aria-label="Toggle Bug Updates"
                    >
                      <span className="tf-switch-knob" />
                    </button>
                  </div>

                  {/* Meeting Reminders */}
                  <div className="tf-notif-row">
                    <div className="tf-notif-row-left">
                      <div className="tf-notif-icon-box purple">
                        <Calendar size={17} />
                      </div>
                      <div className="tf-notif-meta">
                        <strong className="tf-notif-title">Meeting Reminders</strong>
                        <span className="tf-notif-desc">
                          Get notified about upcoming meetings.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`tf-ios-switch ${
                        notifications.meetingReminders ? "active" : ""
                      }`}
                      onClick={() => handleToggleNotification("meetingReminders")}
                      role="switch"
                      aria-checked={notifications.meetingReminders}
                      aria-label="Toggle Meeting Reminders"
                    >
                      <span className="tf-switch-knob" />
                    </button>
                  </div>

                  {/* Chat Messages */}
                  <div className="tf-notif-row">
                    <div className="tf-notif-row-left">
                      <div className="tf-notif-icon-box green">
                        <MessageSquare size={17} />
                      </div>
                      <div className="tf-notif-meta">
                        <strong className="tf-notif-title">Chat Messages</strong>
                        <span className="tf-notif-desc">
                          Get notified about new messages and mentions.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`tf-ios-switch ${
                        notifications.chatMessages ? "active" : ""
                      }`}
                      onClick={() => handleToggleNotification("chatMessages")}
                      role="switch"
                      aria-checked={notifications.chatMessages}
                      aria-label="Toggle Chat Messages"
                    >
                      <span className="tf-switch-knob" />
                    </button>
                  </div>

                  {/* System Announcements */}
                  <div className="tf-notif-row">
                    <div className="tf-notif-row-left">
                      <div className="tf-notif-icon-box slate">
                        <Megaphone size={17} />
                      </div>
                      <div className="tf-notif-meta">
                        <strong className="tf-notif-title">System Announcements</strong>
                        <span className="tf-notif-desc">
                          Important updates from your organization.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`tf-ios-switch ${
                        notifications.systemAnnouncements ? "active" : ""
                      }`}
                      onClick={() =>
                        handleToggleNotification("systemAnnouncements")
                      }
                      role="switch"
                      aria-checked={notifications.systemAnnouncements}
                      aria-label="Toggle System Announcements"
                    >
                      <span className="tf-switch-knob" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================
            4. BOTTOM FULL-WIDTH CARD: LANGUAGE, TIME & DATE
            ================================================================= */}
        <section className="tf-settings-card tf-localization-card">
          <div className="tf-card-header">
            <div className="tf-card-icon-box blue">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="tf-card-title">Language, Time & Date</h3>
              <p className="tf-card-subtitle">
                Set your preferred language, time zone and date format.
              </p>
            </div>
          </div>

          <div className="tf-card-body">
            <div className="tf-localization-grid">
              {/* 1. Language */}
              <div className="tf-form-group">
                <label className="tf-form-label" htmlFor="tf-lang">
                  Language
                </label>
                <div className="tf-select-wrap">
                  <select
                    id="tf-lang"
                    className="tf-form-select"
                    value={localization.language}
                    onChange={(e) =>
                      handleLocalizationChange("language", e.target.value)
                    }
                  >
                    <option value="English">English</option>
                    <option value="Español">Español</option>
                    <option value="Français">Français</option>
                    <option value="Deutsch">Deutsch</option>
                    <option value="हिन्दी">हिन्दी (Hindi)</option>
                    <option value="日本語">日本語 (Japanese)</option>
                  </select>
                  <ChevronDown size={15} className="tf-select-chevron" />
                </div>
              </div>

              {/* 2. Time Zone */}
              <div className="tf-form-group">
                <label className="tf-form-label" htmlFor="tf-timezone">
                  Time Zone
                </label>
                <div className="tf-select-wrap">
                  <select
                    id="tf-timezone"
                    className="tf-form-select"
                    value={localization.timeZone}
                    onChange={(e) =>
                      handleLocalizationChange("timeZone", e.target.value)
                    }
                  >
                    <option value="(GMT+05:30) India Standard Time">
                      (GMT+05:30) India Standard Time
                    </option>
                    <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                    <option value="(GMT-05:00) Eastern Time (US & Canada)">
                      (GMT-05:00) Eastern Time (US)
                    </option>
                    <option value="(GMT-08:00) Pacific Time (US & Canada)">
                      (GMT-08:00) Pacific Time (US)
                    </option>
                    <option value="(GMT+01:00) Central European Time">
                      (GMT+01:00) Central European Time
                    </option>
                    <option value="(GMT+08:00) Singapore Standard Time">
                      (GMT+08:00) Singapore Standard Time
                    </option>
                  </select>
                  <ChevronDown size={15} className="tf-select-chevron" />
                </div>
              </div>

              {/* 3. Date Format */}
              <div className="tf-form-group">
                <label className="tf-form-label" htmlFor="tf-dateformat">
                  Date Format
                </label>
                <div className="tf-select-wrap">
                  <select
                    id="tf-dateformat"
                    className="tf-form-select"
                    value={localization.dateFormat}
                    onChange={(e) =>
                      handleLocalizationChange("dateFormat", e.target.value)
                    }
                  >
                    <option value="DD MMM YYYY (26 Oct 2024)">
                      DD MMM YYYY (26 Oct 2024)
                    </option>
                    <option value="MM/DD/YYYY (10/26/2024)">
                      MM/DD/YYYY (10/26/2024)
                    </option>
                    <option value="YYYY-MM-DD (2024-10-26)">
                      YYYY-MM-DD (2024-10-26)
                    </option>
                    <option value="DD/MM/YYYY (26/10/2024)">
                      DD/MM/YYYY (26/10/2024)
                    </option>
                  </select>
                  <ChevronDown size={15} className="tf-select-chevron" />
                </div>
              </div>

              {/* 4. Time Format */}
              <div className="tf-form-group">
                <label className="tf-form-label" htmlFor="tf-timeformat">
                  Time Format
                </label>
                <div className="tf-select-wrap">
                  <select
                    id="tf-timeformat"
                    className="tf-form-select"
                    value={localization.timeFormat}
                    onChange={(e) =>
                      handleLocalizationChange("timeFormat", e.target.value)
                    }
                  >
                    <option value="12 Hour (10:30 AM)">12 Hour (10:30 AM)</option>
                    <option value="24 Hour (22:30)">24 Hour (22:30)</option>
                  </select>
                  <ChevronDown size={15} className="tf-select-chevron" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =================================================================
          MODALS
          ================================================================= */}

      {/* 1. EDIT PROFILE MODAL */}
      {editProfileModalOpen && (
        <div className="tf-modal-overlay" onClick={() => setEditProfileModalOpen(false)}>
          <div
            className="tf-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="tf-modal-header">
              <div className="tf-modal-title-wrap">
                <User size={18} className="tf-modal-title-icon purple" />
                <h3 className="tf-modal-title">Edit Profile</h3>
              </div>
              <button
                type="button"
                className="tf-modal-close-btn"
                onClick={() => setEditProfileModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditProfile}>
              <div className="tf-modal-body">
                {/* Choose preset avatar */}
                <div className="tf-modal-avatar-section">
                  <div className="tf-modal-avatar-preview">
                    <img src={editForm.avatar} alt="Preview" />
                  </div>
                  <div className="tf-modal-avatar-options">
                    <span className="tf-modal-avatar-label">Select avatar:</span>
                    <div className="tf-preset-avatars-row">
                      {presetAvatars.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          className={`tf-preset-avatar-btn ${
                            editForm.avatar === url ? "active" : ""
                          }`}
                          onClick={() => setEditForm((f) => ({ ...f, avatar: url }))}
                        >
                          <img src={url} alt={`Preset ${i + 1}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="tf-form-grid">
                  <div className="tf-form-group">
                    <label className="tf-form-label">Full Name</label>
                    <input
                      type="text"
                      className="tf-form-input"
                      value={editForm.fullName}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, fullName: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="tf-form-group">
                    <label className="tf-form-label">Email Address</label>
                    <input
                      type="email"
                      className="tf-form-input"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, email: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="tf-form-group">
                    <label className="tf-form-label">Job Role</label>
                    <input
                      type="text"
                      className="tf-form-input"
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, role: e.target.value }))
                      }
                    />
                  </div>

                  <div className="tf-form-group">
                    <label className="tf-form-label">Department</label>
                    <input
                      type="text"
                      className="tf-form-input"
                      value={editForm.department}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, department: e.target.value }))
                      }
                    />
                  </div>

                  <div className="tf-form-group">
                    <label className="tf-form-label">Location</label>
                    <input
                      type="text"
                      className="tf-form-input"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, location: e.target.value }))
                      }
                    />
                  </div>

                  <div className="tf-form-group">
                    <label className="tf-form-label">Phone Number</label>
                    <input
                      type="text"
                      className="tf-form-input"
                      value={editForm.phoneNumber}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, phoneNumber: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="tf-modal-footer">
                <button
                  type="button"
                  className="tf-modal-btn secondary"
                  onClick={() => setEditProfileModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="tf-modal-btn primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CHANGE PASSWORD MODAL */}
      {changePasswordModalOpen && (
        <div
          className="tf-modal-overlay"
          onClick={() => setChangePasswordModalOpen(false)}
        >
          <div
            className="tf-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="tf-modal-header">
              <div className="tf-modal-title-wrap">
                <Key size={18} className="tf-modal-title-icon purple" />
                <h3 className="tf-modal-title">Change Password</h3>
              </div>
              <button
                type="button"
                className="tf-modal-close-btn"
                onClick={() => setChangePasswordModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePassword}>
              <div className="tf-modal-body">
                <p className="tf-modal-description">
                  Ensure your account is using a long, random password to stay
                  secure.
                </p>

                {/* Current Password */}
                <div className="tf-form-group mb-14">
                  <label className="tf-form-label">Current Password</label>
                  <div className="tf-password-input-wrap">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="tf-form-input"
                      placeholder="••••••••"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          currentPassword: e.target.value,
                        }))
                      }
                      required
                    />
                    <button
                      type="button"
                      className="tf-password-eye-btn"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="tf-form-group mb-14">
                  <label className="tf-form-label">New Password</label>
                  <div className="tf-password-input-wrap">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="tf-form-input"
                      placeholder="At least 6 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          newPassword: e.target.value,
                        }))
                      }
                      required
                    />
                    <button
                      type="button"
                      className="tf-password-eye-btn"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="tf-form-group">
                  <label className="tf-form-label">Confirm New Password</label>
                  <div className="tf-password-input-wrap">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="tf-form-input"
                      placeholder="Repeat new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                    />
                    <button
                      type="button"
                      className="tf-password-eye-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="tf-modal-footer">
                <button
                  type="button"
                  className="tf-modal-btn secondary"
                  onClick={() => setChangePasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="tf-modal-btn primary">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ACTIVE SESSIONS MODAL */}
      {activeSessionsModalOpen && (
        <div
          className="tf-modal-overlay"
          onClick={() => setActiveSessionsModalOpen(false)}
        >
          <div
            className="tf-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="tf-modal-header">
              <div className="tf-modal-title-wrap">
                <Smartphone size={18} className="tf-modal-title-icon blue" />
                <h3 className="tf-modal-title">Active Login Sessions</h3>
              </div>
              <button
                type="button"
                className="tf-modal-close-btn"
                onClick={() => setActiveSessionsModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="tf-modal-body">
              <p className="tf-modal-description">
                These are the devices currently logged into your account. If you see
                any unfamiliar sessions, terminate them immediately.
              </p>

              <div className="tf-sessions-list">
                {activeSessions.map((sess) => (
                  <div key={sess.id} className="tf-session-item">
                    <div className="tf-session-info">
                      <div className="tf-session-topline">
                        <strong>{sess.device}</strong>
                        {sess.current ? (
                          <span className="tf-session-badge current">
                            This Device
                          </span>
                        ) : (
                          <span className="tf-session-badge">{sess.time}</span>
                        )}
                      </div>
                      <div className="tf-session-meta">
                        <span>{sess.location}</span>
                        <span>•</span>
                        <span>IP: {sess.ip}</span>
                      </div>
                    </div>
                    {!sess.current && (
                      <button
                        type="button"
                        className="tf-session-logout-btn"
                        onClick={() => handleTerminateSession(sess.id)}
                        title="Sign out this session"
                      >
                        <LogOut size={14} />
                        <span>Sign out</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="tf-modal-footer space-between">
              <button
                type="button"
                className="tf-modal-btn danger-outline"
                onClick={handleTerminateOtherSessions}
              >
                Terminate Other Sessions
              </button>
              <button
                type="button"
                className="tf-modal-btn secondary"
                onClick={() => setActiveSessionsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. TWO-FACTOR AUTH SETUP MODAL */}
      {twoFactorModalOpen && (
        <div className="tf-modal-overlay" onClick={() => setTwoFactorModalOpen(false)}>
          <div
            className="tf-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="tf-modal-header">
              <div className="tf-modal-title-wrap">
                <ShieldCheck size={18} className="tf-modal-title-icon green" />
                <h3 className="tf-modal-title">Setup Two-Factor Authentication</h3>
              </div>
              <button
                type="button"
                className="tf-modal-close-btn"
                onClick={() => setTwoFactorModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleVerify2FA}>
              <div className="tf-modal-body">
                <div className="tf-2fa-step-block">
                  <span className="tf-2fa-step-num">1</span>
                  <div>
                    <strong>Scan QR code with your authenticator app</strong>
                    <p className="tf-modal-description">
                      Use Google Authenticator, 1Password, or Authy to scan:
                    </p>
                  </div>
                </div>

                {/* Simulated QR Code SVG */}
                <div className="tf-qr-code-box">
                  <svg
                    width="140"
                    height="140"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                    className="tf-qr-svg"
                  >
                    <rect x="10" y="10" width="25" height="25" fill="#4338CA" />
                    <rect x="15" y="15" width="15" height="15" fill="#FFFFFF" />
                    <rect x="18" y="18" width="9" height="9" fill="#4338CA" />
                    <rect x="65" y="10" width="25" height="25" fill="#4338CA" />
                    <rect x="70" y="15" width="15" height="15" fill="#FFFFFF" />
                    <rect x="73" y="18" width="9" height="9" fill="#4338CA" />
                    <rect x="10" y="65" width="25" height="25" fill="#4338CA" />
                    <rect x="15" y="70" width="15" height="15" fill="#FFFFFF" />
                    <rect x="18" y="73" width="9" height="9" fill="#4338CA" />
                    <rect x="42" y="12" width="12" height="6" fill="#4338CA" />
                    <rect x="45" y="24" width="8" height="8" fill="#4338CA" />
                    <rect x="40" y="40" width="20" height="20" fill="#4338CA" />
                    <rect x="68" y="42" width="14" height="6" fill="#4338CA" />
                    <rect x="12" y="44" width="14" height="6" fill="#4338CA" />
                    <rect x="42" y="68" width="8" height="18" fill="#4338CA" />
                    <rect x="68" y="68" width="20" height="8" fill="#4338CA" />
                    <rect x="68" y="82" width="10" height="8" fill="#4338CA" />
                  </svg>
                </div>

                <div className="tf-2fa-secret-box">
                  <span className="tf-secret-label">Secret Key:</span>
                  <code className="tf-secret-code">TF-8942-XN92-KL49-9821</code>
                  <button
                    type="button"
                    className="tf-copy-secret-btn"
                    onClick={copySecretKey}
                    title="Copy Secret Key"
                  >
                    {secretCopied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="tf-2fa-step-block mt-16">
                  <span className="tf-2fa-step-num">2</span>
                  <div>
                    <strong>Enter the 6-digit confirmation code</strong>
                    <p className="tf-modal-description">
                      Enter code from your authenticator app to complete setup:
                    </p>
                  </div>
                </div>

                <div className="tf-form-group">
                  <input
                    type="text"
                    maxLength={6}
                    className="tf-form-input tf-2fa-code-input"
                    placeholder="000000"
                    value={twoFactorCode}
                    onChange={(e) =>
                      setTwoFactorCode(e.target.value.replace(/\D/g, ""))
                    }
                    autoFocus
                  />
                </div>
              </div>

              <div className="tf-modal-footer">
                <button
                  type="button"
                  className="tf-modal-btn secondary"
                  onClick={() => setTwoFactorModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="tf-modal-btn primary">
                  Verify & Enable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. CONNECTED DEVICES MODAL */}
      {connectedDevicesModalOpen && (
        <div
          className="tf-modal-overlay"
          onClick={() => setConnectedDevicesModalOpen(false)}
        >
          <div
            className="tf-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="tf-modal-header">
              <div className="tf-modal-title-wrap">
                <Laptop size={18} className="tf-modal-title-icon purple" />
                <h3 className="tf-modal-title">Connected Devices</h3>
              </div>
              <button
                type="button"
                className="tf-modal-close-btn"
                onClick={() => setConnectedDevicesModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="tf-modal-body">
              <p className="tf-modal-description">
                These devices have permanent security tokens authorized to access
                TeamFlow. Revoke any device that you no longer use.
              </p>

              <div className="tf-devices-list">
                {connectedDevices.map((dev) => (
                  <div key={dev.id} className="tf-device-item">
                    <div className="tf-device-info">
                      <strong>{dev.name}</strong>
                      <div className="tf-device-meta">
                        <span>{dev.os}</span>
                        <span>•</span>
                        <span>Authorized on {dev.authorized}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="tf-device-revoke-btn"
                      onClick={() => handleRevokeDevice(dev.id)}
                    >
                      <AlertCircle size={13} />
                      <span>Revoke</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="tf-modal-footer">
              <button
                type="button"
                className="tf-modal-btn secondary"
                onClick={() => setConnectedDevicesModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </EmployeeShell>
  );
}

export default Settings;
