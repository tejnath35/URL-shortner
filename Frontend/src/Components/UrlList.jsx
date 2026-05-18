import { useState } from "react";

function UrlList({ urls, loading }) {
  const [copied, setCopied] = useState("");

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(""), 2500);
    } catch {
      setCopied("");
    }
  };

  return (
    <section className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-xl font-semibold text-gray-100">Recent shortened links</h2>
        {loading && <span className="text-sm font-medium text-purple-400 animate-pulse">Loading...</span>}
      </div>

      {urls.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No shortened URLs yet. Add one above.</p>
      ) : (
        <ul className="space-y-4">
          {urls.map((url) => {
            const displayUrl = url.shortUrl.replace("https://url-shortner-77cy.onrender.com", "http://urls.com");
            return (
              <li key={url._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 gap-4 transition-colors hover:border-gray-600">
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm text-gray-400 truncate mb-1" title={url.longUrl}>{url.longUrl}</p>
                  <a 
                    href={url.shortUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-base font-medium text-purple-400 hover:text-purple-300 truncate block"
                  >
                    {displayUrl}
                  </a>
                </div>
                <button
                  type="button"
                  className={`shrink-0 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 transition-colors ${
                    copied === displayUrl 
                      ? "bg-green-900/50 text-green-400 border border-green-800" 
                      : "bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => copyToClipboard(displayUrl)}
                >
                  {copied === displayUrl ? "Copied!" : "Copy"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default UrlList;
