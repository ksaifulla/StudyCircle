import Appbar from "./Appbar";
import GroupSidebar from "./GroupSidebar";
import MainSideBar from "./MainSidebar";

const Layout = () => {
  return (
    <div>
      <GroupSidebar name={"Caves"} />
      <Appbar />
      <MainSideBar />
    </div>
  );
};

export default Layout;
