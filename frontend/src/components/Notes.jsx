import { useState } from "react";
import { useParams } from "react-router-dom";
import CreateNote from "./CreateNotes";
import GroupNotes from "./GroupNotes";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const Notes = () => {
  const { groupId } = useParams();
  const [showDialog, setShowDialog] = useState(false);

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  return (
    <div className="mx-auto text-white bg-gradient-to-b from-fuchsia-900 via-zinc-800 to-gray-900 shadow-lg w-full rounded-tl-lg rounded-tr-lg">
      <div className="bg-soft-500 p-5">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">Notes</h2>
      </div>
      <div className="pl-2 pr-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <GroupNotes groupId={groupId} />
          </div>
          <div className="pl-5">
            {" "}
            <div className="pt-8">
              {" "}
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                  <button className="bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
                    Add Note
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <CreateNote groupId={groupId} onClose={handleDialogClose} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
