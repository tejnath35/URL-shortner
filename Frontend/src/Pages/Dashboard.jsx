import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UrlForm from "../Components/UrlForm.jsx";
import UrlList from "../Components/UrlList.jsx";
import Navbar from "../Components/Navbar.jsx";
import EditUrlModal from "../Components/EditUrlModal.jsx";
import API_BASE from "../apiConfig.js";
import "../App.css";

function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingUrl, setEditingUrl] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const loadUrls = async () => {
      setLoading(true);
      setMessage("");
      try {
        const response = await fetch(`${API_BASE}/urls`, { headers: { Authorization: `Bearer ${token}` } });
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        if (!response.ok) throw new Error("Unable to load saved links");
        setUrls(await response.json());
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadUrls();
  }, [navigate, token]);

  const createShortUrl = async (longUrl, customCode, metadata) => {
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ longUrl, customCode, ...metadata }),
      });

      const data = await response.json();
      
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      
      if (response.status === 409) {
        throw new Error(data.error || "This code is already taken");
      }

      if (!response.ok) {
        throw new Error(data.error || "Could not shorten URL");
      }

      setUrls((current) => [data, ...current]);
      setMessage("Short URL created successfully.");
      return true;
    } catch (error) {
      setMessage(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUrl = async (id, updates) => {
    setEditLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/urls/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update URL");
      setUrls((current) => current.map((url) => (url._id === id ? data : url)));
      setEditingUrl(null);
      setMessage("Link updated successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const recordLinkOpen = (id) => {
    setUrls((current) => current.map((url) => (
      url._id === id ? { ...url, clicks: (url.clicks || 0) + 1, lastClickedAt: new Date().toISOString() } : url
    )));
  };

  const visibleUrls = urls
    .filter((url) => {
      const query = search.trim().toLowerCase();
      return !query || [url.title, url.longUrl, url.shortUrl, ...(url.tags || [])].some((value) => value?.toLowerCase().includes(query));
    })
    .sort((first, second) => {
      if (sortBy === "clicks") return (second.clicks || 0) - (first.clicks || 0);
      if (sortBy === "oldest") return new Date(first.createdAt) - new Date(second.createdAt);
      return new Date(second.createdAt) - new Date(first.createdAt);
    });

  const deleteUrl = async (id) => {
    setMessage("");

    try {
      const response = await fetch(`${API_BASE}/urls/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Could not delete URL");
      }

      setUrls((current) => current.filter((url) => url._id !== id));
      setMessage("URL deleted successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="app-shell">
        <div className="hero-panel">
          <p className="eyebrow">Link Management</p>
          <h1 className="text-blue-500">Shorten Links</h1>
          <p className="intro">
            Paste a URL below to generate a compact, shareable link in seconds.
          </p>
        </div>

        <main className="space-y-6 mt-8">
          <UrlForm onSubmit={createShortUrl} loading={loading} />
          {message && (
            <div className={`message p-4 rounded-md text-sm font-medium ${message.includes("error") || message.includes("failed") ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
              {message}
            </div>
          )}
          <div className="list-tools">
            <input aria-label="Search links" type="search" placeholder="Search links..." value={search} onChange={(event) => setSearch(event.target.value)} />
            <select aria-label="Sort links" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="clicks">Most clicked</option>
            </select>
          </div>
          <UrlList urls={visibleUrls} loading={loading} onDelete={deleteUrl} onEdit={setEditingUrl} onOpen={recordLinkOpen} />
        </main>
      </div>
      <EditUrlModal key={editingUrl?._id || "closed"} url={editingUrl} onSave={updateUrl} onClose={() => setEditingUrl(null)} loading={editLoading} />
    </>
  );
}

export default Dashboard;
