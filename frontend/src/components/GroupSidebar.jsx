import { FaHashtag } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function GroupSidebar({ groupId, name }) {
  console.log(groupId);
  return (
    <div className="top-10 w-56 h-screen bg-white border-r border-rose-200 dark:bg-rose-500 dark:border-rose-400">
      <div className="text-2xl text-white font-bold bg-white dark:bg-rose-500 mb-16 pl-4 pb-3 pt-2">
        {name}
      </div>
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-rose-500">
        <div className="space-y-2 font-medium">
          <SidebarElement text={"Info"} toNavigate={`/group/${groupId}`} />
          <SidebarElement text={"Chat"} toNavigate={`/chat/${groupId}`} />

          <SidebarElement text={"Media"} />
          <SidebarElement text={"Notes"} />
          <SidebarElement text={"Schedule"} />
        </div>
      </div>
    </div>
  );
}

export const SidebarElement = ({ text, toNavigate }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(toNavigate);
  };

  return (
    <div onClick={handleClick}>
      <div
        href="#"
        className="flex items-center p-2 h-7 rounded-lg dark:bg-rose-300 hover:bg-rose-100 dark:hover:bg-rose-400 cursor-pointer"
      >
        <Groupsidebaricon icon={<FaHashtag size="15" />} />
        <span className="ms-3 text-rose-600 dark:text-white">{text}</span>
      </div>
    </div>
  );
};

export const Groupsidebaricon = ({ icon }) => (
  <div className="flex items-center justify-center h-10 w-6 mt-2 mb-2 hover:text-white">
    {icon}
  </div>
);
