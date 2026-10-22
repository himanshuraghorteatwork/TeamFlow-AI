
import "./App.css";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./component/LandingPage/LandingPage.jsx";
import Login from "./component/Login/login.jsx";
import Signup from "./component/Signup/Signup.jsx";
import Chat from "./component/Chat/Chat.jsx";
import Tasks from "./component/Tasks/Tasks.jsx";
import Calendar from "./component/Calendar/Calendar.jsx";
import Team from "./component/Team/Team.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/chat" element={<Chat />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/team" element={<Team />} />
    </Routes>
  );
}

export default App;
