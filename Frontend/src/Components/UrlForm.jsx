import { useState } from "react";

function UrlForm({ onSubmit, loading }) {
  const [inputValue, setInputValue] = useState("");
  const [customCode, setCustomCode] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      return;
    }
    await onSubmit(inputValue, customCode.trim() || null);
    setInputValue("");
    setCustomCode("");
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
    </form>
  );
}

export default UrlForm;
