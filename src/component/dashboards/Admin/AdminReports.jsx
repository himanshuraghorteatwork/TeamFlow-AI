// src/component/AdminReports/AdminReports.jsx

import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Plus,
  ChevronDown,
  FileText,
  Download,
  Trash2,
  Eye,
  X,
  Check,
  Users,
  Building2,
  FolderKanban,
  DollarSign,
  FileSpreadsheet,
  MoreVertical,
  RefreshCw,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

import AdminSidebar from "../../../layouts/AdminSidebar/AdminSidebar.jsx";

import {
  initialReports,
  reportTypes,
  reportSummary,
  reportTemplates,
} from "./adminReportsData.js";

import "./AdminReports.css";

const STORAGE_KEY = "teamflow_admin_reports";

function AdminReports() {
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      return saved ? JSON.parse(saved) : initialReports;
    } catch {
      return initialReports;
    }
  });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const [reportForm, setReportForm] = useState({
    name: "",
    type: "User Report",
    startDate: "",
    endDate: "",
    format: "CSV",
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(reports)
    );
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        report.name.toLowerCase().includes(query) ||
        report.id.toLowerCase().includes(query) ||
        report.createdBy.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "All" ||
        report.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        report.status === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [reports, search, typeFilter, statusFilter]);

  const totalRecords = reports.reduce(
    (total, report) =>
      total + Number(report.records || 0),
    0
  );

  const openGenerator = (type = "User Report") => {
    setReportForm({
      name: "",
      type,
      startDate: "",
      endDate: "",
      format: "CSV",
    });

    setShowGenerator(true);
  };

  const generateReport = () => {
    if (!reportForm.name.trim()) {
      alert("Please enter report name.");
      return;
    }

    if (!reportForm.startDate || !reportForm.endDate) {
      alert("Please select start and end date.");
      return;
    }

    if (
      new Date(reportForm.startDate) >
      new Date(reportForm.endDate)
    ) {
      alert("Start date cannot be after end date.");
      return;
    }

    const records = getRecordCount(reportForm.type);

    const newReport = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      name: reportForm.name,
      type: reportForm.type,

      period: `${formatDate(
        reportForm.startDate
      )} - ${formatDate(reportForm.endDate)}`,

      createdBy: "Himanshu",

      createdAt: new Date().toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }
      ),

      status: "Ready",
      format: reportForm.format,
      size: calculateSize(records),
      records,
    };

    setReports((previous) => [
      newReport,
      ...previous,
    ]);

    setShowGenerator(false);
  };

  const deleteReport = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmed) return;

    setReports((previous) =>
      previous.filter((report) => report.id !== id)
    );

    setMenuId(null);
  };

  const downloadReport = (report) => {
    const data = createReportData(report);

    const headers = Object.keys(data[0] || {});

    const csvRows = [
      headers.join(","),

      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header] ?? "";

            return `"${String(value).replace(
              /"/g,
              '""'
            )}"`;
          })
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${report.name
      .replace(/\s+/g, "-")
      .toLowerCase()}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setMenuId(null);
  };

  const resetReports = () => {
    const confirmed = window.confirm(
      "Reset report demo data?"
    );

    if (!confirmed) return;

    setReports(initialReports);
    setSearch("");
    setTypeFilter("All");
    setStatusFilter("All");
  };

  return (
    <div className="admin-reports-shell">
      <AdminSidebar />

      <main className="admin-reports-main">
        {/* ================= TOPBAR ================= */}

        <header className="admin-reports-topbar">
          <div className="admin-reports-global-search">
            <Search size={17} />

            <input
              placeholder="Search users, workspaces, projects, or anything..."
            />

            <span>Ctrl + K</span>
          </div>

          <div className="admin-reports-top-actions">
            <button
              className="admin-reports-create-top"
              onClick={() => openGenerator()}
            >
              <Plus size={17} />
              Create
              <ChevronDown size={14} />
            </button>

            <div className="admin-reports-profile">
              <div className="admin-reports-avatar">
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

        <div className="admin-reports-content">
          {/* ================= HEADER ================= */}

          <section className="admin-reports-heading">
            <div>
              <div className="admin-reports-breadcrumb">
                <FileText size={15} />
                ADMIN / REPORTS
              </div>

              <h1>Reports</h1>

              <p>
                Generate, review and export TeamFlow AI
                platform reports.
              </p>
            </div>

            <button
              className="admin-reports-primary"
              onClick={() => openGenerator()}
            >
              <Plus size={16} />
              Generate Report
            </button>
          </section>

          {/* ================= STATS ================= */}

          <section className="admin-reports-stats">
            <StatCard
              title="Generated Reports"
              value={reports.length}
              text="Available reports"
              icon={FileText}
              type="purple"
            />

            <StatCard
              title="Total Records"
              value={totalRecords.toLocaleString()}
              text="Across reports"
              icon={FileSpreadsheet}
              type="blue"
            />

            <StatCard
              title="Platform Users"
              value={reportSummary.totalUsers.toLocaleString()}
              text={`${reportSummary.activeUsers} active`}
              icon={Users}
              type="green"
            />

            <StatCard
              title="Workspaces"
              value={reportSummary.workspaces}
              text="Active workspaces"
              icon={Building2}
              type="orange"
            />

            <StatCard
              title="Monthly Revenue"
              value={`$${reportSummary.revenue.toLocaleString()}`}
              text="Current month"
              icon={DollarSign}
              type="pink"
            />
          </section>

          {/* ================= QUICK REPORTS ================= */}

          <section className="admin-reports-section">
            <div className="admin-reports-section-header">
              <div>
                <h3>Quick Reports</h3>

                <p>
                  Generate frequently used reports
                  quickly.
                </p>
              </div>

              <BarChart3 size={18} />
            </div>

            <div className="admin-reports-template-grid">
              {reportTemplates.map((template) => (
                <article
                  className="admin-report-template"
                  key={template.id}
                >
                  <div className="admin-report-template-icon">
                    {getTemplateIcon(template.type)}
                  </div>

                  <div>
                    <h4>{template.title}</h4>

                    <p>{template.description}</p>
                  </div>

                  <button
                    onClick={() =>
                      openGenerator(template.type)
                    }
                  >
                    Generate
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* ================= REPORT HISTORY ================= */}

          <section className="admin-reports-section">
            <div className="admin-reports-section-header">
              <div>
                <h3>Report History</h3>

                <p>
                  View and manage previously generated
                  reports.
                </p>
              </div>

              <button
                className="admin-reports-reset"
                onClick={resetReports}
              >
                <RefreshCw size={14} />
                Reset Demo Data
              </button>
            </div>

            {/* FILTERS */}

            <div className="admin-reports-toolbar">
              <div className="admin-reports-search">
                <Search size={15} />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search reports..."
                />
              </div>

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value)
                }
              >
                <option value="All">
                  All Report Types
                </option>

                {reportTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">
                  All Status
                </option>

                <option value="Ready">
                  Ready
                </option>

                <option value="Processing">
                  Processing
                </option>
              </select>
            </div>

            <div className="admin-reports-count">
              Showing {filteredReports.length} of{" "}
              {reports.length} reports
            </div>

            {/* ================= TABLE ================= */}

            <div className="admin-reports-table-wrapper">
              <table className="admin-reports-table">
                <thead>
                  <tr>
                    <th>REPORT</th>
                    <th>TYPE</th>
                    <th>PERIOD</th>
                    <th>RECORDS</th>
                    <th>FORMAT</th>
                    <th>STATUS</th>
                    <th>CREATED</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td>
                        <div className="admin-report-name">
                          <div>
                            <FileText size={16} />
                          </div>

                          <span>
                            <strong>
                              {report.name}
                            </strong>

                            <small>
                              {report.id}
                            </small>
                          </span>
                        </div>
                      </td>

                      <td>{report.type}</td>

                      <td>{report.period}</td>

                      <td>
                        {report.records.toLocaleString()}
                      </td>

                      <td>
                        <span className="admin-report-format">
                          {report.format}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-report-status ${report.status.toLowerCase()}`}
                        >
                          <CheckCircle2 size={11} />
                          {report.status}
                        </span>
                      </td>

                      <td>
                        <span className="admin-report-created">
                          {report.createdAt}

                          <small>
                            {report.createdBy}
                          </small>
                        </span>
                      </td>

                      <td>
                        <div className="admin-report-action-wrap">
                          <button
                            className="admin-report-action"
                            onClick={() =>
                              setMenuId(
                                menuId === report.id
                                  ? null
                                  : report.id
                              )
                            }
                          >
                            <MoreVertical size={17} />
                          </button>

                          {menuId === report.id && (
                            <div className="admin-report-menu">
                              <button
                                onClick={() => {
                                  setSelectedReport(
                                    report
                                  );

                                  setMenuId(null);
                                }}
                              >
                                <Eye size={14} />
                                View Report
                              </button>

                              <button
                                onClick={() =>
                                  downloadReport(report)
                                }
                              >
                                <Download size={14} />
                                Download CSV
                              </button>

                              <button
                                className="delete"
                                onClick={() =>
                                  deleteReport(report.id)
                                }
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredReports.length === 0 && (
                <div className="admin-reports-empty">
                  <FileText size={42} />

                  <h3>No reports found</h3>

                  <p>
                    Try changing your filters or
                    generate a new report.
                  </p>

                  <button
                    onClick={() => openGenerator()}
                  >
                    <Plus size={14} />
                    Generate Report
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* =====================================================
          GENERATE REPORT MODAL
      ===================================================== */}

      {showGenerator && (
        <div className="admin-reports-modal-overlay">
          <div className="admin-reports-modal">
            <div className="admin-reports-modal-header">
              <div>
                <h2>Generate Report</h2>

                <p>
                  Configure the report you want to
                  generate.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowGenerator(false)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-reports-form">
              <label>
                Report Name

                <input
                  value={reportForm.name}
                  onChange={(event) =>
                    setReportForm({
                      ...reportForm,
                      name: event.target.value,
                    })
                  }
                  placeholder="Example: October User Report"
                />
              </label>

              <label>
                Report Type

                <select
                  value={reportForm.type}
                  onChange={(event) =>
                    setReportForm({
                      ...reportForm,
                      type: event.target.value,
                    })
                  }
                >
                  {reportTypes.map((type) => (
                    <option
                      value={type}
                      key={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <div className="admin-reports-form-grid">
                <label>
                  Start Date

                  <input
                    type="date"
                    value={reportForm.startDate}
                    onChange={(event) =>
                      setReportForm({
                        ...reportForm,
                        startDate:
                          event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  End Date

                  <input
                    type="date"
                    value={reportForm.endDate}
                    onChange={(event) =>
                      setReportForm({
                        ...reportForm,
                        endDate:
                          event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <label>
                Export Format

                <select
                  value={reportForm.format}
                  onChange={(event) =>
                    setReportForm({
                      ...reportForm,
                      format: event.target.value,
                    })
                  }
                >
                  <option value="CSV">
                    CSV
                  </option>

                  <option value="Excel">
                    Excel
                  </option>

                  <option value="PDF">
                    PDF
                  </option>
                </select>
              </label>

              <div className="admin-report-generation-info">
                <FileSpreadsheet size={19} />

                <div>
                  <strong>
                    Report Generation
                  </strong>

                  <p>
                    This demo generates the report
                    instantly and saves it in browser
                    storage.
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-reports-modal-footer">
              <button
                className="admin-reports-secondary"
                onClick={() =>
                  setShowGenerator(false)
                }
              >
                Cancel
              </button>

              <button
                className="admin-reports-primary"
                onClick={generateReport}
              >
                <Check size={15} />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          VIEW REPORT MODAL
      ===================================================== */}

      {selectedReport && (
        <div className="admin-reports-modal-overlay">
          <div className="admin-reports-view-modal">
            <div className="admin-reports-modal-header">
              <div>
                <span className="admin-report-modal-label">
                  REPORT DETAILS
                </span>

                <h2>{selectedReport.name}</h2>
              </div>

              <button
                onClick={() =>
                  setSelectedReport(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-report-view-body">
              <div className="admin-report-view-hero">
                <div>
                  <FileText size={27} />
                </div>

                <span>
                  <strong>
                    {selectedReport.id}
                  </strong>

                  <small>
                    {selectedReport.type}
                  </small>
                </span>

                <span className="admin-report-status ready">
                  <CheckCircle2 size={11} />
                  {selectedReport.status}
                </span>
              </div>

              <div className="admin-report-view-grid">
                <ReportInfo
                  label="Report Type"
                  value={selectedReport.type}
                />

                <ReportInfo
                  label="Date Period"
                  value={selectedReport.period}
                />

                <ReportInfo
                  label="Records"
                  value={selectedReport.records.toLocaleString()}
                />

                <ReportInfo
                  label="File Size"
                  value={selectedReport.size}
                />

                <ReportInfo
                  label="Format"
                  value={selectedReport.format}
                />

                <ReportInfo
                  label="Created By"
                  value={selectedReport.createdBy}
                />

                <ReportInfo
                  label="Created Date"
                  value={selectedReport.createdAt}
                />

                <ReportInfo
                  label="Status"
                  value={selectedReport.status}
                />
              </div>

              <ReportPreview
                report={selectedReport}
              />
            </div>

            <div className="admin-reports-modal-footer">
              <button
                className="admin-reports-secondary"
                onClick={() =>
                  setSelectedReport(null)
                }
              >
                Close
              </button>

              <button
                className="admin-reports-primary"
                onClick={() =>
                  downloadReport(selectedReport)
                }
              >
                <Download size={15} />
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function StatCard({
  title,
  value,
  text,
  icon: Icon,
  type,
}) {
  return (
    <article className="admin-reports-stat">
      <div
        className={`admin-reports-stat-icon ${type}`}
      >
        <Icon size={20} />
      </div>

      <div>
        <span>{title}</span>

        <strong>{value}</strong>

        <small>{text}</small>
      </div>
    </article>
  );
}

function ReportInfo({ label, value }) {
  return (
    <div className="admin-report-info">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ReportPreview({ report }) {
  const data = createReportData(report).slice(0, 5);

  if (!data.length) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="admin-report-preview">
      <div className="admin-report-preview-header">
        <div>
          <h3>Report Preview</h3>
          <p>Showing sample report data.</p>
        </div>

        <Eye size={17} />
      </div>

      <div className="admin-report-preview-table-wrap">
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {headers.map((header) => (
                  <td key={header}>
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatDate(date) {
  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function getRecordCount(type) {
  const counts = {
    "User Report": 1248,
    "Workspace Report": 186,
    "Project Report": 542,
    "Task Report": 3421,
    "Revenue Report": 428,
    "Subscription Report": 144,
    "AI Usage Report": 12480,
    "System Activity Report": 8240,
  };

  return counts[type] || 100;
}

function calculateSize(records) {
  if (records > 5000) {
    return `${(records / 3000).toFixed(1)} MB`;
  }

  if (records > 1000) {
    return `${(records / 1000).toFixed(1)} MB`;
  }

  return `${Math.max(
    120,
    Math.round(records * 2.3)
  )} KB`;
}

function getTemplateIcon(type) {
  switch (type) {
    case "User Report":
      return <Users size={21} />;

    case "Workspace Report":
      return <Building2 size={21} />;

    case "Revenue Report":
      return <DollarSign size={21} />;

    case "Project Report":
      return <FolderKanban size={21} />;

    default:
      return <FileText size={21} />;
  }
}

function createReportData(report) {
  switch (report.type) {
    case "User Report":
      return [
        {
          User: "John Doe",
          Email: "john@company.com",
          Role: "Admin",
          Status: "Active",
        },
        {
          User: "Sarah Chen",
          Email: "sarah@company.com",
          Role: "Team Lead",
          Status: "Active",
        },
        {
          User: "David Lee",
          Email: "david@company.com",
          Role: "Member",
          Status: "Active",
        },
        {
          User: "Emily Parker",
          Email: "emily@company.com",
          Role: "Member",
          Status: "Inactive",
        },
        {
          User: "Michael Brown",
          Email: "michael@company.com",
          Role: "Admin",
          Status: "Active",
        },
      ];

    case "Workspace Report":
      return [
        {
          Workspace: "Product Team",
          Members: 24,
          Projects: 12,
          Plan: "Enterprise",
        },
        {
          Workspace: "Development Hub",
          Members: 32,
          Projects: 18,
          Plan: "Enterprise",
        },
        {
          Workspace: "Marketing Team",
          Members: 12,
          Projects: 8,
          Plan: "Business",
        },
        {
          Workspace: "Design Studio",
          Members: 8,
          Projects: 6,
          Plan: "Pro",
        },
        {
          Workspace: "Research Lab",
          Members: 16,
          Projects: 9,
          Plan: "Business",
        },
      ];

    case "Project Report":
      return [
        {
          Project: "TeamFlow AI",
          Status: "Active",
          Progress: "72%",
          Tasks: 48,
        },
        {
          Project: "Mobile App",
          Status: "Active",
          Progress: "50%",
          Tasks: 34,
        },
        {
          Project: "Marketing Website",
          Status: "Completed",
          Progress: "100%",
          Tasks: 26,
        },
        {
          Project: "AI Assistant",
          Status: "On Hold",
          Progress: "33%",
          Tasks: 21,
        },
        {
          Project: "Backend API",
          Status: "Active",
          Progress: "61%",
          Tasks: 57,
        },
      ];

    case "Task Report":
      return [
        {
          Task: "Build dashboard",
          Assignee: "John",
          Status: "Completed",
          Priority: "High",
        },
        {
          Task: "Create API",
          Assignee: "David",
          Status: "In Progress",
          Priority: "High",
        },
        {
          Task: "Design UI",
          Assignee: "Sarah",
          Status: "Review",
          Priority: "Medium",
        },
        {
          Task: "Testing",
          Assignee: "Emily",
          Status: "To Do",
          Priority: "Medium",
        },
      ];

    case "Revenue Report":
      return [
        {
          Month: "May",
          Revenue: "$12,400",
          Subscriptions: 78,
        },
        {
          Month: "June",
          Revenue: "$14,800",
          Subscriptions: 89,
        },
        {
          Month: "July",
          Revenue: "$16,200",
          Subscriptions: 98,
        },
        {
          Month: "August",
          Revenue: "$18,700",
          Subscriptions: 112,
        },
        {
          Month: "September",
          Revenue: "$21,500",
          Subscriptions: 128,
        },
        {
          Month: "October",
          Revenue: "$24,820",
          Subscriptions: 144,
        },
      ];

    case "Subscription Report":
      return [
        {
          Plan: "Free",
          Subscribers: 42,
          Revenue: "$0",
        },
        {
          Plan: "Pro",
          Subscribers: 68,
          Revenue: "$6,732",
        },
        {
          Plan: "Business",
          Subscribers: 51,
          Revenue: "$12,699",
        },
        {
          Plan: "Enterprise",
          Subscribers: 25,
          Revenue: "$5,389",
        },
      ];

    case "AI Usage Report":
      return [
        {
          Tool: "AI Summary",
          Requests: 4280,
          Users: 412,
        },
        {
          Tool: "Task Assistant",
          Requests: 3260,
          Users: 326,
        },
        {
          Tool: "Bug Assistant",
          Requests: 2480,
          Users: 218,
        },
        {
          Tool: "Chat Assistant",
          Requests: 2460,
          Users: 284,
        },
      ];

    default:
      return [
        {
          Metric: "Active Users",
          Value: reportSummary.activeUsers,
        },
        {
          Metric: "Workspaces",
          Value: reportSummary.workspaces,
        },
        {
          Metric: "Projects",
          Value: reportSummary.projects,
        },
        {
          Metric: "Tasks",
          Value: reportSummary.tasks,
        },
      ];
  }
}

export default AdminReports;