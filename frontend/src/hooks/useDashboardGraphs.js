import axios from "axios";
import { useEffect, useState } from "react";

const useDashboardGraphs = () => {
  const [propertyListingsData, setPropertyListingsData] = useState([]);
  const [userActivityData, setUserActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGraphData = async () => {
    try {
      const [listingsRes, activityRes] = await Promise.all([
        axios.get("/api/admin/book-listings-stats", {
          withCredentials: true,
        }),
        axios.get("/api/admin/user-activity-stats", {
          withCredentials: true,
        }),
      ]);
      setPropertyListingsData(listingsRes.data || []);
      setUserActivityData(activityRes.data || []);
    } catch (err) {
      console.error("Error fetching graph data:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load graphs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  return { propertyListingsData, userActivityData, loading, error };
};

export default useDashboardGraphs;
