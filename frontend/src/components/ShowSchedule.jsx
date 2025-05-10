import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from '../config';

const GroupSchedules = ({ groupId }) => {
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/v1/groups/${groupId}/schedules`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (Array.isArray(res.data)) {
          setSchedules(res.data);
        } else {
          throw new Error("Unexpected response format");
        }
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "An error occurred while fetching schedules",
        );
        setSchedules([]);
      }
    };

    fetchSchedules();
  }, [groupId]);

  return (
    <div className="flex items-center justify-center pt-2">
      <div className="bg-opacity-90 p-6 rounded-xl shadow-2xl w-full max-w-4xl">
        <h2 className="text-3xl font-extrabold text-soft-100 text-center mb-6">
          All Schedules
        </h2>
        {error && (
          <div className="bg-red-200 border-l-4 border-red-600 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        {schedules.length > 0 ? (
          <ul className="space-y-4">
            {schedules.map((schedule) => (
              <li
                key={schedule._id}
                className="p-4 bg-soft-500 rounded-lg shadow"
              >
                <h3 className="text-xl font-semibold text-soft-100">
                  {schedule.title}
                </h3>
                <p className="text-soft-300">{schedule.description}</p>
                <p className="text-soft-400 mt-2">
                  Deadline: {new Date(schedule.deadline).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center h-screen">
            No schedules found for this group.
          </p>
        )}
      </div>
    </div>
  );
};

export default GroupSchedules;
