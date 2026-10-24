import { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  Clock3,
  FolderKanban,
  Search,
  Plus,
  MoreVertical,
  Mail,
  CheckSquare,
  X,
  Eye,
  Trash2,
  UserRound,
} from "lucide-react";

import "./MyTeam.css";

const INITIAL_MEMBERS = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Frontend Developer",
    email: "alex.morgan@teamflow.com",
    status: "Available",
    tasks: 8,
    completed: 6,
    projects: 2,
    color: "#3b82f6",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "UI/UX Designer",
    email: "sarah.chen@teamflow.com",
    status: "Available",
    tasks: 6,
    completed: 5,
    projects: 3,
    color: "#ec4899",
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "Backend Developer",
    email: "mike.johnson@teamflow.com",
    status: "Away",
    tasks: 7,
    completed: 4,
    projects: 2,
    color: "#0ea5e9",
  },
  {
    id: 4,
    name: "John Doe",
    role: "QA Engineer",
    email: "john.doe@teamflow.com",
    status: "Available",
    tasks: 5,
    completed: 4,
    projects: 2,
    color: "#8b5cf6",
  },
  {
    id: 5,
    name: "Emily Davis",
    role: "DevOps Engineer",
    email: "emily.davis@teamflow.com",
    status: "Available",
    tasks: 9,
    completed: 7,
    projects: 4,
    color: "#f97316",
  },
  {
    id: 6,
    name: "David Wilson",
    role: "Product Designer",
    email: "david.wilson@teamflow.com",
    status: "Away",
    tasks: 4,
    completed: 3,
    projects: 2,
    color: "#14b8a6",
  },
  {
    id: 7,
    name: "Olivia Brown",
    role: "Full Stack Developer",
    email: "olivia.brown@teamflow.com",
    status: "Available",
    tasks: 8,
    completed: 6,
    projects: 3,
    color: "#a855f7",
  },
  {
    id: 8,
    name: "Daniel Lee",
    role: "Backend Developer",
    email: "daniel.lee@teamflow.com",
    status: "Available",
    tasks: 6,
    completed: 5,
    projects: 2,
    color: "#64748b",
  },
];

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Product Designer",
  "QA Engineer",
  "DevOps Engineer",
  "Project Manager",
];

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MyTeam() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [menuMember, setMenuMember] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Frontend Developer",
    status: "Available",
  });

  const availableCount = members.filter(
    (member) => member.status === "Available"
  ).length;

  const awayCount = members.filter(
    (member) => member.status === "Away"
  ).length;

  const totalTasks = members.reduce(
    (sum, member) => sum + member.tasks,
    0
  );

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase()) ||
        member.role.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All Roles" || member.role === roleFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        member.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, search, roleFilter, statusFilter]);

  function handleAddMember(event) {
    event.preventDefault();

    const newMember = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
      tasks: 0,
      completed: 0,
      projects: 0,
      color: "#7c5cff",
    };

    setMembers((previous) => [...previous, newMember]);

    setForm({
      name: "",
      email: "",
      role: "Frontend Developer",
      status: "Available",
    });

    setShowForm(false);
    setSearch("");
    setRoleFilter("All Roles");
    setStatusFilter("All Status");
  }

  function handleDeleteMember(id) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this team member?"
    );

    if (!confirmed) return;

    setMembers((previous) =>
      previous.filter((member) => member.id !== id)
    );

    setMenuMember(null);

    if (selectedMember?.id === id) {
      setSelectedMember(null);
    }
  }

  return (
    <div className="mt-page">
      {/* Header */}
      <header className="mt-header">
        <div>
          <div className="mt-eyebrow">TEAM MANAGEMENT</div>
          <h1>My Team</h1>
          <p>
            Manage your team members, check availability, and track
            individual workloads.
          </p>
        </div>

        <button
          className="mt-primary-btn"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Add Member
        </button>
      </header>

      {/* Statistics */}
      <section className="mt-stats">
        <div className="mt-stat-card">
          <div className="mt-stat-icon purple">
            <Users size={22} />
          </div>

          <div>
            <span>Total Members</span>
            <h2>{members.length}</h2>
            <small>People in your team</small>
          </div>
        </div>

        <div className="mt-stat-card">
          <div className="mt-stat-icon green">
            <UserCheck size={22} />
          </div>

          <div>
            <span>Available</span>
            <h2>{availableCount}</h2>
            <small>Ready to collaborate</small>
          </div>
        </div>

        <div className="mt-stat-card">
          <div className="mt-stat-icon orange">
            <Clock3 size={22} />
          </div>

          <div>
            <span>Away</span>
            <h2>{awayCount}</h2>
            <small>Currently unavailable</small>
          </div>
        </div>

        <div className="mt-stat-card">
          <div className="mt-stat-icon blue">
            <CheckSquare size={22} />
          </div>

          <div>
            <span>Assigned Tasks</span>
            <h2>{totalTasks}</h2>
            <small>Across all team members</small>
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="mt-panel">
        <div className="mt-panel-heading">
          <div>
            <h2>
              Team Members
              <span className="mt-count">{filteredMembers.length}</span>
            </h2>
            <p>View and manage your team's members.</p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="mt-toolbar">
          <div className="mt-search">
            <Search size={18} />

            <input
              type="search"
              placeholder="Search name, email, or role..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            aria-label="Filter by role"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option>All Roles</option>
            {ROLES.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>

          <select
            aria-label="Filter by availability"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All Status</option>
            <option>Available</option>
            <option>Away</option>
          </select>
        </div>

        {/* Member cards */}
        {filteredMembers.length > 0 ? (
          <div className="mt-grid">
            {filteredMembers.map((member) => {
              const progress =
                member.tasks > 0
                  ? Math.round(
                      (member.completed / member.tasks) * 100
                    )
                  : 0;

              return (
                <article className="mt-member-card" key={member.id}>
                  <div className="mt-member-top">
                    <div
                      className="mt-avatar"
                      style={{ background: member.color }}
                    >
                      {getInitials(member.name)}
                    </div>

                    <button
                      className="mt-menu-btn"
                      aria-label={`Actions for ${member.name}`}
                      aria-expanded={menuMember === member.id}
                      onClick={() =>
                        setMenuMember(
                          menuMember === member.id ? null : member.id
                        )
                      }
                    >
                      <MoreVertical size={20} />
                    </button>

                    {menuMember === member.id && (
                      <div className="mt-dropdown">
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setMenuMember(null);
                          }}
                        >
                          <Eye size={15} />
                          View Profile
                        </button>

                        <button
                          className="mt-delete-action"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash2 size={15} />
                          Remove Member
                        </button>
                      </div>
                    )}
                  </div>

                  <h3>{member.name}</h3>
                  <p className="mt-role">{member.role}</p>

                  <div className="mt-email">
                    <Mail size={15} />
                    <span title={member.email}>{member.email}</span>
                  </div>

                  <div className="mt-status-row">
                    <span className={`mt-status ${member.status.toLowerCase()}`}>
                      <i />
                      {member.status}
                    </span>

                    <span className="mt-project-count">
                      <FolderKanban size={14} />
                      {member.projects} projects
                    </span>
                  </div>

                  <div className="mt-progress-heading">
                    <span>Task completion</span>
                    <b>{progress}%</b>
                  </div>

                  <div
                    className="mt-progress-track"
                    role="progressbar"
                    aria-label={`${member.name} task completion`}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="mt-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mt-task-summary">
                    <span>
                      {member.completed} of {member.tasks} tasks completed
                    </span>

                    <button
                      onClick={() => setSelectedMember(member)}
                    >
                      View Profile
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-empty">
            <UserRound size={36} />
            <h3>No team members found</h3>
            <p>Try changing your search or filters.</p>

            <button
              onClick={() => {
                setSearch("");
                setRoleFilter("All Roles");
                setStatusFilter("All Status");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Add member modal */}
      {showForm && (
        <div
          className="mt-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <div
            className="mt-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mt-add-title"
          >
            <div className="mt-modal-header">
              <div>
                <h2 id="mt-add-title">Add Team Member</h2>
                <p>Enter the new member's details.</p>
              </div>

              <button
                className="mt-close-btn"
                aria-label="Close dialog"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMember}>
              <label>
                Full Name
                <input
                  required
                  maxLength={80}
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                />
              </label>

              <label>
                Email Address
                <input
                  required
                  type="email"
                  maxLength={254}
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                />
              </label>

              <label>
                Role
                <select
                  value={form.role}
                  onChange={(event) =>
                    setForm({ ...form, role: event.target.value })
                  }
                >
                  {ROLES.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </label>

              <label>
                Availability
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value })
                  }
                >
                  <option>Available</option>
                  <option>Away</option>
                </select>
              </label>

              <div className="mt-modal-actions">
                <button
                  type="button"
                  className="mt-secondary-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="mt-primary-btn">
                  <Plus size={17} />
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member profile modal */}
      {selectedMember && (
        <div
          className="mt-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMember(null);
            }
          }}
        >
          <div
            className="mt-modal mt-profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mt-profile-title"
          >
            <div className="mt-modal-header">
              <h2 id="mt-profile-title">Member Profile</h2>

              <button
                className="mt-close-btn"
                aria-label="Close profile"
                onClick={() => setSelectedMember(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-profile-info">
              <div
                className="mt-avatar mt-avatar-large"
                style={{ background: selectedMember.color }}
              >
                {getInitials(selectedMember.name)}
              </div>

              <h3>{selectedMember.name}</h3>
              <p>{selectedMember.role}</p>

              <span
                className={`mt-status ${selectedMember.status.toLowerCase()}`}
              >
                <i />
                {selectedMember.status}
              </span>
            </div>

            <div className="mt-profile-details">
              <div>
                <span>Email</span>
                <b>{selectedMember.email}</b>
              </div>

              <div>
                <span>Assigned Tasks</span>
                <b>{selectedMember.tasks}</b>
              </div>

              <div>
                <span>Completed Tasks</span>
                <b>{selectedMember.completed}</b>
              </div>

              <div>
                <span>Assigned Projects</span>
                <b>{selectedMember.projects}</b>
              </div>
            </div>

            <button
              className="mt-primary-btn mt-profile-close"
              onClick={() => setSelectedMember(null)}
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}