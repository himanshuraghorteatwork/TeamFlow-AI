
import React, { useMemo } from "react";
import {
  Plus,
  Hash,
  Users,
  Pin,
  Search,
  MessageCircle,
  UserRound,
  Trash2,
} from "lucide-react";

const tabs = ["All", "Unread", "Channels", "Direct"];

function ChatList({
  chats,
  activeChatId,
  onSelectChat,
  activeTab,
  setActiveTab,
  search,
  setSearch,
  onCreateChat,
  onDeleteChat,
}) {
  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    return chats.filter((chat) => {
      const name = String(chat.name ?? "");
      const preview = String(chat.preview ?? "");

      const matchesSearch =
        name.toLowerCase().includes(query) ||
        preview.toLowerCase().includes(query);

      const isDirect =
        chat.type === "direct" ||
        chat.type === "dm" ||
        chat.isDirect === true;

      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Unread" && (chat.unreadCount ?? 0) > 0) ||
        (activeTab === "Channels" && !isDirect) ||
        (activeTab === "Direct" && isDirect);

      return matchesSearch && matchesTab;
    });
  }, [chats, search, activeTab]);

  function getIcon(chat) {
    if (
      chat.type === "direct" ||
      chat.type === "dm" ||
      chat.isDirect
    ) {
      return <UserRound size={17} />;
    }

    if (chat.type === "group") return <Users size={17} />;
    if (chat.icon === "message") return <MessageCircle size={17} />;

    return <Hash size={17} />;
  }

  return (
    <section className="chat-list">
      <div className="chat-list-header">
        <div>
          <h2>Messages</h2>
          <p>Stay connected with your team</p>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={() => {
            const name = window.prompt("Enter a channel name:");

            if (name !== null) {
              onCreateChat(name);
            }
          }}
          title="Create a channel"
          aria-label="Create a channel"
        >
          <Plus size={20} />
        </button>
      </div>

      <label className="chat-list-search">
        <Search size={17} />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search conversations..."
          aria-label="Search conversations"
        />

        {search && (
          <button
            className="icon-button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
            type="button"
          >
            ×
          </button>
        )}
      </label>

      <div className="chat-filter-tabs">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="chat-list-items">
        {filteredChats.map((chat) => {
          const canDelete = chat.type === "channel";

          return (
            <div className="chat-list-entry" key={chat.id}>
              <button
                type="button"
                className={`chat-list-item ${
                  activeChatId === chat.id ? "active" : ""
                }`}
                onClick={() => onSelectChat(chat.id)}
                aria-current={
                  activeChatId === chat.id ? "true" : undefined
                }
              >
                <div className="chat-item-avatar">
                  {chat.avatar ? (
                    <img src={chat.avatar} alt="" />
                  ) : (
                    getIcon(chat)
                  )}

                  {chat.online && <span className="online-dot" />}
                </div>

                <div className="chat-item-content">
                  <div className="chat-item-title">
                    <strong>{chat.name}</strong>

                    {chat.pinned && <Pin size={13} />}

                    {chat.time && <time>{chat.time}</time>}
                  </div>

                  <div className="chat-item-preview">
                    <span>{chat.preview || "No messages yet"}</span>

                    {(chat.unreadCount ?? 0) > 0 && (
                      <span className="unread-badge">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {canDelete && (
                <button
                  type="button"
                  className="chat-delete-button"
                  title={`Delete channel ${chat.name}`}
                  aria-label={`Delete channel ${chat.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteChat?.(chat.id);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        })}

        {filteredChats.length === 0 && (
          <div className="chat-list-empty">
            <Search size={22} />
            <strong>No conversations found</strong>
            <span>Try a different search or filter.</span>
          </div>
        )}
      </div>

      <div className="chat-list-footer">
        {chats.length} conversations
      </div>
    </section>
  );
}

export default ChatList;
