import React, { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  Cpu,
  DollarSign,
  TrendingUp,
  Download,
  Search,
  Filter,
  Sliders,
  CheckCircle2,
  AlertCircle,
  X,
  HardDrive,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminAIUsage.css";

const STORAGE_KEY = "teamflow_admin_ai_usage_settings";

const defaultLogs = [
  { id: 1, user: "Amit Sharma", feature: "Sprint Summarizer", model: "Claude 3.5 Sonnet", tokens: 2840, latency: "420ms", cost: "$0.008", time: "10 mins ago" },
  { id: 2, user: "Sarah Chen", feature: "Content Campaign Draft", model: "GPT-4o", tokens: 4120, latency: "650ms", cost: "$0.012", time: "25 mins ago" },
  { id: 3, user: "David Lee", feature: "Code Review Assistant", model: "Gemini 1.5 Pro", tokens: 1950, latency: "380ms", cost: "$0.005", time: "1 hour ago" },
  { id: 4, user: "Emily Parker", feature: "UX Microcopy Generator", model: "GPT-4o", tokens: 860, latency: "210ms", cost: "$0.002", time: "2 hours ago" },
  { id: 5, user: "Rahul Sharma", feature: "Bug Triage Assistant", model: "TeamFlow Core", tokens: 1420, latency: "190ms", cost: "$0.001", time: "3 hours ago" },
];

export default function AdminAIUsage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [budgetCap, setBudgetCap] = useState(250);
  const [capModal, setCapModal] = useState(false);
  const [tempCap, setTempCap] = useState(250);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const val = JSON.parse(saved);
        if (val.budgetCap) {
          setBudgetCap(val.budgetCap);
          setTempCap(val.budgetCap);
        }
      } catch (e) {}
    }
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const saveCap = (e) => {
    e.preventDefault();
    setBudgetCap(tempCap);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ budgetCap: tempCap }));
    setCapModal(false);
    showToast(`Monthly AI spend cap updated to $${tempCap}.`);
  };

  const filteredLogs = useMemo(() => {
    return defaultLogs.filter((l) => {
      const term = search.trim().toLowerCase();
      return !term || l.user.toLowerCase().includes(term) || l.feature.toLowerCase().includes(term) || l.model.toLowerCase().includes(term);
    });
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / perPage));
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredLogs.slice(start, start + perPage);
  }, [filteredLogs, currentPage, perPage]);

  return (
    <div className="admin-usage-app">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="admin-usage-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        {toast && (
          <div className="admin-usage-toast">
            <CheckCircle2 size={16} />
            <span>{toast}</span>
          </div>
        )}

        <main className="admin-usage-content">
          <section className="admin-usage-heading">
            <div>
              <h1>AI Usage & Cost Analytics</h1>
              <p>Monitor organizational token consumption, breakdown model spend, and configure budget limits.</p>
            </div>

            <button type="button" className="btn-secondary" onClick={() => setCapModal(true)}>
              <Sliders size={16} />
              <span>Configure Spend Cap</span>
            </button>
          </section>

          {/* STATS */}
          <section className="admin-usage-stats">
            <div className="usage-stat-card">
              <Cpu size={22} className="stat-icon purple" />
              <div><span>Total Tokens</span><strong>2,450,000</strong><small>+18% from last month</small></div>
            </div>
            <div className="usage-stat-card">
              <DollarSign size={22} className="stat-icon green" />
              <div><span>Current Spend</span><strong>$48.90</strong><small>Budget cap: ${budgetCap}.00</small></div>
            </div>
            <div className="usage-stat-card">
              <Sparkles size={22} className="stat-icon blue" />
              <div><span>Active LLM Models</span><strong>4 Engines</strong><small>Multi-model fallback enabled</small></div>
            </div>
            <div className="usage-stat-card">
              <TrendingUp size={22} className="stat-icon amber" />
              <div><span>Average Latency</span><strong>370 ms</strong><small>Global edge routing</small></div>
            </div>
          </section>

          {/* CHARTS ROW */}
          <div className="usage-charts-grid">
            {/* MODEL BREAKDOWN */}
            <div className="usage-chart-card">
              <h3>Model Token Breakdown</h3>
              <p>Distribution of tokens consumed by foundation models.</p>

              <div className="breakdown-list">
                <div className="breakdown-row">
                  <div className="breakdown-info"><span>GPT-4o</span><strong>1,120,000 tokens (46%)</strong></div>
                  <div className="bar-track"><div className="bar-fill purple" style={{ width: "46%" }} /></div>
                </div>
                <div className="breakdown-row">
                  <div className="breakdown-info"><span>Claude 3.5 Sonnet</span><strong>750,000 tokens (31%)</strong></div>
                  <div className="bar-track"><div className="bar-fill blue" style={{ width: "31%" }} /></div>
                </div>
                <div className="breakdown-row">
                  <div className="breakdown-info"><span>Gemini 1.5 Pro</span><strong>380,000 tokens (15%)</strong></div>
                  <div className="bar-track"><div className="bar-fill green" style={{ width: "15%" }} /></div>
                </div>
                <div className="breakdown-row">
                  <div className="breakdown-info"><span>TeamFlow Core</span><strong>200,000 tokens (8%)</strong></div>
                  <div className="bar-track"><div className="bar-fill amber" style={{ width: "8%" }} /></div>
                </div>
              </div>
            </div>

            {/* DEPARTMENT CONSUMPTION */}
            <div className="usage-chart-card">
              <h3>Department Consumption</h3>
              <p>Workgroup share of total AI compute.</p>

              <div className="breakdown-list">
                <div className="breakdown-row">
                  <div className="breakdown-info"><span>Engineering</span><strong>52% of total</strong></div>
                  <div className="bar-track"><div className="bar-fill purple" style={{ width: "52%" }} /></div>
                </div>
                <div className="breakdown-row">
                  <div className="breakdown-info"><span>Marketing & Content</span><strong>24% of total</strong></div>
                  <div className="bar-track"><div className="bar-fill green" style={{ width: "24%" }} /></div>
                </div>
                <div className="breakdown-row">
                  <div className="breakdown-info"><span>Product & Design</span><strong>18% of total</strong></div>
                  <div className="bar-track"><div className="bar-fill blue" style={{ width: "18%" }} /></div>
                </div>
                <div className="breakdown-row">
                  <div className="breakdown-info"><span>Leadership & Ops</span><strong>6% of total</strong></div>
                  <div className="bar-track"><div className="bar-fill amber" style={{ width: "6%" }} /></div>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT INVOCATIONS TABLE */}
          <div className="usage-table-card">
            <div className="table-card-header">
              <h3>Recent AI Invocations</h3>
              <div className="admin-usage-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Filter by user, feature or model..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <table className="admin-usage-table">
              <thead>
                <tr>
                  <th style={{ width: 44, textAlign: "center" }}>#</th>
                  <th>User</th>
                  <th>Feature / Trigger</th>
                  <th>Model</th>
                  <th>Tokens</th>
                  <th>Latency</th>
                  <th>Est. Cost</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((l, idx) => (
                  <tr key={l.id}>
                    <td style={{ textAlign: "center" }}>
                      <span className="admin-row-num">{(currentPage - 1) * perPage + idx + 1}</span>
                    </td>
                    <td><strong>{l.user}</strong></td>
                    <td><span className="feature-chip">{l.feature}</span></td>
                    <td>{l.model}</td>
                    <td>{l.tokens.toLocaleString()}</td>
                    <td>{l.latency}</td>
                    <td><strong>{l.cost}</strong></td>
                    <td>{l.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION BAR */}
            <div className="admin-usage-pagination-bar">
              <div className="admin-usage-per-page">
                <label>Rows per page:</label>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="per-page-select"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <div className="admin-usage-page-info">
                Showing {filteredLogs.length === 0 ? 0 : (currentPage - 1) * perPage + 1} -{" "}
                {Math.min(currentPage * perPage, filteredLogs.length)} of {filteredLogs.length} invocations
              </div>

              <div className="admin-usage-pagination-nav">
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <span className="current-page-tag">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  className="page-nav-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* CAP MODAL */}
      {capModal && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setCapModal(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <h2>Set Monthly Spend Cap</h2>
              <button type="button" className="modal-close" onClick={() => setCapModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={saveCap} className="modal-form">
              <div className="form-group">
                <label>Monthly Budget Cap (USD)</label>
                <input
                  type="number"
                  min="50"
                  max="5000"
                  step="25"
                  value={tempCap}
                  onChange={(e) => setTempCap(Number(e.target.value))}
                  required
                />
                <small style={{ color: "#64748b", marginTop: 4 }}>
                  Invocations will fall back to TeamFlow Core when limit is reached.
                </small>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setCapModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Save Cap</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

