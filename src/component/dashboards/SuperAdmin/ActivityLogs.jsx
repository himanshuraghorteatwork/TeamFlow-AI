
import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  LogIn,
  RefreshCw,
  Search,
  Shield,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import "./ActivityLogs.css";

const INITIAL_LOGS = [
  {
    id: "ACT-1001",
    action: "User created",
    category: "User Management",
    description: "A new user account was created.",
    actor: "Sohan Admin",
    email: "admin@teamflow.demo",
    target: "Aarav Sharma",
    organization: "Acme Technologies",
    status: "Success",
    date: "2026-10-23T09:42:00",
    ip: "192.168.1.104",
  },
  {
    id: "ACT-1002",
    action: "Organization created",
    category: "Organization",
    description: "A new organization was registered.",
    actor: "Sohan Admin",
    email: "admin@teamflow.demo",
    target: "Nova Solutions",
    organization: "Nova Solutions",
    status: "Success",
    date: "2026-10-23T09:15:00",
    ip: "192.168.1.104",
  },
  {
    id: "ACT-1003",
    action: "Login successful",
    category: "Authentication",
    description: "An administrator signed in successfully.",
    actor: "Priya Patel",
    email: "priya@teamflow.demo",
    target: "Admin portal",
    organization: "Acme Technologies",
    status: "Success",
    date: "2026-10-23T08:51:00",
    ip: "192.168.1.115",
  },
  {
    id: "ACT-1004",
    action: "Login failed",
    category: "Security",
    description: "A sign-in attempt was unsuccessful.",
    actor: "Unknown user",
    email: "unknown@example.demo",
    target: "Admin portal",
    organization: "Unknown",
    status: "Warning",
    date: "2026-10-23T08:34:00",
    ip: "203.0.113.42",
  },
  {
    id: "ACT-1005",
    action: "User suspended",
    category: "User Management",
    description: "A user account was suspended.",
    actor: "Sohan Admin",
    email: "admin@teamflow.demo",
    target: "Rohan Mehta",
    organization: "Pixel Studios",
    status: "Success",
    date: "2026-10-22T17:20:00",
    ip: "192.168.1.104",
  },
  {
    id: "ACT-1006",
    action: "Organization updated",
    category: "Organization",
    description: "Organization information was modified.",
    actor: "Meera Shah",
    email: "meera@teamflow.demo",
    target: "Bright Labs",
    organization: "Bright Labs",
    status: "Success",
    date: "2026-10-22T15:12:00",
    ip: "192.168.1.120",
  },
  {
    id: "ACT-1007",
    action: "Permission changed",
    category: "Security",
    description: "A role permission was updated.",
    actor: "Sohan Admin",
    email: "admin@teamflow.demo",
    target: "Project Manager role",
    organization: "Nova Solutions",
    status: "Warning",
    date: "2026-10-22T13:45:00",
    ip: "192.168.1.104",
  },
  {
    id: "ACT-1008",
    action: "User invited",
    category: "User Management",
    description: "An invitation was sent to a new user.",
    actor: "Priya Patel",
    email: "priya@teamflow.demo",
    target: "Karan Joshi",
    organization: "Vertex Systems",
    status: "Success",
    date: "2026-10-22T11:06:00",
    ip: "192.168.1.115",
  },
  {
    id: "ACT-1009",
    action: "Login failed",
    category: "Security",
    description: "Multiple sign-in attempts were rejected.",
    actor: "Unknown user",
    email: "attempt@example.demo",
    target: "Admin portal",
    organization: "Unknown",
    status: "Warning",
    date: "2026-10-21T19:30:00",
    ip: "203.0.113.67",
  },
  {
    id: "ACT-1010",
    action: "Organization suspended",
    category: "Organization",
    description: "Organization access was suspended.",
    actor: "Sohan Admin",
    email: "admin@teamflow.demo",
    target: "Old Demo Workspace",
    organization: "Old Demo Workspace",
    status: "Success",
    date: "2026-10-21T14:08:00",
    ip: "192.168.1.104",
  },
  {
    id: "ACT-1011",
    action: "User role updated",
    category: "User Management",
    description: "A user's platform role was changed.",
    actor: "Meera Shah",
    email: "meera@teamflow.demo",
    target: "Aarav Sharma",
    organization: "Acme Technologies",
    status: "Success",
    date: "2026-10-20T16:21:00",
    ip: "192.168.1.120",
  },
  {
    id: "ACT-1012",
    action: "Session expired",
    category: "Authentication",
    description: "A user session expired.",
    actor: "Karan Joshi",
    email: "karan@teamflow.demo",
    target: "TeamFlow workspace",
    organization: "Vertex Systems",
    status: "Info",
    date: "2026-10-20T10:17:00",
    ip: "192.168.1.130",
  },
];

const CATEGORY_OPTIONS = [
  "All categories",
  "Authentication",
  "User Management",
  "Organization",
  "Security",
];

const getActionIcon = (action) => {
  const value = action.toLowerCase();

  if (value.includes("login") || value.includes("session")) return LogIn;
  if (value.includes("organization")) return Building2;
  if (value.includes("permission")) return Shield;
  if (value.includes("invited") || value.includes("created")) return UserPlus;
  if (value.includes("suspended")) return AlertTriangle;
  if (value.includes("user")) return Users;

  return Activity;
};

const formatDate = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function ActivityLogs() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");
  const [dateRange, setDateRange] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [toast, setToast] = useState("");

  const pageSize = 8;

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    const now = new Date();

    return logs.filter((log) => {
      const matchesSearch =
        !query ||
        [
          log.id,
          log.action,
          log.description,
          log.actor,
          log.email,
          log.target,
          log.organization,
          log.ip,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesCategory =
        category === "All categories" || log.category === category;

      const matchesStatus = status === "All statuses" || log.status === status;

      const logDate = new Date(log.date);
      const daysOld = (now.getTime() - logDate.getTime()) / 86400000;

      const matchesDate =
        dateRange === "all" ||
        (dateRange === "today" && logDate.toDateString() === now.toDateString()) ||
        (dateRange === "7days" && daysOld >= 0 && daysOld <= 7) ||
        (dateRange === "30days" && daysOld >= 0 && daysOld <= 30);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [logs, search, category, status, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const stats = useMemo(
    () => ({
      total: logs.length,
      success: logs.filter((log) => log.status === "Success").length,
      warnings: logs.filter((log) => log.status === "Warning").length,
      categories: new Set(logs.map((log) => log.category)).size,
    }),
    [logs]
  );

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All categories");
    setStatus("All statuses");
    setDateRange("all");
    setPage(1);
  };

  const exportCsv = () => {
    const headers = [
      "ID",
      "Action",
      "Category",
      "Description",
      "Actor",
      "Email",
      "Target",
      "Organization",
      "Status",
      "Date",
      "IP Address",
    ];

    const rows = filteredLogs.map((log) => [
      log.id,
      log.action,
      log.category,
      log.description,
      log.actor,
      log.email,
      log.target,
      log.organization,
      log.status,
      formatDate(log.date),
      log.ip,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "teamflow-activity-logs.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    showToast("Activity logs exported successfully.");
  };

  const clearDemoLogs = () => {
    const confirmed = window.confirm(
      "Clear all demo activity logs? This only affects this page's current demo data."
    );

    if (!confirmed) return;

    setLogs([]);
    setPage(1);
    setSelectedLog(null);
    showToast("Demo logs cleared.");
  };

  return (
    <div className="activity-logs-page">
      <header className="activity-logs-header">
        <div>
          <div className="activity-logs-eyebrow">
            <Shield size={14} />
            SECURITY &amp; AUDIT
          </div>
          <h1>Activity Logs</h1>
          <p>
            Track platform events, administrative actions, and security
            activity in one place.
          </p>
        </div>

        <div className="activity-logs-header-actions">
          <button
            type="button"
            className="activity-logs-button activity-logs-button-light"
            onClick={resetFilters}
          >
            <RefreshCw size={16} />
            Reset filters
          </button>

          <button
            type="button"
            className="activity-logs-button activity-logs-button-primary"
            onClick={exportCsv}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </header>

      <section className="activity-logs-stats">
        <article className="activity-logs-stat-card">
          <span className="activity-logs-stat-icon purple">
            <Activity size={20} />
          </span>
          <div>
            <span>Total events</span>
            <strong>{stats.total}</strong>
            <small>Available demo records</small>
          </div>
        </article>

        <article className="activity-logs-stat-card">
          <span className="activity-logs-stat-icon green">
            <CheckCircle2 size={20} />
          </span>
          <div>
            <span>Successful actions</span>
            <strong>{stats.success}</strong>
            <small>Completed events</small>
          </div>
        </article>

        <article className="activity-logs-stat-card">
          <span className="activity-logs-stat-icon amber">
            <AlertTriangle size={20} />
          </span>
          <div>
            <span>Security warnings</span>
            <strong>{stats.warnings}</strong>
            <small>Events to review</small>
          </div>
        </article>

        <article className="activity-logs-stat-card">
          <span className="activity-logs-stat-icon blue">
            <Filter size={20} />
          </span>
          <div>
            <span>Event categories</span>
            <strong>{stats.categories}</strong>
            <small>Tracked categories</small>
          </div>
        </article>
      </section>

      <section className="activity-logs-panel">
        <div className="activity-logs-panel-heading">
          <div>
            <h2>Event history</h2>
            <p>Search, filter, and inspect platform activity records.</p>
          </div>

          <span className="activity-logs-demo-badge">
            <span />
            Sample data
          </span>
        </div>

        <div className="activity-logs-filters">
          <label className="activity-logs-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search actor, event, organization, IP..."
              aria-label="Search activity logs"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </label>

          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by category"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by status"
          >
            <option>All statuses</option>
            <option>Success</option>
            <option>Warning</option>
            <option>Info</option>
          </select>

          <select
            value={dateRange}
            onChange={(event) => {
              setDateRange(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by date"
          >
            <option value="all">All dates</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
          </select>
        </div>

        <div className="activity-logs-table-wrap">
          <table className="activity-logs-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Actor</th>
                <th>Target / organization</th>
                <th>Date &amp; time</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>

            <tbody>
              {pageLogs.map((log) => {
                const ActionIcon = getActionIcon(log.action);

                return (
                  <tr key={log.id}>
                    <td>
                      <div className="activity-logs-event-cell">
                        <span className="activity-logs-event-icon">
                          <ActionIcon size={17} />
                        </span>
                        <div>
                          <strong>{log.action}</strong>
                          <span>{log.id} · {log.category}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="activity-logs-actor">
                        <strong>{log.actor}</strong>
                        <span>{log.email}</span>
                      </div>
                    </td>

                    <td>
                      <div className="activity-logs-target">
                        <strong>{log.target}</strong>
                        <span>{log.organization}</span>
                      </div>
                    </td>

                    <td>
                      <div className="activity-logs-date">
                        <strong>{formatDate(log.date).split(",")[0]}</strong>
                        <span>
                          {formatDate(log.date).split(",").slice(1).join(",")}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`activity-logs-status activity-logs-status-${log.status.toLowerCase()}`}
                      >
                        <span />
                        {log.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="activity-logs-view-button"
                        title="View event details"
                        aria-label={`View ${log.id}`}
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {pageLogs.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className="activity-logs-empty">
                      <CalendarDays size={27} />
                      <strong>No activity found</strong>
                      <span>Try changing your search or filter settings.</span>
                      <button type="button" onClick={resetFilters}>
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="activity-logs-pagination">
          <span>
            Showing{" "}
            {filteredLogs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            {"–"}
            {Math.min(currentPage * pageSize, filteredLogs.length)} of{" "}
            {filteredLogs.length} events
          </span>

          <div>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((value) => value - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={17} />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((value) => value + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </footer>
      </section>

      <p className="activity-logs-disclaimer">
        <Shield size={14} />
        Demo audit records only. Real audit logging should be generated and
        stored by the backend, not by the browser.
      </p>

      {selectedLog && (
        <div
          className="activity-logs-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedLog(null);
          }}
        >
          <section
            className="activity-logs-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="activity-log-modal-title"
          >
            <header>
              <div>
                <span className="activity-logs-modal-icon">
                  <Eye size={19} />
                </span>
                <div>
                  <h2 id="activity-log-modal-title">Event details</h2>
                  <p>{selectedLog.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                aria-label="Close details"
              >
                <X size={19} />
              </button>
            </header>

            <div className="activity-logs-modal-body">
              <div className="activity-logs-detail-summary">
                <span
                  className={`activity-logs-status activity-logs-status-${selectedLog.status.toLowerCase()}`}
                >
                  <span />
                  {selectedLog.status}
                </span>
                <h3>{selectedLog.action}</h3>
                <p>{selectedLog.description}</p>
              </div>

              {[
                ["Event ID", selectedLog.id],
                ["Category", selectedLog.category],
                ["Actor", selectedLog.actor],
                ["Actor email", selectedLog.email],
                ["Target", selectedLog.target],
                ["Organization", selectedLog.organization],
                ["Date & time", formatDate(selectedLog.date)],
                ["IP address", selectedLog.ip],
              ].map(([label, value]) => (
                <div className="activity-logs-detail-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <footer>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="activity-logs-button activity-logs-button-primary"
              >
                Close details
              </button>
            </footer>
          </section>
        </div>
      )}

      {toast && <div className="activity-logs-toast">{toast}</div>}
    </div>
  );
}

export default ActivityLogs;
