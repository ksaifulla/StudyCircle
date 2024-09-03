import axios from "axios";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditNote = ({ noteId, onClose }) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/groups/notes/${noteId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (err) {
        setError("Error fetching note");
        console.error("Error fetching note:", err.response.data);
      }
    };

    fetchNote();
  }, [noteId]);

  const handleSaveNote = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/v1/groups/notes/${noteId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setSuccess("Note updated successfully!");
      setError("");
      onClose(); // Close the dialog after successful edit
    } catch (err) {
      setError("Error updating note");
      console.error("Error updating note:", err.response.data);
      setSuccess("");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-soft-500 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Edit Note</h2>
      {error && (
        <div className="bg-red-200 border-l-4 border-red-600 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-200 border-l-4 border-green-600 text-green-700 p-3 rounded mb-4">
          {success}
        </div>
      )}
      <input
        type="text"
        placeholder="Note Title"
        value={title}
        readOnly
        className="w-full mb-4 px-3 py-2 border rounded"
      />
      <ReactQuill
        value={content}
        onChange={setContent}
        className="h-56"
        style={{
          color: "white", // Set text color to white
          backgroundColor: "#1a202c", // Set a dark background
        }}
        theme="snow"
      />
      <button
        onClick={handleSaveNote}
        className="mt-12 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditNote;
