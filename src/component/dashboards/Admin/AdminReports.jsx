import React, { useState, useMemo, useEffect } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Users,
  Building2,
  CircleDollarSign,
  Zap,
  Sparkles,
  X,
  HardDrive,
  AlertTriangle,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import {
  initialReports,
  reportTypes,
  reportTemplates
} from "./adminReportsData.js";
import "./AdminReports.css";

const STORAGE_KEY = "teamflow_admin_reports";

export default function AdminReports() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) {
          return parsed;
        }
      }
      return initialReports;
    } catch {
      return initialReports;
    }
  });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formatFilter, setFormatFilter] = useState("All");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(null);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (reportToDelete) setReportToDelete(null);
        else if (selectedReport) setSelectedReport(null);
        else if (showGenerator) setShowGenerator(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [reportToDelete, selectedReport, showGenerator]);

  const [reportForm, setReportForm] = useState({
    name: "",
    type: "User Report",
    startDate: "2026-10-01",
    endDate: "2026-10-26",
    format: "CSV",
    includeInactive: false,
    includeTimestamps: true
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }, [reports]);

  const handleSort = (key) => {
    setCurrentPage(1);
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (key) => {
    if (sortKey !== key) {
      return <ArrowUpDown size={13} className="sort-icon muted" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp size={13} className="sort-icon active" />
    ) : (
      <ArrowDown size={13} className="sort-icon active" />
    );
  };

  const filteredReports = useMemo(() => {
    return [...reports]
      .filter((r) => {
        const matchesSearch =
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.id.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === "All" || r.type === typeFilter;
        const matchesStatus =
          statusFilter === "All" ||
          r.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesFormat =
          formatFilter === "All" ||
          r.format.toLowerCase() === formatFilter.toLowerCase();
        return matchesSearch && matchesType && matchesStatus && matchesFormat;
      })
      .sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        if (sortKey === "records") {
          return sortOrder === "asc"
            ? Number(a.records) - Number(b.records)
            : Number(b.records) - Number(a.records);
        }

        if (sortKey === "createdAt") {
          const timeA = new Date(a.createdAt).getTime() || 0;
          const timeB = new Date(b.createdAt).getTime() || 0;
          return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
        }

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [reports, search, typeFilter, statusFilter, formatFilter, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / perPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedReports = useMemo(() => {
    const start = (safeCurrentPage - 1) * perPage;
    return filteredReports.slice(start, start + perPage);
  }, [filteredReports, safeCurrentPage, perPage]);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (safeCurrentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, "...", totalPages];
  };

  const totalRecords = useMemo(() => {
    return reports.reduce((acc, r) => acc + (Number(r.records) || 0), 0);
  }, [reports]);

  const handleOpenGenerator = (type = "User Report", templateName = "") => {
    setReportForm({
      name: templateName || `Monthly ${type.replace(" Report", "")} Summary`,
      type,
      startDate: "2026-10-01",
      endDate: "2026-10-26",
      format: "CSV",
      includeInactive: false,
      includeTimestamps: true
    });
    setShowGenerator(true);
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    if (!reportForm.name.trim()) return;

    let baseRecords = 450;
    if (reportForm.type.includes("User")) baseRecords = 1248;
    else if (reportForm.type.includes("Workspace")) baseRecords = 186;
    else if (reportForm.type.includes("Project")) baseRecords = 542;
    else if (reportForm.type.includes("Task")) baseRecords = 3421;
    else if (reportForm.type.includes("AI")) baseRecords = 9200;

    const newReport = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: reportForm.name,
      type: reportForm.type,
      period: `${reportForm.startDate} - ${reportForm.endDate}`,
      createdBy: "Amit Sharma",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      status: "Ready",
      format: reportForm.format,
      size: `${(Math.random() * 1.5 + 0.3).toFixed(1)} MB`,
      records: baseRecords
    };

    setReports([newReport, ...reports]);
    setShowGenerator(false);
  };

  const confirmDeleteReport = () => {
    if (!reportToDelete) return;
    const deletedId = reportToDelete.id;
    const deletedName = reportToDelete.name;
    setReports((prev) => prev.filter((r) => r.id !== deletedId));
    if (selectedReport?.id === deletedId) {
      setSelectedReport(null);
    }
    setReportToDelete(null);
    setActionNotice(`Report "${deletedName}" (${deletedId}) removed from archive.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleDownloadReport = (rep) => {
    const content = rep.format === "JSON"
      ? JSON.stringify({
          reportId: rep.id,
          name: rep.name,
          type: rep.type,
          period: rep.period,
          generatedBy: rep.createdBy,
          totalRecords: rep.records,
          organization: "ABC Technologies (TeamFlow AI)",
          data: [
            { id: 1, item: "Sample Record A", status: "Active", timestamp: "2026-10-26T10:00:00Z" },
            { id: 2, item: "Sample Record B", status: "Active", timestamp: "2026-10-26T11:00:00Z" }
          ]
        }, null, 2)
      : `ID,ReportName,Type,Period,CreatedBy,Records,Status\n"${rep.id}","${rep.name}","${rep.type}","${rep.period}","${rep.createdBy}",${rep.records},"${rep.status}"\n1,Record Item Alpha,Primary,Active,2026-10-26\n2,Record Item Beta,Secondary,Active,2026-10-26\n`;

    const blob = new Blob([content], {
      type: rep.format === "JSON" ? "application/json" : "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${rep.id}-${rep.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.${rep.format.toLowerCase()}`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(rep.id);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const exportAllCSV = () => {
    const headers = ["Report ID", "Name", "Category", "Period", "Created By", "Date Created", "Status", "Format", "Records", "File Size"];
    const rows = filteredReports.map(r => [
      r.id,
      `"${r.name.replace(/"/g, '""')}"`,
      r.type,
      `"${r.period}"`,
      r.createdBy,
      r.createdAt,
      r.status,
      r.format,
      r.records,
      r.size
    ]);

    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `teamflow_reports_manifest_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-reports-app">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="admin-reports-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <div className="admin-reports-content">
          {/* Header */}
          <div className="admin-reports-header">
            <div>
              <h1>Reports & Platform Exports</h1>
              <p>Generate, schedule, review, and export comprehensive organization data and audit summaries.</p>
            </div>

            <div className="admin-reports-header-actions">
              <button className="admin-reports-btn-secondary" onClick={exportAllCSV}>
                <FileSpreadsheet size={15} />
                <span>Export Manifest</span>
              </button>
              <button className="admin-reports-btn-primary" onClick={() => handleOpenGenerator()}>
                <Plus size={16} />
                <span>Generate Report</span>
              </button>
            </div>
          </div>

          {/* Feedback banner */}
          {downloadSuccess && (
            <div className="admin-reports-alert-success">
              <CheckCircle2 size={18} />
              <span>Report <strong>{downloadSuccess}</strong> was downloaded successfully!</span>
            </div>
          )}

          {actionNotice && (
            <div className="admin-reports-alert-notice">
              <CheckCircle2 size={18} />
              <span>{actionNotice}</span>
            </div>
          )}

          {/* KPI Stat Cards */}
          <div className="admin-reports-stats-grid">
            <div className="admin-reports-stat-card">
              <div className="stat-icon purple">
                <FileText size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Generated Reports</span>
                <span className="stat-value">{reports.length} files</span>
                <span className="stat-subtext">Archived and ready to download</span>
              </div>
            </div>

            <div className="admin-reports-stat-card">
              <div className="stat-icon blue">
                <FileSpreadsheet size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Records Processed</span>
                <span className="stat-value">{totalRecords.toLocaleString()}</span>
                <span className="stat-subtext">Across users, tasks, and telemetry</span>
              </div>
            </div>

            <div className="admin-reports-stat-card">
              <div className="stat-icon emerald">
                <HardDrive size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Report Archive Size</span>
                <span className="stat-value">28.4 MB</span>
                <span className="stat-subtext">Compressed CSV & JSON bundles</span>
              </div>
            </div>

            <div className="admin-reports-stat-card">
              <div className="stat-icon amber">
                <Clock size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Automated Pipelines</span>
                <span className="stat-value">4 Active</span>
                <span className="stat-subtext">Daily & weekly cron dispatches</span>
              </div>
            </div>
          </div>

          {/* Quick Report Templates */}
          <div className="admin-reports-templates-section">
            <div className="section-title-row">
              <div>
                <h3>Quick Report Templates</h3>
                <p>One-click standard templates for recurring executive and operational audits</p>
              </div>
            </div>

            <div className="templates-grid">
              {reportTemplates.map((template, idx) => (
                <div key={idx} className="template-card">
                  <div className="template-top">
                    <div className="template-icon-box">
                      {template.type.includes("User") && <Users size={18} />}
                      {template.type.includes("Workspace") && <Building2 size={18} />}
                      {template.type.includes("Revenue") && <CircleDollarSign size={18} />}
                      {template.type.includes("Activity") && <Zap size={18} />}
                      {!template.type.includes("User") &&
                        !template.type.includes("Workspace") &&
                        !template.type.includes("Revenue") &&
                        !template.type.includes("Activity") && <FileText size={18} />}
                    </div>
                    <span className="template-format-badge">{template.format}</span>
                  </div>

                  <h4 className="template-title">{template.name}</h4>
                  <p className="template-desc">{template.description}</p>

                  <div className="template-footer">
                    <span className="template-type-tag">{template.type}</span>
                    <button
                      className="template-gen-btn"
                      onClick={() => handleOpenGenerator(template.type, template.name)}
                    >
                      <Plus size={13} />
                      <span>Run</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reports Table Card */}
          <div className="admin-reports-card">
            {/* Toolbar */}
            <div className="admin-reports-toolbar">
              <div className="search-box">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Search reports by name, ID or keyword..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {search && (
                  <button
                    className="clear-btn"
                    onClick={() => {
                      setSearch("");
                      setCurrentPage(1);
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="filters-group">
                <div className="filter-select">
                  <Filter size={14} />
                  <select
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">All Categories</option>
                    {reportTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-select">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="ready">Ready</option>
                    <option value="generating">Generating</option>
                  </select>
                </div>

                <div className="filter-select">
                  <select
                    value={formatFilter}
                    onChange={(e) => {
                      setFormatFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">All Formats</option>
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>

                <div className="filter-select">
                  <select
                    value={`${sortKey}-${sortOrder}`}
                    onChange={(e) => {
                      const [k, ord] = e.target.value.split("-");
                      setSortKey(k);
                      setSortOrder(ord);
                      setCurrentPage(1);
                    }}
                    aria-label="Sort reports"
                  >
                    <option value="createdAt-desc">Sort: Newest First</option>
                    <option value="createdAt-asc">Sort: Oldest First</option>
                    <option value="name-asc">Sort: Name (A to Z)</option>
                    <option value="name-desc">Sort: Name (Z to A)</option>
                    <option value="records-desc">Sort: Records (High to Low)</option>
                    <option value="records-asc">Sort: Records (Low to High)</option>
                  </select>
                </div>

                {(search || typeFilter !== "All" || statusFilter !== "All" || formatFilter !== "All") && (
                  <button
                    type="button"
                    className="clear-filters-btn"
                    onClick={() => {
                      setSearch("");
                      setTypeFilter("All");
                      setStatusFilter("All");
                      setFormatFilter("All");
                      setCurrentPage(1);
                    }}
                  >
                    <X size={13} />
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="admin-reports-table">
                <thead>
                  <tr>
                    <th style={{ width: 48, textAlign: "center" }}>#</th>
                    <th className="sortable-th" onClick={() => handleSort("name")}>
                      <div className="th-content">
                        <span>REPORT NAME</span>
                        {renderSortIcon("name")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("type")}>
                      <div className="th-content">
                        <span>CATEGORY</span>
                        {renderSortIcon("type")}
                      </div>
                    </th>
                    <th>TIME PERIOD</th>
                    <th className="sortable-th" onClick={() => handleSort("createdBy")}>
                      <div className="th-content">
                        <span>GENERATED BY</span>
                        {renderSortIcon("createdBy")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("records")}>
                      <div className="th-content">
                        <span>RECORDS & SIZE</span>
                        {renderSortIcon("records")}
                      </div>
                    </th>
                    <th>FORMAT</th>
                    <th className="sortable-th" onClick={() => handleSort("status")}>
                      <div className="th-content">
                        <span>STATUS</span>
                        {renderSortIcon("status")}
                      </div>
                    </th>
                    <th style={{ textAlign: "right", minWidth: 160 }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="empty-cell">
                        <FileText size={32} />
                        <p>No reports match your filters or search query.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedReports.map((report, idx) => (
                      <tr key={report.id}>
                        <td style={{ textAlign: "center" }}>
                          <span className="admin-row-num">{(safeCurrentPage - 1) * perPage + idx + 1}</span>
                        </td>
                        <td>
                          <div className="report-name-cell">
                            <span className="report-icon-chip">
                              <FileText size={14} />
                            </span>
                            <div>
                              <span className="report-title">{report.name}</span>
                              <span className="report-id-code">{report.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="report-cat-badge">{report.type}</span>
                        </td>
                        <td>
                          <span className="report-period-text">{report.period}</span>
                        </td>
                        <td>
                          <div className="creator-cell">
                            <span className="creator-avatar">
                              {report.createdBy.slice(0, 2).toUpperCase()}
                            </span>
                            <div>
                              <span className="creator-name">{report.createdBy}</span>
                              <span className="created-date">{report.createdAt}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="records-size-cell">
                            <strong>{report.records.toLocaleString()}</strong> rows
                            <span className="size-text">({report.size})</span>
                          </div>
                        </td>
                        <td>
                          <span className={`format-pill ${report.format.toLowerCase()}`}>
                            {report.format}
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill ${report.status.toLowerCase()}`}>
                            <CheckCircle2 size={12} />
                            {report.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div className="admin-reports-actions-cell actions-cell">
                            <button
                              type="button"
                              className="rep-action-pill rep-view-btn"
                              title="Preview Dataset"
                              aria-label="Preview Dataset"
                              onClick={() => setSelectedReport(report)}
                            >
                              <Eye size={13} />
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              className="rep-action-icon rep-download-btn"
                              title={`Download ${report.name} (${report.format})`}
                              aria-label={`Download ${report.name} (${report.format})`}
                              onClick={() => handleDownloadReport(report)}
                            >
                              <Download size={14} />
                            </button>
                            <button
                              type="button"
                              className="rep-action-icon rep-delete-btn"
                              title="Delete Report from Archive"
                              aria-label="Delete Report from Archive"
                              onClick={() => setReportToDelete(report)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION BAR (Activity Logs Style, zero-space flush layout) */}
            {filteredReports.length > 0 && (
              <div className="admin-logs-pagination-bar reports-pagination-bar">
                <div className="admin-logs-pagination-info">
                  <span>
                    Showing {filteredReports.length === 0 ? 0 : (safeCurrentPage - 1) * perPage + 1} to{" "}
                    {Math.min(safeCurrentPage * perPage, filteredReports.length)} of {filteredReports.length} reports
                  </span>
                  <div className="admin-logs-page-size-wrap">
                    <span>Records per page:</span>
                    <select
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      aria-label="Records per page"
                    >
                      <option value={6}>6</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                <div className="admin-logs-pagination-controls">
                  <button
                    type="button"
                    className="admin-logs-page-nav-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage <= 1}
                  >
                    Previous
                  </button>
                  <div className="admin-logs-page-pills">
                    {getPageNumbers().map((item, idx) =>
                      item === "..." ? (
                        <span key={`ellipsis-${idx}`} className="admin-logs-page-ellipsis">
                          ...
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          className={`admin-logs-page-num-pill ${safeCurrentPage === item ? "active" : ""}`}
                          onClick={() => setCurrentPage(item)}
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    type="button"
                    className="admin-logs-page-nav-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage >= totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      {selectedReport && (
        <div className="admin-reports-modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="admin-reports-modal preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <span className="modal-badge">{selectedReport.id}</span>
                <h3>{selectedReport.name}</h3>
              </div>
              <button className="close-btn" onClick={() => setSelectedReport(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Meta Grid */}
              <div className="preview-meta-grid">
                <div>
                  <label>Category</label>
                  <span>{selectedReport.type}</span>
                </div>
                <div>
                  <label>Period Range</label>
                  <span>{selectedReport.period}</span>
                </div>
                <div>
                  <label>Created By</label>
                  <span>{selectedReport.createdBy}</span>
                </div>
                <div>
                  <label>Total Rows</label>
                  <span>{selectedReport.records.toLocaleString()} records</span>
                </div>
                <div>
                  <label>File Size</label>
                  <span>{selectedReport.size}</span>
                </div>
                <div>
                  <label>Format</label>
                  <span>{selectedReport.format}</span>
                </div>
              </div>

              {/* Sample Data Table */}
              <div className="preview-table-box">
                <h4>Dataset Preview (First 4 rows)</h4>
                <table className="sample-table">
                  <thead>
                    <tr>
                      <th>Record ID</th>
                      <th>Primary Entity</th>
                      <th>Status / State</th>
                      <th>Timestamp</th>
                      <th>Metric Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#001</td>
                      <td>TeamFlow AI Core Workspace</td>
                      <td><span className="sample-status good">Active</span></td>
                      <td>2026-10-26 09:14:22</td>
                      <td>98.5% SLA</td>
                    </tr>
                    <tr>
                      <td>#002</td>
                      <td>Product Design Sprint Hub</td>
                      <td><span className="sample-status good">Active</span></td>
                      <td>2026-10-26 10:22:15</td>
                      <td>84.2% SLA</td>
                    </tr>
                    <tr>
                      <td>#003</td>
                      <td>Backend Microservices Cluster</td>
                      <td><span className="sample-status good">Active</span></td>
                      <td>2026-10-26 11:45:00</td>
                      <td>99.9% SLA</td>
                    </tr>
                    <tr>
                      <td>#004</td>
                      <td>Marketing Growth Analytics</td>
                      <td><span className="sample-status good">Active</span></td>
                      <td>2026-10-26 12:05:40</td>
                      <td>92.0% SLA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-danger-outline"
                style={{ marginRight: "auto" }}
                onClick={() => setReportToDelete(selectedReport)}
              >
                <Trash2 size={14} />
                <span>Delete Report</span>
              </button>
              <button
                type="button"
                className="admin-reports-btn-secondary"
                onClick={() => setSelectedReport(null)}
              >
                Close Preview
              </button>
              <button
                type="button"
                className="admin-reports-btn-primary"
                onClick={() => {
                  handleDownloadReport(selectedReport);
                }}
              >
                <Download size={15} />
                Download Complete File ({selectedReport.format})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generator Modal */}
      {showGenerator && (
        <div className="admin-reports-modal-overlay" onClick={() => setShowGenerator(false)}>
          <div className="admin-reports-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Generate Custom Report</h3>
              <button className="close-btn" onClick={() => setShowGenerator(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleGenerateReport}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Report Name</label>
                  <input
                    type="text"
                    required
                    value={reportForm.name}
                    onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                    placeholder="e.g. Q4 Executive Productivity Audit"
                  />
                </div>

                <div className="form-group">
                  <label>Report Category</label>
                  <select
                    value={reportForm.type}
                    onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
                  >
                    {reportTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      required
                      value={reportForm.startDate}
                      onChange={(e) => setReportForm({ ...reportForm, startDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      required
                      value={reportForm.endDate}
                      onChange={(e) => setReportForm({ ...reportForm, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Output Format</label>
                  <div className="format-toggle-group">
                    {["CSV", "JSON", "PDF"].map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        className={`fmt-btn ${reportForm.format === fmt ? "active" : ""}`}
                        onClick={() => setReportForm({ ...reportForm, format: fmt })}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={reportForm.includeTimestamps}
                      onChange={(e) => setReportForm({ ...reportForm, includeTimestamps: e.target.checked })}
                    />
                    <span>Include granular telemetry timestamps and actor IPs</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={reportForm.includeInactive}
                      onChange={(e) => setReportForm({ ...reportForm, includeInactive: e.target.checked })}
                    />
                    <span>Include archived and suspended workspaces/users</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="admin-reports-btn-secondary"
                  onClick={() => setShowGenerator(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-reports-btn-primary">
                  <Sparkles size={15} />
                  <span>Generate Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CSS DELETE CONFIRMATION MODAL */}
      {reportToDelete && (
        <div className="admin-reports-modal-overlay" onClick={() => setReportToDelete(null)}>
          <div
            className="admin-reports-modal delete-confirm-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-report-title"
          >
            <div className="modal-header delete-modal-header">
              <div className="delete-modal-icon-badge">
                <AlertTriangle size={20} />
              </div>
              <div className="delete-modal-header-text">
                <h3 id="delete-report-title">Delete Report from Archive</h3>
                <span className="delete-modal-subtitle">Report ID: {reportToDelete.id}</span>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setReportToDelete(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body delete-modal-body">
              <p className="delete-modal-lead">
                Are you sure you want to permanently delete this report from the archive? This dataset and cached telemetry records will no longer be available.
              </p>

              <div className="delete-report-preview-box">
                <div className="preview-top">
                  <span className="preview-id">{reportToDelete.id}</span>
                  <span className={`format-pill ${reportToDelete.format.toLowerCase()}`}>
                    {reportToDelete.format}
                  </span>
                  <span className="preview-size">{reportToDelete.records?.toLocaleString() || reportToDelete.records} rows ({reportToDelete.size})</span>
                </div>
                <h4 className="preview-desc">{reportToDelete.name}</h4>
                <div className="preview-meta">
                  <span>Category: {reportToDelete.type}</span>
                  <span>•</span>
                  <span>Period: {reportToDelete.period}</span>
                  <span>•</span>
                  <span>By: {reportToDelete.createdBy}</span>
                </div>
              </div>

              <div className="delete-modal-alert">
                <AlertCircle size={16} />
                <span>This action cannot be undone. Historical compliance data for this export cycle will be purged.</span>
              </div>
            </div>

            <div className="modal-footer delete-modal-footer">
              <button
                type="button"
                className="admin-reports-btn-secondary"
                onClick={() => setReportToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-reports-btn-danger"
                onClick={confirmDeleteReport}
              >
                <Trash2 size={15} />
                <span>Delete Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
