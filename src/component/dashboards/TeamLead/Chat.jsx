import { useMemo, useState } from "react";
import {
  ArrowLeft,
  AtSign,
  Bell,
  Check,
  FileText,
  Hash,
  Image,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  PanelRight,
  Plus,
  Search,
  Send,
  Smile,
  Users,
  UserPlus,
  Video,
  X,
} from "lucide-react";
import "./Chat.css";

const STARTER_THREADS = [
  {
    id: "general",
    name: "general",
    type: "channel",
    members: 12,
    description: "The place for team-wide updates, announcements, and everyday wins.",
    color: "#7158e8",
    unread: 2,
    time: "10:32 AM",
    messages: [
      { id: "g1", author: "Sarah Wilson", initials: "SW", color: "#d9739a", time: "9:15 AM", text: "Good morning team! Here's the plan for today:", bullets: ["Finish the landing page design", "Review the authentication flow", "Discuss the project timeline"] },
      { id: "g2", author: "John Doe", initials: "JD", color: "#4d8ae8", time: "9:20 AM", text: "Sounds good! I've updated the landing page with the latest changes. Take a look when you get a chance." },
      { id: "g3", author: "Emma Davis", initials: "ED", color: "#e59b55", time: "9:45 AM", text: "The new design looks amazing! I've also prepared the mobile responsive version." },
      { id: "g4", author: "Mike Chen", initials: "MC", color: "#31a88c", time: "10:12 AM", text: "Latest code is pushed. The preview is ready for review." },
      { id: "g5", author: "You", initials: "PS", color: "#7858db", time: "10:32 AM", text: "Great work everyone! Let's keep the momentum going.", own: true },
    ],
  },
  {
    id: "design",
    name: "design-team",
    type: "channel",
    members: 8,
    description: "Design critiques, explorations, and shared inspiration.",
    color: "#e6759b",
    unread: 0,
    time: "9:48 AM",
    messages: [
      { id: "d1", author: "Sarah Wilson", initials: "SW", color: "#d9739a", time: "9:12 AM", text: "I shared the updated onboarding flow in the design folder." },
      { id: "d2", author: "Emma Davis", initials: "ED", color: "#e59b55", time: "9:48 AM", text: "Thanks! The new hierarchy is much clearer. I'll add feedback before lunch." },
    ],
  },
  {
    id: "project",
    name: "project-alpha",
    type: "channel",
    members: 16,
    description: "Planning and delivery updates for Project Alpha.",
    color: "#478ce8",
    unread: 0,
    time: "Yesterday",
    messages: [
      { id: "p1", author: "Alex Morgan", initials: "AM", color: "#4d8ae8", time: "Yesterday", text: "Sprint review is moved to Thursday. Please update your cards before then." },
      { id: "p2", author: "You", initials: "PS", color: "#7858db", time: "Yesterday", text: "Updated the milestone board. We are still on track for the release.", own: true },
    ],
  },
  {
    id: "sarah",
    name: "Sarah Wilson",
    type: "direct",
    members: 2,
    description: "Direct message",
    color: "#d9739a",
    initials: "SW",
    online: true,
    unread: 0,
    time: "Yesterday",
    messages: [
      { id: "s1", author: "Sarah Wilson", initials: "SW", color: "#d9739a", time: "Yesterday", text: "Can you review the updated designs when you have a moment?" },
      { id: "s2", author: "You", initials: "PS", color: "#7858db", time: "Yesterday", text: "Absolutely — I'll take a look this afternoon.", own: true },
    ],
  },
  {
    id: "launch",
    name: "launch-planning",
    type: "channel",
    members: 9,
    description: "Coordinate the next product launch.",
    color: "#32a984",
    unread: 0,
    time: "Mon",
    messages: [
      { id: "l1", author: "Mike Chen", initials: "MC", color: "#31a88c", time: "Mon", text: "The launch checklist is ready. Please review your owners and due dates." },
    ],
  },
];

const MEMBERS = [
  { name: "Priya Sharma", role: "Team Lead", initials: "PS", color: "#7858db", online: true },
  { name: "Sarah Wilson", role: "Designer", initials: "SW", color: "#d9739a", online: true },
  { name: "Mike Chen", role: "Developer", initials: "MC", color: "#31a88c", online: true },
  { name: "Emma Davis", role: "Product Designer", initials: "ED", color: "#e59b55" },
  { name: "Alex Morgan", role: "Developer", initials: "AM", color: "#4d8ae8", online: true },
];

const SHARED_FILES = [
  { name: "Project requirements.pdf", meta: "1.2 MB · Today", type: "pdf" },
  { name: "Design handoff.fig", meta: "3.4 MB · Yesterday", type: "design" },
  { name: "Sprint timeline.xlsx", meta: "812 KB · Oct 20", type: "sheet" },
];

const PINNED_MESSAGES = [
  { author: "Sarah Wilson", date: "Oct 15", text: "Let's keep all of our important updates in one place. Great work, team!" },
];

const FILTERS = ["All", "Unread", "Channels", "Direct"];

function Avatar({ initials, color, online, small = false }) {
  return (
    <span className={`ch-avatar${small ? " small" : ""}`} style={{ "--avatar-color": color }} aria-label={initials}>
      {initials}
      {online && <i />}
    </span>
  );
}

export default function TeamLeadChat() {
  const [threads, setThreads] = useState(STARTER_THREADS);
  const [activeId, setActiveId] = useState("general");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [mobileView, setMobileView] = useState("conversation");
  const [dialog, setDialog] = useState(null);
  const [channelName, setChannelName] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [threadMembers, setThreadMembers] = useState(() => Object.fromEntries(
    STARTER_THREADS.filter(thread => thread.type === "channel")
      .map(thread => [thread.id, MEMBERS.slice(0, 4)]),
  ));

  const activeThread = threads.find(thread => thread.id === activeId) ?? threads[0];
  const activeMembers = threadMembers[activeId]
    ?? (activeThread.type === "direct"
      ? MEMBERS.filter(member => member.name === activeThread.name)
      : MEMBERS.slice(0, 4));
  const availableMembers = MEMBERS.filter(member => (
    !activeMembers.some(activeMember => activeMember.name === member.name)
  ));
  const visibleThreads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return threads.filter(thread => {
      const matchesText = thread.name.toLowerCase().includes(query);
      const matchesFilter = filter === "All"
        || (filter === "Unread" && thread.unread > 0)
        || (filter === "Channels" && thread.type === "channel")
        || (filter === "Direct" && thread.type === "direct");
      return matchesText && matchesFilter;
    });
  }, [filter, search, threads]);

  const visibleMessages = useMemo(() => {
    const query = messageSearch.trim().toLowerCase();
    return activeThread.messages.filter(message => !query || message.text.toLowerCase().includes(query));
  }, [activeThread, messageSearch]);

  function selectThread(thread) {
    setActiveId(thread.id);
    setThreads(previous => previous.map(item => item.id === thread.id ? { ...item, unread: 0 } : item));
    setMobileView("conversation");
    setMessageSearch("");
  }

  function sendMessage(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const message = {
      id: `${Date.now()}`,
      author: "You",
      initials: "PS",
      color: "#7858db",
      time,
      text,
      own: true,
    };
    setThreads(previous => previous.map(thread => thread.id === activeId
      ? { ...thread, time, messages: [...thread.messages, message] }
      : thread));
    setDraft("");
  }

  function openDialog(type) {
    setDialog(type);
    setDialogError("");
    setSelectedMembers([]);
    if (type === "channel") setChannelName("");
  }

  function closeDialog() {
    setDialog(null);
    setDialogError("");
    setSelectedMembers([]);
  }

  function createChannel(event) {
    event.preventDefault();
    const name = channelName.trim().replace(/^#+/, "").trim();
    if (!name) {
      setDialogError("Enter a channel name.");
      return;
    }
    if (name.length > 50) {
      setDialogError("Channel names must be 50 characters or fewer.");
      return;
    }
    if (threads.some(thread => thread.name.toLowerCase() === name.toLowerCase())) {
      setDialogError("A conversation with this name already exists.");
      return;
    }
    const id = `channel-${Date.now()}`;
    const thread = {
      id,
      name,
      type: "channel",
      members: 1,
      description: `A new space for ${name} conversations.`,
      color: "#7158e8",
      unread: 0,
      time: "Now",
      messages: [{ id: `welcome-${id}`, author: "TeamFlow", initials: "TF", color: "#7158e8", time: "Now", text: `Welcome to #${name}! Start the conversation here.` }],
    };
    setThreads(previous => [thread, ...previous]);
    setThreadMembers(previous => ({ ...previous, [id]: [MEMBERS[0]] }));
    setActiveId(id);
    setFilter("All");
    setSearch("");
    setMobileView("conversation");
    closeDialog();
  }

  function addMembers(event) {
    event.preventDefault();
    if (selectedMembers.length === 0) {
      setDialogError("Select at least one teammate to add.");
      return;
    }
    const newMembers = availableMembers.filter(member => selectedMembers.includes(member.name));
    setThreadMembers(previous => ({
      ...previous,
      [activeId]: [...activeMembers, ...newMembers],
    }));
    setThreads(previous => previous.map(thread => thread.id === activeId
      ? { ...thread, members: thread.members + newMembers.length }
      : thread));
    closeDialog();
  }

  return (
    <section className="ch-page" aria-label="Team chat">
      <div className="ch-workspace">
        <aside className={`ch-list-panel${mobileView === "list" ? " mobile-active" : ""}`}>
          <div className="ch-list-heading">
            <div><span className="ch-kicker">YOUR WORKSPACE</span><h1>Messages <span>{threads.length}</span></h1></div>
            <button type="button" className="ch-add-button" onClick={() => openDialog("channel")} aria-label="Create channel"><Plus size={19} /></button>
          </div>
          <label className="ch-list-search"><Search size={16} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Find a conversation" aria-label="Filter conversations" />{search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><X size={14} /></button>}</label>
          <div className="ch-filter-tabs" role="tablist" aria-label="Filter conversations">
            {FILTERS.map(item => <button type="button" role="tab" aria-selected={filter === item} className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)}>{item}{item === "Unread" && <span>{threads.filter(thread => thread.unread).length}</span>}</button>)}
          </div>
          <div className="ch-thread-list">
            <div className="ch-list-section-title"><span>RECENT</span><MoreHorizontal size={17} /></div>
            {visibleThreads.map(thread => {
              const last = thread.messages[thread.messages.length - 1];
              return (
                <button type="button" className={`ch-thread${thread.id === activeId ? " active" : ""}`} key={thread.id} onClick={() => selectThread(thread)}>
                  <span className={`ch-thread-avatar${thread.type === "direct" ? " person" : ""}`} style={{ "--avatar-color": thread.color }}>
                    {thread.type === "direct" ? thread.initials : <Hash size={19} />}{thread.online && <i />}
                  </span>
                  <span className="ch-thread-copy">
                    <span className="ch-thread-title"><b>{thread.name}</b><time>{thread.time}</time></span>
                    <span className="ch-thread-preview">{last.author === "You" ? "You: " : ""}{last.text}</span>
                  </span>
                  {thread.unread > 0 && <span className="ch-unread">{thread.unread}</span>}
                </button>
              );
            })}
            {visibleThreads.length === 0 && <p className="ch-no-threads">No conversations match your search.</p>}
          </div>
          <footer className="ch-list-footer"><span><i /> 8 teammates online</span><button type="button" onClick={() => openDialog("channel")}><Plus size={14} /> New channel</button></footer>
        </aside>

        <main className={`ch-conversation${mobileView === "conversation" ? " mobile-active" : ""}`}>
          <header className="ch-conversation-header">
            <button type="button" className="ch-mobile-back" onClick={() => setMobileView("list")} aria-label="Back to conversations"><ArrowLeft size={18} /></button>
            <span className="ch-active-icon" style={{ "--avatar-color": activeThread.color }}>{activeThread.type === "direct" ? activeThread.initials : <Hash size={22} />}</span>
            <div className="ch-active-title">
              <h2>{activeThread.type === "channel" ? `# ${activeThread.name}` : activeThread.name}</h2>
              <p><span className="ch-status-dot" />{activeThread.type === "direct" ? "Active now" : `${activeThread.members} members · ${activeThread.description}`}</p>
            </div>
            <div className="ch-conversation-actions">
              <label className="ch-message-search"><Search size={17} /><input value={messageSearch} onChange={event => setMessageSearch(event.target.value)} placeholder="Search in chat" aria-label="Search messages" />{messageSearch && <button type="button" onClick={() => setMessageSearch("")} aria-label="Clear message search"><X size={14} /></button>}</label>
              <button type="button" aria-label="Start video call" title="Start video call"><Video size={19} /></button>
              <button type="button" className={detailsOpen ? "selected" : ""} aria-label="Toggle conversation details" onClick={() => setDetailsOpen(value => !value)}><PanelRight size={19} /></button>
              <button type="button" aria-label="More conversation options"><MoreHorizontal size={20} /></button>
            </div>
          </header>
          <div className="ch-date-divider"><span /><b>Today</b><span /></div>
          <div className="ch-message-list">
            {visibleMessages.map(message => (
              <article className={`ch-message${message.own ? " own" : ""}`} key={message.id}>
                {!message.own && <Avatar initials={message.initials} color={message.color} small />}
                <div className="ch-message-body">
                  <div className="ch-message-meta"><b>{message.author}</b><time>{message.time}</time></div>
                  <div className="ch-message-bubble"><p>{message.text}</p>{message.bullets && <ul>{message.bullets.map(item => <li key={item}>{item}</li>)}</ul>}</div>
                  {message.own && <span className="ch-delivered"><Check size={13} /> Delivered</span>}
                </div>
              </article>
            ))}
            {visibleMessages.length === 0 && <div className="ch-empty-messages">No messages match “{messageSearch}”.</div>}
          </div>
          <form className="ch-composer" onSubmit={sendMessage}>
            <div className="ch-composer-tools">
              <button type="button" aria-label="Attach file" title="Attach file"><Paperclip size={18} /></button>
              <button type="button" aria-label="Add image" title="Add image"><Image size={18} /></button>
              <span />
              <button type="button" aria-label="Mention teammate" title="Mention teammate" onClick={() => setDraft(value => `${value}${value ? " " : ""}@`)}><AtSign size={18} /></button>
            </div>
            <input value={draft} onChange={event => setDraft(event.target.value)} placeholder={`Message ${activeThread.type === "channel" ? `#${activeThread.name}` : activeThread.name}...`} aria-label="Write a message" />
            <button type="button" className="ch-emoji-button" aria-label="Add emoji" onClick={() => setDraft(value => `${value}${value ? " " : ""}😊`)}><Smile size={19} /></button>
            <button type="submit" className="ch-send-button" aria-label="Send message" disabled={!draft.trim()}><Send size={17} /></button>
            <small>Enter to send · Shift + Enter for a new line</small>
          </form>
        </main>

        {detailsOpen && (
          <aside className="ch-details-panel">
            <header className="ch-details-heading"><div><span className="ch-kicker">CONVERSATION</span><h2>Details</h2></div><button type="button" onClick={() => setDetailsOpen(false)} aria-label="Close details"><X size={18} /></button></header>
            <div className="ch-details-summary">
              <span className="ch-details-icon" style={{ "--avatar-color": activeThread.color }}>{activeThread.type === "direct" ? activeThread.initials : <Hash size={30} />}</span>
              <h3>{activeThread.type === "channel" ? `# ${activeThread.name}` : activeThread.name}</h3><p>{activeThread.description}</p>
              <div className="ch-detail-stats"><span><Users size={15} /> {activeThread.members} members</span><span><Bell size={15} /> Notifications on</span></div>
            </div>
            <section className="ch-details-section">
              <div className="ch-details-section-heading"><h3>Members <span>{activeThread.members}</span></h3><button type="button" aria-label="Add members" onClick={() => openDialog("members")}><Plus size={16} /></button></div>
              {activeMembers.map(member => <div className="ch-member" key={member.name}><Avatar initials={member.initials} color={member.color} online={member.online} small /><span><b>{member.name}</b><small>{member.role}</small></span><button type="button" aria-label={`More options for ${member.name}`}><MoreHorizontal size={16} /></button></div>)}
              <button type="button" className="ch-add-members" onClick={() => openDialog("members")}><Plus size={16} /> Add people</button>
            </section>
            <section className="ch-details-section">
              <div className="ch-details-section-heading"><h3>Shared files</h3><button type="button" className="ch-view-all" onClick={() => openDialog("files")}>View all</button></div>
              {SHARED_FILES.map(file => <button type="button" className="ch-file" key={file.name}><span className={`ch-file-icon ${file.type}`}><FileText size={18} /></span><span><b>{file.name}</b><small>{file.meta}</small></span></button>)}
            </section>
            <section className="ch-pinned"><div className="ch-details-section-heading"><h3>Pinned message</h3><button type="button" className="ch-view-all" onClick={() => openDialog("pinned")}>View all</button></div><p>“Let's keep all of our important updates in one place. Great work, team!”</p><small>Sarah Wilson · Oct 15</small></section>
            <div className="ch-details-bottom"><MessageCircle size={15} /> Team conversations, all in one place.</div>
          </aside>
        )}
      </div>
      {dialog && (
        <div className="ch-dialog-backdrop" onMouseDown={event => {
          if (event.target === event.currentTarget) closeDialog();
        }}>
          <section className="ch-dialog" role="dialog" aria-modal="true" aria-labelledby="ch-dialog-title">
            <header className="ch-dialog-header">
              <div>
                <span className="ch-kicker">TEAM WORKSPACE</span>
                <h2 id="ch-dialog-title">
                  {dialog === "channel" && "Create a channel"}
                  {dialog === "members" && "Add people"}
                  {dialog === "files" && "Shared files"}
                  {dialog === "pinned" && "Pinned messages"}
                </h2>
              </div>
              <button type="button" aria-label="Close dialog" onClick={closeDialog}><X size={18} /></button>
            </header>
            {dialog === "channel" && (
              <form className="ch-dialog-form" onSubmit={createChannel}>
                <label htmlFor="ch-channel-name">Channel name</label>
                <div className="ch-channel-input"><Hash size={16} /><input id="ch-channel-name" autoFocus maxLength={50} value={channelName} onChange={event => { setChannelName(event.target.value); setDialogError(""); }} placeholder="e.g. product-updates" /></div>
                <p className="ch-dialog-hint">Create a space for a team, project, or topic.</p>
                {dialogError && <p className="ch-dialog-error" role="alert">{dialogError}</p>}
                <footer><button type="button" onClick={closeDialog}>Cancel</button><button type="submit" className="primary"><Plus size={15} /> Create channel</button></footer>
              </form>
            )}
            {dialog === "members" && (
              <form className="ch-dialog-form" onSubmit={addMembers}>
                <p className="ch-dialog-hint">Choose teammates to add to {activeThread.type === "channel" ? `#${activeThread.name}` : activeThread.name}.</p>
                <div className="ch-dialog-member-list">
                  {availableMembers.length > 0 ? availableMembers.map(member => (
                    <label className="ch-dialog-member" key={member.name}>
                      <input type="checkbox" checked={selectedMembers.includes(member.name)} onChange={event => {
                        setSelectedMembers(previous => event.target.checked
                          ? [...previous, member.name]
                          : previous.filter(name => name !== member.name));
                        setDialogError("");
                      }} />
                      <Avatar initials={member.initials} color={member.color} online={member.online} small />
                      <span><b>{member.name}</b><small>{member.role}</small></span>
                    </label>
                  )) : <p className="ch-dialog-hint">All available teammates are already in this conversation.</p>}
                </div>
                {dialogError && <p className="ch-dialog-error" role="alert">{dialogError}</p>}
                <footer><button type="button" onClick={closeDialog}>Cancel</button><button type="submit" className="primary"><UserPlus size={15} /> Add selected</button></footer>
              </form>
            )}
            {dialog === "files" && (
              <div className="ch-dialog-content">
                {SHARED_FILES.map(file => <div className="ch-file" key={file.name}><span className={`ch-file-icon ${file.type}`}><FileText size={18} /></span><span><b>{file.name}</b><small>{file.meta}</small></span></div>)}
              </div>
            )}
            {dialog === "pinned" && (
              <div className="ch-dialog-content">
                {PINNED_MESSAGES.map(message => <article className="ch-dialog-pinned" key={`${message.author}-${message.date}`}>
                  <p>“{message.text}”</p><small>{message.author} · {message.date}</small>
                </article>)}
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
