import { formatDistanceToNowStrict } from "date-fns";
import { useContext, useState } from "react";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { RiMessage3Line } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import { handleChatNow, handleSaveProperty } from "../../../hooks/propertyActions";
import ChatModal from "./ChatModal";

const PropertyCard = ({ properties = [] }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { userInfo } = useContext(UserContext);
  const userId = userInfo?._id;

  const handleOpenChatModal = async (ownerId) => {
    const chatReady = await handleChatNow(ownerId);
    if (chatReady) {
      setIsChatOpen(true);
    }
  };

  const location = useLocation();
  const gridClasses =
    location.pathname === "/"
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 xl:grid-cols-2 lg:px-8";

  return (
    <div className={`grid gap-x-10 md:gap-y-8 gap-y-5 mt-6 ${gridClasses}`}>
      {properties.map((property) => (
        <div
          key={property?._id}
          className="flex flex-col md:flex-row items-center max-w-96 border rounded-lg p-3 hover:shadow-lg hover:bg-blue-50 hover:bg-opacity-50 hover:border-gray-300 transition-all delay-75"
        >
          {property?.seller?._id !== userId ? (
            <Link to={`/properties/${property?._id}`} className="md:w-44 w-full">
              <img
                src={`/api/uploads/properties/${property?.images[0]}`}
                alt={property.title}
                className="w-full h-40 md:h-44 object-cover rounded-lg hover:scale-105 transition-all delay-75 hover:cursor-pointer"
              />
            </Link>
          ) : (
            <div className="md:w-44 w-full">
              <img
                src={`/api/uploads/properties/${property?.images[0]}`}
                alt={property.title}
                className="w-full h-40 md:h-44 object-cover rounded-lg"
              />
            </div>
          )}
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
            <div className="flex items-center justify-between md:mt-3 mt-1">
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
                    : "bg-purple-200"
                }`}
              >
                {property?.condition}
              </h1>
            </div>
            <div className="flex md:text-xs text-[11px] justify-between border-b md:pb-2 pb-1">
              <h1>{property.seller?.address}</h1>
              <h1>{formatDistanceToNowStrict(new Date(property?.updatedAt))} ago</h1>
            </div>
            <div className="flex mt-3 justify-between text-gray-600">
              <button
                onClick={() => handleSaveProperty(property?._id)}
                disabled={property?.seller?._id === userId}
                className="flex items-center hover:text-yellow-600"
              >
                <MdOutlineBookmarkAdd className="text-xl" />
                <span className="text-sm ml-1">Save Listing</span>
              </button>
              <button
                onClick={() => handleOpenChatModal(property?.seller?._id)}
                disabled={property?.seller?._id === userId}
                className="flex items-center hover:text-green-700"
              >
                <RiMessage3Line className="text-xl" />
                <span className="text-sm ml-1">Chat with Owner</span>
              </button>
            </div>
          </div>
        </div>
      ))}
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default PropertyCard;
