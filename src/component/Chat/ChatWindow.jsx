
import React, { useEffect, useRef, useState } from "react";
import {
  Hash,
  Users,
  Video,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  AtSign,
  Send,
  ArrowLeft,
  PanelRight,
  FileText,
  Image as ImageIcon,
  GitBranch,
  ExternalLink,
  Download,
} from "lucide-react";

const MAX_MESSAGE_LENGTH = 5000;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES_PER_SELECTION = 5;

const ALLOWED_EXTENSIONS = new Set([
  "pdf",
  "txt",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "csv",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
]);

function ChatWindow({
  chat,
  onSendMessage,
  onToggleDetails,
  onBack,
  detailsOpen,
}) {
  const [draft, setDraft] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [inlineSearch, setInlineSearch] = useState("");
  const [validationError, setValidationError] = useState("");

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const submittingRef = useRef(false);

  const chatMessages = Array.isArray(chat?.messages)
    ? chat.messages
    : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    setDraft("");
    setValidationError("");
    setInlineSearch("");
    setShowSearch(false);
  }, [chat?.id]);

  function handleSubmit(event) {
    event.preventDefault();

    if (submittingRef.current) return;

    const trimmed = draft.trim();

    if (!trimmed) {
      setValidationError("Please enter a message before sending.");
      inputRef.current?.focus();
      return;
    }

    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      setValidationError(
        `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`
      );
      return;
    }

    if (typeof onSendMessage !== "function") {
      setValidationError("Messaging is currently unavailable.");
      return;
    }

    submittingRef.current = true;

    let sent = false;

    try {
      sent = onSendMessage(trimmed) !== false;

      if (!sent) {
        setValidationError(
          "Unable to send the message. Please try again."
        );
        return;
      }

      setDraft("");
      setValidationError("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Could not send message:", error);
      setValidationError(
        "Something went wrong while sending. Please try again."
      );
    } finally {
      if (!sent) {
        submittingRef.current = false;
      } else {
        window.setTimeout(() => {
          submittingRef.current = false;
        }, 250);
      }
    }
  }

  function handleFileSelection(event) {
    const files = Array.from(event.target.files || []);

    // Reset so the same file can be selected again.
    event.target.value = "";

    if (!files.length) return;

    if (files.length > MAX_FILES_PER_SELECTION) {
      setValidationError("You can select a maximum of 5 files at a time.");
      return;
    }

    for (const file of files) {
      const extension = file.name
        .split(".")
        .pop()
        ?.toLowerCase();

      if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
        setValidationError(
          `${file.name}: This file type is not supported.`
        );
        return;
      }

      if (file.size === 0) {
        setValidationError(`${file.name}: Empty files are not allowed.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setValidationError(
          `${file.name}: File size must not exceed 10 MB.`
        );
        return;
      }
    }

    if (typeof onSendMessage !== "function") {
      setValidationError("File attachments are currently unavailable.");
      return;
    }

    setValidationError("");

    for (const file of files) {
      try {
        const sent = onSendMessage("", {
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
        });

        if (sent === false) {
          setValidationError(
            `Could not attach ${file.name}. Please try again.`
          );
          return;
        }
      } catch (error) {
        console.error("Could not attach file:", error);
        setValidationError(`Could not attach ${file.name}.`);
        return;
      }
    }
  }

  const query = inlineSearch.trim().toLowerCase();

  const messages = chatMessages.filter((message) => {
    const text = String(message.text ?? "");
    const sender = String(message.sender ?? "");

    return (
      !query ||
      text.toLowerCase().includes(query) ||
      sender.toLowerCase().includes(query)
    );
  });

  return (
    <section className="chat-conversation">
      <header className="conversation-header">
        <button
          type="button"
          className="icon-button mobile-back"
          onClick={onBack}
          aria-label="Back to conversations"
        >
          <ArrowLeft size={20} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          multiple
          accept=".pdf,.txt,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.gif,.webp"
          onChange={handleFileSelection}
        />

        <div className="channel-symbol">
          {chat.type === "direct" ? (
            <img
              src={
                chatMessages[0]?.avatar ||
                "https://i.pravatar.cc/100?img=12"
              }
              alt=""
            />
          ) : chat.icon === "users" ? (
            <Users size={25} />
          ) : (
            <Hash size={28} />
          )}
        </div>

        <div className="channel-heading">
          <h2>{chat.name}</h2>
          <p>
            {chat.type === "direct"
              ? "Direct message"
              : `${chat.members ?? 0} members · Team discussion`}
          </p>
        </div>

        <div className="conversation-header-actions">
          <button
            type="button"
            className="icon-button"
            title="Start video call (demo)"
            aria-label="Start video call"
            onClick={() =>
              window.alert("Video calls are not connected yet.")
            }
          >
            <Video size={21} />
          </button>

          <button
            type="button"
            className={`icon-button ${showSearch ? "tool-active" : ""}`}
            title="Search in conversation"
            aria-label="Search in conversation"
            onClick={() => {
              setShowSearch((current) => !current);
              setInlineSearch("");
            }}
          >
            <Search size={21} />
          </button>

          <button
            type="button"
            className={`icon-button ${detailsOpen ? "tool-active" : ""}`}
            title="Toggle channel details"
            aria-label="Toggle channel details"
            onClick={onToggleDetails}
          >
            <PanelRight size={21} />
          </button>

          <button
            type="button"
            className="icon-button"
            title="More options"
            aria-label="More conversation options"
            onClick={() =>
              window.alert("More conversation options coming next.")
            }
          >
            <MoreVertical size={21} />
          </button>
        </div>
      </header>

      {showSearch && (
        <div className="inline-message-search">
          <Search size={17} />

          <input
            autoFocus
            placeholder="Search this conversation..."
            value={inlineSearch}
            onChange={(event) => setInlineSearch(event.target.value)}
            aria-label="Search this conversation"
          />

          <button
            type="button"
            onClick={() => {
              setInlineSearch("");
              setShowSearch(false);
            }}
          >
            Close
          </button>
        </div>
      )}

      <div className="messages-scroll">
        <div className="date-divider">
          <span />
          <strong>Today</strong>
          <span />
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-row ${
              message.own ? "own-message-row" : ""
            }`}
          >
            {!message.own && (
              <img
                className="message-avatar"
                src={
                  message.avatar ||
                  "https://i.pravatar.cc/100?img=12"
                }
                alt={message.sender || "User"}
              />
            )}

            <div className="message-content">
              <div className="message-meta">
                <strong>{message.sender || "Unknown"}</strong>
                <span>{message.time || ""}</span>
              </div>

              <div
                className={`message-bubble ${
                  message.own ? "own-bubble" : ""
                }`}
              >
                {message.text && <p>{message.text}</p>}

                {message.attachment?.name && (
                  <div className="message-attachment">
                    <FileText size={20} />

                    <div className="message-attachment-info">
                      <strong>{message.attachment.name}</strong>
                      <span>
                        {(
                          (message.attachment.size || 0) / 1024
                        ).toFixed(1)}{" "}
                        KB
                      </span>
                    </div>
                  </div>
                )}

                {Array.isArray(message.bullets) &&
                  message.bullets.length > 0 && (
                    <ul className="message-bullets">
                      {message.bullets.map((bullet, index) => (
                        <li key={`${message.id}-bullet-${index}`}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}

                {message.attachment?.title && (
                  <button
                    type="button"
                    className="message-attachment"
                    onClick={() =>
                      window.alert(
                        `${message.attachment.title}: demo attachment`
                      )
                    }
                  >
                    <span className="attachment-icon">
                      {message.attachment.type === "github" ? (
                        <GitBranch size={27} />
                      ) : message.attachment.type === "image" ? (
                        <ImageIcon size={25} />
                      ) : (
                        <FileText size={25} />
                      )}
                    </span>

                    <span className="attachment-copy">
                      <strong>{message.attachment.title}</strong>
                      <small>{message.attachment.subtitle}</small>
                    </span>

                    {message.attachment.type === "image" ? (
                      <Download size={20} />
                    ) : (
                      <ExternalLink size={19} />
                    )}
                  </button>
                )}
              </div>

              {message.own && (
                <span className="message-status">Delivered ✓✓</span>
              )}
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <p className="no-messages">
            {query
              ? "No matching messages found."
              : "No messages yet. Start the conversation!"}
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      <form className="message-composer" onSubmit={handleSubmit}>
        <button
          type="button"
          className="icon-button"
          aria-label="Attach files"
          title="Attach files (max 5 files, 10 MB each)"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip size={19} />
        </button>

        <div className="composer-divider" />

        <input
          ref={inputRef}
          value={draft}
          maxLength={MAX_MESSAGE_LENGTH}
          onChange={(event) => {
            setDraft(event.target.value);
            setValidationError("");
          }}
          placeholder={`Message ${
            chat.type === "direct" ? "" : "#"
          }${chat.name}...`}
          aria-label="Write a message"
          aria-invalid={Boolean(validationError)}
          aria-describedby="chat-validation-message"
        />

        <button
          type="button"
          className="composer-tool"
          aria-label="Add emoji"
          onClick={() => {
            setDraft((current) =>
              `${current}${current ? " " : ""}😊`.slice(
                0,
                MAX_MESSAGE_LENGTH
              )
            );
            setValidationError("");
            inputRef.current?.focus();
          }}
        >
          <Smile size={20} />
        </button>

        <button
          type="button"
          className="composer-tool mention-tool"
          aria-label="Mention someone"
          onClick={() => {
            setDraft((current) =>
              `${current}${current ? " " : ""}@`.slice(
                0,
                MAX_MESSAGE_LENGTH
              )
            );
            setValidationError("");
            inputRef.current?.focus();
          }}
        >
          <AtSign size={20} />
        </button>

        <button
          type="submit"
          className="send-button"
          disabled={!draft.trim() || submittingRef.current}
          aria-label="Send message"
          title="Send message"
        >
          <Send size={20} />
        </button>
      </form>

      <div className="chat-validation-footer">
        <div
          id="chat-validation-message"
          className="chat-validation-message"
          role="alert"
          aria-live="polite"
        >
          {validationError}
        </div>

        <div
          className="chat-character-counter"
          aria-label={`${draft.length} of ${MAX_MESSAGE_LENGTH} characters`}
        >
          {draft.length}/{MAX_MESSAGE_LENGTH}
        </div>
      </div>
    </section>
  );
}

export default ChatWindow;
