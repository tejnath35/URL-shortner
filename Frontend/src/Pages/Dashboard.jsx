import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UrlForm from "../Components/UrlForm.jsx";
import UrlList from "../Components/UrlList.jsx";
import Navbar from "../Components/Navbar.jsx";
import "../App.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setMessage("");

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
      
      if (!response.ok) {
        throw new Error("Unable to load saved links");
      }

      const data = await response.json();
      setUrls(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createShortUrl = async (longUrl) => {
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ longUrl }),
      });

      const data = await response.json();
      
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      
      if (!response.ok) {
        throw new Error(data.error || "Could not shorten URL");
      }

      setUrls((current) => [data, ...current]);
      setMessage("Short URL created successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
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
          <UrlList urls={urls} loading={loading} />
        </main>
      </div>
    </>
  );
}

export default Dashboard;
