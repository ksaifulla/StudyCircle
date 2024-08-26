import { jwtDecode } from "jwt-decode";
import { useOutletContext, useParams } from "react-router-dom";
import Chat from "./Chat";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.userId;
  }
  return null;
};

const MainChat = () => {
  const { groupId: paramsGroupId } = useParams();
  const outletContext = useOutletContext();
  const groupId = outletContext.groupId || paramsGroupId;
  const userId = getUserIdFromToken();

  if (!userId) {
    return <div>Error: User not authenticated</div>;
  }

  return (
    <div className="w-full">
      <h1>Welcome to the Chat</h1>
      <Chat userId={userId} groupId={groupId} />
    </div>
  );
};

export default MainChat;
