import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UsersRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import loginLeftImage from "../../assets/images/login-left.png";

import {
  ROLES,
  ROLE_LABELS,
  getDashboardPath,
  getUserRole,
} from "../../auth/roleConfig";

import "./login.css";

/* =========================================================
   DEFAULT TEAMFLOW ROLE ACCOUNTS
========================================================= */

const DEFAULT_ROLE_USERS = [
  {
    id: "superadmin-001",
    name: "Super Admin",
    firstName: "Super",
    lastName: "Admin",
    email: "superadmin@teamflow.local",
    password: "SuperAdmin@123",
    role: ROLES.SUPERADMIN,
    provider: "local",
    status: "active",
  },

  {
    id: "admin-001",
    name: "Admin",
    firstName: "Admin",
    lastName: "User",
    email: "admin@teamflow.local",
    password: "Admin@123",
    role: ROLES.ADMIN,
    provider: "local",
    status: "active",
  },

  {
    id: "teamlead-001",
    name: "Team Lead",
    firstName: "Team",
    lastName: "Lead",
    email: "teamlead@teamflow.local",
    password: "TeamLead@123",
    role: ROLES.TEAMLEAD,
    provider: "local",
    status: "active",
  },

  {
    id: "employee-001",
    name: "Employee",
    firstName: "Employee",
    lastName: "User",
    email: "employee@teamflow.local",
    password: "Employee@123",
    role: ROLES.EMPLOYEE,
    provider: "local",
    status: "active",
  },
];

/* =========================================================
   GET USERS
========================================================= */

const getUsers = () => {
  try {
    const users = JSON.parse(
      localStorage.getItem("teamflow_users") || "[]"
    );

    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error("Unable to read TeamFlow users:", error);
    return [];
  }
};

/* =========================================================
   INITIALIZE DEFAULT ROLE USERS
========================================================= */

const initializeDefaultUsers = () => {
  try {
    const existingUsers = getUsers();

    const mergedUsers = [...existingUsers];

    DEFAULT_ROLE_USERS.forEach((defaultUser) => {
      const index = mergedUsers.findIndex(
        (user) =>
          String(user.email || "")
            .trim()
            .toLowerCase() ===
          defaultUser.email.toLowerCase()
      );

      if (index === -1) {
        mergedUsers.push(defaultUser);
      } else {
        /*
          Update the fixed demo account while preserving
          any extra information already attached to it.
        */
        mergedUsers[index] = {
          ...mergedUsers[index],
          ...defaultUser,
        };
      }
    });

    localStorage.setItem(
      "teamflow_users",
      JSON.stringify(mergedUsers)
    );

    return mergedUsers;
  } catch (error) {
    console.error(
      "Unable to initialize TeamFlow users:",
      error
    );

    localStorage.setItem(
      "teamflow_users",
      JSON.stringify(DEFAULT_ROLE_USERS)
    );

    return DEFAULT_ROLE_USERS;
  }
};

/* =========================================================
   LOGIN COMPONENT
========================================================= */

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  /* -------------------------------------------------------
     SELECTED ROLE
  ------------------------------------------------------- */

  const selectedRole = location.state?.selectedRole;

  const validSelectedRole = Object.values(ROLES).includes(
    selectedRole
  )
    ? selectedRole
    : null;

  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [remember, setRemember] =
    useState(true);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================================================
     CREATE DEFAULT USERS WHEN LOGIN PAGE LOADS
  ========================================================= */

  useEffect(() => {
    initializeDefaultUsers();
  }, []);

  /* =========================================================
     OPTIONAL DEMO AUTO FILL

     This fills the credentials according to the role
     selected on ChooseRole.
  ========================================================= */

  useEffect(() => {
    if (!validSelectedRole) {
      return;
    }

    const users = initializeDefaultUsers();

    const selectedUser = users.find(
      (user) =>
        getUserRole(user) === validSelectedRole &&
        DEFAULT_ROLE_USERS.some(
          (demoUser) =>
            demoUser.email.toLowerCase() ===
            String(user.email || "").toLowerCase()
        )
    );

    if (selectedUser) {
      setEmail(selectedUser.email);
      setPassword(selectedUser.password);
    }
  }, [validSelectedRole]);

  /* =========================================================
     CLEAR ERROR WHEN USER TYPES
  ========================================================= */

  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [email, password]);

  /* =========================================================
     REDIRECT USER
  ========================================================= */

  const redirectUser = (user) => {
    const dashboardPath = getDashboardPath(user);

    console.log(
      "TeamFlow login successful:",
      user.role,
      dashboardPath
    );

    navigate(dashboardPath, {
      replace: true,
    });
  };

  /* =========================================================
     NORMAL EMAIL/PASSWORD LOGIN
  ========================================================= */

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email
      .trim()
      .toLowerCase();

    if (!cleanEmail || !password) {
      setError(
        "Please enter your email and password."
      );

      return;
    }

    /*
      Initialize first so our four default users
      definitely exist.
    */

    const users = initializeDefaultUsers();

    const user = users.find(
      (item) =>
        String(item.email || "")
          .trim()
          .toLowerCase() === cleanEmail
    );

    /* -------------------------------------------------------
       EMAIL CHECK
    ------------------------------------------------------- */

    if (!user) {
      setError(
        "Invalid email or password. Please check your credentials."
      );

      return;
    }

    /* -------------------------------------------------------
       PASSWORD CHECK
    ------------------------------------------------------- */

    if (user.password !== password) {
      setError(
        "Invalid email or password. Please check your credentials."
      );

      return;
    }

    /* -------------------------------------------------------
       NORMALIZE ROLE
    ------------------------------------------------------- */

    const normalizedUser = {
      ...user,
      role: getUserRole(user),
    };

    /* -------------------------------------------------------
       VERIFY SELECTED ROLE
    ------------------------------------------------------- */

    if (
      validSelectedRole &&
      normalizedUser.role !== validSelectedRole
    ) {
      setError(
        `This account belongs to the ${
          ROLE_LABELS[normalizedUser.role] ||
          normalizedUser.role
        } role. Please go back and select the correct role.`
      );

      return;
    }

    setLoading(true);

    /* -------------------------------------------------------
       UPDATE USER IN STORAGE
    ------------------------------------------------------- */

    const updatedUsers = users.map((item) =>
      String(item.email || "")
        .trim()
        .toLowerCase() === cleanEmail
        ? normalizedUser
        : item
    );

    localStorage.setItem(
      "teamflow_users",
      JSON.stringify(updatedUsers)
    );

    /* -------------------------------------------------------
       SAVE CURRENT USER
    ------------------------------------------------------- */

    const loggedInUser = {
      ...normalizedUser,
      loggedIn: true,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem(
      "teamflow_current_user",
      JSON.stringify(loggedInUser)
    );

    /* -------------------------------------------------------
       REMEMBER LOGIN
    ------------------------------------------------------- */

    if (remember) {
      localStorage.setItem(
        "teamflow_remember",
        "1"
      );

      localStorage.setItem(
        "teamflow_remembered_email",
        normalizedUser.email
      );

      localStorage.setItem(
        "teamflow_remembered_role",
        normalizedUser.role
      );
    } else {
      localStorage.removeItem(
        "teamflow_remember"
      );

      localStorage.removeItem(
        "teamflow_remembered_email"
      );

      localStorage.removeItem(
        "teamflow_remembered_role"
      );
    }

    /* -------------------------------------------------------
       REDIRECT
    ------------------------------------------------------- */

    setTimeout(() => {
      setLoading(false);
      redirectUser(loggedInUser);
    }, 400);
  };

  /* =========================================================
     SOCIAL LOGIN
  ========================================================= */

  const handleSocialLogin = (type) => {
    setError("");

    if (
      validSelectedRole &&
      validSelectedRole !== ROLES.EMPLOYEE
    ) {
      setError(
        "Demo Google/GitHub accounts use the Employee role. Please go back and select Employee."
      );

      return;
    }

    const socialEmail =
      type === "google"
        ? "google.user@teamflow.local"
        : "github.user@teamflow.local";

    let users = initializeDefaultUsers();

    let user = users.find(
      (item) =>
        String(item.email || "")
          .toLowerCase() === socialEmail
    );

    if (!user) {
      user = {
        id:
          window.crypto?.randomUUID?.() ||
          Date.now().toString(),

        name:
          type === "google"
            ? "Google User"
            : "GitHub User",

        firstName:
          type === "google"
            ? "Google"
            : "GitHub",

        lastName: "User",

        email: socialEmail,

        password: "social-login",

        provider: type,

        role: ROLES.EMPLOYEE,

        status: "active",
      };

      users.push(user);
    } else {
      user = {
        ...user,
        role: ROLES.EMPLOYEE,
      };

      users = users.map((item) =>
        String(item.email || "")
          .toLowerCase() === socialEmail
          ? user
          : item
      );
    }

    localStorage.setItem(
      "teamflow_users",
      JSON.stringify(users)
    );

    localStorage.setItem(
      "teamflow_current_user",
      JSON.stringify({
        ...user,
        loggedIn: true,
        loginTime: new Date().toISOString(),
      })
    );

    localStorage.setItem(
      "teamflow_remember",
      "1"
    );

    redirectUser(user);
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="login-page">

      {/* LEFT IMAGE SECTION */}

      <section className="login-left">

        <img
          src={loginLeftImage}
          alt="TeamFlow AI team collaboration"
          className="login-left-image"
        />

      </section>

      {/* RIGHT LOGIN SECTION */}

      <main className="login-right">

        <div className="login-card">

          {/* LOGO */}

          <button
            type="button"
            className="login-brand"
            onClick={() => navigate("/")}
            aria-label="Go to TeamFlow AI home"
          >

            <div className="login-logo">
              <UsersRound size={24} />
            </div>

            <span>
              TeamFlow <strong>AI</strong>
            </span>

          </button>

          {/* HEADING */}

          <div className="login-heading">

            <h1>Welcome Back</h1>

            <p>
              {validSelectedRole
                ? `Sign in as ${
                    ROLE_LABELS[
                      validSelectedRole
                    ] || validSelectedRole
                  } to continue to your TeamFlow AI workspace.`
                : "Sign in to continue to your TeamFlow AI workspace."}
            </p>

          </div>

          {/* SOCIAL LOGIN */}

          <div className="login-social-row">

            <button
              type="button"
              className="login-social-button"
              onClick={() =>
                handleSocialLogin("google")
              }
              disabled={loading}
            >

              <span className="google-logo">
                G
              </span>

              <span>
                Continue with Google
              </span>

            </button>

            <button
              type="button"
              className="login-social-button"
              onClick={() =>
                handleSocialLogin("github")
              }
              disabled={loading}
            >

              <svg
                className="github-logo"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M12 .7a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.5c1.02 0 2.04.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.3c0 .32.22.7.82.58A12 12 0 0 0 12 .7Z"
                />
              </svg>

              <span>
                Continue with GitHub
              </span>

            </button>

          </div>

          {/* DIVIDER */}

          <div className="login-divider">

            <span />

            <p>
              OR CONTINUE WITH EMAIL
            </p>

            <span />

          </div>

          {/* FORM */}

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* EMAIL */}

            <div className="login-form-group">

              <label htmlFor="login-email">
                Email Address
              </label>

              <div className="login-input-wrapper">

                <Mail
                  size={19}
                  className="login-input-icon"
                />

                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="login-form-group">

              <label htmlFor="login-password">
                Password
              </label>

              <div className="login-input-wrapper">

                <Lock
                  size={19}
                  className="login-input-icon"
                />

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}

                </button>

              </div>

            </div>

            {/* OPTIONS */}

            <div className="login-options">

              <label className="login-remember">

                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) =>
                    setRemember(
                      e.target.checked
                    )
                  }
                />

                <span>
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="login-forgot"
                onClick={() =>
                  alert(
                    "Password reset functionality will be added later."
                  )
                }
              >
                Forgot password?
              </button>

            </div>

            {/* ERROR */}

            {error && (
              <div
                className="login-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* LOGIN */}

            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
            >

              {loading
                ? "Signing In..."
                : "Sign In"}

            </button>

          </form>

          {/* SIGNUP */}

          <p className="login-signup-text">

            Don&apos;t have an account?

            <button
              type="button"
              onClick={() =>
                navigate("/choose-role", {
                  state: {
                    next: "signup",
                  },
                })
              }
            >
              Sign up
            </button>

          </p>

          {/* BACK HOME */}

          <button
            type="button"
            className="login-back-home"
            onClick={() =>
              navigate("/")
            }
          >
            ← Back to TeamFlow AI
          </button>

        </div>

      </main>

    </div>
  );
}

export default Login;