// src/app/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";       
import Workspace from "../pages/Workspace"; 

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Workspace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;