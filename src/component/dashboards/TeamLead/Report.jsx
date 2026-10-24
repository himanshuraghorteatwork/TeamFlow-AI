import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bug,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Download,
  FolderKanban,
  RefreshCw,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import "./Report.css";

const PERIODS = ["7 days", "30 days", "90 days"];

const SERIES = [
  { key: "created", label: "Tasks created", color: "#7257e8" },
  { key: "completed", label: "Tasks completed", color: "#24a875" },
  { key: "bugs", label: "Bugs found", color: "#e5a340" },
];

const REPORT_DATA = {
  "7 days": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    created: [15, 21, 18, 28, 24, 31, 27],
    completed: [11, 14, 16, 20, 19, 25, 23],
    bugs: [4, 6, 3, 7, 5, 4, 2],
    tasks: 164,
    completedTasks: 128,
    prevCompleted: 113,
    prevRate: 74,
    capacity: 87,
    prevCapacity: 83,
    bugsResolved: 31,
    prevBugs: 28,
    goal: 160,
    goalLabel: "WEEKLY GOAL",
  },
  "30 days": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    created: [72, 88, 81, 104],
    completed: [61, 74, 76, 91],
    bugs: [18, 14, 21, 13],
    tasks: 684,
    completedTasks: 542,
    prevCompleted: 458,
    prevRate: 72,
    capacity: 84,
    prevCapacity: 81,
    bugsResolved: 196,
    prevBugs: 171,
    goal: 700,
    goalLabel: "MONTHLY GOAL",
  },
  "90 days": {
    labels: ["Aug", "Sep", "Oct"],
    created: [248, 301, 345],
    completed: [201, 254, 287],
    bugs: [63, 51, 42],
    tasks: 2680,
    completedTasks: 2144,
    prevCompleted: 1741,
    prevRate: 75,
    capacity: 88,
    prevCapacity: 84,
    bugsResolved: 614,
    prevBugs: 560,
    goal: 2400,
    goalLabel: "QUARTERLY GOAL",
  },
};

const PROJECTS = [
  { name: "Website Redesign", owner: "Alex Morgan", status: "On Track", progress: 82, tasks: 48, completed: 39, color: "#7357f5" },
  { name: "Mobile App", owner: "Sarah Chen", status: "On Track", progress: 67, tasks: 36, completed: 24, color: "#3288f5" },
  { name: "Backend API", owner: "Mike Johnson", status: "At Risk", progress: 54, tasks: 52, completed: 28, color: "#f0a330" },
  { name: "Dashboard", owner: "Emily Davis", status: "On Track", progress: 91, tasks: 22, completed: 20, color: "#18a873" },
];

const TEAM_PERFORMANCE = [
  { name: "Alex Morgan", role: "Frontend Developer", done: 32, rate: 96, color: "#7357f5" },
  { name: "Sarah Chen", role: "Product Designer", done: 28, rate: 92, color: "#e46e9d" },
  { name: "Mike Johnson", role: "Backend Developer", done: 25, rate: 88, color: "#3288f5" },
  { name: "Emily Davis", role: "DevOps Engineer", done: 22, rate: 85, color: "#f0a330" },
];

/* ================= HELPERS ================= */

const pctChange = (current, previous) =>
  previous ? ((current - previous) / previous) * 100 : 0;

function initials(name) {
  return name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("");
}

function toCsv(rows) {
  return rows
    .map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
    )
    .join("\r\n");
}

function useElementWidth(ref) {
  const [width, setWidth] = useState(640);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const update = () => setWidth(Math.max(280, element.clientWidth));
    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}

/* ================= LINE CHART ================= */

function LineChart({ data, visible }) {
  const wrapRef = useRef(null);
  const width = useElementWidth(wrapRef);
  const [hover, setHover] = useState(null);

  const height = width < 520 ? 200 : 275;
  const pad = { top: 16, right: 22, bottom: 32, left: 40 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const count = data.labels.length;

  const activeSeries = SERIES.filter((series) => visible[series.key]);
  const rawMax = Math.max(1, ...activeSeries.flatMap((series) => data[series.key]));
  const tickStep = Math.ceil(rawMax / 4);
  const maxValue = tickStep * 4;

  const xAt = (index) =>
    pad.left + (count === 1 ? innerW / 2 : (index * innerW) / (count - 1));
  const yAt = (value) => pad.top + innerH - (value / maxValue) * innerH;

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (width / rect.width);
    const raw = count === 1 ? 0 : ((x - pad.left) / innerW) * (count - 1);
    setHover(Math.min(count - 1, Math.max(0, Math.round(raw))));
  };

  const tooltipLeft =
    hover === null ? 0 : Math.min(width - 75, Math.max(75, xAt(hover)));

  return (
    <div className="tl-report-chart-wrap" ref={wrapRef}>
      <svg
        className="tl-report-line-chart"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Tasks created, tasks completed, and bugs found over the selected period"
      >
        {/* grid + y labels */}
        {[0, 1, 2, 3, 4].map((tick) => {
          const value = tick * tickStep;
          const y = yAt(value);
          return (
            <g key={tick}>
              <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} className="tl-report-gridline" />
              <text x={pad.left - 10} y={y + 4} textAnchor="end" className="tl-report-axis-label">
                {value}
              </text>
            </g>
          );
        })}

        {/* x labels */}
        {data.labels.map((label, index) => (
          <text key={label} x={xAt(index)} y={height - 8} textAnchor="middle" className="tl-report-axis-label">
            {label}
          </text>
        ))}

        {/* crosshair */}
        {hover !== null && (
          <line x1={xAt(hover)} x2={xAt(hover)} y1={pad.top} y2={pad.top + innerH} className="tl-report-crosshair" />
        )}

        {/* lines + dots */}
        {activeSeries.map((series) => (
          <g key={series.key}>
            <polyline
              className={`tl-report-line ${series.key}`}
              points={data[series.key].map((value, index) => `${xAt(index)},${yAt(value)}`).join(" ")}
            />
            {data[series.key].map((value, index) => (
              <circle
                key={index}
                cx={xAt(index)}
                cy={yAt(value)}
                r={hover === index ? 6 : 4}
                className={`tl-report-dot ${series.key}`}
              />
            ))}
          </g>
        ))}

        {/* hover capture area */}
        <rect
          x={pad.left}
          y={pad.top}
          width={innerW}
          height={innerH}
          fill="transparent"
          onPointerMove={handleMove}
          onPointerDown={handleMove}
          onPointerLeave={() => setHover(null)}
        />
      </svg>

      {hover !== null && (
        <div className="tl-report-tooltip" style={{ left: tooltipLeft }}>
          <strong>{data.labels[hover]}</strong>
          {activeSeries.map((series) => (
            <span key={series.key}>
              <i style={{ background: series.color }} />
              {series.label}
              <b>{data[series.key][hover]}</b>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Sparkline({ values, tone }) {
  const max = Math.max(...values, 1);
  return (
    <div className={`tl-report-sparkline ${tone}`} aria-hidden="true">
      {values.map((value, index) => (
        <i key={index} style={{ "--bar-height": `${Math.max(14, (value / max) * 100)}%` }} />
      ))}
    </div>
  );
}

function Metric({ icon: Icon, tone, label, value, delta, unit, note, series }) {
  const positive = delta >= 0;
  const Arrow = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <article className="tl-report-metric">
      <span className={`tl-report-metric-icon ${tone}`}><Icon size={19} /></span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small className={positive ? "positive" : "negative"}>
          <Arrow size={13} /> {positive ? "+" : ""}{delta.toFixed(1)}{unit} {note}
        </small>
      </div>
      <Sparkline values={series} tone={tone} />
    </article>
  );
}

/* ================= PAGE ================= */

export default function Report() {
  const [period, setPeriod] = useState("7 days");
  const [projectFilter, setProjectFilter] = useState("All projects");
  const [activeView, setActiveView] = useState("Overview");
  const [visible, setVisible] = useState({ created: true, completed: true, bugs: true });
  const [notice, setNotice] = useState("");
  const [updatedAt, setUpdatedAt] = useState(() => new Date());

  const report = REPORT_DATA[period];
  const completionRate = Math.round((report.completedTasks / report.tasks) * 100);
  const rateDelta = completionRate - report.prevRate;
  const velocity = pctChange(report.completedTasks, report.prevCompleted);
  const goalPercent = Math.min(100, Math.round((report.completedTasks / report.goal) * 100));

  const projects = useMemo(
    () =>
      projectFilter === "All projects"
        ? PROJECTS
        : PROJECTS.filter((project) => project.name === projectFilter),
    [projectFilter]
  );

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  function toggleSeries(key) {
    setVisible((current) => {
      const next = { ...current, [key]: !current[key] };
      // keep at least one line on screen
      return Object.values(next).some(Boolean) ? next : current;
    });
  }

  function refreshReport() {
    setUpdatedAt(new Date());
    setNotice("Report refreshed.");
  }

  function downloadReport() {
    const rows = [
      ["TeamFlow AI team report", period],
      [],
      ["Summary"],
      ["Tasks completed", report.completedTasks],
      ["Total tasks", report.tasks],
      ["Completion rate", `${completionRate}%`],
      ["Team capacity", `${report.capacity}%`],
      ["Bugs resolved", report.bugsResolved],
      [],
      ["Trend"],
      ["Period", "Tasks created", "Tasks completed", "Bugs found"],
      ...report.labels.map((label, index) => [
        label,
        report.created[index],
        report.completed[index],
        report.bugs[index],
      ]),
      [],
      ["Projects"],
      ["Project", "Owner", "Status", "Progress", "Completed tasks", "Total tasks"],
      ...projects.map((project) => [
        project.name,
        project.owner,
        project.status,
        `${project.progress}%`,
        project.completed,
        project.tasks,
      ]),
      [],
      ["Team"],
      ["Member", "Role", "Tasks completed", "On-time rate"],
      ...TEAM_PERFORMANCE.map((member) => [
        member.name,
        member.role,
        member.done,
        `${member.rate}%`,
      ]),
    ];

    const blob = new Blob(["\uFEFF" + toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `teamflow-report-${period.replace(" ", "-")}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("CSV report downloaded.");
  }

  return (
    <section className="tl-report-page">
      <header className="tl-report-header">
        <div>
          <span className="tl-report-eyebrow">TEAM WORKSPACE / ANALYTICS</span>
          <h1>Team Reports</h1>
          <p>Understand team momentum, project health, and delivery at a glance.</p>
        </div>
        <div className="tl-report-header-actions">
          <label className="tl-report-period">
            <CalendarDays size={16} aria-hidden="true" />
            <span className="tl-report-sr-only">Report date range</span>
            <select value={period} onChange={(event) => setPeriod(event.target.value)}>
              {PERIODS.map((value) => <option key={value}>{value}</option>)}
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </label>
          <button type="button" className="tl-report-export" onClick={downloadReport}>
            <Download size={16} /> Export report
          </button>
        </div>
      </header>

      {notice && (
        <div className="tl-report-notice" role="status">
          <CheckCircle2 size={16} />{notice}
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification">×</button>
        </div>
      )}

      <nav className="tl-report-tabs" aria-label="Report sections">
        {["Overview", "Projects", "Team"].map((view) => (
          <button
            type="button"
            key={view}
            className={activeView === view ? "active" : ""}
            onClick={() => setActiveView(view)}
          >
            {view === "Overview" ? <BarChart3 size={15} /> : view === "Projects" ? <FolderKanban size={15} /> : <Users size={15} />}
            {view}
          </button>
        ))}
        <button type="button" className="tl-report-updated" onClick={refreshReport} title="Refresh report">
          <RefreshCw size={12} />
          Updated {updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </button>
      </nav>

      {activeView === "Overview" && (
        <>
          <section className="tl-report-metrics">
            <Metric
              icon={ClipboardList}
              tone="purple"
              label="Tasks completed"
              value={report.completedTasks}
              delta={velocity}
              unit="%"
              note="vs previous period"
              series={report.completed}
            />
            <Metric
              icon={Target}
              tone="green"
              label="Completion rate"
              value={`${completionRate}%`}
              delta={rateDelta}
              unit=" pts"
              note="vs previous period"
              series={report.completed.map((done, i) => (done / report.created[i]) * 100)}
            />
            <Metric
              icon={Users}
              tone="blue"
              label="Team capacity"
              value={`${report.capacity}%`}
              delta={report.capacity - report.prevCapacity}
              unit=" pts"
              note="vs previous period"
              series={report.created}
            />
            <Metric
              icon={Bug}
              tone="orange"
              label="Bugs resolved"
              value={report.bugsResolved}
              delta={pctChange(report.bugsResolved, report.prevBugs)}
              unit="%"
              note="vs previous period"
              series={report.bugs}
            />
          </section>

          <section className="tl-report-main-grid">
            <article className="tl-report-card tl-report-trend-card">
              <header className="tl-report-card-header">
                <div>
                  <h2>Delivery trends</h2>
                  <p>Task flow and bug volume over {period.toLowerCase()}</p>
                </div>
                <span className="tl-report-chart-badge"><span />Live team data</span>
              </header>

              <div className="tl-report-chart-legend">
                {SERIES.map((series) => (
                  <button
                    type="button"
                    key={series.key}
                    className={`tl-report-legend-btn ${visible[series.key] ? "" : "off"}`}
                    aria-pressed={visible[series.key]}
                    onClick={() => toggleSeries(series.key)}
                  >
                    <i style={{ background: series.color }} />
                    {series.label}
                  </button>
                ))}
              </div>

              <LineChart data={report} visible={visible} />
            </article>

            <article className="tl-report-card tl-report-completion-card">
              <header className="tl-report-card-header">
                <div><h2>Task completion</h2><p>Overall delivery rate</p></div>
                <button
                  type="button"
                  className="tl-report-icon-button"
                  aria-label="View project details"
                  onClick={() => setActiveView("Projects")}
                >
                  <ArrowRight size={16} />
                </button>
              </header>
              <div className="tl-report-donut-wrap">
                <div className="tl-report-donut" style={{ "--completion": `${completionRate}%` }}>
                  <div><strong>{completionRate}%</strong><span>complete</span></div>
                </div>
              </div>
              <div className="tl-report-completion-legend">
                <span><i className="done" />Completed<b>{report.completedTasks}</b></span>
                <span><i className="remaining" />Remaining<b>{report.tasks - report.completedTasks}</b></span>
              </div>
              <div className="tl-report-insight">
                <Sparkles size={15} />
                <span>
                  Your team is completing tasks {velocity >= 0 ? "faster" : "slower"} than the previous period.
                </span>
              </div>
            </article>
          </section>
        </>
      )}

      {activeView === "Projects" && (
        <section className="tl-report-card tl-report-projects-view">
          <header className="tl-report-card-header">
            <div><h2>Project performance</h2><p>Compare delivery progress across your active work.</p></div>
            <label className="tl-report-project-filter">
              <span className="tl-report-sr-only">Filter projects</span>
              <select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)}>
                <option>All projects</option>
                {PROJECTS.map((project) => <option key={project.name}>{project.name}</option>)}
              </select>
              <ChevronDown size={14} />
            </label>
          </header>
          <div className="tl-report-project-list">
            {projects.map((project) => (
              <article className="tl-report-project-row" key={project.name}>
                <div className="tl-report-project-icon" style={{ "--project-color": project.color }}><FolderKanban size={18} /></div>
                <div className="tl-report-project-info">
                  <div>
                    <strong>{project.name}</strong>
                    <span className={`tl-report-health ${project.status === "At Risk" ? "risk" : ""}`}>{project.status}</span>
                  </div>
                  <small>Lead: {project.owner}</small>
                </div>
                <div className="tl-report-project-progress">
                  <div><span>Progress</span><b>{project.progress}%</b></div>
                  <i><u style={{ width: `${project.progress}%`, background: project.color }} /></i>
                </div>
                <div className="tl-report-project-tasks">
                  <strong>{project.completed}/{project.tasks}</strong>
                  <small>tasks done</small>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeView === "Team" && (
        <section className="tl-report-card tl-report-team-view">
          <header className="tl-report-card-header">
            <div><h2>Team performance</h2><p>Recognize contribution and delivery consistency.</p></div>
            <span className="tl-report-team-period">{period}</span>
          </header>
          <div className="tl-report-team-list">
            {TEAM_PERFORMANCE.map((member, index) => (
              <article className="tl-report-team-row" key={member.name}>
                <span className="tl-report-rank">{String(index + 1).padStart(2, "0")}</span>
                <span className="tl-report-team-avatar" style={{ "--member-color": member.color }}>{initials(member.name)}</span>
                <div className="tl-report-team-info"><strong>{member.name}</strong><small>{member.role}</small></div>
                <div className="tl-report-team-completed"><strong>{member.done}</strong><small>tasks completed</small></div>
                <div className="tl-report-team-rate">
                  <div><span>On-time rate</span><b>{member.rate}%</b></div>
                  <i><u style={{ width: `${member.rate}%`, background: member.color }} /></i>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="tl-report-lower-grid">
        <article className="tl-report-highlight">
          <span className="tl-report-highlight-icon"><Sparkles size={19} /></span>
          <div>
            <span>TEAM INSIGHT</span>
            <h2>{velocity >= 0 ? "Strong delivery momentum" : "Delivery has slowed"}</h2>
            <p>
              {velocity >= 0
                ? "Task completion has improved this period."
                : "Task completion dropped this period."}{" "}
              Keep an eye on Backend API, which may need extra support to stay on track.
            </p>
          </div>
          <button type="button" onClick={() => setActiveView("Projects")}>
            View projects <ArrowRight size={14} />
          </button>
        </article>

        <article className="tl-report-goal-card">
          <div className="tl-report-goal-head"><span>{report.goalLabel}</span><Target size={17} /></div>
          <div className="tl-report-goal-value">
            <strong>{report.completedTasks}</strong>
            <span>of {report.goal} tasks</span>
          </div>
          <div className="tl-report-goal-track"><i style={{ width: `${goalPercent}%` }} /></div>
          <small>{goalPercent}% of the team's delivery goal reached</small>
        </article>
      </section>
    </section>
  );
}