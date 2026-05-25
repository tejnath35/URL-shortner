import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard.jsx";
import ProfileDashboard from "./Pages/ProfileDashboard.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProfileDashboard />} />
        <Route path="/urls" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
