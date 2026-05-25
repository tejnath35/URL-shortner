import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wider text-purple-400 uppercase mb-2">Get Started</p>
          <h2 className="text-3xl font-extrabold text-white">Create an account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="sr-only" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                disabled={loading}
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-gray-900 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="email-address">Email address</label>
              <input
                id="email-address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                disabled={loading}
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-gray-900 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={loading}
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-gray-900 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-800 rounded-md">
              <p className="text-sm text-red-200 text-center">{error}</p>
            </div>
          )}

          <div>
            <button 
              type="submit" 
              disabled={loading} 
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 ${
                loading 
                  ? "bg-purple-500 cursor-not-allowed opacity-75" 
                  : "bg-purple-600 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
