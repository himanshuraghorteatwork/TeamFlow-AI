// src/component/AdminSettings/adminSettingsData.js

export const defaultAdminSettings = {
  general: {
    platformName: "TeamFlow AI",
    supportEmail: "support@teamflow.ai",
    companyName: "TeamFlow AI",
    timezone: "Asia/Kolkata",
    language: "English",
    dateFormat: "DD/MM/YYYY",
    maintenanceMode: false,
  },

  workspace: {
    allowWorkspaceCreation: true,
    requireWorkspaceApproval: false,
    defaultMemberLimit: 25,
    defaultStorage: 10,
    allowGuestUsers: true,
    allowPublicProjects: false,
  },

  security: {
    twoFactorAuth: true,
    strongPasswords: true,
    loginAlerts: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    allowSocialLogin: true,
  },

  notifications: {
    emailNotifications: true,
    newUserNotification: true,
    paymentNotification: true,
    workspaceNotification: true,
    securityAlerts: true,
    weeklyReport: true,
    marketingEmails: false,
  },

  ai: {
    aiEnabled: true,
    chatSummarizer: true,
    taskGenerator: true,
    bugFlowAI: true,
    meetingSummary: true,
    smartSearch: true,
    model: "GPT-4o Mini",
    monthlyLimit: 100000,
    apiKey: "",
  },

  email: {
    smtpHost: "smtp.teamflow.ai",
    smtpPort: "587",
    smtpUsername: "teamflow",
    smtpPassword: "",
    senderName: "TeamFlow AI",
    senderEmail: "noreply@teamflow.ai",
    encryption: "TLS",
  },

  privacy: {
    analyticsTracking: true,
    errorReporting: true,
    activityLogging: true,
    dataRetention: 365,
    cookieConsent: true,
    allowDataExport: true,
  },
};

export const timezoneOptions = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export const languageOptions = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Japanese",
];

export const aiModelOptions = [
  "GPT-4o",
  "GPT-4o Mini",
  "Custom Model",
];