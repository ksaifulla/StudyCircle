import { BsFillLightningFill, BsGearFill, BsPlus } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useGroups } from "../hooks/useGroups";

export default function MainSidebar() {
  const { groups, loading } = useGroups();
  const navigate = useNavigate();

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  return (
    <div className="pt-10 h-screen w-16 flex flex-col dark:bg-rose-900 text-white">
      <div className="mb-8">
        {!loading &&
          groups.map((group) => (
            <GroupAvatar
              key={group._id}
              name={group.name}
              onClick={() => handleGroupClick(group._id)}
            />
          ))}
        <Divider />
      </div>
      <div className="">
        <SideBarIcon icon={<BsPlus size="32" />} />
        <SideBarIcon icon={<BsFillLightningFill size="20" />} />
        <SideBarIcon icon={<BsGearFill size="22" />} />
      </div>
    </div>
  );
}

const SideBarIcon = ({ icon }) => (
  <div
    className="relative flex items-center justify-center h-7 w-7 mt-2 mb-2 mx-auto
    bg-rose-400 hover:bg-green-600 dark:bg-rose-800 text-green-500 hover:text-white 
    hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg  group"
  >
    {icon}
  </div>
);

const Divider = () => (
  <hr className="bg-rose-200 dark:bg-rose-800 border border-rose-200 dark:border-rose-800 mx-2" />
);

export function GroupAvatar({ name, onClick }) {
  return (
    <div
      className="relative flex items-center justify-center h-7 w-7 mt-2 mb-2 mx-auto
    bg-rose-400 hover:bg-green-600 dark:bg-rose-800 text-green-500 hover:text-white 
    hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg group"
      onClick={onClick}
    >
      <span className="text-xs text-red-600 dark:text-red-300">{name[0]}</span>
    </div>
  );
}
