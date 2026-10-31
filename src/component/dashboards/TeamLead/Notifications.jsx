import React, { useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock3,
  Bug,
  MessageCircle,
  Sparkles,
  Search,
  Check,
  Trash2,
  X,
  SlidersHorizontal,
} from "lucide-react";
import "./Notifications.css";

const INITIAL_NOTIFICATIONS = [
  {
    id: "NTF-01",
    title: "Aarav Shah requested code review on PR #194",
    description:
      "Aarav assigned you to review the GraphQL client caching changes for Mobile Application.",
    category: "Tasks",
    iconType: "task",
    time: "12 mins ago",
    date: "Today, 10:48 AM",
    actor: "Aarav Shah",
    unread: true,
    urgent: false,
  },
  {
    id: "NTF-02",
    title: "Critical Bug Reported: Auth Token Refresh Failure #245",
    description:
      "Rohan Kulkarni reported an issue causing random session invalidations on Staging.",
    category: "Bugs",
    iconType: "bug",
    time: "45 mins ago",
    date: "Today, 10:15 AM",
    actor: "Rohan Kulkarni",
    unread: true,
    urgent: true,
  },
  {
    id: "NTF-03",
    title: "Upcoming Meeting: Sprint Planning & Backlog Grooming",
    description:
      "Starts in 30 minutes on Google Meet with the core frontend & backend teams.",
    category: "Meetings",
    iconType: "meeting",
    time: "1 hour ago",
    date: "Today, 10:00 AM",
    actor: "Calendar Bot",
    unread: true,
    urgent: false,
  },
  {
    id: "NTF-04",
    title: "Priya Rao mentioned you in #design-system",
    description:
      '"@Komal Pawar please check the updated modal designs for Task Suggestions when you have a moment!"',
    category: "Mentions",
    iconType: "chat",
    time: "2 hours ago",
    date: "Today, 09:00 AM",
    actor: "Priya Rao",
    unread: true,
    urgent: false,
  },
  {
    id: "NTF-05",
    title: "AI Workload Insight: Neha Patil reached 96% capacity",
    description:
      "TeamFlow AI recommends shifting 1 task from Neha to Rohan to prevent sprint burnout.",
    category: "AI",
    iconType: "ai",
    time: "3 hours ago",
    date: "Today, 08:00 AM",
    actor: "TeamFlow AI",
    unread: true,
    urgent: true,
  },
  {
    id: "NTF-06",
    title: "Task Completed: Redesign Dashboard Overview",
    description:
      "Komal Pawar marked TF-1024 as Completed. Ready for QA testing.",
    category: "Tasks",
    iconType: "task",
    time: "Yesterday",
    date: "Oct 25, 04:30 PM",
    actor: "Komal Pawar",
    unread: false,
    urgent: false,
  },
  {
    id: "NTF-07",
    title: "Meeting Notes Generated: Sprint 14 Retrospective",
    description:
      "AI Summary has processed audio transcript and posted action items to Files & Docs.",
    category: "AI",
    iconType: "ai",
    time: "Oct 24",
    date: "Oct 24, 02:15 PM",
    actor: "TeamFlow AI",
    unread: false,
    urgent: false,
  },
];

const CATEGORIES = [
  "All",
  "Tasks",
  "Bugs",
  "Meetings",
  "Mentions",
  "AI",
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showPreferences, setShowPreferences] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const PREFERENCES_KEY = "teamflow_teamlead_notification_preferences";
  const DEFAULT_PREFERENCES = {
    emailAlerts: true,
    inAppPush: true,
    criticalBugs: true,
    meetingReminders: true,
    aiDigest: true,
  };

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(PREFERENCES_KEY);
      return saved
        ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) }
        : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  const stats = useMemo(() => {
    const unread = notifications.filter((n) => n.unread).length;
    const bugs = notifications.filter((n) => n.category === "Bugs").length;
    const tasks = notifications.filter((n) => n.category === "Tasks").length;
    const meetings = notifications.filter((n) => n.category === "Meetings").length;

    return { unread, bugs, tasks, meetings };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notifications.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        !q ||
        [item.title, item.description, item.actor, item.category]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [notifications, activeCategory, search]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setToastMessage("All notifications marked as read.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleClearAll = () => {
    setNotifications([]);
    setToastMessage("All notifications cleared.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const toggleReadStatus = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const renderIcon = (type) => {
    switch (type) {
      case "task":
        return <CheckCircle2 size={19} />;
      case "bug":
        return <Bug size={19} />;
      case "meeting":
        return <Clock3 size={19} />;
      case "chat":
        return <MessageCircle size={19} />;
      case "ai":
        return <Sparkles size={19} />;
      default:
        return <Bell size={19} />;
    }
  };

  return (
    <div className="ntf-page">
      {/* Header */}
      <header className="ntf-header">
        <div>
          <div className="ntf-breadcrumb">
            Workspace <span>/</span> Settings <span>/</span> Notifications
          </div>
          <div className="ntf-title-row">
            <h1>Notifications &amp; Activity Center</h1>
            {unreadCount > 0 && (
              <span className="ntf-badge">
                <Bell size={13} /> {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="ntf-header-desc">
            Stay updated with real-time sprint movements, code reviews, critical bug alerts, and intelligent AI workload tips.
          </p>
        </div>

        <div className="ntf-header-actions">
          <button
            className="ntf-btn ntf-btn-secondary"
            onClick={() => setShowPreferences(true)}
          >
            <SlidersHorizontal size={15} /> Preferences
          </button>
          <button
            className="ntf-btn ntf-btn-secondary"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            <Check size={15} /> Mark All Read
          </button>
          <button
            className="ntf-btn ntf-btn-primary"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
          >
            <Trash2 size={15} /> Clear All
          </button>
        </div>
      </header>

      {/* Toast Notice */}
      {toastMessage && (
        <div
          style={{
            padding: "12px 18px",
            marginBottom: "20px",
            background: "#eaf3fe",
            color: "#1267d3",
            borderRadius: "10px",
            border: "1px solid #cbe1fc",
            fontWeight: 500,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Metrics Row */}
      <section className="ntf-stats-grid" aria-label="Notification counts">
        <article className="ntf-stat-card">
          <div className="ntf-stat-icon red">
            <Bell size={22} />
          </div>
          <div className="ntf-stat-info">
            <span className="ntf-stat-label">Unread Alerts</span>
            <strong className="ntf-stat-value">{stats.unread}</strong>
            <span className="ntf-stat-sub">Needs your review</span>
          </div>
        </article>

        <article className="ntf-stat-card">
          <div className="ntf-stat-icon blue">
            <CheckCircle2 size={22} />
          </div>
          <div className="ntf-stat-info">
            <span className="ntf-stat-label">Task Assignments</span>
            <strong className="ntf-stat-value">{stats.tasks}</strong>
            <span className="ntf-stat-sub">Across active projects</span>
          </div>
        </article>

        <article className="ntf-stat-card">
          <div className="ntf-stat-icon purple">
            <Bug size={22} />
          </div>
          <div className="ntf-stat-info">
            <span className="ntf-stat-label">Bug Reports</span>
            <strong className="ntf-stat-value">{stats.bugs}</strong>
            <span className="ntf-stat-sub">1 critical blocker</span>
          </div>
        </article>

        <article className="ntf-stat-card">
          <div className="ntf-stat-icon orange">
            <Clock3 size={22} />
          </div>
          <div className="ntf-stat-info">
            <span className="ntf-stat-label">Meetings &amp; Standups</span>
            <strong className="ntf-stat-value">{stats.meetings}</strong>
            <span className="ntf-stat-sub">Scheduled this week</span>
          </div>
        </article>
      </section>

      {/* Toolbar & Filters */}
      <div className="ntf-toolbar">
        <div className="ntf-filter-tabs">
          {CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? notifications.filter((n) => n.unread).length
                : notifications.filter((n) => n.category === cat && n.unread).length;
            return (
              <button
                key={cat}
                className={`ntf-tab ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{cat}</span>
                {count > 0 && <span className="ntf-tab-badge">{count}</span>}
              </button>
            );
          })}
        </div>

        <label className="ntf-search-box">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      {/* Notifications List */}
      <section className="ntf-list">
        {filteredNotifications.map((item) => (
          <article
            key={item.id}
            className={`ntf-item ${item.unread ? "unread" : ""}`}
          >
            <div className="ntf-item-left">
              <div className={`ntf-icon-bubble ${item.iconType}`}>
                {renderIcon(item.iconType)}
                {item.unread && <span className="ntf-dot-unread" />}
              </div>

              <div className="ntf-content">
                <div className="ntf-title-line">
                  <strong>{item.title}</strong>
                  <span className={`ntf-tag ${item.iconType}`}>
                    {item.category}
                  </span>
                  {item.urgent && (
                    <span
                      style={{
                        padding: "2px 7px",
                        borderRadius: "5px",
                        fontSize: "10.5px",
                        fontWeight: 700,
                        background: "#ffebeb",
                        color: "#d62b3a",
                      }}
                    >
                      Urgent
                    </span>
                  )}
                </div>

                <p className="ntf-desc">{item.description}</p>

                <div className="ntf-meta">
                  <span className="ntf-meta-actor">{item.actor}</span>
                  <span>·</span>
                  <span>{item.date}</span>
                  <span>·</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </div>

            <div className="ntf-item-actions">
              <button
                className="ntf-action-icon-btn"
                onClick={() => toggleReadStatus(item.id)}
                title={item.unread ? "Mark as read" : "Mark as unread"}
              >
                <Check size={15} />
              </button>
              <button
                className="ntf-action-icon-btn danger tl-btn-delete"
                onClick={() => handleDelete(item.id)}
                title="Delete notification"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </article>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="ntf-empty">
            <div className="ntf-empty-icon">
              <Bell size={26} />
            </div>
            <h3>All caught up!</h3>
            <p>
              You have no notifications matching the current filter. New sprint events, bug assignments, and comments will show up here.
            </p>
          </div>
        )}
      </section>

      {/* Preferences Modal */}
      {showPreferences && (
        <div
          className="ntf-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowPreferences(false)}
        >
          <div className="ntf-modal">
            <div className="ntf-modal-header">
              <h2>Notification Preferences</h2>
              <button
                type="button"
                className="ntf-modal-close"
                onClick={() => setShowPreferences(false)}
                style={{
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ntf-pref-list">
              <div className="ntf-pref-row">
                <div className="ntf-pref-copy">
                  <strong>Email Notifications</strong>
                  <small>Receive critical summaries directly in your inbox</small>
                </div>
                <label className="ntf-toggle">
                  <input
                    type="checkbox"
                    checked={preferences.emailAlerts}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        emailAlerts: e.target.checked,
                      }))
                    }
                  />
                  <span className="ntf-slider" />
                </label>
              </div>

              <div className="ntf-pref-row">
                <div className="ntf-pref-copy">
                  <strong>In-App Desktop Push</strong>
                  <small>Show desktop banners for real-time team events</small>
                </div>
                <label className="ntf-toggle">
                  <input
                    type="checkbox"
                    checked={preferences.inAppPush}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        inAppPush: e.target.checked,
                      }))
                    }
                  />
                  <span className="ntf-slider" />
                </label>
              </div>

              <div className="ntf-pref-row">
                <div className="ntf-pref-copy">
                  <strong>Critical Bug &amp; Blocker Alerts</strong>
                  <small>Immediate alerts whenever a high-severity bug is logged</small>
                </div>
                <label className="ntf-toggle">
                  <input
                    type="checkbox"
                    checked={preferences.criticalBugs}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        criticalBugs: e.target.checked,
                      }))
                    }
                  />
                  <span className="ntf-slider" />
                </label>
              </div>

              <div className="ntf-pref-row">
                <div className="ntf-pref-copy">
                  <strong>Meeting &amp; Standup Reminders</strong>
                  <small>10-minute warning before scheduled meetings</small>
                </div>
                <label className="ntf-toggle">
                  <input
                    type="checkbox"
                    checked={preferences.meetingReminders}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        meetingReminders: e.target.checked,
                      }))
                    }
                  />
                  <span className="ntf-slider" />
                </label>
              </div>

              <div className="ntf-pref-row">
                <div className="ntf-pref-copy">
                  <strong>AI Workload &amp; Burnout Digest</strong>
                  <small>Daily proactive suggestions on developer workload</small>
                </div>
                <label className="ntf-toggle">
                  <input
                    type="checkbox"
                    checked={preferences.aiDigest}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        aiDigest: e.target.checked,
                      }))
                    }
                  />
                  <span className="ntf-slider" />
                </label>
              </div>
            </div>

            <div className="ntf-pref-footer">
              <button
                className="ntf-btn ntf-btn-secondary"
                type="button"
                onClick={() => setPreferences({ ...DEFAULT_PREFERENCES })}
              >
                Reset Defaults
              </button>
              <button
                className="ntf-btn ntf-btn-primary"
                onClick={() => {
                  try {
                    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
                    setShowPreferences(false);
                    setToastMessage("Notification preferences saved successfully.");
                    setTimeout(() => setToastMessage(""), 3000);
                  } catch {
                    setToastMessage("Could not save preferences in this browser.");
                    setTimeout(() => setToastMessage(""), 3000);
                  }
                }}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
