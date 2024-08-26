import Appbar from "./Appbar";
import Workspace from "./Workspace";
export default function MainLayout() {
  return (
    <div className="flex flex-col flex-1">
      {/* <!-- Appbar --> */}
      <Appbar />

      {/* <!-- Workspace --> */}

      <Workspace />
    </div>
  );
}
