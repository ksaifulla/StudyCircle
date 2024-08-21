import { FaHashtag } from "react-icons/fa6";

const GroupSidebar = ({ name }) => {
  return (
    <div>
      <div
        className="fixed top-10 left-16 z-40 w-56 h-screen transition-transform -translate-x-full bg-white border-r border-rose-200 sm:translate-x-0 dark:bg-rose-500 dark:border-rose-400 "
        aria-label="Sidebar"
      >
        <div className="text-2xl text-white font-bold bg-white dark:bg-rose-500 mb-16 pl-4 pb-3 pt-2">
          {name}
        </div>
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-rose-500">
          <div className="space-y-2 font-medium">
            <SidebarElement text={"group-chat"} />
            <SidebarElement text={"media"} />
            <SidebarElement text={"notes"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SideBarIcon = ({ icon }) => (
  <div
    className="flex items-center justify-center h-10 w-6 mt-2 mb-2 
     hover:text-white "
  >
    {icon}
  </div>
);

export const SidebarElement = ({ text }) => {
  return (
    <div>
      <div
        href="#"
        className="flex items-center p-2 h-7 rounded-lg dark:bg-rose-300 hover:bg-rose-100 dark:hover:bg-rose-400"
      >
        <SideBarIcon icon={<FaHashtag size="15" />} />
        <span className="ms-3 text-rose-600 dark:text-white">{text}</span>
      </div>
    </div>
  );
};

export default GroupSidebar;
