import axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdBookmarkRemove } from "react-icons/md";
import { Link } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";

const SaveListingsCard = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const response = await axios.get("/api/user/get-favorite-properties", {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        });
        setSavedProperties(response.data);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
      }
    };
    fetchSavedProperties();
  }, [userInfo?.token]);

  const handleRemoveSavedProperty = async (propertyId) => {
    try {
      const response = await axios.delete(
        `/api/user/remove-from-favorites/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      setSavedProperties(savedProperties.filter((p) => p._id !== propertyId));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error removing saved property:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-y-8 gap-y-5">
      {savedProperties.map((property) => (
        <div
          key={property?._id}
          className="flex items-center gap-x-2 max-w-96 border rounded-lg p-3 hover:shadow-sm hover:border-gray-300 transition-all delay-75"
        >
          <Link to={`/properties/${property?._id}`}>
            <img
              src={`/api/uploads/properties/${property?.images[0]}`}
              alt={property.title}
              className="rounded-lg lg:w-36 md:w-40 w-32 md:h-44 h-36 object-cover"
            />
          </Link>
          <div className="info-div flex flex-col px-2 py-2 w-full">
            <div className="hover:cursor-pointer">
              <h1 className="font-gilroySemiBold md:text-lg" style={{ lineHeight: "1" }}>
                {property?.title}
              </h1>
              <h1 className="md:text-xs text-[10px] text-gray-600 mt-1" style={{ lineHeight: "1" }}>
                {property.description.length > 50
                  ? `${property?.description.substring(0, 50)}...`
                  : property?.description}
              </h1>
            </div>
            <div className="flex items-center justify-between md:mt-3 mt-11 pr-2">
              <h1 className="font-gilroySemiBold text-gray-700 md:text-lg text-sm">
                NPR {property?.price}
              </h1>
              <h1
                className={`text-[10px] rounded-full px-[6px] py-[2px] bg-opacity-80 ${
                  property.condition === "Furnished"
                    ? "bg-green-200"
                    : property.condition === "Semi-Furnished"
                    ? "bg-yellow-200"
                    : property.condition === "Unfurnished"
                    ? "bg-gray-200"
                    : "bg-blue-200"
                }`}
              >
                {property?.condition}
              </h1>
            </div>
            <div className="flex md:text-xs text-[11px] justify-between border-b md:pb-2 pb-1">
              <h1>{userInfo?.address}</h1>
              <h1 className="pr-1 text-gray-600">
                {formatDistanceToNowStrict(new Date(property?.updatedAt))} ago
              </h1>
            </div>
            <div className="flex justify-between md:mt-3 mt-2 pr-2 text-gray-600">
              <h1></h1>
              <button
                onClick={() => handleRemoveSavedProperty(property._id)}
                className="flex items-center hover:text-red-700"
              >
                <MdBookmarkRemove className="md:text-xl" />
                <h1 className="text-sm">Remove</h1>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SaveListingsCard;
