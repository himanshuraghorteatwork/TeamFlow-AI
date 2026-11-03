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
      ((firstName?.[0] || "") + (lastName?.[0] || firstName?.[1] || "")).toUpperCase() || "JD";

    // Standardize role to valid role (not stale Product Manager)
    let role = "Employee";
    const rawRole = savedSettingsProfile?.role || user?.role || settings?.profile?.jobTitle;
    if (rawRole && rawRole.toLowerCase() !== "product manager") {
      role = rawRole;
    } else {
      role = "Employee";
    }

    const phoneNumber =
      savedSettingsProfile?.phoneNumber ||
      settings?.profile?.phoneNumber ||
      user?.phoneNumber ||
      "+91 98765 43210";

    const department =
      savedSettingsProfile?.department ||
      settings?.profile?.department ||
      "Development";

    const location =
      savedSettingsProfile?.location ||
      settings?.profile?.location ||
      "Pune, India";

    const status =
      savedSettingsProfile?.status ||
      settings?.profile?.status ||
      "Active";

    const memberSince =
      savedSettingsProfile?.memberSince ||
      settings?.profile?.memberSince ||
      "Oct 10, 2024";

    return {
      fullName,
      firstName,
      lastName,
      email,
      phoneNumber,
      photo,
      avatar: photo,
      initials,
      role,
      department,
      location,
      status,
      memberSince,
    };
  } catch {
    return {
      fullName: "John Doe",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@teamflow.com",
      phoneNumber: "+91 98765 43210",
      photo: DEFAULT_AVATAR,
      avatar: DEFAULT_AVATAR,
      initials: "JD",
      role: "Employee",
      department: "Development",
      location: "Pune, India",
      status: "Active",
      memberSince: "Oct 10, 2024",
    };
  }
}

export function setEmployeeProfile(updatedProfile) {
  try {
    const current = getEmployeeProfile();
    const merged = { ...current, ...updatedProfile };

    // Accurately compute firstName and lastName if fullName is provided
    let first, last;
    if (updatedProfile && updatedProfile.fullName) {
      const parts = updatedProfile.fullName.trim().split(/\s+/);
      first = parts[0] || "John";
      last = parts.slice(1).join(" ") || "";
    } else {
      first = merged.firstName || merged.fullName.split(" ")[0] || "John";
      last = merged.lastName || merged.fullName.split(" ").slice(1).join(" ") || "Doe";
    }

    const fullName = updatedProfile && updatedProfile.fullName
      ? updatedProfile.fullName.trim()
      : `${first} ${last}`.trim() || "John Doe";

    const initials =
      (((first?.[0] || "") + (last?.[0] || first?.[1] || "")).toUpperCase()) || "JD";

    const photo = updatedProfile?.photo || updatedProfile?.avatar || merged.photo || DEFAULT_AVATAR;
    const phoneNumber = updatedProfile?.phoneNumber || merged.phoneNumber || "+91 98765 43210";
    const role = updatedProfile?.role || merged.role || "Employee";
    const department = updatedProfile?.department || merged.department || "Development";
    const location = updatedProfile?.location || merged.location || "Pune, India";
    const email = updatedProfile?.email || merged.email || "john.doe@teamflow.com";
    const status = updatedProfile?.status || merged.status || "Active";
    const memberSince = updatedProfile?.memberSince || merged.memberSince || "Oct 10, 2024";

    const finalProfile = {
      fullName,
      firstName: first,
      lastName: last,
      email,
      phoneNumber,
      role,
      department,
      location,
      photo,
      avatar: photo,
      initials,
      status,
      memberSince,
    };

    // 1. tf_settings_profile_v2
    const settingsProfile = {
      fullName,
      email,
      phoneNumber,
      role,
      department,
      location,
      avatar: photo,
      status,
      memberSince,
    };
    localStorage.setItem("tf_settings_profile_v2", JSON.stringify(settingsProfile));

    // 2. teamflow_current_user
    const currentUser = {
      name: fullName,
      email,
      role,
      photo,
      phoneNumber,
      jobTitle: role,
    };
    localStorage.setItem("teamflow_current_user", JSON.stringify(currentUser));

    // 3. teamflow-settings
    try {
      const settingsStr = localStorage.getItem("teamflow-settings");
      const settings = settingsStr ? JSON.parse(settingsStr) : {};
      if (!settings.profile) settings.profile = {};
      settings.profile.firstName = first;
      settings.profile.lastName = last;
      settings.profile.email = email;
      settings.profile.photo = photo;
      settings.profile.jobTitle = role;
      settings.profile.department = department;
      settings.profile.location = location;
      settings.profile.phoneNumber = phoneNumber;
      localStorage.setItem("teamflow-settings", JSON.stringify(settings));
    } catch (err) {
      void err;
    }

    // Broadcast across all tabs and components
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("tf_profile_updated", { detail: finalProfile }));
    return finalProfile;
  } catch (err) {
    console.error("Failed to set employee profile:", err);
    return updatedProfile;
  }
}

export function getSystemPreferredTheme() {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

export function getEmployeeThemeMode() {
  try {
    // 1. Check direct theme mode key
    const mode = localStorage.getItem("teamflow_theme_mode");
    if (mode === "system" || mode === "dark" || mode === "light") {
      return mode;
    }

    // 2. Check appearance settings v2
    const appSaved = localStorage.getItem("tf_settings_appearance_v2");
    if (appSaved) {
      try {
        const appObj = JSON.parse(appSaved);
        if (appObj?.theme && ["system", "dark", "light"].includes(appObj.theme)) {
          return appObj.theme;
        }
      } catch {}
    }

    // 3. Check teamflow-settings
    const settingsStr = localStorage.getItem("teamflow-settings");
    if (settingsStr) {
      try {
        const settings = JSON.parse(settingsStr);
        if (settings?.appearance?.theme && ["system", "dark", "light"].includes(settings.appearance.theme)) {
          return settings.appearance.theme;
        }
      } catch {}
    }

    // Default to light
    return "light";
  } catch {
    return "light";
  }
}

export function getEmployeeTheme() {
  try {
    const mode = getEmployeeThemeMode();
    if (mode === "system") {
      return getSystemPreferredTheme();
    }
    if (mode === "dark" || mode === "light") {
      return mode;
    }

    // 1. Check teamflow_theme
    const tfTheme = localStorage.getItem("teamflow_theme");
    if (tfTheme === "dark" || tfTheme === "light") {
      return tfTheme;
    }

    // 2. Check SuperAdmin sync keys
    const saDark = localStorage.getItem("teamflow_superadmin_dark_mode");
    if (saDark === "true") return "dark";
    if (saDark === "false") return "light";

    const adminDark = localStorage.getItem("teamflow_admin_dark");
    if (adminDark === "true") return "dark";
    if (adminDark === "false") return "light";

    // 3. Check tf_dark legacy key
    const tfDark = localStorage.getItem("tf_dark");
    if (tfDark !== null) {
      return tfDark === "true" ? "dark" : "light";
    }

    // 4. Check active DOM classes
    if (typeof document !== "undefined") {
      if (
        document.body.classList.contains("sa-dark-mode") ||
        document.body.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"
      ) {
        return "dark";
      }
    }

    // Default to light mode
    return "light";
  } catch {
    return "light";
  }
}

export function setEmployeeTheme(themeOrMode) {
  try {
    const mode = ["system", "dark", "light"].includes(themeOrMode) ? themeOrMode : "light";
    const effectiveTheme = mode === "system" ? getSystemPreferredTheme() : mode;
    const isDark = effectiveTheme === "dark";

    // Persist mode and effective theme
    localStorage.setItem("teamflow_theme_mode", mode);
    localStorage.setItem("teamflow_theme", effectiveTheme);
    localStorage.setItem("tf_dark", isDark ? "true" : "false");
    localStorage.setItem("teamflow_superadmin_dark_mode", String(isDark));
    localStorage.setItem("teamflow_admin_dark", String(isDark));

    const settingsStr = localStorage.getItem("teamflow-settings");
    if (settingsStr) {
      try {
        const settings = JSON.parse(settingsStr);
        if (!settings.appearance) settings.appearance = {};
        settings.appearance.theme = mode;
        localStorage.setItem("teamflow-settings", JSON.stringify(settings));
      } catch (err) {
        void err;
      }
    }

    try {
      const appSaved = localStorage.getItem("tf_settings_appearance_v2");
      if (appSaved) {
        const appObj = JSON.parse(appSaved);
        appObj.theme = mode;
        localStorage.setItem("tf_settings_appearance_v2", JSON.stringify(appObj));
      }
    } catch {}

    // Apply classes to both body and documentElement
    if (typeof document !== "undefined") {
      document.body.classList.toggle("sa-dark-mode", isDark);
      document.body.classList.toggle("tf-dark", isDark);
      document.body.classList.toggle("dark", isDark);
      document.body.classList.toggle("dark-mode", isDark);
      document.body.classList.toggle("dark-theme", isDark);
      document.documentElement.classList.toggle("sa-dark-mode", isDark);
      document.documentElement.classList.toggle("tf-dark", isDark);
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.setAttribute("data-theme", effectiveTheme);
      document.documentElement.setAttribute("data-theme-mode", mode);
    }

    window.dispatchEvent(new CustomEvent("tf_theme_change", { detail: effectiveTheme }));
    window.dispatchEvent(new CustomEvent("tf_theme_mode_change", { detail: mode }));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("teamflow_theme_update"));
  } catch (err) {
    console.error("Failed to set theme:", err);
  }
}

// Auto-sync when OS system preference changes (e.g. user toggles dark mode in Windows/macOS)
if (typeof window !== "undefined" && window.matchMedia) {
  try {
    const sysMatcher = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = () => {
      const currentMode = getEmployeeThemeMode();
      if (currentMode === "system") {
        setEmployeeTheme("system");
      }
    };
    if (sysMatcher.addEventListener) {
      sysMatcher.addEventListener("change", onSystemThemeChange);
    } else if (sysMatcher.addListener) {
      sysMatcher.addListener(onSystemThemeChange);
    }
  } catch (e) {
    void e;
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
