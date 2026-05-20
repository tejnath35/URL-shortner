import { useState } from "react";

function UrlForm({ onSubmit, loading }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      return;
    }
    await onSubmit(inputValue);
    setInputValue("");
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
    </form>
  );
}

export default UrlForm;
