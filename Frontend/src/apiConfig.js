const envBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
const fallbackApiBase = `${window.location.origin}/api`;

const API_BASE = envBase || fallbackApiBase;

export default API_BASE;
