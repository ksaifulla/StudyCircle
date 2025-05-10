import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from '../config';

export const useGroup = ({ id }) => {
  const [group, setGroup] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      const res = await axios.get(`${BACKEND_URL}/api/v1/group/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setGroup(res.data.group);
      setLoading(false);
    };
    fetchGroup();
  }, [id]);

  return {
    loading,
    group,
  };
};
