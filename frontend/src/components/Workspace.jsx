import { Outlet, useParams } from "react-router-dom";
import GroupSidebar from "./GroupSidebar";

// import Mainworkspace from "./Mainworkspace";
export default function Workspace() {
  const { groupId } = useParams(); // Get the groupId from the URL

  return (
    <div className="flex flex-1">
      {/* <!-- Second Sidebar --> */}
      <GroupSidebar groupId={groupId} name={"Lol"} />

      {/* <!-- Main Workspace --> */}
      {/* <Mainworkspace /> */}
      <Outlet context={{ groupId }} />
    </div>
  );
}
