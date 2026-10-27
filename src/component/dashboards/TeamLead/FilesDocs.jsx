import React, { useMemo, useRef, useState } from "react";
import {
  Search, Upload, FolderPlus, FileText, FileSpreadsheet, FileImage,
  FileCode2, MoreHorizontal, Download, Eye, Trash2, Folder, Grid2X2,
  List, Filter, ChevronDown, Clock3, Users, HardDrive, X, CheckCircle2
} from "lucide-react";
import "./FilesDocs.css";

const INITIAL_FILES = [
  { id: 1, name: "Project Requirements.pdf", type: "pdf", folder: "Project Documents", owner: "Komal Pawar", updated: "Today, 10:24 AM", size: "2.4 MB", access: "Team" },
  { id: 2, name: "Sprint Planning.xlsx", type: "sheet", folder: "Planning", owner: "Aarav Shah", updated: "Today, 9:10 AM", size: "846 KB", access: "Team" },
  { id: 3, name: "Dashboard Wireframes.png", type: "image", folder: "Design Assets", owner: "Priya Rao", updated: "Yesterday", size: "1.8 MB", access: "Team" },
  { id: 4, name: "API Documentation.docx", type: "doc", folder: "Project Documents", owner: "Rohan Kulkarni", updated: "Oct 22, 2026", size: "624 KB", access: "Team" },
  { id: 5, name: "Authentication Flow.jsx", type: "code", folder: "Development", owner: "Neha Patil", updated: "Oct 21, 2026", size: "18 KB", access: "Restricted" },
  { id: 6, name: "Meeting Notes.pdf", type: "pdf", folder: "Meeting Notes", owner: "Komal Pawar", updated: "Oct 20, 2026", size: "392 KB", access: "Team" },
];

const INITIAL_FOLDERS = [
  { name: "Project Documents", count: 12, color: "purple", modified: "Updated today" },
  { name: "Design Assets", count: 8, color: "blue", modified: "Updated yesterday" },
  { name: "Planning", count: 6, color: "green", modified: "Updated Oct 22" },
  { name: "Development", count: 14, color: "orange", modified: "Updated Oct 21" },
];

function FileIcon({ type }) {
  if (type === "sheet") return <FileSpreadsheet size={20} />;
  if (type === "image") return <FileImage size={20} />;
  if (type === "code") return <FileCode2 size={20} />;
  return <FileText size={20} />;
}

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilesDocs() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All files");
  const [folderFilter, setFolderFilter] = useState("All folders");
  const [view, setView] = useState("list");
  const [menuId, setMenuId] = useState(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [notice, setNotice] = useState("");
  const uploadRef = useRef(null);

  const filteredFiles = useMemo(() => files.filter(file => {
    const matchesQuery = `${file.name} ${file.owner} ${file.folder}`.toLowerCase().includes(query.toLowerCase());
    const matchesFolder = folderFilter === "All folders" || file.folder === folderFilter;
    const matchesTab = activeTab === "All files" ||
      (activeTab === "Shared with team" && file.access === "Team") ||
      (activeTab === "Recent" && ["Today, 10:24 AM", "Today, 9:10 AM", "Yesterday"].includes(file.updated));
    return matchesQuery && matchesFolder && matchesTab;
  }), [files, query, folderFilter, activeTab]);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const handleUpload = (event) => {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) return;
    const added = selected.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : /\.(xls|xlsx|csv)$/i.test(file.name) ? "sheet" : /\.(jsx?|tsx?|json|html|css)$/i.test(file.name) ? "code" : "pdf",
      folder: folderFilter === "All folders" ? "Project Documents" : folderFilter,
      owner: "Komal Pawar",
      updated: "Just now",
      size: formatSize(file.size),
      access: "Team",
      localFile: file,
    }));
    setFiles(prev => [...added, ...prev]);
    showNotice(`${selected.length} file${selected.length > 1 ? "s" : ""} added to this preview.`);
    event.target.value = "";
  };

  const createFolder = (event) => {
    event.preventDefault();
    const name = folderName.trim();
    if (!name) return;
    if (folders.some(folder => folder.name.toLowerCase() === name.toLowerCase())) {
      showNotice("A folder with that name already exists.");
      return;
    }
    setFolders(prev => [{ name, count: 0, color: "blue", modified: "Created just now" }, ...prev]);
    setFolderName("");
    setShowFolderModal(false);
    showNotice(`Folder "${name}" created in this preview.`);
  };

  const downloadFile = (file) => {
    if (!file.localFile) {
      showNotice("This sample file is not stored locally yet.");
      return;
    }
    const url = URL.createObjectURL(file.localFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteFile = (file) => {
    setFiles(prev => prev.filter(item => item.id !== file.id));
    setMenuId(null);
    showNotice(`"${file.name}" removed from this preview.`);
  };

  return (
    <main className="tf-files-page">
      <header className="tf-files-page-header">
        <div>
          <div className="tf-files-breadcrumb">Workspace <span>/</span> Files &amp; Docs</div>
          <h1>Files &amp; Docs</h1>
          <p>Keep your team's files organized and easy to find.</p>
        </div>
        <div className="tf-files-header-actions">
          <button className="tf-files-btn tf-files-btn-secondary" onClick={() => setShowFolderModal(true)}><FolderPlus size={17} /> New folder</button>
          <button className="tf-files-btn tf-files-btn-primary" onClick={() => uploadRef.current?.click()}><Upload size={17} /> Upload files</button>
          <input ref={uploadRef} type="file" multiple hidden onChange={handleUpload} />
        </div>
      </header>

      <section className="tf-files-summary" aria-label="Storage summary">
        <div className="tf-files-summary-card">
          <span className="tf-files-summary-icon purple"><Folder size={19} /></span>
          <div><span className="tf-files-summary-label">Total files</span><strong>{files.length + 42}</strong><small>Across all folders</small></div>
        </div>
        <div className="tf-files-summary-card">
          <span className="tf-files-summary-icon blue"><HardDrive size={19} /></span>
          <div><span className="tf-files-summary-label">Storage used</span><strong>2.8 GB <em>of 10 GB</em></strong><div className="tf-files-storage-track"><span /></div></div>
        </div>
        <div className="tf-files-summary-card">
          <span className="tf-files-summary-icon green"><Users size={19} /></span>
          <div><span className="tf-files-summary-label">Shared with team</span><strong>{files.filter(file => file.access === "Team").length + 27}</strong><small>Accessible to your team</small></div>
        </div>
      </section>

      <section className="tf-files-folders-section">
        <div className="tf-files-section-heading"><div><h2>Folders</h2><p>Browse documents by category</p></div><button className="tf-files-text-button" onClick={() => setFolderFilter("All folders")}>View all</button></div>
        <div className="tf-files-folder-grid">
          {folders.slice(0, 4).map(folder => (
            <button className={`tf-files-folder-card ${folderFilter === folder.name ? "selected" : ""}`} key={folder.name} onClick={() => { setFolderFilter(folder.name); setActiveTab("All files"); }}>
              <div className="tf-files-folder-top"><span className={`tf-files-folder-icon ${folder.color}`}><Folder size={21} fill="currentColor" /></span><MoreHorizontal size={19} className="tf-files-folder-more" /></div>
              <strong>{folder.name}</strong><span>{folder.count} files</span><small>{folder.modified}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="tf-files-list-section">
        <div className="tf-files-section-heading"><div><h2>All files</h2><p>Recently updated documents from your workspace</p></div></div>
        <div className="tf-files-toolbar">
          <div className="tf-files-tabs" role="tablist" aria-label="File views">
            {["All files", "Recent", "Shared with team"].map(tab => <button key={tab} role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}</button>)}
          </div>
          <div className="tf-files-tools">
            <label className="tf-files-search"><Search size={17} /><input aria-label="Search files" placeholder="Search files..." value={query} onChange={event => setQuery(event.target.value)} /><kbd>⌘ K</kbd></label>
            <label className="tf-files-filter"><Filter size={16} /><select aria-label="Filter by folder" value={folderFilter} onChange={event => setFolderFilter(event.target.value)}><option>All folders</option>{folders.map(folder => <option key={folder.name}>{folder.name}</option>)}</select><ChevronDown size={14} /></label>
            <div className="tf-files-view-toggle" aria-label="Choose file view"><button className={view === "list" ? "active" : ""} aria-label="List view" onClick={() => setView("list")}><List size={17} /></button><button className={view === "grid" ? "active" : ""} aria-label="Grid view" onClick={() => setView("grid")}><Grid2X2 size={17} /></button></div>
          </div>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="tf-files-empty"><span><FileText size={24} /></span><h3>No files found</h3><p>Try changing your search or folder filter.</p><button className="tf-files-btn tf-files-btn-secondary" onClick={() => { setQuery(""); setFolderFilter("All folders"); setActiveTab("All files"); }}>Clear filters</button></div>
        ) : view === "list" ? (
          <div className="tf-files-table-wrap"><table className="tf-files-table"><thead><tr><th>Name</th><th>Folder</th><th>Owner</th><th>Last updated</th><th>File size</th><th>Access</th><th><span className="tf-files-sr-only">Actions</span></th></tr></thead>
            <tbody>{filteredFiles.map(file => <tr key={file.id}>
              <td><div className={`tf-files-file-icon ${file.type}`}><FileIcon type={file.type} /></div><span className="tf-files-file-name">{file.name}</span></td>
              <td><span className="tf-files-folder-name">{file.folder}</span></td><td><span className="tf-files-owner"><span className="tf-files-owner-avatar">{file.owner.split(" ").map(part => part[0]).slice(0,2).join("")}</span>{file.owner}</span></td><td><span className="tf-files-updated"><Clock3 size={14} />{file.updated}</span></td><td>{file.size}</td><td><span className={`tf-files-access ${file.access === "Team" ? "team" : "restricted"}`}>{file.access}</span></td>
              <td className="tf-files-actions-cell"><div className="tf-files-row-actions"><button aria-label={`Preview ${file.name}`} title="Preview" onClick={() => showNotice(`Preview for "${file.name}" is not connected yet.`)}><Eye size={16} /></button><button aria-label={`Download ${file.name}`} title="Download" onClick={() => downloadFile(file)}><Download size={16} /></button><button aria-label={`More actions for ${file.name}`} title="More actions" onClick={() => setMenuId(menuId === file.id ? null : file.id)}><MoreHorizontal size={17} /></button>
                {menuId === file.id && <div className="tf-files-row-menu"><button onClick={() => { showNotice(`Share settings for "${file.name}" are a UI preview.`); setMenuId(null); }}><Users size={15} /> Manage access</button><button className="danger" onClick={() => deleteFile(file)}><Trash2 size={15} /> Remove file</button></div>}
              </div></td>
            </tr>)}</tbody></table></div>
        ) : (
          <div className="tf-files-grid-view">{filteredFiles.map(file => <article className="tf-files-grid-file" key={file.id}><div className={`tf-files-file-icon ${file.type}`}><FileIcon type={file.type} /></div><button className="tf-files-grid-more" aria-label={`More actions for ${file.name}`} onClick={() => setMenuId(menuId === file.id ? null : file.id)}><MoreHorizontal size={18} /></button><h3>{file.name}</h3><p>{file.folder}</p><footer><span>{file.size}</span><span>{file.updated}</span></footer>{menuId === file.id && <div className="tf-files-row-menu grid-menu"><button onClick={() => downloadFile(file)}><Download size={15} /> Download</button><button className="danger" onClick={() => deleteFile(file)}><Trash2 size={15} /> Remove file</button></div>}</article>)}</div>
        )}
        <div className="tf-files-list-footer"><span>Showing {filteredFiles.length} of {files.length} files in this preview</span><button onClick={() => showNotice("You're viewing the latest sample files.")}>Refresh list</button></div>
      </section>

      {notice && <div className="tf-files-toast" role="status"><CheckCircle2 size={17} />{notice}<button aria-label="Dismiss notification" onClick={() => setNotice("")}><X size={15} /></button></div>}

      {showFolderModal && <div className="tf-files-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setShowFolderModal(false); }}><form className="tf-files-modal" role="dialog" aria-modal="true" aria-labelledby="tf-files-modal-title" onSubmit={createFolder}>
        <div className="tf-files-modal-heading"><span><FolderPlus size={20} /></span><button type="button" aria-label="Close dialog" onClick={() => setShowFolderModal(false)}><X size={18} /></button></div><h2 id="tf-files-modal-title">Create a folder</h2><p>Organize your workspace files into a new folder.</p><label htmlFor="tf-files-folder-name">Folder name</label><input id="tf-files-folder-name" autoFocus maxLength={50} placeholder="e.g. Research Documents" value={folderName} onChange={event => setFolderName(event.target.value)} required /><div className="tf-files-modal-actions"><button type="button" className="tf-files-btn tf-files-btn-secondary" onClick={() => setShowFolderModal(false)}>Cancel</button><button type="submit" className="tf-files-btn tf-files-btn-primary">Create folder</button></div>
      </form></div>}
    </main>
  );
}
