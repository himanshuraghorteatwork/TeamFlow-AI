
import { useState } from "react";
import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar.jsx";
import "./SuperAdminLayout.css";

function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="superadmin-layout">
      <SuperAdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {sidebarOpen && (
        <button
          type="button"
          className="superadmin-sidebar-overlay"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="superadmin-main">
        <header className="superadmin-topbar">
          <button
            type="button"
            className="superadmin-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>

          <div className="superadmin-breadcrumb">
            <span>TeamFlow AI</span>
            <span className="superadmin-breadcrumb-divider">/</span>
            <strong>Super Admin</strong>
          </div>

          <div className="superadmin-topbar-actions">
            <span className="superadmin-role-badge">
              Platform Owner
            </span>

            <div className="superadmin-avatar" title="Super Admin">
              SA
            </div>
          </div>
        </header>

        <main className="superadmin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SuperAdminLayout;
