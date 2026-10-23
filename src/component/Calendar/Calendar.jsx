import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock3,
  MapPin,
  X,
  Trash2,
  Pencil,
  CalendarCheck,
} from "lucide-react";

import AppSidebar from "../../layouts/AppSidebar";
import { initialEvents } from "./calendarData";
import "./Calendar.css";

const categories = [
  { label: "All events", value: "all" },
  { label: "Meetings", value: "meeting" },
  { label: "Tasks", value: "task" },
  { label: "Deadlines", value: "deadline" },
  { label: "Team", value: "team" },
  { label: "Personal", value: "personal" },
];

const categoryLabels = {
  meeting: "Meeting",
  task: "Task",
  deadline: "Deadline",
  team: "Team",
  personal: "Personal",
};

const validCategoryValues = categories
  .filter((category) => category.value !== "all")
  .map((category) => category.value);

const pad = (number) => String(number).padStart(2, "0");

const toDateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;

const formatMonth = (date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

const formatLongDate = (dateString) => {
  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "All day";

  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

// Validate that the date exists on the calendar.
const isValidDateString = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

// Time is optional. If entered, it must use valid 24-hour HH:mm format.
const isValidTimeString = (value) =>
  value === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

function Calendar() {
  const [events, setEvents] = useState(initialEvents);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(
    toDateKey(new Date())
  );

  const [activeCategory, setActiveCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    title: "",
    date: toDateKey(new Date()),
    time: "10:00",
    category: "meeting",
    location: "",
    description: "",
  });

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const numberOfDays = new Date(year, month + 1, 0).getDate();
    const totalCells =
      Math.ceil((startOffset + numberOfDays) / 7) * 7;

    return Array.from({ length: totalCells }, (_, index) => {
      const date = new Date(year, month, index - startOffset + 1);

      return {
        date,
        key: toDateKey(date),
        inCurrentMonth: date.getMonth() === month,
      };
    });
  }, [currentMonth]);

  const visibleEvents = useMemo(
    () =>
      events
        .filter((event) => event.date === selectedDate)
        .filter(
          (event) =>
            activeCategory === "all" ||
            event.category === activeCategory
        )
        .sort((a, b) =>
          (a.time || "").localeCompare(b.time || "")
        ),
    [events, selectedDate, activeCategory]
  );

  const upcomingEvents = useMemo(() => {
    const today = toDateKey(new Date());

    return events
      .filter((event) => event.date >= today)
      .filter(
        (event) =>
          activeCategory === "all" ||
          event.category === activeCategory
      )
      .sort((a, b) =>
        `${a.date} ${a.time || "00:00"}`.localeCompare(
          `${b.date} ${b.time || "00:00"}`
        )
      )
      .slice(0, 5);
  }, [events, activeCategory]);

  const todayKey = toDateKey(new Date());

  function changeMonth(amount) {
    setCurrentMonth((previous) =>
      new Date(
        previous.getFullYear(),
        previous.getMonth() + amount,
        1
      )
    );
  }

  function goToToday() {
    const today = new Date();

    setCurrentMonth(
      new Date(today.getFullYear(), today.getMonth(), 1)
    );

    setSelectedDate(toDateKey(today));
  }

  function openAddForm(date = selectedDate) {
    setEditingId(null);

    setForm({
      title: "",
      date: isValidDateString(date) ? date : toDateKey(new Date()),
      time: "10:00",
      category: "meeting",
      location: "",
      description: "",
    });

    setFormError("");
    setShowForm(true);
  }

  function openEditForm(event) {
    setEditingId(event.id);

    setForm({
      title: event.title || "",
      date: event.date || toDateKey(new Date()),
      time: event.time || "",
      category: event.category || "meeting",
      location: event.location || "",
      description: event.description || "",
    });

    setFormError("");
    setShowForm(true);
  }

  // Update fields and clear an old error when the user corrects the form.
  function updateFormField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (formError) {
      setFormError("");
    }
  }

  function saveEvent(event) {
    event.preventDefault();

    const title = form.title.trim();
    const location = form.location.trim();
    const description = form.description.trim();

    // 1. Required title.
    if (!title) {
      setFormError("Event title is required.");
      return;
    }

    // 2. Title length.
    if (title.length > 100) {
      setFormError(
        "Event title must be 100 characters or fewer."
      );
      return;
    }

    // 3. Valid date.
    if (!form.date || !isValidDateString(form.date)) {
      setFormError("Please select a valid event date.");
      return;
    }

    // 4. Valid time, if entered.
    if (!isValidTimeString(form.time)) {
      setFormError("Please enter a valid time.");
      return;
    }

    // 5. Valid category.
    if (!validCategoryValues.includes(form.category)) {
      setFormError("Please select a valid event category.");
      return;
    }

    // 6. Location length.
    if (location.length > 150) {
      setFormError(
        "Location must be 150 characters or fewer."
      );
      return;
    }

    // 7. Description length.
    if (description.length > 1000) {
      setFormError(
        "Description must be 1,000 characters or fewer."
      );
      return;
    }

    // 8. Duplicate event check.
    // Editing the current event will not trigger a duplicate against itself.
    const duplicateEvent = events.find((item) => {
      if (editingId && item.id === editingId) {
        return false;
      }

      return (
        item.date === form.date &&
        (item.time || "") === (form.time || "") &&
        (item.title || "").trim().toLowerCase() ===
          title.toLowerCase()
      );
    });

    if (duplicateEvent) {
      setFormError(
        "An event with this title, date, and time already exists."
      );
      return;
    }

    // Save only trimmed and validated values.
    const validatedForm = {
      ...form,
      title,
      location,
      description,
    };

    if (editingId) {
      setEvents((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? { ...item, ...validatedForm }
            : item
        )
      );
    } else {
      setEvents((previous) => [
        ...previous,
        {
          id: `event-${Date.now()}`,
          ...validatedForm,
        },
      ]);
    }

    setSelectedDate(form.date);

    const eventDate = new Date(`${form.date}T12:00:00`);

    setCurrentMonth(
      new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        1
      )
    );

    setFormError("");
    setShowForm(false);
  }

  function deleteEvent(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (confirmed) {
      setEvents((previous) =>
        previous.filter((event) => event.id !== id)
      );
    }
  }

  function closeForm() {
    setShowForm(false);
    setFormError("");
  }

  return (
    <div className="calendar-page">
      <AppSidebar />

      <main className="calendar-main">
        <header className="calendar-topbar">
          <div>
            <span className="calendar-eyebrow">WORKSPACE</span>
            <h1>Calendar</h1>
            <p>Plan your work. Stay ahead of every deadline.</p>
          </div>

          <button
            type="button"
            className="calendar-primary-btn"
            onClick={() => openAddForm()}
          >
            <Plus size={18} />
            <span>Add event</span>
          </button>
        </header>

        <section className="calendar-toolbar">
          <div className="calendar-month-controls">
            <button
              type="button"
              className="calendar-icon-btn"
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
            >
              <ChevronLeft size={19} />
            </button>

            <h2>{formatMonth(currentMonth)}</h2>

            <button
              type="button"
              className="calendar-icon-btn"
              onClick={() => changeMonth(1)}
              aria-label="Next month"
            >
              <ChevronRight size={19} />
            </button>

            <button
              type="button"
              className="calendar-today-btn"
              onClick={goToToday}
            >
              Today
            </button>
          </div>

          <div className="calendar-legend">
            <span>
              <i className="legend-dot meeting-dot" /> Meetings
            </span>
            <span>
              <i className="legend-dot task-dot" /> Tasks
            </span>
            <span>
              <i className="legend-dot deadline-dot" /> Deadlines
            </span>
            <span>
              <i className="legend-dot team-dot" /> Team
            </span>
            <span>
              <i className="legend-dot personal-dot" /> Personal
            </span>
          </div>
        </section>

        <div className="calendar-layout">
          <section className="calendar-board">
            <div className="calendar-weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day) => (
                  <div key={day}>{day}</div>
                )
              )}
            </div>

            <div className="calendar-grid">
              {calendarDays.map(({ date, key, inCurrentMonth }) => {
                const dayEvents = events
                  .filter((event) => event.date === key)
                  .filter(
                    (event) =>
                      activeCategory === "all" ||
                      event.category === activeCategory
                  )
                  .sort((a, b) =>
                    (a.time || "").localeCompare(b.time || "")
                  );

                const isSelected = selectedDate === key;
                const isToday = todayKey === key;

                return (
                  <button
                    type="button"
                    key={key}
                    className={[
                      "calendar-day",
                      !inCurrentMonth ? "outside-month" : "",
                      isSelected ? "selected-day" : "",
                      isToday ? "is-today" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => {
                      setSelectedDate(key);

                      if (!inCurrentMonth) {
                        setCurrentMonth(
                          new Date(
                            date.getFullYear(),
                            date.getMonth(),
                            1
                          )
                        );
                      }
                    }}
                    aria-label={`Select ${key}`}
                  >
                    <span className="calendar-day-number">
                      {date.getDate()}
                    </span>

                    <div className="calendar-day-events">
                      {dayEvents.slice(0, 2).map((event) => (
                        <span
                          key={event.id}
                          className={`calendar-event-chip ${event.category}`}
                          title={event.title}
                        >
                          {event.title}
                        </span>
                      ))}

                      {dayEvents.length > 2 && (
                        <span className="calendar-more-events">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="calendar-details">
            <section className="calendar-side-card">
              <div className="calendar-side-heading">
                <div>
                  <span className="calendar-side-kicker">
                    SELECTED DATE
                  </span>
                  <h3>{formatLongDate(selectedDate)}</h3>
                </div>

                <CalendarDays size={21} />
              </div>

              <label
                className="calendar-filter-label"
                htmlFor="event-filter"
              >
                Filter events
              </label>

              <select
                id="event-filter"
                className="calendar-filter"
                value={activeCategory}
                onChange={(event) =>
                  setActiveCategory(event.target.value)
                }
              >
                {categories.map((category) => (
                  <option
                    key={category.value}
                    value={category.value}
                  >
                    {category.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="calendar-add-inline"
                onClick={() => openAddForm(selectedDate)}
              >
                <Plus size={17} />
                Add event on this day
              </button>

              <div className="calendar-selected-events">
                {visibleEvents.length === 0 ? (
                  <div className="calendar-empty">
                    <CalendarCheck size={30} />
                    <strong>No events scheduled</strong>
                    <span>
                      Enjoy the free time or add a new event.
                    </span>
                  </div>
                ) : (
                  visibleEvents.map((event) => (
                    <article
                      key={event.id}
                      className={`calendar-event-card ${event.category}`}
                    >
                      <div className="calendar-event-card-top">
                        <span
                          className={`calendar-category ${event.category}`}
                        >
                          {categoryLabels[event.category] || "Event"}
                        </span>

                        <div className="calendar-event-actions">
                          <button
                            type="button"
                            onClick={() => openEditForm(event)}
                            aria-label={`Edit ${event.title}`}
                            title="Edit event"
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteEvent(event.id)}
                            aria-label={`Delete ${event.title}`}
                            title="Delete event"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <h4>{event.title}</h4>

                      <div className="calendar-event-meta">
                        <Clock3 size={14} />
                        <span>{formatTime(event.time)}</span>
                      </div>

                      {event.location && (
                        <div className="calendar-event-meta">
                          <MapPin size={14} />
                          <span>{event.location}</span>
                        </div>
                      )}

                      {event.description && (
                        <p className="calendar-event-description">
                          {event.description}
                        </p>
                      )}
                    </article>
                  ))
                )}
              </div>
            </section>

            <section className="calendar-side-card upcoming-card">
              <div className="calendar-side-heading">
                <div>
                  <span className="calendar-side-kicker">
                    WHAT'S NEXT
                  </span>
                  <h3>Upcoming events</h3>
                </div>

                <Clock3 size={20} />
              </div>

              {upcomingEvents.length === 0 ? (
                <p className="calendar-upcoming-empty">
                  No upcoming events. Add one to get started.
                </p>
              ) : (
                <div className="calendar-upcoming-list">
                  {upcomingEvents.map((event) => {
                    const eventDate = new Date(
                      `${event.date}T12:00:00`
                    );

                    return (
                      <button
                        type="button"
                        className="calendar-upcoming-item"
                        key={event.id}
                        onClick={() => {
                          setSelectedDate(event.date);

                          setCurrentMonth(
                            new Date(
                              eventDate.getFullYear(),
                              eventDate.getMonth(),
                              1
                            )
                          );
                        }}
                      >
                        <div
                          className={`upcoming-date ${event.category}`}
                        >
                          <strong>{eventDate.getDate()}</strong>
                          <span>
                            {eventDate
                              .toLocaleDateString("en-US", {
                                month: "short",
                              })
                              .toUpperCase()}
                          </span>
                        </div>

                        <div className="upcoming-event-info">
                          <strong>{event.title}</strong>
                          <span>
                            {formatTime(event.time)} ·{" "}
                            {categoryLabels[event.category] || "Event"}
                          </span>
                        </div>

                        <ChevronRight size={16} />
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </aside>
        </div>
      </main>

      {showForm && (
        <div
          className="calendar-modal-backdrop"
          onClick={closeForm}
        >
          <section
            className="calendar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="calendar-modal-header">
              <div>
                <span className="calendar-side-kicker">
                  WORKSPACE SCHEDULE
                </span>

                <h2 id="calendar-modal-title">
                  {editingId ? "Edit event" : "Create an event"}
                </h2>
              </div>

              <button
                type="button"
                className="calendar-icon-btn"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <form
              className="calendar-event-form"
              onSubmit={saveEvent}
              noValidate
            >
              <label>
                Event title *
                <input
                  autoFocus
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    updateFormField("title", event.target.value)
                  }
                  placeholder="e.g. Weekly team standup"
                  maxLength={100}
                  required
                  aria-invalid={Boolean(formError)}
                />
              </label>

              <div className="calendar-form-row">
                <label>
                  Date *
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) =>
                      updateFormField("date", event.target.value)
                    }
                    required
                  />
                </label>

                <label>
                  Time
                  <input
                    type="time"
                    value={form.time}
                    onChange={(event) =>
                      updateFormField("time", event.target.value)
                    }
                  />
                </label>
              </div>

              <label>
                Category
                <select
                  value={form.category}
                  onChange={(event) =>
                    updateFormField("category", event.target.value)
                  }
                  required
                >
                  {categories
                    .filter((category) => category.value !== "all")
                    .map((category) => (
                      <option
                        key={category.value}
                        value={category.value}
                      >
                        {category.label}
                      </option>
                    ))}
                </select>
              </label>

              <label>
                Location
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) =>
                    updateFormField("location", event.target.value)
                  }
                  placeholder="Online meeting, office..."
                  maxLength={150}
                />
              </label>

              <label>
                Description
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    updateFormField("description", event.target.value)
                  }
                  placeholder="Add details or an agenda..."
                  maxLength={1000}
                />
              </label>

              {formError && (
                <p className="calendar-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="calendar-modal-actions">
                <button
                  type="button"
                  className="calendar-cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="calendar-primary-btn"
                >
                  <Plus size={17} />
                  {editingId ? "Save changes" : "Create event"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Calendar;