
import React, { useEffect, useMemo, useState } from "react";
import { Search, Bell, CircleHelp, ChevronDown } from "lucide-react";

import "./Chat.css";
import { initialChats, normalizeChats } from "./chatData";
import AppSidebar from "./AppSidebar.jsx";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import ChannelDetails from "./ChannelDetails";

const STORAGE_KEY = "teamflow-ai-chats-v1";

function loadChats() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return normalizeChats(saved ? JSON.parse(saved) : initialChats);
  } catch {
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
    chats.find((chat) => chat.id === activeChatId) ?? chats[0];

  const matchingMessages = useMemo(() => {
    const query = messageSearch.trim().toLowerCase();
    if (!query) return [];

    return chats.flatMap((chat) =>
      chat.messages
        .filter((message) => message.text.toLowerCase().includes(query))
        .map((message) => ({
          ...message,
          chatId: chat.id,
          chatName: chat.name,
        }))
    );
  }, [chats, messageSearch]);

  function selectChat(id) {
    setActiveChatId(id);
    setMobilePanel("conversation");

    setChats((previous) =>
      previous.map((chat) =>
        chat.id === id ? { ...chat, unreadCount: 0 } : chat
      )
    );
  }

  function sendMessage(text, attachment = null) {
    const trimmed = text.trim();
    if (!trimmed && !attachment) return;

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
        chat.id === activeChatId
          ? {
              ...chat,
              time,
              preview: attachment
                ? `You: ${attachment.name}`
                : `You: ${trimmed}`,
              messages: [...chat.messages, newMessage],
            }
          : chat
      )
    );
  }

  function createChannel(name) {
    const cleanName = name.trim().replace(/^#+/, "");
    if (!cleanName) return;

    const exists = chats.some(
      (chat) => chat.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (exists) {
      window.alert("A chat or channel with this name already exists.");
      return;
    }

    const newChat = {
      id: `channel-${Date.now()}`,
      name: cleanName,
      type: "channel",
      icon: "hash",
      preview: "Channel created",
      time: "Now",
      unreadCount: 0,
      messages: [
        {
          id: `welcome-${Date.now()}`,
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
  }

  if (!activeChat) {
    return <div className="teamflow-chat">No chats available.</div>;
  }

  return (
    <div className="teamflow-chat">
      <AppSidebar />

      <main className="chat-main">
        <header className="chat-topbar">
          <button
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
                    key={`${message.chatId}-${message.id}`}
                    className="global-result"
                    onClick={() => {
                      selectChat(message.chatId);
                      setShowGlobalSearch(false);
                    }}
                  >
                    <strong>{message.chatName}</strong>
                    <span>{message.sender}: {message.text}</span>
                  </button>
                ))}

                {matchingMessages.length === 0 && (
                  <p className="empty-search">No matching messages.</p>
                )}

                <button
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
            <button className="icon-button" aria-label="Notifications">
              <Bell size={20} />
            </button>
            <button className="icon-button" aria-label="Help">
              <CircleHelp size={21} />
            </button>
            <button className="workspace-account">
              <img src="https://i.pravatar.cc/100?img=68" alt="" />
              <strong>TeamFlow AI</strong>
              <ChevronDown size={17} />
            </button>
          </div>
        </header>

        <div className={`chat-workspace ${showDetails ? "" : "details-hidden"}`}>
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
              onToggleDetails={() => setShowDetails((visible) => !visible)}
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
