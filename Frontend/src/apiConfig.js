const envBase = import.meta.env.VITE_API_BASE_URL;
const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const fallbackApiBase = import.meta.env.DEV && isLocalHost
  ? `${window.location.protocol}//${window.location.hostname}:5000/api`
  : `${window.location.origin}/api`;

const API_BASE = envBase && !envBase.includes("localhost") && !envBase.includes("127.0.0.1")
  ? envBase.replace(/\/$/, "")
  : fallbackApiBase;

export default API_BASE;
