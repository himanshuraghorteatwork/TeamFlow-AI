import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Folder,
  User,
  Database,
  Search,
  Upload,
  Plus,
  X,
  Download,
  Eye,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Check,
  Share2,
  Trash2,
  Copy,
  ExternalLink,
  HardDrive,
  FileCode,
  Image as ImageIcon,
  FileSpreadsheet,
  FileArchive,
  Layers,
  Sparkles,
} from "lucide-react";

import EmployeeShell from "./EmployeeShell";
import { getEmployeeProfile } from "./EmployeeAuth";
import "./File.css";

/* In-Memory Store for Real File Blobs uploaded during session */
const uploadedFileStore = new Map();

/* Storage Key */
const STORAGE_KEY = "tf_files_v3";
const FOLDERS_STORAGE_KEY = "tf_file_folders_v3";

/* Sample Avatars */
const avatars = {
  john: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  rahul: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  amit: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
  sneha: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  karan: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
};

/* 28 Default Files matching the reference image layout */
const defaultFiles = [
  {
    id: "f-1",
    name: "Project Requirements.pdf",
    description: "Updated project requirements",
    project: "TeamFlow Website",
    type: "PDF",
    typePill: "PDF",
    category: "PDF",
    size: "2.4 MB",
    sizeBytes: 2400000,
    uploader: "John Doe",
    isCurrentUser: true,
    uploaderAvatar: avatars.john,
    date: "Oct 24, 2024",
    time: "10:30 AM",
    folder: "Project Documents",
  },
  {
    id: "f-2",
    name: "Login Page Design.png",
    description: "UI design for login page",
    project: "Mobile App",
    type: "Image",
    typePill: "Image",
    category: "Images",
    size: "1.8 MB",
    sizeBytes: 1800000,
    uploader: "John Doe",
    isCurrentUser: true,
    uploaderAvatar: avatars.john,
    date: "Oct 23, 2024",
    time: "03:15 PM",
    folder: "Design Assets",
  },
  {
    id: "f-3",
    name: "API Documentation.docx",
    description: "API endpoints and request format",
    project: "AI Integration",
    type: "Document",
    typePill: "Document",
    category: "Documents",
    size: "856 KB",
    sizeBytes: 856000,
    uploader: "Rahul Sharma",
    isCurrentUser: false,
    uploaderAvatar: avatars.rahul,
    date: "Oct 22, 2024",
    time: "11:20 AM",
    folder: "Project Documents",
  },
  {
    id: "f-4",
    name: "Test Cases.xlsx",
    description: "QA test cases for module",
    project: "TeamFlow Website",
    type: "Spreadsheet",
    typePill: "Spreadsheet",
    category: "Spreadsheets",
    size: "1.2 MB",
    sizeBytes: 1200000,
    uploader: "John Doe",
    isCurrentUser: true,
    uploaderAvatar: avatars.john,
    date: "Oct 21, 2024",
    time: "04:45 PM",
    folder: "Project Documents",
  },
  {
    id: "f-5",
    name: "Sprint Review.pptx",
    description: "Sprint review presentation",
    project: "Mobile App",
    type: "Presentation",
    typePill: "Presentation",
    category: "Presentations",
    size: "3.1 MB",
    sizeBytes: 3100000,
    uploader: "Amit Verma",
    isCurrentUser: false,
    uploaderAvatar: avatars.amit,
    date: "Oct 20, 2024",
    time: "02:10 PM",
    folder: "Project Documents",
  },
  {
    id: "f-6",
    name: "Meeting Notes.txt",
    description: "Client meeting discussion",
    project: "Marketing Portal",
    type: "Text",
    typePill: "Text",
    category: "Documents",
    size: "120 KB",
    sizeBytes: 120000,
    uploader: "John Doe",
    isCurrentUser: true,
    uploaderAvatar: avatars.john,
    date: "Oct 19, 2024",
    time: "05:00 PM",
    folder: "Meeting Notes",
  },
  {
    id: "f-7",
    name: "Bug Report - #1023.pdf",
    description: "Login button issue details",
    project: "AI Integration",
    type: "PDF",
    typePill: "PDF",
    category: "PDF",
    size: "640 KB",
    sizeBytes: 640000,
    uploader: "Sneha Patil",
    isCurrentUser: false,
    uploaderAvatar: avatars.sneha,
    date: "Oct 18, 2024",
    time: "01:25 PM",
    folder: "Project Documents",
  },
  {
    id: "f-8",
    name: "Database Schema.png",
    description: "Database structure diagram",
    project: "TeamFlow Website",
    type: "Image",
    typePill: "Image",
    category: "Images",
    size: "2.1 MB",
    sizeBytes: 2100000,
    uploader: "Karan More",
    isCurrentUser: false,
    uploaderAvatar: avatars.karan,
    date: "Oct 17, 2024",
    time: "11:45 AM",
    folder: "Design Assets",
  },
  {
    id: "f-9",
    name: "User Manual.docx",
    description: "Application user guide",
    project: "Mobile App",
    type: "Document",
    typePill: "Document",
    category: "Documents",
    size: "1.5 MB",
    sizeBytes: 1500000,
    uploader: "John Doe",
    isCurrentUser: true,
    uploaderAvatar: avatars.john,
    date: "Oct 16, 2024",
    time: "09:30 AM",
    folder: "Personal",
  },
  {
    id: "f-10",
    name: "Design Assets.zip",
    description: "All UI assets",
    project: "Marketing Portal",
    type: "Archive",
    typePill: "Archive",
    category: "Others",
    size: "4.2 MB",
    sizeBytes: 4200000,
    uploader: "Amit Verma",
    isCurrentUser: false,
    uploaderAvatar: avatars.amit,
    date: "Oct 15, 2024",
    time: "06:20 PM",
    folder: "Design Assets",
  },
  // Additional files 11 - 28 to support pagination 1-10 of 28
  {
    id: "f-11",
    name: "Brand Guidelines.pdf",
    description: "Color palette and typography spec",
    project: "Marketing Portal",
    type: "PDF",
    typePill: "PDF",
    category: "PDF",
    size: "3.5 MB",
    sizeBytes: 3500000,
    uploader: "Sneha Patil",
    isCurrentUser: false,
    uploaderAvatar: avatars.sneha,
    date: "Oct 14, 2024",
    time: "02:15 PM",
    folder: "Design Assets",
  },
  {
    id: "f-12",
    name: "Architecture Diagram.png",
    description: "Microservices layout map",
    project: "AI Integration",
    type: "Image",
    typePill: "Image",
    category: "Images",
    size: "1.9 MB",
    sizeBytes: 1900000,
    uploader: "Rahul Sharma",
    isCurrentUser: false,
    uploaderAvatar: avatars.rahul,
    date: "Oct 13, 2024",
    time: "10:10 AM",
    folder: "Project Documents",
  },
  {
    id: "f-13",
    name: "Financial Projections.xlsx",
    description: "Q4 compute & token costs",
    project: "TeamFlow Website",
    type: "Spreadsheet",
    typePill: "Spreadsheet",
    category: "Spreadsheets",
    size: "890 KB",
    sizeBytes: 890000,
    uploader: "John Doe",
    isCurrentUser: true,
    uploaderAvatar: avatars.john,
    date: "Oct 12, 2024",
    time: "04:00 PM",
    folder: "Personal",
  },
  {
    id: "f-14",
    name: "Product Demo Deck.pptx",
    description: "Client pitch deck version 3",
    project: "TeamFlow Website",
    type: "Presentation",
    typePill: "Presentation",
    category: "Presentations",
    size: "5.8 MB",
    sizeBytes: 5800000,
    uploader: "Amit Verma",
    isCurrentUser: false,
    uploaderAvatar: avatars.amit,
    date: "Oct 11, 2024",
    time: "01:45 PM",
    folder: "Project Documents",
  },
  {
    id: "f-15",
    name: "Changelog_v1.4.txt",
    description: "Release notes for sprint 4",
    project: "Mobile App",
    type: "Text",
    typePill: "Text",
    category: "Documents",
    size: "65 KB",
    sizeBytes: 65000,
    uploader: "Karan More",
    isCurrentUser: false,
    uploaderAvatar: avatars.karan,
    date: "Oct 10, 2024",
    time: "11:30 AM",
    folder: "Project Documents",
  },
  {
    id: "f-16",
    name: "Security Audit.pdf",
    description: "Penetration testing report",
    project: "TeamFlow Website",
    type: "PDF",
    typePill: "PDF",
    category: "PDF",
    size: "4.1 MB",
    sizeBytes: 4100000,
    uploader: "Rahul Sharma",
    isCurrentUser: false,
    uploaderAvatar: avatars.rahul,
    date: "Oct 09, 2024",
    time: "09:00 AM",
    folder: "Project Documents",
  },
  {
    id: "f-17",
    name: "App Store Mockups.png",
    description: "iOS store screenshots",
    project: "Mobile App",
    type: "Image",
    typePill: "Image",
    category: "Images",
    size: "2.8 MB",
    sizeBytes: 2800000,
    uploader: "John Doe",
    isCurrentUser: true,
    uploaderAvatar: avatars.john,
    date: "Oct 08, 2024",
    time: "03:40 PM",
    folder: "Design Assets",
  },
  {
    id: "f-18",
    name: "Customer Feedback.xlsx",
    description: "Beta tester survey responses",
    project: "Marketing Portal",
    type: "Spreadsheet",
    typePill: "Spreadsheet",
    category: "Spreadsheets",
    size: "1.4 MB",
    sizeBytes: 1400000,
    uploader: "Sneha Patil",
    isCurrentUser: false,
    uploaderAvatar: avatars.sneha,
    date: "Oct 07, 2024",
    time: "12:15 PM",
    folder: "Meeting Notes",
  },
  {
    id: "f-19",
    name: "Investor Update.pptx",
    description: "Monthly shareholder update slides",
    project: "General",
    type: "Presentation",
    typePill: "Presentation",
    category: "Presentations",
    size: "6.2 MB",
    sizeBytes: 6200000,
    uploader: "Amit Verma",
    isCurrentUser: false,
    uploaderAvatar: avatars.amit,
    date: "Oct 06, 2024",
    time: "05:50 PM",
    folder: "Project Documents",
  },
  {
    id: "f-20",
    name: "Source_Bundle.zip",
    description: "Exported icon vector svgs",
    project: "TeamFlow Website",
    type: "Archive",
    typePill: "Archive",
    category: "Others",
    size: "8.4 MB",
    sizeBytes: 8400000,
    uploader: "John Doe",
    isCurrentUser: true,
    uploaderAvatar: avatars.john,
    date: "Oct 05, 2024",
    time: "02:00 PM",
    folder: "Personal",
  },
  {
    id: "f-21",
    name: "Interview Transcript.docx",
    description: "Senior DevOps candidate notes",
    project: "General",
    type: "Document",
    typePill: "Document",
    category: "Documents",
    size: "420 KB",
    sizeBytes: 420000,
    uploader: "Sneha Patil",
    isCurrentUser: false,
    uploaderAvatar: avatars.sneha,
    date: "Oct 04, 2024",
    time: "10:30 AM",
    folder: "Meeting Notes",
  },
  {
    id: "f-22",
    name: "Design Sprint Retrospective.pdf",
    description: "Takeaways from design week",
    project: "Mobile App",
    type: "PDF",
    typePill: "PDF",
    category: "PDF",
    size: "1.1 MB",
    sizeBytes: 1100000,
    uploader: "Karan More",
    isCurrentUser: false,
    uploaderAvatar: avatars.karan,
    date: "Oct 03, 2024",
    time: "04:15 PM",
    folder: "Meeting Notes",
  },
  {
    id: "f-23",
    name: "Landing Banner Illustration.png",
    description: "Hero gradient vector graphic",
    project: "Marketing Portal",
    type: "Image",
    typePill: "Image",
    category: "Images",
    size: "3.2 MB",
    sizeBytes: 3200000,
    uploader: "John Doe",
    isCurrentUser: true,
    uploaderAvatar: avatars.john,
    date: "Oct 02, 2024",
    time: "01:20 PM",
    folder: "Design Assets",
  },
  {
    id: "f-24",
    name: "Feature Matrix.xlsx",
    description: "Competitor comparison analysis",
    project: "AI Integration",
    type: "Spreadsheet",
    typePill: "Spreadsheet",
    category: "Spreadsheets",
    size: "780 KB",
    sizeBytes: 780000,
    uploader: "Rahul Sharma",
    isCurrentUser: false,
    uploaderAvatar: avatars.rahul,
    date: "Oct 01, 2024",
    time: "11:00 AM",
    folder: "Project Documents",
  },
  {
    id: "f-25",
    name: "Contract Draft.docx",
    description: "Consultant service agreement",
    project: "General",
    type: "Document",
    typePill: "Document",
    category: "Documents",
    size: "510 KB",
    sizeBytes: 510000,
    uploader: "Amit Verma",
    isCurrentUser: false,
    uploaderAvatar: avatars.amit,
    date: "Sep 30, 2024",
    time: "03:30 PM",
    folder: "Personal",
  },
  {
    id: "f-26",
    name: "Component Library.png",
    description: "Figma tokens overview board",
    project: "TeamFlow Website",
    type: "Image",
    typePill: "Image",
    category: "Images",
    size: "2.4 MB",
    sizeBytes: 2400000,
    uploader: "John Doe",
    isCurrentUser: true,
    uploaderAvatar: avatars.john,
    date: "Sep 29, 2024",
    time: "09:45 AM",
    folder: "Design Assets",
  },
  {
    id: "f-27",
    name: "Performance Benchmarks.docx",
    description: "SSR load time comparisons",
    project: "TeamFlow Website",
    type: "Document",
    typePill: "Document",
    category: "Documents",
    size: "920 KB",
    sizeBytes: 920000,
    uploader: "Rahul Sharma",
    isCurrentUser: false,
    uploaderAvatar: avatars.rahul,
    date: "Sep 28, 2024",
    time: "02:10 PM",
    folder: "Project Documents",
  },
  {
    id: "f-28",
    name: "Team Onboarding.docx",
    description: "Welcome handbook and instructions",
    project: "General",
    type: "Document",
    typePill: "Document",
    category: "Documents",
    size: "1.3 MB",
    sizeBytes: 1300000,
    uploader: "Sneha Patil",
    isCurrentUser: false,
    uploaderAvatar: avatars.sneha,
    date: "Sep 27, 2024",
    time: "11:15 AM",
    folder: "Personal",
  },
];

/* Default 4 folders */
const defaultFolders = [
  { id: "fol-1", name: "Project Documents", count: 12 },
  { id: "fol-2", name: "Design Assets", count: 8 },
  { id: "fol-3", name: "Meeting Notes", count: 4 },
  { id: "fol-4", name: "Personal", count: 6 },
];

function File() {
  // Load files from localStorage
  const [files, setFiles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) return parsed;
      }
    } catch {}
    return defaultFiles;
  });

  // Folders
  const [folders, setFolders] = useState(() => {
    try {
      const saved = localStorage.getItem(FOLDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultFolders;
  });

  // Active Type Filter Pill
  // 'All' | 'Documents' | 'Images' | 'PDF' | 'Spreadsheets' | 'Presentations' | 'Others'
  const [typePillFilter, setTypePillFilter] = useState("All");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [uploaderFilter, setUploaderFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [sortBy, setSortBy] = useState("Recent");

  // Active folder filter (null = all)
  const [activeFolderFilter, setActiveFolderFilter] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected checkbox IDs
  const [selectedFileIds, setSelectedFileIds] = useState([]);

  // Dropdown open states
  const [projectDropOpen, setProjectDropOpen] = useState(false);
  const [uploaderDropOpen, setUploaderDropOpen] = useState(false);
  const [dateDropOpen, setDateDropOpen] = useState(false);
  const [sortDropOpen, setSortDropOpen] = useState(false);

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
  const [previewFileModal, setPreviewFileModal] = useState(null);
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);

  // New File Upload Form
  const [uploadForm, setUploadForm] = useState({
    name: "",
    project: "TeamFlow Website",
    category: "Documents",
    description: "",
    folder: "Project Documents",
  });
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Helper to format bytes
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // PC file selection handlers
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadForm((prev) => ({
        ...prev,
        name: file.name,
      }));
    }
  };

  const handleDropFile = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadForm((prev) => ({
        ...prev,
        name: file.name,
      }));
    }
  };

  const handleRemoveSelectedFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedFile(null);
    setDragOver(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploadForm({
      name: "",
      project: "TeamFlow Website",
      category: "Documents",
      description: "",
      folder: "Project Documents",
    });
  };
  const [newFolderName, setNewFolderName] = useState("");

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  const projectDropRef = useRef(null);
  const uploaderDropRef = useRef(null);
  const dateDropRef = useRef(null);
  const sortDropRef = useRef(null);
  const rowMenuRef = useRef(null);

  // Persist files to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (projectDropRef.current && !projectDropRef.current.contains(e.target)) setProjectDropOpen(false);
      if (uploaderDropRef.current && !uploaderDropRef.current.contains(e.target)) setUploaderDropOpen(false);
      if (dateDropRef.current && !dateDropRef.current.contains(e.target)) setDateDropOpen(false);
      if (sortDropRef.current && !sortDropRef.current.contains(e.target)) setSortDropOpen(false);
      if (rowMenuRef.current && !rowMenuRef.current.contains(e.target)) setActiveRowMenuId(null);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // KPI Calculations
  const totalFilesCount = files.length;
  const projectFilesCount = files.filter((f) => f.project !== "General").length;
  const myUploadsCount = files.filter((f) => f.isCurrentUser).length;

  // Category counts for pills
  const docCount = files.filter((f) => f.category === "Documents").length;
  const imgCount = files.filter((f) => f.category === "Images").length;
  const pdfCount = files.filter((f) => f.category === "PDF").length;
  const sheetCount = files.filter((f) => f.category === "Spreadsheets").length;
  const pptCount = files.filter((f) => f.category === "Presentations").length;
  const othersCount = files.filter((f) => f.category === "Others").length;

  // Filtered & Sorted files
  const filteredFiles = useMemo(() => {
    let list = [...files];

    // Category Pill Filter
    if (typePillFilter !== "All") {
      list = list.filter((f) => f.category === typePillFilter);
    }

    // Folder Filter
    if (activeFolderFilter) {
      list = list.filter((f) => f.folder === activeFolderFilter);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.project.toLowerCase().includes(q) ||
          f.uploader.toLowerCase().includes(q)
      );
    }

    // Project Dropdown
    if (projectFilter !== "All") {
      list = list.filter((f) => f.project === projectFilter);
    }

    // Uploader Dropdown
    if (uploaderFilter === "You") {
      list = list.filter((f) => f.isCurrentUser);
    } else if (uploaderFilter !== "All") {
      list = list.filter((f) => f.uploader === uploaderFilter);
    }

    // Sort By
    if (sortBy === "Name A-Z") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Size") {
      list.sort((a, b) => (b.sizeBytes || 0) - (a.sizeBytes || 0));
    }

    return list;
  }, [files, typePillFilter, activeFolderFilter, searchQuery, projectFilter, uploaderFilter, sortBy]);

  // Paginated files
  const paginatedFiles = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredFiles.slice(startIndex, startIndex + pageSize);
  }, [filteredFiles, currentPage]);

  const totalPages = Math.ceil(filteredFiles.length / pageSize) || 1;

  
  // Reset page to 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [typePillFilter, searchQuery, projectFilter, uploaderFilter, dateFilter, sortBy, activeFolderFilter]);

  // Select all checkbox
  const handleToggleSelectAll = () => {
    const currentIds = paginatedFiles.map((f) => f.id);
    const allSelected = currentIds.length > 0 && currentIds.every((id) => selectedFileIds.includes(id));
    if (allSelected) {
      setSelectedFileIds((prev) => prev.filter((id) => !currentIds.includes(id)));
    } else {
      setSelectedFileIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const handleToggleSelectFile = (id) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Real-time File Download Handler
  const handleDownloadFile = (file) => {
    if (!file) return;

    const fileName = file.name || "download.txt";
    const ext = fileName.split(".").pop().toLowerCase();

    // Helper to trigger browser download
    const executeDownload = (blob, name) => {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    };

    // 1. If user uploaded this actual file from their PC in this session, download original file
    if (uploadedFileStore.has(file.id)) {
      const originalFile = uploadedFileStore.get(file.id);
      executeDownload(originalFile, fileName);
      return;
    }

    // 2. Otherwise generate a genuine, formatted file matching the extension in real time
    if (ext === "pdf") {
      const safeName = (file.name || "Document.pdf").replace(/[^a-zA-Z0-9._ -]/g, "");
      const safeProject = (file.project || "TeamFlow AI").replace(/[^a-zA-Z0-9._ -]/g, "");
      const safeUploader = (file.uploader || "Team Member").replace(/[^a-zA-Z0-9._ -]/g, "");
      const safeDate = (file.date || "Oct 27, 2024").replace(/[^a-zA-Z0-9._ -]/g, "");
      const safeDesc = (file.description || "Project document and collaborative workspace asset.").replace(/[^a-zA-Z0-9._ -]/g, "");

      const pdfData = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj
4 0 obj
<< /Length 460 >>
stream
BT
/F1 22 Tf
50 720 Td
(TeamFlow AI - ${safeName}) Tj
0 -36 Td
/F2 13 Tf
(Project: ${safeProject}   |   Uploaded by: ${safeUploader}) Tj
0 -24 Td
(Date: ${safeDate}   |   File Size: ${file.size || "1.2 MB"}) Tj
0 -32 Td
(Description: ${safeDesc}) Tj
0 -40 Td
(Summary of Deliverables:) Tj
0 -22 Td
(- Verified against project requirements and milestone objectives.) Tj
0 -20 Td
(- Synchronized with TeamFlow AI enterprise cloud storage.) Tj
0 -20 Td
(- Certified for engineering and design team collaboration.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000754 00000 n 
0000000827 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
895
%%EOF`;
      const pdfBlob = new Blob([pdfData], { type: "application/pdf" });
      executeDownload(pdfBlob, fileName);
    } else if (ext === "csv" || ext === "xlsx" || ext === "xls") {
      const csvData = `Record ID,File Name,Project,Status,Category,Uploaded By,Date,Size,Description
1,"${file.name}","${file.project || "TeamFlow Website"}",Approved,"${file.category || "Spreadsheet"}","${file.uploader || "John Doe"}","${file.date || "Oct 24, 2024"}","${file.size || "1.2 MB"}","${file.description || "QA test cases and verification checklist"}"
2,"API Documentation","Backend API",In Review,Documentation,Rahul Sharma,Oct 23,856 KB,API endpoints and request format schemas
3,"Sprint Velocity","Mobile App",Finalized,Reporting,Amit Verma,Oct 22,2.4 MB,Sprint 4 story points and velocity metrics
4,"Design Tokens","TeamFlow Website",Approved,UI/UX,Priya Patel,Oct 21,1.8 MB,Color swatches and typography standards`;
      const csvBlob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      executeDownload(csvBlob, fileName);
    } else if (["png", "jpg", "jpeg"].includes(ext)) {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 560;
        const ctx = canvas.getContext("2d");

        // Gradient Background
        const grad = ctx.createLinearGradient(0, 0, 800, 560);
        grad.addColorStop(0, "#4F46E5");
        grad.addColorStop(1, "#7C3AED");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 560);

        // White card container
        ctx.fillStyle = "#FFFFFF";
        if (ctx.roundRect) ctx.roundRect(40, 40, 720, 480, 16);
        else ctx.rect(40, 40, 720, 480);
        ctx.fill();

        // Card Content
        ctx.fillStyle = "#0F172A";
        ctx.font = "bold 26px sans-serif";
        ctx.fillText(file.name, 70, 110);

        ctx.fillStyle = "#64748B";
        ctx.font = "16px sans-serif";
        ctx.fillText(`${file.project || "TeamFlow AI"} • ${file.size || "1.8 MB"}`, 70, 145);

        ctx.strokeStyle = "#E2E8F0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(70, 175);
        ctx.lineTo(730, 175);
        ctx.stroke();

        ctx.fillStyle = "#334155";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("Description:", 70, 220);

        ctx.fillStyle = "#475569";
        ctx.font = "15px sans-serif";
        ctx.fillText(file.description || "Project visual asset and UI mockup.", 70, 255);

        ctx.fillStyle = "#94A3B8";
        ctx.font = "14px sans-serif";
        ctx.fillText(`Uploaded by: ${file.uploader || "John Doe"} • Date: ${file.date || "Oct 2024"}`, 70, 310);

        // Watermark badge
        ctx.fillStyle = "#4F46E5";
        if (ctx.roundRect) ctx.roundRect(70, 370, 150, 40, 8);
        else ctx.rect(70, 370, 150, 40);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText("TeamFlow AI", 98, 395);

        canvas.toBlob((blob) => {
          if (blob) executeDownload(blob, fileName);
          else {
            const fallbackBlob = new Blob([file.description || "TeamFlow AI Image Asset"], { type: "text/plain;charset=utf-8" });
            executeDownload(fallbackBlob, fileName);
          }
        }, "image/png");
      } catch {
        const fallbackBlob = new Blob([file.description || "TeamFlow AI Image Asset"], { type: "text/plain;charset=utf-8" });
        executeDownload(fallbackBlob, fileName);
      }
    } else if (ext === "json") {
      const jsonData = JSON.stringify(file, null, 2);
      const jsonBlob = new Blob([jsonData], { type: "application/json;charset=utf-8" });
      executeDownload(jsonBlob, fileName);
    } else {
      // Document / Text File
      const docData = `=======================================================
TEAMFLOW AI - ENTERPRISE DOCUMENT EXPORT
=======================================================
File Name:    ${file.name}
Project:      ${file.project || "TeamFlow Website"}
Category:     ${file.category || "Project Document"}
Folder:       ${file.folder || "Project Documents"}
Uploaded By:  ${file.uploader || "John Doe"}
Date:         ${file.date || "Oct 24, 2024"}
File Size:    ${file.size || "1.4 MB"}

DESCRIPTION:
${file.description || "Project document and collaborative workspace asset."}

-------------------------------------------------------
DOCUMENT CONTENT & SPECIFICATIONS:
1. Executive Summary:
   This document outlines the core specifications, design guidelines,
   and development deliverables for ${file.project || "TeamFlow AI"}.

2. Team Collaborators:
   - Rahul Sharma (Lead Developer)
   - Priya Patel (UI/UX Designer)
   - Amit Verma (Backend Engineer)
   - Sneha Rao (QA Engineer)

3. Status & Approvals:
   - Sprint Review: Completed & Signed off
   - CI/CD Deployment: Passed staging tests
   - Security Audit: Compliant with WCAG & SOC2 standards

Generated and downloaded in real time from TeamFlow AI.
=======================================================`;
      const docBlob = new Blob([docData], { type: "text/plain;charset=utf-8" });
      executeDownload(docBlob, fileName);
    }
  };

  // Delete File
  const handleDeleteFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setSelectedFileIds((prev) => prev.filter((item) => item !== id));
    uploadedFileStore.delete(id);
    setActiveRowMenuId(null);
    showToast("File deleted from workspace.");
  };

  // Handle Upload Submission
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.name.trim() && !selectedFile) {
      return;
    }

    const finalName = uploadForm.name.trim() || selectedFile?.name || "Uploaded_Document.pdf";
    const ext = finalName.split(".").pop().toLowerCase();

    let calculatedType = "Document";
    let pillClass = "Document";

    if (ext === "pdf") {
      calculatedType = "PDF";
      pillClass = "PDF";
    } else if (["png", "jpg", "jpeg", "svg", "webp", "gif"].includes(ext)) {
      calculatedType = "Images";
      pillClass = "Image";
    } else if (["xlsx", "xls", "csv"].includes(ext)) {
      calculatedType = "Spreadsheets";
      pillClass = "Spreadsheet";
    } else if (["pptx", "ppt"].includes(ext)) {
      calculatedType = "Presentations";
      pillClass = "Presentation";
    } else if (["zip", "tar", "rar", "7z"].includes(ext)) {
      calculatedType = "Others";
      pillClass = "Archive";
    } else if (["mp4", "mov", "avi"].includes(ext)) {
      calculatedType = "Others";
      pillClass = "Video";
    }

    const fileSizeFormatted = selectedFile?.size
      ? formatBytes(selectedFile.size)
      : "1.5 MB";
    const sizeBytes = selectedFile?.size || 1572864;

    const currentProfile = getEmployeeProfile();

    const today = new Date();
    const dateFormatted = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newFile = {
      id: `f-${Date.now()}`,
      name: finalName,
      description: uploadForm.description || "Uploaded project document",
      project: uploadForm.project,
      type: pillClass,
      typePill: pillClass,
      category: calculatedType,
      size: fileSizeFormatted,
      sizeBytes: sizeBytes,
      uploader: currentProfile?.fullName || "John Doe",
      isCurrentUser: true,
      uploaderAvatar: currentProfile?.photo || avatars.john,
      date: dateFormatted,
      time: today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      folder: uploadForm.folder || "Project Documents",
    };

    // Store actual uploaded File object in memory for real-time 1:1 download
    if (selectedFile) {
      uploadedFileStore.set(newFile.id, selectedFile);
    }

    setFiles((prev) => [newFile, ...prev]);
    handleCloseUploadModal();
  };

  // Handle Create Folder
  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newF = {
      id: `fol-${Date.now()}`,
      name: newFolderName.trim(),
      count: 0,
    };

    setFolders((prev) => [...prev, newF]);
    setNewFolderModalOpen(false);
    setNewFolderName("");
    showToast(`Folder "${newF.name}" created!`);
  };

  // Render File Icon
  const renderFileIcon = (file) => {
    if (file.name.endsWith(".pdf") || file.type === "PDF") {
      return (
        <div className="tf-file-icon-square red">
          <span className="tf-file-type-abbr">pdf</span>
        </div>
      );
    }
    if (file.type === "Image" || /\.(png|jpg|jpeg)$/i.test(file.name)) {
      return (
        <div className="tf-file-icon-square blue">
          <ImageIcon size={15} />
        </div>
      );
    }
    if (file.name.endsWith(".docx") || file.type === "Document") {
      return (
        <div className="tf-file-icon-square blue-doc">
          <FileText size={15} />
        </div>
      );
    }
    if (file.name.endsWith(".xlsx") || file.type === "Spreadsheet") {
      return (
        <div className="tf-file-icon-square green">
          <FileSpreadsheet size={15} />
        </div>
      );
    }
    if (file.name.endsWith(".pptx") || file.type === "Presentation") {
      return (
        <div className="tf-file-icon-square orange">
          <span className="tf-file-type-abbr">ppt</span>
        </div>
      );
    }
    if (file.name.endsWith(".zip") || file.type === "Archive") {
      return (
        <div className="tf-file-icon-square yellow">
          <FileArchive size={15} />
        </div>
      );
    }
    return (
      <div className="tf-file-icon-square gray">
        <FileText size={15} />
      </div>
    );
  };

  // Render Type Pill
  const renderTypePill = (type) => {
    const lower = (type || "").toLowerCase();
    let cls = "tf-type-pill";

    if (lower === "pdf") cls += " red";
    else if (lower === "image") cls += " purple";
    else if (lower === "document") cls += " blue";
    else if (lower === "spreadsheet") cls += " green";
    else if (lower === "presentation") cls += " orange";
    else if (lower === "text") cls += " gray";
    else if (lower === "archive") cls += " yellow";

    return <span className={cls}>{type}</span>;
  };

  return (
    <EmployeeShell
      activeRoute="/employee/files"
      searchPlaceholder="Search files, projects, tasks, or keywords..."
    >
      <div className="tf-files-page">
        {/* Toast */}
        {toastMessage && (
          <div className="tf-files-toast">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ====================================================================
            PAGE HEADER (Title + Subtitle + Upload File Button)
            ==================================================================== */}
        <header className="tf-files-header-bar">
          <div className="tf-files-title-group">
            <h1>My Files</h1>
            <p>Access and manage your files. Upload, download and organize your project files and personal files.</p>
          </div>

          <button
            type="button"
            className="tf-upload-btn-top"
            onClick={() => setUploadModalOpen(true)}
          >
            <Plus size={16} strokeWidth={2.4} />
            <span>Upload File</span>
          </button>
        </header>

        {/* ====================================================================
            TOP 4 SUMMARY KPI CARDS
            ==================================================================== */}
        <section className="tf-files-kpi-grid">
          {/* Card 1: Total Files */}
          <div className="tf-files-kpi-card" onClick={() => setTypePillFilter("All")}>
            <div className="tf-kpi-icon-box purple">
              <FileText size={20} />
            </div>
            <div className="tf-kpi-info">
              <span className="tf-kpi-label">Total Files</span>
              <strong className="tf-kpi-value">{totalFilesCount}</strong>
              <span className="tf-kpi-sub">All files in your access</span>
            </div>
          </div>

          {/* Card 2: Project Files */}
          <div className="tf-files-kpi-card">
            <div className="tf-kpi-icon-box blue">
              <Folder size={20} />
            </div>
            <div className="tf-kpi-info">
              <span className="tf-kpi-label">Project Files</span>
              <strong className="tf-kpi-value">{projectFilesCount}</strong>
              <span className="tf-kpi-sub">From assigned projects</span>
            </div>
          </div>

          {/* Card 3: My Uploads */}
          <div
            className="tf-files-kpi-card"
            onClick={() => {
              setUploaderFilter("You");
              showToast("Filtered by your uploads");
            }}
          >
            <div className="tf-kpi-icon-box green">
              <User size={20} />
            </div>
            <div className="tf-kpi-info">
              <span className="tf-kpi-label">My Uploads</span>
              <strong className="tf-kpi-value">{myUploadsCount}</strong>
              <span className="tf-kpi-sub">Files uploaded by you</span>
            </div>
          </div>

          {/* Card 4: Storage Used */}
          <div className="tf-files-kpi-card storage-card">
            <div className="tf-kpi-icon-box yellow">
              <Database size={20} />
            </div>
            <div className="tf-kpi-info full-width">
              <span className="tf-kpi-label">Storage Used</span>
              <strong className="tf-kpi-value">1.2 GB / 5 GB</strong>
              <div className="tf-storage-bar-wrap">
                <div className="tf-storage-bar-track">
                  <div className="tf-storage-bar-fill" style={{ width: "24%" }} />
                </div>
                <span className="tf-storage-percent">24%</span>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            MAIN TWO-COLUMN WORKSPACE
            Left: Filter bar + Files Table (73%)
            Right: Storage Usage + Recent Files + Folders (27%)
            ==================================================================== */}
        <div className="tf-files-layout-row">
          {/* ------------------------------------------------------------------
              LEFT COLUMN: Table & Filters
              ------------------------------------------------------------------ */}
          <div className="tf-files-left-column">
            {/* Type Filter Pills */}
            <div className="tf-files-type-pills-row">
              <button
                type="button"
                className={`tf-type-filter-pill ${typePillFilter === "All" ? "active" : ""}`}
                onClick={() => setTypePillFilter("All")}
              >
                All Files ({totalFilesCount})
              </button>
              <button
                type="button"
                className={`tf-type-filter-pill ${typePillFilter === "Documents" ? "active" : ""}`}
                onClick={() => setTypePillFilter("Documents")}
              >
                Documents ({docCount})
              </button>
              <button
                type="button"
                className={`tf-type-filter-pill ${typePillFilter === "Images" ? "active" : ""}`}
                onClick={() => setTypePillFilter("Images")}
              >
                Images ({imgCount})
              </button>
              <button
                type="button"
                className={`tf-type-filter-pill ${typePillFilter === "PDF" ? "active" : ""}`}
                onClick={() => setTypePillFilter("PDF")}
              >
                PDF ({pdfCount})
              </button>
              <button
                type="button"
                className={`tf-type-filter-pill ${typePillFilter === "Spreadsheets" ? "active" : ""}`}
                onClick={() => setTypePillFilter("Spreadsheets")}
              >
                Spreadsheets ({sheetCount})
              </button>
              <button
                type="button"
                className={`tf-type-filter-pill ${typePillFilter === "Presentations" ? "active" : ""}`}
                onClick={() => setTypePillFilter("Presentations")}
              >
                Presentations ({pptCount})
              </button>
              <button
                type="button"
                className={`tf-type-filter-pill ${typePillFilter === "Others" ? "active" : ""}`}
                onClick={() => setTypePillFilter("Others")}
              >
                Others ({othersCount})
              </button>
            </div>

            {/* Filter Controls Bar: Search + Dropdowns */}
            <div className="tf-files-controls-bar">
              {/* Search */}
              <div className="tf-files-search-wrap">
                <Search size={14} className="tf-files-search-icon" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="tf-search-clear-btn"
                    onClick={() => setSearchQuery("")}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Project Dropdown */}
              <div className="tf-files-dropdown-wrap" ref={projectDropRef}>
                <button
                  type="button"
                  className="tf-files-select-btn"
                  onClick={() => setProjectDropOpen(!projectDropOpen)}
                >
                  <span>Project: {projectFilter}</span>
                  <ChevronDown size={14} />
                </button>

                {projectDropOpen && (
                  <div className="tf-files-dropdown-menu">
                    {["All", "TeamFlow Website", "Mobile App", "AI Integration", "Marketing Portal", "General"].map(
                      (p) => (
                        <button
                          key={p}
                          type="button"
                          className={`tf-drop-item ${projectFilter === p ? "active" : ""}`}
                          onClick={() => {
                            setProjectFilter(p);
                            setProjectDropOpen(false);
                          }}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Uploaded By Dropdown */}
              <div className="tf-files-dropdown-wrap" ref={uploaderDropRef}>
                <button
                  type="button"
                  className="tf-files-select-btn"
                  onClick={() => setUploaderDropOpen(!uploaderDropOpen)}
                >
                  <span>Uploaded By: {uploaderFilter}</span>
                  <ChevronDown size={14} />
                </button>

                {uploaderDropOpen && (
                  <div className="tf-files-dropdown-menu">
                    {["All", "You", "Rahul Sharma", "Amit Verma", "Sneha Patil", "Karan More"].map(
                      (u) => (
                        <button
                          key={u}
                          type="button"
                          className={`tf-drop-item ${uploaderFilter === u ? "active" : ""}`}
                          onClick={() => {
                            setUploaderFilter(u);
                            setUploaderDropOpen(false);
                          }}
                        >
                          {u}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Date Dropdown */}
              <div className="tf-files-dropdown-wrap" ref={dateDropRef}>
                <button
                  type="button"
                  className="tf-files-select-btn"
                  onClick={() => setDateDropOpen(!dateDropOpen)}
                >
                  <span>Date: {dateFilter}</span>
                  <ChevronDown size={14} />
                </button>

                {dateDropOpen && (
                  <div className="tf-files-dropdown-menu">
                    {["All Time", "Today", "This Week", "This Month"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={`tf-drop-item ${dateFilter === d ? "active" : ""}`}
                        onClick={() => {
                          setDateFilter(d);
                          setDateDropOpen(false);
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="tf-files-dropdown-wrap" ref={sortDropRef}>
                <button
                  type="button"
                  className="tf-files-select-btn sort-btn"
                  onClick={() => setSortDropOpen(!sortDropOpen)}
                >
                  <ArrowUpDown size={13} className="tf-sort-icon" />
                  <span>Sort by: {sortBy}</span>
                  <ChevronDown size={14} />
                </button>

                {sortDropOpen && (
                  <div className="tf-files-dropdown-menu right">
                    {["Recent", "Name A-Z", "Size"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`tf-drop-item ${sortBy === s ? "active" : ""}`}
                        onClick={() => {
                          setSortBy(s);
                          setSortDropOpen(false);
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Folder Filter Active Banner */}
            {activeFolderFilter && (
              <div className="tf-active-folder-banner">
                <span>Filtering by folder: <strong>{activeFolderFilter}</strong></span>
                <button
                  type="button"
                  className="tf-clear-folder-btn"
                  onClick={() => setActiveFolderFilter(null)}
                >
                  Clear <X size={12} />
                </button>
              </div>
            )}

            {/* Files Table Card */}
            <div className="tf-files-table-card">
              <div className="tf-table-responsive">
                                <table className="tf-files-table">
                  <colgroup>
                    <col style={{ width: "48px" }} />
                    <col style={{ width: "36px" }} />
                    <col style={{ width: "auto" }} />
                    <col style={{ width: "135px" }} />
                    <col style={{ width: "85px" }} />
                    <col style={{ width: "80px" }} />
                    <col style={{ width: "135px" }} />
                    <col style={{ width: "115px" }} />
                    <col style={{ width: "90px" }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="tf-th-num">Sr</th>
                      <th className="th-check">
                        <input
                          type="checkbox"
                          className="tf-checkbox"
                          checked={
                            paginatedFiles.length > 0 &&
                            paginatedFiles.every((f) => selectedFileIds.includes(f.id))
                          }
                          onChange={handleToggleSelectAll}
                        />
                      </th>
                      <th className="th-name">Name</th>
                      <th className="th-project">Project</th>
                      <th className="th-type">Type</th>
                      <th className="th-size">Size</th>
                      <th className="th-uploader">Uploaded By</th>
                      <th className="th-date">Date</th>
                      <th className="th-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFiles.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="tf-empty-table-cell">
                          <FileText size={32} color="#94A3B8" />
                          <p>No files found matching your search or filters.</p>
                          <button
                            type="button"
                            className="tf-btn-secondary"
                            onClick={() => {
                              setTypePillFilter("All");
                              setSearchQuery("");
                              setProjectFilter("All");
                              setUploaderFilter("All");
                              setDateFilter("All Time");
                              setActiveFolderFilter(null);
                            }}
                          >
                            Reset Filters
                          </button>
                        </td>
                      </tr>
                    ) : (
                      paginatedFiles.map((file, idx) => {
                        const isSelected = selectedFileIds.includes(file.id);

                        return (
                          <tr
                            key={file.id}
                            className={`tf-file-row ${isSelected ? "selected" : ""}`}
                          >
                            {/* Checkbox */}
                            <td className="tf-td-num">
                              <span className="tf-row-num-badge">
                                {(currentPage - 1) * pageSize + idx + 1}
                              </span>
                            </td>
                            <td className="td-check">
                              <input
                                type="checkbox"
                                className="tf-checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectFile(file.id)}
                              />
                            </td>

                            {/* Name & Subtitle */}
                            <td className="td-name">
                              <div className="tf-file-name-cell">
                                {renderFileIcon(file)}
                                <div className="tf-file-name-texts">
                                  <strong
                                    className="tf-file-title"
                                    onClick={() => setPreviewFileModal(file)}
                                  >
                                    {file.name}
                                  </strong>
                                  <span className="tf-file-desc">{file.description}</span>
                                </div>
                              </div>
                            </td>

                            {/* Project */}
                            <td className="td-project">
                              <span className="tf-project-name">{file.project}</span>
                            </td>

                            {/* Type */}
                            <td className="td-type">
                              {renderTypePill(file.typePill || file.type)}
                            </td>

                            {/* Size */}
                            <td className="td-size">
                              <span className="tf-size-text">{file.size}</span>
                            </td>

                            {/* Uploaded By */}
                            <td className="td-uploader">
                              <div className="tf-uploader-cell">
                                <img
                                  src={file.uploaderAvatar}
                                  alt={file.uploader}
                                  className="tf-uploader-avatar"
                                />
                                <div className="tf-uploader-texts">
                                  <span className="tf-uploader-name">{file.uploader}</span>
                                  {file.isCurrentUser && (
                                    <span className="tf-uploader-you">You</span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Date */}
                            <td className="td-date">
                              <div className="tf-date-cell">
                                <span className="tf-date-line">{file.date}</span>
                                <span className="tf-time-line">{file.time}</span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="td-actions">
                              <div className="tf-actions-group">
                                {/* Download */}
                                <button
                                  type="button"
                                  className="tf-action-btn"
                                  onClick={() => handleDownloadFile(file)}
                                  title="Download file"
                                >
                                  <Download size={14} />
                                </button>

                                {/* Preview */}
                                <button
                                  type="button"
                                  className="tf-action-btn"
                                  onClick={() => setPreviewFileModal(file)}
                                  title="Preview file"
                                >
                                  <Eye size={14} />
                                </button>

                                {/* More Menu */}
                                <div className="tf-action-more-wrap">
                                  <button
                                    type="button"
                                    className="tf-action-btn"
                                    onClick={() =>
                                      setActiveRowMenuId(
                                        activeRowMenuId === file.id ? null : file.id
                                      )
                                    }
                                    title="More options"
                                  >
                                    <MoreVertical size={14} />
                                  </button>

                                  {activeRowMenuId === file.id && (
                                    <div className="tf-row-popover-menu" ref={rowMenuRef}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleDownloadFile(file);
                                          setActiveRowMenuId(null);
                                        }}
                                      >
                                        <Download size={13} />
                                        <span>Download</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setPreviewFileModal(file);
                                          setActiveRowMenuId(null);
                                        }}
                                      >
                                        <Eye size={13} />
                                        <span>Preview Details</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          navigator.clipboard?.writeText(
                                            `https://teamflow.ai/files/${file.id}`
                                          );
                                          showToast("Share link copied to clipboard!");
                                          setActiveRowMenuId(null);
                                        }}
                                      >
                                        <Copy size={13} />
                                        <span>Copy Link</span>
                                      </button>
                                      <button
                                        type="button"
                                        className="danger"
                                        onClick={() => handleDeleteFile(file.id)}
                                      >
                                        <Trash2 size={13} />
                                        <span>Delete File</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer: Showing count + Pagination */}
              <footer className="tf-files-table-footer">
                <span className="tf-footer-showing-text">
                  Showing {filteredFiles.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, filteredFiles.length)} of{" "}
                  {filteredFiles.length} files
                </span>

                <div className="tf-footer-pagination-group">
                  <button
                    type="button"
                    className="tf-page-nav-arrow"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      type="button"
                      className={`tf-page-num-btn ${currentPage === pg ? "active" : ""}`}
                      onClick={() => setCurrentPage(pg)}
                    >
                      {pg}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="tf-page-nav-arrow"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  >
                    <ChevronRight size={16} />
                  </button>

                  <div className="tf-page-size-badge">
                    <span>10 per page</span>
                    <ChevronDown size={13} />
                  </div>
                </div>
              </footer>
            </div>
          </div>

          {/* ------------------------------------------------------------------
              RIGHT COLUMN: Storage Usage + Recent Files + Folders
              ------------------------------------------------------------------ */}
          <div className="tf-files-right-column">
            {/* Card 1: Storage Usage */}
            <article className="tf-side-card tf-storage-usage-card">
              <div className="tf-side-card-header">
                <h3>Storage Usage</h3>
              </div>

              <div className="tf-storage-top-info">
                <span className="tf-storage-fraction">1.2 GB of 5 GB used</span>
                <span className="tf-storage-percent-tag">29%</span>
              </div>

              {/* Progress bar with green / blue fill */}
              <div className="tf-storage-progress-track">
                <div className="tf-storage-progress-bar" style={{ width: "29%" }} />
              </div>

              {/* Category Breakdown */}
              <div className="tf-storage-breakdown-list">
                <div className="tf-breakdown-row">
                  <div className="tf-breakdown-left">
                    <span className="tf-dot blue" />
                    <span>Documents</span>
                  </div>
                  <strong className="tf-breakdown-size">450 MB</strong>
                </div>

                <div className="tf-breakdown-row">
                  <div className="tf-breakdown-left">
                    <span className="tf-dot orange" />
                    <span>Images</span>
                  </div>
                  <strong className="tf-breakdown-size">320 MB</strong>
                </div>

                <div className="tf-breakdown-row">
                  <div className="tf-breakdown-left">
                    <span className="tf-dot purple" />
                    <span>Videos</span>
                  </div>
                  <strong className="tf-breakdown-size">0 MB</strong>
                </div>

                <div className="tf-breakdown-row">
                  <div className="tf-breakdown-left">
                    <span className="tf-dot green" />
                    <span>Others</span>
                  </div>
                  <strong className="tf-breakdown-size">430 MB</strong>
                </div>
              </div>
            </article>

            {/* Card 2: Recent Files */}
            <article className="tf-side-card tf-recent-files-card">
              <div className="tf-side-card-header">
                <h3>Recent Files</h3>
                <button
                  type="button"
                  className="tf-side-card-link"
                  onClick={() => {
                    setTypePillFilter("All");
                    showToast("Showing all files.");
                  }}
                >
                  View all <ChevronRight size={13} />
                </button>
              </div>

              <div className="tf-recent-files-list">
                {/* 1. Project Requirements.pdf */}
                <div
                  className="tf-recent-file-item"
                  onClick={() => setPreviewFileModal(files[0])}
                >
                  <div className="tf-recent-icon red">
                    <span>pdf</span>
                  </div>
                  <div className="tf-recent-texts">
                    <strong>Project Requirements.pdf</strong>
                    <span>Oct 24, 2024 • 2.4 MB</span>
                  </div>
                </div>

                {/* 2. Login Page Design.png */}
                <div
                  className="tf-recent-file-item"
                  onClick={() => setPreviewFileModal(files[1])}
                >
                  <div className="tf-recent-icon blue">
                    <ImageIcon size={14} />
                  </div>
                  <div className="tf-recent-texts">
                    <strong>Login Page Design.png</strong>
                    <span>Oct 23, 2024 • 1.8 MB</span>
                  </div>
                </div>

                {/* 3. API Documentation.docx */}
                <div
                  className="tf-recent-file-item"
                  onClick={() => setPreviewFileModal(files[2])}
                >
                  <div className="tf-recent-icon blue-doc">
                    <FileText size={14} />
                  </div>
                  <div className="tf-recent-texts">
                    <strong>API Documentation.docx</strong>
                    <span>Oct 22, 2024 • 856 KB</span>
                  </div>
                </div>

                {/* 4. Test Cases.xlsx */}
                <div
                  className="tf-recent-file-item"
                  onClick={() => setPreviewFileModal(files[3])}
                >
                  <div className="tf-recent-icon green">
                    <FileSpreadsheet size={14} />
                  </div>
                  <div className="tf-recent-texts">
                    <strong>Test Cases.xlsx</strong>
                    <span>Oct 21, 2024 • 1.2 MB</span>
                  </div>
                </div>

                {/* 5. Sprint Review.pptx */}
                <div
                  className="tf-recent-file-item"
                  onClick={() => setPreviewFileModal(files[4])}
                >
                  <div className="tf-recent-icon orange">
                    <span>ppt</span>
                  </div>
                  <div className="tf-recent-texts">
                    <strong>Sprint Review.pptx</strong>
                    <span>Oct 20, 2024 • 3.1 MB</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 3: My File Folders */}
            <article className="tf-side-card tf-file-folders-card">
              <div className="tf-side-card-header">
                <h3>My File Folders</h3>
                <button
                  type="button"
                  className="tf-side-card-btn-action"
                  onClick={() => setNewFolderModalOpen(true)}
                >
                  + New Folder
                </button>
              </div>

              <div className="tf-folders-list">
                {folders.map((fol) => {
                  const isActive = activeFolderFilter === fol.name;

                  return (
                    <div
                      key={fol.id}
                      className={`tf-folder-item ${isActive ? "active" : ""}`}
                      onClick={() => {
                        if (isActive) {
                          setActiveFolderFilter(null);
                          showToast("Cleared folder filter");
                        } else {
                          setActiveFolderFilter(fol.name);
                          showToast(`Filtered by folder: ${fol.name}`);
                        }
                      }}
                    >
                      <div className="tf-folder-left">
                        <div className="tf-folder-yellow-icon">
                          <Folder size={18} fill="#F59E0B" color="#D97706" />
                        </div>
                        <div className="tf-folder-info">
                          <strong>{fol.name}</strong>
                          <span>{fol.count} files</span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="tf-folder-arrow" />
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </div>

        {/* ====================================================================
            MODAL 1: UPLOAD FILE MODAL (Interactive PC Browser & Metadata)
            ==================================================================== */}
        {uploadModalOpen && (
          <div
            className="tf-files-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCloseUploadModal();
            }}
          >
            <div className="tf-files-modal-card upload-modal-card" role="dialog" aria-modal="true">
              <div className="tf-files-modal-header">
                <div className="tf-modal-title-wrap">
                  <div className="tf-modal-icon-badge purple">
                    <Upload size={18} />
                  </div>
                  <div>
                    <h3>Upload New File</h3>
                    <p>Select a file from your PC and enter file details.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={handleCloseUploadModal}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="tf-files-modal-body">
                {/* 1. PC File Browser / Drag & Drop Area */}
                <div className="tf-form-field">
                  <label>Choose File from PC *</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />

                  <div
                    className={`tf-upload-dropzone ${dragOver ? "drag-over" : ""} ${selectedFile ? "has-file" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDropFile}
                    onClick={() => {
                      if (!selectedFile) fileInputRef.current?.click();
                    }}
                  >
                    {!selectedFile ? (
                      <div className="tf-dropzone-empty">
                        <div className="tf-dropzone-icon-circle">
                          <Upload size={22} />
                        </div>
                        <div className="tf-dropzone-prompt">
                          <span className="tf-dropzone-action-btn" onClick={() => fileInputRef.current?.click()}>
                            Browse File from PC
                          </span>
                          <span className="tf-dropzone-sub">or drag and drop your file here</span>
                        </div>
                        <div className="tf-dropzone-badges">
                          <span>PDF</span>
                          <span>PNG/JPG</span>
                          <span>DOCX</span>
                          <span>XLSX</span>
                          <span>PPTX</span>
                          <span>ZIP</span>
                        </div>
                      </div>
                    ) : (
                      <div className="tf-dropzone-selected-card">
                        <div className="tf-selected-file-left">
                          <div className="tf-selected-file-icon">
                            {renderFileIcon({ name: selectedFile.name, type: "" })}
                          </div>
                          <div className="tf-selected-file-meta">
                            <strong className="tf-selected-file-name" title={selectedFile.name}>
                              {selectedFile.name}
                            </strong>
                            <span className="tf-selected-file-size">
                              {formatBytes(selectedFile.size)} • Ready to upload
                            </span>
                          </div>
                        </div>
                        <div className="tf-selected-file-actions">
                          <button
                            type="button"
                            className="tf-dropzone-change-btn"
                            onClick={() => fileInputRef.current?.click()}
                            title="Choose another file from PC"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            className="tf-dropzone-remove-btn"
                            onClick={handleRemoveSelectedFile}
                            title="Remove selected file"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. File Name */}
                <div className="tf-form-field">
                  <label>File Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sprint_Backlog.pdf or Homepage_Mockup.png"
                    value={uploadForm.name}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, name: e.target.value })
                    }
                  />
                </div>

                {/* 3. Description */}
                <div className="tf-form-field">
                  <label>Description</label>
                  <textarea
                    rows={2}
                    placeholder="Provide a brief description or notes for this file..."
                    value={uploadForm.description}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, description: e.target.value })
                    }
                    className="tf-form-textarea"
                  />
                </div>

                {/* 4. Project & Folder Destination */}
                <div className="tf-form-row">
                  <div className="tf-form-field">
                    <label>Project</label>
                    <select
                      value={uploadForm.project}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, project: e.target.value })
                      }
                    >
                      <option value="TeamFlow Website">TeamFlow Website</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="AI Integration">AI Integration</option>
                      <option value="Marketing Portal">Marketing Portal</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div className="tf-form-field">
                    <label>Folder Destination</label>
                    <select
                      value={uploadForm.folder}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, folder: e.target.value })
                      }
                    >
                      {folders.map((f) => (
                        <option key={f.id} value={f.name}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="tf-files-modal-actions">
                  <button
                    type="button"
                    className="tf-btn-secondary"
                    onClick={handleCloseUploadModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="tf-btn-primary">
                    <Upload size={15} /> Upload File
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ====================================================================
            MODAL 2: FILE PREVIEW MODAL
            ==================================================================== */}
        {previewFileModal && (
          <div
            className="tf-files-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setPreviewFileModal(null);
            }}
          >
            <div className="tf-files-modal-card preview-card" role="dialog" aria-modal="true">
              <div className="tf-files-modal-header">
                <div className="tf-modal-title-wrap">
                  {renderFileIcon(previewFileModal)}
                  <div>
                    <h3>{previewFileModal.name}</h3>
                    <p>{previewFileModal.project} • {previewFileModal.size}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setPreviewFileModal(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="tf-files-modal-body">
                <div className="tf-preview-info-box">
                  <p><strong>Description:</strong> {previewFileModal.description}</p>
                  <p><strong>Uploaded by:</strong> {previewFileModal.uploader}</p>
                  <p><strong>Uploaded on:</strong> {previewFileModal.date} at {previewFileModal.time}</p>
                  <p><strong>File Type:</strong> {previewFileModal.typePill || previewFileModal.type}</p>
                  <p><strong>Folder:</strong> {previewFileModal.folder || "Project Documents"}</p>
                </div>

                <div className="tf-preview-screen-sim">
                  <FileText size={48} color="#94A3B8" />
                  <p>Document preview ready for download</p>
                </div>

                <div className="tf-files-modal-actions">
                  <button
                    type="button"
                    className="tf-btn-secondary"
                    onClick={() => setPreviewFileModal(null)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="tf-btn-primary"
                    onClick={() => {
                      handleDownloadFile(previewFileModal);
                      setPreviewFileModal(null);
                    }}
                  >
                    <Download size={15} /> Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            MODAL 3: CREATE NEW FOLDER MODAL
            ==================================================================== */}
        {newFolderModalOpen && (
          <div
            className="tf-files-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setNewFolderModalOpen(false);
            }}
          >
            <div className="tf-files-modal-card" role="dialog" aria-modal="true">
              <div className="tf-files-modal-header">
                <div className="tf-modal-title-wrap">
                  <div className="tf-modal-icon-badge yellow">
                    <Folder size={18} />
                  </div>
                  <div>
                    <h3>Create New Folder</h3>
                    <p>Organize your project documents in custom folders.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setNewFolderModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateFolder} className="tf-files-modal-body">
                <div className="tf-form-field">
                  <label>Folder Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sprint Backups or UI Kits"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="tf-files-modal-actions">
                  <button
                    type="button"
                    className="tf-btn-secondary"
                    onClick={() => setNewFolderModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="tf-btn-primary">
                    <Folder size={15} /> Create Folder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </EmployeeShell>
  );
}

export default File;
