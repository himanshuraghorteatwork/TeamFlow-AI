import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Edit2,
  Copy,
  Check,
  LayoutGrid,
  List,
  MessageSquare,
  ExternalLink,
  ArrowUpDown,
  Briefcase,
  Sparkles,
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
    joinedDate: "Mar 2024",
    phone: "+1 (555) 234-5678",
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
    joinedDate: "Jan 2024",
    phone: "+1 (555) 345-6789",
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
    joinedDate: "May 2024",
    phone: "+1 (555) 456-7890",
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
    joinedDate: "Feb 2024",
    phone: "+1 (555) 567-8901",
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
    joinedDate: "Nov 2023",
    phone: "+1 (555) 678-9012",
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
    joinedDate: "Jun 2024",
    phone: "+1 (555) 789-0123",
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
    joinedDate: "Apr 2024",
    phone: "+1 (555) 890-1234",
  },
  {
    id: 8,
    name: "Daniel Lee",
    role: "Backend Developer",
    email: "daniel.lee@teamflow.com",
    status: "In a Meeting",
    tasks: 6,
    completed: 5,
    projects: 2,
    color: "#64748b",
    joinedDate: "Aug 2024",
    phone: "+1 (555) 901-2345",
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
  "Mobile Developer",
  "Project Manager",
];

const STATUSES = ["All Status", "Available", "Away", "In a Meeting", "On Leave"];

const SORT_OPTIONS = [
  "Name (A-Z)",
  "Name (Z-A)",
  "Most Tasks",
  "Highest Completion %",
  "Most Projects",
];

const COLOR_PALETTE = [
  { label: "Blue", value: "#3b82f6" },
  { label: "Pink", value: "#ec4899" },
  { label: "Sky", value: "#0ea5e9" },
  { label: "Purple", value: "#8b5cf6" },
  { label: "Orange", value: "#f97316" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Violet", value: "#a855f7" },
  { label: "Slate", value: "#64748b" },
];

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const MEMBERS_STORAGE_KEY = "teamflow_members";

function getInitialMembers() {
  try {
    const saved = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return INITIAL_MEMBERS;
}

export default function MyTeam() {
  const navigate = useNavigate();
  const [members, setMembers] = useState(getInitialMembers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Name (A-Z)");
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem("teamflow_myteam_view") || "grid";
    } catch {
      return "grid";
    }
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editMemberTarget, setEditMemberTarget] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [menuMemberId, setMenuMemberId] = useState(null);
  const [deleteMemberTarget, setDeleteMemberTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    role: "Frontend Developer",
    status: "Available",
    tasks: 4,
    completed: 2,
    projects: 2,
    color: "#3b82f6",
    phone: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "Frontend Developer",
    status: "Available",
    tasks: 0,
    completed: 0,
    projects: 0,
    color: "#3b82f6",
    phone: "",
  });

  const menuRef = useRef(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Sync members to localStorage and event bus
  useEffect(() => {
    try {
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
      window.dispatchEvent(new Event("teamflow_data_update"));
    } catch {
      // ignore
    }
  }, [members]);

  // Persist view mode preference
  const toggleViewMode = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem("teamflow_myteam_view", mode);
    } catch {
      // ignore
    }
  };

  // Toast notification helper
  const showToast = (message) => {
    setToast(message);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Close menus and modals on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuMemberId(null);
        setShowAddModal(false);
        setEditMemberTarget(null);
        setSelectedMember(null);
        setDeleteMemberTarget(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close action dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuMemberId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Summary Metrics
  const totalCount = members.length;
  const availableCount = members.filter((m) => m.status === "Available").length;
  const awayCount = members.filter((m) => m.status === "Away" || m.status === "In a Meeting" || m.status === "On Leave").length;
  const totalTasks = members.reduce((sum, m) => sum + (Number(m.tasks) || 0), 0);
  const totalCompleted = members.reduce((sum, m) => sum + (Number(m.completed) || 0), 0);
  const squadVelocityRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  // Filter and Sort members
  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = members.filter((member) => {
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query);

      const matchesRole = roleFilter === "All Roles" || member.role === roleFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        (statusFilter === "Away" ? (member.status === "Away" || member.status === "In a Meeting" || member.status === "On Leave") : member.status === statusFilter);

      return matchesSearch && matchesRole && matchesStatus;
    });

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "Name (A-Z)") return a.name.localeCompare(b.name);
      if (sortBy === "Name (Z-A)") return b.name.localeCompare(a.name);
      if (sortBy === "Most Tasks") return (Number(b.tasks) || 0) - (Number(a.tasks) || 0);
      if (sortBy === "Highest Completion %") {
        const rateA = a.tasks > 0 ? a.completed / a.tasks : 0;
        const rateB = b.tasks > 0 ? b.completed / b.tasks : 0;
        return rateB - rateA;
      }
      if (sortBy === "Most Projects") return (Number(b.projects) || 0) - (Number(a.projects) || 0);
      return 0;
    });

    return result;
  }, [members, search, roleFilter, statusFilter, sortBy]);

  // Handle Add Member
  const handleAddMember = (e) => {
    e.preventDefault();
    const name = addForm.name.trim();
    const email = addForm.email.trim().toLowerCase();

    if (!name || name.length < 2) {
      showToast("Please enter a valid member name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid work email address.");
      return;
    }

    if (members.some((m) => m.email.toLowerCase() === email)) {
      showToast("A team member with that email address already exists.");
      return;
    }

    setMembers((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((m) => Number(m.id) || 0)) + 1 : 1;
      const newMember = {
        id: nextId,
        name,
        email,
        role: addForm.role,
        status: addForm.status,
        tasks: Math.max(0, parseInt(addForm.tasks, 10) || 0),
        completed: Math.max(0, parseInt(addForm.completed, 10) || 0),
        projects: Math.max(0, parseInt(addForm.projects, 10) || 0),
        color: addForm.color || "#3b82f6",
        joinedDate: "Just now",
        phone: addForm.phone.trim() || "+1 (555) 000-0000",
      };
      return [newMember, ...prev];
    });

    setShowAddModal(false);
    setAddForm({
      name: "",
      email: "",
      role: "Frontend Developer",
      status: "Available",
      tasks: 4,
      completed: 2,
      projects: 2,
      color: "#3b82f6",
      phone: "",
    });
    showToast(`Squad member "${name}" added successfully.`);
  };

  // Open Edit Modal
  const startEditMember = (member) => {
    setEditMemberTarget(member);
    setEditForm({
      name: member.name,
      email: member.email,
      role: member.role,
      status: member.status,
      tasks: member.tasks,
      completed: member.completed,
      projects: member.projects,
      color: member.color || "#3b82f6",
      phone: member.phone || "+1 (555) 000-0000",
    });
    setMenuMemberId(null);
  };

  // Handle Save Edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editMemberTarget) return;

    const name = editForm.name.trim();
    const email = editForm.email.trim().toLowerCase();

    if (!name || name.length < 2) {
      showToast("Please enter a valid member name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email address.");
      return;
    }

    // Check duplicate email with another member
    if (members.some((m) => m.id !== editMemberTarget.id && m.email.toLowerCase() === email)) {
      showToast("That email address is already used by another team member.");
      return;
    }

    const updated = {
      ...editMemberTarget,
      name,
      email,
      role: editForm.role,
      status: editForm.status,
      tasks: Math.max(0, parseInt(editForm.tasks, 10) || 0),
      completed: Math.max(0, parseInt(editForm.completed, 10) || 0),
      projects: Math.max(0, parseInt(editForm.projects, 10) || 0),
      color: editForm.color,
      phone: editForm.phone.trim() || editMemberTarget.phone || "+1 (555) 000-0000",
    };

    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    if (selectedMember?.id === updated.id) {
      setSelectedMember(updated);
    }
    setEditMemberTarget(null);
    showToast(`Updated details for "${updated.name}".`);
  };

  // Toggle Availability Status Quick Action
  const toggleMemberStatus = (member) => {
    const nextStatus = member.status === "Available" ? "Away" : "Available";
    const updated = { ...member, status: nextStatus };
    setMembers((prev) => prev.map((m) => (m.id === member.id ? updated : m)));
    if (selectedMember?.id === member.id) {
      setSelectedMember(updated);
    }
    setMenuMemberId(null);
    showToast(`${member.name} is now marked as ${nextStatus}.`);
  };

  // Confirm Delete
  const confirmDeleteMember = () => {
    if (!deleteMemberTarget) return;
    const removedName = deleteMemberTarget.name;
    setMembers((prev) => prev.filter((m) => m.id !== deleteMemberTarget.id));
    if (selectedMember?.id === deleteMemberTarget.id) {
      setSelectedMember(null);
    }
    setDeleteMemberTarget(null);
    showToast(`"${removedName}" removed from team roster.`);
  };

  // Copy Email Helper
  const handleCopyEmail = (email) => {
    try {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
      showToast(`Copied ${email} to clipboard.`);
    } catch {
      // fallback
    }
  };

  // Quick stat filter click
  const handleStatFilter = (status) => {
    setStatusFilter(status);
    setSearch("");
  };

  return (
    <div className="mt-page">
      {/* Toast Notification */}
      {toast && (
        <aside className="mt-toast-alert" role="status" aria-live="polite">
          <Sparkles size={16} />
          <span>{toast}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss">
            <X size={14} />
          </button>
        </aside>
      )}

      {/* Header */}
      <header className="mt-header">
        <div>
          <div className="mt-eyebrow">ENGINEERING SQUAD &amp; TALENT</div>
          <h1>My Team</h1>
          <p>
            Manage your squad members, balance sprint capacity, monitor live task progress, and collaborate seamlessly.
          </p>
        </div>

        <div className="mt-header-actions">
          <div className="mt-view-toggle-wrap" role="group" aria-label="View format">
            <button
              type="button"
              className={`mt-view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => toggleViewMode("grid")}
              title="Grid Card View"
              aria-label="Grid Card View"
            >
              <LayoutGrid size={16} />
              <span>Cards</span>
            </button>
            <button
              type="button"
              className={`mt-view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => toggleViewMode("list")}
              title="Table List View"
              aria-label="Table List View"
            >
              <List size={16} />
              <span>Table</span>
            </button>
          </div>

          <button
            type="button"
            className="mt-primary-btn"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            <span>Add Member</span>
          </button>
        </div>
      </header>

      {/* Statistics Cards */}
      <section className="mt-stats" aria-label="Squad Overview">
        <button
          type="button"
          className={`mt-stat-card ${statusFilter === "All Status" && !search ? "is-active-filter" : ""}`}
          onClick={() => handleStatFilter("All Status")}
          title="Click to view all squad members"
        >
          <div className="mt-stat-icon purple">
            <Users size={22} />
          </div>
          <div className="mt-stat-content">
            <span className="mt-stat-label">Total Squad</span>
            <h2>{totalCount}</h2>
            <small>Registered teammates</small>
          </div>
        </button>

        <button
          type="button"
          className={`mt-stat-card ${statusFilter === "Available" ? "is-active-filter" : ""}`}
          onClick={() => handleStatFilter("Available")}
          title="Click to filter available members"
        >
          <div className="mt-stat-icon green">
            <UserCheck size={22} />
          </div>
          <div className="mt-stat-content">
            <span className="mt-stat-label">Available Now</span>
            <h2>{availableCount}</h2>
            <small>Active &amp; collaborating</small>
          </div>
        </button>

        <button
          type="button"
          className={`mt-stat-card ${statusFilter === "Away" ? "is-active-filter" : ""}`}
          onClick={() => handleStatFilter("Away")}
          title="Click to filter away/busy members"
        >
          <div className="mt-stat-icon orange">
            <Clock3 size={22} />
          </div>
          <div className="mt-stat-content">
            <span className="mt-stat-label">Away / In Meeting</span>
            <h2>{awayCount}</h2>
            <small>Capacity reserved</small>
          </div>
        </button>

        <div className="mt-stat-card">
          <div className="mt-stat-icon blue">
            <CheckSquare size={22} />
          </div>
          <div className="mt-stat-content">
            <span className="mt-stat-label">Task Velocity</span>
            <h2>{squadVelocityRate}%</h2>
            <small>{totalCompleted} of {totalTasks} tasks done</small>
          </div>
        </div>
      </section>

      {/* Main Panel */}
      <section className="mt-panel">
        <div className="mt-panel-heading">
          <div>
            <h2>
              Team Directory
              <span className="mt-count">{filteredMembers.length}</span>
            </h2>
            <p>Search, filter roles, check workload velocity, and manage squad permissions.</p>
          </div>
        </div>

        {/* Toolbar: Search, Filters, Sort */}
        <div className="mt-toolbar">
          <div className="mt-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search team members"
            />
            {search && (
              <button
                type="button"
                className="mt-clear-search-btn"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="mt-filter-select-wrap">
            <Briefcase size={15} className="mt-select-icon" />
            <select
              aria-label="Filter by role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option>All Roles</option>
              {ROLES.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="mt-filter-select-wrap">
            <UserRound size={15} className="mt-select-icon" />
            <select
              aria-label="Filter by availability status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="mt-filter-select-wrap mt-sort-select">
            <ArrowUpDown size={15} className="mt-select-icon" />
            <select
              aria-label="Sort squad members"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Members Content: GRID or LIST/TABLE */}
        {filteredMembers.length === 0 ? (
          <div className="mt-empty">
            <UserRound size={40} />
            <h3>No squad members match your criteria</h3>
            <p>Try refining your search keyword or resetting the role and availability filters.</p>
            <button
              type="button"
              className="mt-reset-btn"
              onClick={() => {
                setSearch("");
                setRoleFilter("All Roles");
                setStatusFilter("All Status");
                setSortBy("Name (A-Z)");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="mt-grid">
            {filteredMembers.map((member) => {
              const progress =
                member.tasks > 0
                  ? Math.round((member.completed / member.tasks) * 100)
                  : 0;

              const isMenuOpen = menuMemberId === member.id;

              return (
                <article className="mt-member-card" key={member.id}>
                  <div className="mt-member-top">
                    <div
                      className="mt-avatar"
                      style={{ background: member.color || "#3b82f6" }}
                    >
                      {getInitials(member.name)}
                    </div>

                    <div className="mt-menu-wrap" ref={isMenuOpen ? menuRef : null}>
                      <button
                        type="button"
                        className={`mt-menu-btn ${isMenuOpen ? "is-active" : ""}`}
                        aria-label={`Actions for ${member.name}`}
                        aria-expanded={isMenuOpen}
                        onClick={() =>
                          setMenuMemberId(isMenuOpen ? null : member.id)
                        }
                      >
                        <MoreVertical size={18} />
                      </button>

                      {isMenuOpen && (
                        <div className="mt-dropdown">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedMember(member);
                              setMenuMemberId(null);
                            }}
                          >
                            <Eye size={15} />
                            <span>View Profile</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => startEditMember(member)}
                          >
                            <Edit2 size={15} />
                            <span>Edit Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleMemberStatus(member)}
                          >
                            <UserCheck size={15} />
                            <span>
                              Set {member.status === "Available" ? "Away" : "Available"}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setMenuMemberId(null);
                              navigate("/teamlead/chat");
                            }}
                          >
                            <MessageSquare size={15} />
                            <span>Send Message</span>
                          </button>

                          <div className="mt-dropdown-divider" />

                          <button
                            type="button"
                            className="mt-delete-action tl-btn-delete"
                            onClick={() => {
                              setDeleteMemberTarget(member);
                              setMenuMemberId(null);
                            }}
                          >
                            <Trash2 size={15} />
                            <span>Remove Member</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3>{member.name}</h3>
                  <p className="mt-role">{member.role}</p>

                  <div className="mt-email">
                    <Mail size={14} />
                    <span title={member.email}>{member.email}</span>
                  </div>

                  <div className="mt-status-row">
                    <span className={`mt-status ${member.status.toLowerCase().replace(/\s+/g, "-")}`}>
                      <i />
                      {member.status}
                    </span>

                    <span className="mt-project-count">
                      <FolderKanban size={14} />
                      {member.projects} {member.projects === 1 ? "project" : "projects"}
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
                      className={`mt-progress-fill ${progress >= 75 ? "high" : progress >= 50 ? "mid" : "low"}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mt-task-summary">
                    <span>
                      {member.completed} of {member.tasks} tasks completed
                    </span>

                    <div className="mt-card-actions-row">
                      <button
                        type="button"
                        className="mt-card-quick-btn"
                        onClick={() => startEditMember(member)}
                        title="Edit details"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        type="button"
                        className="mt-card-view-btn"
                        onClick={() => setSelectedMember(member)}
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* TABLE / LIST VIEW */
          <div className="mt-table-wrap">
            <table className="mt-table">
              <thead>
                <tr>
                  <th>MEMBER</th>
                  <th>EMAIL ADDRESS</th>
                  <th>STATUS</th>
                  <th>PROJECTS</th>
                  <th>TASK COMPLETION</th>
                  <th className="text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => {
                  const progress =
                    member.tasks > 0
                      ? Math.round((member.completed / member.tasks) * 100)
                      : 0;

                  return (
                    <tr key={member.id}>
                      <td>
                        <div className="mt-table-member-cell">
                          <div
                            className="mt-table-avatar"
                            style={{ background: member.color || "#3b82f6" }}
                          >
                            {getInitials(member.name)}
                          </div>
                          <div>
                            <strong>{member.name}</strong>
                            <small>{member.role}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="mt-table-email-cell">
                          <span>{member.email}</span>
                          <button
                            type="button"
                            className="mt-table-copy-btn"
                            title="Copy email address"
                            onClick={() => handleCopyEmail(member.email)}
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={`mt-status mt-table-status-btn ${member.status.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => toggleMemberStatus(member)}
                          title="Click to toggle status"
                        >
                          <i />
                          {member.status}
                        </button>
                      </td>

                      <td>
                        <span className="mt-table-projects-badge">
                          <FolderKanban size={13} />
                          {member.projects}
                        </span>
                      </td>

                      <td>
                        <div className="mt-table-progress-cell">
                          <div className="mt-table-progress-track">
                            <div
                              className={`mt-table-progress-bar ${progress >= 75 ? "high" : progress >= 50 ? "mid" : "low"}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span>
                            <b>{progress}%</b> ({member.completed}/{member.tasks})
                          </span>
                        </div>
                      </td>

                      <td className="text-right">
                        <div className="mt-table-actions">
                          <button
                            type="button"
                            className="mt-icon-action-btn"
                            title="View Profile"
                            aria-label={`View profile for ${member.name}`}
                            onClick={() => setSelectedMember(member)}
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            className="mt-icon-action-btn"
                            title="Edit Details"
                            aria-label={`Edit ${member.name}`}
                            onClick={() => startEditMember(member)}
                          >
                            <Edit2 size={15} />
                          </button>

                          <button
                            type="button"
                            className="mt-icon-action-btn delete tl-btn-delete"
                            title="Remove Member"
                            aria-label={`Remove ${member.name}`}
                            onClick={() => setDeleteMemberTarget(member)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Panel Footer */}
        <div className="mt-panel-footer">
          <span>
            Showing <strong>{filteredMembers.length}</strong> of {members.length} team members
          </span>
          <div className="mt-footer-nav-links">
            <button
              type="button"
              className="mt-footer-link"
              onClick={() => navigate("/teamlead/workload")}
            >
              <span>Squad Workload Analysis</span>
              <ExternalLink size={13} />
            </button>
            <button
              type="button"
              className="mt-footer-link"
              onClick={() => navigate("/teamlead/tasks")}
            >
              <span>Sprint Task Kanban</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div
          className="mt-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div className="mt-modal" role="dialog" aria-modal="true" aria-labelledby="mt-add-title">
            <div className="mt-modal-header">
              <div>
                <h2 id="mt-add-title">Add Team Member</h2>
                <p>Register a new squad member to assign tasks and track velocity.</p>
              </div>
              <button
                type="button"
                className="mt-close-btn"
                aria-label="Close dialog"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMember}>
              <label>
                Full Name *
                <input
                  required
                  autoFocus
                  maxLength={80}
                  placeholder="e.g. Rachel Adams"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                />
              </label>

              <label>
                Work Email Address *
                <input
                  required
                  type="email"
                  maxLength={254}
                  placeholder="name@teamflow.com"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                />
              </label>

              <div className="mt-form-row-2">
                <label>
                  Role *
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  >
                    {ROLES.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Availability *
                  <select
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                  >
                    <option>Available</option>
                    <option>Away</option>
                    <option>In a Meeting</option>
                    <option>On Leave</option>
                  </select>
                </label>
              </div>

              <div className="mt-form-row-3">
                <label>
                  Assigned Tasks
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={addForm.tasks}
                    onChange={(e) => setAddForm({ ...addForm, tasks: e.target.value })}
                  />
                </label>

                <label>
                  Completed
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={addForm.completed}
                    onChange={(e) => setAddForm({ ...addForm, completed: e.target.value })}
                  />
                </label>

                <label>
                  Projects
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={addForm.projects}
                    onChange={(e) => setAddForm({ ...addForm, projects: e.target.value })}
                  />
                </label>
              </div>

              <label>
                Phone / Slack Handle (Optional)
                <input
                  maxLength={40}
                  placeholder="+1 (555) 123-4567 or @handle"
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                />
              </label>

              <div>
                <span className="mt-form-label">Avatar Badge Color</span>
                <div className="mt-color-options">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      type="button"
                      key={c.value}
                      className={`mt-color-btn ${addForm.color === c.value ? "selected" : ""}`}
                      style={{ background: c.value }}
                      onClick={() => setAddForm({ ...addForm, color: c.value })}
                      aria-label={`Select ${c.label} color`}
                    >
                      {addForm.color === c.value && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-modal-actions">
                <button
                  type="button"
                  className="mt-secondary-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="mt-primary-btn">
                  <Plus size={16} />
                  <span>Add Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editMemberTarget && (
        <div
          className="mt-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEditMemberTarget(null);
          }}
        >
          <div className="mt-modal" role="dialog" aria-modal="true" aria-labelledby="mt-edit-title">
            <div className="mt-modal-header">
              <div>
                <h2 id="mt-edit-title">Edit Squad Member</h2>
                <p>Update profile details, squad role, or sprint assignments.</p>
              </div>
              <button
                type="button"
                className="mt-close-btn"
                aria-label="Close dialog"
                onClick={() => setEditMemberTarget(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <label>
                Full Name *
                <input
                  required
                  maxLength={80}
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </label>

              <label>
                Work Email Address *
                <input
                  required
                  type="email"
                  maxLength={254}
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </label>

              <div className="mt-form-row-2">
                <label>
                  Role *
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  >
                    {ROLES.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Availability *
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option>Available</option>
                    <option>Away</option>
                    <option>In a Meeting</option>
                    <option>On Leave</option>
                  </select>
                </label>
              </div>

              <div className="mt-form-row-3">
                <label>
                  Assigned Tasks
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={editForm.tasks}
                    onChange={(e) => setEditForm({ ...editForm, tasks: e.target.value })}
                  />
                </label>

                <label>
                  Completed
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={editForm.completed}
                    onChange={(e) => setEditForm({ ...editForm, completed: e.target.value })}
                  />
                </label>

                <label>
                  Projects
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={editForm.projects}
                    onChange={(e) => setEditForm({ ...editForm, projects: e.target.value })}
                  />
                </label>
              </div>

              <label>
                Phone / Slack Handle
                <input
                  maxLength={40}
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </label>

              <div>
                <span className="mt-form-label">Avatar Badge Color</span>
                <div className="mt-color-options">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      type="button"
                      key={c.value}
                      className={`mt-color-btn ${editForm.color === c.value ? "selected" : ""}`}
                      style={{ background: c.value }}
                      onClick={() => setEditForm({ ...editForm, color: c.value })}
                      aria-label={`Select ${c.label} color`}
                    >
                      {editForm.color === c.value && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-modal-actions">
                <button
                  type="button"
                  className="mt-secondary-btn"
                  onClick={() => setEditMemberTarget(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="mt-primary-btn">
                  <Check size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEMBER PROFILE DRAWER / MODAL */}
      {selectedMember && (
        <div
          className="mt-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedMember(null);
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
                type="button"
                className="mt-close-btn"
                aria-label="Close profile"
                onClick={() => setSelectedMember(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-profile-info">
              <div
                className="mt-avatar mt-avatar-large"
                style={{ background: selectedMember.color || "#3b82f6" }}
              >
                {getInitials(selectedMember.name)}
              </div>

              <h3>{selectedMember.name}</h3>
              <p>{selectedMember.role}</p>

              <button
                type="button"
                className={`mt-status mt-profile-status-pill ${selectedMember.status.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => toggleMemberStatus(selectedMember)}
                title="Click to toggle availability"
              >
                <i />
                {selectedMember.status}
              </button>
            </div>

            {/* Quick Actions Row */}
            <div className="mt-profile-actions-bar">
              <button
                type="button"
                className="mt-action-pill"
                onClick={() => handleCopyEmail(selectedMember.email)}
                title="Copy Email"
              >
                {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedEmail ? "Copied!" : "Copy Email"}</span>
              </button>

              <button
                type="button"
                className="mt-action-pill"
                onClick={() => {
                  setSelectedMember(null);
                  navigate("/teamlead/chat");
                }}
                title="Open Team Chat"
              >
                <MessageSquare size={14} />
                <span>Message</span>
              </button>

              <button
                type="button"
                className="mt-action-pill"
                onClick={() => {
                  setSelectedMember(null);
                  navigate("/teamlead/tasks");
                }}
                title="View Member Tasks"
              >
                <CheckSquare size={14} />
                <span>Tasks</span>
              </button>
            </div>

            {/* Details Grid */}
            <div className="mt-profile-details">
              <div>
                <span>Work Email</span>
                <b>{selectedMember.email}</b>
              </div>

              <div>
                <span>Phone / Slack</span>
                <b>{selectedMember.phone || "+1 (555) 234-5678"}</b>
              </div>

              <div>
                <span>Joined Squad</span>
                <b>{selectedMember.joinedDate || "Sprint 21"}</b>
              </div>

              <div>
                <span>Assigned Tasks</span>
                <b>{selectedMember.tasks} tasks</b>
              </div>

              <div>
                <span>Completed Tasks</span>
                <b>{selectedMember.completed} tasks</b>
              </div>

              <div>
                <span>Active Projects</span>
                <b>{selectedMember.projects} projects</b>
              </div>

              <div>
                <span>Velocity Rate</span>
                <b>
                  {selectedMember.tasks > 0
                    ? `${Math.round((selectedMember.completed / selectedMember.tasks) * 100)}%`
                    : "0%"}
                </b>
              </div>
            </div>

            <div className="mt-profile-footer-actions">
              <button
                type="button"
                className="mt-secondary-btn"
                onClick={() => {
                  const target = selectedMember;
                  setSelectedMember(null);
                  startEditMember(target);
                }}
              >
                <Edit2 size={14} />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                className="mt-primary-btn"
                onClick={() => setSelectedMember(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteMemberTarget && (
        <div
          className="tl-delete-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDeleteMemberTarget(null);
          }}
        >
          <div className="tl-delete-modal-box">
            <div className="tl-delete-modal-icon-circle">
              <Trash2 size={24} />
            </div>
            <h3>Remove "{deleteMemberTarget.name}"?</h3>
            <p>
              Are you sure you want to remove this member from the team? Their assigned tasks will remain on the board and can be reassigned to other teammates.
            </p>
            <div className="tl-delete-modal-footer">
              <button
                type="button"
                className="tl-btn-secondary"
                onClick={() => setDeleteMemberTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="tl-btn-danger"
                onClick={confirmDeleteMember}
              >
                <Trash2 size={15} /> Remove Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
