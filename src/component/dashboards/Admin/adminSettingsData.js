// src/component/dashboards/Admin/adminSettingsData.js

export const defaultAdminSettings = {
  general: {
    companyName: "ABC Technologies",
    platformName: "TeamFlow AI",
    supportEmail: "support@abctech.com",
    website: "https://abctech.com",
    subdomain: "abctech",
    orgLogo: "",
    timezone: "Asia/Kolkata",
    language: "English",
    dateFormat: "DD/MM/YYYY",
    currency: "USD ($)",
    maintenanceMode: false,
  },

  workspace: {
    defaultMemberLimit: 25,
    defaultStorage: 10,
    maxProjects: 20,
    defaultRole: "Member",
    allowWorkspaceCreation: true,
    requireWorkspaceApproval: false,
    allowGuestUsers: true,
    allowPublicProjects: false,
    autoDomainJoin: true,
  },

  security: {
    twoFactorAuth: true,
    ssoEnabled: false,
    ssoMetadataUrl: "https://auth.abctech.com/saml/metadata",
    strongPasswords: true,
    passwordExpiry: "90",
    loginAlerts: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    allowSocialLogin: true,
    ipAllowlist: "192.168.1.0/24, 10.0.0.0/16",
  },

  notifications: {
    emailNotifications: true,
    newUserNotification: true,
    paymentNotification: true,
    workspaceNotification: true,
    securityAlerts: true,
    weeklyReport: true,
    overdueEscalation: true,
    inactiveWorkspaceAlerts: true,
    marketingEmails: false,
  },

  ai: {
    aiEnabled: true,
    chatSummarizer: true,
    taskGenerator: true,
    bugFlowAI: true,
    meetingSummary: true,
    smartSearch: true,
    codeReviewer: true,
    model: "GPT-4o Mini (OpenAI)",
    monthlyLimit: 100000,
    apiKey: "sk-proj-tfai9948274a81bc920f...",
    customEndpoint: "",
  },

  email: {
    smtpHost: "smtp.teamflow.ai",
    smtpPort: "587",
    smtpUsername: "smtp-relay-admin",
    smtpPassword: "••••••••••••••••",
    senderName: "TeamFlow AI System",
    senderEmail: "noreply@abctech.com",
    encryption: "TLS",
  },

  privacy: {
    analyticsTracking: true,
    errorReporting: true,
    activityLogging: true,
    dataRetention: 365,
    cookieConsent: true,
    allowDataExport: true,
    anonymizeAuditLogs: false,
  },
};

export const timezoneOptions = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Dubai",
  "Australia/Sydney",
  "UTC",
];

export const languageOptions = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Portuguese",
  "Mandarin",
];

export const currencyOptions = [
  "USD ($)",
  "EUR (€)",
  "GBP (£)",
  "INR (₹)",
  "CAD ($)",
  "AUD ($)",
  "JPY (¥)",
  "SGD ($)",
];

export const aiModelOptions = [
  "GPT-4o (OpenAI)",
  "GPT-4o Mini (OpenAI)",
  "Claude 3.5 Sonnet (Anthropic)",
  "Gemini 1.5 Pro (Google)",
  "Llama 3.1 70B (Meta)",
  "Custom Enterprise Endpoint",
];

export const defaultRoleOptions = [
  "Member",
  "Admin",
  "Viewer / Read-Only",
  "Guest",
];
