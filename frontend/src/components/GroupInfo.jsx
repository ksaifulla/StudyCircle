// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const GroupInfo = () => {
//   const { id } = useParams(); // Extracts group ID from URL parameters
//   const [group, setGroup] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchGroupInfo = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/v1/groups/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you're using token-based authentication
//             },
//           },
//         );
//         setGroup(response.data);
//       } catch (err) {
//         setError(
//           err.response?.data?.message || "Error fetching group information",
//         );
//       }
//     };

//     fetchGroupInfo();
//   }, [id]);

//   if (error) return <div>Error: {error}</div>;
//   if (!group) return <div>Loading...</div>;

//   return (
//     <div>
//       <h2>{group.name}</h2>
//       <p>{group.description}</p>
//       <h3>Members:</h3>
//       <ul>
//         {group.members.map((member) => (
//           <li key={member._id}>{member.username}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default GroupInfo;
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const GroupInfo = () => {
//   const { groupId } = useParams(); // Extracts group ID from URL parameters

//   const [group, setGroup] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchGroupInfo = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/v1/groups/${groupId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your auth token logic
//             },
//           },
//         );
//         setGroup(response.data);
//       } catch (e) {
//         setError("Failed to load group information.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGroupInfo();
//   }, [groupId]);

//   if (loading)
//     return <div className="text-center text-gray-500">Loading...</div>;
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <div className=" mx-auto p-6 bg-white shadow-lg rounded-l w-full">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">{group.name}</h2>
//       <p className="text-gray-600 mb-4">
//         {group.description || "No description available."}
//       </p>
//       <div className="mb-4">
//         <h3 className="text-xl font-semibold text-gray-700">Members</h3>
//         <ul className="mt-2 space-y-2">
//           {group.members.map((member) => (
//             <li key={member._id} className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//                 <span className="text-white font-bold">
//                   {member.username.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//               <span className="text-gray-800">{member.username}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="mt-6">
//         <button className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
//           Join Group
//         </button>
//       </div>
//     </div>
//   );
// };

// export default GroupInfo;
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const GroupInfo = () => {
  const { groupId } = useParams(); // Extracts group ID from URL parameters

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
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your auth token logic
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

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className=" mx-auto p-6 bg-white shadow-lg rounded-l w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{group.name}</h2>
      <p className="text-gray-600 mb-4">
        {group.description || "No description available."}
      </p>
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-700">Members</h3>
        <ul className="mt-2 space-y-2">
          {group.members.map((member) => (
            <li key={member._id} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {member.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-gray-800">{member.username}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <button className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          Join Group
        </button>
      </div>
    </div>
  );
};

export default GroupInfo;
