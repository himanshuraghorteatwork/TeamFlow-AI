// Helper utilities for Employee dashboard session, user profile, and theme

export function getEmployeeProfile() {
  try {
    const settings = JSON.parse(
      localStorage.getItem("teamflow-settings") || "null"
    );
    const user = JSON.parse(
      localStorage.getItem("teamflow_current_user") || "null"
    );
    const savedSettingsProfile = JSON.parse(
      localStorage.getItem("tf_settings_profile_v2") || "null"
    );

    const firstName =
      (user?.name ? user.name.split(" ")[0] : null) ||
      (user?.firstName ? user.firstName : null) ||
      savedSettingsProfile?.fullName?.split(" ")[0] ||
      settings?.profile?.firstName ||
      "John";

    const lastName =
      (user?.name ? user.name.split(" ").slice(1).join(" ") : null) ||
      (user?.lastName ? user.lastName : null) ||
      savedSettingsProfile?.fullName?.split(" ").slice(1).join(" ") ||
      settings?.profile?.lastName ||
      "Doe";

    const fullName = savedSettingsProfile?.fullName || `${firstName} ${lastName}`.trim() || "John Doe";
    const email =
      savedSettingsProfile?.email ||
      user?.email ||
      settings?.profile?.email ||
      "john.doe@teamflow.com";

    const photo =
      savedSettingsProfile?.avatar ||
      user?.photo ||
      settings?.profile?.photo ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop";

    const initials = "JD";

    // Standardize role to "Employee" (not "Product Manager")
    let role = "Employee";
    const rawRole = savedSettingsProfile?.role || user?.role || settings?.profile?.jobTitle;
    if (rawRole && rawRole.toLowerCase() !== "product manager") {
      role = rawRole;
    } else {
      role = "Employee";
    }

    // Clean up any stale "Product Manager" in localStorage
    if (user && (user.role === "Product Manager" || user.jobTitle === "Product Manager")) {
      user.role = "Employee";
      try {
        localStorage.setItem("teamflow_current_user", JSON.stringify(user));
      } catch (err) {
        void err;
      }
    }
    if (settings?.profile && settings.profile.jobTitle === "Product Manager") {
      settings.profile.jobTitle = "Employee";
      try {
        localStorage.setItem("teamflow-settings", JSON.stringify(settings));
      } catch (err) {
        void err;
      }
    }
    if (savedSettingsProfile && savedSettingsProfile.role === "Product Manager") {
      savedSettingsProfile.role = "Employee";
      try {
        localStorage.setItem("tf_settings_profile_v2", JSON.stringify(savedSettingsProfile));
      } catch (err) {
        void err;
      }
    }

    return {
      fullName,
      firstName,
      lastName,
      email,
      photo,
      initials,
      role,
    };
  } catch {
    return {
      fullName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@teamflow.com",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
      initials: "JD",
      role: "Employee",
    };
  }
}

export function getEmployeeTheme() {
  try {
    // 1. Check teamflow_theme
    const tfTheme = localStorage.getItem("teamflow_theme");
    if (tfTheme === "dark" || tfTheme === "light") {
      return tfTheme;
    }

    // 2. Check tf_dark legacy key
    const tfDark = localStorage.getItem("tf_dark");
    if (tfDark !== null) {
      return tfDark === "true" ? "dark" : "light";
    }

    // 3. Check teamflow-settings appearance
    const settings = JSON.parse(
      localStorage.getItem("teamflow-settings") || "null"
    );
    if (settings?.appearance?.theme) {
      if (settings.appearance.theme === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return settings.appearance.theme === "dark" ? "dark" : "light";
    }

    // Default to light mode
    return "light";
  } catch {
    return "light";
  }
}

export function setEmployeeTheme(theme) {
  try {
    const isDark = theme === "dark";
    const normalizedTheme = isDark ? "dark" : "light";

    // Persist across localStorage keys
    localStorage.setItem("teamflow_theme", normalizedTheme);
    localStorage.setItem("tf_dark", isDark ? "true" : "false");

    const settingsStr = localStorage.getItem("teamflow-settings");
    if (settingsStr) {
      try {
        const settings = JSON.parse(settingsStr);
        if (!settings.appearance) settings.appearance = {};
        settings.appearance.theme = normalizedTheme;
        localStorage.setItem("teamflow-settings", JSON.stringify(settings));
      } catch (err) {
        void err;
      }
    }

    document.documentElement.setAttribute("data-theme", normalizedTheme);
    window.dispatchEvent(new CustomEvent("tf_theme_change", { detail: normalizedTheme }));
  } catch (err) {
    console.error("Failed to set theme:", err);
  }
}

export function handleEmployeeLogout(navigate) {
  try {
    localStorage.removeItem("teamflow_current_user");
    localStorage.removeItem("teamflow_remember");
    sessionStorage.clear();
  } catch (e) {
    console.error("Error clearing session:", e);
  }

  if (typeof navigate === "function") {
    navigate("/login", { replace: true });
  } else {
    window.location.href = "/login";
  }
}
