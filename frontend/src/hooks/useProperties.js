import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

const useProperties = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useContext(UserContext);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/book/get-all-books", {
        withCredentials: true,
      });
      const properties = response?.data;

      setAllProperties(properties);
      setFilteredProperties(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = (tab) => {
    let filtered = [];

    if (tab === "New Listings") {
      filtered = [...allProperties].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (tab === "Recommended") {
      filtered = allProperties
        .sort((a, b) => a.price - b.price)
        .filter(
          (property) =>
            property.condition === "Like New" || property.condition === "Brand New"
        );
    }

    setFilteredProperties(filtered);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    allProperties,
    setAllProperties,
    filteredProperties,
    filterProperties,
    loading,
  };
};

export default useProperties;
