import { Link, useNavigate, useLocation } from "react-router-dom";
import "../App.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">URL.ly</Link>
        </div>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/urls" 
            className={`nav-link ${location.pathname === "/urls" ? "active" : ""}`}
          >
            Manage Links
          </Link>
          <button onClick={handleLogout} className="nav-logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
