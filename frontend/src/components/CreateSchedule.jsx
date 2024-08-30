import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

const CreateSchedule = () => {
  const { groupId } = useParams();
  console.log(groupId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/v1/groups/${groupId}/schedules`,
        { title, description, deadline },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setSuccess("Schedule created successfully!");
      setError("");
      setTitle("");
      setDescription("");
      setDeadline("");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred while creating the schedule",
      );
      setSuccess("");
    }
  };

  return (
    <div className=" flex items-center justify-center w-full">
      <div className="bg-soft-500 p-6 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-soft-100 text-center mb-6">
          Create a Schedule
        </h2>
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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-semibold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
              placeholder="Enter schedule title"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-semibold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
              placeholder="Enter schedule description"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-300 text-sm font-semibold mb-2"
              htmlFor="deadline"
            >
              Deadline
            </label>
            <input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-full bg-purple-500 text-white font-semibold py-2 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Create Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSchedule;
