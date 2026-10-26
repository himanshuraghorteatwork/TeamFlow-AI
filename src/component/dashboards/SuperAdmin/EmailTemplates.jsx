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
    subject: "Welcome to {{company_name}} account for {{organization_name}}",
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
      <span style="font-size: 17px; font-weight: 750; letter-spacing: -0.3px; color: #ffffff;">{{company_name}}</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff; display: flex; align-items: center; gap: 4px;">
      👋 Account Ready
    </div>
  </div>

  <!-- 2. Email Inner Content -->
  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #4f46e5; margin-bottom: 12px;">
      WELCOME TO {{company_name}}
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      Your {{company_name}} account for {{organization_name}}
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      You have been added to <strong>{{organization_name}}</strong> on <strong>{{company_name}}</strong>.
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
          {{user_email}}
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.5px;">
          PASSWORD
        </td>
        <td style="padding: 12px 16px; color: #0f172a; font-family: ui-monospace, SFMono-Regular, monospace; font-weight: 700; font-size: 13.5px;">
          {{temporary_password}}
        </td>
      </tr>
    </table>

    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0 0 24px;">
      This password was generated for you and is not shared with anyone else. Use the button below to replace it with one you will remember -- you will be asked for the password above, and then signed in.
    </p>

    <!-- Full-width CTA Button -->
    <div style="margin: 0 0 24px;">
      <a href="{{login_url}}" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #352fa8; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(53, 47, 168, 0.3);">
        Set your own password
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
      <span>{{company_name}}</span>
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
    subject: "Reset your {{company_name}} password for {{organization_name}}",
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
      <span style="font-size: 17px; font-weight: 750; color: #ffffff;">{{company_name}}</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      🔐 Security Auth
    </div>
  </div>

  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #059669; margin-bottom: 12px;">
      PASSWORD SECURITY FROM {{company_name}}
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      Password Reset for {{organization_name}}
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      We received a password reset request for your account associated with <strong>{{organization_name}}</strong> on <strong>{{company_name}}</strong>.
    </p>

    <!-- Audit Details Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; width: 32%; text-transform: uppercase; font-size: 10.5px;">ACCOUNT</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 600;">{{user_email}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">REQUEST IP</td>
        <td style="padding: 12px 16px; color: #0f172a; font-family: monospace;">{{client_ip}}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">LINK EXPIRY</td>
        <td style="padding: 12px 16px; color: #dc2626; font-weight: 600;">30 minutes from issuance</td>
      </tr>
    </table>

    <div style="margin: 0 0 24px;">
      <a href="{{reset_url}}" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #047857; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(4, 120, 87, 0.3);">
        Choose new password
      </a>
    </div>

    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">
      If you did not request this, please disregard this email. Your {{company_name}} account remains secure.
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
      <span>{{company_name}}</span>
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
    subject: "{{company_name}} Tax Invoice #{{invoice_id}} for {{organization_name}}",
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
      <span style="font-size: 17px; font-weight: 750; color: #ffffff;">{{company_name}}</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      🧾 Tax Invoice Settled
    </div>
  </div>

  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #7c3aed; margin-bottom: 12px;">
      TAX INVOICE ISSUED BY {{company_name}}
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      Your {{company_name}} invoice for {{organization_name}}
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      Thank you for your business. Payment for <strong>{{organization_name}}</strong> has been processed successfully by <strong>{{company_name}}</strong>.
    </p>

    <!-- Invoice Data Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; width: 35%; text-transform: uppercase; font-size: 10.5px;">INVOICE NO.</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 600; font-family: monospace;">{{invoice_id}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">CUSTOMER COMPANY</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 600;">{{organization_name}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">PLAN & PERIOD</td>
        <td style="padding: 12px 16px; color: #0f172a;">{{plan_name}} ({{billing_period}})</td>
      </tr>
      <tr style="background: #faf5ff;">
        <td style="padding: 12px 16px; color: #6b21a8; font-weight: 800; text-transform: uppercase; font-size: 11px;">TOTAL PAID</td>
        <td style="padding: 12px 16px; color: #6b21a8; font-weight: 800; font-size: 15px;">₹{{invoice_amount}}</td>
      </tr>
    </table>

    <div style="margin: 0 0 24px;">
      <a href="{{invoice_pdf_url}}" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #6d28d9; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(109, 40, 217, 0.3);">
        Download PDF Tax Receipt
      </a>
    </div>

    <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
      GSTIN: 29AAACT9810Q1ZS · Issued by {{company_name}} Finance Division
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
      <span>{{company_name}}</span>
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
    subject: "Upcoming {{company_name}} subscription renewal for {{organization_name}}",
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
      <span style="font-size: 17px; font-weight: 750; color: #ffffff;">{{company_name}}</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      🔄 Upcoming Renewal
    </div>
  </div>

  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #b45309; margin-bottom: 12px;">
      RENEWAL NOTICE FROM {{company_name}}
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      Subscription Renewal for {{organization_name}}
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      This is a reminder that your <strong>{{company_name}}</strong> plan for <strong>{{organization_name}}</strong> is scheduled to renew automatically.
    </p>

    <!-- Renewal Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; width: 35%; text-transform: uppercase; font-size: 10.5px;">COMPANY</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 600;">{{organization_name}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">PLAN & SEATS</td>
        <td style="padding: 12px 16px; color: #0f172a;">{{plan_name}} ({{active_seats}} seats)</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">RENEWAL DATE</td>
        <td style="padding: 12px 16px; color: #0f172a;">{{renewal_date}}</td>
      </tr>
      <tr style="background: #fffbeb;">
        <td style="padding: 12px 16px; color: #92400e; font-weight: 800; text-transform: uppercase; font-size: 11px;">CHARGE AMOUNT</td>
        <td style="padding: 12px 16px; color: #92400e; font-weight: 800; font-size: 15px;">₹{{renewal_price}}/month</td>
      </tr>
    </table>

    <div style="margin: 0 0 24px;">
      <a href="{{billing_portal_url}}" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #b45309; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(180, 83, 9, 0.3);">
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
      <span>{{company_name}}</span>
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
    subject: "[Security Alert] {{company_name}} sign-in from new device for {{organization_name}}",
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
      <span style="font-size: 17px; font-weight: 750; color: #ffffff;">{{company_name}}</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      🛡️ Security Alert
    </div>
  </div>

  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #dc2626; margin-bottom: 12px;">
      SECURITY GATEWAY · {{company_name}}
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      Unrecognized Sign-in for {{organization_name}}
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      Your <strong>{{company_name}}</strong> account belonging to <strong>{{organization_name}}</strong> was accessed from an unrecognized environment.
    </p>

    <!-- Sign-in Audit Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px; border: 1px solid #fecaca; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <tr style="border-bottom: 1px solid #fee2e2;">
        <td style="padding: 12px 16px; color: #991b1b; font-weight: 700; width: 35%; text-transform: uppercase; font-size: 10.5px;">LOCATION</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 700;">{{location_city}}, {{location_country}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #fee2e2;">
        <td style="padding: 12px 16px; color: #991b1b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">IP ADDRESS</td>
        <td style="padding: 12px 16px; color: #0f172a; font-family: monospace;">{{client_ip}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #fee2e2;">
        <td style="padding: 12px 16px; color: #991b1b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">DEVICE</td>
        <td style="padding: 12px 16px; color: #0f172a;">{{user_agent}}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #991b1b; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">TIME</td>
        <td style="padding: 12px 16px; color: #0f172a;">{{login_timestamp}}</td>
      </tr>
    </table>

    <div style="margin: 0 0 24px;">
      <a href="{{terminate_sessions_url}}" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #b91c1c; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(185, 28, 28, 0.3);">
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
      <span>{{company_name}}</span>
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
    subject: "Action Required: {{organization_name}} reached 90% of AI tokens on {{company_name}}",
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
      <span style="font-size: 17px; font-weight: 750; color: #ffffff;">{{company_name}}</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      ⚡ AI Quota Alert
    </div>
  </div>

  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #c026d3; margin-bottom: 12px;">
      AI RUNTIME ENGINE · {{company_name}}
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      AI Token Limit for {{organization_name}}
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      Your team at <strong>{{organization_name}}</strong> has reached 90% of its monthly allocated token quota on <strong>{{company_name}}</strong>.
    </p>

    <!-- AI Consumption Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px; border: 1px solid #f5d0fe; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <tr style="border-bottom: 1px solid #fae8ff;">
        <td style="padding: 12px 16px; color: #86198f; font-weight: 700; width: 35%; text-transform: uppercase; font-size: 10.5px;">CONSUMED</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 700;">{{tokens_consumed}} / {{tokens_limit}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #fae8ff;">
        <td style="padding: 12px 16px; color: #86198f; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">REMAINING</td>
        <td style="padding: 12px 16px; color: #d946ef; font-weight: 700;">{{tokens_remaining}} tokens</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #86198f; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">RESET DATE</td>
        <td style="padding: 12px 16px; color: #0f172a;">{{quota_reset_date}}</td>
      </tr>
    </table>

    <div style="margin: 0 0 24px;">
      <a href="{{boost_tokens_url}}" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #a21caf; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(162, 28, 175, 0.3);">
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
      <span>{{company_name}}</span>
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
    subject: "{{inviter_name}} invited you to {{organization_name}} on {{company_name}}",
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
      <span style="font-size: 17px; font-weight: 750; color: #ffffff;">{{company_name}}</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      👥 Team Invite
    </div>
  </div>

  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #0284c7; margin-bottom: 12px;">
      WORKSPACE COLLABORATION · {{company_name}}
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      Join {{organization_name}} on {{company_name}}
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      <strong>{{inviter_name}}</strong> has invited you to collaborate in the workspace for <strong>{{organization_name}}</strong>.
    </p>

    <!-- Workspace Details Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px; border: 1px solid #bae6fd; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <tr style="border-bottom: 1px solid #e0f2fe;">
        <td style="padding: 12px 16px; color: #0369a1; font-weight: 700; width: 35%; text-transform: uppercase; font-size: 10.5px;">COMPANY</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 700;">{{organization_name}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e0f2fe;">
        <td style="padding: 12px 16px; color: #0369a1; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">ASSIGNED ROLE</td>
        <td style="padding: 12px 16px; color: #0284c7; font-weight: 700;">{{assigned_role}}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; color: #0369a1; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">DEPARTMENT</td>
        <td style="padding: 12px 16px; color: #0f172a;">{{department_name}}</td>
      </tr>
    </table>

    <div style="margin: 0 0 24px;">
      <a href="{{invite_accept_url}}" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #0369a1; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; box-shadow: 0 4px 14px rgba(3, 105, 161, 0.3);">
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
      <span>{{company_name}}</span>
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
    subject: "Notice: Scheduled {{company_name}} Maintenance on {{maintenance_date}}",
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
      <span style="font-size: 17px; font-weight: 750; color: #ffffff;">{{company_name}}</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      🛠️ Ops Notice
    </div>
  </div>

  <div style="padding: 32px 28px 28px;">
    <div style="font-size: 11px; font-weight: 750; letter-spacing: 0.8px; text-transform: uppercase; color: #475569; margin-bottom: 12px;">
      PLATFORM INFRASTRUCTURE · {{company_name}}
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 800; line-height: 1.3; color: #0f172a; letter-spacing: -0.5px;">
      Maintenance Notice for {{organization_name}}
    </h1>

    <p style="font-size: 14px; color: #475569; line-height: 1.55; margin: 0 0 16px;">
      <strong>{{company_name}}</strong> will conduct scheduled infrastructure maintenance affecting workspaces including <strong>{{organization_name}}</strong>.
    </p>

    <!-- Maintenance Table -->
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #ffffff;">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #475569; font-weight: 700; width: 35%; text-transform: uppercase; font-size: 10.5px;">WINDOW</td>
        <td style="padding: 12px 16px; color: #0f172a; font-weight: 700;">{{maintenance_window}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 16px; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 10.5px;">TENANT</td>
        <td style="padding: 12px 16px; color: #0f172a;">{{organization_name}}</td>
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
      <span>{{company_name}}</span>
    </div>
    <div style="font-size: 11px; color: #94a3b8;">
      Sent 26 Oct 2026, 03:00 pm IST (Asia/Kolkata)
    </div>
  </div>
</div>`,
  },
];

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
    setEditingTemplate({ ...tpl });
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTemplate) return;
    setTemplates((prev) => {
      const exists = prev.some((t) => t.id === editingTemplate.id);
      if (exists) {
        return prev.map((t) => (t.id === editingTemplate.id ? editingTemplate : t));
      }
      return [editingTemplate, ...prev];
    });
    setEditModalOpen(false);
    notify(`Template "${editingTemplate.name}" saved successfully.`);
  };

  const handleSendTestEmail = (tpl) => {
    notify(`Test email dispatch initiated for "${tpl.name}". Sent to Super Admin inbox.`);
  };

  return (
    <div className="sa-page-container sa-templates-page">
      {/* 1. Header with SAP Master Badge */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>
            Email Notification Templates
            <span className="sap-system-badge">SAP-TPL · COMM CLIENT 100</span>
          </h1>
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
            onClick={() => {
              setEditingTemplate({
                id: `TPL-${1000 + templates.length + 1}`,
                name: "New Custom Template",
                companyName: "TeamFlow AI",
                organizationName: "Acme Technologies",
                orgCode: "ORG-ACME-1009",
                category: "Authentication",
                themeColor: "#352fa8",
                themeBg: "#ede9fe",
                accentGradient: "linear-gradient(135deg, #352fa8 0%, #4338ca 100%)",
                icon: LayoutTemplate,
                badgeText: "👋 Account Ready",
                subject: "Your {{company_name}} account for {{organization_name}}",
                trigger: "custom.event.notification",
                triggerDescription: "Triggered on custom user lifecycle event",
                engine: "Liquid v5.4",
                openRate: 0.0,
                clickRate: 0.0,
                status: "Active",
                lastUpdated: "Just now",
                lastAuthor: "Himanshu (Super Admin)",
                body: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
  <div style="background: #352fa8; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; color: #ffffff;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span style="font-size: 17px; font-weight: 750; color: #ffffff;">{{company_name}}</span>
    </div>
    <div style="background: rgba(255, 255, 255, 0.18); border-radius: 999px; padding: 4px 12px; font-size: 11.5px; font-weight: 600; color: #ffffff;">
      👋 Notification
    </div>
  </div>
  <div style="padding: 32px 28px 28px;">
    <h2>Hello {{user_name}}!</h2>
    <p>Your message content from {{company_name}} for {{organization_name}}.</p>
  </div>
  <div style="background: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
    <div style="display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 750; color: #0f172a; margin-bottom: 8px;">
      <div style="width: 24px; height: 24px; border-radius: 6px; background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.15);">
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="21" cy="7" r="2.6" fill="#38bdf8" />
        </svg>
      </div>
      <span>{{company_name}}</span>
    </div>
  </div>
</div>`,
              });
              setEditModalOpen(true);
            }}
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
                  <th style={{ width: 140 }}>Template ID & Thumbnail</th>
                  <th>Template Name & Engine</th>
                  <th>Target Company / Organization</th>
                  <th>Category & Theme</th>
                  <th>Trigger Event</th>
                  <th>Subject Line</th>
                  <th>Open / Click Rates</th>
                  <th>Status</th>
                  <th>Last Modified</th>
                  <th style={{ textAlign: "right", width: 130 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTemplates.map((tpl) => {
                  const isChecked = selectedIds.has(tpl.id);
                  const IconComp = tpl.icon || LayoutTemplate;
                  return (
                    <tr key={tpl.id} className={isChecked ? "is-selected" : ""} onClick={() => handleOpenPreview(tpl)} style={{ cursor: "pointer" }}>
                      <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectRow(tpl.id)}
                        />
                      </td>

                      {/* Visual Thumbnail & ID */}
                      <td>
                        <div className="tpl-thumb-id-cell">
                          <div
                            className="tpl-thumb-box"
                            style={{
                              background: tpl.themeColor || "#352fa8",
                            }}
                          >
                            <IconComp size={16} color="#ffffff" strokeWidth={2.2} />
                          </div>
                          <div>
                            <span className="sap-id-cell">{tpl.id}</span>
                            <span className="sap-pernr-text" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                              <span style={{ width: 14, height: 14, borderRadius: 4, background: "linear-gradient(135deg, #4361ee 0%, #3a0ca3 50%, #f72585 100%)", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <svg width="9" height="9" viewBox="0 0 28 28" fill="none">
                                  <path d="M8 9H20M14 9V19M11 19H17" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                  <circle cx="21" cy="7" r="3" fill="#38bdf8" />
                                </svg>
                              </span>
                              {tpl.companyName || "TeamFlow AI"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Template Name & Engine */}
                      <td>
                        <div className="tpl-name-col">
                          <strong>{tpl.name}</strong>
                          <span className="tpl-engine-tag">{tpl.engine}</span>
                        </div>
                      </td>

                      {/* Explicit Target Company / Organization Column */}
                      <td>
                        <div className="tpl-company-col">
                          <div className="tpl-company-name-row">
                            <Building2 size={13} style={{ color: "#3b66ff", flexShrink: 0 }} />
                            <strong>{tpl.organizationName}</strong>
                          </div>
                          <span className="tpl-company-subtext">
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

                      {/* Trigger Event */}
                      <td>
                        <div className="tpl-trigger-cell">
                          <code>{tpl.trigger}</code>
                          <span className="tpl-trigger-desc">
                            {tpl.triggerDescription}
                          </span>
                        </div>
                      </td>

                      {/* Subject Line */}
                      <td>
                        <div className="tpl-subject-cell" title={tpl.subject}>
                          {(tpl.subject || "")
                            .replace(/{{company_name}}/g, tpl.companyName || "TeamFlow AI")
                            .replace(/{{organization_name}}/g, tpl.organizationName || "Acme Technologies")}
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
                          {tpl.status === "Active" ? "00 - Live" : "02 - Inactive"}
                        </span>
                      </td>

                      {/* Last Modified */}
                      <td>
                        <div className="sap-date-val">{tpl.lastUpdated}</div>
                        <div className="sap-time-ago">{tpl.lastAuthor}</div>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                        <div className="sap-action-group" style={{ justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            className="sap-table-btn"
                            title="Preview Rendered Email with Company Branding"
                            onClick={() => handleOpenPreview(tpl)}
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            type="button"
                            className="sap-table-btn"
                            title="Edit HTML Template & Company Branding"
                            onClick={() => handleOpenEdit(tpl)}
                          >
                            <Pencil size={14} />
                          </button>

                          <button
                            type="button"
                            className="sap-table-btn"
                            title="Dispatch Test Email"
                            onClick={() => handleSendTestEmail(tpl)}
                          >
                            <Send size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {paginatedTemplates.length === 0 && (
                  <tr>
                    <td colSpan={11} style={{ textAlign: "center", padding: 36, color: "var(--sa-text-muted)" }}>
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

            <div className="sa-modal-body" style={{ background: "#f1f5f9", padding: "20px 24px" }}>
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
                  maxWidth: previewDevice === "mobile" ? 380 : 580,
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

      {/* 7. Edit Template Modal with Company Branding Inputs */}
      {editModalOpen && editingTemplate && typeof document !== "undefined" && createPortal(
        <div className="sa-modal-backdrop">
          <div className="sa-modal-content" style={{ maxWidth: 720 }}>
            <div className="sa-modal-header">
              <h3>Edit Email Template: {editingTemplate.name}</h3>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setEditModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="sa-modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="sa-form-group">
                    <label>Sender Company / Product Name</label>
                    <input
                      type="text"
                      className="sa-form-input"
                      value={editingTemplate.companyName}
                      onChange={(e) =>
                        setEditingTemplate({
                          ...editingTemplate,
                          companyName: e.target.value,
                        })
                      }
                      placeholder="e.g. TeamFlow AI"
                      required
                    />
                  </div>

                  <div className="sa-form-group">
                    <label>Target Tenant Company / Organization</label>
                    <input
                      type="text"
                      className="sa-form-input"
                      value={editingTemplate.organizationName}
                      onChange={(e) =>
                        setEditingTemplate({
                          ...editingTemplate,
                          organizationName: e.target.value,
                        })
                      }
                      placeholder="e.g. Acme Technologies"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
                  <div className="sa-form-group">
                    <label>Template Display Name</label>
                    <input
                      type="text"
                      className="sa-form-input"
                      value={editingTemplate.name}
                      onChange={(e) =>
                        setEditingTemplate({
                          ...editingTemplate,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="sa-form-group">
                    <label>Category</label>
                    <select
                      className="sa-form-select"
                      value={editingTemplate.category}
                      onChange={(e) =>
                        setEditingTemplate({
                          ...editingTemplate,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="Authentication">Authentication</option>
                      <option value="Security">Security</option>
                      <option value="Billing">Billing & GST</option>
                      <option value="AI Management">AI Management</option>
                      <option value="System">System & Ops</option>
                    </select>
                  </div>
                </div>

                <div className="sa-form-group">
                  <label>Email Subject Line (supports merge tags)</label>
                  <input
                    type="text"
                    className="sa-form-input"
                    value={editingTemplate.subject}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        subject: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="sa-form-group">
                  <label>Trigger Condition Event</label>
                  <input
                    type="text"
                    className="sa-form-input"
                    value={editingTemplate.trigger}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        trigger: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="sa-form-group">
                  <label>HTML Email Template Body</label>
                  <textarea
                    className="sa-form-textarea"
                    rows={10}
                    style={{ fontFamily: "monospace", fontSize: 12 }}
                    value={editingTemplate.body}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        body: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="sa-merge-tags-hint">
                  <strong>Available Dynamic Merge Tags:</strong>
                  <code>
                    {"{{company_name}}"} · {"{{organization_name}}"} · {"{{user_name}}"} · {"{{user_email}}"} · {"{{temporary_password}}"} · {"{{plan_name}}"} · {"{{invoice_id}}"} · {"{{invoice_amount}}"} · {"{{renewal_date}}"} · {"{{login_url}}"}
                  </code>
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
                  Save Changes
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
