import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";
import "../App.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function ProfileDashboard() {
  const [urlCount, setUrlCount] = useState(0);
  const [urls, setUrls] = useState([]);
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
        setUrls(data);
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/40 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <p className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-2">Dashboard</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Welcome back, <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">{user.name ? user.name.split(' ')[0] : 'User'}</span>
            </h1>
          </div>
          {!isEditing && (
            <button 
              onClick={() => {
                setEditName(user.name || "");
                setEditPhoto(user.profilePhoto || "");
                setIsEditing(true);
              }}
              className="px-6 py-2.5 bg-white text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-full font-medium transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Edit Profile
            </button>
          )}
        </div>

        {updateMsg.text && (
          <div className={`p-4 rounded-xl text-sm font-medium mb-8 shadow-sm ${updateMsg.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}`}>
            <div className="flex items-center gap-2">
              {updateMsg.type === "error" ? "⚠️" : "✅"} {updateMsg.text}
            </div>
          </div>
        )}

        {isEditing ? (
          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-xl mb-12 transition-all">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label htmlFor="editName" className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                <input 
                  id="editName" 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  placeholder="Your Name" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="editPhoto" className="block text-sm font-semibold text-slate-700 mb-2">Profile Photo URL (Optional)</label>
                <input 
                  id="editPhoto" 
                  type="url" 
                  value={editPhoto} 
                  onChange={(e) => setEditPhoto(e.target.value)} 
                  placeholder="https://example.com/photo.jpg" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="submit" disabled={updating} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-70">
                  {updating ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} disabled={updating} className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-lg shadow-slate-200/40 mb-12 flex flex-col sm:flex-row items-center sm:items-start gap-8 transition-transform duration-300 hover:shadow-xl hover:shadow-blue-900/5 group">
            <div className="w-28 h-28 shrink-0 rounded-full bg-linear-to-tr from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center text-4xl font-bold shadow-inner ring-4 ring-white group-hover:scale-105 transition-transform duration-300 overflow-hidden">
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : "U")
              )}
            </div>
            <div className="text-center sm:text-left mt-2 sm:mt-4">
              <h2 className="text-3xl font-extrabold text-slate-800 mb-2">{user.name || "Anonymous User"}</h2>
              <p className="text-slate-500 font-medium text-lg bg-slate-100/80 inline-block px-4 py-1.5 rounded-full">{user.email || "user@example.com"}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 text-2xl shadow-inner">🔗</div>
              <span className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Links Shortened</span>
              {loading ? (
                <div className="h-10 w-16 bg-slate-100 animate-pulse rounded"></div>
              ) : (
                <h3 className="text-5xl font-black text-slate-800">{urlCount}</h3>
              )}
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-purple-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 text-2xl shadow-inner">📱</div>
              <span className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">QR Codes</span>
              {loading ? (
                <div className="h-10 w-16 bg-slate-100 animate-pulse rounded"></div>
              ) : (
                <h3 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-br from-purple-600 to-pink-500">{urlCount}</h3>
              )}
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 text-2xl shadow-inner">⚡</div>
              <span className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Latest Activity</span>
              {loading ? (
                <div className="h-10 w-24 bg-slate-100 animate-pulse rounded mt-2"></div>
              ) : urls.length > 0 ? (
                <h3 className="text-2xl font-extrabold text-emerald-500 mt-4 leading-tight">
                  {new Date(Math.max(...urls.map(u => new Date(u.createdAt)))).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </h3>
              ) : (
                <h3 className="text-xl font-medium text-slate-400 mt-4">No links yet</h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDashboard;
