import { Outlet, useParams } from "react-router-dom";
import GroupSidebar from "./GroupSidebar";

 export default function Workspace() {
   const { groupId } = useParams();

   return (
     <div className="flex flex-1 h-full border-t border-soft-500 rounded-tl-lg ">
       <GroupSidebar groupId={groupId}  />
       <Outlet context={{ groupId }} />
     </div>
   );
 }

// export default function Workspace() {
//   const { groupId } = useParams();

//   return (
//     <div className="flex flex-1 h-full border-t border-soft-500 rounded-tl-lg">
//       <GroupSidebar groupId={groupId} name={"Lol"} />
//       {groupId ? (
//         <Outlet context={{ groupId }} />
//       ) : (
//         <div className="flex items-center justify-center text-white">
//           <p>Select a group to view its information.</p>
//         </div>
//       )}
//     </div>
//   );
// }
