import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Copy,
  FileText,
  Lightbulb,
  Plus,
  Send,
  Sparkles,
  Target,
  Users,
  WandSparkles,
} from "lucide-react";
import "./AiAssistant.css";

const STARTERS = [
  {
    icon: BarChart3,
    title: "Summarize team progress",
    description: "Get a quick read on delivery, blockers, and momentum.",
    prompt: "Summarize my team's progress this week",
    tone: "violet",
  },
  {
    icon: ClipboardList,
    title: "Plan the next sprint",
    description: "Turn team priorities into a clear sprint outline.",
    prompt: "Help me plan the next sprint",
    tone: "blue",
  },
  {
    icon: Target,
    title: "Spot project risks",
    description: "Find areas that may need a little extra attention.",
    prompt: "Which projects need attention right now?",
    tone: "amber",
  },
];

const INITIAL_MESSAGES = [
  {
    id: "welcome",
    role: "assistant",
    time: "Just now",
    text: "Hi Priya! I'm your TeamFlow assistant. I can help you get a quick read on team progress, plan work, and think through project priorities. What would you like to work on?",
  },
];

let messageSequence = 0;

function createMessageId(prefix) {
  messageSequence += 1;
  return `${prefix}-${messageSequence}`;
}

function makeReply(prompt) {
  const query = prompt.toLowerCase();

  if (query.includes("risk") || query.includes("attention") || query.includes("block")) {
    return {
      intro: "Here are a few areas worth checking based on the current team snapshot:",
      bullets: [
        "Backend API is at 54% progress and marked at risk. Confirm the next milestone and whether the team needs support.",
        "There are 6 open bugs. Review the high-priority items before committing to additional sprint work.",
        "Check in with owners of overdue tasks so small blockers do not become delivery risks.",
      ],
      close: "A short owner check-in can help turn these into clear next steps.",
    };
  }

  if (query.includes("sprint") || query.includes("plan")) {
    return {
      intro: "A practical starting point for your next sprint:",
      bullets: [
        "Start with the highest-priority bug fixes and any work blocking other teammates.",
        "Reserve focused capacity for the Website Redesign and Mobile App milestones.",
        "Keep a small buffer for reviews and unexpected work; confirm ownership before kickoff.",
      ],
      close: "Would you like to turn one of these priorities into a more detailed checklist?",
    };
  }

  if (query.includes("progress") || query.includes("summar")) {
    return {
      intro: "Here's a concise snapshot of your team's recent momentum:",
      bullets: [
        "128 of 164 tasks are complete, for a 78% completion rate.",
        "The team resolved 31 bugs during the selected period.",
        "Backend API is the main project to watch at 54% progress; the other projects are tracking well.",
      ],
      close: "These figures are dashboard sample data. Use them as a starting point for your team check-in.",
    };
  }

  return {
    intro: "Let's break that down into a few useful next steps:",
    bullets: [
      "Clarify the outcome you want and who needs to be involved.",
      "Check current tasks and project milestones for related work.",
      "Agree on one measurable next action and assign an owner.",
    ],
    close: "Share a little more context and I can help shape a more focused plan.",
  };
}

export default function AiAssistant() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [notice, setNotice] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const responseTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(responseTimer.current), []);

  function sendPrompt(value = draft) {
    const prompt = value.trim();
    if (!prompt || isThinking) return;

    const userMessage = {
      id: createMessageId("user"),
      role: "user",
      time: "Just now",
      text: prompt,
    };

    setMessages(previous => [...previous, userMessage]);
    setDraft("");
    setNotice("");
    setIsThinking(true);

    responseTimer.current = window.setTimeout(() => {
      setMessages(previous => [
        ...previous,
        {
          id: createMessageId("assistant"),
          role: "assistant",
          time: "Just now",
          ...makeReply(prompt),
        },
      ]);
      setIsThinking(false);
    }, 650);
  }

  function startNewChat() {
    window.clearTimeout(responseTimer.current);
    setMessages(INITIAL_MESSAGES);
    setDraft("");
    setNotice("");
    setIsThinking(false);
    setCopiedId("");
  }

  async function copyMessage(message) {
    const text = [message.text, ...(message.bullets ?? []), message.close]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(message.id);
      setNotice("Assistant response copied.");
      window.setTimeout(() => setCopiedId(""), 1800);
    } catch (error) {
      console.error("Could not copy assistant response:", error);
      setNotice("Could not copy the response. Check clipboard permissions and try again.");
    }
  }

  return (
    <section className="tl-ai-page" aria-label="TeamFlow AI Assistant">
      <header className="tl-ai-topbar">
        <div className="tl-ai-workspace">
          <span className="tl-ai-workspace-icon">TW</span>
          <span><b>TeamFlow Workspace</b><small>Product Team</small></span>
          <ChevronDown size={15} />
        </div>
        <span className="tl-ai-topbar-spacer" />
        <span className="tl-ai-secure"><CheckCircle2 size={14} /> Your workspace assistant</span>
        <button type="button" className="tl-ai-help" aria-label="Assistant help"><CircleHelp size={18} /></button>
      </header>

      <div className="tl-ai-layout">
        <main className="tl-ai-main">
          <section className="tl-ai-hero">
            <div className="tl-ai-hero-glow" aria-hidden="true" />
            <span className="tl-ai-hero-icon"><Sparkles size={22} /></span>
            <span className="tl-ai-eyebrow">YOUR TEAM'S THINKING PARTNER</span>
            <h1>Good afternoon, Priya <span>✨</span></h1>
            <p>Make space for the important work. Get help turning team context into clear next steps.</p>
            <div className="tl-ai-hero-meta">
              <span><i /> Assistant ready</span>
              <span><Users size={14} /> Connected to Product Team</span>
            </div>
          </section>

          {messages.length === 1 && (
            <section className="tl-ai-starters" aria-label="Suggested prompts">
              <div className="tl-ai-section-heading">
                <div><span>QUICK START</span><h2>What can I help with?</h2></div>
                <WandSparkles size={18} />
              </div>
              <div className="tl-ai-starter-grid">
                {STARTERS.map(({ icon: Icon, title, description, prompt, tone }) => (
                  <button type="button" className="tl-ai-starter" key={title} onClick={() => sendPrompt(prompt)}>
                    <span className={`tl-ai-starter-icon ${tone}`}><Icon size={18} /></span>
                    <b>{title}</b>
                    <small>{description}</small>
                    <ArrowRight className="tl-ai-starter-arrow" size={16} />
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="tl-ai-chat-card" aria-label="Assistant conversation">
            <header className="tl-ai-chat-heading">
              <span className="tl-ai-bot-mark"><Bot size={18} /></span>
              <div><b>TeamFlow Assistant</b><small><i /> Ready to help</small></div>
              <button type="button" onClick={startNewChat}><Plus size={15} /> New chat</button>
            </header>

            <div className="tl-ai-messages" aria-live="polite">
              {messages.map(message => (
                <article className={`tl-ai-message ${message.role}`} key={message.id}>
                  {message.role === "assistant" && <span className="tl-ai-message-avatar"><Sparkles size={15} /></span>}
                  <div className="tl-ai-message-content">
                    <div className="tl-ai-message-meta">
                      <b>{message.role === "assistant" ? "TeamFlow AI" : "You"}</b>
                      <time>{message.time}</time>
                    </div>
                    <div className="tl-ai-bubble">
                      {message.text && <p>{message.text}</p>}
                      {message.bullets && <ul>{message.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
                      {message.close && <p>{message.close}</p>}
                    </div>
                    {message.role === "assistant" && (
                      <button type="button" className="tl-ai-copy" onClick={() => copyMessage(message)}>
                        {copiedId === message.id ? <Check size={13} /> : <Copy size={13} />}
                        {copiedId === message.id ? "Copied" : "Copy response"}
                      </button>
                    )}
                  </div>
                </article>
              ))}
              {isThinking && (
                <div className="tl-ai-thinking" role="status">
                  <span className="tl-ai-message-avatar"><Sparkles size={15} /></span>
                  <span>Thinking through your team context <i /><i /><i /></span>
                </div>
              )}
            </div>

            <form className="tl-ai-composer" onSubmit={event => { event.preventDefault(); sendPrompt(); }}>
              <textarea
                value={draft}
                onChange={event => setDraft(event.target.value)}
                onKeyDown={event => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendPrompt();
                  }
                }}
                placeholder="Ask about team progress, project priorities, or what to do next..."
                aria-label="Ask the TeamFlow assistant"
                rows={2}
              />
              <div className="tl-ai-composer-footer">
                <span><Lightbulb size={14} /> AI responses are suggestions. Review before sharing.</span>
                <button type="submit" disabled={!draft.trim() || isThinking} aria-label="Send prompt"><Send size={16} /><span>Ask AI</span><ArrowUp size={13} /></button>
              </div>
            </form>
          </section>
          {notice && <p className="tl-ai-notice" role="status">{notice}</p>}
        </main>

        <aside className="tl-ai-aside">
          <section className="tl-ai-aside-card tl-ai-tip-card">
            <span className="tl-ai-aside-icon"><Lightbulb size={18} /></span>
            <span className="tl-ai-aside-label">A GOOD PLACE TO START</span>
            <h2>Turn a busy week into a clear plan</h2>
            <p>Ask for a summary, identify blockers, or create a practical agenda for your next team sync.</p>
            <button type="button" onClick={() => sendPrompt("Help me prepare an agenda for my next team sync")}>Build a meeting agenda <ArrowRight size={15} /></button>
          </section>

          <section className="tl-ai-aside-card tl-ai-context-card">
            <div className="tl-ai-context-heading"><span><BarChart3 size={16} /></span><div><b>Team snapshot</b><small>Context for your assistant</small></div></div>
            <div className="tl-ai-context-row"><span>Tasks completed</span><b>128 <i><ArrowUp size={12} /> 12%</i></b></div>
            <div className="tl-ai-context-row"><span>Open bugs</span><b>6 <em>Needs review</em></b></div>
            <div className="tl-ai-context-row"><span>Projects on track</span><b>3 of 4</b></div>
            <div className="tl-ai-context-note"><CheckCircle2 size={14} /> Based on your team dashboard</div>
          </section>

          <section className="tl-ai-aside-card tl-ai-privacy">
            <span><CheckCircle2 size={16} /></span>
            <div><b>Built for your workspace</b><p>Keep conversations focused on your team's work. Avoid sharing sensitive personal information.</p></div>
          </section>
          <div className="tl-ai-feedback"><span>Was this helpful?</span><button type="button" aria-label="Helpful"><ArrowUp size={14} /></button><button type="button" aria-label="Not helpful"><ArrowDown size={14} /></button><FileText size={14} /></div>
        </aside>
      </div>
    </section>
  );
}
