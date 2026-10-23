
import React, { useEffect, useMemo, useState } from "react";
import { Search, Bell, CircleHelp, ChevronDown } from "lucide-react";

import "./Chat.css";
import { initialChats, normalizeChats } from "./chatData";
import AppSidebar from "../../layouts/AppSidebar";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import ChannelDetails from "./ChannelDetails";

const STORAGE_KEY = "teamflow-ai-chats-v1";
const MAX_MESSAGE_LENGTH = 5000;
const MAX_CHANNEL_NAME_LENGTH = 50;

function loadChats() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : initialChats;
    const normalized = normalizeChats(parsed);

    return Array.isArray(normalized) ? normalized : initialChats;
  } catch (error) {
    console.error("Could not load TeamFlow chats:", error);
    return normalizeChats(initialChats);
  }
}

function Chat() {
  const [chats, setChats] = useState(loadChats);
  const [activeChatId, setActiveChatId] = useState("general");
  const [activeTab, setActiveTab] = useState("All");
  const [chatSearch, setChatSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [showDetails, setShowDetails] = useState(true);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [mobilePanel, setMobilePanel] = useState("list");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error("Could not save TeamFlow chats:", error);
    }
  }, [chats]);

  const activeChat =
    chats.find((chat) => chat.id === activeChatId) ?? chats[0] ?? null;

  const matchingMessages = useMemo(() => {
    const query = messageSearch.trim().toLowerCase();

    if (!query) return [];

    return chats.flatMap((chat) =>
      (Array.isArray(chat.messages) ? chat.messages : [])
        .filter((message) =>
          String(message.text ?? "").toLowerCase().includes(query)
        )
        .map((message) => ({
          ...message,
          text: String(message.text ?? ""),
          sender: String(message.sender ?? "Unknown"),
          chatId: chat.id,
          chatName: chat.name,
        }))
    );
  }, [chats, messageSearch]);

  function selectChat(id) {
    const exists = chats.some((chat) => chat.id === id);

    if (!exists) return;

    setActiveChatId(id);
    setMobilePanel("conversation");

    setChats((previous) =>
      previous.map((chat) =>
        chat.id === id ? { ...chat, unreadCount: 0 } : chat
      )
    );
  }

  function sendMessage(text, attachment = null) {
    const trimmed = typeof text === "string" ? text.trim() : "";

    if (trimmed.length > MAX_MESSAGE_LENGTH) return false;
    if (!trimmed && !attachment) return false;

    if (
      attachment &&
      (!attachment.name ||
        !Number.isFinite(attachment.size) ||
        attachment.size <= 0)
    ) {
      return false;
    }

    const targetChat = chats.find(
      (chat) => chat.id === activeChatId
    );

    if (!targetChat) return false;

    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    const newMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      sender: "You",
      time,
      avatar: "https://i.pravatar.cc/100?img=68",
      text: trimmed,
      own: true,
      ...(attachment ? { attachment } : {}),
    };

    setChats((previous) =>
      previous.map((chat) =>
        chat.id === targetChat.id
          ? {
              ...chat,
              time,
              preview: attachment
                ? `You: ${attachment.name}`
                : `You: ${trimmed}`,
              messages: [
                ...(Array.isArray(chat.messages) ? chat.messages : []),
                newMessage,
              ],
            }
          : chat
      )
    );

    return true;
  }

  function createChannel(name) {
    if (typeof name !== "string") {
      window.alert("Please enter a valid channel name.");
      return false;
    }

    const cleanName = name.trim().replace(/^#+/, "").trim();

    if (!cleanName) {
      window.alert("Channel name is required.");
      return false;
    }

    if (cleanName.length > MAX_CHANNEL_NAME_LENGTH) {
      window.alert("Channel name cannot exceed 50 characters.");
      return false;
    }

    if (!/^[a-zA-Z0-9][a-zA-Z0-9 _-]*$/.test(cleanName)) {
      window.alert(
        "Use letters, numbers, spaces, hyphens, or underscores."
      );
      return false;
    }

    const exists = chats.some(
      (chat) =>
        String(chat.name ?? "")
          .trim()
          .replace(/^#+/, "")
          .toLowerCase() === cleanName.toLowerCase()
    );

    if (exists) {
      window.alert("A chat or channel with this name already exists.");
      return false;
    }

    const timestamp = Date.now();

    const newChat = {
      id: `channel-${timestamp}`,
      name: cleanName,
      type: "channel",
      icon: "hash",
      preview: "Channel created",
      time: "Now",
      unreadCount: 0,
      messages: [
        {
          id: `welcome-${timestamp}`,
          sender: "TeamFlow AI",
          time: "Now",
          text: `Welcome to #${cleanName}! Start the conversation here.`,
          own: false,
        },
      ],
    };

    setChats((previous) => [...previous, newChat]);
    setActiveChatId(newChat.id);
    setActiveTab("All");
    setChatSearch("");
    setMobilePanel("conversation");

    return true;
  }

  // Delete only channels, never direct messages or group conversations.
  function deleteChannel(channelId) {
    const channel = chats.find((chat) => chat.id === channelId);

    if (!channel || channel.type !== "channel") {
      window.alert("Only channels can be deleted using this option.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete #${channel.name}?\n\n` +
        "This will remove the channel and its messages from this browser's saved chat data."
    );

    if (!confirmed) return;

    const remainingChats = chats.filter(
      (chat) => chat.id !== channelId
    );

    setChats(remainingChats);

    if (activeChatId === channelId) {
      const nextChat = remainingChats[0];

      setActiveChatId(nextChat?.id ?? "");
      setShowDetails(Boolean(nextChat));
      setMobilePanel(nextChat ? "conversation" : "list");
    }
  }

  if (!activeChat) {
    return (
      <div className="teamflow-chat">
        <AppSidebar />
        <main className="chat-main">
          <div className="chat-empty-state">
            <h2>No conversations available</h2>
            <p>Create a channel to start a new conversation.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="teamflow-chat">
      <AppSidebar />

      <main className="chat-main">
        <header className="chat-topbar">
          <button
            type="button"
            className="icon-button topbar-menu"
            aria-label="Toggle chat list"
            onClick={() =>
              setMobilePanel((current) =>
                current === "list" ? "conversation" : "list"
              )
            }
          >
            <span>⋮</span>
          </button>

          <div className="global-search">
            <Search size={19} />

            <input
              value={messageSearch}
              onChange={(event) => {
                setMessageSearch(event.target.value);
                setShowGlobalSearch(true);
              }}
              onFocus={() => setShowGlobalSearch(true)}
              placeholder="Search messages..."
              aria-label="Search messages"
            />

            {showGlobalSearch && messageSearch.trim() && (
              <div className="global-search-results">
                <div className="search-results-heading">
                  Search results ({matchingMessages.length})
                </div>

                {matchingMessages.slice(0, 10).map((message) => (
                  <button
                    type="button"
                    key={`${message.chatId}-${message.id}`}
                    className="global-result"
                    onClick={() => {
                      selectChat(message.chatId);
                      setShowGlobalSearch(false);
                    }}
                  >
                    <strong>{message.chatName}</strong>
                    <span>
                      {message.sender}: {message.text}
                    </span>
                  </button>
                ))}

                {matchingMessages.length === 0 && (
                  <p className="empty-search">
                    No matching messages.
                  </p>
                )}

                <button
                  type="button"
                  className="close-search"
                  onClick={() => {
                    setShowGlobalSearch(false);
                    setMessageSearch("");
                  }}
                >
                  Close search
                </button>
              </div>
            )}
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="icon-button"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>

            <button
              type="button"
              className="icon-button"
              aria-label="Help"
            >
              <CircleHelp size={21} />
            </button>

            <button type="button" className="workspace-account">
              <img src="https://i.pravatar.cc/100?img=68" alt="" />
              <strong>TeamFlow AI</strong>
              <ChevronDown size={17} />
            </button>
          </div>
        </header>

        <div
          className={`chat-workspace ${
            showDetails ? "" : "details-hidden"
          }`}
        >
          <div
            className={`chat-list-slot ${
              mobilePanel === "list" ? "mobile-visible" : ""
            }`}
          >
            <ChatList
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={selectChat}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              search={chatSearch}
              setSearch={setChatSearch}
              onCreateChat={createChannel}
              onDeleteChat={deleteChannel}
            />
          </div>

          <div
            className={`chat-window-slot ${
              mobilePanel === "conversation" ? "mobile-visible" : ""
            }`}
          >
            <ChatWindow
              chat={activeChat}
              onSendMessage={sendMessage}
              onToggleDetails={() =>
                setShowDetails((visible) => !visible)
              }
              onBack={() => setMobilePanel("list")}
              detailsOpen={showDetails}
            />
          </div>

          {showDetails && (
            <div className="channel-details-slot">
              <ChannelDetails
                chat={activeChat}
                onClose={() => setShowDetails(false)}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Chat;
