import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userInfo } = useContext(UserContext);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/admin/users", {
        withCredentials: true,
      });
      setUsers(response.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error };
};

export default useFetchUsers;
