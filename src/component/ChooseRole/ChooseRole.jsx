
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  UsersRound,
  Crown,
  ShieldCheck,
  Users,
  UserRound,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  FolderKanban,
  CalendarDays,
  Zap,
  Shield,
  CircleCheck,
} from "lucide-react";

import "./ChooseRole.css";

const roles = [
  {
    id: "superadmin",
    title: "Super Admin",
    description: "Full control over the platform and all organizations.",
    icon: Crown,
    color: "purple",
    badge: "Platform access",
  },
  {
    id: "admin",
    title: "Admin",
    description: "Manage team members, projects, and daily operations.",
    icon: ShieldCheck,
    color: "blue",
    badge: "Workspace control",
  },
  {
    id: "teamlead",
    title: "Team Lead",
    description: "Lead your team, track progress, and ensure timely delivery.",
    icon: Users,
    color: "orange",
    badge: "Team management",
  },
  {
    id: "employee",
    title: "Employee",
    description: "Work on assigned tasks and collaborate with your team.",
    icon: UserRound,
    color: "green",
    badge: "Team collaboration",
  },
];

function ChooseRole() {
  const navigate = useNavigate();
  const location = useLocation();

  const next = location.state?.next === "signup" ? "signup" : "login";

  const [selectedRole, setSelectedRole] = useState("superadmin");

  const handleContinue = () => {
    navigate(`/${next}`, {
      state: { selectedRole },
    });
  };

  return (
    <main className="choose-role-page">
      {/* Ambient animated background */}
      <div className="role-ambient-background" aria-hidden="true">
        <span className="role-orb role-orb-one" />
        <span className="role-orb role-orb-two" />
        <span className="role-orb role-orb-three" />
        <span className="role-grid-pattern" />
      </div>

      {/* LEFT: BRAND EXPERIENCE */}
      <section className="role-intro">
        <div className="role-intro-content">
          <div className="role-brand">
            <div className="role-brand-icon">
              <UsersRound size={27} />
            </div>

            <div>
              <h2>
                TeamFlow <span>AI</span>
              </h2>
              <p>Work Smarter Together</p>
            </div>
          </div>

          <div className="role-hero-copy">
            <span className="role-eyebrow">
              <Sparkles size={16} />
              AI-POWERED TEAM COLLABORATION
            </span>

            <h1>
              Turn Team Conversations into{" "}
              <span>Real Progress</span>
            </h1>

            <p className="role-hero-description">
              Chat, manage tasks, track bugs, and organize projects
              in one intelligent workspace built for your team.
            </p>
          </div>

          <div className="role-benefits">
            <div className="role-benefit">
              <span className="benefit-icon benefit-blue">
                <MessageCircle size={21} />
              </span>
              <div>
                <strong>Collaborate</strong>
                <p>Chat in real time with your team</p>
              </div>
            </div>

            <div className="role-benefit">
              <span className="benefit-icon benefit-orange">
                <FolderKanban size={21} />
              </span>
              <div>
                <strong>Manage Work</strong>
                <p>Create and track tasks and bugs</p>
              </div>
            </div>

            <div className="role-benefit">
              <span className="benefit-icon benefit-purple">
                <Sparkles size={21} />
              </span>
              <div>
                <strong>AI Powered</strong>
                <p>Get summaries and useful insights</p>
              </div>
            </div>

            <div className="role-benefit">
              <span className="benefit-icon benefit-green">
                <CalendarDays size={21} />
              </span>
              <div>
                <strong>Stay Organized</strong>
                <p>Keep projects and deadlines in one place</p>
              </div>
            </div>
          </div>

          {/* Animated workspace illustration */}
          <div className="role-illustration" aria-hidden="true">
            <div className="role-illustration-circle circle-one" />
            <div className="role-illustration-circle circle-two" />

            <div className="illustration-card illustration-chat">
              <MessageCircle size={28} />
              <span />
              <span />
            </div>

            <div className="illustration-card illustration-tasks">
              <Check size={19} />
              <span />
              <Check size={19} />
              <span />
            </div>

            <div className="illustration-team">
              <span>👨🏻‍💻</span>
              <span>👩🏻‍💻</span>
              <span>👨🏽‍💻</span>
            </div>

            <div className="role-floating-status">
              <span className="role-status-dot" />
              <span>Team workspace active</span>
            </div>
          </div>

          <div className="role-trust-note">
            <Shield size={15} />
            Built for teams that move forward together
          </div>
        </div>
      </section>

      {/* RIGHT: ROLE SELECTION */}
      <section className="role-selection-panel">
        <div className="role-selection-inner">
          <div className="role-mobile-brand">
            <div className="role-brand-icon">
              <UsersRound size={25} />
            </div>
            <strong>
              TeamFlow <span>AI</span>
            </strong>
          </div>

          <div className="role-heading">
            <span className="role-step-label">
              <Zap size={14} />
              PERSONALIZE YOUR EXPERIENCE
            </span>

            <h2>
              Choose Your <span>Role</span>
            </h2>

            <p>
              Select the role that best describes you to continue
              to your workspace.
            </p>
          </div>

          <div className="role-grid">
            {roles.map((role, index) => {
              const RoleIcon = role.icon;
              const isSelected = selectedRole === role.id;

              return (
                <button
                  type="button"
                  key={role.id}
                  style={{ "--card-index": index }}
                  className={`role-card ${role.color} ${isSelected ? "selected" : ""
                    }`}
                  onClick={() => setSelectedRole(role.id)}
                  aria-pressed={isSelected}
                  aria-label={`Select ${role.title}`}
                >
                  {isSelected && (
                    <span className="role-selected-check">
                      <Check size={17} strokeWidth={3} />
                    </span>
                  )}

                  <span className="role-card-topline">
                    <span className="role-card-icon">
                      <RoleIcon size={26} strokeWidth={1.9} />
                    </span>

                    <span className="role-card-indicator">
                      <CircleCheck size={18} />
                    </span>
                  </span>

                  <span className="role-card-title">
                    {role.title}
                  </span>

                  <span className="role-card-description">
                    {role.description}
                  </span>

                  <span className="role-card-bottom">
                    <span className="role-card-badge">
                      {role.badge}
                    </span>
                    <ArrowRight
                      className="role-card-arrow"
                      size={16}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="role-selection-hint">
            <ShieldCheck size={16} />
            Your role determines your workspace experience.
          </div>

          <button
            type="button"
            className="role-continue-button"
            onClick={handleContinue}
          >
            <span>Continue to {next === "signup" ? "Sign Up" : "Login"}</span>
            <span className="role-continue-arrow">
              <ArrowRight size={19} />
            </span>
          </button>

          <button
            type="button"
            className="role-back-button"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          <p className="role-footer-note">
            <Sparkles size={13} />
            Your workspace, your way.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ChooseRole;
