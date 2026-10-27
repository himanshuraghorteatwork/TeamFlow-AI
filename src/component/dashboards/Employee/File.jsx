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
import "./File.css";

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

  // Select all checkbox
  const handleToggleSelectAll = () => {
    if (selectedFileIds.length === paginatedFiles.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(paginatedFiles.map((f) => f.id));
    }
  };

  const handleToggleSelectFile = (id) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Download simulation
  const handleDownloadFile = (file) => {
    showToast(`Downloading "${file.name}" (${file.size})...`);
  };

  // Delete File
  const handleDeleteFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setSelectedFileIds((prev) => prev.filter((item) => item !== id));
    setActiveRowMenuId(null);
    showToast("File deleted from workspace.");
  };

  // Handle Upload Submission
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.name.trim()) return;

    let extension = uploadForm.name.split(".").pop()?.toUpperCase() || "FILE";
    let calculatedType = "Document";
    let pillClass = "Document";

    if (uploadForm.name.endsWith(".pdf")) {
      calculatedType = "PDF";
      pillClass = "PDF";
    } else if (/\.(png|jpe?g|svg|webp)$/i.test(uploadForm.name)) {
      calculatedType = "Images";
      pillClass = "Image";
    } else if (/\.(xlsx|xls|csv)$/i.test(uploadForm.name)) {
      calculatedType = "Spreadsheets";
      pillClass = "Spreadsheet";
    } else if (/\.(pptx|ppt)$/i.test(uploadForm.name)) {
      calculatedType = "Presentations";
      pillClass = "Presentation";
    } else if (/\.(zip|tar|rar)$/i.test(uploadForm.name)) {
      calculatedType = "Others";
      pillClass = "Archive";
    }

    const newFile = {
      id: `f-${Date.now()}`,
      name: uploadForm.name.trim(),
      description: uploadForm.description || "Uploaded project document",
      project: uploadForm.project,
      type: pillClass,
      typePill: pillClass,
      category: calculatedType,
      size: "1.4 MB",
      sizeBytes: 1400000,
      uploader: "John Doe",
      isCurrentUser: true,
      uploaderAvatar: avatars.john,
      date: "Oct 26, 2024",
      time: "Just now",
      folder: uploadForm.folder,
    };

    setFiles((prev) => [newFile, ...prev]);
    setUploadModalOpen(false);
    setUploadForm({
      name: "",
      project: "TeamFlow Website",
      category: "Documents",
      description: "",
      folder: "Project Documents",
    });
    showToast(`File "${newFile.name}" uploaded successfully!`);
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
                <Search size={14} className="tf-search-icon" />
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
                  <thead>
                    <tr>
                      <th className="th-check">
                        <input
                          type="checkbox"
                          className="tf-checkbox"
                          checked={
                            paginatedFiles.length > 0 &&
                            selectedFileIds.length === paginatedFiles.length
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
                        <td colSpan={8} className="tf-empty-table-cell">
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
                      paginatedFiles.map((file) => {
                        const isSelected = selectedFileIds.includes(file.id);

                        return (
                          <tr
                            key={file.id}
                            className={`tf-file-row ${isSelected ? "selected" : ""}`}
                          >
                            {/* Checkbox */}
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
                  Showing 1 to {Math.min(filteredFiles.length, pageSize)} of{" "}
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
            MODAL 1: UPLOAD FILE MODAL
            ==================================================================== */}
        {uploadModalOpen && (
          <div
            className="tf-files-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setUploadModalOpen(false);
            }}
          >
            <div className="tf-files-modal-card" role="dialog" aria-modal="true">
              <div className="tf-files-modal-header">
                <div className="tf-modal-title-wrap">
                  <div className="tf-modal-icon-badge purple">
                    <Upload size={18} />
                  </div>
                  <div>
                    <h3>Upload New File</h3>
                    <p>Add a project file or document to your TeamFlow storage.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-modal-close"
                  onClick={() => setUploadModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="tf-files-modal-body">
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
                    autoFocus
                  />
                </div>

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

                <div className="tf-form-field">
                  <label>Description / Notes</label>
                  <input
                    type="text"
                    placeholder="Brief description of the document"
                    value={uploadForm.description}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, description: e.target.value })
                    }
                  />
                </div>

                <div className="tf-files-modal-actions">
                  <button
                    type="button"
                    className="tf-btn-secondary"
                    onClick={() => setUploadModalOpen(false)}
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
