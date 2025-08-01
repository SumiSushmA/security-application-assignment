import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../../context/UserContext";
import AddPropertyModal from "./AddPropertyModal";

const PropertyHeroSection = ({ scrollToRecommendSection }) => {
  const { userInfo } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // for image popup

  const openModal = () => {
    if (userInfo) {
      setShowModal(true);
    } else {
      toast.error("Please login to list a property");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleImageClick = (src) => {
    setSelectedImage(src);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-white py-20 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* Left: Text and CTA */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Find Your Perfect Property Here!
          </h1>
          <p className="text-gray-600 text-lg">
            Discover, compare, and connect with dream properties from around the country.
          </p>
          <div className="flex gap-4">
            <button
              onClick={scrollToRecommendSection}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition"
            >
              Explore Now
            </button>
            <button
              onClick={openModal}
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition"
            >
              List Property
            </button>
          </div>
        </div>

        {/* Right: Clickable Images */}
        <div className="grid grid-cols-2 gap-4">
          {["/images/house1.jpg", "/images/house2.jpg", "/images/house3.jpg"].map((src, index) => (
            <img
              key={index}
              src={src}
              onClick={() => handleImageClick(src)}
              className="rounded-xl shadow-md hover:scale-105 transition cursor-pointer"
              alt={`Property ${index + 1}`}
            />
          ))}
          <div className="rounded-xl bg-white shadow-md flex items-center justify-center text-gray-500 font-semibold">
            + More
          </div>
        </div>
      </div>

      {/* Add Property Modal */}
      <AddPropertyModal showModal={showModal} closeModal={closeModal} />

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative max-w-3xl w-full mx-4">
            <img src={selectedImage} alt="Full View" className="w-full rounded-xl shadow-lg" />
            <button
              onClick={handleCloseImage}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-80 px-3 py-1 rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyHeroSection;
