import axios from "axios";
import { useEffect, useState } from "react";

const useApprovedProperties = () => {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("All"); // e.g., Apartment, Office, etc.

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/book/get-approved-books"); // API expects books
      const properties = response?.data;

      setAllProperties(properties);
      setFilteredProperties(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = (tab, type = selectedType) => {
    let filtered = [...allProperties];

    // Tab-based filtering
    if (tab === "New Listings") {
      filtered = filtered.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (tab === "Recommended") {
      filtered = filtered
        .sort((a, b) => a.price - b.price)
        .filter(
          (property) =>
            property.condition === "Like New" || property.condition === "Brand New"
        );
    }

    // Type-based filtering
    if (type !== "All") {
      filtered = filtered.filter((property) => property.genre === type);
    }

    setFilteredProperties(filtered);
    setSelectedType(type);
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
    selectedType,
    setSelectedType,
  };
};

export default useApprovedProperties;
