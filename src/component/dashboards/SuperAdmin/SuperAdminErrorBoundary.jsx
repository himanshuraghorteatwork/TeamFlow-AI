import React from "react";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";

class SuperAdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("SuperAdmin Error Boundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 32,
            maxWidth: 800,
            margin: "40px auto",
            background: "var(--sa-surface, #ffffff)",
            border: "1px solid var(--sa-border, #e2e8f0)",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#fee2e2",
              color: "#ef4444",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <AlertTriangle size={28} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: "var(--sa-text-main, #0f172a)" }}>
            Something went wrong in this section
          </h2>
          <p style={{ fontSize: 13, color: "var(--sa-text-muted, #64748b)", margin: "0 0 20px" }}>
            An unexpected error occurred while rendering this view. Your data is safe and your session is active.
          </p>

          {this.state.error && (
            <div
              style={{
                background: "var(--sa-bg, #f8fafc)",
                border: "1px solid var(--sa-border, #e2e8f0)",
                borderRadius: 8,
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 12,
                fontFamily: "monospace",
                color: "#dc2626",
                marginBottom: 24,
                overflowX: "auto",
              }}
            >
              <strong>Error:</strong> {this.state.error?.message || String(this.state.error)}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              type="button"
              className="sa-btn sa-btn-primary"
              onClick={this.handleReset}
            >
              <RefreshCw size={14} /> Retry View
            </button>
            <button
              type="button"
              className="sa-btn sa-btn-secondary"
              onClick={() => {
                this.handleReset();
                if (window.location.pathname !== "/superadmin/dashboard") {
                  window.location.href = "/superadmin/dashboard";
                }
              }}
            >
              <LayoutDashboard size={14} /> Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SuperAdminErrorBoundary;

