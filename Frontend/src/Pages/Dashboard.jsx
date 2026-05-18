import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UrlForm from "../Components/UrlForm.jsx";
import UrlList from "../Components/UrlList.jsx";
import "../App.css";

const API_BASE = "http://localhost:5000/api";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8">
        <header className="text-center">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm font-semibold tracking-wider text-purple-400 uppercase">URL Shortener</p>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900"
            >
              Logout
            </button>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Shorten long links instantly.
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Paste a URL below to generate a compact, shareable link in seconds.
          </p>
        </header>

        <main className="space-y-8 mt-10">
          <UrlForm onSubmit={createShortUrl} loading={loading} />
          {message && (
            <div className={`p-4 rounded-md text-sm font-medium ${message.includes("error") || message.includes("failed") ? "bg-red-900/50 text-red-200 border border-red-800" : "bg-green-900/50 text-green-200 border border-green-800"}`}>
              {message}
            </div>
          )}
          <UrlList urls={urls} loading={loading} />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
