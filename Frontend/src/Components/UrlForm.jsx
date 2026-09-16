import { useState } from "react";

function UrlForm({ onSubmit, loading }) {
  const [inputValue, setInputValue] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [customCode, setCustomCode] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      return;
    }
    const succeeded = await onSubmit(inputValue, customCode.trim() || null, {
      title: title.trim(),
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      expiresAt: expiresAt || null,
    });
    if (succeeded) {
      setInputValue("");
      setTitle("");
      setTags("");
      setExpiresAt("");
      setCustomCode("");
    }
  };

  return (
    <form className="url-form" onSubmit={handleSubmit}>
      <label htmlFor="longUrl">Enter a long URL</label>
      <div className="form-row">
        <input
          id="longUrl"
          type="url"
          placeholder="https://example.com/..."
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </div>

      <div style={{ marginTop: "12px" }}>
        <label htmlFor="customCode" style={{ display: "block", marginBottom: "8px", fontSize: "0.875rem" }}>
          Custom code (optional):
        </label>
        <input
          id="customCode"
          type="text"
          placeholder="Enter a custom short code"
          value={customCode}
          onChange={(event) => setCustomCode(event.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "0.875rem",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div className="form-options">
        <div>
          <label htmlFor="linkTitle">Title (optional)</label>
          <input id="linkTitle" type="text" placeholder="Project website" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={80} />
        </div>
        <div>
          <label htmlFor="linkTags">Tags (comma separated)</label>
          <input id="linkTags" type="text" placeholder="work, campaign" value={tags} onChange={(event) => setTags(event.target.value)} />
        </div>
        <div>
          <label htmlFor="expiresAt">Expires (optional)</label>
          <input id="expiresAt" type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} min={new Date().toISOString().slice(0, 16)} />
        </div>
      </div>
    </form>
  );
}

export default UrlForm;
