// Helper utilities for Employee dashboard session, user profile, and theme

export const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop";

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
      savedSettingsProfile?.fullName?.split(" ")[0] ||
      (user?.name ? user.name.split(" ")[0] : null) ||
      (user?.firstName ? user.firstName : null) ||
      settings?.profile?.firstName ||
      "John";

    const lastName =
      savedSettingsProfile?.fullName?.split(" ").slice(1).join(" ") ||
      (user?.name ? user.name.split(" ").slice(1).join(" ") : null) ||
      (user?.lastName ? user.lastName : null) ||
      settings?.profile?.lastName ||
      "Doe";

    const fullName =
      savedSettingsProfile?.fullName ||
      (user?.name ? user.name : null) ||
      `${firstName} ${lastName}`.trim() ||
      "John Doe";

    const email =
      savedSettingsProfile?.email ||
      user?.email ||
      settings?.profile?.email ||
      "john.doe@teamflow.com";

    const photo =
      savedSettingsProfile?.avatar ||
      user?.photo ||
      settings?.profile?.photo ||
      DEFAULT_AVATAR;

    const initials =
      ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "JD";

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
      department: savedSettingsProfile?.department || "Development",
      location: savedSettingsProfile?.location || "Pune, India",
    };
  } catch {
    return {
      fullName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@teamflow.com",
      photo: DEFAULT_AVATAR,
      initials: "JD",
      role: "Employee",
      department: "Development",
      location: "Pune, India",
    };
  }
}

export function setEmployeeProfile(updatedProfile) {
  try {
    const current = getEmployeeProfile();
    const merged = { ...current, ...updatedProfile };

    const first = merged.firstName || merged.fullName.split(" ")[0] || "John";
    const last = merged.lastName || merged.fullName.split(" ").slice(1).join(" ") || "Doe";
    merged.firstName = first;
    merged.lastName = last;
    merged.initials = ((first[0] || "") + (last[0] || "")).toUpperCase() || "JD";
    if (!merged.photo) merged.photo = DEFAULT_AVATAR;

    // 1. tf_settings_profile_v2
    const settingsProfile = {
      fullName: merged.fullName,
      email: merged.email,
      role: merged.role,
      department: merged.department || "Development",
      location: merged.location || "Pune, India",
      avatar: merged.photo,
      status: merged.status || "Active",
      memberSince: merged.memberSince || "Oct 10, 2024",
    };
    localStorage.setItem("tf_settings_profile_v2", JSON.stringify(settingsProfile));

    // 2. teamflow_current_user
    const currentUser = {
      name: merged.fullName,
      email: merged.email,
      role: merged.role,
      photo: merged.photo,
    };
    localStorage.setItem("teamflow_current_user", JSON.stringify(currentUser));

    // 3. teamflow-settings
    try {
      const settingsStr = localStorage.getItem("teamflow-settings");
      const settings = settingsStr ? JSON.parse(settingsStr) : {};
      if (!settings.profile) settings.profile = {};
      settings.profile.firstName = first;
      settings.profile.lastName = last;
      settings.profile.email = merged.email;
      settings.profile.photo = merged.photo;
      settings.profile.jobTitle = merged.role;
      localStorage.setItem("teamflow-settings", JSON.stringify(settings));
    } catch (err) {
      void err;
    }

    // Broadcast across all tabs and components
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("tf_profile_updated", { detail: merged }));
    return merged;
  } catch (err) {
    console.error("Failed to set employee profile:", err);
    return updatedProfile;
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

    try {
      const appSaved = localStorage.getItem("tf_settings_appearance_v2");
      if (appSaved) {
        const appObj = JSON.parse(appSaved);
        appObj.theme = normalizedTheme;
        localStorage.setItem("tf_settings_appearance_v2", JSON.stringify(appObj));
      }
    } catch {}

    document.documentElement.setAttribute("data-theme", normalizedTheme);
    window.dispatchEvent(new CustomEvent("tf_theme_change", { detail: normalizedTheme }));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Failed to set theme:", err);
  }
}

export function getEmployeeFontSize() {
  try {
    const saved = localStorage.getItem("teamflow_font_size");
    if (saved && ["Small", "Medium", "Large"].includes(saved)) return saved;

    const appSaved = localStorage.getItem("tf_settings_appearance_v2");
    if (appSaved) {
      const parsed = JSON.parse(appSaved);
      if (parsed.fontSize && ["Small", "Medium", "Large"].includes(parsed.fontSize)) {
        return parsed.fontSize;
      }
    }
  } catch {}
  return "Medium";
}

export function applyEmployeeFontSize(size) {
  try {
    const s = size || getEmployeeFontSize() || "Medium";
    const lower = s.toLowerCase();
    document.documentElement.setAttribute("data-font-size", lower);
    if (lower === "small") {
      document.documentElement.style.fontSize = "13px";
    } else if (lower === "large") {
      document.documentElement.style.fontSize = "16px";
    } else {
      document.documentElement.style.fontSize = "14px";
    }
  } catch (err) {
    console.error("Failed to apply font size:", err);
  }
}

export function setEmployeeFontSize(size) {
  try {
    const s = ["Small", "Medium", "Large"].includes(size) ? size : "Medium";
    localStorage.setItem("teamflow_font_size", s);

    try {
      const appSaved = localStorage.getItem("tf_settings_appearance_v2");
      const appObj = appSaved ? JSON.parse(appSaved) : {};
      appObj.fontSize = s;
      localStorage.setItem("tf_settings_appearance_v2", JSON.stringify(appObj));
    } catch {}

    applyEmployeeFontSize(s);
    window.dispatchEvent(new CustomEvent("tf_font_size_change", { detail: s }));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Failed to set font size:", err);
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
    navigate("/choose-role", { replace: true });
  } else {
    window.location.href = "/login";
  }
}

function hexToRgba(hex, alpha) {
  let c = (hex || "#6366F1").replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function adjustHex(hex, percent) {
  let c = (hex || "#6366F1").replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 255) + percent;
  let b = (num & 255) + percent;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function getEmployeePrimaryColor() {
  try {
    const saved = localStorage.getItem("teamflow_primary_color");
    if (saved && saved.startsWith("#")) return saved;

    const appSaved = localStorage.getItem("tf_settings_appearance_v2");
    if (appSaved) {
      const parsed = JSON.parse(appSaved);
      if (parsed.primaryColor && parsed.primaryColor.startsWith("#")) {
        return parsed.primaryColor;
      }
    }
  } catch {}
  return "#6366F1";
}

export function applyEmployeePrimaryColor(color) {
  try {
    const hex = color || getEmployeePrimaryColor() || "#6366F1";
    const hover = adjustHex(hex, -20);
    const active = adjustHex(hex, -40);
    const light = hexToRgba(hex, 0.12);
    const border = hexToRgba(hex, 0.35);
    const glow = hexToRgba(hex, 0.28);

    const root = document.documentElement;
    root.style.setProperty("--tf-primary", hex);
    root.style.setProperty("--tf-primary-hover", hover);
    root.style.setProperty("--tf-primary-active", active);
    root.style.setProperty("--tf-primary-light", light);
    root.style.setProperty("--tf-primary-border", border);
    root.style.setProperty("--tf-primary-glow", glow);
    root.style.setProperty("--tf-brand", hex);
  } catch (err) {
    console.error("Failed to apply primary color:", err);
  }
}

export function setEmployeePrimaryColor(color) {
  try {
    const hex = color || "#6366F1";
    localStorage.setItem("teamflow_primary_color", hex);

    try {
      const appSaved = localStorage.getItem("tf_settings_appearance_v2");
      const appObj = appSaved ? JSON.parse(appSaved) : {};
      appObj.primaryColor = hex;
      localStorage.setItem("tf_settings_appearance_v2", JSON.stringify(appObj));
    } catch {}

    applyEmployeePrimaryColor(hex);
    window.dispatchEvent(new CustomEvent("tf_primary_color_change", { detail: hex }));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Failed to set primary color:", err);
  }
}
