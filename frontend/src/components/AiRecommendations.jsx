import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from '../config';

const AiRecommendations = ({ groupActivityText }) => {
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/api/v1/${groupId}/recommendations`, {
        groupActivityText,
      });

      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
      setSuggestions("Failed to get suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-xl shadow-lg mt-4">
      <h2 className="text-xl font-semibold mb-2">AI Study Suggestions</h2>

      <button
        onClick={fetchSuggestions}
        className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-all"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Get Suggestions"}
      </button>

      {suggestions && (
        <div className="mt-4 whitespace-pre-line text-sm border-t border-gray-700 pt-2">
          {suggestions}
        </div>
      )}
    </div>
  );
};

export default AiRecommendations;
