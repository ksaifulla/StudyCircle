import { FaInfoCircle, FaComments, FaClipboardList, FaCloudUploadAlt, FaCalendarAlt, FaQuestion, FaQuestionCircle, FaVideo, FaRobot, FaPencilAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function GroupSidebar({ groupId, name }) {
  const location = useLocation(); // Get current URL to highlight the active link

  return (
    <div className="w-72 min-h-screen bg-soft-800 pt-4 border-r border-soft-400">
      {!groupId ? (
        <div className="h-full flex items-center justify-center text-white text-center px-4">
          <p className="text-lg font-semibold">
            You are not inside any group. Create or join a group.
            <br />
            <br />
            Already a group member? Open it.
          </p>
        </div>
      ) : (
        <div className="h-full pt-20 px-4 pb-4 space-y-6">
          <div className="text-white text-xl font-bold mb-4">{name}</div>
          <div className="space-y-4">
            <SidebarElement
              text="Info"
              toNavigate={`/group/${groupId}`}
              icon={<FaInfoCircle size="20" />}
              isActive={location.pathname === `/group/${groupId}`}
            />
            <SidebarElement
              text="Chat"
              toNavigate={`/chat/${groupId}`}
              icon={<FaComments size="20" />}
              isActive={location.pathname === `/chat/${groupId}`}
            />
            <SidebarElement
              text="Notes"
              toNavigate={`${groupId}/notes`}
              icon={<FaClipboardList size="20" />}
              isActive={location.pathname === `${groupId}/notes`}
            />
            <SidebarElement
              text="Schedules"
              toNavigate={`group/${groupId}/schedule`}
              icon={<FaCalendarAlt size="20" />}
              isActive={location.pathname === `group/${groupId}/schedule`}
            />
            <SidebarElement
              text="Media"
              toNavigate={`group/${groupId}/upload`}
              icon={<FaCloudUploadAlt size="20" />}
              isActive={location.pathname === `group/${groupId}/upload`}
            />
            <SidebarElement
              text="Quizzes"
              toNavigate={`group/${groupId}/quizzes`}
              icon={<FaQuestionCircle size="20" />}
              isActive={location.pathname === `group/${groupId}/quizzes`}
            />
            <SidebarElement
              text="Video Call"
              toNavigate={`group/${groupId}/video-call`}
              icon={<FaVideo size="20" />}
              isActive={location.pathname === `group/${groupId}/video-call`}
            />
            
<SidebarElement
  text="Whiteboard"
  toNavigate={`group/${groupId}/whiteboard`}
  icon={<FaPencilAlt size="20" />} // Change to a relevant video icon
  isActive={location.pathname === `group/${groupId}/whiteboard`}
/>

<SidebarElement
  text="Study Assistant"
  toNavigate={`group/${groupId}/recommendations`}
  icon={<FaRobot size="20" />} // Change to a relevant video icon
  isActive={location.pathname === `group/${groupId}/recommendations`}
/>
          </div>
        </div>
      )}
    </div>
  );
}

// Sidebar element with hover, active state enhancements, and highlighting
export const SidebarElement = ({ text, toNavigate, icon, isActive }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (toNavigate) {
      navigate(toNavigate);
    }
  };

  return (
    <div onClick={handleClick} className="group">
      <div
        className={`flex items-center p-3 h-12 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
          isActive
            ? "bg-soft-500 text-white"
            : "hover:bg-soft-500 text-soft-100 hover:text-white"
        }`}
      >
        <div
          className={`flex items-center justify-center rounded-full ${
            isActive ? "bg-soft-400" : "hover:bg-soft-400"
          } `}
        >
          {icon}
        </div>
        <span
          className={`ml-4 text-lg font-medium ${
            isActive ? "font-bold" : "text-soft-100 hover:text-white"
          }`}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
