import { useMemo, useState } from "react";
import {
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { initialEvents } from "../../Calendar/calendarData.js";
import "./Calendar.css";

const CATEGORIES = [
  { label: "All events", value: "all" },
  { label: "Meetings", value: "meeting" },
  { label: "Tasks", value: "task" },
  { label: "Deadlines", value: "deadline" },
  { label: "Team", value: "team" },
  { label: "Personal", value: "personal" },
];

const CATEGORY_LABELS = {
  meeting: "Meeting",
  task: "Task",
  deadline: "Deadline",
  team: "Team",
  personal: "Personal",
};

const pad = value => String(value).padStart(2, "0");
const toDateKey = date =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const formatMonth = date => date.toLocaleDateString("en-US", {
  month: "long",
  year: "numeric",
});

function formatLongDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "All day";
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day;
}

function isValidTime(value) {
  return value === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function getEmptyForm(date) {
  return {
    title: "",
    date,
    time: "10:00",
    category: "meeting",
    location: "",
    description: "",
  };
}

export default function Calendar() {
  const todayKey = toDateKey(new Date());
  const [events, setEvents] = useState(initialEvents);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(() => getEmptyForm(todayKey));

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOffset = new Date(year, month, 1).getDay();
    const dayCount = new Date(year, month + 1, 0).getDate();
    const cellCount = Math.ceil((firstDayOffset + dayCount) / 7) * 7;

    return Array.from({ length: cellCount }, (_, index) => {
      const date = new Date(year, month, index - firstDayOffset + 1);
      return {
        date,
        key: toDateKey(date),
        inCurrentMonth: date.getMonth() === month,
      };
    });
  }, [currentMonth]);

  const visibleEvents = useMemo(() => events
    .filter(event => event.date === selectedDate)
    .filter(event => activeCategory === "all" || event.category === activeCategory)
    .sort((a, b) => (a.time || "").localeCompare(b.time || "")),
  [events, selectedDate, activeCategory]);

  const upcomingEvents = useMemo(() => events
    .filter(event => event.date >= todayKey)
    .filter(event => activeCategory === "all" || event.category === activeCategory)
    .sort((a, b) => `${a.date} ${a.time || "00:00"}`.localeCompare(`${b.date} ${b.time || "00:00"}`))
    .slice(0, 5),
  [events, todayKey, activeCategory]);

  function openAddForm(date = selectedDate) {
    setEditingId(null);
    setForm(getEmptyForm(isValidDate(date) ? date : todayKey));
    setFormError("");
    setShowForm(true);
  }

  function openEditForm(event) {
    setEditingId(event.id);
    setForm({
      title: event.title || "",
      date: event.date || todayKey,
      time: event.time || "",
      category: event.category || "meeting",
      location: event.location || "",
      description: event.description || "",
    });
    setFormError("");
    setShowForm(true);
  }

  function updateFormField(field, value) {
    setForm(previous => ({ ...previous, [field]: value }));
    if (formError) setFormError("");
  }

  function saveEvent(event) {
    event.preventDefault();
    const title = form.title.trim();
    const location = form.location.trim();
    const description = form.description.trim();

    if (!title) {
      setFormError("Event title is required.");
      return;
    }
    if (title.length > 100) {
      setFormError("Event title must be 100 characters or fewer.");
      return;
    }
    if (!isValidDate(form.date)) {
      setFormError("Please select a valid event date.");
      return;
    }
    if (!isValidTime(form.time)) {
      setFormError("Please enter a valid time.");
      return;
    }
    if (!CATEGORIES.some(category => category.value === form.category && category.value !== "all")) {
      setFormError("Please select a valid event category.");
      return;
    }
    if (location.length > 150) {
      setFormError("Location must be 150 characters or fewer.");
      return;
    }
    if (description.length > 1000) {
      setFormError("Description must be 1,000 characters or fewer.");
      return;
    }

    const duplicate = events.some(item => (
      item.id !== editingId
      && item.date === form.date
      && (item.time || "") === (form.time || "")
      && item.title.trim().toLowerCase() === title.toLowerCase()
    ));
    if (duplicate) {
      setFormError("An event with this title, date, and time already exists.");
      return;
    }

    const normalizedEvent = { ...form, title, location, description };
    if (editingId) {
      setEvents(previous => previous.map(item => (
        item.id === editingId ? { ...item, ...normalizedEvent } : item
      )));
    } else {
      setEvents(previous => [...previous, {
        id: `team-lead-event-${Date.now()}`,
        ...normalizedEvent,
      }]);
    }

    setSelectedDate(form.date);
    const date = new Date(`${form.date}T12:00:00`);
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setShowForm(false);
    setFormError("");
  }

  function deleteEvent(id) {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setEvents(previous => previous.filter(event => event.id !== id));
  }

  function selectEventDate(date) {
    setSelectedDate(date);
    const eventDate = new Date(`${date}T12:00:00`);
    setCurrentMonth(new Date(eventDate.getFullYear(), eventDate.getMonth(), 1));
  }

  function closeForm() {
    setShowForm(false);
    setFormError("");
  }

  return (
    <section className="tl-calendar">
      <header className="tl-calendar-header">
        <div>
          <span className="tl-calendar-eyebrow">TEAM WORKSPACE</span>
          <h1>Calendar</h1>
          <p>Plan your work and stay ahead of every team deadline.</p>
        </div>
        <button type="button" className="tl-calendar-primary" onClick={() => openAddForm()}>
          <Plus size={17} /> Add event
        </button>
      </header>

      <section className="tl-calendar-toolbar">
        <div className="tl-calendar-month-controls">
          <button type="button" aria-label="Previous month" onClick={() => setCurrentMonth(previous => new Date(previous.getFullYear(), previous.getMonth() - 1, 1))}>
            <ChevronLeft size={18} />
          </button>
          <h2>{formatMonth(currentMonth)}</h2>
          <button type="button" aria-label="Next month" onClick={() => setCurrentMonth(previous => new Date(previous.getFullYear(), previous.getMonth() + 1, 1))}>
            <ChevronRight size={18} />
          </button>
          <button type="button" className="tl-calendar-today" onClick={() => {
            const today = new Date();
            setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
            setSelectedDate(todayKey);
          }}>Today</button>
        </div>
        <div className="tl-calendar-legend">
          {CATEGORIES.filter(category => category.value !== "all").map(category => (
            <span key={category.value}><i className={category.value} />{category.label}</span>
          ))}
        </div>
      </section>

      <div className="tl-calendar-layout">
        <section className="tl-calendar-board">
          <div className="tl-calendar-weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => <span key={day}>{day}</span>)}
          </div>
          <div className="tl-calendar-grid">
            {calendarDays.map(({ date, key, inCurrentMonth }) => {
              const dayEvents = events
                .filter(event => event.date === key)
                .filter(event => activeCategory === "all" || event.category === activeCategory)
                .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
              const classes = [
                "tl-calendar-day",
                !inCurrentMonth && "outside",
                selectedDate === key && "selected",
                todayKey === key && "today",
              ].filter(Boolean).join(" ");

              return (
                <button type="button" key={key} className={classes} onClick={() => selectEventDate(key)} aria-label={`Select ${key}`}>
                  <span className="tl-calendar-day-number">{date.getDate()}</span>
                  <span className="tl-calendar-day-events">
                    {dayEvents.slice(0, 2).map(item => (
                      <span key={item.id} className={`tl-calendar-chip ${item.category}`} title={item.title}>{item.title}</span>
                    ))}
                    {dayEvents.length > 2 && <span className="tl-calendar-more">+{dayEvents.length - 2} more</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="tl-calendar-side">
          <section className="tl-calendar-panel">
            <div className="tl-calendar-panel-heading">
              <div><span>SELECTED DATE</span><h2>{formatLongDate(selectedDate)}</h2></div>
              <CalendarDays size={20} />
            </div>
            <label className="tl-calendar-filter-label" htmlFor="tl-calendar-filter">Filter events</label>
            <select id="tl-calendar-filter" className="tl-calendar-filter" value={activeCategory} onChange={event => setActiveCategory(event.target.value)}>
              {CATEGORIES.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}
            </select>
            <button type="button" className="tl-calendar-add-inline" onClick={() => openAddForm(selectedDate)}>
              <Plus size={16} /> Add event on this day
            </button>

            <div className="tl-calendar-selected-events">
              {visibleEvents.length === 0 ? (
                <div className="tl-calendar-empty">
                  <CalendarCheck size={28} />
                  <strong>No events scheduled</strong>
                  <span>Enjoy the free time or add an event.</span>
                </div>
              ) : visibleEvents.map(event => (
                <article className={`tl-calendar-event ${event.category}`} key={event.id}>
                  <div className="tl-calendar-event-top">
                    <span className={`tl-calendar-category ${event.category}`}>{CATEGORY_LABELS[event.category] || "Event"}</span>
                    <div>
                      <button type="button" aria-label={`Edit ${event.title}`} onClick={() => openEditForm(event)}><Pencil size={13} /></button>
                      <button type="button" aria-label={`Delete ${event.title}`} onClick={() => deleteEvent(event.id)}><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <h3>{event.title}</h3>
                  <div className="tl-calendar-event-meta"><Clock3 size={13} />{formatTime(event.time)}</div>
                  {event.location && <div className="tl-calendar-event-meta"><MapPin size={13} />{event.location}</div>}
                  {event.description && <p>{event.description}</p>}
                </article>
              ))}
            </div>
          </section>

          <section className="tl-calendar-panel tl-calendar-upcoming">
            <div className="tl-calendar-panel-heading">
              <div><span>WHAT'S NEXT</span><h2>Upcoming events</h2></div>
              <Clock3 size={19} />
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="tl-calendar-upcoming-empty">No upcoming events. Add one to get started.</p>
            ) : upcomingEvents.map(event => {
              const eventDate = new Date(`${event.date}T12:00:00`);
              return (
                <button type="button" className="tl-calendar-upcoming-item" key={event.id} onClick={() => selectEventDate(event.date)}>
                  <span className={`tl-calendar-upcoming-date ${event.category}`}>
                    <b>{eventDate.getDate()}</b>
                    <small>{eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}</small>
                  </span>
                  <span className="tl-calendar-upcoming-info">
                    <b>{event.title}</b>
                    <small>{formatTime(event.time)} · {CATEGORY_LABELS[event.category] || "Event"}</small>
                  </span>
                  <ChevronRight size={15} />
                </button>
              );
            })}
          </section>
        </aside>
      </div>

      {showForm && (
        <div className="tl-calendar-modal-backdrop" onMouseDown={event => {
          if (event.target === event.currentTarget) closeForm();
        }}>
          <section className="tl-calendar-modal" role="dialog" aria-modal="true" aria-labelledby="tl-calendar-modal-title">
            <header className="tl-calendar-modal-header">
              <div><span>TEAM WORKSPACE</span><h2 id="tl-calendar-modal-title">{editingId ? "Edit event" : "Create an event"}</h2></div>
              <button type="button" aria-label="Close form" onClick={closeForm}><X size={18} /></button>
            </header>
            <form onSubmit={saveEvent} noValidate>
              <label>Event title *
                <input autoFocus type="text" value={form.title} onChange={event => updateFormField("title", event.target.value)} placeholder="e.g. Weekly team standup" maxLength={100} required />
              </label>
              <div className="tl-calendar-form-row">
                <label>Date *
                  <input type="date" value={form.date} onChange={event => updateFormField("date", event.target.value)} required />
                </label>
                <label>Time
                  <input type="time" value={form.time} onChange={event => updateFormField("time", event.target.value)} />
                </label>
              </div>
              <label>Category
                <select value={form.category} onChange={event => updateFormField("category", event.target.value)}>
                  {CATEGORIES.filter(category => category.value !== "all").map(category => <option key={category.value} value={category.value}>{category.label}</option>)}
                </select>
              </label>
              <label>Location
                <input type="text" value={form.location} onChange={event => updateFormField("location", event.target.value)} placeholder="Online meeting, office..." maxLength={150} />
              </label>
              <label>Description
                <textarea rows={3} value={form.description} onChange={event => updateFormField("description", event.target.value)} placeholder="Add details or an agenda..." maxLength={1000} />
              </label>
              {formError && <p className="tl-calendar-form-error" role="alert">{formError}</p>}
              <footer className="tl-calendar-modal-actions">
                <button type="button" onClick={closeForm}>Cancel</button>
                <button type="submit" className="submit"><Plus size={16} />{editingId ? "Save changes" : "Create event"}</button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
