import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock3,
  FolderKanban,
  Globe2,
  Monitor,
  Search,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";
import { initialProjects } from "../Employee/projectData.js";
import "./Project.css";

const STORAGE_KEY = "teamflow_projects";
const FILTERS = ["All Projects", "Active", "On Hold", "Completed"];

const PROJECT_ICONS = {
  mobile: Smartphone,
  globe: Globe2,
  brain: Sparkles,
  database: FolderKanban,
};

function getProjects() {
  try {
    const savedProjects = localStorage.getItem(STORAGE_KEY);
    if (!savedProjects) return initialProjects;

    const parsedProjects = JSON.parse(savedProjects);
    if (!Array.isArray(parsedProjects)) {
      throw new TypeError("Saved projects must be an array.");
    }

    return parsedProjects;
  } catch (error) {
    console.error("Failed to load projects for the Team Lead dashboard:", error);
    return initialProjects;
  }
}

function getProgress(project) {
  const tasks = Array.isArray(project.tasks) ? project.tasks : [];
  if (tasks.length === 0) return 0;

  const completedTasks = tasks.filter(task => task.status === "Completed").length;
  return Math.round((completedTasks / tasks.length) * 100);
}

function formatDate(date) {
  if (!date) return "No due date";

  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return "No due date";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProjectCard({ project }) {
  const Icon = PROJECT_ICONS[project.icon] || Monitor;
  const progress = getProgress(project);
  const members = Array.isArray(project.members) ? project.members : [];
  const tasks = Array.isArray(project.tasks) ? project.tasks : [];

  return (
    <article className="tl-project-card">
      <div className="tl-project-card-top">
        <span className={`tl-project-icon ${project.icon || "default"}`}>
          <Icon size={21} aria-hidden="true" />
        </span>
        <span className={`tl-project-status ${project.status?.toLowerCase().replaceAll(" ", "-") || "unknown"}`}>
          <i />
          {project.status || "Unknown"}
        </span>
      </div>

      <div className="tl-project-title-row">
        <div>
          <h2>{project.name}</h2>
          <p>{project.description || "No project description provided."}</p>
        </div>
        <span className={`tl-project-priority ${project.priority?.toLowerCase() || "medium"}`}>
          {project.priority || "Medium"}
        </span>
      </div>

      <div className="tl-project-progress">
        <div className="tl-project-progress-label">
          <span>Task progress</span>
          <b>{progress}%</b>
        </div>
        <div
          className="tl-project-progress-track"
          role="progressbar"
          aria-label={`${project.name} task progress`}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <small>
          {tasks.filter(task => task.status === "Completed").length} of {tasks.length} tasks completed
        </small>
      </div>

      <div className="tl-project-card-footer">
        <div className="tl-project-members">
          <Users size={15} aria-hidden="true" />
          <div className="tl-project-avatars" aria-label={`${members.length} project members`}>
            {members.slice(0, 4).map(member => (
              <span key={`${project.id}-${member.id}`} title={member.name}>
                {member.initials || member.name?.split(/\s+/).map(part => part[0]).join("").slice(0, 2)}
              </span>
            ))}
          </div>
          <small>{members.length} {members.length === 1 ? "member" : "members"}</small>
        </div>
        <div className="tl-project-due">
          <CalendarDays size={14} aria-hidden="true" />
          <span>{formatDate(project.dueDate)}</span>
        </div>
      </div>
    </article>
  );
}

export default function Project() {
  const [projects] = useState(getProjects);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Projects");

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(project => project.status === "Active").length,
    onHold: projects.filter(project => project.status === "On Hold").length,
    completed: projects.filter(project => project.status === "Completed").length,
  }), [projects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter(project => {
      const matchesFilter = filter === "All Projects" || project.status === filter;
      const matchesSearch = !query
        || project.name?.toLowerCase().includes(query)
        || project.description?.toLowerCase().includes(query)
        || project.members?.some(member => member.name?.toLowerCase().includes(query));

      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, search]);

  return (
    <section className="tl-project-page">
      <header className="tl-project-header">
        <div>
          <span className="tl-project-eyebrow">WORKSPACE OVERVIEW</span>
          <h1>Projects</h1>
          <p>Track project progress, timelines, and team contributions.</p>
        </div>
        <div className="tl-project-header-count">
          <FolderKanban size={18} aria-hidden="true" />
          {stats.total} {stats.total === 1 ? "project" : "projects"}
        </div>
      </header>

      <section className="tl-project-stats" aria-label="Project summary">
        <article className="tl-project-stat">
          <span className="tl-project-stat-icon total"><FolderKanban size={20} /></span>
          <div><small>Total Projects</small><b>{stats.total}</b></div>
        </article>
        <article className="tl-project-stat">
          <span className="tl-project-stat-icon active"><CircleDashed size={20} /></span>
          <div><small>Active</small><b>{stats.active}</b></div>
        </article>
        <article className="tl-project-stat">
          <span className="tl-project-stat-icon hold"><Clock3 size={20} /></span>
          <div><small>On Hold</small><b>{stats.onHold}</b></div>
        </article>
        <article className="tl-project-stat">
          <span className="tl-project-stat-icon completed"><CheckCircle2 size={20} /></span>
          <div><small>Completed</small><b>{stats.completed}</b></div>
        </article>
      </section>

      <section className="tl-project-list">
        <div className="tl-project-list-heading">
          <div>
            <h2>All projects <span>{filteredProjects.length}</span></h2>
            <p>Browse your team's projects and their current status.</p>
          </div>
          <div className="tl-project-controls">
            <label className="tl-project-search">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search projects or members"
                value={search}
                onChange={event => setSearch(event.target.value)}
              />
            </label>
            <label className="tl-project-filter-label">
              <span className="tl-project-sr-only">Filter projects by status</span>
              <select value={filter} onChange={event => setFilter(event.target.value)}>
                {FILTERS.map(status => <option key={status}>{status}</option>)}
              </select>
            </label>
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="tl-project-grid">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="tl-project-empty">
            <Search size={24} aria-hidden="true" />
            <h3>No projects found</h3>
            <p>Try another search term or choose a different status filter.</p>
          </div>
        )}
      </section>
    </section>
  );
}