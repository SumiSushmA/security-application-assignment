import axios from "axios";
import { useEffect, useState } from "react";

const useDashboardGraphs = () => {
  const [propertyListingsData, setPropertyListingsData] = useState([]);
  const [userActivityData, setUserActivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        // Fetch Property Listings Data
        const bookResponse = await axios.get("/api/admin/book-listings-stats");
        setPropertyListingsData(bookResponse.data); // renamed for UI clarity

        // Fetch User Activity Data
        const userResponse = await axios.get("/api/admin/user-activity-stats");
        setUserActivityData(userResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching graph data:", error);
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  return { propertyListingsData, userActivityData, loading };
};

export default useDashboardGraphs;
