import axios from "axios";
import { useEffect, useState } from "react";

const useUserProperties = (userId) => {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/book/get-book-by-user", {
        headers: {
          id: userId,
        },
      });
      setAllProperties(response.data); // Store properties
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [userId]);

  return { allProperties, loading, fetchProperties };
};

export default useUserProperties;
