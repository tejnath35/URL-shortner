import { useState, useEffect } from "react";
import "../styles/EditUrlModal.css";

function EditUrlModal({ url, onSave, onClose, loading }) {
  const [customText, setCustomText] = useState("");

  useEffect(() => {
    if (url) {
      setCustomText(url.customText || "");
    }
  }, [url]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(url._id, customText);
  };

  if (!url) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Link Text</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customText">Display Text</label>
            <input
              id="customText"
              type="text"
              placeholder="Give your link a name..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Long URL</label>
            <input
              type="text"
              value={url.longUrl}
              readOnly
              disabled
              style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
            />
          </div>

          <div className="form-group">
            <label>Short URL</label>
            <input
              type="text"
              value={url.shortUrl}
              readOnly
              disabled
              style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUrlModal;
