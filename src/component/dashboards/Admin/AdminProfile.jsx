import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  Building2,
  MapPin,
  Clock,
  Briefcase,
  Camera,
  Trash2,
  Check,
  RotateCcw,
  Menu,
  ArrowLeft,
  ShieldCheck,
  Bell,
  Palette,
  Settings,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminProfile.css";

const STORAGE_KEY = "teamflow_admin_profile";

const defaultProfile = {
  firstName: "Amit",
  lastName: "Sharma",
  email: "amit@abctech.com",
  phone: "+1 (555) 349-8201",
  role: "Organization Admin",
  department: "Executive & Engineering",
  organization: "ABC Technologies",
  location: "San Francisco, CA, USA",
  timezone: "America/Los_Angeles",
  bio: "Experienced technology leader driving TeamFlow AI adoption, engineering workflows, and collaborative workspace innovation.",
  avatar: "",
};

export default function AdminProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const initials = `${profile.firstName?.charAt(0) || "A"}${profile.lastName?.charAt(0) || "S"}`.toUpperCase();

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        handleChange("avatar", e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    handleChange("avatar", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  const handleReset = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setProfile(saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile);
    } catch {
      setProfile(defaultProfile);
    }
  };

  return (
    <div className="tfAdminProfile">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <main className="tfAdminProfile__main">
        {/* TOPBAR */}
        <AdminTopbar onMobileMenuToggle={() => setMobileSidebarOpen(true)} />

        {/* CONTENT */}
        <div className="tfAdminProfile__content">
          {savedSuccess && (
            <div className="tfAdminProfile__toast">
              <Check size={18} />
              <span>Profile information updated successfully!</span>
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="tfAdminProfile__header">
            <div>
              <h1>My Profile</h1>
              <p>Manage your personal information, contact details, and organization role.</p>
            </div>

            <div className="tfAdminProfile__headerActions">
              <button
                type="button"
                className="tfAdminProfile__btnSecondary"
                onClick={handleReset}
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>
              <button
                type="button"
                className="tfAdminProfile__btnPrimary"
                onClick={handleSubmit}
              >
                <Check size={15} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {/* QUICK NAV TABS */}
          <div className="tfAdminSettings__moduleTabs">
            <button
              type="button"
              className="tfAdminSettings__moduleTab tfAdminSettings__moduleTab--active"
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
              className="tfAdminSettings__moduleTab "
              onClick={() => navigate("/admin/settings")}
            >
              <Building2 size={14} />
              <span>Organization Settings</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="tfAdminProfile__grid">
            {/* LEFT COLUMN: AVATAR & SUMMARY */}
            <div className="tfAdminProfile__sidebarCard">
              <div className="tfAdminProfile__card">
                <div className="tfAdminProfile__avatarSection">
                  <div className="tfAdminProfile__avatarWrapper">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        className="tfAdminProfile__avatarImg"
                      />
                    ) : (
                      <div className="tfAdminProfile__avatarInitials">
                        {initials}
                      </div>
                    )}
                    <button
                      type="button"
                      className="tfAdminProfile__avatarUploadBtn"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload new photo"
                    >
                      <Camera size={14} />
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: "none" }}
                  />

                  <div className="tfAdminProfile__avatarMeta">
                    <h3>{profile.firstName} {profile.lastName}</h3>
                    <p className="tfAdminProfile__roleBadge">{profile.role}</p>
                    <span className="tfAdminProfile__email">{profile.email}</span>
                  </div>

                  <div className="tfAdminProfile__avatarActions">
                    <button
                      type="button"
                      className="tfAdminProfile__btnOutline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera size={14} />
                      <span>Change Photo</span>
                    </button>
                    {profile.avatar && (
                      <button
                        type="button"
                        className="tfAdminProfile__btnDangerSmall"
                        onClick={handleRemoveAvatar}
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  <small className="tfAdminProfile__avatarHint">
                    Recommended: Square JPG, PNG under 2MB.
                  </small>
                </div>

                <div className="tfAdminProfile__divider" />

                <div className="tfAdminProfile__quickStats">
                  <div className="tfAdminProfile__statItem">
                    <Building2 size={16} />
                    <div>
                      <small>Organization</small>
                      <strong>{profile.organization}</strong>
                    </div>
                  </div>
                  <div className="tfAdminProfile__statItem">
                    <Briefcase size={16} />
                    <div>
                      <small>Department</small>
                      <strong>{profile.department}</strong>
                    </div>
                  </div>
                  <div className="tfAdminProfile__statItem">
                    <MapPin size={16} />
                    <div>
                      <small>Location</small>
                      <strong>{profile.location}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: FORM FIELDS */}
            <div className="tfAdminProfile__mainCard">
              <div className="tfAdminProfile__card">
                <div className="tfAdminProfile__cardHeader">
                  <h2>Personal Information</h2>
                  <p>Update your personal details and how your profile appears to teammates.</p>
                </div>

                <div className="tfAdminProfile__formRow tfAdminProfile__formRow--two">
                  <div className="tfAdminProfile__field">
                    <label>First Name</label>
                    <input
                      type="text"
                      required
                      value={profile.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      placeholder="e.g. Amit"
                    />
                  </div>
                  <div className="tfAdminProfile__field">
                    <label>Last Name</label>
                    <input
                      type="text"
                      required
                      value={profile.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      placeholder="e.g. Sharma"
                    />
                  </div>
                </div>

                <div className="tfAdminProfile__formRow tfAdminProfile__formRow--two">
                  <div className="tfAdminProfile__field">
                    <label>
                      <Mail size={13} />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={profile.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="admin@teamflow.local"
                    />
                  </div>
                  <div className="tfAdminProfile__field">
                    <label>
                      <Phone size={13} />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="tfAdminProfile__divider" />

                <div className="tfAdminProfile__cardHeader">
                  <h2>Role & Organization</h2>
                  <p>Your administrative permissions and organizational assignment.</p>
                </div>

                <div className="tfAdminProfile__formRow tfAdminProfile__formRow--two">
                  <div className="tfAdminProfile__field">
                    <label>Job Title / Role</label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => handleChange("role", e.target.value)}
                      placeholder="e.g. Organization Admin"
                    />
                  </div>
                  <div className="tfAdminProfile__field">
                    <label>Department</label>
                    <input
                      type="text"
                      value={profile.department}
                      onChange={(e) => handleChange("department", e.target.value)}
                      placeholder="e.g. Executive"
                    />
                  </div>
                </div>

                <div className="tfAdminProfile__formRow tfAdminProfile__formRow--two">
                  <div className="tfAdminProfile__field">
                    <label>Organization</label>
                    <input
                      type="text"
                      value={profile.organization}
                      onChange={(e) => handleChange("organization", e.target.value)}
                      placeholder="ABC Technologies"
                    />
                  </div>
                  <div className="tfAdminProfile__field">
                    <label>Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="tfAdminProfile__formRow">
                  <div className="tfAdminProfile__field">
                    <label>
                      <Clock size={13} />
                      <span>Timezone</span>
                    </label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => handleChange("timezone", e.target.value)}
                    >
                      <option value="America/Los_Angeles">Pacific Time (US & Canada) - GMT-7</option>
                      <option value="America/Denver">Mountain Time (US & Canada) - GMT-6</option>
                      <option value="America/Chicago">Central Time (US & Canada) - GMT-5</option>
                      <option value="America/New_York">Eastern Time (US & Canada) - GMT-4</option>
                      <option value="Europe/London">London, Edinburgh - GMT+1</option>
                      <option value="Europe/Paris">Paris, Berlin, Rome - GMT+2</option>
                      <option value="Asia/Kolkata">India Standard Time - GMT+5:30</option>
                      <option value="Asia/Tokyo">Tokyo, Osaka - GMT+9</option>
                    </select>
                  </div>
                </div>

                <div className="tfAdminProfile__formRow">
                  <div className="tfAdminProfile__field">
                    <label>Bio / About</label>
                    <textarea
                      rows={3}
                      value={profile.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      placeholder="Share a short bio with your team..."
                    />
                  </div>
                </div>

                <div className="tfAdminProfile__formFooter">
                  <button
                    type="button"
                    className="tfAdminProfile__btnSecondary"
                    onClick={handleReset}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="tfAdminProfile__btnPrimary"
                  >
                    <Check size={16} />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

