import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Bot,
  ChevronRight,
  Clock3,
  Copy,
  History,
  Lightbulb,
  Menu,
  MessageCircle,
  Mic,
  Paperclip,
  Search,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
  Zap,
  Check,
} from "lucide-react";

import AppSidebar from "./AppSidebar";

import {
  aiFeatures,
  getAIResponse,
  initialRecentConversations,
  quickPrompts,
  searchItems,
} from "./aiData";

import "./AI.css";

/* =====================================================
   TIME
===================================================== */

let _msgId = 1000;
const createMessageId = () => Date.now() + (++_msgId);

const getTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

/* =====================================================
   AI COMPONENT
===================================================== */

function AI() {
  const navigate = useNavigate();

  const bottomRef = useRef(null);
  const searchInputRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ===================================================
     STATE
  =================================================== */

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      type: "normal",
      text:
        "Hi John! 👋 I'm your TeamFlow AI Assistant. I can help with projects, tasks, bugs, reports and smart suggestions. What would you like to do today?",
      time: getTime(),
    },
  ]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [showSearchResults, setShowSearchResults] =
    useState(false);

  const [showHistory, setShowHistory] = useState(false);

  const [recentConversations, setRecentConversations] =
    useState(initialRecentConversations);

  const [notification, setNotification] = useState("");

  const [isListening, setIsListening] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [feedback, setFeedback] = useState({});

  /* ===================================================
     AUTO SCROLL CHAT
  =================================================== */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  /* ===================================================
     CTRL + K SEARCH
  =================================================== */

  useEffect(() => {
    const handleKeyboardShortcut = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        searchInputRef.current?.focus();

        setShowSearchResults(true);
      }

      if (event.key === "Escape") {
        setShowSearchResults(false);
        setShowHistory(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboardShortcut
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboardShortcut
      );
    };
  }, []);

  /* ===================================================
     AUTO HIDE NOTIFICATION
  =================================================== */

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [notification]);

  /* ===================================================
     SEARCH RESULTS
  =================================================== */

  const filteredSearchItems = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return [];

    return searchItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    });
  }, [search]);

  /* ===================================================
     SEND MESSAGE
  =================================================== */

  const handleSendMessage = (customMessage) => {
    const finalMessage =
      typeof customMessage === "string"
        ? customMessage.trim()
        : message.trim();

    if (!finalMessage || loading) return;

    const userMessage = {
      id: createMessageId(),
      sender: "user",
      type: "normal",
      text: finalMessage,
      time: getTime(),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setMessage("");
    setSelectedFile(null);

    /* Add conversation to history */

    setRecentConversations((previous) => {
      const exists = previous.some(
        (item) =>
          item.title.toLowerCase() ===
          finalMessage.toLowerCase()
      );

      if (exists) return previous;

      return [
        {
          id: Date.now(),
          title: finalMessage,
          time: getTime(),
        },
        ...previous,
      ].slice(0, 10);
    });

    setLoading(true);

    /* Simulated AI delay */

    setTimeout(() => {
      const response = getAIResponse(finalMessage);

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        time: getTime(),
        ...response,
      };

      setMessages((previous) => [
        ...previous,
        aiMessage,
      ]);

      setLoading(false);
    }, 700);
  };

  /* ===================================================
     ENTER TO SEND
  =================================================== */

  const handleMessageKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  /* ===================================================
     GLOBAL SEARCH
  =================================================== */

  const handleSearchEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (!search.trim()) return;

      if (filteredSearchItems.length > 0) {
        navigate(filteredSearchItems[0].path);

        setSearch("");
        setShowSearchResults(false);

        return;
      }

      askSearchToAI();
    }
  };

  const openSearchResult = (item) => {
    navigate(item.path);

    setSearch("");
    setShowSearchResults(false);
  };

  const askSearchToAI = () => {
    if (!search.trim()) return;

    const query = search;

    setSearch("");
    setShowSearchResults(false);

    handleSendMessage(query);
  };

  /* ===================================================
     CLEAR CHAT
  =================================================== */

  const clearConversation = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "ai",
        type: "normal",
        text:
          "Conversation cleared. What would you like me to help you with?",
        time: getTime(),
      },
    ]);

    setFeedback({});

    setNotification("Conversation cleared");
  };

  /* ===================================================
     COPY
  =================================================== */

  const copyMessage = async (item) => {
    let copyText = item.text;

    if (item.items) {
      copyText +=
        "\n\n" +
        item.items
          .map(
            (detail) =>
              `${detail.label}: ${detail.value}`
          )
          .join("\n");
    }

    try {
      await navigator.clipboard.writeText(copyText);

      setNotification("Response copied");
    } catch {
      setNotification("Unable to copy response");
    }
  };

  /* ===================================================
     LIKE / DISLIKE
  =================================================== */

  const setMessageFeedback = (id, value) => {
    setFeedback((previous) => ({
      ...previous,
      [id]:
        previous[id] === value ? null : value,
    }));

    if (value === "like") {
      setNotification("Thanks for your feedback!");
    } else {
      setNotification(
        "Thanks. We'll use this to improve."
      );
    }
  };

  /* ===================================================
     FILE ATTACHMENT
  =================================================== */

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    setNotification(`Attached: ${file.name}`);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ===================================================
     SIMULATED VOICE INPUT
  =================================================== */

  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      setNotification("Voice input stopped");
      return;
    }

    setIsListening(true);

    setNotification("Listening...");

    /*
      This is a frontend demo.
      Later replace this with Web Speech API
      or your speech-to-text backend.
    */

    setTimeout(() => {
      setMessage(
        "Summarize today's team updates"
      );

      setIsListening(false);

      messageInputRef.current?.focus();

      setNotification("Voice input captured");
    }, 1800);
  };

  /* ===================================================
     FEATURE CLICK
  =================================================== */

  const handleFeatureClick = (feature) => {
    handleSendMessage(feature.prompt);
  };

  /* ===================================================
     RECENT CONVERSATION
  =================================================== */

  const openRecentConversation = (conversation) => {
    setShowHistory(false);

    handleSendMessage(conversation.title);
  };

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <div className="ai-page">
      <AppSidebar />

      <main className="ai-main">

        {/* =========================================
            TOP NAVIGATION
        ========================================= */}

        <header className="ai-topbar">

          <button
            type="button"
            className="ai-mobile-menu"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* SEARCH */}

          <div className="ai-search-wrapper">

            <div className="ai-search">

              <Search size={18} />

              <input
                ref={searchInputRef}
                type="text"
                value={search}
                placeholder="Search projects, tasks, bugs..."
                onChange={(event) => {
                  setSearch(event.target.value);

                  setShowSearchResults(true);
                }}
                onFocus={() =>
                  setShowSearchResults(true)
                }
                onKeyDown={handleSearchEnter}
              />

              {search && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => {
                    setSearch("");

                    setShowSearchResults(false);

                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}

              <span className="search-shortcut">
                Ctrl K
              </span>

            </div>

            {/* SEARCH DROPDOWN */}

            {showSearchResults &&
              search.trim() && (
                <div className="search-results">

                  <div className="search-results-title">
                    Search results
                  </div>

                  {filteredSearchItems.length > 0 ? (
                    filteredSearchItems.map(
                      (item) => {
                        const Icon = item.icon;

                        return (
                          <button
                            type="button"
                            key={item.id}
                            className="search-result-item"
                            onClick={() =>
                              openSearchResult(item)
                            }
                          >
                            <span className="search-result-icon">
                              <Icon size={17} />
                            </span>

                            <div>
                              <strong>
                                {item.title}
                              </strong>

                              <span>
                                {item.description}
                              </span>
                            </div>

                            <ChevronRight size={17} />
                          </button>
                        );
                      }
                    )
                  ) : (
                    <button
                      type="button"
                      className="search-ask-ai"
                      onClick={askSearchToAI}
                    >
                      <span className="search-result-icon ai">
                        <Sparkles size={17} />
                      </span>

                      <div>
                        <strong>
                          Ask TeamFlow AI
                        </strong>

                        <span>
                          Ask AI about "{search}"
                        </span>
                      </div>

                      <ArrowRight size={17} />
                    </button>
                  )}

                </div>
              )}

          </div>

          {/* TOP ACTIONS */}

          <div className="ai-top-actions">

            <button
              type="button"
              className="top-icon"
              title="AI tips"
              onClick={() =>
                setNotification(
                  "Tip: Be specific for better AI results."
                )
              }
            >
              <Lightbulb size={19} />
            </button>

            <button
              type="button"
              className="ai-history-btn"
              onClick={() =>
                setShowHistory(true)
              }
            >
              <History size={17} />
              <span>History</span>
            </button>

            <button
              type="button"
              className="ai-avatar"
              title="John Doe"
            >
              JD
            </button>

          </div>

        </header>

        {/* =========================================
            MAIN CONTENT
        ========================================= */}

        <div className="ai-content">

          {/* HERO */}

          <section className="ai-hero">

            <div className="hero-content">

              <div className="hero-greeting">
                👋 Hi John,
              </div>

              <h1>
                Your{" "}
                <span>AI Assistant</span>{" "}
                is here!
              </h1>

              <p>
                Get instant help with your projects,
                tasks, bugs, team updates and more.
                <br />

                Ask anything or choose a suggested
                action to get started.
              </p>

              <div className="hero-benefits">

                <div>
                  <Zap size={15} />
                  Faster Workflows
                </div>

                <div>
                  <Sparkles size={15} />
                  Smarter Insights
                </div>

                <div>
                  <Bot size={15} />
                  Better Collaboration
                </div>

              </div>

            </div>

            {/* ROBOT */}

            <div className="hero-visual">

              <div className="hero-orb orb-one" />
              <div className="hero-orb orb-two" />

              <div className="hero-message">
                How can I
                <br />
                help you
                <br />
                today?
              </div>

              <div className="robot-card">

                <div className="robot-antenna">
                  <span />
                </div>

                <div className="robot-face">

                  <span className="robot-eye" />
                  <span className="robot-eye" />

                  <div className="robot-smile" />

                </div>

                <strong>AI</strong>

              </div>

              <Sparkles
                className="hero-sparkle"
                size={31}
              />

            </div>

          </section>

          {/* =========================================
              FEATURE CARDS
          ========================================= */}

          <section className="ai-feature-grid">

            {aiFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <button
                  type="button"
                  key={feature.id}
                  className={`ai-feature-card ${feature.color}`}
                  onClick={() =>
                    handleFeatureClick(feature)
                  }
                >

                  <div
                    className={`feature-icon ${feature.color}`}
                  >
                    <Icon size={22} />
                  </div>

                  <div className="feature-copy">

                    <strong>
                      {feature.title}
                    </strong>

                    <p>
                      {feature.description}
                    </p>

                  </div>

                  <ChevronRight
                    className="feature-arrow"
                    size={18}
                  />

                </button>
              );
            })}

          </section>

          {/* =========================================
              CHAT + RIGHT SIDEBAR
          ========================================= */}

          <section className="ai-workspace">

            {/* CHAT */}

            <div className="ai-chat-card">

              {/* CHAT HEADER */}

              <div className="chat-header">

                <div className="chat-title">

                  <div className="assistant-small">
                    <Bot size={18} />
                  </div>

                  <div className="chat-title-info">

                    <strong>
                      TeamFlow AI
                    </strong>

                    <span>
                      AI Assistant
                    </span>

                  </div>

                </div>

                <button
                  type="button"
                  className="clear-chat"
                  onClick={clearConversation}
                >
                  <Trash2 size={15} />
                  Clear
                </button>

              </div>

              {/* MESSAGES */}

              <div className="chat-messages">

                {messages.map((item) => (

                  <div
                    key={item.id}
                    className={`message-row ${item.sender}`}
                  >

                    {item.sender === "ai" && (
                      <div className="message-avatar ai">
                        <Bot size={17} />
                      </div>
                    )}

                    <div className="message-area">

                      <div
                        className={`message-bubble ${item.sender}`}
                      >

                        <p>{item.text}</p>

                        {item.items && (
                          <div className="summary-list">

                            {item.items.map(
                              (detail, index) => (
                                <div
                                  className="summary-item"
                                  key={`${item.id}-${detail.label}`}
                                >

                                  <span
                                    className={`summary-dot dot-${
                                      (index % 4) + 1
                                    }`}
                                  />

                                  <p>
                                    <strong>
                                      {detail.label}:
                                    </strong>{" "}
                                    {detail.value}
                                  </p>

                                </div>
                              )
                            )}

                          </div>
                        )}

                      </div>

                      {/* MESSAGE META */}

                      <div className="message-meta">

                        <span>
                          {item.time}
                        </span>

                        {item.sender === "ai" && (

                          <div className="message-actions">

                            <button
                              type="button"
                              title="Copy response"
                              onClick={() =>
                                copyMessage(item)
                              }
                            >
                              <Copy size={14} />
                            </button>

                            <button
                              type="button"
                              title="Helpful"
                              className={
                                feedback[item.id] ===
                                "like"
                                  ? "selected"
                                  : ""
                              }
                              onClick={() =>
                                setMessageFeedback(
                                  item.id,
                                  "like"
                                )
                              }
                            >
                              <ThumbsUp
                                size={14}
                              />
                            </button>

                            <button
                              type="button"
                              title="Not helpful"
                              className={
                                feedback[item.id] ===
                                "dislike"
                                  ? "selected"
                                  : ""
                              }
                              onClick={() =>
                                setMessageFeedback(
                                  item.id,
                                  "dislike"
                                )
                              }
                            >
                              <ThumbsDown
                                size={14}
                              />
                            </button>

                          </div>
                        )}

                      </div>

                    </div>

                    {item.sender === "user" && (
                      <div className="message-avatar user">
                        JD
                      </div>
                    )}

                  </div>
                ))}

                {/* AI TYPING */}

                {loading && (

                  <div className="message-row ai">

                    <div className="message-avatar ai">
                      <Bot size={17} />
                    </div>

                    <div className="typing-bubble">
                      <span />
                      <span />
                      <span />
                    </div>

                  </div>
                )}

                <div ref={bottomRef} />

              </div>

              {/* QUICK ACTION BUTTONS */}

              <div className="chat-quick-actions">

                {quickPrompts
                  .slice(0, 4)
                  .map((prompt) => {
                    const Icon = prompt.icon;

                    return (
                      <button
                        type="button"
                        key={prompt.id}
                        onClick={() =>
                          handleSendMessage(prompt.text)
                        }
                      >
                        <Icon size={14} />

                        {prompt.text}
                      </button>
                    );
                  })}

              </div>

              {/* FILE PREVIEW */}

              {selectedFile && (

                <div className="attached-file">

                  <Paperclip size={14} />

                  <span>
                    {selectedFile.name}
                  </span>

                  <button
                    type="button"
                    onClick={removeSelectedFile}
                  >
                    <X size={14} />
                  </button>

                </div>
              )}

              {/* MESSAGE INPUT */}

              <div className="ai-composer">

                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={handleFileSelect}
                />

                <button
                  type="button"
                  className="composer-icon"
                  title="Attach file"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  <Paperclip size={20} />
                </button>

                <textarea
                  ref={messageInputRef}
                  rows={1}
                  value={message}
                  placeholder="Ask me anything... e.g. summarize project, create task, find bugs..."
                  onChange={(event) =>
                    setMessage(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleMessageKeyDown
                  }
                />

                <button
                  type="button"
                  className={`composer-icon mic ${
                    isListening
                      ? "listening"
                      : ""
                  }`}
                  title="Voice input"
                  onClick={toggleVoiceInput}
                >
                  <Mic size={19} />
                </button>

                <button
                  type="button"
                  className="send-button"
                  disabled={
                    !message.trim() ||
                    loading
                  }
                  onClick={() =>
                    handleSendMessage()
                  }
                >
                  <Send size={20} />
                </button>

              </div>

              <div className="composer-note">
                <Sparkles size={11} />
                AI can make mistakes. Check
                important information.
              </div>

            </div>

            {/* =========================================
                RIGHT PANEL
            ========================================= */}

            <aside className="ai-right-panel">

              {/* QUICK PROMPTS */}

              <div className="side-card">

                <div className="side-card-title">

                  <div>
                    <Sparkles size={17} />
                    <strong>
                      Quick Prompts
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setNotification(
                        "All quick prompts are shown"
                      )
                    }
                  >
                    View All
                  </button>

                </div>

                <div className="prompt-list">

                  {quickPrompts.map(
                    (prompt) => {
                      const Icon =
                        prompt.icon;

                      return (
                        <button
                          type="button"
                          key={prompt.id}
                          onClick={() =>
                            handleSendMessage(
                              prompt.text
                            )
                          }
                        >

                          <span
                            className={`prompt-icon ${prompt.color}`}
                          >
                            <Icon size={13} />
                          </span>

                          <span>
                            {prompt.text}
                          </span>

                          <ChevronRight
                            size={14}
                          />

                        </button>
                      );
                    }
                  )}

                </div>

              </div>

              {/* RECENT CONVERSATIONS */}

              <div className="side-card">

                <div className="side-card-title">

                  <div>
                    <Clock3 size={17} />

                    <strong>
                      Recent Conversations
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowHistory(true)
                    }
                  >
                    View all
                  </button>

                </div>

                <div className="recent-list">

                  {recentConversations
                    .slice(0, 5)
                    .map(
                      (conversation) => (
                        <button
                          type="button"
                          key={
                            conversation.id
                          }
                          onClick={() =>
                            openRecentConversation(
                              conversation
                            )
                          }
                        >

                          <MessageCircle
                            size={13}
                          />

                          <span>
                            {
                              conversation.title
                            }
                          </span>

                          <small>
                            {
                              conversation.time
                            }
                          </small>

                        </button>
                      )
                    )}

                </div>

              </div>

              {/* TIPS */}

              <div className="side-card tips-card">

                <div className="tips-heading">
                  💡 Tips for better results
                </div>

                <div className="tips-grid">

                  <span>
                    <Check size={12} />
                    Be specific in your
                    questions
                  </span>

                  <span>
                    <Check size={12} />
                    Mention project or team
                    name
                  </span>

                  <span>
                    <Check size={12} />
                    Ask for step-by-step
                    solutions
                  </span>

                  <span>
                    <Check size={12} />
                    Try natural language
                  </span>

                </div>

              </div>

            </aside>

          </section>

        </div>

      </main>

      {/* =========================================
          HISTORY DRAWER
      ========================================= */}

      {showHistory && (

        <div className="history-overlay">

          <button
            type="button"
            className="history-backdrop"
            aria-label="Close history"
            onClick={() =>
              setShowHistory(false)
            }
          />

          <aside className="history-drawer">

            <div className="history-header">

              <div>
                <h3>
                  Conversation History
                </h3>

                <p>
                  Your recent AI conversations
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowHistory(false)
                }
              >
                <X size={19} />
              </button>

            </div>

            <div className="history-list">

              {recentConversations.map(
                (conversation) => (

                  <button
                    type="button"
                    key={conversation.id}
                    onClick={() =>
                      openRecentConversation(
                        conversation
                      )
                    }
                  >

                    <MessageCircle
                      size={17}
                    />

                    <div>

                      <strong>
                        {
                          conversation.title
                        }
                      </strong>

                      <span>
                        {
                          conversation.time
                        }
                      </span>

                    </div>

                    <ChevronRight
                      size={16}
                    />

                  </button>
                )
              )}

            </div>

          </aside>

        </div>
      )}

      {/* =========================================
          TOAST NOTIFICATION
      ========================================= */}

      {notification && (

        <div className="ai-toast">

          <Check size={16} />

          {notification}

        </div>
      )}

    </div>
  );
}

export default AI;