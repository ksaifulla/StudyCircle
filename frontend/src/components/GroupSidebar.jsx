import { FaHashtag } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function GroupSidebar({ groupId, name }) {
  return (
    <div className="w-56 h-full bg-soft-800 pt-4 border-r border-l border-soft-400 rounded-tl-md">
      {!groupId ? (
        <div className="h-full flex items-center justify-center text-white text-center px-4">
          <p>You are not inside any groups. Create or join a group.</p>
        </div>
      ) : (
        <div className="h-full pt-20 px-3 pb-4 bg-gradient-to-b from-soft-800 to-soft-900">
          <div className="space-y-2 font-medium">
            <SidebarElement text={"Info"} toNavigate={`/group/${groupId}`} />
            <SidebarElement text={"Chat"} toNavigate={`/chat/${groupId}`} />
            <SidebarElement text={"Notes"} toNavigate={`${groupId}/notes`} />
            <SidebarElement
              text={"Schedules"}
              toNavigate={`group/${groupId}/schedule`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export const SidebarElement = ({ text, toNavigate }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (toNavigate) {
      navigate(toNavigate);
    }
  };

  return (
    <div onClick={handleClick}>
      <div className="flex items-center p-2 h-7 rounded-lg hover:bg-soft-400 cursor-pointer">
        <Groupsidebaricon icon={<FaHashtag size="15" />} />
        <span className="ms-3 text-soft-100">{text}</span>
      </div>
    </div>
  );
};

export const Groupsidebaricon = ({ icon }) => (
  <div className="flex text-soft-100 items-center justify-center h-10 w-6 mt-2 mb-2 hover:text-white">
    {icon}
  </div>
);
