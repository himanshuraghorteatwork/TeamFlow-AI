import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TeamLeadSidebar from "./TeamLeadSidebar.jsx";
import TeamLeadTopbar from "./TeamLeadTopbar.jsx";
import "./TeamLeadLayout.css";
import "./TeamLeadDarkMode.css";

export default function TeamLeadLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    try {
      return (
        localStorage.getItem("teamflow_admin_dark") === "true" ||
        localStorage.getItem("teamflow_superadmin_dark_mode") === "true" ||
        localStorage.getItem("teamflow_theme_mode") === "dark" ||
        localStorage.getItem("teamflow_dark_mode") === "true" ||
        (typeof document !== "undefined" && (
          document.documentElement.classList.contains("dark") ||
          document.documentElement.classList.contains("dark-mode")
        ))
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const syncTheme = () => {
      try {
        const dark = (
          localStorage.getItem("teamflow_admin_dark") === "true" ||
          localStorage.getItem("teamflow_superadmin_dark_mode") === "true" ||
          localStorage.getItem("teamflow_theme_mode") === "dark" ||
          localStorage.getItem("teamflow_dark_mode") === "true" ||
          document.documentElement.classList.contains("dark") ||
          document.documentElement.classList.contains("dark-mode")
        );
        setIsDark(Boolean(dark));
      } catch {
        // ignore
      }
    };

    window.addEventListener("teamflow_theme_update", syncTheme);
    window.addEventListener("storage", syncTheme);
    return () => {
      window.removeEventListener("teamflow_theme_update", syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  return (
    <div className={`teamlead-layout tf-admin-theme-wrapper ${isDark ? "dark dark-mode sa-dark-mode" : ""}`}>
      <TeamLeadSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="teamlead-main-wrapper">
        <TeamLeadTopbar
          onMobileMenuToggle={() => setMobileOpen((prev) => !prev)}
        />
        <main className="teamlead-layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
