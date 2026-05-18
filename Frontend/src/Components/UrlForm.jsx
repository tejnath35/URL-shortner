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
    <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="longUrl" className="block text-sm font-medium text-gray-300">
          Enter a long URL
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            id="longUrl"
            type="url"
            placeholder="https://example.com/..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            required
            className="flex-1 min-w-0 block w-full px-4 py-3 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow duration-200"
          />
          <button 
            type="submit" 
            disabled={loading}
            className={`inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900 ${
              loading 
                ? "bg-purple-500 cursor-not-allowed opacity-75" 
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Shortening...
              </>
            ) : "Shorten"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UrlForm;
