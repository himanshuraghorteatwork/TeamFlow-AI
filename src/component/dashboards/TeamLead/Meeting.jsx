
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Users,
  Plus,
  Search,
  Video,
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  CalendarCheck,
  CalendarClock,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

import "./Meeting.css";

const initialMeetings = [
  {
    id: 1,
    title: "Team Stand-up",
    description: "Discuss daily progress, blockers, and priorities.",
    date: "2026-10-26",
    time: "10:30",
    duration: "30 minutes",
    type: "Daily Stand-up",
    location: "Google Meet",
    participants: ["PS", "AK", "RK", "SP"],
    status: "Upcoming",
  },
  {
    id: 2,
    title: "TeamFlow UI Review",
    description: "Review dashboard components and frontend progress.",
    date: "2026-10-26",
    time: "14:00",
    duration: "45 minutes",
    type: "Project Review",
    location: "Microsoft Teams",
    participants: ["PS", "AK", "RK"],
    status: "Upcoming",
  },
  {
    id: 3,
    title: "Sprint Planning",
    description: "Plan upcoming tasks and assign responsibilities.",
    date: "2026-10-27",
    time: "11:00",
    duration: "60 minutes",
    type: "Team Meeting",
    location: "Google Meet",
    participants: ["PS", "AK", "RK", "SP", "MJ"],
    status: "Upcoming",
  },
  {
    id: 4,
    title: "Database Integration Review",
    description: "Review API integration and database requirements.",
    date: "2026-10-24",
    time: "15:00",
    duration: "45 minutes",
    type: "Project Review",
    location: "Meeting Room A",
    participants: ["PS", "RK", "MJ"],
    status: "Completed",
  },
];

const emptyForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  duration: "30 minutes",
  type: "Team Meeting",
  location: "Google Meet",
};

function formatDate(date) {
  if (!date) return "Date not set";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time) {
  if (!time) return "Time not set";

  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function Meetings() {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [deleteMeetingTarget, setDeleteMeetingTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const today = new Date().toLocaleDateString("en-CA");

  const stats = useMemo(() => {
    return {
      total: meetings.length,
      upcoming: meetings.filter(
        (meeting) => meeting.status === "Upcoming"
      ).length,
      completed: meetings.filter(
        (meeting) => meeting.status === "Completed"
      ).length,
      today: meetings.filter(
        (meeting) => meeting.date === today && meeting.status === "Upcoming"
      ).length,
    };
  }, [meetings, today]);

  const filteredMeetings = useMemo(() => {
    return meetings
      .filter((meeting) => {
        const matchesSearch =
          meeting.title.toLowerCase().includes(search.toLowerCase()) ||
          meeting.type.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
          filter === "All" || meeting.status === filter;

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) =>
        `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
      );
  }, [meetings, search, filter]);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(meeting) {
    setEditingId(meeting.id);

    setForm({
      title: meeting.title,
      description: meeting.description,
      date: meeting.date,
      time: meeting.time,
      duration: meeting.duration,
      type: meeting.type,
      location: meeting.location,
    });

    setOpenMenu(null);
    setShowForm(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const meetingData = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      id: editingId ?? Date.now(),
      participants: editingId
        ? meetings.find((meeting) => meeting.id === editingId)
            ?.participants ?? ["PS"]
        : ["PS"],
      status: editingId
        ? meetings.find((meeting) => meeting.id === editingId)?.status ??
          "Upcoming"
        : "Upcoming",
    };

    if (editingId) {
      setMeetings((previous) =>
        previous.map((meeting) =>
          meeting.id === editingId ? meetingData : meeting
        )
      );
    } else {
      setMeetings((previous) => [...previous, meetingData]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function confirmDeleteMeeting() {
    if (!deleteMeetingTarget) return;
    setMeetings((previous) =>
      previous.filter((meeting) => meeting.id !== deleteMeetingTarget.id)
    );
    setOpenMenu(null);
    setSelectedMeeting(null);
    setDeleteMeetingTarget(null);
  }

  function markCompleted(id) {
    setMeetings((previous) =>
      previous.map((meeting) =>
        meeting.id === id
          ? { ...meeting, status: "Completed" }
          : meeting
      )
    );

    setOpenMenu(null);
    setSelectedMeeting(null);
  }

  return (
    <div className="meetings-page">
      <header className="meetings-header">
        <div>
          <div className="meetings-breadcrumb">
            Workspace <span>/</span> Meetings
          </div>

          <h1>Meetings</h1>

          <p className="meetings-subtitle">
            Plan meetings, coordinate with your team, and keep everyone aligned.
          </p>
        </div>

        <button className="meeting-primary-btn" onClick={openCreateForm}>
          <Plus size={19} />
          Schedule Meeting
        </button>
      </header>

      <section className="meeting-stats">
        <article className="meeting-stat-card">
          <div className="meeting-stat-icon purple">
            <CalendarDays size={21} />
          </div>

          <div>
            <p>Total Meetings</p>
            <h2>{stats.total}</h2>
            <span>All scheduled meetings</span>
          </div>
        </article>

        <article className="meeting-stat-card">
          <div className="meeting-stat-icon blue">
            <CalendarClock size={21} />
          </div>

          <div>
            <p>Upcoming</p>
            <h2>{stats.upcoming}</h2>
            <span>Awaiting completion</span>
          </div>
        </article>

        <article className="meeting-stat-card">
          <div className="meeting-stat-icon green">
            <CalendarCheck size={21} />
          </div>

          <div>
            <p>Completed</p>
            <h2>{stats.completed}</h2>
            <span>Finished meetings</span>
          </div>
        </article>

        <article className="meeting-stat-card">
          <div className="meeting-stat-icon orange">
            <Clock3 size={21} />
          </div>

          <div>
            <p>Today's Meetings</p>
            <h2>{stats.today}</h2>
            <span>Scheduled for today</span>
          </div>
        </article>
      </section>

      <section className="meeting-content-card">
        <div className="meeting-content-header">
          <div>
            <h2>All Meetings</h2>
            <p>Manage and track your team's meetings.</p>
          </div>

          <div className="meeting-toolbar">
            <div className="meeting-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search meetings..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="meeting-filter">
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label="Filter meetings by status"
              >
                <option value="All">All Meetings</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>

              <ChevronDown size={15} />
            </div>
          </div>
        </div>

        <div className="meeting-list">
          {filteredMeetings.map((meeting) => (
            <article className="meeting-row" key={meeting.id}>
              <div className="meeting-date-box">
                <span>
                  {new Date(`${meeting.date}T00:00:00`)
                    .toLocaleDateString("en-US", { month: "short" })
                    .toUpperCase()}
                </span>

                <strong>
                  {new Date(`${meeting.date}T00:00:00`).getDate()}
                </strong>
              </div>

              <div className="meeting-main-info">
                <div className="meeting-title-line">
                  <h3>{meeting.title}</h3>

                  <span
                    className={`meeting-status ${
                      meeting.status === "Completed"
                        ? "completed"
                        : "upcoming"
                    }`}
                  >
                    {meeting.status === "Completed" && (
                      <CheckCircle2 size={13} />
                    )}

                    {meeting.status}
                  </span>
                </div>

                <p className="meeting-description">
                  {meeting.description || "No description added."}
                </p>

                <div className="meeting-meta">
                  <span>
                    <Clock3 size={15} />
                    {formatTime(meeting.time)} · {meeting.duration}
                  </span>

                  <span>
                    <Users size={15} />
                    {meeting.participants.length} participants
                  </span>

                  <span>
                    <Video size={15} />
                    {meeting.type}
                  </span>
                </div>
              </div>

              <div className="meeting-right">
                <div className="meeting-location">
                  <MapPin size={15} />
                  {meeting.location}
                </div>

                <div className="meeting-actions">
                  <button
                    className="meeting-view-btn"
                    onClick={() => setSelectedMeeting(meeting)}
                  >
                    View Details
                    <ExternalLink size={14} />
                  </button>

                  <div className="meeting-menu-wrapper">
                    <button
                      className="meeting-more-btn"
                      onClick={() =>
                        setOpenMenu(
                          openMenu === meeting.id ? null : meeting.id
                        )
                      }
                      aria-label={`Actions for ${meeting.title}`}
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {openMenu === meeting.id && (
                      <div className="meeting-dropdown">
                        <button onClick={() => openEditForm(meeting)}>
                          <Pencil size={15} />
                          Edit Meeting
                        </button>

                        {meeting.status !== "Completed" && (
                          <button onClick={() => markCompleted(meeting.id)}>
                            <CheckCircle2 size={15} />
                            Mark Completed
                          </button>
                        )}

                        <button
                          className="meeting-delete-action tl-btn-delete"
                          onClick={() => {
                            setDeleteMeetingTarget(meeting);
                            setOpenMenu(null);
                          }}
                        >
                          <Trash2 size={15} />
                          Delete Meeting
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}

          {filteredMeetings.length === 0 && (
            <div className="meeting-empty-state">
              <CalendarDays size={38} />

              <h3>No meetings found</h3>

              <p>Try another search or schedule a new meeting.</p>

              <button
                className="meeting-primary-btn"
                onClick={openCreateForm}
              >
                <Plus size={17} />
                Schedule Meeting
              </button>
            </div>
          )}
        </div>

        <div className="meeting-list-footer">
          Showing {filteredMeetings.length} of {meetings.length} meetings
        </div>
      </section>

      {showForm && (
        <div
          className="meeting-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <div
            className="meeting-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="meeting-form-title"
          >
            <div className="meeting-modal-header">
              <div>
                <h2 id="meeting-form-title">
                  {editingId ? "Edit Meeting" : "Schedule a Meeting"}
                </h2>

                <p>Enter the details for your team meeting.</p>
              </div>

              <button
                className="meeting-close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Meeting Title *
                <input
                  type="text"
                  placeholder="e.g. Weekly Team Meeting"
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  required
                  maxLength={100}
                />
              </label>

              <label>
                Description
                <textarea
                  placeholder="What will you discuss?"
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  maxLength={500}
                />
              </label>

              <div className="meeting-form-grid">
                <label>
                  Date *
                  <input
                    type="date"
                    value={form.date}
                    min={today}
                    onChange={(event) =>
                      setForm({ ...form, date: event.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  Time *
                  <input
                    type="time"
                    value={form.time}
                    onChange={(event) =>
                      setForm({ ...form, time: event.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  Duration
                  <select
                    value={form.duration}
                    onChange={(event) =>
                      setForm({ ...form, duration: event.target.value })
                    }
                  >
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                    <option>90 minutes</option>
                  </select>
                </label>

                <label>
                  Meeting Type
                  <select
                    value={form.type}
                    onChange={(event) =>
                      setForm({ ...form, type: event.target.value })
                    }
                  >
                    <option>Team Meeting</option>
                    <option>Daily Stand-up</option>
                    <option>Project Review</option>
                    <option>Client Meeting</option>
                    <option>Sprint Planning</option>
                  </select>
                </label>
              </div>

              <label>
                Meeting Location
                <select
                  value={form.location}
                  onChange={(event) =>
                    setForm({ ...form, location: event.target.value })
                  }
                >
                  <option>Google Meet</option>
                  <option>Microsoft Teams</option>
                  <option>Zoom</option>
                  <option>Meeting Room A</option>
                  <option>Meeting Room B</option>
                </select>
              </label>

              <div className="meeting-form-actions">
                <button
                  type="button"
                  className="meeting-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="meeting-primary-btn">
                  <CalendarCheck size={17} />
                  {editingId ? "Save Changes" : "Create Meeting"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedMeeting && (
        <div
          className="meeting-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMeeting(null);
            }
          }}
        >
          <div
            className="meeting-modal meeting-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="meeting-details-title"
          >
            <div className="meeting-modal-header">
              <div>
                <span className="meeting-details-eyebrow">
                  MEETING DETAILS
                </span>

                <h2 id="meeting-details-title">
                  {selectedMeeting.title}
                </h2>
              </div>

              <button
                className="meeting-close-btn"
                onClick={() => setSelectedMeeting(null)}
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <p className="meeting-details-description">
              {selectedMeeting.description || "No description added."}
            </p>

            <div className="meeting-detail-item">
              <CalendarDays size={19} />

              <div>
                <span>Date</span>
                <strong>{formatDate(selectedMeeting.date)}</strong>
              </div>
            </div>

            <div className="meeting-detail-item">
              <Clock3 size={19} />

              <div>
                <span>Time and duration</span>
                <strong>
                  {formatTime(selectedMeeting.time)} ·{" "}
                  {selectedMeeting.duration}
                </strong>
              </div>
            </div>

            <div className="meeting-detail-item">
              <Video size={19} />

              <div>
                <span>Meeting type</span>
                <strong>{selectedMeeting.type}</strong>
              </div>
            </div>

            <div className="meeting-detail-item">
              <MapPin size={19} />

              <div>
                <span>Location</span>
                <strong>{selectedMeeting.location}</strong>
              </div>
            </div>

            <div className="meeting-detail-item">
              <Users size={19} />

              <div>
                <span>Participants</span>
                <strong>
                  {selectedMeeting.participants.length} participants
                </strong>
              </div>
            </div>

            <div className="meeting-form-actions">
              <button
                className="meeting-cancel-btn"
                onClick={() => setSelectedMeeting(null)}
              >
                Close
              </button>

              <button
                className="meeting-primary-btn"
                onClick={() => openEditForm(selectedMeeting)}
              >
                <Pencil size={16} />
                Edit Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM CSS DELETE CONFIRMATION MODAL */}
      {deleteMeetingTarget && (
        <div
          className="tl-delete-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDeleteMeetingTarget(null);
          }}
        >
          <div className="tl-delete-modal-box">
            <div className="tl-delete-modal-icon-circle">
              <Trash2 size={24} />
            </div>
            <h3>Delete "{deleteMeetingTarget.title}"?</h3>
            <p>Are you sure you want to permanently delete this meeting? Participants will be notified of the cancellation.</p>
            <div className="tl-delete-modal-footer">
              <button
                type="button"
                className="tl-btn-secondary"
                onClick={() => setDeleteMeetingTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="tl-btn-danger"
                onClick={confirmDeleteMeeting}
              >
                <Trash2 size={15} /> Delete Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
