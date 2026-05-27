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
            const displayUrl = url.shortUrl;
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url.shortUrl)}`;
            
            return (
              <li key={url._id} className="url-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '12px' }}>
                <div className="url-text" style={{ flex: 1, overflow: 'hidden' }}>
                  <p className="original-url" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '4px' }}>{url.longUrl}</p>
                  <a href={url.shortUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }}>
                    {displayUrl}
                  </a>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '64px', height: '64px', padding: '4px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                    <img src={qrCodeUrl} alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <button
                    type="button"
                    className="copy-button"
                    onClick={() => copyToClipboard(displayUrl)}
                  >
                    {copied === displayUrl ? "Copied" : "Copy"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default UrlList;
