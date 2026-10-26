import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Palette,
  Sun,
  Moon,
  Laptop,
  Check,
  RotateCcw,
  Menu,
  ArrowLeft,
  UserRound,
  ShieldCheck,
  Bell,
  Settings,
  Sparkles,
  Sliders,
  Eye,
  Type,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminAppearance.css";

const STORAGE_KEY = "teamflow_theme_preference";

const defaultAppearance = {
  themeMode: "light", // 'light' | 'dark' | 'system'
  accentColor: "#5b5cf0",
  density: "comfortable", // 'compact' | 'comfortable' | 'spacious'
  fontSize: "medium", // 'small' | 'medium' | 'large'
  reduceMotion: false,
  highContrast: false,
  showCodeFont: true,
};

const accentColors = [
  { name: "TeamFlow Indigo", hex: "#5b5cf0" },
  { name: "Royal Blue", hex: "#2563eb" },
  { name: "Emerald Green", hex: "#10b981" },
  { name: "Purple", hex: "#8b5cf6" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Amber", hex: "#f59e0b" },
];

export default function AdminAppearance() {
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [appearance, setAppearance] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const initial = saved ? { ...defaultAppearance, ...JSON.parse(saved) } : defaultAppearance;
      const storedMode = localStorage.getItem("teamflow_theme_mode");
      if (storedMode) {
        initial.themeMode = storedMode;
      } else {
        const isDark =
          document.documentElement.classList.contains("dark") ||
          localStorage.getItem("teamflow_admin_dark") === "true";
        initial.themeMode = isDark ? "dark" : "light";
      }
      return initial;
    } catch {
      return defaultAppearance;
    }
  });

  const applyThemeMode = (mode) => {
    let isDark = false;
    if (mode === "dark") {
      isDark = true;
    } else if (mode === "light") {
      isDark = false;
    } else if (mode === "system") {
      isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("teamflow_admin_dark", String(isDark));
    localStorage.setItem("teamflow_theme_mode", mode);
    window.dispatchEvent(new Event("teamflow_theme_update"));
  };

  const applyAccentColor = (hex) => {
    document.documentElement.style.setProperty("--primary", hex);
    document.documentElement.style.setProperty("--admin-accent-color", hex);
    localStorage.setItem("teamflow_accent_color", hex);
  };

  const handleSelectThemeMode = (mode) => {
    handleChange("themeMode", mode);
    applyThemeMode(mode);
  };

  const handleSelectAccentColor = (hex) => {
    handleChange("accentColor", hex);
    applyAccentColor(hex);
  };

  // System mode listener
  useEffect(() => {
    if (appearance.themeMode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e) => {
        if (e.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("teamflow_admin_dark", String(e.matches));
        window.dispatchEvent(new Event("teamflow_theme_update"));
      };
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [appearance.themeMode]);

  const handleChange = (field, value) => {
    setAppearance((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appearance));
      applyThemeMode(appearance.themeMode);
      applyAccentColor(appearance.accentColor);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save appearance settings:", err);
    }
  };

  const handleReset = () => {
    try {
      setAppearance(defaultAppearance);
      applyThemeMode("light");
      applyAccentColor(defaultAppearance.accentColor);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAppearance));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      setAppearance(defaultAppearance);
    }
  };

  return (
    <div className="tfAdminAppearance">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <main className="tfAdminAppearance__main">
        {/* TOPBAR */}
        <AdminTopbar onMobileMenuToggle={() => setMobileSidebarOpen(true)} />

        {/* CONTENT */}
        <div className="tfAdminAppearance__content">
          {savedSuccess && (
            <div className="tfAdminAppearance__toast">
              <Check size={18} />
              <span>Theme and appearance preferences saved successfully!</span>
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="tfAdminAppearance__header">
            <div>
              <h1>Appearance & Theme</h1>
              <p>Customize the look and feel of your TeamFlow AI Admin console.</p>
            </div>

            <div className="tfAdminAppearance__headerActions">
              <button
                type="button"
                className="tfAdminAppearance__btnSecondary"
                onClick={handleReset}
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>
              <button
                type="button"
                className="tfAdminAppearance__btnPrimary"
                onClick={handleSubmit}
              >
                <Check size={15} />
                <span>Save Theme</span>
              </button>
            </div>
          </div>

          {/* NAV TABS */}
          <div className="tfAdminAppearance__tabs">
            <button
              type="button"
              className="tfAdminAppearance__tab"
              onClick={() => navigate("/admin/profile")}
            >
              <UserRound size={15} />
              <span>Profile</span>
            </button>
            <button
              type="button"
              className="tfAdminAppearance__tab"
              onClick={() => navigate("/admin/account-settings")}
            >
              <Settings size={15} />
              <span>Account Settings</span>
            </button>
            <button
              type="button"
              className="tfAdminAppearance__tab tfAdminAppearance__tab--active"
            >
              <Palette size={15} />
              <span>Appearance</span>
            </button>
            <button
              type="button"
              className="tfAdminAppearance__tab"
              onClick={() => navigate("/admin/notifications")}
            >
              <Bell size={15} />
              <span>Notifications</span>
            </button>
            <button
              type="button"
              className="tfAdminAppearance__tab"
              onClick={() => navigate("/admin/security")}
            >
              <ShieldCheck size={15} />
              <span>Security</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="tfAdminAppearance__grid">
            {/* LEFT / MAIN SETTINGS */}
            <div className="tfAdminAppearance__settingsCol">
              {/* THEME MODE */}
              <div className="tfAdminAppearance__card">
                <div className="tfAdminAppearance__cardHeader">
                  <h2>Theme Mode</h2>
                  <p>Select your preferred color theme or let TeamFlow match your system setting.</p>
                </div>

                <div className="tfAdminAppearance__themeOptions">
                  <button
                    type="button"
                    className={`tfAdminAppearance__themeCard ${appearance.themeMode === "light" ? "tfAdminAppearance__themeCard--active" : ""}`}
                    onClick={() => handleSelectThemeMode("light")}
                  >
                    <div className="tfAdminAppearance__themePreview tfAdminAppearance__themePreview--light">
                      <div className="tfAdminAppearance__previewTopbar" />
                      <div className="tfAdminAppearance__previewContent">
                        <div className="tfAdminAppearance__previewSidebar" />
                        <div className="tfAdminAppearance__previewCard" />
                      </div>
                    </div>
                    <div className="tfAdminAppearance__themeLabel">
                      <Sun size={16} />
                      <strong>Light</strong>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`tfAdminAppearance__themeCard ${appearance.themeMode === "dark" ? "tfAdminAppearance__themeCard--active" : ""}`}
                    onClick={() => handleSelectThemeMode("dark")}
                  >
                    <div className="tfAdminAppearance__themePreview tfAdminAppearance__themePreview--dark">
                      <div className="tfAdminAppearance__previewTopbar" />
                      <div className="tfAdminAppearance__previewContent">
                        <div className="tfAdminAppearance__previewSidebar" />
                        <div className="tfAdminAppearance__previewCard" />
                      </div>
                    </div>
                    <div className="tfAdminAppearance__themeLabel">
                      <Moon size={16} />
                      <strong>Dark</strong>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`tfAdminAppearance__themeCard ${appearance.themeMode === "system" ? "tfAdminAppearance__themeCard--active" : ""}`}
                    onClick={() => handleSelectThemeMode("system")}
                  >
                    <div className="tfAdminAppearance__themePreview tfAdminAppearance__themePreview--system">
                      <div className="tfAdminAppearance__previewTopbar" />
                      <div className="tfAdminAppearance__previewContent">
                        <div className="tfAdminAppearance__previewSidebar" />
                        <div className="tfAdminAppearance__previewCard" />
                      </div>
                    </div>
                    <div className="tfAdminAppearance__themeLabel">
                      <Laptop size={16} />
                      <strong>System</strong>
                    </div>
                  </button>
                </div>
              </div>

              {/* ACCENT COLOR */}
              <div className="tfAdminAppearance__card">
                <div className="tfAdminAppearance__cardHeader">
                  <h2>Accent Color</h2>
                  <p>Choose an accent highlight color for buttons, badges, and active tabs.</p>
                </div>

                <div className="tfAdminAppearance__colorGrid">
                  {accentColors.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      className={`tfAdminAppearance__colorBtn ${appearance.accentColor === color.hex ? "tfAdminAppearance__colorBtn--active" : ""}`}
                      onClick={() => handleSelectAccentColor(color.hex)}
                    >
                      <span
                        className="tfAdminAppearance__colorSwatch"
                        style={{ background: color.hex }}
                      >
                        {appearance.accentColor === color.hex && <Check size={14} color="#ffffff" />}
                      </span>
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* DENSITY & TYPOGRAPHY */}
              <div className="tfAdminAppearance__card">
                <div className="tfAdminAppearance__cardHeader">
                  <h2>Interface Density & Sizing</h2>
                  <p>Adjust padding, font sizes, and layout compactness.</p>
                </div>

                <div className="tfAdminAppearance__row tfAdminAppearance__row--two">
                  <div className="tfAdminAppearance__field">
                    <label>Layout Density</label>
                    <div className="tfAdminAppearance__segmentedControl">
                      {["compact", "comfortable", "spacious"].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          className={appearance.density === mode ? "active" : ""}
                          onClick={() => handleChange("density", mode)}
                        >
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="tfAdminAppearance__field">
                    <label>Font Size</label>
                    <div className="tfAdminAppearance__segmentedControl">
                      {["small", "medium", "large"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          className={appearance.fontSize === size ? "active" : ""}
                          onClick={() => handleChange("fontSize", size)}
                        >
                          {size.charAt(0).toUpperCase() + size.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="tfAdminAppearance__toggleList">
                  <label className="tfAdminAppearance__toggleRow">
                    <div>
                      <strong>Reduce Motion</strong>
                      <p>Minimize animations and transitions throughout the interface.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={appearance.reduceMotion}
                      onChange={(e) => handleChange("reduceMotion", e.target.checked)}
                    />
                  </label>

                  <label className="tfAdminAppearance__toggleRow">
                    <div>
                      <strong>High Contrast</strong>
                      <p>Increase border contrast and text clarity for improved accessibility.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={appearance.highContrast}
                      onChange={(e) => handleChange("highContrast", e.target.checked)}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT: LIVE PREVIEW WIDGET */}
            <div className="tfAdminAppearance__previewCol">
              <div className="tfAdminAppearance__card tfAdminAppearance__card--sticky">
                <div className="tfAdminAppearance__cardHeader">
                  <Eye size={18} style={{ color: appearance.accentColor }} />
                  <div>
                    <h2>Live Preview</h2>
                    <p>Real-time view of your theme and styling choices.</p>
                  </div>
                </div>

                <div
                  className={`tfAdminAppearance__previewBox tfAdminAppearance__previewBox--${appearance.themeMode}`}
                  style={{
                    "--preview-accent": appearance.accentColor,
                  }}
                >
                  <div className="tfAdminAppearance__previewMockHeader">
                    <div className="tfAdminAppearance__mockDots">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span className="tfAdminAppearance__mockTitle">TeamFlow AI</span>
                  </div>

                  <div className="tfAdminAppearance__mockBody">
                    <div className="tfAdminAppearance__mockCard">
                      <div className="tfAdminAppearance__mockCardRow">
                        <div
                          className="tfAdminAppearance__mockBadge"
                          style={{ background: appearance.accentColor, color: "#fff" }}
                        >
                          Active Project
                        </div>
                        <small style={{ color: "#98a2b3" }}>Oct 26</small>
                      </div>
                      <strong className="tfAdminAppearance__mockCardTitle">
                        TeamFlow AI Web UI
                      </strong>
                      <div className="tfAdminAppearance__mockProgressTrack">
                        <span
                          style={{
                            width: "75%",
                            background: appearance.accentColor,
                          }}
                        />
                      </div>
                      <div className="tfAdminAppearance__mockBtnRow">
                        <button
                          type="button"
                          className="tfAdminAppearance__mockBtn"
                          style={{
                            background: appearance.accentColor,
                            color: "#ffffff",
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tfAdminAppearance__previewMeta">
                  <small>Selected Theme: <strong>{appearance.themeMode}</strong></small>
                  <small>Accent: <strong>{appearance.accentColor}</strong></small>
                  <small>Density: <strong>{appearance.density}</strong></small>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

