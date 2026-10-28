import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Check,
  ShieldCheck,
  Zap,
  MessageSquare,
  CheckSquare,
  Bug,
  Calendar,
  TrendingUp,
  Layers,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Star,
  Lock,
  Building2,
  ExternalLink,
  Laptop,
  Users,
  Clock,
  ArrowUpRight,
  Sun,
  Moon,
} from "lucide-react";
import "./LandingPage.css";

/* =========================================================================
   1. INTERACTIVE BACKGROUND PARTICLE & ENERGY CONSTELLATION CANVAS
   Smooth 60fps canvas animation responding to live cursor movement
   ========================================================================= */
function HeroBackgroundCanvas({ theme }) {
  const canvasRef = useRef(null);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle nodes count scaled by screen size
    const count = Math.min(Math.floor(width / 36), 46);
    const particles = [];

    const darkColors = [
      "rgba(99, 102, 241, ",
      "rgba(236, 72, 153, ",
      "rgba(56, 189, 248, ",
      "rgba(16, 185, 129, ",
    ];
    const lightColors = [
      "rgba(79, 70, 229, ",
      "rgba(219, 39, 119, ",
      "rgba(2, 132, 199, ",
      "rgba(5, 150, 105, ",
    ];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: Math.random() * 2.2 + 1.2,
        colorIndex: Math.floor(Math.random() * darkColors.length),
        baseAlpha: Math.random() * 0.35 + 0.25,
      });
    }

    const mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Smooth real-time transition progress (0.0 = full light, 1.0 = full dark)
    let themeProgress = themeRef.current === "dark" ? 1 : 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth real-time easing towards the target theme over ~0.8s
      const targetProgress = themeRef.current === "dark" ? 1 : 0;
      themeProgress += (targetProgress - themeProgress) * 0.04;

      // Draw connecting constellation lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 145) {
            const baseAlpha = 0.12 + 0.06 * themeProgress;
            const alpha = (1 - dist / 145) * baseAlpha;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw and update particle positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Subtle interactive mouse attraction & avoidance
        if (mouse.active) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 190 && mdist > 0) {
            const force = (190 - mdist) / 190;
            p.x += (mdx / mdist) * force * 1.6;
            p.y += (mdy / mdist) * force * 1.6;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around viewport edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const palette = themeProgress > 0.5 ? darkColors : lightColors;
        ctx.fillStyle = `${palette[p.colorIndex]}${p.baseAlpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-interactive-canvas"
      aria-hidden="true"
    />
  );
}

/* =========================================================================
   2. BRAND LOGO
   ========================================================================= */
function Logo() {
  return (
    <div className="logo-container">
      <div className="logo-icon-brand">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="28" height="28" rx="8" fill="url(#tf-landing-logo)" />
          <path
            d="M8 9H20M14 9V19M11 19H17"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="21" cy="7" r="2.5" fill="#38bdf8" />
          <defs>
            <linearGradient
              id="tf-landing-logo"
              x1="0"
              y1="0"
              x2="28"
              y2="28"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6366f1" />
              <stop offset="0.5" stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <span className="logo-text">
        TeamFlow <span className="logo-ai">AI</span>
      </span>
    </div>
  );
}

/* =========================================================================
   3. NAVBAR WITH LIGHT/DARK THEME TOGGLE & RESPONSIVE MOBILE DRAWER
   Fixed & guaranteed sticky across all viewport scrolling
   ========================================================================= */
function Navbar({ theme, toggleTheme, isScrolled }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`navbar ${isScrolled ? "is-scrolled" : ""}`}>
      <a href="#home" className="logo-link" onClick={closeMobileMenu}>
        <Logo />
      </a>

      {/* Desktop Navigation Links */}
      <nav className="nav-links">
        <a className="nav-link" href="#features">
          Features
        </a>
        <a className="nav-link" href="#how-it-works">
          How it Works
        </a>
        <a className="nav-link" href="#preview">
          Product Tour
        </a>
        <a className="nav-link" href="#pricing">
          Pricing
        </a>
        <a className="nav-link" href="#testimonials">
          Wall of Love
        </a>
        <a className="nav-link" href="#faq">
          FAQ
        </a>
      </nav>

      {/* Desktop Action Buttons */}
      <div className="nav-buttons">
        {/* Light / Dark Mode Animated Toggle Switch */}
        <button
          type="button"
          className={`theme-toggle-btn ${theme === "dark" ? "is-dark" : "is-light"}`}
          onClick={toggleTheme}
          role="switch"
          aria-checked={theme === "dark"}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Dark mode active. Click for Light mode." : "Light mode active. Click for Dark mode."}
        >
          <span className="theme-switch-track" aria-hidden="true">
            <span className={`switch-icon-holder sun-holder ${theme === "light" ? "active" : ""}`}>
              <Sun size={12} className="switch-icon sun-icon" />
            </span>
            <span className={`switch-icon-holder moon-holder ${theme === "dark" ? "active" : ""}`}>
              <Moon size={12} className="switch-icon moon-icon" />
            </span>
            <span className="switch-thumb" />
          </span>
          <span className="theme-toggle-label">
            {theme === "dark" ? "Dark" : "Light"}
          </span>
        </button>

        <button
          type="button"
          className="login-button"
          onClick={() => navigate("/choose-role", { state: { next: "login" } })}
        >
          Sign In
        </button>

        <button
          type="button"
          className="get-started-button"
          onClick={() => navigate("/choose-role", { state: { next: "signup" } })}
        >
          <span>Get Started Free</span>
          <ArrowRight size={15} />
        </button>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMobileMenu}>
          <div
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <Logo />
              <div className="mobile-header-actions">
                <button
                  type="button"
                  className={`theme-toggle-btn mobile-theme-btn ${theme === "dark" ? "is-dark" : "is-light"}`}
                  onClick={toggleTheme}
                  role="switch"
                  aria-checked={theme === "dark"}
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  title={theme === "dark" ? "Dark mode active. Click for Light mode." : "Light mode active. Click for Dark mode."}
                >
                  <span className="theme-switch-track" aria-hidden="true">
                    <span className={`switch-icon-holder sun-holder ${theme === "light" ? "active" : ""}`}>
                      <Sun size={12} className="switch-icon sun-icon" />
                    </span>
                    <span className={`switch-icon-holder moon-holder ${theme === "dark" ? "active" : ""}`}>
                      <Moon size={12} className="switch-icon moon-icon" />
                    </span>
                    <span className="switch-thumb" />
                  </span>
                  <span className="theme-toggle-label">{theme === "dark" ? "Dark" : "Light"}</span>
                </button>
                <button
                  type="button"
                  className="mobile-close-btn"
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <nav className="mobile-nav-links">
              <a href="#features" onClick={closeMobileMenu}>
                <Sparkles size={16} /> Features
              </a>
              <a href="#how-it-works" onClick={closeMobileMenu}>
                <Layers size={16} /> How it Works
              </a>
              <a href="#preview" onClick={closeMobileMenu}>
                <Laptop size={16} /> Product Tour
              </a>
              <a href="#pricing" onClick={closeMobileMenu}>
                <Zap size={16} /> Pricing Plans
              </a>
              <a href="#testimonials" onClick={closeMobileMenu}>
                <Star size={16} /> Testimonials
              </a>
              <a href="#faq" onClick={closeMobileMenu}>
                <CheckCircle2 size={16} /> Frequently Asked Questions
              </a>
            </nav>

            <div className="mobile-drawer-actions">
              <button
                type="button"
                className="mobile-action-login"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/choose-role", { state: { next: "login" } });
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className="mobile-action-signup"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/choose-role", { state: { next: "signup" } });
                }}
              >
                Get Started Free <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* =========================================================================
   4. FULL-SCREEN WIDESCREEN HERO SECTION
   2-Column Layout utilizing left and right screen space completely
   ========================================================================= */
function Hero() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprint"); // "sprint" | "ai" | "telemetry"

  return (
    <section className="hero-section" id="home">
      {/* Animated Ambient Light Blobs reacting to mouse parallax */}
      <div className="hero-glow hero-glow-1 mouse-parallax-layer-1" />
      <div className="hero-glow hero-glow-2 mouse-parallax-layer-2" />
      <div className="hero-glow hero-glow-3 mouse-parallax-layer-3" />

      {/* LEFT COLUMN: Punchy Hero Content, Headline, Dual CTAs & Live Activity */}
      <div className="hero-content-col">
        {/* Floating Announcement Pill with Live Animated Beacon */}
        <a href="#features" className="hero-announcement-pill">
          <span className="live-beacon">
            <span className="beacon-ping" />
            <span className="beacon-core" />
          </span>
          <span className="pill-text">
            <strong>TeamFlow AI 2.0 is Live</strong> • Autonomous Sprints
          </span>
          <ArrowRight size={13} className="pill-arrow" />
        </a>

        {/* Hero Headline */}
        <h1 className="hero-title">
          Where High-Velocity Teams Turn Discussions into{" "}
          <span className="gradient-text">Measurable Results</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="hero-description">
          Unify team chat, automated task boards, bug resolution pipelines, and autonomous AI intelligence in one lightning-fast workspace. Eliminate tool sprawl and ship faster with high clarity.
        </p>

        {/* Action Buttons */}
        <div className="hero-buttons">
          <button
            type="button"
            className="hero-primary-button"
            onClick={() =>
              navigate("/choose-role", { state: { next: "signup" } })
            }
          >
            <span>Start Free Trial — No Credit Card</span>
            <ArrowRight size={17} />
          </button>

          <a href="#preview" className="hero-demo-button">
            <span className="play-circle">
              <Play size={13} fill="currentColor" />
            </span>
            <span>Interactive Tour</span>
          </a>
        </div>

        {/* Trust Proof Points */}
        <div className="hero-trust">
          <span>
            <CheckCircle2 size={16} /> Free 14-day enterprise trial
          </span>
          <span>
            <ShieldCheck size={16} /> SOC2 &amp; GDPR compliant
          </span>
          <span>
            <Zap size={16} /> 2-minute instant setup
          </span>
        </div>

        {/* Live Active Activity Ticker Strip */}
        <div className="hero-live-activity-bar">
          <div className="live-activity-badge">
            <span className="activity-pulse-dot" />
            <span>LIVE NOW</span>
          </div>
          <div className="live-activity-text">
            <strong>1,248+ active members</strong> shipping across 180+ teams today
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Hero Dashboard Showcase Frame */}
      <div className="hero-dashboard-col" id="preview">
        <div className="hero-dashboard">
          <div className="dashboard-window">
            {/* Top Browser Bar */}
            <div className="dashboard-topbar">
              <div className="dashboard-window-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>

              <div className="dashboard-url-bar">
                <Lock size={11} />
                <span>teamflow.ai/workspace/acme-technologies</span>
              </div>

              <div className="dashboard-tab-switcher">
                <button
                  type="button"
                  className={`dash-tab-btn ${activeTab === "sprint" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("sprint")}
                >
                  <CheckSquare size={13} /> Sprint Board
                </button>
                <button
                  type="button"
                  className={`dash-tab-btn ${activeTab === "ai" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("ai")}
                >
                  <Sparkles size={13} /> AI Engine
                </button>
                <button
                  type="button"
                  className={`dash-tab-btn ${activeTab === "telemetry" ? "is-active" : ""}`}
                  onClick={() => setActiveTab("telemetry")}
                >
                  <TrendingUp size={13} /> Velocity
                </button>
              </div>
            </div>

            {/* Interactive Showcase Screen */}
            <div className="dashboard-screen">
              {activeTab === "sprint" && (
                <div className="dash-view-sprint tab-fade-in">
                  <div className="dash-sprint-header">
                    <div>
                      <span className="dash-pill">Sprint 42 • Active</span>
                      <h3>Core Engine &amp; Payment Gateway Migration</h3>
                    </div>
                    <div className="dash-velocity-badge">
                      <TrendingUp size={14} />
                      <span>94.2% Velocity</span>
                    </div>
                  </div>

                  <div className="dash-kanban-cols">
                    {/* Column 1: In Progress */}
                    <div className="dash-kanban-col">
                      <div className="dash-col-head">
                        <span>IN PROGRESS</span>
                        <strong className="badge-count">3</strong>
                      </div>

                      <div className="dash-task-item">
                        <div className="task-top-tags">
                          <span className="priority-tag high">High Priority</span>
                          <span className="time-tag">2h ago</span>
                        </div>
                        <h4>Fix OAuth 2.0 PKCE Session Refresh</h4>
                        <p>Resolve refresh token expiration for multi-tenant sessions.</p>
                        <div className="task-footer">
                          <div className="task-assignee">
                            <span className="avatar-chip blue">HM</span>
                            <small>Himanshu R.</small>
                          </div>
                          <span className="task-type-badge code">#BACKEND</span>
                        </div>
                      </div>

                      <div className="dash-task-item">
                        <div className="task-top-tags">
                          <span className="priority-tag medium">Medium</span>
                          <span className="time-tag">5h ago</span>
                        </div>
                        <h4>Design SAP Fiori User Master Grid</h4>
                        <p>Implement sticky table headers and density controls.</p>
                        <div className="task-footer">
                          <div className="task-assignee">
                            <span className="avatar-chip purple">AS</span>
                            <small>Aarav S.</small>
                          </div>
                          <span className="task-type-badge ui">#DESIGN</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: In Code Review */}
                    <div className="dash-kanban-col">
                      <div className="dash-col-head">
                        <span>CODE REVIEW</span>
                        <strong className="badge-count">2</strong>
                      </div>

                      <div className="dash-task-item">
                        <div className="task-top-tags">
                          <span className="priority-tag urgent">P0 Urgent</span>
                          <span className="time-tag">1h ago</span>
                        </div>
                        <h4>Add Fixed Portals for View Dialogs</h4>
                        <p>Ensure zero background scrolling on mobile &amp; desktop.</p>
                        <div className="task-footer">
                          <div className="task-assignee">
                            <span className="avatar-chip green">PN</span>
                            <small>Priya N.</small>
                          </div>
                          <span className="task-type-badge core">#CORE-UI</span>
                        </div>
                      </div>

                      <div className="dash-task-item">
                        <div className="task-top-tags">
                          <span className="priority-tag low">Normal</span>
                          <span className="time-tag">3h ago</span>
                        </div>
                        <h4>GST Invoice PDF Download Generator</h4>
                        <p>Generate compliant GSTIN receipts with dynamic tax splits.</p>
                        <div className="task-footer">
                          <div className="task-assignee">
                            <span className="avatar-chip orange">AV</span>
                            <small>Amit V.</small>
                          </div>
                          <span className="task-type-badge billing">#BILLING</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Completed */}
                    <div className="dash-kanban-col">
                      <div className="dash-col-head">
                        <span>COMPLETED</span>
                        <strong className="badge-count">5</strong>
                      </div>

                      <div className="dash-task-item is-done">
                        <div className="task-top-tags">
                          <span className="priority-tag done">✓ Verified</span>
                          <span className="time-tag">Today</span>
                        </div>
                        <h4>Company Logo Branding on Email Templates</h4>
                        <p>Embedded official gradient monogram in email headers and footers.</p>
                        <div className="task-footer">
                          <div className="task-assignee">
                            <span className="avatar-chip blue">HM</span>
                            <small>Himanshu R.</small>
                          </div>
                          <span className="task-type-badge done">#SHIPPED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "ai" && (
                <div className="dash-view-ai tab-fade-in">
                  <div className="ai-summary-header">
                    <div className="ai-badge-live">
                      <Sparkles size={14} />
                      <span>Autonomous Intelligence Engine</span>
                    </div>
                    <h3>Executive Conversation Summary — Channel: #engineering-core</h3>
                    <p>Synthesized from 48 messages across 8 participants in the last 4 hours.</p>
                  </div>

                  <div className="ai-cards-grid">
                    <div className="ai-card-block highlight">
                      <div className="ai-card-title">
                        <CheckCircle2 size={16} />
                        <strong>Key Decisions Reached</strong>
                      </div>
                      <ul>
                        <li>Approved switching to React 18 createPortal for all overlay dialogs.</li>
                        <li>Standardized enterprise demo branding on Acme Technologies and TeamFlow AI.</li>
                        <li>Locked down API gateway rate limits to 50,000 requests/tenant/hour.</li>
                      </ul>
                    </div>

                    <div className="ai-card-block action-items">
                      <div className="ai-card-title">
                        <Zap size={16} />
                        <strong>AI Auto-Generated Tasks (Ready to Assign)</strong>
                      </div>
                      <div className="ai-action-row">
                        <span>Fix OAuth session refresh PKCE token</span>
                        <button type="button" className="ai-quick-add-btn">
                          + Assign to Himanshu
                        </button>
                      </div>
                      <div className="ai-action-row">
                        <span>Review Stripe webhook signature validation</span>
                        <button type="button" className="ai-quick-add-btn">
                          + Assign to Priya
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "telemetry" && (
                <div className="dash-view-telemetry tab-fade-in">
                  <div className="telemetry-kpi-row">
                    <div className="telem-card">
                      <span>Sprint Velocity</span>
                      <strong>94.2%</strong>
                      <small className="trend-up">+14.6% vs target</small>
                    </div>
                    <div className="telem-card">
                      <span>Tokens Processed</span>
                      <strong>8.4M</strong>
                      <small className="trend-up">+22% this week</small>
                    </div>
                    <div className="telem-card">
                      <span>AI Latency</span>
                      <strong>1.2s</strong>
                      <small className="trend-down">-18% avg wait</small>
                    </div>
                    <div className="telem-card">
                      <span>System Health</span>
                      <strong>99.98%</strong>
                      <small className="trend-stable">All clusters healthy</small>
                    </div>
                  </div>

                  <div className="telem-graph-mock">
                    <div className="telem-graph-header">
                      <h4>Cumulative Output &amp; Bug Resolution Rate</h4>
                      <span>Daily Progress Tracking</span>
                    </div>
                    <div className="mock-bar-chart">
                      {[
                        { day: "Mon", h: "45%", delay: "0.05s" },
                        { day: "Tue", h: "60%", delay: "0.10s" },
                        { day: "Wed", h: "78%", delay: "0.15s" },
                        { day: "Thu", h: "92%", delay: "0.20s" },
                        { day: "Fri", h: "85%", delay: "0.25s" },
                        { day: "Sat", h: "96%", delay: "0.30s" },
                        { day: "Sun", h: "100%", delay: "0.35s" },
                      ].map((b) => (
                        <div key={b.day} className="mock-bar-col">
                          <div className="mock-bar-track">
                            <div
                              className="mock-bar-fill animated-bar"
                              style={{ height: b.h, animationDelay: b.delay }}
                            />
                          </div>
                          <span>{b.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floating Telemetry Badges with Parallax & Float Keyframes */}
          <div className="floating-badge badge-bottom-left float-anim-1">
            <div className="floating-icon-box">⚡</div>
            <div>
              <strong>AI Task Created Instantly</strong>
              <span>OAuth PKCE session refresh (+12m ago)</span>
            </div>
          </div>

          <div className="floating-badge badge-top-right float-anim-2">
            <div className="floating-icon-box pink">🚀</div>
            <div>
              <strong>Sprint Velocity 94%</strong>
              <span>+16% faster team execution</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   5. LOGO MARQUEE / CONTINUOUS ANIMATED TICKER
   ========================================================================= */
function LogoMarquee() {
  const companies = [
    { name: "Acme Technologies", tier: "Enterprise" },
    { name: "NovaTech Solutions", tier: "Cloud SaaS" },
    { name: "Apex Software Systems", tier: "AI Core" },
    { name: "DesignHub Studio", tier: "Creative Lab" },
    { name: "CloudNine Enterprise", tier: "DevOps" },
    { name: "Summit Works", tier: "Scaleup" },
    { name: "Orbit Creative", tier: "Design" },
  ];

  return (
    <section className="marquee-section">
      <div className="marquee-container">
        <p className="marquee-title">
          TRUSTED BY MODERN ENGINEERING, PRODUCT &amp; OPERATIONS TEAMS WORLDWIDE
        </p>

        {/* Continuous Animated Marquee Track */}
        <div className="marquee-viewport">
          <div className="marquee-track">
            {companies.concat(companies).map((c, idx) => (
              <div className="marquee-company-pill" key={`${c.name}-${idx}`}>
                <div className="marquee-dot" />
                <strong>{c.name}</strong>
                <span>{c.tier}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   6. FEATURES SECTION
   ========================================================================= */
function Features() {
  const features = [
    {
      icon: Sparkles,
      color: "purple",
      title: "AI Work Assistant",
      tag: "AUTOMATED",
      description:
        "Transform lengthy channel discussions, Slack-style chats, and meeting transcripts into prioritized sprint tasks with a single click.",
    },
    {
      icon: CheckSquare,
      color: "blue",
      title: "Adaptive Task Boards",
      tag: "REAL-TIME",
      description:
        "Flexible Kanban boards, sprint lists, and timelines with automated status gates, assignee tracking, and milestone deadlines.",
    },
    {
      icon: MessageSquare,
      color: "indigo",
      title: "Contextual Team Chat",
      tag: "SYNCHRONIZED",
      description:
        "Threaded discussions embedded directly inside project cards. Never lose context between what you said and what needs to get done.",
    },
    {
      icon: Bug,
      color: "orange",
      title: "Issue & Bug Tracker",
      tag: "TRIAGE",
      description:
        "Log bug reports, group crash diagnostics, classify severity from P0 to P3, and automatically assign engineers based on workload.",
    },
    {
      icon: TrendingUp,
      color: "green",
      title: "Executive Velocity Telemetry",
      tag: "ANALYTICS",
      description:
        "Live burn-down charts, cycle-time telemetry, and sprint velocity gauges that keep management informed without manual reports.",
    },
    {
      icon: ShieldCheck,
      color: "cyan",
      title: "Enterprise Governance & RBAC",
      tag: "SECURITY",
      description:
        "Granular role-based permissions matrix, audit logs, 2FA enforcement, and automated multi-tenant billing in one compliance-ready suite.",
    },
  ];

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <div className="features-heading">
          <span className="section-eyebrow">
            <Layers size={13} />
            POWERFUL FEATURES
          </span>

          <h2>
            Everything Your Team Needs
            <br />
            <span className="gradient-text">To Build, Ship, and Scale</span>
          </h2>

          <p>
            Eliminate fragmented tools. TeamFlow AI replaces multiple disconnected apps with a single, high-performance workspace.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <article className="feature-card" key={feature.title}>
                <div className="feature-card-header">
                  <div className={`feature-icon-box ${feature.color}`}>
                    <IconComponent size={22} strokeWidth={2.2} />
                  </div>
                  <span className={`feature-tag tag-${feature.color}`}>{feature.tag}</span>
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                <div className="feature-card-footer">
                  <span className="feature-learn-more">
                    Explore feature <ArrowUpRight size={14} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   7. HOW IT WORKS SECTION (WITH FALLBACKS & SCREENSHOTS)
   ========================================================================= */
function HowItWorks() {
  const steps = [
    {
      number: "01",
      tag: "STEP ONE",
      title: "Create Your Workspace & Invite Teammates",
      description:
        "Set up your company workspace in seconds. Onboard teammates with predefined roles — Super Admin, Tenant Admin, Team Lead, and Member.",
      image: "/images/team-collaboration.png",
      bulletPoints: ["Zero complex configuration", "Granular role assignment", "Instant invite magic links"],
    },
    {
      number: "02",
      tag: "STEP TWO",
      title: "Organize Sprints, Tasks & Issue Pipelines",
      description:
        "Create tasks, prioritize bugs, track dependencies, and keep everyone aligned on sprint goals with Kanban and timeline views.",
      image: "/images/task-management.png",
      bulletPoints: ["Drag-and-drop task workflow", "Severity-based triage (P0-P3)", "Custom milestone schedules"],
    },
    {
      number: "03",
      tag: "STEP THREE",
      title: "Accelerate Velocity with AI Intelligence",
      description:
        "Let TeamFlow AI summarize noisy channels, extract actionable tasks from meeting notes, and provide daily executive progress briefings.",
      image: "/images/ai-assistant.png",
      bulletPoints: ["1.2s average inference speed", "Autonomous task drafting", "Zero data shared with public LLMs"],
    },
  ];

  return (
    <section className="how-section" id="how-it-works">
      <div className="how-container">
        <div className="how-heading">
          <span className="section-eyebrow">
            <Zap size={13} />
            EFFORTLESS ADOPTION
          </span>

          <h2>
            From Team Setup to Real Impact in{" "}
            <span className="gradient-text">Three Simple Steps</span>
          </h2>

          <p>
            No weeks-long onboarding or messy migrations. Get your entire team working together with high clarity today.
          </p>
        </div>

        <div className="how-steps-stack">
          {steps.map((step) => (
            <article className="how-step-card" key={step.number}>
              <div className="how-step-info">
                <div className="how-step-number-pill">
                  <span className="step-num">{step.number}</span>
                  <span className="step-tag">{step.tag}</span>
                </div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>

                <ul className="how-bullet-list">
                  {step.bulletPoints.map((bp) => (
                    <li key={bp}>
                      <CheckCircle2 size={16} className="bullet-icon" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="how-step-visual">
                <img
                  src={step.image}
                  alt={step.title}
                  className="how-preview-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   8. LIVE METRICS & TELEMETRY NUMBERS
   ========================================================================= */
function MetricsSection() {
  const stats = [
    { value: "99.98%", label: "Platform SLA Uptime", sub: "Enterprise High Availability" },
    { value: "10M+", label: "Monthly AI Tokens", sub: "Autonomous Task Processing" },
    { value: "1,248+", label: "Active Team Members", sub: "Across 180+ Organizations" },
    { value: "3.2x", label: "Faster Cycle Velocity", sub: "From Idea to Production" },
  ];

  return (
    <section className="metrics-banner-section">
      <div className="metrics-container">
        <div className="metrics-grid">
          {stats.map((s) => (
            <div className="metric-box" key={s.label}>
              <div className="metric-number gradient-text">{s.value}</div>
              <strong className="metric-label">{s.label}</strong>
              <span className="metric-sub">{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   9. PRICING SECTION (INR & USD TRANSPARENT)
   ========================================================================= */
function Pricing() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("yearly"); // "monthly" | "yearly"

  const plans = [
    {
      name: "Starter Free",
      description: "Essential task management and collaboration for emerging teams.",
      monthlyPrice: "₹0",
      yearlyPrice: "₹0",
      period: "free forever",
      features: [
        "Up to 5 team members",
        "3 active project workspaces",
        "Contextual team channels",
        "Basic task board & bug logging",
        "1,000 monthly AI tokens",
        "Standard community support",
      ],
      button: "Get Started Free",
      featured: false,
    },
    {
      name: "Pro Team",
      description: "Complete AI workspace for high-growth engineering & product teams.",
      monthlyPrice: "₹2,499",
      yearlyPrice: "₹1,999",
      period: "per user / month",
      saveBadge: "SAVE 20%",
      features: [
        "Unlimited team members",
        "Unlimited project workspaces",
        "Autonomous AI task extraction",
        "Executive sprint summaries",
        "Bug tracker severity matrix (P0-P3)",
        "Sprint velocity telemetry",
        "50,000 AI tokens/user/month",
        "Priority 24/7 technical support",
      ],
      button: "Start 14-Day Free Trial",
      featured: true,
    },
    {
      name: "Enterprise Business",
      description: "Dedicated governance, custom models, and enterprise SLA.",
      monthlyPrice: "₹6,999",
      yearlyPrice: "₹5,499",
      period: "per user / month",
      saveBadge: "CUSTOM TERMS",
      features: [
        "Everything in Pro Team",
        "Granular RBAC security matrix",
        "Custom LLM provider integrations (Gemini / OpenAI)",
        "Audit logging & compliance exports",
        "Dedicated Customer Success Manager",
        "Custom GST invoice billing & POs",
        "99.98% uptime SLA guarantee",
      ],
      button: "Contact Enterprise Sales",
      featured: false,
    },
  ];

  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-container">
        <div className="pricing-heading">
          <span className="section-eyebrow">
            <Zap size={13} />
            TRANSPARENT PLANS
          </span>

          <h2>
            Simple, Transparent Pricing That{" "}
            <span className="gradient-text">Scales with You</span>
          </h2>

          <p>
            Start free, scale with AI when you are ready. Cancel or adjust plan tiers at any time with zero lock-in.
          </p>

          {/* Billing Switcher */}
          <div className="billing-switch-wrapper">
            <div className="billing-switch">
              <button
                type="button"
                className={`switch-btn ${billing === "monthly" ? "is-active" : ""}`}
                onClick={() => setBilling("monthly")}
              >
                Monthly Billing
              </button>

              <button
                type="button"
                className={`switch-btn ${billing === "yearly" ? "is-active" : ""}`}
                onClick={() => setBilling("yearly")}
              >
                <span>Annual Billing</span>
                <span className="save-pill">Save 20%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article
              className={`pricing-card ${plan.featured ? "is-featured" : ""}`}
              key={plan.name}
            >
              {plan.featured && (
                <div className="featured-ribbon">
                  <Sparkles size={12} /> MOST POPULAR
                </div>
              )}

              <div className="plan-header">
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
              </div>

              <div className="plan-price-row">
                <span className="plan-amount">
                  {billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className="plan-period">{plan.period}</span>
              </div>

              {billing === "yearly" && plan.saveBadge && (
                <div className="plan-discount-note">{plan.saveBadge} APPLIED</div>
              )}

              <button
                type="button"
                className={`plan-cta-button ${plan.featured ? "btn-primary" : "btn-secondary"}`}
                onClick={() =>
                  navigate("/choose-role", { state: { next: "signup", plan: plan.name } })
                }
              >
                <span>{plan.button}</span>
                <ArrowRight size={15} />
              </button>

              <div className="plan-divider" />

              <div className="plan-features-block">
                <span className="feature-list-title">What is included:</span>
                <ul className="feature-items-list">
                  {plan.features.map((feat) => (
                    <li key={feat}>
                      <Check size={15} className="check-icon" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   10. WALL OF LOVE / TESTIMONIALS
   ========================================================================= */
function Testimonials() {
  const testimonials = [
    {
      quote:
        "TeamFlow AI cut our sprint planning overhead in half. The automatic chat-to-task summarization is like having an extra technical project manager on every channel.",
      author: "Vikram Malhotra",
      role: "VP of Engineering",
      company: "Summit Works",
      avatarBg: "#4361ee",
      initials: "VM",
    },
    {
      quote:
        "Consolidating Slack, Jira, and fragmented spreadsheets into TeamFlow AI saved our company over ₹40,000 every month while keeping our 40-person team in complete lockstep.",
      author: "Priya Nair",
      role: "Head of Operations",
      company: "NovaTech Cloud",
      avatarBg: "#059669",
      initials: "PN",
    },
    {
      quote:
        "The cleanest, most intuitive interface in the modern project management space. Fast, responsive, and the AI features genuinely save our developers hours every week.",
      author: "Amit Verma",
      role: "Technical Lead",
      company: "Apex Systems",
      avatarBg: "#7c3aed",
      initials: "AV",
    },
  ];

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-container">
        <div className="testimonials-heading">
          <span className="section-eyebrow">
            <Star size={13} />
            WALL OF LOVE
          </span>

          <h2>
            Trusted by Leaders Who Value{" "}
            <span className="gradient-text">Speed &amp; Clarity</span>
          </h2>

          <p>
            See how forward-thinking product and engineering teams use TeamFlow AI to streamline their daily workflows.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <article className="testimonial-card" key={t.author}>
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>

              <blockquote className="testimonial-quote">"{t.quote}"</blockquote>

              <div className="testimonial-author-row">
                <div
                  className="testimonial-avatar"
                  style={{ background: t.avatarBg }}
                >
                  {t.initials}
                </div>
                <div>
                  <strong>{t.author}</strong>
                  <span className="testimonial-author-meta">
                    {t.role} · {t.company}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   11. INTERACTIVE FAQ ACCORDION
   ========================================================================= */
function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How does TeamFlow AI use artificial intelligence in our daily workflow?",
      a: "TeamFlow AI listens to project discussion threads, channel messages, and meeting notes. With one click, it synthesizes discussions into clear executive summaries, extracts actionable tasks with suggested assignees, and identifies blocked dependencies without manual transcription.",
    },
    {
      q: "Is our internal company data and code private and secure?",
      a: "Yes. TeamFlow AI uses enterprise-grade encryption both in transit (TLS 1.3) and at rest (AES-256). Your proprietary conversations, code snippets, and organization data are strictly segregated in isolated tenant databases and are never used to train public foundational AI models.",
    },
    {
      q: "Can we migrate existing tasks and projects from Jira, Trello, or Slack?",
      a: "Absolutely. TeamFlow AI provides built-in CSV and JSON import tools that allow you to bring over your historical sprint data, team members, and open bug tickets in just a few clicks.",
    },
    {
      q: "What happens if our team needs more AI tokens or additional seats?",
      a: "You can seamlessly upgrade your plan tier or add token boosters directly from the Super Admin portal at any time. Unused tokens on paid plans roll over to the next billing cycle.",
    },
    {
      q: "Can I cancel or change my subscription at any time?",
      a: "Yes. There are no long-term lock-in contracts. You can switch between Monthly and Annual billing or cancel your subscription anytime with zero hidden fees.",
    },
  ];

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <div className="faq-heading">
          <span className="section-eyebrow">
            <CheckCircle2 size={13} />
            COMMON QUESTIONS
          </span>

          <h2>
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>

          <p>
            Everything you need to know about TeamFlow AI, security, and onboarding your team.
          </p>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                className={`faq-item ${isOpen ? "is-open" : ""}`}
                key={faq.q}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp size={18} className="faq-chevron" />
                  ) : (
                    <ChevronDown size={18} className="faq-chevron" />
                  )}
                </button>

                {isOpen && (
                  <div className="faq-answer-body">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   12. HIGH-CONVERSION FINAL CALL TO ACTION (CTA)
   ========================================================================= */
function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="cta-banner-section">
      <div className="cta-banner-card">
        <div className="cta-banner-glow" />

        <div className="cta-content">
          <span className="cta-eyebrow">
            <Sparkles size={14} /> START BUILDING TODAY
          </span>

          <h2>
            Ready to Build, Ship, and Collaborate{" "}
            <span className="gradient-text-light">3x Faster?</span>
          </h2>

          <p>
            Join over 180 forward-thinking organizations using TeamFlow AI to eliminate busywork and keep teammates in sync.
          </p>

          <div className="cta-actions">
            <button
              type="button"
              className="cta-primary-btn"
              onClick={() =>
                navigate("/choose-role", { state: { next: "signup" } })
              }
            >
              <span>Get Started Free — No Credit Card</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="cta-secondary-btn"
              onClick={() =>
                navigate("/choose-role", { state: { next: "login" } })
              }
            >
              <span>Sign In to Your Workspace</span>
            </button>
          </div>

          <div className="cta-reassurances">
            <span>✓ Instant 2-min workspace activation</span>
            <span>✓ Cancel or switch plans anytime</span>
            <span>✓ SOC2 &amp; GDPR ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   13. FOOTER
   ========================================================================= */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" id="footer">
      <div className="footer-container">
        <div className="footer-main">
          {/* Brand Info */}
          <div className="footer-brand">
            <a href="#home" className="footer-logo-link">
              <Logo />
            </a>

            <p className="footer-description">
              The unified AI operating system for modern engineering, product, and operations teams. Bring people, projects, and priorities into one focused workspace.
            </p>

            <div className="footer-status-badge">
              <span className="status-indicator-dot" />
              <span>All Systems Operational (99.98% Uptime)</span>
            </div>
          </div>

          {/* Nav Links Column 1 */}
          <nav className="footer-links-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#preview">Interactive Tour</a>
            <a href="#pricing">Pricing Plans</a>
          </nav>

          {/* Nav Links Column 2 */}
          <nav className="footer-links-col">
            <h4>Resources</h4>
            <a href="#faq">Frequently Asked Questions</a>
            <a href="#testimonials">Customer Stories</a>
            <a href="https://status.teamflow.ai" target="_blank" rel="noreferrer">
              System Health &amp; Status <ExternalLink size={11} />
            </a>
            <a href="mailto:support@teamflow.ai">Email Support</a>
          </nav>

          {/* Nav Links Column 3 */}
          <nav className="footer-links-col">
            <h4>Company &amp; Portals</h4>
            <a href="/choose-role">Choose Portal Role</a>
            <a href="/login">User Login</a>
            <a href="/superadmin/dashboard">Super Admin Access</a>
            <a href="mailto:privacy@teamflow.ai">Security &amp; Compliance</a>
          </nav>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <p>© {year} TeamFlow AI. All rights reserved.</p>

          <div className="footer-legal-links">
            <a href="#faq">Privacy Policy</a>
            <a href="#faq">Terms of Service</a>
            <a href="#faq">Security Policy</a>
          </div>

          <a href="#home" className="footer-back-top">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================================
   14. ROOT LANDING PAGE COMPONENT
   With Interactive Background Canvas, Live Mouse Cursor Tracking & Sticky Header
   ========================================================================= */
function LandingPage() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("teamflow_landing_theme") || "light";
  });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    localStorage.setItem("teamflow_landing_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("theme-dark");
      document.documentElement.classList.remove("theme-light");
    } else {
      document.documentElement.classList.add("theme-light");
      document.documentElement.classList.remove("theme-dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Scroll detection for sticky header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Live mouse position tracking for radial glows and parallax
  useEffect(() => {
    let animId;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currX = targetX;
    let currY = targetY;

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const loop = () => {
      currX += (targetX - currX) * 0.08;
      currY += (targetY - currY) * 0.08;

      const root = document.documentElement;
      root.style.setProperty("--mouse-x", `${currX}px`);
      root.style.setProperty("--mouse-y", `${currY}px`);

      const normX = (currX / window.innerWidth - 0.5) * 2;
      const normY = (currY / window.innerHeight - 0.5) * 2;
      root.style.setProperty("--mouse-norm-x", `${normX.toFixed(3)}`);
      root.style.setProperty("--mouse-norm-y", `${normY.toFixed(3)}`);

      animId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className={`landing-page-root theme-${theme}`}>
      {/* Live Interactive Energy Constellation Canvas */}
      <HeroBackgroundCanvas theme={theme} />

      {/* Live Interactive Cursor Spotlight */}
      <div className="mouse-interactive-spotlight" aria-hidden="true" />
      <div className="mouse-interactive-grid" aria-hidden="true" />

      {/* Guaranteed Sticky Navbar */}
      <Navbar theme={theme} toggleTheme={toggleTheme} isScrolled={isScrolled} />

      <main className="landing-main-content">
        <Hero />
        <LogoMarquee />
        <Features />
        <HowItWorks />
        <MetricsSection />
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
