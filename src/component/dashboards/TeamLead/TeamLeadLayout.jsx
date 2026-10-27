import { Outlet } from "react-router-dom";
import TeamLeadSidebar from "./TeamLeadSidebar.jsx";
import TeamLeadTopbar from "./TeamLeadTopbar.jsx";
import "./TeamLeadLayout.css";
import "./TeamLeadDarkMode.css";

export default function TeamLeadLayout() {
  return (
    <div className="teamlead-layout">
      <TeamLeadSidebar />

      <div className="teamlead-main-wrapper">
        <TeamLeadTopbar />
        <main className="teamlead-layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
