import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  UsersRound,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import signupLeftImage from "../../assets/images/signup-left.png";

import {
  ROLES,
  ROLE_LABELS,
  getDashboardPath,
} from "../../auth/roleConfig";

import "./Signup.css";

// ==========================================
// LOCAL STORAGE HELPERS
// ==========================================

const getUsers = () => {
  try {
    const users = JSON.parse(
      localStorage.getItem("teamflow_users") || "[]"
    );

    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(
    "teamflow_users",
    JSON.stringify(users)
  );
};

// ==========================================
// SIGNUP COMPONENT
// ==========================================

function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  // Read the role selected on the Choose Role page
  const selectedRole = location.state?.selectedRole;

  const validSelectedRole = Object.values(ROLES).includes(
    selectedRole
  )
    ? selectedRole
    : ROLES.EMPLOYEE;

  const selectedRoleLabel =
    ROLE_LABELS[validSelectedRole];

  // ==========================================
  // FORM STATE
  // ==========================================

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [terms, setTerms] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // ROLE VALIDATION
  // ==========================================

  const isPublicSignupAllowed =
    validSelectedRole === ROLES.EMPLOYEE;

  // ==========================================
  // NORMAL SIGNUP
  // ==========================================

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    // Public signup must not grant administrative privileges.
    // Admin accounts should be created through an authorized
    // invitation or administrator-controlled process.
    if (!isPublicSignupAllowed) {
      setError(
        `${selectedRoleLabel} accounts cannot be created through public signup. Please contact your organization administrator for access.`
      );
      return;
    }

    const cleanFirst = first.trim();
    const cleanLast = last.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Validate required fields
    if (
      !cleanFirst ||
      !cleanLast ||
      !cleanEmail ||
      !password ||
      !confirm
    ) {
      setError("Please fill in all fields.");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    // Validate password confirmation
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    // Validate terms acceptance
    if (!terms) {
      setError(
        "Please accept the Terms of Service and Privacy Policy."
      );
      return;
    }

    const users = getUsers();

    // Prevent duplicate accounts
    const userExists = users.some(
      (user) =>
        user.email?.toLowerCase() === cleanEmail
    );

    if (userExists) {
      setError(
        "An account with this email already exists."
      );
      return;
    }

    // Create the new Employee account
    const user = {
      id:
        window.crypto?.randomUUID?.() ||
        Date.now().toString(),

      name: `${cleanFirst} ${cleanLast}`,
      firstName: cleanFirst,
      lastName: cleanLast,
      email: cleanEmail,
      password,
      role: ROLES.EMPLOYEE,
    };

    setLoading(true);

    try {
      // Save the registered account
      users.push(user);
      saveUsers(users);

      // Save the current logged-in user
      localStorage.setItem(
        "teamflow_current_user",
        JSON.stringify(user)
      );

      localStorage.setItem("teamflow_remember", "1");

      // Redirect according to the assigned role
      setTimeout(() => {
        navigate(getDashboardPath(user), {
          replace: true,
        });
      }, 400);
    } catch {
      setLoading(false);
      setError(
        "Unable to create your account. Please try again."
      );
    }
  };

  // ==========================================
  // SOCIAL SIGNUP
  // ==========================================

  const handleSocialSignup = (type) => {
    setError("");

    // Demo social signup is available only to Employees.
    if (!isPublicSignupAllowed) {
      setError(
        `${selectedRoleLabel} accounts require authorization. Please contact your organization administrator.`
      );
      return;
    }

    const socialEmail =
      type === "google"
        ? "google.user@teamflow.local"
        : "github.user@teamflow.local";

    let users = getUsers();

    let user = users.find(
      (existingUser) =>
        existingUser.email?.toLowerCase() ===
        socialEmail.toLowerCase()
    );

    if (!user) {
      // Create a demo social account
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
      };

      users.push(user);
    } else {
      // Ensure the demo account uses the Employee role
      user = {
        ...user,
        role: ROLES.EMPLOYEE,
      };

      users = users.map((existingUser) =>
        existingUser.email?.toLowerCase() ===
        socialEmail.toLowerCase()
          ? user
          : existingUser
      );
    }

    try {
      saveUsers(users);

      localStorage.setItem(
        "teamflow_current_user",
        JSON.stringify(user)
      );

      localStorage.setItem("teamflow_remember", "1");

      navigate(getDashboardPath(user), {
        replace: true,
      });
    } catch {
      setError(
        "Unable to complete signup. Please try again."
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="signup-page">
      {/* LEFT ILLUSTRATION */}
      <section className="signup-visual">
        <img
          src={signupLeftImage}
          alt="TeamFlow AI workspace collaboration"
          className="signup-visual-image"
        />
      </section>

      {/* RIGHT SIDE */}
      <main className="signup-form-section">
        <div className="signup-container">
          {/* TEAMFLOW LOGO */}
          <button
            type="button"
            className="signup-brand"
            onClick={() => navigate("/")}
            aria-label="Go to TeamFlow AI home"
          >
            <span className="signup-brand-icon">
              <UsersRound size={24} />
            </span>

            <span className="signup-brand-name">
              TeamFlow <strong>AI</strong>
            </span>
          </button>

          {/* HEADING */}
          <div className="signup-heading">
            <h1>Create Your Account</h1>

            <p>
              Join TeamFlow AI and start
              collaborating with your team.
            </p>

            {validSelectedRole && (
              <p>
                Selected role: <strong>{selectedRoleLabel}</strong>
              </p>
            )}
          </div>

          {/* SIGNUP FORM */}
          <form
            className="signup-form"
            onSubmit={handleSignup}
          >
            {/* FIRST + LAST NAME */}
            <div className="signup-name-row">
              {/* FIRST NAME */}
              <div className="signup-field">
                <label htmlFor="first-name">
                  First Name
                </label>

                <div className="signup-input">
                  <User size={19} />

                  <input
                    id="first-name"
                    type="text"
                    value={first}
                    onChange={(e) =>
                      setFirst(e.target.value)
                    }
                    placeholder="John"
                    autoComplete="given-name"
                    required
                  />
                </div>
              </div>

              {/* LAST NAME */}
              <div className="signup-field">
                <label htmlFor="last-name">
                  Last Name
                </label>

                <div className="signup-input">
                  <User size={19} />

                  <input
                    id="last-name"
                    type="text"
                    value={last}
                    onChange={(e) =>
                      setLast(e.target.value)
                    }
                    placeholder="Doe"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* EMAIL */}
            <div className="signup-field">
              <label htmlFor="signup-email">
                Work Email
              </label>

              <div className="signup-input">
                <Mail size={19} />

                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="john@company.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="signup-field">
              <label htmlFor="signup-password">
                Password
              </label>

              <div className="signup-input">
                <Lock size={19} />

                <input
                  id="signup-password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="signup-eye-button"
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

            {/* CONFIRM PASSWORD */}
            <div className="signup-field">
              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <div className="signup-input">
                <Lock size={19} />

                <input
                  id="confirm-password"
                  type={
                    showConfirm ? "text" : "password"
                  }
                  value={confirm}
                  onChange={(e) =>
                    setConfirm(e.target.value)
                  }
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="signup-eye-button"
                  onClick={() =>
                    setShowConfirm(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showConfirm
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirm ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* TERMS */}
            <label className="signup-terms">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) =>
                  setTerms(e.target.checked)
                }
              />

              <span className="signup-checkbox">
                ✓
              </span>

              <span>
                I agree to the{" "}

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Terms of Service page will be added later."
                    )
                  }
                >
                  Terms of Service
                </button>

                {" "}and{" "}

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      "Privacy Policy page will be added later."
                    )
                  }
                >
                  Privacy Policy
                </button>
              </span>
            </label>

            {/* ERROR */}
            {error && (
              <div
                className="signup-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* CREATE ACCOUNT */}
            <button
              type="submit"
              className="signup-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="signup-divider">
            <span></span>
            <p>OR SIGN UP WITH</p>
            <span></span>
          </div>

          {/* SOCIAL SIGNUP */}
          <div className="signup-social-row">
            {/* GOOGLE */}
            <button
              type="button"
              className="signup-social-button"
              onClick={() =>
                handleSocialSignup("google")
              }
              disabled={loading}
            >
              <span className="signup-google">
                G
              </span>

              <span>Continue with Google</span>
            </button>

            {/* GITHUB */}
            <button
              type="button"
              className="signup-social-button"
              onClick={() =>
                handleSocialSignup("github")
              }
              disabled={loading}
            >
              <svg
                className="signup-github"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M12 .7a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.5c1.02 0 2.04.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.3c0 .32.22.7.82.58A12 12 0 0 0 12 .7Z"
                />
              </svg>

              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* LOGIN */}
          <p className="signup-login-link">
            Already have an account?

            <button
              type="button"
              onClick={() =>
                navigate("/choose-role", {
                  state: { next: "login" },
                })
              }
            >
              Sign in
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Signup;