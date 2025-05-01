import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function JoinGroupByInvite() {
  const { groupId, token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const joinGroup = async () => {
      const authToken = localStorage.getItem("token");
  
      if (!authToken) {
        setMessage("Authorization token is missing. Please sign in.");
        setLoading(false);
        navigate("/signin"); // Redirect to signin if no token
        return;
      }
  
      try {
        console.log("Auth Token:", authToken);  // Log the auth token
        console.log("Invite Token:", token);  // Log the invite token
        console.log("Group ID:", groupId);  // Log the group ID
  
        const response = await axios.post(
          `http://localhost:5000/api/v1/groups/${groupId}/join/${token}`,
          {}, // Empty body for POST request
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Authorization header
            },
          }
        );
  
        setMessage(response.data.message || "Successfully joined the group!");
        setLoading(false);
        setTimeout(() => navigate(`/group/${groupId}`), 3000);
      } catch (err) {
        console.error("Error during join:", err.response); // Log error response for debugging
        setMessage(err.response?.data?.message || "Failed to join the group.");
        setLoading(false);
      }
    };
  
    joinGroup();
  }, [groupId, token, navigate]);

  return (
    <div className="join-group-container">
      {loading ? (
        <p>Joining group, please wait...</p>
      ) : (
        <div>
          <h2>{message}</h2>
          {message === "Successfully joined the group!" && (
            <p>Redirecting to the group page...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default JoinGroupByInvite;
