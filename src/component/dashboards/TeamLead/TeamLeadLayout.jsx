import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TeamLeadSidebar from "./TeamLeadSidebar.jsx";
import TeamLeadTopbar from "./TeamLeadTopbar.jsx";
import "./TeamLeadLayout.css";
import "./TeamLeadDarkMode.css";

export default function TeamLeadLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const computeIsDark = () => {
    try {
      const mode = localStorage.getItem("teamflow_theme_mode");
      if (mode === "dark") return true;
      if (mode === "light") return false;
      if (mode === "system") {
        return typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-color-scheme: dark)").matches);
      }
      const adminDark = localStorage.getItem("teamflow_admin_dark");
      if (adminDark !== null) return adminDark === "true";
      const tlDark = localStorage.getItem("teamflow_dark_mode");
      if (tlDark !== null) return tlDark === "true";
      return (
        typeof document !== "undefined" && (
          document.documentElement.classList.contains("dark") ||
          document.documentElement.classList.contains("dark-mode")
        )
      );
    } catch {
      return false;
    }
  };

  const [isDark, setIsDark] = useState(computeIsDark);

  useEffect(() => {
    const syncTheme = () => {
      setIsDark(computeIsDark());
    };

    window.addEventListener("teamflow_theme_update", syncTheme);
    window.addEventListener("storage", syncTheme);

    let mq = null;
    let mqHandler = null;
    if (typeof window !== "undefined" && window.matchMedia) {
      mq = window.matchMedia("(prefers-color-scheme: dark)");
      mqHandler = () => {
        if (localStorage.getItem("teamflow_theme_mode") === "system") {
          syncTheme();
        }
      };
      mq.addEventListener("change", mqHandler);
    }

    return () => {
      window.removeEventListener("teamflow_theme_update", syncTheme);
      window.removeEventListener("storage", syncTheme);
      if (mq && mqHandler) {
        mq.removeEventListener("change", mqHandler);
      }
    };
  }, []);

  // Synchronize root and body classes whenever theme state changes
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isDark) {
      document.documentElement.classList.add("dark", "sa-dark-mode", "dark-mode");
      document.body.classList.add("dark", "dark-theme", "sa-dark-mode", "dark-mode");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark", "sa-dark-mode", "dark-mode");
      document.body.classList.remove("dark", "dark-theme", "sa-dark-mode", "dark-mode");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDark]);

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
