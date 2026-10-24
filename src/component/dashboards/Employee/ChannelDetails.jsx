
import React from "react";
import {
  X, Users, CalendarDays, Plus, FileText, Palette,
  FileSpreadsheet, Pin, ArrowUpRight
} from "lucide-react";

import { teamMembers, sharedFiles } from "./chatData";

function ChannelDetails({ chat, onClose }) {
  const fileIcons = {
    pdf: FileText,
    design: Palette,
    sheet: FileSpreadsheet,
  };

  return (
    <aside className="channel-details">
      <header className="details-header">
        <h2>Channel Details</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close channel details"
        >
          <X size={22} />
        </button>
      </header>

      <div className="details-channel-summary">
        <div className="details-channel-icon">
          {chat.type === "direct" ? <Users size={29} /> : "#"}
        </div>

        <div>
          <h3>{chat.name}</h3>
          <p>{chat.type === "direct" ? "Direct message" : "Team discussion"}</p>
        </div>
      </div>

      <p className="channel-description">{chat.description}</p>

      <div className="channel-facts">
        <div>
          <Users size={18} />
          <span>{chat.members} Members</span>
        </div>
        <div>
          <CalendarDays size={18} />
          <span>Created on Oct 1, 2024</span>
        </div>
      </div>

      <section className="details-section">
        <div className="details-section-heading">
          <h3>Members ({chat.members})</h3>
          <button onClick={() => window.alert("Full member list coming next.")}>
            View all
          </button>
        </div>

        {teamMembers.map((member) => (
          <div className="member-row" key={member.name}>
            <img src={member.avatar} alt="" />
            <strong>{member.name}</strong>
            <span className={`member-role ${member.role === "Admin" ? "admin-role" : ""}`}>
              {member.role}
            </span>
          </div>
        ))}

        <button
          className="add-members-button"
          onClick={() => window.alert("Add members form coming next.")}
        >
          <Plus size={17} />
          Add members
        </button>
      </section>

      <section className="details-section">
        <div className="details-section-heading">
          <h3>Shared Files</h3>
          <button onClick={() => window.alert("All shared files coming next.")}>
            View all
          </button>
        </div>

        {sharedFiles.map((file) => {
          const Icon = fileIcons[file.icon] || FileText;

          return (
            <button
              className="shared-file-row"
              key={file.name}
              onClick={() => window.alert(`${file.name}: demo file`)}
            >
              <span className={`shared-file-icon ${file.icon}`}>
                <Icon size={21} />
              </span>
              <span className="shared-file-copy">
                <strong>{file.name}</strong>
                <small>{file.meta}</small>
              </span>
              <ArrowUpRight size={15} className="file-open-icon" />
            </button>
          );
        })}
      </section>

      <section className="details-section pinned-messages-section">
        <div className="details-section-heading">
          <h3>Pinned Messages</h3>
          <button onClick={() => window.alert("All pinned messages coming next.")}>
            View all
          </button>
        </div>

        <div className="pinned-message">
          <img src="https://i.pravatar.cc/100?img=47" alt="" />
          <div>
            <div className="pinned-message-meta">
              <strong>Sarah Wilson</strong>
              <small>Oct 15</small>
            </div>
            <p>Let's maintain this channel for all important updates. 📌</p>
          </div>
          <Pin size={15} className="pinned-indicator" />
        </div>
      </section>
    </aside>
  );
}

export default ChannelDetails;
