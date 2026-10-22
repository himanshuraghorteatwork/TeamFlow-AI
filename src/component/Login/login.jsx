import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UsersRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";


import loginLeftImage from "../../assets/images/login-left.png";
import "./login.css";



// ==========================================
// GET REGISTERED USERS
// ==========================================

const getUsers = () => {
  try {
    return JSON.parse(
      localStorage.getItem("teamflow_users") || "[]"
    );
  } catch {
    return [];
  }
};

function Login() {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

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

  // ==========================================
  // NORMAL EMAIL LOGIN
  // ==========================================

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail =
      email.trim().toLowerCase();

    // Basic validation
    if (!cleanEmail || !password) {
      setError(
        "Please enter your email and password."
      );

      return;
    }

    const users = getUsers();

    const user = users.find(
      (item) =>
        item.email?.toLowerCase() === cleanEmail
    );

    // Check credentials
    if (!user || user.password !== password) {
      setError(
        "Invalid email or password. Please create an account first."
      );

      return;
    }

    setLoading(true);

    // Store logged-in user
    localStorage.setItem(
      "teamflow_current_user",
      JSON.stringify(user)
    );

    // Remember login
    if (remember) {
      localStorage.setItem(
        "teamflow_remember",
        "1"
      );
    } else {
      localStorage.removeItem(
        "teamflow_remember"
      );
    }

    // Small loading effect
    setTimeout(() => {
      navigate("/dashboard");
    }, 400);
  };

  // ==========================================
  // DEMO SOCIAL LOGIN
  // ==========================================

  const handleSocialLogin = (type) => {
    const socialEmail =
      type === "google"
        ? "google.user@teamflow.local"
        : "github.user@teamflow.local";

    let users = getUsers();

    let user = users.find(
      (item) =>
        item.email === socialEmail
    );

    // Create demo social user
    if (!user) {
      user = {
        id:
          window.crypto?.randomUUID?.() ||
          Date.now().toString(),

        name:
          type === "google"
            ? "Google User"
            : "GitHub User",

        email: socialEmail,

        password: "social-login",

        provider: type,
      };

      users.push(user);

      localStorage.setItem(
        "teamflow_users",
        JSON.stringify(users)
      );
    }

    localStorage.setItem(
      "teamflow_current_user",
      JSON.stringify(user)
    );

    navigate("/dashboard");
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="login-page">

      {/* ======================================
          LEFT IMAGE SECTION
      ====================================== */}

      <section className="login-left">

        <img
          src={loginLeftImage}
          alt="TeamFlow AI team collaboration"
          className="login-left-image"
        />

      </section>


      {/* ======================================
          RIGHT LOGIN SECTION
      ====================================== */}

      <main className="login-right">

        <div className="login-card">

          {/* ==================================
              LOGO / BRAND
          ================================== */}

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


          {/* ==================================
              HEADING
          ================================== */}

          <div className="login-heading">

            <h1>
              Welcome Back
            </h1>

            <p>
              Sign in to continue to your
              TeamFlow AI workspace.
            </p>

          </div>


          {/* ==================================
              SOCIAL LOGIN
          ================================== */}

          <div className="login-social-row">

            {/* Google */}

            <button
              type="button"
              className="login-social-button"
              onClick={() =>
                handleSocialLogin("google")
              }
            >

              <span className="google-logo">
                G
              </span>

              <span>
                Continue with Google
              </span>

            </button>


            {/* GitHub */}

            <button
              type="button"
              className="login-social-button"
              onClick={() =>
                handleSocialLogin("github")
              }
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


          {/* ==================================
              DIVIDER
          ================================== */}

          <div className="login-divider">

            <span></span>

            <p>
              OR CONTINUE WITH EMAIL
            </p>

            <span></span>

          </div>


          {/* ==================================
              LOGIN FORM
          ================================== */}

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            {/* ================================
                EMAIL
            ================================= */}

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
                    setEmail(
                      e.target.value
                    )
                  }
                  autoComplete="email"
                />

              </div>

            </div>


            {/* ================================
                PASSWORD
            ================================= */}

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
                    setPassword(
                      e.target.value
                    )
                  }
                  autoComplete="current-password"
                />


                {/* Show / Hide Password */}

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
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


            {/* ================================
                REMEMBER / FORGOT PASSWORD
            ================================= */}

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


            {/* ================================
                ERROR MESSAGE
            ================================= */}

            {error && (

              <div
                className="login-error"
                role="alert"
              >

                {error}

              </div>

            )}


            {/* ================================
                LOGIN BUTTON
            ================================= */}

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


          {/* ==================================
              SIGNUP LINK
          ================================== */}

          <p className="login-signup-text">

            Don&apos;t have an account?

            <button
              type="button"
              onClick={() =>
                navigate("/signup")
              }
            >
              Sign up
            </button>

          </p>


          {/* ==================================
              BACK HOME
          ================================== */}

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