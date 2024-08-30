import axios from "axios";
import { useState } from "react";

const CreateGroup = () => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [groupId, setGroupId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/v1/groups",
        {
          name,
          subject,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setSuccess("Group created successfully!");
      setError("");
      setName("");
      setSubject("");
      setDescription("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the group",
      );
      setSuccess("");
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/v1/groups/${groupId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setSuccess("Joined group successfully!");
      setError("");
      setGroupId("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while joining the group",
      );
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-black w-full">
      <div className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Create or Join a Group
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

        <form onSubmit={handleCreateGroup} className="mb-8">
          <div className="mb-4">
            <label
              className="block text-gray-800 text-sm font-semibold mb-2"
              htmlFor="name"
            >
              Group Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
              placeholder="Enter group name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-800 text-sm font-semibold mb-2"
              htmlFor="subject"
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
              placeholder="Enter subject"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-800 text-sm font-semibold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
              placeholder="Enter group description"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-full bg-purple-500 text-white font-semibold py-2 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Create Group
            </button>
          </div>
        </form>

        {/* OR Divider */}
        <div className="flex items-center justify-center mb-4">
          <hr className="w-full border-gray-300" />
          <span className="mx-4 text-gray-500 font-semibold">OR</span>
          <hr className="w-full border-gray-300" />
        </div>

        {/* Join Group Form */}
        <div>
          <p className="text-center text-gray-800 font-semibold mb-4">
            Have a group ID? Join the group
          </p>
          <form onSubmit={handleJoinGroup}>
            <div className="mb-4">
              <label
                className="block text-gray-800 text-sm font-semibold mb-2"
                htmlFor="groupId"
              >
                Group ID
              </label>
              <input
                id="groupId"
                type="text"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
                placeholder="Enter group ID"
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="w-full bg-purple-500 text-white font-semibold py-2 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                Join Group
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
