import MainLayout from "./MainLayout";
import MainSidebar from "./MainSidebar";

export default function AppLayout() {
  return (
    <div className="flex h-screen">
      <div>
        <MainSidebar />
      </div>
      <MainLayout />
    </div>
  );
}
