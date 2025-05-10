import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from '../config';
import EditNote from "./EditNote";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const GroupNotes = ({ groupId }) => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/v1/groups/${groupId}/notes`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (Array.isArray(res.data)) {
          setNotes(res.data);
        } else {
          throw new Error("Unexpected response format");
        }
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.error || "An error occurred while fetching notes",
        );
        setNotes([]); // Reset notes to an empty array on error
      }
    };

    fetchNotes();
  }, [groupId]);

  const handleEditNote = (noteId) => {
    setSelectedNoteId(noteId);
    setShowEditDialog(true);
  };

  return (
    <div className="flex items-center justify-center pt-2">
      <div className="bg-opacity-90 p-6 rounded-xl shadow-2xl w-full max-w-4xl">
        <h2 className="text-3xl font-extrabold text-soft-100 text-center mb-6">
          All Notes
        </h2>
        {error && (
          <div className="bg-red-200 border-l-4 border-red-600 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        {notes.length > 0 ? (
          <ul className="space-y-4">
            {notes.map((note) => (
              <li key={note._id} className="p-4 bg-soft-500 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-white">
                  {note.title}
                </h3>
                <p
                  className="text-gray-300 mt-2"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                ></p>
                <button
                  onClick={() => handleEditNote(note._id)}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Edit Note
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center h-screen">
            No notes found for this group.
          </p>
        )}

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogTrigger asChild>
            {/* Invisible trigger for dialog */}
            <button style={{ display: "none" }}></button>
          </DialogTrigger>
          <DialogContent>
            {selectedNoteId && (
              <EditNote
                noteId={selectedNoteId}
                onClose={() => setShowEditDialog(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GroupNotes;
