import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bug,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  FolderKanban,
  Sparkles,
  Users,
  MessageCircle,
  FileText,
} from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import "./TeamLeadDashboard.css";

const initialTasks = [
  { id: "TF-1024", title: "Redesign dashboard overview", project: "TeamFlow Website", assignee: "KP", assigneeName: "Komal Pawar", priority: "High", status: "In Progress", due: "Oct 26", color: "#7558f5" },
  { id: "TF-1025", title: "Fix responsive navigation", project: "Mobile Application", assignee: "AS", assigneeName: "Aarav Shah", priority: "Medium", status: "In Review", due: "Oct 27", color: "#1687e8" },
  { id: "TF-1026", title: "Create analytics components", project: "Analytics Module", assignee: "PR", assigneeName: "Priya Rao", priority: "High", status: "To Do", due: "Oct 28", color: "#d946a6" },
  { id: "TF-1027", title: "Update authentication flow", project: "Admin Dashboard", assignee: "RK", assigneeName: "Rohan Kulkarni", priority: "Low", status: "Completed", due: "Oct 24", color: "#0ca678" },
];

const teamMembers = [
  { id: 1, name: "Komal Pawar", role: "Frontend Developer", initials: "KP", color: "#eee9ff", textColor: "#6547dc", status: "Online", tasks: 8 },
  { id: 2, name: "Aarav Shah", role: "Backend Developer", initials: "AS", color: "#e0f2fe", textColor: "#0877bd", status: "Online", tasks: 6 },
  { id: 3, name: "Priya Rao", role: "UI/UX Designer", initials: "PR", color: "#fce7f3", textColor: "#be287c", status: "In a meeting", tasks: 5 },
  { id: 4, name: "Rohan Kulkarni", role: "QA Engineer", initials: "RK", color: "#d1fae5", textColor: "#087f5b", status: "Offline", tasks: 4 },
];

const projectData = [
  { name: "TeamFlow Website", progress: 85 },
  { name: "Mobile Application", progress: 62 },
  { name: "AI Integration", progress: 40 },
  { name: "Marketing Portal", progress: 25 },
];

const statusData = [
  { name: "Completed", value: 42, color: "#10b981" },
  { name: "In Progress", value: 29, color: "#2787f5" },
  { name: "To Do", value: 21, color: "#f59e0b" },
  { name: "Overdue", value: 8, color: "#f04452" },
];

function StatCard({ title, value, change, description, icon: Icon, tone = "blue", negative = false }) {
  return (
    <article className="tld-stat-card">
      <div className={`tld-stat-icon ${tone}`}><Icon size={21} /></div>
      <div className="tld-stat-copy">
        <span className="tld-stat-label">{title}</span>
        <div className="tld-stat-value-row">
          <strong className="tld-stat-value">{value}</strong>
          {change && <span className={`tld-stat-change ${negative ? "negative" : ""}`}>
            {negative ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}{change}
          </span>}
        </div>
        <span className="tld-stat-description">{description}</span>
      </div>
    </article>
  );
}

function PanelHeader({ title, subtitle, action, onAction }) {
  return <div className="tld-panel-header">
    <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
    {action && <button className="tld-link-button" onClick={onAction}>{action}<ArrowRight size={15} /></button>}
  </div>;
}

export default function TeamLeadDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(initialTasks);

  const goToTasks = () => navigate("/teamlead/tasks");
  const goToProjects = () => navigate("/teamlead/projects");
  const goToTeam = () => navigate("/teamlead/team");
  const goToWorkload = () => navigate("/teamlead/workload");
  const goToCalendar = () => navigate("/teamlead/calendar");

  const completedCount = tasks.filter(task => task.status === "Completed").length;
  const openCount = tasks.length - completedCount;

  return (
    <div className="tld-app">
      <div className="tld-workspace">
        <nav className="tld-mobile-nav" aria-label="Team Lead navigation">
          <button type="button" onClick={goToTeam}><Users size={16} />My Team<ArrowRight size={14} /></button>
          <button type="button" onClick={goToProjects}><FolderKanban size={16} />Projects<ArrowRight size={14} /></button>
          <button type="button" onClick={goToTasks}><CheckCircle2 size={16} />Tasks<ArrowRight size={14} /></button>
          <button type="button" onClick={goToCalendar}><CalendarDays size={16} />Calendar<ArrowRight size={14} /></button>
          <button type="button" onClick={() => navigate("/teamlead/meetings")}><Clock3 size={16} />Meetings<ArrowRight size={14} /></button>
          <button type="button" onClick={() => navigate("/teamlead/chat")}><MessageCircle size={16} />Team Chat<ArrowRight size={14} /></button>
          <button type="button" onClick={() => navigate("/teamlead/files")}><FileText size={16} />Files &amp; Docs<ArrowRight size={14} /></button>
          <button type="button" onClick={goToWorkload}><Activity size={16} />Workload<ArrowRight size={14} /></button>
          <button type="button" onClick={() => navigate("/teamlead/ai-summaries")}><Sparkles size={16} />AI Summaries<ArrowRight size={14} /></button>
          <button type="button" onClick={() => navigate("/teamlead/reports")}><Activity size={16} />Reports<ArrowRight size={14} /></button>
        </nav>

        <main className="tld-main">
          <section className="tld-welcome-section">
            <div><div className="tld-eyebrow"><Sparkles size={15} /> TEAM WORKSPACE</div><h1>Welcome back, Komal! <span aria-hidden="true">👋</span></h1><p>Here's what's happening with your team today.</p></div>
            <div className="tld-welcome-actions"><button className="tld-secondary-button" onClick={goToCalendar}><CalendarDays size={17} /> Oct 26, 2026 <ChevronDown size={15} /></button><button className="tld-secondary-button" onClick={() => navigate("/teamlead/meetings")}><Clock3 size={17} /> Meetings</button></div>
          </section>

          <section className="tld-stats-grid">
            <StatCard title="Total Projects" value="8" change="14%" description="+ 1 this month" icon={FolderKanban} tone="blue" />
            <StatCard title="Total Tasks" value={String(48 + openCount)} change="25%" description="+ 12 this month" icon={CheckCircle2} tone="green" />
            <StatCard title="Open Bugs" value="12" change="20%" description="- 3 this month" icon={Bug} tone="red" negative />
            <StatCard title="Team Members" value={String(teamMembers.length + 2)} change="0%" description="No change" icon={Users} tone="sky" />
            <StatCard title="Upcoming Deadlines" value="5" change="17%" description="in next 7 days" icon={CalendarDays} tone="orange" negative />
          </section>

          <section className="tld-row-grid tld-row-charts">
            <article className="tld-panel tld-project-panel">
              <PanelHeader title="Project Progress" action="View all" onAction={goToProjects} />
              <div className="tld-project-list">{projectData.map((project, i) => <div className="tld-project-row" key={project.name}>
                <span className={`tld-project-icon project-tone-${i}`}><FolderKanban size={17} /></span><span className="tld-project-title">{project.name}</span><div className="tld-progress-track"><span style={{ width: `${project.progress}%` }} /></div><b>{project.progress}%</b>
              </div>)}</div>
            </article>
            <article className="tld-panel">
              <PanelHeader title="Task Status" />
              <div className="tld-donut-layout"><div className="tld-donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="65%" outerRadius="90%" paddingAngle={3} stroke="none">{statusData.map(item => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="tld-donut-center"><strong>48</strong><span>Total Tasks</span></div></div><div className="tld-status-legend">{statusData.map(item => <div className="tld-status-legend-item" key={item.name}><span><i style={{ background: item.color }} />{item.name}</span><b>{item.value}%</b></div>)}</div></div>
            </article>
            <article className="tld-panel">
              <PanelHeader title="Bug Status" action="View all" onAction={() => navigate("/teamlead/bugs")} />
              <div className="tld-donut-layout"><div className="tld-donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ name: "Open", value: 42, color: "#f04452" }, { name: "In Progress", value: 25, color: "#2787f5" }, { name: "Resolved", value: 25, color: "#10b981" }, { name: "Critical", value: 8, color: "#f59e0b" }]} dataKey="value" cx="50%" cy="50%" innerRadius="65%" outerRadius="90%" paddingAngle={3} stroke="none">{[{ name: "Open", value: 42, color: "#f04452" }, { name: "In Progress", value: 25, color: "#2787f5" }, { name: "Resolved", value: 25, color: "#10b981" }, { name: "Critical", value: 8, color: "#f59e0b" }].map(item => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="tld-donut-center"><strong>12</strong><span>Total Bugs</span></div></div><div className="tld-status-legend">{[{ name: "Open", value: "5", color: "#f04452" }, { name: "In Progress", value: "3", color: "#2787f5" }, { name: "Resolved", value: "3", color: "#10b981" }, { name: "Critical", value: "1", color: "#f59e0b" }].map(item => <div className="tld-status-legend-item" key={item.name}><span><i style={{ background: item.color }} />{item.name}</span><b>{item.value}</b></div>)}</div></div>
            </article>
          </section>

          <section className="tld-row-grid tld-row-middle">
            <article className="tld-panel tld-team-panel">
              <PanelHeader title="My Team" action="View all" onAction={goToTeam} />
              <div className="tld-table-scroll"><table className="tld-table"><thead><tr><th>Name</th><th>Role</th><th>Current Task</th><th>Status</th></tr></thead><tbody>{teamMembers.map((member, i) => <tr key={member.id}><td><span className="tld-member-cell"><span className="tld-avatar" style={{ background: member.color, color: member.textColor }}>{member.initials}</span>{member.name}</span></td><td>{member.role}</td><td>{["UI redesign", "API integration", "Mobile screens", "Testing & bugs"][i]}</td><td><span className={`tld-badge ${member.status === "Online" ? "success" : member.status === "Offline" ? "muted" : "warning"}`}>{member.status}</span></td></tr>)}</tbody></table></div>
            </article>
            <article className="tld-panel tld-upcoming-panel">
              <PanelHeader title="My Upcoming Tasks" action="View all" onAction={goToTasks} />
              <div className="tld-upcoming-list">{tasks.slice(0, 4).map(task => <div className="tld-upcoming-task" key={task.id}><button className={`tld-task-check ${task.status === "Completed" ? "checked" : ""}`} aria-label={`Mark ${task.title} complete`} onClick={() => setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: t.status === "Completed" ? "To Do" : "Completed" } : t))}>{task.status === "Completed" && <CheckCircle2 size={16} />}</button><div className="tld-upcoming-copy"><b>{task.title}</b><small>{task.project}</small></div><span className="tld-task-due">{task.due}</span><span className={`tld-badge ${task.priority === "High" ? "danger" : task.priority === "Medium" ? "warning" : "success"}`}>{task.priority}</span></div>)}</div>
            </article>
            <article className="tld-panel tld-calendar-panel">
              <PanelHeader title="Calendar" action="View all" onAction={goToCalendar} />
              <div className="tld-calendar-heading"><button aria-label="Previous month">‹</button><b>October 2026</b><button aria-label="Next month">›</button></div>
              <div className="tld-calendar-grid">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => <span className="tld-calendar-day-name" key={day}>{day}</span>)}{Array.from({ length: 35 }, (_, i) => { const day = i - 3; const valid = day >= 1 && day <= 31; return <button key={i} className={`${valid && day === 26 ? "selected" : ""} ${!valid ? "outside" : ""}`} onClick={() => valid && goToCalendar()} disabled={!valid}>{valid ? day : day < 1 ? 27 + day : day - 31}</button>; })}</div>
              <div className="tld-calendar-legend"><span><i className="red-dot" />Deadline</span><span><i className="blue-dot" />Meeting</span><span><i className="green-dot" />Milestone</span></div>
            </article>
          </section>

          <section className="tld-row-grid tld-row-bottom">
            <article className="tld-panel">
              <PanelHeader title="Recent Activity" action="View all" onAction={() => navigate("/teamlead/reports")} />
              <div className="tld-table-scroll"><table className="tld-table tld-activity-table"><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Details</th></tr></thead><tbody>{[["10:42 AM","Komal Pawar","Completed task","UI design updated"],["10:20 AM","Aarav Shah","Created bug","Login issue #245"],["09:55 AM","Priya Rao","Updated project","Mobile App progress 62%"],["09:32 AM","Rohan Kulkarni","Added comment","On API integration"],["09:10 AM","Komal Pawar","Moved task","To In Progress"]].map((row, i) => <tr key={row[0]}><td>{row[0]}</td><td><span className="tld-activity-user"><span className={`tld-mini-avatar tone-${i}`}>{row[1].split(" ").map(s=>s[0]).join("")}</span>{row[1]}</span></td><td>{row[2]}</td><td>{row[3]}</td></tr>)}</tbody></table></div>
            </article>
            <article className="tld-panel">
              <PanelHeader title="Team Workload" action="View all" onAction={goToWorkload} />
              <div className="tld-workload-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{name:"Komal",value:80},{name:"Aarav",value:65},{name:"Priya",value:70},{name:"Rohan",value:50}]} margin={{top:12,right:5,left:-20,bottom:0}}><CartesianGrid stroke="#edf0f6" strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:11,fill:"#65718a"}}/><YAxis domain={[0,100]} axisLine={false} tickLine={false} tick={{fontSize:10,fill:"#65718a"}}/><Tooltip formatter={v=>[`${v}%`,"Workload"]}/><Bar dataKey="value" radius={[5,5,0,0]} fill="#8b75f8" /></BarChart></ResponsiveContainer></div>
            </article>
            <article className="tld-panel tld-ai-panel">
              <PanelHeader title="AI Assistant" action="View all" onAction={() => navigate("/teamlead/ai-assistant")} />
              {[["Generate task summary","Summarize team progress",FileText],["Suggest next tasks","Get AI-powered suggestions",Sparkles],["Analyze project risks","Identify potential blockers",Bug],["Create meeting notes","Summarize meeting discussions",CalendarDays]].map(([title, subtitle, Icon], i) => <button className="tld-ai-action" key={title} onClick={() => navigate("/teamlead/ai-assistant")}><span className={`tld-ai-action-icon tone-${i}`}><Icon size={17}/></span><span><b>{title}</b><small>{subtitle}</small></span><ArrowRight size={14}/></button>)}
            </article>
          </section>
          <footer className="tld-footer"><span><i /> All systems operational</span><span>TeamFlow AI · Team Lead Workspace</span><button onClick={() => navigate("/teamlead/settings")}><CircleHelp size={14}/> Help & support</button></footer>
        </main>
      </div>
    </div>
  );
}
