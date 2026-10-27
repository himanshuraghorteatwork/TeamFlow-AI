import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  LayoutTemplate,
  Plus,
  Pencil,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  Send,
  X,
  Search,
  Download,
  SlidersHorizontal,
  RefreshCw,
  ShieldAlert,
  KeyRound,
  Receipt,
  CalendarDays,
  Table as TableIcon,
  Grid,
  Monitor,
  Smartphone,
  Mail,
  Lock,
  Unlock,
  Building2,
  Users,
  Trash2,
  Copy,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./EmailTemplates.css";

/* =========================================================================
   EMAIL TEMPLATES MASTER REPOSITORY
   Standardized with Company Branding & Tenant Identification
   Uses clean enterprise demo organizations (Acme, NovaTech, Apex, etc.)
   ========================================================================= */
const INITIAL_TEMPLATES = [
  {
    id: "TPL-1001",
    name: "Welcome & Account Activation",
    companyName: "TeamFlow AI",
    organizationName: "Acme Technologies",
    orgCode: "ORG-ACME-1001",
    category: "Authentication",
    themeColor: "#352fa8",
    themeBg: "#ede9fe",
    accentGradient: "linear-gradient(135deg, #352fa8 0%, #4338ca 100%)",
    icon: Sparkles,
    badgeText: "👋 Account Ready",
    subject: "Welcome to TeamFlow AI account for Acme Technologies",
    headline: "Welcome to your TeamFlow AI workspace",
    message: "Your account has been successfully configured for Acme Technologies. You can now log in and access all your workspace tools, team dashboards, and shared resources.\n\nPlease sign in with your work email and set up your permanent credentials.",
    ctaText: "Sign In to Workspace",
    ctaUrl: "https://app.teamflow.ai/login",
    footerNote: "Sent by TeamFlow AI for Acme Technologies",
    trigger: "auth.user.account_provisioned",
    triggerDescription: "Triggered instantly when a new team member account is provisioned",
    engine: "Liquid v5.4",
    openRate: 84.6,
    clickRate: 58.2,
    status: "Active",
    lastUpdated: "Today, 10:00 AM",
    lastAuthor: "Himanshu (Super Admin)",
    body: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <!-- 1. Top Bar: Solid Purple/Indigo with Logo & Company Name -->
  <div style="background: #352fa8; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; color: #ffffff;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span style="font-size: 17px; font-weight: 750; letter-spacing: -0.3px; color: #ffffff;">TeamFlow AI</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff; display: flex; align-items: center; gap: 4px;">
      👋 Account Ready
    </div>
  </div>

  <!-- 2. Email Inner Content -->
  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #4f46e5; margin-bottom: 12px;">
      WELCOME TO TEAMFLOW AI
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      Your TeamFlow AI account for Acme Technologies
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      You have been added to <strong>Acme Technologies</strong> on <strong>TeamFlow AI</strong>.
    </p>

    <p style="font-size: 13.5px; color: #334155; font-weight: 600; margin: 0 0 12px;">
      Sign in with:
    </p>

    <!-- Credential / Data Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; width: 30%; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;">
          EMAIL
        </td>
        <td style="padding: 12px 16px; color: #2563eb; font-weight: 600;">
          alex.johnson@acme.com
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;">
          PASSWORD
        </td>
        <td style="padding: 12px 16px; color: #0f172a; font-family: ui-monospace, SFMono-Regular, monospace; font-weight: 700; font-size: 13.5px;">
          Sec#992$Kla
        </td>
      </tr>
    </table>

    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 24px;">
      This password was generated for you securely. Use the button below to replace it with a password you remember, and then access your workspace.
    </p>

    <!-- Full-width CTA Button -->
    <div style="margin: 0 0 24px;">
      <a href="https://app.teamflow.ai/login" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #352fa8; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(53, 47, 168, 0.3);">
        Sign In to Workspace
      </a>
    </div>
  </div>

  <!-- 3. Clean Footer Bar with Company Name and Timestamp -->
  <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
    <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 750; color: #0f172a; margin-bottom: 8px;">
      <div style="width: 24px; height: 24px; border-radius: 6px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.15);">
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span>TeamFlow AI</span>
    </div>
    <div style="font-size: 11px; color: #94a3b8;">
      Sent 26 Oct 2026, 03:00 pm IST (Asia/Kolkata)
    </div>
  </div>
</div>`,
  },
  {
    id: "TPL-1002",
    name: "Password Reset Request",
    companyName: "TeamFlow AI",
    organizationName: "NovaTech Solutions",
    orgCode: "ORG-NOVA-1002",
    category: "Security",
    themeColor: "#047857",
    themeBg: "#dcfce7",
    accentGradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    icon: KeyRound,
    badgeText: "🔐 Security Auth",
    subject: "Reset your TeamFlow AI password for NovaTech Solutions",
    headline: "Password Reset for NovaTech Solutions",
    message: "We received a request to reset your password for NovaTech Solutions on TeamFlow AI.\n\nClick the button below to choose a new secure password. This reset link is valid for 30 minutes. If you did not request this, you can safely ignore this email.",
    ctaText: "Choose New Password",
    ctaUrl: "https://app.teamflow.ai/reset-password",
    footerNote: "Sent by TeamFlow AI for NovaTech Solutions",
    trigger: "auth.password.reset_requested",
    triggerDescription: "Triggered when user clicks 'Forgot Password' or admin requests credential cycle",
    engine: "Liquid v5.4",
    openRate: 88.2,
    clickRate: 64.0,
    status: "Active",
    lastUpdated: "Yesterday, 04:30 PM",
    lastAuthor: "Security Gateway",
    body: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <div style="background: #047857; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; color: #ffffff;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span style="font-size: 17px; font-weight: 750; color: #ffffff;">TeamFlow AI</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      🔐 Security Auth
    </div>
  </div>

  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #059669; margin-bottom: 12px;">
      PASSWORD SECURITY FROM TEAMFLOW AI
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      Password Reset for NovaTech Solutions
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      We received a password reset request for your account associated with <strong>NovaTech Solutions</strong> on <strong>TeamFlow AI</strong>.
    </p>

    <!-- Audit Details Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; width: 32%; text-transform: uppercase; font-size: 10.5px;">ACCOUNT</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 600;">alex.johnson@novatech.com</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">REQUEST IP</td>
        <td style="padding: 12px 16px; color: #0f172a; font-family: monospace;">192.168.1.42</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">LINK EXPIRY</td>
        <td style="padding: 12px 16px; color: #dc2626; font-weight: 600;">30 minutes from issuance</td>
      </tr>
    </table>

    <div style="margin: 0 0 24px;">
      <a href="https://app.teamflow.ai/reset-password" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #047857; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(4, 120, 87, 0.3);">
        Choose new password
      </a>
    </div>

    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">
      If you did not request this, please disregard this email. Your TeamFlow AI account remains secure.
    </p>
  </div>

  <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
    <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 750; color: #0f172a; margin-bottom: 8px;">
      <div style="width: 24px; height: 24px; border-radius: 6px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.15);">
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span>TeamFlow AI</span>
    </div>
    <div style="font-size: 11px; color: #94a3b8;">
      Sent 26 Oct 2026, 03:00 pm IST (Asia/Kolkata)
    </div>
  </div>
</div>`,
  },
  {
    id: "TPL-1003",
    name: "Monthly Tax Invoice & Receipt",
    companyName: "TeamFlow AI",
    organizationName: "XYZ Software",
    orgCode: "ORG-XYZ-1003",
    category: "Billing",
    themeColor: "#6d28d9",
    themeBg: "#f3e8ff",
    accentGradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    icon: Receipt,
    badgeText: "🧾 Tax Invoice Settled",
    subject: "TeamFlow AI Tax Invoice #INV-2026-904 for XYZ Software",
    headline: "Your TeamFlow AI invoice for XYZ Software",
    message: "Thank you for your business. Payment of ₹7,500 for XYZ Software has been processed successfully by TeamFlow AI.\n\nYour official GST tax invoice INV-2026-904 is available for download in your billing portal.",
    ctaText: "Download PDF Tax Receipt",
    ctaUrl: "https://app.teamflow.ai/invoices/INV-2026-904.pdf",
    footerNote: "Sent by TeamFlow AI for XYZ Software",
    trigger: "billing.invoice.payment_settled",
    triggerDescription: "Triggered upon successful subscription charge or manual invoice generation",
    engine: "Liquid v5.4",
    openRate: 65.2,
    clickRate: 26.5,
    status: "Active",
    lastUpdated: "Oct 24, 2024",
    lastAuthor: "Himanshu (Super Admin)",
    body: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <div style="background: #6d28d9; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; color: #ffffff;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span style="font-size: 17px; font-weight: 750; color: #ffffff;">TeamFlow AI</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      🧾 Tax Invoice Settled
    </div>
  </div>

  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #7c3aed; margin-bottom: 12px;">
      TAX INVOICE ISSUED BY TEAMFLOW AI
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      Your TeamFlow AI invoice for XYZ Software
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      Thank you for your business. Payment for <strong>XYZ Software</strong> has been processed successfully by <strong>TeamFlow AI</strong>.
    </p>

    <!-- Invoice Data Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; width: 35%; text-transform: uppercase; font-size: 10.5px;">INVOICE NO.</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 600; font-family: monospace;">INV-2026-904</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">CUSTOMER COMPANY</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 600;">XYZ Software</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">PLAN & PERIOD</td>
        <td style="padding: 12px 16px; color: #0f172a;">Business Tier (Monthly)</td>
      </tr>
      <tr style="background: #faf5ff;">
        <td style="padding: 12px 16px; color: #6b21a8; font-weight: 800; text-transform: uppercase; font-size: 11px;">TOTAL PAID</td>
        <td style="padding: 12px 16px; color: #6b21a8; font-weight: 800; font-size: 15px;">₹7,500</td>
      </tr>
    </table>

    <div style="margin: 0 0 24px;">
      <a href="https://app.teamflow.ai/invoices/INV-2026-904.pdf" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #6d28d9; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(109, 40, 217, 0.3);">
        Download PDF Tax Receipt
      </a>
    </div>

    <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
      GSTIN: 29AAACT9810Q1ZS · Issued by TeamFlow AI Finance Division
    </p>
  </div>

  <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
    <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 750; color: #0f172a; margin-bottom: 8px;">
      <div style="width: 24px; height: 24px; border-radius: 6px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.15);">
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span>TeamFlow AI</span>
    </div>
    <div style="font-size: 11px; color: #94a3b8;">
      Sent 26 Oct 2026, 03:00 pm IST (Asia/Kolkata)
    </div>
  </div>
</div>`,
  },
  {
    id: "TPL-1004",
    name: "Subscription Renewal Notice",
    companyName: "TeamFlow AI",
    organizationName: "Apex Software Systems",
    orgCode: "ORG-APEX-1004",
    category: "Billing",
    themeColor: "#b45309",
    themeBg: "#fef3c7",
    accentGradient: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
    icon: CalendarDays,
    badgeText: "🔄 Upcoming Renewal",
    subject: "Upcoming TeamFlow AI subscription renewal for Apex Software Systems",
    headline: "Subscription Renewal for Apex Software Systems",
    message: "This is an advance notice that your TeamFlow AI Enterprise subscription for Apex Software Systems will automatically renew on Nov 24, 2026.\n\nThe scheduled charge of ₹7,500/month will be processed to your primary corporate card on file.",
    ctaText: "Manage Subscription & Billing",
    ctaUrl: "https://app.teamflow.ai/billing",
    footerNote: "Sent by TeamFlow AI for Apex Software Systems",
    trigger: "billing.subscription.renewal_scheduled",
    triggerDescription: "Triggered 7 days prior to automated card renewal charge",
    engine: "Liquid v5.4",
    openRate: 59.8,
    clickRate: 21.0,
    status: "Active",
    lastUpdated: "Oct 20, 2024",
    lastAuthor: "Billing Engine",
    body: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <div style="background: #b45309; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; color: #ffffff;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span style="font-size: 17px; font-weight: 750; color: #ffffff;">TeamFlow AI</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      🔄 Upcoming Renewal
    </div>
  </div>

  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #b45309; margin-bottom: 12px;">
      RENEWAL NOTICE FROM TEAMFLOW AI
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      Subscription Renewal for Apex Software Systems
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      This is a reminder that your <strong>TeamFlow AI</strong> plan for <strong>Apex Software Systems</strong> is scheduled to renew automatically.
    </p>

    <!-- Renewal Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; width: 35%; text-transform: uppercase; font-size: 10.5px;">COMPANY</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 600;">Apex Software Systems</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">PLAN & SEATS</td>
        <td style="padding: 12px 16px; color: #0f172a;">Enterprise Plan (50 seats)</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">RENEWAL DATE</td>
        <td style="padding: 12px 16px; color: #0f172a;">Nov 24, 2026</td>
      </tr>
      <tr style="background: #fffbeb;">
        <td style="padding: 12px 16px; color: #92400e; font-weight: 800; text-transform: uppercase; font-size: 11px;">CHARGE AMOUNT</td>
        <td style="padding: 12px 16px; color: #92400e; font-weight: 800; font-size: 15px;">₹7,500/month</td>
      </tr>
    </table>

    <div style="margin: 0 0 24px;">
      <a href="https://app.teamflow.ai/billing" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #b45309; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(180, 83, 9, 0.3);">
        Manage payment methods
      </a>
    </div>
  </div>

  <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
    <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 750; color: #0f172a; margin-bottom: 8px;">
      <div style="width: 24px; height: 24px; border-radius: 6px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.15);">
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span>TeamFlow AI</span>
    </div>
    <div style="font-size: 11px; color: #94a3b8;">
      Sent 26 Oct 2026, 03:00 pm IST (Asia/Kolkata)
    </div>
  </div>
</div>`,
  },
  {
    id: "TPL-1005",
    name: "Security Alert: New Sign-in",
    companyName: "TeamFlow AI",
    organizationName: "DesignHub",
    orgCode: "ORG-DESIGN-1005",
    category: "Security",
    themeColor: "#b91c1c",
    themeBg: "#fee2e2",
    accentGradient: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
    icon: ShieldAlert,
    badgeText: "🛡️ Security Alert",
    subject: "[Security Alert] TeamFlow AI sign-in from new device for DesignHub",
    headline: "Unrecognized Sign-in for DesignHub",
    message: "Your TeamFlow AI account for DesignHub was recently accessed from Chrome on macOS in San Francisco, United States (IP: 142.250.190.46).\n\nIf this was you, no action is needed. If you do not recognize this activity, please terminate active sessions immediately.",
    ctaText: "Terminate Sessions & Secure Account",
    ctaUrl: "https://app.teamflow.ai/security",
    footerNote: "Sent by TeamFlow AI Security Gateway for DesignHub",
    trigger: "security.auth.unrecognized_ip_detected",
    triggerDescription: "Triggered on login from unrecognized device, browser signature, or geographic IP",
    engine: "Liquid v5.4",
    openRate: 91.0,
    clickRate: 48.3,
    status: "Active",
    lastUpdated: "Oct 18, 2024",
    lastAuthor: "Security Gateway",
    body: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <div style="background: #b91c1c; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; color: #ffffff;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span style="font-size: 17px; font-weight: 750; color: #ffffff;">TeamFlow AI</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      🛡️ Security Alert
    </div>
  </div>

  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #dc2626; margin-bottom: 12px;">
      SECURITY GATEWAY · TEAMFLOW AI
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      Unrecognized Sign-in for DesignHub
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      Your <strong>TeamFlow AI</strong> account belonging to <strong>DesignHub</strong> was accessed from an unrecognized environment.
    </p>

    <!-- Sign-in Audit Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px; border: 1px solid #fecaca; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <tr style="border-bottom: 1px solid #fee2e2;">
        <td style="padding: 12px 16px; color: #991b1b; font-weight: 700; width: 35%; text-transform: uppercase; font-size: 10.5px;">LOCATION</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 700;">San Francisco, United States</td>
      </tr>
      <tr style="border-bottom: 1px solid #fee2e2;">
        <td style="padding: 12px 16px; color: #991b1b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">IP ADDRESS</td>
        <td style="padding: 12px 16px; color: #0f172a; font-family: monospace;">142.250.190.46</td>
      </tr>
      <tr style="border-bottom: 1px solid #fee2e2;">
        <td style="padding: 12px 16px; color: #991b1b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">DEVICE</td>
        <td style="padding: 12px 16px; color: #0f172a;">Chrome on macOS</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #991b1b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">TIME</td>
        <td style="padding: 12px 16px; color: #0f172a;">Today, 10:45 AM</td>
      </tr>
    </table>

    <div style="margin: 0 0 24px;">
      <a href="https://app.teamflow.ai/security" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #b91c1c; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(185, 28, 28, 0.3);">
        Terminate sessions & secure account
      </a>
    </div>
  </div>

  <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
    <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 750; color: #0f172a; margin-bottom: 8px;">
      <div style="width: 24px; height: 24px; border-radius: 6px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.15);">
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span>TeamFlow AI</span>
    </div>
    <div style="font-size: 11px; color: #94a3b8;">
      Sent 26 Oct 2026, 03:00 pm IST (Asia/Kolkata)
    </div>
  </div>
</div>`,
  },
  {
    id: "TPL-1006",
    name: "AI Quota Warning (90%)",
    companyName: "TeamFlow AI",
    organizationName: "NextGen Solutions",
    orgCode: "ORG-NEXTGEN-1006",
    category: "AI Management",
    themeColor: "#a21caf",
    themeBg: "#fdf4ff",
    accentGradient: "linear-gradient(135deg, #d946ef 0%, #a21caf 100%)",
    icon: Sparkles,
    badgeText: "⚡ AI Quota Alert",
    subject: "Action Required: NextGen Solutions reached 90% of AI tokens on TeamFlow AI",
    headline: "AI Token Limit Warning for NextGen Solutions",
    message: "Your team at NextGen Solutions has reached 90% of its monthly allocated token quota (4,500,000 / 5,000,000 tokens) on TeamFlow AI.\n\nYour quota will reset automatically on Nov 01, 2026. Add a token booster pack now to prevent any interruption to your AI workflows.",
    ctaText: "Add Token Booster",
    ctaUrl: "https://app.teamflow.ai/ai-usage",
    footerNote: "Sent by TeamFlow AI for NextGen Solutions",
    trigger: "ai.tokens.threshold_exceeded_90",
    triggerDescription: "Triggered when tenant monthly LLM token consumption crosses 90%",
    engine: "Liquid v5.4",
    openRate: 72.4,
    clickRate: 38.1,
    status: "Active",
    lastUpdated: "Oct 15, 2024",
    lastAuthor: "AI Gateway Engine",
    body: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <div style="background: #a21caf; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; color: #ffffff;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span style="font-size: 17px; font-weight: 750; color: #ffffff;">TeamFlow AI</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      ⚡ AI Quota Alert
    </div>
  </div>

  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #c026d3; margin-bottom: 12px;">
      AI RUNTIME ENGINE · TEAMFLOW AI
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      AI Token Limit for NextGen Solutions
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      Your team at <strong>NextGen Solutions</strong> has reached 90% of its monthly allocated token quota on <strong>TeamFlow AI</strong>.
    </p>

    <!-- AI Consumption Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px; border: 1px solid #f5d0fe; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <tr style="border-bottom: 1px solid #fae8ff;">
        <td style="padding: 12px 16px; color: #86198f; font-weight: 700; width: 35%; text-transform: uppercase; font-size: 10.5px;">CONSUMED</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 700;">4,500,000 / 5,000,000</td>
      </tr>
      <tr style="border-bottom: 1px solid #fae8ff;">
        <td style="padding: 12px 16px; color: #86198f; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">REMAINING</td>
        <td style="padding: 12px 16px; color: #d946ef; font-weight: 700;">500,000 tokens</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #86198f; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">RESET DATE</td>
        <td style="padding: 12px 16px; color: #0f172a;">Nov 01, 2026</td>
      </tr>
    </table>

    <div style="margin: 0 0 24px;">
      <a href="https://app.teamflow.ai/ai-usage" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #a21caf; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(162, 28, 175, 0.3);">
        Add token booster
      </a>
    </div>
  </div>

  <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
    <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 750; color: #0f172a; margin-bottom: 8px;">
      <div style="width: 24px; height: 24px; border-radius: 6px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.15);">
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span>TeamFlow AI</span>
    </div>
    <div style="font-size: 11px; color: #94a3b8;">
      Sent 26 Oct 2026, 03:00 pm IST (Asia/Kolkata)
    </div>
  </div>
</div>`,
  },
  {
    id: "TPL-1007",
    name: "Team Member Workspace Invite",
    companyName: "TeamFlow AI",
    organizationName: "CloudNine Tech",
    orgCode: "ORG-CLOUD-1007",
    category: "Authentication",
    themeColor: "#0369a1",
    themeBg: "#e0f2fe",
    accentGradient: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
    icon: Users,
    badgeText: "👥 Team Invite",
    subject: "Sarah Connor invited you to CloudNine Tech on TeamFlow AI",
    headline: "Join CloudNine Tech on TeamFlow AI",
    message: "Sarah Connor has invited you to collaborate in the workspace for CloudNine Tech as a Developer in the Engineering team.\n\nAccept your invitation below to access shared projects, repositories, and AI assistant tools.",
    ctaText: "Accept Invitation & Join Workspace",
    ctaUrl: "https://app.teamflow.ai/invite/accept",
    footerNote: "Sent by TeamFlow AI for CloudNine Tech",
    trigger: "tenant.workspace.invitation_dispatched",
    triggerDescription: "Triggered when a tenant administrator or team lead invites a new collaborator",
    engine: "Liquid v5.4",
    openRate: 83.0,
    clickRate: 57.5,
    status: "Active",
    lastUpdated: "Oct 12, 2024",
    lastAuthor: "Himanshu (Super Admin)",
    body: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <div style="background: #0369a1; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; color: #ffffff;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span style="font-size: 17px; font-weight: 750; color: #ffffff;">TeamFlow AI</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      👥 Team Invite
    </div>
  </div>

  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #0284c7; margin-bottom: 12px;">
      WORKSPACE COLLABORATION · TEAMFLOW AI
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      Join CloudNine Tech on TeamFlow AI
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      <strong>Sarah Connor</strong> has invited you to collaborate in the workspace for <strong>CloudNine Tech</strong>.
    </p>

    <!-- Workspace Details Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px; border: 1px solid #bae6fd; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <tr style="border-bottom: 1px solid #e0f2fe;">
        <td style="padding: 12px 16px; color: #0369a1; font-weight: 700; width: 35%; text-transform: uppercase; font-size: 10.5px;">COMPANY</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 700;">CloudNine Tech</td>
      </tr>
      <tr style="border-bottom: 1px solid #e0f2fe;">
        <td style="padding: 12px 16px; color: #0369a1; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">ASSIGNED ROLE</td>
        <td style="padding: 12px 16px; color: #0284c7; font-weight: 700;">Developer</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #0369a1; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">DEPARTMENT</td>
        <td style="padding: 12px 16px; color: #0f172a;">Engineering</td>
      </tr>
    </table>

    <div style="margin: 0 0 24px;">
      <a href="https://app.teamflow.ai/invite/accept" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #0369a1; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(3, 105, 161, 0.3);">
        Accept invitation & join workspace
      </a>
    </div>
  </div>

  <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
    <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 750; color: #0f172a; margin-bottom: 8px;">
      <div style="width: 24px; height: 24px; border-radius: 6px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.15);">
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span>TeamFlow AI</span>
    </div>
    <div style="font-size: 11px; color: #94a3b8;">
      Sent 26 Oct 2026, 03:00 pm IST (Asia/Kolkata)
    </div>
  </div>
</div>`,
  },
  {
    id: "TPL-1008",
    name: "Platform Maintenance Window Notice",
    companyName: "TeamFlow AI",
    organizationName: "Orbit Creative",
    orgCode: "ORG-ORBIT-1008",
    category: "System",
    themeColor: "#334155",
    themeBg: "#f1f5f9",
    accentGradient: "linear-gradient(135deg, #64748b 0%, #334155 100%)",
    icon: LayoutTemplate,
    badgeText: "🛠️ Ops Notice",
    subject: "Notice: Scheduled TeamFlow AI Maintenance on Nov 15, 2026",
    headline: "Maintenance Notice for Orbit Creative",
    message: "TeamFlow AI will conduct scheduled infrastructure maintenance affecting workspaces including Orbit Creative on Nov 15, 2026 between 02:00 AM and 04:00 AM UTC.\n\nDuring this window, services may experience brief intermittent pauses. Real-time system health will be broadcast on status.teamflow.ai.",
    ctaText: "Check Live Platform Status",
    ctaUrl: "https://status.teamflow.ai",
    footerNote: "Sent by TeamFlow AI DevOps Cluster for Orbit Creative",
    trigger: "system.ops.maintenance_broadcast",
    triggerDescription: "Triggered manually or via pipeline before scheduled infrastructure upgrades",
    engine: "Liquid v5.4",
    openRate: 54.2,
    clickRate: 11.0,
    status: "Active",
    lastUpdated: "Oct 08, 2024",
    lastAuthor: "DevOps Cluster Lead",
    body: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <div style="background: #334155; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; color: #ffffff;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span style="font-size: 17px; font-weight: 750; color: #ffffff;">TeamFlow AI</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      🛠️ Ops Notice
    </div>
  </div>

  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #475569; margin-bottom: 12px;">
      PLATFORM INFRASTRUCTURE · TEAMFLOW AI
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      Maintenance Notice for Orbit Creative
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      <strong>TeamFlow AI</strong> will conduct scheduled infrastructure maintenance affecting workspaces including <strong>Orbit Creative</strong>.
    </p>

    <!-- Maintenance Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #475569; font-weight: 700; width: 35%; text-transform: uppercase; font-size: 10.5px;">WINDOW</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 700;">02:00 AM - 04:00 AM UTC</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">TENANT</td>
        <td style="padding: 12px 16px; color: #0f172a;">Orbit Creative</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">STATUS URL</td>
        <td style="padding: 12px 16px; color: #2563eb;"><a href="https://status.teamflow.ai" style="color: #2563eb;">status.teamflow.ai</a></td>
      </tr>
    </table>

    <div style="margin: 0 0 24px;">
      <a href="https://status.teamflow.ai" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #334155; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(51, 65, 85, 0.3);">
        Check platform status live
      </a>
    </div>
  </div>

  <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
    <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 750; color: #0f172a; margin-bottom: 8px;">
      <div style="width: 24px; height: 24px; border-radius: 6px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.15);">
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span>TeamFlow AI</span>
    </div>
    <div style="font-size: 11px; color: #94a3b8;">
      Sent 26 Oct 2026, 03:00 pm IST (Asia/Kolkata)
    </div>
  </div>
</div>`,
  },
];


/* =========================================================================
   VISUAL EMAIL BUILDER CONFIGURATION & GENERATOR
   ========================================================================= */
const BRAND_PRESET_COLORS = [
  { name: "Indigo", hex: "#352fa8", bg: "#ede9fe" },
  { name: "Sky", hex: "#0284c7", bg: "#e0f2fe" },
  { name: "Emerald", hex: "#059669", bg: "#d1fae5" },
  { name: "Violet", hex: "#7c3aed", bg: "#f3e8ff" },
  { name: "Rose", hex: "#e11d48", bg: "#ffe4e6" },
  { name: "Amber", hex: "#d97706", bg: "#fef3c7" },
];

function interpolateTemplateVariables(text, tpl) {
  if (!text) return "";
  const brand = tpl?.companyName?.trim() || "TeamFlow AI";
  const org = tpl?.organizationName?.trim() || "Acme Technologies";
  return text
    .replace(/{{company_name}}/g, brand)
    .replace(/{{organization_name}}/g, org)
    .replace(/{{user_name}}/g, "Alex Johnson")
    .replace(/{{user_email}}/g, "alex.johnson@acme.com")
    .replace(/{{temporary_password}}/g, "Sec#992$Kla")
    .replace(/{{temp_password}}/g, "Sec#992$Kla")
    .replace(/{{invoice_id}}/g, "INV-2026-904")
    .replace(/{{invoice_amount}}/g, "₹24,999")
    .replace(/{{renewal_date}}/g, "Nov 30, 2026")
    .replace(/{{support_email}}/g, "support@teamflow.ai")
    .replace(/{{login_url}}/g, "#");
}

function generateEmailHtml(tpl) {
  const brand = tpl?.companyName?.trim() || (tpl?.isNew ? "Company Name" : "TeamFlow AI");
  const org = tpl?.organizationName?.trim() || (tpl?.isNew ? "Target Organization" : "Acme Technologies");
  const color = tpl?.themeColor || "#352fa8";
  const badge = tpl?.badgeText?.trim();
  const headline = tpl?.headline?.trim() || (tpl?.isNew ? "Your Email Subject Headline" : (tpl?.name?.trim() || "Welcome to Your Workspace"));
  const rawMsg = tpl?.message?.trim();
  const formattedMsg = rawMsg
    ? rawMsg
        .split("\n")
        .filter(Boolean)
        .map((p) => `<p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 14px;">${p}</p>`)
        .join("")
    : `<p style="font-size: 14px; color: #94a3b8; line-height: 1.6; font-style: italic; margin: 0 0 14px;">(Start typing your email message in the form on the left. Changes will appear live right here.)</p>`;
  const highlight = tpl?.highlightNote?.trim();
  const ctaText = tpl?.ctaText?.trim();
  const ctaUrl = tpl?.ctaUrl?.trim() || "#";
  const footerNote = tpl?.footerNote?.trim() || `Sent by ${brand} for ${org}`;

  return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; width: 100%; margin: 0 auto; background: #ffffff; overflow: hidden; display: flex; flex-direction: column; min-height: 420px;">
  <div style="background: ${color}; padding: 18px 22px; display: flex; align-items: center; justify-content: space-between; color: #ffffff;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.22); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 9H20M14 9V19M11 19H17"/>
        </svg>
      </div>
      <span style="font-size: 17px; font-weight: 750; letter-spacing: -0.3px; color: #ffffff;">${brand}</span>
    </div>
    ${badge ? `
    <div style="background: rgba(255, 255, 255, 0.22); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      ${badge}
    </div>` : ""}
  </div>

  <div style="padding: 26px 22px 20px; flex: 1;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: ${color}; margin-bottom: 10px;">
      ${org}
    </div>

    <h1 style="margin: 0 0 14px; font-size: 21px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      ${headline}
    </h1>

    ${formattedMsg}

    ${highlight ? `
    <div style="background: #f8fafc; border-left: 4px solid ${color}; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 16px 0 20px; font-size: 13.5px; color: #1e293b; font-weight: 600;">
      ${highlight}
    </div>` : ""}

    ${ctaText ? `
    <div style="margin: 20px 0 22px;">
      <a href="${ctaUrl}" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: ${color}; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
        ${ctaText}
      </a>
    </div>` : ""}
  </div>

  <div style="background: #f8fafc; padding: 16px 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; margin-top: auto;">
    <div style="margin-bottom: 4px; font-weight: 600; color: #64748b;">${footerNote}</div>
    <div>Sent via TeamFlow AI Secure Enterprise Delivery</div>
  </div>
</div>`;
}

function prepareTemplateForEdit(tpl) {
  return {
    ...tpl,
    companyName: tpl.companyName || "",
    organizationName: tpl.organizationName || "",
    badgeText: tpl.badgeText || "",
    headline: tpl.headline || "",
    message: tpl.message || "",
    highlightNote: tpl.highlightNote || "",
    ctaText: tpl.ctaText || "",
    ctaUrl: tpl.ctaUrl || "",
    footerNote: tpl.footerNote || "",
    subject: tpl.subject || "",
    trigger: tpl.trigger || "",
    name: tpl.name || "",
  };
}

function EmailTemplates() {
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [viewMode, setViewMode] = useState("table"); // "table" or "cards"
  const [density, setDensity] = useState("standard"); // "compact" or "standard"

  // Search & Filter States
  const [search, setSearch] = useState("");
  const [orgFilter, setOrgFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState("");

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Distinct Organizations list for filter
  const organizationsList = useMemo(() => {
    const orgs = new Set(templates.map((t) => t.organizationName).filter(Boolean));
    return Array.from(orgs);
  }, [templates]);

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const q = (search || "").toLowerCase().trim();
      const matchSearch =
        !q ||
        (tpl.id || "").toLowerCase().includes(q) ||
        (tpl.name || "").toLowerCase().includes(q) ||
        (tpl.subject || "").toLowerCase().includes(q) ||
        (tpl.trigger || "").toLowerCase().includes(q) ||
        (tpl.companyName || "").toLowerCase().includes(q) ||
        (tpl.organizationName || "").toLowerCase().includes(q) ||
        (tpl.category || "").toLowerCase().includes(q);

      const matchOrg =
        orgFilter === "All" || tpl.organizationName === orgFilter;

      const matchCategory =
        categoryFilter === "All" || tpl.category === categoryFilter;

      const matchStatus =
        statusFilter === "All" || tpl.status === statusFilter;

      return matchSearch && matchOrg && matchCategory && matchStatus;
    });
  }, [templates, search, orgFilter, categoryFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredTemplates.length / pageSize) || 1;
  const paginatedTemplates = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTemplates.slice(start, start + pageSize);
  }, [filteredTemplates, page, pageSize]);

  // Selection handlers
  const toggleSelectRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allCurrentSelected =
    paginatedTemplates.length > 0 &&
    paginatedTemplates.every((t) => selectedIds.has(t.id));

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allCurrentSelected) {
        paginatedTemplates.forEach((t) => next.delete(t.id));
      } else {
        paginatedTemplates.forEach((t) => next.add(t.id));
      }
      return next;
    });
  };

  const handleBatchStatus = (newStatus) => {
    setTemplates((prev) =>
      prev.map((t) =>
        selectedIds.has(t.id) ? { ...t, status: newStatus } : t
      )
    );
    notify(`${selectedIds.size} templates updated to ${newStatus}.`);
    setSelectedIds(new Set());
  };

  const handleExportCSV = () => {
    const target =
      selectedIds.size > 0
        ? templates.filter((t) => selectedIds.has(t.id))
        : filteredTemplates;

    const headers = [
      "Template ID",
      "Name",
      "Sender Company",
      "Target Organization",
      "Category",
      "Trigger",
      "Subject",
      "Open Rate",
      "Click Rate",
      "Status",
      "Last Modified",
    ];

    const rows = target.map((t) => [
      t.id,
      `"${t.name || ""}"`,
      `"${t.companyName || ""}"`,
      `"${t.organizationName || ""}"`,
      `"${t.category || ""}"`,
      `"${t.trigger || ""}"`,
      `"${(t.subject || "").replace(/"/g, '""')}"`,
      `${t.openRate}%`,
      `${t.clickRate}%`,
      t.status,
      `"${t.lastUpdated || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TeamFlow_Email_Templates_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify(`Exported ${target.length} template records.`);
  };

  const handleOpenPreview = (tpl) => {
    setSelectedTemplate(tpl);
    setPreviewModalOpen(true);
  };

  const handleOpenEdit = (tpl) => {
    setEditingTemplate({
      ...prepareTemplateForEdit(tpl),
      isNew: false,
    });
    setEditModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingTemplate({
      id: `TPL-${1000 + templates.length + 1}`,
      name: "",
      companyName: "",
      organizationName: "",
      orgCode: "ORG-CUSTOM",
      category: "Authentication",
      themeColor: "#352fa8",
      themeBg: "#ede9fe",
      accentGradient: "linear-gradient(135deg, #352fa8 0%, #4338ca 100%)",
      icon: LayoutTemplate,
      badgeText: "",
      headline: "",
      message: "",
      highlightNote: "",
      ctaText: "",
      ctaUrl: "",
      footerNote: "",
      subject: "",
      trigger: "",
      triggerDescription: "Triggered on custom user lifecycle event",
      engine: "Liquid v5.4",
      openRate: 0.0,
      clickRate: 0.0,
      status: "Active",
      lastUpdated: "Just now",
      lastAuthor: "Himanshu (Super Admin)",
      isNew: true,
    });
    setEditModalOpen(true);
  };

  const handleDuplicateTemplate = (tpl) => {
    const copy = {
      ...tpl,
      id: `TPL-${1000 + templates.length + 1}`,
      name: `${tpl.name} (Copy)`,
      lastUpdated: "Just now",
      lastAuthor: "Himanshu (Super Admin)",
    };
    setTemplates((prev) => [copy, ...prev]);
    notify(`Duplicated template as "${copy.name}".`);
  };

  const handleDeleteTemplate = (id) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    notify(`Template ${id} deleted.`);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTemplate) return;
    const isCreating = Boolean(editingTemplate.isNew);
    const finalTemplate = {
      ...editingTemplate,
      name: editingTemplate.name?.trim() || "Untitled Template",
      companyName: editingTemplate.companyName?.trim() || "TeamFlow AI",
      organizationName: editingTemplate.organizationName?.trim() || "Acme Technologies",
      subject: editingTemplate.subject?.trim() || "Notification",
      trigger: editingTemplate.trigger?.trim() || "custom.event.notification",
      body: generateEmailHtml(editingTemplate),
      lastUpdated: "Just now",
      lastAuthor: "Himanshu (Super Admin)",
    };
    delete finalTemplate.isNew;
    setTemplates((prev) => {
      const exists = prev.some((t) => t.id === finalTemplate.id);
      if (exists) {
        return prev.map((t) => (t.id === finalTemplate.id ? finalTemplate : t));
      }
      return [finalTemplate, ...prev];
    });
    setEditModalOpen(false);
    notify(isCreating ? "New email template created successfully." : `Template "${finalTemplate.name}" saved successfully.`);
  };

  const handleSendTestEmail = (tpl) => {
    notify(`Test email dispatch initiated for "${tpl.name}". Sent to Super Admin inbox.`);
  };

  return (
    <div className="sa-page-container sa-templates-page">
      {/* 1. Header with SAP Master Badge */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>Email Notification Templates</h1>
          <p className="sap-header-subtitle">
            Enterprise transactional notification directory with sender company branding, tenant identification, and structured table data.
          </p>
        </div>

        <div className="sap-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={handleExportCSV}
          >
            <Download size={15} /> Export Directory
          </button>

          <button
            type="button"
            className="sa-btn sa-btn-primary"
            onClick={handleOpenCreate}
          >
            <Plus size={16} /> New Email Template
          </button>
        </div>
      </section>

      {/* 2. Top 4 KPI Telemetry Cards */}
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <LayoutTemplate size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Master Templates</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{templates.length}</span>
              <span className="sa-kpi-trend positive">100% Bound</span>
            </div>
            <span className="sa-kpi-subtitle">All company transactional triggers active</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <Eye size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Average Open Rate</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">73.6%</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> +5.2%
              </span>
            </div>
            <span className="sa-kpi-subtitle">High sender domain authority</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box purple">
            <Sparkles size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Average Click-Through</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">41.8%</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> +3.4%
              </span>
            </div>
            <span className="sa-kpi-subtitle">CTA credential engagement</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <Building2 size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Company Identification</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">Enforced</span>
              <span className="sa-kpi-trend positive">Branded</span>
            </div>
            <span className="sa-kpi-subtitle">Sender & Customer Company Visible</span>
          </div>
        </article>
      </section>

      {toast && (
        <div className="sa-toast-banner">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* 3. The Master Data Table Card */}
      <section className="sap-table-card">
        {/* Selection Batch Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="sap-batch-banner">
            <span>
              <strong>{selectedIds.size}</strong> template records selected
            </span>
            <div className="sap-batch-actions">
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={() => handleBatchStatus("Active")}
              >
                <Unlock size={13} /> Enable Templates
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={() => handleBatchStatus("Inactive")}
              >
                <Lock size={13} /> Pause Templates
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={handleExportCSV}
              >
                <Download size={13} /> Export Selected
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-sm"
                style={{ background: "transparent", color: "inherit", border: 0 }}
                onClick={() => setSelectedIds(new Set())}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Toolbar & Filter Bar */}
        <div className="sap-toolbar">
          <div className="sap-toolbar-left">
            <div className="sap-search-input">
              <Search size={15} style={{ color: "var(--sa-text-muted)" }} />
              <input
                type="text"
                placeholder="Search ID, Company, Organization, Subject, Trigger..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Company / Organization Filter */}
            <select
              className="sap-filter-select"
              value={orgFilter}
              onChange={(e) => {
                setOrgFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Target Company: All Organizations</option>
              {organizationsList.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>

            <select
              className="sap-filter-select"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Category: All Categories</option>
              <option value="Authentication">Authentication</option>
              <option value="Security">Security</option>
              <option value="Billing">Billing & GST</option>
              <option value="AI Management">AI Management</option>
              <option value="System">System & Ops</option>
            </select>

            <select
              className="sap-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Status: All Statuses</option>
              <option value="Active">00 - Active (Live)</option>
              <option value="Inactive">02 - Inactive (Paused)</option>
            </select>
          </div>

          <div className="sap-toolbar-right">
            {/* View Mode Switcher: Table vs Cards */}
            <div className="sa-view-switcher">
              <button
                type="button"
                className={`sa-view-btn ${viewMode === "table" ? "is-active" : ""}`}
                onClick={() => setViewMode("table")}
                title="SAP Table Master Grid"
              >
                <TableIcon size={14} /> Table
              </button>
              <button
                type="button"
                className={`sa-view-btn ${viewMode === "cards" ? "is-active" : ""}`}
                onClick={() => setViewMode("cards")}
                title="Visual Card Gallery"
              >
                <Grid size={14} /> Cards
              </button>
            </div>

            {/* Density Switcher */}
            {viewMode === "table" && (
              <button
                type="button"
                className="sap-icon-btn"
                onClick={() => setDensity((d) => (d === "standard" ? "compact" : "standard"))}
                title={`Switch density (currently ${density})`}
              >
                <SlidersHorizontal size={15} />
              </button>
            )}

            {/* Reset Filters */}
            <button
              type="button"
              className="sap-icon-btn"
              onClick={() => {
                setSearch("");
                setOrgFilter("All");
                setCategoryFilter("All");
                setStatusFilter("All");
                setPage(1);
              }}
              title="Reset all filters"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* 4. Table Format (SAP / Master Data Grid) */}
        {viewMode === "table" ? (
          <div className="sap-table-wrapper">
            <table className={`sap-grid is-${density}`}>
              <thead>
                <tr>
                  <th style={{ width: 38, textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={allCurrentSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th style={{ minWidth: 220 }}>Template</th>
                  <th style={{ minWidth: 170 }}>Target Organization</th>
                  <th style={{ width: 130 }}>Category</th>
                  <th style={{ minWidth: 220, maxWidth: 280 }}>Subject &amp; Trigger</th>
                  <th style={{ width: 130 }}>Engagement</th>
                  <th style={{ width: 100 }}>Status</th>
                  <th style={{ textAlign: "right", width: 130 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTemplates.map((tpl) => {
                  const isChecked = selectedIds.has(tpl.id);
                  const IconComp = tpl.icon || LayoutTemplate;
                  return (
                    <tr
                      key={tpl.id}
                      className={isChecked ? "is-selected" : ""}
                      onClick={() => handleOpenPreview(tpl)}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectRow(tpl.id)}
                        />
                      </td>

                      {/* Template thumbnail + name + id + engine */}
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            className="tpl-thumb-box"
                            style={{
                              background: tpl.themeColor || "#352fa8",
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.12)",
                            }}
                          >
                            <IconComp size={16} color="#ffffff" strokeWidth={2.2} />
                          </div>
                          <div className="tpl-name-col">
                            <strong style={{ fontSize: 13, color: "var(--sa-text-main)" }}>
                              {tpl.name}
                            </strong>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                              <span className="sap-id-cell">{tpl.id}</span>
                              <span style={{ color: "var(--sa-text-muted)" }}>•</span>
                              <span className="tpl-engine-tag">{tpl.engine}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Target Organization & Sender */}
                      <td>
                        <div className="tpl-company-col">
                          <div className="tpl-company-name-row" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <Building2 size={13} style={{ color: "#3b66ff", flexShrink: 0 }} />
                            <strong style={{ fontSize: 12.5 }}>{tpl.organizationName}</strong>
                          </div>
                          <span className="tpl-company-subtext" style={{ fontSize: 11, color: "var(--sa-text-muted)" }}>
                            Sender: {tpl.companyName} · {tpl.orgCode}
                          </span>
                        </div>
                      </td>

                      {/* Category Badge with Themed Colors */}
                      <td>
                        <span
                          className="tpl-category-badge"
                          style={{
                            color: tpl.themeColor,
                            backgroundColor: tpl.themeBg,
                            borderColor: `${tpl.themeColor}33`,
                          }}
                        >
                          <span
                            className="tpl-color-dot"
                            style={{ backgroundColor: tpl.themeColor }}
                          />
                          {tpl.category}
                        </span>
                      </td>

                      {/* Subject & Trigger (Streamlined) */}
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 260 }}>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: "var(--sa-text-main)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={tpl.subject}
                          >
                            {tpl.subject}
                          </span>
                          <code
                            style={{
                              fontSize: 10.5,
                              fontFamily: "ui-monospace, monospace",
                              color: "var(--sa-primary, #3b66ff)",
                              background: "rgba(59, 102, 255, 0.06)",
                              padding: "1px 4px",
                              borderRadius: 4,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 240,
                            }}
                            title={tpl.trigger}
                          >
                            {tpl.trigger}
                          </code>
                        </div>
                      </td>

                      {/* Engagement Telemetry */}
                      <td>
                        <div className="tpl-engagement-cell">
                          <div className="tpl-rate-row">
                            <span>Open: <strong>{tpl.openRate}%</strong></span>
                            <span>Click: <strong>{tpl.clickRate}%</strong></span>
                          </div>
                          <div className="tpl-engagement-bar-track">
                            <div
                              className="tpl-engagement-bar-fill"
                              style={{
                                width: `${tpl.openRate}%`,
                                backgroundColor: tpl.themeColor || "#352fa8",
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`sap-status-pill ${
                            tpl.status === "Active" ? "valid" : "locked"
                          }`}
                        >
                          <span className="sap-status-dot" />
                          {tpl.status === "Active" ? "Live" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                        <div className="sap-action-group" style={{ justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            className="sap-table-btn"
                            title="Preview Rendered Email"
                            onClick={() => handleOpenPreview(tpl)}
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            type="button"
                            className="sap-table-btn"
                            title="Visual Template Builder"
                            onClick={() => handleOpenEdit(tpl)}
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            type="button"
                            className="sap-table-btn"
                            title="Duplicate Template"
                            onClick={() => handleDuplicateTemplate(tpl)}
                          >
                            <Copy size={14} />
                          </button>

                          <button
                            type="button"
                            className="sap-table-btn"
                            title="Dispatch Test Email"
                            onClick={() => handleSendTestEmail(tpl)}
                          >
                            <Send size={14} />
                          </button>

                          <button
                            type="button"
                            className="sap-table-btn danger"
                            title="Delete Template"
                            onClick={() => handleDeleteTemplate(tpl.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {paginatedTemplates.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: 36, color: "var(--sa-text-muted)" }}>
                      No email templates found matching search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Visual Card Gallery View with Themed Graphic Banners */
          <div className="tpl-cards-gallery">
            {paginatedTemplates.map((tpl) => {
              const IconComp = tpl.icon || LayoutTemplate;
              return (
                <article key={tpl.id} className="sa-card tpl-visual-card">
                  {/* Themed Visual Graphic Banner */}
                  <div
                    className="tpl-card-graphic-banner"
                    style={{ background: tpl.themeColor }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%)", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.25)", flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
                        </svg>
                      </div>
                      <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 13 }}>
                        {tpl.companyName}
                      </span>
                    </div>
                    <div className="tpl-card-badge-pill">{tpl.badgeText}</div>
                  </div>

                  <div className="tpl-card-body">
                    <div className="tpl-card-top-row">
                      <span
                        className="tpl-category-badge"
                        style={{
                          color: tpl.themeColor,
                          backgroundColor: tpl.themeBg,
                        }}
                      >
                        {tpl.category}
                      </span>
                      <span className="sap-id-cell">{tpl.id}</span>
                    </div>

                    <h3 className="tpl-card-title">{tpl.name}</h3>

                    {/* Prominent Company Badge on Card */}
                    <div className="tpl-card-company-tag">
                      <Building2 size={13} style={{ color: tpl.themeColor }} />
                      <span>{tpl.organizationName}</span>
                    </div>

                    <p className="tpl-card-trigger-text">{tpl.triggerDescription}</p>

                    <div className="sa-tpl-subject-box">
                      <label>SUBJECT</label>
                      <strong>
                        {(tpl.subject || "")
                          .replace(/{{company_name}}/g, tpl.companyName || "TeamFlow AI")
                          .replace(/{{organization_name}}/g, tpl.organizationName || "Acme Technologies")}
                      </strong>
                    </div>

                    <div className="tpl-card-stats-row">
                      <div>
                        <span className="tpl-stat-label">Open Rate</span>
                        <strong className="tpl-stat-val" style={{ color: tpl.themeColor }}>
                          {tpl.openRate}%
                        </strong>
                      </div>
                      <div>
                        <span className="tpl-stat-label">Click Rate</span>
                        <strong className="tpl-stat-val">{tpl.clickRate}%</strong>
                      </div>
                      <div>
                        <span className="tpl-stat-label">Status</span>
                        <span className={`sap-status-pill ${tpl.status === "Active" ? "valid" : "locked"}`}>
                          {tpl.status}
                        </span>
                      </div>
                    </div>

                    <div className="tpl-card-footer-btns">
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={() => handleOpenPreview(tpl)}
                      >
                        <Eye size={13} /> Preview
                      </button>
                      <button
                        type="button"
                        className="sa-btn sa-btn-primary sa-btn-sm"
                        onClick={() => handleOpenEdit(tpl)}
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={() => handleSendTestEmail(tpl)}
                        title="Send test email"
                      >
                        <Send size={13} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* 5. SAP Table Footer Bar */}
        <div className="sap-footer-bar">
          <div className="sap-footer-counts">
            <span>
              Showing{" "}
              <strong>
                {filteredTemplates.length === 0
                  ? 0
                  : (page - 1) * pageSize + 1}
                -
                {Math.min(page * pageSize, filteredTemplates.length)}
              </strong>{" "}
              of <strong>{filteredTemplates.length}</strong> master templates
            </span>

            <select
              className="sap-filter-select"
              style={{ height: 28, fontSize: 11, padding: "0 6px" }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={5}>5 rows per page</option>
              <option value={10}>10 rows per page</option>
              <option value={20}>20 rows per page</option>
              <option value={50}>50 rows per page</option>
            </select>
          </div>

          <div className="sap-pagination">
            <button
              type="button"
              className="sap-page-btn"
              disabled={page <= 1}
              onClick={() => setPage(1)}
              title="First Page"
            >
              «
            </button>
            <button
              type="button"
              className="sap-page-btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              title="Previous Page"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
              .map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`sap-page-btn ${p === page ? "is-active" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}

            <button
              type="button"
              className="sap-page-btn"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              title="Next Page"
            >
              ›
            </button>
            <button
              type="button"
              className="sap-page-btn"
              disabled={page >= totalPages}
              onClick={() => setPage(totalPages)}
              title="Last Page"
            >
              »
            </button>
          </div>
        </div>
      </section>

      {/* 6. Email Preview Modal with Device Switcher & Company Branding */}
      {previewModalOpen && selectedTemplate && typeof document !== "undefined" && createPortal(
        <div className="sa-modal-backdrop">
          <div className="sa-modal-content" style={{ maxWidth: 700 }}>
            <div className="sa-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: selectedTemplate.themeColor || "#352fa8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                  }}
                >
                  <Mail size={16} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15 }}>
                    {selectedTemplate.name}
                  </h3>
                  <span style={{ fontSize: 11, color: "var(--sa-text-muted)" }}>
                    Sender:{" "}
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, verticalAlign: "middle" }}>
                      <span style={{ width: 15, height: 15, borderRadius: 4, background: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 28 28" fill="none">
                          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="21" cy="7" r="3" fill="#38bdf8" />
                        </svg>
                      </span>
                      <strong>{selectedTemplate.companyName || "TeamFlow AI"}</strong>
                    </span>{" "}
                    · For: <strong>{selectedTemplate.organizationName || "Acme Technologies"}</strong>
                  </span>
                </div>
              </div>

              {/* Desktop / Mobile Preview Mode Switcher */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", marginRight: 12 }}>
                <button
                  type="button"
                  className={`sa-btn sa-btn-sm ${previewDevice === "desktop" ? "sa-btn-primary" : "sa-btn-secondary"}`}
                  onClick={() => setPreviewDevice("desktop")}
                  title="Desktop Preview (600px)"
                >
                  <Monitor size={13} /> Desktop
                </button>
                <button
                  type="button"
                  className={`sa-btn sa-btn-sm ${previewDevice === "mobile" ? "sa-btn-primary" : "sa-btn-secondary"}`}
                  onClick={() => setPreviewDevice("mobile")}
                  title="Mobile Device Preview (380px)"
                >
                  <Smartphone size={13} /> Mobile
                </button>
              </div>

              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setPreviewModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body" style={{ background: "var(--sa-bg, #f1f5f9)", padding: "20px 24px" }}>
              {/* Email Envelope Header */}
              <div className="tpl-preview-envelope">
                <div>
                  <strong>From:</strong>{" "}
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, verticalAlign: "middle" }}>
                    <span style={{ width: 18, height: 18, borderRadius: 5, background: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 28 28" fill="none">
                        <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="21" cy="7" r="2.8" fill="#38bdf8" />
                      </svg>
                    </span>
                    <strong>{selectedTemplate.companyName || "TeamFlow AI"}</strong>
                  </span>{" "}
                  &lt;notifications@teamflow.ai&gt;
                </div>
                <div>
                  <strong>To:</strong> Aarav Sharma &lt;aarav.sharma@acme.demo&gt;
                </div>
                <div>
                  <strong>Subject:</strong>{" "}
                  {(selectedTemplate.subject || "")
                    .replace(/{{company_name}}/g, selectedTemplate.companyName || "TeamFlow AI")
                    .replace(/{{organization_name}}/g, selectedTemplate.organizationName || "Acme Technologies")}
                </div>
              </div>

              {/* Rendered Colored Template Body */}
              <div
                className={`tpl-preview-viewport is-${previewDevice}`}
                style={{
                  maxWidth: previewDevice === "mobile" ? 440 : 580,
                  margin: "0 auto",
                  transition: "max-width 0.2s ease",
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: (selectedTemplate.body || "")
                      .replace(/{{company_name}}/g, selectedTemplate.companyName || "TeamFlow AI")
                      .replace(/{{organization_name}}/g, selectedTemplate.organizationName || "Acme Technologies")
                      .replace(/{{user_name}}/g, "Aarav Sharma")
                      .replace(/{{user_email}}/g, "aarav.sharma@acme.demo")
                      .replace(/{{temporary_password}}/g, "TempPass#2026!Secured")
                      .replace(/{{plan_name}}/g, "Enterprise Business Plan")
                      .replace(/{{invoice_id}}/g, "INV-2024-1089")
                      .replace(/{{invoice_amount}}/g, "14,999")
                      .replace(/{{base_amount}}/g, "12,711")
                      .replace(/{{tax_amount}}/g, "2,288")
                      .replace(/{{billing_month}}/g, "October 2024")
                      .replace(/{{billing_period}}/g, "Oct 1 - Oct 31, 2024")
                      .replace(/{{renewal_date}}/g, "Nov 01, 2024")
                      .replace(/{{renewal_price}}/g, "14,999")
                      .replace(/{{card_brand}}/g, "Visa Corporate")
                      .replace(/{{card_last4}}/g, "4021")
                      .replace(/{{active_seats}}/g, "84")
                      .replace(/{{client_ip}}/g, "103.214.60.12 (Bangalore, IN)")
                      .replace(/{{user_agent}}/g, "Chrome 129 / Windows 11")
                      .replace(/{{login_timestamp}}/g, "26 Oct 2026, 03:00 pm IST")
                      .replace(/{{location_city}}/g, "Frankfurt")
                      .replace(/{{location_country}}/g, "Germany")
                      .replace(/{{tokens_consumed}}/g, "9,120,400")
                      .replace(/{{tokens_limit}}/g, "10,000,000")
                      .replace(/{{tokens_remaining}}/g, "879,600")
                      .replace(/{{quota_reset_date}}/g, "Nov 01, 2024")
                      .replace(/{{inviter_name}}/g, "Rahul Sharma (Admin)")
                      .replace(/{{assigned_role}}/g, "Team Lead (Level 3)")
                      .replace(/{{department_name}}/g, "Engineering CC-402")
                      .replace(/{{maintenance_window}}/g, "Sunday, Oct 27 · 02:00 - 03:30 AM IST")
                      .replace(/{{login_url}}/g, "#")
                      .replace(/{{reset_url}}/g, "#")
                      .replace(/{{invoice_pdf_url}}/g, "#")
                      .replace(/{{billing_portal_url}}/g, "#")
                      .replace(/{{terminate_sessions_url}}/g, "#")
                      .replace(/{{boost_tokens_url}}/g, "#")
                      .replace(/{{invite_accept_url}}/g, "#"),
                  }}
                />
              </div>
            </div>

            <div className="sa-modal-footer">
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={() => handleSendTestEmail(selectedTemplate)}
              >
                <Send size={14} /> Send Live Test to Inbox
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-primary"
                onClick={() => setPreviewModalOpen(false)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 7. Visual Template Builder / Editor Modal with Live Real-Time Preview */}
      {editModalOpen && editingTemplate && typeof document !== "undefined" && createPortal(
        <div className="sa-modal-backdrop">
          <div className="sa-modal-content tpl-editor-modal">
            <div className="sa-modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: 16 }}>
                  {editingTemplate.isNew
                    ? "Create New Email Notification Template"
                    : `Visual Template Builder: ${editingTemplate.name || "Untitled Template"}`}
                </h3>
                <span style={{ fontSize: 12, color: "var(--sa-text-muted)" }}>
                  {editingTemplate.isNew
                    ? "Fill in key parameters below. Real-time preview updates instantly on the right."
                    : "Update notification copy and options with instant real-time live preview."}
                </span>
              </div>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setEditModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="sa-modal-body" style={{ padding: 20 }}>
                <div className="tpl-editor-grid">
                  {/* Left Column: Friendly Visual Form (Main Fields Only) */}
                  <div className="tpl-editor-form-col">
                    {/* Compact Brand Accent Theme Bar */}
                    <div className="tpl-theme-bar">
                      <span className="tpl-theme-label">Brand Theme:</span>
                      <div className="tpl-color-swatches" style={{ margin: 0 }}>
                        {BRAND_PRESET_COLORS.map((c) => (
                          <button
                            key={c.hex}
                            type="button"
                            className={`tpl-color-btn ${editingTemplate.themeColor === c.hex ? "is-active" : ""}`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                            onClick={() =>
                              setEditingTemplate({
                                ...editingTemplate,
                                themeColor: c.hex,
                                themeBg: c.bg,
                              })
                            }
                          />
                        ))}
                        <input
                          type="color"
                          value={editingTemplate.themeColor || "#352fa8"}
                          onChange={(e) =>
                            setEditingTemplate({
                              ...editingTemplate,
                              themeColor: e.target.value,
                              themeBg: `${e.target.value}18`,
                            })
                          }
                          className="tpl-color-picker-input"
                          title="Custom Hex Color"
                        />
                      </div>
                    </div>

                    {/* Row 1: Template Name & Category */}
                    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}>
                      <div className="sa-form-group">
                        <label>Template Name *</label>
                        <input
                          type="text"
                          className="sa-form-input"
                          value={editingTemplate.name || ""}
                          onChange={(e) =>
                            setEditingTemplate({
                              ...editingTemplate,
                              name: e.target.value,
                            })
                          }
                          placeholder="e.g. Birthday Celebration or Onboarding"
                          required
                        />
                      </div>

                      <div className="sa-form-group">
                        <label>Category</label>
                        <select
                          className="sa-form-select"
                          value={editingTemplate.category || "General"}
                          onChange={(e) =>
                            setEditingTemplate({
                              ...editingTemplate,
                              category: e.target.value,
                            })
                          }
                        >
                          <option value="General">General</option>
                          <option value="Authentication">Authentication</option>
                          <option value="Security">Security</option>
                          <option value="Billing">Billing &amp; GST</option>
                          <option value="AI Management">AI Management</option>
                          <option value="System">System &amp; Ops</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Sender Brand & Target Tenant */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div className="sa-form-group">
                        <label>Sender Brand Name</label>
                        <input
                          type="text"
                          className="sa-form-input"
                          value={editingTemplate.companyName || ""}
                          onChange={(e) =>
                            setEditingTemplate({
                              ...editingTemplate,
                              companyName: e.target.value,
                            })
                          }
                          placeholder="e.g. TeamFlow AI"
                        />
                      </div>

                      <div className="sa-form-group">
                        <label>Target Tenant / Workspace</label>
                        <input
                          type="text"
                          className="sa-form-input"
                          value={editingTemplate.organizationName || ""}
                          onChange={(e) =>
                            setEditingTemplate({
                              ...editingTemplate,
                              organizationName: e.target.value,
                            })
                          }
                          placeholder="e.g. BizzFly or All Organizations"
                        />
                      </div>
                    </div>

                    {/* Row 3: Email Subject Line */}
                    <div className="sa-form-group">
                      <label>Email Subject Line *</label>
                      <input
                        type="text"
                        className="sa-form-input"
                        value={editingTemplate.subject || ""}
                        onChange={(e) =>
                          setEditingTemplate({
                            ...editingTemplate,
                            subject: e.target.value,
                          })
                        }
                        placeholder="e.g. Welcome to your workspace — Let's get started"
                        required
                      />
                    </div>

                    {/* Row 4: Greeting / Main Headline */}
                    <div className="sa-form-group">
                      <label>Email Main Headline *</label>
                      <input
                        type="text"
                        className="sa-form-input"
                        value={editingTemplate.headline || ""}
                        onChange={(e) =>
                          setEditingTemplate({
                            ...editingTemplate,
                            headline: e.target.value,
                          })
                        }
                        placeholder="e.g. Welcome to your new workspace"
                        required
                      />
                    </div>

                    {/* Row 5: Plain Text Message Body */}
                    <div className="sa-form-group">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <label>Message Content (Plain Text) *</label>
                        <span style={{ fontSize: 11, color: "var(--sa-text-muted)" }}>
                          Line breaks create paragraphs
                        </span>
                      </div>
                      <textarea
                        className="sa-form-textarea"
                        rows={4}
                        value={editingTemplate.message || ""}
                        onChange={(e) =>
                          setEditingTemplate({
                            ...editingTemplate,
                            message: e.target.value,
                          })
                        }
                        placeholder="Type your message here. For example: Your workspace account has been configured. You can now log in and access your team tools."
                        required
                      />
                    </div>

                    {/* Row 6: Call to Action Button (Optional) */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div className="sa-form-group">
                        <label>CTA Button Label (Optional)</label>
                        <input
                          type="text"
                          className="sa-form-input"
                          value={editingTemplate.ctaText || ""}
                          onChange={(e) =>
                            setEditingTemplate({
                              ...editingTemplate,
                              ctaText: e.target.value,
                            })
                          }
                          placeholder="e.g. Celebrate Now or View Workspace"
                        />
                      </div>

                      <div className="sa-form-group">
                        <label>CTA Button Link (Optional)</label>
                        <input
                          type="text"
                          className="sa-form-input"
                          value={editingTemplate.ctaUrl || ""}
                          onChange={(e) =>
                            setEditingTemplate({
                              ...editingTemplate,
                              ctaUrl: e.target.value,
                            })
                          }
                          placeholder="e.g. https://app.teamflow.ai/login"
                        />
                      </div>
                    </div>

                    {/* Optional Collapsible for Advanced Elements */}
                    <details className="tpl-advanced-collapsible">
                      <summary className="tpl-advanced-summary">
                        <span>⚙️ Optional Advanced Elements (Badge, Highlight Box, Webhook Trigger, Footer Note)</span>
                      </summary>
                      <div className="tpl-advanced-content">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          <div className="sa-form-group">
                            <label>Badge Pill Text (Optional)</label>
                            <input
                              type="text"
                              className="sa-form-input"
                              value={editingTemplate.badgeText || ""}
                              onChange={(e) =>
                                setEditingTemplate({
                                  ...editingTemplate,
                                  badgeText: e.target.value,
                                })
                              }
                              placeholder="e.g. 👋 Account Ready or 🎉 Birthday"
                            />
                          </div>

                          <div className="sa-form-group">
                            <label>Highlight Info Box (Optional)</label>
                            <input
                              type="text"
                              className="sa-form-input"
                              value={editingTemplate.highlightNote || ""}
                              onChange={(e) =>
                                setEditingTemplate({
                                  ...editingTemplate,
                                  highlightNote: e.target.value,
                                })
                              }
                              placeholder="e.g. Note: Your access credentials have been sent separately"
                            />
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          <div className="sa-form-group">
                            <label>System Trigger Event</label>
                            <input
                              type="text"
                              className="sa-form-input"
                              value={editingTemplate.trigger || ""}
                              onChange={(e) =>
                                setEditingTemplate({
                                  ...editingTemplate,
                                  trigger: e.target.value,
                                })
                              }
                              placeholder="e.g. user.welcome.signup or billing.invoice.paid"
                            />
                          </div>

                          <div className="sa-form-group">
                            <label>Footer Support Note</label>
                            <input
                              type="text"
                              className="sa-form-input"
                              value={editingTemplate.footerNote || ""}
                              onChange={(e) =>
                                setEditingTemplate({
                                  ...editingTemplate,
                                  footerNote: e.target.value,
                                })
                              }
                              placeholder="e.g. If you have any questions, reply to this email"
                            />
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>

                  {/* Right Column: Live Real-time Interactive Preview (Proper Space Utilization) */}
                  <div className="tpl-editor-preview-col">
                    <div className="tpl-editor-preview-header">
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <strong style={{ fontSize: 13, color: "var(--sa-text-main)" }}>
                          Live Real-Time Preview
                        </strong>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 10.5,
                            color: "#059669",
                            fontWeight: 650,
                            background: "rgba(16, 185, 129, 0.12)",
                            padding: "2px 7px",
                            borderRadius: 999,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#10b981",
                              boxShadow: "0 0 6px #10b981",
                            }}
                          />
                          Live Sync
                        </span>
                      </div>
                      <div className="tpl-device-tabs">
                        <button
                          type="button"
                          className={`tpl-device-tab ${previewDevice === "desktop" ? "is-active" : ""}`}
                          onClick={() => setPreviewDevice("desktop")}
                        >
                          <Monitor size={13} /> Desktop
                        </button>
                        <button
                          type="button"
                          className={`tpl-device-tab ${previewDevice === "mobile" ? "is-active" : ""}`}
                          onClick={() => setPreviewDevice("mobile")}
                        >
                          <Smartphone size={13} /> Mobile
                        </button>
                      </div>
                    </div>

                    {/* Live Subject Header Preview */}
                    <div className="tpl-preview-subject-bar">
                      <span className="tpl-preview-subject-label">Subject:</span>
                      <span className="tpl-preview-subject-text">
                        {interpolateTemplateVariables(
                          editingTemplate.subject?.trim() || "Subject line will preview here...",
                          editingTemplate
                        )}
                      </span>
                    </div>

                    {/* Viewport Frame with Proper Space Utilization */}
                    <div className="tpl-preview-viewport-wrap">
                      {previewDevice === "mobile" ? (
                        /* Realistic 430px Modern Phone Container */
                        <div className="tpl-mobile-frame">
                          {/* Mobile Phone Status Bar */}
                          <div className="tpl-phone-status-bar">
                            <span className="tpl-phone-time">9:41</span>
                            <div className="tpl-phone-dynamic-island">
                              <span className="tpl-phone-lens" />
                            </div>
                            <div className="tpl-phone-indicators">
                              <span style={{ fontSize: 10, fontWeight: 700 }}>5G</span>
                              <div className="tpl-phone-battery">
                                <div className="tpl-phone-battery-fill" />
                              </div>
                            </div>
                          </div>

                          {/* Mobile Native Mail Header */}
                          <div className="tpl-phone-email-bar">
                            <span style={{ color: "#3b66ff", fontSize: 12.5, fontWeight: 650 }}>
                              ‹ Inbox
                            </span>
                            <span style={{ fontSize: 11, color: "var(--sa-text-muted)" }}>
                              Today, 9:41 AM
                            </span>
                          </div>

                          {/* Email Body Fills Full Mobile Width */}
                          <div className="tpl-phone-content-area">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: interpolateTemplateVariables(
                                  generateEmailHtml(editingTemplate),
                                  editingTemplate
                                ),
                              }}
                            />
                          </div>

                          {/* Bottom Home Indicator */}
                          <div className="tpl-phone-home-indicator" />
                        </div>
                      ) : (
                        /* Desktop Frame with Window Controls */
                        <div className="tpl-desktop-frame">
                          <div className="tpl-desktop-window-bar">
                            <div className="tpl-window-dots">
                              <span className="tpl-window-dot red" />
                              <span className="tpl-window-dot yellow" />
                              <span className="tpl-window-dot green" />
                            </div>
                            <span className="tpl-desktop-window-title">
                              {editingTemplate.companyName || "TeamFlow AI"} — Desktop Mail Preview
                            </span>
                          </div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: interpolateTemplateVariables(
                                generateEmailHtml(editingTemplate),
                                editingTemplate
                              ),
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sa-modal-footer">
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="sa-btn sa-btn-primary">
                  {editingTemplate.isNew ? "Create Template" : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default EmailTemplates;