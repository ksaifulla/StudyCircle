import { useState } from "react";
import axios from "axios";

const InviteModal = ({ isOpen, onClose, groupId }) => {
  // Define inviteEmail state
  const [inviteEmail, setInviteEmail] = useState(""); 
  const [isSending, setIsSending] = useState(false);

  const handleSendInvite = async () => {
    if (!inviteEmail) {
      alert("Please enter an email address.");
      return;
    }

    setIsSending(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/groups/${groupId}/invite`,
        { email: inviteEmail },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message);
      setInviteEmail(""); // Clear input field
      onClose();
    } catch (error) {
      console.error("Failed to send invite:", error);
      alert("Failed to send invite. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <h2>Invite Member</h2>
          <input
            type="email"
            placeholder="Enter email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)} // Update state on input change
            className="email-input text-black"
          />
          <button onClick={handleSendInvite} disabled={isSending}>
            {isSending ? "Sending..." : "Send Invite"}
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    )
  );
};

export default InviteModal;
