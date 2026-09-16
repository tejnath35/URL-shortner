import { useState } from "react";
import "../styles/EditUrlModal.css";

function EditUrlModal({ url, onSave, onClose, loading }) {
  const [form, setForm] = useState(() => ({
    longUrl: url?.longUrl || "",
    title: url?.title || "",
    tags: (url?.tags || []).join(", "),
    expiresAt: url?.expiresAt ? new Date(url.expiresAt).toISOString().slice(0, 16) : "",
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(url._id, {
      ...form,
      title: form.title.trim(),
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      expiresAt: form.expiresAt || null,
    });
  };

  if (!url) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Link</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="editLongUrl">Destination URL</label>
            <input
              id="editLongUrl"
              type="text"
              value={form.longUrl}
              onChange={(e) => setForm({ ...form, longUrl: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editTitle">Title</label>
            <input
              id="editTitle"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              maxLength={80}
            />
          </div>

          <div className="form-group">
            <label htmlFor="editTags">Tags</label>
            <input
              id="editTags"
              type="text"
              placeholder="work, campaign"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="editExpiresAt">Expires</label>
            <input id="editExpiresAt" type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
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
