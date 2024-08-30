import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CopyLink from "./CopyLink";
import GroupInfoSkeleton from "./ui/GroupInfoSkeleton";
import { Separator } from "./ui/separator";

const GroupInfo = () => {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/groups/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setGroup(response.data);
      } catch (e) {
        if (e.response && e.response.status === 403) {
          setError("Access denied. You are not a member of this group.");
        } else {
          setError("Failed to load group information.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGroupInfo();
  }, [groupId]);

  if (loading) return <GroupInfoSkeleton />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="mx-auto text-white bg-gradient-to-b from-fuchsia-900 via-zinc-800 to-gray-900 shadow-lg w-full rounded-tl-lg rounded-tr-lg">
      <div className="bg-soft-500 p-5">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">{group.name}</h2>
      </div>
      <Separator></Separator>
      <div className="pl-5 pr-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-100 pt-2 pb-2">
              Description
            </h3>
            <p className="text-gray-300 mb-4">
              {group.description || "No description available."}
            </p>
          </div>
          <div className="pl-5">
            <div className="pt-2">
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Share group
              </h3>
              <CopyLink groupId={groupId} />
            </div>
          </div>
        </div>
      </div>
      <div className="pl-5">
        <h3 className="text-xl font-semibold text-gray-100 pt-5">Members</h3>
        <ul className="mt-2 space-y-2">
          {group.members.map((member) => (
            <li key={member._id} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {member.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-gray-300">{member.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupInfo;
