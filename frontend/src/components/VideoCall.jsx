import { jwtDecode } from "jwt-decode";
import { useOutletContext, useParams } from "react-router-dom";
import GroupVideoCall from "./GroupVideoCall";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.userId;
  }
  return null;
};

const VideoCall = () => {
  const { groupId: paramsGroupId } = useParams();
  const outletContext = useOutletContext();
  const groupId = outletContext.groupId || paramsGroupId;
  const userId = getUserIdFromToken();

  if (!userId) {
    return <div>Error: User not authenticated</div>;
  }

  return (
    <div className="w-full">
      <GroupVideoCall userId={userId} groupId={groupId} />
    </div>
  );
};

export default VideoCall;
