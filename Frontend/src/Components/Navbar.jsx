import { Link, useNavigate, useLocation } from "react-router-dom";
import "../App.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar" style={{ borderBottom: '1px solid var(--border)', background: 'white' }}>
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--accent)' }}>
            🔗 URL.ly
          </Link>
        </div>
        <div className="nav-links">
          {token ? (
            <>
              <Link 
                to="/profile" 
                className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/urls" 
                className={`nav-link ${location.pathname === "/urls" ? "active" : ""}`}
              >
                Manage Links
              </Link>
              <button onClick={handleLogout} className="nav-logout-btn" style={{ marginLeft: '12px' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" style={{ fontWeight: '500' }}>
                Login
              </Link>
              <Link to="/register" className="nav-logout-btn" style={{ background: 'var(--accent)', color: 'white', border: 'none' }}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
