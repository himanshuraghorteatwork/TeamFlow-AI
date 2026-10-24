import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Mail,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { initialMembers, teamRoles, teamStatuses } from "../Employee/teamData.js";
import "./TeamMember1.css";

const EMPTY_FORM = { name: "", email: "", role: "Member" };

function getInitials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() || "").join("");
}

export default function TeamMember1() {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [showInvite, setShowInvite] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);

  const stats = useMemo(() => [
    { label: "Total Members", value: members.length, detail: "People in your workspace", icon: Users, tone: "purple" },
    { label: "Active Members", value: members.filter(member => member.status === "Active").length, detail: "Currently active", icon: CheckCircle2, tone: "green" },
    { label: "Pending Invites", value: members.filter(member => member.status === "Pending").length, detail: "Awaiting acceptance", icon: Clock3, tone: "orange" },
    { label: "Administrators", value: members.filter(member => member.role === "Admin").length, detail: "Workspace administrators", icon: ShieldCheck, tone: "blue" },
  ], [members]);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return members.filter(member => {
      const matchesSearch = !query || [member.name, member.email, member.department]
        .some(value => value?.toLowerCase().includes(query));
      const matchesRole = roleFilter === "All Roles" || member.role === roleFilter;
      const matchesStatus = statusFilter === "All Statuses" || member.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, search, roleFilter, statusFilter]);

  function closeInvite() {
    setShowInvite(false);
    setForm(EMPTY_FORM);
    setFormError("");
  }

  function inviteMember(event) {
    event.preventDefault();
    const name = form.name.trim().replace(/\s+/g, " ");
    const email = form.email.trim().toLowerCase();
    if (!name || name.length < 2 || name.length > 80) {
      setFormError("Enter a name between 2 and 80 characters.");
      return;
    }
    if (!/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(name)) {
      setFormError("Enter a valid name using letters, spaces, hyphens, or apostrophes.");
      return;
    }
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(email)) {
      setFormError("Enter a valid work email address.");
      return;
    }
    if (members.some(member => member.email.toLowerCase() === email)) {
      setFormError("This email address is already in your team.");
      return;
    }
    if (!teamRoles.includes(form.role)) {
      setFormError("Select a valid team role.");
      return;
    }

    setMembers(previous => [{
      id: Date.now(),
      name,
      email,
      role: form.role,
      status: "Pending",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      department: "Unassigned",
    }, ...previous]);
    setSearch("");
    setRoleFilter("All Roles");
    setStatusFilter("All Statuses");
    closeInvite();
  }

  function changeRole(id, role) {
    setMembers(previous => previous.map(member => member.id === id ? { ...member, role } : member));
    setActiveMenu(null);
  }

  function removeMember(id) {
    const member = members.find(item => item.id === id);
    if (!member || !window.confirm(`Remove ${member.name} from this team?`)) return;
    setMembers(previous => previous.filter(item => item.id !== id));
    setActiveMenu(null);
  }

  return (
    <section className="tl-member-page">
      <header className="tl-member-header">
        <div>
          <span className="tl-member-eyebrow">TEAM WORKSPACE</span>
          <h1>Team Members</h1>
          <p>Manage your people, collaborate better, and control workspace access.</p>
        </div>
        <button type="button" className="tl-member-primary" onClick={() => setShowInvite(true)}>
          <UserPlus size={17} /> Invite member
        </button>
      </header>

      <section className="tl-member-stats" aria-label="Team summary">
        {stats.map(({ label, value, detail, icon: Icon, tone }) => (
          <article className="tl-member-stat" key={label}>
            <span className={`tl-member-stat-icon ${tone}`}><Icon size={20} aria-hidden="true" /></span>
            <div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
          </article>
        ))}
      </section>

      <section className="tl-member-panel">
        <header className="tl-member-panel-header">
          <div><h2>Your Workspace Team</h2><p>View and manage everyone who belongs to your workspace.</p></div>
          <span className="tl-member-count">{filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}</span>
        </header>

        <div className="tl-member-toolbar">
          <label className="tl-member-search">
            <Search size={17} aria-hidden="true" />
            <input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name, email, or department..." aria-label="Search team members" />
            {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><X size={15} /></button>}
          </label>
          <div className="tl-member-filters">
            <label>
              <span className="tl-member-sr-only">Filter by role</span>
              <select value={roleFilter} onChange={event => setRoleFilter(event.target.value)}>
                <option>All Roles</option>{teamRoles.map(role => <option key={role}>{role}</option>)}
              </select><ChevronDown size={14} aria-hidden="true" />
            </label>
            <label>
              <span className="tl-member-sr-only">Filter by status</span>
              <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
                <option>All Statuses</option>{teamStatuses.map(status => <option key={status}>{status}</option>)}
              </select><ChevronDown size={14} aria-hidden="true" />
            </label>
          </div>
        </div>

        <div className="tl-member-table-wrap">
          <table className="tl-member-table">
            <thead><tr><th>Member</th><th>Department</th><th>Role</th><th>Status</th><th>Joined / Invited</th><th aria-label="Actions" /></tr></thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id}>
                  <td><div className="tl-member-identity">
                    <span className="tl-member-avatar">{getInitials(member.name)}</span>
                    <span><strong>{member.name}</strong><small>{member.email}</small></span>
                  </div></td>
                  <td><span className="tl-member-department">{member.department}</span></td>
                  <td><span className={`tl-member-role ${member.role.toLowerCase()}`}>{member.role === "Admin" && <ShieldCheck size={13} />}{member.role}</span></td>
                  <td><span className={`tl-member-status ${member.status.toLowerCase()}`}><i />{member.status}</span></td>
                  <td><span className="tl-member-date">{member.joinedDate}</span></td>
                  <td>
                    <div className="tl-member-actions">
                      <button type="button" aria-label={`Actions for ${member.name}`} aria-expanded={activeMenu === member.id} onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)}><MoreHorizontal size={18} /></button>
                      {activeMenu === member.id && <div className="tl-member-menu">
                        <strong>Change role</strong>
                        {teamRoles.map(role => <button type="button" key={role} className={member.role === role ? "selected" : ""} onClick={() => changeRole(member.id, role)}>{role}{member.role === role && <CheckCircle2 size={14} />}</button>)}
                        {member.status === "Pending" && <button type="button" onClick={() => {
                          window.alert(`Invitation reminder for ${member.email} is not connected to an email service yet.`);
                          setActiveMenu(null);
                        }}>Resend invite</button>}
                        <button type="button" className="danger" onClick={() => removeMember(member.id)}><Trash2 size={14} />Remove member</button>
                      </div>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMembers.length === 0 && <div className="tl-member-empty">
            <Users size={28} /><h3>No members found</h3><p>Try another search term or change your filters.</p>
            <button type="button" onClick={() => { setSearch(""); setRoleFilter("All Roles"); setStatusFilter("All Statuses"); }}>Clear filters</button>
          </div>}
        </div>

        <footer className="tl-member-footer">
          <span>Showing {filteredMembers.length} of {members.length} members</span>
          <span><ShieldCheck size={14} /> Workspace access management</span>
        </footer>
      </section>

      <section className="tl-member-help">
        <span className="tl-member-help-icon"><Mail size={20} /></span>
        <div><h3>Grow your team</h3><p>Invite colleagues to collaborate on projects, tasks, and conversations in one place.</p></div>
        <button type="button" onClick={() => setShowInvite(true)}><UserPlus size={15} /> Add a teammate</button>
      </section>

      {showInvite && <div className="tl-member-modal-backdrop" onMouseDown={event => {
        if (event.target === event.currentTarget) closeInvite();
      }}>
        <section className="tl-member-modal" role="dialog" aria-modal="true" aria-labelledby="tl-member-modal-title">
          <header>
            <span className="tl-member-modal-icon"><UserPlus size={20} /></span>
            <div><h2 id="tl-member-modal-title">Invite a team member</h2><p>They’ll receive an invitation to join your workspace.</p></div>
            <button type="button" aria-label="Close invite form" onClick={closeInvite}><X size={18} /></button>
          </header>
          <form onSubmit={inviteMember}>
            <label>Full name
              <input autoFocus value={form.name} onChange={event => { setForm(previous => ({ ...previous, name: event.target.value })); setFormError(""); }} placeholder="e.g. Jordan Lee" maxLength={80} required />
            </label>
            <label>Work email
              <input type="email" value={form.email} onChange={event => { setForm(previous => ({ ...previous, email: event.target.value })); setFormError(""); }} placeholder="name@company.com" maxLength={254} required />
            </label>
            <label>Role
              <select value={form.role} onChange={event => setForm(previous => ({ ...previous, role: event.target.value }))}>{teamRoles.map(role => <option key={role}>{role}</option>)}</select>
            </label>
            {formError && <p className="tl-member-error" role="alert">{formError}</p>}
            <footer><button type="button" onClick={closeInvite}>Cancel</button><button type="submit" className="submit"><UserPlus size={15} /> Send invitation</button></footer>
          </form>
        </section>
      </div>}
    </section>
  );
}