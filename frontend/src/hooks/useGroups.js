export const BACKEND_URL = "http://localhost:5000";
import axios from "axios";
import { useEffect, useState } from "react";

export const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch groups from the backend API
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/groups/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("API Response:", res.data);
        setGroups(res.data); // Store groups in the state
        setLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error("Error fetching groups:", error);
        setLoading(false); // Set loading state to false even on error
      }
    };
    fetchGroups();
  }, []);

  // Function to add a new group to the list
  const addGroup = (newGroup) => {
    setGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  return {
    loading,
    groups,
    addGroup, // Return addGroup function
  };
};
