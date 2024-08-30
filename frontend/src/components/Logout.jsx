import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { SideBarIcon } from "./MainSidebar";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/signin");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <SideBarIcon icon={<CiLogout size="22" />} />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-soft-500 shadow-lg text-white rounded-lg p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-gray-200">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            This action cannot be undone. This will sign you out of your
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-800">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            className="bg-fuchsia-700 hover:bg-fuchsia-800 text-white"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
