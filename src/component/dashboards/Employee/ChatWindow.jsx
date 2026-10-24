
import React, { useEffect, useRef, useState } from "react";
import {
    Hash, Users, Video, Search, MoreVertical, Paperclip,
    Smile, AtSign, Send, ArrowLeft, PanelRight, FileText,
    Image as ImageIcon, GitBranch, ExternalLink, Download
} from "lucide-react";

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
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat.messages]);

    function handleSubmit(event) {
        event.preventDefault();
        if (!draft.trim()) return;

        onSendMessage(draft);
        setDraft("");
        inputRef.current?.focus();
    }

    function handleFileSelection(event) {
        const files = Array.from(event.target.files || []);

        files.forEach((file) => {
            onSendMessage("", {
                name: file.name,
                size: file.size,
                type: file.type || "application/octet-stream",
            });
        });

        // Reset the input so the same file can be selected again.
        event.target.value = "";
    }

    const messages = chat.messages.filter((message) => {
        const query = inlineSearch.trim().toLowerCase();

        return (
            !query ||
            message.text.toLowerCase().includes(query) ||
            message.sender.toLowerCase().includes(query)
        );
    });


    return (
        <section className="chat-conversation">
            <header className="conversation-header">
                <button
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
                    onChange={handleFileSelection}
                />

                <div className="channel-symbol">
                    {chat.type === "direct" ? (
                        <img
                            src={
                                chat.messages[0]?.avatar ||
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
                            : `${chat.members} members · Team discussion`}
                    </p>
                </div>

                <div className="conversation-header-actions">
                    <button
                        className="icon-button"
                        title="Start video call (demo)"
                        onClick={() => window.alert("Video calls are not connected yet.")}
                    >
                        <Video size={21} />
                    </button>

                    <button
                        className={`icon-button ${showSearch ? "tool-active" : ""}`}
                        title="Search in conversation"
                        onClick={() => {
                            setShowSearch(!showSearch);
                            setInlineSearch("");
                        }}
                    >
                        <Search size={21} />
                    </button>

                    <button
                        className={`icon-button ${detailsOpen ? "tool-active" : ""}`}
                        title="Toggle channel details"
                        onClick={onToggleDetails}
                    >
                        <PanelRight size={21} />
                    </button>

                    <button
                        className="icon-button"
                        title="More options"
                        onClick={() => window.alert("More conversation options coming next.")}
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
                    />
                    <button
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
                        className={`message-row ${message.own ? "own-message-row" : ""}`}
                    >
                        {!message.own && (
                            <img
                                className="message-avatar"
                                src={message.avatar}
                                alt={message.sender}
                            />
                        )}

                        <div className="message-content">
                            <div className="message-meta">
                                <strong>{message.sender}</strong>
                                <span>{message.time}</span>
                            </div>

                            <div
                                className={`message-bubble ${message.own ? "own-bubble" : ""
                                    }`}
                            >
                                <p>{message.text}</p>
                                {message.attachment && (
                                    <div className="message-attachment">
                                        <FileText size={20} />

                                        <div className="message-attachment-info">
                                            <strong>{message.attachment.name}</strong>
                                            <span>
                                                {(message.attachment.size / 1024).toFixed(1)} KB
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {message.bullets && (
                                    <ul className="message-bullets">
                                        {message.bullets.map((bullet) => (
                                            <li key={bullet}>{bullet}</li>
                                        ))}
                                    </ul>
                                )}

                                {message.attachment && (
                                    <button
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
                    <p className="no-messages">No matching messages found.</p>
                )}

                <div ref={bottomRef} />
            </div>

            <form className="message-composer" onSubmit={handleSubmit}>
                <button
                    type="button"
                    className="icon-button"
                    aria-label="Attach files"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Paperclip size={19} />
                </button>

                <div className="composer-divider" />

                <input
                    ref={inputRef}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={`Message ${chat.type === "direct" ? "" : "#"}${chat.name}...`}
                    aria-label="Write a message"
                />

                <button
                    type="button"
                    className="composer-tool"
                    aria-label="Add emoji"
                    onClick={() =>
                        setDraft((current) => `${current}${current ? " " : ""}😊`)
                    }
                >
                    <Smile size={20} />
                </button>

                <button
                    type="button"
                    className="composer-tool mention-tool"
                    aria-label="Mention someone"
                    onClick={() =>
                        setDraft((current) => `${current}${current ? " " : ""}@`)
                    }
                >
                    <AtSign size={20} />
                </button>

                <button
                    type="submit"
                    className="send-button"
                    disabled={!draft.trim()}
                    aria-label="Send message"
                >
                    <Send size={20} />
                </button>
            </form>
        </section>
    );
}

export default ChatWindow;
