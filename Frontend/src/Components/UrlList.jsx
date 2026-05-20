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
    <section className="url-list">
      <div className="list-header">
        <h2 className="text-lg font-medium text-gray-900">Recent shortened links</h2>
        {loading && <span className="status">Loading...</span>}
      </div>

      {urls.length === 0 ? (
        <p className="empty-state">No shortened URLs yet. Add one above.</p>
      ) : (
        <ul>
          {urls.map((url) => {
            const displayUrl = url.shortUrl.replace("http://localhost:5000", "http://urls.com");
            return (
              <li key={url._id} className="url-row">
                <div className="url-text">
                  <p className="original-url">{url.longUrl}</p>
                  <a href={url.shortUrl} target="_blank" rel="noreferrer">
                    {displayUrl}
                  </a>
                </div>
                <button
                  type="button"
                  className="copy-button"
                  onClick={() => copyToClipboard(displayUrl)}
                >
                  {copied === displayUrl ? "Copied" : "Copy"}
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
