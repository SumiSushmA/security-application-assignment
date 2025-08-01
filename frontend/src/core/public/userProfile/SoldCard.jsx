import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../../context/UserContext";

const SoldCard = () => {
  const [soldProperties, setSoldProperties] = useState([]);
  const { userInfo } = useContext(UserContext);

  const fetchSoldProperties = async () => {
    if (!userInfo) {
      toast.error("Please log in to view sold properties.");
      return;
    }

    try {
      const response = await axios.get("/api/book/sold", {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setSoldProperties(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchSoldProperties();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {soldProperties.length === 0 ? (
        <div className="col-span-full text-center text-gray-600">
          No sold properties to display.
        </div>
      ) : (
        soldProperties.map((property) => (
          <div
            key={property._id}
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-all"
          >
            <h1 className="font-gilroySemiBold text-lg text-gray-800">
              {property.title}
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              NPR {property.price}
            </p>
            {/* Optional: Show sold details if backend supports it */}
            {/* <p className="text-gray-500 text-sm mt-1">
              Sold to: <span className="font-medium">{property.buyer.name}</span>
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Sold on:{" "}
              <span className="font-medium">
                {format(new Date(property.soldDate), "MMMM d, yyyy")}
              </span>
            </p> */}
          </div>
        ))
      )}
    </div>
  );
};

export default SoldCard;
