import { Separator } from "./separator";
import { Skeleton } from "./skeleton";

const GroupInfoSkeleton = () => {
  return (
    <div className="mx-auto text-white bg-gradient-to-b from-fuchsia-900 via-zinc-800 to-gray-900 shadow-xl w-full rounded-lg">
      {/* Header Section */}
      <div className="bg-soft-500 p-6 rounded-t-lg">
        <Skeleton className="h-10 w-1/4 mb-4" /> {/* Simulates the group name */}
      </div>

      <Separator />

      {/* Body Section */}
      <div className="px-6 py-6 space-y-6">
        <div className="flex justify-between items-start space-x-8">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-1/3" /> {/* Simulates the "Description" title */}
            <Skeleton className="h-4 w-full" /> {/* Simulates the description text */}
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="space-y-6 w-1/3">
            <Skeleton className="h-6 w-1/2" /> {/* Simulates the "Share group" title */}
            <Skeleton className="h-12 w-28 rounded-md" /> {/* Simulates the CopyLink button */}
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="px-6 py-6">
        <Skeleton className="h-6 w-1/3 mb-4" /> {/* Simulates the "Members" title */}
        <ul className="space-y-4">
          {/* Simulates the list of members */}
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className="flex items-center space-x-4">
              <Skeleton className="w-12 h-12 rounded-full" /> {/* Simulates the avatar */}
              <Skeleton className="h-4 w-1/2" /> {/* Simulates the member name */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupInfoSkeleton;
