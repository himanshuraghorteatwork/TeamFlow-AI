
import { useMemo, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  MoreHorizontal,
  Mail,
  X,
  Trash2,
  Send,
  ChevronDown,
  UsersRound,
  UserRound,
} from "lucide-react";

import EmployeeShell from "./EmployeeShell";
import { initialMembers, teamRoles, teamStatuses } from "./teamData";
import "./Team.css";

const emptyForm = {
  name: "",
  email: "",
  role: "Member",
};

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function Team() {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [showInvite, setShowInvite] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const stats = useMemo(
    () => [
      {
        label: "Total Members",
        value: members.length,
        icon: UsersRound,
        color: "purple",
        detail: "People in your workspace",
      },
      {
        label: "Active Members",
        value: members.filter((member) => member.status === "Active").length,
        icon: CheckCircle2,
        color: "green",
        detail: "Currently active",
      },
      {
        label: "Pending Invites",
        value: members.filter((member) => member.status === "Pending").length,
        icon: Clock3,
        color: "orange",
        detail: "Awaiting acceptance",
      },
      {
        label: "Administrators",
        value: members.filter((member) => member.role === "Admin").length,
        icon: ShieldCheck,
        color: "blue",
        detail: "Workspace administrators",
      },
    ],
    [members]
  );

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.department.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "All Roles" || member.role === roleFilter;

      const matchesStatus =
        statusFilter === "All Statuses" ||
        member.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, search, roleFilter, statusFilter]);

  function updateForm(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setFormError("");
  }

  function handleInvite(event) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name || !email) {
      setFormError("Please enter the member's name and email.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (members.some((member) => member.email.toLowerCase() === email)) {
      setFormError("This email address is already in the team.");
      return;
    }

    const newMember = {
      id: Date.now(),
      name,
      email,
      role: form.role,
      status: "Pending",
      joinedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      department: "Unassigned",
    };

    setMembers((previous) => [newMember, ...previous]);
    setSearch("");
    setRoleFilter("All Roles");
    setStatusFilter("All Statuses");
    setForm(emptyForm);
    setFormError("");
    setShowInvite(false);
  }

  function changeRole(id, role) {
    setMembers((previous) =>
      previous.map((member) =>
        member.id === id ? { ...member, role } : member
      )
    );
    setOpenMenu(null);
  }

  function removeMember(id) {
    const member = members.find((item) => item.id === id);

    if (!member) return;

    const confirmed = window.confirm(
      `Remove ${member.name} from this team?`
    );

    if (!confirmed) return;

    setMembers((previous) => previous.filter((item) => item.id !== id));
    setOpenMenu(null);
  }

  function resendInvite(id) {
    const member = members.find((item) => item.id === id);

    if (!member) return;

    window.alert(
      `Demo action: invitation reminder for ${member.email} is not connected to an email service yet.`
    );

    setOpenMenu(null);
  }

  return (
    <EmployeeShell activeRoute="/employee/team">
      <div className="team-main">
        <div className="team-content">
          <header className="team-header">
            <div>
              <div className="team-breadcrumb">
                Workspace <span>/</span> Team
              </div>
              <h1>Team Members</h1>
              <p>
                Manage your people, collaborate better, and control
                workspace access.
              </p>
            </div>

            <button
              className="team-primary-btn"
              onClick={() => {
                setForm(emptyForm);
                setFormError("");
                setShowInvite(true);
              }}
            >
              <UserPlus size={18} />
              <span>Invite Member</span>
            </button>
          </header>

          <section className="team-stats">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article className="team-stat-card" key={stat.label}>
                  <div className="team-stat-top">
                    <div className={`team-stat-icon ${stat.color}`}>
                      <Icon size={20} />
                    </div>
                    <span className="team-stat-label">{stat.label}</span>
                  </div>

                  <div className="team-stat-bottom">
                    <strong>{stat.value}</strong>
                    <span>{stat.detail}</span>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="team-panel">
            <div className="team-panel-heading">
              <div>
                <h2>Your Workspace Team</h2>
                <p>
                  View and manage everyone who belongs to your workspace.
                </p>
              </div>
              <span className="team-count">
                {filteredMembers.length}{" "}
                {filteredMembers.length === 1 ? "member" : "members"}
              </span>
            </div>

            <div className="team-toolbar">
              <div className="team-search">
                <Search size={18} />
                <input
                  type="search"
                  placeholder="Search name, email, or department..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search team members"
                />
                {search && (
                  <button
                    type="button"
                    className="team-clear-search"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="team-filters">
                <label className="team-select-wrap">
                  <span className="sr-only">Filter by role</span>
                  <select
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value)}
                  >
                    <option>All Roles</option>
                    {teamRoles.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} />
                </label>

                <label className="team-select-wrap">
                  <span className="sr-only">Filter by status</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option>All Statuses</option>
                    {teamStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} />
                </label>
              </div>
            </div>

            <div className="team-table-wrap">
              <table className="team-table">
                <thead>
                  <tr>
                    <th className="tf-th-num">Sr</th>
                    <th>Member</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined / Invited</th>
                    <th aria-label="Actions"></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMembers.map((member, idx) => (
                    <tr key={member.id}>
                      <td className="tf-td-num">
                        <span className="tf-row-num-badge">{idx + 1}</span>
                      </td>
                      <td>
                        <div className="team-member-cell">
                          <div className="team-avatar">
                            {getInitials(member.name)}
                          </div>
                          <div className="team-member-info">
                            <strong>{member.name}</strong>
                            <span>{member.email}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="team-department">
                          {member.department}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`team-role-badge ${member.role
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {member.role === "Admin" && (
                            <ShieldCheck size={13} />
                          )}
                          {member.role}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`team-status ${member.status.toLowerCase()}`}
                        >
                          <span className="team-status-dot" />
                          {member.status}
                        </span>
                      </td>

                      <td>
                        <span className="team-date">
                          {member.joinedDate}
                        </span>
                      </td>

                      <td>
                        <div className="team-action-wrap">
                          <button
                            type="button"
                            className="team-icon-btn"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === member.id ? null : member.id
                              )
                            }
                            aria-label={`Actions for ${member.name}`}
                            aria-expanded={openMenu === member.id}
                          >
                            <MoreHorizontal size={20} />
                          </button>

                          {openMenu === member.id && (
                            <>
                              <button
                                type="button"
                                className="team-menu-backdrop"
                                aria-label="Close member actions"
                                onClick={() => setOpenMenu(null)}
                              />
                              <div className="team-action-menu">
                                <div className="team-menu-title">
                                  Change role
                                </div>

                                {teamRoles.map((role) => (
                                  <button
                                    type="button"
                                    key={role}
                                    className={
                                      member.role === role ? "selected" : ""
                                    }
                                    onClick={() => changeRole(member.id, role)}
                                  >
                                    <UserRound size={15} />
                                    {role}
                                    {member.role === role && (
                                      <CheckCircle2 size={15} />
                                    )}
                                  </button>
                                ))}

                                {member.status === "Pending" && (
                                  <button
                                    type="button"
                                    onClick={() => resendInvite(member.id)}
                                  >
                                    <Send size={15} />
                                    Resend invite
                                  </button>
                                )}

                                <button
                                  type="button"
                                  className="danger"
                                  onClick={() => removeMember(member.id)}
                                >
                                  <Trash2 size={15} />
                                  Remove member
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredMembers.length === 0 && (
                <div className="team-empty">
                  <div className="team-empty-icon">
                    <Users size={25} />
                  </div>
                  <h3>No members found</h3>
                  <p>
                    Try another search term or change your filters.
                  </p>
                  <button
                    type="button"
                    className="team-reset-btn"
                    onClick={() => {
                      setSearch("");
                      setRoleFilter("All Roles");
                      setStatusFilter("All Statuses");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            <footer className="team-table-footer">
              <span>
                Showing {filteredMembers.length} of {members.length} members
              </span>
              <span className="team-footer-note">
                <ShieldCheck size={15} />
                Workspace access management
              </span>
            </footer>
          </section>

          <section className="team-help-card">
            <div className="team-help-icon">
              <Mail size={21} />
            </div>
            <div>
              <h3>Grow your team</h3>
              <p>
                Invite your colleagues to collaborate on projects, tasks,
                and conversations in one place.
              </p>
            </div>
            <button
              type="button"
              className="team-secondary-btn"
              onClick={() => setShowInvite(true)}
            >
              <UserPlus size={16} />
              Add a teammate
            </button>
          </section>
        </div>
      </div>

      {showInvite && (
        <div
          className="team-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowInvite(false);
              setFormError("");
            }
          }}
        >
          <section
            className="team-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-modal-title"
          >
            <div className="team-modal-header">
              <div className="team-modal-heading-icon">
                <UserPlus size={21} />
              </div>
              <button
                type="button"
                className="team-modal-close"
                onClick={() => {
                  setShowInvite(false);
                  setFormError("");
                }}
                aria-label="Close invitation form"
              >
                <X size={20} />
              </button>
            </div>

            <h2 id="team-modal-title">Invite a team member</h2>
            <p className="team-modal-description">
              Add a colleague to your workspace. Their status will be set
              to Pending until they accept the invitation.
            </p>

            <form className="team-invite-form" onSubmit={handleInvite}>
              <label>
                Full name
                <input
                  type="text"
                  placeholder="e.g. Jordan Lee"
                  value={form.name}
                  onChange={(event) =>
                    updateForm("name", event.target.value)
                  }
                  autoFocus
                  required
                />
              </label>

              <label>
                Work email
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(event) =>
                    updateForm("email", event.target.value)
                  }
                  required
                />
              </label>

              <label>
                Assign role
                <select
                  value={form.role}
                  onChange={(event) =>
                    updateForm("role", event.target.value)
                  }
                >
                  {teamRoles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </label>

              {formError && (
                <p className="team-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="team-modal-actions">
                <button
                  type="button"
                  className="team-cancel-btn"
                  onClick={() => {
                    setShowInvite(false);
                    setFormError("");
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="team-primary-btn">
                  <Send size={16} />
                  Add member
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </EmployeeShell>
  );
}

export default Team;
