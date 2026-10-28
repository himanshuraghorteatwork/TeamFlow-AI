import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserRound,
  Settings,
  Palette,
  Bell,
  ShieldCheck,
  Building2,
} from "lucide-react";
import "./AdminSettingsNavTabs.css";

const SETTINGS_TABS = [
  {
    id: "profile",
    label: "Profile",
    path: "/admin/profile",
    icon: UserRound,
  },
  {
    id: "account",
    label: "Account",
    path: "/admin/account-settings",
    icon: Settings,
  },
  {
    id: "appearance",
    label: "Appearance",
    path: "/admin/appearance",
    icon: Palette,
  },
  {
    id: "notifications",
    label: "Notifications",
    path: "/admin/notifications",
    icon: Bell,
  },
  {
    id: "security",
    label: "Security",
    path: "/admin/security",
    icon: ShieldCheck,
  },
  {
    id: "organization",
    label: "Organization Settings",
    path: "/admin/settings",
    icon: Building2,
  },
];

export default function AdminSettingsNavTabs({ activeTab }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isTabActive = (tab) => {
    if (activeTab) {
      if (tab.id === activeTab) return true;
      if (activeTab === "settings" && tab.id === "organization") return true;
      if (activeTab === "account-settings" && tab.id === "account") return true;
    }
    const current = (location?.pathname || "").toLowerCase();
    if (tab.path === current) return true;
    if (
      tab.id === "organization" &&
      (current.startsWith("/admin/settings") || current.startsWith("/admin/organization"))
    ) {
      return true;
    }
    if (tab.id === "account" && current.startsWith("/admin/account")) {
      return true;
    }
    return false;
  };

  return (
    <nav className="tfAdminSettings__moduleTabs" aria-label="Settings Module Navigation">
      {SETTINGS_TABS.map((tab) => {
        const Icon = tab.icon;
        const active = isTabActive(tab);
        return (
          <button
            key={tab.id}
            type="button"
            className={`tfAdminSettings__moduleTab ${
              active ? "tfAdminSettings__moduleTab--active" : ""
            }`}
            onClick={() => navigate(tab.path)}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={14} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
