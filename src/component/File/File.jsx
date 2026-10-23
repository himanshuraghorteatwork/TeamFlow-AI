import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Upload,
  FileText,
  Folder,
  CloudUpload,
  Users,
  Image as ImageIcon,
  Video,
  Archive,
  File as FileIcon,
  FileSpreadsheet,
  Presentation,
  FileCode2,
  MoreVertical,
  Download,
  Trash2,
  Grid2X2,
  List,
  CalendarDays,
  ChevronDown,
  X,
  CheckCircle2,
  FolderOpen,
} from "lucide-react";

import AppSidebar from "../../layouts/AppSidebar";
import "./File.css";

/* =========================================================
   INDEXED DB CONFIG
========================================================= */

const DB_NAME = "TeamFlowFilesDB";
const DB_VERSION = 1;
const STORE_NAME = "files";

/* =========================================================
   DATABASE HELPERS
========================================================= */

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });

        store.createIndex("name", "name", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
        store.createIndex("category", "category", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveFileToDB = async (fileData) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.put(fileData);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const getAllFilesFromDB = async () => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

const deleteFileFromDB = async (id) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/* =========================================================
   FILE HELPERS
========================================================= */

const getExtension = (fileName) => {
  const parts = fileName.split(".");

  if (parts.length <= 1) {
    return "";
  }

  return parts.pop().toUpperCase();
};

const getFileCategory = (file) => {
  const extension = getExtension(file.name);
  const mime = file.type || "";

  if (
    mime.startsWith("image/") ||
    ["JPG", "JPEG", "PNG", "GIF", "WEBP", "SVG", "BMP", "ICO"].includes(
      extension
    )
  ) {
    return "Images";
  }

  if (
    mime.startsWith("video/") ||
    ["MP4", "MOV", "AVI", "MKV", "WEBM", "MPEG"].includes(extension)
  ) {
    return "Videos";
  }

  if (
    [
      "ZIP",
      "RAR",
      "7Z",
      "TAR",
      "GZ",
      "BZ2",
      "ISO",
      "ARJ",
    ].includes(extension)
  ) {
    return "Archives";
  }

  if (
    [
      "DOC",
      "DOCX",
      "PDF",
      "TXT",
      "RTF",
      "ODT",
      "PAGES",
      "MD",
    ].includes(extension)
  ) {
    return "Documents";
  }

  return "Others";
};

const getFileIcon = (file) => {
  const extension = file.extension;

  if (file.category === "Images") {
    return <ImageIcon size={24} />;
  }

  if (file.category === "Videos") {
    return <Video size={24} />;
  }

  if (file.category === "Archives") {
    return <Archive size={24} />;
  }

  if (["PDF"].includes(extension)) {
    return <FileText size={24} />;
  }

  if (["DOC", "DOCX", "TXT", "RTF", "MD"].includes(extension)) {
    return <FileText size={24} />;
  }

  if (["XLS", "XLSX", "CSV"].includes(extension)) {
    return <FileSpreadsheet size={24} />;
  }

  if (["PPT", "PPTX"].includes(extension)) {
    return <Presentation size={24} />;
  }

  if (
    ["JS", "JSX", "TS", "TSX", "HTML", "CSS", "JAVA", "PY", "JSON"].includes(
      extension
    )
  ) {
    return <FileCode2 size={24} />;
  }

  return <File size={24} />;
};

const getFileIconClass = (file) => {
  if (file.category === "Images") return "file-icon-green";
  if (file.category === "Videos") return "file-icon-purple";
  if (file.category === "Archives") return "file-icon-yellow";
  if (file.extension === "PDF") return "file-icon-red";
  if (["XLS", "XLSX", "CSV"].includes(file.extension)) {
    return "file-icon-green";
  }
  if (["PPT", "PPTX"].includes(file.extension)) {
    return "file-icon-orange";
  }

  return "file-icon-blue";
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) {
    return "0 KB";
  }

  const units = ["B", "KB", "MB", "GB"];

  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  const size = bytes / Math.pow(1024, index);

  return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const formatDate = (dateValue) => {
  const date = new Date(dateValue);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const isRecentlyUploaded = (dateValue) => {
  const now = Date.now();
  const uploaded = new Date(dateValue).getTime();

  const difference = now - uploaded;

  return difference <= 7 * 24 * 60 * 60 * 1000;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

function File() {
  const inputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Files");

  const [viewMode, setViewMode] = useState("grid");

  const [sortBy, setSortBy] = useState("newest");

  const [isUploading, setIsUploading] = useState(false);

  const [menuId, setMenuId] = useState(null);

  const [notification, setNotification] = useState(null);

  /* =======================================================
     LOAD FILES
  ======================================================= */

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const savedFiles = await getAllFilesFromDB();

      setFiles(savedFiles);
    } catch (error) {
      console.error("Unable to load files:", error);

      showNotification("Unable to load files", "error");
    }
  };

  /* =======================================================
     NOTIFICATION
  ======================================================= */

  const showNotification = (message, type = "success") => {
    setNotification({
      message,
      type,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  /* =======================================================
     UPLOAD
  ======================================================= */

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    setIsUploading(true);

    try {
      for (const file of selectedFiles) {
        const category = getFileCategory(file);
        const extension = getExtension(file.name);

        const fileData = {
          id: crypto.randomUUID(),

          name: file.name,

          extension,

          category,

          mimeType: file.type || "application/octet-stream",

          size: file.size,

          createdAt: new Date().toISOString(),

          modifiedAt: file.lastModified
            ? new Date(file.lastModified).toISOString()
            : new Date().toISOString(),

          description: `${category} file uploaded to TeamFlow AI.`,

          blob: file,
        };

        await saveFileToDB(fileData);
      }

      await loadFiles();

      showNotification(
        `${selectedFiles.length} file${
          selectedFiles.length > 1 ? "s" : ""
        } uploaded successfully`
      );
    } catch (error) {
      console.error("Upload error:", error);

      showNotification("File upload failed", "error");
    } finally {
      setIsUploading(false);

      event.target.value = "";
    }
  };

  /* =======================================================
     DOWNLOAD
  ======================================================= */

  const handleDownload = (file) => {
    try {
      const blob = file.blob;

      const url = URL.createObjectURL(blob);

      const anchor = document.createElement("a");

      anchor.href = url;

      anchor.download = file.name;

      document.body.appendChild(anchor);

      anchor.click();

      anchor.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      showNotification(`${file.name} downloaded`);
    } catch (error) {
      console.error("Download error:", error);

      showNotification("Unable to download file", "error");
    }
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (file) => {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${file.name}"?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteFileFromDB(file.id);

      setFiles((currentFiles) =>
        currentFiles.filter((item) => item.id !== file.id)
      );

      setMenuId(null);

      showNotification(`${file.name} deleted`);
    } catch (error) {
      console.error("Delete error:", error);

      showNotification("Unable to delete file", "error");
    }
  };

  /* =======================================================
     FILTER + SEARCH + SORT
  ======================================================= */

  const filteredFiles = useMemo(() => {
    let result = [...files];

    if (activeCategory !== "All Files") {
      result = result.filter(
        (file) => file.category === activeCategory
      );
    }

    if (search.trim()) {
      const searchValue = search.toLowerCase();

      result = result.filter((file) => {
        return (
          file.name.toLowerCase().includes(searchValue) ||
          file.extension.toLowerCase().includes(searchValue) ||
          file.category.toLowerCase().includes(searchValue)
        );
      });
    }

    result.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "size") {
        return b.size - a.size;
      }

      return 0;
    });

    return result;
  }, [files, activeCategory, search, sortBy]);

  /* =======================================================
     STATISTICS
  ======================================================= */

  const totalFiles = files.length;

  const folders = new Set(files.map((file) => file.category)).size;

  const recentlyUploaded = files.filter((file) =>
    isRecentlyUploaded(file.createdAt)
  ).length;

  /*
    There is no sharing system yet, so this remains genuinely
    0 rather than displaying fake shared-file data.
  */
  const sharedFiles = 0;

  /* =======================================================
     CATEGORY TABS
  ======================================================= */

  const categories = [
    "All Files",
    "Documents",
    "Images",
    "Videos",
    "Archives",
    "Others",
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="file-page">
      <AppSidebar />

      <main className="file-main">
        {/* =================================================
            TOP HEADER
        ================================================= */}

        <header className="file-topbar">
          <div className="file-global-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search files, folders, projects, members..."
            />
          </div>

          <div className="file-user-area">
            <div className="file-user-avatar">JD</div>

            <div>
              <strong>John Doe</strong>
              <span>john@company.com</span>
            </div>
          </div>
        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <section className="file-content">
          <div className="file-page-heading">
            <div>
              <h1>Files</h1>

              <p>
                Store, organize and share all your project files in one
                place.
              </p>
            </div>

            <button
              className="upload-button"
              type="button"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <span className="upload-spinner" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={19} />
                  Upload File
                </>
              )}
            </button>

            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden-file-input"
              onChange={handleFileUpload}
            />
          </div>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="file-stat-grid">
            <div className="file-stat-card">
              <div className="file-stat-icon blue">
                <FileText size={24} />
              </div>

              <div>
                <strong>{totalFiles}</strong>
                <span>Total Files</span>
              </div>
            </div>

            <div className="file-stat-card">
              <div className="file-stat-icon green">
                <Folder size={24} />
              </div>

              <div>
                <strong>{folders}</strong>
                <span>Folders</span>
              </div>
            </div>

            <div className="file-stat-card">
              <div className="file-stat-icon yellow">
                <CloudUpload size={24} />
              </div>

              <div>
                <strong>{recentlyUploaded}</strong>
                <span>Recently Uploaded</span>
              </div>
            </div>

            <div className="file-stat-card">
              <div className="file-stat-icon pink">
                <Users size={24} />
              </div>

              <div>
                <strong>{sharedFiles}</strong>
                <span>Shared Files</span>
              </div>
            </div>
          </div>

          {/* =================================================
              TOOLBAR
          ================================================= */}

          <div className="file-toolbar">
            <div className="file-tabs">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    activeCategory === category
                      ? "file-tab active"
                      : "file-tab"
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="file-controls">
              <div className="file-search-box">
                <Search size={17} />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search files..."
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="view-toggle">
                <button
                  type="button"
                  className={
                    viewMode === "grid" ? "active" : ""
                  }
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  <Grid2X2 size={17} />
                </button>

                <button
                  type="button"
                  className={
                    viewMode === "list" ? "active" : ""
                  }
                  onClick={() => setViewMode("list")}
                  title="List view"
                >
                  <List size={18} />
                </button>
              </div>

              <div className="sort-wrapper">
                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value)
                  }
                  aria-label="Sort files"
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="oldest">Sort by: Oldest</option>
                  <option value="name">Sort by: Name</option>
                  <option value="size">Sort by: Size</option>
                </select>

                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* =================================================
              FILE AREA
          ================================================= */}

          {filteredFiles.length === 0 ? (
            <div className="file-empty-state">
              <div className="file-empty-icon">
                <FolderOpen size={42} />
              </div>

              {files.length === 0 ? (
                <>
                  <h2>No files uploaded yet</h2>

                  <p>
                    Upload documents, images, videos, archives and
                    other project files to get started.
                  </p>

                  <button
                    type="button"
                    onClick={handleUploadClick}
                  >
                    <Upload size={18} />
                    Upload your first file
                  </button>
                </>
              ) : (
                <>
                  <h2>No matching files</h2>

                  <p>
                    Try changing your search or selecting another
                    file category.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setActiveCategory("All Files");
                    }}
                  >
                    Clear filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "file-grid"
                  : "file-list"
              }
            >
              {filteredFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  menuId={menuId}
                  setMenuId={setMenuId}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ===================================================
          NOTIFICATION
      =================================================== */}

      {notification && (
        <div
          className={`file-notification ${
            notification.type === "error" ? "error" : ""
          }`}
        >
          {notification.type === "error" ? (
            <X size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}

          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   FILE CARD
========================================================= */

function FileCard({
  file,
  menuId,
  setMenuId,
  onDownload,
  onDelete,
  viewMode,
}) {
  if (viewMode === "list") {
    return (
      <div className="file-list-row">
        <div
          className={`file-card-icon ${getFileIconClass(file)}`}
        >
          {getFileIcon(file)}
        </div>

        <div className="file-list-name">
          <strong>{file.name}</strong>

          <span>
            {formatFileSize(file.size)} • {file.extension || "FILE"}
          </span>
        </div>

        <div className="file-list-category">
          {file.category}
        </div>

        <div className="file-list-date">
          <CalendarDays size={15} />
          {formatDate(file.createdAt)}
        </div>

        <button
          type="button"
          className="file-download-small"
          onClick={() => onDownload(file)}
        >
          <Download size={16} />
          Download
        </button>

        <div className="file-card-menu-wrapper">
          <button
            type="button"
            className="file-more-button"
            onClick={() =>
              setMenuId(menuId === file.id ? null : file.id)
            }
          >
            <MoreVertical size={18} />
          </button>

          {menuId === file.id && (
            <FileMenu
              file={file}
              onDownload={onDownload}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <article className="file-card">
      <div className="file-card-header">
        <div
          className={`file-card-icon ${getFileIconClass(file)}`}
        >
          {getFileIcon(file)}
        </div>

        <button
          type="button"
          className="file-more-button"
          onClick={() =>
            setMenuId(menuId === file.id ? null : file.id)
          }
          aria-label="File options"
        >
          <MoreVertical size={18} />
        </button>

        {menuId === file.id && (
          <FileMenu
            file={file}
            onDownload={onDownload}
            onDelete={onDelete}
          />
        )}
      </div>

      <div className="file-card-body">
        <h3 title={file.name}>{file.name}</h3>

        <div className="file-card-meta">
          {formatFileSize(file.size)} • {file.extension || "FILE"}
        </div>

        <p>{file.description}</p>
      </div>

      <div className="file-card-footer">
        <div className="file-category-badge">
          {file.category}
        </div>

        <div className="file-date">
          <CalendarDays size={14} />
          {formatDate(file.createdAt)}
        </div>
      </div>

      <button
        type="button"
        className="file-download-button"
        onClick={() => onDownload(file)}
      >
        Download
        <Download size={16} />
      </button>
    </article>
  );
}

/* =========================================================
   FILE MENU
========================================================= */

function FileMenu({ file, onDownload, onDelete }) {
  return (
    <div className="file-context-menu">
      <button
        type="button"
        onClick={() => onDownload(file)}
      >
        <Download size={16} />
        Download
      </button>

      <button
        type="button"
        className="danger"
        onClick={() => onDelete(file)}
      >
        <Trash2 size={16} />
        Delete
      </button>
    </div>
  );
}

export default File;