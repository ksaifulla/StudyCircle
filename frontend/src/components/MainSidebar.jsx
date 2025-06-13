import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import { BsGearFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useGroups } from "../hooks/useGroups";
import AddGroup from "./AddGroup";
import LogOut from "./Logout";
import Settings from "./Settings";

export default function MainSidebar() {
  const navigate = useNavigate();
  const { groups, loading } = useGroups();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  const openSettingsDialog = () => {
    setIsSettingsOpen(true);
  };

  const closeSettingsDialog = () => {
    setIsSettingsOpen(false);
  };

  return (
    <div className="min-h-screen w-30 flex flex-col bg-soft-500 text-white">
      {/* Group Avatars Section at the Top */}
      <div className="flex flex-col items-center space-y-2 mt-12 mb-4">
      {!loading && groups.length > 0 && (
    <div>
      <h1 className="text-white">Groups</h1>
    </div>
  )}
        {!loading && 
          groups.map((group) => (
            <GroupAvatar
              key={group._id}
              name={group.name}
              onClick={() => handleGroupClick(group._id)}
            />
          ))}
      </div>
      
      <div className="flex flex-grow"></div>
      {/* Action Icons Section Below Group Avatars */}
      
      <div className="flex flex-col items-start space-y-4 mb-20 ml-4">
      
        <div className="flex items-center space-x-1">
          
          <AddGroup />
          <h1 className="text-sm font-medium ">Add <br/>Group</h1>
        </div>
        <div className="flex items-center space-x-1">
          <SettingIcon onClick={openSettingsDialog} />
          <h1 className="text-sm font-medium pr-2">Settings</h1>
        </div>
        <div className="flex items-center space-x-1">
          <LogOut />
          <h1 className="text-sm font-medium pr-2">Signout</h1>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
          <div></div>
        </DialogTrigger>
        <DialogContent onClose={closeSettingsDialog} className="max-w-3xl p-0">
          <Settings onClose={closeSettingsDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const SideBarIcon = React.forwardRef(({ icon, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className="relative flex items-center justify-center h-7 w-7 mt-2 mb-2 mx-auto
        hover:bg-soft-400 bg-slate-700 text-soft-100 hover:text-white 
        hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg group"
    >
      {icon}
    </div>
  );
});
SideBarIcon.displayName = "SideBarIcon";

export const SettingIcon = ({ onClick }) => {
  return (
    <div onClick={onClick}>
      <SideBarIcon icon={<BsGearFill size="22" />} />
    </div>
  );
};

const Divider = () => (
  <hr className="bg-zinc-800 border border-green-200 dark:border-green-800 mx-2" />
);

export function GroupAvatar({ name, onClick }) {
  const displayName = name.length > 2 ? name.charAt(0) : name; // Only show the first letter or truncate

  return (
    <div
      className="relative flex items-center justify-center h-10 w-10 mt-2 mb-2 mx-auto
     hover:bg-soft-400 bg-slate-700 hover:text-white 
    hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg group"
      onClick={onClick}
      title={name} // Tooltip to show the full group name
    >
      <span className="text-xs text-soft-100">{displayName}</span>
    </div>
  );
}

