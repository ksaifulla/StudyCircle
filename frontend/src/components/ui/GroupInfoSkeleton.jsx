import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
const GroupInfoSkeleton = () => {
  return (
    <div className="mx-auto text-white bg-gradient-to-b from-fuchsia-900 via-zinc-800 to-gray-900 shadow-lg w-full rounded-tl-lg rounded-tr-lg">
      <div className="bg-soft-500 p-5">
        <Skeleton className="h-8 w-1/3 mb-4" /> {/* Simulates the group name */}
      </div>
      <Separator />
      <div className="pl-5 pr-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Skeleton className="h-6 w-1/4 mb-2" />{" "}
            {/* Simulates the "Description" title */}
            <Skeleton className="h-4 w-full mb-2" />{" "}
            {/* Simulates the description text */}
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
          </div>
          <div className="pl-5">
            <div className="pt-2">
              <Skeleton className="h-6 w-1/3 mb-2" />{" "}
              {/* Simulates the "Share group" title */}
              <Skeleton className="h-10 w-24" />{" "}
              {/* Simulates the CopyLink button */}
            </div>
          </div>
        </div>
      </div>
      <div className="pl-5">
        <Skeleton className="h-6 w-1/4 mb-4" />{" "}
        {/* Simulates the "Members" title */}
        <ul className="mt-2 space-y-2">
          {/* Simulates the list of members */}
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-1/3" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroupInfoSkeleton;
