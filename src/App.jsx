import "./App.css";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./component/LandingPage/LandingPage.jsx";
import Login from "./component/Login/login.jsx";
import Signup from "./component/Signup/Signup.jsx";
import CreateWorkspace from "./component/Dashboard/CreateWorkspace.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<CreateWorkspace />} />
      <Route
        path="/create-workspace"
        element={<CreateWorkspace />}
      />
    </Routes>
  );
}

export default App;