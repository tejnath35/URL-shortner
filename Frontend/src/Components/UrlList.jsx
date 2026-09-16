import { useState } from "react";

function UrlList({ urls, loading, onDelete, onEdit, onOpen }) {
  const [copied, setCopied] = useState("");
  const [deleting, setDeleting] = useState(null);

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(""), 2500);
    } catch {
      setCopied("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this short link?")) {
      return;
    }
    setDeleting(id);
    try {
      await onDelete(id);
    } finally {
      setDeleting(null);
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
            const isExpired = url.expiresAt && new Date(url.expiresAt) <= new Date();
            
            return (
              <li key={url._id} className="url-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '12px' }}>
                <div className="url-text" style={{ flex: 1, overflow: 'hidden' }}>
                  <p className="link-title">{url.title || "Untitled link"}</p>
                  <p className="original-url" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '4px' }}>{url.longUrl}</p>
                  <a href={url.shortUrl} target="_blank" rel="noreferrer" onClick={() => onOpen(url._id)} style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }}>
                    {displayUrl}
                  </a>
                  <div className="link-meta">{url.clicks || 0} clicks {isExpired ? "· Expired" : url.expiresAt ? `· Expires ${new Date(url.expiresAt).toLocaleDateString()}` : ""}</div>
                  {!!url.tags?.length && <div className="tag-list">{url.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
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
                  <button type="button" className="edit-button" onClick={() => onEdit(url)}>Edit</button>
                  <a className="qr-download" href={qrCodeUrl} target="_blank" rel="noreferrer" download={`qr-${url.code}.png`} aria-label={`Download QR code for ${url.shortUrl}`}>QR</a>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(url._id)}
                    disabled={deleting === url._id}
                  >
                    {deleting === url._id ? "Deleting..." : "Delete"}
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
