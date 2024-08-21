import { BsFillLightningFill, BsGearFill, BsPlus } from "react-icons/bs";
import GroupAvatar from "./Avatar";

const MainSideBar = () => {
  return (
    <div className="fixed top-10 left-0 h-screen w-16 flex flex-col bg-white dark:bg-rose-900 shadow-lg">
      <div className="mb-8">
        <GroupAvatar name="Caves" />
        <Divider />
      </div>
      <div className="">
        <SideBarIcon icon={<BsPlus size="32" />} />
        <SideBarIcon icon={<BsFillLightningFill size="20" />} />
        <SideBarIcon icon={<BsGearFill size="22" />} />
      </div>
    </div>
  );
};

const SideBarIcon = ({ icon }) => (
  <div
    className="relative flex items-center justify-center h-7 w-7 mt-2 mb-2 mx-auto
    bg-rose-400 hover:bg-green-600 dark:bg-rose-800 text-green-500 hover:text-white 
    hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg  group"
  >
    {icon}
  </div>
);

export const Divider = () => (
  <hr className="bg-rose-200 dark:bg-rose-800 border border-rose-200 dark:border-rose-800 mx-2" />
);

export default MainSideBar;
