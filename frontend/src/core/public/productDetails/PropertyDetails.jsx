import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { useContext, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { GoClockFill } from "react-icons/go";
import { MdHomeWork, MdOutlineBookmarkAdd } from "react-icons/md";
import { RiMessage3Line } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../../components/Navbar";
import SimpleMap from "../../../components/SimpleMap";
import ChatModal from "../homePage/ChatModal";

import { UserContext } from "../../../context/UserContext";
import { handleChatNow, handleSaveProperty } from "../../../hooks/propertyActions"; // You can rename this to propertyActions.js
import usePropertyDetails from "../../../hooks/usePropertyDetails"; // New hook

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const { property, loading, error } = usePropertyDetails(propertyId);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const [mainImage, setMainImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  const handleOpenChatModal = async (sellerId) => {
    const chatReady = await handleChatNow(sellerId);
    if (chatReady) {
      setIsChatOpen(true);
    }
  };

  const formatMemberSince = (dateString) => {
    const options = { year: "numeric", month: "short" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        Error loading property details.
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="flex lg:flex-row flex-col lg:items-start md:items-center md:px-8 px-5 lg:mt-3 md:mt-3 pb-6">
        {/* Images */}
        <div className="lg:w-1/3 md:w-1/2">
          <div className="flex justify-center rounded-lg pt-4 md:pb-8 pb-4">
            <img
              src={`/api/uploads/properties/${mainImage || property?.images[0]}`}
              alt="property"
              className="rounded-lg object-cover md:w-80 w-44 md:h-96 h-56"
            />
          </div>
          <div className="flex justify-start gap-3 md:pl-10 pl-16">
            {property?.images.map((image, index) => (
              <img
                key={index}
                src={`/api/uploads/properties/${image}`}
                alt={`Property Image ${index + 1}`}
                className={`rounded-lg object-cover md:w-16 w-10 md:h-16 h-10 cursor-pointer transition-transform ${
                  mainImage === image
                    ? "border-2 border-gray-500 transform scale-105"
                    : "hover:scale-105"
                }`}
                onClick={() => setMainImage(image)}
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:w-2/3 w-full lg:pl-8 lg:pr-2 lg:mt-0 mt-6">
          <h1 className="lg:text-3xl md:text-2xl text-xl font-ppMori text-gray-900">
            {property?.title}
          </h1>
          <h1 className="md:text-xl font-gilroyMedium text-gray-500 mt-1 pl-1">
            रू. {property?.price} / month
          </h1>

          {/* Seller Info */}
          <div className="border-t border-b border-gray-200 py-3 my-3">
            <div className="flex items-center space-x-4">
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/customerprofile/${property?.seller._id}`)}
              >
                <img
                  className="h-12 w-12 rounded-full object-cover shadow"
                  src={
                    property?.seller.avatar
                      ? `/api/uploads/users/${property?.seller.avatar}`
                      : "/api/uploads/users/default_avatar.png"
                  }
                  alt="Seller profile"
                />
              </div>
              <div>
                <h3 className="text-sm text-gray-900">
                  Listed by <b className="font-ppMori">{property?.seller.name}</b>
                </h3>
                <p className="text-xs text-gray-500">
                  Member since: {formatMemberSince(property?.seller.createdAt)} •{" "}
                  {property?.seller.address}
                </p>
              </div>
            </div>
          </div>

          {/* Property Info */}
          <h2 className="text-xl font-gilroySemiBold text-gray-900">Property Details</h2>
          <div className="grid grid-cols-2 md:gap-x-4 gap-x-0 gap-y-3 font-gilroyMedium mt-1">
            <div>
              <p className="text-sm text-gray-500">Condition</p>
              <p className="text-sm font-medium text-gray-900">{property?.condition}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="text-sm font-medium text-gray-900">{property?.category}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 mt-6 lg:pr-14">
            <button
              onClick={() => handleSaveProperty(property?._id)}
              className="rounded-lg shadow-lg flex items-center justify-center w-1/2 bg-black hover:bg-gray-800 text-white py-3"
            >
              <MdOutlineBookmarkAdd className="md:text-xl mr-1" />
              Save
            </button>
            <button
              onClick={() => handleOpenChatModal(property?.seller?._id)}
              className="rounded-lg shadow-lg flex items-center justify-center w-1/2 bg-green-700 hover:bg-green-800 text-white py-3"
            >
              <RiMessage3Line className="md:text-xl mr-1" />
              Chat Now
            </button>
          </div>

          {/* Extra Info */}
          <div className="text-sm mt-3 font-gilroyMedium text-gray-500">
            <span className="flex items-center">
              <GoClockFill />
              <h1 className="pl-1">
                {property?.createdAt
                  ? `Posted ${formatDistanceToNowStrict(parseISO(property.createdAt))} ago`
                  : "Posted just now"}
              </h1>
            </span>
            <span className="flex items-center">
              <MdHomeWork />
              <h1 className="pl-1">
                {property?.availableFrom
                  ? `Available from: ${new Date(property.availableFrom).toDateString()}`
                  : "Contact for availability"}
              </h1>
            </span>
          </div>

          {/* Tabs */}
          <div className="flex border-b mt-4 mb-4">
            <button
              onClick={() => setActiveTab("description")}
              className={`mr-4 pb-2 text-lg font-gilroyMedium ${
                activeTab === "description"
                  ? "text-gray-900 font-gilroySemiBold border-b-2 border-gray-900"
                  : "text-gray-700 border-b-2 border-transparent"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("location")}
              className={`pb-2 text-lg font-gilroyMedium ${
                activeTab === "location"
                  ? "text-gray-900 font-gilroySemiBold border-b-2 border-gray-900"
                  : "text-gray-700 border-b-2 border-transparent"
              }`}
            >
              Location
            </button>
          </div>

          {activeTab === "description" && (
            <div className="p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">{property?.description}</p>
            </div>
          )}

          {activeTab === "location" && (
            <div className="md:p-6 rounded-lg border border-gray-200">
              {property?.seller?.address ? (
                <SimpleMap address={property.seller.address} />
              ) : (
                <div className="relative md:h-48 h-28 rounded-lg overflow-hidden bg-gray-100 flex flex-col items-center justify-center">
                  <FaLocationDot className="text-2xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Location not specified</p>
                </div>
              )}
            </div>
          )}
        </div>

        <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </>
  );
};

export default PropertyDetails;

