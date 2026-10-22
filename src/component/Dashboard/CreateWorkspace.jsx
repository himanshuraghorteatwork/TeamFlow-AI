import './CreateWorkspace.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, FileText, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

const avatars = [
  { label: '▦', color: 'av-purple', name: 'Grid' },
  { label: 'A', color: 'av-blue',   name: 'A' },
  { label: 'T', color: 'av-yellow', name: 'T' },
  { label: 'S', color: 'av-pink',   name: 'S' },
  { label: 'D', color: 'av-red',    name: 'D' },
  { label: '+', color: 'av-white',  name: 'Monogram' },
];

function createSlug(value) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 40).replace(/-+$/g, '') || 'your-workspace';
}

function Sidebar({ step }) {
  const steps = ['Create Workspace', 'Choose Role', 'Invite Team'];
  return (
    <aside className="sidebar">
      <Link to="/" className="logo">
        <span className="logo-icon"><Users size={18} /></span>
        TeamFlow AI
      </Link>
      <div className="sidebar-steps">
        {steps.map((s, i) => (
          <div key={s} className={`sidebar-step ${i + 1 === step ? 'active' : i + 1 < step ? 'done' : ''}`}>
            <span className="sidebar-step-num">
              {i + 1 < step ? <CheckCircle2 size={14} /> : i + 1}
            </span>
            {s}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">Set up your workspace<br />in just 3 easy steps.</div>
    </aside>
  );
}

export default function CreateWorkspace() {
  const [name, setName] = useState(() => sessionStorage.getItem('tfWorkspace') || '');
  const [desc, setDesc] = useState(() => sessionStorage.getItem('tfDesc') || '');
  const [avatar, setAvatar] = useState(() => {
    const savedAvatar = Number.parseInt(sessionStorage.getItem('tfAvatar') || '0', 10);
    return savedAvatar >= 0 && savedAvatar < avatars.length ? savedAvatar : 0;
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const slug = createSlug(name);
  const previewAvatar = avatar === avatars.length - 1
    ? name.trim().charAt(0).toUpperCase() || '+'
    : avatars[avatar].label;

  function next(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a workspace name.');
      return;
    }
    sessionStorage.setItem('tfWorkspace', name.trim());
    sessionStorage.setItem('tfDesc', desc);
    sessionStorage.setItem('tfAvatar', String(avatar));
    sessionStorage.setItem('tfWorkspaceSlug', slug);
    navigate('/role');
  }

  return (
    <div className="shell">
      <Sidebar step={1} />
      <div className="main">
        <header className="topnav">
          <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>Step 1 of 3</span>
        </header>
        <div className="page-content">
          <div className="card">
            <div className="card-head">
              <h1>Create Your Workspace</h1>
              <p>Set up a shared space for your team to collaborate.</p>
            </div>
            <form onSubmit={next}>
              <div className="field">
                <label htmlFor="ws-name">Workspace Name</label>
                <div className="input-box">
                  <Building2 size={16} />
                  <input id="ws-name" placeholder="e.g. Acme Technologies" value={name}
                    onChange={e => {
                      setName(e.target.value);
                      sessionStorage.setItem('tfWorkspace', e.target.value);
                      setError('');
                    }} maxLength={40} required aria-describedby="ws-name-meta" autoFocus />
                </div>
                <div className="field-meta" id="ws-name-meta">
                  <span>teamflow.app/{slug}</span>
                  <span>{name.length}/40</span>
                </div>
              </div>
              <div className="field">
                <label htmlFor="ws-desc">Description <span>(optional)</span></label>
                <div className="input-box textarea-box">
                  <FileText size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                  <textarea id="ws-desc" placeholder="Tell us about your team or project..."
                    value={desc} onChange={e => {
                      setDesc(e.target.value);
                      sessionStorage.setItem('tfDesc', e.target.value);
                    }} maxLength={180} rows={3} aria-describedby="ws-desc-meta" />
                </div>
                <div className="field-meta" id="ws-desc-meta">
                  <span>Help your team understand this workspace.</span>
                  <span>{desc.length}/180</span>
                </div>
              </div>
              <div className="field">
                <label>Workspace Avatar</label>
                <div className="avatar-row" role="group" aria-label="Workspace avatar">
                  {avatars.map((av, i) => (
                    <button type="button" key={av.name} title={av.name}
                      className={`av-btn ${av.color} ${avatar === i ? 'sel' : ''}`}
                      aria-label={av.name} aria-pressed={avatar === i}
                      onClick={() => {
                        setAvatar(i);
                        sessionStorage.setItem('tfAvatar', String(i));
                      }}>{av.label}</button>
                  ))}
                </div>
              </div>
              <div className="workspace-preview" aria-live="polite">
                <span className={`workspace-preview-avatar ${avatars[avatar].color}`}>{previewAvatar}</span>
                <div className="workspace-preview-copy">
                  <span className="workspace-preview-label">Workspace preview</span>
                  <strong>{name.trim() || 'Your workspace'}</strong>
                  <span>{desc.trim() || `teamflow.app/${slug}`}</span>
                </div>
              </div>
              {error && <p className="err-msg">{error}</p>}
              <button className="btn-primary w-full" type="submit" style={{ marginTop: 8 }}>
                Continue <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
