import axios from "axios";
import { useEffect, useState } from "react";

const usePropertyDetails = (propertyId) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPropertyDetails = async () => {
    try {
      const response = await axios.get(
        `/api/book/get-book-by-id/${propertyId}` // Endpoint remains the same
      );
      const data = response?.data;
      setProperty(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching property details:", err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  return { property, loading, error };
};

export default usePropertyDetails;
