import InputBar from "./Inputbar";
import Taskbar from "./Taskbar";
import Toolbar from "./Toolbar";
export default function Mainworkspace() {
  return (
    <div className="flex flex-col flex-1">
      {/* <!-- Toolbar --> */}
      <div>
        {/* <!-- Toolbar content --> */}
        <Toolbar />
      </div>

      {/* <!-- Taskbar --> */}
      <div className="flex-1 bg-gray-300">
        {/* <!-- Taskbar content --> */}
        <Taskbar />
      </div>

      {/* <!-- InputBar --> */}
      <div className="h-20 bg-green-500">
        {/* <!-- InputBar content --> */}
        <InputBar />
      </div>
    </div>
  );
}
