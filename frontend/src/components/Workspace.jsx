import { Outlet, useParams } from "react-router-dom";
import GroupSidebar from "./GroupSidebar";

export default function Workspace() {
  const { groupId } = useParams();

  return (
    <div className="flex flex-1 h-full border-t border-soft-400 rounded-tl-lg ">
      <GroupSidebar groupId={groupId} name={"Lol"} />
      <Outlet context={{ groupId }} />
    </div>
  );
}
