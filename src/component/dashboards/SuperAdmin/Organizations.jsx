
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Eye,
  Pencil,
  Ban,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  CalendarDays,
  Mail,
  Globe,
  Download,
  RotateCcw,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import "./Organizations.css";

const STORAGE_KEY = "teamflow_superadmin_organizations";

const initialOrganizations = [
  { id: "ORG-1001", name: "Acme Corporation", email: "admin@acmecorp.com", domain: "acmecorp.com", plan: "Enterprise", users: 1240, status: "Active", createdAt: "2026-10-12", color: "violet" },
  { id: "ORG-1002", name: "BrightLabs", email: "hello@brightlabs.io", domain: "brightlabs.io", plan: "Professional", users: 856, status: "Active", createdAt: "2026-10-10", color: "blue" },
  { id: "ORG-1003", name: "NovaTech Solutions", email: "team@novatech.com", domain: "novatech.com", plan: "Professional", users: 642, status: "Active", createdAt: "2026-10-08", color: "orange" },
  { id: "ORG-1004", name: "PixelCraft Studio", email: "contact@pixelcraft.co", domain: "pixelcraft.co", plan: "Starter", users: 128, status: "Pending", createdAt: "2026-10-06", color: "pink" },
  { id: "ORG-1005", name: "Vertex Digital", email: "hello@vertexdigital.io", domain: "vertexdigital.io", plan: "Enterprise", users: 1085, status: "Active", createdAt: "2026-10-03", color: "green" },
  { id: "ORG-1006", name: "CloudNine Technologies", email: "admin@cloudnine.dev", domain: "cloudnine.dev", plan: "Starter", users: 74, status: "Suspended", createdAt: "2026-09-28", color: "blue" },
  { id: "ORG-1007", name: "Orbit Creative", email: "team@orbitcreative.co", domain: "orbitcreative.co", plan: "Professional", users: 319, status: "Active", createdAt: "2026-09-22", color: "pink" },
  { id: "ORG-1008", name: "Summit Works", email: "contact@summitworks.com", domain: "summitworks.com", plan: "Starter", users: 92, status: "Pending", createdAt: "2026-09-18", color: "orange" },
  { id: "ORG-1009", name: "BluePeak Systems", email: "admin@bluepeak.io", domain: "bluepeak.io", plan: "Enterprise", users: 1530, status: "Active", createdAt: "2026-09-12", color: "violet" },
  { id: "ORG-1010", name: "Greenfield Labs", email: "hello@greenfieldlabs.com", domain: "greenfieldlabs.com", plan: "Professional", users: 247, status: "Active", createdAt: "2026-09-05", color: "green" },
];

const colors = ["violet", "blue", "orange", "pink", "green"];

const emptyForm = {
  name: "",
  email: "",
  domain: "",
  plan: "Starter",
  status: "Active",
};

const makeInitials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("");

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

function readOrganizations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to read demo organizations:", error);
  }
  return initialOrganizations;
}

function Organizations() {
  const [organizations, setOrganizations] = useState(readOrganizations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [menuId, setMenuId] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  const pageSize = 6;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(organizations));
    } catch (error) {
      console.error("Unable to save demo organizations:", error);
    }
  }, [organizations]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, planFilter]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!modal) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setModal(null);
        setFormError("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal]);

  const filteredOrganizations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return organizations.filter((org) => {
      const matchesSearch =
        !query ||
        [org.name, org.email, org.domain, org.id].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );
      const matchesStatus = statusFilter === "All" || org.status === statusFilter;
      const matchesPlan = planFilter === "All" || org.plan === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [organizations, search, statusFilter, planFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrganizations.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedOrganizations = filteredOrganizations.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const activeCount = organizations.filter((org) => org.status === "Active").length;
  const pendingCount = organizations.filter((org) => org.status === "Pending").length;
  const suspendedCount = organizations.filter((org) => org.status === "Suspended").length;
  const totalUsers = organizations.reduce((sum, org) => sum + (Number(org.users) || 0), 0);

  const notify = (message) => setToast(message);

  const openAddModal = () => {
    setForm(emptyForm);
    setFormError("");
    setMenuId(null);
    setModal({ mode: "add" });
  };

  const openEditModal = (org) => {
    setForm({
      name: org.name,
      email: org.email,
      domain: org.domain,
      plan: org.plan,
      status: org.status,
    });
    setFormError("");
    setMenuId(null);
    setModal({ mode: "edit", organization: org });
  };

  const handleFormChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    setFormError("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const domain = form.domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

    if (!name || !email || !domain) {
      setFormError("Please complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Enter a valid contact email address.");
      return;
    }

    if (!/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(domain)) {
      setFormError("Enter a valid domain, such as example.com.");
      return;
    }

    const editingId = modal.mode === "edit" ? modal.organization.id : null;
    const duplicate = organizations.some((org) =>
      org.id !== editingId &&
      (org.name.toLowerCase() === name.toLowerCase() ||
        org.email.toLowerCase() === email ||
        org.domain.toLowerCase() === domain)
    );

    if (duplicate) {
      setFormError("An organization with this name, email, or domain already exists.");
      return;
    }

    if (modal.mode === "edit") {
      setOrganizations((previous) =>
        previous.map((org) =>
          org.id === editingId
            ? { ...org, name, email, domain, plan: form.plan, status: form.status, initials: makeInitials(name) }
            : org
        )
      );
      notify(`${name} was updated in demo data.`);
    } else {
      const newOrg = {
        id: `ORG-${Date.now().toString().slice(-8)}`,
        name,
        email,
        domain,
        plan: form.plan,
        status: form.status,
        users: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        initials: makeInitials(name),
        color: colors[organizations.length % colors.length],
      };
      setOrganizations((previous) => [newOrg, ...previous]);
      setSearch("");
      setStatusFilter("All");
      setPlanFilter("All");
      setCurrentPage(1);
      notify(`${name} was added to the demo organization list.`);
    }

    setModal(null);
    setForm(emptyForm);
  };

  const toggleStatus = (org) => {
    const nextStatus = org.status === "Suspended" ? "Active" : "Suspended";
    setOrganizations((previous) =>
      previous.map((item) => item.id === org.id ? { ...item, status: nextStatus } : item)
    );
    setMenuId(null);
    notify(`${org.name} is now marked ${nextStatus.toLowerCase()} in demo data.`);
  };

  const exportOrganizations = () => {
    const headers = ["Organization ID", "Organization Name", "Contact Email", "Domain", "Plan", "Users", "Status", "Created At"];
    const rows = filteredOrganizations.map((org) => [
      org.id, org.name, org.email, org.domain, org.plan, org.users, org.status, org.createdAt,
    ]);
    const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "teamflow-organizations-demo.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    notify("Organization CSV export started.");
  };

  const resetDemoData = () => {
    if (!window.confirm("Reset organizations to the original sample data? Locally added demo organizations will be removed.")) return;
    setOrganizations(initialOrganizations);
    setSearch("");
    setStatusFilter("All");
    setPlanFilter("All");
    setCurrentPage(1);
    setMenuId(null);
    notify("Organization demo data has been reset.");
  };

  return (
    <main className="org-page" onClick={() => menuId && setMenuId(null)}>
      <header className="org-page-header">
        <div className="org-header-copy">
          <div className="org-breadcrumb">
            <span>Platform Management</span><span className="org-breadcrumb-separator">/</span><strong>Organizations</strong>
          </div>
          <div className="org-title-row">
            <div>
              <h1>Organizations</h1>
              <p>Manage the organizations registered on your TeamFlow AI platform.</p>
            </div>
            <span className="org-demo-badge"><span /> Demo environment</span>
          </div>
        </div>
        <div className="org-header-actions">
          <button type="button" className="org-button org-button-secondary" onClick={exportOrganizations}>
            <Download size={16} /> Export CSV
          </button>
          <button type="button" className="org-button org-button-primary" onClick={openAddModal}>
            <Plus size={17} /> Add organization
          </button>
        </div>
      </header>

      {toast && (
        <div className="org-toast" role="status">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
          <button type="button" aria-label="Dismiss message" onClick={() => setToast("")}><X size={16} /></button>
        </div>
      )}

      <section className="org-stats-grid" aria-label="Organization statistics">
        <article className="org-stat-card">
          <div className="org-stat-top"><span className="org-stat-icon purple"><Building2 size={20} /></span><span className="org-stat-caption">Directory</span></div>
          <p>Total organizations</p><strong>{organizations.length.toLocaleString("en-US")}</strong>
          <span className="org-stat-foot">Organizations in demo data</span>
        </article>
        <article className="org-stat-card">
          <div className="org-stat-top"><span className="org-stat-icon green"><CheckCircle2 size={20} /></span><span className="org-stat-caption">Operational</span></div>
          <p>Active organizations</p><strong>{activeCount.toLocaleString("en-US")}</strong>
          <span className="org-stat-foot">Currently marked active</span>
        </article>
        <article className="org-stat-card">
          <div className="org-stat-top"><span className="org-stat-icon orange"><CalendarDays size={20} /></span><span className="org-stat-caption">Review</span></div>
          <p>Pending organizations</p><strong>{pendingCount.toLocaleString("en-US")}</strong>
          <span className="org-stat-foot">Awaiting review in demo data</span>
        </article>
        <article className="org-stat-card">
          <div className="org-stat-top"><span className="org-stat-icon blue"><Users size={20} /></span><span className="org-stat-caption">Platform reach</span></div>
          <p>Total organization users</p><strong>{totalUsers.toLocaleString("en-US")}</strong>
          <span className="org-stat-foot">{suspendedCount} suspended organizations</span>
        </article>
      </section>

      <section className="org-table-panel">
        <div className="org-table-heading">
          <div>
            <div className="org-section-kicker"><Sparkles size={14} /> ORGANIZATION DIRECTORY</div>
            <h2>All organizations <span className="org-count-pill">{filteredOrganizations.length}</span></h2>
            <p>Review accounts, manage subscriptions, and update organization status.</p>
          </div>
          <button type="button" className="org-reset-button" onClick={resetDemoData}><RotateCcw size={15} /> Reset demo data</button>
        </div>

        <div className="org-toolbar">
          <label className="org-search">
            <Search size={18} />
            <input type="search" placeholder="Search name, email, domain or ID..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search organizations" />
            {search && <button type="button" aria-label="Clear search" onClick={() => setSearch("")}><X size={15} /></button>}
          </label>
          <label className="org-filter">
            <SlidersHorizontal size={16} />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status">
              <option value="All">All statuses</option><option value="Active">Active</option><option value="Pending">Pending</option><option value="Suspended">Suspended</option>
            </select>
          </label>
          <label className="org-filter">
            <select value={planFilter} onChange={(event) => setPlanFilter(event.target.value)} aria-label="Filter by subscription plan">
              <option value="All">All plans</option><option value="Starter">Starter</option><option value="Professional">Professional</option><option value="Enterprise">Enterprise</option>
            </select>
          </label>
        </div>

        <div className="org-table-scroll">
          <table className="org-table">
            <thead><tr><th>ORGANIZATION</th><th>SUBSCRIPTION</th><th>USERS</th><th>STATUS</th><th>CREATED</th><th><span className="org-sr-only">Actions</span></th></tr></thead>
            <tbody>
              {paginatedOrganizations.map((org) => (
                <tr key={org.id}>
                  <td>
                    <div className="org-name-cell">
                      <div className={`org-avatar ${org.color}`}>{org.initials || makeInitials(org.name)}</div>
                      <div className="org-name-info"><strong>{org.name}</strong><span>{org.email}</span><small>{org.id}</small></div>
                    </div>
                  </td>
                  <td><span className={`org-plan-tag ${org.plan.toLowerCase()}`}>{org.plan}</span></td>
                  <td><span className="org-user-count"><Users size={14} />{Number(org.users || 0).toLocaleString("en-US")}</span></td>
                  <td><span className={`org-status-tag ${org.status.toLowerCase()}`}><span />{org.status}</span></td>
                  <td className="org-date-cell">{formatDate(org.createdAt)}</td>
                  <td>
                    <div className="org-row-menu-wrap" onClick={(event) => event.stopPropagation()}>
                      <button type="button" className="org-row-menu-trigger" aria-label={`Actions for ${org.name}`} aria-expanded={menuId === org.id} onClick={() => setMenuId((current) => current === org.id ? null : org.id)}><MoreHorizontal size={19} /></button>
                      {menuId === org.id && (
                        <div className="org-row-menu">
                          <button type="button" onClick={() => { setModal({ mode: "view", organization: org }); setMenuId(null); }}><Eye size={15} /> View details</button>
                          <button type="button" onClick={() => openEditModal(org)}><Pencil size={15} /> Edit organization</button>
                          <button type="button" className={org.status === "Suspended" ? "org-menu-activate" : "org-menu-danger"} onClick={() => toggleStatus(org)}>
                            {org.status === "Suspended" ? <CheckCircle2 size={15} /> : <Ban size={15} />}
                            {org.status === "Suspended" ? "Reactivate" : "Suspend"}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedOrganizations.length === 0 && (
                <tr><td colSpan={6}>
                  <div className="org-empty-state"><div><Search size={23} /></div><strong>No organizations found</strong><p>Try changing your search or filter selections.</p><button type="button" onClick={() => { setSearch(""); setStatusFilter("All"); setPlanFilter("All"); }}>Clear all filters</button></div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="org-table-footer">
          <span>Showing {filteredOrganizations.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filteredOrganizations.length)} of {filteredOrganizations.length} organizations</span>
          <div className="org-pagination">
            <button type="button" aria-label="Previous page" disabled={safePage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}><ChevronLeft size={17} /></button>
            <span>Page {safePage} of {totalPages}</span>
            <button type="button" aria-label="Next page" disabled={safePage >= totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}><ChevronRight size={17} /></button>
          </div>
        </footer>
      </section>

      <div className="org-demo-note"><ShieldCheck size={16} /><span><strong>Demo mode:</strong> organization changes are saved in this browser only. Connect your API to manage real organizations.</span></div>

      {modal && (
        <div className="org-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) { setModal(null); setFormError(""); } }}>
          <section className={`org-modal ${modal.mode === "view" ? "org-details-modal" : ""}`} role="dialog" aria-modal="true" aria-labelledby="org-modal-title">
            <header className="org-modal-header">
              <div className="org-modal-title-icon">{modal.mode === "view" ? <Building2 size={22} /> : modal.mode === "edit" ? <Pencil size={22} /> : <Plus size={22} />}</div>
              <div><h2 id="org-modal-title">{modal.mode === "view" ? "Organization details" : modal.mode === "edit" ? "Edit organization" : "Add organization"}</h2><p>{modal.mode === "view" ? "Review account information and subscription status." : "Enter the details for this organization."}</p></div>
              <button type="button" className="org-modal-close" aria-label="Close dialog" onClick={() => { setModal(null); setFormError(""); }}><X size={19} /></button>
            </header>

            {modal.mode === "view" ? (
              <div className="org-details-content">
                <div className="org-details-identity"><div className={`org-avatar org-avatar-large ${modal.organization.color}`}>{modal.organization.initials || makeInitials(modal.organization.name)}</div><div><h3>{modal.organization.name}</h3><span>{modal.organization.id}</span></div><span className={`org-status-tag ${modal.organization.status.toLowerCase()}`}><span />{modal.organization.status}</span></div>
                <div className="org-details-grid">
                  <div className="org-detail-item"><span><Mail size={15} /> Contact email</span><strong>{modal.organization.email}</strong></div>
                  <div className="org-detail-item"><span><Globe size={15} /> Domain</span><strong>{modal.organization.domain}</strong></div>
                  <div className="org-detail-item"><span><ShieldCheck size={15} /> Subscription plan</span><strong>{modal.organization.plan}</strong></div>
                  <div className="org-detail-item"><span><Users size={15} /> Registered users</span><strong>{Number(modal.organization.users || 0).toLocaleString("en-US")}</strong></div>
                  <div className="org-detail-item"><span><CalendarDays size={15} /> Created on</span><strong>{formatDate(modal.organization.createdAt)}</strong></div>
                </div>
                <div className="org-modal-actions"><button type="button" className="org-button org-button-secondary" onClick={() => setModal(null)}>Close</button><button type="button" className="org-button org-button-primary" onClick={() => openEditModal(modal.organization)}><Pencil size={15} /> Edit organization</button></div>
              </div>
            ) : (
              <form onSubmit={handleSave}>
                {formError && <div className="org-form-error" role="alert"><AlertCircle size={16} />{formError}</div>}
                <div className="org-form-grid">
                  <label className="org-form-field org-form-full"><span>Organization name <b>*</b></span><input name="name" value={form.name} onChange={handleFormChange} placeholder="e.g. Acme Corporation" maxLength={100} required autoFocus /></label>
                  <label className="org-form-field"><span>Contact email <b>*</b></span><input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="admin@example.com" maxLength={150} required /></label>
                  <label className="org-form-field"><span>Website domain <b>*</b></span><input name="domain" value={form.domain} onChange={handleFormChange} placeholder="example.com" maxLength={253} required /></label>
                  <label className="org-form-field"><span>Subscription plan</span><select name="plan" value={form.plan} onChange={handleFormChange}><option>Starter</option><option>Professional</option><option>Enterprise</option></select></label>
                  <label className="org-form-field"><span>Organization status</span><select name="status" value={form.status} onChange={handleFormChange}><option>Active</option><option>Pending</option><option>Suspended</option></select></label>
                </div>
                <div className="org-modal-actions"><button type="button" className="org-button org-button-secondary" onClick={() => { setModal(null); setFormError(""); }}>Cancel</button><button type="submit" className="org-button org-button-primary">{modal.mode === "edit" ? <><CheckCircle2 size={16} /> Save changes</> : <><Plus size={16} /> Add organization</>}</button></div>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default Organizations;
