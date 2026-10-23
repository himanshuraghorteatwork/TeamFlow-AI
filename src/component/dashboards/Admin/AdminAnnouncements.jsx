// src/component/AdminAnnouncements/AdminAnnouncements.jsx

import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Plus,
  ChevronDown,
  Megaphone,
  Send,
  Clock3,
  FileEdit,
  Eye,
  Users,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Check,
  CalendarDays,
  AlertTriangle,
  RotateCcw,
  Radio,
} from "lucide-react";

import AdminSidebar from "../../../layouts/AdminSidebar/AdminSidebar.jsx";

import { initialAnnouncements } from "./adminAnnouncementsData.js";

import "./AdminAnnouncements.css";

const STORAGE_KEY = "teamflow_admin_announcements";

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      return saved
        ? JSON.parse(saved)
        : initialAnnouncements;
    } catch {
      return initialAnnouncements;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [audienceFilter, setAudienceFilter] = useState("All");

  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState(null);

  const [editingAnnouncement, setEditingAnnouncement] =
    useState(null);

  const [menuId, setMenuId] = useState(null);

  const [formMode, setFormMode] = useState("create");

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(announcements)
    );
  }, [announcements]);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((announcement) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        announcement.title
          .toLowerCase()
          .includes(query) ||
        announcement.message
          .toLowerCase()
          .includes(query) ||
        announcement.author
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        announcement.status === statusFilter;

      const matchesAudience =
        audienceFilter === "All" ||
        announcement.audience === audienceFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAudience
      );
    });
  }, [
    announcements,
    search,
    statusFilter,
    audienceFilter,
  ]);

  const publishedCount = announcements.filter(
    (item) => item.status === "Published"
  ).length;

  const scheduledCount = announcements.filter(
    (item) => item.status === "Scheduled"
  ).length;

  const draftCount = announcements.filter(
    (item) => item.status === "Draft"
  ).length;

  const totalViews = announcements.reduce(
    (total, item) => total + Number(item.views || 0),
    0
  );

  const createAnnouncement = () => {
    setFormMode("create");

    setEditingAnnouncement({
      id: "",
      title: "",
      message: "",
      audience: "All Users",
      priority: "Medium",
      status: "Draft",
      author: "Himanshu",
      createdAt: "",
      publishDate: "",
      views: 0,
    });
  };

  const editAnnouncement = (announcement) => {
    setFormMode("edit");

    setEditingAnnouncement({
      ...announcement,
    });

    setMenuId(null);
  };

  const saveAnnouncement = () => {
    if (!editingAnnouncement.title.trim()) {
      alert("Please enter announcement title.");
      return;
    }

    if (!editingAnnouncement.message.trim()) {
      alert("Please enter announcement message.");
      return;
    }

    if (
      editingAnnouncement.status === "Scheduled" &&
      !editingAnnouncement.publishDate
    ) {
      alert("Please select a scheduled publish date.");
      return;
    }

    if (formMode === "create") {
      const newAnnouncement = {
        ...editingAnnouncement,

        id: `ANN-${Date.now()
          .toString()
          .slice(-6)}`,

        createdAt: new Date().toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }
        ),

        publishDate:
          editingAnnouncement.status === "Published"
            ? new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })
            : editingAnnouncement.status === "Draft"
            ? "—"
            : editingAnnouncement.publishDate,

        views: 0,
      };

      setAnnouncements((previous) => [
        newAnnouncement,
        ...previous,
      ]);
    } else {
      setAnnouncements((previous) =>
        previous.map((item) =>
          item.id === editingAnnouncement.id
            ? editingAnnouncement
            : item
        )
      );
    }

    setEditingAnnouncement(null);
  };

  const publishAnnouncement = (id) => {
    const currentDate = new Date().toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );

    setAnnouncements((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Published",
              publishDate: currentDate,
            }
          : item
      )
    );

    setMenuId(null);
  };

  const moveToDraft = (id) => {
    setAnnouncements((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Draft",
              publishDate: "—",
            }
          : item
      )
    );

    setMenuId(null);
  };

  const deleteAnnouncement = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) return;

    setAnnouncements((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setMenuId(null);
  };

  const openAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);

    if (
      announcement.status === "Published" &&
      announcement.views === 0
    ) {
      setAnnouncements((previous) =>
        previous.map((item) =>
          item.id === announcement.id
            ? {
                ...item,
                views: item.views + 1,
              }
            : item
        )
      );
    }

    setMenuId(null);
  };

  const resetAnnouncements = () => {
    const confirmed = window.confirm(
      "Reset announcement demo data?"
    );

    if (!confirmed) return;

    setAnnouncements(initialAnnouncements);
    setSearch("");
    setStatusFilter("All");
    setAudienceFilter("All");
  };

  return (
    <div className="admin-announcements-shell">
      <AdminSidebar />

      <main className="admin-announcements-main">
        {/* ================= TOPBAR ================= */}

        <header className="admin-announcements-topbar">
          <div className="admin-announcements-global-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search users, workspaces, projects, or anything..."
            />

            <span>Ctrl + K</span>
          </div>

          <div className="admin-announcements-top-actions">
            <button
              className="admin-announcements-create-top"
              onClick={createAnnouncement}
            >
              <Plus size={17} />
              Create
              <ChevronDown size={14} />
            </button>

            <div className="admin-announcements-profile">
              <div className="admin-announcements-avatar">
                HR
              </div>

              <div>
                <strong>Himanshu</strong>
                <span>Super Administrator</span>
              </div>

              <ChevronDown size={15} />
            </div>
          </div>
        </header>

        {/* ================= CONTENT ================= */}

        <div className="admin-announcements-content">
          {/* PAGE HEADER */}

          <section className="admin-announcements-heading">
            <div>
              <div className="admin-announcements-breadcrumb">
                <Megaphone size={15} />
                ADMIN / ANNOUNCEMENTS
              </div>

              <h1>Announcements</h1>

              <p>
                Create and manage platform-wide messages,
                updates and important notices.
              </p>
            </div>

            <button
              className="admin-announcements-primary-button"
              onClick={createAnnouncement}
            >
              <Plus size={16} />
              New Announcement
            </button>
          </section>

          {/* ================= STATS ================= */}

          <section className="admin-announcements-stats">
            <StatCard
              title="Total Announcements"
              value={announcements.length}
              description="All announcements"
              icon={Megaphone}
              type="purple"
            />

            <StatCard
              title="Published"
              value={publishedCount}
              description="Currently published"
              icon={Send}
              type="green"
            />

            <StatCard
              title="Scheduled"
              value={scheduledCount}
              description="Waiting to publish"
              icon={Clock3}
              type="blue"
            />

            <StatCard
              title="Drafts"
              value={draftCount}
              description="Not published"
              icon={FileEdit}
              type="orange"
            />

            <StatCard
              title="Total Views"
              value={totalViews.toLocaleString()}
              description="Announcement reach"
              icon={Eye}
              type="pink"
            />
          </section>

          {/* ================= ANNOUNCEMENT PANEL ================= */}

          <section className="admin-announcements-panel">
            <div className="admin-announcements-panel-header">
              <div>
                <h3>All Announcements</h3>
                <p>
                  Manage announcements sent across
                  TeamFlow AI.
                </p>
              </div>

              <button onClick={resetAnnouncements}>
                <RotateCcw size={14} />
                Reset Demo Data
              </button>
            </div>

            {/* FILTERS */}

            <div className="admin-announcements-toolbar">
              <div className="admin-announcements-search">
                <Search size={16} />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search announcements..."
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">
                  All Status
                </option>
                <option value="Published">
                  Published
                </option>
                <option value="Scheduled">
                  Scheduled
                </option>
                <option value="Draft">
                  Draft
                </option>
              </select>

              <select
                value={audienceFilter}
                onChange={(event) =>
                  setAudienceFilter(event.target.value)
                }
              >
                <option value="All">
                  All Audiences
                </option>
                <option value="All Users">
                  All Users
                </option>
                <option value="Admins">
                  Admins
                </option>
                <option value="Workspace Owners">
                  Workspace Owners
                </option>
                <option value="Team Leads">
                  Team Leads
                </option>
                <option value="Members">
                  Members
                </option>
                <option value="Paid Users">
                  Paid Users
                </option>
              </select>
            </div>

            <div className="admin-announcements-count">
              Showing {filteredAnnouncements.length} of{" "}
              {announcements.length} announcements
            </div>

            {/* ================= CARDS ================= */}

            <div className="admin-announcements-list">
              {filteredAnnouncements.map(
                (announcement) => (
                  <article
                    className="admin-announcement-card"
                    key={announcement.id}
                  >
                    <div
                      className={`admin-announcement-icon ${announcement.priority.toLowerCase()}`}
                    >
                      <Megaphone size={20} />
                    </div>

                    <div className="admin-announcement-card-content">
                      <div className="admin-announcement-title-row">
                        <div>
                          <h3>
                            {announcement.title}
                          </h3>

                          <div className="admin-announcement-badges">
                            <StatusBadge
                              status={
                                announcement.status
                              }
                            />

                            <PriorityBadge
                              priority={
                                announcement.priority
                              }
                            />
                          </div>
                        </div>

                        <div className="admin-announcement-menu-wrap">
                          <button
                            className="admin-announcement-more"
                            onClick={() =>
                              setMenuId(
                                menuId ===
                                  announcement.id
                                  ? null
                                  : announcement.id
                              )
                            }
                          >
                            <MoreVertical
                              size={18}
                            />
                          </button>

                          {menuId ===
                            announcement.id && (
                            <div className="admin-announcement-menu">
                              <button
                                onClick={() =>
                                  openAnnouncement(
                                    announcement
                                  )
                                }
                              >
                                <Eye size={14} />
                                View
                              </button>

                              <button
                                onClick={() =>
                                  editAnnouncement(
                                    announcement
                                  )
                                }
                              >
                                <Pencil size={14} />
                                Edit
                              </button>

                              {announcement.status !==
                                "Published" && (
                                <button
                                  onClick={() =>
                                    publishAnnouncement(
                                      announcement.id
                                    )
                                  }
                                >
                                  <Send size={14} />
                                  Publish Now
                                </button>
                              )}

                              {announcement.status ===
                                "Published" && (
                                <button
                                  onClick={() =>
                                    moveToDraft(
                                      announcement.id
                                    )
                                  }
                                >
                                  <FileEdit
                                    size={14}
                                  />
                                  Move to Draft
                                </button>
                              )}

                              <button
                                className="delete"
                                onClick={() =>
                                  deleteAnnouncement(
                                    announcement.id
                                  )
                                }
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="admin-announcement-message">
                        {announcement.message}
                      </p>

                      <div className="admin-announcement-meta">
                        <span>
                          <Users size={13} />
                          {announcement.audience}
                        </span>

                        <span>
                          <CalendarDays size={13} />
                          {announcement.publishDate}
                        </span>

                        <span>
                          <Eye size={13} />
                          {announcement.views} views
                        </span>

                        <span>
                          By {announcement.author}
                        </span>
                      </div>
                    </div>
                  </article>
                )
              )}

              {filteredAnnouncements.length === 0 && (
                <div className="admin-announcements-empty">
                  <Megaphone size={45} />

                  <h3>
                    No announcements found
                  </h3>

                  <p>
                    Try changing your search or
                    filters.
                  </p>

                  <button
                    onClick={createAnnouncement}
                  >
                    <Plus size={15} />
                    Create Announcement
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* ================= CREATE / EDIT MODAL ================= */}

      {editingAnnouncement && (
        <div className="admin-announcements-modal-overlay">
          <div className="admin-announcements-modal">
            <div className="admin-announcements-modal-header">
              <div>
                <h2>
                  {formMode === "create"
                    ? "Create Announcement"
                    : "Edit Announcement"}
                </h2>

                <p>
                  Send an update to TeamFlow AI
                  users.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingAnnouncement(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-announcements-form">
              <label>
                Announcement Title

                <input
                  type="text"
                  value={
                    editingAnnouncement.title
                  }
                  onChange={(event) =>
                    setEditingAnnouncement({
                      ...editingAnnouncement,
                      title: event.target.value,
                    })
                  }
                  placeholder="Enter announcement title"
                />
              </label>

              <label>
                Message

                <textarea
                  value={
                    editingAnnouncement.message
                  }
                  onChange={(event) =>
                    setEditingAnnouncement({
                      ...editingAnnouncement,
                      message: event.target.value,
                    })
                  }
                  placeholder="Write your announcement..."
                  rows="6"
                />

                <small>
                  {
                    editingAnnouncement.message
                      .length
                  }{" "}
                  characters
                </small>
              </label>

              <div className="admin-announcements-form-grid">
                <label>
                  Audience

                  <select
                    value={
                      editingAnnouncement.audience
                    }
                    onChange={(event) =>
                      setEditingAnnouncement({
                        ...editingAnnouncement,
                        audience:
                          event.target.value,
                      })
                    }
                  >
                    <option>All Users</option>
                    <option>Admins</option>
                    <option>
                      Workspace Owners
                    </option>
                    <option>Team Leads</option>
                    <option>Members</option>
                    <option>Paid Users</option>
                  </select>
                </label>

                <label>
                  Priority

                  <select
                    value={
                      editingAnnouncement.priority
                    }
                    onChange={(event) =>
                      setEditingAnnouncement({
                        ...editingAnnouncement,
                        priority:
                          event.target.value,
                      })
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
              </div>

              <div className="admin-announcements-form-grid">
                <label>
                  Status

                  <select
                    value={
                      editingAnnouncement.status
                    }
                    onChange={(event) =>
                      setEditingAnnouncement({
                        ...editingAnnouncement,
                        status:
                          event.target.value,
                      })
                    }
                  >
                    <option>Draft</option>
                    <option>Published</option>
                    <option>Scheduled</option>
                  </select>
                </label>

                {editingAnnouncement.status ===
                  "Scheduled" && (
                  <label>
                    Publish Date

                    <input
                      type="date"
                      value={
                        editingAnnouncement.publishDate ===
                        "—"
                          ? ""
                          : editingAnnouncement.publishDate
                      }
                      onChange={(event) =>
                        setEditingAnnouncement({
                          ...editingAnnouncement,
                          publishDate:
                            event.target.value,
                        })
                      }
                    />
                  </label>
                )}
              </div>

              <div className="admin-announcements-preview">
                <div>
                  <Radio size={17} />
                </div>

                <span>
                  <strong>
                    Announcement Preview
                  </strong>

                  <small>
                    {editingAnnouncement.title ||
                      "Your announcement title"}

                    {" — "}

                    {editingAnnouncement.message ||
                      "Your message will appear here."}
                  </small>
                </span>
              </div>
            </div>

            <div className="admin-announcements-modal-footer">
              <button
                className="admin-announcements-secondary-button"
                onClick={() =>
                  setEditingAnnouncement(null)
                }
              >
                Cancel
              </button>

              <button
                className="admin-announcements-primary-button"
                onClick={saveAnnouncement}
              >
                <Check size={15} />

                {formMode === "create"
                  ? "Create Announcement"
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW MODAL ================= */}

      {selectedAnnouncement && (
        <div className="admin-announcements-modal-overlay">
          <div className="admin-announcements-view-modal">
            <div className="admin-announcements-modal-header">
              <div>
                <span className="admin-announcements-view-label">
                  ANNOUNCEMENT
                </span>

                <h2>
                  {selectedAnnouncement.title}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedAnnouncement(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-announcements-view-body">
              <div className="admin-announcements-view-icon">
                <Megaphone size={27} />
              </div>

              <div className="admin-announcements-view-badges">
                <StatusBadge
                  status={
                    selectedAnnouncement.status
                  }
                />

                <PriorityBadge
                  priority={
                    selectedAnnouncement.priority
                  }
                />
              </div>

              <p>
                {selectedAnnouncement.message}
              </p>

              <div className="admin-announcements-view-info">
                <InfoRow
                  label="Audience"
                  value={
                    selectedAnnouncement.audience
                  }
                />

                <InfoRow
                  label="Created By"
                  value={
                    selectedAnnouncement.author
                  }
                />

                <InfoRow
                  label="Created"
                  value={
                    selectedAnnouncement.createdAt
                  }
                />

                <InfoRow
                  label="Publish Date"
                  value={
                    selectedAnnouncement.publishDate
                  }
                />

                <InfoRow
                  label="Views"
                  value={`${selectedAnnouncement.views}`}
                />
              </div>
            </div>

            <div className="admin-announcements-modal-footer">
              <button
                className="admin-announcements-secondary-button"
                onClick={() =>
                  setSelectedAnnouncement(null)
                }
              >
                Close
              </button>

              <button
                className="admin-announcements-primary-button"
                onClick={() => {
                  editAnnouncement(
                    selectedAnnouncement
                  );

                  setSelectedAnnouncement(null);
                }}
              >
                <Pencil size={14} />
                Edit Announcement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  type,
}) {
  return (
    <article className="admin-announcements-stat-card">
      <div
        className={`admin-announcements-stat-icon ${type}`}
      >
        <Icon size={20} />
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>
    </article>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`admin-announcement-status ${status
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span
      className={`admin-announcement-priority ${priority.toLowerCase()}`}
    >
      {priority === "High" && (
        <AlertTriangle size={10} />
      )}

      {priority} Priority
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="admin-announcements-info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default AdminAnnouncements;