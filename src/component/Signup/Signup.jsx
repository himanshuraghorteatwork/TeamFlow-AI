import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UsersRound,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import "./Signup.css";

const getUsers = () => {
  return JSON.parse(localStorage.getItem("teamflow_users") || "[]");
};

const saveUsers = (users) => {
  localStorage.setItem("teamflow_users", JSON.stringify(users));
};

function Signup() {
  const navigate = useNavigate();

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

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    if (!first || !last || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!terms) {
      setError(
        "Please accept the Terms of Service and Privacy Policy."
      );
      return;
    }

    const users = getUsers();

    const userExists = users.some(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (userExists) {
      setError("An account with this email already exists.");
      return;
    }

    const user = {
      id: crypto.randomUUID?.() || Date.now().toString(),
      name: `${first} ${last}`,
      firstName: first,
      lastName: last,
      email: email.trim(),
      password,
    };

    users.push(user);

    saveUsers(users);

    localStorage.setItem(
      "teamflow_current_user",
      JSON.stringify(user)
    );

    setLoading(true);

    setTimeout(() => {
      navigate("/dashboard");
    }, 350);
  };

  const handleSocialSignup = (type) => {
    const socialEmail =
      type === "google"
        ? "google.user@teamflow.local"
        : "github.user@teamflow.local";

    let users = getUsers();

    let user = users.find(
      (existingUser) => existingUser.email === socialEmail
    );

    if (!user) {
      user = {
        id: crypto.randomUUID?.() || Date.now().toString(),
        name: type === "google" ? "Google User" : "GitHub User",
        email: socialEmail,
        password: "social-login",
      };

      users.push(user);

      saveUsers(users);
    }

    localStorage.setItem(
      "teamflow_current_user",
      JSON.stringify(user)
    );

    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      {/* LEFT SIDE */}

      <div className="auth-left signup-left">
        <div className="auth-left-content">
          <div className="auth-visual-logo">
            <UsersRound size={34} />
          </div>

          <h2>Build better together</h2>

          <p>
            Create your TeamFlow AI account and bring your
            projects, tasks and team collaboration into one place.
          </p>
        </div>
      </div>

      {/* SIGNUP */}

      <main className="auth-card signup-card">
        <button
          type="button"
          className="auth-logo"
          onClick={() => navigate("/")}
        >
          <span className="auth-logo-icon">
            <UsersRound size={22} />
          </span>

          <span>
            TeamFlow <strong>AI</strong>
          </span>
        </button>

        <h1>Create Your Account</h1>

        <p className="subtitle">
          Join TeamFlow AI and start collaborating with your team.
        </p>

        <form onSubmit={handleSignup}>
          <div className="two-col">
            <div>
              <label>First Name</label>

              <div className="input-wrap">
                <User size={18} />

                <input
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                  placeholder="John"
                  autoComplete="given-name"
                />
              </div>
            </div>

            <div>
              <label>Last Name</label>

              <div className="input-wrap">
                <User size={18} />

                <input
                  value={last}
                  onChange={(e) => setLast(e.target.value)}
                  placeholder="Doe"
                  autoComplete="family-name"
                />
              </div>
            </div>
          </div>

          <label>Work Email</label>

          <div className="input-wrap">
            <Mail size={18} />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@company.com"
              type="email"
              autoComplete="email"
            />
          </div>

          <label>Password</label>

          <div className="input-wrap">
            <Lock size={18} />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
            />

            <button
              type="button"
              className="icon-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          </div>

          <label>Confirm Password</label>

          <div className="input-wrap">
            <Lock size={18} />

            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm your password"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
            />

            <button
              type="button"
              className="icon-btn"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          </div>

          <label className="terms">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />

            <span className="fake-check">✓</span>

            <span>
              I agree to the{" "}
              <button type="button">Terms of Service</button>
              {" "}and{" "}
              <button type="button">Privacy Policy</button>
            </span>
          </label>

          {error && <div className="error">{error}</div>}

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <div className="or">
          <span />
          Or sign up with
          <span />
        </div>

        <div className="social-row">
          <button
            type="button"
            className="social-btn"
            onClick={() => handleSocialSignup("google")}
          >
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          <button
            type="button"
            className="social-btn"
            onClick={() => handleSocialSignup("github")}
          >
            <span className="github-icon">GH</span>
            Continue with GitHub
          </button>
        </div>

        <p className="bottom-link">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </p>
      </main>
    </div>
  );
}

export default Signup;