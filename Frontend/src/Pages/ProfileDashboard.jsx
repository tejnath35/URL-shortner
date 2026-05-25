import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";
import "../App.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function ProfileDashboard() {
  const [urlCount, setUrlCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Profile editing state
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name || "");
  const [editPhoto, setEditPhoto] = useState(user.profilePhoto || "");
  const [updateMsg, setUpdateMsg] = useState({ type: "", text: "" });
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUrls();
  }, [navigate, token]);

  const fetchUrls = async () => {
    try {
      const response = await fetch(`${API_BASE}/urls`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setUrlCount(data.length);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMsg({ type: "", text: "" });

    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, profilePhoto: editPhoto }),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Server error: Payload might be too large or server crashed.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update local storage and state
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setIsEditing(false);
      setUpdateMsg({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setUpdateMsg({ type: "", text: "" }), 3000);
    } catch (error) {
      setUpdateMsg({ type: "error", text: error.message });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="app-shell">
        <div className="hero-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1 className="text-blue-500">Overview</h1>
          </div>
          {!isEditing && (
            <button 
              onClick={() => {
                setEditName(user.name || "");
                setEditPhoto(user.profilePhoto || "");
                setIsEditing(true);
              }}
              className="copy-button"
            >
              Edit Profile
            </button>
          )}
        </div>

        {updateMsg.text && (
          <div className={`message p-4 rounded-md text-sm font-medium mb-6 ${updateMsg.type === "error" ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`} style={{ padding: "12px", borderRadius: "8px", border: "1px solid" }}>
            {updateMsg.text}
          </div>
        )}

        {isEditing ? (
          <div className="profile-card" style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <h2 style={{ margin: "0 0 16px" }}>Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="url-form" style={{ padding: 0, border: "none", boxShadow: "none", margin: 0, width: "100%" }}>
                <label htmlFor="editName">Name</label>
                <input 
                  id="editName" 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  placeholder="Your Name" 
                  style={{ width: "100%" }}
                />
              </div>
              <div className="url-form" style={{ padding: 0, border: "none", boxShadow: "none", margin: 0, width: "100%" }}>
                <label htmlFor="editPhoto">Profile Photo URL (Optional)</label>
                <input 
                  id="editPhoto" 
                  type="url" 
                  value={editPhoto} 
                  onChange={(e) => setEditPhoto(e.target.value)} 
                  placeholder="https://example.com/photo.jpg" 
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" disabled={updating} style={{ padding: "10px 20px", background: "var(--accent)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
                  {updating ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} disabled={updating} style={{ padding: "10px 20px", background: "transparent", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="profile-card">
            <div className="profile-avatar" style={{ overflow: "hidden" }}>
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : "U")
              )}
            </div>
            <div className="profile-info">
              <h2>{user.name || "Anonymous User"}</h2>
              <p>{user.email || "user@example.com"}</p>
            </div>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="stat-card">
            <span className="stat-title">Total Links Shortened</span>
            {loading ? (
              <span className="status">Loading...</span>
            ) : (
              <h3 className="stat-value">{urlCount}</h3>
            )}
          </div>
          
          <div className="stat-card">
            <span className="stat-title">Account Status</span>
            <h3 className="stat-value" style={{ color: '#10b981' }}>Active</h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileDashboard;
