import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  User,
  Crown,
  CalendarDays,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Sparkles,
  Hexagon,
  Clock3,
  TriangleAlert,
  Building2,
  Code2,
  Palette,
  Mail,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  CheckCircle2,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./SuperAdminDashboard.css";

/* =========================================================================
   COMPREHENSIVE DATASET MAPPED BY DATE RANGE
   All KPIs, Growth Curves, Plan Distribution & AI Metrics update dynamically
   ========================================================================= */
const DASHBOARD_DATA_BY_RANGE = {
  "Oct 1, 2024 - Oct 31, 2024": {
    kpis: {
      organizations: { value: "186", trend: "12%", direction: "up", sub: "+ 20 this month" },
      users: { value: "1,248", trend: "8.4%", direction: "up", sub: "+ 95 this month" },
      revenue: { value: "₹2.48L", trend: "16%", direction: "up", sub: "+ ₹34,500 this month" },
      subscriptions: { value: "142", trend: "5.2%", direction: "up", sub: "21 trials • 9 expiring" },
    },
    userGrowth: [
      { month: "Jan", users: 350 },
      { month: "Feb", users: 510 },
      { month: "Mar", users: 620 },
      { month: "Apr", users: 700 },
      { month: "May", users: 820 },
      { month: "Jun", users: 930 },
      { month: "Jul", users: 1050 },
      { month: "Aug", users: 1180 },
      { month: "Sep", users: 1450 },
      { month: "Oct", users: 1650 },
    ],
    revenueGrowth: [
      { month: "Jan", revenue: 0.2 },
      { month: "Feb", revenue: 0.6 },
      { month: "Mar", revenue: 0.55 },
      { month: "Apr", revenue: 1.15 },
      { month: "May", revenue: 1.6 },
      { month: "Jun", revenue: 1.3 },
      { month: "Jul", revenue: 1.95 },
      { month: "Aug", revenue: 2.48 },
      { month: "Sep", revenue: 2.2 },
      { month: "Oct", revenue: 2.95 },
    ],
    plans: [
      { name: "Free", percent: 40, count: 57, color: "#5b74ff" },
      { name: "Pro", percent: 35, count: 50, color: "#2783ff" },
      { name: "Business", percent: 20, count: 28, color: "#ffb21c" },
      { name: "Enterprise", percent: 5, count: 7, color: "#ff454b" },
    ],
    totalSubscriptions: 142,
    aiMetrics: [
      { label: "Total Requests", display: "84,520", change: "18%", direction: "up", icon: Sparkles, color: "purple" },
      { label: "Tokens Used", display: "8.4M", change: "22%", direction: "up", icon: Hexagon, color: "orange" },
      { label: "Avg. Response Time", display: "1.2s", change: "12%", direction: "down", icon: Clock3, color: "green", isGood: true },
      { label: "Failed Requests", display: "124", change: "40%", direction: "down", icon: TriangleAlert, color: "red", isBad: true },
    ],
    recentOrganizations: [
      { name: "ABC Technologies", plan: "Business Plan", users: 84, status: "Active", time: "2 hours ago", icon: Building2, color: "blue" },
      { name: "XYZ Software", plan: "Pro Plan", users: 26, status: "Active", time: "5 hours ago", icon: Code2, color: "blue" },
      { name: "Startup Labs", plan: "Free Plan", users: 5, status: "Trial", time: "1 day ago", icon: TriangleAlert, color: "orange" },
      { name: "DesignHub", plan: "Pro Plan", users: 18, status: "Active", time: "2 days ago", icon: Palette, color: "dark-blue" },
      { name: "NextGen Solutions", plan: "Business Plan", users: 42, status: "Active", time: "2 days ago", icon: Mail, color: "pink" },
    ],
    recentActivities: [
      { time: "10:42 AM", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Changed SMTP config", details: "Updated email settings to AWS SES", color: "blue", status: "Success" },
      { time: "10:31 AM", initial: "R", user: "Rahul Sharma", role: "(Admin)", action: "Invited user", details: "priya@abc.com assigned to Engineering", color: "light-blue", status: "Success" },
      { time: "10:20 AM", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Suspended organization", details: "XYZ Software flagged for policy audit", color: "blue", status: "Warning" },
      { time: "09:55 AM", initial: "A", user: "Amit Verma", role: "(Admin)", action: "Changed plan", details: "Pro → Business annual tier upgrade", color: "sky", status: "Success" },
      { time: "09:32 AM", initial: "P", user: "System", role: "", action: "AI usage limit updated", details: "Increased quota to 50,000 tokens", color: "lavender", status: "Success" },
      { time: "09:15 AM", initial: "N", user: "Neha Sen", role: "(Admin)", action: "Generated Tax Invoice", details: "Invoice #INV-2024-1082 (₹24,999)", color: "pink", status: "Success" },
      { time: "08:50 AM", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Rotated JWT Secret", details: "Zero-downtime Auth cluster token refresh", color: "blue", status: "Success" },
      { time: "08:22 AM", initial: "K", user: "Karan Johar", role: "(Admin)", action: "Exported audit report", details: "CSV format downloaded (94 records)", color: "sky", status: "Success" },
      { time: "07:45 AM", initial: "P", user: "System", role: "", action: "Daily DB snapshot", details: "PostgreSQL automated backup to S3", color: "lavender", status: "Success" },
      { time: "07:10 AM", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Added custom role", details: "Billing Operations Lead with settlement rights", color: "blue", status: "Success" },
      { time: "06:30 AM", initial: "P", user: "System", role: "", action: "Health probe check", details: "All 6 production microservices operational", color: "green", status: "Success" },
    ],
  },
  "Last 30 Days": {
    kpis: {
      organizations: { value: "182", trend: "10.8%", direction: "up", sub: "+ 18 in last 30 days" },
      users: { value: "1,192", trend: "7.9%", direction: "up", sub: "+ 82 in last 30 days" },
      revenue: { value: "₹2.36L", trend: "14.5%", direction: "up", sub: "+ ₹29,800 in last 30 days" },
      subscriptions: { value: "138", trend: "4.8%", direction: "up", sub: "19 trials • 7 expiring" },
    },
    userGrowth: [
      { month: "Wk 1", users: 1100 },
      { month: "Wk 2", users: 1240 },
      { month: "Wk 3", users: 1420 },
      { month: "Wk 4", users: 1650 },
    ],
    revenueGrowth: [
      { month: "Wk 1", revenue: 2.1 },
      { month: "Wk 2", revenue: 2.3 },
      { month: "Wk 3", revenue: 2.48 },
      { month: "Wk 4", revenue: 2.95 },
    ],
    plans: [
      { name: "Free", percent: 42, count: 58, color: "#5b74ff" },
      { name: "Pro", percent: 34, count: 47, color: "#2783ff" },
      { name: "Business", percent: 19, count: 26, color: "#ffb21c" },
      { name: "Enterprise", percent: 5, count: 7, color: "#ff454b" },
    ],
    totalSubscriptions: 138,
    aiMetrics: [
      { label: "Total Requests", display: "79,410", change: "15%", direction: "up", icon: Sparkles, color: "purple" },
      { label: "Tokens Used", display: "7.8M", change: "18%", direction: "up", icon: Hexagon, color: "orange" },
      { label: "Avg. Response Time", display: "1.18s", change: "10%", direction: "down", icon: Clock3, color: "green", isGood: true },
      { label: "Failed Requests", display: "96", change: "35%", direction: "down", icon: TriangleAlert, color: "red", isBad: true },
    ],
    recentOrganizations: [
      { name: "NovaTech Solutions", plan: "Enterprise Plan", users: 120, status: "Active", time: "3 days ago", icon: Building2, color: "blue" },
      { name: "ABC Technologies", plan: "Business Plan", users: 84, status: "Active", time: "5 days ago", icon: Building2, color: "blue" },
      { name: "XYZ Software", plan: "Pro Plan", users: 26, status: "Active", time: "1 week ago", icon: Code2, color: "blue" },
      { name: "PixelCraft Studio", plan: "Pro Plan", users: 14, status: "Active", time: "2 weeks ago", icon: Palette, color: "dark-blue" },
      { name: "Startup Labs", plan: "Free Plan", users: 5, status: "Trial", time: "3 weeks ago", icon: TriangleAlert, color: "orange" },
    ],
    recentActivities: [
      { time: "Yesterday", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Backup executed", details: "All DB clusters verified & snapshotted", color: "blue", status: "Success" },
      { time: "3 days ago", initial: "N", user: "Neha Sen", role: "(Admin)", action: "Upgraded plan", details: "Free → Pro Tier (NovaTech Solutions)", color: "sky", status: "Success" },
      { time: "5 days ago", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Rotated API key", details: "Gemini 2.0 Flash production keys re-issued", color: "blue", status: "Success" },
      { time: "1 week ago", initial: "V", user: "Vikram Mehta", role: "(Admin)", action: "Invited 5 users", details: "vikram@novatech.io seat allocations", color: "lavender", status: "Success" },
      { time: "2 weeks ago", initial: "P", user: "System", role: "", action: "Auto-renewed license", details: "Business Plan (ABC Technologies)", color: "light-blue", status: "Success" },
      { time: "2 weeks ago", initial: "A", user: "Amit Verma", role: "(Admin)", action: "Updated 2FA Policy", details: "Enforced mandatory TOTP for all managers", color: "sky", status: "Success" },
      { time: "3 weeks ago", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Added webhook", details: "Stripe payout settlement webhook registered", color: "blue", status: "Success" },
      { time: "3 weeks ago", initial: "P", user: "System", role: "", action: "Security scan passed", details: "Zero high or critical vulnerabilities found", color: "green", status: "Success" },
      { time: "4 weeks ago", initial: "R", user: "Rahul Sharma", role: "(Admin)", action: "Onboarded client", details: "Startup Labs trial setup completed", color: "orange", status: "Success" },
      { time: "4 weeks ago", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Rate limit adjusted", details: "Increased OpenAI GPT-4o burst window", color: "blue", status: "Success" },
    ],
  },
  "This Quarter": {
    kpis: {
      organizations: { value: "210", trend: "15.6%", direction: "up", sub: "+ 48 this quarter" },
      users: { value: "1,520", trend: "14.2%", direction: "up", sub: "+ 230 this quarter" },
      revenue: { value: "₹7.15L", trend: "21.4%", direction: "up", sub: "+ ₹1,12,000 this quarter" },
      subscriptions: { value: "164", trend: "9.8%", direction: "up", sub: "28 trials • 12 expiring" },
    },
    userGrowth: [
      { month: "Aug", users: 1180 },
      { month: "Sep", users: 1450 },
      { month: "Oct", users: 1650 },
    ],
    revenueGrowth: [
      { month: "Aug", revenue: 2.48 },
      { month: "Sep", revenue: 2.2 },
      { month: "Oct", revenue: 2.95 },
    ],
    plans: [
      { name: "Free", percent: 38, count: 62, color: "#5b74ff" },
      { name: "Pro", percent: 36, count: 59, color: "#2783ff" },
      { name: "Business", percent: 21, count: 35, color: "#ffb21c" },
      { name: "Enterprise", percent: 5, count: 8, color: "#ff454b" },
    ],
    totalSubscriptions: 164,
    aiMetrics: [
      { label: "Total Requests", display: "248,600", change: "28%", direction: "up", icon: Sparkles, color: "purple" },
      { label: "Tokens Used", display: "24.5M", change: "31%", direction: "up", icon: Hexagon, color: "orange" },
      { label: "Avg. Response Time", display: "1.22s", change: "8%", direction: "down", icon: Clock3, color: "green", isGood: true },
      { label: "Failed Requests", display: "310", change: "25%", direction: "down", icon: TriangleAlert, color: "red", isBad: true },
    ],
    recentOrganizations: [
      { name: "ABC Technologies", plan: "Business Plan", users: 84, status: "Active", time: "Aug 15", icon: Building2, color: "blue" },
      { name: "NovaTech Solutions", plan: "Enterprise Plan", users: 120, status: "Active", time: "Aug 29", icon: Building2, color: "blue" },
      { name: "XYZ Software", plan: "Pro Plan", users: 26, status: "Active", time: "Sep 04", icon: Code2, color: "blue" },
      { name: "DesignHub", plan: "Pro Plan", users: 18, status: "Active", time: "Sep 18", icon: Palette, color: "dark-blue" },
      { name: "NextGen Solutions", plan: "Business Plan", users: 42, status: "Active", time: "Oct 02", icon: Mail, color: "pink" },
    ],
    recentActivities: [
      { time: "Sep 28", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Quarterly Audit", details: "SOC2 Type II Compliance verification passed", color: "blue", status: "Success" },
      { time: "Sep 15", initial: "R", user: "Rahul Sharma", role: "(Admin)", action: "Added Workspace", details: "Product Team Alpha workspace created", color: "light-blue", status: "Success" },
      { time: "Aug 30", initial: "A", user: "Amit Verma", role: "(Admin)", action: "Upgraded seat count", details: "Allocated 15 new developer seats", color: "sky", status: "Success" },
      { time: "Aug 18", initial: "P", user: "System", role: "", action: "Database migrated", details: "Zero-loss migration to PostgreSQL 16 cluster", color: "lavender", status: "Success" },
      { time: "Aug 02", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Onboarded Enterprise", details: "NovaTech Solutions enterprise provisioning", color: "blue", status: "Success" },
      { time: "Jul 24", initial: "N", user: "Neha Sen", role: "(Admin)", action: "Custom Domain Connected", details: "app.novatech.io verified with SSL certificate", color: "pink", status: "Success" },
      { time: "Jul 10", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Updated CORS Policy", details: "Restricted origin domains to authorized tenants", color: "blue", status: "Success" },
      { time: "Jul 01", initial: "P", user: "System", role: "", action: "Q3 License Reset", details: "Refreshed platform AI quota counters", color: "green", status: "Success" },
    ],
  },
  "This Year": {
    kpis: {
      organizations: { value: "248", trend: "28.4%", direction: "up", sub: "+ 112 this year" },
      users: { value: "1,840", trend: "34.1%", direction: "up", sub: "+ 540 this year" },
      revenue: { value: "₹26.4L", trend: "42.0%", direction: "up", sub: "+ ₹7,80,000 this year" },
      subscriptions: { value: "198", trend: "19.5%", direction: "up", sub: "34 trials • 15 expiring" },
    },
    userGrowth: [
      { month: "Jan", users: 350 }, { month: "Feb", users: 510 }, { month: "Mar", users: 620 },
      { month: "Apr", users: 700 }, { month: "May", users: 820 }, { month: "Jun", users: 930 },
      { month: "Jul", users: 1050 }, { month: "Aug", users: 1180 }, { month: "Sep", users: 1450 },
      { month: "Oct", users: 1650 },
    ],
    revenueGrowth: [
      { month: "Jan", revenue: 0.2 }, { month: "Feb", revenue: 0.6 }, { month: "Mar", revenue: 0.55 },
      { month: "Apr", revenue: 1.15 }, { month: "May", revenue: 1.6 }, { month: "Jun", revenue: 1.3 },
      { month: "Jul", revenue: 1.95 }, { month: "Aug", revenue: 2.48 }, { month: "Sep", revenue: 2.2 },
      { month: "Oct", revenue: 2.95 },
    ],
    plans: [
      { name: "Free", percent: 35, count: 69, color: "#5b74ff" },
      { name: "Pro", percent: 38, count: 75, color: "#2783ff" },
      { name: "Business", percent: 21, count: 42, color: "#ffb21c" },
      { name: "Enterprise", percent: 6, count: 12, color: "#ff454b" },
    ],
    totalSubscriptions: 198,
    aiMetrics: [
      { label: "Total Requests", display: "892,100", change: "45%", direction: "up", icon: Sparkles, color: "purple" },
      { label: "Tokens Used", display: "89.2M", change: "52%", direction: "up", icon: Hexagon, color: "orange" },
      { label: "Avg. Response Time", display: "1.24s", change: "15%", direction: "down", icon: Clock3, color: "green", isGood: true },
      { label: "Failed Requests", display: "1,180", change: "18%", direction: "down", icon: TriangleAlert, color: "red", isBad: true },
    ],
    recentOrganizations: [
      { name: "ABC Technologies", plan: "Business Plan", users: 84, status: "Active", time: "Jan 12", icon: Building2, color: "blue" },
      { name: "XYZ Software", plan: "Pro Plan", users: 26, status: "Active", time: "Feb 04", icon: Code2, color: "blue" },
      { name: "NovaTech Solutions", plan: "Enterprise Plan", users: 120, status: "Active", time: "Apr 18", icon: Building2, color: "blue" },
      { name: "DesignHub", plan: "Pro Plan", users: 18, status: "Active", time: "May 22", icon: Palette, color: "dark-blue" },
      { name: "NextGen Solutions", plan: "Business Plan", users: 42, status: "Active", time: "Jun 30", icon: Mail, color: "pink" },
    ],
    recentActivities: [
      { time: "Oct 24", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Platform update v2.4", details: "AI Gateway and Multi-tenant routing deployed", color: "blue", status: "Success" },
      { time: "Jul 15", initial: "R", user: "Rahul Sharma", role: "(Admin)", action: "Created Org", details: "ABC Technologies company profile configured", color: "light-blue", status: "Success" },
      { time: "May 10", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Stripe Connect enabled", details: "Automated billing settlements pipeline live", color: "blue", status: "Success" },
      { time: "Mar 04", initial: "P", user: "System", role: "", action: "Annual Security Audit", details: "Zero findings in penetration tests report", color: "lavender", status: "Success" },
      { time: "Jan 01", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "System initialized", details: "TeamFlow AI Enterprise v2.0 launched", color: "blue", status: "Success" },
      { time: "Feb 18", initial: "K", user: "Karan Johar", role: "(Admin)", action: "SAML SSO Configured", details: "Okta identity provider integration live", color: "sky", status: "Success" },
      { time: "Jun 12", initial: "A", user: "Amit Verma", role: "(Admin)", action: "Custom Webhook Trigger", details: "Slack notification alerts configured", color: "sky", status: "Success" },
    ],
  },
  "Today": {
    kpis: {
      organizations: { value: "186", trend: "1.2%", direction: "up", sub: "+ 2 today" },
      users: { value: "1,248", trend: "0.8%", direction: "up", sub: "+ 9 today" },
      revenue: { value: "₹2.48L", trend: "2.1%", direction: "up", sub: "+ ₹4,200 today" },
      subscriptions: { value: "142", trend: "0.5%", direction: "up", sub: "2 trials expiring" },
    },
    userGrowth: [
      { month: "08:00", users: 40 },
      { month: "10:00", users: 95 },
      { month: "12:00", users: 140 },
      { month: "14:00", users: 180 },
      { month: "16:00", users: 210 },
      { month: "18:00", users: 248 },
    ],
    revenueGrowth: [
      { month: "08:00", revenue: 0.4 },
      { month: "10:00", revenue: 0.9 },
      { month: "12:00", revenue: 1.4 },
      { month: "14:00", revenue: 1.8 },
      { month: "16:00", revenue: 2.1 },
      { month: "18:00", revenue: 2.48 },
    ],
    plans: [
      { name: "Free", percent: 40, count: 57, color: "#5b74ff" },
      { name: "Pro", percent: 35, count: 50, color: "#2783ff" },
      { name: "Business", percent: 20, count: 28, color: "#ffb21c" },
      { name: "Enterprise", percent: 5, count: 7, color: "#ff454b" },
    ],
    totalSubscriptions: 142,
    aiMetrics: [
      { label: "Total Requests", display: "4,120", change: "4%", direction: "up", icon: Sparkles, color: "purple" },
      { label: "Tokens Used", display: "410K", change: "6%", direction: "up", icon: Hexagon, color: "orange" },
      { label: "Avg. Response Time", display: "1.15s", change: "5%", direction: "down", icon: Clock3, color: "green", isGood: true },
      { label: "Failed Requests", display: "6", change: "60%", direction: "down", icon: TriangleAlert, color: "red", isBad: true },
    ],
    recentOrganizations: [
      { name: "ABC Technologies", plan: "Business Plan", users: 84, status: "Active", time: "2 hours ago", icon: Building2, color: "blue" },
      { name: "XYZ Software", plan: "Pro Plan", users: 26, status: "Active", time: "5 hours ago", icon: Code2, color: "blue" },
    ],
    recentActivities: [
      { time: "10:42 AM", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Changed SMTP config", details: "Updated email settings to AWS SES", color: "blue", status: "Success" },
      { time: "10:31 AM", initial: "R", user: "Rahul Sharma", role: "(Admin)", action: "Invited user", details: "priya@abc.com added to engineering", color: "light-blue", status: "Success" },
      { time: "10:20 AM", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Suspended organization", details: "XYZ Software compliance hold", color: "blue", status: "Warning" },
      { time: "09:55 AM", initial: "A", user: "Amit Verma", role: "(Admin)", action: "Changed plan", details: "Pro → Business annual tier upgrade", color: "sky", status: "Success" },
      { time: "09:32 AM", initial: "P", user: "System", role: "", action: "AI usage limit updated", details: "Increased limit to 50,000 tokens", color: "lavender", status: "Success" },
      { time: "09:10 AM", initial: "N", user: "Neha Sen", role: "(Admin)", action: "Generated Tax Invoice", details: "Invoice #INV-2024-1082 (₹24,999)", color: "pink", status: "Success" },
      { time: "08:45 AM", initial: "P", user: "System", role: "", action: "Health probe check", details: "All 6 services operational with 32ms latency", color: "green", status: "Success" },
    ],
  },
  "Last 7 Days": {
    kpis: {
      organizations: { value: "186", trend: "3.4%", direction: "up", sub: "+ 7 this week" },
      users: { value: "1,248", trend: "2.6%", direction: "up", sub: "+ 31 this week" },
      revenue: { value: "₹2.48L", trend: "4.8%", direction: "up", sub: "+ ₹11,200 this week" },
      subscriptions: { value: "142", trend: "1.8%", direction: "up", sub: "4 trials • 2 expiring" },
    },
    userGrowth: [
      { month: "Mon", users: 1120 }, { month: "Tue", users: 1145 }, { month: "Wed", users: 1180 },
      { month: "Thu", users: 1210 }, { month: "Fri", users: 1225 }, { month: "Sat", users: 1238 },
      { month: "Sun", users: 1248 },
    ],
    revenueGrowth: [
      { month: "Mon", revenue: 1.8 }, { month: "Tue", revenue: 1.95 }, { month: "Wed", revenue: 2.1 },
      { month: "Thu", revenue: 2.2 }, { month: "Fri", revenue: 2.35 }, { month: "Sat", revenue: 2.42 },
      { month: "Sun", revenue: 2.48 },
    ],
    plans: [
      { name: "Free", percent: 40, count: 57, color: "#5b74ff" },
      { name: "Pro", percent: 35, count: 50, color: "#2783ff" },
      { name: "Business", percent: 20, count: 28, color: "#ffb21c" },
      { name: "Enterprise", percent: 5, count: 7, color: "#ff454b" },
    ],
    totalSubscriptions: 142,
    aiMetrics: [
      { label: "Total Requests", display: "21,840", change: "9%", direction: "up", icon: Sparkles, color: "purple" },
      { label: "Tokens Used", display: "2.1M", change: "14%", direction: "up", icon: Hexagon, color: "orange" },
      { label: "Avg. Response Time", display: "1.16s", change: "10%", direction: "down", icon: Clock3, color: "green", isGood: true },
      { label: "Failed Requests", display: "32", change: "28%", direction: "down", icon: TriangleAlert, color: "red", isBad: true },
    ],
    recentOrganizations: [
      { name: "ABC Technologies", plan: "Business Plan", users: 84, status: "Active", time: "2 hours ago", icon: Building2, color: "blue" },
      { name: "XYZ Software", plan: "Pro Plan", users: 26, status: "Active", time: "5 hours ago", icon: Code2, color: "blue" },
      { name: "Startup Labs", plan: "Free Plan", users: 5, status: "Trial", time: "1 day ago", icon: TriangleAlert, color: "orange" },
      { name: "DesignHub", plan: "Pro Plan", users: 18, status: "Active", time: "2 days ago", icon: Palette, color: "dark-blue" },
    ],
    recentActivities: [
      { time: "Today", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Changed SMTP config", details: "Updated email settings to AWS SES", color: "blue", status: "Success" },
      { time: "Yesterday", initial: "R", user: "Rahul Sharma", role: "(Admin)", action: "Invited user", details: "priya@abc.com added to organization", color: "light-blue", status: "Success" },
      { time: "3 days ago", initial: "H", user: "Himanshu", role: "(Super Admin)", action: "Suspended organization", details: "XYZ Software policy compliance review", color: "blue", status: "Warning" },
      { time: "5 days ago", initial: "A", user: "Amit Verma", role: "(Admin)", action: "Changed plan", details: "Pro → Business upgrade confirmed", color: "sky", status: "Success" },
      { time: "6 days ago", initial: "P", user: "System", role: "", action: "AI usage limit updated", details: "Increased limit to 50,000 tokens", color: "lavender", status: "Success" },
      { time: "7 days ago", initial: "K", user: "Karan Johar", role: "(Admin)", action: "Invited 3 developers", details: "Backend team seat allocation", color: "pink", status: "Success" },
    ],
  },
};

const growthByRange = {
  "This Year": [
    { month: "Jan", users: 350 }, { month: "Feb", users: 510 }, { month: "Mar", users: 620 },
    { month: "Apr", users: 700 }, { month: "May", users: 820 }, { month: "Jun", users: 930 },
    { month: "Jul", users: 1050 }, { month: "Aug", users: 1180 }, { month: "Sep", users: 1450 },
    { month: "Oct", users: 1650 },
  ],
  "Last Year": [
    { month: "Jan", users: 220 }, { month: "Feb", users: 300 }, { month: "Mar", users: 390 },
    { month: "Apr", users: 450 }, { month: "May", users: 530 }, { month: "Jun", users: 610 },
    { month: "Jul", users: 720 }, { month: "Aug", users: 800 }, { month: "Sep", users: 890 },
    { month: "Oct", users: 980 },
  ],
  "Last 6 Months": [
    { month: "May", users: 820 }, { month: "Jun", users: 930 }, { month: "Jul", users: 1050 },
    { month: "Aug", users: 1180 }, { month: "Sep", users: 1450 }, { month: "Oct", users: 1650 },
  ],
};

const revenueByRange = {
  "This Year": [
    { month: "Jan", revenue: 0.2 }, { month: "Feb", revenue: 0.6 }, { month: "Mar", revenue: 0.55 },
    { month: "Apr", revenue: 1.15 }, { month: "May", revenue: 1.6 }, { month: "Jun", revenue: 1.3 },
    { month: "Jul", revenue: 1.95 }, { month: "Aug", revenue: 2.48 }, { month: "Sep", revenue: 2.2 },
    { month: "Oct", revenue: 2.95 },
  ],
  "Last Year": [
    { month: "Jan", revenue: 0.1 }, { month: "Feb", revenue: 0.25 }, { month: "Mar", revenue: 0.35 },
    { month: "Apr", revenue: 0.5 }, { month: "May", revenue: 0.75 }, { month: "Jun", revenue: 0.9 },
    { month: "Jul", revenue: 1.1 }, { month: "Aug", revenue: 1.3 }, { month: "Sep", revenue: 1.55 },
    { month: "Oct", revenue: 1.8 },
  ],
  "Last 6 Months": [
    { month: "May", revenue: 1.6 }, { month: "Jun", revenue: 1.3 }, { month: "Jul", revenue: 1.95 },
    { month: "Aug", revenue: 2.48 }, { month: "Sep", revenue: 2.2 }, { month: "Oct", revenue: 2.95 },
  ],
};

const aiMetricsByRange = {
  "This Month": [
    { label: "Total Requests", display: "84,520", change: "18%", direction: "up", icon: Sparkles, color: "purple" },
    { label: "Tokens Used", display: "8.4M", change: "22%", direction: "up", icon: Hexagon, color: "orange" },
    { label: "Avg. Response Time", display: "1.2s", change: "12%", direction: "down", icon: Clock3, color: "green", isGood: true },
    { label: "Failed Requests", display: "124", change: "40%", direction: "down", icon: TriangleAlert, color: "red", isBad: true },
  ],
  "This Week": [
    { label: "Total Requests", display: "21,840", change: "9%", direction: "up", icon: Sparkles, color: "purple" },
    { label: "Tokens Used", display: "2.1M", change: "14%", direction: "up", icon: Hexagon, color: "orange" },
    { label: "Avg. Response Time", display: "1.1s", change: "10%", direction: "down", icon: Clock3, color: "green", isGood: true },
    { label: "Failed Requests", display: "32", change: "28%", direction: "down", icon: TriangleAlert, color: "red", isBad: true },
  ],
};

const systemHealthServices = [
  { name: "API Server", status: "Operational", detail: "99.99% uptime" },
  { name: "Database", status: "Operational", detail: "32ms latency" },
  { name: "Authentication", status: "Operational", detail: "99.98% uptime" },
  { name: "SMTP", status: "Operational", detail: "99.8% success" },
  { name: "AI Service", status: "Operational", detail: "1.2s response" },
  { name: "File Storage", status: "Operational", detail: "42% used" },
];

/* =========================================================================
   Live User Growth Bar Chart (SVG with hover tooltip & responsive viewbox)
   ========================================================================= */
function LiveUserGrowthChart({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const width = 480;
  const height = 155;
  const margin = { left: 35, right: 12, top: 15, bottom: 25 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const maxVal = Math.max(...data.map((d) => d.users || 0), 1000);
  const yMax = Math.ceil(maxVal / 500) * 500;
  const yTicks = [0, yMax / 3, (yMax / 3) * 2, yMax].map((n) => Math.round(n));

  return (
    <div className="sa-chart-container">
      <svg
        className="sa-svg-chart"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {/* Horizontal grid lines */}
        {yTicks.map((tick) => {
          const y = margin.top + plotHeight - (tick / yMax) * plotHeight;
          return (
            <g key={tick}>
              <line
                x1={margin.left}
                y1={y}
                x2={width - margin.right}
                y2={y}
                stroke="#eef2f8"
                strokeDasharray="3 3"
              />
              <text
                x={margin.left - 6}
                y={y + 3.5}
                textAnchor="end"
                className="sa-axis-label"
              >
                {tick >= 1000 ? `${(tick / 1000).toFixed(tick % 1000 === 0 ? 0 : 1)}K` : tick}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const step = plotWidth / data.length;
          const barWidth = Math.min(22, step * 0.58);
          const barHeight = Math.max(4, Math.min(plotHeight, (item.users / yMax) * plotHeight));
          const x = margin.left + index * step + (step - barWidth) / 2;
          const y = margin.top + plotHeight - barHeight;
          const isHovered = hoveredIndex === index;

          return (
            <g
              key={item.month}
              className="sa-chart-bar-group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="3.5"
                fill={isHovered ? "#3b66ff" : "#5b74ff"}
                className="sa-bar-rect"
              />
              <text
                x={x + barWidth / 2}
                y={height - 7}
                textAnchor="middle"
                className={`sa-axis-label ${isHovered ? "is-active" : ""}`}
              >
                {item.month}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredIndex !== null && data[hoveredIndex] && (
        <div
          className="sa-chart-tooltip"
          style={{
            left: `${
              ((margin.left +
                hoveredIndex * (plotWidth / data.length) +
                plotWidth / data.length / 2) /
                width) *
              100
            }%`,
            top: "10px",
          }}
        >
          <strong>{data[hoveredIndex].users.toLocaleString()}</strong> users
          <small>{data[hoveredIndex].month}</small>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   Live Revenue Growth Curve Chart (SVG Area with gradient & points)
   ========================================================================= */
function LiveRevenueGrowthChart({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const width = 480;
  const height = 155;
  const margin = { left: 35, right: 12, top: 15, bottom: 25 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const maxVal = Math.max(...data.map((d) => d.revenue || 0), 2.5);
  const yMax = Math.ceil(maxVal);
  const yTicks = [0, yMax / 3, (yMax / 3) * 2, yMax].map((n) => Math.round(n * 10) / 10);

  const points = data.map((item, index) => {
    const x =
      margin.left +
      (data.length === 1 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth);
    const y = margin.top + plotHeight - (item.revenue / yMax) * plotHeight;
    return { ...item, x, y };
  });

  // Smooth SVG curve path builder
  const createSmoothPath = (pts) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[0];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i !== pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = createSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    margin.top + plotHeight
  } L ${points[0].x} ${margin.top + plotHeight} Z`;

  return (
    <div className="sa-chart-container">
      <svg
        className="sa-svg-chart"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map((tick) => {
          const y = margin.top + plotHeight - (tick / yMax) * plotHeight;
          return (
            <g key={tick}>
              <line
                x1={margin.left}
                y1={y}
                x2={width - margin.right}
                y2={y}
                stroke="#eef2f8"
                strokeDasharray="3 3"
              />
              <text
                x={margin.left - 6}
                y={y + 3.5}
                textAnchor="end"
                className="sa-axis-label"
              >
                {tick === 0 ? "0" : `${tick}L`}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#revenueGradient)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((pt, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <g
              key={pt.month}
              className="sa-chart-point-group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 5.5 : 3.5}
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth={isHovered ? 3 : 2.5}
                className="sa-point-circle"
              />
              <circle cx={pt.x} cy={pt.y} r={12} fill="transparent" />
              <text
                x={pt.x}
                y={height - 7}
                textAnchor="middle"
                className={`sa-axis-label ${isHovered ? "is-active" : ""}`}
              >
                {pt.month}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredIndex !== null && points[hoveredIndex] && (
        <div
          className="sa-chart-tooltip"
          style={{
            left: `${(points[hoveredIndex].x / width) * 100}%`,
            top: "10px",
          }}
        >
          <strong>₹{points[hoveredIndex].revenue}L</strong> revenue
          <small>{points[hoveredIndex].month}</small>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   Live Plan Distribution Donut Chart
   ========================================================================= */
function LivePlanDistribution({ plans, totalCount = 142 }) {
  const [activePlan, setActivePlan] = useState(null);

  const radius = 46;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;
  const segments = plans.map((plan) => {
    const dashLength = (plan.percent / 100) * circumference;
    const item = {
      ...plan,
      dashLength,
      offset: cumulativeOffset,
    };
    cumulativeOffset += dashLength;
    return item;
  });

  const highlightedPlan = activePlan
    ? plans.find((p) => p.name === activePlan)
    : null;

  return (
    <div className="sa-donut-wrap">
      <div className="sa-donut-chart-box">
        <svg viewBox="0 0 120 120" className="sa-donut-svg">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#edf1f8"
            strokeWidth={strokeWidth}
          />
          {segments.map((seg) => (
            <circle
              key={seg.name}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={activePlan === seg.name ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
              strokeDashoffset={-seg.offset}
              transform="rotate(-90 60 60)"
              className="sa-donut-segment"
              onMouseEnter={() => setActivePlan(seg.name)}
              onMouseLeave={() => setActivePlan(null)}
            />
          ))}
        </svg>

        <div className="sa-donut-center-text">
          <span className="sa-donut-center-val">
            {highlightedPlan ? `${highlightedPlan.percent}%` : totalCount}
          </span>
          <span className="sa-donut-center-label">
            {highlightedPlan ? highlightedPlan.name : "Total"}
          </span>
        </div>
      </div>

      <div className="sa-donut-legend">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`sa-donut-legend-item ${
              activePlan === plan.name ? "is-active" : ""
            }`}
            onMouseEnter={() => setActivePlan(plan.name)}
            onMouseLeave={() => setActivePlan(null)}
          >
            <span
              className="sa-donut-legend-dot"
              style={{ backgroundColor: plan.color }}
            />
            <span className="sa-donut-legend-name">{plan.name}</span>
            <span className="sa-donut-legend-pct">{plan.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN SUPER ADMIN DASHBOARD COMPONENT
   ========================================================================= */
function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState("Oct 1, 2024 - Oct 31, 2024");
  const [userGrowthFilter, setUserGrowthFilter] = useState("This Year");
  const [revenueFilter, setRevenueFilter] = useState("This Year");
  const [aiUsageFilter, setAiUsageFilter] = useState("This Month");
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [customStart, setCustomStart] = useState("2024-10-01");
  const [customEnd, setCustomEnd] = useState("2024-10-31");
  const [toast, setToast] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activitySearch, setActivitySearch] = useState("");
  const [activityRowsPerPage, setActivityRowsPerPage] = useState(5);
  const [activityPage, setActivityPage] = useState(1);
  const dateDropdownRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Live telemetry and system KPIs refreshed.");
    }, 600);
  };

  // Close date menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setDateMenuOpen(false);
      }
    }
    if (dateMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dateMenuOpen]);

  // Compute live data based on active date range
  const currentData = useMemo(() => {
    if (DASHBOARD_DATA_BY_RANGE[dateFilter]) {
      return DASHBOARD_DATA_BY_RANGE[dateFilter];
    }
    // Fallback dynamic computation for custom date range
    return {
      kpis: {
        organizations: { value: "190", trend: "11.2%", direction: "up", sub: "+ 22 selected period" },
        users: { value: "1,290", trend: "9.1%", direction: "up", sub: "+ 104 selected period" },
        revenue: { value: "₹2.62L", trend: "17.4%", direction: "up", sub: "+ ₹38,200 selected period" },
        subscriptions: { value: "148", trend: "6.0%", direction: "up", sub: "23 trials • 8 expiring" },
      },
      userGrowth: [
        { month: "P1", users: 1150 },
        { month: "P2", users: 1280 },
        { month: "P3", users: 1420 },
        { month: "P4", users: 1650 },
      ],
      revenueGrowth: [
        { month: "P1", revenue: 2.1 },
        { month: "P2", revenue: 2.35 },
        { month: "P3", revenue: 2.5 },
        { month: "P4", revenue: 2.95 },
      ],
      plans: [
        { name: "Free", percent: 39, count: 58, color: "#5b74ff" },
        { name: "Pro", percent: 36, count: 53, color: "#2783ff" },
        { name: "Business", percent: 20, count: 30, color: "#ffb21c" },
        { name: "Enterprise", percent: 5, count: 7, color: "#ff454b" },
      ],
      totalSubscriptions: 148,
      aiMetrics: [
        { label: "Total Requests", display: "86,400", change: "17%", direction: "up", icon: Sparkles, color: "purple" },
        { label: "Tokens Used", display: "8.6M", change: "20%", direction: "up", icon: Hexagon, color: "orange" },
        { label: "Avg. Response Time", display: "1.19s", change: "11%", direction: "down", icon: Clock3, color: "green", isGood: true },
        { label: "Failed Requests", display: "118", change: "38%", direction: "down", icon: TriangleAlert, color: "red", isBad: true },
      ],
      recentOrganizations: DASHBOARD_DATA_BY_RANGE["Oct 1, 2024 - Oct 31, 2024"].recentOrganizations,
      recentActivities: DASHBOARD_DATA_BY_RANGE["Oct 1, 2024 - Oct 31, 2024"].recentActivities,
    };
  }, [dateFilter]);

  const growthData = useMemo(() => {
    if (userGrowthFilter && userGrowthFilter !== "Default" && growthByRange[userGrowthFilter]) {
      return growthByRange[userGrowthFilter];
    }
    return currentData.userGrowth;
  }, [userGrowthFilter, currentData]);

  const revenueData = useMemo(() => {
    if (revenueFilter && revenueFilter !== "Default" && revenueByRange[revenueFilter]) {
      return revenueByRange[revenueFilter];
    }
    return currentData.revenueGrowth;
  }, [revenueFilter, currentData]);

  const aiMetrics = useMemo(() => {
    if (aiUsageFilter === "This Week") {
      return aiMetricsByRange["This Week"];
    }
    return currentData.aiMetrics;
  }, [aiUsageFilter, currentData]);

  const handleApplyCustomDate = () => {
    if (!customStart || !customEnd) return;
    const label = `${customStart} - ${customEnd}`;
    setDateFilter(label);
    setDateMenuOpen(false);
    showToast(`Custom date range applied: ${label}`);
  };

  const handleExportSummary = () => {
    const kpis = currentData.kpis;
    const csvContent = [
      ["Executive Metric", "Current Value", "Growth Trend", "Period Comparison"],
      ["Active Organizations", kpis.organizations.value, kpis.organizations.trend, kpis.organizations.sub],
      ["Total Active Users", kpis.users.value, kpis.users.trend, kpis.users.sub],
      ["Monthly Recurring Revenue", kpis.revenue.value, kpis.revenue.trend, kpis.revenue.sub],
      ["Active Subscriptions", kpis.subscriptions.value, kpis.subscriptions.trend, kpis.subscriptions.sub],
      [],
      ["Subscription Plan Tier", "Percentage", "Active Accounts"],
      ...currentData.plans.map((p) => [p.name, `${p.percent}%`, p.count]),
      [],
      ["Activity Timestamp", "User Identity", "Role", "Operational Action", "Event Details", "Audit Status"],
      ...currentData.recentActivities.map((a) => [
        a.time,
        a.user,
        a.role || "System",
        a.action,
        a.details,
        a.status || "Success",
      ]),
    ]
      .map((row) => row.map((v) => `"${String(v || "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `teamflow-dashboard-summary-${dateFilter.toLowerCase().replace(/[^a-z0-9]/g, "-")}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Dashboard executive summary exported successfully.");
  };

  // Filtered & Paged Activities
  const filteredActivities = useMemo(() => {
    const list = currentData.recentActivities || [];
    if (!activitySearch.trim()) return list;
    const q = activitySearch.toLowerCase();
    return list.filter(
      (a) =>
        a.user.toLowerCase().includes(q) ||
        a.action.toLowerCase().includes(q) ||
        a.details.toLowerCase().includes(q)
    );
  }, [currentData, activitySearch]);

  const totalActivityPages = Math.max(1, Math.ceil(filteredActivities.length / activityRowsPerPage));
  const currentActivityPage = Math.min(activityPage, totalActivityPages);
  const pagedActivities = filteredActivities.slice(
    (currentActivityPage - 1) * activityRowsPerPage,
    currentActivityPage * activityRowsPerPage
  );

  return (
    <div className="sa-page-container sa-dashboard-root">
      {/* 1. Header Row */}
      <section className="sa-page-header sap-header-panel">
        <div className="sa-page-header-left">
          <h1>
            Welcome back, Himanshu <span className="sa-wave-emoji">👋</span>
          </h1>
          <p>Here's what's happening with TeamFlow AI today.</p>
        </div>

        <div className="sa-page-header-actions" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Refresh live telemetry button */}
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={handleRefresh}
            title="Refresh live dashboard metrics"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <RefreshCw size={14} className={isRefreshing ? "sa-spin" : ""} />
            <span>Refresh</span>
          </button>

          {/* Export Executive Summary CSV */}
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={handleExportSummary}
            title="Export dashboard metrics & activity report as CSV"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Download size={14} />
            <span>Export Report</span>
          </button>

          {/* Date Selector */}
          <div className="sa-date-selector-wrapper" ref={dateDropdownRef}>
            <button
              type="button"
              className="sa-date-btn"
              onClick={() => setDateMenuOpen((prev) => !prev)}
            >
              <CalendarDays size={16} className="sa-calendar-icon" />
              <span>{dateFilter}</span>
              <ChevronDown size={14} />
            </button>

            {dateMenuOpen && (
              <div className="sa-date-dropdown">
                {[
                  "Oct 1, 2024 - Oct 31, 2024",
                  "Today",
                  "Last 7 Days",
                  "Last 30 Days",
                  "This Quarter",
                  "This Year",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`sa-date-option ${
                      dateFilter === item ? "is-selected" : ""
                    }`}
                    onClick={() => {
                      setDateFilter(item);
                      setDateMenuOpen(false);
                      showToast(`Date range set to ${item}`);
                    }}
                  >
                    {item}
                  </button>
                ))}

                {/* Custom Date Range Picker */}
                <div className="sa-date-custom-box">
                  <div className="sa-date-custom-title">Custom Range</div>
                  <div className="sa-date-inputs-row">
                    <input
                      type="date"
                      className="sa-date-input"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                    />
                    <input
                      type="date"
                      className="sa-date-input"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="sa-date-apply-btn"
                    onClick={handleApplyCustomDate}
                  >
                    Apply Range
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Top 4 KPI Stat Cards (Live with selected Date Range) */}
      <section className="sa-kpi-grid">
        {/* Organizations */}
        <article
          className="sa-kpi-card is-clickable"
          role="button"
          tabIndex={0}
          title="Click to view all Organizations"
          onClick={() => navigate("/superadmin/organizations")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/superadmin/organizations")}
        >
          <div className="sa-kpi-icon-box blue">
            <Users size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Organizations</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{currentData.kpis.organizations.value}</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> {currentData.kpis.organizations.trend}
              </span>
            </div>
            <span className="sa-kpi-subtitle">{currentData.kpis.organizations.sub}</span>
          </div>
        </article>

        {/* Total Users */}
        <article
          className="sa-kpi-card is-clickable"
          role="button"
          tabIndex={0}
          title="Click to view all Platform Users"
          onClick={() => navigate("/superadmin/users")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/superadmin/users")}
        >
          <div className="sa-kpi-icon-box sky">
            <User size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Total Users</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{currentData.kpis.users.value}</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> {currentData.kpis.users.trend}
              </span>
            </div>
            <span className="sa-kpi-subtitle">{currentData.kpis.users.sub}</span>
          </div>
        </article>

        {/* Monthly Revenue */}
        <article
          className="sa-kpi-card is-clickable"
          role="button"
          tabIndex={0}
          title="Click to view Billing & Payments"
          onClick={() => navigate("/superadmin/billing")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/superadmin/billing")}
        >
          <div className="sa-kpi-icon-box green">
            <span className="sa-kpi-currency-symbol">₹</span>
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Monthly Revenue</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{currentData.kpis.revenue.value}</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> {currentData.kpis.revenue.trend}
              </span>
            </div>
            <span className="sa-kpi-subtitle">{currentData.kpis.revenue.sub}</span>
          </div>
        </article>

        {/* Active Subscriptions */}
        <article
          className="sa-kpi-card is-clickable"
          role="button"
          tabIndex={0}
          title="Click to view Subscriptions Matrix"
          onClick={() => navigate("/superadmin/subscriptions")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/superadmin/subscriptions")}
        >
          <div className="sa-kpi-icon-box amber">
            <Crown size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Active Subscriptions</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{currentData.kpis.subscriptions.value}</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> {currentData.kpis.subscriptions.trend}
              </span>
            </div>
            <span className="sa-kpi-subtitle">{currentData.kpis.subscriptions.sub}</span>
          </div>
        </article>
      </section>

      {/* 3. Middle Row: 3 Live Charts */}
      <section className="sa-charts-row">
        {/* User Growth */}
        <article className="sa-card sa-chart-card">
          <div className="sa-card-header">
            <h3>User Growth</h3>
            <div className="sa-select-filter">
              <select
                value={userGrowthFilter}
                onChange={(e) => setUserGrowthFilter(e.target.value)}
              >
                <option value="This Year">This Year</option>
                <option value="Last Year">Last Year</option>
                <option value="Last 6 Months">Last 6 Months</option>
              </select>
              <ChevronDown size={13} className="sa-chevron" />
            </div>
          </div>
          <LiveUserGrowthChart data={growthData} />
        </article>

        {/* Revenue Growth */}
        <article className="sa-card sa-chart-card">
          <div className="sa-card-header">
            <h3>Revenue Growth</h3>
            <div className="sa-select-filter">
              <select
                value={revenueFilter}
                onChange={(e) => setRevenueFilter(e.target.value)}
              >
                <option value="This Year">This Year</option>
                <option value="Last Year">Last Year</option>
                <option value="Last 6 Months">Last 6 Months</option>
              </select>
              <ChevronDown size={13} className="sa-chevron" />
            </div>
          </div>
          <LiveRevenueGrowthChart data={revenueData} />
        </article>

        {/* Plan Distribution (Live Donut with Center Count) */}
        <article className="sa-card sa-chart-card sa-plan-dist-card">
          <div className="sa-card-header">
            <h3>Plan Distribution</h3>
          </div>
          <LivePlanDistribution
            plans={currentData.plans}
            totalCount={currentData.totalSubscriptions}
          />
        </article>
      </section>

      {/* 4. Three Cards Row: Recent Orgs, AI Usage, System Health */}
      <section className="sa-middle-grid">
        {/* Recent Organizations */}
        <article className="sa-card sa-panel-card">
          <div className="sa-card-header">
            <h3>Recent Organizations</h3>
            <button
              type="button"
              className="sa-card-link"
              onClick={() => navigate("/superadmin/organizations")}
            >
              View all <ArrowRight size={13} />
            </button>
          </div>

          <div className="sa-recent-orgs-list">
            {currentData.recentOrganizations.map((org) => {
              const Icon = org.icon;
              return (
                <div
                  key={org.name}
                  className="sa-recent-org-item"
                  style={{ cursor: "pointer" }}
                  title={`View ${org.name} in Organizations`}
                  onClick={() => navigate("/superadmin/organizations")}
                >
                  <div className={`sa-org-avatar-icon ${org.color}`}>
                    <Icon size={18} strokeWidth={2.1} />
                  </div>
                  <div className="sa-org-info">
                    <strong>{org.name}</strong>
                    <span>
                      {org.plan} • {org.users} users
                    </span>
                  </div>
                  <span
                    className={`sa-pill ${
                      org.status === "Trial" ? "sa-pill-trial" : "sa-pill-active"
                    }`}
                  >
                    {org.status}
                  </span>
                  <span className="sa-org-time">{org.time}</span>
                </div>
              );
            })}
          </div>
        </article>

        {/* AI Usage */}
        <article className="sa-card sa-panel-card">
          <div className="sa-card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h3>AI Usage</h3>
              <button
                type="button"
                className="sa-card-link"
                style={{ fontSize: 11.5 }}
                onClick={() => navigate("/superadmin/ai-usage")}
              >
                Telemetry <ArrowRight size={11} />
              </button>
            </div>
            <div className="sa-select-filter">
              <select
                value={aiUsageFilter}
                onChange={(e) => setAiUsageFilter(e.target.value)}
              >
                <option value="This Month">This Month</option>
                <option value="This Week">This Week</option>
              </select>
              <ChevronDown size={13} className="sa-chevron" />
            </div>
          </div>

          <div className="sa-ai-metrics-list">
            {aiMetrics.map((item) => {
              const Icon = item.icon;
              const DirectionIcon =
                item.direction === "up" ? ArrowUpRight : ArrowDownRight;

              return (
                <div key={item.label} className="sa-ai-metric-item">
                  <div className={`sa-ai-icon-box ${item.color}`}>
                    <Icon size={18} strokeWidth={2.2} />
                  </div>
                  <span className="sa-ai-label">{item.label}</span>
                  <span className="sa-ai-value">{item.display}</span>
                  <span
                    className={`sa-ai-trend ${
                      item.isBad ? "negative" : "positive"
                    }`}
                  >
                    <DirectionIcon size={13} /> {item.change}
                  </span>
                </div>
              );
            })}
          </div>
        </article>

        {/* System Health */}
        <article className="sa-card sa-panel-card">
          <div className="sa-card-header">
            <h3>System Health</h3>
            <button
              type="button"
              className="sa-card-link"
              onClick={() => navigate("/superadmin/system-health")}
            >
              View details <ArrowRight size={13} />
            </button>
          </div>

          <div className="sa-system-health-list">
            {systemHealthServices.map((service) => (
              <div key={service.name} className="sa-health-item">
                <span className="sa-health-name">{service.name}</span>
                <span className="sa-health-status">
                  <span className="sa-health-dot" />
                  {service.status}
                </span>
                <span className="sa-health-detail">{service.detail}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* 5. Bottom Table: Recent Activity Audit Stream */}
      <section className="sap-table-card sa-activity-card">
        <div className="sa-card-header" style={{ padding: "16px 20px", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16 }}>Recent Activity Audit Stream</h3>
            <span style={{ fontSize: 12, color: "var(--sa-text-muted, #64748b)" }}>
              Real-time audit log of platform operations and administrative actions
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {/* Live Search Input */}
            <div className="sa-activity-search-wrap">
              <Search size={14} className="sa-activity-search-icon" />
              <input
                type="text"
                placeholder="Search audit activities..."
                value={activitySearch}
                onChange={(e) => {
                  setActivitySearch(e.target.value);
                  setActivityPage(1);
                }}
                className="sa-activity-search-input"
              />
            </div>

            {/* Rows Per Page Dropdown */}
            <div className="sa-select-filter">
              <select
                value={activityRowsPerPage}
                onChange={(e) => {
                  setActivityRowsPerPage(Number(e.target.value));
                  setActivityPage(1);
                }}
                title="Select number of visible rows"
              >
                <option value={5}>5 rows</option>
                <option value={10}>10 rows</option>
                <option value={15}>15 rows</option>
              </select>
              <ChevronDown size={13} className="sa-chevron" />
            </div>

            <button
              type="button"
              className="sa-card-link"
              onClick={() => navigate("/superadmin/activity-logs")}
            >
              View all logs <ArrowRight size={13} />
            </button>
          </div>
        </div>

        <div className="sa-table-wrapper" style={{ overflowX: "auto" }}>
          <table className="sap-grid sa-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ width: "14%" }}>Time</th>
                <th style={{ width: "24%" }}>User</th>
                <th style={{ width: "26%" }}>Action</th>
                <th style={{ width: "24%" }}>Details</th>
                <th style={{ width: "12%", textAlign: "center" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {pagedActivities.length > 0 ? (
                pagedActivities.map((act, index) => (
                  <tr key={`${act.time}-${act.user}-${index}`}>
                    <td className="sa-time-cell">{act.time}</td>
                    <td>
                      <div className="sa-user-badge">
                        <span className={`sa-avatar-circle ${act.color}`}>
                          {act.initial}
                        </span>
                        <span>
                          <strong>{act.user}</strong>{" "}
                          <span className="sa-role-text">{act.role}</span>
                        </span>
                      </div>
                    </td>
                    <td className="sa-action-cell">{act.action}</td>
                    <td className="sa-details-cell">{act.details}</td>
                    <td style={{ textAlign: "center" }}>
                      <span className={`sa-pill ${act.status === "Warning" ? "sa-pill-trial" : "sa-pill-success"}`}>
                        {act.status || "Success"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "32px 16px", color: "var(--sa-text-muted, #64748b)" }}>
                    No activity logs found matching "{activitySearch}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Unified Pagination & Count Footer Bar */}
        <div className="sap-footer-bar">
          <div className="sap-footer-counts">
            Showing{" "}
            <strong>
              {filteredActivities.length === 0
                ? 0
                : (currentActivityPage - 1) * activityRowsPerPage + 1}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(currentActivityPage * activityRowsPerPage, filteredActivities.length)}
            </strong>{" "}
            of <strong>{filteredActivities.length}</strong> activities
          </div>

          <div className="sap-pagination">
            <button
              type="button"
              className="sap-page-btn"
              disabled={currentActivityPage <= 1}
              onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
              title="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: 12, padding: "0 6px", fontWeight: 600 }}>
              Page {currentActivityPage} of {totalActivityPages}
            </span>
            <button
              type="button"
              className="sap-page-btn"
              disabled={currentActivityPage >= totalActivityPages}
              onClick={() => setActivityPage((p) => Math.min(totalActivityPages, p + 1))}
              title="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Floating Action Toast */}
      {toast && (
        <div className="sa-toast-popup">
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default SuperAdminDashboard;
