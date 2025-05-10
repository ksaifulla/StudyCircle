import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from '../config';
import ConfirmationModal from "./ConfirmationModal";
import CopyLink from "./CopyLink";
import GroupInfoSkeleton from "./ui/GroupInfoSkeleton";
import { Separator } from "./ui/separator";

const GroupInfo = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch group information on component load
  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/groups/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setGroup(response.data);
      } catch (e) {
        setError(
          e.response && e.response.status === 403
            ? "Access denied. You are not a member of this group."
            : "Failed to load group information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGroupInfo();
  }, [groupId]);

  // Handle leave group action
  const handleLeaveGroup = async () => {
    setIsLeaving(true);
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/groups/${groupId}/leave`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("You have successfully left the group.");
      setIsModalOpen(false); // Close modal after confirmation
      navigate("/groups"); // Redirect user to groups page or another relevant page
    } catch (error) {
      console.error("Failed to leave group", error);
      alert("An error occurred while trying to leave the group.");
    } finally {
      setIsLeaving(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) return <GroupInfoSkeleton />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="mx-auto text-white bg-gradient-to-b from-fuchsia-900 via-zinc-800 to-gray-900 shadow-2xl w-full rounded-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-soft-500 p-6 flex justify-between items-center rounded-t-lg">
        <h2 className="text-4xl font-extrabold text-gray-200 mb-4">{group.name}</h2>
        <button
          className={`bg-purple-800 hover:bg-purple-900 text-white font-medium py-3 px-6 rounded-lg transition-opacity ${isLeaving ? "opacity-50" : ""}`}
          onClick={openModal}
          disabled={isLeaving}
        >
          {isLeaving ? "Leaving..." : "Leave Group"}
        </button>
      </div>

      <Separator />

      {/* Group Info Section */}
      <div className="px-6 py-6 space-y-6">
        <div className="flex justify-between items-start space-x-8">
          {/* Description Box */}
          <div className="flex-1 space-y-2">
            <h3 className="text-3xl font-semibold text-gray-100 mb-4">Description</h3>
            <p className="text-gray-300 text-lg leading-relaxed">{group.description || "No description available."}</p>
          </div>

          {/* Share Group Box */}
          <div className="pl-5 space-y-4">
            <div className="bg-soft-500 p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold textl-gray-100 mb-4">Share Group</h3>
              <CopyLink groupId={groupId} />
            </div>
          </div>
        </div>
      </div>

      {/* Members Box */}
      <div className="px-6 py-6">
        <h3 className="text-3xl font-semibold text-gray-100 mb-4">Members</h3>
        <ul className="space-y-6 mt-4">
          {group.members.map((member) => (
            <li key={member._id} className="flex items-center space-x-6">
              <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-gray-700">
                {member.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-300 text-xl font-medium">{member.username}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleLeaveGroup}
        onCancel={closeModal}
      />
    </div>
  );
};

export default GroupInfo;
