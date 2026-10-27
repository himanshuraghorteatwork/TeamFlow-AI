
import { useMemo, useState } from "react";
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  TrendingUp,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Target,
  Users,
  ArrowUpRight,
  Lightbulb,
  Zap,
  CalendarDays,
  ChevronDown,
  CircleCheck,
  CircleAlert,
  Bot,
  FileText,
  MessageSquare,
  Activity,
} from "lucide-react";

import "./AISummary.css";

const summaryData = {
  Today: {
    completion: 78,
    completed: 18,
    inProgress: 7,
    overdue: 3,
    productivity: 84,
    previousProductivity: 79,
    summary:
      "Your team made steady progress today, completing 18 tasks and advancing several ongoing activities. Frontend development remains on track, while API integration needs additional attention. Three overdue tasks require follow-up to avoid delays in the upcoming sprint.",
  },

  "This Week": {
    completion: 82,
    completed: 46,
    inProgress: 12,
    overdue: 4,
    productivity: 88,
    previousProductivity: 81,
    summary:
      "Your team demonstrated strong progress this week, completing 46 tasks across active projects. Collaboration improved, and the frontend team maintained a consistent delivery pace. API integration and testing remain the main areas requiring attention. Review the four overdue tasks and redistribute work where necessary.",
  },

  "This Month": {
    completion: 86,
    completed: 164,
    inProgress: 21,
    overdue: 6,
    productivity: 91,
    previousProductivity: 85,
    summary:
      "Your team has completed 164 tasks this month, showing consistent progress across active projects. Overall productivity has improved compared with the previous period. The remaining priorities are resolving overdue work, strengthening testing coverage, and ensuring that upcoming project milestones remain achievable.",
  },
};

const insights = [
  {
    icon: TrendingUp,
    type: "success",
    title: "Strong delivery progress",
    description:
      "The frontend team is maintaining a steady pace and has completed most of its assigned UI tasks.",
    tag: "Positive trend",
  },
  {
    icon: AlertTriangle,
    type: "warning",
    title: "Overdue tasks need attention",
    description:
      "Some pending tasks may affect upcoming milestones. Review their blockers and update deadlines where necessary.",
    tag: "Needs attention",
  },
  {
    icon: Users,
    type: "info",
    title: "Review workload distribution",
    description:
      "Check the allocation of API integration and testing tasks to ensure responsibilities are balanced across the team.",
    tag: "Team workload",
  },
];

const projects = [
  {
    name: "TeamFlow Dashboard",
    category: "Frontend Development",
    progress: 85,
    completed: 17,
    total: 20,
    color: "purple",
    status: "On Track",
  },
  {
    name: "API Integration",
    category: "Backend Development",
    progress: 62,
    completed: 10,
    total: 16,
    color: "blue",
    status: "In Progress",
  },
  {
    name: "Testing & Quality",
    category: "QA and Testing",
    progress: 48,
    completed: 8,
    total: 17,
    color: "orange",
    status: "Needs Attention",
  },
];

const teamMembers = [
  {
    name: "Priya Sharma",
    role: "Frontend Developer",
    initials: "PS",
    completed: 12,
    assigned: 15,
    color: "purple",
  },
  {
    name: "Aarav Kulkarni",
    role: "Backend Developer",
    initials: "AK",
    completed: 9,
    assigned: 12,
    color: "blue",
  },
  {
    name: "Riya Kapoor",
    role: "UI/UX Designer",
    initials: "RK",
    completed: 11,
    assigned: 13,
    color: "pink",
  },
  {
    name: "Sahil Patil",
    role: "QA Engineer",
    initials: "SP",
    completed: 7,
    assigned: 11,
    color: "green",
  },
];

const priorities = [
  {
    title: "Complete API authentication",
    project: "API Integration",
    priority: "High",
    due: "Overdue",
  },
  {
    title: "Resolve dashboard UI issues",
    project: "TeamFlow Dashboard",
    priority: "Medium",
    due: "Today",
  },
  {
    title: "Finish regression testing",
    project: "Testing & Quality",
    priority: "High",
    due: "Tomorrow",
  },
];

function MetricCard({
  icon: Icon,
  label,
  value,
  note,
  color,
  trend,
}) {
  return (
    <article className="ai-metric-card">
      <div className={`ai-metric-icon ${color}`}>
        <Icon size={21} />
      </div>

      <div className="ai-metric-label">{label}</div>

      <div className="ai-metric-value">{value}</div>

      <div className="ai-metric-note">
        {trend && (
          <span className="ai-metric-trend">
            <TrendingUp size={13} />
            {trend}
          </span>
        )}

        {note}
      </div>
    </article>
  );
}

export default function AISummary() {
  const [period, setPeriod] = useState("This Week");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAllInsights, setShowAllInsights] = useState(false);
  const [showAllPriorities, setShowAllPriorities] = useState(false);
  const [completedPriorities, setCompletedPriorities] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const data = summaryData[period];

  const visibleInsights = showAllInsights
    ? insights
    : insights.slice(0, 2);

  const visiblePriorities = showAllPriorities
    ? priorities
    : priorities.slice(0, 2);

  const summaryText = useMemo(() => {
    return [
      `TeamFlow AI — ${period} Summary`,
      "",
      data.summary,
      "",
      `Tasks completed: ${data.completed}`,
      `Tasks in progress: ${data.inProgress}`,
      `Overdue tasks: ${data.overdue}`,
      `Team productivity: ${data.productivity}%`,
      `Project completion: ${data.completion}%`,
    ].join("\n");
  }, [period, data]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.alert(
        "Clipboard access is unavailable. Please copy the summary manually."
      );
    }
  }

  function generateSummary() {
    setIsGenerating(true);

    window.setTimeout(() => {
      setLastUpdated(new Date());
      setIsGenerating(false);
    }, 1000);
  }

  function togglePriority(title) {
    setCompletedPriorities((previous) =>
      previous.includes(title)
        ? previous.filter((item) => item !== title)
        : [...previous, title]
    );
  }

  return (
    <div className="ai-summary-page">
      {/* Page Header */}
      <header className="ai-summary-header">
        <div>
          <div className="ai-summary-breadcrumb">
            Workspace <span>/</span> AI Summary
          </div>

          <h1>AI Summary</h1>

          <p>
            Get intelligent insights into team performance, project progress,
            and upcoming priorities.
          </p>
        </div>

        <div className="ai-summary-header-actions">
          <div className="ai-period-select">
            <CalendarDays size={16} />

            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              aria-label="Select summary period"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>

            <ChevronDown size={15} />
          </div>

          <button
            className="ai-generate-btn"
            onClick={generateSummary}
            disabled={isGenerating}
          >
            <RefreshCw
              size={16}
              className={isGenerating ? "ai-spinning" : ""}
            />

            {isGenerating ? "Generating..." : "Generate Summary"}
          </button>
        </div>
      </header>

      {/* AI Welcome Banner */}
      <section className="ai-summary-banner">
        <div className="ai-banner-decoration ai-decoration-one" />
        <div className="ai-banner-decoration ai-decoration-two" />

        <div className="ai-banner-content">
          <div className="ai-banner-label">
            <Sparkles size={14} />
            AI-POWERED TEAM INSIGHTS
          </div>

          <h2>Your team's progress at a glance.</h2>

          <p>
            Your {period.toLowerCase()} overview is ready. Explore achievements,
            identify potential blockers, and decide what needs attention next.
          </p>

          <div className="ai-banner-footer">
            <span>
              <span className="ai-live-dot" />
              Summary overview
            </span>

            <span>
              <Clock3 size={13} />
              Updated {lastUpdated.toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="ai-banner-art">
          <div className="ai-orbit ai-orbit-one" />
          <div className="ai-orbit ai-orbit-two" />

          <div className="ai-banner-bot">
            <Bot size={43} strokeWidth={1.5} />
          </div>

          <Sparkles className="ai-floating-star star-one" size={23} />
          <Sparkles className="ai-floating-star star-two" size={16} />
          <Zap className="ai-floating-star star-three" size={19} />
        </div>
      </section>

      {/* Metric Cards */}
      <section className="ai-metrics-grid">
        <MetricCard
          icon={CheckCircle2}
          label="Tasks Completed"
          value={data.completed}
          note="Tasks finished"
          color="purple"
        />

        <MetricCard
          icon={Clock3}
          label="In Progress"
          value={data.inProgress}
          note="Currently active"
          color="blue"
        />

        <MetricCard
          icon={AlertTriangle}
          label="Overdue Tasks"
          value={data.overdue}
          note="Require follow-up"
          color="orange"
        />

        <MetricCard
          icon={Activity}
          label="Team Productivity"
          value={`${data.productivity}%`}
          note="Compared with previous period"
          trend={`+${data.productivity - data.previousProductivity}%`}
          color="green"
        />
      </section>

      {/* Main Content */}
      <div className="ai-summary-main-grid">
        <div className="ai-summary-left-column">
          {/* Executive Summary */}
          <section className="ai-panel ai-executive-panel">
            <div className="ai-panel-header">
              <div className="ai-panel-heading">
                <div className="ai-panel-icon purple">
                  <FileText size={18} />
                </div>

                <div>
                  <h2>Executive Summary</h2>
                  <p>Your team's progress in a nutshell</p>
                </div>
              </div>

              <button
                className="ai-icon-button"
                onClick={handleCopy}
                title="Copy summary"
                aria-label="Copy executive summary"
              >
                {copied ? <Check size={17} /> : <Copy size={17} />}
              </button>
            </div>

            <div className="ai-executive-body">
              <div className="ai-summary-text">
                <Sparkles size={18} />
                <p>{data.summary}</p>
              </div>

              <div className="ai-completion-section">
                <div className="ai-completion-header">
                  <span>Overall Project Completion</span>
                  <strong>{data.completion}%</strong>
                </div>

                <div className="ai-progress-track">
                  <div
                    className="ai-progress-fill purple"
                    style={{ width: `${data.completion}%` }}
                  />
                </div>

                <div className="ai-completion-footer">
                  <span>Team progress</span>
                  <span>
                    <TrendingUp size={13} />
                    {data.completion >= 80
                      ? "Good progress"
                      : "Progress to monitor"}
                  </span>
                </div>
              </div>
            </div>

            <div className="ai-panel-footer">
              <span>
                <Bot size={14} />
                AI-generated overview
              </span>

              <button onClick={handleCopy}>
                {copied ? "Copied!" : "Copy Summary"}
                {copied ? (
                  <Check size={14} />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </section>

          {/* Insights */}
          <section className="ai-panel">
            <div className="ai-panel-header">
              <div className="ai-panel-heading">
                <div className="ai-panel-icon yellow">
                  <Lightbulb size={18} />
                </div>

                <div>
                  <h2>AI Insights & Recommendations</h2>
                  <p>Highlights to help you make better decisions</p>
                </div>
              </div>

              <span className="ai-count-badge">
                {insights.length} insights
              </span>
            </div>

            <div className="ai-insights-list">
              {visibleInsights.map((insight, index) => {
                const Icon = insight.icon;

                return (
                  <article
                    className="ai-insight-item"
                    key={insight.title}
                  >
                    <div className={`ai-insight-icon ${insight.type}`}>
                      <Icon size={19} />
                    </div>

                    <div className="ai-insight-content">
                      <div className="ai-insight-title-row">
                        <h3>{insight.title}</h3>
                        <span className={`ai-insight-tag ${insight.type}`}>
                          {insight.tag}
                        </span>
                      </div>

                      <p>{insight.description}</p>
                    </div>

                    <span className="ai-insight-number">
                      0{index + 1}
                    </span>
                  </article>
                );
              })}
            </div>

            <button
              className="ai-text-action"
              onClick={() => setShowAllInsights((value) => !value)}
            >
              {showAllInsights ? "Show less" : "View all insights"}
              <ArrowUpRight size={15} />
            </button>
          </section>

          {/* Project Progress */}
          <section className="ai-panel">
            <div className="ai-panel-header">
              <div className="ai-panel-heading">
                <div className="ai-panel-icon blue">
                  <Target size={18} />
                </div>

                <div>
                  <h2>Project Progress</h2>
                  <p>Progress across active projects</p>
                </div>
              </div>

              <button className="ai-subtle-button">
                {projects.length} Projects
              </button>
            </div>

            <div className="ai-project-list">
              {projects.map((project) => (
                <article
                  className="ai-project-item"
                  key={project.name}
                >
                  <div className="ai-project-top">
                    <div>
                      <h3>{project.name}</h3>
                      <p>{project.category}</p>
                    </div>

                    <span className={`ai-project-status ${project.color}`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="ai-project-progress-info">
                    <span>
                      {project.completed} of {project.total} tasks
                    </span>

                    <strong>{project.progress}%</strong>
                  </div>

                  <div className="ai-progress-track">
                    <div
                      className={`ai-progress-fill ${project.color}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <aside className="ai-summary-right-column">
          {/* Productivity */}
          <section className="ai-panel ai-productivity-panel">
            <div className="ai-panel-header">
              <div className="ai-panel-heading">
                <div className="ai-panel-icon green">
                  <TrendingUp size={18} />
                </div>

                <div>
                  <h2>Productivity</h2>
                  <p>Team performance overview</p>
                </div>
              </div>
            </div>

            <div className="ai-productivity-score">
              <div className="ai-productivity-number">
                {data.productivity}
                <span>%</span>
              </div>

              <div className="ai-productivity-change">
                <TrendingUp size={15} />
                {data.productivity - data.previousProductivity}% higher
              </div>

              <p>Compared with the previous period</p>
            </div>

            <div className="ai-productivity-divider" />

            <div className="ai-productivity-stat">
              <span>Previous period</span>
              <strong>{data.previousProductivity}%</strong>
            </div>

            <div className="ai-productivity-stat">
              <span>Current period</span>
              <strong>{data.productivity}%</strong>
            </div>

            <div className="ai-productivity-note">
              <Zap size={15} />
              <span>
                Keep up the momentum by resolving blockers and balancing
                workloads.
              </span>
            </div>
          </section>

          {/* Team Performance */}
          <section className="ai-panel">
            <div className="ai-panel-header">
              <div className="ai-panel-heading">
                <div className="ai-panel-icon pink">
                  <Users size={18} />
                </div>

                <div>
                  <h2>Team Performance</h2>
                  <p>Tasks completed by members</p>
                </div>
              </div>
            </div>

            <div className="ai-team-list">
              {teamMembers.map((member) => {
                const percentage = Math.round(
                  (member.completed / member.assigned) * 100
                );

                return (
                  <article className="ai-team-member" key={member.name}>
                    <div className={`ai-avatar ${member.color}`}>
                      {member.initials}
                    </div>

                    <div className="ai-team-member-info">
                      <div className="ai-team-member-top">
                        <div>
                          <h3>{member.name}</h3>
                          <p>{member.role}</p>
                        </div>

                        <strong>{percentage}%</strong>
                      </div>

                      <div className="ai-progress-track">
                        <div
                          className={`ai-progress-fill ${member.color}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <span className="ai-member-task-count">
                        {member.completed}/{member.assigned} tasks completed
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            <button className="ai-text-action">
              View team report
              <ArrowUpRight size={15} />
            </button>
          </section>

          {/* Priorities */}
          <section className="ai-panel ai-priority-panel">
            <div className="ai-panel-header">
              <div className="ai-panel-heading">
                <div className="ai-panel-icon orange">
                  <CircleAlert size={18} />
                </div>

                <div>
                  <h2>Priority Actions</h2>
                  <p>Items requiring attention</p>
                </div>
              </div>
            </div>

            <div className="ai-priority-list">
              {visiblePriorities.map((item) => {
                const isCompleted = completedPriorities.includes(item.title);

                return (
                  <article
                    className={`ai-priority-item ${
                      isCompleted ? "is-completed" : ""
                    }`}
                    key={item.title}
                  >
                    <button
                      className="ai-priority-check"
                      onClick={() => togglePriority(item.title)}
                      aria-label={
                        isCompleted
                          ? "Mark action as incomplete"
                          : "Mark action as complete"
                      }
                    >
                      {isCompleted ? (
                        <CircleCheck size={19} />
                      ) : (
                        <span />
                      )}
                    </button>

                    <div className="ai-priority-content">
                      <h3>{item.title}</h3>
                      <p>{item.project}</p>

                      <div className="ai-priority-meta">
                        <span
                          className={`ai-priority-level ${
                            item.priority === "High" ? "high" : "medium"
                          }`}
                        >
                          {item.priority}
                        </span>

                        <span className="ai-priority-due">
                          <Clock3 size={12} />
                          {item.due}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <button
              className="ai-text-action"
              onClick={() => setShowAllPriorities((value) => !value)}
            >
              {showAllPriorities ? "Show less" : "View all actions"}
              <ArrowUpRight size={15} />
            </button>
          </section>

          {/* Quick Actions */}
          <section className="ai-quick-actions">
            <div className="ai-quick-actions-heading">
              <div className="ai-quick-actions-icon">
                <MessageSquare size={18} />
              </div>

              <div>
                <h2>Need more insights?</h2>
                <p>Continue exploring your team's performance.</p>
              </div>
            </div>

            <button
              onClick={() =>
                window.alert(
                  "Connect this action to your existing AI Assistant route."
                )
              }
            >
              Ask AI Assistant
              <ArrowUpRight size={15} />
            </button>
          </section>
        </aside>
      </div>

      <footer className="ai-summary-footer">
        <span>
          <Sparkles size={14} />
          TeamFlow AI Insights
        </span>

        <span>
          Illustrative demo data · Verify metrics against your project records.
        </span>
      </footer>
    </div>
  );
}
