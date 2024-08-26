export const BACKEND_URL = "http://localhost:5000";
import axios from "axios";
import { useEffect, useState } from "react";

export const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await axios.get(`${BACKEND_URL}/api/v1/groups/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("API Response:", res.data);

      setGroups(res.data);
      setLoading(false);
    };
    fetchGroups();
  }, []);

  return {
    loading,
    groups,
  };
};
