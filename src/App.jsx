
import {
  UsersRound,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2
} from "lucide-react";
import React from "react";
import "./App.css";

function Logo() {
  return (
    <div className="logo-container">
      <div className="logo-icon">
        <UsersRound size={27} />
      </div>

      <span className="logo-text">
        TeamFlow <span className="logo-ai">AI</span>
      </span>
    </div>
  );
}

function Navbar() {
  return (
    <header className="navbar">
      <a href="#home" className="logo-link">
        <Logo />
      </a>

      <nav className="nav-links">
        <a className="nav-link active" href="#home">
          Home
        </a>

        <a className="nav-link" href="#features">
          Features
        </a>

        <a className="nav-link" href="#how-it-works">
          How it Works
        </a>

        <a className="nav-link" href="#pricing">
          Pricing
        </a>

        <a className="nav-link" href="#about">
          About
        </a>
      </nav>

      <div className="nav-buttons">
        <button className="login-button">
          Login
        </button>

        <button className="get-started-button">
          Get Started
        </button>
      </div>
    </header>
  );
}


function Hero() {
  return (
    <section className="hero-section" id="home">
      {/* Left content */}
      <div className="hero-content">

        <div className="hero-badge">
          <Sparkles size={17} />
          <span>AI-Powered Team Collaboration</span>
        </div>

        <h1 className="hero-title">
          Turn Team
          <br />
          Conversations
          <br />
          into <span>Real Progress</span>
        </h1>

        <p className="hero-description">
          TeamFlow AI helps your team chat, assign tasks,
          track work and solve bugs — all in one simple
          platform with the power of AI.
        </p>

        <div className="hero-buttons">
          <button
            className="hero-primary-button"
            onClick={() => alert("Welcome to TeamFlow AI!")}
          >
            Get Started Free
            <ArrowRight size={19} />
          </button>

          <button
            className="hero-demo-button"
            onClick={() => alert("TeamFlow AI demo coming soon!")}
          >
            <span className="play-circle">
              <Play size={13} fill="currentColor" />
            </span>
            Watch Demo
          </button>
        </div>

        <div className="hero-trust">
          <span>
            <CheckCircle2 size={17} />
            Easy to use
          </span>

          <span>
            <CheckCircle2 size={17} />
            AI-powered
          </span>

          <span>
            <CheckCircle2 size={17} />
            Built for Teams
          </span>
        </div>

      </div>

      {/* Right content */}
      <div className="hero-dashboard">
        <div className="dashboard-placeholder">
          <div className="dashboard-top">
            <div className="dashboard-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span>TeamFlow AI Dashboard</span>
          </div>

          <div className="dashboard-body">
            <aside className="dashboard-sidebar">
              <div className="dashboard-logo">
                <UsersRound size={20} />
                <span>TeamFlow</span>
              </div>

              <div className="dashboard-menu active">
                ◈ &nbsp; Home
              </div>
              <div className="dashboard-menu">
                ▤ &nbsp; Chat
              </div>
              <div className="dashboard-menu">
                ✓ &nbsp; Tasks
              </div>
              <div className="dashboard-menu">
                ◉ &nbsp; Bugs
              </div>
              <div className="dashboard-menu">
                ▦ &nbsp; Calendar
              </div>
              <div className="dashboard-menu">
                ♙ &nbsp; Team
              </div>
            </aside>

            <div className="dashboard-main">
              <div className="dashboard-greeting">
                <h3>Good Morning, John! 👋</h3>
                <p>Here's what's happening with your team today.</p>
              </div>

              <div className="dashboard-stats">
                <div className="dashboard-stat">
                  <span>Total Tasks</span>
                  <strong>8</strong>
                </div>

                <div className="dashboard-stat">
                  <span>In Progress</span>
                  <strong>4</strong>
                </div>

                <div className="dashboard-stat">
                  <span>Completed</span>
                  <strong>2</strong>
                </div>
              </div>

              <div className="dashboard-task-card">
                <h4>Recent Tasks</h4>

                <div className="dashboard-task">
                  <span className="task-check">✓</span>
                  <span>Design login page</span>
                  <span className="task-status progress">
                    In Progress
                  </span>
                </div>

                <div className="dashboard-task">
                  <span className="task-check">✓</span>
                  <span>Develop chat module</span>
                  <span className="task-status pending">
                    Pending
                  </span>
                </div>

                <div className="dashboard-task">
                  <span className="task-check">✓</span>
                  <span>Integrate AI summary</span>
                  <span className="task-status progress">
                    In Progress
                  </span>
                </div>
              </div>

              <div className="dashboard-ai-card">
                <Sparkles size={19} />
                <div>
                  <strong>AI Team Summary</strong>
                  <p>Your team completed 2 tasks today.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function Features() {
  const features = [
    {
      icon: "💬",
      title: "Team Chat",
      description:
        "Bring all your team conversations together in one place. Share updates, discuss ideas, and stay connected.",
      color: "blue",
    },
    {
      icon: "✓",
      title: "Smart Task Management",
      description:
        "Create tasks, assign responsibilities, set priorities, and track project progress with ease.",
      color: "green",
    },
    {
      icon: "✦",
      title: "AI Assistant",
      description:
        "Summarize conversations, find important updates, and turn discussions into actionable next steps.",
      color: "purple",
    },
    {
      icon: "⚙",
      title: "Bug Tracking",
      description:
        "Report issues, organize bugs by priority, and help your team resolve problems faster.",
      color: "orange",
    },
    {
      icon: "▦",
      title: "Project Planning",
      description:
        "Keep project milestones, deadlines, and team responsibilities organized in one workspace.",
      color: "pink",
    },
    {
      icon: "↗",
      title: "Progress Insights",
      description:
        "Get a clear overview of completed tasks, ongoing work, and what your team should focus on next.",
      color: "cyan",
    },
  ];

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <div className="features-heading">
          <span className="features-label">
            POWERFUL FEATURES
          </span>

          <h2>
            Everything Your Team Needs
            <br />
            <span>To Work Smarter</span>
          </h2>

          <p>
            One powerful workspace to collaborate, manage tasks,
            track bugs, and achieve more with AI.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <article
              className="feature-card"
              key={feature.title}
              style={{ "--card-index": index }}
            >
              <div className={`feature-icon ${feature.color}`}>
                <span>{feature.icon}</span>
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

              <a href="#how-it-works" className="feature-link">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


function HowItWorks() {

  const steps = [
    {
      number: "01",
      icon: "👥",
      image: "/images/team-collaboration.png",
      title: "Create Your Workspace",
      description:
        "Set up your workspace and invite your teammates. Bring conversations, projects, and people together in one place.",
    },
    {
      number: "02",
      icon: "✓",
      image: "/images/task-management.png",
      title: "Organize Your Work",
      description:
        "Create tasks, assign responsibilities, track bugs, and keep everyone aligned on priorities and deadlines.",
    },
    {
      number: "03",
      icon: "✦",
      image: "/images/ai-assistant.png",
      title: "Make Progress with AI",
      description:
        "Let AI summarize discussions, highlight important updates, and help your team decide what to do next.",
    },
  ];

  return (
    <section className="how-section" id="how-it-works">
      <div className="how-container">
        <div className="how-heading">
          <span className="how-label">HOW IT WORKS</span>

          <h2>
            From Teamwork to
            <br />
            <span>Real Results</span>
          </h2>

          <p>
            Getting your team organized shouldn't be complicated.
            Start collaborating in three simple steps.
          </p>
        </div>

        <div className="how-steps">
          {steps.map((step, index) => (

            <article className="how-step" key={step.number}>
              <div className="how-number-wrap">
                <span className="how-number">{step.number}</span>
              </div>

              <div className="how-image-wrap">
                <img
                  className="how-card-image"
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                />
              </div>

              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>

          ))}
        </div>

        <div className="how-bottom">
          <p>Less busywork. More meaningful progress.</p>
          <a className="how-cta" href="#home">
            Explore TeamFlow AI <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </section>
  );
}



function Pricing() {
  const [billing, setBilling] = React.useState("monthly");

  const plans = [
    {
      name: "Free",
      description: "Explore the essentials and get organized.",
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      period: "forever",
      features: [
        "Up to 3 team members",
        "2 active projects",
        "Basic task management",
        "Community support",
      ],
      button: "Get started free",
      featured: false,
    },
    {
      name: "Pro",
      description: "Everything your growing team needs.",
      monthlyPrice: "$12",
      yearlyPrice: "$9",
      period: "per user / month",
      features: [
        "Unlimited team members",
        "Unlimited projects",
        "AI task suggestions",
        "Smart project summaries",
        "Advanced analytics",
        "Priority support",
      ],
      button: "Start your Pro plan",
      featured: true,
    },
    {
      name: "Enterprise",
      description: "Advanced collaboration for larger teams.",
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      period: "tailored to your team",
      features: [
        "Everything in Pro",
        "Advanced admin controls",
        "Custom workflows",
        "Dedicated support",
        "Flexible team onboarding",
        "Custom integrations",
      ],
      button: "Contact sales",
      featured: false,
    },
  ];

  const comparison = [
    ["Team members", "Up to 3", "Unlimited", "Custom"],
    ["Active projects", "2", "Unlimited", "Unlimited"],
    ["Task management", "Basic", "Advanced", "Advanced"],
    ["AI task suggestions", "—", "Included", "Included"],
    ["Project summaries", "—", "Included", "Included"],
    ["Advanced analytics", "—", "Included", "Included"],
    ["Admin controls", "Basic", "Advanced", "Custom"],
    ["Support", "Community", "Priority", "Dedicated"],
  ];

  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-container">
        <div className="pricing-heading">
          <span className="pricing-eyebrow">SIMPLE, TRANSPARENT PRICING</span>
          <h2>Choose a plan that grows with you.</h2>
          <p>
            Start free, unlock the power of AI, and help your team do its best
            work.
          </p>

          <div className="billing-switch" aria-label="Billing frequency">
            <button
              className={billing === "monthly" ? "active" : ""}
              onClick={() => setBilling("monthly")}
              aria-pressed={billing === "monthly"}
            >
              Monthly
            </button>
            <button
              className={billing === "yearly" ? "active" : ""}
              onClick={() => setBilling("yearly")}
              aria-pressed={billing === "yearly"}
            >
              Yearly <span className="save-label">Save 25%</span>
            </button>
          </div>
          <p className="billing-note">
            {billing === "yearly"
              ? "Yearly billing selected. Prices shown per user, per month."
              : "No commitment. Change your plan whenever you need."}
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <article
              className={`pricing-card ${plan.featured ? "featured" : ""}`}
              key={plan.name}
            >
              {plan.featured && (
                <div className="popular-badge">✦ MOST POPULAR</div>
              )}

              <div className="plan-top">
                <h3>{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-price">
                <span className="price-amount">
                  {billing === "yearly"
                    ? plan.yearlyPrice
                    : plan.monthlyPrice}
                </span>
                <span className="price-period">{plan.period}</span>
              </div>

              {plan.name === "Pro" && (
                <p className="plan-billing-detail">
                  {billing === "yearly"
                    ? "Billed annually"
                    : "Billed monthly"}
                </p>
              )}

              <button
                className={`plan-button ${
                  plan.featured ? "primary-button" : "secondary-button"
                }`}
                onClick={() => {
                  if (plan.name === "Enterprise") {
                    alert("Connect this button to your sales contact form.");
                  } else {
                    alert(`Connect the ${plan.name} plan to your signup flow.`);
                  }
                }}
              >
                {plan.button} <span aria-hidden="true">→</span>
              </button>

              <div className="plan-divider" />

              <p className="feature-list-title">What's included</p>
              <ul className="plan-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <span className="feature-check" aria-hidden="true">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="comparison-heading">
          <span className="pricing-eyebrow">PLAN DETAILS</span>
          <h3>Compare every feature</h3>
          <p>Find the right set of tools for the way your team works.</p>
        </div>

        <div className="comparison-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col">Features</th>
                <th scope="col">Free</th>
                <th scope="col" className="pro-column">Pro ✦</th>
                <th scope="col">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) =>
                    index === 0 ? (
                      <th scope="row" key={index}>{cell}</th>
                    ) : (
                      <td
                        key={index}
                        className={index === 2 ? "pro-column" : ""}
                      >
                        {cell === "Included" ? (
                          <span className="comparison-check">✓</span>
                        ) : (
                          cell
                        )}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="pricing-footer-note">
          Need help choosing? Pick the plan that best fits your team today.
        </p>
      </div>
    </section>
  );
}




function About() {
  const values = [
    {
      number: "01",
      title: "Clarity by design",
      description:
        "Turn scattered tasks and competing priorities into a clear, shared plan everyone can follow.",
    },
    {
      number: "02",
      title: "AI with a purpose",
      description:
        "Use intelligent assistance to reduce repetitive work and make space for thoughtful decisions.",
    },
    {
      number: "03",
      title: "Progress together",
      description:
        "Keep people aligned around shared goals, visible progress, and the next meaningful step.",
    },
  ];

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-hero">
          <div className="about-copy">
            <span className="about-eyebrow">
              <span className="about-eyebrow-dot" />
              GET TO KNOW TEAMFLOW AI
            </span>

            <h2>
              Better teamwork.
              <span>Less busywork.</span>
            </h2>

            <p className="about-lead">
              Work should move people forward, not bury them in processes.
            </p>

            <p className="about-description">
              TeamFlow AI brings projects, tasks, and intelligent assistance
              into one connected workspace. We’re building a simpler way for
              teams to stay aligned, make informed decisions, and focus on work
              that matters.
            </p>

            <a className="about-link" href="#features">
              Explore the platform <span aria-hidden="true">↗</span>
            </a>

            <div className="about-proof">
              <span className="about-proof-line" />
              <span>One workspace. A clearer way forward.</span>
            </div>
          </div>

          <div className="about-visual">
            <div className="about-visual-glow" />

            <div className="about-product-window">
              <div className="about-window-header">
                <div className="about-window-brand">
                  <span className="about-window-logo">T</span>
                  <span>Team workspace</span>
                </div>
                <span className="about-window-status">
                  <span /> In sync
                </span>
              </div>

              <div className="about-window-content">
                <div className="about-window-welcome">
                  <div>
                    <span className="about-window-kicker">YOUR OVERVIEW</span>
                    <h3>Good work is moving.</h3>
                  </div>
                  <span className="about-window-sparkle">✦</span>
                </div>

                <div className="about-work-card">
                  <div className="about-work-icon about-icon-purple">↗</div>
                  <div className="about-work-info">
                    <strong>Website redesign</strong>
                    <span>Design team · In progress</span>
                  </div>
                  <span className="about-work-percent">85%</span>
                  <div className="about-work-track">
                    <span style={{ width: "85%" }} />
                  </div>
                </div>

                <div className="about-work-card">
                  <div className="about-work-icon about-icon-blue">◈</div>
                  <div className="about-work-info">
                    <strong>Product launch</strong>
                    <span>Product team · In progress</span>
                  </div>
                  <span className="about-work-percent">65%</span>
                  <div className="about-work-track">
                    <span style={{ width: "65%" }} />
                  </div>
                </div>

                <div className="about-ai-card">
                  <div className="about-ai-icon">✦</div>
                  <div>
                    <span className="about-ai-label">TEAMFLOW AI</span>
                    <strong>Keep your next step clear.</strong>
                    <p>
                      Bring priorities and project progress into one view.
                    </p>
                  </div>
                </div>

                <div className="about-window-footer">
                  <span><i className="about-status-dot" /> Projects organized</span>
                  <span>Workspace preview</span>
                </div>
              </div>
            </div>

            <div className="about-floating-note">
              <span className="about-note-check">✓</span>
              <div>
                <strong>Less friction</strong>
                <span>More room to focus</span>
              </div>
            </div>
          </div>
        </div>

        <div className="about-values">
          <div className="about-values-heading">
            <span className="about-eyebrow">WHAT GUIDES US</span>
            <h3>Thoughtful tools. Better ways to work.</h3>
            <p>
              Everything starts with making collaboration simpler for people.
            </p>
          </div>

          <div className="about-values-grid">
            {values.map((value) => (
              <article className="about-value-card" key={value.number}>
                <div className="about-value-top">
                  <span className="about-value-number">{value.number}</span>
                  <span className="about-value-arrow" aria-hidden="true">↗</span>
                </div>
                <h4>{value.title}</h4>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" id="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="footer-logo" href="#home" aria-label="TeamFlow AI home">
              <span className="footer-logo-mark">T</span>
              <span className="footer-logo-name">
                TeamFlow <strong>AI</strong>
              </span>
            </a>

            <p className="footer-description">
              Bring your people, projects, and priorities together.
              Work smarter, collaborate better, and make progress every day.
            </p>

            <a className="footer-contact-email" href="mailto:hello@yourcompany.com">
              hello@yourcompany.com
            </a>

            <div className="footer-socials">
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                in
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
                ig
              </a>
              <a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X">
                𝕏
              </a>
            </div>
          </div>

          <nav className="footer-links" aria-label="Product links">
            <h3>Product</h3>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Pricing</a>
          </nav>

          <nav className="footer-links" aria-label="Company links">
            <h3>Company</h3>
            <a href="#about">About us</a>
            <a href="mailto:hello@yourcompany.com">Contact us</a>
          </nav>

          <div className="footer-newsletter">
            <h3>Make work flow better.</h3>
            <p>
              Ready to bring your team together? Explore our plans and find
              the right fit.
            </p>
            <a className="footer-cta" href="#pricing">
              Explore plans <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} TeamFlow AI. All rights reserved.</p>

          <div className="footer-legal-links">
            <a href="mailto:hello@yourcompany.com?subject=Privacy%20Policy">
              Privacy
            </a>
            <a href="mailto:hello@yourcompany.com?subject=Terms%20of%20Service">
              Terms
            </a>
          </div>

          <a className="footer-back-top" href="#home">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}





function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <About/>
        <Footer/>
      </main>
    </>
  );
}

export default App;



