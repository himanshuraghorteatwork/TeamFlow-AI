import { useMemo, useState } from "react";
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

const REPORT_DATA = {
  "7 days": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    created: [15, 21, 18, 28, 24, 31, 27],
    completed: [11, 14, 16, 20, 19, 25, 23],
    bugs: [4, 6, 3, 7, 5, 4, 2],
    tasks: 164,
    completedTasks: 128,
    bugsResolved: 31,
    velocity: "+12.8%",
  },
  "30 days": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    created: [72, 88, 81, 104],
    completed: [61, 74, 76, 91],
    bugs: [18, 14, 21, 13],
    tasks: 684,
    completedTasks: 542,
    bugsResolved: 196,
    velocity: "+18.4%",
  },
  "90 days": {
    labels: ["Aug", "Sep", "Oct"],
    created: [248, 301, 345],
    completed: [201, 254, 287],
    bugs: [63, 51, 42],
    tasks: 2680,
    completedTasks: 2144,
    bugsResolved: 614,
    velocity: "+23.1%",
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

function makePoints(values, width = 640, height = 220) {
  const maxValue = Math.max(...values, 1);
  const step = width / Math.max(values.length - 1, 1);
  return values.map((value, index) => ({
    x: index * step,
    y: height - (value / maxValue) * (height - 30) - 10,
  }));
}

function LineChart({ data }) {
  const created = makePoints(data.created);
  const completed = makePoints(data.completed);
  const bugs = makePoints(data.bugs);
  const pointString = points => points.map(point => `${point.x},${point.y}`).join(" ");

  return (
    <svg className="tl-report-line-chart" viewBox="0 0 640 250" role="img" aria-label="Tasks created, tasks completed, and bugs found over the selected period">
      {[0, 1, 2, 3, 4].map(line => {
        const y = 20 + line * 50;
        return <line key={line} x1="0" x2="640" y1={y} y2={y} className="tl-report-gridline" />;
      })}
      <polyline points={pointString(created)} className="tl-report-line created" />
      <polyline points={pointString(completed)} className="tl-report-line completed" />
      <polyline points={pointString(bugs)} className="tl-report-line bugs" />
      {created.map((point, index) => <circle key={`created-${index}`} cx={point.x} cy={point.y} r="4" className="tl-report-dot created" />)}
      {completed.map((point, index) => <circle key={`completed-${index}`} cx={point.x} cy={point.y} r="4" className="tl-report-dot completed" />)}
      {data.labels.map((label, index) => {
        const x = data.labels.length === 1 ? 320 : index * (640 / (data.labels.length - 1));
        return <text key={label} x={x} y="244" textAnchor="middle" className="tl-report-axis-label">{label}</text>;
      })}
    </svg>
  );
}

function initials(name) {
  return name.split(/\s+/).map(part => part[0]).slice(0, 2).join("");
}

export default function Report() {
  const [period, setPeriod] = useState("7 days");
  const [projectFilter, setProjectFilter] = useState("All projects");
  const [activeView, setActiveView] = useState("Overview");
  const [notice, setNotice] = useState("");
  const report = REPORT_DATA[period];
  const completionRate = Math.round((report.completedTasks / report.tasks) * 100);

  const projects = useMemo(
    () => projectFilter === "All projects"
      ? PROJECTS
      : PROJECTS.filter(project => project.name === projectFilter),
    [projectFilter],
  );

  function downloadReport() {
    const rows = [
      ["Project", "Owner", "Status", "Progress", "Completed tasks", "Total tasks"],
      ...projects.map(project => [
        project.name,
        project.owner,
        project.status,
        `${project.progress}%`,
        project.completed,
        project.tasks,
      ]),
    ];
    const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `teamflow-report-${period.replace(" ", "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
            <select value={period} onChange={event => setPeriod(event.target.value)}>
              {PERIODS.map(value => <option key={value}>{value}</option>)}
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </label>
          <button type="button" className="tl-report-export" onClick={downloadReport}>
            <Download size={16} /> Export report
          </button>
        </div>
      </header>

      {notice && <div className="tl-report-notice" role="status">
        <CheckCircle2 size={16} />{notice}
        <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification">×</button>
      </div>}

      <nav className="tl-report-tabs" aria-label="Report sections">
        {["Overview", "Projects", "Team"].map(view => (
          <button type="button" key={view} className={activeView === view ? "active" : ""} onClick={() => setActiveView(view)}>
            {view === "Overview" ? <BarChart3 size={15} /> : view === "Projects" ? <FolderKanban size={15} /> : <Users size={15} />}
            {view}
          </button>
        ))}
        <span className="tl-report-updated"><RefreshCw size={12} />Updated just now</span>
      </nav>

      {activeView === "Overview" && (
        <>
          <section className="tl-report-metrics">
            <article className="tl-report-metric">
              <span className="tl-report-metric-icon purple"><ClipboardList size={19} /></span>
              <div><span>Tasks completed</span><strong>{report.completedTasks}</strong><small className="positive"><ArrowUpRight size={13} /> {report.velocity} vs previous period</small></div>
              <div className="tl-report-sparkline purple"><i /><i /><i /><i /><i /><i /><i /></div>
            </article>
            <article className="tl-report-metric">
              <span className="tl-report-metric-icon green"><Target size={19} /></span>
              <div><span>Completion rate</span><strong>{completionRate}%</strong><small className="positive"><ArrowUpRight size={13} /> 6.2% vs previous period</small></div>
              <div className="tl-report-sparkline green"><i /><i /><i /><i /><i /><i /><i /></div>
            </article>
            <article className="tl-report-metric">
              <span className="tl-report-metric-icon blue"><Users size={19} /></span>
              <div><span>Team capacity</span><strong>87%</strong><small className="positive"><ArrowUpRight size={13} /> 4.5% vs previous period</small></div>
              <div className="tl-report-sparkline blue"><i /><i /><i /><i /><i /><i /><i /></div>
            </article>
            <article className="tl-report-metric">
              <span className="tl-report-metric-icon orange"><Bug size={19} /></span>
              <div><span>Bugs resolved</span><strong>{report.bugsResolved}</strong><small className="negative"><ArrowDownRight size={13} /> 8.1% open bug backlog</small></div>
              <div className="tl-report-sparkline orange"><i /><i /><i /><i /><i /><i /><i /></div>
            </article>
          </section>

          <section className="tl-report-main-grid">
            <article className="tl-report-card tl-report-trend-card">
              <header className="tl-report-card-header">
                <div><h2>Delivery trends</h2><p>Task flow and bug volume over {period.toLowerCase()}</p></div>
                <span className="tl-report-chart-badge"><span />Live team data</span>
              </header>
              <div className="tl-report-chart-legend">
                <span><i className="created" />Tasks created</span>
                <span><i className="completed" />Tasks completed</span>
                <span><i className="bugs" />Bugs found</span>
              </div>
              <LineChart data={report} />
            </article>

            <article className="tl-report-card tl-report-completion-card">
              <header className="tl-report-card-header">
                <div><h2>Task completion</h2><p>Overall delivery rate</p></div>
                <button type="button" className="tl-report-icon-button" aria-label="Completion report details"><ArrowRight size={16} /></button>
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
              <div className="tl-report-insight"><Sparkles size={15} /><span>Your team is completing tasks faster than the previous period.</span></div>
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
              <select value={projectFilter} onChange={event => setProjectFilter(event.target.value)}>
                <option>All projects</option>{PROJECTS.map(project => <option key={project.name}>{project.name}</option>)}
              </select><ChevronDown size={14} />
            </label>
          </header>
          <div className="tl-report-project-list">
            {projects.map(project => (
              <article className="tl-report-project-row" key={project.name}>
                <div className="tl-report-project-icon" style={{ "--project-color": project.color }}><FolderKanban size={18} /></div>
                <div className="tl-report-project-info"><div><strong>{project.name}</strong><span className={`tl-report-health ${project.status === "At Risk" ? "risk" : ""}`}>{project.status}</span></div><small>Lead: {project.owner}</small></div>
                <div className="tl-report-project-progress"><div><span>Progress</span><b>{project.progress}%</b></div><i><u style={{ width: `${project.progress}%`, background: project.color }} /></i></div>
                <div className="tl-report-project-tasks"><strong>{project.completed}/{project.tasks}</strong><small>tasks done</small></div>
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
                <div className="tl-report-team-rate"><div><span>On-time rate</span><b>{member.rate}%</b></div><i><u style={{ width: `${member.rate}%`, background: member.color }} /></i></div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="tl-report-lower-grid">
        <article className="tl-report-highlight">
          <span className="tl-report-highlight-icon"><Sparkles size={19} /></span>
          <div><span>TEAM INSIGHT</span><h2>Strong delivery momentum</h2><p>Task completion has improved this period. Keep an eye on Backend API, which may need extra support to stay on track.</p></div>
          <button type="button" onClick={() => setActiveView("Projects")}>View projects <ArrowRight size={14} /></button>
        </article>
        <article className="tl-report-goal-card">
          <div className="tl-report-goal-head"><span>MONTHLY GOAL</span><Target size={17} /></div>
          <div className="tl-report-goal-value"><strong>542</strong><span>of 700 tasks</span></div>
          <div className="tl-report-goal-track"><i style={{ width: "77%" }} /></div>
          <small>77% of the team's delivery goal reached</small>
        </article>
      </section>
    </section>
  );
}