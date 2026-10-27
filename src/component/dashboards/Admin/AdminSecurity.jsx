import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  KeyRound,
  Smartphone,
  Laptop,
  Lock,
  Eye,
  EyeOff,
  Check,
  RotateCcw,
  Menu,
  ArrowLeft,
  UserRound,
  Bell,
  Palette,
  Settings,
  AlertTriangle,
  QrCode,
  Copy,
  LogOut,
  History,
  ShieldAlert,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminSecurity.css";

const STORAGE_KEY = "teamflow_admin_security";

const defaultSecurityState = {
  twoFactorEnabled: true,
  twoFactorMethod: "authenticator", // 'authenticator' | 'sms'
  activeSessions: [
    {
      id: "sess-1",
      device: "Windows 11 PC",
      browser: "Chrome 124.0",
      location: "San Francisco, CA, US",
      ip: "192.168.1.104",
      lastActive: "Active now",
      isCurrent: true,
    },
    {
      id: "sess-2",
      device: "MacBook Pro 16",
      browser: "Safari 17.4",
      location: "New York, NY, US",
      ip: "74.125.21.14",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
    {
      id: "sess-3",
      device: "iPhone 15 Pro",
      browser: "TeamFlow Mobile App",
      location: "San Francisco, CA, US",
      ip: "172.56.42.89",
      lastActive: "Yesterday at 6:45 PM",
      isCurrent: false,
    },
  ],
  loginHistory: [
    {
      id: "log-1",
      event: "Successful Login",
      location: "San Francisco, CA, US",
      device: "Chrome on Windows",
      ip: "192.168.1.104",
      time: "Today, 10:14 AM",
      status: "success",
    },
    {
      id: "log-2",
      event: "Two-Factor Verified",
      location: "San Francisco, CA, US",
      device: "Chrome on Windows",
      ip: "192.168.1.104",
      time: "Today, 10:14 AM",
      status: "success",
    },
    {
      id: "log-3",
      event: "Successful Login",
      location: "New York, NY, US",
      device: "Safari on macOS",
      ip: "74.125.21.14",
      time: "Yesterday, 3:20 PM",
      status: "success",
    },
  ],
};

const recoveryCodes = [
  "7A4B-92EF-881C",
  "3F91-11DA-40CB",
  "E084-77BA-9321",
  "6D2C-8451-99AF",
  "18BC-99AA-7312",
  "55E1-209F-11DA",
];

export default function AdminSecurity() {
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [securityData, setSecurityData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultSecurityState, ...JSON.parse(saved) } : defaultSecurityState;
    } catch {
      return defaultSecurityState;
    }
  });

  // Password change form
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "None" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    switch (score) {
      case 1:
        return { score: 25, label: "Weak", color: "#ef4444" };
      case 2:
        return { score: 50, label: "Fair", color: "#f59e0b" };
      case 3:
        return { score: 75, label: "Good", color: "#3b82f6" };
      case 4:
        return { score: 100, label: "Strong", color: "#10b981" };
      default:
        return { score: 0, label: "None", color: "#cbd5e1" };
    }
  };

  const strength = getPasswordStrength(passForm.newPassword);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!passForm.currentPassword) {
      setErrorMessage("Please enter your current password.");
      return;
    }
    if (passForm.newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      return;
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      setErrorMessage("New passwords do not match. Please verify.");
      return;
    }

    // Save success
    setSavedSuccess("Password updated successfully! Your account is secured.");
    setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setSavedSuccess(""), 4000);
  };

  const handleToggle2FA = () => {
    const updated = {
      ...securityData,
      twoFactorEnabled: !securityData.twoFactorEnabled,
    };
    setSecurityData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedSuccess(updated.twoFactorEnabled ? "Two-Factor Authentication enabled!" : "Two-Factor Authentication disabled.");
    setTimeout(() => setSavedSuccess(""), 3000);
  };

  const handleRevokeSession = (sessionId) => {
    const updatedSessions = securityData.activeSessions.filter((s) => s.id !== sessionId);
    const updated = { ...securityData, activeSessions: updatedSessions };
    setSecurityData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedSuccess("Session revoked and logged out.");
    setTimeout(() => setSavedSuccess(""), 3000);
  };

  const handleRevokeAllOtherSessions = () => {
    const currentOnly = securityData.activeSessions.filter((s) => s.isCurrent);
    const updated = { ...securityData, activeSessions: currentOnly };
    setSecurityData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedSuccess("Logged out of all other active sessions.");
    setTimeout(() => setSavedSuccess(""), 3000);
  };

  const handleCopySecret = () => {
    navigator.clipboard?.writeText("TF-AI-8492-X9Q1-77");
    alert("Secret key copied to clipboard!");
  };

  return (
    <div className="tfAdminSecurity">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <main className="tfAdminSecurity__main">
        {/* TOPBAR */}
        <AdminTopbar onMobileMenuToggle={() => setMobileSidebarOpen(true)} />

        {/* CONTENT */}
        <div className="tfAdminSecurity__content">
          {savedSuccess && (
            <div className="tfAdminSecurity__toast tfAdminSecurity__toast--success">
              <Check size={18} />
              <span>{savedSuccess}</span>
            </div>
          )}

          {errorMessage && (
            <div className="tfAdminSecurity__toast tfAdminSecurity__toast--error">
              <AlertTriangle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="tfAdminSecurity__header">
            <div>
              <h1>Security & Authentication</h1>
              <p>Manage your password credentials, two-factor authorization, and active sessions.</p>
            </div>
          </div>

          {/* NAV TABS */}
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
              className="tfAdminSettings__moduleTab tfAdminSettings__moduleTab--active"
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

          <div className="tfAdminSecurity__grid">
            {/* LEFT COLUMN: PASSWORD & 2FA */}
            <div className="tfAdminSecurity__colMain">
              {/* CHANGE PASSWORD */}
              <div className="tfAdminSecurity__card">
                <div className="tfAdminSecurity__cardHeader">
                  <KeyRound size={18} className="tfAdminSecurity__headerIcon" />
                  <div>
                    <h2>Change Password</h2>
                    <p>Ensure your account uses a strong, unique password to prevent unauthorized access.</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="tfAdminSecurity__form">
                  <div className="tfAdminSecurity__field">
                    <label>Current Password</label>
                    <div className="tfAdminSecurity__passwordWrap">
                      <input
                        type={showCurrent ? "text" : "password"}
                        required
                        value={passForm.currentPassword}
                        onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                        placeholder="••••••••••••"
                      />
                      <button
                        type="button"
                        className="tfAdminSecurity__togglePwd"
                        onClick={() => setShowCurrent(!showCurrent)}
                      >
                        {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="tfAdminSecurity__formRow tfAdminSecurity__formRow--two">
                    <div className="tfAdminSecurity__field">
                      <label>New Password</label>
                      <div className="tfAdminSecurity__passwordWrap">
                        <input
                          type={showNew ? "text" : "password"}
                          required
                          value={passForm.newPassword}
                          onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                          placeholder="Minimum 8 characters"
                        />
                        <button
                          type="button"
                          className="tfAdminSecurity__togglePwd"
                          onClick={() => setShowNew(!showNew)}
                        >
                          {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="tfAdminSecurity__field">
                      <label>Confirm New Password</label>
                      <div className="tfAdminSecurity__passwordWrap">
                        <input
                          type={showConfirm ? "text" : "password"}
                          required
                          value={passForm.confirmPassword}
                          onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                          placeholder="Re-type new password"
                        />
                        <button
                          type="button"
                          className="tfAdminSecurity__togglePwd"
                          onClick={() => setShowConfirm(!showConfirm)}
                        >
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* PASSWORD STRENGTH METER */}
                  {passForm.newPassword && (
                    <div className="tfAdminSecurity__strengthBox">
                      <div className="tfAdminSecurity__strengthHeader">
                        <small>Password Strength:</small>
                        <strong style={{ color: strength.color }}>{strength.label}</strong>
                      </div>
                      <div className="tfAdminSecurity__strengthTrack">
                        <span
                          style={{
                            width: `${strength.score}%`,
                            background: strength.color,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="tfAdminSecurity__formActions">
                    <button type="submit" className="tfAdminSecurity__btnPrimary">
                      <Lock size={15} />
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* TWO-FACTOR AUTHENTICATION */}
              <div className="tfAdminSecurity__card">
                <div className="tfAdminSecurity__cardHeader">
                  <Smartphone size={18} className="tfAdminSecurity__headerIcon" />
                  <div>
                    <h2>Two-Factor Authentication (2FA)</h2>
                    <p>Add an extra layer of protection requiring an authenticator code during login.</p>
                  </div>
                </div>

                <div className="tfAdminSecurity__twoFactorBanner">
                  <div className="tfAdminSecurity__twoFactorStatus">
                    <span
                      className={`tfAdminSecurity__statusPill ${
                        securityData.twoFactorEnabled
                          ? "tfAdminSecurity__statusPill--active"
                          : "tfAdminSecurity__statusPill--inactive"
                      }`}
                    >
                      {securityData.twoFactorEnabled ? "2FA Enabled" : "2FA Disabled"}
                    </span>
                    <p>
                      {securityData.twoFactorEnabled
                        ? "Your account is protected with TOTP Authenticator code verification."
                        : "Enable 2FA to prevent unauthorized logins even if your password is compromised."}
                    </p>
                  </div>

                  <button
                    type="button"
                    className={securityData.twoFactorEnabled ? "tfAdminSecurity__btnDangerOutline" : "tfAdminSecurity__btnPrimary"}
                    onClick={handleToggle2FA}
                  >
                    {securityData.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                  </button>
                </div>

                {securityData.twoFactorEnabled && (
                  <div className="tfAdminSecurity__twoFactorDetails">
                    <div className="tfAdminSecurity__secretRow">
                      <div className="tfAdminSecurity__qrPlaceholder">
                        <QrCode size={36} color="#5b5cf0" />
                        <small>Scan in App</small>
                      </div>

                      <div className="tfAdminSecurity__secretMeta">
                        <label>Authenticator Setup Key</label>
                        <div className="tfAdminSecurity__codeBox">
                          <code>TF-AI-8492-X9Q1-77</code>
                          <button
                            type="button"
                            className="tfAdminSecurity__btnCopy"
                            onClick={handleCopySecret}
                            title="Copy setup key"
                          >
                            <Copy size={14} />
                            <span>Copy</span>
                          </button>
                        </div>
                        <small className="tfAdminSecurity__hint">
                          Compatible with Google Authenticator, Microsoft Authenticator, 1Password, or Authy.
                        </small>
                      </div>
                    </div>

                    <div className="tfAdminSecurity__recoveryCodesSection">
                      <label>Emergency Backup Recovery Codes</label>
                      <div className="tfAdminSecurity__recoveryGrid">
                        {recoveryCodes.map((code, idx) => (
                          <code key={idx}>{code}</code>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: ACTIVE SESSIONS & RECENT LOGINS */}
            <div className="tfAdminSecurity__colSide">
              {/* SESSIONS */}
              <div className="tfAdminSecurity__card">
                <div className="tfAdminSecurity__cardHeader">
                  <Laptop size={18} className="tfAdminSecurity__headerIcon" />
                  <div>
                    <h2>Active Sessions</h2>
                    <p>Devices currently authenticated to your admin account.</p>
                  </div>
                </div>

                <div className="tfAdminSecurity__sessionsList">
                  {securityData.activeSessions.map((session, idx) => (
                    <div
                      key={session.id}
                      className={`tfAdminSecurity__sessionItem ${session.isCurrent ? "tfAdminSecurity__sessionItem--current" : ""}`}
                    >
                      <span className="admin-row-num">{idx + 1}</span>
                      <div className="tfAdminSecurity__sessionInfo">
                        <div className="tfAdminSecurity__sessionTitle">
                          <strong>{session.device}</strong>
                          {session.isCurrent && (
                            <span className="tfAdminSecurity__currentBadge">This Device</span>
                          )}
                        </div>
                        <small>{session.browser} • {session.location}</small>
                        <span className="tfAdminSecurity__sessionTime">
                          {session.lastActive} • {session.ip}
                        </span>
                      </div>

                      {!session.isCurrent && (
                        <button
                          type="button"
                          className="tfAdminSecurity__btnRevoke"
                          onClick={() => handleRevokeSession(session.id)}
                          title="Revoke session access"
                        >
                          <LogOut size={14} />
                          <span>Revoke</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {securityData.activeSessions.length > 1 && (
                  <button
                    type="button"
                    className="tfAdminSecurity__btnRevokeAll"
                    onClick={handleRevokeAllOtherSessions}
                  >
                    <LogOut size={15} />
                    <span>Log Out Other Sessions</span>
                  </button>
                )}
              </div>

              {/* RECENT SECURITY LOGS */}
              <div className="tfAdminSecurity__card">
                <div className="tfAdminSecurity__cardHeader">
                  <History size={18} className="tfAdminSecurity__headerIcon" />
                  <div>
                    <h2>Recent Login Activity</h2>
                    <p>Recent authentication attempts across all devices.</p>
                  </div>
                </div>

                <div className="tfAdminSecurity__logsList">
                  {securityData.loginHistory.map((log, idx) => (
                    <div key={log.id} className="tfAdminSecurity__logItem">
                      <span className="admin-row-num">{idx + 1}</span>
                      <div className="tfAdminSecurity__logStatusDot" />
                      <div className="tfAdminSecurity__logMeta">
                        <strong>{log.event}</strong>
                        <small>{log.device} • {log.location}</small>
                        <span>{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

