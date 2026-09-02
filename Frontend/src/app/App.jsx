import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Workspace from "../pages/Workspace.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Dashboard />} />

      <Route path="/workspace" element={<Workspace />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
