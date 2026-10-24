import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Bell,
  CircleHelp,
  ChevronDown,
  Plus,
  FolderKanban,
  CircleCheckBig,
  Clock3,
  CheckCircle2,
  Monitor,
  Smartphone,
  Globe2,
  BrainCircuit,
  Database,
  MoreVertical,
  LayoutGrid,
  List,
  X,
  CalendarDays,
  Pencil,
  Trash2,
  ClipboardList,
  ArrowRight,
  UserPlus,
  ChevronRight,
} from "lucide-react";

import AppSidebar from "./AppSidebar.jsx";
import "./Projects.css";

import {
  initialProjects,
  availableMembers,
} from "./projectData.js";

const STORAGE_KEY = "teamflow_projects";

const TASK_STATUSES = [
  "To Do",
  "In Progress",
  "Review",
  "Completed",
];

/* =========================================================
   LOAD PROJECTS
========================================================= */

const getProjects = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    return initialProjects;
  } catch (error) {
    console.error("Failed to load projects:", error);
    return initialProjects;
  }
};

/* =========================================================
   PROJECT PROGRESS
========================================================= */

const getProgress = (project) => {
  if (!project.tasks?.length) return 0;

  const completed = project.tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  return Math.round(
    (completed / project.tasks.length) * 100
  );
};

/* =========================================================
   PROJECT ICON
========================================================= */

const getProjectIcon = (icon) => {
  switch (icon) {
    case "mobile":
      return Smartphone;

    case "globe":
      return Globe2;

    case "brain":
      return BrainCircuit;

    case "database":
      return Database;

    default:
      return Monitor;
  }
};

/* =========================================================
   NEXT TASK STATUS
========================================================= */

const getNextTaskStatus = (status) => {
  const index = TASK_STATUSES.indexOf(status);

  if (
    index === -1 ||
    index === TASK_STATUSES.length - 1
  ) {
    return status;
  }

  return TASK_STATUSES[index + 1];
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (date) => {
  if (!date) return "No due date";

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/* =========================================================
   PROJECTS PAGE
========================================================= */

function Projects() {
  const [projects, setProjects] =
    useState(getProjects);

  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState("All Projects");

  const [view, setView] = useState("grid");

  const [
    showProjectModal,
    setShowProjectModal,
  ] = useState(false);

  const [
    showTaskModal,
    setShowTaskModal,
  ] = useState(false);

  const [showDetails, setShowDetails] =
    useState(false);

  const [
    selectedProjectId,
    setSelectedProjectId,
  ] = useState(null);

  const [
    editingProject,
    setEditingProject,
  ] = useState(null);

  const [openMenu, setOpenMenu] =
    useState(null);

  /* SAVE PROJECTS */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(projects)
    );
  }, [projects]);

  /* SELECTED PROJECT */

  const selectedProject = projects.find(
    (project) =>
      project.id === selectedProjectId
  );

  /* PROJECT STATS */

  const stats = useMemo(() => {
    return {
      total: projects.length,

      active: projects.filter(
        (project) =>
          project.status === "Active"
      ).length,

      onHold: projects.filter(
        (project) =>
          project.status === "On Hold"
      ).length,

      completed: projects.filter(
        (project) =>
          project.status === "Completed"
      ).length,
    };
  }, [projects]);

  /* FILTER + SEARCH */

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        project.description
          .toLowerCase()
          .includes(search.toLowerCase());

      let matchesFilter = true;

      if (filter === "Active") {
        matchesFilter =
          project.status === "Active";
      }

      if (filter === "On Hold") {
        matchesFilter =
          project.status === "On Hold";
      }

      if (filter === "Completed") {
        matchesFilter =
          project.status === "Completed";
      }

      return (
        matchesSearch && matchesFilter
      );
    });
  }, [projects, search, filter]);

  /* =====================================================
     CREATE PROJECT
  ===================================================== */

  const createProject = (data) => {
    const newProject = {
      id: Date.now(),

      name: data.name,
      description: data.description,

      icon: data.icon,
      status: data.status,
      priority: data.priority,

      startDate: data.startDate,
      dueDate: data.dueDate,

      lastUpdated: "Just now",

      members: data.members,

      tasks: [],
    };

    setProjects((prev) => [
      newProject,
      ...prev,
    ]);

    setShowProjectModal(false);
  };

  /* =====================================================
     UPDATE PROJECT
  ===================================================== */

  const updateProject = (data) => {
    if (!editingProject) return;

    setProjects((prev) =>
      prev.map((project) =>
        project.id === editingProject.id
          ? {
              ...project,
              ...data,
              lastUpdated: "Just now",
            }
          : project
      )
    );

    setEditingProject(null);
    setShowProjectModal(false);
  };

  /* =====================================================
     DELETE PROJECT
  ===================================================== */

  const deleteProject = (projectId) => {
    const project = projects.find(
      (item) => item.id === projectId
    );

    if (
      !window.confirm(
        `Delete "${project?.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setProjects((prev) =>
      prev.filter(
        (project) =>
          project.id !== projectId
      )
    );

    if (
      selectedProjectId === projectId
    ) {
      setShowDetails(false);
      setSelectedProjectId(null);
    }

    setOpenMenu(null);
  };

  /* =====================================================
     ADD TASK
  ===================================================== */

  const addTask = (task) => {
    if (!selectedProjectId) return;

    const newTask = {
      id: Date.now(),

      title: task.title,

      status: "To Do",

      assignee: task.assignee,
    };

    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProjectId
          ? {
              ...project,

              tasks: [
                ...(project.tasks || []),
                newTask,
              ],

              lastUpdated: "Just now",
            }
          : project
      )
    );

    setShowTaskModal(false);
  };

  /* =====================================================
     UPDATE TASK STATUS
  ===================================================== */

  const updateTaskStatus = (
    projectId,
    taskId,
    status
  ) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,

              tasks: (
                project.tasks || []
              ).map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      status,
                    }
                  : task
              ),

              lastUpdated: "Just now",
            }
          : project
      )
    );
  };

  /* =====================================================
     MOVE TASK FORWARD
  ===================================================== */

  const moveTaskForward = (
    projectId,
    taskId
  ) => {
    const project = projects.find(
      (item) => item.id === projectId
    );

    const task = project?.tasks?.find(
      (item) => item.id === taskId
    );

    if (!task) return;

    updateTaskStatus(
      projectId,
      taskId,
      getNextTaskStatus(task.status)
    );
  };

  /* =====================================================
     DELETE TASK
  ===================================================== */

  const deleteTask = (
    projectId,
    taskId
  ) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,

              tasks: (
                project.tasks || []
              ).filter(
                (task) =>
                  task.id !== taskId
              ),

              lastUpdated: "Just now",
            }
          : project
      )
    );
  };

  /* =====================================================
     ADD MEMBER
  ===================================================== */

  const addMember = (
    projectId,
    member
  ) => {
    setProjects((prev) =>
      prev.map((project) => {
        if (
          project.id !== projectId
        ) {
          return project;
        }

        const exists =
          project.members?.some(
            (item) =>
              item.id === member.id
          );

        if (exists) {
          return project;
        }

        return {
          ...project,

          members: [
            ...(project.members || []),
            member,
          ],

          lastUpdated: "Just now",
        };
      })
    );
  };

  /* =====================================================
     OPEN DETAILS
  ===================================================== */

  const openProjectDetails = (
    projectId
  ) => {
    setSelectedProjectId(projectId);

    setShowDetails(true);

    setOpenMenu(null);
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (project) => {
    setEditingProject(project);

    setShowProjectModal(true);

    setOpenMenu(null);
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div className="projects-app">
      {/* FIXED SIDEBAR */}

      <AppSidebar />

      {/* FIXED TOPBAR */}

      <header className="projects-topbar">
        <div className="projects-global-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search projects, tasks, members..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </div>

        <div className="projects-topbar-right">
          <button
            type="button"
            className="projects-topbar-icon"
            aria-label="Notifications"
          >
            <Bell size={19} />
          </button>

          <button
            type="button"
            className="projects-topbar-icon"
            aria-label="Help"
          >
            <CircleHelp size={19} />
          </button>

          <button
            type="button"
            className="projects-profile"
          >
            <div className="projects-profile-avatar">
              HR
            </div>

            <div className="projects-profile-info">
              <strong>Himanshu</strong>
              <span>Tech Team</span>
            </div>

            <ChevronDown size={16} />
          </button>
        </div>
      </header>

      {/* MAIN */}

      <main className="projects-main">
        <div className="projects-content">
          {/* TITLE */}

          <section className="projects-title-row">
            <div>
              <h1>Projects</h1>

              <p>
                Manage and track all your
                projects in one place.
              </p>
            </div>

            <button
              type="button"
              className="project-primary-btn"
              onClick={() => {
                setEditingProject(null);
                setShowProjectModal(true);
              }}
            >
              <Plus size={19} />
              New Project
            </button>
          </section>

          {/* STATS */}

          <section className="project-stats">
            <StatCard
              icon={<FolderKanban />}
              value={stats.total}
              label="Total Projects"
              className="purple"
            />

            <StatCard
              icon={<CircleCheckBig />}
              value={stats.active}
              label="Active Projects"
              className="green"
            />

            <StatCard
              icon={<Clock3 />}
              value={stats.onHold}
              label="On Hold"
              className="orange"
            />

            <StatCard
              icon={<CheckCircle2 />}
              value={stats.completed}
              label="Completed"
              className="red"
            />
          </section>

          {/* CONTROLS */}

          <section className="projects-controls">
            <div className="project-tabs">
              {[
                "All Projects",
                "Active",
                "On Hold",
                "Completed",
              ].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={
                    filter === tab
                      ? "project-tab active"
                      : "project-tab"
                  }
                  onClick={() =>
                    setFilter(tab)
                  }
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="project-control-right">
              <div className="project-search">
                <Search size={17} />

                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="project-view-switch">
                <button
                  type="button"
                  className={
                    view === "grid"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setView("grid")
                  }
                  title="Grid view"
                >
                  <LayoutGrid
                    size={18}
                  />
                </button>

                <button
                  type="button"
                  className={
                    view === "list"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setView("list")
                  }
                  title="List view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* PROJECTS */}

          {filteredProjects.length ===
          0 ? (
            <EmptyState
              onCreate={() => {
                setEditingProject(null);
                setShowProjectModal(
                  true
                );
              }}
            />
          ) : view === "grid" ? (
            <section className="projects-grid">
              {filteredProjects.map(
                (project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    openMenu={openMenu}
                    setOpenMenu={
                      setOpenMenu
                    }
                    onOpen={() =>
                      openProjectDetails(
                        project.id
                      )
                    }
                    onEdit={() =>
                      handleEdit(project)
                    }
                    onDelete={() =>
                      deleteProject(
                        project.id
                      )
                    }
                  />
                )
              )}
            </section>
          ) : (
            <ProjectTable
              projects={
                filteredProjects
              }
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              onOpen={
                openProjectDetails
              }
              onEdit={handleEdit}
              onDelete={deleteProject}
            />
          )}

          {/* PROJECT LIST TABLE */}

          {view === "grid" &&
            filteredProjects.length >
              0 && (
              <>
                <div className="project-list-heading">
                  <h2>
                    Project List
                  </h2>

                  <span>
                    {
                      filteredProjects.length
                    }{" "}
                    projects
                  </span>
                </div>

                <ProjectTable
                  projects={
                    filteredProjects
                  }
                  openMenu={openMenu}
                  setOpenMenu={
                    setOpenMenu
                  }
                  onOpen={
                    openProjectDetails
                  }
                  onEdit={handleEdit}
                  onDelete={
                    deleteProject
                  }
                />
              </>
            )}
        </div>
      </main>

      {/* DETAILS */}

      {showDetails &&
        selectedProject && (
          <ProjectDetails
            project={
              selectedProject
            }
            onClose={() =>
              setShowDetails(false)
            }
            onAddTask={() =>
              setShowTaskModal(true)
            }
            onEdit={() =>
              handleEdit(
                selectedProject
              )
            }
            onMoveTask={
              moveTaskForward
            }
            onStatusChange={
              updateTaskStatus
            }
            onDeleteTask={
              deleteTask
            }
            onAddMember={
              addMember
            }
          />
        )}

      {/* PROJECT MODAL */}

      {showProjectModal && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setShowProjectModal(
              false
            );

            setEditingProject(
              null
            );
          }}
          onSave={
            editingProject
              ? updateProject
              : createProject
          }
        />
      )}

      {/* TASK MODAL */}

      {showTaskModal &&
        selectedProject && (
          <TaskModal
            project={
              selectedProject
            }
            onClose={() =>
              setShowTaskModal(false)
            }
            onSave={addTask}
          />
        )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  value,
  label,
  className,
}) {
  return (
    <article className="project-stat-card">
      <div
        className={`project-stat-icon ${className}`}
      >
        {icon}
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

/* =========================================================
   PROJECT CARD
========================================================= */

function ProjectCard({
  project,
  openMenu,
  setOpenMenu,
  onOpen,
  onEdit,
  onDelete,
}) {
  const Icon =
    getProjectIcon(project.icon);

  const progress =
    getProgress(project);

  return (
    <article className="project-card">
      <div className="project-card-header">
        <div
          className={`project-card-icon ${project.icon}`}
        >
          <Icon size={23} />
        </div>

        <div className="project-card-title">
          <h3>{project.name}</h3>

          <p>
            {project.description}
          </p>
        </div>

        <div className="project-menu-wrap">
          <button
            type="button"
            className="project-icon-btn"
            onClick={(event) => {
              event.stopPropagation();

              setOpenMenu(
                openMenu ===
                  project.id
                  ? null
                  : project.id
              );
            }}
          >
            <MoreVertical
              size={19}
            />
          </button>

          {openMenu ===
            project.id && (
            <div className="project-menu">
              <button
                type="button"
                onClick={onOpen}
              >
                <FolderKanban
                  size={15}
                />
                Open
              </button>

              <button
                type="button"
                onClick={onEdit}
              >
                <Pencil size={15} />
                Edit
              </button>

              <button
                type="button"
                className="danger"
                onClick={onDelete}
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="project-card-members">
        <MemberStack
          members={
            project.members || []
          }
        />
      </div>

      <div className="project-progress-row">
        <div className="project-progress">
          <div
            className="project-progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <strong>
          {progress}%
        </strong>
      </div>

      <div className="project-card-footer">
        <StatusBadge
          status={project.status}
        />

        <span className="project-due">
          <CalendarDays
            size={14}
          />

          {formatDate(
            project.dueDate
          )}
        </span>
      </div>

      <button
        type="button"
        className="project-open-btn"
        onClick={onOpen}
      >
        View Project

        <ChevronRight
          size={17}
        />
      </button>
    </article>
  );
}

/* =========================================================
   PROJECT TABLE
========================================================= */

function ProjectTable({
  projects,
  openMenu,
  setOpenMenu,
  onOpen,
  onEdit,
  onDelete,
}) {
  return (
    <div className="project-table-wrap">
      <table className="project-table">
        <thead>
          <tr>
            <th>
              Project Name
            </th>

            <th>Status</th>
            <th>Progress</th>

            <th>
              Team Members
            </th>

            <th>Due Date</th>

            <th>
              Last Updated
            </th>

            <th />
          </tr>
        </thead>

        <tbody>
          {projects.map(
            (project) => {
              const Icon =
                getProjectIcon(
                  project.icon
                );

              const progress =
                getProgress(
                  project
                );

              return (
                <tr
                  key={
                    project.id
                  }
                >
                  <td>
                    <button
                      type="button"
                      className="project-table-name"
                      onClick={() =>
                        onOpen(
                          project.id
                        )
                      }
                    >
                      <span
                        className={`project-table-icon ${project.icon}`}
                      >
                        <Icon
                          size={
                            17
                          }
                        />
                      </span>

                      <span>
                        <strong>
                          {
                            project.name
                          }
                        </strong>

                        <small>
                          {
                            project.description
                          }
                        </small>
                      </span>
                    </button>
                  </td>

                  <td>
                    <StatusBadge
                      status={
                        project.status
                      }
                    />
                  </td>

                  <td>
                    <div className="table-progress">
                      <div className="project-progress">
                        <div
                          className="project-progress-fill"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>

                      <strong>
                        {
                          progress
                        }
                        %
                      </strong>
                    </div>
                  </td>

                  <td>
                    <MemberStack
                      members={
                        project.members ||
                        []
                      }
                    />
                  </td>

                  <td>
                    <span className="table-date">
                      <CalendarDays
                        size={
                          15
                        }
                      />

                      {formatDate(
                        project.dueDate
                      )}
                    </span>
                  </td>

                  <td>
                    {
                      project.lastUpdated
                    }
                  </td>

                  <td>
                    <div className="project-menu-wrap">
                      <button
                        type="button"
                        className="project-icon-btn"
                        onClick={() =>
                          setOpenMenu(
                            openMenu ===
                              `table-${project.id}`
                              ? null
                              : `table-${project.id}`
                          )
                        }
                      >
                        <MoreVertical
                          size={
                            18
                          }
                        />
                      </button>

                      {openMenu ===
                        `table-${project.id}` && (
                        <div className="project-menu table-menu">
                          <button
                            type="button"
                            onClick={() =>
                              onOpen(
                                project.id
                              )
                            }
                          >
                            Open
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onEdit(
                                project
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="danger"
                            onClick={() =>
                              onDelete(
                                project.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   MEMBER STACK
========================================================= */

function MemberStack({
  members = [],
}) {
  return (
    <div className="member-stack">
      {members
        .slice(0, 4)
        .map(
          (
            member,
            index
          ) => (
            <div
              className="member-avatar"
              key={member.id}
              title={
                member.name
              }
              style={{
                zIndex:
                  members.length -
                  index,
              }}
            >
              {
                member.initials
              }
            </div>
          )
        )}

      {members.length > 4 && (
        <div className="member-more">
          +
          {members.length - 4}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}) {
  const className = status
    .toLowerCase()
    .replaceAll(" ", "-");

  return (
    <span
      className={`project-status ${className}`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   PROJECT DETAILS DRAWER
========================================================= */

function ProjectDetails({
  project,
  onClose,
  onAddTask,
  onEdit,
  onMoveTask,
  onStatusChange,
  onDeleteTask,
  onAddMember,
}) {
  const [tab, setTab] =
    useState("Overview");

  const [
    showMembers,
    setShowMembers,
  ] = useState(false);

  const progress =
    getProgress(project);

  const completedTasks = (
    project.tasks || []
  ).filter(
    (task) =>
      task.status === "Completed"
  ).length;

  const availableToAdd =
    availableMembers.filter(
      (member) =>
        !(
          project.members || []
        ).some(
          (item) =>
            item.id === member.id
        )
    );

  return (
    <>
      <div
        className="project-drawer-overlay"
        onClick={onClose}
      />

      <aside className="project-details-drawer">
        <div className="project-details-header">
          <div>
            <span>
              Project Details
            </span>

            <h2>
              {project.name}
            </h2>
          </div>

          <button
            type="button"
            className="project-close-btn"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>

        <div className="project-detail-progress">
          <div>
            <span>
              Overall progress
            </span>

            <strong>
              {progress}%
            </strong>
          </div>

          <div className="project-progress">
            <div
              className="project-progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="project-details-tabs">
          {[
            "Overview",
            "Tasks",
            "Members",
          ].map((item) => (
            <button
              type="button"
              key={item}
              className={
                tab === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setTab(item)
              }
            >
              {item}
            </button>
          ))}
        </div>

        <div className="project-details-body">
          {/* OVERVIEW */}

          {tab ===
            "Overview" && (
            <>
              <section className="detail-section">
                <h3>
                  Project
                  information
                </h3>

                <p className="project-description">
                  {
                    project.description
                  }
                </p>

                <div className="detail-info-grid">
                  <DetailInfo
                    label="Status"
                    value={
                      <StatusBadge
                        status={
                          project.status
                        }
                      />
                    }
                  />

                  <DetailInfo
                    label="Priority"
                    value={
                      project.priority
                    }
                  />

                  <DetailInfo
                    label="Start Date"
                    value={formatDate(
                      project.startDate
                    )}
                  />

                  <DetailInfo
                    label="Due Date"
                    value={formatDate(
                      project.dueDate
                    )}
                  />
                </div>
              </section>

              <section className="detail-section">
                <div className="detail-section-heading">
                  <h3>
                    Tasks
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      setTab(
                        "Tasks"
                      )
                    }
                  >
                    View all
                  </button>
                </div>

                <div className="project-task-summary">
                  <div>
                    <ClipboardList />

                    <strong>
                      {
                        (
                          project.tasks ||
                          []
                        )
                          .length
                      }
                    </strong>

                    <span>
                      Total tasks
                    </span>
                  </div>

                  <div>
                    <CheckCircle2 />

                    <strong>
                      {
                        completedTasks
                      }
                    </strong>

                    <span>
                      Completed
                    </span>
                  </div>
                </div>
              </section>

              <section className="detail-section">
                <div className="detail-section-heading">
                  <h3>
                    Team Members
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      setTab(
                        "Members"
                      )
                    }
                  >
                    Manage
                  </button>
                </div>

                <div className="detail-member-list">
                  {(
                    project.members ||
                    []
                  ).map(
                    (member) => (
                      <div
                        className="detail-member"
                        key={
                          member.id
                        }
                      >
                        <div className="member-avatar large">
                          {
                            member.initials
                          }
                        </div>

                        <div>
                          <strong>
                            {
                              member.name
                            }
                          </strong>

                          <span>
                            Project
                            member
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>

              <button
                type="button"
                className="project-edit-full"
                onClick={onEdit}
              >
                <Pencil
                  size={17}
                />

                Edit Project
              </button>
            </>
          )}

          {/* TASKS */}

          {tab === "Tasks" && (
            <section className="detail-section">
              <div className="detail-section-heading">
                <div>
                  <h3>
                    Project Tasks
                  </h3>

                  <p>
                    To Do → In
                    Progress →
                    Review →
                    Completed
                  </p>
                </div>

                <button
                  type="button"
                  className="small-primary-btn"
                  onClick={
                    onAddTask
                  }
                >
                  <Plus
                    size={15}
                  />

                  Add Task
                </button>
              </div>

              {(project.tasks || [])
                .length === 0 ? (
                <div className="drawer-empty">
                  <ClipboardList
                    size={34}
                  />

                  <h4>
                    No tasks yet
                  </h4>

                  <p>
                    Add the first
                    task to this
                    project.
                  </p>
                </div>
              ) : (
                <div className="drawer-task-list">
                  {(
                    project.tasks ||
                    []
                  ).map(
                    (task) => (
                      <div
                        className="drawer-task"
                        key={
                          task.id
                        }
                      >
                        <div className="drawer-task-main">
                          <div>
                            <strong>
                              {
                                task.title
                              }
                            </strong>

                            <span>
                              Assigned
                              to{" "}
                              {
                                task.assignee
                              }
                            </span>
                          </div>

                          <select
                            value={
                              task.status
                            }
                            onChange={(
                              event
                            ) =>
                              onStatusChange(
                                project.id,
                                task.id,
                                event
                                  .target
                                  .value
                              )
                            }
                          >
                            {TASK_STATUSES.map(
                              (
                                status
                              ) => (
                                <option
                                  key={
                                    status
                                  }
                                  value={
                                    status
                                  }
                                >
                                  {
                                    status
                                  }
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        <div className="drawer-task-actions">
                          {task.status !==
                            "Completed" && (
                            <button
                              type="button"
                              onClick={() =>
                                onMoveTask(
                                  project.id,
                                  task.id
                                )
                              }
                            >
                              Move
                              forward

                              <ArrowRight
                                size={
                                  15
                                }
                              />
                            </button>
                          )}

                          <button
                            type="button"
                            className="task-delete-btn"
                            onClick={() =>
                              onDeleteTask(
                                project.id,
                                task.id
                              )
                            }
                          >
                            <Trash2
                              size={
                                15
                              }
                            />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>
          )}

          {/* MEMBERS */}

          {tab ===
            "Members" && (
            <section className="detail-section">
              <div className="detail-section-heading">
                <div>
                  <h3>
                    Team Members
                  </h3>

                  <p>
                    {
                      (
                        project.members ||
                        []
                      ).length
                    }{" "}
                    people in this
                    project
                  </p>
                </div>

                <button
                  type="button"
                  className="small-primary-btn"
                  onClick={() =>
                    setShowMembers(
                      !showMembers
                    )
                  }
                >
                  <UserPlus
                    size={15}
                  />

                  Add
                </button>
              </div>

              {showMembers &&
                availableToAdd.length >
                  0 && (
                  <div className="available-members">
                    {availableToAdd.map(
                      (member) => (
                        <button
                          type="button"
                          key={
                            member.id
                          }
                          onClick={() =>
                            onAddMember(
                              project.id,
                              member
                            )
                          }
                        >
                          <div className="member-avatar">
                            {
                              member.initials
                            }
                          </div>

                          <span>
                            {
                              member.name
                            }
                          </span>

                          <Plus
                            size={
                              15
                            }
                          />
                        </button>
                      )
                    )}
                  </div>
                )}

              <div className="detail-member-list">
                {(
                  project.members ||
                  []
                ).map(
                  (member) => (
                    <div
                      className="detail-member member-card"
                      key={
                        member.id
                      }
                    >
                      <div className="member-avatar large">
                        {
                          member.initials
                        }
                      </div>

                      <div>
                        <strong>
                          {
                            member.name
                          }
                        </strong>

                        <span>
                          Project
                          member
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          )}
        </div>
      </aside>
    </>
  );
}

/* =========================================================
   DETAIL INFO
========================================================= */

function DetailInfo({
  label,
  value,
}) {
  return (
    <div className="detail-info">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

/* =========================================================
   PROJECT MODAL
========================================================= */

function ProjectModal({
  project,
  onClose,
  onSave,
}) {
  const [form, setForm] =
    useState({
      name:
        project?.name || "",

      description:
        project?.description ||
        "",

      status:
        project?.status ||
        "Active",

      priority:
        project?.priority ||
        "Medium",

      startDate:
        project?.startDate ||
        "",

      dueDate:
        project?.dueDate || "",

      icon:
        project?.icon ||
        "monitor",

      members:
        project?.members || [],
    });

  const handleChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleMember = (
    member
  ) => {
    const exists =
      form.members.some(
        (item) =>
          item.id === member.id
      );

    setForm((prev) => ({
      ...prev,

      members: exists
        ? prev.members.filter(
            (item) =>
              item.id !==
              member.id
          )
        : [
            ...prev.members,
            member,
          ],
    }));
  };

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert(
        "Please enter a project name."
      );

      return;
    }

    if (
      !form.description.trim()
    ) {
      alert(
        "Please enter a project description."
      );

      return;
    }

    if (
      form.startDate &&
      form.dueDate &&
      form.dueDate <
        form.startDate
    ) {
      alert(
        "Due date cannot be before the start date."
      );

      return;
    }

    onSave(form);
  };

  return (
    <div className="project-modal-overlay">
      <form
        className="project-modal"
        onSubmit={handleSubmit}
      >
        <div className="project-modal-header">
          <div>
            <span>
              {project
                ? "Update project"
                : "Create project"}
            </span>

            <h2>
              {project
                ? "Edit Project"
                : "New Project"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="project-form">
          <label className="full">
            Project Name

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              placeholder="e.g. TeamFlow AI"
            />
          </label>

          <label className="full">
            Description

            <textarea
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              placeholder="What is this project about?"
            />
          </label>

          <label>
            Status

            <select
              name="status"
              value={form.status}
              onChange={
                handleChange
              }
            >
              <option>
                Active
              </option>

              <option>
                On Hold
              </option>

              <option>
                Completed
              </option>
            </select>
          </label>

          <label>
            Priority

            <select
              name="priority"
              value={
                form.priority
              }
              onChange={
                handleChange
              }
            >
              <option>
                Low
              </option>

              <option>
                Medium
              </option>

              <option>
                High
              </option>
            </select>
          </label>

          <label>
            Start Date

            <input
              type="date"
              name="startDate"
              value={
                form.startDate
              }
              onChange={
                handleChange
              }
            />
          </label>

          <label>
            Due Date

            <input
              type="date"
              name="dueDate"
              value={
                form.dueDate
              }
              onChange={
                handleChange
              }
            />
          </label>

          <label className="full">
            Project Type

            <select
              name="icon"
              value={form.icon}
              onChange={
                handleChange
              }
            >
              <option value="monitor">
                Web Application
              </option>

              <option value="mobile">
                Mobile
                Application
              </option>

              <option value="globe">
                Website
              </option>

              <option value="brain">
                AI Project
              </option>

              <option value="database">
                Backend / API
              </option>
            </select>
          </label>

          <div className="project-member-selector full">
            <span>
              Team Members
            </span>

            <div>
              {availableMembers.map(
                (member) => {
                  const selected =
                    form.members.some(
                      (item) =>
                        item.id ===
                        member.id
                    );

                  return (
                    <button
                      type="button"
                      key={
                        member.id
                      }
                      className={
                        selected
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        toggleMember(
                          member
                        )
                      }
                    >
                      <span className="member-avatar">
                        {
                          member.initials
                        }
                      </span>

                      {
                        member.name
                      }
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        <div className="project-modal-actions">
          <button
            type="button"
            className="project-cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="project-primary-btn"
          >
            {project
              ? "Save Changes"
              : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   TASK MODAL
========================================================= */

function TaskModal({
  project,
  onClose,
  onSave,
}) {
  const [title, setTitle] =
    useState("");

  const [
    assignee,
    setAssignee,
  ] = useState(
    project.members?.[0]?.name ||
      ""
  );

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      alert(
        "Please enter a task title."
      );

      return;
    }

    onSave({
      title: title.trim(),

      assignee:
        assignee ||
        "Unassigned",
    });
  };

  return (
    <div className="project-modal-overlay">
      <form
        className="project-modal task-modal"
        onSubmit={handleSubmit}
      >
        <div className="project-modal-header">
          <div>
            <span>
              {project.name}
            </span>

            <h2>Add Task</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="project-form">
          <label className="full">
            Task Title

            <input
              autoFocus
              type="text"
              value={title}
              onChange={(
                event
              ) =>
                setTitle(
                  event.target
                    .value
                )
              }
              placeholder="Enter task title"
            />
          </label>

          <label className="full">
            Assign To

            <select
              value={assignee}
              onChange={(
                event
              ) =>
                setAssignee(
                  event.target
                    .value
                )
              }
            >
              {(
                project.members ||
                []
              ).length ===
                0 && (
                <option value="">
                  Unassigned
                </option>
              )}

              {(
                project.members ||
                []
              ).map(
                (member) => (
                  <option
                    key={
                      member.id
                    }
                    value={
                      member.name
                    }
                  >
                    {
                      member.name
                    }
                  </option>
                )
              )}
            </select>
          </label>
        </div>

        <div className="project-modal-actions">
          <button
            type="button"
            className="project-cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="project-primary-btn"
          >
            <Plus size={17} />

            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  onCreate,
}) {
  return (
    <div className="projects-empty">
      <FolderKanban
        size={44}
      />

      <h3>
        No projects found
      </h3>

      <p>
        Try changing your search
        or create a new project.
      </p>

      <button
        type="button"
        className="project-primary-btn"
        onClick={onCreate}
      >
        <Plus size={17} />

        New Project
      </button>
    </div>
  );
}

export default Projects;