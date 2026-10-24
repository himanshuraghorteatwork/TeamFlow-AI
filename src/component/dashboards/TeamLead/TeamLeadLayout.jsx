import { Outlet } from "react-router-dom";
import TeamLeadSidebar from "./TeamLeadSidebar.jsx";
import "./TeamLeadLayout.css";

export default function TeamLeadLayout() {
  return (
    <div className="teamlead-layout">
      <TeamLeadSidebar />

      <main className="teamlead-layout-content">
        <Outlet />
      </main>
    </div>
  );
}